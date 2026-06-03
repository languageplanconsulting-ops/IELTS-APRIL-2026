#!/usr/bin/env node
/**
 * Re-merge sentence-level passage fragments into proper paragraphs for all reading exams.
 * Run: node scripts/reflow-reading-passage-paragraphs.mjs [bookNumbers...]
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  isOverFragmentedReadingPassage,
  resolveReadingPassageBodyParagraphs
} from '../server/readingImportUtils.mjs'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const defaultBooks = [11, 12, 13, 14, 15, 16, 17, 19]
const books = process.argv.slice(2).map(Number).filter(Boolean)
const targetBooks = books.length ? books : defaultBooks

let reflowed = 0
let examsTouched = 0

for (const book of targetBooks) {
  const exportName = `USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_${book}_EXAMS`
  const mod = await import(`../server/userProvidedReadingPracticeCambridge${book}.mjs`)
  const exams = mod[exportName]
  if (!Array.isArray(exams)) continue

  let bookChanged = false

  const nextExams = exams.map((exam) => {
    const passages = exam.parsedPayload?.passages
    if (!Array.isArray(passages) || !passages.length) return exam

    let examChanged = false
    const nextPassages = passages.map((passage) => {
      const before = passage.bodyParagraphs || []
      if (!before.length) return passage

      const wasFragmented = isOverFragmentedReadingPassage(before)
      const after = resolveReadingPassageBodyParagraphs(passage.title, before)
      if (
        after.length === before.length &&
        after.every((paragraph, index) => paragraph === before[index])
      ) {
        return passage
      }

      examChanged = true
      if (wasFragmented) reflowed += 1
      return { ...passage, bodyParagraphs: after }
    })

    if (!examChanged) return exam
    examsTouched += 1
    bookChanged = true
    return {
      ...exam,
      parsedPayload: { ...exam.parsedPayload, passages: nextPassages },
      updatedAt: new Date().toISOString()
    }
  })

  if (bookChanged) {
    const outputPath = path.join(root, 'server', `userProvidedReadingPracticeCambridge${book}.mjs`)
    fs.writeFileSync(outputPath, `export const ${exportName} = ${JSON.stringify(nextExams, null, 2)}\n`, 'utf8')
    console.log(`Cambridge ${book}: reflowed passage paragraphs (${examsTouched} exams touched so far)`)
  }
}

console.log(`Done: ${reflowed} over-fragmented passages reflowed across ${examsTouched} exams`)
