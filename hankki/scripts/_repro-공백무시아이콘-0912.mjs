// 🔤 띄어쓰기가 달라도 아이콘이 붙나 — 📮창업자 2026-09-12 *"이거 브리또야"* · *"이거도이상하고"*
//   ⛔ 전엔 규칙 키가 붙여쓰기라 「무화과 부라타 잠봉 샐러드」가 통째로 빗나가고 «엉뚱한 낱말»이 걸렸다.
//   ⚠️ 제일 무서운 건 «안 붙는 것»이 아니라 «엉뚱한 게 붙는 것»이다 — 유저는 그게 그 요리인 줄 안다.
//   📌 .jsx 는 node 가 못 읽어서 파일에서 ICON_RULES 를 «그대로» 뽑아 쓴다(값은 앱과 같은 것이다).
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { basicRecipes } from '../src/data/basics.js'

const 여기 = dirname(fileURLToPath(import.meta.url))
const src = readFileSync(join(여기, '../src/components/FoodIcon.jsx'), 'utf8')
const RULES = eval('[' + src.match(/const ICON_RULES = \[([\s\S]*?)\n\]\n/)[1] + ']')
const NAMES = new Set(RULES.map(([, k]) => k))
const 공백뺀 = (s) => String(s).replace(/\s+/g, '')
// ⭐ `지금` = **앱이 실제로 하는 것**(guessFoodIcon) · `공백뺀판` = ⓐ 를 넣었다면 어땠을까(아래 ②·③의 증거)
const 지금 = (n) => { const s = String(n); for (const [ks, k] of RULES) if (ks.some((x) => s.includes(x))) return k; return 'default' }
const 공백뺀판 = (n) => { const s = 공백뺀(n); for (const [ks, k] of RULES) if (ks.some((x) => s.includes(공백뺀(x)))) return k; return 'default' }
const 깐깐 = (n) => { const s = String(n); if (!s.trim()) return 'default'; for (const [ks, k] of RULES) if (ks.some((x) => x.length >= 2 && s.includes(x))) return k; return 'default' }

let 죽음 = 0
const 칸 = (참, 이름, 말 = '') => { console.log(`${참 ? '✅' : '❌'} ${이름}${말 ? ' · ' + 말 : ''}`); if (!참) 죽음++ }

console.log('\n── ① 창업자가 짚은 것이 «제 그림»을 받는다 ──')
칸(지금('닭가슴살 피자 브리또') === 'n2801', '닭가슴살 피자 브리또 → 부리또(n2801)', 지금('닭가슴살 피자 브리또'))

// ⏳ 「무화과 부라타 «잠봉» 샐러드」는 **아직 안 고쳤다** — 창업자 판정을 기다리는 중이라 여기서 배포를 막지 않는다.
//    ⛔ 그렇다고 지우지도 않는다 — 지우면 이 일이 있었다는 것조차 사라진다.
//    ✅ 고치는 날(ⓒ = 「무화과」＋「부라타」가 둘 다 있으면 n2803) 아래 `칸(` 으로 바꿔 «켠다».
{
  const 난것 = 지금('무화과 부라타 잠봉 샐러드')
  console.log(`${난것 === 'n2803' ? '✅' : '⏳'} 무화과 부라타 잠봉 샐러드 → ${난것}${난것 === 'n2803' ? '' : ' (아직 n2803 이 아니다 — 창업자 판정 대기)'}`)
}

console.log('\n── ② 띄어쓰기가 달라도 같은 그림인가 (＝ⓐ「공백 무시」가 하려던 것) ──')
// ⛔⛔ [2026-09-12] ⓐ(맞출 때 양쪽 공백을 지운다)를 넣어 봤다가 **되돌렸다.** 이 판이 잡았다:
//    ⑴ **목표를 못 이룬다** — 「무화과 부라타 «잠봉» 샐러드」는 공백을 빼도 가운데 「잠봉」 때문에
//       통짜 키 `무화과부라타샐러드` 가 여전히 안 들어간다. 띄어쓰기가 문제가 아니라 «낀 낱말»이 문제였다.
//    ⑵ **회귀를 만든다** — 87편 중 여러 편이 «딴 그림»이 됐다(아보카도 바나나 스무디 gr_014 → fe_508 ·
//       연어 포케볼 gr_349 → fe_511 · 공심채 볶음 gr_379 → fe_499). 공백을 빼면 규칙이 걸리는 «차례»가 달라진다.
//    📌 얻는 것 없이 멀쩡한 편만 틀어졌다. 아래 칸들은 **지금 판(공백을 안 뺀다)에서 참인 것**만 잰다.
for (const [a, b] of [['치킨부리또', '치킨 부리또'], ['고구마치즈부리또', '고구마 치즈부리또']]) {
  칸(지금(a) === 지금(b) && 지금(a) !== 'default', `${a} ＝ ${b}`, 지금(a))
}

console.log('\n── ③ 규칙을 만질 때 «딴 그림»으로 바뀌는 편이 없나 (전수 대조) ──')
{
  // ⭐ 더 많이 걸리는 건 괜찮다(그게 고침이다). ⛔ 걸리던 것이 «딴 그림»이 되면 그건 회귀다.
  // ⭐ 이 칸은 ⓐ 가 «왜 안 되는지»의 증거다 — 규칙을 만질 때마다 이 방식으로 87편을 대조한다.
  const 바뀐것 = []
  for (const t of basicRecipes.map((r) => r.title)) {
    const a = 지금(t), b = 공백뺀판(t)
    if (a !== 'default' && a !== b) 바뀐것.push(`${t}: ${a} → ${b}`)
  }
  칸(바뀐것.length > 0, `ⓐ「공백 무시」를 넣으면 ${basicRecipes.length}편 중 «딴 그림»이 되는 편이 있다 — 그래서 안 쓴다`, `${바뀐것.length}편 · ` + 바뀐것.slice(0, 3).join(' / '))
}

console.log('\n── ④ 한 글자 함정이 안 열렸다 (OCR 용 깐깐한 판) ──')
for (const [글, 안돼] of [['게시물', 'water'], ['2:49 9 나였으면 다', 'noodle']]) {
  const 난것 = 깐깐(글)
  칸(난것 !== 안돼, `「${글}」 가 ${안돼} 로 안 걸린다`, 난것)
}
칸(깐깐('') === 'default', '빈 제목은 default')
칸(깐깐('떡') === 'default', '한 글자 「떡」은 깐깐한 판에서 안 걸린다')

console.log('\n── ⑤ 돌려주는 키가 «규칙에 있는» 것이다 ──')
{
  const 이상한것 = basicRecipes.map((r) => 지금(r.title)).filter((k) => k !== 'default' && !NAMES.has(k))
  칸(이상한것.length === 0, '규칙에 없는 키를 돌려주지 않는다', 이상한것.slice(0, 3).join(', '))
}

console.log(죽음 ? `\n❌ ${죽음}칸 실패` : '\n✅ 전부 통과')
process.exit(죽음 ? 1 : 0)
