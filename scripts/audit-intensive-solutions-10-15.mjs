#!/usr/bin/env node
/**
 * Audit intensive journey stages 10–15: structure, solutions, fill-blank, Thai text.
 * Run: npx tsx scripts/audit-intensive-solutions-10-15.mjs
 */
import { buildIntensiveJourneyExam } from '../src/readingJourney.ts'
import { INTENSIVE_SOLUTIONS_BY_STAGE } from '../src/intensiveJourneyQuestionSolutions.ts'
import { INTENSIVE_JOURNEY_FILL_BLANK_SETS } from '../src/intensiveJourneyFillBlankSets.ts'
import {
  fillBlankSetHasMissingBlankMarkers,
  isLowQualityFillBlankSet
} from '../src/readingFillBlankQuality.ts'

const normalize = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const passageText = (passage) => (passage.bodyParagraphs || []).join(' ')

const localNumber = (stage, slot, globalNumber) => {
  const start = slot === 1 ? 1 : 15
  return globalNumber - start + 1
}

const issues = []
const ok = []

for (let stage = 10; stage <= 15; stage += 1) {
  const exam = buildIntensiveJourneyExam(stage)
  if (!exam) {
    issues.push({ stage, type: 'EXAM_BUILD_FAILED' })
    continue
  }

  const passages = exam.parsedPayload?.passages || []
  const totalQ = passages.reduce((n, p) => n + (p.questions?.length || 0), 0)
  const numbers = passages.flatMap((p) => p.questions?.map((q) => q.number) || [])
  const expected = Array.from({ length: 27 }, (_, i) => i + 1)

  if (totalQ !== 27) {
    issues.push({ stage, type: 'QUESTION_COUNT', expected: 27, got: totalQ })
  }
  if (JSON.stringify(numbers) !== JSON.stringify(expected)) {
    issues.push({ stage, type: 'QUESTION_NUMBERING', got: numbers.join(',') })
  }

  const solutions = INTENSIVE_SOLUTIONS_BY_STAGE[stage]
  if (!solutions) {
    issues.push({ stage, type: 'NO_SOLUTIONS' })
    continue
  }

  for (const passage of passages) {
    const slot = passage.number
    const slotSolutions = solutions[slot] || {}
    const body = passageText(passage)

    for (const question of passage.questions || []) {
      const local = localNumber(stage, slot, question.number)
      const sol = slotSolutions[local]

      if (!sol) {
        issues.push({
          stage,
          type: 'MISSING_SOLUTION',
          passage: slot,
          q: question.number,
          local
        })
        continue
      }

      if (!sol.passageKeyword?.trim() || !sol.questionKeyword?.trim()) {
        issues.push({ stage, type: 'EMPTY_KEYWORDS', passage: slot, q: question.number, local })
      }

      if (!sol.thaiMeaning?.trim()) {
        issues.push({ stage, type: 'EMPTY_THAI', passage: slot, q: question.number, local })
      }

      if (!question.explanationThai?.trim()) {
        issues.push({ stage, type: 'EXPLANATION_NOT_APPLIED', passage: slot, q: question.number, local })
      }

      const answer = String(question.correctAnswer || '').trim()
      const evidence = String(question.exactPortion || question.evidence || '').trim()

      if (!evidence) {
        issues.push({ stage, type: 'NO_EVIDENCE', passage: slot, q: question.number, local })
      } else {
        const normEvidence = normalize(evidence.slice(0, 40))
        const normBody = normalize(body)
        if (normEvidence.length >= 8 && !normBody.includes(normEvidence)) {
          // try first 5 words
          const words = normalize(evidence).split(' ').slice(0, 5).join(' ')
          if (words.length >= 8 && !normBody.includes(words)) {
            issues.push({
              stage,
              type: 'EVIDENCE_NOT_IN_PASSAGE',
              passage: slot,
              q: question.number,
              local,
              evidence: evidence.slice(0, 80)
            })
          }
        }
      }

      // TFNG / YNNG answer sanity
      if (/TRUE|FALSE|NOT GIVEN|YES|NO/i.test(answer) && !/^(TRUE|FALSE|NOT GIVEN|YES|NO)$/i.test(answer)) {
        issues.push({ stage, type: 'ODD_TFNG_ANSWER', passage: slot, q: question.number, answer })
      }
    }
  }

  // Fill-blank sets
  const fillSets = INTENSIVE_JOURNEY_FILL_BLANK_SETS.filter((s) => s.examId === `journey-normal-stage-${stage}`)
  const expectedSets = [
    { passage: 1, start: slotStarts(1), end: 14 },
    { passage: 2, start: 25, end: 27 }
  ]

  for (const exp of expectedSets) {
    const set = fillSets.find((s) => s.passageNumber === exp.passage && s.startNumber === exp.start)
    if (!set) {
      issues.push({ stage, type: 'MISSING_FILL_SET', passage: exp.passage, range: `${exp.start}-${exp.end}` })
      continue
    }

    if (isLowQualityFillBlankSet(set) || fillBlankSetHasMissingBlankMarkers(set)) {
      issues.push({ stage, type: 'FILL_SET_QUALITY', passage: exp.passage, range: `${exp.start}-${exp.end}` })
    }

    if (set.questions.length !== exp.end - exp.start + 1) {
      issues.push({
        stage,
        type: 'FILL_QUESTION_COUNT',
        passage: exp.passage,
        expected: exp.end - exp.start + 1,
        got: set.questions.length
      })
    }

    const p = passages.find((x) => x.number === exp.passage)
    const pBody = p ? passageText(p) : ''

    for (const fq of set.questions) {
      const ans = String(fq.answer || '').toLowerCase()
      const accepted = (fq.acceptedAnswers || []).map((a) => a.toLowerCase())
      const allAns = [ans, ...accepted].filter(Boolean)
      const normBody = normalize(pBody)

      if (!allAns.some((a) => normBody.includes(normalize(a)))) {
        issues.push({
          stage,
          type: 'FILL_ANSWER_NOT_IN_PASSAGE',
          passage: exp.passage,
          q: fq.number,
          answer: fq.answer
        })
      }

      const sol = solutions[exp.passage]?.[localNumber(stage, exp.passage, fq.number)]
      if (!sol) {
        issues.push({ stage, type: 'FILL_MISSING_SOLUTION', passage: exp.passage, q: fq.number })
      }

      if (!fq.thaiMeaning?.trim()) {
        issues.push({ stage, type: 'FILL_EMPTY_THAI', passage: exp.passage, q: fq.number })
      }

      if (fq.exactPortion) {
        const normPortion = normalize(String(fq.exactPortion).slice(0, 40))
        if (normPortion.length >= 8 && !normBody.includes(normPortion)) {
          const words = normalize(fq.exactPortion).split(' ').slice(0, 5).join(' ')
          if (words.length >= 8 && !normBody.includes(words)) {
            issues.push({
              stage,
              type: 'FILL_EXACT_PORTION_NOT_IN_PASSAGE',
              passage: exp.passage,
              q: fq.number,
              portion: String(fq.exactPortion).slice(0, 80)
            })
          }
        }
      }
    }
  }

  if (!issues.some((i) => i.stage === stage)) {
    ok.push(stage)
  }
}

function slotStarts(slot) {
  return slot === 1 ? 8 : 25
}

console.log('=== Intensive Journey Solutions Audit (Stages 10–15) ===\n')

if (ok.length) {
  console.log(`Clean stages (${ok.length}): ${ok.join(', ')}`)
}

const byType = {}
for (const i of issues) {
  byType[i.type] = (byType[i.type] || 0) + 1
}

if (Object.keys(byType).length) {
  console.log('\nIssue counts by type:')
  for (const [type, count] of Object.entries(byType).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${type}: ${count}`)
  }
}

if (issues.length) {
  console.log(`\nDetails (${issues.length} issues):\n`)
  for (const i of issues) {
    const parts = [`[${i.type}] stage ${i.stage}`]
    if (i.passage) parts.push(`P${i.passage}`)
    if (i.q) parts.push(`Q${i.q}`)
    if (i.local) parts.push(`local ${i.local}`)
    if (i.range) parts.push(`range ${i.range}`)
    if (i.answer) parts.push(`answer="${i.answer}"`)
    if (i.evidence) parts.push(`evidence="${i.evidence}"`)
    if (i.portion) parts.push(`portion="${i.portion}"`)
    console.log('  ' + parts.join(' '))
  }
  process.exit(1)
}

console.log('\nAll stages 10–15 passed: 27 questions, full solution coverage, fill-blank answers in passage.')
process.exit(0)
