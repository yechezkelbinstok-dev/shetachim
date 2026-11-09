#!/usr/bin/env python3
"""Builds web/data/history-geo.json, the shapes of web/history.html (the shetachim of the US and Canada by year).

It takes the US and Canadian pieces of web/data/geo.json as they are, cuts out the pieces that only the history needs
(data/shetach-history.json's extraAreas: South Jersey out of New Jersey by its counties, Southeast Ohio out of the
Northeast Ohio piece south of a straight line), and adds the rest of Canada (the land no Canadian shetach covers), so
every border is shared point for point; the provinces' unclaimed north is cut by province into pieces of its own
('north': true), for the page's whole-provinces switch. Only the US and Canada: no Mexico, Central America, Caribbean or
Greenland (owner, Nov 9).
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


def renode(geoms):
    """The same pieces, cut again from one set of lines: where two of them meet, both edges then have the same points
    (two sources drawing one line with different points leave two edges, which the page would draw as a line)."""
    from shapely.ops import polygonize
    from shapely.prepared import prep
    faces = list(polygonize(unary_union([g.boundary for g in geoms])))
    preps = [prep(g) for g in geoms]
    owned, loose = [[] for _ in geoms], []
    for f in faces:
        pt = f.representative_point()
        k = next((k for k, pg in enumerate(preps) if pg.contains(pt)), None)
        (loose if k is None else owned[k]).append(f)
    # a sliver in none of them (where two sources part a little) goes to the piece it shares the most edge with;
    # a lake or a real gap stays as it is
    for f in loose:
        if f.area > 1e-3:
            continue
        best, bl = None, 0
        for k, g in enumerate(geoms):
            ln = f.boundary.intersection(g.boundary).length
            if ln > bl:
                best, bl = k, ln
        if best is not None:
            owned[best].append(f)
    return [multi(polys(unary_union(fs))) if fs else g for g, fs in zip(geoms, owned)]


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

    # the first years' cities (owner, Nov 9: "for those years before Posner and Mochkin came to just make it the city"):
    # Pittsburgh (the city, out of Western Pennsylvania's piece) and Montreal (its island, out of Quebec's)
    sub = json.load(open(os.path.join(ROOT, '.cache/county-subdivision-42.json')))
    pgh = unary_union([shape(f['geometry']) for f in (sub['features'] if 'features' in sub else sub) if f['properties'].get('GEOID') == '4200361000'])
    wpa = next(a for a in areas if a[0]['id'] == 'US-PA:western-pennsylvania')
    cut = wpa[1].intersection(pgh)
    wpa[1] = multi(polys(wpa[1].difference(cut)))
    areas.append([dict(wpa[0], id='US-PA:pittsburgh', part='Pittsburgh'), multi(polys(cut))])
    mtl = unary_union([shape(f['geometry']) for f in json.load(open(os.path.join(ROOT, '.cache/gadm41_CAN_2.json')))['features']
                       if f['properties']['NAME_2'] == 'Communauté-Urbaine-de-Montréal']).buffer(0)
    qc = next(a for a in areas if a[0]['id'] == 'CA-QC:quebec')
    cut = qc[1].intersection(mtl)
    qc[1] = multi(polys(qc[1].difference(cut)))
    areas.append([dict(qc[0], id='CA-QC:montreal', part='Montreal'), multi(polys(cut))])

    # and Worcester before the Fogelmans (owner, Nov 9: "Also the one in Massachusetts before fogelman came")
    sub = json.load(open(os.path.join(ROOT, '.cache/county-subdivision-25.json')))
    wor = unary_union([shape(f['geometry']) for f in (sub['features'] if 'features' in sub else sub) if f['properties'].get('GEOID') == '2502782000'])
    cm = next(a for a in areas if a[0]['id'] == 'US-MA:central-massachusetts')
    cut = cm[1].intersection(wor)
    cm[1] = multi(polys(cm[1].difference(cut)))
    areas.append([dict(cm[0], id='US-MA:worcester', part='Worcester'), multi(polys(cut))])

    # the rest of Canada (outside.json). The provinces' own unclaimed north (the main map leaves it off) is cut out of it
    # by province, as a piece of its own ('north'), so the page can show the provinces whole (its switch) or not
    out = json.load(open(OUTSIDE))
    oarcs = arcs_of(out)
    rest_ca = None
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
                entry = [{'id': f'{st}:north', 'state': st, 'name': name, 'abbr': st[3:], 'country': 'CA', 'shetach': '', 'north': True}, part]
                areas.append(entry)
                taken.append(entry)
            rest = gg.difference(unary_union([e[1] for e in taken])) if taken else gg
            # where the provinces' lines and this land's edge part a little, thin slivers of it are left along the
            # border (between Alaska and British Columbia's north, the owner's 'broken line', Nov 9): each goes to the
            # province piece it lies against, so no grey sliver (and no line) is left between them
            keep = []
            from shapely.prepared import prep
            touch = [(e, prep(e[1])) for e in taken]
            for p in polys(rest):
                thin = p.area < 0.05 or 2 * p.area / p.length < 0.03
                best, bl = None, 0.0
                if thin:
                    for e, pe in touch:
                        if not pe.intersects(p):
                            continue
                        ln = p.boundary.intersection(e[1].boundary).length
                        if ln > bl:
                            best, bl = e, ln
                if best is not None and bl > 0:
                    best.append(p)
                else:
                    keep.append(p)
            for e in taken:
                if len(e) > 2:
                    e[1] = multi(polys(unary_union([e[1]] + e[2:])))
                    del e[2:]
            rest = unary_union(keep) if keep else rest
            ps = [p for p in polys(rest) if p.area > 1e-4]
            if ps:
                rest_ca = multi(ps)
                near.append(rest_ca)

    # every piece (the US's and Canada's, the history's own cuts, the provinces' north, the rest of Canada) cut from one
    # set of lines, so that where two meet they have the same points: the US-Canada border too (owner, Nov 9, on the
    # Alaska-British Columbia line drawn in pieces inside one shetach: "What's the deal with this British Columbia Alaska
    # border??????")
    k_rest = next(k for k, g in enumerate(near) if g is rest_ca)
    renoded = renode([a[1] for a in areas] + [rest_ca])
    for a, g in zip(areas, renoded[:-1]):
        a[1] = g
    near[k_rest] = renoded[-1]

    tmp = tempfile.mkdtemp()
    fa, fo = os.path.join(tmp, 'areas.json'), os.path.join(tmp, 'outside.json')
    json.dump({'type': 'FeatureCollection', 'features': [{'type': 'Feature', 'properties': p, 'geometry': mapping(g)} for p, g in areas]}, open(fa, 'w'))
    json.dump({'type': 'FeatureCollection', 'features': [{'type': 'Feature', 'properties': {}, 'geometry': mapping(g)} for g in near]}, open(fo, 'w'))
    ms = os.environ.get('MAPSHAPER') or os.path.join(ROOT, 'node_modules/.bin/mapshaper')
    # (light for a phone: islands under 60 km² dropped, lines simplified to about a kilometre; a national map)
    subprocess.run([ms, '-i', fa, fo, 'combine-files', '-filter-islands', 'min-area=60km2', '-simplify', 'interval=1000', 'keep-shapes',
                    '-o', OUT, 'format=topojson', 'quantization=1000000'], check=True)
    t = json.load(open(OUT))
    print(OUT, os.path.getsize(OUT), 'bytes;', {k: len(v.get('geometries', [])) for k, v in t['objects'].items()})


def centers():
    """web/data/history-centers.json: the flagship centers' own listings (name, type, city, chabad.org page), for their
    cards on the page, without its loading all of web/data/centers.geojson."""
    s = json.load(open(os.path.join(ROOT, 'web/data/shetachim.json')))['shetachim']
    hist = json.load(open(HIST))
    ids = {str(c.get('centerId')) for x in s for c in (x.get('capitals') or ([x['capital']] if x.get('capital') else [])) if c and c.get('centerId')}
    ids |= {str(f['centerId']) for fs in hist.get('flagships', {}).values() for f in fs if f.get('centerId')}
    out = {}
    for f in json.load(open(os.path.join(ROOT, 'web/data/centers.geojson')))['features']:
        for c in f['properties']['centers']:
            if str(c.get('id')) in ids:
                out[str(c['id'])] = {k: c.get(k) for k in ('name', 'type', 'city', 'slug') if c.get(k)}
    path = os.path.join(ROOT, 'web/data/history-centers.json')
    json.dump(out, open(path, 'w'), ensure_ascii=False, separators=(',', ':'))
    print(path, len(out), 'centers')


if __name__ == '__main__':
    main()
    centers()
