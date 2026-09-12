// 🌑 주부의 장바구니 릴스 2판 — «다크» 시안 두 장 (2026-09-12)
//
// 📮 창업자 = *"살구테마말고 다크버전으로 가볼까?"* → *"한두장만 다크로해보자"*
// ⭐ 두 장을 고른 까닭 = 다크에서 «검증이 필요한 것»이 딱 둘이라서다
//    ① 앱 스샷은 크림색(#FFFDF7)이다 — 다크 위에 얹으면 흰 덩어리로 뜬다. 액자로 보이나, 겉도나?
//    ② 몰 이름 알약 — 로고를 못 쓰니(상표) 글자로 그린다. 다크에서 제일 예쁠 자리.
// ⛔ 크림색 사고의 «반대판» 조심 — 다크에 회색 작은 글씨는 똑같이 안 보인다. 흰 글자 · 큰 알약.
import { chromium } from 'playwright'
import { readFileSync, mkdirSync, rmSync } from 'node:fs'
const R = '/home/user/hankki/hankki'
const 낼곳 = process.env.OUT || '/tmp/큐레다크'
rmSync(낼곳, { recursive: true, force: true }); mkdirSync(낼곳, { recursive: true })
const F = (n) => readFileSync(`${R}/src/assets/fonts/${n}`).toString('base64')
const 고운 = F('gowun-dodum-korean-400.woff2'), 라틴 = F('gowun-dodum-latin-400.woff2')
const PNG = (p) => 'data:image/png;base64,' + readFileSync(p).toString('base64')

const b = await chromium.launch(process.env.SMOKE_CHROMIUM ? { executablePath: process.env.SMOKE_CHROMIUM } : {})
const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 })
// 🎨 따뜻한 다크 — 한끼 갈색 계열이라 살구판과 «같은 집» 으로 읽힌다 (푸른 다크는 남의 앱처럼 보인다)
const 머리 = `<!doctype html><meta charset=utf-8><style>
@font-face{font-family:'GD';src:url(data:font/woff2;base64,${고운}) format('woff2')}
@font-face{font-family:'GD';src:url(data:font/woff2;base64,${라틴}) format('woff2')}
html,body{margin:0;width:1080px;height:1920px;font-family:GD,sans-serif;overflow:hidden;
  background:radial-gradient(120% 80% at 50% 0%,#2a1f17 0%,#1b1410 60%,#140f0c 100%);color:#fff}
.band{position:absolute;left:0;right:0;top:300px;display:flex;flex-direction:column;align-items:center;gap:22px}
.big{font-size:74px;font-weight:700;color:#fff;letter-spacing:-.03em;white-space:nowrap;
  text-shadow:0 6px 24px rgba(0,0,0,.6)}
.sub{font-size:44px;font-weight:700;color:#1b1410;background:#e8c89a;padding:16px 38px;border-radius:999px;white-space:nowrap}
/* 📱 앱 스샷은 크림색이다 — 테두리와 그림자를 줘야 «액자»가 되고, 안 주면 겉돈다 */
.shot{position:absolute;left:50%;transform:translateX(-50%);top:620px;
  border-radius:38px;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.65);border:3px solid rgba(232,200,154,.35)}
.shot img{display:block;width:760px}
.malls{position:absolute;left:70px;right:70px;top:640px;display:flex;flex-wrap:wrap;justify-content:center;gap:26px 22px}
.mall{font-size:56px;font-weight:700;color:#1b1410;background:#f2e4cf;padding:22px 44px;border-radius:999px;
  box-shadow:0 10px 28px rgba(0,0,0,.45)}
.soon{position:absolute;left:70px;right:70px;top:1180px;display:flex;justify-content:center;gap:22px}
.mall.dim{background:transparent;color:#e8c89a;border:4px dashed rgba(232,200,154,.55);box-shadow:none}
.soonlabel{position:absolute;left:0;right:0;top:1080px;text-align:center;font-size:44px;font-weight:700;color:#e8c89a}
</style>`

// ① 앱 스샷을 다크 위에 얹었을 때 — 겉도나, 액자가 되나
await p.setContent(`${머리}
<div class=band><div class=big>18년차 주부가 직접 써본 것만</div><div class=sub>매주 토요일 · 3개씩 열려요</div></div>
<div class=shot><img src="${PNG('/tmp/큐레샷2/1-장보기-위.png')}"></div>`)
await p.waitForTimeout(250)
await p.screenshot({ path: `${낼곳}/다크A-앱스샷.jpg`, type: 'jpeg', quality: 94 }); console.log('📸 다크A-앱스샷')

// ② 몰 알약 — 로고를 못 쓰니 글자로 (⛔상표). 실측 분포 = 쿠팡72·컬리19·한살림14·자연드림11·오아시스3
await p.setContent(`${머리}
<div class=band><div class=big>한 몰에 묶이지 않아요</div><div class=sub>제품마다 «파는 곳»이 달라요</div></div>
<div class=malls>${['쿠팡', '마켓컬리', '한살림', '자연드림', '오아시스'].map((m) => `<div class=mall>${m}</div>`).join('')}</div>
<div class=soonlabel>그리고 준비중</div>
<div class=soon>${['코스트코', '트레이더스'].map((m) => `<div class="mall dim">${m}</div>`).join('')}</div>`)
await p.waitForTimeout(250)
await p.screenshot({ path: `${낼곳}/다크B-몰알약.jpg`, type: 'jpeg', quality: 94 }); console.log('📸 다크B-몰알약')
console.log(`\n✅ ${낼곳}`)
await b.close()
