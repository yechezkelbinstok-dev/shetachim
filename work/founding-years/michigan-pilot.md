# Founding years: the Michigan pilot (Nov 6)

The owner (Nov 6): "what we need is the data ... do a test run pick a mid-sized American shetach ... and see how
easy it would be as a blueprint for the data collection." Michigan (Rabbi Berel Shemtov's shetach, Toledo included):
37 directory listings at 32 dots on the map. Results are in `data/founding-years.json`.

## Result

| | count | share |
|---|---|---|
| Listings with a year | 31 of 37 | 84% |
| Dots with a year (a dot takes its earliest listing's year) | 28 of 32 | 88% |
| Dots with only a range ("by 2001": it existed then, start unknown) | 3 | |
| Dots with nothing | 1 (Toledo's Food & Learning Center) | |

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
   Farmington Hills congregation opening (1978), Grand Rapids "opened about nine years ago" (1988 -> 1979), "Thirty-
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

- Per shetach: (1) look for a list or timeline; (2) find the local Jewish paper's archive and its own search; (3) one
  web search per remaining center, then the archive search (earliest first) under every name it's known by, before
  settling for a range; (4) ranges only after that; (5) conflicts noted, not hidden.
- Michigan was probably easier than average (the 2024 list, a digitized paper back to the 1940s). Expect fewer exact
  years where neither exists: maybe 60–80% of dots.
- Size: US and Canada are 1,991 listings at 1,787 dots. At about one lookup per listing, that's ~2,000 lookups; done
  shetach by shetach, a few shetachim per session.
