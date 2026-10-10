# Weekend story · قهوة الويكند، حار ولا بارد؟ — `export/weekend-hot-or-iced.png` (1080×1920)

A quick story to keep the page active over the weekend: a "hot or iced" poll over the two-cup image from the ladder
reel (`../found-my-coffee/plates/iced-hot-v2.jpg`, generated; no café, no brand). Labels over each cup; a darkened band
under the cups for Instagram's poll sticker. Text stays inside the story safe zone (below the top bar, above the reply bar).

**When posting:** add the Poll sticker just under "صوّت تحت" (about the lower third). Question: leave empty (the
headline asks it). Options: left **بارد**, right **حار**, matching the cups. No caption needed.

`story.html` draws it; `node render.js export/weekend-hot-or-iced.png` re-renders.

## Story 2 · وش الكوفي اللي ما تمل منه؟ — `export/weekend-your-regular-cafe.png`

A Question-box story to get replies (people type their favourite café) over the cold-brew macro
(`../cold-drinks/plates/cold-brew.jpg`, generated). **When posting:** add the Question sticker just under "اكتب اسمه تحت"
(middle of the screen), prompt text: **اكتب اسم الكوفي**. Re-render: `node render.js export/weekend-your-regular-cafe.png story-question.html`.
