// Gaza along the line Israel actually holds (owner, Oct 7: "the yellow line as it ended up, not the original one").
// OpenStreetMap keeps that line as two areas, edited as it moves (source: IDF maps): "Yellow Line" (way 1313327399,
// the zone east of the October 2025 line, as moved since) and "Orange Line" (way 1541663246, the strip added from
// late April 2026). Their union, cut to Gaza's land, is the part of Gaza drawn as Israel; the rest stays land outside
// the map. Run again when the line moves, then `npm run build`:
//
//   node scripts/gaza-line.mjs
//
// Writes data/shapes/gaza-held.geojson (the part Israel holds) and data/shapes/gaza-rest.geojson (the rest), both cut
// from the build's own Gaza outline so they meet it and each other exactly.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mapshaper from 'mapshaper';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WAYS = { 'Yellow Line': 1313327399, 'Orange Line': 1541663246 };
const GADM_CACHE = path.join(ROOT, '.cache', 'gadm-hi-ISR-judea-samaria.json'); // (the build's cache of that GADM file)

async function way(id) {
  const r = await fetch(`https://www.openstreetmap.org/api/0.6/way/${id}/full.json`, { headers: { 'User-Agent': 'shetachim-map (github.com/yechezkelbinstok-dev/shetachim)' } });
  if (!r.ok) throw new Error(`OpenStreetMap way ${id}: ${r.status}`);
  const els = (await r.json()).elements;
  const nodes = new Map(els.filter((e) => e.type === 'node').map((e) => [e.id, [e.lon, e.lat]]));
  const w = els.find((e) => e.type === 'way');
  if (w.nodes[0] !== w.nodes[w.nodes.length - 1]) throw new Error(`way ${id} isn't a closed area`);
  console.log(`  ${w.tags.name}: version ${w.version}, ${w.timestamp}, ${w.nodes.length} points`);
  return { type: 'Feature', properties: { name: w.tags.name, version: w.version, timestamp: w.timestamp }, geometry: { type: 'Polygon', coordinates: [w.nodes.map((n) => nodes.get(n))] } };
}

const zones = [];
for (const [name, id] of Object.entries(WAYS)) zones.push(await way(id));
if (!fs.existsSync(GADM_CACHE)) throw new Error('run `npm run build` once first (it downloads the GADM file Gaza comes from)');
const gaza = JSON.parse(fs.readFileSync(GADM_CACHE, 'utf8')).features.filter((f) => f.properties.NAME_1 === 'Gaza');
if (!gaza.length) throw new Error('Gaza is missing from the GADM file');
const input = {
  'gaza.json': { type: 'FeatureCollection', features: gaza.map((f) => ({ type: 'Feature', properties: {}, geometry: f.geometry })) },
  'zones.json': { type: 'FeatureCollection', features: zones },
};
const run = async (cmd) => JSON.parse((await mapshaper.applyCommands(cmd, structuredClone(input)))['out.json']); // (mapshaper uses up its input)
const held = await run('-i gaza.json -clip zones.json -dissolve -o out.json format=geojson geojson-type=FeatureCollection');
const rest = await run('-i gaza.json -erase zones.json -dissolve -o out.json format=geojson geojson-type=FeatureCollection');
const km2 = async (fc) => JSON.parse((await mapshaper.applyCommands('-i a.json -dissolve -each "km=this.area/1e6" -o out.json format=geojson', { 'a.json': fc }))['out.json']).features[0]?.properties.km || 0;
const [h, r] = [await km2(held), await km2(rest)];
console.log(`Gaza: ${h.toFixed(1)} km² held (${((100 * h) / (h + r)).toFixed(0)}%), ${r.toFixed(1)} km² the rest`);
const meta = { source: 'OpenStreetMap ways ' + zones.map((z) => `"${z.properties.name}" v${z.properties.version} (${z.properties.timestamp})`).join(', '), fetched: new Date().toISOString() };
for (const [file, fc] of [['gaza-held', held], ['gaza-rest', rest]]) {
  fs.writeFileSync(path.join(ROOT, 'data', 'shapes', `${file}.geojson`), JSON.stringify({ ...fc, properties: meta }));
}
console.log('wrote data/shapes/gaza-held.geojson and gaza-rest.geojson');
