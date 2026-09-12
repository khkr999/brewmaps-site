from data import *
from cal import calendar
H='<link rel="stylesheet" href="base.css">'
LC='<img class="abs" src="src/logo-cream.png" style="right:60px;bottom:50px;width:74px;opacity:.92;">'
LG='<img class="abs" src="src/logo-green.png" style="right:60px;bottom:50px;width:74px;opacity:.92;">'
AR=123/172.0
def tile(x,y,w,i,rot=0,r=18,dark=False):
    h=round(w*AR)
    sh='0 30px 70px -24px rgba(0,0,0,.7)' if dark else '0 28px 64px -26px rgba(14,31,10,.55)'
    return (f'<div class="print" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px;'
            f'border-radius:{r}px;transform:rotate({rot}deg);box-shadow:{sh};"><img src="src/photo-{i}.png"></div>')

# ── 1  HOOK — night green, prints scattered, immersive
S1=f'''{H}<style>body{{background:var(--night);color:var(--cream);}}</style>
{tile(-56,72,440,2,-5,dark=True)}
{tile(430,20,450,9,4,dark=True)}
{tile(842,180,400,6,-7,dark=True)}
{tile(66,436,500,10,3,dark=True)}
{tile(600,470,470,12,-4,dark=True)}
<div class="abs" style="left:0;top:700px;width:1080px;height:300px;background:linear-gradient(to bottom,rgba(14,31,10,0),var(--night) 78%);"></div>
<div class="abs kick" style="left:64px;top:856px;font-size:24px;color:var(--mint);">{MONTH}, so far</div>
<h1 class="h abs" style="left:60px;top:910px;font-size:138px;">Your<br>coffee month<span style="color:var(--mint)">.</span></h1>
{LC}'''

# ── 2  STATS — sand, editorial asymmetry, no KPI columns
S2=f'''{H}<style>body{{background:var(--sand);color:var(--green);}}</style>
{tile(556,86,500,9,4)}
<div class="abs num" style="left:48px;top:104px;font-size:330px;">{CUPS}</div>
<div class="abs serif" style="left:74px;top:440px;font-size:50px;font-style:italic;font-weight:500;">cups</div>
{tile(40,534,520,2,-4)}
<div class="abs num" style="left:600px;top:452px;font-size:330px;">{CAFES}</div>
<div class="abs serif" style="left:686px;top:790px;font-size:50px;font-style:italic;font-weight:500;">caf&eacute;s</div>
{tile(574,938,470,12,5)}
<div class="abs num" style="left:48px;top:904px;font-size:330px;">{FREE_DAYS}</div>
<div class="abs serif" style="left:268px;top:1088px;font-size:48px;font-style:italic;font-weight:500;line-height:1.14;">coffee-free<br>days</div>
<img class="abs" src="src/logo-green.png" style="left:64px;bottom:44px;width:74px;opacity:.92;">'''

# ── 3  REWARD — near-black, colossal number, nothing competing
S3=f'''{H}<style>body{{background:var(--night);color:var(--cream);}}</style>
<div class="abs" style="left:-340px;top:-400px;width:1780px;height:1700px;border-radius:50%;background:radial-gradient(circle,rgba(155,196,138,.26) 0%,rgba(155,196,138,.07) 44%,rgba(14,31,10,0) 70%);"></div>
<div class="abs kick" style="left:64px;top:230px;font-size:28px;color:var(--mint);">And you earned</div>
<div class="abs num" style="left:34px;top:330px;font-size:540px;">{POINTS_PLACEHOLDER}</div>
<h1 class="h abs" style="left:64px;top:820px;font-size:96px;">BrewPoints<span style="color:var(--mint)">.</span></h1>
<div class="abs" style="left:66px;top:988px;font-size:28px;font-weight:500;color:rgba(244,239,230,.62);">{CUPS} check-ins · {CAFES} cafés · every cup counts.</div>
{LC}'''

# ── 4  SHARE — deep green card, the real calendar, screenshot cue
S4=f'''{H}<style>body{{background:var(--deep);color:var(--cream);}}</style>
<h1 class="h abs" style="left:60px;top:92px;font-size:84px;">What will your<br>month look like<span style="color:var(--mint)">?</span></h1>
<div class="abs" style="left:64px;top:300px;font-size:30px;font-weight:500;line-height:1.4;color:rgba(244,239,230,.72);">Screenshot yours on the 30th.<br>Tag <b style="color:var(--cream);font-weight:700;">@BrewMaps</b></div>
<div class="abs" style="left:96px;top:492px;">
 <div class="serif" style="font-size:40px;font-style:italic;color:var(--cream);margin-bottom:20px;">{MONTH}</div>
 {calendar('dark',tile=130,gap=8,rows=5,radius=18)}
</div>
<div class="abs" style="left:54px;top:456px;width:54px;height:54px;border-left:4px solid rgba(244,239,230,.75);border-top:4px solid rgba(244,239,230,.75);border-radius:12px 0 0 0;"></div>
<div class="abs" style="right:54px;top:456px;width:54px;height:54px;border-right:4px solid rgba(244,239,230,.75);border-top:4px solid rgba(244,239,230,.75);border-radius:0 12px 0 0;"></div>
<div class="abs" style="left:54px;bottom:172px;width:54px;height:54px;border-left:4px solid rgba(244,239,230,.75);border-bottom:4px solid rgba(244,239,230,.75);border-radius:0 0 0 12px;"></div>
<div class="abs" style="right:54px;bottom:172px;width:54px;height:54px;border-right:4px solid rgba(244,239,230,.75);border-bottom:4px solid rgba(244,239,230,.75);border-radius:0 0 12px 0;"></div>
{LC}'''
for n,c in [('wrap-1',S1),('wrap-2',S2),('wrap-3',S3),('wrap-4',S4)]:
    open(n+'.html','w').write(c)
