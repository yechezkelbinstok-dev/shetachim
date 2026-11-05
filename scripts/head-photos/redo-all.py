#!/usr/bin/env python3
"""Redo every head-shliach photo and vaad face from its source, the same way each was made (its paint-out, its tile,
its crop, its cast, --keep), with the current retouch.py, into <outdir>; then before/after sheets to check every one
(owner, Nov 5: "proper editing, like lighting, coloring ... Crops also ... Just everything overall").

  python3 scripts/head-photos/redo-all.py <outdir> [--only id,id,...] [--heads | --vaad]

Sources, in order: the candidates kept in work/ (by the URL in their sources.txt, else by the file name in the URL),
an Instagram photo by its post code and photo number (work/head-photos/instagram/images/<code>_<n-1>.jpg), else the
image downloaded again. Writes <outdir>/heads/<id>.jpg (320 px), <outdir>/vaad/<file name>.jpg (320 px) and
<outdir>/sheets/*.jpg (now | redone, side by side). Copy the ones that are better into web/img/ (vaad at 160 px).
Needs the venv of retouch.py (opencv-python-headless<5, numpy, pillow): run this with that python.
"""
import argparse, glob, json, os, re, shlex, subprocess, sys, urllib.parse
from PIL import Image, ImageDraw

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
HERE = os.path.dirname(os.path.abspath(__file__))
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'


def base(url):
    return os.path.basename(urllib.parse.urlparse(url).path).lower()


def index_sources():
    """every kept candidate: by its URL and by the file name in its URL"""
    by_url, by_base = {}, {}
    for st in glob.glob(os.path.join(ROOT, 'work', 'head-photos', '**', 'sources.txt'), recursive=True):
        d = os.path.dirname(st)
        for line in open(st, encoding='utf-8'):
            m = re.match(r'(\d+)\s+(\S+)', line.strip())
            if not m: continue
            n, url = m.groups(); fs = sorted(glob.glob(os.path.join(d, f'c{n}.*')))
            if fs:
                by_url.setdefault(url, []).append(fs[0]); by_base.setdefault(base(url), []).append(fs[0])
    # the vaad sources the earlier sessions kept without a sources.txt: named after the image (ref-<chabad image id>)
    for f in glob.glob(os.path.join(ROOT, 'work', 'head-photos', 'vaad', '*.*')) + glob.glob(os.path.join(ROOT, 'work', 'head-photos', 'vaad', 'nov5-later', 'edits', '*.*')):
        b = os.path.basename(f).lower(); by_base.setdefault(re.sub(r'^ref-', '', b), []).append(f)
    return by_url, by_base


def looks(path, crop=None, tile=None, n=48):
    """a small grey thumbnail of the photo (at its crop) for comparing two pictures of the same thing"""
    import numpy as np
    im = Image.open(path).convert('L')
    if tile: im = im.crop(tuple(tile))
    if crop:
        W, H = im.size; s = crop['side'] * H
        x = min(max(crop['cx'] * W - s / 2, 0), W - s); y = min(max(crop['cy'] * H - s / 2, 0), H - s)
        im = im.crop((int(x), int(y), int(x + s), int(y + s)))
    a = np.asarray(im.resize((n, n), Image.BILINEAR), dtype=np.float32); a -= a.mean(); return a / (np.linalg.norm(a) + 1e-6)


def best_match(entry, cands, now):
    """of the candidates, the one whose crop looks most like the photo now on the site (a downloader's numbering can
    point a source list at the wrong file: Upstate New York, Nov 5)"""
    import numpy as np
    if not os.path.exists(now) or not cands: return (cands or [None])[0], None
    ref = looks(now); best = (None, -2.0)
    for f in dict.fromkeys(cands):
        try:
            sc = float((looks(f, entry['crop'], entry.get('tile')) * ref).sum())
        except Exception:
            continue
        if sc > best[1]: best = (f, sc)
    return best


def resolve(entry, by_url, by_base, cache):
    url, page, note = entry.get('image', ''), entry.get('page', ''), entry.get('note', '') + ' ' + entry.get('image', '')
    if url in by_url: return by_url[url][-1]
    b = base(url)
    if b and b in by_base: return by_base[b][-1]
    stem = os.path.splitext(b)[0]
    for k, fs in by_base.items():   # (the kept copy may be a JPEG of a PNG or WebP)
        if stem and os.path.splitext(k)[0] == stem: return fs[-1]
    m = re.search(r'instagram\.com/([\w.]+)/?$', page)   # an Instagram profile picture, kept as <surname>-pp.jpg
    if m and not url.startswith('http'):
        sur = entry.get('name', '').split()[-1].lower() if entry.get('name') else ''
        f = os.path.join(ROOT, 'work', 'head-photos', 'vaad', f'{sur}-pp.jpg')
        if os.path.exists(f): return f
    m = re.search(r'instagram\.com/p/([^/]+)/', page)
    if m:
        n = re.search(r'photo (\d+)', note)
        f = os.path.join(ROOT, 'work', 'head-photos', 'instagram', 'images', f'{m.group(1)}_{int(n.group(1)) - 1 if n else 0}.jpg')
        if os.path.exists(f): return f
    if url.startswith('http'):
        os.makedirs(cache, exist_ok=True)
        f = os.path.join(cache, re.sub(r'[^\w.-]', '_', b or 'img')[:80] or 'img')
        if not os.path.exists(f):
            subprocess.run(['curl', '-sS', '-L', '-A', UA, '--max-time', '40', '-o', f, url], check=False)
        try:
            Image.open(f).verify(); return f
        except Exception:
            return None
    return None


def run(args):
    r = subprocess.run([sys.executable] + args, capture_output=True, text=True)
    return (r.stdout + r.stderr).strip().splitlines()[-1:] or ['']


def redo(entry, src, out, tmp):
    """the entry's paint-out, tile and crop, then retouch.py"""
    os.makedirs(tmp, exist_ok=True)
    key = re.sub(r'[^\w-]', '_', os.path.splitext(os.path.basename(out))[0])
    edit = entry.get('edit')
    if edit:
        ea = shlex.split(edit) if isinstance(edit, str) else sum(([f'--{k}', v] if not isinstance(v, list) else sum(([f'--{k}', x] for x in v), []) for k, v in edit.items()), [])
        cleaned = os.path.join(tmp, key + '-clean.png')
        run([os.path.join(HERE, 'paint-out.py'), src, cleaned] + [str(x) for x in ea]); src = cleaned
    if entry.get('tile'):
        x0, y0, x1, y1 = entry['tile']; t = os.path.join(tmp, key + '-tile.png')
        Image.open(src).convert('RGB').crop((x0, y0, x1, y1)).save(t); src = t
    c = entry['crop']; args = [os.path.join(HERE, 'retouch.py'), src, out, '--crop', f"{c['cx']},{c['cy']},{c['side']}"]
    if entry.get('cast'): args += ['--cast', ','.join(str(v) for v in entry['cast'])]
    if entry.get('keep'): args += ['--keep']
    return run(args)[0]


def sheet(pairs, out, T=230):
    """now | redone, one pair per cell, four cells a row"""
    cols = 4; rows = (len(pairs) + cols - 1) // cols
    s = Image.new('RGB', (cols * (2 * T + 26) + 10, rows * (T + 28) + 10), (238, 236, 232)); d = ImageDraw.Draw(s)
    for i, (name, a, b) in enumerate(pairs):
        x = 10 + (i % cols) * (2 * T + 26); y = 10 + (i // cols) * (T + 28)
        d.text((x, y + 2), name, fill=(0, 0, 0))
        for k, f in enumerate((a, b)):
            if f and os.path.exists(f): s.paste(Image.open(f).convert('RGB').resize((T, T), Image.LANCZOS), (x + k * (T + 6), y + 18))
    s.save(out, quality=88)


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('outdir'); ap.add_argument('--only'); ap.add_argument('--heads', action='store_true'); ap.add_argument('--vaad', action='store_true')
    a = ap.parse_args()
    only = set(a.only.split(',')) if a.only else None
    by_url, by_base = index_sources()
    O = os.path.abspath(a.outdir); tmp = os.path.join(O, 'tmp'); cache = os.path.join(O, 'downloads')
    os.makedirs(os.path.join(O, 'sheets'), exist_ok=True)
    jobs = []
    if not a.vaad:
        for p in json.load(open(os.path.join(ROOT, 'data', 'head-photos.json'), encoding='utf-8'))['photos']:
            if only and p['id'] not in only: continue
            jobs.append(('heads', p['id'], p, os.path.join(ROOT, 'web', p['file'])))
    if not a.heads:
        for sid, lst in json.load(open(os.path.join(ROOT, 'data', 'vaad-photos.json'), encoding='utf-8'))['vaads'].items():
            for e in lst:
                n = os.path.splitext(os.path.basename(e['file']))[0]
                if only and n not in only and sid not in only: continue
                jobs.append(('vaad', n, e, os.path.join(ROOT, 'web', e['file'])))
    # the entries as last committed: their crops are the ones the photos on the site were made with, so the source
    # check compares like with like even when a crop was changed since (Louisiana–Mississippi, Nov 5)
    def committed(path):
        r = subprocess.run(['git', '-C', ROOT, 'show', f'HEAD:{path}'], capture_output=True, text=True)
        return json.loads(r.stdout) if r.returncode == 0 else {}
    old_h = {e['id']: e for e in committed('data/head-photos.json').get('photos', [])}
    old_v = {e['file']: e for L in committed('data/vaad-photos.json').get('vaads', {}).values() for e in L}
    pairs = {'heads': [], 'vaad': []}
    for kind, name, e, now in jobs:
        src = resolve(e, by_url, by_base, cache)
        # every candidate that might be it (by URL, by file name, the person's own folders), checked against the photo now
        cands = ([src] if src else []) + by_url.get(e.get('image', ''), []) + by_base.get(base(e.get('image', '')), [])
        if kind == 'heads': cands += sorted(glob.glob(os.path.join(ROOT, 'work', 'head-photos', 'candidates', '*', name, 'c*.*')))
        was = (old_h.get(name) if kind == 'heads' else old_v.get(e['file'])) or e
        pick, score = best_match(was, [c for c in cands if c], now)
        if pick and score is not None:
            if pick != src: print(f'{kind}/{name}: source corrected by comparison ({os.path.relpath(pick, ROOT)}, {score:.2f})')
            if score < 0.6: print(f'{kind}/{name}: WARNING the best source only matches {score:.2f}: check it')
            src = pick
        os.makedirs(os.path.join(O, kind), exist_ok=True); out = os.path.join(O, kind, name + '.jpg')
        if not src:
            print(f'{kind}/{name}: NO SOURCE ({e.get("image", "")[:80]})'); pairs[kind].append((name + ' (no source)', now, None)); continue
        msg = redo(e, src, out, tmp)
        print(f'{kind}/{name}: {os.path.relpath(src, ROOT) if src.startswith(ROOT) else src} -> {msg.split(": ", 1)[-1][:110]}')
        pairs[kind].append((name, now, out))
    for kind, ps in pairs.items():
        for i in range(0, len(ps), 16):
            if ps: sheet(ps[i:i + 16], os.path.join(O, 'sheets', f'{kind}-{i // 16 + 1}.jpg'))


if __name__ == '__main__':
    main()
