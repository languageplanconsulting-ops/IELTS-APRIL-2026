import { buildJourneyExamRecords } from '../src/readingJourney.ts'
const books=[11,12,13,14,15,16,17,19], pool=[]
for (const b of books) {
  const m = await import(`../server/userProvidedReadingPracticeCambridge${b}.mjs`)
  const k = Object.keys(m).find(x=>x.includes('EXAMS'))
  pool.push(...m[k].filter(e=>e.category==='normal'))
}
const exams = buildJourneyExamRecords(pool,30)
const ex6 = exams.find(e=>e.id==='journey-normal-stage-6')
const p2 = ex6.parsedPayload.passages[1]
console.log('P2 title:', p2.title.slice(0,50))
for (const q of p2.questions) {
  if (q.number>=14 && q.number<=19) {
    console.log(`Q${q.number} [${q.answerType}] answer="${q.correctAnswer}" exactPortion="${(q.exactPortion||'').slice(0,60)}"`)
  }
}
