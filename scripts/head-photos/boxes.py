# boxes.py <out.jpg> <img>...: every face found (OpenCV Haar, frontal + profile), boxed and numbered with its source
# coordinates (x,y,width), one tile per image, to place a crop or a paint-out by hand. Needs the venv of retouch.py.
import sys, cv2, numpy as np
from PIL import Image, ImageDraw
out, files = sys.argv[1], sys.argv[2:]
cas = [cv2.CascadeClassifier(cv2.data.haarcascades + n) for n in ('haarcascade_frontalface_default.xml', 'haarcascade_frontalface_alt2.xml', 'haarcascade_profileface.xml')]
tiles = []
for f in files:
    im = Image.open(f).convert('RGB'); a = np.asarray(im); g = cv2.equalizeHist(cv2.cvtColor(a, cv2.COLOR_RGB2GRAY))
    boxes = []
    for c in cas:
        for (x, y, w, h) in c.detectMultiScale(g, 1.08, 5, minSize=(int(min(im.size) * 0.05),) * 2):
            if not any(abs(x - bx) < w * .5 and abs(y - by) < h * .5 for bx, by, bw, bh in boxes): boxes.append((x, y, w, h))
    s = 520 / im.width; t = im.resize((520, int(im.height * s))); d = ImageDraw.Draw(t)
    for i, (x, y, w, h) in enumerate(boxes):
        d.rectangle([x * s, y * s, (x + w) * s, (y + h) * s], outline=(255, 0, 0), width=2); d.text((x * s + 2, y * s + 2), f'{i}:{x},{y},{w}', fill=(255, 255, 0))
    d.text((4, 4), f.split('candidates/')[-1] + f' {im.size}', fill=(255, 0, 255)); tiles.append(t)
H = max(t.height for t in tiles); sheet = Image.new('RGB', (sum(t.width + 8 for t in tiles), H), (200, 200, 200)); x = 0
for t in tiles: sheet.paste(t, (x, 0)); x += t.width + 8
sheet.save(out, quality=88)
