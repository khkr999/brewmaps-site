# BrewMaps Premium Reel V3: قهوتك تقول عنك وايد

"One drink, one joke, one beat." Built to the V3 plan.

| File | Language | Ending | Length |
|---|---|---|---|
| `export/your-order-v3-ar-paid.mp4` | Khaleeji | install CTA | 25.0s |
| `export/your-order-v3-ar-organic.mp4` | Khaleeji | أنت أي واحد؟ 👇 | 24.2s |
| `export/your-order-v3-en-paid.mp4` | English | install CTA | 25.0s |
| `export/your-order-v3-en-organic.mp4` | English | Which one are you? 👇 | 24.2s |

## Timeline

Paced for a voiceover (see `VOICEOVER.md`): hook 2.1s, drinks 2.9–3.6s each (name, setup at 1.0s,
punchline at 2.1s), product 3.1s, end 3.1s (paid) or 2.3s (organic). The table below is the earlier,
faster cut; scene order and content are unchanged.

| Time | Scene | Background | On screen |
|---|---|---|---|
| 0.0–1.3 | Hook | night | **قهوتك** (frame one) · تقول عنك وايد 👀 · لا تزعل |
| 1.3–3.6 | Spanish latte | forest | سبانش لاتيه · يقول ما يحب الحلو… · **وطلبه كله حليب مكثف 😭**; an unbranded tin pours condensed milk and the bottom layer rises |
| 3.6–5.9 | V60 | cream | V60 · يشرح لك الـ tasting notes… · **وأنت أصلاً ما سألت 🤓**; Berry/Floral/Chocolate float up and leave before the punchline; drips fall |
| 5.9–8.0 | Matcha | night | ماتشا · يطلبها عشان لونها… · **مو عشان طعمها 💚**; the foam swirl turns |
| 8.0–10.2 | Iced americano | cream | آيس أمريكانو · دوام. · إيميلات. (+ "٩٩ غير مقروءة" beside the cup) · **لا تكلمه. 🧊** |
| 10.2–12.2 | Karak | sand, centred, hard cut | كرك · beat · **معفي من التحليل 😌**; steam only |
| 12.2–14.8 | Product | night | BrewMaps يعرف ذوقك · ويقترح لك وين تجرّبه; the real Discover screen, outline on "Drinks you'd love · Matches your taste" |
| 14.8–17.2 | CTA (paid) | forest | mark · مهما كان طلبك، · تلقاه على BrewMaps. · أكثر من ٨١٢ كوفي حول الإمارات · حمّل التطبيق مجاناً |
| 14.8–16.6 | End (organic) | forest | أنت أي واحد؟ 👇 · منشن اللي يشبه طلبه · small mark |

## System

- **Fixed layout for every drink:** name right-aligned at y 560, setup at y 700, punchline at y 800,
  the drink whole and centred at y 1050–1450. Nothing under the right-hand Instagram buttons or the caption.
- **Type:** Tajawal 800 name (190–240px), setup 500/66px at 80%, punchline 800/72px (pale green on dark).
- **Illustrations:** one 9px monoline, round joins, no wobble, front view on a shared baseline.
  Flat fills for liquids only: coffee `#7A4E33`, condensed milk `#EFE0C2`, karak `#B98A5E`, matcha pale green.
  One glass highlight per drink.
- **Motion:** fade-up plus reading-direction mask; one micro-animation per drink, on the punchline;
  crossfade and a 60px slide between drinks; a hard cut into karak; grain at 3%.

## App screen

`assets/screenshots/discover-drinks.png` is a frame from the founder's screen recording (26 Sep 2026),
shown from "Trending this week" down. It is not edited; the pale-green outline is an overlay.

## Captions

**Arabic (organic)**

> قهوتك تقول عنك وايد 👀
>
> منشن اللي يشبه طلبه 👇
>
> BrewMaps مجاني على الآب ستور وجوجل بلاي. الرابط في البايو.

Pinned first comment: *أنا الـ V60 للأسف 🤓 وأنتوا؟*
Reply with the counts: *سبانش لاتيه في ١٩٩ كوفي، ماتشا في ١٨٥، V60 في ١٣٥ على BrewMaps 👀*

## Sound cue sheet

Beat drop on frame one · slow thick pour under the Spanish latte punchline · three soft plinks for the
tasting notes · whisk flick on matcha · three ticks + one soft chime on إيميلات · music out for the karak
beat, one warm ding on the line · whoosh into the phone · two-note cue on the mark.

## Build

```
NODE_PATH=<playwright node_modules> node render.js <framesdir> all ar paid    # ar|en, paid|organic
ffmpeg -framerate 30 -i <framesdir>/f_%04d.png -c:v libx264 -pix_fmt yuv420p -crf 17 -movflags +faststart export/your-order-v3-ar-paid.mp4
```
