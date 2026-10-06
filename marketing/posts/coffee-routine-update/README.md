# روتين قهوتك يحتاج تحديث — "Your coffee routine needs an update"

5-slide Arabic carousel, 1080×1350, `export/slide-1..5.png`. Replaces the phone-UI version in `../coffee-update/`.
HOOK → PROBLEM → SOLUTION → PAYOFF → CTA.

System
- Green bookends (1 and 5, `#173D20`, cream type); off-white middle (`#F7F6F1`), green the only accent.
- A faint street grid under every slide; flat map drawings (blocks, park, water, main roads), no photos, no café names.
- Pins: caramel `#D9773F` for cafés (untried on 2, matches on 4), grey for the usual places, BrewMaps green for the best match.
- The update installs as you swipe: a bar at the bottom fills 20 → 100% ("جاري التحديث…" → "تم التحديث").
- One grid: 88px margins, logo top-left, slide number top-right, headline zone, visual zone, bar at the bottom.
- Slide 3's area tiles use the real areas and café counts from the app's Browse by area screen (Jumeirah 24,
  Al Quoz 29, City Walk 12, JBR 8). Slide 4 headline: "يمكن كوفيك المفضل… أقرب مما تتوقع."; slide 5: "اكتشف الكوفي اللي يناسبك على BrewMaps."
  Slide 4 carries the personalization: "BrewMaps يلقى لك الكوفي اللي يناسب ذوقك.",
  match % on the pins and "يناسب ذوقك ٩٢٪" on the V60 card (★4.9 · 600 m), after the app's own "Matches your taste"
  and match-% badges. The numbers are illustrative.

Rebuild: `NODE_PATH=<playwright node_modules> node shot.js`

## Caption

> روتين قهوتك يحتاج تحديث ☕️
>
> BrewMaps مجاني على الآب ستور وجوجل بلاي. الرابط في البايو.
>
> #BrewMaps #قهوة_مختصة #كوفيهات_الإمارات
