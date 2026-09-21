# -*- coding: utf-8 -*-
NIGHT='#0E1F0A'; DEEP='#1E3A14'; CREAM='#F4EFE6'; MINT='#9BC48A'; SAND='#EAE1D1'; INK='#141414'
def page(body, bg=NIGHT, fg=CREAM):
    return f'''<link rel="stylesheet" href="../../assets/fonts/tajawal.css">
<style>
 html,body{{margin:0;}}
 body{{width:1080px;height:1920px;background:{bg};color:{fg};position:relative;direction:rtl;
   font-family:"Tajawal",system-ui,sans-serif;-webkit-font-smoothing:antialiased;}}
 .c{{position:absolute;left:92px;right:92px;top:50%;transform:translateY(-50%);text-align:center;}}
 .kick{{font-size:38px;font-weight:700;color:{MINT};}}
 .big{{font-weight:800;letter-spacing:-.03em;line-height:.9;direction:ltr;}}
 .lab{{font-size:46px;font-weight:500;opacity:.68;margin-top:26px;line-height:1.4;}}
 .line{{font-size:84px;font-weight:800;line-height:1.3;}}
 .s{{font-size:36px;font-weight:500;opacity:.62;margin-top:24px;line-height:1.5;}}
 .cta{{display:inline-flex;align-items:center;justify-content:center;margin-top:54px;
   background:{CREAM};color:{NIGHT};font-size:46px;font-weight:800;border-radius:999px;padding:28px 60px;direction:rtl;}}
</style><div class="c">{body}</div>'''

cards=[
 ('ar-1', page('<div class="line">ما لا يخبرك به أحد<br>عن القهوة في دبي</div>')),
 ('ar-2', page('<div class="kick">القوز</div><div class="big" style="font-size:400px;margin-top:38px;">7</div>'
               '<div class="lab">دراهم · إسبريسو واحد</div>')),
 ('ar-3', page('<div class="kick">جي بي آر</div><div class="big" style="font-size:400px;margin-top:38px;">34</div>'
               '<div class="lab">درهماً · إسبريسو واحد</div>')),
 ('ar-4', page('<div class="line" style="font-size:100px;">نفس المشروب<span style="color:'+MINT+'">.</span><br>نفس المدينة<span style="color:'+MINT+'">.</span></div>')),
 ('ar-5', page('<div class="kick" style="color:#5C7F4A">راجعنا أسعار 78 مقهى</div>'
               '<div class="big" style="font-size:300px;margin-top:38px;color:'+DEEP+'">14</div>'
               '<div class="lab" style="color:'+DEEP+';opacity:.75;">نصف المقاهي تبيعه<br>بهذا السعر أو أقل</div>', bg=SAND, fg=INK)),
 ('ar-end', page('<img src="../../assets/logos/logo-cream.png" style="width:148px">'
                 '<div class="line" style="font-size:78px;margin-top:30px;">اعرف السعر<br>قبل ما تطلب</div>'
                 '<div class="s">812 مقهى في الإمارات<br>أسعار حقيقية من المنيو</div>'
                 '<div class="cta">حمّل BrewMaps</div>')),
]
for n,h in cards: open(f'{n}.html','w',encoding='utf-8').write(h)
print('wrote', len(cards))
