// على ذوقك · "Cold drinks" v2. One beat = 0.8s (75 BPM): every cut lands on a beat.
// hook → five drinks → bridge (four flashes) → the product moment → the card. Shared by player.html and sound.py.
var BEAT = 0.8;
var PLATES = { latte: 'plates/iced-latte.jpg', matcha: 'plates/matcha.jpg', brew: 'plates/cold-brew.jpg', spanish: 'plates/spanish-latte.jpg', karkadeh: 'plates/karkadeh.jpg' };
// framing: z = zoom at the cut (then a slow push of +0.06), c = the point of the plate kept at the frame's centre (0..1)
var HOOK = { plate: 'spanish', z: 1.22, c: [0.5, 0.46], text: 'أي واحد على ذوقك؟' };
var SHOTS = [
  { plate: 'latte',    z: 1.00, c: [0.50, 0.50], drift: [-1, 0.3],  ar: 'آيس لاتيه',    pos: 'low-right' },
  { plate: 'matcha',   z: 1.16, c: [0.42, 0.56], drift: [1, -0.4],  ar: 'ماتشا لاتيه',  pos: 'high-left' },
  { plate: 'brew',     z: 1.06, c: [0.50, 0.44], drift: [0, -1],    ar: 'كولد برو',     pos: 'centre' },
  { plate: 'spanish',  z: 1.34, c: [0.60, 0.62], drift: [0.8, 0.6], ar: 'سبانيش لاتيه', pos: 'low-left' },
  { plate: 'karkadeh', z: 1.10, c: [0.50, 0.40], drift: [-0.5, 1],  ar: 'كركديه مثلج',  pos: 'high-centre' },
];
var BRIDGE = { text: 'مهما كان مزاجك…', flashes: [['latte', 1.6, [0.3, 0.3]], ['matcha', 1.5, [0.6, 0.7]], ['brew', 1.7, [0.5, 0.5]], ['karkadeh', 1.6, [0.7, 0.35]]] };
var APP = { query: 'سبانيش لاتيه تحت ٢٠ درهم', message: ['BrewMaps يلقى لك الكوفي', 'اللي على ذوقك'], results: '٣ كوفيهات قريبة', top: 'سبانيش لاتيه · ١٨ درهم · ٦ دقايق', match: '٩٢٪ على ذوقك' };
var T = {
  hook: 0, drinks: BEAT, bridge: BEAT * 6, product: BEAT * 7,
  typeStart: BEAT * 7 + 0.25, typeEnd: BEAT * 7 + 1.05, result: BEAT * 7 + 1.2, message: BEAT * 7 + 1.45,
  card: BEAT * 10.1, end: BEAT * 11.5,                                                                         // 8.08 → 9.2
};
if (typeof module !== 'undefined') module.exports = { BEAT, PLATES, HOOK, SHOTS, BRIDGE, APP, T };
