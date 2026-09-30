# Handoff: Shetachim map

Read this first when picking the project up in a new Claude session or account. It covers
what the owner wants, what exists, what was in progress, and the mistakes to avoid.
The branch is `claude/sharp-lamport-rouesl`. More detail is in `docs/PLAN.md`.

## The goal (owner's words, summarized)

An interactive custom map of Chabad **shetachim** (the territory under a head shliach),
drawn like a political map where the shetachim *are* the countries. It is not a regular map
with things drawn on top. It starts with the US and Canada, then covers the world.

- A shetach is usually one state, so by default every state/province is its own shetach.
  Some shetachim merge several states or countries, and some states are split (sometimes half a
  state plus a whole state is one shetach). Example given: **West Coast = California + Nevada,
  head shliach Shlomo Cunin.** Another example, for later: **Central Africa = Shlomo Bentolila.**
- Toggle between shetach borders and regular (state/country) borders, or show both with one set
  lighter. Which set is lighter is swappable.
- Colorful (political-map colors) or Plain (one color) fills.
- A faint dot for every Chabad center (from the chabad.org locator). Listings at the same address
  are merged into one dot.
- Labels: head shliach full name / last name only / shetach name / off.
- Views: US & Canada, only USA, only Canada. Each view **shows only that area and fills the
  screen**. Later there will be continent views for the world.
- Zoom and pan.

## Owner preferences and mistakes to avoid (important)

The owner got very angry at the first version. The lessons:

1. **Show only shetachim.** No surrounding countries (Mexico, Central America, Caribbean,
   Greenland, Russia) and no areas outside any shetach. Yukon, NWT and Nunavut are hidden
   (`notShown` in `data/shetachim.json`).
2. **Don't treat "states" as the default with shetachim as special exceptions.** Every area is
   a shetach and is styled the same way. The first version had gray states with one red shetach,
   and the owner hated it.
3. Picking "USA" means *only* the USA is drawn and fills the screen.
4. Don't invent shetach data: head shliach names and territories come from the owner.
5. The owner is on mobile a lot. Keep replies short and plain, and don't ask many questions.
6. **The GitHub repo is public.** Two centers the owner knows of are deliberately unlisted
   and low-key, so they were kept out of git in `data/extra-centers.private.json` (gitignored,
   city-centre precision only). That file did **not** carry over. Ask the owner to re-send those
   entries, and never commit them unless the repo is made private or the owner says so.

## Current state (all committed and pushed)

- `web/index.html`: the map. It is a static page using D3 v7 and TopoJSON from cdnjs, and it
  loads `web/data/*`. Features working:
  - US & Canada / USA / Canada views
  - Borders: Shetachim / States / Both (+ Lighter swap)
  - Colors: Colorful / Plain
  - Labels: Shetach name (default) / Head shliach / Last name / Off. A missing head shliach
    falls back to the shetach name in gray.
  - Center dots with hover/tap cards that link to chabad.org
  - Alaska and Hawaii in corner boxes
  - Zoom buttons; light and dark themes; phone layout (bottom sheet)
- `scripts/build-data.mjs` (`npm install && npm run build`) builds `web/data/` from:
  - `data/raw/chabad-centers.json`: the full chabad.org locator export, 4,220 listings. The owner
    collected it in their browser, since chabad.org is behind Cloudflare and blocks servers.
  - Natural Earth 10m states/provinces for drawing; NE countries plus Census 1:500k counties for
    tagging each center with its country, state and county. Downloads are cached in `.cache/`.
  - `data/shetachim.json`: `notShown` and the entered shetachim (only West Coast so far). Any
    state not listed is its own shetach, named after the state. The build validates codes.
  - It merges listings within 25 m into one dot: 4,220 listings become 3,597 dots, and
    1,967 → 1,763 in the US/CA. It also writes `data/report.md` (counts, suspicious geocodes).
- To preview locally: `cd web && python3 -m http.server`.
- Claude artifact preview (owner's old account; private, may not open from a new account):
  https://claude.ai/artifact/AMPz9NDBkDPA3WXKMnC5mb. To publish it as an artifact, strip
  the `<html>/<head>/<body>` wrapper (keep what's after `<!-- page head -->` and the body
  content) and publish `web/data/*` as supporting files under `data/`.

## In progress when the session ended (not started in code yet)

### 1. Cities toggle (owner asked)
Show a city layer, **only cities that have shluchim** (cities with at least one center), with an
on/off toggle.

Planned approach:
- In the build, group centers by (country, region, city name). US/CA has about 1,011 groups.
- Match each group to GeoNames `cities1000` (download.geonames.org is reachable: `cities1000.zip`
  plus `admin1CodesASCII.txt`). Take the nearest name match within ~60 km, to get the true city
  point and its population.
- chabad.org abbreviates Saint/San/Santa as `S.`: S. Diego, S. Francisco, S. Monica, S. Paul,
  S. Cruz, S. Antonio, S. Euclid, S. Barbara, S. Rafael, S. Rosa, S. Clemente, S. Luis Obispo,
  S. Lazare, S. Clara, S. Jose, S. Agathe, S. Clarita. Try St./Saint/San/Santa/Sainte. Other
  odd names: Côte St. Luc, San José, Trois-Rivières.
- Groups with no match fall back to the median of their centers' positions.
- Output `web/data/cities.json` as `{name, region, country, lat, lon, pop, centers}`.
- Page: a small ring marker plus a label to the right, in the screen-space label layer. Place
  labels after shetach labels, by population, with collision checks, so more cities appear as
  you zoom in. Add a checkbox "Cities with shluchim" (default on).

### 2. Shetach "capitals" (owner asked)
Each shetach gets a capital: its headquarters, e.g. **Chabad West Coast Headquarters** for West
Coast. The rest will come from the owner over time.

Plan:
- Add `capital` to each shetach in `data/shetachim.json`, as `{ "name": ..., "centerId": ... }`
  pointing at a center in the chabad.org data, or `{name, lat, lon}`.
- Draw it with a star marker, like a national capital, and show it in the shetach card.
- The build should validate that `centerId` exists.
- For West Coast, search the centers data for the headquarters listing and confirm it with the
  owner. Don't guess.

### 3. "Google Maps style" base layer (owner asked)
A mode where the base is a real street map and our shetach borders, fills, dots and labels sit
on top.

Plan:
- Load MapLibre GL lazily from cdnjs (`maplibre-gl/4.7.1`); inline its CSS.
- Use OpenFreeMap vector tiles: free, no API key, OSM attribution required. Styles at
  `https://tiles.openfreemap.org/styles/{liberty|bright|positron|dark|fiord}`. All reachable;
  `liberty` is closest to Google Maps, and `dark`/`fiord` work for dark mode. Glyphs are at
  `https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf`, with fonts "Noto Sans
  Regular/Bold/Italic".
- Add GeoJSON layers for the merged shetach polygons (translucent fill when Colorful, none when
  Plain; ink lines), the state lines, the dots (circle layer), and label points (symbol layer).
- Add a mask polygon (world minus the shown shetachim) at ~70% background color, so the areas
  outside the view fade out. This keeps the "only shetachim" rule.
- When "Cities" is on, hide basemap place labels (`label_city`, `label_city_capital`,
  `label_town`, `label_village`).
- **Limitation:** Claude artifact pages block all outside network requests (CSP), so tiles will
  NOT load in the artifact preview. Detect the style-load error and show a message there. For the
  real thing, host the page: GitHub Pages (Settings → Pages → Deploy from a branch → this
  branch, `/ (root)`). The site would then be at
  `https://yechezkelbinstok-dev.github.io/shetachim/web/`. Add a root `index.html` redirect to
  `web/` and a `.nojekyll` file.

## Other open questions for the owner
- The full shetach list: states → head shliach → shetach name, plus which parts go where for
  split states. Splits will use US county geometry (Census counties are already downloaded
  for tagging; each center already has a `county` FIPS).
- New Brunswick and PEI have no listed centers. Currently each is its own shetach. Should they
  join a neighbor or be hidden?
- Alaska and Hawaii are in inset boxes. The owner hasn't said whether they want Alaska in
  its real place.
- DC / Puerto Rico / USVI handling; co-head or deceased head shliach display.
- Data gaps: no listings in Armenia, the Philippines, Albania and a few others. Either
  chabad.org doesn't list them or the export missed them.

## Testing notes (for Claude)
- Headless Chromium lives at `/opt/pw-browsers`; the global `playwright` npm package is
  installed. In the cloud sandbox, Chromium doesn't trust the proxy CA. Serve local files with
  `page.route` and fetch CDN files with `curl` inside a route handler. Never disable TLS checks.
- Check a desktop (1400×860) and a phone (390×844) viewport, in light and dark, after changes.
