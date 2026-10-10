NIGHT='#0E1F0A'; DEEP='#1E3A14'; CREAM='#F4EFE6'; MINT='#9BC48A'; SAND='#EAE1D1'; INK='#141414'
def page(body, bg=NIGHT, fg=CREAM):
    return f'''<link rel="stylesheet" href="fonts/dmsans.css">
<style>
 html,body{{margin:0;}}
 body{{width:1080px;height:1920px;background:{bg};color:{fg};position:relative;
   font-family:"DM Sans",system-ui,sans-serif;-webkit-font-smoothing:antialiased;}}
 .c{{position:absolute;left:96px;right:96px;top:50%;transform:translateY(-50%);text-align:center;}}
 .kick{{font-size:34px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:{MINT};}}
 .big{{font-weight:700;letter-spacing:-.045em;line-height:.88;}}
 .lab{{font-size:46px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;opacity:.62;margin-top:26px;}}
 .line{{font-size:82px;font-weight:700;letter-spacing:-.02em;line-height:1.14;}}
 .sub{{font-size:38px;font-weight:500;opacity:.6;margin-top:30px;}}
</style><div class="c">{body}</div>'''

cards = [
 ('c1', page('<div class="line">Here\'s what they<br>don\'t tell you about<br>coffee in Dubai<span style="color:'+MINT+'">.</span></div>')),
 ('c2', page('<div class="kick">Al Quoz</div><div class="big" style="font-size:400px;margin-top:40px;">7</div><div class="lab">AED, one espresso</div>')),
 ('c3', page('<div class="kick">JBR</div><div class="big" style="font-size:400px;margin-top:40px;">34</div><div class="lab">AED, one espresso</div>')),
 ('c4', page('<div class="line" style="font-size:104px;">Same drink<span style="color:'+MINT+'">.</span><br>Same city<span style="color:'+MINT+'">.</span></div>')),
 ('c5', page('<div class="kick" style="color:#5C7F4A">We checked 78 cafés</div><div class="big" style="font-size:300px;margin-top:40px;color:'+DEEP+'">14</div><div class="lab" style="color:'+DEEP+'">AED, the median</div>', bg=SAND, fg=INK)),
 ('c6', page('<div class="line" style="font-size:96px;">Screenshot this<span style="color:'+MINT+'">.</span></div><div class="sub">Before your next coffee run.</div>')),
 ('c7', page('<img src="src/logo-cream.png" style="width:150px"><div class="line" style="font-size:62px;margin-top:34px;">@brewmaps</div><div class="sub">812 cafés across the UAE.</div>')),
]
for n,h in cards: open(f'{n}.html','w').write(h)
print('wrote', len(cards))
