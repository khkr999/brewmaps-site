"""على ذوقك · "Cold drinks" v7: the mix. A soft pluck arpeggio after the reference sound (see the music section), with
an ice clink on every cut; a swell under the focus pull into the question, the lift and an ice cube as its words rise;
a rising swell as the first crop surfaces, ice ticks on the montage cuts; the phone rising, the tap, every keystroke,
the send, the result tone, the line; then the resolve. Every accent is placed on the frame where its picture lands
(cut times quantised to 24 fps), all read from timing.js, so picture and sound always agree.
Usage: python3 sound.py <workdir> <out.wav>
"""
import json, os, subprocess, sys
import numpy as np, soundfile as sf, pyloudnorm
from scipy.signal import butter, sosfilt, fftconvolve

HERE = os.path.dirname(os.path.abspath(__file__))
TM = json.loads(subprocess.run(['node', '-e', "const m=require(process.argv[1]);console.log(JSON.stringify(m))", os.path.join(HERE, 'timing.js')], check=True, capture_output=True, text=True).stdout)
SHOT, N_SHOTS, T, APP, BEAT = TM['SHOT'], len(TM['SHOTS']), TM['T'], TM['APP'], TM['BEAT']
SR = 48000; DUR = T['end']; N = int(DUR * SR)
WORK, OUT = sys.argv[1], sys.argv[2]; os.makedirs(WORK, exist_ok=True)
rng = np.random.default_rng(11)
db = lambda d: 10 ** (d / 20); REF = db(-1)
FR = lambda t: np.ceil(t * 24 - 1e-6) / 24                 # the first frame on which a cut is visible
cuts = [FR(i * SHOT) for i in range(N_SHOTS)]
flashes = [T['bridge']] + [FR(T['bridge'] + i * T['flash']) for i in range(1, 4)]   # the first crop surfaces on the downbeat; the rest are cuts
tq = T['question'] + 2 * TM['NOTE']                        # the question's first words are up: the lift lands here, on a note

# ---------------------------------------------------------------- DSP ---------------------------
def lp(x, f): return sosfilt(butter(2, f, 'lowpass', fs=SR, output='sos'), x)
def hp(x, f): return sosfilt(butter(2, f, 'highpass', fs=SR, output='sos'), x)
def bp(x, lo, hi): return sosfilt(butter(2, [lo, hi], 'bandpass', fs=SR, output='sos'), x)
def tt(d): return np.arange(int(d * SR)) / SR
def env(d, a, dec): t = tt(d); return np.minimum(1, t / a) * np.exp(-np.maximum(0, t - a) / dec)
def norm(x): p = np.abs(x).max(); return x / p if p > 0 else x
def noise(d): return rng.standard_normal(int(d * SR))
def modal(freqs, decays, amps, d, jit=0.02):
    t = tt(d); return sum(a * np.sin(2 * np.pi * f * (1 + jit * rng.uniform(-1, 1)) * t + rng.uniform(0, 6)) * np.exp(-t / dc) for f, dc, a in zip(freqs, decays, amps))
def splash(size=1.0, d=0.5):                               # v9: an ice cube dropped into water: a low plop, a soft short splash, a few droplets
    out = np.zeros(int(d * SR)); put_ = lambda x, o, a: out.__setitem__(slice(int(o * SR), int(o * SR) + len(x)), out[int(o * SR):int(o * SR) + len(x)] + a * x[:max(0, len(out) - int(o * SR))])
    put_(bubble(rng.uniform(430, 560) / size ** 0.5, 0.08 * size, 1.1), 0.0, 1.0)                      # the plop
    sp = bp(noise(0.12), 700, 3200) * env(0.12, 0.003, 0.035 * size) * (0.4 + 0.6 * lp(np.abs(noise(0.12)), 60) / 0.5)
    put_(sp, 0.004, 0.35)                                                                              # the splash, short and soft
    put_(lp(noise(0.06), 350) * env(0.06, 0.002, 0.015), 0.0, 0.45)                                    # the low thunk of the cube
    for k in range(int(4 + 3 * size)):                                                                # droplets falling back
        put_(bubble(rng.uniform(1000, 2400), rng.uniform(0.015, 0.03), 2.0), rng.uniform(0.04, 0.3), 0.3 * rng.uniform(0.5, 1) / (1 + k * 0.25))
    return lp(out, 5000)
def glass(f, d=0.5): return modal([f, f * 1.47, f * 2.13, f * 2.9], [0.14, 0.09, 0.06, 0.04], [1, .6, .35, .2], d)
def bubble(f0, d=0.03, rise=2.5):
    t = tt(d); f = f0 * (1 + rise * t / d); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / (d / 3)) * np.minimum(1, t / 0.0015)
def whoosh(d, f0, f1, peak=0.5):
    t = tt(d); x = noise(d); y = np.zeros_like(x); blk = 256
    for s in range(0, len(x), blk):
        fc = f0 * (f1 / f0) ** min(1, s / len(x)); y[s:s + blk] = bp(x[s:s + blk], fc / 1.6, min(fc * 1.6, 20000))
    e = np.where(t < peak * d, (t / (peak * d)) ** 2, np.exp(-(t - peak * d) / (0.3 * d))); return y * e
def ir(rt, damp):
    n = int(rt * SR); t = np.arange(n) / SR; out = []
    for _ in range(2): r = lp(rng.standard_normal(n) * np.exp(-6.9 * t / rt), damp); r[:int(0.008 * SR)] *= np.linspace(0, 1, int(0.008 * SR)); out.append(r / np.sqrt(np.sum(r ** 2)))
    return np.stack(out, -1)
def reverb(x, h, wet): return x + wet * np.stack([fftconvolve(x[:, c], h[:, c])[:len(x)] for c in range(2)], -1)
SFX = np.zeros((N, 2))
def place(sig, t0, rel_db, pan=0.0):
    s = norm(sig) * REF * db(rel_db)
    s = s * np.minimum(1, np.arange(len(s)) / (0.003 * SR)).reshape((-1,) + (1,) * (s.ndim - 1))   # a 3ms fade-in: no hard clicks
    if s.ndim == 1: th = (pan + 1) * np.pi / 4; s = np.stack([s * np.cos(th), s * np.sin(th)], -1)
    i = int(round(t0 * SR)); k = min(len(s), N - i)
    if k > 0: SFX[i:i + k] += s[:k]

# ---------------------------------------------------------------- music -------------------------
# After the reference sound: a soft sine pluck (fundamental plus its octave, 30ms attack, short decay) playing a
# hypnotic three-note figure in F# (C#–E#–F#, with D# and G# turns), one note every NOTE = SHOT/7 seconds, so
# every cut and every montage flash lands on a note. A soft sine bass marks each phrase (each cut), a warm pad lifts
# the question, the result and the line get a high sparkle, and the
# figure lands on an F# major chord under the final hold.
NAMES = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
def midi(n): return 12 * (int(n[-1]) + 1) + NAMES[n[0]] + (1 if '#' in n else -1 if n[1] == 'b' else 0)
def hz(n): return 440 * 2 ** ((midi(n) - 69) / 12)
NOTE = TM['NOTE']; OFF = 0.02                          # the grid sits 20ms late so a note never leads its frame
MUS = np.zeros((N, 2))
def put(sig, t0, gain=1.0, pan=0.0):
    i = int(round(t0 * SR)); k = min(len(sig), N - i)
    if k <= 0: return
    if sig.ndim == 1: th = (pan + 1) * np.pi / 4; sig = np.stack([sig * np.cos(th), sig * np.sin(th)], -1)
    MUS[i:i + k] += gain * sig[:k]
def pluck(n, partner, vel=1.0, dur=1.0):
    t = tt(dur); f, p = hz(n), hz(partner)
    e = np.minimum(1, t / 0.028) ** 1.6 * (0.7 * np.exp(-t / 0.10) + 0.3 * np.exp(-t / 0.5))
    out = []
    for det in (-0.0016, 0.0016):                        # two voices a few cents apart: width without chorus wobble
        x = (np.sin(2 * np.pi * f * (1 + det) * t) + 0.85 * np.sin(2 * np.pi * p * (1 - det) * t + 0.4)
             + np.exp(-t / 0.07) * (0.12 * np.sin(2 * np.pi * 3 * f * t) + 0.04 * np.sin(2 * np.pi * 4 * f * t + 1) + 0.02 * np.sin(2 * np.pi * 5 * f * t + 2)))   # a little tine on the attack, like the reference
        out.append(x * e * vel)
    return np.stack(out, -1)
def bass(n, vel=1.0, dur=1.4):
    t = tt(dur); f = hz(n); return (np.sin(2 * np.pi * f * t) + 0.22 * np.sin(4 * np.pi * f * t)) * np.minimum(1, t / 0.012) * np.exp(-t / 0.55) * vel
def pad(notes, dur, att=0.35, rel=0.5, vel=1.0):
    t = tt(dur); e = np.minimum(1, t / att) * np.clip((dur - t) / rel, 0, 1)
    x = sum(np.sin(2 * np.pi * hz(n) * (1 + d) * t + k) for k, n in enumerate(notes) for d in (-0.002, 0.002)) / (2 * len(notes))
    return lp(x * e * vel, 2500)
def thump(): t = tt(0.3); return np.sin(2 * np.pi * np.cumsum(np.linspace(110, 45, len(t))) / SR) * np.minimum(1, t / 0.004) * np.exp(-t / 0.09)
A = [('C#5', 'C#6'), ('F5', 'F4'), ('F#5', 'F#4')]
B = [('D#6', 'D#5'), ('F#5', 'F#4'), ('C#5', 'C#6')]
C = [('F5', 'F4'), ('F#5', 'F#4'), ('G#4', 'G#5')]
PH = [  # (phrase notes, bass root) — one phrase per shot: two figures and a turn into the next cut
    (A + A + [('G#4', 'G#5')], 'F#2'), (A + A + [('D#5', 'D#6')], 'B1'), (B + B + [('F5', 'F4')], 'D#2'),
    (A + C + [('C#6', 'C#5')], 'C#2'),                              # v15: four drinks, so four opening phrases
    (B + B + [('F5', 'F4'), ('F#5', 'F#4')], 'B1'),                 # the question: 8 notes, rising into the bridge
    (A + A + [('F5', 'F4'), ('G#4', 'G#5')], 'C#2'),                # the montage: 8 notes
    (A + A + [('G#4', 'G#5')], 'F#2'), (A + A + [('D#5', 'D#6')], 'B1'), (B + B + [('G#4', 'G#5')], 'D#2'), (C + [('C#6', 'C#5')], 'C#2'),   # the demo: 25 notes, then the chord
]
k0 = 0; seq = []
for notes, root in PH:
    for j, nn in enumerate(notes): seq.append((k0 + j, nn, j == 0))
    put(bass(root), OFF + k0 * NOTE, 0.05); k0 += len(notes)
kq = 7 * N_SHOTS; kb = kq + 8; kp = kb + 8                       # the question, the montage and the phone, on the note grid
for k, (n, p), first in seq:
    t = OFF + k * NOTE; v = 1.0 if first else 0.82
    if k < kq: v *= 0.95
    if kp + 4 <= k < kp + 12: v *= 0.72                # quieter under the typing, so the keys read
    put(pluck(n, p, v), t, 0.5, 0.12 * ((k % 3) - 1))
kc = kp + 25                                         # the last chord: F# major, rolled, ringing under the hold
for j, (n, p) in enumerate([('F#4', 'F#5'), ('A#4', 'A#5'), ('C#5', 'C#6'), ('F#5', 'F#4')]):
    put(pluck(n, p, 0.8, 1.6), OFF + kc * NOTE + 0.035 * j, 0.5, -0.15 + 0.1 * j)
put(bass('F#2', 1.0, 1.4), OFF + kc * NOTE, 0.1)
put(pad(['B3', 'D#4', 'F#4', 'A#4'], 8 * NOTE + 0.4), OFF + kq * NOTE, 0.22)          # the question's lift
put(pad(['C#4', 'F4', 'G#4', 'B4'], 8 * NOTE + 0.3, att=0.2), OFF + kb * NOTE, 0.14)  # under the montage
put(pluck('C#6', 'C#7', 0.7, 1.2), T['result'] + 0.01, 0.45, 0.2); put(pluck('F#6', 'F#5', 0.7, 1.2), T['result'] + 0.09, 0.45, -0.2)   # the results
put(pluck('A#5', 'A#6', 0.6, 1.2), T['message'] + 0.01, 0.4, 0.15)                                                                       # the line
music = lp(MUS[:, 0], 9000)[:, None] * [1, 0] + lp(MUS[:, 1], 9000)[:, None] * [0, 1]
sf.write(os.path.join(WORK, 'music-stem.wav'), (music / np.abs(music).max() * 0.8).astype(np.float32), SR)

# v10: the drink sounds are real recordings supplied for the reel (sfx/): ice moving in water, and coffee poured over ice
# with its fizz. Short slices are cut at a natural knock, given a 4ms fade-in and a soft tail, and kept low.
from scipy.signal import resample_poly
def load(name):
    x, sr = sf.read(os.path.join(HERE, 'sfx', name)); x = x.mean(1) if x.ndim > 1 else x
    return resample_poly(x, SR, sr) if sr != SR else x
ICE, POUR = load('ice-water-movement.wav'), load('coffee-pour-on-ice-fizzy.wav')
def cut(src, a, d, fin=0.004, fout=0.15):
    x = src[int(a * SR):int((a + d) * SR)].copy(); n = len(x); t = np.arange(n) / SR
    return x * np.minimum(1, t / fin) * np.clip((d - t) / fout, 0, 1)
def place_rms(sig, t0, rel_db, pan=0.0):                   # long textures: set by their average level, not their loudest spike
    r = np.sqrt(np.mean(sig ** 2))
    s = sig / max(r, 1e-9) * REF * db(rel_db); s = np.stack([s * np.cos((pan + 1) * np.pi / 4), s * np.sin((pan + 1) * np.pi / 4)], -1)
    i = int(round(t0 * SR)); k = min(len(s), N - i)
    if k > 0: SFX[i:i + k] += s[:k]
# the opening: an ice-in-water knock on every cut, over a quiet bed of ice moving in water
def onset(x): return int(np.argmax(np.abs(x) > 0.5 * np.abs(x).max()))       # the attack: first sample above half the peak
def on_frame(sig, t, rel, pan=0.0): place(sig, t - onset(sig) / SR, rel, pan)          # place a sound so its attack lands exactly on t
SWITCH = cut(ICE, 7.31, 0.55, fin=0.002, fout=0.25)                                   # one clean ice-in-water knock, used on every drink switch
LIGHT = cut(ICE, 19.26, 0.40, fin=0.002, fout=0.2)                                    # a lighter one for the quick montage cuts
# v13: the drink-switch sound: a splash from the pour recording (one clean attack, short tail) with the ice knock under it,
# like a cube dropped into the next drink. Same sound on every switch, its attack on the cut frame.
def mixed(*parts):
    n = max(len(p) for p, _ in parts); out = np.zeros(n)
    for p, g in parts: out[:len(p)] += p / np.abs(p).max() * db(g)
    return out
SPLASH = cut(POUR, 1.57, 0.42, fin=0.002, fout=0.22)
def align(x): return np.roll(np.pad(x, (int(0.05 * SR), 0)), -onset(np.pad(x, (int(0.05 * SR), 0))) + int(0.05 * SR))   # attack at a fixed 50ms point
DROP = mixed((align(SPLASH), 0), (align(SWITCH), -1))          # v15: the ice in it a little louder
# v18: the drink switch is the supplied air woosh (sfx/air-woosh.wav), its loudest moment on the cut frame, with the ice
# knock landing on the cut under it. The splash is gone.
WOOSH_SRC = load('air-woosh.wav')
WOOSH = cut(WOOSH_SRC, 0.25, 1.15, fin=0.05, fout=0.3)                              # rises ~0.45s into its peak, then fades
WOOSH_S = cut(WOOSH_SRC, 0.50, 0.42, fin=0.03, fout=0.15)                           # a short one for the quick montage cuts
def peak_at(x): e = np.sqrt(np.convolve(x ** 2, np.ones(int(0.01 * SR)) / int(0.01 * SR), 'same')); return int(np.argmax(e))
def on_peak(sig, t, rel, pan=0.0): place(sig, t - peak_at(sig) / SR, rel, pan)          # place a woosh so its peak lands exactly on t
def switch(t, rel=-14, pan=0.0): on_peak(WOOSH, t, rel, pan); on_frame(SWITCH, t, rel - 6, -pan)
for i, t in enumerate(cuts[1:]): switch(t, -11, [0.15, -0.15, 0.1][i % 3])
switch(FR(T['question']), -12, 0.0)                                                  # into the question
# v12: the ice bed is a smooth texture now: its loudness is evened out so no stray knock sounds between the cuts
bed = lp(ICE[int(2.0 * SR):int(2.0 * SR) + N].copy(), 5000)
ev = np.sqrt(np.maximum(lp(bed ** 2, 4), 0)); bed = bed / (ev + 0.15 * ev.mean())
benv = np.interp(np.arange(N) / SR, [0, 0.35, T['product'], T['typeStart'], DUR], [-60, -33, -33, -43, -43])                                         # the ice bed, 3 dB up
bed = bed / np.abs(bed).max() * db(benv) * REF; SFX[:, 0] += bed * np.cos(np.pi / 4); SFX[:, 1] += bed * np.sin(np.pi / 4)
kick = lambda: np.sin(2 * np.pi * np.cumsum(np.linspace(150, 48, int(0.25 * SR))) / SR) * env(0.25, 0.002, 0.07)
# the question: coffee poured over ice as the karkadeh pulls into the green, its fullest moment on the words; the fizz stays under
pour = cut(POUR, 0.9, 2.3, fin=0.25, fout=0.7)
c = np.sqrt(np.mean(pour ** 2)) * db(10); pour = c * np.tanh(pour / c)               # tame the pour's splashes: no spike above the texture
place_rms(pour[int((T['question'] - (tq - 0.68)) * SR):] * np.minimum(1, np.arange(len(pour) - int((T['question'] - (tq - 0.68)) * SR)) / (0.06 * SR)), T['question'], -31, 0.0)   # starts on the cut into the question, its fullest moment on the words
fizz = cut(POUR, 5.0, T['bridge'] - T['question'] - 0.7, fin=0.3, fout=0.4); place_rms(fizz, T['question'] + 0.7, -43, 0.0)   # under the question only; gone before the montage
on_frame(SWITCH, FR(T['bridge']), -18, 0.0)   # v19: no woosh in the montage, just the ice knock                                                     # the first crop surfacing, on the downbeat
DROP_S = mixed((align(cut(POUR, 1.57, 0.26, fin=0.002, fout=0.14)), 0), (align(LIGHT), -1))
for k, t in enumerate(flashes[1:]): on_frame(LIGHT, t, -21, (-1) ** k * 0.2)   # v19: the quick montage cuts keep only a light ice knock   # the quick montage cuts: a shorter, lighter drop
for k, t in enumerate(flashes): on_frame(kick(), t, -23)
place(whoosh(0.75, 280, 1500, 0.5), T['phoneIn'] - 0.02, -18)                                # the phone rising from below
thud = lp(noise(0.12), 900) * env(0.12, 0.002, 0.03); place(thud, T['phoneIn'] + 0.6, -24)   # and settling
# the phone: the supplied clicks (sfx/). A single soft click as the field is tapped, the four halves of the two mouse
# clicks (press and release of each) rotating as keystrokes, and the press-and-release click on send
SCLICK, CLICK, M1, M2 = load('simple-click.wav'), load('click.wav'), load('mouse-clicks-v1.wav'), load('mouse-clicks-v2.wav')
TAP = cut(SCLICK, 0.0, 0.11, fin=0.0005, fout=0.04)                                      # the supplied simple click, one per character
KEYS = [cut(M1, 0.645, 0.08, 0.001, 0.03), cut(M2, 0.415, 0.09, 0.001, 0.03), cut(M1, 0.735, 0.07, 0.001, 0.03), cut(M2, 0.575, 0.05, 0.001, 0.02)]   # trimmed: this half had a second tick at 65ms
for k, tk in enumerate(T['keys']):                                                           # every keystroke, on the frame it appears
    on_frame(TAP, tk, -25, 0.0)                                                          # v17: the simple click on every character, on its frame



# ---------------------------------------------------------------- mix ---------------------------
TT = np.arange(N) / SR
ramp = lambda pts: np.interp(TT, [p[0] for p in pts], [p[1] for p in pts])
music = music / np.abs(music).max()
music = reverb(music, ir(1.6, 4500), 0.22)
g = ramp([(0, -30), (0.08, -11), (T['question'], -11), (tq, -10), (T['product'], -11), (T['typeStart'], -12), (T['submit'], -11.5), (DUR, -11.5)])
duck = np.zeros(N)
for t0 in [T['result']]:
    a = np.clip((TT - t0) / 0.004, 0, 1) * np.where(TT < t0 + 0.1, 1, np.exp(-(TT - t0 - 0.1) / 0.25)); duck = np.maximum(duck, 1.2 * a)
music = music / np.abs(music).max() * REF * db(g - duck)[:, None]
SFXL = np.stack([lp(SFX[:, c], 6500) for c in range(2)], -1)                  # v8: softer edges on every effect
sfx = reverb(SFXL, ir(1.0, 5000), 0.24) * db(-4)
sf.write(os.path.join(WORK, 'sfx-stem.wav'), (SFX / np.abs(SFX).max() * 0.8).astype(np.float32), SR)   # dry effects, for checking sync                             # and the whole effects bus 4 dB down, a touch more room
SILENT = DUR - 0.05
mix = (music + sfx) * (0.5 + 0.5 * np.cos(np.pi * np.clip((TT - (T['end'] - 0.6)) / 0.58, 0, 1)))[:, None]   # an even 0.6s audio fade to silence on the last frame
meter = pyloudnorm.Meter(SR); lufs = meter.integrated_loudness(mix)
mix = mix * db(-17.0 - lufs)
thr = db(-1.2); a = np.abs(mix).max(axis=1); need = np.minimum(1, thr / np.maximum(a, 1e-9))
la = int(0.004 * SR); need = np.minimum.reduce([np.roll(need, -k) for k in range(0, la, 8)]); gr = np.copy(need)
for i in range(1, N): gr[i] = min(need[i], gr[i - 1] + (1 - gr[i - 1]) * (1 / (0.08 * SR)))
mix = mix * gr[:, None]; mix[int(SILENT * SR):] = 0
sf.write(OUT, mix.astype(np.float32), SR, subtype='PCM_24')
print(f'LUFS in {lufs:.1f} → out {meter.integrated_loudness(mix):.1f}, peak {20*np.log10(np.abs(mix).max()):.1f} dBFS, GR {20*np.log10(gr.min()):.1f} dB')
