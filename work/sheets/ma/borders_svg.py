# Massachusetts's shetach borders two ways, side by side: (a) the old town lines (each town, or each side of the split
# meridian for a town not listed, to its shetach), (b) the current drawn shapes. Only the borders between shetachim.
import json, sys, math, subprocess
R='/home/user/shetachim'
cfg=json.load(open(f'{R}/data/shapes/ma-towns.json'))
towns=json.load(open(f'{R}/.cache/county-subdivision-25.json'))['features']
key=lambda s: ''.join(ch for ch in s.lower().replace(' town','') if ch.isalpha())
lab={key(t):sid for sid,l in cfg['towns'].items() for t in l}
cape=set(cfg['counties']['cape-cod-and-the-islands'])
COL={'central-massachusetts':'#f6c96b','eastern-massachusetts':'#9cc3f0','south-area':'#f19c9c','merrimack-valley':'#b8e08f','north-shore-of-massachusetts':'#d1a6ef','cape-cod-and-the-islands':'#8fd9c9','connecticut':'#cccccc'}
W,So,E,N=map(float,sys.argv[2:6]) if len(sys.argv)>5 else (-71.75,41.75,-70.85,42.75)
PX=900; c=math.cos(math.radians((So+N)/2)); sc=PX/((E-W)*c); H=int((N-So)*sc)
X=lambda x:(x-W)*c*sc; Y=lambda y:(N-y)*sc
def rings(g): return [g['coordinates']] if g['type']=='Polygon' else g['coordinates']
def path(g,dx=0): return ''.join('M'+'L'.join(f'{X(x)+dx:.1f},{Y(y):.1f}' for x,y in r)+'Z' for poly in rings(g) for r in poly)
out=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{PX*2+20}" height="{H}" font-family="Arial"><rect width="100%" height="100%" fill="#ffffff"/><svg x="0" y="0" width="{PX}" height="{H}"><rect width="100%" height="100%" fill="#e8eef5"/>']
# (a) towns filled by shetach, no town strokes, then shetach colours make the borders visible
for f in towns:
    p=f['properties']; g=f['geometry']
    if not g: continue
    pts=[pt for poly in rings(g) for pt in poly[0]]
    cx=sum(x for x,y in pts)/len(pts)
    county=p['STATEFP']+p['COUNTYFP']
    if county in cape: sid='cape-cod-and-the-islands'
    elif cx<cfg['deren']: sid='connecticut'
    else: sid=lab.get(key(p['NAME'])) or (cfg['westOfSplit'] if cx<cfg['split'] else cfg['eastOfSplit'])
    out.append(f'<path d="{path(g)}" fill="{COL[sid]}" stroke="{COL[sid]}" stroke-width="0.8"/>')
out.append(f'<text x="10" y="24" font-size="20" font-weight="bold">old: town lines</text>')
houses=[]
for f in json.load(open(f'{R}/web/data/centers.geojson'))['features']:
    p=f['properties']
    if p['region']=='US-MA': houses.append(f['geometry']['coordinates'])
for x,y in houses: out.append(f'<circle cx="{X(x):.1f}" cy="{Y(y):.1f}" r="3.5" fill="#222" stroke="#fff" stroke-width="1"/>')
out.append(f'</svg><svg x="{PX+20}" y="0" width="{PX}" height="{H}"><rect width="100%" height="100%" fill="#e8eef5"/>')
# (b) current shapes
for sid,fn in (('central-massachusetts','ma-central'),('eastern-massachusetts','ma-eastern'),('south-area','ma-south-area'),('merrimack-valley','ma-merrimack-valley')):
    g=json.load(open(f'{R}/data/shapes/{fn}.geojson'))
    for f in g['features']: out.append(f'<path d="{path(f["geometry"])}" fill="{COL[sid]}" stroke="#333" stroke-width="1.2"/>')
for f in towns:
    p=f['properties']
    if key(p['NAME']) in [key(t) for t in cfg['towns']['north-shore-of-massachusetts']]:
        out.append(f'<path d="{path(f["geometry"])}" fill="{COL["north-shore-of-massachusetts"]}" stroke="none"/>')
out.append(f'<text x="10" y="24" font-size="20" font-weight="bold">new: town lines + straight cuts</text>')
for x,y in houses: out.append(f'<circle cx="{X(x):.1f}" cy="{Y(y):.1f}" r="3.5" fill="#222" stroke="#fff" stroke-width="1"/>')
out.append('</svg>')
out.append('</svg>')
open(sys.argv[1],'w').write('\n'.join(out))
