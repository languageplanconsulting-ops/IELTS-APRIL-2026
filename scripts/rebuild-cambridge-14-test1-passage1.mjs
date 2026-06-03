/**
 * Rebuild Cambridge 14 Test 1 Passage 1 (Children's play) from clean passage + question extracts.
 *
 * Run: node scripts/rebuild-cambridge-14-test1-passage1.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { READING_QUESTION_SECTION_OVERRIDES } from './reading-question-section-overrides.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const outputPath = path.join(root, 'server/userProvidedReadingPracticeCambridge14.mjs')
const examId = 'cambridge-14-test1-passage1'

const passText = fs
  .readFileSync(path.join(__dirname, 'cambridge-14-passages/t1p1.txt'), 'utf8')
  .trim()
const quesText = fs
  .readFileSync(path.join(__dirname, 'cambridge-14-questions/t1p1.txt'), 'utf8')
  .trim()

const [titleLine] = passText.split('\n')
const title = titleLine.trim()
const body = passText.split('\n').slice(1).join('\n').trim()
const rawPassageText = `READING PASSAGE 1\n${title}\n\n${body}\n\n${quesText}`

const { buildReadingExamPayload } = await import(
  pathToFileURL(path.join(root, 'server/readingImportUtils.mjs')).href
)

const { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_14_EXAMS: exams } = await import(
  pathToFileURL(outputPath).href
)

const index = exams.findIndex((exam) => exam.id === examId)
if (index < 0) throw new Error(`Missing exam: ${examId}`)

const existing = exams[index]
const rebuilt = {
  id: examId,
  title: `Cambridge 14 Test 1 Passage 1 - ${title}`,
  category: existing.category || 'normal',
  rawPassageText,
  rawAnswerKey: existing.rawAnswerKey
}

let parsedPayload
try {
  parsedPayload = buildReadingExamPayload(rebuilt)
} catch (error) {
  console.error(`Failed to parse ${examId}:`, error.message)
  throw error
}

const sectionOverride = READING_QUESTION_SECTION_OVERRIDES[examId]
if (sectionOverride && parsedPayload?.passages?.[0]) {
  parsedPayload.passages[0].questionSectionText = sectionOverride
}

exams[index] = {
  ...rebuilt,
  parsedPayload,
  createdAt: existing.createdAt || '2026-05-22T00:00:00.000Z',
  updatedAt: new Date().toISOString()
}

fs.writeFileSync(
  outputPath,
  `export const USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_14_EXAMS = ${JSON.stringify(exams, null, 2)}\n`,
  'utf8'
)

const passage = parsedPayload.passages[0]
console.log(`Rebuilt ${examId}`)
console.log(`  title: ${passage.title}`)
console.log(`  paragraphs: ${passage.bodyParagraphs.length}`)
console.log(`  question section lines: ${passage.questionSectionText.split('\n').length}`)
