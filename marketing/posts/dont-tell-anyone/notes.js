// "لا تقول لأحد 🤫" — a secret list being typed into a notes page, live. Four real hidden cafés,
// each with its photo pasted in and its real latte price. Then the note gets shared with everyone.

const W = 1080, H = 1920, FPS = 30;
const NIGHT = '#0E1F0A', FOREST = '#2B4D1F', PALE = '#9BC48A', CREAM = '#F4EFE6', PAPER = '#FBF8F1', INK = '#141414', GREY = '#8A8478';
const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩', KEYCAP = [null, '1️⃣', '2️⃣', '3️⃣', '4️⃣'];   // ١ reads as ا at a line start, so the list uses keycaps

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const seg = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
const ease = u => u * u * (3 - 2 * u);
const easeOut = u => 1 - Math.pow(1 - u, 3);
const back = u => { const c = 1.7; return 1 + (c + 1) * Math.pow(u - 1, 3) + c * Math.pow(u - 1, 2); };
const mix = (a, b, u) => a + (b - a) * u;
function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function cover(ctx, img, x, y, w, h, fy = 0.5) {
  const s = Math.max(w / img.width, h / img.height), sw = w / s, sh = h / s;
  ctx.drawImage(img, (img.width - sw) / 2, clamp((img.height - sh) * fy, 0, img.height - sh), sw, sh, x, y, w, h);
}

// ─── words ─────────────────────────────────────────────────────────────────
// Every number comes from data.json. Café names are written exactly as listed.
const STR = {
  ar: { font: 'Tajawal', dir: 'rtl', scale: 1.08, n: s => String(s).replace(/\d/g, d => AR_DIGITS[d]).replace('.', '٫'),
        back: 'الملاحظات', done: 'تم', title: 'كوفيهات سرية 🤫', sub: 'لا تقول لأحد',
        head: (i, c) => `${KEYCAP[i]} ${c.cafe}`, where: c => `📍 ${c.areaAr}${c.areaAr === c.emirateAr ? '' : '، ' + c.emirateAr}`,
        lines: [c => [`لاتيه ${c.latte} درهم وتقييمه ${c.rating} 🤯`, `(${c.reviews} تقييم بس… محد يدري عنه)`],
                c => [`لاتيه ${c.latte} درهم. ايه والله ${c.latte}`, `(${c.rating} و${c.reviews} تقييم بس)`],
                c => [`${c.rating} ⭐ ولاتيه ${c.latte}`],
                c => [`لاتيه ${c.latte} · ${c.rating} ⭐`]],
        close: m => `متوسط اللاتيه بالإمارات ${m}… لا تشكرني 😌`,
        contacts: ['الشباب 🔥', 'البنات 💅', 'العائلة ❤️', 'الدوام 💼', 'القروب 👀'], sheet: 'مشاركة',
        out: '…خلاص انتشر 😅', end: ['القائمة كاملة على BrewMaps', '.'], endSub: 'أكثر من ٨١٢ كوفي في كل أنحاء الإمارات' },
  en: { font: 'DM Sans', dir: 'ltr', scale: 1, n: s => String(s),
        back: 'Notes', done: 'Done', title: 'secret cafés 🤫', sub: "don't tell anyone",
        head: (i, c) => `${KEYCAP[i]} ${c.cafe}`, where: c => `📍 ${c.area}${c.area === c.emirate ? '' : ', ' + c.emirate}`,
        lines: [c => [`latte AED ${c.latte} and it's rated ${c.rating} 🤯`, `(${c.reviews} reviews. nobody knows)`],
                c => [`latte AED ${c.latte}. yes, ${c.latte}`, `(${c.rating} and only ${c.reviews} reviews)`],
                c => [`${c.rating} ⭐ latte ${c.latte}`],
                c => [`latte ${c.latte} · ${c.rating} ⭐`]],
        close: m => `UAE median latte is AED ${m}… you're welcome 😌`,
        contacts: ['the boys 🔥', 'the girls 💅', 'family ❤️', 'work 💼', 'group chat 👀'], sheet: 'Share',
        out: "…ok it's out 😅", end: ['The full list is on BrewMaps', '.'], endSub: '812 cafés across the UAE' },
};
let L = STR.en;
function setLang(k) { L = STR[k] || STR.en; }
const font = (w, px) => `${w} ${Math.round(px * L.scale)}px "${L.font}", "Noto Color Emoji"`;

// ─── the note, as timed blocks ─────────────────────────────────────────────
// Each block types at its own speed; the list speeds up as it goes, like someone getting excited.
let BLOCKS, T_DONE, SHARE_AT, OUT_AT, END_AT, DURATION = 16.5;
function build(data) {
  const B = [], fmt = c => ({ ...c, latte: L.n(c.latte), rating: L.n(c.rating.toFixed(1)), reviews: L.n(c.reviews) });
  let t = 0.0, y = 520;
  const add = (type, text, style, cps, extra = {}) => {
    const n = text ? Array.from(text).length : 0, dur = type === 'photo' ? 0.35 : n / cps;
    const h = { title: 0, sub: 92, head: 118, where: 62, body: 86, note: 64, photo: 500, close: 118 }[style || type];
    y += h; B.push({ type, text, style: style || type, start: t, dur, y, ...extra }); t += dur + (extra.pause ?? 0.12);
  };
  // title and "don't tell anyone" are already there on frame one: it's the thumbnail and the hook
  B.push({ type: 'text', text: L.title, style: 'title', start: -9, dur: 0, y: 520 });
  add('text', L.sub, 'sub', 99, { pause: 0.45, start0: -9 });
  B[B.length - 1].start = -9; t = 0.55;
  const cps = [32, 46, 62, 78];
  data.cafes.forEach((c0, i) => {
    const c = fmt(c0);
    add('text', L.head(i + 1, c), 'head', cps[i], { pause: 0.05 });
    add('text', L.where(c), 'where', cps[i] * 1.3, { pause: 0.05 });
    add('photo', null, 'photo', 1, { photo: i, focusY: c0.focusY, pause: 0.04 });
    L.lines[i](c).forEach((s, k) => add('text', s, k ? 'note' : 'body', cps[i], { pause: k ? 0.12 : 0.06 }));
  });
  add('text', L.close(L.n(data.median)), 'close', 52, { pause: 0.4 });
  BLOCKS = B; T_DONE = t; SHARE_AT = T_DONE + 0.2; OUT_AT = SHARE_AT + 2.3; END_AT = OUT_AT + 1.3; DURATION = END_AT + 2.6;
}

// ─── drawing ───────────────────────────────────────────────────────────────
const STYLE = {
  title: () => [font(700, 96), INK], sub: () => [font(500, 56), GREY],
  head: () => [font(700, 56), INK], where: () => [font(500, 40), GREY], body: () => [font(700, 52), INK], note: () => [font(500, 40), GREY], close: () => [font(700, 48), FOREST],
};
const X0 = 96, X1 = 984, TW = X1 - X0;

function fitFont(ctx, f, text, maxW) {
  ctx.font = f; let px = parseInt(f.match(/(\d+)px/)[1]);
  while (ctx.measureText(text).width > maxW && px > 22) { px -= 2; ctx.font = f.replace(/\d+px/, px + 'px'); }
  return ctx.font;
}

function scrollAt(t) {                          // keep the line being typed around y≈1250
  // ease towards it: sample a few recent targets
  let acc = 0, wsum = 0;
  for (let k = 0; k < 8; k++) {
    const tt = t - k * 0.05; let tg = 0;
    for (const b of BLOCKS) if (tt >= b.start) tg = Math.max(0, b.y - 1250);
    const w = 8 - k; acc += tg * w; wsum += w;
  }
  return acc / wsum;
}

function note(ctx, A, t) {
  ctx.fillStyle = PAPER; ctx.fillRect(0, 0, W, H);
  const sc = scrollAt(Math.min(t, T_DONE + 0.3)), rtl = L.dir === 'rtl';
  ctx.save(); ctx.translate(0, -sc);
  let cursor = null;
  for (const b of BLOCKS) {
    if (t < b.start) break;
    const u = b.dur ? seg(t, b.start, b.start + b.dur) : 1;
    if (b.type === 'photo') {
      const a = easeOut(u), w = 700, h = 450, x = rtl ? X1 - w : X0, y = b.y - h - 10;
      ctx.save(); ctx.globalAlpha = a; ctx.translate(x + w / 2, y + h / 2); ctx.scale(0.9 + 0.1 * back(u), 0.9 + 0.1 * back(u));
      ctx.shadowColor = 'rgba(20,16,10,.18)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8;
      rr(ctx, -w / 2, -h / 2, w, h, 26); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent';
      ctx.save(); rr(ctx, -w / 2, -h / 2, w, h, 26); ctx.clip(); cover(ctx, A.photos[b.photo], -w / 2, -h / 2, w, h, b.focusY); ctx.restore();
      ctx.restore();
      continue;
    }
    const chars = Array.from(b.text), shown = chars.slice(0, Math.ceil(chars.length * u)).join('');
    const [f, color] = STYLE[b.style]();
    ctx.direction = L.dir; ctx.textAlign = rtl ? 'right' : 'left';
    ctx.font = fitFont(ctx, f, b.text, TW); ctx.fillStyle = color;
    ctx.fillText(shown, rtl ? X1 : X0, b.y);
    if (u < 1 || b === BLOCKS.filter(x => x.type !== 'photo' && t >= x.start).pop()) {
      const wdt = ctx.measureText(shown).width, px = parseInt(ctx.font.match(/(\d+)px/)[1]);
      cursor = [rtl ? X1 - wdt - 6 : X0 + wdt + 6, b.y - px * 0.85, px * 1.05];
    }
  }
  if (cursor && t < SHARE_AT && (Math.floor(t * 2.4) % 2 === 0 || BLOCKS.some(b => t >= b.start && t < b.start + b.dur))) {
    ctx.fillStyle = FOREST; ctx.fillRect(cursor[0] - 2, cursor[1], 5, cursor[2]);   // the cursor, in BrewMaps green
  }
  ctx.restore();

  // top bar: back, share, done
  ctx.fillStyle = PAPER; ctx.fillRect(0, 0, W, 410);
  ctx.fillStyle = 'rgba(20,20,20,.08)'; ctx.fillRect(0, 409, W, 2);
  ctx.direction = L.dir; ctx.font = font(500, 40); ctx.fillStyle = FOREST;
  ctx.textAlign = rtl ? 'right' : 'left';
  ctx.fillText((rtl ? '› ' : '‹ ') + L.back, rtl ? X1 : X0, 372);
  ctx.textAlign = rtl ? 'left' : 'right'; ctx.font = font(700, 40);
  ctx.fillText(L.done, rtl ? X0 : X1, 372);
  const sx = rtl ? X0 + 150 : X1 - 150, sy = 358;                      // share icon: box with an arrow
  ctx.strokeStyle = FOREST; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(sx - 14, sy - 6); ctx.lineTo(sx - 20, sy - 6); ctx.lineTo(sx - 20, sy + 22); ctx.lineTo(sx + 20, sy + 22); ctx.lineTo(sx + 20, sy - 6); ctx.lineTo(sx + 14, sy - 6); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(sx, sy + 8); ctx.lineTo(sx, sy - 26); ctx.moveTo(sx - 10, sy - 16); ctx.lineTo(sx, sy - 26); ctx.lineTo(sx + 10, sy - 16); ctx.stroke();
  return [sx, sy];
}

function tap(ctx, x, y, t, at) {
  const u = seg(t, at, at + 0.4); if (u <= 0 || u >= 1) return;
  ctx.beginPath(); ctx.arc(x, y, 30 * (1 - 0.3 * ease(seg(u, 0, 0.3))), 0, Math.PI * 2); ctx.fillStyle = `rgba(20,20,20,${0.25 * (1 - u)})`; ctx.fill();
  ctx.beginPath(); ctx.arc(x, y, 30 + 50 * u, 0, Math.PI * 2); ctx.lineWidth = 5; ctx.strokeStyle = `rgba(43,77,31,${1 - u})`; ctx.stroke();
}

function shareSheet(ctx, A, t) {
  const up = easeOut(seg(t, SHARE_AT + 0.25, SHARE_AT + 0.55)), down = ease(seg(t, OUT_AT - 0.3, OUT_AT));
  const h = 720, y = 900 + (1 - (up - down)) * 1100;
  ctx.fillStyle = `rgba(20,20,20,${0.25 * (up - down)})`; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.2)'; ctx.shadowBlur = 40;
  rr(ctx, 40, y, W - 80, h, 44); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore();
  const rtl = L.dir === 'rtl';
  ctx.direction = L.dir; ctx.textAlign = 'center'; ctx.font = font(700, 38); ctx.fillStyle = INK; ctx.fillText(L.sheet, W / 2, y + 80);
  // a preview of the note
  rr(ctx, 96, y + 120, W - 192, 150, 26); ctx.fillStyle = PAPER; ctx.fill();
  ctx.textAlign = rtl ? 'right' : 'left'; ctx.font = font(700, 40); ctx.fillStyle = INK; ctx.fillText(L.title, rtl ? X1 - 30 : X0 + 30, y + 190);
  ctx.font = font(500, 32); ctx.fillStyle = GREY; ctx.fillText(L.sub, rtl ? X1 - 30 : X0 + 30, y + 240);
  // five group chats; every single one gets ticked
  const n = 5, cw = (W - 192) / n;
  L.contacts.forEach((name, i) => {
    const slot = rtl ? n - 1 - i : i, cx = 96 + cw * (slot + 0.5), cy = y + 400;
    ctx.beginPath(); ctx.arc(cx, cy, 64, 0, Math.PI * 2); ctx.fillStyle = ['#DCE8D4', '#EFE3D3', '#E3E0F0', '#D9E6EE', '#F1DCDC'][i]; ctx.fill();
    const emoji = Array.from(name).pop();
    ctx.font = '56px "Noto Color Emoji"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(emoji, cx, cy + 4); ctx.textBaseline = 'alphabetic';
    ctx.direction = L.dir; ctx.font = font(500, 28); ctx.fillStyle = INK; ctx.fillText(name.replace(/\s*\S+$/u, ''), cx, cy + 112);
    const at = SHARE_AT + 0.75 + i * 0.22, c = seg(t, at + 0.1, at + 0.25);
    tap(ctx, cx, cy, t, at);
    if (c > 0) {
      ctx.save(); ctx.translate(cx + 46, cy - 46); ctx.scale(back(c), back(c));
      ctx.beginPath(); ctx.arc(0, 0, 24, 0, Math.PI * 2); ctx.fillStyle = FOREST; ctx.fill();
      ctx.beginPath(); ctx.moveTo(-10, 0); ctx.lineTo(-3, 8); ctx.lineTo(11, -8); ctx.strokeStyle = CREAM; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.stroke();
      ctx.restore();
    }
  });
}

function out(ctx, t) {
  const a = easeOut(seg(t, OUT_AT, OUT_AT + 0.3)), f = 1 - seg(t, END_AT - 0.2, END_AT);
  ctx.fillStyle = `rgba(20,20,20,${0.55 * a * f})`; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.globalAlpha = a * f; ctx.translate(W / 2, 960); ctx.scale(0.9 + 0.1 * back(a), 0.9 + 0.1 * back(a));
  ctx.direction = L.dir; ctx.textAlign = 'center'; ctx.font = font(700, 96); ctx.fillStyle = '#fff'; ctx.fillText(L.out, 0, 0);
  ctx.restore();
}

function endCard(ctx, A, t) {
  const e = ease(seg(t, END_AT - 0.2, END_AT + 0.2));
  ctx.globalAlpha = e; ctx.fillStyle = NIGHT; ctx.fillRect(0, 0, W, H);
  const m = A.mark, mw = 160, mh = mw * m.height / m.width;
  ctx.drawImage(m, (W - mw) / 2, 640, mw, mh);
  ctx.direction = L.dir; ctx.font = font(700, 74); ctx.textAlign = 'left';
  const [body, mark] = L.end; let px = Math.round(74 * L.scale);
  while (ctx.measureText(body + mark).width > 920 && px > 40) { px -= 2; ctx.font = `700 ${px}px "${L.font}"`; }
  const bw = ctx.measureText(body).width, mkw = ctx.measureText(mark).width, x0 = (W - bw - mkw) / 2;
  const [bx, mx] = L.dir === 'rtl' ? [x0 + mkw, x0] : [x0, x0 + bw];
  ctx.fillStyle = CREAM; ctx.fillText(body, bx, 900); ctx.fillStyle = PALE; ctx.fillText(mark, mx, 900);
  const f = seg(t, END_AT + 0.4, END_AT + 0.8); ctx.globalAlpha = e * f;
  ctx.textAlign = 'center'; ctx.font = font(500, 40); ctx.fillStyle = 'rgba(244,239,230,.72)'; ctx.fillText(L.endSub, W / 2, 976);
  ctx.globalAlpha = 1;
}

function renderFrame(ctx, t, A) {
  ctx.globalAlpha = 1;
  if (t < END_AT + 0.2) {
    const [sx, sy] = note(ctx, A, t);
    tap(ctx, sx, sy, t, SHARE_AT);
    if (t > SHARE_AT + 0.2 && t < OUT_AT + 0.1) shareSheet(ctx, A, t);
    if (t >= OUT_AT) out(ctx, t);
  }
  if (t >= END_AT - 0.2) endCard(ctx, A, t);
}

if (typeof module !== 'undefined') module.exports = {};
