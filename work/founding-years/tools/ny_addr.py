# For undated NY listings: corporations filed at the listing's street address (data.ny.gov 2tms-hftb), with their names and first filing dates.
import json, sys, os, re, urllib.parse, subprocess, concurrent.futures as cf
L = json.load(open(sys.argv[1])); capi = sys.argv[2]; outp = sys.argv[3]
def q(ds, where, lim=200, sel=None):
    p = {'$limit': lim, '$where': where}
    if sel: p['$select'] = sel
    url = f"https://data.ny.gov/resource/{ds}.json?" + urllib.parse.urlencode(p)
    for _ in range(3):
        r = subprocess.run(['curl', '-sS', '--max-time', '90', url], capture_output=True, text=True)
        try: return json.loads(r.stdout)
        except Exception: pass
    return []
SUF = r'\b(STREET|ST|AVENUE|AVE|ROAD|RD|BOULEVARD|BLVD|DRIVE|DR|LANE|LN|PLACE|PL|COURT|CT|TURNPIKE|TPKE|HIGHWAY|HWY|PARKWAY|PKWY|WAY|TERRACE|TER)\b\.?'
def core(a):
    a = (a or '').upper().replace('.', '').replace(',', ' ')
    a = re.sub(r'\b(SUITE|STE|APT|UNIT|FL|FLOOR|#)\b.*$', '', a).strip()
    m = re.match(r'^(\d+[A-Z]?)(?:-\d+)?\s+(.*)$', a)
    if not m: return None
    num, rest = m.group(1), m.group(2)
    rest = re.sub(SUF, '', rest).strip()
    rest = re.sub(r'\b(NORTH|SOUTH|EAST|WEST|N|S|E|W)\b', '', rest).strip()
    words = rest.split()
    if not words: return None
    return num, max(words, key=len)
def one(x):
    j = json.load(open(os.path.join(capi, x['id'] + '.json')))
    a = (j.get('address') or {}).get('address-line1', '')
    c = core(a)
    res = {'id': x['id'], 'name': x['name'], 'city': x['city'], 'addr': a, 'by': x['by'], 'dirs': x['dirs'], 'corps': []}
    if not c: return res
    num, word = c
    rows = q('2tms-hftb', f"upper(addr1) like '{num} %' AND upper(addr1) like '%{word}%'")
    ids = sorted({r['corpid_num'] for r in rows})
    for cid in ids[:25]:
        names = q('ekwr-p59j', f"corpid_num='{cid}'", lim=50)
        if not names: continue
        first = min(n.get('date_filed', '9999') for n in names)
        nm = sorted({n.get('corp_name', '') for n in names})
        cur = [n.get('corp_name') for n in names if n.get('name_status') == 'A'] or nm
        addrs = sorted({(r.get('addr1') or '', r.get('city') or '', (r.get('date_filed') or '')[:10], r.get('addr_type') or '') for r in rows if r['corpid_num'] == cid})
        res['corps'].append({'dos_id': cid, 'first_filed': first[:10], 'names': nm, 'current': cur, 'addrs': addrs[:4]})
    return res
with cf.ThreadPoolExecutor(6) as ex: out = list(ex.map(one, L))
json.dump(out, open(outp, 'w'), indent=1)
print(sum(1 for o in out if o['corps']), 'of', len(out), 'listings have corporations at their address')
