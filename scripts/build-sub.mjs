// Sub-shetachim (data/sub-shetachim.json) into web/data/sub.json. Each is drawn with borders of its own (owner, Nov 1:
// "why are you using county situations you should be drawing your own borders"): round its member houses, joining
// those near one another, and no further out, never a county's or a state's line across empty land. A region's members
// are listed (members), or are its parent shetach's houses within given areas (membersIn: US counties, L.A. County
// neighbourhoods, county subdivisions, or a distance round a point), less any excluded; mushrooms never count. Whole
// areas of the map (areas: the Baja peninsula) go in as they are. Then it's cut to the parent shetach's land (its own
// coast) and split by state, so a view draws only its own countries' parts. Run after scripts/build-data.mjs, which
// makes geo.json, the centers and the counties (npm run build runs both).
import fs from 'node:fs';
import path from 'node:path';
import * as topojson from 'topojson-client';
import polygonClipping from 'polygon-clipping';
import { contours } from 'd3-contour';
import simplify from 'simplify-js';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const CACHE = path.join(ROOT, '.cache');
const readJSON = (...p) => JSON.parse(fs.readFileSync(path.join(...p), 'utf8'));
const LA_HOODS = 'https://s3-us-west-2.amazonaws.com/boundaries.latimes.com/archive/1.0/boundary-set/la-county-neighborhoods-v6.geojson';
const CCD_URL = (fips) => `https://raw.githubusercontent.com/uscensusbureau/citysdk/master/v2/GeoJSON/500k/2022/${fips}/county-subdivision.json`;
// How far a region reaches round each house (km), and how far apart its parts may be and still be drawn as one (a gap
// up to twice JOIN is filled): a metro's suburbs join, a town an hour away stays a part of its own. CELL: the grid it's
// worked out on (km).
const REACH = 3, JOIN = 6, CELL = 0.25;

const data = readJSON(ROOT, 'data', 'sub-shetachim.json');
// (the counties with the build's fixes; the newest, if there are several)
const countyFile = fs.readdirSync(CACHE).filter((f) => /^us-counties-\w+\.geojson$/.test(f))
  .map((f) => path.join(CACHE, f)).sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0];
if (!countyFile) throw new Error('no .cache/us-counties-*.geojson: run npm run build first');
const counties = new Map(readJSON(countyFile).features.map((f) => [f.properties.GEOID, f.geometry]));
const topo = readJSON(ROOT, 'web', 'data', 'geo.json');
const pieces = topo.objects.areas.geometries;
// every center's spot and shetach (web/data/centers.geojson: a dot is one spot, with the centers there)
const dots = readJSON(ROOT, 'web', 'data', 'centers.geojson').features.map((f) => ({
  lon: f.geometry.coordinates[0], lat: f.geometry.coordinates[1], shetach: (f.properties.piece || '').split(':')[1] || '', centers: f.properties.centers,
}));

async function cachedJSON(file, url) {
  const at = path.join(CACHE, file);
  if (!fs.existsSync(at)) {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`${url}: ${r.status}`);
    fs.writeFileSync(at, Buffer.from(await r.arrayBuffer()));
  }
  return readJSON(at);
}

// a geometry as polygon-clipping's list of polygons
const polys = (g) => (g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : []);
const inRing = (x, y, r) => { let c = false; for (let i = 0, j = r.length - 1; i < r.length; j = i++) { const a = r[i], b = r[j]; if ((a[1] > y) !== (b[1] > y) && x < ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1]) + a[0]) c = !c; } return c; };
const inPolys = (x, y, ps) => ps.some((p) => inRing(x, y, p[0]) && !p.slice(1).some((h) => inRing(x, y, h)));

// The areas a region's members are picked from (membersIn), as polygons
async function memberAreas(s) {
  const out = [];
  for (const t of s.membersIn || []) {
    if (t.counties) for (const id of t.counties) {
      if (!counties.has(id)) throw new Error(`${s.id}: no county ${id}`);
      out.push(...polys(counties.get(id)));
    }
    if (t.ccds) {
      const fips = t.ccds.county.slice(0, 2), cfp = t.ccds.county.slice(2);
      const all = (await cachedJSON(`county-subdivision-${fips}.json`, CCD_URL(fips))).features;
      const picked = all.filter((f) => f.properties.COUNTYFP === cfp && t.ccds.names.includes(f.properties.NAME));
      const missing = t.ccds.names.filter((n) => !picked.some((f) => f.properties.NAME === n));
      if (missing.length) throw new Error(`${s.id}: no county subdivision ${missing.join(', ')} in ${t.ccds.county}`);
      for (const f of picked) out.push(...polys(f.geometry));
    }
    if (t.laRegions || t.laHoods) {
      const all = (await cachedJSON('la-county-neighborhoods-v6.geojson', LA_HOODS)).features;
      const picked = all.filter((f) => (t.laRegions || []).includes(f.properties.metadata.region) || (t.laHoods || []).includes(f.properties.name));
      const missing = (t.laHoods || []).filter((n) => !picked.some((f) => f.properties.name === n));
      if (missing.length || !picked.length) throw new Error(`${s.id}: no L.A. neighbourhood ${missing.join(', ') || t.laRegions}`);
      for (const f of picked) out.push(...polys(f.geometry));
    }
    if (t.box) { // { box: [west, south, east, north], county?: GEOID }: a box, or the part of a county in it
      const [w, so, e, n] = t.box, r = [[[w, so], [e, so], [e, n], [w, n], [w, so]]];
      if (t.county && !counties.has(t.county)) throw new Error(`${s.id}: no county ${t.county}`);
      out.push(...(t.county ? polygonClipping.intersection(polys(counties.get(t.county)), r) : [r]));
    }
    if (t.near) { // { near: [lon, lat], km }: a circle, as a polygon
      const [lon, lat] = t.near, k = 111.32 * Math.cos((lat * Math.PI) / 180), ring = [];
      for (let i = 0; i <= 72; i++) { const a = (i / 72) * 2 * Math.PI; ring.push([lon + (t.km * Math.cos(a)) / k, lat + (t.km * Math.sin(a)) / 110.57]); }
      out.push([ring]);
    }
  }
  return out;
}

// Exact Euclidean distance transform (Felzenszwalb & Huttenlocher): each cell's distance, in cells, to the nearest cell
// outside the mask; a row or a column at a time, on squared distances
const INF = 1e20;
function edt1(f, n, d, v, z) {
  let k = 0;
  v[0] = 0; z[0] = -INF; z[1] = INF;
  for (let q = 1; q < n; q++) {
    let s = ((f[q] + q * q) - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    while (s <= z[k]) { k--; s = ((f[q] + q * q) - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]); }
    k++; v[k] = q; z[k] = s; z[k + 1] = INF;
  }
  for (let q = 0, j = 0; q < n; q++) {
    while (z[j + 1] < q) j++;
    d[q] = (q - v[j]) * (q - v[j]) + f[v[j]];
  }
}
function edt(mask, nx, ny) {
  const g = new Float64Array(nx * ny);
  for (let i = 0; i < g.length; i++) g[i] = mask[i] ? INF : 0;
  const n = Math.max(nx, ny), f = new Float64Array(n), d = new Float64Array(n), v = new Int32Array(n), z = new Float64Array(n + 1);
  for (let x = 0; x < nx; x++) {
    for (let y = 0; y < ny; y++) f[y] = g[y * nx + x];
    edt1(f, ny, d, v, z);
    for (let y = 0; y < ny; y++) g[y * nx + x] = d[y];
  }
  for (let y = 0; y < ny; y++) {
    for (let x = 0; x < nx; x++) f[x] = g[y * nx + x];
    edt1(f, nx, d, v, z);
    for (let x = 0; x < nx; x++) g[y * nx + x] = Math.sqrt(d[x]);
  }
  return g;
}

// The region round its houses: a disc of reach round each, and between those near enough the gap filled (a
// morphological closing by join), traced smoothly and simplified a little; in lon/lat, as polygons
function drawRound(seeds, reach, join) {
  const lat0 = seeds.reduce((a, p) => a + p[1], 0) / seeds.length, lon0 = seeds.reduce((a, p) => a + p[0], 0) / seeds.length;
  const kx = 111.32 * Math.cos((lat0 * Math.PI) / 180), ky = 110.57;
  const km = seeds.map(([lon, lat]) => [(lon - lon0) * kx, (lat - lat0) * ky]);
  const pad = reach + join + 3;
  const x0 = Math.min(...km.map((p) => p[0])) - pad, y0 = Math.min(...km.map((p) => p[1])) - pad;
  const x1 = Math.max(...km.map((p) => p[0])) + pad, y1 = Math.max(...km.map((p) => p[1])) + pad;
  const cell = Math.max(CELL, Math.max(x1 - x0, y1 - y0) / 1600);
  const nx = Math.ceil((x1 - x0) / cell) + 1, ny = Math.ceil((y1 - y0) / cell) + 1;
  // dilated by reach + join: every cell that close to a house
  const big = new Uint8Array(nx * ny), r = (reach + join) / cell;
  for (const [x, y] of km) {
    const cx = (x - x0) / cell, cy = (y - y0) / cell;
    for (let j = Math.max(0, Math.floor(cy - r)); j <= Math.min(ny - 1, Math.ceil(cy + r)); j++) {
      for (let i = Math.max(0, Math.floor(cx - r)); i <= Math.min(nx - 1, Math.ceil(cx + r)); i++) {
        if ((i - cx) ** 2 + (j - cy) ** 2 <= r * r) big[j * nx + i] = 1;
      }
    }
  }
  // eroded by join again: how far each cell is inside, less join (> 0: in the region)
  const inside = edt(big, nx, ny), field = new Array(nx * ny);
  for (let k = 0; k < field.length; k++) field[k] = inside[k] * cell - join;
  const geo = contours().size([nx, ny]).thresholds([0])(field)[0];
  const toLL = ([x, y]) => [lon0 + x / kx, lat0 + y / ky];
  return (geo ? geo.coordinates : []).map((poly) => poly.map((ring) => {
    const kmRing = simplify(ring.map(([i, j]) => ({ x: x0 + i * cell, y: y0 + j * cell })), 0.12, true).map((p) => [p.x, p.y]);
    const out = kmRing.map(toLL);
    if (out.length && (out[0][0] !== out[out.length - 1][0] || out[0][1] !== out[out.length - 1][1])) out.push(out[0]);
    return out;
  }).filter((ring) => ring.length >= 4)).filter((poly) => poly.length);
}

const round = (v) => Math.round(v * 1e5) / 1e5;
const signed = (r) => { let a = 0; for (let i = 0; i < r.length - 1; i++) a += r[i][0] * r[i + 1][1] - r[i + 1][0] * r[i][1]; return a / 2; };
const ringArea = (r) => Math.abs(signed(r));
// rounded, wound d3's way (the outer ring clockwise, holes the other way; the page's projection would take a ring the
// wrong way round for all the world but it), and without slivers: holes under 0.0005 square degrees (5 km² or so), bits
// under 0.00002 (a fifth of a km²) — where two lines don't quite meet (a state line, a county line, a ridge)
function tidy(mp) {
  const out = [];
  for (const poly of mp) {
    const rings = [];
    for (const ring of poly) {
      const r = [];
      for (const [x, y] of ring) { const p = [round(x), round(y)]; const q = r[r.length - 1]; if (!q || q[0] !== p[0] || q[1] !== p[1]) r.push(p); }
      if (r.length >= 4 && (rings.length ? ringArea(r) >= 5e-4 : ringArea(r) >= 2e-5)) {
        if ((signed(r) < 0) !== !rings.length) r.reverse();
        rings.push(r);
      } else if (!rings.length) break;
    }
    if (rings.length) out.push(rings);
  }
  return out;
}
const box = (mp) => { let a = Infinity, b = Infinity, c = -Infinity, d = -Infinity; for (const p of mp) for (const [x, y] of p[0]) { a = Math.min(a, x); b = Math.min(b, y); c = Math.max(c, x); d = Math.max(d, y); } return [a, b, c, d]; };
const rect = ([a, b, c, d], m = 0.5) => [[[a - m, b - m], [c + m, b - m], [c + m, d + m], [a - m, d + m], [a - m, b - m]]];

const features = [];
for (const s of data.subShetachim) {
  // its shetach's pieces, and whole areas of them it has (the Baja peninsula)
  const own = pieces.filter((g) => g.properties.shetach === s.parent);
  if (!own.length) throw new Error(`${s.id}: no shetach ${s.parent}`);
  const whole = (s.areas || []).map((st) => {
    const gs = own.filter((g) => g.properties.state === st);
    if (!gs.length) throw new Error(`${s.id}: no area ${st} in ${s.parent}`);
    return polys(topojson.merge(topo, gs));
  });
  // its members: listed, or its shetach's houses in its areas (those whole areas too); never a mushroom
  const areas = await memberAreas(s), listed = new Set(s.members || []), out = new Set(s.exclude || []);
  const zone = [...areas, ...whole.flat()];
  const isMember = (c, d) => !c.mushroom && !out.has(c.id) && (listed.has(c.id) || (d.shetach === s.parent && zone.length > 0 && inPolys(d.lon, d.lat, zone)));
  const memberDots = dots.filter((d) => d.centers.some((c) => isMember(c, d)));
  const missing = [...listed].filter((id) => !dots.some((d) => d.centers.some((c) => c.id === id)));
  if (missing.length) throw new Error(`${s.id}: no center ${missing.join(', ')}`);
  let shape = memberDots.length ? drawRound(memberDots.map((d) => [d.lon, d.lat]), s.reach ?? REACH, s.join ?? JOIN) : [];
  // kept within the areas its members come from, where it has them: round its houses, but not over the ridge into the
  // next valley or across a state line (the Valley stops at the Santa Monica Mountains, Northern Nevada at California)
  if (areas.length && shape.length) shape = polygonClipping.intersection(shape, polygonClipping.union(...areas.map((p) => [p])));
  const all = whole.length ? polygonClipping.union(shape, ...whole) : shape;
  if (!all.length) throw new Error(`${s.id}: no members`);
  const near = rect(box(all));
  let parts = 0;
  for (const st of [...new Set(own.map((g) => g.properties.state))]) {
    const land = polygonClipping.intersection(polys(topojson.merge(topo, own.filter((g) => g.properties.state === st))), near);
    if (!land.length) continue;
    const part = tidy(polygonClipping.intersection(all, land));
    if (!part.length || part.reduce((a, p) => a + ringArea(p[0]), 0) < 1e-4) continue; // (a sliver over a state line)
    features.push({ type: 'Feature', geometry: { type: 'MultiPolygon', coordinates: part },
      properties: { id: s.id, state: st, parent: s.parent, name: s.name, nameHe: s.nameHe, head: s.head, headHe: s.headHe, capital: s.capital } });
    parts++;
  }
  // (the shetach's other houses that fall inside it, to look at: in the region but not its members)
  const drawn = features.filter((f) => f.properties.id === s.id).flatMap((f) => f.geometry.coordinates);
  const strays = dots.filter((d) => d.shetach === s.parent && inPolys(d.lon, d.lat, drawn))
    .flatMap((d) => d.centers.filter((c) => !c.mushroom && !isMember(c, d)).map((c) => `${c.name} (${c.city || ''}, ${c.id})`));
  console.log(`${s.id}: ${memberDots.length} spots, ${parts} part${parts === 1 ? '' : 's'}${strays.length ? `; inside but not members: ${strays.join('; ')}` : ''}`);
}
const outFile = path.join(ROOT, 'web', 'data', 'sub.json');
fs.writeFileSync(outFile, JSON.stringify({ type: 'FeatureCollection', features }));
console.log(`web/data/sub.json: ${data.subShetachim.length} sub-shetachim, ${features.length} parts, ${(fs.statSync(outFile).size / 1024).toFixed(0)} KB`);
