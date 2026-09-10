// 🕘 레시피 목록이 «최신순»으로 서는가 — 📮창업자 2026-09-10 「최신 레시피가 제일 아래야」
//   ⛔ 옛 공식(Date.now() - i*60000)은 basics.js 뒤에 쌓은 새 편일수록 «더 옛날»로 찍었다.
import { seedRecipes, 열린때, 맨위고정 } from '../src/data/seed.js'
import { basicRecipes } from '../src/data/basics.js'

let 죽음 = 0
const 칸 = (참, 이름, 말 = '') => { console.log(`${참 ? '✅' : '❌'} ${이름}${말 ? ' · ' + 말 : ''}`); if (!참) 죽음++ }

// 화면이 세우는 그대로 (MyRecipesScreen.jsx = b.savedAt - a.savedAt)
const 세운것 = [...seedRecipes].sort((a, b) => b.savedAt - a.savedAt)

console.log('\n── ① 샘플이 «맨 위»에 고정돼 있다 (창업자 확정 2026-09-10) ──')
{
  칸(세운것[0].id === 맨위고정, '맨 위 = 고정한 샘플', `${세운것[0].title} (id ${세운것[0].id})`)
  칸(basicRecipes.some((r) => r.id === 맨위고정), '고정한 id 가 basics.js 에 «실제로» 있다 — 오타면 조용히 안 먹힌다')
}

console.log('\n── ①-2 그 «다음»부터는 최신순이다 ──')
{
  const 늦은날 = basicRecipes.filter((r) => r.from).map((r) => r.from).sort().pop()
  const 둘째 = 세운것.find((r) => r.id !== 맨위고정)
  칸(둘째.from === 늦은날, '고정석 빼면 맨 위 = 가장 최근에 열린 편', `${둘째.title}(${둘째.from}) · 가장 늦은 날짜 ${늦은날}`)
}

console.log('\n── ② 창업자가 본 그 증상이 «사라졌나» ──')
{
  const 콩 = 세운것.findIndex((r) => r.title === '콩국수') + 1
  const 꽃 = 세운것.findIndex((r) => r.title === '꽃게탕') + 1
  칸(꽃 < 콩, '꽃게탕(2026-09-07)이 콩국수(처음부터)보다 «위»', `꽃게탕 ${꽃}등 · 콩국수 ${콩}등`)
  console.log(`   📌 옛 공식이었으면 = 콩국수 1등 · 꽃게탕 60등 (창업자가 본 그것)`)
}

console.log('\n── ③ 줄이 «내림차순»으로 안 깨진다 ──')
{
  const 깨진곳 = 세운것.findIndex((r, i) => i > 0 && 세운것[i - 1].savedAt < r.savedAt)
  칸(깨진곳 === -1, '위에서 아래로 계속 옛날이 된다')
}

console.log('\n── ④ 같은 날 열린 것끼리도 «순서가 흔들리지 않는다» ──')
{
  const a = [...seedRecipes].sort((x, y) => y.savedAt - x.savedAt).map((r) => r.title).join('|')
  const b = [...seedRecipes].reverse().sort((x, y) => y.savedAt - x.savedAt).map((r) => r.title).join('|')
  칸(a === b, '들어온 차례가 달라도 결과가 같다')
}

console.log('\n── ⑤ from 이 «깨져도» 목록이 안 무너진다 (2차 사고) ──')
{
  const 값 = 열린때({ from: '엉터리' }, 3)
  칸(Number.isFinite(값), '깨진 날짜는 바닥으로 — NaN 이 안 샌다', `값 ${값}`)
  칸(값 < 열린때({ from: '2026-09-07' }, 0), '깨진 것은 진짜 날짜보다 아래')
}

console.log('\n── ⑥ from 없는 42편은 «바닥»에 모인다 ──')
{
  const from있는것 = 세운것.filter((r) => r.from).length
  const 위쪽 = 세운것.slice(0, from있는것).every((r) => r.from)
  칸(위쪽, 'from 있는 편이 전부 위에 있다', `from 있는 편 ${from있는것} · 없는 편 ${세운것.length - from있는것}`)
}

console.log('\n── ⑦ 맨 위 다섯 (창업자가 눈으로 볼 것) ──')
세운것.slice(0, 5).forEach((r, i) => console.log(`   ${i + 1}. ${r.title} (${r.from || '처음부터'})`))

console.log(죽음 ? `\n❌ ${죽음}칸 실패` : '\n✅ 전부 통과')
process.exit(죽음 ? 1 : 0)
