/**
 * Proves each placement listening clip actually contains its answers.
 *
 * The clips are cut by seeking inside hotlinked Cambridge audio, so nothing in
 * the repo guarantees the offsets are still right — a re-encode upstream would
 * shift every answer out of the window and the test would mark honest students
 * wrong with no visible failure. This script downloads the real audio, cuts the
 * exact range the app plays, transcribes it, and asserts:
 *
 *   1. the whole-file duration still matches expectedFileDuration
 *   2. every answer for the clip is inside the cut
 *   3. the NEXT question's answer is not (so the clip does not over-run)
 *
 * Needs ffmpeg and whisper-cli with ggml-small.en. Run by hand, not in CI:
 *   node scripts/verify-placement-listening.mjs
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import path from 'node:path'

const MODEL = path.join(homedir(), '.cache/whisper-models/ggml-small.en.bin')
const WORK = path.join(tmpdir(), 'placement-listening-verify')

/** Kept in step with src/placementTestData.ts. */
const CLIPS = [
  {
    id: 'Section 1 · Volunteer work',
    url: 'https://engnovate.com/wp-content/uploads/2023/07/cambridge-ielts-17-academic-listening-2-audio-1.mp3',
    expectedFileDuration: 473.48,
    start: 89,
    end: 186.5,
    answers: ['collecting', 'records', 'west', 'transport'],
    // First answer of the question that must stay outside the clip.
    mustNotContain: ['art']
  },
  {
    id: 'Section 2 · Oniton Hall',
    url: 'https://engnovate.com/wp-content/uploads/2023/07/cambridge-ielts-17-academic-listening-2-audio-2.mp3',
    expectedFileDuration: 444.08,
    start: 46,
    end: 201,
    // Multiple choice: assert the wording the correct option paraphrases.
    answers: ['adding new rooms', 'creative and literary people', 'dressed up as 19th century servants'],
    mustNotContain: ['tractors']
  },
  {
    id: 'Section 4 · Icelandic',
    url: 'https://engnovate.com/wp-content/uploads/2023/07/cambridge-ielts-17-academic-listening-2-audio-4.mp3',
    expectedFileDuration: 433.39,
    start: 71,
    end: 169.5,
    answers: ['321,000', 'vocabulary', 'podcast'],
    mustNotContain: ['smartphones']
  }
]

const run = (cmd, args) => execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
const normalise = (s) => s.toLowerCase().replace(/[^a-z0-9,]+/g, ' ').replace(/\s+/g, ' ').trim()

if (!existsSync(MODEL)) {
  console.error(`Missing whisper model at ${MODEL}`)
  process.exit(1)
}
mkdirSync(WORK, { recursive: true })

let failures = 0
for (const [index, clip] of CLIPS.entries()) {
  const mp3 = path.join(WORK, `s${index}.mp3`)
  const wav = path.join(WORK, `clip-s${index}.wav`)

  if (!existsSync(mp3)) {
    console.log(`  downloading ${clip.id}…`)
    run('curl', ['-sSL', '--max-time', '120', '-o', mp3, clip.url])
  }

  const duration = Number(
    run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp3]).trim()
  )
  const durationOk = Math.abs(duration - clip.expectedFileDuration) <= 2

  run('ffmpeg', ['-v', 'error', '-y', '-ss', String(clip.start), '-to', String(clip.end),
    '-i', mp3, '-ar', '16000', '-ac', '1', wav])
  run('whisper-cli', ['-m', MODEL, '-f', wav, '-otxt', '-of', wav.replace(/\.wav$/, ''), '-np'])
  const heard = normalise(readFileSync(wav.replace(/\.wav$/, '.txt'), 'utf8'))

  const missing = clip.answers.filter((a) => !heard.includes(normalise(a)))
  const leaked = clip.mustNotContain.filter((a) => heard.includes(normalise(a)))

  const ok = durationOk && !missing.length && !leaked.length
  if (!ok) failures += 1
  console.log(`\n${ok ? '  ok  ' : '  FAIL'} ${clip.id}  (${clip.start}s → ${clip.end}s, ${Math.round(clip.end - clip.start)}s)`)
  console.log(`        file duration ${duration.toFixed(2)}s vs expected ${clip.expectedFileDuration}s — ${durationOk ? 'match' : 'MISMATCH'}`)
  console.log(`        answers inside clip: ${clip.answers.length - missing.length}/${clip.answers.length}${missing.length ? ` — MISSING: ${missing.join(', ')}` : ''}`)
  console.log(`        next question's answer excluded: ${leaked.length ? `NO — clip over-runs into "${leaked.join(', ')}"` : 'yes'}`)
}

if (failures) {
  console.error(`\n${failures} listening clip(s) no longer cover their answers. Re-measure the offsets.`)
  process.exit(1)
}
console.log(`\nAll ${CLIPS.length} listening clips verified against the real audio.`)
