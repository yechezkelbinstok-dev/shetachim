// The land Israel holds beyond its borders, drawn as part of Israel (no line between), with the rest of each place left
// as land outside the map (owner, Oct 7). In Gaza, Lebanon and Syria alike it's what the IDF controls, from the owner's
// own map, data/idf-control.kml (his "IDF Control" Google My Maps export: everything inside any of its areas is under
// IDF control, he deleted anything that isn't; the names and dates don't matter). Its areas overlap and were drawn by
// hand side by side, so they're merged into one, and the gaps between them closed: holes, hairline cracks, and pockets
// whose mouth is under 2·CLOSE_M wide (grown by CLOSE_M, then shrunk back, which leaves the outer edges where they are).
// When he sends a new map: unzip its doc.kml over data/idf-control.kml, then run this and `npm run build`:
//
//   node scripts/held-lines.mjs
//
// Each place's own outline (GADM, as in the build) is cut along it, so the pieces meet that outline and each other
// exactly. Where the map runs along a border, it and GADM draw that border a little differently, which leaves thin
// slivers of the place between Israel and the line, and a pocket of the place can be walled in between the IDF's ground
// and Israel; either would show as grey specks and holes inside Israel. Those (every piece of the rest that isn't its
// main body and touches the held part, up to SLIVER_KM2) go to the held part, as do the map's own holes (above) —
// except a pocket with one of the KEEP places in it (owner, Oct 7: Rmeish and Ain Ebel, the Christian villages walled
// in between the IDF's ground and the border, stay Lebanon; the farmland west of Shamaa, a spot in northern Gaza and
// the other holes are filled).
// One more cut in Lebanon: GADM gives Har Dov (the Shebaa Farms, part of the Golan Heights, held since 1967) to Lebanon,
// so the Golan Heights as Israel holds them come from OpenStreetMap (relation 16119376) and are cut too.
//
// Writes data/shapes/<place>-held.geojson (part of Israel) and <place>-rest.geojson (land outside the map) for gaza,
// lebanon and syria.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mapshaper from 'mapshaper';
import { feature as topoFeature } from 'topojson-client';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = path.join(ROOT, '.cache');
const MAP = path.join(ROOT, 'data', 'idf-control.kml');
const GADM = 'https://raw.githubusercontent.com/stephanietuerk/admin-boundaries/master/hi-res';
const GOLAN = 16119376;
const PLACES = {
  // (Gaza is a region of the GADM file Judea and Samaria comes from: the build's copy of it, `ISRAEL_EXTRA`)
  gaza: { gadm: [null, 'gadm-hi-ISR-judea-samaria.json'], region: 'Gaza' },
  lebanon: { gadm: [`${GADM}/Admin0/gadm36_LBN_0.json`, 'gadm-hi-LBN-0.json'], golan: true },
  syria: { gadm: [`${GADM}/Admin0/gadm36_SYR_0.json`, 'gadm-hi-SYR-0.json'] },
};
const CLOSE_M = 60;
const SLIVER_KM2 = 25;
const KEEP = { Rmeish: [35.3679, 33.0752], 'Ain Ebel': [35.4031, 33.1093] };
const UA = { 'User-Agent': 'shetachim-map (github.com/yechezkelbinstok-dev/shetachim)' };
const fc = (features) => ({ type: 'FeatureCollection', features });
const feature = (geometry, properties = {}) => ({ type: 'Feature', properties, geometry });

async function download(url, name) {
  const file = path.join(CACHE, name);
  if (!fs.existsSync(file) && !url) throw new Error(`run \`npm run build\` once first (it downloads ${name})`);
  if (!fs.existsSync(file)) {
    console.log(`downloading ${url}`);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
    fs.mkdirSync(CACHE, { recursive: true });
    fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  }
  return file;
}

// Every polygon in the owner's map (KML: <Polygon> with an outer ring and maybe inner ones; coordinates "lon,lat[,alt]").
function mapAreas() {
  const kml = fs.readFileSync(MAP, 'utf8');
  const ring = (s) => s.trim().split(/\s+/).map((t) => t.split(',').slice(0, 2).map(Number));
  const polys = [...kml.matchAll(/<Polygon>([\s\S]*?)<\/Polygon>/g)].map(([, p]) => [
    ring(/<outerBoundaryIs>[\s\S]*?<coordinates>([\s\S]*?)<\/coordinates>/.exec(p)[1]),
    ...[...p.matchAll(/<innerBoundaryIs>[\s\S]*?<coordinates>([\s\S]*?)<\/coordinates>/g)].map((m) => ring(m[1])),
  ]);
  if (!polys.length) throw new Error(`no areas in ${MAP}`);
  return polys;
}

// An OpenStreetMap multipolygon relation (outer ways only) as a polygon: its ways joined end to end into rings.
async function relation(id) {
  const r = await fetch(`https://www.openstreetmap.org/api/0.6/relation/${id}/full.json`, { headers: UA });
  if (!r.ok) throw new Error(`OpenStreetMap relation ${id}: ${r.status}`);
  const els = (await r.json()).elements;
  const nodes = new Map(els.filter((e) => e.type === 'node').map((e) => [e.id, [e.lon, e.lat]]));
  const ways = new Map(els.filter((e) => e.type === 'way').map((e) => [e.id, e.nodes]));
  const top = els.find((e) => e.type === 'relation' && e.id === id);
  const open = top.members.filter((m) => m.type === 'way' && m.role !== 'inner').map((m) => ways.get(m.ref).slice()), rings = [];
  while (open.length) {
    let ring = open.shift();
    while (ring[0] !== ring[ring.length - 1]) {
      const end = ring[ring.length - 1], i = open.findIndex((w) => w[0] === end || w[w.length - 1] === end);
      if (i < 0) throw new Error(`relation ${id}: a ring doesn't close (at node ${end})`);
      const w = open.splice(i, 1)[0];
      ring = ring.concat((w[0] === end ? w : w.reverse()).slice(1));
    }
    rings.push([ring.map((n) => nodes.get(n))]);
  }
  const edited = els.reduce((t, e) => (e.timestamp > t ? e.timestamp : t), ''); // (when its newest point moved)
  console.log(`  ${top.tags['name:en'] || top.tags.name}: relation ${id} v${top.version} (${top.timestamp}), last edited ${edited}`);
  return { area: feature({ type: 'MultiPolygon', coordinates: rings }), about: `OpenStreetMap relation ${id} "${top.tags['name:en'] || top.tags.name}" v${top.version} (last edited ${edited})` };
}

const run = async (cmd, input) => JSON.parse((await mapshaper.applyCommands(`${cmd} -o out.json format=geojson geojson-type=FeatureCollection`, structuredClone(input)))['out.json']);
const km2 = async (features) => (await run('-i a.json -dissolve -each "km=this.area/1e6"', { 'a.json': fc(features) })).features[0]?.properties.km || 0;
const inRing = ([x, y], ring) => {
  let c = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};
const inside = (pt, g) => (g.type === 'Polygon' ? [g.coordinates] : g.coordinates).some(([outer, ...holes]) => inRing(pt, outer) && !holes.some((h) => inRing(pt, h)));
const kept = (g) => Object.keys(KEEP).filter((k) => inside(KEEP[k], g));

const polys = mapAreas();
const merged = await run('-i areas.json -dissolve2', { 'areas.json': fc(polys.map((p) => feature({ type: 'Polygon', coordinates: p }))) });
// closed: grown by CLOSE_M and shrunk back (the shrinking leaves a few specks of nothing behind; holes are filled), but
// a kept pocket stays out even where the areas wall it in all round
const closed = await run(`-i idf.json -buffer ${CLOSE_M} -dissolve2 -buffer -${CLOSE_M} -explode -filter "this.area > 1000" -dissolve2`, { 'idf.json': merged });
const keep = (await run('-i closed.json -erase merged.json -explode', { 'closed.json': closed, 'merged.json': merged })).features.filter((f) => kept(f.geometry).length);
const idf = keep.length ? await run('-i closed.json -erase keep.json', { 'closed.json': closed, 'keep.json': fc(keep) }) : closed;
console.log(`  IDF control (${path.relative(ROOT, MAP)}): ${polys.length} areas, ${(await km2(merged.features)).toFixed(1)} km² merged, ${(await km2(idf.features)).toFixed(1)} km² with the gaps closed`);
const golan = await relation(GOLAN);
const fetched = new Date().toISOString();

for (const [place, p] of Object.entries(PLACES)) {
  const src = JSON.parse(fs.readFileSync(await download(...p.gadm), 'utf8')).features.filter((f) => !p.region || f.properties.NAME_1 === p.region);
  if (!src.length) throw new Error(`${place} is missing from its GADM file`);
  const input = { 'place.json': fc(src.map((f) => feature(f.geometry))), 'zones.json': fc([...idf.features, ...(p.golan ? [golan.area] : [])]) };
  const held = await run('-i place.json -clip zones.json -dissolve', input);
  const rest = await run('-i place.json -erase zones.json -dissolve', input);
  // every piece on its own, sharing edges where they meet (TopoJSON arcs)
  const pieces = fc([...held.features.map((f) => feature(f.geometry, { side: 'held' })), ...rest.features.map((f) => feature(f.geometry, { side: 'rest' }))]);
  const topo = JSON.parse((await mapshaper.applyCommands('-i pieces.json -explode -each "km=this.area/1e6" -o out.json format=topojson', { 'pieces.json': pieces }))['out.json']);
  const geoms = Object.values(topo.objects)[0].geometries;
  const arcsOf = (g) => new Set((g.type === 'Polygon' ? g.arcs : g.arcs.flat()).flat().map((a) => (a < 0 ? ~a : a)));
  const heldArcs = new Set(geoms.filter((g) => g.properties.side === 'held').flatMap((g) => [...arcsOf(g)]));
  const main = geoms.filter((g) => g.properties.side === 'rest').reduce((a, g) => (!a || g.properties.km > a.properties.km ? g : a), null);
  const pockets = geoms.filter((g) => g.properties.side === 'rest' && g !== main && [...arcsOf(g)].some((a) => heldArcs.has(a)));
  const slivers = pockets.filter((g) => g.properties.km < SLIVER_KM2 && !kept(topoFeature(topo, g).geometry).length);
  for (const g of slivers) g.properties.side = 'held';
  const stays = pockets.filter((g) => !slivers.includes(g)).map((g) => {
    const k = kept(topoFeature(topo, g).geometry);
    console.log(`  (${place}: a pocket of ${g.properties.km.toFixed(1)} km² stays out: ${k.length ? k.join(', ') : `over ${SLIVER_KM2} km², look at it`})`);
    return `${k.join(', ') || 'a pocket'} (${g.properties.km.toFixed(1)} km²)`;
  });
  const out = await run('-i pieces.json -dissolve side', { 'pieces.json': topo });
  const side = (s) => fc(out.features.filter((f) => f.properties.side === s).map((f) => feature(f.geometry, null)));
  const [h, r] = [await km2(side('held').features), await km2(side('rest').features)];
  const small = slivers.reduce((s, g) => s + g.properties.km, 0);
  console.log(`${place}: ${h.toFixed(1)} km² held (${((100 * h) / (h + r)).toFixed(1)}%), ${r.toFixed(1)} km² the rest; ` +
    `${slivers.length} slivers and pockets given to the held part (${small.toFixed(2)} km²${slivers.length ? `, the largest ${Math.max(...slivers.map((g) => g.properties.km)).toFixed(2)}` : ''})`);
  const meta = {
    source: `The owner's IDF control map (${path.relative(ROOT, MAP)}, ${polys.length} areas merged, gaps under ${2 * CLOSE_M} m closed)${p.golan ? `; ${golan.about}, for Har Dov` : ''}`,
    fetched,
    cleaned: `${slivers.length} slivers and walled-in pockets of the rest (${small.toFixed(2)} km² in all) given to the held part` +
      (stays.length ? `; walled in but left out: ${stays.join('; ')}` : ''),
  };
  for (const s of ['held', 'rest']) fs.writeFileSync(path.join(ROOT, 'data', 'shapes', `${place}-${s}.geojson`), JSON.stringify({ ...side(s), properties: meta }));
}
console.log(`wrote data/shapes/{${Object.keys(PLACES).join(',')}}-{held,rest}.geojson`);
