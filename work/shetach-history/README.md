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

## The 1984 map (found Nov 8): Lubavitch's own map of who covered which state

A booklet of American Friends of Lubavitch on the Rebbe (made after the National Scroll of Honor, 24 March 1983), kept
in the Reagan Library (Max Green files, folder "Lubavitch (1 of 2)", PDF page 39:
https://www.reaganlibrary.gov/sites/default/files/2025-09/40-219-6927379-032-026-2025.pdf ; copy here:
`afl-map-about-1984.jpg`), has a map of the US in three colours: "Lubavitch is reaching every community in the United
States through its active Eighty-two Centers in Thirty-four of the states. The other states, where there is not as yet
a Lubavitcher Center established, are being served by one of the above. ... These states where a Lubavitcher Center is
present; These states whose Centers cover more than one state; States which are covered by other states". Its list of
centres (pp. 44-47) has Oregon's (opened Jan 1984) but not Kentucky's (Mar 1985), so the map is from 1984 or early 1985.

- **Covering other states (orange):** Washington, California, Minnesota, New Mexico, Texas, Louisiana, Pennsylvania,
  Virginia, North Carolina, Massachusetts.
- **Covered by others (blue):** Idaho, Montana, Wyoming, Nevada, Utah, North Dakota, South Dakota, Nebraska, Oklahoma,
  Arkansas, Mississippi, Kentucky, West Virginia, South Carolina, Delaware, Vermont, New Hampshire, Maine.
- **Own centre (tan):** the rest drawn (Alaska and Hawaii are not).

The map doesn't say who covers whom; where a blue state has one orange neighbour it is taken as covered by it.
Put in the data (by early 1985): **Nevada the West Coast's** (was 1989), **North Dakota the Upper Midwest's** (was 2011),
**South Dakota the Upper Midwest's** before Katzman's visits (kept from 1986, then Feller's shliach 2016), **Iowa its
own** (Lubavitch of Iowa, Des Moines, in the list; Rabbi Moishe Kasowitz its director in 1989, JTA; was 1992; the
Quad Cities follow), **New Mexico its own and covering a neighbour** (Chabad Lubavitch of New Mexico, Albuquerque, and a
UNM Chabad House; was 1992). Agreeing with the data already in: Idaho, Montana, Wyoming (Levitin), West Virginia
(Kranz), South Carolina (Groner), Delaware (Avremel Shemtov), Oregon its own.

**For the owner to settle** (noted on each area, not put in as periods):
- Mississippi is blue with Louisiana its only orange neighbour: Rivkin's by 1984, not only from 2014. The owner's word
  ("just never had, like Mississippi, until Rifkin sent the shliach there") stands until he says otherwise.
- Kentucky is blue, but Ohio is tan and Virginia its only orange neighbour; the owner has it Kalmanson's (1975-85).
- Utah (California, via Nevada, or New Mexico), Nebraska before 1986 (no orange neighbour; Minnesota likeliest),
  Oklahoma (Texas or New Mexico), Arkansas (Texas or Louisiana).
- Vermont, New Hampshire and Maine, covered from Massachusetts: by which head (Prus, Deren or Fogelman). Vermont is
  blue though the same booklet lists "Chabad of Vermont, 5 Hickok Place, Burlington".
- In the booklet's caption of the 24 March 1983 Oval Office visit, Feller is "Mid-West Director".

A later American Friends of Lubavitch list (an "Education Day, U.S.A., 1986" advertisement, May 1986, in the other
Reagan folder, 40-219-6927380-037-013-2025.pdf, p. 47) has Kentucky (Louisville), Iowa (Des Moines and West Des Moines),
Tennessee at 3600 West End Ave., Nashville (Posner's shul), Vermont (158 N. Willard St., Burlington); no map.

## The model

- An **area** is a map piece, `<state>:<shetach id>` (web/data/centers.geojson's `piece`). Its periods say whose
  shetach it was in, from when. A split is the start of an area's new period; the old shetach shrinks then.
- A **shetach** is named by its id today (`washington` = Levitin's Pacific Northwest), with its heads over time.
- So a map of year Y: each area takes the shetach of its period at Y; areas with the same shetach merge into one.
  Before an area's first period it is blank.

## What is in the file (Nov 8): 65 of the 68 US pieces, all 10 Canadian

**Splits** (an area moving from one head's shetach to another's):
- The Northwest (owner): Levitin from Kislev 5733 (Nov–Dec 1972; Hebrew Chabadpedia: "החל בחודש כסלו תשל"ג לפעול
  בשליחות הרבי במדינת וושינגטון"); BC its own Nov 1974, Oregon Jan 1984, Alberta 1988 (owner unsure it was
  his), Alaska 1991, Idaho Apr 2004, Montana early 2007, Wyoming May 2008 (owner, Nov 8, on his office's 2021
  description that includes it: "Yes, if his offices thing includes it, then it makes sense"); Washington is what's
  left.
- Kalmanson's (owner): from Sept 1975; Indiana its own 1981, Kentucky Mar 1985, the Toledo area to Michigan 1987,
  Central Ohio 1991. Northeast Ohio was Alevsky's from 1972, before Kalmanson came, so never his.
- West Virginia: Kranz's from 1976 (owner); Western Pennsylvania's after Sept 2007, by Dec 2013. Its first shliach
  (Gurevitz, Morgantown, 2007) came "under the aegis of Chabad-Lubavitch of Virginia"; by Dec 2013 the house "falls
  under the auspices of the Lubavitch Center of Pittsburgh". So it moved after him, not with him.
- **Washington DC: Avremel Shemtov's (Philadelphia) until his son Levi's, 1992.** Owner, Nov 8: "You do fucking
  realize DC was Avremel's before it was Levy's, right?" (after this file had first put it under Maryland, from Kaplan
  asking the Rebbe about opening there: a mistake, since the evidence for Avremel was already in hand). Avremel founded
  and directed American Friends of Lubavitch, Chabad's office in Washington, and organized the National Menorah from
  1979; so 'by 1979', the start not found.

- **Delaware: Avremel Shemtov's (Pennsylvania) by Oct 1980, its own from 1987 (Vogel).** JTA, 7 Oct 1980: "Shemtov is
  director of the American Friends of Lubavitch and regional head of the Lubavither movement in Pennsylvania, southern
  New Jersey and Delaware. His office is in Philadelphia". The Vogels are "regional directors of Chabad-Lubavitch of
  Delaware since 1987". Since when Delaware was his is not known (he came in 1961). A PNW-style split, found Nov 8 by
  sweeping the JTA archive (its search API, every 'Lubavitch'/'Chabad' + state or city, 1955-95).
- **Southern New Jersey: Avremel's in 1980** (JTA, Aug 1980: "regional director of the American Friends of Lubavitch
  which includes Pennsylvania and Southern New Jersey"; and the Oct 1980 line above), **Herson's today** (the Rabbinical
  College of America lists Cherry Hill, Medford, Vineland, Ventnor, Princeton and Toms River and says all New Jersey's
  shluchim are part of it). When it moved is not known (Atlantic City's Chabad house about 1984, Cherry Hill's 1993).
  Not on the map: New Jersey is one piece, so this sits in New Jersey's note until the owner wants a South Jersey piece.

**Additions** (blank land joining a shetach when its head sends the first shliach, like Mississippi):
- Mississippi to Louisiana's, Aug 2014 (owner's example).
- **Nevada to the West Coast, 1989**: the Rebbe's answer at the end of 5749 put a Las Vegas Chabad House "under his
  [Cunin's] responsibility like all other matters there"; earlier proposals had been turned down; first shliach 1990.
- **North Dakota to the Upper Midwest, 2011**, with its first shliach (before: only 'itinerant leaders and rabbinical
  students'). **South Dakota: Nebraska's (Katzman) from the mid-1980s, the Upper Midwest's from Dec 2016**: "Since the
  mid-1980s, Rabbi Mendel Katzman, Chabad-Lubavitch emissary to nearby Omaha, Neb., has also made periodic visits to
  assist the community" (Chabad.org, Nov 2016), until Feller appointed its first shliach (the owner's rule: activity
  there). A PNW-style move.
- **Connecticut to Deren's**: Western Massachusetts from 1974 (Amherst), Connecticut by about 1990 ("Merkos considered
  me wholly responsible for the entire state of Connecticut"); New Haven County has been the Hechts' since 1946.
- **Windsor (Essex County, Ontario) to Michigan's**, 2009, with its first shliach.
- **The Quad Cities piece of Iowa (Davenport, Bettendorf): Jacobson's Iowa from 1992 (owner: "I would assume Quad City
  was part of Iowa"), Illinois's from about 2005** (Chabad of the Quad-Cities). A small split.

**Shetachim and their starts** (no earlier head found unless said): New Haven 1946 (Moshe Hecht), Central
Massachusetts 5706 (Hershel Fogelman; the Worcester yeshiva from 1942), Michigan 1958, Florida 1960, Pennsylvania
(Philadelphia) 1961, the Upper Midwest Dec 1961, the West Coast 1965, New Jersey 1965, Wisconsin Oct 1968,
Kansas–Missouri Jan 1970 (both states from the start: JTA, "will serve the states of Missouri and Kansas"; St.
Louis, 1980, came within it), Upstate New York 5731 (Nosson Gurary, Buffalo; a Lubavitch yeshiva there from 1943),
Texas May 1972, Maryland 5734, Eastern New York 1974 (the Rubins, Albany; Gurary's before, owner: "I assume it was
Gurary before Rubin yeah"), Eastern Massachusetts 1975 (Prus),
Illinois 1977 (Daniel Moscowitz), Arizona Jan 1977, Colorado 1978, Rhode Island 1979, the Carolinas 1980, Alabama
1982, Rockland 1983, Georgia 1984, Vermont 1984, Nebraska 1986, the South Area 1987, Oklahoma Apr 1987 and Maine 1987
("new branches of Merkos in four states", 5747), Delaware 1987, Hawaii Aug 1987, New Hampshire 1989, the North Shore
and Merrimack Valley 1992, Iowa, Arkansas, New Mexico and Utah 1992, Cape Cod 1995. **Tennessee 1949** (corrected Nov 8 from 1994):
Rabbi Zalman Posner, sent by the Frierdiker Rebbe in 1949 as rav of Sherith Israel, Nashville (Akiva day school 1954),
"Head Shliach to the state of Tennessee for 65 years" (CrownHeights.info notice, Apr 2014); Levi Klein's Chabad of
Tennessee (Memphis) from mid-1994, the umbrella in Nashville by Oct 2007. Posner's daughter is Vivi Deren (Connecticut).

**Canada** (owner, Nov 8: "please do Canada now"): Quebec from the Montreal yeshiva, 3 Cheshvan 5702 (Oct 1941; the
nine students the Frierdiker Rebbe brought from Shanghai), Berel Mochkin its head (in Montreal from 1952, Camp Gan
Israel 1959; when he became head not found); Manitoba from 1972 (Altein, Winnipeg); Ontario 5734 (Grossbaum,
Toronto; "head-Shliach of Ontario"); British Columbia Nov 1974 and Alberta 1988 (Levitin's before, owner); Ottawa
1977 (Hayes); the Maritimes 1995 (Feldman, Halifax, Grossbaum's son-in-law); Essex County (Windsor) to Michigan's
2009; Saskatchewan June 2011 (Saskatoon, its first Chabad, in Altein's shetach); Newfoundland Feb 2017 (the
Chernitskys, from Montreal). Grossbaum (Anash, 2019): "Back then, there were opportunities to go out to states and
provinces, greater territories on behalf of the Rebbe and Merkos". **Splits in Canada** (owner, Nov 8): Ottawa was
Grossbaum's from 5734 until Hayes (1977) ("Yes I would assume ottowa used to be grossbaums"), Windsor too until
Michigan's (2009) ("Same with windsor"). Saskatchewan was Altein's by the owner's rule (below): "Over the decades, we
have been sending Roving Rabbis to Regina" (Altein, 2013). The Maritimes (before 1995) and Newfoundland (before 2017)
were in no shetach: no earlier activity found for the Maritimes; Newfoundland had holiday packages from "a
Chabad-connected rabbi", Rabbi Gorelik (CJN, Apr 2016; which Gorelik is not known), and bochurim for yomim tovim paid
for by a local businessman (the Chernitskys).

**The owner's rule for "was it his before?"** (Nov 8): "usually I would assume it was only theirs if they were doing
some sort of activity there or if they were explicitly sent to those names places by the Rebbe or merkoz like how
levitin was sent to all those places".

**Head changes**: Tennessee (Zalman Posner 1949 to Levi Klein, 1994 or later), Central Massachusetts (Moshe Yitzchak Hecht 1942, Hershel Fogelman 5706, Mendel 5773), New Haven (Moshe Hecht to Sheya, 1992),
Virginia (Yankel Kranz to Yossel, 1991), Southern Ohio (Kalmanson to Mangel, 1995, owner), Colorado (Yisroel Meir
Popack to Mendel, 2022), Illinois (Daniel Moscowitz to Meir, Mar 2014), New Jersey (Moshe Herson to Mendy, 2025, with
a vaad; the first vaad about 2010), Florida (Avrohom Korf named a vaad Feb 2020; Benjy Korf Aug 2025), Northeast Ohio
(Alevsky to Greenberg, 2026, owner), Eastern New York (Yisroel Rubin, who passed away 3 Oct 2026, to the Rubin family,
owner).

Things found on the way:
- Levitin's office still describes the old wide region: Anash.org, Aug 4 2021: "Chabad of the Pacific North West
  covers British Colombia, Alberta, Alaska, Montana, Oregon, Wyoming and Washington, with nearly 200 shluchim".
  That put **Wyoming** in his start too (the owner agreed, Nov 8); its own head from May 2008.
- Merkos counted its regional offices: Feller's was "the fourth division of Merkos" in the USA (1961-62), Cunin "the
  fifth Shliach of the Rebbe in the USA" (1965), Kansas City "its eighth regional office" (Jan 1970).
- Kalmanson's organization kept the name Chabad of Southern Ohio (the JTA in Dec 2002 calls him its regional
  director); the owner's 1995 is when he stopped being head shliach.
- **The PNW pattern is rare in print.** The older heads' own accounts and the JTA notices of the time describe one-state
  offices (Milwaukee, "its seventh in the United States", Nov 1968; Kansas City, "will serve the states of Missouri
  and Kansas", Jan 1970); the later states' stories describe them as new (Oklahoma and Maine "new branches of Merkos",
  1987), with only visiting bochurim before. Owner (Nov 8): "I'm sure they exist". Leads still open: **Atlanta** had a
  Chabad Center with a director, Rabbi Shlomo Bluming (3330 Peachtree Road; Southern Israelite listings Apr 1979, May
  1980, 1983), before Rabbi New (1984): under whom, not found (the Georgia newspaper archive has a browser check);
  Western Massachusetts before Deren (1974), Fogelman's?; Eastern New York before the Rubins (1974), Gurary's?;
  Connecticut outside New Haven before Deren; Canada (Montreal's reach to Ottawa, the Maritimes, Newfoundland).
- JTA's site search (`https://www.jta.org/wp-json/wp/v2/search?search=...&per_page=50`, plain curl) lists its archive
  stories; its notices of new Lubavitch regional offices are short and name the city, the number, and sometimes the
  states.
- Nebraska's own timeline calls the Katzmans (1986) the Rebbe's emissaries "to the Mid-American region": whether
  that meant more than Nebraska is not known.
- A shetach starts with the first lasting institution the Rebbeim sent there: Montreal's yeshiva (Oct 1941),
  Worcester's (June 1942), Pittsburgh's day school (1942), New Haven (1946). Buffalo's yeshiva (1943) closed, so
  Upstate New York starts with Gurary (5731).

## Open

- **Eastern Massachusetts is one shetach (Prus, from 1975) in the history for now** (owner, Nov 8: "honestly I don't
  know ... just for now, Massachusetts, the east would be one thing for now. Because honestly, I'm still not sure about
  that whole situation"); the South Area (1987), the North Shore and Merrimack Valley (1992) and Cape Cod (1995) are
  kept in the notes of their areas, not as splits.
- West Virginia's exact move (2007–2013): narrow it with archived copies of the Morgantown house's site or its
  chabad.org listing (541856), and of Pittsburgh's and Chabad of the Virginias' branch lists.
- When Washington DC became Avremel Shemtov's (by 1979): the founding of American Friends of Lubavitch (its 50th
  anniversary was marked about 2024-25).
- Yossel Kranz's start (Aug 1991 is his father's passing); Mangel's (1995 is the natural reading); Sheya Hecht's
  (1992, his father's passing); the Florida vaad of 2023 (Anash's page, anash.org/?p=559466, answered 403).
- Who, if anyone, had southern and central Ohio, Indiana and Kentucky before Sept 1975, and the Northwest before 1972.

## Not done yet

US: New York City (Tzach), Crown Heights and Monsey (no head). Western Pennsylvania's line of heads before
Rosenfeld (the area is in, from 1942). Then the world, when the owner says.

## Sources that worked

- **A Chassidisher Derher.** Its "Pinpoints" series (5785: Alaska, Oklahoma, Buffalo, Baltimore, Worcester MA) and
  its interviews with the first heads (Feller, Cunin, Lazaroff, Korf, Wilhelm, Lipskar; list at derher.org/articleindex/,
  read through Firecrawl). Read so far: Alaska (excerpt), Oklahoma, Baltimore, Buffalo, Worcester, Feller, Cunin. Still to read: Lazaroff
  (56-Iyar-5777-09.pdf), Korf (44-Iyar-5776-08.pdf), Wilhelm (76-Teves-5779-...Portland-Oregon.pdf). A PDF costs one credit a page.
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
- Firecrawl on Nov 8: 7 searches (14 credits) and 12 page reads (51 credits), about 65 in all, plus a PDF read the
  owner stopped partway.
