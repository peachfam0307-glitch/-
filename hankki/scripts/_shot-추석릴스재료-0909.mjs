// 📸 추석 릴스 «재료» — 확대해도 안 뭉개지게 3배로 찍는다.
// 📮 창업자 2026-09-09 = *"릴스로 보니까 티도안나고 별로야ㅠ"*
//    ⭐ 뿌리 = 조각이 작고 반투명이라 1080폭에서 «점»으로 보인다.
//       → 릴스에서 «확대»해서 보여주기로 했다. 확대하려면 재료가 커야 한다(그래서 3배).
// 담는 것 = ⓐ장식 «없는» 홈 ⓑ장식 «있는» 홈 ⓒ탭 다섯 상단바(장식 있음)
import './_fresh.mjs'
import { chromium } from 'playwright'
import { readFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join } from 'node:path'
const DIST = new URL('../dist', import.meta.url).pathname
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2', '.jpg': 'image/jpeg' }
const srv = createServer((q, s) => {
  let p = decodeURIComponent(q.url.split('?')[0]); if (p === '/' || !extname(p)) p = '/index.html'
  try { s.writeHead(200, { 'content-type': MIME[extname(p)] || 'application/octet-stream' }); s.end(readFileSync(join(DIST, p))) } catch { s.writeHead(404); s.end() }
})
await new Promise((r) => srv.listen(0, r))
const PORT = srv.address().port
const { SEED_COACH_SEEN } = await import('../src/coach.js')
const b = await chromium.launch({ executablePath: process.env.SMOKE_CHROMIUM })

// ⛔ 「장식 없는 홈」은 코드를 고쳐서 만들지 않는다 — 시계를 창 «밖»으로 옮긴다.
//    그래야 유저가 11월에 보는 화면과 «같은 것»을 찍게 된다(가짜 화면을 만들지 않는다).
const 열기 = async (장식) => {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 })
  await ctx.addInitScript(SEED_COACH_SEEN)
  await ctx.addInitScript((켬) => {
    try {
      localStorage.setItem('hankki:onboarded', '1'); localStorage.setItem('hankki:news:off', '1')
      localStorage.setItem('hankki-theme', 'apricot')
    } catch {}
    if (!켬) {
      // 🕰 명절 창 «밖»(2026-11-20)으로 옮긴다 — 앱이 스스로 「철이 아니다」라고 판단하게 둔다.
      const 진짜 = Date
      const 밖 = new 진짜('2026-11-20T09:00:00+09:00').getTime()
      const 차 = 밖 - 진짜.now()
      class 가짜 extends 진짜 {
        constructor(...a) { super(...(a.length ? a : [진짜.now() + 차])) }
        static now() { return 진짜.now() + 차 }
      }
      globalThis.Date = 가짜
    }
  }, 장식)
  const p = await ctx.newPage()
  await p.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle' })
  await p.waitForTimeout(2400)
  for (let i = 0; i < 5; i++) {
    const 닫았나 = await p.evaluate(() => {
      const b = [...document.querySelectorAll('button, [role="button"]')].filter((x) => x.getBoundingClientRect().height > 8)
        .find((x) => /^(나중에 볼게요|닫기)$/.test((x.innerText || '').trim()))
      if (!b) return false; b.click(); return true
    })
    if (닫았나) { await p.waitForTimeout(400); continue }
    if (!(await p.locator('.sheet-mask').count())) break
    await p.keyboard.press('Escape'); await p.waitForTimeout(300)
  }
  return { ctx, p }
}

const { ctx: c1, p: p1 } = await 열기(false)
await p1.screenshot({ path: '/tmp/추석릴스/홈-민판.png' })
const 조각수0 = await p1.evaluate(() => document.querySelectorAll('body > div[aria-hidden] img').length)
await c1.close()

const { ctx: c2, p: p2 } = await 열기(true)
await p2.screenshot({ path: '/tmp/추석릴스/홈-추석.png' })
const 조각수1 = await p2.evaluate(() => document.querySelectorAll('body > div[aria-hidden] img').length)
for (const [이름, 누를것, 안에서] of [['레시피','레시피'],['일기','일기'],['장보기','장보기'],['냉장고','장보기','냉장고'],['레꾸자랑','레꾸자랑']]) {
  await p2.locator('.bottom-nav .nav-item').filter({ hasText: 누를것 }).first().click().catch(() => {})
  await p2.waitForTimeout(1300)
  if (안에서) {
    await p2.evaluate((n) => [...document.querySelectorAll('button,[role="button"]')].find((x) => (x.innerText || '').trim() === n)?.click(), 안에서)
    await p2.waitForTimeout(1100)
  }
  await p2.screenshot({ path: `/tmp/추석릴스/탭-${이름}.png` })
}
await c2.close(); await b.close(); srv.close()
console.log(`민판 조각 ${조각수0} · 추석판 조각 ${조각수1}`)
// ⛔ 「민판에 장식이 0개」와 「추석판에 장식이 있다」가 둘 다 참이라야 «비교»가 성립한다.
if (조각수0 !== 0 || 조각수1 < 2) { console.error('⛔ 비교가 성립 안 한다'); process.exit(1) }
console.log('✅ 재료 = 홈 민판 · 홈 추석판 · 탭 다섯 (전부 1170×2532)')
