#!/usr/bin/env python3
"""Paint something out of a head-shliach source photo before it is cropped (e.g. a grandchild he is holding whose hat
reaches into the frame), so the crop shows him alone.

  python3 scripts/head-photos/paint-out.py <source image> <out.png> --axis X --mirror "x,y x,y ..." [--fill "x0,y0,x1,y1" ...] [--dot "x,y,r" ...]

--mirror is a polygon (source pixels) filled from the mirror image of the photo across the vertical line x = --axis
(the centre of his face), blended in with Poisson cloning: beard, jacket and wall on one side stand in for the other.
--fill / --dot are rectangles / circles on a plain wall (a sign, a pin) filled from their surroundings (OpenCV Telea
inpainting). data/head-photos.json keeps the arguments under "edit"; retouch.py then runs on the cleaned image.
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
    m = np.zeros((H, W), np.uint8)
    for r in a.fill:
        x0, y0, x1, y1 = (int(float(v)) for v in r.split(','))
        cv2.rectangle(m, (x0, y0), (x1, y1), 255, -1)
    for c in a.dot:
        x, y, r = (int(float(v)) for v in c.split(','))
        cv2.circle(m, (x, y), r, 255, -1)
    if m.any(): im = cv2.inpaint(im, m, 7, cv2.INPAINT_TELEA)
    cv2.imwrite(a.out, im)
    print(f'{a.out}: painted out {"a mirror fill" if a.mirror else ""}{" and " if a.mirror and m.any() else ""}{"inpainted spots" if m.any() else ""}')


if __name__ == '__main__':
    main()
