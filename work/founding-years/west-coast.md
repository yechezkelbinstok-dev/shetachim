# Founding years: the West Coast shetach (started Nov 6)

Owner (Nov 6): "start on the West Coast ... Do this fucking properly"; every blue dot gets a year; therebbesimpact.com
"most of them are right ... a lot of them are wrong, and he also definitely doesn't have all of them" (a lead only);
a month or a day when it turns up, not hunted ("a little extra data never hurt nobody": the `date` field); keep track
of what's missing (`python3 work/founding-years/status.py` -> STATUS.md) for a later round of the hard ones.

Scope: 331 listings at 301 dots — California 284 dots, Nevada 17. **Not Mexico** (owner, Nov 6: "Not Mexico!!!!! Wtf"):
the West Coast map piece also holds Baja California and Baja California Sur, but they are left out.
Leads: `python3 work/founding-years/leads.py west-coast` (254 of 334 have one; never used as a year).
Entries go into `data/founding-years.json` with `work/founding-years/add.py`, the same fields as Michigan: year, how,
source (a URL), note (the quote and what it shows), confidence; `date` when one turns up.

## Method
1. The region's own history first (Chabad of California's timeline, its anniversaries), then each center: its own
   site's About page, chabad.org's page, the news of its opening (COLlive, Anash, CrownHeights.info, lubavitch.com,
   Chabad.org News; the Jewish Journal for LA, J. for the Bay Area, San Diego Jewish World / Journal, the Las Vegas
   Israelite), anniversary stories, the shluchim's bios and obituaries.
2. Every medium or low entry checked against a second, independent source before the region is called done; a report
   from the year itself beats a list or an anniversary count.

## Progress
(updated as batches go in)
- Batch 1 (Bay Area, Nov 6): 8 entered — SF 1985 (high), Berkeley house 1972 (medium: 1972/1973), Stanford 2002
  (high, J. Aug 2002), Greater South Bay 1975 (medium; Levins 1980), Marin 1984-06 (high, own page), Solano 2009,
  Novato 2012, Friendship Circle 2004 (medium). Leads in hand, not yet entered: Richmond Torah Center ('the
  15-year-old Richmond Torah Center' in a J. foreclosure story — date the story; lead 1987), Contra Costa ('close to
  thirty years', Anash, undated; an undated J. item on its opening under a Rabbi Kagan), Chabad Palo Alto (1666288:
  check whether it's the same place as Greater South Bay).
- Batches 2-4 (Bay Area, Nov 6): 37 more. High: Sacramento 1994, Davis 2003-09, Noe Valley 2000, Cole Valley 2011,
  Tri-Valley 2005, North Peninsula 2001, Sonoma County 2002 (J., July 2002), Oakland 2006, Sunnyvale 2003-09,
  Cupertino 2005, Contra Costa 1996 (J., Sept 1996: Rabbi Yaakov Kagan), Napa 2006, Fremont 2012-10, Castro Valley 2013,
  Danville 2015, LaMorinda 2015, Petaluma 2015, Redwood City 2009, Shalom School 1997, El Cerrito 2016-11, San Leandro
  2019, Tracy 2021, Tiburon 2022, Evergreen 2024, Menlo 2024-10, Sonoma Valley 2024, Almaden 2020-01, Concord
  2019-08-14, Morgan Hill 2018, Emeryville 2018, Portola Valley 2021-04. Medium (to check): Mill Valley 2003 (maybe late
  2002), Stockton 2002 (counted back), Los Altos 2010 ('re-established': the earlier one not found), Santa Clara 2016
  (a year apart), Corte Madera 2020-07 (therebbesimpact 2019), Downtown San Jose 2016-08 (LinkedIn).
- Batches 5-6 (Bay Area finished, Nov 6): all 78 Bay Area listings researched. New high: Richmond Torah Center 1987
  (medium: a Nov 1990 report, 'founded three years ago'), Berkeley mikvah 1977 (Mikva Taharas Israel at 2520 Warring St,
  renamed Mikvas Chana Leah in 2014), UCSC 2003, UC Berkeley student center 2007, SF State/Sunset 2006-09, West Marin
  2022, Elk Grove 2022, Chabad of the Neighborhood 2021. Medium: Chabad by the Sea 2000 (counted back), Mountain View
  2012 (Gan Torah preschool; the center 2022), Pacific Heights 2010-07 and the Israeli community 2003-07 (LinkedIn), San
  Jose 2000 ('leading since'), Chabad Palo Alto 1975 (same place and nonprofit as Greater South Bay). Range: Gan Chabad
  Pleasanton and Bais Menachem (by 2012), the Delta (by 2010), Alameda (by 2018). Open (the hard round): CYP SF, Chai
  Hebrew School, UC Davis, the Cheder of the Bay Area, CGI Contra Costa, CGI SF, Daly City, Richmond (Wagner), Santa
  Cruz CJL, Union City, the Gan Alameda, Burlingame, Sea Cliff, Sausalito.
- status.py now also counts dots (map points): a dot is dated when any of its listings is.
- Batches 7-9 (the rest of California outside LA, SD and OC, Nov 6): north and central (Roseville 2005, Chico 2006,
  Folsom 2007, Humboldt 2012, Grass Valley 2017-01, Lincoln 2017, Modesto 2021, Fair Oaks 2021, Paso Robles 2022, Auburn
  2023, Merced 2024, Truckee 2025-07, Mammoth 2019, Santa Barbara 1979, Ventura 1987, High Desert 1989, Fresno 1990
  (counted back), Bakersfield 2002, Monterey 2003, Oxnard 2003-05, Camarillo 2003 (counted back), SLO 2009, Montecito
  2022, Saugus 2021, Lake Arrowhead 2022 (medium)); the desert and Inland Empire (Palm Springs 1980, Inland Empire 1989,
  Bikur Cholim 1996, Temecula 1999, Riverside 2005, La Quinta 2017, Aleph Schoolhouse 1983).
- A new source for schools: the Chabad Chinuch Office's 'Directory of Chabad Educational Institutions in the
  English-speaking world' (2023-24, https://www.chinuchoffice.org/media/pdf/1267/szkh12671837.pdf) gives a 'Founded'
  year for most schools and preschools (entered as how 'list', medium). Downloaded and read locally with pdftotext (do
  not ask Firecrawl to parse it: 109 pages cost 113 credits). Used so far: Gan Camarillo 2005, Gan Chabad Pleasanton
  2007, Bais Menachem 2006, Aleph Schoolhouse 1983. It covers LA's schools too.
- Batches 10-12 (San Diego and Orange County, Nov 6): all 51 researched. High among them: University City 1978 (began
  as 'Chabad of La Jolla'), Poway 1986, La Costa 1989, La Jolla 2001, Downtown SD 2004, Laguna Niguel 2005, Pacific
  Beach 2007, Rancho Santa Margarita 2008, East County 2012-07, Carmel Valley 2014, Encinitas 2016-09, Escondido 2021,
  Tierrasanta 2023, North Park 2025, Mission Valley 2026. Medium: SD headquarters and SDSU 1975 (SDSU: 1975 or 1977),
  Irvine 1979 (or 1984), West OC 1984, Mission Viejo 1996, Newport Beach 2001, Los Alamitos 2002, Oceanside 2004-07,
  San Clemente 2005-09, Alef Center 2005, Hebrew Academy 1969 (directory), YAM 2012, Dana Point 2018. Ranges: Laguna
  Beach (by 1991), North County (1973-1988), Rancho Bernardo (by 2022). (Tijuana was entered here; removed Nov 6: not Mexico.) Open: Tustin, RSF, North Irvine, Aliso Viejo, Chapman, South HB, Coastal Hebrew School, Mikvah Israel,
  Coronado, Friendship Circle SD, Chula Vista, UCSD, Chabad Israeli OC, Penasquitos, Family Chabad, UC Irvine, Chabad
  Without Borders, Beth Eliyahu.
- Batches 13-20 (Los Angeles, Nov 6): all 139 LA-area listings researched (LA County and the Conejo). Among them: West
  Coast HQ 1965, UCLA Chabad House 1969-03, Simcha Monica 1972, South Bay 1973, Chabad of the Valley 1973, Mid City
  (Chabad on Fairfax) 1975, Mikvah Esther 1976, Teichman Mikvah 1978, Conejo 1979 (was 'by 1984'; Lubavitch.com's
  40th, June 2019), Israel Center 1982, Bel Air 1985, Brentwood 1985, Cheviot Hills 1987, Levi Yitzchok 1987 (when Rabbi
  Raichik became its rabbi; may be older), Living Torah Center 1992, Cheder Menachem 1993, Oak Park 1995, Persian Youth
  Center 1995, Burbank 1998, Glendale 1999, Century City 1999, USC 2000-08, Studio City 2000-09, Chatsworth 2003, CSUN
  2005, West Hills 2006, SMC 2007, SOLA 2007, Moorpark 2008, Toluca Lake 2009, Granada Hills 2010-11, Caltech 2015, Mar
  Vista 2015, CTeen Conejo 2015-03, and the newer centers (2019-2026) from their new-shluchim posts.
- Batch 21 (Nevada and Baja, Nov 6): Southern Nevada 1990, Summerlin 1994, Northern Nevada 1997, Henderson 1998, Desert
  Torah Academy 1999 (directory), UNLV 2005, Cabo 2009 (counted back), Lake Tahoe 2013, Red Rock 2015-12, Friendship
  Circle LV 2016, UNR 2021, North Las Vegas 2021, Centennial Hills 2023-08, Carson City 2024. (Cabo and La Paz were entered too; removed Nov 6
  with Tijuana: not Mexico.)
- Shared dots: an undated department on a dated center's dot leaves the dot dated (CYP SF, Chabad Youth LA, the
  Kollel at Ohr Elchonon ...). Levi Yitzchok (1987) and the Chabad Jewish Center of Hancock Park (2009) share a dot.

## Where it stands (Nov 6, after the medium checks)
331 US listings (Mexico out, at the owner's word). With a year 224 (high 165, medium 59); range 14; open 93. Dots 301:
dated 216, missing 85.
- Every medium was checked against a second source (each note ends 'Checked (Nov 6): ...'). 25 went to high; years that
  changed: Berkeley 1972-09-01 (B'nai B'rith Messenger, Nov 1972), San Jose 2000-10 (J., Aug 2001), Stockton 2002-10
  (Stockton Record, Nov 2002), Pacific Heights 2012-03 (COLlive; was 2010 from LinkedIn), San Clemente 2004 (was 2005),
  Burbank 1999 (was 1998), Fresno 1990-02, the Bay Area Friendship Circle 2003 (was 2004), SDSU 1973 (was 1975), Desert
  Torah Academy 1994 (its own history; the directory says 1999), UNR 2021-12. The 59 still medium say why (sources a year
  apart, a count back, or only one source found).
- The hard round (started): the 14 ranges and 93 opens, each with its lead. Chabad of Burlingame turned out to be 2012
  (J., May 2012, the Weinbaums), not the 2025 listing date. The old ones worth the most effort: Chabad of Beverly Hills
  (lead 1978), Chabad in the Hills (1997), Westlake Village (1985), Gan Chaya, Mt. Olympus, the Las Vegas Talmud Torah,
  the Chabad Hebrew Center (Las Vegas). Searches now go through plain web search and fetch first, Firecrawl only when a
  site blocks (owner, Nov 6).

## The hard round (Nov 6-7)
Owner (Nov 6): "I want this research to be the best" (Firecrawl allowed again), and to hear how much is left
(`python3 work/founding-years/progress.py west-coast small michigan`). Entries go in batch files,
`work/founding-years/batches/west-coast-NN.json` (22 on), applied with add.py.
- **Re-check of the WebFetch-based entries (Nov 6):** every West Coast entry whose source had been read only through
  WebFetch's summary was re-read on the raw page: the 1990 Orange County history, J.'s 2014 Bay Area story and its May
  2012 Burlingame/Novato item, KESQ (Rancho Mirage), the Jewish Journal (Lake Balboa), Beverly Hills's campaign page.
  All held. One fix: Beverly Hills's source now points to the 'Foot In The Door' campaign page that has the quote.
- **New sources that worked:**
  - The California Digital Newspaper Collection (cdnc.ucr.edu; through Firecrawl, curl gets a bot check). Its
    search with `&f=XML` returns only the hit counts by year and paper (1 credit), which shows the first year a
    name appears; `?a=d&d=<id>&f=XML` returns an article's text (1 credit). Papers with Chabad news: J. / the
    Northern California Jewish Bulletin, the North County Times, the Coronado Eagle and Journal, the Topanga
    Messenger, the Ventura County Star, the Thousand Oaks Star (to about 2001), the Argonaut (Marina del Rey), the
    Desert Sun (only to 1993). Found this way: Coronado 2005, Topanga 2003, Westlake Village 1985.
  - The 2016-17 Jewish OC Community Directory (a PDF with 'Founded:' for every Orange County congregation): Tustin
    2004, North Irvine 2007, Aliso Viejo 2008; checks for Newport Beach 2001, Mission Viejo (1995 there), Laguna Beach.
  - Chabad.org News's yearly campus round-up (Oct 31 2017, '14 New Chabad Campus Centers Opened This Year'): Chapman
    2017-02, Middlebury 2017-08, URI 2016, San Jose State 2016-08. JNS's 'A new Chabad every three days' (Nov 2022)
    names that year's new centers (Northwest Vermont; Arizona's Ahwatukee, Downtown-South Scottsdale and an Israeli
    center in Phoenix).
  - Firecrawl's research agent (`firecrawl_agent`), given 10-18 centers at a time and told to quote the sentence and
    give the page: its first batch found a dated source for all 10 (Chabad in the Hills 1997, North Hollywood 1981,
    Beach Cities 1996, Mt. Olympus ~1998, SCV ~1999, Chabad Hebrew Center 2003, Miracle Mile 2004 ...). Every quote it
    gives is then checked on the page itself before it goes in; the note says the agent found it.
- **Not a source:** the Oholei Torah alumni list's year beside each name is a class year (Rabbi Mendy Begun '2010' runs
  a center from about 2020), not a founding year.

## Free tools found on Nov 7, and moves for every center
Owner (Nov 7): "Have you been also ... finding dates of moving and old as well as new location???? ... that's a big part
of the data." Moves had been saved when a source happened to name them, but Michigan (0 of 38) and the small shetachim
(2 of 171) were done before that request and never gone back over. Now every center touched gets a move check, and the
notes already written were mined for the old places they mention (batches small-07, michigan-01, west-coast-36).
- **Chabad.org's metadata API (free, plain curl):** `https://www.chabad.org/api/content/<id>/metadata?tid=7152` returns
  `publicationDate`, the exact day a listing (or any chabad.org page: a branch page on a regional site, an About page)
  went up. It replaces the listing-number estimates ("about 2007") with a day; it still only bounds the start ('by').
  Listings from the first directory all show 2004-07-22, the day it went online. Dates for every open entry:
  scratchpad `pubdates/`. A regional site's page for a new branch dates the branch: Chabad of the Valley added
  'Porter Ranch - Rabbi Yochonon Baitelman' on 2007-04-12 and 'Lake Encino' on 2008-11-10.
- **lubavitch.com center pages (free, curl):** `https://www.lubavitch.com/centers/<id>` has the current street
  address (`<div class="address d-flex">`), so old addresses in sources can be told from the current one.
- **The Wayback Machine through Firecrawl** (curl is blocked): `web.archive.org/cdx/search/cdx?url=<site>&...` lists
  captures (1 credit); `web.archive.org/web/<timestamp>id_/<url>` returns the old page. Found this way: Bais Bezalel's
  2012 About page ('began 35 years ago' in 2012, so 1977), Chabad of Brentwood's 2008 services page ('Brentwood South:
  NEW!', at Gan Chaya on Bundy Dr.).
- **California filing histories:** BizProfile's company page (bizprofile.net/ca/<city>/<slug>) lists each Statement of
  Information with the address changes and dates (South Westwood: Glendon Ave until March 2023; Indio: Bermuda Dunes
  until Sept 2024). Its 'authorized person' pages (bizprofile.net/authorized-person/<first-last>) list a rabbi's
  corporations with filing dates. Bizapedia and the state's own bizfile site put up a bot check or paywall: not used.
- **Merkos 302's 'New Shluchim grants' lists** (news.merkos302.com; June 2022, Nov 2022, Apr 2025): dated lists of new
  couples and towns. Few of the open centers are on them.
- **The Detroit Jewish News archive, for moves:** the same search (words, earliest first) with a street name or
  number ('Lubavitch Middlebelt', '"14100" Lubavitch') dates each address. It also showed that Bais Chabad of
  Farmington Hills began in 1972 (Nov 24 1972: 'a proud new addition ... BAIS CHABAD ... at 28555 Middlebelt Road',
  Rabbi Yitschak Kagan), not 1977 (the Bergsteins' start).
- **California's childcare licenses (free, plain curl):** the state's open data (data.chhs.ca.gov, dataset
  `ccl-facilities`, CSVs "Child Care Centers" and "Family Child Care Homes", May 2025) gives every licensed preschool's
  name, licensee, address, `license_first_date`, and closures since 2020 with `closed_date`. A preschool that moves gets a
  new license at the new address, so the first date at the present address dates the present site. Found: Jewish
  Creative Preschool (licensed Dec 14 2020), The Gan in Alameda (a home daycare, Apr 2020 to Feb 2024), Burbank's preschool
  at 2415 W. Magnolia from 2011 and at 2613 from Sept 2026, the Palisades preschool's post-fire license in Santa Monica.
  Home daycares show no address. The facility pages (ccld.dss.ca.gov/carefacilitysearch/FacDetail/<number>) time out
  from here; the CSV is enough.
- **Chabad.org's centers API (free, plain curl):** `https://www.chabad.org/api/v2/chabadorg/centers/locations?id=2-<zip>&format=jsonapi&lang=en`
  returns the 50 centers nearest a ZIP code with their street addresses (the listing pages themselves are behind a bot
  check, so they are not used).
- **lubavitch.com's old center directory, 2009-2011 (Wayback, through Firecrawl):**
  `web.archive.org/web/2010id_/http://lubavitch.com/centers/list.html?Country=USA&State=CA&City=<City>` (California, all
  captured Aug 29 2010; use chabad.org's city spellings, e.g. `S.%20Monica`) and `...list.html?Country=&City=<City>`
  (any state or country, mostly Dec 28 2009, some Aug-Sept 2011) list each city's centers with street address and
  director, first 10 per city only (page 2 was not archived). Scrape with `includeTags: ["table","strong"]` to keep a
  page to ~1k tokens (1 credit). Compared with today's addresses this dated 36 California moves, 5 Michigan and 19 in
  the small shetachim ("moved after 2010"); the saved addresses are in the scratchpad (lub2010/addr2010.json,
  addr2009.json). Misses (404): Las Vegas, Simi Valley, Vista, Granite Bay, Encinitas, Napa, Moorpark, Laguna Hills,
  Vacaville, Toluca Lake, Granada Hills.
- **Instagram post dates (free, offline):** a post's shortcode (instagram.com/p/<code>) decodes to its media id
  (base64 alphabet A-Z a-z 0-9 - _), and `(id >> 23) + 1314220021721` is the posting time in ms. Checked on known posts
  (Martha's Vineyard, Oct 2022; Palisades, Dec 2024). Chabad.org's 'WELCOME! New Chabad Center in X' posts come months
  after the listing (Bexley: listing July 2025, post April 2026), so they date the post, not the start.
