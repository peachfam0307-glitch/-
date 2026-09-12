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
// ⛔ [2026-09-12] 「오징어」 컷(ig_s9_16)이 «잘려서» 저장돼 있다 — 몸통 끝이 그림 밖으로 나갔다.
//    📮 창업자가 원본 시트를 보내 확인해 줬다 — 내가 「원본이 잘렸다」고 잘못 말했다. 원본은 멀쩡하다.
//    ✅ 표준 도구(tools/cut.py)로 다시 잘라 /tmp/오징어-온전.png 에 뒀다.
//    ⏳ 앱 아이콘 교체는 «배포»라 창업자 신호를 기다린다. 릴스에서만 먼저 쓴다.
const 고침 = { ig_s9_16: '/tmp/오징어-온전.png' }
const 그림 = (k, 폴더) => {
  if (고침[k] && existsSync(고침[k])) return 'data:image/png;base64,' + readFileSync(고침[k]).toString('base64')
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
    // ⛔ [창업자 2026-09-12] 소스·양념만 덩그러니 뜨면 어색하다 — *"고마다래소스만 나가??? 요리가 없이?"*
    //    (그 주엔 「목살조림」의 짝으로 나가는 게 맞지만, 릴스 그림으로는 요리만 보여준다)
    const 소스류 = /소스$|양념$|드레싱$|장아찌$/
    const r = 편.get(i); if (r && !소스류.test(r.title)) 통.push([r.title, r.icon || r.thumb])
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
/* ⭐⭐ [창업자 2026-09-12] *"4개씩 넣어줘. 어떤건 1줄에 5개 어떤건 4개 이상해"*
   -> 한 줄에 «넷»으로 못 박는다. grid 로 칸을 넷으로 고정하면 개수와 무관하게 짜임이 같다. */
.row{display:grid;grid-template-columns:repeat(4,1fr);justify-items:center;gap:22px 10px}
.row.five{grid-template-columns:repeat(3,1fr);gap:26px 14px}
.it{display:flex;flex-direction:column;align-items:center;gap:8px;width:184px}
/* ⭐ 창업자 = "그림은 큰게 좋지" — 칸 폭에서 이름 자리만 빼고 다 그림에 준다 */
.it img{width:150px;height:150px;object-fit:contain}
/* ⭐ 이름이 두 줄로 접히면 지저분하다(「새우 해장 파스 / 타」) — 한 줄로 두고 폭에 맞춰 줄인다 */
.it span{font-size:30px;font-weight:700;color:#5d3410;text-align:center;line-height:1.15;
         white-space:nowrap;max-width:100%;overflow:hidden;text-overflow:clip}
</style>`
const 칸 = (것들, 크기, 다섯) => `<div class="row${다섯 ? " five" : ""}">${것들.map(([n, k]) => `<div class=it style="width:${크기}px"><img src="${그림(k)}" style="width:${크기 - 18}px;height:${크기 - 18}px"><span>${n}</span></div>`).join('')}</div>`

// 제철 — 두 줄
// ⛔ [창업자 2026-09-12] "제철 고등어이름 잘림" — 둘째 칸이 너무 아래라 마지막 줄 이름이 1920 밖으로 나갔다.
//    🔢 한 칸 = 이름표 100 ＋ 두 단(칸+76)×2. 칸 280 이면 812 라 420+812+812 = 2044 > 1920 이었다.
// ⛔⛔ 그리고 이 주석을 «템플릿 문자열 안»에 넣었더니 글자로 새어 화면이 통째로 무너졌다.
//    📌 setContent 안에는 주석을 쓰지 않는다.
await p.setContent(`${머리}<div class=band><div class=big>${제철.큰}</div></div>
${제철.줄들.map((x, i) => `<div class=sec style="/* ⛔ 3+2 라 첫 줄이 두 단이 된다 — 둘째 칸을 충분히 내리지 않으면 이름표가 앞 이름을 덮는다(실제로 그랬다) */
top:${380 + i * 740}px"><div class=tag>${x[0]}</div>${칸(x[1], 246, true)}</div>`).join('')}`)
await p.waitForTimeout(400); await p.screenshot({ path: '/tmp/장면/04.jpg', type: 'jpeg', quality: 92 })
console.log('✍️ 04-제철')

// 우리집레시피
// 제철과 «같은 짜임» — 지난 줄 / 앞으로 줄
// ⛔⛔ 자리를 손으로 잡으면 «줄 수»가 바뀔 때 겹친다 — 10개는 4+4+2 로 «세 줄»인데
//    두 줄로 잡아 「9·10월」 이름표가 앞 이름을 덮었다(실제로 그랬다).
//    ✅ 칸 수로 줄 수를 세어 둘째 칸 자리를 «계산»한다.
const 아래자리 = (개수, 한줄, 칸크기) => 430 + 100 + Math.ceil(개수 / 한줄) * (칸크기 + 76) + 60
// ⛔ 10+10 을 한 장에 넣으면 아래가 화면 밖으로 넘친다(1920px) — 줄마다 «여섯»만 보여준다(4+2)
const 우지난 = 우리집지난.slice(0, 6), 우앞 = 우리집앞.slice(0, 6)
const 우자리 = 아래자리(우지난.length, 4, 214)
await p.setContent(`${머리}<div class=band><div class=big>우리집레시피</div></div>
<div class=sec style="top:430px"><div class=tag>8·9월</div>${칸(우지난, 214)}</div>
<div class=sec style="top:${우자리}px"><div class=tag>9·10월</div>${칸(우앞, 214)}</div>`)
await p.evaluate(() => document.querySelectorAll('.it span').forEach((s) => {
  // 이름이 칸보다 넓으면 «그 칸만» 글씨를 줄인다 — 접히는 것보다 낫다
  for (let f = 30; f > 18 && s.scrollWidth > s.clientWidth; f -= 1) s.style.fontSize = f + 'px'
}))
await p.waitForTimeout(400); await p.screenshot({ path: '/tmp/장면/05.jpg', type: 'jpeg', quality: 92 })
console.log('✍️ 05-우리집', 우리집지난.length, '+', 우리집앞.length)

// SNS
await p.setContent(`${머리}<div class=band><div class=big>SNS 레시피</div></div>
<div class=sec style="top:430px"><div class=tag>8·9월</div>${칸(sns지난, 230)}</div>
<div class=sec style="top:${아래자리(sns지난.length, 4, 230)}px"><div class=tag>9·10월</div>${칸(sns앞, 230)}</div>`)
await p.evaluate(() => document.querySelectorAll('.it span').forEach((s) => {
  for (let f = 30; f > 18 && s.scrollWidth > s.clientWidth; f -= 1) s.style.fontSize = f + 'px'
}))
await p.waitForTimeout(400); await p.screenshot({ path: '/tmp/장면/06.jpg', type: 'jpeg', quality: 92 })
console.log('✍️ 06-SNS', sns지난.length, '+', sns앞.length)
await b.close()
