# Founding years: Central and South America, no Argentina or Brazil (started Nov 15)

Owner, Nov 15: "Central and South sans Argentina and Brazil now" (after Mexico, `mexico.md`), and for Mexico: "No mikvaos
and no mushrooms". So: every blue dot in Guatemala, Nicaragua, Costa Rica, Panama, Colombia, Venezuela, Ecuador, Peru,
Chile, Uruguay and Paraguay, no mikvahs, no mushrooms: 40 listings at 39 dots. Belize, Honduras, El Salvador and
Bolivia have only mushrooms. The Caribbean islands (16 listings) are not part of this.

Count: `python3 work/founding-years/progress.py GTM NIC CRI PAN COL VEN ECU PER CHL URY PRY`. Batch: `batches/latam-01.json`.

## Where it stands (Nov 15, fourth round): 29 of 40 with a year (23 high), 11 left (6 of them fallback, no year until the research is done)

| Country | Dated | Left |
|---|---|---|
| Venezuela | Caracas, San Bernardino (Perman) May 1975 (5735) | Altamira (Rosenblum) and Or Jabad preschool: by 2004 (first-directory listings) |
| Chile | Santiago (Perman) 1981 (5742, Chabadpedia); Pucon 2009 low (listing; planned for Chanukah 2008) | - |
| Colombia | Bogota (Rosenfeld) 1981; Barranquilla (Liberow) 1990; Medellin (Wanono) 2016 (its own site; Chabadpedia: Bigio opened a house there in 5776); San Andres Sukkot 2022; Cali 2014, Cartagena 2017, Salento 2022 (all low, listing dates) | - |
| Uruguay | Montevideo (Shemtov) 1985 | Punta del Este: by 2011 (summers; no listing) |
| Costa Rica | San Jose/Escazu (Spalter) 1987 medium (or 1989); Santa Teresa Sukkot 2021; Jaco 2022 (its own site); Tamarindo June 2023; La Fortuna June 2026 | Camp Gan Israel: by 2004 |
| Peru | Lima (Blumenfeld) 16 Cheshvan 5748, 8 Nov 1987; Cusco (Kripor) Adar 5766, March 2006; Pisac April 2023 | - |
| Paraguay | Asuncion (Forma) 1988 (5749, Chabadpedia) | - |
| Panama | Beth El 1986 medium (Rabbi Zushe Wilhelm, 5746; Laine from 1994); Boquete Aug 2016; Mitzva Tank Dec 2020; CTeen 2020 and Bocas del Toro 2020 (first mentions); Playa Venao 2021; Chabad Panama (Karniel) 2015, Kolel Torah 2022, Tora Or 2023, Ohaley Chinuch 2020, the Boquete bakery 2018 (low, listing dates) | - |
| Guatemala | Guatemala City (Pelman) 5760 (2000) medium; Antigua (Silber) 2017 low (listing) | - |
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

- Spalter's year: 1987 (JTA 2005, Hadassah 2006) against his own "since 1989" (lubavitch.com 2010). Chabadpedia (Blumenfeld's
  page): in spring 1987 Merkos offered Blumenfeld Mexico, Costa Rica or Switzerland, so Costa Rica had no shliach then.
- Panama City's newer institutions (Tora Or, Ohaley Chinuch, Kolel Torah, the Israeli center) are LOW from listing dates:
  real sources would replace them.
- Cali (Slonim), Cartagena (Globerman), Salento (Friedman): LOW from listing dates; "new shluchim" notices would replace them.
- Venezuela's Altamira center and preschool; Pucon's opening (the Dec 2008 Hebrew report).

## Third round (Nov 15; owner: "come on try harder I assume you looked in Spanish?")

Chabadpedia (Hebrew) through its API (HANDOFF, "Chabadpedia, how"): the category שלוחים באמריקה הדרומית (Bigio, Blumenfeld,
Brod of El Salvador, Feigelstock, Menashe and Moshe Perman, Kopchik of Bolivia, Kripor, Rotem of Quito, Shemtov) and
Shalom Pelman's page. Hebrew years now in the data (`hebrewYear`, batch `latam-03`): Guatemala City 5760, Lima
16 Cheshvan 5748, Santiago 5742, Asuncion 5749 (Forma; Feigelstock from 5765), Cusco Adar 5766 (ChabadInfo, 21 Adar 5766:
"for the first time a permanent Chabad House for travelers in Cusco"), Caracas 5735, Medellin 5776. Nothing there for
Panama, Costa Rica (Spalter has no page), Pucon, Cali, Cartagena, Salento, Antigua, Altamira or Or Jabad (Moshe Perman's
page: he "later" opened the Or Chabad schools; his sons-in-law Rosenblum and Slavin are in Caracas). Tomer Rotem founded a
Chabad House in Quito before Purim 5764 (2004): not a listing on the map. The centers' own sites (Spanish and Hebrew
patterns too) gave no years: chabadpanama.com, chabadbocas.org ("founded by Rabbi Moti and Sarit Cohen"),
chabadsalento770.com, chabadajijic.com, chabadcozumel.com; jabadve.com, ChabadCostaRica.com, ChabadGuatemala.com,
ChabadCartegena.com, ChabadAntiguaGuatemala.com, jabadmx.com, jewishcancun.com answer 403 to plain requests.

## The fallback taken out (Nov 15)

Owner: "u idiot the fallback is meant to be only applied once the research is done and we haven't found anything like meaning
in ages from now when we push this stuff to the growth page for now they should be in their seperate category of being from
the chabad.org fallback or whatever". So the listing-date years are out: confidence `fallback`, `year` null, the listing date
in `listed` (Panama: Chabad Panama, Ohaley Chinuch, Kolel Torah, Tora Or, the Boquete bakery; Colombia: Cali, Cartagena,
Salento; Guatemala: Antigua; Chile: Pucon). They count as left (progress.py prints them apart). Each still wants a real source.

## Fourth round (Nov 15, batch `latam-04`)

- Pucon: COL, 10 Kislev 5769 (7 Dec 2008, https://col.org.il/news/43154): Chabad of Chile "מקים כעת בית חב"ד נוסף בעיר פוקון", in
  memory of the Holtzbergs, "יחל לתפקד באופן מלא בחנוכה" under Rabbi Elimelech and Goldi Perman: 2008, 5769, high.
- Or Jabad (Caracas): Jabad Venezuela's article of 10 Jan 2008 (chabad.org 624166): founded by Chaya Perman, "tiene 30 años
  abierto": about 1978, medium. Encyclopaedia Judaica (2007): "In 1984, a congregation of Lubavitch Chabad was established in
  Caracas; it came to possess an impressive synagogue" (which center not said; Altamira's Hogar Jabad José y Sara Lerner,
  under Rabbi Yehoshua (Shui) Rosenblum, director of Jabad Lubavitch del Este, by Dec 2008).
- Playa Venao: Jüdische Allgemeine, 12 May 2023 ("Surfen im Paradies"): "Vor zwei Jahren ... in Playa Venao", under Rabbi
  Yariv Klein: with COLlive's Pesach 2021, high. The same article: Klein's first house was Bocas del Toro, opened after his 2013
  decision (no year), so Bocas may be older than its 2020 first report.
- Kolel Torah Panama: first mention ChabadInfo, 19 Dec 2022 (yeshiva gedola "Kollel Torah", Rosh Yeshiva Shuchat): 2022, medium.
- Monterrey: first mention COLlive, 13 July 2026: 2026, medium.
- Cartagena: range 2015-2017 (no house in March 2015; listed Oct 2017). The Boquete bakery: range 2016-2018 (the bakery opened
  about 27 Oct 2013, Panama Prattle; under Chabad after Aug 2016; listed Aug 2018).
- Not found: Chabad Panama (Karniel; a NY Jewish Travel Guide interview, undated: "over eight years ago"), Ohaley Chinuch, Tora
  Or, Cali, Salento, Antigua; Spalter (a Detroit Jewish News piece of 15 Dec 1995 has Chabad in Costa Rica "less than a decade",
  per a search summary; the archive answers 403).
