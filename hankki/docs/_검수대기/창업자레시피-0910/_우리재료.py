# -*- coding: utf-8 -*-
# 🥄 창업자 판정(2026-09-10)을 «규칙»으로 세워 15편 전체에 민다 — "무조건 다 우리재료로 가야지"
# ⛔ 분량은 «창업자가 준 것»만 바꾼다. 안 준 것은 원래 분량 그대로 두고 ⚠️표를 남긴다.
#    근거 = 6번에서 참치액 2큰술 → 초피 «3»큰술로 «늘렸다». 1:1이 아니다 → 내가 정하면 안 된다.
import json, os, re
P = os.path.dirname(os.path.abspath(__file__))
편들 = json.load(open(os.path.join(P, 'A-다듬음.json')))

def 바꿔(s, a, b):
    """⛔ 조용히 실패하는 치환을 안 쓴다 — 쪼개서 붙인다(못 찾으면 원문 그대로 돌아온다)."""
    return b.join(s.split(a))

# 이름 갈이 — 긴 것부터(까나리액젓이 액젓보다 먼저 걸려야 한다)
갈이 = [('까나리액젓', '초피액젓'), ('참치액', '초피액젓'),
        ('국간장', '백간장'), ('흑설탕', '아우노슈가'), ('알룰로스', '아우노슈가'), ('설탕', '아우노슈가'),
        ('물엿', '올리고당'), ('현미유', '올리브유'), ('식용유', '올리브유'), ('청피망', '파프리카'),
        ('무가당 스위트콘', '스위트콘'), ('저당 토마토소스', '토마토소스')]

# 창업자가 «분량까지» 준 것 (편 번호는 1부터)
분량지정 = {6: [('백간장 1.5~2큰술', '백간장 1큰술'), ('초피액젓 2큰술', '초피액젓 3큰술')]}
# 아예 빼라고 한 것
빼기 = {8: ['라오간마', '노두유'], 12: ['(애사비·레몬즙으로 대체 가능)']}
# 소금 → 초피액젓 (창업자가 11번에 지시). ⛔절임·데침용 소금은 «하는 일»이 달라 안 건드린다.
소금갈이 = {11}


def 밀기(s):
    for a, b in 갈이:
        s = 바꿔(s, a, b)
    # ⛔ 「액젓」 홀로 남은 것만 간다 — «이미 초피액젓»이 된 것을 또 갈면 「초피초피액젓」이 된다
    s = re.sub(r'(?<!초피)(?<!까나리)액젓', '초피액젓', s)
    # ⛔ 괄호 속 「대체 가능」 안내는 우리 재료로 갈면 말이 안 된다(아우노슈가→아우노슈가) → 통째로 뺀다
    s = re.sub(r'\s*\([^()]*대체\s*가능\)', '', s)
    return s


바뀐표 = []
for i, r in enumerate(편들):
    n = i + 1
    옛재료, 옛걸음 = list(r['ingredients']), list(r['steps'])
    r['ingredients'] = [밀기(x) for x in r['ingredients']]
    r['steps'] = [밀기(x) for x in r['steps']]

    if n in 소금갈이:
        def 소금(s):
            if '절임' in s or '데침' in s:
                return s
            return 바꿔(s, '소금', '초피액젓')
        r['ingredients'] = [소금(x) for x in r['ingredients']]
        r['steps'] = [소금(x) for x in r['steps']]

    for a, b in 분량지정.get(n, []):
        r['ingredients'] = [바꿔(x, a, b) for x in r['ingredients']]
        r['steps'] = [바꿔(x, a, b) for x in r['steps']]

    # ⛔ 줄을 «지우기 전»에 옛↔새를 자리로 맞춰 둔다 — 지운 뒤에 zip 하면 표가 한 칸씩 밀린다
    짝 = list(zip(옛재료, r['ingredients']))
    for w in 빼기.get(n, []):
        r['ingredients'] = [x for x in r['ingredients'] if w not in x]
        r['steps'] = [re.sub(r'\s{2,}', ' ', 바꿔(x, w, '')).strip() for x in r['steps']]

    남음 = set(r['ingredients'])
    바뀜 = []
    for a, b in 짝:
        if b not in 남음:
            바뀜.append((a, '(뺐다)'))
        elif a != b:
            바뀜.append((a, b))
    바뀐표.append((n, r['title'], 바뀜))

    # ⚠️ 분량을 «창업자가 안 준» 것에 표를 남긴다 — 검수판에서 보게
    확인 = []
    for x in r['ingredients']:
        if any(k in x for k in ('아우노슈가', '초피액젓', '올리고당')):
            if not any(b in x for _, b in 분량지정.get(n, [])):
                확인.append(x)
    r['_검토']['분량확인'] = 확인

# 🔒 옛 재료 이름이 하나도 안 남았나 — 남으면 죽는다
for r in 편들:
    글 = ' '.join(r['ingredients']) + ' ' + ' '.join(r['steps'])
    for 옛 in ('참치액', '알룰로스', '흑설탕', '물엿', '현미유', '식용유', '청피망',
              '까나리액젓', '라오간마', '노두유', '국간장'):
        assert 옛 not in 글, r['title'] + ' 에 「' + 옛 + '」가 남았다'
    assert not re.search(r'(?<!아우노)설탕', 글), r['title'] + ' 에 「설탕」이 남았다'

json.dump(편들, open(os.path.join(P, 'A-우리재료.json'), 'w'), ensure_ascii=False, indent=2)
# ⛔ 짝(옛→새)을 «여기서» 내보낸다 — 검수판이 나중에 추측하면 표가 밀린다(8번에서 실제로 밀렸다)
json.dump({t: 바뀜 for _, t, 바뀜 in 바뀐표},
          open(os.path.join(P, 'A-우리재료-짝.json'), 'w'), ensure_ascii=False, indent=2)
for n, t, 바뀜 in 바뀐표:
    print(('%2d. %s' % (n, t)) + ('   (안 바뀜)' if not 바뀜 else ''))
    for a, b in 바뀜:
        print('      ' + a + '  →  ' + b)
