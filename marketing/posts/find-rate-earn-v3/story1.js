// Find · Rate · Earn, V3 — Story 1: تلقى.
// Khaleeji friend voice, no feature names. A drawn street of cafés slides past; a pin drops on one
// and its lights come on. Forest green ground; cream, sand and warm light inside the scene.

const W = 1080, H = 1920, FPS = 30, DURATION = 6.5;
const NIGHT = '#0E1F0A', FOREST = '#2B4D1F', DEEP = '#1E3A14', PALE = '#9BC48A', CREAM = '#F4EFE6', SAND = '#EAE1D1';
const COFFEE = '#7A4E33', WARM = '#F2D9A2', WARM2 = '#E4B96E';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const mix = (a, b, u) => a + (b - a) * u;
const seg = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
const eo = u => 1 - Math.pow(1 - u, 3);
const io = u => u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
const settle = u => u >= 1 ? 1 : 1 - Math.pow(1 - u, 3) * Math.cos(u * Math.PI * 1.4);

const STR = {
  ar: { dir: 'rtl', f: 'Tajawal', h1: 'تدوّر كوفي عدل؟', h2: 'BrewMaps فيه أكثر من ٨١٢ كوفي بالإمارات', next: 'التالي', arrow: '←' },
  en: { dir: 'ltr', f: 'DM Sans', h1: 'Looking for a good café?', h2: 'BrewMaps has 812+ cafés across the UAE', next: 'Next', arrow: '→' },
};
let L = STR.ar;
function setLang(k) { L = STR[k] || STR.ar; }
const RTL = () => L.dir === 'rtl';
const EDGE = () => RTL() ? 984 : 96;
const F = (w, px, fam) => `${w} ${px}px "${fam || L.f}"`;

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
function rect(ctx, x, y, w, h, fill, line, lw = 6, r = 0) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (line) stroke(ctx, line, lw); }

// ─── the street ────────────────────────────────────────────────────────────
const GROUND = 1500, FW = 330, GAP = 44;
function cupIcon(ctx, cx, cy, s, color, lw = 5) {
  ctx.beginPath(); ctx.moveTo(cx - 22 * s, cy - 14 * s); ctx.lineTo(cx + 22 * s, cy - 14 * s);
  ctx.bezierCurveTo(cx + 21 * s, cy + 12 * s, cx + 11 * s, cy + 18 * s, cx, cy + 18 * s); ctx.bezierCurveTo(cx - 11 * s, cy + 18 * s, cx - 21 * s, cy + 12 * s, cx - 22 * s, cy - 14 * s);
  stroke(ctx, color, lw); ctx.beginPath(); ctx.arc(cx + 25 * s, cy - 3 * s, 7 * s, -Math.PI / 2, Math.PI / 2); stroke(ctx, color, lw);
}
function windowGlass(ctx, x, y, w, h, lit, r = 10) {
  ctx.save(); ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.clip();
  if (lit > 0) {
    ctx.fillStyle = NIGHT; ctx.fillRect(x, y, w, h);
    ctx.globalAlpha = lit; const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, WARM); g.addColorStop(1, WARM2);
    ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
    for (const px of [x + w * 0.3, x + w * 0.7]) {                      // pendant lamps and a counter, seen through the glass
      ctx.beginPath(); ctx.moveTo(px, y); ctx.lineTo(px, y + 34); stroke(ctx, COFFEE, 3);
      ctx.beginPath(); ctx.moveTo(px - 16, y + 50); ctx.lineTo(px, y + 34); ctx.lineTo(px + 16, y + 50); ctx.closePath(); ctx.fillStyle = COFFEE; ctx.fill();
    }
    rect(ctx, x - 4, y + h - 46, w + 8, 46, COFFEE);
    ctx.globalAlpha = 1;
  } else { ctx.fillStyle = NIGHT; ctx.fillRect(x, y, w, h); }
  ctx.beginPath(); ctx.moveTo(x + w * 0.15, y + h * 0.1); ctx.lineTo(x + w * 0.05, y + h * 0.35); ctx.globalAlpha = 0.25; stroke(ctx, CREAM, 5); ctx.globalAlpha = 1;
  ctx.restore();
  rect(ctx, x, y, w, h, null, FOREST, 6, r);
}
// four storefront types, all in the same line language
function storefront(ctx, x, type, lit) {
  const top = GROUND - 470, face = type % 2 ? SAND : CREAM;
  rect(ctx, x, top, FW, GROUND - top, face, FOREST, 6);                 // facade
  rect(ctx, x - 10, top - 22, FW + 20, 26, FOREST, null);              // parapet
  // sign board with a cup (no names: these are not real cafés)
  if (type !== 2) { rect(ctx, x + FW / 2 - 80, top + 22, 160, 64, FOREST, null, 0, 8); cupIcon(ctx, x + FW / 2 - 4, top + 56, 1, CREAM); }
  else {                                                                // a round hanging sign instead
    ctx.beginPath(); ctx.moveTo(x + FW - 40, top + 30); ctx.lineTo(x + FW + 30, top + 30); stroke(ctx, FOREST, 5);
    ctx.beginPath(); ctx.arc(x + FW + 30, top + 80, 34, 0, 7); ctx.fillStyle = FOREST; ctx.fill(); cupIcon(ctx, x + FW + 28, top + 82, 0.8, CREAM, 4);
  }
  const door = { x: x + FW - 106, y: GROUND - 250, w: 76, h: 250 };
  if (type === 0) {                                                     // scalloped striped awning
    const ay = top + 112, ah = 64;
    ctx.save(); ctx.beginPath(); ctx.moveTo(x + 8, ay); ctx.lineTo(x + FW - 8, ay); ctx.lineTo(x + FW + 14, ay + ah);
    for (let k = 7; k >= 0; k--) { const sx = x - 14 + (FW + 28) * (k + 0.5) / 8; ctx.arc(sx, ay + ah, (FW + 28) / 16, 0, Math.PI); }
    ctx.closePath(); ctx.clip();
    for (let k = 0; k < 8; k++) { ctx.fillStyle = k % 2 ? CREAM : FOREST; ctx.fillRect(x - 14 + (FW + 28) * k / 8, ay, (FW + 28) / 8 + 1, ah + 30); }
    ctx.restore();
    windowGlass(ctx, x + 26, top + 210, 170, 200, lit);
  } else if (type === 1) {                                              // flat coffee-brown awning, two windows
    rect(ctx, x - 6, top + 112, FW + 12, 34, COFFEE, FOREST, 5, 6);
    windowGlass(ctx, x + 22, top + 180, 88, 230, lit, 8); windowGlass(ctx, x + 122, top + 180, 88, 230, lit, 8);
  } else if (type === 2) {                                              // arched window
    ctx.save(); ctx.beginPath(); ctx.moveTo(x + 28, GROUND - 90); ctx.lineTo(x + 28, top + 220); ctx.arc(x + 118, top + 220, 90, Math.PI, 0); ctx.lineTo(x + 208, GROUND - 90); ctx.closePath();
    ctx.clip(); windowGlass(ctx, x + 28, top + 130, 180, GROUND - 90 - top - 130, lit, 0); ctx.restore();
    ctx.beginPath(); ctx.moveTo(x + 28, GROUND - 90); ctx.lineTo(x + 28, top + 220); ctx.arc(x + 118, top + 220, 90, Math.PI, 0); ctx.lineTo(x + 208, GROUND - 90); stroke(ctx, FOREST, 6);
  } else {                                                              // wide window with a planter box
    windowGlass(ctx, x + 22, top + 150, 190, 210, lit);
    rect(ctx, x + 18, top + 360, 198, 40, FOREST, null, 0, 6);
    for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.arc(x + 40 + k * 38, top + 358, 18, Math.PI, 0); ctx.fillStyle = PALE; ctx.fill(); }
  }
  // door, with its own small window
  rect(ctx, door.x, door.y, door.w, door.h, DEEP, FOREST, 6, 6);
  windowGlass(ctx, door.x + 14, door.y + 20, door.w - 28, 90, lit, 6);
  ctx.beginPath(); ctx.arc(door.x + 14, door.y + 150, 5, 0, 7); ctx.fillStyle = CREAM; ctx.fill();
  // a pot plant by the door
  rect(ctx, x + FW - 24, GROUND - 58, 40, 58, COFFEE, FOREST, 5, 6);
  ctx.beginPath(); ctx.ellipse(x + FW - 4, GROUND - 92, 30, 40, 0, 0, 7); ctx.fillStyle = PALE; ctx.fill(); stroke(ctx, FOREST, 5);
  // light spilling onto the pavement when lit
  if (lit > 0) {
    ctx.save(); ctx.globalAlpha = 0.35 * lit; ctx.beginPath(); ctx.moveTo(door.x - 10, GROUND); ctx.lineTo(door.x + door.w + 10, GROUND); ctx.lineTo(door.x + door.w + 70, GROUND + 70); ctx.lineTo(door.x - 70, GROUND + 70); ctx.closePath();
    ctx.fillStyle = WARM; ctx.fill(); ctx.restore();
  }
}
function lamp(ctx, x, on) {
  ctx.beginPath(); ctx.moveTo(x, GROUND); ctx.lineTo(x, GROUND - 330); stroke(ctx, CREAM, 6);
  ctx.beginPath(); ctx.moveTo(x - 20, GROUND - 330); ctx.lineTo(x + 20, GROUND - 330); ctx.lineTo(x + 12, GROUND - 360); ctx.lineTo(x - 12, GROUND - 360); ctx.closePath(); ctx.fillStyle = CREAM; ctx.fill();
  ctx.save(); ctx.globalAlpha = 0.1; ctx.beginPath(); ctx.arc(x, GROUND - 320, 44, 0, 7); ctx.fillStyle = WARM; ctx.fill(); ctx.restore();
}

const TYPES = [1, 3, 0, 2, 0, 3, 1, 2, 3, 1, 0, 2], TARGET = 4, SC = 1.3, BASE = 1575;
function street(ctx, t) {
  // the row slides in reading direction and eases to a stop with the target café centred
  const pan = eo(seg(t, 0, 3.0)), shift = (1 - pan) * 1250 * (RTL() ? -1 : 1);
  const x0 = 540 - FW / 2 - TARGET * (FW + GAP) + shift;
  // pavement
  ctx.fillStyle = DEEP; ctx.fillRect(-200, GROUND, W + 400, 90);
  ctx.beginPath(); ctx.moveTo(-200, GROUND); ctx.lineTo(W + 200, GROUND); stroke(ctx, CREAM, 5);
  for (let k = -2; k < 30; k++) { const px = ((x0 % 120) + 120) % 120 + k * 120 - 240; ctx.beginPath(); ctx.moveTo(px, GROUND + 18); ctx.lineTo(px + 40, GROUND + 18); ctx.globalAlpha = 0.25; stroke(ctx, CREAM, 4); ctx.globalAlpha = 1; }
  const litAt = seg(t, 3.55, 4.1);
  TYPES.forEach((ty, i) => {
    const x = x0 + i * (FW + GAP);
    if (x > W + 260 || x + FW < -260) return;
    storefront(ctx, x, ty, i === TARGET ? mix(0.45, 1, eo(litAt)) : 0.45);
    lamp(ctx, x + FW + GAP / 2, 0);
  });
  return x0 + TARGET * (FW + GAP);
}
function pinDrop(ctx, t, tx) {
  const u = seg(t, 2.95, 3.6); if (u <= 0) return;
  const s = settle(u), tipY = GROUND - 470 - 36, y = tipY - (1 - s) * 700, x = tx + FW / 2, r = 54;
  ctx.save(); ctx.globalAlpha = Math.min(1, u * 4);
  ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 10;
  const cy = y - 2.1 * r, k = Math.acos(1 / 2.1);
  ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, cy, r, Math.PI / 2 + k, Math.PI / 2 - k + Math.PI * 2); ctx.closePath(); ctx.fillStyle = CREAM; ctx.fill();
  ctx.shadowColor = 'transparent'; stroke(ctx, FOREST, 6);
  cupIcon(ctx, x - 4, cy + 2, 1.35, FOREST, 6);
  ctx.restore();
}

// hand-off: the next Story's colour (cream) rises as a strip carrying "next"
const STRIP = 1640;
function handTo(ctx, t, at, color, ink, label) {
  const u = io(seg(t, at, at + 0.6)); if (u <= 0) return;
  ctx.fillStyle = color; ctx.fillRect(0, H - (H - STRIP) * u, W, (H - STRIP) * u);
  const a = eo(seg(t, at + 0.45, at + 0.85)); if (a <= 0) return;
  const nudge = Math.sin((t - at) * 4) * 6 * (RTL() ? -1 : 1);
  ctx.save(); ctx.globalAlpha = a; ctx.direction = L.dir; ctx.font = F(700, 44); ctx.fillStyle = ink; ctx.textAlign = 'center';
  ctx.fillText(label, W / 2 + (RTL() ? 22 : -22), STRIP + 100);
  const w = ctx.measureText(label).width; ctx.fillText(L.arrow, W / 2 + (RTL() ? -w / 2 - 22 : w / 2 + 22) + nudge, STRIP + 100);
  ctx.restore();
}

// an evening sky: a crescent and a few stars that twinkle slowly
function sky(ctx, t) {
  const mx = RTL() ? 210 : W - 210, my = 780, a = eo(seg(t, 0.2, 0.9));
  ctx.save(); ctx.globalAlpha = a;
  // crescent: clip away the bite (keeps the background gradient intact), then draw the disc
  ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.arc(mx + (RTL() ? 22 : -22), my - 14, 44, 0, Math.PI * 2); ctx.clip('evenodd');
  ctx.beginPath(); ctx.arc(mx, my, 50, 0, Math.PI * 2); ctx.fillStyle = CREAM; ctx.fill();
  ctx.restore();
  [[430, 720, 0], [620, 790, 1.3], [820, 700, 2.1], [330, 860, 0.7], [960, 850, 2.8], [120, 690, 1.9]].forEach(([x, y, ph]) => {
    const tw = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * 2.2 + ph));
    const X = RTL() ? x : W - x;
    ctx.save(); ctx.globalAlpha = a * tw; ctx.fillStyle = CREAM; ctx.beginPath();
    for (let i = 0; i < 8; i++) { const ang = i * Math.PI / 4, r = i % 2 ? 3 : 9; ctx.lineTo(X + r * Math.cos(ang), y + r * Math.sin(ang)); }
    ctx.closePath(); ctx.fill(); ctx.restore();
  });
}

function renderFrame(ctx, t, A) {
  ctx.globalAlpha = 1; ctx.fillStyle = FOREST; ctx.fillRect(0, 0, W, H);
  const g = ctx.createRadialGradient(W / 2, 1200, 100, W / 2, 1200, 1100); g.addColorStop(0, 'rgba(242,217,162,.08)'); g.addColorStop(1, 'rgba(0,0,0,.08)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const m = A.mark, mh = 42, mw = mh * m.width / m.height;
  ctx.drawImage(m, RTL() ? 984 - mw : 96, 240, mw, mh);
  const al = RTL() ? 'right' : 'left';
  text(ctx, L.h1, EDGE(), 480, F(800, 116), CREAM, al, 1);
  text(ctx, L.h2, EDGE(), 590, F(500, 50), CREAM, al, seg(t, 0.3, 0.7), 0.85);
  sky(ctx, t);
  ctx.save(); ctx.translate(540, BASE); ctx.scale(SC, SC); ctx.translate(-540, -GROUND);     // the whole street, 30% larger
  const tx = street(ctx, t);
  pinDrop(ctx, t, tx);
  ctx.restore();
  handTo(ctx, t, 4.8, CREAM, FOREST, L.next);
  ctx.save(); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = 0.03; ctx.drawImage(A.grain[Math.floor(t * 12) % 3], 0, 0, W, H); ctx.restore();
}
if (typeof module !== 'undefined') module.exports = {};
