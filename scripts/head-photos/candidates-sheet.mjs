// rows.mjs <out.png> <height> <label>=<dir> ...: a row per person, every candidate in its folder, numbered
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const [out, h, ...rows] = process.argv.slice(2);
const mime = (f) => (/\.png$/i.test(f) ? 'image/png' : /\.webp$/i.test(f) ? 'image/webp' : /\.gif$/i.test(f) ? 'image/gif' : 'image/jpeg');
const body = rows.map((r) => {
  const [label, dir] = r.split('=');
  const files = fs.readdirSync(dir).filter((f) => /^c\d+\.(jpg|png|webp|gif)$/.test(f)).sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)));
  return `<div class="row"><h2>${label}</h2><div class="imgs">${files.map((f) => `<figure><figcaption>${f.replace(/\..*/, '')}</figcaption><img src="data:${mime(f)};base64,${fs.readFileSync(path.join(dir, f)).toString('base64')}"></figure>`).join('')}</div></div>`;
}).join('');
const html = `<!doctype html><meta charset="utf-8"><style>body{margin:0;padding:10px;background:#d9dde1;font:700 15px system-ui}h2{font-size:16px;margin:6px 0}.imgs{display:flex;gap:8px;flex-wrap:wrap}figure{margin:0}img{height:${h}px;display:block;background:#fff}figcaption{font-size:13px}</style>${body}`;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 1250, height: 400 }, deviceScaleFactor: 1 });
await page.setContent(html);
await page.waitForTimeout(400);
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log(out);
