#!/usr/bin/env python3
"""Paint something out of a head-shliach source photo before it is cropped (e.g. a grandchild he is holding whose hat
reaches into the frame), so the crop shows him alone.

  python3 scripts/head-photos/paint-out.py <source image> <out.png> --axis X --mirror "x,y x,y ..." [--fill "x0,y0,x1,y1" ...] [--dot "x,y,r" ...]
      [--clone "x0,y0,x1,y1,cx,cy" ...] [--trim N] [--extend-top N]

--trim N cuts N pixels off every side first (a frame drawn round the photo). --extend-top N then adds N pixels of
headroom above it, continuing a plain backdrop (the top rows, smoothed sideways): for a photo cut tight over his head,
so the crop doesn't cut his hat or kippah. Only over a plain backdrop (a wall, a white or blurred background). Pixel
positions in the other arguments are on the trimmed and extended image.

--mirror is a polygon (source pixels) filled from the mirror image of the photo across the vertical line x = --axis
(the centre of his face), blended in with Poisson cloning: beard, jacket and wall on one side stand in for the other.
--fill / --dot are rectangles / circles on a plain wall (a sign, a pin) filled from their surroundings (OpenCV Telea
inpainting). --clone copies the rectangle x0,y0-x1,y1 (beard, jacket) onto the spot centred at cx,cy, Poisson-blended:
for what the mirror can't reach, e.g. close to the mirror line, where the mirror image is the thing itself. data/head-photos.json
keeps the arguments under "edit"; retouch.py then runs on the cleaned image. Check the result zoomed in before using it:
a hand over a beard doesn't paint out well (Goldman, Nov 5: the owner rejected it), so crop around it or use another photo.
Needs opencv-python-headless and numpy (as retouch.py).
"""
import argparse
import numpy as np, cv2


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('source'); ap.add_argument('out')
    ap.add_argument('--axis', type=float, help='x of the mirror line (the centre of his face)')
    ap.add_argument('--mirror', help='polygon to fill from the mirror image: "x,y x,y ..."')
    ap.add_argument('--fill', action='append', default=[], help='rectangle to inpaint: x0,y0,x1,y1')
    ap.add_argument('--dot', action='append', default=[], help='circle to inpaint: x,y,r')
    ap.add_argument('--clone', action='append', default=[], help='patch to copy over a spot: x0,y0,x1,y1,cx,cy')
    ap.add_argument('--trim', type=int, default=0, help='pixels cut off every side first (a frame round the photo)')
    ap.add_argument('--extend-top', type=int, default=0, help='pixels of plain backdrop added above')
    a = ap.parse_args()
    im = cv2.imread(a.source, cv2.IMREAD_COLOR)
    if a.trim: im = im[a.trim:-a.trim, a.trim:-a.trim]
    if a.extend_top:
        # the mean of the top three rows, repeated upwards and smoothed sideways, eased into the photo over 12 rows
        row = im[:3].astype(np.float32).mean(axis=0, keepdims=True)
        top = cv2.GaussianBlur(np.repeat(row, a.extend_top + 12, axis=0), (0, 0), sigmaX=9, sigmaY=0.1)
        out = np.vstack([top[:a.extend_top], im.astype(np.float32)])
        w = np.linspace(1, 0, 12, dtype=np.float32)[:, None, None]
        out[a.extend_top:a.extend_top + 12] = w * top[a.extend_top:] + (1 - w) * out[a.extend_top:a.extend_top + 12]
        im = np.clip(out, 0, 255).astype(np.uint8)
    H, W = im.shape[:2]
    if a.mirror:
        poly = np.array([[int(float(v)) for v in p.split(',')] for p in a.mirror.split()], np.int32)
        m = np.zeros((H, W), np.uint8); cv2.fillPoly(m, [poly], 255); m = cv2.dilate(m, np.ones((9, 9), np.uint8))
        mx = np.tile((2 * a.axis - np.arange(W)).astype(np.float32), (H, 1))
        my = np.tile(np.arange(H, dtype=np.float32)[:, None], (1, W))
        mir = cv2.remap(im, mx, my, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
        ys, xs = np.where(m > 0)
        im = cv2.seamlessClone(mir, im, m, (int((xs.min() + xs.max()) / 2), int((ys.min() + ys.max()) / 2)), cv2.NORMAL_CLONE)
    for c in a.clone:
        x0, y0, x1, y1, cx, cy = (int(float(v)) for v in c.split(','))
        patch = im[y0:y1, x0:x1].copy(); pm = np.full(patch.shape[:2], 255, np.uint8)
        pm[:2, :] = pm[-2:, :] = 0; pm[:, :2] = pm[:, -2:] = 0  # (a border for the blend)
        im = cv2.seamlessClone(patch, im, pm, (cx, cy), cv2.NORMAL_CLONE)
    m = np.zeros((H, W), np.uint8)
    for r in a.fill:
        x0, y0, x1, y1 = (int(float(v)) for v in r.split(','))
        cv2.rectangle(m, (x0, y0), (x1, y1), 255, -1)
    for c in a.dot:
        x, y, r = (int(float(v)) for v in c.split(','))
        cv2.circle(m, (x, y), r, 255, -1)
    if m.any(): im = cv2.inpaint(im, m, 7, cv2.INPAINT_TELEA)
    cv2.imwrite(a.out, im)
    done = [w for w, on in (('a frame trimmed', a.trim), ('headroom added', a.extend_top), ('a mirror fill', a.mirror),
                            ('cloned patches', a.clone), ('inpainted spots', m.any())) if on]
    print(f'{a.out}: painted out with {", ".join(done) or "nothing"}')


if __name__ == '__main__':
    main()
