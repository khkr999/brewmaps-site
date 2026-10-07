# على ذوقك · Cold drinks — `export/cold-drinks.mp4`, 13.6s, 9:16, with sound

A quiet one, after a Pinterest reference (Kronotrop "Cold Drinks"): five near-still macro shots of iced drinks, hard
cuts every 1.55s, each on a slow push with a little drift, a thin centred name (Arabic over small letter-spaced serif
caps). The last shot holds while the name gives way to **أي واحد على ذوقك؟**, then the frame washes into BrewMaps green:
Brew Maps lockup, **يلقى لك الكوفي / اللي على ذوقك.**, store line.

| Time | Shot | On screen |
|---|---|---|
| 0.0–1.55 | Iced latte: milk swirling into espresso around the ice | **آيس لاتيه** · ICED LATTE |
| 1.55–3.1 | Matcha latte | **ماتشا لاتيه** · MATCHA LATTE |
| 3.1–4.65 | Cold brew: dark amber, frost on the ice | **كولد برو** · COLD BREW |
| 4.65–6.2 | Spanish latte: caramel marbling | **سبانش لاتيه** · SPANISH LATTE |
| 6.2–7.75 | Iced karkadeh: ruby red | **كركديه مثلج** · ICED KARKADEH |
| 7.75–10.4 | The karkadeh holds; the name fades, the question comes in | **أي واحد على ذوقك؟** |
| 10.4–13.6 | Wash into green; the drink stays faintly behind | Brew Maps · **يلقى لك الكوفي / اللي على ذوقك.** · مجاني على الآب ستور وجوجل بلاي |

- Plates: AI-generated macro photographs (`plates/*.png`, generated at 768×1376 and upscaled to `plates/*.jpg` at
  1080×1920). No glass, rim, café, cup or brand in any of them: just ice and liquid.
- `timing.js` holds the cut times and copy; `player.html` draws the frames; `render.js` writes 24 fps PNGs; `sound.py`
  builds the mix from the same timing: a soft celesta-and-strings bed with no pulse, a new chord on every cut, an ice
  clink on every cut, faint fizz and ice underneath, a swell into the card and the BrewMaps sonic logo (A–D–F#). −18 LUFS.
- Encode: `ffmpeg -framerate 24 -i <dir>/f_%04d.png -c:v libx264 -pix_fmt yuv420p -crf 18 -movflags +faststart` then mux `export/cold-drinks-mix.wav`.

## Caption
كل واحد له مشروبه… أي واحد على ذوقك؟ 🧊
BrewMaps مجاني على الآب ستور وجوجل بلاي. الرابط في البايو.
