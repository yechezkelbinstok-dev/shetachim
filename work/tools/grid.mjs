// grid.mjs <out.png> <title> <row label>=<img>|<img>... : one labelled row per option
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const [out, title, ...rows] = process.argv.slice(2);
const img = (f) => `data:image/png;base64,${fs.readFileSync(f).toString('base64')}`;
const html = `<!doctype html><meta charset="utf-8"><style>body{margin:0;padding:24px;background:#eef1f4;font:600 15px system-ui,sans-serif;color:#1e2b32}
h1{font-size:20px;margin:0 0 18px}h2{font-size:17px;margin:0 0 8px}.row{margin-bottom:26px}.imgs{display:flex;gap:18px;align-items:flex-start}img{width:330px;display:block}</style><h1>${title}</h1>${
rows.map((r) => { const [label, files] = r.split('='); return `<div class="row"><h2>${label}</h2><div class="imgs">${files.split('|').map((f) => `<img src="${img(f)}">`).join('')}</div></div>`; }).join('')}`;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 760, height: 600 }, deviceScaleFactor: 2 });
await page.setContent(html);
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log(out);
