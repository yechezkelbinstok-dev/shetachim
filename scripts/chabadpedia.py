#!/usr/bin/env python3
"""Read Chabadpedia articles through the Wayback Machine (Chabadpedia itself sits behind a Cloudflare wall that
blocks cloud machines). Usage: python3 scripts/chabadpedia.py "אוטווה" ["זלמן אהרן גרוסבאום" ...]
For each title: the newest archived copy; if there is none, asks the Wayback Machine to save the page now, then reads
that. Prints the article's text (no menus). Needs web.archive.org allowed in the environment's network settings."""
import html, json, re, sys, time, urllib.parse, urllib.request

UA = {'User-Agent': 'Mozilla/5.0 (shetachim research; Chabadpedia via the Wayback Machine)'}


def get(url, timeout=90):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=timeout) as r:
        return r.geturl(), r.read().decode('utf8', 'replace')


def snapshot(page):
    _, body = get('https://archive.org/wayback/available?url=' + urllib.parse.quote(page))
    closest = json.loads(body).get('archived_snapshots', {}).get('closest')
    return closest['timestamp'] if closest and closest.get('available') else None


def text_of(page_html):
    m = re.search(r'<div id="mw-content-text".*?(?=<div class="printfooter"|<div id="catlinks")', page_html, re.S)
    body = m.group(0) if m else page_html
    body = re.sub(r'<(script|style|table class="navbox)[^>]*>.*?</\1>', '', body, flags=re.S)
    body = re.sub(r'<br\s*/?>|</p>|</li>|</h\d>', '\n', body)
    return re.sub(r'\n\s*\n+', '\n', html.unescape(re.sub(r'<[^>]+>', '', body))).strip()


for title in sys.argv[1:]:
    page = 'https://chabadpedia.co.il/index.php/' + urllib.parse.quote(title.replace(' ', '_'))
    ts = snapshot(page)
    if not ts:
        print(f'[{title}: no archived copy; asking the Wayback Machine to save it]', file=sys.stderr)
        try:
            get('https://web.archive.org/save/' + page, timeout=180)
        except Exception as e:  # (saving can time out yet still succeed)
            print(f'[save: {e}]', file=sys.stderr)
        for _ in range(6):
            time.sleep(10)
            ts = snapshot(page)
            if ts:
                break
    if not ts:
        print(f'=== {title}: not available (no copy, and the save did not take)\n')
        continue
    _, raw = get(f'https://web.archive.org/web/{ts}id_/{page}')
    print(f'=== {title} (archived {ts[:4]}-{ts[4:6]}-{ts[6:8]})\n{text_of(raw)}\n')
