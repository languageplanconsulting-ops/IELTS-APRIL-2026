/**
 * Audit all Cambridge reading exams for corrupt passage bodies and drag-drop UI junk.
 * Run: node scripts/audit-reading-passage-bodies.mjs
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

const PASSAGE_GARBAGE_PATTERN =
  /drop heading here|drop answer here|<input|<form\b|<div\b|<span\b|form="hidden|hidden"\s*form=|drag and drop an option/i

const PROMPT_GARBAGE_PATTERN =
  /drop heading here|drop answer here|<input|<form\b|<div\b|drag and drop an option/i

const auditPassages = (passages, book, exam, source) => {
  for (const passage of passages || []) {
    passageCount += 1
    const paragraphs = passage.bodyParagraphs || []
    const totalLength = paragraphs.reduce((sum, paragraph) => sum + paragraph.length, 0)
    const garbageParagraphs = paragraphs.filter((paragraph) => PASSAGE_GARBAGE_PATTERN.test(paragraph))

    if (!paragraphs.length || totalLength < 500 || garbageParagraphs.length) {
      failures.push({
        book,
        id: exam.id,
        title: exam.title,
        source,
        kind: !paragraphs.length ? 'empty_passage' : totalLength < 500 ? 'passage_too_short' : 'passage_garbage',
        passage: passage.number,
        passageTitle: passage.title,
        paragraphs: paragraphs.length,
        totalLength,
        sample: paragraphs[0]?.slice(0, 120) || ''
      })
    }

    for (const question of passage.questions || []) {
      questionCount += 1
      const prompt = String(question.prompt || '').trim()
      if (!prompt) {
        failures.push({
          book,
          id: exam.id,
          title: exam.title,
          source,
          kind: 'empty_prompt',
          passage: passage.number,
          question: question.number
        })
        continue
      }
      if (PROMPT_GARBAGE_PATTERN.test(prompt)) {
        failures.push({
          book,
          id: exam.id,
          title: exam.title,
          source,
          kind: 'prompt_garbage',
          passage: passage.number,
          question: question.number,
          prompt: prompt.slice(0, 120)
        })
      }
    }
  }
}

const failures = []
let examCount = 0
let passageCount = 0
let questionCount = 0

for (const [book, exams] of EXAM_SOURCES) {
  for (const exam of exams) {
    examCount += 1
    let payload
    try {
      payload = buildReadingExamPayload({
        ...exam,
        parsedPayload: exam.parsedPayload || exam.parsed_payload
      })
    } catch (error) {
      failures.push({
        book,
        id: exam.id,
        title: exam.title,
        source: 'runtime',
        kind: 'parse_error',
        detail: error.message
      })
      continue
    }

    if (!isValidReadingParsedPayload(payload)) {
      failures.push({
        book,
        id: exam.id,
        title: exam.title,
        source: 'runtime',
        kind: 'invalid_payload'
      })
      continue
    }

    auditPassages(payload.passages, book, exam, 'runtime')
  }
}

if (failures.length) {
  console.error(`Reading passage audit failed: ${failures.length} issue(s) across ${examCount} exams.`)
  for (const failure of failures) {
    console.error(`- [${failure.kind}] ${failure.source || 'unknown'} | ${failure.book} | ${failure.id}${failure.question ? ` Q${failure.question}` : ''}${failure.passage ? ` P${failure.passage}` : ''}`)
    if (failure.detail) console.error(`  ${failure.detail}`)
    if (failure.sample) console.error(`  sample: ${JSON.stringify(failure.sample)}`)
    if (failure.prompt) console.error(`  prompt: ${JSON.stringify(failure.prompt)}`)
  }
  process.exit(1)
}

console.log(
  `Reading passage audit passed: ${examCount} exams, ${passageCount} passages, ${questionCount} questions — no corrupt bodies or drag-drop junk.`
)
