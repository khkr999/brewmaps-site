// على ذوقك ep.1 "the ladder" — same café, two drinks: the hot cappuccino scores ٢٤٪ for him (he's sad, walks off with
// his hands in his pockets), the iced latte ٩٢٪: he props a tiny ladder against the glass, climbs, plants the BrewMaps
// flag, and flops back into it like it's a pool. search → effort → find → FLOP BACK → complete peace.
// The Regular's character (../the-regular/rig.js). Plate: plates/iced-hot.jpg (AI-generated, unbranded). Plate pixels.

const DUR = 18.6;
const K = 0.9;
const GROUND = 1335;                                // where he walks: the counter, in front of the cups
const CUP_A = { rim: { cx: 260, cy: 978, rx: 152, ry: 36 }, cof: { cx: 262, cy: 1030, rx: 140, ry: 22 }, l: 108, r: 413, bot: 1322, glass: true };
const CUP_B = { rim: { cx: 835, cy: 1012, rx: 145, ry: 42 } };
const V = p => [p[0] / K, p[1] / K];

// clearer face: bigger eye, closed eyes as a happy curve, no confusion with a nose
function drawHead(ctx, P) {
  if (P.front) return drawHeadFront(ctx, P);
  if (P.headF && P.headF !== P.f) {                         // the head turned the other way; it stays where it was
    const hc0 = add(RIG.neck, rot([10, -40], -(P.tilt || 0) * 0.5)), q = rot(hc0, P.rot || 0);
    return drawHead(ctx, { ...P, f: P.headF, headF: 0, x: P.x + (P.f - P.headF) * q[0] });
  }
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

function drawHeadFront(ctx, P) {                           // facing the camera, mid-turn
  const tilt = P.tilt || 0, hc = add(RIG.neck, rot([10, -40], -tilt * 0.5));
  const c = toWorld(P, hc), H = p => J(add(c, rot(p, P.rot || 0)));
  [200, 230, 260, 290, 320, 350].forEach((deg, i) => {
    const a = deg * Math.PI / 180, cc = [42 * Math.cos(a), 42 * Math.sin(a)];
    stroke(ctx, circlePts(cc, 8.5 + (i % 2), 8.5, 7).map(H), { closed: true });
  });
  shape(ctx, circlePts([0, 0], 41, 42, 12).map(H));
  const ey = -6 + (P.down || 0) * 4;
  for (const ex of [-13, 13]) { ctx.beginPath(); cr(ctx, circlePts([ex, ey], 6, 6, 8).map(H), true); ctx.fillStyle = LC; ctx.fill(); }
  if (P.brow) { stroke(ctx, [[-21, ey - 12], [-7, ey - 17]].map(H)); stroke(ctx, [[7, ey - 17], [21, ey - 12]].map(H)); }
  stroke(ctx, P.mouth === 'smile' ? [[-10, 16], [0, 23], [10, 16]].map(H) : [[-9, 22], [0, 16], [9, 22]].map(H));   // a smile, or the sad "no"
  return c;
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

const T = { inB: 1.05, phB: 1.1, b1: 1.4, no0: 1.62, offB: 2.7, walkA: 2.75, atA: 4.25, phA: 4.3, b2: 4.6, hop: 4.95, unpack: 5.6,
  extend: 6.85, top: 8.0, pocket: 8.16, pulled: 8.36, unfurled: 8.52, stab: 8.56, planted: 8.68, turn: 8.74, flop: 9.04, land: 9.56,
  settled: 9.86, kick: 10.16, push: 10.36, fallen: 10.86, gone: 11.2, line: 11.3, end: 15.5 };
const NO_STEP = 1 / 12, NO = ['f', 'r', 'f', 'o', 'f', 'o'];   // the head-shake "no", one pose per drawing
const RIMF = [410, 962];                                    // where the flag stands: the back of the glass rim, flying into the gap between the drinks
const XB = 955, XA = 545;
const LAD = { b: [492, 1336], t: [424, 972] };              // the tiny ladder: foot on the counter, top on the glass rim

function walk(P, t, t0, t1, x0, x1) {
  const u = easeOut(seg(t, t0, t1)), x = mix(x0, x1, u), ph = (x0 - x) / 150 * Math.PI * 2;
  P.x = x / K; P.y = (GROUND - 112 * K) / K - 4 * Math.abs(Math.sin(ph));
  const G = GROUND / K;
  const foot = (off, a) => ({ w: [P.x + P.f * (off + 24 * Math.sin(a)), G - 16 * Math.max(0, Math.cos(a))] });
  P.feet = { f: foot(6, ph), b: foot(-8, ph + Math.PI) };
  P.hands = { f: [30, -40 + 10 * Math.sin(ph)], b: [-22, -34 - 8 * Math.sin(ph)] };
}
function stand(P, x) {
  P.x = x / K; P.y = (GROUND - 112 * K) / K; const G = GROUND / K;
  P.feet = { f: { w: [P.x + P.f * 10, G] }, b: { w: [P.x - P.f * 12, G] } };
}

function ladderPt(s) { return mix2(LAD.b, LAD.t, s); }
const FOLD = 120;                                          // folded length
function drawLadder(ctx, b, t, rungs) {                           // plate points: foot, top
  if (!b) return;
  const d = [t[0] - b[0], t[1] - b[1]], L = len(d), n = [-d[1] / L * 18, d[0] / L * 18], W = p => J(V(p), 0.8);
  for (const sgn of [-1, 1]) stroke(ctx, [W(add(b, scl(n, sgn))), W(add(t, scl(n, sgn)))], { smooth: false, width: LINE * 0.9 });
  const k = rungs || Math.max(2, Math.round(L / 46));
  for (let i = 1; i < k; i++) { const p = mix2(b, t, i / k); stroke(ctx, [W(add(p, n)), W(add(p, scl(n, -1)))], { smooth: false, width: LINE * 0.8 }); }
}
// The BrewMaps flag from The Regular (rig.js drawFlag), with a pole length and how far it's unfurled (0 = rolled up).
function flagX(ctx, base, lean = 0, t = 0, dir = 1, open = 1, pole = 132) {
  const sz = clamp(pole / 132, 0.25, 1), top = add(base, rot([0, -pole], lean)), fw = (12 + 100 * open) * sz, fh = 76 * sz, wave = k => 5 * open * Math.sin(t * 9 - k * 2.4);
  stroke(ctx, [J(base), J(top)], { smooth: false });
  const edge = [0, .33, .66, 1].map(k => [dir * k * fw, wave(k) * k]);
  const pts = [...edge, ...edge.slice().reverse().map(([x, y]) => [x, y + fh])].map(p => J(add(top, rot(p, lean))));
  shape(ctx, pts, { smooth: false, fill: FOREST });
  const m = ASSETS.mark;
  if (m && open > 0.55 && sz > 0.95) {
    const mw = 70, mh = mw * m.height / m.width, c = add(top, rot([dir * fw / 2, fh / 2 + wave(.5) * .5], lean));
    ctx.save(); ctx.globalAlpha = Math.min(1, (open - 0.55) / 0.35); ctx.translate(c[0], c[1]); ctx.rotate(lean); ctx.drawImage(m, -mw / 2, -mh / 2, mw, mh); ctx.restore();
  }
}
const LAD_L = len([LAD.t[0] - LAD.b[0], LAD.t[1] - LAD.b[1]]);
function plantedFlag(t) {                                    // on the rim: wobbles when planted, when he splashes, when the ladder goes
  const w = (t0, a, d, f) => t > t0 ? a * Math.exp(-(t - t0) * d) * Math.sin((t - t0) * f) : 0;
  return { base: V(RIMF), lean: w(T.planted, 0.16, 7, 30) + w(T.push, 0.05, 6, 28) + w(T.land, 0.1, 5, 26), open: 1, pole: 132, dir: 1, back: true };               // on the far rim: always behind him
}
function ladderAt(t) {                                       // pushed off the rim with his foot: tips over and lands on the counter
  const n = Math.round(LAD_L / 46);
  if (t < T.push) return { b: LAD.b, t: LAD.t };
  const u = seg(t, T.push, T.fallen), k = 0.15 * u + 0.85 * u * u * u;
  const th0 = Math.atan2(LAD.t[1] - LAD.b[1], LAD.t[0] - LAD.b[0]), th1 = Math.atan2(114, 238);
  const bounce = t > T.fallen ? 0.07 * Math.sin(seg(t, T.fallen, T.fallen + 0.25) * Math.PI) : 0;
  const th = mix(th0, th1, k) - bounce, L = mix(LAD_L, 264, k), b = add(LAD.b, [12 * k, 4 * k]);
  return { b, t: add(b, [L * Math.cos(th), L * Math.sin(th)]), n };
}
const BAG = [604, 1338];                                     // where he sets it down (bottom-centre)
function drawBag(ctx, c, open) {                            // plate coords: bottom-centre; open 0..1
  const W = p => J(V(add(c, p)), 0.7);
  const body = [[-34, 0], [-38, -40], [38, -40], [34, 0]].map(W);
  shape(ctx, body, { smooth: false });                                           // white line art: green is kept for BrewMaps
  stroke(ctx, [[-20, -40], [-16, -62], [16, -62], [20, -40]].map(W), { width: LINE * 0.8 });          // handle
  const ang = -2.2 * ease(open), hinge = [-38, -40];
  const flap = [[0, 0], [76, 0], [70, 18], [6, 18]].map(p => add(hinge, rot(p, ang)));
  shape(ctx, flap.map(W), { smooth: false });
  if (open < 0.5) { ctx.beginPath(); ctx.arc(...W([0, -24]), 4 / K, 0, 7); ctx.fillStyle = LC; ctx.fill(); }  // clasp
}
function handB(P) {                                          // where his back hand is, in plate pixels
  return scl(toWorld(P, ik(RIG.shB, tgt(P, P.hands.b), RIG.upper, RIG.fore, P.elbow?.b ?? -1)[2]), K);
}
function backLadder(P) {                                    // folded on his back: follows the torso
  const a = toWorld(P, [-56, -150]), c = toWorld(P, [-56, -20]);
  return { b: scl(c, K), t: scl(a, K) };
}

function sadWalk(P, t, t0, t1, x0, x1) {                   // slow, hands in pockets, head down, shoulders slumped
  const u = seg(t, t0, t1), x = mix(x0, x1, ease(u)), ph = (x0 - x) / 120 * Math.PI * 2;
  P.x = x / K; P.y = (GROUND - 112 * K) / K - 2 * Math.abs(Math.sin(ph)) + 6;
  const G = GROUND / K, foot = (off, a) => ({ w: [P.x + P.f * (off + 16 * Math.sin(a)), G - 9 * Math.max(0, Math.cos(a))] });
  P.feet = { f: foot(6, ph), b: foot(-8, ph + Math.PI) };
  P.hands = { f: [14, -16], b: [-18, -28] }; P.elbow = { f: 1, b: -1 };      // one hand in his pocket, the bag drooping in the other
  P.rot = 0.1; P.tilt = -0.32; P.down = 1; P.mouth = 'flat'; P.brow = true; P.eyes = 'open';
}

function scene(t) {
  const P = { f: -1, rot: 0, tilt: 0, eyes: 'open', mouth: 'smile', hands: {}, feet: {} };
  const S = { phone: 0, badge: null, clip: false, lad: null };
  const holdUp = { f: [78, -96], b: [62, -88] };
  const phoneUp = (t0, t1) => ease(seg(t, t0, t0 + 0.2)) * (1 - ease(seg(t, t1 - 0.18, t1)));
  if (t < T.inB) { walk(P, t, 0, T.inB, 1180, XB); }
  else if (t < T.walkA) {                                   // the hot cappuccino: ٢٤٪ for him. Sad, a quick "no"
    stand(P, XB);
    const up = phoneUp(T.phB, T.offB);
    P.hands = { f: mix2([30, -40], holdUp.f, up), b: [-22, -34] };
    S.phone = up; P.tilt = 0.25 * up;
    if (t > T.b1) { S.badge = { name: 'كابتشينو', pct: '٢٤٪', good: false, a: seg(t, T.b1, T.b1 + 0.2) * (1 - seg(t, T.offB - 0.25, T.offB)) }; P.mouth = 'flat'; P.brow = true; }
    if (t >= T.no0 && t < T.no0 + NO.length * NO_STEP) {
      const seq = NO[Math.floor((t - T.no0) / NO_STEP + 1e-6)] || 'o';
      if (seq === 'f') P.front = true; if (seq === 'r') P.headF = -P.f;
    }
    if (t > T.offB - 0.25) { P.tilt = mix(P.tilt, -0.32, seg(t, T.offB - 0.25, T.offB)); P.down = seg(t, T.offB - 0.25, T.offB); }
  }
  else if (t < T.atA) { sadWalk(P, t, T.walkA, T.atA, XB, XA); }
  else if (t < T.unpack) {                                  // the iced latte: ٩٢٪ — he perks right up
    stand(P, XA);
    const up = phoneUp(T.phA, T.unpack - 0.05);
    P.hands = { f: mix2([14, -16], holdUp.f, up), b: [-22, -34] };
    S.phone = up; P.tilt = mix(-0.32, 0.25, ease(seg(t, T.atA, T.phA + 0.15))); P.down = 1 - seg(t, T.atA, T.phA + 0.15);
    P.mouth = 'flat'; P.brow = t < T.b2;
    if (t > T.b2) { S.badge = { name: 'آيس لاتيه', pct: '٩٢٪', good: true, a: seg(t, T.b2, T.b2 + 0.2) * (1 - seg(t, T.unpack - 0.2, T.unpack)) }; P.mouth = 'grin'; P.eyes = 'wide'; P.brow = false; }
    if (t > T.hop && t < T.hop + 0.25) P.y -= 18 * Math.sin((t - T.hop) / 0.25 * Math.PI) / K;
  }
  else if (t < T.extend) {                                  // bag down → open → folded ladder out → planted → extends (quick)
    stand(P, XA); P.mouth = 'grin';
    const u0 = T.unpack, L1 = LAD_L, dir = scl([LAD.t[0] - LAD.b[0], LAD.t[1] - LAD.b[1]], 1 / L1);
    const down = ease(seg(t, u0, u0 + 0.22)), open = seg(t, u0 + 0.25, u0 + 0.4), pull = ease(seg(t, u0 + 0.42, u0 + 0.62)), move = ease(seg(t, u0 + 0.64, u0 + 0.84)), grow = seg(t, u0 + 0.86, T.extend);
    S.bag = { at: 1, open };
    if (t < u0 + 0.25) {                                    // crouch and set it down beside him
      P.y += 22 * Math.sin(Math.PI * down) / K; P.hands = { f: [30, -40], b: { w: V(mix2([BAG[0], BAG[1] - 70], [BAG[0], BAG[1] - 40], down)) } }; P.elbow = { b: 1 };
      S.bag.at = down;
    } else if (t < u0 + 0.64) {                             // opens it, lifts the folded ladder straight out
      const lb = [BAG[0], BAG[1] - 30 - 120 * pull], lt = [BAG[0] - 6, BAG[1] - 30 - 120 * pull - FOLD];
      if (pull > 0) S.lad = { b: lb, t: lt };
      P.hands = { f: pull > 0 ? { w: V(mix2(lb, lt, 0.4)) } : { w: V([BAG[0] - 20, BAG[1] - 40]) }, b: { w: V([BAG[0] + 26, BAG[1] - 44]) } }; P.elbow = { f: 1, b: 1 };
      P.tilt = -0.25;
    } else {                                                // carries it over, plants it on the glass, it extends
      const from = { b: [BAG[0], BAG[1] - 150], t: [BAG[0] - 6, BAG[1] - 150 - FOLD] }, to = { b: LAD.b, t: add(LAD.b, scl(dir, FOLD)) };
      const clicks = Math.min(3, Math.floor(grow * 3 + 1e-4)), sub = ease(clamp(grow * 3 - clicks, 0, 1));
      const L = mix(FOLD, L1, (clicks + (clicks < 3 ? sub : 0)) / 3);
      S.lad = move < 1 ? { b: mix2(from.b, to.b, move), t: mix2(from.t, to.t, move) } : { b: LAD.b, t: add(LAD.b, scl(dir, L)) };
      const grip = mix2(S.lad.b, add(S.lad.b, scl(dir, FOLD)), 0.6);
      P.hands = { f: { w: V(grip) }, b: { w: V(add(grip, [14, 18])) } }; P.elbow = { f: 1, b: 1 };
      P.tilt = move >= 1 ? -0.2 - 0.25 * grow : 0;
    }
  }
  else if (t < T.top) {                                     // climbs, quick, rung by rung
    S.lad = { b: LAD.b, t: LAD.t }; S.bag = { at: 1, open: 1 };
    const u = seg(t, T.extend, T.top), s = 0.04 + 0.86 * u, ph = u * Math.PI * CLIMB;
    const F = ladderPt(s), lift = 18 * Math.max(0, Math.sin(ph));
    P.x = (F[0] + 12) / K; P.y = (F[1] - 112 * K - lift * 0.3) / K; P.rot = -0.12;
    P.feet = { f: { w: V(ladderPt(s + 0.02 * Math.sin(ph))) }, b: { w: V(ladderPt(s - 0.02 * Math.sin(ph))) } };
    P.hands = { f: { w: V(ladderPt(Math.min(1, s + 0.32 + 0.04 * Math.sin(ph + 1.5)))) }, b: { w: V(ladderPt(Math.min(1, s + 0.28 - 0.04 * Math.sin(ph + 1.5)))) } };
    P.elbow = { f: 1, b: 1 }; P.mouth = 'effort'; P.eyes = 'open';
  }
  else if (t < T.turn) {                                    // at the top: the flag out of his pocket, up, open, planted on the rim
    S.lad = { b: LAD.b, t: LAD.t }; S.bag = { at: 1, open: 1 };
    const F0 = ladderPt(0.9);
    P.x = (F0[0] + 12) / K; P.y = (F0[1] - 112 * K) / K + 14 * ease(seg(t, T.stab, T.planted)) / K; P.rot = -0.12 * (1 - ease(seg(t, T.top, T.pocket)));
    P.feet = { f: { w: V(ladderPt(0.92)) }, b: { w: V(ladderPt(0.88)) } };
    P.elbow = { f: 1, b: 1 }; P.mouth = 'grin'; P.eyes = 'open';
    const rest = toWorld(P, [30, -40]), pocket = toWorld(P, [20, -2]), high = toWorld(P, [92, -222]), grip1 = add(V(RIMF), [0, -30]);
    const h = t < T.pocket ? mix2(rest, pocket, ease(seg(t, T.top, T.pocket)))
      : t < T.pulled ? mix2(pocket, high, ease(seg(t, T.pocket, T.pulled)))
      : t < T.stab ? high : mix2(high, grip1, easeIn(seg(t, T.stab, T.planted)));
    P.hands = { f: { w: h }, b: { w: V(ladderPt(1)) } };
    if (t >= T.pocket) {
      const pole = 30 + 102 * easeOut(seg(t, T.pocket + 0.02, T.pulled)), open = easeOut(seg(t, T.pulled, T.unfurled));
      S.flag = t < T.planted ? { base: add(h, [0, Math.min(30, pole * 0.3)]), lean: 0, open, pole, dir: t < T.stab ? -1 : 1 } : plantedFlag(t);
    }
  }
  else if (t < T.land) {                                    // found it. Turns his back to the drink… and flops back into it
    S.bag = { at: 1, open: 1 }; S.flag = plantedFlag(t); S.lad = ladderAt(t);
    const F0 = ladderPt(0.9), H0 = [F0[0] + 12, F0[1] - 112 * K];
    if (t < T.flop) {                                       // the turn: a glance to camera, then his back to the glass
      P.x = H0[0] / K; P.y = H0[1] / K; P.f = 1; P.front = true;   // a satisfied glance to camera: my work here is done
      P.feet = { f: { w: V(ladderPt(0.92)) }, b: { w: V(ladderPt(0.88)) } };
      P.hands = { f: [26, -30], b: [-20, -30] }; P.mouth = 'smile';
    } else {                                                // the flop: he tips backward off the ladder, straight into the float pose
      P.x = H0[0] / K; P.y = H0[1] / K; P.f = 1;
      P.feet = { f: { w: V(ladderPt(0.92)) }, b: { w: V(ladderPt(0.88)) } };
      P.hands = { f: [26, -30], b: [-20, -30] }; P.mouth = 'smile';
      S.fallP = { ...P }; P.hidden = true; S.fall = 0;        // renderReel sets the blend from the true time (on ones)
    }
  }
  else {                                                    // complete peace: floating. One push sends the ladder away; the flag stays
    P.hidden = true; S.fall = 1; S.flag = plantedFlag(t);
    const fade = 1 - seg(t, T.gone, T.gone + 0.4);           // the ladder (down on the counter) and the pouch leave; the frame turns clean
    if (fade > 0) { S.bag = { at: 1, open: 1 }; S.lad = ladderAt(t); S.propA = fade; }
    S.kick = { reach: ease(seg(t, T.kick, T.push)), out: ease(seg(t, T.push, T.push + 0.12)), back: ease(seg(t, T.push + 0.3, T.push + 0.7)) };
    S.splash = seg(t, T.land, T.land + 0.5);
    S.ripples = [0, 1, 2, 3].map(i => T.settled + i * 2.4).filter(t0 => t > t0 && t < t0 + 2.6).map(t0 => seg(t, t0, t0 + 2.6));
  }
  return { P, S };
}
const CLIMB = 7;                                            // climbing: half-strides over the climb (rung taps at each)

// ─── the float: a man lying on his back in the coffee, as if it were a swimming pool ───────────────
// The 3/4-overhead pose was found with an image model (plates/float-pose-source.png) and is TRACED here with the
// character's own drawing code: same head and hair loops, tube limbs, line weight and boil as the rest of the reel.
// Joint positions below are in that reference image's pixels (mirrored, 869×845), mapped onto the cup with a little
// extra foreshortening. Head back toward the far side of the cup, eyes closed, arms dropped outward past both sides with
// loose open hands, legs loose, feet falling outward. His hips and upper legs are under the coffee (soft erase inside the
// rim + a waterline); below the rim he shows faintly through the glass. One fixed pose: the whole figure drifts 1–2 px.
var FL = { land: [306, 968], c: [262, 968], s: 0.44, sq: 0.62, hip: [47, 32], hipR: [65, 26], line: 6.1, body: 0.86 };
const TRACE = {
  o: [434.5, 422.5],
  head: [272, 128], neck: [[300, 196], [312, 236]],
  torso: [[262, 232], [292, 330], [350, 440], [418, 478], [470, 470], [522, 368], [452, 252], [400, 226], [338, 214]],
  shorts: [[330, 420], [430, 412], [540, 352]],
  armL: [[282, 282], [190, 380], [100, 482]], armR: [[436, 244], [564, 274], [684, 300]],
  legL: [[410, 452], [462, 592], [486, 716], [530, 784]],
  legR: [[488, 436], [620, 546], [734, 640], [800, 652]],
  hipC: [448, 440], across: 0.94, headBack: -0.12,
};
function standJoints(P0) {                                 // the rig's joints for a pose, in screen px (same maths as drawCharacter)
  const W = p => scl(toWorld(P0, p), K);
  const arm = which => { const root = which === 'b' ? RIG.shB : RIG.shF; return ik(root, tgt(P0, P0.hands[which]), RIG.upper, RIG.fore, P0.elbow?.[which] ?? -1).map(W); };
  const leg = which => {
    const root = which === 'b' ? RIG.hipB : RIG.hipF, [h, k, a] = ik(root, tgt(P0, P0.feet[which]), RIG.thigh, RIG.shin, P0.knee?.[which] ?? 1);
    const d = [(a[0] - k[0]) / RIG.shin, (a[1] - k[1]) / RIG.shin]; return [h, k, a, add(a, scl([d[1], -d[0]], RIG.toe))].map(W);
  };
  return { armL: arm('b'), armR: arm('f'), legL: leg('b'), legR: leg('f'), hip: W([0, 0]), neck: W(RIG.neck), head: W(add(RIG.neck, [10, -40])), rot: 0, across: 1, body: 1 };
}
function floatJoints(t, kick) {                             // the traced float pose, in screen px; kick: his near leg pushes the ladder
  const d = [1.3 * Math.sin(t * 0.42), 0.9 * Math.sin(t * 0.57 + 1.3)], cx = FL.c[0] + d[0], cy = FL.c[1] + d[1];
  const M = ([x, y]) => [cx + (x - TRACE.o[0]) * FL.s, cy + (y - TRACE.o[1]) * FL.s * FL.sq];
  const neck = M(TRACE.neck[0]), head = M(TRACE.head), crown = scl([head[0] - neck[0], head[1] - neck[1]], 1 / len([head[0] - neck[0], head[1] - neck[1]]));
  let legR = TRACE.legR.map(M);
  if (kick) {                                               // knee up, foot to the ladder's rail, a shove, and back to rest
    const touch = [legR[0], [396, 992], [436, 1000], [456, 994]], pushed = [legR[0], [404, 988], [478, 992], [498, 986]];
    legR = legR.map((p, i) => { let q = mix2(p, touch[i], kick.reach); q = mix2(q, pushed[i], kick.out); return mix2(q, p, kick.back); });
  }
  return { armL: TRACE.armL.map(M), armR: TRACE.armR.map(M), legL: TRACE.legL.map(M), legR, hip: M(TRACE.hipC), neck, head,
    rot: Math.atan2(crown[0], -crown[1]) + TRACE.headBack, across: TRACE.across, body: FL.body, hx: cx + FL.hip[0], hy: cy + FL.hip[1] };
}
function drawFloater(ctx, t, k = 1, P0 = null, kick = null) {
  // Drawn with the character's own parts: the profile head (one eye, hair loops on the crown), the rig's torso with its
  // shorts line, tube limbs and round hands. k blends every joint from his standing pose on the ladder (0) to the float (1),
  // so the fall is the same figure tipping back, not a cut.
  const Fj = floatJoints(t, kick), Sj = P0 && k < 1 ? standJoints(P0) : null;
  const e = Sj ? easeIn(k) : 1, eh = Sj ? Math.pow(clamp((k - 0.08) / 0.92, 0, 1), 1.8) : 1;   // the head lags: it whips back last
  const bl = (a, b, u) => Sj ? mix2(a, b, u) : b;
  const J2 = (A, B, u) => A.map((p, i) => bl(p, B[i], u));
  const jt = Sj ? { armL: J2(Sj.armL, Fj.armL, e), armR: J2(Sj.armR, Fj.armR, e), legL: J2(Sj.legL, Fj.legL, e), legR: J2(Sj.legR, Fj.legR, e),
    hip: bl(Sj.hip, Fj.hip, e), neck: bl(Sj.neck, Fj.neck, e), head: bl(Sj.head, Fj.head, eh), rot: mix(0, Fj.rot, eh),
    across: mix(1, Fj.across, e), body: mix(1, Fj.body, e) } : Fj;
  const FS = K * jt.body, D = p => [p[0] / FS, p[1] / FS], X = p => J(D(p));
  ctx.save(); ctx.setTransform(FS, 0, 0, FS, 0, 0); LINE = 5.6 / K;
  for (const L of [jt.legL, jt.legR]) tube(ctx, L.map(X), RIG.leg);
  for (const A of [jt.armL, jt.armR]) tube(ctx, A.map(X), RIG.arm);
  const hip = D(jt.hip), neck = D(jt.neck), ax = [neck[0] - hip[0], neck[1] - hip[1]], L = len(ax), u = scl(ax, 1 / L), v = [-u[1], u[0]];
  const TW = ([x, y]) => add(hip, add(scl(v, x * jt.across), scl(u, -y * L / 160)));
  const tp = RIG.torso.map(p => J(TW(p)));
  shape(ctx, tp);
  ctx.save(); ctx.beginPath(); cr(ctx, tp, true); ctx.clip(); stroke(ctx, [[-60, -30], [0, -22], [64, -32]].map(p => J(TW(p)))); ctx.restore();
  for (const A of [jt.armL, jt.armR]) shape(ctx, circlePts(D(A[2]), RIG.hand, RIG.hand, 8).map(p => J(p, 0.8)));
  const hc = D(jt.head), hl = add(RIG.neck, [10, -40]), q = rot(hl, jt.rot);
  const P = { f: 1, rot: jt.rot, tilt: 0, eyes: k > 0.8 ? 'closed' : 'open', mouth: k > 0.8 ? 'rest' : 'smile', x: hc[0] - q[0], y: hc[1] - q[1] };
  tube(ctx, [TW([4, -150]), toWorld(P, RIG.neck)].map(p => J(p)), 16);
  drawHead(ctx, P);
  if (k > 0.8) { const m0 = toWorld(P, add(hl, [26, 16])), m1 = toWorld(P, add(hl, [28, 24])); stroke(ctx, [J(m0, 0.5), J(m1, 0.5)], { smooth: false, width: LINE * 0.9 }); }
  ctx.restore(); LINE = FL.line;
  // into the coffee: hips and upper legs go under (a soft erase, only inside the rim), the rest below the rim is faint
  const w = clamp((k - 0.7) / 0.3, 0, 1); if (w <= 0) return;
  const Rr = CUP_A.rim, hx = Fj.hx, hy = Fj.hy;
  ctx.save();
  ctx.beginPath(); ctx.ellipse(Rr.cx, Rr.cy + 2, Rr.rx - 2, Rr.ry - 2, 0, 0, Math.PI * 2); ctx.clip();
  ctx.globalCompositeOperation = 'destination-out'; ctx.globalAlpha = w;
  ctx.translate(hx, hy); ctx.scale(1, FL.hipR[1] / FL.hipR[0]);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, FL.hipR[0]); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(0.72, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, FL.hipR[0], 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  ctx.save(); ctx.globalCompositeOperation = 'destination-out'; ctx.globalAlpha = 0.55 * w; cupFront(ctx, CUP_A); ctx.fill('nonzero'); ctx.restore();
  ctx.save(); ctx.strokeStyle = LC; ctx.lineCap = 'round'; ctx.globalAlpha = 0.8 * w; ctx.lineWidth = 3;                                            // the waterline
  ctx.beginPath(); ctx.ellipse(hx, hy + FL.hipR[1] * 0.5, FL.hipR[0] * 0.92, FL.hipR[0] * 0.2, 0, 0.12 * Math.PI, 0.88 * Math.PI); ctx.stroke();
  ctx.globalAlpha = 0.45 * w; ctx.beginPath(); ctx.ellipse(hx, hy + FL.hipR[1] * 0.62, FL.hipR[0] * 1.25, FL.hipR[0] * 0.27, 0, 0.25 * Math.PI, 0.75 * Math.PI); ctx.stroke();
  ctx.restore();
}
function openHand(ctx, w, fd, side) {                       // loose and open: palm, four separated fingers, thumb; wrist dropped
  const g = [0, 1], m = add(scl(fd, 0.7), scl(g, 0.3)), dd = scl(m, 1 / len(m));
  const palm = add(w, scl(dd, 8));
  shape(ctx, circlePts(palm, 10, 9, 8, Math.atan2(dd[1], dd[0])).map(p => J(p, 0.5)));
  [-0.5, -0.17, 0.16, 0.47].forEach((r, i) => {
    const fdir = rot(dd, r), b = add(palm, scl(fdir, 8)), L = [11, 14, 13, 10][i];
    const mid = add(b, scl(rot(fdir, 0.12 * side), L * 0.55)), tip = add(b, scl(rot(fdir, 0.26 * side), L));
    stroke(ctx, [b, mid, tip].map(p => J(p, 0.4)), { width: LINE * 0.8 });
  });
  const th = rot(dd, -1.2 * side), tb = add(palm, scl(th, 7));
  stroke(ctx, [tb, add(tb, scl(rot(th, 0.4 * side), 9))].map(p => J(p, 0.4)), { width: LINE * 0.8 });
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
  ctx.beginPath(); ctx.roundRect(-150, -62, 300, 124, 30); ctx.fillStyle = B.good ? '#163514' : '#BFD9AE'; ctx.fill();
  ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(244,239,230,.9)'; ctx.stroke();
  ctx.direction = 'rtl'; ctx.textAlign = 'center';
  ctx.font = '700 32px "Tajawal"'; ctx.fillStyle = B.good ? 'rgba(244,239,230,.85)' : 'rgba(22,53,20,.75)'; ctx.fillText(B.name, 0, -12);
  ctx.font = '800 42px "Tajawal"'; ctx.fillStyle = B.good ? '#A9D19A' : '#163514'; ctx.fillText(B.pct + ' على ذوقك', 0, 38);
  ctx.restore();
}

// soft steam rising off the hot cappuccino: a few blurred wisps on their own slow loops
function drawSteam(ctx, t) {
  ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.lineCap = 'round'; ctx.filter = 'blur(7px)';
  for (let i = 0; i < 5; i++) {
    const ph = i * 1.9, cyc = (t * 0.32 + i * 0.21) % 1, x0 = 790 + i * 22, base = 985 - cyc * 60, hgt = 230 + 40 * (i % 2);
    const g = ctx.createLinearGradient(0, base, 0, base - hgt), a = 0.55 * Math.sin(Math.PI * cyc);
    g.addColorStop(0, 'rgba(255,248,238,0)'); g.addColorStop(0.25, `rgba(255,248,238,${a})`); g.addColorStop(1, 'rgba(255,248,238,0)');
    ctx.beginPath();
    for (let k = 0; k <= 30; k++) {
      const u = k / 30, x = x0 + (6 + 30 * u) * Math.sin(u * 5 + t * 1.2 + ph) + 14 * u * Math.sin(t * 0.6 + ph), y = base - u * hgt;
      k ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.strokeStyle = g; ctx.lineWidth = 18 + 9 * (i % 3); ctx.stroke();
  }
  ctx.restore();
}

const FLC = typeof document !== 'undefined' ? document.createElement('canvas') : null;   // the floater on its own layer
if (FLC) { FLC.width = 1080; FLC.height = 1920; }
function camera(t) {                                         // a slow push toward the iced latte at the climax
  const c = ease(seg(t, T.land + 0.15, T.land + 1.7));                                    // held through the fall; eases in once he's settled
  return { z: 1.1 + 0.04 * ease(seg(t, 0, T.land)) + 0.12 * c, cx: mix(540, 446, c), cy: mix(1100, 1010, c) };
}
function renderReel(ctx, layer, t, assets) {
  const td = Math.floor(t * 12) / 12;
  boil = Math.floor(t * 12) % 3; jc = 0;
  const { P, S } = scene(td);

  const lc = layer.getContext('2d');
  lc.setTransform(1, 0, 0, 1, 0, 0); lc.clearRect(0, 0, 1080, 1920);
  lc.setTransform(K, 0, 0, K, 0, 0); LINE = 6.1 / K;
  if (S.fall != null && S.fall < 1) S.fall = easeIn(seg(t, T.flop + 0.06, T.land));      // the fall runs on ones
  lc.globalAlpha = S.propA ?? 1;
  if (S.bag && S.bag.at >= 1) drawBag(lc, BAG, S.bag.open);
  lc.globalAlpha = 1;
  if (S.flag && S.flag.back) flagX(lc, S.flag.base, S.flag.lean, td, S.flag.dir, S.flag.open, S.flag.pole);
  const r = P.hidden ? { hand: [0, 0] } : drawCharacter(lc, P);
  if (!P.hidden && !(S.bag && S.bag.at >= 1)) { const hb = handB(P); drawBag(lc, add(hb, [0, 50]), 0); }
  if (S.lad) { lc.save(); lc.globalAlpha = S.propA ?? 1; drawLadder(lc, S.lad.b, S.lad.t, S.lad.n); lc.restore(); }
  if (S.flag && !S.flag.back) flagX(lc, S.flag.base, S.flag.lean, td, S.flag.dir, S.flag.open, S.flag.pole);
  if (S.phone > 0) tinyPhone(lc, add(r.hand, [-P.f * -10, -30]), S.phone, assets);
  lc.globalAlpha = 1;
  lc.setTransform(1, 0, 0, 1, 0, 0);
  if (S.ripples) {                                         // slow, faint rings on the coffee around him
    lc.strokeStyle = LC; lc.lineWidth = 3; const C = CUP_A.cof;
    S.ripples.forEach(u => { lc.globalAlpha = 0.45 * Math.sin(Math.PI * u); lc.beginPath(); lc.ellipse(C.cx + 10, C.cy - 4, 60 + 80 * u, 10 + 12 * u, 0, 0, 7); lc.stroke(); });
    lc.globalAlpha = 1;
  }
  if (S.fall != null && FLC) {
    const fc = FLC.getContext('2d'); fc.setTransform(1, 0, 0, 1, 0, 0); fc.clearRect(0, 0, 1080, 1920);
    drawFloater(fc, t, S.fall, S.fallP, S.kick);
    lc.drawImage(FLC, 0, 0);
  }
  if (S.splash != null && S.splash < 1) {                 // the splash: drops up and out, rings across the coffee
    const u = S.splash, C = CUP_A.cof;
    [[-120, 1.5], [-70, 2.0], [-20, 2.3], [40, 1.9], [100, 1.4], [-95, 1.1], [70, 1.2], [140, 1.0]].forEach(([dx, v], i) => {
      const p = [C.cx + 20 + dx * (0.4 + 1.1 * u), C.cy - 40 - v * 230 * u + 440 * u * u];
      if (p[1] > C.cy + 6) return;
      lc.globalAlpha = Math.min(1, (1 - u) * 1.6);
      lc.beginPath(); lc.ellipse(p[0], p[1], 6 + (i % 2) * 2, 8 + (i % 2) * 2, 0, 0, 7); lc.fillStyle = LC; lc.fill();
    });
    lc.globalAlpha = 1 - u; lc.strokeStyle = LC; lc.lineWidth = 4;
    [0, 0.28].forEach(d => { const k = clamp(u - d, 0, 1); if (k <= 0) return;
      lc.beginPath(); lc.ellipse(C.cx, C.cy, 30 + (C.rx - 10) * k, 6 + (C.ry - 4) * k, 0, 0, 7); lc.stroke(); });
    lc.globalAlpha = 1;
  }
  LINE = 6.5;

  const cam = camera(t), into = () => { ctx.translate(540, 1100); ctx.scale(cam.z, cam.z); ctx.translate(-cam.cx, -cam.cy); };
  ctx.save(); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; into();
  ctx.drawImage(assets.plate, 0, 0, 1080, 1920);
  drawSteam(ctx, t);
  ctx.filter = 'drop-shadow(0px 0px 1.5px rgba(20,16,10,.55)) drop-shadow(0px 3px 7px rgba(20,16,10,.4))';
  ctx.drawImage(layer, 0, 0);
  ctx.filter = 'none';
  if (S.badge) badge(ctx, clamp(P.x * K, 200, 860), P.y * K - 300 * K - 30, S.badge);
  ctx.restore();

  // the line: only after the joke has landed; one primary statement, a smaller setup above it, on a soft scrim
  const a = seg(t, T.line, T.line + 0.45) * (1 - seg(t, T.end - 0.1, T.end + 0.25));
  if (a > 0) {
    ctx.save(); ctx.globalAlpha = a;
    const g = ctx.createLinearGradient(0, 180, 0, 780); g.addColorStop(0, 'rgba(8,6,4,.62)'); g.addColorStop(0.55, 'rgba(8,6,4,.35)'); g.addColorStop(1, 'rgba(8,6,4,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 780);
    ctx.direction = 'rtl'; ctx.textAlign = 'center'; ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 18;
    ctx.fillStyle = 'rgba(244,239,230,.82)'; ctx.font = '500 46px "Tajawal"'; ctx.fillText('نفس الكوفي، مشروبين…', 540, 420);
    ctx.fillStyle = '#F4EFE6'; ctx.font = '800 96px "Tajawal"'; ctx.fillText('واحد بس على ذوقك.', 540, 540);
    ctx.restore();
  }
  // the ending: the scene washes into BrewMaps green; he stays, faintly, still floating
  const w = ease(seg(t, T.end, T.end + 0.9));
  if (w > 0) {
    ctx.save(); ctx.fillStyle = `rgba(16,36,18,${0.94 * w})`; ctx.fillRect(0, 0, 1080, 1920);
    if (FLC && S.fall != null) { ctx.globalAlpha = 0.3 * w; into(); ctx.drawImage(FLC, 0, 0); }
    ctx.restore();
    const e = ease(seg(t, T.end + 0.45, T.end + 1.0)), l = ease(seg(t, T.end + 0.7, T.end + 1.2));
    ctx.save(); ctx.globalAlpha = e; ctx.direction = 'rtl'; ctx.textAlign = 'center';
    ctx.fillStyle = '#F4EFE6'; ctx.font = '800 88px "Tajawal"'; ctx.fillText('مو بس وين تروح…', 540, 470);
    ctx.fillStyle = '#A9D19A'; ctx.fillText('وش تشرب.', 540, 580);
    ctx.globalAlpha = l; ctx.fillStyle = 'rgba(244,239,230,.7)'; ctx.font = '500 38px "Tajawal"'; ctx.fillText('مجاني على الآب ستور وجوجل بلاي', 540, 1610);
    const L = assets.lockup; if (L) { const lw = 400, lh = lw * L.height / L.width; ctx.drawImage(L, (1080 - lw) / 2, 1440, lw, lh); }
    ctx.restore();
  }
}
