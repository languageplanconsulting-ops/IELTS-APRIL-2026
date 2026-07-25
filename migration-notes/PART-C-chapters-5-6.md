# Video download — Part C (Chapters 5, 6) — say "start" to begin

**Say this to resume:** "Read migration-notes/PART-C-chapters-5-6.md and download the videos listed."

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
   (e.g. `c5-l0.mp4`) — do this right after each download, before starting
   the next one, or you'll end up with unlabeled files you can't tell apart.
7. Move to the next lesson on your list.

Chrome extension sometimes disconnects mid-action — transient, just retry.

## Your lessons (chapters 5, 6 — 17 real videos)

| chapterIdx | lessonIdx | thinkificId | title | duration |
|---|---|---|---|---|
| 5 | 0 | 33154191 | โจทย์​ 25 Feb - Nuclear weapons benefit the world at large? | 39:18 |
| 5 | 2 | 31013614 | โจทย์เกี่ยวกับ Gender Equality | 32:14 |
| 5 | 3 | 31079605 | โจทย์ To what extent (Relationship) | 40:37 |
| 5 | 4 | 30355504 | โจทย์​ To What Extent | 16:53 |
| 5 | 6 | 31277529 | โจทย์เกี่ยวกับสิทธิสัตว์ Animal Rights | 35:44 |
| 5 | 8 | 30903954 | โจทย์เกี่ยวกับ ​: Famous People | 30:44 |
| 5 | 9 | 30871798 | โจทย์เกี่ยวกับสุขภาพ : Health | 30:45 |
| 5 | 10 | 30836773 | โจทย์ฺเกี่ยวกับ​ Art/ culture | 29:34 |
| 5 | 11 | 45791787 | โจทย์ Art Education (JUNE) | 21:56 |
| 5 | 12 | 30822763 | โจทย์เกี่ยวกับ ข้อดีข้อเสีย Globalization | 30:59 |
| 6 | 0 | 31989817 | เฉลยโจทย์​ล่าสุด - Should women's sports shows be given more showtime on TV? | 30:24 |
| 6 | 1 | 30637001 | โจทย์เกี่ยวกับ Education | 35:43 |
| 6 | 2 | 30355509 | โจทย์ Society - Shopping | 22:34 |
| 6 | 3 | 30578653 | โจทย์เกี่ยวกับกฏหมาย | 26:06 |
| 6 | 4 | 30657570 | โจทย์เกี่ยวกับ Military Budget | 27:22 |
| 6 | 5 | 30610411 | โจทย์เกี่ยวกับภาวะโลกร้อน : Global Warming | 36:08 |
| 6 | 6 | 32369488 | โจทย์ล่าสุด 16 Feb 2022 - advertisements for kids | 33:19 |

(Skipped in chapter 5: lessons 1, 5, 7 — exercises/quizzes, no video.
**Watch out**: lesson 5,9 "โจทย์เกี่ยวกับสุขภาพ : Health" has duration 30:45 —
there is a confirmed duplicate-duration video in a completely different
course. Use the exact filename from the lesson editor page, not the
duration, to be sure you grab the right one.)

## When done

You've finished this part. Don't proceed to Bunny Stream upload or app
deployment — that happens once all 4 parts are done, as a separate step. Just
confirm all 17 files are renamed and present in `~/Downloads/`, then stop.
