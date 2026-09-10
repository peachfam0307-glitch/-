// 👀👀 [2026-09-10] 「유저 눈으로 보기」 스위치가 진짜로 도나 — 앱을 돌려서 잰다
//
// 📮 창업자 = *"이게 나랑 유저랑 보이는 화면이 다르니까 테스트하기가 너무 어렵네"*
// ⛔ 그날 하루를 이걸로 태웠다 — 창업자 폰에서 단추가 하나만 떠서 세 번을 버그로 의심했다.
//    진짜는 «창업자가 무제한이라» 그런 것이었고 시크릿 모드에선 멀쩡했다.
import './_fresh.mjs'
import { chromium } from 'playwright'
import { readFileSync, mkdirSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const DIST = join(ROOT, 'dist')
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2', '.jpg': 'image/jpeg' }
const srv = createServer((q, s) => {
  let p = decodeURIComponent(q.url.split('?')[0]).replace(/^\/hankki/, '')
  if (p === '/' || p === '') p = '/index.html'
  let b, t = MIME[extname(p)] || 'application/octet-stream'
  try { b = readFileSync(join(DIST, p)) } catch { b = readFileSync(join(DIST, 'index.html')); t = 'text/html' }
  s.writeHead(200, { 'content-type': t }); s.end(b)
})
await new Promise((r) => srv.listen(4495, r))

const OUT = process.env.SHOT_OUT || '/tmp/유저눈'
mkdirSync(OUT, { recursive: true })
let 나쁨 = 0
const 잰다 = (참, 말, 값 = '') => { if (참) console.log(`  ✅ ${말}${값 ? `  ${값}` : ''}`); else { 나쁨 += 1; console.log(`  ⛔ ${말}${값 ? `  ${값}` : ''}`) } }

const b = await chromium.launch(process.env.SMOKE_CHROMIUM ? { executablePath: process.env.SMOKE_CHROMIUM } : {})

async function 설정화면(운영자) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 860 }, locale: 'ko-KR' })
  await ctx.addInitScript((운영자) => {
    try {
      localStorage.setItem('hankki:nudge:cloudgate', '1')
      localStorage.setItem('hankki:onboarded', '1')
      if (운영자) localStorage.setItem('hankki:founder', '시험열쇠')
    } catch { /* noop */ }
  }, 운영자)
  const p = await ctx.newPage()
  await p.goto('http://127.0.0.1:4495/hankki/', { waitUntil: 'networkidle' })
  await p.waitForTimeout(2400)
  for (let i = 0; i < 10; i++) {
    const 시트 = p.locator('.sheet-mask button', { hasText: /^(닫기|확인|알겠어요|나중에)/ }).first()
    if (await 시트.count() > 0 && await 시트.isVisible().catch(() => false)) { await 시트.click(); await p.waitForTimeout(500); continue }
    const 코치 = p.locator('[aria-label="다음 안내 보기"]').first()
    if (await 코치.count() > 0 && await 코치.isVisible().catch(() => false)) { await 코치.click(); await p.waitForTimeout(500); continue }
    break
  }
  // ⛔ 설정은 «하단 탭에 없다» — 홈 오른쪽 위 톱니다(BottomNav.jsx:8)
  await p.locator('[aria-label="설정"]').first().click()
  await p.waitForTimeout(1400)
  for (let i = 0; i < 6; i++) {
    const 코치 = p.locator('[aria-label="다음 안내 보기"]').first()
    if (await 코치.count() === 0 || !(await 코치.isVisible().catch(() => false))) break
    await 코치.click(); await p.waitForTimeout(500)
  }
  return { ctx, p }
}
const 살핌 = (p) => p.evaluate(() => ({
  스위치: !!document.body.innerText.match(/유저 눈으로 보기/),
  상태글: (document.body.innerText.match(/(켜짐|꺼짐) · [^\n]+/) || [null])[0],
  열쇠배지: (document.body.innerText.match(/운영자|매달 무료 \d+개/) || [null])[0],
}))

console.log('\n👀 유저 눈으로 보기\n')

// ── ① 일반 유저 — 스위치가 «안» 보여야 한다
{
  const { ctx, p } = await 설정화면(false)
  const m = await 살핌(p)
  잰다(m.스위치 === false, '① 일반 유저에겐 스위치가 «안» 보인다', JSON.stringify(m))
  await ctx.close()
}

// ── ② 운영자 — 스위치가 보이고, 열쇠 배지는 「운영자」
{
  const { ctx, p } = await 설정화면(true)
  const m1 = await 살핌(p)
  잰다(m1.스위치 === true, '② 운영자에겐 스위치가 보인다')
  잰다(/꺼짐/.test(m1.상태글 || ''), '② 처음엔 꺼짐', m1.상태글)
  잰다(m1.열쇠배지 === '운영자', '② 열쇠 배지가 「운영자」', String(m1.열쇠배지))
  await p.screenshot({ path: `${OUT}/1-off.jpg`, quality: 40, type: 'jpeg' })

  // ── ③ 켜면 «유저 화면»이 된다
  await p.locator('button', { hasText: '유저 눈으로 보기' }).first().click()
  await p.waitForTimeout(2600)
  for (let i = 0; i < 8; i++) {
    const 코치 = p.locator('[aria-label="다음 안내 보기"]').first()
    if (await 코치.count() === 0 || !(await 코치.isVisible().catch(() => false))) break
    await 코치.click(); await p.waitForTimeout(500)
  }
  const 설정탭 = p.locator('[aria-label="설정"]').first()
  if (await 설정탭.count() > 0) { await 설정탭.click(); await p.waitForTimeout(1400) }
  const m2 = await 살핌(p)
  잰다(m2.스위치 === true, '③ 켠 뒤에도 스위치는 «남아 있다» (안 그러면 못 끈다)')
  잰다(/켜짐/.test(m2.상태글 || ''), '③ 켜짐으로 바뀐다', m2.상태글)
  잰다(m2.열쇠배지 !== '운영자', '③ ⭐열쇠 배지가 «유저처럼» 바뀐다', String(m2.열쇠배지))
  await p.screenshot({ path: `${OUT}/2-on.jpg`, quality: 40, type: 'jpeg' })
  await ctx.close()
}

await b.close(); srv.close()
console.log(`\n📂 ${OUT}`)
console.log(나쁨 ? `\n✗ ${나쁨}칸 실패` : '\n✅ 유저 눈 스위치 통과')
process.exit(나쁨 ? 1 : 0)
