# September 2026 as shown in the BrewMaps Calendar screenshot. States: c=had coffee (green outline), p=photo, x=coffee-free (grey), f=future, e=empty
SEP = [None,'c','p','x','c','c','p',  'c','c','p','p','p','p','f',  'f','f','f','f','f','f','f',  'f','f','f','f','f','f','f',  'f','f','f']
def calendar(theme='dark', tile=150, gap=8, rows=None, radius=22, weekdays=True):
    days = SEP[:]  # index 0 = leading empty (Sept starts Tuesday)
    cells=[]
    # leading blank for Monday
    cells.append('<div class="t e"></div>')
    for d in range(1,31):
        s=days[d]
        if s=='p':
            cells.append(f'<div class="t p"><img src="src/cell-sep-{d}.png"></div>')
        else:
            cells.append(f'<div class="t {s}"><span>{d}</span></div>')
    if rows: cells=cells[:rows*7]
    wd=''
    if weekdays:
        wd='<div class="wd">'+''.join(f'<span>{c}</span>' for c in 'MTWTFSS')+'</div>'
    css=f'''
<style>
.calw{{--tile:{tile}px;--gap:{gap}px;}}
.cal{{display:grid;grid-template-columns:repeat(7,var(--tile));gap:var(--gap);}}
.cal .t{{width:var(--tile);height:calc(var(--tile)*0.72);border-radius:{radius}px;display:flex;align-items:flex-end;justify-content:center;padding-bottom:calc(var(--tile)*0.12);box-sizing:border-box;font-family:"DM Sans";font-weight:600;font-size:calc(var(--tile)*0.26);overflow:hidden;position:relative;}}
.cal .t.p{{padding:0;display:block;}}
.cal .t.p img{{width:100%;height:100%;object-fit:cover;display:block;}}
.wd{{display:grid;grid-template-columns:repeat(7,var(--tile));gap:var(--gap);font-family:"DM Sans";font-weight:600;font-size:calc(var(--tile)*0.16);letter-spacing:0.06em;text-align:center;margin-bottom:calc(var(--gap)*1.5);}}
</style>'''
    if theme=='dark':
        css+='''<style>
.cal .t.c{background:#F4EFE6;color:#2B4D1F;}
.cal .t.x{background:rgba(244,239,230,0.10);color:rgba(244,239,230,0.55);}
.cal .t.f{background:rgba(244,239,230,0.06);color:rgba(244,239,230,0.28);}
.cal .t.e{background:transparent;}
.wd{color:rgba(244,239,230,0.45);}
</style>'''
    else:
        css+='''<style>
.cal .t.c{background:#fff;border:2px solid #BFD6B2;color:#2B4D1F;}
.cal .t.x{background:#EFEFEF;color:#8A8A8A;}
.cal .t.f{background:#F4F4F4;color:#A8A8A8;}
.cal .t.e{background:transparent;}
.wd{color:#9A9A9A;}
</style>'''
    return css+'<div class="calw">'+wd+'<div class="cal">'+''.join(cells)+'</div></div>'
