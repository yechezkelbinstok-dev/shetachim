# Where the founding years stand, per shetach (US + Canada): python3 work/founding-years/status.py
# Counts every blue dot's listing (no mushrooms) from web/data/centers.geojson against data/founding-years.json and
# writes work/founding-years/STATUS.md (the running tally the owner asked for, Nov 6: "keep track continuously of how
# many are missing ... so we can do a round of the harder ones later").
import json, collections
# Mikvahs are left out of the counts (owner, Nov 10: "only mikvaos out - def don't delete data tho"): their data stays.
def is_mikvah(c): return (c.get('type') or '').lower().startswith('mik') or 'mikv' in (c.get('name') or '').lower()
g = json.load(open('web/data/centers.geojson')); fy = json.load(open('data/founding-years.json'))['centers']
listings = collections.defaultdict(list); dots = collections.defaultdict(list)   # dots: per shetach, the listings at each map point
for f in g['features']:
    p = f['properties']
    if p.get('country') not in ('US', 'CA'): continue   # US and Canada only (owner, Nov 6: "Not Mexico!!!!!")
    sid = (p.get('piece') or ':none').split(':')[-1]
    ids = [str(c['id']) for c in p.get('centers') or [] if not c.get('mushroom') and not is_mikvah(c)]
    listings[sid] += ids
    if ids: dots[sid].append(ids)
rows = []; tot = collections.Counter()
for sid, ids in listings.items():
    k = collections.Counter()
    for i in ids:
        e = fy.get(i)
        if not e: k['not researched'] += 1
        elif e.get('year'): k[e.get('confidence') or 'high'] += 1
        else: k[e.get('confidence') or 'open'] += 1
    k['dots'] = len(dots[sid]); k['dots missing'] = sum(1 for d in dots[sid] if not any((fy.get(i) or {}).get('year') for i in d))
    rows.append((sid, len(ids), k)); tot.update(k); tot['listings'] += len(ids)
cols = ['high', 'medium', 'low', 'range', 'open', 'not researched']
out = ['# Founding years: where each shetach stands', '', 'Listings (blue dots, no mushrooms) per shetach; `high`/`medium`/`low` have a year; `range` only a bound',
       "('by 2012'); `open` researched with no real source yet; `not researched` not started. A dot (a map point) takes the earliest",
       "year of its listings, so `Dots missing` counts the points with no listing dated yet. Regenerate with `python3 work/founding-years/status.py`.", '',
       '| Shetach | Listings | ' + ' | '.join(cols) + ' | Missing a year | Dots | Dots missing |', '|' + '---|' * (len(cols) + 5)]
started = [r for r in rows if r[1] - r[2]['not researched'] > 0]; rest = [r for r in rows if r[1] - r[2]['not researched'] == 0]
for sid, n, k in sorted(started, key=lambda r: r[0]) + sorted(rest, key=lambda r: -r[1]):
    miss = k['range'] + k['open'] + k['not researched']
    out.append(f'| {sid} | {n} | ' + ' | '.join(str(k[c] or '') for c in cols) + f' | {miss} | {k["dots"]} | {k["dots missing"]} |')
miss = tot['range'] + tot['open'] + tot['not researched']
out.append(f'| **all** | {tot["listings"]} | ' + ' | '.join(str(tot[c]) for c in cols) + f' | {miss} | {tot["dots"]} | {tot["dots missing"]} |')
open('work/founding-years/STATUS.md', 'w').write('\n'.join(out) + '\n')
print('\n'.join(out[:7 + len(started) + 1])); print(f'... all: {tot["listings"]} listings; with a year {tot["high"]+tot["medium"]+tot["low"]}; missing {miss}; dots {tot["dots"]}, missing {tot["dots missing"]}')
