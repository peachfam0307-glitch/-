// ✍️ 릴스에 얹을 «글자판» 낱장 — 우리 폰트로, 브라우저에서 그린다 (2026-09-12)
//
// ⛔ ffmpeg 의 drawtext 는 우리 폰트를 못 읽는다(우리 건 woff2 다).
//    ✅ 그래서 브라우저에서 그려 투명 PNG 로 뽑고 overlay 한다 — 지난 릴스(_판-반짝임-0903)와 같은 길.
//
// 📮 창업자 = *"짜임 신선하고 또렷하게. 촌스럽지않게. 색감도 확 시선사로잡게"*
//    ⭐ 그래서 «흰 글씨에 검은 그림자» 같은 흔한 자막을 안 쓴다 —
//       우리 톤(진갈색 #5d3410 · 크림)으로 **둥근 알약 띠**에 얹는다. 우리 앱 배지와 같은 모양이다.
// ⭐⭐ 숫자(87)는 «앱 화면이 이미» 보여준다 → 글자는 «거드는 말»만. 두 번 말하면 광고로 읽힌다.
import { chromium } from 'playwright'
import { mkdirSync, rmSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = '/home/user/hankki/hankki'
const 낼곳 = process.env.OUT || '/tmp/릴스글자'
rmSync(낼곳, { recursive: true, force: true }); mkdirSync(낼곳, { recursive: true })

// [파일이름, 큰 글자, 작은 글자]
const 판들 = [
  ['01-출시', '8월 21일 출시 · 신상 레시피앱', '「한끼」 에는요'],
  ['02-편수', '레시피 87편이 들어 있어요', '한식 · 양식 · 중식 · 일식 · 간식'],
  ['03-주기', '매주 6편씩 새로 열려요', '제철 · 우리집 · SNS'],
  ['04-지난', '오징어 깻잎 토마토 햅쌀 꽃게', '지금까지 이렇게 열렸어요'],
  ['05-앞으로', '가지 버섯 고구마 대하 고등어', '앞으로 이렇게 열려요'],
  ['06-인분', '인분을 누르면 양이 같이 바뀌어요', '몇 큰술인지 · 몇 분인지'],
  ['07-장보기', '재료는 바로 담아서 사러 가요', ''],
  ['08-끝', '한끼', '흩어진 레시피를, 한곳에'],
]

const b = await chromium.launch(process.env.SMOKE_CHROMIUM ? { executablePath: process.env.SMOKE_CHROMIUM } : {})
const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 })

const 폰트 = readFileSync(join(ROOT, 'src/assets/fonts/gowun-dodum-korean-400.woff2')).toString('base64')
const 폰트라틴 = readFileSync(join(ROOT, 'src/assets/fonts/gowun-dodum-latin-400.woff2')).toString('base64')

for (const [이름, 큰, 작은] of 판들) {
  await p.setContent(`<!doctype html><meta charset=utf-8><style>
@font-face{font-family:'GD';src:url(data:font/woff2;base64,${폰트}) format('woff2')}
@font-face{font-family:'GD';src:url(data:font/woff2;base64,${폰트라틴}) format('woff2')}
html,body{margin:0;width:1080px;height:1920px;background:transparent}
/* 📌 [창업자 2026-09-12] 글자는 «위»로. 인스타가 위 13%·아래 20%를 UI 로 덮으니 15~25% 자리가 안전하다.
   ⭐ 창업자 = *"배경짜임도(제목줄 쭉에 넣어주고) 제목은 잘보이게 큰 글씨로 알약을 써도 좋아"*
      → 제목 줄 «전체»에 크림색 띠를 깔고 그 위에 알약을 얹는다. 앱 배경이 크림이라 흰 알약은 묻혔다.
   ⛔ 캐릭터는 안 붙인다 — 창업자 = *"애들은 안붙여도 될 것 같아. 정신없어"*
      (앱 화면 안에 이미 한끼 친구들이 있다) */
.band{position:absolute;left:0;right:0;top:250px;height:330px;
      background:linear-gradient(180deg,rgba(255,253,247,0) 0%,rgba(255,253,247,.97) 14%,rgba(255,253,247,.97) 86%,rgba(255,253,247,0) 100%)}
.wrap{position:absolute;left:0;right:0;top:250px;height:330px;display:flex;flex-direction:column;
      align-items:center;justify-content:center;gap:22px}
/* 🏷 우리 앱 배지와 같은 «둥근 알약» — 흔한 흰 자막 대신 브랜드 모양을 쓴다 */
/* ⭐ 글씨를 «띠 폭에 맞춰» 자동으로 줄인다 — 긴 문구도 안 잘리고 짧은 건 크게 보인다 */
.big{font-family:GD,sans-serif;font-size:62px;font-weight:700;color:#fff;background:#5d3410;
     padding:22px 46px;border-radius:999px;letter-spacing:-.03em;white-space:nowrap;
     box-shadow:0 12px 34px rgba(93,52,16,.30)}
.sub{font-family:GD,sans-serif;font-size:42px;font-weight:700;color:#5d3410;
     letter-spacing:-.01em;white-space:nowrap}
</style><div class=band></div><div class=wrap><div class=big>${큰}</div>${작은 ? `<div class=sub>${작은}</div>` : ""}</div>`)
  // ⭐ 띠(1080px)보다 글씨가 넓으면 «자동으로» 줄인다 — 긴 문구가 잘려 나가는 걸 막는다
  await p.evaluate(() => {
    const el = document.querySelector(".big")
    for (let s = 62; s > 30 && el.getBoundingClientRect().width > 1000; s -= 2) el.style.fontSize = s + "px"
  })
  await p.waitForTimeout(350)
  await p.screenshot({ path: join(낼곳, `${이름}.png`), omitBackground: true })
  console.log('✍️', 이름, '—', 큰, '·', 작은)
}
await b.close()
console.log(`\n✅ 글자판 ${판들.length}장 → ${낼곳}`)
