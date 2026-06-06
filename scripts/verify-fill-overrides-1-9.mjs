#!/usr/bin/env node
import { INTENSIVE_JOURNEY_FILL_BLANK_SETS } from '../src/intensiveJourneyFillBlankSets.ts'
import { buildIntensiveJourneyExam } from '../src/readingJourney.ts'

for (const stage of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
  const exam = buildIntensiveJourneyExam(stage)
  const sets = INTENSIVE_JOURNEY_FILL_BLANK_SETS.filter((s) => s.examId === `journey-normal-stage-${stage}`)
  for (const set of sets) {
    const p = exam.parsedPayload.passages[set.passageNumber - 1]
    const fills = p.questions.filter((q) => q.answerType === 'text')
    if (!fills.length) continue
    const match =
      fills[0].number === set.startNumber && fills[fills.length - 1].number === set.endNumber
    console.log(
      `stage ${stage} P${set.passageNumber} override Q${set.startNumber}-${set.endNumber} journey Q${fills[0].number}-${fills[fills.length - 1].number} ${match ? 'OK' : 'MISMATCH'}`
    )
  }
}
