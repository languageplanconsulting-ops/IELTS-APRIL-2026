#!/usr/bin/env node
/**
 * Patches source exam .mjs files with clean passage text fetched online.
 * Imports each source module, replaces bodyParagraphs + question exactPortions,
 * then rewrites the file as a clean JSON export.
 *
 * Run: npx tsx scripts/patch-passages-from-clean.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const cleanData = JSON.parse(fs.readFileSync('/tmp/clean-passages.json', 'utf8'))

const bookForId = (id) => {
  const m = id.match(/^cambridge-(\d+)/)
  return m ? Number(m[1]) : null
}

// Group clean passages by book
const byBook = {}
for (const p of cleanData) {
  if (!p.found || !p.paragraphs?.length) { console.warn('Skipping (not found):', p.id); continue }
  const book = bookForId(p.id)
  if (!book) continue
  if (!byBook[book]) byBook[book] = []
  byBook[book].push(p)
}

const EXPORT_NAMES = {
  11: 'USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_11_EXAMS',
  12: 'USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_12_EXAMS',
  13: 'USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_13_EXAMS',
  14: 'USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_14_EXAMS',
  15: 'USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_15_EXAMS',
  16: 'USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_16_EXAMS',
  17: 'USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_17_EXAMS',
  19: 'USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_19_EXAMS',
}

let totalPatched = 0

for (const [book, cleanPassages] of Object.entries(byBook)) {
  const filePath = path.join(root, `server/userProvidedReadingPracticeCambridge${book}.mjs`)
  if (!fs.existsSync(filePath)) { console.warn('Missing:', filePath); continue }

  // Import the module to get the current data
  const mod = await import(`../server/userProvidedReadingPracticeCambridge${book}.mjs`)
  const key = Object.keys(mod).find(k => k.includes('EXAMS'))
  // Deep clone to avoid modifying the module cache
  const exams = JSON.parse(JSON.stringify(mod[key]))

  let modified = false

  for (const cleanPassage of cleanPassages) {
    const exam = exams.find(e => e.id === cleanPassage.id)
    if (!exam) { console.warn('  Exam not found:', cleanPassage.id); continue }

    const passage = exam.parsedPayload.passages[0]
    if (!passage) continue

    const oldParas = passage.bodyParagraphs.join(' ').slice(0, 80)
    const newParas = cleanPassage.paragraphs.join(' ').slice(0, 80)

    if (oldParas === newParas) {
      console.log(`  ${cleanPassage.id}: passage already clean`)
    } else {
      passage.bodyParagraphs = cleanPassage.paragraphs
      console.log(`  ${cleanPassage.id}: replaced ${passage.bodyParagraphs.length} paragraphs`)
      modified = true
      totalPatched++
    }

    // Update question exactPortions where clean versions are available
    if (cleanPassage.questions?.length) {
      for (const cleanQ of cleanPassage.questions) {
        if (!cleanQ.exactPortion?.trim()) continue
        const existing = passage.questions?.find(q => q.number === cleanQ.number)
        if (!existing) continue
        const clean = cleanQ.exactPortion.trim()
        if (existing.exactPortion !== clean) {
          existing.exactPortion = clean
          modified = true
        }
        // Also clean up prompt if it's garbled (has OCR markers like random caps)
        if (cleanQ.prompt?.trim() && /[A-Z]{3,}|[a-z][A-Z]{2}|\.{3,}[a-z]/.test(existing.prompt || '')) {
          existing.prompt = cleanQ.prompt.trim()
          modified = true
        }
      }
    }
  }

  if (!modified) {
    console.log(`Cambridge ${book}: no changes needed`)
    continue
  }

  // Write back
  const exportName = EXPORT_NAMES[book] || `USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_${book}_EXAMS`
  const newSrc = `export const ${exportName} = ${JSON.stringify(exams, null, 2)}\n`
  fs.writeFileSync(filePath, newSrc, 'utf8')
  console.log(`  Wrote Cambridge ${book} (${exams.length} exams)`)
}

console.log(`\nDone: ${totalPatched} passages patched`)
