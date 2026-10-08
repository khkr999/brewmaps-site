// على ذوقك · "Cold drinks" v12 (timing as v7, demo slowed slightly, keys on frames): v6 retimed onto the note grid of the new track (a soft three-note pluck arpeggio after
// the reference sound): the question holds 8 notes, the montage cuts every 2 notes; ends at 17.0s on a steady frame. Shared by player.html (picture) and sound.py (which reads it through node),
// so both always agree.
var SHOT = 1.55;
var SHOTS = [                                                // v14: real moving footage (clips/, see prep_clips.py)
  { clip: 'latte',    ar: 'سبانيش لاتيه',  en: 'SPANISH LATTE',  drift: [0, 0] },
  { clip: 'matcha',   ar: 'ماتشا لاتيه',   en: 'MATCHA LATTE',   drift: [0, 0] },
  { clip: 'brew',     ar: 'كولد برو',      en: 'COLD BREW',      drift: [0, 0] },
  { clip: 'karkadeh', ar: 'كركديه مثلج',   en: 'ICED KARKADEH',  drift: [0, 0] },
];
var CLIPS = ['latte', 'matcha', 'brew', 'karkadeh', 'unicorn'];
var QUESTION = { text: 'أي واحد على ذوقك؟' };
var BRIDGE = { lines: ['BrewMaps', 'يختارلك مشروبك المفضل'], flashes: [['latte', 1.18, [0.46, 0.44]], ['matcha', 1.18, [0.5, 0.56]], ['unicorn', 1.18, [0.55, 0.47]], ['brew', 1.18, [0.5, 0.44]]], offset: 0.55 };   // montage: crops of the same clips, a later moment
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
T.typeStart = T.product + 4 * NOTE; T.typeEnd = T.product + 13 * NOTE;   // v12: 2.0s of typing (about 13 characters a second)
T.submit = T.product + 14 * NOTE;                           // sent; a short search
T.result = T.product + 16 * NOTE;                           // 14.84: the map and the three results
T.message = T.product + 18 * NOTE;                          // 15.28: the line above the phone, then everything holds
T.card = T.product + 25 * NOTE;                             // 16.83: the music lands on its last chord under the hold
T.end = T.card + 1.0;                                       // 17.83: the demo is ~0.8s slower than v11; the opening is unchanged
// keystrokes: one character per video frame it appears on (24 fps), uneven like a real thumb, a little longer before
// each new word. Each time is an exact frame time, so the picture and the click land on the same frame.
T.keys = (function () {
  var q = APP.query, w = [], s = 0, f0 = Math.ceil(T.typeStart * 24), f1 = Math.floor(T.typeEnd * 24);
  for (var i = 0; i < q.length; i++) { var x = 1 + 0.35 * Math.sin(i * 2.7) + 0.2 * Math.sin(i * 7.3) + (i > 0 && q[i - 1] === ' ' ? 0.9 : 0); w.push(x); s += x; }
  var out = [], acc = 0, prev = f0 - 1;
  for (var j = 0; j < q.length; j++) { acc += w[j]; var f = Math.max(prev + 1, Math.round(f0 + (f1 - f0) * acc / s)); out.push(f / 24); prev = f; }
  return out;
})();
if (typeof module !== 'undefined') module.exports = { SHOT, SHOTS, CLIPS, QUESTION, BRIDGE, APP, BEAT, NOTE, T };
