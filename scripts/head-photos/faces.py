# faces.py <res.json> [key...]: for each 'P:<id>' job in an ig_batch result, download every image of every post,
# find the faces big enough to make a head photo, and save a contact sheet of them per shetach:
#   ig/faces/<id>/sheet.jpg (numbered face crops, biggest first) and ig/faces/<id>/index.json
# A post whose caption names the head shliach is marked with a star.
import json, os, re, sys, subprocess
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont
S = os.environ.get('WORK', '/tmp/head-photos')
R = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))  # the repo
IMG = f'{S}/ig/img'; os.makedirs(IMG, exist_ok=True)
heads = {s['id']: s.get('headShliach') or '' for s in json.load(open(f'{R}/data/shetachim.json'))['shetachim']}
hc = cv2.data.haarcascades
cascade = cv2.CascadeClassifier(hc + 'haarcascade_frontalface_default.xml')
cascade2 = cv2.CascadeClassifier(hc + 'haarcascade_frontalface_alt2.xml')
eyes1 = cv2.CascadeClassifier(hc + 'haarcascade_eye_tree_eyeglasses.xml')
eyes2 = cv2.CascadeClassifier(hc + 'haarcascade_eye.xml')

def has_eyes(g, fx, fy, fw, fh):
    top = g[fy:fy + int(fh * 0.6), fx:fx + fw]
    for e in (eyes1, eyes2):
        if len(e.detectMultiScale(top, scaleFactor=1.05, minNeighbors=3, minSize=(max(int(fw * 0.1), 6),) * 2, maxSize=(int(fw * 0.45),) * 2)): return True
    return False

def urls_of(x):
    u = []
    if x.get('displayUrl'): u.append(x['displayUrl'])
    u += [v for v in (x.get('images') or []) if v not in u]
    for c in x.get('childPosts') or []:
        if c.get('displayUrl') and c['displayUrl'] not in u: u.append(c['displayUrl'])
    return u

from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor
def _get(fu):
    f, u = fu
    if not os.path.exists(f):
        subprocess.run(['curl', '-sS', '-L', '--max-time', '60', '-A', 'Mozilla/5.0', '-o', f, u], check=False)
def download(sc, urls):
    pairs = [(f'{IMG}/{sc}_{n}.jpg', u) for n, u in enumerate(urls)]
    with ThreadPoolExecutor(8) as ex: list(ex.map(_get, pairs))
    return [f for f, _ in pairs if os.path.exists(f) and os.path.getsize(f) > 2000]

def faces_in(path):
    im = cv2.imread(path)
    if im is None: return [], None
    H, W = im.shape[:2]
    k = min(1.0, 1000 / max(W, H))                 # detect on a copy at most 1000px across, report in full size
    sm = cv2.resize(im, (int(W * k), int(H * k)), interpolation=cv2.INTER_AREA) if k < 1 else im
    g = cv2.equalizeHist(cv2.cvtColor(sm, cv2.COLOR_BGR2GRAY))
    m = min(g.shape[:2]); mn = max(int(56 * k), int(m * 0.07))
    found = []
    for c in (cascade, cascade2):
        for (fx, fy, fw, fh) in c.detectMultiScale(g, scaleFactor=1.08, minNeighbors=6, minSize=(mn, mn)):
            if any(abs(fx * 1.0 / k - a) < fw / k * 0.5 and abs(fy / k - b) < fh / k * 0.5 for a, b, *_ in found): continue
            if has_eyes(g, fx, fy, fw, fh): found.append((int(fx / k), int(fy / k), int(fw / k), int(fh / k)))
    return found, (W, H)

def main():
    res = json.load(open(sys.argv[1])); only = sys.argv[2:]
    keys = [k for k in res if k.startswith('P:') and (not only or k[2:] in only)]
    with ProcessPoolExecutor(4) as ex:
        for line in ex.map(one, [(k, res[k]) for k in keys]): print(line, flush=True)

def one(kv):
    key, v = kv
    font = ImageFont.load_default(size=13)
    if True:
        sid = key[2:]
        surname = (heads.get(sid) or '').split()[-1] if heads.get(sid) else ''
        out = f'{S}/ig/faces/{sid}'; os.makedirs(out, exist_ok=True)
        idx = []
        for x in v.get('items') or []:
            sc = x.get('shortCode')
            if not sc: continue
            cap = x.get('caption') or ''
            star = bool(surname and re.search(surname, cap, re.I))
            for f in download(sc, urls_of(x)):
                fs, wh = faces_in(f)
                if not fs: continue
                im = Image.open(f).convert('RGB')
                for k, (fx, fy, fw, fh) in enumerate(fs):
                    side = int(fw * 2.6); cx, cy = fx + fw / 2, fy + fh / 2 + fw * 0.2
                    box = (int(cx - side / 2), int(cy - side / 2), int(cx + side / 2), int(cy + side / 2))
                    name = f'{os.path.basename(f)[:-4]}_{k}.jpg'
                    im.crop(box).resize((150, 150), Image.LANCZOS).save(f'{out}/{name}', quality=85)
                    idx.append({'crop': name, 'src': f, 'sc': sc, 'time': (x.get('timestamp') or '')[:10], 'fw': fw, 'W': wh[0], 'H': wh[1],
                                'star': star, 'face': [fx, fy, fw, fh], 'caption': cap[:300]})
        idx.sort(key=lambda d: (-d['star'], -d['fw']))
        json.dump(idx, open(f'{out}/index.json', 'w'), indent=1)
        # contact sheet: 10 across, labelled with the number, date and face size
        cols = 10; cw, ch = 150, 172
        rows = max(1, (len(idx) + cols - 1) // cols)
        sheet = Image.new('RGB', (cols * cw, rows * ch + 24), 'white'); d = ImageDraw.Draw(sheet)
        d.text((4, 4), f'{sid}: {heads.get(sid)}  ({len(idx)} faces, * = caption names {surname})', fill='black', font=font)
        for i, it in enumerate(idx):
            X, Y = (i % cols) * cw, 24 + (i // cols) * ch
            sheet.paste(Image.open(f"{out}/{it['crop']}"), (X, Y))
            d.text((X + 2, Y + 152), f"{i}{'*' if it['star'] else ''} {it['time'][2:7]} {it['fw']}px", fill='black', font=font)
        sheet.save(f'{out}/sheet.jpg', quality=85)
        return f"{sid}: {len(v.get('items') or [])} posts, {len(idx)} faces, {sum(i['star'] for i in idx)} starred"

if __name__ == '__main__': main()
