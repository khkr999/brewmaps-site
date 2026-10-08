"""Cold drinks v14: turn the supplied drink footage into the reel's clips.
python3 prep_clips.py <source.mp4>
For each of the six shots in the source (hard cuts, ~1.5s each): remove the burned-in drink name by inpainting (a mask of
the pixels that stay white through the shot, in the caption band), crop 3:4 → 9:16, upscale 720×960 → 1080×1920
(Lanczos + light unsharp), and retime to 24 fps with frame blending at the speed each place in the edit needs. Writes
clips/<key>/f_###.jpg (frames, ignored by git) and clips/<key>.mp4 (a small preview kept in the repo).
"""
import os, sys, json, subprocess, tempfile, glob
import numpy as np, cv2
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = sys.argv[1]
import imageio_ffmpeg; FF = imageio_ffmpeg.get_ffmpeg_exe()
tmp = tempfile.mkdtemp(); subprocess.run([FF, '-v', 'error', '-i', SRC, os.path.join(tmp, 's_%03d.png')], check=True)
F = [cv2.imread(f) for f in sorted(glob.glob(os.path.join(tmp, 's_*.png')))]
g = [cv2.cvtColor(f, cv2.COLOR_BGR2GRAY).astype(float) for f in F]
cuts = [i for i in range(1, len(g)) if np.abs(g[i] - g[i - 1]).mean() > 20]
bounds = [0] + cuts + [len(F)]; shots = list(zip(bounds[:-1], bounds[1:]))
# key, source shot, seconds of 24fps output needed, crop x offset (0..180)
PLAN = [('latte', 0, 1.70, 90), ('matcha', 1, 1.70, 90), ('brew', 2, 1.70, 90), ('karkadeh', 3, 2.30, 120), ('unicorn', 4, 1.70, 90), ('lemonade', 5, 1.70, 90)]
for key, k, dur, cx in PLAN:
    a, b = shots[k]; a, b = a + 1, b - 2                       # stay clear of the frames next to each cut
    fr = F[a:b]
    hsv = [cv2.cvtColor(f, cv2.COLOR_BGR2HSV) for f in fr]
    white = np.mean([(h[:, :, 2] > 175) & (h[:, :, 1] < 70) for h in hsv], axis=0)
    m = np.zeros(white.shape, np.uint8); m[456:499, 60:660] = (white[456:499, 60:660] > 0.8).astype(np.uint8) * 255
    m = cv2.dilate(m, np.ones((3, 3), np.uint8), iterations=2)
    clean = [cv2.inpaint(f, m, 6, cv2.INPAINT_TELEA) for f in fr]
    out = os.path.join(HERE, 'clips', key); os.makedirs(out, exist_ok=True)
    for old in glob.glob(os.path.join(out, '*.jpg')): os.remove(old)
    n = int(round(dur * 24)); span = len(clean) - 1
    for j in range(n):
        s = j / (n - 1) * span; i0 = int(np.floor(s)); w = s - i0; i1 = min(i0 + 1, span)
        f = cv2.addWeighted(clean[i0], 1 - w, clean[i1], w, 0)               # frame blending between the two nearest source frames
        f = f[:, cx:cx + 540]
        f = cv2.resize(f, (1080, 1920), interpolation=cv2.INTER_LANCZOS4)
        f = cv2.addWeighted(f, 1.5, cv2.GaussianBlur(f, (0, 0), 1.4), -0.5, 0)   # light unsharp after the 2x upscale
        cv2.imwrite(os.path.join(out, f'f_{j:03d}.jpg'), f, [cv2.IMWRITE_JPEG_QUALITY, 93])
    subprocess.run([FF, '-v', 'error', '-y', '-framerate', '24', '-i', os.path.join(out, 'f_%03d.jpg'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', os.path.join(HERE, 'clips', key + '.mp4')], check=True)
    print(key, 'source frames', a, b, f'({len(clean) / 30:.2f}s)', '->', n, 'frames', f'speed {len(clean) / 30 / dur:.2f}x')
json.dump({key: int(round(dur * 24)) for key, _, dur, _ in PLAN}, open(os.path.join(HERE, 'clips', 'frames.json'), 'w'))
