from illo import *
A,B,C = 330, 546, 762
Ah,Bh,Ch = 894, 856, 906
As,Bs,Cs = Ah+90, Bh+90, Ch+90
RX,RY = 50, 58
TOP = 1206          # table edge — figures are cropped here, as in the reference
BY  = TOP+30

scene=f'''
<circle cx="546" cy="950" r="318" fill="{CREAM}"/>
<path d="M 198,1046 C 170,946 190,852 258,806" fill="none" stroke="{PALE}" stroke-width="6" stroke-linecap="round"/>
<path d="M 898,1052 C 926,950 906,856 866,812" fill="none" stroke="{PALE}" stroke-width="6" stroke-linecap="round"/>
{qmark(214,796,80,GREEN,-12)}
{qmark(446,716,48,LINE,9)}
{qmark(672,744,62,MID,-6)}
{qmark(882,838,38,LINE,12)}

<!-- LEFT: shrug, forearm up -->
{arm(f'M {A-64},{As+40} C {A-104},{As+46} {A-122},{As+10} {A-126},{As-38}', GREEN)}
{neck(A,Ah,RY)}{torso(A,As,GREEN,sh=72,wa=70,hi=78,by=BY)}
{head(A,Ah,RX,RY)}{curly(A,Ah,RX,RY)}{face(A,Ah,look=6,mouth='o')}

<!-- CENTRE: holding the phone -->
{neck(B,Bh,RY)}{torso(B,Bs,WHITE,sh=72,wa=70,hi=78,by=BY)}
{head(B,Bh,RX,RY)}{bun(B,Bh,RX,RY)}{face(B,Bh,look=0)}

<!-- RIGHT: outer forearm resting on the table -->
{arm(f'M {C+64},{Cs+40} C {C+100},{Cs+86} {C+104},{Cs+126} {C+92},{Cs+152}', LINE)}
{neck(C,Ch,RY)}{torso(C,Cs,LINE,sh=72,wa=70,hi=78,by=BY)}
{head(C,Ch,RX,RY)}{crop(C,Ch,RX,RY)}{face(C,Ch,look=-9)}

<!-- forearms crossing in front -->
{arm(f'M {B-64},{Bs+40} C {B-92},{Bs+104} {B-88},{Bs+150} {B-50},{Bs+164}', WHITE)}
{arm(f'M {B+64},{Bs+40} C {B+92},{Bs+104} {B+88},{Bs+150} {B+50},{Bs+164}', WHITE)}
{arm(f'M {C-64},{Cs+42} C {C-104},{Cs+64} {C-124},{Cs+100} {C-130},{Cs+128}', LINE)}
{phone(B,Bs+150,icon='src/mark-cream.png')}
{hand(B-52,Bs+166,18)}{hand(B+52,Bs+166,18)}
{hand(C-134,Cs+136,18)}
{hand(A-132,As-44,18)}

<!-- table, bleeding off the bottom -->
<path d="M 0,{TOP} L 1080,{TOP} L 1080,1350 L 0,1350 Z" fill="{WHITE}" stroke="none"/>
<line x1="0" y1="{TOP}" x2="1080" y2="{TOP}" stroke="{LINE}" stroke-width="{SW}"/>
{cup(150,1138)}{cup(944,1132,GREEN)}
'''
svg=('<svg width="1080" height="1350" viewBox="0 0 1080 1350" xmlns="http://www.w3.org/2000/svg">'
     '<g transform="translate(540,1206) scale(1.22) translate(-540,-1206)">'+scene+'</g></svg>')
html=f'''<link rel="stylesheet" href="base.css">
<style>body{{background:{SAND};color:{LINE};}}</style>
<div class="abs" style="left:0;top:0;">{svg}</div>
<h1 class="h abs" style="left:70px;top:142px;font-size:100px;color:{LINE};">Where should<br>we go<span style="color:{MID}">?</span></h1>
<div class="abs" style="left:76px;top:372px;font-size:29px;font-weight:500;opacity:.62;">The hardest question in any group chat.</div>
<img class="abs" src="src/logo-green.png" style="right:70px;bottom:60px;width:70px;opacity:.9;">'''
open('illo-1.html','w').write(html)
