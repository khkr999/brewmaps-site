# لقيت كوفيي — doodle Reel, 9s

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
