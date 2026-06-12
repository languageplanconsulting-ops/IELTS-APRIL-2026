#!/usr/bin/env node
import { buildJourneyExamRecords } from '../src/readingJourney.ts'

const pool = []
for (const book of [11, 13, 15, 16, 17, 18, 19]) {
  const mod = await import(`../server/userProvidedReadingPracticeCambridge${book}.mjs`)
  pool.push(...mod[Object.keys(mod).find((k) => k.includes('EXAMS'))])
}

for (const stage of [17, 18, 19, 20]) {
  const exam = buildJourneyExamRecords(pool, 20, 20).find((e) => e.id === `journey-normal-stage-${stage}`)
  const p1 = exam.parsedPayload.passages[0]
  console.log(`\nStage ${stage} (${exam.id})`)
  console.log('  P1:', p1.title.slice(0, 70))
  const fills = p1.questions.filter((q) => q.answerType === 'text')
  console.log('  fill Q:', fills.map((q) => q.number).join(','))
  console.log('  questionRanges:', JSON.stringify(p1.questionRanges))
}
