// 🕸 핼러윈 «거미줄 장식» 시안 — 유저가 고른 테마 «위에» 얹는다 (2026-09-09)
//
// 📮 창업자 = *"유저가 선택한테마에 거미줄효과주면? 느낌만 내는거지."*
//    ＋ *"왜 저 시안이 할로윈이야? 배경색을바꾸는 것보다 스티커나 효과만주는게 좋지않을까"*
//    ⭐ 맞는 지적이다 — 앞 시안은 배경색만 바꿔서 「보라 배경」이지 핼러윈이 아니었다.
//
// ⭐⭐ 이 방식의 핵심 = **색을 «박지» 않는다.**
//    거미줄 색 = `var(--text-sub)` 를 옅게. 그러면 밝은 테마에선 연회색, 다크에선 밝은 회보라로
//    **저절로 따라간다** → 그레이지·크림·살구·다크 «어느 테마 위에도» 얹힌다.
//    ⛔ `#333` 처럼 박으면 다크 테마에서 안 보이고, 흰색으로 박으면 밝은 테마에서 안 보인다.
//
// ⛔ 유료팩 컷(핼러윈 16컷)은 «쓰지 않는다** — 파는 물건이다(누수 금지).
//    그래서 SVG 로 그린다 = 받는 파일 무게 0, 어느 크기로 키워도 안 깨진다.
//
// ⛔ 브라우저 경로를 판에 박지 않는다 — `SMOKE_CHROMIUM` 만 읽는다(v10.90 사고)
//
// 쓰는 법 = node scripts/_shot-거미줄시안-0909.mjs
import './_fresh.mjs'
import { chromium } from 'playwright'
import { readFileSync, mkdirSync, rmSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const DIST = join(ROOT, 'dist')
const OUT = process.env.OUT || '/tmp/hankki-거미줄'
rmSync(OUT, { recursive: true, force: true }); mkdirSync(OUT, { recursive: true })

// 🕸 모서리 거미줄 — 왼쪽 위 기준으로 그리고, 오른쪽은 뒤집어 쓴다(그림 하나로 둘)
//    호(arc) 다섯 ＋ 살 다섯. 살을 홀수로 두면 «거미줄»로 읽히고 짝수면 부채로 읽힌다.
const WEB = (id) => `
<svg viewBox="0 0 120 120" width="120" height="120" aria-hidden="true" id="${id}">
  <g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
    <path d="M0 0 L120 0 M0 0 L0 120 M0 0 L96 96 M0 0 L108 46 M0 0 L46 108"/>
    <path d="M26 0 A26 26 0 0 1 0 26"/>
    <path d="M50 0 A50 50 0 0 1 0 50"/>
    <path d="M74 0 A74 74 0 0 1 0 74"/>
    <path d="M98 0 A98 98 0 0 1 0 98"/>
  </g>
</svg>`

// 🕷 거미 — 실에 매달린다. 몸통 둘 ＋ 다리 여덟(우리 그림체에 맞춰 «둥글게»)
const SPIDER = `
<svg viewBox="0 0 60 90" width="46" height="69" aria-hidden="true">
  <line x1="30" y1="0" x2="30" y2="46" stroke="currentColor" stroke-width="1.4"/>
  <g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
    <path d="M22 60 C12 56 8 62 5 70 M22 66 C11 66 7 72 6 80 M38 60 C48 56 52 62 55 70 M38 66 C49 66 53 72 54 80"/>
  </g>
  <ellipse cx="30" cy="52" rx="7" ry="6" fill="currentColor"/>
  <ellipse cx="30" cy="66" rx="11" ry="10" fill="currentColor"/>
  <circle cx="26.5" cy="50" r="1.7" fill="#fff"/><circle cx="33.5" cy="50" r="1.7" fill="#fff"/>
</svg>`

const 시안 = {
  // ⓐ 은은 = 모서리 거미줄 둘만. 「있는 줄도 모르게, 근데 분위기는 바뀌게」
  a: { 이름: 'ⓐ-거미줄만', 투명도: 0.22, 거미: false },
  // ⓑ 확실 = 거미줄 ＋ 거미 한 마리(살짝 흔들린다)
  b: { 이름: 'ⓑ-거미줄＋거미', 투명도: 0.3, 거미: true },
}

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2' }
const srv = createServer((q, s) => {
  let p = decodeURIComponent(q.url.split('?')[0]).replace(/^\/hankki/, ''); if (p === '/' || p === '') p = '/index.html'
  let body, type = MIME[extname(p)] || 'application/octet-stream'
  try { body = readFileSync(join(DIST, p)) } catch { body = readFileSync(join(DIST, 'index.html')); type = 'text/html' }
  s.writeHead(200, { 'content-type': type }); s.end(body)
})
await new Promise((r) => srv.listen(0, r))
const PORT = srv.address().port

const { SEED_COACH_SEEN } = await import('../src/coach.js')
const b = await chromium.launch(process.env.SMOKE_CHROMIUM ? { executablePath: process.env.SMOKE_CHROMIUM } : {})
const ctx = await b.newContext({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 2 })
await ctx.addInitScript(SEED_COACH_SEEN)
await ctx.addInitScript(() => { try { localStorage.setItem('hankki:onboarded', '1'); localStorage.setItem('hankki:news:off', '1') } catch {} })
const p = await ctx.newPage()

const 시트닫기 = async () => {
  for (let i = 0; i < 5; i++) {
    const 닫았나 = await p.evaluate(() => {
      const b = [...document.querySelectorAll('button, [role="button"]')]
        .filter((x) => x.getBoundingClientRect().height > 8)
        .find((x) => /^(나중에 볼게요|닫기)$/.test((x.innerText || '').trim()))
      if (!b) return false; b.click(); return true
    })
    if (닫았나) { await p.waitForTimeout(500); continue }
    if (!(await p.locator('.sheet-mask').count())) break
    await p.keyboard.press('Escape'); await p.waitForTimeout(350)
  }
}

const 얹기 = async (web, spider, 옵션) => p.evaluate(({ web, spider, o }) => {
  document.getElementById('hk-hw')?.remove()
  const d = document.createElement('div'); d.id = 'hk-hw'
  // ⛔ pointer-events:none — 장식이 «누르기»를 먹으면 안 된다(위에 덮이는 자리라 제일 위험한 곳)
  d.style.cssText = `position:fixed;inset:0;z-index:5;pointer-events:none;color:var(--text-sub);opacity:${o.투명도}`
  d.innerHTML = `
    <div style="position:absolute;top:0;left:0">${web}</div>
    <div style="position:absolute;top:0;right:0;transform:scaleX(-1)">${web}</div>
    ${o.거미 ? `<div style="position:absolute;top:0;right:96px;animation:hk-sway 3.2s ease-in-out infinite">${spider}</div>` : ''}`
  document.body.appendChild(d)
}, { web, spider, o: 옵션 })

await p.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle' })
await p.waitForTimeout(2200)
await 시트닫기()

// ⭐ 「어느 테마 위에도 얹힌다」를 증명한다 — 밝은 판(그레이지)과 어두운 판(다크) 둘 다 찍는다
for (const [테마, 이름] of [['greige', '밝은-그레이지'], ['dark', '어두운-다크']]) {
  await p.evaluate((t) => { document.documentElement.dataset.theme = t }, 테마)
  for (const k of ['a', 'b']) {
    await 얹기(WEB('w'), SPIDER, 시안[k])
    await p.waitForTimeout(450)
    await p.screenshot({ path: join(OUT, `${이름}-${시안[k].이름}.png`) })
  }
}
// 🖱 장식이 누르기를 먹지 않나 — 숫자로도 확인한다(눈으로는 안 보이는 사고다)
const 막나 = await p.evaluate(() => {
  const el = document.elementFromPoint(270, 120)
  return el ? (el.closest('#hk-hw') ? '⛔ 장식이 막는다' : '✅ 안 막는다') : '?'
})
console.log(`🖱 누르기 = ${막나}`)
console.log(`📄 ${OUT}`)
await b.close(); srv.close()
