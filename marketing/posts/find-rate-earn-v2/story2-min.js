// Story 2 · قيّم — minimalist. Loaded after story1.js (reuses copy helpers, fonts, colours).
// The headline, one drawing (the Spanish latte from the Reel), five stars that fill once, one small line, next.

const COFFEE = '#7A4E33', MILKC = '#EFE0C2', INK = '#141414';
const S2 = {
  ar: { page: '٢/٣', h1: 'قيّم مشروبك', h2: 'بعد كل زيارة', aside: 'ولا تجامل 😌', next: 'التالي: اكسب' },
  en: { page: '2/3', h1: 'Rate your drink', h2: 'after every visit', aside: 'No flattering 😌', next: 'Next: earn' },
};

function latte(ctx, cx, top, bot, a) {
  // heavy tumbler: espresso float, milk, condensed milk; ice and a straw. Forest line on cream.
  const lx = y => cx - 125 + 15 * (y - top) / (bot - top), rx = y => cx + 125 - 15 * (y - top) / (bot - top);
  const liq = top + 58, base = bot - 36;
  ctx.save(); ctx.globalAlpha = a;
  ctx.save(); ctx.beginPath(); ctx.moveTo(lx(liq) + 13, liq); ctx.lineTo(rx(liq) - 13, liq); ctx.lineTo(rx(base) - 13, base); ctx.lineTo(lx(base) + 13, base); ctx.closePath(); ctx.clip();
  ctx.fillStyle = '#FBF8F1'; ctx.fillRect(cx - 200, liq, 400, base - liq);
  const g = ctx.createLinearGradient(0, liq, 0, liq + 125); g.addColorStop(0, COFFEE); g.addColorStop(0.45, COFFEE); g.addColorStop(1, 'rgba(122,78,51,0)');
  ctx.fillStyle = g; ctx.fillRect(cx - 200, liq, 400, 125);
  ctx.fillStyle = MILKC; ctx.fillRect(cx - 200, base - 54, 400, 54);
  ctx.restore();
  const cube = (x, y, s, r) => { ctx.save(); ctx.translate(x, y); ctx.rotate(r); ctx.beginPath(); ctx.roundRect(-s / 2, -s / 2, s, s, s * 0.22);
    ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fill(); stroke(ctx, FOREST, 5); ctx.restore(); };
  cube(cx - 48, liq + 8, 56, -0.18); cube(cx + 34, liq + 20, 52, 0.22);
  ctx.beginPath(); ctx.moveTo(cx + 52, base - 30); ctx.lineTo(cx + 88, top - 96); stroke(ctx, FOREST, 12);
  ctx.beginPath(); ctx.moveTo(lx(top), top); ctx.lineTo(rx(top), top); ctx.lineTo(rx(bot), bot); ctx.lineTo(lx(bot), bot); ctx.closePath(); stroke(ctx, FOREST, 8);
  ctx.beginPath(); ctx.moveTo(lx(base), base); ctx.lineTo(rx(base), base); stroke(ctx, FOREST, 8);
  ctx.beginPath(); ctx.moveTo(lx(top) + 26, top + 40); ctx.lineTo(lx(top) + 18, top + 170); ctx.globalAlpha = a * 0.45; stroke(ctx, '#fff', 6);
  ctx.restore();
}
function star(ctx, cx, cy, R) { ctx.beginPath(); for (let i = 0; i < 10; i++) { const ang = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? R * 0.47 : R; ctx.lineTo(cx + r * Math.cos(ang), cy + r * Math.sin(ang)); } ctx.closePath(); }

function renderFrame(ctx, t, A) {
  const M = S2[RTL() ? 'ar' : 'en'];
  ctx.globalAlpha = 1; ctx.fillStyle = CREAM; ctx.fillRect(0, 0, W, H);

  // corner marks
  const m = A.markGreen, mh = 40, mw = mh * m.width / m.height;
  ctx.drawImage(m, RTL() ? 984 - mw : 96, 240, mw, mh);
  ctx.save(); ctx.font = F(500, 34); ctx.direction = L.dir; ctx.fillStyle = FOREST; ctx.globalAlpha = 0.5;
  ctx.textAlign = RTL() ? 'left' : 'right'; ctx.fillText(M.page, RTL() ? 96 : 984, 272); ctx.restore();

  // headline
  const al = RTL() ? 'right' : 'left';
  text(ctx, M.h1, EDGE(), 520, F(800, 112), FOREST, al, 1);
  text(ctx, M.h2, EDGE(), 645, F(800, 112), FOREST, al, seg(t, 0.15, 0.45));

  // the drink rises in and settles
  const a = eo(seg(t, 0.45, 1.0));
  ctx.save(); ctx.translate(0, (1 - a) * 30); latte(ctx, W / 2, 860, 1220, a); ctx.restore();

  // five stars, outlined first, then filled one at a time in reading direction: a calm fill, no bounce
  const R = 52, gap = 142;
  for (let k = 0; k < 5; k++) {
    const slot = RTL() ? 4 - k : k, x = W / 2 + (slot - 2) * gap, y = 1375;
    const o = eo(seg(t, 0.8 + k * 0.06, 1.2 + k * 0.06)), f = eo(seg(t, 1.5 + k * 0.24, 1.78 + k * 0.24));
    ctx.save(); ctx.globalAlpha = o;
    star(ctx, x, y, R * (0.94 + 0.06 * f));
    if (f > 0) { ctx.globalAlpha = o * f; ctx.fillStyle = FOREST; ctx.fill(); ctx.globalAlpha = o; }
    stroke(ctx, FOREST, 6); ctx.restore();
  }

  // one small line after the last star
  text(ctx, M.aside, W / 2, 1505, F(500, 48), FOREST, 'center', seg(t, 3.0, 3.35), 0.85);

  // next
  const nx = eo(seg(t, 3.9, 4.3));
  if (nx > 0) {
    const nudge = Math.sin((t - 3.9) * 4) * 6 * (RTL() ? -1 : 1);
    ctx.save(); ctx.globalAlpha = nx * 0.75; ctx.direction = L.dir; ctx.font = F(500, 40); ctx.fillStyle = FOREST; ctx.textAlign = 'center';
    ctx.fillText(M.next, W / 2 + (RTL() ? 24 : -24), 1720);
    const w = ctx.measureText(M.next).width; ctx.fillText(L.arrow, W / 2 + (RTL() ? -w / 2 - 18 : w / 2 + 18) + nudge, 1720);
    ctx.restore();
  }

  ctx.save(); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = 0.03; ctx.drawImage(A.grain[Math.floor(t * 12) % 3], 0, 0, W, H); ctx.restore();
}
