// Massachusetts's inner borders as drawn shapes (data/shapes/ma-*.geojson), from the town-by-town assignment in
// data/shapes/ma-towns.json. Town lines make spikes and notches where a town pokes into its neighbours (owner, Nov 3:
// "Why there be horrible pointy borders and it's not just there"), so the towns are laid on a fine grid, each
// shetach's share is blurred and every cell goes to the strongest: the borders follow the towns but round off their
// corners. Every house stays in its own shetach. The shapes reach past the state's coast and borders (the build cuts
// them to the state's land); Connecticut's line (`deren`) stays exactly straight and Cape Cod's counties stay exact.
// Run: node scripts/ma-shapes.mjs   (after a first `npm run build`, which downloads the Census files into .cache)
import fs from 'node:fs';
import path from 'node:path';
import mapshaper from 'mapshaper';
import * as topojson from 'topojson-client';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const readJSON = (...p) => JSON.parse(fs.readFileSync(path.join(ROOT, ...p), 'utf8'));
const cfg = readJSON('data', 'shapes', 'ma-towns.json');
const towns = readJSON('.cache', 'county-subdivision-25.json').features;
const tracts = readJSON('.cache', 'tract-25.json').features;
const capeIds = Object.values(cfg.counties).flat();
const cape = readJSON('.cache', 'county.json').features.filter((f) => capeIds.includes(f.properties.GEOID));

// CELL: grid size (km). BLUR: how far a shetach's share is spread (km; three box passes, about this much either way).
// PULL: each house pulls the land round it towards its own shetach, fading out over this distance (km), so a border
// bends round a house smoothly; HOUSE: if a house still lands outside, this much round it goes back (km). ISLAND:
// smaller bits of a shetach than this (km²) with no house in them go to their neighbours. The grid's steps are taken
// out of the drawn lines (STEP, as a share of a cell) and the lines rounded (SMOOTH passes), each shared line once,
// so neighbours still meet exactly.
const CELL = 0.35, BLUR = 2.2, PULL = 2.5, HOUSE = 1.2, ISLAND = 15, STEP = 0.75, SMOOTH = 3;
const BOX = { west: -72.3, east: -69.8, south: 41.15, north: 42.95 };

const townKey = (s) => s.toLowerCase().replace(/ town$/, '').replace(/[^a-z]/g, '');
const LABELS = [cfg.westOfSplit, cfg.eastOfSplit, ...Object.keys(cfg.towns).filter((k) => k !== cfg.westOfSplit && k !== cfg.eastOfSplit)];
// Shetachim whose own town lines stay exactly as they are (the North Shore): not smoothed, and cut out of the shapes.
const EXACT = new Set((cfg.exact || []).map((id) => LABELS.indexOf(id)));
const labelOf = new Map(Object.entries(cfg.towns).flatMap(([id, list]) => list.map((t) => [townKey(t), LABELS.indexOf(id)])));
const tractLabel = new Map(Object.entries(cfg.tracts || {}).flatMap(([id, list]) => list.map((g) => [g, LABELS.indexOf(id)])));

// ---------- point in polygon, with bounding boxes ----------
const rings = (g) => (g.type === 'Polygon' ? [g.coordinates] : g.coordinates);
function boxed(f) {
  let w = 180, e = -180, s = 90, n = -90;
  for (const poly of rings(f.geometry)) for (const [x, y] of poly[0]) { w = Math.min(w, x); e = Math.max(e, x); s = Math.min(s, y); n = Math.max(n, y); }
  return { f, w, e, s, n };
}
function inside(x, y, g) {
  let hit = false;
  for (const poly of rings(g)) {
    let inPoly = false;
    for (const ring of poly) {
      for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const [xi, yi] = ring[i], [xj, yj] = ring[j];
        if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inPoly = !inPoly;
      }
    }
    if (inPoly) hit = true;
  }
  return hit;
}
const townBoxes = towns.map(boxed);
const tractBoxes = tracts.filter((f) => tractLabel.has(f.properties.GEOID)).map(boxed);
const find = (list, x, y) => list.find((b) => x >= b.w && x <= b.e && y >= b.s && y <= b.n && inside(x, y, b.f.geometry));

// ---------- the grid ----------
const kmLon = 111.32 * Math.cos(((BOX.south + BOX.north) / 2) * Math.PI / 180), kmLat = 110.95;
const dx = CELL / kmLon, dy = CELL / kmLat;
const cols = Math.ceil((BOX.east - BOX.west) / dx), rows = Math.ceil((BOX.north - BOX.south) / dy);
const N = cols * rows;
const label = new Int8Array(N).fill(-1);
const lon = (c) => BOX.west + (c + 0.5) * dx, lat = (r) => BOX.north - (r + 0.5) * dy;
for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    const x = lon(c), y = lat(r);
    if (x < cfg.deren) { label[r * cols + c] = 0; continue; } // Connecticut's side: cut off again exactly below
    const t = find(townBoxes, x, y);
    if (!t) continue;
    const county = t.f.properties.STATEFP + t.f.properties.COUNTYFP;
    let l;
    if (capeIds.includes(county)) l = 1; // Cape Cod: drawn as Eastern's, then its counties are taken out exactly
    else if (tractBoxes.length && find(tractBoxes, x, y)) l = tractLabel.get(find(tractBoxes, x, y).f.properties.GEOID);
    else l = labelOf.get(townKey(t.f.properties.NAME)) ?? (x < cfg.split ? 0 : 1);
    label[r * cols + c] = l;
  }
}
// Water and the states round about: the nearest town's shetach, so borders carry on smoothly past the coast.
{
  const queue = [];
  for (let i = 0; i < N; i++) if (label[i] >= 0) queue.push(i);
  for (let q = 0; q < queue.length; q++) {
    const i = queue[q], r = Math.floor(i / cols), c = i % cols;
    for (const j of [c > 0 ? i - 1 : -1, c < cols - 1 ? i + 1 : -1, r > 0 ? i - cols : -1, r < rows - 1 ? i + cols : -1]) {
      if (j >= 0 && label[j] < 0) { label[j] = label[i]; queue.push(j); }
    }
  }
}

// ---------- blur and pick ----------
function boxBlur(a, rad) {
  const out = new Float32Array(N);
  for (let r = 0; r < rows; r++) { // rows
    let sum = 0; const o = r * cols;
    for (let c = -rad; c <= rad; c++) sum += a[o + Math.min(cols - 1, Math.max(0, c))];
    for (let c = 0; c < cols; c++) {
      out[o + c] = sum / (2 * rad + 1);
      sum += a[o + Math.min(cols - 1, c + rad + 1)] - a[o + Math.max(0, c - rad)];
    }
  }
  const out2 = new Float32Array(N);
  for (let c = 0; c < cols; c++) { // columns
    let sum = 0;
    for (let r = -rad; r <= rad; r++) sum += out[Math.min(rows - 1, Math.max(0, r)) * cols + c];
    for (let r = 0; r < rows; r++) {
      out2[r * cols + c] = sum / (2 * rad + 1);
      sum += out[Math.min(rows - 1, r + rad + 1) * cols + c] - out[Math.max(0, r - rad) * cols + c];
    }
  }
  return out2;
}
const houses = readJSON('web', 'data', 'centers.geojson').features
  .filter((f) => f.properties.region === 'US-MA' && LABELS.includes(f.properties.piece.split(':')[1]))
  .map((f) => ({ x: f.geometry.coordinates[0], y: f.geometry.coordinates[1], l: LABELS.indexOf(f.properties.piece.split(':')[1]), name: f.properties.centers[0].name }));
const cellOf = (x, y) => Math.floor((BOX.north - y) / dy) * cols + Math.floor((x - BOX.west) / dx);
const rad = Math.max(1, Math.round(BLUR / CELL / Math.sqrt(3)));
const best = new Float32Array(N).fill(-1), picked = new Int8Array(N);
LABELS.forEach((_, l) => {
  if (EXACT.has(l)) return; // kept as they are (below)
  let m = new Float32Array(N);
  for (let i = 0; i < N; i++) m[i] = label[i] === l ? 1 : 0;
  for (let k = 0; k < 3; k++) m = boxBlur(m, rad);
  const R = Math.ceil(PULL / CELL);
  for (const h of houses.filter((h) => h.l === l)) { // a house's pull, fading smoothly to nothing at PULL km
    const i0 = cellOf(h.x, h.y), r0 = Math.floor(i0 / cols), c0 = i0 % cols;
    for (let r = r0 - R; r <= r0 + R; r++) for (let c = c0 - R; c <= c0 + R; c++) {
      const d = Math.hypot(r - r0, c - c0) / R;
      if (r >= 0 && r < rows && c >= 0 && c < cols && d < 1) m[r * cols + c] += 0.6 * (1 - d) ** 2;
    }
  }
  for (let i = 0; i < N; i++) if (m[i] > best[i]) { best[i] = m[i]; picked[i] = l; }
});
for (let i = 0; i < N; i++) if (lon(i % cols) < cfg.deren) picked[i] = 0;
for (let i = 0; i < N; i++) if (EXACT.has(label[i])) picked[i] = label[i];

// ---------- every house in its own shetach ----------
const houseCell = new Map();
let fixed = 0;
for (const h of houses) {
  const i = cellOf(h.x, h.y); houseCell.set(i, h.l);
  if (picked[i] === h.l) continue;
  fixed++;
  const R = Math.ceil(HOUSE / CELL), r0 = Math.floor(i / cols), c0 = i % cols;
  for (let r = r0 - R; r <= r0 + R; r++) for (let c = c0 - R; c <= c0 + R; c++) {
    if (r >= 0 && r < rows && c >= 0 && c < cols && (r - r0) ** 2 + (c - c0) ** 2 <= R * R) picked[r * cols + c] = h.l;
  }
}

// ---------- no stray bits ----------
const minCells = ISLAND / (CELL * CELL);
for (let pass = 0; pass < 5; pass++) {
  const comp = new Int32Array(N).fill(-1); let changed = 0;
  for (let s = 0; s < N; s++) {
    if (comp[s] >= 0) continue;
    const l = picked[s], cells = [s]; comp[s] = s;
    let house = false; const around = new Map();
    for (let q = 0; q < cells.length; q++) {
      const i = cells[q], r = Math.floor(i / cols), c = i % cols;
      if (houseCell.get(i) === l) house = true;
      for (const j of [c > 0 ? i - 1 : -1, c < cols - 1 ? i + 1 : -1, r > 0 ? i - cols : -1, r < rows - 1 ? i + cols : -1]) {
        if (j < 0) continue;
        if (picked[j] === l) { if (comp[j] < 0) { comp[j] = s; cells.push(j); } } else around.set(picked[j], (around.get(picked[j]) || 0) + 1);
      }
    }
    for (const x of EXACT) around.delete(x);
    if (cells.length < minCells && !house && around.size && !EXACT.has(l)) {
      const to = [...around].sort((a, b) => b[1] - a[1])[0][0];
      for (const i of cells) picked[i] = to;
      changed++;
    }
  }
  if (!changed) break;
}

// ---------- draw ----------
// A kept shetach's cells are drawn as the neighbour nearest them, so the shapes reach over it; it's then cut out of
// them along its own town lines.
{
  const queue = [];
  for (let i = 0; i < N; i++) if (!EXACT.has(picked[i])) queue.push(i);
  const seen = new Uint8Array(N); for (const i of queue) seen[i] = 1;
  for (let q = 0; q < queue.length; q++) {
    const i = queue[q], r = Math.floor(i / cols), c = i % cols;
    for (const j of [c > 0 ? i - 1 : -1, c < cols - 1 ? i + 1 : -1, r > 0 ? i - cols : -1, r < rows - 1 ? i + cols : -1]) {
      if (j >= 0 && !seen[j]) { seen[j] = 1; picked[j] = picked[i]; queue.push(j); }
    }
  }
}
const exactLand = [
  ...towns.filter((f) => EXACT.has(labelOf.get(townKey(f.properties.NAME)))),
  ...tracts.filter((f) => EXACT.has(tractLabel.get(f.properties.GEOID))),
];
const rects = [];
for (let r = 0; r < rows; r++) {
  let c = 0;
  while (c < cols) {
    const l = picked[r * cols + c]; let e = c;
    while (e + 1 < cols && picked[r * cols + e + 1] === l) e++;
    const x0 = BOX.west + c * dx, x1 = BOX.west + (e + 1) * dx, y0 = BOX.north - (r + 1) * dy, y1 = BOX.north - r * dy;
    rects.push({ type: 'Feature', properties: { label: LABELS[l] }, geometry: { type: 'Polygon', coordinates: [[[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0]]] } });
    c = e + 1;
  }
}
// The cells as shetachim, with each border between two of them one shared line (topology).
const topo = JSON.parse((await mapshaper.applyCommands('-i rects.json -dissolve2 label -o out.json format=topojson no-quantization',
  { 'rects.json': JSON.stringify({ type: 'FeatureCollection', features: rects }) }))['out.json']);
// Each line: the grid's steps taken out (Douglas-Peucker, in km), then rounded (Chaikin), its two ends kept.
const km = ([x, y]) => [x * kmLon, y * kmLat];
function simplifyLine(pts, tol) {
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop(); const [ax, ay] = km(pts[a]), [bx, by] = km(pts[b]);
    let far = -1, dmax = tol;
    for (let i = a + 1; i < b; i++) {
      const [px, py] = km(pts[i]), len = Math.hypot(bx - ax, by - ay);
      const d = len ? Math.abs((bx - ax) * (ay - py) - (ax - px) * (by - ay)) / len : Math.hypot(px - ax, py - ay);
      if (d > dmax) { dmax = d; far = i; }
    }
    if (far >= 0) { keep[far] = 1; stack.push([a, far], [far, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}
function chaikin(pts) {
  if (pts.length < 3) return pts;
  const out = [pts[0]];
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
    out.push([0.75 * x0 + 0.25 * x1, 0.75 * y0 + 0.25 * y1], [0.25 * x0 + 0.75 * x1, 0.25 * y0 + 0.75 * y1]);
  }
  out.push(pts[pts.length - 1]);
  return out;
}
topo.arcs = topo.arcs.map((arc) => {
  let a = simplifyLine(arc, STEP * CELL);
  for (let k = 0; k < SMOOTH; k++) a = chaikin(a);
  return a;
});
const shaped = topojson.feature(topo, Object.values(topo.objects)[0]);
const out = await mapshaper.applyCommands(
  `-i shaped.json -clip bbox=${cfg.deren},${BOX.south},${BOX.east},${BOX.north} -erase cape.json -erase exact.json -o out.json format=geojson`,
  { 'shaped.json': JSON.stringify(shaped), 'cape.json': JSON.stringify({ type: 'FeatureCollection', features: cape }),
    'exact.json': JSON.stringify({ type: 'FeatureCollection', features: exactLand }) });
const drawn = JSON.parse(out['out.json']).features;
for (const [id, name] of Object.entries(cfg.shapes)) {
  const f = drawn.find((d) => d.properties.label === id);
  const file = path.join(ROOT, 'data', 'shapes', `${name}.geojson`);
  fs.writeFileSync(file, JSON.stringify({ type: 'FeatureCollection', features: [{ type: 'Feature', properties: { name, source: `${id}'s part of Massachusetts east of ${cfg.deren}°W, drawn by scripts/ma-shapes.mjs from data/shapes/ma-towns.json (its towns, smoothed)` }, geometry: f.geometry }] }));
  console.log(`${path.relative(ROOT, file)}: ${(fs.statSync(file).size / 1024).toFixed(0)} KB`);
}
console.log(`${cols}×${rows} cells; ${houses.length} houses, ${fixed} pulled back into their own shetach`);
