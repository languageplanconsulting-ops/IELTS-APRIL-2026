// Generates src/lessonChapters.json — jump-to timestamps inside each lesson video.
//
// Source is the Deepgram transcripts in .cache/lesson-transcripts, which carry
// word-level timings. Two things about that data shape this script:
//
// 1. The TIMINGS are trustworthy. The TEXT is not — Deepgram's Thai model was
//    fed a Thai teacher code-switching into English and shredded both: Thai
//    split per syllable ("โจทย ์"), English split per fragment ("p ro ce ss").
//    So the timings drive the chapter marks, and the text only ever produces a
//    DRAFT label for a human to correct.
//
// 2. Chapter boundaries are found from how the teacher actually talks — a pause
//    followed by a "now then" / "next" / "let's look at" opener — rather than
//    from meaning, which this transcript can't support.
//
// Usage: node scripts/build-lesson-chapters.mjs [--report]

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const CACHE = path.join(root, '.cache', 'lesson-transcripts');
const OUT = path.join(root, 'src', 'lessonChapters.json');

const THAI = /[฀-๿]/;
const LATIN = /^[A-Za-z']+$/;

/** Shortest a chapter may be. Below this it's a pause, not a new topic. */
const MIN_CHAPTER_SECONDS = 75;
/** Silence long enough to suggest the teacher has finished a thought. */
const PAUSE_SECONDS = 1.2;

/**
 * Openers a teacher uses when moving to the next thing. Ordered strongest
 * first — these are the phrases that actually mark a new section in a lesson,
 * as opposed to filler that happens to start a sentence.
 */
const TRANSITIONS = [
  'ทีนี้', 'ต่อไป', 'จากนั้น', 'ขั้นตอนต่อไป', 'ข้อต่อไป', 'อันต่อไป',
  'มาดู', 'เรามาดู', 'ลองมาดู', 'มาลองดู', 'เรามาลอง',
  'สรุป', 'สรุปว่า', 'เอาล่ะ', 'เอาละ', 'โอเค',
  'ต่อมา', 'อีกอัน', 'อีกข้อ', 'พาร์ทต่อไป', 'ขั้นที่'
];

function loadJson(p, fallback) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return fallback;
  }
}

/**
 * Puts a shredded transcript back together.
 *
 * Thai does not space between words, so adjacent Thai tokens always rejoin.
 * Latin fragments rejoin when either side is short, which is the signature of
 * the splitting ("p ro ce ss") without welding genuine separate words.
 */
function clean(text) {
  const tokens = String(text || '').split(/\s+/).filter(Boolean);
  let out = '';
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const prev = tokens[i - 1];
    if (!prev) {
      out += token;
      continue;
    }
    const bothThai = THAI.test(token) && THAI.test(prev);
    const bothLatin = LATIN.test(token) && LATIN.test(prev);
    const shredded = bothLatin && (token.length <= 3 || prev.length <= 3);
    out += bothThai || shredded ? token : ' ' + token;
  }
  return out.trim();
}

/** A first line short enough to sit in a sidebar, cut at a sensible point. */
function draftLabel(text) {
  const cleaned = clean(text)
    // Verbal tics that start half the sentences in a Thai lesson and carry no
    // information in a chapter title.
    .replace(/^(นะครับ|ครับ|นะคะ|ค่ะ|อ่า|เอ่อ|โอเค)\s*/g, '')
    .trim();
  if (cleaned.length <= 46) return cleaned;
  const cut = cleaned.slice(0, 46);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 24 ? cut.slice(0, lastSpace) : cut) + '…';
}

const startsWithTransition = (text) => {
  const cleaned = clean(text);
  return TRANSITIONS.some((marker) => cleaned.startsWith(marker));
};

/**
 * Chapter marks for one transcript.
 *
 * A boundary needs three things: enough distance from the last mark, a pause
 * before it, and a transition word — with the pause alone accepted once a
 * stretch has run long enough that the student needs a handle on it regardless.
 */
function chaptersFor(transcript) {
  const utterances = transcript?.results?.utterances ?? [];
  if (utterances.length < 4) return [];

  const duration = transcript?.metadata?.duration ?? 0;
  const marks = [{ t: 0, label: draftLabel(utterances[0].transcript) }];

  for (let i = 1; i < utterances.length; i++) {
    const utterance = utterances[i];
    const gap = utterance.start - utterances[i - 1].end;
    const since = utterance.start - marks[marks.length - 1].t;
    if (since < MIN_CHAPTER_SECONDS) continue;

    const transition = gap >= PAUSE_SECONDS && startsWithTransition(utterance.transcript);
    const overdue = since > MIN_CHAPTER_SECONDS * 2.5 && gap >= PAUSE_SECONDS * 0.6;
    if (!transition && !overdue) continue;

    marks.push({ t: Math.round(utterance.start), label: draftLabel(utterance.transcript) });
  }

  // A mark in the last few seconds is a sign-off, not a chapter.
  return marks.filter((mark) => mark.t < duration - 20);
}

// --------------------------------------------------------------- run ----

const guidToLesson = {};
for (const course of ['speaking', 'listening', 'reading', 'grammar']) {
  const map = loadJson(path.join(root, 'src', `${course}VideoIds.json`), {});
  for (const [key, guid] of Object.entries(map)) guidToLesson[guid] = `${course}:${key}`;
}
const writing = loadJson(path.join(root, 'src', 'bunnyVideoIds.json'), {});
for (const [key, guid] of Object.entries(writing)) guidToLesson[guid] = key;

const files = fs.existsSync(CACHE)
  ? fs.readdirSync(CACHE).filter((name) => name.endsWith('.deepgram.json'))
  : [];

const chapters = {};
const report = [];
let unmapped = 0;

for (const file of files) {
  const guid = file.replace('.deepgram.json', '');
  const lessonId = guidToLesson[guid];
  if (!lessonId) {
    unmapped += 1;
    continue;
  }
  const transcript = loadJson(path.join(CACHE, file), null);
  if (!transcript) continue;

  const marks = chaptersFor(transcript);
  if (marks.length < 2) continue;

  chapters[lessonId] = marks;
  report.push({ lessonId, count: marks.length, minutes: Math.round((transcript.metadata?.duration ?? 0) / 60), marks });
}

const sorted = Object.fromEntries(Object.entries(chapters).sort(([a], [b]) => a.localeCompare(b)));
fs.writeFileSync(OUT, JSON.stringify(sorted, null, 2) + '\n');

const clock = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;

console.log(`transcripts found : ${files.length}${unmapped ? ` (${unmapped} unmapped)` : ''}`);
console.log(`lessons chaptered : ${report.length}`);
console.log(`chapter marks     : ${report.reduce((sum, r) => sum + r.count, 0)}`);
console.log(
  `marks per lesson  : ${(report.reduce((sum, r) => sum + r.count, 0) / (report.length || 1)).toFixed(1)} avg`
);

if (process.argv.includes('--report')) {
  for (const entry of report.slice(0, 5)) {
    console.log(`\n── ${entry.lessonId}  (${entry.minutes} min, ${entry.count} marks)`);
    for (const mark of entry.marks) console.log(`   ${clock(mark.t).padStart(6)}  ${mark.label}`);
  }
}

console.log(`\nwrote ${path.relative(root, OUT)}`);
