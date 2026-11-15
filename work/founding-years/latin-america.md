# Founding years: Central and South America, no Argentina or Brazil (started Nov 15)

Owner, Nov 15: "Central and South sans Argentina and Brazil now" (after Mexico, `mexico.md`), and for Mexico: "No mikvaos
and no mushrooms". So: every blue dot in Guatemala, Nicaragua, Costa Rica, Panama, Colombia, Venezuela, Ecuador, Peru,
Chile, Uruguay and Paraguay, no mikvahs, no mushrooms: 40 listings at 39 dots. Belize, Honduras, El Salvador and
Bolivia have only mushrooms. The Caribbean islands (16 listings) are not part of this.

Count: `python3 work/founding-years/progress.py GTM NIC CRI PAN COL VEN ECU PER CHL URY PRY`. Batch: `batches/latam-01.json`.

## Where it stands (Nov 15, second round): 36 of 40 with a year (20 high), 4 left

| Country | Dated | Left |
|---|---|---|
| Venezuela | Caracas, San Bernardino (Perman) May 1975 | Altamira (Rosenblum) and Or Jabad preschool: by 2004 (first-directory listings) |
| Chile | Santiago (Perman) 1981; Pucon 2009 low (listing; planned for Chanukah 2008) | - |
| Colombia | Bogota (Rosenfeld) 1981; Barranquilla (Liberow) 1990; Medellin (Wanono) 2016 (its own site); San Andres Sukkot 2022; Cali 2014, Cartagena 2017, Salento 2022 (all low, listing dates) | - |
| Uruguay | Montevideo (Shemtov) 1985 | Punta del Este: by 2011 (summers; no listing) |
| Costa Rica | San Jose/Escazu (Spalter) 1987 medium (or 1989); Santa Teresa Sukkot 2021; Jaco 2022 (its own site); Tamarindo June 2023; La Fortuna June 2026 | Camp Gan Israel: by 2004 |
| Peru | Lima (Blumenfeld) 1987; Cusco (Kripor) 2006; Pisac April 2023 | - |
| Paraguay | Asuncion (Forma) 1988 | - |
| Panama | Beth El 1986 medium (Rabbi Zushe Wilhelm, 5746; Laine from 1994); Boquete Aug 2016; Mitzva Tank Dec 2020; CTeen 2020 and Bocas del Toro 2020 (first mentions); Playa Venao 2021; Chabad Panama (Karniel) 2015, Kolel Torah 2022, Tora Or 2023, Ohaley Chinuch 2020, the Boquete bakery 2018 (low, listing dates) | - |
| Guatemala | Guatemala City (Pelman) 2000 medium; Antigua (Silber) 2017 low (listing) | - |
| Nicaragua | San Juan del Sur (Atar) 2012 (its own site) | - |
| Ecuador | Guayaquil (Tawil, then Fried) 2012; Montanita (Hus) March 2026 | - |

Second round (owner: "That's horrible why so much sans year", "Remember u do have firecrawl"): the Israeli-run houses'
own sites (one template, "נוסד על ידי ... בשנת") dated Medellin, Nicaragua and Jaco; COLlive's Panama stories moved Beth
El back to Wilhelm (5746); the rest take the owner's listing-year fallback (LOW; see `mexico.md`). Anash.org is out:
the safety check refused its Wayback copies too.

## What worked

- The WordPress search of CrownHeights.info, COLlive, ChabadInfo and lubavitch.com (scratchpad wps.py, sent.py): most
  of the dates, including the older ones (lubavitch.com 2003-2010 profiles: Bogota, Barranquilla, Chile, Paraguay).
- JTA's archive (Venezuela 1975, Costa Rica 1987) and Chabad.org articles (WebFetch reads them).
- lubavitch.com's old directory on the Wayback Machine through Firecrawl: country pages from Jan 2010 and June 2012
  gave earlier addresses (Guatemala City, Cusco). 7 Firecrawl credits for this part.
- Listing dates from chabad.org listing numbers, matched to dated news article numbers (leads only).

## Open, and where to look next

- Spalter's year: 1987 (JTA 2005, Hadassah 2006) against his own "since 1989" (lubavitch.com 2010).
- Panama City's newer institutions (Tora Or, Ohaley Chinuch, Kolel Torah, the Israeli center) are LOW from listing dates:
  real sources would replace them.
- Cali (Slonim), Cartagena (Globerman), Salento (Friedman): LOW from listing dates; "new shluchim" notices would replace them.
- Venezuela's Altamira center and preschool; Pucon's opening (the Dec 2008 Hebrew report).
