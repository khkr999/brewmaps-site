// CoffeeGuessr — a GeoGuessr-style Reel. Four real café photos from the app; three seconds each
// to guess the area; the photo shrinks onto a map of the UAE at the café's real coordinates.

const W = 1080, H = 1920, FPS = 30;
const NIGHT = '#0E1F0A', DEEP = '#1E3A14', FOREST = '#2B4D1F', PALE = '#9BC48A', MID = '#5C7F4A', CREAM = '#F4EFE6', SEA = '#15300E';
const CARD = { x: 96, y: 390, w: 888, h: 700, r: 34 };
const ROUND = 4.2, GUESS = 2.6, END_AT = 4 * ROUND;          // 16.8s of rounds, then the end card
const DURATION = END_AT + 2.9;

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const seg = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
const ease = u => u * u * (3 - 2 * u);
const easeOut = u => 1 - Math.pow(1 - u, 3);
const back = u => { const c = 1.9; return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); };
const mix = (a, b, u) => a + (b - a) * u;

// ─── map projection: fit the UAE into the card ─────────────────────────────
let PROJ;
function makeProjection(uae) {
  const xs = uae.flat().map(p => p[0]), ys = uae.flat().map(p => p[1]);
  const lon0 = Math.min(...xs), lon1 = Math.max(...xs), lat0 = Math.min(...ys), lat1 = Math.max(...ys);
  const k = Math.cos((lat0 + lat1) / 2 * Math.PI / 180), pad = 56;
  const sw = (lon1 - lon0) * k, sh = lat1 - lat0, s = Math.min((CARD.w - 2 * pad) / sw, (CARD.h - 2 * pad) / sh);
  const ox = CARD.x + (CARD.w - sw * s) / 2, oy = CARD.y + (CARD.h - sh * s) / 2;
  PROJ = ([lon, lat]) => [ox + (lon - lon0) * k * s, oy + (lat1 - lat) * s];
}

function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function cover(ctx, img, x, y, w, h, fy = 0.5, zoom = 1) {
  const s = Math.max(w / img.width, h / img.height) * zoom, sw = w / s, sh = h / s;
  const sx = (img.width - sw) / 2, sy = clamp((img.height - sh) * fy, 0, img.height - sh);
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}
function fitText(ctx, text, maxW, size, weight = 700) {
  let s = size; do { ctx.font = `${weight} ${s}px "DM Sans"`; s -= 2; } while (ctx.measureText(text).width > maxW && s > 18);
}
function pin(ctx, x, y, r, fill = CREAM, dot = FOREST) {       // tip at x,y
  const c = [x, y - 2.15 * r], k = Math.acos(1 / 2.15);
  ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(c[0], c[1], r, Math.PI / 2 + k, Math.PI / 2 - k + Math.PI * 2); ctx.closePath();
  ctx.fillStyle = fill; ctx.fill();
  ctx.beginPath(); ctx.arc(c[0], c[1], r * 0.42, 0, Math.PI * 2); ctx.fillStyle = dot; ctx.fill();
}

// ─── the map, zoomed towards a point ───────────────────────────────────────
function drawMap(ctx, A, focus, z, alpha) {
  const F = PROJ(focus), u = (z - 1) / 1.1, D = [mix(F[0], CARD.x + CARD.w / 2, u), mix(F[1], CARD.y + CARD.h * 0.66, u)];
  const T = p => { const q = PROJ(p); return [D[0] + (q[0] - F[0]) * z, D[1] + (q[1] - F[1]) * z]; };
  ctx.save(); ctx.globalAlpha = alpha;
  roundRect(ctx, CARD.x, CARD.y, CARD.w, CARD.h, CARD.r); ctx.clip();
  ctx.fillStyle = SEA; ctx.fillRect(CARD.x, CARD.y, CARD.w, CARD.h);
  ctx.beginPath();
  A.uae.forEach(ring => ring.forEach((p, i) => { const q = T(p); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); }));
  ctx.fillStyle = FOREST; ctx.fill('evenodd');
  ctx.lineWidth = 2.5; ctx.strokeStyle = 'rgba(155,196,138,.55)'; ctx.lineJoin = 'round'; ctx.stroke();
  ctx.fillStyle = 'rgba(155,196,138,.55)';                        // every café on the site, at its real coordinates
  A.data.dots.forEach(p => { const q = T(p); ctx.beginPath(); ctx.arc(q[0], q[1], 2.6, 0, Math.PI * 2); ctx.fill(); });
  ctx.restore();
  return T;
}

// ─── one round ─────────────────────────────────────────────────────────────
function drawRound(ctx, A, i, t) {
  const R = A.data.rounds[i], img = A.photos[i], at = [R.lng, R.lat];
  const inX = i === 0 ? 0 : (1 - easeOut(seg(t, -0.22, 0))) * 1100;        // slides in from the right as the last one leaves
  const outX = i === 3 ? 0 : -easeOut(seg(t, ROUND - 0.22, ROUND)) * 1100;  // and out to the left
  const dx = inX + outX;
  ctx.save(); ctx.translate(dx, 0);

  // reveal progress
  const rv = seg(t, GUESS, GUESS + 0.3), drop = seg(t, GUESS + 0.22, GUESS + 0.5), zoom = mix(1, 2.1, ease(seg(t, GUESS, GUESS + 0.9)));

  // map under the card, then the photo shrinking onto the pin
  let T = null;
  if (rv > 0) T = drawMap(ctx, A, at, zoom, 1);
  const P = T ? T(at) : PROJ(at);
  const thumb = 190, u = ease(rv);
  const cx = mix(CARD.x + CARD.w / 2, P[0], u), cy = mix(CARD.y + CARD.h / 2, P[1] - 2.15 * 26 - thumb / 2 - 26, u);
  const w = mix(CARD.w, thumb, u), h = mix(CARD.h, thumb, u), r = mix(CARD.r, 24, u);
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 30 * u; ctx.shadowOffsetY = 10 * u;
  roundRect(ctx, cx - w / 2 - 6 * u, cy - h / 2 - 6 * u, w + 12 * u, h + 12 * u, r + 6 * u); ctx.fillStyle = CREAM; ctx.fill();
  ctx.restore();
  ctx.save(); roundRect(ctx, cx - w / 2, cy - h / 2, w, h, r); ctx.clip();
  cover(ctx, img, cx - w / 2, cy - h / 2, w, h, R.focusY, mix(1 + 0.06 * seg(t, 0, GUESS), 1, u));
  ctx.restore();
  if (drop > 0) {                                                            // pin drops with a bounce
    const y = P[1] - (1 - back(drop)) * 120;
    ctx.save(); ctx.globalAlpha = Math.min(1, drop * 3);
    ctx.shadowColor = 'rgba(0,0,0,.4)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 5;
    pin(ctx, P[0], y, 26); ctx.restore();
    const ring = seg(t, GUESS + 0.5, GUESS + 1.2);
    if (ring > 0 && ring < 1) { ctx.beginPath(); ctx.ellipse(P[0], P[1], 20 + 70 * ring, (20 + 70 * ring) * 0.4, 0, 0, Math.PI * 2); ctx.strokeStyle = `rgba(155,196,138,${1 - ring})`; ctx.lineWidth = 4; ctx.stroke(); }
  }
  if (rv === 0) {                                                            // card frame during the guess
    roundRect(ctx, CARD.x, CARD.y, CARD.w, CARD.h, CARD.r); ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(244,239,230,.14)'; ctx.stroke();
  }

  // countdown dial, sitting on the card's bottom edge
  const cd = seg(t, 0.15, GUESS), dial = 1 - seg(t, GUESS - 0.05, GUESS + 0.15);
  if (dial > 0) {
    const n = Math.max(1, 3 - Math.floor(cd * 3)), pop = 1 + 0.18 * (1 - seg((cd * 3) % 1, 0, 0.25));
    const X = CARD.x + CARD.w / 2, Y = CARD.y + CARD.h, R0 = 78;
    ctx.save(); ctx.globalAlpha = dial; ctx.translate(X, Y); ctx.scale(dial * pop, dial * pop);
    ctx.beginPath(); ctx.arc(0, 0, R0, 0, Math.PI * 2); ctx.fillStyle = NIGHT; ctx.fill();
    ctx.beginPath(); ctx.arc(0, 0, R0 - 9, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - cd)); ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.strokeStyle = PALE; ctx.stroke();
    ctx.fillStyle = CREAM; ctx.font = '700 76px "DM Sans"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(n), 0, 4);
    ctx.restore();
  }

  // below the card: the question, then the answer
  const qa = 1 - seg(t, GUESS - 0.1, GUESS + 0.1), aa = seg(t, GUESS + 0.35, GUESS + 0.6);
  ctx.textBaseline = 'alphabetic';
  if (qa > 0) {
    ctx.globalAlpha = qa;
    accent(ctx, i === 0 ? L.hook : L.q, 1300, font(700, 84), 900);
    plain(ctx, i === 0 ? L.hookSub : L.qSub, 1362, font(500, 34), 'rgba(244,239,230,.6)');
  }
  if (aa > 0) {
    ctx.globalAlpha = aa; const lift = (1 - easeOut(aa)) * 24;
    accent(ctx, [L.area(R), '.'], 1290 + lift, font(700, 96), 860);
    plain(ctx, L.emirate(R), 1350 + lift, font(500, 34), 'rgba(244,239,230,.62)');
    // café names stay exactly as listed, in Latin script, left to right
    ctx.direction = 'ltr'; ctx.textAlign = 'center';
    fitText(ctx, `${R.cafe}  ·  ★ ${R.rating}`, 860, 32, 600); ctx.fillStyle = 'rgba(155,196,138,.95)'; ctx.fillText(`${R.cafe}  ·  ★ ${R.rating}`, W / 2, 1410 + lift);
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

// ─── words: English, or Khaleeji Arabic set right to left in Tajawal ────────
const STR = {
  en: { font: 'DM Sans', dir: 'ltr', scale: 1, title: 'COFFEEGUESSR', spacing: '4px', round: i => `ROUND ${i} / 4`,
        hook: ['Guess the area', '.'], hookSub: 'Real cafés from the app. Three seconds each.',
        q: ['Which area', '?'], qSub: 'Three seconds.',
        end: ['How many did you get', '?'], endSub: 'Comment your score out of 4.',
        l1: ['812 cafés across the UAE', '.'], l2: 'Find all of them on BrewMaps.',
        area: R => R.area, emirate: R => R.emirate },
  ar: { font: 'Tajawal', dir: 'rtl', scale: 1.1, title: 'وين الكوفي؟', spacing: '0px', round: i => `الجولة ${i} من 4`,
        hook: ['خمّن وين هالكوفي', '؟'], hookSub: 'كوفيهات حقيقية من التطبيق. ثلاث ثواني لكل وحدة.',
        q: ['وين هذا', '؟'], qSub: 'ثلاث ثواني بس.',
        end: ['كم وحدة جبتها صح', '؟'], endSub: 'اكتب لنا نتيجتك من 4 بالكومنتات 👇',
        l1: ['أكثر من ٨١٢ كوفي في كل أنحاء الإمارات', '.'], l2: 'بتحصلهم كلهم على BrewMaps.',
        area: R => R.areaAr, emirate: R => R.emirateAr },
};
let L = STR.en;
function setLang(k) { L = STR[k] || STR.en; }
const font = (w, px) => `${w} ${Math.round(px * L.scale)}px "${L.font}"`;
function plain(ctx, text, y, f, color) {
  ctx.direction = L.dir; ctx.textAlign = 'center'; ctx.font = f; ctx.fillStyle = color; ctx.fillText(text, W / 2, y);
}
// A line whose final punctuation sits in pale green. In Arabic the mark lands on the left end.
function accent(ctx, [body, mark], y, f, maxW) {
  ctx.direction = L.dir; ctx.font = f;
  let px = parseInt(f.match(/(\d+)px/)[1]);
  while (ctx.measureText(body + mark).width > maxW && px > 30) { px -= 2; ctx.font = f.replace(/\d+px/, px + 'px'); }
  const bw = ctx.measureText(body).width, mw = ctx.measureText(mark).width, x0 = (W - bw - mw) / 2;
  ctx.textAlign = 'left';
  const [bx, mx] = L.dir === 'rtl' ? [x0 + mw, x0] : [x0, x0 + bw];
  ctx.fillStyle = CREAM; ctx.fillText(body, bx, y);
  ctx.fillStyle = PALE; ctx.fillText(mark, mx, y);
}

// ─── frame ─────────────────────────────────────────────────────────────────
function header(ctx, A, i) {
  const m = A.mark, mh = 44, mw = mh * m.width / m.height, rtl = L.dir === 'rtl';
  ctx.drawImage(m, rtl ? 984 - mw : 96, 300, mw, mh);
  ctx.textBaseline = 'middle'; ctx.direction = L.dir; ctx.fillStyle = CREAM; ctx.font = font(700, 34);
  ctx.letterSpacing = L.spacing; ctx.textAlign = rtl ? 'right' : 'left';
  ctx.fillText(L.title, rtl ? 984 - mw - 18 : 96 + mw + 18, 324); ctx.letterSpacing = '0px';
  if (i != null) {
    ctx.textAlign = rtl ? 'left' : 'right'; ctx.font = font(500, 30); ctx.fillStyle = 'rgba(244,239,230,.62)';
    ctx.fillText(L.round(i + 1), rtl ? 96 : 984, 324);
  }
  ctx.textBaseline = 'alphabetic';
}

function endCard(ctx, A, t) {
  const e = seg(t, 0, 0.35);
  ctx.globalAlpha = e;
  const m = A.mark, mw = 150, mh = mw * m.height / m.width;
  ctx.drawImage(m, (W - mw) / 2, 400, mw, mh);
  accent(ctx, L.end, 650, font(700, 84), 900);
  plain(ctx, L.endSub, 718, font(500, 38), 'rgba(244,239,230,.7)');
  // the answers, as a strip of the four photos (right to left in Arabic, so round 1 reads first)
  const tw = 196, gap = 34, x0 = (W - (4 * tw + 3 * gap)) / 2;
  A.data.rounds.forEach((R, i) => {
    const slot = L.dir === 'rtl' ? 3 - i : i;
    const a = easeOut(seg(t, 0.25 + i * 0.12, 0.6 + i * 0.12)), x = x0 + slot * (tw + gap), y = 810 + (1 - a) * 40;
    ctx.save(); ctx.globalAlpha = e * a;
    roundRect(ctx, x - 5, y - 5, tw + 10, tw + 10, 26); ctx.fillStyle = CREAM; ctx.fill();
    ctx.save(); roundRect(ctx, x, y, tw, tw, 22); ctx.clip(); cover(ctx, A.photos[i], x, y, tw, tw, R.focusY); ctx.restore();
    ctx.direction = L.dir; ctx.textAlign = 'center'; ctx.font = font(700, 30);
    let px = Math.round(30 * L.scale); while (ctx.measureText(L.area(R)).width > tw + 20 && px > 18) { px -= 2; ctx.font = `700 ${px}px "${L.font}"`; }
    ctx.fillStyle = CREAM; ctx.fillText(L.area(R), x + tw / 2, y + tw + 50);
    ctx.restore();
  });
  const f = seg(t, 0.9, 1.3);
  ctx.globalAlpha = e * f;
  accent(ctx, L.l1, 1200, font(700, 44), 900);
  plain(ctx, L.l2, 1258, font(500, 34), 'rgba(244,239,230,.62)');
  ctx.globalAlpha = 1;
}

function renderFrame(ctx, t, A) {
  ctx.globalAlpha = 1; ctx.fillStyle = NIGHT; ctx.fillRect(0, 0, W, H);
  if (t < END_AT) {
    const i = Math.min(3, Math.floor(t / ROUND)), lt = t - i * ROUND;
    header(ctx, A, i);
    drawRound(ctx, A, i, lt);
    if (i < 3 && lt > ROUND - 0.22) drawRound(ctx, A, i + 1, lt - ROUND);
  } else {
    const e = seg(t, END_AT, END_AT + 0.35);
    if (e < 1) { header(ctx, A, 3); drawRound(ctx, A, 3, ROUND - 0.001); ctx.globalAlpha = e; ctx.fillStyle = NIGHT; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
    endCard(ctx, A, t - END_AT);
  }
}

if (typeof module !== 'undefined') module.exports = { DURATION, FPS };
