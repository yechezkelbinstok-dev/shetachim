# accts.py <res.json>: the accounts each 'S:' (or plain) user search found
import json, sys
for k, v in json.load(open(sys.argv[1])).items():
    if k.startswith('P:'): continue
    print('##', k, v['status'])
    for it in (v.get('items') or [])[:5]:
        print('   @%-28s %-38s f=%-8s %s' % (it.get('username'), (it.get('fullName') or '')[:38], it.get('followersCount'), (it.get('biography') or '')[:70].replace('\n', ' ')))
