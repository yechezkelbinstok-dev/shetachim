# Shetachim map: plan

A custom political-style map where the "countries" are Chabad shetachim (the area under a
head shliach), not states or countries. Starting with the US and Canada, then the world.

The map shows shetachim and nothing else: no neighbouring countries, no areas outside any
shetach. A shetach can be one state or province, several of them, or parts of states cut along
county, town or longitude lines. Anything no shetach covers yet is left blank. Choosing a
country (USA, Canada) shows only that country.

## What the finished map does

| Feature | Status |
|---|---|
| Borders drawn by shetach, including merged states and split states | Done (57 shetachim entered) |
| Show only the USA, only Canada, or both, filling the screen | Done |
| Toggle to regular state/province/country borders | Done |
| Both at once, with either set drawn lighter (swappable) | Done |
| A faint dot for every Chabad center; listings at one address merged into one dot | Done |
| Label each shetach by head shliach, last name only, or shetach name, or no labels | Done |
| Zoom and pan (mouse, trackpad, pinch) | Done |
| Alaska and Hawaii in corner boxes | Done |
| Hover or tap a dot for the centers there, with links to chabad.org | Done |
| Cities that have shluchim (on/off), more appearing as you zoom in | Done |
| A capital for each shetach, drawn as a star (770 bigger) | Done |
| Physical map ("like Google Maps": land cover, relief, roads) with shetach borders | Done (needs the live site) |
| Ohio and the rest of New York | Blank until the owner sends them |
| Puerto Rico / USVI and other insets | Later |
| The rest of the world, with continent views | Later |

## Data

### Centers

- `data/raw/chabad-centers.json`: the chabad.org locator export, 4,220 listings, collected
  Sept 2026. Every center in the earlier sample API captures is in it.
- The export has name, city, coordinates, type and page URL, but no state or country.
  `scripts/build-data.mjs` works those out from the coordinates (Natural Earth countries and
  provinces, US Census counties), so each dot knows its country, state/province and county, and
  in a split state the piece it's in.
- Merging: listings at the same point, or within 25 m of each other (same building or campus),
  become one dot. 4,222 listings (with the 2 added by hand) become 3,599 dots; in the US and
  Canada, 1,967 become 1,763.
- Known chabad.org geocoding mistakes are listed in `data/report.md` (16 Israeli listings
  sitting on the country's midpoint, a few others). None are in the US or Canada.
- Centers missing from chabad.org go in `data/extra-centers.json` (now Riyadh and Istanbul).

### Cities

- Every US/Canada city with at least one center: 1,001. The build matches each to GeoNames
  (npm `all-the-cities`: places over 1,000 people) by name, in the same state, within 60 km, for
  its real point and population. chabad.org writes Saint/San/Santa/Sainte/South as `S.`; the
  build tries each. 81 have no match (neighbourhoods such as Tarzana or Thornhill, tiny places)
  and sit at the middle of their centers; `data/report.md` lists them.

### Shetachim

`data/shetachim.json`: one entry per shetach.

```json
{ "id": "western-pennsylvania", "name": "Western Pennsylvania", "headShliach": "Yisroel Rosenfeld",
  "territory": [{ "state": "US-PA", "westOf": -78.13 }, { "counties": ["54061"] }],
  "capital": { "centerId": "117721" } }
```

- `territory` items: a state or province code (`US-CA`, `CA-ON`, `US-DC`); part of a state east
  and/or west of a longitude (`{ "state": "US-MA", "eastOf": -72.1574, "westOf": -71.24694 }`);
  counties by 5-digit FIPS (`{ "counties": [...] }`); towns (`{ "state": "US-MA", "towns": [...] }`,
  Census county subdivisions); census tracts (`{ "state": "US-MA", "tracts": [...] }`, used for
  East Boston). Where items overlap, the more specific one wins: tracts, towns, counties,
  longitude lines, whole states. So "The Virginias" takes all of West Virginia, and Western
  Pennsylvania's Monongalia County claim cuts out the Morgantown area.
- Anything not claimed is blank (no fill, no label). `notShown` areas are left off entirely.
- `capital`: the center id from its chabad.org link (the build fills in the name and position),
  or `{ "name", "lat", "lon" }`; `"world": true` for 770.
- `short`: the label where the name doesn't fit. By default the abbreviations of its whole states and
  provinces joined (KS-MO, NS-NB-PE); a shetach with part of a state needs one (W. PA, NYC, N. Shore).
- `lastName` is optional; it defaults to the last word of `headShliach`.
- The build refuses unknown codes, counties, towns and tracts, and two shetachim claiming the same
  thing; a capital outside its shetach is listed in the report.

Easiest way to send changes: plain text, one line per shetach, such as
"State(s): head shliach, shetach name, capital", and for a split state which part goes where
(counties, towns, or a line). Claude turns that into this file, and the map shows the result.

Open questions:

1. Ohio and New York outside NYC and Long Island: which shetachim?
2. Co-heads, or a shetach whose head shliach has passed away: show two names, the
   successor, or the shetach name only?
3. Puerto Rico and the US Virgin Islands: show them (in corner boxes) and under which shetach?

### Boundaries

- Drawing: Natural Earth 1:10m states and provinces (Great Lakes cut out), in one TopoJSON
  (`web/data/geo.json`). Split states are cut with Census 2022 1:500k counties, towns and tracts
  and with longitude lines, keeping Natural Earth's outer edges (see HANDOFF.md for how).
- Tagging: Natural Earth 1:10m full detail plus Census 1:500k counties (2022).
- Maybe later: a more detailed level for close zoom (city scale) if 1:10m looks coarse there.

## Physical map

- MapLibre GL 4.7.1 (from cdnjs, loaded the first time "Physical" is picked) with OpenFreeMap
  vector tiles (free, no key; attribution in the corner), the `liberty` style in both themes.
- Natural colours are made stronger: the Natural Earth II relief raster (greens, desert tans,
  ice) at full strength out to state level, fading out by zoom 12; greener woods and grass.
- No political fills. The map's own borders and state/country names are hidden; our borders sit
  over the roads with a white casing; land outside the shown shetachim is faded (seas stay blue).
- It needs a real web host (GitHub Pages): a Claude artifact blocks the tiles, and the page then
  stays on the political map.

## World version

- Same pipeline with Natural Earth admin-1 for countries split between shetachim.
- Judea and Samaria: standard world maps file 48 listings there under "Palestine". The shetach
  layer is defined by us, and the regular-borders layer can use Natural Earth's Israel
  point-of-view borders.
- Continent views get their own projections (Europe, Israel, FSU, Latin America, Oceania,
  Africa, Asia) so each fills the screen.
- Label density is the main design work there (Europe, Israel).

## Build and run

```
npm install
npm run build        # rebuilds web/data/ and data/report.md
python3 -m http.server   # then open http://localhost:8000/web/
```

The page is static, so the repo is hosted as-is on GitHub Pages (from this branch, root folder).
The root `index.html` forwards to `web/`.
