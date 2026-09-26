# The Regular

A recurring Reel series. A small white line-drawn character has one tiny adventure on a real
drink at a real BrewMaps café. There's no text until the end card, so one cut works for Arabic and English.

Ep. 1 (International Coffee Day, 1 Oct), 14.8s, `export/the-regular-ep1.mp4`.
Plate: the iced latte from **1918 Cafe, Al Bateen**, as listed in the app (`plates/1918-cafe.jpg`,
cropped from the app's own photo and not otherwise edited). The café isn't named in the video; the glass carries it.

| Time | Beat |
|---|---|
| 0.0–1.5 | Walks in along the table with a paper map, flips it upside down. A "?" appears. |
| 1.5–1.9 | Gives up and throws the map over his shoulder. |
| 1.9–3.75 | Pulls out a door-sized phone with the **real BrewMaps app** and scrolls it with his thumb: Sharjah, then Dubai. |
| 3.75–4.5 | Looks up. The latte was right there. |
| 4.5–5.85 | Walks to the glass, crouches, leaps, grabs the straw, dangles. |
| 5.85–7.4 | Three pulls up the straw. |
| 7.4–8.5 | At the top he plants the **BrewMaps flag** on the straw's tip, cheers, then looks down at the drink. |
| 8.5–9.9 | Lets go. Cannonball into the latte. Splash, then nothing for a beat. |
| 9.9–12.3 | Pops up with his arms over the rim and waves. |
| 12.3–14.8 | End card: mark / "Found it." / "812 cafés across the UAE, on BrewMaps." / the real app scrolling on a phone, with him sitting on top waving. |

## Brand rules applied

- Lines are cream `#F4EFE6`, not pure white. The only fill colour is forest green `#2B4D1F` on the flag.
- The flag carries `assets/logos/mark-cream.png` and the end card uses the same mark.
- End card: night green veil, DM Sans, and the headline's full stop in pale green `#9BC48A`.
- The phone shows `assets/derived/browse-scroll.png`, made from the Sharjah and Dubai Browse screenshots
  joined where they overlap pixel for pixel, so the scroll is the app's own page moving. It starts below
  the header, so the "413 cafés" subset count never appears next to "812". The floating tab bar
  (`browse-tabbar.png`) stays fixed at the bottom, as it does in the app.

## Caption

Posts on International Coffee Day (1 Oct). The ask is a tag, not "where should he go next?",
because this runs as a one-off for now rather than a series.

**Arabic (Khaleeji)**

> كان معاه خريطة… بعدين نزّل BrewMaps ☕️
>
> منشن الخوي اللي يتسلق شفاطة عشان كوب قهوة 👇
>
> يوم القهوة العالمي سعيد 🤎
>
> BrewMaps مجاني على الآب ستور وجوجل بلاي. الرابط في البايو.
>
> #BrewMaps #يوم_القهوة_العالمي #قهوة_مختصة #كوفيهات_أبوظبي #كوفيهات_دبي #الإمارات

**English**

> He had a map. Then he had BrewMaps. ☕️
>
> Tag someone who'd climb a straw for a good coffee 👇
>
> Happy International Coffee Day.
>
> BrewMaps is free on the App Store and Google Play. Link in bio.
>
> #BrewMaps #InternationalCoffeeDay #SpecialtyCoffee #AbuDhabiCafes #DubaiCafes #UAECoffee

## How it's built

- `rig.js` holds the character, the props, the ep. 1 choreography, and the scene anchors for each plate.
  The character is IK-posed and drawn as outline-then-erase shapes, so it reads as a solid figure.
  Drawings change 12×/s ("on twos") and each one re-jitters its lines slightly (line boil).
- `player.html` draws a frame onto a canvas. `render.js` writes 24fps PNGs:
  `NODE_PATH=<playwright node_modules> node render.js <scene> <outdir>`
- Encode: `ffmpeg -framerate 24 -i <outdir>/f_%04d.png -c:v libx264 -pix_fmt yuv420p -crf 18 -movflags +faststart export/<name>.mp4`

## Adding a café photo

1. Put the photo in `plates/` at 1080×1920 (crop, never stretch).
2. Add an entry to `SCENES` in `rig.js`: the ground line, straw tip and direction, liquid ellipse,
   where he stands on the rim, where the pin goes, the entry and float points, and walk-in/stop x.
3. Render a few stills with `node render.js <scene> <dir> 0.9,2.2,5.0,5.45,7.1,9.3` and check the anchors.

Ep. 1's choreography needs an iced drink with a straw and clear table to one side.
A hot cup needs a different routine (e.g. skating on the latte art).

## Status

- Ep. 1 is built on the real plate and ready to review.
- He's drawn at 0.62 scale on this photo (`scale` in the scene) so he fits the glass. Lines stay about 5px.
- `plates/standin.png` (the reference Reel's photo) remains only as a gitignored test plate. Never post it.
- The photo comes from the café's listing (Google Places). If you want to be safe, tag the café in the post
  or give them a heads-up. It doubles as the Collab invite.
