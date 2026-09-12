// 🌑🛒 주부의 장바구니 릴스 2판 — 다크 8장 (2026-09-12)
//
// 📮 창업자 = *"다크모드좋다"* · *"다크 2안 좋아"* · *"아까릴스 아이콘넣으면 되게 좋았던거같애"*
//    ＋ 고정멘트 = *"오늘도 한끼하세요. 주말에도 한끼하세요"* (docs/인스타-고정멘트-2026-09-12.md)
//
// ⭐⭐ **짜임을 장마다 «갈랐다»** — 창업자 = *"네가준시안2개 똑같아보여"*
//    모서리글자+기울인그림 / 아이콘촤르륵 / 말풍선 / 알약구름 / 큰숫자 / 끝
//    ⛔ 같은 틀에 글자만 바꾸면 「제목만 바뀐 화면」이 된다.
// ⛔ 몰 알약에 «개수»를 안 쓴다 — 창업자 = *"너무 쿠팡 몰빵같아 보여서"*
// 🔢 모든 숫자는 curation.js 를 세어 나온다 (⛔손으로 적지 않는다)
// 📏 인스타 안전띠 = 위 240 · 아래 384 → 글은 y 300~1500 안에
import { chromium } from 'playwright'
import { readFileSync, existsSync, mkdirSync, rmSync } from 'node:fs'
const R = '/home/user/hankki/hankki'
const 오늘 = '2026-09-12'
const 낼곳 = process.env.OUT || '/tmp/큐레다크8'
rmSync(낼곳, { recursive: true, force: true }); mkdirSync(낼곳, { recursive: true })
const F = (n) => readFileSync(`${R}/src/assets/fonts/${n}`).toString('base64')
const 고운 = F('gowun-dodum-korean-400.woff2'), 라틴 = F('gowun-dodum-latin-400.woff2')
const PNG = (p) => 'data:image/png;base64,' + readFileSync(p).toString('base64')
const 아이콘 = (k) => { const p = `${R}/src/assets/curation/${k}.png`; return existsSync(p) ? PNG(p) : '' }

// ── 저장소에서 읽는다 ────────────────────────────────────
const s = readFileSync(`${R}/src/data/curation.js`, 'utf8')
const body = s.slice(s.indexOf('const CURATION_ALL = ['))
const 자리 = [...body.matchAll(/cat: '([^']+)', group: '([^']+)', emoji: '[^']*', icon: '([^']+)'/g)]
  .map((m) => ({ cat: m[1], group: m[2], icon: m[3], at: m.index }))
const 탭 = []
for (const z of 자리) if (!탭.some((t) => t[0] === z.group)) 탭.push([z.group, z.icon])
let 열림 = 0, 앞 = 0
for (const it of body.matchAll(/^\s*\{ name: '([^']*)'(.*)$/gm)) {
  const f = /from: '(\d{4}-\d\d-\d\d)'/.exec(it[0])
  if (!f || f[1] <= 오늘) 열림++; else 앞++
}
console.log(`🔢 탭 ${탭.length} · 열림 ${열림} · 앞으로 ${앞}`)

const b = await chromium.launch(process.env.SMOKE_CHROMIUM ? { executablePath: process.env.SMOKE_CHROMIUM } : {})
const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 })
const 바탕 = 'background:radial-gradient(120% 80% at 50% 0%,#2a1f17 0%,#1b1410 60%,#140f0c 100%)'
const 머리 = `<!doctype html><meta charset=utf-8><style>
@font-face{font-family:'GD';src:url(data:font/woff2;base64,${고운}) format('woff2')}
@font-face{font-family:'GD';src:url(data:font/woff2;base64,${라틴}) format('woff2')}
html,body{margin:0;width:1080px;height:1920px;font-family:GD,sans-serif;overflow:hidden;${바탕};color:#fff}
.corner{position:absolute;left:72px;top:300px;max-width:640px}
.k1{font-size:40px;font-weight:700;color:#e8c89a;margin-bottom:14px}
.k2{font-size:72px;font-weight:700;line-height:1.18;letter-spacing:-.03em;text-shadow:0 6px 24px rgba(0,0,0,.6)}
.tilt{position:absolute;left:210px;top:600px;width:900px;transform:rotate(-4deg);
  border-radius:44px;overflow:hidden;box-shadow:-30px 40px 100px rgba(0,0,0,.7);border:3px solid rgba(232,200,154,.3)}
.tilt img{display:block;width:900px}
.mid{position:absolute;left:0;right:0;top:300px;text-align:center}
.m1{font-size:72px;font-weight:700;letter-spacing:-.03em;text-shadow:0 6px 24px rgba(0,0,0,.6)}
.m2{margin-top:24px;font-size:42px;font-weight:700;color:#e8c89a}
.grid{position:absolute;left:64px;right:64px;top:560px;display:grid;grid-template-columns:repeat(4,1fr);
  justify-items:center;gap:56px 10px}
.ic{display:flex;flex-direction:column;align-items:center;gap:14px;width:230px}
.ic img{width:190px;height:190px;object-fit:contain;filter:drop-shadow(0 14px 26px rgba(0,0,0,.55))}
.ic span{font-size:34px;font-weight:700;color:#f2e4cf;text-align:center;white-space:nowrap}
.cloud{position:absolute;left:60px;right:60px;top:560px;display:flex;flex-wrap:wrap;justify-content:center;gap:30px 24px}
.mall{font-size:62px;font-weight:700;color:#1b1410;background:#f2e4cf;border-radius:999px;white-space:nowrap;
  padding:24px 46px;box-shadow:0 14px 34px rgba(0,0,0,.5)}
.foot{position:absolute;left:0;right:0;bottom:620px;text-align:center}
.f1{font-size:66px;font-weight:700;letter-spacing:-.03em;text-shadow:0 6px 24px rgba(0,0,0,.6)}
.f2{margin-top:26px;font-size:40px;font-weight:700;color:#e8c89a}
.f2 b{color:#fff;border-bottom:3px dashed rgba(232,200,154,.6);padding-bottom:4px}
/* 💬 말풍선 — 「파는 말이 아니라 쓰는 말」 이 릴스의 값어치다 */
.quote{position:absolute;left:80px;right:80px;top:520px;background:#f6f1e7;color:#2b2118;
  border-radius:48px;padding:56px 56px 48px;box-shadow:0 24px 60px rgba(0,0,0,.6)}
.quote p{margin:0;font-size:52px;line-height:1.5;letter-spacing:-.02em}
.quote .who{margin-top:34px;font-size:34px;font-weight:700;color:#8a6a3e}
.tail{position:absolute;left:170px;top:1000px;width:0;height:0;
  border-left:44px solid transparent;border-right:0 solid transparent;border-top:52px solid #f6f1e7}
/* 🔢 숫자 두 개 — 열린 것과 줄 서 있는 것 */
.nums{position:absolute;left:0;right:0;top:620px;display:flex;justify-content:center;gap:70px}
.num{text-align:center}
.num em{display:block;font-style:normal;font-size:200px;font-weight:700;line-height:1;letter-spacing:-.05em}
.num span{display:block;margin-top:22px;font-size:40px;font-weight:700;color:#e8c89a}
.num.dim em{color:#8a6a3e}
.end{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:34px}
.e1{font-size:56px;font-weight:700;color:#e8c89a}
.e2{font-size:104px;font-weight:700;letter-spacing:-.03em}
.e3{margin-top:18px;font-size:52px;font-weight:700;color:#1b1410;background:#f2e4cf;
  padding:22px 52px;border-radius:999px}
</style>`
const 찍기 = async (n) => { await p.waitForTimeout(220); await p.screenshot({ path: `${낼곳}/${n}.jpg`, type: 'jpeg', quality: 94 }); console.log('📸', n) }

// ① 훅 — 모서리 글자 ＋ 기울인 앱 화면
await p.setContent(`${머리}<div class=corner><div class=k1>주부의 장바구니</div>
<div class=k2>18년차 주부가<br>직접 써본 것만</div></div>
<div class=tilt><img src="${PNG('/tmp/큐레샷2/1-장보기-위.png')}"></div>`)
await 찍기('1-훅')

// ② 탭 — 아이콘 촤르륵 (창업자가 제철 릴스에서 좋다고 한 방식)
await p.setContent(`${머리}<div class=mid><div class=m1>${탭.length}개 칸으로 나눠 뒀어요</div>
<div class=m2>찾는 것만 눌러서 보면 돼요</div></div>
<div class=grid>${탭.map(([g, k]) => `<div class=ic><img src="${아이콘(k)}"><span>${g}</span></div>`).join('')}</div>`)
await 찍기('2-탭')

// ③ 제품 카드 — ⛔①번과 같은 머리 화면을 또 쓰면 「제목만 바뀐 화면」이 된다(창업자 지적).
//    카드 «한 장»만 오려서 크게. 그래야 「왜 좋은지가 적혀 있다」는 말이 눈에 보인다.
//    🔢 원본 1170x2532 · 폭 940 으로 줄이면 배율 0.803 → 카드 자리 y 1560 부터
await p.setContent(`${머리}<div class=corner><div class=k1>제품마다</div>
<div class=k2>왜 좋은지가<br>적혀 있어요</div></div>
<div style="position:absolute;left:70px;top:640px;width:940px;height:660px;overflow:hidden;
  border-radius:40px;box-shadow:0 30px 80px rgba(0,0,0,.65);border:3px solid rgba(232,200,154,.3)">
  <img src="${PNG('/tmp/큐레샷2/t1-전체.png')}" style="display:block;width:940px;margin-top:-1253px"></div>`)
await 찍기('3-카드')

// ④ 주부의 말 — 말풍선. ⛔한 글자도 지어내지 않았다(curation.js 낫또 benefit 원문)
await p.setContent(`${머리}<div class=mid><div class=m1>파는 말이 아니라</div><div class=m2>쓰는 말이에요</div></div>
<div class=quote><p>“낫또를 썩 좋아하진 않는데…<br>그중에 자연드림 낫또가<br>제 입맛에는 제일 괜찮았어요”</p>
<div class=who>— 주부의 장바구니 · 낫또</div></div>`)
await 찍기('4-말')

// ⑤ 몰 — 알약 (⛔개수 안 씀)
await p.setContent(`${머리}<div class=cloud>${['쿠팡', '마켓컬리', '한살림', '자연드림', '오아시스'].map((m) => `<div class=mall>${m}</div>`).join('')}</div>
<div class=foot><div class=f1>한 몰에 묶이지 않아요</div>
<div class=f2>코스트코 · 트레이더스는 <b>준비중</b></div></div>`)
await 찍기('5-몰')

// ⑥ 숫자 — 열린 것 / 줄 서 있는 것
await p.setContent(`${머리}<div class=mid><div class=m1>매주 토요일 3개씩</div><div class=m2>계속 열려요</div></div>
<div class=nums><div class=num><em>${열림}</em><span>지금 열린 것</span></div>
<div class="num dim"><em>${앞}</em><span>줄 서 있는 것</span></div></div>`)
await 찍기('6-숫자')

// ⑦ 아직 안 열린 칸 — 비어 있는 게 사실이다
await p.setContent(`${머리}<div class=mid><div class=m1>아직 안 열린 칸도 있어요</div><div class=m2>열리면 알려드릴게요</div></div>
<div class=grid style="top:640px;grid-template-columns:repeat(3,1fr)">${[['빵·떡', 'cu_tteok'], ['김치·절임', 'cu_kimchi'], ['음료', 'cu_coffee']]
  .map(([g, k]) => `<div class=ic><img src="${아이콘(k)}" style="opacity:.42"><span style="color:#e8c89a">${g}</span></div>`).join('')}</div>`)
await 찍기('7-앞으로')

// ⑧ 끝 — ⛔고정멘트로 닫는다 (오늘 = 토요일)
await p.setContent(`${머리}<div class=end><div class=e1>주부의 장바구니</div>
<div class=e2>한끼</div><div class=e3>주말에도 한끼하세요</div></div>`)
await 찍기('8-끝')
console.log(`\n✅ ${낼곳}`)
await b.close()
