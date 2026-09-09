// 🎑🎃 홈 명절 장식 — 창업자가 놓아보기 판에서 놓은 «그 자리»에 그린다.
// 📮 창업자 확정 2026-09-09. 자리·크기 = `src/data/seasonDecor.js` (⛔여기서 숫자를 만들지 않는다)
//
// ⛔⛔⛔ [2026-09-09 창업자 제보] *"홈을 내리면 안따라와 고정했자나"*
//    1판은 조각을 «통 안에» 놓아서 굴리면 위로 흘러가 버렸다. **창업자가 정한 것은 「화면 고정」이다**
//    (판의 단추 이름도 「📌 화면 고정」이고, 창업자가 *"다 고정값이야"* 라고 못 박았다).
//    ✅ 그래서 «화면에» 붙인다(position: fixed) — 굴려도 그 자리에 있다.
//    ⭐ 그러면 「위」에 놓은 것과 「아래」에 놓은 것이 «한 화면에 같이» 보인다.
//       창업자는 배경 두 장(맨 위·맨 아래) 위에 나눠 놓았지만, 고정이면 y 는 그냥 «화면 속 높이»다.
// ⛔ `.screen` 에 `position: relative` 를 «주지 않는다» — 여섯 화면이 같이 쓰는 클래스라
//    남의 화면에서 다른 것들의 기준이 통째로 바뀐다. fixed 는 그럴 일이 없다.
// ⚠️ 폰이 아니라 넓은 화면에선 앱이 «가운데 틀»에 들어간다 — 그래서 창(window)이 아니라
//    `.screen` 의 «화면 속 자리»를 재서 거기에 맞춘다(안 그러면 장식만 틀 밖으로 새어 나간다).
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { 홈장식 } from '../data/seasonDecor.js'
import { useSeasonCuts } from '../season/useSeasonCuts.js'

export default function SeasonDecor() {
  const { 철, 컷 } = useSeasonCuts()

  const [잰것, set잰것] = useState(null)

  useEffect(() => {
    if (!철 || !컷) return
    // ⛔⛔ [2026-09-09 창업자 제보] *"홈에 꼬르곰펭펭 저자리 아니야"* → 목표는 놓아보기 판 그대로다.
    //    🔎 판(`/tmp/장식판.html`)은 배경이 «창 전체 캡쳐»(540×960)였고 조각을 그 그림에 대고 놓았다.
    //       그런데 앱은 `.screen`(440px)에 대고 그렸다 → 조각이 «19% 작고» 자리도 밀렸다.
    //    ✅ 그래서 판과 «같은 자»를 쓴다 = 창(window). 폰에선 창 = 앱 폭이라 그대로 맞는다.
    const 재기 = () => set잰것({ 폭: innerWidth, 높이: innerHeight, 왼: 0, 위: 0 })
    재기()
    const ro = new ResizeObserver(재기)
    ro.observe(document.documentElement)
    window.addEventListener('resize', 재기)
    return () => { ro.disconnect(); window.removeEventListener('resize', 재기) }
  }, [철, 컷])

  if (!철 || !컷) return null
  const 조각들 = 홈장식[철] || []

  // ⛔⛔ [2026-09-09 두 번째 함정] `position: fixed` 인데도 «굴리면 따라 올라갔다».
  //    🔎 범인 = `.screen` 이 갖는 `.fade` = `animation: fadeUp .28s ease **both**`.
  //       `both` 는 끝난 뒤에도 마지막 칸(`transform: translateY(0)`)을 «계속 얹어 둔다» →
  //       transform 이 있는 상자는 `fixed` 의 «기준»이 되어 버린다(그 안에 갇힌다).
  //    ✅ 그래서 장식을 그 상자 «밖»(document.body)으로 내보낸다. 그러면 진짜로 화면에 붙는다.
  //    ⛔ `.fade` 쪽을 고치지 않는다 — 여섯 화면이 다 쓰는 것이라 남의 화면이 흔들린다.
  return createPortal(
    // ⛔ `pointer-events: none` — 장식이 단추 위에 앉아 누름을 먹으면 안 된다.
    <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 6 }}>
      {잰것 && 조각들.map((조각, i) => {
        const w = 조각.w * 잰것.폭
        // ⭐ y 는 «가운데»다(판이 translate(-50%,-50%) 로 놓았다) — 여기서도 가운데로 놓는다.
        const 위쪽 = 잰것.위 + 조각.y * 잰것.높이
        // ⛔⛔ 자리잡기와 «움직임»을 한 상자에 같이 두면 안 된다 — `hk-m-float` 같은 모션이
        //    `transform` 을 통째로 갈아끼워서 `translate(-50%,-50%)`(가운데맞춤)를 지워 버린다.
        //    ✅ 바깥 껍데기 = 자리·가운데맞춤·좌우뒤집기 / 안쪽 그림 = 모션. 서로 안 건드린다.
        return (
          <span
            key={i}
            style={{
              position: 'fixed',
              left: 잰것.왼 + 조각.x * 잰것.폭,
              top: 위쪽,
              width: w,
              opacity: 조각.o,
              transform: `translate(-50%, -50%)${조각.반전 ? ' scaleX(-1)' : ''}`,
              zIndex: 0,
            }}
          >
            <img
              src={컷[조각.id]}
              alt=""
              draggable={false}
              className={조각.모션}
              // ⛔ 못 받아도 «깨진 그림 아이콘»이 뜨면 안 된다 — 조용히 숨긴다.
              onError={(e) => { e.currentTarget.style.display = 'none' }}
              style={{ display: 'block', width: '100%' }}
            />
          </span>
        )
      })}
    </div>,
    document.body
  )
}
