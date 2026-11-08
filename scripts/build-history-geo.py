#!/usr/bin/env python3
"""Builds web/data/history-geo.json, the shapes of web/history.html (the shetachim of the US and Canada by year).

It takes the US and Canadian pieces of web/data/geo.json as they are, cuts out the pieces that only the history needs
(data/shetach-history.json's extraAreas: South Jersey out of New Jersey by its seven counties, Southeast Ohio out of
the Northeast Ohio piece south of a straight line), and adds the land around them that no US or Canadian shetach covers
(the rest of Canada, Greenland, Mexico, Central America and the Caribbean), so every border is shared point for point;
the provinces' unclaimed north is cut by province into pieces of its own ('north': true), for the page's whole-provinces switch.
Run from the repository root:  python3 -I scripts/build-history-geo.py   (needs shapely, and mapshaper from npm)
"""
import json, os, subprocess, sys, tempfile
from shapely.geometry import shape, mapping, box, Polygon, MultiPolygon
from shapely.ops import unary_union

ROOT = os.getcwd()
GEO = os.path.join(ROOT, 'web/data/geo.json')
OUTSIDE = os.path.join(ROOT, 'web/data/outside.json')
HIST = os.path.join(ROOT, 'data/shetach-history.json')
COUNTIES = os.path.join(ROOT, '.cache/county.json')
CA_PROVINCES = os.path.join(ROOT, '.cache/gadm36_CAN_1.json')
NORTH = {'Ontario': 'CA-ON', 'Québec': 'CA-QC', 'Manitoba': 'CA-MB', 'Saskatchewan': 'CA-SK', 'British Columbia': 'CA-BC', 'Alberta': 'CA-AB', 'Newfoundland and Labrador': 'CA-NL'}
OUT = os.path.join(ROOT, 'web/data/history-geo.json')
NEAR = {'MEX', 'GTM', 'BLZ', 'HND', 'SLV', 'NIC', 'CRI', 'PAN', 'CUB', 'BHS', 'JAM', 'HTI', 'DOM', 'PRI', 'TCA', 'CYM', 'BMU'}
OHIO_CUT = 40.45  # Southeast Ohio: the Northeast Ohio piece south of this latitude (Athens, Marietta, Steubenville)


def arcs_of(t):
    tr = t.get('transform')
    out = []
    for arc in t['arcs']:
        if tr:
            (kx, ky), (dx, dy) = tr['scale'], tr['translate']
            x = y = 0
            pts = []
            for p in arc:
                x += p[0]; y += p[1]
                pts.append((round(x * kx + dx, 6), round(y * ky + dy, 6)))
            out.append(pts)
        else:
            out.append([tuple(p) for p in arc])
    for i, ring in (t.get('exactArcs') or {}).items():
        out[int(i)] = [tuple(p) for p in ring]
    return out


def geom_of(g, arcs):
    def ring(ids):
        pts = []
        for i in ids:
            a = arcs[i] if i >= 0 else arcs[~i][::-1]
            pts.extend(a if not pts else a[1:])
        return pts
    def poly(rings):
        rs = [ring(r) for r in rings]
        rs = [r for r in rs if len(r) >= 4]
        return Polygon(rs[0], rs[1:]) if rs else None
    if g['type'] == 'Polygon':
        p = poly(g['arcs'])
        return p
    if g['type'] == 'MultiPolygon':
        ps = [poly(p) for p in g['arcs']]
        return MultiPolygon([p for p in ps if p is not None and not p.is_empty])
    return None


def polys(g):
    if g.is_empty:
        return []
    if g.geom_type == 'Polygon':
        return [g]
    if g.geom_type in ('MultiPolygon', 'GeometryCollection'):
        return [p for x in g.geoms for p in polys(x)]
    return []


def multi(ps):
    ps = [p for p in ps if p.area > 1e-9]
    return ps[0] if len(ps) == 1 else MultiPolygon(ps)


def main():
    topo = json.load(open(GEO))
    arcs = arcs_of(topo)
    hist = json.load(open(HIST))
    areas, near = [], []
    for g in topo['objects']['areas']['geometries']:
        p = g['properties']
        geom = geom_of(g, arcs)
        if geom is None or geom.is_empty:
            continue
        if p['country'] in ('US', 'CA'):
            areas.append([{k: p[k] for k in ('id', 'state', 'name', 'abbr', 'country', 'shetach')}, geom])
        elif p['country'] in NEAR:
            near.append(geom)

    # Southeast Ohio out of the Northeast Ohio piece
    ne = next(a for a in areas if a[0]['id'] == 'US-OH:northeast-ohio')
    tail = ne[1].intersection(box(-85, 37, -79, OHIO_CUT))
    core = ne[1].difference(box(-85, 37, -79, OHIO_CUT))
    ne[1] = multi(polys(core))
    areas.append([dict(ne[0], id='US-OH:southeast-ohio', part='Southeast Ohio'), multi(polys(tail))])

    # South Jersey out of New Jersey: the piece less New Jersey's other counties, its southern part
    sj_counties = set(hist['extraAreas']['US-NJ:south-jersey']['counties'])
    cf = json.load(open(COUNTIES))['features']
    north = unary_union([shape(f['geometry']) for f in cf if f['properties']['STATEFP'] == '34' and f['properties']['GEOID'] not in sj_counties])
    nj = next(a for a in areas if a[0]['id'] == 'US-NJ:new-jersey')
    rest = nj[1].difference(north)
    sj = [p for p in polys(rest) if p.representative_point().y < 40.15 and p.area > 1e-6]
    sj = unary_union(sj)
    nj[1] = multi(polys(nj[1].difference(sj)))
    areas.append([dict(nj[0], id='US-NJ:south-jersey', part='South Jersey'), multi(polys(sj))])

    # the land around: the rest of Canada, Greenland, Saint Pierre and Miquelon (outside.json), Mexico and its neighbours.
    # The provinces' own unclaimed north (the main map leaves it off) is cut out of the rest of Canada by province, as a
    # piece of its own ('north'), so the page can show the provinces whole (its switch) or not
    out = json.load(open(OUTSIDE))
    oarcs = arcs_of(out)
    provinces = {f['properties']['NAME_1']: shape(f['geometry']).buffer(0) for f in json.load(open(CA_PROVINCES))['features']}
    for g in out['objects'][list(out['objects'])[0]]['geometries']:
        c = g['properties'].get('country')
        gg = geom_of(g, oarcs)
        if gg is None or gg.is_empty:
            continue
        if c == 'CA':
            gg = gg.buffer(0)
            taken = []
            for name, st in NORTH.items():
                part = multi([p for p in polys(gg.intersection(provinces[name])) if p.area > 1e-4])
                if part.is_empty or part.area < 1e-3:
                    continue
                areas.append([{'id': f'{st}:north', 'state': st, 'name': name, 'abbr': st[3:], 'country': 'CA', 'shetach': '', 'north': True}, part])
                taken.append(part)
            rest = gg.difference(unary_union(taken)) if taken else gg
            ps = [p for p in polys(rest) if p.area > 1e-4]
            if ps:
                near.append(multi(ps))
        elif c in ('GRL', 'SPM'):
            near.append(gg)

    tmp = tempfile.mkdtemp()
    fa, fo = os.path.join(tmp, 'areas.json'), os.path.join(tmp, 'outside.json')
    json.dump({'type': 'FeatureCollection', 'features': [{'type': 'Feature', 'properties': p, 'geometry': mapping(g)} for p, g in areas]}, open(fa, 'w'))
    json.dump({'type': 'FeatureCollection', 'features': [{'type': 'Feature', 'properties': {}, 'geometry': mapping(g)} for g in near]}, open(fo, 'w'))
    ms = os.path.join(ROOT, 'node_modules/.bin/mapshaper')
    subprocess.run([ms, '-i', fa, fo, 'combine-files', '-o', OUT, 'format=topojson', 'quantization=1000000'], check=True)
    t = json.load(open(OUT))
    print(OUT, os.path.getsize(OUT), 'bytes;', {k: len(v.get('geometries', [])) for k, v in t['objects'].items()})


if __name__ == '__main__':
    main()
