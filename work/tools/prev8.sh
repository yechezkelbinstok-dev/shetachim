#!/bin/bash
# prev8.sh <outdir> <lang> <theme> <device>: proto7 — the vaad's faces (Florida, New Jersey), the head shliach as a line
# there, the count as a line with the map's dot
S=/tmp/claude-0/-home-user-shetachim/6dfe7d99-9185-570e-b237-1d68bcc4daf7/scratchpad
cap() { echo "__dbg.showCard({capital: __dbg.capitals().find(c=>!c.honor&&!c.world&&c.s&&c.s.id===$1)})"; }
sh() { echo "__dbg.showCard({shetach: __dbg.capitals().find(c=>!c.honor&&!c.world&&c.s&&c.s.id===$1).s})"; }
v="document.documentElement.dataset.ps='bar'"
cd $S/tools && PAGE=$S/proto7/index.html timeout 560 node cardshot.mjs "$@" \
  "a-florida=$v;$(sh "'florida'")" \
  "b-florida-open=$v;$(sh "'florida'")@@#card details.vaad summary" \
  "c-new-jersey=$v;$(sh "'new-jersey'")" \
  "d-florida-flagship=$v;$(cap "'florida'")" \
  "e-maryland=$v;$(sh "'maryland'")" \
  "f-westcoast=$v;$(sh "'west-coast'")"
