// Collects who runs each center from chabad.org, from Node (no browser needed when chabad.org's
// API is reachable). Same output as scripts/chabad-personnel-scrape.js: data/raw/chabad-personnel.json.
//   node scripts/chabad-personnel-fetch.mjs        resumes from the file if it isn't complete
// The list endpoint ignores id filters and carries no personnel, so it's one request per center
// (/api/v2/chabadorg/centers/<id>), a few side by side, slowing down when the site pushes back.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const at = (...p) => path.join(ROOT, ...p);
const API = 'https://www.chabad.org/api/v2/chabadorg/centers';
const Q = 'format=jsonapi&lang=en';
const PARALLEL = 4;
const OUT = at('data', 'raw', 'chabad-personnel.json');

const ids = JSON.parse(fs.readFileSync(at('data', 'raw', 'chabad-centers.json'), 'utf8')).data.map((c) => +c.id);
const prev = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : null;
const S = {
  startedAt: prev?.meta?.startedAt || new Date().toISOString(),
  personnel: prev?.personnel || {},
  done: new Set(prev?.meta?.complete ? [] : prev?.meta?.doneIds || []),
  errors: [],
  stats: { requests: 0, rateLimited: 0 },
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let pause = 0;

function save(complete) {
  const out = {
    meta: {
      source: 'chabad.org /api/v2/chabadorg/centers/<id>',
      collector: 'node scripts/chabad-personnel-fetch.mjs',
      startedAt: S.startedAt,
      savedAt: new Date().toISOString(),
      complete,
      total: ids.length,
      done: S.done.size,
      stats: { ...S.stats, withPersonnel: Object.keys(S.personnel).length },
      errors: S.errors,
      ...(complete ? {} : { doneIds: [...S.done] }),
    },
    personnel: S.personnel,
  };
  fs.writeFileSync(OUT, JSON.stringify(out));
}

// One center's personnel, in the order the record lists them; [] if it has none.
function extract(json) {
  const d = json && json.data;
  if (!d || !d.relationships) return [];
  const order = ((d.relationships.personnel && d.relationships.personnel.data) || []).map((r) => r.id);
  const people = new Map((json.included || []).filter((i) => i.type === 'person').map((i) => [i.id, i.attributes || {}]));
  return order.filter((id) => people.has(id)).map((id) => {
    const a = people.get(id);
    return {
      title: a.title || null,
      firstName: a['first-name'] || null,
      lastName: a['last-name'] || null,
      position: a.position || null,
      isDirector: !!a['is-director'],
      isDeceased: !!a['is-deceased'],
    };
  });
}

async function getJSON(url) {
  for (let attempt = 1; attempt <= 6; attempt++) {
    while (pause > Date.now()) await sleep(pause - Date.now());
    S.stats.requests++;
    let res, body;
    try {
      res = await fetch(url, { headers: { accept: 'application/vnd.api+json' } });
      body = await res.text();
    } catch (e) {
      await sleep(3000 * attempt);
      continue;
    }
    if (res.ok) { try { return JSON.parse(body); } catch { /* challenge page */ } }
    if (res.status === 404 || res.status === 400) return null;
    S.stats.rateLimited++;
    const wait = (Number(res.headers.get('retry-after')) || 15 * attempt) * 1000;
    console.warn(`  ${res.status} on ${url} — pausing ${wait / 1000}s`);
    pause = Math.max(pause, Date.now() + wait);
  }
  return undefined;
}

const todo = ids.filter((id) => !S.done.has(id));
console.log(`${ids.length} centers, ${todo.length} to fetch`);
let i = 0, n = 0;
const t0 = Date.now();
await Promise.all(Array.from({ length: PARALLEL }, async () => {
  while (i < todo.length) {
    const id = todo[i++];
    const json = await getJSON(`${API}/${id}?${Q}`);
    if (json === undefined) S.errors.push(id);
    else {
      const people = extract(json);
      if (people.length) S.personnel[id] = people;
      S.done.add(id);
    }
    if (++n % 100 === 0) {
      save(false);
      console.log(`${S.done.size}/${ids.length} (${Object.keys(S.personnel).length} with personnel) — ${((Date.now() - t0) / 60000).toFixed(1)} min`);
    }
  }
}));
save(S.done.size === ids.length);
console.log(`done: ${S.done.size}/${ids.length}, ${Object.keys(S.personnel).length} with personnel, ${S.errors.length} errors`);
