// Find · Rate · Earn, V2 — Story 1: دوّر (find).
// One message: find any café in the UAE. A drawn UAE map fills with pins, one per café on brewmaps.app
// at its real coordinates, in waves by emirate; the counter runs to 812; one pin opens into the cup.

const W = 1080, H = 1920, FPS = 30, DURATION = 7.0;
const NIGHT = '#0E1F0A', FOREST = '#2B4D1F', PALE = '#9BC48A', CREAM = '#F4EFE6';
const AR = '٠١٢٣٤٥٦٧٨٩';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const seg = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
const eo = u => 1 - Math.pow(1 - u, 3);
const io = u => u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
const settle = u => u >= 1 ? 1 : 1 - Math.pow(1 - u, 3) * Math.cos(u * Math.PI * 1.5);

const STR = {
  ar: { dir: 'rtl', f: 'Tajawal', n: s => String(s).replace(/\d/g, d => AR[d]),
        steps: ['دوّر', 'قيّم', 'اكسب'], h1: 'دوّر على أي كوفي', h2: 'في الإمارات',
        sub: n => `أكثر من ${n} كوفي على خريطة وحدة`, next: 'التالي: قيّم', arrow: '←' },
  en: { dir: 'ltr', f: 'DM Sans', n: s => String(s),
        steps: ['Find', 'Rate', 'Earn'], h1: 'Find any café', h2: 'in the UAE',
        sub: n => `${n}+ cafés on one map`, next: 'Next: rate', arrow: '→' },
};
let L = STR.ar;
function setLang(k) { L = STR[k] || STR.ar; }
const RTL = () => L.dir === 'rtl';
const EDGE = () => RTL() ? 984 : 96;
const F = (w, px, fam) => `${w} ${px}px "${fam || L.f}", "Noto Color Emoji"`;

function text(ctx, s, x, y, font, color, align, p = 1, alpha = 1) {
  if (p <= 0) return 0;
  ctx.save(); ctx.direction = L.dir; ctx.font = font;
  let px = parseInt(font.match(/(\d+)px/)[1]);
  while (ctx.measureText(s).width > 900 && px > 20) { px -= 2; ctx.font = font.replace(/\d+px/, px + 'px'); }
  const w = ctx.measureText(s).width, e = eo(p), left = align === 'right' ? x - w : align === 'center' ? x - w / 2 : x;
  ctx.beginPath();
  if (RTL()) ctx.rect(left + w * (1 - e) - 40, y - px * 1.3, w * e + 80, px * 1.8); else ctx.rect(left - 40, y - px * 1.3, w * e + 80, px * 1.8);
  ctx.clip(); ctx.globalAlpha *= alpha * Math.min(1, e * 1.4);
  ctx.textAlign = align; ctx.fillStyle = color; ctx.fillText(s, x, y + (1 - e) * 14); ctx.restore();
  return w;
}
function stroke(ctx, color, w) { ctx.lineWidth = w; ctx.strokeStyle = color; ctx.lineCap = ctx.lineJoin = 'round'; ctx.stroke(); }

// ─── header: brand + step bar ──────────────────────────────────────────────
function header(ctx, A, t, step) {
  const m = A.mark, mh = 46, mw = mh * m.width / m.height;
  ctx.drawImage(m, RTL() ? 984 - mw : 96, 236, mw, mh);
  ctx.save(); ctx.direction = 'ltr'; ctx.font = F(700, 38, 'DM Sans'); ctx.fillStyle = CREAM; ctx.textAlign = RTL() ? 'right' : 'left';
  ctx.fillText('BrewMaps', RTL() ? 984 - mw - 16 : 96 + mw + 16, 274); ctx.restore();
  ctx.save(); ctx.direction = L.dir; let x = EDGE();
  L.steps.forEach((w, k) => {
    const cur = k === step, label = `${L.n(k + 1)}  ${w}`;
    ctx.font = F(cur ? 800 : 500, 36); ctx.globalAlpha = cur ? 1 : 0.4; ctx.fillStyle = CREAM; ctx.textAlign = RTL() ? 'right' : 'left';
    ctx.fillText(label, x, 360); const wd = ctx.measureText(label).width;
    if (cur) { const u = io(seg(t, 0.1, 0.6)); ctx.globalAlpha = 1; ctx.beginPath(); ctx.moveTo(x, 386); ctx.lineTo(x + (RTL() ? -1 : 1) * wd * u, 386); stroke(ctx, PALE, 5); }
    x += (RTL() ? -1 : 1) * (wd + 54);
  });
  ctx.restore();
}

// ─── the map ───────────────────────────────────────────────────────────────
let PROJ, MAPBOX = { x: 70, y: 990, w: 940, h: 620 };
function makeProjection(uae) {
  const xs = uae.flat().map(p => p[0]), ys = uae.flat().map(p => p[1]);
  const lon0 = Math.min(...xs), lon1 = Math.max(...xs), lat0 = Math.min(...ys), lat1 = Math.max(...ys);
  const k = Math.cos((lat0 + lat1) / 2 * Math.PI / 180), s = Math.min(MAPBOX.w / ((lon1 - lon0) * k), MAPBOX.h / (lat1 - lat0));
  const ox = MAPBOX.x + (MAPBOX.w - (lon1 - lon0) * k * s) / 2, oy = MAPBOX.y + (MAPBOX.h - (lat1 - lat0) * s) / 2;
  PROJ = ([lon, lat]) => [ox + (lon - lon0) * k * s, oy + (lat1 - lat) * s];
}
function region([lng, lat]) {
  if (lng < 54.9) return 1;            // Abu Dhabi
  if (lat < 24.45) return 3;           // Al Ain
  if (lat > 25.45 || lng > 55.9) return 4;   // the north and east coast
  if (lng > 55.36 && lat > 25.24) return 2;  // Sharjah and Ajman
  return 0;                            // Dubai
}
const WAVES = [[0.95, 1.9], [1.9, 2.5], [2.5, 3.05], [3.05, 3.4], [3.4, 3.95]];
let PINS = [];
function preparePins(dots) {
  const by = [[], [], [], [], []];
  dots.forEach(p => by[region(p)].push(p));
  PINS = [];
  by.forEach((list, r) => {
    list.sort((a, b) => (a[0] + a[1] * 0.37) % 0.13 - (b[0] + b[1] * 0.37) % 0.13);   // spread the order inside a wave
    list.forEach((p, i) => { const [a, b] = WAVES[r]; PINS.push({ p, at: a + (b - a) * (i / Math.max(1, list.length)) }); });
  });
}
function pin(ctx, x, y, r, fill, line, lw) {        // tip at x,y
  const cy = y - 2.1 * r, k = Math.acos(1 / 2.1);
  ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, cy, r, Math.PI / 2 + k, Math.PI / 2 - k + Math.PI * 2); ctx.closePath();
  ctx.fillStyle = fill; ctx.fill(); if (line) stroke(ctx, line, lw);
  return cy;
}
function cup(ctx, cx, cy, s, color) {
  ctx.beginPath(); ctx.moveTo(cx - 60 * s, cy - 40 * s); ctx.lineTo(cx + 60 * s, cy - 40 * s);
  ctx.bezierCurveTo(cx + 58 * s, cy + 30 * s, cx + 30 * s, cy + 50 * s, cx, cy + 50 * s);
  ctx.bezierCurveTo(cx - 30 * s, cy + 50 * s, cx - 58 * s, cy + 30 * s, cx - 60 * s, cy - 40 * s); stroke(ctx, color, 8);
  ctx.beginPath(); ctx.arc(cx + 66 * s, cy - 8 * s, 20 * s, -Math.PI / 2, Math.PI / 2); stroke(ctx, color, 8);
  ctx.beginPath(); ctx.moveTo(cx - 80 * s, cy + 70 * s); ctx.lineTo(cx + 80 * s, cy + 70 * s); stroke(ctx, color, 8);
}

function map(ctx, A, t) {
  // outline draws in; the land fills a beat later
  const draw = io(seg(t, 0.2, 1.1)), fill = eo(seg(t, 0.6, 1.2));
  ctx.save();
  ctx.beginPath(); A.uae.forEach(ring => ring.forEach((p, i) => { const q = PROJ(p); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); }));
  ctx.globalAlpha = fill; ctx.fillStyle = FOREST; ctx.fill('evenodd'); ctx.globalAlpha = 1;
  ctx.setLineDash([4000, 4000]); ctx.lineDashOffset = 4000 * (1 - draw);
  ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(244,239,230,.55)'; ctx.lineJoin = 'round'; ctx.stroke();
  ctx.restore();
  // pins drop in waves; each lands with a small settle and a ring
  for (const P of PINS) {
    const u = seg(t, P.at, P.at + 0.28); if (u <= 0) continue;
    const [x, y] = PROJ(P.p), d = (1 - settle(u)) * -34;
    ctx.save(); ctx.globalAlpha = Math.min(1, u * 3);
    pin(ctx, x, y + d, 7, PALE, null);
    ctx.restore();
    if (u < 1) { ctx.beginPath(); ctx.ellipse(x, y, 4 + 16 * u, (4 + 16 * u) * 0.4, 0, 0, 7); ctx.strokeStyle = `rgba(155,196,138,${0.6 * (1 - u)})`; ctx.lineWidth = 2; ctx.stroke(); }
  }
}

function hero(ctx, t) {
  // one pin in Dubai grows into the BrewMaps pin with the cup
  const g = settle(seg(t, 4.25, 5.0)); if (g <= 0) return;
  const [x, y] = PROJ([55.27, 25.19]);
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 40 * g; ctx.shadowOffsetY = 14 * g;
  const r = 80 * g, cy = pin(ctx, x, y, r, NIGHT, CREAM, 8 * Math.min(1, g * 1.5)); ctx.restore();
  ctx.save(); const r2 = 80 * g; const cy2 = y - 2.1 * r2; ctx.globalAlpha = seg(t, 4.55, 4.85); cup(ctx, x - 5 * g, cy2 - 4 * g, 0.52 * g, CREAM); ctx.restore();
  const rip = seg(t, 4.5, 5.4);
  if (rip > 0 && rip < 1) { ctx.beginPath(); ctx.ellipse(x, y, 20 + 110 * rip, (20 + 110 * rip) * 0.35, 0, 0, 7); ctx.strokeStyle = `rgba(155,196,138,${1 - rip})`; ctx.lineWidth = 4; ctx.stroke(); }
}

const PLACES = {
  ar: [['دبي', [55.05, 25.02], 0], ['أبوظبي', [54.45, 24.3], 1], ['الشارقة', [55.5, 25.2], 2], ['العين', [55.72, 24.05], 3], ['رأس الخيمة', [55.98, 25.62], 4]],
  en: [['Dubai', [55.05, 25.02], 0], ['Abu Dhabi', [54.45, 24.3], 1], ['Sharjah', [55.5, 25.2], 2], ['Al Ain', [55.72, 24.05], 3], ['Ras Al Khaimah', [55.98, 25.62], 4]],
};
function labels(ctx, t) {
  PLACES[RTL() ? 'ar' : 'en'].forEach(([name, ll, w]) => {
    const [a, b] = WAVES[w], p = seg(t, a, a + 0.25), out = seg(t, b + 0.5, b + 0.9);
    if (p <= 0 || out >= 1 || t > 4.25) return;
    const [x, y] = PROJ(ll);
    ctx.save(); ctx.globalAlpha = eo(p) * (1 - out); ctx.direction = L.dir; ctx.font = F(700, 38); ctx.textAlign = 'center';
    ctx.lineWidth = 8; ctx.strokeStyle = 'rgba(14,31,10,.85)'; ctx.lineJoin = 'round'; ctx.strokeText(name, x, y + 60 - eo(p) * 12);
    ctx.fillStyle = CREAM; ctx.fillText(name, x, y + 60 - eo(p) * 12); ctx.restore();
  });
}

function renderFrame(ctx, t, A) {
  ctx.globalAlpha = 1; ctx.fillStyle = NIGHT; ctx.fillRect(0, 0, W, H);
  const g = ctx.createRadialGradient(W / 2, 1150, 80, W / 2, 1150, 1200); g.addColorStop(0, 'rgba(155,196,138,.07)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  header(ctx, A, t, 0);
  text(ctx, L.h1, EDGE(), 540, F(800, 118), CREAM, RTL() ? 'right' : 'left', 1);
  text(ctx, L.h2, EDGE(), 670, F(800, 118), PALE, RTL() ? 'right' : 'left', seg(t, 0.15, 0.45));
  const n = Math.round(812 * io(seg(t, 0.95, 4.0)));
  text(ctx, L.sub(L.n(n)), EDGE(), 770, F(500, 50), CREAM, RTL() ? 'right' : 'left', seg(t, 0.5, 0.8), 0.8);
  map(ctx, A, t);
  labels(ctx, t);
  hero(ctx, t);
  // the nudge to the next story
  const a = eo(seg(t, 5.1, 5.5));
  if (a > 0) {
    const nudge = Math.sin((t - 5.1) * 5) * 8 * (RTL() ? -1 : 1);
    ctx.save(); ctx.globalAlpha = a; ctx.direction = L.dir; ctx.font = F(700, 44); ctx.textAlign = 'center'; ctx.fillStyle = CREAM;
    ctx.fillText(L.next, W / 2 + (RTL() ? 28 : -28), 1690);
    const w = ctx.measureText(L.next).width; ctx.fillStyle = PALE; ctx.fillText(L.arrow, W / 2 + (RTL() ? -w / 2 - 20 : w / 2 + 20) + nudge, 1690);
    ctx.restore();
  }
  ctx.save(); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = 0.03; ctx.drawImage(A.grain[Math.floor(t * 12) % 3], 0, 0, W, H); ctx.restore();
}
if (typeof module !== 'undefined') module.exports = {};
