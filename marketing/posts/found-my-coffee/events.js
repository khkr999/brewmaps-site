// node events.js > events.json — every sound cue's time, read from the animation itself.
// The reel draws on twos (scene() is sampled at 12 fps, see renderReel), so a cue lands on the first 24 fps
// frame that actually shows the change. sound.py reads this file, so the mix follows any timing change.
const vm = require('vm'), fs = require('fs'), path = require('path');
const ctx = { Math, console }; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname, '../the-regular/rig.js'), 'utf8') + '\n' + fs.readFileSync(path.join(__dirname, 'reel.js'), 'utf8')
  + '\nthis.scene = scene; this.T = T; this.DUR = DUR; this.GROUND = GROUND; this.K = K; this.FOLD = FOLD; this.LAD_L = LAD_L; this.CLIMB = CLIMB;', ctx);
const { scene, T, DUR, GROUND, K, FOLD, LAD_L } = ctx;

const FR = Math.round(DUR * 24), td = f => Math.floor(f / 2) / 12, sec = f => +(f / 24).toFixed(4);
const frames = Array.from({ length: FR }, (_, f) => ({ f, t: td(f), ...scene(td(f)) }));
const first = (pred, from = 0) => { const x = frames.find(F => F.f >= from && pred(F)); return x ? sec(x.f) : null; };
const at = X => sec(frames.find(F => F.t >= X - 1e-9).f);          // first frame showing the state reached at time X
const after = X => sec(frames.find(F => F.t > X + 1e-9).f);         // first frame where something starting at X has moved
const L = F => F.S.lad ? Math.hypot(F.S.lad.t[0] - F.S.lad.b[0], F.S.lad.t[1] - F.S.lad.b[1]) : 0;

// footsteps: a foot touching the counter after being lifted
const G = GROUND / K, steps = [];
for (let i = 1; i < frames.length; i++) {
  const a = frames[i - 1], b = frames[i];
  if (b.t >= T.atA) break;
  for (const k of ['f', 'b']) {
    const ya = a.P.feet[k]?.w?.[1], yb = b.P.feet[k]?.w?.[1];
    if (ya != null && yb != null && ya < G - 0.5 && yb >= G - 0.5) steps.push({ t: sec(b.f), x: b.P.x * K, sad: b.t >= T.walkA });
  }
}
const ev = {
  DUR, T,
  steps: steps.filter(s => !s.sad && s.t < T.inB), sad: steps.filter(s => s.sad),
  stop: at(T.inB - 0.1),
  phone1: after(T.phB), badge1: first(F => F.S.badge && !F.S.badge.good), phoneDown1: after(T.offB - 0.18),
  no: frames.filter((F, i) => i && F.t < T.walkA && F.P.front && !frames[i - 1].P.front).map(F => sec(F.f)),
  phone2: after(T.phA), badge2: first(F => F.S.badge && F.S.badge.good),
  hop: after(T.hop), hopLand: at(T.hop + 0.25),
  bagDown: first(F => F.S.bag && F.S.bag.at >= 0.97), pop: first(F => F.S.bag && F.S.bag.open > 0),
  ladderOut: first(F => F.S.lad), planted: first(F => F.S.lad && F.S.lad.b[0] === 492 && F.S.lad.b[1] === 1336),
  clicks: [1, 2, 3].map(k => first(F => F.t < T.extend + 0.1 && L(F) >= FOLD + (LAD_L - FOLD) * (k - 0.12) / 3)),
  rungs: Array.from({ length: ctx.CLIMB - 1 }, (_, i) => at(T.extend + (T.top - T.extend) * (i + 1) / ctx.CLIMB)),
  pocket: after(T.top), pull: after(T.pocket), unfurl: first(F => F.S.flag && F.S.flag.open > 0), flagIn: at(T.planted),
  turn: after(T.turn), flop: after(T.flop), splash: first(F => F.S.splash > 0), settled: at(T.settled),
  push: after(T.push), clatter: at(T.fallen), bounce: at(T.fallen + 0.25),
  ripples: [0, 1, 2, 3].map(i => T.settled + i * 2.4).filter(t => t < T.end).map(after),
  line: after(T.line), endCard: after(T.end), endFull: at(T.end + 1.0),
};
console.log(JSON.stringify(ev, null, 1));
