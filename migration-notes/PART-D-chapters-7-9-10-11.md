# Video download — Part D (Chapters 7, 9, 10, 11) — say "start" to begin

**Say this to resume:** "Read migration-notes/PART-D-chapters-7-9-10-11.md and download the videos listed."

**You are one of 4 parallel sessions.** Each has a different chapter range —
don't touch anything outside the list below, another session is handling it.
No coordination needed between sessions; just work your own list.

## What this is

Downloading IELTS Writing course videos from Thinkific so they can be
migrated to Bunny Stream later (a separate step, not yours to do — just
download and rename, stop there).

## The method (same for every lesson on your list)

1. Go to `https://www.language-plan.com/manage/courses/1576306/contents/{thinkificId}`
   using the ID from your list below.
2. On that page find "Videos from your library" — it shows the exact filename
   + duration, e.g. `2024-12-17 14-56-40.mp4 [0:43:23]`. This is the only
   reliable way to identify the right file — **do not** try to match by
   duration alone against the video list; there are confirmed duplicate
   durations across unrelated courses in this account (640 total video files
   across every course, not just Writing).
3. Go to `https://www.language-plan.com/manage/videos` — this is the
   **legacy Video Library** page (distinct from `/manage/asset_library`,
   which is newer and does NOT support downloads — make sure you're on
   `/manage/videos`).
4. Type the exact filename into "Search by video name". If the box already
   has text in it, triple-click it first to select-all before typing —
   plain clicking sometimes doesn't clear it. **Screenshot after typing** to
   confirm the search box actually updated before continuing (the type
   action occasionally doesn't register on the first try).
5. Click the `⋮` menu on the matched row → **Download**.
6. Check `~/Downloads/` (e.g. `ls -lat ~/Downloads/`) — the file lands with
   Thinkific's own internal random filename (like `cth93ocqr9hc72q9h7qg.mp4`),
   not the descriptive one. **Immediately rename it** to
   `c{chapterIdx}-l{lessonIdx}.{ext}` using the numbers from your list below
   (e.g. `c7-l0.mp4`) — do this right after each download, before starting
   the next one, or you'll end up with unlabeled files you can't tell apart.
7. Move to the next lesson on your list.

Chrome extension sometimes disconnects mid-action — transient, just retry.

## Your lessons (chapters 7, 9, 10, 11 — 19 real videos)

| chapterIdx | lessonIdx | thinkificId | title | duration |
|---|---|---|---|---|
| 7 | 0 | 30463708 | ทำ Line Graph ไปพร้อมกัน | 13:10 |
| 7 | 1 | 30495207 | แบบฝึกหัด Line Graph | 0:27 |
| 7 | 2 | 30467638 | ทำ Bar Graph ไปพร้อมกัน | 18:29 |
| 7 | 3 | 30530634 | โจทย์ Bar Chart | 16:48 |
| 7 | 4 | 30563662 | โจทย์ Line Graph (3) | 19:30 |
| 7 | 5 | 30606904 | โจทย์ Table 2 อัน | 18:59 |
| 9 | 0 | 32664510 | เฉลยการบ้าน Line Graph - | 43:03 |
| 10 | 0 | 46998969 | Task 1 Test 1 - Line Graph | 17:26 |
| 10 | 1 | 46998967 | Task 1 / Test 2: Bar Chart | 16:22 |
| 10 | 2 | 46999027 | Task 1/ Test 3: Map of Central Library | 15:07 |
| 10 | 3 | 46999025 | Task 1/ Test 4: Line Graph : Change in prices of metals | 14:53 |
| 11 | 0 | 57545795 | Line graph | 22:15 |
| 11 | 1 | 57545800 | Map | 18:04 |
| 11 | 2 | 57545803 | Diagram | 20:19 |
| 11 | 3 | 57545807 | Mixed Graph | 17:20 |
| 11 | 4 | 57545817 | Competition or Cooperation (Discuss both views) | 20:22 |
| 11 | 5 | 57545827 | Shorter Working Work (To what extent do you agree?) | 20:20 |
| 11 | 6 | 57545844 | Globalization (international food) - positive or negative? | 18:35 |
| 11 | 7 | 57545850 | Should people save money? (To what extent do you agree?) | 16:16 |

Note: lesson 7,1 ("แบบฝึกหัด Line Graph") is only 27 seconds — real but tiny,
still download it, don't skip it (it's not one of the zero-duration items).

Chapter 8 (Final Exam) is not assigned to anyone — both its items
(Exam 2, Exam 3) are downloadable exam files, not videos. Nothing to do there.

## When done

You've finished this part — and this is the last one, so once you're done all
79 videos should be accounted for across the 4 parts. Don't proceed to Bunny
Stream upload or app deployment yet — that's a separate consolidation step
the user will kick off once all 4 parts report back. Just confirm all 19
files are renamed and present in `~/Downloads/`, then stop.
