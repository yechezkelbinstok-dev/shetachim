# Founding years: the West Coast shetach (started Nov 6)

Owner (Nov 6): "start on the West Coast ... Do this fucking properly"; every blue dot gets a year; therebbesimpact.com
"most of them are right ... a lot of them are wrong, and he also definitely doesn't have all of them" (a lead only);
a month or a day when it turns up, not hunted ("a little extra data never hurt nobody": the `date` field); keep track
of what's missing (`python3 work/founding-years/status.py` -> STATUS.md) for a later round of the hard ones.

Scope: 334 listings at 304 dots — California 284 dots, Nevada 17, Baja California (Mexico) 3. California first.
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
