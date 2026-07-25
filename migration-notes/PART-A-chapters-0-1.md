# Video download — Part A (Chapter 0 + Chapter 1) — say "start" to begin

**Say this to resume:** "Read migration-notes/PART-A-chapters-0-1.md and download the videos listed."

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
   (e.g. `c0-l4.mp4`) — do this right after each download, before starting
   the next one, or you'll end up with unlabeled files you can't tell apart.
7. Move to the next lesson on your list.

Chrome extension sometimes disconnects mid-action — transient, just retry.

## Your lessons (chapter 0 partial + chapter 1, 20 real videos)

Chapter 0 lessons 0-2 were already downloaded in a prior session — skip them.
**Start from chapter 0 lesson 3.**

| chapterIdx | lessonIdx | thinkificId | title | duration |
|---|---|---|---|---|
| 0 | 3 | 60983651 | สรุป Transitional words (Connective Devices) สำหรับ Band 7 | 9:51 |
| 0 | 4 | 60983662 | สูตรลัดเรื่อง Tense for Band 7 | 24:47 |
| 0 | 5 | 60983849 | เทคนิคการทำ Referencing for Band 7 | 24:13 |
| 0 | 6 | 60983861 | การขยายคำนาม and mistakes to avoid | 18:23 |
| 1 | 0 | 30281373 | รู้จัก Task 1 | 9:03 |
| 1 | 1 | 30431336 | คำศัพท์ใช้อธิบายข้อมูล | 8:57 |
| 1 | 2 | 31922134 | การใช้ Article (a/ an/ the) - ทำยังไงไม่ให้โดนหักคะแนน Grammar | 15:55 |
| 1 | 3 | 33521878 | Line Graph - Step by Step | 41:16 |
| 1 | 4 | 30305652 | โจทย์ LINE GRAPH | 33:27 |
| 1 | 5 | 30874008 | โจทย์ Line Graph (2) | 21:05 |
| 1 | 7 | 32688658 | line graph เขียนพร้อมกัน | 38:36 |
| 1 | 8 | 40508629 | การรับมือกับโจทย์ตัวเลขเยอะๆ | 25:16 |
| 1 | 9 | 32506820 | Line Graph 2 อัน | 28:50 |
| 1 | 11 | 30360703 | โจทย์​ Pie Chart | 16:54 |
| 1 | 12 | 32681732 | เขียน Pie chart พร้อมกัน | 30:08 |
| 1 | 14 | 36369397 | วิธีการเขียน Bar chart : PART 1 | 18:26 |
| 1 | 15 | 36369359 | วิธีทำ Bar chart PART 2 | 16:24 |
| 1 | 16 | 33381415 | การเขียน Bar chart (1) | 25:17 |
| 1 | 17 | 30331705 | โจทย์ Bar Chart | 17:34 |
| 1 | 18 | 30362033 | โจทย์​ Table | 16:24 |

(Skipped in chapter 1: lessons 6, 10, 13 — those are quizzes with no video.)

## When done

You've finished this part. Don't proceed to Bunny Stream upload or app
deployment — that happens once all 4 parts are done, as a separate step. Just
confirm all 20 files are renamed and present in `~/Downloads/`, then stop.
