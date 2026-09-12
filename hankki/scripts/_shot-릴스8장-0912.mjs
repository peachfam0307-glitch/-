// 🎬 릴스 ① 「8월 21일 출시 · 신상 레시피앱 한끼에는요」 — 8장 찍기 (2026-09-12)
//
// 📮 창업자 = *"화면에 맞는 문구로 다시 짜줘"* · *"그런 것만 찍거나 목록으로 촤르륵 네가 캡쳐해서"*
//    ＋ *"8월 21일출시 신상 레시피앱 한끼에는요로 시작하자"* · 글자 자리 = **위**
//
// ⛔ 문이 «넷»이다 — 로그인 → 확인 시트 → 온보딩 → 소식 팝업.
//    하나씩 만나며 고치면 네 번 헛돈다(2026-09-03 에 그랬다). 처음부터 다 끈다.
// ⛔ 절대원칙 21 — 창업자에게 보내기 «전»에 내가 열어서 눈으로 본다.
// ⛔ 결과 PNG 는 scratchpad 에만 (저장소가 public).
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
// 🎞 릴스는 1080x1920 — 그 비율(9:16)로 찍어야 나중에 안 잘린다
const ctx = await b.newContext({ viewport: { width: 405, height: 720 }, deviceScaleFactor: 2.67 })
await ctx.addInitScript(SEED_COACH_SEEN)
await ctx.addInitScript(() => {
  try { localStorage.setItem('hankki:onboarded', '1'); localStorage.setItem('hankki:news:off', '1') } catch { /* noop */ }
})
let page = await ctx.newPage()
page.setDefaultTimeout(15000)
await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(2500)

// 🚪 로그인 화면 → 「나중에 하기」 → 확인 시트 「그냥 시작하기」
const 나중 = page.getByText('나중에 하기', { exact: true })
if (await 나중.count()) {
  await 나중.first().click({ force: true }); await page.waitForTimeout(1200)
  const 시작 = page.getByRole('button', { name: '그냥 시작하기' })
  if (await 시작.count()) { await 시작.first().click({ force: true }); await page.waitForTimeout(1800) }
}
// 🚪 아직 덮여 있나 — 숫자만 믿지 않고 «한가운데»를 본다
const 가운데 = () => page.evaluate(() => {
  const el = document.elementFromPoint(innerWidth / 2, innerHeight / 2)
  return el ? ((el.className && typeof el.className === 'string' ? el.className : el.tagName) + '') : '(없다)'
})
for (let i = 0; i < 5; i++) {
  const c = await 가운데()
  if (!/mask|overlay|onboard|coach|sheet/i.test(c)) break
  await page.keyboard.press('Escape').catch(() => {}); await page.mouse.click(20, 20).catch(() => {})
  await page.waitForTimeout(900)
}
// 🚪 그래도 로그인이면 «새 탭»으로 (⛔ reload 는 addInitScript 가 다시 돌아 저장값을 덮는다)
if (await page.getByText('Google 계정으로 시작하기').count()) {
  const p2 = await ctx.newPage(); p2.setDefaultTimeout(15000)
  await p2.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'domcontentloaded' })
  await p2.waitForTimeout(2500); await page.close(); page = p2
}
console.log('  🔎 화면 한가운데 =', await 가운데())

const 찍기 = async (이름) => {
  const p = join(OUT, `${이름}.png`)
  await page.screenshot({ path: p })
  console.log('  📸', 이름)
}
const 탭 = async (이름) => {
  await page.getByRole('button', { name: 이름, exact: true }).first().click({ force: true })
  await page.waitForTimeout(1500)
}

// ① 홈 (첫 인상) · ③ 제철
await 찍기('1-홈')
const 제철 = page.locator('.weekly-box').filter({ hasText: '이번 주 제철' })
if (await 제철.count()) { await 제철.first().scrollIntoViewIfNeeded(); await page.waitForTimeout(800) }
await 찍기('3-제철')

// ② 레시피 목록 — 촤르륵 넘어가는 자리 (위·중간·아래 세 컷)
await 탭('레시피')
await 찍기('2a-목록-위')
await page.mouse.wheel(0, 1400); await page.waitForTimeout(900); await 찍기('2b-목록-중간')
await page.mouse.wheel(0, 1400); await page.waitForTimeout(900); await 찍기('2c-목록-아래')

// ④ SNS 레시피 — 칩으로 걸러서
await page.mouse.wheel(0, -4000); await page.waitForTimeout(800)
const 칩 = page.locator('button.pill', { hasText: 'SNS' })
console.log('  🔎 SNS 칩 =', await 칩.count(), '개')
if (await 칩.count()) { await 칩.first().click({ force: true }); await page.waitForTimeout(1000); await 찍기('4-SNS레시피') }

// ⑤ 상세 — 재료·인분  ⭐ 인분을 «눌러서» 양이 바뀌는 것까지 찍는다(창업자 = "타이머가 아니라 인분")
if (await 칩.count()) { await 칩.first().click({ force: true }); await page.waitForTimeout(700) }
await page.mouse.wheel(0, -4000); await page.waitForTimeout(700)
const 첫편 = page.locator('.rc-card, .recipe-card, article, [class*=card]').first()
console.log('  🔎 목록 카드 =', await 첫편.count(), '개')
if (await 첫편.count()) {
  await 첫편.click({ force: true }); await page.waitForTimeout(1800)
  await 찍기('5a-상세-위')
  // 재료가 보이는 데까지 내린다
  const 재료 = page.getByText('인분', { exact: false }).first()
  if (await 재료.count()) { await 재료.scrollIntoViewIfNeeded(); await page.waitForTimeout(700) }
  await 찍기('5b-상세-재료-1인분')
  // ⭐ 인분 늘리기 — 분량이 같이 바뀌는 것이 이 장면의 전부다
  const 늘리기 = page.getByRole('button', { name: '늘리기' }).first()
  console.log('  🔎 인분 늘리기 단추 =', await 늘리기.count(), '개')
  // ⭐⭐ [창업자 2026-09-12] *"글자가 많아서 처음보는 사람은 저게 안보여"*
  //    -> 인분 줄과 재료 몇 줄만 «오려서» 따로 찍는다. 릴스에서 크게 띄우면 조작이 눈에 든다.
  //    창업자 판정 = B (인분 줄 ＋ 재료 3~4줄 — 양이 바뀌는 게 «같이» 보여야 증명된다)
  const 오리기 = async (이름) => {
    // ⛔ `getByText('인분')` 첫째는 맨 위 «1인분 칩»이다 — 조작 줄이 아니다(실제로 그걸 오렸다).
    //    ✅ 조작 줄에만 있는 「기본 N인분」 을 기준으로 삼는다.
    const 인분줄 = page.locator('.serv-row').first()
    // ⛔ 화면 «밖»이면 오릴 수가 없다 — 보이는 데까지 먼저 내린다(clip 이 빈 영역이라 죽었다)
    await 인분줄.scrollIntoViewIfNeeded(); await page.waitForTimeout(600)
    const b1 = await 인분줄.boundingBox()
    if (!b1) { console.log('  ⛔ 인분 줄을 못 찾았다'); return }
    const p = join(OUT, `${이름}.png`)
    // 인분 줄부터 아래로 — 재료 네 줄쯤이 들어오는 높이
    await page.screenshot({ path: p, clip: { x: 8, y: Math.max(0, b1.y - 14), width: 389, height: 250 } })
    console.log('  ✂️', 이름)
  }
  await 오리기('5b2-오림-1인분')
  // ⭐ [창업자 2026-09-12] *"몇분인지는 캡쳐에 없는데"* + *"따로잘라서 옆에 붙여주던가"*
  //    -> 만드는 법에서 «시간이 적힌 걸음»을 따로 오려 둔다. 인분 카드 옆에 붙일 재료다.
  const 걸음오리기 = async () => {
    const 후보 = page.locator('li, .step, [class*=step]').filter({ hasText: /\d+분|\d+초/ })
    const n = await 후보.count()
    console.log('  🔎 시간이 적힌 걸음 =', n, '개')
    if (!n) return
    await 후보.first().scrollIntoViewIfNeeded(); await page.waitForTimeout(600)
    const bb = await 후보.first().boundingBox()
    if (!bb) return
    await page.screenshot({ path: join(OUT, '5e-오림-걸음시간.png'), clip: { x: 8, y: Math.max(0, bb.y - 12), width: 389, height: 200 } })
    console.log('  ✂️ 5e-오림-걸음시간')
  }
  await 걸음오리기()
  if (await 늘리기.count()) {
    await 늘리기.click({ force: true }); await page.waitForTimeout(800)
    await 찍기('5c-상세-재료-2인분'); await 오리기('5c2-오림-2인분')
    await 늘리기.click({ force: true }); await page.waitForTimeout(800)
    await 찍기('5d-상세-재료-3인분'); await 오리기('5d2-오림-3인분')
  }
}

// ⑥ 장보기 · ⑦ 일기 — ⛔ 상세에 들어가 있으면 탭이 안 보인다. 먼저 빠져나온다.
const 뒤로 = async () => { await page.goBack().catch(() => {}); await page.waitForTimeout(1200) }
for (let i = 0; i < 3; i++) {
  if (await page.getByRole('button', { name: '장보기', exact: true }).count()) break
  await 뒤로()
}
await 탭('장보기'); await 찍기('6-장보기')
await 탭('일기'); await 찍기('7-일기')

console.log(`\n✅ ${OUT} 에 찍었다`)
await b.close(); srv.close()
