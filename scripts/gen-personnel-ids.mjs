// Regenerates the embedded id list in chabad-personnel-scrape.js from the current
// data/raw/chabad-centers.json, so the browser scraper covers every center on the map.
// Run this again (`node scripts/gen-personnel-ids.mjs`) whenever chabad-centers.json is refreshed.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const at = (...p) => path.join(ROOT, ...p);

const ids = JSON.parse(fs.readFileSync(at('data', 'raw', 'chabad-centers.json'), 'utf8')).data.map((c) => +c.id);
const file = at('scripts', 'chabad-personnel-scrape.js');
const src = fs.readFileSync(file, 'utf8');
const out = src.replace(/const IDS = \[[^\]]*\];/, `const IDS = [${ids.join(',')}];`);
if (out === src && !src.includes(ids.join(','))) throw new Error('could not find "const IDS = [...]" to replace in ' + file);
fs.writeFileSync(file, out);
console.log(`embedded ${ids.length} center ids in ${path.relative(ROOT, file)}`);
