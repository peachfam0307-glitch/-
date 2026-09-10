# -*- coding: utf-8 -*-
# ☑️ 검수판 2판 — 우리 재료로 간 뒤. 바뀐 줄을 «색으로» 짚고, 분량 못 정한 것을 맨 위에 올린다.
import json, os, base64, io, html
from PIL import Image
P = os.path.dirname(os.path.abspath(__file__))
ROOT = '/home/user/hankki/hankki'
전 = json.load(open(os.path.join(P, 'A-다듬음.json')))
편들 = json.load(open(os.path.join(P, 'A-우리재료.json')))
옛것 = {r['title']: r['ingredients'] for r in 전}
짝표 = json.load(open(os.path.join(P, 'A-우리재료-짝.json')))
대안 = {'가지 소고기 덮밥': 'gr_339', '대파 소스 목살 덮밥': 'gr_333',
        '새송이버섯 들깨무침': 'fe_143', '미나리 오징어무침': 'gr_452'}


def 썸(키):
    p = os.path.join(ROOT, 'src/assets/stickers/photo', 키 + '.png')
    if not os.path.exists(p):
        return ''
    im = Image.open(p).convert('RGB')
    im.thumbnail((160, 160))
    b = io.BytesIO()
    im.save(b, 'JPEG', quality=72)
    return 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode()


CSS = """:root{color-scheme:light}*{box-sizing:border-box}
body{margin:0;padding:12px;font:15px/1.65 -apple-system,"Apple SD Gothic Neo","Noto Sans KR",sans-serif;background:#f6f5f2;color:#22201d}
header{position:sticky;top:0;background:#22201d;color:#fff;padding:12px 14px;border-radius:12px;margin:-12px -12px 14px;z-index:9}
header h1{margin:0 0 4px;font-size:17px}header p{margin:0;font-size:13px;opacity:.85}
.bar{display:flex;gap:8px;margin-top:10px}
button{flex:1;padding:11px;border:0;border-radius:9px;background:#c8442e;color:#fff;font-size:14px;font-weight:700}
button.sec{background:#4a4642}
.warn{background:#fff;border:2px solid #c8442e;border-radius:14px;padding:13px;margin:0 0 14px}
.warn h2{margin:0 0 6px;font-size:16px;color:#c8442e}
.warn p{margin:0 0 8px;font-size:13px;color:#544e48}
.warn li{font-size:14px;margin:4px 0}
.p{background:#fff;border-radius:14px;padding:14px;margin:0 0 14px;box-shadow:0 1px 3px rgba(0,0,0,.07)}
.p h2{margin:0 0 6px;font-size:18px;display:flex;align-items:center;gap:8px}
.no{background:#22201d;color:#fff;border-radius:7px;padding:1px 8px;font-size:13px}
.old{background:#fff3cd;border-left:3px solid #e0a800;padding:6px 9px;border-radius:5px;font-size:13px;margin:6px 0}
.meta{color:#7a736c;font-size:13px}.est{color:#8a5a00;font-size:13px;margin:4px 0 8px}
.icons{display:flex;gap:14px;align-items:flex-start;margin:8px 0 4px;flex-wrap:wrap}
.icons img{width:74px;height:74px;object-fit:cover;border-radius:11px;border:1px solid #e6e2dc}
.icons .k{font-size:11px;color:#8b837a;margin-left:-10px;padding-top:24px}
.p h3{margin:14px 0 5px;font-size:14px;color:#c8442e}
ul,ol{margin:0;padding-left:20px}li{margin:3px 0}
li.new{background:#e8f4ea;border-radius:5px;padding:2px 6px;margin-left:-6px}
li.new b{color:#1d7a3e}
li.new s{color:#a09890;font-weight:400}
li.q{background:#fdecea;border-radius:5px;padding:2px 6px;margin-left:-6px}
.memo{margin-top:12px;background:#f2f0ec;border-radius:8px;padding:9px 11px;font-size:13px;color:#544e48}
.judge{margin-top:12px;border-top:1px dashed #ddd8d1;padding-top:10px}
.judge label{display:inline-block;margin-right:12px;font-size:14px;padding:5px 0}
.note{display:block;width:100%;margin-top:8px;padding:9px;border:1px solid #ddd8d1;border-radius:8px;font-size:14px}
#out{width:100%;height:170px;margin-top:10px;font:12px/1.5 monospace;padding:9px;border-radius:9px;border:1px solid #ccc}"""

JS = """var 제목들 = __TITLES__;
function 전부OK(){for(var i=1;i<=제목들.length;i++){var e=document.querySelector('input[name=j'+i+'][value=OK]');if(e)e.checked=true;}}
function 복사(){var 줄=[];
 for(var i=1;i<=제목들.length;i++){
  var s=document.querySelector('input[name=j'+i+']:checked');
  var n=document.querySelectorAll('#p'+i+' .note')[0];
  var 메=(n&&n.value.trim())?' \\u2014 '+n.value.trim():'';
  줄.push(i+'. '+제목들[i-1]+' : '+(s?s.value:'(안 정함)')+메);}
 var t='[검수판 A 2판 \\u00b7 15편]\\n'+줄.join('\\n');
 var o=document.getElementById('out');o.value=t;o.focus();o.select();
 try{navigator.clipboard.writeText(t);}catch(e){}}"""
쪼 = JS.split('__TITLES__')
JS = 쪼[0] + json.dumps([r['title'] for r in 편들], ensure_ascii=False) + 쪼[1]

부분 = ['<!doctype html><html lang=ko><meta charset=utf-8>',
        '<meta name=viewport content="width=device-width,initial-scale=1">',
        '<title>한끼 · 검수판 A 2판 (우리 재료)</title>',
        '<style>', CSS, '</style>',
        '<header><h1>검수판 A · 2판 — 우리 재료로 갈았다</h1>',
        '<p>초록 = 바꾼 줄 · 빨강 = 내가 분량을 못 정한 줄</p>',
        '<div class=bar><button onclick=복사()>판정 복사</button>',
        '<button class=sec onclick=전부OK()>전부 그대로</button></div>',
        '<textarea id=out placeholder="[판정 복사]를 누르면 여기 나와"></textarea></header>']

# ⚠️ 맨 위 — 내가 정하면 안 되는 분량
모은분량 = []
for i, r in enumerate(편들):
    for x in r['_검토'].get('분량확인', []):
        모은분량.append((i + 1, r['title'], x))
부분 += ['<div class=warn><h2>먼저 봐줄 것 — 분량은 내가 안 정했다</h2>',
         '<p>「우삼겹 두부조림」에서 창업자가 <b>참치액 2큰술 → 초피액젓 3큰술</b>로 «늘렸다». '
         '1:1이 아니라는 뜻이라, 분량을 안 준 곳은 <b>원래 분량 그대로 뒀다</b>. 아래를 보고 고쳐줘.</p><ul>']
for n, t, x in 모은분량:
    부분.append('<li><b>' + str(n) + '. ' + html.escape(t) + '</b> — ' + html.escape(x) + '</li>')
부분 += ['</ul><p>특히 <b>15. 구움찰떡의 아우노슈가 54g</b> — 이건 «굽는» 거라 설탕이 맛뿐 아니라 '
         '반죽에도 관여해. 그램 그대로 가도 되는지 봐줘.</p></div>']

for i, r in enumerate(편들):
    n = i + 1
    검 = r['_검토']
    옛 = 옛것[r['title']]
    확인 = set(검.get('분량확인', []))
    아 = '<img src="' + 썸(r['icon']) + '" alt=""><div class=k>' + r['icon'] + '<br><small>지금 값</small></div>'
    if r['title'] in 대안:
        아 += '<img src="' + 썸(대안[r['title']]) + '" alt=""><div class=k>' + 대안[r['title']] + '<br><small>새 제목으로 고르면</small></div>'
    부분 += ['<section class=p id=p' + str(n) + '>',
             '<h2><span class=no>' + str(n) + '</span> ' + html.escape(r['title']) + '</h2>']
    if 검['제목바꿈']:
        부분.append('<div class=old>원래 제목: <b>' + html.escape(검['원래제목']) + '</b></div>')
    부분 += ['<div class=meta>' + r['folder'] + ' · ' + r['category'] + ' · ' + ' · '.join(r['tags']) + '</div>',
             '<div class=est>추정 — ' + html.escape(검['추정']) + '</div>',
             '<div class=icons>' + 아 + '</div>',
             '<h3>재료 ' + str(len(r['ingredients'])) + '개</h3><ul>']
    # ⛔ 짝은 «바꾼 쪽이 만든 표»를 그대로 쓴다 — 여기서 추측하면 밀린다(8번에서 실제로 밀렸다)
    새로온 = {b: a for a, b in 짝표.get(r['title'], []) if b != '(뺐다)'}
    for x in r['ingredients']:
        전값 = 새로온.get(x)
        칸 = 'q' if x in 확인 else ('new' if 전값 else '')
        속 = ('<s>' + html.escape(전값) + '</s> → <b>' + html.escape(x) + '</b>') if 전값 else html.escape(x)
        부분.append('<li' + (' class=' + 칸 if 칸 else '') + '>' + 속 + '</li>')
    for a, b in 짝표.get(r['title'], []):
        if b == '(뺐다)':
            부분.append('<li class=new><s>' + html.escape(a) + '</s> → <b>뺐다</b></li>')
    부분 += ['</ul>',
             '<h3>만드는 법 ' + str(len(r['steps'])) + '걸음</h3><ol>',
             ''.join('<li>' + html.escape(x) + '</li>' for x in r['steps']), '</ol>',
             '<div class=memo><b>내가 손댄 곳</b><br>' + (html.escape(검['메모']) or '없음') + '</div>',
             '<div class=judge>',
             '<label><input type=radio name=j' + str(n) + ' value="OK"> 그대로 내자</label>',
             '<label><input type=radio name=j' + str(n) + ' value="고쳐"> 고칠 데 있음</label>',
             '<label><input type=radio name=j' + str(n) + ' value="빼"> 빼자</label>',
             '<input class=note placeholder="분량 / 고칠 내용 …"></div></section>']

부분 += ['<script>', JS, '</script></html>']
밖 = os.path.join(P, '검수판-A-2판-우리재료.html')
open(밖, 'w').write('\n'.join(부분))
print('✅ ' + 밖 + '  ' + str(round(os.path.getsize(밖) / 1024)) + 'KB · ' + str(len(편들)) + '편 · 분량확인 ' + str(len(모은분량)) + '줄')
