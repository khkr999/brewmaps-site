# على ذوقك · Cold drinks — `export/cold-drinks.mp4`, 17.4s, 9:16, with sound

v3 = the calm v1 opening + the v2 ending. Five near-still macro shots on a slow push, hard cuts every 1.55s, a centred
name (Arabic over small letter-spaced serif caps); the last shot holds while its name gives way to the question. Then
the bridge, BrewMaps doing something, and a one-second card.

| Time | What | On screen |
|---|---|---|
| 0.0–7.75 | Five drinks, 1.55s each, names centred (Arabic 88px over ICED LATTE… caps at 38px) | **آيس لاتيه** · **ماتشا لاتيه** · **كولد برو** · **سبانيش لاتيه** · **كركديه مثلج** |
| 7.75–9.3 | The karkadeh dissolves into the brand green (0.5s) and the question eases in | **أي واحد على ذوقك؟** |
| 9.3–10.85 | The bridge: four 0.39s flashes of tight drink crops, the Brew Maps lockup over the line | Brew Maps · **يختارلك مشروبك المفضل** |
| 10.85–16.66 | The product, unhurried: the phone rises over 0.7s, the query types over 1.3s, a beat, the results settle in, the message holds ~2s: on the brand green, a phone rises; Ask BrewMaps; the query types itself, then results over the real app map (drink · price · distance · match, no café names) | query **سبانيش لاتيه أقل من ٢٠ درهم** · **٣ كوفيهات قريبة** · **سبانيش لاتيه · ١٨ درهم · ٦ دقايق · ٩٢٪ على ذوقك** · above the phone: **BrewMaps يلقى لك الكوفي / اللي على ذوقك** |
| 16.66–17.4 | The phone holds, then everything fades to black. No logo card. | — |

- Plates: AI-generated macro photographs (`plates/*.png` → `plates/*.jpg` at 1080×1920). No glass, rim, café or brand.
  The map inside the phone is the real app map crop (`../coffee-routine-update/img/appmap.png`).
- `timing.js` holds the cut times and copy; `player.html` draws the frames; `render.js` writes 24 fps PNGs; `sound.py`
  builds the mix from the same timing. Music: the calm celesta-and-strings bed with a new chord on every cut, now with a
  soft pizzicato pulse on the beat grid (BEAT = half a shot, so every cut is a downbeat) and a low bass note on each
  cut; a lift on the question, pumping through the bridge, thinner under the phone, fading out at the end. Drink ASMR on
  the cuts (ice clinks, fizz, an ice cube dropped into a glass on the question and as the phone rises, ice cracking on
  the bridge, ice settling under the phone, whooshes, typing ticks, the result tone). −17 LUFS.
- Encode: `ffmpeg -framerate 24 -i <dir>/f_%04d.png -c:v libx264 -pix_fmt yuv420p -crf 17 -movflags +faststart`, then mux `export/cold-drinks-mix.wav`.
- Earlier cuts, sources kept beside them: v1 (`*-v1.*`, 13.6s, drinks + question + card, no product moment) →
  `export/cold-drinks-v1.mp4`; v2 (`*-v2.*`, 9.2s, hook first, fast drinks, big names) → `export/cold-drinks-v2.mp4`.

## Caption
أي واحد على ذوقك؟ 🧊
مهما كان مزاجك، BrewMaps يلقى لك الكوفي اللي يناسبك.
مجاني على الآب ستور وجوجل بلاي. الرابط في البايو.
