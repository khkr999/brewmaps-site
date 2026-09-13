from data import *
from cal import calendar
H='<link rel="stylesheet" href="base.css">'
M=76
def ph(x,y,w,h,name,pos='center'):
    return (f'<div class="ph" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px;">'
            f'<img src="src/{name}.png" style="object-position:{pos};"></div>')

# ── 1  COVER — coffee moment above, dark green below, masthead kicker + logo
S1=f'''{H}<style>body{{background:var(--night);color:var(--cream);}}</style>
{ph(0,0,1080,800,'hero-a','center 62%')}
<div class="abs" style="left:0;top:560px;width:1080px;height:240px;background:linear-gradient(to bottom,rgba(14,31,10,0),rgba(14,31,10,.45));"></div>
<div class="abs kick" style="left:{M}px;top:874px;font-size:25px;color:var(--mint);">{MONTH}, so far</div>
<img class="abs" src="src/logo-cream.png" style="right:{M}px;top:856px;width:64px;opacity:.95;">
<div class="rule abs" style="left:{M}px;top:936px;width:{1080-2*M}px;background:rgba(244,239,230,.22);"></div>
<h1 class="h abs" style="left:{M-5}px;top:998px;font-size:118px;">Your<br>coffee month<span style="color:var(--mint)">.</span></h1>'''

# ── 2  REWARD — the number owns the canvas
S2=f'''{H}<style>body{{background:var(--night);color:var(--cream);}}</style>
<div class="abs" style="left:-360px;top:-300px;width:1820px;height:1700px;border-radius:50%;background:radial-gradient(circle,rgba(155,196,138,.26) 0%,rgba(155,196,138,.07) 44%,rgba(14,31,10,0) 70%);"></div>
<div class="abs kick" style="left:{M}px;top:250px;font-size:27px;color:var(--mint);">And you earned</div>
<div class="abs num" style="left:0;top:348px;width:1080px;text-align:center;font-size:556px;">{POINTS_PLACEHOLDER}</div>
<h1 class="h abs" style="left:{M-5}px;top:912px;font-size:104px;">BrewPoints<span style="color:var(--mint)">.</span></h1>
<div class="abs" style="left:{M}px;top:1082px;font-size:29px;font-weight:500;color:rgba(244,239,230,.62);">Earned through your BrewMaps check-ins.</div>'''

# ── 3  REDEEMED — the inverse of slide 2: green on cream
S3=f'''{H}<style>body{{background:var(--cream);color:var(--green);}}</style>
<div class="abs kick" style="left:{M}px;top:250px;font-size:27px;opacity:.62;">And you redeemed</div>
<div class="abs num" style="left:0;top:348px;width:1080px;text-align:center;font-size:556px;">{REDEEMED_PLACEHOLDER}</div>
<h1 class="h abs" style="left:{M-5}px;top:912px;font-size:104px;">BrewPoints<span style="color:#7FA86B">.</span></h1>
<div class="abs" style="left:{M}px;top:1082px;font-size:29px;font-weight:500;opacity:.68;">Spent across {REDEEMED_CAFES} cafés this month.</div>'''

# ── 4  DATA AS DESIGN — cream, asymmetric, check-in photos bled to the edges
S4=f'''{H}<style>body{{background:var(--sand);color:var(--green);}}</style>
<div class="abs num" style="left:{M-10}px;top:96px;font-size:312px;">{CUPS}</div>
{ph(604,132,400,286,'photo-9')}
<div class="abs kick" style="left:{M}px;top:404px;font-size:26px;opacity:.8;">cups posted</div>
{ph(M,556,330,236,'photo-2')}
<div class="abs num" style="left:436px;top:472px;font-size:436px;">{CAFES}</div>
<div class="abs kick" style="left:442px;top:876px;font-size:26px;opacity:.8;">caf&eacute;s</div>
<div class="abs num" style="left:{M-10}px;top:922px;font-size:340px;">{FREE_DAYS}</div>
<div class="abs kick" style="left:284px;top:1118px;font-size:26px;opacity:.8;line-height:1.3;">coffee-free<br>days</div>
{ph(604,984,400,286,'photo-12')}'''

# ── 5  SHARE — headline, CTA and calendar as one block
TILE=136
S5=f'''{H}<style>body{{background:var(--deep);color:var(--cream);}}</style>
<h1 class="h abs" style="left:{M-5}px;top:88px;font-size:78px;">What will your<br>month look like<span style="color:var(--mint)">?</span></h1>
<div class="abs" style="left:{M}px;top:268px;font-size:40px;font-weight:700;color:var(--cream);">Start building yours.</div>
<div class="abs" style="left:{M}px;top:326px;font-size:27px;font-weight:500;color:rgba(244,239,230,.6);">Check in when you grab a coffee.</div>
<div class="abs" style="left:44px;top:432px;">
 <div class="serif" style="font-size:36px;font-style:italic;margin-left:6px;margin-bottom:16px;">{MONTH}</div>
 {calendar('dark',tile=TILE,gap=8,rows=5,radius=17)}
</div>
<div class="abs" style="left:36px;top:412px;width:46px;height:46px;border-left:3px solid rgba(244,239,230,.65);border-top:3px solid rgba(244,239,230,.65);"></div>
<div class="abs" style="right:36px;top:412px;width:46px;height:46px;border-right:3px solid rgba(244,239,230,.65);border-top:3px solid rgba(244,239,230,.65);"></div>
<div class="abs" style="left:36px;top:1122px;width:46px;height:46px;border-left:3px solid rgba(244,239,230,.65);border-bottom:3px solid rgba(244,239,230,.65);"></div>
<div class="abs" style="right:36px;top:1122px;width:46px;height:46px;border-right:3px solid rgba(244,239,230,.65);border-bottom:3px solid rgba(244,239,230,.65);"></div>
<div class="abs" style="left:{M}px;top:1232px;font-size:25px;font-weight:500;color:rgba(244,239,230,.6);line-height:1.35;">Share yours at the end of September.<br>Tag <b style="color:var(--cream);font-weight:700;">@BrewMaps</b></div>
<img class="abs" src="src/logo-cream.png" style="right:{M}px;bottom:{M}px;width:64px;opacity:.95;">'''
for n,c in [('wrap-1',S1),('wrap-2',S2),('wrap-3',S3),('wrap-4',S4),('wrap-5',S5)]:
    open(n+'.html','w').write(c)
