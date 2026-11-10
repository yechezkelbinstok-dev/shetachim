# Query CrownHeights.info and lubavitch.com WordPress search for each target: by surname and by city, in [Y-2, Y+1].
import json, sys, os, subprocess, urllib.parse, hashlib, concurrent.futures as cf
T = json.load(open(sys.argv[1])); outd = sys.argv[2]
SITES = {'chi': 'https://crownheights.info', 'lub': 'https://www.lubavitch.com'}
jobs = set()
for t in T:
    y = int(t['year']); a = f"{y-2}-01-01T00:00:00"; b = f"{y+1}-12-31T23:59:59"
    terms = list(t['dirs'][:2]) + [t['city']]
    for term in terms:
        if not term: continue
        for s in SITES: jobs.add((s, term, a, b))
def run(j):
    s, term, a, b = j
    key = hashlib.md5('|'.join(j).encode()).hexdigest()[:16]
    p = os.path.join(outd, s, key + '.json')
    if os.path.exists(p) and os.path.getsize(p) > 2: return
    os.makedirs(os.path.dirname(p), exist_ok=True)
    q = urllib.parse.urlencode({'search': term, 'after': a, 'before': b, 'per_page': 100, '_fields': 'date,link,title,content'})
    subprocess.run(['curl', '-sS', '--max-time', '40', '-o', p, SITES[s] + '/wp-json/wp/v2/posts?' + q], capture_output=True)
    json.dump({'site': s, 'term': term, 'after': a, 'before': b}, open(p + '.meta', 'w'))
with cf.ThreadPoolExecutor(8) as ex: list(ex.map(run, sorted(jobs)))
print(len(jobs))
