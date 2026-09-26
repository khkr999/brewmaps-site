# قهوتك تقول عنك (your coffee order says a lot)

Five drinks, each with an affectionate one-line roast in Gulf dialect and one real number: how many cafés
on BrewMaps list that drink. Built the way the Arabic price ad (best CPI so far) is built: one idea, huge
type, one card per beat, fast cuts, and an install ending.

`export/your-order-ar.mp4` (Khaleeji) and `export/your-order-en.mp4`, 1080×1920, 30fps, 13.7s.

## Cards

| Drink | Roast | On BrewMaps |
|---|---|---|
| سبانش لاتيه | يقول ما يحب الحلو… وطلبه كله حليب مكثف 😭 | ١٩٩ كوفي |
| V60 | يشرح لك الـ tasting notes… وأنت ما سألت 🤓 | ١٣٥ كوفي |
| ماتشا | عنده tote bag… وقرار حياة جديد كل أسبوع 🍵 | ١٨٥ كوفي |
| آيس أمريكانو | دوام. إيميلات. لا تكلمه 🧊 | ٩١ كوفي |
| كرك | أصلي. ما يحتاج شرح 🫡 | ١٧ كوفي بس 👀 |

End card: مهما كان طلبك… تلقاه على BrewMaps. / أكثر من ٨١٢ كوفي في كل أنحاء الإمارات / **حمّل BrewMaps**

**Counts:** cafés whose menu on brewmaps.app lists the drink by name (389 cafés list a menu), checked
26 Sep 2026. "V60" matches V60/V-60; "iced americano" counts only menus that name it.

## Captions

**Arabic**

> قهوتك تقول عنك 👀 (لا تزعل)
>
> منشن اللي يشبه طلبه 👇
>
> ومهما كان طلبك، تلقاه على BrewMaps. أكثر من ٨١٢ كوفي في كل أنحاء الإمارات.
>
> BrewMaps مجاني على الآب ستور وجوجل بلاي. الرابط في البايو.
>
> #BrewMaps #قهوة_مختصة #سبانش_لاتيه #ماتشا #كرك #كوفيهات_دبي #الإمارات

**English**

> Your coffee order says a lot 👀 (no offence)
>
> Tag the one whose order this is 👇
>
> Whatever you order, find it on BrewMaps. 812 cafés across the UAE.
>
> BrewMaps is free on the App Store and Google Play. Link in bio.

## Build

```
NODE_PATH=<playwright node_modules> node render.js <framesdir> all ar   # or: all en
ffmpeg -framerate 30 -i <framesdir>/f_%04d.png -c:v libx264 -pix_fmt yuv420p -crf 18 -movflags +faststart export/your-order-ar.mp4
```
