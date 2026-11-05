# proto7 = proto6 + the owner's Nov 5 notes on it:
#  - "Benji and Herson do NOT deserve that kind of prominence not at ALL" / "those two ceremonial heads should not be
#    getting that level of prominence": where the vaad comes first (Florida, New Jersey) the head shliach is a plain
#    line (no photo, here or on the flagship's card);
#  - "Where there's a Vaad … all their faces somehow arranged … not overlapping … nicely done": the vaad's faces in a
#    honeycomb by "Leadership" (its head, if it has one, in the middle with a ring), the members list under its name;
#  - the count: "I guess two? But maybe it can get better than that even": a plain line, its mark the map's own centre
#    dot (navy), mushrooms after it with the mushroom mark.
# Reads proto6/index.html and data/vaad-photos.json, writes proto7/index.html. Preview only.
import json, os
S = '/tmp/claude-0/-home-user-shetachim/6dfe7d99-9185-570e-b237-1d68bcc4daf7/scratchpad'
s = open(f'{S}/proto6/index.html', encoding='utf-8').read()
vp = json.load(open('/home/user/shetachim/data/vaad-photos.json'))['vaads']
VAAD = {k: [{'file': m['file'], 'name': m['name'], **({'role': m['role']} if m.get('role') else {})} for m in v] for k, v in vp.items()}
def rep(a, b, n=1):
    global s
    assert s.count(a) == n, (s.count(a), a[:160])
    s = s.replace(a, b)

# 1. the count: a plain line by default, with the map's centre dot
rep("""  const CNT = () => document.documentElement.dataset.cnt || 'head';""",
"""  const CNT = () => document.documentElement.dataset.cnt || 'line';
  const DOTMARK = '<svg class="ic dot" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="4.4" fill="currentColor" stroke="var(--panel)" stroke-width="1.6"/></svg>';
  const countLine = (n, m) => { const c = n - m;
    return `<div class="cc-flagrow cc-countrow">${DOTMARK}<span><b>${fmt(c)}</b> ${HE ? (c === 1 ? 'מוסד' : 'מוסדות') : c === 1 ? 'center' : 'centers'}</span>${m ? `<span class="cc-gap"></span>${icon('mush')}<span><b class="mu">${fmt(m)}</b> ${HE ? (m === 1 ? 'פטרייה' : 'פטריות') : m === 1 ? 'mushroom' : 'mushrooms'}</span>` : ''}</div>`; };""")
rep("""  const ccTiles = (n, m) => CNT() === 'line' ? `<div class="cc-flagrow cc-countrow">${PIN}<span>${countText(n, m)}</span></div>` : """,
    """  const ccTiles = (n, m) => CNT() === 'line' ? countLine(n, m) : """)

# 2. no head-shliach photo where the vaad comes first (not on the flagship's card either)
rep("""  const photoIf = (s, list) => { if (!s || !HEAD_PHOTO.has(s.id) || !list) return '';""",
    """  const photoIf = (s, list) => { if (!s || s.vaadFirst || !HEAD_PHOTO.has(s.id) || !list) return '';""")

# 3. the vaad: its faces in a honeycomb, its name, its members; then the head shliach as a plain line
rep("""  const vaadHTML = (s) => membersHTML(s, `${tr('Leadership')}: ${esc(s.vaad)}`);""",
"""  const vaadHTML = (s) => membersHTML(s, `${tr('Leadership')}: ${esc(s.vaad)}`);
  const VAAD_PHOTOS = __VAAD__;
  // the faces in rows of a honeycomb (each row offset half a face from the next), its head in the middle
  const HIVE_ROWS = { 1: [1], 2: [2], 3: [2, 1], 4: [2, 2], 5: [2, 3], 6: [3, 3], 7: [2, 3, 2], 8: [3, 2, 3], 9: [3, 3, 3] };
  function hiveHTML(s, t) {
    const ph = (VAAD_PHOTOS[s.id] || []).filter((p) => p.role !== 'Alternate'), head = (s.vaadMembers || []).find((m) => m.role === 'Head');
    const hn = head ? `${head.firstName} ${head.lastName}` : '';
    const hi = ph.findIndex((p) => p.name && hn && p.name.includes(head.lastName));
    const rows = HIVE_ROWS[ph.length] || [ph.length], F = 34, P = 39, V = 34;
    const widest = Math.max(...rows), W = F + (widest - 1) * P + (rows.some((r) => r !== widest) ? 0 : P / 2), H = F + (rows.length - 1) * V;
    const spots = [];
    const even = rows.every((r) => r === widest);
    rows.forEach((r, ri) => { for (let i = 0; i < r; i++) spots.push({ x: even ? i * P + (ri % 2 ? P / 2 : 0) : (W - (F + (r - 1) * P)) / 2 + i * P, y: ri * V }); });
    // the middle spot for the head; the rest in order
    const mid = spots.reduce((b, p, i) => (Math.hypot(p.x - (W - F) / 2, p.y - (H - F) / 2) < Math.hypot(spots[b].x - (W - F) / 2, spots[b].y - (H - F) / 2) ? i : b), 0);
    const order = hi >= 0 ? [hi, ...ph.map((_, i) => i).filter((i) => i !== hi)] : ph.map((_, i) => i);
    const at = hi >= 0 ? [mid, ...spots.map((_, i) => i).filter((i) => i !== mid)] : spots.map((_, i) => i);
    const imgs = order.map((pi, k) => { const p = ph[pi], sp = spots[at[k]], hd = pi === hi;
      return `<img class="${hd ? 'hd' : ''}" src="${p.file}" alt="${esc(p.name || '')}" title="${esc(p.name || '')}" style="inset-inline-start:${sp.x}px;top:${sp.y}px">`; }).join('');
    return `<div class="cc-hive" style="width:${W}px;height:${H}px;--t:${t}">${imgs}</div>`;
  }
  function vaadBlock(s, t) {
    const n = (s.vaadMembers || []).filter((m) => m.role !== 'Alternate').length;
    return `<div class="cc-vaad">${VAAD_PHOTOS[s.id] ? hiveHTML(s, t) : ''}<div class="cc-vtext"><span class="lbl">${tr('Leadership')}</span><b>${esc(s.vaad)}</b>${
      membersHTML(s, n ? `${n} ${HE ? 'חברים' : 'members'}` : (HE ? 'חברים' : 'Members'))}</div></div>`;
  }
  const headRow = (s) => `<div class="cc-flagrow cc-headrow">${PERSON_ICON}<span><span class="lbl">${esc(s.headTitle || tr('Head shliach'))}:</span> ${headHTML(s.headShliach)}</span></div>`;""".replace('__VAAD__', json.dumps(VAAD, ensure_ascii=False)))
rep("""        : s.headShliach && s.vaad && s.vaadFirst ? `${vaadHTML(s)}${lead(esc(s.headTitle || tr('Head shliach')), s.headShliach, HEAD_PHOTO.has(s.id) ? s.id : '')}`""",
    """        : s.headShliach && s.vaad && s.vaadFirst ? `${vaadBlock(s, t)}${headRow(s)}`""")

# 4. how it looks
rep("""#card .cc-count { display: inline-flex;""",
"""#card .cc-countrow { align-items: center; color: var(--muted); }
#card .cc-countrow span { color: var(--muted); }
#card .cc-countrow .ic.dot { width: 14px; height: 14px; margin-top: 0; color: #163e74; }
:root[data-theme="dark"] #card .cc-countrow .ic.dot { color: #8db5ee; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) #card .cc-countrow .ic.dot { color: #8db5ee; } }
#card .cc-countrow .ic:not(.dot) { margin-top: 0; color: var(--mush); }
#card .cc-gap { width: 6px; }
#card .cc-vaad { display: flex; align-items: center; gap: 15px; margin-bottom: 4px; }
#card .cc-hive { position: relative; flex: none; }
#card .cc-hive img { position: absolute; width: 34px; height: 34px; border-radius: 50%%; object-fit: cover; background: var(--panel);
  box-shadow: 0 0 0 2px var(--panel), 0 1px 4px rgba(0,0,0,.22); }
#card .cc-hive img.hd { box-shadow: 0 0 0 2px var(--panel), 0 0 0 3.5px color-mix(in srgb, var(--t) 75%%, var(--ink) 25%%), 0 1px 4px rgba(0,0,0,.22); }
#card .cc-vtext { min-width: 0; }
#card .cc-vtext > .lbl { display: block; margin-bottom: 1px; color: var(--muted); font: 700 10px/1.4 var(--font-map); letter-spacing: .08em; text-transform: uppercase; }
:root[lang="he"] #card .cc-vtext > .lbl { font-size: 11px; letter-spacing: 0; }
#card .cc-vtext > b { display: block; color: var(--ink); font: 600 16px/1.25 var(--font-ui); }
#card .cc-vtext details.vaad { margin-top: 4px; }
#card .cc-vtext details.vaad > summary { color: var(--accent); font-size: 13px; }
#card .cc-headrow .pi { flex: none; width: 14px; height: 14px; margin-top: 2px; color: var(--muted); }
#card .cc-headrow .lbl { color: var(--muted); }
#card .cc-count { display: inline-flex;""".replace('%%', '%'))
os.makedirs(f'{S}/proto7', exist_ok=True)
open(f'{S}/proto7/index.html', 'w', encoding='utf-8').write(s)
print('proto7 written')
