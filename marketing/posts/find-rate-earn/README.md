# Find · Rate · Earn (دوّر · قيّم · اكسب)

Three consecutive Instagram Stories in the V3 system (Tajawal, night/cream/forest, monoline drawings
with flat fills). Post them back to back, in order.

`export/story-{1-find,2-rate,3-earn}-{ar,en}.mp4` (6s each, 1080×1920) and a `.png` still of each.

## What ties them together

- **The step bar** at the top: ١ دوّر · ٢ قيّم · ٣ اكسب, with the current step bold and underlined.
- **One route line** crosses all three: it leaves story 1 on the left and comes back in from the right
  in story 2, and so on, so tapping through feels like one continuous path. It ends at the medal.
- **The Spanish latte from the Reel** is the drink being rated in story 2.

## Copy

| Story | Background | Headline | Line | Drawing | Animation |
|---|---|---|---|---|---|
| 1 · دوّر | night | طلبك في بالك؟ | BrewMaps يقول لك وين تلقاه. | A pin with a cup, dropping onto the route | Pin lands with one soft settle, one ripple |
| 2 · قيّم | cream | جرّبته؟ قيّمه. | قيّم المشروب نفسه… مو بس الكوفي. | The Spanish latte + five stars | Stars fill one by one, then ولا تجامل 😌 |
| 3 · اكسب | forest | كل زيارة تحسب لك. | BrewPoints، أوسمة، ولوحة صدارة. | A medal with the cup | "+ BrewPoints" drifts up three times; حمّل BrewMaps 👇 |

**Claims are only what brewmaps.app says:** "Check-in & Rate: log your visits, rate drinks, track your
streak. Earn BrewPoints and unlock badges" and "climb the leaderboard". No point values, no free
coffee, no discounts: the terms say BrewPoints have no monetary value.

## Stickers (add in Instagram)

Each story leaves y ≈ 1500–1700 clear for a sticker, above the reply bar.

1. **Poll:** "وش طلبك اليوم؟ سبانش / V60" (or a question sticker: "وش طلبك؟").
2. **Emoji slider:** ☕️ "كم تعطي قهوتك اليوم؟"
3. **Link sticker** to the App Store / Google Play link, under حمّل BrewMaps 👇.

## Build

```
NODE_PATH=<playwright node_modules> node render.js <framesdir> all ar 1     # ar|en, story 1|2|3
ffmpeg -framerate 30 -i <framesdir>/f_%04d.png -c:v libx264 -pix_fmt yuv420p -crf 17 -movflags +faststart export/story-1-find-ar.mp4
```
