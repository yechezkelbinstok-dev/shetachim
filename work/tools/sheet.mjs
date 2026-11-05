// sheet.mjs <out.png> <img>...: candidate photos side by side, numbered, scaled to the same height
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const [out, ...imgs] = process.argv.slice(2);
const mime = (f) => (/\.png$/i.test(f) ? 'image/png' : /\.webp$/i.test(f) ? 'image/webp' : 'image/jpeg');
const html = `<!doctype html><meta charset="utf-8"><style>body{margin:0;padding:12px;background:#ddd;font:700 18px system-ui}.row{display:flex;gap:12px;flex-wrap:wrap}figure{margin:0}img{height:300px;display:block;background:#fff}figcaption{padding:4px 0}</style><div class="row">${
  imgs.map((f, i) => `<figure><figcaption>${i + 1} · ${path.basename(f)}</figcaption><img src="data:${mime(f)};base64,${fs.readFileSync(f).toString('base64')}"></figure>`).join('')}</div>`;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 1200, height: 400 }, deviceScaleFactor: 1 });
await page.setContent(html);
await page.waitForTimeout(300);
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log(out);
