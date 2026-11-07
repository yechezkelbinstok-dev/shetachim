# Founding years: Florida (Nov 6–7)

The owner (Nov 6): "I want every single centers founding year ... I want this done properly"; "if you come across
month or day save it ... (or season which equates to a range ofc)"; "if you come across that a center used to be
somewhere else save as well as maybe when it moved". Results are in `data/founding-years.json` (batches
`batches/florida-01.json` to `florida-14.json`), keyed by chabad.org id.

## Result

219 dots, 240 listings (mushrooms not counted). Every listing now has an entry.

| Dots | count |
|---|---|
| A year from a real source, high | 71 (32%) |
| A year from a real source, medium | 35 (16%) |
| A year, low | 1 |
| Only a range ("by 2007": it existed then, start unknown) | 62 (28%) |
| Open: no real source yet | 50 (23%) |

Listings: high 77, medium 36, low 1, range 64, open 62. A dot takes its earliest listing's year. 33 entries have a
month or a day (`date`), 9 a season (`season`), 46 former locations (`earlier`).

## Corrections to earlier entries

- **Chabad @ University of Miami** (118534): was 1973 (Rabbi Eliezrie's Chabad House at UM). Chabad.org (Feb 2015)
  says Rabbi Mendy and Henchi Fellig "opened the Chabad House at the University of Miami ... in 2001", and nothing shows
  the 1973 house ran without a break, so the year is now 2001 and 1973 is kept under `earlier`.

## Sources that worked

- **CrownHeights.info reposts** of local papers (Sun-Sentinel, Miami Herald, Palm Beach Post, St. Petersburg Times,
  Town-Crier, Destin Log): the most useful single source. Read with plain curl; WebFetch gets a 307.
- **Lubavitch.com, 'Seven in the Sunshine State' (2 Nov 2018)** dated five 2018 centers at once (Singer Island,
  Downtown Sarasota, Pensacola, Lauderhill, Tamarac). Its 'New Appointments' page (25 Aug 2004) gave West Palm Beach.
- **COLlive / Anash 'New Shluchim to ...' posts** for everything since about 2015.
- **Local papers' own sites:** Heritage Florida Jewish News (Orlando area), Palm Coast Observer, Laker/Lutz News,
  Town-Crier (Wellington, Royal Palm Beach), Margate Talk, Parkland Talk.
- **IRS ruling dates (ProPublica Nonprofit Explorer API, free):** `projects.propublica.org/nonprofits/api/v2/`. A
  center's own corporation's ruling date says it existed by then: used only as `by` in a range, never as a year. They
  can trail the founding by decades when a center re-registered (Chabad Chayil: late 1980s, ruling 2007).
- **Florida Sunbiz** (corporation records; through Firecrawl, since it has a bot check): a nonprofit's document number
  carries its filing year (N05000010609 = filed 2005). Also only a `by`.

## What was hard

- The Miami-Dade and Broward centers opened about 1995–2006: many have no article at all. Most of the 62 ranges are
  these, bounded by an IRS ruling or a dated mention.
- Mikvahs, schools, camps, youth and senior programs seldom have a year of their own.
- lubavitch.com often answers 500; sjlmag.com has a broken certificate (not bypassed); chabad.org and Sunbiz show a
  bot check to plain requests.
- The web-search allowance (200 per turn) ran out on Nov 7 before the last ~60 dots got a second search.

## Still open or range (to work on)

`python3 work/founding-years/listings.py florida --missing` lists them. The leads in each entry's `lead` field are
therebbesimpact.com's year or the chabad.org listing's date, to check, never to use as a year.
