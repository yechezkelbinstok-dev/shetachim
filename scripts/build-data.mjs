// Builds the map's data files from the chabad.org export and public boundary data.
//
//   npm install
//   npm run build
//
// In:
//   data/raw/chabad-centers.json        chabad.org centers export ({ data: [...] })
//   data/extra-centers.json             centers missing from chabad.org
//   data/shetachim.json                 the shetachim: name, head shliach, territory, capital
// Out:
//   web/data/shetachim.json             checked copy of data/shetachim.json, with each capital's position
//   web/data/geo.json                   TopoJSON, one object `areas`: the US states, DC and Canadian
//                                       provinces (minus the areas listed in shetachim.json `notShown`)
//   web/data/centers.geojson            one point per location (centers at the same spot merged)
//   web/data/cities.json                every US/Canada city with at least one center, biggest first
//   data/report.md                      counts and data problems worth a look
//
// Boundary files are downloaded once into .cache/ (Natural Earth, US Census). City points and
// populations come from GeoNames, via the all-the-cities package.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mapshaper from 'mapshaper';
import geonames from 'all-the-cities';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = path.join(ROOT, '.cache');
const OUT = path.join(ROOT, 'web', 'data');
const at = (...p) => path.join(ROOT, ...p);

const NE = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson';
const SOURCES = {
  admin1: `${NE}/ne_10m_admin_1_states_provinces.geojson`, // tagging: states/provinces
  admin1Lakes: `${NE}/ne_10m_admin_1_states_provinces_lakes.geojson`, // drawing: Great Lakes cut out
  countries: `${NE}/ne_10m_admin_0_countries.geojson`, // tagging: countries
  // tagging: US counties, Census 1:500k (2022), from the Census Bureau's GitHub (www2.census.gov isn't always reachable)
  counties: 'https://raw.githubusercontent.com/uscensusbureau/citysdk/master/v2/GeoJSON/500k/2022/county.json',
};

const MERGE_METERS = 25; // centers closer than this are one dot (same building / campus)
const COAST_KM = 25; // a point just offshore is given to the nearest area within this distance
const UNIT_COUNTRIES = ['USA', 'CAN'];
const UNIT_ISO = ['US', 'CA'];
const CITY_KM = 60; // a GeoNames place this close with the same name is the center's city
const ROUGH = ['US-AK']; // drawn small in an inset, so simplified harder

// ---------- downloads ----------

async function cached(name) {
  const url = SOURCES[name];
  const file = path.join(CACHE, path.basename(new URL(url).pathname));
  if (!fs.existsSync(file)) {
    console.log(`downloading ${url}`);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
    fs.mkdirSync(CACHE, { recursive: true });
    fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  }
  return file;
}

async function countiesGeoJSON() {
  const out = path.join(CACHE, 'us-counties.geojson');
  if (!fs.existsSync(out)) {
    const src = await cached('counties');
    await mapshaper.runCommands(`-i "${src}" -filter-fields GEOID,NAME,STUSPS -o "${out}" format=geojson`);
  }
  return out;
}

const readJSON = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));

// ---------- point in polygon ----------

function polygonsOf(geometry) {
  if (!geometry) return [];
  if (geometry.type === 'Polygon') return [geometry.coordinates];
  if (geometry.type === 'MultiPolygon') return geometry.coordinates;
  return [];
}

// Features with bounding boxes, so each lookup only tests nearby shapes.
function index(features) {
  return features.map((f) => {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const poly of polygonsOf(f.geometry)) {
      for (const [x, y] of poly[0]) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
    return { f, box: [x0, y0, x1, y1] };
  });
}

function inRing(ring, x, y) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function contains(f, x, y) {
  for (const poly of polygonsOf(f.geometry)) {
    let inside = false;
    for (const ring of poly) if (inRing(ring, x, y)) inside = !inside; // holes flip it back
    if (inside) return true;
  }
  return false;
}

// Distance in km from a point to a feature's outline (flat-earth approximation, fine at this range).
function kmTo(f, x, y) {
  const kx = 111.32 * Math.cos((y * Math.PI) / 180);
  const ky = 110.57;
  let best = Infinity;
  for (const poly of polygonsOf(f.geometry)) {
    for (const ring of poly) {
      for (let i = 1; i < ring.length; i++) {
        const ax = (ring[i - 1][0] - x) * kx, ay = (ring[i - 1][1] - y) * ky;
        const bx = (ring[i][0] - x) * kx, by = (ring[i][1] - y) * ky;
        const dx = bx - ax, dy = by - ay;
        const t = dx || dy ? Math.max(0, Math.min(1, -(ax * dx + ay * dy) / (dx * dx + dy * dy))) : 0;
        best = Math.min(best, Math.hypot(ax + t * dx, ay + t * dy));
      }
    }
  }
  return best;
}

// The feature containing the point, else the nearest one within COAST_KM (points just offshore).
function locate(idx, x, y) {
  for (const { f, box } of idx) {
    if (x >= box[0] && x <= box[2] && y >= box[1] && y <= box[3] && contains(f, x, y)) return { f, km: 0 };
  }
  const pad = COAST_KM / 80; // degrees, generous
  let best = null;
  for (const { f, box } of idx) {
    if (x < box[0] - pad || x > box[2] + pad || y < box[1] - pad || y > box[3] + pad) continue;
    const km = kmTo(f, x, y);
    if (km <= COAST_KM && (!best || km < best.km)) best = { f, km };
  }
  return best;
}

// ---------- centers ----------

function normalize(raw, extra = false) {
  const c = raw.coordinates || {};
  return {
    id: String(raw.id),
    name: (raw.name || '').trim(),
    nativeName: (raw['native-name'] || '').trim() || undefined,
    type: (raw['center-type'] && raw['center-type'].name) || undefined,
    city: (raw.city || (raw.address && raw.address.city) || '').trim(),
    slug: raw['static-url'] || undefined, // page: https://www.chabad.org/jewish-centers/<id>/<slug>
    lat: c.latitude,
    lon: c.longitude,
    approx: !!raw['location-is-approximate'] || undefined,
    unlisted: extra || undefined,
    note: raw.note || undefined,
  };
}

function metersBetween(a, b) {
  const R = 6371000, rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad, dLon = (b.lon - a.lon) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Centers at the same spot become one dot. Exact matches first, then anything within
// MERGE_METERS of an existing dot (compared to the dot's own position, so chains don't grow).
function mergeIntoDots(centers) {
  const exact = new Map();
  for (const c of centers) {
    const key = `${c.lat.toFixed(5)},${c.lon.toFixed(5)}`;
    if (!exact.has(key)) exact.set(key, []);
    exact.get(key).push(c);
  }
  const groups = [...exact.values()].sort((a, b) => b.length - a.length);
  const cell = MERGE_METERS / 111000;
  const grid = new Map();
  const dots = [];
  for (const g of groups) {
    const p = { lat: g[0].lat, lon: g[0].lon };
    const gx = Math.floor(p.lon / cell), gy = Math.floor(p.lat / cell);
    let home = null;
    for (let dx = -2; dx <= 2 && !home; dx++) {
      for (let dy = -2; dy <= 2 && !home; dy++) {
        for (const d of grid.get(`${gx + dx},${gy + dy}`) || []) {
          if (metersBetween(d, p) <= MERGE_METERS) { home = d; break; }
        }
      }
    }
    if (home) { home.centers.push(...g); continue; }
    const dot = { lat: p.lat, lon: p.lon, centers: [...g] };
    dots.push(dot);
    const k = `${gx},${gy}`;
    if (!grid.has(k)) grid.set(k, []);
    grid.get(k).push(dot);
  }
  return dots;
}

const cityKey = (s) => s.toLowerCase().normalize('NFD').replace(/[^a-z]/g, '');

// Distinct city names among a dot's centers; names sharing their first four letters count as one.
function citiesAt(dot) {
  const cities = [...new Set(dot.centers.map((c) => cityKey(c.city)).filter(Boolean))];
  const similar = (a, b) => a.startsWith(b.slice(0, 4)) || b.startsWith(a.slice(0, 4));
  return cities.filter((c, i) => !cities.slice(0, i).some((d) => similar(c, d)));
}

// Centers from three or more cities on one point is a failed geocode (chabad.org puts
// addresses it can't find at the country's midpoint). Two cities is usually a suburb or a
// spelling variant, so those are only listed in the report.
function suspectReason(dot) {
  const n = citiesAt(dot).length;
  return n >= 3 ? `centers from ${n} different cities share this point` : null;
}

// ---------- cities with shluchim ----------

// chabad.org writes Saint, San, Santa, Sainte and South all as "S." (S. Diego, S. Euclid, Rancho S. Fe).
// GeoNames spells St., Mt. and Ft. out, and accents are dropped on both sides.
const SPELLED = { st: 'saint', ste: 'sainte', mt: 'mount', ft: 'fort' };
const S_WORDS = ['saint', 'san', 'santa', 'sainte', 'south'];
const words = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/['’]/g, '').toLowerCase()
  .split(/[^a-z]+/).filter(Boolean).map((w) => SPELLED[w] || w);
const placeKey = (s) => words(s).join('');

// Ways GeoNames might spell a chabad.org city name: exact spellings first, then looser variants.
function spellings(name) {
  let keys = [[]];
  for (const w of words(name)) keys = keys.flatMap((k) => (w === 's' ? S_WORDS : [w]).map((x) => [...k, x]));
  keys = keys.map((k) => k.join(''));
  // New York City, The Bronx, Washington, D.C., West Bloomfield Township, Hallandale Beach; Quebec City is Québec
  const loose = keys.flatMap((k) => [`${k}city`, `the${k}`, `${k}dc`, `${k}township`, `${k}beach`, ...(k.endsWith('city') ? [k.slice(0, -4)] : [])]);
  return [keys, loose];
}

// GeoNames admin1 codes: US states use postal codes, Canadian provinces use numbers.
const CA_ADMIN1 = { '01': 'AB', '02': 'BC', '03': 'MB', '04': 'NB', '05': 'NL', '07': 'NS', '08': 'ON', '09': 'PE', '10': 'QC', '11': 'SK', '12': 'YT', '13': 'NT', '14': 'NU' };
const regionOf = (g) => `${g.country}-${g.country === 'CA' ? CA_ADMIN1[g.adminCode] : g.adminCode}`;

// One entry per city that has a center: at the GeoNames point for that name in the same state or
// province (nearest within CITY_KM), else at the middle of its centers. Biggest cities first, so
// the map labels them first.
function buildCities(dots) {
  const places = new Map();
  for (const g of geonames) {
    if (!UNIT_ISO.includes(g.country)) continue;
    const key = placeKey(g.name);
    if (!places.has(key)) places.set(key, []);
    places.get(key).push(g);
  }
  const groups = new Map();
  for (const d of dots) {
    if (!UNIT_ISO.includes(d.country) || !d.region) continue;
    for (const c of d.centers) {
      if (!c.city) continue;
      const key = `${d.region}|${placeKey(c.city)}`;
      if (!groups.has(key)) groups.set(key, { region: d.region, country: d.country, names: [], at: [] });
      groups.get(key).names.push(c.city);
      groups.get(key).at.push(d);
    }
  }
  const median = (xs) => {
    const s = [...xs].sort((a, b) => a - b), m = s.length >> 1;
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
  };
  function match(g, mid) {
    const tiers = g.names.map(spellings);
    for (const tier of [0, 1]) {
      let best = null;
      for (const key of new Set(tiers.flatMap((t) => t[tier]))) {
        for (const p of places.get(key) || []) {
          if (regionOf(p) !== g.region) continue;
          const km = metersBetween(mid, { lat: p.loc.coordinates[1], lon: p.loc.coordinates[0] }) / 1000;
          if (km <= CITY_KM && (!best || km < best.km)) best = { p, km };
        }
      }
      if (best) return best.p;
    }
    return null;
  }
  const cities = [], byPlace = new Map(); // one city for "S. Diego" and "San Diego" listings
  for (const g of groups.values()) {
    const mid = { lat: median(g.at.map((d) => d.lat)), lon: median(g.at.map((d) => d.lon)) };
    const p = match(g, mid);
    if (p && byPlace.has(p.cityId)) { byPlace.get(p.cityId).centers += g.names.length; continue; }
    const [lon, lat] = p ? p.loc.coordinates : [mid.lon, mid.lat];
    const city = {
      name: p ? p.name.replace(/ Township$| \(.*\)$/, '') : count(g.names, (n) => n)[0][0],
      region: g.region, country: g.country, lat: +lat.toFixed(5), lon: +lon.toFixed(5),
      pop: p ? p.population : 0, centers: g.names.length, unmatched: p ? undefined : true,
    };
    if (p) byPlace.set(p.cityId, city);
    cities.push(city);
  }
  return cities.sort((a, b) => b.pop - a.pop || b.centers - a.centers || (a.name < b.name ? -1 : 1));
}

function count(list, key) {
  const m = new Map();
  for (const x of list) m.set(key(x), (m.get(key(x)) || 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

// ---------- geometry for the map ----------

async function buildGeo(notShown) {
  const admin1 = await cached('admin1Lakes');
  const unitFilter = UNIT_COUNTRIES.map((c) => `adm0_a3 == '${c}'`).join(' || ');
  const hidden = JSON.stringify(notShown).replace(/"/g, "'");
  const rough = JSON.stringify(ROUGH).replace(/"/g, "'");
  await mapshaper.runCommands(
    `-i "${admin1}" -filter "(${unitFilter}) && !${hidden}.includes(iso_3166_2)" ` +
    `-each "id = iso_3166_2, country = adm0_a3 == 'USA' ? 'US' : 'CA', abbr = postal" ` +
    `-filter-fields id,name,country,abbr -rename-layers areas ` +
    `-simplify variable interval="${rough}.includes(id) ? 2500 : 500" keep-shapes ` +
    `-filter-islands min-area=40km2 remove-empty ` +
    `-o "${path.join(OUT, 'geo.json')}" format=topojson quantization=100000`,
  );
}

// Every territory code must be a real area, no area may be in two shetachim, and a capital must be
// a known center inside its shetach (or a lat/lon). Writes the checked file with each capital's position.
function checkShetachim(data, dots) {
  const topo = readJSON(path.join(OUT, 'geo.json'));
  const units = new Set(topo.objects.areas.geometries.map((g) => g.properties.id));
  const dotOf = new Map(dots.flatMap((d) => d.centers.map((c) => [c.id, { d, c }])));
  const owner = new Map();
  const problems = [];
  for (const s of data.shetachim) {
    if (!s.id || !s.name || !Array.isArray(s.territory)) problems.push(`${s.id || s.name || '?'}: needs id, name and territory`);
    for (const u of s.territory || []) {
      if (!units.has(u)) problems.push(`${s.id}: unknown area "${u}"`);
      if (owner.has(u)) problems.push(`${u} is in both ${owner.get(u)} and ${s.id}`);
      owner.set(u, s.id);
    }
    const cap = s.capital;
    if (!cap) continue;
    if (!cap.name) problems.push(`${s.id}: the capital needs a name`);
    if (cap.centerId !== undefined) {
      const hit = dotOf.get(String(cap.centerId));
      if (!hit) problems.push(`${s.id}: capital centerId ${cap.centerId} isn't in the centers data`);
      else if (!(s.territory || []).includes(hit.d.region)) problems.push(`${s.id}: capital ${cap.centerId} is in ${hit.d.region}, outside the shetach`);
      // on the center's dot, so the star and the dot line up
      else Object.assign(cap, { centerId: String(cap.centerId), lat: +hit.d.lat.toFixed(5), lon: +hit.d.lon.toFixed(5), city: hit.c.city });
    } else if (!Number.isFinite(cap.lat) || !Number.isFinite(cap.lon)) {
      problems.push(`${s.id}: the capital needs a centerId, or lat and lon`);
    }
  }
  if (problems.length) throw new Error(`data/shetachim.json:\n  ${problems.join('\n  ')}`);
  fs.writeFileSync(path.join(OUT, 'shetachim.json'), `${JSON.stringify(data, null, 2)}\n`);
  console.log(`${data.shetachim.length} shetachim entered, covering ${owner.size} of ${units.size} states/provinces; ` +
    `the rest are one shetach each`);
}

// ---------- main ----------

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const raw = readJSON(at('data', 'raw', 'chabad-centers.json')).data;
  const extrasFile = at('data', 'extra-centers.json');
  const extras = fs.existsSync(extrasFile) ? readJSON(extrasFile).centers || [] : [];

  const toRaw = (e) => ({ ...e, coordinates: { latitude: e.lat, longitude: e.lon }, 'location-is-approximate': e.precision !== 'exact' });
  const centers = [...raw.map((r) => normalize(r)), ...extras.map((e) => normalize(toRaw(e), true))];
  const bad = centers.filter((c) => !Number.isFinite(c.lat) || !Number.isFinite(c.lon));
  if (bad.length) console.warn(`${bad.length} centers have no coordinates and are skipped`);

  console.log('loading boundaries…');
  const countryIdx = index(readJSON(await cached('countries')).features);
  const regionIdx = index(readJSON(await cached('admin1')).features.filter((f) => UNIT_COUNTRIES.includes(f.properties.adm0_a3)));
  const countyIdx = index(readJSON(await countiesGeoJSON()).features);

  function tag(dot) {
    const { lon: x, lat: y } = dot;
    const country = locate(countryIdx, x, y);
    dot.country = country ? country.f.properties.ISO_A2_EH : null;
    dot.countryName = country ? country.f.properties.NAME : null;
    if (dot.country === 'US') {
      const county = locate(countyIdx, x, y);
      if (county) {
        dot.county = county.f.properties.GEOID;
        dot.countyName = county.f.properties.NAME;
        dot.region = `US-${county.f.properties.STUSPS}`;
      }
    }
    if ((dot.country === 'US' && !dot.region) || dot.country === 'CA') {
      const region = locate(regionIdx, x, y);
      if (region) dot.region = region.f.properties.iso_3166_2;
    }
  }

  const dots = mergeIntoDots(centers.filter((c) => Number.isFinite(c.lat) && Number.isFinite(c.lon)));
  dots.forEach(tag);
  for (const d of dots) d.suspect = suspectReason(d) || undefined;

  const toFeature = (d) => ({
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [+d.lon.toFixed(5), +d.lat.toFixed(5)] },
    properties: {
      country: d.country, region: d.region, county: d.county, suspect: d.suspect,
      centers: d.centers.map(({ lat, lon, ...c }) => c),
    },
  });
  fs.writeFileSync(path.join(OUT, 'centers.geojson'), JSON.stringify({ type: 'FeatureCollection', features: dots.map(toFeature) }));

  const cities = buildCities(dots);
  fs.writeFileSync(path.join(OUT, 'cities.json'), `[\n${cities.map(({ unmatched, ...c }) => JSON.stringify(c)).join(',\n')}\n]\n`);

  console.log('building map geometry…');
  const shetachData = readJSON(at('data', 'shetachim.json'));
  await buildGeo(shetachData.notShown || []);
  checkShetachim(shetachData, dots);

  fs.writeFileSync(at('data', 'report.md'), report(centers, dots, cities, shetachData));
  console.log(`done: ${centers.length} centers -> ${dots.length} dots, ${cities.length} cities in the US and Canada`);
}

// ---------- report ----------

function report(centers, dots, cities, shetachData) {
  const perCenter = dots.flatMap((d) => d.centers.map((c) => ({ ...c, country: d.country, countryName: d.countryName, region: d.region })));
  const multi = dots.filter((d) => d.centers.length > 1);
  const na = perCenter.filter((c) => c.country === 'US' || c.country === 'CA');
  const naDots = dots.filter((d) => d.country === 'US' || d.country === 'CA');
  const untagged = dots.filter((d) => !d.country);
  const suspects = dots.filter((d) => d.suspect);
  const mixed = dots.filter((d) => !d.suspect && citiesAt(d).length === 2);
  const unmatched = cities.filter((c) => c.unmatched);
  const where = (d) => `- ${d.lat.toFixed(4)}, ${d.lon.toFixed(4)} (${d.countryName}): ` +
    count(d.centers, (c) => c.city).map(([city, n]) => `${city} ×${n}`).join(', ');
  const table = (rows) => rows.map(([k, v]) => `| ${k ?? '(none)'} | ${v} |`).join('\n');
  return `# Centers data report

Generated by \`scripts/build-data.mjs\` from \`data/raw/chabad-centers.json\`.

## Totals

- Centers: **${centers.length}** (${centers.filter((c) => c.unlisted).length} added by hand)
- Dots after merging centers at the same spot (within ${MERGE_METERS} m): **${dots.length}**
  - ${multi.length} dots hold more than one center (${multi.reduce((s, d) => s + d.centers.length, 0)} centers)
- Centers whose chabad.org location is only approximate (city centre): ${centers.filter((c) => c.approx && !c.unlisted).length}
- Countries: ${new Set(perCenter.map((c) => c.country).filter(Boolean)).size}
- US + Canada: **${na.length}** centers, ${naDots.length} dots, ${cities.length} cities
- Dots not inside any country: ${untagged.length}

## US states and Canadian provinces

| Region | Centers |
|---|---|
${table(count(na, (c) => c.region))}

## Countries

| Country | Centers |
|---|---|
${table(count(perCenter, (c) => c.countryName))}

## Shetach capitals

${shetachData.shetachim.filter((s) => s.capital).map((s) => `- ${s.name}: ${s.capital.name}` +
  (s.capital.centerId ? ` (center ${s.capital.centerId}, ${s.capital.city})` : '')).join('\n') || 'None entered yet.'}

## Cities without a GeoNames match (${unmatched.length} of ${cities.length})

Placed at the middle of their centers. Usually a neighbourhood or a place under 1,000 people;
a misspelling on chabad.org shows up here too.

${unmatched.map((c) => `- ${c.name} (${c.region}): ${c.centers} ${c.centers === 1 ? 'center' : 'centers'}`).join('\n')}

## Probably misplaced by chabad.org (${suspects.length} dots)

Centers from three or more cities on a single point: a failed geocode. Flagged on the map.

${suspects.map(where).join('\n')}

## Two city names on one point (${mixed.length} dots)

Usually a suburb or a spelling variant (fine); now and then a real mistake.

${mixed.map(where).join('\n')}
${untagged.length ? `\n## Not inside any country\n\n${untagged.map((d) => `- ${d.centers.map((c) => c.name).join('; ')} (${d.lat}, ${d.lon})`).join('\n')}\n` : ''}`;
}

main().catch((e) => { console.error(e); process.exit(1); });
