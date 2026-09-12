// 📸 주부의 장바구니 큐레이션 릴스 2판 — 앱 화면 찍기 (2026-09-12)
//
// 📮 창업자 = *"큐레이션 목록 탭별로 보여주고, 앞으로 열릴 것. 쿠팡 자연드림 오아시스 컬리 한살림
//    다양한 쇼핑몰의 추천템들을 보여준다~ 코스트코, 트레이더스 추천템도 준비중이다."*
// ⛔ 여기서는 «찍기만» 한다. 글자판은 따로.
import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFileSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { join, extname } from 'node:path'

const R = '/home/user/hankki/hankki'
const 낼곳 = process.env.OUT || '/tmp/큐레샷2'
rmSync(낼곳, { recursive: true, force: true }); mkdirSync(낼곳, { recursive: true })

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' }
const srv = createServer((req, res) => {
  let p = join(`${R}/dist`, decodeURIComponent(req.url.split('?')[0]).replace(/^\/hankki/, ''))
  if (!existsSync(p) || p.endsWith('/')) p = join(`${R}/dist`, 'index.html')
  res.writeHead(200, { 'Content-Type': MIME[extname(p)] || 'application/octet-stream' })
  res.end(readFileSync(p))
}).listen(0)
const port = srv.address().port

const b = await chromium.launch(process.env.SMOKE_CHROMIUM ? { executablePath: process.env.SMOKE_CHROMIUM } : {})
const pg = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 })
const { SEED_COACH_SEEN } = await import(`${R}/src/coach.js`)
await pg.addInitScript(SEED_COACH_SEEN)
await pg.addInitScript(() => { localStorage.setItem('hankki:onboarded', '1'); localStorage.setItem('hankki:news:off', '1'); localStorage.setItem('hankki:loginSkip', '1') })
await pg.goto(`http://localhost:${port}/hankki/`)
await pg.waitForTimeout(1800)
const 찍기 = async (이름, opt) => { await pg.screenshot({ path: `${낼곳}/${이름}.png`, ...opt }); console.log('📸', 이름) }

await pg.getByRole('button', { name: /장보기|장바구니/ }).first().click().catch(() => {})
await pg.waitForTimeout(1200)
await 찍기('1-장보기-위')

// 큐레이션 영역까지 내려가며 찍기
for (let i = 1; i <= 5; i++) {
  await pg.mouse.wheel(0, 700); await pg.waitForTimeout(700)
  await 찍기(`2-${i}-스크롤`)
}
// 탭(큰 칸) 칩 줄만 오림
const 본문 = await pg.evaluate(() => document.body.innerText)
console.log('\n--- 화면에서 읽힌 글 (앞 900자) ---\n' + 본문.slice(0, 900))
await 찍기('9-전체', { fullPage: true })
console.log(`\n✅ ${낼곳}`)
await b.close(); srv.close()
