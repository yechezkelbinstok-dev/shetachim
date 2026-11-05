#!/bin/bash
# prev5.sh <outdir> <lang> <theme> <device>: the photo preview (proto5), shliach shown as option 2 (the bar) where no photo
S=/tmp/claude-0/-home-user-shetachim/6dfe7d99-9185-570e-b237-1d68bcc4daf7/scratchpad
cap() { echo "__dbg.showCard({capital: __dbg.capitals().find(c=>!c.honor&&!c.world&&c.s&&c.s.id===$1)})"; }
sh() { echo "__dbg.showCard({shetach: __dbg.capitals().find(c=>!c.honor&&!c.world&&c.s&&c.s.id===$1).s})"; }
ps="document.documentElement.dataset.ps='bar'"
cd $S/tools && PAGE=$S/proto5/index.html timeout 400 node cardshot.mjs "$@" \
  "a-texas=$ps;$(sh "'texas'")" \
  "b-florida=$ps;$(sh "'florida'")" \
  "c-nj=$ps;$(sh "'new-jersey'")" \
  "d-westcoast-hq=$ps;$(cap "'west-coast'")" \
  "e-dc=$ps;$(sh "'washington-dc'")" \
  "f-nophoto=$ps;$(sh "'delaware'")"
