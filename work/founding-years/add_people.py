# Add the people of a center (founders, first directors, ... as the founding sources name them) to data/founding-years.json:
#   python3 work/founding-years/add_people.py < batch.json
# batch.json: {"<chabad.org id>": [{"name": "Rabbi Berel Shemtov", "role": "founder", "from": "1958", "source": "<url>"}, ...], ...}
# 'role': founder | co-founder | first director | director | principal | rabbi | head (what the source says he or she was);
# 'from' / 'to': years where the source gives them; 'source': where it's said, when not the entry's own source.
# An empty list marks a center checked with no one named. Owner, Nov 12: "WHY ISNT THERE PERSONELL WHERE AVAILABLE THAT
# WASNT PART OF THE RESEARCH??? NOW WOW I NEED A WHOLE NOTHER ROUND".
import json, sys
path = 'data/founding-years.json'
data = json.load(open(path, encoding='utf-8'))
new = json.load(sys.stdin)
bad = [k for k in new if str(k) not in data['centers']]
if bad: sys.exit(f'not in founding-years.json: {bad}')
for k, people in new.items():
    for p in people:
        assert p.get('name') and p.get('role'), (k, p)
    data['centers'][str(k)]['people'] = people
open(path, 'w', encoding='utf-8').write(json.dumps(data, indent=1, ensure_ascii=False) + '\n')
done = sum(1 for e in data['centers'].values() if 'people' in e)
named = sum(1 for e in data['centers'].values() if e.get('people'))
print(f"{len(new)} added; people checked for {done} of {len(data['centers'])} centers, someone named for {named}")
