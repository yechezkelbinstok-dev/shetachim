# Founding years: the small shetachim (Nov 6)

The owner (Nov 6): "every US-Canada shetach with 10 or less centers so we get all the small ones out of the way";
"everything is included btw - all blue dots"; and if a month or a date turns up, keep it ("More data never hurt
nobody"). Results are in `data/founding-years.json`, keyed by chabad.org id, each with its source, a quote, `how` and a
confidence.

## Result

35 map areas: the 34 US/Canada shetachim with 10 dots or fewer, and Monsey (blank on the map, `shetach: "none"`).
160 dots, 171 listings (mushrooms not counted).

| Dots | count |
|---|---|
| A year from a real source, high | 95 (59%) |
| A year from a real source, medium | 24 (15%) |
| Only a range ("by 2012": it existed then, start unknown) | 15 (9%) |
| Open: no real source yet | 26 (16%) |

Listings: high 98, medium 25, range 17, open 31. A dot takes its earliest
listing's year.

**Owner (Nov 6), on the guesses:** "basically a guess is ridiculous how can I use that in an expansion map ... if you
had tried harder you could have found it but I guess that's for the next session to work on". So no guess is a year
any more: those entries are `open`, with `year: null` and the guess kept only as `lead` (therebbesimpact.com's year,
or when the chabad.org listing was made), to check. Where a dated source shows the place running by some year, the
entry is a `range` with that `by` year. Most open ones are places opened since about 2016 that no article found so
far covers.

## therebbesimpact.com, checked again

Where it has the same center and our year is rated high (65 centers): the same year 51 (78%), a year off 9, wrong 5:
Delaware (it says 2014; launched 1987), Arkansas (1996; 1992), Columbus (1995; 1998), Northwest Indiana (2003, the
Zalmanovs' year; Chabad there from 1995), Auburn, Alabama (2023; the shluchim come in fall 2026). Also wrong in
earlier entries of this batch: Wyoming 2007 (2008), Laramie 2022 (2023), Seacoast 2017 (2018). It has no entry at
all for many schools, camps and mikvahs. A lead, not a source.

## chabad.org listing numbers as a last resort

A center's chabad.org id is the number of its listing, and the numbers run in the order listings were made, so the
number dates the listing to within about a year. That bounds the start; it is not the start (a camp or a shul can be
decades older than its listing). Used only for leads, never as a year. Anchors used:

| Number | When |
|---|---|
| 117xxx–119xxx | chabad.org's first directory, about 2003 |
| 596066 | an article of 18 Nov 2007 |
| 1352537 | an article of 12 Nov 2010 |
| 2922724 | Lexington, opened 2015 |
| 3483282 | Louisville's learning center, Sept 2016 |
| 5384373 | Billings, 2022 |
| 5964779 | an article of May 2023 |
| 6549164 | Williamson County, Oct 2024 |
| 6958605 | CYP Cincinnati, Sept 2025 |
| 7073870 | an article of 12 Oct 2025 |
| 7423561 | a page of July 2026 |

## What worked

- One search per center with the name, the town and "founded / since / arrived", then the center's own About page.
- The center's own history or timeline page, when there is one (Winnipeg's "Historical Outline of Growth", Chabad of
  Louisiana's history page, the Mesivta of Postville's About page).
- CrownHeights.info reposts of local papers (the Brattleboro Reformer, Knox News, the Boston Globe, the Warren Times
  Gazette): a report from the year itself. WebFetch gets a 307 from crownheights.info now; plain curl reads it.
- The Detroit Jewish News archive also covers other cities when it reprints features (Maui, 2006).

## What was hard

- Camps, mikvahs, Hebrew schools and girls' divisions seldom have a year of their own: 7 of the 10 ranges.
- Old centers with two years a year apart (Burlington 1983 or 1984; Blue Ash 1990 or 1991; Santa Fe 1996 or 1997):
  the year the shluchim began is used, the other year is in the note.
- Lubavitch.com pages often answer with a server error (500) to both WebFetch and Firecrawl.

## Not done yet (medium, range, open)

Medium: one source, a count back from "N years ago", or two sources a year apart. Range: no year, only "it
existed by then". Open: no real source yet (lead = the guess to check).

**alabama**
- medium: Chabad of Alabama, Birmingham, AL, 1987
- medium: Chabad of Huntsville, Huntsville, AL, 2010
- range: Chabad on Wheels, Birmingham, AL, by 2025 (lead 2025)

**alaska**
- range: The Alaskan Mikvah, Anchorage, AK, after 2001

**cape-cod-and-the-islands**
- open: Chabad of Nantucket, Nantucket, MA (lead 2024)

**central-ohio**
- medium: Schottenstein Chabad House, Columbus, OH, 1991
- open: Chabad of Bexley, Bexley, OH (lead 2025)
- open: Chabad of Downtown Columbus, Columbus, OH (lead 2017)

**hawaii**
- medium: Chabad of Maui, Kihei, HI, 2004
- range: Chabad Kauai, Kapa'a, HI, by 2010 (lead 2007)
- range: Chabad of Kona & West Hawaii, Kailua Kona, HI, by 2016 (lead 2009)
- open: CYP Oahu, Honolulu, HI (lead 2025)
- open: Chabad of Hilo and East Side of the Big Island, Hilo, HI (lead 2023)

**indiana**
- medium: Chabad House of Bloomington, Bloomington, IN, 1989
- medium: Lubavitch of Indiana - Chabad Center for Jewish Life, Indianapolis, IN, 1981
- open: Chabad of Fishers-Noblesville, Fishers, IN (lead 2026)
- open: Chabad of Greater South Bend, Granger, IN (lead 2017)

**iowa**
- medium: Chabad of North East Iowa, Postville, IA, 1998
- range: Cheder Menachem Boys School/Beis Chaya Mushka Girls School, Postville, IA, by 2007
- range: Lubavitch of Iowa City, Iowa City, IA, by 2006 (lead 2002)
- range: Talmud Torah, Des Moines, IA, by 2008
- open: Cteen Iowa, Des Moines, IA (lead 2026)
- open: Lubavitch of Ames, Ames, IA (lead 2017)
- open: YJP Des Moines, Des Moines, IA (lead 2026)

**kentucky**
- medium: Chabad of Prospect, Louisville, KY, 2012
- medium: Chabad of the Bluegrass, Lexington, KY, 2015
- medium: Louisville Jewish Day School, Louisville, KY, 1996
- range: Camp Gan Israel, Louisville, KY, by 2011

**louisiana-mississippi**
- medium: Congregation Beth Israel, Gulfport, MS, 2014
- medium: Slater Torah Academy, Metairie, LA, 1993
- range: Camp Gan Israel, Metairie, LA, by 2007

**maine**
- medium: Chabad of Bangor, Bangor, ME, 2015
- medium: Chabad of Brunswick, Brunswick, ME, 2018

**manitoba-saskatchewan**
- range: The Friendship Circle, Winnipeg, MB, by 2008

**merrimack-valley**
- medium: Chabad Lubavitch Jewish Center of Merrimack Valley, Andover, MA, 1992
- range: Camp Gan Israel, Andover, MA, by 2005

**montana**
- range: Chabad Lubavitch of Great Falls, Great Falls, MT, by 2024 (lead 2023)

**new-mexico**
- medium: Mikvah Moshe, Santa Fe, NM, 2010
- open: Chabad of Eldorado, Eldorado, NM (lead 2026)
- open: Chabad of Taos, Taos, NM (lead 2008)

**none**
- medium: Cheder Chabad of Monsey, Spring Valley, NY, 1999
- range: Cheder Chabad of Monsey Girls School, Airmont, NY, by 2008
- range: Monsey Beis Chaya Mushka High, Airmont, NY, by 2012 (lead 2008)
- open: Cheder Zichron Shmuel, Spring Valley, NY (lead 2024)
- open: Mayan Torah Tomchei Tmimim, Monsey, NY (lead 2025)
- open: Mesivta Lev Tmimim, Monsey, NY (lead 2015)
- open: National Committee for Jewish Education, Monsey, NY (lead 2000)

**north-shore-of-massachusetts**
- open: Chabad of Cape Ann, Gloucester, MA (lead 2021)

**ottawa**
- range: Irving Aaron Kitchen of Kindness, Ottawa, ON, by 2024
- open: Chabad Student Centre of Kingston - Rohr Chabad House, Kingston, ON (lead 2010)
- open: Chabad of Centrepointe, Ottawa, ON (lead 2002)
- open: Chabad of Kanata, Ottawa, ON (lead 2007)
- open: Chabad of Westboro Village, Ottawa, ON (lead 2019)
- open: Congregation Lubavitch, Ottawa, ON (lead 1992)

**rhode-island**
- medium: Chabad of West Bay Chai Center, Warwick, RI, 1995
- open: Chabad of College Hill, Providence, RI (lead 2003)
- open: Chabad of Providence, Providence, RI (lead 2026)
- open: Chabad of South County, South Kingstown, RI (lead 2021)
- open: Chabad of the University of Rhode Island, Kingston, RI (lead 2016)

**rockland**
- medium: Chabad of The Nyacks, Nyack, NY, 2001
- range: Chabad Israel Center, Nanuet, NY, by 2023 (lead 2021)
- open: Chabad Jewish Center of Suffern, Montebello, NY (lead 2007)
- open: Chabad of Stony Point, Stony Point, NY (lead 2023)

**southern-ohio**
- medium: Chabad Jewish Center, Blue Ash (Cincinnati), OH, 1990

**utah**
- medium: Chabad Lubavitch of Park City, Park City, UT, 2013

**vermont**
- medium: Chabad of Vermont, Burlington, VT, 1983
- range: Mikvah Chaya Mushka, Burlington, VT, by 2003
- open: Chabad of Bennington County, Manchester, VT (lead 2014)
- open: Chabad of Northwest Vermont, South Burlington, VT (lead 2022)
- open: Middlebury Chabad, Middlebury, VT (lead 2017)

**washington-dc**
- medium: Chabad East DC Jewish Center, Washington, DC, 2021
- medium: Chabad GW, Washington, DC, 1994
- medium: Chabad Georgetown, Washington, DC, 2021
