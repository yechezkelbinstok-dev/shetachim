# Founding years: Argentina (started Nov 15)

Owner, Nov 15: "Research Argentina" (after Central and South America, `latin-america.md`), same rules: every blue dot,
no mikvahs, no mushrooms: 72 listings at 63 dots (65 chabad.org listings and 7 from Jabad Argentina's own list,
jabad.org.ar/centros). Chabadpedia alone is LOW (owner: "chabadpedia can be used unsourced but only as low").

Count: `python3 work/founding-years/progress.py ARG`. Batches: `batches/argentina-01.json`, `argentina-02.json`.

## Where it stands (second round): 35 of 72 with a year (28 high), 37 left

| Dated | Year |
|---|---|
| Chabad Lubavitch Argentina HQ (Baumgarten) | 1957, 5718 (Itón Gadol: toured 1955, settled 1957; Chabadpedia: 5718) |
| Cheder Oholey Chinuch | 1974 |
| Kehot | 5742 low (Chabadpedia) |
| Tucumán (Daniel Levy) | 4 July 1982, 12 Tammuz 5742 (AMIA) |
| Bahía Blanca (Moshe Freedman) | 1985 medium (arrived; Jabad Argentina's list: Beit Jabad Elul 5746) |
| Villa Crespo | Adar 5746, March 1986 |
| Rosario (Shlomo Tawil) | Feb 1987, 5747 (AMIA, his own words) |
| Córdoba (Yossi Turk) | 30 Dec 1989, 5750 (AMIA; COLlive: Kislev 5750) |
| Villa Devoto / Villa del Parque (Stoler) | Shvat 5751, Jan 1991 |
| Flores (Dovid Plotka) | Elul 5752, Sept 1992 |
| Almagro (Schvetz) | Elul 5754, 1994 |
| Palermo Comunidad (Shlomo Levy) | Adar 5755, March 1995 |
| El Lazo (Shlomo Levy) | 1995 |
| Caballito (Setton) | Elul 5756, 1996 |
| Zona Norte (Benchimol) | Sivan 5757, June 1997 |
| Leoded | 5759 low (Chabadpedia) |
| Villa Urquiza (Winner) | Cheshvan 5761, Nov 2000 |
| Comedor Flores | 5761 low (Chabadpedia) |
| Recoleta (Hendel) | 2-3-2001, 5761 |
| Zona Oeste (Ludman) | 2001 (Radio Jai) |
| Ieladeinu | 2002 (first home) |
| Jabad en la City (Jalusi) | about 2002 medium (counted back) |
| La Plata (Serber) | Dec 2003, 5764 (AMIA) |
| Salta (Rafael Tawil) | Elul 5764, Sept 2004 |
| Puerto Madero (Oirechman) | 2005, 5765 (his own words; appointed Oct 2004) |
| Wolfsohn (Chabad's) | 7 March 2005, 5765 |
| Bariloche | 2006 (backpackers' center; Klein from 2009) |
| Or Sinai (Sudry) | Nov 2007, 5768 medium |
| Beit Levi Yitzjak (Abraham Levy) | 2008 |
| Beit Jana | late 2008 |
| Lamas, Flores (Shiele Plotka) | June 2009, 5769 |
| Concordia (Soriano) | about 2016 medium (the Kapeluschniks' 1982-2000 shlichus had ended) |
| Mar del Plata (Lipinski) | Feb 2017, 5777 |
| Resistencia (Nochum Freedman) | summer 2024, 5784 |
| Santa Fe (Chein) | 2026 |

## What worked

- **Jabad Argentina's own list of its centers** ('Batei Jabad en Argentina y en el mundo'), with an 'Establecido' date
  for most houses: its old site is still up at archivo.jabad.org.ar/batei-jabad (plain curl), and the July 2010 copy
  on the Wayback Machine (through Firecrawl) has a few more (Zona Norte, the old Belgrano, Concordia and Santa Fe).
- Itón Gadol and Radio Jai (WordPress search, open): Radio Jai's 2020 'Conociendo al Rabino ...' profiles.

- **AMIA's Vaad Hakehilot directory** of the interior's communities (vaadhakehilot.amia.org.ar/kehilot/...; plain curl
  works, its REST API does not): each kehilá's own text, with an "Año de inauguración". Gave Tucumán, Córdoba,
  Rosario, La Plata, Bahía Blanca, Mar del Plata; Salta ("Noventa años después" of 1914) and Bariloche (no year) need more.
- WordPress search of COLlive, CrownHeights.info, lubavitch.com and jabad.org.ar (scratchpad wps.py); COLlive's
  photo-only posts through Firecrawl (the Lamas opening, June 2009).
- COL's Hebrew news (col.org.il/news/2936: Flores 5752) and Chabadpedia's shliach pages (Firecrawl scrape of its API).
- chabad.org's metadata API (`/api/content/<id>/metadata?tid=7152`, plain curl) for each listing's first date: the
  `by` bound for anything still open, and the fallback at the very end.

## Open, and where to look next

Buenos Aires' neighbourhood houses (Villa Crespo, Palermo Comunidad, Villa Devoto, Almagro, Recoleta, Caballito,
Or Sinai, Lavalle, Once, Olleros, Villa Urquiza, Etz Hajaim, Congreso, Palermo Nuevo, Palermo Soho (listed Feb 2007;
its new building opened Aug 2009), Floresta, Barracas, Chacarita, Caballito Sur, Levi Yitzjak, Bajo Belgrano,
Paternal, Barrio Norte), Zona Norte and Zona Oeste, Tigre, San Fernando, Nordelta, Pilar, Salta, Córdoba Centro,
the schools (girls' school, preschool), Tzivos Hashem, Or Chaya, Beit Menachem, MitzvahTank, Aieka, ISEJ, the soup
kitchen, the Judaica showroom, Centro Médico Maimónides, and Jabad Argentina's own seven (Vicente López, Avellaneda,
Yerba Buena, Ieshiva Anoji, La Fundación, Beit Menajem Belgrano).
