# Where should we go? — flat line illustration demo

Slide 1 only, 1080 × 1350. A demo of the illustrated style in BrewMaps colours.

## Style

Flat line illustration (also called linear flat or outline character illustration).
Uniform black outlines, flat fills, no shading or gradients, dot-and-line faces,
loose decorative strokes. Palette locked to three values plus the ground:

| Role | Value |
|---|---|
| Line | #141414 |
| Ground | #EAE1D1 warm sand |
| Badge / fills | #F4EFE6 cream and #FFFFFF |
| Accent | #2B4D1F forest green, #5C7F4A mid, #9BC48A pale |

Red from the reference is replaced by forest green. No third hue anywhere.

## The three-slide idea

1. Illustrated. Three friends, phones out, nobody deciding. "Where should we go?"
2. Illustrated. One person holding the phone, everyone leaning in. "Someone always has to decide."
3. Real app. The Browse by Area screen with "Pick an area. Find your coffee."

Illustration carries the human setup; the real interface is the payoff. That keeps the
photographic editorial system and this one in separate jobs rather than competing.

## Honest limitation

The figures here are hand-authored SVG, drawn in `illo.py` as parametric parts —
heads, hair, torsos, stroke-based arms, hands, phone, cups. They are clean and
on-brand, but they carry less character and line confidence than the reference,
which was drawn by an illustrator. For production, either license a set in this
style (Open Peeps, Open Doodles, Storyset, Icons8 Ouch) and recolour it to the
table above, or brief an illustrator against this palette.

## Rebuild

```
cd source && python3 gen_illo.py && node render.js illo-1.html
```
