// ⏱ 「몇 분인지도 적어뒀어요」 — 만드는 법에서 시간이 적힌 걸음을 오린다 (2026-09-12)
//
// 📮 창업자 = *"몇분인지는 캡쳐에 없는데"* ＋ *"따로잘라서 옆에 붙여주던가"*
// ⭐ 된장찌개를 고른 이유 = 「5분 · 5분 · 3분」이 «연달아» 나와서 한 판에 다 든다(실측).
import './_fresh.mjs'
import { chromium } from 'playwright'
import { readFileSync, mkdirSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join } from 'node:path'

const OUT = process.env.SHOT_OUT || '/tmp/릴스8장'
mkdirSync(OUT, { recursive: true })
const DIST = join(new URL('..', import.meta.url).pathname, 'dist')
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2' }
const srv = createServer((q, s) => {
  let p = decodeURIComponent(q.url.split('?')[0]).replace(/^\/hankki/, ''); if (p === '/' || p === '') p = '/index.html'
  let b, t = MIME[extname(p)] || 'application/octet-stream'
  try { b = readFileSync(join(DIST, p)) } catch { b = readFileSync(join(DIST, 'index.html')); t = 'text/html' }
  s.writeHead(200, { 'content-type': t }); s.end(b)
})
await new Promise((r) => srv.listen(0, r))
const PORT = srv.address().port

const { SEED_COACH_SEEN } = await import('../src/coach.js')
const b = await chromium.launch(process.env.SMOKE_CHROMIUM ? { executablePath: process.env.SMOKE_CHROMIUM } : {})
const ctx = await b.newContext({ viewport: { width: 405, height: 720 }, deviceScaleFactor: 2.67 })
await ctx.addInitScript(SEED_COACH_SEEN)
await ctx.addInitScript(() => { try { localStorage.setItem('hankki:onboarded', '1'); localStorage.setItem('hankki:news:off', '1') } catch { /* noop */ } })
let page = await ctx.newPage(); page.setDefaultTimeout(15000)
await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(2500)
const 나중 = page.getByText('나중에 하기', { exact: true })
if (await 나중.count()) {
  await 나중.first().click({ force: true }); await page.waitForTimeout(1200)
  const 시작 = page.getByRole('button', { name: '그냥 시작하기' })
  if (await 시작.count()) { await 시작.first().click({ force: true }); await page.waitForTimeout(1800) }
}
if (await page.getByText('Google 계정으로 시작하기').count()) {
  const p2 = await ctx.newPage(); p2.setDefaultTimeout(15000)
  await p2.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'domcontentloaded' }); await p2.waitForTimeout(2500)
  await page.close(); page = p2
}

// 🔎 된장찌개로 — 검색으로 바로 간다
await page.getByRole('button', { name: '레시피', exact: true }).first().click({ force: true })
await page.waitForTimeout(1500)
const 찾기 = page.locator('input[type=search], input[placeholder*=찾]').first()
if (await 찾기.count()) { await 찾기.fill('된장찌개'); await page.waitForTimeout(1200) }
else {
  const 돋보기 = page.locator('button[aria-label*=검색], button[aria-label*=찾]').first()
  if (await 돋보기.count()) { await 돋보기.click({ force: true }); await page.waitForTimeout(800)
    const i2 = page.locator('input').first(); if (await i2.count()) { await i2.fill('된장찌개'); await page.waitForTimeout(1200) } }
}
const 카드 = page.getByText('된장찌개', { exact: true }).first()
console.log('  🔎 된장찌개 =', await 카드.count(), '개')
if (await 카드.count()) { await 카드.click({ force: true }); await page.waitForTimeout(1800) }

// ⏱ 시간이 적힌 걸음을 찾아 오린다
const 걸음 = page.locator('li, .step, [class*=step]').filter({ hasText: /\d+\s*분/ })
const n = await 걸음.count()
console.log('  🔎 시간이 적힌 걸음 =', n, '개')
if (n) {
  await 걸음.first().scrollIntoViewIfNeeded(); await page.waitForTimeout(700)
  const bb = await 걸음.first().boundingBox()
  if (bb) {
    await page.screenshot({ path: join(OUT, '5e-오림-걸음시간.png'), clip: { x: 8, y: Math.max(0, bb.y - 16), width: 389, height: 230 } })
    console.log('  ✂️ 5e-오림-걸음시간')
  }
  await page.screenshot({ path: join(OUT, '5f-된장찌개-걸음.png') })
  console.log('  📸 5f-된장찌개-걸음')
}
await b.close(); srv.close()
