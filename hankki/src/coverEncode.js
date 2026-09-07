// 🎴📦 자랑카드 표지를 «작게» 굽는다 — WebP 가 되면 WebP, 안 되면 JPEG (2026-09-07 · 큰 틀 2)
//
// 🔢 실측 (`scripts/_probe-표지webp-0907.mjs` · 크롬 141 · 1620×2025 카드 3판)
//    JPEG q0.86 314·327·521KB → WebP q0.8 118·102·243KB = **31~47%** · 100% 눈 비교 = 차이 없음
//    → 1만 명 표지 저장 62GB → ≈24GB · 무료 1GiB 벽에 닿는 유저 160명 → ≈420명 (계획 §3-b ② 갱신)
//    ⛔ 계획에 「1/8」이라 적혔던 건 PNG→WebP 비율이었다 — 표지는 이미 JPEG 이라 그만큼은 안 준다.
//
// ⛔⛔ **사파리(아이폰)는 캔버스가 WebP 를 못 굽는다** — MDN 호환표 `HTMLCanvasElement.toDataURL`
//    `type_parameter_webp` safari = false. 그때 `toDataURL('image/webp')` 는 **조용히 PNG 를 준다** —
//    PNG 는 JPEG 보다 «훨씬 크다»(같은 카드 ≈1.5MB). 그래서 «머리글자»를 보고 아니면 JPEG 으로 간다.
//    📌 실패의 모양 = 「아이폰은 지금과 똑같이 JPEG」 — 나빠지는 쪽이 없다.
//
// ⭐ 캔버스를 받는다(그림이 아니라) — 두 번 풀지 않게. `html-to-image` 의 `toCanvas` 가 준다.

export const 표지WEBP품질 = 0.8
export const 표지JPEG품질 = 0.86   // ⛔ 지금 저장하는 값 그대로(ShareDrawCard.saveCover) — 여기서 바꾸지 않는다

/**
 * @param 캔버스  { toDataURL(type, quality) }
 * @returns { url, 종류: 'webp' | 'jpeg' }
 */
export function 표지굽기 (캔버스) {
  let webp = ''
  try { webp = 캔버스.toDataURL('image/webp', 표지WEBP품질) || '' } catch { webp = '' }
  // ⭐ 머리글자로 판정한다 — 「못 굽는 브라우저」는 던지지 않고 PNG 를 «돌려준다»
  if (webp.startsWith('data:image/webp')) return { url: webp, 종류: 'webp' }
  return { url: 캔버스.toDataURL('image/jpeg', 표지JPEG품질), 종류: 'jpeg' }
}
