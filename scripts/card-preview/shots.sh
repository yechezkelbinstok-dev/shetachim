#!/bin/bash
# shots.sh [outdir] [he|en] [light|dark] [phone|desktop]: screenshots of the new cards in web/preview-cards.html
# (Florida closed and open, New Jersey, Maryland, the West Coast flagship, Delaware without a photo, the UK's Hanholo and
# Tzach closed and open, a center, a mushroom). Same setup as scripts/screenshot.mjs. Show the owner Hebrew first.
R=$(cd "$(dirname "$0")/../.." && pwd)
sh() { echo "__dbg.showCard({shetach: __dbg.capitals().find(c=>!c.honor&&!c.world&&c.s&&c.s.id===$1).s})"; }
cap() { echo "__dbg.showCard({capital: __dbg.capitals().find(c=>!c.honor&&!c.world&&c.s&&c.s.id===$1)})"; }
# (a board at the head, the UK's and NYC's: its capital may be a world one, so no !c.world)
any() { echo "__dbg.showCard({shetach: __dbg.capitals().find(c=>c.s&&c.s.id===$1).s})"; }
DOT="__dbg.showCard({dot: __dbg.V().dots.find(d=>d.centers.length===1&&!d.centers[0].mushroom&&/^Boca-Raton\//.test(d.centers[0].slug||'')&&(d.centers[0].personnel||[]).length)})"
MUSH="__dbg.showCard({dot: __dbg.V().dots.find(d=>d.centers.length===1&&d.centers[0].mushroom&&d.centers[0].network)})"
ON="eval:(()=>{const b=document.querySelector('#show-mushrooms'); b.checked=true; b.dispatchEvent(new Event('change')); return 'on'})()"
PAGE=$R/web/preview-cards.html node ${CARDSHOT:-$R/scripts/cardshot.mjs} "${1:-/tmp/card-shots}" ${2:-he} ${3:-light} ${4:-phone} \
  "a-florida=$(sh "'florida'")" "b-florida-open=$(sh "'florida'")@@#card details.vaad summary" "c-new-jersey=$(sh "'new-jersey'")" \
  "d-maryland=$(sh "'maryland'")" "e-west-coast-flagship=$(cap "'west-coast'")" "f-delaware=$(sh "'delaware'")" \
  "g-uk=$(any "'united-kingdom'")" "h-uk-open=$(any "'united-kingdom'")@@#card details.vaad summary@@wait:400" \
  "i-nyc=$(any "'new-york-city'")" "j-nyc-open=$(any "'new-york-city'")@@#card details.vaad summary@@wait:400" \
  "k-center=$DOT" "l-mushroom=void 0@@$ON@@wait:2500@@eval:($MUSH, 1)"
