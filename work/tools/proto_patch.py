import sys
p=sys.argv[1]
s=open(p,encoding='utf-8').read()
def rep(a,b,count=1):
    global s
    assert s.count(a)==count, (s.count(a), a[:160])
    s=s.replace(a,b)

rep("""  --honor: #8a6a1e; --honor-line: #c39a3e; --honor-soft: #f6efdc; /* the honorary cards' gold: its text, its rules and dots, its panels */
""","""  --honor: #8a6a1e; --honor-line: #c39a3e; --honor-soft: #f6efdc; /* the honorary cards' gold: its text, its rules and dots, its panels */
  --tint-center: #e9eef2; --mush: #b3261e; --mush-soft: #fbeceb; --sub-ink: #59408f; --sub-soft: #eee8f8; --tile: #f0f3f5; /* the other cards' headers and tiles */
""")
if "--tint-center: #1d2a31" not in s:
    for ind in ("    ", "  "):
        a=f"\n{ind}--honor: #e0c278; --honor-line: #c9a24a; --honor-soft: #2b2a20;\n"
        assert s.count(a)==1, ind
        s=s.replace(a, a+f"{ind}--tint-center: #1d2a31; --mush: #f2857a; --mush-soft: #35211f; --sub-ink: #c3aef0; --sub-soft: #29233a; --tile: #1b282e;\n")

rep("""#card .mosad-body a { display: inline-block; margin-top: 6px; font-size: 12.5px; }
""","""#card .mosad-body a { display: inline-block; margin-top: 6px; font-size: 12.5px; }
/* ---- every other card, in the same family (owner, Nov 4: "maybe there's smth you can do with all the cards overall as
   well as capital cards (and even mushroom cards seperately) … rn everything is super super plain"): a header tinted by
   kind (a center grey-blue, a flagship navy with its star, a mushroom red with its mushroom, a shetach its own map
   colour, a sub-shetach lilac), the people in ink, the page as a small button, numbers as tiles ---- */
#card .hc-head { background: linear-gradient(180deg, var(--head-tint, var(--honor-soft)), var(--panel) 92%); }
#card .hc-head.k-center, #card .hc-head.k-area { --head-tint: var(--tint-center); }
#card .hc-head.k-capital { --head-tint: var(--accent-soft); }
#card .hc-head.k-mush { --head-tint: var(--mush-soft); }
#card .hc-head.k-sub { --head-tint: var(--sub-soft); }
#card .hc-head.k-center .kicker, #card .hc-head.k-shetach .kicker, #card .hc-head.k-area .kicker { color: var(--muted); }
#card .hc-head.k-capital .kicker { color: var(--accent); }
#card .hc-head.k-mush .kicker { color: var(--mush); }
#card .hc-head.k-sub .kicker { color: var(--sub-ink); }
#card .hc-head.k-center h2, #card .hc-head.k-capital h2, #card .hc-head.k-mush h2, #card .hc-head.k-area h2, #card .hc-head.k-sub h2 { font-size: 18px; line-height: 1.22; }
#card .hc-head.k-shetach h2 { font-size: 21px; line-height: 1.15; }
#card .kicker .ic { display: inline-block; width: 11px; height: 11px; vertical-align: -1px; margin-inline-end: 4px; }
#card .hc-place { display: flex; align-items: center; gap: 5px; margin: 5px 0 0; color: var(--muted); font-size: 13px; }
#card .hc-place .ic { width: 13px; height: 13px; flex: none; }
#card .c-people .person { margin: 0 0 1px; color: var(--ink); font-size: 14px; font-weight: 500; }
#card .c-people .person .meta { font-weight: 400; }
#card .c-people .personnel summary { display: inline-block; margin-top: 3px; padding: 1px 9px; border-radius: 999px; background: var(--tile); font-size: 12px; }
#card .c-link { margin-top: 10px; }
#card .c-link a { display: inline-flex; align-items: center; gap: 5px; padding: 4px 11px; border: 1px solid var(--panel-line); border-radius: 999px; font-size: 12.5px; font-weight: 500; text-decoration: none; pointer-events: auto; }
#card .c-link a:hover { border-color: var(--accent); }
#card .c-link .ic { width: 11px; height: 11px; }
#card .net-box { margin: 0 0 10px; padding: 9px 11px; border-radius: 8px; border-inline-start: 3px solid var(--mush); background: var(--mush-soft); }
#card .net-box .network { margin: 0; color: var(--ink); font-size: 13px; }
#card .net-box .net-show { margin-top: 7px; background: var(--panel); }
#card .sw { display: inline-block; width: 9px; height: 9px; margin-inline-end: 6px; border-radius: 3px; box-shadow: inset 0 0 0 1px rgb(0 0 0 / .14); }
#card .lead p { margin: 0 0 8px; color: var(--ink); }
#card .lead .lbl { display: block; margin-bottom: 2px; color: var(--muted); font: 700 10.5px/1.3 var(--font-map); letter-spacing: .08em; text-transform: uppercase; }
:root[lang="he"] #card .lead .lbl { font-size: 12px; letter-spacing: 0; }
#card .lead .who { display: block; color: var(--ink); font: 700 16px/1.3 var(--font-map); }
#card .lead details.vaad { margin-bottom: 8px; }
#card .stats { display: flex; gap: 8px; margin: 10px 0 2px; }
#card .stat { flex: 1; min-width: 0; padding: 8px 10px; border-radius: 8px; background: var(--tile); }
#card .stat b { display: block; color: var(--ink); font: 700 18px/1.1 var(--font-map); font-variant-numeric: tabular-nums; }
#card .stat span { display: block; margin-top: 2px; color: var(--muted); font-size: 12px; }
#card .stat.mush b { color: var(--mush); }
#card .cap-line { display: flex; align-items: center; gap: 6px; margin: 8px 0 0; color: var(--ink); font-size: 13px; }
#card .cap-line .ic { width: 12px; height: 12px; flex: none; color: var(--accent); }
#card .cap-flag { display: inline-flex; align-items: center; gap: 5px; margin-top: 6px; padding: 2px 9px; border-radius: 999px; background: var(--accent-soft); color: var(--accent); font-size: 12px; font-weight: 600; }
#card .cap-flag .ic { width: 11px; height: 11px; }
/* several listings at one address: each its own section */
#card .listing { padding: 11px 0 10px; border-top: 1px solid var(--panel-line); }
#card .listing:first-of-type { padding-top: 0; border-top: 0; }
#card .listing .kicker { margin-bottom: 1px; }
#card .listing h3 { margin: 0 0 2px; color: var(--ink); font: 600 15px/1.3 var(--font-ui); }
#card .listing > .meta { display: block; margin-bottom: 4px; }
#card .listing.k-mush { padding-inline-start: 10px; border-inline-start: 3px solid var(--mush); }
#card .listing .c-link { margin-top: 7px; }
""")

rep("""  // A shetach's flagship center; 770 (world HQ) gets its own wording rather than "of New York City".""","""  // The other cards' small marks (drawn when a card is: the mushroom's shape is set further down)
  const icon = (k) => (k === 'pin' ? '<svg class="ic" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 14.6s4.6-4.3 4.6-8A4.6 4.6 0 0 0 3.4 6.6c0 3.7 4.6 8 4.6 8z" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="8" cy="6.5" r="1.6" fill="currentColor"/></svg>'
    : k === 'star' ? `<svg class="ic" viewBox="-7.5 -7.5 15 15" aria-hidden="true"><path d="${STAR}" fill="currentColor"/></svg>`
    : k === 'mush' ? `<svg class="ic" viewBox="0 0 16 16" aria-hidden="true"><path d="${MUSHROOM_CAP}" fill="currentColor"/><path d="${MUSHROOM_STEM}" fill="currentColor" opacity=".55"/></svg>`
    : '<svg class="ic" viewBox="0 0 16 16" aria-hidden="true"><path d="M6.5 3.5h-3v9h9v-3M9.5 3.5h3v3M12.5 3.5l-5 5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>');
  // a shetach's own colour on the map, as a small square (none on the plain map)
  function shetachTint(s) {
    if (!s || state.color === 'plain') return null;
    const i = shetachColor(groupOf(s.id));
    return i == null || i < 0 ? null : isPhysical() ? PHYS_TINTS[i] : `var(--c${i + 1})`;
  }
  const swatch = (s) => { const t = shetachTint(s); return t ? `<span class="sw" style="background:${t}"></span>` : ''; };
  const linkBtn = (c) => { const a = chabadLink(c); return a ? `<div class="c-link">${a.replace('</a>', ` ${icon('ext')}</a>`)}</div>` : ''; };
  const stat = (n, label, cls = '') => `<div class="stat${cls ? ` ${cls}` : ''}"><b>${fmt(n)}</b><span>${label}</span></div>`;
  // a shetach's (or sub-shetach's) numbers: its centers, and its mushrooms with Mushrooms on
  const statsHTML = (n, m) => `<div class="stats">${stat(n - m, HE ? (n - m === 1 ? 'מוסד' : 'מוסדות') : n - m === 1 ? 'center' : 'centers')}${m ? stat(m, HE ? (m === 1 ? 'פטרייה' : 'פטריות') : m === 1 ? 'mushroom' : 'mushrooms', 'mush') : ''}</div>`;
  // A shetach's flagship center; 770 (world HQ) gets its own wording rather than "of New York City".""")

rep("""  function dotHTML(d) {
    const n = d.centers.length;
    const items = d.centers.map((c) => {
      const cap = capitalOfCenter.get(c.id);
      return `<li>
        ${c.mushroom ? `<span class="kicker kicker-mushroom">${tr('Mushroom')}${c.networkFlagship && networks().has(c.network) ? ` · ${HE ? 'המוסד המרכזי של הרשת' : 'Network flagship'}` : ''}</span>` : ''}
        <strong>${esc(c.name)}</strong>
        <span class="meta">${esc([c.type, c.city].filter(Boolean).join(' · '))}</span>
        ${c.mushroom && c.network ? netLine(c) : ''}
        ${memorialHTML(c)}${personnelHTML(c.personnel)}
        ${cap ? `<span class="flag${cap.world ? ' flag-world' : ''}">${capKicker(cap)}</span>` : ''}
        ${chabadLink(c)}
      </li>`;
    }).join('');
    const head = n > 1 ? `<span class="kicker">${HE ? `${n} מוסדות בכתובת זו` : `${n} listings at this address`}</span><h2>${esc(d.centers[0].city || tr('Same address'))}</h2>` : '';
    // a mushroom isn't under the shetach's head: its card names no head shliach (owner, Oct 12)
    return `${head}<ul>${items}</ul><div class="foot"><span class="meta">${shetachLine(d.piece, !d.centers.some((c) => c.mushroom))}</span></div>`;
  }""","""  // A center's card: a header by kind — a mushroom red (its mark; "Network flagship" for its network's own), a shetach's
  // flagship navy (its star), any other center grey-blue (what it is above its name) — then its network (a mushroom's),
  // its people, its page, and the shetach it's in (its colour; no head shliach for a mushroom, owner, Oct 12). Several
  // at one address: the address on top, each listing a section of its own.
  const mushKicker = (c) => `${icon('mush')}${tr('Mushroom')}${c.networkFlagship && networks().has(c.network) ? ` · ${HE ? 'המוסד המרכזי של הרשת' : 'Network flagship'}` : ''}`;
  function centerBody(c, cap) {
    return `${c.mushroom && c.network ? `<div class="net-box">${netLine(c)}</div>` : ''}${memorialHTML(c)}<div class="c-people">${personnelHTML(c.personnel)}</div>${
      cap && !cap.world ? `<span class="cap-flag">${icon('star')}${capKicker(cap)}</span>` : cap ? `<span class="flag flag-world">${capKicker(cap)}</span>` : ''}${linkBtn(c)}`;
  }
  function dotHTML(d) {
    const n = d.centers.length, s = shetachOf(pieceById.get(d.piece));
    // a mushroom isn't under the shetach's head: its card names no head shliach (owner, Oct 12)
    const foot = `<div class="foot"><span class="meta">${swatch(s)}${shetachLine(d.piece, !d.centers.some((c) => c.mushroom))}</span></div>`;
    if (n === 1) {
      const c = d.centers[0], cap = capitalOfCenter.get(c.id), flag = cap && !cap.world;
      const kick = c.mushroom ? mushKicker(c) : flag ? `${icon('star')}${capKicker(cap)}` : c.type ? esc(c.type) : '';
      const place = (c.mushroom || flag ? [c.type, c.city] : [c.city]).filter(Boolean);
      return `<header class="hc-head ${c.mushroom ? 'k-mush' : flag ? 'k-capital' : 'k-center'}">${kick ? `<span class="kicker">${kick}</span>` : ''}<h2>${esc(c.name)}</h2>${
        place.length ? `<p class="hc-place">${icon('pin')}${esc(place.join(' · '))}</p>` : ''}</header>${centerBody(c, cap && cap.world ? cap : null)}${foot}`;
    }
    const items = d.centers.map((c) => `<section class="listing${c.mushroom ? ' k-mush' : ''}">${c.mushroom ? `<span class="kicker kicker-mushroom">${mushKicker(c)}</span>` : ''}<h3>${esc(c.name)}</h3>${
      c.type ? `<span class="meta">${esc(c.type)}</span>` : ''}${centerBody(c, capitalOfCenter.get(c.id))}</section>`).join('');
    return `<header class="hc-head k-center"><span class="kicker">${HE ? `${n} מוסדות בכתובת זו` : `${n} listings at this address`}</span><h2>${esc(d.centers[0].city || tr('Same address'))}</h2></header>${items}${foot}`;
  }""")

rep("""    return `<span class="kicker">${capKicker(c)}</span><h2>${esc(c.name)}</h2>${rebbeHTML(c.center)}
      ${c.city ? `<p>${esc(c.city)}</p>` : ''}${memorialHTML(c.center)}${personnelHTML(c.center && c.center.personnel)}${chabadLink(c.center)}
      <div class="foot"><span class="meta">${shetachLine(c.piece, true)}</span></div>`;""","""    // a shetach's flagship center: navy, its star, and a way to its shetach
    return `<header class="hc-head k-capital"><span class="kicker">${icon('star')}${capKicker(c)}</span><h2>${esc(c.name)}</h2>${
      c.city ? `<p class="hc-place">${icon('pin')}${esc(c.city)}</p>` : ''}</header>${rebbeHTML(c.center)}
      ${memorialHTML(c.center)}<div class="c-people">${personnelHTML(c.center && c.center.personnel)}</div>${linkBtn(c.center)}
      <div class="foot"><span class="meta">${swatch(c.s)}${shetachLine(c.piece, true)}</span>${c.s ? `<button type="button" class="zoomto" data-shetach="${esc(c.s.id)}">${tr('Zoom in')}</button>` : ''}</div>`;""")

rep("""    const capital = caps.map((c) => `<p>${tr('Capital')}${c.for ? ` (${esc(c.for)})` : ''}: ${esc(c.name)}${c.city ? `, ${esc(c.city)}` : ''}</p>`).join('');
""","")
rep("""    return `<h2>${esc(s.name)}</h2>${s.altName ? `<p class="alt-name">${esc(s.altName)}</p>` : ''}
      ${s.territoryOf && shetachById.get(s.territoryOf) ? (() => { const p = shetachById.get(s.territoryOf); return `<p>${HE ? 'בהנהגת' : 'Overseen by'} ${headHTML(p.headShliach)}</p>`; })()
        : s.noCentralLeadership ? `<p>${tr('No centralized leadership')}</p>`
        : s.headShliach && / family$|^משפחת /.test(s.headShliach) ? `<p>${HE ? 'שלוחים' : 'Shluchim'}: ${headHTML(s.headShliach)}</p>`
        : s.headShliach && s.vaad && s.vaadFirst ? `${vaadHTML(s)}<p>${esc(s.headTitle || tr('Head shliach'))}: ${headHTML(s.headShliach)}</p>`
        : s.headShliach && !s.vaad && s.vaadMembers ? membersHTML(s, `${esc(s.headTitle || tr('Head shliach'))}: ${headHTML(s.headShliach)}`)
        : s.headShliach ? `<p>${esc(s.headTitle || tr('Head shliach'))}: ${headHTML(s.headShliach)}</p>${s.vaad ? vaadHTML(s) : ''}` : ''}${capital}
      <div class="foot"><span class="meta">${counts(centersInShetach(s), mushroomsInShetach(s))}</span>${zoomBtn}</div>`;""","""    // its header in its own colour on the map; who leads it (the title small, the name big); its capital; its numbers
    const tint = shetachTint(s), lead = (label, who) => `<p><span class="lbl">${label}</span><span class="who">${who}</span></p>`;
    const capital = caps.map((c) => `<p class="cap-line">${icon('star')}<span>${tr('Capital')}${c.for ? ` (${esc(c.for)})` : ''}: ${esc(c.name)}${c.city ? `, ${esc(c.city)}` : ''}</span></p>`).join('');
    return `<header class="hc-head k-shetach"${tint ? ` style="--head-tint:${tint}"` : ''}><span class="kicker">${tr('Shetach')}</span><h2>${esc(s.name)}</h2>${s.altName ? `<p class="alt-name">${esc(s.altName)}</p>` : ''}</header>
      <div class="lead">${s.territoryOf && shetachById.get(s.territoryOf) ? (() => { const p = shetachById.get(s.territoryOf); return lead(HE ? 'בהנהגת' : 'Overseen by', headHTML(p.headShliach)); })()
        : s.noCentralLeadership ? `<p><span class="who">${tr('No centralized leadership')}</span></p>`
        : s.headShliach && / family$|^משפחת /.test(s.headShliach) ? lead(HE ? 'שלוחים' : 'Shluchim', headHTML(s.headShliach))
        : s.headShliach && s.vaad && s.vaadFirst ? `${vaadHTML(s)}${lead(esc(s.headTitle || tr('Head shliach')), headHTML(s.headShliach))}`
        : s.headShliach && !s.vaad && s.vaadMembers ? membersHTML(s, `${esc(s.headTitle || tr('Head shliach'))}: ${headHTML(s.headShliach)}`)
        : s.headShliach ? `${lead(esc(s.headTitle || tr('Head shliach')), headHTML(s.headShliach))}${s.vaad ? vaadHTML(s) : ''}` : ''}</div>${capital}
      ${statsHTML(centersInShetach(s), mushroomsInShetach(s))}
      <div class="foot"><span class="meta"></span>${zoomBtn}</div>`;""")

rep("""    return `<span class="kicker">${tr('Sub-shetach')}</span><h2>${esc(HE ? s.nameHe || s.name : s.name)}</h2>""",
    """    return `<header class="hc-head k-sub"><span class="kicker">${tr('Sub-shetach')}</span><h2>${esc(HE ? s.nameHe || s.name : s.name)}</h2></header>""")

rep("""      return `<span class="kicker">${areaKind(p)}</span><h2>${esc(p.name)}</h2>${part}
        <div class="foot"><span class="meta">${counts(centers, mush)}</span>${zoomBtn}</div>`;""","""      return `<header class="hc-head k-area"><span class="kicker">${areaKind(p)}</span><h2>${esc(p.name)}</h2></header>${part}
        ${statsHTML(centers, mush)}<div class="foot"><span class="meta"></span>${zoomBtn}</div>`;""")

rep("""'Sub-shetachim': 'תת־שטחים', 'Sub-shetach': 'תת־שטח',""","""'Sub-shetachim': 'תת־שטחים', 'Sub-shetach': 'תת־שטח', Shetach: 'שטח',""")
open(p,'w',encoding='utf-8').write(s)
print('patched')
