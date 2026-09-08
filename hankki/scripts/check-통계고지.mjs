#!/usr/bin/env node
// 📊🔒 **「방침이 약속한 것」과 「앱이 실제로 하는 것」이 어긋나면 배포를 막는다** — 배포 게이트
//
// 📮 창업자 2026-09-08 = *"다른앱들도 다 하는거면 우리도 하면돼"* → 통계를 켜기로 했다.
//
// ⛔⛔ **막는 사고 = 「방침에 적어놓고 앱엔 없는 것」.**
//    개인정보처리방침에 *"설정 → 이용 통계 보내기 를 꺼서 언제든 중단하실 수 있습니다"* 라고 «적었다».
//    그 스위치가 없거나 이름이 바뀌면 **방침이 거짓말이 된다.** 그건 앱이 깨지는 것보다 나쁘다 —
//    유저는 못 알아채고, 나중에 심사에서 걸린다.
//    📌 오늘 실제로 한 번 겪었다 — 네이티브 기준으로 「광고 ID 를 모은다」고 썼는데
//       우리 앱은 웹(TWA)이라 «안» 모았다. 방침이 먼저 틀렸던 것이다.
//
// ⭐ 그래서 «양쪽»을 본다 — 한쪽만 보면 다시 어긋난다.
//   ① 방침에 통계 절이 있나 ↔ ② 코드에 스위치가 있나 (이름이 «글자 그대로» 같아야 한다)
//   ③ 통계를 켰나(measurementId 있나) ↔ 방침이 그걸 말하나
//
// 쓰기: node hankki/scripts/check-통계고지.mjs
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const APP = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => readFileSync(join(APP, p), 'utf8')

let 죽었나 = false
const no = (m) => { console.log(`   ⛔ ${m}`); 죽었나 = true }
const ok = (m) => console.log(`   ✅ ${m}`)

console.log('📊 이용 통계 — 방침과 앱이 같은 말을 하나')

const 방침 = read('public/privacy.html')
const 설정화면 = read('src/screens/ProfileScreen.jsx')
const 갈래 = read('src/settingsGroups.js')
const stats = read('src/stats.js')

// ⭐ 이 한 글자가 «계약»이다 — 방침이 유저에게 알려주는 «그 이름» 그대로여야 찾아간다.
const 스위치이름 = '이용 통계 보내기'

// ① 방침이 그 이름으로 안내하나
if (!방침.includes(스위치이름)) no(`방침에 「${스위치이름}」 안내가 없다 — 유저가 끄는 법을 모른다`)
else ok(`방침이 「${스위치이름}」 로 끄는 법을 알려준다`)

// ② 앱에 그 이름의 스위치가 «진짜로» 있나
const 줄있나 = new RegExp(`label:\\s*'${스위치이름}'`).test(설정화면)
if (!줄있나) no(`설정 화면에 「${스위치이름}」 줄이 없다 — 방침이 없는 스위치를 안내한다`)
else ok('설정 화면에 그 줄이 있다')

if (!갈래.includes(스위치이름)) no(`설정 갈래(settingsGroups.js)에 「${스위치이름}」 이 안 적혔다 — 「그 밖에」로 밀린다`)
else ok('갈래에 제자리로 들어가 있다')

// ③ 끄면 «그 자리에서» 멎나 — gtag 공식 스위치를 안 쓰면 껐는데 계속 보낸다
if (!/ga-disable-/.test(stats)) no('끄기가 «즉시» 안 먹는다 — ga-disable 스위치가 없다(다음에 켤 때까지 계속 보낸다)')
else ok('끄면 그 자리에서 멎는다 (ga-disable)')

// ④ 못 읽으면 «안 보낸다» — 유저에게 유리한 쪽으로 실패해야 한다
if (!/catch\s*{\s*return true\s*}/.test(stats)) no('저장을 못 읽을 때 «보내는» 쪽으로 실패한다 — 껐는데 다시 켜진 것처럼 된다')
else ok('저장이 터져도 «안 보내는» 쪽으로 실패한다')

// ⑤ 방침이 광고 ID 를 말하면 안 된다 — 우리 앱은 웹이라 «안» 쓴다(오늘 실제로 틀렸던 자리)
if (/광고 ID[^를]*를 (?:수집|전송|보냅니다)/.test(방침)) no('방침이 광고 ID 를 모은다고 말한다 — 웹(TWA)은 광고 ID 를 안 쓴다')
else ok('방침이 광고 ID 를 모은다고 말하지 않는다')

// ⑥ 통계를 «켰다면» 방침 시행일이 그날로 갱신됐나 — 옛 방침인 채로 수집이 시작되면 그 사이가 위반이다
const 켰나 = /MEASUREMENT_ID = '(?!')[^']+'/.test(stats)
if (켰나) {
  // ⛔ 날짜를 여기서 «만들지» 않는다 — 앱과 같은 자를 쓴다(check-kst 가 막는다).
  const { todayKST } = await import('../src/today.js')
  const 오늘 = todayKST()
  const 적힌시행일 = (/시행일: (\d{4})년 (\d{1,2})월 (\d{1,2})일/.exec(방침) || []).slice(1).map(Number)
  const 적힌 = 적힌시행일.length === 3
    ? `${적힌시행일[0]}-${String(적힌시행일[1]).padStart(2, '0')}-${String(적힌시행일[2]).padStart(2, '0')}`
    : null
  // 통계를 켠 판을 내보내는 날, 방침 시행일이 «그날 또는 그 뒤»여야 한다
  if (!적힌 || 적힌 < 오늘) {
    no(`통계를 켰는데 방침 시행일이 «옛날»이다(${적힌시행일.join('-') || '없음'}) — 오늘(${오늘})로 바꿔야 한다`)
  } else ok('통계를 켰고, 방침 시행일도 오늘 이후다')
} else {
  ok('아직 통계를 안 켰다(measurementId 비어 있음) — 방침만 먼저 준비된 상태')
}

console.log(죽었나 ? '\n⛔⛔ 방침과 앱이 어긋난다 — 고치고 다시 돌릴 것' : '\n✅ 방침과 앱이 같은 말을 한다')
process.exit(죽었나 ? 1 : 0)
