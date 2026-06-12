#!/usr/bin/env node
import { buildIntensiveJourneyExam } from '../src/readingJourney.ts'
import { INTENSIVE_JOURNEY_FILL_BLANK_SETS } from '../src/intensiveJourneyFillBlankSets.ts'

const exam = buildIntensiveJourneyExam(1)
const p1 = exam.parsedPayload.passages[0]
const fills = p1.questions.filter((q) => q.answerType === 'text')
console.log('Stage 1 P1 fill Q:', fills.map((q) => q.number).join(','))
console.log('\nSample prompts:')
fills.forEach((q) => console.log(`Q${q.number}:`, q.prompt.slice(0, 150).replace(/\n/g, ' ')))

console.log('\nquestionSectionText excerpt:')
console.log(p1.questionSectionText?.slice(0, 800))

const sets = INTENSIVE_JOURNEY_FILL_BLANK_SETS.filter((s) => s.examId === 'journey-normal-stage-1')
console.log('\nOverride sets:')
sets.forEach((s) => console.log(`  P${s.passageNumber} Q${s.startNumber}-${s.endNumber}`))

// Simulate group splitting (consecutive fill questions)
const groups = []
let start = fills[0]?.number
let end = start
for (let i = 1; i < fills.length; i++) {
  if (fills[i].number === end + 1) {
    end = fills[i].number
  } else {
    groups.push([start, end])
    start = fills[i].number
    end = start
  }
}
if (start) groups.push([start, end])
console.log('\nLikely fill groups from consecutive Q:', groups)

groups.forEach(([gs, ge]) => {
  const match = sets.find((s) => s.startNumber === gs && s.endNumber === ge)
  console.log(`  Group Q${gs}-${ge}: override ${match ? 'MATCHES' : 'NO MATCH → legacy path'}`)
})
