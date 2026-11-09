# Founding years: New York City (the `new-york-city` shetach, not Crown Heights)

Started Nov 9 (owner: "Start on new york metro ig", then "Not crown heights"). 200 listings on 176 dots: the five
boroughs (Crown Heights apart), Long Island and Westchester. Method as in `five-shetachim.md`:
- each listing searched by name and director;
- sources read raw (curl) before a year rests on them;
- a free sweep of CrownHeights.info and lubavitch.com through their WordPress search (COLlive and Anash refuse plain
  requests);
- chabad.org listing dates from the metadata API: 70 of the 200 went up with the first online directory
  (2004-07-22).

## Batches
- `new-york-city-01`: Lubavitch of Long Island 1977 (Teldon; Stony Brook first, Commack after six years), Mineola
  1990, the West Side 1984, Riverdale 1992, the Five Towns 1994, Brooklyn Heights Sept 1988, Great Neck 1990, the Chai
  Center 1993.
- `new-york-city-02`: Port Washington 1991, Northeast Queens 1991, Stony Brook (Village Chabad) 1987, Kensington 1993,
  Southampton 1996 (first mention; full time 1999), Oceanside 2000, West Hempstead 2002, the Rivertowns about 2003,
  Columbia 1984 (Kugel's cart), the Upper East Side summer 1991.

- `new-york-city-03` to `-09`: the Commack shul about 1983, Wall Street 1999, the Hamptons 2004, Briarcliff 2003,
  F.R.E.E. of Brighton Beach 1988, Mazel Day School 2002, the Georgian center 1992, Staten Island about 1987,
  Westchester 1993, Melville 1991; from the news sweep (CrownHeights.info and lubavitch.com, read raw) Hunter College
  1999, Sea Gate 1991, F.R.E.E.'s brit milah center 1972, Old Westbury 1992, Roosevelt Island and Larchmont 2006,
  Pratt and North Brooklyn 2003, NYU about 2002, Bushwick about 2005, Greenpoint and the North Fork 2014, Montauk and
  the West Village 2018, Sea Cliff 2023, Tottenville 2025; from the new-shluchim reports Prospect Heights East 2005,
  Midtown about 1996, Merrick 2006, Forest Hills 2006, Massapequa and Battery Park City 2010, the medical centers and
  Forest Hills North 2012; Park Slope 1987, West Brighton 1991, Rego Park 1997, the Lower East Side 2004, Harlem and
  Little Neck 2005, Kings Highway 2006, the Ohel visitors' center 1995, Kingsborough about 1998.
- `new-york-city-10` (bounds): the 136 still without a year get a 'by': the day their chabad.org listing went up
  (metadata API), or the IRS recognition date where an organization of the same name and place has an earlier one
  (ProPublica; e.g. Lubavitch of the East End 1991, Roslyn 1995, Sheepshead Bay 2000, Bedford 2003). They are the
  list to work on next.

## Tools that worked here
- CrownHeights.info and lubavitch.com answer their WordPress search (`/wp-json/wp/v2/search`, `/wp-json/wp/v2/posts`)
  to plain requests; every 'New Shluchim' post (about 4,000 titles) can be listed that way and matched by place.
- COLlive and Anash refuse plain requests: Firecrawl with `includeTags: ["article"]` reads a COLlive article for 1
  credit, compactly.
- ProPublica's API gives IRS ruling dates for free (search by name with `state[id]=NY`).

## Still open (searched, nothing dated)
Flatbush (Liberow), Manhattan Beach, Sheepshead Bay, Boro Park, Kew Gardens (Tuvel), Flushing, Eastern Queens,
Valley Stream, Oyster Bay, the East End (Coram), Roslyn, Brookville, Bedford, Water Mill, Patchogue, Far Rockaway,
Bay Ridge, Bensonhurst, Stony Brook University, Heichal Menachem, Mayan Yisroel, the Westchester centers after 1993
(Yonkers, White Plains, Yorktown, Armonk, Eastchester, Pelham, Scarsdale), and most centers listed after 2008.
