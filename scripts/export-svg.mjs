// A plain political map of every shetach as one SVG: the shetachim in their map colours, shetach borders and
// coasts, nothing else (no names, cities, centers or capitals). Reads web/data/geo.json and
// web/data/shetachim.json (run `npm run build` first); writes web/shetachim-map.svg.
//
//   node scripts/export-svg.mjs [width] [world|na]   (both maps unless one is named)
// Writes web/shetachim-map.svg (world) and web/shetachim-us-canada.svg (Alaska and Hawaii in boxes).
//
// Lines keep only the points that can be seen at the SVG's own size (Visvalingam, on the topology's shared arcs, so
// neighbours still share their borders exactly), which keeps the file light enough for a phone.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { geoConicEqualArea, geoNaturalEarth1 } from 'd3-geo';
import { feature, merge, meshArcs, mergeArcs, neighbors } from 'topojson-client';
import opentype from 'opentype.js';
import polylabel from 'polylabel';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WIDTH = +(process.argv[2] || 3600);
const PAD = 16;
const MIN_AREA = 0.15; // px²: a point is kept if its triangle with its neighbours is at least this big
// The page's light-theme colours (web/index.html :root), so the SVG looks like the map.
const COLORS = ['#f0e1a2', '#cce1b5', '#efc7c1', '#c5d9ee', '#f3cfa9', '#d8c8e5', '#bcded6', '#e1d8be'];
const INK = '#1e2b32', BG = '#f1f3f0';
const SECONDARY = '#3d5f8f'; // a territory's head name (Kantor's over India): italic and slate blue, as on the page
// Land no shetach covers (world names map): one plain swath, no borders inside it.
const LAND = '#dfe3df';

let topo = JSON.parse(fs.readFileSync(path.join(ROOT, 'web', 'data', 'geo.json'), 'utf8'));
const { notShown = [], shetachim } = JSON.parse(fs.readFileSync(path.join(ROOT, 'web', 'data', 'shetachim.json'), 'utf8'));
const shetachById = new Map(shetachim.map((x) => [x.id, x]));
const pieces = topo.objects.areas.geometries.filter((g) => !notShown.includes(g.properties.state));
const collection = { type: 'GeometryCollection', geometries: pieces };
const key = (g) => g.properties.shetach || null;
// a territory (India, of Thailand's shetach) is coloured as the shetach it belongs to, lighter, with a dashed border between
const groupOf = (id) => (id && shetachById.get(id) && shetachById.get(id).territoryOf) || id;
const gkey = (g) => groupOf(key(g));

// Neighbouring shetachim never share a colour, colours spread evenly (the page's colouring, so they match).
const adj = new Map();
const touch = (k) => adj.get(k) || adj.set(k, new Set()).get(k);
neighbors(pieces).forEach((list, i) => {
  const a = gkey(pieces[i]);
  if (a == null) return;
  touch(a);
  for (const j of list) { const b = gkey(pieces[j]); if (b != null && a !== b) { touch(a).add(b); touch(b).add(a); } }
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
const arcsOf = (t) => t.arcs.map((arc) => {
  const [kx, ky] = t.transform.scale, [dx, dy] = t.transform.translate;
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
let arcLL = arcsOf(topo);
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
const fmt = (v) => +v.toFixed(1);
// The cut GADM leaves along 180° isn't a coast or a border, so it isn't drawn.
const onSeam = (i) => arcLL[i].every(([lon]) => Math.abs(lon) > 179.99);
const byShetachOf = (list) => {
  const m = new Map();
  for (const g of list) if (key(g)) (m.get(key(g)) || m.set(key(g), []).get(key(g))).push(g);
  return m;
};

// The fills and lines of some pieces under a projection (already placed on the page), as SVG.
function draw(list, projection) {
  const coll = { type: 'GeometryCollection', geometries: list };
  const kept = new Map();
  const arcPoints = (a) => {
    const i = a < 0 ? ~a : a;
    if (!kept.has(i)) kept.set(i, keep(arcLL[i].map((p) => projection(p))));
    return a < 0 ? [...kept.get(i)].reverse() : kept.get(i);
  };
  // A polygon ring or a line, from its arcs, as path data (points closer than 0.1 px to the last one are skipped).
  const trace = (arcs, close) => {
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
  };
  const polygonsPath = (ma) => (ma.type === 'Polygon' ? [ma.arcs] : ma.arcs).flatMap((rings) => rings.map((ring) => trace(ring, true))).join('');
  const linesPath = (filter) => meshArcs(topo, coll, filter).arcs
    .flatMap((line) => line.filter((a) => !onSeam(a < 0 ? ~a : a)).map((a) => trace([a], false))).join('');
  const fills = [...byShetachOf(list)].sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([id, gs]) => `<path id="${id}" fill="${COLORS[color.get(groupOf(id))]}" d="${polygonsPath(mergeArcs(topo, gs))}"/>`);
  const bare = list.filter((g) => !key(g));
  if (bare.length) fills.unshift(`<path id="no-shetach" fill="${LAND}" d="${polygonsPath(mergeArcs(topo, bare))}"/>`);
  return `<g stroke="none" fill-rule="evenodd">
${fills.join('\n')}
</g>
<g fill="none" stroke="${INK}" stroke-linejoin="round" stroke-linecap="round">
<path stroke-width="0.8" d="${linesPath((a, b) => a === b)}"/>
<path stroke-width="1.2" d="${linesPath((a, b) => a !== b && (gkey(a) || '') !== (gkey(b) || ''))}"/>
<path stroke-width="1" stroke-dasharray="4 3" d="${linesPath((a, b) => a !== b && gkey(a) && gkey(a) === gkey(b) && key(a) !== key(b))}"/>
</g>`;
}

// Fit a projection to some pieces in a box [x, y, w, h] (keeping its aspect), returning it and the height used.
function fitted(projection, list, [x, y, w, h]) {
  const f = feature(topo, { type: 'GeometryCollection', geometries: list });
  return h ? projection.fitExtent([[x, y], [x + w, y + h]], f) : projection.fitWidth(w, f);
}
function bounds(projection, list) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  const arcs = new Set();
  const walk = (a) => (Array.isArray(a) ? a.forEach(walk) : arcs.add(a < 0 ? ~a : a));
  for (const g of list) walk(g.arcs || []);
  for (const i of arcs) for (const p of arcLL[i]) { const [x, y] = projection(p); x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  return [x0, y0, x1, y1];
}

// ---------- names ----------
// The shetachim whose name may sit over the sea around their islands or coast on the world poster (the owner's picks:
// Indonesia's archipelago, the Philippines, Qatar); every other name stays on land or goes beside the map.
// 'open': the name big over the open sea at the shetach's labelAt, touching no land at all (the Caribbean: Mendel
// Zarchi's name over the Caribbean Sea, not on Guyana, its biggest piece of land).
// 'chain': an island chain whose name runs across it, centred in the chain, even though one island is most of its land
// (Hawaii: the Big Island).
const SEA_NAMES = { singapore: 'islands', philippines: 'islands', qatar: 'islands', caribbean: 'open', hawaii: 'chain' };
// Names that go beside the map with a short leader even though a tiny one would fit inside (Israel: Yosef Yitzchak
// Aharonov's name was a few px inside the country; Cyprus: Aryeh Zeev Raskin's; the owner prefers a short line).
const ASIDE_NAMES = ['israel', 'cyprus'];
// Names as outlines (so the SVG looks the same everywhere, with no font needed): Inter SemiBold, capitals,
// slightly spaced. Each name gets the biggest size (up to a cap that grows with the area, so big areas read bigger)
// at which it fits wholly inside its shetach, on one line or two, else its short form; one that doesn't fit at all
// goes offshore with a thin leader line.
// The Hebrew maps (…-he.svg): Heebo SemiBold, the names right to left.
const fontFile = (pkg, file) => opentype.loadSync(path.join(ROOT, 'node_modules', '@fontsource', pkg, 'files', file));
const INTER = fontFile('inter', 'inter-latin-600-normal.woff');
const HEEBO = [fontFile('heebo', 'heebo-hebrew-600-normal.woff'), fontFile('heebo', 'heebo-latin-600-normal.woff')];
let HEBREW = false;
const INTER_ITALIC = fontFile('inter', 'inter-latin-600-italic.woff');
// Hebrew has no italic face: an italic Hebrew name (Kantor's over India) is Heebo Regular, slanted by hand
const HEEBO_LIGHT = fontFile('heebo', 'heebo-hebrew-400-normal.woff');
const SLANT = 0.22;
const fontFor = (ch) => (HEBREW && HEEBO.find((f) => f.charToGlyphIndex(ch) > 0)) || INTER;
// "Disputed" (a disputed shetach's head: "Disputed — A; B; C") in italics; Hebrew has no italics, so במחלוקת stays upright
const ITALIC = /^Disputed/;
// italic: the whole name in italics (the head's name over a territory of his shetach: Kantor's over India)
const fontAt = (t, i, ch, italic) => (!HEBREW && (italic || (i < 8 && ITALIC.test(t))) ? INTER_ITALIC : fontFor(ch));
// Hebrew in drawing order (left to right): the words reversed, letters of Hebrew runs reversed, Latin runs ("RARA") kept.
const visual = (t) => (HEBREW ? t.split(/([A-Za-z0-9][A-Za-z0-9.]*)/).reverse().map((r) => (/^[A-Za-z0-9]/.test(r) ? r : [...r].reverse().join(''))).join('') : t);
const TRACK = 0.01; // letter spacing, in em
const LINE = 1.18; // line spacing, in em
const CAP = 0.727; // Inter's capital height, in em (Heebo's letters stand about as tall)
const textWidth = (t, size) => [...t].reduce((w, ch, i) => w + fontAt(t, i, ch).getAdvanceWidth(ch, size), 0) + TRACK * size * ([...t].length - 1);
function textPath(t, cx, baseline, size, italic = false) {
  let x = cx - textWidth(t, size) / 2, d = '';
  for (const [i, ch] of [...visual(t)].entries()) {
    const f = HEBREW && italic && HEEBO_LIGHT.charToGlyphIndex(ch) > 0 ? HEEBO_LIGHT : fontAt(t, i, ch, italic);
    const p = f.getPath(ch, x, baseline, size);
    if (HEBREW && italic) for (const c of p.commands) for (const [kx, ky] of [['x', 'y'], ['x1', 'y1'], ['x2', 'y2']]) if (c[kx] !== undefined) c[kx] += (baseline - c[ky]) * SLANT;
    d += p.toPathData(1);
    x += f.getAdvanceWidth(ch, size) + TRACK * size;
  }
  return d;
}
function twoLines(t) {
  let best = null;
  for (let i = 1; i < t.length - 1; i++) {
    if (t[i] !== ' ' && t[i] !== '-') continue;
    const lines = [t.slice(0, t[i] === '-' ? i + 1 : i), t.slice(i + 1)];
    const worst = Math.max(...lines.map((l) => l.length));
    if (!best || worst < best.worst) best = { worst, lines };
  }
  return best && best.lines;
}
const inRing = (r, x, y) => { let c = false; for (let i = 0, j = r.length - 1; i < r.length; j = i++) { const [xi, yi] = r[i], [xj, yj] = r[j]; if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c; } return c; };
const inPoly = (poly, x, y) => poly.reduce((c, r) => (inRing(r, x, y) ? !c : c), false);
const cross = (a, b, c, d) => { const o = (p, q, r) => Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0])); return o(a, b, c) !== o(a, b, d) && o(c, d, a) !== o(c, d, b); };
// Whether a box (with a little margin) lies wholly inside a polygon: its corners inside, no edge crossing it.
function boxInside(poly, [x0, y0, x1, y1], m = 4) {
  x0 -= m; y0 -= m; x1 += m; y1 += m;
  if (![[x0, y0], [x1, y0], [x1, y1], [x0, y1]].every(([x, y]) => inPoly(poly, x, y))) return false;
  const sides = [[[x0, y0], [x1, y0]], [[x1, y0], [x1, y1]], [[x1, y1], [x0, y1]], [[x0, y1], [x0, y0]]];
  for (const r of poly) for (let i = 1; i < r.length; i++) {
    const a = r[i - 1], b = r[i];
    if (a[0] > x0 && a[0] < x1 && a[1] > y0 && a[1] < y1) return false;
    if (Math.max(a[0], b[0]) < x0 || Math.min(a[0], b[0]) > x1 || Math.max(a[1], b[1]) < y0 || Math.min(a[1], b[1]) > y1) continue;
    for (const [c, d] of sides) if (cross(a, b, c, d)) return false;
  }
  return true;
}
// The stretch of a polygon through (x, y), up-down (vertical) or left-right: the pair of edge crossings around the point.
function spanAt(poly, x, y, vertical) {
  const hits = [];
  for (const r of poly) {
    for (let i = 1; i < r.length; i++) {
      const [ax, ay] = r[i - 1], [bx, by] = r[i];
      if (vertical) { if ((ax > x) !== (bx > x)) hits.push(ay + ((x - ax) / (bx - ax)) * (by - ay)); }
      else if ((ay > y) !== (by > y)) hits.push(ax + ((y - ay) / (by - ay)) * (bx - ax));
    }
  }
  hits.sort((a, b) => a - b);
  const at = vertical ? y : x;
  for (let i = 0; i + 1 < hits.length; i += 2) if (hits[i] <= at && at <= hits[i + 1]) return [hits[i], hits[i + 1]];
  return [at - 1, at + 1];
}
const polyArea = (r) => Math.abs(r.reduce((s2, p, i) => { const q = r[(i + 1) % r.length]; return s2 + p[0] * q[1] - q[0] * p[1]; }, 0)) / 2;

// Distance from a segment to a box (0 if they touch).
function segBoxDist(a, b, [x0, y0, x1, y1]) {
  const pd = ([px, py]) => Math.hypot(Math.max(x0 - px, 0, px - x1), Math.max(y0 - py, 0, py - y1));
  const sd = (p, q, r) => { const dx = r[0] - q[0], dy = r[1] - q[1], l = dx * dx + dy * dy; const t = l ? Math.max(0, Math.min(1, ((p[0] - q[0]) * dx + (p[1] - q[1]) * dy) / l)) : 0; return Math.hypot(p[0] - q[0] - t * dx, p[1] - q[1] - t * dy); };
  return Math.min(pd(a), pd(b), ...[[x0, y0], [x1, y0], [x1, y1], [x0, y1]].map((c) => sd(c, a, b)));
}
// The convex hull of some points (monotone chain), closed.
function hullOf(pts) {
  const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const turn = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], hi = [];
  for (const q of p) { while (lo.length > 1 && turn(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (const q of p.reverse()) { while (hi.length > 1 && turn(hi[hi.length - 2], hi[hi.length - 1], q) <= 0) hi.pop(); hi.push(q); }
  const h = [...lo.slice(0, -1), ...hi.slice(0, -1)];
  return [...h, h[0]];
}
// Every area's land on a grid of `cell` px: owner = which shetach (or country no shetach covers) holds each cell, as a
// number from `ids`; 0 is water.
function rasterize(list, projection, cell, gw, gh) {
  const owner = new Int32Array(gw * gh), ids = new Map();
  const geo = feature(topo, { type: 'GeometryCollection', geometries: list });
  for (const f of geo.features) {
    const who = key(f) || `country:${f.properties.country}`;
    if (!ids.has(who)) ids.set(who, ids.size + 1);
    const id = ids.get(who);
    for (const poly of f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates) {
      const rings = poly.map((r) => r.map((p) => projection(p)));
      let y0 = Infinity, y1 = -Infinity;
      for (const r of rings) for (const [, y] of r) { y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
      for (let gy = Math.max(0, Math.floor(y0 / cell)); gy <= Math.min(gh - 1, Math.ceil(y1 / cell)); gy++) {
        const yc = (gy + 0.5) * cell, xs = [];
        for (const r of rings) for (let i = 1; i < r.length; i++) {
          const [ax, ay] = r[i - 1], [bx, by] = r[i];
          if ((ay > yc) !== (by > yc)) xs.push(ax + ((yc - ay) / (by - ay)) * (bx - ax));
        }
        xs.sort((a, b) => a - b);
        for (let i = 0; i + 1 < xs.length; i += 2) {
          for (let gx = Math.max(0, Math.floor(xs[i] / cell)); gx <= Math.min(gw - 1, Math.floor(xs[i + 1] / cell)); gx++) owner[gy * gw + gx] = id;
        }
      }
    }
  }
  return { owner, ids };
}

// The ways a head shliach's name may be set, fullest first: the whole name; on two lines (first names / last name).
// Never shortened (the owner's rule): a middle name left in the data is part of how he's called ("Sholom Ber",
// "Yosef Yitzchak"), and the last name alone is never shown. A name too small for these goes beside
// the map with a leader line. Leadership entries and families ("Hanholo of Chabad Lubavitch UK", "Pinson family") are
// never shortened; a list of several names ("Disputed — A; B; C") goes one name per line. offshore: the form used
// beside the map.
// Words into n lines, as even in length as possible (the longest line as short as it can be).
function evenLines(words, n) {
  let best = null;
  const go = (from, left, acc) => {
    if (left === 1) { const lines = [...acc, words.slice(from).join(' ')]; const worst = Math.max(...lines.map((l) => l.length)); if (!best || worst < best.worst) best = { worst, lines }; return; }
    for (let i = from + 1; i <= words.length - left + 1; i++) go(i, left - 1, [...acc, words.slice(from, i).join(' ')]);
  };
  go(0, n, []);
  return best.lines;
}
function nameForms(s) {
  const name = s.headShliach.trim();
  if (/;/.test(name)) {
    const lines = name.split(/;\s*|\s+—\s+/).map((l, i, all) => (i === 0 && name.includes(' — ') ? `${l} —` : l)).filter(Boolean);
    return { full: [lines], offshore: name };
  }
  const words = name.split(/\s+/);
  const personal = !s.headTitle && words.length > 1 && !/\b(family|of)\b|^(משפחת|הנהלת) /i.test(name);
  // a Hebrew last name may be two words (שם טוב): as many as the Hebrew list's last name has
  const lastN = s.lastName && HEBREW ? s.lastName.split(/\s+/).length : 1;
  const last = words.slice(-lastN).join(' ');
  const full = [[name]];
  if (personal) {
    if (words.length > lastN) full.push([words.slice(0, -lastN).join(' '), last]);
    // never shortened further: a middle name left in the data is part of how he's called ("Sholom Ber")
  } else if (words.length > 1) {
    // a family or a leadership name: broken into the most even two lines, and three for a long one
    full.push(evenLines(words, 2));
    if (words.length > 3) full.push(evenLines(words, 3));
  }
  return { full, offshore: name };
}

// Each shetach's head shliach, centred in its shetach: the biggest size (up to a cap that grows with the area) at which
// the name fits inside, on one line or two (first name / last name), then shown a little smaller than that and placed
// where it has the most room on every side. Too small for it (the small Northeast shetachim): offshore, in a column,
// with a leader line.
// tiny: the smallest a name may be set inside its shetach before it goes beside the map instead.
// split: a shetach whose big parts other land keeps apart (Lower Balkans: Bosnia, and Albania to northern Greece, with
// Montenegro and Serbia between) gets its name once, beside the map, with a leader line from each part.
// maxSize: the biggest a name gets (the world poster's huge shetachim — Central Africa, Russia — go bigger than 64 px).
function labels(list, projection, { offshore = false, aside = null, box = null, tiny = 6, width = WIDTH, land = list, split = false, maxSize = 64, sea = false } = {}) {
  const MIN = 22, TINY = tiny, out = [], lost = [];
  // sea: a name may leave the land for the sea around it (an archipelago's name over the water between its islands,
  // Qatar's straddling its coast): every area's land on a grid, and the names set over the sea so far.
  const SC = 2;
  let rast = null, seaGW = 0, seaGH = 0, taken = null;
  if (sea) {
    const [, , bx, by] = bounds(projection, land);
    seaGW = Math.ceil((bx + PAD) / SC); seaGH = Math.ceil((by + PAD) / SC);
    rast = rasterize(land, projection, SC, seaGW, seaGH);
    taken = new Uint8Array(seaGW * seaGH);
  }
  // The biggest the name can be set partly or wholly over the sea, clear of everyone else's land and of other names
  // there: its box either centred within the hull of a shetach of scattered islands (land under half its hull), or
  // straddling the coast (at least 15% of the box its own land, some of it under the name's middle third). Nearest the
  // middle of the shetach's land. Returns null when nothing is bigger than `floor`.
  const overSea = (id, polys, forms, floor, onlySpread, open = null, chain = false) => {
    const me = rast.ids.get(id);
    const rings = polys.map((q) => q[0]);
    const areas = rings.map(polyArea), landA = areas.reduce((t, a) => t + a, 0);
    // the hull of the bigger islands (from 2% of the biggest), so a long tail of islets (the Aleutians) doesn't make it
    const hull = hullOf(rings.filter((r, i) => areas[i] >= 0.02 * Math.max(...areas)).flat());
    // scattered: islands (or parts) none of which is most of the land, together under half their hull
    const hullA = polyArea(hull), spread = chain || (landA < 0.5 * hullA && Math.max(...areas) < 0.6 * landA);
    if (onlySpread && !spread) return null;
    let tx = 0, ty = 0;
    rings.forEach((r, i) => { const c = polylabel([r], 1); tx += c[0] * areas[i]; ty += c[1] * areas[i]; });
    tx /= landA; ty /= landA;
    if (open) [tx, ty] = open;
    // as big as the land would make it; scattered islands, as big as land and sea between them together would; over
    // open sea, as big as the sea there allows
    const cap = open ? maxSize : Math.min(maxSize, Math.max(chain ? 20 : 16, (spread ? 0.2 : 0.12) * Math.sqrt(spread ? Math.sqrt(landA * hullA) : landA)));
    if (cap < floor) return null;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const r of rings) for (const [x, y] of r) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    const reachOut = Math.max(...forms.full.map((l) => Math.max(...l.map((t) => textWidth(t, cap))))) + cap;
    const gx0 = Math.max(0, Math.floor((x0 - reachOut) / SC)), gy0 = Math.max(0, Math.floor((y0 - reachOut) / SC));
    const gx1 = Math.min(seaGW - 1, Math.ceil((x1 + reachOut) / SC)), gy1 = Math.min(seaGH - 1, Math.ceil((y1 + reachOut) / SC));
    const ww = gx1 - gx0 + 1, wh = gy1 - gy0 + 1;
    // summed-area tables of others' land (and names already over the sea) and of own land
    const bad = new Int32Array((ww + 1) * (wh + 1)), own = new Int32Array((ww + 1) * (wh + 1));
    for (let y = 0; y < wh; y++) {
      for (let x = 0; x < ww; x++) {
        const i = (gy0 + y) * seaGW + gx0 + x, o = rast.owner[i], k = (y + 1) * (ww + 1) + x + 1;
        bad[k] = ((o && (open || o !== me)) || taken[i] ? 1 : 0) + bad[k - 1] + bad[k - ww - 1] - bad[k - ww - 2];
        own[k] = (o === me ? 1 : 0) + own[k - 1] + own[k - ww - 1] - own[k - ww - 2];
      }
    }
    const sum = (t, ax, ay, bx2, by2) => {
      const a = Math.max(0, Math.floor(ax / SC) - gx0), b = Math.max(0, Math.floor(ay / SC) - gy0);
      const c = Math.min(ww, Math.floor(bx2 / SC) - gx0 + 1), d = Math.min(wh, Math.floor(by2 / SC) - gy0 + 1);
      if (c <= a || d <= b) return 0;
      return t[d * (ww + 1) + c] - t[b * (ww + 1) + c] - t[d * (ww + 1) + a] + t[b * (ww + 1) + a];
    };
    const dims = (lines, size) => [Math.max(...lines.map((l) => textWidth(l, size))), (lines.length - 1) * LINE * size + CAP * size];
    const placed = forms.full.map((lines) => {
      for (let size = Math.round(cap); size > floor; size -= size > 30 ? 1 : 0.5) {
        const [w, h] = dims(lines, size), pad = Math.max(3, 0.3 * size), step = Math.max(SC, size / 4);
        let best = null;
        for (let cy = gy0 * SC + h / 2 + pad; cy <= (gy1 + 1) * SC - h / 2 - pad; cy += step) {
          for (let cx = gx0 * SC + w / 2 + pad; cx <= (gx1 + 1) * SC - w / 2 - pad; cx += step) {
            const d = Math.hypot(cx - tx, cy - ty);
            if (best && d >= best.d) continue;
            if (sum(bad, cx - w / 2 - pad, cy - h / 2 - pad, cx + w / 2 + pad, cy + h / 2 + pad)) continue;
            const mine = sum(own, cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2) * SC * SC;
            const straddle = mine >= 0.15 * w * h && sum(own, cx - w / 6, cy - h / 2, cx + w / 6, cy + h / 2) > 0;
            if (!open && !straddle && !(spread && inRing(hull, cx, cy))) continue;
            if (open && d > 250) continue; // right by the spot (the middle of the Caribbean Sea), shrinking to fit there
            best = { lines, size, cx, cy, h, d, pad, w };
          }
        }
        if (best) return best;
      }
      return null;
    });
    const top = Math.max(0, ...placed.map((q) => (q ? q.size : 0)));
    if (!top) return null;
    return placed.find((q) => q && q.size >= top / 1.15);
  };
  const takeSea = ({ cx, cy, w, h, pad }) => {
    for (let gy = Math.max(0, Math.floor((cy - h / 2 - pad) / SC)); gy <= Math.min(seaGH - 1, Math.floor((cy + h / 2 + pad) / SC)); gy++) {
      for (let gx = Math.max(0, Math.floor((cx - w / 2 - pad) / SC)); gx <= Math.min(seaGW - 1, Math.floor((cx + w / 2 + pad) / SC)); gx++) taken[gy * seaGW + gx] = 1;
    }
  };
  // every area's land, projected, to tell whether a line between two parts of a shetach runs over someone else's land
  const others = split ? feature(topo, { type: 'GeometryCollection', geometries: land }).features.flatMap((f) =>
    (f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates).map((poly) => {
      const rings = poly.map((r) => r.map((p) => projection(p)));
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (const [x, y] of rings[0]) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
      return { who: key(f), rings, box: [x0, y0, x1, y1] };
    })) : [];
  const onOtherLand = (x, y, id) => others.some((o) => o.who !== id && x >= o.box[0] && x <= o.box[2] && y >= o.box[1] && y <= o.box[3] && inPoly(o.rings, x, y));
  // ONLY=id,id… (testing): name just these shetachim, much faster
  const only = process.env.ONLY ? process.env.ONLY.split(',') : null;
  for (const [id, gs] of byShetachOf(list)) {
    // a territory of another shetach (India, of Thailand's): that shetach's head, his name in italics
    const s0 = shetachById.get(id), parent = s0 && s0.territoryOf && shetachById.get(s0.territoryOf);
    const s = parent ? { ...s0, headShliach: parent.headShliach, lastName: parent.lastName, headTitle: parent.headTitle, italic: true } : s0;
    if (!s.headShliach || (only && !only.includes(id))) continue;
    // labelState: the name goes on that state's part of the shetach (Alberta, not the territories' strip north of it)
    const core = s.labelState ? gs.filter((g) => g.properties.state === s.labelState) : [];
    const geo = merge(topo, core.length ? core : gs);
    const polys = (geo.type === 'Polygon' ? [geo.coordinates] : geo.coordinates).map((poly) => poly.map((r) => r.map((p) => projection(p))));
    polys.sort((a, b) => polyArea(b[0]) - polyArea(a[0]));
    if (split && !core.length) {
      // Parts from a tenth of the biggest; two are one cluster unless the shortest gap between them (closest points) runs
      // mostly over someone else's land — water between them (Newfoundland and Labrador, islands) keeps them together.
      // More than one cluster: one name, a leader to each cluster's biggest part.
      const big = polys.filter((q) => polyArea(q[0]) >= polyArea(polys[0][0]) * 0.1);
      const parts = big.map((q) => polylabel(q, 1));
      const outline = big.map((q) => { const k = keep(q[0]); return k.length >= 4 ? k : q[0]; });
      const group = parts.map((_, i) => i);
      const find = (i) => (group[i] === i ? i : (group[i] = find(group[i])));
      for (let i = 0; i < parts.length; i++) {
        for (let j = i + 1; j < parts.length; j++) {
          let a = null, b = null, dmin = Infinity;
          for (const p of outline[i]) for (const q of outline[j]) { const dd = (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2; if (dd < dmin) { dmin = dd; a = p; b = q; } }
          const n = Math.max(2, Math.ceil(Math.sqrt(dmin) / 2));
          let onLand = 0;
          for (let k = 1; k < n; k++) if (onOtherLand(a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n, id)) onLand++;
          if (onLand <= (n - 1) / 2) group[find(j)] = find(i);
        }
      }
      const heads = [...new Set(parts.map((_, i) => find(i)))];
      if (heads.length > 1) {
        const points = heads.map((i) => parts[i]);
        lost.push({ name: nameForms(s).offshore, points, px: points.reduce((t, p) => t + p[0], 0) / points.length, py: points.reduce((t, p) => t + p[1], 0) / points.length });
        console.log(`  ${s.name}: ${points.length} parts apart, one name with a leader to each`);
        continue;
      }
    }
    const main = polys[0].map((r) => { const k = keep(r); return k.length >= 4 ? k : r; });
    const segs = main.flatMap((r) => r.slice(1).map((p, i) => [r[i], p]));
    // the centre to aim for: the shape's centre of area when that's inside it, else the point farthest from its edges
    const pole = polylabel(main, 1);
    const ring = main[0];
    let ca = 0, cx0 = 0, cy0 = 0;
    for (let i = 0; i < ring.length - 1; i++) { const [x1, y1] = ring[i], [x2, y2] = ring[i + 1], c = x1 * y2 - x2 * y1; ca += c; cx0 += (x1 + x2) * c; cy0 += (y1 + y2) * c; }
    const cen = [cx0 / (3 * ca), cy0 / (3 * ca)];
    // labelAt: a point the name centres on instead (India: mainland India, not pulled toward the northeast past Bangladesh)
    // labelCentre: aim at that state's part (Western Pennsylvania's Pennsylvania), the name free to run a little past it
    const leanAt = () => {
      const lean = gs.filter((g) => g.properties.state === s.labelCentre);
      if (!lean.length || lean.length === gs.length) return null;
      const lg = merge(topo, lean), lp = (lg.type === 'Polygon' ? [lg.coordinates] : lg.coordinates).map((poly) => poly.map((r) => r.map((p) => projection(p))));
      lp.sort((a, b) => polyArea(b[0]) - polyArea(a[0]));
      return polylabel(lp[0], 1);
    };
    const [px, py] = s.labelAt ? projection(s.labelAt) : (s.labelCentre && leanAt()) || (inPoly(main, cen[0], cen[1]) ? cen : pole);
    let bx0 = Infinity, by0 = Infinity, bx1 = -Infinity, by1 = -Infinity;
    for (const [x, y] of main[0]) { bx0 = Math.min(bx0, x); bx1 = Math.max(bx1, x); by0 = Math.min(by0, y); by1 = Math.max(by1, y); }
    const cap = Math.max(MIN, Math.min(maxSize, Math.sqrt(polyArea(main[0])) * 0.25));
    const forms = nameForms(s);
    const dims = (lines, size) => [Math.max(...lines.map((l) => textWidth(l, size))), (lines.length - 1) * LINE * size + CAP * size];
    // every place (on a grid) a label of this size fits
    const spots = (lines, size) => {
      const [w, h] = dims(lines, size), step = Math.max(0.5, size / 4, (bx1 - bx0) / 150, (by1 - by0) / 150), res = [], m = Math.max(Math.min(1.5, size * 0.25), size * 0.15);
      for (let cx = bx0 + w / 2; cx <= bx1 - w / 2; cx += step) {
        for (let cy = by0 + h / 2; cy <= by1 - h / 2; cy += step) {
          if (boxInside(main, [cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2], m)) res.push([cx, cy]);
        }
      }
      return res;
    };
    // small shetachim may go down to TINY (or `floor`) rather than out of their shetach
    const biggest = (lines, floor = TINY) => { for (let size = cap; size >= floor; size -= size > 30 ? 1 : 0.5) if (spots(lines, size).length) return size; return 0; };
    // The fullest form that is within 25% of the biggest any form reaches (so a shorter one is used only where it reads
    // clearly bigger).
    // Each form placed (biggest well-centred size), then the fullest one whose quality — its size, less for sitting
    // off-centre — is within 15% of the best any form reaches (so "Benjy / Korf" on two lines in the middle of Florida's
    // peninsula beats one line along the panhandle).
    const choose = (floor) => {
      const placed = forms.full.map((l) => { const fit = biggest(l, floor); return fit ? place({ lines: l, fit }) : null; });
      const top = Math.max(0, ...placed.map((q) => (q ? q.quality : 0)));
      if (process.env.WHY === s.headShliach) console.log('    placed:', placed.map((q, i) => (q ? `${forms.full[i].join('/')} size ${q.size} quality ${q.quality.toFixed(1)}` : `${forms.full[i].join('/')} -`)).join(' | '));
      if (!top) return null;
      // The same words on one line or two: one line unless two read clearly bigger (25%+; the owner: "Berel Lazar"
      // really big on one line across Russia). Between different wordings, the fullest that's within 15% of the best.
      const words = (q) => q.lines.join(' ');
      const worth = (q) => q.quality + (q.lines.length === 1 ? 1e-6 : 0);
      const best = placed.filter(Boolean).filter((q) => !placed.some((o) => o && o !== q && words(o) === words(q) && worth(o) > worth(q)));
      const kept = Math.max(...best.map((q) => q.quality));
      const { quality, ...label } = best.find((q) => q.quality >= kept / 1.15);
      return label;
    };
    // How far off-centre a name is in the land it sits on: at its middle, the stretch of the shetach above-to-below and
    // left-to-right, and how far the name is from the middle of each (0 = dead centre, 0.5 = against an edge).
    const reach0 = Math.sqrt(polyArea(main[0]));
    const offCentre = (cx, cy) => {
      const v = spanAt(main, cx, cy, true), hz = spanAt(main, cx, cy, false);
      return Math.abs(cy - (v[0] + v[1]) / 2) / (v[1] - v[0]) + Math.abs(cx - (hz[0] + hz[1]) / 2) / (hz[1] - hz[0]);
    };
    // Where a name sits and how big: centred in its shetach, both ways (not tucked along one edge where the shape happens
    // to be widest, like Virginia's southern border). The biggest size, from what fits down to two-thirds of it, at which the
    // name can sit well centred; failing that, the most centred of them. At each size, the most centred spot, then the
    // one with the most room around it.
    const place = ({ lines, fit }) => {
      const start = fit >= MIN ? Math.max(MIN, Math.round(Math.min(cap, fit * 0.97))) : fit;
      let pick = null;
      // Only a big name trades size for centring (Virginia's); a small one keeps the biggest size that fits and just takes
      // its most central spot at that size (Delaware's name, slid a little south where the state is wider).
      const floorF = start >= 30 ? 0.9 : 1;
      // (if no size down to the floor has a spot — the grid of spots shifts with the size — on down until one does)
      for (let f = 1; f >= floorF - 1e-9 || (!pick && f >= 0.5); f -= 0.05) {
        const size = f === 1 ? start : Math.round(start * f * 2) / 2;
        if (f < 1 && size < Math.min(TINY, start) && pick) break;
        const [w, h] = dims(lines, size);
        let best = null;
        for (const [cx, cy] of spots(lines, size)) {
          const bb = [cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2];
          const room = Math.min(...segs.map(([a, b2]) => segBoxDist(a, b2, bb)));
          // off-centre locally, plus how far from the middle of the whole shetach (in its own sizes)
          const off = s.labelCentre ? 0.3 * offCentre(cx, cy) + 3 * Math.hypot(cx - px, cy - py) / reach0 : offCentre(cx, cy) + Math.hypot(cx - px, cy - py) / reach0;
          const score = -off + 0.05 * (Math.min(room, size * 1.2) / size);
          if (!best || score > best.score) best = { score, off, cx, cy };
        }
        if (!best) continue;
        const here = { lines, size, cx: best.cx, cy: best.cy, h, off: best.off };
        if (!pick || here.off < pick.off - 0.03) pick = here;
        if (best.off <= 0.2) { pick = here; break; }
      }
      if (!pick) { const [cx, cy] = spots(lines, fit)[0]; pick = { lines, size: fit, cx, cy, h: dims(lines, fit)[1], off: 1 }; }
      const { off, ...label } = pick;
      // size first; sitting off-centre costs at most 30% (a slanted or thin shape — New Zealand, Delaware — can't hold a
      // name dead centre, and a bigger name there still reads better)
      return { ...label, quality: label.size * (1 - 0.3 * Math.min(off, 1)) };
    };
    let chosen = sea && ASIDE_NAMES.includes(id) ? null : choose(TINY);
    // only the few the owner picked (SEA_NAMES): elsewhere a name over the sea looks wrong
    if (sea && !core.length && SEA_NAMES[id]) {
      // over the sea: a name that fits nowhere inside, or only in small type (under 9 px); or a scattered shetach's
      // (Indonesia's, the Philippines') when that reads clearly bigger (40%+) than on one of its islands; an 'open' one
      // always, over open water at its labelAt
      const open = SEA_NAMES[id] === 'open' && s.labelAt ? projection(s.labelAt) : null;
      const wet = overSea(id, polys, forms, open ? 12 : Math.max(9, chosen ? chosen.size * 1.4 : 0), false, open, SEA_NAMES[id] === 'chain');
      if (wet) {
        console.log(`  over the sea: ${s.headShliach} at ${wet.size} px${chosen ? ` (inside: ${chosen.size})` : ''}`);
        takeSea(wet);
        const { d, pad, w, ...label } = wet;
        chosen = label;
      }
    }
    if (process.env.WHY === s.headShliach) console.log(`    pole room ${polylabel(main, 0.5).distance.toFixed(1)} px; ${s.headShliach}: main polygon ${Math.round(bx1 - bx0)}×${Math.round(by1 - by0)} px, ${polys.length} polygons, area ${Math.round(polyArea(main[0]))} px², ring ${main[0].length} pts; forms`, forms.full.map((l) => `${l.join('/')}=${biggest(l, TINY)}`).join(' '));
    if (!chosen) {
      // Beside the map if there's a good spot near it; else inside after all, as small as it takes (down to 5 px).
      const small = TINY > 5 ? choose(5) : null;
      // last: the name inside after all, however small, only if no spot beside the map can be found (never dropped)
      lost.push({ name: forms.offshore, px, py, inside: small, last: small || choose(1.5), early: ASIDE_NAMES.includes(id) });
      continue;
    }
    if (process.env.SIZES) console.log(`    size ${id}: ${chosen.size} (cap ${Math.round(cap)}, ${chosen.lines.join('/')})`);
    out.push(s.italic ? { ...chosen, italic: true, id, parent: s0.territoryOf } : { ...chosen, id });
  }
  // a territory's name (in italics) never bigger than its shetach's own: at most 85% of it, on the same spot
  for (const o of out) {
    const main = o.parent && out.find((q) => q.id === o.parent);
    if (main && o.size > main.size * 0.85) { const f = (main.size * 0.85) / o.size; o.size *= f; o.h *= f; }
  }
  if (box && lost.length) {
    // too small inside a corner box (Hawaii's islands): the name along the box's top
    for (const l of lost) { const size = MIN + 4; out.push({ lines: [l.name], size, cx: box[0] + box[2] / 2, cy: box[1] + 16 + CAP * size / 2, h: CAP * size }); }
    lost.length = 0;
  }
  let leaders = '';
  if (aside && lost.length) leaders += placeAside(lost, out, land, projection, { ...aside, width });
  if (offshore && lost.length) {
    const size = MIN + 2, gap = size * 1.9;
    const x = Math.max(...lost.map((l) => l.px)) + 150;
    lost.sort((a, b) => a.py - b.py);
    let y = -Infinity;
    for (const l of lost) {
      y = Math.max(l.py, y + gap);
      out.push({ lines: [l.name], size, cx: x + textWidth(l.name, size) / 2, cy: y, h: CAP * size });
      leaders += `M${fmt(l.px)},${fmt(l.py)}L${fmt(x - 10)},${fmt(y)}`;
      leaders += `M${fmt(l.px + 3.5)},${fmt(l.py)}A3.5,3.5 0 1,1 ${fmt(l.px - 3.5)},${fmt(l.py)}A3.5,3.5 0 1,1 ${fmt(l.px + 3.5)},${fmt(l.py)}`;
    }
  }
  const draw = (list) => list.map(({ lines, size, cx, cy, h, italic }) => lines.map((l, k) => textPath(l, cx, cy - h / 2 + CAP * size + k * LINE * size, size, italic)).join('')).join('');
  const text = draw(out.filter((o) => !o.italic)), terr = draw(out.filter((o) => o.italic));
  return `<g fill="${INK}">${leaders ? `<path d="${leaders}" fill="none" stroke="${INK}" stroke-width="1.4"/>` : ''}<path d="${text}"/>${terr ? `<path fill="${SECONDARY}" d="${terr}"/>` : ''}</g>`;
}

// Names that fit nowhere inside their shetach (the world's small countries and islands), each beside it in the nearest
// open water: on a grid of the map (land, names, leader lines), the closest spot where the whole name is over water
// and clear of everything already placed, reached by a leader line that crosses no other name. Returns leader paths.
// A leader may cross at most `cross` px of other countries; one that can't be placed within `reach` goes inside its shetach
// in small type (`inside`, worked out by labels()) when that fits, else anywhere within `far`.
function placeAside(lost, out, list, projection, { size, cell = 3, reach = 900, far = reach, cross: maxCross = 0, width, column = false }) {
  const W = width, H = Math.ceil(Math.max(...out.map((o) => o.cy + o.h), 0)) + 4000;
  const gw = Math.ceil(W / cell), gh = Math.ceil(H / cell), grid = new Uint8Array(gw * gh); // 1 land, 2 a name, 3 a leader
  // whose land each cell is (a shetach, or a country no shetach covers), so a leader can tell its own land from others'
  const { owner } = rasterize(list, projection, cell, gw, gh);
  for (let i = 0; i < owner.length; i++) if (owner[i]) grid[i] = 1;
  const mark = ([x0, y0, x1, y1]) => {
    for (let gy = Math.max(0, Math.floor(y0 / cell)); gy <= Math.min(gh - 1, Math.floor(y1 / cell)); gy++) {
      for (let gx = Math.max(0, Math.floor(x0 / cell)); gx <= Math.min(gw - 1, Math.floor(x1 / cell)); gx++) grid[gy * gw + gx] = 2;
    }
  };
  const free = ([x0, y0, x1, y1]) => {
    if (x0 < PAD || y0 < PAD || x1 > W - PAD || y1 > H - PAD) return false;
    for (let gy = Math.floor(y0 / cell); gy <= Math.floor(y1 / cell); gy++) {
      for (let gx = Math.floor(x0 / cell); gx <= Math.floor(x1 / cell); gx++) if (grid[gy * gw + gx]) return false;
    }
    return true;
  };
  // skip: cells at the start left out (a leader may start under the edge of a neighbour's name)
  const lineCells = (a, b, fn, skip = 0) => {
    const n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / cell) + 1;
    for (let i = Math.min(skip, n); i <= n; i++) fn(Math.floor((a[0] + ((b[0] - a[0]) * i) / n) / cell), Math.floor((a[1] + ((b[1] - a[1]) * i) / n) / cell));
  };
  for (const o of out) {
    const w = Math.max(...o.lines.map((l) => textWidth(l, o.size)));
    mark([o.cx - w / 2 - 3, o.cy - o.h / 2 - 3, o.cx + w / 2 + 3, o.cy + o.h / 2 + 3]);
  }
  const h = CAP * size, gap = size * 0.5;
  const angles = Array.from({ length: 24 }, (_, i) => (i * Math.PI) / 12).sort((a, b) => Math.abs(Math.sin(a)) - Math.abs(Math.sin(b)));
  let d = '';
  // Cells of other shetachim's or countries' land a leader crosses.
  const foreignLand = (a, b) => {
    const own = owner[Math.floor(a[1] / cell) * gw + Math.floor(a[0] / cell)];
    let n = 0;
    lineCells(a, b, (gx, gy) => { const o = owner[gy * gw + gx]; if (o && o !== own) n++; });
    return n;
  };
  const search = (l, w, limit, maxCells, strict = true) => {
    // The best spot by length plus land crossed (each px over other land counts three): a short leader over a sliver of
    // a neighbour beats a long one round it. Stops once nothing farther could beat the best.
    let found = null;
    for (let r = size; r <= limit && !(found && (found.cross === 0 || r > found.cost)); r += size / 2) {
      for (const t of angles) {
        // the box's nearest edge r away from the point, in direction t
        const cx = l.px + Math.cos(t) * (r + w / 2), cy = l.py + Math.sin(t) * (r + h / 2);
        const bb = [cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2];
        const dbg = process.env.WHY === l.name ? (why) => { if (r <= 200 && Math.abs(Math.cos(t)) > 0.9) console.log(`    r=${r} t=${t.toFixed(2)}: ${why}`); } : () => {};
        if (!free([bb[0] - gap, bb[1] - gap, bb[2] + gap, bb[3] + gap])) { dbg('box not free'); continue; }
        const end = [Math.max(bb[0], Math.min(l.px, bb[2])), Math.max(bb[1], Math.min(l.py, bb[3]))];
        let clear = true;
        lineCells([l.px, l.py], end, (gx, gy) => { const v = grid[gy * gw + gx]; if (v === 2 || (strict && v === 3)) clear = false; }, 3);
        if (!clear) { dbg('leader blocked'); continue; }
        const cross = foreignLand([l.px, l.py], end);
        if (cross > maxCells) { dbg(`crosses ${cross} cells`); continue; }
        const cost = Math.hypot(end[0] - l.px, end[1] - l.py) + 3 * cross * cell;
        if (!found || cost < found.cost) found = { cx, cy, end, cross, cost };
        if (cross === 0) break;
      }
    }
    return found;
  };
  // the most hemmed-in first (fewest open cells nearby), so the easy ones don't take their only spots
  const openNear = (l) => { let n = 0; const R = Math.round(reach / 2 / cell), gx0 = Math.floor(l.px / cell), gy0 = Math.floor(l.py / cell); for (let gy = gy0 - R; gy <= gy0 + R; gy += 3) for (let gx = gx0 - R; gx <= gx0 + R; gx += 3) if (gx >= 0 && gy >= 0 && gx < gw && gy < gh && !grid[gy * gw + gx]) n++; return n; };
  // A name with several leaders (a shetach in parts): the box near the parts' middle with every leader clear of names
  // (and leaders), crossing the least other land in all.
  const searchMany = (l, w, limit, maxCells) => {
    let found = null;
    for (let r = 0; r <= limit && !(found && found.cross === 0); r += size / 2) {
      for (const t of r ? angles : [0]) {
        const cx = l.px + Math.cos(t) * r, cy = l.py + Math.sin(t) * r;
        const bb = [cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2];
        if (!free([bb[0] - gap, bb[1] - gap, bb[2] + gap, bb[3] + gap])) continue;
        const ends = l.points.map(([x, y]) => [Math.max(bb[0], Math.min(x, bb[2])), Math.max(bb[1], Math.min(y, bb[3]))]);
        let clear = true, cross = 0, worst = 0;
        l.points.forEach((p, i) => {
          lineCells(p, ends[i], (gx, gy) => { const v = grid[gy * gw + gx]; if (v === 2 || v === 3) clear = false; }, 3);
          const c = foreignLand(p, ends[i]);
          cross += c; worst = Math.max(worst, c);
        });
        if (!clear || worst > maxCells) continue;
        if (!found || cross < found.cross) found = { cx, cy, ends, cross };
        if (cross === 0) break;
      }
    }
    return found;
  };
  // Placed in turn, each taking the nearest free spot, so the first can take a spot a later one needed (Cape Cod's names
  // boxed in by Boston's): when a name finds no room, or only at the end of a long leader, everything is placed again
  // with those names first, and the best of the tries is kept (fewest stuck, then least leader past `reach`).
  const grid0 = grid.slice(), out0 = out.length;
  let logs = [], bad = [];
  const log = (t) => logs.push(t);
  const fail = (name, cost) => { bad.push({ name, cost }); logs.push(`  no room for ${name}`); };
  const long = (l, f) => { const len = Math.hypot(f.end[0] - l.px, f.end[1] - l.py), ok = Math.min(reach, 120); if (len > ok) bad.push({ name: l.name, cost: len - ok }); };
  let lean = 0;
  const run = (first) => {
    grid.set(grid0); out.length = out0; d = ''; logs = []; bad = [];
    const hard = [];
    // Crowds — five or more names close together that fit nowhere inside their shetach (the US Northeast's small
    // shetachim) — go straight into a column: one leader each, in order, rather than a fan of crossing leaders. A name
    // near a crowd that does fit inside at a readable size (8 px+) stays inside, so it adds no leader to the tangle.
    const readable = (l) => l.inside && l.inside.size >= 8;
    const singles = lost.filter((l) => !l.points && !readable(l)), link = column ? 45 : reach * 0.4;
    const crowdOf = new Map(singles.map((l, i) => [l, i]));
    const root = singles.map((_, i) => i);
    const top = (i) => (root[i] === i ? i : (root[i] = top(root[i])));
    singles.forEach((a, i) => singles.forEach((b, j) => { if (j > i && Math.hypot(a.px - b.px, a.py - b.py) < link) root[top(j)] = top(i); }));
    const crowdSize = new Map();
    singles.forEach((_, i) => crowdSize.set(top(i), (crowdSize.get(top(i)) || 0) + 1));
    // column: only a tight knot (three or more within 45 px: Boston, Cape Cod and Rhode Island) is stacked, right off
    // the coast; every other name gets its own short leader, as close to its shetach as there's room (the owner's call)
    const crowd = column ? singles.filter((_, i) => crowdSize.get(top(i)) >= 3) : [];
    const crowded = (l) => crowd.includes(l);
    const nearCrowd = (l) => crowd.some((c) => Math.hypot(c.px - l.px, c.py - l.py) < link);
    const placeHard = (list) => {
      // The rest (a crowded coast: the US Northeast) as atlases do it: neighbours together in a column in the nearest open
      // water, in north-to-south order, so their leaders run side by side instead of crossing.
      const groups = [];
      for (const l of list.sort((a, b) => a.py - b.py)) {
        const g = l.crowd && groups.find((gr) => gr[0].crowd && gr.some((o) => Math.hypot(o.px - l.px, o.py - l.py) < link));
        if (g) g.push(l); else groups.push([l]);
      }
      const row = size * 1.55;
      // only a crowd makes a column; anything else gets its own leader
      const lone = groups.filter((g) => !g[0].crowd);
      const columns = groups.filter((g) => g[0].crowd);
      for (const g of [...lone, ...columns]) {
        if (g.length === 1 && !g[0].crowd) {
          // a lone name: the nearest spot whose leader crosses the least other land, never a column
          const [l] = g;
          if (l.inside) { out.push(l.inside); continue; }
          // over water if it can be (not a long line across a neighbour), else the least other land crossed
          const found = search(l, l.w, far, Math.round(maxCross / cell)) || search(l, l.w, far, Infinity) || search(l, l.w, far, Infinity, false);
          if (!found) { fail(l.name, 5000); if (l.last) out.push(l.last); continue; }
          out.push({ lines: [l.name], size, cx: found.cx, cy: found.cy, h });
          mark([found.cx - l.w / 2 - 3, found.cy - h / 2 - 3, found.cx + l.w / 2 + 3, found.cy + h / 2 + 3]);
          lineCells([l.px, l.py], found.end, (gx, gy) => { if (gx >= 0 && gy >= 0 && gx < gw && gy < gh && grid[gy * gw + gx] !== 2) grid[gy * gw + gx] = 3; });
          const r = size * 0.12;
          d += `M${fmt(l.px)},${fmt(l.py)}L${fmt(found.end[0])},${fmt(found.end[1])}`;
          d += `M${fmt(l.px + r)},${fmt(l.py)}A${fmt(r)},${fmt(r)} 0 1,1 ${fmt(l.px - r)},${fmt(l.py)}A${fmt(r)},${fmt(r)} 0 1,1 ${fmt(l.px + r)},${fmt(l.py)}`;
          log(`  beside the map: ${l.name}, leader ${Math.round(Math.hypot(found.end[0] - l.px, found.end[1] - l.py))} px (lone)`);
          long(l, found);
          continue;
        }
        g.sort((a, b) => a.py - b.py);
        const colW = Math.max(...g.map((l) => l.w)), colH = g.length * row;
        const yMid = g.reduce((t, l) => t + l.py, 0) / g.length;
        const xs = g.map((l) => l.px), side = [];
        // the nearest open water beside them, sliding the column up or down a little if that brings it closer
        for (const dy of [0, ...Array.from({ length: 12 }, (_, i) => [-(i + 1), i + 1]).flat()].map((n) => n * row * 0.5)) {
          const y0 = Math.max(PAD, Math.min(H - PAD - colH, yMid - colH / 2 + dy));
          for (const dir of [1, -1]) {
            const start = dir > 0 ? Math.max(...xs) + size : Math.min(...xs) - size - colW;
            for (let k = 0; k * size <= far; k++) {
              const x = start + dir * k * size;
              if (free([x - gap, y0 - gap, x + colW + gap, y0 + colH + gap])) { side.push({ x, y0, dir, dist: k * size + Math.abs(dy) + (dy >= 0 ? lean : 0) }); break; }
            }
          }
        }
        const at = side.sort((a, b) => a.dist - b.dist)[0];
        if (!at) { for (const l of g) { fail(l.name, 5000); if (l.last) out.push(l.last); } continue; }
        const { y0 } = at;
        // rows in the order the leaders arrive, seen from the column, so no two cross
        const ax = at.dir > 0 ? at.x : at.x + colW, cyMid = y0 + colH / 2;
        g.sort((a, b) => Math.atan2(a.py - cyMid, at.dir * (ax - a.px)) - Math.atan2(b.py - cyMid, at.dir * (ax - b.px)));
        g.forEach((l, k) => {
          const cy = y0 + k * row + row / 2, cx = at.dir > 0 ? at.x + l.w / 2 : at.x + colW - l.w / 2;
          out.push({ lines: [l.name], size, cx, cy, h });
          const end = [at.dir > 0 ? at.x - 4 : at.x + colW + 4, cy];
          lineCells([l.px, l.py], end, (gx, gy) => { if (gx >= 0 && gy >= 0 && gx < gw && gy < gh && grid[gy * gw + gx] !== 2) grid[gy * gw + gx] = 3; });
          const r = size * 0.12;
          d += `M${fmt(l.px)},${fmt(l.py)}L${fmt(end[0])},${fmt(end[1])}`;
          d += `M${fmt(l.px + r)},${fmt(l.py)}A${fmt(r)},${fmt(r)} 0 1,1 ${fmt(l.px - r)},${fmt(l.py)}A${fmt(r)},${fmt(r)} 0 1,1 ${fmt(l.px + r)},${fmt(l.py)}`;
        });
        mark([at.x - gap, y0 - gap, at.x + colW + gap, y0 + colH + gap]);
        log(`  column of ${g.length} beside the coast: ${g.map((l) => l.name).join(', ')}`);
      }
    };
    // the knot's column first, so the names placed after it keep clear of its leaders; on each retry it leans further
    // north (`lean`), off the strip of sea a neighbour needs (Cyprus's pair up off Aharonov's spot west of Israel)
    let stacked = false;
    const stack = () => { if (!stacked) { stacked = true; placeHard(lost.filter(crowded).map((l) => ({ ...l, crowd: true, w: textWidth(l.name, size) }))); } };
    stack();
    for (const l of [...lost].map((x) => ({ ...x, open: openNear(x), crowd: crowded(x), near: !crowded(x) && readable(x) && nearCrowd(x) })).sort((a, b) => (first.has(b.name) - first.has(a.name)) || (!!b.early - !!a.early) || a.open - b.open)) {
      if (!first.has(l.name)) stack(); // names that got no room or a long line last try go before the column
      const w = textWidth(l.name, size);
      if (l.crowd) continue;
      if (l.near) {
        out.push(l.inside);
        const iw = Math.max(...l.inside.lines.map((t) => textWidth(t, l.inside.size)));
        mark([l.inside.cx - iw / 2 - 2, l.inside.cy - l.inside.h / 2 - 2, l.inside.cx + iw / 2 + 2, l.inside.cy + l.inside.h / 2 + 2]);
        continue;
      }
      if (l.points) {
        const many = searchMany(l, w, reach, Math.round(maxCross / cell)) || searchMany(l, w, far, Infinity);
        if (!many) { fail(l.name, 5000); continue; }
        out.push({ lines: [l.name], size, cx: many.cx, cy: many.cy, h });
        mark([many.cx - w / 2 - gap, many.cy - h / 2 - gap, many.cx + w / 2 + gap, many.cy + h / 2 + gap]);
        const r = size * 0.12;
        l.points.forEach((p, i) => {
          lineCells(p, many.ends[i], (gx, gy) => { if (gx >= 0 && gy >= 0 && gx < gw && gy < gh && grid[gy * gw + gx] !== 2) grid[gy * gw + gx] = 3; });
          d += `M${fmt(p[0])},${fmt(p[1])}L${fmt(many.ends[i][0])},${fmt(many.ends[i][1])}`;
          d += `M${fmt(p[0] + r)},${fmt(p[1])}A${fmt(r)},${fmt(r)} 0 1,1 ${fmt(p[0] - r)},${fmt(p[1])}A${fmt(r)},${fmt(r)} 0 1,1 ${fmt(p[0] + r)},${fmt(p[1])}`;
        });
        continue;
      }
      // a short leader if there's room close by; failing that, a readable name inside (8 px+) beats a long leader
      let found = search(l, w, Math.min(reach, 250), Math.round(maxCross / cell));
      if (!found && readable(l)) {
        out.push(l.inside);
        const iw = Math.max(...l.inside.lines.map((t) => textWidth(t, l.inside.size)));
        mark([l.inside.cx - iw / 2 - 2, l.inside.cy - l.inside.h / 2 - 2, l.inside.cx + iw / 2 + 2, l.inside.cy + l.inside.h / 2 + 2]);
        continue;
      }
      if (!found) found = search(l, w, reach, Math.round(maxCross / cell));
      // close by across another leader beats a long way round
      if (!found) found = search(l, w, reach, Math.round(maxCross / cell), false);
      if (!found && l.inside) {
        out.push(l.inside);
        const iw = Math.max(...l.inside.lines.map((t) => textWidth(t, l.inside.size)));
        mark([l.inside.cx - iw / 2 - 2, l.inside.cy - l.inside.h / 2 - 2, l.inside.cx + iw / 2 + 2, l.inside.cy + l.inside.h / 2 + 2]);
        continue;
      }
      if (!found) { hard.push({ ...l, w }); continue; }
      out.push({ lines: [l.name], size, cx: found.cx, cy: found.cy, h });
      log(`  beside the map: ${l.name}, leader ${Math.round(Math.hypot(found.end[0] - l.px, found.end[1] - l.py))} px`);
      long(l, found);
      mark([found.cx - w / 2 - 3, found.cy - h / 2 - 3, found.cx + w / 2 + 3, found.cy + h / 2 + 3]); // the next one keeps `gap` clear of it
      lineCells([l.px, l.py], found.end, (gx, gy) => { if (gx >= 0 && gy >= 0 && gx < gw && gy < gh && grid[gy * gw + gx] !== 2) grid[gy * gw + gx] = 3; });
      const r = size * 0.12;
      d += `M${fmt(l.px)},${fmt(l.py)}L${fmt(found.end[0])},${fmt(found.end[1])}`;
      d += `M${fmt(l.px + r)},${fmt(l.py)}A${fmt(r)},${fmt(r)} 0 1,1 ${fmt(l.px - r)},${fmt(l.py)}A${fmt(r)},${fmt(r)} 0 1,1 ${fmt(l.px + r)},${fmt(l.py)}`;
    }
    placeHard(hard);
  };
  let first = new Set(), best = null;
  for (let tries = 0; tries < 6; tries++) {
    lean = tries * 60;
    run(first);
    const cost = bad.reduce((t, b) => t + b.cost, 0);
    if (!best || cost < best.cost) best = { cost, grid: grid.slice(), out: out.slice(out0), d, logs };
    if (!bad.length) break;
    first = new Set([...bad.map((b) => b.name), ...first]);
  }
  grid.set(best.grid); out.length = out0; out.push(...best.out); d = best.d;
  for (const t of best.logs) console.log(t);
  lost.length = 0;
  return d;
}

const MAPS = {
  world: { file: 'shetachim-map.svg', title: 'Chabad shetachim', countries: null, projection: () => geoNaturalEarth1() },
  na: {
    file: 'shetachim-us-canada.svg', title: 'Chabad shetachim: United States and Canada', countries: ['US', 'CA'],
    projection: () => geoConicEqualArea().parallels([30, 58]).rotate([96, 0]),
    insets: [
      { state: 'US-AK', share: 0.2, aspect: 0.7, projection: () => geoConicEqualArea().parallels([55, 65]).rotate([154, 0]) },
      { state: 'US-HI', share: 0.09, aspect: 0.62, projection: () => geoConicEqualArea().parallels([8, 18]).rotate([157, 0]) },
    ],
  },
};
// Names too small inside (under 8 px: Tuvia Teldon, Tzach) get their own short leader to the nearest open water, like the
// world poster's; not one column far out in the Atlantic (the owner, Oct 1).
MAPS['na-names'] = { ...MAPS.na, file: 'shetachim-us-canada-names.svg', labels: true, tiny: 8, maxSize: 160, aside: { size: 22, reach: 300, far: 900, cross: 25, column: true } };
// The whole world (land no shetach covers in plain grey, Antarctica left off), with every head shliach's name, at poster size.
MAPS['world-names'] = {
  ...MAPS.world, file: 'shetachim-map-names.svg', title: 'Chabad shetachim and head shluchim', source: 'data/world-all.json', skip: ['ATA'],
  labels: true, split: true, sea: true, width: 10800, tiny: 5, maxSize: 420, aside: { size: 20, reach: 450, far: 1600, cross: 25, column: true },
};
// The two name maps in Hebrew too (head shluchim's names from web/data/he.json: run scripts/build-hebrew.mjs first).
MAPS['na-names-he'] = { ...MAPS['na-names'], file: 'shetachim-us-canada-names-he.svg', title: 'שטחי חב״ד: ארצות הברית וקנדה', he: true };
MAPS['world-names-he'] = { ...MAPS['world-names'], file: 'shetachim-map-names-he.svg', title: 'שטחי חב״ד והשלוחים הראשיים', he: true };
const heFile = path.join(ROOT, 'web', 'data', 'he.json');
const HE_DATA = fs.existsSync(heFile) ? JSON.parse(fs.readFileSync(heFile, 'utf8')) : null;
const english = new Map(shetachim.map((x) => [x.id, x]));
const baseTopo = topo;

for (const [name, m] of Object.entries(MAPS)) {
  if (process.argv[3] && process.argv[3] !== name) continue;
  if (m.he && !HE_DATA) { console.warn(`${name}: no web/data/he.json (node scripts/build-hebrew.mjs), skipped`); continue; }
  HEBREW = !!m.he;
  for (const [id, e] of english) {
    const h = HEBREW && HE_DATA.shetachim[id];
    shetachById.set(id, h ? { ...e, headShliach: h.headShliach, lastName: h.lastName, headTitle: h.headTitle } : e);
  }
  if (!m.source && topo !== baseTopo) { topo = baseTopo; arcLL = arcsOf(topo); }
  if (m.source) {
    topo = JSON.parse(fs.readFileSync(path.join(ROOT, m.source), 'utf8'));
    arcLL = arcsOf(topo);
  }
  const all = m.source ? topo.objects.areas.geometries.filter((g) => !(m.skip || []).includes(g.properties.country)) : pieces;
  const shown = m.countries ? all.filter((g) => m.countries.includes(g.properties.country)) : all;
  const insetStates = (m.insets || []).map((i) => i.state);
  const main = shown.filter((g) => !insetStates.includes(g.properties.state));
  const WIDE = m.width || WIDTH;
  const proj = fitted(m.projection(), main, [0, 0, WIDE - 2 * PAD]);
  const [bx0, by0, , by1] = bounds(proj, main);
  proj.translate([proj.translate()[0] + PAD - bx0, proj.translate()[1] + PAD - by0]);
  const height = Math.ceil(by1 - by0 + 2 * PAD);
  let body = draw(main, proj);
  const labelled = [];
  if (m.labels) labelled.push(labels(main.filter(key), proj, m.aside ? { aside: m.aside, tiny: m.tiny, width: WIDE, land: main, split: m.split, maxSize: m.maxSize, sea: m.sea } : { offshore: true }));
  // Alaska and Hawaii in boxes along the bottom left, as on the site.
  let x = PAD;
  for (const inset of m.insets || []) {
    const list = shown.filter((g) => g.properties.state === inset.state);
    const w = (WIDE - 2 * PAD) * inset.share, h = w * inset.aspect, y = height - PAD - h;
    const p = fitted(inset.projection(), list, [x + 10, y + 10, w - 20, h - 20]);
    body += `\n<rect x="${fmt(x)}" y="${fmt(y)}" width="${fmt(w)}" height="${fmt(h)}" rx="8" fill="${BG}" stroke="#d2d9dc" stroke-width="1.5"/>\n${draw(list, p)}`;
    if (m.labels) labelled.push(labels(list, p, { box: [x, y, w, h] }));
    x += w + 16;
  }
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDE}" height="${height}" viewBox="0 0 ${WIDE} ${height}">
<title>${m.title}</title>
<rect width="100%" height="100%" fill="${BG}"/>
${body}
${labelled.join('\n')}
</svg>
`;
  const out = path.join(ROOT, 'web', m.file);
  fs.writeFileSync(out, svg);
  console.log(`${path.relative(ROOT, out)}: ${WIDE}×${height}, ${byShetachOf(shown).size} shetachim, ${(svg.length / 1e6).toFixed(1)} MB`);
}
