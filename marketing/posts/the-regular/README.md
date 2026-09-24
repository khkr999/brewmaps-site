# The Regular

A recurring Reel series. A small white line-drawn character has one tiny adventure on a real
drink at a real BrewMaps café. There's no text until the end card, so one cut works for Arabic and English.

Ep. 1 (International Coffee Day, 1 Oct), 14.5s:

| Time | Beat |
|---|---|
| 0.0–1.5 | Walks in with a paper map, turns it upside down. A "?" appears. |
| 1.5–1.9 | Gives up and throws the map over his shoulder. |
| 1.9–3.75 | Pulls out a door-sized phone with the **real BrewMaps app** (Browse by area) and scrolls. The drink is right beside him. |
| 3.75–4.5 | Looks up. It was right there. |
| 4.5–6.5 | Jumps, grabs the straw, hauls himself onto the rim, wobbles. |
| 6.5–7.4 | Raises a forest-green flag with the **BrewMaps cup-and-pin mark**, like at a summit, and plants it. |
| 7.4–9.5 | Cannonballs in. Splash, ripples, a beat of nothing, then he pops up. |
| 9.5–12.0 | Floats and waves. |
| 12.0–14.5 | End card: mark / "Found it." / "812 cafés across the UAE, on BrewMaps." / the real app on a phone, with him sitting on top of it and waving. |

There's no café name. The glass is the star.

## Brand rules applied

- Lines are cream `#F4EFE6`, not pure white. The only fill colour is forest green `#2B4D1F` on the flag.
- The flag carries `assets/logos/mark-cream.png` and the end card uses the same mark.
- End card: night green veil, DM Sans, and the headline's full stop in pale green `#9BC48A`.
- The app screen is `assets/screenshots/browse-dubai.png`, cropped (`SHOT_TOP = 540`) and never edited.
  The crop starts below the browse header so its subset count never appears next to "812".

## Caption

> He had a map. Then he had BrewMaps. ☕️
>
> Where should he go next? Comment an area 👇
>
> BrewMaps is free on the App Store. Link in bio.

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

- `plates/standin.png` is a stand-in taken from a reference Reel so the motion could be tested.
  It is **not ours** and is gitignored along with the test render. **Never post it.**
- The real plate still needs to be one of these:
  1. The app's café photos in Supabase storage (`cafe-photos/<place_id>/0.jpg`). This session's network policy blocks that host.
  2. A generated glass shot. The connected Pika account has 0 credits.
  3. One phone photo of an iced coffee in a glass, straw in, clear table to one side.
- Once a plate lands, add its `SCENES` entry and re-render. Nothing else changes.
