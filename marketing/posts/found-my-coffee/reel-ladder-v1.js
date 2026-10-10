// على ذوقك ep.1 "the ladder" — same café, two drinks: the hot cappuccino scores ٢٤٪ for him (he's sad, walks off with
// his hands in his pockets), the iced latte ٩٢٪: he props a tiny ladder against the glass, climbs, and plops in.
// The Regular's character (../the-regular/rig.js). Plate: plates/iced-hot.jpg (AI-generated, unbranded). Plate pixels.

const DUR = 12.4;
const K = 0.9;
const GROUND = 1335;                                // where he walks: the counter, in front of the cups
const CUP_A = { rim: { cx: 260, cy: 978, rx: 152, ry: 36 }, cof: { cx: 262, cy: 1030, rx: 140, ry: 22 }, l: 108, r: 413, bot: 1322, glass: true };
const CUP_B = { rim: { cx: 835, cy: 1012, rx: 145, ry: 42 } };
const V = p => [p[0] / K, p[1] / K];

// clearer face: bigger eye, closed eyes as a happy curve, no confusion with a nose
function drawHead(ctx, P) {
  const tilt = P.tilt || 0, sh = P.shake || 0, hc = add(add(RIG.neck, rot([10, -40], -tilt * 0.5)), [sh * 13, 0]);
  const H = p => J(toWorld(P, add(hc, rot(p, -tilt))));
  [200, 222, 244, 266, 288, 310].forEach((deg, i) => {
    const a = deg * Math.PI / 180, c = [44 * Math.cos(a), 44 * Math.sin(a)];
    stroke(ctx, circlePts(c, 8.5 + (i % 2), 8.5, 7).map(H), { closed: true });
  });
  const egg = circlePts([0, 0], 40, 42, 12).map(([x, y]) => [x + (x > 0 && y > 0 ? 4 : 0), y]);
  shape(ctx, egg.map(H));
  const ex = 18 + sh * 12, ey = -8 + (P.down || 0) * 4;
  if (P.eyes === 'closed') stroke(ctx, [[ex - 10, ey - 4], [ex - 3, ey + 1], [ex + 4, ey + 1], [ex + 10, ey - 4]].map(H));   // ‿ shallow: closed, content
  else { const r = P.eyes === 'wide' ? 8.5 : 7; ctx.beginPath(); cr(ctx, circlePts([ex, ey], r, r, 8).map(H), true); ctx.fillStyle = LC; ctx.fill(); }
  const m = P.mouth || 'smile';
  if (m === 'smile') stroke(ctx, [[10, 16], [20, 23], [31, 14]].map(H));
  if (m === 'grin') shape(ctx, [[8, 12], [34, 8], [30, 23], [18, 27]].map(H));
  if (m === 'flat') stroke(ctx, [[13 + sh * 8, 26], [22 + sh * 8, 20], [31 + sh * 8, 26]].map(H));   // a small sad frown
  if (P.brow) stroke(ctx, [[ex - 10, ey - 12], [ex + 8, ey - 19]].map(H));        // sad, worried brow (inner end up)
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

const T = { inB: 1.6, phB: 1.7, offB: 3.3, walkA: 3.35, atA: 5.75, phA: 5.85, ladder: 7.25, climb: 7.85, top: 9.0, land: 9.35, up: 9.6, lounge: 9.95, end: 10.4 };
const XB = 955, XA = 545;
const LAD = { b: [492, 1336], t: [424, 972] };              // the tiny ladder: foot on the counter, top on the glass rim

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

function ladderPt(s) { return mix2(LAD.b, LAD.t, s); }
function drawLadder(ctx, a) {                               // a = 0 lying on the counter → 1 leaning on the glass
  if (a <= 0) return;
  const top = mix2([LAD.b[0] - 360, LAD.b[1] - 6], LAD.t, ease(a)), d = [top[0] - LAD.b[0], top[1] - LAD.b[1]], L = len(d);
  const n = [-d[1] / L * 22, d[0] / L * 22];
  const W = p => J(V(p), 0.8);
  for (const sgn of [-1, 1]) stroke(ctx, [W(add(LAD.b, scl(n, sgn))), W(add(top, scl(n, sgn)))], { smooth: false, width: LINE * 0.9 });
  for (let k = 1; k <= 7; k++) { const p = mix2(LAD.b, top, k / 8); stroke(ctx, [W(add(p, n)), W(add(p, scl(n, -1)))], { smooth: false, width: LINE * 0.8 }); }
}

function sadWalk(P, t, t0, t1, x0, x1) {                   // slow, hands in pockets, head down, shoulders slumped
  const u = seg(t, t0, t1), x = mix(x0, x1, ease(u)), ph = (x0 - x) / 120 * Math.PI * 2;
  P.x = x / K; P.y = (GROUND - 112 * K) / K - 2 * Math.abs(Math.sin(ph)) + 6;
  const G = GROUND / K, foot = (off, a) => ({ w: [P.x + P.f * (off + 16 * Math.sin(a)), G - 9 * Math.max(0, Math.cos(a))] });
  P.feet = { f: foot(6, ph), b: foot(-8, ph + Math.PI) };
  P.hands = { f: [14, -16], b: [-12, -14] }; P.elbow = { f: 1, b: -1 };      // in the pockets
  P.rot = 0.1; P.tilt = -0.32; P.down = 1; P.mouth = 'flat'; P.brow = true; P.eyes = 'open';
}

function scene(t) {
  const P = { f: -1, rot: 0, tilt: 0, eyes: 'open', mouth: 'smile', hands: {}, feet: {} };
  const S = { phone: 0, badge: null, lounge: false, clip: false, ladder: 0 };
  const holdUp = { f: [78, -96], b: [62, -88] };
  const phoneUp = (t0, t1) => ease(seg(t, t0, t0 + 0.25)) * (1 - ease(seg(t, t1 - 0.2, t1)));
  if (t < T.inB) { walk(P, t, 0, T.inB, 1180, XB); }
  else if (t < T.walkA) {                                   // the hot cappuccino: ٢٤٪ for him. Sad, a slow "no"
    stand(P, XB);
    const up = phoneUp(T.phB, T.offB);
    P.hands = { f: mix2([30, -40], holdUp.f, up), b: mix2([-20, -40], holdUp.b, up) };
    S.phone = up; P.tilt = 0.25 * up;
    if (t > 2.05) { S.badge = { name: 'كابتشينو', pct: '٢٤٪', good: false, a: seg(t, 2.05, 2.3) * (1 - seg(t, 3.05, 3.3)) }; P.mouth = 'flat'; P.brow = true; }
    if (t > 2.45 && t < 3.2) P.shake = Math.sin((t - 2.45) * 15) * (1 - seg(t, 2.45, 3.2) * 0.5);
    if (t > 3.05) { P.tilt = mix(P.tilt, -0.32, seg(t, 3.05, 3.3)); P.down = seg(t, 3.05, 3.3); }
  }
  else if (t < T.atA) { sadWalk(P, t, T.walkA, T.atA, XB, XA); }
  else if (t < T.ladder) {                                  // the iced latte: ٩٢٪ — he perks right up
    stand(P, XA);
    const up = phoneUp(T.phA, 7.1);
    P.hands = { f: mix2([14, -16], holdUp.f, up), b: mix2([-12, -14], holdUp.b, up) };
    S.phone = up; P.tilt = mix(-0.32, 0.25, ease(seg(t, T.atA, T.phA + 0.2))); P.down = 1 - seg(t, T.atA, T.phA + 0.2);
    P.mouth = 'flat'; P.brow = t < 6.25;
    if (t > 6.25) { S.badge = { name: 'آيس لاتيه', pct: '٩٢٪', good: true, a: seg(t, 6.25, 6.5) * (1 - seg(t, 6.95, 7.15)) }; P.mouth = 'grin'; P.eyes = 'wide'; P.brow = false; }
    if (t > 6.6 && t < 6.9) P.y -= 18 * Math.sin((t - 6.6) / 0.3 * Math.PI) / K;
  }
  else if (t < T.climb) {                                   // pulls out a tiny ladder and leans it on the glass
    stand(P, XA + 40); S.ladder = seg(t, T.ladder + 0.15, T.climb - 0.1);
    P.hands = { f: { w: V(mix2([XA - 40, GROUND - 40], [460, 1150], ease(S.ladder))) }, b: { w: V(mix2([XA - 20, GROUND - 40], [470, 1180], ease(S.ladder))) } };
    P.elbow = { f: 1, b: 1 }; P.mouth = 'grin';
  }
  else if (t < T.top) {                                     // climbs, rung by rung
    S.ladder = 1;
    const u = seg(t, T.climb, T.top), s = 0.04 + 0.86 * u, ph = u * Math.PI * 7;
    const F = ladderPt(s), lift = 18 * Math.max(0, Math.sin(ph));
    P.x = (F[0] + 12) / K; P.y = (F[1] - 112 * K - lift * 0.3) / K; P.rot = -0.12;
    P.feet = { f: { w: V(ladderPt(s + 0.02 * Math.sin(ph))) }, b: { w: V(ladderPt(s - 0.02 * Math.sin(ph))) } };
    P.hands = { f: { w: V(ladderPt(Math.min(1, s + 0.32 + 0.04 * Math.sin(ph + 1.5)))) }, b: { w: V(ladderPt(Math.min(1, s + 0.28 - 0.04 * Math.sin(ph + 1.5)))) } };
    P.elbow = { f: 1, b: 1 }; P.mouth = 'grin'; P.eyes = 'open';
  }
  else if (t < T.land) {                                    // at the top: a little hop over the rim, in he goes
    S.ladder = 1;
    const u = seg(t, T.top, T.land), p0 = add(ladderPt(0.9), [12, -112 * K]), p2 = [300, 1090];
    const q = bez(p0, [380, 820], p2, u);
    P.x = q[0] / K; P.y = q[1] / K; P.rot = -0.3 - 0.6 * u;
    P.knee = { f: 1, b: 1 }; P.elbow = { f: 1, b: 1 };
    P.feet = { f: [44, 26], b: [24, 36] }; P.hands = { f: [-20, -250], b: [20, -250] };
    P.mouth = 'o'; P.eyes = 'wide'; S.clip = u > 0.5;
  }
  else if (t < T.lounge) {
    S.ladder = 1; S.clip = true; S.splash = seg(t, T.land, T.land + 0.5);
    if (t < T.up) P.hidden = true;
    loungePose(P, t, easeOut(seg(t, T.up, T.lounge)), 0, 0);
  }
  else {
    S.ladder = 1; S.lounge = true; S.clip = true; S.splash = seg(t, T.land, T.land + 0.5);
    loungePose(P, t, 1, easeOut(seg(t, T.lounge, T.lounge + 0.22)), easeOut(seg(t, T.lounge + 0.14, T.lounge + 0.36)));
  }
  return { P, S };
}

// sitting up on the ice: hips above the milk, so his legs run cleanly from hip to rim and over
function loungePose(P, t, e, l1, l2) {
  P.f = 1; P.eyes = 'closed'; P.mouth = 'grin';
  const br = Math.sin(t * 2.2) * 0.025;
  [P.x, P.y] = V([366, 972 + 80 * (1 - e)]); P.rot = -0.95 + br; P.tilt = -0.75 + br;
  const sw = a => Math.sin(t * 3.1 + a) * 8;
  P.knee = { f: 1, b: 1 };                                 // knees up, resting on the rim
  P.feet = { f: { w: V(mix2([380, 1010], [436 + sw(0), 1004], l1)) }, b: { w: V(mix2([368, 1012], [424 + sw(1.7), 1014], l2)) } };
  P.hands = { f: { w: V(mix2([260, 1010], [168, 948], e)) }, b: { w: V(mix2([320, 1010], [318, 942], e)) } }; P.elbow = { f: -1, b: -1 };
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
  ctx.beginPath(); ctx.roundRect(-150, -62, 300, 124, 30); ctx.fillStyle = B.good ? '#25461C' : '#5B5F57'; ctx.fill();
  ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(244,239,230,.9)'; ctx.stroke();
  ctx.direction = 'rtl'; ctx.textAlign = 'center';
  ctx.font = '700 32px "Tajawal"'; ctx.fillStyle = 'rgba(244,239,230,.85)'; ctx.fillText(B.name, 0, -12);
  ctx.font = '800 42px "Tajawal"'; ctx.fillStyle = B.good ? '#A9D19A' : '#E3DFD5'; ctx.fillText(B.pct + ' على ذوقك', 0, 38);
  ctx.restore();
}

function renderReel(ctx, layer, t, assets) {
  const td = Math.floor(t * 12) / 12;
  boil = Math.floor(t * 12) % 3; jc = 0;
  const { P, S } = scene(td);

  const lc = layer.getContext('2d');
  lc.setTransform(1, 0, 0, 1, 0, 0); lc.clearRect(0, 0, 1080, 1920);
  lc.setTransform(K, 0, 0, K, 0, 0); LINE = 5.6 / K;
  drawLadder(lc, S.ladder);
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
  if (S.badge) badge(ctx, clamp(P.x * K, 200, 860), P.y * K - 300 * K - 30, S.badge);
  ctx.restore();

  // the line, once he's in
  const a = seg(t, 7.7, 8.1) * (1 - seg(t, T.end - 0.2, T.end + 0.1));
  if (a > 0) {
    ctx.save(); ctx.globalAlpha = a; ctx.direction = 'rtl'; ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 24; ctx.fillStyle = '#F4EFE6'; ctx.font = '800 74px "Tajawal"';
    ctx.fillText('نفس الكوفي، مشروبين…', 540, 470); ctx.fillStyle = '#C9E3BC'; ctx.fillText('واحد بس على ذوقك.', 540, 562);
    ctx.restore();
  }
  // end card
  const e = seg(t, T.end, T.end + 0.45);
  if (e > 0) {
    ctx.save(); ctx.globalAlpha = e; ctx.fillStyle = 'rgba(16,36,18,.95)'; ctx.fillRect(0, 0, 1080, 1920);
    const m = assets.mark, mw = 150, mh = mw * m.height / m.width;
    ctx.drawImage(m, (1080 - mw) / 2, 640, mw, mh);
    ctx.direction = 'rtl'; ctx.textAlign = 'center'; ctx.fillStyle = '#F4EFE6';
    ctx.font = '800 70px "Tajawal"'; ctx.fillText('مو بس وين تروح…', 540, 900);
    ctx.fillStyle = '#A9D19A'; ctx.fillText('وش تشرب.', 540, 990);
    ctx.fillStyle = 'rgba(244,239,230,.72)'; ctx.font = '500 36px "Tajawal"'; ctx.fillText('مجاني على الآب ستور وجوجل بلاي', 540, 1090);
    ctx.restore();
  }
}
