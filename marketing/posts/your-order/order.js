// "قهوتك تقول عنك" — your coffee order says something about you. Built like the Arabic price ad that
// won on CPI: one idea, huge type, one card per beat, fast cuts, a clear ending. Each card also carries
// one real number: how many cafés on BrewMaps list that drink.

const W = 1080, H = 1920, FPS = 30;
const NIGHT = '#0E1F0A', FOREST = '#2B4D1F', PALE = '#9BC48A', CREAM = '#F4EFE6', SAND = '#EAE1D1', INK = '#141414';
const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';
const HOOK = 1.4, CARD = 1.85, N = 5, END_AT = HOOK + N * CARD, DURATION = END_AT + 2.6;

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const seg = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
const easeOut = u => 1 - Math.pow(1 - u, 3);
const back = u => { const c = 1.7; return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); };

// counts: cafés whose menu on brewmaps.app lists the drink (389 cafés list a menu), 26 Sep 2026
const DRINKS = [
  { key: 'spanish', count: 199 }, { key: 'v60', count: 135 }, { key: 'matcha', count: 185 },
  { key: 'iced', count: 91 }, { key: 'karak', count: 17 },
];
const STR = {
  ar: { font: 'Tajawal', dir: 'rtl', scale: 1.08, n: s => String(s).replace(/\d/g, d => AR_DIGITS[d]),
        hook: 'قهوتك تقول عنك 👀', hookSub: '(لا تزعل)', label: 'قهوتك تقول عنك',
        name: { spanish: 'سبانش لاتيه', v60: 'V60', matcha: 'ماتشا', iced: 'آيس أمريكانو', karak: 'كرك' },
        roast: { spanish: 'يقول ما يحب الحلو…\nوطلبه كله حليب مكثف 😭', v60: 'يشرح لك الـ tasting notes…\nوأنت ما سألت 🤓',
                 matcha: 'عنده tote bag…\nوقرار حياة جديد كل أسبوع 🍵', iced: 'دوام. إيميلات.\nلا تكلمه 🧊', karak: 'أصلي.\nما يحتاج شرح 🫡' },
        count: (k, c) => k === 'karak' ? `📍 ${c} كوفي بس على BrewMaps 👀` : `📍 ${c} كوفي على BrewMaps`,
        end: ['مهما كان طلبك… تلقاه على BrewMaps', '.'], endSub: 'أكثر من ٨١٢ كوفي في كل أنحاء الإمارات', cta: 'حمّل BrewMaps' },
  en: { font: 'DM Sans', dir: 'ltr', scale: 1, n: s => String(s),
        hook: 'Your coffee order says a lot 👀', hookSub: '(no offence)', label: 'your order says',
        name: { spanish: 'Spanish latte', v60: 'V60', matcha: 'Matcha', iced: 'Iced americano', karak: 'Karak' },
        roast: { spanish: "says he doesn't like sweet…\norders condensed milk 😭", v60: 'explains the tasting notes…\nnobody asked 🤓',
                 matcha: 'has a tote bag…\nand a new life plan every week 🍵', iced: 'meetings. emails.\ndo not talk to him 🧊', karak: 'the original.\nno explanation needed 🫡' },
        count: (k, c) => k === 'karak' ? `📍 only ${c} cafés on BrewMaps 👀` : `📍 ${c} cafés on BrewMaps`,
        end: ['Whatever your order, find it on BrewMaps', '.'], endSub: '812 cafés across the UAE', cta: 'Download BrewMaps' },
};
let L = STR.en;
function setLang(k) { L = STR[k] || STR.en; }
const font = (w, px, fam) => `${w} ${Math.round(px * (fam ? 1 : L.scale))}px "${fam || L.font}", "Noto Color Emoji"`;

function text(ctx, s, y, f, color, maxW = 920) {
  ctx.direction = L.dir; ctx.textAlign = 'center'; ctx.font = f;
  let px = parseInt(f.match(/(\d+)px/)[1]); while (ctx.measureText(s).width > maxW && px > 26) { px -= 2; ctx.font = f.replace(/\d+px/, px + 'px'); }
  ctx.fillStyle = color; ctx.fillText(s, W / 2, y);
}
function pill(ctx, s, y, f, bg, fg) {
  ctx.direction = L.dir; ctx.font = f; const w = ctx.measureText(s).width + 70, h = 84;
  ctx.beginPath(); ctx.roundRect(W / 2 - w / 2, y - h / 2, w, h, h / 2); ctx.fillStyle = bg; ctx.fill();
  ctx.fillStyle = fg; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(s, W / 2, y + 3); ctx.textBaseline = 'alphabetic';
}

// ─── drink icons, drawn in line with a little boil ─────────────────────────
let boil = 0;
const jx = (a, b) => { const x = Math.sin(a * 91.3 + b * 47.9 + boil * 13.1) * 43758.5; return (x - Math.floor(x) - 0.5) * 3; };
function path(ctx, pts, close = false) { ctx.beginPath(); pts.forEach(([x, y], i) => { const X = x + jx(i, x), Y = y + jx(y, i); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }); if (close) ctx.closePath(); ctx.stroke(); }
function arc(ctx, cx, cy, r, a0, a1) { const p = []; for (let k = 0; k <= 16; k++) { const a = a0 + (a1 - a0) * k / 16; p.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); } path(ctx, p); }
function icon(ctx, key, cx, cy, color) {
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 9; ctx.lineCap = ctx.lineJoin = 'round';
  if (key === 'spanish' || key === 'iced') {            // tall glass, straw
    path(ctx, [[cx - 95, cy - 130], [cx - 72, cy + 130], [cx + 72, cy + 130], [cx + 95, cy - 130]]);
    path(ctx, [[cx + 20, cy + 60], [cx + 70, cy - 190], [cx + 110, cy - 205]]);
    if (key === 'spanish') { path(ctx, [[cx - 88, cy - 40], [cx + 88, cy - 40]]); path(ctx, [[cx - 82, cy + 40], [cx + 82, cy + 40]]); }
    else { path(ctx, [[cx - 60, cy - 90], [cx - 10, cy - 90], [cx - 10, cy - 40], [cx - 60, cy - 40]], true); path(ctx, [[cx - 20, cy - 10], [cx + 35, cy - 20], [cx + 45, cy + 35], [cx - 10, cy + 45]], true); }
  } else if (key === 'v60') {                            // dripper on a cup
    path(ctx, [[cx - 120, cy - 150], [cx + 120, cy - 150], [cx + 28, cy - 10], [cx - 28, cy - 10]], true);
    path(ctx, [[cx - 60, cy - 120], [cx - 14, cy - 30]]); path(ctx, [[cx + 60, cy - 120], [cx + 14, cy - 30]]);
    path(ctx, [[cx - 100, cy + 10], [cx + 100, cy + 10]]);
    path(ctx, [[cx - 90, cy + 10], [cx - 75, cy + 150], [cx + 75, cy + 150], [cx + 90, cy + 10]]);
    path(ctx, [[cx, cy - 10], [cx, cy + 30]]);
  } else if (key === 'matcha') {                         // bowl and whisk
    arc(ctx, cx, cy - 10, 140, 0, Math.PI); path(ctx, [[cx - 150, cy - 10], [cx + 150, cy - 10]]);
    path(ctx, [[cx - 50, cy + 130], [cx + 50, cy + 130]]);
    path(ctx, [[cx + 60, cy - 60], [cx + 150, cy - 230]]); path(ctx, [[cx + 40, cy - 70], [cx + 60, cy - 60], [cx + 80, cy - 40]]);
    path(ctx, [[cx - 70, cy - 40], [cx - 20, cy - 55], [cx + 30, cy - 40]]);
  } else if (key === 'karak') {                          // istikana on a saucer, steam
    path(ctx, [[cx - 60, cy - 110], [cx - 38, cy - 20], [cx - 60, cy + 60], [cx - 50, cy + 110], [cx + 50, cy + 110], [cx + 60, cy + 60], [cx + 38, cy - 20], [cx + 60, cy - 110]]);
    path(ctx, [[cx - 140, cy + 128], [cx + 140, cy + 128]]); path(ctx, [[cx - 120, cy + 128], [cx - 90, cy + 150], [cx + 90, cy + 150], [cx + 120, cy + 128]]);
    for (const dx of [-30, 0, 30]) path(ctx, [[cx + dx, cy - 150], [cx + dx + 14, cy - 185], [cx + dx - 6, cy - 215], [cx + dx + 8, cy - 245]]);
  }
  ctx.restore();
}

// ─── beats ─────────────────────────────────────────────────────────────────
function hook(ctx, t) {
  ctx.fillStyle = NIGHT; ctx.fillRect(0, 0, W, H);
  const s = 1 + 0.06 * (1 - easeOut(seg(t, 0, 0.35)));
  ctx.save(); ctx.translate(W / 2, 900); ctx.scale(s, s); ctx.translate(-W / 2, -900);
  text(ctx, L.hook, 900, font(700, 120), CREAM);
  ctx.restore();
  ctx.globalAlpha = seg(t, 0.35, 0.6); text(ctx, L.hookSub, 1010, font(500, 52), PALE); ctx.globalAlpha = 1;
}

function card(ctx, i, t) {
  const D = DRINKS[i], light = i % 2 === 1, bg = light ? SAND : NIGHT, fg = light ? INK : CREAM, acc = light ? FOREST : PALE;
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  const slam = 1 + 0.1 * (1 - easeOut(seg(t, 0, 0.25)));                       // lands like the price cards
  ctx.save(); ctx.translate(W / 2, 960); ctx.scale(slam, slam); ctx.translate(-W / 2, -960);
  text(ctx, L.label, 400, font(500, 36), light ? 'rgba(20,20,20,.5)' : 'rgba(244,239,230,.55)');
  icon(ctx, D.key, W / 2, 680, acc);
  text(ctx, L.name[D.key], 1010, font(800, 132, D.key === 'v60' && L.dir === 'rtl' ? 'DM Sans' : null), fg);
  ctx.restore();
  const r = easeOut(seg(t, 0.28, 0.5));
  if (r > 0) {
    ctx.save(); ctx.globalAlpha = r; ctx.translate(0, (1 - r) * 20);
    L.roast[D.key].split('\n').forEach((line, k) => text(ctx, line, 1120 + k * 72, font(500, 54), fg));
    ctx.restore();
  }
  const c = easeOut(seg(t, 0.75, 0.95));
  if (c > 0) { ctx.save(); ctx.globalAlpha = c; pill(ctx, L.n(L.count(D.key, D.count)), 1340, font(700, 36), light ? FOREST : 'rgba(155,196,138,.18)', light ? CREAM : PALE); ctx.restore(); }
}

function endCard(ctx, A, t) {
  ctx.fillStyle = NIGHT; ctx.fillRect(0, 0, W, H);
  const a = easeOut(seg(t, 0, 0.3));
  ctx.globalAlpha = a;
  const m = A.mark, mw = 170, mh = mw * m.height / m.width; ctx.drawImage(m, (W - mw) / 2, 620, mw, mh);
  ctx.direction = L.dir; ctx.font = font(700, 70); ctx.textAlign = 'left';
  const [body, mark] = L.end; let px = Math.round(70 * L.scale);
  while (ctx.measureText(body + mark).width > 920 && px > 36) { px -= 2; ctx.font = `700 ${px}px "${L.font}"`; }
  const bw = ctx.measureText(body).width, kw = ctx.measureText(mark).width, x0 = (W - bw - kw) / 2;
  const [bx, mx] = L.dir === 'rtl' ? [x0 + kw, x0] : [x0, x0 + bw];
  ctx.fillStyle = CREAM; ctx.fillText(body, bx, 900); ctx.fillStyle = PALE; ctx.fillText(mark, mx, 900);
  text(ctx, L.endSub, 970, font(500, 40), 'rgba(244,239,230,.7)');
  const b = back(seg(t, 0.35, 0.6)); ctx.save(); ctx.translate(W / 2, 1110); ctx.scale(b, b); ctx.translate(-W / 2, -1110);
  pill(ctx, L.cta, 1110, font(700, 44), CREAM, NIGHT); ctx.restore();
  ctx.globalAlpha = 1;
}

function renderFrame(ctx, t, A) {
  boil = Math.floor(t * 12) % 3; ctx.globalAlpha = 1;
  if (t < HOOK) return hook(ctx, t);
  if (t < END_AT) { const i = Math.floor((t - HOOK) / CARD); return card(ctx, i, t - HOOK - i * CARD); }
  endCard(ctx, A, t - END_AT);
}

if (typeof module !== 'undefined') module.exports = {};
