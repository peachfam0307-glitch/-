// 🧊📣 **「냉장고 유통기한 한 줄」 재현판** — 창업자 2026-09-06 *"우리 앱 유통기한 알람도 가능해?"* → *"1번으로 하자 판 뽑아줘"*
//
// ⭐ 재는 것 = «앱을 열었을 때» 홈이 임박·지난 재료를 말하나 (폰 알림이 아니다 · 서버 없음)
//   ① 임박(D-3 이내)·지난 재료가 있으면 홈에 한 줄이 뜬다 — 머리글에 «지난 재료 N개»가 먼저(제일 급한 것)
//   ② D-20 처럼 먼 재료는 «안» 센다 — 냉장고 D-3 칩과 같은 잣대(pantryExpiry.EXPIRY_SOON_DAYS)
//   ③ 누르면 장보기 › 냉장고 탭으로 간다
//   ④ 닫으면 «오늘» 은 다시 안 뜬다(뒤로 갔다 들어와도) — 매번 뜨면 재촉이다
//   ⑤ 냉장고가 비었거나 유통기한이 없으면 줄이 «없다»
//   ⑥ 순수 함수 = pantryExpiryLine 이 날짜 셈을 맞게 하나(노드에서 직접)
//
// ⛔ 함정 사전(check-mistakes ⑧) — page.reload() ＋ addInitScript 는 시드가 저장값을 덮는다 → 새 컨텍스트로 연다.
// 실행: SMOKE_CHROMIUM=/opt/pw-browsers/chromium node scripts/_repro-유통기한홈줄-0906.mjs
import './_fresh.mjs'
import { chromium } from 'playwright'
import http from 'node:http'
import { readFileSync, statSync } from 'node:fs'
import { extname, join } from 'node:path'
// ⛔ SEED_COACH_SEEN 을 쓰면 «이 팝업도» 본 상태가 된다(열쇠가 코치 접두어 아래) → 코치 열쇠만 «이름으로» 심는다
import { COACH } from '../src/coach.js'

const ROOT = join(new URL('..', import.meta.url).pathname, 'dist')
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2' }
const srv = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0])
  if (p.startsWith('/hankki/')) p = p.slice(7)
  const f = join(ROOT, p === '/' ? 'index.html' : p)
  try { statSync(f); res.writeHead(200, { 'Content-Type': MIME[extname(f)] || 'application/octet-stream' }); res.end(readFileSync(f)) }
  catch { res.writeHead(404); res.end('nope') }
})
await new Promise((r) => srv.listen(0, r))
const PORT = srv.address().port
// ⭐ 코치마크는 전부 심는다(홈이 코치로 덮이면 줄을 못 누른다) · 로그인 팝업도 끈다
const COACH_KEYS = Object.values(COACH)

import { pantryExpiryLine, expiringPantry } from '../src/pantryExpiry.js'

const 날 = (n) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + n); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` }
const 씨앗 = (pantry) => `
  localStorage.setItem('hankki:onboarded', '1'); localStorage.setItem('hankki:news:off', '1'); localStorage.setItem('hankki:coach:loginpop', '1')
  localStorage.setItem('hankki:v1', JSON.stringify({
    recipes: [], folders: [], profile: { name: '한끼러버', bio: '' }, shops: [], wishlist: [],
    shoppingList: [], pantry: ${JSON.stringify(pantry)}, diary: [], seedV: 999, memoCleanV: 9, removedSeedIds: [],
  }))`

const b = await chromium.launch(process.env.SMOKE_CHROMIUM ? { executablePath: process.env.SMOKE_CHROMIUM } : {})
const errs = []
let 통과 = 0, 전체 = 0
const 칸 = (좋나, 이름, 덧 = '') => { 전체++; if (좋나) 통과++; console.log(`${좋나 ? '✅' : '⛔'} ${이름}${덧 ? ' — ' + 덧 : ''}`) }

async function 창 (init) {
  const ctx = await b.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
  await ctx.route('**/*.googleapis.com/**', (r) => r.abort())
  await ctx.route('**/*.gstatic.com/**', (r) => r.abort())
  const pg = await ctx.newPage()
  pg.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message))
  await pg.addInitScript((ks) => { ks.forEach((k) => localStorage.setItem(k, '1')) }, COACH_KEYS)
  await pg.addInitScript(init)
  await pg.goto(`http://localhost:${PORT}/hankki/`, { waitUntil: 'domcontentloaded' })
  await pg.waitForFunction(() => (document.body?.innerText || '').trim().length > 30, null, { timeout: 30000 })
  await pg.waitForTimeout(700)
  return { ctx, pg }
}
const 줄 = (pg) => pg.evaluate(() => document.querySelector('.pantry-exp-row')?.innerText.replace(/\n/g, ' | ') || '')

const 냉장고 = [
  { id: 'p1', name: '우유', icon: null, expiry: 날(-2), addedAt: 1 },
  { id: 'p2', name: '두부', icon: null, expiry: 날(0), addedAt: 1 },
  { id: 'p3', name: '대파', icon: null, expiry: 날(2), addedAt: 1 },
  { id: 'p4', name: '참기름', icon: null, expiry: 날(20), addedAt: 1 },
  { id: 'p5', name: '소금', icon: null, expiry: null, addedAt: 1 },
]

console.log('\n── 🧊 냉장고 유통기한 홈 한 줄 ──')

// ⑥ 순수 함수부터 — 화면 전에 셈이 맞나
{
  const l = pantryExpiryLine(냉장고)
  칸(expiringPantry(냉장고).map((p) => p.name).join(',') === '우유,두부,대파', '⑥ 임박·지남만 급한 순으로(우유·두부·대파) · D-20·기한 없음은 «안» 센다', expiringPantry(냉장고).map((p) => p.name).join(','))
  칸(l?.head === '유통기한 지난 재료 1개 있어요', '⑥ 지난 게 있으면 머리글이 «지난 재료»부터', l?.head)
  칸(l?.sub === '우유 · 두부 · 대파', '⑥ 부제 = 이름 셋', l?.sub)
  칸(pantryExpiryLine([냉장고[2]])?.head === '2일 안에 지나는 재료 1개 있어요', '⑥ D-2 만 있으면 「2일 안에」', pantryExpiryLine([냉장고[2]])?.head)
  칸(pantryExpiryLine([냉장고[1]])?.head === '오늘까지인 재료 있어요', '⑥ D-0 만 있으면 「오늘까지」', pantryExpiryLine([냉장고[1]])?.head)
  칸(pantryExpiryLine([냉장고[3], 냉장고[4]]) === null, '⑥ 먼 것·기한 없음뿐이면 null')
}

// ① 홈에 줄이 뜬다 · ② 먼 재료는 안 들어간다
{
  const { ctx, pg } = await 창(씨앗(냉장고))
  const t = await 줄(pg)
  칸(/유통기한 지난 재료 1개 있어요/.test(t), '① 홈에 유통기한 줄이 뜬다', t)
  칸(/우유 · 두부 · 대파/.test(t) && !/참기름|소금/.test(t), '② 부제에 우유·두부·대파만 — 참기름(D-20)·소금(기한 없음)은 없다', t)
  await pg.screenshot({ path: process.env.SHOT_OUT || '/tmp/유통기한홈줄.png' })
  // ③ 누르면 장보기 › 냉장고
  await pg.locator('.pantry-exp-row button').first().click()
  await pg.waitForTimeout(900)
  const 냉장고탭 = await pg.evaluate(() => document.querySelector('.seg.on')?.textContent.trim())
  const 우유보임 = await pg.evaluate(() => /우유/.test(document.body.innerText))
  칸(냉장고탭 === '냉장고' && 우유보임, '③ 누르면 장보기 › «냉장고» 탭이 열리고 우유가 보인다', `탭=${냉장고탭} 우유=${우유보임}`)
  await ctx.close()
}

// ④ 닫으면 오늘은 다시 안 뜬다 — 같은 컨텍스트에서 «뒤로 갔다 들어오기»(⛔reload 함정)
{
  const { ctx, pg } = await 창(씨앗(냉장고))
  칸(!!(await 줄(pg)), '④-1 처음엔 뜬다')
  await pg.locator('.pantry-exp-row button[aria-label="닫기"]').click()
  await pg.waitForTimeout(300)
  칸(!(await 줄(pg)), '④-2 닫으면 사라진다')
  // 다른 탭 갔다가 홈으로
  await pg.locator('nav button, .tabbar button').nth(1).click().catch(() => {})
  await pg.waitForTimeout(500)
  await pg.locator('nav button, .tabbar button').first().click().catch(() => {})
  await pg.waitForTimeout(600)
  칸(!(await 줄(pg)), '④-3 딴 탭 갔다 홈에 와도 오늘은 안 뜬다')
  const 표식 = await pg.evaluate(() => localStorage.getItem('hankki:pantryExp:seen'))
  칸(/^\d{4}-\d{2}-\d{2}$/.test(표식 || ''), '④-4 표식이 «오늘 날짜»라 내일은 다시 뜬다', 표식)
  await ctx.close()
}

// ⑤ 냉장고 비었거나 기한 없음 → 줄 없음
{
  const { ctx, pg } = await 창(씨앗([냉장고[4]]))
  칸(!(await 줄(pg)), '⑤ 기한 없는 재료뿐이면 줄이 «없다»')
  await ctx.close()
}

await b.close(); srv.close()
if (errs.length) console.log('⛔ pageerror:', errs.join(' | '))
console.log(`\n${통과}/${전체}`)
process.exit(통과 === 전체 && !errs.length ? 0 : 1)
