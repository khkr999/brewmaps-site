# CoffeeGuessr

A GeoGuessr-style Reel. Four real café photos from the app, three seconds each to guess the area.
Then the photo shrinks onto a map of the UAE and a pin drops at the café's real coordinates.
The end card asks for your score in the comments and shows the four answers.

`export/coffeeguessr-ep1.mp4`, 1080×1920, 30fps, 19.7s. Silent: add a track from Instagram's library
(a ticking or game-show sound suits the countdown).

## Why this format

GeoGuessr clips, where someone names a place from one image in seconds, became a large genre on
TikTok (see the Washington Post piece on Trevor Rainbolt). The pull is that viewers play along and
argue in the comments. For a map app the mechanic is native: the reveal *is* a map with a pin.

## Rounds (all from the café pages on brewmaps.app)

| # | Area | Café | Rating | Clue in the photo |
|---|---|---|---|---|
| 1 | Dubai Marina, Dubai | Arabian Cave Cafe "Letizia" dubai marina | 4.6 (200) | Marina canal and towers |
| 2 | Al Raha, Abu Dhabi | Frontyard | 4.7 (2,412) | Aldar HQ, the round building |
| 3 | Al Quoz, Dubai | RAW Coffee Company | 4.6 (2,701) | Mural warehouse, industrial street |
| 4 | Al Ain Oasis, Al Ain | Daily Press | 4.4 (5,106) | Palm grove and oasis walls |

Easy to hard, three emirates. `data.json` holds each café's name, rating, coordinates and source URL
exactly as the site lists them. Café names are shown as listed. The photos are the app's own, cropped
into the card, not edited. The dots on the map are every café on the site at its real coordinates
(465); the end card's "812" is the catalogue total used across all posts.

The UAE outline is from the public `datasets/geo-countries` GeoJSON, simplified (`uae.json`).

## Build

```
NODE_PATH=<playwright node_modules> node render.js <framesdir>
ffmpeg -framerate 30 -i <framesdir>/f_%04d.png -c:v libx264 -pix_fmt yuv420p -crf 18 -movflags +faststart export/coffeeguessr-ep1.mp4
```

Swap rounds by editing `data.json` (photo, area, emirate, café, rating, lat/lng, `focusY` for the crop).

## Caption

> CoffeeGuessr 🇦🇪
>
> Four real cafés from BrewMaps. Three seconds each. Name the area before the pin drops.
>
> How many did you get? Comment your score out of 4 👇
>
> BrewMaps is free on the App Store. Link in bio.
>
> #BrewMaps #CoffeeGuessr #GeoGuessr #DubaiCoffee #AbuDhabiCafes #UAECoffee #SpecialtyCoffee #DubaiCafes #AlAin

**Alt text:** A guessing game in four rounds. Each shows a café photo with a three-second countdown,
then a map of the UAE with a pin: Dubai Marina, Al Raha, Al Quoz and Al Ain Oasis. The end card reads
"How many did you get? Comment your score out of 4."

## Series

It repeats cleanly: new four photos, same frame. Harder editions (all Sharjah, all Abu Dhabi, "interiors only")
keep it fresh. Pin the best score comment.
