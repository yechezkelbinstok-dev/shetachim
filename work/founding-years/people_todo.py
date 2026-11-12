# The centers whose people are not done yet, with their notes and sources, a batch at a time:
#   python3 work/founding-years/people_todo.py [N] [offset]
import json, re, sys
fy = json.load(open('data/founding-years.json', encoding='utf-8'))['centers']
n = int(sys.argv[1]) if len(sys.argv) > 1 else 60; off = int(sys.argv[2]) if len(sys.argv) > 2 else 0
todo = [(k, e) for k, e in fy.items() if 'people' not in e]
print(f'{len(todo)} to do')
for k, e in todo[off:off + n]:
    src = ' '.join(re.findall(r'https?://\S+?(?=["\s,\]]|$)', json.dumps(e.get('source') or e.get('sources') or '')))[:160]
    print(f"\n## {k} | {e.get('name')} | {e.get('city')} | {e.get('year')}\n{(e.get('note') or '').strip()}\n  src: {src}")
