# Pull Firecrawl entities/entity results out of this session's transcript (JSONL) by requestId and write them as the
# same {data: {alexandria: [...]}} JSON the saved tool-result files have, so save_entities.py can read them.
import json, sys
tr, req, outp = sys.argv[1], sys.argv[2], sys.argv[3]
found = None
for line in open(tr):
    if req not in line: continue
    try: ev = json.loads(line)
    except Exception: continue
    msg = ev.get('message') or {}
    for part in (msg.get('content') or []) if isinstance(msg.get('content'), list) else []:
        if part.get('type') != 'tool_result': continue
        cont = part.get('content')
        texts = [c.get('text', '') for c in cont] if isinstance(cont, list) else [cont or '']
        for t in texts:
            if req in t and t.strip().startswith('{'):
                found = json.loads(t)
if not found: sys.exit('not found')
json.dump(found, open(outp, 'w')); print('ok', len(found['data']['alexandria']))
