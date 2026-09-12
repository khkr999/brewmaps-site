from data import *
from cal import calendar
H='<link rel="stylesheet" href="base.css">'
M=76  # single margin, every slide
LC=f'<img class="abs" src="src/logo-cream.png" style="right:{M}px;bottom:{M}px;width:72px;opacity:.9;">'
LG=f'<img class="abs" src="src/logo-green.png" style="right:{M}px;bottom:{M}px;width:72px;opacity:.9;">'
def ph(x,y,w,h,name):
    return f'<div class="ph" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px;"><img src="src/cafe-{name}.png"></div>'

# 1 HOOK — one full-bleed photograph, one hard horizontal edge, type below it
S1=f'''{H}<style>body{{background:var(--night);color:var(--cream);}}</style>
{ph(0,0,1080,838,'alquoz')}
<div class="abs" style="left:0;top:600px;width:1080px;height:238px;background:linear-gradient(to bottom,rgba(14,31,10,0),rgba(14,31,10,.55));"></div>
<div class="abs kick" style="left:{M}px;top:912px;font-size:23px;color:var(--mint);">{MONTH}, so far</div>
<h1 class="h abs" style="left:{M-4}px;top:966px;font-size:116px;">Your<br>coffee month<span style="color:var(--mint)">.</span></h1>
{LC}'''

# 2 STATS — cream, one strict column of rules, one full-height photo column
S2=f'''{H}<style>body{{background:var(--sand);color:var(--green);}}</style>
{ph(648,0,432,1350,'jumeirah')}
<div class="abs kick" style="left:{M}px;top:{M+18}px;font-size:22px;opacity:.55;">{MONTH}, so far</div>
<div class="rule abs" style="left:{M}px;top:248px;width:496px;background:rgba(43,77,31,.22);"></div>
<div class="abs num" style="left:{M-6}px;top:286px;font-size:214px;">{CUPS}</div>
<div class="abs kick" style="left:{M}px;top:494px;font-size:24px;opacity:.72;">cups</div>
<div class="rule abs" style="left:{M}px;top:570px;width:496px;background:rgba(43,77,31,.22);"></div>
<div class="abs num" style="left:{M-6}px;top:608px;font-size:214px;">{CAFES}</div>
<div class="abs kick" style="left:{M}px;top:816px;font-size:24px;opacity:.72;">cafés</div>
<div class="rule abs" style="left:{M}px;top:892px;width:496px;background:rgba(43,77,31,.22);"></div>
<div class="abs num" style="left:{M-6}px;top:930px;font-size:214px;">{FREE_DAYS}</div>
<div class="abs kick" style="left:{M}px;top:1138px;font-size:24px;opacity:.72;">coffee-free days</div>
<div class="rule abs" style="left:{M}px;top:1214px;width:496px;background:rgba(43,77,31,.22);"></div>
<img class="abs" src="src/logo-green.png" style="left:{M}px;bottom:{M}px;width:72px;opacity:.9;">'''

# 3 REWARD — pure typography, the largest element in the carousel
S3=f'''{H}<style>body{{background:var(--night);color:var(--cream);}}</style>
<div class="abs" style="left:-340px;top:-400px;width:1780px;height:1700px;border-radius:50%;background:radial-gradient(circle,rgba(155,196,138,.26) 0%,rgba(155,196,138,.07) 44%,rgba(14,31,10,0) 70%);"></div>
<div class="abs kick" style="left:{M}px;top:268px;font-size:27px;color:var(--mint);">And you earned</div>
<div class="abs num" style="left:{M-42}px;top:364px;font-size:528px;">{POINTS_PLACEHOLDER}</div>
<h1 class="h abs" style="left:{M-4}px;top:846px;font-size:94px;">BrewPoints<span style="color:var(--mint)">.</span></h1>
<div class="rule abs" style="left:{M}px;top:1004px;width:{1080-2*M}px;background:rgba(244,239,230,.2);"></div>
<div class="abs" style="left:{M}px;top:1042px;font-size:27px;font-weight:500;color:rgba(244,239,230,.6);">{CUPS} check-ins · {CAFES} cafés · every cup counts.</div>
{LC}'''

# 4 SHARE — the real calendar at native tile size, strict margins
S4=f'''{H}<style>body{{background:var(--deep);color:var(--cream);}}</style>
<h1 class="h abs" style="left:{M-4}px;top:104px;font-size:82px;">What will your<br>month look like<span style="color:var(--mint)">?</span></h1>
<div class="abs" style="left:{M}px;top:306px;font-size:29px;font-weight:500;line-height:1.42;color:rgba(244,239,230,.7);">Screenshot yours on the 30th.<br>Tag <b style="color:var(--cream);font-weight:700;">@BrewMaps</b></div>
<div class="abs" style="left:{M+24}px;top:522px;">
 <div class="serif" style="font-size:38px;font-style:italic;margin-bottom:20px;">{MONTH}</div>
 {calendar('dark',tile=126,gap=8,rows=5,radius=16)}
</div>
<div class="abs" style="left:{M}px;top:486px;width:50px;height:50px;border-left:3px solid rgba(244,239,230,.7);border-top:3px solid rgba(244,239,230,.7);"></div>
<div class="abs" style="right:{M}px;top:486px;width:50px;height:50px;border-right:3px solid rgba(244,239,230,.7);border-top:3px solid rgba(244,239,230,.7);"></div>
<div class="abs" style="left:{M}px;bottom:196px;width:50px;height:50px;border-left:3px solid rgba(244,239,230,.7);border-bottom:3px solid rgba(244,239,230,.7);"></div>
<div class="abs" style="right:{M}px;bottom:196px;width:50px;height:50px;border-right:3px solid rgba(244,239,230,.7);border-bottom:3px solid rgba(244,239,230,.7);"></div>
{LC}'''
for n,c in [('wrap-1',S1),('wrap-2',S2),('wrap-3',S3),('wrap-4',S4)]:
    open(n+'.html','w').write(c)
