#!/usr/bin/env node
import { buildJourneyStageDefinitions, buildJourneyExamRecords, orderJourneySourceExams, getJourneyPassageQuestionOffset } from '../src/readingJourney.ts'
import { buildReadingFillQuestionGroups } from '../src/readingFillDisplay.ts'
const noop = () => false
const books = [11,12,13,14,15,16,17,19]
const pool = []
for (const b of books) {
  const m = await import(`../server/userProvidedReadingPracticeCambridge${b}.mjs`)
  const k = Object.keys(m).find(x => x.includes('EXAMS'))
  pool.push(...m[k].filter(e => e.category === 'normal'))
}
const defs = buildJourneyStageDefinitions(pool, 30)
const def2 = defs[1] // stage 2
const exams = buildJourneyExamRecords(pool, 30)
const ex2 = exams.find(e => e.id === 'journey-normal-stage-2')

const srcs = def2.sourceExamIds.map(id => pool.find(e => e.id === id)).filter(Boolean)
const ordered = orderJourneySourceExams(srcs)
console.log('Stage 2 ordered sources:', ordered.map(s => s.id))

// P3 = index 2
const sourceExam = ordered[2]
const sourcePassage = sourceExam?.parsedPayload?.passages?.[0]
console.log('Source exam:', sourceExam?.id)
const offset = getJourneyPassageQuestionOffset(sourcePassage, 3)
console.log('Offset:', offset)

const p3 = ex2.parsedPayload.passages[2]
const groups = buildReadingFillQuestionGroups(p3, p3.questions, noop, ex2.id)
console.log('Fill groups in journey:', groups.map(g => `${g.start}-${g.end}`))
for (const g of groups) {
  const sourceStart = g.start - offset
  const sourceEnd = g.end - offset
  console.log(`Journey ${g.start}-${g.end} → source ${sourceStart}-${sourceEnd}`)
}
// Also show source Q numbers in the original exam
const sourceGroups = buildReadingFillQuestionGroups(sourcePassage, sourcePassage.questions, noop, sourceExam.id)
console.log('Fill groups in SOURCE exam:', sourceGroups.map(g => `${g.start}-${g.end}`))
