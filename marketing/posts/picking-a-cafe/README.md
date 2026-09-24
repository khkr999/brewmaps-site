# Me picking a café (أنا وأنا أختار كوفي للويكند)

A relatable meme Reel, built for tags. Real café photos from the app get swiped away with excuses
while a clock races to 47:12 and a friend's messages pile up. A card says "Or… open BrewMaps". The real
app follows: two taps, and the clock stops at 00:10. Payoff: "Found it." with 47:12 struck through.

`export/picking-a-cafe-ar.mp4` (Khaleeji) and `export/picking-a-cafe-en.mp4`, 1080×1920, 30fps, 15.0s.
It works on mute; a voiceover is optional (script below).

## What's real

- **Cards:** ten café photos from the app (`data.json` lists each café and its page). No café names are
  shown. The stamps are the viewer's excuses (too far, not the vibe, went yesterday), never claims
  about a café: nothing like "crowded" or "no parking" on a real business.
- **App:** `browse-top.png` cropped below its header (so "413 cafés" never appears), a tap on Jumeirah,
  then `jumeirah-list.png` as captured, with a tap on the first row. The tap ripples and the highlight
  are overlays; the screens are not edited.
- **Chat bubbles** are generic, not a copy of any messaging app.
- The 47:12 and 00:10 are the joke's clocks, not measured times.

## Beats (seconds)

| Time | Arabic on screen | English on screen |
|---|---|---|
| 0.0 | أنا وأنا أختار كوفي للويكند · clock 00:00 | Me picking a café for the weekend |
| 0.9 | بعيد | Too far |
| 2.0 | مو مود | Not the vibe |
| 2.3 | 💬 يلا؟ | so? |
| 3.0 | رحناه أمس | Went yesterday |
| 3.9 | يمكن… (drifts right, then left anyway) | Maybe… |
| 4.0 | 💬 وين نروح؟؟ | where are we going?? |
| 4.9 | لا | Nope |
| 5.5–7.6 | مو اليوم · بعدين · امممم · لا لا · خلاص لا (faster) | Not today · Later · Hmm · No · Nah |
| 5.6 / 7.0 | 💬 ؟؟؟ / نمت؟ 😭 | ??? / did you fall asleep 😭 |
| 7.9 | أو… افتح BrewMaps · clock 47:12 | Or… open BrewMaps |
| 9.0 | the app; clock restarts | |
| 10.2 | tap: Jumeirah | |
| 11.4 | tap: first café · clock stops 00:10 | |
| 12.2 | لقيته. · 47:12 → 00:10 | Found it. |
| 13.0 | أكثر من ٨١٢ كوفي في كل أنحاء الإمارات. | 812 cafés across the UAE. |

## Voiceover (optional)

An inner monologue, muttered, getting faster. Short throwaway lines. Pick a **Gulf/Emirati voice** in the
ElevenLabs Voice Library; if it drifts formal, your own phone recording will beat it.

**Khaleeji**

| At | Line |
|---|---|
| 0.0 | أبي أروح كوفي اليوم… |
| 0.9 | بعيد. |
| 2.0 | مو مود. |
| 3.0 | رحناه أمس. |
| 3.9 | يمكن… (4.4) لا. |
| 5.5 | لا… بعدين… امممم… لا لا… (fast, mumbled) |
| 7.9 | أوف… خلاص. |
| 9.0 | بفتح BrewMaps. |
| 10.2 | جميرا… |
| 11.4 | هذا. |
| 12.2 | لقيته. |

**English**

| At | Line |
|---|---|
| 0.0 | Okay. Coffee. |
| 0.9 | Too far. |
| 2.0 | Not the vibe. |
| 3.0 | We went yesterday. |
| 3.9 | Maybe… (4.4) no. |
| 5.5 | no… later… hmm… nah… (fast) |
| 7.9 | Ugh. Fine. |
| 9.0 | Opening BrewMaps. |
| 10.2 | Jumeirah… |
| 11.4 | That one. |
| 12.2 | Found it. |

To add it: `ffmpeg -i export/picking-a-cafe-ar.mp4 -i voice.mp3 -c:v copy -c:a aac -shortest out.mp4`

## Captions

**Arabic**

> منشن الخوي اللي ياخذ ساعة يختار كوفي 👇😂
>
> أو خلّه يفتح BrewMaps… أكثر من ٨١٢ كوفي في كل أنحاء الإمارات، مرتبة حسب المنطقة.
>
> BrewMaps مجاني على الآب ستور. الرابط في البايو.
>
> #BrewMaps #كوفيهات_دبي #قهوة_مختصة #ويكند #دبي #أبوظبي #الشارقة #الإمارات

**English**

> Tag the friend who takes an hour to pick a café 👇😂
>
> Or send them BrewMaps. 812 cafés across the UAE, sorted by area.
>
> BrewMaps is free on the App Store. Link in bio.
>
> #BrewMaps #DubaiCafes #SpecialtyCoffee #WeekendPlans #DubaiCoffee #UAECoffee

## Build

```
NODE_PATH=<playwright node_modules> node render.js <framesdir> all ar   # or: all en
ffmpeg -framerate 30 -i <framesdir>/f_%04d.png -c:v libx264 -pix_fmt yuv420p -crf 18 -movflags +faststart export/picking-a-cafe-ar.mp4
```
