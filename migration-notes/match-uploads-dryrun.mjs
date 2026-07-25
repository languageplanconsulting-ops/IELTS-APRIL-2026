// Read-only: for each successfully-uploaded video in upload-log.json, ask
// Bunny for its processed duration and propose which lesson it matches
// against the 79-lesson TSV. Prints proposals only — writes nothing.
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync(new URL('./.env.local', import.meta.url), 'utf8').trim().split('\n').map((l) => l.split('='))
)
const API_KEY = env.BUNNY_API_KEY
const LIBRARY_ID = '712721'

const tsvRows = fs.readFileSync(new URL('./writing-93-lessons.tsv', import.meta.url), 'utf8')
  .trim().split('\n').slice(1)
  .map((line) => {
    const [chapterIdx, lessonIdx, thinkificId, title, seconds] = line.split('\t')
    return { chapterIdx: +chapterIdx, lessonIdx: +lessonIdx, title, seconds: +seconds }
  })
  .filter((r) => r.seconds > 0)

const durationCounts = {}
for (const r of tsvRows) durationCounts[r.seconds] = (durationCounts[r.seconds] || 0) + 1
const ambiguousDurations = new Set(Object.keys(durationCounts).filter((s) => durationCounts[s] > 1).map(Number))

const uploadLog = JSON.parse(fs.readFileSync(new URL('./upload-log.json', import.meta.url), 'utf8'))
const uploaded = Object.entries(uploadLog).filter(([, v]) => v.deletedLocal && v.guid)

console.log(`${uploaded.length} successfully uploaded video(s) to match against ${tsvRows.length} real lessons.\n`)

for (const [filename, entry] of uploaded) {
  const res = await fetch(`https://video.bunnycdn.com/library/${LIBRARY_ID}/videos/${entry.guid}`, {
    headers: { AccessKey: API_KEY }
  })
  const meta = await res.json()
  const bunnyDuration = meta.length // seconds, once processed
  if (!bunnyDuration) {
    console.log(`${filename} -> guid ${entry.guid}: still processing, no duration yet, skip for now`)
    continue
  }

  // Exact match only — a loose tolerance window merges lessons that are
  // genuinely only 1-2 seconds apart in real duration into false ambiguity.
  const candidates = tsvRows.filter((r) => r.seconds === bunnyDuration)

  if (candidates.length === 0) {
    console.log(`${filename} -> guid ${entry.guid} (${bunnyDuration}s): NO MATCH FOUND — needs manual identification`)
  } else if (candidates.length === 1 && !ambiguousDurations.has(candidates[0].seconds)) {
    const c = candidates[0]
    console.log(`${filename} -> guid ${entry.guid} (${bunnyDuration}s): MATCH c${c.chapterIdx}-l${c.lessonIdx} "${c.title}"`)
  } else {
    console.log(`${filename} -> guid ${entry.guid} (${bunnyDuration}s): AMBIGUOUS, ${candidates.length} candidate(s):`)
    candidates.forEach((c) => console.log(`    c${c.chapterIdx}-l${c.lessonIdx} "${c.title}"`))
  }
}
