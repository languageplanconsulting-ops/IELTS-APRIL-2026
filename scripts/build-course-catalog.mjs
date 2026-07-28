// Generates src/courseCatalog.json — the single source of truth for the bundle
// planner's cross-course scheduling.
//
// Why generated rather than hand-written: every number here (lesson count,
// duration, video id) came out of the Thinkific → Bunny migration. Re-deriving
// it from the migration manifests means the planner can never silently drift
// from what students actually have. Re-run this after any course changes.
//
// The Writing course is deliberately NOT included: it already has a richer,
// hand-authored curriculum in src/writingCourseCurriculum.ts with per-lesson
// tier/questionType metadata. The catalog defers to that file for writing and
// only supplies the four migrated courses.
//
// Usage: node scripts/build-course-catalog.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

/** Courses whose lesson data comes from the migration manifests. */
const COURSES = [
  { id: 'speaking', label: 'IELTS Speaking', labelTh: 'พูด', bunnyLibrary: '713546' },
  { id: 'listening', label: 'IELTS Listening', labelTh: 'ฟัง', bunnyLibrary: '713547' },
  { id: 'reading', label: 'IELTS Reading', labelTh: 'อ่าน', bunnyLibrary: '713390' },
  { id: 'grammar', label: 'English Grammar Foundation', labelTh: 'แกรมม่า', bunnyLibrary: '714012' },
];

function loadJson(p, fallback) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return fallback;
  }
}

const catalog = {};
const warnings = [];

for (const course of COURSES) {
  const manifest = loadJson(path.join(root, 'migration-notes', `${course.id}-video-map.json`), []);
  const videoIds = loadJson(path.join(root, 'src', `${course.id}VideoIds.json`), {});
  // Lesson worksheets pulled from Thinkific. Keyed by lesson key; absent for
  // most lessons, which is normal — only some lessons ship a handout.
  const docs = loadJson(path.join(root, 'src', `${course.id}CourseDocs.json`), {});

  if (manifest.length === 0) {
    warnings.push(`${course.id}: manifest missing or empty — course omitted`);
    continue;
  }

  const lessons = manifest.map((entry) => {
    const [chapterPart] = entry.key.split('-');
    const chapterIndex = Number(chapterPart.replace(/^c/, ''));
    const bunnyVideoId = videoIds[entry.key];

    if (!entry.seconds) warnings.push(`${course.id} ${entry.key}: no duration`);
    if (!bunnyVideoId) warnings.push(`${course.id} ${entry.key}: not yet migrated to Bunny`);

    return {
      id: `${course.id}:${entry.key}`,
      key: entry.key,
      chapterIndex,
      // Titles come straight from Thinkific and can carry trailing spaces or
      // zero-width characters. Trim only outer whitespace — don't "clean" the
      // interior, since that's what the curriculum actually shows.
      title: (entry.title || '').trim(),
      seconds: entry.seconds ?? null,
      minutes: entry.seconds ? Math.max(1, Math.round(entry.seconds / 60)) : null,
      bunnyVideoId: bunnyVideoId ?? null,
      documents: docs[entry.key] ?? [],
    };
  });

  const totalSeconds = lessons.reduce((sum, l) => sum + (l.seconds || 0), 0);

  catalog[course.id] = {
    id: course.id,
    label: course.label,
    labelTh: course.labelTh,
    bunnyLibrary: course.bunnyLibrary,
    lessonCount: lessons.length,
    chapterCount: new Set(lessons.map((l) => l.chapterIndex)).size,
    totalMinutes: Math.round(totalSeconds / 60),
    migratedCount: lessons.filter((l) => l.bunnyVideoId).length,
    lessons,
  };
}

const outPath = path.join(root, 'src', 'courseCatalog.json');
fs.writeFileSync(outPath, JSON.stringify(catalog, null, 2) + '\n');

for (const [id, c] of Object.entries(catalog)) {
  const done = c.migratedCount === c.lessonCount ? 'complete' : `${c.migratedCount}/${c.lessonCount} migrated`;
  console.log(`${id.padEnd(10)} ${String(c.lessonCount).padStart(3)} lessons  ${String(c.totalMinutes).padStart(4)} min  ${done}`);
}

const grandLessons = Object.values(catalog).reduce((s, c) => s + c.lessonCount, 0);
const grandMinutes = Object.values(catalog).reduce((s, c) => s + c.totalMinutes, 0);
console.log(`${'TOTAL'.padEnd(10)} ${String(grandLessons).padStart(3)} lessons  ${String(grandMinutes).padStart(4)} min  (excludes Writing)`);

if (warnings.length) {
  const shown = warnings.slice(0, 8);
  console.log(`\n${warnings.length} warning(s):`);
  shown.forEach((w) => console.log('  ' + w));
  if (warnings.length > shown.length) console.log(`  … and ${warnings.length - shown.length} more`);
}

console.log(`\nwrote ${path.relative(root, outPath)}`);
