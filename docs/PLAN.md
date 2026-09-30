# Shetachim map: plan

A custom political-style map where the "countries" are Chabad shetachim (the area under a
head shliach), not states or countries. Starting with the US and Canada, then the world.

The map shows shetachim and nothing else: no neighbouring countries, no areas outside any
shetach. A shetach is usually one state, so every state and province starts as its own
shetach, drawn and labelled like any other; entries in `data/shetachim.json` merge or split
them. Choosing a country (USA, Canada) shows only that country.

## What the finished map does

| Feature | Status |
|---|---|
| Borders drawn by shetach; several states or countries under one head shliach show as one area | Prototype (whole states) |
| Show only the USA, only Canada, or both, filling the screen | Prototype |
| Toggle to regular state/province/country borders | Prototype |
| Both at once, with either set drawn lighter (swappable) | Prototype |
| A faint dot for every Chabad center; listings at one address merged into one dot | Prototype |
| Label each shetach by head shliach, last name only, or shetach name, or no labels | Prototype |
| Zoom and pan (mouse, trackpad, pinch) | Prototype |
| Alaska and Hawaii in corner boxes | Prototype |
| Hover or tap a dot for the centers there, with links to chabad.org | Prototype |
| States split between shetachim (by county) | Next: needs county geometry, see below |
| Puerto Rico / USVI and other insets | Later |
| The rest of the world, with continent views | Later |

## Data

### Centers (done)

- `data/raw/chabad-centers.json`: the chabad.org locator export, 4,220 listings, collected
  Sept 2026. Every center in the earlier sample API captures is in it.
- The export has name, city, coordinates, type and page URL, but no state or country.
  `scripts/build-data.mjs` works those out from the coordinates (Natural Earth countries and
  provinces, US Census counties), so each dot knows its country, state/province and county.
- Merging: listings at the same point, or within 25 m of each other (same building or campus),
  become one dot. 4,220 listings become 3,597 dots; in the US and Canada, 1,967 become 1,763.
- 544 listings have no exact address on chabad.org and sit at their city's centre point.
  The dot card says so.
- Known chabad.org geocoding mistakes are listed in `data/report.md` (16 Israeli listings
  sitting on the country's midpoint, a few others). None are in the US or Canada.
- Centers missing from chabad.org go in `data/extra-centers.json`. The repo is public, so any
  that should stay quiet go in `data/extra-centers.private.json` instead, which git ignores.
  The build writes those to `web/data/centers.private.geojson` (also ignored) and the page
  loads it when present. Private entries are placed at city level only.

### Boundaries (done for the prototype)

- Drawing: Natural Earth 1:10m states and provinces (Great Lakes cut out), simplified with
  mapshaper into one TopoJSON (`web/data/geo.json`). Only the US and Canada are included, minus
  the areas in `notShown` (Yukon, Northwest Territories, Nunavut).
- Tagging: Natural Earth 1:10m full detail plus Census 1:500k counties.
- Next: for split states, draw the US from Census counties (and Canada from StatCan census
  divisions if a province is split). Shetach borders inside a state then follow county lines.
  Snap the US-Canada seam with mapshaper so the two sources meet cleanly. Add a more detailed
  level for close zoom (city scale) if 1:10m looks coarse there.

### Shetachim (needed from you)

`data/shetachim.json`: `notShown` lists areas left off the map, and `shetachim` has one
entry per shetach that isn't simply one state (a merge), or whose head shliach is known:

```json
{ "id": "west-coast", "name": "West Coast", "headShliach": "Shlomo Cunin", "territory": ["US-CA", "US-NV"] }
```

- Any state or province not in an entry is its own shetach, named after the state.
- `territory` uses ISO codes for whole states and provinces (`US-CA`, `CA-ON`, `US-DC`).
- Split states will list counties by FIPS code, plus a "rest of the state" entry: one
  shetach takes the named counties and the other takes, say, `rest:US-XX`.
- A split that doesn't follow county lines (part of a county) gets a hand-drawn boundary.
- `lastName` is optional; it defaults to the last word of `headShliach`.
- The build refuses unknown codes and areas claimed by two shetachim.

Easiest way to send it: plain text, one line per shetach, such as
"State(s): head shliach, shetach name", and for a split state which part goes where (counties,
cities, or a rough line). Claude turns that into this file and the county lists, and the map
shows the result to check.

Open questions:

1. Co-heads, or a shetach whose head shliach has passed away: show two names, the
   successor, or the shetach name only?
2. DC: its own shetach or part of a neighbour's? Puerto Rico and the US Virgin Islands: show
   them (in corner boxes) and under which shetach?
3. New Brunswick and Prince Edward Island have no listed centers: part of a neighbouring
   shetach, or left off like the territories?

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
cd web && python3 -m http.server   # then open http://localhost:8000
```

The page is static (D3 + TopoJSON from cdnjs), so `web/` can be hosted as-is, e.g. on
GitHub Pages.
