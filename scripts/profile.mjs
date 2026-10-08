// Startup profiler for web/index.html (testing only; see HANDOFF.md, SPEED): node scripts/profile.mjs <phone|desktop> <cpuRate>
// e.g. node scripts/profile.mjs phone 4 (a slow phone: the CPU 4x slower). RELOAD=1 also times a reload (the names from
// the browser's store). Prints: when the data was in, the page ready, everything drawn (data-drawn) and the map idle;
// when each source was handed its data (window.__feedLog); the longest stretches of main-thread work and what ran in
// them; top functions by self and total time; frame times while panning and zooming (meaningless under SwiftShader,
// which draws on the CPU: look at the long tasks instead).
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');

const REPO = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const LIB = path.join(REPO, '.cache', 'testlib', 'node_modules');
const [device = 'phone', rate = '4', view = 'world', query = ''] = process.argv.slice(2); // (view: only printed; query: e.g. ?lang=he)
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--enable-precise-memory-info'] });
const vp = device === 'phone' ? { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : { width: 1400, height: 860 };
const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.isMobile, hasTouch: vp.hasTouch, deviceScaleFactor: vp.deviceScaleFactor || 1 });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
const bytes = new Map();
await page.route('**/*', async (route) => {
  const url = new URL(route.request().url());
  if (url.host === 'site.test') {
    const file = path.join(REPO, decodeURIComponent(url.pathname));
    if (!fs.existsSync(file)) return route.fulfill({ status: 404, body: '' });
    const body = fs.readFileSync(file);
    bytes.set(url.pathname, body.length);
    const type = file.endsWith('.html') ? 'text/html' : file.endsWith('.json') || file.endsWith('.geojson') ? 'application/json' : 'application/octet-stream';
    const st = fs.statSync(file);
    return route.fulfill({ status: 200, contentType: type, body, headers: { etag: `"${st.mtimeMs.toString(16)}-${st.size.toString(16)}"` } });
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
    if (!fs.existsSync(file)) {
      const r = await fetch(url.href).catch(() => null);
      if (!r || !r.ok) return route.fulfill({ status: r ? r.status : 502, body: '' });
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, Buffer.from(await r.arrayBuffer()));
    }
    return route.fulfill({ status: 200, contentType: type, body: fs.readFileSync(file) });
  }
  return route.abort();
});
const cdp = await ctx.newCDPSession(page);
await cdp.send('Emulation.setCPUThrottlingRate', { rate: +rate });
await cdp.send('Profiler.enable');
await cdp.send('Profiler.setSamplingInterval', { interval: 500 });
await page.addInitScript(() => {
  window.__long = [];
  window.__feedLog = [];
  try { new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__long.push([Math.round(e.startTime), Math.round(e.duration)]); }).observe({ type: 'longtask', buffered: true }); } catch (e) {}
});
await cdp.send('Profiler.start');
const t0 = Date.now();
await page.goto(`https://site.test/web/index.html${query}`);
await page.waitForFunction(() => document.querySelector('#st-dots') && document.querySelector('#st-dots').textContent !== '–', null, { timeout: 180000 });
const tData = Date.now() - t0;
await page.waitForFunction(() => document.documentElement.dataset.ready === '1', null, { timeout: 180000 });
const tReady = Date.now() - t0;
let tDrawn = -1;
try { await page.waitForFunction(() => document.documentElement.dataset.drawn === '1', null, { timeout: 180000 }); tDrawn = Date.now() - t0; } catch (e) { console.log('never drawn'); }
// first time the map is idle (everything drawn)
await page.evaluate(() => new Promise((r) => { const m = window.__map; const done = () => r(null); if (!m) return done(); m.once('idle', done); m.triggerRepaint(); setTimeout(done, 60000); }));
const tIdle = Date.now() - t0;
const { profile } = await cdp.send('Profiler.stop');
// self time per function
const self = new Map();
const byId = new Map(profile.nodes.map((n) => [n.id, n]));
const dt = profile.timeDeltas;
for (let i = 0; i < profile.samples.length; i++) {
  const n = byId.get(profile.samples[i]);
  const cf = n.callFrame;
  const key = `${cf.functionName || '(anon)'} ${cf.url.split('/').pop()}:${cf.lineNumber + 1}`;
  self.set(key, (self.get(key) || 0) + (dt[i] || 0) / 1000);
}
const top = [...self].sort((a, b) => b[1] - a[1]).slice(0, 35);
// inclusive time of the page's own functions (index.html), each counted once per sample
const parent = new Map();
for (const n of profile.nodes) for (const c of n.children || []) parent.set(c, n.id);
const incl = new Map();
for (let i = 0; i < profile.samples.length; i++) {
  const seen = new Set();
  for (let id = profile.samples[i]; id != null; id = parent.get(id)) {
    const cf = byId.get(id).callFrame;
    if (!/index\.html/.test(cf.url)) continue;
    const key = `${cf.functionName || '(anon)'}:${cf.lineNumber + 1}`;
    if (seen.has(key)) continue;
    seen.add(key);
    incl.set(key, (incl.get(key) || 0) + (dt[i] || 0) / 1000);
  }
}
const topIncl = [...incl].sort((a, b) => b[1] - a[1]).slice(0, 40);
const long = await page.evaluate(() => window.__long);
console.log(`device ${device}, CPU ${rate}x, view ${view}: data ${tData} ms, ready ${tReady} ms, drawn ${tDrawn} ms, idle ${tIdle} ms`);
const feedLog = await page.evaluate(() => window.__feedLog);
console.log('fed (ms since start of page):', feedLog.map(([id, what, t]) => `${id}${what !== id.replace(/-f$/, '') ? `(${what})` : ''}@${t}`).join(' '));
// busy stretches of the main thread over 50 ms, and what was running in each (time from the first sample)
{
  let t = profile.startTime, cur = null;
  const tasks = [];
  for (let i = 0; i < profile.samples.length; i++) {
    t += dt[i] || 0;
    const n = byId.get(profile.samples[i]);
    const idle = n.callFrame.functionName === '(idle)';
    if (idle) { if (cur) { tasks.push(cur); cur = null; } continue; }
    if (!cur) cur = { start: t, end: t, ids: [] };
    cur.end = t; cur.ids.push(profile.samples[i]);
  }
  if (cur) tasks.push(cur);
  const parentOf = new Map();
  for (const n of profile.nodes) for (const c of n.children || []) parentOf.set(c, n.id);
  const big = tasks.filter((x) => x.end - x.start > 50000).sort((a, b) => (b.end - b.start) - (a.end - a.start)).slice(0, 10);
  for (const x of big) {
    const inc = new Map();
    for (const id0 of x.ids) {
      const seen = new Set();
      for (let id = id0; id != null; id = parentOf.get(id)) {
        const cf = byId.get(id).callFrame;
        const key = `${cf.functionName || '(anon)'} ${cf.url.split('/').pop()}:${cf.lineNumber + 1}`;
        if (seen.has(key) || /^\(root\)/.test(key)) continue;
        seen.add(key);
        inc.set(key, (inc.get(key) || 0) + 1);
      }
    }
    const per = (x.end - x.start) / 1000 / x.ids.length;
    const top = [...inc].filter(([k]) => !/^\(program\)|^\(anon\) index.html:3\d\d$/.test(k)).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k, c]) => `${k} ${(c * per).toFixed(0)}`);
    console.log(`  busy ${((x.end - x.start) / 1000).toFixed(0)} ms at +${((x.start - profile.startTime) / 1000).toFixed(0)}: ${top.join(' | ')}`);
  }
}
console.log(`long tasks during startup: ${long.length}, total ${long.reduce((s, x) => s + x[1], 0)} ms; biggest: ${long.sort((a, b) => b[1] - a[1]).slice(0, 8).map((x) => `${x[1]}@${x[0]}`).join(' ')}`);
console.log('top self time (ms):');
for (const [k, v] of top) console.log(`  ${v.toFixed(0).padStart(6)}  ${k}`);
console.log('inclusive, index.html (ms):');
for (const [k, v] of topIncl) console.log(`  ${v.toFixed(0).padStart(6)}  ${k}`);
// interaction: pan and zoom for ~4 s right after ready, measuring frame gaps
await page.evaluate(() => { window.__long = []; });
const frames = await page.evaluate(() => new Promise((resolve) => {
  const m = window.__map, gaps = []; let last = performance.now(), stop = false;
  const tick = (t) => { gaps.push(t - last); last = t; if (!stop) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
  const c = m.getCenter(), z = m.getZoom();
  m.easeTo({ center: [c.lng + 20, c.lat + 5], zoom: z + 1.5, duration: 2000 });
  setTimeout(() => m.easeTo({ center: [c.lng - 10, c.lat], zoom: z + 3, duration: 2000 }), 2100);
  setTimeout(() => { stop = true; resolve(gaps); }, 4400);
}));
frames.sort((a, b) => a - b);
const pct = (p) => frames[Math.floor((frames.length - 1) * p)].toFixed(0);
const longI = await page.evaluate(() => window.__long);
console.log(`pan/zoom: ${frames.length} frames in 4.4 s (${(frames.length / 4.4).toFixed(0)} fps); frame ms p50 ${pct(0.5)}, p90 ${pct(0.9)}, max ${pct(1)}; long tasks ${longI.length} (${longI.reduce((s, x) => s + x[1], 0)} ms)`);
console.log('files:', [...bytes].filter(([k]) => /data|tiles\/[0-2]/.test(k)).map(([k, v]) => `${k.split('/').pop()} ${(v / 1024).toFixed(0)}K`).join(', '));
if (process.env.RELOAD) {
  await page.evaluate(() => new Promise((r) => setTimeout(r, 2500))); // (idle time to keep the names)
  const t1 = Date.now();
  await page.reload();
  await page.waitForFunction(() => document.documentElement.dataset.ready === '1', null, { timeout: 180000 });
  const r1 = Date.now() - t1;
  await page.waitForFunction(() => document.documentElement.dataset.drawn === '1', null, { timeout: 180000 });
  const d1 = Date.now() - t1;
  const log1 = await page.evaluate(() => window.__feedLog);
  console.log(`reload: ready ${r1} ms, drawn ${d1} ms; fed: ${log1.map(([id, what, t]) => `${id}${what !== id.replace(/-f$/, '') ? `(${what.slice(0, 24)})` : ''}@${t}`).join(' ')}`);
}
if (errors.length) console.log('page errors:', errors.slice(0, 5));
await browser.close();
