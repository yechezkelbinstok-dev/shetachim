# Shetachim map

An interactive map of Chabad shetachim (regions under a head shliach), with borders drawn
by shetach rather than by country/state, plus a faint dot for every Chabad center.
Starting with the United States and Canada. See [docs/PLAN.md](docs/PLAN.md).

## Layout

- `web/index.html`: the map (static page, D3 + TopoJSON). Data it loads is in `web/data/`.
- `data/shetachim.json`: the shetachim: name, head shliach, territory.
- `data/raw/chabad-centers.json`: every center from the chabad.org locator (Sept 2026).
- `data/extra-centers.json`: centers missing from chabad.org. Ones that must stay private go in
  `data/extra-centers.private.json`, which git ignores.
- `data/report.md`: counts per state/country and data problems found by the build.
- `scripts/build-data.mjs`: builds `web/data/` from the above plus public boundary data.
- `scripts/chabad-centers-scrape.js`: older browser-console collector for the locator API.
- `data/samples/`: sample chabad.org API responses, for reference.

## Build

```
npm install
npm run build
cd web && python3 -m http.server
```
