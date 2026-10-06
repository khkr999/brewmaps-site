# Lays img/map.png onto the green board in img/base.png, keeping the photo's own light and shadows.
# python3 composite.py -> export/story-on-the-map.png (1080×1920)
import cv2, numpy as np, os
here = os.path.dirname(os.path.abspath(__file__))
im = cv2.imread(os.path.join(here, 'img/base.png')).astype(np.float32)
mp = cv2.imread(os.path.join(here, 'img/map.png')).astype(np.float32)
H, W = im.shape[:2]
b, g, r = [c for c in cv2.split(im)]
spill = g - np.maximum(r, b)
# key on hue, so the board still keys out in the shoes' shadows
hsv = cv2.cvtColor(im.astype(np.uint8), cv2.COLOR_BGR2HSV).astype(np.float32)
hue, sat, val = hsv[..., 0], hsv[..., 1], hsv[..., 2]
green = (np.abs(hue - 70) < 22) & (sat > 70) & (val > 18) & (spill > 6)
alpha = np.clip((spill - 6) / 22, 0, 1) * np.clip((sat - 60) / 40, 0, 1) * (np.abs(hue - 70) < 26)
n, lab, st, _ = cv2.connectedComponentsWithStats(green.astype(np.uint8))
i = 1 + np.argmax(st[1:, 4]); x, y, w, h = st[i][:4]
region = cv2.dilate((lab == i).astype(np.uint8), np.ones((7, 7), np.uint8))
alpha *= region
# the board's own shading (sun, shoe shadows) as a multiplier
lum = cv2.cvtColor(im.astype(np.uint8), cv2.COLOR_BGR2HSV)[..., 2].astype(np.float32)
ref = np.percentile(lum[(lab == i)], 70)
shade = np.clip(cv2.GaussianBlur(lum, (0, 0), 2.0) / ref, 0.30, 1.02)
canvas = np.zeros_like(im); canvas[...] = mp[0, 0]
canvas[233:233 + mp.shape[0], 95:95 + mp.shape[1]] = mp[:min(mp.shape[0], H - 233), :min(mp.shape[1], W - 95)]
canvas = canvas * shade[..., None]
# a hint of print texture so it doesn't look pasted on
noise = np.random.default_rng(3).normal(0, 2.2, canvas.shape[:2])[..., None]
canvas = canvas + noise
out = im * (1 - alpha[..., None]) + canvas * alpha[..., None]
# despill green fringes on shoes, hand and cup
edge = (cv2.dilate((alpha > 0.02).astype(np.uint8), np.ones((61, 61), np.uint8)) > 0) & (alpha < 0.98)
ob, og, orr = cv2.split(out)
lim = np.maximum(orr, ob)
og = np.where(edge & (og > lim), lim, og)
og = np.where(edge & (og > 0.94 * orr) & (orr > ob), 0.94 * orr, og)   # lime tint left in the clear cup
out = cv2.merge([ob, og, orr]).clip(0, 255).astype(np.uint8)
os.makedirs(os.path.join(here, 'export'), exist_ok=True)
cv2.imwrite(os.path.join(here, 'export/story-on-the-map.png'), out)
print('ok', out.shape)
