// One-off: upload a single already-downloaded Reading file to a manually
// specified lesson key, then delete it locally. Used for the two lessons
// whose durations collide (1975s) and can't be auto-matched.
import fs from 'node:fs'

const [, , fileName, key] = process.argv
if (!fileName || !key) {
  console.error('usage: node upload-one-reading.mjs <fileNameInDownloads> <lessonKey>')
  process.exit(1)
}

const env = Object.fromEntries(
  fs.readFileSync(new URL('./.env.local', import.meta.url), 'utf8').trim().split('\n').map((l) => l.split('='))
)
const API_KEY = env.BUNNY_READING_API_KEY
const LIBRARY_ID = '713390'
const filePath = `/Users/natchanon/Downloads/${fileName}`
const BUNNY_IDS_PATH = new URL('../src/readingVideoIds.json', import.meta.url)

function loadJson(url, fallback) {
  try { return JSON.parse(fs.readFileSync(url, 'utf8')) } catch { return fallback }
}
function saveJson(url, obj) { fs.writeFileSync(url, JSON.stringify(obj, null, 2) + '\n') }

async function main() {
  const createRes = await fetch(`https://video.bunnycdn.com/library/${LIBRARY_ID}/videos`, {
    method: 'POST',
    headers: { AccessKey: API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: key }),
    signal: AbortSignal.timeout(20_000)
  })
  if (!createRes.ok) throw new Error(`create failed: ${createRes.status} ${await createRes.text()}`)
  const { guid } = await createRes.json()

  const localSize = fs.statSync(filePath).size
  console.log(`Uploading ${fileName} (${(localSize / 1e6).toFixed(1)} MB) as ${key} ...`)
  const uploadTimeoutMs = Math.max(300_000, Math.ceil(localSize / 100_000_000) * 90_000)
  const uploadRes = await fetch(`https://video.bunnycdn.com/library/${LIBRARY_ID}/videos/${guid}`, {
    method: 'PUT',
    duplex: 'half',
    headers: { AccessKey: API_KEY, 'Content-Type': 'application/octet-stream', 'Content-Length': String(localSize) },
    body: fs.createReadStream(filePath),
    signal: AbortSignal.timeout(uploadTimeoutMs)
  })
  if (!uploadRes.ok) throw new Error(`upload failed: ${uploadRes.status} ${await uploadRes.text()}`)

  for (let attempt = 0; attempt < 10; attempt++) {
    const verifyRes = await fetch(`https://video.bunnycdn.com/library/${LIBRARY_ID}/videos/${guid}`, { headers: { AccessKey: API_KEY }, signal: AbortSignal.timeout(20_000) })
    const meta = await verifyRes.json()
    if (meta.status === 5 || meta.status === 6) throw new Error(`bunny reports failure: status=${meta.status}`)
    if (meta.status >= 1) break
    await new Promise((r) => setTimeout(r, 3000))
  }

  fs.unlinkSync(filePath)
  const bunnyIds = loadJson(BUNNY_IDS_PATH, {})
  bunnyIds[key] = guid
  saveJson(BUNNY_IDS_PATH, bunnyIds)
  console.log(`Done: ${key} -> ${guid}, local file removed`)
}

main().catch((err) => { console.error('[FAILED]', err.message); process.exit(1) })
