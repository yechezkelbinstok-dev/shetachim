import json, sys, os, re, html, hashlib
C = json.load(open(sys.argv[1])); outd = sys.argv[2]; fy = json.load(open(sys.argv[3]))['centers']
want = set(sys.argv[4].split(',')) if len(sys.argv) > 4 and sys.argv[4] else None
KW = re.compile(r'new shluch|shluchim to|shliach to|comes to|arriv|open|launch|establish|first|welcome|appoint|new chabad|representatives|join|emissar|new appointments', re.I)
def load_all(s):
    out = {}
    for f in os.listdir(os.path.join(outd, s)):
        if not f.endswith('.json'): continue
        try: d = json.load(open(os.path.join(outd, s, f)))
        except Exception: continue
        if isinstance(d, list):
            for p in d: out[p['link']] = p
    return out
P = {**load_all('chi'), **load_all('lub')}
def txt(h):
    h = re.sub(r'<[^>]+>', ' ', h or ''); return re.sub(r'\s+', ' ', html.unescape(h))
for r in C:
    if want and r['id'] not in want: continue
    c = [x for x in r['cands'] if int(x['date'][:4]) <= int(r['year']) and (want or KW.search(x['title']))]
    if not c: continue
    e = fy[r['id']]
    print('=' * 100)
    print(f"{r['id']} | {r['name']} | {r['city']} | {r['shetach']} | {e['year']} {e['confidence']} {e.get('how')} | dirs {r['dirs']}")
    print('SOURCE:', e.get('source'))
    print('NOTE:', e.get('note', '')[:900])
    for x in c[:4]:
        p = P.get(x['link']); body = txt(p['content']['rendered']) if p else ''
        print(f"  -> {x['date']} {x['site']} | {x['title']} | {x['link']}")
        for d in r['dirs'][:2] + [r['city']]:
            for m in list(re.finditer(r'[^.]{0,220}\b' + re.escape(d) + r'\b[^.]{0,220}\.?', body, re.I))[:2]:
                print('     ~', m.group(0).strip()[:440])
