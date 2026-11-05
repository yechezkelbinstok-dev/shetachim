// Card screenshots: node cardshot.mjs <outdir> <en|he> <light|dark> <desktop|phone> <name>=<js showing the card>[@@<selector to click>]...
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const REPO = '/home/user/shetachim';
const LIB = path.join(REPO, '.cache', 'testlib', 'node_modules');
const [out, lang, theme, device, ...cards] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const vp = device === 'phone' ? { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : { width: 1400, height: 860, deviceScaleFactor: 2 };
const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.isMobile, hasTouch: vp.hasTouch, deviceScaleFactor: vp.deviceScaleFactor, colorScheme: theme });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(`console ${m.text()}`); });
await page.route('**/*', async (route) => {
  const url = new URL(route.request().url());
  if (url.host === 'site.test') {
    const file = path.join(REPO, decodeURIComponent(url.pathname));
    if (!fs.existsSync(file)) return route.fulfill({ status: 404, body: '' });
    const type = file.endsWith('.html') ? 'text/html' : file.endsWith('.json') || file.endsWith('.geojson') ? 'application/json' : file.endsWith('.js') ? 'text/javascript' : 'application/octet-stream';
    return route.fulfill({ status: 200, contentType: type, body: fs.readFileSync(file) });
  }
  if (url.host === 'cdnjs.cloudflare.com') {
    const map = { 'd3.min.js': 'd3/dist/d3.min.js', 'topojson.min.js': 'topojson/dist/topojson.min.js', 'maplibre-gl.js': 'maplibre-gl/dist/maplibre-gl.js' };
    const f = map[path.basename(url.pathname)];
    return f ? route.fulfill({ status: 200, contentType: 'text/javascript', body: fs.readFileSync(path.join(LIB, f)) }) : route.abort();
  }
  if (url.host === 'fonts.googleapis.com') {
    const css = [400, 500, 600, 700].map((w) => `@font-face{font-family:Inter;font-weight:${w};src:url(https://fonts.gstatic.com/inter-${w}.woff2) format('woff2')}`
      + `@font-face{font-family:Heebo;font-weight:${w};src:url(https://fonts.gstatic.com/heebo-${w}.woff2) format('woff2')}`).join('');
    return route.fulfill({ status: 200, contentType: 'text/css', body: css });
  }
  if (url.host === 'fonts.gstatic.com') {
    const [, fam, w] = /(inter|heebo)-(\d+)/.exec(url.pathname) || [];
    const file = w && path.join(REPO, 'node_modules', '@fontsource', fam, 'files', `${fam}-${fam === 'heebo' ? 'hebrew' : 'latin'}-${w}-normal.woff2`);
    return file && fs.existsSync(file) ? route.fulfill({ status: 200, contentType: 'font/woff2', body: fs.readFileSync(file) }) : route.abort();
  }
  if (url.host === 'tiles.openfreemap.org') {
    const file = path.join(REPO, '.cache', 'ofm', decodeURIComponent(url.pathname).replace(/\/$/, '') + (/\.\w+$/.test(url.pathname) ? '' : '.json'));
    const type = /\.png$/.test(file) ? 'image/png' : /\.pbf$/.test(file) ? 'application/x-protobuf' : 'application/json';
    if (!fs.existsSync(file)) return route.fulfill({ status: 404, body: '' });
    return route.fulfill({ status: 200, contentType: type, body: fs.readFileSync(file) });
  }
  return route.abort();
});
for (const lang of ['en', 'he']) {
  await page.goto(`https://site.test/web/index.html${lang === 'he' ? '?lang=he' : ''}`);
  await page.waitForFunction(() => document.querySelector('#st-dots').textContent !== '–', null, { timeout: 60000 });
  await page.evaluate(() => document.querySelector('.seg[data-name="base"] [data-value="political"]').click());
  await page.waitForTimeout(1500);
  const r = await page.evaluate(() => {
    const out = { dots: 0, caps: 0, nets: 0, errors: [] };
    const m = document.querySelector('#show-mushrooms'); if (!m.checked) m.click();
    const D = window.__dbg;
    const V = D.V();
    for (const d of V.dots) {
      try { D.showCard({ dot: d }); out.dots++; if (document.querySelector('#card .net-show')) out.nets++; }
      catch (e) { out.errors.push(`dot ${d.centers[0].name}: ${e.message}`); }
    }
    for (const c of D.capitals()) {
      try { D.showCard({ capital: c }); out.caps++; } catch (e) { out.errors.push(`cap ${c.name}: ${e.message}`); }
    }
    return out;
  });
  console.log(lang, JSON.stringify({ ...r, errors: r.errors.slice(0, 10), nErrors: r.errors.length }));
}
await browser.close();
if (errors.length) console.log('PAGE ERRORS:\n' + errors.slice(0, 20).join('\n'));
