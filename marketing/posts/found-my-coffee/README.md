# على ذوقك — a doodle series (BrewMaps)

**The idea:** BrewMaps doesn't only find cafés, it knows your taste. Said sideways: every episode puts two drinks from the
*same café* side by side, BrewMaps scores each one for him (drink name + "٪ على ذوقك"), and he goes for his match.
**The series signature is the way in:** every episode he gets into his drink differently.

| Ep | Drinks (rejected → match) | The way in |
|---|---|---|
| **1 · Springboard** (done) | hot cappuccino ٢٤٪ → iced latte ٩٢٪ | climbs the rejected cup and leaps off its rim |
| 2 · Ladder | V60 → Spanish latte | props a tiny ladder against the glass, climbs, steps in |
| 3 · Pole vault | espresso → matcha | vaults over the rim on a stirrer |
| 4 · Sugar stairs | flat white → cortado | stacks sugar cubes into steps |
| 5 · Spoon slide | cold brew → iced mocha | slides down a spoon resting on the rim |

Lines (every episode): **نفس الكوفي، مشروبين… / واحد بس على ذوقك.** End card: **مو بس وين تروح… / وش تشرب.**

## Ep. 1 · Springboard — `export/ep1-springboard.mp4`, 11.3s

Plate `plates/iced-hot.jpg` (AI-generated, unbranded). `reel.js`.

| Time | Beat |
|---|---|
| 0–1.7s | Walks in, stops beside the hot cappuccino. |
| 1.8–3.35s | BrewMaps: **كابتشينو · ٢٤٪ على ذوقك** (grey). Frown and annoyed brow, shakes his head left-right ("no"). |
| 3.4–4.35s | Hops up, grabs the rim, pulls himself onto the hot cup. |
| 4.5–6.0s | On the rim he checks the other drink: **آيس لاتيه · ٩٢٪ على ذوقك** (green). Grin, little hop. |
| 6.0–7.05s | Crouches and springs off the rim: a long tucked leap across into the iced latte. |
| 7.05–7.66s | Splash, a beat under, then he surfaces. |
| 7.66–9.3s | Sits up on the ice, knees over the rim, feet dangling. **نفس الكوفي، مشروبين… واحد بس على ذوقك.** |
| 9.3–11.3s | End card: mark / **مو بس وين تروح… وش تشرب.** / مجاني على الآب ستور وجوجل بلاي |

Percentages are illustrative.

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
