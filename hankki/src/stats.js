// 📊 앱 이용 통계 — «몇 명이 쓰나»를 우리가 볼 수 있게 하는 유일한 자
//
// 📮 창업자 2026-09-08 = *"콘솔만 업뎃기다리기는 좀.. 막막해 우리도 알수있는 방법이 필요한 듯"*
//    → *"다른앱들도 다 하는거면 우리도 하면돼"* → *"하자 그럼 바로"*
//
// ⛔⛔ **왜 필요했나 — 우리는 유저를 «못 보고» 있었다.**
//    🔢 실측 2026-09-08 = `grep -rn "gtag|analytics|logEvent" src/` → **0건.**
//       Firebase 설정에 `measurementId` 조차 없었다. **앱은 우리에게 아무것도 안 보냈다.**
//    → 비로그인으로 쓰는 사람은 «완전히» 안 보였고, Play 콘솔은 9/1 이후 데이터를 안 줬다.
//
// ⭐⭐ **이 파일이 지키는 규칙 넷**
//   ① 🔇 **통계가 죽어도 앱은 그대로 돈다.** 여기서 나는 모든 오류는 삼킨다.
//      (절대원칙 34 — 실패의 «모양»이 「앱이 멎는다」가 되면 안 된다)
//   ② 🐢 **첫 화면을 늦추지 않는다.** `requestIdleCallback` 으로 **첫 페인트 뒤에** 받는다.
//      🔢 firebase app＋analytics ≈ gzip 40~50KB — 지금 precache 4,740KB 의 1% 남짓이지만
//         «네트워크 왕복»이 첫 화면을 늦춘다. 그래서 무게가 아니라 «시점»을 옮겼다(절대원칙 32).
//   ③ 🔕 **유저가 끌 수 있다.** 방침(`public/privacy.html`)에 「설정 → 이용 통계 보내기」로
//      끌 수 있다고 «적었다». ⛔그러니 그 스위치가 «진짜로» 있어야 한다 — 없으면 방침이 거짓말이다.
//      ⭐ 끄면 **그 자리에서** 멎는다(앱 재시작 필요 없음) — `ga-disable-<id>` 를 켠다.
//   ④ 🙈 **레시피·일기·사진의 «내용»은 절대 안 보낸다.** 화면 이름과 숫자만 보낸다.
//      ⛔ 이벤트에 유저가 쓴 글자를 담지 말 것. 담는 순간 개인정보가 되고 방침이 어긋난다.
//
// ⚠️ 우리 앱은 **웹(TWA)** 이라 광고 ID 를 안 쓴다 — 브라우저 저장소의 임의 번호를 쓴다.
//    근거 = https://support.google.com/analytics/answer/9356035 (`advertising_id` 는 웹 미지원)

// 🔑 Firebase 콘솔 → 프로젝트 설정 → 일반 → 내 앱(웹) → SDK 설정 에서 받는 값.
//   ⛔ **비어 있으면 이 파일은 «아무 일도 안 한다»** — 조용히 통과한다(에러 안 냄).
//      그래야 아직 안 켠 상태로 배포돼도 앱이 멀쩡하다.
export const MEASUREMENT_ID = 'G-L20V2VE1CS'

const 열쇠 = 'hankki:stats:off'

/** 🔕 유저가 껐나 — ⛔읽기가 터지면 «안 보낸다»(유저에게 유리한 쪽으로 실패한다).
 *   🔢 2026-09-02 에 창업자 폰에서 저장이 실제로 터졌다(절대원칙 32가 나온 사고). */
export function 통계꺼짐() {
  try { return localStorage.getItem(열쇠) === '1' } catch { return true }
}

/** 🔀 스위치 — 켜고 끈다. ⛔끄면 «그 자리에서» 멎어야 한다(다음에 켤 때 말고). */
export function 통계끄기설정(끌까) {
  try { 끌까 ? localStorage.setItem(열쇠, '1') : localStorage.removeItem(열쇠) } catch { /* 못 써도 넘어간다 */ }
  // ⭐ gtag 의 공식 «즉시 끄기» 스위치 — 이 창이 켜져 있으면 더 이상 안 보낸다.
  //   근거 = https://developers.google.com/analytics/devguides/collection/ga4/disable-analytics
  try { if (MEASUREMENT_ID) window[`ga-disable-${MEASUREMENT_ID}`] = !!끌까 } catch { /* noop */ }
}

let 붙였나 = false

/** 🚀 앱이 뜬 «뒤에» 부른다. 두 번 불러도 한 번만 붙는다. */
export function 통계시작() {
  if (붙였나 || !MEASUREMENT_ID) return
  붙였나 = true
  // 🔕 꺼져 있으면 «받지도» 않는다 — 끈 사람에게 40KB 를 내려받게 하지 않는다.
  if (통계꺼짐()) { 통계끄기설정(true); return }

  const 나중에 = window.requestIdleCallback || ((f) => setTimeout(f, 2000))
  나중에(async () => {
    try {
      const [{ initializeApp, getApps }, { getAnalytics, isSupported }] = await Promise.all([
        import('firebase/app'),
        import('firebase/analytics'),
      ])
      if (!(await isSupported())) return   // ⛔ 사파리 사생활 모드 등 — 조용히 넘어간다
      // ⭐ 주소는 `cloud.js` 것을 그대로 쓴다 — 두 곳에 적으면 한쪽이 반드시 낡는다.
      const { FIREBASE_설정 } = await import('./cloud.js')
      const app = getApps().length ? getApps()[0] : initializeApp({ ...FIREBASE_설정, measurementId: MEASUREMENT_ID })
      getAnalytics(app)
    } catch { /* ⛔ 통계가 죽어도 앱은 그대로 돈다 */ }
  })
}
