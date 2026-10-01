// Builds the map's data files from the chabad.org export and public boundary data.
//
//   npm install
//   npm run build
//
// In:
//   data/raw/chabad-centers.json        chabad.org centers export ({ data: [...] })
//   data/extra-centers.json             centers missing from chabad.org
//   data/shetachim.json                 the shetachim: name, head shliach, territory, capital
//   data/shapes/*.geojson               boundary shapes a shetach can claim (Brisbane's urban area, the Gold Coast)
// Out:
//   web/data/shetachim.json             the shetachim for the page: names, head shluchim, capitals with positions
//   web/data/geo.json                   TopoJSON, one object `areas`: the US states, DC and Canadian provinces
//                                       (minus `notShown`) and every country, Mexican and Australian state a
//                                       shetach claims, with split areas cut into one piece per shetach; each
//                                       piece has its state (or country) and its shetach (null where none is entered)
//   web/data/centers.geojson            one point per location (centers at the same spot merged)
//   web/data/cities.json                every city on the map with at least one center, biggest first
//   data/report.md                      counts and data problems worth a look
//
// Boundary files are downloaded once into .cache/ (Natural Earth; US Census counties, towns and tracts; GADM).
// City points and populations come from GeoNames, via the all-the-cities package.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import mapshaper from 'mapshaper';
import { geoArea } from 'd3-geo';
import geonames from 'all-the-cities';
import { merge as mergeTopo } from 'topojson-client';
import geojsonvt from 'geojson-vt';
import vtpbf from 'vt-pbf';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = path.join(ROOT, '.cache');
const OUT = path.join(ROOT, 'web', 'data');
const at = (...p) => path.join(ROOT, ...p);

const NE = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson';
const SOURCES = {
  admin1: `${NE}/ne_10m_admin_1_states_provinces.geojson`, // tagging: states/provinces
  admin1Lakes: `${NE}/ne_10m_admin_1_states_provinces_lakes.geojson`, // US state names/abbreviations only now
  countries: `${NE}/ne_10m_admin_0_countries.geojson`, // tagging: countries
  // US counties, Census 1:500k (2022), from the Census Bureau's GitHub (www2.census.gov isn't always reachable)
  counties: 'https://raw.githubusercontent.com/uscensusbureau/citysdk/master/v2/GeoJSON/500k/2022/county.json',
  // Canada's provinces: GADM (github.com/stephanietuerk/admin-boundaries, a plain-file mirror; GADM's own
  // site isn't reachable here), far more detailed than Natural Earth's 1:10m for the same provinces —
  // Natural Earth's Ontario was as coarse along the Detroit River as its US states were along the Hudson.
  caProvinces: 'https://raw.githubusercontent.com/stephanietuerk/admin-boundaries/master/lo-res/Admin1_simp10/gadm36_CAN_1.json',
};
// GADM's own fields don't give a usable code (HASC has a stray CA.NF for Newfoundland and Labrador,
// not the CA-NL everyone else here uses), so this is by hand; there are only 13.
const CA_PROVINCES = {
  Alberta: 'AB', 'British Columbia': 'BC', Manitoba: 'MB', 'New Brunswick': 'NB',
  'Newfoundland and Labrador': 'NL', 'Northwest Territories': 'NT', 'Nova Scotia': 'NS', Nunavut: 'NU',
  Ontario: 'ON', 'Prince Edward Island': 'PE', Québec: 'QC', Saskatchewan: 'SK', Yukon: 'YT',
};
// the same place, by state FIPS code: county-subdivision (towns) and tract
const CENSUS = 'https://raw.githubusercontent.com/uscensusbureau/citysdk/master/v2/GeoJSON/500k/2022';
// Every country outside the US and Canada: the same GADM mirror as Canada's provinces, unsimplified ("hi-res"),
// one file per ISO 3166-1 alpha-3 code and level (gadm36_FRA_0.json is France, gadm36_MEX_1.json its states).
// Unsimplified matters: GADM's countries share their borders point for point, and the mirror's lo-res files
// were each simplified on their own, so neighbours' borders no longer met (gaps and overlaps along every one).
const GADM = 'https://raw.githubusercontent.com/stephanietuerk/admin-boundaries/master/hi-res';
const gadmFile = (iso3, level) => download(`${GADM}/Admin${level}/gadm36_${iso3}_${level}.json`, `gadm-hi-${iso3}-${level}.json`);
// Some of GADM's names are old or wrong (Monaco's file says "Macao"; the shape is Monaco, checked by its coordinates).
const GADM_NAME_FIX = {
  MCO: 'Monaco', SWZ: 'Eswatini', MKD: 'North Macedonia', CPV: 'Cabo Verde', REU: 'Réunion', MAC: 'Macau', VIR: 'U.S. Virgin Islands',
  COD: 'DR Congo', COG: 'Republic of the Congo', BLM: 'Saint Barthélemy', MAF: 'Saint Martin',
};
// A country's short label, where its name is long and there's a real, familiar short form. Nowhere is an ISO code
// used as a label: a country without one here simply has no short form (its name shows where it fits).
const COUNTRY_SHORT = {
  GBR: 'UK', ARE: 'UAE', COD: 'DRC', COG: 'Congo', CAF: 'CAR', BIH: 'Bosnia', CZE: 'Czechia', DOM: 'Dom. Rep.', TTO: 'Trinidad',
  VCT: 'St. Vincent', KNA: 'St. Kitts', ATG: 'Antigua', STP: 'São Tomé', BES: 'Bonaire', TCA: 'Turks & Caicos', VGB: 'BVI', VIR: 'USVI',
  GNQ: 'Eq. Guinea', ZAF: 'S. Africa', KOR: 'S. Korea', SSD: 'S. Sudan', SAU: 'Saudi', NZL: 'NZ', MKD: 'N. Macedonia', XNC: 'N. Cyprus',
  BFA: 'Burkina', CYM: 'Cayman', BLM: 'St. Barth', MAF: 'St. Martin', LCA: 'St. Lucia', SXM: 'St. Maarten', VAT: 'Vatican',
  NCL: 'N. Caledonia', PRI: 'PR', CIV: 'Ivory Coast', SLE: 'S. Leone', GNB: 'G.-Bissau', LKA: 'Sri Lanka', SLV: 'El Salvador',
};
// The mirror's whole-country Russia is one ring (no islands, no Kaliningrad), so Russia is put together from its
// regions instead; the mirror has no Cabo Verde at all, so it's Natural Earth's (islands only, no shared border).
// Every country in the mirror. The ones no shetach claims are still built (marked \`outside\`): the physical map
// fades them out, and having them in the same topology means that fade meets the shetachim's borders exactly.
const GADM_ALL = ('ABW AFG AGO AIA ALB AND ARE ARG ARM ASM ATA ATF ATG AUS AUT AZE BDI BEL BEN BES BFA BGD BGR BHR BHS BIH BLM BLR BLZ BMU ' +
  'BOL BRA BRB BRN BTN BVT BWA CAF CHE CHL CHN CIV CMR COD COG COK COL COM CRI CUB CUW CXR CYM CYP CZE DEU DJI DMA DNK DOM DZA ECU ' +
  'EGY ERI ESH ESP EST ETH FIN FJI FLK FRA FRO FSM GAB GBR GEO GGY GHA GIN GLP GMB GNB GNQ GRC GRD GRL GTM GUF GUM GUY HKG HND HRV HTI HUN ' +
  'IDN IMN IND IOT IRL IRN IRQ ISL ISR ITA JAM JEY JOR JPN KAZ KEN KGZ KHM KIR KNA KOR KWT LAO LBN LBR LBY LCA LIE LKA LSO LTU LUX LVA ' +
  'MAC MAF MAR MCO MDA MDG MDV MEX MHL MKD MLI MLT MMR MNE MNG MNP MOZ MRT MSR MTQ MUS MWI MYS MYT NAM NCL NER NFK NGA NIC NIU NLD NOR ' +
  'NPL NRU NZL OMN PAK PAN PCN PER PHL PLW PNG POL PRI PRK PRT PRY PYF QAT REU ROU RUS RWA SAU SDN SEN SGP SGS SHN SLB SLE SLV SMR SOM SPM ' +
  'SRB SSD STP SUR SVK SVN SWE SWZ SXM SYC SYR TCA TCD TGO THA TJK TKM TLS TON TTO TUN TUR TUV TWN TZA UGA UKR URY UZB VAT VCT VEN VGB ' +
  'VIR VNM VUT WLF WSM XCL XKO XNC YEM ZAF ZMB ZWE').split(' ');
const FROM_LEVEL1 = ['RUS'];
const FROM_NATURAL_EARTH = ['CPV'];
// Israel, as the shetach list has it: GADM's Israel (which already includes the Golan Heights) together with
// Judea and Samaria, which GADM files as a region of a separate country code — only that region is taken, and
// it becomes part of Israel itself (same area, same name, no border between them).
const ISRAEL_EXTRA = { url: `${GADM}/Admin1/gadm36_PSE_1.json`, cache: 'gadm-hi-ISR-judea-samaria.json', region: 'West Bank' };
// The same file's other region, Gaza, isn't in any shetach: it's only land outside the map, under its own name.
const GAZA = { region: 'Gaza', code: 'GAZA', name: 'Gaza' };
// Countries a shetach list divides by state, like the US and Canada: each state is its own area (MX-JAL), with
// ISO 3166-2 codes; name, short form (none for Mexico's states except CDMX: their official abbreviations, like
// "Sin.", read badly as map labels). GADM's own codes (HASC) aren't ISO, so this is by hand.
const WORLD_STATES = {
  MEX: {
    prefix: 'MX',
    name: 'Mexico',
    states: {
      Aguascalientes: ['AGU', 'Aguascalientes', ''], 'Baja California': ['BCN', 'Baja California', ''],
      'Baja California Sur': ['BCS', 'Baja California Sur', ''], Campeche: ['CAM', 'Campeche', ''],
      Chiapas: ['CHP', 'Chiapas', ''], Chihuahua: ['CHH', 'Chihuahua', ''], Coahuila: ['COA', 'Coahuila', ''],
      Colima: ['COL', 'Colima', ''], 'Distrito Federal': ['CMX', 'Mexico City', 'CDMX'], Durango: ['DUR', 'Durango', ''],
      Guanajuato: ['GUA', 'Guanajuato', ''], Guerrero: ['GRO', 'Guerrero', ''], Hidalgo: ['HID', 'Hidalgo', ''],
      Jalisco: ['JAL', 'Jalisco', ''], 'México': ['MEX', 'State of Mexico', ''], 'Michoacán': ['MIC', 'Michoacán', ''],
      Morelos: ['MOR', 'Morelos', ''], Nayarit: ['NAY', 'Nayarit', ''], 'Nuevo León': ['NLE', 'Nuevo León', ''],
      Oaxaca: ['OAX', 'Oaxaca', ''], Puebla: ['PUE', 'Puebla', ''], 'Querétaro': ['QUE', 'Querétaro', ''],
      'Quintana Roo': ['ROO', 'Quintana Roo', ''], 'San Luis Potosí': ['SLP', 'San Luis Potosí', ''],
      Sinaloa: ['SIN', 'Sinaloa', ''], Sonora: ['SON', 'Sonora', ''], Tabasco: ['TAB', 'Tabasco', ''],
      Tamaulipas: ['TAM', 'Tamaulipas', ''], Tlaxcala: ['TLA', 'Tlaxcala', ''], Veracruz: ['VER', 'Veracruz', ''],
      'Yucatán': ['YUC', 'Yucatán', ''], Zacatecas: ['ZAC', 'Zacatecas', ''],
    },
  },
  AUS: {
    prefix: 'AU',
    name: 'Australia',
    // Ashmore and Cartier and the Coral Sea Islands (reefs) are left off; Jervis Bay is drawn, blank until claimed.
    skip: ['Ashmore and Cartier Islands', 'Coral Sea Islands Territory'],
    states: {
      'New South Wales': ['NSW', 'New South Wales', 'NSW'], Victoria: ['VIC', 'Victoria', 'Vic'], Queensland: ['QLD', 'Queensland', 'Qld'],
      'South Australia': ['SA', 'South Australia', 'SA'], 'Western Australia': ['WA', 'Western Australia', 'WA'],
      Tasmania: ['TAS', 'Tasmania', 'Tas'], 'Australian Capital Territory': ['ACT', 'Australian Capital Territory', 'ACT'],
      'Northern Territory': ['NT', 'Northern Territory', 'NT'], 'Jervis Bay Territory': ['JBT', 'Jervis Bay Territory', 'JBT'],
    },
  },
};
const WORLD_PREFIX = new Map(Object.entries(WORLD_STATES).map(([iso3, w]) => [w.prefix, iso3]));
const STATE_INFO = new Map(Object.values(WORLD_STATES).flatMap((w) => Object.values(w.states).map(([code, name, abbr]) => [`${w.prefix}-${code}`, { name, abbr }])));
// Boundary shapes a shetach can claim inside a state ({ "state": "AU-QLD", "shape": "brisbane-metro" }): data/shapes/<name>.geojson.
// A shape whose properties say "lakeEdges": true (Essex County with its waters) cuts a piece with no coast: its open
// edges are the international boundary in the lakes, with the shetach's own state's water across them, so the
// physical map draws them only with the country borders, not as a maritime line of the shetach.
const SHAPES = path.join(ROOT, 'data', 'shapes');
// A sliver left between a shape and the state's own (differently drawn) coast or border goes to the shape beside it.
const SLIVER_KM2 = 25;

const MERGE_METERS = 25; // centers closer than this are one dot (same building / campus)
const COAST_KM = 25; // a point just offshore is given to the nearest area within this distance
const UNIT_COUNTRIES = ['USA', 'CAN'];
const UNIT_ISO = ['US', 'CA'];
const CITY_KM = 60; // a GeoNames place this close with the same name is the center's city
const ROUGH = ['US-AK']; // drawn small in an inset, so simplified harder
// States cut by a boundary shape (Brisbane's councils, the City of Gold Coast, Essex County): drawn at 100 m, so the
// line follows the boundary closely when zoomed in, not the 800 m used for whole countries.
const FINE = ['AU-QLD', 'CA-ON'];

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
    pageId: raw.pageId || undefined, // an unlisted dot that shares a chabad.org page with a listed one
    ...(extra && raw.slug ? { slug: raw.slug } : {}),
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

// One entry per city that has a center on the map: at the GeoNames point for that name (nearest within CITY_KM; in
// the US and Canada, in the same state or province), else at the middle of its centers. Biggest cities first, so
// the map labels them first.
function buildCities(dots) {
  const places = new Map();
  for (const g of geonames) {
    const key = placeKey(g.name);
    if (!places.has(key)) places.set(key, []);
    places.get(key).push(g);
  }
  const groups = new Map();
  for (const d of dots) {
    if (!d.region || (!UNIT_ISO.includes(d.country) && !d.piece)) continue;
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
          if (UNIT_ISO.includes(g.country) ? regionOf(p) !== g.region : UNIT_ISO.includes(p.country)) continue;
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

// A territory item is a state, province or country code, or part of one: east and/or west of a longitude,
// counties, towns or census tracts (US), regions of a country (by GADM name), or a boundary shape. Where items
// overlap, the more specific one wins.
const LEVEL = { state: 0, band: 1, county: 2, region: 2, town: 3, shape: 3, tract: 4 };
const townKey = (s) => s.toLowerCase().replace(/ town$/, '').replace(/[^a-z]/g, '');
const d3range = (n) => Array.from({ length: n }, (_, i) => i);
const regionKey = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z]/g, '');

// Greece's regional units, which GADM doesn't have as a level: each as its GADM level-3 municipalities (Kallikratis).
// Only Central Macedonia's so far, the ones a shetach list divides.
const REGIONAL_UNITS = {
  GRC: {
    Thessaloniki: ['Thessaloniki', 'Kalamaria', 'Neapoli-Sykies', 'Pavlos Melas', 'Kordelio-Evosmos', 'Ampelokipoi-Menemeni',
      'Pylaia-Chortiatis', 'Delta', 'Thermaikos', 'Thermi', 'Oraiokastro', 'Chalkidona', 'Langadas', 'Volvi'],
    Chalkidiki: ['Polygyros', 'Kassandra', 'Sithonia', 'Nea Propontida', 'Aristotelis'],
    Kilkis: ['Kilkis', 'Paionia'],
    Serres: ['Serres', 'Amphipolis', 'Visaltia', 'Nea Zichni', 'Sintiki', 'Irakleia', 'Emmanouil Pappas'],
    Pella: ['Edessa', 'Almopia', 'Pella', 'Skydra'],
    Pieria: ['Katerini', 'Dio-Olympos', 'Pydna-Kolindros'],
    Imathia: ['Veria', 'Naousa', 'Alexandria'],
  },
};
const UNIT_LEVEL = 3;

// Which countries have region claims, and the finest GADM level any of them needs (needed before any geometry is
// loaded). A country can be claimed at several levels at once (a whole region, some municipalities, one level-1
// area): its areas are loaded at the finest, and each knows its name at every level above.
function regionLevels(data) {
  const levels = new Map(), problems = [];
  for (const s of data.shetachim) {
    for (const t of s.territory || []) {
      if (typeof t !== 'object' || !t.country) continue;
      const level = t.regionalUnits ? UNIT_LEVEL : t.level ?? 1;
      levels.set(t.country, Math.max(levels.get(t.country) ?? 0, level));
    }
  }
  return { levels, problems };
}

function readClaims(data, areaIds, counties, regionNames) {
  const problems = [];
  const stateOfFips = new Map(counties.features.map((f) => [f.properties.GEOID.slice(0, 2), `US-${f.properties.STUSPS}`]));
  const countyIds = new Set(counties.features.map((f) => f.properties.GEOID));
  const claims = [];
  const onState = (s, state) => {
    if (areaIds.has(state)) return true;
    problems.push(`${s.id}: unknown area "${state}"`);
    return false;
  };
  const add = (s, kind, state, extra = {}) => claims.push({ shetach: s.id, kind, level: LEVEL[kind], state, ...extra });
  for (const s of data.shetachim) {
    if (!s.id || !s.name || !Array.isArray(s.territory)) { problems.push(`${s.id || s.name || '?'}: needs id, name and territory`); continue; }
    for (const t of s.territory) {
      if (typeof t === 'string') {
        if (onState(s, t)) add(s, 'state', t);
      } else if (t.counties) {
        for (const c of t.counties) {
          if (countyIds.has(c)) add(s, 'county', stateOfFips.get(c.slice(0, 2)), { county: c });
          else problems.push(`${s.id}: unknown county "${c}"`);
        }
      } else if (t.country && (t.regions || t.regionalUnits)) {
        if (!onState(s, t.country)) continue;
        const units = REGIONAL_UNITS[t.country] || {};
        for (const u of t.regionalUnits || []) if (!units[u]) problems.push(`${s.id}: no regional unit "${u}" in ${t.country} (REGIONAL_UNITS in the build)`);
        const level = t.regionalUnits ? UNIT_LEVEL : t.level ?? 1;
        const names = t.regionalUnits ? t.regionalUnits.flatMap((u) => units[u] || []) : t.regions;
        const known = regionNames.get(`${t.country}|${level}`) || new Set();
        for (const r of names) {
          // more specific (finer) levels win over coarser ones, like counties over whole states
          if (known.has(regionKey(r))) claims.push({ shetach: s.id, kind: 'region', level: LEVEL.region + level / 10, regionLevel: level, state: t.country, region: regionKey(r), regionName: r });
          else problems.push(`${s.id}: no level-${level} region "${r}" in ${t.country}`);
        }
      } else if (t.shape && onState(s, t.state)) {
        if (fs.existsSync(path.join(SHAPES, `${t.shape}.geojson`))) add(s, 'shape', t.state, { shape: t.shape });
        else problems.push(`${s.id}: no shape file data/shapes/${t.shape}.geojson`);
      } else if (t.towns && onState(s, t.state)) {
        for (const town of t.towns) add(s, 'town', t.state, { town: townKey(town), townName: town });
      } else if (t.tracts && onState(s, t.state)) {
        for (const tract of t.tracts) add(s, 'tract', t.state, { tract });
      } else if ((t.westOf !== undefined || t.eastOf !== undefined) && onState(s, t.state)) {
        add(s, 'band', t.state, { from: t.eastOf ?? -180, to: t.westOf ?? 180 });
      } else if (!t.towns && !t.tracts && !t.shape) {
        problems.push(`${s.id}: can't read territory ${JSON.stringify(t)}`);
      }
    }
  }
  // Two shetachim may not claim the same thing (overlapping longitude ranges included).
  const seen = new Map();
  for (const c of claims) {
    const key = [c.state, c.kind, c.regionLevel ?? '', c.county ?? c.town ?? c.tract ?? c.region ?? c.shape ?? ''].join('|');
    const other = seen.get(key);
    if (other && other.shetach !== c.shetach && c.kind !== 'band') {
      problems.push(`${other.shetach} and ${c.shetach} both claim ${c.county ?? c.townName ?? c.tract ?? c.regionName ?? c.shape ?? c.state}`);
    }
    if (c.kind === 'band') {
      for (const o of claims) {
        if (o !== c && o.kind === 'band' && o.state === c.state && o.shetach !== c.shetach && o.from < c.to && c.from < o.to && o.shetach < c.shetach) {
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

// The map's areas: every US state and DC built from its own Census counties, and every Canadian province
// from GADM — both precise, and each mutually consistent within itself, unlike Natural Earth's coarser
// world-atlas polygons (too coarse for real detail: the Hudson around Manhattan, the Detroit River along
// Ontario). States with a shetach that isn't whole counties (a longitude cut, or specific towns/tracts)
// are cut finer just where they need to be; every county elsewhere is already its own piece.
async function buildGeo(data) {
  const notShown = data.notShown || [];
  const ne = readJSON(await cached('admin1Lakes'));
  const usMeta = new Map(ne.features
    .filter((f) => f.properties.adm0_a3 === 'USA' && !notShown.includes(f.properties.iso_3166_2))
    .map((f) => [f.properties.iso_3166_2, { name: f.properties.name, abbr: f.properties.postal }]));
  // Areas left off the map (Yukon, NWT, Nunavut) are still built, as land outside it, for the physical map's fade.
  const caAreas = readJSON(await cached('caProvinces')).features
    .filter((f) => CA_PROVINCES[f.properties.NAME_1])
    .map((f) => {
      const abbr = CA_PROVINCES[f.properties.NAME_1], state = `CA-${abbr}`;
      return featureOf(f.geometry, { state, name: f.properties.NAME_1, abbr, country: 'CA', ...(notShown.includes(state) ? { outside: true } : {}) });
    });

  const counties = readJSON(await countiesGeoJSON());
  const usCounties = counties.features
    .filter((f) => usMeta.has(`US-${f.properties.STUSPS}`))
    .map((f) => {
      const state = `US-${f.properties.STUSPS}`, meta = usMeta.get(state);
      return featureOf(f.geometry, { state, county: f.properties.GEOID, name: meta.name, abbr: meta.abbr, country: 'US' });
    });

  // Everywhere outside the US and Canada that some shetach claims: whole countries, the states of countries
  // divided by state (Mexico, Australia), and the regions of countries split by region (Greece, Italy, Ukraine).
  const { levels, problems: levelProblems } = regionLevels(data);
  const worldAreas = await worldLand(data, levels);
  const regionNames = new Map(); // "GRC|2" -> the level-2 region names there
  for (const f of worldAreas) {
    for (let level = 1; f.properties[`region${level}`]; level++) {
      const key = `${f.properties.state}|${level}`;
      if (!regionNames.has(key)) regionNames.set(key, new Set());
      regionNames.get(key).add(f.properties[`region${level}`]);
    }
  }

  const areaIds = new Set([...usMeta.keys(), ...caAreas.map((f) => f.properties.state), ...worldAreas.map((f) => f.properties.state)]);
  const { claims, problems } = readClaims(data, areaIds, counties, regionNames);
  problems.unshift(...levelProblems);
  const byState = new Map();
  for (const c of claims) {
    if (!byState.has(c.state)) byState.set(c.state, []);
    byState.get(c.state).push(c);
  }
  // States needing something finer than a whole county: a longitude cut (Pennsylvania) or specific towns
  // and census tracts (Massachusetts). A plain county claim (New York City, Long Island, the West Virginia
  // county in Western Pennsylvania) doesn't — every county is already its own piece below.
  const finer = [...byState].filter(([state, cs]) => state.startsWith('US-') && cs.some((c) => ['band', 'town', 'tract'].includes(c.kind))).map(([state]) => state);

  // Every US county everywhere, Canada's provinces and the world's areas in one layer: the map's real, mutually
  // consistent land (no two pieces of it overlap or leave a gap, so no other layer needs its own state/name/county
  // fields — only the refinements below do, kept to their own prefixed field so there's no name clash when
  // they're combined with land in the same mosaic).
  const land = [...caAreas, ...worldAreas, ...usCounties.filter((f) => !finer.includes(f.properties.state))];
  const layers = {};
  const prefix = new Map();
  const prefixOf = (state) => prefix.get(state) || prefix.set(state, `${state.replace('-', '_')}_`).get(state);
  for (const state of finer) {
    const cs = byState.get(state), P = prefixOf(state), meta = usMeta.get(state);
    const fips = counties.features.find((f) => `US-${f.properties.STUSPS}` === state)?.properties.GEOID.slice(0, 2);
    const stateCounties = usCounties.filter((f) => f.properties.state === state);
    const has = (kind) => cs.some((c) => c.kind === kind);
    if (has('town') || has('tract')) {
      const towns = readJSON(await censusLayer('county-subdivision', fips)).features;
      const known = new Set(towns.map((f) => townKey(f.properties.NAME)));
      for (const c of cs) if (c.kind === 'town' && !known.has(c.town)) problems.push(`${c.shetach}: no town "${c.townName}" in ${state}`);
      land.push(...towns.map((f) => featureOf(f.geometry, {
        [`${P}town`]: townKey(f.properties.NAME), county: f.properties.STATEFP + f.properties.COUNTYFP, state, name: meta.name, abbr: meta.abbr, country: 'US',
      })));
    } else {
      land.push(...stateCounties);
    }
    if (has('tract')) {
      const want = new Set(cs.filter((c) => c.kind === 'tract').map((c) => c.tract));
      const tracts = readJSON(await censusLayer('tract', fips)).features.filter((f) => want.has(f.properties.GEOID));
      for (const t of want) if (!tracts.some((f) => f.properties.GEOID === t)) problems.push(`no census tract "${t}" in ${state}`);
      layers[`${P}tracts`] = collectionOf(tracts.map((f) => featureOf(f.geometry, { [`${P}tract`]: f.properties.GEOID })));
    }
    if (has('band')) {
      // A longitude cut isn't a real boundary, so the rectangles are only ever intersected against the
      // state's own real counties below — how far past the state they reach doesn't matter.
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (const { box } of index(stateCounties)) { x0 = Math.min(x0, box[0]); y0 = Math.min(y0, box[1]); x1 = Math.max(x1, box[2]); y1 = Math.max(y1, box[3]); }
      const pad = 0.3, box = [x0 - pad, y0 - pad, x1 + pad, y1 + pad];
      const edges = cs.filter((c) => c.kind === 'band').flatMap((c) => [c.from, c.to]).filter((x) => x > box[0] && x < box[2]);
      const xs = [box[0], ...[...new Set(edges)].sort((a, b) => a - b), box[2]];
      layers[`${P}bands`] = collectionOf(xs.slice(1).map((x1, i) => featureOf(rect([xs[i], box[1], x1, box[3]]), { [`${P}mid`]: (xs[i] + x1) / 2 })));
    }
  }
  // Boundary shapes (Brisbane's urban area, the Gold Coast): like tracts, cut out of the state's own land, so
  // the state's coast and borders stay the state's; only the line through the state comes from the shape.
  const shapeStates = [...byState].filter(([, cs]) => cs.some((c) => c.kind === 'shape')).map(([state]) => state);
  const lakeShapes = new Set();
  for (const state of shapeStates) {
    const P = prefixOf(state);
    const names = [...new Set(byState.get(state).filter((c) => c.kind === 'shape').map((c) => c.shape))];
    layers[`${P}shapes`] = collectionOf(names.flatMap((name) => readJSON(path.join(SHAPES, `${name}.geojson`)).features
      .map((f) => {
        if (f.properties?.lakeEdges) lakeShapes.add(name);
        return featureOf(f.geometry, { [`${P}shape`]: name });
      })));
  }
  if (problems.length) throw new Error(`data/shetachim.json:\n  ${problems.join('\n  ')}`);
  layers.land = await cleanLand(land);

  // One mosaic of everything, so every piece shares its edges exactly with its neighbours. Every point on the
  // map is covered by some real county, province, state or country polygon above, so a mosaic piece always has
  // a true state (and, in the US, county) to resolve against, whatever else happens to overlap it.
  const names = Object.keys(layers);
  const input = {};
  for (const [name, layer] of Object.entries(layers)) input[`${name}.json`] = layer;
  const mosaic = JSON.parse((await mapshaper.applyCommands(
    `-i ${names.map((n) => `${n}.json`).join(' ')} combine-files -union target=${names.join(',')} name=mosaic -o mosaic.json format=geojson`, input,
  ))['mosaic.json']).features.filter((f) => f.properties.state);

  for (const f of mosaic) {
    const p = f.properties, P = prefix.get(p.state), cs = byState.get(p.state) || [];
    let best = null;
    for (const c of cs) {
      const hit = c.kind === 'state'
        || (c.kind === 'county' && c.county === p.county)
        || (c.kind === 'region' && c.region === p[`region${c.regionLevel}`])
        || (P && c.kind === 'band' && p[`${P}mid`] != null && p[`${P}mid`] >= c.from && p[`${P}mid`] <= c.to)
        || (P && c.kind === 'town' && p[`${P}town`] === c.town)
        || (P && c.kind === 'shape' && p[`${P}shape`] === c.shape)
        || (P && c.kind === 'tract' && p[`${P}tract`] === c.tract);
      if (hit && (!best || c.level > best.level)) best = c;
    }
    p.shetach = best ? best.shetach : null;
    p.byShape = !!(best && best.kind === 'shape');
    p.lake = !!(best && best.kind === 'shape' && lakeShapes.has(best.shape));
  }
  const absorbed = absorbSlivers(mosaic.filter((f) => shapeStates.includes(f.properties.state)));
  if (absorbed) console.log(`${absorbed} slivers along shape edges given to the shape beside them`);
  const pieceOf = (p) => `${p.state}:${p.shetach ?? 'none'}`;
  const lakePieces = new Set(mosaic.filter((f) => f.properties.lake).map((f) => pieceOf(f.properties)));
  for (const f of mosaic) {
    const p = f.properties, piece = pieceOf(p);
    f.properties = { piece, state: p.state, name: p.name, abbr: p.abbr, country: p.country, shetach: p.shetach, outside: !!p.outside, lake: lakePieces.has(piece) };
  }

  // Small islands are dropped to keep the page light, except from areas that are small altogether (Bermuda, the
  // Caribbean islands, Monaco…), which would otherwise vanish.
  const rough = JSON.stringify(ROUGH).replace(/"/g, "'");
  const fine = JSON.stringify(FINE).replace(/"/g, "'");
  const out = await mapshaper.applyCommands(
    '-i mosaic.json -dissolve piece copy-fields=state,name,abbr,country,shetach,outside,lake -rename-fields id=piece -rename-layers areas ' +
    '-o pieces.json format=geojson ' +
    `-simplify variable interval="${rough}.includes(state) ? 2500 : ${fine}.includes(state) ? 100 : country === 'US' ? 400 : 800" keep-shapes ` +
    `-each "size = this.area < 2e9 ? 'small' : 'big'" -split size ` +
    '-filter-islands min-area=40km2 remove-empty target=big ' +
    '-merge-layers target=big,small force name=areas -filter-fields id,state,name,abbr,country,shetach,outside,lake ' +
    '-o world.json format=topojson quantization=100000 ' +
    '-filter "!outside" -filter-fields id,state,name,abbr,country,shetach ' +
    '-o geo.json format=topojson quantization=100000',
    { 'mosaic.json': collectionOf(mosaic) },
  );
  fs.writeFileSync(path.join(OUT, 'geo.json'), out['geo.json']);
  writeTiles(JSON.parse(out['world.json']));
  const pieces = JSON.parse(out['pieces.json']).features.filter((f) => !f.properties.outside);
  const byStateCount = count(pieces, (f) => f.properties.state);
  const split = byStateCount.filter(([, n]) => n > 1).map(([state]) => state);
  console.log(`${data.shetachim.length} shetachim; split areas: ${split.join(', ') || 'none'} (${pieces.filter((f) => split.includes(f.properties.state)).length} pieces); ` +
    `blank: ${pieces.filter((f) => !f.properties.shetach).map((f) => f.properties.name).join(', ') || 'none'}`);
  return { pieces, split };
}

// Everywhere outside the US and Canada the shetachim claim, as land features { state, name, abbr, country },
// plus region/regionName where a country is split by region. All of it is simplified together, lightly (far
// below the map's own simplification), in one pass that keeps shared borders shared; cached in .cache/.
async function worldLand(data, levels) {
  const whole = new Set(levels.keys()), divided = new Set();
  for (const t of data.shetachim.flatMap((s) => s.territory)) {
    if (typeof t !== 'string' || /^(US|CA)-/.test(t)) continue;
    const m = /^([A-Z]{2})-/.exec(t);
    if (!m) whole.add(t);
    else if (WORLD_PREFIX.has(m[1])) divided.add(WORLD_PREFIX.get(m[1]));
  }
  const outside = GADM_ALL.filter((c) => !whole.has(c) && !divided.has(c));
  const spec = JSON.stringify({ v: 4, whole: [...whole].sort(), divided: [...divided].sort(), levels: [...levels].sort(), outside });
  const file = path.join(CACHE, `world-${createHash('sha1').update(spec).digest('hex').slice(0, 10)}.json`);
  if (!fs.existsSync(file)) {
    const dir = fs.mkdtempSync(path.join(CACHE, 'world-')), files = [], missing = [];
    const write = (code, features) => {
      const f = path.join(dir, `${code}.json`);
      fs.writeFileSync(f, JSON.stringify(collectionOf(features)));
      files.push(f);
    };
    const neCountries = FROM_NATURAL_EARTH.some((c) => whole.has(c)) ? readJSON(await cached('countries')).features : [];
    for (const code of whole) {
      console.log(`world: ${code}`);
      const props = (name) => ({ state: code, name: GADM_NAME_FIX[code] || name || code, abbr: code, country: code });
      let features;
      if (FROM_NATURAL_EARTH.includes(code)) {
        features = neCountries.filter((f) => f.properties.ADM0_A3 === code).map((f) => featureOf(f.geometry, props(f.properties.NAME)));
      } else {
        const level = levels.get(code) ?? (FROM_LEVEL1.includes(code) ? 1 : 0);
        let gj;
        try { gj = readJSON(await gadmFile(code, level)); } catch { missing.push(code); continue; }
        features = gj.features.map((f) => featureOf(f.geometry, {
          ...props(f.properties.NAME_0 || f.properties.Name),
          ...(levels.has(code) ? Object.fromEntries(d3range(level).map((i) => [`region${i + 1}`, regionKey(f.properties[`NAME_${i + 1}`] || '')])) : {}),
        }));
        if (code === 'ISR') {
          const extra = readJSON(await download(ISRAEL_EXTRA.url, ISRAEL_EXTRA.cache)).features.filter((f) => f.properties.NAME_1 === ISRAEL_EXTRA.region);
          if (!extra.length) throw new Error('Judea and Samaria is missing from its GADM file');
          features.push(...extra.map((f) => featureOf(f.geometry, props('Israel'))));
        }
      }
      if (features.length) write(code, features); else missing.push(code);
    }
    for (const code of outside) {
      let gj;
      try { gj = readJSON(await gadmFile(code, FROM_LEVEL1.includes(code) ? 1 : 0)); } catch { console.log(`  (outside: no file for ${code})`); continue; }
      const name = GADM_NAME_FIX[code] || gj.features[0]?.properties.NAME_0 || gj.features[0]?.properties.Name || code;
      write(`outside-${code}`, gj.features.map((f) => featureOf(f.geometry, { state: code, name, abbr: code, country: code, outside: true })));
    }
    const gaza = readJSON(await download(ISRAEL_EXTRA.url, ISRAEL_EXTRA.cache)).features.filter((f) => f.properties.NAME_1 === GAZA.region);
    write('outside-gaza', gaza.map((f) => featureOf(f.geometry, { state: GAZA.code, name: GAZA.name, abbr: GAZA.code, country: GAZA.code, outside: true })));
    for (const iso3 of divided) {
      console.log(`world: ${iso3} states`);
      const { prefix: pre, states, skip = [] } = WORLD_STATES[iso3];
      const features = [];
      for (const f of readJSON(await gadmFile(iso3, 1)).features) {
        const st = states[f.properties.NAME_1];
        if (st) features.push(featureOf(f.geometry, { state: `${pre}-${st[0]}`, name: st[1], abbr: st[2], country: iso3 }));
        else if (!skip.includes(f.properties.NAME_1)) console.log(`  ${iso3}: "${f.properties.NAME_1}" not in WORLD_STATES, left off`);
      }
      write(`${iso3}-states`, features);
    }
    if (missing.length) throw new Error(`no boundary for: ${missing.join(', ')}`);
    console.log('world: simplifying (shared borders kept shared)…');
    await mapshaper.runCommands(`-i ${files.map((f) => `"${f}"`).join(' ')} combine-files -merge-layers force name=world ` +
      `-simplify interval=100 keep-shapes -o "${file}" format=geojson`);
    fs.rmSync(dir, { recursive: true });
  }
  const features = readJSON(file).features;
  for (const f of features) {
    const p = f.properties;
    if (GADM_NAME_FIX[p.state]) p.name = GADM_NAME_FIX[p.state];
    if (p.state === p.country) p.abbr = COUNTRY_SHORT[p.state] || '';
    if (STATE_INFO.has(p.state)) Object.assign(p, STATE_INFO.get(p.state)); // names and short forms as they are now, not as cached
  }
  return features;
}

// Neighbouring areas from different sources (Census counties next to GADM's Mexico and Canada) or digitised
// separately (GADM's India and Nepal) don't meet exactly: along a shared border they leave thin gaps and overlaps,
// which draw as a doubled, broken line. -clean fills the gaps and settles the overlaps, so every border is one
// shared line. Real water between areas is never filled: it's open to the sea, or far bigger than the threshold.
async function cleanLand(features) {
  console.log('snapping neighbouring areas together…');
  if (process.env.DUMP_LAND) fs.writeFileSync(process.env.DUMP_LAND, JSON.stringify(collectionOf(features)));
  const clean = async (list) => JSON.parse((await mapshaper.applyCommands('-i land.json -clean gap-fill-area=20km2 -o land.json format=geojson', { 'land.json': collectionOf(list) }))['land.json']);
  const once = await clean(features);
  return closeSeams(once.features) ? clean(once.features) : once;
}

// A gap -clean can't fill: two areas whose coasts run side by side a few metres apart, with the thin strip between
// them open to the sea at an end (the Baja California / Baja California Sur line across the whole peninsula, the
// US-Mexico border at Tijuana, Belgium-France at the coast). Each such stretch of one area's coast is moved onto the
// other's (its points onto the nearest point of the other's coast, within SEAM_M); the -clean after it fills what's
// left between them. Only coast points move — never a point on a border the area already shares — and never on
// small islands, so nothing else changes.
const SEAM_M = 400;
function closeSeams(features) {
  const segKey = (a, b) => (a[0] < b[0] || (a[0] === b[0] && a[1] < b[1]) ? `${a}|${b}` : `${b}|${a}`);
  const uses = new Map();
  const rings = [];
  features.forEach((f, fi) => {
    for (const poly of polygonsOf(f.geometry)) for (const ring of poly) {
      rings.push({ fi, ring });
      for (let j = 1; j < ring.length; j++) { const k = segKey(ring[j - 1], ring[j]); uses.set(k, (uses.get(k) || 0) + 1); }
    }
  });
  const coast = (a, b) => uses.get(segKey(a, b)) === 1;
  // coast segments in a grid of about SEAM_M
  const G = SEAM_M / 111320, grid = new Map(), cell = (x, y) => Math.floor(x / G) * 1e6 + Math.floor(y / G);
  for (const { fi, ring } of rings) {
    for (let j = 1; j < ring.length; j++) {
      const a = ring[j - 1], b = ring[j];
      if (!coast(a, b)) continue;
      const x0 = Math.floor(Math.min(a[0], b[0]) / G), x1 = Math.floor(Math.max(a[0], b[0]) / G);
      const y0 = Math.floor(Math.min(a[1], b[1]) / G), y1 = Math.floor(Math.max(a[1], b[1]) / G);
      if ((x1 - x0 + 1) * (y1 - y0 + 1) > 400) continue; // a long straight stretch; its ends are points anyway
      for (let gx = x0; gx <= x1; gx++) for (let gy = y0; gy <= y1; gy++) {
        const k = gx * 1e6 + gy;
        if (!grid.has(k)) grid.set(k, []);
        grid.get(k).push(fi, a, b);
      }
    }
  }
  const nearest = (fi, [x, y]) => {
    const kx = Math.cos((y * Math.PI) / 180) * 111320, ky = 110574;
    let best = null, bd = SEAM_M;
    const cx = Math.floor(x / G), cy = Math.floor(y / G);
    for (let gx = cx - 1; gx <= cx + 1; gx++) for (let gy = cy - 1; gy <= cy + 1; gy++) {
      const list = grid.get(gx * 1e6 + gy);
      if (!list) continue;
      for (let i = 0; i < list.length; i += 3) {
        if (list[i] <= fi) continue; // each pair moves one way only: the lower-numbered area onto the higher
        const a = list[i + 1], b = list[i + 2];
        const ax = (a[0] - x) * kx, ay = (a[1] - y) * ky, bx = (b[0] - x) * kx, by = (b[1] - y) * ky;
        const dx = bx - ax, dy = by - ay, t = dx || dy ? clampNum(-(ax * dx + ay * dy) / (dx * dx + dy * dy), 0, 1) : 0;
        const d = Math.hypot(ax + t * dx, ay + t * dy);
        if (d < bd) { bd = d; best = { to: [a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])], other: list[i] }; }
      }
    }
    return best;
  };
  let moved = 0;
  const pairs = new Map();
  for (const { fi, ring } of rings) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const [x, y] of ring) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    if ((x1 - x0) * Math.cos((y0 * Math.PI) / 180) < 0.05 && y1 - y0 < 0.05) continue; // small island: leave it be
    const n = ring.length - 1, moves = [];
    for (let j = 0; j < n; j++) {
      const prev = ring[(j - 1 + n) % n], p = ring[j], next = ring[j + 1];
      if (!coast(prev, p) || !coast(p, next)) continue;
      const hit = nearest(fi, p);
      if (hit) moves.push([j, hit]);
    }
    for (const [j, hit] of moves) {
      ring[j] = hit.to;
      if (j === 0) ring[n] = hit.to;
      moved++;
      const key = [features[fi].properties.state, features[hit.other].properties.state].sort().join(' / ');
      pairs.set(key, (pairs.get(key) || 0) + 1);
    }
  }
  const top = [...pairs].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([k, n]) => `${k} (${n})`).join(', ');
  console.log(`seams closed: ${moved} coast points moved onto a neighbour's coast${top ? `; most along ${top}` : ''}`);
  return moved;
}
const clampNum = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// The physical map's own data as static vector tiles (web/tiles/{z}/{x}/{y}.pbf, zooms 0-6; the map scales the
// zoom-6 tiles up past that), so a phone only ever loads and draws the part it's looking at, already simplified
// for that zoom. Two layers:
//   land   every area, merged by country; c = its country, or '' for land outside the map (the page fades
//          whatever isn't in the view)
//   lines  every edge between two areas (or an area and the sea), with both sides' countries (ca, cb), and
//          whether the two share a state (ss) and a shetach (sh); lk marks an open edge that's a lake boundary
//          inside a shetach (a "lakeEdges" shape), not a coast. The page picks the edges its view needs.
const TILES = path.join(OUT, '..', 'tiles');
const TILE_ZOOM = 6;
function writeTiles(topo) {
  const geoms = topo.objects.areas.geometries;
  const { scale: [kx, ky], translate: [dx, dy] } = topo.transform;
  const arcs = topo.arcs.map((arc) => { let x = 0, y = 0; return arc.map(([a, b]) => [(x += a) * kx + dx, (y += b) * ky + dy]); });
  const sides = arcs.map(() => []);
  const visit = (rings, gi) => { for (const ring of rings) for (const a of ring) sides[a < 0 ? ~a : a].push(gi); };
  geoms.forEach((g, gi) => { if (g.type === 'Polygon') visit(g.arcs, gi); else if (g.type === 'MultiPolygon') for (const poly of g.arcs) visit(poly, gi); });
  const code = (p) => (p.outside ? '' : p.country);
  const lines = [];
  arcs.forEach((coords, i) => {
    const [a, b] = sides[i].map((gi) => geoms[gi].properties);
    if (!a || (b && code(a) === '' && code(b) === '')) return;
    if (!b && coords.every(([x]) => Math.abs(x) > 179.99)) return; // the cut along 180°, not a coast
    const props = b ? { ca: code(a), cb: code(b), ss: a.state === b.state ? 1 : 0, sh: (a.shetach || '') === (b.shetach || '') ? 1 : 0 } : { ca: code(a), ...(a.lake ? { lk: 1 } : {}) };
    lines.push(featureOf({ type: 'LineString', coordinates: coords }, props));
  });
  const byCode = new Map();
  for (const g of geoms) {
    if (!g.type) continue;
    const c = code(g.properties);
    if (!byCode.has(c)) byCode.set(c, []);
    byCode.get(c).push(g);
  }
  const land = [...byCode].map(([c, gs]) => featureOf(mergeTopo(topo, gs), { c }));
  const opts = { maxZoom: TILE_ZOOM, indexMaxZoom: TILE_ZOOM, indexMaxPoints: 0, tolerance: 1.5, extent: 8192, buffer: 128 };
  const index = { land: geojsonvt(collectionOf(land), opts), lines: geojsonvt(collectionOf(lines), opts) };
  fs.rmSync(TILES, { recursive: true, force: true });
  const coords = new Map();
  for (const ix of Object.values(index)) for (const { z, x, y } of ix.tileCoords) coords.set(`${z}/${x}/${y}`, [z, x, y]);
  let n = 0, bytes = 0;
  for (const [key, [z, x, y]] of coords) {
    const layers = {};
    for (const [name, ix] of Object.entries(index)) {
      const t = ix.getTile(z, x, y);
      if (t && t.features.length) layers[name] = t;
    }
    if (!Object.keys(layers).length) continue;
    const buf = Buffer.from(vtpbf.fromGeojsonVt(layers, { version: 2, extent: opts.extent }));
    fs.mkdirSync(path.join(TILES, String(z), String(x)), { recursive: true });
    fs.writeFileSync(path.join(TILES, `${key}.pbf`), buf);
    n++;
    bytes += buf.length;
  }
  console.log(`tiles: ${n} files, ${(bytes / 1e6).toFixed(1)} MB (${lines.length} edges, ${land.length} land groups)`);
}

// Area in km² of a GeoJSON (Multi)Polygon, whichever way its rings wind.
function km2(geometry) {
  let s = 0;
  for (const poly of polygonsOf(geometry)) {
    poly.forEach((ring, i) => {
      let a = geoArea({ type: 'Polygon', coordinates: [ring] });
      a = Math.min(a, 4 * Math.PI - a);
      s += (i ? -1 : 1) * a;
    });
  }
  return s * 6371 * 6371;
}

// A shape (an ABS boundary) and the state it cuts (GADM) draw the same coast and borders slightly differently, which
// leaves thin slivers of the state just outside the shape. Each small piece that isn't the shape's but borders one
// goes to the shape it shares the most edge with. Mosaic pieces share their vertices exactly, so shared edges are
// found by matching segments.
function absorbSlivers(features) {
  const segKey = (a, b) => (a[0] < b[0] || (a[0] === b[0] && a[1] < b[1]) ? `${a}|${b}` : `${b}|${a}`);
  const owners = new Map();
  features.forEach((f, i) => {
    for (const poly of polygonsOf(f.geometry)) for (const ring of poly) {
      for (let j = 1; j < ring.length; j++) {
        const k = segKey(ring[j - 1], ring[j]);
        if (!owners.has(k)) owners.set(k, []);
        owners.get(k).push(i);
      }
    }
  });
  let n = 0;
  features.forEach((f, i) => {
    if (f.properties.byShape || km2(f.geometry) >= SLIVER_KM2) return;
    const shared = new Map();
    for (const poly of polygonsOf(f.geometry)) for (const ring of poly) {
      for (let j = 1; j < ring.length; j++) {
        for (const o of owners.get(segKey(ring[j - 1], ring[j]))) {
          if (o === i || !features[o].properties.byShape) continue;
          shared.set(o, (shared.get(o) || 0) + Math.hypot(ring[j][0] - ring[j - 1][0], ring[j][1] - ring[j - 1][1]));
        }
      }
    }
    if (!shared.size) return;
    const [best] = [...shared].sort((a, b) => b[1] - a[1])[0];
    f.properties.shetach = features[best].properties.shetach;
    n++;
  });
  return n;
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
  const extrasData = fs.existsSync(extrasFile) ? readJSON(extrasFile) : {};
  const extras = extrasData.centers || [];
  const fixes = extrasData.fixes || {};

  const toRaw = (e) => ({ ...e, coordinates: { latitude: e.lat, longitude: e.lon }, 'location-is-approximate': e.precision !== 'exact' });
  const centers = [...raw.map((r) => normalize(r)), ...extras.map((e) => normalize(toRaw(e), true))];
  for (const c of centers) {
    const fix = fixes[c.id];
    if (fix) { const { why, ...f } = fix; Object.assign(c, f, { approx: undefined }); }
  }
  const bad = centers.filter((c) => !Number.isFinite(c.lat) || !Number.isFinite(c.lon));
  if (bad.length) console.warn(`${bad.length} centers have no coordinates and are skipped`);

  // Who runs each center (scripts/chabad-personnel-scrape.js, run by hand in a browser — this
  // sandbox can't reach chabad.org). Optional: the map works without it.
  const personnelFile = at('data', 'raw', 'chabad-personnel.json');
  const personnelById = fs.existsSync(personnelFile) ? new Map(Object.entries(readJSON(personnelFile).personnel || {})) : new Map();
  for (const c of centers) { const p = personnelById.get(c.id); if (p && p.length) c.personnel = p; }
  if (personnelById.size) console.log(`personnel: ${personnelById.size} of ${centers.length} centers`);

  console.log('building map geometry…');
  const shetachData = readJSON(at('data', 'shetachim.json'));
  const { pieces, split } = await buildGeo(shetachData);

  console.log('tagging centers…');
  const countryIdx = index(readJSON(await cached('countries')).features);
  const regionIdx = index(readJSON(await cached('admin1')).features.filter((f) => UNIT_COUNTRIES.includes(f.properties.adm0_a3)));
  const countyIdx = index(readJSON(await countiesGeoJSON()).features);
  // Every state/province, not just the split ones, in case a shetach's shape ends up needing it.
  const pieceIdx = new Map([...new Set(pieces.map((f) => f.properties.state))].map((state) => [state, index(pieces.filter((f) => f.properties.state === state))]));
  const shetachOfPiece = new Map(pieces.map((f) => [f.properties.id, f.properties.shetach]));
  const worldPieces = pieces.filter((f) => !UNIT_ISO.includes(f.properties.country));
  const worldIdx = index(worldPieces);
  const worldIdxOf = new Map([...new Set(worldPieces.map((f) => f.properties.country))].map((c) => [c, index(worldPieces.filter((f) => f.properties.country === c))]));
  const countryName = (f) => WORLD_STATES[f.properties.country]?.name || f.properties.name;
  // Natural Earth's codes where they differ from GADM's
  const NE_CODE = { KOS: 'XKO', CYN: 'XNC', SOL: 'SOM', SDS: 'SSD' };

  // The piece of a split state a point is in (the nearest one if it's just off the coast).
  function pieceAt(region, x, y) {
    const idx = pieceIdx.get(region);
    if (!idx) return undefined;
    const hit = locate(idx, x, y);
    if (hit) return hit.f.properties.id;
    return idx.reduce((a, b) => (kmTo(a.f, x, y) <= kmTo(b.f, x, y) ? a : b)).f.properties.id;
  }

  // Outside the US and Canada the map's own areas decide (Natural Earth only for countries the map doesn't draw):
  // the area the point is in, else, just offshore, the nearest area of the same country (or of any, at sea).
  function tagWorld(dot, ne) {
    const { lon: x, lat: y } = dot;
    const neCode = ne ? NE_CODE[ne.f.properties.ADM0_A3] || ne.f.properties.ADM0_A3 : null;
    let hit = worldIdx.find(({ f, box }) => x >= box[0] && x <= box[2] && y >= box[1] && y <= box[3] && contains(f, x, y));
    if (!hit) {
      const idx = neCode ? worldIdxOf.get(neCode) : worldIdx;
      const near = idx && locate(idx, x, y);
      if (near) hit = near;
    }
    if (hit) {
      const p = hit.f.properties;
      Object.assign(dot, { country: p.country, countryName: countryName(hit.f), region: p.state, piece: p.id });
    } else if (ne) {
      Object.assign(dot, { country: neCode, countryName: ne.f.properties.NAME, region: neCode });
    }
  }

  function tag(dot) {
    const { lon: x, lat: y } = dot;
    const country = locate(countryIdx, x, y);
    const iso2 = country ? country.f.properties.ISO_A2_EH : null;
    if (!UNIT_ISO.includes(iso2)) { tagWorld(dot, country); return; }
    dot.country = iso2;
    dot.countryName = country.f.properties.NAME;
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
  // The short label (one, or a list from longest to shortest): as given, else a single whole state's or province's
  // abbreviation (TX). A country's
  // name is its own label (never an ISO code like NPL); where it doesn't fit, there's no label.
  const abbrOf = new Map(pieces.map((f) => [f.properties.state, f.properties.abbr]));
  for (const s of shetachData.shetachim) {
    if (!s.territory.length) continue; // not drawn yet, so no label to worry about
    const states = s.territory.every((t) => typeof t === 'string' && t.includes('-'));
    // A whole single state's own abbreviation; never state codes joined (the owner wants a real short form for those,
    // given in the data: "WC", "LA"; joined codes only where asked, KS-MO and MB-SK).
    if (s.short === undefined && states && s.territory.length === 1 && abbrOf.get(s.territory[0])) s.short = abbrOf.get(s.territory[0]);
    if (s.short === undefined && states && s.territory.length > 1) warnings.push(`${s.id}: no short label (give one: state codes aren't joined)`);
    else if (s.short === undefined && s.territory.length === 1 && COUNTRY_SHORT[s.territory[0]]) s.short = COUNTRY_SHORT[s.territory[0]];
    if (!s.short && s.territory.some((t) => typeof t !== 'string')) warnings.push(`${s.id}: no short label (needed for a shetach that is part of a state)`);
    // Several short forms, longest first, step down as the shetach gets smaller on screen (The Carolinas → Carolinas → Car.).
    const shorts = [].concat(s.short || []);
    if (shorts.some((t, i) => t.length >= (i ? shorts[i - 1] : s.name).length)) warnings.push(`${s.id}: short forms should get shorter (${[s.name, ...shorts].join(' → ')})`);
  }
  const forPage = {
    notShown: shetachData.notShown || [],
    shetachim: shetachData.shetachim.map(({ id, name, short, headShliach, headTitle, lastName, capital }) => ({ id, name, short, headShliach, headTitle, lastName, capital })),
  };
  fs.writeFileSync(path.join(OUT, 'shetachim.json'), `${JSON.stringify(forPage, null, 1)}\n`);

  fs.writeFileSync(at('data', 'report.md'), report(centers, dots, cities, shetachData, pieces, warnings));
  console.log(`done: ${centers.length} centers -> ${dots.length} dots, ${cities.length} cities`);
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
- US + Canada: **${na.length}** centers, ${naDots.length} dots, ${cities.filter((c) => UNIT_ISO.includes(c.country)).length} cities
- Cities with shluchim on the map: ${cities.length}
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
