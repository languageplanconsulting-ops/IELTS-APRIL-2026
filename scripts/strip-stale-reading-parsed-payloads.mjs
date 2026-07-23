#!/usr/bin/env node
/**
 * buildReadingExamPayload() prefers a stored `parsedPayload` cache over
 * rawPassageText/rawAnswerKey whenever it looks structurally valid — even
 * when it's stale. Several past fix scripts corrected rawAnswerKey/
 * rawPassageText but never regenerated parsedPayload, so the corrected text
 * was silently shadowed by the old cached (sometimes far more corrupted)
 * version students actually saw.
 *
 * This strips parsedPayload from every exam in the given books, forcing the
 * app to always derive from the current rawPassageText/rawAnswerKey — which
 * is the text every OCR/content-fix script actually maintains.
 *
 * Run: node scripts/strip-stale-reading-parsed-payloads.mjs [book...]
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const args = process.argv.slice(2)
const books = args.filter((a) => /^\d+$/.test(a)).map(Number)
const targetBooks = books.length ? books : [11, 12, 13, 14, 15, 16, 17, 19]

for (const book of targetBooks) {
  const modulePath = path.join(root, 'server', `userProvidedReadingPracticeCambridge${book}.mjs`)
  const exportName = `USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_${book}_EXAMS`
  const mod = await import(pathToFileURL(modulePath).href)
  const exams = mod[exportName]

  let stripped = 0
  const nextExams = exams.map((exam) => {
    if (!exam.parsedPayload) return exam
    stripped += 1
    const { parsedPayload, ...rest } = exam
    return rest
  })

  if (!stripped) {
    console.log(`Cambridge ${book}: no parsedPayload caches found`)
    continue
  }
  fs.writeFileSync(modulePath, `export const ${exportName} = ${JSON.stringify(nextExams, null, 2)}\n`, 'utf8')
  console.log(`Cambridge ${book}: stripped ${stripped} stale parsedPayload cache(s)`)
}
