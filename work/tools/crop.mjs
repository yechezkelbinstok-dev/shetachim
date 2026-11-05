// crop.mjs <spec.json>: [{id, src, cx, cy, side}] — a square around (cx, cy) (fractions of width/height), side a fraction
// of the height, out to photos/out/<id>.jpg at 320 px; then a sheet of them in circles, to check
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const S = '/tmp/claude-0/-home-user-shetachim/6dfe7d99-9185-570e-b237-1d68bcc4daf7/scratchpad';
const specs = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const outDir = path.join(S, 'photos', 'out'); fs.mkdirSync(outDir, { recursive: true });
const mime = (f) => (/\.png$/i.test(f) ? 'image/png' : /\.webp$/i.test(f) ? 'image/webp' : 'image/jpeg');
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage();
for (const sp of specs) {
  const data = `data:${mime(sp.src)};base64,${fs.readFileSync(sp.src).toString('base64')}`;
  const b64 = await page.evaluate(async ({ data, cx, cy, side }) => {
    const img = new Image(); img.src = data; await img.decode();
    const W = img.naturalWidth, H = img.naturalHeight, s = side * H;
    let x = cx * W - s / 2, y = cy * H - s / 2;
    x = Math.max(0, Math.min(W - s, x)); y = Math.max(0, Math.min(H - s, y));
    const c = document.createElement('canvas'); c.width = c.height = 320;
    const g = c.getContext('2d'); g.imageSmoothingQuality = 'high'; g.fillStyle = '#fff'; g.fillRect(0, 0, 320, 320);
    g.drawImage(img, x, y, s, s, 0, 0, 320, 320);
    return c.toDataURL('image/jpeg', 0.86).split(',')[1];
  }, { data, cx: sp.cx, cy: sp.cy, side: sp.side });
  fs.writeFileSync(path.join(outDir, `${sp.id}.jpg`), Buffer.from(b64, 'base64'));
}
const html = `<!doctype html><style>body{margin:0;padding:12px;background:#eef1f4;font:600 13px system-ui}.g{display:flex;flex-wrap:wrap;gap:14px}figure{margin:0;text-align:center}img{width:110px;height:110px;border-radius:50%;display:block}</style><div class="g">${
  specs.map((sp) => `<figure><img src="data:image/jpeg;base64,${fs.readFileSync(path.join(outDir, `${sp.id}.jpg`)).toString('base64')}"><figcaption>${sp.id}</figcaption></figure>`).join('')}</div>`;
await page.setViewportSize({ width: 1000, height: 300 });
await page.setContent(html);
await page.screenshot({ path: path.join(S, 'photos', 'check.png'), fullPage: true });
await browser.close();
console.log('ok', specs.length);
