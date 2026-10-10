# لا تقول لأحد 🤫 (don't tell anyone)

A secret list, typed live into a notes page. Each café gets a name, 📍 area, its photo pasted in,
and its real latte price with a comment. Then comes the punchline: the note gets shared with every
group chat, and the screen reads "…خلاص انتشر 😅". The full list is on BrewMaps.

Reverse psychology does the distribution: telling people not to share is what makes them share.

`export/dont-tell-anyone-ar.mp4` (Khaleeji) and `export/dont-tell-anyone-en.mp4`, 1080×1920, 30fps, 16.4s.

## Beats

| Time | What happens |
|---|---|
| 0.0 | On frame one (the thumbnail): **كوفيهات سرية 🤫 / لا تقول لأحد** with a blinking cursor |
| 0.5–10.0 | Four entries type themselves out, faster each time: 1️⃣ name, 📍 area, photo pops in, price line, aside |
| ~9.5 | **متوسط اللاتيه بالإمارات ٢٣… لا تشكرني 😌** (the price comparison, in voice) |
| 10.2 | Tap on share. The sheet opens; الشباب، البنات، العائلة، الدوام، القروب all get ticked |
| 12.5 | **…خلاص انتشر 😅** |
| 13.8–16.4 | Night green: logo, **القائمة كاملة على BrewMaps.** / أكثر من ٨١٢ كوفي في كل أنحاء الإمارات |

## Data

Same four cafés as `hidden-under-20` (verified on the café pages, 26 Sep 2026): Sibul Cafe (Al Karama,
5.0, 38 reviews, Latte AED 16), Special Stage Specialty Coffee (Al Muroor, 4.8, 64, Cafe Latte AED 15),
Bebax Coffee (Ajman, 5.0, 112, Latte AED 16.5), Oomi Specialty Coffee (Dubai Internet City, 4.8, 147,
Latte AED 18). Median hot latte across 206 cafés: AED 23. Every number is read from `data.json`;
café names are typed exactly as listed.

## Notes on the build

- The notes page is a generic one in brand colours: paper, ink, and a **forest green cursor**. It is not
  a copy of Apple Notes. The share sheet uses group-chat labels, not real people.
- The list uses keycaps (1️⃣ 2️⃣) because the Arabic digit ١ reads as the letter ا at the start of a line.
- `player.html` renders a few warm-up frames first so fonts and emoji settle before frame one.

## Captions

**Arabic**

> كوفيهات سرية 🤫 لا تقول لأحد…
>
> (ما نضمن ما ننشرها 😅)
>
> القائمة كاملة، وأكثر من ٨١٢ كوفي، على BrewMaps.
>
> BrewMaps مجاني على الآب ستور وجوجل بلاي. الرابط في البايو.
>
> #BrewMaps #كوفيهات_دبي #قهوة_مختصة #كوفيهات_أبوظبي #عجمان #الإمارات

**English**

> secret cafés 🤫 don't tell anyone…
>
> (we make no promises 😅)
>
> The full list, and 812 cafés, on BrewMaps.
>
> BrewMaps is free on the App Store and Google Play. Link in bio.
>
> #BrewMaps #HiddenGems #DubaiCafes #AbuDhabiCafes #SpecialtyCoffee #UAECoffee

## Build

```
NODE_PATH=<playwright node_modules> node render.js <framesdir> all ar   # or: all en
ffmpeg -framerate 30 -i <framesdir>/f_%04d.png -c:v libx264 -pix_fmt yuv420p -crf 18 -movflags +faststart export/dont-tell-anyone-ar.mp4
```
