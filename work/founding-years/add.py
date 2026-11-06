# Add or replace founding-year entries: python3 work/founding-years/add.py < entries.json
# entries.json: {"<chabad.org id>": {"name", "city", "year", "how", "source", "note", "confidence", "shetach"}, ...}
import json, sys
path = 'data/founding-years.json'
data = json.load(open(path, encoding='utf-8'))
new = json.load(sys.stdin)
for k, v in new.items():
    data['centers'][str(k)] = v
open(path, 'w', encoding='utf-8').write(json.dumps(data, indent=1, ensure_ascii=False) + '\n')
print(f"{len(new)} added; {len(data['centers'])} centers in all")
