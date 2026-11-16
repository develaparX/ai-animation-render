# Engine API — 2D Canvas (`stick-2d` / `@garishidup.idn` v2.1)

Daftar export nyata dari `engine/` di repo ini. Semua scene di `scenes/` mengimpor
lewat alias `/engine/*.js` (lihat `player.html` / `render.mjs`).

## `engine/core.js` — util & kanvas
```js
E, FONTS, S, V,            // E: env (W,H,fps,dur,words), S: skala, V(h,v): vh/100, wv/100 relatif
css, rgb, shade, mix, mixVal, clamp, lerp, ease, rng, key, prog,
text, measure, alpha, glow, layer, backdrop, blurLayer, veil,
linGrad, radGrad, circle, rr, ring, seg, poly, fillRect, noise, shake,
mood, talkAmount, wordTime,
registerShot, getShot, allShots, setStyle
```
- `registerShot(id, { init, draw, overlay })` — daftar shot.
- `E.words` berisi `{word,start,end}` hasil `words.json`; `wordTime(t)` memetakan waktu ke kata.
- `rng(seed)` wajib menggantikan `Math.random()` agar render deterministik.

## `engine/garishidup.js` — panggung & widget v2.1
```js
PALETTE,
stage, figure, headline, pill, microLabel,
splitBoxes, openSplitStage, goldTimerPill, speechBubble, bigCounter,
expenseStack, ghostFigure, angledStamp, crowdQueue, receiptCard, chatToast,
blueprintBoard, scoreboard,
drawMortarboard, flowPipe, fuelGauge, padlock, progressBar, valveWheel
```
| Fungsi | Kunci opsi penting |
|---|---|
| `stage(g, o)` | `{ floorY, watermark, spotlight }` — latar radial navy `#121821 → #070a0f` |
| `figure(g, x, y, o)` | `{ role: 'hero'\|'slate'\|'mauve'\|'gold', pose, s, reflect }` |
| `headline(g, lines, o)` | `*kata*` di dalam string → emas menyala; `{ reveal, y }` |
| `pill(g, label, o)` | `{ sub, subHighlight }` — kapsul bab/waktu |
| `microLabel(g, text, x, y)` | label kapital kecil di atas prop/kepala |
| `bigCounter(g, num, o)` | `{ label, gold }` |
| `expenseStack(g, o)` | `{ topLabel, mainValue, items[] }` |
| `receiptCard(g, o)` | `{ topLabel, mainValue, subLabel, gold }` |
| `goldTimerPill(g, '08.10', o)` | `{ clockIcon, sub }` |
| `crowdQueue(g, o)` | `{ startX, floorY, count, confetti }` |

## `engine/gh_layouts.js`
```js
renderGHShot  // 6 arsitektur panggung: Layout A split_*, B opensplit_*, C timelapse_*,
              // D flashback_*, E multiscene_*, F mirror_* (dipilih dari prefix scene)
```

## `engine/rig2d.js` — rig pose
```js
POSES, EXPR, pose, blendPose, posesAt, breathe, drawFigure, face, bigFace, headPos, soccerBall, walkPose
```
`POSES` dipakai bersama gaya 3D (lewat `three-kit.figure3D`), jadi pose yang
ditambah di sini ikut berlaku di dua gaya.

## `engine/ui2d.js` — UI kartu & data
```js
readout, titleCard, endScreen, captions, bubble, callout,
dataCard, compareBars, meter, dimension, badge, bigLine, blueprint, bpStroke, lineFigure
```

## `engine/fx2d.js` — efek & set dressing
```js
bed, chair, clock, clouds, counter, crowd, door, drops, dust, facade, floorLines, fog,
godRays, hills, lampPost, lensStreak, lightCone, lightning, moon, pine, pool, rain,
rings, screen, skyline, snow, sparkle, speedLines, stars, stool, sun, tree, windowFrame
```

## `engine/three-kit.js` / `engine/gh3d.js`
Untuk gaya 3D. Lihat `skills/animasi-3d-jadibegini/SKILL.md`.
