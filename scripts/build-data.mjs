// Builds the map's data files from the chabad.org export and public boundary data.
//
//   npm install
//   npm run build
//
// In:
//   data/raw/chabad-centers.json        chabad.org centers export ({ data: [...] })
//   data/extra-centers.json             centers missing from chabad.org (safe to publish)
//   data/extra-centers.private.json     same format, kept out of git (optional)
//   data/shetachim.json                 the shetachim: name, head shliach, territory
// Out:
//   web/data/shetachim.json             checked copy of data/shetachim.json
//   web/data/geo.json                   TopoJSON, one object `areas`: kind 'unit' = US states, DC and
//                                       Canadian provinces; kind 'context' = nearby countries, drawn faintly
//   web/data/centers.geojson            one point per location (centers at the same spot merged)
//   web/data/centers.private.geojson    the private extras, same format (gitignored)
//   data/report.md                      counts and data problems worth a look
//
// Boundary files are downloaded once into .cache/ (Natural Earth, US Census).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mapshaper from 'mapshaper';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = path.join(ROOT, '.cache');
const OUT = path.join(ROOT, 'web', 'data');
const at = (...p) => path.join(ROOT, ...p);

const NE = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson';
const SOURCES = {
  admin1: `${NE}/ne_10m_admin_1_states_provinces.geojson`, // tagging: states/provinces
  admin1Lakes: `${NE}/ne_10m_admin_1_states_provinces_lakes.geojson`, // drawing: Great Lakes cut out
  countries: `${NE}/ne_10m_admin_0_countries.geojson`, // tagging: countries
  countriesLakes: `${NE}/ne_10m_admin_0_countries_lakes.geojson`, // drawing
  counties: 'https://www2.census.gov/geo/tiger/GENZ2023/shp/cb_2023_us_county_500k.zip', // tagging: US counties
};

const MERGE_METERS = 25; // centers closer than this are one dot (same building / campus)
const COAST_KM = 25; // a point just offshore is given to the nearest area within this distance
const UNIT_COUNTRIES = ['USA', 'CAN'];
const CONTEXT_BBOX = [-180, 5, -10, 85]; // countries drawn around North America
const FAR_NORTH = ['CA-NU', 'CA-NT', 'CA-YT', 'US-AK']; // huge coastlines, few centers: simplified harder

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
    const zip = await cached('counties');
    await mapshaper.runCommands(`-i "${zip}" -filter-fields GEOID,NAME,STUSPS -o "${out}" format=geojson`);
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
    note: raw.note,
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

// ---------- geometry for the map ----------

async function buildGeo() {
  const admin1 = await cached('admin1Lakes');
  const countries = await cached('countriesLakes');
  const [x0, y0, x1, y1] = CONTEXT_BBOX;
  const units = path.join(CACHE, 'units.geojson');
  const context = path.join(CACHE, 'context.geojson');
  const unitFilter = UNIT_COUNTRIES.map((c) => `adm0_a3 == '${c}'`).join(' || ');
  await mapshaper.runCommands(
    `-i "${admin1}" -filter "${unitFilter}" ` +
    `-each "kind = 'unit', id = iso_3166_2, country = adm0_a3 == 'USA' ? 'US' : 'CA', abbr = postal" ` +
    `-filter-fields kind,id,name,country,abbr -o "${units}" format=geojson`,
  );
  const notUnits = UNIT_COUNTRIES.map((c) => `ADM0_A3 != '${c}'`).join(' && ');
  await mapshaper.runCommands(
    `-i "${countries}" -filter "(${notUnits}) && (CONTINENT == 'North America' || ADM0_A3 == 'RUS')" ` +
    `-clip bbox=${x0},${y0},${x1},${y1} ` +
    `-each "kind = 'context', id = ISO_A2_EH, country = ISO_A2_EH, name = NAME" ` +
    `-filter-fields kind,id,name,country -o "${context}" format=geojson`,
  );
  // One layer and one topology, so shared borders (US-Mexico etc.) line up exactly.
  const farNorth = JSON.stringify(FAR_NORTH).replace(/"/g, "'");
  await mapshaper.runCommands(
    `-i "${units}" "${context}" combine-files ` +
    `-merge-layers force name=areas ` +
    `-simplify variable interval="${farNorth}.includes(id) ? 4000 : 600" keep-shapes ` +
    `-filter-islands min-area=40km2 remove-empty ` +
    `-o "${path.join(OUT, 'geo.json')}" format=topojson quantization=100000`,
  );
}

// Every territory code must be a real area, and no area may be in two shetachim.
function checkShetachim() {
  const file = at('data', 'shetachim.json');
  const data = readJSON(file);
  const topo = readJSON(path.join(OUT, 'geo.json'));
  const units = new Set(topo.objects.areas.geometries.filter((g) => g.properties.kind === 'unit').map((g) => g.properties.id));
  const owner = new Map();
  const problems = [];
  for (const s of data.shetachim) {
    if (!s.id || !s.name || !Array.isArray(s.territory)) problems.push(`${s.id || s.name || '?'}: needs id, name and territory`);
    for (const u of s.territory || []) {
      if (!units.has(u)) problems.push(`${s.id}: unknown area "${u}"`);
      if (owner.has(u)) problems.push(`${u} is in both ${owner.get(u)} and ${s.id}`);
      owner.set(u, s.id);
    }
  }
  if (problems.length) throw new Error(`data/shetachim.json:\n  ${problems.join('\n  ')}`);
  fs.copyFileSync(file, path.join(OUT, 'shetachim.json'));
  console.log(`${data.shetachim.length} shetachim covering ${owner.size} of ${units.size} states/provinces`);
}

// ---------- main ----------

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const raw = readJSON(at('data', 'raw', 'chabad-centers.json')).data;
  const extrasFile = at('data', 'extra-centers.json');
  const privateFile = at('data', 'extra-centers.private.json');
  const extras = fs.existsSync(extrasFile) ? readJSON(extrasFile).centers || [] : [];
  const privates = fs.existsSync(privateFile) ? readJSON(privateFile).centers || [] : [];

  const toRaw = (e) => ({ ...e, coordinates: { latitude: e.lat, longitude: e.lon }, 'location-is-approximate': e.precision !== 'exact' });
  const publicCenters = [...raw.map((r) => normalize(r)), ...extras.map((e) => normalize(toRaw(e), true))];
  const privateCenters = privates.map((e) => normalize(toRaw(e), true));
  const bad = publicCenters.filter((c) => !Number.isFinite(c.lat) || !Number.isFinite(c.lon));
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

  const build = (centers) => {
    const dots = mergeIntoDots(centers.filter((c) => Number.isFinite(c.lat) && Number.isFinite(c.lon)));
    dots.forEach(tag);
    for (const d of dots) d.suspect = suspectReason(d) || undefined;
    return dots;
  };
  const dots = build(publicCenters);
  const privateDots = build(privateCenters);

  const toFeature = (d) => ({
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [+d.lon.toFixed(5), +d.lat.toFixed(5)] },
    properties: {
      country: d.country, region: d.region, county: d.county, suspect: d.suspect,
      centers: d.centers.map(({ lat, lon, ...c }) => c),
    },
  });
  const write = (file, list) => fs.writeFileSync(path.join(OUT, file), JSON.stringify({ type: 'FeatureCollection', features: list.map(toFeature) }));
  write('centers.geojson', dots);
  if (privateDots.length) write('centers.private.geojson', privateDots);
  else fs.rmSync(path.join(OUT, 'centers.private.geojson'), { force: true });

  console.log('building map geometry…');
  await buildGeo();
  checkShetachim();

  fs.writeFileSync(at('data', 'report.md'), report(publicCenters, dots, privateDots));
  console.log(`done: ${publicCenters.length} centers -> ${dots.length} dots` + (privateDots.length ? ` (+${privateDots.length} private)` : ''));
}

// ---------- report ----------

function report(centers, dots, privateDots) {
  const count = (list, key) => {
    const m = new Map();
    for (const x of list) m.set(key(x), (m.get(key(x)) || 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  };
  const perCenter = dots.flatMap((d) => d.centers.map((c) => ({ ...c, country: d.country, countryName: d.countryName, region: d.region })));
  const multi = dots.filter((d) => d.centers.length > 1);
  const na = perCenter.filter((c) => c.country === 'US' || c.country === 'CA');
  const naDots = dots.filter((d) => d.country === 'US' || d.country === 'CA');
  const untagged = dots.filter((d) => !d.country);
  const suspects = dots.filter((d) => d.suspect);
  const mixed = dots.filter((d) => !d.suspect && citiesAt(d).length === 2);
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
- US + Canada: **${na.length}** centers, ${naDots.length} dots
- Private extras (not in git): ${privateDots.reduce((s, d) => s + d.centers.length, 0)}
- Dots not inside any country: ${untagged.length}

## US states and Canadian provinces

| Region | Centers |
|---|---|
${table(count(na, (c) => c.region))}

## Countries

| Country | Centers |
|---|---|
${table(count(perCenter, (c) => c.countryName))}

## Probably misplaced by chabad.org (${suspects.length} dots)

Centers from three or more cities on a single point: a failed geocode. Flagged on the map.

${suspects.map(where).join('\n')}

## Two city names on one point (${mixed.length} dots)

Usually a suburb or a spelling variant (fine); now and then a real mistake.

${mixed.map(where).join('\n')}
${untagged.length ? `\n## Not inside any country\n\n${untagged.map((d) => `- ${d.centers.map((c) => c.name).join('; ')} (${d.lat}, ${d.lon})`).join('\n')}\n` : ''}`;
}

main().catch((e) => { console.error(e); process.exit(1); });
