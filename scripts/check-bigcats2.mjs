#!/usr/bin/env node
import { buildJourneyExamRecords, buildJourneyStageDefinitions, orderJourneySourceExams } from '../src/readingJourney.ts'
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
const ex2 = exams.find(e => e.id === 'journey-normal-stage-2')
const p3 = ex2.parsedPayload.passages[2]
console.log('Stage 2 P3 title:', p3.title)
console.log('questionRanges:', p3.questionRanges)
const groups = buildReadingFillQuestionGroups(p3, p3.questions, noop, ex2.id)
console.log('fill groups:', groups.map(g => `${g.start}-${g.end}`))
const fillGroup = groups.find(g => g.start === 32)
if (fillGroup) {
  console.log('\nQ32-35 questions:')
  for (const q of fillGroup.questions) {
    console.log(`  Q${q.number} [${q.answerType}] "${q.correctAnswer}" | exact: ${q.exactPortion?.slice(0,100)}`)
  }
}
// also check source exam
const defs = buildJourneyStageDefinitions(pool, 30)
const def2 = defs[1]
const srcs = def2.sourceExamIds.map(id => pool.find(e => e.id === id))
const ordered = orderJourneySourceExams(srcs)
console.log('\nStage 2 sources:', ordered.map(s => s.id))
