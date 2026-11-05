# Gurkow's South Area before and after, side by side, for the owner
import json, math, sys
R='/home/user/shetachim'; S='/tmp/claude-0/-home-user-shetachim/6dfe7d99-9185-570e-b237-1d68bcc4daf7/scratchpad'
towns=json.load(open(f'{R}/.cache/county-subdivision-25.json'))['features']
old=json.load(open(f'{S}/ma/sa_ring.json')); new=json.load(open(f'{S}/ma/sa_new.json'))
W,So,E,N=-71.20,41.965,-70.935,42.25
PX=560; c=math.cos(math.radians((So+N)/2)); sc=PX/((E-W)*c); H=int((N-So)*sc)
def rings(g): return [g['coordinates']] if g['type']=='Polygon' else g['coordinates']
def panel(ring, title, dx):
    X=lambda x:(x-W)*c*sc+dx; Y=lambda y:(N-y)*sc+40
    o=[f'<clipPath id="c{dx}"><rect x="{dx}" y="40" width="{PX}" height="{H}"/></clipPath><g clip-path="url(#c{dx})">', f'<rect x="{dx}" y="40" width="{PX}" height="{H}" fill="#f4f6f8"/>']
    for f in towns:
        g=f['geometry']
        if not g: continue
        pts=[p for poly in rings(g) for p in poly[0]]
        if not any(W-0.05<x<E+0.05 and So-0.05<y<N+0.05 for x,y in pts): continue
        d=''.join('M'+'L'.join(f'{X(x):.1f},{Y(y):.1f}' for x,y in r)+'Z' for poly in rings(g) for r in poly)
        o.append(f'<path d="{d}" fill="#fff" stroke="#c4c8d0" stroke-width="0.8"/>')
        cx=sum(x for x,y in pts)/len(pts); cy=sum(y for x,y in pts)/len(pts)
        if W+0.01<cx<E-0.01 and So+0.01<cy<N-0.01: o.append(f'<text x="{X(cx):.0f}" y="{Y(cy):.0f}" font-size="11" fill="#8a8f99" text-anchor="middle">{f["properties"]["NAME"].replace(" town","").replace(" Town","")}</text>')
    o.append('<path d="M'+'L'.join(f'{X(x):.1f},{Y(y):.1f}' for x,y in ring)+'Z" fill="#5b8fd6" fill-opacity="0.28" stroke="#1f4e9c" stroke-width="2.5" stroke-linejoin="round"/>')
    for f in json.load(open(f'{R}/web/data/centers.geojson'))['features']:
        x,y=f['geometry']['coordinates']
        if W<x<E and So<y<N:
            nm=f['properties']['centers'][0]['name']; lab={'117632':'Shaloh House','4881009':'Chabad of Canton','117631':'Sharon'}.get(f['properties']['centers'][0]['id'],'')
            o.append(f'<circle cx="{X(x):.1f}" cy="{Y(y):.1f}" r="5" fill="#d7301f" stroke="#fff" stroke-width="1.5"/>')
            if lab: o.append(f'<text x="{X(x)+7:.0f}" y="{Y(y)+4:.0f}" font-size="11" font-weight="bold" fill="#a3170c">{lab}</text>')
    o.append('</g>')
    o.append(f'<text x="{dx+PX/2}" y="28" font-size="20" font-weight="bold" text-anchor="middle" fill="#222">{title}</text>')
    return o
out=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{2*PX+20}" height="{H+50}" font-family="Arial"><rect width="100%" height="100%" fill="#fff"/>']
out+=panel(old,'Before',0)+panel(new,'After',PX+20)
out.append('</svg>')
open(sys.argv[1],'w').write('\n'.join(out))
