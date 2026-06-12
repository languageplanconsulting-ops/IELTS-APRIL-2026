#!/usr/bin/env node
import { buildIntensiveJourneyExam, buildJourneyExamRecords } from '../src/readingJourney.ts'
import { INTENSIVE_JOURNEY_FILL_BLANK_SETS } from '../src/intensiveJourneyFillBlankSets.ts'

const pool = []
for (const book of [11, 15, 16, 17, 18, 19]) {
  const mod = await import(`../server/userProvidedReadingPracticeCambridge${book}.mjs`)
  pool.push(...mod[Object.keys(mod).find((k) => k.includes('EXAMS'))])
}
const records = buildJourneyExamRecords(pool, 20, 20)

for (const stage of [11, 12, 13, 14, 15, 16, 17, 18, 19, 20]) {
  const exam =
    stage <= 17 ? buildIntensiveJourneyExam(stage) : records.find((e) => e.id === `journey-normal-stage-${stage}`)
  const sets = INTENSIVE_JOURNEY_FILL_BLANK_SETS.filter((s) => s.examId === `journey-normal-stage-${stage}`)
  console.log(`\n=== Stage ${stage} ===`)
  for (const set of sets) {
    const p = exam.parsedPayload.passages[set.passageNumber - 1]
    const fills = p.questions.filter((q) => q.answerType === 'text' && q.number >= set.startNumber && q.number <= set.endNumber)
    console.log(`P${set.passageNumber} Q${set.startNumber}-${set.endNumber} (${fills.length} qs)`)
    for (const q of fills) {
      console.log(`  Q${q.number}: ${q.correctAnswer} | ${String(q.prompt || '').slice(0, 80)}`)
    }
  }
}
