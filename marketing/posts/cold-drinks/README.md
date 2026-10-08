# على ذوقك · Cold drinks — `export/cold-drinks.mp4`, 17.9s, 9:16, with sound

v4: the v3 cut with its motion rebuilt. Same concept, drinks, copy, colours and structure; every entrance, exit and
transition now shares one motion language, and the audio accents land on the visual arrivals.

**The motion system** (`player.html`): a cubic ease-out for entrances (fast start, long soft settle), a quintic
ease-in-out for exits and dissolves, a 2% overshoot only where something physically lands (the phone). Travel 18–28px,
0.45–0.6s. Every exit starts before the cut, so elements hand off instead of being cut off. The push-in carries across
cuts (each shot starts where the last left off) and each cut dissolves over 4 frames.

| Time | What | Motion |
|---|---|---|
| 0.0–7.75 | Five drinks, 1.55s each, names centred | Name: in over 0.45s (up 18px), hold, out over 0.3s ending at the cut. Picture: 4-frame dissolve, push carried over. |
| 7.75–9.3 | The question | The last name eases out, the karkadeh settles into the green over 0.6s, **أي واحد على ذوقك؟** arrives at 8.1–8.7 (up 28px, scale 96→100%), holds, lifts out before the bridge. The musical lift and the ice cube land on its arrival (8.3s). |
| 9.3–10.85 | The bridge | In from the green; four crops dissolving into each other; the lockup and line ease in over 0.45s and out before the phone. |
| 10.85–16.66 | The product | The phone rises 140px over 0.8s with a 2% settle; the query types; results and rows slide in on the same ease-out, staggered 0.12s. The message eases up and in. |
| 16.66–17.86 | The resolve | The message lifts away, the phone sinks back 90px as the chord resolves to the plain triad, the green goes to black. No card, no cutoff. |

- Plates: AI-generated macro photographs (`plates/*.png` → `plates/*.jpg` at 1080×1920). No glass, rim, café or brand.
  The map inside the phone is the real app map crop (`../coffee-routine-update/img/appmap.png`).
- `timing.js` holds the cut times and copy; `render.js` writes 24 fps PNGs; `sound.py` builds the mix from the same
  timing: the calm celesta-and-strings bed with a chord on every cut, a soft pizzicato pulse on the beat grid and a
  bass note per cut; drink ASMR on the cuts (ice clinks, fizz, an ice cube dropped into a glass as the question lands
  and as the phone rises, ice cracking on the bridge, ice settling under the phone, typing ticks, the result tone). −17 LUFS.
- Encode: `ffmpeg -framerate 24 -i <dir>/f_%04d.png -c:v libx264 -pix_fmt yuv420p -crf 17 -movflags +faststart`, then mux `export/cold-drinks-mix.wav`.
- Earlier cuts, sources kept beside them: v1 (`*-v1.*`, 13.6s), v2 (`*-v2.*`, 9.2s, hook first), v3 (`*-v3.*`, 17.4s,
  same structure as this, pre-motion-pass) → `export/cold-drinks-v1.mp4`, `-v2.mp4`, `-v3.mp4`.

## Caption
أي واحد على ذوقك؟ 🧊
BrewMaps يختارلك مشروبك المفضل ويلقى لك كوفيك.
مجاني على الآب ستور وجوجل بلاي. الرابط في البايو.
