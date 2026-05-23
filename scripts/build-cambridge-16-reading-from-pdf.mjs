/**
 * Rebuild Cambridge 16 reading exams from official PDF OCR extracts + existing answer keys.
 *
 * 1. python3 scripts/extract-cambridge-16-from-pdf.py "/path/to/IELTS-16-Academic-Students-Book-with-Answers-Cambridge.pdf"
 * 2. node scripts/build-cambridge-16-reading-from-pdf.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const passDir = path.join(__dirname, 'cambridge-16-passages')
const quesDir = path.join(__dirname, 'cambridge-16-questions')
const outputPath = path.join(root, 'server/userProvidedReadingPracticeCambridge16.mjs')
const importJsonPath = path.join(root, 'cambridge-reading-imports/cambridge-16-reading-import.json')

const EXAM_MAP = [
  { id: 'cambridge-16-test1-passage1', key: 't1p1', test: 1, passage: 1 },
  { id: 'cambridge-16-test1-passage2', key: 't1p2', test: 1, passage: 2 },
  { id: 'cambridge-16-test1-passage3', key: 't1p3', test: 1, passage: 3 },
  { id: 'cambridge-16-test2-passage1', key: 't2p1', test: 2, passage: 1 },
  { id: 'cambridge-16-test2-passage2', key: 't2p2', test: 2, passage: 2 },
  { id: 'cambridge-16-test2-passage3', key: 't2p3', test: 2, passage: 3 },
  { id: 'cambridge-16-test3-passage1', key: 't3p1', test: 3, passage: 1 },
  { id: 'cambridge-16-test3-passage2', key: 't3p2', test: 3, passage: 2 },
  { id: 'cambridge-16-test3-passage3', key: 't3p3', test: 3, passage: 3 },
  { id: 'cambridge-16-test4-passage1', key: 't4p1', test: 4, passage: 1 },
  { id: 'cambridge-16-test4-passage2', key: 't4p2', test: 4, passage: 2 },
  { id: 'cambridge-16-test4-passage3', key: 't4p3', test: 4, passage: 3 }
]

const readText = (dir, key) => fs.readFileSync(path.join(dir, `${key}.txt`), 'utf8').trim()

const buildRawPassageText = (passageNum, passText, quesText) => {
  const [titleLine, ...bodyLines] = passText.split('\n')
  const title = titleLine.trim()
  const body = bodyLines.join('\n').trim()
  return `READING PASSAGE ${passageNum}\n${title}\n\n${body}\n\n${quesText}`
}

const { buildReadingExamPayload } = await import(
  pathToFileURL(path.join(root, 'server/readingImportUtils.mjs')).href
)

const { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_16_EXAMS: existingExams } = await import(
  pathToFileURL(outputPath).href
)

const existingById = new Map(existingExams.map((exam) => [exam.id, exam]))

const exams = EXAM_MAP.map(({ id, key, test, passage }) => {
  const existing = existingById.get(id)
  if (!existing) throw new Error(`Missing existing exam: ${id}`)

  const passText = readText(passDir, key)
  const quesText = readText(quesDir, key)
  const rawPassageText = buildRawPassageText(passage, passText, quesText)
  const title = `Cambridge 16 Test ${test} Passage ${passage} - ${passText.split('\n')[0].trim().replace(/^['"]|['"]$/g, '')}`

  const exam = {
    id,
    title,
    category: existing.category || (passage === 3 ? 'advanced' : 'normal'),
    rawPassageText,
    rawAnswerKey: existing.rawAnswerKey
  }

  let parsedPayload
  try {
    parsedPayload = buildReadingExamPayload(exam)
  } catch (error) {
    console.error(`Failed to parse ${id}:`, error.message)
    throw error
  }

  return {
    ...exam,
    parsedPayload,
    createdAt: existing.createdAt || '2026-05-15T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  }
})

fs.writeFileSync(importJsonPath, `${JSON.stringify(exams, null, 2)}\n`, 'utf8')

const fileBody = `export const USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_16_EXAMS = ${JSON.stringify(exams, null, 2)}
`
fs.writeFileSync(outputPath, fileBody, 'utf8')

const junkPattern = /drop heading here|drop answer here|<form\b/i
let junkCount = 0
for (const exam of exams) {
  for (const passage of exam.parsedPayload?.passages || []) {
    if (junkPattern.test(passage.questionSectionText || '')) junkCount += 1
    if (passage.questions?.some((q) => junkPattern.test(q.prompt || ''))) junkCount += 1
  }
}

const qTotal = exams.reduce(
  (sum, exam) => sum + (exam.parsedPayload?.passages?.[0]?.questions?.length || 0),
  0
)
console.log(`Wrote ${exams.length} Cambridge 16 reading exams (${qTotal} questions)`)
console.log(`Import JSON: ${importJsonPath}`)
console.log(`Module: ${outputPath}`)
console.log(junkCount ? `WARNING: ${junkCount} junk entries remain` : 'No drag-drop junk detected in rebuilt payloads')
