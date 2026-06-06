#!/usr/bin/env node
import { INTENSIVE_JOURNEY_FILL_BLANK_SETS } from '../src/intensiveJourneyFillBlankSets.ts'
import { buildIntensiveJourneyExam, buildJourneyExamRecords } from '../src/readingJourney.ts'

const pool = []
for (const book of [11, 15, 16, 17, 18, 19]) {
  const mod = await import(`../server/userProvidedReadingPracticeCambridge${book}.mjs`)
  pool.push(...mod[Object.keys(mod).find((k) => k.includes('EXAMS'))])
}
const records = buildJourneyExamRecords(pool, 20, 20)

let ok = 0
let bad = 0
for (const stage of [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]) {
  const exam =
    stage <= 17
      ? buildIntensiveJourneyExam(stage)
      : records.find((e) => e.id === `journey-normal-stage-${stage}`)
  const sets = INTENSIVE_JOURNEY_FILL_BLANK_SETS.filter((s) => s.examId === `journey-normal-stage-${stage}`)
  for (const set of sets) {
    const p = exam.parsedPayload.passages[set.passageNumber - 1]
    const fills = p.questions.filter((q) => q.answerType === 'text')
    const match =
      fills.length &&
      fills[0].number === set.startNumber &&
      fills[fills.length - 1].number === set.endNumber
    if (match) {
      ok += 1
      console.log(`stage ${stage} P${set.passageNumber} Q${set.startNumber}-${set.endNumber} OK`)
    } else {
      bad += 1
      console.log(
        `stage ${stage} P${set.passageNumber} Q${set.startNumber}-${set.endNumber} MISMATCH journey=${fills.map((q) => q.number).join(',')}`
      )
    }
  }
}
console.log(`\n${ok} OK, ${bad} mismatches`)
process.exit(bad ? 1 : 0)
