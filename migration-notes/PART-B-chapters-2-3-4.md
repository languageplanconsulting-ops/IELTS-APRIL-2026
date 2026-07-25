# Video download — Part B (Chapters 2, 3, 4) — say "start" to begin

**Say this to resume:** "Read migration-notes/PART-B-chapters-2-3-4.md and download the videos listed."

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
   (e.g. `c2-l0.mp4`) — do this right after each download, before starting
   the next one, or you'll end up with unlabeled files you can't tell apart.
7. Move to the next lesson on your list.

Chrome extension sometimes disconnects mid-action — transient, just retry.

## Your lessons (chapters 2, 3, 4 — 20 real videos)

| chapterIdx | lessonIdx | thinkificId | title | duration |
|---|---|---|---|---|
| 2 | 0 | 30328169 | โจทย์​ Process Diagram | 29:06 |
| 2 | 1 | 30499312 | โจทย์ Process Diagram (1) | 14:51 |
| 2 | 2 | 45351676 | วิธีคิดโจทย์ Process Diagram (BAND 7.5+) | 17:14 |
| 2 | 3 | 45305212 | คำศัพท์ เทคนิค & วิธีคิดโจทย์ MAP | 24:56 |
| 2 | 4 | 30388696 | โจทย์ Map | 16:53 |
| 3 | 0 | 30304189 | โจทย์ผสม : Bar chart + line graph | 15:51 |
| 3 | 1 | 30361974 | โจทย์ผสม Bar chart + pie chart | 16:49 |
| 3 | 2 | 33381858 | Pie chart + table | 26:23 |
| 3 | 3 | 33875102 | Pie chart + bar chart | 25:18 |
| 3 | 4 | 34999732 | Summary - Checklist for Band 7 (write along) | 28:25 |
| 4 | 0 | 30369416 | พื้นฐาน Task 2 | 40:31 |
| 4 | 1 | 30355724 | พื้นฐาน Task 2 (2) | 17:27 |
| 4 | 2 | 35892741 | เทคนิคการหาไอเดียและคำศัพท์หรับ Band 7 (Lexical Resource) | 39:14 |
| 4 | 3 | 30355495 | โจทย์​ Double Question | 53:08 |
| 4 | 4 | 35369276 | Double Question (Advanced) for band 7.5+ | 37:49 |
| 4 | 6 | 30355500 | โจทย์ Disadvantages & advantages | 37:05 |
| 4 | 7 | 33876786 | โจทย์​เกี่ยวกับ Nationalism (Patriotism) - March 20 | 29:09 |
| 4 | 9 | 32506089 | การเขียน To what extent | 46:40 |
| 4 | 11 | 32590161 | โจทย์​ Discuss both views and give your own opinion (โจทย์ 23 feb 2022) | 49:08 |
| 4 | 13 | 31720370 | โจทย์ To what extent ล่าสุด (2025) | 24:10 |

(Skipped in chapter 2: lesson 5 — quiz, no video. Skipped in chapter 3:
lesson 5 — exercise, no video. Skipped in chapter 4: lessons 5, 8, 10, 12 —
all exercises, no video.)

## When done

You've finished this part. Don't proceed to Bunny Stream upload or app
deployment — that happens once all 4 parts are done, as a separate step. Just
confirm all 20 files are renamed and present in `~/Downloads/`, then stop.
