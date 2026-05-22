/**
 * Verify full reading test catalog: 8 books × 4 tests × 40 questions = 32 exams.
 * Also validates report scoring produces 40 items with 13+13+14 passage breakdown.
 * Run: npx tsx scripts/verify-reading-full-tests.mjs
 */
import {
  FULL_READING_TESTS_PER_BOOK,
  READING_FULL_TEST_BOOKS,
  READING_FULL_TEST_SPECS,
  TOTAL_FULL_READING_TESTS,
  buildReadingFullTestExam,
  groupFullReadingTestsByBook,
  validateFullReadingTestCatalog
} from '../src/readingFullTestData.ts'
import { buildReadingExamPayload } from '../server/readingImportUtils.mjs'
import { isWeakReadingExplanation } from './reading-explanation-criteria.mjs'

import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_11_EXAMS } from '../server/userProvidedReadingPracticeCambridge11.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_12_EXAMS } from '../server/userProvidedReadingPracticeCambridge12.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_13_EXAMS } from '../server/userProvidedReadingPracticeCambridge13.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_14_EXAMS } from '../server/userProvidedReadingPracticeCambridge14.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_15_EXAMS } from '../server/userProvidedReadingPracticeCambridge15.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_16_EXAMS } from '../server/userProvidedReadingPracticeCambridge16.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_17_EXAMS } from '../server/userProvidedReadingPracticeCambridge17.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_19_EXAMS } from '../server/userProvidedReadingPracticeCambridge19.mjs'

const bankReadingExams = [
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_11_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_12_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_13_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_14_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_15_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_16_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_17_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_19_EXAMS
]

const { ok, errors } = validateFullReadingTestCatalog(bankReadingExams)

const normalizeReadingAnswer = (value) => String(value || '').trim().toLowerCase().replace(/\s+/g, ' ')
const canonicalizeReadingCorrectAnswer = (value) => {
  const match = String(value || '').trim().match(/^([A-G])\s*[\).:-]/i)
  if (match) return match[1].toUpperCase()
  const letterMatch = String(value || '').trim().match(/^([A-G])\b/i)
  if (letterMatch) return letterMatch[1].toUpperCase()
  return String(value || '').trim()
}
const normalizeReadingScoredAnswer = (value) => {
  const canonical = canonicalizeReadingCorrectAnswer(value)
  return canonical ? normalizeReadingAnswer(canonical) : normalizeReadingAnswer(value)
}
const isReadingAnswerCorrect = (userAnswer, correctAnswer, acceptedAnswers) => {
  const normalizedUserAnswer = normalizeReadingScoredAnswer(userAnswer)
  if (!normalizedUserAnswer) return false
  const answerPool = acceptedAnswers?.length ? acceptedAnswers : [correctAnswer]
  return answerPool.some((answer) => normalizeReadingScoredAnswer(answer) === normalizedUserAnswer)
}
const shouldUseReadingSharedAnswerPool = (questions) => {
  if (!questions.length) return false
  const acceptedAnswers = questions[0]?.acceptedAnswers?.length
    ? [...questions[0].acceptedAnswers]
    : questions.map((question) => question.correctAnswer)
  const firstKey = [...acceptedAnswers].map((answer) => normalizeReadingScoredAnswer(answer)).sort().join('\u0001')
  return acceptedAnswers.length > 1 && questions.every((question) => {
    const pool = question.acceptedAnswers?.length ? question.acceptedAnswers : [question.correctAnswer]
    return pool.length > 1 && [...pool].map((answer) => normalizeReadingScoredAnswer(answer)).sort().join('\u0001') === firstKey
  })
}
const scoreReadingQuestions = (questions, answers) => {
  const groupedQuestionNumbers = new Set()
  const groupedResults = new Map()
  const groupedQuestions = new Map()
  for (const question of questions) {
    if (!question.answerGroup) continue
    groupedQuestionNumbers.add(question.number)
    const key = String(question.answerGroup)
    groupedQuestions.set(key, [...(groupedQuestions.get(key) || []), question])
  }
  for (const groupQuestions of groupedQuestions.values()) {
    const orderedQuestions = [...groupQuestions].sort((first, second) => first.number - second.number)
    if (!shouldUseReadingSharedAnswerPool(orderedQuestions)) {
      for (const question of orderedQuestions) {
        groupedResults.set(
          question.number,
          isReadingAnswerCorrect(String(answers[question.number] || ''), question.correctAnswer, question.acceptedAnswers)
        )
      }
      continue
    }
    const acceptedAnswers = orderedQuestions[0]?.acceptedAnswers?.length
      ? [...orderedQuestions[0].acceptedAnswers]
      : orderedQuestions.map((question) => question.correctAnswer)
    const remainingAnswers = acceptedAnswers.map((answer) => normalizeReadingScoredAnswer(answer))
    for (const question of orderedQuestions) {
      const normalizedUserAnswer = normalizeReadingScoredAnswer(String(answers[question.number] || ''))
      const matchedIndex = normalizedUserAnswer ? remainingAnswers.indexOf(normalizedUserAnswer) : -1
      if (matchedIndex >= 0) {
        groupedResults.set(question.number, true)
        remainingAnswers.splice(matchedIndex, 1)
      } else {
        groupedResults.set(question.number, false)
      }
    }
  }
  return questions.map((question) => {
    const userAnswer = String(answers[question.number] || '').trim()
    return {
      ...question,
      userAnswer,
      isCorrect: groupedQuestionNumbers.has(question.number)
        ? Boolean(groupedResults.get(question.number))
        : isReadingAnswerCorrect(userAnswer, question.correctAnswer, question.acceptedAnswers)
    }
  })
}

const reportErrors = []
for (const spec of READING_FULL_TEST_SPECS) {
  const exam = buildReadingFullTestExam(spec, bankReadingExams)
  if (!exam) continue
  const passages = exam.parsedPayload.passages || []
  const allQuestions = passages.flatMap((passage) => passage.questions || [])
  const blankReport = scoreReadingQuestions(allQuestions, {})
  if (blankReport.length !== 40) {
    reportErrors.push(`${spec.id}: report has ${blankReport.length} items (expected 40)`)
    continue
  }
  const breakdown = passages.map((passage) =>
    blankReport.filter((item) => passage.questions.some((question) => question.number === item.number)).length
  )
  if (breakdown.join('+') !== '13+13+14') {
    reportErrors.push(`${spec.id}: passage breakdown ${breakdown.join('+')} (expected 13+13+14)`)
  }
}

const explanationErrors = []
for (const book of READING_FULL_TEST_BOOKS) {
  const mod = await import(`../server/userProvidedReadingPracticeCambridge${book}.mjs`)
  const exams = mod[`USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_${book}_EXAMS`]
  for (const exam of exams) {
    const parsed = buildReadingExamPayload(exam)
    for (const passage of parsed.passages || []) {
      for (const question of passage.questions || []) {
        const reason = isWeakReadingExplanation(question)
        if (reason) explanationErrors.push(`${exam.id} Q${question.number}: ${reason}`)
      }
    }
  }
}

console.log(
  `Full reading tests: ${READING_FULL_TEST_BOOKS.length} books × ${FULL_READING_TESTS_PER_BOOK} tests = ${TOTAL_FULL_READING_TESTS} exams`
)

for (const { book, tests } of groupFullReadingTestsByBook()) {
  console.log(`  Cambridge ${book}: Tests ${tests.map((spec) => spec.testNumber).join(', ')} (${tests.length}/${FULL_READING_TESTS_PER_BOOK})`)
}

if (!ok) {
  console.error(`Catalog validation failed (${errors.length} issue(s)):`)
  for (const error of errors) console.error(`  - ${error}`)
  process.exit(1)
}

if (reportErrors.length) {
  console.error(`Report validation failed (${reportErrors.length} issue(s)):`)
  for (const error of reportErrors.slice(0, 20)) console.error(`  - ${error}`)
  process.exit(1)
}

if (explanationErrors.length) {
  console.error(`Explanation validation failed (${explanationErrors.length} issue(s)):`)
  for (const error of explanationErrors.slice(0, 20)) console.error(`  - ${error}`)
  process.exit(1)
}

console.log(`All ${TOTAL_FULL_READING_TESTS} full reading tests are complete (40 questions each).`)
console.log('All full-test reports score 40 items with 13+13+14 passage breakdown.')
console.log('All Thai explanations follow the paraphrase-bridge format.')
