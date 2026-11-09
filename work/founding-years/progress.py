# How much is left, as an amount and a % (owner, Nov 6: "keep telling me how much left (amount and %) so I can steadily
# see progress"). Put these lines in every update to the owner: the HIGH share first (his metric, Nov 8), then what's left.
#   python3 work/founding-years/progress.py west-coast michigan small     (small = the shetachim with 10 dots or fewer)
#   python3 work/founding-years/progress.py western-pennsylvania georgia
#   python3 work/founding-years/progress.py                                 (every US + Canada shetach)
# A dot (a map point) counts as done when any of its listings has a year; listings = blue dots' listings, no mushrooms.
import json, collections, sys
g = json.load(open('web/data/centers.geojson')); fy = json.load(open('data/founding-years.json'))['centers']
dots = collections.defaultdict(list)
for f in g['features']:
    p = f['properties']
    if p.get('country') not in ('US', 'CA'): continue   # US and Canada only (owner, Nov 6: "Not Mexico!!!!!")
    ids = [str(c['id']) for c in p.get('centers') or [] if not c.get('mushroom')]
    if ids: dots[(p.get('piece') or ':none').split(':')[-1]].append(ids)
started = {s for s, ds in dots.items() if any(fy.get(i) for d in ds for i in d)}
groups = collections.OrderedDict()
for a in sys.argv[1:] or ['all']:
    if a == 'small': groups['small shetachim'] = sorted(s for s in started if len(dots[s]) <= 10)
    elif a == 'all': groups['all US + Canada'] = sorted(dots)
    elif a in dots: groups[a] = [a]
    else: sys.exit(f'unknown shetach: {a} (ids as in STATUS.md)')
T = collections.Counter(); lines = []
for name, sids in groups.items():
    k = collections.Counter()
    for s in sids:
        for ids in dots[s]:
            k['d'] += 1; k['dl'] += not any((fy.get(i) or {}).get('year') for i in ids)
            k['l'] += len(ids); k['ll'] += sum(1 for i in ids if not (fy.get(i) or {}).get('year'))
            k['h'] += sum(1 for i in ids if (fy.get(i) or {}).get('year') and fy[i].get('confidence') == 'high')
    T.update(k); lines.append(f"  {name}: high {k['h']} of {k['l']} listings ({100*k['h']/k['l']:.0f}%); {k['dl']} of {k['d']} dots left ({100*k['dl']/k['d']:.0f}%), {k['ll']} of {k['l']} listings")
# The owner's metric (Nov 8): the share of listings that are HIGH ("the goal is 100% high. Or let's say like 90-95% high").
y = T['l'] - T['ll']
print(f"HIGH: {T['h']} of {T['l']} listings ({100*T['h']/T['l']:.1f}%); {100*T['h']/max(y,1):.0f}% of the {y} with a year")
print(f"LEFT: {T['dl']} of {T['d']} dots ({100*T['dl']/T['d']:.1f}%), {T['ll']} of {T['l']} listings ({100*T['ll']/T['l']:.1f}%)")
if len(lines) > 1: print('\n'.join(lines))
