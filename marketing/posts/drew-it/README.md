# رسمته من خيالي… وطلع موجود (Sketch to Reality)

Built on the 2026 "Sketch to Reality" Reels trend (listed in Later's weekly Reels trends): a hand-drawn
sketch appears on screen and becomes the real thing. Here each sketch is a café that "turns out to exist",
found on BrewMaps, and the last sketch is the BrewMaps mark becoming the real logo.

`export/drew-it-ar.mp4` (Khaleeji) and `export/drew-it-en.mp4`, 1080×1920, 30fps, 12.4s.

## Beats

| Time | Arabic | What you see |
|---|---|---|
| 0.0 | رسمته من خيالي… ✏️ | Frame one: Sibul's storefront already half-drawn in cream lines on night green |
| 1.45 | …وطلع في الكرامة 😳 | Reality wipes up: the real photo, full frame. Sibul Cafe · ★ ٥٫٠ · دبي |
| 3.0 | وهذا بعد… ✏️ | The round building sketches itself → Al Raha. Frontyard · ★ ٤٫٧ · أبوظبي |
| 6.0 | وهذا؟ ✏️ | A tall-straw iced latte → Al Bateen. 1918 Cafe · ★ ٤٫٦ · أبوظبي |
| 9.0 | وآخر وحدة… ✏️ | The cup-and-pin mark is sketched, then becomes the real logo |
| 10.5 | أي كوفي في بالك… على BrewMaps. | أكثر من ٨١٢ كوفي في كل أنحاء الإمارات |

## How the sketches are made

`prep.py` frames each app photo at 1080×1920, finds its edges (OpenCV: bilateral blur, Canny, contours),
simplifies them into polylines, and writes `strokes.json`. `drew.js` draws those strokes in turn with a
slight line boil, then wipes the same photo up underneath, so the drawing lands exactly on the real
place. The "from my imagination" line is the joke: the sketches are traced from the real photos.

Photos, names, ratings and areas are from the café pages (sources in `data.json`). Photos are not edited.

## Captions

**Arabic**

> رسمته من خيالي… وطلع موجود 😳✏️
>
> أي كوفي في بالك، لقيناه لك. أكثر من ٨١٢ كوفي في كل أنحاء الإمارات على BrewMaps.
>
> ارسم لنا كوفيك بالإيموجي في الكومنتات 👇
>
> BrewMaps مجاني على الآب ستور وجوجل بلاي. الرابط في البايو.
>
> #BrewMaps #SketchToReality #كوفيهات_دبي #كوفيهات_أبوظبي #قهوة_مختصة #الإمارات

**English**

> I drew it from my imagination… it's real 😳✏️
>
> Whatever café is in your head, it's on BrewMaps. 812 cafés across the UAE.
>
> Draw us your dream café in emojis 👇
>
> BrewMaps is free on the App Store and Google Play. Link in bio.
>
> #BrewMaps #SketchToReality #DubaiCafes #AbuDhabiCafes #SpecialtyCoffee #UAECoffee

## Build

```
pip install opencv-python-headless && python3 prep.py
NODE_PATH=<playwright node_modules> node render.js <framesdir> all ar   # or: all en
ffmpeg -framerate 30 -i <framesdir>/f_%04d.png -c:v libx264 -pix_fmt yuv420p -crf 18 -movflags +faststart export/drew-it-ar.mp4
```

New cafés: add a photo to `SHOTS` in `prep.py` (tune blur and Canny thresholds per photo) and a row in `data.json`.
