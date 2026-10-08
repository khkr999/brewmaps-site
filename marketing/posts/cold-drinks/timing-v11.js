// على ذوقك · "Cold drinks" v7: v6 retimed onto the note grid of the new track (a soft three-note pluck arpeggio after
// the reference sound): the question holds 8 notes, the montage cuts every 2 notes; ends at 17.0s on a steady frame. Shared by player.html (picture) and sound.py (which reads it through node),
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
var BEAT = SHOT / 2;
var NOTE = SHOT / 7;                                        // 0.2214: the arpeggio's note grid (3-note figure, close to the reference's 0.209s). Every shot is 7 notes, so every cut lands on a note
var T = { question: SHOTS.length * SHOT };                  // 7.75: the karkadeh pulls focus into the green
T.words = T.question + 0.3;                                 // 8.05: the question's words rise in, right to left
T.bridge = T.question + 8 * NOTE;                           // 9.52: the question holds, then the first crop comes into focus
T.flash = 2 * NOTE;                                         // the montage cuts every two notes
T.product = T.bridge + 8 * NOTE;                            // 11.29: the phone is already rising
T.phoneIn = T.product - 0.13;                               // the phone enters from below the frame
T.tap = T.product + 3 * NOTE;                               // the field takes focus
T.typeStart = T.product + 4 * NOTE; T.typeEnd = T.product + 11 * NOTE;   // 1.55s of typing
T.submit = T.product + 12 * NOTE;                           // sent; a short search
T.result = T.product + 14 * NOTE;                           // 14.39: the map and the three results
T.message = T.product + 16 * NOTE;                          // 14.84: the line above the phone, then everything holds
T.end = 17.0;                                               // the reel ends on the held final frame
T.card = T.product + 21 * NOTE;                             // 15.94: the music lands on its last chord under the hold (picture unchanged)
// keystroke times: uneven like a real thumb, a little longer before each new word, last key exactly at typeEnd
T.keys = (function () {
  var q = APP.query, w = [], s = 0;
  for (var i = 0; i < q.length; i++) { var x = 1 + 0.35 * Math.sin(i * 2.7) + 0.2 * Math.sin(i * 7.3) + (i > 0 && q[i - 1] === ' ' ? 0.9 : 0); w.push(x); s += x; }
  var out = [], acc = 0; for (var j = 0; j < q.length; j++) { acc += w[j]; out.push(T.typeStart + (T.typeEnd - T.typeStart) * acc / s); }
  return out;
})();
if (typeof module !== 'undefined') module.exports = { SHOT, SHOTS, PLATES, QUESTION, BRIDGE, APP, BEAT, NOTE, T };
