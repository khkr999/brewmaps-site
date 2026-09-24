// The Regular — a white line-drawn character animated over a real café photo.
// Everything is drawn onto one canvas: plate, character layer, end card.
// Timing is "on twos": the drawing changes 12 times a second, the video runs at 24.

const W = 1080, H = 1920, LINE = 6.5;
const CREAM = '#F4EFE6', NIGHT = 'rgba(14,31,10,.93)', PALE = '#9BC48A', FOREST = '#2B4D1F', LC = CREAM;
let ASSETS = {};

// ─── small maths ────────────────────────────────────────────────────────────
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const seg = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
const ease = u => u * u * (3 - 2 * u);
const easeOut = u => 1 - (1 - u) * (1 - u);
const easeIn = u => u * u;
const mix = (a, b, u) => a + (b - a) * u;
const mix2 = (p, q, u) => [mix(p[0], q[0], u), mix(p[1], q[1], u)];
const add = (p, q) => [p[0] + q[0], p[1] + q[1]];
const scl = (p, k) => [p[0] * k, p[1] * k];
const rot = (p, a) => [p[0] * Math.cos(a) - p[1] * Math.sin(a), p[0] * Math.sin(a) + p[1] * Math.cos(a)];
const len = p => Math.hypot(p[0], p[1]);
const bez = (p0, c, p1, u) => mix2(mix2(p0, c, u), mix2(c, p1, u), u);

// ─── line boil: every drawing re-jitters its points a little ────────────────
let boil = 0, jc = 0;
function prng(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function J(p, amt = 1.3) { const r = prng(boil * 7919 + (jc++) * 104729); return [p[0] + (r() - .5) * 2 * amt, p[1] + (r() - .5) * 2 * amt]; }

// ─── path helpers (Catmull-Rom through the points) ──────────────────────────
function cr(ctx, pts, closed) {
  const n = pts.length, g = i => closed ? pts[(i + n) % n] : pts[clamp(i, 0, n - 1)];
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
    ctx.bezierCurveTo(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6,
                      p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]);
  }
  if (closed) ctx.closePath();
}
function poly(ctx, pts, closed) { ctx.moveTo(pts[0][0], pts[0][1]); pts.slice(1).forEach(p => ctx.lineTo(p[0], p[1])); if (closed) ctx.closePath(); }

// Shapes are drawn as "outline, then erase the inside": whatever is behind them disappears,
// which is what makes the character read as a solid figure rather than overlapping wires.
function shape(ctx, pts, { smooth = true, fill = null } = {}) {
  const P = () => { ctx.beginPath(); (smooth ? cr : poly)(ctx, pts, true); };
  ctx.globalCompositeOperation = 'source-over';
  P(); ctx.fillStyle = LC; ctx.fill(); ctx.lineWidth = 2 * LINE; ctx.strokeStyle = LC; ctx.stroke();
  ctx.globalCompositeOperation = 'destination-out'; P(); ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
  if (fill) { P(); ctx.fillStyle = fill; ctx.fill(); }
}
function tube(ctx, pts, w) {
  const P = () => { ctx.beginPath(); cr(ctx, pts, false); };
  ctx.lineCap = ctx.lineJoin = 'round';
  ctx.globalCompositeOperation = 'source-over'; P(); ctx.lineWidth = w + 2 * LINE; ctx.strokeStyle = LC; ctx.stroke();
  ctx.globalCompositeOperation = 'destination-out'; P(); ctx.lineWidth = w; ctx.stroke();
  ctx.globalCompositeOperation = 'source-over';
}
function stroke(ctx, pts, { smooth = true, width = LINE, closed = false } = {}) {
  ctx.globalCompositeOperation = 'source-over'; ctx.lineCap = ctx.lineJoin = 'round';
  ctx.beginPath(); (smooth ? cr : poly)(ctx, pts, closed); ctx.lineWidth = width; ctx.strokeStyle = LC; ctx.stroke();
}
const circlePts = (c, rx, ry = rx, n = 10, a0 = 0) => Array.from({ length: n }, (_, i) => { const a = a0 + i / n * Math.PI * 2; return [c[0] + rx * Math.cos(a), c[1] + ry * Math.sin(a)]; });

// ─── the character ──────────────────────────────────────────────────────────
// Local space: hip at 0,0, up is -y, facing +x. `f` mirrors it, `rot` leans it forward.
const RIG = {
  torso: [[-46, 6], [-50, -48], [-44, -108], [-28, -150], [2, -166], [30, -152], [46, -110], [56, -54], [52, 4], [20, 20], [-18, 20]],
  neck: [4, -160], shB: [-6, -126], shF: [12, -126], hipB: [-14, 2], hipF: [16, 2],
  upper: 62, fore: 58, arm: 22, hand: 14, thigh: 60, shin: 56, leg: 30, toe: 24,
};
const toWorld = (P, p) => { const q = rot(p, P.rot); return [P.x + P.f * q[0], P.y + q[1]]; };
const toLocal = (P, w) => rot([(w[0] - P.x) / P.f, w[1] - P.y], -P.rot);

// Two-bone IK. `side` picks which way the middle joint bends: +1 forward (+x), -1 back.
function ik(root, target, a, b, side) {
  let d = [target[0] - root[0], target[1] - root[1]], L = len(d);
  L = clamp(L, Math.abs(a - b) + 0.5, a + b - 0.5);
  const base = Math.atan2(d[1], d[0]), k = Math.acos(clamp((a * a + L * L - b * b) / (2 * a * L), -1, 1));
  const j1 = add(root, [a * Math.cos(base + k), a * Math.sin(base + k)]);
  const j2 = add(root, [a * Math.cos(base - k), a * Math.sin(base - k)]);
  const joint = (side > 0) === (j1[0] > j2[0]) ? j1 : j2;
  const dir = Math.atan2(target[1] - joint[1], target[0] - joint[0]);
  return [root, joint, add(joint, [b * Math.cos(dir), b * Math.sin(dir)])];
}

// A pose's hand/foot targets are local points, or {w:[x,y]} for world points (a straw, the rim).
const tgt = (P, t) => t.w ? toLocal(P, t.w) : t;

function drawArm(ctx, P, which) {
  const root = which === 'b' ? RIG.shB : RIG.shF;
  const [a, e, h] = ik(root, tgt(P, P.hands[which]), RIG.upper, RIG.fore, P.elbow?.[which] ?? -1);
  const pts = [a, e, h].map(p => J(toWorld(P, p)));
  tube(ctx, pts, RIG.arm);
  shape(ctx, circlePts(pts[2], RIG.hand, RIG.hand, 8).map(p => J(p, 0.8)));
  return pts[2];
}
function drawLeg(ctx, P, which) {
  const root = which === 'b' ? RIG.hipB : RIG.hipF;
  const [h, k, a] = ik(root, tgt(P, P.feet[which]), RIG.thigh, RIG.shin, P.knee?.[which] ?? 1);
  const d = [(a[0] - k[0]) / RIG.shin, (a[1] - k[1]) / RIG.shin];
  const toe = add(a, scl([d[1], -d[0]], RIG.toe));
  tube(ctx, [h, k, a, toe].map(p => J(toWorld(P, p))), RIG.leg);
}
function drawTorso(ctx, P) {
  const pts = RIG.torso.map(p => J(toWorld(P, p)));
  shape(ctx, pts);
  ctx.save(); ctx.beginPath(); cr(ctx, pts, true); ctx.clip();          // shorts line, kept inside the body
  stroke(ctx, [[-60, -30], [0, -22], [64, -32]].map(p => J(toWorld(P, p))));
  ctx.restore();
}
function drawHead(ctx, P) {
  const tilt = P.tilt || 0, hc = add(RIG.neck, rot([10, -40], -tilt * 0.5));
  const H = p => J(toWorld(P, add(hc, rot(p, -tilt))));
  // hair: little loops sitting on the back and crown; the head's own erase cuts them to curls
  [200, 222, 244, 266, 288, 310].forEach((deg, i) => {
    const a = deg * Math.PI / 180, c = [44 * Math.cos(a), 44 * Math.sin(a)];
    stroke(ctx, circlePts(c, 8.5 + (i % 2), 8.5, 7).map(H), { closed: true });
  });
  const egg = circlePts([0, 0], 40, 42, 12).map(([x, y]) => [x + (x > 0 && y > 0 ? 4 : 0), y]);
  shape(ctx, egg.map(H));
  stroke(ctx, [[-2, -9], [-12, -5], [-12, 6], [-3, 10]].map(H));        // ear
  const look = P.look || [0, 0], ex = 17 + look[0], ey = -6 + look[1];
  if (P.eyes === 'closed') stroke(ctx, [[ex - 7, ey + 1], [ex, ey - 4], [ex + 7, ey + 1]].map(H));
  else if (P.eyes === 'squeeze') stroke(ctx, [[ex - 6, ey - 5], [ex + 3, ey], [ex - 6, ey + 4]].map(H), { smooth: false });
  else {
    const r = P.eyes === 'wide' ? 6.5 : 4.8;
    ctx.beginPath(); cr(ctx, circlePts([ex, ey], r, r, 8).map(H), true); ctx.fillStyle = LC; ctx.fill();
  }
  const m = P.mouth || 'smile';
  if (m === 'smile') stroke(ctx, [[12, 14], [21, 20], [31, 11]].map(H));
  if (m === 'grin') shape(ctx, [[10, 10], [33, 6], [29, 20], [19, 25]].map(H));
  if (m === 'o') stroke(ctx, circlePts([25, 18], 6, 7, 8).map(H), { closed: true });
  if (m === 'flat') stroke(ctx, [[14, 17], [30, 15]].map(H));
  if (m === 'effort') stroke(ctx, [[12, 18], [18, 14], [24, 19], [31, 14]].map(H), { smooth: false });
  return toWorld(P, hc);
}

// The paper map he walks in reading. Points are relative to its centre.
const MAP = [[-80, -60], [-27, -52], [27, -60], [80, -52], [80, 64], [27, 58], [-27, 66], [-80, 58]];
function drawMap(ctx, place) {
  const T = p => J(place(p));
  shape(ctx, MAP.map(T), { smooth: false });
  stroke(ctx, [[-27, -52], [-27, 66]].map(T), { smooth: false });
  stroke(ctx, [[27, -60], [27, 58]].map(T), { smooth: false });
  ctx.setLineDash([2, 13]);
  stroke(ctx, [[-62, 40], [-30, 8], [2, 26], [40, -12], [58, -30]].map(T), { width: 5 });
  ctx.setLineDash([]);
  stroke(ctx, [[-50, -30], [-36, -38]].map(T), { width: 5 }); stroke(ctx, [[46, 38], [60, 30]].map(T), { width: 5 });
}

// The flag he plants like a summit flag: forest green, carrying the real BrewMaps mark.
function drawFlag(ctx, base, lean = 0, t = 0, dir = 1) {
  const top = add(base, rot([0, -132], lean)), fw = 112, fh = 76, wave = k => 5 * Math.sin(t * 9 - k * 2.4);
  stroke(ctx, [J(base), J(top)], { smooth: false });
  const edge = [0, .33, .66, 1].map(k => [dir * k * fw, wave(k) * k]);
  const pts = [...edge, ...edge.slice().reverse().map(([x, y]) => [x, y + fh])].map(p => J(add(top, rot(p, lean))));
  shape(ctx, pts, { smooth: false, fill: FOREST });
  const m = ASSETS.mark;
  if (m) {
    const mw = 70, mh = mw * m.height / m.width, c = add(top, rot([dir * fw / 2, fh / 2 + wave(.5) * .5], lean));
    ctx.save(); ctx.translate(c[0], c[1]); ctx.rotate(lean); ctx.drawImage(m, -mw / 2, -mh / 2, mw, mh); ctx.restore();
  }
}

// A phone the size of a door, showing the real app. The screenshot is cropped, never edited:
// it starts below the browse header so the subset count there never sits next to "812".
const SHOT_TOP = 540;
function drawPhone(ctx, c, s, w = 250, h = 440) {
  if (s <= 0.01) return;
  const W2 = w * s, H2 = h * s, x = c[0] - W2 / 2, y = c[1] - H2 / 2, r = 34 * s, j = J([0, 0], 1.2);
  const P = (inset) => { ctx.beginPath(); ctx.roundRect(x + inset + j[0], y + inset + j[1], W2 - 2 * inset, H2 - 2 * inset, Math.max(2, r - inset)); };
  ctx.globalCompositeOperation = 'source-over';
  P(0); ctx.fillStyle = LC; ctx.fill(); ctx.lineWidth = 2 * LINE; ctx.strokeStyle = LC; ctx.stroke();
  ctx.globalCompositeOperation = 'destination-out'; P(0); ctx.fill(); ctx.globalCompositeOperation = 'source-over';
  const shot = ASSETS.shot;
  if (shot) {
    const inset = 9 * s; ctx.save(); P(inset); ctx.clip();
    ctx.fillStyle = '#fff'; ctx.fillRect(x, y, W2, H2);
    const k = (W2 - 2 * inset) / shot.width;
    ctx.drawImage(shot, 0, SHOT_TOP, shot.width, shot.height - SHOT_TOP, x + inset + j[0], y + inset + j[1], shot.width * k, (shot.height - SHOT_TOP) * k);
    ctx.restore();
  }
}

function drawQuestion(ctx, hc) {
  const q = [[-12, -96], [-8, -110], [4, -114], [14, -106], [12, -94], [2, -86], [0, -76]].map(p => J(add(hc, p)));
  stroke(ctx, q);
  ctx.beginPath(); ctx.arc(...J(add(hc, [0, -62]), 0.6), 5, 0, Math.PI * 2); ctx.fillStyle = LC; ctx.fill();
}

function drawCharacter(ctx, P) {
  drawArm(ctx, P, 'b');
  drawLeg(ctx, P, 'b');
  drawTorso(ctx, P);
  drawLeg(ctx, P, 'f');
  const hc = drawHead(ctx, P);
  if (P.map) drawMap(ctx, p => toWorld(P, add(P.map.c, rot([p[0], p[1] * (P.map.sy ?? 1)], P.map.r || 0))));
  if (P.phone) drawPhone(ctx, toWorld(P, P.phone.c), P.phone.s);
  const hand = drawArm(ctx, P, 'f');
  return { hc, hand };
}

// ─── the scene: anchors measured on the plate ──────────────────────────────
// Swap these per café photo; the choreography below is written against them.
const SCENES = {
  standin: {
    plate: 'plates/standin.png', label: 'PENCIL TEST · stand-in plate · not for posting',
    ground: x => 1268 + 0.08 * (x - 790),
    tip: [775, 775], sdir: [-0.845, 0.535],
    liquid: { cx: 517, cy: 790, rx: 214, ry: 110 },
    rimStand: [[730, 772], [752, 768]], flag: [655, 772], entry: [528, 800], float: [548, 936],
    startX: 1120, stopX: 832,
  },
};

// ─── choreography, episode 1 ────────────────────────────────────────────────
const SHIFT = 1.5;                                   // the opening runs 1.5s longer than the first cut
function intro(t, S) {
  const G = S.ground;
  const P = { f: -1, rot: 0, tilt: 0, eyes: 'open', mouth: 'smile', hands: {}, feet: {} };
  const props = {};
  const stand = (x, bob = 0) => { P.x = x; P.y = G(x) - 112 + bob; };
  const planted = dx => ({ w: [P.x + P.f * dx, G(P.x + P.f * dx)] });
  const MC = [74, -150];
  const PH = [150, -170], hold = { b: [262, -150], f: [34, -120] };
  const fly = () => { const dt = t - 1.58, st = toWorld({ x: S.stopX, y: G(S.stopX) - 112, f: -1, rot: 0 }, [-40, -250]);
    return { c: [st[0] + 620 * dt, st[1] - 1050 * dt + 1300 * dt * dt], r: -0.8 - 9 * dt, sy: -1 }; };

  if (t < 1.5) {                                    // A · walks in turning a paper map the wrong way up
    const u = easeOut(seg(t, 0, 1.5)), x = mix(S.startX, S.stopX, u), ph = (S.startX - x) / 150 * Math.PI * 2;
    stand(x, -4 * Math.abs(Math.sin(ph)));
    const foot = (off, a) => ({ w: [P.x + P.f * (off + 24 * Math.sin(a)), G(P.x + P.f * (off + 24 * Math.sin(a))) - 16 * Math.max(0, Math.cos(a))] });
    P.feet = { f: foot(6, ph), b: foot(-8, ph + Math.PI) };
    const flip = Math.cos(Math.PI * ease(seg(t, 0.4, 1.05)));
    P.map = { c: MC, r: 0.04 * Math.sin(ph), sy: flip }; P.hands = { b: [150, -124], f: [2, -108] };
    P.tilt = -0.12 + 0.3 * ease(seg(t, 0.4, 1.05)); P.mouth = t > 0.9 ? 'flat' : 'smile';
    props.question = t > 1.0;
  } else if (t < 1.9) {                             // B · gives up and bins the map over his shoulder
    stand(S.stopX); P.feet = { f: planted(10), b: planted(-12) };
    const u = ease(seg(t, 1.5, 1.6)), v = ease(seg(t, 1.64, 1.86)), g = { b: [150, -124], f: [2, -108] };
    P.hands = { b: mix2(mix2(g.b, [-70, -250], u), [-30, -40], v), f: mix2(mix2(g.f, [-40, -262], u), [24, -40], v) };
    P.elbow = { b: 1, f: 1 }; P.tilt = 0.3; P.mouth = 'flat';
    if (t < 1.58) P.map = { c: mix2(MC, [-40, -250], u), r: -u * 0.8, sy: -1 };
    else props.flyingMap = fly();
  } else if (t < 3.75) {                            // C+D · pulls out BrewMaps. Reads. Scrolls.
    stand(S.stopX); P.feet = { f: planted(10), b: planted(-12) };
    const u = easeOut(seg(t, 1.9, 2.2)), thumb = t > 2.4 ? 7 * Math.max(0, Math.sin((t - 2.4) * 11)) : 0;
    P.phone = { c: mix2([30, -60], PH, u), s: mix(0.15, 1, u) };
    P.hands = { b: mix2([-30, -40], hold.b, u), f: add(mix2([24, -40], hold.f, u), [0, -thumb]) };
    P.tilt = mix(0.3, 0.05, u); P.mouth = 'smile'; P.look = [3, 2];
    if (t < 2.4) props.flyingMap = fly();
  } else {                                          // E · …and looks up. It was right there.
    stand(S.stopX); P.feet = { f: planted(10), b: planted(-12) };
    const away = ease(seg(t, 4.1, 4.42));
    P.phone = { c: mix2(PH, [20, -40], away), s: 1 - away };
    P.hands = { b: mix2(hold.b, [-30, -40], away), f: mix2(hold.f, [24, -40], away) };
    P.tilt = mix(0.05, 0.55, ease(seg(t, 3.75, 3.95)));
    P.eyes = t > 3.85 ? 'wide' : 'open'; P.mouth = t > 3.85 ? 'o' : 'smile';
    props.ticks = t > 3.85 && t < 4.3 ? 1 : 0;
  }
  return { P, props };
}

function episode1(T, S) {
  if (T < 3.0 + SHIFT) return intro(T, S);
  const t = T - SHIFT;
  const G = S.ground, grips = [add(S.tip, scl(S.sdir, 8)), add(S.tip, scl(S.sdir, 44))];
  const P = { f: -1, rot: 0, tilt: 0, eyes: 'open', mouth: 'smile', hands: {}, feet: {} };
  const props = { flyingMap: null, flag: null, ticks: 0, splash: null, water: null };
  const stand = (x, crouch = 0) => { P.x = x; P.y = G(x) - 112 + crouch; };
  const planted = (dx) => ({ w: [P.x + P.f * dx, G(P.x + P.f * dx)] });

  if (t < 3.3) {                                    // D · crouch, eyes on the straw
    const u = ease(seg(t, 3.0, 3.2));
    stand(mix(S.stopX, S.stopX - 22, u), 26 * u); P.rot = 0.16 * u;
    P.feet = { f: planted(10), b: planted(-12) };
    P.hands = { b: mix2([-30, -40], [-60, -70], u), f: mix2([24, -40], [-30, -60], u) };
    P.tilt = 0.55; P.mouth = 'flat';
  } else if (t < 4.0) {                             // E+F · leaps, grabs the straw, hangs and kicks
    const hang = [grips[1][0] + 22, grips[1][1] + 246];
    const u = easeOut(seg(t, 3.3, 3.52)), x0 = S.stopX - 22, y0 = G(x0) - 86;
    const sway = t > 3.52 ? Math.sin((t - 3.52) * 9) * (1 - seg(t, 3.52, 4.0)) : 0;
    P.x = mix(x0, hang[0], u) + 10 * sway; P.y = mix(y0, hang[1], u) - 30 * Math.sin(u * Math.PI);
    P.rot = mix(0.16, -0.05, u) + 0.06 * sway;
    const reach0 = toWorld(P, [-50, -250]);
    P.hands = { f: { w: mix2(reach0, grips[0], ease(seg(t, 3.3, 3.48))) }, b: { w: mix2(reach0, grips[1], ease(seg(t, 3.3, 3.5))) } };
    P.elbow = { b: 1, f: 1 };
    const k = (t - 3.4) * 16;
    P.feet = t < 3.45 ? { f: [16, 104], b: [-14, 108] } : { f: [22 + 26 * Math.sin(k), 92 - 18 * Math.cos(k)], b: [-2 + 26 * Math.sin(k + Math.PI), 92 - 18 * Math.cos(k + Math.PI)] };
    P.tilt = 0.45; P.mouth = t < 3.5 ? 'o' : 'effort'; P.eyes = t < 3.5 ? 'wide' : 'squeeze';
  } else if (t < 4.85) {                            // G · hauls himself up and mantles onto the rim
    const hang = [grips[1][0] + 22, grips[1][1] + 246], top = [S.rimStand[1][0] - 8, S.rimStand[1][1] - 112];
    const u = ease(seg(t, 4.0, 4.35)), v = ease(seg(t, 4.35, 4.8));
    const pull = [grips[1][0] + 30, grips[1][1] + 128];
    const p = mix2(mix2(hang, pull, u), top, v);
    P.x = p[0]; P.y = p[1]; P.rot = mix(-0.05, 0.3, u) * (1 - v);
    P.hands = v < 0.35 ? { f: { w: grips[0] }, b: { w: grips[1] } } : { f: [60, -150], b: [-50, -150] };
    P.elbow = { b: 1, f: 1 };
    P.feet = v < 0.2 ? { f: { w: mix2(toWorld(P, [30, 60]), S.rimStand[0], ease(seg(t, 4.2, 4.4))) }, b: [-10, 84] }
                     : { f: { w: S.rimStand[0] }, b: { w: mix2(toWorld(P, [-10, 84]), S.rimStand[1], v) } };
    P.tilt = 0.3; P.mouth = 'effort'; P.eyes = 'squeeze';
  } else if (t < 5.2) {                             // H · wobbles on the rim
    const top = [S.rimStand[1][0] - 8, S.rimStand[1][1] - 112], w = (t - 4.85) * 17, damp = 1 - seg(t, 4.85, 5.2) * 0.6;
    P.x = top[0]; P.y = top[1]; P.rot = 0.2 * Math.sin(w) * damp;
    P.feet = { f: { w: S.rimStand[0] }, b: { w: S.rimStand[1] } };
    P.hands = { f: [104 + 18 * Math.cos(w * 1.3), -150 + 30 * Math.sin(w * 1.3)], b: [-100 + 18 * Math.cos(w * 1.3 + 2), -154 + 30 * Math.sin(w * 1.3 + 2)] };
    P.elbow = { b: -1, f: 1 };
    P.eyes = 'wide'; P.mouth = 'o';
  } else if (t < 5.95) {                            // I · summit: pulls the pin, holds it up, plants it
    const top = [S.rimStand[1][0] - 8, S.rimStand[1][1] - 112];
    P.x = top[0]; P.y = top[1]; P.rot = 0;
    P.feet = { f: { w: S.rimStand[0] }, b: { w: S.rimStand[1] } };
    const a = ease(seg(t, 5.2, 5.32)), b = ease(seg(t, 5.36, 5.5)), c = ease(seg(t, 5.56, 5.7)), d = ease(seg(t, 5.72, 5.85));
    const high = [56, -236], plant = toLocal(P, add(S.flag, [0, -62]));
    let hf = mix2(mix2(mix2([60, -150], [-44, -30], a), high, b), plant, c);
    hf = mix2(hf, [34, -62], d);
    P.hands = { f: hf, b: mix2([-50, -150], [-36, -58], Math.max(b, d)) };
    P.elbow = { b: -1, f: t > 5.7 ? 1 : -1 };
    if (t >= 5.32 && t < 5.7) { const hw = toWorld(P, hf); props.heldFlag = { base: add(hw, [0, 40]), lean: 0, dir: P.f }; }
    P.tilt = b > 0.5 && c < 0.5 ? 0.5 : 0.3;
    P.mouth = t > 5.36 ? 'grin' : 'flat'; P.eyes = t > 5.72 ? 'closed' : 'open';
  } else if (t < 6.3) {                             // J · wind-up
    const top = [S.rimStand[1][0] - 8, S.rimStand[1][1] - 112], u = ease(seg(t, 5.95, 6.25));
    P.x = top[0]; P.y = top[1] + 30 * u; P.rot = 0.34 * u;
    P.feet = { f: { w: S.rimStand[0] }, b: { w: S.rimStand[1] } };
    P.hands = { f: mix2([34, -62], [-54, -40], u), b: mix2([-36, -58], [-70, -50], u) };
    P.tilt = 0.35; P.mouth = 'grin'; P.eyes = 'open';
  } else if (t < 8.0) {                             // K · cannonball
    const p0 = [S.rimStand[1][0] - 8, S.rimStand[1][1] - 82], p1 = [S.entry[0], S.entry[1] + 20];
    const c = [mix(p0[0], p1[0], 0.45), p0[1] - 210];
    const u = seg(t, 6.3, 7.02);
    let p = bez(p0, c, p1, u);
    if (t > 7.02) p = [p1[0], p1[1] + 300 * easeOut(seg(t, 7.02, 7.2))];
    P.x = p[0]; P.y = p[1];
    const tuck = ease(seg(t, 6.34, 6.5));
    P.rot = mix(0.34, 0.62, seg(t, 6.3, 7.1));
    P.feet = { f: mix2([30, 90], [44, -6], tuck), b: mix2([-10, 96], [30, 2], tuck) };
    P.knee = { f: 1, b: 1 };
    P.hands = { f: mix2([-54, -40], [70, -26], tuck), b: mix2([-70, -50], [56, -20], tuck) };
    P.elbow = { b: -1, f: -1 };
    P.tilt = 0.2; P.mouth = 'grin'; P.eyes = 'closed';
    if (t > 6.95) props.water = S.liquid.cy + 8;
    if (t > 7.2) P.hidden = true;
  } else {                                          // L-O · pops up, floats, waves
    const u = easeOut(seg(t, 8.0, 8.3)), bob = 5 * Math.sin((t - 8.0) * 5);
    P.f = 1; P.x = S.float[0]; P.y = mix(S.float[1] + 90, S.float[1], u) + bob * seg(t, 8.3, 8.6);
    P.feet = { f: [20, 100], b: [-10, 104] };
    P.hands = { b: [-40, -120], f: [100, -164] };
    P.elbow = { b: -1, f: -1 };
    const up = ease(seg(t, 8.75, 9.0)), wv = t > 9.0 ? 24 * Math.sin((t - 9.0) * 17) * (1 - seg(t, 10.2, 10.6)) : 0;
    P.hands.b = mix2([-40, -120], [-78 + wv, -246], up);
    P.tilt = 0.12; P.eyes = t < 8.7 ? 'closed' : 'open'; P.mouth = t < 8.7 ? 'smile' : 'grin';
    props.water = S.liquid.cy + 22;
  }

  // things that outlive their phase
  if (t >= 5.7) {
    const k = t - 5.7, boing = 0.18 * Math.exp(-k * 7) * Math.sin(k * 30), splashK = t > 7.02 ? t - 7.02 : 0;
    props.flag = { base: S.flag, lean: boing + (splashK ? 0.14 * Math.exp(-splashK * 5) * Math.sin(splashK * 26) : 0) };
  }
  if (t >= 7.02) props.splash = t - 7.02;
  if (t >= 8.0 && t < 9.0) props.pop = t - 8.0;
  return { P, props };
}

// ─── compositing ────────────────────────────────────────────────────────────
function eraseBelowWater(ctx, S, wl) {
  const L = S.liquid;
  ctx.save();
  ctx.beginPath(); ctx.rect(0, wl, W, H); ctx.clip();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath(); ctx.ellipse(L.cx, L.cy, L.rx, L.ry, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillRect(L.cx - L.rx, L.cy, 2 * L.rx, H);
  ctx.restore();
}
function drawRipples(ctx, S, centre, age, n = 3) {
  const L = S.liquid;
  ctx.save(); ctx.beginPath(); ctx.ellipse(L.cx, L.cy, L.rx - 6, L.ry - 4, 0, 0, Math.PI * 2); ctx.clip();
  for (let i = 0; i < n; i++) {
    const a = age - i * 0.14; if (a <= 0 || a > 1.3) continue;
    const r = 34 + a * 190, alpha = 1 - a / 1.3;
    ctx.globalAlpha = alpha;
    stroke(ctx, circlePts(centre, r, r * L.ry / L.rx, 14).map(p => J(p, 1)), { closed: true, width: LINE * 0.8 });
  }
  ctx.globalAlpha = 1; ctx.restore();
}
function drawSplash(ctx, S, age) {
  const e = S.entry;
  if (age < 0.42) {                                  // the crown: rises, holds a beat, sinks back
    const h = 130 * Math.sin(Math.PI * age / 0.42), w = 1 + age * 0.9;
    const tips = [[-50, .62], [-24, 1], [2, .8], [27, 1], [52, .66]];
    const pts = [[-66 * w, 6]];
    tips.forEach(([x, k], i) => { pts.push([x * w, -h * k]); if (i < 4) pts.push([(x + 13) * w, -h * 0.3]); });
    pts.push([66 * w, 6]);
    stroke(ctx, pts.map(p => J(add(e, p), 0.9)));
    stroke(ctx, circlePts([0, 4], 66 * w, 16, 12).slice(0, 7).map(p => J(add(e, p), 0.9)));
  }
  [[-120, 900], [-100, 1000], [-80, 1050], [-60, 980]].forEach(([deg, v], i) => {
    const a = deg * Math.PI / 180, vx = Math.cos(a) * v * 0.55, vy = Math.sin(a) * v;
    const p = [e[0] + vx * age, e[1] - 60 + vy * age + 2700 * age * age];
    if (age < 0.08 || age > 0.7 || (age > 0.3 && p[1] > e[1] - 10)) return;
    const dir = Math.atan2(vy + 5400 * age, vx), r = 7 + (i % 2) * 2;
    const drop = [[0, -r * 2.3], [r, 0], [0, r], [-r, 0]].map(q => add(p, rot(q, dir + Math.PI / 2)));
    stroke(ctx, drop.map(q => J(q, 0.7)), { closed: true, width: LINE * 0.85 });
  });
}
function drawTicks(ctx, hc) {
  [[-0.6, 0], [0, 0], [0.6, 0]].forEach(([a]) => {
    const d = rot([0, -1], a), p0 = add(hc, scl(d, 70)), p1 = add(hc, scl(d, 96));
    stroke(ctx, [J(p0), J(p1)], { smooth: false });
  });
}

// ─── one frame ──────────────────────────────────────────────────────────────
function renderFrame(ctx, layer, t, S, assets, opts = {}) {
  const td = Math.floor(t * 12) / 12;               // drawings change on twos
  boil = Math.floor(t * 12) % 3; jc = 0;
  const { P, props } = episode1(td, S);

  ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  ctx.drawImage(assets.plate, 0, 0, W, H);

  const lc = layer.getContext('2d');
  lc.setTransform(1, 0, 0, 1, 0, 0); lc.clearRect(0, 0, W, H);
  if (props.flag) drawFlag(lc, props.flag.base, props.flag.lean, t);
  let head = null;
  if (!P.hidden) {
    const r = drawCharacter(lc, P); head = r.hc;
    if (props.heldFlag) drawFlag(lc, props.heldFlag.base, 0, t, props.heldFlag.dir);
    if (props.water) eraseBelowWater(lc, S, props.water);
  }
  if (props.flyingMap) drawMap(lc, p => add(props.flyingMap.c, rot([p[0], p[1] * (props.flyingMap.sy ?? 1)], props.flyingMap.r)));
  if (props.ticks && head) drawTicks(lc, head);
  if (props.question && head) drawQuestion(lc, head);
  if (props.splash != null) { drawSplash(lc, S, props.splash); drawRipples(lc, S, S.entry, props.splash); }
  if (props.pop != null) drawRipples(lc, S, [S.float[0], S.liquid.cy + 22], props.pop, 2);

  ctx.save(); ctx.filter = 'drop-shadow(0px 3px 5px rgba(40,24,10,.30))'; ctx.drawImage(layer, 0, 0); ctx.restore();

  // end card: the mark, the line, the real app, and him sitting on it
  const e = seg(t, opts.endAt, opts.endAt + 0.45);
  if (e > 0) {
    ctx.globalAlpha = e; ctx.fillStyle = NIGHT; ctx.fillRect(0, 0, W, H);
    const m = assets.mark, mw = 132, mh = mw * m.height / m.width;
    ctx.drawImage(m, (W - mw) / 2, 318, mw, mh);
    ctx.textAlign = 'left'; ctx.font = '700 104px "DM Sans"';
    const head = opts.headline, dot = head.slice(-1), body = head.slice(0, -1);
    const bw = ctx.measureText(body).width, tw = ctx.measureText(head).width, x0 = (W - tw) / 2;
    ctx.fillStyle = CREAM; ctx.fillText(body, x0, 520); ctx.fillStyle = PALE; ctx.fillText(dot, x0 + bw, 520);
    ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(244,239,230,.66)'; ctx.font = '500 34px "DM Sans"';
    ctx.fillText(opts.sub, W / 2, 582);

    const sit = easeOut(seg(t, opts.endAt + 0.25, opts.endAt + 0.55)), wv = 22 * Math.sin((t - opts.endAt) * 15) * seg(t, opts.endAt + 0.6, opts.endAt + 0.8);
    boil = Math.floor(t * 12) % 3; jc = 0;
    lc.clearRect(0, 0, W, H);
    drawPhone(lc, [W / 2, 1200], 1, 400, 640);
    if (sit > 0) {
      const Q = { f: 1, x: 672, y: 882 - 90 * (1 - sit), rot: 0, tilt: 0.12, eyes: 'open', mouth: 'grin', knee: { f: 1, b: 1 }, elbow: { b: -1, f: -1 },
                  feet: { f: [66, 60], b: [44, 66] }, hands: { b: [-70 + wv, -244], f: [40, 6] } };
      drawCharacter(lc, Q);
    }
    ctx.drawImage(layer, 0, 0);
    ctx.globalAlpha = 1;
  }
  if (S.label) { ctx.fillStyle = 'rgba(200,30,30,.85)'; ctx.font = '700 22px "DM Sans"'; ctx.textAlign = 'left'; ctx.fillText(S.label, 120, 1600); }
}

if (typeof module !== 'undefined') module.exports = { SCENES };
