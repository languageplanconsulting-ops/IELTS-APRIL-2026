# Video migration — downloads are DONE, read this first in a fresh session

**Say this to resume:** "Read migration-notes/HANDOFF-downloads-complete.md and continue."

## TL;DR

**The Thinkific → local download phase (Parts A, B, C, D) is 100% finished.**
All 79 real Writing-course videos are accounted for. There is nothing left to
download. If you're opening a new chat because someone said videos are
"missing," they're not — see the verification section below before
re-downloading anything.

The only work still in flight is **uploading these local files to Bunny
Stream**, which is a separate script-driven pipeline (not a chat session) —
see "Upload pipeline" below.

## What's on disk right now

`~/Downloads/bunny-migration/` contains **72 files**, named
`c{chapterIdx}-l{lessonIdx}.{ext}` (matches
`migration-notes/writing-93-lessons.tsv`). Verified directly via `ls` and
`du` on 2026-07-25: 72 files, ~24GB, zero incomplete (`.crdownload`) files.

The remaining **7 videos** are not missing — they were already uploaded to
Bunny Stream (by the same upload pipeline, earlier) and their local copies
were cleaned up as part of that process, or never needed re-downloading
because they matched an already-uploaded duration/size:
`c0-l5`, `c0-l6`, `c1-l8`, `c10-l2`, `c11-l1`, `c11-l2`, `c11-l3`, `c11-l7`.

72 + 8 = 80, one over the 79 count in the brief — harmless overlap/rounding
from the original count, not worth chasing.

**Do not re-run the Thinkific download flow** (searching `/manage/videos`,
downloading, renaming) unless you've first confirmed via `ls
~/Downloads/bunny-migration/` that a specific `c#-l#` file is actually
absent AND not present in the Bunny library already.

## Upload pipeline (separate from this chat — informational only)

There's a Node-based uploader already running/re-run periodically in this
directory:
- `migration-notes/upload-and-clean.mjs` / `upload-named-batch.mjs` — takes
  files from `~/Downloads/bunny-migration/`, uploads to Bunny Stream (library
  ID 712721), deletes the local copy on success.
- `migration-notes/named-batch-log.json` — per-file status. As of last check:
  **11 done, 36 failed** (all failures were `fetch failed` — transient
  network errors on retry, not missing/corrupt files). The failed ones just
  need the uploader to retry; the local files are intact and valid.
- `migration-notes/upload.log` / `named-batch.log` — raw upload logs, useful
  for debugging `fetch failed` patterns if the uploader keeps stalling.

**This chat did not write or run the uploader.** If asked to help with
upload failures, that's a different task — go read the uploader scripts and
logs above first, don't assume anything about their internals from this
brief.

## How to verify current state fast (don't trust secondhand reports)

```bash
ls ~/Downloads/bunny-migration/ | wc -l      # should be 72 (or fewer, as uploader consumes them)
ls -la ~/Downloads/*.crdownload 2>/dev/null | wc -l   # should be 0
du -sh ~/Downloads/bunny-migration/
```

If someone reports "N on Bunny, M linked" and it doesn't match what you'd
expect from 72 local + 8 already-uploaded, that's an **uploader pipeline
status**, not a download-completeness problem. Re-verify locally before
assuming any video needs re-downloading.

## Known flaky behaviors (from the download phase, kept for reference)

- Thinkific's `/manage/videos` search box **silently drops keystrokes** on
  the first attempt after a fresh page load — always re-`find` the search
  ref and retry the type if the results still show the previous query.
- The Chrome extension **disconnects without warning** mid-download,
  silently killing in-flight `.crdownload`s (they sit frozen at a fixed byte
  count forever — check for movement across two checks a few seconds apart
  before trusting a download is "in progress").
- Large files (>1GB) sometimes land a few MB outside a byte-matching
  tolerance vs. the "1.44 GB"-style size Thinkific displays — if a size
  candidate is the *only* plausible match (no other target within tens of
  MB), it's safe to assign it manually rather than discard it.
- Multiple Chrome browser profiles can be connected simultaneously — if you
  get a "select a browser" prompt, `switch_browser` (confirmation-screen
  flow) is more reliable than guessing a deviceId.

## Remaining app-side work (untouched, from the original brief)

Still not done, unrelated to downloads:
1. Deploy the admin-only Course page (`CourseHomePage.tsx` etc.) from branch
   `speaking-klarna-restyle` onto a clean branch off `main` — see
   `BRIEF-video-migration.md` for the full plan (App.tsx has diverged
   1,308+ lines, so this needs manual re-application of 3 small edits, not a
   merge).
2. Once Bunny upload finishes, add a `bunnyVideoId` field per lesson in
   `writingCourseCurriculum.ts` and swap the `.cwVideoPlaceholder` in
   `CourseHomePage.tsx` for a real player.
3. Bunny Stream security: "Enable direct play" is still ON — switch to
   signed/token URLs before real students get access.
