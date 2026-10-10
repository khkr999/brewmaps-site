// The hand-off between Stories. Each Story ends with the next Story's colour rising as a strip at the
// bottom, carrying "next"; the next Story opens with that same strip expanding to fill the screen.
// Night (find) → cream (rate) → pale green (earn): dark to light to reward.

const STRIP = 1640;                                       // top edge of the hand-off strip
function openFrom(ctx, t, prevColor) {                    // call last-but-grain: the previous colour recedes into the top
  const u = io(seg(t, 0.05, 0.55)); if (u >= 1) return;
  ctx.save(); ctx.fillStyle = prevColor; ctx.fillRect(0, 0, W, STRIP * (1 - u)); ctx.restore();
}
function handTo(ctx, t, at, color, ink, label) {          // the strip rises, then "next" sits on it
  const u = io(seg(t, at, at + 0.6)); if (u <= 0) return;
  ctx.save(); ctx.fillStyle = color; ctx.fillRect(0, H - (H - STRIP) * u, W, (H - STRIP) * u); ctx.restore();
  const a = eo(seg(t, at + 0.45, at + 0.85)); if (a <= 0) return;
  const nudge = Math.sin((t - at) * 4) * 6 * (RTL() ? -1 : 1);
  ctx.save(); ctx.globalAlpha = a; ctx.direction = L.dir; ctx.font = F(700, 42); ctx.fillStyle = ink; ctx.textAlign = 'center';
  ctx.fillText(label, W / 2 + (RTL() ? 26 : -26), STRIP + 100);
  const w = ctx.measureText(label).width; ctx.fillText(L.arrow, W / 2 + (RTL() ? -w / 2 - 20 : w / 2 + 20) + nudge, STRIP + 100);
  ctx.restore();
}
function grainOver(ctx, A, t) { ctx.save(); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = 0.03; ctx.drawImage(A.grain[Math.floor(t * 12) % 3], 0, 0, W, H); ctx.restore(); }
