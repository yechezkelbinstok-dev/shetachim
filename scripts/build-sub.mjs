// Sub-shetachim (data/sub-shetachim.json) into web/data/sub.json: each regional director's area as one shape, made of
// US counties (the build's own Census counties, so it meets the map's coast and borders), whole areas of the map (from
// web/data/geo.json) and L.A. County's neighbourhoods (the L.A. Times' Mapping L.A., v6), those cut to the county's
// Census outline. Run after scripts/build-data.mjs, which makes the counties and geo.json (npm run build runs both).
import fs from 'node:fs';
import path from 'node:path';
import * as topojson from 'topojson-client';
import polygonClipping from 'polygon-clipping';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const CACHE = path.join(ROOT, '.cache');
const readJSON = (...p) => JSON.parse(fs.readFileSync(path.join(...p), 'utf8'));
const LA_HOODS = 'https://s3-us-west-2.amazonaws.com/boundaries.latimes.com/archive/1.0/boundary-set/la-county-neighborhoods-v6.geojson';

const data = readJSON(ROOT, 'data', 'sub-shetachim.json');
// (the counties with the build's fixes; the newest, if there are several)
const countyFile = fs.readdirSync(CACHE).filter((f) => /^us-counties-\w+\.geojson$/.test(f))
  .map((f) => path.join(CACHE, f)).sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0];
if (!countyFile) throw new Error('no .cache/us-counties-*.geojson: run npm run build first');
const countyFeatures = readJSON(countyFile).features;
const counties = new Map(countyFeatures.map((f) => [f.properties.GEOID, f.geometry]));
const countyState = new Map(countyFeatures.map((f) => [f.properties.GEOID, `US-${f.properties.STUSPS}`]));
const topo = readJSON(ROOT, 'web', 'data', 'geo.json');
const areaPieces = topo.objects.areas.geometries;

let hoods = null;
async function laHoods() {
  if (hoods) return hoods;
  const file = path.join(CACHE, 'la-county-neighborhoods-v6.geojson');
  if (!fs.existsSync(file)) {
    const r = await fetch(LA_HOODS);
    if (!r.ok) throw new Error(`L.A. Times neighbourhoods: ${r.status}`);
    fs.writeFileSync(file, Buffer.from(await r.arrayBuffer()));
  }
  hoods = readJSON(file).features;
  return hoods;
}

// a geometry as polygon-clipping's list of polygons
const polys = (g) => (g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : []);
const round = (v) => Math.round(v * 1e5) / 1e5;
const signed = (r) => { let a = 0; for (let i = 0; i < r.length - 1; i++) a += r[i][0] * r[i + 1][1] - r[i + 1][0] * r[i][1]; return a / 2; };
const ringArea = (r) => Math.abs(signed(r));
// rounded; and without the slivers where two sources' lines don't quite meet (the US–Mexico border, the L.A.–Ventura
// county line): holes under 0.001 square degrees (10 km² or so; no real enclave), bits under a millionth
function tidy(mp) {
  const out = [];
  for (const poly of mp) {
    const rings = [];
    for (const ring of poly) {
      const r = [];
      for (const [x, y] of ring) { const p = [round(x), round(y)]; const q = r[r.length - 1]; if (!q || q[0] !== p[0] || q[1] !== p[1]) r.push(p); }
      if (r.length >= 4 && (rings.length ? ringArea(r) >= 1e-3 : ringArea(r) >= 1e-6)) {
        // (wound as the map's own areas are, d3's way: the outer ring clockwise, holes the other way; the page's
        // projection would take a ring the wrong way round for all the world but it)
        if ((signed(r) < 0) !== !rings.length) r.reverse();
        rings.push(r);
      }
      else if (!rings.length) break; // (the outer ring gone: the bit is a sliver)
    }
    if (rings.length) out.push(rings);
  }
  return out;
}

// One feature a sub-shetach and state (US-CA, MX-BCN...): a view shows only the parts in its own countries (the USA
// view has San Diego without Baja), as it does the shetachim.
const features = [];
for (const s of data.subShetachim) {
  const parts = new Map(); // state → its pieces
  const put = (state, g) => { if (!parts.has(state)) parts.set(state, []); parts.get(state).push(g); };
  for (const t of s.territory) {
    if (t.counties) for (const id of t.counties) {
      const g = counties.get(id);
      if (!g) throw new Error(`${s.id}: no county ${id}`);
      put(countyState.get(id), polys(g));
    }
    if (t.area) {
      const gs = areaPieces.filter((g) => g.properties.state === t.area);
      if (!gs.length) throw new Error(`${s.id}: no area ${t.area} in geo.json`);
      put(t.area, polys(topojson.merge(topo, gs)));
    }
    if (t.laRegions || t.laHoods) {
      const picked = (await laHoods()).filter((f) => (t.laRegions || []).includes(f.properties.metadata.region) || (t.laHoods || []).includes(f.properties.name));
      const missing = (t.laHoods || []).filter((n) => !picked.some((f) => f.properties.name === n));
      if (missing.length || !picked.length) throw new Error(`${s.id}: no L.A. neighbourhood ${missing.join(', ') || t.laRegions}`);
      // (cut to L.A. County's Census outline: the same coast as the map's, and no overlap with Ventura County)
      const union = polygonClipping.union(...picked.map((f) => polys(f.geometry)));
      put('US-CA', polygonClipping.intersection(union, polys(counties.get('06037'))));
    }
  }
  for (const [state, gs] of parts) {
    const shape = tidy(polygonClipping.union(...gs));
    features.push({ type: 'Feature', geometry: { type: 'MultiPolygon', coordinates: shape },
      properties: { id: s.id, state, parent: s.parent, name: s.name, nameHe: s.nameHe, head: s.head, headHe: s.headHe, capital: s.capital } });
    const points = shape.reduce((n, p) => n + p.reduce((m, r) => m + r.length, 0), 0);
    console.log(`${s.id}, ${state}: ${shape.length} polygon${shape.length === 1 ? '' : 's'}, ${points} points`);
  }
}
const out = path.join(ROOT, 'web', 'data', 'sub.json');
fs.writeFileSync(out, JSON.stringify({ type: 'FeatureCollection', features }));
console.log(`web/data/sub.json: ${data.subShetachim.length} sub-shetachim, ${features.length} parts, ${(fs.statSync(out).size / 1024).toFixed(0)} KB`);
