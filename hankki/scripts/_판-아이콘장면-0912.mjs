// 🍱 릴스 ① 아이콘 장면 — 제철 · 우리집레시피 · SNS (2026-09-12)
//
// 📮 창업자 = *"제철레시피 8.9월 9.10월 한장에 넣고. 그 다음장에 우리집레시피 넣자"*
//    ＋ *"지금까지 열린거 역시 적어줘"* ＋ *"아이콘으로 만들면 더 좋고"* ＋ *"sns도 아이콘으로"*
//
// ⛔ 값을 손으로 적지 않는다 — `weekly.js`·`basics.js` 에서 «지금» 열린 것을 읽어 그린다.
import { chromium } from 'playwright'
import { readFileSync, existsSync } from 'node:fs'
const R = '/home/user/hankki/hankki'
const 오늘 = '2026-09-12'
const 그림 = (k, 폴더) => {
  for (const f of 폴더 ? [폴더] : ['ing', 'photo']) {
    const p = `${R}/src/assets/stickers/${f}/${k}.png`
    if (existsSync(p)) return 'data:image/png;base64,' + readFileSync(p).toString('base64')
  }
  return ''
}
const 폰트 = readFileSync(`${R}/src/assets/fonts/gowun-dodum-korean-400.woff2`).toString('base64')

// ── ① 제철 — 지난 것과 앞으로 올 것을 «한 장»에
const 제철 = {
  이름: '04-제철',
  큰: '제철 레시피',
  줄들: [
    ['8·9월', [['오징어','ig_s9_16'],['깻잎','ig_s2_08'],['토마토','ig_s7_04'],['햅쌀','ig_s11_08'],['꽃게','ig_s9_13']]],
    ['9·10월', [['가지','ig_s2_02'],['버섯','ig_s3_12'],['고구마','ig_s8_13'],['대하','ig_s6_07'],['고등어','ig_s6_01']]],
  ],
}
// ── ② 우리집레시피 — weekly.js HOMEMADE 에서 «열린» 것만
const w = readFileSync(`${R}/src/data/weekly.js`, 'utf8')
const { 레시피들 } = await import(`${R}/scripts/recipe.mjs`)
const 편 = new Map(레시피들().map((r) => [r.id, r]))
// ⭐ [창업자 2026-09-12] *"우리집레시피는 10월꺼 안넣나 sns랑."*
//    제철이 「8·9월 / 9·10월」 두 줄이니 우리집·SNS 도 같은 문법으로 «지난 것 / 앞으로»를 다 보여준다.
const 우리집지난 = [], 우리집앞 = []
for (const m of w.matchAll(/\{ from: '(2026-\d\d-\d\d)', title: '우리집레시피'[\s\S]{0,200}?ids: \[([^\]]*)\]/g)) {
  if (m[1] > '2026-10-31') continue
  const 통 = m[1] <= 오늘 ? 우리집지난 : 우리집앞
  for (const i of [...m[2].matchAll(/'([^']+)'/g)].map((x) => x[1])) {
    const r = 편.get(i); if (r) 통.push([r.title, r.icon || r.thumb])
  }
}
// ── ③ SNS — sourceName 이 있는 열린 편
const snsAll = 레시피들().filter((r) => r.sourceName && (!r.from || r.from <= '2026-10-31'))
const sns지난 = snsAll.filter((r) => !r.from || r.from <= 오늘).map((r) => [r.title, r.icon || r.thumb])
const sns앞 = snsAll.filter((r) => r.from && r.from > 오늘).sort((a, b) => a.from.localeCompare(b.from)).slice(0, 6).map((r) => [r.title, r.icon || r.thumb])
console.log(`  🔎 제철 10 · 우리집 ${우리집지난.length}+${우리집앞.length} · SNS ${sns지난.length}+${sns앞.length}`)

const b = await chromium.launch(process.env.SMOKE_CHROMIUM ? { executablePath: process.env.SMOKE_CHROMIUM } : {})
const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 })
const 머리 = `<!doctype html><meta charset=utf-8><style>
@font-face{font-family:'GD';src:url(data:font/woff2;base64,${폰트}) format('woff2')}
html,body{margin:0;width:1080px;height:1920px;background:#FFFDF7;font-family:GD,sans-serif}
.band{position:absolute;left:0;right:0;top:230px;height:190px;display:flex;align-items:center;justify-content:center}
.big{font-size:76px;font-weight:700;color:#fff;background:#5d3410;padding:28px 58px;border-radius:999px;
     letter-spacing:-.03em;white-space:nowrap;box-shadow:0 14px 40px rgba(93,52,16,.34)}
.sec{position:absolute;left:44px;right:44px}
.tag{display:inline-block;font-size:46px;font-weight:700;color:#fff;background:#7a4a1e;
     padding:12px 32px;border-radius:999px;margin-bottom:18px;box-shadow:0 8px 22px rgba(93,52,16,.24)}
/* ⭐ 다섯 개가 «한 줄»에 들어가야 한다 — 4＋1 로 접히면 다섯째가 외톨이가 된다(실제로 그랬다) */
.row{display:flex;flex-wrap:wrap;justify-content:center;gap:18px 6px}
.it{display:flex;flex-direction:column;align-items:center;gap:8px;width:184px}
.it img{width:150px;height:150px;object-fit:contain}
/* ⭐ 이름이 두 줄로 접히면 지저분하다(「새우 해장 파스 / 타」) — 한 줄로 두고 폭에 맞춰 줄인다 */
.it span{font-size:30px;font-weight:700;color:#5d3410;text-align:center;line-height:1.15;
         white-space:nowrap;max-width:100%;overflow:hidden;text-overflow:clip}
</style>`
const 칸 = (것들, 크기) => `<div class=row>${것들.map(([n, k]) => `<div class=it style="width:${크기}px"><img src="${그림(k)}" style="width:${크기 - 34}px;height:${크기 - 34}px"><span>${n}</span></div>`).join('')}</div>`

// 제철 — 두 줄
await p.setContent(`${머리}<div class=band><div class=big>${제철.큰}</div></div>
${제철.줄들.map((x, i) => `<div class=sec style="top:${450 + i * 640}px"><div class=tag>${x[0]}</div>${칸(x[1], 192)}</div>`).join('')}`)
await p.waitForTimeout(400); await p.screenshot({ path: '/tmp/장면/04.jpg', type: 'jpeg', quality: 92 })
console.log('✍️ 04-제철')

// 우리집레시피
// 제철과 «같은 짜임» — 지난 줄 / 앞으로 줄
await p.setContent(`${머리}<div class=band><div class=big>우리집레시피</div></div>
<div class=sec style="top:450px"><div class=tag>8·9월</div>${칸(우리집지난, 192)}</div>
<div class=sec style="top:1090px"><div class=tag>9·10월</div>${칸(우리집앞, 178)}</div>`)
await p.evaluate(() => document.querySelectorAll('.it span').forEach((s) => {
  // 이름이 칸보다 넓으면 «그 칸만» 글씨를 줄인다 — 접히는 것보다 낫다
  for (let f = 30; f > 18 && s.scrollWidth > s.clientWidth; f -= 1) s.style.fontSize = f + 'px'
}))
await p.waitForTimeout(400); await p.screenshot({ path: '/tmp/장면/05.jpg', type: 'jpeg', quality: 92 })
console.log('✍️ 05-우리집', 우리집지난.length, '+', 우리집앞.length)

// SNS
await p.setContent(`${머리}<div class=band><div class=big>SNS 레시피</div></div>
<div class=sec style="top:450px"><div class=tag>8·9월</div>${칸(sns지난, 214)}</div>
<div class=sec style="top:1130px"><div class=tag>9·10월</div>${칸(sns앞, 192)}</div>`)
await p.evaluate(() => document.querySelectorAll('.it span').forEach((s) => {
  for (let f = 30; f > 18 && s.scrollWidth > s.clientWidth; f -= 1) s.style.fontSize = f + 'px'
}))
await p.waitForTimeout(400); await p.screenshot({ path: '/tmp/장면/06.jpg', type: 'jpeg', quality: 92 })
console.log('✍️ 06-SNS', sns지난.length, '+', sns앞.length)
await b.close()
