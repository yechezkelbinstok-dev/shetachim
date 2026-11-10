# Append Sunbiz name-list rows (document_number<TAB>name<TAB>status) from stdin to names.tsv, deduped,
# keyed by document number + name (Sunbiz lists former names as 'NAME HS' under the same number),
# with the filing year read off the document number (letter + 2-digit year + sequence, e.g. N03000009759 = 2003).
import sys, csv, re, os
p = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'names.tsv')
rows = {}
if os.path.exists(p):
    for r in csv.DictReader(open(p), delimiter='\t'): rows[r['document_number'] + '|' + r['name']] = r
n0 = len(rows)
for line in sys.stdin:
    line = line.rstrip('\n')
    if not line.strip(): continue
    doc, name, status = (line.split('\t') + ['', ''])[:3]
    m = re.match(r'^[A-Z](\d{2})\d{9}$', doc)
    yr = (2000 + int(m.group(1)) if int(m.group(1)) <= 30 else 1900 + int(m.group(1))) if m else ''
    rows[doc + '|' + name] = {'document_number': doc, 'name': name, 'status': status, 'year_from_number': yr}
w = csv.DictWriter(open(p, 'w'), fieldnames=['document_number', 'name', 'status', 'year_from_number'], delimiter='\t')
w.writeheader()
for r in sorted(rows.values(), key=lambda r: r['name']): w.writerow(r)
print(f'{len(rows)} rows ({len(rows) - n0} new)')
