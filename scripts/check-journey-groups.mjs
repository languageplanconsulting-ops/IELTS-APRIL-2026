#!/usr/bin/env node
import { buildJourneyStageDefinitions, buildJourneyExamRecords } from '../src/readingJourney.ts'
import { buildReadingFillQuestionGroups } from '../src/readingFillDisplay.ts'
const noop = () => false

const books = [11, 12, 13, 14, 15, 16, 17, 19]
const pool = []
for (const book of books) {
  const mod = await import(`../server/userProvidedReadingPracticeCambridge${book}.mjs`)
  const key = Object.keys(mod).find((k) => k.includes('EXAMS'))
  pool.push(...mod[key].filter((e) => e.category === 'normal'))
}

const exams = buildJourneyExamRecords(pool, 30).slice(4, 10)
for (const exam of exams) {
  console.log(`\n=== ${exam.id} ===`)
  for (const passage of exam.parsedPayload.passages) {
    const groups = buildReadingFillQuestionGroups(passage, passage.questions, noop, exam.id)
    console.log(`P${passage.number} ranges:`, passage.questionRanges.map(r=>`${r.start}-${r.end}`).join(','), '| fill:', groups.map(g => `${g.start}-${g.end}(${g.questions.length}q)`).join(','))
  }
}
