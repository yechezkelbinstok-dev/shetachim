// Screenshots of the map (testing only; see HANDOFF.md): node scripts/screenshot.mjs <outdir> <spec>...   spec = view:base:device:theme[:clicks]
// device: desktop | phone; base: political | streets | physical | tinted; theme: light | dark; clicks, comma-separated:
// <seg>=<value> (borders=both), check=<id>, more, wait=<ms>, go=<lon>/<lat>/<zoom>
// e.g. israel:physical:desktop:light:go=35.6/33.25/9
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
    // Google Fonts isn't reachable from the sandbox: serve the page's fonts (Inter, Heebo) from the local @fontsource copies.
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
    // OpenFreeMap (the street map's style, tiles, sprites and the map's fonts) is reachable from the sandbox now: fetched
    // for real, each file kept in .cache/ofm for the next run. DEMO=1: MapLibre's demo style instead, as before.
    if (url.host === 'tiles.openfreemap.org' && process.env.DEMO && url.pathname.startsWith('/styles/')) {
      const style = await (await fetch(`${DEMO}/style.json`)).json();
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(style) });
    }
    if (url.host === 'tiles.openfreemap.org') {
      const file = path.join(REPO, '.cache', 'ofm', decodeURIComponent(url.pathname).replace(/\/$/, '') + (/\.\w+$/.test(url.pathname) ? '' : '.json'));
      const type = /\.png$/.test(file) ? 'image/png' : /\.pbf$/.test(file) ? 'application/x-protobuf' : 'application/json';
      if (!fs.existsSync(file)) {
        const r = await fetch(url.href).catch(() => null);
        if (!r || !r.ok) return route.fulfill({ status: r ? r.status : 502, body: '' });
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, Buffer.from(await r.arrayBuffer()));
      }
      return route.fulfill({ status: 200, contentType: type, body: fs.readFileSync(file) });
    }
    if (url.host === 'demotiles.maplibre.org') {
      const r = await fetch(`${DEMO}${url.pathname}`);
      return route.fulfill({ status: r.status, body: Buffer.from(await r.arrayBuffer()) });
    }
    return route.abort();
  });
  await page.goto(`https://site.test/web/index.html${process.env.QUERY || ''}`); // QUERY=?lang=he: the Hebrew page
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
    // go=lon/lat/zoom: the map engine's camera to a place (the page's __dbg.go; zoom= above was the old page's)
    else if (name === 'go') await page.evaluate(([lon, lat, z]) => new Promise((r) => { window.__dbg.go(+lon, +lat, +z); setTimeout(r, 1500); }), value.split('/'));
    else if (name === 'more') await page.evaluate(() => { document.querySelector('#more').open = true; });
    else await page.evaluate(([n, v]) => document.querySelector(`.seg[data-name="${n}"] [data-value="${v}"]`).click(), [name, value]);
  }
  await page.waitForTimeout(900);
  // (the page works its shapes and names out a slice at a time: wait till it's done)
  await page.waitForFunction(() => window.__dbg && window.__dbg.settled && window.__dbg.settled(), null, { timeout: 90000 }).catch(() => errors.push(`${spec}: never settled`));
  await page.waitForTimeout(400);
  const stats = await page.evaluate(() => ['#view-name', '#st-shetachim', '#st-centers', '#st-dots', '#base-msg'].map((s) => document.querySelector(s).textContent).join(' | '));
  const file = path.join(out, `${spec.replace(/[:/,=]/g, '_')}.png`);
  await page.screenshot({ path: file });
  console.log(`${spec}: ${stats}`);
  await ctx.close();
}
await browser.close();
if (errors.length) console.log(`ERRORS:\n${errors.join('\n')}`);
