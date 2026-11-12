# The centers whose people are not done yet, a batch at a time: python3 work/founding-years/people_todo.py [N] [offset] [--full]
# Compact by default: only the sentences of the note that name people (or '(no one named)').
import json, re, sys
fy = json.load(open('data/founding-years.json', encoding='utf-8'))['centers']
args = [a for a in sys.argv[1:] if not a.startswith('--')]; full = '--full' in sys.argv
n = int(args[0]) if args else 60; off = int(args[1]) if len(args) > 1 else 0
skip = set()
try:
    for line in open('work/founding-years/people-followup.txt', encoding='utf-8'):
        if line[:1].isdigit(): skip.add(line.split()[0])
except FileNotFoundError: pass
todo = [(k, e) for k, e in fy.items() if 'people' not in e and k not in skip]
print(f'{len(todo)} to do')
PERSON = re.compile(r"\b(Rabbi|Rebbetzin|Mrs\.|Mr\.|Rav|Reb|Dr\.|his wife|her husband|[Tt]he [A-Z][a-z]+(s|es)\b|[A-Z][a-z]+ (and|&) [A-Z][a-z]+ \[?[A-Z][a-z]+|\[[A-Z][a-z]+\]|founde|directed by|led by|run by|started by|established by|opened by|director|principal|dean|menahel|shluchim|shliach|emissar|couple)", re.U)
for k, e in todo[off:off + n]:
    note = (e.get('note') or '').strip()
    if full: body = note
    else:
        sents = re.split(r'(?<!Dr\.)(?<!Mr\.)(?<!Mrs\.)(?<!St\.)(?<=[.;])\s+(?=[A-Z(\'"])', note)
        hits = [s for s in sents if PERSON.search(s)]
        body = ' '.join(hits)[:420] if hits else '(no one named?) ' + note[:200]
    print(f"\n{k} | {e.get('name')} | {e.get('city')} | {e.get('year')}\n  {body}")
