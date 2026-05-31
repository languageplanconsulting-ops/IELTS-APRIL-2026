/**
 * End-to-end reading health check: passages, question assignment, and report fields.
 * Run: node scripts/audit-reading-health.mjs
 */
import { buildReadingExamPayload, isValidReadingParsedPayload } from '../server/readingImportUtils.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_11_EXAMS } from '../server/userProvidedReadingPracticeCambridge11.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_12_EXAMS } from '../server/userProvidedReadingPracticeCambridge12.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_13_EXAMS } from '../server/userProvidedReadingPracticeCambridge13.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_14_EXAMS } from '../server/userProvidedReadingPracticeCambridge14.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_15_EXAMS } from '../server/userProvidedReadingPracticeCambridge15.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_16_EXAMS } from '../server/userProvidedReadingPracticeCambridge16.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_17_EXAMS } from '../server/userProvidedReadingPracticeCambridge17.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_19_EXAMS } from '../server/userProvidedReadingPracticeCambridge19.mjs'
import { USER_PROVIDED_READING_PRACTICE_JUNE_2026_EXAMS } from '../server/userProvidedReadingPracticeJune2026.mjs'

const EXAM_SOURCES = [
  ['Cambridge 11', USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_11_EXAMS],
  ['Cambridge 12', USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_12_EXAMS],
  ['Cambridge 13', USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_13_EXAMS],
  ['Cambridge 14', USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_14_EXAMS],
  ['Cambridge 15', USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_15_EXAMS],
  ['Cambridge 16', USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_16_EXAMS],
  ['Cambridge 17', USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_17_EXAMS],
  ['Cambridge 19', USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_19_EXAMS],
  ['June 2026', USER_PROVIDED_READING_PRACTICE_JUNE_2026_EXAMS]
]

const failures = []

const auditExam = (book, exam) => {
  let payload
  try {
    payload = buildReadingExamPayload({
      ...exam,
      parsedPayload: exam.parsedPayload || exam.parsed_payload
    })
  } catch (error) {
    failures.push({ book, id: exam.id, kind: 'build_error', detail: error.message })
    return
  }

  if (!isValidReadingParsedPayload(payload)) {
    failures.push({ book, id: exam.id, kind: 'invalid_payload' })
    return
  }

  for (const passage of payload.passages || []) {
    const bodyLength = (passage.bodyParagraphs || []).reduce(
      (sum, paragraph) => sum + String(paragraph || '').length,
      0
    )
    const questions = passage.questions || []
    if (!passage.bodyParagraphs?.length || bodyLength < 500) {
      failures.push({
        book,
        id: exam.id,
        kind: 'empty_passage',
        passage: passage.number,
        bodyLength
      })
    }
    if (!questions.length) {
      failures.push({
        book,
        id: exam.id,
        kind: 'no_questions',
        passage: passage.number
      })
    }
    for (const question of questions) {
      if (!String(question.prompt || '').trim()) {
        failures.push({
          book,
          id: exam.id,
          kind: 'empty_prompt',
          passage: passage.number,
          question: question.number
        })
      }
      if (!String(question.correctAnswer || '').trim()) {
        failures.push({
          book,
          id: exam.id,
          kind: 'empty_answer',
          passage: passage.number,
          question: question.number
        })
      }
    }
  }
}

let examCount = 0
for (const [book, exams] of EXAM_SOURCES) {
  for (const exam of exams) {
    examCount += 1
    auditExam(book, exam)
  }
}

if (failures.length) {
  console.error(`Reading health audit failed: ${failures.length} issue(s) across ${examCount} exams.`)
  for (const failure of failures.slice(0, 40)) {
    console.error(
      `- [${failure.kind}] ${failure.book} | ${failure.id}${failure.passage ? ` P${failure.passage}` : ''}${failure.question ? ` Q${failure.question}` : ''}${failure.detail ? ` — ${failure.detail}` : ''}`
    )
  }
  if (failures.length > 40) console.error(`… and ${failures.length - 40} more`)
  process.exit(1)
}

console.log(`Reading health audit passed: ${examCount} exams — passages, questions, and report fields OK.`)
