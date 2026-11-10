# Every listing still without a founding year (US + Canada, no mushrooms; mikvahs listed apart, as they are out of
# the counts since Nov 10), grouped by shetach: first the dots with no year at all, then listings on dots that are
# already dated. Writes work/founding-years/UNDATED.md. Run: python3 work/founding-years/undated.py
import json, collections
g = json.load(open('web/data/centers.geojson')); fy = json.load(open('data/founding-years.json'))['centers']
def is_mikvah(c): return (c.get('type') or '').lower().startswith('mik') or 'mikv' in (c.get('name') or '').lower()
def has(e):
    if not e: return 'not researched'
    a, b = e.get('after'), e.get('by')
    if a and b: return f'{a}–{b}'
    if b: return f'by {b}'
    if a: return f'after {a}'
    return 'nothing found yet'
groups = collections.defaultdict(lambda: {'dot': [], 'shared': [], 'mik': []}); n = collections.Counter()
for f in g['features']:
    p = f['properties']
    if p.get('country') not in ('US', 'CA'): continue
    sid = (p.get('piece') or ':none').split(':')[-1]
    cs = [c for c in p.get('centers') or [] if not c.get('mushroom')]
    real = [c for c in cs if not is_mikvah(c)]
    dated = any((fy.get(str(c['id'])) or {}).get('year') for c in real)
    for c in cs:
        e = fy.get(str(c['id']))
        if e and e.get('year'): continue
        heads = ', '.join(f"{x.get('firstName') or ''} {x.get('lastName') or ''}".strip() for x in c.get('personnel') or [] if x.get('isDirector'))
        line = f"- {c.get('name')}, {c.get('city')}" + (f" ({heads})" if heads else '') + f" — {has(e)} · {c['id']}"
        k = 'mik' if is_mikvah(c) else ('shared' if dated else 'dot')
        groups[sid][k].append(line); n[k] += 1
out = ['# Founding years: every listing still undated', '',
       f"US + Canada, {n['dot'] + n['shared']} listings without a year (mikvahs apart: {n['mik']}). Per shetach: first the "
       "listings on dots with no year at all, then those sharing a dot that is already dated (the dot shows the earliest "
       "year there). After each: what we have ('by' = the latest it could have started; 'by 2004' is mostly only the "
       "directory's first day) and the chabad.org id. Regenerate: `python3 work/founding-years/undated.py`.", '']
for sid in sorted(groups, key=lambda s: -(len(groups[s]['dot']) + len(groups[s]['shared']))):
    gr = groups[sid]; tot = len(gr['dot']) + len(gr['shared'])
    if not tot and not gr['mik']: continue
    out.append(f"## {sid}: {tot}"); out.append('')
    if gr['dot']: out += [f"**No year at the dot ({len(gr['dot'])})**"] + sorted(gr['dot']) + ['']
    if gr['shared']: out += [f"**On a dated dot ({len(gr['shared'])})**"] + sorted(gr['shared']) + ['']
    if gr['mik']: out += [f"**Mikvahs, out of the counts ({len(gr['mik'])})**"] + sorted(gr['mik']) + ['']
open('work/founding-years/UNDATED.md', 'w').write('\n'.join(out) + '\n')
print(n, sum(1 for s in groups if groups[s]['dot'] or groups[s]['shared']), 'shetachim')
