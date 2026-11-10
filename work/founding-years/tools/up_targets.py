# US medium/low entries with director surnames, for same-year report matching.
import json, sys
g = json.load(open('web/data/centers.geojson')); fy = json.load(open('data/founding-years.json'))['centers']
out = []
for f in g['features']:
    p = f['properties']
    if p.get('country') != 'US': continue
    for c in p.get('centers') or []:
        if c.get('mushroom'): continue
        i = str(c['id']); e = fy.get(i)
        if not e or not e.get('year') or e.get('confidence') not in ('medium', 'low'): continue
        per = c.get('personnel') or []
        dirs = [x for x in per if x.get('isDirector')] or per
        sn = sorted({(x.get('lastName') or '').strip() for x in dirs if (x.get('lastName') or '').strip()})
        allsn = sorted({(x.get('lastName') or '').strip() for x in per if (x.get('lastName') or '').strip()})
        out.append({'id': i, 'name': c.get('name'), 'city': c.get('city'), 'shetach': e.get('shetach'), 'year': e['year'],
                    'conf': e['confidence'], 'how': e.get('how'), 'dirs': sn, 'staff': allsn})
json.dump(out, open(sys.argv[1], 'w'), indent=0)
print(len(out))
