/**
 * Audit all advanced (Passage 3) reading exams.
 * Run: node scripts/audit-advanced-reading.mjs
 */
import { buildReadingExamPayload } from '../server/readingImportUtils.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_11_EXAMS } from '../server/userProvidedReadingPracticeCambridge11.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_12_EXAMS } from '../server/userProvidedReadingPracticeCambridge12.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_13_EXAMS } from '../server/userProvidedReadingPracticeCambridge13.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_14_EXAMS } from '../server/userProvidedReadingPracticeCambridge14.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_15_EXAMS } from '../server/userProvidedReadingPracticeCambridge15.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_16_EXAMS } from '../server/userProvidedReadingPracticeCambridge16.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_17_EXAMS } from '../server/userProvidedReadingPracticeCambridge17.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_19_EXAMS } from '../server/userProvidedReadingPracticeCambridge19.mjs'

const ADVANCED_EXAMS = [
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_11_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_12_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_13_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_14_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_15_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_16_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_17_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_19_EXAMS
].filter((exam) => exam.category === 'advanced')

const GARBAGE =
  /drop heading here|drop answer here|<input|<form\b|<div\b|<span\b|drag and drop an option|hidden"\s*form=/i

const failures = []

for (const exam of ADVANCED_EXAMS) {
  if (exam.category !== 'advanced') {
    failures.push({ id: exam.id, kind: 'wrong_category', category: exam.category })
    continue
  }

  let runtime
  try {
    runtime = buildReadingExamPayload(exam)
  } catch (error) {
    failures.push({ id: exam.id, kind: 'parse_error', detail: error.message })
    continue
  }

  const passage = runtime.passages?.[0]
  if (!passage) {
    failures.push({ id: exam.id, kind: 'missing_passage' })
    continue
  }

  const paragraphs = passage.bodyParagraphs || []
  const totalLength = paragraphs.reduce((sum, paragraph) => sum + paragraph.length, 0)
  const questions = passage.questions || []
  const numbers = questions.map((question) => question.number).sort((a, b) => a - b)

  if (paragraphs.length < 3) {
    failures.push({ id: exam.id, kind: 'too_few_paragraphs', count: paragraphs.length })
  }
  if (totalLength < 3000) {
    failures.push({ id: exam.id, kind: 'passage_too_short', totalLength })
  }
  if (questions.length !== 14) {
    failures.push({ id: exam.id, kind: 'question_count', count: questions.length })
  }
  if (numbers[0] !== 27 || numbers[numbers.length - 1] !== 40) {
    failures.push({ id: exam.id, kind: 'question_range', range: `${numbers[0]}-${numbers[numbers.length - 1]}` })
  }

  for (const paragraph of paragraphs) {
    if (GARBAGE.test(paragraph)) {
      failures.push({ id: exam.id, kind: 'passage_garbage', sample: paragraph.slice(0, 100) })
    }
  }

  for (const question of questions) {
    const prompt = String(question.prompt || '').trim()
    if (!prompt) failures.push({ id: exam.id, kind: 'empty_prompt', question: question.number })
    if (GARBAGE.test(prompt)) {
      failures.push({ id: exam.id, kind: 'prompt_garbage', question: question.number, prompt: prompt.slice(0, 100) })
    }
    if (!String(question.correctAnswer || '').trim()) {
      failures.push({ id: exam.id, kind: 'missing_answer', question: question.number })
    }
    if (
      ['true-false-not-given', 'yes-no-not-given'].includes(question.answerType) &&
      /\bwriter\b/i.test(prompt)
    ) {
      failures.push({ id: exam.id, kind: 'writer_framing', question: question.number })
    }
  }

  const storedPassage = exam.parsedPayload?.passages?.[0]
  if (storedPassage) {
    for (const paragraph of storedPassage.bodyParagraphs || []) {
      if (GARBAGE.test(paragraph)) {
        failures.push({ id: exam.id, kind: 'stored_passage_garbage', sample: paragraph.slice(0, 100) })
      }
    }
    for (const question of storedPassage.questions || []) {
      if (GARBAGE.test(question.prompt || '')) {
        failures.push({ id: exam.id, kind: 'stored_prompt_garbage', question: question.number })
      }
    }
    if ((storedPassage.bodyParagraphs || []).length < 3) {
      failures.push({
        id: exam.id,
        kind: 'stored_too_few_paragraphs',
        count: storedPassage.bodyParagraphs.length
      })
    }
  }
}

if (failures.length) {
  console.error(`Advanced reading audit failed: ${failures.length} issue(s) across ${ADVANCED_EXAMS.length} exams.`)
  for (const failure of failures) {
    console.error(`- [${failure.kind}] ${failure.id}${failure.question ? ` Q${failure.question}` : ''}`)
    if (failure.detail) console.error(`  ${failure.detail}`)
    if (failure.sample) console.error(`  ${JSON.stringify(failure.sample)}`)
    if (failure.prompt) console.error(`  ${JSON.stringify(failure.prompt)}`)
    if (failure.count !== undefined) console.error(`  count: ${failure.count}`)
    if (failure.totalLength !== undefined) console.error(`  length: ${failure.totalLength}`)
    if (failure.range) console.error(`  range: ${failure.range}`)
  }
  process.exit(1)
}

console.log(
  `Advanced reading audit passed: ${ADVANCED_EXAMS.length} Passage 3 exams — 14 questions each (Q27–40), clean bodies, readable paragraphs.`
)
