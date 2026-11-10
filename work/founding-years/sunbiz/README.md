# Florida registry (Sunbiz) name lists

Every entity name in the Florida Division of Corporations' alphabetical name list (search.sunbiz.org) that starts
with a given word, saved as data for low/medium filing-year fallbacks (owner, Nov 10: "I need a way where every
listing can be scraped as data into a file").

- `names.tsv`: document number, name, status, and the filing year read off the document number. Florida numbers
  since the mid-1990s are a letter, the two-digit filing year, then a sequence: `N03000009759` is a nonprofit filed
  in 2003 (`N` nonprofit, `P` profit corporation, `L` LLC, `W` a rejected or pending filing). Older numbers carry
  no year; the entity's own Sunbiz page has the date filed.
- Status: `Active`, `INACT` (inactive), `INACT/UA`, or `NAME HS`, a former name of the entity with that number.
- Sunbiz sorts by the name without "OF", "THE" and punctuation, so "CHABAD OF BOCA RATON" files under B.
- Fetched through Firecrawl's catalogued Sunbiz provider (`search-sunbiz-org`, `entities/search`, 5 credits for each
  page of 20 names, following `next_cursor`), after the owner had the Firecrawl scrape tool allowed (Nov 10).
  Sunbiz itself sits behind a Cloudflare check, so plain requests get a 403.
- `add_page.py` appends a page (tab-separated rows on stdin) and rewrites `names.tsv` sorted and deduplicated.

Progress: "CHABAD..." names from the start (CHABAD ALBERTVILLE LLC) through CHABAD LUBAVITCH OF SOUTHWEST FLORIDA
(10 pages, 200 rows, Nov 10). Next cursor for the CHABAD walk:
`https://search.sunbiz.org/Inquiry/CorporationSearch/SearchResults?InquiryType=EntityName&inquiryDirectionType=ForwardList&searchNameOrder=CHABADLUBAVITCHSOUTHWESTFLORID%20N479070&SearchTerm=CHABAD&entityId=N47907&listNameOrder=CHABADLUBAVITCHNORTHBROWARDPAL%20N420670`

A filing year is only a fallback: compare it with the listing's chabad.org publication date, and use it only when
nothing earlier shows the center (HANDOFF section 4b).
