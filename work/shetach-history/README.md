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

## What is in the file (Nov 8): 51 of the 68 US pieces, 3 of the 10 Canadian

**Splits** (an area moving from one head's shetach to another's):
- The Northwest (owner): Levitin from 1972; BC its own Nov 1974, Oregon Jan 1984, Alberta 1988 (owner unsure it was
  his), Alaska 1991, Idaho Apr 2004, Montana early 2007; Washington is what's left.
- Kalmanson's (owner): from Sept 1975; Indiana its own 1981, Kentucky Mar 1985, the Toledo area to Michigan 1987,
  Central Ohio 1991. Northeast Ohio was Alevsky's from 1972, before Kalmanson came, so never his.
- West Virginia: Kranz's from 1976 (owner); Western Pennsylvania's after Sept 2007, by Dec 2013. Its first shliach
  (Gurevitz, Morgantown, 2007) came "under the aegis of Chabad-Lubavitch of Virginia"; by Dec 2013 the house "falls
  under the auspices of the Lubavitch Center of Pittsburgh". So it moved after him, not with him.
- **Washington DC (new, to confirm with the owner):** in the Maryland head's hands before it had its own. Kaplan asked
  the Rebbe in the late 5730s about opening a Chabad House in Washington, and in summer 5745 (1985) about a center "in
  the heart of Washington" (Derher, "Pinpoints: Baltimore", written with his help). Its own head, Levi Shemtov, from
  1992. (American Friends of Lubavitch, Chabad's government office in Washington, was run by Avremel Shemtov of
  Philadelphia, Levi's father; that is a national office, not the shetach.)

**Additions** (blank land joining a shetach when its head sends the first shliach, like Mississippi):
- Mississippi to Louisiana's, Aug 2014 (owner's example).
- **Nevada to the West Coast, 1989**: the Rebbe's answer at the end of 5749 put a Las Vegas Chabad House "under his
  [Cunin's] responsibility like all other matters there"; earlier proposals had been turned down; first shliach 1990.
- **North Dakota (2011) and South Dakota (Dec 2016) to the Upper Midwest**, with their first shluchim.
- **Connecticut to Deren's**: Western Massachusetts from 1974 (Amherst), Connecticut by about 1990 ("Merkos considered
  me wholly responsible for the entire state of Connecticut"); New Haven County has been the Hechts' since 1946.

**New shetachim on blank land** (no earlier head found): Wisconsin Oct 1968, Kansas–Missouri Jan 1970 (both states
from the start: JTA, "will serve the states of Missouri and Kansas"; St. Louis, 1980, came within it), Texas May
1972, Maryland 5734, Arizona Jan 1977, Colorado 1978, Rhode Island 1979, the Carolinas 1980, Alabama 1982, Georgia
1984, Vermont 1984, Nebraska 1986, Oklahoma Apr 1987 and Maine 1987 ("new branches of Merkos in four states", 5747),
Delaware 1987, Hawaii Aug 1987, New Hampshire 1989, Iowa, Arkansas, New Mexico and Utah 1992, Tennessee 1994.
The oldest: New Haven 1946, Pennsylvania (Philadelphia) 1961, the Upper Midwest Dec 1961, the West Coast 1965, New
Jersey 1965, Florida 1960.

**Head changes**: New Haven (Moshe Hecht to Sheya, 1992), Virginia (Yankel Kranz to Yossel, 1991), Southern Ohio
(Kalmanson to Mangel, 1995, owner), Colorado (Yisroel Meir Popack to Mendel, 2022), New Jersey (Moshe Herson to Mendy,
2025, with a vaad; the first vaad about 2010), Florida (Avrohom Korf named a vaad Feb 2020; Benjy Korf Aug 2025),
Northeast Ohio (Alevsky to Greenberg, 2026, owner).

Things found on the way:
- Levitin's office still describes the old wide region: Anash.org, Aug 4 2021: "Chabad of the Pacific North West
  covers British Colombia, Alberta, Alaska, Montana, Oregon, Wyoming and Washington, with nearly 200 shluchim".
  The one hint that **Wyoming** was his too (the owner didn't list it; its own head from May 2008).
- Merkos counted its regional offices: Feller's was "the fourth division of Merkos" in the USA (1961-62), Cunin "the
  fifth Shliach of the Rebbe in the USA" (1965), Kansas City "its eighth regional office" (Jan 1970).
- Kalmanson's organization kept the name Chabad of Southern Ohio (the JTA in Dec 2002 calls him its regional
  director); the owner's 1995 is when he stopped being head shliach.
- Nebraska's own timeline calls the Katzmans (1986) the Rebbe's emissaries "to the Mid-American region": whether
  that meant more than Nebraska is not known.

## Open

- West Virginia's exact move (2007–2013): narrow it with archived copies of the Morgantown house's site or its
  chabad.org listing (541856), and of Pittsburgh's and Chabad of the Virginias' branch lists.
- To ask the owner: Wyoming in Levitin's start? Washington DC as Maryland's before 1992?
- Yossel Kranz's start (Aug 1991 is his father's passing); Mangel's (1995 is the natural reading); Sheya Hecht's
  (1992, his father's passing); the Florida vaad of 2023 (Anash's page, anash.org/?p=559466, answered 403).
- Who, if anyone, had southern and central Ohio, Indiana and Kentucky before Sept 1975, and the Northwest before 1972.

## Not done yet

US: Michigan (1958; Windsor's Essex County since 2009 is Michigan's: CA-ON:michigan), Illinois (and the Quad Cities
piece of Iowa), Western Pennsylvania (Pittsburgh had a shliach from 1943, Rabbi Sholom Posner; Rosenfeld's start),
Wyoming, the Massachusetts areas (Boston and the five sub-areas: were they Boston's first?), and New York (New York
City, Crown Heights, Monsey, Rockland, Eastern New York, Upstate New York). Canada: Quebec, Ontario, Ottawa,
Manitoba–Saskatchewan, the Maritimes.

## Sources that worked

- **A Chassidisher Derher.** Its "Pinpoints" series (5785: Alaska, Oklahoma, Buffalo, Baltimore, Worcester MA) and
  its interviews with the first heads (Feller, Cunin, Lazaroff, Korf, Wilhelm, Lipskar; list at derher.org/articleindex/,
  read through Firecrawl). Read so far: Alaska (excerpt), Oklahoma, Baltimore, Feller, Cunin. Still to read: Buffalo
  (5785-5-2.pdf), Worcester (5785-11-10.pdf), Lazaroff (56-Iyar-5777-09.pdf), Korf (44-Iyar-5776-08.pdf), Wilhelm
  (76-Teves-5779-...Portland-Oregon.pdf). A PDF costs one credit a page.
- **The JTA archive** (jta.org/archive, plain curl): 1960s–70s bulletins on new Merkos regional offices.
- Founding years (`data/founding-years.json`): the first shliach of a state is usually its shetach's start; its sources
  are copied with `via`.
- Obituaries and anniversary stories (COLlive, Anash, CrownHeights.info, Chabad.org, local Jewish papers).

## Access notes (Nov 8)

- anash.org article pages answer plain curl (only its wp-json API has a bot check); collive.com answers 403 (read
  through Firecrawl); chabad.org through WebFetch or Firecrawl; crownheights.info, lubavitch.com, jta.org,
  localjewishnews.com, jewishindependent.ca, jewishportland.org, jewishchronicle.org: curl.
- derher.org blocks plain downloads (Firecrawl reads its PDFs). The Cincinnati Judaica Fund's catalogue has a robot
  check; the search index shows its descriptions. The Detroit Jewish News archive has a Cloudflare check.
- chabad.org's centers API has no regional-office field (checked: neither the locator data nor the location API).
- Hebrew dates: hebcal.com's converter (`/converter?cfg=json&hy=5751&hm=Elul&hd=6&h2g=1`), plain curl.
- Firecrawl on Nov 8: 7 searches (14 credits) and 11 page reads (38 credits), about 52 in all, plus a PDF read the
  owner stopped partway.
