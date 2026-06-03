import { buildJourneyStageDefinitions, buildJourneyExamRecords, orderJourneySourceExams } from '../src/readingJourney.ts'
const books = [11,12,13,14,15,16,17,19]
const pool = []
for (const b of books) {
  const m = await import(`../server/userProvidedReadingPracticeCambridge${b}.mjs`)
  const k = Object.keys(m).find(x => x.includes('EXAMS'))
  pool.push(...m[k].filter(e => e.category === 'normal'))
}
const defs = buildJourneyStageDefinitions(pool, 30).slice(0, 10)
const seen = new Set()
for (const def of defs) {
  const srcs = def.sourceExamIds.map(id => pool.find(e => e.id === id)).filter(Boolean)
  const ordered = orderJourneySourceExams(srcs)
  for (const src of ordered) {
    if (seen.has(src.id)) continue
    seen.add(src.id)
    const p = src.parsedPayload.passages[0]
    console.log(`${src.id} | ${p.title.slice(0,70)}`)
  }
}
