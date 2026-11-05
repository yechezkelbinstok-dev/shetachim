// sheet2.mjs <out.png> <beforeDir> <pairIds,...> <newIds,...>: old → new pairs, then new-only photos, with the date note
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const R = '/home/user/shetachim';
const [out, bdir, pairs, singles] = process.argv.slice(2);
const db = Object.fromEntries(JSON.parse(fs.readFileSync(`${R}/data/head-photos.json`, 'utf8')).photos.map((p) => [p.id, p]));
const sh = Object.fromEntries(JSON.parse(fs.readFileSync(`${R}/data/shetachim.json`, 'utf8')).shetachim.map((s) => [s.id, s]));
const img = (f) => `data:image/jpeg;base64,${fs.readFileSync(f).toString('base64')}`;
const when = (p) => (p.note || '').replace(/\(.*?\)/g, '').split(/[,;]/)[0].trim();
const pairHtml = pairs.split(',').filter(Boolean).map((id) => `<figure class="pair"><div><img class="old" src="${img(`${bdir}/${id}.jpg`)}"><span class="arr">→</span><img src="${img(`${R}/web/img/heads/${id}.jpg`)}"></div><b>${db[id].head}</b><span>${sh[id].name} · ${when(db[id])}</span></figure>`).join('');
const newHtml = singles.split(',').filter(Boolean).map((id) => `<figure><img src="${img(`${R}/web/img/heads/${id}.jpg`)}"><b>${db[id].head}</b><span>${sh[id].name} · ${when(db[id])}</span></figure>`).join('');
const html = `<!doctype html><meta charset="utf-8"><style>body{margin:0;padding:28px;background:#f4f1ea;font:15px system-ui;color:#1f2933;width:1060px}
h1{font-size:22px;margin:0 0 4px}h2{font-size:17px;margin:26px 0 12px;color:#374151}p{margin:0 0 6px;color:#6b7280}
.g{display:flex;flex-wrap:wrap;gap:22px 30px}figure{margin:0;text-align:center;width:150px}.pair{width:300px}
.pair div{display:flex;align-items:center;justify-content:center;gap:8px}
img{width:132px;height:132px;border-radius:50%;display:block;margin:0 auto 8px;box-shadow:0 0 0 3px #fff,0 2px 6px rgba(0,0,0,.25)}
img.old{width:96px;height:96px;opacity:.85;filter:saturate(.8)}.arr{font-size:22px;color:#9ca3af}
b{display:block;font-size:14px}span{display:block;font-size:12.5px;color:#6b7280}</style>
<h1>Head shluchim photos — this round</h1><p>Every one retouched (colour, exposure on the face, sharpening).</p>
<h2>USA: old → new</h2><div class="g">${pairHtml}</div><h2>Canada: new</h2><div class="g">${newHtml}</div>`;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 1116, height: 600 }, deviceScaleFactor: 2 });
await page.setContent(html);
await page.screenshot({ path: out, fullPage: true });
await browser.close();
