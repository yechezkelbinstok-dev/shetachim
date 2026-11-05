# work/: everything the Nov 5 session worked with (head-shliach photos, vaad faces, the card preview)
Kept so the next session carries on where it stopped (owner, Nov 5: "what about like all the photos and stuff that you
were working on? That's my point that it should be seamless right?"). Start from HANDOFF.md, "START HERE".
- `head-photos/candidates/round1|round2|round3/<shetach id>/`: every candidate downloaded for a head (c1, c2, …);
  `sources.txt` maps each number to its URL. round1 = the first search (the 48 US photos), round2 = the "recent, not
  old" replacements, round3 = the second replacement round, Canada and the 2025–26 leads. `out/` = the retouched
  results, `before*/` = what they replaced; the PNG/JPEGs beside them are review sheets.
- `head-photos/vaad/`: the vaad members' sources. fl-collage.jpg = anash.org's Feb 2023 collage, fl-t1…7 its seven
  headshots; ref-*, fr*, g*, h* = captioned photos used to put names to faces; nj-* = New Jersey's; dubov-pp.jpg =
  Dubov's Instagram profile picture; `out/` = the retouched faces.
- `head-photos/instagram/results/`: every Apify run's results, compact (each post's link, caption, date and image
  links; each account's name, bio, followers). search_res = the first 22 account searches; roundA/B/C = the posts of
  the accounts found and more searches; known1 = 19 posts found by web search; jewproject = The Jew Project's portraits;
  dubov-ig = Dubov's profile. The image links expire: re-fetch a post through Apify by its url (scripts/head-photos/ig.py).
- `head-photos/instagram/images/`: the Instagram photos that matter, `<shortCode>_<n>.jpg`: the ones used, every post
  whose caption names the head shliach, The Jew Project's, the posts found by web search. `face-index/`: per account,
  every face found (post, date, size, caption, starred if the caption names him). Not kept: the other posts' photos
  and the sheets of faces cut from them (crowds, children) — the results above list every post.
- `head-photos/instagram/review/`: the review sheets of the first Instagram finds. `head-photos/view/`: the checks made
  while choosing (face boxes with rulers, before/after, crops).
- `card-preview/proto*/index.html`: every version of the preview page (proto3 = the third design; proto5 + photos;
  proto6 + no numbers box; proto7 + the vaad's faces = web/preview-cards.html).
- `sheets/`: every review sheet and card screenshot (cards6 = English phone, cards7/8 = Hebrew, cards9 = the preview as
  handed off). `tools/`: the session's scripts as they were (their paths point at its scratchpad); the cleaned-up ones
  are in scripts/head-photos/ and scripts/.
Images over 1600 px (Instagram: 1080 px) were scaled down and heavy ones saved as JPEG; crops in data/head-photos.json
are fractions of the image, so they still apply.
