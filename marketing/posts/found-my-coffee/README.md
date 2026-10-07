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

## Ep. 1 · Ladder + flag + the flop — `export/ep1-ladder-flag.mp4`, 15.2s, with sound

search → effort → find → FLOP BACK → complete peace. The first half is quick (the 24%, a sad walk, the 92%, the ladder,
the climb, the BrewMaps flag out of his pocket and planted on the rim). Then a satisfied glance, he turns his back to the
drink and flops backward into it (his feet knock the ladder away). On the splash the frame turns clean (ladder, pouch and
flag gone) and he floats on the iced latte like it's a pool, after the pool-float reference: head fallen back, face to
the sky, eyes closed, arms dropped out past both sides of the cup with open hands, one leg straight and one slightly
bent under the surface. One fixed pose; only the whole body drifts 1–2 px. The camera eases in on him; the line
comes only after the joke lands (small setup, one big statement on a soft scrim); then the scene washes into BrewMaps
green with him still faintly there, and the end line + Brew Maps lockup come in.

- `reel.js`: the scene. The float is its own drawing (`drawFloater`, `POSE`/`FL`: same line style, seen from above like
  the reference; below the coffee line it shows faintly through the glass). Green is kept for BrewMaps things only (phone, badges, flag); the pouch is white line art.
- Plate `plates/iced-hot-v2.jpg` (graded by `enhance.py` from the AI-generated, unbranded `plates/iced-hot.jpg`) + animated steam.
- Sound: `sound.py` → `export/ep1-ladder-flag-mix.wav` (−17.6 LUFS, −1.2 dBFS peak). Cue times come from `events.js`,
  which reads the animation (it draws on twos). Busy, bright pizzicato through the effort; a brand fanfare as the flag
  goes in; silence while he falls; the splash; then a slow, sparse "peace" chord. Cue sheet: `SOUND-DESIGN.md`.
- Script: `SCRIPT.md` / `export/ep1-ladder-script.docx`.
- Earlier cuts: `reel-ladder-flag-v3.js` (pool-edge lean, 19s), `reel-ladder-flag-v2.js` (floating asleep),
  `reel-ladder-flag-v1.js` (flag rolled on the ladder), `reel-ladder-v2.js` (no flag) → `export/ep1-ladder.mp4` / `-sound.mp4`.

| Time | Beat |
|---|---|
| 0–1.05s | Walks in, quick, pouch in hand. |
| 1.1–2.45s | **كابتشينو · ٢٤٪ على ذوقك** (light green). A quick "no". |
| 2.45–3.95s | The sad walk. |
| 4.0–4.8s | **آيس لاتيه · ٩٢٪ على ذوقك** (dark green). Hop. |
| 5.0–6.62s | Pouch, ladder, three clicks, a fast climb. |
| 6.62–7.08s | The BrewMaps flag out of his pocket, open, planted on the rim. |
| 7.14–7.68s | A satisfied glance; he flops backward into the drink, knocking the ladder away. |
| 7.68–8.0s | Splash: the frame turns clean; he floats on the latte like a pool. |
| 8.25–11.9s | Almost motionless. **نفس الكوفي، مشروبين… / واحد بس على ذوقك.** |
| 11.9–15.2s | Washes into green, he stays faintly: **مو بس وين تروح… وش تشرب.** + Brew Maps lockup. |

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
