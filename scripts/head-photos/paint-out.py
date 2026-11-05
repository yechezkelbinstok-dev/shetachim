#!/usr/bin/env python3
"""Paint something out of a head-shliach source photo before it is cropped (e.g. a grandchild he is holding whose hat
reaches into the frame), so the crop shows him alone.

  python3 scripts/head-photos/paint-out.py <source image> <out.png> --axis X --mirror "x,y x,y ..." [--fill "x0,y0,x1,y1" ...] [--dot "x,y,r" ...]
      [--clone "x0,y0,x1,y1,cx,cy" ...]

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
    a = ap.parse_args()
    im = cv2.imread(a.source, cv2.IMREAD_COLOR)
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
    done = [w for w, on in (('a mirror fill', a.mirror), ('cloned patches', a.clone), ('inpainted spots', m.any())) if on]
    print(f'{a.out}: painted out with {", ".join(done) or "nothing"}')


if __name__ == '__main__':
    main()
