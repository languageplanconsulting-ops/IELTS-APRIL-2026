#!/usr/bin/env node
import { buildIntensiveJourneyExam, buildJourneyExamRecords } from '../src/readingJourney.ts'

const pool = []
for (const book of [11, 15, 16, 17, 18, 19]) {
  const mod = await import(`../server/userProvidedReadingPracticeCambridge${book}.mjs`)
  pool.push(...mod[Object.keys(mod).find((k) => k.includes('EXAMS'))])
}

const records = buildJourneyExamRecords(pool, 20, 20)

for (const stage of [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]) {
  const exam =
    stage <= 17
      ? buildIntensiveJourneyExam(stage)
      : records.find((e) => e.id === `journey-normal-stage-${stage}`)
  console.log(`=== STAGE ${stage} ===`)
  for (const p of exam.parsedPayload.passages) {
    const fills = p.questions.filter((q) => q.answerType === 'text')
    if (!fills.length) continue
    console.log(`P${p.number} ${p.title}`)
    console.log(`  Q range: ${fills[0].number}-${fills[fills.length - 1].number}`)
    fills.forEach((q) =>
      console.log(`  Q${q.number}: ${q.correctAnswer} | ${q.prompt.slice(0, 120).replace(/\n/g, ' ')}`)
    )
  }
}
