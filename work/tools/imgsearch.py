# imgsearch.py "<query>" [n]: image results (image url, page url, title) from Bing's image search page
import sys, re, json, html, urllib.parse, subprocess
q = sys.argv[1]; n = int(sys.argv[2]) if len(sys.argv) > 2 else 15
url = 'https://www.bing.com/images/search?' + urllib.parse.urlencode({'q': q, 'form': 'HDRSC2', 'first': 1})
ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
page = subprocess.run(['curl', '-sS', '-L', '-A', ua, url], capture_output=True, text=True).stdout
out = []
for m in re.finditer(r'\sm="([^"]+)"', page):
    try:
        d = json.loads(html.unescape(m.group(1)))
    except Exception:
        continue
    if 'murl' in d:
        out.append({'img': d['murl'], 'page': d.get('purl', ''), 'title': d.get('t', '')})
    if len(out) >= n:
        break
print(json.dumps(out, ensure_ascii=False, indent=0))
