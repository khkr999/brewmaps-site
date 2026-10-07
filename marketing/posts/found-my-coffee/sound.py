"""على ذوقك ep.1 "The Ladder": music + SFX mix, built to SOUND-DESIGN.md.

Music: composed here as MIDI, rendered with the FluidR3 GM soundfont (sampled pizzicato, celesta,
glockenspiel, bassoon, strings) via fluidsynth. SFX: synthesised here, placed on exact 24 fps frames.
Usage: python3 sound.py <workdir> <out.wav>
Needs: fluidsynth + fluid-soundfont-gm, numpy, scipy, soundfile, mido, pyloudnorm.
"""
import os, subprocess, sys
import numpy as np, soundfile as sf, mido, pyloudnorm
from scipy.signal import butter, sosfilt, sosfilt_zi, fftconvolve

SR = 48000
DUR = 16.6
N = int(DUR * SR)
SF2 = '/usr/share/sounds/sf2/FluidR3_GM.sf2'
WORK, OUT = sys.argv[1], sys.argv[2]
os.makedirs(WORK, exist_ok=True)
rng = np.random.default_rng(7)
F = lambda f: f / 24                                    # frame → seconds
db = lambda d: 10 ** (d / 20)
REF = db(-1)                                            # 0 dB "relative" = splash peak = −1 dBFS

# ---------------------------------------------------------------- music (MIDI → fluidsynth) -----
NAMES = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
def m(n):                                               # 'F#5' → 78
    k = NAMES[n[0]] + (1 if '#' in n else -1 if n[1] == 'b' else 0)
    return 12 * (int(n[-1]) + 1) + k

def render(name, parts, gain=0.5):
    """parts: list of (channel, program, notes[(t, dur, note, vel)], extra[(t, msg)]) → stereo array"""
    mf = mido.MidiFile(ticks_per_beat=800)                  # 100 BPM: 1 s = 800·(100/60)… we set tempo so 1 tick = 1 ms
    tr = mido.MidiTrack(); mf.tracks.append(tr)
    tr.append(mido.MetaMessage('set_tempo', tempo=800000))  # 0.8 s per beat → 1000 ticks/s with tpb 800
    ev = []
    for ch, prog, notes, extra in parts:
        ev.append((0, 0, mido.Message('program_change', channel=ch, program=prog)))
        ev.append((0, 0, mido.Message('control_change', channel=ch, control=7, value=110)))
        for t, d, n, v in notes:
            ev.append((t, 2, mido.Message('note_on', channel=ch, note=m(n) if isinstance(n, str) else n, velocity=v)))
            ev.append((t + d, 1, mido.Message('note_off', channel=ch, note=m(n) if isinstance(n, str) else n, velocity=0)))
        for t, msg in extra:
            ev.append((t, 0, msg.copy(channel=ch)))
    ev.sort(key=lambda e: (e[0], e[1]))
    now = 0
    for t, _, msg in ev:
        tick = int(round(t * 1000)); tr.append(msg.copy(time=max(0, tick - now))); now = max(now, tick)
    tr.append(mido.MetaMessage('end_of_track', time=2000))
    mid, wav = f'{WORK}/{name}.mid', f'{WORK}/{name}.wav'
    mf.save(mid)
    subprocess.run(['fluidsynth', '-ni', '-q', '-o', 'synth.reverb.active=0', '-o', 'synth.chorus.active=0',
                    '-g', str(gain), '-r', str(SR), '-F', wav, SF2, mid], check=True, capture_output=True)
    x, sr = sf.read(wav); assert sr == SR
    out = np.zeros((N, 2)); k = min(N, len(x)); out[:k] = x[:k]
    return out

PIZZ, BASSOON, CBASS, STR, TREM, CELESTA, GLOCK, VIBES, MARIMBA = 45, 70, 43, 48, 44, 8, 9, 11, 12
def ns(seq, dur=0.25, vel=80):                          # [(t, note[, vel[, dur]])] → notes
    return [(s[0], s[3] if len(s) > 3 else dur, s[1], s[2] if len(s) > 2 else vel) for s in seq]
chord = lambda t, d, notes, v: [(t, d, n, v) for n in notes]

# M1 · Curious (0–2.05): sneaky staccato pizz, marimba doubling, walking pizz bass. Thins from 1.45.
mel = ns([(0.04, 'A4', 62, .12), (0.15, 'C#5', 70, .12), (0.25, 'D5', 92), (0.55, 'A4', 70), (0.85, 'B4', 82), (1.00, 'C#5', 66, .12),
          (1.15, 'D5', 80), (1.45, 'F#5', 84), (1.75, 'E5', 66)])
offs = chord(0.55, .2, ['D4', 'F#4'], 52) + chord(1.15, .2, ['D4', 'G4'], 50)
mar = ns([(0.25, 'D5', 62, .4), (0.85, 'B4', 58, .4), (1.15, 'D5', 56, .4)])
bass = ns([(0.25, 'D2', 96, .4), (0.85, 'A2', 88, .4), (1.45, 'F#2', 84, .4)])
# M2 · Deflate: sour muted pizz cluster on the hit, then a held soft low D (bowed)
sour = chord(2.083, .3, ['D3', 'F3', 'G#3'], 58)
held = [(2.083, 1.90, 'D2', 58)]                     # overlaps the bassoon's first note: no dropout
# M3 · Glum (half time, D minor lament): bassoon D–C–Bb–A, pizz roots, all filtered later
bsn = ns([(3.85, 'D3', 62, .58), (4.45, 'C3', 58, .58), (5.05, 'A#2', 56, .58), (5.65, 'A2', 60, .58)])
bass += ns([(3.85, 'D2', 72, .4), (4.45, 'C2', 64, .4), (5.65, 'A1', 70, .4)])
# M4 · Hope (5.75–6.21): tremolo swell + rising pizz run on A7
trem = chord(5.75, .46, ['A3', 'C#4', 'E4', 'A4'], 70)
trem_cc = [(5.75 + i * 0.023, mido.Message('control_change', control=11, value=int(30 + 97 * (i / 20) ** 1.5))) for i in range(21)]
run = ns([(5.80 + i * 0.075, n, 60 + 5 * i, .1) for i, n in enumerate(['A3', 'C#4', 'E4', 'G4', 'A4', 'C#5'])])
# M5 · Bright (6.25–9.70): theme in D major, fuller. Downbeats on the pouch pop (7.45) and the plant (8.05).
bass += ns([(F(151), 'D2', 98), (6.55, 'D3', 78), (6.85, 'A2', 90), (7.15, 'D3', 76), (7.45, 'G2', 96), (7.75, 'D3', 76),
            (8.05, 'A2', 96), (8.35, 'E3', 76), (8.65, 'G2', 92), (8.95, 'D3', 76), (9.25, 'A2', 94), (9.55, 'E3', 70, .12)], dur=.28)
pad = (chord(F(151), 1.16, ['D4', 'F#4', 'A4'], 64) + chord(7.45, .6, ['D4', 'G4', 'B4'], 64) + chord(8.05, .6, ['C#4', 'E4', 'A4'], 66)
       + chord(8.65, .6, ['D4', 'G4', 'B4'], 68) + chord(9.25, .45, ['C#4', 'E4', 'A4'], 72))
chime_t = F(151)
taps = [F(f) for f in (207, 211, 215, 219, 223, 226)]
clicks = [F(f) for f in (197, 200, 203)]
mel5 = [(6.55, 'F#5', 84), (6.85, 'A5', 88), (7.00, 'G5', 72), (7.15, 'F#5', 78), (7.458, 'G5', 88), (7.75, 'B5', 82), (7.90, 'A5', 70),
        (8.042, 'A5', 86)] + [(t, n, 62 + 6 * i) for i, (t, n) in enumerate(zip(clicks, ['C#5', 'E5', 'A5']))] \
       + [(t, n, 60 + 5 * i) for i, (t, n) in enumerate(zip(taps, ['D5', 'E5', 'F#5', 'G5', 'A5', 'B5']))] + [(9.60, 'B5', 80, .06), (9.635, 'C#6', 88, .1)]
mel += ns(mel5, dur=.22)
glk = ns([(6.55, 'F#5', 46), (6.85, 'A5', 50), (7.458, 'G5', 50), (7.75, 'B5', 46), (8.042, 'A5', 50)]
         + [(t, n, 34 + 3 * i) for i, (t, n) in enumerate(zip(taps, ['D6', 'E6', 'F#6', 'G6', 'A6', 'B6']))], dur=.3)
# M6 · Payoff (10.10–13.70): resolved and relaxed: celesta melody, pizz, soft pad. Button on 13.70.
bass += ns([(10.10, 'D2', 84), (10.70, 'A2', 74), (11.30, 'G2', 80), (11.90, 'D2', 72), (12.50, 'A1', 80), (13.10, 'A2', 72), (13.70, 'D2', 84, .6)], dur=.4)
pad += (chord(10.10, 1.2, ['D4', 'F#4', 'A4'], 56) + chord(11.30, 1.2, ['D4', 'G4', 'B4'], 56)
        + chord(12.50, 1.2, ['C#4', 'E4', 'G4', 'A4'], 56) + chord(13.70, 1.9, ['D4', 'F#4', 'A4'], 54))
pad_cc = [(13.70 + i * 0.1, mido.Message('control_change', control=11, value=int(127 * (1 - i / 19) ** 1.4))) for i in range(20)]
cel = ns([(10.10, 'D5', 70, .3), (10.40, 'F#5', 72, .3), (10.70, 'A5', 80, .6), (11.30, 'B5', 76, .3), (11.60, 'A5', 70, .3), (11.90, 'G5', 72, .6),
          (12.50, 'E5', 70, .3), (12.80, 'F#5', 70, .3), (13.10, 'G5', 74, .3), (13.40, 'E5', 66, .3), (13.70, 'D5', 78, 1.2), (13.70, 'A5', 60, 1.2)])
mel += ns([(10.10, 'D5', 56), (10.70, 'A4', 50), (11.30, 'B4', 52), (11.90, 'G4', 50), (12.50, 'E4', 50), (13.10, 'G4', 50)])
mel += chord(13.70, .5, ['D3', 'A3', 'F#4', 'D5'], 72)                                              # the button
glk += [(13.70, .5, 'D6', 40)]

music = {
    'pizz': render('m_pizz', [(0, PIZZ, mel + offs + sour, [])]),
    'bass': render('m_bass', [(1, PIZZ, bass, []), (2, CBASS, held, [])]),
    'marimba': render('m_mar', [(3, MARIMBA, mar, [])]),
    'bassoon': render('m_bsn', [(4, BASSOON, bsn, [])]),
    'strings': render('m_str', [(5, STR, pad, pad_cc), (6, TREM, trem, trem_cc)]),
    'bells': render('m_bells', [(7, GLOCK, glk, []), (8, CELESTA, cel, [])]),
}
# SFX that are notes: chime (= the logo melody, an octave up), descending "no", bonk notes, sonic logo
fx_chime = render('fx_chime', [(0, GLOCK, ns([(chime_t, 'A5', 96), (chime_t + .045, 'D6', 104), (chime_t + .09, 'F#6', 112, .8)], dur=.6), []),
                               (1, CELESTA, ns([(chime_t, 'A5', 90), (chime_t + .045, 'D6', 96), (chime_t + .09, 'F#6', 104, .9)], dur=.6), [])])
desc_t = [F(f) for f in (59, 64, 69, 74)]
bend = [(3.10 + i * 0.01, mido.Message('pitchwheel', pitch=int(-8191 * min(1, i / 20) ** 1.3))) for i in range(21)] + [(3.6, mido.Message('pitchwheel', pitch=0))]
fx_desc = render('fx_desc', [(0, BASSOON, ns([(desc_t[0], 'A3', 58, .16), (desc_t[1], 'G3', 56, .16), (desc_t[2], 'F3', 54, .16), (desc_t[3], 'E3', 56, .25)]), bend)])
fx_bonknotes = render('fx_bonk', [(0, PIZZ, ns([(F(50), 'F3', 100, .12), (F(50) + .075, 'D3', 92, .2)]), [])])
logo_t = [F(343), F(347), F(350)]
fx_logo = render('fx_logo', [(0, CELESTA, ns([(logo_t[0], 'A4', 96, .5), (logo_t[1], 'D5', 100, .5), (logo_t[2], 'F#5', 106, 1.3)]), []),
                             (1, VIBES, ns([(logo_t[0], 'A4', 70, .5), (logo_t[1], 'D5', 74, .5), (logo_t[2], 'F#5', 80, 1.3)]), []),
                             (2, PIZZ, ns([(logo_t[0], 'A3', 54, .2), (logo_t[1], 'D4', 56, .2), (logo_t[2], 'F#4', 58, .3)]), [])])

# ---------------------------------------------------------------- DSP helpers ------------------
def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], 'bandpass', fs=SR, output='sos'), x)
def lp(x, f, order=2): return sosfilt(butter(order, f, 'lowpass', fs=SR, output='sos'), x)
def hp(x, f, order=2): return sosfilt(butter(order, f, 'highpass', fs=SR, output='sos'), x)
def tv_filter(x, fc_of_t, kind='lowpass', block=256, t0=0.0, q_bw=None):
    """time-varying filter (mono or stereo), coefficients updated per block"""
    x = np.atleast_2d(x.T).T if x.ndim == 1 else x
    y = np.zeros_like(x); zi = None
    for s in range(0, len(x), block):
        fc = float(np.clip(fc_of_t(t0 + s / SR), 30, SR / 2 - 500))
        if kind == 'bandpass':
            bw = q_bw or 0.6
            sos = butter(2, [fc / (1 + bw), min(fc * (1 + bw), SR / 2 - 100)], 'bandpass', fs=SR, output='sos')
        else:
            sos = butter(2, fc, kind, fs=SR, output='sos')
        if zi is None: zi = np.stack([sosfilt_zi(sos) * 0 for _ in range(x.shape[1])], -1)
        seg = x[s:s + block]
        out = np.zeros_like(seg)
        for c in range(x.shape[1]):
            out[:, c], zi[..., c] = sosfilt(sos, seg[:, c], zi=zi[..., c])
        y[s:s + block] = out
    return y
def tt(d): return np.arange(int(d * SR)) / SR
def env(d, a=0.002, decay=0.05, shape=1.0):
    t = tt(d); e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-np.maximum(0, t - a) / decay)
    return e ** shape
def norm(x): p = np.max(np.abs(x)); return x / p if p > 0 else x
def noise(d): return rng.standard_normal(int(d * SR))
def modal(freqs, decays, amps, d, jitter=0.0):
    t = tt(d); return sum(a * np.sin(2 * np.pi * f * (1 + jitter * rng.uniform(-1, 1)) * t + rng.uniform(0, 6)) * np.exp(-t / dc) for f, dc, a in zip(freqs, decays, amps))
def bubble(f0, d=0.03, rise=2.5, decay=None):          # Minnaert bubble: a sine whose pitch rises as it dies away
    t = tt(d); decay = decay or d / 3
    f = f0 * (1 + rise * t / d); ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t / decay) * np.minimum(1, t / 0.0015)

def ir(rt, damp, wet_lr=0.3):                           # synthetic room/hall impulse response (stereo, decorrelated)
    n = int(rt * SR); t = np.arange(n) / SR; out = []
    for _ in range(2):
        r = rng.standard_normal(n) * np.exp(-6.9 * t / rt)
        r = lp(r, damp); r[:int(0.008 * SR)] *= np.linspace(0, 1, int(0.008 * SR)); out.append(r / np.sqrt(np.sum(r ** 2)))
    return np.stack(out, -1)
def reverb(x, h, wet):
    w = np.stack([fftconvolve(x[:, c], h[:, c])[:len(x)] for c in range(2)], -1)
    return x + wet * w

SFX = np.zeros((N, 2)); DRY = np.zeros((N, 2))
def place(sig, t0, rel_db, pan=0.0, bus=None, peak_norm=True):
    bus = SFX if bus is None else bus
    s = norm(sig) if peak_norm else sig
    s = s * REF * db(rel_db)
    if s.ndim == 1:
        th = (pan + 1) * np.pi / 4; s = np.stack([s * np.cos(th), s * np.sin(th)], -1)
    i = int(round(t0 * SR)); k = min(len(s), N - i)
    if k > 0: bus[i:i + k] += s[:k]

# ---------------------------------------------------------------- SFX ---------------------------
def step(heavy=False):
    d = 0.16 if heavy else 0.09
    tap = bp(noise(d), 500 if heavy else 1400, 2200 if heavy else 5200) * env(d, 0.0015, 0.018 if heavy else 0.012)
    thump = np.sin(2 * np.pi * (85 if heavy else 150) * tt(d)) * env(d, 0.002, 0.03 if heavy else 0.018)
    s = tap + (0.9 if heavy else 0.5) * thump
    if heavy:                                           # heel scuff / drag
        sc = bp(noise(d), 700, 2600) * np.sin(np.pi * np.clip((tt(d) - 0.03) / 0.12, 0, 1)) ** 2
        s = s + 0.35 * norm(sc)
    return s
def canvas(d, density=60, lo=900, hi=5000):            # crinkly fabric: band noise with granular flutter
    g = np.zeros(int(d * SR))
    for _ in range(int(density * d)):
        i = rng.integers(0, len(g)); L = int(rng.uniform(0.004, 0.02) * SR); w = np.hanning(L) * rng.uniform(.3, 1)
        g[i:i + L] += w[:len(g) - i]
    shape = np.sin(np.pi * np.linspace(0, 1, len(g))) ** 0.7
    return bp(noise(d), lo, hi) * (0.25 + g) * shape
def jingle():
    return modal([3150, 4420, 5870, 7300], [0.03, 0.025, 0.02, 0.015], [1, .7, .5, .3], 0.12, 0.03)
def whoosh(d, f0, f1, peak=0.6, bw=0.7, curve=1.0):
    x = noise(d + 0.05)
    y = tv_filter(x, lambda t: f0 * (f1 / f0) ** min(1, (t / d) ** curve), 'bandpass', q_bw=bw)[:, 0]
    t = tt(d + 0.05); e = np.where(t < peak * d, (t / (peak * d)) ** 2, np.exp(-(t - peak * d) / (0.25 * d)))
    return y * e
def wood(f, d=0.12, dec=0.03):
    s = modal([f, f * 2.57, f * 4.1], [dec, dec * .5, dec * .3], [1, .5, .25], d) + 0.3 * hp(noise(d), 2000) * env(d, 0.0005, 0.003)
    return s
def glass(f=2900, d=0.35, a=1.0):
    return a * modal([f, f * 1.47, f * 2.13, f * 2.9], [0.09, 0.06, 0.04, 0.025], [1, .6, .35, .2], d, 0.02)
def sparkle(t0, d, n, f_lo, f_hi, rel, rising=False, pan=0.0):
    for i in range(n):
        u = i / max(1, n - 1)
        f = f_lo * (f_hi / f_lo) ** (u if rising else rng.uniform(0, 1))
        tone = modal([f, f * 2.76], [0.08, 0.03], [1, .3], 0.25)
        place(tone, t0 + (u * d if rising else rng.uniform(0, d)), rel - rng.uniform(0, 6), pan + rng.uniform(-.3, .3))

pan_x = lambda x: float(np.clip((x - 540) / 540 * 0.45, -0.45, 0.45))
# walk in (light steps + pouch)
for f, x in zip((3, 11, 23), (1150, 1060, 980)):
    place(step(), F(f), -13 - (3 if f == 3 else 0), pan_x(x))
    place(canvas(0.12, 40), F(f) + F(2), -21, pan_x(x)); place(jingle(), F(f) + F(2), -27, pan_x(x))
place(canvas(0.22, 30), 1.50, -21, pan_x(955))
# phone up, the 24% result
place(whoosh(0.25, 500, 2600, peak=0.7), F(41), -9, pan_x(930))
place(np.sin(2 * np.pi * np.cumsum(np.linspace(700, 980, int(.05 * SR))) / SR) * env(.05, .002, .015), F(50), -24, pan_x(955))   # tiny badge pop
bonk_t = np.arange(int(0.3 * SR)) / SR
def bonk_tone(f):                                       # felt mallet on wood: low, round, a little pitch sag
    ph = 2 * np.pi * np.cumsum(f * (1 - 0.06 * (1 - np.exp(-bonk_t / 0.04)))) / SR
    return (np.sin(ph) + 0.25 * np.sin(2 * ph) + 0.12 * np.sin(3.9 * ph)) * env(0.3, 0.003, 0.07) + 0.15 * lp(noise(0.3), 1200) * env(0.3, 0.001, 0.006)
bonk = norm(bonk_tone(174.6)) + 0.85 * np.pad(norm(bonk_tone(146.8)), (int(0.075 * SR), 0))[:int(0.3 * SR)]
place(lp(bonk, 1800), F(50), -9, pan_x(955), bus=DRY)
place(fx_bonknotes, 0, -13, bus=DRY)                    # (already stereo; level set via peak below)
# the slow "no": four soft bassoon steps down, the last one bends away
place(np.stack([lp(fx_desc[:, c], 2500) for c in range(2)], -1), 0, -13)
# phone down
place(whoosh(0.2, 1800, 500, peak=0.3), F(75), -14, pan_x(930))
# sad walk: heavier steps + drooping pouch
sad = (90, 98, 104, 110, 115, 122, 130)
for i, f in enumerate(sad):
    x = 955 + (545 - 955) * i / 6
    place(step(heavy=True), F(f), -11, pan_x(x))
    if i % 2: place(canvas(0.28, 18, 600, 3000), F(f) + 0.03, -22, pan_x(x))
# riser → (silent frame) → chime
r_d = F(149) - 5.75
riser = whoosh(r_d, 800, 7000, peak=1.0, bw=0.5, curve=1.6)[:int(r_d * SR)]
shim = sum(np.sin(2 * np.pi * np.cumsum(np.full(int(r_d * SR), f) * (1 + 0.6 * tt(r_d) / r_d)) / SR) for f in (1320, 1980, 2640)) * (tt(r_d) / r_d) ** 2.5
riser = norm(riser) + 0.18 * norm(shim)
riser[-int(0.004 * SR):] *= np.linspace(1, 0, int(0.004 * SR))
place(riser, 5.75, -9, 0.05)
place(whoosh(0.25, 600, 3200, peak=0.7), F(141), -10, pan_x(560))
place(fx_chime, 0, -12)
sparkle(chime_t + 0.08, 0.5, 14, 3500, 9000, -15, pan=pan_x(545))
# happy hop
bt = tt(0.28)
boing = np.sin(2 * np.pi * np.cumsum(330 * (1 + 0.35 * bt / 0.28) * (1 + 0.09 * np.sin(2 * np.pi * 22 * bt) * np.exp(-bt / 0.12))) / SR) * env(0.28, 0.004, 0.09)
place(boing, F(159), -7, pan_x(545))
place(step(), F(166), -16, pan_x(545))
# pouch: down, pop, flap
place(canvas(0.2, 45), 7.20, -18, pan_x(604)); place(lp(step(heavy=True), 900), F(178), -16, pan_x(604))
pop = bp(noise(0.06), 600, 2400) * env(0.06, 0.0005, 0.006) + 0.7 * np.sin(2 * np.pi * np.cumsum(np.linspace(1250, 700, int(.06 * SR))) / SR) * env(0.06, 0.001, 0.012)
place(pop, F(179), -7, pan_x(604))
place(canvas(0.13, 30, 400, 2500), F(179) + 0.02, -18, pan_x(604))
# magical fwip
place(whoosh(0.2, 700, 7000, peak=0.6, bw=0.45), F(183), -6, pan_x(600))
sparkle(F(183) + 0.03, 0.17, 9, 2600, 8000, -13, rising=True, pan=pan_x(580))
# plant against the glass
place(wood(420, 0.15, 0.035), F(193), -13, pan_x(492)); place(glass(3100, 0.3), F(193) + 0.004, -19, pan_x(470))
# three telescoping clicks, each a tone higher
for i, f in enumerate((197, 200, 203)):
    k = 2 ** (2 * i / 12)
    place(whoosh(0.07, 1500 * k, 4500 * k, peak=0.9, bw=0.3), F(f) - 0.07, -17, pan_x(470))
    clk = hp(noise(0.08), 3000) * env(0.08, 0.0003, 0.002) + modal([1900 * k, 3350 * k, 5100 * k], [0.03, 0.02, 0.012], [1, .6, .4], 0.08)
    place(clk, F(f), -7, pan_x(470))
# rung taps, alternating, gently rising
for i, f in enumerate((207, 211, 215, 219, 223, 226)):
    place(wood(520 * 2 ** (i / 12), 0.1, 0.025), F(f), -15, pan_x(470) + (0.06 if i % 2 else -0.06))
# hop over the rim
place(whoosh(0.12, 900, 2400, peak=0.5), F(231), -14, pan_x(420))
# THE SPLASH (9.958)
S0 = F(239); sd = 0.7; st = tt(sd)
body = lp(noise(sd), 7000) * (np.minimum(1, st / 0.004) * np.exp(-st / 0.17))
grain = np.zeros(len(st))
for _ in range(220):
    i = int(rng.exponential(0.09) * SR)
    b = bubble(rng.uniform(900, 3200), 0.03, 2.0)
    if i < len(st) - len(b): grain[i:i + len(b)] += b * rng.uniform(.2, 1)
plunk = bubble(320, 0.09, 1.4, 0.03) * 1.0
thump = np.sin(2 * np.pi * 68 * st) * env(sd, 0.002, 0.05)
splash = 0.9 * norm(body) + 0.55 * norm(grain) + 0.6 * np.pad(plunk, (0, len(st) - len(plunk))) + 0.5 * thump
sL = splash; sR = 0.9 * norm(0.9 * norm(lp(noise(sd), 7000) * np.exp(-st / 0.17) * np.minimum(1, st / 0.004)) + 0.55 * norm(np.roll(grain, 300)) + 0.6 * np.pad(plunk, (0, len(st) - len(plunk))) + 0.5 * thump)
place(np.stack([norm(sL) * 0.95, sR], -1), S0, 0)
for k in range(6):                                      # ice cubes knocking
    place(glass(rng.uniform(1800, 3200), 0.25), S0 + rng.uniform(0.01, 0.28), -12 - rng.uniform(0, 6), pan_x(300) + rng.uniform(-.3, .3))
# droplets fall back, muffled bubbles while he's under
for _ in range(38):
    tdrop = 10.05 + 0.4 * rng.uniform(0, 1) ** 1.6
    place(bubble(rng.uniform(1400, 3600), 0.02, 2.2), tdrop, -14 - 8 * (tdrop - 10.05) / 0.4 - rng.uniform(0, 5), pan_x(300) + rng.uniform(-.35, .35))
for _ in range(9):
    place(lp(bubble(rng.uniform(260, 620), 0.05, 1.8), 1200), rng.uniform(10.02, 10.19), -16 - rng.uniform(0, 5), pan_x(300))
# surfaces: shloop + two ice clinks
shl = whoosh(0.22, 1800, 400, peak=0.25, bw=0.6); b = bubble(500, 0.08, 1.6); o = int(0.03 * SR); shl[o:o + len(b)] += 0.6 * b
place(shl, F(245), -13, pan_x(300))
place(glass(2600, 0.25), 10.25, -18, pan_x(320)); place(glass(3300, 0.25), 10.33, -20, pan_x(280))
for f in (258, 262):                                    # two tiny wet leg-flops on the rim
    fl = lp(noise(0.06), 1500) * env(0.06, 0.002, 0.015); b = bubble(700, 0.04, 1.5); fl[:len(b)] += 0.4 * b
    place(fl, F(f), -17, pan_x(380))
place(glass(3600, 0.3), 11.6, -24, pan_x(300)); place(glass(3000, 0.3), 12.8, -25, pan_x(300))
# brand whoosh into the end card, then the sonic logo
bw_d = 0.55
place(whoosh(bw_d, 300, 1800, peak=(F(329) - 13.45) / bw_d, bw=0.8, curve=0.8), 13.45, -8, 0)
place(fx_logo, 0, -11)

# room tone: very low, clean café air
rt = lp(hp(noise(DUR), 120), 2500) * 0.6 + lp(noise(DUR), 300) * 0.4
fade = np.clip((13.7 - np.arange(N) / SR) / 0.5, 0, 1) * np.clip(np.arange(N) / SR / 0.3, 0, 1)
room = np.stack([rt * fade, np.roll(rt, 12345) * fade], -1)
room = room / np.sqrt(np.mean(room[:SR] ** 2)) * REF * db(-42)

# ---------------------------------------------------------------- music bus ---------------------
def rms_norm(x):
    a = np.abs(x).max(axis=1); live = a > 1e-4
    return x / (np.sqrt(np.mean(x[live] ** 2)) + 1e-9) if live.any() else x
W = {'pizz': 1.0, 'bass': 0.8, 'marimba': 0.45, 'bassoon': 0.75, 'strings': 0.38, 'bells': 0.42}
mus = sum(W[k] * rms_norm(v) for k, v in music.items())
# brushes / shaker, M5 only: 16ths with 8th accents
sh = np.zeros((N, 2))
for i in range(int((9.62 - 6.25) / 0.15) + 1):
    t0 = 6.25 + i * 0.15; d = 0.06
    s = hp(noise(d), 5000) * env(d, 0.004, 0.018) * (1.0 if i % 2 == 0 else 0.55)
    j = int(t0 * SR); sh[j:j + len(s)] += np.stack([s * 0.9, s * 0.7], -1)
mus = mus + 0.18 * sh / np.abs(sh).max() * np.abs(mus).max()
mus = reverb(mus, ir(1.3, 5000), 0.22)
# low-pass automation: deflate (2.05), glum, opening back up for the 92%
def cutoff(t):
    if t < 2.05: return 20000
    if t < 2.35: return 20000 * (1500 / 20000) ** ((t - 2.05) / 0.3)
    if t < 3.35: return 1500
    if t < 5.43: return 2000
    if t < 6.20: return 2000 * (20000 / 2000) ** ((t - 5.43) / 0.77)
    return 20000
mus = tv_filter(mus, cutoff, 'lowpass')
# section gains (dB, relative), hard cuts, ducking
T = np.arange(N) / SR
def ramp(t, pts):
    return np.interp(t, [p[0] for p in pts], [p[1] for p in pts])
g = ramp(T, [(0, -12), (2.04, -12), (2.10, -16), (3.30, -16), (3.40, -14), (5.75, -14), (6.20, -8), (6.29, -10), (9.70, -10),
             (10.10, -11), (10.90, -8), (13.65, -8), (13.75, -12), (14.25, -12), (14.35, -16), (16.6, -16)])
gate = np.ones(N)
gate *= np.clip(T / 0.04, 0, 1)
gate *= 1 - np.clip((T - F(149)) / 0.008, 0, 1) * (T < chime_t)          # two near-silent frames before the chime
gate *= np.where(T < 9.70, 1, np.where(T < 10.10, np.clip(1 - (T - 9.70) / 0.02, 0, 1), np.clip((T - 10.10) / 0.25, 0, 1)))
duck = np.zeros(N)
for t0, depth, hold in [(F(50), 4, .25), (chime_t, 3, .3), (F(159), 3, .15), (F(179), 3, .12), (F(183), 3, .2), (F(197), 2.5, .1), (F(200), 2.5, .1),
                        (F(203), 2.5, .1), (F(329) - .1, 3, .25)]:
    a = np.clip((T - t0) / 0.005, 0, 1) * np.where(T < t0 + hold, 1, np.exp(-(T - t0 - hold) / 0.25))
    duck = np.maximum(duck, depth * a)
mus_peak = np.abs(mus).max()
mus = mus / mus_peak * REF * (db(g - duck) * gate)[:, None]
end_fade = np.clip((16.40 - T) / 0.6, 0, 1)[:, None]

# ---------------------------------------------------------------- final mix ---------------------
sfx = reverb(SFX, ir(0.6, 6000), 0.14) + DRY
mix = (mus + sfx + room) * end_fade
meter = pyloudnorm.Meter(SR)
lufs = meter.integrated_loudness(mix)
mix = mix * db(-17.0 - lufs)                             # aim −17 LUFS; the limiter holds the splash at −1 dBTP
thr = db(-1.2); a = np.abs(mix).max(axis=1); need = np.minimum(1, thr / np.maximum(a, 1e-9))
la = int(0.004 * SR); need = np.minimum.reduce([np.roll(need, -k) for k in range(0, la, 8)])
gr = np.copy(need)
for i in range(1, N): gr[i] = min(need[i], gr[i - 1] + (1 - gr[i - 1]) * (1 / (0.08 * SR)))
mix = mix * gr[:, None]
mix[int(16.40 * SR):] = 0
sf.write(OUT, mix.astype(np.float32), SR, subtype='PCM_24')
print(f'LUFS in {lufs:.1f} → out {meter.integrated_loudness(mix):.1f}, peak {20*np.log10(np.abs(mix).max()):.1f} dBFS, limiter max GR {20*np.log10(gr.min()):.1f} dB')
np.save(f'{WORK}/stems.npy', np.stack([mus.mean(1), sfx.mean(1)], 0)[:, ::40])
