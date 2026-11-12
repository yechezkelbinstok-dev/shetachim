#!/usr/bin/env python3
"""Builds web/data/growth.json, the data of web/growth.html (the growth of Chabad in the US and Canada, year by year).

Every blue dot of the main map in the US and Canada (web/data/centers.geojson) with a founding year in
data/founding-years.json: the dot appears in the earliest year of its listings. Left out, as in the founding-years
counts (work/founding-years/progress.py): mushrooms, mikvahs, the Crown Heights listings not researched, and the dots
with no year yet (owner, Nov 12: "the 16 don't show up for now at all").
Run from the repository root:  python3 -I scripts/build-growth.py
"""
import json, os, re, sys

ROOT = os.getcwd()
CENTERS = os.path.join(ROOT, 'web/data/centers.geojson')
YEARS = os.path.join(ROOT, 'data/founding-years.json')
OUT = os.path.join(ROOT, 'web/data/growth.json')
CONF = {'high': 'h', 'medium': 'm', 'low': 'l'}


MONTHS = {m: i + 1 for i, m in enumerate(['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'])}


def iso_date(s):
    """A founding date as 'YYYY-MM' or 'YYYY-MM-DD' for the page's Hebrew years. Most are already; a few are written out
    ('Aug 2007', '10 May 1972', 'Sept 2008 (Elul 5768)'): those with a month are read, the vaguer ones ('end of 2016') left
    out, so the year alone counts."""
    s = str(s or '').strip()
    if re.match(r'^\d{4}(-\d{2}){0,2}$', s):
        return s if len(s) > 4 else ''
    m = re.match(r'^(?:(\d{1,2})\s+)?([A-Za-z]{3,9})\.?\s+(\d{4})\b', s)
    if m and m.group(2)[:3].lower() in MONTHS:
        mo = MONTHS[m.group(2)[:3].lower()]
        return f'{m.group(3)}-{mo:02d}' + (f'-{int(m.group(1)):02d}' if m.group(1) else '')
    return ''


def people(c):
    """Its personnel as the main map has them (chabad.org's listing): [title, first name, last name, position, flags], flags
    'd' director, 'x' deceased, 'h' HY"D (owner, Nov 12: "WHY ISNT THERE PERSONELL WHERE AVAILABLE")."""
    out = []
    for q in c.get('personnel') or []:
        flags = ('d' if q.get('isDirector') else '') + ('x' if q.get('isDeceased') else '') + ('h' if q.get('hyd') else '')
        out.append([q.get('title') or '', q.get('firstName') or '', q.get('lastName') or '', q.get('position') or '', flags])
    return out


def is_mikvah(c):
    return (c.get('type') or '').lower().startswith('mik') or 'mikv' in (c.get('name') or '').lower()


def main():
    geo = json.load(open(CENTERS, encoding='utf-8'))
    fy = json.load(open(YEARS, encoding='utf-8'))['centers']
    listings, dots, first, hidden = [], [], {}, 0
    for f in geo['features']:
        p = f['properties']
        if p.get('country') not in ('US', 'CA'):
            continue
        piece = (p.get('piece') or ':none').split(':')[-1]
        cs = [c for c in p.get('centers') or [] if not c.get('mushroom') and not is_mikvah(c)
              and not (piece == 'crown-heights' and str(c['id']) not in fy)]
        if not cs:
            continue
        rows = []
        for c in cs:
            e = fy.get(str(c['id'])) or {}
            y = e.get('year')
            rows.append((y if y else 9999, str(c['id']), c, e))
        rows.sort(key=lambda r: (r[0], r[2].get('name') or ''))
        if rows[0][0] == 9999:
            hidden += 1
            continue
        year, _, _, e0 = rows[0]
        idx = []
        for y, cid, c, e in rows:
            idx.append(len(listings))
            # (no sources on the page: owner, Nov 12, "absolutely not a link to the data source")
            listings.append([cid, c.get('name') or '', c.get('type') or '', c.get('city') or '',
                             e.get('year') or None, CONF.get(e.get('confidence'), ''), iso_date(e.get('date')), people(c),
                             # (who founded or ran it, as the founding sources name them: work/founding-years/add_people.py)
                             [[q.get('name') or '', q.get('role') or '', str(q.get('from') or ''), str(q.get('seen') or '')] for q in e.get('people') or []]])
        lon, lat = f['geometry']['coordinates'][:2]
        region = p.get('region') or ''
        # (its date where one is known, 'YYYY-MM' or 'YYYY-MM-DD': the page counts it in the Hebrew year it fell in)
        dots.append([round(lon, 4), round(lat, 4), year, CONF.get(e0.get('confidence'), ''), region, piece, idx, iso_date(e0.get('date')),
                     p.get('piece') or ''])
        if region and (region not in first or year < first[region]):
            first[region] = year
    dots.sort(key=lambda d: (d[2], d[1]))
    out = {'about': 'Built by scripts/build-growth.py from web/data/centers.geojson and data/founding-years.json.',
           'dots': dots, 'listings': listings, 'first': dict(sorted(first.items(), key=lambda kv: (kv[1], kv[0])))}
    with open(OUT, 'w', encoding='utf-8') as fh:
        json.dump(out, fh, ensure_ascii=False, separators=(',', ':'))
    print(f'{len(dots)} dots, {len(listings)} listings, {len(first)} states and provinces; {hidden} dots with no year left out; '
          f'years {dots[0][2]}-{max(d[2] for d in dots)}; {os.path.getsize(OUT) // 1024} KB', file=sys.stderr)


if __name__ == '__main__':
    main()
