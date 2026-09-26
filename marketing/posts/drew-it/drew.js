// "رسمتها من خيالي… وطلعت موجودة" — Sketch to Reality. A café draws itself in cream lines,
// then snaps into the real photo from the app, full frame. Three cafés, then the logo does the same.

const W = 1080, H = 1920, FPS = 30;
const NIGHT = '#0E1F0A', FOREST = '#2B4D1F', PALE = '#9BC48A', CREAM = '#F4EFE6';
const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';
const SEG = 3.0, DRAW = 1.25, REVEAL = 1.45, N = 3, LOGO_AT = N * SEG, DURATION = LOGO_AT + 3.4;

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const seg = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
const ease = u => u * u * (3 - 2 * u);
const easeOut = u => 1 - Math.pow(1 - u, 3);
const back = u => { const c = 1.7; return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); };

const STR = {
  ar: { font: 'Tajawal', dir: 'rtl', scale: 1.1, n: s => String(s).replace(/\d/g, d => AR_DIGITS[d]).replace('.', '٫'),
        draw: ['رسمته من خيالي… ✏️', 'وهذا بعد… ✏️', 'وهذا؟ ✏️'],
        real: s => `…وطلع في ${s.areaAr} 😳`, where: s => s.emirateAr,
        logoDraw: 'وآخر وحدة… ✏️', end: ['أي كوفي في بالك… على BrewMaps', '.'], endSub: 'أكثر من ٨١٢ كوفي في كل أنحاء الإمارات' },
  en: { font: 'DM Sans', dir: 'ltr', scale: 1, n: s => String(s),
        draw: ['I drew it from my imagination… ✏️', 'and this one… ✏️', 'and this? ✏️'],
        real: s => `…it's real. ${s.area} 😳`, where: s => s.emirate,
        logoDraw: 'one last one… ✏️', end: ['Whatever café is in your head, it’s on BrewMaps', '.'], endSub: '812 cafés across the UAE' },
};
let L = STR.en;
function setLang(k) { L = STR[k] || STR.en; }
const font = (w, px) => `${w} ${Math.round(px * L.scale)}px "${L.font}", "Noto Color Emoji"`;

// line boil, as in the doodle work: each drawing re-jitters its points slightly
let boil = 0;
function jit(i, j) { const x = Math.sin((i * 127.1 + j * 311.7 + boil * 74.7)) * 43758.5453; return (x - Math.floor(x) - 0.5) * 2.4; }

function strokes(ctx, list, u, width = 6) {
  // each stroke starts in turn and draws itself along its length
  const n = list.length;
  ctx.lineCap = ctx.lineJoin = 'round'; ctx.strokeStyle = CREAM; ctx.lineWidth = width;
  list.forEach((s, i) => {
    const st = (i / n) * 0.75, p = seg(u, st, st + 0.25); if (p <= 0) return;
    const k = Math.max(2, Math.ceil(s.length * p));
    ctx.beginPath();
    for (let j = 0; j < k; j++) { const [x, y] = s[j]; j ? ctx.lineTo(x + jit(i, j), y + jit(j, i)) : ctx.moveTo(x + jit(i, j), y + jit(j, i)); }
    ctx.stroke();
  });
}

function text(ctx, s, y, f, color, alpha = 1, pill = false) {
  ctx.save(); ctx.globalAlpha = alpha; ctx.direction = L.dir; ctx.textAlign = 'center'; ctx.font = f;
  let px = parseInt(f.match(/(\d+)px/)[1]); while (ctx.measureText(s).width > 900 && px > 28) { px -= 2; ctx.font = f.replace(/\d+px/, px + 'px'); }
  if (pill) { const w = ctx.measureText(s).width + 70, h = px * 1.55; ctx.beginPath(); ctx.roundRect(W / 2 - w / 2, y - px * 1.05, w, h, h / 2); ctx.fillStyle = 'rgba(14,31,10,.82)'; ctx.fill(); }
  ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 18; ctx.fillStyle = color; ctx.fillText(s, W / 2, y); ctx.restore();
}

function shot(ctx, A, i, t) {
  const S = A.data.shots[i], img = A.frames[i], list = A.strokes[S.key];
  const d = seg(t, i === 0 ? -0.45 : 0.05, DRAW), r = ease(seg(t, REVEAL, REVEAL + 0.3));   // the first sketch is already under way on frame one
  ctx.fillStyle = NIGHT; ctx.fillRect(0, 0, W, H);
  if (r > 0) {                                                      // reality wipes up from the bottom
    ctx.save(); ctx.beginPath(); ctx.rect(0, H * (1 - r), W, H * r); ctx.clip();
    const z = 1.04 - 0.04 * ease(seg(t, REVEAL, SEG)); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.drawImage(img, -W / 2, -H / 2, W, H);
    ctx.restore();
    if (r < 1) { ctx.fillStyle = `rgba(244,239,230,${0.5 * (1 - r)})`; ctx.fillRect(0, H * (1 - r) - 6, W, 12); }
  }
  const lineA = 1 - seg(t, REVEAL + 0.15, REVEAL + 0.55);
  if (lineA > 0) { ctx.save(); ctx.globalAlpha = lineA; strokes(ctx, list, d); ctx.restore(); }
  // words: the sketch line up top, then the reveal
  text(ctx, L.draw[i], 400, font(700, 58), CREAM, 1 - seg(t, REVEAL, REVEAL + 0.2), true);
  const a = easeOut(seg(t, REVEAL + 0.3, REVEAL + 0.55));
  if (a > 0) {
    ctx.save(); ctx.globalAlpha = a;
    const g = ctx.createLinearGradient(0, 1080, 0, 1560); g.addColorStop(0, 'rgba(14,31,10,0)'); g.addColorStop(1, 'rgba(14,31,10,.85)');
    ctx.fillStyle = g; ctx.fillRect(0, 1080, W, 480); ctx.restore();
    ctx.save(); ctx.translate(W / 2, 1380); const s = 0.9 + 0.1 * back(a); ctx.scale(s, s); ctx.translate(-W / 2, -1380);
    text(ctx, L.real(S), 1380, font(700, 76), CREAM, a); ctx.restore();
    text(ctx, `${S.cafe}  ·  ★ ${L.n(S.rating.toFixed(1))}  ·  ${L.where(S)}`, 1450, font(500, 36), 'rgba(155,196,138,.95)', a);
  }
}

function logo(ctx, A, t) {
  ctx.fillStyle = NIGHT; ctx.fillRect(0, 0, W, H);
  const d = seg(t, 0.05, 1.0), r = ease(seg(t, 1.1, 1.4)), [ox, oy, mw, mh] = A.strokes.markBox;
  text(ctx, L.logoDraw, 400, font(700, 58), CREAM, 1 - seg(t, 1.1, 1.3), true);
  if (r > 0) { ctx.save(); ctx.globalAlpha = r; const s = 0.92 + 0.08 * back(r); ctx.translate(W / 2, oy + mh / 2); ctx.scale(s, s); ctx.drawImage(A.mark, -mw / 2, -mh / 2, mw, mh); ctx.restore(); }
  const lineA = 1 - seg(t, 1.2, 1.5);
  if (lineA > 0) { ctx.save(); ctx.globalAlpha = lineA; strokes(ctx, A.strokes.mark, d, 7); ctx.restore(); }
  const a = easeOut(seg(t, 1.5, 1.8));
  if (a > 0) {
    ctx.save(); ctx.globalAlpha = a; ctx.direction = L.dir; ctx.font = font(700, 64); ctx.textAlign = 'left';
    const [body, mark] = L.end; let px = Math.round(64 * L.scale);
    while (ctx.measureText(body + mark).width > 920 && px > 36) { px -= 2; ctx.font = `700 ${px}px "${L.font}"`; }
    const bw = ctx.measureText(body).width, kw = ctx.measureText(mark).width, x0 = (W - bw - kw) / 2;
    const [bx, mx] = L.dir === 'rtl' ? [x0 + kw, x0] : [x0, x0 + bw];
    ctx.fillStyle = CREAM; ctx.fillText(body, bx, 1180); ctx.fillStyle = PALE; ctx.fillText(mark, mx, 1180);
    ctx.textAlign = 'center'; ctx.font = font(500, 40); ctx.fillStyle = 'rgba(244,239,230,.72)'; ctx.fillText(L.endSub, W / 2, 1250);
    ctx.restore();
  }
}

function renderFrame(ctx, t, A) {
  boil = Math.floor(t * 12) % 3;
  ctx.globalAlpha = 1;
  if (t < LOGO_AT) shot(ctx, A, Math.floor(t / SEG), t % SEG);
  else logo(ctx, A, t - LOGO_AT);
}

if (typeof module !== 'undefined') module.exports = {};
