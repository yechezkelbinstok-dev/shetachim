# Shetachim map

An interactive map of Chabad shetachim (regions under a head shliach), with borders drawn
by shetach rather than by country/state, plus a faint dot for every Chabad center, the cities
that have shluchim, and a star for each shetach's capital. It can also be shown over a street map.
Starting with the United States and Canada. **Picking this up? Read [HANDOFF.md](HANDOFF.md) first.** Plan: [docs/PLAN.md](docs/PLAN.md).

## Layout

- `web/index.html`: the map (static page, D3 + TopoJSON; MapLibre GL for the street map). Data it loads is in `web/data/`.
- `index.html`, `.nojekyll`: let GitHub Pages serve the repo root and send visitors on to `web/`.
- `data/shetachim.json`: the shetachim: name, head shliach, territory, capital.
- `data/raw/chabad-centers.json`: every center from the chabad.org locator (Sept 2026).
- `data/extra-centers.json`: centers missing from chabad.org.
- `data/report.md`: counts per state/country, cities without a GeoNames match, and data problems found by the build.
- `scripts/build-data.mjs`: builds `web/data/` from the above plus public boundary and city data.
- `scripts/chabad-centers-scrape.js`: older browser-console collector for the locator API.
- `data/samples/`: sample chabad.org API responses, for reference.

## Build

```
npm install
npm run build
python3 -m http.server   # then open http://localhost:8000/web/
```

## Publish

GitHub Pages, from a branch: Settings → Pages → Build and deployment → Deploy from a branch →
pick the branch and `/ (root)`. The map is then at `https://yechezkelbinstok-dev.github.io/shetachim/`.
The street map needs this (or any real web host): its tiles come from openfreemap.org.
