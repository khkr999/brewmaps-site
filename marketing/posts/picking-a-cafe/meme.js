// "Me picking a café" — the indecision meme. Real café photos from the app get swiped away while a
// timer races to 47 minutes and a friend's messages pile up. Then: "Or… open BrewMaps". The real app,
// two taps, and the timer stops at 10 seconds.

const W = 1080, H = 1920, FPS = 30, DURATION = 15.0;
const NIGHT = '#0E1F0A', FOREST = '#2B4D1F', PALE = '#9BC48A', CREAM = '#F4EFE6', SAND = '#EAE1D1', INK = '#141414';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const seg = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
const ease = u => u * u * (3 - 2 * u);
const easeOut = u => 1 - Math.pow(1 - u, 3);
const easeIn = u => u * u * u;
const back = u => { const c = 1.7; return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); };
const mix = (a, b, u) => a + (b - a) * u;

// ─── words ─────────────────────────────────────────────────────────────────
const STR = {
  en: { font: 'DM Sans', dir: 'ltr', scale: 1,
        caption: 'Me picking a café for the weekend',
        stamps: ['Too far', 'Not the vibe', 'Went yesterday', 'Maybe…', 'Nope', 'Not today', 'Later', 'Hmm', 'No', 'Nah'],
        bubbles: ['so?', 'where are we going??', '???', 'did you fall asleep 😭'],
        card: ['Or…', 'open BrewMaps'], found: ['Found it', '.'], line: ['812 cafés across the UAE', '.'] },
  ar: { font: 'Tajawal', dir: 'rtl', scale: 1.1,
        caption: 'أنا وأنا أختار كوفي للويكند',
        stamps: ['بعيد', 'مو مود', 'رحناه أمس', 'يمكن…', 'لا', 'مو اليوم', 'بعدين', 'امممم', 'لا لا', 'خلاص لا'],
        bubbles: ['يلا؟', 'وين نروح؟؟', '؟؟؟', 'نمت؟ 😭'],
        card: ['أو…', 'افتح BrewMaps'], found: ['لقيته', '.'], line: ['أكثر من ٨١٢ كوفي في كل أنحاء الإمارات', '.'] },
};
let L = STR.en;
function setLang(k) { L = STR[k] || STR.en; }
const font = (w, px) => `${w} ${Math.round(px * L.scale)}px "${L.font}"`;
function text(ctx, s, x, y, f, color, align = 'center') { ctx.direction = L.dir; ctx.textAlign = align; ctx.font = f; ctx.fillStyle = color; ctx.fillText(s, x, y); }
function accent(ctx, [body, mark], y, f, color = CREAM, markColor = PALE) {
  ctx.direction = L.dir; ctx.font = f; ctx.textAlign = 'left';
  const bw = ctx.measureText(body).width, mw = ctx.measureText(mark).width, x0 = (W - bw - mw) / 2;
  const [bx, mx] = L.dir === 'rtl' ? [x0 + mw, x0] : [x0, x0 + bw];
  ctx.fillStyle = color; ctx.fillText(body, bx, y); ctx.fillStyle = markColor; ctx.fillText(mark, mx, y);
}
function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function cover(ctx, img, x, y, w, h, fx = 0.5, fy = 0.5) {
  const s = Math.max(w / img.width, h / img.height), sw = w / s, sh = h / s;
  ctx.drawImage(img, (img.width - sw) * fx, (img.height - sh) * fy, sw, sh, x, y, w, h);
}

// ─── timing ────────────────────────────────────────────────────────────────
// Ten cards, each quicker than the last. Card 4 ("maybe") drifts right, thinks, and goes left anyway.
const DUR = [1.15, 1.0, 0.9, 1.05, 0.7, 0.62, 0.55, 0.5, 0.45, 0.4];
const START = 0.55, CARDS_END = START + DUR.reduce((a, b) => a + b, 0);   // ≈ 7.9s
const TURN = CARDS_END, ZOOM = TURN + 0.75, APP = ZOOM + 0.35, END = 12.2;
const T0 = []; DUR.reduce((t, d, i) => (T0[i] = t, t + d), START);
const BUBBLES = [2.3, 4.0, 5.6, 7.0];

// the fake clock: 00:00 until the first card, racing to 47:12 by the turn
function spiralClock(t) { const u = seg(t, START, TURN); return Math.round(47.2 * 60 * Math.pow(u, 2.1)); }
const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

// ─── pieces ────────────────────────────────────────────────────────────────
const CX = 540, CY = 950, CW = 720, CH = 900;

function stamp(ctx, label, x, y, rot, a, positive) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha *= a;
  const s = 1 + 0.5 * (1 - easeOut(a));
  ctx.scale(s, s);
  ctx.font = font(700, 70); ctx.direction = L.dir;
  const w = ctx.measureText(label).width + 64, h = 110 * L.scale;
  rr(ctx, -w / 2, -h / 2, w, h, 22); ctx.fillStyle = 'rgba(14,31,10,.42)'; ctx.fill();
  ctx.lineWidth = 8; ctx.strokeStyle = positive ? PALE : CREAM; ctx.stroke();
  ctx.fillStyle = positive ? PALE : CREAM; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, 0, 6);
  ctx.restore();
}

function card(ctx, img, dx, dy, rot, scale = 1) {
  ctx.save(); ctx.translate(CX + dx, CY + dy); ctx.rotate(rot); ctx.scale(scale, scale);
  ctx.shadowColor = 'rgba(20,16,10,.28)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 18;
  rr(ctx, -CW / 2 - 10, -CH / 2 - 10, CW + 20, CH + 20, 44); ctx.fillStyle = '#fff'; ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.save(); rr(ctx, -CW / 2, -CH / 2, CW, CH, 36); ctx.clip(); cover(ctx, img, -CW / 2, -CH / 2, CW, CH); ctx.restore();
  ctx.restore();
}

function brewCard(ctx, A, dx, dy, rot, scale = 1, grow = 0) {
  ctx.save(); ctx.translate(CX + dx, CY + dy); ctx.rotate(rot); ctx.scale(scale, scale);
  const w = mix(CW, W * 1.6, grow), h = mix(CH, H * 1.3, grow), r = mix(36, 0, grow);
  ctx.shadowColor = 'rgba(20,16,10,.28)'; ctx.shadowBlur = 40 * (1 - grow); ctx.shadowOffsetY = 18;
  rr(ctx, -w / 2, -h / 2, w, h, r); ctx.fillStyle = NIGHT; ctx.fill(); ctx.shadowColor = 'transparent';
  const fade = 1 - seg(grow, 0, 0.5);
  if (fade > 0) {
    ctx.globalAlpha = fade;
    const m = A.mark, mw = 170, mh = mw * m.height / m.width;
    ctx.drawImage(m, -mw / 2, -250, mw, mh);
    ctx.direction = L.dir; ctx.textAlign = 'center';
    ctx.font = font(500, 54); ctx.fillStyle = 'rgba(244,239,230,.7)'; ctx.fillText(L.card[0], 0, 40);
    ctx.font = font(700, 70); ctx.fillStyle = CREAM; ctx.fillText(L.card[1], 0, 140);
    ctx.globalAlpha = 1;
  }
  ctx.restore();
}

function clockChip(ctx, secs, x, y, dark, color) {
  const label = fmt(secs);
  ctx.font = '700 44px "DM Sans"'; const tw = ctx.measureText(label).width, w = tw + 110, h = 78;
  rr(ctx, x - w / 2, y - h / 2, w, h, h / 2); ctx.fillStyle = dark ? 'rgba(244,239,230,.1)' : 'rgba(20,20,20,.07)'; ctx.fill();
  const ix = x - w / 2 + 44;                                       // a little clock face
  ctx.beginPath(); ctx.arc(ix, y, 17, 0, Math.PI * 2); ctx.lineWidth = 4; ctx.strokeStyle = color; ctx.stroke();
  const a = (secs / 60) * Math.PI * 2 - Math.PI / 2;
  ctx.beginPath(); ctx.moveTo(ix, y); ctx.lineTo(ix + 10 * Math.cos(a), y + 10 * Math.sin(a)); ctx.moveTo(ix, y); ctx.lineTo(ix, y - 12); ctx.lineCap = 'round'; ctx.stroke();
  ctx.direction = 'ltr'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = color; ctx.fillText(label, ix + 30, y + 2);
  ctx.textBaseline = 'alphabetic';
}

function bubbles(ctx, t) {
  const shown = BUBBLES.map((b, i) => [b, i]).filter(([b]) => t >= b);
  const n = shown.length; if (!n) return;
  shown.forEach(([b, i], k) => {
    const a = easeOut(seg(t, b, b + 0.25)), level = n - 1 - k;          // newest at the bottom
    const y = 1455 - level * 104 - (1 - a) * 30;
    const label = L.bubbles[i];
    ctx.save(); ctx.globalAlpha = a * (level > 2 ? 0 : 1 - level * 0.12);
    ctx.font = font(600, 40); ctx.direction = L.dir;
    const w = ctx.measureText(label).width + 64, h = 82, rtl = L.dir === 'rtl';
    const x = rtl ? 984 - w : 96;
    ctx.shadowColor = 'rgba(20,16,10,.22)'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 8;
    rr(ctx, x, y - h / 2, w, h, 30); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent';
    ctx.beginPath(); const tx = rtl ? x + w - 18 : x + 18;                  // the bubble's tail
    ctx.moveTo(tx, y + h / 2 - 20); ctx.lineTo(tx + (rtl ? 20 : -20), y + h / 2 + 4); ctx.lineTo(tx + (rtl ? -14 : 14), y + h / 2 - 2); ctx.fill();
    ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, x + w / 2, y + 4);
    ctx.restore();
  });
  ctx.textBaseline = 'alphabetic';
}

// the real app: Browse by area (cropped below its header), then the Jumeirah list
const PH = { w: 580, h: 1010, x: 250, y: 410, r: 70 };
function phone(ctx, A, t) {
  const up = easeOut(seg(t, APP, APP + 0.4)), out = easeIn(seg(t, END - 0.35, END));
  const y = PH.y + (1 - up) * 700 + out * 900;
  ctx.save(); ctx.globalAlpha = 1 - out * 0.6;
  ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 50; ctx.shadowOffsetY = 20;
  rr(ctx, PH.x, y, PH.w, PH.h, PH.r); ctx.fillStyle = '#0a0a0a'; ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(244,239,230,.35)'; ctx.stroke();
  const sx = PH.x + 16, sy = y + 16, sw = PH.w - 32, sh = PH.h - 32;
  ctx.save(); rr(ctx, sx, sy, sw, sh, PH.r - 16); ctx.clip(); ctx.fillStyle = '#fff'; ctx.fillRect(sx, sy, sw, sh);
  const k = sw / 1320, second = t >= APP + 1.75;
  const slide = easeOut(seg(t, APP + 1.75, APP + 2.05));
  const drawShot = (img, top, ox) => ctx.drawImage(img, 0, top, 1320, sh / k, sx + ox, sy, sw, sh);
  if (!second || slide < 1) drawShot(A.browse, 500, -slide * sw * 0.3);
  if (second) drawShot(A.jumeirah, 0, (1 - slide) * sw);
  // taps: the Jumeirah tile, then the first café in the list
  const tap = (at, px, py) => {
    const u = seg(t, at, at + 0.45); if (u <= 0 || u >= 1) return;
    const X = sx + px * k, Y = sy + py * k;
    ctx.beginPath(); ctx.arc(X, Y, 34 * (1 - 0.3 * ease(seg(u, 0, 0.3))), 0, Math.PI * 2); ctx.fillStyle = `rgba(20,20,20,${0.28 * (1 - u)})`; ctx.fill();
    ctx.beginPath(); ctx.arc(X, Y, 34 + 60 * u, 0, Math.PI * 2); ctx.lineWidth = 5; ctx.strokeStyle = `rgba(155,196,138,${1 - u})`; ctx.stroke();
  };
  tap(APP + 1.2, 350, 900 - 500);
  tap(APP + 2.45, 700, 740);
  if (t > APP + 2.75) {                                                  // the pick lights up
    const g = seg(t, APP + 2.75, APP + 3.0);
    rr(ctx, sx + 6, sy + 655 * k, sw - 12, 170 * k, 16); ctx.lineWidth = 6; ctx.strokeStyle = `rgba(155,196,138,${g})`; ctx.stroke();
  }
  ctx.restore(); ctx.restore();
}

// ─── frame ─────────────────────────────────────────────────────────────────
function renderFrame(ctx, t, A) {
  const green = seg(t, ZOOM, ZOOM + 0.35);
  ctx.globalAlpha = 1; ctx.fillStyle = SAND; ctx.fillRect(0, 0, W, H);

  if (t < APP + 0.2) {
    // the BrewMaps card waits underneath the last photos
    if (t < TURN && t > T0[DUR.length - 3]) {
      const rise = ease(seg(t, T0[DUR.length - 1], TURN));
      brewCard(ctx, A, 0, mix(22, 0, rise), mix(-0.035, 0, rise), mix(0.965, 1, rise));
    }
    // the stack: draw back to front
    for (let i = DUR.length - 1; i >= 0; i--) {
      const lt = t - T0[i], d = DUR[i];
      if (lt > d) continue;                                                // already gone
      const depth = Math.max(0, i - DUR.findIndex((_, j) => t - T0[j] <= DUR[j]));
      if (depth > 2) continue;
      const settle = depth === 0 ? 0 : depth;
      const baseRot = [0, -0.035, 0.03][settle] || 0, baseY = settle * 22, baseS = 1 - settle * 0.035;
      if (depth > 0 || lt < 0) { card(ctx, A.cards[i], 0, baseY, baseRot, baseS); continue; }
      // the top card: stamp, then swipe
      const st = seg(lt, d * 0.3, d * 0.5), out = easeIn(seg(lt, d * 0.62, d));
      let dx, rot;
      if (i === 3) {                                                       // "maybe…": right, pause, then left after all
        const r = ease(seg(lt, 0.15, 0.45)) * (1 - ease(seg(lt, 0.55, 0.72)));
        dx = 190 * r - out * 1300; rot = 0.12 * r - out * 0.35;
      } else { dx = -out * 1300; rot = -out * 0.35; }
      card(ctx, A.cards[i], dx, out * 80, rot);
      const pos = i === 3 && lt < 0.6;
      if (st > 0) {
        ctx.save(); ctx.translate(dx, 0);
        stamp(ctx, L.stamps[i], CX + (pos ? -170 : 150) * (L.dir === 'rtl' ? -1 : 1), CY - 300, pos ? -0.2 : 0.2, st, pos);
        ctx.restore();
      }
    }
    if (t >= TURN) brewCard(ctx, A, 0, 0, 0, 1 + 0.04 * back(seg(t, TURN, TURN + 0.4)) - 0.04, easeIn(seg(t, ZOOM, ZOOM + 0.35)));
    if (green < 1) {
      ctx.globalAlpha = 1 - green;
      text(ctx, L.caption, W / 2, 345, font(700, 56), INK);
      clockChip(ctx, spiralClock(t), W / 2, 424, false, INK);
      bubbles(ctx, t);
      ctx.globalAlpha = 1;
    }
  }
  if (green >= 1 || t >= APP) { ctx.fillStyle = NIGHT; ctx.fillRect(0, 0, W, H); }

  if (t >= APP && t < END) {
    phone(ctx, A, t);
    const secs = Math.min(10, Math.round(10 * seg(t, APP, APP + 3.0)));
    clockChip(ctx, secs, W / 2, 330, true, t > APP + 3.0 ? PALE : CREAM);
  }
  if (t >= END - 0.1) {                                                   // payoff: 47:12 vs 00:10
    const e = ease(seg(t, END - 0.1, END + 0.3));
    ctx.globalAlpha = e;
    const m = A.mark, mw = 150, mh = mw * m.height / m.width;
    ctx.drawImage(m, (W - mw) / 2, 470, mw, mh);
    accent(ctx, L.found, 790, font(700, 128));
    const r = easeOut(seg(t, END + 0.35, END + 0.75));
    ctx.globalAlpha = e * r;
    ctx.font = '700 64px "DM Sans"'; ctx.direction = 'ltr'; ctx.textAlign = 'center';
    const lx = L.dir === 'rtl' ? 700 : 380, rx = L.dir === 'rtl' ? 380 : 700;   // read in order: before, then after
    ctx.fillStyle = 'rgba(244,239,230,.45)'; ctx.fillText('47:12', lx, 950);
    const w47 = ctx.measureText('47:12').width;
    ctx.beginPath(); ctx.moveTo(lx - w47 / 2 - 6, 928); ctx.lineTo(lx + w47 / 2 + 6, 928); ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(244,239,230,.6)'; ctx.stroke();
    ctx.fillStyle = PALE; ctx.fillText('00:10', rx, 950);
    ctx.font = '500 44px "DM Sans"'; ctx.fillStyle = 'rgba(244,239,230,.5)'; ctx.fillText(L.dir === 'rtl' ? '←' : '→', 540, 944);
    const f = seg(t, END + 0.8, END + 1.2);
    ctx.globalAlpha = e * f;
    accent(ctx, L.line, 1090, font(500, 40), 'rgba(244,239,230,.75)');
    ctx.globalAlpha = 1;
  }
}

if (typeof module !== 'undefined') module.exports = { DURATION, FPS };
