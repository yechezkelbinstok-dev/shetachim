# Founding years: Mexico (started Nov 15)

Owner, Nov 15: "Check research status bc we're going down the continent to more countries", then "Start on Mexico
please" and "No mikvaos and no mushrooms". So: every blue dot in Mexico (country `MEX` in web/data/centers.geojson),
no mikvahs, no mushrooms: the Mexico shetach's 14 listings and the three Baja dots that sit in the West Coast shetach
(Tijuana, Cabo San Lucas, La Paz; their entries keep `shetach: west-coast`). 17 listings at 17 dots.

Count: `python3 work/founding-years/progress.py MEX` (a country code counts that country's dots, any shetach; the US and
Canada counts and STATUS.md are unchanged, they still leave Mexico out). Batch: `batches/mexico-01.json`.

## Where it stands (Nov 15, third round): 12 of 17 with a year, 5 left (4 of them fallback: no year until the research is done; Bosques open)

| Listing | Year | How |
|---|---|---|
| Tijuana, Chabad Baja California (Polichenco) | 1993 high | the Rebbe's consent before Yom Kippur 1993 (Chabad of Chula Vista's About page); Jewish Journal 2014 |
| Cancun (Druk) | 2 July 2007 high (5767) | Chabad.org, 6 July 2007; Chabadpedia: 5767 |
| Cozumel (Caplin, Peleg) | 2009 high (5770) | Chabadpedia and ChabadInfo (2024): 5770, from Sept 2009; 10 years in Dec 2019; 16 years in Aug 2025; against: "until January 2009" (a resident, Dec 2010) |
| Cabo San Lucas (Hershcovich) | March 2009 high | lubavitch.com, Jan 2010 |
| Playa del Carmen (Goldberg) | Sept 2010 high | Chabad.org, Oct 2010 ("established just last month") |
| Chiapas, San Cristobal (Raz) | 2011 medium | "five years" in a March 2016 profile |
| La Paz, Beth Yona (Hershcovich, Piekarski, Gutierrez) | 2012 medium | COLlive, Dec 2012: first menorah in La Paz, a beginning community led by Hershcovich; the shul built 2012 |
| Puerto Vallarta (Hecht) | late Sept 2016 high | Chabad.org, Jan 2017 |
| San Miguel de Allende (Huebner) | Nov 2018 high | lubavitch.com, March 2019 |
| Tulum (Binyamini) | 2019 high | its own About page |
| Mazatlan (Raitport) | 2026 medium | COLlive, Aug 2026 (Purim visit, move announced Chof Av) |
| Guadalajara (Srugo) | fallback (no year) | its first chabad.org listing about Jan 2011 (center number 8935; remade 2025) kept as the fallback; in charge by July 2012 (Guadalajara Reporter) |
| Mexico City, Polanco (Jabad Lubavitch México; today Mendel Mayzlesh) | 5760 (2000) medium | Chabadpedia: Rabbi Yosef Yitzchak Mayzlesh founded the Chabad House in 5760 and works in Mexico City; this is the organization's own center (chabadofmexico.com) |
| Lake Chapala, Ajijic (Srugo, Suares) | fallback (no year) | listing date 6 Nov 2025 kept as the fallback |
| Monterrey (Zalmy Srugo) | fallback (no year) | listing date 9 July 2026 kept as the fallback; Zalman Leib Liberzon is a shliach in Monterrey too (Chabadpedia, no year) |
| CTeen Cancun | fallback (no year) | listing date 19 Aug 2026 kept as the fallback |
| Bosques (Yosef Y. Mayzlesh) | open | the father's branch today; when it began is not found (the 5760 founding is on Mexico City; if Bosques was the first house, it belongs here) |

## What worked

- CrownHeights.info, COLlive, ChabadInfo and lubavitch.com through their WordPress search (the scratchpad's wps.py and
  sent.py): new-shluchim notices and arrival stories for Cancun, Cabo, Playa, Puerto Vallarta, San Miguel, Mazatlan.
- Chabad.org news articles (WebFetch reads them) and the centers' own About pages (Tulum, Chula Vista for Tijuana).
- lubavitch.com's old directory on the Wayback Machine through Firecrawl (archive.org is not reachable from here
  otherwise): `list.html?Country=Mexico` (Aug 2011: Tijuana and Cancun only) and the Dec 2009 city pages (Cabo,
  Cancun, Tijuana). 5 Firecrawl credits used in all.
- chabad.org listing numbers, dated against the news article numbers of the same sequence, show when each listing was
  made (leads only). Several Mexican listings were remade lately (Cozumel 2024, Guadalajara 2025, Chiapas 2025), so a
  recent listing number says nothing about a center's age here.

## Open, and where to look next

- **Mexico City (Mendel Mayzlesh's; Bosques now 5760 from Chabadpedia).** Was: **Mexico City and Bosques (the Mayzlesh family, the head shliach's centers).** No dated source in English, Spanish or
  Hebrew (also spelled Meislish). chabadofmexico.com says only "Founded in the mid-20th century". Diario Judio (it has a
  Dec 2024 piece naming Mexico's 11 Chabad rabbis) and anash.org sit behind bot checks: not tried, not to be forced.
  Worth asking the owner: he may know when the Mayzleshes came.
- **Guadalajara:** a real source for when the Srugos came (now LOW 2011 from its first listing).
- **La Paz:** anything before Chanukah 2012 (the first report); when the Piekarskis came (by Sept 2014).
- **Lake Chapala, Monterrey, CTeen Cancun:** LOW from their listing dates; a "new shluchim" notice would replace them.
- **Chiapas:** a report from 2010-2011 would make it high; ChabadInfo's "New Shluchim to Chiapas, Mexico" (18 Feb 2020)
  is photos only, so who it was about is unknown.

## Second round (Nov 15; owner: "That's horrible why so much sans year", "Remember u do have firecrawl")

- The owner's listing-year fallback (Nov 11, HANDOFF 4e) used where nothing else dates a center: the exact date its chabad.org
  listing went up (`https://www.chabad.org/api/content/<id>/metadata?tid=7152`, `publicationDate`), entered LOW. Not used
  where the listing is known to be late (the Mayzlesh centers) or remade (Guadalajara: its old center number dates its
  first listing instead, by its neighbours' listing dates).
- Anash.org (which has many of these "new shluchim" stories) answers 403 and Claude Code's safety check refused reading
  its Wayback copies through Firecrawl ("Unauthorized Access"), so it is out; its stories usually also run on COLlive
  or CrownHeights.info, which were searched.

## Third round (Nov 15; owner: "come on try harder I assume you looked in Spanish?", then Chabadpedia's Mexico page: "Assfuck idiot")

- Chabadpedia's Mexico page (read on Nov 3 for the sub-shetachim, the founding line missed): "בשנת תש\"ס החלה לראשונה פעילות
  קבועה וממוסדת של חב\"ד במדינה, עם הקמת בית חב\"ד על ידי הרב יוסף יצחק מייזליש". His own page: "בשנת תש\"ס יצא בשליחות הרבי
  למקסיקו, שם פועל בעיר מקסיקו סיטי". Entered on Bosques (his listing) as 5760 (`hebrewYear`), medium. Its "first in the
  country" is wrong (Tijuana 1993).
- The page lists Mexico's shluchim as of 5786: Mexico City (Mayzlesh), Playa (Chaim Brod and Baruch Kraus), Cozumel (Caplin
  and Peleg), Isla Mujeres (Moti Cohen), San Cristobal (Oren Raz), Puerto Escondido (Dani Winderbaum). Brod's page: he
  opened a Chabad House in Playa del Carmen in 5771 (for Israeli travelers; the Playa listing on the map is Goldberg's,
  Sept 2010). Zalman Leib Liberzon: shochet and shliach in Monterrey's community (no year), earlier in Mexico City.
- Spanish: Diario Judío (its WordPress search): Jabad Lubavitch México's Chanukah at the Ángel (Dec 2013); "el Rabino de
  la Jabad México, Josef Itzhak Mayzlesh" (March 2018). Nothing earlier found in nmidigital, tribuna.org.mx, itongadol,
  jabad.org.ar.

- Owner, Nov 15: "I'm shocked Mexico City is not found wtf bro": the 5760 founding moved from Bosques to Chabad Lubavitch Mexico City
  (Jabad Lubavitch México's own center, chabadofmexico.com, Calderón de la Barca 339); Bosques is open again. Owner: "the
  fallback is meant to be only applied once the research is done ... for now they should be in their seperate category": the
  listing-date years are out (confidence `fallback`, `year` null, the date in `listed`): Guadalajara, Lake Chapala, Monterrey,
  CTeen Cancun.
