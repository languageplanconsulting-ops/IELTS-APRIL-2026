#!/usr/bin/env node
import { buildIntensiveJourneyExam, buildJourneyExamRecords } from '../src/readingJourney.ts'
import { INTENSIVE_JOURNEY_FILL_BLANK_SETS } from '../src/intensiveJourneyFillBlankSets.ts'

const pool = []
for (const book of [10, 11, 15, 16, 17, 18, 19]) {
  const mod = await import(`../server/userProvidedReadingPracticeCambridge${book}.mjs`)
  pool.push(...mod[Object.keys(mod).find((k) => k.includes('EXAMS'))])
}
const records = buildJourneyExamRecords(pool, 20, 20)

const answerKey = (q) => String(q?.correctAnswer || q?.answer || '').trim().toLowerCase()

for (const stage of [11, 12, 13, 14, 15, 16, 17, 18, 19, 20]) {
  const exam =
    stage <= 17 ? buildIntensiveJourneyExam(stage) : records.find((e) => e.id === `journey-normal-stage-${stage}`)
  const sets = INTENSIVE_JOURNEY_FILL_BLANK_SETS.filter((s) => s.examId === `journey-normal-stage-${stage}`)
  for (const set of sets) {
    const jp = exam.parsedPayload.passages[set.passageNumber - 1]
    const fills = jp.questions.filter(
      (q) => q.answerType === 'text' && q.number >= set.startNumber && q.number <= set.endNumber
    )
    for (const jq of fills) {
      const ja = answerKey(jq)
      const match = pool.find((e) => {
        const p = e.parsedPayload?.passages?.[0]
        if (!p) return false
        return p.questions.some((sq) => {
          if (sq.answerType !== 'text') return false
          const sa = answerKey(sq)
          if (sa === ja) return true
          return (sq.acceptedAnswers || []).some((a) => String(a).toLowerCase() === ja)
        })
      })
      console.log(`stage ${stage} P${set.passageNumber} Q${jq.number} -> ${match?.id || '?'}`)
    }
  }
}
