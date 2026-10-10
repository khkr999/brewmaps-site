// Story 3 · اكسب — minimalist, the reward frame. Pale green: the brightest step of the three.
// Headline, one medal that rises and settles, "+ BrewPoints" once, one line of what you get, the download.
// Claims are only what brewmaps.app states: rate and check in, earn BrewPoints, badges, a leaderboard.

const S3 = {
  ar: { page: '٣/٣', h1: 'وكل تقييم', h2: 'يعطيك BrewPoints', pts: '+ BrewPoints',
        sub: 'اجمع نقاط، افتح أوسمة، وتصدّر القائمة', cta: 'حمّل BrewMaps مجاناً' },
  en: { page: '3/3', h1: 'And every rating', h2: 'earns you BrewPoints', pts: '+ BrewPoints',
        sub: 'Collect points, unlock badges, top the leaderboard', cta: 'Get BrewMaps, free' },
};

function cupMark(ctx, cx, cy, s, color) {
  ctx.beginPath(); ctx.moveTo(cx - 60 * s, cy - 40 * s); ctx.lineTo(cx + 60 * s, cy - 40 * s);
  ctx.bezierCurveTo(cx + 58 * s, cy + 30 * s, cx + 30 * s, cy + 50 * s, cx, cy + 50 * s);
  ctx.bezierCurveTo(cx - 30 * s, cy + 50 * s, cx - 58 * s, cy + 30 * s, cx - 60 * s, cy - 40 * s); stroke(ctx, color, 8);
  ctx.beginPath(); ctx.arc(cx + 66 * s, cy - 8 * s, 20 * s, -Math.PI / 2, Math.PI / 2); stroke(ctx, color, 8);
  ctx.beginPath(); ctx.moveTo(cx - 80 * s, cy + 70 * s); ctx.lineTo(cx + 80 * s, cy + 70 * s); stroke(ctx, color, 8);
}

function medal(ctx, cx, cy, t) {
  for (const d of [-1, 1]) {                                  // ribbon tails
    ctx.beginPath(); ctx.moveTo(cx + d * 36, cy + 120); ctx.lineTo(cx + d * 104, cy + 300); ctx.lineTo(cx + d * 66, cy + 274); ctx.lineTo(cx + d * 38, cy + 312); ctx.lineTo(cx, cy + 150); ctx.closePath();
    ctx.fillStyle = NIGHT; ctx.fill(); stroke(ctx, NIGHT, 8);
  }
  ctx.beginPath(); ctx.arc(cx, cy, 165, 0, Math.PI * 2); ctx.fillStyle = FOREST; ctx.fill(); stroke(ctx, NIGHT, 9);
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * 0.25);    // the inner ring turns, slowly, the whole time
  ctx.beginPath(); ctx.arc(0, 0, 132, 0, Math.PI * 2); ctx.setLineDash([3, 22]); stroke(ctx, PALE, 7); ctx.setLineDash([]);
  ctx.restore();
  cupMark(ctx, cx - 8, cy - 10, 0.92, CREAM);
}

function renderFrame(ctx, t, A) {
  const M = S3[RTL() ? 'ar' : 'en'];
  ctx.globalAlpha = 1; ctx.fillStyle = PALE; ctx.fillRect(0, 0, W, H);

  // corner marks
  const m = A.markGreen, mh = 40, mw = mh * m.width / m.height;
  ctx.drawImage(m, RTL() ? 984 - mw : 96, 240, mw, mh);
  ctx.save(); ctx.font = F(500, 34); ctx.direction = L.dir; ctx.fillStyle = NIGHT; ctx.globalAlpha = 0.55;
  ctx.textAlign = RTL() ? 'left' : 'right'; ctx.fillText(M.page, RTL() ? 96 : 984, 272); ctx.restore();

  // headline
  const al = RTL() ? 'right' : 'left';
  text(ctx, M.h1, EDGE(), 520, F(800, 112), NIGHT, al, 1);
  text(ctx, M.h2, EDGE(), 645, F(800, 112), NIGHT, al, seg(t, 0.35, 0.65));

  // the medal rises and settles, no bounce
  const a = eo(seg(t, 0.6, 1.3)), cx = W / 2, cy = 1040 + (1 - a) * 60;
  if (a > 0) { ctx.save(); ctx.globalAlpha = a; medal(ctx, cx, cy, t); ctx.restore(); }

  // "+ BrewPoints" rises from the medal once and stays
  const p = eo(seg(t, 1.5, 2.2));
  if (p > 0) {
    ctx.save(); ctx.globalAlpha = p; ctx.direction = 'ltr'; ctx.font = F(700, 50, 'DM Sans'); ctx.textAlign = 'center'; ctx.fillStyle = NIGHT;
    ctx.fillText(M.pts, cx + (RTL() ? 230 : -230), 850 - p * 30); ctx.restore();
  }

  // what you get, then the download
  text(ctx, M.sub, W / 2, 1440, F(500, 46), NIGHT, 'center', seg(t, 2.4, 2.8));
  const c = text(ctx, M.cta, W / 2, 1560, F(800, 62), NIGHT, 'center', seg(t, 3.2, 3.5));
  const ul = io(seg(t, 3.4, 3.9));
  if (c && ul > 0) { ctx.save(); ctx.strokeStyle = FOREST; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath();
    ctx.moveTo(W / 2 + (RTL() ? 1 : -1) * c / 2, 1592); ctx.lineTo(W / 2 + (RTL() ? 1 : -1) * (c / 2 - c * ul), 1592); ctx.stroke(); ctx.restore(); }

  openFrom(ctx, t, CREAM);
  grainOver(ctx, A, t);
}
