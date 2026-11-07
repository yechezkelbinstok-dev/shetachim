# Founding years: the Michigan pilot (Nov 6)

The owner (Nov 6): "what we need is the data ... do a test run pick a mid-sized American shetach ... and see how
easy it would be as a blueprint for the data collection." Michigan (Rabbi Berel Shemtov's shetach: Toledo, Ohio
and Windsor, Ontario included): 38 directory listings at 33 dots on the map. Results are in `data/founding-years.json`.

## Result

| | count | share |
|---|---|---|
| Listings with a year | 33 of 38 | 87% |
| ... of them rated high / medium / low | 24 / 8 / 1 | |
| Dots with a year (a dot takes its earliest listing's year) | 30 of 33 | 91% |
| Dots with only a range ("by 2001": it existed then, start unknown) | 2 | |
| Dots with nothing | 1 (Toledo's Food & Learning Center) | |

**Then everything not solid was checked** (the owner: "are you sure it's correct? ... I don't know who to trust now"):
every year counted back from "N years ago", every first mention, every judgment call, the ranges, and the entries
resting only on the July 2024 list, against the archive (its own search, words joined with AND, earliest first).
What changed:
- Grand Rapids 1979 -> **1977** (the Sept 1977 opening announcement; "about nine years ago" in 1988 was 2 years off).
- Novi 2000 -> **2005** (Jan 2006: first program Purim 2005, center that fall). The 2024 list was wrong.
- Friendship House 1994 -> **2004** (a director by Nov 2004, building spring 2005). The list gave Friendship Circle's year.
- Bloomfield Hills: **2016** confirmed (Chabad.org, Oct 2016); the list's 2017 is a year off.
- Mishkan Israel 1958 -> **1963** (first mention as the Lubavitcher Center; 1958 was its building's dedication).
- F.R.E.E. Southfield: range -> **1990** (opened Aug 1990; Southfield address Dec 1990).
- Farmington Hills 1977 -> **1972** (Nov 7: Bais Chabad opened in a new building at 28555 Middlebelt in 1972,
  Jewish News Nov 24 1972; 1977 was when the Bergsteins took it over).
- Confirmed: Flint (absent 1980-81, open by Dec 1986), Toledo (May 1987),
  The Shul (Nov 1994), Royal Oak (Nov 2018), Livonia (Sept 2022), Waterford (July 2024), the Mesivta (1965).
- Still weak: Bingham Farms (2009 from the list only; first newspaper mention Dec 2016).
- Missed altogether until a recount (Nov 6): **Windsor, Ontario**, the shetach's one Canadian center: **2009** (its
  rabbi "became the rabbi at Congregation Shaarey Zedek in June, 2009"; CrownHeights.info, Aug 2012: the families
  "three years ago welcomed Rabbi Sholom and Rivka Galperin"). The listings had been gathered by state (Michigan,
  then Toledo), not from every map piece of the shetach; ten US/Canada shetachim cross a state or country line.
Lessons: take a shetach's listings from every map piece named for it (`piece` ending in `:<shetach id>`), not by
state; a published list is a lead, not proof (3 of its 13 checkable entries were wrong); "N years ago" can be off
by a couple of years; a first mention only bounds the start.

**Corrected after the owner's challenge** ("THE FUCKING FAMOUS DETROIT MESIVTA ... should have been one of the easiest
things to find"): the first pass had no year for the Detroit Mesivta and only "by 1997" for Bais Chabad of North Oak
Park. Both were in the Jewish News archive: the Lubavitch Yeshivah and Mesivta "since 1965" (July 2011, the
groundbreaking of its Zekelman campus, where Rabbi Berel Shemtov read the Rebbe's blessing from its founding), and
North Oak Park established in mid-August 1990 (Nov 1990). The Cheder is 1965 too (a 1999 directory's 1958 was wrong).
Why the first pass missed them: it searched under the directory's names ("Oholei Yosef Yitzchak Lubavitch - Mesivta")
instead of the names people use, stopped after two web searches, and never searched the archive itself.

Effort: the first pass took 30 web searches and 4 page fetches (Firecrawl, where the newspaper archive refused a plain
fetch); the corrections took 3 more web searches, 1 fetch and 4 searches of the archive itself.

## What worked, in order

0. **The archive's own search, sorted by earliest date** (digital.bentley.umich.edu/djnews/search?q=...&sort=date_issued_dt+asc;
   it refuses plain fetches, Firecrawl reads it). The first page shows the first mention, often "established in ...".
   Do this for every center that a web search doesn't settle, under every name it goes by.

1. **A published list with years.** The Detroit Jewish News of 4 July 2024 (the Rebbe's 30th yahrzeit) printed
   "these Chabad institutions have been founded in Michigan" since 1994, with a year for each: 11 listings in one
   page. Look for this first in every shetach: the regional headquarters' history or timeline page, anniversary
   dinner journals, local Jewish papers' anniversary sections.
2. **The local Jewish paper's archive.** The Detroit Jewish News is digitized from the 1940s (University of Michigan,
   digital.bentley.umich.edu). It dated the old ones: "Chabad Has Finally Arrived in Detroit" (Sept 1958), the
   Farmington Hills congregation, Bais Chabad (Nov 1972), Grand Rapids "opened about nine years ago" (1988 -> 1979), "Thirty-
   seven years ago" in Flint (2022 -> 1985). Many US Jewish papers are digitized somewhere; find each shetach's.
3. **One search per center**: its name, city and "founded / established / since / arrived". The search answer
   usually quotes the sentence with the year: the center's own About page, the local paper, CrownHeights.info,
   Anash, COLlive, lubavitch.com.

## What was hard

- **Listings that are part of something bigger**: a preschool, a day camp, a mikvah, a school building, a mesivta.
  They seldom have a year of their own. When they share a dot with a dated center the dot is fine; on their own dot
  they stay empty or get a range.
- **Old institutions with conflicting dates**: the Oak Park cheder is "founded 1958" in a 1999 directory, but 1965 in
  three sources, the school's own among them (settled: 1965).
- **Arrival vs. opening**, a year apart: Bloomfield Hills (the couple came in 2016; the 2024 list says 2017), Novi
  (the list says 2000; a 2006 article has them moving to Novi in 2005), downtown Detroit (named 2013, house opened
  2014). Rule used: the year the shluchim began there, the other year in the note.
- **A stale listing**: the Michigan Jewish Institute (1994) closed in March 2016 but is still in the directory.

## Blueprint for the rest (suggestion, not agreed)

- Per shetach: (0) list its listings from `web/data/centers.geojson`, every feature whose `piece` ends in
  `:<shetach id>`; (1) look for a list or timeline, as leads; (2) find the local Jewish paper's archive and its own search;
  (3) one web search per center, then the archive search (AND, earliest first) under every name it's known by;
  (4) prefer a report from the year itself over a list, an anniversary count or a later profile; (5) rate each year
  high / medium / low and check every medium and low before calling the shetach done; (6) ranges only after that.
- Michigan was probably easier than average (the 2024 list, a digitized paper back to the 1940s). Expect fewer exact
  years where neither exists: maybe 60–80% of dots.
- Size: US and Canada are 1,991 listings at 1,787 dots. At about one lookup per listing, that's ~2,000 lookups; done
  shetach by shetach, a few shetachim per session.
