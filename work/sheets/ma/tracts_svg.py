# Tracts of some towns (with their GEOIDs) over the towns, the current MV/Eastern shapes' border, houses.
import json, math, sys
R='/home/user/shetachim'
W,So,E,N=map(float,sys.argv[2:6]); PX=int(sys.argv[6])
towns=json.load(open(f'{R}/.cache/county-subdivision-25.json'))['features']
tracts=json.load(open(f'{R}/.cache/tract-25.json'))['features']
c=math.cos(math.radians((So+N)/2)); sc=PX/((E-W)*c); H=int((N-So)*sc)
X=lambda x:(x-W)*c*sc; Y=lambda y:(N-y)*sc
def rings(g): return [g['coordinates']] if g['type']=='Polygon' else g['coordinates']
def path(g): return ''.join('M'+'L'.join(f'{X(x):.1f},{Y(y):.1f}' for x,y in r)+'Z' for poly in rings(g) for r in poly)
def inbox(g):
    for poly in rings(g):
        for x,y in poly[0]:
            if W<x<E and So<y<N: return True
    return False
out=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{PX}" height="{H}" font-family="Arial"><rect width="100%" height="100%" fill="#f4f4f4"/>']
COL={'ma-merrimack-valley':'#b8e08f','ma-eastern':'#e8d9b8','ma-central':'#f6c96b'}
for fn,col in COL.items():
    for f in json.load(open(f'{R}/data/shapes/{fn}.geojson'))['features']:
        out.append(f'<path d="{path(f["geometry"])}" fill="{col}" stroke="none"/>')
for f in tracts:
    if f['geometry'] and inbox(f['geometry']):
        out.append(f'<path d="{path(f["geometry"])}" fill="none" stroke="#888" stroke-width="0.7"/>')
        pts=[p for poly in rings(f['geometry']) for p in poly[0]]
        cx=sum(p[0] for p in pts)/len(pts); cy=sum(p[1] for p in pts)/len(pts)
        if W<cx<E and So<cy<N: out.append(f'<text x="{X(cx):.0f}" y="{Y(cy):.0f}" font-size="9" fill="#555" text-anchor="middle">{f["properties"]["GEOID"][-6:]}</text>')
for f in towns:
    if f['geometry'] and inbox(f['geometry']):
        out.append(f'<path d="{path(f["geometry"])}" fill="none" stroke="#222" stroke-width="2"/>')
        pts=[p for poly in rings(f['geometry']) for p in poly[0]]
        cx=sum(p[0] for p in pts)/len(pts); cy=sum(p[1] for p in pts)/len(pts)
        if W<cx<E and So<cy<N: out.append(f'<text x="{X(cx):.0f}" y="{Y(cy)-14:.0f}" font-size="15" font-weight="bold" fill="#000" text-anchor="middle">{f["properties"]["NAME"].replace(" town","")}</text>')
for f in json.load(open(f'{R}/web/data/centers.geojson'))['features']:
    x,y=f['geometry']['coordinates']
    if W<x<E and So<y<N: out.append(f'<circle cx="{X(x):.1f}" cy="{Y(y):.1f}" r="5" fill="#c00" stroke="#fff"/>')
for lon in [round(W+i*0.05,2) for i in range(int((E-W)/0.05)+1)]: out.append(f'<text x="{X(lon):.0f}" y="12" font-size="10" fill="#00a">{lon}</text>')
for lat in [round(So+i*0.02,2) for i in range(int((N-So)/0.02)+1)]: out.append(f'<text x="2" y="{Y(lat):.0f}" font-size="10" fill="#00a">{lat}</text>')
out.append('</svg>')
open(sys.argv[1],'w').write('\n'.join(out))
