# لقيت كوفيي — doodle Reel

**v3 (current): `export/found-my-coffee-v3.mp4`, 11.3s.** Plate `plates/iced-hot.jpg` (AI-generated, unbranded): a hot
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

## Caption

> لما تلقى كوفيك… ☕️
>
> BrewMaps مجاني على الآب ستور وجوجل بلاي. الرابط في البايو.
>
> #BrewMaps #قهوة_مختصة #كوفيهات_الإمارات
