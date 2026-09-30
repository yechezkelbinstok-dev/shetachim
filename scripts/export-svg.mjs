// A plain political map of every shetach as one SVG: the shetachim in their map colours, shetach borders and
// coasts, nothing else (no names, cities, centers or capitals). Reads web/data/geo.json and
// web/data/shetachim.json (run `npm run build` first); writes web/shetachim-map.svg.
//
//   node scripts/export-svg.mjs [width]
//
// Lines keep only the points that can be seen at the SVG's own size (Visvalingam, on the topology's shared arcs, so
// neighbours still share their borders exactly), which keeps the file light enough for a phone.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { geoNaturalEarth1 } from 'd3-geo';
import { feature, meshArcs, mergeArcs, neighbors } from 'topojson-client';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WIDTH = +(process.argv[2] || 3600);
const PAD = 16;
const MIN_AREA = 0.15; // px²: a point is kept if its triangle with its neighbours is at least this big
// The page's light-theme colours (web/index.html :root), so the SVG looks like the map.
const COLORS = ['#f0e1a2', '#cce1b5', '#efc7c1', '#c5d9ee', '#f3cfa9', '#d8c8e5', '#bcded6', '#e1d8be'];
const INK = '#1e2b32', BG = '#f1f3f0';

const topo = JSON.parse(fs.readFileSync(path.join(ROOT, 'web', 'data', 'geo.json'), 'utf8'));
const { notShown = [] } = JSON.parse(fs.readFileSync(path.join(ROOT, 'web', 'data', 'shetachim.json'), 'utf8'));
const pieces = topo.objects.areas.geometries.filter((g) => !notShown.includes(g.properties.state));
const collection = { type: 'GeometryCollection', geometries: pieces };
const key = (g) => g.properties.shetach || null;

// Neighbouring shetachim never share a colour, colours spread evenly (the page's colouring, so they match).
const adj = new Map();
const touch = (k) => adj.get(k) || adj.set(k, new Set()).get(k);
neighbors(pieces).forEach((list, i) => {
  const a = key(pieces[i]);
  if (a == null) return;
  touch(a);
  for (const j of list) { const b = key(pieces[j]); if (b != null && a !== b) { touch(a).add(b); touch(b).add(a); } }
});
const color = new Map(), used = new Array(8).fill(0);
[...adj.keys()].sort((a, b) => adj.get(b).size - adj.get(a).size || (a < b ? -1 : 1)).forEach((k) => {
  const taken = new Set([...adj.get(k)].map((n) => color.get(n)));
  let best = -1;
  for (let c = 0; c < 8; c++) if (!taken.has(c) && (best < 0 || used[c] < used[best])) best = c;
  if (best < 0) best = 0;
  color.set(k, best);
  used[best]++;
});

// Arcs as lon/lat (long straight stretches get extra points, so they bend with the projection), then projected.
const [kx, ky] = topo.transform.scale, [dx, dy] = topo.transform.translate;
const arcLL = topo.arcs.map((arc) => {
  const out = [];
  let x = 0, y = 0, px = 0, py = 0;
  arc.forEach(([ax, ay], i) => {
    x += ax; y += ay;
    const lon = x * kx + dx, lat = y * ky + dy;
    if (i) {
      const n = Math.ceil(Math.max(Math.abs(lon - px), Math.abs(lat - py)) / 0.5);
      for (let j = 1; j < n; j++) out.push([px + ((lon - px) * j) / n, py + ((lat - py) * j) / n]);
    }
    out.push([lon, lat]);
    px = lon; py = lat;
  });
  return out;
});
const projection = geoNaturalEarth1().fitWidth(WIDTH - 2 * PAD, feature(topo, collection));
let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
const arcXY = arcLL.map((pts) => pts.map((p) => {
  const q = projection(p);
  if (q[0] < x0) x0 = q[0]; if (q[0] > x1) x1 = q[0]; if (q[1] < y0) y0 = q[1]; if (q[1] > y1) y1 = q[1];
  return q;
}));
for (const pts of arcXY) for (const q of pts) { q[0] += PAD - x0; q[1] += PAD - y0; }
const height = Math.ceil(y1 - y0 + 2 * PAD);

// Visvalingam: each point's weight is the area of the triangle it makes with its neighbours as the line is simplified.
function keep(pts) {
  const n = pts.length, w = new Float64Array(n).fill(Infinity);
  if (n < 3) return pts;
  const prev = Int32Array.from({ length: n }, (_, i) => i - 1), next = Int32Array.from({ length: n }, (_, i) => i + 1);
  const tri = (i) => { const a = pts[prev[i]], b = pts[i], c = pts[next[i]]; return Math.abs((a[0] - b[0]) * (c[1] - b[1]) - (c[0] - b[0]) * (a[1] - b[1])) / 2; };
  const val = new Float64Array(n), heap = [], at = new Int32Array(n).fill(-1);
  const swap = (i, j) => { const a = heap[i], b = heap[j]; heap[i] = b; heap[j] = a; at[b] = i; at[a] = j; };
  const up = (i) => { while (i > 0) { const p = (i - 1) >> 1; if (val[heap[p]] <= val[heap[i]]) break; swap(i, p); i = p; } };
  const down = (i) => { for (;;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < heap.length && val[heap[l]] < val[heap[m]]) m = l; if (r < heap.length && val[heap[r]] < val[heap[m]]) m = r; if (m === i) break; swap(i, m); i = m; } };
  for (let i = 1; i < n - 1; i++) { val[i] = tri(i); at[i] = heap.length; heap.push(i); up(heap.length - 1); }
  let max = 0;
  while (heap.length) {
    const i = heap[0], last = heap.pop();
    if (heap.length) { heap[0] = last; at[last] = 0; down(0); }
    max = Math.max(max, val[i]);
    w[i] = max;
    const p = prev[i], q = next[i];
    next[p] = q; prev[q] = p;
    for (const k of [p, q]) if (k > 0 && k < n - 1) { val[k] = tri(k); up(at[k]); down(at[k]); }
  }
  return pts.filter((_, i) => w[i] >= MIN_AREA);
}
const kept = arcXY.map(keep);
const fmt = (v) => +v.toFixed(1);
const arcPoints = (a) => (a < 0 ? [...kept[~a]].reverse() : kept[a]);

// A polygon ring or a line, from its arcs, as path data (points closer than 0.1 px to the last one are skipped).
function trace(arcs, close) {
  let d = '', last = null;
  arcs.forEach((a, k) => {
    const pts = arcPoints(a);
    for (let s = k ? 1 : 0; s < pts.length; s++) {
      const x = fmt(pts[s][0]), y = fmt(pts[s][1]);
      if (last && last[0] === x && last[1] === y) continue;
      d += `${last ? 'L' : 'M'}${x},${y}`;
      last = [x, y];
    }
  });
  return close && d ? `${d}Z` : d;
}
const polygonsPath = (ma) => (ma.type === 'Polygon' ? [ma.arcs] : ma.arcs).flatMap((rings) => rings.map((ring) => trace(ring, true))).join('');
// The cut GADM leaves along 180° isn't a coast or a border, so it isn't drawn.
const onSeam = (i) => arcLL[i].every(([lon]) => Math.abs(lon) > 179.99);
const linesPath = (filter) => meshArcs(topo, collection, filter).arcs
  .flatMap((line) => line.filter((a) => !onSeam(a < 0 ? ~a : a)).map((a) => trace([a], false))).join('');

const byShetach = new Map();
for (const g of pieces) if (key(g)) (byShetach.get(key(g)) || byShetach.set(key(g), []).get(key(g))).push(g);
const fills = [...byShetach].sort(([a], [b]) => (a < b ? -1 : 1))
  .map(([id, gs]) => `<path id="${id}" fill="${COLORS[color.get(id)]}" d="${polygonsPath(mergeArcs(topo, gs))}"/>`);
const borders = linesPath((a, b) => a !== b && (key(a) || '') !== (key(b) || ''));
const coast = linesPath((a, b) => a === b);

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${height}" viewBox="0 0 ${WIDTH} ${height}">
<title>Chabad shetachim</title>
<rect width="100%" height="100%" fill="${BG}"/>
<g stroke="none" fill-rule="evenodd">
${fills.join('\n')}
</g>
<g fill="none" stroke="${INK}" stroke-linejoin="round" stroke-linecap="round">
<path stroke-width="0.8" d="${coast}"/>
<path stroke-width="1.2" d="${borders}"/>
</g>
</svg>
`;
const out = path.join(ROOT, 'web', 'shetachim-map.svg');
fs.writeFileSync(out, svg);
console.log(`${path.relative(ROOT, out)}: ${WIDTH}×${height}, ${byShetach.size} shetachim, ${(svg.length / 1e6).toFixed(1)} MB`);
