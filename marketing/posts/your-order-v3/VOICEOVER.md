# ElevenLabs voiceover: قهوتك تقول عنك وايد (V3)

Timed to `export/your-order-v3-ar-paid.mp4` (25.0s) and `-organic.mp4` (24.2s).
Each line starts as its text appears on screen.

## Voice and settings

- **Model:** Eleven v3 (it handles Arabic and takes delivery tags such as `[smirks]`, `[sighs]`).
  Multilingual v2 also works; drop the tags.
- **Voice:** a young Gulf / Emirati voice from the Voice Library, conversational, dry and amused.
  Not a newsreader. Search the library for "Emirati" or "Khaleeji".
- **Settings:** Stability 35–45, Similarity 75, Style 30–40, Speaker boost on, speed 1.0.
- **Tone:** a friend roasting you over coffee. Deadpan setup, small smile on the punchline.
- ElevenLabs leans towards formal Arabic. If لونها، ما سألت، لا تكلمه come out stiff, re-generate
  that line alone, or record your own voice on a phone: for this format it often beats AI.

## The script (paste line by line, one generation per line, so each can be placed on its mark)

Written the way it should be said. English words and numbers are spelled out in Arabic so the voice
doesn't switch accent mid-line.

| # | Starts at | On screen | Say (paste this) |
|---|---|---|---|
| 1 | 0.00 | قهوتك تقول عنك وايد 👀 | قهوتك… تقول عنك وايد. |
| 2 | 1.50 | لا تزعل | `[smirks]` لا تزعل. |
| 3 | 2.15 | سبانش لاتيه | سبانش لاتيه. |
| 4 | 3.10 | يقول ما يحب الحلو… | يقول ما يحب الحلو… |
| 5 | 4.20 | وطلبه كله حليب مكثف 😭 | وطلبه كله حليب مكثّف. |
| 6 | 5.75 | V60 | في ستّين. |
| 7 | 6.70 | يشرح لك الـ tasting notes… | يشرح لك التيستنغ نوتس… |
| 8 | 7.80 | وأنت أصلاً ما سألت 🤓 | وانت أصلاً… ما سألت. |
| 9 | 9.35 | ماتشا | ماتشا. |
| 10 | 10.30 | يطلبها عشان لونها… | يطلبها عشان لونها… |
| 11 | 11.40 | مو عشان طعمها 💚 | مو عشان طعمها. |
| 12 | 12.55 | آيس أمريكانو | آيس أمريكانو. |
| 13 | 13.50 | دوام. | دوام. |
| 14 | 14.20 | إيميلات. | إيميلات. |
| 15 | 14.90 | لا تكلمه. 🧊 | لا تكلّمه. |
| 16 | 15.95 | كرك | `[sighs]` كرك. |
| — | 16.4–17.3 | (steam only) | *silence: let it breathe* |
| 17 | 17.30 | معفي من التحليل 😌 | معفي من التحليل. |
| 18 | 18.95 | BrewMaps يعرف ذوقك | برو مابس يعرف ذوقك… |
| 19 | 20.30 | ويقترح لك وين تجرّبه | ويقترح لك وين تجرّبه. |
| 20 | 22.00 | مهما كان طلبك، | مهما كان طلبك… |
| 21 | 22.75 | تلقاه على BrewMaps. | تلقاه على برو مابس. |
| 22 | 23.80 | حمّل التطبيق مجاناً | حمّل التطبيق مجاناً. |

**Organic ending** (replaces 20–22):

| # | Starts at | On screen | Say |
|---|---|---|---|
| 20o | 22.00 | أنت أي واحد؟ 👇 | وانت؟ أي واحد فيهم؟ |
| 21o | 23.20 | منشن اللي يشبه طلبه | منشن اللي يشبه طلبه. |

Every line must finish before the next one starts. If a take runs long, speed that one line up
(ElevenLabs speed 1.05–1.1) rather than cutting it.

## Adding it to the video

Name the takes `vo/01.mp3` … `vo/22.mp3` (or `vo/20o.mp3`, `vo/21o.mp3`) and run:

```
python3 mux_vo.py paid       # or: organic
```

It places every take on its mark, adds a gentle music bed if `music.mp3` exists (ducked under the voice),
and writes `export/your-order-v3-ar-paid-vo.mp4`.

## English (optional)

| Starts at | Say |
|---|---|
| 0.00 | Your coffee says a lot about you. |
| 1.50 | No offence. |
| 2.15 / 3.10 / 4.20 | Spanish latte. / Says he doesn't like sweet… / orders straight condensed milk. |
| 5.75 / 6.70 / 7.80 | V sixty. / Explains the tasting notes… / nobody even asked. |
| 9.35 / 10.30 / 11.40 | Matcha. / Orders it for the colour… / not the taste. |
| 12.55 / 13.50 / 14.20 / 14.90 | Iced americano. / Meetings. / Emails. / Don't talk to him. |
| 15.95 / 17.30 | Karak. … / Exempt from analysis. |
| 18.95 / 20.30 | BrewMaps knows your taste… / and where to try it next. |
| 22.00 / 22.75 / 23.80 | Whatever you order… / find it on BrewMaps. / Download the app, free. |
