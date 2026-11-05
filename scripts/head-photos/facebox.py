# facebox.py <img>...: faces (with eyes) in each image as x,y,w,h, biggest first, plus the image size
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from faces import faces_in
for f in sys.argv[1:]:
    fs, wh = faces_in(f)
    print(f.split('/')[-2] + '/' + f.split('/')[-1], wh, sorted(fs, key=lambda b: -b[2])[:4])
