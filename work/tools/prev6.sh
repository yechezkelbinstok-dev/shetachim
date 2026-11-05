#!/bin/bash
# prev6.sh <outdir> <lang> <theme> <device>: cards with the head shliach's photo (proto5), a spread of shetachim + one capital + one without a photo
S=/tmp/claude-0/-home-user-shetachim/6dfe7d99-9185-570e-b237-1d68bcc4daf7/scratchpad
cap() { echo "__dbg.showCard({capital: __dbg.capitals().find(c=>!c.honor&&!c.world&&c.s&&c.s.id===$1)})"; }
sh() { echo "__dbg.showCard({shetach: __dbg.capitals().find(c=>!c.honor&&!c.world&&c.s&&c.s.id===$1).s})"; }
ps="document.documentElement.dataset.ps='bar'"
cd $S/tools && PAGE=$S/proto5/index.html timeout 500 node cardshot.mjs "$@" \
  "a-maryland=$ps;$(sh "'maryland'")" \
  "b-southern-ohio=$ps;$(sh "'southern-ohio'")" \
  "c-alberta=$ps;$(sh "'alberta'")" \
  "d-carolinas=$ps;$(sh "'the-carolinas'")" \
  "e-westcoast-hq=$ps;$(cap "'west-coast'")" \
  "f-delaware-nophoto=$ps;$(sh "'delaware'")"
