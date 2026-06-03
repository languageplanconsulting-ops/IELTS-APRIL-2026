#!/usr/bin/env node
import { buildJourneyStageDefinitions, buildJourneyExamRecords, orderJourneySourceExams } from '../src/readingJourney.ts'

const books = [11, 12, 13, 14, 15, 16, 17, 19]
const pool = []
for (const book of books) {
  const mod = await import(`../server/userProvidedReadingPracticeCambridge${book}.mjs`)
  const key = Object.keys(mod).find((k) => k.includes('EXAMS'))
  pool.push(...mod[key].filter((e) => e.category === 'normal'))
}
const defs = buildJourneyStageDefinitions(pool, 30).slice(6, 7)
const exams = buildJourneyExamRecords(pool, 30)
const def = defs[0]
const journey = exams.find((e) => e.id === def.id)
console.log('stage', def.stageNumber, 'sourceExamIds:', def.sourceExamIds)
const srcs = def.sourceExamIds.map((id) => pool.find((e) => e.id === id))
const ordered = orderJourneySourceExams(srcs)
ordered.forEach((s, i) => console.log('orderedSources slot', i+1, ':', s.id, 'title:', s.parsedPayload.passages[0].title.slice(0, 60)))
journey.parsedPayload.passages.forEach((p, i) => console.log('journey passage', i+1, ':', p.title.slice(0, 60), 'qstart-end:', p.questionRanges))
