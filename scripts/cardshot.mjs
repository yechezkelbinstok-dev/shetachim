// Card screenshots: node cardshot.mjs <outdir> <en|he> <light|dark> <desktop|phone> <name>=<js showing the card>[@@<selector to click>]...
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const REPO = new URL('..', import.meta.url).pathname.replace(/\/$/, ''); // the repo
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
    const file = process.env.PAGE && url.pathname === '/web/index.html' ? process.env.PAGE : path.join(REPO, decodeURIComponent(url.pathname));
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
await page.goto(`https://site.test/web/index.html${lang === 'he' ? '?lang=he' : ''}`);
await page.waitForFunction(() => document.querySelector('#st-dots').textContent !== '–', null, { timeout: 60000 });
await page.evaluate(() => document.querySelector('.seg[data-name="base"] [data-value="political"]').click());
await page.waitForTimeout(1500);
for (const spec of cards) {
  const eq = spec.indexOf('=');
  const name = spec.slice(0, eq), [expr, ...clicks] = spec.slice(eq + 1).split('@@');
  await page.evaluate(expr);
  await page.waitForTimeout(400);
  for (const sel of clicks) {
    if (sel.startsWith('scroll:')) { await page.evaluate((y) => { document.querySelector('#card').scrollTop = +y; }, sel.slice(7)); continue; }
    if (sel.startsWith('eval:')) { const r = await page.evaluate(sel.slice(5)); if (r !== undefined) console.log('eval:', JSON.stringify(r)); await page.waitForTimeout(300); continue; }
    if (sel.startsWith('wait:')) { await page.waitForTimeout(+sel.slice(5)); continue; }
    await page.click(sel); await page.waitForTimeout(250);
  }
  if (name.startsWith('full-')) {
    await page.waitForFunction(() => window.__dbg && window.__dbg.settled && window.__dbg.settled(), null, { timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(600);
    const file = path.join(out, `${name}-${lang}-${theme}-${device}.png`);
    await page.screenshot({ path: file });
    console.log(file);
    continue;
  }
  const box = await page.evaluate(() => { const r = document.querySelector('#card').getBoundingClientRect(); return { x: r.left, y: r.top, width: r.width, height: r.height }; });
  const pad = 14, clip = { x: Math.max(0, box.x - pad), y: Math.max(0, box.y - pad), width: Math.min(vp.width - Math.max(0, box.x - pad), box.width + 2 * pad), height: Math.min(vp.height - Math.max(0, box.y - pad), box.height + 2 * pad) };
  const file = path.join(out, `${name}-${lang}-${theme}-${device}.png`);
  await page.screenshot({ path: file, clip });
  console.log(file, Math.round(box.width) + 'x' + Math.round(box.height));
}
await browser.close();
if (errors.length) console.log('ERRORS:\n' + errors.join('\n'));
