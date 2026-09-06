// 📔 새 속지 6장 — 폰 화면 그대로 찍어 검수판 재료로
import './_fresh.mjs'
import { chromium } from 'playwright'
import { readFileSync, mkdirSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join } from 'node:path'
const OUT = process.env.SCRATCH + '/속지6'; mkdirSync(OUT, { recursive: true })
const DIST = '/home/user/hankki/hankki/dist'
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2' }
const srv = createServer((q, s) => {
  let p = decodeURIComponent(q.url.split('?')[0]).replace(/^\/hankki/, ''); if (p === '/' || p === '') p = '/index.html'
  let b, t = MIME[extname(p)] || 'application/octet-stream'
  try { b = readFileSync(join(DIST, p)) } catch { b = readFileSync(join(DIST, 'index.html')); t = 'text/html' }
  s.writeHead(200, { 'content-type': t }); s.end(b)
})
await new Promise((r) => srv.listen(0, r))
const 집 = `http://127.0.0.1:${srv.address().port}/`
const { todayKST } = await import('/home/user/hankki/hankki/src/today.js')
const { SEED_COACH_SEEN } = await import('/home/user/hankki/hankki/src/coach.js')
const [Y, M, D] = todayKST().split('-').map(Number)
const 글 = '선선해져서 국물이 자꾸 생각나는 날. 들깨탕 끓였다.'
const 시안들 = [
  { 이름: '01-폴라로이드스크랩', art: 'pinkscrap', skin: 'ivory', rule: 'lined' },
  { 이름: '02-가을사진메모', art: 'auphoto', skin: 'ivory', rule: 'lined' },
  { 이름: '03-가을스크랩', art: 'auscrap', skin: 'ivory', rule: 'lined', note2: '장 볼 것: 들깨, 무, 대파' },
  { 이름: '04-가을두칸', art: 'autwo', skin: 'ivory', rule: 'lined', note2: '저녁은 남은 국에 밥 말아서.' },
  { 이름: '05-가을기록3칸', art: 'authree', skin: 'ivory', rule: 'lined', note2: '점심 — 김밥', note3: '저녁 — 들깨탕' },
  { 이름: '06-핑크레이스', art: 'pinklace', skin: 'ivory', rule: 'lined', line: '뜨끈한 게 최고' },
]
const b = await chromium.launch({ executablePath: process.env.SMOKE_CHROMIUM })
for (const 시안 of 시안들) {
  const 담을것 = { recipes: [], diary: [{ id: 'shot-속지', kind: 'diary', at: Date.UTC(Y, M - 1, D, 3, 0, 0),
    paper: { rule: 시안.rule, skin: 시안.skin, art: 시안.art }, note: 글, title: '가을 첫 들깨탕',
    note2: 시안.note2, note3: 시안.note3, line: 시안.line, font: 'gaegu', size: 'md', decor: [] }] }
  const ctx = await b.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true })
  await ctx.addInitScript(SEED_COACH_SEEN)
  await ctx.addInitScript(() => { try { localStorage.setItem('hankki:onboarded', '1'); localStorage.setItem('hankki:news:off', '1') } catch {} })
  await ctx.addInitScript((v) => { try { const 이미 = JSON.parse(localStorage.getItem('hankki:v1') || '{}'); localStorage.setItem('hankki:v1', JSON.stringify({ ...이미, ...v })) } catch {} }, 담을것)
  const p = await ctx.newPage(); p.setDefaultTimeout(15000)
  await p.goto(집, { waitUntil: 'networkidle' }); await p.waitForTimeout(1500)
  for (const 글자 of ['나중에 볼게요', '확인', '닫기']) { const t = p.getByRole('button', { name: 글자 }).first(); if (await t.count()) { await t.click({ timeout: 2000 }).catch(() => {}); await p.waitForTimeout(400) } }
  const 탭 = p.locator('.tabbar button, nav button, [role="tab"]').filter({ hasText: /^일기$/ }).first()
  if (await 탭.count()) { await 탭.click(); await p.waitForTimeout(1200) }
  const 칸 = p.locator('button.cal-day').filter({ has: p.locator('.cal-num', { hasText: new RegExp(`^${D}$`) }) }).first()
  if (await 칸.count()) { await 칸.click().catch(() => {}); await p.waitForTimeout(1800)
    await p.screenshot({ path: join(OUT, 시안.이름 + '.png') }); console.log('✅', 시안.이름)
  } else console.log('⛔', 시안.이름, '달력 칸 없음')
  await ctx.close()
}
await b.close(); srv.close(); console.log(OUT)
