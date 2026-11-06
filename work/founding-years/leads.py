# Leads for one shetach's listings from therebbesimpact.com's records (LEADS ONLY, never a year: owner, Nov 6, "a guess
# is ridiculous"; tested in therebbesimpact-test.md: right about 3 times in 4).
#   node work/founding-years/therebbesimpact-capture.mjs .cache/therebbesimpact   (once: saves the site's own responses)
#   python3 work/founding-years/leads.py west-coast   -> .cache/therebbesimpact/leads-west-coast.json
# For each blue dot's listing (no mushrooms) in the shetach: up to 3 'Chabad Center' / 'Shliach / Emissary' records
# within 15 km whose title shares the listing's words or a rabbi's surname: (score, year, category, title, km).
import json, math, re, sys, os
C = '.cache/therebbesimpact'; sid = sys.argv[1]
def inner(n):
    o = json.load(open(f'{C}/resp-{n}.txt')); s = o['p']['v'][0]['p']['v'][0]['s']
    try: return json.loads(s)
    except Exception: return json.loads(json.loads('"' + s + '"'))
sizes = sorted((os.path.getsize(f'{C}/{f}'), f) for f in os.listdir(C) if f.startswith('resp-'))
small, mid, big = [int(f[5:-4]) for _, f in sizes[-3:]]
o = json.load(open(f'{C}/resp-{small}.txt')); catname = {x['p']['v'][0]['s']: x['p']['v'][1]['s'] for x in o['p']['v'][0]['a']}
d2, d3 = inner(mid), inner(big); cats = [catname.get(c, '?') for c in d2['categories']]; st = d2['strings']
recs = []
for i, p in enumerate(d2['rplace']):
    if d2['rcat'][i] < 0 or cats[d2['rcat'][i]] not in ('Chabad Center', 'Shliach / Emissary') or not d2['ryear'][i]: continue
    recs.append((d2['plat'][p], d2['plng'][p], d2['ryear'][i], cats[d2['rcat'][i]], d3['titles'][d3['rtitle'][i]]))
stop = {'chabad', 'the', 'jewish', 'center', 'house', 'lubavitch', 'and', 'for', 'rabbi', 'of'}
words = lambda s: set(w for w in re.findall(r'[a-z]{3,}', (s or '').lower()) if w not in stop)
g = json.load(open('web/data/centers.geojson')); out = []
for f in g['features']:
    p = f['properties']
    if not (p.get('piece') or '').endswith(':' + sid): continue
    lon, lat = f['geometry']['coordinates'][:2]
    for c in p.get('centers') or []:
        if c.get('mushroom'): continue
        last = [x.get('lastName') for x in (c.get('personnel') or []) if x.get('lastName')]
        cand = []
        for la, ln, yr, cat, title in recs:
            dk = math.hypot((lat - la) * 111, (lon - ln) * 111 * math.cos(math.radians(lat)))
            if dk > 15: continue
            sc = 3 * any(l.lower() in title.lower() for l in last) + len(words(c.get('name')) & words(title)) + (dk < 3)
            if sc >= 2: cand.append((sc, yr, cat, title[:70], round(dk, 1)))
        cand.sort(key=lambda x: (-x[0], x[1]))
        out.append({'id': str(c['id']), 'name': c.get('name'), 'city': c.get('city'), 'type': c.get('type'), 'rabbis': last, 'leads': cand[:3]})
json.dump(out, open(f'{C}/leads-{sid}.json', 'w'), indent=0, ensure_ascii=False)
print(f'{sid}: {len(out)} listings, {sum(1 for x in out if x["leads"])} with a lead -> {C}/leads-{sid}.json')
