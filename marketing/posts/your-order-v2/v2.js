// BrewMaps Premium Reel V2 — "قهوتك تقول عنك وايد"
// Editorial layouts: oversized type anchored to the reading edge, line drawings bleeding off the other
// edge, one thin data footer per drink, masked reveals in reading direction. Four surface tones, grain.

const W = 1080, H = 1920, FPS = 30;
const NIGHT = '#0E1F0A', FOREST = '#2B4D1F', PALE = '#9BC48A', CREAM = '#F4EFE6', SAND = '#EAE1D1', INK = '#141414';
const AR = '٠١٢٣٤٥٦٧٨٩';
const T = [0, 0.8, 2.4, 4.0, 5.6, 7.2, 8.8, 11.0, 13.4];   // hook, 5 drinks, product, end
const DURATION = T[T.length - 1];

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const seg = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
const ease = u => { const c1 = 0.2, c2 = 0.8; return 1 - Math.pow(1 - u, 3) * (1 - u * 0.0); }; // precise, no bounce
const eo = u => 1 - Math.pow(1 - u, 3);
const mix = (a, b, u) => a + (b - a) * u;

// ─── words ─────────────────────────────────────────────────────────────────
const STR = {
  ar: { dir: 'rtl', f: 'Tajawal', n: s => String(s).replace(/\d/g, d => AR[d]),
        hook: ['قهوتك', 'تقول عنك', 'وايد 👀'], hookSub: 'لا تزعل',
        sl: { name: ['سبانش', 'لاتيه'], joke: ['يقول ما يحب الحلو…', 'وطلبه كله حليب مكثف 😭'], foot: 'موجود في ١٩٩ كوفي على BrewMaps' },
        v60: { name: 'V60', joke: ['يشرح لك الـ «tasting notes»…', 'وأنت أصلاً ما سألت 🤓'], foot: '١٣٥ كوفي فيها V60 على BrewMaps' },
        mt: { name: 'ماتشا', joke: ['عنده tote bag…', 'وكلاس بيلاتس الساعة ٦ الصبح 🍵'], foot: '١٨٥ كوفي فيها ماتشا على BrewMaps' },
        am: { name: ['آيس', 'أمريكانو'], beats: ['دوام.', 'إيميلات.', 'لا تكلمه. 🧊'], badge: '٩٩ رسالة غير مقروءة', foot: '٩١ كوفي فيها آيس أمريكانو على BrewMaps' },
        kk: { name: 'كرك', joke: 'معفي من التحليل. 🤝', foot: 'موجود في ١٧ كوفي بس على BrewMaps… نشتغل على الباقي' },
        prod: 'مهما كان طلبك…',
        end: { l1: 'مهما كان طلبك،', l2: ['تلقاه على BrewMaps', '.'], l3: 'أكثر من ٨١٢ كوفي حول الإمارات', cta: 'حمّل التطبيق مجاناً ←' } },
  en: { dir: 'ltr', f: 'DM Sans', n: s => String(s),
        hook: ['Your coffee', 'order says', 'a lot 👀'], hookSub: 'no offence',
        sl: { name: ['Spanish', 'latte'], joke: ["says he doesn't like sweet…", 'orders straight condensed milk 😭'], foot: 'On the menu at 199 cafés on BrewMaps' },
        v60: { name: 'V60', joke: ['explains the "tasting notes"…', 'nobody even asked 🤓'], foot: '135 cafés with V60 on BrewMaps' },
        mt: { name: 'Matcha', joke: ['has a tote bag…', 'and a 6am Pilates class 🍵'], foot: '185 cafés with matcha on BrewMaps' },
        am: { name: ['Iced', 'americano'], beats: ['Meetings.', 'Emails.', "Don't talk to him. 🧊"], badge: '99 unread', foot: '91 cafés with iced americano on BrewMaps' },
        kk: { name: 'Karak', joke: 'Exempt from analysis. 🤝', foot: "Only on 17 cafés' menus on BrewMaps… we're working on it" },
        prod: 'Whatever you order…',
        end: { l1: 'Whatever you order,', l2: ['find it on BrewMaps', '.'], l3: '812+ cafés across the UAE', cta: 'Download the app, free →' } },
};
let L = STR.ar;
function setLang(k) { L = STR[k] || STR.ar; }
const RTL = () => L.dir === 'rtl';
const START = () => RTL() ? 984 : 96;                   // the reading edge
const MX = x => RTL() ? x : W - x;                      // illustrations live on the other edge
const F = (w, px, fam) => `${w} ${px}px "${fam || L.f}", "Noto Color Emoji"`;

// ─── type ──────────────────────────────────────────────────────────────────
// A line revealed by a mask travelling in reading direction, with a small rise.
function line(ctx, s, y, font, color, p, o = {}) {
  if (p <= 0) return;
  ctx.save(); ctx.direction = L.dir; ctx.font = font;
  const maxW = o.maxW || 888; let px = parseInt(font.match(/(\d+)px/)[1]);
  while (ctx.measureText(s).width > maxW && px > 20) { px -= 4; ctx.font = font.replace(/\d+px/, px + 'px'); }
  const w = ctx.measureText(s).width, e = eo(p), rtl = RTL();
  let x = o.x != null ? o.x : START(), align = o.center ? 'center' : (o.align || (rtl ? 'right' : 'left'));
  const left = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
  const fromRight = o.center ? rtl : align === 'right';
  ctx.beginPath();
  if (fromRight) ctx.rect(left + w * (1 - e) - 30, y - px * 1.25, w * e + 60, px * 1.7);
  else ctx.rect(left - 30, y - px * 1.25, w * e + 60, px * 1.7);
  ctx.clip();
  if (o.alpha != null) ctx.globalAlpha *= o.alpha;
  ctx.textAlign = align; ctx.fillStyle = color; ctx.fillText(s, x, y + (1 - e) * px * 0.12);
  ctx.restore();
  return { w, left, px };
}
// thin rule + fine data line
function footer(ctx, s, y, color, p, o = {}) {
  if (p <= 0) return;
  const rtl = RTL(), atLeft = o.left, x0 = atLeft ? (rtl ? 96 : 96) : START();
  ctx.save(); ctx.globalAlpha *= eo(p);
  ctx.strokeStyle = color; ctx.globalAlpha *= 0.55; ctx.lineWidth = 2;
  const rw = 220 * eo(p);
  ctx.beginPath();
  if (o.center) { ctx.moveTo(W / 2 - rw / 2, y - 52); ctx.lineTo(W / 2 + rw / 2, y - 52); }
  else if ((rtl && !atLeft)) { ctx.moveTo(x0, y - 52); ctx.lineTo(x0 - rw, y - 52); }
  else { ctx.moveTo(x0, y - 52); ctx.lineTo(x0 + rw, y - 52); }
  ctx.stroke(); ctx.restore();
  line(ctx, s, y, F(400, 30), color, p, { alpha: 0.72, maxW: o.maxW || 780, x: o.center ? W / 2 : x0, center: o.center,
    align: o.center ? 'center' : (atLeft ? 'left' : (rtl ? 'right' : 'left')) });
}

// ─── drawings: polylines revealed along their length, with a slight boil ──
let boil = 0;
const jit = (a, b) => { const x = Math.sin(a * 12.9898 + b * 78.233 + boil * 37.719) * 43758.5453; return (x - Math.floor(x) - 0.5) * 2.2; };
function draw(ctx, polys, cx, cy, s, p, color, lw = 10) {
  const flip = RTL() ? 1 : -1;
  const P = polys.map(pl => pl.map(([x, y]) => [cx + flip * x * s, cy + y * s]));
  const lens = P.map(pl => pl.slice(1).reduce((a, q, i) => a + Math.hypot(q[0] - pl[i][0], q[1] - pl[i][1]), 0));
  const total = lens.reduce((a, b) => a + b, 0); let budget = total * clamp(p, 0, 1);
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.lineCap = ctx.lineJoin = 'round';
  P.forEach((pl, k) => {
    if (budget <= 0) return;
    ctx.beginPath(); ctx.moveTo(pl[0][0] + jit(k, 0), pl[0][1] + jit(0, k));
    for (let i = 1; i < pl.length && budget > 0; i++) {
      const [ax, ay] = pl[i - 1], [bx, by] = pl[i], d = Math.hypot(bx - ax, by - ay), u = Math.min(1, budget / d);
      ctx.lineTo(ax + (bx - ax) * u + jit(k, i), ay + (by - ay) * u + jit(i, k)); budget -= d;
    }
    ctx.stroke();
  });
  ctx.restore();
}
const arcPts = (cx, cy, r, a0, a1, n = 20) => Array.from({ length: n + 1 }, (_, k) => { const a = a0 + (a1 - a0) * k / n; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; });
const ICON = {
  glass: [[[-95, -130], [-72, 130], [72, 130], [95, -130]], [[20, 60], [55, -160], [85, -172]]],
  dripper: [[[-120, -150], [120, -150], [28, -10], [-28, -10], [-120, -150]], [[-60, -120], [-14, -30]], [[60, -120], [14, -30]],
            [[-100, 10], [100, 10]], [[-90, 10], [-75, 150], [75, 150], [90, 10]]],
  bowl: [arcPts(0, -10, 140, 0, Math.PI), [[-150, -10], [150, -10]], [[-50, 130], [50, 130]]],
  whisk: [[[0, 0], [90, -170]], [[-22, -8], [0, 0], [22, 12]], [[-14, 10], [0, 0], [16, -12]]],
  iced: [[[-95, -130], [-72, 130], [72, 130], [95, -130]], [[20, 60], [70, -190], [110, -205]],
         [[-60, -90], [-12, -90], [-12, -42], [-60, -42], [-60, -90]], [[-26, -14], [26, -22], [34, 28], [-18, 36], [-26, -14]]],
  istikana: [[[-60, -110], [-38, -20], [-60, 60], [-50, 110], [50, 110], [60, 60], [38, -20], [60, -110]],
             [[-140, 128], [140, 128]], [[-120, 128], [-90, 150], [90, 150], [120, 128]],
             [[-24, -150], [-10, -170], [-26, -190]], [[20, -150], [34, -170], [18, -190]]],
};

// ─── surfaces: tone + very soft light toward the type ──────────────────────
function surface(ctx, color, light = 0.045) {
  ctx.fillStyle = color; ctx.fillRect(0, 0, W, H);
  const g = ctx.createRadialGradient(START(), 520, 40, START(), 520, 1100);
  g.addColorStop(0, `rgba(255,255,255,${light})`); g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}

// ─── scenes (lt = local time) ──────────────────────────────────────────────
function hook(ctx, lt) {
  surface(ctx, NIGHT);
  const x = RTL() ? 1010 : 70;                                   // bleeds slightly past the margin
  line(ctx, L.hook[0], 640, F(800, 340), CREAM, lt >= 0 ? 1 : 0, { x, maxW: 1000 });
  line(ctx, L.hook[1], 920, F(800, 250), CREAM, seg(lt, 0.12, 0.32), { x, maxW: 980 });
  line(ctx, L.hook[2], 1210, F(800, 300), PALE, seg(lt, 0.28, 0.48), { x, maxW: 980 });
  line(ctx, L.hookSub, 1400, F(400, 36), 'rgba(244,239,230,.6)', seg(lt, 0.5, 0.66), { x: RTL() ? 96 : 984, align: RTL() ? 'left' : 'right' });
}

function spanish(ctx, lt) {
  surface(ctx, CREAM, 0.0);
  const gx = MX(80), gy = 1340, s = 3.1, flip = RTL() ? 1 : -1;
  // condensed milk: a ribbon, then the lower third fills (lands with line 2)
  const pour = seg(lt, 0.62, 0.95), fill = eo(seg(lt, 0.7, 1.15));
  if (fill > 0) {
    const top = 130 - 95 * fill, hw = y => 72 + (95 - 72) * (130 - y) / 260;
    ctx.save(); ctx.fillStyle = 'rgba(155,196,138,.55)'; ctx.beginPath();
    ctx.moveTo(gx - flip * hw(top) * s, gy + top * s); ctx.lineTo(gx + flip * hw(top) * s, gy + top * s);
    ctx.lineTo(gx + flip * 72 * s, gy + 130 * s); ctx.lineTo(gx - flip * 72 * s, gy + 130 * s); ctx.closePath(); ctx.fill(); ctx.restore();
  }
  if (pour > 0 && pour < 1) {
    ctx.save(); ctx.strokeStyle = 'rgba(155,196,138,.9)'; ctx.lineWidth = 18; ctx.lineCap = 'round';
    const y0 = gy - 260 * s * 0.5, y1 = mix(y0, gy + (130 - 95 * fill) * s, eo(pour));
    ctx.beginPath(); ctx.moveTo(gx - flip * 10, y0 - 120); ctx.lineTo(gx - flip * 10, y1); ctx.stroke(); ctx.restore();
  }
  draw(ctx, ICON.glass, gx, gy, s, seg(lt, 0, 0.4), FOREST, 11);
  line(ctx, L.sl.name[0], 560, F(800, 280), INK, seg(lt, 0, 0.3));
  line(ctx, L.sl.name[1], 810, F(800, 280), INK, seg(lt, 0.06, 0.36));
  line(ctx, L.sl.joke[0], 950, F(500, 62), INK, seg(lt, 0.35, 0.62), { maxW: 600 });
  line(ctx, L.sl.joke[1], 1040, F(500, 62), INK, seg(lt, 0.7, 0.97), { maxW: 600 });
  footer(ctx, L.sl.foot, 1450, FOREST, seg(lt, 0.95, 1.2));
}

function v60(ctx, lt) {
  surface(ctx, NIGHT);
  const dx = MX(80), dy = 500;
  draw(ctx, ICON.dripper, dx, dy, 3.2, seg(lt, 0, 0.42), PALE, 11);
  line(ctx, L.v60.name, 640, F(700, 300, 'DM Sans'), CREAM, seg(lt, 0.02, 0.3));
  line(ctx, L.v60.joke[0], 800, F(500, 60), CREAM, seg(lt, 0.3, 0.55), { maxW: 640 });
  // tasting notes, one every 6 frames, then struck through as the punchline lands
  const notes = ['Berry', 'Floral', 'Chocolate', 'Citrus'], strike = eo(seg(lt, 0.88, 1.05));
  notes.forEach((nm, k) => {
    const p = seg(lt, 0.45 + k * 0.1, 0.6 + k * 0.1); if (p <= 0) return;
    const y = 1170 + k * 82, x = RTL() ? 96 : 984, al = RTL() ? 'left' : 'right';
    const r = line(ctx, nm, y, F(400, 36, 'DM Sans'), 'rgba(244,239,230,.6)', p, { x, align: al });
    if (strike > 0 && r) { ctx.save(); ctx.strokeStyle = PALE; ctx.lineWidth = 3; ctx.beginPath();
      const sx = al === 'left' ? r.left : r.left + r.w; ctx.moveTo(sx, y - 12); ctx.lineTo(sx + (al === 'left' ? 1 : -1) * r.w * strike, y - 12); ctx.stroke(); ctx.restore(); }
  });
  line(ctx, L.v60.joke[1], 890, F(700, 60), PALE, seg(lt, 0.88, 1.12), { maxW: 640 });
  footer(ctx, L.v60.foot, 1470, CREAM, seg(lt, 1.1, 1.35), { maxW: 520 });
}

function matcha(ctx, lt) {
  surface(ctx, SAND, 0.0);
  const bx = MX(250), by = 560, s = 2.6, flip = RTL() ? 1 : -1;
  draw(ctx, ICON.bowl, bx, by, s, seg(lt, 0, 0.38), FOREST, 11);
  const wk = seg(lt, 0.7, 1.0), wob = Math.sin(wk * Math.PI * 4) * 0.22 * (1 - wk);   // two quick whisks on the punchline
  ctx.save(); ctx.translate(bx + flip * 40 * s, by - 40 * s); ctx.rotate(flip * wob);
  draw(ctx, ICON.whisk, 0, 0, s, seg(lt, 0.15, 0.45), FOREST, 11); ctx.restore();
  line(ctx, L.mt.joke[0], 975, F(500, 62), INK, seg(lt, 0.3, 0.55), { maxW: 700 });
  line(ctx, L.mt.joke[1], 1060, F(500, 62), INK, seg(lt, 0.66, 0.92), { maxW: 700 });
  line(ctx, L.mt.name, 1370, F(800, 290), FOREST, seg(lt, 0.05, 0.35));
  footer(ctx, L.mt.foot, 1490, FOREST, seg(lt, 1.0, 1.25), { left: true, maxW: 560 });
}

function americano(ctx, lt) {
  surface(ctx, FOREST);
  draw(ctx, ICON.iced, MX(170), 1390, 2.6, seg(lt, 0, 0.4), PALE, 10);
  line(ctx, L.am.name[0], 500, F(800, 220), CREAM, seg(lt, 0, 0.26));
  line(ctx, L.am.name[1], 720, F(800, 220), CREAM, seg(lt, 0.05, 0.31));
  L.am.beats.forEach((b, k) => line(ctx, b, 880 + k * 100, F(k === 2 ? 700 : 500, 72), k === 2 ? PALE : CREAM, seg(lt, 0.3 + k * 0.35, 0.45 + k * 0.35), { maxW: 700 }));
  const bp = seg(lt, 0.65, 0.8) * (1 - seg(lt, 1.0, 1.15));      // the unread badge: in with "emails", out with "don't talk to him"
  if (bp > 0) {
    ctx.save(); ctx.globalAlpha = bp; ctx.direction = L.dir; ctx.font = F(500, 30);
    const w = ctx.measureText(L.am.badge).width + 64, x = RTL() ? 96 : 984 - w, y = 950 - (1 - bp) * 20;
    ctx.beginPath(); ctx.roundRect(x, y, w, 64, 12); ctx.strokeStyle = 'rgba(244,239,230,.7)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath(); ctx.arc(RTL() ? x + w - 26 : x + 26, y + 32, 7, 0, 7); ctx.fillStyle = PALE; ctx.fill();
    ctx.fillStyle = CREAM; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(L.am.badge, x + w / 2 + (RTL() ? -8 : 8), y + 34);
    ctx.restore();
  }
  footer(ctx, L.am.foot, 1470, CREAM, seg(lt, 1.2, 1.45), { maxW: 560 });
}

function karak(ctx, lt) {
  surface(ctx, NIGHT, 0.0);
  line(ctx, L.kk.name, 720, F(800, 340), CREAM, seg(lt, 0, 0.25), { x: W / 2, center: true });
  draw(ctx, ICON.istikana, W / 2, 1090, 1.6, seg(lt, 0.1, 0.4), PALE, 9);
  line(ctx, L.kk.joke, 1400, F(700, 64), CREAM, seg(lt, 0.65, 0.85), { x: W / 2, center: true });
  footer(ctx, L.kk.foot, 1500, PALE, seg(lt, 0.95, 1.2), { center: true, maxW: 880 });
}

// the real app. Search footage (app/frames.json) is used when present; until then, the real Browse → Jumeirah flow.
function phoneContent(ctx, A, lt, sx, sy, sw, sh) {
  ctx.fillStyle = '#fff'; ctx.fillRect(sx, sy, sw, sh);
  if (A.search && A.search.length) {
    const i = Math.min(A.search.length - 1, Math.floor(lt * FPS)), f = A.search[i];
    ctx.drawImage(f, 0, 0, f.width, f.width * sh / sw, sx, sy, sw, sh); return;
  }
  // Browse by area (browse-top.png below its header, so "413 cafés" never shows) → tap Jumeirah → the real list
  const k = sw / 1320, second = lt >= 1.15, sl = eo(seg(lt, 1.15, 1.4)), top = 500 + 60 * ease(seg(lt, 0.1, 0.8));
  if (!second || sl < 1) {
    const ox = -sl * sw * 0.3;
    ctx.drawImage(A.browse, 0, top, 1320, sh / k, sx + ox, sy, sw, sh);
    ctx.drawImage(A.bar, sx + ox, sy + sh - A.bar.height * k, sw, A.bar.height * k);
  }
  if (second) ctx.drawImage(A.list, 0, 0, 1320, sh / k, sx + (1 - sl) * sw, sy, sw, sh);
  const u = seg(lt, 0.9, 1.25);
  if (u > 0 && u < 1) { ctx.beginPath(); ctx.arc(sx + 350 * k, sy + (900 - top) * k, 30 + 50 * u, 0, 7); ctx.strokeStyle = `rgba(43,77,31,${1 - u})`; ctx.lineWidth = 5; ctx.stroke(); }
  if (lt > 1.6) { const g = seg(lt, 1.6, 1.8); ctx.beginPath(); ctx.roundRect(sx + 6, sy + 655 * k, sw - 12, 170 * k, 14); ctx.strokeStyle = `rgba(155,196,138,${g})`; ctx.lineWidth = 6; ctx.stroke(); }
}
function phone(ctx, A, lt, x, y, w, h) {
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 60; ctx.shadowOffsetY = 24;
  ctx.beginPath(); ctx.roundRect(x, y, w, h, w * 0.11); ctx.fillStyle = '#0a0a0a'; ctx.fill(); ctx.restore();
  const b = w * 0.026, sx = x + b, sy = y + b, sw = w - 2 * b, sh = h - 2 * b;
  ctx.save(); ctx.beginPath(); ctx.roundRect(sx, sy, sw, sh, w * 0.09); ctx.clip(); phoneContent(ctx, A, lt, sx, sy, sw, sh); ctx.restore();
}
const PH = { w: 600, h: 1100 };
function product(ctx, A, lt) {
  surface(ctx, NIGHT);
  const u = eo(seg(lt, 0, 0.32)), s = mix(0.28, 1, u);            // the istikana's spot opens into the phone
  const cx = W / 2, cy = mix(1090, 1060, u), w = PH.w * s, h = PH.h * s;
  phone(ctx, A, Math.max(0, lt - 0.3), cx - w / 2, cy - h / 2, w, h);
  line(ctx, L.prod, 400, F(700, 64), CREAM, seg(lt, 0.25, 0.5));
}
function end(ctx, A, lt) {
  const bg = seg(lt, 0, 0.25);
  if (bg < 1) product(ctx, A, T[7] - T[6] + lt);
  ctx.save(); ctx.globalAlpha = bg; surface(ctx, FOREST); ctx.restore();
  // the phone settles bottom-edge, cropped: the product stays in the brand moment
  const u = eo(seg(lt, 0, 0.45)), w = mix(PH.w, 520, u), h = w * PH.h / PH.w;
  const x = mix(W / 2 - PH.w / 2, MX(-40) - (RTL() ? 0 : 520), u), y = mix(1060 - PH.h / 2, 1290, u);
  phone(ctx, A, 2.2, x, y, w, h);
  const m = A.mark, mw = 330, mh = mw * m.height / m.width, mp = eo(seg(lt, 0.15, 0.45));
  ctx.save(); ctx.globalAlpha = mp; ctx.drawImage(m, RTL() ? 984 - mw : 96, 320 + (1 - mp) * 20, mw, mh); ctx.restore();
  line(ctx, L.end.l1, 760, F(500, 72), CREAM, seg(lt, 0.3, 0.55));
  const r = line(ctx, L.end.l2[0], 900, F(800, 128), CREAM, seg(lt, 0.4, 0.7), { maxW: 820 });
  if (r && seg(lt, 0.7, 0.8) > 0) { ctx.save(); ctx.globalAlpha = seg(lt, 0.7, 0.8); ctx.font = F(800, r.px); ctx.fillStyle = PALE; ctx.direction = L.dir;
    ctx.textAlign = RTL() ? 'right' : 'left'; ctx.fillText(L.end.l2[1], RTL() ? r.left - 4 : r.left + r.w + 4, 900); ctx.restore(); }
  line(ctx, L.end.l3, 990, F(400, 38), 'rgba(244,239,230,.75)', seg(lt, 0.65, 0.85));
  const c = line(ctx, L.end.cta, 1130, F(700, 46), CREAM, seg(lt, 0.8, 1.0));
  const ul = eo(seg(lt, 0.95, 1.2));
  if (c && ul > 0) { ctx.save(); ctx.strokeStyle = PALE; ctx.lineWidth = 4; ctx.beginPath();
    if (RTL()) { ctx.moveTo(START(), 1156); ctx.lineTo(START() - c.w * ul, 1156); } else { ctx.moveTo(START(), 1156); ctx.lineTo(START() + c.w * ul, 1156); }
    ctx.stroke(); ctx.restore(); }
}

// ─── the film ──────────────────────────────────────────────────────────────
const SCENES = [hook, spanish, v60, matcha, americano, karak];
function grain(ctx, A, t) {
  const g = A.grain[Math.floor(t * 12) % A.grain.length];
  ctx.save(); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = 0.07; ctx.drawImage(g, 0, 0, W, H); ctx.restore();
}
function renderFrame(ctx, t, A) {
  boil = Math.floor(t * 12) % 3; ctx.globalAlpha = 1;
  let i = T.findIndex((x, k) => t >= x && t < T[k + 1]); if (i < 0) i = T.length - 2;
  const lt = t - T[i];
  if (i === 7) end(ctx, A, lt);
  else if (i === 6) product(ctx, A, lt);
  else if (i === 2 && lt < 0.22) {                                // push, in reading direction
    const u = eo(lt / 0.22), d = RTL() ? 1 : -1;
    ctx.save(); ctx.translate(d * W * u, 0); SCENES[1](ctx, T[2] - T[1]); ctx.restore();
    ctx.save(); ctx.translate(-d * W * (1 - u), 0); SCENES[2](ctx, lt); ctx.restore();
  } else if (i === 3 && lt < 0.22) {                              // crop wipe from the illustration edge
    const u = eo(lt / 0.22); SCENES[2](ctx, T[3] - T[2]);
    ctx.save(); ctx.beginPath(); RTL() ? ctx.rect(0, 0, W * u, H) : ctx.rect(W * (1 - u), 0, W * u, H); ctx.clip(); SCENES[3](ctx, lt); ctx.restore();
  } else SCENES[i](ctx, lt);
  grain(ctx, A, t);
}

if (typeof module !== 'undefined') module.exports = {};
