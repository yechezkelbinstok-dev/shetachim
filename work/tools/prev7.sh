#!/bin/bash
# prev7.sh <outdir> <lang> <theme> <device>: proto6 (photos, no count box): the photo cards with the count under the name,
# and one card three ways (count under the name / a plain line / in the Zoom in button)
S=/tmp/claude-0/-home-user-shetachim/6dfe7d99-9185-570e-b237-1d68bcc4daf7/scratchpad
cap() { echo "__dbg.showCard({capital: __dbg.capitals().find(c=>!c.honor&&!c.world&&c.s&&c.s.id===$1)})"; }
sh() { echo "__dbg.showCard({shetach: __dbg.capitals().find(c=>!c.honor&&!c.world&&c.s&&c.s.id===$1).s})"; }
v() { echo "document.documentElement.dataset.ps='bar';document.documentElement.dataset.cnt='$1'"; }
cd $S/tools && PAGE=$S/proto6/index.html timeout 560 node cardshot.mjs "$@" \
  "a-maryland=$(v head);$(sh "'maryland'")" \
  "b-southern-ohio=$(v head);$(sh "'southern-ohio'")" \
  "c-alberta=$(v head);$(sh "'alberta'")" \
  "d-carolinas=$(v head);$(sh "'the-carolinas'")" \
  "e-westcoast-hq=$(v head);$(cap "'west-coast'")" \
  "f-delaware-nophoto=$(v head);$(sh "'delaware'")" \
  "x1-florida-head=$(v head);$(sh "'florida'")" \
  "x2-florida-line=$(v line);$(sh "'florida'")" \
  "x3-florida-zoom=$(v zoom);$(sh "'florida'")"
