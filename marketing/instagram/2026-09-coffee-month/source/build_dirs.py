from data import *
H='<link rel="stylesheet" href="base.css">'
LC='<img class="abs" src="src/logo-cream.png" style="right:60px;bottom:52px;width:74px;opacity:.92;">'
LG='<img class="abs" src="src/logo-green.png" style="right:60px;bottom:52px;width:74px;opacity:.92;">'
AR=123/172.0  # true tile aspect from the screenshot

def tile(x,y,w,i,rot=0,r=18,shadow=True):
    h=round(w*AR)
    sh='box-shadow:0 28px 64px -26px rgba(14,31,10,.62);' if shadow else ''
    return (f'<div class="print" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px;'
            f'border-radius:{r}px;transform:rotate({rot}deg);{sh}"><img src="src/photo-{i}.png"></div>')

def wall(x,y,w,gap,ids,cols=3,r=18):
    tw=(w-gap*(cols-1))/cols; th=round(tw*AR); out=''
    for n,i in enumerate(ids):
        cx=x+(n%cols)*(tw+gap); cy=y+(n//cols)*(th+gap)
        out+=(f'<div class="print" style="left:{round(cx)}px;top:{round(cy)}px;width:{round(tw)}px;'
              f'height:{th}px;border-radius:{r}px;box-shadow:none;"><img src="src/photo-{i}.png"></div>')
    return out

# ── A — Bold dark / premium tech : a wall of real tiles, headline sunk into the dark below
A1=f'''{H}<style>body{{background:var(--night);color:var(--cream);}}</style>
{wall(-60,-40,1200,16,PHOTOS,3,22)}
<div class="abs" style="left:0;top:420px;width:1080px;height:340px;background:linear-gradient(to bottom,rgba(14,31,10,0),var(--night) 88%);"></div>
<div class="abs kick" style="left:64px;top:790px;font-size:23px;color:var(--mint);">{MONTH}, so far</div>
<h1 class="h abs" style="left:60px;top:840px;font-size:132px;">Your<br>coffee<br>month<span style="color:var(--mint)">.</span></h1>
{LC}'''
A3=f'''{H}<style>body{{background:var(--night);color:var(--cream);}}</style>
<div class="abs" style="left:-320px;top:-360px;width:1720px;height:1560px;border-radius:50%;background:radial-gradient(circle,rgba(155,196,138,.20) 0%,rgba(155,196,138,.05) 45%,rgba(14,31,10,0) 70%);"></div>
<div class="abs kick" style="left:64px;top:148px;font-size:26px;color:var(--mint);">And you earned</div>
<div class="abs num" style="left:38px;top:244px;font-size:510px;">{POINTS_PLACEHOLDER}</div>
<h1 class="h abs" style="left:64px;top:716px;font-size:86px;">BrewPoints<span style="color:var(--mint)">.</span></h1>
<div class="abs" style="left:64px;top:862px;width:952px;height:1px;background:rgba(244,239,230,.2);"></div>
<div class="abs" style="left:64px;top:908px;display:flex;gap:88px;">
 <div><div class="num" style="font-size:74px;">{CUPS}</div><div class="kick" style="font-size:18px;color:rgba(244,239,230,.58);margin-top:12px;">check-ins</div></div>
 <div><div class="num" style="font-size:74px;">{CAFES}</div><div class="kick" style="font-size:18px;color:rgba(244,239,230,.58);margin-top:12px;">cafés</div></div>
</div>
{tile(596,1092,440,10,-5)}
{LC}'''

# ── B — Warm editorial : photos as physical prints on sand, serif voice
B1=f'''{H}<style>body{{background:var(--sand);color:var(--green);}}</style>
{tile(56,132,430,9,-5)}
{tile(556,88,470,2,4)}
{tile(104,470,560,12,-2)}
{tile(618,506,420,6,6)}
{tile(72,838,360,11,3)}
<div class="abs kick" style="left:470px;top:880px;font-size:21px;opacity:.6;">{MONTH}, so far</div>
<h1 class="serif abs" style="left:464px;top:920px;font-size:100px;font-style:italic;font-weight:500;line-height:.94;margin:0;letter-spacing:-.015em;">Your<br>coffee<br>month.</h1>
{LG}'''
B3=f'''{H}<style>body{{background:var(--sand);color:var(--green);}}</style>
<div class="abs serif" style="left:64px;top:126px;font-size:48px;font-style:italic;">And you earned</div>
<div class="abs serif num" style="left:40px;top:212px;font-size:480px;font-weight:600;letter-spacing:-.04em;">{POINTS_PLACEHOLDER}</div>
<h1 class="h abs" style="left:68px;top:700px;font-size:74px;letter-spacing:-.005em;">BrewPoints</h1>
{tile(614,792,440,11,5)}
<div class="abs" style="left:68px;top:836px;font-size:27px;line-height:1.52;font-weight:500;opacity:.72;max-width:470px;">{CUPS} check-ins across {CAFES} cafés.<br>Every cup counts toward the next badge.</div>
{LG}'''

# ── C — Mixed split : cream above, green below, tiles crossing the seam
C1=f'''{H}<style>body{{background:var(--cream);color:var(--green);}}</style>
<div class="abs" style="left:0;top:690px;width:1080px;height:660px;background:var(--deep);"></div>
{tile(-40,96,430,2,-4)}
{tile(408,54,440,9,3)}
{tile(838,150,400,6,-6)}
{tile(52,470,470,10,2)}
{tile(556,486,500,12,-3)}
<div class="abs kick" style="left:64px;top:770px;font-size:23px;color:var(--mint);">{MONTH}, so far</div>
<h1 class="h abs" style="left:60px;top:822px;font-size:120px;color:var(--cream);">Your<br>coffee month<span style="color:var(--mint)">.</span></h1>
{LC}'''
C3=f'''{H}<style>body{{background:var(--cream);color:var(--green);}}</style>
<div class="abs" style="left:0;top:0;width:1080px;height:700px;background:var(--deep);"></div>
<div class="abs kick" style="left:64px;top:118px;font-size:25px;color:var(--mint);">And you earned</div>
<div class="abs num" style="left:40px;top:206px;font-size:470px;color:var(--cream);">{POINTS_PLACEHOLDER}</div>
<h1 class="h abs" style="left:64px;top:742px;font-size:90px;">BrewPoints<span style="color:var(--mint)">.</span></h1>
<div class="abs" style="left:64px;top:874px;font-size:27px;font-weight:500;opacity:.7;">{CUPS} check-ins · {CAFES} cafés · every cup counts.</div>
{tile(64,960,440,9,-3)}
{tile(570,992,440,12,4)}
{LG}'''
for n,c in [('dirA-1',A1),('dirA-3',A3),('dirB-1',B1),('dirB-3',B3),('dirC-1',C1),('dirC-3',C3)]:
    open(n+'.html','w').write(c)
