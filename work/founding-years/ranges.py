# Every undated listing (US + Canada, no mushrooms, no mikvahs) sorted by how good its range is (owner, Nov 10: "break
# down in a doc if it has a legitimate range ... 1940-2004 - that's absolutely a non legitimate range but if it's smth
# short it's much more shayach to put in the map on an interim basis"). Writes work/founding-years/RANGES.md.
#   short: both ends known, 5 years or less apart (could go on the map for now, marked as a range)
#   wide:  both ends known, 6-10 years apart;  too wide: more than 10 years, or only one end ('by' or 'after')
import json, collections, re
g = json.load(open('web/data/centers.geojson')); fy = json.load(open('data/founding-years.json'))['centers']
def is_mikvah(c): return (c.get('type') or '').lower().startswith('mik') or 'mikv' in (c.get('name') or '').lower()
# Crown Heights listings the owner chose not to research are out of the counts too (owner, Nov 10: "Take them out of
# cheshbon"): a crown-heights listing with no entry in data/founding-years.json is skipped; the 12 central mosdos stay in.
def why(e):
    n = re.sub(r'\s+', ' ', (e or {}).get('note', '')); n = re.sub(r'^No (founding year|dated source) found yet[^.]*\.\s*', '', n)
    return (n[:230] + '…') if len(n) > 230 else n
B = collections.defaultdict(list)
for f in g['features']:
    p = f['properties']
    if p.get('country') not in ('US', 'CA'): continue
    sid = (p.get('piece') or ':none').split(':')[-1]
    cs = [c for c in p.get('centers') or [] if not c.get('mushroom') and not is_mikvah(c) and not (((p.get('piece') or ':none').split(':')[-1] == 'crown-heights') and str(c['id']) not in fy)]
    dated = any((fy.get(str(c['id'])) or {}).get('year') for c in cs)
    for c in cs:
        e = fy.get(str(c['id']))
        if e and e.get('year'): continue
        a, b = (e or {}).get('after'), (e or {}).get('by')
        name = f"{c.get('name')}, {c.get('city')} ({sid})" + (' · dot already dated' if dated else '')
        if a and b:
            w = b - a; k = 'short' if w <= 5 else ('wide' if w <= 10 else 'toowide')
            B[k].append((w, f"- **{a}–{b}** ({w} yr) {name} · {c['id']}\n  {why(e)}"))
        elif b: B['by'].append((b, f"- by {b}: {name} · {c['id']}"))
        elif a: B['after'].append((a, f"- after {a}: {name} · {c['id']}"))
        else: B['none'].append((0, f"- {name} · {c['id']}" + ('' if e else ' (not researched)')))
tot = sum(len(v) for v in B.values())
out = ['# Founding years: how good is each undated range', '',
       f'{tot} undated listings (US + Canada; mikvahs left out). A range is only worth showing when both ends are known and '
       'close together. Regenerate: `python3 work/founding-years/ranges.py`.', '',
       '| Kind | Listings | On the map for now? |', '|---|---|---|',
       f"| Short: both ends, 5 years or less | {len(B['short'])} | yes, as a range |",
       f"| Wide: both ends, 6–10 years | {len(B['wide'])} | maybe |",
       f"| Too wide: more than 10 years | {len(B['toowide'])} | no |",
       f"| Only a latest year ('by') | {len(B['by'])} | no (no earliest end) |",
       f"| Only an earliest year ('after') | {len(B['after'])} | no |",
       f"| Nothing yet | {len(B['none'])} | no |", '']
for k, title in [('short', 'Short ranges (5 years or less)'), ('wide', 'Wide ranges (6–10 years)'), ('toowide', 'Too wide (more than 10 years)'),
                 ('after', "Only an earliest year ('after')"), ('none', 'Nothing yet')]:
    if B[k]: out += [f'## {title}: {len(B[k])}', ''] + [x for _, x in sorted(B[k])] + ['']
out += [f"## Only a latest year ('by'): {len(B['by'])}", '',
        "The latest the center could have started, with no earliest end. 'by 2004' is mostly the directory's first day (July 2004).", '']
dec = collections.Counter(f'{(y // 10) * 10}s' for y, _ in B['by'])
out += ['| By | Listings |', '|---|---|'] + [f'| {d} | {n} |' for d, n in sorted(dec.items())] + ['']
out += [x for _, x in sorted(B['by'], key=lambda t: (-t[0], t[1]))] + ['']
open('work/founding-years/RANGES.md', 'w').write('\n'.join(out) + '\n')
print({k: len(v) for k, v in B.items()}, tot)
