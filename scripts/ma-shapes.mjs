// Massachusetts's inner borders as shapes (data/shapes/ma-*.geojson), from the town-by-town assignment in
// data/shapes/ma-towns.json. The borders are the real town lines (owner, Nov 3: "Look at the North Shore. That's like a
// proper, nice European border type ... not the current weird curves"), except where a town line made a spike or a
// zigzag: there a straight line between two town corners cuts across instead (ma-towns.json `cuts`; the owner: "Straight
// can also work sometimes ... a hybrid of straight and not straight"). No grid, no smoothing.
// Every town goes to its listed shetach, or by its middle's side of the `split` meridian; a cut's towns are split along
// its line (left of the line, as drawn from its first point to its second, to `left`; the rest to `right`). Connecticut's
// line (`deren`) stays exactly straight, Cape Cod keeps its counties, and the `exact` shetachim (the North Shore) keep
// their own town (and tract) claims in shetachim.json: the shapes are cut to them.
// `patches`, last: a polygon whose land goes from one shetach to another (`from` → `to`), for a straight line that
// shouldn't run across a whole town (one edge of the polygon is the new line; the others run through land that is on
// its side already, so they change nothing). Applied in order, after the towns and the cuts.
// Run: node scripts/ma-shapes.mjs   (after a first `npm run build`, which downloads the Census files into .cache),
// then npm run build.
import fs from 'node:fs';
import path from 'node:path';
import mapshaper from 'mapshaper';
import polygonClipping from 'polygon-clipping';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const readJSON = (...p) => JSON.parse(fs.readFileSync(path.join(ROOT, ...p), 'utf8'));
const cfg = readJSON('data', 'shapes', 'ma-towns.json');
const towns = readJSON('.cache', 'county-subdivision-25.json').features.filter((f) => f.geometry);
const tracts = readJSON('.cache', 'tract-25.json').features;
const capeIds = Object.values(cfg.counties).flat();
const cape = readJSON('.cache', 'county.json').features.filter((f) => capeIds.includes(f.properties.GEOID));

const townKey = (s) => s.toLowerCase().replace(/ town$/, '').replace(/[^a-z]/g, '');
const labelOf = new Map(Object.entries(cfg.towns).flatMap(([id, list]) => list.map((t) => [townKey(t), id])));
const exact = new Set(cfg.exact || []);
const polys = (g) => (g.type === 'Polygon' ? [g.coordinates] : g.coordinates);
// a town's middle: the average of its outer rings' corners (only which side of the split it's on matters)
const middle = (g) => { let x = 0, n = 0; for (const p of polys(g)) for (const [lon] of p[0]) { x += lon; n++; } return x / n; };

// A cut's left side as a polygon: its line carried on 1° past both ends, closed 2° off to its left.
function leftOf(line) {
  const [[x1, y1], [x2, y2]] = line, len = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / len, uy = (y2 - y1) / len;
  const a = [x1 - ux, y1 - uy], b = [x2 + ux, y2 + uy], lx = -uy * 2, ly = ux * 2;
  return [[a, b, [b[0] + lx, b[1] + ly], [a[0] + lx, a[1] + ly], a]];
}
const cutOf = new Map((cfg.cuts || []).flatMap((c) => c.towns.map((t) => [townKey(t), { ...c, left: c.left, right: c.right, poly: leftOf(c.line) }])));
for (const c of cfg.cuts || []) for (const t of c.towns) if (!towns.some((f) => townKey(f.properties.NAME) === townKey(t))) throw new Error(`cut: no town ${t}`);

let pieces = [];
const feat = (label, mp) => ({ type: 'Feature', properties: { label }, geometry: { type: 'MultiPolygon', coordinates: mp } });
const add = (label, mp) => { if (mp.length) pieces.push(feat(label, mp)); };
for (const f of towns) {
  const county = f.properties.STATEFP + f.properties.COUNTYFP, k = townKey(f.properties.NAME);
  if (capeIds.includes(county)) continue; // Cape Cod and the Islands: its own county claims
  const label = labelOf.get(k) ?? (middle(f.geometry) < cfg.split ? cfg.westOfSplit : cfg.eastOfSplit);
  if (exact.has(label)) continue; // the North Shore: its own town claims
  const cut = cutOf.get(k), g = polys(f.geometry);
  if (!cut) { add(label, g); continue; }
  add(cut.left, polygonClipping.intersection(g, cut.poly));
  add(cut.right, polygonClipping.difference(g, cut.poly));
}
for (const p of cfg.patches || []) {
  const from = [].concat(p.from), poly = [[...p.polygon, p.polygon[0]]];
  let moved = 0;
  pieces = pieces.flatMap((f) => {
    if (!from.includes(f.properties.label)) return [f];
    const g = f.geometry.coordinates, inn = polygonClipping.intersection(g, poly);
    if (!inn.length) return [f];
    moved++;
    const out = polygonClipping.difference(g, poly);
    return [feat(p.to, inn), ...(out.length ? [feat(f.properties.label, out)] : [])];
  });
  if (!moved) throw new Error(`patch changes nothing: ${p.why}`);
}
// the North Shore's own tracts (East Boston): out of the shapes, as its towns are
const exactTracts = tracts.filter((f) => Object.entries(cfg.tracts || {}).some(([id, list]) => exact.has(id) && list.includes(f.properties.GEOID)));
const out = await mapshaper.applyCommands(
  `-i pieces.json -dissolve2 label -clip bbox=${cfg.deren},41,-69,43.2 -erase cape.json -erase tracts.json -o out.json format=geojson precision=0.00001`,
  { 'pieces.json': JSON.stringify({ type: 'FeatureCollection', features: pieces }),
    'cape.json': JSON.stringify({ type: 'FeatureCollection', features: cape }),
    'tracts.json': JSON.stringify({ type: 'FeatureCollection', features: exactTracts.length ? exactTracts : [] }) });
const drawn = JSON.parse(out['out.json']).features;
for (const [id, name] of Object.entries(cfg.shapes)) {
  const f = drawn.find((d) => d.properties.label === id);
  if (!f) throw new Error(`no land for ${id}`);
  const file = path.join(ROOT, 'data', 'shapes', `${name}.geojson`);
  fs.writeFileSync(file, JSON.stringify({ type: 'FeatureCollection', features: [{ type: 'Feature', properties: { name, source: `${id}'s part of Massachusetts east of ${cfg.deren}°W, made by scripts/ma-shapes.mjs from data/shapes/ma-towns.json: its towns' own lines, and straight cuts between town corners` }, geometry: f.geometry }] }));
  console.log(`${path.relative(ROOT, file)}: ${(fs.statSync(file).size / 1024).toFixed(0)} KB`);
}
// every house in its own shetach still (as the map has it now)
const houses = readJSON('web', 'data', 'centers.geojson').features.filter((f) => f.properties.region === 'US-MA');
const inside = (x, y, g) => polys(g).some((p) => { let c = false; for (const r of p) for (let i = 0, j = r.length - 1; i < r.length; j = i++) { const [xi, yi] = r[i], [xj, yj] = r[j]; if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c; } return c; });
let moved = 0;
for (const h of houses) {
  const [x, y] = h.geometry.coordinates, now = h.properties.piece.split(':')[1];
  const f = drawn.find((d) => inside(x, y, d.geometry));
  if (f && Object.keys(cfg.shapes).includes(now) && f.properties.label !== now) { moved++; console.log(`MOVES: ${h.properties.centers[0].name} (${now} → ${f.properties.label})`); }
}
console.log(`${pieces.length} town pieces; ${houses.length} houses, ${moved} would change shetach`);
