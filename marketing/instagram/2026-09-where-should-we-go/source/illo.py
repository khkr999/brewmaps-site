LINE='#141414'; CREAM='#F4EFE6'; SAND='#EAE1D1'; WHITE='#FFFFFF'
GREEN='#2B4D1F'; PALE='#9BC48A'; MID='#5C7F4A'
SW=5

def head(cx,cy,rx=56,ry=64):
    return f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="{WHITE}" stroke="{LINE}" stroke-width="{SW}"/>'

def face(cx,cy,look=0,mouth='smile'):
    ex=cx+look
    s=(f'<circle cx="{ex-20}" cy="{cy-4}" r="6" fill="{LINE}"/>'
       f'<circle cx="{ex+16}" cy="{cy-4}" r="6" fill="{LINE}"/>')
    if mouth=='smile':
        s+=f'<path d="M {ex-14},{cy+28} Q {ex-1},{cy+42} {ex+13},{cy+26}" fill="none" stroke="{LINE}" stroke-width="{SW}" stroke-linecap="round"/>'
    else:
        s+=f'<ellipse cx="{ex-1}" cy="{cy+30}" rx="11" ry="13" fill="{LINE}"/>'
    return s

def curly(cx,cy,rx=56,ry=64,spread=1.0):
    """A cluster of circles reading as curly hair sitting over the skull."""
    import math
    out=[]
    for a,r in [(196,30),(214,36),(236,40),(258,42),(282,42),(304,40),(326,36),(344,30)]:
        t=math.radians(a)
        x=cx+math.cos(t)*rx*1.02*spread; y=cy+math.sin(t)*ry*1.02
        out.append(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{r}" fill="{LINE}"/>')
    return ''.join(out)

def bun(cx,cy,rx=56,ry=64):
    return (f'<circle cx="{cx+2}" cy="{cy-ry-30}" r="34" fill="{LINE}"/>'
            f'<path d="M {cx-rx-4},{cy-6} Q {cx-rx},{cy-ry-30} {cx},{cy-ry-26} Q {cx+rx},{cy-ry-30} {cx+rx+4},{cy-6}'
            f' Q {cx+rx-6},{cy-ry+14} {cx},{cy-ry+6} Q {cx-rx+6},{cy-ry+14} {cx-rx-4},{cy-6} Z" fill="{LINE}"/>')

def crop(cx,cy,rx=56,ry=64):
    return (f'<path d="M {cx-rx-3},{cy+4} Q {cx-rx-6},{cy-ry-22} {cx},{cy-ry-20}'
            f' Q {cx+rx+6},{cy-ry-22} {cx+rx+3},{cy+4} Q {cx+rx-10},{cy-ry+20} {cx},{cy-ry+12}'
            f' Q {cx-rx+10},{cy-ry+20} {cx-rx-3},{cy+4} Z" fill="{LINE}"/>')

def neck(cx,cy,ry=64):
    return f'<rect x="{cx-16}" y="{cy+ry-16}" width="32" height="52" fill="{WHITE}" stroke="{LINE}" stroke-width="{SW}"/>'

def torso(cx,sy,fill,sh=72,wa=70,hi=78,by=1142,collar=True):
    """Sloped shoulders, a slight waist, cropped by the table."""
    d=(f'M {cx-hi},{by} L {cx-wa},{sy+120} '
       f'C {cx-sh-8},{sy+58} {cx-sh-6},{sy+14} {cx-sh+32},{sy} '
       f'L {cx+sh-32},{sy} '
       f'C {cx+sh+6},{sy+14} {cx+sh+8},{sy+58} {cx+wa},{sy+120} '
       f'L {cx+hi},{by} Z')
    out=f'<path d="{d}" fill="{fill}" stroke="{LINE}" stroke-width="{SW}" stroke-linejoin="round"/>'
    if collar:
        out+=(f'<path d="M {cx-26},{sy-2} Q {cx},{sy+32} {cx+26},{sy-2}" fill="none"'
              f' stroke="{LINE}" stroke-width="{SW}" stroke-linecap="round"/>')
    return out

def arm(d,fill,w=40):
    return (f'<path d="{d}" fill="none" stroke="{LINE}" stroke-width="{w+12}" stroke-linecap="round" stroke-linejoin="round"/>'
            f'<path d="{d}" fill="none" stroke="{fill}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"/>')

def hand(x,y,r=20):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{WHITE}" stroke="{LINE}" stroke-width="{SW}"/>'

def phone(x,y,w=64,h=108,tilt=-8):
    return (f'<g transform="rotate({tilt} {x} {y})">'
            f'<rect x="{x-w/2}" y="{y-h/2}" width="{w}" height="{h}" rx="12" fill="{WHITE}" stroke="{LINE}" stroke-width="{SW}"/>'
            f'<rect x="{x-w/2+11}" y="{y-h/2+14}" width="{w-22}" height="{h-32}" rx="5" fill="{GREEN}"/></g>')

def cup(x,y,fill=WHITE,s=1.0):
    w=24*s; h=52*s
    return (f'<g><path d="M {x-w},{y} L {x-w*0.72},{y+h} Q {x-w*0.66},{y+h+10} {x-w*0.3},{y+h+10}'
            f' L {x+w*0.3},{y+h+10} Q {x+w*0.66},{y+h+10} {x+w*0.72},{y+h} L {x+w},{y} Z"'
            f' fill="{fill}" stroke="{LINE}" stroke-width="{SW}" stroke-linejoin="round"/>'
            f'<rect x="{x-w-4}" y="{y-14}" width="{2*w+8}" height="16" rx="7" fill="{WHITE}" stroke="{LINE}" stroke-width="{SW}"/></g>')

def qmark(x,y,size,color,rot=0,op=1):
    return (f'<text x="{x}" y="{y}" font-family="DM Sans" font-weight="700" font-size="{size}" fill="{color}"'
            f' opacity="{op}" transform="rotate({rot} {x} {y})">?</text>')
