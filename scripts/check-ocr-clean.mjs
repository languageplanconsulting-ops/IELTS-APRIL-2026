#!/usr/bin/env node
import { buildJourneyExamRecords } from '../src/readingJourney.ts'
const books=[11,12,13,14,15,16,17,19], pool=[]
for (const b of books) {
  const m = await import(`../server/userProvidedReadingPracticeCambridge${b}.mjs`)
  const k = Object.keys(m).find(x=>x.includes('EXAMS'))
  pool.push(...m[k].filter(e=>e.category==='normal'))
}
const exams = buildJourneyExamRecords(pool,30).slice(0,10)
let garbledCount = 0
for (const ex of exams) {
  for (const p of ex.parsedPayload.passages) {
    const text = p.bodyParagraphs.join(' ')
    const garbled = /[A-Z]{3,}[a-z]|[a-z][A-Z]{3}|SUFr|USEd|PrOd|WEE\s|vooitisnn/.test(text)
    if (garbled) {
      console.log('GARBLED:', ex.id, 'P'+p.number, p.title?.slice(0,50))
      garbledCount++
    } else {
      console.log('CLEAN:  ', ex.id, 'P'+p.number, p.title?.slice(0,50))
    }
  }
}
console.log(`\n${garbledCount} garbled passages remaining`)
