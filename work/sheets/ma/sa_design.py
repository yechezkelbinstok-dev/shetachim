# The South Area's outline with numbered corners over the towns and houses, for placing straight lines
import json, math, sys
R='/home/user/shetachim'; S='/tmp/claude-0/-home-user-shetachim/6dfe7d99-9185-570e-b237-1d68bcc4daf7/scratchpad'
towns=json.load(open(f'{R}/.cache/county-subdivision-25.json'))['features']
ring=json.load(open(f'{S}/ma/sa_ring.json'))
cand=json.load(open(sys.argv[2])) if len(sys.argv)>2 else None
W,So,E,N=-71.20,41.96,-70.93,42.25
PX=1100; c=math.cos(math.radians((So+N)/2)); sc=PX/((E-W)*c); H=int((N-So)*sc)
X=lambda x:(x-W)*c*sc; Y=lambda y:(N-y)*sc
def rings(g): return [g['coordinates']] if g['type']=='Polygon' else g['coordinates']
def path(g): return ''.join('M'+'L'.join(f'{X(x):.1f},{Y(y):.1f}' for x,y in r)+'Z' for poly in rings(g) for r in poly)
out=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{PX}" height="{H}" font-family="Arial"><rect width="100%" height="100%" fill="#f4f6f8"/>']
for f in towns:
    g=f['geometry']
    if not g: continue
    pts=[p for poly in rings(g) for p in poly[0]]
    if not any(W-0.05<x<E+0.05 and So-0.05<y<N+0.05 for x,y in pts): continue
    out.append(f'<path d="{path(g)}" fill="#fff" stroke="#aab" stroke-width="1"/>')
    cx=sum(x for x,y in pts)/len(pts); cy=sum(y for x,y in pts)/len(pts)
    if W<cx<E and So<cy<N: out.append(f'<text x="{X(cx):.0f}" y="{Y(cy):.0f}" font-size="13" fill="#889" text-anchor="middle">{f["properties"]["NAME"].replace(" town","").replace(" Town","")}</text>')
out.append('<path d="M'+'L'.join(f'{X(x):.1f},{Y(y):.1f}' for x,y in ring)+'Z" fill="#d7301f" fill-opacity="0.25" stroke="#7a0b0b" stroke-width="3"/>')
if cand: out.append('<path d="M'+'L'.join(f'{X(x):.1f},{Y(y):.1f}' for x,y in cand)+'Z" fill="none" stroke="#0a6" stroke-width="3" stroke-dasharray="8 5"/>')
for i,(x,y) in enumerate(ring):
    if i%3==0: out.append(f'<text x="{X(x)+3:.0f}" y="{Y(y)-3:.0f}" font-size="10" fill="#7a0b0b">{i}</text>')
for f in json.load(open(f'{R}/web/data/centers.geojson'))['features']:
    x,y=f['geometry']['coordinates']
    if W<x<E and So<y<N: out.append(f'<circle cx="{X(x):.1f}" cy="{Y(y):.1f}" r="6" fill="#1f4e9c" stroke="#fff" stroke-width="2"/><text x="{X(x)+8:.0f}" y="{Y(y)+4:.0f}" font-size="11" fill="#1f4e9c">{f["properties"]["centers"][0]["name"][:24]}</text>')
out.append('</svg>')
open(sys.argv[1],'w').write('\n'.join(out))
