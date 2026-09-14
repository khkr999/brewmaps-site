from data import *
from cal import calendar
H='<link rel="stylesheet" href="../../assets/base.css">'
M=76
AR=123/172.0
LC=f'<img class="abs" src="../../assets/logos/logo-cream.png" style="right:{M}px;top:{M}px;width:58px;opacity:.85;">'
def ph(x,y,w,h,name,pos='center'):
    return (f'<div class="ph" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px;">'
            f'<img src="../../assets/derived/{name}.png" style="object-position:{pos};"></div>')
def frag(x,y,vis,full,i,r=16):
    """A check-in photo entering from an edge. Only the left `vis` of a `full`-wide
    tile shows, so the +N pill never gets sliced mid-shape."""
    h=round(full*AR)
    return (f'<div class="frag" style="left:{x}px;top:{y}px;width:{vis}px;height:{h}px;border-radius:{r}px;">'
            f'<img src="../../assets/derived/photo-{i}.png" style="width:{full}px;"></div>')
def tile(x,y,w,i,r=16):
    return (f'<div class="ph" style="left:{x}px;top:{y}px;width:{w}px;height:{round(w*AR)}px;border-radius:{r}px;">'
            f'<img src="../../assets/derived/photo-{i}.png"></div>')

# ── 1  HOOK — a descending cascade of real numbers, photo demoted to a band
S1=f'''{H}<style>body{{background:var(--night);color:var(--cream);}}</style>
<div class="abs kick" style="left:{M}px;top:84px;font-size:23px;color:var(--mint);">Your coffee month</div>
<div class="abs rowb" style="left:{M-14}px;top:132px;gap:34px;">
  <span class="num" style="font-size:400px;">{CAFES}</span>
  <span class="h" style="font-size:78px;">Cafés<span style="color:var(--mint)">.</span></span>
</div>
<div class="abs rowb" style="left:246px;top:498px;gap:30px;">
  <span class="num" style="font-size:262px;">{POINTS_PLACEHOLDER}</span>
  <span class="h" style="font-size:60px;">Points<span style="color:var(--mint)">.</span></span>
</div>
<h1 class="h abs" style="left:{M-6}px;top:756px;font-size:128px;">One month<span style="color:var(--mint)">.</span></h1>
<div class="rule abs" style="left:{M}px;top:918px;width:{1080-2*M}px;background:rgba(244,239,230,.22);"></div>
<div class="abs" style="left:{M}px;top:952px;font-size:29px;font-weight:500;color:rgba(244,239,230,.66);">This is your {MONTH} on BrewMaps.</div>
{ph(0,1046,1080,304,'hero-a','center 58%')}
{LC}'''

# ── 2  EARNED — one number, one reveal
S2=f'''{H}<style>body{{background:var(--night);color:var(--cream);}}</style>
<div class="abs" style="left:-360px;top:-300px;width:1820px;height:1700px;border-radius:50%;background:radial-gradient(circle,rgba(155,196,138,.26) 0%,rgba(155,196,138,.07) 44%,rgba(14,31,10,0) 70%);"></div>
<div class="abs kick" style="left:{M}px;top:250px;font-size:27px;color:var(--mint);">You earned</div>
<div class="abs num" style="left:0;top:348px;width:1080px;text-align:center;font-size:556px;">{POINTS_PLACEHOLDER}</div>
<h1 class="h abs" style="left:{M-5}px;top:912px;font-size:104px;">BrewPoints<span style="color:var(--mint)">.</span></h1>
<div class="abs" style="left:{M}px;top:1082px;font-size:34px;font-weight:600;color:rgba(244,239,230,.72);">Just by checking in.</div>'''

# ── 3  CLAIMED — a word lockup, not a second giant numeral
S3=f'''{H}<style>body{{background:var(--cream);color:var(--green);}}</style>
<div class="abs kick" style="left:{M}px;top:206px;font-size:27px;opacity:.6;">And you claimed</div>
<div class="abs rowb" style="left:{M-12}px;top:292px;gap:34px;">
  <span class="num" style="font-size:330px;">{REDEEMED_CAFES_N}</span>
  <span class="h" style="font-size:142px;">Rewards</span>
</div>
<h1 class="h abs" style="left:{M-6}px;top:582px;font-size:142px;">Claimed<span style="color:#7FA86B">.</span></h1>
<div class="rule abs" style="left:{M}px;top:838px;width:{1080-2*M}px;background:rgba(43,77,31,.2);"></div>
<div class="abs" style="left:{M}px;top:884px;font-size:31px;font-weight:500;opacity:.75;line-height:1.45;"><b style="font-weight:700;opacity:1;">{REDEEMED_PLACEHOLDER} BrewPoints</b> redeemed across {REDEEMED_CAFES_N} cafés.</div>'''

# ── 4  THE MONTH — one hero stat, two footnotes, photos as memories
S4=f'''{H}<style>body{{background:var(--sand);color:var(--green);}}</style>
<h1 class="h abs" style="left:{M-5}px;top:88px;font-size:84px;">Your month,<br>in coffee<span style="color:#7FA86B">.</span></h1>
{frag(808,66,272,470,9)}
{tile(596,470,404,2)}
<div class="abs num" style="left:{M-14}px;top:404px;font-size:400px;">{CAFES}</div>
<div class="abs kick" style="left:{M}px;top:786px;font-size:28px;opacity:.8;">cafés explored</div>
{tile(M,966,312,12)}
<div class="rule abs" style="left:540px;top:990px;width:{1080-540-M}px;background:rgba(43,77,31,.2);"></div>
<div class="abs" style="left:540px;top:1034px;font-size:33px;font-weight:600;opacity:.85;line-height:1.7;">{CUPS} cups posted<br>{FREE_DAYS} coffee-free days</div>'''

# ── 5  THE LOOP — calendar as hero, one CTA
TILE=132
S5=f'''{H}<style>body{{background:var(--deep);color:var(--cream);}}</style>
<h1 class="h abs" style="left:{M-5}px;top:84px;font-size:80px;">Every coffee<br>adds to your month<span style="color:var(--mint)">.</span></h1>
<div class="abs" style="left:{M}px;top:284px;font-size:28px;font-weight:500;color:rgba(244,239,230,.62);">Check in. Earn BrewPoints. Build your {MONTH}.</div>
<div class="abs" style="left:62px;top:400px;">
 <div class="serif" style="font-size:34px;font-style:italic;margin-left:6px;margin-bottom:14px;">{MONTH}</div>
 {calendar('dark',tile=TILE,gap=8,rows=5,radius=16)}
</div>
<div class="abs" style="left:{M}px;top:1122px;font-size:44px;font-weight:700;">Check in on BrewMaps<span style="color:var(--mint)">.</span></div>
<div class="abs" style="left:{M}px;top:1206px;font-size:23px;font-weight:500;color:rgba(244,239,230,.5);line-height:1.4;">Share yours at the end of {MONTH}. Tag @BrewMaps</div>
<img class="abs" src="../../assets/logos/logo-cream.png" style="right:{M}px;bottom:{M}px;width:58px;opacity:.85;">'''
for n,c in [('slide-1',S1),('slide-2',S2),('slide-3',S3),('slide-4',S4),('slide-5',S5)]:
    open(n+'.html','w').write(c)
