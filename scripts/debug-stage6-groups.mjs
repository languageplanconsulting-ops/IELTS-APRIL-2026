#!/usr/bin/env node
import { buildJourneyStageDefinitions, buildJourneyExamRecords } from '../src/readingJourney.ts'
import { buildReadingFillQuestionGroups } from '../src/readingFillDisplay.ts'
const noop = () => false
const books = [11,12,13,14,15,16,17,19]
const pool = []
for (const b of books) {
  const m = await import(`../server/userProvidedReadingPracticeCambridge${b}.mjs`)
  const k = Object.keys(m).find(x => x.includes('EXAMS'))
  pool.push(...m[k].filter(e => e.category === 'normal'))
}
const exams = buildJourneyExamRecords(pool, 30)
for (let s = 5; s <= 10; s++) {
  const exam = exams.find(e => e.id === `journey-normal-stage-${s}`)
  if (!exam) continue
  for (const p of exam.parsedPayload.passages) {
    const groups = buildReadingFillQuestionGroups(p, p.questions, noop, exam.id)
    for (const g of groups) {
      console.log(`stage-${s} P${p.number} group ${g.start}-${g.end} | title: ${p.title.slice(0,50)}`)
    }
  }
}
