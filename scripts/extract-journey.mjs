import { buildIntensiveJourneyExam } from '../src/readingJourney.ts'
import fs from 'fs'

const manifest = []
for (let stage = 1; stage <= 17; stage++) {
  const exam = buildIntensiveJourneyExam(stage)
  if (!exam) continue
  for (const p of exam.parsedPayload.passages) {
    const text = p.bodyParagraphs.join('\n\n')
    manifest.push({ id: `journey-stage${stage}-p${p.number}`, title: p.title, text, source: 'journey' })
  }
}
fs.writeFileSync('/tmp/reading-manifest-journey.json', JSON.stringify(manifest))
console.log('journey passages', manifest.length)
