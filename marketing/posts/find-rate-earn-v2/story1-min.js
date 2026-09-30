// Story 1, minimalist cut. Loaded after story1.js; reuses its map, pins and copy, and replaces the frame.
// Four things only: the headline, one big number, the map filling quietly, and the "next" line.

MAPBOX = { x: 90, y: 1070, w: 900, h: 560 };
const MIN = {
  ar: { count: n => n, unit: 'كوفي', page: '١/٣' },
  en: { count: n => n, unit: 'cafés', page: '1/3' },
};

function renderFrame(ctx, t, A) {
  const M = MIN[RTL() ? 'ar' : 'en'];
  ctx.globalAlpha = 1; ctx.fillStyle = NIGHT; ctx.fillRect(0, 0, W, H);

  // corner marks: the logo on the reading side, the page count on the other
  const m = A.mark, mh = 40, mw = mh * m.width / m.height;
  ctx.drawImage(m, RTL() ? 984 - mw : 96, 240, mw, mh);
  ctx.save(); ctx.font = F(500, 34); ctx.direction = L.dir; ctx.fillStyle = CREAM; ctx.globalAlpha = 0.5;
  ctx.textAlign = RTL() ? 'left' : 'right'; ctx.fillText(M.page, RTL() ? 96 : 984, 272); ctx.restore();

  // headline
  const al = RTL() ? 'right' : 'left';
  text(ctx, L.h1, EDGE(), 520, F(800, 112), CREAM, al, 1);
  text(ctx, L.h2, EDGE(), 645, F(800, 112), CREAM, al, seg(t, 0.15, 0.45));

  // the one number: no counting. It lands once, after the map has filled, rising out of a mask.
  const a = seg(t, 3.9, 4.4);
  if (a > 0) {
    const e = eo(a), num = L.n(812);
    ctx.save(); ctx.direction = 'ltr'; ctx.font = F(800, 250); ctx.textAlign = RTL() ? 'right' : 'left';
    ctx.beginPath(); ctx.rect(0, 700, W, 272); ctx.clip();                  // the number rises into view from below its baseline
    ctx.fillStyle = PALE; ctx.fillText(num, EDGE(), 950 + (1 - e) * 230);
    ctx.restore();
    const nw = (() => { ctx.save(); ctx.font = F(800, 250); const w = ctx.measureText(num).width; ctx.restore(); return w; })();
    const u = eo(seg(t, 4.15, 4.55));
    ctx.save(); ctx.globalAlpha = u * 0.8; ctx.direction = L.dir; ctx.font = F(500, 52); ctx.fillStyle = CREAM; ctx.textAlign = RTL() ? 'right' : 'left';
    ctx.fillText(M.unit, (RTL() ? EDGE() - nw - 30 : EDGE() + nw + 30) + (RTL() ? 1 : -1) * (1 - u) * 16, 890); ctx.restore();
  }

  // the map: a quiet outline, then dots appear in waves by emirate
  const draw = io(seg(t, 0.2, 1.1)), fill = eo(seg(t, 0.6, 1.2));
  ctx.save();
  ctx.beginPath(); A.uae.forEach(ring => ring.forEach((p, i) => { const q = PROJ(p); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); }));
  ctx.globalAlpha = fill * 0.75; ctx.fillStyle = FOREST; ctx.fill('evenodd'); ctx.globalAlpha = 1;
  ctx.setLineDash([4000, 4000]); ctx.lineDashOffset = 4000 * (1 - draw);
  ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(244,239,230,.4)'; ctx.lineJoin = 'round'; ctx.stroke();
  ctx.restore();
  ctx.fillStyle = PALE;
  for (const P of PINS) {
    const u = eo(seg(t, P.at, P.at + 0.35)); if (u <= 0) continue;
    const [x, y] = PROJ(P.p);
    ctx.globalAlpha = u; ctx.beginPath(); ctx.arc(x, y, 4.2 * (0.6 + 0.4 * u), 0, 7); ctx.fill();
  }
  ctx.globalAlpha = 1;

  // next
  const nx = eo(seg(t, 4.9, 5.3));
  if (nx > 0) {
    const nudge = Math.sin((t - 4.9) * 4) * 6 * (RTL() ? -1 : 1);
    ctx.save(); ctx.globalAlpha = nx * 0.75; ctx.direction = L.dir; ctx.font = F(500, 40); ctx.fillStyle = CREAM; ctx.textAlign = 'center';
    ctx.fillText(L.next, W / 2 + (RTL() ? 24 : -24), 1720);
    const w = ctx.measureText(L.next).width; ctx.fillText(L.arrow, W / 2 + (RTL() ? -w / 2 - 18 : w / 2 + 18) + nudge, 1720);
    ctx.restore();
  }

  ctx.save(); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = 0.03; ctx.drawImage(A.grain[Math.floor(t * 12) % 3], 0, 0, W, H); ctx.restore();
}
