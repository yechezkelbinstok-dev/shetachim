#!/usr/bin/env python3
"""The Frierdiker Rebbe's colour picture (owner, Nov 9: "Look at how dull the colorization is. I'm sure you can work on
it"): the light and shade of the Commons scan (work/head-photos/rebbeim/frierdiker-rebbe-scan.jpg, File:Frierdiger_Rebbe.tif),
the colours of Chabad Tel Aviv's colourisation of it (frierdiker-rebbe-colour.jpg), regraded: the colourist's chroma
strengthened; the face an even, natural skin tone instead of its blotches; the beard and the moustache clean silver;
the fur hat and the coat warm brown-black. Writes work/head-photos/rebbeim/frierdiker-rebbe.jpg (the scan's size, so
data/rebbeim-portraits.json's box is in the scan's pixels); then rebbeim-portraits.py makes the card picture.

  python3 scripts/head-photos/frierdiker-colour.py      (needs numpy and opencv-python)
"""
import os, sys
R = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
D = os.path.join(R, 'work', 'head-photos', 'rebbeim')
sys.argv = [sys.argv[0], D, os.path.join(D, 'frierdiker-rebbe.jpg'), '1.3', '13', '16', '0.15', '1.08', '1.1']
import cv2, numpy as np
d, out = sys.argv[1], sys.argv[2]
ch, sa, sb, mixo, cont, hatw = [float(x) for x in sys.argv[3:9]]
bw = cv2.imread(os.path.join(d, 'frierdiker-rebbe-scan.jpg'), cv2.IMREAD_GRAYSCALE).astype(np.float32) / 255
col = cv2.imread(os.path.join(d, 'frierdiker-rebbe-colour.jpg')).astype(np.float32) / 255
H, W = bw.shape
lab = cv2.cvtColor(cv2.resize(col, (W, H), interpolation=cv2.INTER_CUBIC), cv2.COLOR_BGR2LAB)
a = cv2.GaussianBlur(lab[..., 1], (0, 0), 2); b = cv2.GaussianBlur(lab[..., 2], (0, 0), 2)
g = cv2.cvtColor(cv2.cvtColor(bw, cv2.COLOR_GRAY2BGR), cv2.COLOR_BGR2LAB)[..., 0] / 100
s = np.clip(0.5 + (g - 0.5) * cont, 0, 1); s = s + (np.sin((s - 0.5) * np.pi) * 0.5 + 0.5 - s) * 0.3
L = np.clip(s, 0, 1) * 100
C = np.hypot(a, b); hue = np.degrees(np.arctan2(b, a))
skin = ((hue > 10) & (hue < 90) & (C > 5)).astype(np.uint8)
# the face and hands: the largest warm areas, closed and softened
skin = cv2.morphologyEx(skin, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
skin = cv2.morphologyEx(skin, cv2.MORPH_CLOSE, np.ones((25, 25), np.uint8))
# keep the face and the hands (big warm areas right of the shelf in the background), holes filled
n, lbl, st, cen = cv2.connectedComponentsWithStats(skin)
keep = np.zeros_like(skin)
for i in range(1, n):
    if st[i, cv2.CC_STAT_AREA] > 4000 and cen[i][0] > 0.25 * W:
        comp = (lbl == i).astype(np.uint8)
        cs, _ = cv2.findContours(comp, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        cv2.drawContours(keep, [cv2.convexHull(np.vstack(cs))], -1, 1, thickness=-1)
skin = cv2.dilate(keep, np.ones((9, 9), np.uint8))
skin = cv2.GaussianBlur(skin.astype(np.float32), (0, 0), 7)
# an even, natural skin tone (a little deeper and warmer in the shadows), with a trace of the colourist's variation
t = np.clip((L - 30) / 60, 0, 1)
ska = sa * (1.15 - 0.3 * t); skb = sb * (1.2 - 0.35 * t)
mean_a = np.sum(a * skin) / np.sum(skin); mean_b = np.sum(b * skin) / np.sum(skin)
ska = ska + (a - mean_a) * mixo; skb = skb + (b - mean_b) * mixo
a2 = a * ch * (1 - skin) + ska * skin; b2 = b * ch * (1 - skin) + skb * skin
# the beard: light and greyish -> clean silver with a touch of warmth
# (inside the face too, where the colourist left the moustache nearly grey: below the eyes only)
yy = np.arange(H, dtype=np.float32)[:, None] * np.ones((1, W), np.float32)
fl = cv2.connectedComponents((skin > 0.5).astype(np.uint8))[1]; top = fl[np.where(fl > 0)[0].min(), :].max() if (fl > 0).any() else 0
fy = np.where(fl == top)[0] if top else np.array([]); eyes = fy.min() + 0.45 * (fy.max() - fy.min()) if len(fy) else H
# hair inside the face's outline: below the nose everything light is moustache; on the cheeks, the light and wiry
# (strong fine texture in the scan) is beard
nose = fy.min() + 0.8 * (fy.max() - fy.min()) if len(fy) else H
tex = cv2.GaussianBlur(np.abs(bw - cv2.GaussianBlur(bw, (0, 0), 1.5)), (0, 0), 2)
tf = tex[skin > 0.5]; ramp = np.clip((yy - eyes) / max(nose - eyes, 1), 0, 1)
thr = np.percentile(tf, 85) * (1 - ramp) + np.percentile(tf, 55) * ramp
inface = ((skin > 0.2) & (yy > eyes) & (L > 45) & (tex > thr)).astype(np.float32)
inface = cv2.morphologyEx(inface, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8)); inface = cv2.GaussianBlur(inface, (0, 0), 3)
beard = np.clip(cv2.GaussianBlur(((L > 42) & (C < 10)).astype(np.float32) * (1 - skin), (0, 0), 3), 0, 1)
a2 = a2 * (1 - beard * 0.9) + beard * 0.6; b2 = b2 * (1 - beard * 0.9) + beard * 3.2
# hair over the face: mostly silver, some of the skin's warmth left in it
inface = np.clip(inface, 0, 1) * 0.75
a2 = a2 * (1 - inface) + inface * 2.2; b2 = b2 * (1 - inface) + inface * 6.5
beard = np.clip(beard + inface, 0, 1)
# shadows (the fur hat, the coat): warm brown-black, not cold grey
sh = np.clip((40 - L) / 40, 0, 1) * (1 - skin) * (1 - beard)
a2 += sh * 2.0 * hatw; b2 += sh * 5.0 * hatw
rgb = np.clip(cv2.cvtColor(cv2.merge([L, a2, b2]), cv2.COLOR_LAB2BGR), 0, 1)
cv2.imwrite(out, (rgb * 255 + 0.5).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 93])
