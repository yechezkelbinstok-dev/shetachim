# facedbg.py: each crop (as enhance.py frames it) with the face box found, and the skin pixels it reads, in red
import sys, numpy as np, cv2, json
sys.argv = [sys.argv[0]]
exec(open('/tmp/claude-0/-home-user-shetachim/6dfe7d99-9185-570e-b237-1d68bcc4daf7/scratchpad/tools/enhance.py').read().split('log = {}')[0])
from PIL import Image, ImageDraw
tiles = []
for i in ids:
    sp = spec[i]; rgb = load(sp['src'])
    (x, y, s), face = frame(rgb, sp)
    x0, y0, s0 = int(round(x)), int(round(y)), int(round(s))
    crop = rgb[y0:y0 + s0, x0:x0 + s0].copy()
    im = Image.fromarray((crop * 255).astype(np.uint8)).resize((200, 200)); d = ImageDraw.Draw(im); k = 200 / s0
    if face:
        fx, fy, fw, fh = face[0] - x0, face[1] - y0, face[2], face[3]
        lab = to_lab(crop); L, A, B = lab[..., 0], lab[..., 1], lab[..., 2]
        yy0, yy1, xx0, xx1 = max(int(fy), 0), int(fy + fh), max(int(fx), 0), int(fx + fw)
        a, b, l = A[yy0:yy1, xx0:xx1], B[yy0:yy1, xx0:xx1], L[yy0:yy1, xx0:xx1]
        c = np.sqrt(a * a + b * b); hue = np.degrees(np.arctan2(b, a))
        m = (c > 10) & (a > 2) & (b > 2) & (hue > 25) & (hue < 70) & (l > 18) & (l < 92)
        d.rectangle([fx * k, fy * k, (fx + fw) * k, (fy + fh) * k], outline=(0, 255, 0), width=2)
        d.text((4, 4), f"{i[:14]} skin {m.mean():.2f} L{np.median(l[m]) if m.any() else 0:.0f}", fill=(255, 255, 0))
    else:
        d.text((4, 4), f"{i[:14]} NO FACE", fill=(255, 80, 80))
    tiles.append(im)
cols = 8; rows = (len(tiles) + cols - 1) // cols
sheet = Image.new('RGB', (cols * 204, rows * 204), (30, 30, 30))
for n, t in enumerate(tiles): sheet.paste(t, ((n % cols) * 204 + 2, (n // cols) * 204 + 2))
sheet.save('/tmp/claude-0/-home-user-shetachim/6dfe7d99-9185-570e-b237-1d68bcc4daf7/scratchpad/facedbg.png')
print('ok')
