# BrewMaps Premium Reel V2: قهوتك تقول عنك وايد

The redesign of `your-order`, built to the V2 brief. `export/your-order-v2-ar.mp4` (Khaleeji) and
`export/your-order-v2-en.mp4`, 1080×1920, 30fps, 13.4s, silent (sound cue sheet below).

## System

- **Type:** Tajawal only (DM Sans for Latin in the English cut and for "V60"). Headlines 220–340px/800,
  punchlines 60–64px/500, data 30px/400 above a thin rule. No pills.
- **Layout:** type anchored to the reading edge (right in Arabic, left in English); line drawings bleed
  off the other edge. Karak is the only centred frame, on purpose.
- **Surfaces:** night, cream, night, sand, forest, night, night, forest. Soft light toward the type,
  film grain at 7% overlay cycled at 12fps.
- **Motion:** masked reveals in reading direction (6–9 frames), drawings that draw themselves, no bounce.
  Transitions: hard cut, push, crop wipe, cut, cut, open-into-phone, crossfade.

## Storyboard

| Time | Scene | Beat |
|---|---|---|
| 0.0–0.8 | Hook, night | قهوتك / تقول عنك / وايد 👀 (pale green), word by word; لا تزعل small, bottom corner |
| 0.8–2.4 | Spanish latte, cream | Glass bleeds off the edge; condensed milk pours and fills as line 2 lands. Footer: ١٩٩ كوفي |
| 2.4–4.0 | V60, night | Push in. Berry / Floral / Chocolate / Citrus appear, then are struck through on «وأنت أصلاً ما سألت 🤓». ١٣٥ كوفي |
| 4.0–5.6 | Matcha, sand | Crop wipe. Bowl cropped top-left, whisk flicks on the punchline; name bottom-right. ١٨٥ كوفي |
| 5.6–7.2 | Iced americano, forest | دوام. / إيميلات. / لا تكلمه. on three beats; "٩٩ رسالة غير مقروءة" shows only with إيميلات. ٩١ كوفي |
| 7.2–8.8 | Karak, night, centred | Beat of nothing, then معفي من التحليل. 🤝 · موجود في ١٧ كوفي بس… نشتغل على الباقي |
| 8.8–11.0 | Product, night | The istikana's spot opens into the phone. **Currently the real Browse → Jumeirah flow.** |
| 11.0–13.4 | End, forest | Mark top corner; مهما كان طلبك، / تلقاه على BrewMaps. / أكثر من ٨١٢ كوفي / حمّل التطبيق مجاناً ← with an underline drawing in; the phone stays, cropped at the bottom edge |

## Search footage (to swap in)

Drop a screen recording of the app's search into `app/` as frames and list them in `app/frames.json`:

```
ffmpeg -i search.mp4 -vf "fps=30,scale=1320:-1" app/s_%03d.png
ls app/*.png | xargs -n1 basename | python3 -c "import sys,json;print(json.dumps([l.strip() for l in sys.stdin]))" > app/frames.json
```

The product scene uses it automatically (first ~2s). Best take: type "V60", results appear, tap one.

## Sound cue sheet

Beat drop at 0.0 and a soft tick on each hook word · low pour under the Spanish latte's line 2 · four
soft plinks on the tasting notes, a dry "tsk" on the strike · two whisk flicks · three hard ticks plus
one quiet notification chime on إيميلات · music drops out for the karak beat, returns on the punchline ·
soft whoosh into the phone, taps on screen · two-note cue on the mark.

## Data

Drink counts are cafés whose menu on brewmaps.app lists the drink (389 cafés list a menu), 26 Sep 2026.
App screens are real screenshots (browse-top cropped below its header; jumeirah-list as captured).
