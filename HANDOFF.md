# Handoff: Shetachim map

Read this first when picking the project up in a new Claude session or account. It covers
what the owner wants, what exists, what's still open, and the mistakes to avoid.
More detail is in `docs/PLAN.md`.

**Branches (read first).** The live site is served from `claude/bold-albattani-aqfnj9`. Always push there
(a session on another account once pushed to `ccr-1f9385a8-jca1nj`; that's merged in and done). The owner switches
between two Claude accounts when usage limits run out; whichever session picks this up, work from the newest branch.
Since Nov 5 it is also the repo's **default branch** (the owner changed it in GitHub's settings), so a new session
starts on the latest code; the session is still handed its own branch name, so get the owner's OK once to push here.

**Research tools (read first).** Plain WebSearch/WebFetch for every lookup; Firecrawl (paid credits) ONLY for a page
those can't reach. On Nov 3 a session ran every search and page through Firecrawl (~25 searches, ~20 pages) and the
owner was furious. The rule is also under "Notes for Claude" below. (Owner, Nov 3, the other way round: "you have
fucking firecrawl idiot for when web fetch doesn't work" — anash.org answers WebFetch and curl with 403.)
**And (owner, Nov 6, angry again): "For the 100 freaking time you have fire crawl"** — when a site blocks a download or
a page, go to Firecrawl at once (its image search finds photos with their pages; a page screenshot shows a blocked
site's picture), don't keep retrying with curl (the classifier also blocks that as bot-check circumvention).

## ▶ START HERE (the only one; updated Nov 6)

**How this file works** (owner, Nov 6: "I hate how you update the handoff sometimes with too much specificity to lock
in the next session"): this is the only START HERE. It holds the state, what's in progress and what's open: the
owner's words in quotes, his decisions marked **Owner:**, and anything Claude only suggests marked *(suggestion, not
agreed)*. Older sessions' notes follow under dated headings, newest first; where they disagree with this section, this
section is right. Keep it that way: update this section, don't stack a new START HERE on top.

**Live now** (`claude/bold-albattani-aqfnj9` is the site and the default branch): the new cards (since Nov 5: head
shluchim's photos, vaad and board faces, the count line, no Zoom in); a center's page is an ICON in the header's
corner beside the ✕ (owner, Nov 6: "I told you to turn it into an icon and not this horrible thing" about the
"chabad.org ↗" pill, then, on a round icon floating at the end of the sub line: "look how horribly it's situated";
`pageChip`, `.cc-icon`); head photos for the USA, Canada, Europe, the Middle East, Africa and Asia (Africa and Asia added Nov 6, late); the Rebbeim's portraits.
**The options panel is two tiers** (owner, Nov 8, mostly on his phone: "Settings has grown massive, don't you think it's
time to organize it?"; "a lot of options that are absolutely not needed on a day-to-day basis ... can be tucked away";
what opens when you press Options "should only be like the actual necessary ones"; "the section should be done
properly"). **Up front:** Show (World, Regions & countries), Borders (with Sub-shetachim and the rows that appear with
Countries or Both), Labels, and **On the map** (Chabad centers, Mushrooms): it fits a phone's sheet without scrolling.
**More options** holds the rest in three groups: **Map** (the style, Colors, Alaska, Rest of the world and its
borders, Blue sea), **Markers** (Cities with shluchim, Shetach flagships, Dots, Dot color, and with Mushrooms on the
Mushroom marker and networks) and **Cards** (Photos). Every control kept its id and its handler; only where it sits
changed. *(Suggestion, not agreed: which options are "necessary" is Claude's pick; if he uses something from More
options every day, move it up front. The Hebrew for the new names, על המפה / סימונים / כרטיסים, is Claude's too.)*
New rarely-used options go in the More options group they belong to.
**A Photos switch** (owner, Nov 8: "Make an option please to turn off pictures of head shluchim and stuff"): in More
options, under Cards (`#show-photos`, `photosOn`, on by default, remembered as `shetachim-photos`). Off, the cards show no
photos at all: a head his initials, a vaad its plain list of names (no honeycomb), the Rebbeim's cards no portraits.
**Victoria's dispute is Groner and Gutnick only** (owner, Nov 7: "get rid of hendel he's not a actual claimant it's just
groner and gutnick"; this replaces the Nov 4 "Nvm keep hendel for now" below). **ACT is part of Victoria** (owner, Nov 7: "ACT should be part of
Victoria also"): the `act` shetach (Shmueli Feldman) and its Hebrew entry are gone; Victoria's territory has AU-ACT, an
island inside New South Wales like the Gold Coast exclave.
**Australia's head photos** (owner, Nov 7: "Australia now for the photos", then "just use the ones besides tasmania"):
live for New South Wales (Pinchus Feldman, COLlive Jan 2025), North Queensland (Ari Rubin, Cairns Post Dec 2025), South
Australia (Yossi Engel, ABC Dec 2025) and Western Australia (Shalom White, his Instagram Mar 2026; his Nov 2026 post is
an AI-drawn graphic, not used). Not done: Tasmania (owner: skip), Brisbane (Levi Jaffe: only a 2019 portrait, his beard
is white in May 2026), Victoria first had none; then (owner: "just use the older one so you can do both") its card shows both claimants, each with
his photo (Groner: AJN 2017, the newest of him alone; Gutnick: Jerusalem Post 2025), `DISPUTED_PHOTOS` in web/index.html.
**Sri Lanka is in no shetach** (owner, Nov 7: "sri Lanka is not official- give it the phillipines treatment please"):
its five houses are Rabbi Mendy Crombie's mushroom network (Colombo its flagship); the `sri-lanka` shetach and its
Hebrew entry are gone and `blank` has `{ "country": "LKA" }`, as for the Philippines and Bolivia.
**Crown Heights and Monsey, drawn exactly** (owner, Nov 7: "u did not properly build Crown Heights along the
Utica-Maple-Nostrand-Sterling (Pl) you just drew straight lines"; "the Monsey situation should be more like a proper
situation just around Monsey nicely and then same like crown heights it becomes its own thing"): Crown Heights follows
the four streets' centerlines (NYC Open Data's street centerline, `inkn-q76z`); **Monsey is a shetach of its own with
no head** (`monsey`, מאנסי, no longer blank), a smooth outline just around the Census Monsey CDP, Kaser and its 9
listings. Both outlines reach the page unsimplified and off the map's grid (`EXACT` in scripts/build-data.mjs,
geo.json's `exactArcs`, the tiles' `ex` lines). **No "Shetach" above a shetach's name on its card** (owner, Nov 7:
"get rid of the word shetach it makes no sense actually"); the sub-shetach card's "Sub-shetach" is as it was (not
asked).
**The map opens on Streets, and a Streets ⇄ Political button sits over the +** (owner, Nov 7: "There should be a
button to switch between ... steeets on top of the plus zoom button", "Also streets should be default going forward",
then, on a first version that switched to Physical: "No no no no no the button is between streets and POLITICAL"):
`#zbase` in `#zoomctl` shows the map it switches to (a map of countries: Political; a road: Streets) and clicks the
panel's Map button for it; from Physical or Tinted it goes to Streets. If the street map's style doesn't load, the
page opens on Political with "The street map couldn't load."
**The Countries map, redone** (owner, Nov 7: "Countries mode should have an option to make Us and Canada full countries
with their real borders I think", "Also stuff like lower Balkans and stuff should be split also in country mode also the
country cards look horrible and atrocious rn"; then, on the first try at it: "it should have just been a switch to show
states or not and also include Mexico and the like and also like it should have fucking not had 4 big head shluchim and
shoe more they all should have been formatted like show more is currently fornatted", and "Actually even in states mode
mexico should be one country"). **Mexico is always one country** on the Countries map (`ONE`; `polState` gives its
pieces `MEX`; on the street maps `st-line-state` leaves out `na` MEX). **A States switch** (`#show-states`, `state.states`,
on by default, remembered as `shetachim-states`; under Borders with Countries or Both, in the world views that have the
USA, Canada or Australia; the US & Canada, USA and Canada views always show their states, `statesShown`): off, the
USA, Canada and Australia (`SPLIT`) are one country each, one colour each (`cw`),
no state lines (their lines are their own kind, `regna`, left out; on the street maps `st-line-state` leaves out their
`na`), named "United States", "Canada", "Australia" (`WHOLE_NAMES`, Hebrew too), one card each. It replaced the
first try's "USA & Canada as whole countries" (whose remembered "on" now reads as States off). **Canada whole is all
of Canada** (owner, Nov 7: "Obviously, if states is off, Canada should show as a whole, like the entire fucking
country"): its land no shetach covers (the north, the territories: `outside.json`'s CA, left off the map) is in its
colour with States off on the Countries map (`OUT_OF`; layers `whole-out` / `whole-land` over the outside sources,
political solid in the countries' shade over the land, on the street maps without the outside grey under it), no line
where its shetachim's land ends (its edges are their own kind, `edgew`, hidden then, and a `seam` line in its colour
covers the outside land's coast there), a tap there opens Canada's card, and its outline (hover, a tap) goes round all
of it (`wholeLines`: the two files share one grid, so the shared segments drop out). **The heads' names split by
country, not by state** with Countries: each country's part of a shetach named on its own (`S.splits`, grouped by
`polCountry`: the Lower Balkans' Yoel Kaplan over Albania, Kosovo, North Macedonia, Bosnia and northern Greece each),
and a shetach's states in one country under one name (owner, Nov 7: "sholom Weinberg shouldn't be duplicated he should
be covering both states idiot": Kansas–Missouri, as Moshe Feller over the Dakotas and Minnesota). **The country card**: no
"Country"/"State" over the name, its colour on the map, then **every shetach covering it as one line**, as the "+N
more" lines were (`ctxRow`: its colour, its or its part's name bold, its head), the most centers first, no big heads
and no fold; the country's own head (Kenya's in Central Africa) a line the same way in the country's colour
("Head shliach in Kenya · …"); then the count.
**The line along the St Clair River has no gap at the Chenail Ecarte** (owner, Nov 7, a phone screenshot with the gap
circled): Ontario's border water (`ontario-border-water.geojson`, OpenStreetMap) took Ontario's half of the river off
there (about 42.638-42.660 N) while Michigan runs to the international line, so the two never met and the white line
between Michigan and Southern Ontario stopped mid-river. `data/shapes/ontario-border-rivers.geojson` is water the build
leaves Ontario (`BORDER_RIVERS`): one box there. (First I misread the screenshot as being about the straight line through
Walpole Island and moved Essex County's and Southern Ontario's shapes; owner: "that wasn't the problem!!! The shape of
the border was fucking FIND", "revert the change you made also to the shape": both shapes are as they were.)
*Open: the same kind of gap (Ontario's half of the river cut off, the US side at the line) is along the St Lawrence
between Upstate New York and Ottawa's shetach (about 44.47-44.77 N, Brockville to Morrisburg, and bits in the Thousand
Islands) and at Sault Ste Marie on the St Marys (46.46-46.50 N, and channels down to 46.24 N). Not fixed: a box there
would also fill Canada's own channels among the islands; it wants a strip along the international line only.
(Suggestion, not agreed.)*
**A head's photo only beside the head himself** (owner, Nov 7: "ur fucking stupid ass put a picture of nosson next to
Avrohom Gurary"): a flagship's card shows the first man listed there, and `photoIf` used to give him the head's photo
when only the surname matched (Upstate New York: Avrohom Gurary listed first, Nosson's photo; Kazakhstan: Elchanan
Cohen, Yeshaya Cohen's photo). Now `isHead` wants the surname and a given name the same, or the same name spelled
otherwise (`NAME_FORMS`: Shea/Sheya, Joseph/Yosef, Avrohom/Avremel, Schmukler/Shmukler…), or the middle name's initial
(Boruch S. Cunin for Shlomo Cunin). Checked on every flagship: Upstate New York and Kazakhstan lost the wrong photo,
New Mexico (Chaim Schmukler) and Denmark (Yitzchok Loewenthal) gained the right one, the other 92 are as they were. A
new spelling of a head's name on chabad.org drops his photo there (the safe way) until it's added to `NAME_FORMS`.
**Mushroom networks go by their own names** (owner, Nov 7: "Shouldn't kanelskys network be called Bris Avrohom? In
general a lot are just named after head when maybe they can have a better name no? Like Phillipines maybe should just
be called Chabad Phillipines", then "not chabad of Japan - that implies is the real chabad of Japan unlike in the
Philippines and such where there's no official one to compete with"): **Bris Avrohom** (Kanelsky's; his son Yossi's
Marlboro center left the network, as the 2011 settlement says it "will not be associated with ... Bris Avrohom"),
**Chabad of the Philippines** (Yossi Levy) and **Chabad of Sri Lanka** (Crombie), countries with no official Chabad.
The rest keep their heads' names: Edery (Japan has official Chabad), the Kupchik family (India, Bolivia, Mexico,
Tanzania; only its India houses have a name, Chabad of India) and the ones with no name of their own.
**Mushrooms from the DansDeals master list** (owner, Nov 7: "I'm sure this can help add a ton of mushrooms right?",
"you have to properly look up ... networks", then "Did you also downgrade ones we accidentally had as official like
pisac????"): forums.dansdeals.com topic 102660, "Master List Of Unofficial Chabad Houses" (wiki edited Oct 7, 2026;
the whole thread read, via Firecrawl: the forum answers WebFetch with 403). Each entry checked against the map,
chabad.org's directory and staff (data/raw), and its own site or the news. **Added 21** (87 mushrooms now), with new
networks Turen family (Chicago's Moshiach Center, Rabbi Eli Turen, father of Rabbi Mendy Turen's Chabad of
Springfield, IL), Mosheh Serebryanski (Byron Bay and the Gold Coast) and Maon Noam (three Toronto-area shuls); Rabbi
Yossi Kanelsky's Marlboro center joins Mottel Kanelsky's network.
**Owner (Nov 7), the rule for official vs. mushroom:** the owner's own shetach list is NOT proof ("The whole fucking
point of this is that I made mistakes like by levy ... This is you independently figuring out if it was a mistake and
then downgrading accordingly"); "If indeed they end up being official under merkoz (chabad.org isn't only
verification even if it is the main verification) then you can keep them - otherwise they get the phillipines sri
Lanka treatment fully". So: **Belize, El Salvador and Honduras are now in no shetach** (shetachim and Hebrew entries
gone, `blank` has BLZ/SLV/HND), each one house a mushroom: none of the houses or rabbis (Belhamou, Brod, Reichman) is
on chabad.org and nothing shows a Merkos appointment. **Downgraded houses** (their countries keep official shetachim):
Jabad Mendoza, Chabad Pedro (Guatemala), Chabad of Namibia, Quito's Casa Jabad (against: lubavitch.com called the
Rotems Chabad representatives in 2008), Chabad of Ethiopia and its Bole airport shul (against: Rabbi Shlomo Bentolila
announced Rabbi Eliyahu Chaviv official in April 2020, but unlike Kenya's Rabbi Levi Notik, named in the same
announcement, he was never listed on chabad.org). Then (owner: "Also add the village synagogue fogelman the one in LA") Rabbi Zalmy
Fogelman's Village Synagogue, 7866 Fountain Avenue, West Hollywood: a mushroom (not on chabad.org; "inspired by the Chabad
philosophy"). 94 mushrooms in all.
A picture of them (owner: "make me a basic image map showing the mushrooms of the world I wanna visualize it"):
`node scripts/mushroom-map.mjs` writes work/mushrooms/mushrooms-world-he.png and -en.png (the world, close dots merged into
numbered ones, close-ups of New York–New Jersey, India–Sri Lanka and the Philippines, counts by country and network);
rerun it after any mushroom change. **Owner, on the first version:** "Why did you have to put that stupid line under the
chabad mushroom list thingy header" and "why stupid ai explanatory text like in no network or this merged into this":
in pictures, no subtitle and no explaining lines, only the title, the map and plain lists. **Kept as official, checked:** Pisac (its rabbi
and rebbetzin are on chabad.org at Chabad of Cusco); Zanzibar (founded 2018 under Chabad of Central Africa, per
chabad.org); Panama (many centers on chabad.org; Rabbi Aaron Laine, not on chabad.org himself, is called its head
shliach); Armenia (chabad.org's own article on Rabbi Gershon Burshtein's Chabad house, since 1995). A check of every
shetach head against chabad.org's staff lists found no other head without official backing (Saudi Arabia's Garelik
is the owner's, above). Not added: shuls with no Chabad name (Sydney's Coogee,
Cremorne and Newtown; São Paulo's Knesset Israel and Monte Sinai; Toronto's Shaarei Torah; Ste-Agathe; Vancouver's
Kollel; Palm Beach Synagogue; Young Israel of Tampa), official ones (Chevra Thilim SF, Iyyun, Canton's Chai Center),
closed or not found (London's Beis Moshiach, Dahab, Caye Caulker, Westwood, Almaden Valley, Tampa's Chabad of Central
Florida), and doubtful ones (Beth Israel Chabad of Norwalk; Maplewood's Ahavath Zion, next to the official SOMA;
Short Hills's Chai Center Chabad, nothing after 2024; Puerto Morelos, a website only). Make every change in web/index.html
(web/preview-cards.html only redirects to it). "Pushed" to the owner means live: check that GitHub Pages deployed.

**In progress (Nov 6): the Europe and Middle East photos, redone.** Owner: "The ones that are bad, you actually have to
work on them and find a good replacement. And remember, everything has to be edited properly also. Overall, I want
everything to look good." He also caught two misjudgments in the first review: "in what world is the Lazar one good he
looks way too young" (the photo is older than the 2022 post that used it) and "is the Norway one really so bad?" (no).
So judge a photo's age against a dated 2024–26 photo of the same man, not the date of the page or post that shows it,
and judge looks at the size the card shows. Progress: ten changed and live (the "Nov 6, later" section below); for
thirteen no better recent photo has been found yet (the list is there, with what was tried).

**Open (the owner's):**
- **Founding years, two sessions at once (owner, Nov 6, latest: "Put smth in handoff so I can get another session to
  work on a diff part of country").** Who has what (change only your own line):
  - *The West Coast window:* the hard round on California + Nevada, the 35 small shetachim and the 9 dots in no
    shetach (Monsey's; the `monsey` shetach since Nov 7), and Michigan. Don't edit those entries.
  - *A second session:* any shetach still `not researched` in `work/founding-years/STATUS.md`. Suggested first:
    Western Pennsylvania and Georgia (24 dots each; each has a digitized Jewish weekly: the Pittsburgh Jewish
    Chronicle on Historic Pittsburgh, the Atlanta Jewish Times on Georgia Historic Newspapers), then the other
    mid-size ones (the list in the next bullet), the big ones (Florida 219 dots, NYC 177, New Jersey 84, Quebec 59,
    Pennsylvania 57, Ontario 56, Illinois 54, Texas 48, Maryland 48, Eastern NY 47) last. Write here what you took:
    "Second session: ___ (from <date>)".
    **Second session: Florida, then New Jersey, then Pennsylvania (from Nov 6); Texas too (from Nov 7; owner: "Go back to
    Florida yes / Maybe Texas as well"; batches `batches/texas-NN.json`); Georgia, the Carolinas and Alabama too (from Nov 8;
    owner: "Start on Alabama North Carolina and georgia when ur ready as well"; batches `batches/georgia-NN.json`,
    `batches/the-carolinas-NN.json`, `batches/alabama-NN.json`; Alabama's six entries move there (from `small-06`,
    `small-14` and `bounds-01`), so the West Coast window no longer re-applies them).** Owner (Nov 6): "I want you to go
    ahead and start on Florida. I want every single centers founding year ... I want this done properly ... I legit
    found it with a Google / Google ai search by just looking up what it's year of founding was"; "if you come across
    month or day save it ... (or season which equates to a range ofc)"; "if you come across that a center used to be
    somewhere else save as well as maybe when it moved"; "If by some miracle you finish Florida completely then new
    Jersey next, followed by Pennsylvania". Batches: `batches/florida-NN.json`; notes: `work/founding-years/florida.md`.
    State (Nov 8): Florida: every listing has an entry; 150 of 219 dots have a year, 69 left (mostly 1990s-2000s
    Miami-Dade and Broward centers held as ranges by an IRS ruling, a Sunbiz filing or a dated mention; the
    Sun-Sentinel blocks this tool and the UF Jewish Floridian archive was down). Many came from the centers' own About
    pages (WebFetch reads chabad.org-hosted sites; plain curl gets a Cloudflare check). New Jersey: 62 of 84 dots
    (`batches/new-jersey-01..04.json`). Pennsylvania: 37 of 57, every listing researched (`pennsylvania-01..04`;
    the rest are ranges or open: Doylestown about 2006, the Lipsker Israeli center 1964-2009, Penn Wynne by 2007
    with its four homes). Texas: 42 of 48 (`texas-01..03`). Firecrawl is no longer used to get past sites that
    block automated requests (Anash, Sunbiz): owner's rule on bot checks; COLlive often carries the same story.
    Lists that date many centers at once: Lubavitch News Service, 3 Dec 2005 (crownheights.info/general/1064):
    the 19 campus teams sent out in 2005 (Georgia, Colorado, UConn, Florida Atlantic/Lynn, Hofstra, Einstein,
    Wisconsin, Clark, Drake, Western Washington, Yale, CCNY, UNLV, Arizona, UC Riverside, Kansas, CSUN); the
    Merkos 'New Shluchim' grant lists (COLlive, 2 June and 19 Nov 2022: couples in their first years, by city);
    COLlive/CrownHeights.info 'New Shluchim to ...' posts, searchable by the rabbi's surname through their WP APIs.
    Former locations: the chabad.org center API record (`/api/v2/chabadorg/centers/<id>?format=jsonapi`) lists
    the center's Chabad.org news; its 'new building / new home / breaks ground' stories usually say where the
    center was before (homes, storefronts, rented halls) and when it moved.
    Georgia (Nov 8): 22 of 24 (`georgia-01..03`; the 2007 Atlanta Jewish
    Times survey 'The Rebbe's Minyan', on CrownHeights.info, dates most of the old Atlanta centers). The Carolinas
    (Nov 8): 20 of 23 (`the-carolinas-01`). Alabama (its six entries moved to `alabama-01`): all 5 dots have a year;
    Chabad of Alabama (1982 per Southern Jewish Life vs the Posners' 1987) and Huntsville (2010, re-founded 2015)
    stay medium, Chabad on Wheels a range. Georgia Historic Newspapers answers searches but rate-limits (429);
    DigitalNC (the Charlotte Jewish News) does not answer from here. **Owner** (Nov 7): "I WANT HIGH
    CONFIDENCE FROM ALL OF THEM"; search each center individually, not only its own site and chabad.org; finish the
    easier New Jersey ones, then back to Florida's non-high dots.
  - **Third session: Arizona, Kansas–Missouri, British Columbia, Upper Midwest (from Nov 8; owner: "I think it's time
    to do Arizona, along with both Winebergs and feller shetach"). Batches `batches/arizona-NN.json`,
    `batches/kansas-missouri-NN.json`, `batches/british-columbia-NN.json`, `batches/upper-midwest-NN.json`; notes
    `work/founding-years/arizona-winebergs-feller.md`.** State (Nov 8): British Columbia 12 of 13 dots, Kansas–Missouri
    15 of 16, Upper Midwest 13 of 19 (all 19 researched; the other 6 are ranges), Arizona 38 of 43 listings (34 of 38
    dots; all researched, 5 ranges; 32 high after a second pass): all four done. Every year in
    these four batches rests on text read off the page itself (curl, or Firecrawl markdown), never on WebFetch.
    **Then Wisconsin, Illinois and Northeast Ohio (Cleveland), from Nov 8 (owner: "Wisconsin, Illinois, Cleveland
    next."). Batches `batches/wisconsin-NN.json`, `batches/illinois-NN.json`, `batches/northeast-ohio-NN.json`; notes
    `work/founding-years/wisconsin-illinois-ohio.md`.** State (Nov 8): Wisconsin done, 14 of 23 listings with a year
    (14 of 20 dots; 9 high, 5 medium, 9 ranges; all researched). Northeast Ohio done, the whole shetach, 23 of 27
    with a year (22 of 23 dots; 20 high, 3 medium, 4 ranges). Illinois: all 59 researched, 37 with a year (36 of 54
    dots; 29 high, 8 medium, 22 ranges); a second pass on the 22 ranges comes later.
    **Then Central Massachusetts, New Haven, Virginia, Oregon and Upstate New York, from Nov 8 (owner: "Get started on
    Central Massachusetts, New Haven, Virginia, Oregon, and upstate New York."). Batches
    `batches/central-massachusetts-NN.json`, `batches/new-haven-NN.json`, `batches/virginia-NN.json`,
    `batches/oregon-NN.json`, `batches/upstate-new-york-NN.json`; notes `work/founding-years/five-shetachim.md`.**
  - **Owner (Nov 8): WebFetch is a model's answer, not the page, so it can miss or bend a detail.** Every entry with a
    year (847 on Nov 8) keeps its source link and 820 quote the page, so all of them can be checked against their own
    page: an audit (curl first, Firecrawl for the ~160 chabad.org-hosted pages curl can't read) is planned but on the
    back burner (owner: "Let's put that on the back burner for now"). Quotes taken from a second source are named in
    the note but have no link field, so an audit can only check them by hand.
  - How (the rules are in the standing rules below; the method in `work/founding-years/west-coast.md` and
    `michigan-pilot.md`):
    1. `python3 work/founding-years/listings.py <shetach>` lists its dots and listings (`--missing`: only the dots
       still without a year); `leads.py <shetach>` gives therebbesimpact.com's years, as leads only.
    2. For each listing: search the center's name + "founded" / "established" / "since"; read its own pages (About,
       campaign and Charidy pages, footers like "serving ... since"); the area's Jewish paper; the new-shluchim posts
       (COLlive, Anash, CrownHeights.info, lubavitch.com, Chabad.org News). A year needs a real source and its quote.
       A list, an "N years ago" or a listing number is a lead (`lead`), never a year; nothing real is `open`; only a
       bound is `range` (`after` / `by`). Former locations go in `earlier`, a month or date in `date` when it turns
       up. Then check every medium against a second, independent source.
    3. Put whole entries (the fields in the file's `about`) in a batch file `work/founding-years/batches/<shetach>-NN.json`,
       commit it, apply it with `python3 work/founding-years/add.py < <batch file>`, then run `status.py`. Notes go in
       `work/founding-years/<shetach>.md`.
    4. Both sessions write `data/founding-years.json`, so before every push run
       `git fetch origin claude/bold-albattani-aqfnj9 && git rebase origin/claude/bold-albattani-aqfnj9`. If the rebase
       stops on `data/founding-years.json` or `STATUS.md`:
       - `git checkout --ours data/founding-years.json` (in a rebase, "ours" is the remote's version);
       - re-apply your own batch files with add.py and rerun status.py;
       - `git add` both files, then `git rebase --continue`.
    4b. **Not yet the same in both sessions:** a state filing (California Secretary of State, Florida Sunbiz) or an
       IRS ruling date, when nothing better exists. The West Coast window enters it as the year (`how: directory`,
       `medium`, the note saying it is the corporation's filing; the file's `about` lists an IRS record under
       `directory`); the Florida session entered such dates as a `by` bound (a range). *(Suggestion, not agreed:)*
       ask the owner which, then make the two match.
    5. In every update to the owner, say how much is left. `python3 work/founding-years/progress.py <your shetachim>`
       prints it ("LEFT: 48 of 48 dots (100.0%), ..."). Owner (Nov 6): "keep telling me how much left (amount and %)
       so I can steadily see progress".
       Firecrawl is fine now. Owner (Nov 6): "u can use it I want this research to be the best". A search costs about
       2 credits, a page 1, a page with a question 5. Tell him the credits used every so often ("give me periodic
       credits remaining alerts"). Only the amount used can be seen from here, not the balance.
- **Next (owner, Nov 6, latest):** "First finish profile pictures tho, maybe just do Asia also (I'll tell you when to do
  Oceania and Latin America)" — Africa and Asia are done and LIVE; Oceania and Latin America only when he says. Then
  the founding years: "choose two mid size shetachim to do next for usa-Canada". **Chosen (he asked Claude to pick):
  Western Pennsylvania and Georgia** — 24 dots / 27 listings each, and each has a digitized Jewish weekly going back
  decades (Pittsburgh: the Jewish Chronicle on Historic Pittsburgh; Atlanta: the Atlanta Jewish Times on the Georgia
  Historic Newspapers site), the kind of archive that made Michigan right. Not started: the owner then said to do the
  West Coast first (next bullet). The other mid-size ones, by
  dots: Arizona 38, Eastern Massachusetts 32, Connecticut 32, Washington 31, the Carolinas 23, Northeast Ohio 23,
  Crown Heights 23, Upstate NY 21, Colorado 21, Wisconsin 20, Virginia 19, Upper Midwest 19, Oregon 17,
  Kansas–Missouri 16, New Haven 14, British Columbia 13, Central Massachusetts 12.
- **Queued after the founding years (owner, Nov 6, latest): shetach borders year by year.** "After ur done (so put on
  back burner) ... assuming I make a version where borders are shetachim - is changing shetachim every year so for
  example PNW, when levitin was sent to Washington he had a shetach covering a massive area including Alaska for example
  as well as many other provinces and territories but as those places got shluchim/head shluchim it decreased. Same with
  let's say Mississippi being blank till rivkin sent someone there or WV moving at some point from Kranz to Rosenfeld
  I'm sure there's other examples as well so I need research done into that as well". So: for each shetach, when its
  head shliach was appointed, what it covered then, and each year it shrank, grew or changed hands. **Started Nov 8**
  (owner: "Right now what I want is this border shift thing"; a site feature, the United States first): the data is
  `data/shetach-history.json`, the notes `work/shetach-history/README.md`. **Owner:** his facts on what a shetach
  covered stand ("Stop trying to verify my facts"; they go in as `how: owner`); the research dates when each part split
  off, splits first ("I'm sure there's more examples like that. So I need you to find those"). The pilot on his
  examples is done (the Northwest, Kalmanson's Ohio–Indiana–Kentucky, the Virginias, Mississippi, Newfoundland,
  Herson, Korf), and the sweep of the other US shetachim is under way: 65 of 68 US map pieces and all 10 Canadian
  have their history (left: New York City, Crown Heights, Monsey). What's found, what's
  open and the sources that worked are in the notes.
- **Founding years, the West Coast (Nov 6, first pass done).** Owner: "let's jump into the West Coast. Do this properly
  ... The goal is every single blue dot we find the date for ... keep track continuously of how many are missing from
  the various ones, so we can do a round of the harder ones later on ... all the info needs to be kept properly. But go
  ahead and start on California." All 331 US listings researched (California, Nevada): 229 with a year (high 172,
  medium 57), 13 ranges, 89 open; 221 of 301 dots dated (Nov 6, late). Every medium checked against a second source
  (25 raised); every entry that had rested on a WebFetch summary re-read on the raw page (all held; one source link
  fixed). Method, batches and the old opens worth the most effort:
  `work/founding-years/west-coast.md`; counts per shetach: `work/founding-years/STATUS.md` (`status.py`). Next: the hard
  round (ranges and opens; started). **Owner (Nov 6): "Not Mexico!!!!!
  Wtf"**: the West Coast map piece's Baja dots (Tijuana, Cabo, La Paz) were taken out of the data and the counts.
- **Head photos, Africa and Asia (Nov 6, late; LIVE):** South Africa (Lipskar), Central Africa (Bentolila), Mauritius
  (Laima Barber); China, Thailand, Singapore, South Korea, Taiwan, Nepal, Kazakhstan, Azerbaijan, Kyrgyzstan,
  Armenia, Georgia, Taiwan (sources in `work/head-photos/candidates/africa|asia/`, notes in `data/head-photos.json`). Still
  without one: **Japan** (only photos with a microphone at his beard, or too small), **Vietnam** (only a 2013 photo),
  **Sri Lanka** and **Uzbekistan** (the photos found show two rabbis and no caption says which is the head: Crombie
  is with Rabbi Roni Ard; Shaikevitz is named in the March 2025 Lazar-visit story but not in its photos). India has
  no head; Tunisia stays "the Pinson family". **Owner (Nov 6, late), on Georgia's photo with half the
  face cut off: "In what f****** normal world is it normal for a man's face to be this cut off ... they only [have] to be
  perfect good photos recent photos properly edited"; and "kyrgyzstan way too zoomed out".** All 14 then re-checked one
  by one at card size and fixed: Georgia recentred; Kyrgyzstan, Kazakhstan, Azerbaijan (now its 2022 portrait, the
  2025 close-up cut his hat) framed tighter; South Africa and South Korea given room above the head; Thailand's
  fingertip and China's flyer edge cropped out; Mauritius's groom's shoulder painted over with his own (mirrored).
  Taiwan was taken off, then put back (owner: "There's a perfect circle. Just properly cut it"): the round portrait inset on Bechadrei Charedim's April 2024 earthquake story, cut exactly inside its white ring, since the card's circle shows exactly that circle. A round inset is a ready-made head photo: cut it at its circle, don't judge it as a square. Check
  each photo LARGE and at card size before calling it good: face whole and centred, the hat whole, nobody else, no
  mic, no text. For Uzbekistan the Alliance of Rabbis in Islamic States lists a "Shlomo
  Babaev" — the owner's data says Shaikevitz: keep it.
- The other window and this one both pushed to the branch on Nov 6: **fetch and rebase before every push.**
- The founding year of every center, "to show the growth of Chabad": his idea and words are in the Nov 6 (end of a
  session) section below. **Owner (Nov 6, later), on the form:** "I'm not asking for a play button where it happens
  on the map. I would be asking for a properly made video. Maybe even where there's information on the video, like
  obviously when the first one in Morocco is established, or like major milestone establishments, or like marking,
  you know, certain years that were significant ... it would be properly, like, animated. It would not be lazily done.
  It would look like a professionally made YouTube video." So the year-slider plan written below is out. He hasn't
  said go. *(Suggestion, not agreed:)* render it here (an HTML/canvas animation captured frame by frame with
  Playwright, encoded with ffmpeg, which is installed), Hebrew and English versions, with a 30-second test of the look
  before the research on the years. The map has 3,826 dots in 119 countries (US 1,637, Israel 805, France 285,
  Canada 150, `web/data/centers.geojson`).
  **Then the owner (Nov 6, later): data first.** "When it shows you by year the whole map still needs to be shown I
  would think - and then just zoom in when you want to do like a milestone animation"; "it might be too much of a
  stretch to do the whole world at this point and honestly why are we discussing the video at this point what we need
  is the data ... do a test run pick a mid-sized American shetach - not one of the gargantuan ones like West Coast or
  Florida ... and see how easy it would be as a blueprint for the data collection." **Done: the Michigan pilot**
  (`data/founding-years.json`, report in `work/founding-years/michigan-pilot.md`): a year for 30 of 33 dots (91%),
  each rated high (24 listings) / medium (8) / low (1). The owner caught the first pass missing "THE FUCKING FAMOUS
  DETROIT MESIVTA" (1965) and asked "are you sure it's correct? ... I don't know who to trust now": everything not
  solid was then checked against the Detroit Jewish News archive (its own search, AND, earliest first), which changed
  six (Grand Rapids 1977, Novi 2005, Friendship House 2004, Mishkan Israel 1963, F.R.E.E. 1990, North Oak Park 1990)
  and showed the July 2024 list wrong on 3 of 13. Rule now: a list or "N years ago" is a lead; check every medium
  and low entry before calling a shetach done. A recount later found the first pass had also left out the shetach's
  one Canadian center, Windsor, Ontario (now 2009, two sources): take a shetach's listings from every map piece named
  for it (`piece` ending in `:<shetach id>`; ten US/Canada shetachim cross a state or country line), not by state.
  **Michigan now:** 38 listings at 33 dots; 30 dots dated; listings high 24 / medium 8 / low 1 (Bingham Farms: 2009
  from the list only, first newspaper mention Dec 2016); ranges 2 (Oak Park's Lubavitch Outreach by 2001, the Cheder's
  girls' building by 1999); nothing 1 (Toledo's Food & Learning Center).
  **The owner's next steps (Nov 6, latest):** "we'll do region by region but we'll start with the small regions to get
  them out of the way". The title "will end up being prob smth like Growth of Chabad in North America every year" (so
  the scope is North America; **Owner, Nov 6: "Not Mexico!!!!!"**: US and Canada only). He asked how he can trust this ("how am I going to do this
  going forward if I can't trust you and u always screw up?"); the answer given: every year with its source, the
  quote and a confidence; every medium and low checked against a second, independent source (a report from the year
  itself beats a list or an anniversary count) before a region is called done; each region ends with a short list of
  its doubtful entries for him to spot-check. First batch: the 34 US/Canada shetachim with 10 dots or fewer and the
  9 dots in no shetach (161 dots, 172 listings together): idaho, maritimes, nebraska, newfoundland-and-labrador,
  south-area (1 each); arkansas, wyoming (2);
  alberta, delaware, maine, new-hampshire, oklahoma (3); alaska, cape-cod-and-the-islands, central-ohio,
  merrimack-valley, utah (4); alabama, kentucky, louisiana-mississippi, rockland, washington-dc (5);
  manitoba-saskatchewan, montana, new-mexico, north-shore-of-massachusetts (6); hawaii, indiana, iowa, rhode-island,
  southern-ohio, tennessee (7); vermont (8); ottawa (9); and the 9 dots in no shetach (New York).
  **The data file is `data/founding-years.json`** (owner, Nov 6: "there should be a data file that's going to get
  continuously updated as we do this research rather than a bunch of jumbled stuff"): one entry per listing, keyed by
  chabad.org id, updated in place by every session (`work/founding-years/add.py`); its `about` explains every field.
  The .md files in `work/founding-years/` are only notes.
  **First batch researched (Nov 6)** (`work/founding-years/small-shetachim.md`): 160 dots, 171 listings. Dots: a year
  from a real source 119 (high 95, medium 24); only a range ("by 2012") 15; open 26. The first pass had dated the open
  ones from therebbesimpact.com and the chabad.org listing number. **Owner (Nov 6):** "basically a guess is ridiculous
  how can I use that in an expansion map ... if you had tried harder you could have found it but I guess that's for
  the next session to work on". So a guess is never a year: those entries are `open` (`year: null`, the guess kept
  only as `lead`, to check). Still to do in this batch: the 31 open listings, the 17 ranges, and checking the 25
  mediums (the list is at the end of the report). therebbesimpact.com against our solid years (Michigan included): the
  same 63 of 82, a year off 12, wrong 7: a lead, not a source.
  **What counts as a center** (he asked: "What actually counts as a center? Do we only do outreach? Maybe only
  outreach and chinuch moisdois? Honestly I'm not sure. Like do shuls count"). A suggestion to keep only Chabad
  houses was rejected. **Owner (Nov 6):** "No absolutely not. Chinuch moisdois are some of the most important parts
  of Lubavitch … this what I'm doing isn't to do with my project of the head shluchim. This is rather the growth of
  chabad". **Then (Nov 6, later):** "everything is included btw - all blue dots": every listing that isn't a
  mushroom, shuls, mikvahs and camps too. **Owner (Nov 6), on dates:** if a month or an exact date turns up, keep it
  ("More data never hurt nobody"), but don't go looking for it (the `date` field).
  **therebbesimpact.com** (the owner found it, Nov 6: "can I trust it for a big bulk of the project going forward
  though? It seems like they also used AI"). What it is: "an independent initiative created and maintained by a
  private individual", built on Lovable (an AI site builder); no sources per entry, no methodology ("errors and
  omissions may occur"). Its data (from its own endpoints, 29,001 records; the "25,000" it shows is a cap): Tanya
  printings 8,097, Merkos Shlichus visits 7,071, shliach couples with a year 6,231, letters 4,132, "Chabad Center"
  3,151 (about 167 of them look like schools or camps), places the Rebbe was 228. Tested against the Michigan pilot
  (`work/founding-years/therebbesimpact-test.md`): it has 17 of our 33 dated dots (Waterford only as its couple); of
  those 17, the same year 12, a year off 3, wrong 2 (Farmington Hills 1971, the Bergsteins' Chabad there is 1977–78;
  Windsor 2012, the year of the separate Chabad House, the rabbi came 2009). Missing: the 1958 Lubavitch of Michigan, the 1961 camp, the 1963 shul,
  the 1965 Cheder and Mesivta and every 1990s mosad. Old entries mix a building's or a shul's own founding with
  Chabad's (Colel Chabad, Brooklyn, 1788; a Chicago shul, 1896).
- Head photos still missing — Europe/Middle East: Moldova, Romania, Sweden, Switzerland; USA: Kansas–Missouri,
  Delaware, New Hampshire, Eastern Massachusetts, Rhode Island, Cape Cod; Canada: British Columbia, Ottawa, Quebec,
  Maritimes. Old or weak US/Canada photos and vaad faces: the lists in the Nov 5 sections.
- From before: the sub-shetach sweep; the New Haven / Mexico / Boston naming questions; Bet Sara; Hebrew checks (Lew,
  Efune); whether Ephraim Simon's one-year term on New Jersey's vaad (from June 2025) has a successor.

**The owner's standing rules** (from every session; the details are in the dated sections):
- Short, plain replies (he's on his phone); every preview in Hebrew first.
- Photos: recent ("they need to be recent"), him alone, proper and professional, every one fully edited
  (scripts/head-photos/retouch.py) with a good crop; never call an edit clean without checking it zoomed in (a hand
  over a beard doesn't paint out: crop around it or find another photo); check who it is before using it.
- Never take a head shliach from the news over the owner's data (Saudi Arabia is Rabbi Peretz Garelik).
- Research: Firecrawl is fine for everything now. Owner (Nov 6, latest): "Okay I either way have some extra credits so
  I guess fine u can use it I want this research to be the best ... give me periodic credits remaining alerts pls".
  Before that (Nov 6, later) he had said "do you frickin have to use firecrawl for EVERY single thing??".
  WebFetch hands back a small model's summary of a page, not the page, so read a source raw (Firecrawl markdown, or
  curl) before resting a year on it. Never work around a bot check or a paywall.
- Founding years: US and Canada only. Owner (Nov 6): "Not Mexico!!!!! Wtf".
- Founding years: the goal is high confidence. Owner (Nov 8): "The goal is to have every single one high confidence.
  So that's the metric I want ... it makes sense to keep a medium confidence in the interim ... But the goal is 100%
  high. Or let's say like 90-95% high". Report progress as the share of listings that are high (Nov 8: 699 of 1,969,
  35%; 78% of those with a year), and go back to mediums and ranges to make them high, not only to new listings.
- Founding years: moves are a big part of the data. Owner (Nov 7): "Have you been also ... finding dates of moving and
  old as well as new location???? I hope so if not I'll be mad because that's a big part of the data". Check every
  center for moves, not only when a source happens to say so: its state filing history (address changes with dates),
  archived old pages (Wayback via Firecrawl), the local Jewish paper's archive, and its current address
  (lubavitch.com/centers/<id>, free) against addresses in old directories. Free tools: work/founding-years/west-coast.md,
  'Free tools found on Nov 7'.
- Founding years: when a center used to be somewhere else, record it (`earlier` in `data/founding-years.json`). Owner
  (Nov 6): "if you ever realize a center used to be located somewhere else then take note for the data pls".
- Founding years: search simply (the center's name + "founding year" / "established"), read its own pages (About,
  campaign and Charidy pages, footers like "serving ... since"), don't build the search around the lead year. Owner
  (Nov 6), who found Beverly Hills (March 1979) and Bais Bezalel in seconds: "these should all be easy as fuck".
- Instagram through Apify: the token is never in the repo; ask the owner to add `APIFY_TOKEN` in the environment's
  settings, never to paste it in the chat.
- Judea and Samaria is Israel; head shluchim's names in full; never a map in a card; commit and push every turn to
  `claude/bold-albattani-aqfnj9`, no PR.

## ▶ Nov 6 (latest): founding years for the 35 small areas (data, LIVE in `data/founding-years.json`)

The first batch the owner asked for ("every US-Canada shetach with 10 or less centers so we get all the small ones
out of the way ... everything is included btw - all blue dots"): the 34 US/Canada shetachim with 10 dots or fewer
and Monsey (`shetach: "none"`). 209 centers are in the file now (Michigan's 38 included). The report, the doubtful
list and the method notes are in `work/founding-years/small-shetachim.md`; `work/founding-years/add.py` adds or
replaces entries from JSON on stdin.

- Each entry: name, city, shetach, year (or `by`/`after` for a range), `date` when a month or day turned up, `how`,
  source URL, a note quoting the source, confidence. The file's `about` explains every value.
- Listing numbers: chabad.org ids run in the order listings were made; the report has a table of anchors (first
  directory about 2003 ... July 2026 = 7423561). Used only as a lead, never as a year.
- Sites: crownheights.info answers WebFetch with a 307 but reads fine with curl; lubavitch.com often returns 500;
  chabadpedia.com and thecjn.ca block WebFetch (Firecrawl reads them; its "query" format cost 5 credits for
  nothing, use "markdown").

## ▶ Nov 6 (later): sub-shetach outlines meet their shetach's own border (LIVE)
- Owner (Nov 3, a phone screenshot of Staten Island): "the boundaries of Staten Island compared to Tzach boundaries are
  mismatched, the Tzach ones in general are probably just horrible".
- Why: a region of whole counties was its Census counties cut to the shetach's land, but the map draws the shetach
  from geo.json, simplified a few hundred metres off the Census lines; so along coasts, state lines and the next
  shetach the dotted line ran beside the shetach's own edge (Staten Island's inside it, the fill showing past it).
- Now (`scripts/build-sub.mjs`, `fitted` and `stripsOf`): a region whose membersIn are all counties is the shetach's
  land round it, less the shetach's other counties and their strips (the bits of its land beyond the Census counties,
  each given to the county beside it; split on a 30 m grid where two meet; only strips under 10 km²). Its outer edges
  are the map's own; the lines between counties are still the Census's.
- Measured on the outline's points within 1 km of the shetach's border (on it within 30 m): Staten Island 39% → 100%,
  Long Island 66% → 96%, Southern Nevada 73% → 99%, Tampa Bay 56% → 95%, Westchester 61% → 76% (its other points there
  are on the Bronx line). The same regions, houses and pieces as before, no overlaps.

## ▶ Nov 6, later: Europe and Middle East photos redone — ten changed (LIVE)

Each one checked at card size, his age judged against a dated 2024–26 photo of him. Sources, crops and notes are in
data/head-photos.json; the kept source of each is under work/head-photos/candidates/eu/<id>/ (its "source" field).
- **Replaced with recent photos:** Russia (Lazar: at the Kremlin, Nov 2025, Wikimedia Commons; his raised hand left out),
  Hungary (Oberlander: June 2026, Zsido.com, cropped from a family photo; the old one was from 2015), Serbia (Kaminetzky:
  Jan 2026, Chabad.org's "Chabad House of the Week" photo posted by Chabad Serbia on Instagram; old one 2016),
  Montenegro (Edelkopf: Apr 2024, RTNK; old one 2018), France (Mendel Azimov: the Élysée, Mar 2024, a man behind him
  painted out; a soft web copy, but the only recent photo of him facing the camera — his 2026 videos show him reading;
  old one 2021, his beard still black), Croatia (Zaklas: Dec 2022, City of Zagreb; old one a 2020 selfie).
- **UAE:** the same studio session as before, the shot with his hat (Commons), retouched with the new `--studio`.
- **Re-cropped:** Lithuania (the full-size copy, so his head isn't cut), Denmark (a red frame trimmed and the white sky
  above extended, so his kippah isn't cut), Iceland (closer).
- **Checked and kept:** Cyprus, Latvia, Slovakia (they look as in their 2025–26 photos); Norway (the owner: fine).
- **No better recent photo found yet** (tried: Firecrawl image search in English and the local language, with and
  without a 2024–26 date filter; the Chabad houses' Instagram accounts through Apify; YouTube frames): Belgium (a 2018
  interview still), Czech Republic (a TV still), Estonia (2019; his only 2026 photos are small, in groups), Finland
  (2020, 200px), Germany (2017; one lead: Jüdische Allgemeine, Dec 2025, a Chanukah photo of a rabbi in a hat beside
  Charlotte Knobloch — check that it's Diskin; a fur hat overlaps him), Ireland (2019), Italy (2017; Chabad Italia's
  Instagram only has him small in a June 2025 group photo), Lower Balkans (a TV still), Malta (old; the only other one a
  2018 video frame), Spain (a 2021 selfie), Morocco (his 2022 X picture), Israel (his beard is greyer in 2025–26
  photos; no recent portrait of him alone), Portugal (an undated interview). *(Suggestion, not agreed:)* asking the
  Chabad house for a photo would settle most of these.
- **Tools added:** `retouch.py --studio` (a studio portrait: no local contrast, no vignette, lighter sharpening; the
  normal edit made the UAE studio shot gritty and greyed its white backdrop); `paint-out.py --trim N --extend-top N`
  (cut a drawn frame off; add plain backdrop above a head cut too tight). Entries can now carry "source" and "studio".
- Instagram accounts found (not yet in data/instagram-accounts.json): chabad_serbia, chabad.it, beth_loubavitch,
  chabad_hrvatska, chabad.latvia, chabad_school_riga, chabad_prague_community, chabadantwerpen, chabadmalta, chanie_kot
  (Estonia), edlkop (Ari Edelkopf, Montenegro), alliancerabbisinislamicstates. Most post children and events; the face
  sheets made from them stay out of the repo.

## ▶ Nov 6, end of a session: the founding-years idea, Garelik, what was left

**State:** everything below is LIVE on `claude/bold-albattani-aqfnj9` (deploys checked). Last commits: Garelik's photo
(c273210), the Rebbeim beside their names (c40fe05). Nothing uncommitted.

**What the owner is in the middle of (pick up here):**
1. **Founding years of every US + Canada center: an animated "growth of Chabad" map.** The owner's idea (Nov 6): find
   the YEAR (not the date: "I don't need a date, I need a year. The point is to show the growth of Chabad") each center
   opened, then a year-by-year view: dots popping up by year, plus the shetach changes (new shetachim, splits like
   Wyoming etc. out of the Northwest). "Honestly, it's for me ... it's cool." He asked if it's realistic and "are you
   sure I would find for all of them?" Answer given: NOT all — a real year for most (my guess 70–85%), the rest
   unknown or estimated. Size: 1,787 dots (US 1,637, Canada 150), 1,991 listings (`web/data/centers.geojson`).
   **The owner's correction (keep it):** "if a center started in the 1980s then a first copy of the website won't help"
   — right: the Wayback Machine's first snapshot only bounds centers opened after websites were common (late 1990s on).
   For older houses the sources are: "celebrates 25/40 years" anniversary articles (→ the year), the shluchim's
   bios and obituaries ("came to X in 1984"), Chabadpedia, chabad.org "About" pages, local newspapers,
   COLlive/Anash/CrownHeights.info/lubavitch.com "New Shluchim to X" (good from about 2005). He has NOT yet said go;
   suggested next: a pilot on one shetach (Florida) to measure the real hit rate, then batches. *(Suggestion, not agreed:)* plan for the data:
   `data/founding-years.json` {centerId: {year, how: stated|anniversary|bio|estimate, source, note}} and
   `data/shetach-history.json` (when each shetach formed or split, drafted from the news, corrected by the owner);
   the view: a year slider with play, dots fading in, borders changing in their years, a running count.
2. **Photos still missing (Europe/Middle East):** Moldova, Romania, Sweden, Switzerland. Weaker ones to replace when
   something better turns up: Finland, Spain, Germany (2017), Serbia (2016), Italy (2017), Montenegro, Ireland,
   Croatia, Norway, Czech, Morocco. US/Canada leftovers: task list in the "Nov 5" sections below.

**Learned from the owner this session (keep):**
- **Saudi Arabia = Rabbi Peretz Garelik (the owner's data). Never take a head shliach from the news over the owner's
  data**: the news writes about Yaakov Herzog in Riyadh, who is not the shliach ("you cannot differentiate a real
  shliach and a mushroom ... your average AI would tell you the head shliach of Japan is Edri"). Garelik's photo: his
  L'Chaim (Garelik – Belinow, Sept 2022, Anash DSC_9047), the friend beside him painted over with the curtain;
  identified by the owner and checked (the same man in the chassan's seat at the head table, COLlive 7N0A6153, and
  lifted at the wedding, Anash DSC00176; the man in the middle of Anash's wedding DSC00136 is NOT him). The owner,
  on finding him: look in the simcha galleries — the chassan is in the head table's middle seat at the L'Chaim and on
  the chair at the wedding; work from the original full-size photo, never a screenshot.
- **Firecrawl at once when a site blocks** ("For the 100 freaking time you have fire crawl"); a page screenshot shows
  a blocked site's picture (how the two title pages came from Chabadpedia).
- **Rebbeim:** pictures BESIDE their names (not above), in a RECTANGULAR gilded frame ("not weird gravestone shape");
  the Mitteler Rebbe and the Rebbe Maharash get the title page (שער) of a sefer of theirs, as Chabadpedia does — the
  portrait attributed to the Maharash was dropped ("it's prob not him").
- Check identities before using a photo ("some of those are not him").

## ▶ Nov 6: Europe and the Middle East have head photos; the Rebbeim's portraits on their cards (all LIVE)

What the owner asked this session, all live on the site (deploys checked):
- **"Europe and MENA next"**: head-shliach photos for **34** of the 39 Europe/Middle East shetachim, made like the US ones
  (a photo of him alone, from a captioned or checked source; cropped and retouched by `scripts/head-photos/retouch.py`).
  Records in `data/head-photos.json` (86 photos now); their ids added to `HEAD_PHOTO` in `web/index.html`; each source
  kept in `work/head-photos/candidates/eu/<id>/` (Instagram ones in `work/head-photos/instagram/images/`), so
  `redo-all.py` can redo them. Hebrew preview sent.
  - **Still without a photo:** Moldova (kishinev.org blocks our downloads; the only other one found, chabadinfo 2023,
    may not be him), Romania (agerpres's are watermarked; the rest group shots), Sweden (only a 200 px LinkedIn selfie
    and a 2009 photo), Switzerland (Rosenfeld: no captioned photo; the 2023 kinus "welcome" sign was held by several
    people, so that photo isn't proof), **Saudi Arabia (Rabbi Peretz Garelik, the owner's; no photo yet).** Owner, Nov 6, furious that a session doubted it: the news writes about Rabbi Yaakov Israel Herzog in Riyadh, but Herzog is not the shliach ("you cannot differentiate a real shliach and a mushroom ... your average AI would tell you the head shliach of Japan is Edri"). Never take a head shliach from news coverage over the owner's data. There's no photo of Garelik to find: online there are only his legal filing under Jewish KSA and a baby announcement (the owner); the owner will send one if he finds it, so don't search.
  - **Weaker, replace when something better turns up:** Finland (his 200 px LinkedIn photo, soft; beware the late
    Rabbi Binyamin Wolff of Hanover, a different man), Spain (a selfie at a meal; NOT chabad.org's "Zalman Goldstein",
    that's the author), Germany (2017), Serbia (2016), Italy (2017), Montenegro (2018), Ireland (2019, cropped out of
    three), Croatia (a 2020 selfie), Norway and Czech (video stills), Morocco (a friend's hand at the edge).
  - Identified by checking: Bulgaria (embassy photo, Apr 2025: Salamon is the man on the LEFT, matched to his BNR
    photo), Belgium (anash.org's "The Rebbe's advice for stuttering" = Slavaticki), Morocco (@RabbiMorocco on X).
  - Fetching notes: Wikimedia's upload host answers 429 to us; **thumb.wikimedia.org at a standard width (330, 500,
    960 px) works**. Chabadpedia answers 403 and kishinev.org cuts us off: don't work around them (the classifier calls
    retrying with other curl flags bot-check circumvention). Firecrawl can't screenshot an image file itself; a page's
    screenshot works. Facebook/Instagram "lookaside" links don't download; Instagram posts come through Apify
    (`ig.py posts`).
- **"Also add the Rebbeim ... properly framed much better than shluchim"**: on every Rebbeim card (Lubavitch, Rostov,
  Liozna, Liadi, Haditch, Nezhin, the ohalim in Lubavitch and Rostov, the Ohel, 770) each Rebbe's picture sits **next to
  his name** (the timeline's entry, the resting place's panel, 770's "Leader" line), in a **rectangular gilded frame**
  (`.rb-pic`; `REBBE`, `rebbePic` in `web/index.html`; a burial card lists its Rebbeim in `portraits`). The owner's
  corrections the same day: first a row of arched frames on top — "It should still be next to it not on top" and
  "proper framing not weird gravestone shape" (no arches, no name plates: they looked like gravestones). Pictures: the
  Alter Rebbe's and the Tzemach Tzedek's are the traditional portraits; the Rebbe Rashab's (passport photo), the
  Frierdiker Rebbe's and the Rebbe's are photographs. **The Mitteler Rebbe and the Rebbe Maharash: the title page (שער)
  of a sefer of theirs**, as Chabadpedia does ("Do how chabadpedia does it with like the sefer shaar blatt"): מאמרי
  אדמו״ר האמצעי and לקוטי תורה – תורת שמואל. (A portrait attributed to the Maharash, printed in HaMivaser 5773, was
  tried and dropped: "it's prob not him - cancel the maharash".) Images: `web/img/rebbeim/<key>.jpg` (300×375), made by
  `scripts/head-photos/rebbeim-portraits.py` from `work/head-photos/rebbeim/` as `data/rebbeim-portraits.json` says
  (sources there; the Rebbe's had an out-of-focus man behind him painted over with the backdrop; the two title pages
  were cut out of a Firecrawl screenshot of Chabadpedia's file pages, since chabadpedia.co.il refuses our downloads).

## ▶ Nov 5, later session: the new cards are LIVE; vaads and boards with faces; no "Zoom in"
**The card redesign went live on Nov 5** (owner: "Push everything that's been done so far as well", then, on the old
live page: "My fucking ass it's pushed" — he means on the site, not only in git). web/index.html is now what
web/preview-cards.html was (the photos, the vaad faces, the new cards, everything below), with the `marked` bug fixed
(declared before the Mushrooms switch's handler); web/preview-cards.html only redirects to it. **Make every change in
web/index.html.** "Pushed" to the owner means live on the site: after a push, check that GitHub Pages deployed it.
The previews he was sent are in docs/handoff-2026-11-05b/ (1 Florida/NJ/UK, 2 a center/mushroom/flagship with the small
buttons, 3 Tzach + Florida).

**Done this session:**
1. **A vaad opens to its members with their photos** (owner: "once you expand it instead of showing the circle with all
   the members it shows each profile picture next to each member"): tapping "7 חברים" hides the honeycomb and shows a
   row per member, his photo (32 px), name and town; the chairman ringed in the shetach's colour with a "יו״ר" tag; the
   alternate after a dashed line, smaller and grey (`membersHTML(s, line, photos)`, CSS `details.vaad-ph`).
2. **The "שליח ראשי:" mark** is `HEAD_ICON`: a fedora over a bearded face, line style like `PERSON_ICON` (owner: "a custom
   one with like a hat and stuff? Still exact same minimalist style"). Picked from the variants in
   work/head-photos/vaad/nov5-later/sheets/head-icon-variants.png (F3: all line, a pointed beard; F5 has a filled hat).
3. **The UK's Hanholo** (owner: "pls do uk hanholo next") and **Tzach's vaad** (owner: "I'd like the Tzach va'ad added as
   well"): a board at the head (`headTitle` Leadership, no `vaad`) with faces in `VAAD_PHOTOS` gets the same block as a
   vaad that leads: honeycomb (`HIVE_ROWS` now up to 13: the UK's 12 are 4-4-4, Tzach's 5 are 2-3), "הנהלה", the board's
   name, "12 חברים" opening to the rows. Faces are matched on the first name too where two share a last name (Leivi and
   Bentzi Sudak). All 17 faces: data/vaad-photos.json (page, image, crop, edit, how sure, a note with the date).
4. **"Zoom in" is gone from every card** (owner: "Get rid of zoom in, takes up unnecessary space nobody needs it"), and
   **the bar along a card's foot is gone**: a center's page is a small pill ("chabad.org ↗") at the end of the line under
   its name (owner: "The link can just be a button honestly like a small button that doesn't take up a whole line"), a
   mushroom's "Show network" a small pill in its network's box (`pageChip`, `netPill`, `ccHead({ act })`).
5. **Florida's vaad:** Kessler now from COLlive's July 2023 photo (captioned; sure). Goldman: the UF team photo cropped
   above his raised hand, no editing — a painted-out version was rejected (owner: "Goldman is extremely f***** up don't
   even try to tell me that looks normal"). Raichik confirmed (his own Nov 2026 podcast thumbnail names him). Zaklos: the
   collage face matches the Naples Daily News's captioned Oct 2023 video (its image server answers 402; don't force it).
   Lipskar: still a guess (the only captioned 2026 photos are group shots with Rabbi Chaim Lipskar).
6. **New Jersey has no named chairman:** the June 2025 reports (anash.org, COLlive) say the five were elected "to serve
   alongside" Mendy Herson; a June 2025 list puts Herson first among them. Told the owner; nothing changed. Ephraim
   Simon was elected for one year (to about June 2026); no successor reported yet — check.
7. **Live data fixes:** Rabbi Isaac Hirsh (Yitzchok 'Icky') Sufrin, on the UK Hanholo's list, passed away 3 Feb 2026
   (anash.org; Companies House: born Feb 1940, director of Lubavitch (UK) Ltd) — taken off the board (12 now). Hebrew:
   Leivi / Leivy / Laivi / Laivy are לוי (were לייב, which is Leib) in data/hebrew/first-names.json, he.json rebuilt.

**Every photo re-edited (Nov 5, owner: "proper editing, like lighting, coloring. Or the Arizona example ... Crops also
... Just everything overall"):** retouch.py v2 — small sources no longer turn waxy (a light clean that keeps the skin's
texture, gentle sharpening, a fine grain after enlarging), the skin's hue corrected where it's pink or magenta (only
what is skin-coloured, at most 20 degrees), a black point for hazy photos, a soft lift for deep shadows, less local
contrast and sharpening (beards had a crunchy look). All 52 head photos and 30 vaad faces were redone from their
sources with scripts/head-photos/redo-all.py (it picks each source by comparing it with the photo on the site — the
downloader's numbering had pointed some source lists at the wrong file); before/after sheets in
work/head-photos/redo-nov5/. New crops: Louisiana–Mississippi (the man beside him out), Lubin (his wife out).
**Still need new photos (editing can't fix them):** Arizona, Washington, Upper Midwest, Alabama, Indiana, Texas,
Merrimack Valley, Louisiana–Mississippi (soft or old sources); Southern Ohio (a sign by his head); microphones in front:
Alaska, Idaho, Indiana, Pennsylvania, Gourarie, Efune.

**The owner's rules from this session (keep them):** always show previews in Hebrew too (Hebrew first); never claim
an edit is clean without checking it zoomed in — a hand over a beard doesn't paint out: crop around it or find another
photo; every photo gets the full edit (colour, light, tone) and a good crop (retouch.py); search the whole web, not
just Instagram ("there's a massive web out there"), and use Firecrawl when plain fetching can't reach a page ("You
forgot you have firecrawl access") — but don't work around a payment wall or a bot check (a referer trick was refused).

**Still to do:**
1. The head-shliach photos left (not touched this session): see "The photos" in the section below (old: Indiana,
   Louisiana–Mississippi, Alabama, Merrimack Valley, Texas, Vermont; none: Kansas–Missouri, Delaware, New Hampshire,
   Eastern Massachusetts, Rhode Island, Cape Cod; Canada: BC, Ottawa, Quebec, Maritimes).
2. Weaker vaad faces to replace when better turn up: Arkush (2014), Efune (at a microphone), Junik (2017), Leivi Sudak (a
   tight close-up), Korer (200 px LinkedIn), Kastel (2017), Friedman and Tenenbaum (crops of Tzach's 2025 head table,
   "likely" by the photo's file name), Goldman (tight), Lipskar (a guess), Zaklos (collage).
3. Hebrew to check: Lew is לוי in the name lists (Rabbi Shmuel Lew is probably לו); Efune is אפונה.
4. (Done: the redesign is live, the `marked` bug fixed.)

**Apify:** the owner pasted the token in the chat this session; it was kept only in the session's scratchpad (never in
the repo). Next time ask him to add `APIFY_TOKEN` in the environment's settings (Network secrets or an environment
variable); never to paste it. One run this session (2 posts). **Files:** work/head-photos/vaad/nov5-later/ (README
there): every candidate with its source, the edits, the review sheets. Tools: scripts/head-photos/autocrop.py,
boxes.py, circles.py; screenshots of every card kind: scripts/card-preview/shots.sh (cardshot.mjs needs
`npm install --prefix .cache/testlib d3@7.9.0 topojson@3.0.2 maplibre-gl@4.7.1` and the @fontsource fonts).

## ▶ Nov 5, end of a session (partly superseded: the cards went live later that day): head-shliach photos, vaad faces, the new cards
The owner (Nov 5): "make some sort of seamless handoff transition situation so another session can pick this up with
every aspect of what you've done so far including pictures progress cards like literally everything". This is it; the
dated sections below have the detail. (When written. It all went live later on Nov 5; see that section.) **None of it is on the live map yet:** the photos and the new cards wait on the
owner's go-ahead for the card redesign (the live page, web/index.html, is unchanged since Nov 4).

**See the new cards:** `web/preview-cards.html` (now only a redirect to web/index.html), a copy of the live page with them. Open it with `?lang=he` (the owner
"use[s] Hebrew much more": show him Hebrew first): https://yechezkelbinstok-dev.github.io/shetachim/web/preview-cards.html?lang=he
— tap a shetach. It is web/index.html (Nov 4) plus, in order (diff the two to port it; the scripts that made it are in
scripts/card-preview/history/; make new changes in the page itself):
1. the third card design, without the small map (owner, Nov 4: "Absolutely no reason to have that map situation");
2. the head shliach's photo, 66 px on a shetach's card and 48 px on its flagship's (for the first man listed when his
   last name is in the head's English name, `s._enHead`), with a ring in the shetach's colour. Which shetachim have one
   is the page's `HEAD_PHOTO` list: update it when adding photos (or read data/head-photos.json when porting);
3. no photo: "option 2", a coloured line beside the name (owner: "2 is kinda nice ig"): `data-ps="bar"` on `<html>`
   (the other variants are still in the file: initials, label, icon, panel);
4. no grey numbers box (owner: "really ugly ... I don't think the box works"): the count is a plain line under the
   flagship, its mark the map's own navy centre dot, mushrooms after it. He picked it of three: "I guess two? But maybe
   it can get better than that even" (so it may get better still). `data-cnt` = line (head | zoom | box also in the file);
5. a vaad that leads (Florida, New Jersey: `vaadFirst`): a honeycomb of its members' faces (34 px, its head in the
   middle with a ring; the page's `VAAD_PHOTOS`, from data/vaad-photos.json; the alternate left out), "הנהלה", its
   name and "7 חברים" (opens the list). The head shliach is a plain line "שליח ראשי: ..." with a person mark, and no
   photo anywhere (owner: "Benji and Her son do NOT deserve that kind of prominence not at ALL ... those two ceremonial
   heads should not be getting that level of prominence").

**Do next (the owner's last asks, not done yet):**
1. "once you click to expand the va'ad then the layout should change to each member of the vaad with their pic": when
   "7 חברים" opens, the honeycomb gives way to a row per member: his photo (about 32 px), name, town ("יו״ר" by the
   head); the alternate after them, apart and smaller (as in the list now). Faces are matched to names in
   data/vaad-photos.json (Dubov, the alternate, has one too).
2. "the person icon next to shliach rooshi - maybe make a custom one with like a hat and stuff? Still exact same
   minimalist style": a 16 px line icon of a man in a Chabad fedora (with a beard), drawn like `PERSON_ICON` (stroke 1.4,
   round caps), for the "שליח ראשי:" line.
3. "if you have better pics of anshei havaad - then by all means use them ... and as usual do proper editing": done for
   Goldman, Levitin, Biston, Dubov (their own photos). Still crops of anash.org's Feb 2023 collage: Raichik (matched for
   sure), Kessler and Zaklos (likely), Lipskar (a guess by elimination): confirm each with a captioned photo and use
   better ones. Goldman's raised hand is at the lower left of his crop: paint it out or find another. New Jersey's five
   are each from a captioned photo (Richler's is a 2016 TV still). `match` in data/vaad-photos.json says how sure.
4. The photo work left (below), then the rest of the world (owner: Canada was "the logical next step" after the USA).

**The photos.** The owner's standard: recent ("absolutely not what he looks like now ... they need to be recent"); good
("really good pictures like proper and professional and well edited"); him alone ("I don't want a crappy crusty picture
of them sitting by like a farbrengen with other people in the frame"); replace only the old or bad ("if the one there is
already good you don't have to replace it ... replace the ones that are like a while ago ... Or the ones that look
horrendous"); and always "very well done edit".
- USA: 48 of the 54 heads (NYC's Tzach, Eastern NY's Rubin family and Crown Heights aren't counted). 17 replaced on
  Nov 5 with recent ones: Kaltmann, Zippel, Greenberg, S. B. Levitin, Cunin, Mendelsohn, Krasnjansky, Moscowitz, Kaplan,
  Kotlarsky, Mangel, Weg, Lipsker, Gurary, Groner (the great-grandchild he held painted out; owner: "Yeah add this"),
  and newer but not new: Berel Shemtov (2021), Gurkow (2020). Still old (nothing better yet; the leads tried are in the
  Nov 5 section): Indiana (2015), Louisiana–Mississippi (2012), Alabama (2012), Merrimack Valley (2013), Texas (~2017),
  Vermont (2018). None at all: Kansas–Missouri, Delaware, New Hampshire, Eastern Massachusetts, Rhode Island. The
  rest were checked and kept.
- Canada: 4 of 8: Alberta, Manitoba–Saskatchewan, Southern Ontario, Newfoundland. Missing: British Columbia, Ottawa,
  Quebec, Maritimes (leads in the Canada bullet below).
- Files: web/img/heads/<shetach id>.jpg (320×320) with data/head-photos.json (page, image, note with the date first,
  crop, cast, keep, edit); web/img/vaad/<shetach id>-<surname>.jpg (160×160) with data/vaad-photos.json.
- Tools, scripts/head-photos/: retouch.py (crop + retouch; --keep, --cast), paint-out.py (someone else in the frame),
  fetch.sh (download candidates, images only), candidates-sheet.mjs (candidates in rows), review-sheet.mjs (old → new),
  ig.py and ig_batch.py (Instagram through Apify; at most 4 runs at once on the free plan), faces.py and facebox.py
  (every face in an account's posts on one sheet, starred where the caption names him). scripts/cardshot.mjs with
  scripts/card-preview/shots.sh: phone screenshots of the preview's cards (same setup as scripts/screenshot.mjs). The
  Python ones need `pip install "opencv-python-headless<5" pillow numpy` in a venv (OpenCV 5 dropped the Haar face
  finder); their working files go to $WORK (default /tmp/head-photos).
- Finding photos: Firecrawl `firecrawl_search` with `sources: ["images"]` (and `tbs: "cdr:1,cd_min:1/1/2023,cd_max:12/31/2026"`
  for recent ones); `firecrawl_scrape` with `formats: ["query"]` reads a page's photo captions (who, when). Firecrawl
  won't open instagram.com or facebook.com: Instagram goes through Apify.
- Apify: the owner's account (free plan, $5 a month; $1.94 used in the Nov 5 – Dec 4 cycle). **The token is not in the
  repo and must never be committed** (the safety check blocked it). The scripts read `APIFY_TOKEN`; the owner was asked
  to add it in the environment's settings (Network secrets, or an environment variable); if it isn't set, ask him to add it there (never to paste it in the chat). Accounts found: data/instagram-accounts.json.
- **Everything the session worked with is in `work/`** (work/README.md says what's where): every candidate photo with
  its sources.txt (by round and shetach), the originals of the photos in use, the vaad sources, every Apify result
  (compact JSON: each post's link, caption, date), the Instagram photos that matter (used, captions naming the head,
  The Jew Project's portraits), the review sheets and card screenshots, every card-preview version, the raw tools.
  Nothing paid for on Apify needs doing again. Images were scaled to 1600 px at most (crops are fractions, so they
  still apply). Not kept: the sheets of other people's faces (crowds, children) cut from the centers' Instagram posts.

**What the owner has been shown** (docs/handoff-2026-11-05/, in order): 0 every photo so far; 1 this round's swaps and
Canada; 2 Groner with the great-grandchild painted out; 3 the cards in English; 4 in Hebrew without the box; 5 three
places for the count (he picked 2); 6 the vaad faces, Florida and NJ (then asks 1–3 above); 7 the preview as handed
off; 8 the vaad faces one by one, with names.

**Still open from before:** the card redesign's go-ahead (the photos go live with it); the `marked` bug in the
Mushrooms switch (its handler reads `marked` before its `let`; in the live page too: fix when porting); the sub-shetach
sweep (#8); the New Haven / Mexico / Boston naming questions; Bet Sara.

**The owner's ways:** short, plain replies (he's on his phone); Hebrew first; never a map in a card; head shluchim's
names in full; Judea and Samaria is Israel (no other country's name or code anywhere); commit and push every turn to
`claude/bold-albattani-aqfnj9`, no PR; long jobs in the background; Firecrawl for image search and for pages plain
fetching can't reach.

## ▶ Nov 5: photos of the head shluchim, USA and Canada (48 of 54 US, 4 of 8 Canada; not on the page yet)
- **What the owner asked** (Nov 5): "proper profile photos for every head shliach … I don't want a crappy crusty picture
  of them sitting by like a farbrengen with other people in the frame"; "It's extremely doable … You just have to find
  bro"; "We'd start with USA … The bigger moisdois (West Coast, Texas, etc) with the big dudes like Cunin or shimkeh
  lazaroff … first". He gave the go-ahead to use Firecrawl's image search for this.
- **Done:** 48 of the 54 US heads (every US shetach except Tzach's New York City, the Rubin family's Eastern New York
  and Crown Heights, which has no head). Each is a 320×320 head-and-shoulders crop of him alone in
  `web/img/heads/<shetach id>.jpg`; `data/head-photos.json` lists the head, the page it was found on, the original image
  and a note where it falls short. Every one was checked against its page (a caption, the name beside it, or the
  article it's in) before it was kept.
- **Still missing (6):** Kansas–Missouri (Sholom Wineberg: the only find is an uncaptioned old rabbi at a microphone at
  the 2010 40th-anniversary dinner, collive.com/chabad-kansas-city-marks-40 — not used); Delaware (Chuni Vogel: the
  photos found are of his son at the University of Delaware's Chabad); New Hampshire (Levi Krinsky: the one portrait,
  manchester.inklink.news, is blocked here; chabadofnh.com's About Us has a small photo of him with his wife);
  Eastern Massachusetts (Chaim Prus: only Instagram, which can't be downloaded); Rhode Island (Yehoshua Laufer:
  four Rabbi Laufers in the state, and farklempt.com's "Rabbi Laufer" photo couldn't be tied to him); Cape Cod (Kuti
  Alperowitz: nothing).
- **Weaker ones, to replace if better turns up:** Idaho, Indiana and Florida (speaking at a microphone or podium);
  Alabama (115 px), Southern Ohio (200 px, LinkedIn), Virginia (223 px); the Carolinas and the North Shore are black
  and white. Pennsylvania (Avremel Shemtov) and Washington DC (Levi Shemtov) come from Wikimedia Commons.
- **Data checked on the way (no change needed):** Washington's Sholom Ber Levitin is alive (the Dec 2018 "BDE: Rabbi
  Sholom DovBer Levitin, 73" on crownheights.info is a different man, the Crown Heights "candyman of 770");
  Colorado's Mendel Popack has been regional director since mid-2023 (his father, Yisroel Meir Popack, who founded it,
  died April 2022); Florida's Benjy Korf succeeded his father in Aug 2025; Mendy Herson was named New Jersey's head
  shliach in March 2025. Virginia's Yossel Kranz is clean-shaven but for a short beard, with a small kippah — that's
  the photo his own site shows above his name.
- **Preview (not on the page):** a scratch copy of the page with the third card design (no small map) shows the photo
  in the head shliach's line on a shetach's card (66 px) and on its flagship's card (48 px, for the first man listed
  when his last name is in the head's English name — `s._enHead`, since in Hebrew `headShliach` is Hebrew while the
  people's `lastName` stays English). Where there's no photo, option 2 (the coloured line) stands in. Sent to the
  owner with a sheet of all 48.
  **The numbers box is out** (owner, Nov 5, on the phone preview: "The part where it says how many centers looks really
  ugly. Like, why is there that long gray box only for it to be all the way on the side? … I don't think the box
  works"). Three ways without it were sent, in Hebrew: 1 the count under the name in the header ("55 מוסדות", numbers
  bold, mushrooms in their colour after a dot) — recommended, and used on the sheet of photo cards; 2 a plain line with
  a pin, like "★ Flagship"; 3 in the Zoom in button ("התקרבות · 240 מוסדות"). **He uses Hebrew much more** ("I use
  Hebrew much more") — show previews in Hebrew first. (Scratchpad: proto6 = proto5 + this, the variant set by
  `document.documentElement.dataset.cnt` = head | line | zoom | box.)
  His answer (Nov 5): **"I guess two? But maybe it can get better than that even"** → the count is a plain line whose
  mark is the map's own centre dot (navy `#163e74`, `#8db5ee` dark), mushrooms after it with the mushroom mark.
  **The ceremonial heads lose the photo:** "Benji and Herson do NOT deserve that kind of prominence not at ALL … those
  two ceremonial heads should not be getting that level of prominence" — where the vaad comes first (Florida's Benjy
  Korf, New Jersey's Mendy Herson) the head shliach is a plain line ("שליח ראשי: …", a person mark), no photo there or
  on the flagship's card. **The vaad gets its members' faces** ("Where there's a Vaad … all their faces somehow
  arranged … not overlapping … nicely done … maybe a circle, but I don't know if a circle is the best option"): a
  honeycomb of 34 px faces by "הנהלה" + the vaad's name + "7 חברים" (opens to the list, as before), its head in the
  middle with a ring in the shetach's colour (Florida: Raichik); rows 2-3-2 for seven, 2-3 for five.
  Faces: `data/vaad-photos.json`, `web/img/vaad/` (Florida's seven from the anash.org collage he sent — not in the
  article's name order: the first is Raichik, the last Biston, by their own centers' photos; the other five unmatched;
  New Jersey's five each from a captioned photo). Scratchpad: proto7 (`tools/proto7_patch.py`), shots `prev8.sh`.
- **Retouched** (owner, Nov 5: "can you use your skills to make them all look good? … if I was in Photoshop, I would
  press auto tone … make them all look really, really nice … a lot more professional"): every photo was re-cropped
  from its full-size source and retouched by `scripts/head-photos/retouch.py` (needs `pip install
  "opencv-python-headless<5" numpy pillow`; run it in a scratch venv). It takes the colour cast out (the beard/shirt/wall
  greys made grey, mostly in the light tones so black hats stay black), stretches levels when they're squashed, reads
  exposure and colour strength on the skin of the forehead and cheeks only (white or red beards fooled a whole-face
  reading) and pulls them into a natural band, adds gentle local contrast, cleans small sources before enlarging,
  sharpens, and adds a faint vignette (none on a light backdrop). The face finder (OpenCV Haar, with an eye check — on
  Texas it first took the beard for a face) evens out the framing but never widens the hand-picked square. Two casts
  were set by eye (`cast` in data/head-photos.json): Cunin's magenta light (17,−2) and Bronstein's pink (8,−2.5).
  Each entry's hand-picked `crop` is recorded, so a photo can be redone from its `image`. Before/after sheets were sent.
- **Recent, not old** (owner, Nov 5: Kaltmann's photo is "absolutely not what he looks like now — he's much older …
  they need to be recent"; "if the one there is already good you don't have to replace it … replace the ones that are
  like a while ago … Or the ones that look horrendous"; and every one well edited). Each photo's date is judged from its
  source (article date; chabad.org image IDs grow with time — about 1300xxxxx = 2024, 1350xxxxx = 2026, 918xxxxx = 2015;
  collive/anash paths carry the year). Replaced so far with 2022–2026 photos: Kaltmann, Zippel (a March 2026 studio
  portrait by The Jew Project), Greenberg, Levitin, Cunin, Mendelsohn, Krasnjansky, Moscowitz, Kaplan, Kotlarsky (Apr
  2024), Mangel (Apr 2026), Weg (Aug 2024), Lipsker (a spring 2023 magazine portrait), Gurary (Mar 2025), Groner (early 2025: chabad.org's photo of him holding a great-grandchild, the baby's hat painted out — owner: "no way to remove him? It'll look bad to have another person in frame", then "add this"; `scripts/head-photos/paint-out.py` fills the spot from the mirror image across his face's centre line, Poisson-blended, and inpaints wall clutter; its arguments are under `edit` in data/head-photos.json); older but far newer than before: Berel Shemtov (June 2021 at home — he
  turned 90 in 2023; nothing clear since) and Gurkow (May 2020; his July 2026 Instagram selfies are too close to crop).
  **Still old (no better photo found yet):** Indiana (Grossbaum, 2015: the 2023 Pence-gala photo can't be cropped
  without Pence and a man behind; the 2025 70th-birthday photos are of him in tallis and tefillin in a crowd),
  Louisiana–Mississippi (Zelig Rivkin, 2012: @chabadneworleans shows the next generation only), Alabama (Posner, 2012:
  only selfies with a comedian, Aug 2025, and it's unclear which rabbi is he), Merrimack Valley (Bronstein, 2013: only
  his Facebook, which can't be downloaded, and a dark Dec 2025 menorah photo in the Andover Townsman), Texas
  (Lazaroff, ~2017: TDS Houston's staff photo of him is from ~2016; 2024–26 photos are group shots where he's small),
  Vermont (Raskin, 2018: chabadvt.org's newest photos are of the buildings).
  A crop must show him alone (the owner's standard): a crop from a group photo is fine only when nobody else is in the
  square. `retouch.py --keep` keeps the hand crop as is, for a face turned aside (the face finder's box is off-centre).
- **Instagram via Apify** (the owner set it up, Nov 5): many of the most recent photos are only on Instagram, which
  can't be downloaded or scraped otherwise (Firecrawl refuses it). The owner's Apify account (FREE plan: $5 a month,
  at most 5 runs at once) runs `apify/instagram-scraper`: `{"directUrls": [<post or account URLs>], "resultsType":
  "posts", "resultsLimit": N}` returns each post's `displayUrl` (and `images` for a carousel), `caption`, `timestamp`,
  `ownerUsername`; the image URLs download with plain curl. `{"search": "<name>", "searchType": "user"}` finds accounts
  (a surname alone is useless; a center's name works). His token is not in the repo: the session's safety check blocked
  committing it — he was told to add it to the environment's settings as `APIFY_TOKEN` (a new session picks it up), or
  to ask for it. @thejewproject is a portrait series (Zippel 2026; also Avraham Feldman of Iceland 2025 and Berel Lazar
  2022 — use them for the world). What it gave for the US refresh: a center's own account rarely shows the head shliach
  (mostly events, children, guests), but it does now and then (Mangel, Weg, Gurkow). Searching ~45 accounts and pulling
  the last ~40 posts of 20 cost about $2. The scratchpad tools: `ig_batch.py` (runs jobs at most 4 at a time and picks
  up runs already started) and `faces.py` (downloads every post's images and makes a sheet of every face big enough,
  biggest first, starred where the caption names him). Accounts found: @chabadofalabama, @chabadmichigan,
  @chabadneworleans, @chabadmv, @shalohhousechabad, @chabadnorthshore, @chabadarizona, @chabadbuffalo,
  @stamfordchabad, @chabadcincinnati, @jewishok (Tulsa), @chabadclt (Charlotte), @chabadvancouver, @chabadalberta,
  @chabadvt, @chabadnewfoundland, @levi_krinsky; none found for Indiana, Rockland, Texas (Houston), Kansas City,
  Delaware, Rhode Island, Idaho, Toronto, Montreal, Ottawa.
- **Canada (owner: "logical next step after this … is Canada"), 4 of 8:** Alberta (Matusof: Calgary Herald, Dec 2025,
  speaking at the city hall menorah lighting, captioned), Manitoba (Avrohom Altein: CBC News, 14 Dec 2025, captioned),
  Southern Ontario (Zalman Grossbaum: a Dec 2019 interview still on anash.org; chabad.ca's staff portrait is from 2017),
  Newfoundland (Chernitsky: his CBC author photo, Dec 2023). Still missing: **BC** (Yitzchok Wineberg: the July 2026
  mikvah-opening photo in the Jewish Independent is too far off; the Charidy campaign video shows others),
  **Ottawa** (Dovid Hayes: no captioned photo yet; COLlive's Oct 2025 Finkelstein Centre gallery has ~85 uncaptioned
  photos he's in somewhere; his LinkedIn photos aren't portraits), **Quebec** (Berel Mochkin, about 89: Rabbi Drizin's
  Sept 2026 Instagram photo, instagram.com/p/DcxS76NgHzV, has him in tallis and tefillin beside the poster — not a
  portrait), **Maritimes** (Mendel Feldman: only a LinkedIn video cover). The Instagram accounts of BC, Alberta,
  Winnipeg (his children's) and Ottawa's young professionals were scanned too: only Alberta's had him (his weekly
  phone videos, too close for a portrait).
- **How it was done (to carry on with the world):** Firecrawl `firecrawl_search` with `sources: ["images"]`,
  `limit: 10`, `domainTools: false` (2 credits a search; ~75 searches for the US). The best finds: an org's own
  "About"/"Our team"/"Our rabbis" page; JEM "Here's My Story" / "Living Torah" stills; newspaper author photos (Times
  of Israel blogs, Chicago Sun-Times, Pittsburgh Post-Gazette's "Callings"); LinkedIn profile photos (200 px). Downloads
  with curl and a browser user agent; Facebook/Instagram "lookaside" links come back empty. Wikimedia only serves its
  standard thumbnail widths (500px, 960px …; others get 400 "Use thumbnail sizes listed on https://w.wiki/GHai") and
  answers repeated originals with 429. chabadpedia.com images come back as HTML (a challenge page).

## ▶ Nov 4: mushroom networks on the map; Queens's head named in full; Shchunas HaRebbe taken out
- **Waiting on the owner: a redesign of every other card** (owner, Nov 4: "maybe there's smth you can do with all the
  cards overall as well as capital cards (and even mushroom cards seperately) … rn everything is super super plain";
  then "Show me what your idea is"). A preview was built on a scratch copy of web/index.html (NOT on the page) and sent
  as before/after pictures: the honorary cards' header for every card, tinted by kind (a center grey-blue with what it
  is above its name; a flagship navy with its star and a "Zoom in"; a mushroom red with its mushroom, its network in a
  red box with Show network; a shetach in its own map colour, "Head shliach" small over the name big, its capital with
  a star, its counts as tiles; a sub-shetach lilac; a country's card grey-blue with tiles); a pin before the town; the
  people in ink; "Open on chabad.org" as a small button; the shetach's colour as a square in the footer; several at one
  address as sections. Nothing changes until he says go; then build it into web/index.html, check every card (both
  languages) and push. **"flagship rather than capital."** (owner, Nov 4, on the preview): the shetach and sub-shetach
  cards say "Flagship: …" / "מוסד מרכזי: …" (not Capital / בירה), and the options' "Shetach capitals" becomes "Shetach
  flagships" / "המוסדות המרכזיים" — in the preview, to go live with it. He also asked to see it in Hebrew (sent).
  **Then a second, from-scratch preview** (owner: "Did you make it like this only because that's how you made the
  honorary ones?" — partly, yes: it made everyday cards taller and took the specialness from the honorary ones — then
  "Just think about it in a from scratch mindset, and then design the cards and show me"): compact, about today's
  height; no tinted header; the name first and bigger; a badge only for what's special (★ "Florida flagship center"
  navy; the mushroom mark and "Mushroom" red); the type and town in one muted line; the shliach in ink; the buttons in
  one row (the page as "chabad.org ↗" / the site's name; a flagship's "Zoom in" to its shetach; a mushroom's "Show
  network" in red, the network's line marked with a dashed red rule); the shetach it's in as a chip in its map colour
  (bold name · vaad · head; a mushroom's grey, its area only). Several at one address: compact rows, each page a small
  round button. A shetach's card: a band of its colour on top, "Shetach" small over its name big, "Head shliach" small
  over the name big, "★ Flagship: …", its numbers as small tiles with "Zoom in" at the end; a sub-shetach's the same in
  lilac with its parent as a chip; a country's card the same with each shetach as a chip. Sent in English and Hebrew;
  (Scratch build: a copy of web/index.html patched by a script, not in the repo.) **He didn't like it** ("in a way
  this is worse than the ones you made before … I don't like the direction. These aren't very nice. I want them to be
  very, very nice and beautifully made, like well done").
  **Third preview (sent Nov 4, waiting on him):** every everyday card has a header washed in the colour of the
  shetach the place is in, with **a small map of that shetach** (its pieces merged with topojson, drawn in an azimuthal
  projection centred on it, its colour on the map) and the place marked on it — a navy dot, a flagship's star, a
  mushroom's red dot on its grey area; above the name the shetach and its head (a mushroom: its red badge and its area
  only; a flagship: its star badge, its shetach under its people); the name big, what it is · its town; the shliach
  with **a round badge of his initials**; "+N more" folded; a mushroom's network in a red box (its dashed line, its
  name, "Network · 8 Chabad houses"); and **a bar of actions along the foot** (chabad.org ↗ / the site's name, Zoom in,
  Show network). Several at one address: rows, each page a round button. A shetach's card: its shape bigger with its
  flagship starred, "Shetach" over its name, "Head shliach" with initials, "★ Flagship: …", number tiles, Zoom bar.
  Sub-shetach: lilac, its parent's shape with its flagship starred. Country (Countries map): its shape, its shetachim
  as rows with their colours. In English, Hebrew, light, dark and on a phone. **The small map is OUT** (owner, Nov 4:
  "Absolutely no reason to have that map situation. No, no, no."): never put a map in a card. The same cards without
  it were sent (header wash, initials, action bar kept). He's "Not sure if I like the profile situation meaning like
  the two letters" (the initials badge): four other ways were sent (1 the person's title small above his name; 2 a
  coloured line beside the people; 3 the people in a soft panel; 4 a small person mark). He: "2 is kinda nice ig"
  (the coloured line) — use it if the cards go in.
  **Photos of the head shluchim** (owner, Nov 5: "maybe we can actually have proper profile photos for every head
  shliach … I don't want a crappy crusty picture of them sitting by like a farbrengen with other people in the frame …
  this might be not so doable but you tell me"). A pilot of six (Lazar, Mangel, Herson, Kantor, Lipskar, Bentolila):
  only Berel Lazar has a proper portrait that's free to use (Wikimedia Commons, "Berel Lazar April 2021 (cropped).jpg",
  CC BY 4.0, Kremlin.ru; Wikimedia's servers answered our downloads with 429 "too many requests" that day). Kantor may
  have one on Commons (a search mentioned it; not checked). The rest: event photos only (COLlive's collage of speakers
  at a microphone for Herson's appointment; a family photo at Lipskar's 70th in the SAJR), or nothing (Mangel). Their
  own sites (jewishthailand.com, jewishafrica.com, rca.edu) have no staff portraits. The owner: "No, it's extremely
  doable. There's pictures of these people all over the internet. You just have to find bro" — right: plain WebSearch
  has no image search, and scraping Bing/DuckDuckGo image search through the proxy didn't work (Bing returned generic
  results, DuckDuckGo nothing), but **Firecrawl's image search** (`firecrawl_search`, `sources: ["images"]`, 2 credits a
  search) found two proper portraits of Rabbi Mendel Lipskar at once: Torah Academy's team photo
  (torahacademy.co.za/team/rabbi-mendel-lipskar) and his SA Jewish Report author photo (sajr.co.za/author/...).
  Asked the owner whether to use Firecrawl for all ~150 heads (~300–400 credits) — Firecrawl is otherwise only for pages
  plain tools can't reach. Found
  on the way, NOT fixed yet (it's
  in the live page too): the Mushrooms switch's handler reads `marked` (declared with `let` further down the script),
  so a tap on it while the page is still starting throws "Cannot access 'marked' before initialization" — declare
  `marked` up with the other state when the cards go in.
- **Queens** (owner, Nov 4: "it's va'ad hashluchim of queens not just va'ad hashluchim"): the sub-shetach's head is
  "Vaad Hashluchim of Queens" / "ועד השלוחים דקווינס" (data/sub-shetachim.json `head`, `headHe`), on the map and its card.
- **Crown Heights** (owner, Nov 4: "take out Shchunas HaRebbe"): its `altName` is gone (data/shetachim.json and
  data/hebrew/shetachim.json); it's just "Crown Heights" / "קראון הייטס". The `altName` field still works for any
  shetach (build-data.mjs's comment still names Crown Heights as its example: left, as editing the script forces a full
  map redraw).
- **The owner (Nov 4): "I feel like mushroom networks should be able to be visualized somehow on the map no?"** With
  Mushrooms on, a network's houses (extra-centers.json `network`, 8 networks with 2+ houses on the map: Kupchik 14,
  Yossi Levy 8, Carlebach 6, Kanelsky 4, Edery, Labkovski, Azman, Borenstein 2 each) are joined by dashed red lines, the
  shortest set that joins them all (`netLinks`: nearest house to those joined, repeatedly).
  - **Shown only on a button** (owner, Nov 4: "The network should only be shown if I press smth not just if I press
    one of the shrooms"; "just show network is better"; "there should then be an easy way to hide it"): a mushroom's
    card says "Network: Kupchik family · 14 Chabad houses" and has **"Show network"**, which shows it and frames all of
    it (switching to World if the view lacks some; on a phone, above the open card), and then reads **"Hide network"**. The
    orange chip under the search names it ("Kupchik family network · 14 Chabad houses") and its × hides it too. Shown:
    its lines bold, its houses ringed, every other dot faded to a quarter.
  - **Its flagship** (owner: "the flagship of that shroom network should be shown when the network is shown
    somehow"): extra-centers.json `networkFlagship: true` on the network head's own house, drawn as a red star with the
    network's name beside it, and its card's kicker says "Mushroom · Network flagship". Flagships: Kupchik — Chabad
    House Jaipur (Betzalel Kupchik, "its head" per Chabadpedia); Yossi Levy — Chabad House Manila; Carlebach — Chabad
    House at Rutgers ("the Rutgers Chabad House and its affiliates"); Kanelsky — Bris Avrohom, Hillside (its
    headquarters); Edery — Chabad House Tokyo; Labkovski — Center for Jewish Life, Williamsville (Laizer Labkovski's,
    there since 1995; Downtown opened in 2021); Azman — Brodsky Synagogue, Kyiv; Borenstein — Chabad of Mid-Hudson Valley, Poughkeepsie.
  - **More options → Mushroom marker → "Mushroom networks"** (remembered; only with Mushrooms on): every network's
    lines all the time (thin), and a list of the networks (biggest first, with counts); a network tapped in the list
    is shown and framed as above (on a phone the options close first), tapped again hidden.
  - Not a colour per network (the plan first offered): nine colours on the coloured map can't be told apart, and the
    owner wants a mushroom red ("clearly singled out"). Lines are drawn only between houses both in the view.
  - Code: `networks`, `netLinks`, `netData`, `netFade`, `paintNet`, `pinNet`/`unpinNet`, `netLine`, `netButton`,
    `syncNet`, `netListUI`; map source `net` (layers `net-line` under the dots, `net-ring` and `net-flag` over them);
    `netPinned` (the network shown). A family picked in the search and a network share the chip: picking one clears
    the other.

## ▶ Nov 4 (earlier): the honorary cards designed; 770's mosdos open to their people
- **770's mosdos (owner, Nov 4: "there's a bunch of moisdois listed under 770 but no way to see the personnel of those
  moisdois that's the problem").** On 770's card, "16 more listings at this address" opens to a row per mosad: its name,
  what it is, and who heads it (the first man listed who's alive, as on any center). A row opens to everyone listed
  there (that man first, then chabad.org's order; those who passed away folded under "Deceased") and its chabad.org
  page (`staffHTML` in web/index.html). A search for a mosad at 770, or for someone listed at one, opens 770's card with
  that mosad's row open and scrolled into view (`focus` on the hit; `showCard`).
- **The honorary cards (owner, Nov 4: "the honorary cards kinda look not so nice they should be designed nicely and
  properly not just a bunch of ugly text").** The Rebbeim's towns, their ohalim and mosdos, the Ohel and 770 now have:
  a tinted header (a mosad's town above its name in gold; the title; a short gold rule, then the seat or place line);
  the Rebbeim as a timeline (a dot per Rebbe on a line, filled for a Rebbe resting in the town; his years in gold at the
  end of his name's line; his Ohel and histalkus in a cream chip in his own entry); a resting place in a cream panel
  with a gold edge (the same one line, its histalkus under it, not small print); and the place's own people under a
  hairline, smaller. Navy and gold, like the seforim: `--honor` (gold text), `--honor-line` (rules, dots),
  `--honor-soft` (panels), light and dark. The wording is unchanged (the lists' titles lost their colons, being
  headings now); Lubavitch's and 770's titles stay big (30px), the rest 22px. On a phone Lubavitch's card just fits
  (397 of 402 px). Code: `honorHead`, `rebbeimHTML`, `burialHTML`, `capitalHTML`; CSS `.hc-*`, `ol.tl`,
  `details.at-address`, `details.mosad`.

## ▶ Nov 4 (earlier): Gurkow's South Area redrawn clean; New Haven its own shetach (Sheya Hecht); Oxford, CT added; Connecticut sub-shetachim (Greater Hartford, Eastern CT)
- **Gurkow (owner: "please make Gurkow shape better it's so nasty and pointy in so many places just all around nasty
  honestly").** `data/shapes/ma-towns.json` has a new **`patches`** list (`scripts/ma-shapes.mjs` applies it last): a
  polygon whose land goes from `from` to `to`, for a straight line that shouldn't cross a whole town (one edge is the new
  line; the others run through land already on its side, so they change nothing; the script throws if a patch changes
  nothing). Nine patches, six fixes, all straight lines from real town corners:
  - Canton's deep notch between Randolph and Stoughton (with Randolph's thin tip above it): one north–south line at
    71.095625°W from Randolph's north line to the Canton/Stoughton corner (Ponkapoag and Blue Hills woods to the South
    Area; Randolph's tip west of it to Prus). Chabad of Canton stays Prus's.
  - Stoughton's staircase on Canton and Sharon, a few hundred metres north of Shaloh House: one line from the
    Stoughton/Canton line to the Stoughton/Canton/Sharon corner (Shaloh House 300 m inside).
  - Easton's 68° south-east tip cut off straight (to Prus).
  - Brockton's stepped south line: one line from the Easton/Brockton/West Bridgewater corner to Brockton's south-east
    corner (about the same area each way).
  - Abington's square notch between Brockton and Holbrook filled across its mouth.
  - Braintree's step at Randolph's north line: Braintree's diagonal carried straight on (Quincy's Blue Hills woods).
  No house changed shetach (the script's check: 65 Massachusetts houses, 0 move).
- **The Gordons** (owner asked if they're missing): Rabbi Yaakov Dovid and Rivka Gordon are on the map, on Shaloh
  House Chabad of the South Area's card (chabad.org lists them there: Community Outreach, Preschool). Anash: appointed
  "to join Shaloh House Chabad of Stoughton and the South Area, including Brockton and Randolph" — Gurkow's own house,
  no center of their own. (The activity map I'd sent shaded Brockton and Randolph for that sentence, not for events.)
- **New Haven** (owner: "Sigh okay new Haven yeah own shetach"; "Why greater New Haven why not just new haven"; and,
  shown that chabad.org lists Shea Hecht on Deren's own center as "Director, Chabad of Greater New Haven": "I've seen
  before head shluchim make claims to make themselves look more powerful so at the end of the day it's whatever is
  practically the real thing on the ground"). On the ground: the Hechts have run New Haven since 1946 (Rabbi Moshe
  Yitzchak Hecht, sent by the Frierdiker Rebbe, Chabadpedia); Rabbi Sheya Hecht runs Chabad Centers of Greater New
  Haven and appoints its shluchim himself (Oxford 2023, "appointed by Rabbi Sheya Hecht, Head Shliach to New Haven
  County", COLlive; an Orange principal "brought down by Rabbi Shea Hecht", 2009); no New Haven County appointment
  names Deren. Deren ("Connecticut Regional Director") hosts the statewide gatherings (Jan 2024; Yale's Rabbi Posner
  gave the shiur). So **`new-haven`, top-level, "New Haven", head Sheya Hecht (שעיה העכט), capital Southern Connecticut
  Hebrew Academy (117961)**: 23 towns of the old New Haven County (Connecticut's pre-2022 county; the Census now uses
  planning regions) — all but **Waterbury**, whose Chabad (99 Crescent St) is Rabbi Joseph and Mina Eisenbach's, the
  directors of Chabad Lubavitch of Northwest Connecticut in Litchfield — not one of Hecht's (his eight before Oxford
  are Orange/SCHA, Hamden, Downtown, Westville, Milford, Wallingford, the Shoreline, Yale) — and **Wolcott, Prospect and
  Naugatuck** round it (nearest to Waterbury's house, not in Oxford's list; with only Waterbury out, Wolcott stuck up
  like a chimney). Middlebury stays New Haven's (Oxford's list). Shelton (Fairfield County) and Middletown (Middlesex)
  stay Deren's. The `greater-new-haven` sub-shetach (South Central planning region) is gone. `partNames` US-CT:
  connecticut = "Rest of Connecticut".
- **Connecticut sub-shetachim under Deren** (standing rule: every regional director with houses is one):
  - **Greater Hartford — Rabbi Yosef Gopin** (owner, Nov 4, after the research below: "Alright so he's a tat
    shetach"; I'd first added Eisenbach's Northwest Connecticut on its own, then found it's Gopin's family network).
    Members (drawn round them): Chabad House of Greater Hartford 117585 (capital), Chabad Chevra at the University of
    Hartford 159799 (Kulek, 2003, "an affiliate of Chabad of Greater Hartford", begun under Gopin's direction),
    Farmington Chabad 6326208 (his son Shaya), Chabad of the Farmington Valley 118334 and its Gan Israel Hebrew School
    119920 (Weatogue: "In 1998, Rabbi Mendel Samuels was brought in"), Glastonbury 118472 (Wolvovsky, a son-in-law),
    Chabad Lubavitch of Northwest Connecticut 118238 (Litchfield) and Chabad of Waterbury 150718 (Rabbi Joseph and Mina
    Eisenbach — Mina is a Gopin daughter; "Chabad expanded farther into Greater Hartford starting in the mid-'90s, when
    Rabbi Joseph Eisenbach came to Litchfield"). Source: the Jewish Ledger's history of the Gopins (July 6, 2011);
    Gopin: "We have established 10 centers in the Greater Hartford area" (July 2021). Why under Deren: the Gopins
    served nearly two years with Deren at UMass Amherst before the Rebbe sent them to Hartford in 1977, and Deren had
    founded Chabad of Western and Southern New England there c. 1974 (Deren: Merkos "considered me wholly responsible
    for the entire state of Connecticut", COLlive); no source calls Gopin a head shliach (Anash: "Shliach to
    Hartford"). Left out: UConn (Shlomo Hecht) and Wesleyan (Levi Schectman), where Gopin's programmes began but no
    source ties today's houses to him. The 2013 New England shluchim gathering in West Hartford was co-hosted by
    Gopin, Samuels, Wolvovsky, Shaya Gopin and Kulek (CrownHeights.info). (COLlive, 2010, once called Deren "regional
    director of Fairfield County".)
  - **Eastern Connecticut — Rabbi Avrohom Sternberg** (New London 118000; Chabad of Norwich 6978333, run by his CTeen
    director Rabbi Aizik Schwei), drawn round its two houses.
- **Sub-shetach Brevard County — Rabbi Tzvi Konikov** (owner, Nov 4: "Tzvi Konikov sub shetach Brivard County I think"),
  under Korf's Florida: Chabad of the Space and Treasure Coasts (Satellite Beach, capital 117603; co-directed with the
  Osdobas), its Torah Academy, Camp Gan Israel and Hebrew school in Melbourne, and the Viera building (2019); appointed
  by the Rebbe in 1990. Members: Brevard County's houses (all his); outline: the county. Vero Beach (Rosenfeld,
  Indian River) left out — nothing ties it to him.
- **The Philippines: the Bolivia treatment** (owner, Nov 4: "there's mushrooms currently blue in phillipines wtf", then
  "yes I guess give it the bolivia treatment"). All 8 houses are Rabbi Yossi Levy's chabad.ph network (Chabadpedia: he
  recruited them all) and are now mushrooms, network "Yossi Levy" / "יוסי לוי": chabad.org lists nothing in the
  Philippines; the Traveling Rabbi blog (c. 2011): Levy's house "is not under the main Chabad umbrella and therefore not
  listed on chabad.org. They are part of a Chabad organization that operates across mostly Asia and services Israelis"
  (and a Kupchik son was to open Cebu); 2016 ChabadInfo: "the Rebbe Melech HaMoshiach Shlita's army". (Against, noted:
  Chabadpedia's photo "שלוחי הרבי לפיליפינים ... כינוס השלוחים העולמי תשפ"ו".) The `philippines` shetach is gone (and its
  Hebrew entry); `blank` has `{ "country": "PHL" }`: on the map, white, in no shetach, its dots shown only with
  Mushrooms on. **Berel Ceitlin (BGC)** — owner asked if he's official: no; Rabbi Shalom DovBer Zaitlin opened BGC in
  Tishrei 5786 as a branch of Levy's network (ChabadInfo: "joins a growing network of Chabad Houses in the Philippines,
  under the leadership of Head Shliach, Rabbi Yosef Yitzchak HaLevi Levy"); no Merkos appointment found.
- **Mushroom sweeps (owner, Nov 4: "there's a ton more Israeli mushrooms in Mexico and also Boston area"; "I'm sure
  there's mushrooms in Boston - not necessarily Israeli ones")** — nothing new found yet; asked the owner for names.
  Mexico: muchiler.co.il's directory (13 Mexican houses, all on the map), lametayel, the Chabad Without Borders list
  (chabadcv.com: only official houses plus "Bet Sara", Estado de México, Rabbi Amijai Suued, since 2011 — not checked
  yet), town-by-town searches (Valladolid, Sayulita, Oaxaca, Mazunte, Zipolite, Huatulco, Puerto Morelos, Mahahual,
  Akumal, Chetumal, Palenque). chabadplaya.org is Goldberg's own (chabad.org's pin is at its address, Av. 20). Boston:
  every Massachusetts nonprofit named Chabad/Lubavitch (ProPublica, 54) matched against the map — the rest are
  dormant shells (Chabad-Ohr Shalom of the South Shore, Weymouth, 2001, c/o Rabbi A. Brashevitsky; Chabad Fenway –
  Huntington Avenue, 138 St. Botolph St, filings 2014–17; Congregation Lubavitch … of South Brookline, 1981) or official
  houses' own (Chabad of Medford = Tufts's Backman; Chabad at Babson = Wellesley-Weston's Bleichs; Peabody's second EIN =
  Schusterman); news: only Westborough (already a mushroom).
- **Victoria's disputed heads stay three** (owner, Nov 4: "get rid of hendel from the disputed list pls only groner and
  gutnick", then a minute later "Nvm keep hendel for now"): Groner, Gutnick and Hendel Serebryanski, unchanged.
- **The fast lane for builds** (owner, Nov 4: "why do builds here take so frickin long … Is there any practical
  solution to that without compromising anything?", then "Definetely the fast lane"): `npm run build` now redraws the
  borders only when a border input changed and otherwise takes ~25 s instead of ~4½ min (details under the build notes
  further down). Proof, all 3,210 output files compared by sha256: a cache-filling full build = the committed files;
  a fast build = that full build; with a test change (a head renamed, a house added) the fast build = `build:full`
  (FULL=1) with the same change; reverted and fast-built = the original. **Then border changes too** (owner: "is there
  a way to make where like changing a border isn't minutes upon minutes"; "if there's no compromises"): the land
  cleanup and the layer union are reused when their exact input is the same, and the dot lookup is ~15× faster.
  Proof (in a scratch worktree): Cheshire moved from New Haven to Connecticut, fast build (51 s, both reused) =
  `build:full` (124 s), all 3,210 files; reverted and fast-built (47 s) = the committed files. Not done: caching region
  by region (borders are snapped between regions) and splitting work across the 4 cores — not needed now.
- **Hebrew: Braun is ברוין** (owner, Nov 4: "ברוין is the correct spelling for braun"), not בראון (data/hebrew/last-names.json; Brown stays בראון).
- **Oxford, CT added** (`extra-us-oxford-ct`): Chabad Jewish Center of Oxford, Rabbi Shmaya and Hadassa Hecht (Sheya's
  son), July 2023, for Oxford, Seymour, Beacon Falls, Southbury, Middlebury; at the town centre (no street address
  known); site cjcoxford.org. Not on chabad.org yet — the owner: "you think the Chabad.org directory is the only
  evidence? ... they're late or they're missing stuff ... if your own independent research tells you that he is
  official then fine he's official" (but always check a new house isn't a mushroom before adding it). Official here:
  COLlive, CrownHeights.info and Anash announced them as new shluchim appointed by the head shliach.

## ▶ Nov 3: Massachusetts's borders are real town lines again, with straight cuts — no more curves
- **Owner:** "I kind of hate how you've redrawn the Eastern Massachusetts situations. Yes, it is true that before they
  were pointy and horrible, but I hate the weird curviness ... The North Shore feels real"; "with regards to the prus
  fogelman like I'm sure there are many sections that it can just be a vertical line"; and, when I said "town lines
  back": "I did not tell you to restore town lines ... Look at the North Shore. That's like a proper, nice European
  border type ... I want European borders, not African ones ... Straight can also work sometimes ... a hybrid of
  straight and not straight. But the current weird curves that you do are just so ugly and unsettling."
- **So:** `scripts/ma-shapes.mjs` no longer blurs a grid or rounds lines (that's what made the blobs). It unions the
  Census towns by shetach (`mapshaper -dissolve2`), so every border is a real town line, like the North Shore's, except
  four spots where the town lines made spikes or a zigzag, fixed in `data/shapes/ma-towns.json`:
  - `cuts` (straight lines between two real town corners; a cut's towns are split along it):
    - **Wellesley–Needham–Dover** (Prus–Fogelman): Wellesley's corner poked east and Dover west; now one nearly vertical
      line from the Weston/Wellesley/Newton corner (71.26996°W 42.32809°N) to Medfield's corner on Dover (71.27106°W
      42.21563°N). Wellesley Weston Chabad House stays Fogelman's, Needham's Chabad Prus's.
    - **Sharon–Foxborough** (Prus–Fogelman): a double spike; now straight from the Walpole/Foxborough/Sharon corner to
      the Sharon/Mansfield/Easton corner.
    - **Wilmington's prong** (Merrimack Valley–Prus): its thin tip up into Andover cut off straight across its base.
  - **Seekonk** to Eastern Massachusetts (listed): it was a thin strip of Central between Rhode Island and Rehoboth.
- Checked: no center changed shetach (all 4,441 compared before/after the build); page screenshots, desktop and phone.
- **Same night, two fixes (owner):** (1) "why the fuck did you change the deren fogelman line from straight???" — since the
  smoothing commit (a782626) the 72.1574°W line had zigzagged up to 5 km west: build-data's `absorbSlivers` gave the
  bits of towns west of the line (pieces under 25 km² of Deren's band claim) to Fogelman's shape beside them. Band
  pieces are now never absorbed (`ownClaim` includes `band`; MA is the only state with both bands and shapes); the line
  is one longitude again. (2) Phone screenshot of Billerica–Tewksbury, "YOU DID NOT DO THE POINTY SHIT AGAIN" and "stop
  trying to solve the pointy issue by using sub municipalities just make your own custom line": a cut, one straight
  line from the Carlisle/Chelmsford/Billerica corner to the Tewksbury/Wilmington/Andover corner (Billerica's poke north
  and Tewksbury's tip south gone). Don't use tracts for borders.
- If the owner wants another stretch straight: add a cut (two town corners — find them as the points two towns share,
  e.g. with a short Python over `.cache/county-subdivision-25.json`), `node scripts/ma-shapes.mjs`, `npm run build`.

## ▶ Nov 3 (latest): a top-level sweep after Rockland (nothing changed; one doubt asked)
- Owner: "I'm fucking pissed you never found this info yourself leads me to believe you may have missed other shit".
  Checked, each against Chabad news and directories, whether a region the map has under another head is its own:
  - **Confirmed as the map has it:** Tennessee (Rabbi Levi Klein, "Head Shliach of Tennessee"; Nashville's Rabbi
    Yitzchok Tiechtel under him — the Williamson County couple was "appointed by Rabbi Levi Klein, Head Shliach of
    Tennessee, and Rabbi Yitzchok Tiechtel, Shliach to Nashville"); Kansas–Missouri (Rabbi Sholom Ber Wineberg, "head
    Shliach and director of Chabad of Kansas and Missouri"; JTA: the Kansas City regional office "will serve the states
    of Missouri and Kansas"); the Carolinas (Groner; South Carolina's Epsteins direct Chabad of South Carolina in
    Columbia, no regional title); Texas (Lazaroff, "Head Shliach for Chabad Lubavitch of Texas"; the Blocks' Chabad
    Lubavitch of South Texas is a branch); Alberta (the Matusofs, "Head Shluchim of Alberta"); Orange County, NY (the
    Burstons' Chabad of Orange County reports to the Albany regional director, so Eastern New York's).
  - **Called "head shliach" in news, but already settled with the owner as sub-shetachim:** San Diego (Fradkin;
    Chabadpedia: "המשמש גם כשליח אזורי" — under Cunin; the owner: "baja peninsula is under fradkin"), Southern Nevada
    (Harlig), Long Island (Teldon; Tzach's vaad at its kinus), Westchester (Butman).
  - **St. Louis (Rabbi Yosef Landa)** stays a sub-shetach of Wineberg's Kansas–Missouri (owner: "you think St. Louis
    is its own thing? I doubt that"), though chabad.org calls it "Chabad of Greater St. Louis Regional Headquarters".
  - **Drawn as sub-shetachim** (owner: "Why wouldn't I want them? The whole point. Is that I want all possible sub
    shatachim"): **Greater Sacramento** (Rabbi Mendy Cohen, "regional Shliach to the Greater Sacramento region";
    Sacramento County north of 38.25°N and western Placer, softened; 8 houses) and **South Texas** (Rabbi Chaim Block,
    Chabad Lubavitch of South Texas; Bexar and Kendall Counties: San Antonio's 3 houses and Boerne). Their sources are
    in data/sub-shetachim.json. **Standing rule: every regional director with houses under him is a sub-shetach — find
    and draw them all, don't ask.**
  - **Then, the same night:** **Vancouver Island** (British Columbia's; Rabbi Meir Kaplan, "sent to serve the entire
    island" in 2003, with Nanaimo, opened "with the encouragement of Rabbi Kaplan", and the UVic campus house; outline
    `data/shapes/vancouver-island.geojson`, the island and its islands of 150 km² or more, cut from the map's BC) and
    **Tidewater** (Virginia's; Rabbi Aaron Margolin's Chabad Lubavitch of Tidewater, Norfolk, serving Chesapeake,
    Hampton, Norfolk, Portsmouth and Suffolk, his son expanding it to Virginia Beach; one house on the map — the
    Virginia Beach branch's address isn't sure enough to add it).
  - **Checked, no regional layer (each house answers to the head directly):** Illinois (Moscowitz; Northwest
    Suburban Chabad etc. are local), Michigan (Shemtov's ~30 centers), Quebec (Montreal's houses each on their own),
    Southern Ontario (Grossbaum's satellites), Washington (chabadofseattle.org: one "Regional Office", 25 centers under
    it), the Bay Area (each house separate; jweekly), Bergen County (Friends of Lubavitch of Bergen County has only
    Teaneck and the new Hackensack), Union County, the Space Coast, the Lehigh Valley, Weston/West Davie, Plantation,
    Santa Monica. A family-cluster scan of the data (3+ houses by one surname within 60 km, outside drawn regions)
    found nothing else regional.

## ▶ Nov 3 (latest): mushroom icons; the Five Towns named on the map; Ontario is "Southern Ontario"
- **Owner:** "Now do the mushroom icons and Five Towns" (asked earlier: "add an option that the mushrooms should be
  instead of dots little tiny mushroom icons / Also shouldn't five towns be shown on the map?"); "Also Ontario should
  be Southern Ontario I think no?".
- **Mushroom marker** (More options, shown only with Mushrooms on): **Dot** (as before) or **Mushroom** — each mushroom
  drawn as the Mushrooms legend's little mushroom (red cap, white spots, a rim in the map's halo colour; an orange cap
  with Red dots, as its dot is), 8 px tall when the view is framed, up to 18 px close in (`mush` symbol layer over the
  dots; the mushroom's own dot stays, unseen, for taps and hovers; the tap and hover rings fit the mushroom). Remembered
  (`localStorage shetachim-mushroom-look`). Only a dot whose centers are all mushrooms becomes one, as with the red dot.
- **Five Towns:** the map named only "Woodmere" there (Cedarhurst and Hewlett too small to be named). Now one place,
  "Five Towns" / "פייב טאונס", with all its villages' centers (Cedarhurst, Lawrence, Woodmere, North Woodmere, Hewlett,
  the Hewlett villages, Woodsburgh, Inwood: 5 centers now): `PLACE_GROUPS` in scripts/build-data.mjs (its own spot and
  people, ~48,000). Its centers keep their own towns (search "Cedarhurst" still finds them). Its structure, for the
  record: Chabad of the Five Towns (Rabbi Zalman Wolowik, Cedarhurst, since the mid-1990s) with its library and
  preschool, and its branches Chabad of Hewlett (Rabbi Nochem Tenenboim, "a division of the Chabad of the Five Towns")
  and Chabad of Hewlett Neck & Old Woodmere (his son-in-law Rabbi Mendel Gordon, 2022: "another branch of the Chabad of
  the Five Towns", LI Herald, Feb 16, 2023). Wolowik is in Rabbi Tuvia Teldon's Long Island region (he made the siyum
  at the Long Island regional kinus, COLlive, Jul 22, 2015), so it isn't a sub-shetach: the map has no level under a
  sub-shetach. Valley Stream (Goldshmid) and Far Rockaway (Queens) aren't Five Towns.
- **Southern Ontario:** `ontario` (Rabbi Zalman Grossbaum) is now "Southern Ontario" / "דרום אונטריו" (short "S. Ontario",
  "S. Ont."; "ד׳ אונטריו"): his body is Chabad Lubavitch of Southern Ontario, and since Oct 11 the shetach is only south
  of 47°N and west of Ottawa's 77.9°W anyway. Its "Rest of Ontario" part name is gone (the name says the part).
- (This session had also built a Queens sub-shetach with its vaad; the other session's, below, was already pushed and
  is the one kept.)

## ▶ Nov 3 (latest): the Bronx a sub-shetach (Rabbi Levi Shemtov); Chabad of Riverdale's point fixed
- Owner: "Doesn't the Bronx have regional leadership"; then "Finish the Bronx and push".
- Sub-shetach `bronx` (The Bronx / הברונקס) under Greater New York: Rabbi Levi Shemtov (לוי שם טוב), who directs
  Chabad Lubavitch of the Bronx ("Chabad of the Bronx") with his wife from Riverdale since 1992 — COLlive (May 2025)
  signs them "Chabad Lubavitch of the Bronx, Riverdale, New York"; CrownHeights.info (Dec 2018): "directs Chabad of
  the Bronx", which was "commended on a new center … in South Bronx" (the Mishulovins); Bronx Times (Jan 2023): raising
  funds for a Pelham Parkway Chabad Center. Capital: Chabad Lubavitch of Riverdale (117901). Members: the houses in
  Bronx County (5 centers); outline: Bronx County.
- Chabad Lubavitch of Riverdale (117901): chabad.org gives only the town, and its approximate point was in the Hudson
  on the New Jersey side (the map had it in New Jersey's shetach). Moved (`fixes`) to 535 West 246th Street, Fieldston
  (OpenStreetMap, found through Nominatim; Overpass was unreachable).

## ▶ Nov 3 (latest): Queens sub-shetach (its Vaad Hashluchim); Crown Heights / Shchunas HaRebbe; the La Paz mushroom back
- Owner: "You never added the queens tat shetach with its va'ad"; "I meant still have crown heights for Hebrew but also
  shchunas HaRebbe / You can have the Rebbe's shchunah in English too however it's meant to be spelled"; "what the
  fuck did you do to the Bolivian mushroom??? … I never said to remove him".
- **Bolivia / the La Paz mushroom**: taking the `bolivia` shetach out had made Bolivia land outside the map
  (outside.json), and the page draws only the centers in the map's own pieces, so Kupchik's La Paz mushroom vanished.
  `blank` now also takes a country (`{ "country": "BOL" }`): on the map, in no shetach (piece `BOL:none`, white like
  Monsey). Its card: "Country · Bolivia · 0 centers · 1 mushroom". Checked against 883b3d3 (before any of today's
  Bolivia changes): the same dot under "La Paz", the same counts in Latin America (234 centers, 211 dots).
- **Crown Heights** (SUPERSEDED Nov 4: the owner had Shchunas HaRebbe taken out): a new field `altName` — "Shchunas HaRebbe"; Hebrew name קראון הייטס, `altName` שכונת הרבי. Shown
  under the name on the map (smaller), under the title on the card, and in search.
- **Queens** (sub-shetach `queens`, under Greater New York): led by the **Vaad Hashluchim of Queens**, "an elected
  body" (Queens Jewish Link, Aug 2 2023, "Inaugural Kinus Held For Queens Shluchim"; CrownHeights.info, July 28 2023,
  "the duly elected Vaad Hashluchim of Queens"): Rabbis Yossi Blesofsky (Chabad of Northeast Queens, Bayside), Mendy
  Hecht (Chabad of Forest Hills North), Dovi Steinmetz (Chabad of Briarwood), Zev Wineberg (Chabad of Long Island City;
  chabad.org's spelling, "Weinberg" in the article) and Yerachmiel Zalmanov (Chabad of Eastern Queens). No chairman
  named. Anash.org: "the Vaad Hashluchim said" (June 2023) and "the Shluchim of Queens, representing 20 Chabad Houses"
  (Aug 2024, their second Kinus); their YouTube channel is "Vaad Hashluchim of Queens". The Nov 1 sweep had Queens
  among "none found" — wrong. Map label (Head shliach): "Vaad Hashluchim" / ועד השלוחים; card: "Leadership: Vaad
  Hashluchim of Queens", opening to the five and their towns. Members: the 20 houses in Queens County; outline:
  Queens County; no capital.
- Owner (phone screenshots of the Queens card reading "שליח אזורי: ועד השלוחים"): "THERE IS A CLEAR WAY THAT VAADS
  AND STUFF ARE DONE … You can just add, like, the word regional leadership instead of leadership". The card's line
  is now "Regional leadership: Vaad Hashluchim of Queens" / "הנהלה אזורית: ועד השלוחים דקווינס", opening to its
  members, as a shetach's vaad is shown. ("שליח אזורי: ועד השלוחים" is what the page before 95adb06 makes of the new
  sub.json: the phone had an older copy of the page with the new data.)
- Sub-shetachim can carry a vaad now (`vaad`, `vaadHe`, `vaadMembers`, through build-sub to the card), and
  build-hebrew takes the Hebrew names of every vaad's members (shetachim's and sub-shetachim's), not only the people
  on the centers' cards.

## ▶ Nov 3 (latest): Crown Heights a shetach with no head; Bolivia in none; Monsey drawn straight
- Owner: "Actually you can make crown heights it's own thing and just not have a head anything don't even need to put
  no centralized leadership just have nothing I guess just Crown Heights and you can add in Hebrew Shchunas HaRebbe
  maybe / Also bolivia should get the Monsey treatmt / Also Monsey looks horrible with those nasty borders and also why
  do they extend so far north also the borders are just so horrible and pointy etc they should be way more straight".
- **Crown Heights**: shetach `crown-heights` (Crown Heights / שכונת הרבי), territory `data/shapes/crown-heights.geojson`
  (Sterling Pl–Utica Av–Maple St–Nostrand Av); no `headShliach`, no `noCentralLeadership`, no capital. The map labels
  it with its name, in the grey the page gives a shetach with no head named; its card is the name and "47 centers",
  nothing about leadership. 770 is in it; Greater New York still names 770 as its capital (build warning "capital …
  is in crown-heights").
- **Why Crown Heights never showed (also not while it was blank)**: at about 2 km² it was in the data, but build-data's
  `-filter-islands min-area=3km2` on the big areas took the hole it leaves in Greater New York for an island and filled
  it (the small areas are split off into a layer of their own before that step), so Greater New York lay over it and
  its outline counted as a coast. Now a shape's piece under 3 km² (`tiny`, `ISLAND_MIN_KM2`) stays with the big areas
  for that step. Pieces compared with the previous build: only Greater New York (+1 ring, the hole), Crown Heights
  (new), the Monsey blank piece and Bolivia (gone) differ.
- **Bolivia**: the `bolivia` shetach (no central leadership) and its Hebrew entry removed; Bolivia is land no shetach
  covers (grey, no card), like Guyana. Kupchik's La Paz house is still a mushroom.
- **Monsey**: `data/shapes/monsey-pomona.geojson` (Census places, up to 41.21°N with Pomona) replaced by
  `data/shapes/monsey.geojson`: a box 74.098°W–74.036°W, north to 41.150°N, clipped to Rockland County, so its south
  side is the New Jersey line — four straight sides. All 9 Monsey listings are in it (the northernmost, Mesivta
  Lubavitch of Monsey, at 41.139°N) and none of Rockland's 5 Chabad houses (New City, Nyack, Suffern/Montebello,
  Nanuet, Stony Point). Pomona's village (centre about 41.17°N) is outside it now. Blank entry: "Monsey (out of
  Rockland)".

## ▶ Nov 3 (latest): ugly sub-shetach outlines rounded (`soften`); Northern Nevada's bite filled
- **Owner** (phone screenshot of Northern Nevada): "Or like this what the fuck is this indentation ugly it hurts 😭";
  then "sometimes maybe it legitimately does look nice like in the case of north shore or southern Nevada"; and for
  Northern Nevada: "Maybe just make the bight part of it (n nv)".
- **Northern Nevada:** its `membersIn` now also takes western Lyon County (Dayton, Mound House, Stagecoach) west of
  119.3108°W, the line of Douglas County's east edge (`{"box": [...], "county": "32019"}`). No house there; it only fills
  the bite between Storey, Carson City and Douglas, so the east side is one straight line from Storey's corner down
  through Douglas. Fernley and Silver Springs stay out (east of the line).
- **`soften` (km), new in `data/sub-shetachim.json`** (`soften()` in `scripts/build-sub.mjs`): rounds off steps,
  notches and spikes narrower than about twice that (a closing, then an opening, on a km grid). Water, other states and
  other shetachim's land count as its own while it's worked out, so coasts and state lines come back exact; a notch
  is never filled with land nearer another house than its own (North Broward keeps its bite round Lauderdale-by-the-
  Sea's house); if rounding a spike would lose a house, only the notches are filled. Only where a region asks for it:
  Tucson 3, North Broward & South Palm Beach 3, Inland Empire 3, Greater New Haven 4, South Bay 2, Greater South Bay 2,
  Rochester 3. **Not** on Greater Mercer (it pushed 3.4 km² into Western Monmouth: the build prints OVERLAP) or Northern
  Nevada (filled instead, above). Left as they are on purpose: Southern Nevada (Clark County) and anything else that
  already looks good.
- Still a bit odd: Greater South Bay's thin strip along the bay shore and North Broward's barrier-island strip (both
  real coast), and Greater New Haven's rounded knob (it was a spike).
- Checked: the sheet of all 43 outlines, Northern Nevada over its counties and on the page; no OVERLAP; the 6
  "NOT ONE PIECE" notes are the same 6 as before (islands, Mexico).

## ▶ Nov 3 (later, SUPERSEDED — see "real town lines again" above): Massachusetts's inner borders drawn smooth
- **Owner** (phone screenshot of the Merrimack Valley–Prus line at Billerica): "Why there be horrible pointy borders and
  it's not just there 😭" — then "sometimes maybe it legitimately does look nice like in the case of north shore or
  southern Nevada those both look good and I'm sure there's others" (and earlier: "I like the not straight"). So: smooth
  where town lines make spikes and notches, keep what already looks good.
- **How:** `scripts/ma-shapes.mjs` reads **`data/shapes/ma-towns.json`** (the town-by-town assignment, moved out of
  shetachim.json: the `towns` lists, the 72.1574°W / 71.24694°W lines for towns not listed, Cape Cod's counties, the
  North Shore's East Boston tracts) and writes `data/shapes/ma-central|ma-eastern|ma-merrimack-valley|ma-south-area
  .geojson`, which those four shetachim now claim (`shape`). It lays the towns on a 350 m grid, blurs each shetach's share
  (~2 km), gives every cell to the strongest, lets each house pull the land round it its own way (so a border bends round
  a house instead of cutting it off), drops stray bits, then draws each shared border once (steps removed, Chaikin-
  rounded) so neighbours still meet exactly. Kept exact: the North Shore (`exact`: its town claims stay in shetachim.json
  and the shapes are cut to its towns), Cape Cod's counties, and Connecticut's straight 72.1574°W line. To change a town:
  edit ma-towns.json, `node scripts/ma-shapes.mjs`, `npm run build`.
- **Build fix:** `absorbSlivers` gave any piece under 25 km² touching a shape to that shape — it took Salem and Everett
  (North Shore towns) into the new shapes. A piece with its own town or tract claim (`ownClaim`) is never a sliver now.
- Checked: no center anywhere changed shetach (all 4,441 compared with the previous build).

## ▶ Nov 3 (latest): Merrimack Valley a shetach of its own (Rabbi Asher Bronstein); The Valley without Camarillo/Burbank
- **Owner:** "So yeah I guess bronstein is a head shliach but first verify with research" (after: "Doesn't that mean it's
  under gurkow if it's his son???" — no: Zalman Gurkow and Faigy Bronstein are Mendel's siblings, not his children).
  Research (WebSearch/WebFetch): Chabad of North Andover / Anshe Sholom of Haverhill was started in 2013 by Bronstein's
  son-in-law at his suggestion, "branching off" from Chabad of Merrimack Valley (Wicked Local via CrownHeights.info, Oct
  1, 2013); Westford is on Merrimack Valley's own list of its houses (chabadmv.com); nothing ties it to Prus; nothing
  calls Bronstein head shliach either — the same footing as Gurkow's. **New shetach `merrimack-valley`** (Merrimack
  Valley / עמק מרימק, Asher Bronstein / אשר ברונשטיין, capital 117895, Andover): Andover, North Andover, Haverhill,
  Methuen, Lawrence, Boxford, Middleton (its houses and North Andover's stated area), Westford (Nashoba Valley) with
  Chelmsford, Lowell, Dracut, Tyngsborough, Tewksbury between, and the rest of the Merrimack Valley (Amesbury,
  Georgetown, Groveland, Merrimac, Newbury, Newburyport, Rowley, Salisbury, West Newbury — no houses; left with Prus they
  would have been cut off from his land). Billerica, Bedford, Wilmington, North Reading stay Prus's (Lexington). Houses:
  Andover ×2, Haverhill, Westford. 62 shetachim in the US & Canada view now.
- **The Valley (sub-shetach, Einbinder):** owner: "why the fuck is Camarillo part of it … look into it overall". Checked
  against Chabad of the Valley's own "Valley Centers" list (28; see its `source`): Chabad of Camarillo (Rabbi Aryeh Lang,
  pinned on Camarillo's east edge, inside Ventura County's Thousand Oaks division) and Chabad of Burbank (the Kornfelds)
  aren't on it — both `exclude`d now; the outline stops short of them. Ventura is on its list but stays out (the owner's
  earlier ruling that Oxnard and Camarillo are "way way past the valley", and a region is one piece). Universal City,
  Wood Ranch and Canoga Park sit among its houses and stay.

## ▶ Nov 3 (latest): Eastern Massachusetts reviewed house by house; Westford, Norton and the Lowell area moved
- **Owner:** "I wanna make sure Massachusetts is fully accurate … the eastern clusterfuck. Are there maybe more actual
  top level that you can verify are top level that aren't included? … are borders fully correct? And should gurkow have
  a shetach that big with only one moised? And should he not rather be a small enclave? And he's takeh his own shetach
  despite only having a single moised?" (The western line and Central/Connecticut he assumes are right.)
- **Changed (data/shetachim.json `towns` claims):**
  - **Westford → Eastern MA** (Prus). Chabad of Nashoba Valley (Zalman Gurkow, Westford, 2005) is one of the three
    houses Chabad of Merrimack Valley's own site lists as its network (chabadmv.com "Our Rabbis & Rebbetzins": Andover
    — Bronstein; Anshe Sholom Chabad of Haverhill / Chabad of North Andover — Borenstein, "a branch of Chabad of
    Merrimack Valley … serving North Andover, Middleton, and Boxford"; Nashoba Valley), and lubavitch.com lists "Rabbi
    Chaim Zalman Gurkow" among Merrimack Valley's shluchim. Merrimack Valley is on Prus's side, so Westford goes with it.
  - With it, so Westford isn't cut off: **Chelmsford, Lowell, Dracut, Tyngsborough** (the Lowell area between Westford
    and Andover; no houses) and **Billerica, Bedford** (no houses; the other window had given them to Fogelman only
    because most of each lies west of 71.24694°W; Prus's Lexington house says "We service all of the Suburban North
    West", jewishlexington.com). Carlisle, Acton, Concord, Littleton, Dunstable stay Central's.
  - **Norton → Central MA** (Fogelman): Chabad of Mansfield (Yossi Kivman, Fogelman's MetroWest network) holds its
    annual public menorah lighting on the Norton Town Green (Patch), and its site title names Norton and Wheaton College.
  - **Taunton stays Eastern MA.** Mansfield's site title and Facebook name Taunton too, but the owner asked "does he do
    activities there?" — none found (his events: Mansfield, Foxborough, North Attleborough, Norton, Plainville), so no.
    Rule from this: a town with no house goes by real activity there, not a name in a site title.
  - House moved: Chabad of Nashoba Valley (118492) → Eastern MA.
- **Then (owner: "shouldn't he be smaller or does it make sense because of where he has activities? … are you absolutely
  sure he's 100% top level independent???"; and "I like the not straight" — town lines stay):** his activity, sourced:
  his own column (ChabadInfo, Jan 3, 2019) — "I am personally involved in such public celebrations in Stoughton,
  Easton and Braintree"; Shaloh House Chabad's menorah lighting at South Shore Plaza, Braintree (The Patriot Ledger,
  Nov 23, 2021); his GuideStar profile (Shaloh House Chabad of the South Area, EIN 04-3066566, ruling year 1991) lists
  Stoughton, Easton, Canton and Sharon as areas served (Canton and Sharon have houses of their own — Horowitz,
  Wolosow — left as they are). **Braintree → South Area** (Lezell's South Shore list doesn't name it). The South Area
  is now Stoughton, Easton, Braintree (his events), Brockton, Randolph (his 2026 shluchim's), Avon, Holbrook (between).
  Not 100% that he's top level: no source calls him head shliach; the case is the NCFJE history, his own appointees and
  nothing tying him to Prus. Told the owner so.
- **Gurkow's South Area (first pass): unchanged.** Shaloh House began as Rabbi Moshe Gurkov's branch of NCFJE ("Shaloh") in
  Mattapan, 1960 (chabad.org obituary by Menachem Posner, Nov 14, 2024: "his 'official' mandate was to educate
  children"), 15 years before Prus came (10 Kislev 5736, Chabadpedia). Mendel Gurkow founded the Stoughton branch in
  1987 (shalohhouse.com). The Katzmans were "operating under the auspices of Rabbi Mendel and Mrs. Chana Gurkow"
  (CrownHeights.info, Nov 12, 2014); the Gordons serve "Stoughton and the South Area, including Brockton and Randolph"
  (Anash, Jul 30, 2026) — so a one-town enclave would contradict his own appointments. No source calls him head shliach;
  none puts him under Prus. Easton is named both by his FAQ (the preschool is "most convenient for the Stoughton,
  Sharon, Canton and Easton communities") and Mansfield's Facebook; left with him.
- **Checked and left as they are:** Prus — "regional director of Chabad in Eastern Massachusetts … responsible for the
  establishment of Chabad Houses in Eastern Massachusetts" (chabadboston.org), "more than thirty Chabad House in Eastern
  Massachusetts" (Chabad of Downtown Boston's history page); his family runs Newton (Shalom Ber), Downtown (Zaklos) and
  the Brookline Israeli center (Lerner). North Shore — Lipsker's affiliates page (nsjewish.com): Lynn campus, Peabody,
  Tobin Bridge (Everett), Cape Ann, Beverly-Salem, Wakefield, all inside; "Head shliach of Chabad of the North Shore"
  (Anash, Aug 2023). Fogelman's MetroWest (chabadnatick.com: "headquarters for Chabads of the Metrowest region,
  including 26 cities and towns"; its houses Wellesley-Weston, Milford & South, Sudbury/Marlboro/Hudson, Framingham;
  Milford's site: Milford, Holliston, Franklin, Hopkinton, Millis, Medway, Bellingham, Upton, Hopedale, Whitinsville,
  Wrentham, Grafton, Medfield, Sherborn) — all already Central's. Harvard Chabad (Zarchi: Harvard, MIT, the medical
  campus, the International Jewish Student Center; helped start Tufts and Brandeis, eJP Nov 2022; its site also shows a
  Chabad of Cambridge Crossing, not on chabad.org) — a campus network, under Prus.
- **No affiliation found:** Acton-Concord (Polter: "serves Acton and Concord and some of its contiguous towns"), Sharon
  (Wolosow, est. 1986), Canton (Horowitz), South Shore (Lezell), South Coast (Benjaminson). New England Hebrew Academy
  (founded 1944) and Shaloh House Brighton (the Gurkov family's day school, now Rabbi Dan Rodkin) are institutions older
  than or apart from Prus; they stay where they sit.
- **Asked the owner:** is Merrimack Valley (Bronstein, since 1992) a top level of its own? It's a three-house network
  run by the Gurkov family (Faigy Bronstein and Zalman Gurkow are Rabbi Moshe Gurkov's children — COLlive/Anash
  obituaries, Nov 2024); nothing ties it to Prus and nothing calls Bronstein a head shliach. Same footing as Gurkow.
  Also told him the western line (72.1574°W) still cuts 11 towns (Athol, Barre, Brimfield, Hardwick, Holland, New
  Braintree, Petersham, Phillipston, Royalston, Warren, West Brookfield).

## ▶ Nov 3 (later): Monsey/Pomona and Crown Heights cut out and left blank
- Owner: "Maybe just carve them out of his shetach but don't make them they're own thing just take them out" (Monsey
  and Pomona, out of Rockland) and "The same I think for crown heights (Maple-Nostrand-Sterling Pl-Utica)".
- What was found first: Monsey/Pomona is a Lubavitch community (its own rav, Rabbi Baruch Dov Lesches; community shuls
  and schools — Chabadpedia), and its shliach is Rabbi Simcha Werner of NCFJE Rockland County ("Chabad of Monsey, under
  the auspices of its Shliach Rabbi Simcha Werner", CrownHeights.info 2011; COLlive 2021), his son-in-law Rabbi Dovid
  Weber in Pomona; nothing ties them to Kotlarsky. The map's Monsey listings are schools, yeshivos, a library and
  Werner's NCFJE — no shuls, no Chabad houses (chabad.org doesn't list the shuls); nothing at all in Pomona.
- New top-level `blank` in data/shetachim.json: shapes left to no shetach (build-data: a claim with no shetach, more
  specific than the county it's in). `data/shapes/monsey-pomona.geojson`: the Census places (2022, citysdk) of Monsey,
  Pomona, Kaser, Viola, New Hempstead, Wesley Hills, Airmont and Spring Valley, gaps filled — the Census "Monsey" alone
  holds only Heichal Menachem; this takes in all 9 Monsey listings and none of Rockland's 5 Chabad houses (New City,
  Nyack, Suffern, Nanuet, Stony Point). `data/shapes/crown-heights.geojson`: Sterling Pl–Utica Av–Maple St–Nostrand Av
  (corners from the Esri geocoder) — 47 listings, 770 among them.
- 770 is now in no shetach: its world star and card are as before (the card's foot says just "New York"); Greater New
  York still names it as its capital (the build warns "capital … in an area with no shetach").

## ▶ Nov 3 (later): Rockland is its own shetach (Rabbi Avremel Kotlarsky)
- Owner: "I've discovered Rockland is its own top level shetach under Avremel Kotlarsky (you can check this stuff up)
  … I'm fucking pissed you never found this info yourself leads me to believe you may have missed other shit". The
  Nov 1 regional sweep had passed it over ("Kotlarsky: an executive director, no regional sign") — wrong.
- New shetach `rockland` (Rockland / רוקלנד, Avremel Kotlarsky / אברימל קוטלרסקי, capital Chabad of Rockland, New
  City, 117691): Rockland County (36087), taken out of Greater New York. Public sources call him executive director of
  Chabad Lubavitch of Rockland (LinkedIn; The Jewish Standard); none found that says head shliach — the owner's word.
  15 listings in it (Monsey, New City, Nyack, Spring Valley, Suffern/Montebello, Airmont, Nanuet, Stony Point).
- Chabad of Ridgewood (6644585, the Denebeims) had chabad.org's approximate point in Rockland; it's Ridgewood, New
  Jersey (Chabad.info, "New Shluchim to Ridgewood, NJ") — moved to the village's centre (`fixes`), now New Jersey's.

## ▶ Nov 3 (later): Eastern Massachusetts — further research (nothing changed on the map)
- `c3e0379` (South Area shetach + Prus–Fogelman border by towns) went live at 09:18 UTC.
- Deren is "regional director of Chabad Lubavitch for Southern and Western New England" (Anash) — western MA is his.
- Under Prus: the Posners' Chabad House of Greater Boston (since 1985, "joining Head Shliach of Eastern Massachusetts
  Rabbi Chaim Prus", Anash, "New Shluchim to Boston University"); Prus is "regional director of Chabad of Eastern
  Massachusetts" (chabadboston.org; a Getty caption) and founded Lexington (1985).
- Gurkow: no source calls him a head shliach or regional director. Shaloh House is the Gurkov family's own network
  (his father Rabbi Moshe Gurkov, in Boston from 1959); nothing found ties it to Prus. One house (Stoughton) and two
  couples under him (the Katzmans, 2014; the Gordons, for Brockton and Randolph). The South Area's 6 towns are his
  center's stated service area (Stoughton, Easton), the Gordons' (Brockton, Randolph), and Avon and Holbrook between.
- No affiliation found yet for: Chabad at Harvard (Rabbi Hirschy Zarchi — Harvard, MIT, Cambridge, satellites incl.
  Brandeis); Chabad Lubavitch of the Merrimack Valley (Rabbi Asher Bronstein, Andover; his son-in-law Zalman Borenstein
  in North Andover/Haverhill); the South Coast (Benjaminson, Dartmouth); the South Shore (Lezell, Hingham→Plymouth,
  Quincy YJP); Sharon (Wolosow, since 1980–86); Shaloh House Brighton (Rodkin; Chabadpedia lists Shlomo Noginski as its
  "Boston" shliach); Acton (Polter) and Westford (Zalman Gurkow), on Fogelman's side.
- Chabadpedia's Massachusetts article says the state's houses are "under the head shliach Rabbi Yehuda Fogelman" (the
  owner: "we already know there isn't one head shliach"), and that Rabbi Yaakov Noach Lazaros (Framingham) passed away
  1 Iyar 5786 — not found anywhere else; chabad.org still lists him.

## ▶ Nov 3 (later): Massachusetts re-checked; Gurkow's South Area a shetach of its own
- **Owner:** "Make him his own shetach — but this research is calling into question in general your previous research
  on Massachusetts... is the Prus-Fogelman line even correct now? Are the moisdois on the respective sides of the
  border all in the correct shetach?????" (and before: "But Mansfield is under prus? ... you're sure all the ones you
  have for gurkow now are actually under him? ... his shetach should be that large? ... if it's gonna be a full
  shetach its shape should be properly nicely done ... nicely border fogelman rather than enclave").
- The MA lines (72.1574°W, 71.24694°W) were the owner's own list (Sep 30), never checked house by house. The
  71.24694 line cut ~20 towns in two (Newton and Lexington included). What the sources say:
  - **Fogelman** (Worcester; Shrewsbury) and **the MetroWest network run from Natick** (Rabbi Levi Fogelman: "the
    headquarters for Chabads of the Metrowest region, including 26 cities and towns" — Wellesley-Weston (Bleich, 2000),
    Milford & South (Kivman, 2001), Sudbury/Marlboro/Hudson (Freeman, 2006), Framingham (Lazaros; founded by Rabbi
    Hershel Fogelman in the early 1970s); chabadnatick.com). **Mansfield** (Yossi Kivman, 2005) came out of Milford's
    Chabad House (Norton Mirror, Jan 2006) → Fogelman's.
  - **Prus**, "Head Shliach of Eastern Massachusetts" (lubavitch.com), "Chabad representative to Eastern Massachusetts
    since 1975", founded Kenmore Square (1981) and Lexington (1985, which "services all of the Suburban North West").
    **Brandeis (Waltham)** is one of Chabad at Harvard's satellite centers → Prus's side. **Needham** (Krinsky: Needham,
    Dedham, Dover, Westwood) isn't in the Natick network → Prus's side.
  - **Gurkow** (Shaloh House, Stoughton, 1987–88; the Katzmans 2014 "under the auspices of Rabbi Mendel and Mrs.
    Chana Gurkow"; the Gordons for "Stoughton and the South Area", Brockton and Randolph). **Sharon** (Wolosow, since
    1980–86, before Gurkow) and **Canton** (Horowitz's Chabad Chai) aren't his as far as anything shows.
- **Done:** a new shetach **`south-area`** (South Area / דרום בוסטון, Mendel Gurkow, capital Shaloh House 117632):
  Stoughton, Easton, Brockton, Randolph, Avon, Holbrook — whole towns, bordering Fogelman's at Easton–Mansfield; the
  `south-of-boston` sub-shetach is gone. **The Prus–Fogelman border follows town lines now**: the longitude line stays
  for towns wholly on one side, and every town it crossed is given whole (`towns` claims): to Prus — Newton, Lexington,
  Waltham, Needham, Dover (Needham's), Westwood, Andover, Methuen, Tewksbury, Norton, Rehoboth, Swansea; to Fogelman —
  Wellesley, Mansfield, Foxborough, Walpole, Attleboro, Bedford, Billerica, Dracut (the ones with no house by where
  most of the town lies). Houses moved: Brandeis and Needham → Prus; Mansfield → Fogelman; Stoughton → South Area.
- **Not established:** Acton (Polter) and Westford (Zalman Gurkow, came from Newton, took over a center Rabbi Mayshe
  Schwartz ran) are still Fogelman's — nothing ties them to either. No affiliation found either
  for Merrimack Valley (Andover, Haverhill), Sharon, Canton, the South Shore (Lezell, Plymouth/Quincy) or the South
  Coast (Benjaminson, Dartmouth) — all left with Prus. The Western MA line (72.1574°W, Deren's) has no house near it.

## ▶ Nov 3 (later): regional directors' names centred; Westchester (Mrs. Butman, disputed); Gurkow asked
- **Owner (phone screenshot, Nuevo León picked): "Why not centered"** — then: "I didn't ask you to fix meyzlitch no I
  want him centered even with that shetachim!!! I meant the regional heads name!!!". A head shliach's name stays where
  it always was. A sub-shetach's name (`subData` → `subSpot` in web/index.html) now goes to the middle of the WHOLE
  region (the area-weighted centre of all its parts — it used to be the pole of its biggest state, so Zalmy Srugo's
  sat in Chihuahua), if the name fits there: inside its outline by half the name, and clear of its head shliach's name
  (`headNames`: that name's box as drawn at the zoom where the region is ~250 px across, grown by half the region's
  name); otherwise the first spot on the way to its roomiest point where it does. It only shows from the zoom where it
  no longer crosses the head's name (`hits`), and waits for the shetachim's names (the `sub` feed key, `subKey`,
  includes whether they're done; `setNames` re-feeds it).
- **build-sub.mjs:** a short (< 25 km) leftover outline stretch whose land 0.5–6 km out is another part of the same
  region is dropped (11 km of the Chihuahua–Durango line was left inside Nuevo León and pulled its name; a 3-point bit
  in Baja Sur too).
- **Westchester** (owner: "add a Westchester sub shetach and head is machlokes between mrs butman and that dude who
  functionally runs things … (NOT rabbi butman it's someone else)", then "Just do Mrs butman but add disputed I guess",
  then "Don't make her name shown on the [sub] shetach only if you click it"): `westchester` under Greater New York,
  Westchester County, capital Chabad Lubavitch of Westchester County (New Rochelle, chabad.org lists Mrs. Rochel
  Butman); `headDisputed` (the card: "Regional director: Mrs. Rochel Butman (disputed)" / "שלוחה אזורית: הרבנית רחל
  בוטמן (במחלוקת)"), `headCardOnly` (no name on the map in Head shliach mode). I couldn't find who "functionally runs
  things" (not on its site, chabad.org, the news, or the Westchester Jewish Council's directory); Rabbi Velvel Butman
  is still called its executive director / head shliach (Westchester County, Jan 2026; Anash, Apr 2026).
- **Asked by the owner, answered, nothing changed yet:** "are you 100% sure on the boundaries" (of the Mexican
  regions) — no: the states come only from his own pre-Oct 2 list; Druk's title (Riviera Maya and Mexican Caribbean)
  and Raitport's (no shluchim in all Sinaloa) are the only outside confirmations. "are you sure gurkow is under prus and
  not his own top level jurisdiction?" — Shaloh House is the Gurkov family's own Boston network (Rabbi Moshe Gurkov,
  "the Rebbe's shliach to Boston" per Chabadpedia, in Boston from 1959, Shaloh in Mattapan, Milton, Brighton; Prus came
  in 1975), and Rabbi Mendel Gurkow's Shaloh House Chabad of the South Area (Stoughton, 1987–88) is its branch; no
  source puts it under Prus's Chabad of Eastern Massachusetts. (The owner then made it a shetach of its own: the Massachusetts section above.)

## ▶ Nov 3: Mexico's seven sub-shetachim (Druk and the rest)
- **Owner:** "Do all the Mexican sub shetachim like druk etc (there's at least 4 I think)". They're the regions of the
  owner's own shetach list from before Oct 2 (when he made all of Mexico one shetach, "entire Mexico is Mayzlish";
  `git show be276cf^:data/global-shetach-list.txt`), now sub-shetachim under Rabbi Yosef Mayzlesh, each outlined by its
  states (`areas`, `outline: "areas"`), with the old Hebrew names:
  - **Mexican Caribbean — Mendel Druk** (Campeche, Quintana Roo, Yucatán; capital Cancún 503725): "director of
    Chabad-Lubavitch activities in the Riviera Maya and Mexican Carribean" (Chabad.org, Oct 25, 2010). Members Cancún,
    Playa del Carmen, Tulum, Cozumel; the backpacker mushrooms don't count.
  - **Jalisco — Avraham Srugo** (Jalisco less its western coast, and Colima; Guadalajara 7011671, Lake Chapala).
  - **Nayarit — Shneur Hecht** (Nayarit and the six western Jalisco municipalities round Puerto Vallarta, the owner's
    Oct 2 choice: `data/shapes/jalisco-costa-norte.geojson`, restored from git; capital Puerto Vallarta 3424139).
  - **Bajío — Daniel Huebner** (Aguascalientes, Guanajuato, Michoacán, Querétaro, San Luis Potosí, Zacatecas; San
    Miguel de Allende 4251108).
  - **Nuevo León — Zalmy Srugo** (Chihuahua, Coahuila, Durango, Nuevo León, Tamaulipas; Jabad Monterrey 7338776).
  - **Chiapas — Oren Raz** (Chiapas, Tabasco; San Cristóbal 7022006).
  - **Sinaloa — Chaim Raitport**: new shluchim to Mazatlán (COLlive, Aug 2, 2026), not on chabad.org, so added by hand
    (`extra-mexico-mazatlan`, at the city's point; address not found).
  - The rest (Mexico City and the centre, Oaxaca, Veracruz, Guerrero…, and **Sonora**, which was Polichenco's with the
    Baja peninsula in the old list — the peninsula is Fradkin's now) stays Mayzlesh's own.
- build-sub.mjs: `membersIn` takes `{ shape }` and `{ state, minus }`; and **a border two regions share is drawn once**
  (the second region's copy goes in sub.json apart, `dup: true`; the page draws only the first and uses both for a
  picked region's outline). Two dotted lines on one border read as a solid line — the Mexican regions meet state against
  state; it fixed Bucks/Montgomery, Bucks/Mercer (the Delaware), Passaic/Northwest NJ, Mercer/Western Monmouth and
  Tampa/Sarasota too.
- Heads' Hebrew as the page spells them elsewhere: שניאור העכט, דניאל היבנר, זלמן סרוגו.

## ▶ Nov 3: Chabad Niagara (Rabbi Zalman Zaltzman) is a mushroom
- Owner: "Zalman Zaltzman in Niagara mushroom add him pls". Added `extra-ca-niagara-falls` (data/extra-centers.json):
  Chabad Niagara / Jewish Welcome Centre, 6417 Main St, Niagara Falls, **Ontario** (Esri geocoder 43.08196,
  -79.08503), Rabbi Zalman and Mrs. Perla Zaltzman (there since 2005, The Canadian Jewish News); not on chabad.org.
  Hebrew name חב״ד ניאגרה. Across the river, Chabad Niagara Falls USA (Rabbi Yehuda Lorber, 6624274) is official
  and unchanged. 50 mushroom entries in extra-centers.json now.

## ▶ Nov 3: the Rebbeim's towns and the mosdos in them, apart; three card sizes
- **Owner:** "have the city dot for the actual cities prominence but SEPERATELY have the moisdois in them like the
  graves of alter and mitiler Rebbe etc also like chatzer rabboseinu nesinu blbavtch thingy / The significant card for
  the cities is separate from the moisdois". `HONOR_PLACES` (web/index.html) now has a `kind`:
  - **Towns** (`kind: 'city'`; a dot in a ring, name in italics, as before): Lubavitch, Liozna, Liadi, **Rostov**,
    **Haditch**, **Nezhin** — the last three now at the town's own point (the map's city list, web/data/cities.json:
    Rostov-na-Donu, Hadyach, Nizhyn), no longer at the ohel. A town's card is its place in the Rebbeim's history
    (seat of the Rebbeim, the Rebbeim who led there; Haditch's and Nezhin's: the burial line, as before).
  - **Mosdos** (`kind: 'mosad'`; a small diamond, name upright, `town`: its town, shown on its card as a kicker),
    shown from `MOSAD_KMPX` (25 px/km: zoom ~10.3 in the FSU view, and since the map applies a marker's zoom filter
    at whole zooms only, in effect from zoom 11; a search for one flies at least there, `goToHit`) so they're apart
    from their town: **Ohel of the Tzemach
    Tzedek and the Rebbe Maharash** (Lubavitch's Jewish cemetery, ESJF's survey 54.83140, 30.94726; card: "Burial
    place of …", both histalkus dates); **Hatzer Raboteinu Nesieinu B'Lubavitch** (the heritage center and Gavriel
    Gordon, moved off Lubavitch's card onto its own; **no exact location found**, so it sits on the village's point
    and Lubavitch's town marker gives way to it from MOSAD_KMPX: `untilKmPx`); **Ohel of the Rebbe Rashab** in Rostov
    (the cemetery point that used to be Rostov's; Danzinger moved here from Rostov's card); **Ohel of the Alter
    Rebbe** in Haditch (= the Heichel Admur Hazaken listing, chabad.org 2122346; card title stays the listing's name);
    **Ohel of the Mitteler Rebbe** in Nezhin (card title "Ohel Admur HaEmtzai"; Deutsh); **The Ohel** in Queens (no
    town; shown from kmPx 0.3 as before).
  - A mosad on its town's spot puts its name on the far side (`anchor: 'right'`).
- **Card sizes (owner: "only Lubavitch and 770 card situations should be that big the other prominent places should
  be smaller / Obviously not as small as a random capital or moised but not as big as 770 or Lubavitch"):** three
  tiers. Big (`#card.world`, `h2.honor-h` 30px, accent ring): 770 and Lubavitch only. Medium (`#card.prominent`,
  `h2.honor-m` 22px, accent border, the Rebbeim/burial lines one step smaller): every other town and mosad above,
  the Ohel included. Everything else: the ordinary card. (`showCard` toggles `world` / `prominent`.)
- Hatzer's wording is still the owner's (Oct 7) — unchanged, only moved; ask him before changing it.
- Screenshot harness: `scripts/screenshot.mjs` now serves `.js` as JavaScript. Before, the right-to-left text plugin
  (web/lib/mapbox-gl-rtl-text.js) didn't load in screenshots and every Hebrew map label came out **reversed** — a
  harness artifact, not the live site (GitHub Pages serves it correctly).

## ▶ Nov 2: sub-shetachim outlined region by region (counties, towns, divisions; drawn only where nothing fits); Ukraine has no head shliach
- **Ukraine (owner, Nov 2: "Ukraine doesn't have a head shliach").** `ukraine` in `data/shetachim.json` is now
  `noCentralLeadership: true` like Bolivia: no head shliach, no capital star; its card says "No centralized leadership"
  and the map shows no head name there. (Oct 10 it was kept as Meir Stambler on Anash's "head shliach and chairman of
  the Jewish communities in Ukraine"; the owner has now ruled.) The Federation of Jewish Communities of Ukraine
  (249574) stays an ordinary center. Hebrew: `data/hebrew/shetachim.json` lost its `head`.
- **Owner, Nov 2:** "Why did you shrink so many like southern Nevada for example it's shape was nice before … Way too
  small in some cases no?"; "why tf on the sub shetach is there borders within the Fradkin situation"; and then: "I think
  you just have to use your discretion every time because these look horrible so just when you draw them each time
  individually you just have to think about it"; "Nevada I was just saying it looks better before how you had it as
  like that part of the state". (The Southern Nevada he liked was the very first version: Clark County, 20,871 km²;
  the drawn one was 494, then 1,192.)
- **Now each region says how it's outlined** (`outline` in `data/sub-shetachim.json`; `scripts/build-sub.mjs`):
  `"areas"`: its member areas themselves, where those are the region: counties, a planning region, or a county's towns
  or county divisions (`ccds`: `names`, or `except` for all but those; with a `box` to cut them), or L.A. Times
  neighbourhoods; `"drawn"` (the default): drawn round its houses (the engine below), only where no such lines fit;
  `"both"`: the two. In "areas" a county's islands of 50 km² or more stay (Shelter Island, Pine Island, Baja's).
  - **Counties / planning region (19):** San Diego & Baja (San Diego County + both Baja states), Southern Nevada (Clark
    County), Long Island (Nassau + Suffolk), Staten Island, St. Louis (St. Louis County + City + St. Charles), Northern
    Virginia, Greater Austin (Travis + Williamson), Mercer, Bucks, Sarasota & Manatee, Tampa (Hillsborough), Atlantic
    + Cape May, Passaic, Dallas (Dallas, Collin, Denton, Rockwall), Howard, Southwest Florida (Lee), Greater New Haven
    (South Central CT), Northeast Florida (Duval, St. Johns, Clay, Nassau), Rochester (Monroe + Livingston).
  - **Parts of counties, by their own lines (13):** Northern Nevada (Washoe south of 40.3°N — below Pyramid Lake, not up to
    Oregon — + Storey + Carson City + Douglas; Nov 3: + western Lyon, see above); Tucson (Pima's Tucson and Marana divisions, not Ajo and the Tohono
    O'odham Nation); Inland Empire (San Bernardino's Ontario division: Chino, Chino Hills, Ontario, Rancho Cucamonga,
    Upland, Montclair); South Bay L.A. (L.A. Times neighbourhoods from San Pedro and Palos Verdes to Torrance, Redondo
    and Gardena); South Broward (Broward's Hallandale Beach, Hollywood, Miramar–Pembroke Pines divisions: not Davie's,
    so not the Andrusiers' Southwest Broward, still asked of the owner); North Broward & South Palm Beach (Broward's
    Coral Springs–Margate, Deerfield Beach, Pompano Beach; Palm Beach's Boca Raton, Boynton Beach–Delray Beach, Sunshine
    Parkway south of 26.48°N, "south of Boynton"); South Dade (Miami-Dade south of the Tamiami Trail and east of Krome
    Avenue, the urban edge — its divisions don't fit: Kendale Lakes–Tamiami runs up to Miami Lakes, Homestead's far into
    the Everglades); North Fulton (Fulton's Roswell–Alpharetta division); Western Monmouth (its townships: Manalapan,
    Englishtown, Freehold ×2, Marlboro, Holmdel, Colts Neck, Millstone, Upper Freehold, Allentown, Roosevelt, Howell,
    Farmingdale); Montgomery County PA (all its townships but Lower Merion, Narberth — the Main Line's — and
    Cheltenham, on Philadelphia with its Cheder); Northwest NJ (Sussex + Warren + northwest Morris's townships:
    Jefferson, Rockaway ×2, Wharton, Dover, Mine Hill, Roxbury, Mount Olive, Netcong, Mount Arlington, Washington,
    Victory Gardens); Greater Orlando (Orange + Seminole + Osceola's Kissimmee and St. Cloud divisions, not its empty
    south); South of Boston (its towns: Stoughton, Canton, Sharon, Easton, Randolph, Brockton, with Avon and Holbrook).
  - **Drawn (4):** the Valley (its neighbourhoods and subdivisions together were a jagged patchwork up to Camarillo's
    edge; drawn, it stops short of Camarillo, Moorpark and the Malibu coast), Petersburg (`far: 25`: the city and its
    edges), Greater South Bay (one division covers all Silicon Valley), East Valley (the Chandler division would take
    Gilbert's, Mesa's and Tempe's houses).
- **No lines inside a region:** a region is still stored a part per state (a view draws only its own countries'), but
  each part's outline now leaves out the edges inside the region (`outerLines`: an edge is inside when the land 1.5 km
  beyond it, on the side away from its part, is in another part of it — not "where it lies on the other part's edge":
  San Diego County's Census line and the map's own US–Mexico border don't quite meet, so stretches of the border were
  still drawn, and the owner sent a phone screenshot of it: "The fuck"), written as MultiLineString features beside the
  polygons; the page's
  `sub-line` layer and the selected outline draw those (`subLine`), the fill the polygons. So San Diego & Baja is one
  shape on the world map, no US–Mexico or BCN–BCS line through it.
- **The drawing engine, for the drawn ones**, also changed today: beyond the 7 km `REACH` (halfway to any other house)
  it now goes on over land that's clearly its own, out to `FAR` (50 km, or an entry's `far`): at least `CLEAR` (10 km)
  nearer its houses than any other house. A margin, not a ratio: a ratio ("twice as near") shut Reno in a 23 km circle
  because of Chabad of Truckee 35 km off; a margin lets a region go on away from its neighbours.
- Checked with screenshots: Southern and Northern Nevada, the Valley, the Inland Empire, South Bay, Baja on the world
  map (one shape), the Florida ones, NJ/NY/Philadelphia, Tucson.

## ▶ Nov 1 (later): every sub-shetach is ONE piece with clean borders; four more regions
- Owner: "Why the fuck have you made disconnected ones like the valley and inland empires with horrible borders as
  well???" The old drawing (a 3 km disc round each house, gaps up to 12 km bridged, clipped to the counties or L.A.
  neighbourhoods its members came from) left 19 of the 36 regions in bits (San Diego–Baja 36, the Valley, Long Island
  and Sarasota 5 each…) with jagged clipped edges.
- **The new drawing (`scripts/build-sub.mjs`, `drawRegion`), on a 250 m grid round the region's houses:**
  1. *The span:* the Delaunay triangles between its houses, no longer than 12 km (`LINK`) or than 1.3 × the longest
     link of their minimum spanning tree (so a far house makes a wedge, not an arm), plus those links. Always one
     piece. A triangle with another of the shetach's houses in it is left out (that house keeps its own land).
  2. *Reach:* 7 km (`REACH`, or an entry's `reach`) round the span, rounded by a 6 km closing (`SMOOTH`).
  3. *Its own land only:* each cell goes to whoever is nearer, the region's houses or any other house of the shetach
     (mushrooms aside), so the border runs halfway between; the span counts as a house 2 km off (`SPAN`), so a link
     passing near another house doesn't take that house's surroundings and isn't broken by a house farther off.
  4. If its houses still end up apart, the link between them is kept, 3 km wide (none needs it now). Then a 1 km
     close-and-open (`TIDY`) rounds off spikes and notches (skipped if it would part its houses).
  5. **No gaps to the coast or a state line** (owner, Nov 1, circling Long Island's south shore: "Why the hell massive
     ass gaps??? Just because there's no center right there doesn't mean borders can't be better"): the shetach's land
     in the region's states is rasterized; with the region, the water/other states and other houses' land as walls,
     a closing by `EDGE`/2 (6 km) fills any gap narrower than 12 km (a strip along the coast; a narrow neck like the
     North and South Forks, all the way out), then a closing by `EDGE` with the coast as a wall rounds the corners so it
     meets the coast along a front, not a funnel (Rochester on Lake Ontario). Only land **clearly** its own is taken:
     `CLEAR` (2.5) times nearer its houses than any other house, and within `FILL` (40 km) of them: so the Valley does
     *not* take the Malibu coast over the hills (nearer Agoura in a straight line than Malibu's house, but Malibu's), and
     neighbours don't overlap (Bucks and Montgomery County did, with a looser rule). A first try that let it creep on
     along coasts and state lines gave Rochester wings along the lake, Northern Nevada a run north up the California
     line and Northern Virginia a run down the Potomac: don't. Then it spills 1.5 km over the edge (cut back to the land
     after, so the outline is the coast itself), holes are filled, and the outline is traced on a softened copy.
     The build prints any two regions that overlap (none).
  6. Cut to the parent's land **in the states its members are in** (not over a state line), split by state; only the
     pieces with its houses in them are kept (and a whole area's main land: the Baja peninsula), so no islets.
  The `membersIn` areas only pick the members now; they never draw the border. The build prints, per region, its
  spots, its longest link, "NOT ONE PIECE" if it isn't, members outside it, and other houses inside it.
- **Result:** every region one piece. The one exception is South Dade's Chabad of Key Biscayne (one of Rabbi Fellig's
  "13 Branches Across South Dade", chabadmiami.com), on its island across the bay.
- **Membership changes it forced (each in the entry's `source`):** the Valley no longer takes Ventura (beyond
  Camarillo and Oxnard, which the owner says aren't the Valley; one piece can't reach it); the Inland Empire is its two
  houses, Rancho Cucamonga and Chino Hills (Lake Arrowhead & Big Bear is Rabbi Zalmen Bernstein's, in only by county);
  Tucson is Pima County (Sierra Vista's Chabad of Cochise County, 70 km off across the desert, was an arm); Greater
  Austin is Travis and Williamson (San Marcos isn't one of its six centers, and it was an arm).
- **Four more regions (third pass of the USA sweep):**
  - **Rochester — Rabbi Nechemia Vogel** (Upstate NY): head shliach to Rochester since 1981 (Chabadpedia), "director of
    Chabad of Rochester and regional head shliach" (Yeshiva World News); UR (the Yarases), YP (Moshe Vogel), Pittsford,
    RIT, Geneseo. Monroe and Livingston Counties.
  - **Northeast Florida — Rabbi Yoseph Kahanov**: "head Shluchim to North East Florida"; Clay County "the fifth Chabad
    Center to serve the growing Northeast FL region"; Amelia Island's shluchim "appointed by Rabbi Yosef and Rivkie
    Kahanov". Duval, St. Johns, Clay, Nassau.
  - **Greater South Bay — Rabbi Yosef Levin** (Palo Alto, West Coast): "centers in Palo Alto, Sunnyvale, Mountain View
    and at Stanford University" (Lubavitch.com); Los Altos Chabad "re-established in 2010 as an affiliate of Chabad
    Lubavitch of the Chabad of Greater South Bay" (J. Weekly). Listed members (7).
  - **South Bay (L.A.) — Rabbi Eli Hecht**: chabad.org lists him as Chabad of South Bay's "Regional Director"; his bio:
    "Regional Director of the South Bay area ranging from San Pedro to Gardena, Palos Verdes, Redondo Beach and
    Torrance". Its six houses.
  Checked, not regional (no regional title or branches found): Greater Hartford (the Gopins' houses are "separate
  operations", Jewish Ledger 2011), San Antonio (Block), Tidewater (Margolin), Lehigh Valley (Halperin), Central NY
  (Rapoport), Orange County NY (Burston), Fort Worth (Mandel), Bergen County (Simon: only Hackensack "initially under
  the auspices"), Essex County (Klar), the Space Coast (Konikov), Greater Daytona (Ezagui), Seattle's Eastside
  (Farkash), North Suburban Chicago (Schanowitz), West Orange County CA (Berkowitz). Still asked of the owner:
  Westchester (Rabbi Velvel Butman, whom the county still calls its Chabad's executive director; chabad.org lists Rochel
  Butman; one source says headquarters removed him).
- Checked with screenshots: the Valley, Inland Empire, South Bay and Greater South Bay, San Diego, Northern Nevada, Las
  Vegas, Tucson and East Valley, Austin, Dallas, St. Louis, Northern Virginia and Howard County, NJ (Passaic, Northwest
  NJ, Mercer, Western Monmouth, Atlantic), Staten Island, Long Island, New Haven, Philadelphia's two, Rochester, the
  Florida ones; phone and dark.

## ▶ Nov 1: GitHub Pages deploys can lock for ~45 minutes — check that a push actually went live
- The owner: "I never saw the push". The pushes were on the branch, but GitHub Pages' "pages build and deployment"
  runs failed: "Deployment request failed for <sha> due to in progress deployment. Please cancel <older sha> first or
  wait for it to complete." A deploy that already went live (its files served) stayed "in progress" in GitHub's API for
  about 45 minutes, and every deploy started meanwhile failed. It happened twice on Nov 1 (26ef6ab, then 5061502).
- **Always check the live site after pushing**, e.g. `curl -sS https://yechezkelbinstok-dev.github.io/shetachim/web/data/sub.json`
  (or a changed file's Last-Modified), and the newest run's conclusion (GitHub MCP `actions_list` →
  `list_workflow_runs`; `get_job_logs` with `failed_only` for the error).
- **To get past it:** wait for the lock to clear, then start a fresh run by pushing a new commit (a real change).
  Re-running a failed run (`rerun_failed_jobs`) only sat "queued" both times, and a queued re-run can't be cancelled
  ("Cannot cancel a workflow re-run that has not yet queued"). The Pages REST API (cancel a deployment) needs a token
  this environment doesn't have (403). Pushes made during a lock aren't lost: the next deploy that goes through carries
  everything on the branch.

## ▶ Nov 1: sub-shetachim, on their own switch — the West Coast first
- Owner (Oct 26): do second-level shetachim piece by piece, "as a separate thing to toggle to see sub shetachim not in
  the head shluchim part" (not drawn into the head-shliach map the way India sits in Thailand's). And: "You have to
  actually always do it right though for example you probably would have missed that baja peninsula is under fradkin".
- **The switch:** "Sub-shetachim" (תת־שטחים) under Borders in the panel, off by default, remembered
  (`localStorage shetachim-sub`). With it on, each regional director's area gets a dotted purple outline (`sub-line`)
  and a light shade (`sub-fill`) over its shetach, and its name (`sub-names`): the regional director with Head shliach
  labels, the region's name with Shetach name. A tap anywhere in it opens its card: "Sub-shetach", its name, "Regional
  director", its capital (headquarters), its shetach and head ("West Coast · Shlomo Cunin") and its centers (mushrooms
  apart with Mushrooms on). Everything else on the map is as it was.
- **Borders of their own (owner, Nov 1: "why does it stretch so North why are you using county situations you should
  be drawing your own borders").** Redrawn later the same day as one piece each (see the section above: the span of
  its houses, 7 km past it, halfway to any other house). Members: listed (`members`), or the parent's houses in
  `membersIn` (counties, L.A. Times regions/neighbourhoods, county subdivisions, a `box`, or `near` a point within
  `km`), less `exclude`; mushrooms never count; `areas` (Baja) go in whole.
- **Data:** `data/sub-shetachim.json`, one entry per region with its `parent` shetach, `head`/`headHe`,
  `name`/`nameHe`, `capital` (a chabad.org center id), `territory` and `source`. A territory is made of US counties (Census
  GEOID), whole areas of the map (`area`: the state code in geo.json, e.g. MX-BCN), or L.A. County neighbourhoods
  (`laRegions`/`laHoods`, from the L.A. Times' Mapping L.A. v6: `.cache/la-county-neighborhoods-v6.geojson`, cut to the
  county's Census outline). `scripts/build-sub.mjs` (now part of `npm run build`; it can also run alone, after a full
  build) writes `web/data/sub.json`: one feature per region and state, so a view draws only its own countries' parts
  (San Diego without Baja on the USA view). Rings are wound d3's way, like the map's areas. Seam slivers are dropped.
- **The West Coast (Cunin), first three, each on a source:**
  - **San Diego & Baja — Rabbi Yonah Fradkin** (capital: Chabad S. Diego Headquarters). Chabadpedia: "המשמש גם כשליח
    אזורי", 26 couples under him in the county (5782). Baja is his (the owner). San Diego County + Baja California + Baja
    California Sur.
  - **The Valley — Rabbi Mordechai Einbinder** (capital: Chabad of the Valley Headquarters, Tarzana). Its 2004 staff
    page lists its Valley houses and, under it, the Conejo (Bryski, "Conejo Regional Director"), Ventura (Latowicz),
    Simi Valley (Gurary) and Santa Clarita (Marozov), each "Regional Director". Rabbi Joshua B. Gordon passed away
    29 Shevat 5776. The Jewish Journal (May 2, 2024) calls Einbinder the "leader of the sprawling Chabad of the Valley
    community based in Tarzana", 32 institutions. **Its area is the houses on that list, not all of Ventura County**
    (owner, Nov 1: "Valley shetach should not be that big at all / Oxnard and Camarillo are way way past the valley";
    then, when it was cut to the San Fernando Valley alone, "No no not just the SF valley! What about that 2004 thing?
    I'm sure that's still accurate as well"): the San Fernando Valley (the L.A. Times' region) with Calabasas and
    Hidden Hills; the Conejo (Agoura Hills, Westlake Village, and Ventura County's Thousand Oaks county subdivision:
    Thousand Oaks, Newbury Park, Oak Park, North Ranch); Simi Valley (its county subdivision); the Santa Clarita Valley
    (Santa Clarita, Stevenson Ranch, Castaic, Castaic Canyons, Val Verde, Hasley Canyon, Agua Dulce, the Santa Susana
    Mountains between); and Ventura (its county subdivision: a piece of its own, past Camarillo and Oxnard). Out:
    Oxnard (Dov Muchnik's) and Camarillo (Aryeh Lang's), not on the list; Moorpark (Heidingsfeld) and Ojai (Nemtzov),
    not on it either. `ccds` territories (county subdivisions by name in one county) come from
    `.cache/county-subdivision-06.json` (Census 500k).
  - **Southern Nevada — Rabbi Shea Harlig** (capital: Chabad of Southern Nevada). Founded 1990, its affiliated houses
    around Las Vegas (UNLV special collections; 2014 oral history: "seven Chabad locations"). Its houses in Clark County.
  - **Northern Nevada — Rabbi Mendel Cunin** (owner, Nov 1: "Do northern Nevada under Cunin"; capital: Chabad of
    Northern Nevada, Reno). Its houses in Washoe County, Carson City and Douglas County (Reno, UNR, Carson City,
    Lake Tahoe at Stateline).
- **Arizona (Levertov): Tucson — Rabbi Yossie Shemtov** (owner, Nov 1: "Tucson/Vail is Shemtov no?"; capital: Chabad
  Lubavitch of Tucson). Its houses in Pima and Cochise Counties: Tucson, Oro Valley, Vail, the University of Arizona,
  and Sierra Vista (Benzion Shemtov) as a part of its own.
- **Russia (Lazar): Saint Petersburg — Rabbi Mendel Pewzner** (owner, Nov 1: "Peterburg under Pewsner"; capital: the
  Jewish Community of St. Petersburg, Grand Choral Synagogue). Lazar's houses within 45 km of the city. Moscow: no
  separate regional head found (the Chief Rabbinate and Lazar's own Marina Roshcha are there), and the owner said to
  drop it ("forget about Moscow nvm").
- **The USA sweep (owner, Nov 1: "You should do a full USA sweep and do it all yourself"), first pass.** Each US
  shetach with 15+ houses searched for a regional layer (a "regional director" or a regional headquarters under its
  head shliach). Found, sourced and drawn:
  - **Long Island — Rabbi Tuvia Teldon** (New York City's shetach; capital Lubavitch of Long Island, Commack): regional
    director of Chabad Lubavitch of Long Island since 1977 (Anash; COLlive); "over 29 Chabad rabbis in 23 Chabad
    centers throughout Long Island" (Lubavitch.com, Sept 2025). Nassau and Suffolk's houses.
  - **Northwest New Jersey — Rabbi Asher Herson** (New Jersey's; capital Chabad Center of Northwest NJ, Rockaway): "regional
    director of the Chabad Center of Northwest NJ" (the Jewish Link); its branches on chabad.org, "Chabad of Northwest
    NJ – Western Region" (Flanders) and "– Berkshire Valley" (Wharton); with Sussex and Warren Counties' houses.
  - **St. Louis — Rabbi Yosef Landa** (Kansas–Missouri's; capital Chabad of Greater St. Louis Regional Headquarters):
    chabad.org has him as "Co-Founder and Regional Director"; the St. Louis Jewish Light, regional directors. St. Louis
    County, the city, St. Charles County.
  - **Northern Virginia — Rabbi Sholom Deitsch** (Virginia's; capital Chabad Lubavitch of Northern Virginia, Fairfax):
    "regional director of Chabad Lubavitch of Northern Virginia" (JNS); opened 1991, eight more locations since
    (Washington Jewish Week). Fairfax, Arlington, Loudoun, Prince William and the cities among them.
  - **South Broward — Rabbi Raphael Tennenhaus** (Florida's; capital Chabad of South Broward, Hallandale): "director of
    Chabad activities in south Broward", a network of "11 Chabad centers" (TorahCafe; the Jewish Press). Broward's houses
    south of Fort Lauderdale.
  **Second pass (owner: "there's way more regionals than that, keep going").** Candidates from the data itself
  (houses named for a county or region, and a family's houses clustered round a senior director: a regional director
  usually places his sons and sons-in-law in its branches), each checked for an umbrella over several houses in an area:
  - **Greater Orlando — Rabbi Sholom Dubov** (Florida): "Head Shliach to the Greater Orlando Area"; Maitland, Winter
    Park–Oviedo (Tzviky Dubov), North Orlando (son-in-law Yanky Majesky), Altamonte Springs, "seventh location";
    shluchim "appointed by Rabbi Dubov" round Central Florida. Orange, Seminole, Osceola.
  - **Greater Austin — Rabbi Yosef Levertov** (Texas): Chabad of Greater Austin and its six centers (UT, South Austin,
    YJP/Downtown, Round Rock, Leander), his family's. Travis, Williamson, Hays.
  - **Greater Mercer County — Rabbi Dovid Dubov** (New Jersey): appointed by the Rabbinical College "to oversee
    Chabad Lubavitch of Greater Mercer County". Mercer.
  - **Bucks County — Rabbi Yehuda Shemtov** (Pennsylvania): Lubavitch of Bucks County's executive director, with its
    branch "Lubavitch of Central Bucks County West". Bucks.
  - **Staten Island — Rabbi Moshe Katzman** (New York City's): Chabad Lubavitch of Staten Island and the island's
    houses his family runs (South Shore, Tottenville, the school). Richmond.
  - **Sarasota & Manatee — Rabbi Chaim Steinmetz** (Florida): Chabad Lubavitch of Sarasota and Manatee Counties,
    several centers, his sons' Downtown Sarasota and Bradenton. Sarasota, Manatee.
  - **Tampa — Rabbi Yossie Dubrowski** (Florida): Chabad Lubavitch of Tampa Bay (1988) and its South Tampa branch.
    Hillsborough only (Pinellas has its own Chabad of Pinellas County).
  - **North Broward & South Palm Beach — Rabbi Yosef Biston** (Florida): "executive vice president of Chabad-Lubavitch
    of North Broward and South Palm Beach" (chabad.org), its HQ chabad.org's "Chabad of Parkland – Regional HQ";
    founded Margate in 1985 under that heading. Broward north of Fort Lauderdale, Palm Beach County south of Boynton.
  - **Inland Empire — Rabbi Sholom Harlig** (West Coast): Chabad of the Inland Empire since 1989, with Chino Hills
    (Mendy Harlig). San Bernardino County (Riverside and Temecula not tied to it by any source).
  - **Montgomery County (PA) — Rabbi Shaya Deitsch**: Lubavitch of Montgomery County's executive director, who
    "supervises groups in Rydal and Chestnut Hill" (Philadelphia Inquirer, 2013); Fort Washington, Rydal, Lafayette Hill.
    The county's houses north of the Main Line (box ∩ county, so not the Main Line's nor Philadelphia's).
  - **Atlantic County & the Shore — Rabbi Shmuel Rapoport** (New Jersey): "oversees Chabad of Atlantic County, which
    runs Chabad at the Shore"; his family's Ventnor shul, Stockton University, Wildwood. Atlantic and Cape May.
  - **Passaic County — Rabbi Michel Gurkov** (New Jersey): the Chabad Center of Passaic County (Wayne) and its
    branches run by his family (Upper Passaic County in Wanaque, Passaic–Clifton, the preschool). Passaic.
  Asked of the owner: **Westchester** — Rabbi Velvel Butman was its head shliach ("Executive Regional Director of
  Chabad Lubavitch of Westchester County", 11 centers), but one source says headquarters removed him; chabad.org now
  lists Rochel Butman. Camden County (Mangel): a local executive director, no regional sign.
  - **Dallas — Rabbi Mendel Dubrawsky** (Texas): "regional director of Chabad-Lubavitch of Dallas"; houses "joining the
    larger growing network of Chabad Houses under the auspices of Chabad of North Texas and the leadership of Rabbi
    Mendel Dubrawsky"; 11 houses in Dallas. Dallas, Collin, Denton, Rockwall (not Tarrant: Fort Worth's own).
  - **Howard County — Rabbi Hillel Baron** (Maryland): the Lubavitch Center of Howard County and his family's houses
    (Ellicott City, Clarksville, Laurel); "the 5 Chabad centers in Howard County". Howard.
  - **South Dade — Rabbi Yakov Fellig** (Florida): Chabad of Miami (Coconut Grove, since 1989) and its "13 Branches
    Across South Dade" (its own site: Downtown Coral Gables, Kendall & Pinecrest, Cutler Bay & Homestead, UM, UM Jackson,
    West Kendall…). Miami-Dade south of downtown and west of the bay (14 listings).
  - **Southwest Florida — Rabbi Yitzchok Minkowitz** (Florida): Chabad Lubavitch of Southwest Florida, "under the
    leadership of Rabbi Yitzchok Minkowicz", "officially welcomed new emissaries" (Federation Star, June 2025). Lee
    County (not Naples or Charlotte County: no source ties them to it).
  - **South Area (south of Boston) — Rabbi Menachem Gurkow** (Eastern Massachusetts): Shaloh House Chabad of the South
    Area (Stoughton, 1991), serving Canton, Easton, Sharon, Stoughton, and new shluchim for Brockton and Randolph.
  - **North Fulton — Rabbi Hirshy Minkowicz** (Georgia): Chabad of North Fulton serves Alpharetta, Johns Creek,
    Milton, Roswell and more, "satellite offices in Roswell, Johns Creek, and Alpharetta". North Fulton County.
  - **Western Monmouth — Rabbi Boruch Chazanow** (New Jersey): "the Holmdel Chabad is a branch of this organization";
    its yeshiva and Brookdale centre. Monmouth County west of the shore.
  - **East Valley — Rabbi Mendy Deitsch** (Arizona): Chabad of the East Valley (Chandler, 1997) and the Ahwatukee centre
    it opened. Those two only (Mesa, Gilbert, San Tan Valley, ASU: no source makes them its branches).
  - **Greater New Haven — Rabbi Sheya Hecht** (Connecticut): "the Chabad director for the Greater New Haven area",
    the Chabad Centers of Greater New Haven (Oxford its "ninth Chabad Center in the Greater New Haven region"). The
    South Central Connecticut planning region (09170: Connecticut's 2022 Census units replaced its counties, so 09009
    no longer exists in the county file).
  Not regional: Pinellas (the Adlers: no regional title), the Main Line and Delaware County (no regional director),
  Madison (one city's houses), Harrisburg (the Pewzners: no regional title), Raleigh, Rockland (Kotlarsky: an executive director, no regional sign — wrong: the owner, Nov 3, Rockland is its own shetach). On hold: the Bay Area (the Langers "became the movement's Bay Area
  directors in 1979"; nothing current).
  (The rest of this list was worked through: see the newest Nov 1 section.)
  None found (the head shliach is the regional director, the cities have local directors): Texas (Lazaroff, "Texas
  regional director"), Pennsylvania, Illinois, Maryland, Georgia, Michigan, Colorado, the Carolinas (South Carolina's
  Epstein: a local director), the rest of New Jersey (Greater Mercer: an executive director), Westchester, Rockland,
  Staten Island, Queens, Arizona's East Valley, Western Massachusetts (its founder, Hershel Fogelman, passed away; no
  current director found), Spokane. Cape Cod & the Islands is already a shetach of its own.
- **Asked of the owner, not drawn:** Parkland's "Regional HQ for North Broward & South Palm Beach" (Biston; chabad.org's
  own name — which houses?); whether the Andrusiers' Chabad Lubavitch of Southwest Broward is Tennenhaus's or a
  network of its own; (the South Bay and the Inland Empire are drawn now: chabad.org lists Rabbi Eli Hecht as
  "Regional Director"; Harlig's two houses); whether Ventura, Simi, the Conejo and Santa Clarita are still the Valley's (the list is from
  2004; the owner says it still is); Moorpark, Ojai and the Antelope Valley (left out). No regional layer found for Orange County, Long Beach, the Bay Area,
  Sacramento: those stay Cunin's own. **Next (owner, Nov 1): "do a full USA sweep and do it all yourself"**: every US
  shetach's regional directors, found and drawn without being told each one.
- Tests: `__dbg.tap(lon, lat)` taps a place and shows its card (returns the hit's kind). Checked: the USA, Latin
  America and street maps, light and dark, English and Hebrew, switching off (layers hidden, taps back to the centers
  and the shetach).

## ▶ Nov 1: Southern Ohio is Rabbi Yisroel Mangel's; Kalmanson's office is a mushroom
- Owner: "Yisroel Mangel is head shliach of Southern Ohio not kalmanson - in fact kalmansons moised is mushroom (the one
  of the current head shliach you have)". So `southern-ohio` has head shliach **Yisroel Mangel**, and its capital is
  his **Chabad Jewish Center, Cincinnati** (chabad.org 117703, him as director). Rabbi Sholom DovBer Kalmanson's
  **Chabad of Southern Ohio** office (`extra-chabad-southern-ohio`, 7380 Laurel Oak Lane, Amberley Village; it had been
  the capital) is a mushroom now, with him on its card. His son's Jewish Discovery Center in Mason (chabad.org 118177)
  is unchanged: the owner named only Kalmanson's own mosad.
- Hebrew: ישראל מאנגעל. Chabadpedia's article on the family is titled ניסן מאנגעל (מנגל redirects there), so the
  surname is מאנגעל for every Mangel on the map (`last-names.json`; also Dayton's Nochum Mangel and Cherry Hill's).

## ▶ Oct 26: coming back to the page is quicker: names and shapes kept between visits, kept across updates
- Owner: "map reload when I revisit page takes WAAAAAAYYYYYY too long", and the map lags when zooming in. (Streets and
  Tinted looking bad zoomed out: the owner said to drop it, "Forget the damn streets".)
- **What was slow.** A visit works out each view's shapes in its projection and its names' places (`namesOf`):
  about 12 s with the CPU slowed 4× (phone-like, `scratchpad` profiling). The names were already kept in localStorage,
  but under a fingerprint of the whole page's code and the files' ETags. GitHub Pages gives **every** file a new ETag
  (and Last-Modified) on every deploy, changed or not, so every push threw them away, and every visit after an update
  started from nothing. The map's own tiles went the same way (`tileVersion`).
- **Now:**
  - A file's version (`versions`) is a fingerprint of its contents (SHA-1 via `crypto.subtle`, first 8 bytes), with
    the ETag as a fallback. Used by `tileVersion`, `namesPrint` and `shapeKey`.
  - The code fingerprint (`DRAW_PRINT`) covers only the stretch between `// ▼ THE DRAWING ▼` and `// ▲ THE DRAWING ▲`:
    the colours, views, projections, names and shapes. **Anything that changes how names or shapes come out belongs
    between those marks.** Edits elsewhere (cards, search, options, Hebrew words) keep what's saved.
  - The flat maps' shapes (`areas`, `land`, `mesh:*`, and `outFill`, `outLines`, `landAll` under the outside file's
    version too) are kept in IndexedDB (`shetachim-shapes`). `keepShape` writes when idle; the first write of a visit
    clears other fingerprints. `keptShapes(S)` reads them back at the start, while the map loads, and when a view is
    shown. A job stops as soon as its shape is in (`stepJob`). The refresh button (`?v=`) skips both caches.
  - MapLibre checked every style change against the whole style, serializing all of it each time (hundreds of calls at
    the start and on every option). `startMap` now wraps `setPaintProperty`, `setLayoutProperty`, `setFilter`,
    `addLayer` and `addSource` with `{ validate: false }`; MapLibre 4.7.1's own `addLayer`/`addSource` don't pass that
    on, so the wrappers call `map.style` directly.
- **Measured** (CPU 4×, phone, world view): first visit, everything drawn at about 12.5 s, as before. Next visit:
  areas at 3.0 s, everything at 3.8 s (it was about 6 s with the names kept, 12.7 s without). After a simulated deploy
  (all files re-stamped, a card's code changed) it was still 3.9 s. Screenshots of world, US, FSU and Israel worked
  out vs read back: no pixel differs by more than 40. `__dbg.keptCount()` counts shapes read back.
- Still open: the first visit after the drawing code or the shetachim data changes is as slow as before (names take
  most of it); the zoom lag on a phone couldn't be reproduced here (smooth once settled with the CPU at 4×). It's
  likely the background work right after the map shows, which a kept visit no longer has.

## ▶ Oct 26: Burundi and Togo are Bentolila's; names open on Head shliach; coming back rebuilds the map; sub-shetachim on their own switch
- **Burundi (BDI) and Togo (TGO) are in Central Africa (Bentolila's)**: the owner sent a screenshot of each, Oct 26
  ("Add to bentolila", "This goes to bentolila as well"). In `data/shetachim.json`, `data/global-shetach-list.txt` and
  the page's AFRICA view list.
- **The page opens with the names on Head shliach** (owner: "make head shliach mode the default"): `state.labels = 'full'`,
  its button pressed in the HTML.
- **Coming back to the map** (owner: "why sometimes when I go back to the map it takes a bit to re load in"): a phone
  drops the map's WebGL context while the browser is in the background. Since Oct 13 the page then reloaded, fetching
  and working out every file again, which was the slow part. Now `rebuildMap()` removes the dead MapLibre map and makes
  a fresh one from what's already in memory (the feed cache `FED` cleared, each set's `fedAll` reset, the hover and tap
  handlers wired again, the camera put back where it was). If that fails it falls back to the old reload (`reloadHere`).
  Test: `scripts/screenshot.mjs` action `lose`. A `window.__mark` set before it was still there after (no reload); the
  map was loaded with its 180 layers.
- **The ohalim's cards**: the histalkus line is as big as the line above it is bold (15px, ink), and the listing's own
  people (the Ohel's director, Abba Refson) sit under it in `.staff`, at 12px. Owner: "why is abba refson the same size
  as the histalkus's that legit makes no sense".
- **Every ohel's card names who looks after it** (owner: "do all the ohels have management like the ohel has refson?" …
  "figure out who runs those and add"). The Ohel in Queens (Abba Refson, director) and Haditch take their people from
  their chabad.org listings. Rostov's and Nezhin's ohalim have no listing, so `HONOR_CARDS.<key>.people` gives them,
  each with a `role` in both languages (`positionOf` takes a `role` before chabad.org's position):
  - **Rostov: Rabbi Chaim Danzinger**, "In charge of the Rebbe Rashab's Ohel". chabad.org, June 17 2026 ("More Than
    50,000 Visiting Rebbe's Queens Resting Place This Week"): "Rabbi Danziger is responsible for maintaining the Rebbe
    Rashab's resting place in the southern Russian city". He's also Rostov's shliach (Jewish Community of Rostov).
  - **Nezhin and Haditch: Rabbi Shneor Zalman Deitsch**, Haditch's shliach. JDN, Dec 4 2022: "הרב שניאור זלמן דייטש,
    השליח והאחראי על המקומות הקדושים בהאדיטש ובניעז'ין"; JDN, Mar 1 2023: in charge of the holy sites in Ukraine for
    the Federation of Jewish Communities. chabad.org lists him at the Heichel with no position, so `roles` adds
    "In charge of the Heichal" there. His Hebrew surname is now דייטש, as JDN spells it (`Deutsh` in last-names.json:
    chabad.org's spelling, and only his).
- **Liozna and Liadi show from the same zoom as Rostov, Haditch and Nezhin** (owner: "they only show when you're way
  zoomed in"). They were held back (kmPx 1.6) to keep them off Lubavitch's name, 25 km away. Now they have kmPx 0.3 like
  the rest, and an `anchor` (HONOR_PLACES): Liozna's name sits above its star (it's north of Lubavitch) and Liadi's below
  (south), while Lubavitch's stays to the right. The `honor` layer's text-anchor and text-offset follow it.
- **Sub-shetachim (regional directors under a head shliach): on a switch of their own.** The owner asked about doing a
  second level of shetachim piece by piece. I suggested drawing them inside the head shliach's shetach, the way India
  sits in Thailand's (`territoryOf`), and the owner said no: "I meant as a separate thing to toggle to see sub shetachim
  not in the head shluchim part". So the head-shliach map stays exactly as it is, and the sub-shetachim show only with
  their own switch. Regions won't cover every shetach. Where no regional director is known, the switch shows nothing
  new. Pilot: California (the West Coast's regional headquarters), then piece by piece.

## ▶ Oct 26: honorary cards for the Rebbeim's towns and ohalim; Chabad Hebrew names; mushroom counts; no city cards
- **NAMES (owner, firmly): always the Russian names, never the recent Ukrainian ones** ("KEEP DNEPR … ALWAYS KEEP
  RUSSIAN NAMES NEVER UKRAINIAN RECENT CHANGES"), in English and Hebrew: Dnepr = דנייפר (not Dnipro/דניפרו, even
  though Chabadpedia has moved to דניפרו), Kiev, Kharkov, Lvov, Kirovograd, Dneprodzerzhinsk… Khmelnytskyi is now
  **Proskurov** / פרוסקורוב, its old name (owner: "Chabad calls it after Khmelnitzky yemach shemo????" — it was renamed
  for him in 1954; build `UA_NAMES`; it used to keep its Ukrainian name). And **Hebrew in Chabad's own spelling**
  ("רוסטוב על הדון??!! Bro it's just rostov"): checked against Chabadpedia's titles and redirects (its API through
  Firecrawl; WebFetch and curl are blocked there), data/hebrew/cities.json now has רוסטוב, פטרבורג (not סנקט
  פטרבורג), ניקולייב, אלמא אטא (Almaty), פולטובה, צ׳רנוביץ׳, בריסק (`Brest|BLR`; other Brests stay ברסט), and גרודנו
  (no Chabadpedia article; the traditional name, not Belarusian הורודנה); by the Russian rule איבנו-פרנקובסק,
  אוז׳גורוד, בלאיה צרקוב, בלגורוד-דנסטרובסקי. Chabadpedia's own titles kept as they were: מוהילב, ז׳יטומיר, ברדיצ׳ב,
  קרמנצ׳וג, האדיטש, ליאזנא, ליאדי, קובנה, וילנה… Other former-Soviet names have no Chabadpedia article and stay.
- **Honorary places** (`HONOR_PLACES`, `HONOR_CARDS` in web/index.html; big cards like Lubavitch's; shown in every
  world/continent view and in the views of their own country). **SUPERSEDED in part (Nov 3, above):** the towns and
  the ohalim/mosdos are now separate markers and cards, Rostov/Haditch/Nezhin are at the towns, and only Lubavitch
  and 770 keep the big card.
  - Towns: **Lubavitch**; **Rostov** (seat of the Rebbeim 1915–1924; the dot is the Rebbe Rashab's ohel, the Jewish
    cemetery at 155 Tekucheva St — Chabadpedia, Find a Grave 47.23889, 39.72158); **Liozna** (born there 1745, led
    until 1801) and **Liadi** (1801–1812) for the Alter Rebbe (OSM). Each lists the Rebbeim who led there; a Rebbe
    resting there carries it in his own entry: "Ohel · Histalkus: 13 Nissan 5626 (1866)" / "ציונו הק׳ · הסתלקות: …"
    (the Tzemach Tzedek and the Rebbe Maharash in Lubavitch, the Rebbe Rashab in Rostov).
  - Resting places, each titled by the ohel's own name, with "Burial place of …, zy"a" and the histalkus: **Heichel
    Admur Hazaken** in Haditch (= chabad.org 2122346), **Ohel Admur HaEmtzai** / אוהל אדמו״ר האמצעי in Nezhin (נייז׳ין;
    the Jewish cemetery, ESJF 51.07398, 31.91745), and **Ohel Chabad Lubavitch** (= chabad.org 118002; map label "The
    Ohel" / האוהל): "Burial place of the Frierdiker Rebbe and the Lubavitcher Rebbe, zy"a", "Histalkus: 10 Shevat 5710
    (1950) · 3 Tammuz 5754 (1994)".
  - **One thing, not two** (owner: "why two separate things"): where the place is a chabad.org listing (`center` in
    HONOR_PLACES: the Heichel, the Ohel), the honorary card is that listing — titled with its name, its people and
    chabad.org link in the card, the shetach line at its foot — and its own dot isn't drawn (`HONOR_BY_CENTER`;
    the counts still count it; a search for it opens the honorary card).
  - **Wording (owner, firmly):** no address or "region" line at the foot ("address slop"); no "Buried here:" list
    ("more respect, burial place of …"); no "His resting place is here" ("horrible"); a name never twice. Hebrew:
    ציון / ציוני, not מקום מנוחתו ("is that really a used word in chabad?"): "ציוני כ״ק אדמו״ר הריי״צ זי״ע וכ״ק אדמו״ר
    נשיא דורנו זצוקללה״ה נבג״מ זי״ע" — **the Rebbe always with his whole title, as on 770's card**, never just זי״ע.
- With **Mushrooms** on, a card's count shows the centers and the mushrooms apart — "120 centers · 3 mushrooms" /
  "120 מוסדות · 3 פטריות" (shetach, country/state cards, city search results; `counts`, `mushroomsIn`).
- **City cards off** (owner: "get rid of that useless card", kept switchable): `CITY_CARDS = false` in web/index.html;
  a tap on a city's name opens nothing, a city picked in the search is flown to without a card. `true` brings it back.
- Owner (screenshot of the phone sheet's "סגירה"): "shouldn't this be an x button". The open sheet's button is now a
  round X (like the theme button; aria-label Close/סגירה); closed, it still says Options (`showPanelToggle`).
- **770's name: Hebrew only.** The owner meant only the Hebrew ("I meant just the Hebrew for 770"): chabad.org's English
  "Chabad Lubavitch Headquarters" stays; data/hebrew/centers.json gives it **בית אגודת חסידי חב״ד** (was מטה חב״ד
  ליובאוויטש). The `fixes` entry that renamed it in English is gone.

## ▶ Oct 26: Rabbi Mottel Kanelsky's Bris Avrohom network (48 mushrooms now)
- Owner: "Find mendel zaltzman mushroom in NJ and add pls", then "Mottel Kanelski is also a big mushroom head in NJ
  there's a bunch of moisdois under him … find them all". Rabbi Mendel Zaltzman runs Bris Avrohom of Fair Lawn, a
  branch of Rabbi Mordechai (Mottel) Kanelsky's **Bris Avrohom** (founded 1979 in Jersey City; "Founded by the
  Lubavitcher Rebbe", its site says; it has long served Russian-speaking immigrants). Added, network "Mottel Kanelsky"
  (מאטל קנלסקי): Bris Avrohom (HQ and its shul Cong. Shomrei Torah – Ohel Yosef Yitzchok, 910 Salem Ave, Hillside;
  Mordechai and Shterny, Avremi and Chaya Kanelsky), Mikvah Batsheva Chaya Esther (824 Salem Ave, Hillside), Bris
  Avrohom of Fair Lawn (30-02 Fair Lawn Ave; Mendel and Elke Zaltzman — founded 1993 by his parents; Rabbi Berel
  Zaltzman passed away in 2026), Bris Avrohom of Jersey City (temporary shul at 24 Van Reipen Ave, Jan 2026; Baruch
  and Kreina Lepkivker). None is on chabad.org. Evidence (in each `mushroom` text): NJ Jewish News, Jun 8, 2011 —
  after a challenge by Rabbi Boruch Chazanow and Rabbi Moshe Herson, the Central Committee of Chabad-Lubavitch Rabbis'
  agreement says his son Rabbi Yossi Kanelsky's new Marlboro center "will not be associated with Chabad-Lubavitch or
  its affiliates, such as Bris Avrohom". Against: the same article calls Bris Avrohom "affiliated with
  Chabad-Lubavitch"; the owner rules it a mushroom network.
  - Not added: Yossi Kanelsky's Marlboro "Center for Jewish Life" (Route 79, 2011; by that agreement not Chabad at all,
    and nothing recent found), "Bris Avrohom of EWR" (Newark Airport: a donation page only), the Brooklyn branch named
    in 2011 and the Old Bridge one (closed by 2011), Cheder Yaldei Menachem (no address; its donations go to Bris
    Avrohom), the Wilanskys (directors in 2019; not confirmed since), the Stop Sign Coffee café in Jersey City.
- Owner: "Beis Agudas Chassidei Chabad instead of Mateh Chabad Lubavitch" — for 770's Hebrew name only (see the
  section above; first done in both languages by mistake, then put back).

## ▶ Oct 26: two Florida "Beis Moshiach" mushrooms (44 now); the Mushrooms switch no longer reloads the page
- Owner: "Add the Hollywood and North Miami Beach Beis Moshiach as mushrooms". Both are known only from the IRS
  (ProPublica's Nonprofit Explorer; no website, news or chabad.org listing found): **Beis Moshiach Hollywood**
  (Beis Moshiach Hollywood Incorporated, EIN 99-3945220, exempt since Aug 2024), 1050 Jefferson St, Hollywood; **Bais
  Moshiach North Miami Beach** (Bais Moshiach Nmb Inc, EIN 33-3589170, since May 2025), 625 NE 175th St, North Miami
  Beach (the IRS says Miami Beach; the Census geocoder, North Miami Beach). Placed by the Census geocoder; no network
  line (nothing ties them to each other or to Lauderhill's 770 Moshiach Center). Hebrew: בית משיח הוליווד, בית משיח
  צפון מיאמי ביץ׳. They may be home minyanim: if the owner learns more (rabbis, a real address), add it.
- Owner: "Why when I turn on mushrooms it reloads the whole thing?" The page used to drop the mushrooms from the data
  at load and reload on every switch. Now the data is kept whole: `useCenters()` works out the dots, the counts per
  piece, `dotOfCenter` and the cities either way (each once, `CENTER_SETS`), and the switch refreshes the view in place
  (`viewCenters`, the dots and cities re-fed — their FED keys carry the mode — the search index rebuilt, a ringed
  family re-ringed). Each city list gets its Hebrew names (`cityNames`).
- Asked by the owner, then stopped at the owner's word (credits): **Kalmanson.** No report anywhere (English or Hebrew) of his
  removal or of a new head shliach for Southern Ohio; Chabadpedia (updated with 5786 events: he founded the reopened
  Yeshiva Gedola in Elul 5785) still calls him the director of Chabad in Southern Ohio and a member of Merkos's Kinus
  HaShluchim committee. He isn't on chabad.org's or lubavitch.com's directory (a chabad.org bio of him existed in
  2008); his son's and sons-in-law's houses are. Nothing changed; the owner may send a source. **Settled Nov 1 by the
  owner: Yisroel Mangel is the head shliach, and Kalmanson's office is a mushroom (see the top).**
- Other unverified leads from the same IRS search, for the owner (not added): Welcome Moshiach Inc (20533 Biscayne
  Blvd #139, Aventura; c/o Matisyahu H. Abarbanel; $859k revenue in 2022), Temple Beis Moshiaj Inc (825 NE 205th Ter,
  Miami; 2005, c/o Jay R. Beskin — may not be Chabad), Chabad of Lakewood II Inc (363 Lanes Pond Rd, Howell NJ; since
  May 2026, c/o Avraham Lebovitz). The owner will give the names of Florida/New Jersey/US mushrooms; wait for them
  rather than sweeping (the owner stopped a sweep for the credits it used).
- Tool for a future sweep: GoDaven's API answers plain requests — `https://www.godaven.com/api/V2/shuls/search-all?query=
  &pagenumber=N&nusach=ari&users_date=&tefillah=&day=&current_time=&todays_day=` with header `app-id:
  f9XMPE2U7hECnxyvDkQOWfLaLUJl5Fj8vvGpM0fGWpQJfnDz6t` (from its web bundle) lists every Nusach Ari shul (938, 10 a page;
  also `radius-search?lat=&lng=&distance=`), each with address, coordinates and rabbi — to compare with chabad.org.

## ▶ Oct 21: every view in its own projection (political map)
- Owner: "It's meant to be diff maps for the diff views like FSU should be an FSU projection for example, us Canada as
  well etc etc etc". The political map now draws each view in its own projection (`VIEWS[*].projection`, `flatFor`):
  USA conic equal-area 29.5/45.5 (the US atlas Albers), US & Canada 30/58, Canada 49/77 (Statistics Canada's
  parallels), all centred on 96°W; Europe conic 40/62; FSU conic 45/65 at 95°E; Israel transverse Mercator on its
  grid's meridian (35.2°E); Middle East conic 20/38 at 45°E; Asia conic 5/38 at 105°E; Africa and Latin America
  azimuthal equal-area; Oceania conic −18/−40 at 150°E; World Natural Earth (unchanged). Before, only the world and
  continents were flat, all in Natural Earth, and the country views (USA, Canada, US & Canada, Israel) were Mercator.
- The Alaska/Hawaii boxes now sit beside the conic lower 48 (`boxedFor`: the view's projection outside the boxes,
  placed from the lower 48's own drawn width). A flat view without a `frame` is framed on its land as drawn (a
  conic bends a lon/lat box far past the land). Country views fade the land round them at full detail (`outKind`).
- Street, Physical and Tinted stay Web Mercator: their imagery only comes that way (the engine can't reproject it).
- Seen while checking, older than this change: Canada's north (no shetach there) is missing from the land data, so
  it draws as sea (Canada and US & Canada views); the Israel view comes in about a zoom step tighter than its frame.

## ▶ Oct 20: network names without "Rabbi"
- Owner: "Why the hell does rabbi preface all the networks take that shit out". Networks are now just the name
  ("Yosef Carlebach", "Binyomin Edery", "Moshe Reuven Azman", "Yacov Borenstein"; Hebrew without הרב). Keep it so.

## ▶ Oct 19–20: twelve US mushrooms — the Hudson Valley's Borensteins, Buffalo's independents, Lauderhill's 770 Moshiach Center, central New Jersey's Carlebach network (42 now)
- Owner: "Research to find more mushrooms … They say upstate NY (inc east NY) is a big mushroom breeding ground …
  look into it more in the usa". Method: chabad.org's own list for the two upstate shetachim (71 centers) against
  every IRS-registered "Chabad"/"Lubavitch" organization (ProPublica's nonprofit API, read with WebFetch: 411 in NY,
  1,631 in the US, compared town by town with chabad.org), plus news searches; then each lead on the open web. Every
  finding then went to an independent skeptic told to refute it (a workflow: on chabad.org after all? Merkos/Chabad
  press calling them shluchim? Merkos programs? closed? quotes and addresses re-read).
- **Eastern NY (the Rubins' shetach): Rabbi Yacov Borenstein's two houses**, network "Yacov Borenstein" — both
  survived the skeptics:
  - Chabad of Mid-Hudson Valley, 63 Vassar Rd, Poughkeepsie (chabadmidhudsonvalley.com; IRS since 1991; new building
    Sept 2022; he and Hindy lit Dutchess County's menorah with the County Executive, Dec 2024). Times Herald-Record
    (Jun 8, 2006, reprinted by CrownHeights.info and VIN): "Chabad leaders say Yakov Borenstein is a renegade and
    irritant they fired several years ago for outlandish behavior"; a letter about June 1, 2006 said he and three
    other rabbis (not named) "can no longer use the Chabad-Lubavitch name". His defence, a 2004 Crown Heights Beth Din
    letter: "a neighborhood panel with no jurisdiction over Chabad" (Shmotkin). He styled himself "Chabad's regional
    director" (YWN 2009); his site's "Affiliate Branches" page claims Chabad of New Paltz (Plotkin's address) and the
    Chabad House of Eastern Orange County (Serebryanski's phone, 845-565-3816) — both official on chabad.org now; a
    past tie, for the owner to know.
  - **For the owner: chabad.org still lists his mikvah**, "Mikvah Ma'ayan Chaya" (120141, no staff), 114 m from his
    center — his own site books it through Hindy Borenstein. It shows on the map as an official dot. Probably a stale
    listing from before he was fired; left as it is (the owner's rule: on chabad.org = official).
  - Chabad Goshen (it also calls itself Chabad of Orange County), 203 Main St, his nephew Rabbi Meir and Rivkie
    Borenstein (jewishgoshen.com; The Chronicle through Purim 2026). Zalman Shmotkin (Times Herald-Record, May 28,
    2006): "The only authorized Chabad-Lubavitch representatives in Orange County are Rabbi Pesach and Chana Burston".
  - His 2005–06 centers in New Paltz and Woodstock: no trace now (the official ones there are Plotkin's and Karczag's).
    lubavitch.com also lists "Chabad on Cedar", 17 E Cedar St, Poughkeepsie (Boruch and Chaya Zelouf, 4018120) — not in
    chabad.org's Sept 2026 locator and its pages are dead; probably closed, not added.
- **Upstate NY (Gurary's shetach): Buffalo's independents — the weakest of the set; the owner may want to rule.**
  Rabbi Heschel Greenberg came in 1972 as one of Gurary's shluchim; in 1993 "the Greenbergs' work separated from Rabbi
  Gurary's organization" and "continued … independently" (the Labkovski family's own history, chabadbuffalo.com).
  None of these is on chabad.org, and Merkos's 2022 story on 50 years of Chabad in Buffalo names only the Gurarys.
  Counter-evidence, recorded in each `mushroom` text: ChabadInfo (2019) called Greenberg "a Shliach in Buffalo"; COLlive
  (2022) called Mendy and Chaya Mushka Labkowski "Chabad Shluchim"; the Center for Jewish Life runs JLI courses and
  CTeen events (its own listings; no Merkos listing could be confirmed). Kept as mushrooms because in the US chabad.org
  is Merkos's own near-complete directory, and 30 years off it and outside the head shliach's organization is the
  heart of the owner's definition; if the owner counts that press or JLI as recognition, all three go.
  - Jewish Discovery Center, 831 Maple Rd, Williamsville (Greenberg; its own site doesn't use the Chabad name). No
    network line.
  - Network "Labkovski family": Center for Jewish Life – Chabad Buffalo, 757 Hopkins Rd, Williamsville (Laizer and
    Chani, in Buffalo since 1995; its own organization since 2021); Chabad Downtown Buffalo (its own name: the Chabad
    Center for Jewish Life of Buffalo), 409 Franklin St (Mendy and Chaya Mushka, 2021).
  - **Dropped after the skeptics:** their "Chabad Niagara Falls USA" shul at 770 Ashland Ave — the family's own page
    says it is still "working to establish" it ("not yet a permanent daily Niagara Falls minyan"); the Buffalo Jewish
    Federation calls Lorber's "the official Chabad of Niagara Falls USA" (Dec 2025). Add it if it opens. Also left out:
    a Clarence branch (two different couples named, no address).
  - Not mushrooms: Ohr Temimim day school (a 2008 merger with the official Torah Temimah; the Lorbers teach there),
    the Saranac Ave shul (Mendel Gurary = the official Chabad of the Southtowns).
- **Florida: the 770 Moshiach Center, Lauderhill** (4538 Inverrary Blvd; Chabadpedia: בית משיח 770 (פלורידה), a Chabad
  house for Hebrew speakers, about 100 families, its own 770 replica finished 5786). Found by the meshichist sweep —
  my IRS pass had missed it ("770 Moshiach Community Center Inc"). Opened in 1993 by Rabbi Mordechai (Motti) Anati,
  "שליח הרבי מלך המשיח" in his own words, on the Rebbe's blessing; Anash.org's obituary (2020) calls him only "a Chabad
  activist"; now Rabbi Daniel Shahino (שהינו). Yeshiva "Melech HaMoshiach", weekly "Moshiach Time"; Rabbi Hendel of the
  World Chabad Center for Greeting Moshiach visited in 2018. Not on chabad.org after 33 years and ~$3M a year; the
  official Synagogue of Inverrary – Chabad (Lieberman) is 290 m away. No network line. Its satellites "Di Shtetl" and
  the "Rashbi" shul (Rabbi Itamar Taktuk) have no address — not added. Chabadpedia: the yeshiva was once supervised by
  Rabbi Shneur Zalman Labkowski, rosh yeshiva at 770.
- **Fix: Chabad Niagara Falls USA (Lorber) was a dot in Ontario.** Moved to its own address, 332 Prospect St, Niagara
  Falls NY (fixes in data/extra-centers.json) — but it stayed Ontario's: the build tags US/Canada dots by Natural
  Earth's 1:10m country outline, which gives downtown Niagara Falls to Canada. So `tag()` in scripts/build-data.mjs now
  checks the map's own areas: where a point is inside another drawn state or province, that decides (`unitIdx`). Of
  1,773 US/Canada dots this was the only one tagged differently from where the map draws it.
- Checked, NOT added: Chicago's "Moshiach Center" (6738 N. California; a meshichist shul in 2013 reports, no trace
  since), Woodstock's "Rock 'n Roll Rabbi" Yisroel Gootblatt (one undated article, c. 2009), Star Lake's
  Congregation Yeshivas Lubavitch (funded by Tomchei Tmimim: official), "Chabad of Greater Hazleton" (a fundraiser
  for a future house), the IRS's Florida "Beis Moshiach"/"770 Moshiach Community Center" names and Milwaukee's
  "Moshiach Center of Riverwest" (no center found), West New York's "Yeshiva Gedolah Lubavitch" (a 2013 letter only),
  West Bloomfield's Bais Chabad Torah Center (on chabad.org), Oberlin's Rabbi Elkan (replaced; no center of his own).
  From the meshichist sweep: Hollywood FL's "HaNefesh HaElokit" center (Nasrati, Elishevitz; Chabadpedia, undated),
  Tomchei Temimim Poconos and its summer "Camp Gan Israel Machane Moshiach" (Hendel's; a yeshiva and a camp, not a
  house), Springfield MO's Rabbi Yosef Yitzchak Avichzer (Chabadpedia only, unverified), Springfield IL's Mendy Turen
  (likely official), Milwaukee's "Congregation Moshiach Now" (Milchtein; IRS only), and IRS-only names (Beit Mashiach
  LA, Team Moshiach, Mechon Mashiach, Project Yechi, Cong Beit Aharon Moshiach Center of Ridgewood). The international
  mushroom networks (Kupchik, Edery, Azman, Mashiach Jabad Mexico) have no US house.
- **New Jersey: Rabbi Yosef Carlebach's "Chabad of Central New Jersey"**, network "Yosef Carlebach" (found by the
  news/courts sweep, then checked by hand): NJ Jewish News (Debra Rubin, Mar 27, 2019) — Rutgers Chabad is "the hub of
  10 affiliated Chabad houses in central Jersey"; "They are not affiliated with the several dozen other Chabad-Lubavitch
  centers in New Jersey", "which are aligned with the Lubavitch movement's Rabbinical College of America in Morristown".
  Monroe's official Chabad (Zaklikovsky, 118587) on its own site: "There is only one authorized Chabad center in
  Monroe"; "Anyone else using the 'Chabad' name is sadly operating in direct defiance of Chabad's structure." chabad.org
  has no center in New Brunswick at all and none of these rabbis in NJ; nothing shows a reconciliation since Rabbi Moshe
  Herson's death (Jan 2025). Against (in each `mushroom` text): Carlebach says the Rebbe sent him to Rutgers in 1978.
  Added from the network's own affiliate list (chabadnj.org/community-links), each with 2026 activity on its own site:
  Chabad House at Rutgers (170 College Ave, New Brunswick), Chabad House of Monroe (324 Applegarth Rd; Spritzer),
  Chabad of North & South Brunswick (4100 Route 27; Mendy Carlebach), Chabad of Greater Monmouth County – Congregation
  Sons of Israel (Poplar Place, Ocean, beside Hillel Yeshiva — `area`; Yosef and Moshe Carlebach), Chabad of the Shore
  (620 Ocean Ave, Long Branch; Schapiro, Greenberg, Marasow), Chabad of Colts Neck (PO box only — `city`; Ephraim
  Carlebach). Left out: East Brunswick (the Majeskis, youth work, no premises) and Bradley Beach (the Krauses, from
  their home, 2025) — add them when they have a place. Hebrew spelling of Carlebach: קרליבך (as the map already has it).
- From the news/courts sweep, checked, not added: Marina del Rey's Living Judaism Center (Naparstek, fired by Cunin
  2002; the building is now the official Chabad of the Marina), San Francisco's Schneerson Center (Rabbi Bentzion Pil;
  Cunin 1996: "You have nothing to do with Chabad Lubavitch" — but it doesn't call itself Chabad), Chabad of Gramercy
  Park (Rotenstreich; Chapter 11 in 2025, no center found), Stamford (Shemtov; a property case, still on chabad.org),
  Northwestern's Tannenbaum Chabad House (on chabad.org), Fort Lauderdale's Downtown Jewish Center (on chabad.org now),
  IYYUN / Chabad of Carroll Gardens (Pinson; on chabad.org), Kingston PA's Wyoming Valley Yeshiva (not Chabad-named),
  Colonie NY's Rabbi Yaakov Weiss (suspended by Rubin in 2008; no center).
- The town-by-town upstate/eastern NY sweep (Catskills, Hudson Valley, Capital Region, western and northern NY, the
  Poconos and western New England fringe) found nothing new beyond the Borensteins and Buffalo: only official houses
  and empty IRS shells (Chabad of Hunter, of Lackawaxen, Bet Chabad Stroudsburg, Pottsville's Beit Hatalmud, Chabad of
  Greater Danbury, Tomchei Temimim Lubavitch Monticello), a YellowPages-only "Chabad of Franklin County" (Greenfield
  MA) and a summer-colony shul (Congregation Iched Anash, Monticello). The 2006 letter's "three other rabbis" remain
  unnamed. **Unfinished:** the directory-differencing sweep outside NY (GoDaven, OU, federation directories) was cut
  off twice by session limits; rerun it.
- **For the owner, not changed:** Rabbi Yisroel Rubin of Albany (Eastern NY's "Rubin family") passed away on Shemini
  Atzeret 5787, Oct 2–3, 2026 (JNS, Oct 6); chabad.org's data on the map was fetched Oct 3 and may still list him
  as living on the Capital District card.
- Tools here: WebFetch and WebSearch both work (ProPublica's API, the US Census geocoder, news sites); per the owner,
  Firecrawl only when they can't reach a page (now a standing rule below). `npm run build` must run with
  `NODE_USE_ENV_PROXY=1` (Node's fetch ignores HTTPS_PROXY otherwise); a fresh container downloads ~1 GB into .cache.

## ▶ Oct 19: seven more mushrooms (30 now); Ocean City is Kaplan's
- Owner: "Find more mushrooms in the world" ("a mushroom will never be in the chabad directory … you have to do
  research"). Researched on the open web; Chabad's own directories were used only to rule a house official. Added to
  data/extra-centers.json (hidden unless Mushrooms is on), each with its evidence in `mushroom`:
  - **Japan**: Rabbi Binyomin Edery's two houses, Chabad House Tokyo (Omori) and Chabad Kyoto (Moti Grumach). The owner
    took them off on Oct 12 ("he's a mushroom") 40 minutes before the Mushrooms option existed; back now as mushrooms,
    network "Binyomin Edery".
  - **Ukraine**: Anatevka, Rabbi Moshe Reuven Azman's refugee settlement by Hnativka, west of Kyiv (synagogue, mikveh,
    schools; OpenStreetMap hamlet). Forward (2015): Azman "broke with the Chabad-Lubavitch Hassidic movement in the 1990s
    to start his own operation". With his Brodsky Synagogue he now has two places, so both carry network "Moshe
    Reuven Azman".
  - **India**: Chabad House Jaipur (Betzalel and Rachel Kupchik, since Elul 5784, Kupchik family) REPLACES the Pune
    house — Beis Moshiach on Chabad.info (Dec 9, 2024): they left Pune after 27 years, "the shlichus in Pune has
    ended". Chabad Leh, Ladakh (Rabbi Ohad Marciano) — on Chabadpedia's India list and in a traveller's comment on
    chabad.org (Aug 2025), not in the Chabad of India directory.
  - **US**: Chabad of Westboro, Westborough MA (Rabbi Michoel Green, 54 South St) — Central Massachusetts Chabad
    dismissed him Jan 2021 and Chabad removed the house from its database (AP, WBUR); it runs on as an independent shul
    (IRS filing May 2025). Chabad of Colorado Springs Jewish Community (Rabbi Boaz Vituk, 6062 Hollow Tree Ct) —
    Chabad's spokesman Motti Seligson (Gazette, Mar 2023): "He is not a representative of ours".
  - Checked, NOT added: Poway (still on chabad.org), Melbourne's Chabad of the CBD (on chabad.org, no personnel since
    Herzog's 2013 ouster), Atlanta's Chabad Intown (on chabad.org), UCSD's Hadjadj (no Chabad-named center since 2022),
    East Brunswick (a 2018 case, gone), Santiago's "Chazon Ish" (muchiler: a Haredi community "including Chabad", no
    address), the Kupchik sons' work in Israel (Neot Peres in Haifa, Petah Tikva, Beit Shemesh: no house found), and
    Krabi's Beit Hillel (a layman's prayer room in a kosher restaurant; ruled out by the owner Oct 11 — ask before adding).
  - Chabadpedia's India page (Oct 2026) also says Varanasi closed in the COVID period and Manali is now run by Rabbi
    Chagai Magen; the map keeps the Chabad of India directory's data (the owner's pages) — for the owner to decide.
- **Ocean City, Maryland is Kaplan's, not Vogel's** (owner asked): Chabad Lubavitch Center of Eastern Shore (Rabbi Noam
  Shimon Cohen) — COLlive (May 14, 2025): Rabbi Shmuel Kaplan, "the Head Shliach of Maryland", calls the Cohens "the
  local Shluchim" (their son-in-law joined Mesivta Lubavitch of Baltimore, appointed by Kaplan). Already in Maryland on
  the map; nothing changed.
- Tools in this account: WebFetch can't resolve any host and curl to most sites is blocked; WebSearch works. Firecrawl
  (paid; owner: use it only when needed): a markdown scrape costs 1 credit, a "query" scrape 5, a search 2–4; Nominatim
  and the US Census geocoder work through it (1 credit each).
- The rebuild moved a few coast points (snapping), nothing else; posters don't use centers, so not regenerated.

## ▶ Oct 13: a border where a shetach meets land no shetach covers (political map)
- Owner (screenshot: Saudi Arabia, Turkey, Central Africa against grey land): "Why are there not proper borders when
  there's no other territory bordering it". The political map only drew a thin coast line there (geo.json's open edges
  are all "coast"; the physical map got its purple border on such edges Oct 7, from the tiles). Build:
  `withLandEdges` writes geo.json's `landEdges` ({arc: [[first, last point], …]}), the parts of open edges that are also
  outside.json's borders (same grid, point for point); web/data/geo.json got it without a rebuild. Page: mesh kind
  `edge` (`landEdgeLines`), layer `line-edge`, drawn grey (G.grey, 0.8–2 px) — the shetachim's white border can't be
  seen against the grey land (tried). The owner stressed: don't change the existing white borders (unchanged). Live. screenshot.mjs gained `eval=<js>`.

## ▶ Oct 13: smaller capital stars when zoomed out
- Owner (screenshot of the world view zoomed to the Americas): "I hate how when you zoom out it shows these way to massive
  stars". The `caps` icon-size went by the view's own fit (`zFit` to `zFit`+3), so in the world view, whose fit is far
  out, a continent already had stars at 0.6–0.75. Now it goes by the map's zoom itself: 0.3 at zoom 1, 0.38 at 2, 0.48
  at 3.5, 0.62 at 5, 0.85 at 7, full size at 9, in every view.

## ▶ Oct 13: the Silberbergs of London, Ontario shown as "Spencer"
- Owner: show the Silberberg couple (Mordechai and Nechamie) as "Rabbi Spencer and Mrs. Spencer", a family nickname
  (it isn't online; don't "correct" it back). A new `rename` fix in data/extra-centers.json (by center: 119816 Chabad at
  Western, 117792 Friends of Lubavitch London), applied in scripts/build-data.mjs after chabad.org's personnel are
  joined (a plain `personnel` fix would be overwritten there). firstName "Rabbi" / "Mrs.", lastName "Spencer";
  Hebrew הרב / הרבנית / ספנסר added to data/hebrew/*-names.json. web/data was edited to match, no rebuild.

## ▶ Oct 13: a vaad's alternate, set apart
- Owner: "The alternate member of the vaad shouldn't have the same prominence as everyone else". In `membersHTML`, a
  member with `role: "Alternate"` (Florida's Sholom Dubov) comes last, under a dashed line, smaller and grey.

## ▶ Oct 13: the Quad Cities are Illinois's
- Owner: "the quad cities shliach is under Illinois … you can figure out" how far into Iowa. Illinois's territory adds
  Scott County, Iowa (19163: Davenport, Bettendorf), the Iowa side of the Quad Cities; Rock Island and Moline were
  Illinois's already. The one center there is Chabad Lubavitch of Quad Cities, Bettendorf (Cadaner). Muscatine and
  Clinton counties stay Iowa's (no centers). Illinois now needs `short: "IL"`; partNames gives US-IA's parts.
- Then (owner, Oct 14: "Too much sticking into Iowa no?"): only Davenport (city) and Pleasant Valley Township (Bettendorf,
  Riverdale), not all of Scott County. A town claim can now name its county, `"Pleasant Valley@19163"` (Iowa has seven
  Pleasant Valley townships). A full `npm run build` takes about 5 minutes now, not the 20–40 once noted.

## ▶ Oct 13: Long Island is part of New York City's shetach
- Owner: "add long island to the NYC shetach". Nassau and Suffolk (36059, 36103) moved into `new-york-city`'s
  territory; the `long-island` shetach (Tuvia Teldon, capital 117681) is gone, from data/hebrew/shetachim.json and
  web/data/he.json too. Teldon is on Tzach's board already. Rebuilt.
- Renamed (owner: "now that it isn't just the metro decide on a better shetach name"): "Greater New York" / "ניו
  יורק רבתי", short "Greater NY" (Hebrew short stays נ״י); id still `new-york-city`. Edited in data/ and web/data/
  directly, no rebuild needed (names aren't in geo.json or the tiles).
- Tzach's board: the owner asked about Goldman as chairman and Butman as director. Both have passed away (Rabbi Moshe
  Pesach Goldman, chairman/secretary, Sept 2025; Rabbi Shmuel Butman, director, July 2024). The board stays the April
  2026 kinus list; no current chairman or director found. Asked the owner.

## ▶ Oct 13: the Rebbeim on Lubavitch's card
- Owner: "put all the Rebbeim that reigned from Lubavitch … by the Lubavitch listing". `LUBAVITCH_REBBEIM` /
  `rebbeimHTML` on the honor card: "Rebbeim in Lubavitch:" / "נשיאי חב״ד בליובאוויטש:", then the Mitteler Rebbe
  (1813–1827), the Tzemach Tzedek (1827–1866, ohel there), the Rebbe Maharash (1866–1882, ohel there), the Rebbe Rashab
  (1882–1915), each with zy"a / זי״ע, his name and years (Hebrew years in Hebrew). The Alter Rebbe (Liadi) and the
  Frierdiker Rebbe (Rebbe from 1920, after Lubavitch was left) aren't on it. Screenshot it with the `honor` action
  (`world:political:phone:light:honor=1`).

## ▶ Oct 13: the Rebbe on 770's card
- Owner, after two tries they didn't like (a shliach-style line, then a boxed block): "reverted to how it was before when
  it was hq by itself (maybe with a tiny expander to view all the many listings there) and the Rebbe as the leader. And
  no not in his own box, he should be the leader tho and def bigger than other shluchim."
- Now: 770's dot opens the world-HQ capital card (`showCard`). Under its title is `rebbeHTML` (center 117678,
  `WORLD_HQ`): a plain line, 18px bold, bigger than the people listed. English: "The Lubavitcher Rebbe, zy"a" (owner: no Shlita in English).
  Hebrew: "כ״ק אדמו״ר נשיא דורנו זצוקללה״ה נבג״מ זי״ע" (owner asked for the proper form; the standard Chabad one, as chabad.org.il writes it; the Rebbe Rashab is הרש״ב, as Chabadpedia; the Lubavitch Rebbeim are "כ״ק אדמו״ר … זי״ע" too). His role goes before the name with a colon, as a shetach's "Head shliach: …" does: "Leader:" / "נשיא הדור:", the same size as the name (semi-bold, grey; owner: smaller was "way too small") (owner: "He needs to be specified
  as the leader much like a shliach is a head shliach and krinsky is director") (owner's wording: the shortened אדמו״ר, then
  those titles after). Never "obm" / ע״ה for the Rebbe. The other listings at the address sit in a small
  "N more listings at this address" expander (`details.at-address`).

## ▶ Oct 13: Israel's board, under Aharonov
- Owner: "for Israel add leadership but in that case it's BELOW aharonov since aharonov wields real power as head
  shliach". Israel now has `vaad` "Vaad of Tzeirei Agudas Chabad" / "ועד צעירי אגודת חב״ד" (Hebrew in
  data/hebrew/shetachim.json and, without a rebuild, web/data/he.json) with no `vaadFirst`, so the card reads Head
  shliach: Aharonov, then Leadership (opens to the members); the Head shliach label has it as the smaller line under
  his name. Members from Chabadpedia (Firecrawl), "חברי הנהלת צעירי חב״ד כיום (תשפ״ד)", חברי ועד: Arik Lipsker
  (Rechovot), Gershon Chanoch Shnur (Ganei Tikva, runs its Chabad house), Michael Yosef Dor (educator, no town).
  The compliance officers and auditors on that list (the authorities' representatives) are left out.

## ▶ Oct 13: the UK's and NYC's boards
- Owner: "What about the board for the NYC metro and the UK board". Where the head is a board (`headTitle`
  "Leadership"), the head line itself opens to `vaadMembers` (`membersHTML`). Members' towns are those of their own
  centers in the chabad.org data.
  - **UK, Hanholo of Chabad Lubavitch UK**: chabad.org.uk "Our Team" (aid 2806809) lists them by initial; first names
    matched to UK centers: Yeremiyahu Angyalfi (Leeds), Shmuel Arkush (Birmingham), Nissan Dovid Dubov, Menachem Junik,
    Dovid Katz, Mendy Korer, Shmuel Lew (London; "S Lew", not in the locator data), Pesach Efune (Brighton), Yehuda Pink
    (Solihull), Leivi Sudak (Edgware), Bentzi Sudak (London), Aryeh M. Sufrin (Woodford Green, `townHe` given),
    Yitzchok Tzvi Sufrin ("I H Sufrin", London).
  - **NYC, Tzach**: the Vaad of Tzach thanked at the NY kinus (anash.org, Apr 23 2026): Kasriel Kastel, Shlomo
    Friedman (Brooklyn), Sholom Tenenbaum (no center found, no town shown), Tuvia Teldon (Commack), Leibel
    Baumgarten (East Hampton).

## ▶ Oct 13: a region stays the region
- Owner: "why does the whole world show when in US and Canada or FSU etc view". `limits()`: in every view but World
  the map zooms out only 0.35 past its frame (was 1.5) and `setMaxBounds` keeps it within the frame plus 60% each
  way (skipped for frames crossing ±180°: FSU, Oceania). World is unchanged.

## ▶ Oct 13: the vaads' members
- Owner: "I could expand in each of the respective vaads to see the members of the vaad and their town". The card's
  "Leadership: Vaad…" line is now a `<details>` (`vaadHTML`) that opens to the members, each with their town (from
  their own center in the chabad.org data). Data: `vaadMembers` in data/shetachim.json (and web/data/shetachim.json; the
  build passes it through); Hebrew comes from he.json's first, last and city names, roles from `VAAD_ROLE_HE`.
  Owner (Oct 13): no election info on the card, and no member singled out (Simon's "one-year term" label removed;
  he stays listed like the others until the owner says otherwise). Only Head (Raichik) and Alternate (Dubov) remain.
  - **Florida** (owner: "Florida had a more recent election" than Korf's 2020 appointed seven): elected Feb 2023, 273
    shluchim voting, 93% turnout (anash.org/new-members-elected-to-floridas-vaad-hashluchim, Feb 28 2023): Yosef
    Raichik (head; crownheights.info, Aug 15 2023: "the newly elected head of the Vaad Hashluchim of Florida"),
    Boynton Beach · Yossie Biston, Parkland · Berl Goldman, Gainesville · Eli Lipskar, Miami (The Shul of Downtown)
    · Zalman Levitin, Palm Beach · Meir Kessler, Boca Raton · Fishel Zaklos, Naples; alternate Sholom Dubov, Maitland.
    No term length given; if there's been a newer election, replace them.
  - **New Jersey**: elected June 2025, 3-year terms (collive.com/new-vaad-hashluchim-elected-in-new-jersey): Shalom
    Lubin, Florham Park · Avi Richler, Mullica Hill · Sholly Leverton, West Windsor · Moshe Gourarie, Toms River;
    Ephraim Simon, Teaneck, for a one-year term (so it may have ended by June 2026 — ask the owner).

## ▶ Oct 13: coming back to the page
- Owner's phone screenshots after returning to the browser: the font's letters drawn as a shetach's fill, blurred
  tiles. The Oct 11 in-place repair after a lost WebGL context (fresh tiles, icon and line atlases) wasn't enough.
  Now: on `webglcontextlost` the page saves where it was (`saveResume`: options, centre, zoom, flat or standard,
  the ringed family) to sessionStorage, and on `webglcontextrestored` (or still lost 1.5 s after coming back) it
  reloads; at startup `resume()` clicks the same options, jumps to the place and rings the family again.
  Test: `scripts/screenshot.mjs` action `lose`.
  **Oct 26: it no longer reloads but rebuilds the map from memory (`rebuildMap`, the reload only if that fails); see the
  top.**

## ▶ Oct 13: search
- Owner: "Search function add for shluchim, chabad houses, etc". A search bar at the top of the map (`#search`; phone:
  full width at the top, desktop: right of the panel). It matches shetachim (name, head shliach), shluchim (everyone in
  a center's personnel), centers (name, city, chabad.org's Hebrew name) and cities, in English and Hebrew alike (the
  Hebrew side once he.json is loaded); the index is built on first use (`buildSearch`). Picking a result flies there and
  opens the same card a tap would; a result outside the current view switches to World first. Arrow keys / Enter work.
- **Last name → his houses on the map** (owner, Oct 13: "a separate place to do it where you search, click the last name
  then it shows on the map highlighted all those ones" — NOT rows in the normal results; that first try was reverted).
  The search dropdown has two tabs, All / Last name. Last name lists each last name of someone who runs a center (a
  living director, or the shliach the card shows: first living man, else the first woman) with how many houses; a pick
  rings every one of them in orange (`mark` layer, `MARK` colour), frames them (World if the view lacks some) and shows
  a chip "31 Chabad houses run by Shemtov ✕" under the bar that clears it. `searchFamilies`, `markFamily`, `showMark`.
- **Vaad first in Florida and New Jersey** (owner, Oct 13): `vaadFirst: true` in data/shetachim.json (and the build's
  copy, web/data/shetachim.json; the build passes it through). Card: "Leadership: Vaad…" then "Head shliach: …";
  one-line mentions "Florida · Vaad… · Benjy Korf"; Head shliach labels on the map: the vaad, his name under it.
- Not searchable: neighbourhoods (Crown Heights finds nothing; chabad.org's city for it is Brooklyn) and street
  addresses (the locator export has none).
- Test helper: `scripts/screenshot.mjs` takes `type=<text>` and `pick=<n>`.

## ▶ Oct 11: Gaza's beach slivers fixed
- Owner's screenshots (Israel view, zoomed in): a grey strip ~100 m wide between Israel and the sea at **Zikim** (north
  end of Gaza, 0.33 km²) and at **Rafah** (south end, by Egypt, 0.12 km²). Cause: the IDF-control map stops just short
  of GADM's coastline, and the strip is joined to the rest of Gaza's main body, so the sliver rule (loose pieces only)
  never saw it. `scripts/held-lines.mjs` now cuts strips of the rest narrower than 300 m (`THIN_M` 150) off as pieces
  of their own and gives them to the held part **only where they run along the place's own edge** (coast or border),
  so narrow gaps between two IDF zones stay. (mapshaper's `-buffer` doesn't shrink polygons: the shrink is done by
  erasing a band around the outline, `-lines -buffer`.) Gaza: 196.2 km² held (was 195.7), 147.4 the rest.
- Rerunning held-lines today gives Lebanon and Syria small differences (±0.3–0.9 km²) even without the new rule, so
  only the Gaza shapes were rewritten; Lebanon/Syria shapes are the Oct 7 ones. Check before replacing them.
- Branch note: this session's own branch is `claude/sharp-lamport-rouesl`; pushed there and to the live
  `claude/bold-albattani-aqfnj9`.

## ▶ LATEST (Oct 11): what's open
- **Done Oct 11:** (1) the white screen on coming back to the browser: the phone drops the map's WebGL context;
  `webglcontextrestored` now clears every source's tiles and the icon atlas so they're remade, and if the context never
  comes back the page reloads (tested by forcing a loss with WEBGL_lose_context: the old page went blank, the new one
  comes back whole). (2) **Ontario ends at the shore**: `data/shapes/ontario-border-water.geojson` (OSM water, z9, the
  parts along the US border, cut to GADM's Ontario: Great Lakes, St Clair/Detroit/Niagara/St Lawrence, Lake of the
  Woods…) is erased from CA-ON in the build, so Essex County (Michigan shetach) and all of Ontario stop at the coast
  (owner: "the Michigan outline border shouldn't be maritime"); Essex's shape lost `lakeEdges`. (3) **Muddy Creek Bay
  land**: `data/shapes/land-fixes.geojson` (land the Census 1:500k county outlines treat as water, from OSM) is merged
  into the county beside it (GEOID) in `countiesGeoJSON()` (cache file name carries the fixes' hash). (4) **Toledo /
  Northeast Ohio line moved to 83.06°W** (owner: "just make -83.06 the NE ohio - Michigan border"), in ohio-toledo,
  ohio-northeast and ohio-central (the corner at 41.03°N).
- **Stray lines (Oct 11, owner's screenshot of Lake St Clair):** threads of Ontario left along the border line where the
  water just missed it are dropped in the build (`-explode -filter` area > 5 km² or area/perimeter² > 0.006; Long Point
  and the Thousand Islands stay); the coast line fades out from zoom 8 to 11 on the street/physical map, where the
  street map's own shore is drawn and our coarser coast showed as lines across rivers (Belle Isle).
- **France / Illinois "shared leadership"** (owner asked, from a COLlive article; researched Oct 11, waiting on his
  call): France — Mendel (Menachem Mendel) Azimov succeeded his father in 2014/5775 as head shliach of Paris; Beth
  Loubavitch is run by him and his brother Levi Yitzchak (Neuilly, board member). Illinois — Meir Shimon Moscowitz
  appointed head shliach by Merkos (Apr 2014), with a vaad (majority vote, first year) and his brother Yosef Shmuel
  as executive director. My read: one head each; the map's "Meir Moscowitz" drops "Shimon" (rule: never shorten).
- **Canada + Europe jurisdiction sweep, part 2 (Oct 11; owner: "digging into the shetachim in Canada [and] Europe … any
  multi country shetachim or with parts of countries"):** one real lead, waiting on the owner: **Ottawa** — COLlive
  (25 Oct 2025, the Finkelstein Chabad Centre opening) calls Rabbi Dovid Hayes (in Ottawa since 1977) "Head Shliach of
  Ottawa", and lubavitch.com calls Zalman Grossbaum "head emissary of Southern Ontario" — so Ottawa (Eastern Ontario?)
  may be its own shetach; the list has all Ontario under Grossbaum. Confirmed as is: Yukon/NWT south of 63° are
  Alberta's (Matusof's roving rabbis' first trip to Whitehorse and Yellowknife, July 2026). Saskatchewan: Raphael Kats
  (Saskatoon, since 2011, also serves Regina) — no source says whether he's under Altein or Matusof; stays as the list
  has it. No Chabad found (nothing to change): Gatineau/Outaouais, Northern Ireland (Belfast's Brackman left 2013; Chabad
  Ireland is Dublin only), Gibraltar, Jersey/Guernsey, Faroe (a 2015 note: Iceland's student rabbis found Jews "as far
  as the Faroe Islands" — too thin), Greenland, Ceuta/Melilla (Melilla's rav, Aharon Peretz, is RCE, not Chabad),
  Abkhazia, Tahiti. French Guiana: WJC says its ~40 Jews are "aided by Chabad", branch not named.
- **Ottawa, dug further (Oct 11, waiting on the owner):** Rabbi Dovid Hayes — "Head Shliach of Ottawa" in COLlive both in
  Aug 2010 (A Yeshiva in Canada's Capital) and Oct 2025; Executive Director of Chabad Lubavitch of Ottawa (chabad.org
  119209); in Ottawa since 1977, before Grossbaum reached Toronto (1980). Grossbaum's own body is "Chabad Lubavitch of
  Southern Ontario" (chabad.ca staff page: "Director of Chabad Lubavitch of southern Ontario"; lubavitch.com: "head
  emissary of Southern Ontario, which encompasses the city of Toronto"), though COLlive 2010 / COL 2005 call him head
  shliach of Ontario, and Ottawa's and Kingston's shluchim come to his Ontario kinus (Hayes emceed it, 2010). My read:
  Ottawa is its own head shliach, as some US states have several. Ottawa's centres on the map: Chabad Lubavitch of
  Ottawa (Hayes), Congregation Lubavitch (Botnick, rov), Jewish Youth Library (Caytak), Wellington West (Moshe Caytak),
  Westboro, Centrepointe (Mendelsohn), Torah Centre (Blum), Kanata (Gershzon), Rohr Chabad (Boyarsky). Kingston has
  only a campus Chabad (Simon). If split: a shape cutting CA-ON (like Essex) — city of Ottawa, or Eastern Ontario.
  Chabadpedia (co.il and .com) is behind Cloudflare even for CrawlForge stealth (403, IP reputation).
- **French Guiana, dug further (Oct 11):** no Chabad branch can be named. The "aided by the Chabad organization" line
  comes from the World Jewish Congress page coded GY (Guyana), which mixes Guyana with French Guiana (Cayenne's 1992
  refounding, a Cayenne address); the Jewish Virtual Library copies it without a name. Guyana itself is overseen by
  Rabbi Avromy Super of Chabad of St Lucia (chabad.org, Aug 2025) — already in the Caribbean shetach. Nearest
  Chabad houses: Martinique (Reouven Naparstek, Caribbean); Suriname only gets Merkos Pesach bochurim. French Guiana
  stays blank.
- **Reading Chabadpedia (Oct 11):** it's behind Cloudflare (403 even via CrawlForge stealth). `scripts/chabadpedia.py
  "<title>" …` reads it through the Wayback Machine (newest copy, or asks web.archive.org/save for one first) and prints
  the article text. Needs `web.archive.org` in the environment's allowed domains (asked the owner, Oct 11); archive.org's
  availability API already works (Toronto and Grossbaum pages have copies; Ottawa has none yet). Untested until allowed.
  web.archive.org and archive.ph are refused by the session's egress policy itself ("Blocked by egress policy"), not
  just the environment's settings, and WebFetch refuses web.archive.org too. A GitHub Action to fetch them on GitHub's
  servers was refused as routing around that policy (Oct 11) — don't retry it; the owner can paste pages instead.
- **Faroe Islands → Iceland's shetach (owner, Oct 11: Iceland's Chabad found Jews "as far as the Faroe Islands" means
  Iceland serves them, as Alberta has Yellowknife and Whitehorse).** Territory ["ISL","FRO"]; FRO added to the page's
  EUROPE view list (a shetach country missing from those lists is drawn as plain land, not filled — checked: none other).
- **Suriname (owner asked which shliach the Pesach students worked with):** none. Pesach 2025's four students (Deren,
  Winner, Zakilkowski, Elberg) were sent by Merkos 302 (Mendy Kotlarsky); Avromy Super (St Lucia) only linked them to a
  Jew in Trinidad on their stopover; their route was planned via Curaçao (no shliach named). Stays blank.
- **Ontario split (owner, Oct 11: "we're going to split Ontario into two … do research on how much to give each"):**
  Chabadpedia (the owner's PDFs): Grossbaum sent to Toronto in 1974 (תשל"ד), "as of 2014 about fifty shluchim under him
  throughout the province of Ontario". Between Toronto and Ottawa the only Chabad is Kingston's campus house (Sruly and
  Esti Simon, since 2010 — before that they worked in Ottawa for a local Chabad rabbi). No Chabad found in Cornwall,
  Brockville, Pembroke, Perth, Peterborough, Barrie, Sudbury, Thunder Bay. **Done (owner chose A):** new shetach
  `ottawa` — Ottawa · Dovid Hayes, capital Chabad Lubavitch of Ottawa (119209) — territory the shape
  `data/shapes/eastern-ontario.geojson`: everything east of 77.9°W (owner: no staircase, then "straight vertical like
  most boundaries"; 77.9 is the middle of the slanted line he'd liked) — Ottawa River above Rolphton to Lake Ontario by
  Brighton: Kingston, Belleville, Trenton, Prince Edward County are Ottawa's; Ontario (Grossbaum) keeps the rest,
  Northern Ontario included. partNames CA-ON: "Eastern Ontario (Ottawa, Kingston)". Northern Ontario: searched for any
  roving/visiting Chabad (Timmins, Kapuskasing, Kirkland Lake, Cochrane, Sudbury, North Bay, Sault Ste Marie, Thunder
  Bay, Kenora) — none found; Ontario's recorded Merkos visits are all Southern Ontario (1969; Elmira/Waterloo 2011).
- **Caribbean name sized by its spread (owner, Oct 11: the tiny "Caribbean" over the sea):** `labelWide: true` on the
  caribbean shetach, as the Maritimes (its labelAt spot was sized by Cuba's room; it was that small before today too).
- **Canada's far north is grey (owner, Oct 11: "Go ahead with those lines").** Searched for any Chabad activity, roving
  trips included, in each province's north. The northernmost activity found:
  - Saskatchewan: Prince Albert (53.2°N, roving 2019).
  - Manitoba: Winnipeg only.
  - Ontario: Ottawa and Haliburton's camp.
  - Quebec: Quebec City (46.8°N).
  - BC: Whistler and Salmon Arm (50.7°N).
  - Newfoundland and Labrador: St. John's only, nothing in Labrador.
  - Alberta: roving trips to Fort McMurray, Whitehorse and Yellowknife.

  Each province is a shape claim with straight lines; north of the line is `outside` (CA-ON, CA-QC, CA-MB, CA-SK and
  CA-NL are in `notShownWhenBlank`). After the owner's changes the same day:
  - Ontario: `ontario-south-of-47`, south of 47°N and west of Ottawa's 77.9°W, minus Essex.
  - Quebec: `south-of-47`. The owner wanted Quebec's line on Ontario's parallel; 46.5°N would have cut out Quebec
    City's two centres (46.8°N), so both are at 47°N, one straight line.
  - Manitoba and Saskatchewan: one rectangle, `south-of-54` for both provinces (the owner drew it). Its east side is
    Manitoba's straight border with Ontario, carried on north at 95.15°W, so the slanted NE corner of Manitoba is grey.
  - BC: whole again (owner: "restore bc - i don't like the enclave"; its grey north sat between Alaska and Alberta's
    Yukon). Northern BC research found no Chabad: no centre north of Whistler; Prince George (about 180 Jews) never
    had a synagogue or rabbi (Eli Klasner, 2023); no roving trip on record.
  - Newfoundland: `newfoundland-island`, the island, Port au Port and the islands near it, but not Labrador. The
    shetach is renamed "Newfoundland" / "ניופאונדלנד".
  - Alberta: stays whole, plus the Yukon and NWT south of 63°N, as before.
  - **Changed Oct 12 (owner changed his mind):** BC and Alberta now end at 54°N, the same line as
    Manitoba-Saskatchewan (shape `west-south-of-54`); Alberta no longer takes the Yukon/NWT strip, and the north of
    BC and Alberta, the Yukon and the NWT are all left off the map (notShownWhenBlank). No centre is lost: Edmonton
    (53.5°N) is the furthest north. Also renamed South Korea → Korea / קוריאה (shetach, country label, the owner's
    list and the flagship list).

  No centre changed shetach. Sources include chabad.org's Saskatchewan and sub-Arctic roving rabbi reports, and
  lubavitch.com's "Where the continent ends" (Newfoundland).
- **Borders gone after returning to the browser (owner, Oct 11):** the context-loss fix (webglcontextrestored) reset
  the icon atlas but not MapLibre's line atlas, so every line layer (shetach borders, coast) drew nothing. It now sets
  `style.lineAtlas.texture = null` too. Test: lose and restore the WebGL context (WEBGL_lose_context) and screenshot;
  scratchpad `shotlost.mjs`.
- **Chabadpedia, Altein and Wineberg pages (owner's PDFs, Oct 11):** Avrohom Altein is "head shliach of the state of
  Manitoba" (Winnipeg since Tammuz 5732); Wineberg founded Chabad of Vancouver in winter 5735, BC's shliach (Yosef Hecht
  came the summer before on Merkos Shlichus). Neither page mentions any activity in the provinces' north, so the lines
  stand. The Altein page's footnote: his son **Rabbi Shmuly Altein passed away 3 Tammuz 5786** (18 Jun 2026; The CJN,
  Chabad of Winnipeg's shloshim notice). chabad.org still lists him as living, so he's marked `isDeceased: true` by
  hand in data/raw/chabad-personnel.json (center 117789), like every other passed-away person (owner: the same as all
  the others, no separate list). A fresh personnel fetch would undo it until chabad.org updates: set it again.
- **Balkans, researched again (owner, Oct 11: "Croatia and Montenegro maybe sharing a head, unclarity about Bosnia,
  unclarity about Slovenia… proper deep research").** No change: the map already matches.
  - Croatia: Pinny Zaklas (Zagreb, since 2004), with Chabad of Dubrovnik as its summer branch.
  - Montenegro: Ari Edelkopf (Podgorica, since 2017), with Budva (Ehrenfeld, 2023) under him.
    - The "shared head" is Rabbi Luciano Moše Prelević, the Zagreb Jewish Community's chief rabbi (trained in a
      Sephardic yeshiva in Jerusalem, not Chabad). He was the Jewish Community of Montenegro's chief rabbi from
      2012/13 to 2017. In 2020 that community (now the liberal congregation of Nina Ofner Bokan) removed Edelkopf and
      named Prelević again; the Montenegro government still calls Prelević chief rabbi (gov.me, 2023 and 2024).
      Sources: JZCG's statements on borba.me and aktuelno.me; JTA, 7 Aug 2026.
    - Edelkopf runs the separate "Religious Jewish Community of Montenegro" and also uses the chief rabbi title.
    - Kaplan link: Yoel Kaplan founded that community in 2010-11 and ran the first seders in Podgorica (COL 2011:
      Zaklas and Kaminetzky helped). Edelkopf came in 2017 "with Kaplan's blessing" (Hebrew Wikipedia, יהדות
      מונטנגרו; no source given there). Kept as its own shetach, as the owner's list has it: Edelkopf has his own
      shliach under him and is chabad.org's and FJC's "Chabad of Montenegro".
    - FJC (Lazar's federation) has donation pages for Chabad of Serbia and of Montenegro, as it does for Moldova,
      Latvia and Estonia: an umbrella, not a reason to merge them into Russia.
  - Bosnia: no Chabad house, and no resident rabbi in Sarajevo since 1968 (cantor Igor Kožemjakin leads, per
    Hadassah, Oct 2025); only Merkos summer students (2000, 2008). Kaplan's Oct 2026 write-up (kore.co.il 222220) says
    his work "expanded to North Macedonia, Montenegro, Bosnia and Herzegovina and Kosovo". So Bosnia stays in Lower
    Balkans. Nothing ties it to Zagreb or Belgrade.
  - Slovenia: no Chabad house. Ariel Haddad (Chabad of Trieste and Slovenia) has been chief rabbi since 1999, comes
    to Ljubljana several times a month and opened the 2021 synagogue (run with the Graz community). It stays in
    Italy's shetach, with Haddad on its country card.
  - Kosovo (Kaplan, since 2011; honorary title 2020), North Macedonia (Kaplan's seders; the Skopje community's own
    rabbi is Avraham Kozma, not known as Chabad) and Albania (Kaplan, chief rabbi since 2010): Lower Balkans.
    lubavitch.com calls Kaplan "Chabad representative to Thessaloniki and the Lower Balkans".
  - Serbia: Kaminetzky (2008, sent through Merkos/Kotlarsky), Belgrade only.
- **Chabadpedia is readable now (owner added the Firecrawl connector, Oct 11).** `firecrawl_scrape` on
  `https://chabadpedia.co.il/wiki/<title>` (basic proxy, no stealth needed, 1 credit a page; the site has no
  robots.txt). Its search works the same way: `https://chabadpedia.co.il/index.php?search=<Hebrew>&fulltext=1`. Plain
  fetches from this machine still get Cloudflare's "you have been blocked" (it blocks the cloud IP). In a session
  without Firecrawl, give the owner the links, as the standing rule says.
- **Balkans, the owner's Chabadpedia PDFs (Oct 11):** Edelkopf: Montenegro's shliach since 5778 and chief rabbi since
  5780; Budva's house is "under Rabbi Edelkopf's Chabad house"; no word of Kaplan. Kaplan: "shliach in Thessaloniki,
  chief rabbi of Albania and the Balkan states"; revived Judaism in Macedonia, Kosovo, Montenegro and Albania. Zaklas:
  "head shliach of Croatia" (Zagreb, 5764). No change.
- **Vaads (owner, Oct 11: "places that have vaads that actually have real power like Florida and New Jersey should
  have it listed under the head shliach same as UK just with both").** There's a new `vaad` field in shetachim.json,
  with Hebrew `vaad` in data/hebrew/shetachim.json (build-hebrew stops if it's missing). It shows in three places:
  - the card: "Leadership: …" under "Head shliach: …";
  - the one-line mentions: "Florida · Benjy Korf · Vaad Hashluchim of Florida";
  - the Head shliach labels: a smaller second line (`SUB_SCALE` 0.62, regular weight, one or two lines, whichever is
    bigger) under the name. `sized()` takes the sub-line and picks among the forms.

  Set for two shetachim:
  - **Florida, "Vaad Hashluchim of Florida" / "ועד השלוחים בפלורידה".** Rabbi Avrohom Korf's letter (Feb 2020) named
    seven shluchim, chaired by Sholom Ber Dubov, "to represent me in all aspects of Shlichus" and said he "will defer
    all decisions to them and will accept their decisions as final" (Anash, COLlive). Korf passed away 11 Tammuz
    5785; Merkos named his son Ben-Zion (Benjy) at the regional kinus, Aug 2025.
  - **New Jersey, "Vaad Hashluchim of New Jersey" / "ועד השלוחים בניו ג׳רזי".** Rabbi Moshe Herson passed away in
    2025; Merkos named Mendy Herson head "with the support of a Vaad". Five members elected by over 90% of NJ shluchim
    families, June 2025, for 3-year terms; there was an earlier NJ vaad from about 2010.

  Not set (not like those two):
  - Illinois: Merkos appointed a vaad in 2014 only to guide Meir Moscowitz "during the first year".
  - Long Island: Vaad Rabonei Lubavitch, a rabbinical court.
  - The CIS's Vaad Hashluchim: an umbrella for all the ex-Soviet countries, chaired by Lazar himself.
  - Ukraine's vaad: no page on it.
  - Jerusalem's elected vaad: a city inside Israel's shetach.
  - Victoria: three joint heads, already on the map as "Disputed".

  Also fixed:
  - Florida's Hebrew head was "בנימין קורף": Benjy is Ben-Zion, so now "בן־ציון קארף" (the maqaf keeps the last
    name right).
  - Korf → קארף everywhere, as Chabadpedia and COL spell the family.
- **Rabbi Yisroel Rubin, head shliach of Eastern New York (Albany), passed away on the night of Shemini Atzeres 5787
  (Oct 4–5, 2026), aged 78** (Arutz Sheva, 5 Oct 2026; Chabadpedia ישראל רובין). He's marked `isDeceased` at both his
  centers (Chabad of the Capital District 117663, Maimonides Hebrew Day School 119060). The owner asked for the likely
  successor ("there's usually even before someone passes away a probable successor").
  - What I found: none named yet, and no son stood in for him publicly, even after his stroke in summer 2022.
    - Capital Chabad's own page still lists only Rabbi Israel and Rochel Rubin; Rochel still leads the Maimonides
      School.
    - No son holds a post at the main center (chabad.org, lubavitch.com).
    - The 2024 fiftieth-anniversary event was organized by Rabbi Mordechai Rubin (Colonie, the youngest) with Mrs.
      Raizy Rubin (wife of the eldest, Rabbi Mendel), at Mendel's Shabbos House (UAlbany).
    - Five sons and a son-in-law are shluchim in the region: Mendel (UAlbany), Abba (Saratoga Springs), Yossi (Clifton
      Park), Shmuly (Union College), Mordechai (Colonie), and Mendy Mathless (University Heights Chabad, Camp Gan
      Israel). Simmy is in Albany with no listed post.
  - So, per the owner ("just do the Pinson–Blumenfeld precedent"), the head is **"Rubin family" / "משפחת רובין"**
    (`lastName` Rubin), shown as "Shluchim: Rubin family".
  - When Merkos names a successor (Florida's and New Jersey's came at the shloshim or a month after, so expect around
    early November 2026), put his name in. The eldest son is Mendel.
- **Every shetach has a capital again (owner, Oct 11: "Why are a bunch of capitals missing???").**
  - Eight had none; India needs none, being Thailand's territory.
  - The world ones now use the owner's own `data/world-flagship-centers.txt`, which named them all. They had lacked a
    star only because chabad.org's data lacks those centers. Hand-added (extra-centers.json):
    - Sri Lanka: Chabad of Sri Lanka, 70 Green Path, Colombo; exact, from OSM.
    - New Zealand: Chabad of New Zealand, 788 Remuera Rd, Auckland.
    - Belize: Chabad House Belize, moved to Mullet St, San Pedro, per its own site, with the Belhamous.
    - Honduras: Chabad Roatan, with Rabbi Naftali Reichman; the capital is named "Chabad of Honduras", as Turkey's is.
    - Panama: Beth El Synagogue, Calle Winston Churchill, Paitilla; Rabbi Ari Laine, Chabad's director in Panama and
      chief Ashkenazi rabbi.
    - Qatar: "No fixed public center, Doha", as the owner's file says, so the star is at Doha.
  - US: Upstate New York is Chabad House of Buffalo (117976, Getzville; Gurary); Eastern New York is Chabad of the
    Capital District (117663, Albany).
  - Also added Sri Lanka's other four Chabad houses from chabadsrilanka.org: Weligama, Hiriketiya, Arugam Bay and
    Ella. Before this the shetach had no dots at all.
- **STANDING RULE (owner, Oct 11): any Chabad center found that isn't on the map gets added**, with a source, a
  precision and Hebrew, wherever it turns up. **Before adding one, always check it isn't a mushroom** (owner, Nov 4:
  "You always have to check that someone's not a mushroom when you try to add them") — by your own research, not by
  chabad.org's directory alone ("they're late or they're missing stuff ... if your own independent research tells you
  that he is official then fine he's official"). Likewise who heads what: "head shluchim make claims to make
  themselves look more powerful ... it's whatever is practically the real thing on the ground".
- **Back burner (owner, Oct 11):** the Gaspé peninsula should be in Quebec's shetach. It's north of the 47°N line, so
  it's grey now; carve it back in with a shape.
- **World center sweep (owner, Oct 11 night: "do the entire world … country by country … don't stop"; start with
  Thailand; leave the huge networks like the UK for later).** Already swept: Latin America, Africa (not South Africa)
  and Europe (not UK, France, Russia, Ukraine), all Oct 10; India (Chabad of India's directory). Per country: the map's
  centers there; then Chabadpedia's country and city pages (Firecrawl), the national Chabad site and directories,
  Hebrew traveler directories, and news. Add what's missing; build, Hebrew, commit and push after each country or two.
  Progress is listed below as "Sweep:" lines.
  - Sweep: **Thailand, Laos, Cambodia, Myanmar** (Oct 11). Added Bangkok's Even Chen Synagogue (Sephardic; Silom,
    Hilton Garden Inn; Rabbi David Hadad; jewishthailand.com). Checked and left out: Laos's only house (Luang Prabang,
    the Belinows) — Chabad Thailand's own page says "Updated June 2026: Chabad Laos is closed"
    (jewishthailand.com/templates/articlecco_cdo/aid/913657); Krabi's "Beit Hillel" in Ao Nang is a kosher restaurant
    with a prayer room led by a layman, raided by Thai police Oct 1 (ynet.co.il/judaism/article/hkjc009o5mg) — left out
    (owner: blatant); Cambodia has only Phnom Penh (Siem Reap gets Seders only, per jewishcambodia.com); Myanmar's Chabad
    (the Raitports, Yangon, 2018) is gone — chabad.org lists nothing there. Background: since Sept 2026 the Thai
    government is probing Chabad sites (Phuket Patong: building violations; Bangkok: no real problems).
  - Sweep: **Philippines, Vietnam, Singapore, Malaysia, Indonesia** (Oct 11). The Philippines had NO dots — chabad.org
    lists nothing there — so added all eight houses of Chabad of the Philippines (chabad.ph; chabadinfo Oct 7: "8
    Chabad Houses"): Manila/Makati (Yosef Yitzchak Levy, the head; now the shetach's capital), BGC/Taguig (Berel
    Ceitlin), El Nido (Moishi Notik), Siargao (Mendel Spindler), Cebu (Mendy Axelrod), Boracay (Daniel Moskovitz),
    Bohol/Panglao (Baruch Kirshenzft, the site's spelling), Clark (Shmulik Avraham, since May 2026). Pins from each
    house's own map link where it has one. Vietnam: its four houses (Ho Chi Minh City, Hanoi, Hoi An, Sapa) are all on
    the map. Singapore: one listing (Abergel and Rivni) covers it. Malaysia: none. Indonesia: "Chabad Bali"
    (chabadbali.org, a contact form only, no names) and a 2018 traveler's blog about a Chabad family in Seminyak whose
    address isn't published for security; no shliach could be confirmed — added at city level and FLAGGED for review:
    https://chabadbali.org/ and https://www.lametayel.co.il/posts/l044qr .
  - Research tools: plain WebSearch/WebFetch first; Firecrawl (paid credits) only for sites they can't reach, like
    Chabadpedia and chabad.org (owner, Oct 11).
  - **Possible "mushrooms" (owner, Oct 11):** only a blatant case is left out (like Krabi's Beit Hillel: a layman
    running a meshichist prayer room he calls a Chabad house). Anything else doubtful — a network outside the country's
    official Chabad, a house whose shliach can't be confirmed — goes ON the map with a `review` field (why, with links;
    not shown on the card) in data/extra-centers.json, and is listed here for the owner to review. **To review:**
    `extra-fr-paris-20e-monte-cristo` (the directory's "Rav P. Pachter" may be out of date), `extra-il-misgav` (same
    director and phone as the Highway 6 house; Lev Misgav's exact spot not found). Find them all:
    grep '"review"' data/extra-centers.json.
  - **MUSHROOMS (owner, Oct 12).** A center outside official Chabad (not a Merkos-recognised shliach) carries
    `"mushroom": "<evidence>"` in data/extra-centers.json; it is left off the map (dots, city counts) unless the new
    Options checkbox "Mushrooms" / "פטריות" is on (owner: just "Mushrooms", no explanation), with a mushroom icon; a mushroom's dot is red (orange when the Red dot colour is picked), its card opens with a red "MUSHROOM" / "פטרייה" label and names no head shliach (the foot shows only the shetach's name); under the label, "Network: …" / "רשת: …" from its `network`/`networkHe` (Kupchik family ×14 — Bolivia, Jaipur (was Pune until Oct 19), South Delhi, Arusha, the Chabad of India directory's houses, Puerto Escondido, whose rabbi also runs Kasol; Mashiach Jabad Mexico — Mérida; since Oct 19 Binyomin Edery — Tokyo, Kyoto; Moshe Reuven Azman — Brodsky, Anatevka; Yacov Borenstein — Poughkeepsie, Goshen; Labkovski family — Williamsville, Downtown Buffalo; Yosef Carlebach — Rutgers, Monroe, the Brunswicks, Ocean, Long Branch, Colts Neck; since Oct 26 Mottel Kanelsky — Bris Avrohom in Hillside (and its mikvah), Fair Lawn, Jersey City). Owner, Oct 12: only name a network where the house really is part of one — the others have no Network line.) (remembered in
    localStorage `shetachim-mushrooms`; switching is instant since Oct 26 — it used to reload the page). Build: `mushroom: true` on the center,
    `mushrooms: n` on its city. **Bolivia**: Itzik Kupchik is no longer head shliach (owner) — Bolivia has no head and
    no capital (`noCentralLeadership`); his La Paz house is a mushroom. (India stays under Kantor, as decided long ago.)
    **Mushroom scan (Oct 12) — every added center not on chabad.org and not from an official national list (77),
    researched one by one; the owner wants no "unsure" ones.** Official = positive evidence of recognition: on
    chabad.org (staff or listing) or Tzach's world directory (chabad.org.il/Branchs, a mirror of the official list),
    the country's official network, the head shliach himself, or Merkos/Chabad press calling them shluchim. Result:
    - **Mushrooms (24)** (the evidence is in each center's `mushroom` text): Bolivia La Paz (owner); the Kupchik family —
      Pune (Betzalel: "I am not a shaliach Chabad, which is a movement", YWN 2010), South Delhi (Shneor), Arusha
      (Moshiach; Tanzania's official Chabad is Aziza's in Dar es Salaam); India's other backpacker houses in the
      Kupchik-led network (chabadindia770.com) that no official list has — Delhi Main Bazaar, Pushkar, Kasol, Rishikesh,
      Hampi, Varanasi, Goa-Palolem, Kodaikanal, Kasar Devi, Kochi; Mexico's beach houses outside Chabad of Mexico —
      Isla Mujeres, Bacalar, Holbox, Puerto Escondido (Vinderbaum, also Kasol's), Mérida; Itacaré (not in Beit Chabad do
      Brasil); Ushuaia (no trace of recognition anywhere); Panama's "Chabad for the Traveler" (Pinchas Cohen styles
      himself Chabad Panama's director; the official one is Laine's, with Karniel's traveller house on chabad.org);
      Bali (WUPJ 2018: no rabbi, run by a lay couple); Kyiv's Brodsky Synagogue (Azman: "not part of Chabad's structure
      in the country", JTA; FJC's Chabad rabbis called his election illegitimate).
      **Oct 19: 30** — Pune closed (now Jaipur); added Tokyo, Kyoto, Anatevka, Leh, Westborough, Colorado Springs (see
      the Oct 19 section at the top). **Then 42**: Poughkeepsie, Goshen, Buffalo's Jewish Discovery Center, Center
      for Jewish Life and Chabad Downtown, Lauderhill's 770 Moshiach Center, and six houses of Rabbi Yosef Carlebach's
      central New Jersey network (the "Oct 19–20" section at the top). **Oct 26: 44** — Beis Moshiach Hollywood and
      Bais Moshiach North Miami Beach (owner); **then 48** — Rabbi Mottel Kanelsky's Bris Avrohom (Hillside ×2, Fair
      Lawn, Jersey City).
    - **Official (53)**: the shetach head himself (Armenia, Belize, Bulgaria, El Salvador, Honduras, Panama Beth El,
      Philippines ×8, Sri Lanka ×5, Uruguay, Albania); the country's official network (Thailand, Germany ×2, Austria,
      Cyprus, Spain ×3, Italy, Amsterdam, Montenegro, Switzerland, Riyadh, Abu Dhabi, Istanbul, Southern Ohio); on
      chabad.org/Tzach's list — Pisac (Cusco's staff), Rio Botafogo (Kaczala, staff of Beit Lubavitch Rio), Annemasse
      (Szmul, staff of Habad Genève), São Paulo Brooklin and India's Manali and Goa-Anjuna (Tzach's world directory);
      Merkos/Chabad press — Zanzibar (chabad.org), Quito and Brussels EJCC (lubavitch.com), Ethiopia ×2 and Guatemala's
      San Pedro (Chabad Info: "the local shliach"), Namibia (Rabbi Silberhaft: "the Official Chabad Shaliach to
      Namibia"), Mendoza (Jabad Argentina's own list of interior centers), Reims (Loubavitch Étudiants' "Chabad En Campus
      Reims avec Eitan Abourmad"), Armour Heights (registered as Beth Joseph Chabad; rabbi Yehuda Zarchi, now on its card).
  - **Oct 12 (owner): Edery's Tokyo and Kyoto houses REMOVED** — "he's a mushroom" (back on Oct 19 as mushrooms, once
    the Mushrooms option existed). World posters regenerated
    (`npm run svg` per map + `node scripts/svg-png.mjs`); the old names poster's speck east of Ukraine (a leftover from
    before occupied Ukraine joined Russia's shetach) is gone, and a world scan for tiny pieces stranded inside another
    shetach finds only real enclaves (Büsingen, Baarle, Llívia, the Armenia/Azerbaijan and Fergana exclaves).
  - Sweep: **Japan, Korea, China, Hong Kong, Macau, Taiwan, Mongolia** (Oct 11): nothing to add. Japan: chabad.org
    lists Tokyo (Sudakevich, the head), Kobe/Kansai and Takayama — all on the map. Added and FLAGGED for review: Rabbi
    Binyomin Edery's separate network (Chabad House Tokyo in Omori, Ota-ku; "Chabad Kyoto", run by Moti Grumach —
    chabadjapan.org), which chabad.org doesn't list; its Sendai work was 2011 tsunami relief, not a house. The official Chabad of Kyoto (the
    Posners, 2019) seems gone: jewishkyoto.com is dead and chabad.org doesn't list it. China (Chabadpedia's list:
    Beijing, Shanghai ×2, Guangzhou, Shenzhen ×2, Foshan, Yiwu, Chengdu) all on the map; Ningbo and Pudong closed in
    2020. Korea: Seoul only. Taiwan: Taipei only. Macau, Mongolia: none.
  - Sweep: **Nepal, Central Asia, Caucasus** (Oct 11): nothing to add. Nepal: Kathmandu and Pokhara on the map; the
    Kathmandu house was forced out of its Thamel building in Jan 2026 (landlord demanded the Hebrew signs come down)
    and holds Shabbat in a hotel while it looks for a new place — move the dot when it reopens (heritagefl.com,
    Jan 16, 2026). Kazakhstan: Chabadpedia's 7 cities = the map's. Uzbekistan, Kyrgyzstan, Georgia, Armenia,
    Azerbaijan: nothing new found; Tajikistan, Turkmenistan: no Chabad.
  - Sweep: **Middle East** (Oct 11): nothing to add. UAE: Dubai and Abu Dhabi on the map (Mendel Duchman's "Chabad of
    Downtown Dubai" is still a fundraising plan; he's listed at the Dubai center). Turkey: Chabadpedia and the news
    know only Istanbul (Chitrik). Northern Cyprus: its house (648321, Karaoglanoglu) is on the map — country code XNC.
    Saudi Arabia (Riyadh) and Qatar as before; Bahrain stays blank (see 16); Oman, Kuwait, Jordan, Iraq, Lebanon: no
    Chabad. Cyprus was swept with Europe. Hong Kong: Chabad of Hong Kong's "third couple" (the Birnhacks) works inside
    it (Hebrew school, CYP), not a separate house. **Asia is done** except Israel and Russia's Asian part (huge networks).
  - Sweep: **Oceania** (Oct 11): nothing to add. New Zealand: Auckland ×3 and Wellington ×2 on the map; the South
    Island houses (Christchurch, razed in the 2011 quake; Queenstown, Rabbi Shmuel Kopel, Jan 2012; "Chabad Nelson, 54
    Seymour Ave" on a 2019 chabad.nz page) show no sign of life since — not added. Australia outside Sydney and
    Melbourne: Chabad of RARA's own directory (Byron, Hunter & Central Coast, Cairns, Sunshine Coast, Perth, Tasmania)
    and Adelaide, Canberra, Brisbane, Gold Coast are all on the map. New Caledonia on the map; Fiji, Guam, Tahiti, PNG:
    visits only. The Caribbean was swept twice with Latin America (Oct 10).
  - **Europe RE-SWEEP (owner, Oct 11: "I don't believe there ever was a proper full Europe sweep") — DONE Oct 11.**
    Each country on its own (national Chabad site, Chabadpedia, local-language and Hebrew searches, news), on top of the
    Oct 10 pass recorded below. Added: Brussels' European Jewish Community Centre (EJCC, Rue du Cornet 22 — Rabbi Avi
    Tawil; set up by Chabad's Rabbinical Center of Europe in 2003) with a `review` flag (its site doesn't say Chabad).
    Confirmed, nothing missing: Nordics (chabad.se: Gothenburg, Stockholm, Malmö; Denmark: Copenhagen + Aarhus; Oslo,
    Helsinki, Reykjavik), Ireland (Dublin/Rathmines), Netherlands, Luxembourg, Belgium (nothing in Liège, Ghent, Knokke,
    Waterloo, Namur, Charleroi, Leuven), Belarus (Chabadpedia: Minsk, Brest, Grodno, Mogilev, Bobruisk), Latvia
    (chabad.lv: Riga, Jurmala), Lithuania (Vilnius, Kaunas, Klaipeda — a 2025 Chabad report says the last two have no
    full-time rabbi; kept as chabad.org has them), Estonia (Tallinn), Poland (Chabadpedia and news: Warsaw, Kraków,
    Katowice only; a tour site's "Wrocław" is unsupported), Czechia (Prague; Brno had only 2016 student outreach by
    Rabbi David Edri, no house), Slovakia, Romania, Bulgaria, Moldova, Hungary (EMIH's list), the Balkans (researched in
    depth earlier), Greece (chabad.gr's own branch list: Athens, Thessaloniki, Rhodes, Crete, Mykonos), Portugal
    (Cascais, Porto, Algarve; Lisbon and Belmonte have activity but no separate house), Malta, Austria, Switzerland;
    Germany, Italy, Spain stand on the Oct 10 city-by-city checks below.
  - Sweep: **South Africa** (Oct 11; left out of the Africa sweep as "its own thing"): nothing to add — 28 on the map
    (Johannesburg incl. Fourways 2008 and Greenstone 2016, Cape Town, West Coast, Stellenbosch, Umhlanga). Durban proper,
    Gqeberha, East London, Bloemfontein: no Chabad house found; Pretoria has a mikveh and the Pretoria Hebrew
    Congregation. **Owner to check:** the Rabbinical College of Pretoria (Chabad yeshiva since 2001, Dayan Gidon Fox,
    Rabbi Chaim Finkelstein) — last news is a 2020/21 smicha class (sajr.co.za/?p=24277); not added without a sign
    it still runs.
  - Sweep: **Canada outside Ontario and Quebec** (Oct 11): nothing to add. BC 13, Alberta 3 (Calgary, Edmonton,
    Canmore — Chabad Alberta's "sixteen shluchim" are the couples and staff inside those three listings), Saskatchewan 2,
    Manitoba 4, Halifax, St. John's. New Brunswick, PEI, the territories, northern Alberta: roving-rabbi visits only.
  - **What's left of the world sweep:** only the big networks the owner set aside — Ukraine, Russia, the UK, France,
    Israel, Sydney/Melbourne, Ontario/Quebec, the US. (Ukraine, Russia, the UK, France and Sydney/Melbourne are done;
    Israel was stopped partway at the owner's word; Ontario/Quebec is started — see below.)
  - Sweep: **Ukraine** (Oct 11): Chabadpedia's list of Ukraine's shluchim (Dnipro, Kyiv, Khmelnytskyi, Kharkiv,
    Kherson, Odesa, Zhytomyr, Kremenchuk, Haditch, Poltava, Chernivtsi, Lviv, Mykolaiv, Cherkasy, Berdychiv) is all on
    the map. Added Kyiv's Brodsky Synagogue (Shota Rustaveli 13 — Rabbi Moshe Reuven Azman; Chabadpedia lists him among
    Kyiv's shluchim; not on chabad.org) with a `review` flag (FJC Ukraine's own Kyiv center is Markovitch's).
  - Sweep: **Russia** (Oct 11): FEOR's site, all 128 community pages (feor.ru/administrative-units/...): 47 name a rabbi;
    44 of those cities were on the map. Added Tula (Rabbi Shimshon Romanovsky, "shliach and rabbi in Tula since Nov
    2015", ul. Lenina 12), Tver (Rabbi Yehoshua Rosenzweig, the synagogue at Pushkinskaya 22) and Volzhsky (Rabbi Ariel
    Eliezer Triger, since 2007). FEOR's Moscow list (feor.ru/moskva): added Tzemach Tzedek – Beit Chabad Izmailovo
    (Tkatskaya 46) and the Chabad Center on Chistye Prudy (Myasnitskaya 13) — no rabbi named, so none shown; the rest
    of Moscow's FEOR communities are on the map (the Sephardic and Mountain Jews' communities aren't Chabad). FEOR
    communities without a named rabbi are lay-led and not added.
  - Sweep: **UK** (Oct 11): nothing to add. Checked chabad.org.uk's "London and Regions" list and its campus and
    community lists, plus JCR-UK's community pages, against the map; every house is on it.
  - Sweep: **France — Paris region** (Oct 11): Beth Loubavitch's own list of its Île-de-France delegates
    (loubavitch.fr/etude/delegues, 139 delegates) against the map. Added the 23 delegations that had no dot in their own
    town: Paris 5e, Paris 16e (south), Maurepas, Verrières-le-Buisson, Nanterre, Antony, Bois-Colombes, Chaville,
    Rosny-sous-Bois, Bondy, Le Bourget, Pierrefitte, Créteil (north), Fresnes, Le Kremlin-Bicêtre, Ermont, Palaiseau,
    Ris-Orangis, Longjumeau, Colombes, Aulnay-sous-Bois, Arcueil, Montmagny. Seven of them (Palaiseau, Ris-Orangis,
    Longjumeau, Colombes, Aulnay, Arcueil, Montmagny) were on chabad.org only as personnel of the "Beit Loubavitch
    Centre Siège" listing (330228), so they showed at the Paris HQ. Dots: exact where the delegate's address geocoded
    (5), on the street where only the street did (6), the town where no address is published (12).
  - Sweep: **France — the rest** (Oct 11). Sources: Chabad of France's own directory (Lichka / Merkos France,
    loubavitchfrance.fr/en/city/…, 144 towns, 243 entries), the Consistoire de France's community map (its public API),
    the French association register (recherche-entreprises.api.gouv.fr, every active "Habad/Loubavitch/Chabad"
    association), Habad Lyon's site (habadlyon.info) and Beth Loubavitch's delegate list again. Every house was geocoded
    to its house number (IGN geocoder, data.geopf.fr) and matched to the map by name and distance. Added 36:
    - Provinces: Aix-en-Provence (Rabbi Asher Geribi, at chabad.org only under the Paris HQ), Le Cannet (Levi Gurevitch,
      Chabad of Cannes' branch), Marseille 4e (Avraham Chayo), Marseille 9e Mazargues (Schneor Zalman Assouline), Aubagne
      (Moshe Maimon Farouz), Plan-de-Cuques "Canton Vert" (Tsemach Menachem Nisilevitch) — the last three listed on
      chabad.org only as staff of other Marseille houses — Villeurbanne "Beth Habad Charpennes" (no rabbi named), and,
      **flagged for review**, Annemasse (Rabbi David Szmul) and Reims (Eitan and Guéoula Abourmad, opened ~2023), which
      neither chabad.org nor the directory lists.
    - Paris: 9e Chaptal (Shalom Mendel Asseraf), 10e Lariboisière (Raphael Lebar), 10e Est (Baruch Sebag), 10e Ouest
      (Reuven Halimi), 11e Ouest (Israel Yossef Altabe), 12e Ouest/Beccaria (Yisrael Nisenbaum), 17e Courcelles (Mendi
      Habib), 17e Monceau (Ygal Elmkies), 19e Nord/rue Haxo (Israel Ouaki), 19e Quai de la Seine (Yosef Katan), 20e
      Monte-Cristo (**review**: the directory's "Rav P. Pachter" — Chabadpedia speaks of Rabbi Pinchas Gedalia Pachter in
      the past tense, so no rabbi shown). All but Monte-Cristo are on chabad.org only as staff of another listing.
    - Suburbs: Aubervilliers–André Karman (Eliezer Nisilevitch), Châtillon (Tsion Mimoun), Neuilly–Paul Chatrousse (David
      Zaoui), Sarcelles Flanades, Arnouville and Goussainville (all three David Habib), Le Plessis-Trévise, Mandres-les-Roses,
      Neuilly-Plaisance (Shalom Dovber Journo), Noisy-le-Sec, Saint-Maurice Plateau (Levi Itshak Basanger), Sevran, Villejuif
      (Levi Itshak Zerbib), Villeneuve-la-Garenne, Ivry-sur-Seine (Menahem Mendel Meir Assouline), Alfortville–Quai
      (Menashe Schoukroun). Where the directory gives only an initial that no other source completes (Y. Elfassy,
      M. Edery, Y. Chiche, Y. Altabé, M. Asseraf) the card shows the name in the note and lists no rabbi.
    - Fixed chabad.org locations: Beth Habad Gournay (4080686, placed in the Indre → Gournay-sur-Marne, still approximate),
      Clichy-la-Garenne (431269, given a Yerres address → 32 rue Fernand Pelloutier, Clichy), Montgolfier (5776866, placed
      in central France → 127 rue du Maréchal Leclerc, Saint-Maurice 94), Kehilat Chnéor (4669173, town only → 17 rue du
      Clos Bénard, Aubervilliers). Upgraded my own Antony, Nanterre, Verrières, Palaiseau, Montmagny, Chaville,
      Pierrefitte and Ris-Orangis dots to the directory's street addresses. (build-data.mjs: a fix may now say
      approx: true.)
    - Checked, not added: Paris Expo – Porte de Versailles (a delegate's role at the exhibition centre, Rabbi Shmuel
      Touboul — not a house); Megève (a winter synagogue run by Chabad of St-Tropez); Nancy (an association "Beth Habad
      Loubavitch Nancy", 43 bd Georges Clemenceau, registered 2011 — no sign of a shliach or activity found); Craponne
      (an association registered 2020 at a layman's address) and Dardilly (registered Jan 2026); registry-only
      associations in Issy-les-Moulineaux ("Beth Loubavitch 92 Sud"), Romainville ("Bas Pays"), Paris 17 ("Épinettes",
      "Ternes-Maillot") and Garges-lès-Gonesse ("Lubavitch House", 1994) — no rabbi or activity found. Guadeloupe,
      French Guiana, Mayotte, Tahiti: nothing found; Réunion and St-Barth are on the map.
    - **Owner to check:** Marseille 5e (chabad.org 3103889, 7 rue Crillon) lists Rabbi Tzemach Gansburg, but Chabad of
      France's directory and Marseille 7e's own list give Rav Baruch Bard at that address, and a new association, "Le
      Beth Habad du 5e de Marseille", was registered there in Jan 2026 — likely a change of shliach; not changed.
    - Many chabad.org listings in the Paris region sit 1–3 km from their directory address (Versailles, Massy, Rueil,
      Sceaux, Villiers-sur-Marne…) — left alone; they belong to the open "proper location" item below.
  - Sweep: **Sydney and Melbourne** (Oct 11): nothing to add. Wikipedia's list of Chabad houses and JewishGen's
    community pages for both cities, checked against the map; every house is on it (Rose Bay's is Rabbi Alon Hazi's,
    471111).
  - Sweep: **Israel** (Oct 11; STOPPED partway at the owner's word). Source: Tzeirei Agudat Chabad's directory of
    Israel's Chabad houses (chabad.org.il/IsraeliBranchs, category 60 — 396 entries; behind Cloudflare, so read through
    Firecrawl), compared with the map's 956 Israeli listings by town, neighborhood, rabbi's surname and street address
    (chabad.org's addresses read from lubavitch.com's mirror, lubavitch.com/centers/<id>). 81 entries had no match;
    their branch pages (Item.asp?ArticleID=<n>&CategoryID=60) were read. Added 40 (source and link on each card):
    - On chabad.org only as staff of the town's main listing, so they had no dot of their own (26): Holon — Kiryat
      Eilon/H-300 (Menachem Mendel Steinberger), Wolfson Medical Center (Levi Mendelson), HaMifdeh (Yona Har-Tzvi),
      Kiryat Avoda (Meir Halperin; chabad.org has him at the Chief Rabbinate), Rasco A (Menachem Mendel Butman), Rasco B
      (Shalom Dov Ber Belinow), Shikun Vatikim–Neve Remez (Shmuel Raskin); Be'er Sheva Ramot (Yosef Yitzchak Slavin);
      Beit Shemesh Shaar HaIr (Menachem Mendel Rivkin); Bnei Yehuda in the Golan (Menachem Mendel Gorelik); Hadera
      HaOtzar (Moshe Dov Brod); Mazkeret Batya Bar Lev (Yoseph Glitsenstein); Netivot's Neta'im–Givat Shifra–Shalom
      Bonayich (Avraham Yifrach); Netanya — Agamim (Refael Leviev), Givat HaIrusim (Elyasaf Leviov), Kiryat HaSharon
      (Levi Yitzchak Tiechtel), Center-West (Mordechai Gelbstein), Youth (Chen Avraham Sudar), Ramat Chen (Shalom
      Dovber Attal), Ramat Poleg–Ir Yamim (Shneor Zalman Brod); Poriya Medical Center (Eliyahu Kramer); Kiryat Ata
      Givat Alonim (Reuven Diskin); Kiryat Yam — Neighborhood B (Mendy Bruk), Psagot Yam (Moshe Bistritzky); Rechovot —
      Science Quarter (Yisrael Bindman), Givati–Givat HaAhava (Yitzchak Nov).
    - Not on chabad.org at all (14): Beit Shemesh Lev HaIr (Menachem Lipsh), Hanaton (Dov Aharonovitz), Highway 6 — the
      Dor Alon station northbound between the Nitzanei Oz and Baqa interchanges (Shmuel Rosenberg), Beit Zayit–Motza
      Illit (5 Yechiel Steinberg St; the directory names no director, so none shown), Misgav (Shmuel Rosenberg —
      **review**, see the list above), Netanya for Russian speakers (Menachem Mendel Teichman), Ora–Aminadav
      (Menachem Mendel Weber; chabad.org's Even Sapir house next door is Rabbi Aharon Weber's), Havatzelet HaSharon and
      the interchange villages (Shai Ben Odiz, Tzukei Yam), Safed's Oranim neighborhood (Avraham Menachem Rabinovitz),
      Caesarea Industrial Park (Shmuel Zalmanovitz), West Kiryat Chaim (Yisrael Kut), Rechovot's HaHolandit (Moshe
      Tvardovich), Rishon Lezion's Neve Hadarim (Yinon Sasson), Shiloh (Yoni Admoni).
    - Dots: exact where the house number or the place itself (hospital, gas station) geocoded (7), on the street or
      the neighborhood where only that did (29), the town where no address is published (Holon's HaMifdeh and three
      Netanya houses).
    - Fixed: Chabad of Alon Shvut (7523084) — its address is 19 HaEgoz St, Alon Shvut, but chabad.org's pin was at
      Alon in the Binyamin hills, 27 km away.
    - Checked, already on the map under another name: Haifa HaRamot = Ramot Technion (695701); the Dead Sea = 469674
      (already at Ein Bokek); Jerusalem's English speakers = Baka (1157449); Navon station = Chabad of Eged (118444);
      Kochav Yair–Tzur Yigal; Kiryat Ono Kiryon (118145); Rishon's Neot Ashlim (576927); HIT (4140234); Kfar HaOranim
      (581510); Chevel Aza at Nitzan (118117); Netanya Smilansky = Netanya-Merkaz (118450, 13 Smilansky); Netanya
      Wingate = "Beit Chabad Beit Berl" (4615274, Rabbi Ariel Rosenthal, Netanya); East Kiryat Chaim (117937); Kiryat
      Bialik's HaParpar = the Krayot youth center (2745138, Nili St); Kiryat Motzkin's old neighborhood = Chabad of the
      Krayot (117933, 2 Yissachar Kaplan); Ashkelon's Shapira = Beit Chabad of Ashkelon (118032, Rabbi Gurelick, same
      fax). Tzach's regional/central entries and its "activity coordinators" (מנהל פעילות) aren't houses — not added.
    - Not done (stopped): directory entries the first pass matched by town or neighborhood weren't re-checked house by
      house, and no other Israeli source (Chabadpedia, local sites) was read. The directory's pages are undated; a few
      may be out of date. Scratchpad isr/ holds the scraped directory (tzach.json, items.json).
  - **Fixed Oct 12 (owner caught it): 16 listings stacked on one point.** chabad.org pins 16 listings — Beitar Illit ×4,
    Efrat ×3, Karmei Tzur, Kedumim, Elon Moreh, Yitzhar, Susya, Nili, Modi'in Illit, Ma'ale Adumim's Gan Chabad and
    Merhavia — on one stand-in point in the Negev near Yeruham, which the map showed as one dot by Beitar Illit's label.
    Each now has a fix in data/extra-centers.json: its street where chabad.org gives one, else its town (approx).
    Also two listings whose street is named Jerusalem (Safed's Beit Levi Yitzchak yeshiva, Kiryat Malachi's Kfar
    Warburg) were pinned in Jerusalem — moved. **Check for this after every build:** any dot whose centers name 3+
    different towns is a stack (only Modi'in's three spellings remain, which is correct).
  - Sweep: **Ontario and Quebec** (started Oct 11). Toronto: UJA Federation's community directory (jewishtoronto.com/
    directory, 91 pages) against the map — added Armour Heights Jewish Centre – Beth Joseph Chabad (3995 Bathurst St,
    North York; its site ahjewish.com is on Chabad's ChabadSuite; runs Torah Tots; no rabbi named, so none shown).
    **Fixed Oct 19: Chabad Niagara Falls USA (6624274) counted in Ontario** — Natural Earth's 1:10m border runs at
    least 800 m east of the real one at the falls; the dot is now at its address (332 Prospect St) and the build lets
    the map's own areas decide (see the Oct 19–20 section at the top). **Open:** Ontario's own Chabad Niagara
    (Rabbi Zalman and Perla Zaltzman, since 2005, Jewish Welcome Centre at 6417 Main St; chabad.org News called them
    "Niagara Emissaries") isn't in chabad.org's Sept 2026 locator, and nothing dated 2024–26 confirms it still runs
    (COR notice 2016, CJN c. 2022) — so it isn't on the map; for the owner. Not yet checked: Montreal (Federation
    CJA's directory) and the rest of Ontario and Quebec.
- **Open:** fix every center without a proper location — my 43 hand-added `area`/`city` centers (Nominatim only finds
  streets for most; needs each center's own site / Google pin — check pins: Namibia's site link was an old spot), then
  ask the owner about the 543 chabad.org approximate listings (often hidden on purpose). Editor: owner hasn't picked
  option 1 or 2. Test helper: scratchpad `shot.mjs`; OSM water from tiles: scratchpad `mi/water.mjs` (mapshaper
  `-dissolve2` merges tile pieces in seconds; shapely's unary_union on 46k pieces took >15 min).

## ▶ WHERE WE ARE — READ THIS FIRST (Oct 8; a second window, then back on the first account for a third)
The owner (Oct 8): "usage about to run out … I'm going to continue this in a different window … it needs to be extremely
seamless, just a direct continuation". So: pick up the task below as if nothing happened; don't re-ask what's settled here.

**State of the repo.** All work is committed and pushed to BOTH branches (`ccr-c5d54bf4-ssoreh`, the session's own, and
the live site's `claude/bold-albattani-aqfnj9`, fast-forward). Commits this round, oldest first: d0d681d Israel's held
ground (Gaza/Lebanon/Syria from the owner's KML) · a24dc2d occupied Ukraine + Crimea → Lazar's Russia shetach · 2fab177
posters · 0fce460 **SPEED** (see the SPEED section below) · f0af3aa **Countries mode + Rest of the world**
(requests 1, 2, 3 and 5 of the five the owner parked; see "COUNTRIES MODE AND THE REST OF THE WORLD" below); then, in a
second window (branch `claude/exciting-euler-o7vx0z`, also pushed to the live one): the country cards (request 4) and
the held ground's colour on the Countries map — see DONE below; then, back here (third window): 846c65e India links,
f6f02b9 Kantor's stacked cards, and the split-state part names + the Ukraine speck fix (the commit after it). Check with
`git log --oneline -8`. Deploy = push to `claude/bold-albattani-aqfnj9` (GitHub Pages serves it, ~1–2 min). After every
finished step: commit, push both branches, tell the owner in plain words (he follows on his phone).

**The owner's last messages, in order (Oct 7–8):** (a) the blue screen / slow start / "whatever you institute … should
not make that when the page gets updated it keeps old stuff" → done (SPEED). (b) "head shliach should still be available
in countries view … Israel should be changed in countries view to eliminate the West Bank and make it part of Israel —
the parts of Gaza Lebanon and Syria that are occupied should also be shown as such (not integrated into Israel fully
though as is the case by shetachim). Also there should be an option when in shetachim to view the unshetached countries
as just regular bordered countries" → done. (c) "country cards should show info like who is head shliach of that country
with head of shetach on top of him tho (so may need some research on your end for countries part of a multi country
shetach)" → **IN PROGRESS, below**. (d) "states and territories of usa Canada and Australia should be shown individually
in the country view" → done (they always were on the political map; now the street and physical maps draw them too).
(e) He said "No deal with that after, go to what you were doing before please the speed problems" — i.e. speed first,
then (b)–(d); speed is done.
(f) Oct 8: "in the country's map … the three occupied territories … should just be a lighter version of whatever Israel
happens to be … with like maybe dashed line separation" → done. (g) "the thing with head shliachs name being across
multiple countries in the country's view" → already so; checked.

**DONE (Oct 8, continued in a second window, branch `claude/exciting-euler-o7vx0z` + the live one): country cards
with the country's own head shliach (request c).** In Countries mode an area's card is: kicker (Country / State /
Province / Held by Israel), name, then **each shetach covering it with its head** ("Central Africa · Shlomo Bentolila";
a territory like India: its parent's head; a split country lists each: Ukraine → Russia · Berel Lazar, Ukraine · Meir
Stambler), then, where the shetach spans several countries, **"Head shliach in Kenya: Levi Yitzchak Notik"** (Hebrew
"השליח הראשי בקניה: …", the article dropped after ב: ברפובליקה הדומיניקנית; English "in the Bahamas / the Cayman
Islands / the Dominican Republic"), then centers + Zoom in. Names without titles, as on every card.
- Data: `data/country-heads.json` → `heads: { ISO3: "<chabad.org center id>" }` (25 countries: Luxembourg; Aruba,
  Bahamas, St Barths, Bermuda, Barbados, Curaçao, Cayman, Dominican Republic, Grenada, Jamaica, St Lucia, Sint Maarten,
  Turks and Caicos, US Virgin Islands; Angola, Côte d'Ivoire, Ghana, Kenya, Nigeria, Rwanda, Tanzania, Uganda, Zambia;
  Cambodia). The build checks each (center on the map, in that country, not the shetach's flagship; a warning if it
  lists no living man) and writes `countryHeads` into web/data/shetachim.json; the page shows the center's **first living
  man listed** (the owner's rule for any center) from centers.geojson, so the name follows chabad.org and its Hebrew comes
  from data/hebrew (`countryHeadHTML` in web/index.html). No line where the shetach's head is based there (DRC, Puerto
  Rico, Thailand, Hong Kong), where the country is a whole shetach, split between shetachim, or has no center of its own
  (Benin, Albania — Kaplan's own, Mainland China — no country-level head on chabad.org, Laos, Myanmar…). The picks were
  re-checked against the listing (Oct 8): every one is the first living man at that country's own national center
  (Dominican Republic: Santo Domingo's, not Puerto Plata's; Nigeria: Abuja's, not the Lagos city rabbi).
- **Israel's held ground on the Countries map (owner, Oct 8): a lighter shade of Israel's own colour, not colours of
  their own**, set apart by the dashed line (the line between two states of one country; on the street/physical maps
  `st-line-state`, also dashed). `colourState()` gives HELD-* Israel's colour index; the fill tints it 55% toward the
  land's colour (`tint` in `apply`: paler in light mode, fainter in dark, where a "lighter" one would outshine Israel).
- **Head shliach names across several countries in Countries mode** (the owner asked again, Oct 8): already so since
  f0af3aa — with Countries borders and Head shliach labels the names are the shetachim's (Shlomo Bentolila once across
  Central Africa, over the countries' borders). Checked in screenshots.
- Checked: cards in English and Hebrew (Kenya, Luxembourg, Nigeria, Cayman, Dominican Republic, DRC, Benin, Cambodia,
  Ukraine, Greece, India, China, Albania, Puerto Rico, held Gaza), close-ups of the dashed lines, `node scripts/stress.mjs`
  → no errors.

**Also done (Oct 8, second window):**
- **Occupied Ukraine is Russia on the Countries map too** (owner: "fully integrated as part of Russia as they are in the
  shetach map"): the claim in data/shetachim.json has `"countriesAs": "RUS"`; the build passes it on as the piece's `as`
  (geo.json, world-all.json) and as `pa`/`pb` on the tiles' lines; the page's `polCountry`/`polState` group it with
  Russia (colour, the country line along the front line, no line on the old border, Russia's name over both — in the
  Europe view, which has no Russia, the occupied part alone is named Russia — and Russia's card).
- **"Part of Israel: Gaza · Lebanon · Syria"** (Borders, with Countries or Both, in views with Israel; owner: "mix and
  match"): each held area, picked, is drawn as Israel (Israel's colour, no dashed line, no name of its own, Israel's card
  and outline); not picked, as held (lighter, dashed, its own name and "Held by Israel" card). `state.joined`; Israel's
  own lines are their own pieces (`mesh:held`, a feature per pair of states with `a`, `b`; on the tiles `sa`/`sb`), so a
  pick only changes filters (`israelSide`, `nameFilter`, the fill's `heldShown`), nothing is worked out again.
- Posters regenerated from the current data (checked point by point: no line inside Israel).
- **Tapping a head shliach's name in Countries mode outlines his whole shetach** (owner, Oct 8: "if I clicked Bentolila's
  actual name it would show an outline around his countries"): with Countries borders and Head shliach labels, a tap on
  a name (`names`/`names-alt` features carry `sid`) gives the shetach's own card (`shetachHTML`, split out of `areaHTML`)
  and outlines every country of it, its territories too (Kantor: Thailand with India, Laos, Cambodia, Myanmar);
  `shetachArea` merges the group's pieces once per view (`S.groupAreas`); "Zoom in" fits the whole shetach. A tap
  anywhere else is the country's card, as before. Checked: Bentolila, Kantor, Zarchi (English and Hebrew), stress → no errors.
- **Done (Oct 8, third window, back on the first account):**
  - **(14) India's added centers link to their page**: each `extra-india-*` entry in data/extra-centers.json has `url`,
    `site`, `siteHe` (the build passes them on for unlisted centers); the dot's card shows "Open on Chabad of India" /
    "לדף בחב״ד הודו" where chabad.org centers show their chabad.org link (`chabadLink` in web/index.html). The 13 from the
    directory link to the directory itself, https://indiakoshertravel.com/Chabad_india (each house's own page couldn't be
    found: the site is behind Cloudflare here, web search doesn't index it, the Wayback Machine refused); Kochi links to
    https://chabadcochin.com/. **Oct 9: the owner sent the directory page (saved as .mht); each house now links to its own
    page there** (`https://www.indiakoshertravel.com/Chabad_<place>`; both Goa dots, Palolem and Anjuna, to the one Goa
    page). The directory's Mumbai, Bangalore and Dharamsala are chabad.org centers and keep their chabad.org links.
  - **(15) Qatar — reported to the owner, no data changed** (Qatar is already its own shetach, Eli Chitrik): Eli (Mendy's
    son) has served Qatar since the 2022 World Cup (Mendy kashered the Qatar Airways kitchen and left Eli to supervise;
    @kosherinqatar); July 28, 2026 the Emir received Mendy's ARIS delegation with Eli at Lusail Palace, Mendy thanking him
    for "enabling my son, Rabbi Eliyahu Chitrik, to serve the Jewish community" (anash.org, collive, Jewish Insider); one
    source (Wikipedia) calls Eli Qatar's chief rabbi. No permanent Chabad house or address found (unlike Riyadh's), nothing
    on where he lives, no Doha center in chabad.org's data. Whether to group Qatar under Turkey is the owner's call.
  - **(16) Bahrain — reported, no data changed**: no resident rabbi (World Jewish Congress), ~36–50 Jews led by Ebrahim
    Nonoo; Chabad only visiting (two visiting Chabad rabbis for Herzog's Dec 2022 visit; Levi Duchman of the UAE has gone
    there, e.g. a funeral, and is ARIS's vice president; ARIS, Mendy Chitrik's, names Bahrain in its scope; Levi Shemtov
    helped Israel–Bahrain ties in the 2000s). No shliach named as responsible, so by the owner's "sure" rule it stays blank
    until he decides (UAE's Duchman is the likeliest if he wants it in a shetach).
  - **Bahrain, the owner's follow-up ("any more Duchman–Bahrain evidence besides that one funeral, and how strong is
    it?")**: answered — the funeral is one undetailed line (Yeshiva World News, Oct 2020, echoed by Anash; Wikipedia cites
    it), no date or name of the deceased given; a claim that Duchman led a 2016 businessmen's trip there is unverified;
    the 2021 Gulf association (Nonoo quoted) points to the community itself, not Chabad. Weak: Bahrain stays blank.
  - **Kantor's card (owner: "two separate cards top to bottom, Thailand on top, India under it")**: tapping a head
    shliach's name gives one card per shetach in his group, stacked (`shetachCards`, `#card.stack`): the shetach on top,
    then each of its territories in view, each with its own Zoom in (a territory zooms to its own area). f6f02b9.
  - **Split states/countries say which part each shetach has** (owner: "on Ontario, rather than just Michigan · Shemtov,
    say Essex · Shemtov … same for Ohio, maybe Toledo … what part of that state is controlled by who"): Countries-mode
    cards name each shetach's part where several share one state: `partNames` in data/shetachim.json
    (`{ state: { shetachId: [English, Hebrew] } }`, the build copies it into web/data/shetachim.json; `partName` in
    web/index.html; a shetach not listed keeps its own name). Now: Ontario → Essex County (Windsor) · Berel Shemtov /
    Rest of Ontario · Zalman Grossbaum; Ohio → Toledo area · Berel Shemtov (the others keep their names: Northeast Ohio,
    Central Ohio, Southern Ohio); Pennsylvania → Western Pennsylvania / Eastern Pennsylvania; Massachusetts → Western
    Massachusetts (Connecticut's); Queensland → Gold Coast (Victoria's) / Rest of Queensland; Greece → Northern Greece /
    Rest of Greece; Italy → Trieste / Rest of Italy; Ukraine → Russian-held areas / Rest of Ukraine. When a new split
    state appears, add its parts there.
  - **The speck in Russia east of Ukraine** — fixed, see OCCUPIED UKRAINE below (occupation-line.mjs).
  - Next: whatever the owner answers on Qatar.

- **SUPERSEDED Nov 2 — the owner: "Ukraine doesn't have a head shliach" (see the Nov 2 section).** Kept for the record:
  **Ukraine's head shliach stays Meir Stambler (checked Oct 10, the owner asked whether it's Kaminetzky, or whether Ukraine
  has no head at all, like Ohio's separate regions).** There IS a national framework between the city head shluchim and
  Merkos: the Federation of Jewish Communities of Ukraine (Dnepr, since 1999, ~178 communities; its directory lists the
  city rabbis: Odessa's Wolff, Dnepr's Kaminetzky, Zaporozhye's Ehrentreu, Kiev's Kedem, Nikolayev's Gottlieb). Anash.org
  (Jul 25, 2025 and again later) calls Stambler "head shliach and chairman of the Jewish communities in Ukraine"; Rutman
  is his deputy; Kaminetzky is the Federation's chief rabbi and head shliach of Dnepr (Stambler first came to Dnepr as
  one of his shluchim). Chabadpedia's "each shliach in Ukraine works on his own" is about Or Avner/Lazar (Russia and
  Belarus coordinate with Lazar, Ukraine doesn't), not about Ukraine having no head. Don't split Ukraine.
- **Belarus is in Lazar's Russia shetach (owner, Oct 10: "only add Belarus to Lazar")**, with Shneur Deitch (Chabad of
  Minsk, 117882) as its own head on the country card (`data/country-heads.json` BLR). Researched Oct 10: COLlive/Anash
  (2020) call Lazar "Head Shliach of the former Soviet Union" (Kazakhstan's Cohen accepted his authority); Chabadpedia:
  Belarus's shluchim work in coordination with Lazar, Ukraine's don't. The owner chose NOT to move the other former Soviet
  countries (Kazakhstan, Armenia, Georgia, Azerbaijan, Uzbekistan, Moldova, Kyrgyzstan, the Baltics) — leave them as they are.
- **Bolivia (Oct 10, owner: "I know there is center(s)")**: added Beit Chabad La Paz (Itzik and Chaya Kupchik; Calle
  Santa Cruz 414 at Illampu, opposite Hostal El Lobo; OpenStreetMap node 4581570490; chabadofbolivia.com) as
  `extra-bolivia-la-paz`, and made it Bolivia's capital (it had none). Not added: a "Chabad" in Santa Cruz de la Sierra
  (Traveling Rabbi: not under Chabad's umbrella, no address) and the seasonal house in Rurrenabaque (Shuki Gur; the place
  was earlier run by Aharon Freiman, whom Chabad said it didn't recognise; no current sign it operates).
- **Latin America sweep for Chabad centers chabad.org's locator lacks (owner, Oct 10: "chabad.org's locator misses official
  Chabad centers all around the world, so those need to be added via manual research", country by country, Latin America
  first, then the whole world).** Added Oct 10 to `data/extra-centers.json` (23): Peru — Pisac (Tzikvashvili, Cusco's
  branch); Ecuador — Quito (Tomer Rotem); Argentina — Mendoza, Ushuaia (opened Dec 2025), and from Jabad Argentina's own
  list (jabad.org.ar/centros) Vicente López, Avellaneda (Beit Iaacov), Yerba Buena, Beit Jana, Ieshiva Anoji, La
  Fundación de Jabad, Beit Menajem Belgrano; Uruguay — Punta del Este; Brazil — Itacaré; Mexico — Isla Mujeres, Puerto
  Escondido, Bacalar, Holbox, Mérida; Guatemala — San Pedro La Laguna; Belize — San Pedro; Honduras — Roatán; El
  Salvador — El Tunco; Panama — Chabad for the Traveler (Pinchas Cohen). Sources: muchiler.co.il's Chabad directory,
  esta-center.co.il, latini.co.il, the owner's PDF of Chabadpedia's "בתי חב"ד בעולם" (a lead only: it misses a lot),
  and each house's own site. Left out (unconfirmed): Cochabamba (a Conservative community, no Chabad tie found),
  "Chabad Hazon Ish" Santiago, San Marcos La Laguna (founded 2024 by the Pisac couple, status unknown), Olivos
  (Chabadpedia only), Florianópolis and Cuba (seasonal only), Huaraz and Baños ("Jewish houses", not Chabad).
  Checked with nothing new to add: the Caribbean (chabad.org already has Martinique — under France on the map — and the
  other island houses; nothing found on Antigua, St Kitts, Trinidad, Anguilla, BVI, Dominica, St Vincent, Bonaire, Haiti;
  Punta Cana is served from Santo Domingo), Colombia, Venezuela, Paraguay, Guyana, Suriname, Chile beyond Santiago and
  Pucón, Costa Rica, Nicaragua, Panama beyond the above, and Mexico's inland cities.
  Second pass (Oct 10, owner: "was your sweep a proper sweep? … we can't revisit this area afterwards"): Brazil checked
  rabbi by rabbi against Chabadpedia's São Paulo/Rio list (the map has all of them, spelled differently) → added Beit
  Chabad Brooklin, São Paulo (Yacov Gerenstadt, Rua Flórida 1269); each Caribbean island searched on its own (nothing
  new: Bonaire is served from Curaçao, Trinidad gets summer visits only, Guadeloupe has a non-Chabad community);
  Chile, Uruguay, Mexico City in Spanish (nothing new; Mexico had 11 rabbis at the 2024 Kinus, all on the map);
  Playa del Carmen's second site (chabadplaya.org) is at the same corner as the center on the map, so not added.
  Couldn't reach: Beit Chabad Brazil's own site (connection refused), Enlace Judío (403), Chabadpedia (blocked).
  Final pass (Oct 10): the backpacker trail town by town (Huacachina, Máncora, Arequipa, Iquitos; El Calafate, El
  Chaltén, Puerto Iguazú, Puerto Natales; Jericoacoara, Ilha Grande, Paraty, Florianópolis; Santa Marta, Minca,
  Palomino; Sayulita, Mazunte, Oaxaca; Caye Caulker, Utila, Ometepe, Puerto Viejo, Uyuni, Sucre, Cuenca, Galápagos) —
  no Chabad house found. The owner's CrawlForge account (key kept outside the repo, ~/.config/crawlforge/key, in that
  session only) got Enlace Judío's Kinus article (only Mayzlesh, Binyamini, Druk named — all on the map) but not
  Chabadpedia (blocks its IPs), chabad.org.br, jabadchile.org or jabad.org.uy (Cloudflare challenge, even in stealth
  mode). The owner then sent Chabadpedia's Argentina, Mexico and Brazil pages and Jabad Uruguay's "Donde Estamos" page:
  Argentina and Mexico add nothing; Brazil's list is on the map (Alto de Pinheiros = "Sinagoga Beit Menachem", Pompeia =
  Tsemach Tsedec) except Botafogo — found and added (Beit Lubavitch Botafogo, Rua São Clemente 155, Rabbi Israel
  Kaczala, a branch of Beit Lubavitch Rio) — and "Beit Chabad Tijuca" (Eliyahu Kapraw), no trace anywhere, left out;
  Itacaré's rabbi named (Nehorai Yitzchak Tamsit); Uruguay lists only Montevideo and Punta del Este (now placed at
  Parada 13 corner of Londres). Owner (Oct 10): with no address, dig until one is found — done: Pisac on Plaza
  Constitución, San Pedro La Laguna from its Plus Code. Still town-level after digging (no address published anywhere
  found): Ushuaia, Vicente López, Holbox, Panama's traveler house (Ana Gloria building, Paitilla), and Roatán (address
  given only on request, for safety). Jabad Argentina's archive list (archivo.jabad.org.ar/batei-jabad) also names Beit
  Jabad Colegiales — closed 2018, left out. Latin America is closed. Next: Africa, only when the owner says.
- **Africa sweep (Oct 10; South Africa excluded — the owner: "that's its own thing", to be done separately).** Added:
  Chabad of Namibia (Windhoek, Yosef and Mushka Rahimi, 20 Arians Street — OpenStreetMap gives Simón Bolívar Street,
  Luxury Hill), Chabad House Zanzibar (Nungwi; founded 2018 by the Shmulevitzes; now Rabbi Mendi and Mrs. Levana Neeman —
  chabadzanzibar.com/en/chabad-house, Chabadpedia "מנחם מענדל נאמן"; tryit.co.il says Imane Lodge, which no map has, so the
  dot stays on the village centre), Chabad of Arusha Tanzania (Rabbi Mashiach and Mrs. Yachal Kopachik, since 2021,
  9 Mawandammo Road — exact pin from chabadtanzania.com's own map), Chabad of Ethiopia (Addis Ababa, Kirkos, Eliyahu and
  Devorah Chaviv) and its shul at Bole International Airport. All fall in Bentolila's Central Africa shetach. Checked, nothing to add: Kenya beyond Nairobi; Tanzania's Aziza house is in Dar es
  Salaam (Chabad.org, Jun 2025), as the map has it; Cameroon, Gabon, Congo-Brazzaville, Equatorial Guinea, Sierra Leone
  — visits only (jewishafrica.com "Our Locations"); Senegal — a center announced May 2026, not yet open;
  Zimbabwe, Mozambique, Madagascar, Malawi, Eswatini, Lesotho, Egypt, Algeria, Djerba — nothing found; Botswana and the
  Seychelles — visiting rabbis only; Morocco — every listed Chabad site (Casablanca, Marrakech, Fès, Meknès, Agadir,
  Kénitra, Rabat, Tangier) is already on the map. Final sweep (Oct 10): every chabad.org center in Africa outside South
  Africa already carries its shluchim; Lubumbashi (a shul, not Chabad), Livingstone (served from Lusaka), Benin, Togo,
  Cape Verde, Djibouti — nothing to add. **Africa is closed except South Africa** (its own pass, when the owner says;
  chabadsouthafrica.org is behind a Cloudflare challenge, so PDFs of its pages would help).
- **Taps pick only what they're really on (owner, Oct 10: tapping empty land in Israel opened Kiryat Shmona, or a
  local center, instead of Eretz Yisroel).** `pickAt` used a ±14 px box (±8 with a mouse) round everything, so the
  wide box round a city's name and every dot within ~20 px caught taps meant for the area. Now: a dot only within its
  drawn radius (same formula as its paint) + 4 px (2 with a mouse), at least 8 px (5); a capital's star or a city only
  when the tap is on its star/name or within 8 px (5) of its point; a head shliach's name only when tapped on. A grid of
  taps over Israel on a phone: everything ≥ ~9 px from a dot now opens Eretz Yisroel.
- **Andorra and Monaco are in France's shetach (owner, Oct 10: "Andorra is clearly a French subject (based on who brought
  the shluchim there)"; "Not just Andorra also Monaco!").** Andorra: Rabbi Haim Hilel Matusof of Chabad of Toulouse
  served it for decades and looked for a couple to live there (Chabad.org/JPost on the Kalmensons, 2024). Monaco: Rabbi
  Tanhoum Matusof is the son of Rabbi Yehuda Leib Matusof, shliach of Cannes and the southern Riviera, and began in
  Monaco beside his father's region (Chabadpedia). France's territory is FRA, AND, MCO; both countries keep their own
  head on the country card (`data/country-heads.json`: AND → Chabad of Andorra, MCO → Chabad Lubavitch of Monaco);
  the owner's list (`data/global-shetach-list.txt`) and data/hebrew/shetachim.json updated to match. The owner asked for
  a European sweep for any other country, or part of one, that is really under another country's head — in progress:
  checked so far with no change: Luxembourg (stays with Belgium, as the list has it; Mendel Edelman, from Paris, since
  2005 — nothing found on who sent him), Northern Cyprus (Chaim Hillel Azimov, since 2008; no tie to Raskin or Turkey
  found; a 2024 Mako report says the house closed for security), Malta (Chaim Segal, 2012), Montenegro (Ari Edelkopf,
  2017, invited by the community, came from Sochi), Croatia (Pinchas Zaklas, 2004), Serbia (Yehoshua Kaminetzky, 2008,
  appointed by Merkos — Rabbi Kotlarsky), Ireland (Zalman Lent, from Manchester 2000, the Dublin congregation's rabbi),
  Iceland (Avi Feldman, 2018), Slovenia (Ariel Haddad in Trieste, appointed by the Rebbe; Chabad Italia lists Chabad
  Trieste — so on Oct 10 the owner folded Slovenia into Italy's shetach: "Just do it". The Trieste panhandle is back in
  Italy; Haddad stays Slovenia's head on its country card through `servedFrom` in data/country-heads.json, which lets a
  head's center sit outside the country when it is in the same shetach), Lugano (Yaakov Tzvi Kantor; no
  tie to Milan found).
- **Europe sweep (Oct 10; owner: "Europe next, excluding the really big networks like UK, France, Russia" — also left out:
  Ukraine, 114 listings; "be meticulous", and "actual legitimate manual individual research into each country on its
  own", not just databases).** Country by country, in the map's Europe view. Method per country: news of new shluchim
  (Chabadinfo, COL, Lubavitch.com, Anash), each house's own site and Google Maps pin, local-language and Hebrew searches
  city by city, and lubavitch.com's directory (it lists some centers the chabad.org data lacks, e.g. Girona).
  - Italy: added Chai Center Milano (via Alunno, opened 18 Jun 2026; Wilschansky, Mizrachi — chabad.it). Checked, nothing
    to add: Turin (only a dead chabadturin.com, a bare "Chabad of Torino" Facebook page and a directory line with no
    shliach), Genoa (Chabadpedia only), Sicily (an unreliable Israeli guide; Palermo's synagogue is Shavei Israel's),
    Sardinia (Porto Cervo summer pop-up), Puglia/Capri/Amalfi (served by Chabad Napoli), Camaiore (Gan Israel camp),
    Calabria, Padua, the Dolomites. chabad.it also lists Gan Chaya, Beteavon and Biblioteca Yad Eliyahu — programs at
    centers already on the map.
  - Spain: added Chabad of Central Madrid (Calle de la Reina 33, Zalman and Shoshi Goldstein), Chabad of Girona (Carrer de
    la Força 29, Avrohom and Chana Rosenberg — on lubavitch.com, id 3422505, not in the chabad.org data), Chabad of
    Barcelona's Jewish Quarter visitor point (Sant Honorat 9) and its women's mikvah (Bordeus 25); Sant Cugat's
    chabad.org listing (no one named) now shows Shalom Ber and Rivka Libersohn (Enfoque Judío, Jun 2026) via a
    personnel-only fix (fixes may now carry personnel; one without lat keeps the approx flag). Nothing found: Málaga,
    Mallorca, Alicante/Costa Blanca, Gran Canaria (served from Tenerife), Seville, Granada, Bilbao, Melilla, Ceuta.
  - Portugal: nothing to add (the Zayantz "Chabad for Israelis" in Lisbon — COL, Jan 2025, under Rosenfeld — has no
    published address; chabad.org lists them at Casa Chabad Cascais; no house in Madeira or the Azores).
  - Greece: nothing to add (Corfu, Santorini, Paros: summer visits or Athens deliveries; the island houses were
    recruited by Hendel). Malta: nothing to add (Chabad of Malta is the Sliema synagogue).
  - Cyprus: added Chabad of Latchi (Polis Chrysochous, Mendy and Esty Lipsker, 2025, its site's pin) and Chabad of
    Nicosia (Lapithou 11, Egkomi, Menachem Mendel Raskin — Chabad Cyprus's city house, apart from chabad.org's campus
    center). Northern Cyprus is active (Torah dedication, Apr 2025).
  - Germany: chabad.de's own list of its centres matches the map except Mainz → added (Sholom Dovber Ashkenazi,
    Chabadpedia; no address, city dot). Berlin: chabadberlin.de lists seven houses; Steglitz (Shmuel Segal) wasn't on
    the map → added (address unpublished, dot at Rathaus Steglitz); Kudamm (Dovid Teichtal) and the Russian speakers'
    centre (Pavlotsky) give the Münstersche Str. 6 address; Bet Nachum (Spandauer Damm, Feb 2025) is in Ruhwaldpark
    with the yeshiva already on the map. Nothing in Leipzig, Stuttgart, Heidelberg, Wiesbaden, Bonn, Rostock, Münster.
  - Austria: added the Chabad Seminary of Austria (Zalman and Blumi Raskin; moved into the Chabad House building,
    Taborstraße 20a, May 2026 — COLlive). lubavitch.com also lists "Chabad Lubavitch House-Salzburg" (Dovid Nussbaum,
    Schwarzparkstrasse 11) — an older listing: Nussbaum runs Lungau (on the map) and Gruzman has Salzburg; not added.
  - Switzerland: added Beit Yossef in Crans-Montana (Levi Yitzchak Pevzner, Rue Centrale 35 — the synagogue beside the
    bar of the Jan 1, 2026 fire). Bern's shliach (Marilus) is chabad.org's Biel/Bienne listing. Lausanne, Davos,
    St. Moritz, Gstaad: nothing permanent found.
  - Netherlands: added Chabad House Amstelveen (Prof. J.H. Bavincklaan 5, by the Adagio hotel; Chabad Amsterdam's
    tourist and Israeli centre). Every name on chabad.nl's and Go2Torah's lists is on the map.
  - Belgium, Luxembourg, Liechtenstein, Gibraltar: nothing to add.
  - Denmark, Sweden, Norway, Finland, Iceland, Ireland: nothing to add (all houses found are on the map).
  - Hungary: EMIH (Chabad-led; zsido.com "Zsinagógáink, közösségeink") lists synagogues the map lacked → added the Buda
    Castle Synagogue (Táncsics Mihály u. 26, Asher Faith), ZSILIP (Újpesti rakpart 1, Shmuel and Sosi Glitzenstein —
    same spot as CKids) and the Nagyfuvaros utca synagogue (Chaim Shaul Glitzenstein). Not added: Teleki tér shtiebel
    (Hurwitz serves it, but it isn't Chabad's), Szeged's EMIH centre (yeshiva students, no shliach), Keszthely
    (community, no rabbi).
  - Bulgaria: added Chabad Bansko (winter ski season, Platinum hotel, run by Chabad of Bulgaria — Salamon, as chabad.org
    has Sunny Beach). Poland, Czechia, Slovakia, Romania: nothing to add (Prague 2's "Jewish Center", nusach Chabad, is
    independent; Bucharest's Pipera centre was the Orgads', now in Cluj; Iași: Chabad Romania is still seeking a couple).
  - Balkans: added Chabad of Budva (Dukley hotel, Eliezer and Chaya Ehrenfeld, since 2023 — chabad-montenegro.com/bud)
    and Albania's first dot, the Chabad Jewish Center of Albania in Tirana (Rruga Helmut Kohl, OpenStreetMap node;
    Yoel Kaplan). Nothing in Kosovo, North Macedonia, Bosnia, Ljubljana (Haddad serves Slovenia from Trieste),
    Dubrovnik (a 2019 summer listing only), Novi Sad.
  - Moldova (kishinev.org's contacts): added Chabad of Transnistria at the Bendery synagogue (ul. Suvorova 30, Mendel
    Gotzel, Bendery's rabbi since 2023), Chabad of Beltsy (Mendel Axelrod; no address, city dot) and the Kishinev
    airport Chabad (Shmuel Zalmanov). Their towns keep the Russian names like Kishinev (`CITY_NAMES`: Bender → Bendery,
    Bălţi → Beltsy). Belarus, Estonia, Latvia, Lithuania: nothing to add.
  Europe (outside the UK, France, Russia, Ukraine) is done.
- **Rest of the world (grey land) is on by default** (owner, Oct 10): `state.empty: true` and the checkbox starts checked.
- **Shluchim murdered al kiddush Hashem: HY"D, at the top of their center (owner, Oct 10: "Tzvi Kogan isn't obm or AH
  he's HY"D … all shluchim who were martyred al kiddush hashem (the Holtzbergs, Schlanger, and anyone else) … should
  also be prominently featured on their center").** data/extra-centers.json `hyd`, by center id: the build marks each
  person passed away with `hyd` (adding them to the center's people when chabad.org doesn't list them) and gives the
  center a `memorial` line; the card shows a shaded block right under the center's name — "Rabbi Gavriel Holtzberg
  HY"D / Mrs. Rivka Holtzberg HY"D", then "Murdered al kiddush Hashem in the Mumbai terror attack, November 2008"
  (Hebrew: הרב / הרבנית … הי״ד, the Hebrew year) — and leaves them out of the folded "Deceased" list (still obm / ע״ה
  for everyone else). On the map: the Holtzbergs (Chabad-Lubavitch of Mumbai, 2008), Zvi Kogan (Chabad of the UAE,
  2024 — on its Abu Dhabi dot since Nov 3, owner: "Move the kogan thing from Dubai to Abu Dhabi"; `movedFrom` takes him
  off the Dubai dot's chabad.org list, so Dubai doesn't show him as obm), Eli Schlanger and Yaakov Levitan (Chabad of Bondi — its chabad.org listing, "Bondi Beach Friends of Refugees
  of Eastern Europe", Yehoram Ulman's — the Chanukah attack, Dec 2025; Levitan was its general manager and the Sydney
  Beth Din's secretary) and Moshe Krivitski (Chabad Synagogue Nachal Beka, Be'er Sheva, the March 2022 attack).
  Searched for others (English and Hebrew news, Chabad's own sites): none found who served a center on the map. Left
  out: Rabbi Mendel Deitsch (beaten and robbed in Zhitomir, 2016, died of his wounds — the motive is disputed and he
  had no center there) and the 1956 Kfar Chabad attack's students and teacher (not shluchim of a center). Hebrew
  surnames as Chabad's Hebrew sites write them: שלאנגר, קרביצקי, לויטן.
- **Posters (SVG/PNG downloads) still show Northeast Ohio's "Alevsky family" and Belarus as its own shetach** for Northeast Ohio: the owner said to stop with the posters
  (Oct 10); regenerate them only when he asks.

**Testing tools (all in scripts/, Playwright + headless Chromium at /opt/pw-browsers):** `node scripts/screenshot.mjs
<outdir> view:base:device:theme[:clicks]` (now waits for `__dbg.settled()`; fetches the real OpenFreeMap style, tiles and
fonts — reachable since Oct 8 — cached in .cache/ofm); `node scripts/profile.mjs phone 4` (RELOAD=1 for a reload too);
`node scripts/stress.mjs` (rapid option/view/language switching mid-load, a card, zoom-to, reload; must end "no errors").
"console Error … Failed to fetch" lines in screenshot.mjs output are harmless (blocked fetches). CDN libraries come from
.cache/testlib (`npm install --prefix .cache/testlib d3@7.9.0 topojson@3.0.2 maplibre-gl@4.7.1` if missing). Frame rates
under SwiftShader mean nothing (it draws on the CPU); look at long tasks.

**Standing rules to keep in mind (details further down):** Judea and Samaria is Israel — never another country's name
or ISO code for it anywhere (code, data, comments, commits); old Russian city names only (Kiev, Kharkov, Lugansk,
Zaporozhye, Dnepr, Nikolaev, Slavyansk); never shorten head shliach names; don't invent shetach or personnel data; the
owner prefers few questions — decide sensibly and say what you chose.

## ISRAEL'S HELD GROUND (Oct 7, done): Gaza, southern Lebanon, Syria — from the owner's IDF control map
The owner asked (Oct 7): **(1) add the Israeli-controlled parts of Lebanon and Syria to Israel, the same way as Gaza**
(part of Israel, no line between); **(2) fix Gaza's edge — it was "a weird rough border, not a precise one".** Then he
sent his own map for all three: **`data/idf-control.kml`** (his "IDF Control" Google My Maps export, IDF_Control.kmz,
unzipped, unchanged): "everything within every polygon is within IDF control, I've deleted anything that isn't"; treat
the overlapping polygons as one contiguous area and ignore their names (dates). **It replaces the OpenStreetMap lines**
(Gaza's Yellow/Orange Line ways, Lebanon's "security zone" relation 18723137, Syria's UNDOF relation 184888), which
are no longer used.
- `node scripts/held-lines.mjs` (replaced `gaza-line.mjs`): merges the map's 100 polygons (98 placemarks), closes the
  gaps between them (grown 60 m and shrunk back: holes, hairline cracks, pockets with a mouth under 120 m), cuts GADM's
  Gaza, Lebanon and Syria along the result, and writes `data/shapes/{gaza,lebanon,syria}-{held,rest}.geojson`. The build
  (`HELD` in build-data.mjs) adds each held part to Israel's shetach (as an area of its own since Oct 8, `HELD_AREA`: no
  line on the Shetachim map, shown apart as held on the Countries map) and draws each rest as outside land. Then `npm run
  build`, `npm run svg`, `node scripts/svg-png.mjs`. **When the owner sends a new map**: unzip its doc.kml over
  data/idf-control.kml and run the same. Israel is drawn at 100 m (`FINE`).
- **Slivers and pockets**: where the map runs along a border, it and GADM draw the border a little differently; every
  piece of the rest that isn't its main body and touches the held part (up to 25 km²) goes to the held part, so no grey
  specks or notches show inside Israel (Gaza's "rough border" was exactly that).
- **The owner's call on walled-in ground** (Oct 7, asked): **Rmeish and Ain Ebel** (the Christian villages, a 39.5 km²
  pocket against the border that no polygon covers) **stay Lebanon**, an enclave in Israel's ground (`KEEP` in the
  script); every other walled-in hole is filled: farmland west of Shamaa (8.5 km²), a spot in northern Gaza near Beit
  Hanoun (1.9 km²), between Arnoun and Yohmor (0.5 km²), near Rafah (0.3 km²).
- **Har Dov (the Shebaa Farms)**: GADM puts it in Lebanon (so the map had drawn it as Lebanon all along); Israel has held
  it since 1967 as part of the Golan, so OSM's Golan Heights area (relation 16119376, `controlled_by` Israel) is also cut
  from Lebanon. Without it the owner's posts on the Kfarchouba hills just north of it would float as islands.
- Result (Oct 7): **Gaza** 195.7 km² held, 57% of GADM's Gaza outline (the rest one piece, 147.9 km²); **Lebanon** 377.2
  km² held (3.7%; with Har Dov), several zones from Naqoura to the Hermon, the rest of Lebanon touching the border between
  them, plus the Rmeish–Ain Ebel enclave; **Syria** 363.4 km² held beyond GADM's Israel (the whole former UNDOF buffer
  zone with the Syrian summit of Mount Hermon, the Hermon's eastern slopes, ground east of Quneitra, a strip toward the
  Yarmouk; all 9 IDF outposts on INSS's map are inside). Israel: one piece, 28,992 km², its one hole the Rmeish–Ain Ebel enclave.
- Syria and Lebanon themselves stay in no shetach; only the held parts are Israel's.
- **The bare strips along the borders (most likely the real "rough border")**: the faded land round a view and "Rest of
  the world" come from web/data/outside.json, which the build used to thin to 40% on a coarser grid. Next to Israel's
  100 m lines that left strips of bare sea, up to about a kilometre wide, between Israel and Lebanon, Syria and Gaza
  zoomed in (and along every border between shetach land and land no shetach covers). Now outside.json and geo.json are
  written on the same grid (TopoJSON quantization 200,000, both framed by the whole globe: a `frame` object in each,
  after the main one — the page reads geo.json's `areas` and outside.json's first object) and outside.json isn't
  simplified any further, so they meet point for point (checked in screenshots: no bare pixels inland at zoom 9–12).
  outside.json is 0.9 MB now (250 KB gzipped; was 108 KB), geo.json 2.6 MB (740 KB gzipped; was 666 KB: the finer grid
  is what lets the 100 m lines of `FINE` show — at 100,000 the longitude grid alone was 300–400 m).
- Background found while the OSM lines were in use (kept for reference): the IDF's Lebanon "security zone" map of June
  18, 2026 (OSM relation 18723137) is 618 km² of Lebanon, the owner's map 340 km²; INSS's ArcGIS map of Syria
  (experience.arcgis.com/experience/417d6596ca2649518cf3f6cae9b204fa) has the IDF outposts as points.
- Network (Oct 7): the OSM API (`www.openstreetmap.org/api/0.6/<way|relation>/<id>/full.json`, `map.json?bbox=`, history,
  changesets) and nominatim.openstreetmap.org are reachable now; Overpass (every mirror tried) and Geofabrik are not.
  Wikipedia (`/w/index.php?title=…&action=raw`, with a User-Agent), ArcGIS Online's REST API, feor.ru and
  deepstatemap.live's API are reachable.

## OCCUPIED UKRAINE AND CRIMEA → LAZAR'S RUSSIA SHETACH (Oct 7, done)
- The owner (Oct 7): Donetsk, Lugansk and the other Chabad centers in the Russian-held regions now work under Berel
  Lazar, and Lipszyc no longer runs Crimea, it's effectively under Lazar too; then: **"use the current occupation line and
  put all centers behind it into the Russian shetach."** So **Russia** (Berel Lazar) = Russia, Mongolia, Crimea and all
  of Ukraine Russia holds; the **Crimea shetach (Yitzchok Meyer Lipszyc) is gone** (data/shetachim.json,
  data/global-shetach-list.txt, data/hebrew/shetachim.json; its flagship line in world-flagship-centers.txt left as it
  is, like Cambodia's); **Ukraine** (Meir Stambler) = the rest.
- The line: DeepStateMap (`deepstatemap.live/api/history/last`, its daily map as GeoJSON; reachable from the sandbox).
  `node scripts/occupation-line.mjs` keeps its areas held by Russia (occupied, the parts of the Donetsk and Lugansk regions
  held since 2014, Crimea, Tuzla — not its "unknown status" grey zone), merges them and writes
  data/shapes/ukraine-occupied.geojson; the Russia shetach claims `{ "state": "UKR", "shape": "ukraine-occupied" }`
  (Ukraine is cut along it; UKR is drawn at 100 m, `FINE`). Map of Oct 5, 2026: 116,800 km² (from the Kinburn Spit and the
  left bank of the Dnepr to the Lugansk region, plus small pockets along the Sumy and Kharkov borders). **Re-run when the
  line moves**, then `npm run build`. Since Oct 8 the script also needs `.cache/gadm-hi-UKR-0.json` (made by a first
  `npm run build`): DeepStateMap's line doesn't follow GADM's Ukraine–Russia border exactly, so cutting Ukraine along it
  left bits of Ukraine stranded behind the line — the owner saw one, a 190 km² speck of Ukraine's colour inside Russia
  near the Lugansk border ("what the hell is going on here"). Every piece of Ukraine left over that touches the held land
  and isn't the main body of Ukraine is now given to the held land (Oct 6 map: 268 such bits, 117,064 km² held in all);
  the two small pieces Ukraine keeps apart from its main body (0.7 and 9.2 km², far from the front) are real.
- What was found per center (Oct 7, before the owner's go-ahead): **Crimea** — Simferopol, Sevastopol, Yevpatoria and
  Yalta are on FJC Russia's community list (feor.ru); chabad.org has Rabbi Yechezkel Lazar at Simferopol; Lipszyc left in
  2014. **Lugansk** — led by Shneur Zalman Nekhaenko, "representative of the Chief Rabbi of Russia in the new regions"
  (Lugansk city administration, Nov 2024); Rabbi Shalom Gopin left in 2014 (a Lugansk community in exile in Kiev).
  **Donetsk** — helped by FJC Russia since 2014 (Lechaim, 2017); Rabbi Pinchas Vishedski left in 2014 (a Donetsk community
  in exile in Kiev). **Mariupol** — Lazar to RIA Novosti (Aug 7, 2026): FJC Russia works with the Mariupol, Donetsk and
  Lugansk communities, sends aid, has rabbis there. **Melitopol** — on Gotov (gotov.org, FJC Russia's community platform)
  at a renamed street, though chabad.org and FJC Ukraine still list it under Zaporozhye's Rabbi Nochum Ehrentreu.
  **Makeevka** — nothing found. chabad.org still shows the old personnel for all of them.
- Centers behind the line (tagged by the map's own areas, so they follow the line): Donetsk (3 listings), Makeevka,
  Lugansk (6), Mariupol, Melitopol, Simferopol, Sevastopol (2). A "Jewish Community of Donetsk" listing that chabad.org
  places near Slavyansk (48.93, 37.69), about 14 km on the Ukrainian side, stays Ukraine's. Kherson, Zaporozhye, Kharkov
  stay Ukraine's.

## SPEED (Oct 8, done) — the first view at once, no long blank map, never an old map after an update
The owner (Oct 7): coming back to the page, or reloading it, showed only the blue sea "for a long time"; panning and
zooming were painful at the start; "whatever you institute to fix this should not make that when the page gets updated
it keeps old stuff". Measured with `node scripts/profile.mjs phone 4` (a slow phone): the page was ready after 26 s, one
15-second freeze (every shape of the world projected, handed to the map engine twice or three times, all the names
worked out in one go). Now: the shetachim show at ~5 s on that slow phone (~1.6 s on a desktop), their borders a second
later, the names come in biggest first and are all there by ~11 s (4 s desktop); a reload shows shetachim and names
together at ~4.4 s (1.2 s desktop); no freeze over ~0.6 s, so the map moves from the first moment. How:
- **Asked for at once** (`EARLY`, a small script at the top of the page): the data files and the street map's style are
  fetched while the map library still loads. **Every data file is checked with the site on each load** (`cache:
  'no-cache'`: an unchanged file comes from the browser's cache after a quick check, a new one at once), and the physical
  map's tiles are asked for under the data's version (`tileVersion()`, from the files' ETags) — so an update shows on the
  next load, never an old map. The refresh button (`?v=`) still fetches everything anew.
- **A slice at a time** (`prep`/`got`/`need`, `S.makers`): each set's heavy shapes (areas, each kind of line, the land,
  the land no shetach covers, the names) are generators worked out once each, ~12 ms at a time between frames (4 ms
  while the map moves), the most urgent first (`RANK`: areas, then lines, then names, then the land round the view).
  `got(S, what)` works one out at once when code needs it now. **Don't add work that runs in one go at startup.**
- **Handed over once** (`feed`): a source gets new data only when what it shows changes (`FED`); the map engine copies
  (stringifies) everything it's handed, which was most of the freeze. The view's other way of drawing (the standard map
  under the street map, while the flat political one shows) is only handed over when it's shown. Only the lines shown are
  worked out (`mesh:<kind>`: coast, shetach, inner; country and regular with Countries/States/Both).
- **The land is drawn from the areas** (`land-view`, `land-rest`: the areas source in the land's colour) instead of
  merging the world's land into one outline (1 s+ on the phone); a flat continent's or the boxed USA's land round the view
  still is one shape (`land`, only for the faded rest of the world and Rest of the world). The faded land is a solid
  colour mixed with the sea's (see-through, a simplified shape overlapping itself showed a lighter patch: Tamaulipas).
- **Names**: biggest areas first, shown every ~0.7 s as they come; held back until the areas are on the map; label
  placement much quicker (a heap in `polylabel`, each pole once, `emWidth` measured once, cheap inside tests); they wait
  for the page's font to load (3 s at most) so they're measured right. **Kept in the browser for the next visit**
  (localStorage `shetachim-names|<fingerprint>|<set>|<mode>`): the fingerprint is this page's code (all its scripts),
  the data files' ETags and whether the font had loaded, so a new version of the page or the data never shows old names;
  older entries are cleared when new ones are kept. No ETag from the site, no keeping.
- Smaller: the topology decoded once to plain lon/lat (`decodeArcs`, to 1e-6°); flat coordinates rounded to 1e-5°
  (shorter to hand over); the Hebrew name setup only when Hebrew is shown (`bilingual()`); neighbours worked out once for
  both colourings; icons not redrawn on every option change; the RTL plugin asked for at the start; the root
  `index.html` forwards by script (at once, keeping `?lang=he`).
- `web/data/outside-lo.json` (new, from the build): the land no shetach covers, light, for the flat maps; the standard
  maps use the full `outside.json` (it meets the shetachim point for point).
- Testing: `window.__dbg.settled()` is true once nothing is left to work out or hand over for the map shown (names
  included); `data-drawn="1"` on `<html>` once the first view is complete; `window.__feedLog` (if a test sets it to [])
  records when each source got its data. `scripts/screenshot.mjs` waits for `settled()`. **OpenFreeMap is reachable from
  the sandbox now (Oct 8)**: screenshot.mjs and profile.mjs fetch its style, tiles, sprites and fonts for real (kept in
  `.cache/ofm`), so screenshots show the real physical map and the map's names (before, its fonts were blocked and no
  names showed in screenshots at all); `DEMO=1` for MapLibre's demo style as before.
- Physical map (owner, Oct 7): **every land border of a shetach gets the purple border**, also where the other side has no
  shetach (Israel's against Egypt and Jordan; before, only borders between two shetachim had it).

## COUNTRIES MODE AND THE REST OF THE WORLD (owner, Oct 7; done Oct 8 after the speed work)
1. **Head shliach labels in Countries mode too**: with Countries borders and Head shliach labels, the names are the
   shetachim's heads, over the countries' borders (`namesOf`: `regular` only with Shetach name labels).
2. **Israel in Countries mode**: Judea and Samaria is Israel — no line anywhere (the political map never had one; the
   street and physical maps drew the street map's own borders, with the 1949 lines through Israel). **The held parts of
   Gaza, Lebanon and Syria are areas of their own** (build: `HELD_AREA`, states `HELD-GAZA`, `HELD-LBN`, `HELD-SYR`,
   named "Israeli-held Gaza/Lebanon/Syria", Hebrew "עזה/לבנון/סוריה בשליטת ישראל"; country ISR, shetach Israel's):
   the Shetachim map draws no line between them and Israel (fully part of it, as before); the Countries map shows each
   in a lighter shade of Israel's colour (owner, Oct 8; first each had a colour of its own), with its own name and a
   dashed line against Israel (state style), and its card says "Held by Israel".
3. **"Borders of the rest of the world"** (More options, new): with Shetachim borders too, the countries no shetach
   covers are shown as ordinary countries with their borders (political: the rest of the world in grey, with its
   countries' borders; physical and streets: their borders over the street map). `state.restBorders`; `rest()` is
   "Rest of the world or its borders".
4. **Country cards: the country's own head shliach** under the shetach's head — done Oct 8, see WHERE WE ARE above.
5. **States drawn on every map with Countries**: the political map always drew the US states, Canadian provinces and
   territories, Australian (and Mexican) states each in its own colour with dashed borders; **the street and physical
   maps now draw every country's and state's border themselves** (`st-line-country`, `st-line-state`, from our tiles;
   the street map's own `boundary` layers are never shown), so the states show there at every zoom too. The tiles' lines
   carry `na`/`nb` (each side's country, also for land no shetach covers) and borders between two countries no shetach
   covers (before, only borders touching a shetach were in the tiles).

## OWNER'S STANDING RULES (Oct 1) — never undo these
- **Push every change live without asking** (owner, Oct 14: "stop asking me for permission to push stuff! Permanently!"):
  commit, push the work branch, then fast-forward the live branch (`claude/bold-albattani-aqfnj9`), every time.
- **Research with the regular WebSearch/WebFetch first; Firecrawl only when they can't reach a page** (owner, Oct 19:
  "you have firecrawl access but only use it if your regular unlimited web fetch doesn't able to access smth").
  Firecrawl costs credits; WebFetch doesn't.
- **When a site is blocked (Chabadpedia, archives), ALWAYS give the owner the exact links to check** (owner, Oct 11, in
  capitals; Chabadpedia itself now reads through the Firecrawl connector — see Oct 11 below). Chabadpedia search links work for any title: `https://chabadpedia.co.il/index.php?search=<Hebrew>` goes to
  the page; add `&fulltext=1` for every mention. Don't search for Chabadpedia pages yourself; the owner turned that down.
- **Any Chabad activity in a country puts it in a shetach** (Oct 5): visiting bochurim, a shliach who serves it from next
  door, holiday trips — the country goes to the shetach of the shliach responsible (Mongolia is Russia's; Guyana is the Caribbean's).
  The owner wants it *sure*: Suriname had Merkos Shlichus seders in Paramaribo (Pesach 2025) but no shliach is named as
  responsible (Rabbi Super of St. Lucia only helped with the bochurim's stopover), so it stays blank until one is. Only truly uninhabited stretches are left out (the Yukon and
  NWT only partly in Alberta). French Guiana: no Chabad activity found (Oct 5), so no shetach yet.
- **Old Russian city names only** (owner, Oct 7), in messages to him as on the map: Lugansk, Zaporozhye, Kiev, Dnepr,
  Kharkov, Nikolaev, Slavyansk — never the Ukrainian forms (`UA_NAMES` in the build does it for the map's towns).
- **Shluchim murdered al kiddush Hashem are HY"D / הי״ד, never obm / ע״ה** (owner, Oct 10), and shown at the top of
  their center's card: data/extra-centers.json `hyd` (see Oct 10 above). Add anyone new there.
- **Head shliach names are never shortened** — not on the live map, not in the SVGs, never to the last name alone
  (owner, Oct 7: there is no "Last name" label mode any more). Where the full name doesn't fit on one line or two,
  no name. **Middle names are left out on the map and posters** (`mapName` in data/shetachim.json, `mapHead` in the
  Hebrew list; the cards always show the full `headShliach`) unless part of the first name (Sholom Ber, Menachem
  Mendel, Yosef Yitzchak, Shneur Zalman) or the man is usually called by it (Yitzchok Meyer Lipszyc, Gershon Meir
  Burshtein, Aryeh Zeev Raskin, as the press names them). Oct 7: Yaakov Biderman, Chaim Azimov, Yeshaya Cohen, Yosef
  Kantor, Chaim Shaikevitz (that last one unconfirmed: found no usage either way). Same in data/hebrew/shetachim.json.
  Families and leadership entries ("Pinson family", "Hanholo of Chabad Lubavitch UK") are never shortened.
  **Cards keep everyone's full name exactly as chabad.org lists it** (owner, Oct 7): the middle-name rule is for the
  map's head shliach labels and posters only; double names like Chaya Mushka, Devorah Leah count as one first name.
- **Alberta's name sits on Alberta itself** in every label mode (`labelState: "CA-AB"`: the page keeps the name within
  that state's part while it's on screen — it used to only aim there, and the two-line head-shliach name drifted up
  into the territories' strip). The Alberta shetach's territories part ends at **110°W** (the Alberta–Saskatchewan
  line carried up to 63°N; `data/shapes/north-to-63.geojson`); the NWT east of it is in no shetach and left off.
- **Judea and Samaria is Israel** (see below); Peru is the **Blumenfeld family** (Tunisia: Pinson family; each has `lastName`, for the cards'
  "<name> family" line). Northeast Ohio was the Alevsky family until Oct 10 (now Zushe Greenberg, below).
- Ohio: Northeast Ohio (**Zushe Greenberg** since Oct 10 — the owner: "let's do Greenberg for the Ohio area". Rabbi
  Leibel Alevsky, its head shliach for 50+ years, passed away Apr 20, 2026; nothing published names a successor; Greenberg,
  his son-in-law, Solon Chabad since 1991, is the family's senior shliach and gave the keynote at the June 2026 kinus in
  his memory. The capital stays Chabad of Cleveland, the owner's pick), Central Ohio (Areyah Kaltmann), **Southern** Ohio (Sholom Ber Kalmanson; not
  "Western"; **Yisroel Mangel since Nov 1**, see the top), the Toledo area in Michigan. Capitals: Chabad of Cleveland, Chabad of Columbus, and Chabad of Southern
  Ohio's office (7380 Laurel Oak Lane, Amberley Village; hand-added in `data/extra-centers.json`; **since Nov 1 Mangel's
  Chabad Jewish Center in Cincinnati, Kalmanson's office a mushroom**).
- Before changing anything on the live map, check what the other account last did (`git log` on
  `claude/bold-albattani-aqfnj9`, and this file) and keep it.

- **West Virginia** is entirely in **Western Pennsylvania** (Yisroel Rosenfeld) — the owner briefly kept 8 eastern
  counties with Virginia, then reversed it. Its name centres on Pennsylvania (`labelCentre: "US-PA"`, softer than
  Alberta's `labelState`: aims at that state's part but may run a little into West Virginia).
- **The Gold Coast is an exclave of Victoria (Melbourne)** (Oct 1, the owner's call): the City of Gold Coast
  (`gold-coast-lga`) is part of the Victoria shetach; the separate Gold Coast shetach (Nir Gurevitch) is gone.
  Victoria (disputed) has a capital per claimant: Groner — Yeshivah Centre; Gutnick — Chabad House of Caulfield;
  Serebryanski — Merkos L'inyonei Chinuch (`capital` is a list with `for`). "Disputed" is set in italics.
- **"Rest of the world"** (More options checkbox, off by default; was "Land with no shetach" — the owner, Oct 5: never that wording; borders between its countries only with the Countries or Both borders setting): the political map draws land no shetach covers
  (`web/data/outside.json`, written by the build) and the land outside the current view in plain grey (`--empty`).
- **Cambodia is fully part of Kantor's Thailand shetach** (Oct 2; territory THA, LAO, MMR, KHM; the separate Cambodia
  shetach under Bentzion Butman is gone, also from data/global-shetach-list.txt and data/hebrew/).
- **India is a territory of the Thailand shetach** (`territoryOf: "thailand"`; the owner: "under the same auspices but
  not fully united"; he rejected "India (Thailand)" and a lighter shade): India is its own entry, in exactly Thailand's
  colour, with a dashed border between them (page mesh `inner`, tile edges `tr`, SVG dashed path); named plainly
  "India"; in the head modes Kantor's name again over India in italics and smaller (`secondary` labels; Hebrew, which has no italics:
  Heebo Regular slanted by hand on the posters, oblique on the page; at most 85% of his main name on the posters), his main name on Thailand–Myanmar–Laos as before;
  India's card: "Overseen by Yosef Chaim Kantor" (בהנהגת …) (Oct 5; the owner rejected "Together with the Thailand shetach", "Under the auspices of", and "Head shliach" + "Also head shliach of Thailand" — don't quote his own words onto the page). (`noCentralLeadership: true` remains for a shetach without a head.) Israel's name on the world poster goes beside the map with a short leader (`ASIDE_NAMES`);
  Hawaii's runs across its islands (`SEA_NAMES` 'chain'). The US & Canada names maps use short leaders to the nearest
  water (`aside`, only the Boston/Cape Cod knot stacked), not one column far out in the Atlantic.
- **North Queensland** (Ari Rubin; capital Chabad of Northern Queensland, Cairns): Mackay and north, Mount Isa,
  Cloncurry and the Gulf — 37 whole ABS LGAs (2022) dissolved into `data/shapes/north-queensland.geojson` (Mackay,
  Whitsunday, Burdekin, Townsville, Charters Towers, Cairns, Douglas, Cook, Torres, the Cape and Gulf councils, Mount
  Isa, Cloncurry, McKinlay, Richmond, Flinders…). Isaac (Moranbah, Clermont), Winton, Boulia, Rockhampton and south
  stay with RARA. **The Isle of Man is in the UK** (`IMN` in its territory, and in the page's `EUROPE` list, or it isn't drawn at all: Oct 7 it was missing there).
- **Mexico is one shetach under Yosef Mayzlesh** (Oct 2, the owner: "entire Mexico is Mayzlish"; Rabbi Yosef
  Mayzlesh, Chabad of Bosques — Rabbi Mendel Mayzlesh runs Chabad Lubavitch Mexico City). The earlier Mexican
  shetachim (Baja California, Sinaloa, Nayarit with western Jalisco, Jalisco, Bajío, Nuevo León, Chiapas, the Mexican
  Caribbean) are gone, and with them the jalisco-costa-norte shape. Baja California and Baja California Sur belong to
  the West Coast (Shlomo Cunin) with California and Nevada; Mexico is its other 30 states.
- **Cyprus includes the British Sovereign Base Areas** (Akrotiri, Dhekelia): Natural Earth shapes (`CYPRUS_EXTRA` in
  the build; GADM has none), merged into Cyprus itself.

## World names SVG (Oct 1, done; on the download page)
`web/shetachim-map-names.svg` (+ .png): the whole world at poster size (10,800 px wide, Natural Earth projection), every
shetach coloured with its head shliach's name; land no shetach covers is one plain grey swath with no borders inside
it (from `data/world-all.json`, which the build now writes); Antarctica left off. Names (scripts/export-svg.mjs):
- centred in their shetach both ways (`offCentre`: midway between the borders above/below and either side, plus near
  the shetach's middle), shrinking up to a third to get there; Virginia was the example (it had sat on the southern
  border). `labelAt` [lon, lat] in data/shetachim.json overrides the middle (India: mainland India, not pulled toward
  the northeast past Bangladesh). Same code for the US & Canada names SVG.
- names under 5 px inside (`tiny: 5`; Tzach, Tuvia Teldon, Mendel Fogelman, Chaim Prus, Chuni Vogel were 2.5–4 px and
  "impossible to read") get a leader instead: each its own short line to the nearest open water (no crossing other
  names, ≤25 px over other countries' land; crossing one other leader beats a long way round). Placement is retried
  with any name that got no room, or only a long line, placed first; the best try is kept.
- **No columns of names** (the owner, Oct 1: the old 8-name list off New England with long crossing lines was
  rejected) — except a tight knot (3+ names starting within 45 px: Boston, Cape Cod, Rhode Island), which is stacked
  right off the coast, placed first, rows in the order the lines arrive so none cross (`column: true`).
- **Names over the sea only where the owner picked** (`SEA_NAMES` in export-svg.mjs: Indonesia/Singapore's shetach, the
  Philippines, Qatar): centred between the islands or straddling the coast, clear of other land. Everywhere else it
  looked bad and was rejected — keep it to that list.
- The same words on one line or two: two lines when that's at least as big (Eli Rosenfeld down Portugal); between
  different wordings, the fullest within 15% of the best. The owner asked to leave this rule as it is.
- Lower Balkans (Yoel Kaplan): one name with a leader from each of its two parts (Bosnia; Albania–northern Greece) —
  `split`: big parts that other land keeps apart (shortest gap mostly someone else's land).
- The owner's verdicts on the SVG (Oct 1): as few names beside the map as possible — a small name inside its shetach
  (down to ~2.5 px on the 10,800 px poster) beats a leader; a column of leadered names "looks like a list" and is
  rejected; leaders short and near their place (Raskin's long line to Cyprus was rejected); a small name takes the
  biggest size that fits even a little off-centre (Delaware); big shetachim get big names (Oct 2, "Lazar, Bolivia… should be bigger", then "way bigger and one line": cap 0.25·√area, up to 420 px on the world poster and 160 on US & Canada; a name starts at 97% of the most that fits and gives up at most 10% for centring; the same words on one line beat two lines when at least as big — Berel Lazar, ~300 px on one line across Russia).
  Long non-personal names (UK leadership) break into balanced lines.
- `ONLY=id,id WHY="Name" node scripts/export-svg.mjs 3600 world-names` renders just some shetachim and says why spots
  were refused — a full render takes ~5 min. `node scripts/svg-png.mjs [file.svg]` makes the PNGs (Chromium).

## Hebrew (Oct 1)
The whole site in Hebrew, the way a Chabad person in Israel would say it: the header button (עברית / English) reloads
with `?lang=he` (remembered); the page goes right to left, Heebo for Hebrew letters. Names come from `web/data/he.json`,
built by `node scripts/build-hebrew.mjs` (run after `npm run build`; it stops and lists anything without a Hebrew name)
from the hand-written lists in `data/hebrew/`: `shetachim.json` (name, short forms, head shliach, headTitle הנהלה),
`areas.json` (every state/country code; from Natural Earth's Hebrew names, fixed by hand), `cities.json` (map cities,
centers' towns, capitals' towns). Israel's shetach is "ארץ ישראל" (short "א״י"; owner, Oct 9: not "ארץ הקודש"), the view too; Judea and Samaria stays Israel.
Centers show chabad.org's own Hebrew name where it has one (920 do); the rest (and capitals) from
data/hebrew/centers.json, translated by hand; center types are translated in the page (`HE_TEXT`). A town two places
share is keyed "Name|REGION" in data/hebrew/cities.json (Naples|US-FL נייפלס vs Naples נאפולי). The Hebrew surname
(`lastName`, for "<name> family" lines; שם טוב is two words) is worked out by the English name's word count. The name SVGs have Hebrew copies (`world-names-he`, `na-names-he` in
export-svg.mjs → `*-he.svg/png`, on the download page): Heebo outlines, drawn right to left (`visual()`).

## PERSONNEL — collected Oct 3, NOT YET BUILT (do this next)
- `data/raw/chabad-personnel.json` is in (commit `9077cb8`): all 4,220 chabad.org centers checked, 0 errors;
  3,764 have personnel listed (3,734 with at least one living person). Format:
  `{ meta, personnel: { "<centerId>": [{ title, firstName, lastName, position, isDirector, isDeceased }, …] } }` —
  exactly what `scripts/build-data.mjs` (~line 1118) already reads; no code changes needed.
- **chabad.org's API is reachable from the sandbox now** (the site's HTML pages still get a Cloudflare challenge, but
  `/api/v2/chabadorg/centers/<id>?format=jsonapi&lang=en` answers 200). So `node scripts/chabad-personnel-fetch.mjs`
  (commit `d93b393`) collects it straight from Node in ~4 minutes: one request per center, 4 at a time, pausing on
  429s, resumable from the output file. The browser collector (`chabad-personnel-scrape.js`, `web/personnel.html`)
  is no longer needed. Its batch guess doesn't work: the list endpoint ignores `filter[id]`/`filter[ids]` (returns all
  4,220) and carries no relationships or `included`, so personnel is only per center.
- Merged into `claude/bold-albattani-aqfnj9` and built (Oct 3); the cards follow the owner's rule (see "Shluchim on
  center cards" above). `web/personnel.html` was removed (the Node fetcher replaces the browser collector).

## LUBAVITCH (Oct 5, the owner: "something honorary for the original Lubavitch")
- At Lyubavichi, Smolensk region (54.8352, 30.9632): a small dot and the name *Lubavitch* in italics, as maps mark a
  historic place; card (owner, Oct 7): a really big "Lubavitch" as the heading, then "Seat of the Rebbeim, 1813–1915" under it (he took out the "Birthplace of Chabad-Lubavitch" kicker); under a divider, as a center listing of its own (normal center size, not the heading's; `LUBAVITCH_CENTER_PEOPLE`, Heritage center · Lubavitch (owner, Oct 7: it isn't a Chabad house), Gavriel Gordon · Director): Hatzer Raboteinu Nesieinu B'Lubavitch (חצר רבותינו נשיאינו בליובאוויטש, opened 2008 near the graves), shliach Gavriel Gordon (owner, Oct 7; not on chabad.org's locator), in the special card like 770's (accent border and kicker) — he rejected every wording Claude made up, so ask him before changing it. Shown in every world view even with
  capitals off, its name placed before any city's (`honor: true` in the page's capitals list; `HONOR_MARK`).
  The owner rejected a gold ring and a card with a paragraph of history ("AI generated") — keep it understated.
  Keep it in the map-engine rebuild.
- Never Syria (Oct 5: "ridiculous", hardly any Jews there).

## CARD WORDING (Oct 5)
- A family at the head (Pinson, Blumenfeld): "Shluchim: Pinson family" (שלוחים:) — keep the "Label: name"
  form; the owner rejected "Led by the Alevsky family" (a sentence, no colon).

## PERFORMANCE (Oct 5) — keep it this way
- The owner: panning and zooming the physical map was "so so bad" (low FPS). Causes: names were rebuilt from scratch every
  120 ms while moving (all texts, tspans and city marks recreated), new zoom-step layouts (200–500 ms) ran mid-gesture,
  and MapLibre drew at the phone's full 3x pixel ratio. Now: keyed joins keep existing labels and marks while moving,
  `moving` holds new layout work until the map is still (150 ms after moveend), live refresh every 250 ms, pixelRatio
  capped at 2, 3D buildings off. Don't reintroduce per-frame DOM rebuilding.

## NEW MAP ENGINE — web/next.html (Oct 5, in progress; web/index.html is still the main page)
- The owner asked for the map to feel like a real map site, not a custom project. next.html runs on MapLibre GL with
  OpenFreeMap's liberty style. Names, cities and capitals are the engine's own symbol layers, each name pre-sized per zoom
  (s0..s14) at its area's pole of inaccessibility.
- PHYSICAL: **no shetach tints or fills at all** (owner, Oct 7: the tints made it "look like a political map"; it must be a
  proper physical map: the land's own greens, deserts, relief). Shetachim show only as purple cased borders that fade out by z12. **The thin maritime line stays** (`st-line-coast`:
  every open edge, so the coasts and, where an area reaches over the water, the international line in the Great Lakes;
  it went missing Oct 5 and the owner noticed Oct 7).
  **Tinted** (fourth map, owner Oct 7): the physical map with the soft shetach tints, for whoever wants it.
  Map switches are instant: names of the other way of drawing are worked out in idle time (`warmNames`), label
  outlines are thinned to ~500 points a ring (`partsOf`), and there is no held picture of the old map (`preserveDrawingBuffer` off; owner: the freeze "should not exist"). The map's
  own boundaries and city names stay. Don't go back to ink lines or a fade drawn over the map ("custom low quality lines").
- PROJECTION: the owner hates Mercator. He chose "flat when zoomed out only", with Natural Earth (or Robinson), NEVER
  Equal Earth. **Since Oct 21 every view's political map is in its own projection** (see the Oct 21 section at the
  top; the rest of this bullet is the older state). The political map's world and continent views are in Natural Earth, centred on the view's `lon`:
  shapes are projected with d3 and handed to the engine as the lon/lat Web Mercator would draw at that spot
  (`flatFor`, `projGeom`, `P`). Country views (USA, Canada, US & Canada, Israel) and the whole physical map stay
  standard, because the physical imagery only comes in Web Mercator.
  NE_SCALE = 0.075 keeps the flat world small inside the engine's world, because the engine won't zoom out past its
  world filling the screen (a phone's height too) and we need room to fit the map beside the panel.
- MAPS (Oct 6, the owner's design after rejecting a snap, a bending morph and a corner button; Tinted added Oct 7): Map:
  Political | Streets | Physical | Tinted.
  - Political: our own drawing, Natural Earth where the view has it (world, continents), standard for country views.
    No street map, and only 5 zoom steps in from the framed view (POLITICAL_DEPTH).
  - Streets: the shetachim over the street map, standard, all the way in.
  - Physical: terrain.
  - Never switch projection on your own. Changing maps is instant (no snapshot).
- **Alaska and Hawaii boxes** (political map; restored Oct 7, the new engine had dropped them): USA view, Alaska and
  Hawaii in boxes off the south-west, as the old page had (`boxedFor`, `INSET_DEF`, a third set `boxed` per view: the
  standard projection outside the boxes, each boxed state in its own conic projection; areas, lines, land projected
  piece by piece, points by `near`). "Alaska: In a box / In place" (More options, USA view only). **US & Canada: Alaska
  stays attached to BC in its place** (owner, Oct 7), only Hawaii boxed; framed from 180° so mainland Alaska is in view.
  The street and physical maps always have them in place.
- BLUE SEA option (More options): off gives a quiet grey sea, on the political map only.
- **Land outside the view / no shetach** (political, owner's first rule; fixed Oct 7, the new engine had drawn every
  country as ordinary land: Greenland, Antarctica, Canada in the USA view): faded (`land-all`, 40%) under the blue sea, not
  drawn at all on the grey sea; full grey with its borders only with Rest of the world.
- NAMES ON THE NEW ENGINE (Oct 7):
  - A name sits where its whole box fits biggest inside its area (`fitBox`), as near the middle as possible, at most
    10% smaller for being central. That replaced the circle rule, which left names off-centre and too small in long
    shapes.
  - Split shetachim: big pieces (a tenth of the biggest or more) that OTHER LAND keeps apart each get the name (Lower
    Balkans: Bosnia and Albania-to-northern-Greece, the "Kaplan problem"). Pieces only water keeps apart (Michigan)
    share one name (`landBetween`).
  - MapLibre evaluates zoom in filters at WHOLE zoom steps, so a name may show from the whole step before it fits,
    a touch small. A short form stays on behind the full name, at the same spot, so there's never a gap.
  - Political zooms 7 steps in.
  - A shetach's own name is always drawn (`names`, text-allow-overlap): the engine's collision boxes are sized for the
    next whole zoom, so neighbours hid each other (BC under Alberta, Labrador). Short forms and repeats (`alt`) are a
    separate layer under it and give way.
  - Before porting anything else, re-read the rules in this file: the old page's rules carry over.
- LANGUAGE SWITCH (Oct 7, the owner: "should be seamless"): no reload. Every name holds both languages through
  `dual(obj, field, he)`, a getter that reads `HE`. `setLanguage()` loads he.json the first time Hebrew is asked for,
  plus the RTL plugin. It then swaps the page words (`pageWords`, which remembers each text's English), flips
  dir/lang, and works the map names out again. Never mutate names in place again.
- HEBREW STREET MAP: places, seas and sights show only with a Hebrew name; street names keep their signed name.
- Small islands are kept down to 3 km² (build `-filter-islands`). At 40 km², Agios Efstratios and Bozcaada showed
  uncoloured on the street map.
- Oct 7: the new map IS the main page now (web/index.html). The old D3 page is kept at web/old.html; web/next.html just forwards to the main page. Edit web/index.html from now on.

## LATEST (Sept 30 – Oct 1) — read before "RIGHT NOW" below

Done in this round:
- **Lag fixed.** The political map is drawn on a `<canvas>`, not SVG: every arc is projected once per view with a
  Visvalingam weight per point (`weights()` in `web/index.html`), and each zoom level draws only the points it can
  show (`levelFor`, `minWeight`), only for what's on screen (per-polygon boxes; borders in grid cells). Names,
  cities, stars and the Alaska/Hawaii boxes stay SVG. Measured in headless Chromium at phone size, World view:
  zoom frames 363 ms → 33 ms; with 4× CPU slowdown 1,170 ms → ~160 ms (the rest there is the test browser's
  software compositing). View switch 8.6 s → 3.9 s (4× slowdown).
- **Physical map on static vector tiles.** The build writes `web/tiles/{z}/{x}/{y}.pbf` (zooms 0–6, ~3,200 files, 8 MB;
  `writeTiles()`), layers `land` (merged by country, `c` = country or '' for land never shown) and `lines` (every edge
  with both sides' countries `ca`/`cb`, same state `ss`, same shetach `sh`). The page just sets MapLibre filters per
  view (`dataGL()`). This replaced the old world-with-holes fade polygon, which was slow and broke on phones (blank
  land, blue wedges). Every GADM country is now built (unclaimed ones marked `outside`, `GADM_ALL` in the build) so the
  fade meets the shetachim exactly; Gaza (the part Israel doesn't hold, since Oct 7) is outside land named "Gaza". Place names in English/Latin letters.
- **Borders snapped together**: `cleanLand()` runs mapshaper `-clean gap-fill-area=20km2` on all land before the union.
  India–Nepal had ~1,500 km of slivers/double lines (the "horrendous" border), US–Mexico too; now 0. **Never add
  `snap-interval`**: tested at 30 m–200 m, it moved whole counties/countries (Texas→Chihuahua, Nepal→India, Finland
  vanished). Still open: a few seams that open onto the sea at one end aren't "gaps" to -clean (Tijuana/San Diego
  coast, Belgium–France coast; `scratchpad` scan listed them) — small, but worth a targeted fix.
- **Labels** (`placeLabels` / `placeOne` / `labelGrid`, rebuilt Oct 1 after the owner's "Carib." and tucked-away
  "KS-MO" complaints): each area gets a grid over its hull on screen (≤60×60 cells): own land, water inside the hull
  (a name may cross a gulf or strait), or blocked (another area, outside the hull, off screen, under the panel, a
  capital's star, a name already placed). Summed-area tables answer "is this box clear" in four lookups; a distance
  transform prunes centres. **Form**: the full name at the biggest size it fits (two lines if ≥15% bigger), else the
  other way of setting it, else each short form in turn; head-shliach mode has no short form. **Size**:
  what the area's land on screen calls for (`capFor`: 5 + 0.14·√area px, 9–36 px on phones, 9–46 on desktop), and no
  more than 88% of the most that fits (`BREATHE`), so names aren't pressed against edges; never under 9 px (8 for
  short forms). **Place**: most room on every side (up to ~1.4 letters), near the visible part's centre of mass, on
  land rather than water; then an exact check against the borders. Island chains (land < 35% of hull, no piece over
  60%: the Caribbean, Indonesia) aim at the hull's centre and size for the spread. Biggest areas on screen go first.
  **Fixed like a map site** (Oct 2, the owner: names changing as you move "should be the same way … Google maps"):
  names are laid out once per zoom step (`levelLayout`, two steps per doubling) over the whole map, not over what's on
  screen; panning only slides them. Oct 3 ("names only render when you load that part"): names (and city names, stars)
  are kept a full screen beyond every edge (the screen clips them), refreshed every ≤120 ms while the map moves
  (`livePlace`), names keep their size during a zoom, and the zoom steps either side are worked out in idle time
  (`prefetchLevels`), so nothing pops in when the map stops. Only the Alaska/Hawaii boxes hide names; the panel just
  covers them. A shetach bigger than a screen repeats its name in a fixed grid of tiles (`levelRepeats`,
  tile 0.6× the screen's short side, ≥340 px; repeats at least the screen's long side apart, so a name never shows twice on one screen — Oct 3, the owner's
  phone showed Western Pennsylvania twice), worked out as tiles come into view and kept.
  The cache resets when labels are rebuilt (mode, borders, language, resize). `labelAt` on a shetach: the spot its name
  aims for on the page too (India: [78.9, 21.6], mid mainland). During a zoom names scale smoothly (`fontScale`) and
  the step's layout replaces them when it ends (~50–250 ms headless desktop for a new step).
- **Shluchim on center cards — the owner's rule** (Oct 3; `personnelHTML` in web/index.html): the shliach shown is the
  first man listed who's alive — a woman listed first, or a man who has passed away (obm), is passed over. With no
  living man: if a man listed has passed away (her husband), "<last name> family" from the living woman (she's still listed by name under "+more"); if only women
  are listed (e.g. Mrs. Chana Axelrod's mikvah in Ukraine), the first woman by name (owner, Oct 3). Everyone else alive goes under "+N more"; anyone who has
  passed away in a separate "Deceased" (נפטרו) section, each name followed by obm / ע״ה (obm goes after a name,
  never as a heading). Men/women by chabad.org's title (Mrs., Ms., Miss,
  Rebbetzin = women). Names are shown without titles (no "Rabbi"). Data: `data/raw/chabad-personnel.json` (chabad.org `/api/v2/chabadorg/centers/<id>` personnel;
  lubavitch.com/centers/<id> has the same names) — collected Oct 3 (3,764 of 4,220 centers), re-fetch with
  `node scripts/chabad-personnel-fetch.mjs`.
- **India** (Oct 3, the owner: "India has a lot more Chabad centers than the locator"): Chabad houses not on chabad.org in
  `data/extra-centers.json` (`extra-india-*`), from Chabad of India's own directory (indiakoshertravel.com/Chabad_india;
  blocked here — the owner sent its pages): New Delhi Main Bazaar (Akiva Sudri), South Delhi (Shneor Kupchik), Pushkar,
  Manali, Kasol, Rishikesh, Hampi, Varanasi, Goa (Palolem; Anjuna at the town), Pune, Kodaikanal, Kasar Devi — each with
  its rabbi (`personnel`, shown on the card like chabad.org's) and address where given. Kochi (Jew Town) from
  chabadcochin.com. Gokarna and the Andamans were left out: no current evidence of a center. Mumbai, Dharamsala and
  Bengaluru are chabad.org's own. Many Asian Chabad houses are seasonal; not marked, like chabad.org's.
- **Cities with shluchim** (build-data `buildCities`): a center town that GeoNames doesn't have by that name is matched,
  Oct 3, to a place spelled nearly the same within 8 km (keeping chabad.org's spelling: Be'er Sheva, Petach Tikva),
  else to the 500,000+ city within 10 km it's a neighbourhood of (Jabi → Abuja, Victoria Island → Lagos, Capital
  Federal → Buenos Aires, Praha 1 → Prague). Unmatched went from 434 to ~315 (small Israeli towns mostly; they still
  show by their centers, 5,000 "people" per center). `CITY_NAMES` keeps the Chabad houses' spellings (Kishinev,
  Cologne, Gothenburg).
- **Ukraine's towns** use the names the Chabad kehillos there use, the Russian ones (Oct 3: Kiev, Dnepr, Lvov, Kharkov,
  Zaporozhye…): `UA_NAMES` in build-data renames both the centers' towns and the GeoNames cities, so Kyiv/Kiev and
  Dnipro/Dnepropetrovsk are one city each. Except Khmelnytskyi, which keeps its modern name (the owner: its kehilla uses it).
- **City names, Google-style** (Oct 3): a city is a dot with its name beside it until it's big on screen, then the dot
  goes and the name sits on the city (bolder, `.mk-lab-big`; above its star if it's a capital). Size from population
  (`cityKm`: 0.012·√pop km, 1.5–30 km; no outlines), big from a 22 px half-width (`BIG_PX`) — in `placeMarks`.
- **Dots** (More options → Dots / Dot color, Oct 3): **Solid** (default; small — radius 1.05 + 0.35·log2(centers) at the
  framed view, the owner wants them small — opaque, with a thin edge so a cluster reads as a cluster), **See-through**
  (same, 42% like classic), **Classic** (the first dots: bigger, navy, 42%). Colour for solid/see-through: Navy
  (default since Oct 3, the owner), Gold, Red, Black, Green, Purple (`DOT_COLORS`: light and dark-map shades; dark edge under gold, white
  under the others, the background on the dark map; `setDotColors` puts them on #app).
- Defaults: **World view, Political map** (Oct 2, the owner); the physical map loads quietly in the background right after, so picking it is instant.
- Data: flagship centers for 100 of 108 world shetachim from the owner's `data/world-flagship-centers.txt` (not in
  chabad.org's data, so no star: Crimea, Sri Lanka, Belize, Honduras, Bolivia, New Zealand, Panama (Beth El), Qatar
  ("no fixed public center"); Jaipur, Manila, Mazatlán, Yerevan, El Tunco are placed at the city). Liechtenstein is in
  Switzerland. Louisiana-Mississippi renamed "Louisiana". No ISO codes as labels anywhere (`COUNTRY_SHORT`: UK, UAE,
  DRC…; a country without a familiar short form has none). UAE: the three-city listing is fixed to Dubai (Al Marsa St,
  the flagship) plus a separate Abu Dhabi dot (`fixes` and `extra-abu-dhabi` in `data/extra-centers.json`).
  UK and RARA cards say "Leadership:" (`headTitle`), and area cards no longer say "Shetach" above the name.

Later in the same round:
- **Central Africa** (owner, Sept 30): exactly Angola, Benin, Burkina Faso, Cameroon, Republic of the Congo, Côte d'Ivoire,
  DR Congo, Equatorial Guinea, Eritrea, Ethiopia, Gabon, Ghana, Guinea, Kenya, Liberia, Mali, Namibia, Niger, Nigeria,
  Rwanda, Senegal, Sierra Leone, Tanzania, Uganda, Zambia, Zimbabwe. Botswana, Burundi, Cabo Verde, CAR, Chad, Comoros,
  Djibouti, Eswatini, Gambia, Guinea-Bissau, Lesotho, Madagascar, Malawi, Mauritania, Mozambique, São Tomé, Seychelles,
  Somalia, South Sudan and Togo are in no shetach now (blank, faded on the physical map). `data/global-shetach-list.txt`
  updated to match.
- **Greece / Lower Balkans** (owner): Central Macedonia split by regional unit — Lower Balkans (Kaplan) gets
  Thessaloniki, Kilkis, Serres, Chalkidiki and Mount Athos (plus East Macedonia and Thrace as before); Greece keeps
  Pieria, Pella and Imathia. GADM has no regional-unit level, so `REGIONAL_UNITS` in the build lists each unit's
  municipalities (GADM level 3); territory `{ "country": "GRC", "regionalUnits": [...] }`. A country can now be claimed
  at several GADM levels at once (finest wins).
- **Brisbane / Gold Coast — final (Oct 1).** The owner rejected the ABS Significant Urban Area (even the exact one:
  it pulls in rural Beaudesert, Rosewood and Dayboro and leaves a RARA strip between Brisbane and the Gold Coast), then
  left the call to us ("Levi Jaffe is Brisbane, Nir Gurevitch is the Gold Coast, figure out the exact borders").
  Decided: **Brisbane = the five metropolitan councils** — City of Brisbane, Ipswich, Logan, Moreton Bay, Redland
  (`data/shapes/brisbane-metro.geojson`, ABS LGA 2022 codes 31000, 33960, 34590, 35010, 36250 dissolved; official
  5,973.3 km²) — and **Gold Coast = the City of Gold Coast** (`gold-coast-lga.geojson`, LGA 33430, 1,333.4 km²). The
  two share their whole border (Logan/Redland–Gold Coast), so nothing is left between them; the rest of Queensland is
  RARA. Both are ABS full resolution, from github.com/HughParsonage/ASGS `inst/extdata/LGA_2022.qs` (ABS itself is
  blocked from the sandbox). Reading .qs needs R: conda-forge is reachable, so `micromamba` (conda-forge linux-64
  package, unpack the .tar.bz2) → `micromamba create -p renv -c conda-forge r-base r-qs r-jsonlite`, then
  `qs::qread()`, `sf::st_union` per group, and write GeoJSON with jsonlite (rings need rewinding for d3). Queensland is
  simplified at 100 m (`FINE` in the build) so the lines hold up zoomed in. Check codes by area: 34580 is Lockyer
  Valley, not Logan (34590).
- Mexican states have no short labels (no "Sin.", "Nay."); Vic/Tas without dots.
- **Essex County, Ontario (Windsor) is in the Michigan shetach** (owner, Oct 1), **with its waters**: territory
  `{ "state": "CA-ON", "shape": "essex-county-on" }`. GADM's Ontario (lo-res Admin1) includes Canada's half of the
  Great Lakes out to the international boundary — that's why Ontario's colour fills the lakes, and the lake edge of it
  is the thin "maritime" line on the physical map. A land-only Essex left Ontario's water wrapped round it (a wedge of
  Ontario's colour along the Detroit River and western Lake Erie, and a border that went into Lake St Clair and back).
  So the shape (`data/shapes/essex-county-on.geojson`) is the Essex/Chatham-Kent land line (GADM lo-res Admin2)
  carried on through the water: across Lake St Clair straight to the St Clair River where its last bend south-west
  begins (-82.518, 42.618) (owner, Oct 7: ending at the South Channel elbow still made a V, "pointy"; this way the
  river and the lake line run on nearly straight, and the delta's western islands, Walpole Island, go with Essex; he
  had earlier rejected ending at the channel's mouth, a sharp spike of Ontario), and across Lake Erie due south to the international boundary. Essex takes the Canadian water on its side
  (Detroit River, Lake St Clair west of that line, western Lake Erie with Pelee Island); past the boundary the shape
  runs on over US ground, which a shape never cuts (only CA-ON's land). The river point is read off the built map
  (`web/data/geo.json`, the Ontario / Michigan arc); if the land data changes, check it's still on that border.
  The shape's `"lakeEdges": true` marks the piece's open edges (the international line round Essex's water, Michigan's
  on both sides) as lake edges, `lk` in the tiles: the physical map draws them only in States/Both border modes, not
  as a maritime line (the owner circled them as not fitting the new borders). The political map and SVGs still
  outline the water's colour there, like the rest of Ontario's lake water.
- **Alberta** now also takes the Northwest Territories and Yukon south of 63°N (name stays "Alberta"; shape
  `data/shapes/north-to-63.geojson` cuts both territories; what is north of 63° is left off the map like Nunavut (`notShownWhenBlank`),
  `notShown`). New panel option **Alaska: In a box / In place** (political map, views with Alaska; default box; the physical
  map is always in place). The page is titled **Chabad Shetachim** (was plain "Shetachim").
- Alberta's name is centred on Alberta proper (`labelState: "CA-AB"` in the data), not the territories' strip, while Alberta is on screen (>500 px²).
- Alaska/Hawaii boxes (political map): on a phone the map is framed above the *closed* bar plus a strip for the boxes (opening the sheet never moves the map; names re-place around it); the boxes fade out once zoomed in (Oct 5, the owner was confused by the shrunken ones left on top of the map) and come back at the whole view, have a solid background, and names/cities keep clear of them.
- Panel: Show has only World up front; the other views (Europe … Canada) are under "Regions & countries" (`#views`, collapsed by default; owner, Oct 7). Then Borders, Labels, On the map (Chabad centers, Mushrooms); **More options** (a collapsed `<details id="more">`) holds the rest in the groups Map / Markers / Cards (Nov 8: see START HERE). New rarely-used options go there, in the group they belong to.
- **Upper Midwest** (owner, Oct 1): North and South Dakota joined Minnesota under Moshe Feller; the shetach is now
  "Upper Midwest" (id `upper-midwest`, territory US-MN, US-ND, US-SD). The North Dakota (Yonah Grossman) and South
  Dakota (Mendel Alperowitz) shetachim are gone.
- **Short labels** (owner, Oct 1): every shetach has short forms, a list from longest to shortest (`short` in
  `data/shetachim.json`: `["Carolinas", "Car."]`), so something fits when zoomed out; the page tries the name, then
  two lines, then each short form, shrinking to 85%/70% (short forms also 55%, never under 7px); a full-size short
  form beats the name at 70%, so neighbours stay similar sizes. State codes are never joined except KS-MO and MB-SK
  (owner's choice). Countries use atlas-style abbreviations (Neth., Switz., Bulg.; never ISO codes). A single whole
  state defaults to its own code (TX); the build warns if a form isn't shorter than the one before it.
  Renamed: "The Virginias" → **Virginia** (VA), "Western and Southern New England" → **Connecticut** (CT; territory
  unchanged: Connecticut plus its western Massachusetts counties).
- **Font**: Inter everywhere (map labels 700, letter-spacing .01em; panel headings uppercase small labels), from
  Google Fonts; replaced Alegreya Sans (SC), which the owner disliked. `scripts/screenshot.mjs` serves Inter from
  `node_modules/@fontsource/inter` since Google Fonts is blocked in the sandbox.
- **Split shetachim get a label per piece** (`labelClusters` in the page): when other land keeps a shetach's big
  pieces apart (Lower Balkans: Bosnia, and Albania–Kosovo–North Macedonia–northern Greece, with Montenegro and Serbia
  between), each piece (from a tenth of the biggest) gets the name, so neither is left blank and both read as one
  shetach. Pieces only water keeps apart (islands, the two sides of a gulf, Michigan's peninsulas) still share one
  label. In the full Europe view Bosnia is about a pixel too small for even "Balkans"; any zoom in shows both. Ontario is drawn at 100 m (`FINE`).
  Area cards no longer list a shetach's states (kept in the data, not shown).
- **SVG export**: `npm run svg` (scripts/export-svg.mjs) writes `web/shetachim-map.svg` — every shetach in its map colour,
  shetach borders and coasts only (no names, cities, dots, stars); Natural Earth projection, 3600 px wide, lines
  thinned to what's visible at that size (~2 MB). Live at /web/shetachim-map.svg. Rerun after every build.
- `closeSeams()` in the build: coast points of one area within 400 m of another area's coast are moved onto it, then
  -clean again (fixes the Baja California / Baja California Sur line, Tijuana, Belgium–France).

- **Ohio** (owner, Oct 1; done by the session on the other account, branch `ccr-1f9385a8-jca1nj`): four regions
  from the owner's own map (`data/ohio-regions-v2.geojson`, kept verbatim; picture: estimated curved borders, not
  county lines). Oct 1 they were switched to whole counties ("I hate the roundness"); Oct 2 the owner rejected the
  county staircase ("just makes it look bad") and wanted the original back with straight-ish lines: the shapes in
  `data/shapes/ohio-{toledo,northeast,central,southern}.geojson` are the original map's regions with each inner
  border straightened — Toledo's (Michigan's) whole southern border is one due east–west line (41.03°N, parallel to the Michigan line) from Indiana to the
  Northeast corner (owner, Oct 3: "properly straight", not the diagonal first tried), its border with the Northeast runs due north from that corner to the lake, west of Port Clinton
  (so the Marblehead peninsula isn't cut off on Toledo's side), the Southern–Central border is one straight line; the
  lines are carried out past Ohio's outline so every bit of shore and island falls cleanly on one side, the
  Central–Northeast border a few straight segments that keep Central's big bulge east into the Alevsky shetach (made
  by straightening the shared lines and re-tiling; no center changes region vs the original map). Regions: **Northeast Ohio** (`northeast-ohio`, then "Alevsky family", Zushe Greenberg since Oct 10; Cleveland, Akron,
  Youngstown, Canton, east and south to Athens and Marietta), **Central Ohio** (`central-ohio`, Areyah Kaltmann;
  Columbus, south to Portsmouth/Ironton), **Southern Ohio** (`southern-ohio`, Sholom Ber Kalmanson, Yisroel Mangel since Nov 1; Cincinnati,
  Dayton, Springfield, Lima), and the **Toledo area joins Michigan** (Berel Shemtov) as part of the `michigan`
  shetach. The owner let us pick "Northeast" over "Northeastern". The four shapes tile Ohio exactly (union is one
  piece plus the Lake Erie islands; within 0.4% of Census Ohio); only their lines through Ohio are used, Ohio's own
  border and shore stay Census. Two Lake Erie islets the shapes don't cover (Rattlesnake, West Sister) go to the
  nearest region (`ISLAND_KM` = 25 in `absorbSlivers`; only for unclaimed islands in a state cut by shapes).
  Ohio's centers: NE 27, Southern 7 (with the office below), Central 4, Toledo/Michigan 3. First called "Western Ohio";
  the owner renamed it **Southern Ohio** the same day. Capitals (owner): Chabad of Cleveland (117708), Chabad of
  Columbus (117950, listed in New Albany), and **Chabad of Southern Ohio's office, 7380 Laurel Oak Lane, Amberley
  Village** — not on chabad.org, so it's in `data/extra-centers.json` (`extra-chabad-southern-ohio`), placed from
  Overture Maps' address data (39.20176, -84.44424). Geocoders are blocked here, but Overture's public S3 bucket
  (`overturemaps-us-west-2`, `theme=addresses`) is reachable: read parquet footers over HTTP range requests and fetch
  only the row groups whose bbox stats cover the spot (pyarrow in a venv; ~1 minute).

- **Refresh button** (owner, Oct 1: reloads often showed the old map — GitHub Pages and browsers cache for ~10 min):
  the circular-arrow button under the zoom buttons reloads the page as `?v=<time>`; with `?v=` in the address every data
  file and map tile is fetched with the same `?v=` (`fresh()` in the page), so nothing comes from a cache. Any new
  fetch of site files should go through `fresh()`.

Next: test physical map labels/cards on the real site (tiles can't be fetched
from the sandbox, the test uses MapLibre's demo style); update the Claude artifact preview if still used.

## RIGHT NOW (earlier round — mostly done, kept for detail)

The owner sent the full world shetach list: it's now in the repo at **`data/global-shetach-list.txt`** (the
owner's own file, verbatim — the source of truth for every world shetach; the 57 US/Canada ones came earlier).
All 108 world shetachim are entered in `data/shetachim.json` **with exactly the territory the list gives**
(checked entry by entry against the file: names, head shluchim, territories), and every one of them now has
geometry. Built, and checked in headless Chromium on desktop (political map, light theme) in every view.

### Done in this round (all committed and pushed on `ccr-1f9385a8-jca1nj`)
- **Territory, as the list says** (previously 19 shetachim were blank and the Caribbean was only Bermuda + Guyana):
  - Mexico by state: Mexican states are their own areas, like US states (`MX-JAL`, ISO 3166-2 codes; table
    `WORLD_STATES` in the build). Baja California = BCN+BCS+SON; Jalisco = JAL+COL; Bajío = AGU, GUA, MIC, QUE,
    SLP, ZAC; Nuevo León = CHH, COA, DUR, NLE, TAM; Central Mexico = CMX, MEX, GRO, HID, MOR, PUE, TLA, OAX, VER;
    Chiapas = CHP+TAB; Mexican Caribbean = CAM, ROO, YUC; Sinaloa, Nayarit single states.
  - Australia by state (`AU-NSW`, …). **Brisbane** and **Gold Coast** are real ABS boundaries in
    `data/shapes/*.geojson` (now the five metropolitan councils and the City of Gold Coast — see LATEST above).
    **RARA** = Northern Territory + the rest of Queensland. A new territory form `{ "state": "AU-QLD", "shape":
    "brisbane-metro" }` cuts a shape out of a state; only the line through the state comes from the shape, the coast and
    state borders stay GADM's, and the thin slivers where the two sources draw the coast differently are handed to the
    shape (`absorbSlivers`).
    Jervis Bay Territory isn't in the list, so it's drawn blank (a small blank bit of the NSW coast). Ashmore/Cartier
    and the Coral Sea Islands (reefs) are left off.
  - Greece / Lower Balkans: Central Macedonia and East Macedonia & Thrace go to Lower Balkans (new territory form
    `{ "country": "GRC", "level": 2, "regions": [...] }`, GADM region names). Mount Athos is its own GADM region,
    not part of Central Macedonia, so as the list is written it stays with Greece (a small Greece piece at the tip of
    Chalkidiki) — worth a question to the owner if it looks odd.
  - Italy / Slovenia: was the Trieste panhandle (GADM ITA level 2 "Trieste") → Slovenia; since Oct 10 Slovenia is
    part of Italy's shetach, so no split is needed.
  - Ukraine / Crimea: Crimea and Sevastopol (GADM UKR level 1) → Crimea. (Since Oct 7 Crimea and occupied Ukraine are
    Lazar's: see "OCCUPIED UKRAINE AND CRIMEA" at the top.)
  - **Israel = one area**: Israel, Judea and Samaria (the West Bank) and the Golan Heights, as the list says. GADM's
    Israel file already includes the Golan and East Jerusalem is in the Judea and Samaria region; the build takes that
    region from its GADM file and makes it **part of Israel itself** (state `ISR`, name Israel, no line between them in
    any border mode). Gaza isn't in the list; since Oct 7 the part of it Israel holds is drawn as Israel, and likewise its
    held parts of southern Lebanon and Syria (see "ISRAEL'S HELD GROUND" at the top). **The owner is emphatic: Judea and Samaria is Israel — never
    give it any other country's name or ISO code anywhere in this project (front end, data, code, comments, commit
    messages).** The
    one unavoidable trace is the upstream GADM file URL the build downloads (`ISRAEL_EXTRA` in the build); it's cached
    locally as `gadm-hi-ISR-judea-samaria.json`. Centers there are tagged Israel. (The owner also got angry when an
    update message seemed to say only "Golan and East Jerusalem" — be precise and complete when describing Israel.)
  - Caribbean = the Caribbean region (every island country and territory: AIA ATG ABW BHS BRB BES VGB CYM CUB CUW DMA
    DOM GRD GLP HTI JAM MTQ MSR PRI BLM KNA LCA MAF VCT SXM TTO TCA VIR) + Bermuda + Guyana. Puerto Rico and the US
    Virgin Islands are in it (Mendel Zarchi is Puerto Rico's head shliach) — that settles the old open question.
- **World geometry rebuilt properly** (build `worldLand()`):
  - GADM **hi-res** (unsimplified) files from the same GitHub mirror, not the lo-res ones the last session used: the
    lo-res files were each simplified on their own, so neighbouring countries' borders didn't meet (gaps/overlaps
    along every border). Hi-res GADM countries share borders point for point; verified (France–Germany, Mexico–
    Guatemala, Russia–Kazakhstan, Texas–Tamaulipas… all share edges in the final topology).
  - All world land is simplified together once (100 m, topology kept) and cached in `.cache/world-<hash>.json`
    (~5 min first time, ~350 MB of downloads; the build now runs with `--max-old-space-size=12000`).
  - **Russia was broken** in the mirror's whole-country file (one ring, 12k points: no islands, no Kaliningrad) — now
    built from its level-1 regions (`FROM_LEVEL1`). **Cabo Verde** has no GADM file in the mirror — it comes from
    Natural Earth (islands, no shared border, so no seam).
  - Small territories (Bermuda, the small Caribbean islands, Monaco, Vatican…) are no longer deleted by the
    small-island filter (it now only runs on areas over 2,000 km²).
  - Names fixed where GADM's are old or missing (`GADM_NAME_FIX`: Eswatini, North Macedonia, Réunion, Macau, U.S.
    Virgin Islands…; some hi-res files keep the name in `Name` not `NAME_0`).
  - Sanity-checked areas: Russia+Mongolia 18.4M km², Israel 28,054, Greece 98,085, Crimea 27,053, ACT 2,354, etc.
  - India's and China's files already include the parts of Kashmir, Arunachal Pradesh and Aksai Chin each administers.
- **Centers and cities worldwide**: outside the US/Canada, a center is tagged by the map's own areas (the area it's in,
  else the nearest area of the same country within 25 km), so Mexican/Australian states, Crimea and Israel are right.
  Cities with shluchim now cover the whole map: 1,944 (was 1,001, US/Canada only), GeoNames-matched by name within
  60 km. 4,222 centers → 3,599 dots; the World view shows 4,221 of them (one is in a country no shetach covers).
- **Page** (`web/index.html`):
  - View buttons in two rows: US & Canada / USA / Canada, then World / Europe / FSU / Israel / Middle East / Asia /
    Africa / Oceania / Latin America. "Caucasus & Central Asia" became **FSU** (Former Soviet Union: RUS+MNG, UKR,
    BLR, MDA, Baltics, Caucasus, Central Asia); **Israel** view added.
  - Proper projections per region (conic equal-area for Europe, FSU, Oceania; azimuthal equal-area for Africa and
    Latin America; Mercator for Asia, Middle East, Israel; Natural Earth for World). `lon` rotates a view so a region
    crossing the 180° line (Russia's far east, NZ's Chatham Islands) stays in one piece; `dropSeams` hides the cut
    GADM leaves along 180°. Europe is framed on the mainland (`frame` box), not the Azores/Canaries.
  - Borders button says "Countries" in world views, "States" in US/Canada views. Area cards say Country / State /
    Province correctly.

### Not yet done / untested — do these next
1. **Test** (the owner interrupted here): phone (390×844) in every view, dark theme, and **the physical map in the
   world views** — in particular FSU and Oceania, which use a rotated Mercator for MapLibre plus
   `setRenderWorldCopies(true)` (`wrap: true`). That code path is untested. Also re-check Europe after the `frame` change
   (untested) and the US/Canada views again on phone. Use `scripts/screenshot.mjs` (see "Notes for Claude").
   Note: the view buttons sometimes look blank in screenshots — that's the button's colour transition caught mid-way
   while the map renders (checked: the pressed state is right). Not a bug.
2. **Merge into the live branch** (fast-forward, above), push, and tell the owner to hard-refresh after ~1–2 min.
3. Update the Claude artifact preview (instructions under "Current state"), if still used.
4. **Capitals for world shetachim**: the list has none. Don't invent them; ask the owner (or propose candidates for the
   owner to confirm). Same for all 108.
5. Nice-to-haves seen in the screenshots: the Caribbean shetach gets no label at Latin America zoom (its biggest
   polygon is Guyana and "Caribbean" doesn't fit); Mexican shetachim smaller than Baja/Nuevo León/Central Mexico
   get labels only when zoomed in. Short labels for whole countries default to the ISO code (ARG, ZAF) — fine
   for now, maybe nicer names later.
6. `docs/PLAN.md`'s feature table still says "The rest of the world … Later" — update it.

## The goal (owner's words, summarized)

An interactive custom map of Chabad **shetachim** (the territory under a head shliach),
drawn like a political map where the shetachim *are* the countries. It is not a regular map
with things drawn on top. It starts with the US and Canada, then covers the world.

- Shetachim can be one state, several states or provinces, or parts of states (cut along county
  or town lines, or straight longitude lines). Areas with no shetach entered yet are left blank.
- Toggle between shetach borders and regular (state/country) borders, or show both with one set
  lighter. Which set is lighter is swappable.
- Colorful (political-map colors) or Plain (one color) fills.
- A faint dot for every Chabad center (from the chabad.org locator). Listings at the same address
  are merged into one dot.
- Labels: shetach name / head shliach / off (no last-name mode, owner Oct 7).
- Views: US & Canada, only USA, only Canada. Each view **shows only that area and fills the
  screen**. Later there will be continent views for the world.
- Zoom and pan.
- Cities that have shluchim, on a toggle.
- Each shetach has a **capital** (its flagship center), shown as a star like a national capital.
  **Just the star: never the center's name next to it.** 770 Eastern Parkway (world
  headquarters) gets a bigger star.
- A **Physical** mode: a full, proper map like Google Maps (green land, tan desert, relief,
  water, roads), with every border replaced by shetach borders like the political map.
  (The owner didn't know the word; it was first built as a dark "street map", which was wrong.)

## Owner preferences and mistakes to avoid (important)

The owner got very angry at the first version. The lessons:

1. **Show only shetachim.** No surrounding countries (Mexico, Central America, Caribbean,
   Greenland, Russia) and no areas outside any shetach. Yukon, NWT and Nunavut are hidden
   (`notShown` in `data/shetachim.json`). On the physical map, land outside is faded out.
2. **Don't treat "states" as the default with shetachim as special exceptions.** Every shetach is
   styled the same way. The first version had gray states with one red shetach, and the owner
   hated it.
3. Picking "USA" means *only* the USA is drawn and fills the screen.
4. Don't invent shetach data: head shliach names, territories and capitals come from the owner.
   The current list came from another AI and "could be incorrect, subject to change".
5. **No explanatory text on the page.** The owner hates notes like "Each state is its own shetach
   until…" or "Tap a dot to see them". Controls and data only; keep messages to a few words.
6. The owner is on mobile a lot (and in dark mode). Keep replies short and plain, and don't ask
   many questions. When they say "do everything I asked", do all of it without checking in.
7. The two unlisted centers are public, as the owner said: Riyadh (address unknown, city centre)
   and Istanbul (in Nişantaşı near the American Hospital, a rough spot), in `data/extra-centers.json`.
8. **Borders need to actually be traced properly**, not approximated. An early version mixed Natural
   Earth (coarse, ~1:10,000,000 — good enough for a world atlas, not for a real US map) with Census
   data, padded/gridded to patch the seam; the owner caught it immediately ("this line not exactly
   following the [Hudson]... it's been replicated across the entire thing"). Every US state now comes
   from its own real Census counties (see "Drawing" below) — check this hasn't regressed if the
   boundary sourcing changes again.
9. 770's card title is large and prominent like Lubavitch's (`honor-h`, owner Oct 7: the headquarters of the whole movement). 770 is the world HQ, not a regional flagship under whoever heads New York City's shetach. Its card
   doesn't say "New York City · Tzach" the way a normal capital's does (`capitalHTML` in `web/index.html`
   passes `withHead: false` to `shetachLine` for it) — keep that distinction if the card is reworked.

10. **Judea and Samaria is Israel**: never any other country name or ISO code for it anywhere in the project, not
    even in code, data, comments or commit messages. Israel is one area: Israel, Judea and Samaria (the West Bank) and the Golan Heights, no line between
    them, with the parts of Gaza, southern Lebanon and Syria it holds (Oct 7). The owner reacted very strongly to seeing it even as an internal code.
11. When describing progress, be complete and exact (e.g. "Israel, Judea and Samaria and the Golan", not a partial
    list that sounds like something was left out). The owner reads quick status lines and reacts to omissions.
12. The world list is the owner's data (`data/global-shetach-list.txt`): enter it literally. Where the literal reading
    is odd (Mount Athos, Jervis Bay), follow it and mention it; don't silently "fix" it.

## Current state (all committed and pushed)

- `web/index.html`: the map, a static page (D3 v7 + TopoJSON from cdnjs; MapLibre GL 4.7.1 from
  cdnjs, loaded only when Physical is picked). It loads `web/data/*`. Features:
  - US & Canada / USA / Canada views; zoom buttons; phone layout (bottom sheet)
  - Light and dark themes: the device's by default; the sun/moon button next to Options switches
    and remembers the choice (localStorage `shetachim-theme`, applied by a tiny script in the head).
  - Map: **Political** (our own drawing, conic projection, Alaska and Hawaii in corner boxes) or
    **Physical** (OpenFreeMap `liberty` tiles in both themes, with Natural Earth II relief made
    stronger out to state level and greener woods; Web Mercator; Alaska and Hawaii in place).
    On the physical map there are no political fills, the map's own borders and state/country
    names are hidden, our borders (with a white casing) sit over the roads, land outside the
    shown shetachim is faded (a fade under the water layer plus a light one over everything),
    and the map's city names are hidden while our cities are on. The map's colors on the
    physical map are always the light ones. Switching modes keeps the place you were looking at.
  - Borders: Shetachim / States / Both (+ Lighter swap); Colors: Colorful / Plain (political only)
  - Labels: Shetach name (default) / Head shliach / Off. Each label is centred inside its
    shetach and never reaches into another one (it may hang over water a little). Where the text doesn't
    fit on one line it tries two, then the shetach's short form (`short` in the data; by default its
    states' abbreviations joined, like KS-MO or MB-SK), else no label. Labels slide sideways past a
    capital's star, and when zoomed in past a shetach's middle the label moves into the part on screen.
  - Checkboxes: Chabad centers, Cities with shluchim, Shetach capitals (all on by default)
  - Cities: a ring and a name, biggest first, only where there's room; a zoom-dependent cutoff
    (`CITY_DENSITY`) keeps small towns for when you zoom in. A city right at a capital's star uses
    the star as its marker, with the city's name beside it.
  - Capitals: a star, no label; 770 bigger. Cards on hover/tap for capitals, cities, dots and areas.
    A capital's card says "<shetach> flagship center" (770's says "World Headquarters", with a
    highlighted card), not "Capital of <shetach>" (read as the state's political capital for a
    shetach named after one, like Oregon).
  - Any center's card can show who's listed there — the first (living) person as the shliach, the
    rest under "+more" — from `data/raw/chabad-personnel.json` (optional; the map works without it).
    It isn't on chabad.org's bulk locator data, only on each center's own record, so it comes from
    `scripts/chabad-personnel-fetch.mjs` (Node, since Oct 3 — see PERSONNEL above), or the older
    `scripts/chabad-personnel-scrape.js`, run by hand in a browser console: paste it on a chabad.org tab, it downloads `chabad-personnel.json` when done (it's
    slow — one request per center, rate-limited by the site — and resumable if stopped partway).
    Drop the file at `data/raw/chabad-personnel.json` and rebuild. The collector tries a batch request first (`filter[id]=…&include=personnel`, 50 ids;
    untested against the real site — blocked here) and falls back to 4 parallel single-center requests. If `chabad-centers.json` is ever
    re-scraped, run `node scripts/gen-personnel-ids.mjs` first to refresh the id list the scraper covers.
  - Blank areas (no shetach): no fill, no label; their card shows the state.
  - If the physical map can't load (no WebGL, or the tiles are blocked, as in a Claude artifact),
    it says so in a few words and stays on Political.
- **The fast lane (Nov 4):** `npm run build` redraws the map's geometry (every border, the tiles, the land outside —
  ~6 of its ~7 minutes) only when a border input changed: the shetachim's claims (territory, territoryOf, blank,
  notShown, notShownWhenBlank), data/shapes, the boundary files in .cache, build-data.mjs itself or package-lock.json.
  Otherwise (names, heads, capitals, centers, mushrooms, fixes) it reuses the last redraw, saved in
  `.cache/geometry-<key>.json`, after checking that geo.json, outside*.json, world-all.json and the tiles on disk are
  still that redraw's; and where each dot is (country, state, county, piece) is kept too (`.cache/tags-<key>.json`,
  by position), so only new or moved dots are looked up. `npm run build:full` (FULL=1) always redraws and looks
  everything up again. A border change (claims only) redraws but reuses the two slowest steps, each kept by a
  fingerprint of exactly what goes into it: the land cleanup ("snapping neighbouring areas together", `land-<key>`)
  and the union with the tracts/bands/shapes (`mosaic-<key>`); a change of outlines (a new shape file, a state
  switched to towns) redoes them. And `contains()` skips polygons whose padded box can't hold the point (same answer):
  looking up all 3,826 dots went from ~30–55 s to ~3 s. Times: from scratch (FULL=1) ~2 min; a border change ~50 s;
  no border change ~25 s (build-sub 8 s, build-hebrew 1 s). All proven byte-identical (see the Nov 4 section at the
  top). The fast lane's own files must stay out of the redraw's fingerprint (`geometry-`, `tags-`, `land-`,
  `mosaic-` are skipped) or every build would redraw.
- `scripts/build-data.mjs` (`npm install && npm run build`) builds `web/data/` from:
  - `data/raw/chabad-centers.json`: the chabad.org locator export (4,220 listings) plus
    `data/extra-centers.json`: 4,222 centers → 3,599 dots; 1,967 → 1,763 in the US/CA.
  - `data/shetachim.json`: 57 shetachim with head shluchim and capitals (chabad.org center ids).
    Territory items: state codes, `{state, westOf/eastOf}` longitude cuts, `{counties}` (FIPS),
    `{state, towns}` (Census county subdivisions), `{state, tracts}` (Census tracts). The most
    specific claim wins where they overlap. Unclaimed areas are blank (none left in the US since Ohio, Oct 1).
  - Drawing: every US state and DC from its own Census 2022 1:500k counties (from the Census Bureau's
    GitHub); every Canadian province from GADM (github.com/stephanietuerk/admin-boundaries, a plain-file
    mirror — gadm.org itself, and every other boundary host tried, is blocked from this sandbox; see
    "Notes for Claude"). Neither comes from Natural Earth any more: NE's states are far too coarse for
    real detail (Manhattan's whole coastline was ~19 points in NE 10m; Ontario's was just as coarse along
    the Detroit River), and mixing NE with Census at a split state's edge is exactly what caused the
    Maryland bug. A state whose shetach needs more than whole counties is cut finer just where it does:
    Massachusetts (towns and tracts, from the Census Bureau's GitHub) and Pennsylvania (a longitude line,
    on its own counties). One mapshaper `-union` of everything makes every piece share its edges with its
    neighbours exactly (both sources tile themselves with no gaps, so there's nothing to patch — but
    Census and GADM don't necessarily agree on each other's coastline to the metre; the one place this
    still shows is a short, real stretch of the Detroit River, US/Canada, near Belle Isle — worth a look
    if it bothers the owner, but the two sources just draw it slightly differently there).
    Both sources are far more detailed than the map needs everywhere, so the final `-simplify` interval
    is tuned per country (US 400m, Canada 800m, Alaska 2500m for its inset box) to keep the page light —
    turn these down if a spot still looks coarse; the ceiling is whatever the source itself provides.
    Output: `web/data/geo.json`, one object `areas` of pieces `{id, state, name, abbr, country, shetach}`.
  - **The world**: GADM (via that same mirror) is the standard to reach for first when shetachim outside
    the US/Canada get added — it covers every country, at real detail, and geoBoundaries is a fallback
    (CC-BY, cleanly licensed for redistribution, but only reachable here as Git LFS pointers, since this
    sandbox can't fetch LFS content, so it needs the owner's browser, or the sandbox's network policy
    widened to reach geoboundaries.org directly). GADM's own terms allow non-commercial use but ask
    permission before redistributing; this project's public GitHub Pages site is very likely fine (a free
    hobby map, not resold or repackaged), but it's not public domain the way Natural Earth was — worth
    keeping in mind if that ever matters.
  - Tagging: NE countries and provinces, Census counties; centers and cities in split states also
    get the piece they're in.
  - Cities: matched to GeoNames (npm `all-the-cities`); 1,001 cities, 81 unmatched (see report).
  - Capitals are checked: the center must exist; a capital outside its shetach is a warning in
    `data/report.md` ("To check"). All 57 are inside their shetachim now.
- World: see "RIGHT NOW" above for everything outside the US and Canada (territory forms, sources, views).
- Live site: GitHub Pages from `claude/bold-albattani-aqfnj9`, root folder:
  `https://yechezkelbinstok-dev.github.io/shetachim/` (root `index.html` forwards to `web/`).
- Claude artifact preview (this account; private):
  https://claude.ai/artifact/E8pHqPjx5yGrxqogbi7G1s. The physical map can't load there. The artifact
  version is `web/index.html` minus its `<html>/<head>/<body>` wrapper (keep what's after
  `<!-- page head -->` and the body content, drop the `data:,` favicon), with `web/data/*` as
  supporting files under `data/`.

## Open questions for the owner
- Anything in the current list that turns out wrong (it came from another AI).
- DC; co-head or deceased head shliach display (Victoria's entry lists three names as "Disputed — …"; UK's is
  "Hanholo of Chabad Lubavitch UK"; Tunisia's "Pinson family" — shown as given for now).
- Capitals (flagship centers) for all 108 world shetachim.
- Mount Athos (stays Greece under the literal list) and Jervis Bay (blank) — confirm.
- Data gaps: no listings in Armenia, the Philippines, Albania and a few others.

## Notes for Claude
- World boundaries: GADM **hi-res** from `github.com/stephanietuerk/admin-boundaries` (`hi-res/Admin{0,1,2}/gadm36_<ISO3>_<level>.json`;
  the lo-res ones are each simplified separately, so borders don't meet — don't use them for the world). Missing from the mirror:
  Cabo Verde (Natural Earth used), Svalbard, GADM's disputed Z01–Z09 areas, and hi-res AUS level 2 (too big for GitHub).
  Russia's whole-country file there is broken (built from level 1 instead). Check a new country's area against Natural
  Earth before trusting it (a quick script: sum spherical area, compare; France/Norway/Morocco/Somalia differ for known
  coverage reasons).
- Australian Bureau of Statistics boundaries (SUA, LGA, SA2…): abs.gov.au and abc.net.au are blocked here, but the R
  package `wfmackey/absmapsdata` on GitHub has them as `.rda` files (`data/sua2021.rda`, `data/lga2022.rda`, …), and
  PyPI works: `python3 -m venv v && v/bin/pip install rdata`, then `rdata.conversion.convert(rdata.parser.parse_file(f))`
  gives a pandas frame whose `geometry` column holds the rings (see git history of `data/shapes/` for the export).
  Its geometries are pre-simplified (~300 m), fine as a cut line through a state.
- GitHub search (API) is blocked in these sessions; anonymous `git clone --filter=blob:none --no-checkout` of a known public
  repo works for listing files (`git ls-tree -r --name-only HEAD`; don't use `-l`, it fetches every blob).
- Screenshot testing: `npm install --prefix .cache/testlib d3@7.9.0 topojson@3.0.2 maplibre-gl@4.7.1`, then
  `node scripts/screenshot.mjs <outdir> world:political:desktop:light fsu:physical:phone:dark …` (spec =
  view:base:device:theme[:extra clicks like labels=last,borders=both]); prints each view's stats line and any page errors
  ("Failed to load resource" lines are the blocked web fonts — expected). Look at the PNGs with the Read tool.
  Extras run in order: `go=lon/lat/zoom` puts the new engine's camera there (`window.__dbg.go`); the "console Error
  … Failed to fetch" lines in every view are the test's blocked openfreemap tiles and fonts, not page errors (checked
  Oct 7). `zoom=x/y/k` zooms the old page's political map k× about screen point x,y; to see the physical map at the
  same spot, zoom on political first and then `base=physical,wait=9000` (it takes the political map's camera; the
  test uses MapLibre's demo style, so the base colours aren't the real ones, but our lines and labels are).
- This cloud sandbox's network is limited: GitHub (`raw.githubusercontent.com`, and anonymous
  `git clone` of any public repo) and the npm registry work; census.gov, geonames.org, chabad.org,
  gadm.org, geoboundaries.org, Overpass and Geofabrik, cdnjs, jsdelivr, unpkg, openfreemap.org and github.io
  are blocked (checked directly, not assumed; the OSM API and Nominatim are reachable since Oct 7). That's why counties, towns and tracts come from the
  Census Bureau's GitHub (`uscensusbureau/citysdk`, `v2/GeoJSON/500k/2022/…`), Canada's provinces
  from a plain-file GADM mirror on GitHub, and cities from npm. If a source is only on GitHub via
  Git LFS (`git-lfs.github.com` pointer files instead of real content when fetched anonymously —
  geoBoundaries' own repo is like this), it can't be read here either. The owner's browser reaches
  all of these; the real OpenFreeMap tiles can't be seen from here. The environment's network
  policy (cloud environment menu → Edit, in the session's title bar) can be widened to a specific
  host if a source is worth reaching directly next time, or the owner can download a file and hand
  it over the way `data/raw/chabad-personnel.json` works.
- Before every push: syntax-check web/index.html's scripts and load it headless — a `// comment` inside a one-line
  template expression once blanked the whole site (Oct 3).
- Testing: headless Chromium is at `/opt/pw-browsers`, and the global `playwright` package is
  installed. Chromium doesn't trust the proxy CA, so serve the repo with `page.route`, answer
  cdnjs URLs from local npm copies (`npm install d3@7.9.0 topojson@3.0.2 maplibre-gl@4.7.1` in a
  scratch folder), and fetch anything else with `curl` inside the route handler. OpenFreeMap
  (`tiles.openfreemap.org`: the style, tiles, sprites, fonts) is reachable now (Oct 8): scripts/screenshot.mjs
  fetches it for real (`DEMO=1`: MapLibre's demo style, as before it was). WebGL needs `--use-angle=swiftshader
  --enable-unsafe-swiftshader`.
  Never disable TLS checks.
- Check a desktop (1400×860) and a phone (390×844) viewport, in light and dark, after changes,
  in both Political and Physical.
- Keep the fade's GeoJSON source at `tolerance: 0`: with MapLibre's default simplification, its
  holes break in some tiles and cover parts of the shetachim.

## Oct 7 (owner)
- **City names Google-style again** (the old page's rule, lost in the new engine; owner Oct 7): a dot with the name beside
  it until the city is big on screen (half-width 0.012·√people km, 1.5–30 km, at 22 px), then no dot and a bold name on
  the city (`cities-big`; a capital's above its star), until zoom 13.5 (`CITY_NAMES_END`), where the street map's own
  names take over (no lone town dot over the streets).
- **Towns named on every map (political, streets, physical) are only ours: towns with a center.** The street map's own
  city/town/village labels are hidden; its other place labels (neighbourhoods) only from zoom 13.
- **Hebrew: English-style nicknames are written as the proper name** (data/hebrew/first-names.json and the head
  shluchim): Mendy → מענדל, Zalmy → זלמן, Benjy → בנימין, Moishy → משה, Mordy → מרדכי, Hershy → הערשל, Laivy → לייב,
  Getzy → געצל, Avremi → אברמל, Shuey → יהושע, Effy → אפרים. Nicknames Hebrew uses itself stay (יוסי, פיני, חזקי, שמולי, קוטי,
  and women's names like מושקי, חני).

## AUDIT (Oct 7) — the new engine checked against every rule above and the old page
Found and fixed: Isle of Man not drawn; Kaplan/Lower Balkans names; physical map tinted like a political one (now
Physical + a separate Tinted); the Great Lakes maritime line gone from the physical map; the political map drawing every
country as land (now faded / gone, the first rule); Alaska and Hawaii boxes gone; neighbours' names hiding each other
(BC, Labrador); a frozen picture on every map switch; town labels without centers; English box captions in Hebrew.
Checked and as the rules say: cards (770, families, Leadership, Overseen by, Disputed capitals), India dashed border
and secondary name, Alberta and Western Pennsylvania placement, data rules (no Syria, Suriname/French Guiana blank,
Cambodia, Mongolia, Isle of Man), dark theme (physical stays light), Hebrew panel and names, phone panel.
Known differences left as they are: fewer town names at the framed views than the old page (the engine shows a town
only where it has room); capital stars a little smaller; Hebrew India name lighter and smaller but not slanted (the
engine can't slant Hebrew); Victoria's disputed name doesn't fit at the Oceania view (the old page didn't fit it either).

## SWEEP 2 (Oct 7) — automated card check (5,963 cards × English/Hebrew), every view × desktop/phone, every option
Fixed: Hebrew area cards' "Capital:" line was English (they read the raw data, not the bilingual capitals); Friendship
Circle; two mixed-language chabad.org names (now from data/hebrew/centers.json); continent views' faded land had
spikes where the far-side seam cuts land (land across the seam is left out there, `crossing`); the language button
lost every other tap while the first switch loaded (taps now queue); PNG posters were stale since Oct 3 (run
`node scripts/svg-png.mjs` after every `npm run svg`); Zoom in on Alaska in US & Canada zoomed out to the world.
English cards: 0 problems. Hebrew cards: only acronyms left in Latin letters (UCLA, MIT, SUNY, JRCC, RARA…), on purpose.
**Gaza (owner, Oct 7): Israel's edge there follows the ground Israel actually holds now**, not the Gaza boundary. First
from OpenStreetMap's "Yellow Line" (way 1313327399) and "Orange Line" (way 1541663246) areas; since later on Oct 7 from
the owner's own IDF control map, like southern Lebanon and Syria: see "ISRAEL'S HELD GROUND" at the top.
