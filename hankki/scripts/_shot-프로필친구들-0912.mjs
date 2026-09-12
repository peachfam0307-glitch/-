// 🧑‍🍳 프로필 아이콘 시트에 「우리 애들 · 옷 입은 컷」 5개가 실제로 보이나 — 규칙 21(보여주기 전에 내가 열어본다)
//
// 📮 창업자 2026-09-12 = *"프로필설정에 친구들 컷 추가해주고"* ＋ *"기존꺼에 추가하라는거야"*
// 보는 것 = ①프로필 화면이 맞나 ②시트가 열렸나 ③새 5개 이름이 다 있나 ④깨진 그림(naturalWidth 0)이 없나
// 쓰는 법: node scripts/_shot-프로필친구들-0912.mjs
import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFileSync, existsSync, mkdirSync } from 'node:fs'
import { join, extname, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const 여기 = dirname(fileURLToPath(import.meta.url))
const dist = join(여기, '../dist')
const 낼곳 = join(여기, '../../_shots')
if (!existsSync(낼곳)) mkdirSync(낼곳, { recursive: true })

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.svg': 'image/svg+xml' }
const srv = createServer((req, res) => {
  let p = join(dist, decodeURIComponent(req.url.split('?')[0]).replace(/^\/hankki/, ''))
  if (!existsSync(p) || p.endsWith('/')) p = join(dist, 'index.html')
  res.writeHead(200, { 'Content-Type': MIME[extname(p)] || 'application/octet-stream' })
  res.end(readFileSync(p))
}).listen(0)
const port = srv.address().port

const { SEED_COACH_SEEN } = await import('../src/coach.js')
const b = await chromium.launch({ executablePath: process.env.SMOKE_CHROMIUM || undefined })
const pg = await b.newPage({ viewport: { width: 390, height: 2400 }, deviceScaleFactor: 2 })
await pg.addInitScript(SEED_COACH_SEEN)
await pg.addInitScript(() => { localStorage.setItem('hankki:onboarded', '1'); localStorage.setItem('hankki:news:off', '1') })
await pg.goto(`http://localhost:${port}/hankki/`)
await pg.waitForTimeout(1500)
await pg.getByRole('button', { name: /^닫기$/ }).first().click().catch(() => {})
await pg.waitForTimeout(500)

// ⛔ 엉뚱한 화면을 찍고 초록불을 켜지 않는다(규칙 18ⓕ) — 프로필 탭인지 «확인»하고 아니면 죽는다.
await pg.getByRole('button', { name: '프로필' }).first().click({ force: true }).catch(() => {})
await pg.waitForTimeout(900)
await pg.getByRole('button', { name: '프로필 아이콘 바꾸기' }).first().click({ force: true })
await pg.waitForTimeout(900)

const 제목 = await pg.getByText('프로필 아이콘', { exact: true }).count()
if (!제목) { console.log('⛔ 프로필 아이콘 시트가 아니다 — 찍지 않는다'); await b.close(); srv.close(); process.exit(1) }

const 라벨 = await pg.getByText('우리 애들 · 옷 입은 컷', { exact: true }).count()
const 깨진것 = await pg.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0).length)
const 이름들 = ['꼬르곰', '펭펭', '카롱', '뾰미', '꼬비']
const 개수 = {}
for (const n of 이름들) 개수[n] = await pg.getByRole('button', { name: n, exact: true }).count()

await pg.screenshot({ path: join(낼곳, '프로필친구들-0912.png'), fullPage: true })
console.log('라벨 있나 =', 라벨, '· 깨진 그림 =', 깨진것)
console.log('이름별 단추 수(얼굴＋옷 = 2 여야 한다) =', JSON.stringify(개수))
await b.close(); srv.close()

const 나쁨 = !라벨 || 깨진것 > 0 || 이름들.some((n) => 개수[n] < 2)
console.log(나쁨 ? '⛔ 실패' : '✅ 통과 — _shots/프로필친구들-0912.png')
process.exit(나쁨 ? 1 : 0)
