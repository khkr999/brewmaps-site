// "Hidden under 20": four cafés rated 4.8+, with fewer than 150 reviews and a latte under AED 20.
// A useful hook, a guess-the-price beat on each café, the real app, then "save this".

const W = 1080, H = 1920, FPS = 30;
const NIGHT = '#0E1F0A', DEEP = '#1E3A14', FOREST = '#2B4D1F', PALE = '#9BC48A', CREAM = '#F4EFE6';
const HOOK = 2.4, ITEM = 2.7, N = 4, APP_AT = HOOK + N * ITEM, END_AT = APP_AT + 2.2, DURATION = END_AT + 2.6;

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const seg = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
const ease = u => u * u * (3 - 2 * u);
const easeOut = u => 1 - Math.pow(1 - u, 3);
const back = u => { const c = 1.7; return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); };
const mix = (a, b, u) => a + (b - a) * u;

// ─── words ─────────────────────────────────────────────────────────────────
const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';
const STR = {
  en: { font: 'DM Sans', dir: 'ltr', scale: 1, n: s => String(s),
        hook: ['4 cafés rated 4.8+', 'with a latte under AED 20', '…that almost nobody knows about'],
        guess: 'The latte?', cur: v => `AED ${v}`, median: m => `UAE median: AED ${m}`,
        reviews: r => `only ${r} reviews`, of: (i, n) => `${i}/${n}`,
        app: ['All of them are on BrewMaps', 'Search by area'], save: ['Save this for your next coffee run', '.'],
        fine: 'Menu prices and ratings as listed on BrewMaps.',
        area: c => c.area === c.emirate ? c.area : `${c.area} · ${c.emirate}` },
  ar: { font: 'Tajawal', dir: 'rtl', scale: 1.1, n: s => String(s).replace(/\d/g, d => AR_DIGITS[d]).replace('.', '٫'),
        hook: ['٤ كوفيهات تقييمها ٤٫٨ وفوق', 'واللاتيه أقل من ٢٠ درهم', '…ومحد يدري عنهم'],
        guess: 'اللاتيه بكم؟', cur: v => `${v} درهم`, median: m => `متوسط الإمارات ${m} درهم`,
        reviews: r => `${r} تقييم بس`, of: (i, n) => `${i} من ${n}`,
        app: ['كلهم على BrewMaps', 'دوّر حسب المنطقة'], save: ['احفظ الفيديو لطلعتك الجاية', '.'],
        fine: 'الأسعار والتقييمات كما هي على BrewMaps.',
        area: c => c.areaAr === c.emirateAr ? c.areaAr : `${c.areaAr} · ${c.emirateAr}` },
};
let L = STR.en;
function setLang(k) { L = STR[k] || STR.en; }
const font = (w, px, fam) => `${w} ${Math.round(px * (fam ? 1 : L.scale))}px "${fam || L.font}"`;
function text(ctx, s, x, y, f, color, align = 'center', dir = L.dir) { ctx.direction = dir; ctx.textAlign = align; ctx.font = f; ctx.fillStyle = color; ctx.fillText(s, x, y); }
function fit(ctx, s, maxW, f) { ctx.font = f; let px = parseInt(f.match(/(\d+)px/)[1]); while (ctx.measureText(s).width > maxW && px > 20) { px -= 2; ctx.font = f.replace(/\d+px/, px + 'px'); } return ctx.font; }
function accent(ctx, [body, mark], y, f, maxW = 900) {
  ctx.direction = L.dir; ctx.font = fit(ctx, body + mark, maxW, f); ctx.textAlign = 'left';
  const bw = ctx.measureText(body).width, mw = ctx.measureText(mark).width, x0 = (W - bw - mw) / 2;
  const [bx, mx] = L.dir === 'rtl' ? [x0 + mw, x0] : [x0, x0 + bw];
  ctx.fillStyle = CREAM; ctx.fillText(body, bx, y); ctx.fillStyle = PALE; ctx.fillText(mark, mx, y);
}
function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function cover(ctx, img, x, y, w, h, fy = 0.5, z = 1) {
  const s = Math.max(w / img.width, h / img.height) * z, sw = w / s, sh = h / s;
  ctx.drawImage(img, (img.width - sw) / 2, clamp((img.height - sh) * fy, 0, img.height - sh), sw, sh, x, y, w, h);
}
function chip(ctx, label, x, y, f, bg, fg, anchor) {         // anchor: 'l' or 'r' edge at x
  ctx.font = f; ctx.direction = L.dir; const w = ctx.measureText(label).width + 44, h = 64;
  const x0 = anchor === 'r' ? x - w : x;
  rr(ctx, x0, y, w, h, 32); ctx.fillStyle = bg; ctx.fill();
  ctx.fillStyle = fg; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, x0 + w / 2, y + h / 2 + 3); ctx.textBaseline = 'alphabetic';
}

// ─── hook ──────────────────────────────────────────────────────────────────
function hook(ctx, A, t) {
  // the four photos, dark, drifting behind the promise
  ctx.save(); ctx.globalAlpha = 0.34;
  const tw = 520, th = 700;
  A.photos.forEach((img, i) => {
    const x = (i % 2) * 560 + 20 - 40 + 30 * Math.sin(t * 0.6 + i), y = Math.floor(i / 2) * 760 + 210 + 20 * Math.cos(t * 0.5 + i);
    ctx.save(); rr(ctx, x, y, tw, th, 36); ctx.clip(); cover(ctx, img, x, y, tw, th, A.data.cafes[i].focusY, 1.05); ctx.restore();
  });
  ctx.restore();
  ctx.fillStyle = 'rgba(14,31,10,.55)'; ctx.fillRect(0, 0, W, H);
  const a = [1, 1, easeOut(seg(t, 0.6, 0.85))];                 // the promise is on frame one: it's the thumbnail
  ctx.save(); ctx.globalAlpha = a[0]; text(ctx, L.hook[0], W / 2, 820 - (1 - a[0]) * 20, fit(ctx, L.hook[0], 920, font(700, 86)), CREAM); ctx.restore();
  ctx.save(); ctx.globalAlpha = a[1]; text(ctx, L.hook[1], W / 2, 930 - (1 - a[1]) * 20, fit(ctx, L.hook[1], 920, font(700, 86)), PALE); ctx.restore();
  ctx.save(); ctx.globalAlpha = a[2]; text(ctx, L.hook[2], W / 2, 1040, font(500, 52), 'rgba(244,239,230,.8)'); ctx.restore();
}

// ─── one café ──────────────────────────────────────────────────────────────
const CARD = { x: 96, y: 330, w: 888, h: 860, r: 40 };
function item(ctx, A, i, t) {
  const C = A.data.cafes[i], img = A.photos[i], rtl = L.dir === 'rtl';
  const inX = (1 - easeOut(seg(t, -0.25, 0))) * 1100 * (rtl ? -1 : 1);
  const outX = (i === N - 1 ? 0 : -easeOut(seg(t, ITEM - 0.25, ITEM)) * 1100) * (rtl ? -1 : 1);
  ctx.save(); ctx.translate(inX + outX, 0);

  // photo card
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 16;
  rr(ctx, CARD.x, CARD.y, CARD.w, CARD.h, CARD.r); ctx.fillStyle = DEEP; ctx.fill(); ctx.restore();
  ctx.save(); rr(ctx, CARD.x, CARD.y, CARD.w, CARD.h, CARD.r); ctx.clip();
  cover(ctx, img, CARD.x, CARD.y, CARD.w, CARD.h, C.focusY, 1 + 0.05 * seg(t, 0, ITEM));
  const g = ctx.createLinearGradient(0, CARD.y + CARD.h - 260, 0, CARD.y + CARD.h); g.addColorStop(0, 'rgba(14,31,10,0)'); g.addColorStop(1, 'rgba(14,31,10,.75)');
  ctx.fillStyle = g; ctx.fillRect(CARD.x, CARD.y, CARD.w, CARD.h);
  ctx.restore();
  // chips: position in the list, and the area
  const edge = rtl ? CARD.x + CARD.w - 28 : CARD.x + 28, anc = rtl ? 'r' : 'l';
  chip(ctx, L.n(L.of(i + 1, N)), edge, CARD.y + 28, font(700, 30), 'rgba(14,31,10,.72)', CREAM, anc);
  ctx.font = font(700, 36); ctx.direction = L.dir;
  const al = L.area(C); chip(ctx, al, edge, CARD.y + CARD.h - 96, font(700, 36), 'rgba(244,239,230,.92)', NIGHT, anc);

  // name and the hidden-ness: rating with its (small) review count
  const nm = C.cafe;
  text(ctx, nm, W / 2, 1290, fit(ctx, nm, 900, font(700, 60, 'DM Sans')), CREAM, 'center', 'ltr');
  const rt = `★ ${L.n(C.rating.toFixed(1))}  ·  ${L.n(L.reviews(C.reviews))}`;
  text(ctx, rt, W / 2, 1350, font(500, 36), 'rgba(244,239,230,.7)');

  // the guess: "the latte?" and a rolling price, then the real one
  const q = seg(t, 0.45, 0.6), land = seg(t, 1.35, 1.5);
  if (q > 0) {
    ctx.save(); ctx.globalAlpha = q;
    text(ctx, L.guess, W / 2, 1440, font(500, 38), 'rgba(155,196,138,.9)');
    let shown;
    if (land < 1) { shown = L.cur(L.dir === 'rtl' ? '؟؟' : '??'); ctx.globalAlpha = q * (0.45 + 0.35 * Math.abs(Math.sin(t * 9))); }  // no fake numbers, ever
    else shown = L.cur(L.n(C.latte));
    const pop = land >= 1 ? 1 + 0.18 * (1 - easeOut(seg(t, 1.5, 1.75))) : 1;
    ctx.save(); ctx.translate(W / 2, 1545); ctx.scale(pop, pop);
    text(ctx, shown, 0, 0, font(700, 104), land >= 1 ? PALE : CREAM);
    ctx.restore(); ctx.restore();
    const m = seg(t, 1.7, 1.9);
    if (m > 0) { ctx.save(); ctx.globalAlpha = m; text(ctx, L.n(L.median(A.data.median)), W / 2, 1612, font(500, 32), 'rgba(244,239,230,.55)'); ctx.restore(); }
  }
  ctx.restore();
}

// ─── the app ───────────────────────────────────────────────────────────────
function phone(ctx, A, t) {
  const up = easeOut(seg(t, 0, 0.4)), w = 560, h = 980, x = (W - w) / 2, y = 520 + (1 - up) * 800;
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 50; ctx.shadowOffsetY = 20;
  rr(ctx, x, y, w, h, 70); ctx.fillStyle = '#0a0a0a'; ctx.fill(); ctx.restore();
  rr(ctx, x, y, w, h, 70); ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(244,239,230,.35)'; ctx.stroke();
  const sx = x + 16, sy = y + 16, sw = w - 32, sh = h - 32, k = sw / A.page.width;
  ctx.save(); rr(ctx, sx, sy, sw, sh, 54); ctx.clip(); ctx.fillStyle = '#fff'; ctx.fillRect(sx, sy, sw, sh);
  const maxS = A.page.height - sh / k, sc = maxS * ease(seg(t, 0.45, 1.9));
  ctx.drawImage(A.page, 0, sc, A.page.width, sh / k, sx, sy, sw, sh);
  ctx.drawImage(A.bar, sx, sy + sh - A.bar.height * k, sw, A.bar.height * k);
  ctx.restore();
  const a = easeOut(seg(t, 0.1, 0.4));
  ctx.save(); ctx.globalAlpha = a;
  text(ctx, L.app[0], W / 2, 380, fit(ctx, L.app[0], 900, font(700, 64)), CREAM);
  text(ctx, L.app[1], W / 2, 450, font(500, 40), PALE);
  ctx.restore();
}

// ─── end ───────────────────────────────────────────────────────────────────
function endCard(ctx, A, t) {
  const e = ease(seg(t, 0, 0.35));
  ctx.globalAlpha = e;
  const m = A.mark, mw = 150, mh = mw * m.height / m.width;
  ctx.drawImage(m, (W - mw) / 2, 560, mw, mh);
  accent(ctx, L.save, 820, font(700, 76), 920);
  // the four finds, as a strip: name, area, price
  const tw = 196, gap = 34, x0 = (W - (4 * tw + 3 * gap)) / 2;
  A.data.cafes.forEach((C, i) => {
    const slot = L.dir === 'rtl' ? 3 - i : i, a = easeOut(seg(t, 0.3 + i * 0.1, 0.65 + i * 0.1));
    const x = x0 + slot * (tw + gap), y = 920 + (1 - a) * 30;
    ctx.save(); ctx.globalAlpha = e * a;
    ctx.save(); rr(ctx, x, y, tw, tw, 24); ctx.clip(); cover(ctx, A.photos[i], x, y, tw, tw, C.focusY); ctx.restore();
    text(ctx, L.cur(L.n(C.latte)), x + tw / 2, y + tw + 50, font(700, 36), PALE);
    const a2 = L.dir === 'rtl' ? C.areaAr : C.area;
    text(ctx, a2, x + tw / 2, y + tw + 94, fit(ctx, a2, tw + 24, font(500, 26)), 'rgba(244,239,230,.7)');
    ctx.restore();
  });
  const f = seg(t, 1.1, 1.4); ctx.globalAlpha = e * f;
  text(ctx, L.fine, W / 2, 1300, font(500, 26), 'rgba(244,239,230,.45)');
  ctx.globalAlpha = 1;
}

// ─── frame ─────────────────────────────────────────────────────────────────
function renderFrame(ctx, t, A) {
  ctx.globalAlpha = 1; ctx.fillStyle = NIGHT; ctx.fillRect(0, 0, W, H);
  if (t < HOOK) { hook(ctx, A, t); if (t > HOOK - 0.25) item(ctx, A, 0, t - HOOK); return; }
  if (t < APP_AT) {
    const i = Math.min(N - 1, Math.floor((t - HOOK) / ITEM)), lt = t - HOOK - i * ITEM;
    item(ctx, A, i, lt);
    if (i < N - 1 && lt > ITEM - 0.25) item(ctx, A, i + 1, lt - ITEM);
    if (i === N - 1 && lt > ITEM - 0.3) { ctx.globalAlpha = seg(lt, ITEM - 0.3, ITEM); ctx.fillStyle = NIGHT; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
    return;
  }
  if (t < END_AT) { phone(ctx, A, t - APP_AT); if (t > END_AT - 0.3) { ctx.globalAlpha = seg(t, END_AT - 0.3, END_AT); ctx.fillStyle = NIGHT; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; } return; }
  endCard(ctx, A, t - END_AT);
}

if (typeof module !== 'undefined') module.exports = { DURATION, FPS };
