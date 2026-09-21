import sys
NIGHT='#0E1F0A'; CREAM='#F4EFE6'; MINT='#9BC48A'
def overlay(name, line, top=430):
    html=f'''<link rel="stylesheet" href="fonts/dmsans.css">
<style>
 html,body{{margin:0;background:transparent;}}
 body{{width:1080px;height:1920px;font-family:"DM Sans",system-ui,sans-serif;-webkit-font-smoothing:antialiased;}}
 .p{{position:absolute;left:96px;right:96px;top:{top}px;background:rgba(14,31,10,.9);
   border-radius:34px;padding:34px 44px;box-sizing:border-box;text-align:center;
   color:{CREAM};font-size:62px;font-weight:700;letter-spacing:-.015em;
   box-shadow:0 24px 56px -26px rgba(0,0,0,.6);}}
</style><div class="p">{line}</div>'''
    open(name,'w').write(html)
def card(name, body, bg=NIGHT):
    html=f'''<link rel="stylesheet" href="fonts/dmsans.css">
<style>
 html,body{{margin:0;}}
 body{{width:1080px;height:1920px;background:{bg};color:{CREAM};position:relative;
  font-family:"DM Sans",system-ui,sans-serif;-webkit-font-smoothing:antialiased;}}
 .c{{position:absolute;left:96px;right:96px;top:50%;transform:translateY(-50%);text-align:center;}}
 .big{{font-size:150px;font-weight:700;letter-spacing:-.04em;line-height:.95;}}
 .l{{font-size:56px;font-weight:700;margin-top:34px;}}
 .s{{font-size:34px;font-weight:500;opacity:.6;margin-top:22px;}}
 .cta{{display:inline-flex;align-items:center;justify-content:center;margin-top:56px;
   background:{CREAM};color:{NIGHT};font-size:44px;font-weight:700;border-radius:999px;padding:30px 62px;}}
</style><div class="c">{body}</div>'''
    open(name,'w').write(html)

overlay('ovA.html','Pick an area.',420)
overlay('ovB.html','See every café in it.',420)
card('adend.html', '<img src="src/logo-cream.png" style="width:150px"><div class="big" style="margin-top:34px;">413</div>'
                   '<div class="l">specialty cafés<br>across 29 areas</div><div class="cta">Get BrewMaps</div>')
card('cend.html',  '<img src="src/logo-cream.png" style="width:150px"><div class="l" style="margin-top:30px;">Know what coffee<br>should cost.</div>'
                   '<div class="s">413 cafés. 29 areas. Real menu prices.</div><div class="cta">Get BrewMaps</div>')
