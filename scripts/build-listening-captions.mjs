// Builds timed subtitle cues for Cambridge listening sections.
//
// Whisper is used for TIMING ONLY. The words a learner sees always come from the
// canonical Cambridge script in the repo — whisper's own transcript is thrown
// away after its word timings have been matched onto ours. That is why a small
// model (base.en) is enough: mishearings cost us nothing as long as enough words
// line up to anchor the clock.
//
// Pipeline per `${book}-${test}-${part}` key:
//   1. download the mp3 (mirror fallback, same order the player uses)
//   2. ffmpeg → 16kHz mono wav (what whisper.cpp requires)
//   3. whisper-cli -ml 1 → one JSON entry per word, with ms offsets
//   4. LCS-match whisper words against canonical words → timing anchors
//   5. interpolate across unmatched runs, emit cues to public/listening-captions/
//
// Usage:
//   npx tsx scripts/build-listening-captions.mjs 18-1-2        # one key
//   npx tsx scripts/build-listening-captions.mjs --all         # every key with a script
//   npx tsx scripts/build-listening-captions.mjs --all --force # ignore existing output
//
// Requires: brew install whisper-cpp, ffmpeg, and ggml-base.en.bin (see MODEL_PATH).
// Re-running is cheap: finished keys are skipped unless --force.

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { CAMBRIDGE_LISTENING_AUDIO_URLS } from '../src/listeningCambridgeAudioUrls.ts'
import { getScriptParagraphs } from './listening-script-sources.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = join(ROOT, 'public', 'listening-captions')
const CACHE_DIR = join(ROOT, '.cache', 'listening-audio')
/**
 * small.en, not base.en. Word accuracy is irrelevant here — we keep our own text —
 * but base.en loses the clock after long silences and reports whole paragraphs on
 * a single timestamp, which drags subtitles up to 40s out of sync. small.en times
 * those same passages cleanly. Costs ~75s per section instead of ~13s.
 */
const MODEL_PATH = join(homedir(), '.cache', 'whisper-models', 'ggml-small.en.bin')

/** Subtitle lines longer than this get split; ~2 lines on a phone. */
const MAX_CUE_CHARS = 90
/** A cue never shows for less than this, even if its words were rushed. */
const MIN_CUE_MS = 700
/**
 * Below this share of anchored words, the script and the recording are not the
 * same text — a condensed paraphrase, or a transcript filed against the wrong
 * section. Interpolating across that produces confident, wrong subtitles, so the
 * track is rejected instead. Healthy sections anchor around 95%.
 */
const MIN_ANCHOR_COVERAGE = 0.6
/** Consecutive matched words required before an alignment run is trusted. */
const MIN_ANCHOR_RUN = 3
/** Two adjacent script words further apart than this were not spoken together. */
const MAX_ANCHOR_GAP_MS = 4000
/** How many script words a run may skip over and still count as continuous. */
const MAX_ANCHOR_SKIP = 4
/** Natural speech runs 2-4 words a second; past this the timings are artefacts. */
const MAX_WORDS_PER_SECOND = 7
/** Collapsed runs shorter than this are ordinary fast speech, not an artefact. */
const COLLAPSED_RUN_WORDS = 4
/** Share of a cue's words that must anchor before the cue counts as aligned. */
const SOLID_CUE_RATIO = 0.5
/** Unaligned cues tolerated inside an otherwise aligned stretch. */
const SOLID_CUE_GAP = 6

// ---------------------------------------------------------------- cue building

const SPEAKER_LINE = /^([A-Z][A-Z0-9\s]{0,22}):\s*(.*)$/
const SENTENCE_END = /(?<=[.!?…])\s+/

const packSentences = (text) => {
  const lines = []
  let current = ''
  for (const sentence of text.split(SENTENCE_END)) {
    const candidate = current ? `${current} ${sentence}` : sentence
    if (candidate.length <= MAX_CUE_CHARS) {
      current = candidate
      continue
    }
    if (current) lines.push(current)
    // A single sentence can still overflow — break it on commas, then hard-wrap.
    if (sentence.length <= MAX_CUE_CHARS) {
      current = sentence
      continue
    }
    let rest = sentence
    while (rest.length > MAX_CUE_CHARS) {
      const window = rest.slice(0, MAX_CUE_CHARS)
      const breakAt = Math.max(window.lastIndexOf(', '), window.lastIndexOf(' '))
      const cut = breakAt > MAX_CUE_CHARS * 0.5 ? breakAt + 1 : MAX_CUE_CHARS
      lines.push(rest.slice(0, cut).trim())
      rest = rest.slice(cut).trim()
    }
    current = rest
  }
  if (current) lines.push(current)
  return lines.filter(Boolean)
}

/** Canonical script → subtitle-sized cues, carrying the speaker label forward. */
const buildCues = (paragraphs) => {
  const cues = []
  let speaker = null
  for (const paragraph of paragraphs) {
    for (const rawLine of paragraph.split(/\n+/)) {
      const line = rawLine.trim()
      if (!line) continue
      const match = line.match(SPEAKER_LINE)
      const text = match ? match[2].trim() : line
      if (match) speaker = match[1].trim()
      for (const chunk of packSentences(text)) cues.push({ speaker, text: chunk })
    }
  }
  return cues
}

// ----------------------------------------------------------------- word timing

const normalizeWord = (word) =>
  word
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[^a-z0-9']/g, '')

/** Canonical cues → flat word list, each tagged with the cue it belongs to. */
const flattenCueWords = (cues) => {
  const words = []
  cues.forEach((cue, cueIndex) => {
    for (const raw of cue.text.split(/\s+/)) {
      const word = normalizeWord(raw)
      if (word) words.push({ word, cueIndex })
    }
  })
  return words
}

/**
 * After a long silence whisper.cpp collapses a run of words onto a single
 * timestamp — 26 words all reported at 242000, or crammed into 240ms. Those
 * words did not arrive at that instant; whisper simply lost the clock. Anchoring
 * on them would pin a paragraph of subtitles to one moment, so they are marked
 * unreliable and excluded from alignment. The reliable anchors on either side
 * then interpolate across the gap, which is honest about what we know.
 */
const markUnreliableRuns = (words) => {
  for (let index = 0; index < words.length; ) {
    let end = index
    while (end + 1 < words.length && words[end + 1].start === words[index].start) end += 1
    const count = end - index + 1
    const spanSeconds = (words[end].end - words[index].start) / 1000
    // 26 words inside a quarter-second is not speech, it is a timing artefact.
    // We do not know when those words were said, so they must not become
    // anchors — the surrounding reliable anchors will interpolate across them.
    if (count >= COLLAPSED_RUN_WORDS && count / Math.max(spanSeconds, 0.001) > MAX_WORDS_PER_SECOND) {
      for (let offset = 0; offset < count; offset += 1) words[index + offset].unreliable = true
    }
    index = end + 1
  }
  return words
}

const readWhisperWords = (jsonPath) => {
  const parsed = JSON.parse(readFileSync(jsonPath, 'utf8'))
  const words = []
  for (const entry of parsed.transcription ?? []) {
    const word = normalizeWord(entry.text ?? '')
    if (!word) continue
    words.push({ word, start: entry.offsets.from, end: entry.offsets.to })
  }
  return markUnreliableRuns(words)
}

/**
 * Longest common subsequence between canonical and whisper words.
 * Returns anchors: canonical index → whisper index, strictly increasing in both.
 * ~600 x ~900 cells, so the full DP table is affordable.
 */
const alignWords = (canonical, heard) => {
  const rows = canonical.length
  const cols = heard.length
  const table = new Uint32Array((rows + 1) * (cols + 1))
  const at = (row, col) => row * (cols + 1) + col

  for (let row = rows - 1; row >= 0; row -= 1) {
    for (let col = cols - 1; col >= 0; col -= 1) {
      table[at(row, col)] =
        canonical[row].word === heard[col].word
          ? table[at(row + 1, col + 1)] + 1
          : Math.max(table[at(row + 1, col)], table[at(row, col + 1)])
    }
  }

  const anchors = []
  let row = 0
  let col = 0
  while (row < rows && col < cols) {
    if (canonical[row].word === heard[col].word) {
      if (!heard[col].unreliable) {
        anchors.push({ canonicalIndex: row, start: heard[col].start, end: heard[col].end })
      }
      row += 1
      col += 1
    } else if (table[at(row + 1, col)] >= table[at(row, col + 1)]) {
      row += 1
    } else {
      col += 1
    }
  }
  return keepAnchorRuns(anchors)
}

/**
 * Drops isolated matches, keeping only anchors inside a run of MIN_ANCHOR_RUN
 * consecutive script words.
 *
 * Every recording opens with an exam announcement that is not in the script
 * ("You will hear... first you have some time to look at questions 11 to 15").
 * A common word there — "to", "have", "the" — will happily match a script word,
 * and because LCS is monotonic that single false anchor drags the opening cue
 * backwards over a minute of silence. Genuine alignment always arrives as a run.
 */
const keepAnchorRuns = (anchors) => {
  const kept = []
  let runStart = 0
  for (let index = 1; index <= anchors.length; index += 1) {
    // A run must be continuous in BOTH script order and time. Adjacent script
    // words separated by a 30s hole in the audio are not one utterance — that is
    // a stray match during the question-reading pause.
    // A couple of skipped script words is normal inside a good run — whisper
    // splits contractions ("let's" → "let" + "s") and drops filler. Demanding
    // strictly consecutive indices shatters real runs into unusable fragments.
    const continues =
      index < anchors.length &&
      anchors[index].canonicalIndex - anchors[index - 1].canonicalIndex <= MAX_ANCHOR_SKIP &&
      anchors[index].start - anchors[index - 1].end <= MAX_ANCHOR_GAP_MS
    if (continues) continue
    const run = anchors.slice(runStart, index)
    const spanSeconds = (run[run.length - 1].end - run[0].start) / 1000
    // Whisper sometimes crams a whole paragraph onto a few milliseconds after a
    // silence. No one speaks at 8 words a second, so such a run is a timing
    // artefact, not an alignment — drop it and let the neighbours interpolate.
    const plausiblePace = spanSeconds <= 0 ? run.length <= 1 : run.length / spanSeconds <= MAX_WORDS_PER_SECOND
    if (run.length >= MIN_ANCHOR_RUN && plausiblePace) kept.push(...run)
    runStart = index
  }
  return kept
}

/**
 * Anchors are sparse — whisper mishears, and monologues drift. Every canonical
 * word gets a time by linear interpolation between its surrounding anchors, and
 * the ends extrapolate to 0 / duration.
 */
const timeEveryWord = (canonicalCount, anchors, durationMs) => {
  const times = new Array(canonicalCount).fill(null)
  for (const anchor of anchors) {
    times[anchor.canonicalIndex] = { start: anchor.start, end: anchor.end, anchored: true }
  }

  const known = anchors.map((anchor) => anchor.canonicalIndex)
  if (known.length === 0) {
    // No anchors at all: fall back to an even spread so cues still advance.
    for (let index = 0; index < canonicalCount; index += 1) {
      const start = (index / canonicalCount) * durationMs
      const end = ((index + 1) / canonicalCount) * durationMs
      times[index] = { start, end }
    }
    return times
  }

  // Unanchored words at either end collapse onto the nearest anchor rather than
  // stretching to 0 / duration. Recordings open with ~60s of exam announcements
  // and close with review time, none of it in the script — spreading across that
  // silence would show the first line a minute before anyone says it.
  const first = known[0]
  const last = known[known.length - 1]
  for (let index = 0; index < first; index += 1) {
    times[index] = { start: times[first].start, end: times[first].start }
  }
  for (let index = last + 1; index < canonicalCount; index += 1) {
    times[index] = { start: times[last].end, end: times[last].end }
  }
  for (let slot = 0; slot < known.length - 1; slot += 1) {
    const from = known[slot]
    const to = known[slot + 1]
    if (to - from <= 1) continue
    const gapStart = times[from].end
    const gapEnd = times[to].start
    for (let index = from + 1; index < to; index += 1) {
      const ratio = (index - from) / (to - from)
      const start = gapStart + ratio * (gapEnd - gapStart)
      times[index] = { start, end: start }
    }
  }
  return times
}

const attachTimings = (cues, canonicalWords, times, durationMs) => {
  // Anchored words win outright. A cue's interpolated edge words can sit on the
  // far side of an un-scripted announcement — "Now listen and answer questions 16
  // to 20" — which would show the line half a minute before it is spoken. Words
  // whose timing was measured are the only trustworthy bounds.
  const bounds = cues.map(() => ({ start: null, end: null, anchored: false }))
  canonicalWords.forEach((entry, index) => {
    const time = times[index]
    if (!time) return
    const bound = bounds[entry.cueIndex]
    if (time.anchored && !bound.anchored) {
      bound.anchored = true
      bound.start = time.start
      bound.end = time.end
      return
    }
    if (bound.anchored && !time.anchored) return
    if (bound.start === null || time.start < bound.start) bound.start = time.start
    if (bound.end === null || time.end > bound.end) bound.end = time.end
  })

  // Anchored cues are authoritative and already in order, so they are placed
  // first and never moved. Unanchored cues are then fitted into the space
  // between their anchored neighbours, shared out by text length. Doing it the
  // other way round — walking forwards and clamping — lets one over-long
  // interpolated cue push every measured cue after it out of sync.
  const anchoredIndexes = bounds
    .map((bound, index) => (bound.anchored ? index : -1))
    .filter((index) => index !== -1)

  const resolved = bounds.map((bound) =>
    bound.anchored ? { start: bound.start, end: bound.end } : null,
  )

  const fitRange = (from, to, rangeStart, rangeEnd) => {
    const weights = []
    for (let index = from; index <= to; index += 1) weights.push(Math.max(1, cues[index].text.length))
    const total = weights.reduce((sum, weight) => sum + weight, 0)
    const span = Math.max(0, rangeEnd - rangeStart)
    let cursor = rangeStart
    for (let index = from; index <= to; index += 1) {
      const share = (weights[index - from] / total) * span
      resolved[index] = { start: cursor, end: cursor + share }
      cursor += share
    }
  }

  if (anchoredIndexes.length === 0) {
    fitRange(0, cues.length - 1, 0, durationMs)
  } else {
    const firstAnchored = anchoredIndexes[0]
    const lastAnchored = anchoredIndexes[anchoredIndexes.length - 1]
    if (firstAnchored > 0) {
      fitRange(0, firstAnchored - 1, Math.max(0, resolved[firstAnchored].start - MIN_CUE_MS), resolved[firstAnchored].start)
    }
    if (lastAnchored < cues.length - 1) {
      fitRange(lastAnchored + 1, cues.length - 1, resolved[lastAnchored].end, Math.min(durationMs, resolved[lastAnchored].end + MIN_CUE_MS))
    }
    for (let slot = 0; slot < anchoredIndexes.length - 1; slot += 1) {
      const from = anchoredIndexes[slot]
      const to = anchoredIndexes[slot + 1]
      if (to - from > 1) fitRange(from + 1, to - 1, resolved[from].end, resolved[to].start)
    }
  }

  // Neighbouring word bounds can overlap by a few ms. Trim the earlier cue so a
  // position never matches two cues at once.
  for (let index = 1; index < resolved.length; index += 1) {
    if (resolved[index - 1].end > resolved[index].start) {
      resolved[index - 1].end = resolved[index].start
    }
  }

  return cues.map((cue, index) => {
    const { start, end } = resolved[index]
    const safeStart = Math.max(0, Math.min(start, durationMs))
    // The minimum display time is a floor, not a licence to overrun the next cue —
    // padding into it would make two cues match the same instant.
    const ceiling = Math.min(resolved[index + 1]?.start ?? durationMs, durationMs)
    const safeEnd = Math.min(
      Math.max(safeStart + MIN_CUE_MS, Math.max(end, safeStart)),
      Math.max(ceiling, safeStart),
    )
    return {
      s: Math.round(safeStart) / 1000,
      e: Math.round(safeEnd) / 1000,
      speaker: cue.speaker,
      text: cue.text,
    }
  })
}

/**
 * Some stored scripts are spliced: the tail of the previous section sits in front
 * of the real one, because the scraper cut the full-test transcript at the wrong
 * boundary (Cam 15/16/19/20 especially). Those leading lines belong to a
 * different recording and can never align here.
 *
 * Rather than reject the whole section, keep only the run of cues that actually
 * anchors to this audio and drop what falls outside it. Coverage is then judged
 * on the retained text, so a spliced script yields correct subtitles for the part
 * it really covers instead of none at all.
 */
const trimToAlignedRange = (cues, canonicalWords, anchors) => {
  if (anchors.length === 0) return { cues, dropped: 0 }

  // Per-cue alignment density. Taking simply the first and last anchor would be
  // defeated by a handful of common words ("of all you have to take out") that
  // match by chance inside the foreign half.
  const total = cues.map(() => 0)
  const hit = cues.map(() => 0)
  const anchored = new Set(anchors.map((anchor) => anchor.canonicalIndex))
  canonicalWords.forEach((entry, index) => {
    total[entry.cueIndex] += 1
    if (anchored.has(index)) hit[entry.cueIndex] += 1
  })
  const solid = cues.map((_, index) => total[index] > 0 && hit[index] / total[index] >= SOLID_CUE_RATIO)

  // Longest run of solid cues, tolerating interior dips of up to SOLID_CUE_GAP.
  // The tolerance matters in both directions: without it, ordinary unaligned
  // patches (a paraphrased line, a passage whisper garbled) would shred a healthy
  // script into fragments; with it too large, a spliced foreign block reconnects
  // to the real one and survives. A foreign block is dozens of cues long, so a
  // handful of cues of slack separates the two cases cleanly.
  let best = { start: 0, end: -1 }
  let start = -1
  let lastSolid = -1
  for (let index = 0; index < cues.length; index += 1) {
    if (!solid[index]) continue
    if (start === -1 || index - lastSolid > SOLID_CUE_GAP + 1) start = index
    lastSolid = index
    if (index - start > best.end - best.start) best = { start, end: index }
  }
  if (best.end < best.start) return { cues, dropped: 0 }

  const dropped = best.start + (cues.length - 1 - best.end)
  return { cues: cues.slice(best.start, best.end + 1), dropped }
}

// ------------------------------------------------------------------ io helpers

const run = (command, args) =>
  execFileSync(command, args, { stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024 })

const downloadAudio = async (key, sources) => {
  const target = join(CACHE_DIR, `${key}.mp3`)
  if (existsSync(target)) return target
  for (const url of sources) {
    try {
      const response = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const buffer = Buffer.from(await response.arrayBuffer())
      if (buffer.length < 100_000) throw new Error(`suspiciously small (${buffer.length} bytes)`)
      writeFileSync(target, buffer)
      return target
    } catch (error) {
      console.warn(`    mirror failed (${new URL(url).hostname}): ${error.message}`)
    }
  }
  return null
}

const probeDurationMs = (path) => {
  const output = run('ffprobe', [
    '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path,
  ]).toString().trim()
  return Math.round(Number.parseFloat(output) * 1000)
}

const transcribe = (key, mp3Path) => {
  const wavPath = join(CACHE_DIR, `${key}.wav`)
  const jsonPath = join(CACHE_DIR, `${key}.json`)
  if (!existsSync(jsonPath)) {
    run('ffmpeg', ['-v', 'error', '-y', '-i', mp3Path, '-ar', '16000', '-ac', '1', '-c:a', 'pcm_s16le', wavPath])
    run('whisper-cli', [
      '-m', MODEL_PATH,
      '-f', wavPath,
      '-ml', '1',            // one JSON entry per word — this is what gives us timings
      '-sow',                // split on words, so contractions stay whole and match ours
      '-oj',
      '-of', join(CACHE_DIR, key),
      '--no-prints',
    ])
    rmSync(wavPath, { force: true })   // 12MB per section; the json is all we keep
  }
  return jsonPath
}

// ----------------------------------------------------------------------- main

const buildKey = async (key, { force }) => {
  const outPath = join(OUT_DIR, `${key}.json`)
  if (!force && existsSync(outPath)) return { key, status: 'skipped' }

  const paragraphs = await getScriptParagraphs(key)
  if (!paragraphs) return { key, status: 'no-script' }

  const mp3Path = await downloadAudio(key, CAMBRIDGE_LISTENING_AUDIO_URLS[key] ?? [])
  if (!mp3Path) return { key, status: 'no-audio' }

  const durationMs = probeDurationMs(mp3Path)
  const jsonPath = transcribe(key, mp3Path)

  const heardWords = readWhisperWords(jsonPath)
  let cues = buildCues(paragraphs)
  let canonicalWords = flattenCueWords(cues)
  let anchors = alignWords(canonicalWords, heardWords)

  // Re-align once on the trimmed script so the retained cues get clean bounds.
  const trimmed = trimToAlignedRange(cues, canonicalWords, anchors)
  if (trimmed.dropped > 0) {
    cues = trimmed.cues
    canonicalWords = flattenCueWords(cues)
    anchors = alignWords(canonicalWords, heardWords)
  }
  const times = timeEveryWord(canonicalWords.length, anchors, durationMs)
  const timedCues = attachTimings(cues, canonicalWords, times, durationMs)

  if (process.env.DEBUG_CUE) {
    const needle = process.env.DEBUG_CUE.toLowerCase()
    const anchoredSet = new Set(anchors.map((anchor) => anchor.canonicalIndex))
    cues.forEach((cue, cueIndex) => {
      if (!cue.text.toLowerCase().includes(needle)) return
      const words = canonicalWords
        .map((entry, index) => ({ ...entry, index }))
        .filter((entry) => entry.cueIndex === cueIndex)
      console.log(`\n  cue ${cueIndex}: ${cue.text}`)
      console.log('  ' + words.map((w) => `${w.word}${anchoredSet.has(w.index) ? '*' + Math.round(times?.[w.index]?.start ?? -1) : ''}`).join(' '))
    })
  }
  const coverage = canonicalWords.length ? anchors.length / canonicalWords.length : 0
  if (coverage < MIN_ANCHOR_COVERAGE) {
    return { key, status: 'mismatched-script', coverage }
  }
  writeFileSync(
    outPath,
    `${JSON.stringify({ key, duration: durationMs / 1000, coverage: Number(coverage.toFixed(3)), cues: timedCues })}\n`,
  )
  return { key, status: 'built', cues: timedCues.length, coverage, dropped: trimmed.dropped }
}

const main = async () => {
  const args = process.argv.slice(2)
  const force = args.includes('--force')
  const explicit = args.filter((arg) => !arg.startsWith('--'))
  const keys = args.includes('--all') || explicit.length === 0
    ? Object.keys(CAMBRIDGE_LISTENING_AUDIO_URLS)
    : explicit

  if (!existsSync(MODEL_PATH)) {
    console.error(`Missing whisper model at ${MODEL_PATH}`)
    console.error('Download: curl -L -o "$_" https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.en.bin')
    process.exit(1)
  }
  mkdirSync(OUT_DIR, { recursive: true })
  mkdirSync(CACHE_DIR, { recursive: true })

  const tally = {}
  for (const [index, key] of keys.entries()) {
    process.stdout.write(`[${index + 1}/${keys.length}] ${key} … `)
    try {
      const result = await buildKey(key, { force })
      tally[result.status] = (tally[result.status] ?? 0) + 1
      console.log(
        result.status === 'built'
          ? `${result.cues} cues, ${(result.coverage * 100).toFixed(1)}% anchored${result.dropped ? ` (dropped ${result.dropped} spliced cue${result.dropped === 1 ? '' : 's'})` : ''}`
          : result.status === 'mismatched-script'
            ? `SKIPPED — only ${(result.coverage * 100).toFixed(1)}% anchored; script does not match this recording`
            : result.status,
      )
    } catch (error) {
      tally.failed = (tally.failed ?? 0) + 1
      console.log(`FAILED — ${error.message}`)
    }
  }
  console.log('\n' + Object.entries(tally).map(([status, count]) => `${status}: ${count}`).join('   '))
}

await main()
