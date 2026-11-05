# Assign every Massachusetts town to a shetach under the current data/shetachim.json rules (approximation of the build).
import json, sys, re
key = lambda n: re.sub(r'[^a-z]', '', re.sub(r' town$', '', n.lower()))
S = '/tmp/claude-0/-home-user-shetachim/6dfe7d99-9185-570e-b237-1d68bcc4daf7/scratchpad/ma'
towns = json.load(open(f'{S}/cousub-25.json'))['features']
sh = json.load(open('/home/user/shetachim/data/shetachim.json'))['shetachim']
claims = {}; cuts = []; counties = {}
for s in sh:
    for t in s.get('territory', []):
        if isinstance(t, dict) and t.get('state') == 'US-MA' and t.get('towns'):
            for n in t['towns']: claims[key(n)] = s['id']
        elif isinstance(t, dict) and t.get('state') == 'US-MA' and ('eastOf' in t or 'westOf' in t):
            cuts.append((t.get('eastOf', -999), t.get('westOf', 999), s['id']))
        elif isinstance(t, dict) and t.get('counties'):
            for c in t['counties']:
                if c.startswith('25'): counties[c] = s['id']
def rings(g):
    if g['type'] == 'Polygon': return [g['coordinates']]
    return g['coordinates']
def bbox_lons(g):
    xs = [p[0] for poly in rings(g) for r in poly for p in r]
    return min(xs), max(xs)
def centroid(g):
    # area-weighted centroid of outer rings
    A = cx = cy = 0
    for poly in rings(g):
        r = poly[0]
        for (x1, y1), (x2, y2) in zip(r, r[1:]):
            c = x1*y2 - x2*y1; A += c; cx += (x1+x2)*c; cy += (y1+y2)*c
    return (cx/(3*A), cy/(3*A)) if A else r[0]
out = []
for f in towns:
    p = f['properties']; n = p['NAME']; cty = p['STATEFP'] + p['COUNTYFP']
    lo, hi = bbox_lons(f['geometry']); cx, cy = centroid(f['geometry'])
    how = ''
    if cty in counties: sid = counties[cty]; how = 'county'
    elif key(n) in claims: sid = claims[key(n)]; how = 'town claim'
    else:
        sid = next((s for e, w, s in cuts if e <= cx < w), '?'); how = 'longitude'
        split = [s for e, w, s in cuts if not (hi <= e or lo >= w)]
        if len(set(split)) > 1: how = 'longitude (SPLIT: ' + '/'.join(sorted(set(split))) + ')'
    out.append({'name': n, 'county': p['NAMELSADCO'], 'geoid': p['GEOID'], 'sid': sid, 'how': how, 'cx': cx, 'cy': cy})
json.dump(out, open(f'{S}/assign.json', 'w'))
from collections import Counter
print(Counter(o['sid'] for o in out))
for o in out:
    if 'SPLIT' in o['how']: print('split:', o['name'], o['county'], o['how'])
