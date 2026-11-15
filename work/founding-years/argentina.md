# Founding years: Argentina (started Nov 15)

Owner, Nov 15: "Research Argentina" (after Central and South America, `latin-america.md`), same rules: every blue dot,
no mikvahs, no mushrooms: 72 listings at 63 dots (65 chabad.org listings and 7 from Jabad Argentina's own list,
jabad.org.ar/centros). Chabadpedia alone is LOW (owner: "chabadpedia can be used unsourced but only as low").

Count: `python3 work/founding-years/progress.py ARG`. Batches: `batches/argentina-01.json` to `argentina-04.json`.

## Where it stands (fourth round): 46 of 72 with a year (32 high), 26 left (all recorded as `range`, by their listing year)

| Dated | Year |
|---|---|
| Chabad Lubavitch Argentina HQ (Baumgarten) | 1957, 5718 (Itón Gadol: toured 1955, settled 1957; Chabadpedia: 5718) |
| Cheder Oholey Chinuch | 1974 |
| Oholey Chinuch girls' school | 1978 medium (Grunblatt: a girls' high school a month after he came) |
| Tucumán (Daniel Levy) | 4 July 1982, 12 Tammuz 5742 (AMIA) |
| Bahía Blanca (Moshe Freedman) | 1985 medium (arrived; Jabad Argentina's list: Beit Jabad Elul 5746) |
| Villa Crespo | Adar 5746, March 1986 |
| Rosario (Shlomo Tawil) | Feb 1987, 5747 (AMIA, his own words) |
| Córdoba (Yossi Turk) | 30 Dec 1989, 5750 (AMIA; COLlive: Kislev 5750) |
| La Fundación de Jabad | 1989 ('Hemos asistido desde el año 1989') |
| Villa Devoto / Villa del Parque (Stoler) | Shvat 5751, Jan 1991 |
| Kehot Sudamericana | about 1991 medium (jabad.tv: 20 years in 2011; Chabadpedia: a branch in 5742) |
| Flores (Dovid Plotka) | Elul 5752, Sept 1992 |
| Almagro (Schvetz) | Elul 5754, 1994 |
| Palermo Comunidad (Shlomo Levy) | Adar 5755, March 1995 |
| El Lazo (Shlomo Levy) | 1995 |
| Machon Or Chaya | about 1995 medium (jabad.tv: 19 years in Jan 2014) |
| Caballito (Setton) | Elul 5756, 1996 |
| Zona Norte (Benchimol) | Sivan 5757, June 1997 |
| Leoded | 5759 low (Chabadpedia) |
| Villa Urquiza (Winner) | Cheshvan 5761, Nov 2000 |
| Comedor Flores | 5761 low (Chabadpedia) |
| Recoleta (Hendel) | 2-3-2001, 5761 |
| Zona Oeste (Ludman) | 2001 (Radio Jai) |
| Olleros (Yanki Birman) | about 2001 medium (jabad.tv: 17 years in Feb 2018) |
| Ieladeinu | 2002 (first home) |
| Jabad en la City (Jalusi) | about 2002 medium (counted back) |
| La Plata (Serber) | Dec 2003, 5764 (AMIA) |
| Salta (Rafael Tawil) | Elul 5764, Sept 2004 |
| Puerto Madero (Oirechman) | 2005, 5765 (his own words; appointed Oct 2004) |
| Wolfsohn (Chabad's) | 7 March 2005, 5765 |
| ISEJ (central) | 2006, 5766 (Itón Gadol, April 2006) |
| Bariloche | 2006 (backpackers' center; Klein from 2009) |
| Congreso, the tourists' house (Lametayel) | 2006 medium (lubavitch.com: a Buenos Aires backpackers' house opened) |
| MitzvahTank | about 2015 medium (its third tour was Aug 2017) |
| Or Sinai (Sudry) | Nov 2007, 5768 medium |
| Beit Levi Yitzjak (Abraham Levy) | 2008 |
| Beit Jana | late 2008 |
| Lamas, Flores (Shiele Plotka) | June 2009, 5769 |
| Floresta (Cervantes 1034) | July 2011, 5771 medium |
| Ieshiva Anoji | 27 July 2013, 21 Av 5773 |
| Concordia (Soriano) | about 2016 medium (the Kapeluschniks' 1982-2000 shlichus had ended) |
| Mar del Plata (Lipinski) | Feb 2017, 5777 |
| Resistencia (Nochum Freedman) | summer 2024, 5784 |
| Tigre (Yacov Abudraham) | 2022 medium (New Shluchim grant, Nov 2022) |
| Paternal (Polichenco) | June 2025, 5785 (Chabad.org: 'exactly one year ago', June 2026) |
| Santa Fe (Chein) | 2026 |

## What worked

- **Jabad Argentina's own list of its centers** ('Batei Jabad en Argentina y en el mundo'), with an 'Establecido' date
  for most houses: its old site is still up at archivo.jabad.org.ar/batei-jabad (plain curl), and the July 2010 copy
  on the Wayback Machine (through Firecrawl) has a few more (Zona Norte, the old Belgrano, Concordia and Santa Fe).
- Itón Gadol and Radio Jai (WordPress search, open): Radio Jai's 2020 'Conociendo al Rabino ...' profiles.
- jabad.tv (Jabad Argentina's video site, WordPress API open): short profiles with anniversaries ('17 años de labor',
  'cumple 19 años', 'Or Sinai 10 años', Kehot's '20 años').
- An Instagram post's date can be read from its ID: shortcode in base64url to a number, then (number >> 23) +
  1314220021721 ms is the time (checked on three posts of known date). Used for Chabad.org's Paternal post.

- **AMIA's Vaad Hakehilot directory** of the interior's communities (vaadhakehilot.amia.org.ar/kehilot/...; plain curl
  works, its REST API does not): each kehilá's own text, with an "Año de inauguración". Gave Tucumán, Córdoba,
  Rosario, La Plata, Bahía Blanca, Mar del Plata; Salta ("Noventa años después" of 1914) and Bariloche (no year) need more.
- WordPress search of COLlive, CrownHeights.info, lubavitch.com and jabad.org.ar (scratchpad wps.py); COLlive's
  photo-only posts through Firecrawl (the Lamas opening, June 2009).
- COL's Hebrew news (col.org.il/news/2936: Flores 5752) and Chabadpedia's shliach pages (Firecrawl scrape of its API).
- chabad.org's metadata API (`/api/content/<id>/metadata?tid=7152`, plain curl) for each listing's first date: the
  `by` bound for anything still open, and the fallback at the very end.

## Open, and where to look next

26 listings, each entered as `range` with its listing year as `by` (no fallback yet: the owner's rule):
the schools' preschool, Tzivos Hashem, Beit Menachem, Lavalle, Córdoba Centro, the soup kitchen (by 2004);
Palermo Soho, Etz Hajaim, Once - Litvische Shul, Palermo Nuevo, the Kehot showroom (by 2007); Centro Médico
Maimónides (by 2011); Barrio Norte - Agüero (2016), Nordelta (2017), Chacarita (2018), Caballito Sur (2019),
Pilar and Bajo Belgrano (2024), ISEJ Belgrano (2025); San Fernando - Tigre (2010-2014), Barracas (by 2015, maybe
2013), Aieka (by 2015); Jabad Argentina's own four (Vicente López, Avellaneda, Yerba Buena, Beit Menajem Belgrano).
Next: the houses' Instagram/Facebook pages through search excerpts (dates from the post IDs), COL's Hebrew news,
the 'New Shluchim' grant lists (CrownHeights.info) for 2023-2025, and jabad.tv's videos themselves.
