import Portal from './Portal'
import duoHi from '../assets/sharepool/duo_hi.png'

// 🧺🧺 「AI가 다듬는 중」 창 — ⭐**끝날 때까지 화면에 «남아 있는다».**
//
// 📮 창업자 2026-09-08 = *"끝날때까지는 창을 띄워주던가 해야할 듯."*
//    ＋ 그 앞 = *"ai다듬기 화면이 나오고 ai가 끝날때까지는 화면이 떠있어야 하는데 **사라지고
//       오래걸리니까 뒤로가기하거나 앱을 나가거나 할수있을 것 같아**"*
//
// ⛔⛔ **그 전엔 토스트뿐이었다** — 6초 뒤 사라진다. 그런데 AI 는 20~60초 걸린다.
//    → 유저는 **아무 일도 안 일어나는 화면**을 30초 넘게 본다. 그게 「먹통」으로 읽힌다.
//    📌 실제로 창업자가 그 자리에서 뒤로가기를 눌렀고, 그래서 결과를 잃었다.
//
// ⭐ 그래서 이 창이 하는 일은 «막는 것»이 아니라 **「지금 무슨 일이 벌어지는지 계속 말해주는 것」**이다.
//    ⛔ 그래서 **닫는 단추를 둔다** — 갇히면 그게 더 나쁘다.
//       ⭐ 닫아도 «일은 계속된다»(워커가 맡아서 하고, 다 되면 레시피에 저절로 올라간다).
//          그 사실을 글자로 말해 준다 — 안 말하면 닫는 것이 «취소»로 읽힌다.
//
// 📍📍 **[창업자 확정 2026-09-08 10:5x = ⓐ] 이 창은 «두 자리»에만 뜬다. ⛔재론 금지**
//   ✅ 뜨는 곳 = ①임시보관함 「AI로 다듬기」 ②레시피 상세 「다시 하기」
//      → 둘 다 **유저가 «일부러 기다리려고» 누른 자리**다. 그래서 창이 맞다.
//   ⛔ 안 뜨는 곳 = **처음 담을 때**(가져오기·편집기). 창업자 물음 = *"그 애들안내는 레시피마다 뜨는거지?"*
//      → **일부러 안 띄운다.** 그 길은 규칙 파서 결과를 «먼저» 보여주고 AI 는 뒤에서 돈다
//         (App.jsx:794 · EditorScreen.jsx:568 = await 로 앞을 막지 않는다).
//         기다릴 필요가 없는데 창을 띄우면 **안 가둬도 될 사람을 20~60초 가두는 것**이 된다.
//   ⭐ 갈래 셋을 폈고(ⓐ지금대로 · ⓑ처음에도 창 · ⓒ레시피 안 한 줄) 창업자가 **ⓐ**를 골랐다.
//
// ⛔ 유니코드 이모지 금지 — 첫 화면과 같은 곰펭 그림(절대원칙).
export default function TidyWaiting({ onClose }) {
  return (
    <Portal>
      <div className="sheet-mask">
        <div
          className="sheet"
          onClick={(e) => e.stopPropagation()}
          style={{ paddingBottom: 'calc(18px + var(--safe-bottom))' }}
        >
          <div style={{ padding: '6px 22px 0', textAlign: 'center', fontFamily: "'Jua', sans-serif" }}>
            <img src={duoHi} alt="" aria-hidden draggable={false} style={{ width: 132, maxWidth: '42%', display: 'block', margin: '0 auto' }} />
            <div style={{ fontSize: 22, fontWeight: 400, lineHeight: 1.35, marginTop: 10 }}>
              AI가 레시피를 다듬고 있어요
            </div>
            {/* ⭐ 창업자가 콕 집은 두 마디 = 「언제 되나」 ＋ 「다 되면 어떻게 되나」 */}
            <div className="t-sub" style={{ fontSize: 16, lineHeight: 1.7, marginTop: 12 }}>
              보통 20~60초 걸려요
              <br />다 되면 <span style={{ color: 'var(--brown)' }}>레시피에 저절로 올라가요</span>
            </div>
            <div className="t-sub" style={{ fontSize: 14, lineHeight: 1.6, marginTop: 10 }}>
              앱을 닫아도 계속 다듬어요
            </div>
          </div>
          <div style={{ padding: '18px 18px 0' }}>
            <button
              className="press" onClick={onClose}
              style={{ width: '100%', color: 'var(--text-sub)', fontSize: 16.5, fontWeight: 400, padding: '8px 0', fontFamily: "'Jua', sans-serif" }}
            >
              닫고 다른 일 하기
            </button>
          </div>
        </div>
      </div>
    </Portal>
  )
}
