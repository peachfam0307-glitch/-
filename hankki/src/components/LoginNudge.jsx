import { useState } from 'react'
import Portal from './Portal'
import GoogleButton from './GoogleButton'
import { useModalBack } from '../useBackHandler'
import { 로그인 } from '../cloud'
import { 무료열쇠상한, KEY_NAME, KEY_UNIT } from '../ocr'
import duoHi from '../assets/sharepool/duo_hi.png'

// ☁️📣 로그인 안내 팝업 — «이미 쓰고 있던 사람»에게 딱 한 번.
//
// 📮 창업자 2026-09-06 = *"그럼 로그인 안내부터 하자 ㄱㄱ"* → *"안내 팝업이 낫지않을까??"*
//    → *"근데 로그인안하면 사라지는거 맞지 않아??"* · *"로그인을 해야 남는거잖아."* → 문구 확정(아래 그대로)
//
// ⭐⭐ 왜 있나 = 9/4 실물 = 월간 활성 27 · 로그인 6(실제 4). **23명이 로그인 없이 쓴다.**
//    9/5 창업자 정정 = 로그인은 «두 대 쓰는 사람 기능»이 아니라 **「데이터를 지키는」 기능**이다
//    (이유 셋 = 날아가는 것 막기 · 열쇠 10→30 · 동기화). 그런데 화면 셋(첫 화면·홈 한 줄·설정 카드)이
//    **전부 「새 폰에서도 이어서 써요」 하나만** 말하고 있었다. 안 하는 게 당연했다.
//    ＋ 홈 한 줄은 «닫으면 영영 안 뜬다»(nudges.js K_CLOUDHOME) — 쓰던 사람 대부분은 이미 닫았다.
//
// ⛔ 리텐션 원칙(재촉 금지)을 지키는 선
//    · **한 번만** — 어떻게 닫아도 «봤음»(뒤로가기 포함 · NewsPopup 과 같은 방식)
//    · **잃을 게 있는 사람만** — 로그인 안 함 ＋ 내 레시피 1편 이상(갓 깐 사람은 안 본다 · 백업 줄과 같은 잣대)
//    · **다른 팝업과 안 겹친다** — 소식 팝업·온보딩·코치마크가 뜨는 날은 다음에(HomeScreen 에서 가른다)
//    · 「사라져요」는 겁주기가 아니라 **사실**이다(창업자 *"로그인을 해야 남는거잖아"*) — 사실 ＋ 다음 행동.
//
// ⛔ 숫자를 «글자로» 박지 않는다 — 열쇠 상한은 `무료열쇠상한()`(서버 값 우선) · 편수는 홈이 세서 준다.
// ⛔ 유니코드 이모지 금지 — 첫 화면과 같은 곰펭 그림(`duo_hi.png`)을 쓴다.
// 🔒 `_repro-로그인안내팝업-0906.mjs` 가 「뜨는 조건 · 한 번만 · 문구」를 잰다.

const KEY = 'hankki:nudge:loginpop' // '1' = 봤음(로그인·나중에·뒤로가기 전부)

/** 아직 안 봤나? — ⛔ 저장소를 못 읽는 폰이면 «봤음»으로 친다(매번 뜨는 게 더 나쁘다) */
export const needsLoginNudge = () => { try { return localStorage.getItem(KEY) !== '1' } catch { return false } }
export const markLoginNudgeSeen = () => { try { localStorage.setItem(KEY, '1') } catch { /* 저장 못 해도 화면은 돈다 */ } }

function 고운말(e) {
  const c = (e && e.code) || ''
  if (c.includes('popup-blocked')) return '로그인 창이 막혔어요. 다시 눌러 주세요.'
  if (c.includes('popup-closed') || c.includes('cancelled-popup')) return '로그인 창을 닫으셨어요.'
  if (c.includes('network')) return '인터넷이 불안해요. 잠시 뒤에 다시 눌러 주세요.'
  return '잘 안 됐어요. 「나중에 하기」로 넘어가도 돼요.'
}

/**
 * @param {{ count: number, onLater: () => void, onLoggedIn: () => void }} p
 *   count      = 내 레시피 편수(홈이 `myRecipeCount` 로 센 값)
 *   onLater    = 「나중에 하기」·뒤로가기 — 부모가 «봤음» 표시 ＋ 닫는다
 *   onLoggedIn = 로그인 성공 — 부모가 «봤음» 표시 ＋ 설정의 클라우드 시트로 보낸다(올리기·가져오기는 거기 몫)
 */
export default function LoginNudge({ count, onLater, onLoggedIn }) {
  useModalBack(onLater)
  const [바쁨, set바쁨] = useState(false)
  const [탈, set탈] = useState('')
  const { 비로그인, 로그인: 로그인상한 } = 무료열쇠상한()

  const 눌러로그인 = async () => {
    set탈(''); set바쁨(true)
    try {
      await 로그인()
      onLoggedIn()
    } catch (e) {
      // ⛔ 실패해도 시트를 닫지 않는다 — 닫으면 «봤음»이 되어 다시는 못 권한다. 나가는 길은 「나중에 하기」뿐.
      set탈(고운말(e)); set바쁨(false)
    }
  }

  // 📏 줄간격 — 창업자 *"줄간격 신경써서 해줘"*.
  //    제목 1.35 · 본문 1.7 · 이유 세 줄은 «한 줄에 한 문장»이라 줄 사이를 8px 로 띄운다(붙으면 한 문단으로 읽힌다).
  return (
    <Portal>
      <div className="sheet-mask" onClick={onLater}>
        <div
          className="sheet"
          onClick={(e) => e.stopPropagation()}
          style={{ paddingBottom: 'calc(18px + var(--safe-bottom))', maxHeight: 'calc(100dvh - 40px)' }}
        >
          <div style={{ padding: '6px 22px 0', textAlign: 'center' }}>
            <img src={duoHi} alt="" aria-hidden draggable={false} style={{ width: 150, maxWidth: '48%', display: 'block', margin: '0 auto' }} />

            <div style={{ fontSize: 21, fontWeight: 900, lineHeight: 1.35, letterSpacing: '-0.02em', marginTop: 10, textWrap: 'balance' }}>
              앱을 지우거나 폰을 바꾸면
              <br />레시피 <span style={{ color: 'var(--brown)' }}>{count}편</span>이 사라져요
            </div>

            <div className="t-sub" style={{ fontSize: 15, lineHeight: 1.7, marginTop: 14 }}>
              구글로 로그인하면 —
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8, textAlign: 'left', margin: '8px auto 0', maxWidth: 300 }}>
              {[
                '폰을 바꿔도, 앱을 다시 깔아도 그대로 남아요',
                `무료 ${KEY_NAME}가 ${비로그인}${KEY_UNIT} → ${로그인상한}${KEY_UNIT}로 늘어요`,
                '패드에서도 이어서 써요',
              ].map((줄) => (
                <div key={줄} style={{ display: 'flex', gap: 8, fontSize: 15, lineHeight: 1.55 }}>
                  <span style={{ color: 'var(--brown)', flex: '0 0 auto' }}>·</span>
                  <span>{줄}</span>
                </div>
              ))}
            </div>

            {탈 && <div style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--brown)', marginTop: 14 }}>{탈}</div>}
          </div>

          <div style={{ padding: '18px 18px 0' }}>
            <GoogleButton label="구글로 로그인" busy={바쁨} onClick={눌러로그인} />
            <button
              className="press" onClick={onLater} disabled={바쁨}
              style={{ width: '100%', marginTop: 10, color: 'var(--text-sub)', fontSize: 15.5, fontWeight: 600, padding: '8px 0' }}
            >
              나중에 하기
            </button>
          </div>
        </div>
      </div>
    </Portal>
  )
}
