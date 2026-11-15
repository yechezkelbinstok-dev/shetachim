// Checks 'hebrewYear' in data/founding-years.json (owner, Nov 15: log the Hebrew year when the source gives one):
// the ordinary 'year' must fall in that Hebrew year (5760 runs from Sept 1999 to Sept 2000), and a 'date' must be in it
// (a month alone is read mid-month, as the growth page reads it). Run: node work/founding-years/check-hebrew.mjs
import { readFileSync } from 'node:fs';
const fy = JSON.parse(readFileSync('data/founding-years.json', 'utf8')).centers;
const f = new Intl.DateTimeFormat('en-u-ca-hebrew', { year: 'numeric', timeZone: 'UTC' });
const heb = (d) => +f.formatToParts(d).find((x) => x.type === 'year').value;
const MON = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
function dateOf(s) {
  s = String(s || '').trim();
  let m = /^(\d{4})-(\d{2})(?:-(\d{2}))?/.exec(s);
  if (m) return new Date(Date.UTC(+m[1], +m[2] - 1, m[3] ? +m[3] : 15));
  m = /^(?:(\d{1,2})\s+)?([A-Za-z]{3,9})\.?\s+(\d{4})\b/.exec(s);
  if (m && MON[m[2].slice(0, 3).toLowerCase()]) return new Date(Date.UTC(+m[3], MON[m[2].slice(0, 3).toLowerCase()] - 1, m[1] ? +m[1] : 15));
  return null;
}
let n = 0, bad = 0;
for (const [id, e] of Object.entries(fy)) {
  if (e.hebrewYear == null) continue;
  n++;
  const h = e.hebrewYear, out = [];
  if (!Number.isInteger(h) || h < 5600 || h > 5900) out.push(`not a Hebrew year: ${h}`);
  if (e.year != null && !(e.year === h - 3761 || e.year === h - 3760)) out.push(`year ${e.year} is not in ${h} (${h - 3761}-${h - 3760})`);
  const d = dateOf(e.date);
  if (d && heb(d) !== h) out.push(`date ${e.date} is in ${heb(d)}, not ${h}`);
  if (out.length) { bad++; console.log(`${id} ${e.name}: ${out.join('; ')}`); }
}
console.log(`${n} with a Hebrew year, ${bad} with a problem`);
process.exit(bad ? 1 : 0);
