# Founding years: the small shetachim (Nov 6)

The owner (Nov 6): "every US-Canada shetach with 10 or less centers so we get all the small ones out of the way";
"everything is included btw - all blue dots"; and if a month or a date turns up, keep it ("More data never hurt
nobody"). Results are in `data/founding-years.json`, keyed by chabad.org id, each with its source, a quote, `how` and a
confidence.

## Result

35 map areas: the 34 US/Canada shetachim with 10 dots or fewer, and Monsey (blank on the map, `shetach: "none"`).
160 dots, 171 listings (mushrooms not counted).

| | count |
|---|---|
| Dots with a year (a dot takes its earliest listing's year) | 152 of 160 (95%) |
| Dots with only a range ("by 2008": it existed then, start unknown) | 8 |
| Dots with nothing | 0 |
| Listings rated high / medium / low / range | 98 / 25 / 38 / 10 |
| Listings with a month or a day too | 38 |

Most of the 38 lows are centers opened since about 2016 that no article covers. Their year rests on two weak signs
that agree: therebbesimpact.com's year, and when the center's chabad.org listing was made (below).

## therebbesimpact.com, checked again

Where it has the same center and our year is rated high (65 centers): the same year 51 (78%), a year off 9, wrong 5:
Delaware (it says 2014; launched 1987), Arkansas (1996; 1992), Columbus (1995; 1998), Northwest Indiana (2003, the
Zalmanovs' year; Chabad there from 1995), Auburn, Alabama (2023; the shluchim come in fall 2026). Also wrong in
earlier entries of this batch: Wyoming 2007 (2008), Laramie 2022 (2023), Seacoast 2017 (2018). It has no entry at
all for many schools, camps and mikvahs. A lead, not a source.

## chabad.org listing numbers as a last resort

A center's chabad.org id is the number of its listing, and the numbers run in the order listings were made, so the
number dates the listing to within about a year. That bounds the start; it is not the start (a camp or a shul can be
decades older than its listing). Anchors used:

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

## Doubtful entries (for the owner to spot-check)

Medium: one source, a count back from "N years ago", or two sources a year apart. Low: no real source, only
therebbesimpact.com and the listing number. Range: no year, only "it existed by then".

**alabama**
- medium: Chabad of Alabama, Birmingham, 1987 (Rabbi Posner also said "the early '80s")
- medium: Chabad of Huntsville, 2010
- low: Chabad on Wheels, Birmingham, 2025

**alaska**
- range: The Alaskan Mikvah, Anchorage, after 2001

**cape-cod-and-the-islands**
- low: Chabad of Nantucket, 2024

**central-ohio**
- medium: Schottenstein Chabad House (OSU), Columbus, 1991 (its own house perhaps 1996)
- low: Chabad of Downtown Columbus, 2017
- low: Chabad of Bexley, 2025

**hawaii**
- medium: Chabad of Maui, 2004 (the Shustermans' Maui Mitzvah Center; that it is the same center is inferred)
- low: Chabad Kauai, 2007 (a directory says 2010)
- low: Chabad of Kona & West Hawaii, 2009
- low: Chabad of Hilo, 2023
- low: CYP Oahu, Honolulu, 2025

**indiana**
- medium: Lubavitch of Indiana, Indianapolis, 1981 ("After 34 Years", 2015)
- medium: Chabad House of Bloomington, 1989 ("home of 30 years", 2019; the Chincholkers from about 1990)
- low: Chabad of Greater South Bend, 2017
- low: Chabad of Fishers-Noblesville, 2026

**iowa**
- medium: Chabad of North East Iowa, Postville, 1998 ("the last 28 years", Jan 2026)
- low: YJP Des Moines, 2026
- low: Cteen Iowa, Des Moines, 2026
- low: Lubavitch of Iowa City, 2002
- low: Lubavitch of Ames, 2017
- range: Talmud Torah, Des Moines, by 2008
- range: Cheder Menachem / Beis Chaya Mushka, Postville, by 2007

**kentucky**
- medium: Louisville Jewish Day School, 1996 (grew from Gan Torah; a school site lists it closed in 2025)
- medium: Chabad of Prospect, Louisville, 2012 (that it is the 2012 Chabad Chai Center is inferred)
- medium: Chabad of the Bluegrass, Lexington, 2015 (or 2016)
- range: Camp Gan Israel, Louisville, by 2011

**louisiana-mississippi**
- medium: Slater Torah Academy, Metairie, 1993 (or 1994)
- medium: Congregation Beth Israel, Gulfport, 2014 (Chabad of Southern Mississippi's year; the shul is older)
- range: Camp Gan Israel, Metairie, by 2007

**maine**
- medium: Chabad of Bangor, 2015 (its Chabad house perhaps 2017)
- medium: Chabad of Brunswick, 2018

**manitoba-saskatchewan**
- range: The Friendship Circle, Winnipeg, by 2008

**merrimack-valley**
- medium: Chabad Lubavitch Jewish Center of Merrimack Valley, Andover, 1992 (a founders' dinner about 1990)
- range: Camp Gan Israel, Andover, by 2005

**montana**
- low: Chabad Lubavitch of Great Falls, 2023 (running by March 2024)

**new-mexico**
- medium: Mikvah Moshe, Santa Fe, 2010 (nearly built Nov 2010)
- low: Chabad of Taos, 2008
- low: Chabad of Eldorado, 2026

**none (Monsey)**
- medium: Cheder Chabad of Monsey, 1999
- low: National Committee for Jewish Education, Monsey, 2000
- low: Monsey Beis Chaya Mushka High, 2008
- low: Mesivta Lev Tmimim, 2015
- low: Cheder Zichron Shmuel, 2024
- low: Mayan Torah Tomchei Tmimim, 2025
- range: Cheder Chabad of Monsey Girls School, by 2008

**north-shore-of-massachusetts**
- low: Chabad of Cape Ann, Gloucester, 2021

**ottawa**
- low: Chabad of Westboro Village, 2019
- low: Congregation Lubavitch, Ottawa, 1992
- low: Chabad of Centrepointe, 2002
- low: Chabad of Kanata, 2007
- low: Chabad Student Centre of Kingston, 2010
- range: Irving Aaron Kitchen of Kindness, by 2024

**rhode-island**
- medium: Chabad of West Bay Chai Center, Warwick, 1995
- low: Chabad of Providence (Rabbi Berel Laufer), 2026
- low: Chabad of College Hill (Brown), 2003
- low: Chabad of the University of Rhode Island, 2016
- low: Chabad of South County, 2021

**rockland**
- medium: Chabad of The Nyacks, 2001
- low: Chabad Jewish Center of Suffern, 2007
- low: Chabad Israel Center, Nanuet, 2021
- low: Chabad of Stony Point, 2023

**southern-ohio**
- medium: Chabad Jewish Center, Blue Ash, 1990 (or 1991)

**utah**
- medium: Chabad Lubavitch of Park City, 2013

**vermont**
- medium: Chabad of Vermont, Burlington, 1983 (or 1984)
- low: Chabad of Bennington County, Manchester, 2014
- low: Middlebury Chabad, 2017
- low: Chabad of Northwest Vermont, South Burlington, 2022
- range: Mikvah Chaya Mushka, Burlington, by 2003

**washington-dc**
- medium: Chabad GW, 1994
- medium: Chabad Georgetown, 2021
- medium: Chabad East DC Jewish Center, 2021
