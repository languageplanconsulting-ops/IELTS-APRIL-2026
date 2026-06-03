#!/usr/bin/env node
import { buildJourneyExamRecords, buildJourneyStageDefinitions } from '../src/readingJourney.ts'

const books = [11, 12, 13, 14, 15, 16, 17, 19]
const pool = []
for (const book of books) {
  const mod = await import(`../server/userProvidedReadingPracticeCambridge${book}.mjs`)
  const key = Object.keys(mod).find((name) => name.includes('EXAMS'))
  pool.push(...mod[key].filter((exam) => exam.category === 'normal'))
}

const defs = buildJourneyStageDefinitions(pool, 8)
const exams = buildJourneyExamRecords(pool, 8)

for (let stage = 1; stage <= 10; stage += 1) {
  const exam = exams.find((item) => item.id === `journey-normal-stage-${stage}`)
  const def = defs.find((item) => item.stageNumber === stage)
  console.log(
    `Stage ${stage} intensive=${Boolean(def?.intensive)} passages=${exam?.parsedPayload?.passages?.length} questions=${exam?.parsedPayload?.questionCount}`
  )
  for (const passage of exam?.parsedPayload?.passages || []) {
    console.log(`  P${passage.number}: ${passage.title} (Q${passage.questions[0]?.number}–${passage.questions.at(-1)?.number})`)
  }
}
