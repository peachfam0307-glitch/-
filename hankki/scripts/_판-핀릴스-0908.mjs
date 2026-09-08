// 🎬🎬 **사용법 릴스 「이번 주에 먹고 싶은 것, 같이 골라요」** — 짜임을 갖춘 판 (2026-09-08)
//
// 📮 창업자 = *"가족이 모여서 핀을 꼽고 주간식단표를 짜보라는 뜻이었어"*
//        ＋ *"이번주에 먹고 싶은 것 아이도 아빠도 엄마도 같이 골라요의 느낌"*
//        ＋ *"콩국수 빼고"* · *"가을이니까"* · *"저거 너무 작아서 하나도 안보이고"*
//        ＋ *"영상을 예쁘게 짜임도 넣고해야지"*
//
// ⛔⛔ **첫 판이 왜 곤란했나 — 내가 «화면 녹화»만 던졌다.**
//    앱 화면이 1080 폭에 그대로 들어가 글자가 손톱만 했고, 자막은 검은 알약 하나뿐이라
//    「짜임」이랄 게 없었다. 소소 릴스 셋(①②③)은 전부 «종이 위에 앉힌» 판이었는데 그걸 안 따랐다.
//
// ⭐⭐ **그래서 짜임을 셋으로 나눴다** (바탕 → 앱 → 앞면)
//    ⑴ **바탕** = 종이색 모눈 한 장 (1080×1920)
//    ⑵ **앱** = 실제 녹화를 760 폭 카드로 앉힌다 — 가운데에 크게, 그림자로 떠 보이게
//    ⑶ **앞면** = 장면마다 다른 한 장 — 위에 손글씨 제목, 아래에 자막, 곰펭 컷
//    📌 이렇게 하면 앱은 «작아지지 않고» 글자는 «커진다» — 첫 판과 정확히 반대다.
//
// 🍂 **레시피는 가을 것으로.** 콩국수는 «여름 샘플 표지»라 뺐다(창업자 *"콩국수 빼고"*).
//    ⏳ 창업자 = *"가을버전으로 하나 만들어서 올려두자"* → 샘플 표지 가을판은 «다음 일»이다.
//
// ⛔ 흉내내지 않는다 — 진짜 `dist` 를 띄우고 진짜 핀을 누른다(절대원칙 30).
// ⛔ 핀·칩을 못 찾으면 영상을 내지 않는다.
//
// 실행: cd /home/user/hankki/hankki && SMOKE_CHROMIUM=/opt/pw-browsers/chromium-1194/chrome-linux/chrome node scripts/_판-핀릴스-0908.mjs
import './_fresh.mjs'
import { chromium } from 'playwright'
import { readFileSync, mkdirSync, readdirSync, rmSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join } from 'node:path'
import { execFileSync } from 'node:child_process'

const ROOT = new URL('..', import.meta.url).pathname
const DIST = join(ROOT, 'dist')
const S = '/tmp/claude-0/-home-user-hankki/2414fcda-d05a-5b79-84dc-8c748bfda84b/scratchpad'
const OUT = join(S, '핀릴스')
rmSync(OUT, { recursive: true, force: true }); mkdirSync(OUT, { recursive: true })
const FF = process.env.FF || join(S, 'ff/node_modules/ffmpeg-static/ffmpeg')
const b64 = (p) => `data:image/png;base64,${readFileSync(p).toString('base64')}`
const 폰트 = readFileSync(join(ROOT, 'design/promo/fonts-embed.css'), 'utf8')
const 스 = (k) => b64(join(ROOT, `src/assets/sharepool/${k}.png`))

// 📐 짜임 값 — 앱 카드는 «가운데 크게», 위아래로 글자 자리를 남긴다
const W = 1080, H = 1920
const 앱W = 760, 앱H = Math.round(760 * 720 / 405)   // 9:16 그대로 = 1351
const 앱X = Math.round((W - 앱W) / 2), 앱Y = 268

// ── ① 진짜 앱을 녹화한다 (자막 없이 «깨끗하게») ─────────────────────────────
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2' }
const srv = createServer((q, s) => {
  let p = decodeURIComponent(q.url.split('?')[0]).replace(/^\/hankki/, ''); if (p === '/' || p === '') p = '/index.html'
  let body, type = MIME[extname(p)] || 'application/octet-stream'
  try { body = readFileSync(join(DIST, p)) } catch { body = readFileSync(join(DIST, 'index.html')); type = 'text/html' }
  s.writeHead(200, { 'content-type': type }); s.end(body)
})
await new Promise((r) => srv.listen(0, r))
const PORT = srv.address().port

const { BASICS_VERSION, allBasicRecipes } = await import('../src/data/basics.js')
// 🍂 가을 상 — 샘플 표지가 붙은 편은 «쓰지 않는다»(콩국수)
const 고를것 = ['국물 떡볶이', '제육볶음', '두부 들깨 버섯전골', '고구마맛탕', '갈치조림', '버섯 솥밥']
const 샘플 = allBasicRecipes.filter((r) => r.sample).map((r) => r.title)
const 겹침 = 고를것.filter((t) => 샘플.includes(t))
if (겹침.length) throw new Error(`⛔ 샘플 표지 편이 섞였다 — ${겹침.join(', ')} (창업자 "콩국수 빼고")`)

const now = Date.now()
const state = {
  recipes: 고를것.map((t, i) => {
    const r = allBasicRecipes.find((x) => x.title === t)
    if (!r) throw new Error(`⛔ 없는 레시피다 — ${t}`)
    return { id: 'r' + i, title: t, category: r.category, time: r.time, thumb: 'icon', icon: r.icon,
      ingredients: ['재료 1'], steps: ['끓여요.'], tags: [], savedAt: now - i * 1000,
      source: 'user', status: 'sorted', favorite: false, cooked: 0 }
  }),
  diary: [], seedV: BASICS_VERSION,
  // 🏷🏷 **콩국수(여름 샘플 표지)를 «앱의 정식 통로»로 뺀다** — 창업자 *"콩국수 빼고"*
  //   ⛔ DOM 을 손으로 감추지 않는다(그건 흉내다 · 절대원칙 30).
  //   ⭐ 앱엔 이미 「유저가 지운 기본 레시피는 되살리지 않는다」가 있다(store.jsx:124 removedSeedIds).
  //      그 자리에 넣으면 «진짜 유저가 지운 것»과 같은 상태로 돈다.
  removedSeedIds: allBasicRecipes.filter((r) => r.sample).map((r) => r.id),
}

const b = await chromium.launch(process.env.SMOKE_CHROMIUM ? { executablePath: process.env.SMOKE_CHROMIUM } : {})
// ⭐ 폭 405 = `.app-frame { max-width: 440px }`(styles.css:292) 안쪽 — 540 이면 양옆이 프레임 배경이 된다
// ⛔⛔ **playwright 는 뷰포트를 영상 크기에 «늘려 주지 않는다» — 남는 데를 회색으로 채운다.**
//    첫 판이 그래서 카드 왼쪽 위 사분면에만 앱이 들어가고 나머지가 회색이었다(실측).
// ✅ 그래서 «뷰포트를 810×1440 으로 크게 잡고 페이지를 2배 확대»한다 —
//    확대하면 레이아웃 폭이 405 로 잡혀(.app-frame max-width 440 안쪽) 폰 그대로 그려지고,
//    실제 픽셀은 두 배라 카드에 크게 앉혀도 안 뭉갠다.
const ctx = await b.newContext({ viewport: { width: 810, height: 1440 }, deviceScaleFactor: 1,
  recordVideo: { dir: OUT, size: { width: 810, height: 1440 } } })
const { SEED_COACH_SEEN } = await import('../src/coach.js')
await ctx.addInitScript(SEED_COACH_SEEN)
await ctx.addInitScript((s) => {
  localStorage.setItem('hankki:v1', JSON.stringify(s)); localStorage.setItem('hankki:onboarded', '1')
  localStorage.setItem('hankki:news:off', '1'); localStorage.setItem('hankki:nudge:giftpack', '1')
  localStorage.setItem('hankki:gridSize', 'small')   // ⭐ 3열이라야 가족 셋이 고른 것이 한 화면에 같이 보인다
}, state)
const p = await ctx.newPage()
const 오류 = []
p.on('pageerror', (e) => 오류.push(String(e.message || e).split('\n')[0]))
await p.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle' })
// ⛔ addInitScript 로는 못 넣는다 — 그때는 document.documentElement 가 «아직 없다»(null 에 appendChild 했다).
//    문서가 선 «뒤에» 넣는다. 앱은 높이를 JS 로 재므로 확대 뒤 한 박자 기다린다.
// ⛔⛔ 확대만 하면 «키가 두 배»가 된다 — 앱이 화면 높이를 JS 로 재서 --app-height:1440px 를 넣는데
//    확대된 눈금에서 그 값이 2880 으로 읽혀 카드가 화면 밖으로 밀린다(실측: .app-frame 높이 2880).
//    그래서 확대 배수만큼 나눈 높이를 «못 박는다».
await p.addStyleTag({ content: 'html{zoom:2} .app-frame{height:720px !important}' })
await p.waitForTimeout(1500)
await p.getByText('레시피', { exact: true }).last().click()
await p.waitForTimeout(1200)

const 핀 = (i) => p.locator('.fav-dot').nth(i)
if (!(await p.locator('.fav-dot').count())) throw new Error('⛔ 핀 단추(.fav-dot)를 못 찾았다 — 영상을 내지 않는다')
// ⚠️ 확대(zoom)를 쓰면 «자와 눈금이 갈린다» — getBoundingClientRect 는 확대된 레이아웃 값(0~720)을 주는데
//    window.innerHeight 는 확대 «전» 값(1440)이다. 그대로 견주면 늘 통과하거나 늘 막힌다(실제로 막혔다).
//    그래서 화면 높이를 확대 배수로 나눠 같은 자로 맞춘다.
const 보이나 = await p.evaluate(() => {
  const z = parseFloat(getComputedStyle(document.documentElement).zoom) || 1
  const 화면 = window.innerHeight / z
  return [...document.querySelectorAll('.fav-dot')].slice(0, 3)
    .map((e) => { const r = e.getBoundingClientRect(); return r.top >= 0 && r.bottom <= 화면 })
})
if (보이나.length < 3 || 보이나.some((v) => !v)) throw new Error(`⛔ 핀 셋이 한 화면에 안 들어온다 — ${JSON.stringify(보이나)}`)

// ⏱ 장면마다 «녹화 시각»을 적어 둔다 — 나중에 이 시각으로 잘라 붙인다
const 장면 = []
const t0 = Date.now()
const 찍자 = async (이름, 초, 할일) => {
  const 시작 = (Date.now() - t0) / 1000
  if (할일) await 할일()
  await p.waitForTimeout(Math.round(초 * 1000))
  장면.push({ 이름, 시작: +시작.toFixed(2), 길이: +(((Date.now() - t0) / 1000) - 시작).toFixed(2) })
}

await 찍자('①물음', 2.6)
await 찍자('②아이', 3.0, () => 핀(0).click())
await 찍자('③아빠', 3.0, () => 핀(1).click())
await 찍자('④엄마', 3.0, () => 핀(2).click())

const 칩글 = await p.evaluate(() => [...document.querySelectorAll('.pill')].map((e) => e.innerText.trim()))
if (!칩글.some((t) => t.startsWith('해볼 것'))) throw new Error(`⛔ 「해볼 것」 칩이 안 섰다 (칩 줄 = ${칩글.join(' / ')})`)
await 찍자('⑤서랍', 2.8)
await 찍자('⑥최애', 3.2, () => 핀(0).click())

const 칩글2 = await p.evaluate(() => [...document.querySelectorAll('.pill')].map((e) => e.innerText.trim()))
if (!칩글2.some((t) => t.startsWith('최애'))) throw new Error(`⛔ 「최애」 칩이 안 섰다 (칩 줄 = ${칩글2.join(' / ')})`)
await 찍자('⑦다음주', 3.2, () => p.locator('.pill').filter({ hasText: '최애' }).first().click())
await 찍자('⑧마무리', 3.0)

await ctx.close(); await b.close(); srv.close()
if (오류.length) { console.log('⛔ 화면 오류'); 오류.forEach((e) => console.log('  ' + e)); process.exit(1) }
const webm = readdirSync(OUT).find((f) => f.endsWith('.webm'))
if (!webm) throw new Error('⛔ 녹화 파일이 안 생겼다')
console.log('🎥 녹화 · 장면', 장면.map((s) => `${s.이름}(${s.길이}s)`).join(' '))

// ── ② 짜임 — 바탕 한 장 ＋ 장면마다 앞면 한 장 ────────────────────────────
const 종이 = '#efe9dd', 먹 = '#3d3830', 팥 = '#9c5a45', 흐림 = '#7d7568'
const 바탕HTML = `<style>${폰트}
*{margin:0;padding:0}
body{width:${W}px;height:${H}px;background:${종이};position:relative;overflow:hidden;
  background-image:linear-gradient(rgba(120,110,90,.09) 1px,transparent 1px),linear-gradient(90deg,rgba(120,110,90,.09) 1px,transparent 1px);
  background-size:60px 60px}
.hole{position:absolute;left:${앱X}px;top:${앱Y}px;width:${앱W}px;height:${앱H}px;border-radius:34px;
  background:#fff;box-shadow:0 26px 60px rgba(60,50,35,.28)}
</style><div class="hole"></div>`

const 앞면 = (제목, 자막, 컷, 옵션 = {}) => `<style>${폰트}
*{margin:0;padding:0}
body{width:${W}px;height:${H}px;position:relative;overflow:hidden;background:transparent}
/* 🔲 앱 카드 «모서리»를 종이색으로 덮어 둥글게 보이게 한다 (영상은 네모라서) */
.corner{position:absolute;width:34px;height:34px;background:${종이}}
.c1{left:${앱X}px;top:${앱Y}px;border-radius:0 0 34px 0}
.c2{left:${앱X + 앱W - 34}px;top:${앱Y}px;border-radius:0 0 0 34px}
.c3{left:${앱X}px;top:${앱Y + 앱H - 34}px;border-radius:0 34px 0 0}
.c4{left:${앱X + 앱W - 34}px;top:${앱Y + 앱H - 34}px;border-radius:34px 0 0 0}
.head{position:absolute;left:0;right:0;top:74px;text-align:center;font-family:'Gaegu';font-weight:700;
  color:${먹};font-size:${옵션.제목크기 || 76}px;line-height:1.2;letter-spacing:-.01em}
.head b{color:${팥}}
.sub{position:absolute;left:0;right:0;top:${앱Y + 앱H + 34}px;text-align:center;
  font-family:'Gowun Dodum';color:${흐림};font-size:40px;line-height:1.45}
.sub b{color:${먹};font-weight:700}
.cut{position:absolute;filter:drop-shadow(0 14px 22px rgba(50,40,25,.22))}
</style>
<div class="corner c1"></div><div class="corner c2"></div><div class="corner c3"></div><div class="corner c4"></div>
<div class="head">${제목}</div>
<div class="sub">${자막}</div>
${컷 || ''}`

const 컷1 = `<img class="cut" src="${스('duos_03')}" style="left:26px;top:1660px;height:230px">`
const 컷2 = `<img class="cut" src="${스('gp_duotb')}" style="right:26px;top:1650px;height:240px">`
const 컷3 = `<img class="cut" src="${스('gp_gomft')}" style="right:34px;top:58px;height:180px">`

const 앞면들 = {
  '①물음': 앞면('이번 주에 뭐 먹지?', '가족이 모여 앉아<br><b>먹고 싶은 걸 하나씩 꽂아요</b>', 컷1),
  '②아이': 앞면('아이가 골라요', '카드 오른쪽 위 <b>요리사 모자</b>를 톡', 컷1),
  '③아빠': 앞면('아빠가 골라요', '누르면 <b>모자가 진해져요</b>', 컷1),
  '④엄마': 앞면('엄마가 골라요', '이번 주엔 <b>버섯전골</b>', 컷1),
  '⑤서랍': 앞면('고른 게 한 서랍에', '위 칩에 <b>‘해볼 것 3’</b> 이 저절로 서요', 컷3),
  '⑥최애': 앞면('맛있었으면 한 번 더', '모자를 다시 누르면 <b>하트 = 최애</b>', 컷3),
  '⑦다음주': 앞면('다음 주엔 최애만', '하트만 모아서 <b>또 해먹어요</b>', 컷2),
  '⑧마무리': 앞면('한 주가 이렇게 짜여요', '<b>해볼 것</b> = 이번 주에 할 것<br><b>최애</b> = 다음에 또 할 것', 컷2, { 제목크기: 68 }),
}

const b2 = await chromium.launch(process.env.SMOKE_CHROMIUM ? { executablePath: process.env.SMOKE_CHROMIUM } : {})
const pg = await b2.newPage({ viewport: { width: W, height: H } })
await pg.setContent(바탕HTML, { waitUntil: 'networkidle' })
await pg.waitForTimeout(250)
const 바탕판 = join(OUT, '_바탕.png')
await pg.screenshot({ path: 바탕판 })
for (const s of 장면) {
  await pg.setContent(앞면들[s.이름], { waitUntil: 'networkidle' })
  await pg.waitForTimeout(250)
  s.앞면 = join(OUT, `_앞_${s.이름}.png`)
  await pg.screenshot({ path: s.앞면, omitBackground: true })
}
await b2.close()

// ── ③ 붙이기 — 바탕 위에 앱 영상, 그 위에 앞면 ───────────────────────────
const 조각들 = []
for (const s of 장면) {
  const 조각 = join(OUT, `_조각_${s.이름}.mp4`)
  execFileSync(FF, ['-hide_banner', '-loglevel', 'error',
    '-loop', '1', '-i', 바탕판,
    '-ss', String(s.시작), '-t', String(s.길이), '-i', join(OUT, webm),
    '-loop', '1', '-i', s.앞면,
    '-filter_complex',
    `[1:v]scale=${앱W}:${앱H}:flags=lanczos[app];[0:v][app]overlay=${앱X}:${앱Y}[bg];[bg][2:v]overlay=0:0,fps=60,format=yuv420p,setsar=1[v]`,
    '-map', '[v]', '-t', String(s.길이),
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-y', 조각], { stdio: 'inherit' })
  조각들.push(조각)
}

// 장면 사이는 부드럽게 — 앞 장이 위로 밀리고 다음 장이 아래에서 올라온다(소소 릴스와 같은 결)
const TR = 0.35
const IN = []; 조각들.forEach((c) => IN.push('-i', c))
let G = '', PREV = '[0:v]', ACC = 0
for (let i = 1; i < 조각들.length; i++) {
  ACC = +(ACC + 장면[i - 1].길이 - TR).toFixed(3)
  const NEXT = i === 조각들.length - 1 ? '[v]' : `[x${i}]`
  G += `${PREV}[${i}:v]xfade=transition=slideup:duration=${TR}:offset=${ACC}${NEXT};`
  PREV = NEXT
}
const mp4 = join(OUT, '핀릴스-가족이같이골라요.mp4')
execFileSync(FF, ['-hide_banner', '-loglevel', 'error', ...IN, '-filter_complex', G.slice(0, -1), '-map', '[v]', '-r', '60',
  '-c:v', 'libx264', '-preset', 'medium', '-b:v', '6800k', '-maxrate', '7800k', '-bufsize', '14000k',
  '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', '-y', mp4], { stdio: 'inherit' })

const 길이 = (() => {
  try { execFileSync(FF, ['-i', mp4], { stdio: ['ignore', 'pipe', 'pipe'] }) } catch (e) {
    const m = String(e.stderr || '').match(/Duration: ([0-9:.]+)/); return m ? m[1] : '?'
  }
  return '?'
})()
console.log(`\n✅ 오류 0 · 길이 ${길이} ·`, mp4)
execFileSync('bash', ['-c', `ls -la "${mp4}"`], { stdio: 'inherit' })
