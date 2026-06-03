#!/usr/bin/env node
/**
 * Replace corrupted OCR passage data with clean fetched text.
 * Reads /tmp/clean-passages.json and patches the source exam files.
 *
 * Run: npx tsx scripts/replace-passage-data.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const cleanData = JSON.parse(fs.readFileSync('/tmp/clean-passages.json', 'utf8'))

// Map examId to book number
const bookMap = {
  'cambridge-11': 11, 'cambridge-12': 12, 'cambridge-13': 13,
  'cambridge-14': 14, 'cambridge-15': 15, 'cambridge-16': 16,
  'cambridge-17': 17, 'cambridge-19': 19
}

// Group by book
const byBook = {}
for (const passage of cleanData) {
  const prefix = passage.id.match(/^(cambridge-\d+)/)?.[1]
  const book = bookMap[prefix]
  if (!book) { console.warn('Unknown prefix:', passage.id); continue }
  if (!byBook[book]) byBook[book] = []
  byBook[book].push(passage)
}

let totalPatched = 0
let totalFailed = 0

for (const [book, passages] of Object.entries(byBook)) {
  const filePath = path.join(root, `server/userProvidedReadingPracticeCambridge${book}.mjs`)
  if (!fs.existsSync(filePath)) { console.warn('Missing file:', filePath); continue }

  const mod = await import(`../server/userProvidedReadingPracticeCambridge${book}.mjs`)
  const key = Object.keys(mod).find(k => k.includes('EXAMS'))
  const exams = mod[key]

  for (const cleanPassage of passages) {
    const exam = exams.find(e => e.id === cleanPassage.id)
    if (!exam) { console.warn('Exam not found:', cleanPassage.id); totalFailed++; continue }

    const passage = exam.parsedPayload.passages[0]
    const oldParaCount = passage.bodyParagraphs.length
    const newParaCount = cleanPassage.paragraphs.length

    // Replace body paragraphs
    passage.bodyParagraphs = cleanPassage.paragraphs

    // Replace question data where we have clean versions
    if (cleanPassage.questions?.length) {
      for (const cleanQ of cleanPassage.questions) {
        const existing = passage.questions.find(q => q.number === cleanQ.number)
        if (!existing) continue

        // Clean the prompt
        if (cleanQ.prompt && cleanQ.prompt.trim()) {
          existing.prompt = cleanQ.prompt.trim()
        }

        // Clean the exactPortion
        if (cleanQ.exactPortion && cleanQ.exactPortion.trim()) {
          existing.exactPortion = cleanQ.exactPortion.trim()
        }

        // Only replace answer if it matches (don't override correct answer key)
        const cleanAnswer = (cleanQ.answer || '').trim().toLowerCase()
        const existingAnswer = (existing.correctAnswer || '').trim().toLowerCase()
        if (cleanAnswer && cleanAnswer === existingAnswer) {
          // answers match, all good
        } else if (cleanAnswer && existingAnswer && cleanAnswer !== existingAnswer) {
          console.warn(`  Answer mismatch Q${cleanQ.number} in ${cleanPassage.id}: existing="${existing.correctAnswer}" clean="${cleanQ.answer}"`)
        }
      }
    }

    console.log(`Patched ${cleanPassage.id}: ${oldParaCount} → ${newParaCount} paragraphs, ${cleanPassage.questions?.length || 0} questions cleaned`)
    totalPatched++
  }
}

console.log(`\nDone: ${totalPatched} passages patched, ${totalFailed} failed`)
console.log('\nNOTE: This script patched the in-memory module objects only.')
console.log('You must run the serialise script next to write changes back to .mjs files.')
