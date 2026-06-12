#!/usr/bin/env node
import { buildIntensiveJourneyExam } from '../src/readingJourney.ts'
import { INTENSIVE_JOURNEY_FILL_BLANK_SETS } from '../src/intensiveJourneyFillBlankSets.ts'

for (const stage of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
  const exam = buildIntensiveJourneyExam(stage)
  const sets = INTENSIVE_JOURNEY_FILL_BLANK_SETS.filter((s) => s.examId === `journey-normal-stage-${stage}`)
  console.log(`=== STAGE ${stage} ===`)
  for (const p of exam.parsedPayload.passages) {
    const fills = p.questions.filter((q) => q.answerType === 'text')
    if (!fills.length) continue
    console.log(`P${p.number} ${p.title} Q${fills[0].number}-${fills[fills.length - 1].number}`)
  }
  sets.forEach((s) => {
    const match = sets.find((x) => x === s)
    console.log(`  override P${s.passageNumber} Q${s.startNumber}-${s.endNumber} title=${s.summaryTitle?.slice(0, 40)}`)
  })
}
