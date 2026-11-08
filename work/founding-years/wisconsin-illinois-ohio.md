# Founding years: Wisconsin, Northeast Ohio (Cleveland), Illinois

Third session, from Nov 8 (owner: "Wisconsin, Illinois, Cleveland next."). Method as in `west-coast.md` and
`michigan-pilot.md`: each listing searched by name; sources read raw (curl, or Firecrawl markdown) before a year rests
on them, never WebFetch; chabad.org listing dates (`api/content/<id>/metadata?tid=7152`) and lubavitch.com addresses
for every listing. Goal: high confidence (owner, Nov 8), so mediums and ranges say why they are not high.

## Wisconsin (batch wisconsin-01): 23 listings, 14 with a year (14 of 20 dots), 9 high
- The Wisconsin Jewish Chronicle (jewishchronicle.org) carries nearly every story. Its WordPress search works
  (`/wp-json/wp/v2/posts?search=...&orderby=relevance`). Its pre-2008 articles were bulk-imported with the date
  31 March 2008, so their true date has to come from the text (for example the "fiscal year 2004-2005" in the Hillel
  Academy story); notes say "undated, filed 31 March 2008".
- Lubavitch of Wisconsin: October 1968 (the Chronicle, 2019), confirmed by the JTA of 25 Nov 1968 (the seventh
  regional office in the US). Headquarters at 3109 N. Lake Drive since 1973 (Lubavitch News Service, Aug 1973).
- Madison: the Matusofs arrived in fall 1980 (three sources). Medium, not high: the Daily Cardinal (2006) says Chabad
  "first appeared at UW-Madison in 1972" and the Chronicle (2019) names a Madison Chabad House in 1970; who ran it is
  not found. A lead for a later pass.
- Downtown Milwaukee: 1990 (the Chronicle, 2009: Rabbi Samuels came in 1980 as education director and opened Chabad
  of Downtown in 1990). The "30 years" in that story is his time in Milwaukee, not the center's.
- Bader Hillel Academy: Hillel Academy is a community day school founded in 1960; Lubavitch took over its management
  from the 2004-05 school year. Year 2004 (medium: the story is undated, and the Chinuch Office directory says 1996).
- Friendship Circle: began in summer 2003 (the undated "began this past summer" story, read with the June 2004
  "Ten years after" story that calls it new); Rabbi Levi Stein has run it since 2017.
- Ranges (9): the Madison mikvah (1980-2004), the East Side (by 2004), The Shul in Bayside (by about 2000: a member of
  "about 10 years" in Jan 2010), the Mequon preschool (after about 1988, by 2004; the Chinuch directory's 1969 is
  impossible), UW-Milwaukee (by its 2011 listing; Rabbi Thaler in 2012, the Voskoboyniks since 2024), Glendale (by
  2015), Ovation, the old Jewish Home (Rabbi Emmer there by May 2012), Wauwatosa (by 2024), Bay View (by 2026).
- IRS rulings (ProPublica, free) for 15 Wisconsin Chabad corporations are in the notes where they help; most are
  years after the start, so they are only bounds.
- Firecrawl: 2 credits (Glendale's chabad.org-hosted site, which gave no year). Running total this session: 20.

## Northeast Ohio (batch northeast-ohio-01): 27 listings, 23 with a year (22 of 23 dots), 20 high
- The whole shetach (Rabbi Leibel Alevsky's): Cleveland and its suburbs, Akron-Canton, Kent State, Oberlin, Ohio
  University in Athens, the West Side (Westlake, Lakewood), Solon, Twinsburg, Chagrin Falls, Lyndhurst, Shaker Heights.
- The Cleveland Jewish News (BLOX, from 2000) answers JSON searches like the Phoenix paper:
  `https://www.clevelandjewishnews.com/search/?f=json&q="<phrase>"&t=article&l=8&s=start_time&sd=asc` (add
  `&d1=YYYY-MM-DD&d2=YYYY-MM-DD` for a date window).
- One article dates most of the shetach: the CJN of 3 July 2014, "Chabad extends outreach from eight Northeast Ohio
  locations" (the Kazens 1953, Chabad of Cleveland 1972, the kosher food bank 1974, Akron-Canton 1981, Rabbi Chaikin
  1981, Cleveland Heights 1984, Solon 1991, Friendship Circle 2003, Fromovitz 2009, Oberlin 2010, Downtown 2011, CWRU
  2012, Lyndhurst January 2014). Rabbi Alevsky's obituary (CJN, 24 April 2026) and Rabbi Zalman Kazen's (CJN, 13 July
  2011) add the rest of the early history.
- Tzemach Tzedek (Zemach Zedek): the year is the Kazens' arrival, 1953. The congregation itself is older (the Madorsky
  family's Nusach Ari Shul; it moved to Cleveland Heights in 1957); its founding year is not found.
- Semach Sedek (the Kazens' Russian Immigrant Aid Society synagogue, now at the original Chabad House, 2004 S. Green
  Road): "early 1970s", kept as a range 1970-1975.
- Mediums: Akron-Canton (1981 in 2014, but the 2018 obituary says the Sasonkins came in 1989 "to form" it), Chabad of
  Beachwood (Rabbi Chaikin's start in 1981; the branch's own start is not stated), Camp Gan Israel of Beachwood (the CJN
  in Aug 2009: "more than doubled in its second year", so 2008; the 2014 article says 2009).
- Ranges: Semach Sedek, the Akron Hebrew school (1989-2007), Chabad's Enrichment Programs (by its April 2008 listing),
  CYP Cleveland (2011-2022).
- No Firecrawl used.
