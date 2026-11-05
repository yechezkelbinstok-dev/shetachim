#!/bin/bash
# prev.sh <outdir> <lang> <theme> <device>   (PAGE=<html> for the prototype)
dot() { echo "__dbg.showCard({dot: __dbg.V().dots.find(d=>d.centers.some(c=>c.name===$1))})"; }
cap() { echo "__dbg.showCard({capital: __dbg.capitals().find(c=>!c.honor&&!c.world&&c.s&&c.s.id===$1)})"; }
sh() { echo "__dbg.showCard({shetach: __dbg.capitals().find(c=>!c.honor&&!c.world&&c.s&&c.s.id===$1).s})"; }
cd /tmp/claude-0/-home-user-shetachim/6dfe7d99-9185-570e-b237-1d68bcc4daf7/scratchpad/tools && timeout 400 node cardshot.mjs "$@" \
  "a-center=document.querySelector('#show-mushrooms').checked||document.querySelector('#show-mushrooms').click()@@wait:1200@@eval:$(dot "'Chabad of Greater Dayton'")" \
  "b-multi=$(dot "'Chabad West Coast Headquarters'")" \
  "c-capital=$(cap "'florida'")" \
  "d-mushnet=$(dot "'Chabad House Manila'")" \
  "e-mushroom=$(dot "'Chabad of Westboro'")" \
  "f-shetach=$(sh "'florida'")" \
  "g-shetach2=$(sh "'new-jersey'")"
