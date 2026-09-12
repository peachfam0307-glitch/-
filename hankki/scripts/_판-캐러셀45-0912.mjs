// 📸 인스타 캐러셀 4:5 (1080×1350) — 릴스와 «같은 내용», 자리만 다시 (2026-09-12)
//
// 📮 창업자 = *"캐러셀도 줄랭?"* → *"인스타용으로"*
// ⭐ 왜 4:5 인가 = 인스타 피드에서 화면을 제일 크게 쓴다. 9:16 을 올리면 위아래가 잘린다.
// ⛔ 릴스 글자판(1920 높이)을 그대로 쓰면 안 된다 — 자리가 다 어긋난다. 여기서 다시 그린다.
import { chromium } from 'playwright'
import { readFileSync, existsSync, mkdirSync, rmSync } from 'node:fs'
const R = '/home/user/hankki/hankki'
const 오늘 = '2026-09-12'
const 낼곳 = process.env.OUT || '/tmp/캐러셀'
rmSync(낼곳, { recursive: true, force: true }); mkdirSync(낼곳, { recursive: true })

const 고침 = { ig_s9_16: '/tmp/오징어-온전.png' }
const 그림 = (k) => {
  if (고침[k] && existsSync(고침[k])) return 'data:image/png;base64,' + readFileSync(고침[k]).toString('base64')
  for (const f of ['ing', 'photo']) {
    const p = `${R}/src/assets/stickers/${f}/${k}.png`
    if (existsSync(p)) return 'data:image/png;base64,' + readFileSync(p).toString('base64')
  }
  return ''
}
const 폰트 = readFileSync(`${R}/src/assets/fonts/gowun-dodum-korean-400.woff2`).toString('base64')
const 폰트라틴 = readFileSync(`${R}/src/assets/fonts/gowun-dodum-latin-400.woff2`).toString('base64')

// ── 값은 저장소에서 읽는다 (손으로 안 적는다)
const w = readFileSync(`${R}/src/data/weekly.js`, 'utf8')
const { 레시피들 } = await import(`${R}/scripts/recipe.mjs`)
const 편 = new Map(레시피들().map((r) => [r.id, r]))
const 소스류 = /소스$|양념$|드레싱$|장아찌$/
const 우지난 = [], 우앞 = []
for (const m of w.matchAll(/\{ from: '(2026-\d\d-\d\d)', title: '우리집레시피'[\s\S]{0,200}?ids: \[([^\]]*)\]/g)) {
  if (m[1] > '2026-10-31') continue
  const 통 = m[1] <= 오늘 ? 우지난 : 우앞
  for (const i of [...m[2].matchAll(/'([^']+)'/g)].map((x) => x[1])) {
    const r = 편.get(i); if (r && !소스류.test(r.title)) 통.push([r.title, r.icon || r.thumb])
  }
}
const snsAll = 레시피들().filter((r) => r.sourceName && (!r.from || r.from <= '2026-10-31'))
const sns지난 = snsAll.filter((r) => !r.from || r.from <= 오늘).map((r) => [r.title, r.icon || r.thumb])
const sns앞 = snsAll.filter((r) => r.from && r.from > 오늘).sort((a, b) => a.from.localeCompare(b.from)).slice(0, 4).map((r) => [r.title, r.icon || r.thumb])
const 제철 = [
  ['8·9월', [['오징어','ig_s9_16'],['깻잎','ig_s2_08'],['토마토','ig_s7_04'],['햅쌀','ig_s11_08'],['꽃게','ig_s9_13']]],
  ['9·10월', [['가지','ig_s2_02'],['버섯','ig_s3_12'],['고구마','ig_s8_13'],['대하','ig_s6_07'],['고등어','ig_s6_01']]],
]

const b = await chromium.launch(process.env.SMOKE_CHROMIUM ? { executablePath: process.env.SMOKE_CHROMIUM } : {})
const p = await b.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 })
const 머리 = `<!doctype html><meta charset=utf-8><style>
@font-face{font-family:'GD';src:url(data:font/woff2;base64,${폰트}) format('woff2')}
@font-face{font-family:'GD';src:url(data:font/woff2;base64,${폰트라틴}) format('woff2')}
html,body{margin:0;width:1080px;height:1350px;background:#FFFDF7;font-family:GD,sans-serif;overflow:hidden}
.band{position:absolute;left:0;right:0;top:60px;display:flex;flex-direction:column;align-items:center;gap:16px}
.big{font-size:62px;font-weight:700;color:#fff;background:#5d3410;padding:22px 46px;border-radius:999px;
     letter-spacing:-.03em;white-space:nowrap;box-shadow:0 12px 32px rgba(93,52,16,.32)}
.sub{font-size:38px;font-weight:700;color:#fff;background:#7a4a1e;padding:14px 32px;border-radius:999px;
     white-space:nowrap;box-shadow:0 8px 22px rgba(93,52,16,.24)}
.sec{position:absolute;left:44px;right:44px}
.tag{display:inline-block;font-size:38px;font-weight:700;color:#fff;background:#7a4a1e;
     padding:10px 26px;border-radius:999px;margin-bottom:14px;box-shadow:0 6px 18px rgba(93,52,16,.22)}
.row{display:grid;grid-template-columns:repeat(4,1fr);justify-items:center;gap:14px 8px}
.row.five{grid-template-columns:repeat(5,1fr);gap:14px 6px}
.it{display:flex;flex-direction:column;align-items:center;gap:6px}
.it span{font-size:26px;font-weight:700;color:#5d3410;text-align:center;white-space:nowrap}
.shot{position:absolute;left:0;right:0;bottom:0;top:250px;display:flex;justify-content:center;align-items:flex-start}
.shot img{height:1100px;object-fit:contain;object-position:top}
</style>`
const 칸 = (것들, 크기, 다섯) => `<div class="row${다섯 ? ' five' : ''}">${것들.map(([n, k]) => `<div class=it style="width:${크기}px"><img src="${그림(k)}" style="width:${크기 - 16}px;height:${크기 - 16}px;object-fit:contain"><span>${n}</span></div>`).join('')}</div>`
const 줄맞춤 = async () => p.evaluate(() => {
  document.querySelectorAll('.big,.sub').forEach((el) => {
    const 처음 = parseFloat(getComputedStyle(el).fontSize)
    for (let s = 처음; s > 22 && el.getBoundingClientRect().width > 1000; s -= 2) el.style.fontSize = s + 'px'
  })
  document.querySelectorAll('.it span').forEach((s) => {
    for (let f = 26; f > 16 && s.scrollWidth > s.clientWidth; f -= 1) s.style.fontSize = f + 'px'
  })
})
const 찍기 = async (이름) => { await 줄맞춤(); await p.waitForTimeout(250); await p.screenshot({ path: `${낼곳}/${이름}.jpg`, type: 'jpeg', quality: 94 }); console.log('📸', 이름) }
const 앱 = (png) => `<div class=shot><img src="data:image/png;base64,${readFileSync(png).toString('base64')}"></div>`

// ① 출시 ＋ 87편 (앱 목록)
await p.setContent(`${머리}${앱('/tmp/릴스8장/2b-목록-중간.png')}
<div class=band><div class=big>8월 21일 출시 · 신상 레시피앱 「한끼」</div><div class=sub>레시피 87편이 들어 있어요 · 9월 11일 기준</div></div>`)
await 찍기('1-출시')
// ② 매주 6편 (앱 홈 상자)
await p.setContent(`${머리}${앱('/tmp/릴스8장/3b-우리집.png')}
<div class=band><div class=big>매주 6편씩 새로 열려요</div><div class=sub>제철 · 우리집 · SNS</div></div>`)
await 찍기('2-주기')
// ③ 제철
await p.setContent(`${머리}<div class=band><div class=big>제철 레시피</div></div>
${제철.map((x, i) => `<div class=sec style="top:${240 + i * 540}px"><div class=tag>${x[0]}</div>${칸(x[1], 196, true)}</div>`).join('')}`)
await 찍기('3-제철')
// ④ 우리집레시피
await p.setContent(`${머리}<div class=band><div class=big>우리집레시피</div></div>
<div class=sec style="top:240px"><div class=tag>8·9월</div>${칸(우지난.slice(0, 4), 226)}</div>
<div class=sec style="top:760px"><div class=tag>9·10월</div>${칸(우앞.slice(0, 4), 226)}</div>`)
await 찍기('4-우리집')
// ⑤ SNS
await p.setContent(`${머리}<div class=band><div class=big>SNS 레시피</div></div>
<div class=sec style="top:240px"><div class=tag>8·9월</div>${칸(sns지난.slice(0, 4), 226)}</div>
<div class=sec style="top:760px"><div class=tag>9·10월</div>${칸(sns앞, 226)}</div>`)
await 찍기('5-SNS')
// ⑥ 인분 — 눌러서 양이 바뀐다 (1인분 ↔ 3인분)
const 오림 = (png, w) => `<img src="data:image/png;base64,${readFileSync(png).toString('base64')}" style="width:${w}px;border-radius:22px;box-shadow:0 10px 30px rgba(93,52,16,.18)">`
await p.setContent(`${머리}<div class=band><div class=big>인분을 누르면 양이 같이 바뀌어요</div></div>
<div class=sec style="top:250px;display:flex;flex-direction:column;align-items:center;gap:22px">
  <div class=tag style="margin:0">1인분</div>${오림('/tmp/릴스8장/5b2-오림-1인분.png', 820)}
  <div class=tag style="margin:0">3인분</div>${오림('/tmp/릴스8장/5d2-오림-3인분.png', 820)}
</div>`)
await 찍기('6-인분')
// ⑦ 총 시간
await p.setContent(`${머리}<div class=band><div class=big>총 몇 분 걸리는지도 적혀 있어요</div></div>
<div class=sec style="top:280px;display:flex;justify-content:center">${오림('/tmp/릴스8장/5g-오림-총시간.png', 720)}</div>
<div class=shot style="top:520px"><img src="data:image/png;base64,${readFileSync('/tmp/릴스8장/5a-상세-위.png').toString('base64')}" style="height:830px"></div>`)
await 찍기('7-시간')
// ⑧ 끝
await p.setContent(`${머리}<div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:28px">
  <div class=big style="font-size:120px">한끼</div><div class=sub>흩어진 레시피를, 한곳에</div></div>`)
await 찍기('8-끝')
console.log(`\n✅ ${낼곳}`)
await b.close()
