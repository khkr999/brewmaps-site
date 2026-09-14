from illo import *
A,B,C = 296, 556, 816            # tighter grouping; side figures tuck behind
Ah,Bh,Ch = 802, 738, 808
As,Bs,Cs = Ah+108, Bh+108, Ch+108
RX,RY = 62, 72
TOP = 1232
BY  = TOP+30
T = dict(sh=86, wa=84, hi=90, by=BY)   # almost no flare at this crop

def lean(inner,deg,cx,cy):
    return f'<g transform="rotate({deg} {cx} {cy})">{inner}</g>'

scene=f'''
<circle cx="556" cy="906" r="352" fill="{CREAM}"/>
<path d="M 214,846 C 232,742 306,676 392,650" fill="none" stroke="{PALE}" stroke-width="6" stroke-linecap="round"/>
<path d="M 902,852 C 886,748 812,680 726,654" fill="none" stroke="{PALE}" stroke-width="6" stroke-linecap="round"/>

<!-- LEFT, tucked behind and leaning in -->
{arm(f'M {A-78},{As+48} C {A-118},{As+112} {A-122},{As+162} {A-108},{As+198}', GREEN)}
{neck(A,Ah,RY)}{torso(A,As,GREEN,**T)}
{lean(head(A,Ah,RX,RY)+curly(A,Ah,RX,RY)+face(A,Ah,look=11), 9, A, Ah+RY)}
{hand(A-104,As+204,20)}

<!-- RIGHT, tucked behind and leaning in -->
{arm(f'M {C+78},{Cs+48} C {C+118},{Cs+112} {C+122},{Cs+162} {C+108},{Cs+198}', LINE)}
{neck(C,Ch,RY)}{torso(C,Cs,LINE,**T)}
{lean(head(C,Ch,RX,RY)+crop(C,Ch,RX,RY)+face(C,Ch,look=-11), -9, C, Ch+RY)}
{hand(C+112,Cs+204,20)}

<!-- CENTRE, in front, phone up at chest height -->
{neck(B,Bh,RY)}{torso(B,Bs,WHITE,**T)}
{head(B,Bh,RX,RY)}{bun(B,Bh,RX,RY)}{face(B,Bh,look=0)}
{arm(f'M {B-80},{Bs+50} C {B-112},{Bs+104} {B-104},{Bs+136} {B-70},{Bs+146}', WHITE)}
{arm(f'M {B+80},{Bs+50} C {B+112},{Bs+104} {B+104},{Bs+136} {B+70},{Bs+146}', WHITE)}
{phone(B,Bs+96,94,156,-4,icon="src/mark-cream.png")}
{hand(B-72,Bs+148,20)}{hand(B+72,Bs+148,20)}

<path d="M 0,{TOP} L 1080,{TOP} L 1080,1350 L 0,1350 Z" fill="{WHITE}" stroke="none"/>
<line x1="0" y1="{TOP}" x2="1080" y2="{TOP}" stroke="{LINE}" stroke-width="{SW}"/>
'''
svg=('<svg width="1080" height="1350" viewBox="0 0 1080 1350" xmlns="http://www.w3.org/2000/svg">'
     '<g transform="translate(540,1232) scale(1.14) translate(-540,-1232)">'+scene+'</g></svg>')
html=f'''<link rel="stylesheet" href="base.css">
<style>body{{background:{SAND};color:{LINE};}}</style>
<div class="abs" style="left:0;top:0;">{svg}</div>
<h1 class="h abs" style="left:70px;top:142px;font-size:96px;color:{LINE};">Someone always<br>has to decide<span style="color:{MID}">.</span></h1>
<div class="abs" style="left:76px;top:366px;font-size:29px;font-weight:500;opacity:.62;">Be that person.</div>'''
open('illo-2.html','w').write(html)
