# Stricter: a director's first AND last name within 60 chars of each other, and the town, in the same post; undated listings only.
import json, glob, re, html, sys
g = json.load(open(sys.argv[1])); fy = json.load(open(sys.argv[2]))['centers']; posts = []
for f in sorted(glob.glob(sys.argv[3] + '/p*.json')):
    for p in json.load(open(f)):
        t = re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', p['title']['rendered'] + ' . ' + p['content']['rendered'])))
        posts.append((p['date'][:10], p['link'], html.unescape(p['title']['rendered']), t))
ABBR = {'S. ': 'San ', 'St. ': 'Saint '}
out = []
for feat in g['features']:
    pr = feat['properties']
    if pr.get('country') not in ('US', 'CA'): continue
    shet = (pr.get('piece') or ':none').split(':')[-1]
    if shet == 'crown-heights': continue
    for c in pr.get('centers') or []:
        if c.get('mushroom'): continue
        i = str(c['id']); e = fy.get(i) or {}
        if e.get('year'): continue
        city = c.get('city') or ''
        for a, b in ABBR.items():
            if city.startswith(a): city = b + city[len(a):]
        names = [((x.get('firstName') or '').split()[0], x.get('lastName') or '') for x in c.get('personnel') or [] if x.get('firstName') and x.get('lastName')]
        if not names or not city: continue
        cpat = re.compile(r'\b' + re.escape(city) + r'\b', re.I)
        hits = []
        for d, link, title, t in posts:
            if e.get('by') and int(d[:4]) > int(e['by']) + 1: continue
            if not cpat.search(t): continue
            for fn, ln in names:
                m = re.search(r'\b' + re.escape(fn) + r'\b.{0,60}?\b' + re.escape(ln) + r'\b', t)
                if m:
                    s = t[max(0, m.start() - 300): m.end() + 300]
                    hits.append({'date': d, 'title': title[:120], 'link': link, 'snip': s}); break
        if hits:
            out.append({'id': i, 'name': c.get('name'), 'city': c.get('city'), 'shetach': shet, 'conf': e.get('confidence') or 'none',
                        'by': e.get('by'), 'after': e.get('after'), 'hits': sorted(hits, key=lambda h: h['date'])})
json.dump(out, open(sys.argv[4], 'w'), ensure_ascii=False, indent=1)
print(len(out), 'listings;', sum(len(o['hits']) for o in out), 'hits')
