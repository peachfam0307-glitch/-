# -*- coding: utf-8 -*-
# 🖼 아이콘 고르는 판 — 창업자가 「안 맞는다」고 한 8편에 후보를 «그림으로» 늘어놓는다.
# ⛔ 내가 고르지 않는다. 눈으로 보고 고르는 자리다(규칙 21).
import json, os, base64, io, html
from PIL import Image
P = os.path.dirname(os.path.abspath(__file__))
ROOT = '/home/user/hankki/hankki'
PHOTO = os.path.join(ROOT, 'src/assets/stickers/photo')
이름표 = {k: v['이름표'] for k, v in
        json.load(open(os.path.join(ROOT, 'scripts/icon-checked.json')))['판독'].items()
        if v.get('이름표')}
편들 = {r['title']: r for r in json.load(open(os.path.join(P, 'A-3판.json')))}

# 창업자가 「안 맞는다」고 한 8편 + 내가 고른 후보들(이름표에서 뽑았다)
# ⛔ 「지금 값」이 맨 앞이다 — 그대로 두는 것도 답이다.
고를것 = [
    ('가지 소고기 덮밥', ['gr_387', 'fe_493', 'gr_048', 'gr_092', 'gr_100', 'fe_513']),
    ('닭가슴살 피자 브리또', ['fe_456', 'n2801', 'n2804', 'fe_270', 'n2802']),
    ('보쌈 무김치', ['fe_108', 'gr_046', 'gr_081', 'gr_043', 'gr_096', 'gr_095']),
    ('닭가슴살 오이 샐러드', ['gr_055', 'gr_450', 'fe_179', 'gr_072', 'fe_116', 'fe_527']),
    ('대파 소스 목살 덮밥', ['gr_413', 'gr_102', 'gr_101', 'fe_493', 'gr_100', 'fe_514']),
    ('닭목살 불고기', ['gr_231', 'gr_103', 'gr_073', 'gr_032', 'gr_108', 'fe_314']),
    ('달래 대패삼겹 덮밥', ['gr_365', 'gr_102', 'fe_493', 'gr_048', 'fe_514']),
    ('육회 깻잎무침', ['gr_429', 'gr_082', 'fe_161', 'gr_451', 'gr_039']),
]


def 썸(키, 크기=200):
    p = os.path.join(PHOTO, 키 + '.png')
    if not os.path.exists(p):
        return None
    im = Image.open(p).convert('RGB')
    im.thumbnail((크기, 크기))
    b = io.BytesIO()
    im.save(b, 'JPEG', quality=76)
    return 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode()


CSS = """:root{color-scheme:light}*{box-sizing:border-box}
body{margin:0;padding:12px;font:15px/1.6 -apple-system,"Apple SD Gothic Neo","Noto Sans KR",sans-serif;background:#f6f5f2;color:#22201d}
header{position:sticky;top:0;background:#22201d;color:#fff;padding:12px 14px;border-radius:12px;margin:-12px -12px 14px;z-index:9}
header h1{margin:0 0 4px;font-size:17px}header p{margin:0;font-size:13px;opacity:.85}
button{width:100%;padding:11px;margin-top:10px;border:0;border-radius:9px;background:#c8442e;color:#fff;font-size:14px;font-weight:700}
#out{width:100%;height:140px;margin-top:10px;font:12px/1.5 monospace;padding:9px;border-radius:9px;border:1px solid #ccc}
.p{background:#fff;border-radius:14px;padding:14px;margin:0 0 14px;box-shadow:0 1px 3px rgba(0,0,0,.07)}
.p h2{margin:0 0 10px;font-size:17px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:10px}
.grid label{display:block;text-align:center;font-size:11px;color:#8b837a;cursor:pointer}
.grid img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:11px;border:3px solid #e6e2dc;display:block}
.grid input{display:none}
.grid input:checked + img{border-color:#c8442e}
.grid .nm{display:block;margin-top:3px;color:#544e48;font-weight:700}
.now{color:#1d7a3e;font-weight:700}
.note{display:block;width:100%;margin-top:10px;padding:9px;border:1px solid #ddd8d1;border-radius:8px;font-size:14px}
.warn{background:#fff;border:2px solid #c8442e;border-radius:14px;padding:13px;margin:0 0 14px;font-size:14px}
.warn h2{margin:0 0 6px;font-size:16px;color:#c8442e}"""

JS = """var 편 = __LIST__;
function 복사(){var 줄=[];
 for(var i=0;i<편.length;i++){
  var s=document.querySelector('input[name=i'+i+']:checked');
  var n=document.querySelectorAll('#s'+i+' .note')[0];
  var 메=(n&&n.value.trim())?' \\u2014 '+n.value.trim():'';
  줄.push((i+1)+'. '+편[i]+' : '+(s?s.value:'(안 골랐음)')+메);}
 var t='[아이콘 고르기]\\n'+줄.join('\\n');
 var o=document.getElementById('out');o.value=t;o.focus();o.select();
 try{navigator.clipboard.writeText(t);}catch(e){}}"""
쪼 = JS.split('__LIST__')
JS = 쪼[0] + json.dumps([t for t, _ in 고를것], ensure_ascii=False) + 쪼[1]

부분 = ['<!doctype html><html lang=ko><meta charset=utf-8>',
        '<meta name=viewport content="width=device-width,initial-scale=1">',
        '<title>한끼 · 아이콘 고르기 (8편)</title>', '<style>', CSS, '</style>',
        '<header><h1>아이콘 고르기 · 8편</h1>',
        '<p>초록 테두리 글자 = 지금 값. 그대로가 나으면 그걸 다시 골라도 돼.</p>',
        '<button onclick=복사()>고른 것 복사</button>',
        '<textarea id=out placeholder="누르면 여기 나와"></textarea></header>',
        '<div class=warn><h2>보쌈 무김치 — 뽑아놓은 컷이 아직 앱에 없다</h2>',
        '<code>docs/stickers/음식-창업자-2608/낱개/03-02-무김치.png</code> 는 있는데 '
        '앱 스티커 1972개 안에는 «없다». 넣으려면 자르기를 거쳐야 하는데 '
        '<b>자르기 도구는 내가 손대면 안 되는 것</b>이라 못 넣었어. '
        '아래에서 우선 있는 것 중에 고르거나, 자르기를 돌려줘.</div>']

for i, (제목, 후보) in enumerate(고를것):
    지금 = 편들[제목]['icon']
    부분 += ['<section class=p id=s' + str(i) + '><h2>' + str(i + 1) + '. ' + html.escape(제목) + '</h2><div class=grid>']
    for 키 in 후보:
        d = 썸(키)
        if not d:
            continue
        나 = 이름표.get(키, '')
        부분 += ['<label><input type=radio name=i' + str(i) + ' value="' + 키 + '">',
                 '<img src="' + d + '" alt="">',
                 '<span class="nm' + (' now' if 키 == 지금 else '') + '">' + 키 + (' ★지금' if 키 == 지금 else '') + '</span>',
                 (html.escape(나) if 나 else '<i>이름표 없음</i>'), '</label>']
    부분 += ['</div><input class=note placeholder="여기 없으면 어떤 그림이었으면 좋겠는지 적어줘"></section>']

부분 += ['<script>', JS, '</script></html>']
밖 = os.path.join(P, '아이콘고르기-8편.html')
open(밖, 'w').write('\n'.join(부분))
print('✅ ' + 밖 + '  ' + str(round(os.path.getsize(밖) / 1024)) + 'KB')
for 제목, 후보 in 고를것:
    빠 = [k for k in 후보 if not os.path.exists(os.path.join(PHOTO, k + '.png'))]
    if 빠:
        print('   ⛔ ' + 제목 + ' — 없는 키: ' + ', '.join(빠))
