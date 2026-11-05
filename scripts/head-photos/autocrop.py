# autocrop.py <img> <hint x frac> <hint y frac>: the face nearest the hint (Haar), the head-and-shoulders square for it
# (face a third of the side, a little above the middle), clamped to the image; flags any other face inside the square
import sys, cv2, numpy as np
from PIL import Image
f, hx, hy = sys.argv[1], float(sys.argv[2]), float(sys.argv[3])
im = Image.open(f).convert('RGB'); W, H = im.size; a = np.asarray(im); g = cv2.equalizeHist(cv2.cvtColor(a, cv2.COLOR_RGB2GRAY))
faces = []
for n in ('haarcascade_frontalface_default.xml', 'haarcascade_frontalface_alt2.xml'):
    for (x, y, w, h) in cv2.CascadeClassifier(cv2.data.haarcascades + n).detectMultiScale(g, 1.06, 5, minSize=(int(min(W, H) * 0.06),) * 2):
        if not any(abs(x - X) < w * .5 and abs(y - Y) < h * .5 for X, Y, _, _ in faces): faces.append((int(x), int(y), int(w), int(h)))
if not faces: print('NO FACE', f); sys.exit()
fx, fy, fw, fh = min(faces, key=lambda b: (b[0] + b[2] / 2 - hx * W) ** 2 + (b[1] + b[3] / 2 - hy * H) ** 2)
side = min(3.0 * fw, W, H); cx = fx + fw / 2; cy = fy + fh / 2 + 0.17 * side
x0 = min(max(cx - side / 2, 0), W - side); y0 = min(max(cy - side / 2, 0), H - side)
others = [b for b in faces if b != (fx, fy, fw, fh) and b[0] + b[2] > x0 and b[0] < x0 + side and b[1] + b[3] > y0 and b[1] < y0 + side]
print(f'{(x0 + side / 2) / W:.4f},{(y0 + side / 2) / H:.4f},{side / H:.4f}', f'face={fx},{fy},{fw}', f'size={W}x{H}', 'OTHERS:' + str(others) if others else '')
