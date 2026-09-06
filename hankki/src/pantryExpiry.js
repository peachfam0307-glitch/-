// 🧊📣 냉장고 유통기한 — «홈 한 줄»이 세는 것 (창업자 2026-09-06 *"1번으로 하자 판 뽑아줘"*)
//
// 📮 창업자 = *"우리 앱 유통기한 알람도 가능해?"*
// ⭐ 세 갈래 중 ① = 앱을 «열었을 때» 홈에서 알려준다. 서버 없음 · 폰 알림 아님.
//    ② 폰 푸시(앱 꺼져도 울림)는 유통기한 데이터가 서버로 가야 해서 privacy.html·데이터 보안 신고가 같이 바뀐다 → 명의 이전 뒤 판정.
//    ③ 「정한 날짜에 폰이 알아서」 웹 표준(Notification Triggers)은 크롬이 개발 중단(공식 문서 «no longer pursued»).
//
// 잣대 = 냉장고 화면의 D-3 칩(`PantryView.jsx` expiryChip · exp-soon)과 «같은 3일». 두 화면이 다른 날을 말하면 안 된다.
//   · 지난 것도 센다 — 「2일 지남」인 재료가 냉장고에 그대로 있는 게 이 기능이 막으려는 일이다(기획-노트 3번).
//   · 유통기한 없는 재료(expiry null)는 안 센다.
//
// ⛔ 하루 한 번만 — 닫으면 «오늘» 은 다시 안 뜬다(내일 다시). 매번 뜨면 재촉이다(「늘 떠 있으면 아무도 안 본다」 원칙).
import { todayKST } from './today.js'

export const EXPIRY_SOON_DAYS = 3
const K_DISMISS = 'hankki:pantryExp:seen'

const read = (k) => { try { return localStorage.getItem(k) } catch { return null } }
const write = (k, v) => { try { localStorage.setItem(k, v) } catch { /* noop */ } }

// 🔢 오늘 0시 기준 남은 날 — `PantryView.daysLeft` 와 같은 셈. 음수 = 지났다.
export function expiryDaysLeft(expiry, now = new Date()) {
  if (!expiry) return null
  const today = new Date(now); today.setHours(0, 0, 0, 0)
  const d = new Date(expiry + 'T00:00:00'); d.setHours(0, 0, 0, 0)
  if (Number.isNaN(d.getTime())) return null
  return Math.round((d - today) / 86400000)
}

// 🧊 임박·지남 재료 — 급한 순(지난 것 먼저 · 그다음 D-0, D-1 …)
export function expiringPantry(pantry = [], now = new Date()) {
  return pantry
    .map((p) => ({ ...p, left: expiryDaysLeft(p.expiry, now) }))
    .filter((p) => p.left !== null && p.left <= EXPIRY_SOON_DAYS)
    .sort((a, b) => a.left - b.left)
}

// 📣 홈 한 줄 글 — `{ head, sub }` · 없으면 null
//    「내일 지나는 재료 2개 있어요」 / 「오늘까지인 재료 있어요」 / 「유통기한 지난 재료 1개 있어요」
//    부제 = 재료 이름 셋까지 (「우유 · 두부 · 대파 외 1개」)
export function pantryExpiryLine(pantry = [], now = new Date()) {
  const list = expiringPantry(pantry, now)
  if (!list.length) return null
  const over = list.filter((p) => p.left < 0)
  const first = list[0]
  const n = list.length
  let head
  if (over.length) head = `유통기한 지난 재료 ${over.length}개 있어요`
  else if (first.left === 0) head = n > 1 ? `오늘까지인 재료 ${list.filter((p) => p.left === 0).length}개 있어요` : '오늘까지인 재료 있어요'
  else if (first.left === 1) head = `내일 지나는 재료 ${list.filter((p) => p.left === 1).length}개 있어요`
  else head = `${first.left}일 안에 지나는 재료 ${n}개 있어요`
  const names = list.slice(0, 3).map((p) => p.name).join(' · ')
  const sub = n > 3 ? `${names} 외 ${n - 3}개` : names
  return { head, sub, count: n }
}

export const needsPantryExpiryRow = (pantry, now = new Date()) =>
  !!pantryExpiryLine(pantry, now) && read(K_DISMISS) !== todayKST(now)
export const dismissPantryExpiryRow = (now = new Date()) => write(K_DISMISS, todayKST(now))

// 홈 → 장보기 탭으로 보낼 때 「냉장고 쪽으로 열어줘」 — `ShopScreen` 이 첫 화면을 고를 때 읽는다(sessionStorage · 이미 쓰던 열쇠).
export const askOpenPantry = () => { try { sessionStorage.setItem('hankki:shopView', 'pantry') } catch { /* noop */ } }
