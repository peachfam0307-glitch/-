#!/bin/bash
# 🎬 주부의 장바구니 릴스 2판 — 다크 9장 조립 (2026-09-12)
# ⛔⛔ -loop 1 은 «무한 입력»이다 — -t 를 반드시 준다 (2026-09-12 에 4시간 돌며 252MB 까지 커진 사고)
set -e
FF=/home/user/hankki/hankki/node_modules/ffmpeg-static/ffmpeg
S=/tmp/큐레다크8
OUT=/tmp/큐레릴스2판.mp4
TR=0.4                                   # 전환 시간

# 장마다 머무는 시간 — 글이 많은 말풍선 두 장은 길게
NAMES=(1-훅 2-탭 3-카드 4a-말 4b-말 5-몰 6-숫자 7-앞으로 8-끝)
DURS=(2.0 2.0 2.0 3.6 3.6 2.4 2.2 2.8 2.6)   # ☑️앞 3장은 2초 (창업자)

ARGS=(); N=${#NAMES[@]}
for i in $(seq 0 $((N-1))); do
  ARGS+=(-loop 1 -t "${DURS[$i]}" -i "$S/${NAMES[$i]}.jpg")
done

# xfade 체인 — offset 은 «앞 장들 합 - 지금까지 겹친 전환»
FILTER=""; PREV="[0:v]"; ACC=${DURS[0]}
for i in $(seq 1 $((N-1))); do
  OFF=$(python3 -c "print(round($ACC - $TR, 3))")
  FILTER="${FILTER}${PREV}[$i:v]xfade=transition=slideleft:duration=$TR:offset=$OFF[v$i];"
  PREV="[v$i]"
  ACC=$(python3 -c "print(round($ACC + ${DURS[$i]} - $TR, 3))")
done
FILTER="${FILTER}${PREV}fps=30,format=yuv420p,setsar=1[out]"

echo "⏱ 길이 = ${ACC}초"
$FF -y "${ARGS[@]}" -filter_complex "$FILTER" -map "[out]" \
  -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -t "$ACC" "$OUT" 2>&1 | tail -3
ls -la "$OUT"
