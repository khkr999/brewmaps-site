# "<Area> is calling" — Reel series

Vertical video, 1080 × 1920, 10–15 seconds. A recurring format, one area per week.

## The mechanic

One unbroken overhead macro shot of coffee being made — an espresso pulling into a glass,
milk folding into a cup, ice cracking. No cuts. Over it sits a fake incoming-call banner
where the caller is a BrewMaps area rather than a person. Nothing is explained. The handle
appears only at the end on a fade.

The scroll-stop is the banner, not the coffee: a call banner hijacks a reflex before anyone
decides whether to care. The macro shot is what holds them once they have stopped.

## What to shoot

- Phone on a tripod or propped directly above the bar, lens roughly 20–30 cm from the cup
- One continuous take, no pan, no zoom, 15–20 seconds of usable action
- Lock exposure and focus before rolling so it does not hunt mid-pour
- Shoot at a real café in the area you are naming. That gives the café a reason to reshare
- Record ambient sound. The grinder, the steam wand and the pour are the whole audio track

## Assembly

1. Drop `export/banner-<area>.png` on top of the footage as a full-frame overlay
2. Hold it for the entire clip
3. Last 1.5s: fade the whole frame to about 25% and bring up the handle
4. Loop it — end on the frame you opened on

## Rendered version in this folder

`export/jumeirah-is-calling.mp4` — 10s, 1080 × 1920, silent. Built from the real Browse by
Area screen scrolling under the banner, ending on the handle. Rebuild with `./build_video.sh`.

This is the screen-recording variant, not the macro variant. It is postable as-is and it
demonstrates the product, but the reference gets its hold from real macro footage of coffee
being made. Shoot that and drop the same overlay on it for the stronger version.

Add music before posting. A silent Reel loses reach.

## Overlays ready

`banner-jumeirah.png`, `banner-al-quoz.png`, `banner-city-walk.png`, `banner-deira.png` —
1080 × 1920, transparent, BrewMaps green. `mock-over-photo.png` shows how it reads.

New area: `python3 banner.py "Al Barsha"` then `node render_alpha.js banner-al-barsha.html`.

## Caption

Jumeirah's calling. Picking up?

24 cafés there. 29 in Al Quoz. 12 in City Walk. Pick an area, see the cafés in it.

Which area should call next? 👇

BrewMaps is free on the App Store. Link in bio.

#BrewMaps #DubaiCoffee #SpecialtyCoffee #UAECoffee #DubaiCafes

### Shorter alternative

Jumeirah's calling. Picking up? ☕

29 areas across the UAE. Which one should call next? 👇

BrewMaps is free on the App Store. Link in bio.

#BrewMaps #DubaiCoffee #SpecialtyCoffee #UAECoffee #DubaiCafes

Every count named in the caption is visible in the video itself, which rewards watching it twice.

The opener plays the gag rather than explaining it, and "Picking up?" is the half that
survives Instagram's truncation. The closing question is open rather than yes/no, so replies
name an area you can turn into the next episode.

Spelling: Jumeirah.

## CTA

Primary: comment an area. "Whose turn next?" turns the series into a request queue.
