# ig.py posts <out.json> <url>...   : run apify/instagram-scraper on post URLs, save items, download every image
# ig.py profile <out.json> <user> <limit> : the account's latest posts
import json, os, sys, subprocess, urllib.request
S = os.environ.get('WORK', '/tmp/head-photos')
TOKEN = (os.environ.get('APIFY_TOKEN') or open(os.environ.get('APIFY_TOKEN_FILE', f'{S}/.apify_token')).read()).strip()  # from the environment: never commit the token
IMG = f'{S}/ig/img'; os.makedirs(IMG, exist_ok=True)
def run(inp):
    req = urllib.request.Request('https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync-get-dataset-items?timeout=280',
        data=json.dumps(inp).encode(), headers={'Authorization': f'Bearer {TOKEN}', 'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=320) as r: return json.load(r)
def grab(items):
    out = []
    for x in items:
        sc = x.get('shortCode') or x.get('id')
        urls = []
        if x.get('displayUrl'): urls.append(x['displayUrl'])
        urls += [u for u in (x.get('images') or []) if u not in urls]
        for c in x.get('childPosts') or []:
            if c.get('displayUrl') and c['displayUrl'] not in urls: urls.append(c['displayUrl'])
        files = []
        for n, u in enumerate(urls):
            f = f'{IMG}/{sc}_{n}.jpg'
            if not os.path.exists(f):
                subprocess.run(['curl', '-sS', '-L', '--max-time', '60', '-A', 'Mozilla/5.0', '-o', f, u], check=False)
            if os.path.exists(f) and os.path.getsize(f) > 2000: files.append(f)
        out.append({'shortCode': sc, 'url': x.get('url'), 'owner': x.get('ownerUsername'), 'ownerName': x.get('ownerFullName'),
                    'time': x.get('timestamp'), 'type': x.get('type'), 'caption': (x.get('caption') or '')[:400], 'files': files})
    return out
def dataset(did):
    req = urllib.request.Request(f'https://api.apify.com/v2/datasets/{did}/items?format=json&clean=true', headers={'Authorization': f'Bearer {TOKEN}'})
    with urllib.request.urlopen(req, timeout=120) as r: return json.load(r)
mode, outp = sys.argv[1], sys.argv[2]
if mode == 'dataset':
    items = dataset(sys.argv[3])
elif mode == 'posts':
    items = run({'directUrls': sys.argv[3:], 'resultsType': 'posts', 'resultsLimit': 1, 'addParentData': False})
else:
    user, lim = sys.argv[3], int(sys.argv[4])
    items = run({'directUrls': [f'https://www.instagram.com/{user}/'], 'resultsType': 'posts', 'resultsLimit': lim, 'addParentData': False})
res = grab(items if isinstance(items, list) else [])
json.dump(res, open(outp, 'w'), indent=1)
for r in res: print(r['shortCode'], r['time'][:10] if r['time'] else '', r['owner'], len(r['files']), 'img |', r['caption'][:90].replace('\n', ' '))
