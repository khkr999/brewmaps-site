// على ذوقك · "Cold drinks" v6: v5 with the question held 0.2s longer and the reel ending at 17.0s on a steady final
// frame (no fade to black, so the loop back to the first frame never flashes). Shared by player.html (picture) and sound.py (which reads it through node),
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
T.bridge = T.question + 2 * BEAT + 0.2;                     // 9.5: the question holds 0.2s longer, then the first crop comes into focus
T.product = T.bridge + 2 * BEAT;                            // 11.05: downbeat; the phone is already rising
T.phoneIn = T.product - 0.13;                               // 10.92: the phone enters from below the frame
T.tap = T.product + 0.6;                                    // 11.65: the field takes focus
T.typeStart = T.product + 0.85; T.typeEnd = T.product + 2.55;   // 1.7s for 27 characters: quick, human typing
T.submit = T.typeEnd + 0.2;                                 // 13.8: sent; a short search
T.result = T.submit + 0.42;                                 // 14.22: the map and the three results
T.message = T.result + 0.6;                                 // 14.82: the line above the phone, then everything holds
T.end = 17.0;                                               // the reel ends on the held final frame
T.card = T.end - 0.9;                                       // 16.1: the music resolves under the hold (picture unchanged)
// keystroke times: uneven like a real thumb, a little longer before each new word, last key exactly at typeEnd
T.keys = (function () {
  var q = APP.query, w = [], s = 0;
  for (var i = 0; i < q.length; i++) { var x = 1 + 0.35 * Math.sin(i * 2.7) + 0.2 * Math.sin(i * 7.3) + (i > 0 && q[i - 1] === ' ' ? 0.9 : 0); w.push(x); s += x; }
  var out = [], acc = 0; for (var j = 0; j < q.length; j++) { acc += w[j]; out.push(T.typeStart + (T.typeEnd - T.typeStart) * acc / s); }
  return out;
})();
if (typeof module !== 'undefined') module.exports = { SHOT, SHOTS, PLATES, QUESTION, BRIDGE, APP, BEAT, T };
