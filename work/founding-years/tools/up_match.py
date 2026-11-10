import json, sys, os, re, html, hashlib
T = json.load(open(sys.argv[1])); outd = sys.argv[2]
def load(s, term, a, b):
    key = hashlib.md5('|'.join((s, term, a, b)).encode()).hexdigest()[:16]
    p = os.path.join(outd, s, key + '.json')
    try: d = json.load(open(p))
    except Exception: return []
    return d if isinstance(d, list) else []
def txt(h):
    h = re.sub(r'<[^>]+>', ' ', h or ''); return re.sub(r'\s+', ' ', html.unescape(h))
res = []
for t in T:
    y = int(t['year']); a = f"{y-2}-01-01T00:00:00"; b = f"{y+1}-12-31T23:59:59"
    posts = {}
    for s in ('chi', 'lub'):
        for term in list(t['dirs'][:2]) + [t['city']]:
            if not term: continue
            for p in load(s, term, a, b): posts[p['link']] = (s, p)
    cands = []
    city = t['city'] or ''
    cw = [w for w in re.split(r'[ ,/-]+', city) if len(w) > 3] or [city]
    for link, (s, p) in posts.items():
        body = txt(p.get('content', {}).get('rendered', '')); title = txt(p.get('title', {}).get('rendered', ''))
        full = title + ' ' + body
        hit_city = any(re.search(r'\b' + re.escape(w) + r'\b', full, re.I) for w in cw)
        hit_dir = [d for d in t['dirs'] if re.search(r'\b' + re.escape(d) + r'\b', full, re.I)]
        if hit_city and hit_dir:
            m = re.search(r'[^.]{0,200}\b' + re.escape(cw[0]) + r'\b[^.]{0,200}', full, re.I)
            cands.append({'date': p['date'][:10], 'site': s, 'title': title[:140], 'link': link, 'snip': (m.group(0) if m else '')[:400]})
    cands.sort(key=lambda c: c['date'])
    res.append({**t, 'cands': cands})
json.dump(res, open(sys.argv[3], 'w'), indent=1, ensure_ascii=False)
n = sum(1 for r in res if r['cands'])
print('targets with candidates:', n, 'of', len(res))
