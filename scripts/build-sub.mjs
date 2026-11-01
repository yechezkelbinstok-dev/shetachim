// Sub-shetachim (data/sub-shetachim.json) into web/data/sub.json. Each is ONE piece with borders of its own (owner,
// Nov 1: "why are you using county situations you should be drawing your own borders", and then "Why the fuck have you
// made disconnected ones like the valley and inland empires with horrible borders"): the land its member houses span
// (the triangles between them, and the links that join them all into one), reaching a little past them, rounded, and
// cut where another of its shetach's houses is nearer: there the border runs halfway between. Never a county's line
// across empty land, never in bits. A region's members are listed (members), or are its parent shetach's houses within
// given areas (membersIn: US counties, L.A. County neighbourhoods, county subdivisions, a box, or a distance round a
// point), less any excluded; mushrooms never count. The areas only say who's a member: they don't draw the border.
// Whole areas of the map (areas: the Baja peninsula) go in as they are. Then it's cut to the parent shetach's land in
// the states its members are in (its own coast, and not over a state line) and split by state, so a view draws only its
// own countries' parts. Run after scripts/build-data.mjs, which makes geo.json, the centers and the counties (npm run
// build runs both).
import fs from 'node:fs';
import path from 'node:path';
import * as topojson from 'topojson-client';
import polygonClipping from 'polygon-clipping';
import { contours } from 'd3-contour';
import simplify from 'simplify-js';
import Delaunator from 'delaunator';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const CACHE = path.join(ROOT, '.cache');
const readJSON = (...p) => JSON.parse(fs.readFileSync(path.join(...p), 'utf8'));
const LA_HOODS = 'https://s3-us-west-2.amazonaws.com/boundaries.latimes.com/archive/1.0/boundary-set/la-county-neighborhoods-v6.geojson';
const CCD_URL = (fips) => `https://raw.githubusercontent.com/uscensusbureau/citysdk/master/v2/GeoJSON/500k/2022/${fips}/county-subdivision.json`;
// REACH: how far a region reaches past its houses (km; a region's own `reach` can say otherwise). LINK: houses this
// near one another (km) have the land between them filled; farther apart too, up to a third more than the longest link
// it takes to join all its houses into one (so a far house makes a wedge, not a thin arm). SMOOTH: how much its outline is rounded (km). CELL: the grid it's worked out on (km).
// LINKED: how near a house in a whole area must be to the region's other houses to tie the area to them (km).
// SPAN: what the land between its houses counts for, against another house nearby: as if a house were this far (km).
// TIDY: the narrowest spike or notch its outline keeps (km).
const REACH = 7, LINK = 12, SMOOTH = 6, CELL = 0.25, LINKED = 40, SPAN = 2, TIDY = 1;

const data = readJSON(ROOT, 'data', 'sub-shetachim.json');
// (the counties with the build's fixes; the newest, if there are several)
const countyFile = fs.readdirSync(CACHE).filter((f) => /^us-counties-\w+\.geojson$/.test(f))
  .map((f) => path.join(CACHE, f)).sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0];
if (!countyFile) throw new Error('no .cache/us-counties-*.geojson: run npm run build first');
const counties = new Map(readJSON(countyFile).features.map((f) => [f.properties.GEOID, f.geometry]));
const topo = readJSON(ROOT, 'web', 'data', 'geo.json');
const pieces = topo.objects.areas.geometries;
// every center's spot, state and shetach (web/data/centers.geojson: a dot is one spot, with the centers there)
const dots = readJSON(ROOT, 'web', 'data', 'centers.geojson').features.map((f) => {
  const [state, shetach] = (f.properties.piece || '').split(':');
  return { lon: f.geometry.coordinates[0], lat: f.geometry.coordinates[1], state: state || '', shetach: shetach || '', centers: f.properties.centers };
});
const kmApart = (a, b) => Math.hypot((a.lon - b.lon) * 111.32 * Math.cos((((a.lat + b.lat) / 2) * Math.PI) / 180), (a.lat - b.lat) * 110.57);

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
const not = (m) => { const o = new Uint8Array(m.length); for (let k = 0; k < m.length; k++) o[k] = m[k] ? 0 : 1; return o; };

// The links that join houses (km points) into one: their minimum spanning tree (Kruskal, over the Delaunay edges, which
// hold it), with the Delaunay triangles; [i, j, length] and [a, b, c]
function linksOf(km) {
  const len = (i, j) => Math.hypot(km[i][0] - km[j][0], km[i][1] - km[j][1]);
  if (km.length < 2) return { links: [], tris: [], len };
  if (km.length === 2) return { links: [[0, 1, len(0, 1)]], tris: [], len };
  const t = Delaunator.from(km).triangles, edges = new Map();
  const edge = (i, j) => edges.set(i < j ? `${i} ${j}` : `${j} ${i}`, len(i, j));
  for (let k = 0; k < t.length; k += 3) { edge(t[k], t[k + 1]); edge(t[k + 1], t[k + 2]); edge(t[k + 2], t[k]); }
  if (!t.length) { // all in a line: each to the next along it
    const far = km.reduce((b, p, i) => (len(0, i) > len(0, b) ? i : b), 0), [dx, dy] = [km[far][0] - km[0][0], km[far][1] - km[0][1]];
    const order = km.map((p, i) => [i, (p[0] - km[0][0]) * dx + (p[1] - km[0][1]) * dy]).sort((a, b) => a[1] - b[1]).map((e) => e[0]);
    for (let k = 1; k < order.length; k++) edge(order[k - 1], order[k]);
  }
  const up = km.map((_, i) => i), find = (i) => (up[i] === i ? i : (up[i] = find(up[i])));
  const links = [];
  for (const [key, l] of [...edges].sort((a, b) => a[1] - b[1])) {
    const [i, j] = key.split(' ').map(Number), a = find(i), b = find(j);
    if (a !== b) { up[a] = b; links.push([i, j, l]); }
  }
  const tris = [];
  for (let k = 0; k < t.length; k += 3) tris.push([t[k], t[k + 1], t[k + 2]]);
  return { links, tris, len };
}

// The region of its houses (seeds, [lon, lat]), in lon/lat, as polygons: the land they span (the triangles between
// them no longer than LINK, or than a third more than the longest link it takes to join them all, and those links),
// reaching `reach` past it, rounded (a closing by SMOOTH); of that, only the land nearer to one of its houses than to
// any of `others` (the shetach's other houses: each keeps the land nearer to it, so the border runs halfway between);
// in one piece without holes, traced smoothly and simplified a little.
function drawRegion(seeds, others, reach) {
  const lat0 = seeds.reduce((a, p) => a + p[1], 0) / seeds.length, lon0 = seeds.reduce((a, p) => a + p[0], 0) / seeds.length;
  const kx = 111.32 * Math.cos((lat0 * Math.PI) / 180), ky = 110.57;
  const toKm = ([lon, lat]) => [(lon - lon0) * kx, (lat - lat0) * ky];
  const km = seeds.map(toKm), okm = others.map(toKm);
  const { links, tris, len } = linksOf(km);
  const longest = Math.max(LINK, 1.3 * Math.max(0, ...links.map((e) => e[2])));
  drawRegion.longest = Math.max(0, ...links.map((e) => e[2]));
  const pad = reach + SMOOTH + 3;
  const xs = km.map((p) => p[0]), ys = km.map((p) => p[1]);
  const x0 = Math.min(...xs) - pad, y0 = Math.min(...ys) - pad, x1 = Math.max(...xs) + pad, y1 = Math.max(...ys) + pad;
  const cell = Math.max(CELL, Math.max(x1 - x0, y1 - y0) / 1600);
  const nx = Math.ceil((x1 - x0) / cell) + 1, ny = Math.ceil((y1 - y0) / cell) + 1, n = nx * ny;
  const span = new Uint8Array(n);
  const cols = (a, b) => [Math.max(0, Math.floor((a - x0) / cell) - 1), Math.min(nx - 1, Math.ceil((b - x0) / cell) + 1)];
  const rows = (a, b) => [Math.max(0, Math.floor((a - y0) / cell) - 1), Math.min(ny - 1, Math.ceil((b - y0) / cell) + 1)];
  // the triangles (not one with another house of the shetach in it: that one keeps its own land): every cell whose
  // centre is in one
  for (const [a, b, c] of tris) {
    if (len(a, b) > longest || len(b, c) > longest || len(c, a) > longest) continue;
    const [ax, ay] = km[a], [bx, by] = km[b], [cx, cy] = km[c];
    const den = (by - cy) * (ax - cx) + (cx - bx) * (ay - cy);
    if (Math.abs(den) < 1e-9) continue;
    const bary = (px, py) => { const l1 = ((by - cy) * (px - cx) + (cx - bx) * (py - cy)) / den, l2 = ((cy - ay) * (px - cx) + (ax - cx) * (py - cy)) / den; return [l1, l2, 1 - l1 - l2]; };
    if (okm.some(([px, py]) => bary(px, py).every((l) => l > 1e-6))) continue;
    const [i0, i1] = cols(Math.min(ax, bx, cx), Math.max(ax, bx, cx)), [j0, j1] = rows(Math.min(ay, by, cy), Math.max(ay, by, cy));
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
      if (bary(x0 + i * cell, y0 + j * cell).every((l) => l >= -1e-9)) span[j * nx + i] = 1;
    }
  }
  // the links and the houses: every cell within a cell of them
  const line = ([ax, ay], [bx, by]) => {
    const [i0, i1] = cols(Math.min(ax, bx), Math.max(ax, bx)), [j0, j1] = rows(Math.min(ay, by), Math.max(ay, by));
    const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy;
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
      const px = x0 + i * cell, py = y0 + j * cell, u = l2 ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / l2)) : 0;
      if (Math.hypot(px - ax - u * dx, py - ay - u * dy) <= cell) span[j * nx + i] = 1;
    }
  };
  for (const [i, j] of links) line(km[i], km[j]);
  for (const p of km) line(p, p);
  // how far each cell is from the span (km); the reach round it, closed by SMOOTH (grown, then shrunk back)
  const dSpan = edt(not(span), nx, ny);
  const band = new Uint8Array(n);
  for (let k = 0; k < n; k++) band[k] = dSpan[k] * cell <= reach ? 1 : 0;
  const toBand = edt(not(band), nx, ny), grown = new Uint8Array(n);
  for (let k = 0; k < n; k++) grown[k] = toBand[k] * cell <= SMOOTH ? 1 : 0;
  const inGrown = edt(grown, nx, ny);
  const flood = (m, start) => {
    const seen = new Uint8Array(n), stack = [];
    for (let k = 0; k < n; k++) if (m[k] && start(k)) { seen[k] = 1; stack.push(k); }
    while (stack.length) {
      const k = stack.pop(), i = k % nx, j = (k - i) / nx;
      for (const q of [i > 0 ? k - 1 : -1, i < nx - 1 ? k + 1 : -1, j > 0 ? k - nx : -1, j < ny - 1 ? k + nx : -1]) {
        if (q >= 0 && !seen[q] && m[q]) { seen[q] = 1; stack.push(q); }
      }
    }
    return seen;
  };
  // the land nearer to one of its houses than to any of the shetach's other houses (each of those keeps its own)
  const cellOf = ([x, y]) => { const i = Math.round((x - x0) / cell), j = Math.round((y - y0) / cell); return i >= 0 && j >= 0 && i < nx && j < ny ? j * nx + i : -1; };
  const mm = new Uint8Array(n).fill(1), om = new Uint8Array(n).fill(1), homes = km.map(cellOf), home = new Uint8Array(n);
  for (const k of homes) { mm[k] = 0; home[k] = 1; }
  let cut = false;
  for (const p of okm) { const k = cellOf(p); if (k >= 0) { om[k] = 0; cut = true; } }
  // (the land between its houses counts as if a house were SPAN km off: a link passing near another house doesn't
  // take that house's own surroundings, nor is it broken by a house farther off)
  const dMine = edt(mm, nx, ny), dOther = cut ? edt(om, nx, ny) : null;
  const keep = new Uint8Array(n);
  for (let k = 0; k < n; k++) {
    const mine = Math.min(dMine[k], dSpan[k] + SPAN / cell);
    keep[k] = (span[k] || band[k] || inGrown[k] * cell >= SMOOTH) && (!dOther || mine <= dOther[k]) ? 1 : 0;
  }
  // (if that still leaves its houses apart — another's land between them — the link between them stays, 3 km wide)
  const pieceOf = () => { // each kept cell's piece (a number), by flooding from each house in turn
    const id = new Int32Array(n);
    let m = 0;
    for (const h of homes) {
      if (id[h]) continue;
      m++;
      const one = flood(keep, (k) => k === h);
      for (let k = 0; k < n; k++) if (one[k]) id[k] = m;
    }
    return id;
  };
  let piece = pieceOf();
  for (const [i, j] of links) {
    if (piece[homes[i]] === piece[homes[j]]) continue;
    const [ax, ay] = km[i], [bx, by] = km[j], dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy || 1;
    for (let k = 0; k < n; k++) {
      const px = x0 + (k % nx) * cell, py = y0 + Math.floor(k / nx) * cell, u = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / l2));
      if (Math.hypot(px - ax - u * dx, py - ay - u * dy) <= 1.5) keep[k] = 1;
    }
    piece = pieceOf();
    console.log(`  (two of its houses, ${seeds[i].map((v) => v.toFixed(3))} and ${seeds[j].map((v) => v.toFixed(3))}, kept together across another's land)`);
  }
  // tidied: spikes and notches narrower than TIDY km rounded off (closed, then opened), unless that would part its houses
  const grow = (m, r) => { const d = edt(not(m), nx, ny), o = new Uint8Array(n); for (let k = 0; k < n; k++) o[k] = d[k] * cell <= r ? 1 : 0; return o; };
  const shrink = (m, r) => { const d = edt(m, nx, ny), o = new Uint8Array(n); for (let k = 0; k < n; k++) o[k] = d[k] * cell > r ? 1 : 0; return o; };
  const closed = shrink(grow(keep, TIDY), TIDY), opened = grow(shrink(closed, TIDY), TIDY);
  for (const m of [opened, closed]) {
    for (const k of homes) m[k] = 1;
    const id = flood(m, (k) => k === homes[0]);
    if (homes.every((h) => id[h])) { keep.set(m); break; }
  }
  // one piece: what's joined to its houses; and no holes (what the grid's edge can't reach is in)
  const joined = flood(keep, (k) => home[k]);
  const outside = flood(not(joined), (k) => { const i = k % nx, j = (k - i) / nx; return i === 0 || j === 0 || i === nx - 1 || j === ny - 1; });
  // traced on a softened copy (three passes of a 3×3 average), so the outline is smooth, not a staircase of cells
  let f = new Float64Array(n);
  for (let k = 0; k < n; k++) f[k] = outside[k] ? 0 : 1;
  for (let pass = 0; pass < 3; pass++) {
    const g = new Float64Array(n), h = new Float64Array(n);
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { const k = j * nx + i; g[k] = (f[i > 0 ? k - 1 : k] + f[k] + f[i < nx - 1 ? k + 1 : k]) / 3; }
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { const k = j * nx + i; h[k] = (g[j > 0 ? k - nx : k] + g[k] + g[j < ny - 1 ? k + nx : k]) / 3; }
    f = h;
  }
  const geo = contours().size([nx, ny]).thresholds([0.5])(f)[0];
  const toLL = ([x, y]) => [lon0 + x / kx, lat0 + y / ky];
  return (geo ? geo.coordinates : []).map((poly) => poly.map((ring) => {
    const kmRing = simplify(ring.map(([i, j]) => ({ x: x0 + (i - 0.5) * cell, y: y0 + (j - 0.5) * cell })), 0.12, true).map((p) => [p.x, p.y]);
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
// a house in a polygon, or by its edge (a spot geocoded just off the coast)
const holds = (p, d) => inRing(d.lon, d.lat, p[0]) || p[0].some(([x, y]) => kmApart(d, { lon: x, lat: y }) < 1.5);

const features = [];
let broken = 0;
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
  if (!memberDots.length) throw new Error(`${s.id}: no members`);
  // the houses its shape spans: its members, but those in a whole area only if they're near the others (the Baja
  // peninsula goes in whole; Tijuana's house ties it to San Diego's)
  const wholeLand = whole.flat(), inWhole = (d) => wholeLand.length > 0 && inPolys(d.lon, d.lat, wholeLand);
  const core = memberDots.filter((d) => !inWhole(d));
  const seeds = core.length ? [...core, ...memberDots.filter((d) => inWhole(d) && core.some((c) => kmApart(c, d) <= LINKED))] : memberDots;
  // its shetach's other houses (no member there, and not only mushrooms): each keeps the land nearer to it
  const others = dots.filter((d) => d.shetach === s.parent && !memberDots.includes(d) && d.centers.some((c) => !c.mushroom));
  const shape = drawRegion(seeds.map((d) => [d.lon, d.lat]), others.map((d) => [d.lon, d.lat]), s.reach ?? REACH);
  const all = whole.length ? polygonClipping.union(shape, ...whole) : shape;
  // cut to its shetach's land, in the states its members are in (and its whole areas): not over a state line
  const states = new Set([...memberDots.map((d) => d.state), ...(s.areas || [])]);
  const near = rect(box(all));
  let parts = 0;
  const bits = [];
  for (const st of [...new Set(own.map((g) => g.properties.state))]) {
    if (!states.has(st)) continue;
    const land = polygonClipping.intersection(polys(topojson.merge(topo, own.filter((g) => g.properties.state === st))), near);
    if (!land.length) continue;
    // (only the pieces with its houses in them, and a whole area's main land: no islets or slivers across a bay)
    const part = tidy(polygonClipping.intersection(all, land))
      .filter((p) => memberDots.some((d) => d.state === st && holds(p, d)) || (whole.length && ringArea(p[0]) >= 0.5));
    if (!part.length) continue;
    if (part.length > 1) bits.push(`${st} in ${part.length} pieces (${part.slice(1).map((p) => memberDots.filter((d) => holds(p, d)).flatMap((d) => d.centers.map((c) => `${c.name} ${c.id}`)).join(', ') || 'no houses').join(' | ')})`);
    features.push({ type: 'Feature', geometry: { type: 'MultiPolygon', coordinates: part },
      properties: { id: s.id, state: st, parent: s.parent, name: s.name, nameHe: s.nameHe, head: s.head, headHe: s.headHe, capital: s.capital } });
    parts++;
  }
  if (bits.length) broken++;
  // (the shetach's other houses that fall inside it, to look at: in the region but not its members)
  const drawn = features.filter((f) => f.properties.id === s.id).flatMap((f) => f.geometry.coordinates);
  const strays = dots.filter((d) => d.shetach === s.parent && inPolys(d.lon, d.lat, drawn))
    .flatMap((d) => d.centers.filter((c) => !c.mushroom && !isMember(c, d)).map((c) => `${c.name} (${c.city || ''}, ${c.id})`));
  const lost = memberDots.filter((d) => !inPolys(d.lon, d.lat, drawn)).flatMap((d) => d.centers.filter((c) => isMember(c, d)).map((c) => `${c.name} (${c.id})`));
  console.log(`${s.id}: ${memberDots.length} spots, longest link ${drawRegion.longest.toFixed(0)} km, ${parts} part${parts === 1 ? '' : 's'}${bits.length ? ` — NOT ONE PIECE: ${bits.join(', ')}` : ''}${lost.length ? `; members outside it (off the coast?): ${lost.join('; ')}` : ''}${strays.length ? `; inside but not members: ${strays.join('; ')}` : ''}`);
}
const outFile = path.join(ROOT, 'web', 'data', 'sub.json');
fs.writeFileSync(outFile, JSON.stringify({ type: 'FeatureCollection', features }));
console.log(`web/data/sub.json: ${data.subShetachim.length} sub-shetachim, ${features.length} parts, ${(fs.statSync(outFile).size / 1024).toFixed(0)} KB${broken ? `; ${broken} not in one piece` : ''}`);
