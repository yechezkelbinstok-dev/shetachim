# Handoff: Shetachim map

Read this first when picking the project up in a new Claude session or account. It covers
what the owner wants, what exists, what's still open, and the mistakes to avoid.
The latest work is on branch `claude/bold-albattani-aqfnj9`. More detail is in `docs/PLAN.md`.

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
- Cities that have shluchim, on a toggle. Each shetach has a **capital** (its headquarters), shown
  with a star like a national capital.
- A "Google Maps style" mode: a real street map underneath, our shetachim on top.

## Owner preferences and mistakes to avoid (important)

The owner got very angry at the first version. The lessons:

1. **Show only shetachim.** No surrounding countries (Mexico, Central America, Caribbean,
   Greenland, Russia) and no areas outside any shetach. Yukon, NWT and Nunavut are hidden
   (`notShown` in `data/shetachim.json`). On the street map everything outside is faded out.
2. **Don't treat "states" as the default with shetachim as special exceptions.** Every area is
   a shetach and is styled the same way. The first version had gray states with one red shetach,
   and the owner hated it.
3. Picking "USA" means *only* the USA is drawn and fills the screen.
4. Don't invent shetach data: head shliach names, territories and capitals come from the owner.
5. The owner is on mobile a lot. Keep replies short and plain, and don't ask many questions.
   When they say "do everything I asked", do all of it without checking in.
6. The owner is fine with the two unlisted centers being public ("it's up to me"). They're in
   `data/extra-centers.json`: Riyadh (address unknown, city centre) and Istanbul (in Nişantaşı
   near the American Hospital, a rough spot). There's no longer a private-centers file.

## Current state (all committed and pushed)

- `web/index.html`: the map, a static page (D3 v7 + TopoJSON from cdnjs; MapLibre GL 4.7.1 from
  cdnjs, loaded only when the street map is picked). It loads `web/data/*`. Features:
  - US & Canada / USA / Canada views
  - Map: **Political** (our own drawing, conic projection, Alaska and Hawaii in corner boxes) or
    **Street map** (OpenFreeMap tiles: `liberty` in light mode, `dark` in dark mode; Web Mercator;
    Alaska and Hawaii in their real place). On the street map our fills sit under the streets
    and fade toward street level; our borders sit over the streets; everything outside the
    shown shetachim is faded; the base map's own borders and state/country names are hidden,
    and its city names are hidden while our cities are on. Names, cities and capitals are drawn
    by the same SVG code in both modes, so they look the same. Switching modes keeps the place
    you were looking at.
  - Borders: Shetachim / States / Both (+ Lighter swap); Colors: Colorful / Plain
  - Labels: Shetach name (default) / Head shliach / Last name / Off. A missing head shliach
    falls back to the shetach name in gray.
  - Checkboxes: Chabad centers, Cities with shluchim, Shetach capitals (all on by default)
  - Cities: a ring and a name, biggest first, only where there's room; a zoom-dependent cutoff
    (`CITY_DENSITY`) keeps small towns for when you zoom in. A city with many centers counts as
    big even without a population (each center = 5,000 people).
  - Capitals: a star, always drawn; the full name when there's room, else the city name.
    Hover/tap cards for the capital, cities, dots and areas; the shetach card lists the capital.
  - Zoom buttons; light and dark themes; phone layout (bottom sheet)
  - If the street map can't load (no WebGL, or the tiles are blocked, as in a Claude artifact),
    the page says so and stays on Political.
- `scripts/build-data.mjs` (`npm install && npm run build`) builds `web/data/` from:
  - `data/raw/chabad-centers.json`: the full chabad.org locator export, 4,220 listings. The owner
    collected it in their browser, since chabad.org is behind Cloudflare and blocks servers.
  - `data/extra-centers.json`: the 2 unlisted centers above (4,222 centers → 3,599 dots in all;
    1,967 centers → 1,763 dots in the US/CA).
  - Natural Earth 10m states/provinces for drawing; NE countries plus Census 1:500k counties (2022,
    from the Census Bureau's GitHub) for tagging each center with its country, state and county.
    Downloads are cached in `.cache/`.
  - Cities: centers grouped by state + city name, matched to GeoNames (npm `all-the-cities`,
    places over 1,000 people) by name within 60 km in the same state; `S.` is tried as
    Saint/San/Santa/Sainte/South. 1,001 cities; 81 without a match sit at the middle of their
    centers (listed in `data/report.md`). Output `web/data/cities.json`.
  - `data/shetachim.json`: `notShown` and the entered shetachim (only West Coast so far). Any
    state not listed is its own shetach, named after the state. `capital` is
    `{ name, centerId }` (a chabad.org center id) or `{ name, lat, lon }`; the build checks it and
    writes its position into `web/data/shetachim.json`. West Coast's capital is center 117555,
    "Chabad West Coast Headquarters" in Los Angeles (Westwood), the exact name the owner gave.
  - It also writes `data/report.md` (counts, capitals, unmatched cities, suspicious geocodes).
- Preview locally: `python3 -m http.server` in the repo root, then open `/web/`.
- Live site: GitHub Pages, once the owner turns it on (Settings → Pages → Deploy from a branch →
  this branch, `/ (root)`); then `https://yechezkelbinstok-dev.github.io/shetachim/`. The root
  `index.html` sends visitors to `web/`. The street map only works on a real host like this.
- Claude artifact preview (this account; private):
  https://claude.ai/artifact/E8pHqPjx5yGrxqogbi7G1s. The street map can't load there (the
  artifact sandbox blocks the tiles) and says so. To republish from the same session, rebuild
  the file and publish the same path; from a new session, pass that URL. The artifact version is
  `web/index.html` minus its `<html>/<head>/<body>` wrapper (keep what's after `<!-- page head -->`
  and the body content, drop the `data:,` favicon), with `web/data/*` as supporting files under `data/`.

## Open questions for the owner
- The full shetach list: states → head shliach → shetach name → capital, plus which parts go where
  for split states. Splits will use US county geometry (each center already has a `county` FIPS).
- New Brunswick and PEI have no listed centers. Currently each is its own shetach. Should they
  join a neighbor or be hidden?
- Alaska and Hawaii are in inset boxes on the political map (the street map has them in place).
- DC / Puerto Rico / USVI handling; co-head or deceased head shliach display.
- Data gaps: no listings in Armenia, the Philippines, Albania and a few others. Either
  chabad.org doesn't list them or the export missed them.

## Notes for Claude
- This cloud sandbox's network is limited: GitHub (`raw.githubusercontent.com`) and the npm
  registry work; census.gov, geonames.org, cdnjs, jsdelivr, unpkg, openfreemap.org and
  github.io are blocked. That's why counties come from the Census Bureau's GitHub and cities
  from npm. The owner's browser reaches all of them.
- Testing: headless Chromium is at `/opt/pw-browsers`, and the global `playwright` package is
  installed. Chromium doesn't trust the proxy CA, so serve the repo with `page.route`, answer
  cdnjs URLs from local npm copies (`npm install d3@7.9.0 topojson@3.0.2 maplibre-gl@4.7.1` in a
  scratch folder), and fetch anything else with `curl` inside the route handler. For the street
  map, answer `tiles.openfreemap.org/styles/*` with MapLibre's demo style
  (`raw.githubusercontent.com/maplibre/demotiles/gh-pages/style.json`, its tiles and fonts from
  the same branch). WebGL needs `--use-angle=swiftshader --enable-unsafe-swiftshader`.
  Never disable TLS checks.
- Check a desktop (1400×860) and a phone (390×844) viewport, in light and dark, after changes,
  in both Political and Street map.
- Keep the street map's polygon sources at `tolerance: 0`: with MapLibre's default
  simplification, the fade's holes break in some tiles and cover parts of the shetachim.
