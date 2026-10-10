// BrewMaps Premium Reel V3 — "قهوتك تقول عنك وايد"
// One drink, one joke, one beat. A fixed reading layout for every drink: name, setup, punchline,
// then the drink itself, whole and centred. Monoline illustrations with flat liquid fills.

const W = 1080, H = 1920, FPS = 30;
const NIGHT = '#0E1F0A', FOREST = '#2B4D1F', PALE = '#9BC48A', CREAM = '#F4EFE6', SAND = '#EAE1D1', INK = '#141414';
const COFFEE = '#7A4E33', MILKC = '#EFE0C2', KARAK = '#B98A5E';
const AR = '٠١٢٣٤٥٦٧٨٩';

let ORGANIC = false, T = [], DURATION = 0;
// beats inside a drink scene, in seconds from the scene start: the voice says the name, then the setup, then the punchline
const SETUP = 1.0, PUNCH = 2.1;
function setEnd(kind) {
  ORGANIC = kind === 'organic';
  // paced for a spoken line per beat; see VOICEOVER.md for the matching script
  T = [0, 2.1, 5.7, 9.3, 12.5, 15.9, 18.8, 21.9, ORGANIC ? 24.2 : 25.0];
  DURATION = T[T.length - 1];
}
setEnd('paid');

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const seg = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
const eo = u => 1 - Math.pow(1 - u, 3);
const io = u => u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
const mix = (a, b, u) => a + (b - a) * u;

// ─── words ─────────────────────────────────────────────────────────────────
const STR = {
  ar: { dir: 'rtl', f: 'Tajawal',
        hook: ['قهوتك', 'تقول عنك وايد 👀', 'لا تزعل'],
        sl: ['سبانش لاتيه', 'يقول ما يحب الحلو…', 'وطلبه كله حليب مكثف 😭'],
        v60: ['V60', 'يشرح لك الـ tasting notes…', 'وأنت أصلاً ما سألت 🤓'],
        mt: ['ماتشا', 'يطلبها عشان لونها…', 'مو عشان طعمها 💚'],
        am: ['آيس أمريكانو', 'دوام.', 'إيميلات.', 'لا تكلمه. 🧊'], badge: '٩٩ غير مقروءة',
        kk: ['كرك', 'معفي من التحليل 😌'],
        prod: ['BrewMaps يعرف ذوقك', 'ويقترح لك وين تجرّبه'],
        end: ['مهما كان طلبك،', 'تلقاه على BrewMaps', 'أكثر من ٨١٢ كوفي حول الإمارات', 'حمّل التطبيق مجاناً'],
        organic: ['أنت أي واحد؟ 👇', 'منشن اللي يشبه طلبه'] },
  en: { dir: 'ltr', f: 'DM Sans',
        hook: ['Your coffee', 'says a lot about you 👀', 'no offence'],
        sl: ['Spanish latte', "says he doesn't like sweet…", 'orders straight condensed milk 😭'],
        v60: ['V60', 'explains the tasting notes…', 'nobody even asked 🤓'],
        mt: ['Matcha', 'orders it for the colour…', 'not the taste 💚'],
        am: ['Iced americano', 'Meetings.', 'Emails.', "Don't talk to him. 🧊"], badge: '99 unread',
        kk: ['Karak', 'Exempt from analysis 😌'],
        prod: ['BrewMaps knows your taste', 'and where to try it next'],
        end: ['Whatever you order,', 'find it on BrewMaps', '812+ cafés across the UAE', 'Download the app, free'],
        organic: ['Which one are you? 👇', 'Tag the one whose order this is'] },
};
let L = STR.ar;
function setLang(k) { L = STR[k] || STR.ar; }
const RTL = () => L.dir === 'rtl';
const EDGE = () => RTL() ? 984 : 96;
const F = (w, px, fam) => `${w} ${px}px "${fam || L.f}", "Noto Color Emoji"`;

// A line revealed by a mask travelling in reading direction, rising 14px as it comes in.
function line(ctx, s, y, font, color, p, o = {}) {
  if (p <= 0) return null;
  ctx.save(); ctx.direction = L.dir; ctx.font = font;
  let px = parseInt(font.match(/(\d+)px/)[1]); const maxW = o.maxW || 888;
  while (ctx.measureText(s).width > maxW && px > 20) { px -= 2; ctx.font = font.replace(/\d+px/, px + 'px'); }
  const w = ctx.measureText(s).width, e = eo(p);
  const align = o.center ? 'center' : (RTL() ? 'right' : 'left'), x = o.center ? W / 2 : EDGE();
  const left = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
  ctx.beginPath();
  if (RTL()) ctx.rect(left + w * (1 - e) - 40, y - px * 1.3, w * e + 80, px * 1.8);
  else ctx.rect(left - 40, y - px * 1.3, w * e + 80, px * 1.8);
  ctx.clip();
  ctx.globalAlpha *= (o.alpha ?? 1) * Math.min(1, e * 1.4);
  ctx.textAlign = align; ctx.fillStyle = color; ctx.fillText(s, x, y + (1 - e) * 14);
  ctx.restore();
  return { w, left, px };
}

// ─── illustration kit: one 9px monoline, round joins, flat liquid fills ───
const LW = 9;
function stroke(ctx, color, w = LW) { ctx.lineWidth = w; ctx.strokeStyle = color; ctx.lineCap = ctx.lineJoin = 'round'; ctx.stroke(); }
function poly(ctx, pts, close = true) { ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); if (close) ctx.closePath(); }
function highlight(ctx, x1, y1, x2, y2, color) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.globalAlpha *= 0.4; stroke(ctx, color, 6); ctx.globalAlpha /= 0.4; }
function cube(ctx, cx, cy, s, rot, line) {
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
  ctx.beginPath(); ctx.roundRect(-s / 2, -s / 2, s, s, s * 0.22); ctx.fillStyle = 'rgba(255,255,255,.28)'; ctx.fill(); stroke(ctx, line, 6);
  ctx.restore();
}
// taper helper: x at height y for a side running from (xTop,yTop) to (xBot,yBot)
const side = (xt, yt, xb, yb) => y => xt + (xb - xt) * (y - yt) / (yb - yt);

// Spanish latte: heavy straight tumbler, condensed milk / milk / espresso float, ice, straw.
function spanishLatte(ctx, dy, milkRise, line) {
  const cx = 540, top = 1050 + dy, bot = 1450 + dy, lx = side(cx - 150, top, cx - 132, bot), rx = side(cx + 150, top, cx + 132, bot);
  const inset = 16, base = bot - 44, liq = top + 70;
  const inner = [[lx(liq) + inset, liq], [rx(liq) - inset, liq], [rx(base) - inset, base], [lx(base) + inset, base]];
  ctx.save(); poly(ctx, inner); ctx.clip();
  const band = (y0, y1, c) => { ctx.fillStyle = c; ctx.fillRect(cx - 200, y0, 400, y1 - y0); };
  const cm = 58 + milkRise;                                        // condensed milk layer grows with the pour
  band(liq, base, CREAM);                                          // milk
  const g = ctx.createLinearGradient(0, liq, 0, liq + 150);         // espresso float, bleeding softly into the milk
  g.addColorStop(0, COFFEE); g.addColorStop(0.45, COFFEE); g.addColorStop(1, 'rgba(122,78,51,0)');
  ctx.fillStyle = g; ctx.fillRect(cx - 200, liq, 400, 150);
  const g2 = ctx.createLinearGradient(0, base - cm - 14, 0, base - cm + 10);
  g2.addColorStop(0, 'rgba(239,224,194,0)'); g2.addColorStop(1, MILKC);
  ctx.fillStyle = g2; ctx.fillRect(cx - 200, base - cm - 14, 400, 24); band(base - cm + 10, base, MILKC);
  ctx.beginPath(); ctx.moveTo(lx(base) + 40, base - cm + 22); ctx.lineTo(rx(base) - 70, base - cm + 22);   // glossy line on the condensed milk
  ctx.globalAlpha = 0.7; stroke(ctx, '#fff', 4); ctx.globalAlpha = 1;
  ctx.restore();
  cube(ctx, cx - 58, liq + 8, 70, -0.18, line); cube(ctx, cx + 40, liq + 22, 64, 0.22, line); cube(ctx, cx - 6, liq - 30, 60, 0.08, line);
  ctx.beginPath(); ctx.moveTo(cx + 62, base - 40); ctx.lineTo(cx + 104, top - 118); stroke(ctx, line, 14);   // straw
  poly(ctx, [[lx(top), top], [rx(top), top], [rx(bot), bot], [lx(bot), bot]]); stroke(ctx, line);
  ctx.beginPath(); ctx.moveTo(lx(base), base); ctx.lineTo(rx(base), base); stroke(ctx, line);                 // heavy base
  highlight(ctx, lx(top) + 30, top + 40, lx(top) + 20, top + 200, '#fff');
}
// a plain condensed-milk tin, no brand, pouring a thick ribbon
function tin(ctx, t, line, liqTop) {
  const inn = eo(seg(t, 0, 0.3)), out = seg(t, 0.8, 1.0);
  if (inn <= 0 || out >= 1) return 0;
  const tilt = mix(-0.2, -1.05, eo(seg(t, 0.05, 0.35)));
  const x = mix(90, 250, inn), y = mix(1000, 975, inn);
  ctx.save(); ctx.globalAlpha = 1 - out; ctx.translate(x, y); ctx.rotate(tilt);
  ctx.beginPath(); ctx.roundRect(-62, -78, 124, 156, 14); ctx.fillStyle = 'rgba(244,239,230,.08)'; ctx.fill(); stroke(ctx, line);
  for (const yy of [-50, 50]) { ctx.beginPath(); ctx.moveTo(-62, yy); ctx.lineTo(62, yy); stroke(ctx, line, 5); }
  ctx.restore();
  // ribbon from the tin's lip to the drink
  const p = seg(t, 0.3, 0.75);
  if (p > 0) {
    const mx = x + Math.cos(tilt) * 70 + 20, my = y + Math.sin(tilt) * 70 + 70;
    const ex = 500, ey = mix(my, liqTop + 30, eo(p));
    ctx.save(); ctx.globalAlpha = 1 - out; ctx.beginPath(); ctx.moveTo(mx, my); ctx.bezierCurveTo(mx + 60, my + 40, ex, ey - 120, ex, ey);
    ctx.lineWidth = 16; ctx.strokeStyle = MILKC; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore();
  }
  return eo(seg(t, 0.45, 0.95));
}

// V60: ribbed cone dripper with handle and filter edge, on a glass server a third full.
function v60(ctx, dy, t, line) {
  const cx = 540, sTop = 1210 + dy, sBot = 1450 + dy;
  // server
  const body = () => { ctx.beginPath(); ctx.moveTo(cx - 95, sTop); ctx.lineTo(cx - 95, sTop + 28);
    ctx.bezierCurveTo(cx - 170, sTop + 60, cx - 150, sBot, cx - 120, sBot); ctx.lineTo(cx + 120, sBot);
    ctx.bezierCurveTo(cx + 150, sBot, cx + 170, sTop + 60, cx + 95, sTop + 28); ctx.lineTo(cx + 95, sTop); ctx.closePath(); };
  ctx.save(); body(); ctx.clip(); ctx.fillStyle = COFFEE; ctx.fillRect(cx - 200, sBot - 92, 400, 92); ctx.restore();
  body(); stroke(ctx, line);
  ctx.beginPath(); ctx.moveTo(cx - 98, sTop + 30); ctx.lineTo(cx + 98, sTop + 30); stroke(ctx, line, 6);
  highlight(ctx, cx - 120, sTop + 100, cx - 108, sBot - 40, '#fff');
  // dripper
  const rim = 960 + dy, tip = 1165 + dy;
  poly(ctx, [[cx - 170, rim], [cx + 170, rim], [cx + 58, tip], [cx - 58, tip]]); ctx.fillStyle = 'rgba(43,77,31,.06)'; ctx.fill(); stroke(ctx, line);
  ctx.beginPath(); ctx.roundRect(cx - 110, tip, 220, 22, 8); stroke(ctx, line);          // base plate
  for (const k of [-1, 0, 1]) { ctx.beginPath(); ctx.moveTo(cx + k * 70, rim + 28); ctx.lineTo(cx + k * 26, tip - 22); stroke(ctx, line, 5); }
  ctx.beginPath(); ctx.moveTo(cx + 142, rim + 42); ctx.bezierCurveTo(cx + 250, rim + 40, cx + 250, rim + 150, cx + 110, rim + 150); stroke(ctx, line);  // handle
  poly(ctx, [[cx - 150, rim], [cx - 140, rim - 30], [cx + 140, rim - 30], [cx + 150, rim]], false); stroke(ctx, line, 5);   // filter paper edge
  // drips
  for (let k = 0; k < 3; k++) {
    const u = ((t - 0.2 - k * 0.22) % 0.9 + 0.9) % 0.9 / 0.9; if (t < 0.2 + k * 0.22) continue;
    const y = mix(tip + 30, sBot - 110, u * u);
    ctx.beginPath(); ctx.ellipse(cx, y, 7, 11, 0, 0, 7); ctx.fillStyle = COFFEE; ctx.globalAlpha = 1 - u * 0.3; ctx.fill(); ctx.globalAlpha = 1;
  }
}

// Matcha: wide low bowl on a foot, matcha surface with a foam swirl; chasen standing beside it.
function matcha(ctx, dy, swirl, line) {
  const cx = 470, rimY = 1240 + dy, bot = 1418 + dy;
  ctx.beginPath(); ctx.moveTo(cx - 210, rimY); ctx.bezierCurveTo(cx - 205, bot - 20, cx - 110, bot, cx, bot); ctx.bezierCurveTo(cx + 110, bot, cx + 205, bot - 20, cx + 210, rimY);
  ctx.fillStyle = 'rgba(244,239,230,.05)'; ctx.fill(); stroke(ctx, line);
  ctx.beginPath(); ctx.ellipse(cx, rimY, 210, 30, 0, 0, 7); ctx.fillStyle = PALE; ctx.fill(); stroke(ctx, line);
  ctx.save(); ctx.translate(cx + 10, rimY); ctx.rotate(swirl); ctx.scale(1, 0.14);
  ctx.beginPath(); for (let a = 0; a < Math.PI * 3.2; a += 0.1) { const r = 20 + a * 16; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
  ctx.restore(); ctx.globalAlpha = 0.9; stroke(ctx, CREAM, 5); ctx.globalAlpha = 1;
  ctx.beginPath(); ctx.moveTo(cx - 80, bot); ctx.lineTo(cx - 72, bot + 32); ctx.lineTo(cx + 72, bot + 32); ctx.lineTo(cx + 80, bot); stroke(ctx, line);   // foot
  highlight(ctx, cx - 170, rimY + 50, cx - 120, rimY + 130, '#fff');
  // chasen
  const wx = 830, hTop = 1060 + dy, hBot = 1230 + dy, tBot = 1440 + dy;
  ctx.beginPath(); ctx.roundRect(wx - 22, hTop, 44, hBot - hTop, 10); stroke(ctx, line);
  ctx.beginPath(); ctx.moveTo(wx - 22, hBot - 26); ctx.lineTo(wx + 22, hBot - 26); stroke(ctx, line, 5);
  for (let k = -3; k <= 3; k++) { ctx.beginPath(); ctx.moveTo(wx + k * 6, hBot); ctx.quadraticCurveTo(wx + k * 22, hBot + 110, wx + k * 20, tBot); stroke(ctx, line, 5); }
  ctx.beginPath(); ctx.ellipse(wx, tBot, 72, 12, 0, 0, Math.PI); stroke(ctx, line, 6);
}

// Iced americano: clear takeaway cup, flat lid, straw, sleeve, ice.
function americano(ctx, dy, line) {
  const cx = 540, top = 1030 + dy, bot = 1450 + dy, lx = side(cx - 140, top, cx - 104, bot), rx = side(cx + 140, top, cx + 104, bot);
  const liq = top + 50;
  ctx.save(); poly(ctx, [[lx(liq) + 8, liq], [rx(liq) - 8, liq], [rx(bot) - 8, bot - 8], [lx(bot) + 8, bot - 8]]); ctx.clip();
  ctx.fillStyle = COFFEE; ctx.fillRect(cx - 200, liq, 400, bot - liq); ctx.restore();
  cube(ctx, cx - 50, liq + 30, 68, -0.2, line); cube(ctx, cx + 42, liq + 52, 62, 0.25, line); cube(ctx, cx - 14, liq + 108, 58, 0.05, line);
  const s0 = 1240 + dy, s1 = 1330 + dy;                            // sleeve
  poly(ctx, [[lx(s0), s0], [rx(s0), s0], [rx(s1), s1], [lx(s1), s1]]); ctx.fillStyle = SAND; ctx.fill(); stroke(ctx, line, 6);
  ctx.beginPath(); ctx.moveTo(cx + 40, liq + 30); ctx.lineTo(cx + 70, top - 90); stroke(ctx, line, 14);   // straw
  poly(ctx, [[lx(top), top], [rx(top), top], [rx(bot), bot], [lx(bot), bot]]); stroke(ctx, line);
  ctx.beginPath(); ctx.roundRect(cx - 158, top - 34, 316, 34, 10); ctx.fillStyle = CREAM; ctx.fill(); stroke(ctx, line);   // lid
  highlight(ctx, lx(top) + 28, top + 70, lx(top) + 36, top + 210, '#fff');
}

// Karak: istikana with a waist, on a saucer with a spoon; two S-curve steam lines.
function karak(ctx, dy, t, line) {
  const cx = 540, top = 1080 + dy, waist = 1230 + dy, bot = 1398 + dy;
  const shape = () => { ctx.beginPath(); ctx.moveTo(cx - 96, top); ctx.bezierCurveTo(cx - 90, top + 90, cx - 60, waist - 30, cx - 64, waist);
    ctx.bezierCurveTo(cx - 70, waist + 60, cx - 92, bot - 60, cx - 84, bot); ctx.lineTo(cx + 84, bot);
    ctx.bezierCurveTo(cx + 92, bot - 60, cx + 70, waist + 60, cx + 64, waist); ctx.bezierCurveTo(cx + 60, waist - 30, cx + 90, top + 90, cx + 96, top); };
  ctx.save(); shape(); ctx.closePath(); ctx.clip(); ctx.fillStyle = KARAK; ctx.fillRect(cx - 120, top + 34, 240, bot - top); ctx.restore();
  shape(); stroke(ctx, line);
  ctx.beginPath(); ctx.moveTo(cx - 96, top); ctx.lineTo(cx + 96, top); stroke(ctx, line, 6);
  highlight(ctx, cx - 62, top + 50, cx - 48, waist - 20, '#fff');
  ctx.beginPath(); ctx.ellipse(cx, bot + 18, 190, 26, 0, 0, 7); stroke(ctx, line);                       // saucer
  ctx.beginPath(); ctx.moveTo(cx + 120, bot + 6); ctx.lineTo(cx + 230, bot - 20); stroke(ctx, line, 6);    // spoon
  ctx.beginPath(); ctx.ellipse(cx + 246, bot - 24, 20, 11, -0.24, 0, 7); stroke(ctx, line, 6);
  for (const [k, ph] of [[-30, 0], [30, 0.5]]) {                                                             // steam, rising and fading
    const u = ((t * 0.9 + ph) % 1), a = Math.sin(u * Math.PI);
    ctx.save(); ctx.globalAlpha = 0.85 * a; ctx.translate(0, -u * 30);
    ctx.beginPath(); ctx.moveTo(cx + k, top - 30); ctx.bezierCurveTo(cx + k - 30, top - 70, cx + k + 30, top - 110, cx + k, top - 150); stroke(ctx, line, 7);
    ctx.restore();
  }
}

// ─── scenes ────────────────────────────────────────────────────────────────
function bg(ctx, color) {
  ctx.fillStyle = color; ctx.fillRect(0, 0, W, H);
  const g = ctx.createRadialGradient(W / 2, 700, 60, W / 2, 700, 1300);
  g.addColorStop(0, 'rgba(255,255,255,.035)'); g.addColorStop(1, 'rgba(0,0,0,.05)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
const drift = lt => -8 * seg(lt, 0, 3.6);
const appear = lt => { const u = eo(seg(lt, 0, 0.3)); return { a: u, dy: (1 - u) * 16 }; };

function hook(ctx, lt) {
  bg(ctx, NIGHT);
  line(ctx, L.hook[0], 720, F(800, 360), CREAM, 1, { maxW: 900 });                     // on frame one: it's the thumbnail
  line(ctx, L.hook[1], 900, F(800, 120), PALE, seg(lt, 0.2, 0.45), { maxW: 888 });
  line(ctx, L.hook[2], 1010, F(500, 40), CREAM, seg(lt, 1.5, 1.7), { alpha: 0.55 });
}

function drinkText(ctx, lt, [name, setup, punch], dark, nameFont) {
  const ink = dark ? CREAM : FOREST, accent = dark ? PALE : FOREST;
  line(ctx, name, 560, nameFont || F(800, name.length > 6 ? 190 : 240), ink, eo(seg(lt, 0, 0.3)), { maxW: 888 });
  line(ctx, setup, 700, F(500, 66), dark ? CREAM : INK, seg(lt, SETUP, SETUP + 0.3), { alpha: 0.8, maxW: 820 });
  if (punch) line(ctx, punch, 800, F(800, 72), dark ? accent : FOREST, seg(lt, PUNCH, PUNCH + 0.3), { maxW: 820 });
}

function sceneSpanish(ctx, lt) {
  bg(ctx, FOREST);
  const { a, dy } = appear(lt);
  tin(ctx, lt - (PUNCH - 0.1), CREAM, 1120); const rise = eo(seg(lt - (PUNCH - 0.1), 0.45, 0.95));
  ctx.save(); ctx.globalAlpha = a; spanishLatte(ctx, dy + drift(lt), rise * 40, CREAM); ctx.restore();
  drinkText(ctx, lt, L.sl, true);
}
function sceneV60(ctx, lt) {
  bg(ctx, CREAM);
  const { a, dy } = appear(lt);
  ctx.save(); ctx.globalAlpha = a; v60(ctx, dy + drift(lt), lt, FOREST); ctx.restore();
  // tasting notes float up beside the dripper, then leave before the punchline
  ['Berry', 'Floral', 'Chocolate'].forEach((nm, k) => {
    const p = seg(lt, SETUP + 0.1 + k * 0.25, SETUP + 0.3 + k * 0.25), out = seg(lt, PUNCH - 0.15, PUNCH);
    if (p <= 0 || out >= 1) return;
    const side = RTL() ? 1 : -1, x = 540 + side * -330 + (k % 2 ? -20 : 20), y = 1020 + k * 110 - eo(p) * 20;
    ctx.save(); ctx.globalAlpha = 0.5 * eo(p) * (1 - out); ctx.font = F(400, 36, 'DM Sans'); ctx.textAlign = 'center'; ctx.fillStyle = FOREST; ctx.fillText(nm, x, y); ctx.restore();
  });
  drinkText(ctx, lt, L.v60, false, F(700, 240, 'DM Sans'));
}
function sceneMatcha(ctx, lt) {
  bg(ctx, NIGHT);
  const { a, dy } = appear(lt);
  ctx.save(); ctx.globalAlpha = a; matcha(ctx, dy + drift(lt), -0.35 * io(seg(lt, PUNCH, PUNCH + 0.55)), CREAM); ctx.restore();
  drinkText(ctx, lt, L.mt, true);
}
function sceneAmericano(ctx, lt) {
  bg(ctx, CREAM);
  const { a, dy } = appear(lt);
  ctx.save(); ctx.globalAlpha = a; americano(ctx, dy + drift(lt), FOREST); ctx.restore();
  line(ctx, L.am[0], 560, F(800, 190), FOREST, eo(seg(lt, 0, 0.3)), { maxW: 888 });
  // three beats, one line: the words land one after another
  const beats = [[L.am[1], 1.0], [L.am[2], 1.7], [L.am[3], 2.4]];
  beats.forEach(([s, at], k) => line(ctx, s, 690 + k * 88, F(k === 2 ? 800 : 500, k === 2 ? 72 : 64), k === 2 ? FOREST : INK, seg(lt, at, at + 0.2), { maxW: 820 }));
  const bp = seg(lt, 1.7, 1.85) * (1 - seg(lt, 2.4, 2.55));             // unread badge beside the cup, only with "emails"
  if (bp > 0) {
    ctx.save(); ctx.globalAlpha = bp; ctx.direction = L.dir; ctx.font = F(700, 30);
    const w = ctx.measureText(L.badge).width + 70, x = RTL() ? 96 : W - 96 - w, y = 915 - (1 - bp) * 12;
    ctx.beginPath(); ctx.roundRect(x, y, w, 64, 14); ctx.fillStyle = CREAM; ctx.fill(); ctx.strokeStyle = FOREST; ctx.lineWidth = 3; ctx.stroke();
    ctx.beginPath(); ctx.arc(RTL() ? x + w - 28 : x + 28, y + 32, 8, 0, 7); ctx.fillStyle = FOREST; ctx.fill();
    ctx.fillStyle = FOREST; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(L.badge, x + w / 2 + (RTL() ? -10 : 10), y + 34);
    ctx.restore();
  }
}
function sceneKarak(ctx, lt) {
  bg(ctx, SAND);
  karak(ctx, drift(lt), lt, FOREST);
  line(ctx, L.kk[0], 640, F(800, 300), FOREST, 1, { center: true });            // hard cut: already there
  line(ctx, L.kk[1], 800, F(800, 72), FOREST, seg(lt, 1.4, 1.65), { center: true });
}

// the product: one real screen, held. Discover → "Drinks you'd love · Matches your taste"
const PH = { x: 260, y: 600, w: 560, h: 1000 };
function phone(ctx, A, lt, x, y, w, h) {
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 70; ctx.shadowOffsetY = 30;
  ctx.beginPath(); ctx.roundRect(x, y, w, h, w * 0.12); ctx.fillStyle = '#0b0b0b'; ctx.fill(); ctx.restore();
  const b = w * 0.025, sx = x + b, sy = y + b, sw = w - 2 * b, sh = h - 2 * b, k = sw / 1320;
  const off = 420 + 90 * io(seg(lt, 0.4, 1.3));                           // a gentle scroll down the same real screen
  ctx.save(); ctx.beginPath(); ctx.roundRect(sx, sy, sw, sh, w * 0.1); ctx.clip();
  ctx.fillStyle = '#fff'; ctx.fillRect(sx, sy, sw, sh);
  ctx.drawImage(A.discover, 0, off, 1320, sh / k, sx, sy, sw, sh);
  ctx.restore();
  const hp = io(seg(lt, 1.7, 2.1));                                        // outline the "Drinks you'd love" row
  if (hp > 0) {
    const ry0 = sy + (1085 - off) * k, ry1 = sy + (1760 - off) * k;
    ctx.save(); ctx.strokeStyle = PALE; ctx.lineWidth = 6; ctx.globalAlpha = hp;
    ctx.beginPath(); ctx.roundRect(sx + 10, ry0, (sw - 20), (ry1 - ry0), 22); ctx.stroke(); ctx.restore();
  }
}
function sceneProduct(ctx, A, lt) {
  bg(ctx, NIGHT);
  const u = eo(seg(lt, 0, 0.45));
  phone(ctx, A, lt, PH.x, PH.y + (1 - u) * 220, PH.w, PH.h);
  line(ctx, L.prod[0], 420, F(800, 84), CREAM, seg(lt, 0.15, 0.45), { center: true, maxW: 940 });
  line(ctx, L.prod[1], 505, F(500, 52), PALE, seg(lt, 1.5, 1.8), { center: true, maxW: 940 });
}
function sceneEnd(ctx, A, lt) {
  bg(ctx, FOREST);
  const m = A.mark;
  if (ORGANIC) {
    const mw = 150, mh = mw * m.height / m.width;
    line(ctx, L.organic[0], 860, F(800, 120), CREAM, seg(lt, 0.05, 0.4), { center: true });
    line(ctx, L.organic[1], 980, F(500, 50), PALE, seg(lt, 1.3, 1.6), { center: true });
    ctx.save(); ctx.globalAlpha = eo(seg(lt, 1.5, 1.8)); ctx.drawImage(m, (W - mw) / 2, 1100, mw, mh); ctx.restore();
    return;
  }
  const mw = 280, mh = mw * m.height / m.width, ma = eo(seg(lt, 0, 0.3));
  ctx.save(); ctx.globalAlpha = ma; ctx.drawImage(m, (W - mw) / 2, 380 + (1 - ma) * 16, mw, mh); ctx.restore();
  line(ctx, L.end[0], 760, F(500, 64), CREAM, seg(lt, 0.1, 0.35), { center: true });
  const r = line(ctx, L.end[1], 900, F(800, 120), CREAM, seg(lt, 0.85, 1.1), { center: true, maxW: 900 });
  if (r && lt > 1.1) {                                                    // the pale-green full stop
    ctx.save(); ctx.globalAlpha = seg(lt, 1.1, 1.2); ctx.font = F(800, r.px); ctx.fillStyle = PALE; ctx.textAlign = 'left';
    ctx.fillText('.', RTL() ? r.left - ctx.measureText('.').width - 2 : r.left + r.w + 2, 900); ctx.restore();
  }
  line(ctx, L.end[2], 985, F(400, 38), CREAM, seg(lt, 1.3, 1.55), { center: true, alpha: 0.72 });
  const c = line(ctx, L.end[3], 1130, F(700, 50), CREAM, seg(lt, 1.9, 2.1), { center: true });
  const ul = io(seg(lt, 2.0, 2.4));
  if (c && ul > 0) { ctx.save(); ctx.strokeStyle = PALE; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath();
    const y = 1160; if (RTL()) { ctx.moveTo(c.left + c.w, y); ctx.lineTo(c.left + c.w - c.w * ul, y); } else { ctx.moveTo(c.left, y); ctx.lineTo(c.left + c.w * ul, y); }
    ctx.stroke(); ctx.restore(); }
}

// ─── film ──────────────────────────────────────────────────────────────────
const DRINKS = [sceneSpanish, sceneV60, sceneMatcha, sceneAmericano];   // karak follows on a hard cut
function scene(ctx, A, i, lt) {
  if (i === 0) return hook(ctx, lt);
  if (i >= 1 && i <= 4) return DRINKS[i - 1](ctx, lt);
  if (i === 5) return sceneKarak(ctx, lt);
  if (i === 6) return sceneProduct(ctx, A, lt);
  return sceneEnd(ctx, A, lt);
}
function grain(ctx, A, t) {
  ctx.save(); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = 0.03;
  ctx.drawImage(A.grain[Math.floor(t * 12) % A.grain.length], 0, 0, W, H); ctx.restore();
}
function renderFrame(ctx, t, A) {
  ctx.globalAlpha = 1;
  let i = T.findIndex((x, k) => t >= x && t < T[k + 1]); if (i < 0) i = T.length - 2;
  const lt = t - T[i];
  const X = { 2: 0.35, 3: 0.35, 4: 0.35, 6: 0.3, 7: 0.3 }[i];            // crossfade + slide in reading direction
  if (X && lt < X) {
    scene(ctx, A, i - 1, T[i] - T[i - 1] - 0.001);
    const u = io(lt / X), d = (i === 6 || i === 7) ? 0 : (RTL() ? 60 : -60), b = A.buf.getContext('2d');
    b.setTransform(1, 0, 0, 1, 0, 0); b.globalAlpha = 1; b.clearRect(0, 0, W, H); scene(b, A, i, lt);
    ctx.save(); ctx.globalAlpha = u; ctx.drawImage(A.buf, d * (1 - u), 0); ctx.restore();
  } else scene(ctx, A, i, lt);
  grain(ctx, A, t);
}

if (typeof module !== 'undefined') module.exports = {};
