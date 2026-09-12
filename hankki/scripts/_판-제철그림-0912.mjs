import { chromium } from 'playwright'
import { readFileSync } from 'node:fs'
const R = '/home/user/hankki/hankki'
const 그림 = (k) => 'data:image/png;base64,' + readFileSync(`${R}/src/assets/stickers/ing/${k}.png`).toString('base64')
const 폰트 = readFileSync(`${R}/src/assets/fonts/gowun-dodum-korean-400.woff2`).toString('base64')
const 판들 = [
  ['04-지난', '8·9월 제철 레시피는', [['오징어','ig_s9_16'],['깻잎','ig_s2_08'],['토마토','ig_s7_04'],['햅쌀','ig_s11_08'],['꽃게','ig_s9_13']]],
  ['05-앞으로', '9·10월엔', [['가지','ig_s2_02'],['버섯','ig_s3_12'],['고구마','ig_s8_13'],['대하','ig_s6_07'],['고등어','ig_s6_01']]],
]
const b = await chromium.launch(process.env.SMOKE_CHROMIUM ? { executablePath: process.env.SMOKE_CHROMIUM } : {})
const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 })
for (const [이름, 큰, 것들] of 판들) {
  await p.setContent(`<!doctype html><meta charset=utf-8><style>
@font-face{font-family:'GD';src:url(data:font/woff2;base64,${폰트}) format('woff2')}
html,body{margin:0;width:1080px;height:1920px;background:#FFFDF7;font-family:GD,sans-serif}
.band{position:absolute;left:0;right:0;top:238px;height:360px;display:flex;align-items:center;justify-content:center}
.big{font-size:76px;font-weight:700;color:#fff;background:#5d3410;padding:30px 60px;border-radius:999px;
     letter-spacing:-.03em;white-space:nowrap;box-shadow:0 14px 40px rgba(93,52,16,.34)}
.grid{position:absolute;left:70px;right:70px;top:680px;display:flex;flex-wrap:wrap;justify-content:center;gap:34px 26px}
.it{display:flex;flex-direction:column;align-items:center;gap:14px;width:280px}
.it img{width:220px;height:220px;object-fit:contain}
.it span{font-size:50px;font-weight:700;color:#fff;background:#7a4a1e;padding:12px 30px;border-radius:999px;
     box-shadow:0 8px 22px rgba(93,52,16,.24)}
</style>
<div class=band><div class=big>${큰}</div></div>
<div class=grid>${것들.map(([n,k])=>`<div class=it><img src="${그림(k)}"><span>${n}</span></div>`).join('')}</div>`)
  await p.waitForTimeout(400)
  await p.screenshot({ path: `/tmp/장면/${이름.slice(0,2)}.jpg`, type: 'jpeg', quality: 92 })
  console.log('✍️', 이름, 것들.map(x=>x[0]).join(' '))
}
await b.close()
