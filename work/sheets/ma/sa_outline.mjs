// The South Area's outer ring (its towns' union), with numbered corners, for designing a cleaner outline
import fs from 'node:fs';
import polygonClipping from '/home/user/shetachim/node_modules/polygon-clipping/dist/polygon-clipping.esm.js';
const towns = JSON.parse(fs.readFileSync('/home/user/shetachim/.cache/county-subdivision-25.json', 'utf8')).features;
const want = ['Stoughton', 'Easton', 'Braintree', 'Brockton', 'Randolph', 'Avon', 'Holbrook'];
const key = (s) => s.replace(/ town$| Town$/, '');
const polys = (g) => (g.type === 'Polygon' ? [g.coordinates] : g.coordinates);
const u = polygonClipping.union(...towns.filter((f) => want.includes(key(f.properties.NAME))).map((f) => polys(f.geometry)));
const ring = u.sort((a, b) => b[0].length - a[0].length)[0][0];
console.log('rings', u.length, 'outer points', ring.length);
fs.writeFileSync(process.argv[2], JSON.stringify(ring));
