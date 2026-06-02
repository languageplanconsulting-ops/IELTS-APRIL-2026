#!/usr/bin/env node
/**
 * Verify fill-in-the-blank display for Normal Reading and Reading Journey exams.
 * Fails when any fill question is missing from display lines or has no context text.
 *
 * Run: node scripts/verify-reading-fill-display.mjs
 */

import {
  buildReadingFillQuestionGroups,
  isReadingLetterSummaryFill
} from '../src/readingFillDisplay.ts'
import {
  buildJourneyExamRecords,
  mergeExamsIntoJourneyExam,
  remapReadingQuestionNumbersInSectionText
} from '../src/readingJourney.ts'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_11_EXAMS } from '../server/userProvidedReadingPracticeCambridge11.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_12_EXAMS } from '../server/userProvidedReadingPracticeCambridge12.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_13_EXAMS } from '../server/userProvidedReadingPracticeCambridge13.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_14_EXAMS } from '../server/userProvidedReadingPracticeCambridge14.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_15_EXAMS } from '../server/userProvidedReadingPracticeCambridge15.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_16_EXAMS } from '../server/userProvidedReadingPracticeCambridge16.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_17_EXAMS } from '../server/userProvidedReadingPracticeCambridge17.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_19_EXAMS } from '../server/userProvidedReadingPracticeCambridge19.mjs'
import { USER_PROVIDED_READING_PRACTICE_JUNE_2026_EXAMS } from '../server/userProvidedReadingPracticeJune2026.mjs'

const noopMatching = () => false

const EXAM_POOL = [
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_11_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_12_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_13_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_14_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_15_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_16_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_17_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_19_EXAMS,
  ...USER_PROVIDED_READING_PRACTICE_JUNE_2026_EXAMS
]

const failures = []

const auditPassage = (label, passage, examId) => {
  const groups = buildReadingFillQuestionGroups(passage, passage.questions || [], noopMatching, examId)
  for (const group of groups) {
    const covered = new Set()
    const noContext = []
    const block = group.instruction

    for (const line of group.displayLines) {
      const hasTableContext = Boolean(line.procedure || line.procedureSegments?.length)
      for (const segment of [...line.segments, ...(line.procedureSegments || [])]) {
        if (segment.kind !== 'blank') continue
        covered.add(segment.questionNumber)
        const question = group.questions.find((item) => item.number === segment.questionNumber)
        const isLetterSummary = question ? isReadingLetterSummaryFill(block, question) : false
        if (
          !hasTableContext &&
          !isLetterSummary &&
          !String(segment.before || '').trim() &&
          !String(segment.after || '').trim()
        ) {
          noContext.push(segment.questionNumber)
        }
      }
    }

    for (const question of group.questions) {
      if (!covered.has(question.number)) {
        failures.push(`${label} | missing blank Q${question.number}`)
      }
    }

    if (process.env.READING_FILL_VERIFY_STRICT === '1') {
      for (const questionNumber of noContext) {
        failures.push(`${label} | Q${questionNumber} has no surrounding text`)
      }
    }
  }
}

for (const exam of EXAM_POOL) {
  for (const passage of exam.parsedPayload?.passages || []) {
    auditPassage(`${exam.title} · passage ${passage.number}`, passage, exam.id)
  }
}

const journeyExams = buildJourneyExamRecords(EXAM_POOL, 30)
for (const exam of journeyExams) {
  for (const passage of exam.parsedPayload?.passages || []) {
    auditPassage(`${exam.title} · passage ${passage.number}`, passage, exam.id)
  }
}

// Spot-check journey remapping preserves dates in section text.
const deadSea = USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_17_EXAMS.find(
  (exam) => exam.id === 'cambridge-17-test2-passage1'
)
if (deadSea) {
  const remappedText = remapReadingQuestionNumbersInSectionText(
    deadSea.parsedPayload.passages[0].questionSectionText,
    13
  )
  if (remappedText.includes('1946/20') || remappedText.includes('83 CE')) {
    failures.push('Dead Sea remapping corrupted dates in question section text')
  }

  const passage = deadSea.parsedPayload.passages[0]
  const offset = 13
  const remappedPassage = {
    ...passage,
    number: 2,
    questionSectionText: remappedText,
    questionRanges: passage.questionRanges.map((range) => ({
      start: range.start + offset,
      end: range.end + offset
    })),
    questions: passage.questions.map((question) => ({
      ...question,
      number: question.number + offset,
      prompt:
        question.number === 3
          ? 'and found a number of containers made of …'
          : question.prompt
    }))
  }
  auditPassage('Dead Sea Scrolls remapped slot-2 spot check', remappedPassage, 'journey-spot-check')
}

if (failures.length) {
  console.error(`Reading fill display verification failed (${failures.length} issues):`)
  for (const failure of failures.slice(0, 80)) {
    console.error(`- ${failure}`)
  }
  if (failures.length > 80) {
    console.error(`… and ${failures.length - 80} more`)
  }
  process.exit(1)
}

console.log(
  `Reading fill display verification passed: ${EXAM_POOL.length} bank exams + ${journeyExams.length} journey stages checked.`
)
