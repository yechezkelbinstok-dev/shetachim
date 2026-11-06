# Adds the second session's field notes to data/founding-years.json's 'about' if missing (idempotent; run after add.py).
import json
p = 'data/founding-years.json'
d = json.load(open(p, encoding='utf-8'))
add = (" 'season' (owner, Nov 6: \"or season which equates to a range ofc\"): when only a season turns up for the same event"
       " as 'year' ('winter', 'spring', 'summer', 'fall'; or 'High Holidays', 'Chanukah' and the like).")
if "'season'" not in d['about']:
    d['about'] += add
    open(p, 'w', encoding='utf-8').write(json.dumps(d, indent=1, ensure_ascii=False) + '\n')
    print('about: season added')
