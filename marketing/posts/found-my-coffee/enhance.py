"""plates/iced-hot.jpg → plates/iced-hot-v2.jpg: make the two drinks look delicious.
Warm grade + vignette, richer crema and milk swirl, local contrast and sheen on the cups, ice highlights, and fine
condensation on the iced glass. The geometry is untouched (the character rig is placed in plate pixels).
"""
import numpy as np
from PIL import Image, ImageFilter, ImageDraw

rng = np.random.default_rng(3)
src = Image.open('plates/iced-hot.jpg').convert('RGB')
W, H = src.size
a = np.asarray(src).astype(np.float32) / 255
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)

def ellipse(cx, cy, rx, ry, soft):
    d = np.sqrt(((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2)
    return np.clip((1 - d) / soft + 0.5, 0, 1)
def box(x0, y0, x1, y1, soft):
    m = np.ones((H, W), np.float32)
    for v, lo, hi in ((xx, x0, x1), (yy, y0, y1)):
        m *= np.clip((v - lo) / soft, 0, 1) * np.clip((hi - v) / soft, 0, 1)
    return m
def blur(m, r): return np.asarray(Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(r))).astype(np.float32) / 255
def lum(x): return x @ np.array([0.299, 0.587, 0.114], np.float32)
def saturate(x, k, mask):
    l = lum(x)[..., None]; return x + (l + (x - l) * k - x) * mask[..., None]
def local_contrast(x, amount, radius, mask):
    b = np.asarray(Image.fromarray((np.clip(x, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius))).astype(np.float32) / 255
    return x + (x - b) * amount * mask[..., None]

glass = blur(box(112, 950, 410, 1318, 8), 6)                       # the iced latte
cup = blur(box(694, 985, 978, 1326, 8), 6)                         # the cappuccino
crema = ellipse(836, 1012, 132, 36, 0.25)
drinks = np.maximum(glass, cup)

# 1. warm grade + gentle S-curve, a soft vignette that pulls the eye to the drinks
a = a * np.array([1.02, 1.0, 0.97], np.float32)
a = np.clip(a, 0, 1); a = a + 0.05 * np.sin(np.pi * a) * (a - 0.5)
spot = blur(ellipse(540, 1150, 620, 520, 1.6), 40)
a = a * (0.80 + 0.20 * spot[..., None])
# 2. the drinks: richer colour, crisper detail, a touch brighter
liquid = blur(box(118, 1022, 404, 1300, 8), 6)                    # the milk + espresso swirl (not the glass or the ceramic)
a = saturate(a, 1.14, liquid)
a = local_contrast(a, 0.35, 16, drinks)
a = a * (1 + 0.05 * drinks[..., None])
# crema: deeper, glossier caramel; the latte art a little whiter
l = lum(a)
a = saturate(a, 1.3, crema)
a = a + (np.array([0.03, 0.012, -0.015], np.float32) * (crema * (l < 0.62))[..., None])
a = a + 0.06 * (crema * (l > 0.66))[..., None]
# 3. sheen: a soft vertical highlight down the left of the glass and the cup, a glint on the crema
for (x0, x1, y0, y1, k) in ((128, 150, 990, 1290, 0.16), (712, 742, 1040, 1290, 0.10)):
    a = a + k * blur(box(x0, y0, x1, y1, 6), 9)[..., None]
a = a + 0.10 * blur(ellipse(790, 1000, 26, 7, 0.6), 4)[..., None]
# ice: brighten the highlights on the cubes above the milk line
ice = box(130, 945, 395, 1030, 10) * (l > 0.68)
a = a + 0.08 * blur(ice.astype(np.float32), 1.5)[..., None]
img = Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))

# 4. condensation on the iced glass: fine droplets, a few runs
lay = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
def inside(x, y): return 120 < x < 400 and 1000 < y < 1300
for _ in range(260):
    x, y = rng.uniform(118, 402), rng.uniform(995, 1305)
    if not inside(x, y): continue
    r = rng.choice([1.6, 2.2, 3.0, 3.8], p=[.35, .35, .2, .1])
    d.ellipse((x - r, y - r * 1.1, x + r, y + r * 1.1), fill=(255, 246, 232, 26))          # the droplet: a faint lens
    d.ellipse((x - r * .55, y - r * .8, x - r * .05, y - r * .3), fill=(255, 252, 245, 120))   # its highlight
    d.arc((x - r, y - r * 1.1, x + r, y + r * 1.1), 30, 150, fill=(40, 26, 14, 40))            # a thin shadow under it
for _ in range(4):                                                                       # a few runs
    x, y0 = rng.uniform(140, 390), rng.uniform(1010, 1150); y1 = y0 + rng.uniform(40, 120)
    d.line((x, y0, x + rng.uniform(-2, 2), y1), fill=(255, 248, 236, 40), width=2)
    d.ellipse((x - 3, y1 - 3, x + 3, y1 + 4), fill=(255, 250, 240, 110))
lay = lay.filter(ImageFilter.GaussianBlur(0.7))
img = Image.alpha_composite(img.convert('RGBA'), lay).convert('RGB')
img.save('plates/iced-hot-v2.jpg', quality=94)
print('ok')
