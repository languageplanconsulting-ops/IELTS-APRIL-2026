// Builds clickable chapter markers ("หัวข้อย่อยตามเวลา") for the writing course videos.
//
// Unlike scripts/build-listening-captions.mjs, there is no canonical script for
// these lessons — the teacher speaks freely in Thai. So the transcript has to
// carry the words as well as the clock, which rules out the whisper base/small
// English models that pipeline uses. Deepgram nova-3 handles Thai (a 69% WER
// improvement over nova-2) and costs ~$0.0043/min, which is roughly $9 for the
// whole 33-hour course — cheaper in wall-clock than a local large-v3 run by an
// order of magnitude.
//
// Pipeline per lesson:
//   1. ffmpeg pulls the audio track out of the Bunny HLS playlist → 16kHz mono
//   2. Deepgram nova-3 (language=th, utterances) → utterances with ms offsets
//   3. group utterances into 2–4 minute chapters on the longest speech gaps
//   4. Claude reads each chapter's transcript and writes a Thai heading
//   5. emit to public/lesson-chapters/${lessonId}.json
//
// Chapters, not subtitles, on purpose: a human reviews ~8 headings per lesson
// instead of ~400 caption lines, so Thai ASR errors are cheap to catch. The
// boundaries come from silence (robust to mishearing); only the labels depend
// on transcript quality, and those get a human pass.
//
// Usage:
//   npx tsx scripts/build-lesson-chapters.mjs c2-l8          # one lesson
//   npx tsx scripts/build-lesson-chapters.mjs --all          # every lesson with a video
//   npx tsx scripts/build-lesson-chapters.mjs --all --force  # ignore existing output
//   npx tsx scripts/build-lesson-chapters.mjs --all --dry-run  # cost estimate only
//
// Requires: ffmpeg (brew install ffmpeg), and in .env.local —
//   BUNNY_CDN_HOST     e.g. vz-xxxxxxxx-xxx.b-cdn.net  (Bunny Stream pull zone)
//   DEEPGRAM_API_KEY   already present
//   ANTHROPIC_API_KEY  already present
// Re-running is cheap: finished lessons are skipped unless --force, and the
// Deepgram response for each lesson is cached under .cache/lesson-transcripts/.

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { WRITING_COURSE_LESSONS } from '../src/writingCourseCurriculum.ts'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = join(ROOT, 'public', 'lesson-chapters')
const CACHE_DIR = join(ROOT, '.cache', 'lesson-transcripts')

/** Target chapter length. Long enough that a 20-minute lesson yields 6–10 rows,
 *  short enough that clicking one actually saves the student scrubbing. */
const TARGET_CHAPTER_MS = 3 * 60_000
const MIN_CHAPTER_MS = 60_000
const MAX_CHAPTER_MS = 5 * 60_000
/** A gap this long between utterances is where the teacher changed subject. */
const MIN_BOUNDARY_GAP_MS = 1_200

/** Lessons shorter than this get one chapter, which is the same as none. */
const MIN_LESSON_MS = 4 * 60_000

/** Deepgram bills per minute of audio; this is only used for the estimate. */
const DEEPGRAM_USD_PER_MIN = 0.0043

/** How many lessons to process at once. Deepgram and Anthropic both tolerate
 *  more, but ffmpeg pulling four HLS streams already saturates a home line. */
const CONCURRENCY = 4

// ------------------------------------------------------------------ env ---

const readEnvFile = (name) => {
  const path = join(ROOT, name)
  if (!existsSync(path)) return {}
  return Object.fromEntries(
    readFileSync(path, 'utf8')
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => {
        const eq = line.indexOf('=')
        return [line.slice(0, eq), line.slice(eq + 1).replace(/^["']|["']$/g, '')]
      })
      .filter(([key]) => key),
  )
}

const env = { ...readEnvFile('.env'), ...readEnvFile('.env.local'), ...process.env }

const requireEnv = (key, hint) => {
  const value = String(env[key] || '').trim()
  if (!value) {
    console.error(`Missing ${key}${hint ? ` — ${hint}` : ''}`)
    process.exit(1)
  }
  return value
}

// -------------------------------------------------------------- helpers ---

const run = (cmd, args) => execFileSync(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] })

const formatClock = (ms) => {
  const total = Math.round(ms / 1000)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

/** Runs `tasks` with a fixed worker pool, preserving input order in the result. */
const pool = async (items, limit, worker) => {
  const results = new Array(items.length)
  let cursor = 0
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++
      results[index] = await worker(items[index], index)
    }
  })
  await Promise.all(runners)
  return results
}

// ---------------------------------------------------------------- audio ---

/**
 * Picks the lowest-bitrate variant out of Bunny's master playlist.
 *
 * This matters more than it looks. HLS multiplexes audio into each video
 * rendition, so ffmpeg downloads the whole video stream even with `-vn` — and
 * the default variant is the top one. Across 33 hours that is the difference
 * between pulling ~6 GB and ~25 GB, which is the run's real bottleneck. The
 * audio track is identical in every rendition, so the smallest one is free
 * accuracy-wise.
 */
/**
 * The library's Allowed Domains list is set to language-plan.com, so every
 * request has to carry a matching Referer or Bunny answers 403 — the same 403
 * that shows in the player when the app is served from any other origin.
 */
const REFERER = 'https://language-plan.com/'

const lowestVariantUrl = async (masterUrl) => {
  // Node's fetch drops some multi-second requests to Bunny outright on this
  // network (same symptom hit the Deepgram upload — see transcribe() below);
  // curl doesn't. Shell out rather than chase the Node-side cause.
  let statusOut
  let text
  try {
    // Keyed by the video id in the URL, not a shared name — CONCURRENCY runs
    // several of these at once and a shared temp file is a torn-write race.
    const videoId = masterUrl.split('/').at(-2) ?? 'unknown'
    const respPath = join(CACHE_DIR, `${videoId}.playlist.tmp`)
    mkdirSync(CACHE_DIR, { recursive: true })
    statusOut = run('curl', [
      '-sS',
      '--max-time', '60',
      '--retry', '2',
      '--retry-delay', '2',
      '-H', `Referer: ${REFERER}`,
      masterUrl,
      '-o', respPath,
      '-w', '%{http_code}',
    ])
    text = readFileSync(respPath, 'utf8')
  } catch (error) {
    throw new Error(`Bunny playlist unreachable: ${error.message}`)
  }
  const status = Number(statusOut.toString('utf8').trim())
  if (status === 403) {
    throw new Error('Bunny returned 403 — the video id is wrong, or Allowed Domains no longer includes language-plan.com')
  }
  if (status < 200 || status >= 300) throw new Error(`Bunny playlist ${status} — check BUNNY_CDN_HOST and the video id`)
  const lines = text.split('\n').map((line) => line.trim())

  let best = null
  for (let i = 0; i < lines.length; i += 1) {
    if (!lines[i].startsWith('#EXT-X-STREAM-INF')) continue
    const bandwidth = Number(/BANDWIDTH=(\d+)/.exec(lines[i])?.[1] ?? Infinity)
    const uri = lines[i + 1]
    if (!uri || uri.startsWith('#')) continue
    if (!best || bandwidth < best.bandwidth) best = { bandwidth, uri }
  }
  // A media playlist rather than a master one — use it as-is.
  if (!best) return masterUrl
  return new URL(best.uri, masterUrl).toString()
}

/**
 * Audio only, 16kHz mono Opus at 24kbps.
 *
 * Opus rather than WAV because the file is uploaded to Deepgram, not just read:
 * a 43-minute lesson is 83 MB as PCM and under 8 MB as Opus, and the PCM upload
 * is large enough to fail outright. Speech recognition is unaffected at this
 * bitrate — the model works from a 16kHz mel spectrogram either way.
 */
const extractAudio = async (bunnyVideoId, cdnHost) => {
  mkdirSync(CACHE_DIR, { recursive: true })
  const audioPath = join(CACHE_DIR, `${bunnyVideoId}.ogg`)
  if (existsSync(audioPath)) return audioPath
  const variantUrl = await lowestVariantUrl(`https://${cdnHost}/${bunnyVideoId}/playlist.m3u8`)
  run('ffmpeg', [
    '-v', 'error',
    '-y',
    '-headers', `Referer: ${REFERER}\r\n`,
    '-i', variantUrl,
    '-vn',
    '-ar', '16000',
    '-ac', '1',
    '-c:a', 'libopus',
    '-b:a', '24k',
    audioPath,
  ])
  return audioPath
}

// ------------------------------------------------------------ transcribe ---

/**
 * nova-3 is the first Deepgram model with real Thai support. `utterances`
 * groups words into speech runs with start/end offsets, which is exactly the
 * granularity chapter boundaries need — Thai has no word spaces, so word-level
 * timings would be noise here.
 */
const transcribe = async (audioPath, cacheKey, apiKey) => {
  const cachePath = join(CACHE_DIR, `${cacheKey}.deepgram.json`)
  if (existsSync(cachePath)) return JSON.parse(readFileSync(cachePath, 'utf8'))

  const params = new URLSearchParams({
    model: 'nova-3',
    language: 'th',
    smart_format: 'true',
    utterances: 'true',
    utt_split: '1.2',
    punctuate: 'true',
  })

  const body = readFileSync(audioPath)
  let response
  try {
    // curl handles the same upload cleanly; Node's fetch/undici drops the
    // connection on some multi-minute POSTs from this network regardless of
    // AbortSignal — shelling out to curl sidesteps whatever that is, at the
    // cost of writing the body to disk first (already true — audioPath is a
    // file) and reading curl's own file back.
    const respPath = `${audioPath}.deepgram-response.json`
    const statusOut = run('curl', [
      '-sS', '-X', 'POST',
      '--max-time', '900',
      `https://api.deepgram.com/v1/listen?${params}`,
      '-H', `Authorization: Token ${apiKey}`,
      '-H', 'Content-Type: audio/ogg',
      '--data-binary', `@${audioPath}`,
      '-o', respPath,
      '-w', '%{http_code}',
    ])
    const status = Number(statusOut.toString('utf8').trim())
    response = {
      ok: status >= 200 && status < 300,
      status,
      text: async () => readFileSync(respPath, 'utf8'),
      json: async () => JSON.parse(readFileSync(respPath, 'utf8')),
    }
  } catch (error) {
    throw new Error(`Deepgram upload failed (${(body.length / 1e6).toFixed(1)} MB): ${error.message}`)
  }
  if (!response.ok) {
    throw new Error(`Deepgram ${response.status}: ${(await response.text()).slice(0, 300)}`)
  }
  const json = await response.json()
  writeFileSync(cachePath, JSON.stringify(json))
  return json
}

// -------------------------------------------------------------- segment ---

/**
 * Walks the utterances and closes a chapter at the longest pause available once
 * the running length passes the target. Silence is the signal here rather than
 * anything in the text: a mis-transcribed Thai word costs nothing, but a
 * boundary in the middle of a sentence is immediately visible to a student.
 */
const segmentIntoChapters = (utterances) => {
  if (!utterances.length) return []

  const chapters = []
  let current = { start: utterances[0].start * 1000, utterances: [] }

  for (let i = 0; i < utterances.length; i += 1) {
    const utterance = utterances[i]
    current.utterances.push(utterance)
    const endMs = utterance.end * 1000
    const lengthMs = endMs - current.start

    const next = utterances[i + 1]
    if (!next) break

    const gapMs = next.start * 1000 - endMs
    const longEnough = lengthMs >= TARGET_CHAPTER_MS && gapMs >= MIN_BOUNDARY_GAP_MS
    const tooLong = lengthMs >= MAX_CHAPTER_MS

    if (longEnough || tooLong) {
      current.end = endMs
      chapters.push(current)
      current = { start: next.start * 1000, utterances: [] }
    }
  }

  current.end = utterances[utterances.length - 1].end * 1000
  chapters.push(current)

  // A trailing sliver reads as a bug in the UI — fold it back into its neighbour.
  if (chapters.length > 1) {
    const last = chapters[chapters.length - 1]
    if (last.end - last.start < MIN_CHAPTER_MS) {
      const previous = chapters[chapters.length - 2]
      previous.end = last.end
      previous.utterances.push(...last.utterances)
      chapters.pop()
    }
  }

  return chapters.map((chapter) => ({
    startMs: Math.round(chapter.start),
    endMs: Math.round(chapter.end),
    text: chapter.utterances.map((u) => u.transcript).join(' ').trim(),
  }))
}

// ----------------------------------------------------------------- label ---

const CHAPTER_SCHEMA = {
  type: 'object',
  properties: {
    chapters: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          index: { type: 'integer' },
          title: { type: 'string' },
        },
        required: ['index', 'title'],
        additionalProperties: false,
      },
    },
  },
  required: ['chapters'],
  additionalProperties: false,
}

const LABEL_SYSTEM = `คุณกำลังตั้งหัวข้อย่อยให้วิดีโอสอน IELTS Writing ภาษาไทย

กติกา:
- ตั้งหัวข้อภาษาไทยให้ทุกช่วง ความยาว 3–8 คำ
- บอกว่าช่วงนั้น "สอนอะไร" ไม่ใช่เล่าว่าครูพูดอะไร
- ศัพท์เทคนิค IELTS เขียนเป็นภาษาอังกฤษตามเดิม (Overview, Body 1, Bar chart, respectively)
- ห้ามใส่เลขลำดับหรือเวลาไว้ในหัวข้อ ระบบใส่ให้เองแล้ว
- ทรานสคริปต์มาจากการถอดเสียงอัตโนมัติ จึงมีคำผิดบ้าง ให้เดาความหมายจากบริบทของบทเรียน`

const labelChapters = async (client, lesson, chapters) => {
  const transcriptBlock = chapters
    .map((chapter, index) => {
      // Enough to identify the topic without paying for the whole lesson twice.
      const excerpt = chapter.text.slice(0, 1200)
      return `[${index}] ${formatClock(chapter.startMs)}–${formatClock(chapter.endMs)}\n${excerpt}`
    })
    .join('\n\n')

  const message = await client.messages.create({
    model: 'claude-opus-5',
    max_tokens: 8000,
    system: LABEL_SYSTEM,
    output_config: {
      effort: 'low',
      format: { type: 'json_schema', schema: CHAPTER_SCHEMA },
    },
    messages: [
      {
        role: 'user',
        content: `บทเรียน: ${lesson.title}\nบทที่: ${lesson.chapterName}\nประเภทโจทย์: ${lesson.questionType}\n\nตั้งหัวข้อให้ทั้ง ${chapters.length} ช่วงต่อไปนี้\n\n${transcriptBlock}`,
      },
    ],
  })

  if (message.stop_reason === 'refusal') {
    throw new Error(`Claude declined to label ${lesson.id} (${message.stop_details?.category ?? 'unknown'})`)
  }

  const text = message.content.find((block) => block.type === 'text')?.text ?? ''
  const parsed = JSON.parse(text)
  const byIndex = new Map(parsed.chapters.map((row) => [row.index, row.title.trim()]))
  return chapters.map((chapter, index) => ({
    s: Math.round(chapter.startMs / 1000),
    e: Math.round(chapter.endMs / 1000),
    title: byIndex.get(index) || `ช่วงที่ ${index + 1}`,
  }))
}

// ------------------------------------------------------------------ main ---

const main = async () => {
  const args = process.argv.slice(2)
  const all = args.includes('--all')
  const force = args.includes('--force')
  const dryRun = args.includes('--dry-run')
  const keys = args.filter((arg) => !arg.startsWith('--'))

  const playable = WRITING_COURSE_LESSONS.filter((lesson) => lesson.bunnyVideoId)
  const targets = all ? playable : playable.filter((lesson) => keys.includes(lesson.id))

  if (!targets.length) {
    console.error('Nothing to do. Pass lesson ids, or --all.')
    console.error(`Playable lessons: ${playable.length} of ${WRITING_COURSE_LESSONS.length}`)
    process.exit(1)
  }

  if (dryRun) {
    const minutes = targets.reduce((sum, lesson) => sum + lesson.minutes, 0)
    console.log(`${targets.length} lessons · ${(minutes / 60).toFixed(1)} hr`)
    console.log(`Deepgram ≈ $${(minutes * DEEPGRAM_USD_PER_MIN).toFixed(2)}`)
    console.log('Anthropic labelling adds a few cents per lesson.')
    return
  }

  // The pull zone for library 712721, recorded in migration-notes/BRIEF-video-migration.md.
  // Overridable in case the library is ever moved; not a secret either way.
  const cdnHost = String(env.BUNNY_CDN_HOST || 'vz-28265e7a-a6d.b-cdn.net').trim()
  const deepgramKey = requireEnv('DEEPGRAM_API_KEY')
  requireEnv('ANTHROPIC_API_KEY')

  try {
    run('ffmpeg', ['-version'])
  } catch {
    console.error('ffmpeg not found — brew install ffmpeg')
    process.exit(1)
  }

  mkdirSync(OUT_DIR, { recursive: true })

  // Imported here rather than at the top so --dry-run works before the dep is
  // installed, and so the missing-package error names the fix.
  let Anthropic
  try {
    ;({ default: Anthropic } = await import('@anthropic-ai/sdk'))
  } catch {
    console.error('Missing @anthropic-ai/sdk — npm install --save-dev @anthropic-ai/sdk')
    process.exit(1)
  }
  // env carries values merged from .env / .env.local, which process.env
  // doesn't see unless something already exported them — the SDK's zero-arg
  // constructor only reads process.env, so hand it the key explicitly.
  const client = new Anthropic({ apiKey: requireEnv('ANTHROPIC_API_KEY') })

  let done = 0
  let skipped = 0
  const failures = []

  await pool(targets, CONCURRENCY, async (lesson) => {
    const outPath = join(OUT_DIR, `${lesson.id}.json`)
    if (existsSync(outPath) && !force) {
      skipped += 1
      return
    }

    try {
      const wavPath = await extractAudio(lesson.bunnyVideoId, cdnHost)
      const result = await transcribe(wavPath, lesson.bunnyVideoId, deepgramKey)

      const channel = result.results?.channels?.[0]?.alternatives?.[0]
      const utterances = result.results?.utterances ?? []
      const durationMs = Math.round((result.metadata?.duration ?? 0) * 1000)

      if (!utterances.length) {
        throw new Error('Deepgram returned no utterances — check the audio pulled cleanly')
      }

      // A short lesson with one chapter is just a video; don't ship an empty rail.
      if (durationMs > 0 && durationMs < MIN_LESSON_MS) {
        writeFileSync(outPath, JSON.stringify({ id: lesson.id, duration: Math.round(durationMs / 1000), chapters: [] }))
        console.log(`· ${lesson.id} too short for chapters (${formatClock(durationMs)})`)
        done += 1
        return
      }

      const segments = segmentIntoChapters(utterances)
      const chapters = await labelChapters(client, lesson, segments)

      writeFileSync(
        outPath,
        JSON.stringify({
          id: lesson.id,
          duration: Math.round(durationMs / 1000),
          confidence: channel?.confidence ?? null,
          chapters,
        }),
      )

      done += 1
      console.log(`✓ ${lesson.id} · ${chapters.length} chapters · ${lesson.title.slice(0, 40)}`)
    } catch (error) {
      failures.push({ id: lesson.id, message: error.message })
      console.error(`✗ ${lesson.id} — ${error.message}`)
    }
  })

  console.log(`\n${done} built · ${skipped} already done · ${failures.length} failed`)
  if (failures.length) {
    console.log('Re-run with just the failed ids once the cause is fixed:')
    console.log(`  npx tsx scripts/build-lesson-chapters.mjs ${failures.map((f) => f.id).join(' ')}`)
    process.exitCode = 1
  }
}

/** Frees the cached wavs once every lesson is built; transcripts stay. */
export const cleanAudioCache = () => rmSync(CACHE_DIR, { recursive: true, force: true })

await main()
