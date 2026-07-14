# Authoring spec — expand ONE IELTS Writing Task 1 guided exercise

You are an expert IELTS Writing Task 1 author and English grammar teacher for **Thai** students,
editing a TypeScript data file. You will be told one `promptId` and one **connective class**
(TIMELINE / SNAPSHOT / MAP / PROCESS).

## Step 1 — Read the current exercise
- Read `src/writingGuidedBuilder.ts`.
- Read the top of the file (roughly lines 22–110) to learn the exact `WgbExercise` / `WgbStep` /
  blank types, the `t` / `sel` / `typ` helper signatures, the `focus` categories, and the coach copy.
- Find the object in `WRITING_GUIDED_BUILDERS` whose `promptId` equals your assigned id. That whole
  object (`id`, `promptId`, `steps[]`) is your INPUT — it already contains the correct facts and a
  correct (if short) model essay.

## Step 2 — The helpers (call them; never redefine them)
- `t('fixed text')` → literal text segment.
- `sel(id, options[], answer, focus, explain)` → dropdown blank. `answer` MUST be one of `options`.
  `focus` ∈ `'paraphrase' | 'word-choice' | 'transition' | 'referencing' | 'trend-phrase'`.
- `typ(id, base, answers[], focus, explain)` → typed blank. `base` = dictionary form shown as a hint;
  `answers` = accepted forms (case-insensitive). `focus` ∈ `'verb-tense' | 'ving-clause' | 'v3-clause' | 'degree-adverb'`.
- The 5th argument **`explain`** is a **Thai** string (NEW) that tells the student WHY the correct
  answer is right. It is shown ONLY when they answer wrong.

Example of one expanded blank:
```
sel('gb1-i1', ['illustrates', 'argues', 'decides'], 'illustrates', 'paraphrase', 'illustrate = แสดง/บรรยายข้อมูลในกราฟ ส่วน argue (โต้แย้ง) และ decide (ตัดสินใจ) เป็นการกระทำของคน ใช้บรรยายกราฟไม่ได้'),
typ('gb1-b1', 'be', ['was'], 'verb-tense', 'ประธานเอกพจน์ (the percentage) + เล่าอดีต จึงใช้ was'),
```

## Step 3 — Rewrite the exercise object (all rules must hold)
1. **FACTS ARE FIXED.** Keep every number, year, %, unit, entity name and their order EXACTLY as in
   the input. Rephrase wording freely, but never invent or change data.
2. Keep the same `id` and `promptId`. Keep the four steps (intro, overview, body1, body2) with their
   `role`, `labelTh`, `hintTh` and step `id`.
3. **BLANK COUNT: the whole exercise must contain about 66–72 blanks total** (count `sel` + `typ`),
   up from ~21. Distribute ~14–20 blanks per paragraph. Aim high but keep every sentence natural and
   grammatical — do NOT blank tiny function words just to hit a number.
4. **What to blank** (mix `sel` and `typ`): reporting verbs & paraphrase nouns (illustrates /
   proportion / amount…), verb tense & forms (past simple for trends, V-ing result clauses, V3 /
   passives), degree adverbs (dramatically / steadily / gradually…), comparatives & superlatives
   (highest / largest…), linking words (transition), reference words (this figure / that of / those
   of), time & range prepositions (from…to / at / by), and general word-choice items.
5. **EXPLANATIONS: EVERY blank (sel AND typ) must have a Thai `explain`** (~1 sentence). For `sel`,
   say why the answer wins and why the distractors fail (grammar or meaning). For `typ`, state the
   grammar rule (past simple เพราะเล่าอดีต / V-ing clause / passive V3 / ประธานเอกพจน์–พหูพจน์). Keep
   it short and friendly.
6. **DISTRACTORS:** each `sel` has 2–3 options; distractors plausible but clearly wrong.
7. **BANNED everywhere** — never use: `cross`, `crossing`, `crossed`, `cross paths`, `overtake`,
   `overtaking`, `overtook`, `surpass`, `surpasses`, `surpassing`, `surpassed`, and the absolute
   construction "with X surpassing/overtaking Y". If the input uses them (e.g. two lines *crossing* /
   one line *overtaking* another), you MUST rewrite that idea with allowed patterns — describe the two
   movements in parallel using `while` / `whereas` (e.g. "while online learning continued to climb,
   reaching 74%, in-person attendance kept falling to 26%").
8. **CONNECTIVES — depends on your class (see below).**
9. **IDs:** every blank id unique within the exercise; keep the existing prefix scheme (e.g. `gb1-…`)
   and add ids like `gb1-i4`, `gb1-b7`, `gb1-c8`.
10. **APOSTROPHES:** inside single-quoted TS strings write any apostrophe as the curly `’` (U+2019),
    e.g. `'Vietnam’s exports'`. Never put a straight `'` inside a single-quoted string. Thai text is fine.

### Connective rules by class
- **TIMELINE** (line / bar / table TREND): for contrast between two trends or groups use ONLY
  `while`, `whereas`, or `although`. Do NOT use `However`, `On the other hand`, `In contrast`,
  `Meanwhile`, `yet`, `Conversely` as the contrast device — replace them with while/whereas/although.
  Allowed sentence-combining devices: a comma + `and then …`, a comma + `which …`, and `most`
  (e.g. "most of this growth"). You MAY still use: `respectively` (ALWAYS a comma right before it),
  `followed by`, V-ing result clauses (`reaching…`, `peaking…`, `climbing…`), `by the end of the
  given period`, and `Overall,` to open the overview. Trend paragraphs are PAST simple.
- **SNAPSHOT** (pie / bar / table / mixed comparison): for contrast prefer `whereas`, `while`,
  `although`. Avoid `However` / `On the other hand` as the main contrast device. Keep topic-framing
  phrases (`In terms of`, `Regarding`, `As for`). `respectively` ALWAYS with a comma before it.
  Use `followed by` and `that of / those of` for comparison. Body paragraphs are PAST simple.
- **MAP** (change over time): use PASSIVE voice for changes (`was replaced by`, `were demolished`,
  `was converted into`, `was turned into`). Contrast with `whereas` / `while` / `although`. Time
  framing `In 2005`, `By 2025`, `Meanwhile`. Avoid `However` / `On the other hand`.
- **PROCESS** (how something is made): PASSIVE PRESENT (`are picked`, `is dried`, `are packaged`) and
  sequencers (`First`, `Next`, `After that`, `Then`, `Subsequently`, `Once …`, `Finally`). No numbers,
  no tense contrast. It is good to blank the sequencers as `transition` items.

## Step 4 — Output
- Write ONLY the finished object literal to `src/generated/wgb/<promptId>.txt`.
- Content must START with `{` and END with `}` — no `export`, no `const`, no `as WgbExercise`, no
  trailing comma, no markdown fences, no prose. It must be valid TypeScript ready to drop straight
  into the `WRITING_GUIDED_BUILDERS` array.
- Use only `t()`, `sel()`, `typ()`. Match the existing formatting (one segment per line).
- After writing the file, reply with just: total blank count + "no banned words".
