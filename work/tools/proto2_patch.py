import sys
p=sys.argv[1]
s=open(p,encoding='utf-8').read()
def rep(a,b,count=1):
    global s
    assert s.count(a)==count, (s.count(a), a[:160])
    s=s.replace(a,b)

# ---------- tokens ----------
rep("""  --honor: #8a6a1e; --honor-line: #c39a3e; --honor-soft: #f6efdc; /* the honorary cards' gold: its text, its rules and dots, its panels */
""","""  --honor: #8a6a1e; --honor-line: #c39a3e; --honor-soft: #f6efdc; /* the honorary cards' gold: its text, its rules and dots, its panels */
  --mush: #b3261e; --mush-soft: #fbeceb; --tile: #eff2f4; --sub: #6a4fb0; /* the everyday cards: a mushroom's red, a quiet tile, a sub-shetach's lilac */
""")
for ind in ("    ", "  "):
    a=f"\n{ind}--honor: #e0c278; --honor-line: #c9a24a; --honor-soft: #2b2a20;\n"
    assert s.count(a)==1, ind
    s=s.replace(a, a+f"{ind}--mush: #f2857a; --mush-soft: #3a2220; --tile: #1d2a30; --sub: #b49be8;\n")

# ---------- CSS ----------
rep("""#card .mosad-body a { display: inline-block; margin-top: 6px; font-size: 12.5px; }
""","""#card .mosad-body a { display: inline-block; margin-top: 6px; font-size: 12.5px; }
/* ---- the everyday cards, designed from scratch (owner, Nov 4: "think about it in a from scratch mindset"): compact,
   the name first; a badge only for what's special (a shetach's flagship, a mushroom); the shliach; the buttons in one
   row; the shetach it's in as a chip in that shetach's colour on the map. A shetach's own card: a band of its colour,
   its head big, its numbers and "Zoom in" in one row. (The honorary cards keep their tinted header and gold.) ---- */
#card .cc-badge { display: inline-flex; align-items: center; gap: 5px; margin: 0 0 7px; padding: 2px 9px 2px 7px; border-radius: 999px; font: 700 10.5px/1.6 var(--font-map); letter-spacing: .05em; text-transform: uppercase; }
:root[lang="he"] #card .cc-badge { font-size: 11.5px; letter-spacing: 0; }
#card .cc-badge .ic { width: 11px; height: 11px; flex: none; }
#card .cc-badge.flag { background: var(--accent-soft); color: var(--accent); }
#card .cc-badge.mush { background: var(--mush-soft); color: var(--mush); }
#card .cc-badge.quiet { background: var(--tile); color: var(--muted); }
#card .cc-label { display: block; margin: 0 0 1px; color: var(--muted); font: 700 10.5px/1.4 var(--font-map); letter-spacing: .08em; text-transform: uppercase; }
:root[lang="he"] #card .cc-label { font-size: 12px; letter-spacing: 0; }
#card h2.cc-name { margin: 0 0 3px; margin-inline-end: 24px; color: var(--ink); font: 650 17.5px/1.25 var(--font-ui); letter-spacing: -.005em; }
#card h2.cc-name.big { font-size: 21px; line-height: 1.15; letter-spacing: -.01em; }
#card .cc-meta { margin: 0; color: var(--muted); font-size: 13px; }
#card .cc-people { margin-top: 10px; }
#card .cc-people .person { margin: 0; color: var(--ink); font-size: 14px; font-weight: 500; }
#card .cc-people .person .meta { font-weight: 400; }
#card .cc-people .personnel summary { display: inline-block; margin-top: 3px; font-size: 12.5px; }
#card .cc-net { display: flex; align-items: center; gap: 8px; margin: 10px 0 0; color: var(--ink); font-size: 13px; }
#card .cc-net::before { content: ''; flex: none; width: 18px; border-top: 2px dashed var(--mush); } /* the network's lines on the map */
#card .cc-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-top: 12px; }
#card .cc-actions .cc-btn { display: inline-flex; align-items: center; gap: 5px; height: 28px; margin: 0; padding: 0 11px; border: 1px solid var(--panel-line); border-radius: 999px; background: var(--panel); color: var(--ink); font: 500 12.5px/1 var(--font-ui); text-decoration: none; cursor: pointer; pointer-events: auto; }
#card .cc-actions .cc-btn:hover { border-color: var(--accent); color: var(--accent); }
#card .cc-actions .cc-btn .ic { width: 12px; height: 12px; }
#card .cc-actions .cc-btn.mush { border-color: color-mix(in srgb, var(--mush) 45%, var(--panel-line)); color: var(--mush); }
#card .cc-chip { display: flex; align-items: center; gap: 6px; margin-top: 12px; padding: 7px 10px; border-radius: 8px; background: var(--chip, var(--tile)); color: var(--ink); font-size: 12.5px; line-height: 1.35; }
#card .cc-chip b { font-weight: 650; }
/* several listings at one address: a compact row each, its page as a small button at its end */
#card .cc-row { padding: 10px 0; border-top: 1px solid var(--panel-line); }
#card .cc-row:first-of-type { margin-top: 8px; }
#card .cc-row-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
#card .cc-row h3 { margin: 0; color: var(--ink); font: 600 14.5px/1.3 var(--font-ui); }
#card .cc-row .cc-badge { margin: 4px 0 0; }
#card .cc-row .cc-people { margin-top: 5px; }
#card .cc-row .cc-people .person { font-size: 13.5px; }
#card .cc-row.mush { padding-inline-start: 10px; border-inline-start: 3px solid var(--mush); }
#card .cc-ico { flex: none; display: grid; place-items: center; width: 26px; height: 26px; border: 1px solid var(--panel-line); border-radius: 999px; color: var(--accent); pointer-events: auto; }
#card .cc-ico:hover { border-color: var(--accent); }
#card .cc-ico .ic { width: 12px; height: 12px; }
#card .cc-row ~ .cc-chip { margin-top: 2px; }
/* a shetach's (or sub-shetach's, or a country's) card */
#card .cc-band { height: 7px; margin: -10px -12px 11px; border-radius: 9px 9px 0 0; background: var(--chip, var(--tile)); }
#card .cc-lead { margin: 10px 0 0; }
#card .cc-lead p { margin: 0 0 6px; color: var(--ink); }
#card .cc-lead .lbl { display: block; color: var(--muted); font: 700 10.5px/1.4 var(--font-map); letter-spacing: .08em; text-transform: uppercase; }
:root[lang="he"] #card .cc-lead .lbl { font-size: 12px; letter-spacing: 0; }
#card .cc-lead .who { display: block; color: var(--ink); font: 650 16px/1.3 var(--font-ui); }
#card .cc-lead details.vaad { margin: 0 0 8px; }
#card .cc-flagline { display: flex; align-items: center; gap: 6px; margin: 2px 0 0; color: var(--ink); font-size: 13px; }
#card .cc-flagline .ic { width: 12px; height: 12px; flex: none; color: var(--accent); }
#card .cc-stats { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-top: 12px; }
#card .cc-stat { display: inline-flex; align-items: baseline; gap: 5px; height: 28px; padding: 0 10px; border-radius: 8px; background: var(--tile); color: var(--muted); font-size: 12.5px; line-height: 28px; }
#card .cc-stat b { color: var(--ink); font: 700 15px/1 var(--font-map); font-variant-numeric: tabular-nums; }
#card .cc-stat.mush b { color: var(--mush); }
#card .cc-stats .cc-btn { margin-inline-start: auto; }
#card .cc-area-lines .cc-chip { margin-top: 8px; }
""")

# ---------- JS helpers ----------
rep("""  // A shetach's flagship center; 770 (world HQ) gets its own wording rather than "of New York City".""","""  // The everyday cards' small marks (drawn when a card is: the mushroom's shape is set further down)
  const icon = (k) => (k === 'star' ? `<svg class="ic" viewBox="-7.5 -7.5 15 15" aria-hidden="true"><path d="${STAR}" fill="currentColor"/></svg>`
    : k === 'mush' ? `<svg class="ic" viewBox="0 0 16 16" aria-hidden="true"><path d="${MUSHROOM_CAP}" fill="currentColor"/><path d="${MUSHROOM_STEM}" fill="currentColor" opacity=".55"/></svg>`
    : k === 'zoom' ? '<svg class="ic" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.6" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M10.4 10.4l3.6 3.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'
    : '<svg class="ic" viewBox="0 0 16 16" aria-hidden="true"><path d="M6.5 3.5h-3v9h9v-3M9.5 3.5h3v3M12.5 3.5l-5 5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>');
  // a shetach's own colour on the map (none on the plain map)
  function shetachTint(s) {
    if (!s || state.color === 'plain') return null;
    const i = shetachColor(groupOf(s.id));
    return i == null || i < 0 ? null : isPhysical() ? PHYS_TINTS[i] : `var(--c${i + 1})`;
  }
  const tintStyle = (t) => (t ? ` style="--chip:${t}"` : '');
  // a center's own page (chabad.org's, or its own site's): a button with its words, or a small round one in a list
  const pageOf = (c) => { const m = /href="([^"]+)"[^>]*>([^<]+)</.exec(chabadLink(c) || ''); return m ? { href: m[1], label: m[2] } : null; };
  const pageBtn = (c) => { const p = pageOf(c); return p ? `<a class="cc-btn" href="${p.href}" target="_blank" rel="noopener">${p.label}${icon('ext')}</a>` : ''; };
  const pageIco = (c) => { const p = pageOf(c); return p ? `<a class="cc-ico" href="${p.href}" target="_blank" rel="noopener" title="${p.label}" aria-label="${p.label}">${icon('ext')}</a>` : ''; };
  // the shetach a place is in, as a chip in its colour: its name bold, then its vaad and head (a mushroom's: grey, the
  // area's name only — a mushroom isn't under the shetach's head, owner, Oct 12)
  function shetachChip(pieceId, withHead) {
    const g = pieceById.get(pieceId), s = g && shetachOf(g), line = shetachLine(pieceId, withHead);
    if (!line) return '';
    const i = line.indexOf(' · ');
    return `<div class="cc-chip"${tintStyle(withHead ? shetachTint(s) : null)}>${i > 0 ? `<b>${line.slice(0, i)}</b>${line.slice(i)}` : `<b>${line}</b>`}</div>`;
  }
  const chipOf = (s) => `<div class="cc-chip"${tintStyle(shetachTint(s))}>${(() => { const line = shetachWithHead(s), i = line.indexOf(' · '); return i > 0 ? `<b>${line.slice(0, i)}</b>${line.slice(i)}` : `<b>${line}</b>`; })()}</div>`;
  // numbers as small tiles, and the card's zoom at the end of their row
  const ccStat = (n, one, many, heOne, heMany, cls = '') => `<span class="cc-stat${cls ? ` ${cls}` : ''}"><b>${fmt(n)}</b>${HE ? (n === 1 ? heOne : heMany) : n === 1 ? one : many}</span>`;
  const ccStats = (n, m, zoom = '') => `<div class="cc-stats">${ccStat(n - m, 'center', 'centers', 'מוסד', 'מוסדות')}${m ? ccStat(m, 'mushroom', 'mushrooms', 'פטרייה', 'פטריות', 'mush') : ''}${zoom ? zoom.replace('class="zoomto"', 'class="cc-btn zoomto"').replace(/>([^<]*)<\\/button>$/, `>${icon('zoom')}$1</button>`) : ''}</div>`;
  // A shetach's flagship center; 770 (world HQ) gets its own wording rather than "of New York City".""")

# ---------- the center cards ----------
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
  }""","""  // A center's card (owner, Nov 4: "think about it in a from scratch mindset"): a badge only for what's special — a
  // shetach's flagship (its star), a mushroom (its mark; "Network flagship" for its network's own) — its name, what it
  // is and its town, its network (a mushroom's: the network's dashed line, its size), its people, its buttons in one
  // row (its page; a flagship's way to its shetach; a mushroom's Show network), and the shetach it's in as a chip.
  // Several at one address: the address on top, a compact row each.
  const ccBadge = (c, cap) => (c.mushroom ? `<span class="cc-badge mush">${icon('mush')}${tr('Mushroom')}${c.networkFlagship && networks().has(c.network) ? ` · ${HE ? 'המוסד המרכזי של הרשת' : 'Network flagship'}` : ''}</span>`
    : cap && !cap.world ? `<span class="cc-badge flag">${icon('star')}${capKicker(cap)}</span>` : '');
  const ccNet = (c) => { const n = c.mushroom && c.network && networks().get(c.network); const name = c.network && (HE ? c.networkHe || c.network : c.network);
    return c.mushroom && c.network ? `<p class="cc-net">${HE ? 'רשת' : 'Network'}: ${esc(name)}${n ? ` · ${esc(netCount(n))}` : ''}</p>` : ''; };
  const ccNetBtn = (c) => { const n = c.mushroom && c.network && networks().get(c.network); return n ? `<button type="button" class="cc-btn mush net-show" data-net="${esc(c.network)}" aria-pressed="${netPinned === n}">${netButton(n)}</button>` : ''; };
  function dotHTML(d) {
    const n = d.centers.length, mushy = d.centers.some((c) => c.mushroom);
    if (n === 1) {
      const c = d.centers[0], cap = capitalOfCenter.get(c.id), btns = `${ccNetBtn(c)}${pageBtn(c)}`;
      return `${ccBadge(c, cap)}<h2 class="cc-name">${esc(c.name)}</h2>${[c.type, c.city].some(Boolean) ? `<p class="cc-meta">${esc([c.type, c.city].filter(Boolean).join(' · '))}</p>` : ''}
        ${ccNet(c)}${memorialHTML(c)}<div class="cc-people">${personnelHTML(c.personnel)}</div>${btns ? `<div class="cc-actions">${btns}</div>` : ''}${shetachChip(d.piece, !mushy)}`;
    }
    const rows = d.centers.map((c) => {
      const cap = capitalOfCenter.get(c.id), nb = ccNetBtn(c);
      return `<section class="cc-row${c.mushroom ? ' mush' : ''}"><div class="cc-row-head"><div><h3>${esc(c.name)}</h3>${c.type ? `<p class="cc-meta">${esc(c.type)}</p>` : ''}</div>${pageIco(c)}</div>${ccBadge(c, cap)}
        ${ccNet(c)}${memorialHTML(c)}<div class="cc-people">${personnelHTML(c.personnel)}</div>${nb ? `<div class="cc-actions">${nb}</div>` : ''}</section>`;
    }).join('');
    return `<span class="cc-badge quiet">${HE ? `${n} מוסדות בכתובת זו` : `${n} listings at this address`}</span><h2 class="cc-name">${esc(d.centers[0].city || tr('Same address'))}</h2>${rows}${shetachChip(d.piece, !mushy)}`;
  }""")

# ---------- the flagship cards ----------
rep("""    return `<span class="kicker">${capKicker(c)}</span><h2>${esc(c.name)}</h2>${rebbeHTML(c.center)}
      ${c.city ? `<p>${esc(c.city)}</p>` : ''}${memorialHTML(c.center)}${personnelHTML(c.center && c.center.personnel)}${chabadLink(c.center)}
      <div class="foot"><span class="meta">${shetachLine(c.piece, true)}</span></div>`;""","""    // a shetach's flagship center: its star and its shetach's name, and a way to its shetach
    const zoom = c.s ? `<button type="button" class="cc-btn zoomto" data-shetach="${esc(c.s.id)}">${icon('zoom')}${HE ? 'התקרבות לשטח' : 'Zoom to the shetach'}</button>` : '';
    return `<span class="cc-badge flag">${icon('star')}${capKicker(c)}</span><h2 class="cc-name">${esc(c.name)}</h2>${[c.center && c.center.type, c.city].some(Boolean) ? `<p class="cc-meta">${esc([c.center && c.center.type, c.city].filter(Boolean).join(' · '))}</p>` : ''}${rebbeHTML(c.center)}
      ${memorialHTML(c.center)}<div class="cc-people">${personnelHTML(c.center && c.center.personnel)}</div><div class="cc-actions">${pageBtn(c.center)}${zoom}</div>${shetachChip(c.piece, true)}`;""")

# ---------- the shetach cards ----------
rep("""    // "Capital: …", or for a disputed shetach "Capital (Chaim Tzvi Groner): …", one per claimant
    const capital = caps.map((c) => `<p>${tr('Capital')}${c.for ? ` (${esc(c.for)})` : ''}: ${esc(c.name)}${c.city ? `, ${esc(c.city)}` : ''}</p>`).join('');
""","""    // "Flagship: …" (owner, Nov 4: "flagship rather than capital."), or for a disputed shetach "Flagship (Chaim Tzvi
    // Groner): …", one per claimant
    const capital = caps.map((c) => `<p class="cc-flagline">${icon('star')}<span>${tr('Flagship')}${c.for ? ` (${esc(c.for)})` : ''}: ${esc(c.name)}${c.city ? `, ${esc(c.city)}` : ''}</span></p>`).join('');
""")
rep("""    return `<h2>${esc(s.name)}</h2>${s.altName ? `<p class="alt-name">${esc(s.altName)}</p>` : ''}
      ${s.territoryOf && shetachById.get(s.territoryOf) ? (() => { const p = shetachById.get(s.territoryOf); return `<p>${HE ? 'בהנהגת' : 'Overseen by'} ${headHTML(p.headShliach)}</p>`; })()
        : s.noCentralLeadership ? `<p>${tr('No centralized leadership')}</p>`
        : s.headShliach && / family$|^משפחת /.test(s.headShliach) ? `<p>${HE ? 'שלוחים' : 'Shluchim'}: ${headHTML(s.headShliach)}</p>`
        : s.headShliach && s.vaad && s.vaadFirst ? `${vaadHTML(s)}<p>${esc(s.headTitle || tr('Head shliach'))}: ${headHTML(s.headShliach)}</p>`
        : s.headShliach && !s.vaad && s.vaadMembers ? membersHTML(s, `${esc(s.headTitle || tr('Head shliach'))}: ${headHTML(s.headShliach)}`)
        : s.headShliach ? `<p>${esc(s.headTitle || tr('Head shliach'))}: ${headHTML(s.headShliach)}</p>${s.vaad ? vaadHTML(s) : ''}` : ''}${capital}
      <div class="foot"><span class="meta">${counts(centersInShetach(s), mushroomsInShetach(s))}</span>${zoomBtn}</div>`;""","""    // a band of its colour on the map; who leads it (the title small, the name big); its flagship; its numbers and zoom
    const lead = (label, who) => `<p><span class="lbl">${label}</span><span class="who">${who}</span></p>`;
    return `<div class="cc-band"${tintStyle(shetachTint(s))}></div><span class="cc-label">${tr('Shetach')}</span><h2 class="cc-name big">${esc(s.name)}</h2>${s.altName ? `<p class="alt-name">${esc(s.altName)}</p>` : ''}
      <div class="cc-lead">${s.territoryOf && shetachById.get(s.territoryOf) ? (() => { const p = shetachById.get(s.territoryOf); return lead(HE ? 'בהנהגת' : 'Overseen by', headHTML(p.headShliach)); })()
        : s.noCentralLeadership ? `<p><span class="who">${tr('No centralized leadership')}</span></p>`
        : s.headShliach && / family$|^משפחת /.test(s.headShliach) ? lead(HE ? 'שלוחים' : 'Shluchim', headHTML(s.headShliach))
        : s.headShliach && s.vaad && s.vaadFirst ? `${vaadHTML(s)}${lead(esc(s.headTitle || tr('Head shliach')), headHTML(s.headShliach))}`
        : s.headShliach && !s.vaad && s.vaadMembers ? membersHTML(s, `${esc(s.headTitle || tr('Head shliach'))}: ${headHTML(s.headShliach)}`)
        : s.headShliach ? `${lead(esc(s.headTitle || tr('Head shliach')), headHTML(s.headShliach))}${s.vaad ? vaadHTML(s) : ''}` : ''}</div>${capital}
      ${ccStats(centersInShetach(s), mushroomsInShetach(s), zoomBtn)}`;""")

# ---------- the sub-shetach cards ----------
rep("""    return `<span class="kicker">${tr('Sub-shetach')}</span><h2>${esc(HE ? s.nameHe || s.name : s.name)}</h2>
      ${s.vaad ? membersHTML({ vaadMembers: s.vaadMembers, states: new Set(s.parts.map((p) => p.state)) }, `${tr('Regional leadership')}: ${esc(HE ? s.vaadHe || s.vaad : s.vaad)}`) // (a vaad leads it, as a shetach's vaad is shown: Queens; owner, Nov 3: "regional leadership instead of leadership")
        : `<p>${HE && /^Mrs\\.? /.test(s.head) ? 'שלוחה אזורית' : tr('Regional director')}: ${esc(HE ? s.headHe || s.head : s.head)}${s.headDisputed ? ` <span class="flag">(${HE ? 'במחלוקת' : 'disputed'})</span>` : ''}</p>`}${c ? `<p>${tr('Capital')}: ${esc(c.name)}${c.city ? `, ${esc(c.city)}` : ''}</p>` : ''}
      ${parent ? `<p class="meta">${shetachWithHead(parent)}</p>` : ''}
      <div class="foot"><span class="meta">${counts(n, m)}</span></div>`;""","""    // (its band in the sub-shetachim's lilac, its regional director big, its flagship, its shetach as a chip)
    return `<div class="cc-band" style="--chip:var(--sub)"></div><span class="cc-label">${tr('Sub-shetach')}</span><h2 class="cc-name big">${esc(HE ? s.nameHe || s.name : s.name)}</h2>
      <div class="cc-lead">${s.vaad ? membersHTML({ vaadMembers: s.vaadMembers, states: new Set(s.parts.map((p) => p.state)) }, `${tr('Regional leadership')}: ${esc(HE ? s.vaadHe || s.vaad : s.vaad)}`) // (a vaad leads it, as a shetach's vaad is shown: Queens; owner, Nov 3: "regional leadership instead of leadership")
        : `<p><span class="lbl">${HE && /^Mrs\\.? /.test(s.head) ? 'שלוחה אזורית' : tr('Regional director')}</span><span class="who">${esc(HE ? s.headHe || s.head : s.head)}${s.headDisputed ? ` <span class="flag">(${HE ? 'במחלוקת' : 'disputed'})</span>` : ''}</span></p>`}</div>${c ? `<p class="cc-flagline">${icon('star')}<span>${tr('Flagship')}: ${esc(c.name)}${c.city ? `, ${esc(c.city)}` : ''}</span></p>` : ''}
      ${ccStats(n, m)}${parent ? chipOf(parent) : ''}`;""")

# ---------- the area (country, state) cards ----------
rep("""      const part = state.borders === 'regular' ? inState.map((x) => `<p>${shetachWithHead(x, true, inState.length > 1 ? partName(p.state, x) : x.name)}</p>`).join('') + countryHeadHTML(p, inState) : '';
      return `<span class="kicker">${areaKind(p)}</span><h2>${esc(p.name)}</h2>${part}
        <div class="foot"><span class="meta">${counts(centers, mush)}</span>${zoomBtn}</div>`;""","""      const part = state.borders === 'regular' ? inState.map((x) => { const line = shetachWithHead(x, true, inState.length > 1 ? partName(p.state, x) : x.name), i = line.indexOf(' · ');
        return `<div class="cc-chip"${tintStyle(shetachTint(x))}>${i > 0 ? `<b>${line.slice(0, i)}</b>${line.slice(i)}` : `<b>${line}</b>`}</div>`; }).join('') + countryHeadHTML(p, inState) : '';
      return `<span class="cc-label">${areaKind(p)}</span><h2 class="cc-name big">${esc(p.name)}</h2><div class="cc-area-lines">${part}</div>
        ${ccStats(centers, mush, zoomBtn)}`;""")

# ---------- words: flagship, not capital ----------
rep("Capital: 'בירה',", "Capital: 'בירה', Flagship: 'מוסד מרכזי',")
rep("'Shetach capitals': 'בירות השטחים'", "'Shetach capitals': 'בירות השטחים', 'Shetach flagships': 'המוסדות המרכזיים'")
rep("""aria-hidden="true"><path id="star-shape"/></svg> Shetach capitals</label>""", """aria-hidden="true"><path id="star-shape"/></svg> Shetach flagships</label>""")
rep("""'Sub-shetachim': 'תת־שטחים', 'Sub-shetach': 'תת־שטח',""","""'Sub-shetachim': 'תת־שטחים', 'Sub-shetach': 'תת־שטח', Shetach: 'שטח',""")
open(p,'w',encoding='utf-8').write(s)
print('patched')

# ---------- round 2: buttons fit side by side, the zoom button sized, chips flow as text ----------
s=open(p,encoding='utf-8').read()
def rep2(a,b):
    global s
    assert s.count(a)==1, (s.count(a), a[:120])
    s=s.replace(a,b)
rep2("""#card .cc-actions .cc-btn { display: inline-flex;""","""#card .cc-actions .cc-btn, #card .cc-stats .cc-btn { display: inline-flex;""")
rep2("""#card .cc-actions .cc-btn:hover { border-color: var(--accent); color: var(--accent); }
#card .cc-actions .cc-btn .ic { width: 12px; height: 12px; }""","""#card .cc-actions .cc-btn:hover, #card .cc-stats .cc-btn:hover { border-color: var(--accent); color: var(--accent); }
#card .cc-actions .cc-btn .ic, #card .cc-stats .cc-btn .ic { width: 12px; height: 12px; flex: none; }""")
rep2("""#card .cc-chip { display: flex; align-items: center; gap: 6px; margin-top: 12px;""","""#card .cc-chip { display: block; margin-top: 12px;""")
rep2("""#card .cc-flagline { display: flex; align-items: center; gap: 6px;""","""#card .cc-flagline { display: flex; align-items: flex-start; gap: 6px;""")
rep2("""#card .cc-flagline .ic { width: 12px; height: 12px; flex: none; color: var(--accent); }""","""#card .cc-flagline .ic { width: 12px; height: 12px; flex: none; margin-top: 3px; color: var(--accent); }""")
# the page's button: the site's name (its mark says it opens it)
rep2("""  const pageBtn = (c) => { const p = pageOf(c); return p ? `<a class="cc-btn" href="${p.href}" target="_blank" rel="noopener">${p.label}${icon('ext')}</a>` : ''; };""",
     """  const pageBtn = (c) => { const p = pageOf(c); return p ? `<a class="cc-btn" href="${p.href}" target="_blank" rel="noopener" title="${p.label}">${p.label.replace(/^(Open on |לעמוד ב-|לדף ב)/, '')}${icon('ext')}</a>` : ''; };""")
# a flagship's zoom: "Zoom in", to its shetach
rep2("""<button type="button" class="cc-btn zoomto" data-shetach="${esc(c.s.id)}">${icon('zoom')}${HE ? 'התקרבות לשטח' : 'Zoom to the shetach'}</button>""",
     """<button type="button" class="cc-btn zoomto" data-shetach="${esc(c.s.id)}" title="${HE ? 'התקרבות לשטח' : 'Zoom to the shetach'}">${icon('zoom')}${tr('Zoom in')}</button>""")
open(p,'w',encoding='utf-8').write(s)
print('round 2 patched')
