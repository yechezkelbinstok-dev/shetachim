# Handoff: Shetachim map

Read this first when picking the project up in a new Claude session or account. It covers
what the owner wants, what exists, what's still open, and the mistakes to avoid.
More detail is in `docs/PLAN.md`.

**Branches (read first).** The live site is served from `claude/bold-albattani-aqfnj9`. Always push there
(a session on another account once pushed to `ccr-1f9385a8-jca1nj`; that's merged in and done). The owner switches
between two Claude accounts when usage limits run out; whichever session picks this up, work from the newest branch.

## ▶ WHERE WE ARE — READ THIS FIRST (Oct 8; continued in a second window after the first ran out of usage)
The owner (Oct 8): "usage about to run out … I'm going to continue this in a different window … it needs to be extremely
seamless, just a direct continuation". So: pick up the task below as if nothing happened; don't re-ask what's settled here.

**State of the repo.** All work is committed and pushed to BOTH branches (`ccr-c5d54bf4-ssoreh`, the session's own, and
the live site's `claude/bold-albattani-aqfnj9`, fast-forward). Commits this round, oldest first: d0d681d Israel's held
ground (Gaza/Lebanon/Syria from the owner's KML) · a24dc2d occupied Ukraine + Crimea → Lazar's Russia shetach · 2fab177
posters · 0fce460 **SPEED** (see the SPEED section below) · f0af3aa **Countries mode + Rest of the world**
(requests 1, 2, 3 and 5 of the five the owner parked; see "COUNTRIES MODE AND THE REST OF THE WORLD" below); then, in a
second window (branch `claude/exciting-euler-o7vx0z`, also pushed to the live one): the country cards (request 4) and
the held ground's colour on the Countries map — see DONE below. Check with
`git log --oneline -8`. Deploy = push to `claude/bold-albattani-aqfnj9` (GitHub Pages serves it, ~1–2 min). After every
finished step: commit, push both branches, tell the owner in plain words (he follows on his phone).

**The owner's last messages, in order (Oct 7–8):** (a) the blue screen / slow start / "whatever you institute … should
not make that when the page gets updated it keeps old stuff" → done (SPEED). (b) "head shliach should still be available
in countries view … Israel should be changed in countries view to eliminate the West Bank and make it part of Israel —
the parts of Gaza Lebanon and Syria that are occupied should also be shown as such (not integrated into Israel fully
though as is the case by shetachim). Also there should be an option when in shetachim to view the unshetached countries
as just regular bordered countries" → done. (c) "country cards should show info like who is head shliach of that country
with head of shetach on top of him tho (so may need some research on your end for countries part of a multi country
shetach)" → **IN PROGRESS, below**. (d) "states and territories of usa Canada and Australia should be shown individually
in the country view" → done (they always were on the political map; now the street and physical maps draw them too).
(e) He said "No deal with that after, go to what you were doing before please the speed problems" — i.e. speed first,
then (b)–(d); speed is done.
(f) Oct 8: "in the country's map … the three occupied territories … should just be a lighter version of whatever Israel
happens to be … with like maybe dashed line separation" → done. (g) "the thing with head shliachs name being across
multiple countries in the country's view" → already so; checked.

**DONE (Oct 8, continued in a second window, branch `claude/exciting-euler-o7vx0z` + the live one): country cards
with the country's own head shliach (request c).** In Countries mode an area's card is: kicker (Country / State /
Province / Held by Israel), name, then **each shetach covering it with its head** ("Central Africa · Shlomo Bentolila";
a territory like India: its parent's head; a split country lists each: Ukraine → Russia · Berel Lazar, Ukraine · Meir
Stambler), then, where the shetach spans several countries, **"Head shliach in Kenya: Levi Yitzchak Notik"** (Hebrew
"השליח הראשי בקניה: …", the article dropped after ב: ברפובליקה הדומיניקנית; English "in the Bahamas / the Cayman
Islands / the Dominican Republic"), then centers + Zoom in. Names without titles, as on every card.
- Data: `data/country-heads.json` → `heads: { ISO3: "<chabad.org center id>" }` (25 countries: Luxembourg; Aruba,
  Bahamas, St Barths, Bermuda, Barbados, Curaçao, Cayman, Dominican Republic, Grenada, Jamaica, St Lucia, Sint Maarten,
  Turks and Caicos, US Virgin Islands; Angola, Côte d'Ivoire, Ghana, Kenya, Nigeria, Rwanda, Tanzania, Uganda, Zambia;
  Cambodia). The build checks each (center on the map, in that country, not the shetach's flagship; a warning if it
  lists no living man) and writes `countryHeads` into web/data/shetachim.json; the page shows the center's **first living
  man listed** (the owner's rule for any center) from centers.geojson, so the name follows chabad.org and its Hebrew comes
  from data/hebrew (`countryHeadHTML` in web/index.html). No line where the shetach's head is based there (DRC, Puerto
  Rico, Thailand, Hong Kong), where the country is a whole shetach, split between shetachim, or has no center of its own
  (Benin, Albania — Kaplan's own, Mainland China — no country-level head on chabad.org, Laos, Myanmar…). The picks were
  re-checked against the listing (Oct 8): every one is the first living man at that country's own national center
  (Dominican Republic: Santo Domingo's, not Puerto Plata's; Nigeria: Abuja's, not the Lagos city rabbi).
- **Israel's held ground on the Countries map (owner, Oct 8): a lighter shade of Israel's own colour, not colours of
  their own**, set apart by the dashed line (the line between two states of one country; on the street/physical maps
  `st-line-state`, also dashed). `colourState()` gives HELD-* Israel's colour index; the fill tints it 55% toward the
  land's colour (`tint` in `apply`: paler in light mode, fainter in dark, where a "lighter" one would outshine Israel).
- **Head shliach names across several countries in Countries mode** (the owner asked again, Oct 8): already so since
  f0af3aa — with Countries borders and Head shliach labels the names are the shetachim's (Shlomo Bentolila once across
  Central Africa, over the countries' borders). Checked in screenshots.
- Checked: cards in English and Hebrew (Kenya, Luxembourg, Nigeria, Cayman, Dominican Republic, DRC, Benin, Cambodia,
  Ukraine, Greece, India, China, Albania, Puerto Rico, held Gaza), close-ups of the dashed lines, `node scripts/stress.mjs`
  → no errors.

**Also done (Oct 8, second window):**
- **Occupied Ukraine is Russia on the Countries map too** (owner: "fully integrated as part of Russia as they are in the
  shetach map"): the claim in data/shetachim.json has `"countriesAs": "RUS"`; the build passes it on as the piece's `as`
  (geo.json, world-all.json) and as `pa`/`pb` on the tiles' lines; the page's `polCountry`/`polState` group it with
  Russia (colour, the country line along the front line, no line on the old border, Russia's name over both — in the
  Europe view, which has no Russia, the occupied part alone is named Russia — and Russia's card).
- **"Part of Israel: Gaza · Lebanon · Syria"** (Borders, with Countries or Both, in views with Israel; owner: "mix and
  match"): each held area, picked, is drawn as Israel (Israel's colour, no dashed line, no name of its own, Israel's card
  and outline); not picked, as held (lighter, dashed, its own name and "Held by Israel" card). `state.joined`; Israel's
  own lines are their own pieces (`mesh:held`, a feature per pair of states with `a`, `b`; on the tiles `sa`/`sb`), so a
  pick only changes filters (`israelSide`, `nameFilter`, the fill's `heldShown`), nothing is worked out again.
- Posters regenerated from the current data (checked point by point: no line inside Israel).
- **Tapping a head shliach's name in Countries mode outlines his whole shetach** (owner, Oct 8: "if I clicked Bentolila's
  actual name it would show an outline around his countries"): with Countries borders and Head shliach labels, a tap on
  a name (`names`/`names-alt` features carry `sid`) gives the shetach's own card (`shetachHTML`, split out of `areaHTML`)
  and outlines every country of it, its territories too (Kantor: Thailand with India, Laos, Cambodia, Myanmar);
  `shetachArea` merges the group's pieces once per view (`S.groupAreas`); "Zoom in" fits the whole shetach. A tap
  anywhere else is the country's card, as before. Checked: Bentolila, Kantor, Zarchi (English and Hebrew), stress → no errors.
- **Next:** (14) India's added centers
  link to their Chabad of India pages; research (15) Qatar — how far Eli Chitrik's Qatar is under his father Mendy
  Chitrik's Turkey, and whether there's a physical center in Doha (like Jewish KSA in Riyadh); (16) Bahrain — any Chabad
  presence and under whom. Then ask the owner what's next.

**Testing tools (all in scripts/, Playwright + headless Chromium at /opt/pw-browsers):** `node scripts/screenshot.mjs
<outdir> view:base:device:theme[:clicks]` (now waits for `__dbg.settled()`; fetches the real OpenFreeMap style, tiles and
fonts — reachable since Oct 8 — cached in .cache/ofm); `node scripts/profile.mjs phone 4` (RELOAD=1 for a reload too);
`node scripts/stress.mjs` (rapid option/view/language switching mid-load, a card, zoom-to, reload; must end "no errors").
"console Error … Failed to fetch" lines in screenshot.mjs output are harmless (blocked fetches). CDN libraries come from
.cache/testlib (`npm install --prefix .cache/testlib d3@7.9.0 topojson@3.0.2 maplibre-gl@4.7.1` if missing). Frame rates
under SwiftShader mean nothing (it draws on the CPU); look at long tasks.

**Standing rules to keep in mind (details further down):** Judea and Samaria is Israel — never another country's name
or ISO code for it anywhere (code, data, comments, commits); old Russian city names only (Kiev, Kharkov, Lugansk,
Zaporozhye, Dnepr, Nikolaev, Slavyansk); never shorten head shliach names; don't invent shetach or personnel data; the
owner prefers few questions — decide sensibly and say what you chose.

## ISRAEL'S HELD GROUND (Oct 7, done): Gaza, southern Lebanon, Syria — from the owner's IDF control map
The owner asked (Oct 7): **(1) add the Israeli-controlled parts of Lebanon and Syria to Israel, the same way as Gaza**
(part of Israel, no line between); **(2) fix Gaza's edge — it was "a weird rough border, not a precise one".** Then he
sent his own map for all three: **`data/idf-control.kml`** (his "IDF Control" Google My Maps export, IDF_Control.kmz,
unzipped, unchanged): "everything within every polygon is within IDF control, I've deleted anything that isn't"; treat
the overlapping polygons as one contiguous area and ignore their names (dates). **It replaces the OpenStreetMap lines**
(Gaza's Yellow/Orange Line ways, Lebanon's "security zone" relation 18723137, Syria's UNDOF relation 184888), which
are no longer used.
- `node scripts/held-lines.mjs` (replaced `gaza-line.mjs`): merges the map's 100 polygons (98 placemarks), closes the
  gaps between them (grown 60 m and shrunk back: holes, hairline cracks, pockets with a mouth under 120 m), cuts GADM's
  Gaza, Lebanon and Syria along the result, and writes `data/shapes/{gaza,lebanon,syria}-{held,rest}.geojson`. The build
  (`HELD` in build-data.mjs) adds each held part to Israel's shetach (as an area of its own since Oct 8, `HELD_AREA`: no
  line on the Shetachim map, shown apart as held on the Countries map) and draws each rest as outside land. Then `npm run
  build`, `npm run svg`, `node scripts/svg-png.mjs`. **When the owner sends a new map**: unzip its doc.kml over
  data/idf-control.kml and run the same. Israel is drawn at 100 m (`FINE`).
- **Slivers and pockets**: where the map runs along a border, it and GADM draw the border a little differently; every
  piece of the rest that isn't its main body and touches the held part (up to 25 km²) goes to the held part, so no grey
  specks or notches show inside Israel (Gaza's "rough border" was exactly that).
- **The owner's call on walled-in ground** (Oct 7, asked): **Rmeish and Ain Ebel** (the Christian villages, a 39.5 km²
  pocket against the border that no polygon covers) **stay Lebanon**, an enclave in Israel's ground (`KEEP` in the
  script); every other walled-in hole is filled: farmland west of Shamaa (8.5 km²), a spot in northern Gaza near Beit
  Hanoun (1.9 km²), between Arnoun and Yohmor (0.5 km²), near Rafah (0.3 km²).
- **Har Dov (the Shebaa Farms)**: GADM puts it in Lebanon (so the map had drawn it as Lebanon all along); Israel has held
  it since 1967 as part of the Golan, so OSM's Golan Heights area (relation 16119376, `controlled_by` Israel) is also cut
  from Lebanon. Without it the owner's posts on the Kfarchouba hills just north of it would float as islands.
- Result (Oct 7): **Gaza** 195.7 km² held, 57% of GADM's Gaza outline (the rest one piece, 147.9 km²); **Lebanon** 377.2
  km² held (3.7%; with Har Dov), several zones from Naqoura to the Hermon, the rest of Lebanon touching the border between
  them, plus the Rmeish–Ain Ebel enclave; **Syria** 363.4 km² held beyond GADM's Israel (the whole former UNDOF buffer
  zone with the Syrian summit of Mount Hermon, the Hermon's eastern slopes, ground east of Quneitra, a strip toward the
  Yarmouk; all 9 IDF outposts on INSS's map are inside). Israel: one piece, 28,992 km², its one hole the Rmeish–Ain Ebel enclave.
- Syria and Lebanon themselves stay in no shetach; only the held parts are Israel's.
- **The bare strips along the borders (most likely the real "rough border")**: the faded land round a view and "Rest of
  the world" come from web/data/outside.json, which the build used to thin to 40% on a coarser grid. Next to Israel's
  100 m lines that left strips of bare sea, up to about a kilometre wide, between Israel and Lebanon, Syria and Gaza
  zoomed in (and along every border between shetach land and land no shetach covers). Now outside.json and geo.json are
  written on the same grid (TopoJSON quantization 200,000, both framed by the whole globe: a `frame` object in each,
  after the main one — the page reads geo.json's `areas` and outside.json's first object) and outside.json isn't
  simplified any further, so they meet point for point (checked in screenshots: no bare pixels inland at zoom 9–12).
  outside.json is 0.9 MB now (250 KB gzipped; was 108 KB), geo.json 2.6 MB (740 KB gzipped; was 666 KB: the finer grid
  is what lets the 100 m lines of `FINE` show — at 100,000 the longitude grid alone was 300–400 m).
- Background found while the OSM lines were in use (kept for reference): the IDF's Lebanon "security zone" map of June
  18, 2026 (OSM relation 18723137) is 618 km² of Lebanon, the owner's map 340 km²; INSS's ArcGIS map of Syria
  (experience.arcgis.com/experience/417d6596ca2649518cf3f6cae9b204fa) has the IDF outposts as points.
- Network (Oct 7): the OSM API (`www.openstreetmap.org/api/0.6/<way|relation>/<id>/full.json`, `map.json?bbox=`, history,
  changesets) and nominatim.openstreetmap.org are reachable now; Overpass (every mirror tried) and Geofabrik are not.
  Wikipedia (`/w/index.php?title=…&action=raw`, with a User-Agent), ArcGIS Online's REST API, feor.ru and
  deepstatemap.live's API are reachable.

## OCCUPIED UKRAINE AND CRIMEA → LAZAR'S RUSSIA SHETACH (Oct 7, done)
- The owner (Oct 7): Donetsk, Lugansk and the other Chabad centers in the Russian-held regions now work under Berel
  Lazar, and Lipszyc no longer runs Crimea, it's effectively under Lazar too; then: **"use the current occupation line and
  put all centers behind it into the Russian shetach."** So **Russia** (Berel Lazar) = Russia, Mongolia, Crimea and all
  of Ukraine Russia holds; the **Crimea shetach (Yitzchok Meyer Lipszyc) is gone** (data/shetachim.json,
  data/global-shetach-list.txt, data/hebrew/shetachim.json; its flagship line in world-flagship-centers.txt left as it
  is, like Cambodia's); **Ukraine** (Meir Stambler) = the rest.
- The line: DeepStateMap (`deepstatemap.live/api/history/last`, its daily map as GeoJSON; reachable from the sandbox).
  `node scripts/occupation-line.mjs` keeps its areas held by Russia (occupied, the parts of the Donetsk and Lugansk regions
  held since 2014, Crimea, Tuzla — not its "unknown status" grey zone), merges them and writes
  data/shapes/ukraine-occupied.geojson; the Russia shetach claims `{ "state": "UKR", "shape": "ukraine-occupied" }`
  (Ukraine is cut along it; UKR is drawn at 100 m, `FINE`). Map of Oct 5, 2026: 116,800 km² (from the Kinburn Spit and the
  left bank of the Dnepr to the Lugansk region, plus small pockets along the Sumy and Kharkov borders). **Re-run when the
  line moves**, then `npm run build`.
- What was found per center (Oct 7, before the owner's go-ahead): **Crimea** — Simferopol, Sevastopol, Yevpatoria and
  Yalta are on FJC Russia's community list (feor.ru); chabad.org has Rabbi Yechezkel Lazar at Simferopol; Lipszyc left in
  2014. **Lugansk** — led by Shneur Zalman Nekhaenko, "representative of the Chief Rabbi of Russia in the new regions"
  (Lugansk city administration, Nov 2024); Rabbi Shalom Gopin left in 2014 (a Lugansk community in exile in Kiev).
  **Donetsk** — helped by FJC Russia since 2014 (Lechaim, 2017); Rabbi Pinchas Vishedski left in 2014 (a Donetsk community
  in exile in Kiev). **Mariupol** — Lazar to RIA Novosti (Aug 7, 2026): FJC Russia works with the Mariupol, Donetsk and
  Lugansk communities, sends aid, has rabbis there. **Melitopol** — on Gotov (gotov.org, FJC Russia's community platform)
  at a renamed street, though chabad.org and FJC Ukraine still list it under Zaporozhye's Rabbi Nochum Ehrentreu.
  **Makeevka** — nothing found. chabad.org still shows the old personnel for all of them.
- Centers behind the line (tagged by the map's own areas, so they follow the line): Donetsk (3 listings), Makeevka,
  Lugansk (6), Mariupol, Melitopol, Simferopol, Sevastopol (2). A "Jewish Community of Donetsk" listing that chabad.org
  places near Slavyansk (48.93, 37.69), about 14 km on the Ukrainian side, stays Ukraine's. Kherson, Zaporozhye, Kharkov
  stay Ukraine's.

## SPEED (Oct 8, done) — the first view at once, no long blank map, never an old map after an update
The owner (Oct 7): coming back to the page, or reloading it, showed only the blue sea "for a long time"; panning and
zooming were painful at the start; "whatever you institute to fix this should not make that when the page gets updated
it keeps old stuff". Measured with `node scripts/profile.mjs phone 4` (a slow phone): the page was ready after 26 s, one
15-second freeze (every shape of the world projected, handed to the map engine twice or three times, all the names
worked out in one go). Now: the shetachim show at ~5 s on that slow phone (~1.6 s on a desktop), their borders a second
later, the names come in biggest first and are all there by ~11 s (4 s desktop); a reload shows shetachim and names
together at ~4.4 s (1.2 s desktop); no freeze over ~0.6 s, so the map moves from the first moment. How:
- **Asked for at once** (`EARLY`, a small script at the top of the page): the data files and the street map's style are
  fetched while the map library still loads. **Every data file is checked with the site on each load** (`cache:
  'no-cache'`: an unchanged file comes from the browser's cache after a quick check, a new one at once), and the physical
  map's tiles are asked for under the data's version (`tileVersion()`, from the files' ETags) — so an update shows on the
  next load, never an old map. The refresh button (`?v=`) still fetches everything anew.
- **A slice at a time** (`prep`/`got`/`need`, `S.makers`): each set's heavy shapes (areas, each kind of line, the land,
  the land no shetach covers, the names) are generators worked out once each, ~12 ms at a time between frames (4 ms
  while the map moves), the most urgent first (`RANK`: areas, then lines, then names, then the land round the view).
  `got(S, what)` works one out at once when code needs it now. **Don't add work that runs in one go at startup.**
- **Handed over once** (`feed`): a source gets new data only when what it shows changes (`FED`); the map engine copies
  (stringifies) everything it's handed, which was most of the freeze. The view's other way of drawing (the standard map
  under the street map, while the flat political one shows) is only handed over when it's shown. Only the lines shown are
  worked out (`mesh:<kind>`: coast, shetach, inner; country and regular with Countries/States/Both).
- **The land is drawn from the areas** (`land-view`, `land-rest`: the areas source in the land's colour) instead of
  merging the world's land into one outline (1 s+ on the phone); a flat continent's or the boxed USA's land round the view
  still is one shape (`land`, only for the faded rest of the world and Rest of the world). The faded land is a solid
  colour mixed with the sea's (see-through, a simplified shape overlapping itself showed a lighter patch: Tamaulipas).
- **Names**: biggest areas first, shown every ~0.7 s as they come; held back until the areas are on the map; label
  placement much quicker (a heap in `polylabel`, each pole once, `emWidth` measured once, cheap inside tests); they wait
  for the page's font to load (3 s at most) so they're measured right. **Kept in the browser for the next visit**
  (localStorage `shetachim-names|<fingerprint>|<set>|<mode>`): the fingerprint is this page's code (all its scripts),
  the data files' ETags and whether the font had loaded, so a new version of the page or the data never shows old names;
  older entries are cleared when new ones are kept. No ETag from the site, no keeping.
- Smaller: the topology decoded once to plain lon/lat (`decodeArcs`, to 1e-6°); flat coordinates rounded to 1e-5°
  (shorter to hand over); the Hebrew name setup only when Hebrew is shown (`bilingual()`); neighbours worked out once for
  both colourings; icons not redrawn on every option change; the RTL plugin asked for at the start; the root
  `index.html` forwards by script (at once, keeping `?lang=he`).
- `web/data/outside-lo.json` (new, from the build): the land no shetach covers, light, for the flat maps; the standard
  maps use the full `outside.json` (it meets the shetachim point for point).
- Testing: `window.__dbg.settled()` is true once nothing is left to work out or hand over for the map shown (names
  included); `data-drawn="1"` on `<html>` once the first view is complete; `window.__feedLog` (if a test sets it to [])
  records when each source got its data. `scripts/screenshot.mjs` waits for `settled()`. **OpenFreeMap is reachable from
  the sandbox now (Oct 8)**: screenshot.mjs and profile.mjs fetch its style, tiles, sprites and fonts for real (kept in
  `.cache/ofm`), so screenshots show the real physical map and the map's names (before, its fonts were blocked and no
  names showed in screenshots at all); `DEMO=1` for MapLibre's demo style as before.
- Physical map (owner, Oct 7): **every land border of a shetach gets the purple border**, also where the other side has no
  shetach (Israel's against Egypt and Jordan; before, only borders between two shetachim had it).

## COUNTRIES MODE AND THE REST OF THE WORLD (owner, Oct 7; done Oct 8 after the speed work)
1. **Head shliach labels in Countries mode too**: with Countries borders and Head shliach labels, the names are the
   shetachim's heads, over the countries' borders (`namesOf`: `regular` only with Shetach name labels).
2. **Israel in Countries mode**: Judea and Samaria is Israel — no line anywhere (the political map never had one; the
   street and physical maps drew the street map's own borders, with the 1949 lines through Israel). **The held parts of
   Gaza, Lebanon and Syria are areas of their own** (build: `HELD_AREA`, states `HELD-GAZA`, `HELD-LBN`, `HELD-SYR`,
   named "Israeli-held Gaza/Lebanon/Syria", Hebrew "עזה/לבנון/סוריה בשליטת ישראל"; country ISR, shetach Israel's):
   the Shetachim map draws no line between them and Israel (fully part of it, as before); the Countries map shows each
   in a lighter shade of Israel's colour (owner, Oct 8; first each had a colour of its own), with its own name and a
   dashed line against Israel (state style), and its card says "Held by Israel".
3. **"Borders of the rest of the world"** (More options, new): with Shetachim borders too, the countries no shetach
   covers are shown as ordinary countries with their borders (political: the rest of the world in grey, with its
   countries' borders; physical and streets: their borders over the street map). `state.restBorders`; `rest()` is
   "Rest of the world or its borders".
4. **Country cards: the country's own head shliach** under the shetach's head — done Oct 8, see WHERE WE ARE above.
5. **States drawn on every map with Countries**: the political map always drew the US states, Canadian provinces and
   territories, Australian (and Mexican) states each in its own colour with dashed borders; **the street and physical
   maps now draw every country's and state's border themselves** (`st-line-country`, `st-line-state`, from our tiles;
   the street map's own `boundary` layers are never shown), so the states show there at every zoom too. The tiles' lines
   carry `na`/`nb` (each side's country, also for land no shetach covers) and borders between two countries no shetach
   covers (before, only borders touching a shetach were in the tiles).

## OWNER'S STANDING RULES (Oct 1) — never undo these
- **Any Chabad activity in a country puts it in a shetach** (Oct 5): visiting bochurim, a shliach who serves it from next
  door, holiday trips — the country goes to the shetach of the shliach responsible (Mongolia is Russia's; Guyana is the Caribbean's).
  The owner wants it *sure*: Suriname had Merkos Shlichus seders in Paramaribo (Pesach 2025) but no shliach is named as
  responsible (Rabbi Super of St. Lucia only helped with the bochurim's stopover), so it stays blank until one is. Only truly uninhabited stretches are left out (the Yukon and
  NWT only partly in Alberta). French Guiana: no Chabad activity found (Oct 5), so no shetach yet.
- **Old Russian city names only** (owner, Oct 7), in messages to him as on the map: Lugansk, Zaporozhye, Kiev, Dnepr,
  Kharkov, Nikolaev, Slavyansk — never the Ukrainian forms (`UA_NAMES` in the build does it for the map's towns).
- **Head shliach names are never shortened** — not on the live map, not in the SVGs, never to the last name alone
  (owner, Oct 7: there is no "Last name" label mode any more). Where the full name doesn't fit on one line or two,
  no name. **Middle names are left out on the map and posters** (`mapName` in data/shetachim.json, `mapHead` in the
  Hebrew list; the cards always show the full `headShliach`) unless part of the first name (Sholom Ber, Menachem
  Mendel, Yosef Yitzchak, Shneur Zalman) or the man is usually called by it (Yitzchok Meyer Lipszyc, Gershon Meir
  Burshtein, Aryeh Zeev Raskin, as the press names them). Oct 7: Yaakov Biderman, Chaim Azimov, Yeshaya Cohen, Yosef
  Kantor, Chaim Shaikevitz (that last one unconfirmed: found no usage either way). Same in data/hebrew/shetachim.json.
  Families and leadership entries ("Alevsky family", "Hanholo of Chabad Lubavitch UK") are never shortened.
  **Cards keep everyone's full name exactly as chabad.org lists it** (owner, Oct 7): the middle-name rule is for the
  map's head shliach labels and posters only; double names like Chaya Mushka, Devorah Leah count as one first name.
- **Alberta's name sits on Alberta itself** in every label mode (`labelState: "CA-AB"`: the page keeps the name within
  that state's part while it's on screen — it used to only aim there, and the two-line head-shliach name drifted up
  into the territories' strip). The Alberta shetach's territories part ends at **110°W** (the Alberta–Saskatchewan
  line carried up to 63°N; `data/shapes/north-to-63.geojson`); the NWT east of it is in no shetach and left off.
- **Judea and Samaria is Israel** (see below); Peru is the **Blumenfeld family** (Tunisia: Pinson family, Northeast
  Ohio: Alevsky family; each has `lastName`, for the cards' "<name> family" line).
- Ohio: Northeast Ohio (Alevsky family), Central Ohio (Areyah Kaltmann), **Southern** Ohio (Sholom Ber Kalmanson; not
  "Western"), the Toledo area in Michigan. Capitals: Chabad of Cleveland, Chabad of Columbus, and Chabad of Southern
  Ohio's office (7380 Laurel Oak Lane, Amberley Village; hand-added in `data/extra-centers.json`).
- Before changing anything on the live map, check what the other account last did (`git log` on
  `claude/bold-albattani-aqfnj9`, and this file) and keep it.

- **West Virginia** is entirely in **Western Pennsylvania** (Yisroel Rosenfeld) — the owner briefly kept 8 eastern
  counties with Virginia, then reversed it. Its name centres on Pennsylvania (`labelCentre: "US-PA"`, softer than
  Alberta's `labelState`: aims at that state's part but may run a little into West Virginia).
- **The Gold Coast is an exclave of Victoria (Melbourne)** (Oct 1, the owner's call): the City of Gold Coast
  (`gold-coast-lga`) is part of the Victoria shetach; the separate Gold Coast shetach (Nir Gurevitch) is gone.
  Victoria (disputed) has a capital per claimant: Groner — Yeshivah Centre; Gutnick — Chabad House of Caulfield;
  Serebryanski — Merkos L'inyonei Chinuch (`capital` is a list with `for`). "Disputed" is set in italics.
- **"Rest of the world"** (More options checkbox, off by default; was "Land with no shetach" — the owner, Oct 5: never that wording; borders between its countries only with the Countries or Both borders setting): the political map draws land no shetach covers
  (`web/data/outside.json`, written by the build) and the land outside the current view in plain grey (`--empty`).
- **Cambodia is fully part of Kantor's Thailand shetach** (Oct 2; territory THA, LAO, MMR, KHM; the separate Cambodia
  shetach under Bentzion Butman is gone, also from data/global-shetach-list.txt and data/hebrew/).
- **India is a territory of the Thailand shetach** (`territoryOf: "thailand"`; the owner: "under the same auspices but
  not fully united"; he rejected "India (Thailand)" and a lighter shade): India is its own entry, in exactly Thailand's
  colour, with a dashed border between them (page mesh `inner`, tile edges `tr`, SVG dashed path); named plainly
  "India"; in the head modes Kantor's name again over India in italics and smaller (`secondary` labels; Hebrew, which has no italics:
  Heebo Regular slanted by hand on the posters, oblique on the page; at most 85% of his main name on the posters), his main name on Thailand–Myanmar–Laos as before;
  India's card: "Overseen by Yosef Chaim Kantor" (בהנהגת …) (Oct 5; the owner rejected "Together with the Thailand shetach", "Under the auspices of", and "Head shliach" + "Also head shliach of Thailand" — don't quote his own words onto the page). (`noCentralLeadership: true` remains for a shetach without a head.) Israel's name on the world poster goes beside the map with a short leader (`ASIDE_NAMES`);
  Hawaii's runs across its islands (`SEA_NAMES` 'chain'). The US & Canada names maps use short leaders to the nearest
  water (`aside`, only the Boston/Cape Cod knot stacked), not one column far out in the Atlantic.
- **North Queensland** (Ari Rubin; capital Chabad of Northern Queensland, Cairns): Mackay and north, Mount Isa,
  Cloncurry and the Gulf — 37 whole ABS LGAs (2022) dissolved into `data/shapes/north-queensland.geojson` (Mackay,
  Whitsunday, Burdekin, Townsville, Charters Towers, Cairns, Douglas, Cook, Torres, the Cape and Gulf councils, Mount
  Isa, Cloncurry, McKinlay, Richmond, Flinders…). Isaac (Moranbah, Clermont), Winton, Boulia, Rockhampton and south
  stay with RARA. **The Isle of Man is in the UK** (`IMN` in its territory, and in the page's `EUROPE` list, or it isn't drawn at all: Oct 7 it was missing there).
- **Mexico is one shetach under Yosef Mayzlesh** (Oct 2, the owner: "entire Mexico is Mayzlish"; Rabbi Yosef
  Mayzlesh, Chabad of Bosques — Rabbi Mendel Mayzlesh runs Chabad Lubavitch Mexico City). The earlier Mexican
  shetachim (Baja California, Sinaloa, Nayarit with western Jalisco, Jalisco, Bajío, Nuevo León, Chiapas, the Mexican
  Caribbean) are gone, and with them the jalisco-costa-norte shape. Baja California and Baja California Sur belong to
  the West Coast (Shlomo Cunin) with California and Nevada; Mexico is its other 30 states.
- **Cyprus includes the British Sovereign Base Areas** (Akrotiri, Dhekelia): Natural Earth shapes (`CYPRUS_EXTRA` in
  the build; GADM has none), merged into Cyprus itself.

## World names SVG (Oct 1, done; on the download page)
`web/shetachim-map-names.svg` (+ .png): the whole world at poster size (10,800 px wide, Natural Earth projection), every
shetach coloured with its head shliach's name; land no shetach covers is one plain grey swath with no borders inside
it (from `data/world-all.json`, which the build now writes); Antarctica left off. Names (scripts/export-svg.mjs):
- centred in their shetach both ways (`offCentre`: midway between the borders above/below and either side, plus near
  the shetach's middle), shrinking up to a third to get there; Virginia was the example (it had sat on the southern
  border). `labelAt` [lon, lat] in data/shetachim.json overrides the middle (India: mainland India, not pulled toward
  the northeast past Bangladesh). Same code for the US & Canada names SVG.
- names under 5 px inside (`tiny: 5`; Tzach, Tuvia Teldon, Mendel Fogelman, Chaim Prus, Chuni Vogel were 2.5–4 px and
  "impossible to read") get a leader instead: each its own short line to the nearest open water (no crossing other
  names, ≤25 px over other countries' land; crossing one other leader beats a long way round). Placement is retried
  with any name that got no room, or only a long line, placed first; the best try is kept.
- **No columns of names** (the owner, Oct 1: the old 8-name list off New England with long crossing lines was
  rejected) — except a tight knot (3+ names starting within 45 px: Boston, Cape Cod, Rhode Island), which is stacked
  right off the coast, placed first, rows in the order the lines arrive so none cross (`column: true`).
- **Names over the sea only where the owner picked** (`SEA_NAMES` in export-svg.mjs: Indonesia/Singapore's shetach, the
  Philippines, Qatar): centred between the islands or straddling the coast, clear of other land. Everywhere else it
  looked bad and was rejected — keep it to that list.
- The same words on one line or two: two lines when that's at least as big (Eli Rosenfeld down Portugal); between
  different wordings, the fullest within 15% of the best. The owner asked to leave this rule as it is.
- Lower Balkans (Yoel Kaplan): one name with a leader from each of its two parts (Bosnia; Albania–northern Greece) —
  `split`: big parts that other land keeps apart (shortest gap mostly someone else's land).
- The owner's verdicts on the SVG (Oct 1): as few names beside the map as possible — a small name inside its shetach
  (down to ~2.5 px on the 10,800 px poster) beats a leader; a column of leadered names "looks like a list" and is
  rejected; leaders short and near their place (Raskin's long line to Cyprus was rejected); a small name takes the
  biggest size that fits even a little off-centre (Delaware); big shetachim get big names (Oct 2, "Lazar, Bolivia… should be bigger", then "way bigger and one line": cap 0.25·√area, up to 420 px on the world poster and 160 on US & Canada; a name starts at 97% of the most that fits and gives up at most 10% for centring; the same words on one line beat two lines when at least as big — Berel Lazar, ~300 px on one line across Russia).
  Long non-personal names (UK leadership) break into balanced lines.
- `ONLY=id,id WHY="Name" node scripts/export-svg.mjs 3600 world-names` renders just some shetachim and says why spots
  were refused — a full render takes ~5 min. `node scripts/svg-png.mjs [file.svg]` makes the PNGs (Chromium).

## Hebrew (Oct 1)
The whole site in Hebrew, the way a Chabad person in Israel would say it: the header button (עברית / English) reloads
with `?lang=he` (remembered); the page goes right to left, Heebo for Hebrew letters. Names come from `web/data/he.json`,
built by `node scripts/build-hebrew.mjs` (run after `npm run build`; it stops and lists anything without a Hebrew name)
from the hand-written lists in `data/hebrew/`: `shetachim.json` (name, short forms, head shliach, headTitle הנהלה),
`areas.json` (every state/country code; from Natural Earth's Hebrew names, fixed by hand), `cities.json` (map cities,
centers' towns, capitals' towns). Israel's shetach is "ארץ הקודש", the view "ארץ ישראל"; Judea and Samaria stays Israel.
Centers show chabad.org's own Hebrew name where it has one (920 do); the rest (and capitals) from
data/hebrew/centers.json, translated by hand; center types are translated in the page (`HE_TEXT`). A town two places
share is keyed "Name|REGION" in data/hebrew/cities.json (Naples|US-FL נייפלס vs Naples נאפולי). The Hebrew surname
(`lastName`, for "<name> family" lines; שם טוב is two words) is worked out by the English name's word count. The name SVGs have Hebrew copies (`world-names-he`, `na-names-he` in
export-svg.mjs → `*-he.svg/png`, on the download page): Heebo outlines, drawn right to left (`visual()`).

## PERSONNEL — collected Oct 3, NOT YET BUILT (do this next)
- `data/raw/chabad-personnel.json` is in (commit `9077cb8`): all 4,220 chabad.org centers checked, 0 errors;
  3,764 have personnel listed (3,734 with at least one living person). Format:
  `{ meta, personnel: { "<centerId>": [{ title, firstName, lastName, position, isDirector, isDeceased }, …] } }` —
  exactly what `scripts/build-data.mjs` (~line 1118) already reads; no code changes needed.
- **chabad.org's API is reachable from the sandbox now** (the site's HTML pages still get a Cloudflare challenge, but
  `/api/v2/chabadorg/centers/<id>?format=jsonapi&lang=en` answers 200). So `node scripts/chabad-personnel-fetch.mjs`
  (commit `d93b393`) collects it straight from Node in ~4 minutes: one request per center, 4 at a time, pausing on
  429s, resumable from the output file. The browser collector (`chabad-personnel-scrape.js`, `web/personnel.html`)
  is no longer needed. Its batch guess doesn't work: the list endpoint ignores `filter[id]`/`filter[ids]` (returns all
  4,220) and carries no relationships or `included`, so personnel is only per center.
- Merged into `claude/bold-albattani-aqfnj9` and built (Oct 3); the cards follow the owner's rule (see "Shluchim on
  center cards" above). `web/personnel.html` was removed (the Node fetcher replaces the browser collector).

## LUBAVITCH (Oct 5, the owner: "something honorary for the original Lubavitch")
- At Lyubavichi, Smolensk region (54.8352, 30.9632): a small dot and the name *Lubavitch* in italics, as maps mark a
  historic place; card (owner, Oct 7): a really big "Lubavitch" as the heading, then "Seat of the Rebbeim, 1813–1915" under it (he took out the "Birthplace of Chabad-Lubavitch" kicker); under a divider, as a center listing of its own (normal center size, not the heading's; `LUBAVITCH_CENTER_PEOPLE`, Heritage center · Lubavitch (owner, Oct 7: it isn't a Chabad house), Gavriel Gordon · Director): Hatzer Raboteinu Nesieinu B'Lubavitch (חצר רבותינו נשיאינו בליובאוויטש, opened 2008 near the graves), shliach Gavriel Gordon (owner, Oct 7; not on chabad.org's locator), in the special card like 770's (accent border and kicker) — he rejected every wording Claude made up, so ask him before changing it. Shown in every world view even with
  capitals off, its name placed before any city's (`honor: true` in the page's capitals list; `HONOR_MARK`).
  The owner rejected a gold ring and a card with a paragraph of history ("AI generated") — keep it understated.
  Keep it in the map-engine rebuild.
- Never Syria (Oct 5: "ridiculous", hardly any Jews there).

## CARD WORDING (Oct 5)
- A family at the head (Alevsky, Pinson, Blumenfeld): "Shluchim: Alevsky family" (שלוחים:) — keep the "Label: name"
  form; the owner rejected "Led by the Alevsky family" (a sentence, no colon).

## PERFORMANCE (Oct 5) — keep it this way
- The owner: panning and zooming the physical map was "so so bad" (low FPS). Causes: names were rebuilt from scratch every
  120 ms while moving (all texts, tspans and city marks recreated), new zoom-step layouts (200–500 ms) ran mid-gesture,
  and MapLibre drew at the phone's full 3x pixel ratio. Now: keyed joins keep existing labels and marks while moving,
  `moving` holds new layout work until the map is still (150 ms after moveend), live refresh every 250 ms, pixelRatio
  capped at 2, 3D buildings off. Don't reintroduce per-frame DOM rebuilding.

## NEW MAP ENGINE — web/next.html (Oct 5, in progress; web/index.html is still the main page)
- The owner asked for the map to feel like a real map site, not a custom project. next.html runs on MapLibre GL with
  OpenFreeMap's liberty style. Names, cities and capitals are the engine's own symbol layers, each name pre-sized per zoom
  (s0..s14) at its area's pole of inaccessibility.
- PHYSICAL: **no shetach tints or fills at all** (owner, Oct 7: the tints made it "look like a political map"; it must be a
  proper physical map: the land's own greens, deserts, relief). Shetachim show only as purple cased borders that fade out by z12. **The thin maritime line stays** (`st-line-coast`:
  every open edge, so the coasts and, where an area reaches over the water, the international line in the Great Lakes;
  it went missing Oct 5 and the owner noticed Oct 7).
  **Tinted** (fourth map, owner Oct 7): the physical map with the soft shetach tints, for whoever wants it.
  Map switches are instant: names of the other way of drawing are worked out in idle time (`warmNames`), label
  outlines are thinned to ~500 points a ring (`partsOf`), and there is no held picture of the old map (`preserveDrawingBuffer` off; owner: the freeze "should not exist"). The map's
  own boundaries and city names stay. Don't go back to ink lines or a fade drawn over the map ("custom low quality lines").
- PROJECTION: the owner hates Mercator. He chose "flat when zoomed out only", with Natural Earth (or Robinson), NEVER
  Equal Earth. The political map's world and continent views are in Natural Earth, centred on the view's `lon`:
  shapes are projected with d3 and handed to the engine as the lon/lat Web Mercator would draw at that spot
  (`flatFor`, `projGeom`, `P`). Country views (USA, Canada, US & Canada, Israel) and the whole physical map stay
  standard, because the physical imagery only comes in Web Mercator.
  NE_SCALE = 0.075 keeps the flat world small inside the engine's world, because the engine won't zoom out past its
  world filling the screen (a phone's height too) and we need room to fit the map beside the panel.
- MAPS (Oct 6, the owner's design after rejecting a snap, a bending morph and a corner button; Tinted added Oct 7): Map:
  Political | Streets | Physical | Tinted.
  - Political: our own drawing, Natural Earth where the view has it (world, continents), standard for country views.
    No street map, and only 5 zoom steps in from the framed view (POLITICAL_DEPTH).
  - Streets: the shetachim over the street map, standard, all the way in.
  - Physical: terrain.
  - Never switch projection on your own. Changing maps is instant (no snapshot).
- **Alaska and Hawaii boxes** (political map; restored Oct 7, the new engine had dropped them): USA view, Alaska and
  Hawaii in boxes off the south-west, as the old page had (`boxedFor`, `INSET_DEF`, a third set `boxed` per view: the
  standard projection outside the boxes, each boxed state in its own conic projection; areas, lines, land projected
  piece by piece, points by `near`). "Alaska: In a box / In place" (More options, USA view only). **US & Canada: Alaska
  stays attached to BC in its place** (owner, Oct 7), only Hawaii boxed; framed from 180° so mainland Alaska is in view.
  The street and physical maps always have them in place.
- BLUE SEA option (More options): off gives a quiet grey sea, on the political map only.
- **Land outside the view / no shetach** (political, owner's first rule; fixed Oct 7, the new engine had drawn every
  country as ordinary land: Greenland, Antarctica, Canada in the USA view): faded (`land-all`, 40%) under the blue sea, not
  drawn at all on the grey sea; full grey with its borders only with Rest of the world.
- NAMES ON THE NEW ENGINE (Oct 7):
  - A name sits where its whole box fits biggest inside its area (`fitBox`), as near the middle as possible, at most
    10% smaller for being central. That replaced the circle rule, which left names off-centre and too small in long
    shapes.
  - Split shetachim: big pieces (a tenth of the biggest or more) that OTHER LAND keeps apart each get the name (Lower
    Balkans: Bosnia and Albania-to-northern-Greece, the "Kaplan problem"). Pieces only water keeps apart (Michigan)
    share one name (`landBetween`).
  - MapLibre evaluates zoom in filters at WHOLE zoom steps, so a name may show from the whole step before it fits,
    a touch small. A short form stays on behind the full name, at the same spot, so there's never a gap.
  - Political zooms 7 steps in.
  - A shetach's own name is always drawn (`names`, text-allow-overlap): the engine's collision boxes are sized for the
    next whole zoom, so neighbours hid each other (BC under Alberta, Labrador). Short forms and repeats (`alt`) are a
    separate layer under it and give way.
  - Before porting anything else, re-read the rules in this file: the old page's rules carry over.
- LANGUAGE SWITCH (Oct 7, the owner: "should be seamless"): no reload. Every name holds both languages through
  `dual(obj, field, he)`, a getter that reads `HE`. `setLanguage()` loads he.json the first time Hebrew is asked for,
  plus the RTL plugin. It then swaps the page words (`pageWords`, which remembers each text's English), flips
  dir/lang, and works the map names out again. Never mutate names in place again.
- HEBREW STREET MAP: places, seas and sights show only with a Hebrew name; street names keep their signed name.
- Small islands are kept down to 3 km² (build `-filter-islands`). At 40 km², Agios Efstratios and Bozcaada showed
  uncoloured on the street map.
- Oct 7: the new map IS the main page now (web/index.html). The old D3 page is kept at web/old.html; web/next.html just forwards to the main page. Edit web/index.html from now on.

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
  fade meets the shetachim exactly; Gaza (the part Israel doesn't hold, since Oct 7) is outside land named "Gaza". Place names in English/Latin letters.
- **Borders snapped together**: `cleanLand()` runs mapshaper `-clean gap-fill-area=20km2` on all land before the union.
  India–Nepal had ~1,500 km of slivers/double lines (the "horrendous" border), US–Mexico too; now 0. **Never add
  `snap-interval`**: tested at 30 m–200 m, it moved whole counties/countries (Texas→Chihuahua, Nepal→India, Finland
  vanished). Still open: a few seams that open onto the sea at one end aren't "gaps" to -clean (Tijuana/San Diego
  coast, Belgium–France coast; `scratchpad` scan listed them) — small, but worth a targeted fix.
- **Labels** (`placeLabels` / `placeOne` / `labelGrid`, rebuilt Oct 1 after the owner's "Carib." and tucked-away
  "KS-MO" complaints): each area gets a grid over its hull on screen (≤60×60 cells): own land, water inside the hull
  (a name may cross a gulf or strait), or blocked (another area, outside the hull, off screen, under the panel, a
  capital's star, a name already placed). Summed-area tables answer "is this box clear" in four lookups; a distance
  transform prunes centres. **Form**: the full name at the biggest size it fits (two lines if ≥15% bigger), else the
  other way of setting it, else each short form in turn; head-shliach mode has no short form. **Size**:
  what the area's land on screen calls for (`capFor`: 5 + 0.14·√area px, 9–36 px on phones, 9–46 on desktop), and no
  more than 88% of the most that fits (`BREATHE`), so names aren't pressed against edges; never under 9 px (8 for
  short forms). **Place**: most room on every side (up to ~1.4 letters), near the visible part's centre of mass, on
  land rather than water; then an exact check against the borders. Island chains (land < 35% of hull, no piece over
  60%: the Caribbean, Indonesia) aim at the hull's centre and size for the spread. Biggest areas on screen go first.
  **Fixed like a map site** (Oct 2, the owner: names changing as you move "should be the same way … Google maps"):
  names are laid out once per zoom step (`levelLayout`, two steps per doubling) over the whole map, not over what's on
  screen; panning only slides them. Oct 3 ("names only render when you load that part"): names (and city names, stars)
  are kept a full screen beyond every edge (the screen clips them), refreshed every ≤120 ms while the map moves
  (`livePlace`), names keep their size during a zoom, and the zoom steps either side are worked out in idle time
  (`prefetchLevels`), so nothing pops in when the map stops. Only the Alaska/Hawaii boxes hide names; the panel just
  covers them. A shetach bigger than a screen repeats its name in a fixed grid of tiles (`levelRepeats`,
  tile 0.6× the screen's short side, ≥340 px; repeats at least the screen's long side apart, so a name never shows twice on one screen — Oct 3, the owner's
  phone showed Western Pennsylvania twice), worked out as tiles come into view and kept.
  The cache resets when labels are rebuilt (mode, borders, language, resize). `labelAt` on a shetach: the spot its name
  aims for on the page too (India: [78.9, 21.6], mid mainland). During a zoom names scale smoothly (`fontScale`) and
  the step's layout replaces them when it ends (~50–250 ms headless desktop for a new step).
- **Shluchim on center cards — the owner's rule** (Oct 3; `personnelHTML` in web/index.html): the shliach shown is the
  first man listed who's alive — a woman listed first, or a man who has passed away (obm), is passed over. With no
  living man: if a man listed has passed away (her husband), "<last name> family" from the living woman (she's still listed by name under "+more"); if only women
  are listed (e.g. Mrs. Chana Axelrod's mikvah in Ukraine), the first woman by name (owner, Oct 3). Everyone else alive goes under "+N more"; anyone who has
  passed away in a separate "Deceased" (נפטרו) section, each name followed by obm / ע״ה (obm goes after a name,
  never as a heading). Men/women by chabad.org's title (Mrs., Ms., Miss,
  Rebbetzin = women). Names are shown without titles (no "Rabbi"). Data: `data/raw/chabad-personnel.json` (chabad.org `/api/v2/chabadorg/centers/<id>` personnel;
  lubavitch.com/centers/<id> has the same names) — collected Oct 3 (3,764 of 4,220 centers), re-fetch with
  `node scripts/chabad-personnel-fetch.mjs`.
- **India** (Oct 3, the owner: "India has a lot more Chabad centers than the locator"): Chabad houses not on chabad.org in
  `data/extra-centers.json` (`extra-india-*`), from Chabad of India's own directory (indiakoshertravel.com/Chabad_india;
  blocked here — the owner sent its pages): New Delhi Main Bazaar (Akiva Sudri), South Delhi (Shneor Kupchik), Pushkar,
  Manali, Kasol, Rishikesh, Hampi, Varanasi, Goa (Palolem; Anjuna at the town), Pune, Kodaikanal, Kasar Devi — each with
  its rabbi (`personnel`, shown on the card like chabad.org's) and address where given. Kochi (Jew Town) from
  chabadcochin.com. Gokarna and the Andamans were left out: no current evidence of a center. Mumbai, Dharamsala and
  Bengaluru are chabad.org's own. Many Asian Chabad houses are seasonal; not marked, like chabad.org's.
- **Cities with shluchim** (build-data `buildCities`): a center town that GeoNames doesn't have by that name is matched,
  Oct 3, to a place spelled nearly the same within 8 km (keeping chabad.org's spelling: Be'er Sheva, Petach Tikva),
  else to the 500,000+ city within 10 km it's a neighbourhood of (Jabi → Abuja, Victoria Island → Lagos, Capital
  Federal → Buenos Aires, Praha 1 → Prague). Unmatched went from 434 to ~315 (small Israeli towns mostly; they still
  show by their centers, 5,000 "people" per center). `CITY_NAMES` keeps the Chabad houses' spellings (Kishinev,
  Cologne, Gothenburg).
- **Ukraine's towns** use the names the Chabad kehillos there use, the Russian ones (Oct 3: Kiev, Dnepr, Lvov, Kharkov,
  Zaporozhye…): `UA_NAMES` in build-data renames both the centers' towns and the GeoNames cities, so Kyiv/Kiev and
  Dnipro/Dnepropetrovsk are one city each. Except Khmelnytskyi, which keeps its modern name (the owner: its kehilla uses it).
- **City names, Google-style** (Oct 3): a city is a dot with its name beside it until it's big on screen, then the dot
  goes and the name sits on the city (bolder, `.mk-lab-big`; above its star if it's a capital). Size from population
  (`cityKm`: 0.012·√pop km, 1.5–30 km; no outlines), big from a 22 px half-width (`BIG_PX`) — in `placeMarks`.
- **Dots** (More options → Dots / Dot color, Oct 3): **Solid** (default; small — radius 1.05 + 0.35·log2(centers) at the
  framed view, the owner wants them small — opaque, with a thin edge so a cluster reads as a cluster), **See-through**
  (same, 42% like classic), **Classic** (the first dots: bigger, navy, 42%). Colour for solid/see-through: Navy
  (default since Oct 3, the owner), Gold, Red, Black, Green, Purple (`DOT_COLORS`: light and dark-map shades; dark edge under gold, white
  under the others, the background on the dark map; `setDotColors` puts them on #app).
- Defaults: **World view, Political map** (Oct 2, the owner); the physical map loads quietly in the background right after, so picking it is instant.
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
  carried on through the water: across Lake St Clair straight to the St Clair River where its last bend south-west
  begins (-82.518, 42.618) (owner, Oct 7: ending at the South Channel elbow still made a V, "pointy"; this way the
  river and the lake line run on nearly straight, and the delta's western islands, Walpole Island, go with Essex; he
  had earlier rejected ending at the channel's mouth, a sharp spike of Ontario), and across Lake Erie due south to the international boundary. Essex takes the Canadian water on its side
  (Detroit River, Lake St Clair west of that line, western Lake Erie with Pelee Island); past the boundary the shape
  runs on over US ground, which a shape never cuts (only CA-ON's land). The river point is read off the built map
  (`web/data/geo.json`, the Ontario / Michigan arc); if the land data changes, check it's still on that border.
  The shape's `"lakeEdges": true` marks the piece's open edges (the international line round Essex's water, Michigan's
  on both sides) as lake edges, `lk` in the tiles: the physical map draws them only in States/Both border modes, not
  as a maritime line (the owner circled them as not fitting the new borders). The political map and SVGs still
  outline the water's colour there, like the rest of Ontario's lake water.
- **Alberta** now also takes the Northwest Territories and Yukon south of 63°N (name stays "Alberta"; shape
  `data/shapes/north-to-63.geojson` cuts both territories; what is north of 63° is left off the map like Nunavut (`notShownWhenBlank`),
  `notShown`). New panel option **Alaska: In a box / In place** (political map, views with Alaska; default box; the physical
  map is always in place). The page is titled **Chabad Shetachim** (was plain "Shetachim").
- Alberta's name is centred on Alberta proper (`labelState: "CA-AB"` in the data), not the territories' strip, while Alberta is on screen (>500 px²).
- Alaska/Hawaii boxes (political map): on a phone the map is framed above the *closed* bar plus a strip for the boxes (opening the sheet never moves the map; names re-place around it); the boxes fade out once zoomed in (Oct 5, the owner was confused by the shrunken ones left on top of the map) and come back at the whole view, have a solid background, and names/cities keep clear of them.
- Panel: Show has only World up front; the other views (Europe … Canada) are under "Regions & countries" (`#views`, collapsed by default; owner, Oct 7). Then Map, Borders, Labels; **More options** (a collapsed `<details id="more">`) holds the Chabad centers / cities / capitals checkboxes, Alaska, Colors. New rarely-used options go there.
- **Upper Midwest** (owner, Oct 1): North and South Dakota joined Minnesota under Moshe Feller; the shetach is now
  "Upper Midwest" (id `upper-midwest`, territory US-MN, US-ND, US-SD). The North Dakota (Yonah Grossman) and South
  Dakota (Mendel Alperowitz) shetachim are gone.
- **Short labels** (owner, Oct 1): every shetach has short forms, a list from longest to shortest (`short` in
  `data/shetachim.json`: `["Carolinas", "Car."]`), so something fits when zoomed out; the page tries the name, then
  two lines, then each short form, shrinking to 85%/70% (short forms also 55%, never under 7px); a full-size short
  form beats the name at 70%, so neighbours stay similar sizes. State codes are never joined except KS-MO and MB-SK
  (owner's choice). Countries use atlas-style abbreviations (Neth., Switz., Bulg.; never ISO codes). A single whole
  state defaults to its own code (TX); the build warns if a form isn't shorter than the one before it.
  Renamed: "The Virginias" → **Virginia** (VA), "Western and Southern New England" → **Connecticut** (CT; territory
  unchanged: Connecticut plus its western Massachusetts counties).
- **Font**: Inter everywhere (map labels 700, letter-spacing .01em; panel headings uppercase small labels), from
  Google Fonts; replaced Alegreya Sans (SC), which the owner disliked. `scripts/screenshot.mjs` serves Inter from
  `node_modules/@fontsource/inter` since Google Fonts is blocked in the sandbox.
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

- **Ohio** (owner, Oct 1; done by the session on the other account, branch `ccr-1f9385a8-jca1nj`): four regions
  from the owner's own map (`data/ohio-regions-v2.geojson`, kept verbatim; picture: estimated curved borders, not
  county lines). Oct 1 they were switched to whole counties ("I hate the roundness"); Oct 2 the owner rejected the
  county staircase ("just makes it look bad") and wanted the original back with straight-ish lines: the shapes in
  `data/shapes/ohio-{toledo,northeast,central,southern}.geojson` are the original map's regions with each inner
  border straightened — Toledo's (Michigan's) whole southern border is one due east–west line (41.03°N, parallel to the Michigan line) from Indiana to the
  Northeast corner (owner, Oct 3: "properly straight", not the diagonal first tried), its border with the Northeast runs due north from that corner to the lake, west of Port Clinton
  (so the Marblehead peninsula isn't cut off on Toledo's side), the Southern–Central border is one straight line; the
  lines are carried out past Ohio's outline so every bit of shore and island falls cleanly on one side, the
  Central–Northeast border a few straight segments that keep Central's big bulge east into the Alevsky shetach (made
  by straightening the shared lines and re-tiling; no center changes region vs the original map). Regions: **Northeast Ohio** (`northeast-ohio`, "Alevsky family"; Cleveland, Akron,
  Youngstown, Canton, east and south to Athens and Marietta), **Central Ohio** (`central-ohio`, Areyah Kaltmann;
  Columbus, south to Portsmouth/Ironton), **Southern Ohio** (`southern-ohio`, Sholom Ber Kalmanson; Cincinnati,
  Dayton, Springfield, Lima), and the **Toledo area joins Michigan** (Berel Shemtov) as part of the `michigan`
  shetach. The owner let us pick "Northeast" over "Northeastern". The four shapes tile Ohio exactly (union is one
  piece plus the Lake Erie islands; within 0.4% of Census Ohio); only their lines through Ohio are used, Ohio's own
  border and shore stay Census. Two Lake Erie islets the shapes don't cover (Rattlesnake, West Sister) go to the
  nearest region (`ISLAND_KM` = 25 in `absorbSlivers`; only for unclaimed islands in a state cut by shapes).
  Ohio's centers: NE 27, Southern 7 (with the office below), Central 4, Toledo/Michigan 3. First called "Western Ohio";
  the owner renamed it **Southern Ohio** the same day. Capitals (owner): Chabad of Cleveland (117708), Chabad of
  Columbus (117950, listed in New Albany), and **Chabad of Southern Ohio's office, 7380 Laurel Oak Lane, Amberley
  Village** — not on chabad.org, so it's in `data/extra-centers.json` (`extra-chabad-southern-ohio`), placed from
  Overture Maps' address data (39.20176, -84.44424). Geocoders are blocked here, but Overture's public S3 bucket
  (`overturemaps-us-west-2`, `theme=addresses`) is reachable: read parquet footers over HTTP range requests and fetch
  only the row groups whose bbox stats cover the spot (pyarrow in a venv; ~1 minute).

- **Refresh button** (owner, Oct 1: reloads often showed the old map — GitHub Pages and browsers cache for ~10 min):
  the circular-arrow button under the zoom buttons reloads the page as `?v=<time>`; with `?v=` in the address every data
  file and map tile is fetched with the same `?v=` (`fresh()` in the page), so nothing comes from a cache. Any new
  fetch of site files should go through `fresh()`.

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
  - Ukraine / Crimea: Crimea and Sevastopol (GADM UKR level 1) → Crimea. (Since Oct 7 Crimea and occupied Ukraine are
    Lazar's: see "OCCUPIED UKRAINE AND CRIMEA" at the top.)
  - **Israel = one area**: Israel, Judea and Samaria (the West Bank) and the Golan Heights, as the list says. GADM's
    Israel file already includes the Golan and East Jerusalem is in the Judea and Samaria region; the build takes that
    region from its GADM file and makes it **part of Israel itself** (state `ISR`, name Israel, no line between them in
    any border mode). Gaza isn't in the list; since Oct 7 the part of it Israel holds is drawn as Israel, and likewise its
    held parts of southern Lebanon and Syria (see "ISRAEL'S HELD GROUND" at the top). **The owner is emphatic: Judea and Samaria is Israel — never
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
- Labels: shetach name / head shliach / off (no last-name mode, owner Oct 7).
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
9. 770's card title is large and prominent like Lubavitch's (`honor-h`, owner Oct 7: the headquarters of the whole movement). 770 is the world HQ, not a regional flagship under whoever heads New York City's shetach. Its card
   doesn't say "New York City · Tzach" the way a normal capital's does (`capitalHTML` in `web/index.html`
   passes `withHead: false` to `shetachLine` for it) — keep that distinction if the card is reworked.

10. **Judea and Samaria is Israel**: never any other country name or ISO code for it anywhere in the project, not
    even in code, data, comments or commit messages. Israel is one area: Israel, Judea and Samaria (the West Bank) and the Golan Heights, no line between
    them, with the parts of Gaza, southern Lebanon and Syria it holds (Oct 7). The owner reacted very strongly to seeing it even as an internal code.
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
  - Labels: Shetach name (default) / Head shliach / Off. Each label is centred inside its
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
    `scripts/chabad-personnel-fetch.mjs` (Node, since Oct 3 — see PERSONNEL above), or the older
    `scripts/chabad-personnel-scrape.js`, run by hand in a browser console: paste it on a chabad.org tab, it downloads `chabad-personnel.json` when done (it's
    slow — one request per center, rate-limited by the site — and resumable if stopped partway).
    Drop the file at `data/raw/chabad-personnel.json` and rebuild. The collector tries a batch request first (`filter[id]=…&include=personnel`, 50 ids;
    untested against the real site — blocked here) and falls back to 4 parallel single-center requests. If `chabad-centers.json` is ever
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
    specific claim wins where they overlap. Unclaimed areas are blank (none left in the US since Ohio, Oct 1).
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
  Extras run in order: `go=lon/lat/zoom` puts the new engine's camera there (`window.__dbg.go`); the "console Error
  … Failed to fetch" lines in every view are the test's blocked openfreemap tiles and fonts, not page errors (checked
  Oct 7). `zoom=x/y/k` zooms the old page's political map k× about screen point x,y; to see the physical map at the
  same spot, zoom on political first and then `base=physical,wait=9000` (it takes the political map's camera; the
  test uses MapLibre's demo style, so the base colours aren't the real ones, but our lines and labels are).
- This cloud sandbox's network is limited: GitHub (`raw.githubusercontent.com`, and anonymous
  `git clone` of any public repo) and the npm registry work; census.gov, geonames.org, chabad.org,
  gadm.org, geoboundaries.org, Overpass and Geofabrik, cdnjs, jsdelivr, unpkg, openfreemap.org and github.io
  are blocked (checked directly, not assumed; the OSM API and Nominatim are reachable since Oct 7). That's why counties, towns and tracts come from the
  Census Bureau's GitHub (`uscensusbureau/citysdk`, `v2/GeoJSON/500k/2022/…`), Canada's provinces
  from a plain-file GADM mirror on GitHub, and cities from npm. If a source is only on GitHub via
  Git LFS (`git-lfs.github.com` pointer files instead of real content when fetched anonymously —
  geoBoundaries' own repo is like this), it can't be read here either. The owner's browser reaches
  all of these; the real OpenFreeMap tiles can't be seen from here. The environment's network
  policy (cloud environment menu → Edit, in the session's title bar) can be widened to a specific
  host if a source is worth reaching directly next time, or the owner can download a file and hand
  it over the way `data/raw/chabad-personnel.json` works.
- Before every push: syntax-check web/index.html's scripts and load it headless — a `// comment` inside a one-line
  template expression once blanked the whole site (Oct 3).
- Testing: headless Chromium is at `/opt/pw-browsers`, and the global `playwright` package is
  installed. Chromium doesn't trust the proxy CA, so serve the repo with `page.route`, answer
  cdnjs URLs from local npm copies (`npm install d3@7.9.0 topojson@3.0.2 maplibre-gl@4.7.1` in a
  scratch folder), and fetch anything else with `curl` inside the route handler. OpenFreeMap
  (`tiles.openfreemap.org`: the style, tiles, sprites, fonts) is reachable now (Oct 8): scripts/screenshot.mjs
  fetches it for real (`DEMO=1`: MapLibre's demo style, as before it was). WebGL needs `--use-angle=swiftshader
  --enable-unsafe-swiftshader`.
  Never disable TLS checks.
- Check a desktop (1400×860) and a phone (390×844) viewport, in light and dark, after changes,
  in both Political and Physical.
- Keep the fade's GeoJSON source at `tolerance: 0`: with MapLibre's default simplification, its
  holes break in some tiles and cover parts of the shetachim.

## Oct 7 (owner)
- **City names Google-style again** (the old page's rule, lost in the new engine; owner Oct 7): a dot with the name beside
  it until the city is big on screen (half-width 0.012·√people km, 1.5–30 km, at 22 px), then no dot and a bold name on
  the city (`cities-big`; a capital's above its star), until zoom 13.5 (`CITY_NAMES_END`), where the street map's own
  names take over (no lone town dot over the streets).
- **Towns named on every map (political, streets, physical) are only ours: towns with a center.** The street map's own
  city/town/village labels are hidden; its other place labels (neighbourhoods) only from zoom 13.
- **Hebrew: English-style nicknames are written as the proper name** (data/hebrew/first-names.json and the head
  shluchim): Mendy → מענדל, Zalmy → זלמן, Benjy → בנימין, Moishy → משה, Mordy → מרדכי, Hershy → הערשל, Laivy → לייב,
  Getzy → געצל, Avremi → אברמל, Shuey → יהושע, Effy → אפרים. Nicknames Hebrew uses itself stay (יוסי, פיני, חזקי, שמולי, קוטי,
  and women's names like מושקי, חני).

## AUDIT (Oct 7) — the new engine checked against every rule above and the old page
Found and fixed: Isle of Man not drawn; Kaplan/Lower Balkans names; physical map tinted like a political one (now
Physical + a separate Tinted); the Great Lakes maritime line gone from the physical map; the political map drawing every
country as land (now faded / gone, the first rule); Alaska and Hawaii boxes gone; neighbours' names hiding each other
(BC, Labrador); a frozen picture on every map switch; town labels without centers; English box captions in Hebrew.
Checked and as the rules say: cards (770, families, Leadership, Overseen by, Disputed capitals), India dashed border
and secondary name, Alberta and Western Pennsylvania placement, data rules (no Syria, Suriname/French Guiana blank,
Cambodia, Mongolia, Isle of Man), dark theme (physical stays light), Hebrew panel and names, phone panel.
Known differences left as they are: fewer town names at the framed views than the old page (the engine shows a town
only where it has room); capital stars a little smaller; Hebrew India name lighter and smaller but not slanted (the
engine can't slant Hebrew); Victoria's disputed name doesn't fit at the Oceania view (the old page didn't fit it either).

## SWEEP 2 (Oct 7) — automated card check (5,963 cards × English/Hebrew), every view × desktop/phone, every option
Fixed: Hebrew area cards' "Capital:" line was English (they read the raw data, not the bilingual capitals); Friendship
Circle; two mixed-language chabad.org names (now from data/hebrew/centers.json); continent views' faded land had
spikes where the far-side seam cuts land (land across the seam is left out there, `crossing`); the language button
lost every other tap while the first switch loaded (taps now queue); PNG posters were stale since Oct 3 (run
`node scripts/svg-png.mjs` after every `npm run svg`); Zoom in on Alaska in US & Canada zoomed out to the world.
English cards: 0 problems. Hebrew cards: only acronyms left in Latin letters (UCLA, MIT, SUNY, JRCC, RARA…), on purpose.
**Gaza (owner, Oct 7): Israel's edge there follows the ground Israel actually holds now**, not the Gaza boundary. First
from OpenStreetMap's "Yellow Line" (way 1313327399) and "Orange Line" (way 1541663246) areas; since later on Oct 7 from
the owner's own IDF control map, like southern Lebanon and Syria: see "ISRAEL'S HELD GROUND" at the top.
