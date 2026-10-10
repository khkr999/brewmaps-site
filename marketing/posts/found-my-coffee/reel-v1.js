// لقيت كوفيي — 9s doodle Reel. The Regular's character (../the-regular/rig.js) lounging in a cup.
// Plate: plates/cup.jpg (AI-generated, unbranded). All positions below are plate pixels.

const DUR = 9;
const K = 1.36;                                    // character scale on this plate
const RIM = { cx: 548, cy: 905, rx: 230, ry: 110 }, COF = { cx: 548, cy: 966, rx: 168, ry: 48 };

// everything the cup's front hides: the walls, and the opening below the coffee line
function cupFront(ctx) {
  ctx.beginPath();
  ctx.moveTo(318, RIM.cy);
  ctx.bezierCurveTo(318, 1100, 330, 1250, 360, 1300);
  ctx.bezierCurveTo(420, 1345, 680, 1345, 735, 1300);
  ctx.bezierCurveTo(765, 1250, 778, 1100, 778, RIM.cy);
  ctx.ellipse(RIM.cx, RIM.cy, RIM.rx, RIM.ry, 0, 0, Math.PI, false);
  ctx.closePath();
  ctx.moveTo(COF.cx + COF.rx, COF.cy); ctx.ellipse(COF.cx, COF.cy, COF.rx, COF.ry, 0, 0, Math.PI * 2);
}
const V = p => [p[0] / K, p[1] / K];               // plate → character units

function pose(t) {
  const P = { f: -1, eyes: 'closed', mouth: 'smile', hands: {}, feet: {}, knee: { f: 1, b: 1 }, elbow: { f: -1, b: 1 } };
  const breathe = Math.sin(t * 2.2) * 0.025;
  [P.x, P.y] = V([408, 930]); P.rot = -1.0 + breathe; P.tilt = 0.25 + breathe;
  const sw = a => Math.sin(t * 3.1 + a) * 10;      // lazy foot swing
  P.feet = { f: { w: V([300 + sw(0), 975 + sw(0) * .3]) }, b: { w: V([318 + sw(1.7), 990 + sw(1.7) * .3]) } };
  // front arm draped over the right rim, hand dangling
  P.hands.f = { w: V([800, 945 + Math.sin(t * 2.2) * 4]) };
  // back arm: resting on the back rim, then lifting the phone
  const lift = ease(seg(t, 4.5, 5.0)) * (1 - ease(seg(t, 7.0, 7.3)));
  P.hands.b = { w: V(mix2([610, 830], [540, 640], lift)) };
  P.phone = lift;
  if (t > 4.9 && t < 7.1) P.mouth = 'grin';
  if (t > 2.6 && t < 3.6) P.mouth = 'o';        // ahh
  return P;
}

function steam(ctx, t) {                          // the "ahh": three soft wisps out of the cup
  const a = seg(t, 2.7, 3.1) * (1 - seg(t, 3.9, 4.4)); if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  [[505, 0], [545, .8], [585, 1.6]].forEach(([x, ph]) => {
    const pts = []; for (let k = 0; k < 6; k++) { const y = 860 - k * 26 - (t - 2.7) * 40; pts.push(V([x + Math.sin(k * 1.2 + ph + t * 3) * 12, y])); }
    stroke(ctx, pts.map(p => J(p, 1)), { width: LINE * 0.8 });
  });
  ctx.restore();
}

function tinyPhone(ctx, c, s, assets) {             // the phone in his hand: green screen, the BrewMaps mark
  if (s <= 0.02) return;
  const w = 70 * s, h = 124 * s, x = c[0] - w / 2, y = c[1] - h / 2, j = J([0, 0], 1);
  ctx.save();
  ctx.beginPath(); ctx.roundRect(x + j[0], y + j[1], w, h, 14 * s); ctx.fillStyle = LC; ctx.fill(); ctx.lineWidth = 2 * LINE; ctx.strokeStyle = LC; ctx.stroke();
  ctx.beginPath(); ctx.roundRect(x + 6 * s + j[0], y + 6 * s + j[1], w - 12 * s, h - 12 * s, 9 * s); ctx.fillStyle = '#25461C'; ctx.fill();
  const m = assets.mark, mw = w * 0.62, mh = mw * m.height / m.width;
  ctx.drawImage(m, c[0] - mw / 2 + j[0], c[1] - mh / 2 + j[1], mw, mh);
  ctx.restore();
}

function renderReel(ctx, layer, t, assets) {
  const td = Math.floor(t * 12) / 12;
  boil = Math.floor(t * 12) % 3; jc = 0;
  ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  ctx.drawImage(assets.plate, 0, 0, 1080, 1920);
  // a slow push-in on the cup, so the still breathes
  const z = 1 + 0.06 * ease(seg(t, 0, 7));

  const lc = layer.getContext('2d');
  lc.setTransform(1, 0, 0, 1, 0, 0); lc.clearRect(0, 0, 1080, 1920);
  lc.setTransform(K, 0, 0, K, 0, 0); LINE = 6.2 / K;
  const P = pose(td);
  drawArm(lc, P, 'b'); drawLeg(lc, P, 'b'); drawTorso(lc, P); drawLeg(lc, P, 'f');
  drawHead(lc, P);
  const hand = drawArm(lc, P, 'f');
  // the cup's front hides what's in the coffee
  lc.setTransform(1, 0, 0, 1, 0, 0); lc.globalCompositeOperation = 'destination-out'; lc.fillStyle = '#000'; cupFront(lc); lc.fill('nonzero'); lc.globalCompositeOperation = 'source-over';
  lc.setTransform(K, 0, 0, K, 0, 0);
  steam(lc, td);
  // phone in the back hand
  if (P.phone > 0) {
    const hb = toWorld(P, ik(RIG.shB, tgt(P, P.hands.b), RIG.upper, RIG.fore, 1)[2]);
    tinyPhone(lc, add(hb, [0, -54]), P.phone, assets);
  }
  lc.setTransform(1, 0, 0, 1, 0, 0); LINE = 6.5;

  ctx.save();
  ctx.translate(540, 905); ctx.scale(z, z); ctx.translate(-540, -905);
  ctx.drawImage(assets.plate, 0, 0, 1080, 1920);
  ctx.filter = 'drop-shadow(0px 0px 1.5px rgba(20,16,10,.5)) drop-shadow(0px 3px 6px rgba(20,16,10,.35))';
  ctx.drawImage(layer, 0, 0);
  ctx.restore();

  // the match badge, popping beside the phone
  const b = seg(t, 5.2, 5.5) * (1 - seg(t, 7.0, 7.25));
  if (b > 0) {
    const s = b < 1 ? 0.7 + 0.45 * Math.sin(b * Math.PI * 0.8) : 1;
    ctx.save(); ctx.translate(820, 600); ctx.scale(s, s); ctx.globalAlpha = Math.min(1, b * 2);
    ctx.beginPath(); ctx.roundRect(-170, -40, 340, 80, 40); ctx.fillStyle = '#25461C'; ctx.fill();
    ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(244,239,230,.9)'; ctx.stroke();
    ctx.direction = 'rtl'; ctx.textAlign = 'center'; ctx.fillStyle = '#F4EFE6'; ctx.font = '800 38px "Tajawal"';
    ctx.fillText('يناسب ذوقك ٩٢٪', 0, 13);
    ctx.restore();
  }

  // the line, top of frame
  const a = seg(t, 1.9, 2.4) * (1 - seg(t, 6.8, 7.1));
  if (a > 0) {
    ctx.save(); ctx.globalAlpha = a; ctx.direction = 'rtl'; ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 24;
    ctx.fillStyle = '#F4EFE6'; ctx.font = '800 76px "Tajawal"';
    ctx.fillText('لما تلقى الكوفي', 540, 330 + (1 - easeOut(seg(t, 1.9, 2.4))) * 16);
    ctx.fillText('اللي يناسبك…', 540, 425 + (1 - easeOut(seg(t, 1.9, 2.4))) * 16);
    ctx.restore();
  }

  // end card
  const e = seg(t, 7.0, 7.45);
  if (e > 0) {
    ctx.save(); ctx.globalAlpha = e; ctx.fillStyle = 'rgba(16,36,18,.94)'; ctx.fillRect(0, 0, 1080, 1920);
    const m = assets.mark, mw = 150, mh = mw * m.height / m.width;
    ctx.drawImage(m, (1080 - mw) / 2, 640, mw, mh);
    ctx.direction = 'rtl'; ctx.textAlign = 'center'; ctx.fillStyle = '#F4EFE6';
    ctx.font = '800 70px "Tajawal"'; ctx.fillText('BrewMaps يلقى لك', 540, 900);
    ctx.fillStyle = '#A9D19A'; ctx.fillText('الكوفي اللي يناسبك.', 540, 990);
    ctx.fillStyle = 'rgba(244,239,230,.72)'; ctx.font = '500 36px "Tajawal"';
    ctx.fillText('مجاني على الآب ستور وجوجل بلاي', 540, 1090);
    ctx.restore();
  }
}
