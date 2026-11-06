#!/usr/bin/env python3
"""The Rebbeim's pictures for their cards: web/img/rebbeim/<key>.jpg (300x375), each from its source in
work/head-photos/rebbeim/<key>.jpg as data/rebbeim-portraits.json says (its 'box', and its 'fill' painted over with the
backdrop around it first; a 'fit' one, a sefer's title page, shown whole on white), gently levelled and sharpened;
black-and-white ones stay black and white.

  python3 scripts/head-photos/rebbeim-portraits.py      (needs pillow and numpy: the venv of retouch.py)
"""
import json, os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageOps

R = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
for p in json.load(open(os.path.join(R, 'data', 'rebbeim-portraits.json'), encoding='utf-8'))['portraits']:
    im = Image.open(os.path.join(R, 'work', 'head-photos', 'rebbeim', p['key'] + '.jpg'))
    grey = im.mode == 'L'
    if p.get('fill'):  # the backdrop's own tone (the median just left of the area), feathered in, with a little grain
        g = im.convert('L'); a = np.asarray(g).astype(np.float32)
        xs = [x for x, _ in p['fill']]; ys = [y for _, y in p['fill']]
        x0 = max(min(xs) - 66, 0); bg = float(np.median(a[2:28, x0:max(min(xs) - 6, x0 + 1)]))
        m = Image.new('L', g.size, 0); ImageDraw.Draw(m).polygon([tuple(v) for v in p['fill']], fill=255)
        m = np.asarray(m.filter(ImageFilter.GaussianBlur(5))).astype(np.float32) / 255
        noise = np.full_like(a, bg) + np.random.default_rng(3).normal(0, 4, a.shape)
        noise = np.asarray(Image.fromarray(np.clip(noise, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))).astype(np.float32)
        im = Image.fromarray(np.clip(a * (1 - m) + noise * m, 0, 255).astype(np.uint8))
    im = im.convert('RGB').crop(tuple(p['box']))
    if p.get('fit'):  # a sefer's title page: whole, 10 px of white above and below, centred
        h = 355; w = round(im.width * h / im.height); page = Image.new('RGB', (300, 375), (255, 255, 255))
        page.paste(im.resize((w, h), Image.LANCZOS), ((300 - w) // 2, 10)); im = page
    else:
        im = im.resize((300, 375), Image.LANCZOS)
    im = ImageOps.autocontrast(im, cutoff=(0.4, 0.4), preserve_tone=True)
    im = im.filter(ImageFilter.UnsharpMask(radius=1.1, percent=55, threshold=2))
    if grey: im = ImageOps.grayscale(im).convert('RGB')
    out = os.path.join(R, 'web', 'img', 'rebbeim', p['key'] + '.jpg')
    im.save(out, quality=88, optimize=True, progressive=True); print(out)
