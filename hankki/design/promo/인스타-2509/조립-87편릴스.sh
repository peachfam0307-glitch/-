#!/usr/bin/env bash
# 🎬📚 **인스타 릴스 — 「깔자마자 레시피 87편」** 2026-09-12
#
# 📮 창업자 = *"처음 유저가 열었을때 레시피가 있는걸 보여주고 싶거든.
#    저장앱이라고 하니까 아무것도 없는 것처럼보일까봐"*
#    ＋ *"그냥 ui로 하자"* (캐릭터 훅 빼기) · *"ui 정확하게 잘림없이 찍고, 짜임 신선하고 또렷하게.
#       촌스럽지않게. 색감도 확 시선사로잡게 효과도 넣어서"*
#
# ⭐⭐ **제일 큰 발견 = 앱이 「전체 87」을 «스스로» 화면에 박아 준다.**
#    한식 37 · 중식 2 · 일식 2 · 양식 14 … 칩이 줄줄이 나온다.
#    → **내가 「87편」이라고 글자를 얹을 필요가 없다.** 앱 화면 자체가 증거다.
#    ⛔ 그래서 글자는 «거드는 말»만 얹는다 — 숫자를 두 번 말하면 광고처럼 읽힌다.
#
# 📐 1080×1920 · 30fps · 무음 · 끝프레임 = 첫프레임(루프)
#    🔢 앱을 폰 비율(390×844)로 찍어 887×1920 → 좌우 96px 씩 크림 여백.
#    ⛔ 확대해 꽉 채우면 좌우가 잘린다 — 창업자가 *"잘림없이"* 라고 했다.
#
# 쓰는 법:  bash design/promo/인스타-2509/조립-87편릴스.sh [낱장폴더]
set -e
FF="/home/user/hankki/hankki/node_modules/ffmpeg-static/ffmpeg"
IN="${1:-/tmp/릴스c}"
OUT="/home/user/hankki/_shots/릴스-87편-초안.mp4"
CREAM="0xF2EFE7"     # 우리 크림 (styles.css 의 --cream 계열)

[ -d "$IN" ] || { echo "⛔ 낱장 폴더가 없다: $IN"; exit 1; }
N=$(ls "$IN"/*.jpg 2>/dev/null | wc -l)
[ "$N" -gt 30 ] || { echo "⛔ 낱장이 $N 장뿐이다 — 뽑기부터 다시"; exit 1; }
echo "🖼 낱장 $N 장"

# ⭐ 색감 — 창업자 *"색감도 확 시선사로잡게"*
#    ⛔ 채도를 세게 올리면 우리 크림 톤이 누렇게 뜬다(뮤트가 우리 색이다).
#    ✅ eq 로 «살짝만»: 채도 1.14 · 대비 1.06 · 밝기 +0.01 ＋ unsharp 로 또렷하게.
#       🔢 값은 눈으로 보고 정한 것이다 — 1.3 은 음식 사진이 타 보였다.
VF="scale=887:1920:flags=lanczos,\
eq=saturation=1.14:contrast=1.06:brightness=0.01,\
unsharp=5:5:0.7:5:5:0.0,\
pad=1080:1920:(ow-iw)/2:0:${CREAM}"

# ✍️ 글자판 — 브라우저에서 우리 폰트로 그린 투명 PNG (scripts/_판-릴스글자-0912.mjs)
#    ⛔ ffmpeg drawtext 는 우리 폰트(woff2)를 못 읽는다 → overlay 로 얹는다.
GL="${GL:-/tmp/릴스글자}"
[ -d "$GL" ] || { echo "⛔ 글자판이 없다: $GL — node scripts/_판-릴스글자-0912.mjs 먼저"; exit 1; }

# ⏱ 낱장 231장 = 7.7초. 장면 경계(프레임 수)
#    0~104 목록 스크롤 · 105~140 상세 멈춤 · 141~230 상세 스크롤
#    ⭐ 글자는 «장면이 바뀌는 자리»에서 갈아탄다. 페이드 0.35초로 부드럽게.
"$FF" -y -framerate 30 -pattern_type glob -i "$IN/*.jpg" \
  -i "$GL/01-훅.png" -i "$GL/02-빈앱.png" -i "$GL/03-고름.png" -i "$GL/06-끝.png" \
  -filter_complex "\
[0:v]${VF}[bg];\
[1:v]format=rgba,fade=t=in:st=0.15:d=0.35:alpha=1,fade=t=out:st=2.2:d=0.35:alpha=1[t1];\
[2:v]format=rgba,fade=t=in:st=0:d=0.35:alpha=1,fade=t=out:st=0.9:d=0.35:alpha=1[t2];\
[3:v]format=rgba,fade=t=in:st=0:d=0.35:alpha=1,fade=t=out:st=2.0:d=0.35:alpha=1[t3];\
[4:v]format=rgba,fade=t=in:st=0:d=0.4:alpha=1[t4];\
[bg][t1]overlay=0:0:enable='between(t,0.1,2.6)'[v1];\
[v1][t2]overlay=0:0:enable='between(t,2.7,4.0)'[v2];\
[v2][t3]overlay=0:0:enable='between(t,4.1,6.5)'[v3];\
[v3][t4]overlay=0:0:enable='gte(t,6.6)'[v]" \
  -map "[v]" \
  -c:v libx264 -pix_fmt yuv420p -profile:v high -crf 18 -r 30 \
  -movflags +faststart "$OUT" 2>&1 | tail -3

echo "✅ $OUT"
"$FF" -i "$OUT" 2>&1 | grep -E "Duration|Stream #0:0" | sed 's/^/   /'
