# Hand-off: continue the reading audit in Claude Code Max

The in-chat audit covered Cambridge 11 (12 passages → 12 confirmed bugs).
Continuing here would have burned ~4.5M more tokens. You have a $100/mo
Max sub — run the rest there for $0 extra.

## Step 1 — open Claude Code in this folder

```
cd "/Users/natchanon/IELTS SPEAKING"
claude
```

## Step 2 — run the audit slash command

```
/audit-reading
```

That kicks off the same workflow the chat agents were doing:
- reads every `review/*.md` file
- web-verifies each passage against mini-ielts.com / ieltstrainingonline.com etc.
- appends findings to `./findings.json`

It runs in parallel batches of 5; takes ~30–60 min wall clock for all 96
passages.

**Note:** the existing findings.json already has the Cambridge 11 work.
Tell Claude:

> findings.json already has 12 findings for Cambridge 11. Skip those exam
> ids and start from Cambridge 12 Test 1 Passage 2 onwards. Append to
> findings.json, don't overwrite.

A backup of just the Cambridge 11 seed is saved at
`findings-cambridge11-seed.json` in case anything overwrites.

## Step 3 — review findings.json

```
cat findings.json | jq '.[] | select(.confidence == "high")'
```

## Step 4 — apply

```
npm run apply:reading-fixes -- --dry-run
npm run apply:reading-fixes
```

## What's already confirmed in findings.json

12 findings across Cambridge 11:

  4 × passage_ocr (caret, HTML entity, name spelling, currency artifact)
  3 × passage_truncated (Falkirk opening, story-of-silk title, math-music transition sentence)
  3 × wrong_prompt (C11T1P2 Q19 cut off, C11T3P2 Q20+Q21 swapped)
  2 × wrong_answer (C11T2P2 Q25/Q26 possibly swapped — medium confidence)

The critical ones:

  - **C11T3P2 Q20 ↔ Q21**: prompts are swapped. Students answering Q20
    are reading Q21's prompt. Fix this manually:
        Q20 prompt should be: "To prepare for migration, animals are likely to"
        Q21 prompt should be: "During migration, animals are unlikely to"

  - **C11T1P2 Q19**: prompt is truncated. Should end with
        "...took into account the presence of a nearby ancient monument."

  - **C11T1P2 passage**: opening paragraph missing the
        "Opened in 2002... £84.5m Millennium Link project" framing.

