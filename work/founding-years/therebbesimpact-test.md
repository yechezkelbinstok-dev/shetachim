# therebbesimpact.com tested against the Michigan pilot (Nov 6)

The owner found https://therebbesimpact.com/ ("The Rebbe's Global Reach — Interactive Historical Atlas") and asked
whether it can carry a big part of the founding-years work: "It seems like they also used AI but I wonder how much I
can trust them".

## What it is

- About page: "an independent initiative created and maintained by a private individual"; "not an official
  publication of Chabad-Lubavitch, Merkos L'Inyonei Chinuch"; "While every effort is made to present the information
  accurately, errors and omissions may occur." It names no sources ("publicly available records of Tanya printings,
  Chabad centers, and historical Shluchim placements") and says nothing on how it was compiled.
- Built on Lovable (an AI site builder; its preview image is a lovable.app one), TanStack Start, Leaflet.
- Points are placed at the city, not the address.

## Its data

Read from its own endpoints (`/_serverFn/…`, the compact one with ids, titles, places, categories and years):
29,001 records (the 25,000 its list endpoint and About page give is a cap).

| Category | Records |
|---|---|
| Tanya Printing | 8,097 |
| Merkos Shlichus (summer visits) | 7,071 |
| Shliach / Emissary (a couple, a place, a year) | 6,231 |
| Letters | 4,132 |
| Chabad Center | 3,151 |
| Where the Rebbe was | 228 |
| (no category name) | 91 |

About 167 of the 3,151 "Chabad Center" titles look like schools, yeshivos, preschools or camps. Our map has 4,442
listings at 3,826 dots.

## Michigan: their years against ours

Ours: `data/founding-years.json` (each year checked, most against the Detroit Jewish News archive).

| Ours | Confidence | Center | Theirs |
|---|---|---|---|
| 1958 | high | Chabad Lubavitch of Michigan, Oak Park | — |
| 1961 | high | Camp Gan Israel, Kalkaska | — |
| 1963 | medium | Congregation Mishkan Israel, Oak Park | — |
| 1965 | high | Cheder Oholei Yosef Yitzchak (boys), Oak Park | — |
| 1965 | high | Oholei Yosef Yitzchak Lubavitch, Oak Park | — |
| 1965 | high | Oholei Yosef Yitzchak — Mesivta, Oak Park | — |
| 1975 | high | Chabad House of Ann Arbor | 1975 |
| 1975 | high | Chabad Torah Center of West Bloomfield | — |
| 1977 | high | Chabad House of Western Michigan, Grand Rapids | 1977 |
| 1977 | medium | Chabad House of Farmington Hills | **1971** |
| 1985 | medium | Chabad House Lubavitch of Eastern Michigan, Flint | — |
| 1987 | high | Chabad House-Lubavitch of Greater Toledo | 1987 |
| 1990 | high | F.R.E.E. Russian Jewry Center, Southfield | 1991 |
| 1990 | high | Beis Chabad of North Oak Park | — |
| 1990 | medium | Gan Yeladim Preschool, Toledo | — |
| 1991 | high | Ganeinu Pre School, West Bloomfield | — |
| 1994 | medium | Yeshivas Lubavitch, Oak Park | — |
| 1994 | high | Michigan Jewish Institute | — |
| 1994 | high | Friendship Circle, West Bloomfield | — |
| 1994 | high | The Shul, West Bloomfield | — |
| 2002 | high | Chabad of Commerce | 2002 |
| 2004 | medium | The Friendship House | — |
| 2005 | high | Chabad of Novi | 2005 |
| 2009 | high | Chabad Jewish Centre of Windsor | **2012** |
| 2009 | low | Chabad-Lubavitch of Bingham Farms | 2009 |
| 2013 | high | Chabad of Greater Downtown Detroit | 2013 |
| 2016 | high | Chabad Jewish Center of Bloomfield Hills | 2016 |
| 2018 | high | Royal Oak Chabad Jewish Center | 2018 |
| 2018 | medium | MSU Chabad | 2017 |
| 2019 | high | Chabad Jewish Center of Troy | 2019 |
| 2022 | high | Chabad of Livonia | 2021 |
| 2023 | medium | Chabad Traverse City | 2023 |
| 2024 | high | Chabad Jewish Center of Waterford | 2024 (the couple only) |

- In it: 17 of 33. The same year 12; a year off 3 (F.R.E.E., MSU, Livonia); wrong 2:
  - Farmington Hills: theirs 1971. The Bergsteins have run it "since 1977" (Jewish News, 2023); the archive's first
    mention is April 1978.
  - Windsor: theirs 2012, the year the separate Chabad House opened (CrownHeights.info, Aug 2012); Rabbi Galperin came
    in June 2009 (the synagogue's own page).
- Not in it: 16 of 33 — the 1958 headquarters, the 1961 camp, the 1963 shul, the 1965 Cheder and Mesivta, every
  1990s mosad, Flint, West Bloomfield's Torah Center.
- Its oldest "Chabad Center" entries give a building's or a shul's own founding, not Chabad's: Colel Chabad, Brooklyn,
  1788; Congregation B'nei Ruven, Chicago, 1896.
