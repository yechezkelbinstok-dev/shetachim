# enhance.py: re-crop every saved head photo from its full-size source and retouch it — even framing (the face found
# with OpenCV, never wider than the hand-picked square, so nothing it kept out comes back), colour cast taken out
# (the beard / shirt / wall greys made neutral), levels, exposure set on the face, gentle local contrast, saturation
# brought to a natural range, light noise cleanup for small sources, sharpening, a faint vignette. -> photos/enh/<id>.jpg
import cv2, numpy as np, json, glob, os, sys
from PIL import Image, ImageFilter
S = '/tmp/claude-0/-home-user-shetachim/6dfe7d99-9185-570e-b237-1d68bcc4daf7/scratchpad'
R = '/home/user/shetachim'
OUT = f'{S}/photos/enh'; os.makedirs(OUT, exist_ok=True)
spec = {}
for f in sorted(glob.glob(f'{S}/photos/batch*.json'), key=lambda p: int(''.join(c for c in os.path.basename(p) if c.isdigit()) or 0)):
    for sp in json.load(open(f)): spec[sp['id']] = sp
ids = [p['id'] for p in json.load(open(f'{R}/data/head-photos.json'))['photos']]
only = set(sys.argv[1:])
cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
cascade2 = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_alt2.xml')
eyes1 = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye_tree_eyeglasses.xml')
eyes2 = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
def has_eyes(g, fx, fy, fw, fh):
    top = g[int(fy):int(fy + fh * 0.62), int(fx):int(fx + fw)]
    if top.size == 0: return False
    for e in (eyes1, eyes2):
        if len(e.detectMultiScale(top, scaleFactor=1.05, minNeighbors=3, minSize=(max(int(fw * 0.1), 6),) * 2, maxSize=(int(fw * 0.45),) * 2)): return True
    return False

def load(src):
    im = Image.open(src)
    if im.mode in ('RGBA', 'LA', 'P'):
        im = im.convert('RGBA'); bg = Image.new('RGBA', im.size, (255, 255, 255, 255)); bg.alpha_composite(im); im = bg
    return np.asarray(im.convert('RGB')).astype(np.float32) / 255.0

def manual_square(W, H, sp):
    s = sp['side'] * H
    x = min(max(sp['cx'] * W - s / 2, 0), W - s); y = min(max(sp['cy'] * H - s / 2, 0), H - s)
    return x, y, s

def find_face(rgb, box):
    x, y, s = box
    sub = (rgb[int(y):int(y + s), int(x):int(x + s)] * 255).astype(np.uint8)
    g = cv2.equalizeHist(cv2.cvtColor(sub, cv2.COLOR_RGB2GRAY))
    best = None
    for c in (cascade, cascade2):
        fs = c.detectMultiScale(g, scaleFactor=1.06, minNeighbors=5, minSize=(int(s * 0.14), int(s * 0.14)))
        for (fx, fy, fw, fh) in fs:
            if fw > s * 0.75 or fw < s * 0.18: continue
            cx, cy = fx + fw / 2, fy + fh / 2
            # the hand-picked square has the face in its upper middle; and a face has eyes (a beard doesn't)
            if not (0.12 * s <= cy <= 0.75 * s and 0.2 * s <= cx <= 0.8 * s): continue
            if not has_eyes(g, fx, fy, fw, fh): continue
            # the face we framed is near the middle, a little above it
            d = ((cx - s / 2) ** 2 + (cy - s * 0.42) ** 2) ** 0.5 / s
            score = fw / s - 1.2 * d
            if best is None or score > best[0]: best = (score, fx + x, fy + y, fw, fh)
        if best: break
    return best and best[1:]

def frame(rgb, sp):
    H, W = rgb.shape[:2]
    mx, my, ms = manual_square(W, H, sp)
    f = find_face(rgb, (mx, my, ms))
    if not f: return (mx, my, ms), None
    fx, fy, fw, fh = f
    side = min(ms, 2.9 * fw)                      # the face about a third of the frame across; never wider than the hand pick
    cx, cy = fx + fw / 2, fy + fh / 2
    x = cx - side / 2; y = cy - 0.46 * side       # face a touch above the middle (hat above, beard below)
    x = min(max(x, mx), mx + ms - side); y = min(max(y, my), my + ms - side)
    return (x, y, side), (fx, fy, fw, fh)

def to_lab(rgb): return cv2.cvtColor(rgb, cv2.COLOR_RGB2LAB)      # float: L 0..100, a/b about -128..127
def to_rgb(lab): return np.clip(cv2.cvtColor(lab, cv2.COLOR_LAB2RGB), 0, 1)

def skin_stats(L, A, B, face_rel):
    """lightness and colourfulness of the skin in the face box (beards, glasses and hats left out)"""
    if not face_rel: return None
    fx, fy, fw, fh = face_rel
    # forehead, eyes and cheeks only (a red or brown beard reads like skin)
    y0, y1 = max(int(fy + fh * 0.12), 0), max(int(fy + fh * 0.56), 1); x0, x1 = max(int(fx + fw * 0.18), 0), max(int(fx + fw * 0.82), 1)
    l, a, b = L[y0:y1, x0:x1], A[y0:y1, x0:x1], B[y0:y1, x0:x1]
    if l.size == 0: return None
    c = np.sqrt(a * a + b * b); hue = np.degrees(np.arctan2(b, a))
    m = (c > 10) & (a > 2) & (b > 2) & (hue > 25) & (hue < 70) & (l > 18) & (l < 92)
    if m.mean() < 0.04: return None
    return float(np.median(l[m])), float(np.median(c[m])), float(m.mean())

# casts too strong for the automatic reading (the beard itself is tinted): set by eye, (a, b) taken out
OVERRIDE = {'west-coast': {'cast': (17.0, -2.0)}, 'merrimack-valley': {'cast': (8.0, -2.5)}}

def retouch(crop, face_rel, small, ovr=None):
    lab = to_lab(crop)
    L, A, B = lab[..., 0], lab[..., 1], lab[..., 2]
    chroma = np.sqrt(A * A + B * B)
    mono = float(np.percentile(chroma, 98)) < 6 and float(chroma.mean()) < 2.5
    notes = []
    # 1. colour cast: what should be grey (bright, nearly colourless: beards, shirts, walls) made grey
    if mono:
        A[:] = 0; B[:] = 0; notes.append('b&w')
    elif ovr and 'cast' in ovr:
        da, db = ovr['cast']; wl = np.clip((L - 8) / 55, 0, 1)   # a cast lives in the light; blacks stay black
        A -= da * wl; B -= db * wl; notes.append(f'cast {da:+.1f},{db:+.1f} (by eye)')
    else:
        m = (L > 50) & (L < 98) & (chroma < 16)
        if m.mean() > 0.015:
            da, db = float(np.average(A[m])), float(np.average(B[m]))
            da, db = float(np.clip(da * 0.75, -7, 7)), float(np.clip(db * 0.75, -7, 7))
            if abs(da) + abs(db) > 1.2:
                wl = np.clip((L - 8) / 55, 0, 1)
                A -= da * wl; B -= db * wl; notes.append(f'cast {da:+.1f},{db:+.1f}')
    # 2. levels on lightness, only when the range is squashed, and gently
    lo, hi = np.percentile(L, 0.6), np.percentile(L, 99.6)
    gain = min((97.0 - 3.0) / max(hi - lo, 1e-3), 1.25)
    if gain > 1.03:
        L[:] = np.clip((L - lo) * gain + 3.0, 0, 100); notes.append(f'levels x{gain:.2f}')
    # 3. exposure, read on the skin only: pushed into a natural band, never past it
    st = None if mono else skin_stats(L, A, B, face_rel)
    if st:
        sl, sc, frac = st
        target = min(max(sl, 56.0), 76.0)
    else:
        sl = target = 0   # no face found: leave the exposure alone (levels only)
    if st and abs(target - sl) > 0.5 and 5 < sl < 95:
        g = float(np.clip(np.log(target / 100) / np.log(sl / 100), 0.72, 1.08))
        L[:] = 100 * np.power(np.clip(L / 100, 0, 1), g); notes.append(f'exposure g{g:.2f} (skin {sl:.0f})')
    # 4. gentle local contrast (less for small, noisy sources)
    l8 = np.clip(L * 2.55, 0, 255).astype(np.uint8)
    lc = cv2.createCLAHE(clipLimit=1.5, tileGridSize=(4, 4)).apply(l8).astype(np.float32) / 2.55
    w = 0.15 if small else 0.3
    L[:] = L * (1 - w) + lc * w
    # 5. colour strength, read on the skin: pulled into a natural band
    if not mono and st:
        k = min(max(sc, 14.0), 25.0) / max(sc, 1e-3)
        k = float(np.clip(k, 0.75, 1.2))
        if abs(k - 1) > 0.03:
            A *= k; B *= k; notes.append(f'colour x{k:.2f} (skin {sc:.0f})')
    return to_rgb(np.dstack([L, A, B])), notes

def vignette(img):
    h, w = img.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w]
    r = np.sqrt(((xx - w / 2) / (w / 2)) ** 2 + ((yy - h * 0.46) / (h / 2)) ** 2)
    v = 1 - 0.10 * np.clip(r - 0.35, 0, None) ** 2 / 0.42
    return img * v[..., None]

log = {}
for i in ids:
    if only and i not in only: continue
    sp = spec[i]
    rgb = load(sp['src'])
    (x, y, s), face = frame(rgb, sp)
    x0, y0, s0 = int(round(x)), int(round(y)), int(round(s))
    crop = rgb[y0:y0 + s0, x0:x0 + s0].copy()
    small = s0 < 300
    face_rel = (face[0] - x0, face[1] - y0, face[2], face[3]) if face else None
    if small:   # small or blocky sources: clean the noise and JPEG blocks before enlarging
        u8 = (crop * 255).astype(np.uint8)
        u8 = cv2.fastNlMeansDenoisingColored(u8, None, 4, 4, 5, 15)
        crop = u8.astype(np.float32) / 255
    out, notes = retouch(crop, face_rel, small, OVERRIDE.get(i))
    ring = np.ones(out.shape[:2], bool); hh, ww = ring.shape; ring[int(hh * .12):int(hh * .88), int(ww * .12):int(ww * .88)] = False
    if float(np.mean(out[ring])) < 0.72: out = vignette(out)   # no vignette on a light backdrop (it would read as a grey ring)
    im = Image.fromarray((np.clip(out, 0, 1) * 255 + 0.5).astype(np.uint8))
    im = im.resize((320, 320), Image.LANCZOS)
    im = im.filter(ImageFilter.UnsharpMask(radius=1.6 if small else 1.1, percent=55 if small else 70, threshold=2))
    im.save(f'{OUT}/{i}.jpg', quality=90, optimize=True, progressive=True)
    log[i] = {'face': bool(face), 'side': s0, 'manual': int(round(manual_square(rgb.shape[1], rgb.shape[0], sp)[2])), 'notes': notes}
    print(f"{i:28s} face={'Y' if face else '-'} side {s0}/{log[i]['manual']}  {'; '.join(notes)}")
json.dump(log, open(f'{OUT}/log.json', 'w'), indent=1)
