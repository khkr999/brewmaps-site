# Story: on the map

Story, 1080×1920, `export/story-on-the-map.png`. After the "standing on a printed café map" reference:
top-down, white sneakers on a big printed map, iced coffee in hand. Here the map is BrewMaps.

- Brand post: no café name, logo or branded cup. The cup is plain; the pin says YOUR NEXT COFFEE.
- `img/base.png`: the photo, AI-generated (Figma AI, gemini-3.1-flash-image) with a plain chroma-green board, 768×1376 upscaled.
- `map.html` → `img/map.png` (896×1447): the printed map, drawn in BrewMaps colours with the real logo and pin.
  Street names are real Dubai roads; nothing on it names a café.
- `composite.py`: keys the green board by hue, lays the map in, and multiplies by the board's own light so the
  shoe shadows and sun stay real; despills green from shoes, hand and the clear cup.

Rebuild: `NODE_PATH=<playwright node_modules> node shot.js && python3 composite.py`

Story stickers: add the link sticker over the asphalt at the top, or over the pavement at the bottom-right.
