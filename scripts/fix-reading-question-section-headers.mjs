#!/usr/bin/env node
/**
 * Ensure Questions X-Y headers cover all declared question ranges.
 * Run: node scripts/fix-reading-question-section-headers.mjs
 */

import fs from 'node:fs'
import path from 'node:path'

const FILES = [
  'server/userProvidedReadingPracticeCambridge11.mjs',
  'server/userProvidedReadingPracticeCambridge12.mjs',
  'server/userProvidedReadingPracticeCambridge13.mjs',
  'server/userProvidedReadingPracticeCambridge14.mjs',
  'server/userProvidedReadingPracticeCambridge15.mjs',
  'server/userProvidedReadingPracticeCambridge16.mjs',
  'server/userProvidedReadingPracticeCambridge17.mjs',
  'server/userProvidedReadingPracticeCambridge19.mjs'
]

const ensureHeaders = (sectionText, ranges) => {
  let text = String(sectionText || '')
  if (!ranges?.length) return text

  for (const range of ranges) {
    const header = `Questions ${range.start}-${range.end}`
    if (new RegExp(`Questions\\s+${range.start}\\s*[–-]\\s*${range.end}`, 'i').test(text)) continue
    text = `${header}\n${text}`.trim()
  }
  return text
}

let fixed = 0

for (const relPath of FILES) {
  const absPath = path.join(process.cwd(), relPath)
  if (!fs.existsSync(absPath)) continue

  const mod = await import(`file://${absPath}`)
  const exportName = Object.keys(mod).find((key) => key.startsWith('USER_PROVIDED_READING_PRACTICE_'))
  const exams = mod[exportName]
  if (!Array.isArray(exams)) continue

  let touched = false
  const nextExams = exams.map((exam) => {
    const passage = exam.parsedPayload?.passages?.[0]
    if (!passage?.questionRanges?.length) return exam

    const nextSection = ensureHeaders(passage.questionSectionText, passage.questionRanges)
    if (nextSection === passage.questionSectionText) return exam

    fixed += 1
    touched = true
    const rawPassageText = String(exam.rawPassageText || '').replace(/Questions [\s\S]*$/m, nextSection)

    return {
      ...exam,
      rawPassageText,
      parsedPayload: {
        ...exam.parsedPayload,
        passages: [{ ...passage, questionSectionText: nextSection }]
      },
      updatedAt: new Date().toISOString()
    }
  })

  if (touched) {
    fs.writeFileSync(absPath, `export const ${exportName} = ${JSON.stringify(nextExams, null, 2)}\n`, 'utf8')
    console.log(`Fixed question headers in ${relPath}`)
  }
}

console.log(`Updated ${fixed} question section(s).`)
