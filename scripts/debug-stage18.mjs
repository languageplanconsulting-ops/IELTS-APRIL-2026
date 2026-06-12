#!/usr/bin/env node
import { buildJourneyExamRecords } from '../src/readingJourney.ts'
import { INTENSIVE_JOURNEY_FILL_BLANK_SETS } from '../src/intensiveJourneyFillBlankSets.ts'
import { NEW_FILL_BLANK_SETS } from '../src/readingNewFillBlankQuestions.ts'

const pool = []
for (const book of [11, 13, 15, 16, 17, 18, 19]) {
  const mod = await import(`../server/userProvidedReadingPracticeCambridge${book}.mjs`)
  pool.push(...mod[Object.keys(mod).find((k) => k.includes('EXAMS'))])
}
const exam = buildJourneyExamRecords(pool, 20, 20).find((e) => e.id === 'journey-normal-stage-18')
console.log('=== Stage 18 exam ===')
for (const p of exam.parsedPayload.passages) {
  console.log(`\nP${p.number}: ${p.title}`)
  console.log('  questionRanges:', p.questionRanges)
  const textQs = p.questions.filter((q) => q.answerType === 'text')
  console.log('  fill count:', textQs.length, 'numbers:', textQs.map((q) => q.number).join(','))
  for (const q of textQs.slice(0, 3)) {
    console.log(`  Q${q.number} prompt:`, String(q.prompt || '').slice(0, 80))
  }
}
console.log('\n=== Overrides for stage 18 ===')
for (const s of INTENSIVE_JOURNEY_FILL_BLANK_SETS.filter((x) => x.examId === 'journey-normal-stage-18')) {
  console.log(`P${s.passageNumber} Q${s.startNumber}-${s.endNumber} "${s.summaryTitle}"`)
  console.log('  lines:', s.summaryLines?.length)
}
console.log('\n=== NEW_FILL_BLANK_SETS stage 18 ===')
for (const s of NEW_FILL_BLANK_SETS.filter((x) => x.examId === 'journey-normal-stage-18')) {
  console.log(`P${s.passageNumber} Q${s.startNumber}-${s.endNumber} "${s.summaryTitle}"`)
}
