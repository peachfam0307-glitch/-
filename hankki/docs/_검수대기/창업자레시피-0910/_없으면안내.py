# -*- coding: utf-8 -*-
# 🛒 「우리 재료를 안 사면 못 따라한다」 — 창업자 걱정(2026-09-10)을 푼다.
#
# ⭐ 앱이 이미 그렇게 하고 있었다(src/data/basics.js 실물):
#      '와촌식품 초피액젓 1큰술 (없으면 일반 국간장)'   ← 35줄 중 12줄
#      '백간장 약간 (없으면 소금)' · '백간장 1큰술 (없으면 참치액 1큰술)'  ← 22줄 중 7줄
#      '올리고당' 26줄 · '올리브유' 35줄 → 안내 «거의 없다». 마트에 흔한 것이라 그렇다.
#   ➡️ **구하기 어려운 것에만** 「(없으면 …)」을 단다. 나는 아우노슈가에만 달았었다.
#
# ⛔ 안내에 쓸 이름은 «내가 고르지 않는다» — 원래 그 레시피에 있던 재료를 그대로 쓴다.
#    (짝 표 A-우리재료-짝.json 이 옛→새를 갖고 있다)
import json, os
P = os.path.dirname(os.path.abspath(__file__))
편들 = json.load(open(os.path.join(P, 'A-4판.json')))
짝표 = json.load(open(os.path.join(P, 'A-우리재료-짝.json')))

# 원문 이름 그대로 못 쓰는 것만 앱 표기로 바꾼다
안내이름 = {'액젓': '멸치액젓', '소금': '소금'}
안내붙일것 = ('초피액젓', '백간장')

붙임 = []
for r in 편들:
    거꾸로 = {}
    for 옛, 새 in 짝표.get(r['title'], []):
        if 새 != '(뺐다)':
            거꾸로[새] = 옛
    새목록 = []
    for x in r['ingredients']:
        if any(k in x for k in 안내붙일것) and '없으면' not in x:
            옛 = 거꾸로.get(x)
            if 옛 is None:
                # 2·3판에서 분량이 바뀐 줄 — 이름만으로 되짚는다
                뿌리 = [a for a, b in 짝표.get(r['title'], []) if b != '(뺐다)'
                       and any(k in b for k in 안내붙일것)]
                옛 = 뿌리[0] if len(뿌리) == 1 else None
            if 옛:
                쪽 = 옛.split()
                말 = 안내이름.get(쪽[0], 쪽[0])
                # ⛔ 분량이 «달라진» 줄은 안내에도 분량을 적는다.
                #    우삼겹은 참치액 2큰술 → 초피액젓 3큰술이라, 분량을 안 적으면
                #    참치액을 3큰술 넣게 되어 짜진다.
                옛분량 = ' '.join(쪽[1:])
                새분량 = x.split()[1] if len(x.split()) > 1 else ''
                if 옛분량 and 옛분량 != 새분량:
                    말 = 말 + ' ' + 옛분량
                x = x + ' (없으면 ' + 말 + ')'
                붙임.append((r['title'], x))
        새목록.append(x)
    r['ingredients'] = 새목록

# 🔒 초피액젓·백간장인데 안내가 없으면 죽는다
for r in 편들:
    for x in r['ingredients']:
        if any(k in x for k in 안내붙일것):
            assert '없으면' in x, r['title'] + ' — 「' + x + '」에 (없으면 …) 안내가 없다'

json.dump(편들, open(os.path.join(P, 'A-5판.json'), 'w'), ensure_ascii=False, indent=2)
print('✅ 5판 저장 · 안내 붙인 줄 ' + str(len(붙임)) + '개')
for t, x in 붙임:
    print('   🛒 ' + t + ' : ' + x)
