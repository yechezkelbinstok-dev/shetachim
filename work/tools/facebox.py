# facebox.py <img>...: faces (with eyes) in each image as x,y,w,h, biggest first, plus the image size
import sys
sys.path.insert(0, '/tmp/claude-0/-home-user-shetachim/6dfe7d99-9185-570e-b237-1d68bcc4daf7/scratchpad/tools')
from faces import faces_in
for f in sys.argv[1:]:
    fs, wh = faces_in(f)
    print(f.split('/')[-2] + '/' + f.split('/')[-1], wh, sorted(fs, key=lambda b: -b[2])[:4])
