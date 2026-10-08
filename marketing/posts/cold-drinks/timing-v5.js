// على ذوقك · "Cold drinks" v5: the v4 cut, polished. The opening keeps its pace; the question and the product moment
// get a slower, more readable close (≈19s). Shared by player.html (picture) and sound.py (which reads it through node),
// so both always agree.
var SHOT = 1.55;
var SHOTS = [
  { plate: 'plates/iced-latte.jpg',    ar: 'آيس لاتيه',     en: 'ICED LATTE',     drift: [-1, 0.4] },
  { plate: 'plates/matcha.jpg',        ar: 'ماتشا لاتيه',   en: 'MATCHA LATTE',   drift: [1, -0.3] },
  { plate: 'plates/cold-brew.jpg',     ar: 'كولد برو',      en: 'COLD BREW',      drift: [-0.6, -1] },
  { plate: 'plates/spanish-latte.jpg', ar: 'سبانيش لاتيه',  en: 'SPANISH LATTE',  drift: [0.8, 0.8] },
  { plate: 'plates/karkadeh.jpg',      ar: 'كركديه مثلج',   en: 'ICED KARKADEH',  drift: [-0.4, 1] },
];
var PLATES = { latte: 'plates/iced-latte.jpg', matcha: 'plates/matcha.jpg', brew: 'plates/cold-brew.jpg', spanish: 'plates/spanish-latte.jpg', karkadeh: 'plates/karkadeh.jpg' };
var QUESTION = { text: 'أي واحد على ذوقك؟' };
var BRIDGE = { lines: ['BrewMaps', 'يختارلك مشروبك المفضل'], flashes: [['latte', 1.6, [0.3, 0.3]], ['matcha', 1.5, [0.6, 0.7]], ['spanish', 1.7, [0.5, 0.5]], ['karkadeh', 1.6, [0.7, 0.35]]] };
var APP = { query: 'سبانيش لاتيه أقل من ٢٠ درهم', message: ['BrewMaps يلقى لك الكوفي', 'اللي على ذوقك'], results: '٣ كوفيهات قريبة', top: 'سبانيش لاتيه · ١٨ درهم · ٦ دقايق', match: '٩٢٪ على ذوقك' };
var BEAT = SHOT / 2;                                        // 0.775: the music grid. Every shot is two beats, so every cut is a downbeat
var T = { question: SHOTS.length * SHOT };                  // 7.75: the karkadeh pulls focus into the green
T.words = T.question + 0.3;                                 // 8.05: the question's words rise in, right to left
T.bridge = T.question + 2 * BEAT;                           // 9.3: the first crop comes into focus out of the green
T.product = T.bridge + 2 * BEAT;                            // 10.85: downbeat; the phone is already rising
T.phoneIn = T.product - 0.13;                               // 10.72: the phone enters from below the frame
T.tap = T.product + 0.65;                                   // 11.5: the field takes focus
T.typeStart = T.product + 0.95; T.typeEnd = T.product + 2.75;   // 1.8s for 25 characters: quick, human typing
T.submit = T.typeEnd + 0.22;                                // 13.82: sent; a short search
T.result = T.product + 4.5 * BEAT;                          // 14.34: the map and the three results
T.message = T.product + 5.5 * BEAT;                         // 15.11: the line above the phone
T.card = T.product + 9 * BEAT;                              // 17.83: the resolve begins (no logo card)
T.end = T.card + 1.15;                                      // 18.98
// keystroke times: uneven like a real thumb, a little longer before each new word, last key exactly at typeEnd
T.keys = (function () {
  var q = APP.query, w = [], s = 0;
  for (var i = 0; i < q.length; i++) { var x = 1 + 0.35 * Math.sin(i * 2.7) + 0.2 * Math.sin(i * 7.3) + (i > 0 && q[i - 1] === ' ' ? 0.9 : 0); w.push(x); s += x; }
  var out = [], acc = 0; for (var j = 0; j < q.length; j++) { acc += w[j]; out.push(T.typeStart + (T.typeEnd - T.typeStart) * acc / s); }
  return out;
})();
if (typeof module !== 'undefined') module.exports = { SHOT, SHOTS, PLATES, QUESTION, BRIDGE, APP, BEAT, T };
