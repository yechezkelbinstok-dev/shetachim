# proto5: the head shliach's photo on the preview cards (proto3 = no small map; round 4's data-ps variants kept).
# Reads proto3/index.html, writes proto5/index.html. Preview only.
import json
S='/tmp/claude-0/-home-user-shetachim/6dfe7d99-9185-570e-b237-1d68bcc4daf7/scratchpad'
s=open(f'{S}/proto3/index.html',encoding='utf-8').read()
ids=[p['id'] for p in json.load(open('/home/user/shetachim/data/head-photos.json'))['photos']]
def rep(a,b,n=1):
    global s
    assert s.count(a)==n, (s.count(a), a[:140])
    s=s.replace(a,b)
# 1. personRow takes a photo (a shetach id): the photo stands where the initials (or the person mark) would
rep("""  const personRow = (ini, name, pos, t, label = '', big = false) => {
    const v = document.documentElement.dataset.ps || 'initials';
    const txt = (lbl, p2) => `<span class="cc-ptext">${lbl ? `<span class="lbl">${lbl}</span>` : ''}<b>${name}</b>${p2 ? `<span class="pos">${esc(p2)}</span>` : ''}</span>`;""",
"""  const HEAD_PHOTO = new Set(%s);
  const photoIf = (s, list) => { if (!s || !HEAD_PHOTO.has(s.id) || !list) return ''; const p = list.filter((x) => !x.isDeceased).find(isMale);
    return p && p.lastName && String(s._enHead || s.headShliach || '').includes(p.lastName) ? s.id : ''; };
  const personRow = (ini, name, pos, t, label = '', big = false, photo = '') => {
    const v = document.documentElement.dataset.ps || 'initials';
    const txt = (lbl, p2) => `<span class="cc-ptext">${lbl ? `<span class="lbl">${lbl}</span>` : ''}<b>${name}</b>${p2 ? `<span class="pos">${esc(p2)}</span>` : ''}</span>`;
    if (photo) return `<div class="cc-person has-ph${big ? ' big' : ''}"><img class="cc-ph" src="img/heads/${photo}.jpg" alt="">${txt(label, pos)}</div>`;""" % json.dumps(ids))
# 2. a center's people: the photo for its first man when he's the head shliach of the shetach it leads
rep("""  function peopleBlock(list, t) {""","""  function peopleBlock(list, t, photo = '') {""")
rep("""    return `<div class="cc-people" style="--t:${t}">${name ? personRow(widowed ? lastOf(woman).trim().slice(0, 1) : initials(firstOf(who), lastOf(who)), esc(name), pos, t) : ''}${""",
    """    return `<div class="cc-people" style="--t:${t}">${name ? personRow(widowed ? lastOf(woman).trim().slice(0, 1) : initials(firstOf(who), lastOf(who)), esc(name), pos, t, '', false, primary ? photo : '') : ''}${""")
rep("""${peopleBlock(c.personnel, c.mushroom ? 'var(--mush-av)' : t)}""","""${peopleBlock(c.personnel, c.mushroom ? 'var(--mush-av)' : t, flag ? photoIf(s, c.personnel) : '')}""")
rep("""${peopleBlock(c.center && c.center.personnel, t)}""","""${peopleBlock(c.center && c.center.personnel, t, photoIf(c.s, c.center && c.center.personnel))}""")
# 3. a shetach's card: its head shliach (or the shetach over it) with his photo
rep("""lead = (label, name) => `<div class="cc-people" style="--t:${t}">${personRow(initialsOf(name), headHTML(name), '', t, label, true)}</div>`;""",
    """lead = (label, name, photo = '') => `<div class="cc-people" style="--t:${t}">${personRow(initialsOf(name), headHTML(name), '', t, label, true, photo)}</div>`;""")
rep("""return lead(HE ? 'בהנהגת' : 'Overseen by', p.headShliach);""","""return lead(HE ? 'בהנהגת' : 'Overseen by', p.headShliach, HEAD_PHOTO.has(p.id) ? p.id : '');""")
rep("""lead(esc(s.headTitle || tr('Head shliach')), s.headShliach)""","""lead(esc(s.headTitle || tr('Head shliach')), s.headShliach, HEAD_PHOTO.has(s.id) ? s.id : '')""",2)
# 4. how it looks: a round photo with a thin ring in the shetach's colour; the bar (option 2) gives way to it
rep("""/* (preview: the other ways to show the shliach) */""","""/* (preview: the head shliach's photo) */
#card .cc-ph { flex: none; width: 48px; height: 48px; border-radius: 50%%; object-fit: cover; background: var(--panel);
  box-shadow: 0 0 0 2px var(--panel), 0 0 0 3.5px color-mix(in srgb, var(--t) 75%%, var(--ink) 25%%), 0 2px 6px rgba(0,0,0,.18); }
#card .cc-person.big .cc-ph { width: 66px; height: 66px; }
#card .cc-person.has-ph { gap: 13px; }
:root[data-ps] #card .cc-people:has(.has-ph) { border-inline-start: 0; padding-inline-start: 0; background: none; }
/* (preview: the other ways to show the shliach) */""".replace('%%','%'))
open(f'{S}/proto5/index.html','w',encoding='utf-8').write(s)
print('proto5 written,', len(ids), 'photos')
