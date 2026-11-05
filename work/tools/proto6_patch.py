# proto6: proto5 (photos) without the grey "N centers" box (owner, Nov 5: "why is there that long gray box only for it
# to be all the way on the side? ... I don't think the box works"). Three ways to show the count, picked by
# document.documentElement.dataset.cnt: 'head' (under the name, in the header), 'line' (a plain line like Flagship),
# 'zoom' (in the Zoom in button); 'box' = as before. Reads proto5/index.html, writes proto6/index.html. Preview only.
import os
S = '/tmp/claude-0/-home-user-shetachim/6dfe7d99-9185-570e-b237-1d68bcc4daf7/scratchpad'
s = open(f'{S}/proto5/index.html', encoding='utf-8').read()
def rep(a, b, n=1):
    global s
    assert s.count(a) == n, (s.count(a), a[:160])
    s = s.replace(a, b)

# 1. the count as text, and the box only when asked for
rep("""  const ccTiles = (n, m) => `<div class="cc-tiles">""",
"""  const CNT = () => document.documentElement.dataset.cnt || 'head';
  const PIN = '<svg class="ic" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.6a4.6 4.6 0 0 0-4.6 4.6c0 3.5 4.6 8.3 4.6 8.3s4.6-4.8 4.6-8.3A4.6 4.6 0 0 0 8 1.6zm0 6.3a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4z" fill="currentColor"/></svg>';
  const countText = (n, m) => { const c = n - m;
    return `<b>${fmt(c)}</b> ${HE ? (c === 1 ? 'מוסד' : 'מוסדות') : c === 1 ? 'center' : 'centers'}${m ? `<span class="cc-dot">·</span><b class="mu">${fmt(m)}</b> ${HE ? (m === 1 ? 'פטרייה' : 'פטריות') : m === 1 ? 'mushroom' : 'mushrooms'}` : ''}`; };
  const headCount = (n, m) => (CNT() === 'head' ? `<span class="cc-count">${countText(n, m)}</span>` : '');
  const zoomCount = (n, m) => (CNT() === 'zoom' ? `<span class="cc-dot">·</span>${countText(n, m)}` : '');
  const ccTiles = (n, m) => CNT() === 'line' ? `<div class="cc-flagrow cc-countrow">${PIN}<span>${countText(n, m)}</span></div>` : CNT() !== 'box' ? '' : `<div class="cc-tiles">""")

# 2. a shetach's card: the count under its name, or in its Zoom in button
rep("""    return `${ccHead({ t, mini, kick: `<p class="cc-kick">${tr('Shetach')}</p>`, title: esc(s.name), sub: s.altName ? esc(s.altName) : '', big: true })}""",
"""    const nC = centersInShetach(s), nM = mushroomsInShetach(s);
    return `${ccHead({ t, mini, kick: `<p class="cc-kick">${tr('Shetach')}</p>`, title: esc(s.name), sub: [s.altName ? esc(s.altName) : '', headCount(nC, nM)].filter(Boolean).join('<br>'), big: true })}""")
rep("""      ${ccTiles(centersInShetach(s), mushroomsInShetach(s))}</div>
      <div class="cc-foot">${zoomBtn.replace('class="zoomto"', 'class="cc-act zoomto"').replace(/>([^<]*)<\\/button>$/, `>${icon('zoom')}<span class="lab">$1</span></button>`)}</div>`;""",
"""      ${ccTiles(nC, nM)}</div>
      <div class="cc-foot">${zoomBtn.replace('class="zoomto"', 'class="cc-act zoomto"').replace(/>([^<]*)<\\/button>$/, `>${icon('zoom')}<span class="lab">$1${zoomCount(nC, nM)}</span></button>`)}</div>`;""")

# 3. a state's card and a sub-shetach's card: the same
rep("""      return `${ccHead({ t: 'var(--tile)', mini, kick: `<p class="cc-kick">${areaKind(p)}</p>`, title: esc(p.name), big: true })}""",
"""      return `${ccHead({ t: 'var(--tile)', mini, kick: `<p class="cc-kick">${areaKind(p)}</p>`, title: esc(p.name), sub: headCount(centers, mush), big: true })}""")
rep("""title: esc(HE ? s.nameHe || s.name : s.name), big: true })}
      <div class="cc-body"><div class="cc-lead">${s.vaad ? membersHTML(""",
"""title: esc(HE ? s.nameHe || s.name : s.name), sub: headCount(n, m), big: true })}
      <div class="cc-body"><div class="cc-lead">${s.vaad ? membersHTML(""")

# 4. how it looks: quiet text, the numbers bold; mushrooms in their colour
rep("""#card .cc-tiles { display: flex; gap: 8px; margin-top: 13px; }""",
"""#card .cc-count { display: inline-flex; flex-wrap: wrap; align-items: baseline; gap: 0 4px; margin-top: 2px; color: var(--muted); font-size: 13.5px; }
#card .cc-count b, #card .cc-countrow b, #card .cc-act .lab b { color: var(--ink); font-weight: 700; font-variant-numeric: tabular-nums; }
#card .cc-count b.mu, #card .cc-countrow b.mu { color: var(--mush); }
#card .cc-dot { margin: 0 5px; color: var(--muted); opacity: .7; }
#card .cc-countrow .ic { color: var(--muted); }
#card .cc-act .lab b { color: inherit; }
#card .cc-tiles { display: flex; gap: 8px; margin-top: 13px; }""")
os.makedirs(f'{S}/proto6', exist_ok=True)
open(f'{S}/proto6/index.html', 'w', encoding='utf-8').write(s)
print('proto6 written')
