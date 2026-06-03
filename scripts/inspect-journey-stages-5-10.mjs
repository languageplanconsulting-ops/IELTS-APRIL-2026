#!/usr/bin/env node
import { buildJourneyExamRecords } from '../src/readingJourney.ts'
import { buildReadingFillQuestionGroups } from '../src/readingFillDisplay.ts'
import { findNewFillBlankSet } from '../src/readingNewFillBlankQuestions.ts'

const books = [11, 12, 13, 14, 15, 16, 17, 19]
const pool = []
for (const book of books) {
  const mod = await import(`../server/userProvidedReadingPracticeCambridge${book}.mjs`)
  const key = Object.keys(mod).find((name) => name.includes('EXAMS'))
  pool.push(...mod[key].filter((exam) => exam.category === 'normal'))
}

const exams = buildJourneyExamRecords(pool, 12)
const noop = () => false

for (let stage = 5; stage <= 10; stage += 1) {
  const exam = exams.find((item) => item.id === `journey-normal-stage-${stage}`)
  console.log(`\n=== Stage ${stage} intensive=${stage <= 10} ===`)
  for (const passage of exam?.parsedPayload?.passages || []) {
    console.log(`  ${passage.title}`)
    const groups = buildReadingFillQuestionGroups(passage, passage.questions, noop, exam.id)
    for (const group of groups) {
      const fillQuestions = group.questions.filter((q) => q.answerType === 'text')
      if (!fillQuestions.length) continue
      const status = findNewFillBlankSet(exam.id, group.start) ? 'NEW' : 'legacy'
      console.log(`    P${passage.number} Q${group.start}-${group.end} (${fillQuestions.length} fill) ${status}`)
    }
  }
}
