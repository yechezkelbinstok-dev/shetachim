// Chabad.org center collector — paste into the DevTools Console while on
// https://www.chabad.org/jewish-centers/ (the page must be open so requests
// carry your normal browser session). It downloads chabad-centers.json when done.
//
// How it works (endpoints taken from a HAR capture of the locator):
//   /api/v2/chabadorg/centers/locations?id=1-<n>   city "location" + up to 50 nearest centers
//   /api/v2/chabadorg/centers/locations?id=2-<zip> same, centred on a ZIP / postal code
// 1. Sweep city ids 1-1, 1-2, ... until a long run of misses.
// 2. Where a US/Canada response hit the 50-center cap, flood-fill using the ZIP
//    codes of the centers it returned, until no new centers appear.
//
// chabad.org rate-limits (HTTP 429), so requests go one at a time and slow down
// whenever the site pushes back. Progress is saved in this browser (IndexedDB):
// if the tab is reloaded or the run is stopped, pasting the script again resumes.
//   saveChabad()   download what has been collected so far
//   stopChabad()   stop after the current request (progress is kept)
//   resetChabad()  forget saved progress so the next paste starts over
(async () => {
  const VERSION = 'v4';
  const API = 'https://www.chabad.org/api/v2/chabadorg/centers/locations';
  const Q = 'format=jsonapi&lang=en';
  const CAP = 50; // the API never returns more than 50 centers per location
  const MISS_RUN_TO_STOP = 800; // consecutive empty city ids before the sweep ends
  const MAX_ZIP_QUERIES = 2500;
  const FILL_COUNTRIES = ['USA', 'Canada'];
  const MIN_DELAY = 1000;
  const MAX_DELAY = 15000;

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const log = (...a) => console.log('%c[chabad]', 'color:#c60;font-weight:bold', ...a);

  console.log(`%c[chabad] collector ${VERSION} starting on ${location.host}`, 'color:#c60;font-weight:bold;font-size:14px');
  if (location.host !== 'www.chabad.org') {
    console.error('[chabad] run this in the Console of a www.chabad.org tab (e.g. chabad.org/jewish-centers), not this page.');
    return;
  }
  if (window.__chabadRunning) {
    console.error('[chabad] already running in this tab. Reload the tab (F5) before pasting again.');
    return;
  }
  window.__chabadRunning = true;

  // ---- saved progress (IndexedDB) ----
  const db = await new Promise((res, rej) => {
    const r = indexedDB.open('chabad-collector', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('kv');
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
  const kv = (mode, fn) => new Promise((res, rej) => {
    const tx = db.transaction('kv', mode);
    const req = fn(tx.objectStore('kv'));
    tx.oncomplete = () => res(req.result);
    tx.onerror = () => rej(tx.error);
  });

  const fresh = () => ({
    version: VERSION,
    startedAt: new Date().toISOString(),
    phase: 'cities', // cities -> zips -> done
    nextCity: 1,
    lastHit: 0,
    frontier: [],
    queried: [],
    locations: {},
    centers: {},
    types: {},
    errors: [],
    stats: { requests: 0, rateLimited: 0, cityHits: 0, zipQueries: 0 },
  });
  const saved = await kv('readonly', (s) => s.get('state'));
  const S = saved || fresh();
  const queried = new Set(S.queried);
  let delay = 1500;
  let okStreak = 0;
  let stopped = false;
  const centerCount = () => Object.keys(S.centers).length;
  const persist = () => kv('readwrite', (s) => s.put({ ...S, queried: Array.from(queried) }, 'state'));

  window.stopChabad = () => { stopped = true; log('stopping after the current request… progress is saved; paste the script again later to resume.'); };
  window.resetChabad = async () => { await kv('readwrite', (s) => s.delete('state')); log('saved progress cleared. Reload the tab, then paste the script to start over.'); };
  window.saveChabad = (final = false) => {
    const out = {
      meta: {
        source: 'chabad.org /api/v2/chabadorg/centers/locations',
        collector: VERSION,
        startedAt: S.startedAt,
        savedAt: new Date().toISOString(),
        complete: final,
        phase: S.phase,
        cap: CAP,
        lastCityId: S.nextCity - 1,
        stats: S.stats,
        errors: S.errors,
      },
      types: S.types,
      locations: Object.values(S.locations),
      centers: Object.values(S.centers),
    };
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(out)], { type: 'application/json' }));
    a.download = final ? 'chabad-centers.json' : `chabad-centers-partial-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    log(`downloaded ${out.centers.length} centers, ${out.locations.length} locations`);
  };

  if (S.phase === 'done') {
    log(`a previous run already finished (${centerCount()} centers). Run saveChabad(true) to download it again, or resetChabad() to start over.`);
    window.__chabadRunning = false;
    return;
  }
  if (saved) log(`resuming saved progress: ${centerCount()} centers so far, phase "${S.phase}", next city id ${S.nextCity}`);
  log('tip: keep this tab visible (e.g. in its own window) — Chrome slows scripts in hidden tabs. stopChabad() pauses; pasting again resumes.');

  // Returns parsed JSON, null for "no such location", or undefined if it kept failing.
  let reportedBadBody = false;
  async function getJSON(url) {
    for (let attempt = 1; attempt <= 8; attempt++) {
      let res;
      S.stats.requests++;
      try {
        res = await fetch(url, { headers: { accept: 'application/vnd.api+json' }, credentials: 'same-origin' });
      } catch (e) {
        console.warn(`[chabad] network error: ${e.message} — retrying in ${5 * attempt}s`);
        await sleep(5000 * attempt);
        continue;
      }
      // The API answers with content-type "application/vnd.japi", so parse rather than sniff the header.
      const body = await res.text();
      if (res.ok) {
        if (!body.trim()) return null; // empty = no such location
        try {
          const json = JSON.parse(body);
          if (++okStreak >= 50 && delay > MIN_DELAY) { delay = Math.max(MIN_DELAY, Math.round(delay * 0.9)); okStreak = 0; }
          return json;
        } catch (e) { /* not JSON: challenge page, handled below */ }
      }
      if (res.status === 404 || res.status === 400) return null;
      okStreak = 0;
      if (res.status === 429 || res.status === 403 || res.ok) {
        S.stats.rateLimited++;
        delay = Math.min(MAX_DELAY, delay * 2);
        const retryAfter = Number(res.headers.get('retry-after'));
        const wait = retryAfter > 0 ? retryAfter * 1000 : Math.min(300000, 60000 * attempt);
        const why = res.status === 429
          ? 'chabad.org says too many requests (429)'
          : `chabad.org blocked the request (${res.status}) — if a "verify you are human" check appears in another chabad.org tab, complete it`;
        console.warn(`[chabad] ${why}. Pausing ${Math.round(wait / 1000)}s, then continuing slower (1 request every ${(delay / 1000).toFixed(1)}s).`);
        await persist();
        await sleep(wait);
        continue;
      }
      if (!reportedBadBody) {
        reportedBadBody = true;
        console.warn(`[chabad] unexpected response — status ${res.status}, content-type ${res.headers.get('content-type')}, url ${url}\nfirst 300 chars:\n${body.slice(0, 300)}`);
      }
      if (attempt < 2) { await sleep(3000); continue; }
      break; // persistent 5xx
    }
    S.errors.push(url);
    return undefined;
  }

  // Merge one locations response into state; returns number of centers in it.
  function ingest(json, queryId) {
    const d = json && json.data;
    if (!d || !d.attributes) return 0;
    const a = d.attributes;
    const centerRefs = (d.relationships && d.relationships.centers && d.relationships.centers.data) || [];
    S.locations[d.id] = {
      id: d.id,
      queryId,
      locationType: a['location-type'],
      city: a.city,
      state: a.state,
      zip: a['zip-code'],
      country: a.country,
      lat: a.coordinates && a.coordinates.latitude,
      lon: a.coordinates && a.coordinates.longitude,
      staticUrl: a['static-url'],
      centerCount: centerRefs.length,
      centerIds: centerRefs.map((c) => c.id),
    };
    for (const inc of json.included || []) {
      const ia = inc.attributes || {};
      if (inc.type === 'service-type') S.types[inc.id] = ia.name;
      if (inc.type !== 'center') continue;
      const addr = ia.address || {};
      const ct = inc.relationships && inc.relationships['center-type'] && inc.relationships['center-type'].data;
      S.centers[inc.id] = {
        id: inc.id,
        name: ia.name,
        typeId: ct ? ct.id : null,
        lat: ia.coordinates && ia.coordinates.latitude,
        lon: ia.coordinates && ia.coordinates.longitude,
        approximate: !!ia['location-is-approximate'],
        address1: addr['address-line1'],
        address2: addr['address-line2'],
        city: addr.city || ia.city,
        state: addr.state,
        zip: addr['zip-code'],
        country: addr.country,
        mosadId: ia['mosad-id'],
        staticUrl: ia['static-url'],
      };
    }
    return centerRefs.length;
  }

  // Query one location id (once), then wait before the next request.
  // Returns { n, loc } for a real location, null otherwise.
  async function step(locId) {
    if (queried.has(locId)) return null;
    const json = await getJSON(`${API}?id=${encodeURIComponent(locId)}&${Q}`);
    if (json !== undefined) queried.add(locId); // a failed id stays unqueried and is retried on resume
    const n = ingest(json, locId);
    await sleep(delay);
    return json && json.data ? { n, loc: S.locations[json.data.id] } : null;
  }

  const zipKey = (c) => {
    if (!c.zip) return null;
    const z = String(c.zip).replace(/\s+/g, '');
    if (c.country === 'USA') return /^\d{5}/.test(z) ? z.slice(0, 5) : null;
    return z.toUpperCase();
  };
  const seedsFrom = (loc) => loc.centerIds
    .map((id) => S.centers[id])
    .filter((c) => c && FILL_COUNTRIES.includes(c.country))
    .map(zipKey)
    .filter((z) => z && !queried.has(`2-${z}`));

  const t0 = Date.now();
  const mins = () => ((Date.now() - t0) / 60000).toFixed(1);

  // ---- 1. city id sweep ----
  if (S.phase === 'cities') {
    if (!saved) {
      const first = await step('1-84'); // Brooklyn: a known-good id, checks the API answers at all
      log(`Brooklyn test: ${first ? first.n : 0} centers`);
      if (!first || !first.n) {
        console.error('[chabad] the first request (Brooklyn) returned no centers, so stopping here. Please screenshot the Console and send it.');
        window.__chabadRunning = false;
        return;
      }
      S.stats.cityHits++;
    }
    while (!stopped && S.nextCity - S.lastHit <= MISS_RUN_TO_STOP) {
      const n = S.nextCity;
      if (await step(`1-${n}`)) { S.stats.cityHits++; S.lastHit = n; }
      if (n === 84) S.lastHit = 84; // tested up front, so step() skipped it
      S.nextCity = n + 1;
      if (n % 50 === 0) {
        await persist();
        log(`city ids 1..${n}: ${S.stats.cityHits} cities, ${centerCount()} centers — 1 request every ${(delay / 1000).toFixed(1)}s (${mins()} min this session)`);
      }
    }
    if (!stopped) {
      const capped = Object.values(S.locations).filter((l) => l.centerCount >= CAP && FILL_COUNTRIES.includes(l.country));
      S.frontier = Array.from(new Set(capped.flatMap(seedsFrom)));
      S.phase = 'zips';
      await persist();
      log(`city sweep done (${S.stats.cityHits} cities, ${centerCount()} centers). ${capped.length} US/Canada locations hit the 50 cap; filling in from ${S.frontier.length} ZIP codes`);
    }
  }

  // ---- 2. flood-fill capped US/Canada areas by ZIP ----
  if (S.phase === 'zips') {
    while (!stopped && S.frontier.length && S.stats.zipQueries < MAX_ZIP_QUERIES) {
      const id = `2-${S.frontier.shift()}`;
      if (queried.has(id)) continue;
      S.stats.zipQueries++;
      const before = centerCount();
      const r = await step(id);
      // keep expanding only where results are still capped and still finding new centers
      if (r && r.loc && r.n >= CAP && centerCount() > before) S.frontier.push(...seedsFrom(r.loc));
      if (S.stats.zipQueries % 25 === 0) {
        await persist();
        log(`ZIP fill: ${S.stats.zipQueries} queries, ${S.frontier.length} queued, ${centerCount()} centers (${mins()} min this session)`);
      }
    }
    if (!stopped) S.phase = 'done';
  }

  await persist();
  window.__chabadRunning = false;
  if (stopped) {
    log(`stopped with ${centerCount()} centers saved. Paste the script again to resume, or saveChabad() to download what there is.`);
    return;
  }
  log(`DONE — ${centerCount()} centers, ${Object.keys(S.locations).length} locations, ${S.stats.requests} requests, ${S.errors.length} errors`);
  window.saveChabad(true);
})();
