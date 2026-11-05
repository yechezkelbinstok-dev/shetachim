# save_heads.py <entries.json>: copy photos/out/<id>.jpg into web/img/heads/ and add/replace the entries in
# data/head-photos.json (kept in data/shetachim.json order). Entry: {id, head, page, image, note?}
import json, shutil, sys
S = '/tmp/claude-0/-home-user-shetachim/6dfe7d99-9185-570e-b237-1d68bcc4daf7/scratchpad'
R = '/home/user/shetachim'
new = json.load(open(sys.argv[1]))
db = json.load(open(f'{R}/data/head-photos.json'))
order = [s['id'] for s in json.load(open(f'{R}/data/shetachim.json'))['shetachim']]
heads = {s['id']: s.get('headShliach') for s in json.load(open(f'{R}/data/shetachim.json'))['shetachim']}
by = {p['id']: p for p in db['photos']}
for e in new:
    assert e['id'] in heads, e['id']
    if heads[e['id']] != e['head']:
        print('NOTE head differs from data:', e['id'], e['head'], '!=', heads[e['id']])
    shutil.copy(f"{S}/photos/out/{e['id']}.jpg", f"{R}/web/img/heads/{e['id']}.jpg")
    rec = {'id': e['id'], 'head': e['head'], 'file': f"img/heads/{e['id']}.jpg", 'page': e['page'], 'image': e['image']}
    if e.get('note'): rec['note'] = e['note']
    by[e['id']] = rec
db['photos'] = sorted(by.values(), key=lambda p: order.index(p['id']) if p['id'] in order else 9999)
with open(f'{R}/data/head-photos.json', 'w') as f:
    json.dump(db, f, ensure_ascii=False, indent=1); f.write('\n')
print('saved', len(new), '- total', len(db['photos']))
