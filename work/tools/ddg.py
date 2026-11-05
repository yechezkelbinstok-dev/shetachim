# ddg.py "<query>" [n]: image results from DuckDuckGo's image search (image url, page url, title, size)
import sys, re, json, urllib.parse, subprocess
q = sys.argv[1]; n = int(sys.argv[2]) if len(sys.argv) > 2 else 15
ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
def get(url, ref=None):
    cmd = ['curl', '-sS', '-L', '-A', ua] + (['-H', f'Referer: {ref}'] if ref else []) + [url]
    return subprocess.run(cmd, capture_output=True, text=True).stdout
first = get('https://duckduckgo.com/?' + urllib.parse.urlencode({'q': q, 'iax': 'images', 'ia': 'images'}))
m = re.search(r'vqd=["\']?([\d-]+)', first) or re.search(r'vqd=([\w-]+)&', first)
if not m:
    print(json.dumps({'error': 'no vqd', 'len': len(first)})); sys.exit()
res = get('https://duckduckgo.com/i.js?' + urllib.parse.urlencode({'l': 'us-en', 'o': 'json', 'q': q, 'vqd': m.group(1), 'f': ',,,,,', 'p': '1'}), 'https://duckduckgo.com/')
try:
    d = json.loads(res)
except Exception:
    print(json.dumps({'error': 'bad json', 'head': res[:200]})); sys.exit()
out = [{'img': r['image'], 'page': r.get('url', ''), 'title': r.get('title', ''), 'w': r.get('width'), 'h': r.get('height')} for r in d.get('results', [])[:n]]
print(json.dumps(out, ensure_ascii=False, indent=0))
