// Chabad.org center collector — paste into the DevTools Console while on
// https://www.chabad.org/jewish-centers/ (the page must be open so requests
// carry your normal browser session). It downloads chabad-centers.json when done.
//
// How it works (endpoints taken from a HAR capture of the locator):
//   /api/v2/chabadorg/centers/locations?id=1-<n>   city "location" + up to 50 nearest centers
//   /api/v2/chabadorg/centers/locations?id=2-<zip> same, centred on a ZIP code
// 1. Probe whether a paging parameter lifts the 50-center cap.
// 2. Sweep city ids 1-1, 1-2, ... until a long run of misses.
// 3. For any response that hit the cap, flood-fill using the ZIP codes of the
//    centers it returned, until no new centers appear.
//
// Progress lives in window.__chabad. Run saveChabad() at any time to download
// what has been collected so far; stopChabad() ends the run early.
(async () => {
  const API = '/api/v2/chabadorg/centers/locations';
  const Q = 'format=jsonapi&lang=en';
  const CONCURRENCY = 3;
  const DELAY_MS = 150; // per worker, between requests
  const MISS_RUN_TO_STOP = 1500; // consecutive empty city ids before giving up
  const MAX_ZIP_QUERIES = 4000;

  const S = (window.__chabad = {
    startedAt: new Date().toISOString(),
    pageParam: null,
    cap: 50,
    locations: {},
    centers: {},
    types: {},
    queried: new Set(),
    errors: [],
    stopped: false,
    stats: { requests: 0, cityHits: 0, maxCityId: 0, zipQueries: 0 },
  });
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const log = (...a) => console.log('%c[chabad]', 'color:#c60;font-weight:bold', ...a);

  window.stopChabad = () => { S.stopped = true; log('stopping after in-flight requests…'); };
  window.saveChabad = (final = false) => {
    const out = {
      meta: {
        source: 'chabad.org /api/v2/chabadorg/centers/locations',
        startedAt: S.startedAt,
        savedAt: new Date().toISOString(),
        complete: final,
        pageParam: S.pageParam,
        cap: S.cap,
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
    log(`saved ${out.centers.length} centers, ${out.locations.length} locations`);
  };

  // Returns parsed JSON, or null for "no such location".
  async function getJSON(url) {
    for (let attempt = 1; attempt <= 8; attempt++) {
      let res;
      S.stats.requests++;
      try {
        res = await fetch(url, { headers: { accept: 'application/vnd.api+json' }, credentials: 'same-origin' });
      } catch (e) {
        await sleep(3000 * attempt);
        continue;
      }
      // The API answers with content-type "application/vnd.japi", so parse rather than sniff the header;
      // a Cloudflare challenge comes back as HTML and fails to parse.
      let parsed;
      if (res.ok) {
        try { parsed = JSON.parse(await res.text()); } catch (e) { parsed = undefined; }
        if (parsed !== undefined) return parsed;
      }
      if (res.status === 403 || res.status === 429 || res.ok) {
        console.warn(`[chabad] blocked (${res.status}) — waiting ${15 * attempt}s. If chabad.org shows a "verify you are human" check in another tab, complete it.`);
        await sleep(15000 * attempt);
        continue;
      }
      if (res.status >= 500 && attempt < 3) { await sleep(2000); continue; }
      return null; // 404/400/persistent 5xx: treat as empty
    }
    S.errors.push(url);
    return null;
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
      const prev = S.centers[inc.id];
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
        seenIn: prev ? Array.from(new Set(prev.seenIn.concat(d.id))) : [d.id],
      };
    }
    return centerRefs.length;
  }

  async function query(locId) {
    if (S.queried.has(locId)) return null;
    S.queried.add(locId);
    const p = S.pageParam ? `&${S.pageParam}` : '';
    const json = await getJSON(`${API}?id=${encodeURIComponent(locId)}${p}&${Q}`);
    return { n: ingest(json, locId), json };
  }

  // Run fn over items with a small worker pool.
  async function pool(items, fn) {
    let i = 0;
    await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
      while (i < items.length && !S.stopped) {
        const item = items[i++];
        await fn(item);
        await sleep(DELAY_MS);
      }
    }));
  }

  // ---- 1. paging probe (Brooklyn has far more than 50 centers) ----
  const probeUrl = (p) => `${API}?id=1-84${p ? '&' + p : ''}&${Q}`;
  const count = (j) => (j && j.data && j.data.relationships && j.data.relationships.centers.data.length) || 0;
  const baseN = count(await getJSON(probeUrl('')));
  log(`Brooklyn default: ${baseN} centers`);
  for (const p of ['quantity=1000', 'limit=1000', 'page[size]=1000', 'page[limit]=1000', 'pageSize=1000', 'count=1000', 'take=1000', 'max=1000']) {
    const n = count(await getJSON(probeUrl(p)));
    log(`  probe ${p}: ${n}`);
    if (n > baseN) { S.pageParam = p; S.cap = 1000; break; }
    await sleep(DELAY_MS);
  }
  if (!S.pageParam) S.cap = baseN || 50;
  log(S.pageParam ? `paging works with "${S.pageParam}"` : `no paging param found; cap is ${S.cap}, will flood-fill by ZIP`);

  // ---- 2. city id sweep ----
  let next = 1;
  let lastHit = 0;
  const t0 = Date.now();
  while (!S.stopped && next - lastHit <= MISS_RUN_TO_STOP) {
    const batch = Array.from({ length: 200 }, (_, k) => `1-${next + k}`);
    next += 200;
    await pool(batch, async (id) => {
      const r = await query(id);
      if (r && r.json && r.json.data) {
        S.stats.cityHits++;
        const n = +id.slice(2);
        if (n > lastHit) lastHit = n;
        S.stats.maxCityId = lastHit;
      }
    });
    const mins = ((Date.now() - t0) / 60000).toFixed(1);
    log(`city ids 1..${next - 1}: ${S.stats.cityHits} cities, ${Object.keys(S.centers).length} centers (${mins} min)`);
  }

  // ---- 3. flood-fill capped responses by ZIP ----
  const zipKey = (c) => {
    if (!c.zip) return null;
    const z = String(c.zip).replace(/\s+/g, '');
    if (c.country === 'USA') return /^\d{5}/.test(z) ? z.slice(0, 5) : null;
    return z.toUpperCase();
  };
  const seedsFrom = (loc) => loc.centerIds.map((id) => S.centers[id]).filter(Boolean).map(zipKey).filter(Boolean);
  let frontier = Object.values(S.locations).filter((l) => l.centerCount >= S.cap).flatMap(seedsFrom);
  log(`${Object.values(S.locations).filter((l) => l.centerCount >= S.cap).length} locations hit the cap; flood-filling from ${new Set(frontier).size} ZIPs`);
  while (!S.stopped && frontier.length && S.stats.zipQueries < MAX_ZIP_QUERIES) {
    const ids = Array.from(new Set(frontier)).map((z) => `2-${z}`).filter((id) => !S.queried.has(id));
    frontier = [];
    await pool(ids, async (id) => {
      S.stats.zipQueries++;
      const before = Object.keys(S.centers).length;
      const r = await query(id);
      const loc = r && r.json && r.json.data && S.locations[r.json.data.id];
      // keep expanding only where results are still capped and still finding new centers
      if (loc && r.n >= S.cap && Object.keys(S.centers).length > before) frontier.push(...seedsFrom(loc));
    });
    log(`zip pass done: ${S.stats.zipQueries} ZIP queries, ${Object.keys(S.centers).length} centers`);
  }

  log(`DONE — ${Object.keys(S.centers).length} centers, ${Object.keys(S.locations).length} locations, ${S.stats.requests} requests, ${S.errors.length} errors`);
  window.saveChabad(!S.stopped);
})();
