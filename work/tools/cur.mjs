// cur.mjs <out.png> <px> ids...: the current saved photos for these ids, large, with the source note
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const R = '/home/user/shetachim';
const [out, px, ...ids] = process.argv.slice(2);
const db = JSON.parse(fs.readFileSync(`${R}/data/head-photos.json`, 'utf8'));
const list = ids.map((id) => db.photos.find((p) => p.id === id)).filter(Boolean);
const cells = list.map((p) => `<figure><img src="data:image/jpeg;base64,${fs.readFileSync(`${R}/web/${p.file}`).toString('base64')}"><figcaption><b>${p.id}</b> ${p.head}<br><small>${(p.image || '').slice(0, 70)}</small></figcaption></figure>`).join('');
const html = `<!doctype html><meta charset="utf-8"><style>body{margin:0;padding:12px;background:#eee;font:12px system-ui}.g{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}
figure{margin:0}img{width:${px}px;height:${px}px;display:block}small{color:#555;word-break:break-all}</style><div class="g">${cells}</div>`;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 5 * (+px + 12) + 24, height: 400 } });
await page.setContent(html);
await page.screenshot({ path: out, fullPage: true });
await browser.close();
