#!/usr/bin/env node
import { buildJourneyStageDefinitions, buildIntensiveJourneyExam } from '../src/readingJourney.ts'

const pool = []
for (const book of [11, 15, 16, 17, 18, 19]) {
  const mod = await import(`../server/userProvidedReadingPracticeCambridge${book}.mjs`)
  pool.push(...mod[Object.keys(mod).find((k) => k.includes('EXAMS'))])
}

const defs = buildJourneyStageDefinitions(pool, 20, 20)
for (const stage of [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]) {
  const intensive = stage <= 17 ? buildIntensiveJourneyExam(stage) : null
  const def = defs.find((d) => d.stageNumber === stage)
  console.log('=== stage', stage, intensive ? 'intensive' : 'merged', '===')
  if (def) console.log('sourceExamIds:', def.sourceExamIds)
  const exam = intensive || (def ? (await import('../src/readingJourney.ts')).buildJourneyExamRecords(pool, 20, 20).find((e) => e.id === `journey-normal-stage-${stage}`) : null)
  if (!exam) {
    console.log('no exam')
    continue
  }
  for (const p of exam.parsedPayload.passages) {
    console.log(' P' + p.number, p.title)
    const fills = p.questions.filter((q) => q.answerType === 'text')
    if (fills.length) {
      console.log('  fill Q:', fills.map((q) => q.number).join(','))
      fills.slice(0, 2).forEach((q) => console.log('   ', q.number, q.prompt.slice(0, 90)))
    }
  }
}
