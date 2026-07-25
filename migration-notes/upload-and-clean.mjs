// Watches ~/Downloads for freshly-downloaded Thinkific video files, uploads
// each to Bunny Stream, verifies the upload, then deletes the local copy.
// Never touches anything that isn't a video file matching the known Thinkific
// download-name patterns AND modified after MIGRATION_START — pre-existing
// files in Downloads are never touched.
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

const envPath = new URL('./.env.local', import.meta.url)
const env = Object.fromEntries(
  fs.readFileSync(envPath, 'utf8').trim().split('\n').map((l) => l.split('='))
)
const API_KEY = env.BUNNY_API_KEY
const LIBRARY_ID = '712721'
const DOWNLOADS = path.join(os.homedir(), 'Downloads')
const LOG_PATH = new URL('./upload-log.json', import.meta.url)
const MIGRATION_START = new Date('2026-07-24T22:00:00').getTime()

// Only ever touch files that look like Thinkific downloads AND are newer
// than when this migration started. Pre-existing Downloads content is never
// matched by this pattern.
// NOTE: originally required the id to start with "c" — wrong. Thinkific's
// random ids can start with any lowercase letter (confirmed: a file starting
// with "d" sat unprocessed for hours before this was caught). Match any
// lowercase-alphanumeric id of the right length instead.
// NOTE 2: Chrome appends " (1)", " (2)", etc. before the extension when a
// download's filename collides with one already in Downloads — e.g. a
// re-downloaded file becomes "abc123...xyz (1).mp4". That suffix sat outside
// the pattern entirely, so those files were invisible to this script. Allow
// an optional " (N)" before the extension.
const THINKIFIC_NAME = /^([a-z0-9]{19,25}|unclaimed_\d+)( \(\d+\))?\.(mp4|mov)$/i
const RENAMED_NAME = /^c\d+-l\d+( \(\d+\))?\.(mp4|mov)$/i

function loadLog() {
  try {
    return JSON.parse(fs.readFileSync(LOG_PATH, 'utf8'))
  } catch {
    return {}
  }
}
function saveLog(log) {
  fs.writeFileSync(LOG_PATH, JSON.stringify(log, null, 2))
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
  // Native fetch has no default timeout — a stalled connection hangs forever
  // and blocks every other file behind it in the queue. Scale the timeout to
  // file size so large uploads still get a generous window (min 3 minutes,
  // ~1 minute per 100MB) without letting a truly dead connection hang the
  // whole pipeline indefinitely.
  const uploadTimeoutMs = Math.max(180_000, Math.ceil(localSize / 100_000_000) * 60_000)
  // Stream the file instead of reading it fully into memory first — a
  // fs.readFileSync on a 1.5GB+ file demands a matching contiguous memory
  // allocation up front, which starts failing under real system memory
  // pressure (confirmed: repeated "fetch failed" on large files while system
  // free pages were very low). Streaming never needs more than a small
  // buffer at a time regardless of file size.
  const uploadRes = await fetch(`https://video.bunnycdn.com/library/${LIBRARY_ID}/videos/${guid}`, {
    method: 'PUT',
    duplex: 'half',
    headers: { AccessKey: API_KEY, 'Content-Type': 'application/octet-stream', 'Content-Length': String(localSize) },
    body: fs.createReadStream(filePath),
    signal: AbortSignal.timeout(uploadTimeoutMs)
  })
  if (!uploadRes.ok) throw new Error(`upload failed: ${uploadRes.status} ${await uploadRes.text()}`)
  // A 2xx response here means Bunny's server received and acknowledged the
  // full byte stream we sent (fetch doesn't resolve until the request body
  // finishes sending and a response comes back) — that's the real signal the
  // upload succeeded, not a post-hoc size comparison.

  // Sanity-poll: confirm Bunny actually has the video and has started
  // processing it (status >= 1). Don't compare storageSize to the local file
  // size — Bunny transcodes into multiple renditions, so storageSize is
  // expected to end up LARGER than the source file, sometimes by a lot, and
  // isn't populated until encoding progresses. This is just a "does the
  // video genuinely exist and did Bunny start working on it" check, not a
  // byte-for-byte comparison.
  for (let attempt = 0; attempt < 10; attempt++) {
    const verifyRes = await fetch(`https://video.bunnycdn.com/library/${LIBRARY_ID}/videos/${guid}`, {
      headers: { AccessKey: API_KEY },
      signal: AbortSignal.timeout(20_000)
    })
    if (!verifyRes.ok) throw new Error(`verify fetch failed: ${verifyRes.status}`)
    const meta = await verifyRes.json()
    // status: 0=created, 1=uploaded, 2=processing, 3=transcoding, 4=finished, 5=error, 6=upload-failed
    if (meta.status === 5 || meta.status === 6) {
      throw new Error(`bunny reports processing failure: status=${meta.status}`)
    }
    if (meta.status >= 1) return guid // upload confirmed received, encoding underway or done
    await new Promise((r) => setTimeout(r, 3000))
  }
  throw new Error(`upload never progressed past status=0 after 30s — not deleting local file`)
}

async function processOnce() {
  const log = loadLog()
  const entries = fs.readdirSync(DOWNLOADS, { withFileTypes: true })
  let processed = 0

  for (const entry of entries) {
    if (!entry.isFile()) continue
    const name = entry.name
    const isThinkific = THINKIFIC_NAME.test(name)
    const isRenamed = RENAMED_NAME.test(name)
    if (!isThinkific && !isRenamed) continue

    const full = path.join(DOWNLOADS, name)
    const stat = fs.statSync(full)
    if (stat.mtimeMs < MIGRATION_START) continue // never touch anything older than migration start
    if (log[name]?.deletedLocal) continue // only skip confirmed-successful uploads — retry anything that errored
    if (Date.now() - stat.mtimeMs < 15_000) continue // still likely writing/downloading, wait a beat

    let guid = log[name]?.guid // a prior run may have uploaded successfully but failed to delete/log correctly
    try {
      if (!guid) {
        console.log(`[upload] ${name} (${(stat.size / 1e6).toFixed(1)} MB) ...`)
        guid = await uploadToBunny(full, name.replace(/\.(mp4|mov)$/i, ''))
        // Save immediately — a failure in the delete step below must never
        // lose track of a guid we already confirmed exists on Bunny.
        log[name] = { guid, sizeBytes: stat.size, uploadedAt: new Date().toISOString(), deletedLocal: false }
        saveLog(log)
      }
      fs.unlinkSync(full)
      log[name] = { ...log[name], deletedLocal: true }
      saveLog(log)
      processed++
      console.log(`[done]   ${name} -> bunny guid ${guid}, local copy removed`)
    } catch (err) {
      log[name] = { ...(log[name] || {}), error: String(err), sizeBytes: stat.size, attemptedAt: new Date().toISOString(), deletedLocal: false }
      saveLog(log)
      console.error(`[FAILED] ${name}: ${err.message}${guid ? ` (already uploaded as ${guid}, will retry delete only)` : ''} — local file kept, not deleted`)
    }
  }
  return processed
}

async function main() {
  console.log(`Watching ${DOWNLOADS} for Thinkific video downloads...`)
  console.log(`Only touching files newer than ${new Date(MIGRATION_START).toISOString()}`)
  while (true) {
    try {
      await processOnce()
    } catch (err) {
      console.error('[loop error]', err)
    }
    await new Promise((r) => setTimeout(r, 10_000))
  }
}

main()
