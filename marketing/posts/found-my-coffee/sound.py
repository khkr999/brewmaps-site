"""على ذوقك ep.1 "The Ladder": music + SFX mix, built to SOUND-DESIGN.md.

Every cue time comes from the animation itself (events.js → frame the change is first on screen), so the mix
follows any timing change in reel.js. Music: composed here as MIDI, rendered with the FluidR3 GM soundfont
(sampled pizzicato, celesta, glockenspiel, bassoon, strings) via fluidsynth. SFX: synthesised here.
Usage: python3 sound.py <workdir> <out.wav>
Needs: node, fluidsynth + fluid-soundfont-gm, numpy, scipy, soundfile, mido, pyloudnorm.
"""
import json, os, subprocess, sys
import numpy as np, soundfile as sf, mido, pyloudnorm
from scipy.signal import butter, sosfilt, sosfilt_zi, fftconvolve

HERE = os.path.dirname(os.path.abspath(__file__))
E = json.loads(subprocess.run(['node', os.path.join(HERE, 'events.js')], check=True, capture_output=True, text=True).stdout)
SR = 48000
DUR = E['DUR']
N = int(DUR * SR)
SF2 = '/usr/share/sounds/sf2/FluidR3_GM.sf2'
WORK, OUT = sys.argv[1], sys.argv[2]
os.makedirs(WORK, exist_ok=True)
rng = np.random.default_rng(7)
db = lambda d: 10 ** (d / 20)
REF = db(-1)                                            # 0 dB "relative" = splash peak = −1 dBFS
FRAME = 1 / 24

# ---------------------------------------------------------------- music (MIDI → fluidsynth) -----
NAMES = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
def m(n):                                               # 'F#5' → 78
    k = NAMES[n[0]] + (1 if '#' in n else -1 if n[1] == 'b' else 0)
    return 12 * (int(n[-1]) + 1) + k

def render(name, parts, gain=0.5):
    """parts: list of (channel, program, notes[(t, dur, note, vel)], extra[(t, msg)]) → stereo array"""
    mf = mido.MidiFile(ticks_per_beat=800)
    tr = mido.MidiTrack(); mf.tracks.append(tr)
    tr.append(mido.MetaMessage('set_tempo', tempo=800000))  # 0.8 s per beat, 800 ticks per beat → 1 tick = 1 ms
    ev = []
    for ch, prog, notes, extra in parts:
        ev.append((0, 0, mido.Message('program_change', channel=ch, program=prog)))
        ev.append((0, 0, mido.Message('control_change', channel=ch, control=7, value=110)))
        for t, d, n, v in notes:
            ev.append((t, 2, mido.Message('note_on', channel=ch, note=m(n), velocity=v)))
            ev.append((t + d, 1, mido.Message('note_off', channel=ch, note=m(n), velocity=0)))
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

B1, B2 = E['badge1'], E['badge2']                       # the 24% and the 92%
WALK0, WALK1 = E['T']['walkA'], E['T']['atA']           # the sad walk
RISE_END = B2 - 2 * FRAME                               # two near-silent frames before the 92%
STOP = E['flop']                                        # the fanfare rings while he turns and smiles; silence as he falls…
SPL = E['splash']                                       # …the splash lands in that silence
M6 = SPL + 0.35                                         # then peace: slow, soft, sparse
BEAT6 = 0.76
g6 = lambda b: M6 + b * BEAT6
END = E['endCard']

# M1 · Curious, quick (0 → the 24%): sneaky staccato pizz, marimba doubling, walking pizz bass, a 0.4s beat
b1 = lambda b: B1 + b * 0.4
mel = ns([(b1(-3.3), 'A4', 62, .1), (b1(-3.12), 'C#5', 70, .1), (b1(-3), 'D5', 92), (b1(-2.5), 'A4', 70), (b1(-2), 'B4', 82), (b1(-1.75), 'C#5', 66, .1),
          (b1(-1.5), 'D5', 80), (b1(-1), 'F#5', 84), (b1(-0.5), 'E5', 66)], dur=.2)
offs = chord(b1(-2.5), .18, ['D4', 'F#4'], 52) + chord(b1(-1.5), .18, ['D4', 'G4'], 50)
mar = ns([(b1(-3), 'D5', 62, .35), (b1(-2), 'B4', 58, .35), (b1(-1.5), 'D5', 56, .35)])
bass = ns([(b1(-3), 'D2', 96, .35), (b1(-2), 'A2', 88, .35), (b1(-1), 'F#2', 84, .35)])
# M2 · Deflate: sour muted pizz cluster on the 24%, then a held soft low D that overlaps the bassoon
sour = chord(B1, .3, ['D3', 'F3', 'G#3'], 58)
held = [(B1, WALK0 + 0.45 - B1, 'D2', 58)]
# M3 · Glum: D minor lament on bassoon over the sad walk, pizz roots; low-passed below
bsn = ns([(WALK0 + 0.05 + i * 0.37, n, v, .36) for i, (n, v) in enumerate([('D3', 62), ('C3', 58), ('A#2', 56), ('A2', 60)])])
bass += ns([(WALK0 + 0.05, 'D2', 72, .3), (WALK0 + 0.42, 'C2', 64, .3), (WALK0 + 1.16, 'A1', 70, .3)])
# M4 · Hope: tremolo swell + a rising pizz run on A7, cut two frames before the 92%
trem = chord(WALK1, RISE_END - WALK1, ['A3', 'C#4', 'E4', 'A4'], 70)
trem_cc = [(WALK1 + i * (RISE_END - WALK1) / 20, mido.Message('control_change', control=11, value=int(30 + 97 * (i / 20) ** 1.5))) for i in range(21)]
mel += ns([(WALK1 + 0.02 + i * (RISE_END - WALK1 - 0.06) / 5, n, 60 + 5 * i, .08) for i, n in enumerate(['A3', 'C#4', 'E4', 'G4', 'A4', 'C#5'])])
# M5 · Bright and busy (92% → the flag): the theme in D major; chords follow the action; brand fanfare when the flag goes in
pop, plant, clicks, rungs = E['pop'], E['planted'], E['clicks'], E['rungs']
regions = [(B2, pop, 'D', ['D4', 'F#4', 'A4']), (pop, plant, 'G', ['D4', 'G4', 'B4']), (plant, rungs[0], 'A', ['C#4', 'E4', 'A4']),
           (rungs[0], rungs[2], 'G', ['D4', 'G4', 'B4']), (rungs[2], E['flagIn'], 'A', ['C#4', 'E4', 'A4']), (E['flagIn'], STOP, 'D', ['D4', 'F#4', 'A4'])]
ROOT = {'D': ('D2', 'D3'), 'G': ('G2', 'D3'), 'A': ('A2', 'E3')}
pad = []
for t0, t1, c, notes in regions:
    pad += chord(t0, t1 - t0, notes, 64 if c != 'D' or t0 == B2 else 70)
    for i, t in enumerate(np.arange(t0, t1 - 0.04, 0.25)):
        bass += [(float(t), .22, ROOT[c][i % 2], 96 if i % 2 == 0 else 74)]
mel5 = [(B2 + .25, 'F#5', 84), (B2 + .5, 'A5', 88), (B2 + .62, 'G5', 72), (B2 + .75, 'F#5', 78), (pop, 'G5', 88), (pop + .12, 'B5', 82),
        (plant, 'A5', 86)] + [(t, n, 62 + 6 * i) for i, (t, n) in enumerate(zip(clicks, ['C#5', 'E5', 'A5']))] \
       + [(t, n, 62 + 5 * i) for i, (t, n) in enumerate(zip(rungs, ['D5', 'F#5', 'G5', 'A5']))] \
       + [(E['unfurl'], 'B5', 78, .08), (E['unfurl'] + .04, 'C#6', 86, .12)]
mel += ns(mel5, dur=.2)
mel += chord(E['flagIn'], .3, ['D3', 'A3', 'F#4', 'D5'], 84)                       # the flag goes in: a little brand fanfare
glk = ns([(B2 + .25, 'F#5', 46), (B2 + .5, 'A5', 50), (pop, 'G5', 50), (plant, 'A5', 50)]
         + [(t, n, 34 + 3 * i) for i, (t, n) in enumerate(zip(rungs, ['D6', 'F#6', 'G6', 'A6']))]
         + [(E['flagIn'] + i * .05, n, 62 + 6 * i, .45) for i, n in enumerate(['A5', 'D6', 'F#6'])], dur=.3)
# M6 · Complete peace (after the splash): one soft open chord, a few slow celesta notes, a low pizz now and then. No pulse.
pad += chord(M6, END + 1.2 - M6, ['D4', 'F#4', 'A4', 'E5'], 46)
pad_cc = [(END - 0.2 + i * 0.08, mido.Message('control_change', control=11, value=int(127 * (1 - i / 19) ** 1.4))) for i in range(20)]
cel = ns([(g6(0), 'A5', 58, 1.3), (g6(1.2), 'F#5', 52, 1.1), (g6(2.4), 'E5', 50, 1.2), (g6(3.6), 'D5', 54, 1.6)])
bass += ns([(g6(0), 'D2', 60, .5), (g6(2.4), 'G2', 52, .5), (g6(3.6), 'A1', 54, .5)])
pad += chord(END + 0.45, 2.0, ['D4', 'F#4', 'A4'], 50)                                  # resolves as the end line appears
mel += chord(END + 0.45, .5, ['D3', 'A3', 'F#4', 'D5'], 60)
glk += [(END + 0.45, .5, 'D6', 34)]

music = {
    'pizz': render('m_pizz', [(0, PIZZ, mel + offs + sour, [])]),
    'bass': render('m_bass', [(1, PIZZ, bass, []), (2, CBASS, held, [])]),
    'marimba': render('m_mar', [(3, MARIMBA, mar, [])]),
    'bassoon': render('m_bsn', [(4, BASSOON, bsn, [])]),
    'strings': render('m_str', [(5, STR, pad, pad_cc), (6, TREM, trem, trem_cc)]),
    'bells': render('m_bells', [(7, GLOCK, glk, []), (8, CELESTA, cel, [])]),
}
# SFX that are notes: chime (= the logo melody, an octave up), the descending "no", bonk notes, sonic logo
fx_chime = render('fx_chime', [(0, GLOCK, ns([(B2, 'A5', 96), (B2 + .045, 'D6', 104), (B2 + .09, 'F#6', 112, .8)], dur=.6), []),
                               (1, CELESTA, ns([(B2, 'A5', 90), (B2 + .045, 'D6', 96), (B2 + .09, 'F#6', 104, .9)], dur=.6), [])])
no = E['no']
NO_NOTES = ['A3', 'G3', 'F3', 'E3'][:len(no)]
bend = [(no[-1] + 0.02 + i * 0.01, mido.Message('pitchwheel', pitch=int(-8191 * min(1, i / 20) ** 1.3))) for i in range(21)] + [(no[-1] + 0.6, mido.Message('pitchwheel', pitch=0))]
fx_desc = render('fx_desc', [(0, BASSOON, ns([(t, n, 58 - 2 * i, .14 if i < len(no) - 1 else .25) for i, (t, n) in enumerate(zip(no, NO_NOTES))]), bend)])
fx_bonknotes = render('fx_bonk', [(0, PIZZ, ns([(B1, 'F3', 100, .12), (B1 + .075, 'D3', 92, .2)]), [])])
L0 = E['endFull']; logo_t = [L0, L0 + 4 * FRAME, L0 + 8 * FRAME]
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

def ir(rt, damp):                                       # synthetic room/hall impulse response (stereo, decorrelated)
    n = int(rt * SR); t = np.arange(n) / SR; out = []
    for _ in range(2):
        r = rng.standard_normal(n) * np.exp(-6.9 * t / rt)
        r = lp(r, damp); r[:int(0.008 * SR)] *= np.linspace(0, 1, int(0.008 * SR)); out.append(r / np.sqrt(np.sum(r ** 2)))
    return np.stack(out, -1)
def reverb(x, h, wet):
    w = np.stack([fftconvolve(x[:, c], h[:, c])[:len(x)] for c in range(2)], -1)
    return x + wet * w

SFX = np.zeros((N, 2)); DRY = np.zeros((N, 2))
def place(sig, t0, rel_db, pan=0.0, bus=None):
    bus = SFX if bus is None else bus
    s = norm(sig) * REF * db(rel_db)
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
def flutter(d, rate=22, lo=300, hi=2600):               # a flag snapping open / waving: fabric with a flapping pulse
    t = tt(d); am = 0.35 + 0.65 * np.abs(np.sin(np.pi * rate * t * (1 - 0.35 * t / d)))
    return bp(noise(d), lo, hi) * am * np.minimum(1, t / 0.006) * np.exp(-t / (0.45 * d))
def wood(f, d=0.12, dec=0.03):
    return modal([f, f * 2.57, f * 4.1], [dec, dec * .5, dec * .3], [1, .5, .25], d) + 0.3 * hp(noise(d), 2000) * env(d, 0.0005, 0.003)
def glass(f=2900, d=0.35):
    return modal([f, f * 1.47, f * 2.13, f * 2.9], [0.09, 0.06, 0.04, 0.025], [1, .6, .35, .2], d, 0.02)
def sparkle(t0, d, n, f_lo, f_hi, rel, rising=False, pan=0.0):
    for i in range(n):
        u = i / max(1, n - 1)
        f = f_lo * (f_hi / f_lo) ** (u if rising else rng.uniform(0, 1))
        place(modal([f, f * 2.76], [0.08, 0.03], [1, .3], 0.25), t0 + (u * d if rising else rng.uniform(0, d)), rel - rng.uniform(0, 6), pan + rng.uniform(-.3, .3))

pan_x = lambda x: float(np.clip((x - 540) / 540 * 0.45, -0.45, 0.45))
# walk in (light steps + pouch)
for i, s in enumerate(E['steps']):
    place(step(), s['t'], -13 - (3 if i == 0 else 0), pan_x(s['x']))
    place(canvas(0.12, 40), s['t'] + 2 * FRAME, -21, pan_x(s['x'])); place(jingle(), s['t'] + 2 * FRAME, -27, pan_x(s['x']))
place(canvas(0.22, 30), E['stop'], -21, pan_x(955))
# phone up, the 24% result
place(whoosh(0.25, 500, 2600, peak=0.7), E['phone1'], -9, pan_x(930))
place(np.sin(2 * np.pi * np.cumsum(np.linspace(700, 980, int(.05 * SR))) / SR) * env(.05, .002, .015), B1, -24, pan_x(955))   # tiny badge pop
bonk_t = np.arange(int(0.3 * SR)) / SR
def bonk_tone(f):                                       # felt mallet on wood: low, round, a little pitch sag
    ph = 2 * np.pi * np.cumsum(f * (1 - 0.06 * (1 - np.exp(-bonk_t / 0.04)))) / SR
    return (np.sin(ph) + 0.25 * np.sin(2 * ph) + 0.12 * np.sin(3.9 * ph)) * env(0.3, 0.003, 0.07) + 0.15 * lp(noise(0.3), 1200) * env(0.3, 0.001, 0.006)
bonk = norm(bonk_tone(174.6)) + 0.85 * np.pad(norm(bonk_tone(146.8)), (int(0.075 * SR), 0))[:int(0.3 * SR)]
place(lp(bonk, 1800), B1, -9, pan_x(955), bus=DRY)
place(fx_bonknotes, 0, -13, bus=DRY)
# the slow "no": four soft bassoon steps down, the last one bends away
place(np.stack([lp(fx_desc[:, c], 2500) for c in range(2)], -1), 0, -13)
place(whoosh(0.2, 1800, 500, peak=0.3), E['phoneDown1'], -14, pan_x(930))
# sad walk: heavier steps + drooping pouch
for i, s in enumerate(E['sad']):
    place(step(heavy=True), s['t'], -11, pan_x(s['x']))
    if i % 2: place(canvas(0.28, 18, 600, 3000), s['t'] + 0.03, -22, pan_x(s['x']))
# riser → (two near-silent frames) → chime
r_d = RISE_END - WALK1
riser = whoosh(r_d, 800, 7000, peak=1.0, bw=0.5, curve=1.6)[:int(r_d * SR)]
shim = sum(np.sin(2 * np.pi * np.cumsum(np.full(int(r_d * SR), f) * (1 + 0.6 * tt(r_d) / r_d)) / SR) for f in (1320, 1980, 2640)) * (tt(r_d) / r_d) ** 2.5
riser = norm(riser) + 0.18 * norm(shim)
riser[-int(0.004 * SR):] *= np.linspace(1, 0, int(0.004 * SR))
place(riser, WALK1, -9, 0.05)
place(whoosh(0.25, 600, 3200, peak=0.7), E['phone2'], -10, pan_x(560))
place(fx_chime, 0, -12)
sparkle(B2 + 0.08, 0.5, 14, 3500, 9000, -15, pan=pan_x(545))
# happy hop
bt = tt(0.28)
boing = np.sin(2 * np.pi * np.cumsum(330 * (1 + 0.35 * bt / 0.28) * (1 + 0.09 * np.sin(2 * np.pi * 22 * bt) * np.exp(-bt / 0.12))) / SR) * env(0.28, 0.004, 0.09)
place(boing, E['hop'], -7, pan_x(545))
place(step(), E['hopLand'], -16, pan_x(545))
# pouch: down, pop, flap
place(canvas(0.2, 45), E['bagDown'] - 0.21, -18, pan_x(604)); place(lp(step(heavy=True), 900), E['bagDown'], -16, pan_x(604))
popfx = bp(noise(0.06), 600, 2400) * env(0.06, 0.0005, 0.006) + 0.7 * np.sin(2 * np.pi * np.cumsum(np.linspace(1250, 700, int(.06 * SR))) / SR) * env(0.06, 0.001, 0.012)
place(popfx, pop, -7, pan_x(604))
place(canvas(0.13, 30, 400, 2500), pop + 0.02, -18, pan_x(604))
# magical fwip: the ladder out of the pouch
place(whoosh(0.2, 700, 7000, peak=0.6, bw=0.45), E['ladderOut'], -6, pan_x(600))
sparkle(E['ladderOut'] + 0.03, 0.17, 9, 2600, 8000, -13, rising=True, pan=pan_x(580))
# plant against the glass
place(wood(420, 0.15, 0.035), plant, -13, pan_x(492)); place(glass(3100, 0.3), plant + 0.004, -19, pan_x(470))
# three telescoping clicks, each a tone higher; the flag snaps open on the last
for i, tc in enumerate(clicks):
    k = 2 ** (2 * i / 12)
    place(whoosh(0.07, 1500 * k, 4500 * k, peak=0.9, bw=0.3), tc - 0.07, -17, pan_x(470))
    clk = hp(noise(0.08), 3000) * env(0.08, 0.0003, 0.002) + modal([1900 * k, 3350 * k, 5100 * k], [0.03, 0.02, 0.012], [1, .6, .4], 0.08)
    place(clk, tc, -7, pan_x(470))
# rung taps, alternating, gently rising
for i, tr_ in enumerate(rungs):
    place(wood(520 * 2 ** (i / 12), 0.1, 0.025), tr_, -15, pan_x(470) + (0.06 if i % 2 else -0.06))
# at the top: a flag out of his pocket, the pole telescopes as he raises it, it snaps open, he plants it on the rim
place(canvas(0.16, 50, 600, 3500), E['pocket'] + 0.06, -19, pan_x(430))
place(whoosh(0.18, 700, 2800, peak=0.8, bw=0.5), E['pull'], -15, pan_x(420))
for i in range(3):                                      # three tiny pole clicks, rising (an echo of the ladder)
    k = 2 ** ((4 + 2 * i) / 12); tci = E['pull'] + 0.04 + i * 0.05
    place(hp(noise(0.05), 3500) * env(0.05, 0.0003, 0.0015) + modal([2600 * k, 4300 * k], [0.02, 0.012], [1, .5], 0.05), tci, -15, pan_x(420))
place(flutter(0.26), E['unfurl'], -9, pan_x(380))
wob = np.sin(2 * np.pi * np.cumsum(150 * (1 + 0.08 * np.sin(2 * np.pi * 14 * tt(0.4)))) / SR) * env(0.4, 0.003, 0.11)
place(wood(260, 0.15, 0.04), E['flagIn'], -8, pan_x(410)); place(glass(3400, 0.35), E['flagIn'] + 0.003, -15, pan_x(410))
place(wob, E['flagIn'] + 0.01, -16, pan_x(410))
# found it: a glance, he turns his back to the drink, and flops backward into it; his feet knock the ladder away
place(canvas(0.12, 40, 700, 3500), E['turn'] + 0.08, -21, pan_x(440))
flop_d = SPL - E['flop']
place(whoosh(flop_d, 1700, 380, peak=0.88, bw=0.7, curve=0.8)[:int(flop_d * SR)], E['flop'], -11, pan_x(380))
# THE SPLASH
sd = 0.7; st = tt(sd)
grain = np.zeros(len(st))
for _ in range(220):
    i = int(rng.exponential(0.09) * SR)
    b = bubble(rng.uniform(900, 3200), 0.03, 2.0)
    if i < len(st) - len(b): grain[i:i + len(b)] += b * rng.uniform(.2, 1)
plunk = np.pad(bubble(320, 0.09, 1.4, 0.03), (0, len(st) - int(0.09 * SR)))
thump = np.sin(2 * np.pi * 68 * st) * env(sd, 0.002, 0.05)
side = lambda g: 0.9 * norm(lp(noise(sd), 7000) * np.exp(-st / 0.17) * np.minimum(1, st / 0.004)) + 0.55 * norm(g) + 0.6 * plunk + 0.5 * thump
place(np.stack([norm(side(grain)) * 0.95, norm(side(np.roll(grain, 300))) * 0.9], -1), SPL, 0)
for k in range(6):                                      # ice cubes knocking
    place(glass(rng.uniform(1800, 3200), 0.25), SPL + rng.uniform(0.01, 0.28), -12 - rng.uniform(0, 6), pan_x(300) + rng.uniform(-.3, .3))
for _ in range(38):                                     # droplets falling back
    u = rng.uniform(0, 1) ** 1.6
    place(bubble(rng.uniform(1400, 3600), 0.02, 2.2), SPL + 0.09 + 0.4 * u, -14 - 8 * u - rng.uniform(0, 5), pan_x(300) + rng.uniform(-.35, .35))
# the ladder: knocked by his feet as he goes (it's gone from the frame once he lands, so no clatter)
place(wood(640, 0.08, 0.02), E['push'] + 0.03, -15, pan_x(440))
fall_d = SPL - E['push']
place(whoosh(fall_d, 250, 1100, peak=0.9, bw=0.6, curve=2.2)[:int(fall_d * SR)], E['push'], -21, pan_x(560))
# complete peace: a soft settle, then only the faintest lapping with each slow ripple
st_ = lp(noise(0.6), 800) * np.sin(np.pi * np.linspace(0, 1, int(0.6 * SR))) ** 2
for _ in range(4): b = bubble(rng.uniform(350, 700), 0.05, 1.5); o = int(rng.uniform(0.05, 0.4) * SR); st_[o:o + len(b)] += 0.4 * b
place(st_, E['settled'] - 0.15, -20, pan_x(300))
for tr0 in E['ripples']:
    lap = lp(noise(0.6), 800) * np.sin(np.pi * np.linspace(0, 1, int(0.6 * SR))) ** 2
    for _ in range(2): b = bubble(rng.uniform(350, 650), 0.05, 1.5); o = int(rng.uniform(0.1, 0.45) * SR); lap[o:o + len(b)] += 0.5 * b
    place(lap, tr0 + 0.4, -25, pan_x(280))
place(glass(3600, 0.3), E['settled'] + 1.3, -26, pan_x(300)); place(glass(3000, 0.3), E['settled'] + 2.9, -27, pan_x(300))
# brand whoosh into the end card, then the sonic logo
place(whoosh(0.95, 250, 1200, peak=0.55, bw=0.9, curve=0.8), END - 0.05, -14, 0)          # a soft swell as it washes into green
place(fx_logo, 0, -11)

# room tone: very low, clean café air
TT = np.arange(N) / SR
rt = lp(hp(noise(DUR), 120), 2500) * 0.6 + lp(noise(DUR), 300) * 0.4
fade = np.clip((E['endCard'] - TT) / 0.5, 0, 1) * np.clip(TT / 0.3, 0, 1)
room = np.stack([rt * fade, np.roll(rt, 12345) * fade], -1)
room = room / np.sqrt(np.mean(room[:SR] ** 2)) * REF * db(-42)

# ---------------------------------------------------------------- music bus ---------------------
def rms_norm(x):
    a = np.abs(x).max(axis=1); live = a > 1e-4
    return x / (np.sqrt(np.mean(x[live] ** 2)) + 1e-9) if live.any() else x
W = {'pizz': 1.0, 'bass': 0.8, 'marimba': 0.45, 'bassoon': 0.75, 'strings': 0.38, 'bells': 0.42}
mus = sum(W[k] * rms_norm(v) for k, v in music.items())
sh = np.zeros((N, 2))                                   # brushes / shaker in the bright section: 16ths, 8th accents
for i in range(int((STOP - 0.05 - B2) / 0.125) + 1):
    t0 = B2 + i * 0.125; d = 0.05
    s = hp(noise(d), 5000) * env(d, 0.004, 0.018) * (1.0 if i % 2 == 0 else 0.55)
    j = int(t0 * SR); sh[j:j + len(s)] += np.stack([s * 0.9, s * 0.7], -1)
mus = mus + 0.18 * sh / np.abs(sh).max() * np.abs(mus).max()
mus = reverb(mus, ir(1.3, 5000), 0.22)
SAD_END = E['sad'][-1]['t']
def cutoff(t):                                          # low-pass: deflate on the 24%, glum, opening back up for the 92%
    if t < B1: return 20000
    if t < B1 + 0.3: return 20000 * (1500 / 20000) ** ((t - B1) / 0.3)
    if t < WALK0: return 1500
    if t < SAD_END: return 2000
    if t < RISE_END: return 2000 * (20000 / 2000) ** ((t - SAD_END) / (RISE_END - SAD_END))
    return 20000
mus = tv_filter(mus, cutoff, 'lowpass')
ramp = lambda pts: np.interp(TT, [p[0] for p in pts], [p[1] for p in pts])
g = ramp([(0, -12), (B1 - 0.04, -12), (B1 + 0.02, -16), (WALK0 - 0.05, -16), (WALK0 + 0.05, -14), (WALK1, -14), (RISE_END, -8), (B2, -10),
          (E['flagIn'] - 0.02, -10), (E['flagIn'] + 0.02, -9), (M6, -11), (M6 + 1.0, -9), (END, -9), (END + 0.45, -10), (L0, -13), (L0 + 0.1, -16), (DUR, -16)])
gate = np.clip(TT / 0.04, 0, 1)
gate = gate * (1 - np.clip((TT - RISE_END) / 0.008, 0, 1) * (TT < B2))
gate = gate * np.where(TT < STOP, 1, np.where(TT < M6, np.clip(1 - (TT - STOP) / 0.02, 0, 1), np.clip((TT - M6) / 0.25, 0, 1)))
duck = np.zeros(N)
for t0, depth, hold in [(B1, 4, .25), (B2, 3, .3), (E['hop'], 3, .15), (pop, 3, .12), (E['ladderOut'], 3, .2)] + [(c, 2.5, .1) for c in clicks] \
        + [(E['flagIn'], 2, .2), (L0, 3, .4)]:
    a = np.clip((TT - t0) / 0.005, 0, 1) * np.where(TT < t0 + hold, 1, np.exp(-(TT - t0 - hold) / 0.25))
    duck = np.maximum(duck, depth * a)
mus = mus / np.abs(mus).max() * REF * (db(g - duck) * gate)[:, None]
SILENT = DUR - 0.2
end_fade = np.clip((SILENT - TT) / 0.6, 0, 1)[:, None]

# ---------------------------------------------------------------- final mix ---------------------
sfx = reverb(SFX, ir(0.6, 6000), 0.14) + DRY
mix = (mus + sfx + room) * end_fade
meter = pyloudnorm.Meter(SR)
lufs = meter.integrated_loudness(mix)
mix = mix * db(-17.0 - lufs)                            # aim −17 LUFS; the limiter holds the splash at −1 dBTP
thr = db(-1.2); a = np.abs(mix).max(axis=1); need = np.minimum(1, thr / np.maximum(a, 1e-9))
la = int(0.004 * SR); need = np.minimum.reduce([np.roll(need, -k) for k in range(0, la, 8)])
gr = np.copy(need)
for i in range(1, N): gr[i] = min(need[i], gr[i - 1] + (1 - gr[i - 1]) * (1 / (0.08 * SR)))
mix = mix * gr[:, None]
mix[int(SILENT * SR):] = 0
sf.write(OUT, mix.astype(np.float32), SR, subtype='PCM_24')
print(f'LUFS in {lufs:.1f} → out {meter.integrated_loudness(mix):.1f}, peak {20*np.log10(np.abs(mix).max()):.1f} dBFS, limiter max GR {20*np.log10(gr.min()):.1f} dB')
json.dump(E, open(f'{WORK}/events.json', 'w'))
