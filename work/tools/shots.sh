#!/bin/bash
# shots.sh <outdir> <lang> <theme> <device>
S=/tmp/claude-0/-home-user-shetachim/6dfe7d99-9185-570e-b237-1d68bcc4daf7/scratchpad
H='__dbg.showCard({capital: __dbg.capitals().find(c=>c.honor===%s)})'; W='__dbg.showCard({capital: __dbg.capitals().find(c=>c.world)})'
args=(); for k in ${KEYS:-lubavitch rostov liozna liadi haditch nezhin lubavitch-ohel lubavitch-chatzer rostov-ohel haditch-ohel nezhin-ohel ohel}; do args+=("$k=$(printf "$H" "'$k'")"); done
args+=("770=$W" "770open=$W@@#card details.at-address > summary" "770mosad=$W@@#card details.at-address > summary@@#card details.mosad:nth-child(6) > summary")
cd $S/tools && timeout 400 node cardshot.mjs "$@" "${args[@]}"
