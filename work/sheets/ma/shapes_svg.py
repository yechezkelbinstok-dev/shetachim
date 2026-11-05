# Preview: the generated Massachusetts shapes, filled by shetach, with town lines faint and houses as dots.
import json, math, sys
S='/tmp/claude-0/-home-user-shetachim/6dfe7d99-9185-570e-b237-1d68bcc4daf7/scratchpad/ma'
R='/home/user/shetachim'
W,E,So,N=[float(x) for x in sys.argv[1].split(',')]
PX=2000; kx=PX/(E-W); ky=kx/math.cos(math.radians((N+So)/2)); H=int((N-So)*ky)
X=lambda x:(x-W)*kx; Y=lambda y:(N-y)*ky
COL={'ma-central':'#f6d28b','ma-eastern':'#a9cdf0','ma-south-area':'#f2a0a0','ma-merrimack-valley':'#8fd3c8'}
import re
NS=set(re.sub(r'[^a-z]','',re.sub(r' town$','',t.lower())) for t in json.load(open(R+'/data/shapes/ma-towns.json'))['towns']['north-shore-of-massachusetts'])
def rings(g): return [g['coordinates']] if g['type']=='Polygon' else g['coordinates']
def path(g):
    d=''
    for poly in rings(g):
        for r in poly: d+='M'+'L'.join(f'{X(x):.1f},{Y(y):.1f}' for x,y in r)+'Z'
    return d
out=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{PX}" height="{H}" font-family="Arial"><rect width="{PX}" height="{H}" fill="#eef4f8"/>']
state=json.load(open(f'{S}/cousub-25.json'))['features']
# clip shapes visually to MA by drawing towns as a clipPath
out.append('<clipPath id="ma">'+''.join(f'<path d="{path(f["geometry"])}"/>' for f in state)+'</clipPath>')
out.append('<g clip-path="url(#ma)">')
for name,col in COL.items():
    g=json.load(open(f'{R}/data/shapes/{name}.geojson'))['features'][0]['geometry']
    out.append(f'<path d="{path(g)}" fill="{col}" stroke="#333" stroke-width="2"/>')
for f in state:
    if re.sub(r'[^a-z]','',re.sub(r' town$','',f['properties']['NAME'].lower())) in NS: out.append(f'<path d="{path(f["geometry"])}" fill="#b9e3a8" stroke="#333" stroke-width="2"/>')
out.append('</g>')
for f in state: out.append(f'<path d="{path(f["geometry"])}" fill="none" stroke="#000" stroke-opacity="0.15" stroke-width="0.6"/>')
cs=json.load(open(f'{R}/web/data/centers.geojson'))['features']
for f in cs:
    p=f['properties']
    if p.get('region')!='US-MA': continue
    x,y=f['geometry']['coordinates']
    if W<=x<=E and So<=y<=N: out.append(f'<circle cx="{X(x):.1f}" cy="{Y(y):.1f}" r="5" fill="#123" stroke="#fff" stroke-width="1.5"/>')
out.append('</svg>')
open(sys.argv[2],'w').write('\n'.join(out))
