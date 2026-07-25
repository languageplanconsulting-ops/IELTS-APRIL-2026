// Watches ~/Downloads for the Reading course's video downloads and matches
// each to a lesson by ACTUAL VIDEO DURATION (via ffprobe), not filename.
//
// Confirmed the hard way: the filename Chrome saves a Thinkific "Download"
// as is the video's internal storage identifier (e.g. d6nght08ajts72tmuk0g.mov)
// — NOT the friendly display name shown in the Video Library or lesson editor.
// Duration matching against reading-video-map.json's `seconds` field (pulled
// from the course_player API) is what actually works, same as the original
// Writing course migration.
//
// 78 of 79 lessons have a unique duration. One pair collides at 1975s
// (c0-l5 and c5-l4) — those two are left for manual resolution, never
// auto-matched, so neither can be silently mislabeled as the other.
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

const envPath = new URL('./.env.local', import.meta.url)
const env = Object.fromEntries(
  fs.readFileSync(envPath, 'utf8').trim().split('\n').map((l) => l.split('='))
)
const API_KEY = env.BUNNY_READING_API_KEY
const LIBRARY_ID = '713390'
const DOWNLOADS = path.join(os.homedir(), 'Downloads')
const LOG_PATH = new URL('./upload-log-reading.json', import.meta.url)
const BUNNY_IDS_PATH = new URL('../src/readingVideoIds.json', import.meta.url)
const MANIFEST_PATH = new URL('./reading-video-map.json', import.meta.url)
const MIGRATION_START = new Date('2026-07-25T21:00:00').getTime()

const VIDEO_NAME = /\.(mp4|mov)$/i

function loadJson(url, fallback) {
  try {
    return JSON.parse(fs.readFileSync(url, 'utf8'))
  } catch {
    return fallback
  }
}
function saveJson(url, obj) {
  fs.writeFileSync(url, JSON.stringify(obj, null, 2) + '\n')
}

const manifest = loadJson(MANIFEST_PATH, [])
// ffprobe's reported duration can differ from Thinkific's by up to ~1s
// (container/encoding overhead), so match within a small tolerance rather
// than requiring exact integer equality — confirmed real case: manifest says
// 1050s, ffprobe reports 1050.75 -> rounds to 1051.
const TOLERANCE = 1
function findMatch(seconds) {
  const matches = manifest.filter((m) => Math.abs(m.seconds - seconds) <= TOLERANCE)
  if (matches.length === 1) return { key: matches[0].key, ambiguous: false }
  if (matches.length > 1) return { key: null, ambiguous: true }
  return { key: null, ambiguous: false }
}

async function probeDurationSeconds(filePath) {
  const { stdout } = await execFileAsync('ffprobe', [
    '-v', 'error',
    '-show_entries', 'format=duration',
    '-of', 'default=noprint_wrappers=1:nokey=1',
    filePath
  ])
  return Math.round(parseFloat(stdout.trim()))
}

async function uploadToBunny(filePath, title) {
  const createRes = await fetch(`https://video.bunnycdn.com/library/${LIBRARY_ID}/videos`, {
    method: 'POST',
    headers: { AccessKey: API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
    signal: AbortSignal.timeout(20_000)
  })
  if (!createRes.ok) throw new Error(`create failed: ${createRes.status} ${await createRes.text()}`)
  const { guid } = await createRes.json()

  const localSize = fs.statSync(filePath).size
  const uploadTimeoutMs = Math.max(180_000, Math.ceil(localSize / 100_000_000) * 60_000)
  const uploadRes = await fetch(`https://video.bunnycdn.com/library/${LIBRARY_ID}/videos/${guid}`, {
    method: 'PUT',
    duplex: 'half',
    headers: { AccessKey: API_KEY, 'Content-Type': 'application/octet-stream', 'Content-Length': String(localSize) },
    body: fs.createReadStream(filePath),
    signal: AbortSignal.timeout(uploadTimeoutMs)
  })
  if (!uploadRes.ok) throw new Error(`upload failed: ${uploadRes.status} ${await uploadRes.text()}`)

  for (let attempt = 0; attempt < 10; attempt++) {
    const verifyRes = await fetch(`https://video.bunnycdn.com/library/${LIBRARY_ID}/videos/${guid}`, {
      headers: { AccessKey: API_KEY },
      signal: AbortSignal.timeout(20_000)
    })
    if (!verifyRes.ok) throw new Error(`verify fetch failed: ${verifyRes.status}`)
    const meta = await verifyRes.json()
    if (meta.status === 5 || meta.status === 6) throw new Error(`bunny reports processing failure: status=${meta.status}`)
    if (meta.status >= 1) return guid
    await new Promise((r) => setTimeout(r, 3000))
  }
  throw new Error(`upload never progressed past status=0 after 30s — not deleting local file`)
}

// Sequential uploads left the pipeline bottlenecked on one slow/timing-out
// transfer at a time. Process several files concurrently instead — network
// waits overlap, and one stuck upload no longer blocks everything behind it.
const CONCURRENCY = 2

async function processFile(name) {
  const log = loadJson(LOG_PATH, {})
  const bunnyIds = loadJson(BUNNY_IDS_PATH, {})
  const full = path.join(DOWNLOADS, name)
  let stat
  try {
    stat = fs.statSync(full)
  } catch {
    return false // vanished mid-scan (rename race) — pick it up next cycle
  }

  try {
    let key = log[name]?.key
    if (!key) {
      const seconds = await probeDurationSeconds(full)
      const match = findMatch(seconds)
      if (match.ambiguous) {
        console.warn(`[SKIP]   ${name} — duration ${seconds}s is ambiguous (collides between multiple lessons), needs manual resolution`)
        log[name] = { seconds, skipped: true, reason: 'ambiguous duration', attemptedAt: new Date().toISOString() }
        saveJson(LOG_PATH, log)
        return false
      }
      key = match.key
      if (!key) {
        console.warn(`[SKIP]   ${name} — duration ${seconds}s doesn't match any known Reading lesson`)
        log[name] = { seconds, skipped: true, reason: 'no duration match', attemptedAt: new Date().toISOString() }
        saveJson(LOG_PATH, log)
        return false
      }
      if (bunnyIds[key]) {
        console.log(`[skip]   ${name} — lesson ${key} already uploaded, removing local duplicate`)
        fs.unlinkSync(full)
        return false
      }
      console.log(`[match]  ${name} (${seconds}s) -> ${key}`)
    }

    let guid = log[name]?.guid
    if (!guid) {
      console.log(`[upload] ${name} -> ${key} (${(stat.size / 1e6).toFixed(1)} MB) ...`)
      guid = await uploadToBunny(full, key)
      log[name] = { key, guid, sizeBytes: stat.size, uploadedAt: new Date().toISOString(), deletedLocal: false }
      saveJson(LOG_PATH, log)
    }
    // Record the guid before attempting delete — a successful upload must
    // never be lost just because the local file happened to already be
    // gone (confirmed real case: ENOENT on unlink after a real upload).
    const bunnyIds2 = loadJson(BUNNY_IDS_PATH, {})
    bunnyIds2[key] = guid
    saveJson(BUNNY_IDS_PATH, bunnyIds2)
    fs.unlinkSync(full)
    const log2 = loadJson(LOG_PATH, {})
    log2[name] = { ...log2[name], deletedLocal: true }
    saveJson(LOG_PATH, log2)
    console.log(`[done]   ${name} -> ${key} -> bunny guid ${guid}, local copy removed`)
    return true
  } catch (err) {
    const log3 = loadJson(LOG_PATH, {})
    log3[name] = { ...(log3[name] || {}), error: String(err), sizeBytes: stat.size, attemptedAt: new Date().toISOString(), deletedLocal: false }
    saveJson(LOG_PATH, log3)
    console.error(`[FAILED] ${name}: ${err.message} — local file kept, not deleted`)
    return false
  }
}

async function processOnce() {
  const log = loadJson(LOG_PATH, {})
  const entries = fs.readdirSync(DOWNLOADS, { withFileTypes: true })
  const candidates = []

  for (const entry of entries) {
    if (!entry.isFile()) continue
    const name = entry.name
    if (!VIDEO_NAME.test(name)) continue
    const full = path.join(DOWNLOADS, name)
    let stat
    try {
      stat = fs.statSync(full)
    } catch {
      continue
    }
    if (stat.mtimeMs < MIGRATION_START) continue
    if (log[name]?.deletedLocal || log[name]?.skipped) continue
    if (Date.now() - stat.mtimeMs < 15_000) continue // still likely writing
    candidates.push(name)
  }

  let processed = 0
  for (let i = 0; i < candidates.length; i += CONCURRENCY) {
    const batch = candidates.slice(i, i + CONCURRENCY)
    const results = await Promise.all(batch.map(processFile))
    processed += results.filter(Boolean).length
  }
  return processed
}

async function main() {
  console.log(`Watching ${DOWNLOADS} for Reading course video downloads (${manifest.length} known lessons, matching by duration)...`)
  console.log(`Only touching files newer than ${new Date(MIGRATION_START).toISOString()}`)
  const secondsCounts = {}
  manifest.forEach((m) => { secondsCounts[m.seconds] = (secondsCounts[m.seconds] || 0) + 1 })
  const ambiguous = manifest.filter((m) => secondsCounts[m.seconds] > 1).map((m) => m.seconds)
  if (ambiguous.length) console.log(`Ambiguous durations requiring manual resolution: ${[...new Set(ambiguous)].join(', ')}`)
  while (true) {
    try {
      const n = await processOnce()
      const bunnyIds = loadJson(BUNNY_IDS_PATH, {})
      const done = Object.keys(bunnyIds).length
      if (n > 0) console.log(`[progress] ${done}/${manifest.length} lessons uploaded so far`)
    } catch (err) {
      console.error('[loop error]', err)
    }
    await new Promise((r) => setTimeout(r, 10_000))
  }
}

main()
