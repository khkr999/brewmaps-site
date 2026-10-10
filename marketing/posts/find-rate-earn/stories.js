// Find · Rate · Earn — three consecutive Stories in the V3 system.
// One route line runs through all three: it enters each story where the last one left off,
// passes through the drawing, and exits toward the next. The step bar says where you are.

const W = 1080, H = 1920, FPS = 30, DURATION = 6.0;
const NIGHT = '#0E1F0A', FOREST = '#2B4D1F', PALE = '#9BC48A', CREAM = '#F4EFE6', INK = '#141414';
const COFFEE = '#7A4E33', MILKC = '#EFE0C2';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const seg = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
const eo = u => 1 - Math.pow(1 - u, 3);
const io = u => u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
const settle = u => u >= 1 ? 1 : 1 - Math.pow(1 - u, 3) * Math.cos(u * Math.PI * 1.5);   // one soft overshoot, no bounce

// Copy. The Earn story only claims what the site says: BrewPoints, badges, leaderboard. No cash value.
const STR = {
  ar: { dir: 'rtl', f: 'Tajawal', steps: ['دوّر', 'قيّم', 'اكسب'],
        s1: ['طلبك في بالك؟', 'BrewMaps يقول لك وين تلقاه.'],
        s2: ['جرّبته؟ قيّمه.', 'قيّم المشروب نفسه… مو بس الكوفي.', 'ولا تجامل 😌'],
        s3: ['كل زيارة تحسب لك.', 'BrewPoints، أوسمة، ولوحة صدارة.', 'حمّل BrewMaps 👇'], pts: '+ BrewPoints' },
  en: { dir: 'ltr', f: 'DM Sans', steps: ['Find', 'Rate', 'Earn'],
        s1: ["Got an order in mind?", 'BrewMaps tells you where to find it.'],
        s2: ['Tried it? Rate it.', 'Rate the drink itself, not just the café.', 'No flattering 😌'],
        s3: ['Every visit counts.', 'BrewPoints, badges and a leaderboard.', 'Get BrewMaps 👇'], pts: '+ BrewPoints' },
};
let L = STR.ar;
function setLang(k) { L = STR[k] || STR.ar; }
const RTL = () => L.dir === 'rtl';
const EDGE = () => RTL() ? 984 : 96;
const F = (w, px, fam) => `${w} ${px}px "${fam || L.f}", "Noto Color Emoji"`;

function line(ctx, s, y, font, color, p, o = {}) {
  if (p <= 0) return null;
  ctx.save(); ctx.direction = L.dir; ctx.font = font;
  let px = parseInt(font.match(/(\d+)px/)[1]); const maxW = o.maxW || 888;
  while (ctx.measureText(s).width > maxW && px > 20) { px -= 2; ctx.font = font.replace(/\d+px/, px + 'px'); }
  const w = ctx.measureText(s).width, e = eo(p), x = o.x ?? EDGE(), align = o.align || (RTL() ? 'right' : 'left');
  const left = align === 'right' ? x - w : align === 'center' ? x - w / 2 : x;
  ctx.beginPath();
  if (RTL()) ctx.rect(left + w * (1 - e) - 40, y - px * 1.3, w * e + 80, px * 1.8); else ctx.rect(left - 40, y - px * 1.3, w * e + 80, px * 1.8);
  ctx.clip(); ctx.globalAlpha *= (o.alpha ?? 1) * Math.min(1, e * 1.4);
  ctx.textAlign = align; ctx.fillStyle = color; ctx.fillText(s, x, y + (1 - e) * 14);
  ctx.restore(); return { w, left, px };
}
function stroke(ctx, color, w = 9) { ctx.lineWidth = w; ctx.strokeStyle = color; ctx.lineCap = ctx.lineJoin = 'round'; ctx.stroke(); }

function bg(ctx, color) {
  ctx.fillStyle = color; ctx.fillRect(0, 0, W, H);
  const g = ctx.createRadialGradient(W / 2, 800, 60, W / 2, 800, 1300);
  g.addColorStop(0, 'rgba(255,255,255,.035)'); g.addColorStop(1, 'rgba(0,0,0,.05)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}

// the step bar: three words, the current one full weight with a short rule under it
function steps(ctx, n, ink, t) {
  ctx.save(); ctx.direction = L.dir; ctx.font = F(700, 38); ctx.textBaseline = 'alphabetic';
  const gap = 56, words = L.steps, widths = words.map(w => ctx.measureText(w).width);
  let x = EDGE();
  words.forEach((w, k) => {
    const cur = k === n, ww = widths[k];
    ctx.globalAlpha = cur ? 1 : 0.38; ctx.fillStyle = ink; ctx.textAlign = RTL() ? 'right' : 'left';
    ctx.font = F(cur ? 800 : 500, 38); ctx.fillText(`${RTL() ? '٠١٢٣'[k + 1] : k + 1}  ${w}`, x, 300);
    const full = ctx.measureText(`${RTL() ? '٠١٢٣'[k + 1] : k + 1}  ${w}`).width;
    if (cur) { const u = io(seg(t, 0.1, 0.6)); ctx.globalAlpha = 1; ctx.beginPath();
      if (RTL()) { ctx.moveTo(x, 326); ctx.lineTo(x - full * u, 326); } else { ctx.moveTo(x, 326); ctx.lineTo(x + full * u, 326); }
      ctx.strokeStyle = ink === CREAM ? PALE : FOREST; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.stroke(); }
    x += (RTL() ? -1 : 1) * (full + gap);
  });
  ctx.restore();
}

// the route: a dashed line that crosses all three stories (entry / exit mirror between stories)
function route(ctx, pts, color, p) {
  if (p <= 0) return;
  const P = RTL() ? pts : pts.map(([x, y]) => [W - x, y]);
  ctx.save(); ctx.setLineDash([2, 26]); ctx.lineDashOffset = 0; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.strokeStyle = color;
  // reveal along its length
  const segs = P.slice(1).map((q, i) => Math.hypot(q[0] - P[i][0], q[1] - P[i][1])), total = segs.reduce((a, b) => a + b, 0);
  let budget = total * p; ctx.beginPath(); ctx.moveTo(P[0][0], P[0][1]);
  for (let i = 1; i < P.length && budget > 0; i++) { const u = Math.min(1, budget / segs[i - 1]); ctx.lineTo(P[i - 1][0] + (P[i][0] - P[i - 1][0]) * u, P[i - 1][1] + (P[i][1] - P[i - 1][1]) * u); budget -= segs[i - 1]; }
  ctx.stroke(); ctx.restore();
}
const curve = (pts, n = 40) => {           // smooth Catmull-Rom through the given points
  const out = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let k = 0; k < n; k++) { const t = k / n, t2 = t * t, t3 = t2 * t;
      out.push([0, 1].map(d => 0.5 * ((2 * p1[d]) + (-p0[d] + p2[d]) * t + (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * t2 + (-p0[d] + 3 * p1[d] - 3 * p2[d] + p3[d]) * t3))); }
  }
  out.push(pts[pts.length - 1]); return out;
};
const X = x => RTL() ? x : W - x;

// small monoline cup, used inside the pin and the medal
function cup(ctx, cx, cy, s, color) {
  ctx.beginPath(); ctx.moveTo(cx - 60 * s, cy - 40 * s); ctx.lineTo(cx + 60 * s, cy - 40 * s);
  ctx.bezierCurveTo(cx + 58 * s, cy + 30 * s, cx + 30 * s, cy + 50 * s, cx, cy + 50 * s);
  ctx.bezierCurveTo(cx - 30 * s, cy + 50 * s, cx - 58 * s, cy + 30 * s, cx - 60 * s, cy - 40 * s); stroke(ctx, color, 9);
  ctx.beginPath(); ctx.arc(cx + 66 * s, cy - 8 * s, 20 * s, -Math.PI / 2, Math.PI / 2); stroke(ctx, color, 9);
  ctx.beginPath(); ctx.moveTo(cx - 80 * s, cy + 70 * s); ctx.lineTo(cx + 80 * s, cy + 70 * s); stroke(ctx, color, 9);
}

// ─── 1 · FIND ──────────────────────────────────────────────────────────────
function find(ctx, t) {
  bg(ctx, NIGHT); steps(ctx, 0, CREAM, t);
  line(ctx, L.s1[0], 560, F(800, 124), CREAM, t >= 0 ? 1 : 0);
  line(ctx, L.s1[1], 660, F(500, 54), PALE, seg(t, 0.5, 0.8), { maxW: 888 });
  const tip = [X(540), 1330];
  route(ctx, curve([[1100, 1560], [860, 1470], tip, [300, 1400], [120, 1240], [-20, 1200]]), PALE, io(seg(t, 0.2, 2.2)));
  // the pin drops onto the route, with the cup inside
  const u = settle(seg(t, 0.9, 1.7)), dy = (1 - u) * -700, cx = tip[0], cy = 1030 + dy;
  if (t > 0.9) {
    ctx.save(); ctx.globalAlpha = Math.min(1, seg(t, 0.9, 1.1) * 1.5);
    const r = 170, ty = tip[1] + dy, k = Math.acos(r / (ty - cy));
    ctx.beginPath(); ctx.moveTo(cx, ty); ctx.arc(cx, cy, r, Math.PI / 2 + k, Math.PI / 2 - k + Math.PI * 2); ctx.closePath();
    ctx.fillStyle = FOREST; ctx.fill(); stroke(ctx, CREAM, 10);
    cup(ctx, cx - 10, cy - 10, 1.05, CREAM);
    ctx.restore();
  }
  const rip = seg(t, 1.55, 2.4);                                            // one ripple where it lands
  if (rip > 0 && rip < 1) { ctx.beginPath(); ctx.ellipse(tip[0], tip[1], 40 + 150 * rip, (40 + 150 * rip) * 0.28, 0, 0, 7); ctx.strokeStyle = `rgba(155,196,138,${1 - rip})`; ctx.lineWidth = 5; ctx.stroke(); }
}

// ─── 2 · RATE ──────────────────────────────────────────────────────────────
function starPath(ctx, cx, cy, R) { ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? R * 0.46 : R; ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a)); } ctx.closePath(); }
function rate(ctx, t) {
  bg(ctx, CREAM); steps(ctx, 1, FOREST, t);
  line(ctx, L.s2[0], 560, F(800, 124), FOREST, 1);
  line(ctx, L.s2[1], 660, F(500, 54), INK, seg(t, 0.5, 0.8), { alpha: 0.85, maxW: 888 });
  route(ctx, curve([[1100, 1200], [990, 1330], [880, 1480], [620, 1560], [300, 1570], [-20, 1560]]), FOREST, io(seg(t, 0.1, 1.8)));
  // the Spanish latte from the Reel, smaller: the thing being rated
  const cx = X(540), top = 800, bot = 1140, lx = y => cx - 120 + 16 * (y - top) / (bot - top), rx = y => cx + 120 - 16 * (y - top) / (bot - top);
  const a = eo(seg(t, 0.2, 0.6)), dy = (1 - a) * 16;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(0, dy);
  const liq = top + 56, base = bot - 36;
  ctx.save(); ctx.beginPath(); ctx.moveTo(lx(liq) + 12, liq); ctx.lineTo(rx(liq) - 12, liq); ctx.lineTo(rx(base) - 12, base); ctx.lineTo(lx(base) + 12, base); ctx.closePath(); ctx.clip();
  ctx.fillStyle = CREAM; ctx.fillRect(cx - 200, liq, 400, base - liq);
  const g = ctx.createLinearGradient(0, liq, 0, liq + 120); g.addColorStop(0, COFFEE); g.addColorStop(0.45, COFFEE); g.addColorStop(1, 'rgba(122,78,51,0)');
  ctx.fillStyle = g; ctx.fillRect(cx - 200, liq, 400, 120); ctx.fillStyle = MILKC; ctx.fillRect(cx - 200, base - 52, 400, 52); ctx.restore();
  ctx.beginPath(); ctx.moveTo(cx + 50, base - 30); ctx.lineTo(cx + 84, top - 90); stroke(ctx, FOREST, 12);
  ctx.beginPath(); ctx.moveTo(lx(top), top); ctx.lineTo(rx(top), top); ctx.lineTo(rx(bot), bot); ctx.lineTo(lx(bot), bot); ctx.closePath(); stroke(ctx, FOREST);
  ctx.beginPath(); ctx.moveTo(lx(base), base); ctx.lineTo(rx(base), base); stroke(ctx, FOREST);
  ctx.restore();
  // five stars fill one after another, in reading direction
  for (let k = 0; k < 5; k++) {
    const slot = RTL() ? 4 - k : k, sx = W / 2 + (slot - 2) * 150, sy = 1290;
    const f = seg(t, 1.2 + k * 0.28, 1.4 + k * 0.28), s = 1 + 0.12 * Math.sin(Math.PI * f);
    ctx.save(); ctx.translate(sx, sy); ctx.scale(s, s); starPath(ctx, 0, 0, 58);
    if (f > 0) { ctx.globalAlpha = f; ctx.fillStyle = FOREST; ctx.fill(); ctx.globalAlpha = 1; }
    stroke(ctx, FOREST, 7); ctx.restore();
  }
  line(ctx, L.s2[2], 1420, F(700, 50), FOREST, seg(t, 2.8, 3.1), { x: W / 2, align: 'center' });
}

// ─── 3 · EARN ──────────────────────────────────────────────────────────────
function earn(ctx, t) {
  bg(ctx, FOREST); steps(ctx, 2, CREAM, t);
  line(ctx, L.s3[0], 560, F(800, 124), CREAM, 1);
  line(ctx, L.s3[1], 660, F(500, 54), PALE, seg(t, 0.5, 0.8), { maxW: 888 });
  const mx = X(540), my = 1010;
  // the route arrives and ends at the medal: the journey's finish
  route(ctx, curve([[1100, 1540], [900, 1420], [760, 1300], [mx + (RTL() ? 150 : -150), 1180]]), PALE, io(seg(t, 0.1, 1.2)));
  const a = eo(seg(t, 0.8, 1.3)), s = 0.9 + 0.1 * settle(seg(t, 0.8, 1.5));
  ctx.save(); ctx.globalAlpha = a; ctx.translate(mx, my); ctx.scale(s, s); ctx.translate(-mx, -my);
  for (const d of [-1, 1]) {                                                  // ribbon tails
    ctx.beginPath(); ctx.moveTo(mx + d * 40, my + 120); ctx.lineTo(mx + d * 110, my + 330); ctx.lineTo(mx + d * 70, my + 300); ctx.lineTo(mx + d * 40, my + 340); ctx.lineTo(mx + d * 0, my + 150);
    ctx.fillStyle = NIGHT; ctx.fill(); stroke(ctx, CREAM, 9);
  }
  ctx.beginPath(); ctx.arc(mx, my, 175, 0, Math.PI * 2); ctx.fillStyle = NIGHT; ctx.fill(); stroke(ctx, CREAM, 10);
  ctx.beginPath(); ctx.arc(mx, my, 140, 0, Math.PI * 2); ctx.setLineDash([3, 22]); stroke(ctx, PALE, 7); ctx.setLineDash([]);
  cup(ctx, mx - 10, my - 10, 0.95, CREAM);
  ctx.restore();
  // "+ BrewPoints" drifts up from the medal three times; no numbers, the site doesn't publish them
  for (let k = 0; k < 3; k++) {
    const p = seg(t, 1.6 + k * 0.7, 3.0 + k * 0.7); if (p <= 0 || p >= 1) continue;
    const x = mx + [170, -190, 120][k] * (RTL() ? 1 : -1), y = my - 180 - p * 190;
    ctx.save(); ctx.globalAlpha = Math.sin(Math.PI * p); ctx.font = F(700, 40, 'DM Sans'); ctx.textAlign = 'center'; ctx.fillStyle = PALE; ctx.fillText(L.pts, x, y); ctx.restore();
  }
  const c = line(ctx, L.s3[2], 1470, F(800, 60), CREAM, seg(t, 2.6, 2.9), { x: W / 2, align: 'center' });
  const ul = io(seg(t, 2.8, 3.2));
  if (c && ul > 0) { ctx.save(); ctx.strokeStyle = PALE; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(W / 2 - c.w / 2 * ul, 1502); ctx.lineTo(W / 2 + c.w / 2 * ul, 1502); ctx.stroke(); ctx.restore(); }
}

let STORY = 1;
function setStory(n) { STORY = n; }
function renderFrame(ctx, t, A) {
  ctx.globalAlpha = 1; ctx.setLineDash([]);
  [find, rate, earn][STORY - 1](ctx, t);
  ctx.save(); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = 0.03; ctx.drawImage(A.grain[Math.floor(t * 12) % 3], 0, 0, W, H); ctx.restore();
}
if (typeof module !== 'undefined') module.exports = {};
