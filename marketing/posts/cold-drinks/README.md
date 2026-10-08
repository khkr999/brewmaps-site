# على ذوقك · Cold drinks — `export/cold-drinks.mp4`, 19.0s, 9:16, with sound

v5: the v4 cut, polished frame by frame. Same concept, drinks, copy, typography and colours. The first 7.75s keep their
pace; the app demonstration is about 1.1s longer so the search and the line can be read.

| Time | v4 | v5 |
|---|---|---|
| 0.0–7.75 | 4-frame dissolve on each cut, which showed one muddy blended frame | Clean cuts on the downbeat; the push carries across; names leave before the cut |
| 7.75–8.4 | The karkadeh held still for 0.25s, then a flat fade to green | The karkadeh pulls focus (blur and push) into the green from the first frame |
| 8.05–9.1 | The question faded in as one block | The words rise in right to left out of a slight blur, breathe while holding, then leave the same way |
| 9.1–9.3 | Four frames of empty green, then a 4-frame dissolve | The first crop surfaces out of the green into focus on one continuous curve |
| 9.3–10.85 | 4-frame dissolves between unrelated crops (muddy) | Clean cuts on every 8th note with a small settle; deeper scrim so the line holds on bright crops |
| 10.6–11.7 | Empty green frames, then a half-transparent grey phone | The last crop pulls focus away as the opaque phone glides up from below the frame |
| 11.5–14.4 | Typing eased (slow, fast, slow) over 1.3s; results at once | Tap and focus ring, 1.8s of uneven human typing, send, search dots, results while the view eases back out |
| 15.1–17.8 | Line at 13.55, resolve at 16.66 | Line at 15.11 after the results, held 2.7s; results held 3.5s |
| 17.8–19.0 | Phone turned grey; sharp fade | Line lifts away, phone settles back, even fade to black as the chord resolves |

- Plates: AI-generated macro photographs (`plates/*.png` → `plates/*.jpg` at 1080×1920). No glass, rim, café or brand.
  The map inside the phone is the real app map crop (`../coffee-routine-update/img/appmap.png`).
- `timing.js` holds the cut times and copy; `render.js` writes 24 fps PNGs; `sound.py` builds the mix from the same
  timing: the calm celesta-and-strings bed with a chord on every cut, a soft pizzicato pulse on the beat grid and a
  bass note per cut; drink ASMR on the cuts (ice clinks, fizz, an ice cube as the question's words rise, ice cracking on the montage),
  then the phone rising, the tap, every keystroke on its frame, the send, the result tone and the line. Accents are
  quantised to the frame where the picture changes. −17 LUFS.
- Encode: `ffmpeg -framerate 24 -i <dir>/f_%04d.png -c:v libx264 -pix_fmt yuv420p -crf 17 -movflags +faststart`, then mux `export/cold-drinks-mix.wav`.
- Earlier cuts, sources kept beside them: v1 (`*-v1.*`, 13.6s), v2 (`*-v2.*`, 9.2s, hook first), v3 (`*-v3.*`, 17.4s,
  pre-motion-pass), v4 (`*-v4.*`, 17.9s, first motion pass) → `export/cold-drinks-v1.mp4` … `-v4.mp4`.

## Caption
أي واحد على ذوقك؟ 🧊
BrewMaps يختارلك مشروبك المفضل ويلقى لك كوفيك.
مجاني على الآب ستور وجوجل بلاي. الرابط في البايو.
