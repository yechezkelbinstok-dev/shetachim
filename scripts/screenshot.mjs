// Screenshots of the map (testing only; see HANDOFF.md): node scripts/screenshot.mjs <outdir> <spec>...   spec = view:base:device:theme[:clicks]
// device: desktop | phone; base: political | physical; theme: light | dark
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');

const REPO = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const LIB = process.env.LIB || path.join(REPO, '.cache', 'testlib', 'node_modules'); // npm install --prefix .cache/testlib d3@7.9.0 topojson@3.0.2 maplibre-gl@4.7.1
const DEMO = 'https://raw.githubusercontent.com/maplibre/demotiles/gh-pages';
const out = process.argv[2];
fs.mkdirSync(out, { recursive: true });
const specs = process.argv.slice(3);

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const errors = [];
for (const spec of specs) {
  const [view, base, device, theme, extra] = spec.split(':');
  const vp = device === 'phone' ? { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : { width: 1400, height: 860 };
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.isMobile, hasTouch: vp.hasTouch, deviceScaleFactor: vp.deviceScaleFactor || 1, colorScheme: theme });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(`${spec}: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`${spec}: console ${m.text()}`); });
  await page.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.host === 'site.test') {
      const file = path.join(REPO, decodeURIComponent(url.pathname));
      if (!fs.existsSync(file)) return route.fulfill({ status: 404, body: '' });
      const type = file.endsWith('.html') ? 'text/html' : file.endsWith('.json') || file.endsWith('.geojson') ? 'application/json' : 'application/octet-stream';
      return route.fulfill({ status: 200, contentType: type, body: fs.readFileSync(file) });
    }
    if (url.host === 'cdnjs.cloudflare.com') {
      const map = { 'd3.min.js': 'd3/dist/d3.min.js', 'topojson.min.js': 'topojson/dist/topojson.min.js', 'maplibre-gl.js': 'maplibre-gl/dist/maplibre-gl.js' };
      const f = map[path.basename(url.pathname)];
      return f ? route.fulfill({ status: 200, contentType: 'text/javascript', body: fs.readFileSync(path.join(LIB, f)) }) : route.abort();
    }
    if (url.host === 'tiles.openfreemap.org' && url.pathname.startsWith('/styles/')) {
      const style = await (await fetch(`${DEMO}/style.json`)).json();
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(style) });
    }
    if (url.host === 'demotiles.maplibre.org') {
      const r = await fetch(`${DEMO}${url.pathname}`);
      return route.fulfill({ status: r.status, body: Buffer.from(await r.arrayBuffer()) });
    }
    return route.abort();
  });
  await page.goto('https://site.test/web/index.html');
  await page.waitForFunction(() => document.querySelector('#st-dots').textContent !== '–');
  await page.evaluate(([v]) => document.querySelector(`.seg[data-name="view"] [data-value="${v}"]`).click(), [view]);
  // The page opens on the physical map; wait for it (or its fallback), then pick the one wanted.
  await page.waitForFunction(() => document.querySelector('#app').classList.contains('physical') || !document.querySelector('#base-msg').hidden, null, { timeout: 30000 }).catch(() => {});
  await page.evaluate((b) => document.querySelector(`.seg[data-name="base"] [data-value="${b}"]`).click(), base);
  await page.waitForTimeout(base === 'physical' ? 6000 : 500);
  for (const c of (extra || '').split(',').filter(Boolean)) {
    const [name, value] = c.split('=');
    if (name === 'check') await page.evaluate((id) => document.querySelector(id).click(), `#${value}`);
    else if (name === 'wait') await page.waitForTimeout(+value);
    else if (name === 'zoom') await page.evaluate(([x, y, k]) => new Promise((r) => { const svg = document.querySelector('#map'); svg.dispatchEvent(new WheelEvent('wheel', { clientX: +x, clientY: +y, deltaY: -Math.log2(+k) * 500, bubbles: true })); setTimeout(r, 800); }), value.split('/'));
    else await page.evaluate(([n, v]) => document.querySelector(`.seg[data-name="${n}"] [data-value="${v}"]`).click(), [name, value]);
  }
  await page.waitForTimeout(900);
  const stats = await page.evaluate(() => ['#view-name', '#st-shetachim', '#st-centers', '#st-dots', '#base-msg'].map((s) => document.querySelector(s).textContent).join(' | '));
  const file = path.join(out, `${spec.replace(/[:/,=]/g, '_')}.png`);
  await page.screenshot({ path: file });
  console.log(`${spec}: ${stats}`);
  await ctx.close();
}
await browser.close();
if (errors.length) console.log(`ERRORS:\n${errors.join('\n')}`);
