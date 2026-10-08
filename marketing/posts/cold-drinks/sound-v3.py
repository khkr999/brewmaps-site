"""على ذوقك · "Cold drinks" v3: the mix. The calm v1 bed through the drinks and the question (celesta + soft strings,
no pulse, a new chord and an ice clink on every cut, faint fizz), then the v2 ending: a whoosh into the bridge with its
four ice ticks and a sub pulse, thinner keys under the product moment, typing ticks, the result tone, the card's swell
and the BrewMaps sonic logo. Cut times come from timing.js, so picture and sound always agree.
Usage: python3 sound.py <workdir> <out.wav>
"""
import json, os, subprocess, sys
import numpy as np, soundfile as sf, mido, pyloudnorm
from scipy.signal import butter, sosfilt, fftconvolve

HERE = os.path.dirname(os.path.abspath(__file__))
TM = json.loads(subprocess.run(['node', '-e', "const m=require(process.argv[1]);console.log(JSON.stringify(m))", os.path.join(HERE, 'timing.js')], check=True, capture_output=True, text=True).stdout)
SHOT, N_SHOTS, T, APP, BEAT = TM['SHOT'], len(TM['SHOTS']), TM['T'], TM['APP'], TM['BEAT']
SR = 48000; DUR = T['end']; N = int(DUR * SR)
SF2 = '/usr/share/sounds/sf2/FluidR3_GM.sf2'
WORK, OUT = sys.argv[1], sys.argv[2]; os.makedirs(WORK, exist_ok=True)
rng = np.random.default_rng(11)
db = lambda d: 10 ** (d / 20); REF = db(-1)
cuts = [i * SHOT for i in range(N_SHOTS)]
flashes = [T['bridge'] + i * BEAT / 2 for i in range(4)]

# ---------------------------------------------------------------- music -------------------------
# New track: a warm, understated groove on the cut grid (BEAT = half a shot, so every cut is a downbeat). Electric piano
# comping, a soft upright-ish bass on the roots, a brushed shaker on 8ths with a rim click on 2 and 4, and a sparse vibes
# motif answering each cut. One chord per drink; the question lifts; the bridge pumps; the product thins to EP and bass;
# the card resolves to D with the BrewMaps sonic logo.
NAMES = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
def m(n): return 12 * (int(n[-1]) + 1) + NAMES[n[0]] + (1 if '#' in n else -1 if n[1] == 'b' else 0)
def render(name, parts, gain=0.5):
    mf = mido.MidiFile(ticks_per_beat=800); tr = mido.MidiTrack(); mf.tracks.append(tr)
    tr.append(mido.MetaMessage('set_tempo', tempo=800000))
    ev = []
    for ch, prog, notes, extra in parts:
        ev += [(0, 0, mido.Message('program_change', channel=ch, program=prog)), (0, 0, mido.Message('control_change', channel=ch, control=7, value=110))]
        for t, d, n, v in notes: ev += [(t, 2, mido.Message('note_on', channel=ch, note=m(n), velocity=v)), (t + d, 1, mido.Message('note_off', channel=ch, note=m(n), velocity=0))]
        for t, msg in extra: ev.append((t, 0, msg.copy(channel=ch)))
    ev.sort(key=lambda e: (e[0], e[1])); now = 0
    for t, _, msg in ev: tick = int(round(t * 1000)); tr.append(msg.copy(time=max(0, tick - now))); now = max(now, tick)
    tr.append(mido.MetaMessage('end_of_track', time=2000)); mid, wav = f'{WORK}/{name}.mid', f'{WORK}/{name}.wav'; mf.save(mid)
    subprocess.run(['fluidsynth', '-ni', '-q', '-o', 'synth.reverb.active=0', '-o', 'synth.chorus.active=0', '-g', str(gain), '-r', str(SR), '-F', wav, SF2, mid], check=True, capture_output=True)
    x, _ = sf.read(wav); out = np.zeros((N, 2)); k = min(N, len(x)); out[:k] = x[:k]; return out
chord = lambda t, d, notes, v: [(t, d, n, v) for n in notes]
STR, CELESTA, VIBES, PIZZ, PAD, ABASS = 48, 8, 11, 45, 89, 32
B = BEAT
# The calm bed from before (celesta + soft strings), kept, with the sync made audible: a soft pizz pulse on the beat
# grid (BEAT = half a shot, so every cut is a downbeat) and a low bass note on each cut. One open chord per drink,
# a lift on the question, pumping through the bridge, thinner under the phone, fading out at the end.
CH = [['D4', 'F#4', 'A4', 'E5'], ['B3', 'D4', 'F#4', 'E5'], ['G3', 'D4', 'F#4', 'A4'], ['A3', 'C#4', 'E4', 'G4'], ['D4', 'F#4', 'A4', 'C#5']]
ROOT = ['D2', 'B1', 'G1', 'A1', 'D2']
pad, cel, pz, bass = [], [], [], []
for i, t in enumerate(cuts):
    pad += chord(t + 0.02, SHOT + 0.3, CH[i], 44)
    cel += [(t + 0.05, 1.4, CH[i][-1], 56), (t + B, 1.0, CH[i][1], 42)]
    bass += [(t, 1.1, ROOT[i], 70)]
    for k in range(4): pz.append((t + k * B / 2, 0.18, CH[i][k % 3], 46 if k % 2 == 0 else 32))     # the pulse: pizz on 8ths, accents on the beat
tq = T['question']                                                                                   # the question: a lift
pad += chord(tq + 0.02, 2 * B + 0.3, ['E4', 'G4', 'B4', 'D5'], 46); cel += [(tq + 0.3, 1.4, 'B5', 58), (tq + B, 1.0, 'G5', 46)]
bass += [(tq, 1.1, 'E1', 72)]
for k in range(4): pz.append((tq + k * B / 2, 0.18, ['E4', 'G4', 'B4'][k % 3], 44 if k % 2 == 0 else 30))
tb = T['bridge']                                                                                     # the bridge: pumping on 8ths
pad += chord(tb + 0.02, 2 * B + 0.1, ['A3', 'D4', 'E4', 'G4'], 48)
for k in range(4): bass.append((tb + k * B / 2, 0.22, 'A1', 78 - 5 * k)); pz.append((tb + k * B / 2, 0.15, ['A4', 'D5', 'E5', 'G5'][k], 56 - 4 * k))
tp = T['product']                                                                                    # the phone: thinner, slow
pad += chord(tp, T['card'] - tp + 0.6, ['D4', 'F#4', 'A4', 'E5'], 42)
cel += [(tp + B, 1.3, 'A5', 46), (tp + 3 * B, 1.3, 'F#5', 42), (tp + 5 * B, 1.6, 'E5', 40), (tp + 7 * B, 1.6, 'D5', 40)]
bass += [(tp, 1.4, 'D2', 60), (tp + 4 * B, 1.4, 'D2', 54)]
for k in range(int((T['card'] - tp) / B)): pz.append((tp + k * B, 0.18, ['D4', 'A4', 'F#4'][k % 3], 34))   # the pulse eases to quarter notes
pad_cc = [(T['card'] - 0.1 + i * 0.04, mido.Message('control_change', control=11, value=int(127 * (1 - i / 19) ** 1.2))) for i in range(20)]
vib = [(T['result'] + 0.02, 0.8, 'A5', 48)]
music = (render('m_pad', [(0, STR, pad, pad_cc)]) * 0.9 + render('m_cel', [(1, CELESTA, cel, [])]) * 0.55
         + render('m_pz', [(2, PIZZ, pz, [])]) * 0.6 + render('m_bass', [(3, ABASS, bass, [])]) * 0.7 + render('m_vib', [(4, VIBES, vib, [])]) * 0.5)
L0 = T['card'] + 0.4; logo_t = [L0, L0 + 5 / 24, L0 + 10 / 24]
fx_logo = render('fx_logo', [(0, CELESTA, [(logo_t[0], .5, 'A4', 96), (logo_t[1], .5, 'D5', 100), (logo_t[2], 1.1, 'F#5', 106)], []),
                             (1, VIBES, [(logo_t[0], .5, 'A4', 70), (logo_t[1], .5, 'D5', 74), (logo_t[2], 1.1, 'F#5', 80)], []),
                             (2, PIZZ, [(logo_t[0], .2, 'A3', 54), (logo_t[1], .2, 'D4', 56), (logo_t[2], .3, 'F#4', 58)], [])])
fx_result = render('fx_result', [(0, CELESTA, [(T['result'], .6, 'D6', 70), (T['result'] + 0.1, .9, 'A6', 76)], [])])

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
    if s.ndim == 1: th = (pan + 1) * np.pi / 4; s = np.stack([s * np.cos(th), s * np.sin(th)], -1)
    i = int(round(t0 * SR)); k = min(len(s), N - i)
    if k > 0: SFX[i:i + k] += s[:k]

# the opening: an ice clink on every cut, faint fizz and ice-settle underneath
for i, t in enumerate(cuts):
    f = [2300, 2700, 1900, 2500, 2100][i]
    place(glass(f, 0.5), t + 0.02, -9, rng.uniform(-.2, .2)); place(glass(f * 1.19, 0.35), t + 0.07, -14, rng.uniform(-.2, .2))
for i, t in enumerate(cuts):
    d = SHOT
    fz = hp(noise(d), 5000) * (0.5 + 0.5 * rng.uniform(0, 1, int(d * SR)) ** 6)
    for _ in range(int(14 * d)): b = bubble(rng.uniform(1800, 4200), 0.02, 2.2); o = int(rng.uniform(0, d - 0.05) * SR); fz[o:o + len(b)] += 2.5 * b
    place(fz * np.minimum(1, tt(d) / 0.3), t, -31, rng.uniform(-.3, .3))
    if rng.uniform() < 0.8: place(glass(rng.uniform(2600, 3400), 0.4), t + rng.uniform(0.6, d - 0.2), -24, rng.uniform(-.4, .4))
# the ending: whoosh into the bridge, four ice ticks and a soft thump each, into the product, typing, the result tone
kick = lambda: np.sin(2 * np.pi * np.cumsum(np.linspace(150, 48, int(0.25 * SR))) / SR) * env(0.25, 0.002, 0.07)
# the question: an ice cube dropped into a glass (plunk, two knocks, a settle), then a soft whoosh
def icedrop(t0):
    place(bubble(260, 0.1, 1.3), t0, -11, 0.0); place(glass(2400, 0.4), t0 + 0.012, -10, -0.1)
    place(glass(1900, 0.5), t0 + 0.09, -13, 0.15); place(glass(2900, 0.3), t0 + 0.16, -16, -0.2)
    st = lp(noise(0.5), 3000) * env(0.5, 0.02, 0.12)
    for _ in range(6): b = bubble(rng.uniform(900, 2000), 0.03, 2.0); o = int(rng.uniform(0.05, 0.4) * SR); st[o:o + len(b)] += 2.0 * b
    place(st, t0 + 0.05, -21, 0.1)
icedrop(T['question'] + 0.25); place(whoosh(0.7, 400, 2200, 0.45), T['question'] - 0.1, -18)
place(whoosh(BEAT, 400, 3200, 0.3), T['bridge'] - 0.1, -16)
for k, t in enumerate(flashes): place(glass(3000 + 300 * k, 0.2), t, -15, (-1) ** k * 0.3); place(kick(), t, -14)
crack = hp(noise(0.14), 2200) * env(0.14, 0.0005, 0.014) + 0.6 * modal([3600, 5900], [0.035, 0.02], [1, .5], 0.14)   # ice cracking on the second flash
place(crack, flashes[1] + 0.05, -14, 0.2)
icedrop(T['product'] + 0.15)                                                                                          # a cube into the glass as the phone rises
for k in range(5):                                                                                                    # ice settling, faintly, while he types and reads
    place(glass(rng.uniform(2200, 3400), 0.45), T['product'] + 1.0 + k * 0.9 + rng.uniform(0, 0.3), -24 - rng.uniform(0, 3), rng.uniform(-.4, .4))
place(whoosh(0.5, 2600, 300, 0.25), T['product'] - 0.05, -15)
nchar = len(APP['query'])
for k in range(nchar):
    tk = T['typeStart'] + (T['typeEnd'] - T['typeStart']) * (k + 0.5) / nchar
    place(hp(noise(0.03), 3000) * env(0.03, 0.0004, 0.004), tk, -23 - rng.uniform(0, 3), rng.uniform(-.1, .1))
place(fx_result, 0, -14)



# ---------------------------------------------------------------- mix ---------------------------
TT = np.arange(N) / SR
ramp = lambda pts: np.interp(TT, [p[0] for p in pts], [p[1] for p in pts])
music = music / np.abs(music).max()
music = reverb(music, ir(1.6, 4500), 0.22)
g = ramp([(0, -30), (0.15, -12), (T['question'], -12), (T['question'] + 0.5, -11), (T['bridge'] - 0.05, -11), (T['bridge'] + 0.05, -11),
          (T['product'] - 0.05, -11), (T['product'] + 0.3, -14), (T['card'], -14), (T['end'] - 0.1, -40), (DUR, -40)])
duck = np.zeros(N)
for t0 in cuts + flashes + [T['question'], T['result']]:
    a = np.clip((TT - t0) / 0.004, 0, 1) * np.where(TT < t0 + 0.1, 1, np.exp(-(TT - t0 - 0.1) / 0.25)); duck = np.maximum(duck, 2.5 * a)
music = music / np.abs(music).max() * REF * db(g - duck)[:, None]
sfx = reverb(SFX, ir(0.8, 6000), 0.16)
SILENT = DUR - 0.05
mix = (music + sfx) * np.clip((T['end'] - 0.05 - TT) / (T['end'] - 0.05 - T['card']), 0, 1)[:, None]
meter = pyloudnorm.Meter(SR); lufs = meter.integrated_loudness(mix)
mix = mix * db(-17.0 - lufs)
thr = db(-1.2); a = np.abs(mix).max(axis=1); need = np.minimum(1, thr / np.maximum(a, 1e-9))
la = int(0.004 * SR); need = np.minimum.reduce([np.roll(need, -k) for k in range(0, la, 8)]); gr = np.copy(need)
for i in range(1, N): gr[i] = min(need[i], gr[i - 1] + (1 - gr[i - 1]) * (1 / (0.08 * SR)))
mix = mix * gr[:, None]; mix[int(SILENT * SR):] = 0
sf.write(OUT, mix.astype(np.float32), SR, subtype='PCM_24')
print(f'LUFS in {lufs:.1f} → out {meter.integrated_loudness(mix):.1f}, peak {20*np.log10(np.abs(mix).max()):.1f} dBFS, GR {20*np.log10(gr.min()):.1f} dB')
