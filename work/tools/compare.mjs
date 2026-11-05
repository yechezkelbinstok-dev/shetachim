// compare.mjs <out.png> <title> then pairs: <label>=<before.png>|<after.png> ...
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const [out, title, ...pairs] = process.argv.slice(2);
const img = (f) => `data:image/png;base64,${fs.readFileSync(f).toString('base64')}`;
const rows = pairs.map((p) => { const [label, files] = p.split('='); const [b, a] = files.split('|');
  return `<div class="row"><figure><figcaption>Before · ${label}</figcaption><img src="${img(b)}"></figure><figure><figcaption>After · ${label}</figcaption><img src="${img(a)}"></figure></div>`; }).join('');
const html = `<!doctype html><meta charset="utf-8"><style>body{margin:0;padding:24px;background:#eef1f4;font:600 15px system-ui,sans-serif;color:#1e2b32}
h1{font-size:20px;margin:0 0 16px}.row{display:flex;gap:24px;align-items:flex-start;margin-bottom:24px}figure{margin:0}figcaption{margin:0 0 6px;color:#5a6870}
img{width:354px;display:block}</style><h1>${title}</h1>${rows}`;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 800, height: 600 }, deviceScaleFactor: 2 });
await page.setContent(html);
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log(out);
