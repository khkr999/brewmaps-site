# Find · Rate · Earn, V2 (دوّر · قيّم · اكسب)

Three consecutive Stories, minimalist. Post in order: `export/story-1-find-ar-minimal.mp4`,
`story-2-rate-ar-minimal.mp4`, `story-3-earn-ar-minimal.mp4`.

## The journey

- **Colour carries the story:** night green (find) → cream (rate) → pale green (earn). Dark to light to reward.
  Text is always the high-contrast pair for its ground: cream on night, forest on cream, night on pale green.
- **Hand-offs:** each Story ends with a strip of the next Story's colour rising at the bottom, carrying
  "التالي"; the next Story opens with that same strip expanding to fill the screen. `journey.js`.
- **Constants:** logo mark in the reading corner, ١/٣ ٢/٣ ٣/٣ in the other, headline in the same place
  and size on all three. No emojis.

| Story | Ground | Headline | One visual | Motion |
|---|---|---|---|---|
| ١ دوّر | night | دوّر على أي كوفي / في الإمارات | UAE map, a dot for every café on brewmaps.app at its real location | map draws, dots fill by emirate, ٨١٢ كوفي rises in once |
| ٢ قيّم | cream | قيّم مشروبك / بعد كل زيارة | the Spanish latte from the Reel, five stars | stars fill once, right to left; ولا تجامل |
| ٣ اكسب | pale green | وكل تقييم / يعطيك BrewPoints | a medal with the cup | medal rises and settles, ring turns slowly, + BrewPoints rises once; اجمع نقاط، افتح أوسمة، وتصدّر القائمة; حمّل BrewMaps مجاناً |

Claims match brewmaps.app: rate drinks, earn BrewPoints, unlock badges, climb the leaderboard, 812 cafés.
No point values or cash rewards (the terms say BrewPoints have no monetary value).

Add a link sticker to the app under حمّل BrewMaps مجاناً on Story 3.

`story1.js` + `story1-min.js` (Story 1), `story2-min.js`, `story3-min.js`, shared `journey.js`.
Render: `node render-min.js|render2.js|render3.js <framesdir> all ar`.
