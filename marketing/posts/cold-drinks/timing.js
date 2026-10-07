// على ذوقك · "Cold drinks": five macro shots, hard cuts, a question, then the BrewMaps card.
// Shared by player.html (picture) and sound.py (which reads it through node), so both always agree.
var SHOT = 1.55;                                            // each drink
var SHOTS = [
  { plate: 'plates/iced-latte.jpg',    ar: 'آيس لاتيه',     en: 'ICED LATTE',     drift: [-1, 0.4] },
  { plate: 'plates/matcha.jpg',        ar: 'ماتشا لاتيه',   en: 'MATCHA LATTE',   drift: [1, -0.3] },
  { plate: 'plates/cold-brew.jpg',     ar: 'كولد برو',      en: 'COLD BREW',      drift: [-0.6, -1] },
  { plate: 'plates/spanish-latte.jpg', ar: 'سبانش لاتيه',   en: 'SPANISH LATTE',  drift: [0.8, 0.8] },
  { plate: 'plates/karkadeh.jpg',      ar: 'كركديه مثلج',   en: 'ICED KARKADEH',  drift: [-0.4, 1] },
];
var T = {
  shots: SHOTS.length * SHOT,                               // 7.75: the names end
  question: SHOTS.length * SHOT,                            // the last shot stays; its name gives way to the question
  card: 10.4,                                               // wash into BrewMaps green
  end: 13.6,
};
if (typeof module !== 'undefined') module.exports = { SHOT, SHOTS, T };
