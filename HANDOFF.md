# Handoff: Shetachim map

Read this first when picking the project up in a new Claude session or account. It covers
what the owner wants, what exists, what's still open, and the mistakes to avoid.
The latest work is on branch `claude/bold-albattani-aqfnj9`, which the live site is served from.
More detail is in `docs/PLAN.md`.

## RIGHT NOW (mid-task, pick this up first)

The owner sent the full world shetach list (`data/shetachim.json` now has 165 entries: the original
57 US/CA ones plus 108 world ones, from `/root/.claude/uploads/.../af7bbfc9-global_chabad_shetach_list.txt`
if it's still around — otherwise ask the owner to resend it). Just pushed, **untested**:
1. World country geometry (GADM, via the same mirror as Canada — see "Drawing" below) is wired into
   the build for every whole-country shetach in the list.
2. Region view buttons were added (World, Europe, Caucasus & Central Asia, Asia, Middle East, Africa,
   Oceania, Latin America & Caribbean) in `web/index.html`'s `VIEWS` — added under time pressure, right
   before hitting a usage limit, so **test these first**: desktop + phone, each region view, physical
   map too. The owner reported still seeing only US/Canada right after the push — that was GitHub Pages
   deploy lag (wait ~1-2 min and hard-refresh), not a bug, but confirm.
3. 19 shetachim still need finer-than-a-country splits the list calls for and have **empty territory**
   (blank on the map) until done: `crimea`; all 9 Australia ones (`new-south-wales`, `victoria`,
   `brisbane`, `gold-coast`, `rara`, `south-australia`, `western-australia`, `tasmania`, `act`); all 9
   Mexico ones (`baja-california`, `sinaloa`, `nayarit`, `jalisco`, `bajio`, `nuevo-leon`,
   `central-mexico`, `chiapas`, `mexican-caribbean`). Brisbane/Gold Coast/RARA need Australian urban-area
   or LGA boundaries — GADM's Australia ADM2 (local government areas) probably has Gold Coast and
   Brisbane's LGA, but "ABS Significant Urban Area" for Brisbane spans several LGAs, so that one may
   need approximating from several ADM2 units, or another source entirely.
4. No capitals, no cities, for any world shetach — the list didn't include capital data (don't invent
   it; ask the owner), and city-matching (GeoNames) is scoped to US/CA only (`UNIT_ISO` in
   `scripts/build-data.mjs`) — building that out for the world is unstarted.
5. Cabo Verde (CPV) has no GADM boundary in the mirror used — it's claimed by `central-africa` but
   won't be drawn; a warning prints at build time, harmless, just a gap in Central Africa's shape.

## The goal (owner's words, summarized)

An interactive custom map of Chabad **shetachim** (the territory under a head shliach),
drawn like a political map where the shetachim *are* the countries. It is not a regular map
with things drawn on top. It starts with the US and Canada, then covers the world.

- Shetachim can be one state, several states or provinces, or parts of states (cut along county
  or town lines, or straight longitude lines). Areas with no shetach entered yet are left blank.
- Toggle between shetach borders and regular (state/country) borders, or show both with one set
  lighter. Which set is lighter is swappable.
- Colorful (political-map colors) or Plain (one color) fills.
- A faint dot for every Chabad center (from the chabad.org locator). Listings at the same address
  are merged into one dot.
- Labels: head shliach full name / last name only / shetach name / off.
- Views: US & Canada, only USA, only Canada. Each view **shows only that area and fills the
  screen**. Later there will be continent views for the world.
- Zoom and pan.
- Cities that have shluchim, on a toggle.
- Each shetach has a **capital** (its flagship center), shown as a star like a national capital.
  **Just the star: never the center's name next to it.** 770 Eastern Parkway (world
  headquarters) gets a bigger star.
- A **Physical** mode: a full, proper map like Google Maps (green land, tan desert, relief,
  water, roads), with every border replaced by shetach borders like the political map.
  (The owner didn't know the word; it was first built as a dark "street map", which was wrong.)

## Owner preferences and mistakes to avoid (important)

The owner got very angry at the first version. The lessons:

1. **Show only shetachim.** No surrounding countries (Mexico, Central America, Caribbean,
   Greenland, Russia) and no areas outside any shetach. Yukon, NWT and Nunavut are hidden
   (`notShown` in `data/shetachim.json`). On the physical map, land outside is faded out.
2. **Don't treat "states" as the default with shetachim as special exceptions.** Every shetach is
   styled the same way. The first version had gray states with one red shetach, and the owner
   hated it.
3. Picking "USA" means *only* the USA is drawn and fills the screen.
4. Don't invent shetach data: head shliach names, territories and capitals come from the owner.
   The current list came from another AI and "could be incorrect, subject to change".
5. **No explanatory text on the page.** The owner hates notes like "Each state is its own shetach
   until…" or "Tap a dot to see them". Controls and data only; keep messages to a few words.
6. The owner is on mobile a lot (and in dark mode). Keep replies short and plain, and don't ask
   many questions. When they say "do everything I asked", do all of it without checking in.
7. The two unlisted centers are public, as the owner said: Riyadh (address unknown, city centre)
   and Istanbul (in Nişantaşı near the American Hospital, a rough spot), in `data/extra-centers.json`.
8. **Borders need to actually be traced properly**, not approximated. An early version mixed Natural
   Earth (coarse, ~1:10,000,000 — good enough for a world atlas, not for a real US map) with Census
   data, padded/gridded to patch the seam; the owner caught it immediately ("this line not exactly
   following the [Hudson]... it's been replicated across the entire thing"). Every US state now comes
   from its own real Census counties (see "Drawing" below) — check this hasn't regressed if the
   boundary sourcing changes again.
9. 770 is the world HQ, not a regional flagship under whoever heads New York City's shetach. Its card
   doesn't say "New York City · Tzach" the way a normal capital's does (`capitalHTML` in `web/index.html`
   passes `withHead: false` to `shetachLine` for it) — keep that distinction if the card is reworked.

## Current state (all committed and pushed)

- `web/index.html`: the map, a static page (D3 v7 + TopoJSON from cdnjs; MapLibre GL 4.7.1 from
  cdnjs, loaded only when Physical is picked). It loads `web/data/*`. Features:
  - US & Canada / USA / Canada views; zoom buttons; phone layout (bottom sheet)
  - Light and dark themes: the device's by default; the sun/moon button next to Options switches
    and remembers the choice (localStorage `shetachim-theme`, applied by a tiny script in the head).
  - Map: **Political** (our own drawing, conic projection, Alaska and Hawaii in corner boxes) or
    **Physical** (OpenFreeMap `liberty` tiles in both themes, with Natural Earth II relief made
    stronger out to state level and greener woods; Web Mercator; Alaska and Hawaii in place).
    On the physical map there are no political fills, the map's own borders and state/country
    names are hidden, our borders (with a white casing) sit over the roads, land outside the
    shown shetachim is faded (a fade under the water layer plus a light one over everything),
    and the map's city names are hidden while our cities are on. The map's colors on the
    physical map are always the light ones. Switching modes keeps the place you were looking at.
  - Borders: Shetachim / States / Both (+ Lighter swap); Colors: Colorful / Plain (political only)
  - Labels: Shetach name (default) / Head shliach / Last name / Off. Each label is centred inside its
    shetach and never reaches into another one (it may hang over water a little). Where the text doesn't
    fit on one line it tries two, then the shetach's short form (`short` in the data; by default its
    states' abbreviations joined, like KS-MO or MB-SK), else no label. Labels slide sideways past a
    capital's star, and when zoomed in past a shetach's middle the label moves into the part on screen.
  - Checkboxes: Chabad centers, Cities with shluchim, Shetach capitals (all on by default)
  - Cities: a ring and a name, biggest first, only where there's room; a zoom-dependent cutoff
    (`CITY_DENSITY`) keeps small towns for when you zoom in. A city right at a capital's star uses
    the star as its marker, with the city's name beside it.
  - Capitals: a star, no label; 770 bigger. Cards on hover/tap for capitals, cities, dots and areas.
    A capital's card says "<shetach> flagship center" (770's says "World Headquarters", with a
    highlighted card), not "Capital of <shetach>" (read as the state's political capital for a
    shetach named after one, like Oregon).
  - Any center's card can show who's listed there — the first (living) person as the shliach, the
    rest under "+more" — from `data/raw/chabad-personnel.json` (optional; the map works without it).
    It isn't on chabad.org's bulk locator data, only on each center's own record, so it comes from
    `scripts/chabad-personnel-scrape.js`, run by hand in a browser console (this sandbox can't reach
    chabad.org): paste it on a chabad.org tab, it downloads `chabad-personnel.json` when done (it's
    slow — one request per center, rate-limited by the site — and resumable if stopped partway).
    Drop the file at `data/raw/chabad-personnel.json` and rebuild. If `chabad-centers.json` is ever
    re-scraped, run `node scripts/gen-personnel-ids.mjs` first to refresh the id list the scraper covers.
  - Blank areas (no shetach): no fill, no label; their card shows the state.
  - If the physical map can't load (no WebGL, or the tiles are blocked, as in a Claude artifact),
    it says so in a few words and stays on Political.
- `scripts/build-data.mjs` (`npm install && npm run build`) builds `web/data/` from:
  - `data/raw/chabad-centers.json`: the chabad.org locator export (4,220 listings) plus
    `data/extra-centers.json`: 4,222 centers → 3,599 dots; 1,967 → 1,763 in the US/CA.
  - `data/shetachim.json`: 57 shetachim with head shluchim and capitals (chabad.org center ids).
    Territory items: state codes, `{state, westOf/eastOf}` longitude cuts, `{counties}` (FIPS),
    `{state, towns}` (Census county subdivisions), `{state, tracts}` (Census tracts). The most
    specific claim wins where they overlap. Unclaimed areas are blank: now Ohio and New York
    outside NYC and Long Island.
  - Drawing: every US state and DC from its own Census 2022 1:500k counties (from the Census Bureau's
    GitHub); every Canadian province from GADM (github.com/stephanietuerk/admin-boundaries, a plain-file
    mirror — gadm.org itself, and every other boundary host tried, is blocked from this sandbox; see
    "Notes for Claude"). Neither comes from Natural Earth any more: NE's states are far too coarse for
    real detail (Manhattan's whole coastline was ~19 points in NE 10m; Ontario's was just as coarse along
    the Detroit River), and mixing NE with Census at a split state's edge is exactly what caused the
    Maryland bug. A state whose shetach needs more than whole counties is cut finer just where it does:
    Massachusetts (towns and tracts, from the Census Bureau's GitHub) and Pennsylvania (a longitude line,
    on its own counties). One mapshaper `-union` of everything makes every piece share its edges with its
    neighbours exactly (both sources tile themselves with no gaps, so there's nothing to patch — but
    Census and GADM don't necessarily agree on each other's coastline to the metre; the one place this
    still shows is a short, real stretch of the Detroit River, US/Canada, near Belle Isle — worth a look
    if it bothers the owner, but the two sources just draw it slightly differently there).
    Both sources are far more detailed than the map needs everywhere, so the final `-simplify` interval
    is tuned per country (US 400m, Canada 800m, Alaska 2500m for its inset box) to keep the page light —
    turn these down if a spot still looks coarse; the ceiling is whatever the source itself provides.
    Output: `web/data/geo.json`, one object `areas` of pieces `{id, state, name, abbr, country, shetach}`.
  - **The world**: GADM (via that same mirror) is the standard to reach for first when shetachim outside
    the US/Canada get added — it covers every country, at real detail, and geoBoundaries is a fallback
    (CC-BY, cleanly licensed for redistribution, but only reachable here as Git LFS pointers, since this
    sandbox can't fetch LFS content, so it needs the owner's browser, or the sandbox's network policy
    widened to reach geoboundaries.org directly). GADM's own terms allow non-commercial use but ask
    permission before redistributing; this project's public GitHub Pages site is very likely fine (a free
    hobby map, not resold or repackaged), but it's not public domain the way Natural Earth was — worth
    keeping in mind if that ever matters.
  - Tagging: NE countries and provinces, Census counties; centers and cities in split states also
    get the piece they're in.
  - Cities: matched to GeoNames (npm `all-the-cities`); 1,001 cities, 81 unmatched (see report).
  - Capitals are checked: the center must exist; a capital outside its shetach is a warning in
    `data/report.md` ("To check"). All 57 are inside their shetachim now.
- Live site: GitHub Pages from this branch, root folder:
  `https://yechezkelbinstok-dev.github.io/shetachim/` (root `index.html` forwards to `web/`).
- Claude artifact preview (this account; private):
  https://claude.ai/artifact/E8pHqPjx5yGrxqogbi7G1s. The physical map can't load there. The artifact
  version is `web/index.html` minus its `<html>/<head>/<body>` wrapper (keep what's after
  `<!-- page head -->` and the body content, drop the `data:,` favicon), with `web/data/*` as
  supporting files under `data/`.

## Open questions for the owner
- Ohio and the rest of New York: which shetachim, when the owner has them.
- Anything in the current list that turns out wrong (it came from another AI).
- DC, Puerto Rico and the US Virgin Islands; co-head or deceased head shliach display.
- Data gaps: no listings in Armenia, the Philippines, Albania and a few others.

## Notes for Claude
- This cloud sandbox's network is limited: GitHub (`raw.githubusercontent.com`, and anonymous
  `git clone` of any public repo) and the npm registry work; census.gov, geonames.org, chabad.org,
  gadm.org, geoboundaries.org, any OSM host, cdnjs, jsdelivr, unpkg, openfreemap.org and github.io
  are blocked (checked directly, not assumed). That's why counties, towns and tracts come from the
  Census Bureau's GitHub (`uscensusbureau/citysdk`, `v2/GeoJSON/500k/2022/…`), Canada's provinces
  from a plain-file GADM mirror on GitHub, and cities from npm. If a source is only on GitHub via
  Git LFS (`git-lfs.github.com` pointer files instead of real content when fetched anonymously —
  geoBoundaries' own repo is like this), it can't be read here either. The owner's browser reaches
  all of these; the real OpenFreeMap tiles can't be seen from here. The environment's network
  policy (cloud environment menu → Edit, in the session's title bar) can be widened to a specific
  host if a source is worth reaching directly next time, or the owner can download a file and hand
  it over the way `data/raw/chabad-personnel.json` works.
- Testing: headless Chromium is at `/opt/pw-browsers`, and the global `playwright` package is
  installed. Chromium doesn't trust the proxy CA, so serve the repo with `page.route`, answer
  cdnjs URLs from local npm copies (`npm install d3@7.9.0 topojson@3.0.2 maplibre-gl@4.7.1` in a
  scratch folder), and fetch anything else with `curl` inside the route handler. For the physical
  map, answer `tiles.openfreemap.org/styles/liberty` with MapLibre's demo style
  (`raw.githubusercontent.com/maplibre/demotiles/gh-pages/style.json`, its tiles and fonts from
  the same branch). WebGL needs `--use-angle=swiftshader --enable-unsafe-swiftshader`.
  Never disable TLS checks.
- Check a desktop (1400×860) and a phone (390×844) viewport, in light and dark, after changes,
  in both Political and Physical.
- Keep the fade's GeoJSON source at `tolerance: 0`: with MapLibre's default simplification, its
  holes break in some tiles and cover parts of the shetachim.
