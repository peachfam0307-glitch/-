// 🧊 냉털 줄 세우기 재현판 — 📮창업자 2026-09-10 「임박하는게 1순위 그다음 할게 많은 레시피가 2순위로 하자」
//   ＋ 실제 사례 = *"오늘 만난친구가 애호박이랑 자투리재료가 있는데 추천레시피 있으면 좋겠다"*
import { pantryScore, rankPantryRecipes, pantryRank } from '../src/pantryMatch.js'
import { allBasicRecipes } from '../src/data/basics.js'

let 죽음 = 0
const 칸 = (참, 이름, 말 = '') => { console.log(`${참 ? '✅' : '❌'} ${이름}${말 ? ' · ' + 말 : ''}`); if (!참) 죽음++ }

const 오늘 = new Date(); 오늘.setHours(0,0,0,0)
const 날 = (n) => n === null ? null : new Date(오늘.getTime() + n*86400000).toISOString().slice(0,10)
const 칸만들기 = (name, d) => ({ name, expiry: 날(d) })
const 남은날 = (p) => { if (!p?.expiry) return null
  const d = new Date(p.expiry + 'T00:00:00'); d.setHours(0,0,0,0); return Math.round((d - 오늘)/86400000) }

const 세우기 = (냉장고) => rankPantryRecipes(allBasicRecipes, 냉장고, 남은날)

const 옛세우기 = (냉장고) => allBasicRecipes
  .map((r) => ({ r, s: pantryScore(r, 냉장고, 남은날), ...pantryRank(r, 냉장고, 남은날) }))
  .filter((m) => m.n > 0).sort((a, b) => b.s - a.s)

console.log('\n── ① 급한 게 있으면 «무조건» 위 ──')
{
  const 냉장고 = [칸만들기('두부', 2), 칸만들기('계란', 40), 칸만들기('대파', 30), 칸만들기('양파', 30), 칸만들기('감자', 40)]
  const 새 = 세우기(냉장고)
  칸(새[0].급함 > 0, '맨 위가 급한 재료를 쓴다', `${새[0].r.title} · 급함 ${새[0].급함} · 가진 ${새[0].n}개`)
  const 첫0 = 새.findIndex((m) => m.급함 === 0)
  칸(첫0 === -1 || 새.slice(0, 첫0).every((m) => m.급함 > 0), '급한 것들이 «위에 몰려» 있다', `급한 것 ${첫0 === -1 ? 새.length : 첫0}장`)
  const 옛 = 옛세우기(냉장고)
  console.log(`   📌 옛 판 맨 위 = ${옛[0].r.title} (급함 ${옛[0].급함} · 가진 ${옛[0].n})`)
  console.log(`   📌 새 판 맨 위 = ${새[0].r.title} (급함 ${새[0].급함} · 가진 ${새[0].n})`)
}

console.log('\n── ② 급한 것들끼리는 «개수»가 가른다 (8/10 사고 방지) ──')
{
  const 냉장고 = [칸만들기('두부', 2), 칸만들기('김치', 2), 칸만들기('돼지고기', 2), 칸만들기('대파', 1)]
  const 새 = 세우기(냉장고)
  const 급한것 = 새.filter((m) => m.급함 > 0)
  const 내림차 = 급한것.every((m, i) => i === 0 || 급한것[i-1].급함 > m.급함 || (급한것[i-1].급함 === m.급함 && 급한것[i-1].n >= m.n))
  칸(내림차, '급함이 같으면 가진 개수가 많은 쪽이 위', `맨 위 ${급한것[0].r.title} 급함 ${급한것[0].급함}·가진 ${급한것[0].n}`)
}

console.log('\n── ③ 🥒 냉털 = 유통기한이 «하나도 없을» 때 (창업자 친구 사례) ──')
{
  const 냉장고 = [칸만들기('애호박', null), 칸만들기('양파', null), 칸만들기('계란', null), 칸만들기('대파', null)]
  const 새 = 세우기(냉장고)
  칸(새.length > 0, '추천이 나온다', `${새.length}편`)
  칸(새.every((m) => m.급함 === 0), '급한 건 하나도 없다(유통기한을 안 적었으니 당연)')
  const 개수순 = 새.every((m, i) => i === 0 || 새[i-1].n >= m.n)
  칸(개수순, '그럼 «가진 재료 많은 순»으로 선다 ← 창업자가 원한 그것', 새.slice(0,3).map((m) => `${m.r.title}(${m.n}개)`).join(' · '))
}

console.log('\n── ④ 냉장고가 비면 추천 0 ──')
칸(세우기([]).length === 0, '빈 냉장고는 추천 없음')

console.log('\n── ⑤ 줄 세우기가 «흔들리지 않는다» (같은 값이면 늘 같은 순서) ──')
{
  const 냉장고 = [칸만들기('양파', null), 칸만들기('계란', null)]
  const a = 세우기(냉장고).map((m) => m.r.title).join('|')
  const b = rankPantryRecipes([...allBasicRecipes].reverse(), 냉장고, 남은날).map((m) => m.r.title).join('|')
  칸(a === b, '들어온 차례가 달라도 결과가 같다')
}

console.log(죽음 ? `\n❌ ${죽음}칸 실패` : '\n✅ 전부 통과')
process.exit(죽음 ? 1 : 0)
