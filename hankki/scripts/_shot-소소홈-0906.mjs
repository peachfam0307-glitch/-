// 📸🏠 소소 기능 캐러셀 2편 「홈이 알아서」 앱 화면 재료 (2026-09-06)
//
// 📮 창업자 20:13 확정 묶음 ② = 제철 · 우리집 · SNS 영상칩 · 다른 추천 · 자주 해먹는 · 검색/폴더/북마크
// 📮 창업자 23:50 = *"패드 되는 것도 한 줄 넣어줘"* → 패드(820×1180) 홈도 한 장 찍는다
//
// ⭐ 재료는 «UI 로» 넣는다 — 「만들었어요」를 눌러 cooked 를 쌓아야 「자주 해먹는 요리」 줄이 뜬다.
// ⭐ 규칙 21 — 찍고 «열어 보고» 판정한다.
//
// 실행: cd /home/user/hankki/hankki && SMOKE_CHROMIUM=/opt/pw-browsers/chromium-1194/chrome-linux/chrome node scripts/_shot-소소홈-0906.mjs
import './_fresh.mjs'
import { chromium } from 'playwright'
import { readFileSync, mkdirSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const DIST = join(ROOT, 'dist')
const OUT = process.env.OUT || join(ROOT, 'design/promo/소소기능-앱화면-2509/홈')
mkdirSync(OUT, { recursive: true })
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2' }
const srv = createServer((q, s) => {
  let p = decodeURIComponent(q.url.split('?')[0]).replace(/^\/hankki/, ''); if (p === '/' || p === '') p = '/index.html'
  let body, type = MIME[extname(p)] || 'application/octet-stream'
  try { body = readFileSync(join(DIST, p)) } catch { body = readFileSync(join(DIST, 'index.html')); type = 'text/html' }
  s.writeHead(200, { 'content-type': type }); s.end(body)
})
await new Promise((r) => srv.listen(4432, r))
const URL0 = 'http://127.0.0.1:4432/hankki/'

const { SEED_COACH_SEEN } = await import('../src/coach.js')
const b = await chromium.launch(process.env.SMOKE_CHROMIUM ? { executablePath: process.env.SMOKE_CHROMIUM } : {})
const 문닫기 = (ctx) => ctx.addInitScript(() => { try { localStorage.setItem('hankki:onboarded', '1'); localStorage.setItem('hankki:news:off', '1') } catch {} })
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 })
await ctx.addInitScript(SEED_COACH_SEEN); await 문닫기(ctx)
const p = await ctx.newPage()
const 쉼 = (ms) => p.waitForTimeout(ms)
const 찍 = async (이름, pg = p) => { await pg.screenshot({ path: join(OUT, 이름 + '.png') }); console.log('  📸', 이름) }
const 탭 = async (글자) => { await p.locator('.bottom-nav .nav-item').filter({ hasText: 글자 }).first().click(); await 쉼(1100) }
const 맨위 = () => p.evaluate(() => { document.querySelectorAll('*').forEach((e) => { if (e.scrollHeight > e.clientHeight + 4) e.scrollTop = 0 }); window.scrollTo(0, 0) })
const 보이게 = async (loc, block = 'center') => { await loc.evaluate((el, block) => el.scrollIntoView({ block }), block); await 쉼(500) }

await p.goto(URL0, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready); await 쉼(900)

// ── ① 「자주 해먹는」 재료 — 레시피 셋에 「만들었어요」를 눌러 cooked 를 쌓는다 ─────
await 탭('레시피')
for (const [이름, n] of [['버섯 솥밥', 3], ['돼지고기 김치찌개', 2], ['간장계란밥', 1]]) {
  const 카드 = p.locator(`text=${이름}`).first()
  if (!(await 카드.count())) { console.log(`  ⚠️ 「${이름}」 없음`); continue }
  await 카드.click(); await 쉼(900)
  for (let i = 0; i < n; i++) {
    await p.getByRole('button', { name: /만들었어요/ }).first().click(); await 쉼(700)
    // 「만들었어요」 뒤에 «한 줄 쓸래요?» 시트가 뜬다(2026-09-03 창업자 확정) → 「나중에」
    const 나중 = p.getByRole('button', { name: /^나중에/ }); if (await 나중.count()) { await 나중.first().click(); await 쉼(500) }
  }
  await 쉼(2600)  // 토스트 사라진 뒤
  await p.goBack(); await 쉼(900)
  if (!(await p.locator('.bottom-nav').count())) { await p.goto(URL0, { waitUntil: 'networkidle' }); await 쉼(900); await 탭('레시피') }
}
// 책갈피 하나 꽂기(목록에서 바로)
const 책갈피 = p.locator('button[aria-label$="꽂기"]')
if (await 책갈피.count()) { await 책갈피.first().click(); await 쉼(400); await 책갈피.nth(1).click().catch(() => {}); await 쉼(600) }

// ── ② 홈 ─────────────────────────────────────────────
await 탭('홈'); await 맨위(); await 쉼(800)
await 찍('01-홈-오늘뭐해먹지')
const 다른 = p.locator('.today-refresh')
if (await 다른.count()) { await 다른.click(); await 쉼(700); await 찍('02-홈-다른추천') }
const 제철 = p.locator('.week-pair').first()
if (await 제철.count()) { await 보이게(제철, 'start'); await 찍('03-홈-제철우리집') }
const sns = p.locator('.week-pair').nth(1)
if (await sns.count()) { await 보이게(sns, 'center'); await 찍('04-홈-SNS요리') }
const 자주 = p.locator('.h-section', { hasText: '자주 해먹는' })
if (await 자주.count()) { await 보이게(자주, 'start'); await 찍('05-홈-자주해먹는') } else console.log('  ⚠️ 자주 해먹는 줄이 안 떴다')

// ── ③ SNS 편 상세 — 유튜브 표지 카드 ───────────────────────
const sns카드 = p.locator('.week-pair').nth(1).locator('.mini-card').first()
if (await sns카드.count()) { await 보이게(sns카드); await sns카드.click(); await 쉼(1200); const 영상 = p.getByText('영상으로 보기').first(); if (await 영상.count()) await 보이게(영상, 'center'); else await 맨위(); await 쉼(400); await 찍('06-상세-영상카드'); await p.goBack(); await 쉼(900) }

// ── ④ 검색 ───────────────────────────────────────────
await p.locator('button[aria-label="검색"]').first().click(); await 쉼(900)
const 칸 = p.locator('input[placeholder="검색어를 입력하세요"]').first()
if (await 칸.count()) { await 칸.fill('두부'); await 쉼(900); await 찍('07-검색-두부') }
await p.goBack(); await 쉼(800)

// ── ⑤ 내 레시피 — 모아보기 · 폴더 칩 · 책갈피 ──────────────
await 탭('레시피'); await 맨위(); await 쉼(500)
const 모아 = p.locator('[data-coach="collection"]')
if (await 모아.count()) { await 모아.click(); await 쉼(800) }
await 찍('08-레시피-모아보기')
const 자주칩 = p.locator('.pill', { hasText: /^자주/ })
if (await 자주칩.count()) { await 자주칩.click(); await 쉼(800); await 찍('09-레시피-자주폴더') }

// ── ⑥ 패드 홈 (820×1180) — 제철·우리집이 «한 줄에 나란히» ─────────
const 패드 = await b.newContext({ viewport: { width: 820, height: 1180 }, deviceScaleFactor: 2, storageState: await ctx.storageState() })
await 패드.addInitScript(SEED_COACH_SEEN); await 문닫기(패드)
const pp = await 패드.newPage()
await pp.goto(URL0, { waitUntil: 'networkidle' }); await pp.evaluate(() => document.fonts.ready); await pp.waitForTimeout(1200)
await 찍('10-패드-홈', pp)

await b.close(); srv.close()
console.log(`\n✅ → ${OUT}`)
