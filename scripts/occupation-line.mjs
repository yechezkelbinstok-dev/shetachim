// The parts of Ukraine Russia holds, along the current line: drawn as part of Berel Lazar's Russia shetach (owner, Oct 7:
// the Chabad centers there, Donetsk, Lugansk, Mariupol, Crimea and the rest, now work under him; "use the current
// occupation line and put all centers behind it into the Russian shetach"). Crimea is part of it, so it's no longer a
// shetach of its own.
// Source: DeepStateMap (deepstatemap.live), which publishes its map of the front, updated daily, as GeoJSON. Its areas
// held by Russia: "occupied" (since 2022), the parts of the Donetsk and Lugansk regions held since 2014, Crimea and Tuzla
// Island; its "unknown status" ground (the grey zone) is left with Ukraine. Run again when the line moves, then
// `npm run build`:
//
//   node scripts/occupation-line.mjs
//
// Writes data/shapes/ukraine-occupied.geojson, which the Russia shetach claims ({ "state": "UKR", "shape": ... }): the
// build cuts Ukraine's own outline along it, so only the line through Ukraine comes from it.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mapshaper from 'mapshaper';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'data', 'shapes', 'ukraine-occupied.geojson');
const HELD = ['geoJSON.status.occupied', 'geoJSON.territories.ordlo', 'geoJSON.territories.crimea', 'geoJSON.territories.tuzla'];

const r = await fetch('https://deepstatemap.live/api/history/last', { headers: { 'User-Agent': 'shetachim-map (github.com/yechezkelbinstok-dev/shetachim)' } });
if (!r.ok) throw new Error(`DeepStateMap: HTTP ${r.status}`);
const { id, map } = await r.json();
const flat = (rings) => rings.map((ring) => ring.map(([x, y]) => [x, y])); // (its points carry a height, always 0)
const areas = map.features.filter((f) => /Polygon/.test(f.geometry?.type) && HELD.some((k) => (f.properties.name || '').includes(k)))
  .map((f) => ({ type: 'Feature', properties: {}, geometry: f.geometry.type === 'Polygon' ? { type: 'Polygon', coordinates: flat(f.geometry.coordinates) } : { type: 'MultiPolygon', coordinates: f.geometry.coordinates.map(flat) } }));
if (!areas.length) throw new Error('DeepStateMap: no occupied areas in the map (has its format changed?)');
// (its areas are drawn side by side: merged into one, the hairline gaps left between them filled, specks dropped)
const held = JSON.parse((await mapshaper.applyCommands('-i areas.json -dissolve2 gap-fill-area=1km2 -explode -filter "this.area > 1e5" -dissolve2 ' +
  '-each "km=this.area/1e6" -o out.json format=geojson geojson-type=FeatureCollection', { 'areas.json': { type: 'FeatureCollection', features: areas } }))['out.json']);
const when = new Date(id * 1000).toISOString(); // (the map's id is the time it was published)
console.log(`DeepStateMap ${when}: ${areas.length} areas held by Russia, ${held.features[0].properties.km.toFixed(0)} km² in all`);

// The map's areas and Ukraine's own outline (GADM's, as the build draws it) don't meet exactly: left alone, the bits of
// Ukraine between them stayed Ukraine's, outlined specks deep in held land (190 km² in the Lugansk region's far
// northeast, along the international border; one on the Azov coast; the owner, Oct 8: "what the hell is going on here").
// So every bit of Ukraine beyond the line that the held land cuts off from the rest of Ukraine (it touches the held land
// and isn't the main, Ukrainian-held part) is held too. Islands off the coast that touch nothing held stay as they are.
const UKR = path.join(ROOT, '.cache', 'gadm-hi-UKR-0.json');
if (!fs.existsSync(UKR)) throw new Error('no .cache/gadm-hi-UKR-0.json: run `npm run build` once first (it downloads Ukraine\'s outline)');
const parts = JSON.parse((await mapshaper.applyCommands(
  '-i held.json ukr.json combine-files -erase held target=ukr + name=rest -explode target=rest -each "pid=this.id, km=this.area/1e6" target=rest ' +
  '-buffer 100 target=held + name=near -clip near target=rest + name=touch -each "km2=this.area/1e6" target=touch ' +
  '-merge-layers target=rest,touch force name=all -o all.json format=geojson geojson-type=FeatureCollection',
  { 'held.json': held, 'ukr.json': JSON.parse(fs.readFileSync(UKR, 'utf8')) }))['all.json']).features;
const rest = parts.filter((f) => f.properties.km2 == null), touching = new Set(parts.filter((f) => f.properties.km2 > 0.01).map((f) => f.properties.pid));
const main = rest.reduce((a, b) => (b.properties.km > a.properties.km ? b : a));
const cutOff = rest.filter((f) => f !== main && touching.has(f.properties.pid));
if (cutOff.length) {
  console.log(`  ${cutOff.length} bits of Ukraine cut off behind the line, given to the held land: ${cutOff.map((f) => `${f.properties.km.toFixed(1)} km²`).join(', ')}`);
  const merged = JSON.parse((await mapshaper.applyCommands('-i held.json cut.json combine-files -merge-layers force -dissolve2 gap-fill-area=1km2 ' +
    '-each "km=this.area/1e6" -o out.json format=geojson geojson-type=FeatureCollection',
    { 'held.json': held, 'cut.json': { type: 'FeatureCollection', features: cutOff.map((f) => ({ type: 'Feature', properties: {}, geometry: f.geometry })) } }))['out.json']);
  held.features = merged.features;
}
fs.writeFileSync(OUT, JSON.stringify({
  type: 'FeatureCollection',
  features: held.features.map((f) => ({ type: 'Feature', properties: null, geometry: f.geometry })),
  properties: { source: `DeepStateMap (deepstatemap.live), the map of ${when} (id ${id}): its occupied areas, the parts of the Donetsk and Lugansk regions held since 2014, Crimea and Tuzla`, fetched: new Date().toISOString() },
}));
console.log(`wrote ${path.relative(ROOT, OUT)}`);
