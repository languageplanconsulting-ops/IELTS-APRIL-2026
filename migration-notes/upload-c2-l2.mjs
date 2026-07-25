// One-off upload for the final missing Writing lesson: c2-l2
// "วิธีคิดโจทย์ Process Diagram (BAND 7.5+)" — Thinkific content id 45351676,
// filename 2023-05-18 15-27-56.mp4, downloaded as "chiucvfgmkmg5e3lgaq0 (1).mp4".
import fs from 'node:fs'

const env = Object.fromEntries(
  fs.readFileSync(new URL('./.env.local', import.meta.url), 'utf8').trim().split('\n').map((l) => l.split('='))
)
const API_KEY = env.BUNNY_API_KEY
const LIBRARY_ID = '712721'
const FILE_PATH = '/Users/natchanon/Downloads/chiucvfgmkmg5e3lgaq0 (1).mp4'
const LESSON_ID = 'c2-l2'
const BUNNY_IDS_PATH = new URL('../src/bunnyVideoIds.json', import.meta.url)

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
    if (meta.status >= 1) return { guid, length: meta.length }
    await new Promise((r) => setTimeout(r, 3000))
  }
  throw new Error('upload never progressed past status=0 after 30s')
}

async function main() {
  const sizeMB = (fs.statSync(FILE_PATH).size / 1e6).toFixed(1)
  console.log(`Uploading ${FILE_PATH} (${sizeMB} MB) as ${LESSON_ID} ...`)
  const { guid, length } = await uploadToBunny(FILE_PATH, LESSON_ID)
  console.log(`Uploaded. guid=${guid} length=${length}s (expected 1034s)`)

  const bunnyIds = loadJson(BUNNY_IDS_PATH, {})
  bunnyIds[LESSON_ID] = guid
  saveJson(BUNNY_IDS_PATH, bunnyIds)
  console.log(`Linked ${LESSON_ID} -> ${guid} in ${BUNNY_IDS_PATH.pathname}`)

  fs.unlinkSync(FILE_PATH)
  console.log('Local file deleted.')
}

main().catch((err) => {
  console.error(`[FAILED] ${err.message}`)
  process.exit(1)
})
