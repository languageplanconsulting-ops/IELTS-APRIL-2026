#!/usr/bin/env node
import { buildJourneyExamRecords } from '../src/readingJourney.ts'
import { buildReadingFillQuestionGroups } from '../src/readingFillDisplay.ts'
import { NEW_FILL_BLANK_SETS } from '../src/readingNewFillBlankQuestions.ts'
import {
  fillBlankSetHasMissingBlankMarkers,
  isLowQualityFillBlankSet
} from '../src/readingFillBlankQuality.ts'
const noop = () => false
// Exclude letter-answer questions (paragraph matching / matching features)
// so the audit mirrors how the real app renderer handles fill groups.
const isMatching = (passage, question) => /^[A-G]$/i.test(String(question?.correctAnswer || '').trim())

const books = [11,12,13,14,15,16,17,19]
const pool = []
for (const b of books) {
  const m = await import(`../server/userProvidedReadingPracticeCambridge${b}.mjs`)
  const k = Object.keys(m).find(x => x.includes('EXAMS'))
  pool.push(...m[k].filter(e => e.category === 'normal'))
}

const exams = buildJourneyExamRecords(pool, 30).slice(0, 10)
const issues = []

for (const ex of exams) {
  const stage = ex.id
  for (const p of ex.parsedPayload.passages) {
    const groups = buildReadingFillQuestionGroups(p, p.questions, isMatching, ex.id)
    for (const g of groups) {
      // Check 1: does a MANUAL or journey override set exist for this range?
      const overrideSet = NEW_FILL_BLANK_SETS.find(
        s => s.examId === ex.id && s.startNumber === g.start && s.endNumber === g.end
      )

      if (!overrideSet) {
        issues.push({ stage, passage: p.number, start: g.start, end: g.end, issue: 'NO_OVERRIDE', title: p.title?.slice(0,50) })
        continue
      }

      // Check 2: is the summary text clean?
      const allText = overrideSet.summaryLines.map(l => l.text || '').join(' ')
      const isGarbled = isLowQualityFillBlankSet(overrideSet)

      // Check 3: summary lines without any placeholder (orphan headings with no blanks nearby)
      const hasPlaceholders = /\{\d+\}/.test(allText)
      const questionCount = overrideSet.questions.length
      const expectedCount = g.end - g.start + 1

      if (isGarbled || !hasPlaceholders || questionCount !== expectedCount || fillBlankSetHasMissingBlankMarkers(overrideSet)) {
        issues.push({
          stage, passage: p.number, start: g.start, end: g.end,
          issue: isGarbled ? 'GARBLED_TEXT' : fillBlankSetHasMissingBlankMarkers(overrideSet) ? 'MISSING_BLANK' : !hasPlaceholders ? 'NO_PLACEHOLDERS' : 'QUESTION_COUNT_MISMATCH',
          title: p.title?.slice(0,50),
          summaryTitle: overrideSet.summaryTitle?.slice(0,50),
          expected: expectedCount, got: questionCount,
          sampleText: allText.slice(0, 120)
        })
      } else {
        console.log(`OK   ${stage} P${p.number} Q${g.start}-${g.end} "${overrideSet.summaryTitle?.slice(0,40)}"`)
      }
    }
  }
}

console.log('\n=== ISSUES ===')
if (!issues.length) {
  console.log('None! All fill-blank groups in ด่าน 1-10 look clean.')
} else {
  for (const i of issues) {
    console.log(`ISSUE [${i.issue}] ${i.stage} P${i.passage} Q${i.start}-${i.end}`)
    console.log(`  passage: "${i.title}"`)
    if (i.summaryTitle) console.log(`  summary: "${i.summaryTitle}"`)
    if (i.sampleText) console.log(`  text: "${i.sampleText}"`)
    console.log()
  }
}
console.log(`Total issues: ${issues.length}`)
