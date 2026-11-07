// The mushrooms of the world as one picture (PNG, Hebrew and English): every mushroom (a Chabad house outside official
// Chabad: "mushroom" in data/extra-centers.json) as a red dot on a plain world map, nearby ones merged into one
// numbered dot, with close-ups of the three densest areas, the count by country and the largest networks.
// Reads web/data/centers.geojson and data/world-all.json (run `npm run build` first); writes
// work/mushrooms/mushrooms-world-he.png and work/mushrooms/mushrooms-world-en.png (owner, Nov 7: "make me a basic image
// map showing the mushrooms of the world I wanna visualize it").
//
//   node scripts/mushroom-map.mjs
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { geoNaturalEarth1, geoMercator, geoPath } from 'd3-geo';
import { feature, mesh } from 'topojson-client';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'work', 'mushrooms');
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');

// The page's colours: the mushroom red (web/index.html --mush), ink, a plain land and sea.
const RED = '#b3261e', INK = '#1e2b32', MUTED = '#5b6770', LAND = '#dde2dc', SEA = '#edf2f6', PAPER = '#fbfbf9', LINE = '#ffffff';
const W = 1600, PAD = 28;

// ---- data ----
const centers = JSON.parse(fs.readFileSync(path.join(ROOT, 'web', 'data', 'centers.geojson'), 'utf8'));
const world = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'world-all.json'), 'utf8'));
const areas = feature(world, world.objects.areas).features;
const land = areas.filter((f) => !f.properties.lake), lakes = areas.filter((f) => f.properties.lake);
const countryBorders = mesh(world, world.objects.areas, (a, b) => a !== b && !a.properties.lake && !b.properties.lake && a.properties.country !== b.properties.country);
const stateBorders = mesh(world, world.objects.areas, (a, b) => a !== b && !a.properties.lake && !b.properties.lake && a.properties.state !== b.properties.state);

const ISO = { US: 'USA', CA: 'CAN', AU: 'AUS', MX: 'MEX' };
const pts = []; const byCountry = new Map(); const nets = new Map();
for (const f of centers.features) {
  const ms = (f.properties.centers || []).filter((c) => c.mushroom);
  if (!ms.length) continue;
  const code = (f.properties.piece || '').split(':')[0];
  const country = ISO[code.split('-')[0]] || code;
  pts.push({ ll: f.geometry.coordinates, n: ms.length });
  byCountry.set(country, (byCountry.get(country) || 0) + ms.length);
  for (const c of ms) if (c.network) { const k = nets.get(c.network) || { n: 0, he: c.networkHe || c.network }; k.n++; nets.set(c.network, k); }
}
const total = pts.reduce((s, p) => s + p.n, 0);

// ---- words ----
const heAreas = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'hebrew', 'areas.json'), 'utf8'));
const EN_NAMES = { USA: 'United States', CAN: 'Canada', AUS: 'Australia', MEX: 'Mexico', IND: 'India', PHL: 'Philippines', LKA: 'Sri Lanka',
  ARG: 'Argentina', ETH: 'Ethiopia', JPN: 'Japan', UKR: 'Ukraine', BOL: 'Bolivia', ECU: 'Ecuador', BRA: 'Brazil', GTM: 'Guatemala',
  BLZ: 'Belize', HND: 'Honduras', SLV: 'El Salvador', PAN: 'Panama', NAM: 'Namibia', TZA: 'Tanzania', IDN: 'Indonesia',
  SAU: 'Saudi Arabia', KHM: 'Cambodia' };
const HE_NAMES = { USA: 'ארצות הברית', CAN: 'קנדה', AUS: 'אוסטרליה' };
const nameOf = (iso, he) => (he ? HE_NAMES[iso] || heAreas[iso] : EN_NAMES[iso]) || iso;
const T = {
  en: { dir: 'ltr', title: 'Chabad mushrooms of the world',
    sub: `${total} Chabad houses outside official Chabad (not under Merkos) · November 2026`,
    insets: ['New York, New Jersey and nearby', 'India and Sri Lanka', 'Philippines'],
    byCountry: 'By country', networks: 'Largest networks', alone: (n) => `${n} houses in no network`,
    others: (list) => `and one each in ${list}`, and: ' and ', note: 'Close dots are merged into one numbered dot.' },
  he: { dir: 'rtl', title: 'פטריות חב״ד בעולם',
    sub: `${total} בתי חב״ד מחוץ לחב״ד הרשמית (שאינם תחת מרכז לעניני חינוך) · נובמבר 2026`,
    insets: ['ניו יורק, ניו ג׳רזי והסביבה', 'הודו וסרי לנקה', 'הפיליפינים'],
    byCountry: 'לפי מדינה', networks: 'הרשתות הגדולות', alone: (n) => `${n} בתים שאינם ברשת`,
    others: (list) => `ואחד בכל אחת מאלה: ${list}`, and: ' ו', note: 'נקודות קרובות מאוחדות לנקודה אחת עם מספר.' },
};

// ---- geometry helpers ----
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
function pathsFor(projection, { states = false } = {}) {
  const gp = geoPath(projection);
  let s = `<path d="${land.map((f) => gp(f)).join('')}" fill="${LAND}"/>`;
  if (lakes.length) s += `<path d="${lakes.map((f) => gp(f)).join('')}" fill="${SEA}"/>`;
  s += `<path d="${gp(countryBorders)}" fill="none" stroke="${LINE}" stroke-width="0.8" stroke-linejoin="round"/>`;
  if (states) s += `<path d="${gp(stateBorders)}" fill="none" stroke="${LINE}" stroke-width="0.6" stroke-linejoin="round"/>`;
  return s;
}
const dot = (x, y, r, n) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${RED}" stroke="${PAPER}" stroke-width="1.6"/>` +
  (n > 1 ? `<text x="${x.toFixed(1)}" y="${(y + 0.5).toFixed(1)}" fill="#fff" font-size="${r > 11 ? 13 : 11}" font-weight="700" text-anchor="middle" dominant-baseline="central">${n}</text>` : '');
const radius = (n) => 4.6 + 2.5 * Math.sqrt(n - 1);
// greedy merge of dots closer than `gap` px (the biggest first), placed at their weighted centre
function cluster(list, projection, gap) {
  const items = list.map((p) => { const [x, y] = projection(p.ll); return { x, y, n: p.n }; }).sort((a, b) => b.n - a.n);
  const out = [];
  for (const it of items) {
    const c = out.find((o) => Math.hypot(o.x - it.x, o.y - it.y) < gap + radius(o.n) * 0.6);
    if (c) { c.x = (c.x * c.n + it.x * it.n) / (c.n + it.n); c.y = (c.y * c.n + it.y * it.n) / (c.n + it.n); c.n += it.n; } else out.push({ ...it });
  }
  return out.sort((a, b) => b.n - a.n);
}
const boxPoints = (lon0, lat0, lon1, lat1) => {
  const c = [];
  for (let i = 0; i <= 36; i++) { const lon = lon0 + (lon1 - lon0) * i / 36; c.push([lon, lat0], [lon, lat1]); }
  for (let i = 0; i <= 18; i++) { const lat = lat0 + (lat1 - lat0) * i / 18; c.push([lon0, lat], [lon1, lat]); }
  return { type: 'MultiPoint', coordinates: c };
};

// ---- render ----
const b64 = (p) => fs.readFileSync(path.join(ROOT, 'node_modules', p)).toString('base64');
const face = (family, weight, file) => `@font-face{font-family:'${family}';font-weight:${weight};src:url(data:font/woff2;base64,${b64(file)}) format('woff2');}`;
const FONTS = [
  face('Heebo', 400, '@fontsource/heebo/files/heebo-hebrew-400-normal.woff2'), face('Heebo', 700, '@fontsource/heebo/files/heebo-hebrew-700-normal.woff2'),
  face('Heebo', 400, '@fontsource/heebo/files/heebo-latin-400-normal.woff2'), face('Heebo', 700, '@fontsource/heebo/files/heebo-latin-700-normal.woff2'),
  face('Inter', 400, '@fontsource/inter/files/inter-latin-400-normal.woff2'), face('Inter', 700, '@fontsource/inter/files/inter-latin-700-normal.woff2'),
].join('');
// ---- the picture ----
const INSETS = [
  { box: [-75.4, 39.85, -71.25, 42.55], states: true },
  { box: [67.5, 4.6, 92.5, 35.8] },
  { box: [116.6, 8.6, 127.4, 15.8] },
];
const MW = W - 2 * PAD, GAP = 20, IW = (MW - 2 * GAP) / 3, IH = 330;
const WORLD = boxPoints(-169, -58, 180, 80);
function worldSvg() {
  const proj = geoNaturalEarth1().fitWidth(MW, WORLD);
  const [[x0, y0], [x1, y1]] = geoPath(proj).bounds(WORLD);
  proj.translate([proj.translate()[0] - x0, proj.translate()[1] - y0]);
  const h = Math.ceil(y1 - y0);
  let s = `<defs><clipPath id="wclip"><rect width="${MW}" height="${h}" rx="10"/></clipPath></defs><rect width="${MW}" height="${h}" rx="10" fill="${SEA}"/><g clip-path="url(#wclip)">${pathsFor(proj)}`;
  // where the close-ups are: a dashed box, its number at the box's top right (out to sea for New York)
  INSETS.forEach((ins, i) => {
    const [a, b, c, d] = ins.box, [bx0, by0] = proj([a, d]), [bx1, by1] = proj([c, b]);
    const L = Math.min(bx0, bx1) - 3, T0 = Math.min(by0, by1) - 3, R = Math.max(bx0, bx1) + 3, B = Math.max(by0, by1) + 3;
    s += `<rect x="${L}" y="${T0}" width="${R - L}" height="${B - T0}" rx="4" fill="none" stroke="${MUTED}" stroke-width="1" stroke-dasharray="3 3"/>`;
    const small = R - L < 40, tx = small ? R + 22 : R, ty = small ? T0 - 8 : T0;
    if (small) s += `<line x1="${R}" y1="${T0 + 4}" x2="${tx - 7}" y2="${ty + 5}" stroke="${MUTED}" stroke-width="1"/>`;
    s += `<circle cx="${tx}" cy="${ty}" r="9" fill="${INK}"/><text x="${tx}" y="${ty + 0.5}" fill="#fff" font-size="11" font-weight="700" text-anchor="middle" dominant-baseline="central">${i + 1}</text>`;
  });
  for (const c of cluster(pts, proj, 9)) s += dot(c.x, c.y, radius(c.n), c.n);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${MW}" height="${h}" viewBox="0 0 ${MW} ${h}">${s}</g></svg>`;
}
function insetSvg(ins, i) {
  const [a, b, c, d] = ins.box;
  const inside = pts.filter((p) => p.ll[0] >= a && p.ll[0] <= c && p.ll[1] >= b && p.ll[1] <= d);
  const proj = geoMercator().fitExtent([[0, 0], [IW, IH]], boxPoints(a, b, c, d));
  let s = `<defs><clipPath id="c${i}"><rect width="${IW}" height="${IH}" rx="10"/></clipPath></defs><rect width="${IW}" height="${IH}" rx="10" fill="${SEA}"/><g clip-path="url(#c${i})">${pathsFor(proj, { states: ins.states })}`;
  for (const c2 of cluster(inside, proj, 3)) s += dot(c2.x, c2.y, radius(c2.n), c2.n);
  return { svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${IW}" height="${IH}" viewBox="0 0 ${IW} ${IH}">${s}</g></svg>`, count: inside.reduce((n, p) => n + p.n, 0) };
}
function page(lang) {
  const t = T[lang], rtl = t.dir === 'rtl';
  const countries = [...byCountry.entries()].sort((p, q) => q[1] - p[1] || nameOf(p[0], rtl).localeCompare(nameOf(q[0], rtl)));
  const many = countries.filter(([, n]) => n > 1).map(([k, n]) => `${nameOf(k, rtl)} ${n}`);
  const ones = countries.filter(([, n]) => n === 1).map(([k]) => nameOf(k, rtl)).sort((p, q) => p.localeCompare(q, rtl ? 'he' : 'en'));
  const onesText = ones.length > 1 ? ones.slice(0, -1).join(', ') + (rtl ? ' ו' : ', and ') + ones[ones.length - 1] : ones.join('');
  const big = [...nets.entries()].sort((p, q) => q[1].n - p[1].n).filter(([, v]) => v.n >= 3).map(([k, v]) => `${rtl ? v.he : k} ${v.n}`);
  const inNets = [...nets.values()].reduce((s, v) => s + v.n, 0);
  const insets = INSETS.map((ins, i) => { const r = insetSvg(ins, i); return `<figure><figcaption><span class="tag">${i + 1}</span>${esc(t.insets[i])} · ${r.count}</figcaption>${r.svg}</figure>`; }).join('');
  const font = rtl ? "'Heebo', sans-serif" : "'Inter', sans-serif";
  const css = `body{margin:0;background:${PAPER};color:${INK};font-family:${font}}main{width:${MW}px;padding:${PAD}px}
h1{margin:0;font-size:34px;line-height:1.15}p.sub{margin:6px 0 22px;font-size:18px;color:${MUTED}}svg{display:block}
.row{display:flex;gap:${GAP}px;margin-top:24px}figure{margin:0;width:${IW}px}figcaption{display:flex;align-items:center;gap:8px;font-size:17px;font-weight:700;margin-bottom:10px}
.tag{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:50%;background:${INK};color:#fff;font-size:12px}
.foot{margin-top:24px;font-size:15px;line-height:1.55}.foot p{margin:0 0 6px}.note{color:${MUTED};font-size:13px}`;
  return `<!doctype html><html dir="${t.dir}" lang="${lang}"><head><meta charset="utf-8"><style>${FONTS}${css}</style></head><body><main>
<h1>${esc(t.title)}</h1><p class="sub">${esc(t.sub)}</p>${worldSvg()}<div class="row">${insets}</div>
<div class="foot"><p><b>${esc(t.byCountry)}:</b> ${esc(many.join(' · '))} · ${esc(t.others(onesText))}</p>
<p><b>${esc(t.networks)}:</b> ${esc(big.join(' · '))} · ${esc(t.alone(total - inNets))}</p><p class="note">${esc(t.note)}</p></div></main></body></html>`;
}

fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const lang of ['he', 'en']) {
  const pg = await browser.newPage({ viewport: { width: W, height: 800 }, deviceScaleFactor: 2 });
  await pg.setContent(page(lang));
  await pg.evaluate(() => document.fonts.ready);
  await pg.waitForTimeout(300);
  const file = path.join(OUT, `mushrooms-world-${lang}.png`);
  await pg.screenshot({ path: file, fullPage: true });
  const h = await pg.evaluate(() => document.documentElement.scrollHeight);
  console.log(`${path.relative(ROOT, file)}: ${total} mushrooms, ${pts.length} dots, ${W}x${h} (x2)`);
  await pg.close();
}
await browser.close();
