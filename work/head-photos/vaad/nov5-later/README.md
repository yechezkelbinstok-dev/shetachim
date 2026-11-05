# The later Nov 5 session's vaad photos (UK Hanholo, Tzach, Florida fixes)
- `candidates/uk|nyc|fl/<who>/`: every candidate downloaded (c1, c2, …), `sources.txt` maps each to its URL. Scaled to
  1600 px at most (crops in data/vaad-photos.json are fractions, so they still apply).
- `out/uk|nyc|fl/`: the retouched 320 px faces (web/img/vaad/ has them at 160 px).
- `edits/`: the cleaned sources: arkush-clean (a banner's text painted out), dubov-clean (another man's hat brim filled
  from the mirror image), kessler-tile (the inset cut from COLlive's lead image), goldman-tight (the crop in use) and
  goldman-clean2 (the painted-out hand the owner rejected: "extremely f***** up" — don't use), the Main Street Daily
  News and Naples Daily News page captures (Goldman, Zaklos).
- `sheets/`: the review sheets (UK, Tzach, Goldman's options, the Florida collage's tiles beside the members' own photos).
- `instagram-posts1.json`: the one Apify run (2 posts: chabad.org's Oct 2024 post naming Zaklos; YJP Miami's Oct 2026
  post naming Chaim and Eli Lipskar) — neither gave a photo of him alone.
