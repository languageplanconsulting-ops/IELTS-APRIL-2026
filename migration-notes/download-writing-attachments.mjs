// Downloads every lesson attachment (PDFs/images) found via the course_player
// API for the Writing course and stores them under public/writing-course-docs/,
// keyed by c{chapterIdx}-l{lessonIdx} to match bunnyVideoIds.json's scheme.
import fs from 'node:fs'
import path from 'node:path'

const ROOT = decodeURIComponent(new URL('../', import.meta.url).pathname)
const ATTACHMENTS_JSON = '/Users/natchanon/Downloads/writing-attachments.json'
const TSV_PATH = path.join(ROOT, 'migration-notes/writing-93-lessons.tsv')
const OUT_DIR = path.join(ROOT, 'public/writing-course-docs')
const OUT_JSON = path.join(ROOT, 'src/writingCourseDocs.json')

fs.mkdirSync(OUT_DIR, { recursive: true })

const tsvLines = fs.readFileSync(TSV_PATH, 'utf8').trim().split('\n').slice(1)
const contentIdToKey = {}
for (const line of tsvLines) {
  const [chapterIdx, lessonIdx, thinkificId] = line.split('\t')
  contentIdToKey[thinkificId] = `c${chapterIdx}-l${lessonIdx}`
}

const attachments = JSON.parse(fs.readFileSync(ATTACHMENTS_JSON, 'utf8'))

function sanitize(name) {
  return name
    .normalize('NFC')
    .replace(/%2F/gi, '-')
    .replace(/[/\\?%*:|"<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

async function downloadFile(url, destPath) {
  const res = await fetch(url, { signal: AbortSignal.timeout(60_000) })
  if (!res.ok) throw new Error(`${res.status} for ${url}`)
  const buf = Buffer.from(await res.arrayBuffer())
  fs.writeFileSync(destPath, buf)
  return buf.length
}

async function main() {
  const result = {}
  let ok = 0
  let fail = 0
  for (const lesson of attachments) {
    const key = contentIdToKey[String(lesson.c)]
    if (!key) {
      console.warn(`[skip] contentId ${lesson.c} (${lesson.n.trim()}) — not found in TSV`)
      continue
    }
    const files = []
    for (let i = 0; i < lesson.f.length; i++) {
      const f = lesson.f[i]
      const ext = path.extname(new URL(f.u).pathname) || '.pdf'
      const safeName = sanitize(f.fn)
      const fileName = `${key}-${i}${ext.toLowerCase()}`
      const destPath = path.join(OUT_DIR, fileName)
      try {
        const size = await downloadFile(f.u, destPath)
        files.push({ name: safeName, path: `/writing-course-docs/${fileName}` })
        ok++
        console.log(`[ok] ${key} -> ${fileName} (${(size / 1024).toFixed(0)} KB) "${safeName}"`)
      } catch (err) {
        fail++
        console.error(`[FAIL] ${key} file ${i} (${f.u}): ${err.message}`)
      }
    }
    if (files.length) result[key] = files
  }
  fs.writeFileSync(OUT_JSON, JSON.stringify(result, null, 2) + '\n')
  console.log(`\nDone. ${ok} files downloaded, ${fail} failed. Map written to ${OUT_JSON}`)
}

main()
