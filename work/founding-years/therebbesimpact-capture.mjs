// node work/founding-years/therebbesimpact-capture.mjs .cache/therebbesimpact  (then python3 work/founding-years/leads.py <shetach>)
// Open therebbesimpact.com and keep what its own /_serverFn/ endpoints send the page (its records), for leads only
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');
const OUT = process.argv[2];
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage();
let n = 0;
page.on('response', async (r) => {
  const u = r.url();
  if (!u.includes('_serverFn')) return;
  try {
    const b = await r.body(); n++;
    fs.writeFileSync(`${OUT}/resp-${n}.txt`, b);
    fs.appendFileSync(`${OUT}/index.txt`, `${n}\t${b.length}\t${r.request().method()}\t${u.slice(0, 300)}\n`);
  } catch (e) {}
});
await page.goto('https://therebbesimpact.com/', { waitUntil: 'networkidle', timeout: 90000 });
await page.waitForTimeout(8000);
await browser.close();
console.log('responses', n);
