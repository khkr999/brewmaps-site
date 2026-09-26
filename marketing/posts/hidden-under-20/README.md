# Hidden under 20 (٤ كوفيهات… ومحد يدري عنهم)

A utility Reel built to be saved and sent. Four cafés rated 4.8+ with fewer than 150 reviews and a
latte under AED 20. It combines the formats in one: a useful hook, hidden spots, area-based finds,
a guess-the-price beat, a price comparison against the UAE median, and a real app demo.

`export/hidden-under-20-ar.mp4` (Khaleeji) and `export/hidden-under-20-en.mp4`, 1080×1920, 30fps, 17.8s.

## Why this and not another quiz

CoffeeGuessr asked people to play before promising them anything. This hook promises something
they can use tonight ("4 cafés rated 4.8+, latte under AED 20, that nobody knows about"). Saves and
sends are the signals that carry a Reel to strangers, and a list you want to keep earns both.

## Beats

| Time | What happens |
|---|---|
| 0.0–2.4 | Hook, on frame one: ٤ كوفيهات تقييمها ٤٫٨ وفوق / واللاتيه أقل من ٢٠ درهم / …ومحد يدري عنهم |
| 2.4–13.2 | Four cafés, 2.7s each: photo with area chip, name, rating and review count, then "اللاتيه بكم؟" with "؟؟ درهم" pulsing, then the real price lands in pale green with the UAE median under it |
| 13.2–15.4 | The real app: Browse by area scrolling. "كلهم على BrewMaps / دوّر حسب المنطقة" |
| 15.4–17.8 | "احفظ الفيديو لطلعتك الجاية." with all four: photo, price, area. Fine print: prices and ratings as listed on BrewMaps |

## The data (all from the café pages on brewmaps.app, 26 Sep 2026)

| Café | Area | Rating | Reviews | Menu item | Price |
|---|---|---|---|---|---|
| Sibul Cafe | Al Karama, Dubai | 5.0 | 38 | Latte | AED 16 |
| Special Stage Specialty Coffee | Al Muroor, Abu Dhabi | 4.8 | 64 | Cafe Latte | AED 15 |
| Bebax Coffee | Ajman | 5.0 | 112 | Latte | AED 16.5 |
| Oomi Specialty Coffee | Dubai Internet City | 4.8 | 147 | Latte | AED 18 |

- **Selection:** every café rated 4.8+ with 150 reviews or fewer and a hot latte listed under AED 20.
  Six qualified. Form Room was dropped because its app photo shows a different café's sign; Mez Cafe
  because its latte is exactly AED 20 and its photo didn't download.
- **Median:** AED 23, the median hot latte ("Latte", "Cafe Latte", "Caffe Latte") across the 206 cafés
  that list one. Only 23% of them are under AED 20.
- **Hot lattes only:** Special Stage's iced latte is AED 13, but the comparison uses its hot Cafe Latte
  (AED 15) so every price is the same drink.
- The "؟؟" beat never shows a made-up number. Photos are the app's own, cropped, not edited.

## Captions

**Arabic**

> ٤ كوفيهات تقييمها ٤٫٨ وفوق… واللاتيه أقل من ٢٠ درهم ☕️
>
> متوسط اللاتيه في الإمارات ٢٣ درهم. هذي أرخص… ومحد يدري عنها بعد.
>
> احفظ الفيديو، وأرسله للي بتطلع معاه 👇
>
> BrewMaps مجاني على الآب ستور وجوجل بلاي. الرابط في البايو.
>
> #BrewMaps #كوفيهات_دبي #قهوة_مختصة #كوفيهات_أبوظبي #عجمان #الكرامة #الإمارات

**English**

> 4 cafés rated 4.8+ with a latte under AED 20 ☕️
>
> The UAE median is AED 23. These are cheaper, and almost nobody's found them yet.
>
> Save this, and send it to whoever you're going with 👇
>
> BrewMaps is free on the App Store and Google Play. Link in bio.
>
> #BrewMaps #HiddenGems #DubaiCafes #AbuDhabiCafes #SpecialtyCoffee #UAECoffee

## Build

```
NODE_PATH=<playwright node_modules> node render.js <framesdir> all ar   # or: all en
ffmpeg -framerate 30 -i <framesdir>/f_%04d.png -c:v libx264 -pix_fmt yuv420p -crf 18 -movflags +faststart export/hidden-under-20-ar.mp4
```

It's a format: swap `data.json` for another filter (under AED 15, one emirate, matcha instead of latte)
and re-render.
