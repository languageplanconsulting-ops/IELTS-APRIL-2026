// Uploads pre-named c{chapter}-l{lesson}.{ext} files from
// ~/Downloads/bunny-migration/ straight to Bunny Stream and wires each
// directly into src/bunnyVideoIds.json — no duration-matching needed since
// the filename already says exactly which lesson it is.
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

const env = Object.fromEntries(
  fs.readFileSync(new URL('./.env.local', import.meta.url), 'utf8').trim().split('\n').map((l) => l.split('='))
)
const API_KEY = env.BUNNY_API_KEY
const LIBRARY_ID = '712721'
const SRC_DIR = path.join(os.homedir(), 'Downloads', 'bunny-migration')
const BUNNY_IDS_PATH = new URL('../src/bunnyVideoIds.json', import.meta.url)
const LOG_PATH = new URL('./named-batch-log.json', import.meta.url)

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
  throw new Error('upload never progressed past status=0 after 30s')
}

async function main() {
  const bunnyIds = loadJson(BUNNY_IDS_PATH, {})
  const log = loadJson(LOG_PATH, {})

  const files = fs
    .readdirSync(SRC_DIR)
    .filter((f) => /^c\d+-l\d+\.(mp4|mov)$/i.test(f))
    .sort()

  console.log(`${files.length} pre-named files found in ${SRC_DIR}`)

  for (const name of files) {
    const id = name.replace(/\.(mp4|mov)$/i, '')
    if (bunnyIds[id]) {
      console.log(`[skip]   ${name} — lesson ${id} already linked, removing local duplicate`)
      fs.unlinkSync(path.join(SRC_DIR, name))
      continue
    }
    const full = path.join(SRC_DIR, name)
    let guid = log[id]?.guid
    try {
      if (!guid) {
        const sizeMB = (fs.statSync(full).size / 1e6).toFixed(1)
        console.log(`[upload] ${name} (${sizeMB} MB) ...`)
        guid = await uploadToBunny(full, id)
        log[id] = { guid, uploadedAt: new Date().toISOString(), deletedLocal: false }
        saveJson(LOG_PATH, log)
      }
      fs.unlinkSync(full)
      log[id] = { ...log[id], deletedLocal: true }
      saveJson(LOG_PATH, log)
      bunnyIds[id] = guid
      saveJson(BUNNY_IDS_PATH, bunnyIds)
      console.log(`[done]   ${name} -> bunny guid ${guid}, linked as ${id}, local copy removed`)
    } catch (err) {
      log[id] = { ...(log[id] || {}), error: String(err), attemptedAt: new Date().toISOString(), deletedLocal: false }
      saveJson(LOG_PATH, log)
      console.error(`[FAILED] ${name}: ${err.message} — local file kept, not deleted`)
    }
  }
  console.log('Batch complete.')
}

main()
