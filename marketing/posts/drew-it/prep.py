#!/usr/bin/env python3
"""Turns each café photo into sketch strokes: edges → contours → simplified polylines,
in the same 1080×1920 frame the photo is shown in, so the drawing lands exactly on the real thing."""
import cv2, numpy as np, json

W, H = 1080, 1920
SHOTS = {   # photo, crop focus (0 top .. 1 bottom), blur, canny low/high, min stroke length, max strokes
    'sibul': ('photos/sibul.jpg', 0.35, 3.0, 30, 80, 240, 90),
    'aldar': ('photos/aldar.jpg', 0.30, 3.0, 30, 80, 220, 90),
    'glass': ('photos/glass.jpg', 0.50, 1.6, 12, 36, 160, 90),
}

def frame(img, fy):
    h, w = img.shape[:2]; s = max(W / w, H / h)
    r = cv2.resize(img, (round(w * s), round(h * s)), interpolation=cv2.INTER_AREA)
    y0 = round((r.shape[0] - H) * fy); x0 = (r.shape[1] - W) // 2
    return r[y0:y0 + H, x0:x0 + W]

out = {}
for k, (p, fy, blur, lo, hi, minlen, cap) in SHOTS.items():
    im = frame(cv2.imread(p), fy)
    cv2.imwrite(f'photos/{k}-frame.jpg', im, [cv2.IMWRITE_JPEG_QUALITY, 92])
    g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
    g = cv2.GaussianBlur(cv2.bilateralFilter(g, 9, 60, 60), (0, 0), blur)
    e = cv2.dilate(cv2.Canny(g, lo, hi), np.ones((3, 3), np.uint8))
    cs, _ = cv2.findContours(e, cv2.RETR_LIST, cv2.CHAIN_APPROX_NONE)
    cs = sorted([c for c in cs if cv2.arcLength(c, False) > minlen], key=lambda c: -cv2.arcLength(c, False))[:cap]
    strokes = []
    for c in cs:
        pts = cv2.approxPolyDP(c, 3.0, False).reshape(-1, 2)
        # a dilated edge's contour runs out and back; keep the first half so each line is drawn once
        half = pts[: max(2, len(pts) // 2 + 1)]
        strokes.append([[int(x), int(y)] for x, y in half])
    # draw big shapes first, then detail, roughly top to bottom within each
    strokes.sort(key=lambda s: (-(len(s) > 12), min(p[1] for p in s)))
    out[k] = strokes
    print(k, len(strokes), 'strokes')
json.dump(out, open('strokes.json', 'w'))

# the cup-and-pin mark, as a sketch that becomes the real logo
m = cv2.imread('../../assets/logos/mark-cream.png', cv2.IMREAD_UNCHANGED)
mw = 420; s = mw / m.shape[1]; mh = round(m.shape[0] * s)
a = cv2.resize(m[:, :, 3], (mw, mh), interpolation=cv2.INTER_AREA)
_, a = cv2.threshold(a, 128, 255, cv2.THRESH_BINARY)
cs, _ = cv2.findContours(a, cv2.RETR_LIST, cv2.CHAIN_APPROX_NONE)
ox, oy = (W - mw) // 2, 760
out['mark'] = [[[int(x + ox), int(y + oy)] for x, y in cv2.approxPolyDP(c, 1.5, True).reshape(-1, 2)] + [[int(c[0][0][0] + ox), int(c[0][0][1] + oy)]] for c in cs if len(c) > 10]
out['markBox'] = [ox, oy, mw, mh]
print('mark', len(out['mark']), 'strokes')
json.dump(out, open('strokes.json', 'w'))
