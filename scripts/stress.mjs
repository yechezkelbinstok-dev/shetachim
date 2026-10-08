// Stress test of web/index.html (testing only; see HANDOFF.md): node scripts/stress.mjs. Flips labels, views, language, maps and
// options while the page is still working things out, opens a card, zooms to it, reloads; prints what each source holds
// and any page errors ("no errors" at the end is the pass).
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const REPO = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const LIB = path.join(REPO, '.cache', 'testlib', 'node_modules');
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const ctx = await browser.newContext({ viewport: { width: 1400, height: 860 } });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(`pageerror ${e.message}`));
page.on('console', (m) => { const t = m.text(); if (m.type() === 'error' && !/Failed to load resource|^Error$|Failed to fetch/.test(t)) errors.push(`console ${t.slice(0, 300)}`); });
await page.route('**/*', async (route) => {
  const url = new URL(route.request().url());
  if (url.host === 'site.test') {
    const file = path.join(REPO, decodeURIComponent(url.pathname));
    if (!fs.existsSync(file)) return route.fulfill({ status: 404, body: '' });
    const st = fs.statSync(file);
    return route.fulfill({ status: 200, contentType: file.endsWith('.html') ? 'text/html' : file.endsWith('.js') ? 'text/javascript' : 'application/json', body: fs.readFileSync(file), headers: { etag: `"${st.mtimeMs.toString(16)}-${st.size.toString(16)}"` } });
  }
  if (url.host === 'cdnjs.cloudflare.com') {
    const map = { 'd3.min.js': 'd3/dist/d3.min.js', 'topojson.min.js': 'topojson/dist/topojson.min.js', 'maplibre-gl.js': 'maplibre-gl/dist/maplibre-gl.js' };
    const f = map[path.basename(url.pathname)];
    return f ? route.fulfill({ status: 200, contentType: 'text/javascript', body: fs.readFileSync(path.join(LIB, f)) }) : route.abort();
  }
  if (url.host === 'tiles.openfreemap.org') {
    const file = path.join(REPO, '.cache', 'ofm', decodeURIComponent(url.pathname).replace(/\/$/, '') + (/\.\w+$/.test(url.pathname) ? '' : '.json'));
    if (fs.existsSync(file)) return route.fulfill({ status: 200, body: fs.readFileSync(file) });
    const r = await fetch(url.href).catch(() => null);
    if (!r || !r.ok) return route.fulfill({ status: r ? r.status : 502, body: '' });
    const b = Buffer.from(await r.arrayBuffer()); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, b);
    return route.fulfill({ status: 200, body: b });
  }
  return route.abort();
});
const click = (name, value) => page.evaluate(([n, v]) => document.querySelector(`.seg[data-name="${n}"] [data-value="${v}"]`).click(), [name, value]);
const settled = (ms = 120000) => page.waitForFunction(() => window.__dbg && window.__dbg.settled && window.__dbg.settled(), null, { timeout: ms });
const wait = (ms) => page.waitForTimeout(ms);
const state = () => page.evaluate(() => { const m = window.__map, V = window.__dbg.V(); const n = m.getSource('names' + V.cur.sfx)._data; return { view: V.view.name, set: V.cur.id, names: n.features ? n.features.length : typeof n, sample: n.features && n.features[0] ? n.features[0].properties.t : null, areas: (m.getSource('areas' + V.cur.sfx)._data.features || []).length }; });
await page.goto('https://site.test/web/index.html');
await page.waitForFunction(() => document.documentElement.dataset.ready === '1', null, { timeout: 120000 });
// 1. label mode flips while the names are still being worked out
await click('labels', 'full'); await wait(150); await click('labels', 'name'); await wait(100); await click('labels', 'full');
await settled(); console.log('1 labels full:', JSON.stringify(await state()));
// 2. views in quick succession
for (const v of ['europe', 'asia', 'fsu', 'world', 'israel', 'na']) { await click('view', v); await wait(120); }
await settled(); console.log('2 views -> na:', JSON.stringify(await state()));
// 3. Hebrew while names are being worked out, then back
await click('view', 'world'); await wait(100);
await page.evaluate(() => document.querySelector('#lang-toggle').click()); await wait(300);
await settled(); console.log('3 hebrew:', JSON.stringify(await state()));
await page.evaluate(() => document.querySelector('#lang-toggle').click());
await settled(); console.log('3b english:', JSON.stringify(await state()));
// 4. maps
for (const b of ['streets', 'physical', 'tinted', 'political']) { await click('base', b); await wait(400); }
await settled(); console.log('4 maps -> political:', JSON.stringify(await state()));
// 5. options
await page.evaluate(() => document.querySelector('#show-empty').click()); await wait(200);
await page.evaluate(() => document.querySelector('#show-sea').click()); await wait(200);
await click('borders', 'both'); await wait(200); await click('borders', 'regular');
await settled(); console.log('5 empty, grey sea, states:', JSON.stringify(await state()));
await page.evaluate(() => document.querySelector('#show-empty').click()); await page.evaluate(() => document.querySelector('#show-sea').click()); await click('borders', 'shetach');
await settled();
// 6. a tap on an area: its card, its outline; zoom to it
const card = await page.evaluate(() => new Promise((r) => {
  const m = window.__map, V = window.__dbg.V();
  const p = m.project(V.cur.flat ? m.getCenter() : m.getCenter());
  const fs2 = m.queryRenderedFeatures({ layers: ['pick' + V.cur.sfx] });
  const f = fs2.find((x) => x.properties.shetach);
  window.__dbg.showCard({ piece: { id: f.properties.id, ...f.properties } });
  setTimeout(() => r({ card: document.querySelector('#card').innerText.slice(0, 80), outline: (m.getSource('hover-area' + V.cur.sfx)._data.geometry || {}).type || null }), 300);
}));
console.log('6 card:', JSON.stringify(card));
await page.evaluate(() => { const b = document.querySelector('#card .zoomto'); if (b) b.click(); });
await wait(1500); await settled();
console.log('6b zoomed:', await page.evaluate(() => window.__map.getZoom().toFixed(2)));
// 7. reload: names straight from the browser's store
await page.reload();
await page.waitForFunction(() => document.documentElement.dataset.drawn === '1', null, { timeout: 120000 });
console.log('7 reload:', JSON.stringify(await state()));
console.log(errors.length ? `ERRORS:\n${errors.join('\n')}` : 'no errors');
await browser.close();
