#!/usr/bin/env node
/**
 * Fill-blank summary lines must not reuse distinctive passage wording.
 * Run: npx tsx scripts/audit-fill-blank-paraphrase.mjs
 */
import {
  getDistinctivePassageTokens,
  textBeforeFillBlank
} from '../src/readingFillBlankParaphrase.ts'

import { NEW_FILL_BLANK_SETS } from '../src/readingNewFillBlankQuestions.ts'
import {
  fillBlankSetHasMissingBlankMarkers,
  isLowQualityFillBlankSet
} from '../src/readingFillBlankQuality.ts'

const failures = []
const warnings = []

for (const set of NEW_FILL_BLANK_SETS) {
  if (isLowQualityFillBlankSet(set)) {
    failures.push({
      examId: set.examId,
      question: 0,
      token: 'LOW_QUALITY',
      passageKeyword: '',
      questionKeyword: '',
      line: set.summaryLines.map((line) => line.text).join(' ').slice(0, 120)
    })
    continue
  }
  const isJourneyCore = /^journey-normal-stage-(?:[1-9]|1[0-5])$/.test(set.examId)
  for (const line of set.summaryLines) {
    const displayText = line.text
    for (const question of set.questions) {
      if (!displayText.includes(`{${question.number}}`)) continue
      const distinctive = getDistinctivePassageTokens(
        question.passageKeyword,
        question.questionKeyword,
        question.answer
      )
      const beforeBlank = textBeforeFillBlank(displayText, question.number, set.questions)
      for (const token of distinctive) {
        if (new RegExp(`\\b${token}\\b`, 'i').test(beforeBlank)) {
          const entry = {
            examId: set.examId,
            question: question.number,
            token,
            passageKeyword: question.passageKeyword,
            questionKeyword: question.questionKeyword,
            line: displayText.slice(0, 120)
          }
          if (isJourneyCore) failures.push(entry)
          else warnings.push(entry)
        }
      }
    }
  }
}

if (warnings.length) {
  console.log(`Warnings (${warnings.length}) in legacy Cambridge/custom sets (runtime paraphrase still applied):\n`)
  for (const warning of warnings) {
    console.log(`  ${warning.examId} Q${warning.question} — "${warning.token}"`)
  }
  console.log('')
}

if (!failures.length) {
  console.log(`OK: Journey fill-blank sets (stages 1–15 + intensive) use paraphrased question wording.`)
  process.exit(0)
}

console.log(`FAIL: ${failures.length} distinctive passage token(s) still in summary text:\n`)
for (const failure of failures) {
  console.log(
    `  ${failure.examId} Q${failure.question} — "${failure.token}" (${failure.passageKeyword} → ${failure.questionKeyword})`
  )
  console.log(`    ${failure.line}\n`)
}
process.exit(1)
