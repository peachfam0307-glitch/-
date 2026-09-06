// 📣📥 인스타 캐러셀 「레시피 담는 법 여섯 가지」 — 1080×1350 · 8장 (2026-09-06)
//
// 📮 창업자 = *"캡처하는 법 캐러셀도 만들어줘"* → *"우리 가져오기 할 수 있는 거 다 각각 넣어줄래?"*
// 🧭 여섯 길 = `ImportScreen.jsx` OPTIONS(share·gallery·photo·write) ＋ 안쪽 길(text·link) — 앱이 정한 목록 그대로.
// 🎨 뼈대 = 스토어 v8 D(모눈·올리브·왼쪽 정렬·폰 오른쪽·세로 단계) 캐러셀 판과 같은 값 — 인스타에 같은 결로 나간다.
// 🖼 재료 = `design/promo/스토어v8-원본-2509/v8-30~36`(앱 가져오기 화면 · scratchpad/shot-import.mjs 로 찍음) ＋ `가져오기안내-원본캡처-2508`(인스타·갤러리·아이콘)
// 실행: SMOKE_CHROMIUM=/opt/pw-browsers/chromium node scripts/_판-캡처법캐러셀-0906.mjs
import './_fresh.mjs'
import { chromium } from 'playwright'
import { readFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'

const ROOT = new URL('..', import.meta.url).pathname
const 원본 = join(ROOT, 'design/promo/스토어v8-원본-2509')
const 안내 = join(ROOT, 'design/promo/가져오기안내-원본캡처-2508')
const OUT = process.env.OUT || ('/tmp/claude-0/-home-user-hankki/0848ab85-00e3-56db-9a26-e87075950c12/scratchpad/캡처법캐러셀' + (process.env.STYLE === 'B' ? 'B' : ''))
mkdirSync(OUT, { recursive: true })
const b64 = (p) => `data:image/png;base64,${readFileSync(p).toString('base64')}`
const 폰트 = readFileSync(join(ROOT, 'design/promo/fonts-embed.css'), 'utf8')
const 앱 = (f) => b64(join(원본, `v8-${f}.png`))
const 스티커 = (k) => b64(join(ROOT, /^(pjs|duos)_/.test(k) ? `src/assets/sharepool/${k}.png` : `src/assets/stickers/photo/${k}.png`))
// 📏 스티커 폭 = 그림(bbox) 높이 기준 — 스토어 v8 과 같은 표(곰 400·펭 360·콤비 380 × 캐러셀 0.8)
const 치수 = { au_b09: [533, 578], au_b27: [557, 508], au_b15: [548, 570], au_b16: [558, 558], au_b20: [427, 471], au_b24: [364, 403], au_b26: [651, 529], au_b28: [466, 515], au_b29: [579, 403], au_b30: [648, 481], gp_gomhi: [593, 667], gp_gomtb: [581, 698], gp_gomft: [572, 699], gp_gomv: [548, 663], pjs_01: [427, 551], pjs_03: [401, 552], pjs_05: [486, 546], pjs_07: [486, 546], duos_02: [595, 533], duos_06: [620, 475] }
const 폭 = (k) => { const [w, h] = 치수[k] || [1, 1]; const 콤비 = /^(duos_|au_b(15|16|26|30))/.test(k); const H = 콤비 ? 380 : /^(gp_gom|au_b(09|28))/.test(k) ? 400 : 360; return Math.round(H * w / h * 0.8) }
// 🎨 [14:22 창업자] *"이건 좀 다른 스타일로 만들어줘(배경색이나 글씨색 애들 스티커 등등)"* → STYLE=B
//    = 세이지 그린 종이(#dde4d3 · 잔점) · 글씨 진한 갈색(#5d3410 · 로고색) · 번호 테라코타 · 폰은 «똑바로» ＋ 마스킹테이프 · 스티커는 가을 곰펭 정본(au_b)
const B = process.env.STYLE === 'B'
const B스티커 = { 'gp_gomhi': 'au_b16', 'pjs_07': 'au_b24', 'gp_gomtb': 'au_b28', 'gp_gomft': 'au_b09', 'pjs_01': 'au_b27', 'duos_06': 'au_b30' }
const 고르기 = (k) => (B && B스티커[k]) || k

const 올리브 = B ? '#5d3410' : '#4a4f36'
const B공통 = B ? `
body{background:#dde4d3;background-image:radial-gradient(rgba(93,52,16,.10) 1.6px,transparent 1.8px);background-size:30px 30px}
.rule{background:rgba(93,52,16,.25)}
.no{background:#c2703a}
.front{transform:none;right:24px;top:400px;border-color:#fbf5e8;border-radius:40px;box-shadow:0 26px 60px rgba(60,50,30,.22)}
.front::after{content:'';position:absolute;left:50%;top:-18px;width:210px;height:52px;margin-left:-105px;background:rgba(235,214,170,.85);transform:rotate(-4deg);border-radius:4px;z-index:9}
.back{transform:rotate(-3deg);border-color:#fbf5e8}
.step .dot{background:#fbf5e8;color:#c2703a}
.step img,.step .dot{border-color:#fbf5e8}
.free{background:#fbf5e8;color:#3f6b3a;border:2px solid rgba(63,107,58,.25)}
.sp path{fill:#e7a24a}
` : ''
const 공통 = `${폰트}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative;font-family:'Jua','Gowun Dodum',system-ui,sans-serif;-webkit-font-smoothing:antialiased;
  background:#f1ede6;background-image:linear-gradient(rgba(74,79,54,.09) 1px,transparent 1px),linear-gradient(90deg,rgba(74,79,54,.09) 1px,transparent 1px);background-size:54px 54px}
.wrap{position:relative;z-index:3;text-align:left;padding:64px 64px 0}
.hh{font-family:'Jua';color:${올리브};letter-spacing:-0.02em;font-size:84px;line-height:1.28}
.ss{font-family:'Gowun Dodum';color:rgba(74,79,54,.62);font-size:32px;line-height:1.5;margin-top:12px}
.rule{position:absolute;z-index:2;left:64px;right:64px;top:330px;height:3px;background:rgba(74,79,54,.22)}
.no{display:inline-block;background:${올리브};color:#fff8ec;font-family:'Jua';font-size:30px;border-radius:999px;padding:6px 22px;margin-bottom:14px;letter-spacing:.04em}
.front{position:absolute;z-index:4;right:-20px;top:410px;width:600px;height:1000px;border-radius:52px;overflow:hidden;
  border:12px solid #fffdf8;transform:rotate(-4deg);box-shadow:0 40px 80px rgba(74,79,54,.22);background:#fffdf8}
.front img{width:100%;height:100%;display:block;object-fit:cover;object-position:top}
.back{position:absolute;z-index:3;left:44px;top:420px;width:340px;height:600px;border-radius:28px;overflow:hidden;
  border:9px solid #fffdf8;transform:rotate(3deg);box-shadow:0 30px 62px rgba(74,79,54,.18);background:#fffdf8}
.back img{width:100%;height:100%;object-fit:cover;object-position:top;display:block}
.steps{position:absolute;z-index:6;left:64px;top:1040px;display:flex;flex-direction:column;gap:14px}
.steps.hi{top:860px}
.step{display:flex;align-items:center;gap:18px}
.step img,.step .dot{width:78px;height:78px;border-radius:50%;display:block;box-shadow:0 4px 12px rgba(74,79,54,.16);border:4px solid #fffdf8;flex:0 0 auto}
.step .dot{background:#e6e2d6;display:flex;align-items:center;justify-content:center;font-family:'Jua';font-size:30px;color:${올리브}}
.step b{font-family:'Jua';font-weight:400;color:${올리브};font-size:29px;letter-spacing:-0.02em;display:block}
.step small{display:block;font-family:'Gowun Dodum';color:rgba(74,79,54,.6);font-size:22px}
.duo{position:absolute;z-index:5;left:56px;top:470px;filter:drop-shadow(0 10px 20px rgba(74,79,54,.16))}
.free{position:absolute;z-index:6;left:64px;top:840px;background:#e8efe0;color:#3f6b3a;font-family:'Jua';font-size:26px;border-radius:999px;padding:8px 20px}
.sp{position:absolute;z-index:5;filter:drop-shadow(0 0 10px rgba(255,214,120,.85));transform:scale(.8)}
${B공통}`
const 별 = (x, y, s, o = 1, c = '#f2c86a') => `<svg class="sp" style="left:${x}px;top:${y}px;width:${s}px;height:${s}px;opacity:${o}" viewBox="0 0 48 48"><path d="M24 2C25.6 16 32 22.4 46 24 32 25.6 25.6 32 24 46 22.4 32 16 25.6 2 24 16 22.4 22.4 16 24 2Z" fill="${c}"/></svg>`
const 샤랄라 = () => 별(700, 70, 74) + 별(790, 150, 40, .8, '#fff3d6') + 별(380, 430, 52, .9) + 별(1000, 400, 62) + 별(300, 900, 44, .85)
const 머리 = (no, h, s) => `<div class="wrap">${no ? `<div class="no">${no}</div>` : ''}<div class="hh">${h}</div><div class="ss">${s}</div></div><div class="rule"></div>`
const 단계 = (rows, hi = false) => `<div class="steps${hi ? ' hi' : ''}">${rows.map(([e, b, s]) => `<div class="step">${/^data:/.test(e) ? `<img src="${e}">` : `<div class="dot">${e}</div>`}<div><b>${b}</b>${s ? `<small>${s}</small>` : ''}</div></div>`).join('')}</div>`
const 장 = ({ no, 머리: h, 부제, 파일, 곰, 단계: rows, 자리 = 'top', 무료 = '', 뒤 = '' }) => `<style>${공통}.front img{object-position:${자리}}</style>
${머리(no, h, 부제)}${샤랄라()}
${뒤 ? `<div class="back"><img src="${뒤}"></div>` : ''}
${곰 ? `<img class="duo" style="width:${폭(고르기(곰))}px" src="${스티커(고르기(곰))}">` : ''}
${무료 ? `<div class="free">${무료}</div>` : ''}
<div class="front"><img src="${파일}"></div>
${단계(rows, !뒤 && !곰)}`

const i공유 = b64(join(안내, 'i-공유.png')), i더보기 = b64(join(안내, 'i-더보기.png')), i한끼 = b64(join(안내, 'i-한끼.png'))
const 공유단계 = [[i공유, '공유', '캡처한 화면에서'], [i더보기, '더보기'], [i한끼, '한끼', '누르면 끝']]

const 장들 = {
  '캐러셀-01-표지': () => 장({ 머리: '레시피 담는 법,<br>여섯 가지', 부제: '어디서 봤든 한끼로 · 캡처 · 갤러리 · 사진 · 글 · 손 · 링크', 파일: 앱('30-가져오기'), 곰: 'gp_gomhi',
    단계: [['+', '아래 가운데 「가져오기」', '여기서 다 골라요']] }),
  '캐러셀-02-SNS': () => 장({ no: '① 제일 많이 써요', 머리: '인스타 · 유튜브<br>보다가 캡처', 부제: '캡처하고 공유 한 번이면 재료·순서까지 정리', 파일: b64(join(안내, '인스타-공유동그라미.png')), 단계: 공유단계 }),
  '캐러셀-03-갤러리': () => 장({ no: '②', 머리: '갤러리에 있던<br>사진도 똑같이', 부제: '예전에 저장해 둔 레시피 캡처 · 여러 장도 돼요', 파일: b64(join(안내, '6-갤러리-도구띠.png')), 자리: '50% 100%', 단계: 공유단계 }), // 아래 도구 띠(공유 아이콘)가 보이게 «아래»로 자른다
  '캐러셀-04-앱사진': () => 장({ no: '③', 머리: '앱 안에서<br>사진 고르기', 부제: '앱을 안 나가고 · 사진을 보면서 고칠 수 있어요', 파일: 앱('33-가져오기-앱사진'), 곰: 'pjs_07',
    단계: [['1', '가져오기 › 앱에서 사진'], ['2', '사진 고르기', '여러 장도 돼요'], ['3', '재료·만드는 법이 채워져요']] }),
  '캐러셀-05-글붙여넣기': () => 장({ no: '④', 머리: '글을 복사해서<br>붙여넣기', 부제: '블로그 레시피에 딱 · 재료·순서까지 자동 정리', 파일: 앱('35-가져오기-텍스트'), 곰: 'gp_gomtb', 무료: '열쇠 안 써요',
    단계: [['1', '레시피 글 복사'], ['2', '가져오기 › 텍스트 붙여넣기'], ['3', '붙여넣으면 끝']] }),
  '캐러셀-06-직접입력': () => 장({ no: '⑤', 머리: '빈 종이에<br>직접 적기', 부제: '엄마 레시피 · 우리 집 비법 · 적는 도중에도 저장돼요', 파일: 앱('34-가져오기-직접입력'), 곰: 'gp_gomft', 무료: '열쇠 안 써요',
    단계: [['1', '가져오기 › 직접 입력하기'], ['2', '제목 · 재료 · 만드는 법'], ['3', '중간에 사진도 「카메라」로']] }),
  '캐러셀-07-링크': () => 장({ no: '⑥', 머리: '링크 주소만<br>담아두기', 부제: '나중에 볼 레시피는 주소만 · 재료는 그때 채워요', 파일: 앱('36-가져오기-링크'), 곰: 'pjs_01', 무료: '열쇠 안 써요',
    단계: [['1', '주소 붙여넣기'], ['2', '임시보관함에 담겨요'], ['3', '나중에 캡처·붙여넣기로 채우기']] }),
}
// 08 마무리 — 곰펭 콤비 ＋ CTA
const 장08 = () => `<style>${공통}
.card{position:absolute;left:64px;right:64px;top:400px;z-index:3;background:#fffdf8;border-radius:36px;padding:44px 46px;box-shadow:0 20px 44px rgba(74,79,54,.12)}
.card p{font-family:'Gowun Dodum';color:${올리브};font-size:34px;line-height:1.66;letter-spacing:-0.01em}
.card .go{color:#c2703a;font-weight:700}
.duo{left:auto;right:64px;top:80px;width:300px}
.pill{position:absolute;left:64px;bottom:210px;z-index:3;background:${올리브};color:#fff8ec;border-radius:999px;padding:16px 36px;font-size:32px;font-family:'Jua';white-space:nowrap}
.end{position:absolute;left:64px;right:64px;bottom:44px;z-index:3;font-family:'Jua';color:${올리브};font-size:42px;line-height:1.4;letter-spacing:-0.02em}
</style>
${머리('', '어디서 봤든,<br>한끼 하나면', '흩어진 레시피를, 한곳에')}${샤랄라()}
<img class="duo" src="${스티커(고르기('duos_06'))}">
<div class="card"><p>인스타에서 본 것도, 갤러리에 쌓인 것도,<br>엄마가 불러준 것도.<br><span class="go">한끼에 담으면 재료·순서가 정리돼요.</span></p><p style="margin-top:26px">담아 두면 요리모드 · 장보기 · 일기까지<br>그대로 이어져요.</p></div>
<div class="pill">▶ Play 스토어에서 「한끼」 검색</div>
<div class="end">오늘도 한 끼 해냈다면,<br>한끼에서 만나요</div>`

const CHROMIUM = process.env.SMOKE_CHROMIUM
const br = await chromium.launch(CHROMIUM ? { executablePath: CHROMIUM } : {})
const p = await br.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 2 })
const 이름들 = []
for (const [n, f] of Object.entries({ ...장들, '캐러셀-08-마무리': 장08 })) {
  await p.setContent(`<!doctype html><meta charset="utf-8">${f()}`)
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300)
  await p.screenshot({ path: `${OUT}/${n}.png` }); 이름들.push(n); console.log('  ✅', n)
}
await br.close()
execFileSync('python3', ['-c', `from PIL import Image
names=${JSON.stringify(이름들)}
w=500; h=625
sh=Image.new('RGB',(w*4+50,h*2+30),'white')
for i,n in enumerate(names):
  sh.paste(Image.open('${OUT}/'+n+'.png').resize((w,h)),(10+(i%4)*(w+10),10+(i//4)*(h+10)))
sh.save('${OUT}/캐러셀-검수판.png')`])
console.log(`\n📸 8장 ＋ 검수판 → ${OUT}`)
