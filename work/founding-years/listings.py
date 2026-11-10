# One shetach's blue dots and their listings, to start or continue its founding years:
#   python3 work/founding-years/listings.py western-pennsylvania          (all of them)
#   python3 work/founding-years/listings.py western-pennsylvania --missing (only the dots with no year yet)
# Takes every map piece whose `piece` ends in `:<shetach id>` (ten shetachim cross a state or country line), US and
# Canada only, no mushrooms. Each line: chabad.org id | name | type | city | directors | what data/founding-years.json has.
import json, sys
# Mikvahs are left out of the counts (owner, Nov 10: "only mikvaos out - def don't delete data tho"): their data stays.
def is_mikvah(c): return (c.get('type') or '').lower().startswith('mik') or 'mikv' in (c.get('name') or '').lower()
sid = sys.argv[1]; missing = '--missing' in sys.argv
g = json.load(open('web/data/centers.geojson')); fy = json.load(open('data/founding-years.json'))['centers']
n = 0
for f in g['features']:
    p = f['properties']
    if p.get('country') not in ('US', 'CA') or (p.get('piece') or ':none').split(':')[-1] != sid: continue
    cs = [c for c in p.get('centers') or [] if not c.get('mushroom') and not is_mikvah(c)]
    if not cs: continue
    if missing and any((fy.get(str(c['id'])) or {}).get('year') for c in cs): continue
    n += 1; lon, lat = f['geometry']['coordinates'][:2]
    print(f'dot {n} ({p.get("region")}, {lat:.4f},{lon:.4f})')
    for c in cs:
        e = fy.get(str(c['id'])); heads = ', '.join(f"{x.get('firstName') or ''} {x.get('lastName') or ''}".strip()
                                                    for x in c.get('personnel') or [] if x.get('isDirector'))
        has = 'not researched' if not e else f"{e.get('year') or '-'} {e.get('confidence')}"
        print(f"   {c['id']} | {c.get('name')} | {c.get('type')} | {c.get('city')} | {heads} | {has}")
print(f'{n} dots', file=sys.stderr)
