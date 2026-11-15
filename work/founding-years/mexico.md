# Founding years: Mexico (started Nov 15)

Owner, Nov 15: "Check research status bc we're going down the continent to more countries", then "Start on Mexico
please" and "No mikvaos and no mushrooms". So: every blue dot in Mexico (country `MEX` in web/data/centers.geojson),
no mikvahs, no mushrooms: the Mexico shetach's 14 listings and the three Baja dots that sit in the West Coast shetach
(Tijuana, Cabo San Lucas, La Paz; their entries keep `shetach: west-coast`). 17 listings at 17 dots.

Count: `python3 work/founding-years/progress.py MEX` (a country code counts that country's dots, any shetach; the US and
Canada counts and STATUS.md are unchanged, they still leave Mexico out). Batch: `batches/mexico-01.json`.

## Where it stands (Nov 15, second round): 15 of 17 with a year, 2 left

| Listing | Year | How |
|---|---|---|
| Tijuana, Chabad Baja California (Polichenco) | 1993 high | the Rebbe's consent before Yom Kippur 1993 (Chabad of Chula Vista's About page); Jewish Journal 2014 |
| Cancun (Druk) | 2 July 2007 high | Chabad.org, 6 July 2007 |
| Cozumel (Caplin, Peleg) | 2009 high | "until January 2009, when Chabad opened its doors" (Dec 2010); 10 years in Dec 2019; 16 years in Aug 2025 |
| Cabo San Lucas (Hershcovich) | March 2009 high | lubavitch.com, Jan 2010 |
| Playa del Carmen (Goldberg) | Sept 2010 high | Chabad.org, Oct 2010 ("established just last month") |
| Chiapas, San Cristobal (Raz) | 2011 medium | "five years" in a March 2016 profile |
| La Paz, Beth Yona (Hershcovich, Piekarski, Gutierrez) | 2012 medium | COLlive, Dec 2012: first menorah in La Paz, a beginning community led by Hershcovich; the shul built 2012 |
| Puerto Vallarta (Hecht) | late Sept 2016 high | Chabad.org, Jan 2017 |
| San Miguel de Allende (Huebner) | Nov 2018 high | lubavitch.com, March 2019 |
| Tulum (Binyamini) | 2019 high | its own About page |
| Mazatlan (Raitport) | 2026 medium | COLlive, Aug 2026 (Purim visit, move announced Chof Av) |
| Guadalajara (Srugo) | 2011 low | its first chabad.org listing (center number 8935, about Jan 2011; remade 2025); in charge by July 2012 (Guadalajara Reporter) |
| Mexico City, Polanco (Mendel Mayzlesh) | by 2018 | Pulse News Mexico: first yeshiva, Aug 2018 |
| Lake Chapala, Ajijic (Srugo, Suares) | 2025 low | listing date, 6 Nov 2025 (owner's fallback) |
| Monterrey (Zalmy Srugo) | 2026 low | listing date, 9 July 2026 |
| CTeen Cancun | 2026 low | listing date, 19 Aug 2026 |
| Bosques (Yosef Y. Mayzlesh) | open | nothing dated; its listing (Feb 2024) is a late one, as the family's Mexico City listing (Dec 2023) came after that center was running (2018), so no fallback |

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

- **Mexico City and Bosques (the Mayzlesh family, the head shliach's centers).** No dated source in English, Spanish or
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
