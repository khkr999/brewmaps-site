"""على ذوقك · "Cold drinks" v2: the mix. Modern and understated: a soft sub pulse and muted keys on a 75 BPM grid
(every cut is on a beat), a cool chord per drink, thinner under the product moment, resolving on the card with the
BrewMaps sonic logo. On top, restrained drink ASMR synced to the cuts: ice clinks, a soft pour under the hook, fizz,
one ice crack, gentle whooshes between sections, soft typing ticks and a two-note result tone.
Usage: python3 sound.py <workdir> <out.wav>
"""
import json, os, subprocess, sys
import numpy as np, soundfile as sf, mido, pyloudnorm
from scipy.signal import butter, sosfilt, fftconvolve

HERE = os.path.dirname(os.path.abspath(__file__))
TM = json.loads(subprocess.run(['node', '-e', "const m=require(process.argv[1]);console.log(JSON.stringify(m))", os.path.join(HERE, 'timing.js')], check=True, capture_output=True, text=True).stdout)
BEAT, T, APP = TM['BEAT'], TM['T'], TM['APP']
SR = 48000; DUR = T['end']; N = int(DUR * SR)
SF2 = '/usr/share/sounds/sf2/FluidR3_GM.sf2'
WORK, OUT = sys.argv[1], sys.argv[2]; os.makedirs(WORK, exist_ok=True)
rng = np.random.default_rng(5)
db = lambda d: 10 ** (d / 20); REF = db(-1)
cuts = [T['hook']] + [T['drinks'] + i * BEAT for i in range(5)]
flashes = [T['bridge'] + i * BEAT / 4 for i in range(4)]

# ---------------------------------------------------------------- music -------------------------
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
EP2, PAD, SYNBASS, CELESTA, VIBES, PIZZ = 5, 89, 39, 8, 11, 45
# a cool chord per cut (hook + five drinks), two bars of bridge/product, the card resolves
CH = [['D4', 'F#4', 'A4', 'C#5'], ['B3', 'D4', 'F#4', 'A4'], ['G3', 'B3', 'D4', 'F#4'], ['A3', 'C#4', 'E4', 'G4'], ['F#3', 'A3', 'C#4', 'E4'], ['G3', 'B3', 'D4', 'E4']]
ROOT = ['D2', 'B1', 'G1', 'A1', 'F#1', 'G1']
keys, pad, bass = [], [], []
for i, t in enumerate(cuts):
    keys += chord(t + 0.01, 0.42, CH[i], 62) + chord(t + BEAT / 2, 0.22, CH[i][1:3], 40)        # a muted stab on the beat, a ghost on the off-beat
    pad += chord(t, BEAT + 0.1, CH[i][:3], 36)
    bass += [(t, 0.55, ROOT[i], 82), (t + BEAT * 0.75, 0.2, ROOT[i], 48)]
t0 = T['bridge']                                                                                 # bridge: the sus chord, bass pumping on 8ths
keys += chord(t0 + 0.01, 0.78, ['A3', 'D4', 'E4', 'G4'], 64); pad += chord(t0, BEAT + 0.1, ['A3', 'D4', 'E4'], 40)
bass += [(t0 + k * BEAT / 4, 0.16, 'A1', 76 - 6 * k) for k in range(4)]
tp = T['product']                                                                                # product: thinner, warm, slow
pad += chord(tp, T['card'] - tp + 0.1, ['D4', 'F#4', 'A4', 'E5'], 44)
keys += [(tp + 0.01, 1.2, 'A4', 44), (tp + BEAT, 1.2, 'F#4', 40), (tp + 2 * BEAT, 1.4, 'E4', 40)]
bass += [(tp, 1.4, 'D2', 66), (tp + 2 * BEAT, 1.2, 'D2', 56)]
pad_cc = [(T['end'] - 0.9 + i * 0.045, mido.Message('control_change', control=11, value=int(127 * (1 - i / 19) ** 1.4))) for i in range(20)]
pad += chord(T['card'], T['end'] - T['card'], ['D4', 'F#4', 'A4'], 48)                           # the card resolves
L0 = T['card'] + 0.12; logo_t = [L0, L0 + 4 / 24, L0 + 8 / 24]
music = render('m_keys', [(0, EP2, keys, [])]) * 0.8 + render('m_pad', [(1, PAD, pad, pad_cc)]) * 0.5 + render('m_bass', [(2, SYNBASS, bass, [])]) * 0.9
fx_logo = render('fx_logo', [(0, CELESTA, [(logo_t[0], .5, 'A4', 96), (logo_t[1], .5, 'D5', 100), (logo_t[2], 1.1, 'F#5', 106)], []),
                             (1, VIBES, [(logo_t[0], .5, 'A4', 70), (logo_t[1], .5, 'D5', 74), (logo_t[2], 1.1, 'F#5', 80)], []),
                             (2, PIZZ, [(logo_t[0], .2, 'A3', 54), (logo_t[1], .2, 'D4', 56), (logo_t[2], .3, 'F#4', 58)], [])])
fx_result = render('fx_result', [(0, CELESTA, [(T['result'], .5, 'D6', 70), (T['result'] + 0.07, .7, 'A6', 76)], [])])

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

# ---------------------------------------------------------------- drink ASMR, on the cuts --------
kick = lambda: np.sin(2 * np.pi * np.cumsum(np.linspace(150, 48, int(0.25 * SR))) / SR) * env(0.25, 0.002, 0.07)    # a soft, deep thump on every cut
for i, t in enumerate(cuts):
    place(kick(), t, -12)
    f = [2500, 2300, 2700, 1900, 2550, 2100][i]
    place(glass(f, 0.45), t + 0.015, -11, rng.uniform(-.25, .25)); place(glass(f * 1.19, 0.3), t + 0.06, -16, rng.uniform(-.25, .25))
# the hook: a soft pour / swirl of milk into coffee
pd = BEAT; pour = lp(noise(pd), 1800) * (0.6 + 0.4 * np.sin(2 * np.pi * 2.3 * tt(pd))) * np.sin(np.pi * tt(pd) / pd) ** 0.8
for _ in range(10): b = bubble(rng.uniform(400, 1100), 0.05, 1.8); o = int(rng.uniform(0.05, pd - 0.1) * SR); pour[o:o + len(b)] += 1.4 * b
place(pour, 0.02, -17, 0.1)
# fizz under cold brew and karkadeh, a tiny ice crack on the matcha
for t in (cuts[3], cuts[5]):
    fz = hp(noise(BEAT), 5000) * (0.5 + 0.5 * rng.uniform(0, 1, int(BEAT * SR)) ** 6)
    for _ in range(16): b = bubble(rng.uniform(1800, 4200), 0.02, 2.2); o = int(rng.uniform(0, BEAT - 0.05) * SR); fz[o:o + len(b)] += 2.5 * b
    place(fz * np.minimum(1, tt(BEAT) / 0.15), t, -27, rng.uniform(-.3, .3))
crack = hp(noise(0.12), 2500) * env(0.12, 0.0005, 0.012) + 0.6 * modal([3800, 6200], [0.03, 0.02], [1, .5], 0.12)
place(crack, cuts[2] + 0.42, -17, 0.2)
# the bridge: four flashes, each a short ice tick, over one whoosh
place(whoosh(BEAT, 400, 3200, 0.3), T['bridge'] - 0.1, -16)
for k, t in enumerate(flashes): place(glass(3000 + 300 * k, 0.2), t, -15, (-1) ** k * 0.3)
# into the product: a whoosh down into calm; typing ticks; the result tone
place(whoosh(0.5, 2600, 300, 0.25), T['product'] - 0.05, -15)
nchar = len(APP['query'])
for k in range(nchar):
    u = (k + 0.5) / nchar; tk = T['typeStart'] + (T['typeEnd'] - T['typeStart']) * (0.5 - 0.5 * np.cos(np.pi * u) if False else u)
    place(hp(noise(0.03), 3000) * env(0.03, 0.0004, 0.004), tk, -23 - rng.uniform(0, 3), rng.uniform(-.1, .1))
place(fx_result, 0, -14)
# the card: a soft whoosh, the logo
place(whoosh(0.4, 300, 2200, 0.5), T['card'] - 0.18, -13)
place(fx_logo, 0, -9)

# ---------------------------------------------------------------- mix ---------------------------
TT = np.arange(N) / SR
ramp = lambda pts: np.interp(TT, [p[0] for p in pts], [p[1] for p in pts])
hat = np.zeros((N, 2))                                                                          # soft hi-hat ticks on 8ths through the drinks and bridge
for k in range(int(T['product'] / (BEAT / 2))):
    tk = k * BEAT / 2; d = 0.04; s = hp(noise(d), 7000) * env(d, 0.001, 0.012) * (1.0 if k % 2 == 0 else 0.6)
    j = int(tk * SR); hat[j:j + len(s)] += np.stack([s, s * 0.8], -1)
music = music / np.abs(music).max() + 0.09 * hat / (np.abs(hat).max() + 1e-9)
music = reverb(music, ir(1.1, 4500), 0.16)
g = ramp([(0, -11), (T['bridge'], -11), (T['product'] - 0.05, -11), (T['product'] + 0.2, -15), (T['card'] - 0.05, -15), (T['card'] + 0.1, -12), (L0 + 0.3, -14), (DUR, -14)])
duck = np.zeros(N)
for t0 in cuts + flashes + [T['result'], L0]:
    a = np.clip((TT - t0) / 0.004, 0, 1) * np.where(TT < t0 + 0.08, 1, np.exp(-(TT - t0 - 0.08) / 0.22)); duck = np.maximum(duck, 2.5 * a)
music = music / np.abs(music).max() * REF * db(g - duck)[:, None]
sfx = reverb(SFX, ir(0.7, 6500), 0.14)
SILENT = DUR - 0.15
mix = (music + sfx) * np.clip((SILENT - TT) / 0.5, 0, 1)[:, None]
meter = pyloudnorm.Meter(SR); lufs = meter.integrated_loudness(mix)
mix = mix * db(-16.5 - lufs)
thr = db(-1.2); a = np.abs(mix).max(axis=1); need = np.minimum(1, thr / np.maximum(a, 1e-9))
la = int(0.004 * SR); need = np.minimum.reduce([np.roll(need, -k) for k in range(0, la, 8)]); gr = np.copy(need)
for i in range(1, N): gr[i] = min(need[i], gr[i - 1] + (1 - gr[i - 1]) * (1 / (0.08 * SR)))
mix = mix * gr[:, None]; mix[int(SILENT * SR):] = 0
sf.write(OUT, mix.astype(np.float32), SR, subtype='PCM_24')
print(f'LUFS in {lufs:.1f} → out {meter.integrated_loudness(mix):.1f}, peak {20*np.log10(np.abs(mix).max()):.1f} dBFS, GR {20*np.log10(gr.min()):.1f} dB')
