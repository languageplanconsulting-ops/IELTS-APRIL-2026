#!/usr/bin/env node
import { buildJourneyStageDefinitions, buildJourneyExamRecords } from '../src/readingJourney.ts'
import { buildReadingFillQuestionGroups } from '../src/readingFillDisplay.ts'
import { NEW_FILL_BLANK_SETS } from '../src/readingNewFillBlankQuestions.ts'
import {
  fillBlankSetHasMissingBlankMarkers,
  isLowQualityFillBlankSet
} from '../src/readingFillBlankQuality.ts'

const books = [11,12,13,14,15,16,17,19]
const pool = []
for (const b of books) {
  const m = await import(`../server/userProvidedReadingPracticeCambridge${b}.mjs`)
  const k = Object.keys(m).find(x => x.includes('EXAMS'))
  pool.push(...m[k].filter(e => e.category === 'normal'))
}
// Also load custom exams
const customMod = await import('../server/userProvidedReadingPracticeCustom.mjs')
pool.push(...customMod.USER_PROVIDED_READING_PRACTICE_CUSTOM_EXAMS.filter(e => e.category === 'normal'))

const isMatching = (passage, question) => /^[A-G]$/i.test(String(question?.correctAnswer || '').trim())

const exams = buildJourneyExamRecords(pool, 30).slice(10, 20)
const issues = []

for (const ex of exams) {
  const stage = ex.id
  for (const p of ex.parsedPayload.passages) {
    const groups = buildReadingFillQuestionGroups(p, p.questions, isMatching, ex.id)
    for (const g of groups) {
      const overrideSet = NEW_FILL_BLANK_SETS.find(
        s => s.examId === ex.id && s.startNumber === g.start && s.endNumber === g.end
      )
      if (!overrideSet) {
        issues.push({ stage, passage: p.number, start: g.start, end: g.end, issue: 'NO_OVERRIDE', title: p.title?.slice(0,50) })
        console.log(`MISSING ${stage} P${p.number} Q${g.start}-${g.end} "${p.title?.slice(0,50)}"`)
        continue
      }
      const allText = overrideSet.summaryLines.map(l => l.text || '').join(' ')
      const garbled = isLowQualityFillBlankSet(overrideSet)
      const hasPlaceholders = /\{\d+\}/.test(allText)
      const countOk = overrideSet.questions.length === (g.end - g.start + 1)
      const missingBlank = fillBlankSetHasMissingBlankMarkers(overrideSet)
      if (garbled || !hasPlaceholders || !countOk || missingBlank) {
        issues.push({ stage, passage: p.number, start: g.start, end: g.end, issue: garbled ? 'GARBLED' : missingBlank ? 'MISSING_BLANK' : 'BAD', title: p.title?.slice(0,50), summaryTitle: overrideSet.summaryTitle?.slice(0,50) })
        console.log(`PROBLEM [${garbled?'GARBLED':missingBlank?'MISSING_BLANK':'BAD'}] ${stage} P${p.number} Q${g.start}-${g.end} "${overrideSet.summaryTitle?.slice(0,40)}"`)
      } else {
        console.log(`OK   ${stage} P${p.number} Q${g.start}-${g.end} "${overrideSet.summaryTitle?.slice(0,40)}"`)
      }
    }
  }
}

console.log(`\nTotal issues: ${issues.length}`)
if (issues.length) {
  console.log('Issues:')
  for (const i of issues) console.log(` ${i.stage} P${i.passage} Q${i.start}-${i.end}: ${i.issue} — "${i.title}"`)
}
