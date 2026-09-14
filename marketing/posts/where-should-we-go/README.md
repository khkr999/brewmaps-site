# Where should we go? — flat line illustration demo

Three slides, 1080 × 1350. Illustrated setup, real app payoff.

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

## The three slides

| # | Copy | Visual |
|---|---|---|
| 1 | Where should we go? / The hardest question in any group chat. | Three figures at a table, phones out, question marks |
| 2 | Someone always has to decide. / Be that person. | Tighter crop, side figures tucked behind and leaning in, phone raised |
| 3 | Pick an area. Find your coffee. / 29 areas across the UAE, on BrewMaps. | The real Browse by Area screen, Dubai section, inside a hand-drawn phone frame |

The device that ties them together: the illustrated phone carries the BrewMaps cup mark
in cream on slides 1 and 2, then becomes a drawn phone frame on slide 3 holding the real
interface. The same object, three states. Illustration carries the human
setup, the real app is the punchline, and the two visual systems have separate jobs
instead of competing.

## Caption

Where should we go?

Nobody has ever answered this question quickly. Someone opens a map, someone says "anywhere",
somebody suggests the place you went last week.

Pick an area on BrewMaps and it shows you the specialty cafés in it. 29 areas across the UAE.

Tag the friend who never decides.

#BrewMaps #SpecialtyCoffee #DubaiCoffee #UAECoffee #DubaiCafes #SharjahCafes #CoffeeWithFriends

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
