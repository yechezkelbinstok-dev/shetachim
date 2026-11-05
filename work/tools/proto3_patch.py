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
  --mush: #b3261e; --tile: #eef1f3; --sub: #7b5fc4; /* the everyday cards: a mushroom's red, a quiet tile, a sub-shetach's lilac */
""")
for ind in ("    ", "  "):
    a=f"\n{ind}--honor: #e0c278; --honor-line: #c9a24a; --honor-soft: #2b2a20;\n"
    assert s.count(a)==1, ind
    s=s.replace(a, a+f"{ind}--mush: #f08a7f; --tile: #1e2b31; --sub: #b49be8;\n")

# ---------- CSS ----------
rep("""#card .mosad-body a { display: inline-block; margin-top: 6px; font-size: 12.5px; }
""","""#card .mosad-body a { display: inline-block; margin-top: 6px; font-size: 12.5px; }
/* ---- the everyday cards (owner, Nov 4: "very, very nice and beautifully made, like well done"): a header washed in
   the colour of the shetach the place is in, with a small map of that shetach (its shape in its colour on the map, the
   place marked on it: a dot, a flagship's star, a mushroom's red dot), the shetach and its head, the name, what it is
   and where; the shliach with a round badge of his initials; the actions in a bar along the card's foot. A shetach's
   own card: its shape bigger with its flagship starred, its head, its flagship, its numbers. A mushroom's: a red wash,
   its area grey. (The honorary cards keep their cream and gold.) ---- */
#card .cc-head { --t: var(--tile); position: relative; display: flex; align-items: center; gap: 13px; margin: -10px -12px 0; padding: 14px 14px 14px; border-radius: 9px 9px 0 0;
  background: var(--tile); background: linear-gradient(150deg, color-mix(in srgb, var(--t) 52%, var(--panel)) 0%, color-mix(in srgb, var(--t) 18%, var(--panel)) 100%);
  border-bottom: 1px solid color-mix(in srgb, var(--t) 45%, var(--panel-line)); }
#card .cc-head.mush { background: linear-gradient(150deg, color-mix(in srgb, var(--mush) 15%, var(--panel)) 0%, color-mix(in srgb, var(--mush) 5%, var(--panel)) 100%); border-bottom-color: color-mix(in srgb, var(--mush) 24%, var(--panel-line)); }
#card .cc-head.sub { background: linear-gradient(150deg, color-mix(in srgb, var(--sub) 20%, var(--panel)) 0%, color-mix(in srgb, var(--sub) 6%, var(--panel)) 100%); border-bottom-color: color-mix(in srgb, var(--sub) 30%, var(--panel-line)); }
#card .cc-mini { flex: none; width: 62px; height: 62px; padding: 4px; border-radius: 13px; background: var(--panel); box-shadow: 0 0 0 1px color-mix(in srgb, var(--ink) 8%, transparent), 0 4px 12px -3px color-mix(in srgb, var(--ink) 22%, transparent); }
#card .cc-mini.big { width: 76px; height: 76px; padding: 5px; border-radius: 15px; }
#card .cc-mini svg { display: block; width: 100%; height: 100%; overflow: visible; }
#card .cc-mini .land { stroke: color-mix(in srgb, var(--ink) 42%, transparent); stroke-width: .8; stroke-linejoin: round; }
#card .cc-mini .mk { stroke: var(--panel); stroke-width: 1.8; paint-order: stroke; }
#card .cc-htext { flex: 1; min-width: 0; padding-inline-end: 22px; }
#card .cc-crumb { margin: 0 0 3px; color: color-mix(in srgb, var(--ink) 60%, transparent); font-size: 11.5px; line-height: 1.35; }
#card .cc-kick { margin: 0 0 4px; color: color-mix(in srgb, var(--ink) 58%, transparent); font: 700 10px/1.35 var(--font-map); letter-spacing: .09em; text-transform: uppercase; }
:root[lang="he"] #card .cc-kick { font-size: 11px; letter-spacing: 0; }
#card .cc-kick.flag { color: var(--accent); }
#card .cc-kick.mush { color: var(--mush); }
#card .cc-kick.sub { color: var(--sub); }
#card .cc-kick .ic { display: inline-block; width: 10px; height: 10px; margin-inline-end: 4px; vertical-align: -1px; }
#card h2.cc-title { margin: 0; color: var(--ink); font: 650 17.5px/1.22 var(--font-ui); letter-spacing: -.01em; text-wrap: balance; }
#card h2.cc-title.big { font-size: 22px; line-height: 1.12; }
#card .cc-sub { margin: 3px 0 0; color: var(--muted); font-size: 12.5px; line-height: 1.35; }
#card .cc-body { padding: 13px 2px 0; }
#card .cc-person { display: flex; align-items: center; gap: 11px; }
#card .cc-av { --t: var(--tile); flex: none; display: grid; place-items: center; width: 36px; height: 36px; border-radius: 50%; background: color-mix(in srgb, var(--t) 50%, var(--panel)); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--t) 70%, var(--panel-line)); color: color-mix(in srgb, var(--ink) 85%, var(--t)); font: 650 12.5px/1 var(--font-ui); letter-spacing: .03em; }
#card .cc-av.big { width: 44px; height: 44px; font-size: 14.5px; }
#card .cc-ptext { min-width: 0; }
#card .cc-ptext .lbl { display: block; margin-bottom: 1px; color: var(--muted); font: 700 10px/1.4 var(--font-map); letter-spacing: .08em; text-transform: uppercase; }
:root[lang="he"] #card .cc-ptext .lbl { font-size: 11px; letter-spacing: 0; }
#card .cc-ptext b { display: block; color: var(--ink); font: 600 14.5px/1.25 var(--font-ui); }
#card .cc-av.big + .cc-ptext b { font-size: 16px; }
#card .cc-ptext .pos { display: block; margin-top: 1px; color: var(--muted); font-size: 12.5px; }
#card .cc-more { margin: 7px 0 0; margin-inline-start: 47px; pointer-events: auto; }
#card .cc-more + .cc-more { margin-top: 3px; }
#card .cc-more summary { display: inline-flex; align-items: center; gap: 6px; cursor: pointer; list-style: none; color: var(--accent); font-size: 12.5px; font-weight: 500; }
#card .cc-more summary::-webkit-details-marker { display: none; }
#card .cc-more summary::after { content: ''; width: 5px; height: 5px; margin-top: -3px; border-right: 1.4px solid currentColor; border-bottom: 1.4px solid currentColor; transform: rotate(45deg); }
#card .cc-more[open] summary::after { margin-top: 2px; transform: rotate(-135deg); }
#card .cc-more .pother { margin-top: 5px; padding: 0; color: var(--ink); font-size: 13px; }
#card .cc-net { display: flex; align-items: center; gap: 11px; margin: 0 0 13px; padding: 10px 12px; border-radius: 11px; background: color-mix(in srgb, var(--mush) 7%, var(--panel)); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--mush) 22%, transparent); }
#card .cc-net .rule { flex: none; width: 24px; border-top: 2px dashed var(--mush); }
#card .cc-net b { display: block; color: var(--ink); font: 600 13.5px/1.3 var(--font-ui); }
#card .cc-net span { display: block; color: var(--muted); font-size: 12px; }
#card .cc-ctx { display: flex; align-items: flex-start; gap: 9px; margin-top: 13px; padding-top: 12px; border-top: 1px solid var(--panel-line); color: var(--muted); font-size: 12.5px; line-height: 1.4; }
#card .cc-ctx .sw { flex: none; width: 11px; height: 11px; margin-top: 3px; border-radius: 3px; background: var(--t, var(--tile)); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ink) 14%, transparent); }
#card .cc-ctx b { color: var(--ink); font-weight: 600; }
#card .cc-ctx + .cc-ctx { margin-top: 8px; padding-top: 0; border-top: 0; }
#card .cc-foot { display: flex; margin: 14px -12px -10px; border-top: 1px solid var(--panel-line); border-radius: 0 0 9px 9px; background: color-mix(in srgb, var(--tile) 65%, var(--panel)); overflow: hidden; }
#card .cc-foot .cc-act { flex: 1 1 0; display: inline-flex; align-items: center; justify-content: center; gap: 7px; min-width: 0; height: 42px; margin: 0; padding: 0 10px; border: 0; border-radius: 0; background: transparent; color: var(--accent); font: 600 13px/1 var(--font-ui); text-decoration: none; white-space: nowrap; cursor: pointer; pointer-events: auto; }
#card .cc-foot .cc-act + .cc-act { border-inline-start: 1px solid var(--panel-line); }
#card .cc-foot .cc-act:hover { background: color-mix(in srgb, var(--accent) 8%, transparent); }
#card .cc-foot .cc-act.mush { color: var(--mush); }
#card .cc-foot .cc-act.mush:hover { background: color-mix(in srgb, var(--mush) 8%, transparent); }
#card .cc-foot .cc-act .ic { flex: none; width: 14px; height: 14px; }
#card .cc-foot .cc-act .lab { overflow: hidden; text-overflow: ellipsis; }
#card .cc-foot .cc-act .dash { flex: none; width: 16px; border-top: 2px dashed currentColor; }
/* several listings at one address: a row each, its page a round button at its end */
#card .cc-row { display: flex; gap: 10px; padding: 12px 0; }
#card .cc-row + .cc-row { border-top: 1px solid var(--panel-line); }
#card .cc-row:first-child { padding-top: 1px; }
#card .cc-row:last-child { padding-bottom: 2px; }
#card .cc-rtext { flex: 1; min-width: 0; }
#card .cc-row h3 { margin: 0; color: var(--ink); font: 600 14.5px/1.3 var(--font-ui); }
#card .cc-row .cc-sub { margin-top: 1px; }
#card .cc-row .who { margin-top: 6px; }
#card .cc-row .who .person { margin: 0; color: var(--ink); font-size: 13px; }
#card .cc-tag { display: inline-flex; align-items: center; gap: 5px; margin-top: 7px; padding: 2px 9px 2px 7px; border-radius: 999px; font-size: 11.5px; font-weight: 600; }
#card .cc-tag.flag { background: var(--accent-soft); color: var(--accent); }
#card .cc-tag.mush { background: color-mix(in srgb, var(--mush) 12%, var(--panel)); color: var(--mush); }
#card .cc-tag .ic { width: 10px; height: 10px; }
#card .cc-row .cc-net { margin: 8px 0 0; }
#card .cc-go { flex: none; display: grid; place-items: center; width: 32px; height: 32px; border-radius: 50%; background: color-mix(in srgb, var(--tile) 80%, var(--panel)); color: var(--accent); pointer-events: auto; }
#card .cc-go:hover { background: var(--accent-soft); }
#card .cc-go .ic { width: 13px; height: 13px; }
#card .cc-row.mush { position: relative; padding-inline-start: 13px; }
#card .cc-row.mush::before { content: ''; position: absolute; inset-inline-start: 0; top: 13px; bottom: 13px; width: 3px; border-radius: 3px; background: var(--mush); }
/* a shetach's card (a sub-shetach's, a country's) */
#card .cc-lead details.vaad { margin: 0 0 11px; }
#card .cc-lead details.vaad > summary { color: var(--ink); }
#card .cc-flagrow { display: flex; align-items: flex-start; gap: 9px; margin-top: 12px; color: var(--ink); font-size: 13px; line-height: 1.4; }
#card .cc-flagrow .ic { flex: none; width: 14px; height: 14px; margin-top: 2px; color: var(--accent); }
#card .cc-flagrow .lbl { color: var(--muted); }
#card .cc-tiles { display: flex; gap: 8px; margin-top: 13px; }
#card .cc-tile { flex: 1; min-width: 0; padding: 9px 12px 10px; border-radius: 11px; background: color-mix(in srgb, var(--tile) 75%, var(--panel)); }
#card .cc-tile b { display: block; color: var(--ink); font: 700 20px/1.1 var(--font-map); font-variant-numeric: tabular-nums; }
#card .cc-tile span { display: block; margin-top: 2px; color: var(--muted); font-size: 12px; }
#card .cc-tile.mush b { color: var(--mush); }
""")

# ---------- JS: helpers ----------
rep("""  // A shetach's flagship center; 770 (world HQ) gets its own wording rather than "of New York City".""","""  // ---- the everyday cards (owner, Nov 4: "very, very nice and beautifully made, like well done") ----
  const icon = (k) => (k === 'star' ? `<svg class="ic" viewBox="-7.5 -7.5 15 15" aria-hidden="true"><path d="${STAR}" fill="currentColor"/></svg>`
    : k === 'mush' ? `<svg class="ic" viewBox="0 0 16 16" aria-hidden="true"><path d="${MUSHROOM_CAP}" fill="currentColor"/><path d="${MUSHROOM_STEM}" fill="currentColor" opacity=".55"/></svg>`
    : k === 'zoom' ? '<svg class="ic" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.6" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M10.4 10.4l3.6 3.6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>'
    : '<svg class="ic" viewBox="0 0 16 16" aria-hidden="true"><path d="M6.5 3.5h-3v9h9v-3M9.5 3.5h3v3M12.5 3.5l-5 5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>');
  // a shetach's own colour on the map (grey on the plain map)
  function shetachTint(s) {
    if (!s || state.color === 'plain') return null;
    const i = shetachColor(groupOf(s.id));
    return i == null || i < 0 ? null : isPhysical() ? PHYS_TINTS[i] : `var(--c${i + 1})`;
  }
  const tintOf = (s) => shetachTint(s) || 'var(--tile)';
  // A small map of a shetach (its pieces merged, drawn once and kept), and the places marked on it
  const MINI = new Map(), MINI_STAR = d3.symbol(d3.symbolStar, 72)();
  function miniShape(key, gs, size) {
    const k = `${key}|${size}`;
    if (MINI.has(k)) return MINI.get(k);
    let m = null;
    try {
      const geom = topojson.merge(topo, gs), c = d3.geoCentroid(geom), pad = size * 0.07;
      const proj = d3.geoAzimuthalEqualArea().rotate([-c[0], -c[1]]).fitExtent([[pad, pad], [size - pad, size - pad]], geom);
      let d = '', lx = NaN, ly = NaN;
      d3.geoPath(proj, { moveTo(x, y) { d += `M${x.toFixed(1)} ${y.toFixed(1)}`; lx = x; ly = y; },
        lineTo(x, y) { if (Math.abs(x - lx) + Math.abs(y - ly) < 0.5) return; d += `L${x.toFixed(1)} ${y.toFixed(1)}`; lx = x; ly = y; }, closePath() { d += 'Z'; }, arc() {} })(geom);
      m = { d, proj };
    } catch (e) { m = null; }
    MINI.set(k, m);
    return m;
  }
  function miniMap(gs, key, fill, marks, size = 56) {
    const m = gs && gs.length ? miniShape(key, gs, size) : null;
    if (!m) return '';
    const mk = marks.map(({ lon, lat, kind }) => {
      const p = lon == null ? null : m.proj([lon, lat]);
      if (!p || !Number.isFinite(p[0])) return '';
      const [x, y] = p.map((v) => Math.max(5, Math.min(size - 5, v)).toFixed(1));
      return kind === 'star' ? `<path class="mk" d="${MINI_STAR}" transform="translate(${x} ${y})" fill="var(--accent)"/>`
        : `<circle class="mk" cx="${x}" cy="${y}" r="${size > 60 ? 4 : 3.7}" fill="${kind === 'mush' ? 'var(--mush)' : 'var(--dot)'}"/>`;
    }).join('');
    return `<span class="cc-mini${size > 60 ? ' big' : ''}"><svg viewBox="0 0 ${size} ${size}" aria-hidden="true"><path class="land" d="${m.d}" fill="${fill}"/>${mk}</svg></span>`;
  }
  const ccHead = ({ cls = '', t, mini, kick = '', crumb = '', title, sub = '', big }) => `<header class="cc-head${cls ? ` ${cls}` : ''}" style="--t:${t}">${mini}<div class="cc-htext">${kick}${
    crumb ? `<p class="cc-crumb">${crumb}</p>` : ''}<h2 class="cc-title${big ? ' big' : ''}">${title}</h2>${sub ? `<p class="cc-sub">${sub}</p>` : ''}</div></header>`;
  // a person's initials (a family's: its name's first letter)
  const initials = (first, last) => `${(first || '').trim().slice(0, 1)}${(last || '').trim().slice(0, 1)}`;
  const initialsOf = (name) => { const w = String(name || '').replace(/^(Disputed|במחלוקת)\\s*[—–-]?\\s*/, '').split(/[;,]/)[0].trim().split(/\\s+/).filter((x) => !/^(family|משפחת)$/.test(x));
    return w.length ? initials(w[0], w.length > 1 ? w[w.length - 1] : '') : ''; };
  const personRow = (ini, name, pos, t, label = '', big = false) => `<div class="cc-person"><span class="cc-av${big ? ' big' : ''}" style="--t:${t}">${esc(ini)}</span><span class="cc-ptext">${
    label ? `<span class="lbl">${label}</span>` : ''}<b>${name}</b>${pos ? `<span class="pos">${esc(pos)}</span>` : ''}</span></div>`;
  // Who's listed, as on any card (the owner's rule: the first man listed who's alive; with none, "<name> family" or the
  // first woman), the rest folded under him, those who passed away under "Deceased"
  function peopleBlock(list, t) {
    if (!list || !list.length) return '';
    const living = list.filter((p) => !p.isDeceased), passed = list.filter((p) => p.isDeceased);
    const primary = living.find(isMale), woman = !primary && living.find((p) => !isMale(p) && p.lastName), widowed = woman && passed.some(isMale);
    const who = primary || woman;
    const name = primary ? personName(primary) : widowed ? (HE ? `משפחת ${lastOf(woman)}` : `${woman.lastName} family`) : woman ? personName(woman) : '';
    const pos = primary ? positionOf(primary) : widowed ? '' : woman ? positionOf(woman) : '';
    const others = living.filter((p) => p !== primary && !(woman && !widowed && p === woman));
    const fold = (label, ps) => `<details class="cc-more"><summary>${label}</summary>${ps.map((p) => `<div class="pother">${personLine(p)}</div>`).join('')}</details>`;
    const obm = passed.filter((p) => !p.hyd);
    return `${name ? personRow(widowed ? lastOf(woman).trim().slice(0, 1) : initials(firstOf(who), lastOf(who)), esc(name), pos, t) : ''}${
      others.length ? fold(`+${others.length} ${HE ? 'נוספים' : 'more'}`, others) : ''}${obm.length ? fold(`${HE ? 'נפטרו' : 'Deceased'} (${obm.length})`, obm) : ''}`;
  }
  // the shetach a place is in, under its people: its colour, its name bold, its vaad and head
  const boldFirst = (line) => { const i = line.indexOf(' · '); return i > 0 ? `<b>${line.slice(0, i)}</b>${line.slice(i)}` : `<b>${line}</b>`; };
  const ctxRow = (s, line) => (line ? `<div class="cc-ctx"><span class="sw" style="--t:${tintOf(s)}"></span><span>${boldFirst(line)}</span></div>` : '');
  // the bar along a card's foot: its page, a flagship's way to its shetach, a mushroom's network
  const pageOf = (c) => { const m = /href="([^"]+)"[^>]*>([^<]+)</.exec(chabadLink(c) || ''); return m ? { href: m[1], label: m[2] } : null; };
  const pageAct = (c) => { const p = pageOf(c); return p ? `<a class="cc-act" href="${p.href}" target="_blank" rel="noopener" title="${p.label}">${icon('ext')}<span class="lab">${p.label.replace(/^(Open on |לעמוד ב-|לדף ב)/, '')}</span></a>` : ''; };
  const pageGo = (c) => { const p = pageOf(c); return p ? `<a class="cc-go" href="${p.href}" target="_blank" rel="noopener" title="${p.label}" aria-label="${p.label}">${icon('ext')}</a>` : ''; };
  const zoomAct = (attrs) => `<button type="button" class="cc-act zoomto" ${attrs}>${icon('zoom')}<span class="lab">${tr('Zoom in')}</span></button>`;
  const netAct = (c) => { const n = c.mushroom && c.network && networks().get(c.network);
    return n ? `<button type="button" class="cc-act mush net-show" data-net="${esc(c.network)}" aria-pressed="${netPinned === n}"><span class="dash"></span><span class="lab">${netButton(n)}</span></button>` : ''; };
  const netBox = (c) => { const n = networks().get(c.network), name = HE ? c.networkHe || c.network : c.network;
    return `<div class="cc-net"><span class="rule"></span><div><b>${esc(name)}</b><span>${HE ? 'רשת' : 'Network'}${n ? ` · ${esc(netCount(n))}` : ''}</span></div></div>`; };
  const ccTile = (n, one, many, heOne, heMany, cls = '') => `<div class="cc-tile${cls ? ` ${cls}` : ''}"><b>${fmt(n)}</b><span>${HE ? (n === 1 ? heOne : heMany) : n === 1 ? one : many}</span></div>`;
  const ccTiles = (n, m) => `<div class="cc-tiles">${ccTile(n - m, 'center', 'centers', 'מוסד', 'מוסדות')}${m ? ccTile(m, 'mushroom', 'mushrooms', 'פטרייה', 'פטריות', 'mush') : ''}</div>`;
  // A shetach's flagship center; 770 (world HQ) gets its own wording rather than "of New York City".""")

# a network button's words change in place (its dashed mark kept)
rep("""    card.querySelectorAll('.net-show').forEach((b) => { const n = networks().get(b.dataset.net); if (n) { b.textContent = netButton(n); b.setAttribute('aria-pressed', String(netPinned === n)); } });""",
    """    card.querySelectorAll('.net-show').forEach((b) => { const n = networks().get(b.dataset.net); if (n) { (b.querySelector('.lab') || b).textContent = netButton(n); b.setAttribute('aria-pressed', String(netPinned === n)); } });""")

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
  }""","""  // A center's card: the header in its shetach's colour with the small map (a mushroom's red, its area grey), the
  // shetach and its head above the name (a mushroom's area only: it isn't under the shetach's head, owner, Oct 12; a
  // flagship's star badge instead, its shetach under its people), what it is and where; its network (a mushroom's),
  // its people; the bar of actions. Several at one address: the address in the header, a row each.
  const mushKick = (c) => `<p class="cc-kick mush">${icon('mush')}${tr('Mushroom')}${c.networkFlagship && networks().has(c.network) ? ` · ${HE ? 'המוסד המרכזי של הרשת' : 'Network flagship'}` : ''}</p>`;
  function dotHTML(d) {
    const n = d.centers.length, g = pieceById.get(d.piece), s = g && shetachOf(g);
    const mushy = d.centers.some((c) => c.mushroom), allMush = d.centers.every((c) => c.mushroom);
    const cap1 = n === 1 ? capitalOfCenter.get(d.centers[0].id) : null, flag = cap1 && !cap1.world;
    const t = allMush ? 'var(--mush)' : tintOf(s);
    const mini = miniMap(s ? s.pieces : g ? [g] : [], s ? `s:${s.id}` : `g:${d.piece}`, allMush || !s ? 'var(--empty)' : tintOf(s), [{ lon: d.lon, lat: d.lat, kind: allMush ? 'mush' : flag ? 'star' : 'dot' }]);
    const crumb = shetachLine(d.piece, !mushy);
    if (n === 1) {
      const c = d.centers[0], acts = `${netAct(c)}${pageAct(c)}${flag && cap1.s ? zoomAct(`data-shetach="${esc(cap1.s.id)}" title="${HE ? 'התקרבות לשטח' : 'Zoom to the shetach'}"`) : ''}`;
      return `${ccHead({ cls: c.mushroom ? 'mush' : '', t, mini, kick: c.mushroom ? mushKick(c) : flag ? `<p class="cc-kick flag">${icon('star')}${capKicker(cap1)}</p>` : '', crumb: flag ? '' : crumb,
        title: esc(c.name), sub: esc([c.type, c.city].filter(Boolean).join(' · ')) })}
        <div class="cc-body">${c.mushroom && c.network ? netBox(c) : ''}${memorialHTML(c)}${peopleBlock(c.personnel, t)}${flag ? ctxRow(s, shetachLine(d.piece, true)) : ''}</div>${acts ? `<div class="cc-foot">${acts}</div>` : ''}`;
    }
    const rows = d.centers.map((c) => {
      const cap = capitalOfCenter.get(c.id);
      const tag = c.mushroom ? `<span class="cc-tag mush">${icon('mush')}${tr('Mushroom')}</span>` : cap && !cap.world ? `<span class="cc-tag flag">${icon('star')}${capKicker(cap)}</span>` : '';
      return `<section class="cc-row${c.mushroom ? ' mush' : ''}"><div class="cc-rtext"><h3>${esc(c.name)}</h3>${c.type ? `<p class="cc-sub">${esc(c.type)}</p>` : ''}<div class="who">${personnelHTML(c.personnel)}</div>${tag}${
        c.mushroom && c.network ? netBox(c) : ''}</div>${pageGo(c)}</section>`;
    }).join('');
    return `${ccHead({ cls: allMush ? 'mush' : '', t, mini, crumb, title: esc(d.centers[0].city || tr('Same address')), sub: HE ? `${n} מוסדות בכתובת זו` : `${n} listings at this address` })}<div class="cc-body">${rows}</div>`;
  }""")

# ---------- the flagship cards ----------
rep("""    return `<span class="kicker">${capKicker(c)}</span><h2>${esc(c.name)}</h2>${rebbeHTML(c.center)}
      ${c.city ? `<p>${esc(c.city)}</p>` : ''}${memorialHTML(c.center)}${personnelHTML(c.center && c.center.personnel)}${chabadLink(c.center)}
      <div class="foot"><span class="meta">${shetachLine(c.piece, true)}</span></div>`;""","""    // a shetach's flagship center: its star on the small map and in its badge, its shetach under its people, a way there
    const g = pieceById.get(c.piece), t = tintOf(c.s);
    const mini = miniMap(c.s ? c.s.pieces : g ? [g] : [], c.s ? `s:${c.s.id}` : `g:${c.piece}`, tintOf(c.s), [{ lon: c.lon, lat: c.lat, kind: 'star' }]);
    return `${ccHead({ t, mini, kick: `<p class="cc-kick flag">${icon('star')}${capKicker(c)}</p>`, title: esc(c.name), sub: esc([c.center && c.center.type, c.city].filter(Boolean).join(' · ')) })}${rebbeHTML(c.center)}
      <div class="cc-body">${memorialHTML(c.center)}${peopleBlock(c.center && c.center.personnel, t)}${ctxRow(c.s, shetachLine(c.piece, true))}</div>
      <div class="cc-foot">${pageAct(c.center)}${c.s ? zoomAct(`data-shetach="${esc(c.s.id)}" title="${HE ? 'התקרבות לשטח' : 'Zoom to the shetach'}"`) : ''}</div>`;""")

# ---------- the shetach cards ----------
rep("""    // "Capital: …", or for a disputed shetach "Capital (Chaim Tzvi Groner): …", one per claimant
    const capital = caps.map((c) => `<p>${tr('Capital')}${c.for ? ` (${esc(c.for)})` : ''}: ${esc(c.name)}${c.city ? `, ${esc(c.city)}` : ''}</p>`).join('');
""","""    // "Flagship: …" (owner, Nov 4: "flagship rather than capital."), or for a disputed shetach "Flagship (Chaim Tzvi
    // Groner): …", one per claimant
    const capital = caps.map((c) => `<div class="cc-flagrow">${icon('star')}<span><span class="lbl">${tr('Flagship')}${c.for ? ` (${esc(c.for)})` : ''}:</span> ${esc(c.name)}${c.city ? `, ${esc(c.city)}` : ''}</span></div>`).join('');
""")
rep("""    return `<h2>${esc(s.name)}</h2>${s.altName ? `<p class="alt-name">${esc(s.altName)}</p>` : ''}
      ${s.territoryOf && shetachById.get(s.territoryOf) ? (() => { const p = shetachById.get(s.territoryOf); return `<p>${HE ? 'בהנהגת' : 'Overseen by'} ${headHTML(p.headShliach)}</p>`; })()
        : s.noCentralLeadership ? `<p>${tr('No centralized leadership')}</p>`
        : s.headShliach && / family$|^משפחת /.test(s.headShliach) ? `<p>${HE ? 'שלוחים' : 'Shluchim'}: ${headHTML(s.headShliach)}</p>`
        : s.headShliach && s.vaad && s.vaadFirst ? `${vaadHTML(s)}<p>${esc(s.headTitle || tr('Head shliach'))}: ${headHTML(s.headShliach)}</p>`
        : s.headShliach && !s.vaad && s.vaadMembers ? membersHTML(s, `${esc(s.headTitle || tr('Head shliach'))}: ${headHTML(s.headShliach)}`)
        : s.headShliach ? `<p>${esc(s.headTitle || tr('Head shliach'))}: ${headHTML(s.headShliach)}</p>${s.vaad ? vaadHTML(s) : ''}` : ''}${capital}
      <div class="foot"><span class="meta">${counts(centersInShetach(s), mushroomsInShetach(s))}</span>${zoomBtn}</div>`;""","""    // its shape on the small map (its flagship starred), its name big; who leads it with his initials; its flagship; its
    // numbers; "Zoom in" along its foot
    const t = tintOf(s), lead = (label, name) => personRow(initialsOf(name), headHTML(name), '', t, label, true);
    const mini = miniMap(s.pieces, `s:${s.id}`, t, caps.map((c) => ({ lon: c.lon, lat: c.lat, kind: 'star' })), 72);
    return `${ccHead({ t, mini, kick: `<p class="cc-kick">${tr('Shetach')}</p>`, title: esc(s.name), sub: s.altName ? esc(s.altName) : '', big: true })}
      <div class="cc-body"><div class="cc-lead">${s.territoryOf && shetachById.get(s.territoryOf) ? (() => { const p = shetachById.get(s.territoryOf); return lead(HE ? 'בהנהגת' : 'Overseen by', p.headShliach); })()
        : s.noCentralLeadership ? `<p class="cc-sub">${tr('No centralized leadership')}</p>`
        : s.headShliach && / family$|^משפחת /.test(s.headShliach) ? lead(HE ? 'שלוחים' : 'Shluchim', s.headShliach)
        : s.headShliach && s.vaad && s.vaadFirst ? `${vaadHTML(s)}${lead(esc(s.headTitle || tr('Head shliach')), s.headShliach)}`
        : s.headShliach && !s.vaad && s.vaadMembers ? membersHTML(s, `${esc(s.headTitle || tr('Head shliach'))}: ${headHTML(s.headShliach)}`)
        : s.headShliach ? `${lead(esc(s.headTitle || tr('Head shliach')), s.headShliach)}${s.vaad ? `<div style="margin-top:11px">${vaadHTML(s)}</div>` : ''}` : ''}</div>${capital}
      ${ccTiles(centersInShetach(s), mushroomsInShetach(s))}</div>
      <div class="cc-foot">${zoomBtn.replace('class="zoomto"', 'class="cc-act zoomto"').replace(/>([^<]*)<\\/button>$/, `>${icon('zoom')}<span class="lab">$1</span></button>`)}</div>`;""")

# ---------- the sub-shetach cards ----------
rep("""    return `<span class="kicker">${tr('Sub-shetach')}</span><h2>${esc(HE ? s.nameHe || s.name : s.name)}</h2>
      ${s.vaad ? membersHTML({ vaadMembers: s.vaadMembers, states: new Set(s.parts.map((p) => p.state)) }, `${tr('Regional leadership')}: ${esc(HE ? s.vaadHe || s.vaad : s.vaad)}`) // (a vaad leads it, as a shetach's vaad is shown: Queens; owner, Nov 3: "regional leadership instead of leadership")
        : `<p>${HE && /^Mrs\\.? /.test(s.head) ? 'שלוחה אזורית' : tr('Regional director')}: ${esc(HE ? s.headHe || s.head : s.head)}${s.headDisputed ? ` <span class="flag">(${HE ? 'במחלוקת' : 'disputed'})</span>` : ''}</p>`}${c ? `<p>${tr('Capital')}: ${esc(c.name)}${c.city ? `, ${esc(c.city)}` : ''}</p>` : ''}
      ${parent ? `<p class="meta">${shetachWithHead(parent)}</p>` : ''}
      <div class="foot"><span class="meta">${counts(n, m)}</span></div>`;""","""    // (lilac; its parent shetach's shape on the small map with its flagship starred; its regional director with his
    // initials; its flagship; its numbers; the shetach it's in)
    const head = HE ? s.headHe || s.head : s.head;
    const mini = parent ? miniMap(parent.pieces, `s:${parent.id}`, tintOf(parent), dot ? [{ lon: dot.lon, lat: dot.lat, kind: 'star' }] : []) : '';
    return `${ccHead({ cls: 'sub', t: 'var(--sub)', mini, kick: `<p class="cc-kick sub">${tr('Sub-shetach')}</p>`, title: esc(HE ? s.nameHe || s.name : s.name), big: true })}
      <div class="cc-body"><div class="cc-lead">${s.vaad ? membersHTML({ vaadMembers: s.vaadMembers, states: new Set(s.parts.map((p) => p.state)) }, `${tr('Regional leadership')}: ${esc(HE ? s.vaadHe || s.vaad : s.vaad)}`) // (a vaad leads it, as a shetach's vaad is shown: Queens; owner, Nov 3: "regional leadership instead of leadership")
        : personRow(initialsOf(head), `${esc(head)}${s.headDisputed ? ` <span class="flag">(${HE ? 'במחלוקת' : 'disputed'})</span>` : ''}`, '', 'var(--sub)', HE && /^Mrs\\.? /.test(s.head) ? 'שלוחה אזורית' : tr('Regional director'), true)}</div>${
        c ? `<div class="cc-flagrow">${icon('star')}<span><span class="lbl">${tr('Flagship')}:</span> ${esc(c.name)}${c.city ? `, ${esc(c.city)}` : ''}</span></div>` : ''}
      ${ccTiles(n, m)}${parent ? ctxRow(parent, shetachWithHead(parent)) : ''}</div>`;""")

# ---------- the area (country, state) cards ----------
rep("""      const part = state.borders === 'regular' ? inState.map((x) => `<p>${shetachWithHead(x, true, inState.length > 1 ? partName(p.state, x) : x.name)}</p>`).join('') + countryHeadHTML(p, inState) : '';
      return `<span class="kicker">${areaKind(p)}</span><h2>${esc(p.name)}</h2>${part}
        <div class="foot"><span class="meta">${counts(centers, mush)}</span>${zoomBtn}</div>`;""","""      const part = state.borders === 'regular' ? inState.map((x) => ctxRow(x, shetachWithHead(x, true, inState.length > 1 ? partName(p.state, x) : x.name))).join('') + countryHeadHTML(p, inState) : '';
      const mini = miniMap(pieces.filter(shownAs), `a:${p.state}`, 'var(--tile)', [], 72);
      return `${ccHead({ t: 'var(--tile)', mini, kick: `<p class="cc-kick">${areaKind(p)}</p>`, title: esc(p.name), big: true })}
        <div class="cc-body"><div class="cc-area">${part}</div>${ccTiles(centers, mush)}</div>
        ${zoomBtn ? `<div class="cc-foot">${zoomBtn.replace('class="zoomto"', 'class="cc-act zoomto"').replace(/>([^<]*)<\\/button>$/, `>${icon('zoom')}<span class="lab">$1</span></button>`)}</div>` : ''}`;""")

# ---------- words: flagship, not capital ----------
rep("Capital: 'בירה',", "Capital: 'בירה', Flagship: 'מוסד מרכזי',")
rep("'Shetach capitals': 'בירות השטחים'", "'Shetach capitals': 'בירות השטחים', 'Shetach flagships': 'המוסדות המרכזיים'")
rep("""aria-hidden="true"><path id="star-shape"/></svg> Shetach capitals</label>""", """aria-hidden="true"><path id="star-shape"/></svg> Shetach flagships</label>""")
rep("""'Sub-shetachim': 'תת־שטחים', 'Sub-shetach': 'תת־שטח',""","""'Sub-shetachim': 'תת־שטחים', 'Sub-shetach': 'תת־שטח', Shetach: 'שטח',""")
open(p,'w',encoding='utf-8').write(s)
print('patched')

# ---------- round 2: a softer badge on a mushroom's people; tags upright ----------
s=open(p,encoding='utf-8').read()
def rep2(a,b):
    global s
    assert s.count(a)==1, (s.count(a), a[:120])
    s=s.replace(a,b)
rep2("""  --mush: #b3261e; --tile: #eef1f3; --sub: #7b5fc4; /* the everyday cards: a mushroom's red, a quiet tile, a sub-shetach's lilac */""",
     """  --mush: #b3261e; --mush-av: #f1cfcb; --tile: #eef1f3; --sub: #7b5fc4; /* the everyday cards: a mushroom's red (and its people's badge), a quiet tile, a sub-shetach's lilac */""")
for ind in ("    ", "  "):
    a=f"\n{ind}--mush: #f08a7f; --tile: #1e2b31; --sub: #b49be8;\n"
    assert s.count(a)==1, ind
    s=s.replace(a, f"\n{ind}--mush: #f08a7f; --mush-av: #5a2c28; --tile: #1e2b31; --sub: #b49be8;\n")
rep2("""        <div class="cc-body">${c.mushroom && c.network ? netBox(c) : ''}${memorialHTML(c)}${peopleBlock(c.personnel, t)}""",
     """        <div class="cc-body">${c.mushroom && c.network ? netBox(c) : ''}${memorialHTML(c)}${peopleBlock(c.personnel, c.mushroom ? 'var(--mush-av)' : t)}""")
rep2("""#card .cc-tag { display: inline-flex;""","""#card .cc-tag { font-style: normal; display: inline-flex;""")
open(p,'w',encoding='utf-8').write(s)
print('round 2 patched')

# ---------- round 3: no small map (owner, Nov 4: "Absolutely no reason to have that map situation. No, no, no.") ----------
s=open(p,encoding='utf-8').read()
a0=s.index("  // A small map of a shetach (its pieces merged, drawn once and kept), and the places marked on it\n")
a1=s.index("  const ccHead = ({ cls = ''")
s=s[:a0]+"  const miniMap = () => ''; // (no small map in a card: owner, Nov 4: \"Absolutely no reason to have that map situation\")\n"+s[a1:]
open(p,'w',encoding='utf-8').write(s)
print('round 3 patched')

# ---------- round 4 (preview only): other ways to show the shliach than his initials, picked by <html data-ps> ----------
s=open(p,encoding='utf-8').read()
def rep4(a,b):
    global s
    assert s.count(a)==1, (s.count(a), a[:120])
    s=s.replace(a,b)
rep4("""  const personRow = (ini, name, pos, t, label = '', big = false) => `<div class="cc-person"><span class="cc-av${big ? ' big' : ''}" style="--t:${t}">${esc(ini)}</span><span class="cc-ptext">${
    label ? `<span class="lbl">${label}</span>` : ''}<b>${name}</b>${pos ? `<span class="pos">${esc(pos)}</span>` : ''}</span></div>`;""",
"""  const PERSON_ICON = '<svg class="pi" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="5.2" r="2.7" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M2.8 14c.6-2.9 2.7-4.4 5.2-4.4s4.6 1.5 5.2 4.4" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';
  const personRow = (ini, name, pos, t, label = '', big = false) => {
    const v = document.documentElement.dataset.ps || 'initials';
    const txt = (lbl, p2) => `<span class="cc-ptext">${lbl ? `<span class="lbl">${lbl}</span>` : ''}<b>${name}</b>${p2 ? `<span class="pos">${esc(p2)}</span>` : ''}</span>`;
    if (v === 'label') return `<div class="cc-person v-label${big ? ' big' : ''}">${txt(label || (pos ? esc(pos) : ''), label ? pos : '')}</div>`;
    if (v === 'icon') return `<div class="cc-person v-icon${big ? ' big' : ''}">${PERSON_ICON}${txt(label, pos)}</div>`;
    if (v === 'bar' || v === 'panel') return `<div class="cc-person${big ? ' big' : ''}">${txt(label, pos)}</div>`;
    return `<div class="cc-person"><span class="cc-av${big ? ' big' : ''}" style="--t:${t}">${esc(ini)}</span>${txt(label, pos)}</div>`;
  };""")
rep4("""    return `${name ? personRow(widowed ? lastOf(woman).trim().slice(0, 1) : initials(firstOf(who), lastOf(who)), esc(name), pos, t) : ''}${
      others.length ? fold(`+${others.length} ${HE ? 'נוספים' : 'more'}`, others) : ''}${obm.length ? fold(`${HE ? 'נפטרו' : 'Deceased'} (${obm.length})`, obm) : ''}`;""",
"""    return `<div class="cc-people" style="--t:${t}">${name ? personRow(widowed ? lastOf(woman).trim().slice(0, 1) : initials(firstOf(who), lastOf(who)), esc(name), pos, t) : ''}${
      others.length ? fold(`+${others.length} ${HE ? 'נוספים' : 'more'}`, others) : ''}${obm.length ? fold(`${HE ? 'נפטרו' : 'Deceased'} (${obm.length})`, obm) : ''}</div>`;""")
rep4("""    const t = tintOf(s), lead = (label, name) => personRow(initialsOf(name), headHTML(name), '', t, label, true);""",
     """    const t = tintOf(s), lead = (label, name) => `<div class="cc-people" style="--t:${t}">${personRow(initialsOf(name), headHTML(name), '', t, label, true)}</div>`;""")
rep4("""#card .cc-tile.mush b { color: var(--mush); }
""","""#card .cc-tile.mush b { color: var(--mush); }
/* (preview: the other ways to show the shliach) */
:root[data-ps] #card .cc-more { margin-inline-start: 0; }
:root[data-ps="label"] #card .cc-person.v-label .lbl { margin-bottom: 2px; }
:root[data-ps="label"] #card .cc-person.v-label b { font-size: 15.5px; }
:root[data-ps="label"] #card .cc-person.big b { font-size: 17px; }
:root[data-ps="bar"] #card .cc-people { padding: 1px 0 1px; padding-inline-start: 12px; border-inline-start: 3px solid color-mix(in srgb, var(--t) 62%, var(--ink) 38%); }
:root[data-ps="bar"] #card .cc-person.big b { font-size: 16.5px; }
:root[data-ps="panel"] #card .cc-people { padding: 10px 13px 11px; border-radius: 11px; background: color-mix(in srgb, var(--t) 26%, var(--panel)); }
:root[data-ps="panel"] #card .cc-person.big b { font-size: 16.5px; }
:root[data-ps="icon"] #card .cc-person { align-items: flex-start; gap: 9px; }
:root[data-ps="icon"] #card .cc-person .pi { flex: none; width: 17px; height: 17px; margin-top: 2px; color: var(--muted); }
:root[data-ps="icon"] #card .cc-person.big .pi { width: 20px; height: 20px; margin-top: 14px; }
:root[data-ps="icon"] #card .cc-more { margin-inline-start: 26px; }
""")
open(p,'w',encoding='utf-8').write(s)
print('round 4 patched')
