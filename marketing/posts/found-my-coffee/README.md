# على ذوقك — a doodle series (BrewMaps)

**The idea:** BrewMaps doesn't only find cafés, it knows your taste. Said sideways: every episode puts two drinks from the
*same café* side by side, BrewMaps scores each one for him (drink name + "٪ على ذوقك"), and he goes for his match.
**The series signature is the way in:** every episode he gets into his drink differently.

| Ep | Drinks (rejected → match) | The way in |
|---|---|---|
| **1 · Ladder** (done) | hot cappuccino ٢٤٪ → iced latte ٩٢٪ | sad walk off, then props a tiny ladder against the glass, climbs, hops in |
| 2 · Springboard (built as an alt cut of ep. 1, re-shoot with new drinks) | V60 → Spanish latte | climbs the rejected cup and leaps off its rim |
| 3 · Pole vault | espresso → matcha | vaults over the rim on a stirrer |
| 4 · Sugar stairs | flat white → cortado | stacks sugar cubes into steps |
| 5 · Spoon slide | cold brew → iced mocha | slides down a spoon resting on the rim |

Lines (every episode): **نفس الكوفي، مشروبين… / واحد بس على ذوقك.** End card: **مو بس وين تروح… / وش تشرب.**

## Ep. 1 · Ladder + flag — `export/ep1-ladder-flag.mp4`, 19s, with sound

Plate `plates/iced-hot-v2.jpg`: the AI-generated, unbranded `plates/iced-hot.jpg` graded by `enhance.py` so the drinks look
delicious (richer crema and swirl, sheen, condensation on the glass). Soft animated steam rises off the cappuccino.
`reel.js`. Script: `SCRIPT.md` / `export/ep1-ladder-script.docx`. Badges: 24% light green, 92% dark green.
At the top of the ladder he pulls the BrewMaps flag (same forest green + real mark as The Regular) out of his pocket,
it snaps open above him, and he plants it on the glass rim before hopping in. Later he pushes the ladder over with his
foot and floats on his back in the latte like it's a pool. The flag stays on his drink.
Sound: `sound.py` (mix `export/ep1-ladder-flag-mix.wav`, −17.3 LUFS, −1.2 dBFS peak). Every cue time comes from
`events.js`, which reads the animation (it draws on twos), so the mix follows any timing change. The score is composed in
MIDI and rendered with the FluidR3 GM soundfont (fluidsynth); the SFX are synthesised. Cue sheet: `SOUND-DESIGN.md`.
Earlier cuts: `reel-ladder-flag-v1.js` (flag rolled on the ladder, 18.5s); `reel-ladder-v2.js` (no flag, 16.6s) →
`export/ep1-ladder.mp4` (silent) / `export/ep1-ladder-sound.mp4`.

| Time | Beat |
|---|---|
| 0–1.6s | Walks in carrying a small green pouch in one hand. |
| 1.7–3.3s | **كابتشينو · ٢٤٪ على ذوقك** (light green). Sad: worried brow, frown; a cartoon head-turn "no". |
| 3.35–5.75s | The sad walk: one hand in his pocket, the pouch drooping in the other, slumped, head down. |
| 5.85–7.2s | **آيس لاتيه · ٩٢٪ على ذوقك** (dark green). Head up, grin, hop. |
| 7.2–8.45s | Sets the pouch down, opens the flap, pulls out a folded ladder, plants it on the glass; it extends to the rim. |
| 8.45–9.6s | Climbs it, rung by rung. |
| 9.6–10.28s | At the top: a flag out of his pocket, up, snaps open, planted on the rim. |
| 10.4–11.0s | Hops in; splash; surfaces. |
| 11.35–12.7s | Sits up, knees over the rim; pushes the ladder with his foot, it tips over and clatters onto the counter. |
| 12.58–16.1s | Slides back in and floats like it's a pool, the flag beside him. **نفس الكوفي، مشروبين… واحد بس على ذوقك.** (held ~3s) |
| 16.1–19.0s | End card (held ~2.3s): mark / **مو بس وين تروح… وش تشرب.** |

Alt cut, springboard entry: `export/ep1-springboard.mp4` (`reel-springboard.js`), held for ep. 2.

---

## Earlier cuts
**v3: `export/found-my-coffee-v3.mp4` (`reel-v3.js`), 11.3s.** Plate `plates/iced-hot.jpg` (AI-generated, unbranded): a hot
cappuccino (right) and an iced latte in a short glass (left). He checks the hot one first (٢٤٪), then the iced one (٩٢٪), and
cannonballs into the ice; the glass shows him faintly, the milk hides what's under it. `reel.js`.

v2 (two identical cups): `export/found-my-coffee-v2.mp4`, `reel-v2.js`, plate `plates/two-cups.jpg`. Same beats:

| Time | Beat |
|---|---|
| 0–1.6s | Walks in from the right to the first cup. |
| 1.6–3.4s | Checks BrewMaps: **يناسب ذوقك ٢٤٪** (grey). "Meh" mouth, shakes his head. |
| 3.4–5.0s | Walks to the other cup. |
| 5.0–6.6s | Checks again: **يناسب ذوقك ٩٢٪** (green). Wide eyes, grin, a little hop. |
| 6.55–7.4s | Crouches, then a tucked cannonball: straight up, high over the rim, down into the coffee (the rim hides him as he sinks). |
| 7.4–8.0s | Splash: drops and two ripples. A beat under, then he surfaces into the lounge. |
| 8.0–9.3s | Legs flop over the rim one by one; lounges, eyes closed. Super: **لما تلقى الكوفي اللي يناسبك…** |
| 9.3–11.3s | End card: mark / **BrewMaps يلقى لك الكوفي اللي يناسبك.** / مجاني على الآب ستور وجوجل بلاي |

Face: bigger eye, no ear mark, closed eyes as a shallow curve, head kept upright while lounging.

---

## v1 (9s, single cup): `export/found-my-coffee.mp4`, `reel-v1.js`, plate `plates/cup.jpg`

`export/found-my-coffee.mp4`, 1080×1920, 24fps. The Regular's character (`../the-regular/rig.js`) lounging in a cup,
after a Pinterest reference (doodle draped over a cup). Brand post: the plate is AI-generated (Figma AI) and unbranded.

| Time | Beat |
|---|---|
| 0–2s | He lounges in the cup: legs over the left rim, feet swinging, arm over the right rim, eyes closed. Slow push-in. |
| 2–4.5s | Super: **لما تلقى الكوفي اللي يناسبك…** He sighs ("o" mouth) and three wisps of steam rise. |
| 4.5–7s | Eyes still closed, he lifts a tiny phone with the BrewMaps mark; **يناسب ذوقك ٩٢٪** pops beside it. |
| 7–9s | End card: mark / **BrewMaps يلقى لك الكوفي اللي يناسبك.** / مجاني على الآب ستور وجوجل بلاي |

Rebuild: `NODE_PATH=<playwright node_modules> node render.js <dir>` then
`ffmpeg -framerate 24 -i <dir>/f_%04d.png -c:v libx264 -pix_fmt yuv420p -crf 18 -movflags +faststart export/found-my-coffee.mp4`.
"٩٢٪" is illustrative.

## Caption (ep. 1)

> نفس الكوفي… بس مو نفس الذوق ☕️
>
> BrewMaps مجاني على الآب ستور وجوجل بلاي. الرابط في البايو.
>
> #BrewMaps #قهوة_مختصة #كوفيهات_الإمارات
