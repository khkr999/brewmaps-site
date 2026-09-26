import sys
AREA = sys.argv[1] if len(sys.argv)>1 else "Jumeirah"
CREAM='#F4EFE6'
# Instagram crops ~96px off each side of a 1080x1920 Reel and its tabs cover the top ~300px.
# The bar itself runs past both edges so it reads full-bleed; the CONTENT is inset 145px
# so the avatar (from x=115) and the buttons (to x=965) stay inside the visible 96–984 band.
L, T, W, H, PAD = -30, 330, 1140, 222, 145
html = f'''<link rel="stylesheet" href="fonts/dmsans.css">
<style>
 html,body{{margin:0;background:transparent;}}
 body{{width:1080px;height:1920px;font-family:"DM Sans",system-ui,sans-serif;-webkit-font-smoothing:antialiased;}}
 .banner{{position:absolute;left:{L}px;top:{T}px;width:{W}px;height:{H}px;
   background:rgba(14,31,10,.9);display:flex;align-items:center;
   padding:0 {PAD}px;box-sizing:border-box;box-shadow:0 26px 60px -24px rgba(0,0,0,.7);}}
 .av{{width:124px;height:124px;border-radius:50%;background:{CREAM};display:flex;align-items:center;justify-content:center;flex:0 0 auto;}}
 .av img{{width:74px;}}
 .txt{{margin-left:28px;flex:1 1 auto;min-width:0;}}
 .name{{color:{CREAM};font-size:54px;font-weight:700;letter-spacing:-.012em;line-height:1.08;
   white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}}
 .sub{{color:rgba(244,239,230,.55);font-size:30px;font-weight:500;margin-top:6px;}}
 .btn{{width:112px;height:112px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex:0 0 auto;}}
 .no{{background:#E5484D;margin-right:20px;}} .yes{{background:#3DBE63;}}
 .btn svg{{width:54px;height:54px;fill:#fff;}}
 .no svg{{transform:rotate(134deg);}}
</style>
<div class="banner">
  <div class="av"><img src="src/mark-green.png"></div>
  <div class="txt"><div class="name">{AREA}</div><div class="sub">BrewMaps</div></div>
  <div class="btn no"><svg viewBox="0 0 24 24"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.58 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .58 3.6 1 1 0 0 1-.25 1z"/></svg></div>
  <div class="btn yes"><svg viewBox="0 0 24 24"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.58 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .58 3.6 1 1 0 0 1-.25 1z"/></svg></div>
</div>'''
open(f'banner-{AREA.lower().replace(" ","-")}.html','w').write(html)
