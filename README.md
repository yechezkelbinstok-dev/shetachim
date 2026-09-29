# Shetachim map

An interactive map of Chabad shetachim (regions under a head shliach), with borders drawn
by shetach rather than by country/state, plus a faint dot for every Chabad center.
Starting with the United States and Canada.

## Data

- `scripts/chabad-centers-scrape.js` — paste into the DevTools Console on
  chabad.org/jewish-centers to download `chabad-centers.json` (all centers with coordinates).
  Chabad.org is behind a Cloudflare check, so this runs in a normal browser session.
- `data/samples/` — sample responses from the chabad.org centers API, captured from the
  locator, used as reference for the response format.
