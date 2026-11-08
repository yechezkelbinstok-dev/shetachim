# Shetach history: territories and heads over time (started Nov 8)

The owner's idea (Nov 6, queued behind the founding years), started Nov 8: a feature on the site with the historical
shetachim of the United States ("we could do the rest of the world later"). His examples: the Pacific Northwest
(Levitin's, which shrank as states got their own heads), Kalmanson's Ohio–Indiana–Kentucky, Kranz's Virginia and
West Virginia (West Virginia later went to Rosenfeld), Mississippi (blank until Rivkin sent a shliach), Newfoundland
(only recently), and head changes (Herson in New Jersey with a vaad, Korf in Florida with a vaad).

The data is `data/shetach-history.json` (its `about` explains every field). These are only notes.

## The owner's rules for this (Nov 8)

- **His facts stand.** "The fact of the matter is, it is a certain way today, and it was a certain way then. I am
  telling you as a fact ... I just need to figure out when each one split off. Stop trying to verify my facts."
  What he states goes in as `how: owner` (no confidence), and the research is the dates.
- **Splits come first.** "another very important thing is territories splitting off and stuff, like PNW, for example,
  or kalmanson And I'm sure there's more examples like that. So I need you to find those." Head changes are second.
- **Firecrawl for whatever can't be reached** ("Just use firecrawl if you can't reach it bro"). Plain search and
  fetch first; read a page raw (curl, or Firecrawl markdown) before resting a date on it; WebFetch's answers are a
  small model's summary.
- Same standards as the founding years: every date with its source and quote; a list or an "N years ago" is a count
  back (medium at best); only bounds = a range; a month or day kept when it turns up.

## The model

- An **area** is a map piece, `<state>:<shetach id>` (web/data/centers.geojson's `piece`). Its periods say whose
  shetach it was in, from when. A split is the start of an area's new period; the old shetach shrinks then.
- A **shetach** is named by its id today (`washington` = Levitin's Pacific Northwest), with its heads over time.
- So a map of year Y: each area takes the shetach of its period at Y; areas with the same shetach merge into one.
  Before an area's first period it is blank.

## Done (Nov 8): the pilot on the owner's examples

| Area | Periods |
|---|---|
| Washington | Levitin from 1972 (sent with the Rebbe's 71 new institutions of 11 Nissan 5732; came in 5733) |
| Oregon | Levitin's 1972 (owner); its own from **Jan 1984** (Wilhelm; Jewish Review, Feb 1984) |
| British Columbia | Levitin's 1972 (owner); its own from **Nov 1974** (Wineberg) |
| Alberta | Levitin's 1972 (owner, unsure); its own from **1988** (Matusof) |
| Alaska | Levitin's 1972 (owner; Derher: "the Pacific Northwest, which included Alaska"); its own from **1991** (Greenberg) |
| Idaho | Levitin's 1972 (owner); its own from **Apr 2004** (Lifshitz) |
| Montana | Levitin's 1972 (owner); its own from **early 2007** (Bruk) |
| Northeast Ohio | Alevsky from **1972**, before Kalmanson came, so never Kalmanson's |
| Southern Ohio | Kalmanson from **Sept 1975** (Cincinnati Post, May 1977); Mangel from 1995 (owner: Kalmanson "kicked off the year after gimmel tammuz") |
| Central Ohio | Kalmanson's 1975 (owner); its own from **1991** (Kaltmann) |
| Toledo area | Kalmanson's 1975 (owner: "all those parts of Ohio, I think"); Michigan's from **1987** (Yossi Shemtov) |
| Indiana | Kalmanson's 1975 (owner); its own from **1981** (Grossbaum) |
| Kentucky | Kalmanson's 1975 (owner); its own from **Mar 1985** (Litvin) |
| Virginia | Yankel Kranz from **1976** ("the Virginias"); his son Yossel from Aug 1991 (after his father's passing, 6 Elul 5751) |
| West Virginia | Kranz's 1976 (owner); Western Pennsylvania's **after Sept 2007, by Dec 2013** (range) |
| Louisiana / Mississippi | Rivkin from **Nov 1975**; Mississippi joins in **Aug 2014** (Biloxi) |
| Newfoundland | its own from **Feb 2017** (Chernitsky) |
| New Jersey | Moshe Herson from **1965**; Mendy Herson from the shloshim, **2025**, with a vaad (first vaad about 2010; new one June 2025) |
| Florida | Avrohom Korf from **1960**; a vaad of seven named **Feb 2020**; Benjy Korf from **Aug 2025** (Merkos, at the shloshim) |

Things found on the way:
- **West Virginia did not move with its first shliach.** Zalman Gurevitz opened Morgantown in 2007 "under the aegis
  of Chabad-Lubavitch of Virginia" (Chabad.org, Sept 2007; Pittsburgh's Jewish Chronicle, Mar 2007: "Officially,
  Chabad activities in West Virginia are supervised by Chabad of Virginia", with Rosenfeld helping). By Dec 2013 the
  house "falls under the auspices of the Lubavitch Center of Pittsburgh". To narrow: archived copies of the Morgantown
  house's site or chabad.org listing (541856) between 2008 and 2013, the Pittsburgh Chronicle's archive, and Chabad of
  the Virginias' and Pittsburgh's own branch lists in those years.
- **Two Kranzes.** The first head of the Virginias was Rabbi Yaakov Noach (Yankel) Kranz (1976–1991); Yossel is his
  son. Their organization is still called Chabad of the Virginias.
- **Levitin's office describes a wider region than his shetach.** Anash.org, Aug 4 2021: "Chabad of the Pacific North
  West covers British Colombia, Alberta, Alaska, Montana, Oregon, Wyoming and Washington, with nearly 200 shluchim";
  Chabad of Seattle's "Our Story": "The region spans ... Washington, Oregon, Alaska, Idaho and Montana ... spreads into
  Canada, including the provinces of British Columbia and Alberta". That is the old region's name living on, not
  today's shetach (owner: today only Washington is his). It is the one hint that **Wyoming** was in it too; the owner
  didn't list Wyoming (its own head from May 2008, Mendelsohn).
- Before Levitin (1972): roving rabbis in Fairbanks from the summer of 1970 (Chabad.org); no head known for the
  Northwest.

## Open

- West Virginia's exact move (above). Yossel Kranz's start (Aug 1991 is his father's passing). Mangel's start
  (1995 is the natural reading of the owner's words). The Florida vaad of 2023 (a search summary says 273 shluchim
  elected a new one; Anash's page, anash.org/?p=559466, answered 403: not read).
- Who, if anyone, had southern and central Ohio, Indiana and Kentucky before Sept 1975, and the Northwest before 1972.

## Next: the sweep for more splits (the owner's ask)

Every US shetach (and Canada as it comes) that began after its neighbours may have been part of an older one. The
older heads (by their flagship's year, data/founding-years.json) and the later ones near them, to check:

- West Coast (Cunin, 1965): Arizona, Hawaii (1987), Utah (1992), New Mexico (1992); the Northwest before 1972.
- Upper Midwest (Feller, 1962): Wisconsin, Iowa (1992), Nebraska (1986), Kansas–Missouri, Montana.
- Michigan (Shemtov, 1958): Ohio before 1972, Indiana.
- Texas (Lazaroff, 1972): Oklahoma (1987), Arkansas (1992), New Mexico, Louisiana before 1975.
- Florida (Korf, 1960): Georgia (1984), Alabama (1982), the Carolinas (1980), Tennessee (1994).
- Philadelphia (Avremel Shemtov, 1961): Delaware (1987), Western Pennsylvania, Maryland.
- Maryland (Kaplan): Washington DC (1992), Delaware, Northern Virginia.
- Boston (Prus): Rhode Island (1979), Vermont (1984), Maine (1987), New Hampshire (1989), Connecticut, and the
  Massachusetts sub-areas (South Area 1987, North Shore 1992, Merrimack Valley 1992, Cape Cod 1995, Central MA).
- Illinois (Moscowitz): Wisconsin, Iowa (the Quad Cities), Kansas–Missouri, Indiana.
- Colorado: Wyoming, Utah, New Mexico, Nebraska, Kansas.
- New York: Rockland (1983), Monsey, Eastern NY (Rubin), Upstate NY (Gurary), New Haven.
- Canada: Ottawa (1977), the Maritimes (1995), Manitoba–Saskatchewan (1972), from Montreal or Toronto.

How to find them: each later head's arrival story usually says who sent him or whose auspices he came under ("under
the auspices of", "under the aegis of", "sent by Rabbi X of ..."); an older head's obituary or anniversary story
usually lists what he first covered; old organization names keep old regions ("Chabad of the Virginias", "the
Upper Midwest", "the Pacific Northwest", "the Carolinas"); a 1970s–80s newspaper's title for a head ("director for
Ohio, Kentucky and Indiana") dates his region.

## Access notes (Nov 8)

- anash.org article pages answer plain curl (only its wp-json API has a bot check); collive.com answers 403 (read
  through Firecrawl); chabad.org through WebFetch or Firecrawl; crownheights.info, lubavitch.com,
  localjewishnews.com, jewishindependent.ca, jewishportland.org: curl.
- derher.org blocks downloads; Firecrawl's search shows excerpts of its PDFs. The Cincinnati Judaica Fund's catalogue
  has a robot check; the search index shows its descriptions. The Detroit Jewish News archive puts a Cloudflare check
  in front of curl.
- Hebrew dates: hebcal.com's converter (`/converter?cfg=json&hy=5751&hm=Elul&hd=6&h2g=1`), plain curl.
- Firecrawl used on Nov 8: 7 searches (14 credits) and 5 page reads (5 credits), plus one PDF read the owner
  stopped partway.
