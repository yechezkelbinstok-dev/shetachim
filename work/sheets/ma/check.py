# After a build: every Massachusetts center with the shetach it landed in, and the pieces Massachusetts is cut into.
import json, collections
d = json.load(open('/home/user/shetachim/web/data/centers.geojson'))['features']
by = collections.defaultdict(list)
for f in d:
    p = f['properties']
    if p.get('region') != 'US-MA': continue
    for c in p['centers']:
        by[p['piece']].append(f"{c.get('city')}: {c['name']}")
for k, v in sorted(by.items()):
    print(k, len(v))
    for x in sorted(v):
        if any(t in x for t in ('Westford', 'Acton', 'Andover', 'Haverhill', 'Mansfield', 'Stoughton', 'Sharon', 'Canton', 'Lexington')): print('   ', x)
