#!/bin/bash
# shots.sh [outdir] [he|en] [light|dark] [phone|desktop]: screenshots of the new cards in web/preview-cards.html
# (Florida closed and open, New Jersey, Maryland, the West Coast flagship, Delaware without a photo). Same setup as scripts/screenshot.mjs.
R=$(cd "$(dirname "$0")/../.." && pwd)
sh() { echo "__dbg.showCard({shetach: __dbg.capitals().find(c=>!c.honor&&!c.world&&c.s&&c.s.id===$1).s})"; }
cap() { echo "__dbg.showCard({capital: __dbg.capitals().find(c=>!c.honor&&!c.world&&c.s&&c.s.id===$1)})"; }
PAGE=$R/web/preview-cards.html node ${CARDSHOT:-$R/scripts/cardshot.mjs} "${1:-/tmp/card-shots}" ${2:-he} ${3:-light} ${4:-phone} \
  "a-florida=$(sh "'florida'")" "b-florida-open=$(sh "'florida'")@@#card details.vaad summary" "c-new-jersey=$(sh "'new-jersey'")" \
  "d-maryland=$(sh "'maryland'")" "e-west-coast-flagship=$(cap "'west-coast'")" "f-delaware=$(sh "'delaware'")"
