# ig_batch.py <out.json> <jobs.json>: run apify/instagram-scraper jobs, at most 4 at a time (the free plan allows 5);
# picks up runs already started for the same input (by their INPUT record). Saves each job's items under its key.
import json, sys, time, urllib.request
S = '/tmp/claude-0/-home-user-shetachim/6dfe7d99-9185-570e-b237-1d68bcc4daf7/scratchpad'
TOKEN = open(f'{S}/.apify_token').read().strip()
H = {'Authorization': f'Bearer {TOKEN}', 'Content-Type': 'application/json'}
def call(url, data=None):
    req = urllib.request.Request(url, data=json.dumps(data).encode() if data is not None else None, headers=H, method='POST' if data is not None else 'GET')
    with urllib.request.urlopen(req, timeout=120) as r: return json.load(r)
jobs = json.load(open(sys.argv[2]))
sig = lambda inp: json.dumps({k: inp.get(k) for k in ('search', 'searchType', 'directUrls', 'resultsType', 'resultsLimit')}, sort_keys=True)
key_of = {sig(j['input']): j['key'] for j in jobs}
runs = {}
# runs already started (e.g. by an earlier, interrupted batch) for one of these inputs
for r in call('https://api.apify.com/v2/actor-runs?desc=1&limit=30')['data']['items']:
    try:
        inp = call(f"https://api.apify.com/v2/key-value-stores/{r['defaultKeyValueStoreId']}/records/INPUT")
    except Exception:
        continue
    k = key_of.get(sig(inp))
    if k and k not in runs and r['status'] in ('READY', 'RUNNING', 'SUCCEEDED'): runs[k] = r['id']
pending = [j for j in jobs if j['key'] not in runs]
out, t0 = {}, time.time()
while (pending or len(out) < len(runs)) and time.time() - t0 < 2300:
    active = [k for k in runs if k not in out]
    running = len(call('https://api.apify.com/v2/actor-runs?status=RUNNING&limit=10')['data']['items'])
    while pending and max(len(active), running) < 4:
        j = pending.pop(0)
        runs[j['key']] = call('https://api.apify.com/v2/acts/apify~instagram-scraper/runs', j['input'])['data']['id']; active.append(j['key']); running += 1
    time.sleep(8)
    for k, rid in runs.items():
        if k in out: continue
        r = call(f'https://api.apify.com/v2/actor-runs/{rid}')['data']
        if r['status'] in ('SUCCEEDED', 'FAILED', 'ABORTED', 'TIMED-OUT'):
            items = call(f"https://api.apify.com/v2/datasets/{r['defaultDatasetId']}/items?format=json&clean=true") if r['status'] == 'SUCCEEDED' else []
            out[k] = {'status': r['status'], 'usd': r.get('usageTotalUsd'), 'items': items}
json.dump(out, open(sys.argv[1], 'w'), indent=1)
print('done', len(out), 'of', len(jobs), '| $', round(sum((v.get('usd') or 0) for v in out.values()), 3))
