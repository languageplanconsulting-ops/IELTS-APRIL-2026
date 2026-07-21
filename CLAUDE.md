# Project rules

## Writing Task 1 — SOP (authoritative; do not improvise)

These are the teacher's rules for every Academic Task 1 model essay and guided
builder. They are enforced by `npm run verify:task1`, which runs as part of
`npm run build`. If a rule and the code disagree, the rule wins — fix the code.

### Body paragraphs: sentence-opening transitions

Applies to **no-timeline / snapshot** and **map** prompts. (**Timeline** has its
own dedicated template below — it does not use `Starting with …` / `In terms
of …` openers.)

1. The **first** sentence of each body paragraph keeps its taught opener:
   - Pie / Map **Body 1** → `Starting with …`
   - Pie / Map **Body 2** → `In terms of …`
2. **Every sentence after the first** must begin with a transition, and only
   from this closed list — nothing else is allowed:

   - `However`
   - `On the other hand`
   - `In contrast`
   - `Likewise`
   - `Similarly`
   - `Interestingly`
   - `Surprisingly`
   - `It is interesting to note that`

Anything outside the list is a violation, including near-misses that have been
used before: `By contrast`, `By comparison`, `Notably`, `Although …`,
`While …`, `Together, …`, `Meanwhile`, `Moreover`, `Furthermore`, `In addition`,
or simply starting with the subject (`The remaining …`, `This gap …`, `In 2018, …`).

`process` prompts are out of scope for this rule.

### Timeline — dedicated template (authoritative; do not improvise)

Timeline prompts (line graph / bar chart / table showing two categories over
years) follow this exact skeleton. Report numbers only — never interpret,
characterise, or editorialise the data (no `revealing …`, `contrasting with
…`, `narrowing the gap …`, `confirming the marked contrast …`, `recording its
strongest result …`, etc.).

**Introduction** — one sentence:
```
The [chart] compares the [short general topic]: [category A] and
[category B], over a [N]-year period from [year] to [year], measured in
[unit].
```

**Overview** — one sentence, always joined with `while … that of … over the
given period`:
```
Overall, it can be clearly observed that while [A] experienced an upward
trend, that of [B] displayed a downward trend over the given period.
```
`fluctuated` / `remained unchanged over the given period` are the fallback
verbs when a category doesn't cleanly rise or fall — still one sentence.

**Body 1** — exactly 2 sentences, plain numbers only:
```
Starting in [year], [B] represented the highest figure in the data, at
[value], while [A] represented the lowest, at just [value], according to
the chart. However, by [year], the figure for [A] had increased [adverb]
to [value], while that for [B] had dropped [adverb] to [value] over the
same period.
```

**Body 2** — exactly 2 sentences, plain numbers only:
```
From [year] onwards, [A] continued to rise, reaching its peak at [value]
in [year], up from [value] in [year], as the chart shows. On the other
hand, [B] dropped consistently, reaching the lowest point at [value]
during the same year, down from [value] in [year], as clearly shown in
the data.
```
When a category peaks/bottoms out mid-period and then partly recovers by the
final year, swap `continued to rise` / `dropped consistently` for
`fluctuated`, and state both the peak-or-low value *and* the final value
(`… and finishing at [value] in [year]`) — still just reporting numbers.

`, while …` is allowed inside Timeline body sentences (it is the required
connector above) — this does not conflict with the snapshot/map transition
list, which is a separate rule for a different prompt kind.

### No-timeline / snapshot — dedicated template (authoritative; do not improvise)

Pie / bar / table prompts with no year axis. Report figures only — never rank one
figure against another in passing (`below that of …`, `more than twice …`,
`roughly half that of …`, `the second most valuable group`, `the best scores in
the table`) and never interpret (`reflecting the shift towards …`, `suggesting a
behavioural shift`, `this gap made X the clear leader`).

**Introduction** — one sentence:
```
The [chart] compare(s) [subject] [in/across different …], such as [A] and [B],
measured in [unit] [in YEAR].
```

**Overview** — one sentence: `Overall, it can be clearly observed that [X] was
the largest …, while [Y] was the largest / the smallest in share.`

**Body 1** — `Starting with [group], …`, three sentences:
```
Starting with [group], the figure for [1st] was the largest, at [v], followed by
[2nd], which stood at [v]. However, the figures for [3rd] and [4th] were
significantly smaller, standing at [v] and [v], respectively. However, that of
[5th] was the lowest, at just [v].
```

**Body 2** — `In terms of [group], …`, three sentences:
```
In terms of [group], the figure for [1st] was the largest, at [v]. Similarly, the
figures for [2nd] and [3rd] followed closely, at [v] and [v], respectively. In
contrast, that of [last] was the lowest, at just [v].
```

**Subjects wear the metric, then are referenced — never named twice.** The
leading subject of each body carries the thing the prompt actually measures —
`the ownership of smartphones`, `the spending on housing` (set `metricNoun`, plus
`metricPrep` for `on` / `in`). A prompt that names no such metric falls back to
the data-typed quantity phrase, and **only these three are allowed**:

- `the number of …` — countable head nouns (people, vehicles, trips)
- `the amount of …` — money or mass (dollars, water, energy)
- `the figure for …` — percentages, rates and scores (the default)

Never `the quantity of …`, and never a bare category label
(`smartphones were the largest`).

**Referencing — do not repeat the measure word in the same or the next
sentence.** After the opener, every later subject is a reference: `the figure(s)
for [X]`, then `that of [X]` for the closing figure. The words `share` / `shares`
never appear inside a body — they belong only to the Overview's `… in share`.
When the prompt names a metric, the Body 2 opener keeps the taught verb
(`the ownership of smartphones accounted for the largest proportion, at 88%`); a
bare `the figure for …` subject is copular (`… was the largest, at [v]`).

Use **`significantly`**, never `markedly`. Rating tables and hour charts read the
same way, with `highest`/`lowest` for the extremes
(`the figure for Changi was the highest, at 9.4` · `the figures for … were
significantly lower, standing at 8.2 and 8.0`).

**Figures ride a V-ing clause, not a bare `at`.** The middle sentence reads
`the figures for [3rd] and [4th] were significantly smaller, standing at 16% and
9%, respectively.` The copular `were` carries the `significantly …` degree, and
the `standing` V-ing clause carries the numbers.

**Rank strictly, and isolate the lowest.** Every figure is quoted largest-first,
and the final sentence of Body 1 covers the lowest category on its own,
referenced as `that of [X]`.

**Body 2 carries the cross-chart comparison** — the one comparison the SOP
allows, riding the closing `that of [last] … was the lowest, at just [v]` figure
because it states a gap rather than interpreting it. Two shapes:

- **Two places / groups** (`Australia` vs `Canada`):
  `…, which was higher than that of Australia by 24%.`
- **Same metric, two years** (set `timeComparison: true`): track the movement
  instead — `…, which increased dramatically from 2008 by 17%.` The adverb
  scales with the move: `dramatically` ≥40%, `significantly` ≥20%,
  `moderately` ≥10%, otherwise `slightly`. A figure level across both years reads
  `…, which remained unchanged since [year]`.

Tables are exempt: their two bodies are different columns, so comparing them
across bodies is meaningless.

**Chart data comes first.** A "portion" prompt needs enough to compare: prefer
**two pies** over one, with **five or six slices each** (see
`snapshot-vietnam-us-exports`). A single four-slice pie cannot fill a 150-word
answer on figures alone — enrich the chart rather than padding the prose.

**`which` clause.** A closing figure may carry one relative clause instead of a
new sentence: the cross-chart gap above, or a plain
`…, which stood at the lowest level.`

**Word-floor top-up.** Task 1 answers must clear 150 words. Where a chart is still
too thin, and only then, append the taught gap sentence, largest gaps first:
```
[Interestingly | Similarly | Likewise | Surprisingly], the figure for [X] was
lower than that of [Y] by [gap].
```
`buildSnapshotExercise` adds these automatically via `padSnapshotToWordFloor`;
never hand-write filler instead.

### Overview

Every Overview — all prompt kinds — is exactly one sentence opening with:

```
Overall, it can be clearly observed that …
```

No-timeline overviews then use `…, while …` mid-sentence to join the two
features. Never `contrasting with` or `leaving other sources`. (Timeline
overviews also use `while …`, per the dedicated template above.)

### Introduction

Every Introduction — all prompt kinds — is exactly **one sentence**, with no
extra clause tacked on (no `presenting …`, `allowing … to be identified`,
`highlighting …`, etc.). The shape differs by kind:

- **Timeline**: see the dedicated template above.
- **No-timeline / snapshot**: see the dedicated template above.
- **Map**: `The maps compare [subject] …` (existing pattern; one sentence).
- **Process**: `This chart shows the process of … from start to completion.`

### Other standing rules

- Essays are **150–190 words** (`countTask1Paragraphs`).
- `respectively` always takes a preceding comma.
- Timeline bodies must state real chart years.
- Blank counts: every Overview has **at least 5** blanks.
