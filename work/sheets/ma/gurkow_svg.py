# Gurkow's South Area: its towns by what's known of his activity there, the houses round it, a legend. For the owner.
import json, math
R='/home/user/shetachim'; S='/tmp/claude-0/-home-user-shetachim/6dfe7d99-9185-570e-b237-1d68bcc4daf7/scratchpad'
towns=json.load(open(f'{R}/.cache/county-subdivision-25.json'))['features']
W,So,E,N=-71.30,41.93,-70.90,42.30
PX=1100; c=math.cos(math.radians((So+N)/2)); sc=PX/((E-W)*c); H=int((N-So)*sc)
X=lambda x:(x-W)*c*sc; Y=lambda y:(N-y)*sc
def rings(g): return [g['coordinates']] if g['type']=='Polygon' else g['coordinates']
def path(g): return ''.join('M'+'L'.join(f'{X(x):.1f},{Y(y):.1f}' for x,y in r)+'Z' for poly in rings(g) for r in poly)
def nm(f): return f['properties']['NAME'].replace(' town','').replace(' Town','')
OWN={'Stoughton','Easton','Braintree'}          # his own public events
SHLUCHIM={'Brockton','Randolph'}                # his new shluchim's area (the Gordons)
NONE={'Avon','Holbrook'}                        # in the shetach, no activity found
SERVED={'Canton','Sharon'}                      # "areas served" on GuideStar, but with houses of their own (Prus's)
COL={'own':'#d7301f','sh':'#fc8d59','none':'#fdd49e'}
LH=230
out=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{PX}" height="{H+LH}" font-family="Arial"><rect width="100%" height="100%" fill="#eef3f8"/>']
labels=[]
for f in towns:
    g=f['geometry']; n=nm(f)
    if not g: continue
    pts=[p for poly in rings(g) for p in poly[0]]
    if not any(W-0.05<x<E+0.05 and So-0.05<y<N+0.05 for x,y in pts): continue
    fill='#ffffff'; stroke='#9aa5b1'; sw=1
    if n in OWN: fill=COL['own']
    elif n in SHLUCHIM: fill=COL['sh']
    elif n in NONE: fill=COL['none']
    out.append(f'<path d="{path(g)}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>')
    if n in SERVED: out.append(f'<path d="{path(g)}" fill="url(#hatch)" stroke="#2b6cb0" stroke-width="2.5" stroke-dasharray="7 5"/>')
    cx=sum(x for x,y in pts)/len(pts); cy=sum(y for x,y in pts)/len(pts)
    if W<cx<E and So<cy<N:
        bold = n in OWN|SHLUCHIM|NONE|SERVED
        labels.append(f'<text x="{X(cx):.0f}" y="{Y(cy):.0f}" font-size="{17 if bold else 13}" font-weight="{"bold" if bold else "normal"}" fill="{"#111" if bold else "#667"}" text-anchor="middle" stroke="#fff" stroke-width="3" paint-order="stroke">{n}</text>')
out.insert(1,'<defs><pattern id="hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="10" stroke="#2b6cb0" stroke-width="2.5" opacity="0.45"/></pattern></defs>')
# the shetach's outline, as the map has it
for f in json.load(open(f'{R}/data/shapes/ma-south-area.geojson'))['features']:
    out.append(f'<path d="{path(f["geometry"])}" fill="none" stroke="#7a0b0b" stroke-width="4"/>')
out+=labels
# houses round about (from the map), the shetach's capital as a star
caps={'117632'}
for f in json.load(open(f'{R}/web/data/centers.geojson'))['features']:
    p=f['properties']; x,y=f['geometry']['coordinates']
    if p['region']!='US-MA' or not (W<x<E and So<y<N): continue
    ids={c['id'] for c in p['centers']}; sh=(p.get('piece') or '').split(':')[-1]
    name=p['centers'][0]['name']
    if ids & caps:
        out.append(f'<text x="{X(x):.0f}" y="{Y(y)+9:.0f}" font-size="30" text-anchor="middle" fill="#111" stroke="#fff" stroke-width="2" paint-order="stroke">★</text>')
        out.append(f'<text x="{X(x)+18:.0f}" y="{Y(y)-12:.0f}" font-size="14" font-weight="bold" fill="#111" stroke="#fff" stroke-width="3" paint-order="stroke">Shaloh House (Gurkow)</text>')
    else:
        col={'eastern-massachusetts':'#1f4e9c','central-massachusetts':'#a06a00','south-area':'#7a0b0b'}.get(sh,'#333')
        out.append(f'<circle cx="{X(x):.1f}" cy="{Y(y):.1f}" r="7" fill="{col}" stroke="#fff" stroke-width="2"/>')
        city=p['centers'][0].get('city') or ''
        short='' if 'Friendship' in name else {'Sharon':'Sharon (Wolosow)','Canton':'Canton (Horowitz)','Mansfield':'Mansfield (Fogelman)','Needham':'Needham (Prus)','Quincy':'Quincy (YJP of the South Shore)'}.get(city, name[:28])
        if short: out.append(f'<text x="{X(x)+11:.0f}" y="{Y(y)+5:.0f}" font-size="13" fill="{col}" stroke="#fff" stroke-width="3" paint-order="stroke">{short}</text>')
# his own events, marked where they were
for (lon,lat,txt) in [(-71.0253,42.2187,'Menorah lighting, South Shore Plaza (2021)'),(-71.1021,42.1251,'Public celebrations (his own column)'),(-71.1076,42.0677,'Public celebrations (his own column)')]:
    out.append(f'<text x="{X(lon):.0f}" y="{Y(lat)+8:.0f}" font-size="24" text-anchor="middle">🕎</text>')
    out.append(f'<text x="{X(lon):.0f}" y="{Y(lat)-18:.0f}" font-size="12.5" font-weight="bold" fill="#5a0000" text-anchor="middle" stroke="#fff" stroke-width="3" paint-order="stroke">{txt}</text>')
# legend
y0=H+18
L=[(COL['own'],'His own public events: Stoughton, Easton, Braintree (his ChabadInfo column, 2019; Patriot Ledger, 2021)'),
   (COL['sh'],'Served by his new shluchim, the Gordons: "Stoughton and the South Area, including Brockton and Randolph" (Anash, 2026)'),
   (COL['none'],'In the shetach, but no activity found: Avon, Holbrook (included so it is one piece)')]
out.append(f'<rect x="0" y="{H}" width="{PX}" height="{LH}" fill="#ffffff"/>')
for i,(col,t) in enumerate(L):
    out.append(f'<rect x="16" y="{y0+i*34}" width="30" height="22" fill="{col}" stroke="#666"/><text x="56" y="{y0+i*34+16}" font-size="15" fill="#111">{t}</text>')
i=len(L)
out.append(f'<rect x="16" y="{y0+i*34}" width="30" height="22" fill="url(#hatch)" stroke="#2b6cb0" stroke-width="2.5" stroke-dasharray="7 5"/><text x="56" y="{y0+i*34+16}" font-size="15" fill="#111">Listed as "areas served" on his GuideStar, but each has its own Chabad house (on Prus\'s side): Canton, Sharon</text>')
i+=1
out.append(f'<line x1="16" y1="{y0+i*34+11}" x2="46" y2="{y0+i*34+11}" stroke="#7a0b0b" stroke-width="4"/><text x="56" y="{y0+i*34+16}" font-size="15" fill="#111">The South Area as drawn on the map now</text>')
out.append(f'<text x="16" y="34" font-size="22" font-weight="bold" fill="#111">Rabbi Mendel Gurkow — where his activity is on record</text>')
out.append('</svg>')
open(f'{S}/gurkow.svg','w').write('\n'.join(out))
