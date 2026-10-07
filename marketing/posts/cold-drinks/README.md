# على ذوقك · Cold drinks — `export/cold-drinks.mp4`, 9.2s, 9:16, with sound

Fast, sensory, then the product. One beat = 0.8s (75 BPM) and every cut lands on a beat.
hook → five drinks → bridge → BrewMaps doing something → a one-second card.

| Time | What | On screen |
|---|---|---|
| 0.0–0.8 | The strongest shot (the Spanish latte swirl), tight | **أي واحد على ذوقك؟** (112px) + a small BrewMaps mark, top centre, faint |
| 0.8–4.8 | Five drinks, 0.8s each, each in a different framing and the name in a different place | **آيس لاتيه** (low right) · **ماتشا لاتيه** (high left) · **كولد برو** (centre) · **سبانيش لاتيه** (low left, a new tight crop) · **كركديه مثلج** (high centre) |
| 4.8–5.6 | The bridge: four 0.2s flashes of tight drink crops | **مهما كان مزاجك…** |
| 5.6–8.1 | The product, calmer: the drink dimmed behind, a phone rises; Ask BrewMaps; the query types itself, then one result over the real app map and a short results list (drink · price · distance · match, no café names) | query **سبانيش لاتيه تحت ٢٠ درهم** · **٣ كوفيهات قريبة** · **سبانيش لاتيه · ١٨ درهم · ٦ دقايق · ٩٢٪ على ذوقك** · above the phone: **BrewMaps يلقى لك الكوفي / اللي على ذوقك** |
| 8.1–9.2 | The card, minimal | Brew Maps lockup · **اكتشف كوفيك** |

- Arabic only on the drinks (the English captions are gone); names at 100px, the hook at 112px, a soft dark band behind
  the text instead of heavy shadows. One subtle brand cue through the drinks: the small mark at the top.
- Plates: AI-generated macro photographs (`plates/*.png` → `plates/*.jpg` at 1080×1920). No glass, rim, café or brand.
  The map inside the phone is the real app map crop (`../coffee-routine-update/img/appmap.png`).
- `timing.js` holds the beat grid and copy; `player.html` draws the frames; `render.js` writes 24 fps PNGs; `sound.py`
  builds the mix from the same timing: a soft sub pulse, muted keys and hi-hat ticks on the 75 BPM grid, a cool chord
  per drink, thinner under the product; drink ASMR synced to the cuts (ice clinks, a soft pour under the hook, fizz, one
  ice crack, whooshes between sections, typing ticks, a two-note result tone) and the BrewMaps sonic logo. −16.5 LUFS.
- Encode: `ffmpeg -framerate 24 -i <dir>/f_%04d.png -c:v libx264 -pix_fmt yuv420p -crf 17 -movflags +faststart`, then mux `export/cold-drinks-mix.wav`.
- First cut (13.6s, slower, names small with English captions, no product moment): `export/cold-drinks-v1.mp4`.

## Caption
أي واحد على ذوقك؟ 🧊
مهما كان مزاجك، BrewMaps يلقى لك الكوفي اللي يناسبك.
مجاني على الآب ستور وجوجل بلاي. الرابط في البايو.
