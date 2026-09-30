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
//   web/data/shetachim.json             the shetachim for the page: names, head shluchim, capitals with positions
//   web/data/geo.json                   TopoJSON, one object `areas`: the US states, DC and Canadian provinces
//                                       (minus `notShown`), with split states cut into one piece per shetach;
//                                       each piece has its state and its shetach (null where none is entered)
//   web/data/centers.geojson            one point per location (centers at the same spot merged)
//   web/data/cities.json                every US/Canada city with at least one center, biggest first
//   data/report.md                      counts and data problems worth a look
//
// Boundary files are downloaded once into .cache/ (Natural Earth; US Census counties, towns and tracts).
// City points and populations come from GeoNames, via the all-the-cities package.
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
  // US counties, Census 1:500k (2022), from the Census Bureau's GitHub (www2.census.gov isn't always reachable)
  counties: 'https://raw.githubusercontent.com/uscensusbureau/citysdk/master/v2/GeoJSON/500k/2022/county.json',
};
// the same place, by state FIPS code: county-subdivision (towns) and tract
const CENSUS = 'https://raw.githubusercontent.com/uscensusbureau/citysdk/master/v2/GeoJSON/500k/2022';

const MERGE_METERS = 25; // centers closer than this are one dot (same building / campus)
const COAST_KM = 25; // a point just offshore is given to the nearest area within this distance
const UNIT_COUNTRIES = ['USA', 'CAN'];
const UNIT_ISO = ['US', 'CA'];
const CITY_KM = 60; // a GeoNames place this close with the same name is the center's city
const ROUGH = ['US-AK']; // drawn small in an inset, so simplified harder
const SLIVER_GRID = 0.03; // degrees: slivers along a split state's outline are handed out in squares this size

// ---------- downloads ----------

async function download(url, name) {
  const file = path.join(CACHE, name);
  if (!fs.existsSync(file)) {
    console.log(`downloading ${url}`);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
    fs.mkdirSync(CACHE, { recursive: true });
    fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  }
  return file;
}
const cached = (name) => download(SOURCES[name], path.basename(new URL(SOURCES[name]).pathname));
const censusLayer = (kind, fips) => download(`${CENSUS}/${fips}/${kind}.json`, `${kind}-${fips}.json`);

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

// ---------- shetachim: what each one covers ----------

// A territory item is a state or province code, or part of a state: east and/or west of a longitude,
// counties, towns or census tracts. Where items overlap, the more specific one wins.
const LEVEL = { state: 0, band: 1, county: 2, town: 3, tract: 4 };
const townKey = (s) => s.toLowerCase().replace(/ town$/, '').replace(/[^a-z]/g, '');

function readClaims(data, areaIds, counties) {
  const problems = [];
  const stateOfFips = new Map(counties.features.map((f) => [f.properties.GEOID.slice(0, 2), `US-${f.properties.STUSPS}`]));
  const countyIds = new Set(counties.features.map((f) => f.properties.GEOID));
  const claims = [];
  const onState = (s, state) => {
    if (areaIds.has(state)) return true;
    problems.push(`${s.id}: unknown area "${state}"`);
    return false;
  };
  for (const s of data.shetachim) {
    if (!s.id || !s.name || !Array.isArray(s.territory)) { problems.push(`${s.id || s.name || '?'}: needs id, name and territory`); continue; }
    for (const t of s.territory) {
      if (typeof t === 'string') {
        if (onState(s, t)) claims.push({ shetach: s.id, state: t, level: LEVEL.state });
      } else if (t.counties) {
        for (const c of t.counties) {
          if (countyIds.has(c)) claims.push({ shetach: s.id, state: stateOfFips.get(c.slice(0, 2)), level: LEVEL.county, county: c });
          else problems.push(`${s.id}: unknown county "${c}"`);
        }
      } else if (t.towns && onState(s, t.state)) {
        for (const town of t.towns) claims.push({ shetach: s.id, state: t.state, level: LEVEL.town, town: townKey(town), townName: town });
      } else if (t.tracts && onState(s, t.state)) {
        for (const tract of t.tracts) claims.push({ shetach: s.id, state: t.state, level: LEVEL.tract, tract });
      } else if ((t.westOf !== undefined || t.eastOf !== undefined) && onState(s, t.state)) {
        claims.push({ shetach: s.id, state: t.state, level: LEVEL.band, from: t.eastOf ?? -180, to: t.westOf ?? 180 });
      } else if (!t.towns && !t.tracts) {
        problems.push(`${s.id}: can't read territory ${JSON.stringify(t)}`);
      }
    }
  }
  // Two shetachim may not claim the same thing (overlapping longitude ranges included).
  const seen = new Map();
  for (const c of claims) {
    const key = [c.state, c.level, c.county ?? c.town ?? c.tract ?? ''].join('|');
    const other = seen.get(key);
    if (other && other.shetach !== c.shetach) {
      if (c.level !== LEVEL.band) problems.push(`${other.shetach} and ${c.shetach} both claim ${c.county ?? c.townName ?? c.tract ?? c.state}`);
    }
    if (c.level === LEVEL.band) {
      for (const o of claims) {
        if (o !== c && o.level === LEVEL.band && o.state === c.state && o.shetach !== c.shetach && o.from < c.to && c.from < o.to && o.shetach < c.shetach) {
          problems.push(`${o.shetach} and ${c.shetach} both claim part of ${c.state}`);
        }
      }
    }
    seen.set(key, c);
  }
  return { claims, problems };
}

const featureOf = (geometry, properties) => ({ type: 'Feature', geometry, properties });
const collectionOf = (features) => ({ type: 'FeatureCollection', features });
const rect = ([x0, y0, x1, y1]) => ({ type: 'Polygon', coordinates: [[[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0]]] });
function bboxOf(f, pad = 0) {
  const [{ box }] = index([f]);
  return [box[0] - pad, box[1] - pad, box[2] + pad, box[3] + pad];
}

// The map's areas: Natural Earth states and provinces, each a single piece, except states that are split
// between shetachim. Those are cut along the Census lines their claims use (counties, towns, tracts) and
// along longitude lines, with the outer edge kept from Natural Earth so neighbours still meet exactly.
// Slivers where the Census and Natural Earth coastlines differ go to the nearest piece.
async function buildGeo(data) {
  const notShown = data.notShown || [];
  const ne = readJSON(await cached('admin1Lakes'));
  const areas = ne.features
    .filter((f) => UNIT_COUNTRIES.includes(f.properties.adm0_a3) && !notShown.includes(f.properties.iso_3166_2))
    .map((f) => featureOf(f.geometry, {
      id: f.properties.iso_3166_2, name: f.properties.name, abbr: f.properties.postal,
      country: f.properties.adm0_a3 === 'USA' ? 'US' : 'CA',
    }));
  const areaById = new Map(areas.map((f) => [f.properties.id, f]));
  const counties = readJSON(await countiesGeoJSON());
  const { claims, problems } = readClaims(data, new Set(areaById.keys()), counties);
  const byState = new Map();
  for (const c of claims) {
    if (!byState.has(c.state)) byState.set(c.state, []);
    byState.get(c.state).push(c);
  }
  const split = [...byState].filter(([, cs]) => cs.some((c) => c.level > LEVEL.state)).map(([state]) => state);

  // For each split state, layers of cells (fields prefixed per state, since the union keeps every field).
  const layers = {}, prefix = new Map();
  for (const state of split) {
    const cs = byState.get(state), P = `${state.replace('-', '_')}_`;
    prefix.set(state, P);
    const fips = counties.features.find((f) => `US-${f.properties.STUSPS}` === state)?.properties.GEOID.slice(0, 2);
    const box = bboxOf(areaById.get(state), 1);
    const has = (level) => cs.some((c) => c.level === level);
    let base;
    if ((has(LEVEL.town) || has(LEVEL.tract)) && fips) {
      const towns = readJSON(await censusLayer('county-subdivision', fips)).features;
      const known = new Set(towns.map((f) => townKey(f.properties.NAME)));
      for (const c of cs) if (c.level === LEVEL.town && !known.has(c.town)) problems.push(`${c.shetach}: no town "${c.townName}" in ${state}`);
      base = towns.map((f) => featureOf(f.geometry, { [`${P}town`]: townKey(f.properties.NAME), [`${P}county`]: f.properties.STATEFP + f.properties.COUNTYFP }));
    } else if (has(LEVEL.county) && fips) {
      base = counties.features.filter((f) => f.properties.GEOID.startsWith(fips)).map((f) => featureOf(f.geometry, { [`${P}county`]: f.properties.GEOID }));
    } else {
      base = [featureOf(rect(box), { [`${P}all`]: 1 })];
    }
    layers[`${P}base`] = collectionOf(base);
    if (has(LEVEL.tract)) {
      const want = new Set(cs.filter((c) => c.level === LEVEL.tract).map((c) => c.tract));
      const tracts = readJSON(await censusLayer('tract', fips)).features.filter((f) => want.has(f.properties.GEOID));
      for (const t of want) if (!tracts.some((f) => f.properties.GEOID === t)) problems.push(`no census tract "${t}" in ${state}`);
      layers[`${P}tracts`] = collectionOf(tracts.map((f) => featureOf(f.geometry, { [`${P}tract`]: f.properties.GEOID })));
    }
    if (!base[0].properties[`${P}all`]) {
      // Small squares along the outline, so a long sliver is shared out between the pieces it runs past.
      const outline = areaById.get(state), g = SLIVER_GRID, squares = [];
      const [x0, y0, x1, y1] = bboxOf(outline, g);
      for (let x = x0; x < x1; x += g) {
        for (let y = y0; y < y1; y += g) {
          if (kmTo(outline, x + g / 2, y + g / 2) < 5) squares.push(featureOf(rect([x, y, x + g, y + g]), { [`${P}sq`]: squares.length }));
        }
      }
      layers[`${P}grid`] = collectionOf(squares);
    }
    if (has(LEVEL.band)) {
      const edges = cs.filter((c) => c.level === LEVEL.band).flatMap((c) => [c.from, c.to]).filter((x) => x > box[0] && x < box[2]);
      const xs = [box[0], ...[...new Set(edges)].sort((a, b) => a - b), box[2]];
      layers[`${P}bands`] = collectionOf(xs.slice(1).map((x1, i) => featureOf(rect([xs[i], box[1], x1, box[3]]), { [`${P}mid`]: (xs[i] + x1) / 2 })));
    }
  }
  if (problems.length) throw new Error(`data/shetachim.json:\n  ${problems.join('\n  ')}`);

  // One mosaic of everything, so every piece shares its edges exactly with its neighbours.
  const names = ['areas', ...Object.keys(layers)];
  const input = { 'areas.json': collectionOf(areas) };
  for (const [name, layer] of Object.entries(layers)) input[`${name}.json`] = layer;
  const mosaic = JSON.parse((await mapshaper.applyCommands(
    `-i ${names.map((n) => `${n}.json`).join(' ')} combine-files -union target=${names.join(',')} name=mosaic -o mosaic.json format=geojson`, input,
  ))['mosaic.json']).features.filter((f) => f.properties.id);

  const whole = new Map(claims.filter((c) => c.level === LEVEL.state).map((c) => [c.state, c.shetach]));
  const slivers = [];
  for (const f of mosaic) {
    const p = f.properties, P = prefix.get(p.id);
    if (!P) { p.shetach = whole.get(p.id) ?? null; continue; }
    if (p[`${P}town`] == null && p[`${P}county`] == null && p[`${P}all`] == null && p[`${P}tract`] == null) { slivers.push(f); continue; }
    let best = null;
    for (const c of byState.get(p.id)) {
      const hit = c.level === LEVEL.state
        || (c.level === LEVEL.band && p[`${P}mid`] >= c.from && p[`${P}mid`] <= c.to)
        || (c.level === LEVEL.county && p[`${P}county`] === c.county)
        || (c.level === LEVEL.town && p[`${P}town`] === c.town)
        || (c.level === LEVEL.tract && p[`${P}tract`] === c.tract);
      if (hit && (!best || c.level > best.level)) best = c;
    }
    p.shetach = best ? best.shetach : null;
  }
  const resolved = index(mosaic.filter((f) => f.properties.shetach !== undefined));
  for (const f of slivers) {
    const ring = polygonsOf(f.geometry)[0][0];
    const [x, y] = ring.reduce(([sx, sy], [px, py]) => [sx + px / ring.length, sy + py / ring.length], [0, 0]);
    let best = null;
    for (const { f: g, box } of resolved) {
      if (g.properties.id !== f.properties.id) continue;
      const near = Math.max(box[0] - x, x - box[2], box[1] - y, y - box[3], 0) * 80; // km, a lower bound
      if (best && near > best.km) continue;
      const km = contains(g, x, y) ? 0 : kmTo(g, x, y);
      if (!best || km < best.km) best = { g, km };
    }
    f.properties.shetach = best ? best.g.properties.shetach : null;
  }
  for (const f of mosaic) {
    const p = f.properties;
    f.properties = {
      piece: prefix.has(p.id) ? `${p.id}:${p.shetach ?? 'none'}` : p.id,
      state: p.id, name: p.name, abbr: p.abbr, country: p.country, shetach: p.shetach,
    };
  }

  const rough = JSON.stringify(ROUGH).replace(/"/g, "'");
  const out = await mapshaper.applyCommands(
    '-i mosaic.json -dissolve piece copy-fields=state,name,abbr,country,shetach -rename-fields id=piece -rename-layers areas ' +
    '-o pieces.json format=geojson ' +
    `-simplify variable interval="${rough}.includes(state) ? 2500 : 500" keep-shapes ` +
    '-filter-islands min-area=40km2 remove-empty ' +
    '-o geo.json format=topojson quantization=100000',
    { 'mosaic.json': collectionOf(mosaic) },
  );
  fs.writeFileSync(path.join(OUT, 'geo.json'), out['geo.json']);
  const pieces = JSON.parse(out['pieces.json']).features;
  const splitPieces = pieces.filter((f) => split.includes(f.properties.state));
  console.log(`${data.shetachim.length} shetachim; split states: ${split.join(', ') || 'none'} (${splitPieces.length} pieces); ` +
    `blank: ${pieces.filter((f) => !f.properties.shetach).map((f) => f.properties.name).join(', ') || 'none'}`);
  return { pieces, split };
}

// Capitals: a known center (or a lat/lon), placed on that center's dot. One in the wrong shetach is
// reported, not refused, since the lists are still being checked.
function checkCapitals(data, dots, pieceOf) {
  const problems = [], warnings = [];
  const dotOf = new Map(dots.flatMap((d) => d.centers.map((c) => [c.id, { d, c }])));
  for (const s of data.shetachim) {
    const cap = s.capital;
    if (!cap) continue;
    if (cap.centerId !== undefined) {
      const hit = dotOf.get(String(cap.centerId));
      if (!hit) { problems.push(`${s.id}: capital centerId ${cap.centerId} isn't in the centers data`); continue; }
      Object.assign(cap, {
        centerId: String(cap.centerId), name: cap.name || hit.c.name, city: hit.c.city,
        lat: +hit.d.lat.toFixed(5), lon: +hit.d.lon.toFixed(5),
      });
      const owner = pieceOf(hit.d);
      if (owner !== s.id) warnings.push(`${s.name}: capital ${cap.name} (${cap.centerId}) is in ${owner ?? 'an area with no shetach'}`);
    } else if (!Number.isFinite(cap.lat) || !Number.isFinite(cap.lon) || !cap.name) {
      problems.push(`${s.id}: the capital needs a centerId, or a name, lat and lon`);
    }
  }
  if (problems.length) throw new Error(`data/shetachim.json:\n  ${problems.join('\n  ')}`);
  for (const w of warnings) console.warn(`warning: ${w}`);
  return warnings;
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

  console.log('building map geometry…');
  const shetachData = readJSON(at('data', 'shetachim.json'));
  const { pieces, split } = await buildGeo(shetachData);

  console.log('tagging centers…');
  const countryIdx = index(readJSON(await cached('countries')).features);
  const regionIdx = index(readJSON(await cached('admin1')).features.filter((f) => UNIT_COUNTRIES.includes(f.properties.adm0_a3)));
  const countyIdx = index(readJSON(await countiesGeoJSON()).features);
  const pieceIdx = new Map(split.map((state) => [state, index(pieces.filter((f) => f.properties.state === state))]));
  const shetachOfPiece = new Map(pieces.map((f) => [f.properties.id, f.properties.shetach]));

  // The piece of a split state a point is in (the nearest one if it's just off the coast).
  function pieceAt(region, x, y) {
    const idx = pieceIdx.get(region);
    if (!idx) return undefined;
    const hit = locate(idx, x, y);
    if (hit) return hit.f.properties.id;
    return idx.reduce((a, b) => (kmTo(a.f, x, y) <= kmTo(b.f, x, y) ? a : b)).f.properties.id;
  }

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
    dot.piece = pieceAt(dot.region, x, y);
  }

  const dots = mergeIntoDots(centers.filter((c) => Number.isFinite(c.lat) && Number.isFinite(c.lon)));
  dots.forEach(tag);
  for (const d of dots) d.suspect = suspectReason(d) || undefined;

  const toFeature = (d) => ({
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [+d.lon.toFixed(5), +d.lat.toFixed(5)] },
    properties: {
      country: d.country, region: d.region, piece: d.piece, county: d.county, suspect: d.suspect,
      centers: d.centers.map(({ lat, lon, ...c }) => c),
    },
  });
  fs.writeFileSync(path.join(OUT, 'centers.geojson'), JSON.stringify({ type: 'FeatureCollection', features: dots.map(toFeature) }));

  const cities = buildCities(dots);
  for (const c of cities) c.piece = pieceAt(c.region, c.lon, c.lat);
  fs.writeFileSync(path.join(OUT, 'cities.json'), `[\n${cities.map(({ unmatched, ...c }) => JSON.stringify(c)).join(',\n')}\n]\n`);

  const pieceOf = (d) => shetachOfPiece.get(d.piece ?? d.region) ?? null;
  const warnings = checkCapitals(shetachData, dots, pieceOf);
  // The short label: as given, else the abbreviations of its whole states and provinces joined (KS-MO).
  const abbrOf = new Map(pieces.map((f) => [f.properties.state, f.properties.abbr]));
  for (const s of shetachData.shetachim) {
    if (s.short === undefined && s.territory.every((t) => typeof t === 'string')) s.short = s.territory.map((t) => abbrOf.get(t)).join('-');
    if (!s.short) warnings.push(`${s.id}: no short label (needed for a shetach that is part of a state)`);
  }
  const forPage = {
    notShown: shetachData.notShown || [],
    shetachim: shetachData.shetachim.map(({ id, name, short, headShliach, lastName, capital }) => ({ id, name, short, headShliach, lastName, capital })),
  };
  fs.writeFileSync(path.join(OUT, 'shetachim.json'), `${JSON.stringify(forPage, null, 1)}\n`);

  fs.writeFileSync(at('data', 'report.md'), report(centers, dots, cities, shetachData, pieces, warnings));
  console.log(`done: ${centers.length} centers -> ${dots.length} dots, ${cities.length} cities in the US and Canada`);
}

// ---------- report ----------

function report(centers, dots, cities, shetachData, pieces, warnings) {
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

## Shetachim

${shetachData.shetachim.length} entered. No shetach (left blank): ${pieces.filter((f) => !f.properties.shetach).map((f) => f.properties.name).join(', ') || 'none'}.

| Shetach | Short | Head shliach | Capital |
|---|---|---|---|
${shetachData.shetachim.map((s) => `| ${s.name} | ${s.short || ''} | ${s.headShliach || ''} | ${s.capital ? `${s.capital.name}${s.capital.city ? `, ${s.capital.city}` : ''}` : ''} |`).join('\n')}
${warnings.length ? `\nTo check:\n\n${warnings.map((w) => `- ${w}`).join('\n')}\n` : ''}
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
