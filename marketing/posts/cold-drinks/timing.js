// على ذوقك · "Cold drinks" v3: the calm v1 opening (five slow shots, names centred, 1.55s each, then the question
// over the last drink) and the v2 ending (the bridge, Ask BrewMaps, the one-second card).
// Shared by player.html (picture) and sound.py (which reads it through node), so both always agree.
var SHOT = 1.55;
var SHOTS = [
  { plate: 'plates/iced-latte.jpg',    ar: 'آيس لاتيه',     en: 'ICED LATTE',     drift: [-1, 0.4] },
  { plate: 'plates/matcha.jpg',        ar: 'ماتشا لاتيه',   en: 'MATCHA LATTE',   drift: [1, -0.3] },
  { plate: 'plates/cold-brew.jpg',     ar: 'كولد برو',      en: 'COLD BREW',      drift: [-0.6, -1] },
  { plate: 'plates/spanish-latte.jpg', ar: 'سبانيش لاتيه',  en: 'SPANISH LATTE',  drift: [0.8, 0.8] },
  { plate: 'plates/karkadeh.jpg',      ar: 'كركديه مثلج',   en: 'ICED KARKADEH',  drift: [-0.4, 1] },
];
var PLATES = { latte: 'plates/iced-latte.jpg', matcha: 'plates/matcha.jpg', brew: 'plates/cold-brew.jpg', spanish: 'plates/spanish-latte.jpg', karkadeh: 'plates/karkadeh.jpg' };
var BRIDGE = { text: 'مهما كان مزاجك…', flashes: [['latte', 1.6, [0.3, 0.3]], ['matcha', 1.5, [0.6, 0.7]], ['brew', 1.7, [0.5, 0.5]], ['karkadeh', 1.6, [0.7, 0.35]]] };
var APP = { query: 'سبانيش لاتيه تحت ٢٠ درهم', message: ['BrewMaps يلقى لك الكوفي', 'اللي على ذوقك'], results: '٣ كوفيهات قريبة', top: 'سبانيش لاتيه · ١٨ درهم · ٦ دقايق', match: '٩٢٪ على ذوقك' };
var BEAT = 0.8;
var T = { question: SHOTS.length * SHOT };                  // 7.75: the last name gives way to the question, the shot holds
T.bridge = T.question + 1.6;                                // 9.35
T.product = T.bridge + BEAT;                                 // 10.15: the phone rises (slower now)
T.typeStart = T.product + 0.6; T.typeEnd = T.product + 1.9; T.result = T.product + 2.3; T.message = T.product + 2.7;
T.card = T.product + 4.6;                                    // 14.75: the message has had ~2s
T.end = T.card + 1.8;                                        // 16.55
if (typeof module !== 'undefined') module.exports = { SHOT, SHOTS, PLATES, BRIDGE, APP, BEAT, T };
