# Save Sunbiz entity records (Firecrawl search-sunbiz-org entities/entity results, a saved tool-result file given as
# argument) one JSON per document number in entities/, then rewrite entities.tsv: the summary of every saved record
# (document number, name, type, status, date filed, FEI/EIN, principal address, officers, last event, observed).
import json, sys, os, re, glob, csv
here = os.path.dirname(os.path.abspath(__file__))
out = os.path.join(here, 'entities')
for p in sys.argv[1:]:
    d = json.load(open(p))
    for r in d['data']['alexandria']:
        if r.get('error') or not r.get('data'):
            print('ERROR', r.get('options') or r.get('request') or '', r.get('error')); continue
        x = r['data']; doc = x.get('document_number')
        json.dump(x, open(os.path.join(out, f'{doc}.json'), 'w'), ensure_ascii=False, indent=1)
        print('saved', doc, x.get('name'), (x.get('filing_information') or {}).get('Date Filed'))
rows = []
for f in sorted(glob.glob(os.path.join(out, '*.json'))):
    x = json.load(open(f)); fi = x.get('filing_information') or {}
    sec = {s.get('heading'): s.get('text', '') for s in x.get('sections') or []}
    def strip(h): return re.sub(r'^' + re.escape(h) + r'\s*', '', sec.get(h, '')).strip()
    rows.append({'document_number': x.get('document_number'), 'name': x.get('name'), 'entity_type': x.get('entity_type'),
                 'status': fi.get('Status', ''), 'date_filed': fi.get('Date Filed', ''), 'fei_ein': fi.get('FEI/EIN Number', ''),
                 'last_event': fi.get('Last Event', ''), 'event_date_filed': fi.get('Event Date Filed', ''),
                 'principal_address': strip('Principal Address'), 'registered_agent': strip('Registered Agent Name & Address'),
                 'officers': strip('Officer/Director Detail'), 'name_history': strip('Name History') or strip('Document Images') and '',
                 'observed_at_ms': x.get('observed_at_ms')})
w = csv.DictWriter(open(os.path.join(here, 'entities.tsv'), 'w'), fieldnames=list(rows[0].keys()), delimiter='\t')
w.writeheader(); [w.writerow(r) for r in rows]
print(len(rows), 'records in entities.tsv')
