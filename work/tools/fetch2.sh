#!/bin/bash
# fetch_cands.sh <id> <url>...: each candidate into photos/<id>/<n>.<ext> (only real images kept)
S=/tmp/claude-0/-home-user-shetachim/6dfe7d99-9185-570e-b237-1d68bcc4daf7/scratchpad
id=$1; shift; d=$S/photos2/$id; mkdir -p $d
# continue the numbering after the highest existing cN (a second call must not overwrite)
n=$(ls $d 2>/dev/null | sed -n 's/^c\([0-9]*\)\..*/\1/p' | sort -n | tail -1); n=${n:-0}
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
for u in "$@"; do
  n=$((n+1)); f=$d/c$n
  curl -sS -L -A "$UA" --max-time 25 -o $f.bin "$u" 2>/dev/null
  t=$(file -b --mime-type $f.bin 2>/dev/null)
  case "$t" in image/jpeg) mv $f.bin $f.jpg;; image/png) mv $f.bin $f.png;; image/webp) mv $f.bin $f.webp;; image/gif) mv $f.bin $f.gif;; *) rm -f $f.bin; echo "$id c$n: not an image ($t)";; esac
  echo "$n $u" >> $d/sources.txt
done
ls $d | grep -v sources | tr '\n' ' '; echo
