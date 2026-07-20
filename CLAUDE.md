# Project rules

## Writing Task 1 — SOP (authoritative; do not improvise)

These are the teacher's rules for every Academic Task 1 model essay and guided
builder. They are enforced by `npm run verify:task1`, which runs as part of
`npm run build`. If a rule and the code disagree, the rule wins — fix the code.

### Body paragraphs: sentence-opening transitions

Applies to **timeline**, **no-timeline / snapshot**, and **map** prompts.

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

### Overview

Every Overview — all prompt kinds — is exactly one sentence opening with:

```
Overall, it can be clearly observed that …
```

No-timeline overviews then use `…, while …` mid-sentence to join the two
features. Never `contrasting with` or `leaving other sources`.

### Introduction

Every Introduction — all prompt kinds — is exactly **one sentence**, with no
extra clause tacked on (no `presenting …`, `allowing … to be identified`,
`highlighting …`, etc.). The shape differs by kind:

- **Timeline**: `The [chart] compares [subject] between [year] and [year]
  across the categories included in the data.`
- **No-timeline / snapshot** (pie/bar/table, single or paired charts):
  `The [chart] compares [subject], such as [examples], measured in [unit].`
  That's it — nothing after `measured in [unit].`
- **Map**: `The maps compare [subject] …` (existing pattern; one sentence).
- **Process**: `This chart shows the process of … from start to completion.`

### Other standing rules

- Essays are **160–190 words** (`countTask1Paragraphs`).
- `respectively` always takes a preceding comma.
- Timeline bodies must state real chart years.
- Blank counts: every Overview has **at least 5** blanks.
