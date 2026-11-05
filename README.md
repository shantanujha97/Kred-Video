# Kred demo video

Code-built motion demo for **Kred** (by KernelDAO), made from the Kred LP / Dashboard Figma file. Same pipeline and camera grammar as the Bento / Strata / Superfy videos: an HTML scene driven by a paused GSAP timeline, rendered frame-by-frame with Playwright → sharp → ffmpeg at 1920×1080, 60fps. No React Bits — the backdrop (Kred's page grey, faint teal dot grid, brand glows, the banner's star motif, paper grain) is drawn on canvas.

| Version | Page | Notes |
|---|---|---|
| v1 | `index1.html` / `scene1.js` | Stills-only draft ([stills](videos/Kred_v1_stills.jpg)) |
| v2 | `index2.html` / `scene2.js` | UI straight after the opening line; "Pegged 1:1 to USD." moved onto the institutions card — [video](videos/Kred_Demo_v2.mp4) |
| v3 | `index3.html` / `scene3.js` | v2 without "by KernelDAO" on the logo and without the URL on the end card — [video](videos/Kred_Demo_v3.mp4) |

`index.html` / `scene.js` is the working copy. Full-quality masters live in `out/`; `videos/` holds lighter web copies.

## Render

```bash
npm install
python3 -m http.server 8131 --bind 127.0.0.1 &
PORT=8131 PAGE=index3.html node render.js stills 2,8.9,25 stills/
PORT=8131 PAGE=index3.html node render.js video Kred_Demo_v3.mp4 60 0 40.7833
```

`tools/calib.*` matches live Geist text to the Figma exports; `tools/times.js` prints the section times.
