# على ذوقك · Cold drinks — `export/cold-drinks.mp4`, 16.6s, 9:16, with sound

v3 = the calm v1 opening + the v2 ending. Five near-still macro shots on a slow push, hard cuts every 1.55s, a centred
name (Arabic over small letter-spaced serif caps); the last shot holds while its name gives way to the question. Then
the bridge, BrewMaps doing something, and a one-second card.

| Time | What | On screen |
|---|---|---|
| 0.0–7.75 | Five drinks, 1.55s each, names centred | **آيس لاتيه** · **ماتشا لاتيه** · **كولد برو** · **سبانيش لاتيه** · **كركديه مثلج** (with small ICED LATTE… caps) |
| 7.75–9.35 | The karkadeh holds; the name fades, the question comes in | **أي واحد على ذوقك؟** |
| 9.35–10.15 | The bridge: four 0.2s flashes of tight drink crops | **مهما كان مزاجك…** |
| 10.15–14.75 | The product, unhurried: the phone rises over 0.7s, the query types over 1.3s, a beat, the results settle in, the message holds ~2s: the drink dimmed behind, a phone rises; Ask BrewMaps; the query types itself, then results over the real app map (drink · price · distance · match, no café names) | query **سبانيش لاتيه أقل من ٢٠ درهم** · **٣ كوفيهات قريبة** · **سبانيش لاتيه · ١٨ درهم · ٦ دقايق · ٩٢٪ على ذوقك** · above the phone: **BrewMaps يلقى لك الكوفي / اللي على ذوقك** |
| 14.75–16.55 | The card, minimal, ~1.8s | Brew Maps lockup · **يلقى لك كوفيك المفضل** |

- Plates: AI-generated macro photographs (`plates/*.png` → `plates/*.jpg` at 1080×1920). No glass, rim, café or brand.
  The map inside the phone is the real app map crop (`../coffee-routine-update/img/appmap.png`).
- `timing.js` holds the cut times and copy; `player.html` draws the frames; `render.js` writes 24 fps PNGs; `sound.py`
  builds the mix from the same timing: the calm celesta-and-strings bed with a new chord and an ice clink on every cut
  through the drinks and the question, then a whoosh into the bridge with its ice ticks and a sub pulse, thinner keys
  under the product, typing ticks, the result tone, the card's swell and the BrewMaps sonic logo. −17 LUFS.
- Encode: `ffmpeg -framerate 24 -i <dir>/f_%04d.png -c:v libx264 -pix_fmt yuv420p -crf 17 -movflags +faststart`, then mux `export/cold-drinks-mix.wav`.
- Earlier cuts, sources kept beside them: v1 (`*-v1.*`, 13.6s, drinks + question + card, no product moment) →
  `export/cold-drinks-v1.mp4`; v2 (`*-v2.*`, 9.2s, hook first, fast drinks, big names) → `export/cold-drinks-v2.mp4`.

## Caption
أي واحد على ذوقك؟ 🧊
مهما كان مزاجك، BrewMaps يلقى لك الكوفي اللي يناسبك.
مجاني على الآب ستور وجوجل بلاي. الرابط في البايو.
