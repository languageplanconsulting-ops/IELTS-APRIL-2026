# English Plan — design brief

Extracted from the placement test. Reusable for any student-facing surface.
The live implementation is `src/PlacementTestPage.css`; copy the token block from
there rather than re-typing hex codes.

---

## 1. The idea in one line

**Duolingo's warmth, in English Plan's blue and yellow, with an exam's honesty.**

Friendly enough that a stranger who has bought nothing will start it; serious
enough that the result feels worth trusting.

---

## 2. Colour

| Token | Hex | Use it for |
|---|---|---|
| `--blue` | `#004aad` | Primary buttons, headings' eyebrow labels, active states, key numbers |
| `--blue-deep` | `#00337a` | Button hover, dark panels (the audio player) |
| `--blue-soft` | `#e8f0fc` | Instruction blocks, selected choice fill |
| `--blue-tint` | `#f4f8ff` | Passage backgrounds, input focus fill |
| `--yellow` | `#ffcc00` | Celebration, progress-complete, accent underline, secondary CTA |
| `--yellow-soft` | `#fff6d6` | Warning and caution blocks |
| `--yellow-deep` | `#d9a800` | Yellow button hover, underline strokes on text |
| `--paper` | `#fffdf7` | **Page background — never grey** |
| `--ink` | `#1b2230` | Body text |
| `--muted` | `#6b7488` | Secondary text, captions, hints |
| `--line` | `#e8e6df` | Borders and dividers (warm, not blue-grey) |
| `--good` / `--good-soft` | `#1a8a55` / `#e4f6ec` | Correct, high band |
| `--bad` / `--bad-soft` | `#cf4436` / `#fdeeec` | Wrong, low band |

**The single biggest lever:** the background is warm off-white `#fffdf7`, and
borders are warm grey `#e8e6df`. Cold `#f6f7fb` grey on `#e3e6ef` borders is what
made the first version look generic. Warm neutrals + one saturated brand colour
is most of the effect.

**Ratio.** Blue does the work, yellow is the spice. Roughly 8:1. Yellow appears
on celebrations, the accent underline, the completed progress segment, and
caution blocks — nowhere else.

---

## 3. Typography

**Mali** throughout, from Google Fonts, weights 400/500/600/700.

```html
<link href="https://fonts.googleapis.com/css2?family=Mali:wght@400;500;600;700&display=swap" rel="stylesheet">
```

| Role | Size | Weight |
|---|---|---|
| Eyebrow label | `12.5px`, uppercase, `letter-spacing: .1em` | 700, blue |
| Heading | `clamp(21px, 3.4vw, 27px)` | 700 |
| Question | `clamp(18px, 2.9vw, 23px)` | 600 |
| Lead / subtitle | `clamp(16px, 2.4vw, 18px)` | 400, muted |
| Body / passage | `clamp(15px, 2.2vw, 16.5px)`, `line-height: 2` | 400 |
| Note / caption | `13.5px` | 400, muted |

**Line height 1.8 as the body default, 2.0 for anything in English.** Mali is a
rounded Thai face with generous descenders — tight leading makes it look cramped
and Thai tone marks collide.

**Always `clamp()`.** One type scale that works on a phone and a laptop without
breakpoints.

---

## 4. Shape and depth

- **Radii:** `28px` for cards and panels, `18px` for controls and blocks, `999px`
  for buttons and pills. Big, soft, consistent.
- **Card:** white on paper, `1px solid var(--line)`, and a two-layer shadow —
  `0 2px 0 rgba(27,34,48,.04), 0 14px 34px -22px rgba(27,34,48,.3)`. A hairline
  of contact plus a wide soft lift; not a generic blur.
- **Buttons:** pill, weight 700, and a **coloured** shadow rather than a grey one
  — `0 10px 20px -12px rgba(0,74,173,.9)`. Lift `1px` on hover, press `1px` on
  active.
- **Selectable options:** `2px` borders, not `1px`. They become the primary
  interaction, so they need presence. Hover tints and lifts `1px`; selected fills
  `--blue-soft` and borders `--blue`.

No hard-offset 3D shadows. That reads as a Duolingo clone rather than a
descendant.

---

## 5. Layout

- **One thing per screen.** A question fills the viewport with nothing competing.
  `max-width: 720px`, centred.
- **Vertically centred on desktop, top-aligned under 640px** — otherwise long
  content pushes the button off a phone screen.
- **Progress lives at the top**, sticky: one segment per stage, filling blue as
  you work and turning yellow when complete. Never a percentage number.
- **No sidebar, no persistent nav** on a focused task. The only way is forward.

---

## 6. Motion

One entrance animation, used everywhere:

```css
@keyframes rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
/* .42s cubic-bezier(.22, .9, .3, 1) */
```

Exit is faster than entrance (`.18s` vs `.42s`) — content should leave briskly
and arrive gently. Micro-interactions are `.12s–.15s`. Always honour
`prefers-reduced-motion`.

**Never scroll the page on navigation.** Let the content change under the reader.

---

## 7. Illustration

- **Inline SVG, not image files.** Sharp at any size, inherits brand colour, no
  network request.
- **Recipe:** rounded line art, `5–6px` strokes, `stroke-linecap: round`, white or
  `--blue-soft` fills, one yellow element per drawing as the focal point, and a
  soft `--blue-soft` ellipse underneath as a ground shadow.
- **One per intro screen**, sized `clamp(150px, 34vw, 210px)`. Questions
  themselves get none — they'd compete with the content.
- A star burst for celebration, a green tick for completion.

---

## 8. Copy

- **Thai for everything the student is told; English only for exam content.**
  Never translate a question, an option, or a passage.
- **Polite register with ครับ, never ค่ะ.** Use ฉัน, not ผม, when writing in the
  student's voice.
- **Praise is specific.** "ชุดแรกผ่านหมด" beats "เก่งมาก" alone.
- **Failure is silent.** Never tell a student mid-task that they got something
  wrong unless the whole design is built around instant feedback. Move on and
  report at the end.
- Instructions blocks are blue, warnings are yellow. Consistent everywhere.

---

## 9. Reports and results

Written as a **letter from the teacher**, addressed by name. Big number, then a
sentence naming the weakest area, then the breakdown, then specifics, then a
signed-off caveat. Credibility comes from it reading like a person wrote it.

---

## 10. Checklist for a new screen

- [ ] Warm paper background, warm borders — no cold grey
- [ ] Mali, with `clamp()` sizes and `line-height` ≥ 1.8
- [ ] One idea on the screen
- [ ] Radii 28 / 18 / 999
- [ ] Coloured button shadow, `2px` option borders
- [ ] Yellow used once, deliberately
- [ ] `rise` entrance, no scroll jump, reduced-motion respected
- [ ] Thai UI, English content, ครับ
- [ ] Works at 375px and 1440px with no breakpoint hacks
