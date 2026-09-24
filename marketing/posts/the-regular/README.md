# The Regular

A recurring Reel series. A small white line-drawn character has one tiny adventure on a real
drink at a real BrewMaps café. There's no text until the end card, so one cut works for Arabic and English.

Ep. 1 (International Coffee Day, 1 Oct):
he walks in reading a paper map, looks up, throws the map away, climbs the straw, wobbles on the rim,
plants a BrewMaps pin like a summit flag, cannonballs in, pops up and waves.
End card: logo / "Where should he go next?" / "Comment an area." The comments pick ep. 2.

Each episode goes out as an Instagram **Collab** with the café, so it appears on their feed as well as ours.

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
  It is **not ours** and is gitignored along with the test render. Never post it.
- The real plates are the app's café photos in Supabase storage (`cafe-photos/<place_id>/0.jpg`).
  This session's network policy blocks that host. Once it's allowed, pick a drink shot and add its scene.
- Those photos come from Google Places and many are customer uploads. For a Collab post, confirm the
  café is happy with the photo, or use one from the café's own Instagram.
