# Handoff: Shetachim map

Read this first when picking the project up in a new Claude session or account. It covers
what the owner wants, what exists, what's still open, and the mistakes to avoid.
More detail is in `docs/PLAN.md`.

**Branches (read first).** The live site is served from `claude/bold-albattani-aqfnj9`. Always push there
(a session on another account once pushed to `ccr-1f9385a8-jca1nj`; that's merged in and done). The owner switches
between two Claude accounts when usage limits run out; whichever session picks this up, work from the newest branch.

## LATEST (Sept 30 – Oct 1) — read before "RIGHT NOW" below

Done in this round:
- **Lag fixed.** The political map is drawn on a `<canvas>`, not SVG: every arc is projected once per view with a
  Visvalingam weight per point (`weights()` in `web/index.html`), and each zoom level draws only the points it can
  show (`levelFor`, `minWeight`), only for what's on screen (per-polygon boxes; borders in grid cells). Names,
  cities, stars and the Alaska/Hawaii boxes stay SVG. Measured in headless Chromium at phone size, World view:
  zoom frames 363 ms → 33 ms; with 4× CPU slowdown 1,170 ms → ~160 ms (the rest there is the test browser's
  software compositing). View switch 8.6 s → 3.9 s (4× slowdown).
- **Physical map on static vector tiles.** The build writes `web/tiles/{z}/{x}/{y}.pbf` (zooms 0–6, ~3,200 files, 8 MB;
  `writeTiles()`), layers `land` (merged by country, `c` = country or '' for land never shown) and `lines` (every edge
  with both sides' countries `ca`/`cb`, same state `ss`, same shetach `sh`). The page just sets MapLibre filters per
  view (`dataGL()`). This replaced the old world-with-holes fade polygon, which was slow and broke on phones (blank
  land, blue wedges). Every GADM country is now built (unclaimed ones marked `outside`, `GADM_ALL` in the build) so the
  fade meets the shetachim exactly; Gaza is outside land named "Gaza". Place names in English/Latin letters.
- **Borders snapped together**: `cleanLand()` runs mapshaper `-clean gap-fill-area=20km2` on all land before the union.
  India–Nepal had ~1,500 km of slivers/double lines (the "horrendous" border), US–Mexico too; now 0. **Never add
  `snap-interval`**: tested at 30 m–200 m, it moved whole counties/countries (Texas→Chihuahua, Nepal→India, Finland
  vanished). Still open: a few seams that open onto the sea at one end aren't "gaps" to -clean (Tijuana/San Diego
  coast, Belgium–France coast; `scratchpad` scan listed them) — small, but worth a targeted fix.
- **Labels** (`placeLabels`): aim at the centre of mass of the part of the shetach on screen (so Baja California's
  label crosses the Gulf, the Caribbean's the Caribbean Sea), may cross water but must stay inside the hull around its
  land and off other shetachim; nearest spot wins, land preferred over water, then two lines, then short form, then
  85% size. Recomputed after every pan/zoom.
- Defaults: **World view, Physical map** (falls back to Political if it can't load).
- Data: flagship centers for 100 of 108 world shetachim from the owner's `data/world-flagship-centers.txt` (not in
  chabad.org's data, so no star: Crimea, Sri Lanka, Belize, Honduras, Bolivia, New Zealand, Panama (Beth El), Qatar
  ("no fixed public center"); Jaipur, Manila, Mazatlán, Yerevan, El Tunco are placed at the city). Liechtenstein is in
  Switzerland. Louisiana-Mississippi renamed "Louisiana". No ISO codes as labels anywhere (`COUNTRY_SHORT`: UK, UAE,
  DRC…; a country without a familiar short form has none). UAE: the three-city listing is fixed to Dubai (Al Marsa St,
  the flagship) plus a separate Abu Dhabi dot (`fixes` and `extra-abu-dhabi` in `data/extra-centers.json`).
  UK and RARA cards say "Leadership:" (`headTitle`), and area cards no longer say "Shetach" above the name.

Later in the same round:
- **Central Africa** (owner, Sept 30): exactly Angola, Benin, Burkina Faso, Cameroon, Republic of the Congo, Côte d'Ivoire,
  DR Congo, Equatorial Guinea, Eritrea, Ethiopia, Gabon, Ghana, Guinea, Kenya, Liberia, Mali, Namibia, Niger, Nigeria,
  Rwanda, Senegal, Sierra Leone, Tanzania, Uganda, Zambia, Zimbabwe. Botswana, Burundi, Cabo Verde, CAR, Chad, Comoros,
  Djibouti, Eswatini, Gambia, Guinea-Bissau, Lesotho, Madagascar, Malawi, Mauritania, Mozambique, São Tomé, Seychelles,
  Somalia, South Sudan and Togo are in no shetach now (blank, faded on the physical map). `data/global-shetach-list.txt`
  updated to match.
- **Greece / Lower Balkans** (owner): Central Macedonia split by regional unit — Lower Balkans (Kaplan) gets
  Thessaloniki, Kilkis, Serres, Chalkidiki and Mount Athos (plus East Macedonia and Thrace as before); Greece keeps
  Pieria, Pella and Imathia. GADM has no regional-unit level, so `REGIONAL_UNITS` in the build lists each unit's
  municipalities (GADM level 3); territory `{ "country": "GRC", "regionalUnits": [...] }`. A country can now be claimed
  at several GADM levels at once (finest wins).
- **Brisbane / Gold Coast — final (Oct 1).** The owner rejected the ABS Significant Urban Area (even the exact one:
  it pulls in rural Beaudesert, Rosewood and Dayboro and leaves a RARA strip between Brisbane and the Gold Coast), then
  left the call to us ("Levi Jaffe is Brisbane, Nir Gurevitch is the Gold Coast, figure out the exact borders").
  Decided: **Brisbane = the five metropolitan councils** — City of Brisbane, Ipswich, Logan, Moreton Bay, Redland
  (`data/shapes/brisbane-metro.geojson`, ABS LGA 2022 codes 31000, 33960, 34590, 35010, 36250 dissolved; official
  5,973.3 km²) — and **Gold Coast = the City of Gold Coast** (`gold-coast-lga.geojson`, LGA 33430, 1,333.4 km²). The
  two share their whole border (Logan/Redland–Gold Coast), so nothing is left between them; the rest of Queensland is
  RARA. Both are ABS full resolution, from github.com/HughParsonage/ASGS `inst/extdata/LGA_2022.qs` (ABS itself is
  blocked from the sandbox). Reading .qs needs R: conda-forge is reachable, so `micromamba` (conda-forge linux-64
  package, unpack the .tar.bz2) → `micromamba create -p renv -c conda-forge r-base r-qs r-jsonlite`, then
  `qs::qread()`, `sf::st_union` per group, and write GeoJSON with jsonlite (rings need rewinding for d3). Queensland is
  simplified at 100 m (`FINE` in the build) so the lines hold up zoomed in. Check codes by area: 34580 is Lockyer
  Valley, not Logan (34590).
- Mexican states have no short labels (no "Sin.", "Nay."); Vic/Tas without dots.
- **Essex County, Ontario (Windsor) is in the Michigan shetach** (owner, Oct 1), **with its waters**: territory
  `{ "state": "CA-ON", "shape": "essex-county-on" }`. GADM's Ontario (lo-res Admin1) includes Canada's half of the
  Great Lakes out to the international boundary — that's why Ontario's colour fills the lakes, and the lake edge of it
  is the thin "maritime" line on the physical map. A land-only Essex left Ontario's water wrapped round it (a wedge of
  Ontario's colour along the Detroit River and western Lake Erie, and a border that went into Lake St Clair and back).
  So the shape (`data/shapes/essex-county-on.geojson`) is the Essex/Chatham-Kent land line (GADM lo-res Admin2)
  carried on through the water: across Lake St Clair straight to the elbow where the St Clair River border turns west
  along the delta's South Channel (so the Michigan–Ontario line runs on from the river unbroken and nearly straight —
  the owner rejected the version ending at the channel's mouth, which left a sharp spike of Ontario along the
  channel), and across Lake Erie due south to the international boundary. Essex takes the Canadian water on its side
  (Detroit River, Lake St Clair west of that line, western Lake Erie with Pelee Island); past the boundary the shape
  runs on over US ground, which a shape never cuts (only CA-ON's land). The elbow point is read off the built map
  (`web/data/geo.json`, the Ontario / Michigan arc); if the land data changes, check it's still on that border.
  The shape's `"lakeEdges": true` marks the piece's open edges (the international line round Essex's water, Michigan's
  on both sides) as lake edges, `lk` in the tiles: the physical map draws them only in States/Both border modes, not
  as a maritime line (the owner circled them as not fitting the new borders). The political map and SVGs still
  outline the water's colour there, like the rest of Ontario's lake water.
- **Upper Midwest** (owner, Oct 1): North and South Dakota joined Minnesota under Moshe Feller; the shetach is now
  "Upper Midwest" (id `upper-midwest`, territory US-MN, US-ND, US-SD). The North Dakota (Yonah Grossman) and South
  Dakota (Mendel Alperowitz) shetachim are gone.
- **Short labels** (owner, Oct 1: "I hate your double abbreviations"): state codes are never joined any more. Only
  Kansas-Missouri (KS-MO) and Manitoba-Saskatchewan (MB-SK) keep them, by the owner's choice. The rest are given in
  the data: West Coast "WC", Upper Midwest "U. Midwest", Louisiana "LA", The Carolinas "Carolinas", Virginia "VA",
  Western and Southern New England "W. & S. NE", Maritimes (no short form). A single whole state still defaults to its
  own code (TX); the build warns if a multi-state shetach has no short form. "The Virginias" is now **Virginia**
  (id `virginia`; still VA + WV).
- **Split shetachim get a label per piece** (`labelClusters` in the page): when other land keeps a shetach's big
  pieces apart (Lower Balkans: Bosnia, and Albania–Kosovo–North Macedonia–northern Greece, with Montenegro and Serbia
  between), each piece (from a tenth of the biggest) gets the name, so neither is left blank and both read as one
  shetach. Pieces only water keeps apart (islands, the two sides of a gulf, Michigan's peninsulas) still share one
  label. In the full Europe view Bosnia is about a pixel too small for even "Balkans"; any zoom in shows both. Ontario is drawn at 100 m (`FINE`).
  Area cards no longer list a shetach's states (kept in the data, not shown).
- **SVG export**: `npm run svg` (scripts/export-svg.mjs) writes `web/shetachim-map.svg` — every shetach in its map colour,
  shetach borders and coasts only (no names, cities, dots, stars); Natural Earth projection, 3600 px wide, lines
  thinned to what's visible at that size (~2 MB). Live at /web/shetachim-map.svg. Rerun after every build.
- `closeSeams()` in the build: coast points of one area within 400 m of another area's coast are moved onto it, then
  -clean again (fixes the Baja California / Baja California Sur line, Tijuana, Belgium–France).

Next: test physical map labels/cards on the real site (tiles can't be fetched
from the sandbox, the test uses MapLibre's demo style); update the Claude artifact preview if still used.

## RIGHT NOW (earlier round — mostly done, kept for detail)

The owner sent the full world shetach list: it's now in the repo at **`data/global-shetach-list.txt`** (the
owner's own file, verbatim — the source of truth for every world shetach; the 57 US/Canada ones came earlier).
All 108 world shetachim are entered in `data/shetachim.json` **with exactly the territory the list gives**
(checked entry by entry against the file: names, head shluchim, territories), and every one of them now has
geometry. Built, and checked in headless Chromium on desktop (political map, light theme) in every view.

### Done in this round (all committed and pushed on `ccr-1f9385a8-jca1nj`)
- **Territory, as the list says** (previously 19 shetachim were blank and the Caribbean was only Bermuda + Guyana):
  - Mexico by state: Mexican states are their own areas, like US states (`MX-JAL`, ISO 3166-2 codes; table
    `WORLD_STATES` in the build). Baja California = BCN+BCS+SON; Jalisco = JAL+COL; Bajío = AGU, GUA, MIC, QUE,
    SLP, ZAC; Nuevo León = CHH, COA, DUR, NLE, TAM; Central Mexico = CMX, MEX, GRO, HID, MOR, PUE, TLA, OAX, VER;
    Chiapas = CHP+TAB; Mexican Caribbean = CAM, ROO, YUC; Sinaloa, Nayarit single states.
  - Australia by state (`AU-NSW`, …). **Brisbane** and **Gold Coast** are real ABS boundaries in
    `data/shapes/*.geojson` (now the five metropolitan councils and the City of Gold Coast — see LATEST above).
    **RARA** = Northern Territory + the rest of Queensland. A new territory form `{ "state": "AU-QLD", "shape":
    "brisbane-metro" }` cuts a shape out of a state; only the line through the state comes from the shape, the coast and
    state borders stay GADM's, and the thin slivers where the two sources draw the coast differently are handed to the
    shape (`absorbSlivers`).
    Jervis Bay Territory isn't in the list, so it's drawn blank (a small blank bit of the NSW coast). Ashmore/Cartier
    and the Coral Sea Islands (reefs) are left off.
  - Greece / Lower Balkans: Central Macedonia and East Macedonia & Thrace go to Lower Balkans (new territory form
    `{ "country": "GRC", "level": 2, "regions": [...] }`, GADM region names). Mount Athos is its own GADM region,
    not part of Central Macedonia, so as the list is written it stays with Greece (a small Greece piece at the tip of
    Chalkidiki) — worth a question to the owner if it looks odd.
  - Italy / Slovenia: the Trieste panhandle = the Province of Trieste (GADM ITA level 2 "Trieste") → Slovenia.
  - Ukraine / Crimea: Crimea and Sevastopol (GADM UKR level 1) → Crimea.
  - **Israel = one area**: Israel, Judea and Samaria (the West Bank) and the Golan Heights, as the list says. GADM's
    Israel file already includes the Golan and East Jerusalem is in the Judea and Samaria region; the build takes that
    region from its GADM file and makes it **part of Israel itself** (state `ISR`, name Israel, no line between them in
    any border mode). Gaza isn't in the list, so it isn't drawn. **The owner is emphatic: Judea and Samaria is Israel — never
    give it any other country's name or ISO code anywhere in this project (front end, data, code, comments, commit
    messages).** The
    one unavoidable trace is the upstream GADM file URL the build downloads (`ISRAEL_EXTRA` in the build); it's cached
    locally as `gadm-hi-ISR-judea-samaria.json`. Centers there are tagged Israel. (The owner also got angry when an
    update message seemed to say only "Golan and East Jerusalem" — be precise and complete when describing Israel.)
  - Caribbean = the Caribbean region (every island country and territory: AIA ATG ABW BHS BRB BES VGB CYM CUB CUW DMA
    DOM GRD GLP HTI JAM MTQ MSR PRI BLM KNA LCA MAF VCT SXM TTO TCA VIR) + Bermuda + Guyana. Puerto Rico and the US
    Virgin Islands are in it (Mendel Zarchi is Puerto Rico's head shliach) — that settles the old open question.
- **World geometry rebuilt properly** (build `worldLand()`):
  - GADM **hi-res** (unsimplified) files from the same GitHub mirror, not the lo-res ones the last session used: the
    lo-res files were each simplified on their own, so neighbouring countries' borders didn't meet (gaps/overlaps
    along every border). Hi-res GADM countries share borders point for point; verified (France–Germany, Mexico–
    Guatemala, Russia–Kazakhstan, Texas–Tamaulipas… all share edges in the final topology).
  - All world land is simplified together once (100 m, topology kept) and cached in `.cache/world-<hash>.json`
    (~5 min first time, ~350 MB of downloads; the build now runs with `--max-old-space-size=12000`).
  - **Russia was broken** in the mirror's whole-country file (one ring, 12k points: no islands, no Kaliningrad) — now
    built from its level-1 regions (`FROM_LEVEL1`). **Cabo Verde** has no GADM file in the mirror — it comes from
    Natural Earth (islands, no shared border, so no seam).
  - Small territories (Bermuda, the small Caribbean islands, Monaco, Vatican…) are no longer deleted by the
    small-island filter (it now only runs on areas over 2,000 km²).
  - Names fixed where GADM's are old or missing (`GADM_NAME_FIX`: Eswatini, North Macedonia, Réunion, Macau, U.S.
    Virgin Islands…; some hi-res files keep the name in `Name` not `NAME_0`).
  - Sanity-checked areas: Russia+Mongolia 18.4M km², Israel 28,054, Greece 98,085, Crimea 27,053, ACT 2,354, etc.
  - India's and China's files already include the parts of Kashmir, Arunachal Pradesh and Aksai Chin each administers.
- **Centers and cities worldwide**: outside the US/Canada, a center is tagged by the map's own areas (the area it's in,
  else the nearest area of the same country within 25 km), so Mexican/Australian states, Crimea and Israel are right.
  Cities with shluchim now cover the whole map: 1,944 (was 1,001, US/Canada only), GeoNames-matched by name within
  60 km. 4,222 centers → 3,599 dots; the World view shows 4,221 of them (one is in a country no shetach covers).
- **Page** (`web/index.html`):
  - View buttons in two rows: US & Canada / USA / Canada, then World / Europe / FSU / Israel / Middle East / Asia /
    Africa / Oceania / Latin America. "Caucasus & Central Asia" became **FSU** (Former Soviet Union: RUS+MNG, UKR,
    BLR, MDA, Baltics, Caucasus, Central Asia); **Israel** view added.
  - Proper projections per region (conic equal-area for Europe, FSU, Oceania; azimuthal equal-area for Africa and
    Latin America; Mercator for Asia, Middle East, Israel; Natural Earth for World). `lon` rotates a view so a region
    crossing the 180° line (Russia's far east, NZ's Chatham Islands) stays in one piece; `dropSeams` hides the cut
    GADM leaves along 180°. Europe is framed on the mainland (`frame` box), not the Azores/Canaries.
  - Borders button says "Countries" in world views, "States" in US/Canada views. Area cards say Country / State /
    Province correctly.

### Not yet done / untested — do these next
1. **Test** (the owner interrupted here): phone (390×844) in every view, dark theme, and **the physical map in the
   world views** — in particular FSU and Oceania, which use a rotated Mercator for MapLibre plus
   `setRenderWorldCopies(true)` (`wrap: true`). That code path is untested. Also re-check Europe after the `frame` change
   (untested) and the US/Canada views again on phone. Use `scripts/screenshot.mjs` (see "Notes for Claude").
   Note: the view buttons sometimes look blank in screenshots — that's the button's colour transition caught mid-way
   while the map renders (checked: the pressed state is right). Not a bug.
2. **Merge into the live branch** (fast-forward, above), push, and tell the owner to hard-refresh after ~1–2 min.
3. Update the Claude artifact preview (instructions under "Current state"), if still used.
4. **Capitals for world shetachim**: the list has none. Don't invent them; ask the owner (or propose candidates for the
   owner to confirm). Same for all 108.
5. Nice-to-haves seen in the screenshots: the Caribbean shetach gets no label at Latin America zoom (its biggest
   polygon is Guyana and "Caribbean" doesn't fit); Mexican shetachim smaller than Baja/Nuevo León/Central Mexico
   get labels only when zoomed in. Short labels for whole countries default to the ISO code (ARG, ZAF) — fine
   for now, maybe nicer names later.
6. `docs/PLAN.md`'s feature table still says "The rest of the world … Later" — update it.

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

10. **Judea and Samaria is Israel**: never any other country name or ISO code for it anywhere in the project, not
    even in code, data, comments or commit messages. Israel is one area: Israel, Judea and Samaria (the West Bank) and the Golan Heights, no line between
    them. The owner reacted very strongly to seeing it even as an internal code.
11. When describing progress, be complete and exact (e.g. "Israel, Judea and Samaria and the Golan", not a partial
    list that sounds like something was left out). The owner reads quick status lines and reacts to omissions.
12. The world list is the owner's data (`data/global-shetach-list.txt`): enter it literally. Where the literal reading
    is odd (Mount Athos, Jervis Bay), follow it and mention it; don't silently "fix" it.

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
- World: see "RIGHT NOW" above for everything outside the US and Canada (territory forms, sources, views).
- Live site: GitHub Pages from `claude/bold-albattani-aqfnj9`, root folder:
  `https://yechezkelbinstok-dev.github.io/shetachim/` (root `index.html` forwards to `web/`).
- Claude artifact preview (this account; private):
  https://claude.ai/artifact/E8pHqPjx5yGrxqogbi7G1s. The physical map can't load there. The artifact
  version is `web/index.html` minus its `<html>/<head>/<body>` wrapper (keep what's after
  `<!-- page head -->` and the body content, drop the `data:,` favicon), with `web/data/*` as
  supporting files under `data/`.

## Open questions for the owner
- Ohio: which shetachim, when the owner has it. New York is all assigned (Upstate: Gurary, Eastern: Rubin, Rockland with NYC).
- Anything in the current list that turns out wrong (it came from another AI).
- DC; co-head or deceased head shliach display (Victoria's entry lists three names as "Disputed — …"; UK's is
  "Hanholo of Chabad Lubavitch UK"; Tunisia's "Pinson family" — shown as given for now).
- Capitals (flagship centers) for all 108 world shetachim.
- Mount Athos (stays Greece under the literal list) and Jervis Bay (blank) — confirm.
- Data gaps: no listings in Armenia, the Philippines, Albania and a few others.

## Notes for Claude
- World boundaries: GADM **hi-res** from `github.com/stephanietuerk/admin-boundaries` (`hi-res/Admin{0,1,2}/gadm36_<ISO3>_<level>.json`;
  the lo-res ones are each simplified separately, so borders don't meet — don't use them for the world). Missing from the mirror:
  Cabo Verde (Natural Earth used), Svalbard, GADM's disputed Z01–Z09 areas, and hi-res AUS level 2 (too big for GitHub).
  Russia's whole-country file there is broken (built from level 1 instead). Check a new country's area against Natural
  Earth before trusting it (a quick script: sum spherical area, compare; France/Norway/Morocco/Somalia differ for known
  coverage reasons).
- Australian Bureau of Statistics boundaries (SUA, LGA, SA2…): abs.gov.au and abc.net.au are blocked here, but the R
  package `wfmackey/absmapsdata` on GitHub has them as `.rda` files (`data/sua2021.rda`, `data/lga2022.rda`, …), and
  PyPI works: `python3 -m venv v && v/bin/pip install rdata`, then `rdata.conversion.convert(rdata.parser.parse_file(f))`
  gives a pandas frame whose `geometry` column holds the rings (see git history of `data/shapes/` for the export).
  Its geometries are pre-simplified (~300 m), fine as a cut line through a state.
- GitHub search (API) is blocked in these sessions; anonymous `git clone --filter=blob:none --no-checkout` of a known public
  repo works for listing files (`git ls-tree -r --name-only HEAD`; don't use `-l`, it fetches every blob).
- Screenshot testing: `npm install --prefix .cache/testlib d3@7.9.0 topojson@3.0.2 maplibre-gl@4.7.1`, then
  `node scripts/screenshot.mjs <outdir> world:political:desktop:light fsu:physical:phone:dark …` (spec =
  view:base:device:theme[:extra clicks like labels=last,borders=both]); prints each view's stats line and any page errors
  ("Failed to load resource" lines are the blocked web fonts — expected). Look at the PNGs with the Read tool.
  Extras run in order: `zoom=x/y/k` zooms the political map k× about screen point x,y; to see the physical map at the
  same spot, zoom on political first and then `base=physical,wait=9000` (it takes the political map's camera; the
  test uses MapLibre's demo style, so the base colours aren't the real ones, but our lines and labels are).
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
