// على ذوقك ep.1 "the ladder" — same café, two drinks: the hot cappuccino scores ٢٤٪ for him (he's sad, walks off with
// his hands in his pockets), the iced latte ٩٢٪: he props a tiny ladder against the glass, climbs, and plops in.
// The Regular's character (../the-regular/rig.js). Plate: plates/iced-hot.jpg (AI-generated, unbranded). Plate pixels.

const DUR = 19.0;
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
  stroke(ctx, [[-9, 22], [0, 16], [9, 22]].map(H));
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

const T = { inB: 1.6, phB: 1.7, offB: 3.3, walkA: 3.35, atA: 5.75, phA: 5.85, unpack: 7.2, plant: 7.65, extend: 8.45, top: 9.6,
  pocket: 9.76, pulled: 9.96, unfurled: 10.12, stab: 10.16, planted: 10.28, hop: 10.4, land: 10.76, up: 11.0, lounge: 11.35,
  kick: 11.8, push: 11.97, fallen: 12.45, pool: 12.58, floating: 13.18, line: 13.05, end: 16.1 };
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
  return { base: V(RIMF), lean: w(T.planted, 0.16, 7, 30) + w(T.land, 0.1, 5, 26) + w(T.push, 0.05, 6, 28) + w(T.pool + 0.3, 0.05, 5, 24), open: 1, pole: 132, dir: 1, back: t >= T.land };      // in front of him until he's in the drink
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
  shape(ctx, body, { smooth: false, fill: '#25461C' });
  stroke(ctx, [[-20, -40], [-16, -62], [16, -62], [20, -40]].map(W), { width: LINE * 0.8 });          // handle
  const ang = -2.2 * ease(open), hinge = [-38, -40];
  const flap = [[0, 0], [76, 0], [70, 18], [6, 18]].map(p => add(hinge, rot(p, ang)));
  shape(ctx, flap.map(W), { smooth: false, fill: '#25461C' });
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
  const S = { phone: 0, badge: null, lounge: false, clip: false, lad: null };
  const holdUp = { f: [78, -96], b: [62, -88] };
  const phoneUp = (t0, t1) => ease(seg(t, t0, t0 + 0.25)) * (1 - ease(seg(t, t1 - 0.2, t1)));
  if (t < T.inB) { walk(P, t, 0, T.inB, 1180, XB); }
  else if (t < T.walkA) {                                   // the hot cappuccino: ٢٤٪ for him. Sad, a slow "no"
    stand(P, XB);
    const up = phoneUp(T.phB, T.offB);
    P.hands = { f: mix2([30, -40], holdUp.f, up), b: [-22, -34] };
    S.phone = up; P.tilt = 0.25 * up;
    if (t > 2.05) { S.badge = { name: 'كابتشينو', pct: '٢٤٪', good: false, a: seg(t, 2.05, 2.3) * (1 - seg(t, 3.05, 3.3)) }; P.mouth = 'flat'; P.brow = true; }
    if (t > 2.45 && t < 3.25) {                           // "no": turn to camera, the other way, back
      const k = Math.floor((t - 2.45) / 0.1), seq = ['f', 'r', 'f', 'o', 'f', 'r', 'f', 'o'][k] || 'o';
      if (seq === 'f') P.front = true; if (seq === 'r') P.headF = -P.f;
    }
    if (t > 3.05) { P.tilt = mix(P.tilt, -0.32, seg(t, 3.05, 3.3)); P.down = seg(t, 3.05, 3.3); }
  }
  else if (t < T.atA) { sadWalk(P, t, T.walkA, T.atA, XB, XA); }
  else if (t < T.unpack) {                                  // the iced latte: ٩٢٪ — he perks right up
    stand(P, XA);
    const up = phoneUp(T.phA, 7.1);
    P.hands = { f: mix2([14, -16], holdUp.f, up), b: [-22, -34] };
    S.phone = up; P.tilt = mix(-0.32, 0.25, ease(seg(t, T.atA, T.phA + 0.2))); P.down = 1 - seg(t, T.atA, T.phA + 0.2);
    P.mouth = 'flat'; P.brow = t < 6.25;
    if (t > 6.25) { S.badge = { name: 'آيس لاتيه', pct: '٩٢٪', good: true, a: seg(t, 6.25, 6.5) * (1 - seg(t, 6.95, 7.15)) }; P.mouth = 'grin'; P.eyes = 'wide'; P.brow = false; }
    if (t > 6.6 && t < 6.9) P.y -= 18 * Math.sin((t - 6.6) / 0.3 * Math.PI) / K;
  }
  else if (t < T.extend) {                                  // bag down → open → folded ladder out → planted → extends
    stand(P, XA); P.mouth = 'grin';
    const L1 = len([LAD.t[0] - LAD.b[0], LAD.t[1] - LAD.b[1]]), dir = scl([LAD.t[0] - LAD.b[0], LAD.t[1] - LAD.b[1]], 1 / L1);
    const down = ease(seg(t, 7.2, 7.42)), open = seg(t, 7.45, 7.6), pull = ease(seg(t, 7.62, 7.82)), move = ease(seg(t, 7.84, 8.04)), grow = seg(t, 8.06, T.extend);
    S.bag = { at: 1, open };
    if (t < 7.45) {                                         // crouch and set it down beside him
      P.y += 22 * Math.sin(Math.PI * down) / K; P.hands = { f: [30, -40], b: { w: V(mix2([BAG[0], BAG[1] - 70], [BAG[0], BAG[1] - 40], down)) } }; P.elbow = { b: 1 };
      S.bag.at = down;
    } else if (t < 7.84) {                                  // opens it, lifts the folded ladder straight out
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
  else if (t < T.top) {                                     // climbs, rung by rung
    S.lad = { b: LAD.b, t: LAD.t }; S.bag = { at: 1, open: 1 };
    const u = seg(t, T.extend, T.top), s = 0.04 + 0.86 * u, ph = u * Math.PI * 7;
    const F = ladderPt(s), lift = 18 * Math.max(0, Math.sin(ph));
    P.x = (F[0] + 12) / K; P.y = (F[1] - 112 * K - lift * 0.3) / K; P.rot = -0.12;
    P.feet = { f: { w: V(ladderPt(s + 0.02 * Math.sin(ph))) }, b: { w: V(ladderPt(s - 0.02 * Math.sin(ph))) } };
    P.hands = { f: { w: V(ladderPt(Math.min(1, s + 0.32 + 0.04 * Math.sin(ph + 1.5)))) }, b: { w: V(ladderPt(Math.min(1, s + 0.28 - 0.04 * Math.sin(ph + 1.5)))) } };
    P.elbow = { f: 1, b: 1 }; P.mouth = 'grin'; P.eyes = 'open';
  }
  else if (t < T.hop) {                                     // at the top: a flag out of his back pocket, up, open, planted on the rim
    S.lad = { b: LAD.b, t: LAD.t }; S.bag = { at: 1, open: 1 };
    const F0 = ladderPt(0.9);
    P.x = (F0[0] + 12) / K; P.y = (F0[1] - 112 * K) / K + 14 * ease(seg(t, T.stab, T.planted)) / K; P.rot = -0.12 * (1 - ease(seg(t, T.top, T.pocket)));
    P.feet = { f: { w: V(ladderPt(0.92)) }, b: { w: V(ladderPt(0.88)) } };
    P.elbow = { f: 1, b: 1 }; P.mouth = 'grin'; P.eyes = 'open';
    const rest = toWorld(P, [30, -40]), pocket = toWorld(P, [20, -2]), high = toWorld(P, [92, -222]), grip1 = add(V(RIMF), [0, -30]);   // front pocket → up and out over the glass
    const h = t < T.pocket ? mix2(rest, pocket, ease(seg(t, T.top, T.pocket)))
      : t < T.pulled ? mix2(pocket, high, ease(seg(t, T.pocket, T.pulled)))
      : t < T.stab ? high : mix2(high, grip1, easeIn(seg(t, T.stab, T.planted)));
    P.hands = { f: { w: h }, b: { w: V(ladderPt(1)) } };                  // front hand: pocket, flag; the other holds the ladder
    if (t >= T.pulled && t < T.stab) P.mouth = 'o';
    if (t >= T.pocket) {
      const pole = 30 + 102 * easeOut(seg(t, T.pocket + 0.02, T.pulled)), open = easeOut(seg(t, T.pulled, T.unfurled));
      S.flag = t < T.planted ? { base: add(h, [0, Math.min(30, pole * 0.3)]), lean: 0, open, pole, dir: t < T.stab ? -1 : 1 } : plantedFlag(t);
    }
  }
  else if (t < T.land) {                                    // a little hop over the rim, in he goes
    S.lad = { b: LAD.b, t: LAD.t }; S.bag = { at: 1, open: 1 };
    const u = seg(t, T.hop, T.land), p0 = add(ladderPt(0.9), [12, -112 * K + 14]), p2 = [300, 1090];
    const q = bez(p0, [380, 820], p2, u);
    P.x = q[0] / K; P.y = q[1] / K; P.rot = -0.3 - 0.6 * u;
    P.knee = { f: 1, b: 1 }; P.elbow = { f: 1, b: 1 };
    P.feet = { f: [44, 26], b: [24, 36] }; P.hands = { f: [-20, -250], b: [20, -250] };
    P.mouth = 'o'; P.eyes = 'wide'; S.clip = u > 0.5; S.flag = plantedFlag(t);
  }
  else if (t < T.lounge) {
    S.lad = { b: LAD.b, t: LAD.t }; S.bag = { at: 1, open: 1 }; S.clip = true; S.splash = seg(t, T.land, T.land + 0.5); S.flag = plantedFlag(t);
    if (t < T.up) P.hidden = true;
    loungePose(P, t, easeOut(seg(t, T.up, T.lounge)), 0, 0);
  }
  else {
    S.lad = ladderAt(t); S.bag = { at: 1, open: 1 }; S.lounge = true; S.clip = true; S.splash = seg(t, T.land, T.land + 0.5); S.flag = plantedFlag(t);
    loungePose(P, t, 1, easeOut(seg(t, T.lounge, T.lounge + 0.22)), easeOut(seg(t, T.lounge + 0.14, T.lounge + 0.36)));
    if (t > T.kick && t < T.push + 0.6) {                    // done with the ladder: a push with his foot
      const rest = P.feet.f.w, touch = V([432, 978]), out = V([472, 970]);
      let p = mix2(rest, touch, ease(seg(t, T.kick, T.push)));
      p = mix2(p, out, ease(seg(t, T.push, T.push + 0.12))); p = mix2(p, rest, ease(seg(t, T.push + 0.25, T.push + 0.55)));
      P.feet.f = { w: p };
    }
    if (t > T.pool) {                                         // ladder gone: slides back in and floats, hands behind his head
      const e = ease(seg(t, T.pool, T.floating)), Q = { ...P };
      poolPose(Q, t);
      const W0 = { hf: P.hands.f.w, hb: P.hands.b.w, ff: P.feet.f.w, fb: P.feet.b.w };
      for (const k of ['x', 'y', 'rot', 'tilt']) P[k] = mix(P[k], Q[k], e);
      P.hands = { f: { w: mix2(W0.hf, Q.hands.f.w, e) }, b: { w: mix2(W0.hb, Q.hands.b.w, e) } };
      P.feet = { f: { w: mix2(W0.ff, Q.feet.f.w, e) }, b: { w: mix2(W0.fb, Q.feet.b.w, e) } };
      if (e > 0.5) { P.knee = Q.knee; P.elbow = Q.elbow; }
      S.ripples = [0, 1, 2, 3, 4, 5].map(i => T.pool + 0.35 + i * 0.95).filter(t0 => t > t0 && t < t0 + 1.6).map(t0 => seg(t, t0, t0 + 1.6));
    }
  }
  return { P, S };
}

// floating on his back like it's a pool: head resting on the far rim, hands behind his head, knees and toes out of the coffee
function poolPose(P, t) {
  const bob = Math.sin(t * 2.0) * 3, sway = Math.sin(t * 1.3) * 0.03;
  P.f = 1; P.eyes = 'closed'; P.mouth = 'grin';
  [P.x, P.y] = V([296, 1004 + bob]); P.rot = -1.2 + sway; P.tilt = -0.35;
  P.hands = { f: { w: toWorld(P, [-34, -214]) }, b: { w: toWorld(P, [-18, -226]) } }; P.elbow = { f: -1, b: -1 };
  P.feet = { f: { w: V([392, 990 + bob * 0.5]) }, b: { w: V([410, 996 + bob * 0.5]) } }; P.knee = { f: -1, b: -1 };
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

function renderReel(ctx, layer, t, assets) {
  const td = Math.floor(t * 12) / 12;
  boil = Math.floor(t * 12) % 3; jc = 0;
  const { P, S } = scene(td);

  const lc = layer.getContext('2d');
  lc.setTransform(1, 0, 0, 1, 0, 0); lc.clearRect(0, 0, 1080, 1920);
  lc.setTransform(K, 0, 0, K, 0, 0); LINE = 5.6 / K;
  if (S.bag && S.bag.at >= 1) drawBag(lc, BAG, S.bag.open);
  if (S.flag && S.flag.back) flagX(lc, S.flag.base, S.flag.lean, t, S.flag.dir, S.flag.open, S.flag.pole);
  const r = P.hidden ? { hand: [0, 0] } : drawCharacter(lc, P);
  if (!P.hidden && !(S.bag && S.bag.at >= 1)) { const hb = handB(P); drawBag(lc, add(hb, [0, 50]), 0); }
  if (S.lad) { lc.save(); drawLadder(lc, S.lad.b, S.lad.t, S.lad.n); lc.restore(); }
  if (S.flag && !S.flag.back) flagX(lc, S.flag.base, S.flag.lean, t, S.flag.dir, S.flag.open, S.flag.pole);
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
  if (S.ripples) {                                         // lazy pool ripples around him
    lc.setTransform(1, 0, 0, 1, 0, 0); lc.strokeStyle = LC; lc.lineWidth = 3; const C = CUP_A.cof;
    S.ripples.forEach(u => { lc.globalAlpha = 0.7 * (1 - u); lc.beginPath(); lc.ellipse(250, C.cy + 2, 30 + 95 * u, 6 + 13 * u, 0, 0, 7); lc.stroke(); });
    lc.globalAlpha = 1; lc.setTransform(K, 0, 0, K, 0, 0);
  }
  lc.setTransform(1, 0, 0, 1, 0, 0); LINE = 6.5;

  const z = 1.1 + 0.05 * ease(seg(t, 0, T.end));
  ctx.save(); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  ctx.translate(540, 1100); ctx.scale(z, z); ctx.translate(-540, -1100);
  ctx.drawImage(assets.plate, 0, 0, 1080, 1920);
  drawSteam(ctx, t);
  ctx.filter = 'drop-shadow(0px 0px 1.5px rgba(20,16,10,.5)) drop-shadow(0px 3px 6px rgba(20,16,10,.35))';
  ctx.drawImage(layer, 0, 0);
  ctx.filter = 'none';
  if (S.badge) badge(ctx, clamp(P.x * K, 200, 860), P.y * K - 300 * K - 30, S.badge);
  ctx.restore();

  // the line, once he's in
  const a = seg(t, T.line, T.line + 0.5) * (1 - seg(t, T.end - 0.2, T.end + 0.2));   // after the ladder's gone, held ~3s
  if (a > 0) {
    ctx.save(); ctx.globalAlpha = a; ctx.direction = 'rtl'; ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 24; ctx.fillStyle = '#F4EFE6'; ctx.font = '800 74px "Tajawal"';
    ctx.fillText('نفس الكوفي، مشروبين…', 540, 470); ctx.fillStyle = '#C9E3BC'; ctx.fillText('واحد بس على ذوقك.', 540, 562);
    ctx.restore();
  }
  // end card
  const e = seg(t, T.end, T.end + 0.6);
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
