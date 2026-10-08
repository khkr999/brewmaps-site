# على ذوقك · Cold drinks — `export/cold-drinks.mp4`, 17.05s, 9:16, with sound

v3 = the calm v1 opening + the v2 ending. Five near-still macro shots on a slow push, hard cuts every 1.55s, a centred
name (Arabic over small letter-spaced serif caps); the last shot holds while its name gives way to the question. Then
the bridge, BrewMaps doing something, and a one-second card.

| Time | What | On screen |
|---|---|---|
| 0.0–7.75 | Five drinks, 1.55s each, names centred (Arabic 88px over ICED LATTE… caps at 38px) | **آيس لاتيه** · **ماتشا لاتيه** · **كولد برو** · **سبانيش لاتيه** · **كركديه مثلج** |
| 7.75–9.3 | The question on the brand green | **أي واحد على ذوقك؟** |
| 9.3–10.85 | The bridge: four 0.39s flashes of tight drink crops, the Brew Maps lockup over the line | Brew Maps · **يختارلك مشروبك المفضل** |
| 10.85–15.5 | The product, unhurried: the phone rises over 0.7s, the query types over 1.3s, a beat, the results settle in, the message holds ~2s: on the brand green, a phone rises; Ask BrewMaps; the query types itself, then results over the real app map (drink · price · distance · match, no café names) | query **سبانيش لاتيه أقل من ٢٠ درهم** · **٣ كوفيهات قريبة** · **سبانيش لاتيه · ١٨ درهم · ٦ دقايق · ٩٢٪ على ذوقك** · above the phone: **BrewMaps يلقى لك الكوفي / اللي على ذوقك** |
| 15.5–17.05 | The card: the Brew Maps lockup alone, ~1.5s | Brew Maps |

- Plates: AI-generated macro photographs (`plates/*.png` → `plates/*.jpg` at 1080×1920). No glass, rim, café or brand.
  The map inside the phone is the real app map crop (`../coffee-routine-update/img/appmap.png`).
- `timing.js` holds the cut times and copy; `player.html` draws the frames; `render.js` writes 24 fps PNGs; `sound.py`
  builds the mix from the same timing. Music: a warm, understated groove on the cut grid (BEAT = half a shot, so every
  cut is a downbeat): electric piano comping, a soft bass on the roots, a brushed shaker on 8ths with a rim click on 2
  and 4, a sparse vibes motif answering each cut; one chord per drink, a lift on the question, pumping through the
  bridge, EP and bass only under the product, resolving to D on the card with the BrewMaps sonic logo. Drink ASMR on the
  cuts (ice clinks, fizz, an ice cube dropped into a glass on the question and as the phone rises, ice cracking on the
  bridge, ice settling under the phone, whooshes, typing ticks, the result tone). −17 LUFS.
- Encode: `ffmpeg -framerate 24 -i <dir>/f_%04d.png -c:v libx264 -pix_fmt yuv420p -crf 17 -movflags +faststart`, then mux `export/cold-drinks-mix.wav`.
- Earlier cuts, sources kept beside them: v1 (`*-v1.*`, 13.6s, drinks + question + card, no product moment) →
  `export/cold-drinks-v1.mp4`; v2 (`*-v2.*`, 9.2s, hook first, fast drinks, big names) → `export/cold-drinks-v2.mp4`.

## Caption
أي واحد على ذوقك؟ 🧊
مهما كان مزاجك، BrewMaps يلقى لك الكوفي اللي يناسبك.
مجاني على الآب ستور وجوجل بلاي. الرابط في البايو.
