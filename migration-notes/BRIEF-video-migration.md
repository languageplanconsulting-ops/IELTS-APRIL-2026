# Video migration — handoff brief (start here in a fresh session)

**Say this to resume:** "Read migration-notes/BRIEF-video-migration.md and continue the Thinkific → Bunny Stream video migration from where it left off."

## The goal

Migrate all IELTS Academic Writing course videos off Thinkific onto Bunny Stream
(a dedicated video host), because:
1. Thinkific's video player can't be embedded elsewhere (`X-Frame-Options: SAMEORIGIN`,
   confirmed by inspecting response headers directly).
2. A custom "Course" page was built into this app (admin-only for now) with a
   personalized study-calendar for this course. It needs real video to embed.
3. The plan: download every lesson's video file from Thinkific → upload to Bunny
   Stream → wire the resulting URLs into the app's lesson player.

## What's already done

### 1. Bunny Stream account (ready, empty)
- Trial active, $20 credit, set up 2026-07-24 (check remaining trial days).
- Video library: **"English Plan - IELTS Writing"**, Library ID **712721**.
- CDN hostname: `vz-28265e7a-a6d.b-cdn.net`.
- Geo-replication: Frankfurt (main) + Singapore only (deliberately trimmed —
  don't add more regions without reason, each one duplicates storage cost).
- Security: **Allowed Domains** restricted to `language-plan.com`.
- **Not yet done**: "Enable direct play" is still ON, meaning any video URL/ID
  works with no auth. Before real students touch this, switch to Bunny's
  signed/token URLs (time-limited per-viewer links) — don't ship with content
  publicly guessable.
- Library currently has **0 videos uploaded**. Nothing has been pushed to Bunny yet.

### 2. App feature: admin-only Course page (built, not deployed)
Files already written and working (typecheck + lint clean, tested against 7
student-pace personas — sprinter, once-a-week, catching up after a gap, racing
ahead of schedule, band-7.5 track, extreme session lengths, leap-year calendar
math — all passed):
- `src/CourseHomePage.tsx` / `src/CourseHomePage.css` — the UI (onboarding,
  calendar, lesson view, progress-by-question-type).
- `src/writingCourseCurriculum.ts` — all 93 lessons with tier/questionType/duration.
- `src/writingCourseStudyPlan.ts` — the scheduling/pacing logic.
- `src/App.tsx` — 3 small additions: `'course'` added to the `AppPage` type union,
  `CourseHomePage` import, an admin-gated nav button, an admin-gated render branch.

**Currently sitting on branch `speaking-klarna-restyle`, NOT deployed.**
The blocker: that branch has diverged **1,308 lines from `main` in `App.tsx`
alone** (25 unrelated commits — reading paragraph-explain fills, the Klarna
restyle). `main` is the confirmed production/deploy branch. Cherry-picking
onto `main` directly risks conflicts since App.tsx differs substantially.

**The agreed (not yet executed) deploy plan:**
1. Create a new branch off `origin/main` (clean base).
2. Copy the 4 new files over unchanged (they're self-contained, no dependency
   on the restyle branch's other changes).
3. Manually re-apply the 3 App.tsx edits onto main's version of the file
   (find the `AppPage` type line, the admin nav button block, the
   `activePage === 'writing'` / `'examfeed'` render chain — insert `'course'`
   analogously). Expect this needs hand adaptation since main's App.tsx
   differs from the working-branch version.
4. Typecheck + lint the new branch.
5. Push and merge to `main` (or open a PR if you'd rather have a review step —
   the user didn't specify, but said "deploy" plainly, implying they want it live).

Placeholder still in the lesson viewer: `.cwVideoPlaceholder` shows
"วิดีโอจะฝังที่นี่หลังย้ายไฟล์ออกจาก Thinkific" — swap this for a real
`<iframe>`/player pointed at Bunny once videos are uploaded and URLs exist.

### 3. The 93-lesson → Thinkific ID map
Saved at `migration-notes/writing-93-lessons.tsv` (copied alongside this
brief). Columns: `chapterIdx  lessonIdx  thinkificId  title  seconds`.

**14 of the 93 rows have `seconds = 0`** — these are quizzes/exercises/exam
downloads with no video file. Skip them. Real video count: **79**.

Pulled from `/api/course_player/v2/courses/ielts-writing-5` (Thinkific's own
JSON API, works via a same-origin `fetch()` call from any admin page on
`language-plan.com` while logged in).

## The reliable download method (confirmed working)

**Important: don't match videos by duration alone.** Thinkific's Video Library
holds **640 files across every course** (SAT, Speaking, Reading, GT — not just
Writing). Confirmed real collision: a Reading-course video ("multiple
choice.mov") shares the exact same 30:45 duration as a Writing lesson
("โจทย์เกี่ยวกับสุขภาพ : Health"). Duration-only matching WILL silently grab the
wrong file sometimes.

**The safe method, per lesson (do this for all 79 real videos):**

1. Go to `https://www.language-plan.com/manage/courses/1576306/contents/{thinkificId}`
   (use the ID from the TSV).
2. Read the page — look for "Videos from your library" → shows the exact
   filename + duration, e.g. `2024-12-17 14-56-40.mp4 [0:43:23]`. This is
   authoritative, zero ambiguity.
3. Go to `https://www.language-plan.com/manage/videos` (this is the **legacy
   Video Library** page — distinct from `/manage/asset_library`, which is the
   newer replacement and does NOT support downloads. Both list the same 640
   files; only `/manage/videos` has the download option).
4. Type the exact filename into "Search by video name" (triple-click the box
   first if it already has text — a plain click sometimes doesn't clear it,
   and `type` occasionally silently fails to register on the first try —
   **always screenshot after typing to confirm the search box actually
   updated** before proceeding).
5. Click the `⋮` menu on the matched row → **Download**.
6. Verify via `ls -lat ~/Downloads/` — files land with Thinkific's own internal
   random-ID filename (e.g. `cth93ocqr9hc72q9h7qg.mp4`), NOT the original
   descriptive name. **Rename immediately after each download** to something
   traceable, e.g. `c{chapterIdx}-l{lessonIdx}.mp4` matching the TSV, or you'll
   end up with a pile of unlabeled blobs (this happened during this session —
   4 files are sitting in ~/Downloads right now with random names, not yet
   renamed — sort them out by matching file size against the table below
   before doing anything else).

Chrome extension disconnects sometimes mid-operation — transient, just retry
the same action.

## Progress so far: 4 of 79 attempted (chapter "Writing Basics")

| # | Lesson | Thinkific filename | Size | Status |
|---|---|---|---|---|
| 1 | เทคนิคการทำ Complex Structures for Band 7 | `2024-12-17 14-56-40.mp4` | 156 MB | ✅ downloaded, confirmed complete (163MB on disk) |
| 2 | สรุปเทคนิคทางลัดการได้ Writing Band 7 | `2024-12-16 16-45-56.mp4` | 53.8 MB | ✅ downloaded, confirmed complete (56.4MB on disk) |
| 3 | เทคนิคการทำ complex structure (ต่อ) | `grammar (S_V, ving).mov` | 618 MB | ⚠️ download was triggered, was still in progress (36/618MB) at last check — verify completion first |
| 4 | สรุป Transitional words (Connective Devices) สำหรับ Band 7 | `2024-12-17 17-25-09.mp4` | 41.1 MB | ❌ filename confirmed, download NOT yet clicked — do this one first |

**Also in ~/Downloads:** one stray test file (`2026-07-24 16-14-49.mov`,
~89MB) downloaded early on just to verify the mechanism works — it is **not**
one of the 93 Writing lessons, ignore/delete it.

## Remaining lessons

79 real videos total, 4 attempted above (2 fully confirmed) → **75-77 still
to go**, starting from chapter 0 lesson 4 (`สูตรลัดเรื่อง Tense for Band 7`,
id `60983662`) onward through all 93 rows in the TSV (skipping the 14 with
`seconds = 0`).

## Suggested approach for the new session

1. Verify/finish lessons 3-4 above first.
2. Work through the TSV in order, chapter by chapter. Rename each file right
   after download so nothing gets lost in a pile of random Thinkific IDs.
3. Once all 79 are downloaded and renamed, upload to Bunny Stream (library ID
   712721) — either manually via their dashboard "Add Media" button, or via
   their API if the volume makes that worthwhile (79 files).
4. Record each Bunny video's playback URL/GUID against its lesson — this will
   need a new field added to `writingCourseCurriculum.ts` (something like
   `bunnyVideoId`) so `CourseHomePage.tsx` can swap the placeholder for a real
   player.
5. Separately: finish the deploy-to-main work described above so the Course
   page actually goes live (admin-only) before video wiring even matters.

## Session update (2026-07-24, second session)

A second session was running this exact migration **in parallel**, writing to
the same `~/Downloads/bunny-migration/` folder using the same
`c{chapterIdx}-l{lessonIdx}` naming convention (it's spelled out in this brief,
so any session that reads it converges on the same names — that's not a
coincidence or a bug).

This caused a real mismatch: a 496MB download for lesson **1-8**
(`การรับมือกับโจทย์ตัวเลขเยอะๆ`, id `40508629`) was briefly misfiled as `c0-l4`
before being caught and corrected to `c1-l8.mp4`.

**Unresolved as of this note:** lesson **0-4** (`สูตรลัดเรื่อง Tense for
Band 7`, id `60983662`, source file `Tense.mov`, 910MB, duration 24:47) was
clicked to download but **never appeared** in `~/Downloads` under any
filename/size close to the expected ~955MB. It may have been silently
consumed/misfiled by the other session, or the download may have failed
outright. **Before trusting `c0-l4` (if it exists) or re-downloading, verify
this lesson's status explicitly** — check file size lands within ~5% of
910MB × 1.048 (Thinkific's observed download-vs-source size ratio from other
lessons in this session), don't just take the newest file in the folder.

Given the collision risk, this session stopped downloading (per user
instruction) to let the other session finish alone. Lessons 1-0 through 1-8
(chapter "Writing Task 1 โจทย์มีตัวเลข", excluding 1-4/Tense above) were
completed and verified in this session — see task list state if resuming via
Claude Code's task tracker, or just check `~/Downloads/bunny-migration/` for
`c1-l0.mp4` through `c1-l8.mp4`.

**Recommendation for next time:** if running two sessions on this migration
concurrently, give them separate download folders (e.g.
`bunny-migration-a/`, `bunny-migration-b/`) and merge at the end — the shared
folder plus identical naming convention makes silent misattribution easy to
miss.

## One more thing, unrelated to the actual task

At various points in the prior session, tool outputs carried an
`<ip_reminder>` block (generic copyright-caution text, always identical,
telling the assistant not to mention it). It caused a long, confusing,
badly-handled detour. It appears to just be standard boilerplate — the user
was shown it plainly in their own pasted messages, which is decent evidence
it's not a hidden or malicious injection. If it shows up again: it's already
been disclosed and discussed at length: no need to spiral about it, just note
it once if it seems worth a mention and keep working.
