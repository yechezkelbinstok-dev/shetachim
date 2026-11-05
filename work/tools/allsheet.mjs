// allsheet.mjs <out.png>: every saved head photo (data/head-photos.json) in a grid of circles with the shetach and head
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const R = '/home/user/shetachim';
const db = JSON.parse(fs.readFileSync(`${R}/data/head-photos.json`, 'utf8'));
const sh = Object.fromEntries(JSON.parse(fs.readFileSync(`${R}/data/shetachim.json`, 'utf8')).shetachim.map((s) => [s.id, s]));
const cells = db.photos.map((p) => `<figure><img src="data:image/jpeg;base64,${fs.readFileSync(`${R}/web/${p.file}`).toString('base64')}"><figcaption><b>${p.head}</b><span>${sh[p.id]?.name || p.id}</span></figcaption></figure>`).join('');
const html = `<!doctype html><meta charset="utf-8"><style>body{margin:0;padding:18px;background:#f4f1ea;font:13px system-ui;color:#1f2933}
h1{font-size:18px;margin:0 0 14px}.g{display:grid;grid-template-columns:repeat(8,1fr);gap:16px 10px}
figure{margin:0;text-align:center}img{width:96px;height:96px;border-radius:50%;display:block;margin:0 auto 6px;box-shadow:0 0 0 2px #fff,0 1px 4px rgba(0,0,0,.25)}
b{display:block;font-size:12px;line-height:1.2}span{display:block;font-size:11px;color:#6b7280;line-height:1.2}</style>
<h1>Head shluchim, USA: ${db.photos.length} photos</h1><div class="g">${cells}</div>`;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 1000, height: 600 }, deviceScaleFactor: 2 });
await page.setContent(html);
await page.waitForTimeout(300);
await page.screenshot({ path: process.argv[2], fullPage: true });
await browser.close();
console.log('ok', db.photos.length);
