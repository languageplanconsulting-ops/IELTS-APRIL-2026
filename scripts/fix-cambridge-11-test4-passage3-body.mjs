#!/usr/bin/env node
/**
 * One-off repair for cambridge-11-test4-passage3 ("This Marvellous
 * Invention") rawPassageText: a duplicated opening sentence split paragraph
 * A in two, paragraph D's letter got OCR'd as "O" and merged into paragraph
 * C with no line break, and paragraph D's closing line carried OCR garbage
 * ("1rLanguagc-") plus a lone "F" paragraph-letter line before paragraph F's
 * real text.
 *
 * Run: node scripts/fix-cambridge-11-test4-passage3-body.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const modulePath = path.join(root, 'server', 'userProvidedReadingPracticeCambridge11.mjs')
const exportName = 'USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_11_EXAMS'
const mod = await import(pathToFileURL(modulePath).href)
const exams = mod[exportName]

const FIXES = [
  [
    "A Of all mankind's manifold creations, language must take pride of place. Other \n\nA Of all mankind's manifold creations, language must take pride of place. Other inventions -\n\nthe wheel",
    "A Of all mankind's manifold creations, language must take pride of place. Other inventions -\n\nthe wheel"
  ],
  [
    'unravelling the fundamental order of the universe. O The most extraordinary thing about language',
    'unravelling the fundamental order of the universe.\n\nD The most extraordinary thing about language'
  ],
  [
    'Language conceals art. 1rLanguagc-\n\nF\n\nOften, it is only',
    'Language conceals art.\n\nF Often, it is only'
  ]
]

let changed = false
const nextExams = exams.map((exam) => {
  if (exam.id !== 'cambridge-11-test4-passage3') return exam
  let text = exam.rawPassageText
  for (const [before, after] of FIXES) {
    const count = text.split(before).length - 1
    console.log(`  "${before.slice(0, 40)}…" — ${count} occurrence(s)`)
    if (count !== 1) throw new Error(`Expected exactly 1 occurrence, got ${count}`)
    text = text.split(before).join(after)
  }
  changed = true
  return { ...exam, rawPassageText: text, updatedAt: new Date().toISOString() }
})

if (!changed) {
  console.log('Exam not found — no changes made.')
  process.exit(1)
}

fs.writeFileSync(modulePath, `export const ${exportName} = ${JSON.stringify(nextExams, null, 2)}\n`, 'utf8')
console.log('Fixed cambridge-11-test4-passage3 rawPassageText.')
