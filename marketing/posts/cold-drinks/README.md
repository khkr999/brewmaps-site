# على ذوقك · Cold drinks — `export/cold-drinks.mp4`, 16.3s, 9:16, with sound (v20)

v20: every sound effect at 95% of its v19 level (`SFX_LEVEL` in `sound.py`). The overall gain is fixed to v19's so the music
doesn't move. v19 is kept as `export/cold-drinks-v19.mp4`.

v19: the woosh only on the four drink changes and into the question. The montage (from about 0:08) has no woosh,
only a light ice knock on each quick cut. v18 is kept as `export/cold-drinks-v18.mp4`.

v18: the drink switch is the supplied air woosh (`sfx/air-woosh.wav`). It rises into its loudest moment on the cut frame,
with the ice knock landing on the cut, on every drink change, into the question and as the first montage crop surfaces.
The quick montage cuts get a short cut of it. The splash is gone. Picture as v17; v17 is kept as
`export/cold-drinks-v17.mp4`.

v17: the search-bar typing uses the supplied simple click (`sfx/simple-click.wav`), the same click on every character,
on the frame the character appears (27 for 27, within 2ms), same level as before. Everything else as v16, which is kept
as `export/cold-drinks-v16.mp4`.

v16: v15 with the ripple switch removed. The drinks cut hard on the note again, as in v14, with the splash on each cut. Four
drinks, Spanish latte label and the louder ice are kept. v15 (with the ripple) is kept as `export/cold-drinks-v15.mp4`
and `player-v15.html`.

v15: four drinks (lemonade removed): سبانيش لاتيه (the first clip, relabelled), ماتشا لاتيه, كولد برو, كركديه مثلج.
Each drink switch is now a transition: the next drink opens out of the last one from the centre like an ice cube
dropped in. A soft ring grows fast then slows, the image refracts slightly at the ring, and both clips keep playing
(0.33s, WebGL, starting on the cut frame together with the splash, which is measured at 0ms). The montage keeps its
hard cuts. The ice sounds are about 3 dB louder (the knock in the switch sound and the ice bed). The music drops one
opening phrase so every cut is still on a note. v14 is kept as `export/cold-drinks-v14.mp4`.

v14: the drinks are real moving footage, from the drink video the client supplied (their call to use it; client
confirmed they want it used). `prep_clips.py` takes that video and, for each of its six shots, inpaints out the
burned-in drink name, crops 3:4 to 9:16, upscales to 1080×1920 and retimes to 24 fps with frame blending (about 0.84×;
the karkadeh 0.61× since it also carries the dissolve into the green). The lineup follows the footage: آيس لاتيه,
ماتشا لاتيه, كولد برو, ليموناضة (in place of Spanish latte, which the footage doesn't have), كركديه مثلج. The montage
uses later moments of the same clips. Camera locked, hard cuts on the note, as in the reference. Timing and sound as
v13 (switch sounds frame-exact). Frames are generated into `clips/<key>/` (ignored by git); `clips/*.mp4` are
previews. v13 is kept as `export/cold-drinks-v13.mp4`.

v13: an audible drink-switch sound. A splash from the pour recording (one clean attack) layered with the ice knock,
like a cube dropped into the next drink. The same sound plays on every drink switch, into the question and on the
first montage crop, with a shorter, lighter version on the quick montage cuts. Every attack is on its cut frame
(measured 0ms). It is clearly heard but peaks no higher than the music. Picture as v12; v12 is kept as
`export/cold-drinks-v12.mp4`.

v12: the v11 warp is removed. It moved the whole photo and could not look like real ice. The drink shots now hold
still on a locked camera and cut hard on the note, as in the reference, until the moving footage in
`FOOTAGE.md` replaces them. Sound: one clean ice-in-water knock on every drink switch with its attack on the cut
frame, measured at 0ms. Lighter knocks on the montage cuts, also at 0ms. Nothing starts before a cut: the pour now
starts on the cut into the question. The ice bed is evened out so no stray knocks sound between cuts. The coffee fizz
sits under the question only. Typing: one click per character on the exact frame it appears (27 for 27, all within
4ms). There are no tap or send clicks, and nothing after the last character. Ending: typing 2.0s, results and line
later, held longer. 17.8s (opening unchanged). v11 is kept as `export/cold-drinks-v11.mp4`.

v11: the ice moves, on screen and in the sound. Every drink photo is drawn through a slow, flowing WebGL displacement
(large smooth noise cells, so a cube shifts and bobs as one piece while the drink swirls round it; about 10–20px/s; one
clock for the whole reel so the motion never resets at a cut). A continuous take of ice moving in water runs under the
whole reel, lower under the phone. The supplied clicks (`sfx/`) are on the phone: a soft click on the tap into the
field, the press and release halves of the two mouse clicks rotating as keystrokes, the press-and-release click on send.
v10 is kept as `export/cold-drinks-v10.mp4`.

v10: the drink sounds are now the two supplied recordings in `sfx/` (ice moving in water; coffee poured over ice,
fizzy). A short ice-in-water knock on each cut over a quiet bed of ice moving in water; the pour as the karkadeh pulls
into the green, its fullest moment on the question's words, its fizz under the montage; lighter knocks on the montage
cuts and two faint ones in the demo. Kept low; the pour's splashes are softened. v9 is kept as `export/cold-drinks-v9.mp4`.

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
