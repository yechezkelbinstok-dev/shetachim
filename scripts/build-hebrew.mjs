// The Hebrew names for the site and the SVG maps: web/data/he.json, from the hand-written lists in data/hebrew/
// (shetachim and their head shluchim, states and countries, cities). Run after `npm run build`:
//
//   node scripts/build-hebrew.mjs
//
// Every shetach, area and city on the map must have a Hebrew name; the script stops and lists any that don't.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (...p) => JSON.parse(fs.readFileSync(path.join(ROOT, ...p), 'utf8'));
const he = read('data', 'hebrew', 'shetachim.json');
const areas = read('data', 'hebrew', 'areas.json');
const cityNames = read('data', 'hebrew', 'cities.json');
const { shetachim } = read('web', 'data', 'shetachim.json');
const geo = read('web', 'data', 'geo.json');
const world = read('data', 'world-all.json');
const cities = read('web', 'data', 'cities.json');

const missing = [];
const out = { shetachim: {}, areas: {}, cities: {} };
for (const s of shetachim) {
  const h = he[s.id];
  if (!h) { missing.push(`shetach ${s.id}`); continue; }
  // The last name, for the page's "Last name" labels: the Hebrew name less as many first names as the English one has
  // ("Berel Shemtov" → "שם טוב"); a family's name without "משפחת"; leadership entries whole.
  const words = s.headShliach.trim().split(/\s+/), hw = h.head.trim().split(/\s+/);
  let lastName = h.head;
  if (/^משפחת /.test(h.head)) lastName = h.head.replace(/^משפחת /, '');
  else if (/;/.test(h.head)) lastName = h.head.split(/\s+—\s+/).pop().split(/;\s*/).map((n) => n.trim().split(/\s+/).pop()).join('; ');
  else if (!s.headTitle && words.length > 1) lastName = hw.slice(words.length - 1).join(' ');
  out.shetachim[s.id] = { name: h.name, short: h.short || [], headShliach: h.head, lastName, ...(h.headTitle ? { headTitle: h.headTitle } : {}) };
}
for (const g of [...geo.objects.areas.geometries, ...world.objects.areas.geometries]) {
  const st = g.properties.state;
  if (areas[st]) out.areas[st] = areas[st];
  else missing.push(`area ${st} (${g.properties.name})`);
}
// cities: the map's cities, the centers' towns (shown on their cards) and the shetach capitals' towns
const centers = read('web', 'data', 'centers.geojson').features.flatMap((f) => f.properties.centers);
for (const name of [...cities.map((c) => c.name), ...centers.map((c) => c.city), ...shetachim.map((s) => s.capital && s.capital.city)]) {
  if (!name) continue;
  if (cityNames[name]) out.cities[name] = cityNames[name];
  else missing.push(`city ${name}`);
}
if (missing.length) {
  console.error(`No Hebrew name for:\n  ${[...new Set(missing)].join('\n  ')}`);
  process.exit(1);
}
fs.writeFileSync(path.join(ROOT, 'web', 'data', 'he.json'), JSON.stringify(out));
console.log(`web/data/he.json: ${Object.keys(out.shetachim).length} shetachim, ${Object.keys(out.areas).length} areas, ${Object.keys(out.cities).length} cities`);
