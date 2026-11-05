// trio.mjs <out.png> <title> <img>... : images side by side
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const [out, title, ...imgs] = process.argv.slice(2);
const img = (f) => `data:image/png;base64,${fs.readFileSync(f).toString('base64')}`;
const html = `<!doctype html><meta charset="utf-8"><style>body{margin:0;padding:24px;background:#0f1518;font:600 15px system-ui,sans-serif;color:#e6edf0}
h1{font-size:20px;margin:0 0 16px}.row{display:flex;gap:20px;align-items:flex-start}img{width:300px;display:block}</style><h1>${title}</h1><div class="row">${imgs.map((f) => `<img src="${img(f)}">`).join('')}</div>`;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 1000, height: 600 }, deviceScaleFactor: 2 });
await page.setContent(html);
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log(out);
