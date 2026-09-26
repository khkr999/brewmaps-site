# BrewMaps marketing

Social posts, built as HTML and rendered to PNG. Every post reproduces its
committed export exactly from the files in its own folder.

## Layout

```
marketing/
  README.md            this file
  SCHEDULE.md          what runs when
  render.js            HTML → PNG, 1080 × 1350
  package.json
  assets/              shared by every post — one copy of each
    base.css           tokens for the recap and illustrated posts
    slides.css         tokens for the screenshot-led posts
    fonts/             DM Sans, Playfair Display
    logos/             wordmark and cup mark, green and cream
    screenshots/       untouched app screens
    derived/           crops taken from those screens
  posts/<slug>/
    README.md          brief, copy, caption, alt text, status
    export/            the PNGs to post
    *.html *.css *.py  what builds them
```

## Posts

| Post | Format | Status | Ships |
|---|---|---|---|
| `search-by-area` | Carousel, 5 | Ready | Sun 13 Sep, 11:00 |
| `days-you-didnt` | Single | Ready | Sat 13 Sep, mid-month |
| `jumeirah-spotlight` | Single | Ready | Mon 14 Sep, 08:00 |
| `matcha-index` | Carousel, 3 | Ready | Tue 15 Sep, 18:00 |
| `coffee-month` | Carousel, 5 | Blocked on real BrewPoints figures | Month end, recurring |
| `where-should-we-go` | Carousel, 3 | Art direction demo | Unscheduled |
| `the-regular` | Reel, 14.8s | Ep. 1 ready | Thu 1 Oct (International Coffee Day) |
| `coffeeguessr` | Reel, 19.7s, EN + AR | Ready | Mon 28 Sep |
| `picking-a-cafe` | Reel, 15s, AR + EN | Ready | Sun 4 Oct |
| `hidden-under-20` | Reel, 17.8s, AR + EN | Superseded: too plain, same data reused below | — |
| `dont-tell-anyone` | Reel, 16.4s, AR + EN | Rejected: flat and slow | — |
| `drew-it` | Reel, 12.4s, AR + EN | Ready | Mon 28 Sep |

## The creative bar

Set by *The Regular*, ep. 1. Every new idea is checked against these before anything is built.

1. **Something happens.** A small story with a setup, an obstacle, a payoff and a button,
   not a feature announcement. People stay to see how it ends.
2. **Real world, drawn intervention.** Real photos from the app, real screenshots, real numbers,
   with something hand-made acting on them. Nothing looks like a template.
3. **The product is in the story.** The app does something inside the plot (he swaps the paper
   map for BrewMaps), shown with the real interface, never a mock-up.
4. **The brand is the payoff.** The mark, forest green, cream, the pale-green full stop arrive as
   the reward at the end, not as a watermark from frame one.
5. **No words until the end.** It works in Arabic and English without a second cut.
6. **A reason to come back.** A series, a vote, or a question that the next post answers.
7. **If it could be any café app's post, it isn't finished.**

## Brand values

| Role | Value |
|---|---|
| Forest green | `#2B4D1F` |
| Deep green | `#1E3A14` |
| Night green | `#0E1F0A` |
| Warm sand | `#EAE1D1` |
| Cream | `#F4EFE6` |
| Pale green | `#9BC48A` |
| Mid green | `#5C7F4A` |
| Ink | `#141414` |

DM Sans throughout. Playfair Display italic only as an accent, for month names.
Final punctuation of a headline sits in pale or mid green. Margin is 76px.

## Rendering

```
cd marketing
npm install
node render.js posts/coffee-month/slide-*.html
```

PNGs land next to the HTML. Move the ones you want to keep into that post's `export/`.
Posts with a `build_*.py` generate their HTML first:

```
cd posts/coffee-month && python3 build_final.py
cd posts/where-should-we-go && python3 build_slide1.py && python3 build_slide2.py && python3 build_slide3.py
```

## Rules

One primary call to action per post, chosen for that post's job — comment, tag, share,
traffic or install. Two competing asks and people do neither. Every caption also ends with
the standing line "BrewMaps is free on the App Store and Google Play. Link in bio." That is a footer, not
the ask, so the install path always exists without crowding out the thing the post is
actually for.

Real data only. Café names, counts, ratings, distances and screenshots come from the
app and are never edited. Anything not yet verified is marked as a placeholder in that
post's README and in the source constant, never quietly invented.
