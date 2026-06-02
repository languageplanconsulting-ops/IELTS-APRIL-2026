---
description: Audit every Normal Reading passage against the original Cambridge IELTS source. Free — runs through Claude Code Max.
---

You are auditing IELTS Reading content for an English-tutor app. The user has reported passage and question inconsistencies. Your job is to verify every passage and question against the **original Cambridge IELTS source material** and flag any mismatches.

## Setup

The review folder is `./review/`. It contains one markdown file per passage. Open `./review/INDEX.md` to see the full list.

If the folder is empty, run `npm run export:reading-for-review` first.

## How to verify each passage

For each `review/*.md` file:

### Step 1 — Read the passage as-is

Open the file. Note the exam id (e.g. `cambridge-11-test1-passage1`) and the passage title.

### Step 2 — Find the official source

Web-search for the original passage on these IELTS practice sites (all public, no paywall):
- mini-ielts.com (most complete, official-quality transcripts)
- ielts-mentor.com
- engexam.info
- ieltsxpress.com
- ielts-up.com

Search like: `"Crop-growing skyscrapers" cambridge 11 test 1 reading`

Use **WebFetch** to pull the full page content. Cross-reference against at least two sources when possible — if they disagree, prefer mini-ielts.com.

### Step 3 — Compare passage body line-by-line

Watch specifically for:
- **OCR corruption** — characters that are clearly wrong: `�eople` → `people`, `enoµgh` → `enough`, `worid` → `world`, `gre9tly` → `greatly`, `0pti0n` → `option`. Common Cambridge PDF OCR failures.
- **Hyphenation artifacts** — `Single­ storey`, `non­ edible`, `food- bearing` (broken across line breaks)
- **Missing sentences / paragraphs** — compare paragraph count and total length
- **Run-together sentences** — two sentences merged without space (e.g. `farming.It`)
- **Wrong text entirely** — sometimes a paragraph got pasted from a different passage

### Step 4 — Compare each question

For each question:
- **Prompt wording** — should match the official version word-for-word
- **Correct answer** — should match the official key
- **Option set** (for MCQ / matching) — letters and texts must match
- **Question type** — sometimes an item is labeled MCQ when it's actually T/F/NG

For matching-headings: the heading list and the assigned letter must both match the source.

### Step 5 — Record findings

For every issue, append to `./findings.json` (it's an array). Each entry:

```json
{
  "examId": "cambridge-11-test1-passage1",
  "passageNumber": 1,
  "questionNumber": 5,
  "kind": "passage_ocr",
  "currentValue": "the worid's population",
  "suggestedValue": "the world's population",
  "source": "https://mini-ielts.com/...",
  "reasoning": "OCR corruption — 'worid' is not a word; verified against mini-ielts.com transcript.",
  "confidence": "high"
}
```

Use `kind`:
- `passage_ocr` — character-level OCR fixes in passage body
- `passage_truncated` — passage body is missing text from the original
- `missing_paragraph` — entire paragraph absent
- `wrong_prompt` — question prompt doesn't match source
- `wrong_answer` — correctAnswer doesn't match source key
- `wrong_options` — MCQ/matching option set differs
- `wrong_heading_letter` — matching-headings answer letter is invalid
- `extra_paragraph` — passage has content that isn't in the source
- `other` — anything else; describe in reasoning

Use `confidence`:
- `high` — verified against an authoritative source (mini-ielts.com or two independent IELTS practice sites agree)
- `medium` — confident based on context (e.g., obvious OCR error like `�eople`) but couldn't find an exact source
- `low` — suspicious but uncertain

**Only `high`-confidence findings will be auto-applied.** Medium and low get reported for manual review.

## Pacing & rate-limit hygiene

- The review folder has 100+ files. Don't try to verify all at once.
- Work in **batches of 5 passages**. Save findings after each batch (append to findings.json).
- Use the `Task` tool to fan out: launch 5 parallel Explore subagents, each handling one passage. They report back, you merge into findings.json.
- If web search rate-limits, fall back to context-based checks (obvious OCR is still flagable without a source URL — confidence: medium).

## When done

Print a summary:
- Total files reviewed
- Total findings by kind
- Total findings by confidence
- Note that running `npm run apply:reading-fixes` will write the high-confidence ones to the source files.

## What to do if you find a passage that's mostly garbage

If the OCR damage is extensive (more than 5-10 fixes needed), record a single `passage_truncated` finding suggesting the whole `bodyParagraphs` array be replaced — include the full corrected text from the source as `suggestedValue`. The apply script handles whole-passage replacement.

$ARGUMENTS
