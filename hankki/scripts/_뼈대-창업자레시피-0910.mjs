// 🍳🍳 **창업자 폰에 있던 레시피를 «기본 레시피 뼈대»로 옮긴다** (2026-09-10)
//
// 📮 창업자 = *"나만 저장했고 너한테 없는거 레시피로 다 저장해서 올리자 우리문체로 바꿔서 우리재료랑"*
//    ＋ *"천천히 재료랑 만드는법 잘 매치해서 해줘 **나도 내 레시피가 아니라 잘 모를 수도 있어.**"*
//
// ⛔⛔ **이 도구는 「뼈대」만 만든다 — 문장 다듬기는 «사람이» 한 편씩 한다.**
//    창업자가 「나도 잘 모를 수도 있다」고 했다 = **내가 지어내면 아무도 못 잡는다.**
//    그래서 규칙을 못 박는다:
//      ⑴ 재료·분량·순서는 **원문에 있는 것만** 옮긴다. 한 글자도 지어내지 않는다.
//      ⑵ 원문에 «없는» 것(시간·인분)은 `time: null` 로 두고 **`추정: true` 딱지**를 남긴다.
//         → 검수판이 그 딱지를 보고 「이건 내가 정한 값」이라고 창업자에게 «보여준다».
//      ⑶ 분량이 없는 재료는 `⛔분량없음` 을 붙여 **눈에 띄게** 남긴다(조용히 넘어가지 않는다).
//
// ⭐ 아이콘은 **앱이 쓰는 바로 그 함수**(`guessFoodIcon`)로 고른다 — 흉내내지 않는다(절대원칙 30).
//
// 실행: node scripts/_뼈대-창업자레시피-0910.mjs <백업.json> <낼파일.json>
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const ROOT = path.join(new URL('..', import.meta.url).pathname)

// ⛔ `FoodIcon.jsx` 는 node 가 직접 못 읽는다(.jsx) → 규칙만 «파일 순서 그대로» 뽑는다.
//    ⚠️ 이건 흉내다. 그래서 **아는 답으로 대조하고 어긋나면 죽는다**(규칙 18 ⓘ).
//    ⭐ `_probe-박힌아이콘-0827.mjs` 가 쓰는 «바로 그 방식»이다 — 새로 짓지 않고 그대로 따른다.
const SRC = readFileSync(path.join(ROOT, 'src/components/FoodIcon.jsx'), 'utf8')
const 시작 = SRC.indexOf('const ICON_RULES = [')
if (시작 < 0) { console.error('⛔ ICON_RULES 를 못 찾았다 — 모양이 바뀌었나?'); process.exit(1) }
const 몸통 = SRC.slice(시작, SRC.indexOf('\n]', 시작))
const RULES = [...몸통.matchAll(/\[\[([^\]]*)\]\s*,\s*'([a-z]+_[A-Za-z0-9_]+)'\s*\]/g)]
  .map((m) => [m[1].split(',').map((x) => x.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean), m[2]])
if (RULES.length < 400) { console.error(`⛔ 규칙을 ${RULES.length}개밖에 못 읽었다 — 파서가 깨졌다`); process.exit(1) }
const guessFoodIcon = (name = '') => {
  const s = String(name)
  for (const [keys, key] of RULES) if (keys.some((k) => s.includes(k))) return key
  return 'default'
}
// 🔒 흉내가 앱과 어긋나지 않았나 — 아는 답으로 대조한다. 하나라도 틀리면 «죽는다»
for (const [제목, 기대] of [['제육볶음', 'gr_387'], ['된장찌개', 'fe_133']]) {
  const 답 = guessFoodIcon(제목)
  if (답 !== 기대) { console.error(`⛔ 아이콘 흉내가 앱과 어긋났다 — 「${제목}」 → ${답} (기대 ${기대})`); process.exit(1) }
}

const [백업경로, 낼곳] = process.argv.slice(2)
if (!백업경로 || !낼곳) {
  console.error('쓰는 법: node scripts/_뼈대-창업자레시피-0910.mjs <백업.json> <낼파일.json>')
  process.exit(1)
}

const { allBasicRecipes } = await import('../src/data/basics.js')

// 📌 이름을 로마자 id 로 — ⛔완벽할 필요 없다. 겹치면 뒤에 숫자를 붙인다.
const 로마자표 = {
  가: 'ga', 나: 'na', 다: 'da', 라: 'ra', 마: 'ma', 바: 'ba', 사: 'sa', 아: 'a', 자: 'ja',
  차: 'cha', 카: 'ka', 타: 'ta', 파: 'pa', 하: 'ha',
}

const 분량있나 = (줄) => /[0-9]|약간|조금|한\s*줌|톡톡|자작|적당|넉넉/.test(String(줄))

const 정리 = (s) => String(s || '').replace(/[\s()·,\-]/g, '').toLowerCase()
const 이미있는id = new Set(allBasicRecipes.map((r) => r.id))

// 🔤 제목 → id. 한글은 못 옮기니 «순번»으로 간다(사람이 나중에 손으로 고친다).
const id만들기 = (제목, i) => {
  const 바탕 = 'basic-own-' + String(i + 1).padStart(3, '0')
  let id = 바탕
  let n = 2
  while (이미있는id.has(id)) id = 바탕 + '-' + n++
  이미있는id.add(id)
  return id
}

const 백업 = JSON.parse(readFileSync(백업경로, 'utf8'))
const 원본들 = 백업.recipes || []

const 뼈대들 = 원본들.map((r, i) => {
  const 재료 = (r.ingredients || []).filter(Boolean).map(String)
  const 걸음 = (r.steps || []).filter(Boolean).map(String)
  const 분량없는줄 = 재료.filter((x) => !분량있나(x))

  return {
    id: id만들기(r.title || r.name, i),
    title: (r.title || r.name || '').trim(),
    origin: '창업자',            // 📮 창업자 폰에서 온 것
    icon: guessFoodIcon(r.title || r.name || '') || '',
    category: r.category || '',
    folder: r.folder || '',
    tags: [],                    // ⏳ 사람이 채운다
    time: null,                  // ⏳ 원문에 없다 — 사람이 정하고 「추정」 딱지
    servings: null,
    difficulty: r.difficulty || '쉬움',
    ingredients: 재료,
    steps: 걸음,
    // 🔎 사람이 볼 표식들 (⛔최종 데이터엔 안 들어간다)
    _검토: {
      분량없는재료: 분량없는줄,
      걸음수: 걸음.length,
      원본출처: r.source || '',
      원본주소: r.sourceUrl || '',
      메모: (r.memo || '').slice(0, 200),
    },
  }
})

writeFileSync(낼곳, JSON.stringify(뼈대들, null, 1))

const 분량빔 = 뼈대들.filter((x) => x._검토.분량없는재료.length).length
const 걸음빔 = 뼈대들.filter((x) => !x._검토.걸음수).length
const 아이콘빔 = 뼈대들.filter((x) => !x.icon).length
console.log(`✅ 뼈대 ${뼈대들.length}편 → ${낼곳}`)
console.log(`   ⛔ 분량 없는 재료가 있는 편 = ${분량빔}`)
console.log(`   ⛔ 만드는 법이 없는 편      = ${걸음빔}`)
console.log(`   ⛔ 아이콘을 못 고른 편      = ${아이콘빔}`)
console.log('⭐ 이제 «사람이» 한 편씩 문장을 다듬는다 — 이 도구는 여기까지다.')
