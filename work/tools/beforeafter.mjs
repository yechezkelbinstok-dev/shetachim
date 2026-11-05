// beforeafter.mjs <out.png> <beforeDir> <afterDir> [ids...]: each head as a pair of circles (before | after)
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const R = '/home/user/shetachim';
const [out, bdir, adir, ...pick] = process.argv.slice(2);
const db = JSON.parse(fs.readFileSync(`${R}/data/head-photos.json`, 'utf8'));
const sh = Object.fromEntries(JSON.parse(fs.readFileSync(`${R}/data/shetachim.json`, 'utf8')).shetachim.map((s) => [s.id, s]));
const list = db.photos.filter((p) => !pick.length || pick.includes(p.id));
const b64 = (f) => `data:image/jpeg;base64,${fs.readFileSync(f).toString('base64')}`;
const cells = list.map((p) => `<figure><div class="pr"><img src="${b64(`${bdir}/${p.id}.jpg`)}"><img src="${b64(`${adir}/${p.id}.jpg`)}"></div><figcaption><b>${p.head}</b> <span>${sh[p.id]?.name || p.id}</span></figcaption></figure>`).join('');
const html = `<!doctype html><meta charset="utf-8"><style>body{margin:0;padding:16px;background:#f4f1ea;font:13px system-ui;color:#1f2933}
h1{font-size:17px;margin:0 0 4px}p.k{margin:0 0 14px;color:#6b7280}.g{display:grid;grid-template-columns:repeat(4,1fr);gap:16px 12px}
figure{margin:0;text-align:center}.pr{display:flex;gap:6px;justify-content:center}img{width:100px;height:100px;border-radius:50%;box-shadow:0 0 0 2px #fff,0 1px 4px rgba(0,0,0,.25)}
figcaption{margin-top:5px;line-height:1.2}b{font-size:12px}span{display:block;font-size:11px;color:#6b7280}</style>
<h1>Before → after</h1><p class="k">Left: as found. Right: retouched.</p><div class="g">${cells}</div>`;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 980, height: 600 }, deviceScaleFactor: 2 });
await page.setContent(html); await page.waitForTimeout(300);
await page.screenshot({ path: out, fullPage: true }); await browser.close(); console.log('ok', list.length);
