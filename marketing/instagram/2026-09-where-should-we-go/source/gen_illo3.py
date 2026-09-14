from illo import *
svg=f'''<svg width="1080" height="1350" viewBox="0 0 1080 1350" xmlns="http://www.w3.org/2000/svg">
<circle cx="540" cy="960" r="392" fill="{CREAM}"/>
<path d="M 128,1010 C 106,872 150,760 226,706" fill="none" stroke="{PALE}" stroke-width="6" stroke-linecap="round"/>
<path d="M 952,1010 C 974,872 930,760 854,706" fill="none" stroke="{PALE}" stroke-width="6" stroke-linecap="round"/>
{cup(150,1112)}{cup(940,1106,GREEN)}
</svg>'''
html=f'''<link rel="stylesheet" href="base.css">
<style>body{{background:{SAND};color:{LINE};}}
.screen{{position:absolute;left:236px;top:470px;width:608px;height:880px;box-sizing:border-box;
 border:9px solid {LINE};border-radius:56px;background:#fff;overflow:hidden;}}
.screen img{{position:absolute;width:590px;left:0;top:-140px;}}</style>
<div class="abs" style="left:0;top:0;">{svg}</div>
<h1 class="h abs" style="left:70px;top:142px;font-size:96px;color:{LINE};">Pick an area<span style="color:{MID}">.</span><br>Find your coffee<span style="color:{MID}">.</span></h1>
<div class="abs" style="left:76px;top:366px;font-size:29px;font-weight:500;opacity:.62;">29 areas across the UAE, on BrewMaps.</div>
<div class="screen"><img src="src/browse-dubai.png"></div>
<img class="abs" src="src/logo-green.png" style="right:70px;top:150px;width:70px;opacity:.9;">'''
open('illo-3.html','w').write(html)
