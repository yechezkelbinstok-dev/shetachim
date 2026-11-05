# Draw eastern Massachusetts: towns filled by current shetach, town names, and every center as a labelled dot.
import json, math, sys
S = '/tmp/claude-0/-home-user-shetachim/6dfe7d99-9185-570e-b237-1d68bcc4daf7/scratchpad/ma'
towns = json.load(open(f'{S}/cousub-25.json'))['features']
assign = {a['geoid']: a for a in json.load(open(f'{S}/assign.json'))}
override = json.load(open(sys.argv[2])) if len(sys.argv) > 2 else {}
W, E, Sth, N = [float(x) for x in sys.argv[1].split(',')]  # lon/lat box
PX = 2200
k = PX / (E - W); kx = k; ky = k / math.cos(math.radians((N + Sth) / 2))
H = int((N - Sth) * ky)
X = lambda lon: (lon - W) * kx
Y = lambda lat: (N - lat) * ky
COL = {'central-massachusetts': '#f6d28b', 'eastern-massachusetts': '#a9cdf0', 'south-area': '#f2a0a0', 'north-shore-of-massachusetts': '#b9e3a8',
       'cape-cod-and-the-islands': '#d9c2ef', 'connecticut': '#dddddd', 'merrimack-valley': '#f5b8dc', '?': '#ffffff'}
out = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{PX}" height="{H}" viewBox="0 0 {PX} {H}" font-family="Arial">', f'<rect width="{PX}" height="{H}" fill="#eef4f8"/>']
def rings(g): return [g['coordinates']] if g['type'] == 'Polygon' else g['coordinates']
labels = []
for f in towns:
    a = assign[f['properties']['GEOID']]
    sid = override.get(a['name'], a['sid'])
    d = ''
    for poly in rings(f['geometry']):
        for r in poly: d += 'M' + 'L'.join(f'{X(x):.1f},{Y(y):.1f}' for x, y in r) + 'Z'
    out.append(f'<path d="{d}" fill="{COL.get(sid, "#fff")}" stroke="#666" stroke-width="0.6"/>')
    if W <= a['cx'] <= E and Sth <= a['cy'] <= N: labels.append(f'<text x="{X(a["cx"]):.1f}" y="{Y(a["cy"]):.1f}" font-size="11" fill="#333" text-anchor="middle">{a["name"].replace(" Town","")}</text>')
for lon, col in [(-71.24694, '#c00'), (-72.1574, '#c00')]:
    if W < lon < E: out.append(f'<line x1="{X(lon):.1f}" y1="0" x2="{X(lon):.1f}" y2="{H}" stroke="{col}" stroke-dasharray="6 6" stroke-width="1.5"/>')
out += labels
cs = json.load(open('/home/user/shetachim/web/data/centers.geojson'))['features']
DOT = {'central-massachusetts': '#b07a00', 'eastern-massachusetts': '#1f5fa8', 'south-area': '#c0282d', 'north-shore-of-massachusetts': '#2e7d32', 'cape-cod-and-the-islands': '#6a3d9a', 'connecticut': '#555'}
for f in cs:
    p = f['properties']
    if p.get('region') != 'US-MA': continue
    lon, lat = f['geometry']['coordinates']
    if not (W <= lon <= E and Sth <= lat <= N): continue
    sid = p['piece'].split(':', 1)[1]
    names = sorted({c['name'] for c in p['centers']})
    ppl = sorted({(c.get('personnel') or [{}])[0].get('lastName', '') or '' for c in p['centers']})
    out.append(f'<circle cx="{X(lon):.1f}" cy="{Y(lat):.1f}" r="6" fill="{DOT.get(sid, "#000")}" stroke="#fff" stroke-width="1.5"/>')
    out.append(f'<text x="{X(lon)+8:.1f}" y="{Y(lat)+4:.1f}" font-size="13" font-weight="bold" fill="{DOT.get(sid, "#000")}" stroke="#fff" stroke-width="3" paint-order="stroke">{"/".join(x for x in ppl if x)[:40]}</text>')
out.append('</svg>')
open(sys.argv[3] if len(sys.argv) > 3 else f'{S}/map.svg', 'w').write('\n'.join(out))
print(PX, H)
