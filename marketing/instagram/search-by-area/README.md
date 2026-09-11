# Search by Area — Instagram carousel

Five-slide 1080 × 1350 (4:5) carousel introducing Search by Area.
Real app screenshots only; no UI was altered.

- `export/slide-1.png` … `slide-5.png` — final slides, post in order
- `export/contact-sheet.png` — all five side by side
- `source/` — HTML/CSS slides, DM Sans, screenshot crops, logo in forest green (#2B4D1F)

Re-render after editing a slide:

```
cd source && npm i playwright && node render.js slide-1.html slide-2.html slide-3.html slide-4.html slide-5.html
```
