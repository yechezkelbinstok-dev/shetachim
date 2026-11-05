# circles.py <out.jpg> <dir> <name>...: a review sheet of retouched faces (<dir>/<name>.jpg): each big, and as the cards
# show them (a 68 px and a 44 px circle). Needs the venv of retouch.py.
import sys
from PIL import Image, ImageDraw
out, d, names = sys.argv[1], sys.argv[2], sys.argv[3:]
T = 220; pad = 14; cols = 6; rows = (len(names) + cols - 1) // cols
sheet = Image.new('RGB', (cols * (T + pad) + pad, rows * (T + 110) + pad), (246, 244, 240)); dr = ImageDraw.Draw(sheet)
for i, n in enumerate(names):
    x = pad + (i % cols) * (T + pad); y = pad + (i // cols) * (T + 110)
    im = Image.open(f'{d}/{n}.jpg').convert('RGB'); sheet.paste(im.resize((T, T), Image.LANCZOS), (x, y))
    c = im.resize((68, 68), Image.LANCZOS); m = Image.new('L', (68 * 4, 68 * 4), 0); ImageDraw.Draw(m).ellipse((0, 0, 68 * 4 - 1, 68 * 4 - 1), fill=255)
    sheet.paste(c, (x, y + T + 8), m.resize((68, 68), Image.LANCZOS))
    c2 = im.resize((44, 44), Image.LANCZOS); m2 = Image.new('L', (176, 176), 0); ImageDraw.Draw(m2).ellipse((0, 0, 175, 175), fill=255)
    sheet.paste(c2, (x + 80, y + T + 20), m2.resize((44, 44), Image.LANCZOS))
    dr.text((x + 134, y + T + 30), n, fill=(30, 30, 30))
sheet.save(out, quality=90)
