# Massachusetts towns coloured by their shetach (ma-towns.json rules; a town not listed goes by its centroid's side of
# the split), the split meridian, the houses; for designing the borders.  python3 towns_svg.py out.svg [W S E N]
import json, sys, math
R='/home/user/shetachim'
cfg=json.load(open(f'{R}/data/shapes/ma-towns.json'))
towns=json.load(open(f'{R}/.cache/county-subdivision-25.json'))['features']
key=lambda s: ''.join(ch for ch in s.lower().replace(' town','') if ch.isalpha())
lab={key(t):sid for sid,l in cfg['towns'].items() for t in l}
cape=set(cfg['counties']['cape-cod-and-the-islands']) if isinstance(cfg['counties'],dict) else set()
COL={'central-massachusetts':'#f6c96b','eastern-massachusetts':'#9cc3f0','south-area':'#f19c9c','merrimack-valley':'#b8e08f','north-shore-of-massachusetts':'#d1a6ef','cape-cod-and-the-islands':'#8fd9c9','connecticut':'#cccccc'}
W,So,E,N=(-72.0,41.55,-70.55,42.9) if len(sys.argv)<3 else map(float,sys.argv[2:6])
PX=int(sys.argv[6]) if len(sys.argv)>6 else 1500; c=math.cos(math.radians((So+N)/2)); sc=PX/((E-W)*c); H=int((N-So)*sc)
X=lambda x:(x-W)*c*sc; Y=lambda y:(N-y)*sc
def rings(g): return [g['coordinates']] if g['type']=='Polygon' else g['coordinates']
def path(g): return ''.join('M'+'L'.join(f'{X(x):.1f},{Y(y):.1f}' for x,y in r)+'Z' for poly in rings(g) for r in poly)
out=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{PX}" height="{H}" font-family="Arial"><rect width="100%" height="100%" fill="#e8eef5"/>']
labels=[]
for f in towns:
    p=f['properties']; g=f['geometry']
    if not g: continue
    pts=[pt for poly in rings(g) for pt in poly[0]]
    cx=sum(x for x,y in pts)/len(pts); cy=sum(y for x,y in pts)/len(pts)
    county=p['STATEFP']+p['COUNTYFP']
    if county in cape: sid='cape-cod-and-the-islands'
    elif cx<cfg['deren']: sid='connecticut'
    else: sid=lab.get(key(p['NAME'])) or (cfg['westOfSplit'] if cx<cfg['split'] else cfg['eastOfSplit'])
    listed = key(p['NAME']) in lab
    out.append(f'<path d="{path(g)}" fill="{COL[sid]}" stroke="#666" stroke-width="{0.6}"/>')
    if W<cx<E and So<cy<N: labels.append(f'<text x="{X(cx):.0f}" y="{Y(cy):.0f}" font-size="12" fill="#222" text-anchor="middle" font-weight="{"bold" if listed else "normal"}">{p["NAME"].replace(" town","")}</text>')
out+=labels
for lon_,col in ((cfg['split'],'#d00'),(cfg['deren'],'#555')):
    out.append(f'<line x1="{X(lon_):.0f}" y1="0" x2="{X(lon_):.0f}" y2="{H}" stroke="{col}" stroke-dasharray="6 4" stroke-width="1.5"/>')
SH={'central-massachusetts':'#a06a00','eastern-massachusetts':'#1050a0','south-area':'#a01010','merrimack-valley':'#3a7a10','north-shore-of-massachusetts':'#6a20a0','cape-cod-and-the-islands':'#107a6a','connecticut':'#444'}
for f in json.load(open(f'{R}/web/data/centers.geojson'))['features']:
    p=f['properties']
    if p['region']!='US-MA': continue
    x,y=f['geometry']['coordinates']; sh=(p.get('piece') or '').split(':')[-1]
    out.append(f'<circle cx="{X(x):.1f}" cy="{Y(y):.1f}" r="4.5" fill="{SH.get(sh,"#000")}" stroke="#fff" stroke-width="1.2"/>')
out.append('</svg>')
open(sys.argv[1],'w').write('\n'.join(out))
