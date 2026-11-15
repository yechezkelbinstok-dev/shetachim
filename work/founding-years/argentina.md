# Founding years: Argentina (started Nov 15)

Owner, Nov 15: "Research Argentina" (after Central and South America, `latin-america.md`), same rules: every blue dot,
no mikvahs, no mushrooms: 72 listings at 63 dots (65 chabad.org listings and 7 from Jabad Argentina's own list,
jabad.org.ar/centros). Chabadpedia alone is LOW (owner: "chabadpedia can be used unsourced but only as low").

Count: `python3 work/founding-years/progress.py ARG`. Batches: `batches/argentina-01.json`.

## Where it stands (first round): 23 of 72 with a year (17 high), 49 left

| Dated | Year |
|---|---|
| Chabad Lubavitch Argentina HQ (Baumgarten) | 1955 medium (Chabad.org; Chabadpedia: settled 5718) |
| Cheder Oholey Chinuch | 1974 |
| Kehot | 5742 low (Chabadpedia) |
| Tucumán (Daniel Levy) | 4 July 1982, 12 Tammuz 5742 (AMIA) |
| Bahía Blanca (Moshe Freedman) | 1985 |
| Rosario (Shlomo Tawil) | Feb 1987, 5747 (AMIA, his own words) |
| Córdoba (Yossi Turk) | 30 Dec 1989, 5750 (AMIA; COLlive: Kislev 5750) |
| Flores (Dovid Plotka) | 5752 (COL, Jan 2004) |
| El Lazo (Shlomo Levy) | 1995 |
| Leoded | 5759 low (Chabadpedia) |
| Comedor Flores | 5761 low (Chabadpedia) |
| Ieladeinu | 2002 (first home) |
| Jabad en la City (Jalusi) | about 2002 medium (counted back) |
| La Plata (Serber) | Dec 2003, 5764 (AMIA) |
| Puerto Madero (Oirechman) | Oct 2004, 5765 |
| Wolfsohn (Chabad's) | 7 March 2005, 5765 |
| Bariloche | 2006 (backpackers' center; Klein from 2009) |
| Beit Jana | late 2008 |
| Lamas, Flores (Shiele Plotka) | June 2009, 5769 |
| Concordia (Soriano) | about 2016 medium (the Kapeluschniks' 1982-2000 shlichus had ended) |
| Mar del Plata (Lipinski) | Feb 2017, 5777 |
| Resistencia (Nochum Freedman) | summer 2024, 5784 |
| Santa Fe (Chein) | 2026 |

## What worked

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
