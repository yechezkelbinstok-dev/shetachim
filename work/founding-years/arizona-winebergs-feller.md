# Founding years: Arizona, Kansas–Missouri (Sholom Wineberg), British Columbia (Yitzchok Wineberg), Upper Midwest (Moshe Feller)

Third session, from Nov 8 (owner: "I think it's time to do Arizona, along with both Winebergs and feller shetach").
Method as in `west-coast.md` and `michigan-pilot.md`: each listing searched by name; sources read raw before a year rests
on them; chabad.org listing dates (`api/content/<id>/metadata`) and lubavitch.com addresses for every listing.

## British Columbia (batch british-columbia-01): 12 of 13 dots dated
- The Jewish Independent (Vancouver) is the main source: its current site and its 2001-2014 archive at
  jewishindependent.ca/oldsite/archives/<monYY>/archives<YYmonDD>-NN.html (some old links 404 now).
- Lubavitch BC: November 1974 (lubavitch.com, 2005); 40 years in Dec 2014.
- North Shore: the Mochkins began in Sept 2015; the listing now names Rabbi Mordechai Slavin (2025). Kept as 2015, medium.
- East Van: no founding source, no director on the listing: range, by its listing date (July 29 2010).
- Not used: the Vancouver Courier piece (403 to this tool), CanadaHelps and the CRA charity search (scripts only).

## Kansas–Missouri (batch kansas-missouri-01): 15 of 16 dots dated
- The Kansas City Jewish Chronicle (kcjc.com, its own search works: /component/search/?searchword=...) and the St. Louis
  Jewish Light (stljewishlight.org, readable with a browser user agent) carry nearly every opening.
- Kansas City: the JTA Daily Bulletin of 6 Jan 1970 reports the regional office opening (Rabbi Sholem B. Wineberg, 24).
- St. Louis: 1980 (Jewish Light 2006) against 1981 (Chabad.org) and 1982 (the 2007 '25 years'): medium.
- Kirkwood: new (listing April 2026), no news yet: range.

## Upper Midwest (batch upper-midwest-01): 13 of 19 dots dated, all 19 researched
- chabad.org's centers API (`/api/v2/chabadorg/centers/<id>`, plain curl) gives each listing's website, personnel and
  departments: six of the 19 are departments of Upper Midwest Merkos (117647) or of Rochester (117646), which is why
  several have no year of their own.
- lubavitch.com's 2009-2011 city lists (Wayback through Firecrawl, 1 credit each; check first with the free
  `archive.org/wayback/available?url=...` API, `&` written as `%26`) gave the old addresses and directors for Duluth,
  St. Paul, St. Louis Park, West St. Paul and Rochester. Plain curl to web.archive.org pages and the CDX API is blocked
  here (egress policy), the availability API is not.
- Upper Midwest Merkos: winter 1961 (Chabad.org 2016, the 2017 obituary) against 1962 (Chabad.org 2012): medium.
- The Lubavitch Cheder Day School is the 'Chabad Lubavitch Jewish Educational Center' listing: 1977.
- Duluth: the listing was Rabbi Boruch Greenwald's Chabad Lubavitch of Northern Minnesota (Mayor's 'Chabad Week',
  Dec 2003: 'throughout the past two years'); the Rosses came in Oct 2018 under the same corporation. Kept as about
  2001, medium.
- North Dakota: 2011 in two later sources, 'recently moved' in Nov 2012 and a Nov 2012 listing: medium.
- Ranges (no year found): the mikvah office, St. Louis Park, Chabad Lubavitch Education (by 2004), Oneg Shabbos (by
  1995, AJW: 'more than 20 years'), It's Good To Know (IRS, by 2005), Macalester-Groveland (by its Sept 2021 listing).
- AJW (ajwnews.com) and TC Jewfolk search through WordPress: `/wp-json/wp/v2/posts?search=<words>&orderby=date&order=asc`.
- Not used: chabadpedia.com (Cloudflare blocks it; not worked around), the Austin Daily Herald's 2017 Rochester piece
  (its page didn't load), the Minnesota DHS licence lookup (a form).
- Every quoted phrase was checked against its page (a small checker, scratchpad `tools/quotecheck.py`); the one
  mismatch (Wikipedia's 'a.k.a.', not 'also known as') was fixed.

## Arizona (batch arizona-01): 35 of 43 listings dated (32 of 38 dots), all 43 researched
- The Jewish News of Greater Phoenix (jewishaz.com, a BLOX site) answers searches as JSON, earliest first:
  `/search/?f=json&q="<phrase>"&t=article&l=8&s=start_time&sd=asc` (scratchpad `jn.sh`). Its online archive starts
  about 1996; nearly every Phoenix-area opening since then was reported there, usually with the month.
- Its 'Synagogue timeline' (17 Aug 2007) lists Scottsdale 1992, East Valley 1997, West Valley 2000, ASU 2003, North
  Phoenix 2004, Anthem 2005, Mesa 2006; each was then confirmed by a report from the time.
- The Jewish News of 8 Feb 2002 (the 25th anniversary) has Phoenix's homes: a garage at Third Ave and McDowell (1977),
  Maryland Ave and 15th St (1978), 2110 E. Lincoln Drive (1990).
- The Arizona Jewish Post (Tucson; WordPress, `/wp-json/wp/v2/posts?search=`; online from 2010) covers Tucson.
- Tucson: 1984 (Jewish News 2002) against 1983 (Arizona Jewish Post 2017): medium, 1984.
- Chabad of Arizona often lists a center on chabad.org months before the couple arrives (Goodyear, Gilbert, Oro Valley,
  Paradise Valley, Fountain Hills, Buckeye, Casa Grande): the year is the arrival or opening, the listing date in the note.
- Ranges: Mazal Tov Gifts (2004), Camp Gan Izzy (2010), Chabad on River (2000-2006), Sedona (2017), 7th Street and the
  Israeli Center (2022), San Tan Valley (2024), CTeen Phoenix (its listing 2021; a C-Teen program began in 2010-11).
- Read through Firecrawl (chabad.org-hosted sites that refuse curl): Chabad Tucson's About page, and the 7th Street,
  Israeli Center, San Tan Valley and Sedona home pages; none gave a year. Not read: Anash (blocks automated reading).
