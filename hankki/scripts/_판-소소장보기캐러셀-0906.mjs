// 📣🛒 인스타 캐러셀 「소소한 기능 ① 장보기·냉장고」 — 1080×1350 · 8장 (2026-09-06)
//
// 📮 창업자 20:13 = *"아직 소개 안 한 것+내가 적은 것 해서 2,3번에 나눠서 올려보자. 종류별로 묶어서"*
//    1편 = 영수증 → 찾은 재료 → 냉장고 D-day → 가진 재료 추천 → 인분·장보기 담기 → 체크→냉장고 → 쇼핑몰
// 🎨 뼈대 = 앞 셋(모눈 올리브 D · 세이지 C · 크라프트 속지)과 «다르게» — 「냉장고 문 ＋ 자석 메모 ＋ 영수증 종이」
//    · 바탕 = 냉장고 문 색(연한 하늘회색) ＋ 은은한 가로 결 · 제목 = 로고 갈색 · 번호 = 동그란 «자석»
//    · 폰은 «똑바로» 세우고 위에 자석 하나 · 설명은 «영수증 종이»(톱니 아랫단) 에 얹는다
// 🖼 재료 = scratchpad/소소1/앱/01~05(`_shot-소소장보기-0906.mjs`) ＋ 창업자 캡처 둘(`design/promo/창업자캡처-소소기능-2509/`)
// 🐧 스티커 = sharepool 정본만(pjs_·duos_) ＋ 곰 gp_gom*(정본) — ⛔gp_peng·gp_duo 는 옛 펭펭(README 00절)
//
// 실행: cd /home/user/hankki/hankki && SMOKE_CHROMIUM=/opt/pw-browsers/chromium-1194/chrome-linux/chrome node scripts/_판-소소장보기캐러셀-0906.mjs
//      REEL=1 → 1080×1920(릴스 재료)
import './_fresh.mjs'
import { chromium } from 'playwright'
import { readFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'

const ROOT = new URL('..', import.meta.url).pathname
const SCR = '/tmp/claude-0/-home-user-hankki/2414fcda-d05a-5b79-84dc-8c748bfda84b/scratchpad/소소1'
const 앱폴더 = process.env.APP || join(ROOT, 'design/promo/소소기능-앱화면-2509')   // _shot-소소장보기-0906 이 찍은 5장(저장소에 담아 둠)
const 창업자 = join(ROOT, 'design/promo/창업자캡처-소소기능-2509')
const REEL = !!process.env.REEL
const OUT = process.env.OUT || join(SCR, REEL ? '릴스재료' : '캐러셀')
mkdirSync(OUT, { recursive: true })
const b64 = (p) => `data:image/png;base64,${readFileSync(p).toString('base64')}`
const 폰트 = readFileSync(join(ROOT, 'design/promo/fonts-embed.css'), 'utf8')
const 앱 = (f) => b64(join(앱폴더, `${f}.png`))
const 스티커 = (k) => b64(join(ROOT, /^(pjs|duos)_/.test(k) ? `src/assets/sharepool/${k}.png` : `src/assets/stickers/photo/${k}.png`))
// 📏 그림(bbox) 실측 — 폭은 높이 기준으로(곰 400·펭 360·콤비 380 × 0.8 · 스토어 v8 표와 같다)
const 치수 = { pjs_07: [426, 549], pjs_08: [487, 528], pjs_05: [450, 546], pjs_01: [391, 551], duos_04: [589, 583], duos_01: [584, 567], gp_gomtb: [581, 698], gp_gomhi: [593, 667] }
const 폭 = (k) => { const [w, h] = 치수[k]; const H = /^duos_/.test(k) ? 380 : /^gp_gom/.test(k) ? 400 : 360; return Math.round(H * w / h * 0.8) }
const 곰펭 = (k, x, y, w = 폭(k), r = 0) => `<img class="sp" src="${스티커(k)}" style="left:${x}px;top:${y}px;width:${w}px;transform:rotate(${r}deg)">`

const 갈색 = '#5d3410', 파랑 = '#5b7ea8', 먹 = '#3a3f46'
const H = REEL ? 1920 : 1350
const 공통 = `${폰트}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:${H}px;overflow:hidden;position:relative;font-family:'Jua','Gowun Dodum',system-ui,sans-serif;-webkit-font-smoothing:antialiased;
  background:#e9eff2;background-image:repeating-linear-gradient(180deg,rgba(255,255,255,.55) 0 2px,transparent 2px 26px),linear-gradient(180deg,#eef3f5,#e3eaee)}
.stage{position:relative;width:1080px;height:${H}px}
.top{position:relative;z-index:3;padding:${REEL ? 300 : 64}px 64px 0;text-align:left}
.tag{display:inline-block;font-family:'Jua';font-size:28px;color:#fff;background:${파랑};border-radius:999px;padding:8px 24px;letter-spacing:.06em;margin-bottom:18px}
.hh{font-family:'Jua';color:${갈색};font-size:84px;line-height:1.22;letter-spacing:-0.02em}
.ss{font-family:'Gowun Dodum';color:rgba(58,63,70,.68);font-size:32px;line-height:1.5;margin-top:14px}
.sp{position:absolute;z-index:7;filter:drop-shadow(0 12px 18px rgba(40,50,60,.22))}
/* 📱 폰 — 똑바로 · 위에 자석 */
.phone{position:absolute;z-index:5;width:520px;height:${REEL ? 1000 : 860}px;border-radius:44px;overflow:hidden;border:10px solid #fff;background:#fff;box-shadow:0 28px 60px rgba(40,50,60,.22),0 3px 8px rgba(40,50,60,.12)}
.phone img{width:100%;display:block}
.mag{position:absolute;z-index:8;width:64px;height:64px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ffd98a,#e6a63c 60%,#b8772a);box-shadow:0 6px 12px rgba(40,50,60,.3),inset 0 -3px 6px rgba(0,0,0,.15)}
/* 🧾 영수증 종이 — 아랫단 톱니 */
.slip{position:absolute;z-index:6;background:#fffdf9;padding:30px 34px 40px;box-shadow:0 18px 40px rgba(40,50,60,.18);font-family:'Gowun Dodum';color:${먹}}
.slip::after{content:'';position:absolute;left:0;right:0;bottom:-14px;height:14px;background:linear-gradient(-45deg,transparent 10px,#fffdf9 0) 0 0/28px 14px repeat-x,linear-gradient(45deg,transparent 10px,#fffdf9 0) 14px 0/28px 14px repeat-x}
.slip .no{display:inline-flex;align-items:center;justify-content:center;width:54px;height:54px;border-radius:50%;background:${파랑};color:#fff;font-family:'Jua';font-size:30px;margin-bottom:12px}
.slip b{display:block;font-family:'Jua';font-weight:400;color:${갈색};font-size:40px;line-height:1.25}
.slip small{display:block;font-size:26px;line-height:1.5;color:rgba(58,63,70,.75);margin-top:10px}
.slip .dash{border-top:2px dashed rgba(58,63,70,.25);margin:16px 0 12px}
.foot{position:absolute;left:0;right:0;bottom:${REEL ? 300 : 30}px;z-index:9;text-align:center;font-family:'Gowun Dodum';font-size:24px;color:rgba(58,63,70,.5)}
`

// 한 장 = 제목 ＋ 폰(오른쪽) ＋ 영수증 종이(왼쪽 아래) ＋ 스티커
const 장 = ({ no, 머리, 부제, 그림, 캡션, 캡션2, 스, 스자리, 폰y = 400, 폰x = 500, 잘라 = 0 }) => `<style>${공통}
.phone{left:${폰x}px;top:${폰y}px}
.phone img{margin-top:-${잘라}px}
.mag.p{left:${폰x + 228}px;top:${폰y - 30}px}
.slip{left:64px;top:${폰y + 230}px;width:400px}</style><div class="stage">
<div class="top"><div class="tag">소소한 기능 ①</div><div class="hh">${머리}</div><div class="ss">${부제}</div></div>
<div class="phone"><img src="${앱(그림)}"></div><div class="mag p"></div>
<div class="slip"><span class="no">${no}</span><b>${캡션}</b><div class="dash"></div><small>${캡션2}</small></div>
${스 ? 곰펭(스, ...스자리) : ''}
<div class="foot">한끼 · 장보기 탭</div></div>`

const 장들 = {
  '소소1-01-표지': () => `<style>${공통}
.fan{position:absolute;z-index:4;top:${REEL ? 780 : 520}px;width:440px;height:720px;border-radius:36px;overflow:hidden;border:9px solid #fff;background:#fff;box-shadow:0 26px 54px rgba(40,50,60,.2)}
.fan img{width:100%;display:block}
.f1{left:60px;transform:rotate(-7deg)} .f2{left:320px;top:${REEL ? 820 : 560}px;z-index:5} .f3{left:580px;transform:rotate(7deg)}
.hh{font-size:96px}</style><div class="stage">
<div class="top"><div class="tag">소소한 기능 ①</div><div class="hh">장 봐 오면<br>그다음은 한끼가</div><div class="ss">영수증 → 냉장고 → 오늘 메뉴 → 장보기까지</div></div>
<div class="fan f1"><img src="${앱('02-냉장고Dday')}"></div>
<div class="fan f3"><img src="${앱('03-장보기체크')}"></div>
<div class="fan f2"><img src="${앱('01-냉장고추천')}"></div>
<div class="mag" style="left:520px;top:${REEL ? 790 : 530}px"></div>
${곰펭('duos_04', 640, REEL ? 1480 : 920, 400, -4)}
<div class="foot">한끼 · 장보기 탭</div></div>`,

  '소소1-02-영수증': () => `<style>${공통}
.rc{position:absolute;z-index:4;left:64px;top:${REEL ? 700 : 420}px;width:420px;background:#fff;padding:18px 0 26px;box-shadow:0 18px 40px rgba(40,50,60,.18);overflow:hidden}
.rc::after{content:'';position:absolute;left:0;right:0;bottom:0;height:14px;background:linear-gradient(-45deg,transparent 10px,#e9eff2 0) 0 0/28px 14px repeat-x,linear-gradient(45deg,transparent 10px,#e9eff2 0) 14px 0/28px 14px repeat-x}
.rc img{width:100%;display:block}
.arrow{position:absolute;z-index:6;left:470px;top:${REEL ? 1030 : 750}px;font-family:'Jua';font-size:64px;color:${파랑}}
.phone{left:520px;top:${REEL ? 700 : 400}px;height:${REEL ? 1000 : 820}px}
.phone img{margin-top:-${Math.round(520 * 2340 / 1080 * 0.395)}px}
.mag.p{left:748px;top:${REEL ? 670 : 370}px}
.slip{left:64px;top:${REEL ? 1400 : 1010}px;width:400px;padding:22px 30px 30px}
.slip b{font-size:34px}</style><div class="stage">
<div class="top"><div class="tag">소소한 기능 ①</div><div class="hh">영수증 찍으면<br>재료가 쏙</div><div class="ss">이름만 골라 담아요 · 아닌 건 체크 풀고</div></div>
<div class="rc"><img src="${b64(join(창업자, '소소-영수증-품목만-2026-09-06.png'))}"></div>
<div class="arrow">→</div>
<div class="phone"><img src="${b64(join(창업자, '소소-영수증에서찾은재료-2026-09-06.png'))}"></div><div class="mag p"></div>
<div class="slip"><span class="no">1</span><b>냉장고 → 영수증</b><div class="dash"></div><small>사진 한 장이면 두부·감자·공심채가 냉장고에 들어가요</small></div>
${곰펭('pjs_07', REEL ? 720 : 740, REEL ? 1560 : 1040, 300, 4)}
<div class="foot">한끼 · 장보기 탭 → 냉장고</div></div>`,

  '소소1-03-유통기한': () => 장({ no: 2, 머리: '유통기한은<br>앱이 세요', 부제: '가까운 것부터 D-1 · D-2 · 색으로 알려줘요', 그림: '02-냉장고Dday', 캡션: '냉장고 재료함', 캡션2: '재료를 누르면 유통기한·수량을 적을 수 있어요', 스: 'pjs_08', 스자리: [30, REEL ? 1420 : 1020, 250, -5] }),
  '소소1-04-추천': () => 장({ no: 3, 머리: '냉장고 열면<br>오늘 메뉴가', 부제: '가진 재료로 만들 수 있는 요리를 골라줘요', 그림: '01-냉장고추천', 캡션: '가진 재료로 만들 수 있어요', 캡션2: '두부·달걀·애호박… 넣어둔 것만으로 맞춰 줘요', 스: 'gp_gomtb', 스자리: [40, REEL ? 1420 : 1020, 250, 5] }),
  '소소1-05-인분': () => 장({ no: 4, 머리: '인분 바꾸면<br>재료도 따라와요', 부제: '2인분 → 4인분, 양은 앱이 계산해요', 그림: '05-인분조절', 캡션: '인분 − ＋ · 장보기 담기', 캡션2: '레시피 재료를 한 번에 장보기 리스트로', 스: 'pjs_01', 스자리: [60, REEL ? 1420 : 1020, 220, -6], 잘라: 560 }),
  '소소1-06-체크': () => 장({ no: 5, 머리: '샀으면 체크,<br>냉장고로 쏙', 부제: '장보기에서 지우는 게 아니라 냉장고에 넣어 둬요', 그림: '03-장보기체크', 캡션: '샀어요! 냉장고에 넣어뒀어요', 캡션2: '체크 한 번이면 냉장고 재료함에 들어가요', 스: 'pjs_07', 스자리: [40, REEL ? 1420 : 1020, 250, 4] }),
  '소소1-07-쇼핑몰': () => 장({ no: 6, 머리: '사러가기는<br>늘 쓰던 몰로', 부제: '쿠팡·컬리·이마트몰… 앱이 깔려 있으면 바로 열려요', 그림: '04-쇼핑몰', 캡션: '쇼핑몰 바로가기', 캡션2: '줄마다 「사러가기」 · 몰은 편집에서 내 걸로', 스: 'pjs_05', 스자리: [40, REEL ? 1420 : 1020, 240, -4] }),

  '소소1-08-마무리': () => `<style>${공통}
.card{position:absolute;z-index:5;left:80px;right:80px;top:${REEL ? 720 : 400}px;background:#fffdf9;border-radius:32px;padding:44px 48px;box-shadow:0 22px 48px rgba(40,50,60,.16)}
.step{display:flex;align-items:center;gap:22px;margin:0 0 20px}
.step .d{width:60px;height:60px;border-radius:50%;background:${파랑};color:#fff;font-family:'Jua';font-size:30px;display:flex;align-items:center;justify-content:center;flex:none}
.step b{font-family:'Jua';color:${갈색};font-size:38px;font-weight:400} .step small{display:block;font-family:'Gowun Dodum';color:rgba(58,63,70,.65);font-size:25px;margin-top:2px}
.pill{position:absolute;left:50%;transform:translateX(-50%);bottom:${REEL ? 420 : 150}px;z-index:6;background:${갈색};color:#fff7ea;border-radius:999px;padding:16px 40px;font-size:32px;font-family:'Jua';white-space:nowrap}
.end{position:absolute;left:0;right:0;bottom:${REEL ? 330 : 56}px;z-index:5;text-align:center;font-family:'Jua';color:${갈색};font-size:38px;line-height:1.4}
.foot{display:none}</style><div class="stage">
<div class="top"><div class="tag">이렇게 돌아요</div><div class="hh">장보기 탭 하나로<br>한 바퀴</div><div class="ss">다음 편 = 홈이 알아서 · 기록은 내 것</div></div>
<div class="card">
<div class="step"><div class="d">1</div><div><b>영수증 찍기</b><small>냉장고 → 영수증 · 재료가 들어가요</small></div></div>
<div class="step"><div class="d">2</div><div><b>유통기한 · 오늘 메뉴</b><small>D-day 표 · 가진 재료로 만들 수 있어요</small></div></div>
<div class="step"><div class="d">3</div><div><b>장보기 담기 → 체크</b><small>인분 맞춰 담고, 사면 체크 · 냉장고로</small></div></div>
<div class="step" style="margin:0"><div class="d">4</div><div><b>사러가기</b><small>늘 쓰던 쇼핑몰로 바로</small></div></div></div>
${곰펭('duos_01', 20, REEL ? 1380 : 900, 280, -3)}
<div class="pill">▶ Play 스토어에서 「한끼」 검색</div>
<div class="end">오늘도 한 끼 해냈다면, 한끼에서 만나요</div></div>`,
}

const CHROMIUM = process.env.SMOKE_CHROMIUM
const br = await chromium.launch(CHROMIUM ? { executablePath: CHROMIUM } : {})
const p = await br.newPage({ viewport: { width: 1080, height: H }, deviceScaleFactor: 2 })
const names = []
for (const [n, f] of Object.entries(장들)) {
  await p.setContent(`<!doctype html><meta charset="utf-8">${f()}`)
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300)
  await p.screenshot({ path: `${OUT}/${n}.png` }); names.push(n); console.log('  ✅', n)
}
await br.close()
execFileSync('python3', ['-c', `from PIL import Image
names=${JSON.stringify(names)}
w=500; h=${Math.round(500 * H / 1080)}
sh=Image.new('RGB',(w*4+50,h*2+30),'white')
for i,n in enumerate(names):
  sh.paste(Image.open('${OUT}/'+n+'.png').resize((w,h)),(10+(i%4)*(w+10),10+(i//4)*(h+10)))
sh.save('${OUT}/캐러셀-검수판.png')`])
console.log(`\n📸 8장 ＋ 검수판 → ${OUT}`)
