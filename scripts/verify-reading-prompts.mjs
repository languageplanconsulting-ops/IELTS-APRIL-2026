import { buildReadingExamPayload } from '../server/readingImportUtils.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_11_EXAMS } from '../server/userProvidedReadingPracticeCambridge11.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_12_EXAMS } from '../server/userProvidedReadingPracticeCambridge12.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_13_EXAMS } from '../server/userProvidedReadingPracticeCambridge13.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_14_EXAMS } from '../server/userProvidedReadingPracticeCambridge14.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_15_EXAMS } from '../server/userProvidedReadingPracticeCambridge15.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_16_EXAMS } from '../server/userProvidedReadingPracticeCambridge16.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_17_EXAMS } from '../server/userProvidedReadingPracticeCambridge17.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_19_EXAMS } from '../server/userProvidedReadingPracticeCambridge19.mjs'
import { USER_PROVIDED_READING_PRACTICE_JUNE_2026_EXAMS } from '../server/userProvidedReadingPracticeJune2026.mjs'
import { USER_PROVIDED_READING_PRACTICE_GENERAL_TRAINING_EXAMS } from '../server/userProvidedReadingPracticeGeneralTraining.mjs'
import { USER_PROVIDED_READING_PRACTICE_CUSTOM_EXAMS } from '../server/userProvidedReadingPracticeCustom.mjs'

const EXAMS = [
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_11_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_12_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_13_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_14_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_15_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_16_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_17_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_19_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_JUNE_2026_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_GENERAL_TRAINING_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CUSTOM_EXAMS
]

const isBadPrompt = (question) => {
  const prompt = String(question.prompt || '').trim()
  if (!prompt) return 'empty prompt'
  if (/^Question\s+\d+$/i.test(prompt)) return 'generic Question X prompt'
  if (/drop heading here|drop answer here|<input|drag and drop an option/i.test(prompt)) {
    return 'drag-drop UI leaked into prompt'
  }
  if (/^(?:Correct Answer|Accepted Answers|Answer Group|Exact Portion|Short Thai Explanation|Paraphrased Vocabulary):/im.test(prompt)) {
    return 'answer-key metadata leaked into prompt'
  }
  if (
    ['true-false-not-given', 'yes-no-not-given'].includes(question.answerType) &&
    /\bwriter\b/i.test(prompt)
  ) {
    return 'writer framing in T/F/NG or Y/N/NG prompt'
  }
  return ''
}

const normalizeForOverlap = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()

/** Detects the "title leaked into bodyParagraphs[0]" import artefact (title duplicated as the paragraph's lead-in). */
const findTitleBodyOverlap = (title, body0) => {
  const titleWords = String(title || '').split(/\s+/).filter(Boolean)
  if (titleWords.length < 5) return 0 // short titles overlap body text coincidentally (e.g. "Cork", "polar bears")

  const bodyWordsNorm = normalizeForOverlap(body0).split(' ').filter(Boolean)
  const titleWordsNorm = normalizeForOverlap(title).split(' ').filter(Boolean)
  const maxN = Math.min(12, titleWordsNorm.length, bodyWordsNorm.length)
  for (let n = maxN; n >= 3; n -= 1) {
    const tail = titleWordsNorm.slice(-n).join(' ')
    const head = bodyWordsNorm.slice(0, n).join(' ')
    if (tail === head) return n
  }
  return 0
}

const failures = []
let textAnswerCount = 0
let totalQuestionCount = 0

for (const exam of EXAMS) {
  const parsedPayload = buildReadingExamPayload(exam)
  for (const passage of parsedPayload.passages || []) {
    const overlapN = findTitleBodyOverlap(passage.title, passage.bodyParagraphs?.[0])
    if (overlapN > 0) {
      failures.push({
        exam: exam.title,
        passage: passage.number,
        question: '-',
        answerType: '-',
        reason: `title duplicated into bodyParagraphs[0] (${overlapN}-word overlap)`,
        prompt: `title="${passage.title}" body0="${String(passage.bodyParagraphs[0]).slice(0, 80)}..."`
      })
    }
    for (const question of passage.questions || []) {
      totalQuestionCount += 1
      if (question.answerType === 'text') textAnswerCount += 1
      const reason = isBadPrompt(question)
      if (reason) {
        failures.push({
          exam: exam.title,
          passage: passage.number,
          question: question.number,
          answerType: question.answerType,
          reason,
          prompt: question.prompt
        })
      }
    }
  }
}

if (failures.length > 0) {
  console.error('Reading prompt verification failed:')
  for (const failure of failures) {
    console.error(
      `- ${failure.exam} | Passage ${failure.passage} | Q${failure.question} | ${failure.answerType} | ${failure.reason}: ${JSON.stringify(failure.prompt)}`
    )
  }
  process.exit(1)
}

console.log(
  `Reading prompt verification passed: ${totalQuestionCount} questions checked across ${EXAMS.length} exams, including ${textAnswerCount} text/fill answers.`
)
