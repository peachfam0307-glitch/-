// 🎑🎃 홈 명절 장식 — 창업자가 놓아보기 판에서 놓은 «그 자리»에 그린다.
// 📮 창업자 확정 2026-09-09. 자리·크기 = `src/data/seasonDecor.js` (⛔여기서 숫자를 만들지 않는다)
//
// ⛔⛔ 자리를 «화면 높이»로만 잡으면 안 된다 — 창업자는 배경 «두 장»(맨 위·맨 아래) 위에 놓았다.
//    「아래」에 놓은 것은 «스크롤 통의 바닥»에서 그만큼 올라온 자리다. 폰마다·레시피 수마다
//    통 길이가 달라지므로 «잰다». 안 재고 화면 높이로만 두면 긴 홈에서 엉뚱한 데 뜬다.
// ⛔ `.screen` 에 `position: relative` 를 «주지 않는다» — 여섯 화면이 같이 쓰는 클래스라
//    남의 화면에서 다른 것들의 기준이 통째로 바뀐다. 대신 «높이 0인 담는 칸»을 기준으로 삼는다.
import { useEffect, useRef, useState } from 'react'
import { 홈장식 } from '../data/seasonDecor.js'
import { useSeasonCuts } from '../season/useSeasonCuts.js'

export default function SeasonDecor() {
  const { 철, 컷 } = useSeasonCuts()
  const 칸 = useRef(null)
  const [잰것, set잰것] = useState(null)

  useEffect(() => {
    if (!철 || !컷) return
    const 통 = 칸.current?.closest('.screen')
    if (!통) return
    const 재기 = () => set잰것({ 폭: 통.clientWidth, 높이: 통.clientHeight, 길이: 통.scrollHeight })
    재기()
    const ro = new ResizeObserver(재기)
    ro.observe(통)
    // 📌 목록이 늘면 통이 길어진다 — 통 «안쪽»도 본다.
    if (통.firstElementChild) ro.observe(통.firstElementChild)
    window.addEventListener('resize', 재기)
    return () => { ro.disconnect(); window.removeEventListener('resize', 재기) }
  }, [철, 컷])

  if (!철 || !컷) return <div ref={칸} style={{ height: 0 }} />
  const 조각들 = 홈장식[철] || []

  return (
    // ⛔ `pointer-events: none` — 장식이 단추 위에 앉아 누름을 먹으면 안 된다.
    <div ref={칸} aria-hidden style={{ position: 'relative', height: 0, pointerEvents: 'none' }}>
      {잰것 && 조각들.map((조각, i) => {
        const w = 조각.w * 잰것.폭
        const 위쪽 = 조각.화면 === '아래'
          ? 잰것.길이 - 잰것.높이 + 조각.y * 잰것.높이   // 바닥에서 재서 올라온 자리
          : 조각.y * 잰것.높이
        return (
          <img
            key={i}
            src={컷[조각.id]}
            alt=""
            draggable={false}
            className={조각.모션}
            // ⛔ 못 받아도 «깨진 그림 아이콘»이 뜨면 안 된다 — 조용히 숨긴다.
            onError={(e) => { e.currentTarget.style.display = 'none' }}
            style={{
              position: 'absolute',
              left: 조각.x * 잰것.폭 - w / 2,
              top: 위쪽,
              width: w,
              opacity: 조각.o,
              transform: 조각.반전 ? 'scaleX(-1)' : undefined,
              zIndex: 0,
            }}
          />
        )
      })}
    </div>
  )
}
