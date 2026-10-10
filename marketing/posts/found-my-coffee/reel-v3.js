// لقيت كوفيي v3 — he checks a hot cappuccino (٢٤٪) and an iced latte (٩٢٪) on BrewMaps, cannonballs into the iced one.
// The Regular's character (../the-regular/rig.js). Plate: plates/iced-hot.jpg (AI-generated, unbranded). Plate pixels.

const DUR = 11.3;
const K = 0.9;
const GROUND = 1335;                                // where he walks: the counter, in front of the cups
const CUP_A = { rim: { cx: 260, cy: 978, rx: 152, ry: 36 }, cof: { cx: 262, cy: 1030, rx: 140, ry: 22 }, l: 108, r: 413, bot: 1322, glass: true };
const CUP_B = { cx: 838 };
const V = p => [p[0] / K, p[1] / K];

// clearer face: bigger eye, closed eyes as a happy curve, no confusion with a nose
function drawHead(ctx, P) {
  const tilt = P.tilt || 0, hc = add(RIG.neck, rot([10, -40], -tilt * 0.5));
  const H = p => J(toWorld(P, add(hc, rot(p, -tilt))));
  [200, 222, 244, 266, 288, 310].forEach((deg, i) => {
    const a = deg * Math.PI / 180, c = [44 * Math.cos(a), 44 * Math.sin(a)];
    stroke(ctx, circlePts(c, 8.5 + (i % 2), 8.5, 7).map(H), { closed: true });
  });
  const egg = circlePts([0, 0], 40, 42, 12).map(([x, y]) => [x + (x > 0 && y > 0 ? 4 : 0), y]);
  shape(ctx, egg.map(H));
  const ex = 18, ey = -8;
  if (P.eyes === 'closed') stroke(ctx, [[ex - 10, ey - 4], [ex - 3, ey + 1], [ex + 4, ey + 1], [ex + 10, ey - 4]].map(H));   // ‿ shallow: closed, content
  else { const r = P.eyes === 'wide' ? 8.5 : 7; ctx.beginPath(); cr(ctx, circlePts([ex, ey], r, r, 8).map(H), true); ctx.fillStyle = LC; ctx.fill(); }
  const m = P.mouth || 'smile';
  if (m === 'smile') stroke(ctx, [[10, 16], [20, 23], [31, 14]].map(H));
  if (m === 'grin') shape(ctx, [[8, 12], [34, 8], [30, 23], [18, 27]].map(H));
  if (m === 'flat') stroke(ctx, [[12, 20], [22, 17], [31, 21]].map(H));       // a little "meh"
  if (m === 'o') stroke(ctx, circlePts([22, 19], 6, 7, 8).map(H), { closed: true });
  return toWorld(P, hc);
}

function cupFront(ctx, C) {
  const R = C.rim;
  ctx.beginPath();
  ctx.moveTo(C.l, R.cy);
  ctx.bezierCurveTo(C.l + 4, R.cy + 160, C.l + 30, C.bot - 40, C.l + 70, C.bot);
  ctx.lineTo(C.r - 70, C.bot);
  ctx.bezierCurveTo(C.r - 30, C.bot - 40, C.r - 4, R.cy + 160, C.r, R.cy);
  ctx.ellipse(R.cx, R.cy, R.rx, R.ry, 0, 0, Math.PI, false);
  ctx.closePath();
  ctx.moveTo(C.cof.cx + C.cof.rx, C.cof.cy); ctx.ellipse(C.cof.cx, C.cof.cy, C.cof.rx, C.cof.ry, 0, 0, Math.PI * 2);
  ctx.moveTo(R.cx + R.rx - 8, R.cy + 4); ctx.ellipse(R.cx, R.cy + 4, R.rx - 8, R.ry, 0, 0, Math.PI); ctx.closePath();   // the inner front wall
}

const T = { inB: 1.6, phB: 1.7, offB: 3.3, walkA: 3.45, atA: 5.0, phA: 5.1, crouch: 6.55, jump: 6.8, land: 7.38, up: 7.62, lounge: 7.98, end: 9.3 };
const XB = 955, XA = 525;

function walk(P, t, t0, t1, x0, x1) {
  const u = easeOut(seg(t, t0, t1)), x = mix(x0, x1, u), ph = (x0 - x) / 150 * Math.PI * 2;
  P.x = x / K; P.y = (GROUND - 112 * K) / K - 4 * Math.abs(Math.sin(ph));
  const G = GROUND / K;
  const foot = (off, a) => ({ w: [P.x + P.f * (off + 24 * Math.sin(a)), G - 16 * Math.max(0, Math.cos(a))] });
  P.feet = { f: foot(6, ph), b: foot(-8, ph + Math.PI) };
  P.hands = { f: [30, -40 + 10 * Math.sin(ph)], b: [-20, -40 - 10 * Math.sin(ph)] };
}
function stand(P, x) {
  P.x = x / K; P.y = (GROUND - 112 * K) / K; const G = GROUND / K;
  P.feet = { f: { w: [P.x + P.f * 10, G] }, b: { w: [P.x - P.f * 12, G] } };
}

function scene(t) {
  const P = { f: -1, rot: 0, tilt: 0, eyes: 'open', mouth: 'smile', hands: {}, feet: {} };
  const S = { phone: 0, badge: null, lounge: false, clip: false };
  const holdUp = { f: [78, -96], b: [62, -88] };
  if (t < T.inB) { walk(P, t, 0, T.inB, 1180, XB); }
  else if (t < T.walkA) {                                   // cup B: checks BrewMaps → ٢٤٪, meh
    stand(P, XB);
    const up = ease(seg(t, T.phB, T.phB + 0.25)) * (1 - ease(seg(t, T.offB - 0.2, T.offB)));
    P.hands = { f: mix2([30, -40], holdUp.f, up), b: mix2([-20, -40], holdUp.b, up) };
    S.phone = up; P.tilt = 0.25 * up;
    if (t > 2.05) { S.badge = { pct: '٢٤٪', good: false, a: seg(t, 2.05, 2.3) * (1 - seg(t, 3.05, 3.3)) }; P.mouth = 'flat'; }
    if (t > 2.45 && t < 3.0) P.tilt = 0.25 + 0.16 * Math.sin((t - 2.45) * 22);   // shakes his head
  }
  else if (t < T.atA) { walk(P, t, T.walkA, T.atA, XB, XA); }
  else if (t < T.crouch) {                                  // cup A: ٩٢٪, delighted
    stand(P, XA);
    const up = ease(seg(t, T.phA, T.phA + 0.25)) * (1 - ease(seg(t, 6.3, 6.5)));
    P.hands = { f: mix2([30, -40], holdUp.f, up), b: mix2([-20, -40], holdUp.b, up) };
    S.phone = up; P.tilt = 0.25 * up;
    if (t > 5.45) { S.badge = { pct: '٩٢٪', good: true, a: seg(t, 5.45, 5.7) * (1 - seg(t, 6.4, 6.6)) }; P.mouth = 'grin'; P.eyes = 'wide'; }
    if (t > 5.9 && t < 6.25) P.y -= 18 * Math.sin((t - 5.9) / 0.35 * Math.PI) / K;   // a little hop
  }
  else if (t < T.land) {                                    // crouch, then a tucked cannonball arc into cup A
    if (t < T.jump) {
      const c = ease(seg(t, T.crouch, T.jump)); stand(P, XA);
      P.y += 26 * c / K; P.rot = -0.1 * c; P.hands = { f: [40, -70], b: [10, -70] }; P.mouth = 'grin'; P.eyes = 'wide';
    } else {
      const u = seg(t, T.jump, T.land);
      const p0 = [XA, GROUND - 112 * K + 24], p2 = [262, 1090], c1 = [490, 520];   // high over the rim, down into the coffee
      const q = bez(p0, c1, p2, u);
      P.x = q[0] / K; P.y = q[1] / K; P.rot = -0.25 - 0.9 * u;
      P.knee = { f: 1, b: 1 }; P.elbow = { f: 1, b: 1 };
      P.feet = { f: [44, 26], b: [24, 36] };                                    // knees hugged up
      P.hands = { f: [62, -30], b: [40, -22] };
      P.mouth = u < 0.5 ? 'grin' : 'o'; P.eyes = u < 0.5 ? 'wide' : 'closed';
      S.clip = u > 0.42;                                                       // the rim hides him as he drops in
    }
  }
  else if (t < T.lounge) {                                  // under, splash, then surfacing into the lounge
    S.clip = true; S.splash = seg(t, T.land, T.land + 0.55);
    if (t < T.up) P.hidden = true;
    const e = easeOut(seg(t, T.up, T.lounge));
    P.f = 1; P.eyes = 'closed'; P.mouth = 'grin';
    [P.x, P.y] = V([340, 990 + 80 * (1 - e)]); P.rot = -1.0; P.tilt = -0.8;
    P.knee = { f: 1, b: 1 };
    P.feet = { f: { w: V([350, 1060]) }, b: { w: V([330, 1065]) } };          // legs still in the glass
    P.hands = { f: { w: V(mix2([230, 1030], [132, 950], e)) }, b: { w: V(mix2([300, 1030], [300, 940], e)) } }; P.elbow = { f: -1, b: -1 };
  }
  else {                                                    // lounging in cup A; legs flop over the rim one by one
    S.lounge = true; S.clip = true; S.splash = seg(t, T.land, T.land + 0.55);
    P.f = 1; P.eyes = 'closed'; P.mouth = 'grin';
    const br = Math.sin(t * 2.2) * 0.025;
    [P.x, P.y] = V([340, 990]); P.rot = -1.0 + br; P.tilt = -0.8 + br;
    const sw = a => Math.sin(t * 3.1 + a) * 8;
    const l1 = easeOut(seg(t, T.lounge, T.lounge + 0.22)), l2 = easeOut(seg(t, T.lounge + 0.14, T.lounge + 0.36));
    P.knee = { f: 1, b: 1 };
    P.feet = { f: { w: V(mix2([350, 1060], [458 + sw(0), 1072], l1)) }, b: { w: V(mix2([330, 1065], [442 + sw(1.7), 1086], l2)) } };
    P.hands = { f: { w: V([132, 950]) }, b: { w: V([300, 940]) } }; P.elbow = { f: -1, b: -1 };
  }
  return { P, S };
}

function tinyPhone(ctx, c, s, assets) {
  if (s <= 0.02) return;
  const w = 62 * s, h = 110 * s, x = c[0] - w / 2, y = c[1] - h / 2, j = J([0, 0], 1);
  ctx.beginPath(); ctx.roundRect(x + j[0], y + j[1], w, h, 13 * s); ctx.fillStyle = LC; ctx.fill(); ctx.lineWidth = 2 * LINE; ctx.strokeStyle = LC; ctx.stroke();
  ctx.beginPath(); ctx.roundRect(x + 6 * s + j[0], y + 6 * s + j[1], w - 12 * s, h - 12 * s, 8 * s); ctx.fillStyle = '#25461C'; ctx.fill();
  const m = assets.mark, mw = w * 0.62, mh = mw * m.height / m.width;
  ctx.drawImage(m, c[0] - mw / 2 + j[0], c[1] - mh / 2 + j[1], mw, mh);
}

function badge(ctx, x, y, B) {
  if (!B || B.a <= 0) return;
  const s = B.a < 1 ? 0.7 + 0.45 * Math.sin(B.a * Math.PI * 0.8) : 1;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha = Math.min(1, B.a * 2);
  ctx.beginPath(); ctx.roundRect(-185, -40, 370, 80, 40); ctx.fillStyle = B.good ? '#25461C' : '#5B5F57'; ctx.fill();
  ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(244,239,230,.9)'; ctx.stroke();
  ctx.direction = 'rtl'; ctx.textAlign = 'center'; ctx.font = '800 38px "Tajawal"'; ctx.fillStyle = '#F4EFE6';
  ctx.fillText('يناسب ذوقك ' + B.pct, 0, 13);
  ctx.restore();
}

function renderReel(ctx, layer, t, assets) {
  const td = Math.floor(t * 12) / 12;
  boil = Math.floor(t * 12) % 3; jc = 0;
  const { P, S } = scene(td);

  const lc = layer.getContext('2d');
  lc.setTransform(1, 0, 0, 1, 0, 0); lc.clearRect(0, 0, 1080, 1920);
  lc.setTransform(K, 0, 0, K, 0, 0); LINE = 5.6 / K;
  const r = P.hidden ? { hand: [0, 0] } : drawCharacter(lc, P);
  if (S.clip) {
    lc.setTransform(1, 0, 0, 1, 0, 0); lc.globalCompositeOperation = 'destination-out'; lc.fillStyle = '#000';
    lc.globalAlpha = 0.55; cupFront(lc, CUP_A); lc.fill('nonzero');                       // seen through the glass, faintly
    lc.globalAlpha = 1; lc.beginPath(); lc.rect(CUP_A.l - 4, CUP_A.cof.cy, CUP_A.r - CUP_A.l + 8, CUP_A.bot - CUP_A.cof.cy + 10);
    lc.moveTo(CUP_A.cof.cx + CUP_A.cof.rx, CUP_A.cof.cy); lc.ellipse(CUP_A.cof.cx, CUP_A.cof.cy, CUP_A.cof.rx, CUP_A.cof.ry, 0, 0, Math.PI * 2);
    lc.fill('nonzero');                                                                    // under the milk: gone
    lc.globalCompositeOperation = 'source-over'; lc.setTransform(K, 0, 0, K, 0, 0);
  }
  if (S.phone > 0) tinyPhone(lc, add(r.hand, [-P.f * -10, -30]), S.phone, assets);
  if (S.splash != null && S.splash < 1) {                 // the splash: drops up and out, ripples across the coffee
    lc.setTransform(1, 0, 0, 1, 0, 0);
    const u = S.splash, C = CUP_A.cof;
    [[-70, 1.5], [-35, 2.0], [0, 2.3], [35, 1.9], [72, 1.4], [-50, 1.1], [52, 1.2]].forEach(([dx, v], i) => {
      const p = [C.cx + dx * (0.3 + 1.1 * u), C.cy - 30 - v * 210 * u + 420 * u * u];
      if (p[1] > C.cy + 6) return;
      lc.globalAlpha = Math.min(1, (1 - u) * 1.6);
      lc.beginPath(); lc.ellipse(p[0], p[1], 6 + (i % 2) * 2, 8 + (i % 2) * 2, 0, 0, 7); lc.fillStyle = LC; lc.fill();
    });
    lc.globalAlpha = 1 - u; lc.strokeStyle = LC; lc.lineWidth = 4;
    [0, 0.28].forEach(d => { const k = clamp(u - d, 0, 1); if (k <= 0) return;
      lc.beginPath(); lc.ellipse(C.cx, C.cy, 20 + (C.rx - 30) * k, 5 + (C.ry - 8) * k, 0, 0, 7); lc.stroke(); });
    lc.globalAlpha = 1; lc.setTransform(K, 0, 0, K, 0, 0);
  }
  lc.setTransform(1, 0, 0, 1, 0, 0); LINE = 6.5;

  const z = 1.1 + 0.05 * ease(seg(t, 0, T.end));
  ctx.save(); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  ctx.translate(540, 1100); ctx.scale(z, z); ctx.translate(-540, -1100);
  ctx.drawImage(assets.plate, 0, 0, 1080, 1920);
  ctx.filter = 'drop-shadow(0px 0px 1.5px rgba(20,16,10,.5)) drop-shadow(0px 3px 6px rgba(20,16,10,.35))';
  ctx.drawImage(layer, 0, 0);
  ctx.filter = 'none';
  if (S.badge) badge(ctx, clamp(P.x * K, 260, 790), GROUND - 400, S.badge);
  ctx.restore();

  // the line, once he's in
  const a = seg(t, 7.9, 8.3) * (1 - seg(t, T.end - 0.2, T.end + 0.1));
  if (a > 0) {
    ctx.save(); ctx.globalAlpha = a; ctx.direction = 'rtl'; ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 24; ctx.fillStyle = '#F4EFE6'; ctx.font = '800 74px "Tajawal"';
    ctx.fillText('لما تلقى الكوفي', 540, 470); ctx.fillText('اللي يناسبك…', 540, 562);
    ctx.restore();
  }
  // end card
  const e = seg(t, T.end, T.end + 0.45);
  if (e > 0) {
    ctx.save(); ctx.globalAlpha = e; ctx.fillStyle = 'rgba(16,36,18,.95)'; ctx.fillRect(0, 0, 1080, 1920);
    const m = assets.mark, mw = 150, mh = mw * m.height / m.width;
    ctx.drawImage(m, (1080 - mw) / 2, 640, mw, mh);
    ctx.direction = 'rtl'; ctx.textAlign = 'center'; ctx.fillStyle = '#F4EFE6';
    ctx.font = '800 70px "Tajawal"'; ctx.fillText('BrewMaps يلقى لك', 540, 900);
    ctx.fillStyle = '#A9D19A'; ctx.fillText('الكوفي اللي يناسبك.', 540, 990);
    ctx.fillStyle = 'rgba(244,239,230,.72)'; ctx.font = '500 36px "Tajawal"'; ctx.fillText('مجاني على الآب ستور وجوجل بلاي', 540, 1090);
    ctx.restore();
  }
}
