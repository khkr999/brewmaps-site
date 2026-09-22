# Voiceover script — ad C, Arabic (`ad-c-price-ar.mp4`)

Video is **17.0s** and currently silent — it was extended from 11s so each card holds long
enough for its line. Card timings live in one editable list at the top of `build_ar.py`. The on-screen text carries the whole message, so the
voice should land *with* the cards, not ahead of them.

## Paste this into ElevenLabs

Numbers are written as words on purpose. Given digits, Arabic TTS often reads them in English
or gets the case wrong. Ellipses are doing the pacing.

```
محد خبرك!

عن أسعار القهوة في دبي.

إسبريسو في القوز… بسبعة دراهم.

نفس الإسبريسو في جي بي آر… بأربعة وثلاثين.

نفس المشروب. نفس المدينة.

نصف المقاهي تبيعه بأربعة عشر درهماً أو أقل.

حمّل BrewMaps… واعرف السعر قبل ما تطلب.
```

## Timing against the cut

| Time | Card on screen | Line |
|---|---|---|
| 0.0 – 1.4 | محد خبرك!! | محد خبرك! |
| 1.4 – 3.3 | عن أسعار القهوة في دبي | عن أسعار القهوة في دبي. |
| 3.3 – 5.8 | القوز · 7 | إسبريسو في القوز… بسبعة دراهم. |
| 5.8 – 8.8 | جي بي آر · 34 | نفس الإسبريسو في جي بي آر… بأربعة وثلاثين. |
| 8.8 – 10.9 | نفس المشروب. نفس المدينة. | نفس المشروب. نفس المدينة. |
| 10.9 – 13.9 | 78 مقهى · 14 | نصف المقاهي تبيعه بأربعة عشر درهماً أو أقل. |
| 13.9 – 17.0 | end card | حمّل BrewMaps… واعرف السعر قبل ما تطلب. |

These are estimates from the script, not from a real take. Generate the voiceover, then:

```
# edit SECONDS at the top of build_ar.py to match your take, then
python3 build_ar.py                    # silent, to check the timing
python3 build_ar.py voice.mp3          # muxes the audio in
```

The motion scales itself to whatever duration you set — slams still settle over the first
45% of their card and drifts still travel the full length — so nothing freezes when a card
gets longer.

## Settings

| Setting | Value | Why |
|---|---|---|
| Model | Multilingual v2, or v3 if your account has it | Arabic support |
| Stability | 40–50 | Low enough to sound like a person, high enough not to wander |
| Similarity | 75 | |
| Style | 30–40 | The opener needs attitude; flat delivery kills it |
| Speaker boost | On | |
| Speed | 1.0, then trim in the edit | Do not speed up in ElevenLabs, it warbles |

Generate three or four takes and pick. The first is rarely the best on a short punchy script.

## The honest problem with this

**ElevenLabs Arabic leans Modern Standard.** Two lines here are Gulf dialect — محد خبرك and
قبل ما تطلب — and MSA-trained voices tend to either flatten them or mispronounce them. The
hook is the line most at risk, and it is the line the whole ad rests on.

Three ways out, best first:

1. **Record a real Gulf voice.** For a paid ad running in the UAE, one person and a phone
   beats synthetic every time, and dialect is exactly where the gap shows.
2. **Clone a Gulf voice** in ElevenLabs from a clean 2–3 minute sample, with consent.
3. **Accept MSA and rewrite the two dialect lines** so nothing sounds wrong:
   - محد خبرك! → لا أحد أخبرك!
   - قبل ما تطلب → قبل أن تطلب

Option 3 is safe but loses what makes the hook work, so only take it if 1 and 2 are closed.

Generate a take before committing budget and listen to the first 1.2 seconds on a phone
speaker. If the opener does not sound like a person talking, the voice is wrong.

## English version, if you also voice ad C

```
Here's what they don't tell you about coffee in Dubai.

An espresso in Al Quoz… seven dirhams.

The same espresso in JBR… thirty-four.

Same drink. Same city.

Half of them charge fourteen or less.

Get BrewMaps… and know the price before you order.
```

Same settings. English is where TTS is strongest, so this one will hold up without a
human read.
