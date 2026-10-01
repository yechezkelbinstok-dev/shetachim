// PNG copies of the SVG maps for the download page: node scripts/svg-png.mjs [file.svg …] (default: every web/*.svg).
// Rendered in headless Chromium at the SVG's own size (the sandbox's: /opt/pw-browsers; see HANDOFF.md).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');

const WEB = path.join(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'), 'web');
const files = process.argv.length > 2 ? process.argv.slice(2) : fs.readdirSync(WEB).filter((f) => f.endsWith('.svg')).map((f) => path.join(WEB, f));
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const file of files) {
  const svg = fs.readFileSync(file, 'utf8');
  const [, w, h] = svg.match(/<svg[^>]*width="(\d+)"[^>]*height="(\d+)"/);
  const page = await browser.newPage({ viewport: { width: +w, height: +h } });
  await page.setContent(`<html><body style="margin:0"><img src="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}"></body></html>`);
  await page.waitForFunction(() => document.querySelector('img').complete);
  const out = file.replace(/\.svg$/, '.png');
  await page.screenshot({ path: out, clip: { x: 0, y: 0, width: +w, height: +h } });
  await page.close();
  console.log(`${path.relative(process.cwd(), out)}: ${w}×${h}`);
}
await browser.close();
