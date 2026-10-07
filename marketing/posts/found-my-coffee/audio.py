# Music + sound effects for ep.1 "the ladder", synthesized, timed to reel.js (T). python3 audio.py -> audio/mix.wav
import numpy as np, wave, os
SR = 44100; DUR = 13.0; N = int(SR * DUR)
rng = np.random.default_rng(7)
here = os.path.dirname(os.path.abspath(__file__))
T = dict(inB=1.6, phB=1.7, b24=2.05, offB=3.3, walkA=3.35, atA=5.75, phA=5.85, b92=6.25, hop=6.6, unpack=7.2, plant=7.65, extend=8.45, top=9.6, land=9.95, up=10.2, lounge=10.55, end=11.0)

def t_(n): return np.arange(n) / SR
def env(n, a=0.005, d=0.3):
    t = t_(n); return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)
def onepole(x, fc):                         # simple low-pass
    a = np.exp(-2 * np.pi * fc / SR); y = np.empty_like(x); z = 0.0
    for i in range(len(x)): z = (1 - a) * x[i] + a * z; y[i] = z
    return y
def hp(x, fc): return x - onepole(x, fc)
def place(buf, sig, at, gain=1.0):
    i = int(at * SR); j = min(len(buf), i + len(sig))
    if i < len(buf): buf[i:j] += gain * sig[:j - i]
def fftconv(x, ir):
    n = len(x) + len(ir); m = 1 << (n - 1).bit_length()
    return np.fft.irfft(np.fft.rfft(x, m) * np.fft.rfft(ir, m), m)[:len(x)]
def note(f): return 440 * 2 ** ((f - 69) / 12)

# ── music: cozy lo-fi. Bright → sad, muffled minor during the walk → bright again at ٩٢٪ ──
music = np.zeros(N)
def epiano(freq, dur, vel=0.18):
    n = int(SR * dur); t = t_(n)
    s = np.sin(2 * np.pi * freq * t) + 0.35 * np.sin(2 * np.pi * 2 * freq * t) * np.exp(-t / 0.25) + 0.12 * np.sin(2 * np.pi * 3.01 * freq * t) * np.exp(-t / 0.12)
    s *= (1 + 0.08 * np.sin(2 * np.pi * 4.2 * t))
    return vel * s * env(n, 0.004, 1.4) * np.minimum(1, (dur - t) / 0.08).clip(0, 1)
CH = {'Fmaj7': [53, 57, 60, 64], 'Fm6': [53, 56, 60, 62], 'Dm7': [50, 53, 57, 60], 'Am7': [45, 52, 55, 60], 'Gsus': [43, 50, 55, 60],
      'Cmaj9': [48, 52, 55, 59, 62], 'G6': [43, 50, 52, 59], 'Cmaj7': [48, 52, 55, 59]}
prog = [(0.0, 'Fmaj7'), (T['b24'], 'Fm6'), (T['walkA'], 'Dm7'), (4.55, 'Am7'), (T['atA'], 'Gsus'), (T['b92'], 'Cmaj9'),
        (T['extend'], 'Fmaj7'), (9.05, 'G6'), (T['land'], 'Cmaj7'), (T['end'], 'Fmaj7'), (12.0, 'Cmaj9')]
beat = 60 / 84
for k, (t0, ch) in enumerate(prog):
    t1 = prog[k + 1][0] if k + 1 < len(prog) else DUR
    sad = T['walkA'] <= t0 < T['atA']
    hits = np.arange(t0, t1 - 0.05, beat * (2 if sad else 1))        # sad: half as many hits
    for i, h in enumerate(hits):
        for j, m in enumerate(CH[ch]):
            place(music, epiano(note(m + 12), min(t1 - h, 1.8), 0.05 if i % 2 else 0.065), h + j * 0.018)
    place(music, 0.22 * np.sin(2 * np.pi * note(CH[ch][0] - 12) * t_(int((t1 - t0) * SR))) * env(int((t1 - t0) * SR), 0.02, 1.6), t0)   # soft bass
# drums: soft kick / rim / shaker, out during the sad walk
def kick():
    n = int(0.35 * SR); t = t_(n); f = 55 + 70 * np.exp(-t / 0.04)
    return 0.55 * np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.002, 0.12)
def rim():
    n = int(0.12 * SR); return 0.12 * hp(rng.standard_normal(n), 900) * env(n, 0.001, 0.03)
def shaker():
    n = int(0.06 * SR); return 0.05 * hp(rng.standard_normal(n), 4000) * env(n, 0.004, 0.018)
K, R, H = kick(), rim(), shaker()
for b in np.arange(0, DUR, beat / 2):
    if T['walkA'] - 0.1 < b < T['b92'] - 0.05 or b > 12.2: continue
    i = int(round(b / (beat / 2))) % 8
    if i in (0, 5): place(music, K, b)
    if i in (2, 6): place(music, R, b)
    place(music, H, b + 0.012, 0.8 if i % 2 else 1)
# vinyl: hiss and crackle
music += 0.004 * onepole(rng.standard_normal(N), 3000)
for c in rng.uniform(0, DUR, 90): place(music, 0.05 * rng.standard_normal(30) * np.exp(-np.arange(30) / 6), c)
# room: a short soft reverb, then the sad-walk muffle (time-varying low-pass)
ir = rng.standard_normal(int(0.9 * SR)) * np.exp(-t_(int(0.9 * SR)) / 0.25); ir[0] = 6; ir /= np.abs(ir).sum() / 6
music = fftconv(music, ir)
fc = np.full(N, 9000.0); tt = t_(N)
m = np.clip((tt - T['walkA'] + 0.3) / 0.4, 0, 1) * np.clip((T['b92'] - tt) / 0.25, 0, 1)
fc = 9000 * (1 - m) + 700 * m
a = np.exp(-2 * np.pi * fc / SR); y = np.empty(N); z = 0.0
for i in range(N): z = (1 - a[i]) * music[i] + a[i] * z; y[i] = z
music = y
music *= np.clip((DUR - tt) / 0.8, 0, 1) * np.clip(tt / 0.25, 0, 1)

# ── sound effects ──
sfx = np.zeros(N)
def step(soft=1.0, low=False):
    n = int(0.12 * SR); t = t_(n)
    thump = np.sin(2 * np.pi * (95 if low else 140) * t) * env(n, 0.002, 0.035)
    tick = onepole(rng.standard_normal(n), 2200 if low else 3500) * env(n, 0.001, 0.02)
    return soft * (0.35 * thump + 0.5 * tick)
def contacts(t0, t1, x0, x1, stride, easef, offset=0):
    ts = np.linspace(t0, t1, 2000); u = (ts - t0) / (t1 - t0); x = x0 + (x1 - x0) * easef(u)
    ph = (x0 - x) / stride * np.pi * 2; k = np.floor(ph / np.pi)
    return ts[1:][np.diff(k) > 0]
easeOut = lambda u: 1 - (1 - u) ** 2
ease = lambda u: u * u * (3 - 2 * u)
for c in contacts(0, T['inB'], 1180, 955, 150, easeOut): place(sfx, step(0.9), c)
for c in contacts(T['walkA'], T['atA'], 955, 545, 120, ease): place(sfx, step(0.55, low=True), c)    # the sad shuffle
def tap():
    n = int(0.05 * SR); return 0.2 * hp(rng.standard_normal(n), 2500) * env(n, 0.001, 0.008)
place(sfx, tap(), T['phB'] + 0.1); place(sfx, tap(), T['phA'] + 0.1)
def saw(f, n, vib=0):
    t = t_(n); ph = np.cumsum(f * (1 + vib * np.sin(2 * np.pi * 5.5 * t))) / SR; return 2 * (ph % 1) - 1
def wahwah():                                    # the ٢٤٪: a muted sad trombone, three notes down
    out = []
    for f, d, v in [(note(58), 0.2, 0), (note(57), 0.2, 0), (note(56), 0.6, 0.012)]:
        n = int(d * SR); t = t_(n); s = onepole(saw(f, n, v), 900) * np.minimum(1, t / 0.03) * np.minimum(1, (d - t) / 0.06)
        out.append(s * (0.6 + 0.4 * np.sin(np.pi * t / d)))
    return 0.5 * np.concatenate(out)
place(sfx, wahwah(), T['b24'] + 0.05)
def bell(f, d=1.2, g=0.25):
    n = int(d * SR); t = t_(n)
    return g * (np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * 2.76 * f * t) * np.exp(-t / 0.15) + 0.2 * np.sin(2 * np.pi * 5.4 * f * t) * np.exp(-t / 0.06)) * env(n, 0.002, 0.45)
for i, m_ in enumerate([72, 76, 79, 84]): place(sfx, bell(note(m_), g=0.2), T['b92'] + i * 0.07)          # the ٩٢٪ chime
def boing():
    n = int(0.25 * SR); t = t_(n); f = 300 + 500 * t / 0.25; return 0.12 * np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.005, 0.1)
place(sfx, boing(), T['hop'])
def rustle(d=0.35):
    n = int(d * SR); return 0.07 * onepole(hp(rng.standard_normal(n), 1500), 6000) * np.sin(np.pi * t_(n) / d)
place(sfx, rustle(), T['unpack'])
def wood(f=700, g=0.35):
    n = int(0.18 * SR); t = t_(n)
    return g * (np.sin(2 * np.pi * f * t) * env(n, 0.001, 0.03) + 0.5 * np.sin(2 * np.pi * 2.3 * f * t) * env(n, 0.001, 0.015) + 0.3 * onepole(rng.standard_normal(n), 3000) * env(n, 0.001, 0.01))
place(sfx, wood(520, 0.45), T['plant'])
for k in (1, 2, 3):                                   # the ladder telescoping: click, click, click
    at = T['plant'] + 0.1 + (T['extend'] - 0.05 - T['plant'] - 0.1) * k / 3 - 0.02
    place(sfx, wood(1600, 0.25), at); place(sfx, tap(), at, 0.6)
for k in range(1, 8): place(sfx, wood(900 + 40 * (k % 2), 0.2), T['extend'] + (T['top'] - T['extend']) * k / 7.2)   # rungs
def splash():
    n = int(0.9 * SR); t = t_(n); s = onepole(rng.standard_normal(n), 2500) * np.minimum(1, t / 0.008) * np.exp(-t / 0.18) * 0.6
    for b in range(9):
        bt = 0.05 + rng.uniform(0, 0.5); bn = int(0.05 * SR); f0 = rng.uniform(350, 700)
        bub = np.sin(2 * np.pi * np.cumsum(np.linspace(f0, f0 * 1.9, bn)) / SR) * env(bn, 0.002, 0.015) * 0.25
        i = int(bt * SR); s[i:i + bn] += bub[:len(s[i:i + bn])]
    return s
place(sfx, splash(), T['land'] - 0.02)
def clink(): return bell(2900, 0.4, 0.06) + bell(4150, 0.4, 0.04)
place(sfx, clink(), T['up'] + 0.05); place(sfx, clink(), T['lounge'] + 0.15)
for i, m_ in enumerate([67, 72]): place(sfx, bell(note(m_), 1.6, 0.12), T['end'] + 0.05 + i * 0.09)

mix = 0.55 * music / (np.abs(music).max() + 1e-9) + 0.9 * sfx
mix = np.tanh(mix * 1.1) * 0.9
os.makedirs(os.path.join(here, 'audio'), exist_ok=True)
pcm = (np.stack([mix, mix], 1) * 32767).astype('<i2')
with wave.open(os.path.join(here, 'audio', 'mix.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('ok', mix.shape, float(np.abs(mix).max()))
