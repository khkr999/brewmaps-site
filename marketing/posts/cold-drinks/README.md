# على ذوقك · Cold drinks — `export/cold-drinks.mp4`, 17.0s, 9:16, with sound (v9)

v9: the glassy ice clinks (and the ice crack) replaced by a soft ice-into-water sound: a low plop, a short soft
splash and a few droplets, kept quiet under the music. Everything else as v8, which is kept as
`export/cold-drinks-v8.mp4`.

v8: v7 with the effects (ice, typing, taps, whooshes) about 4 dB lower overall, the montage hits and the ice crack
3–6 dB lower again, every effect's onset rounded off and its top end softened, so they sit under the music. Picture
and music unchanged; v7 is kept as `export/cold-drinks-v7.mp4`.

v7: new music after the supplied reference sound: a soft sine pluck (fundamental plus octave, a 30ms
attack, a short decay) playing the same hypnotic three-note figure in F# (C#–E#–F#, turning through D# and G#), at
the reference's pace (one note every 0.22s). The picture is retimed onto that note grid, so every cut lands on a note:
each drink shot is 7 notes (two figures and a turn into the cut), the question holds 8 notes, and the montage cuts
every 2 notes. The bass is kept very low as in the reference; a light pad lifts the question; the piece lands on an
F# major chord under the final hold. Ice and typing effects are unchanged. Still 17.0s, ending on a steady frame. v6
(previous music) is kept as `export/cold-drinks-v6.mp4`.

v6: v5 with two changes. The question holds 0.2s longer (the montage and the demo follow 0.2s later). The reel ends at
17.0s on the held final frame (results and line) with the audio fading to silence. There is no fade to black, so the
jump back to the bright first frame when the reel loops can't flash. The demo is slightly tighter to fit: typing 1.7s,
results at 14.2s, the line at 14.8s and held to the end. v5 is kept as `export/cold-drinks-v5.mp4`.

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
  timing: the pluck arpeggio on its note grid (see v7 above) with a soft low note per cut; drink ASMR on the cuts (ice clinks, fizz, an ice cube as the question's words rise, ice cracking on the montage),
  then the phone rising, the tap, every keystroke on its frame, the send, the result tone and the line. Accents are
  quantised to the frame where the picture changes. −17 LUFS.
- Encode: `ffmpeg -framerate 24 -i <dir>/f_%04d.png -c:v libx264 -pix_fmt yuv420p -crf 17 -movflags +faststart`, then mux `export/cold-drinks-mix.wav`.
- Earlier cuts, sources kept beside them: v1 (`*-v1.*`, 13.6s), v2 (`*-v2.*`, 9.2s, hook first), v3 (`*-v3.*`, 17.4s,
  pre-motion-pass), v4 (`*-v4.*`, 17.9s, first motion pass), v5 (`*-v5.*`, 19.0s, faded to black), v6 (`*-v6.*`, 17.0s, orchestral bed) → `export/cold-drinks-v1.mp4` … `-v6.mp4`.

## Caption
أي واحد على ذوقك؟ 🧊
BrewMaps يختارلك مشروبك المفضل ويلقى لك كوفيك.
مجاني على الآب ستور وجوجل بلاي. الرابط في البايو.
