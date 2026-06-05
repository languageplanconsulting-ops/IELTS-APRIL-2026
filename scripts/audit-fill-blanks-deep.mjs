#!/usr/bin/env node
/**
 * Deep fill-blank audit for intensive journey ด่าน 1–17.
 * Checks: override coverage, summary quality, evidence, answers in passage.
 */
import { buildIntensiveJourneyExam, getReadingJourneyStageId } from '../src/readingJourney.ts'
import { NEW_FILL_BLANK_SETS } from '../src/readingNewFillBlankQuestions.ts'
import { buildReadingFillQuestionGroups } from '../src/readingFillDisplay.ts'
import {
  fillBlankSetHasMissingBlankMarkers,
  isLowQualityFillBlankSet
} from '../src/readingFillBlankQuality.ts'

const noop = () => false
const isLetterFill = (q) => /^[A-G]$/i.test(String(q?.correctAnswer || '').trim())

function norm(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[^a-z0-9\s']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function numericForms(needle) {
  const forms = [needle]
  const digitsOnly = needle.replace(/,/g, '')
  if (digitsOnly !== needle) forms.push(digitsOnly)
  if (/^\d+$/.test(digitsOnly)) {
    forms.push(digitsOnly.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 '))
  }
  return forms
}

function inPassage(passage, needle) {
  const body = norm((passage.bodyParagraphs || []).join(' '))
  const n = norm(needle)
  if (!n) return false
  if (body.includes(n)) return true
  for (const form of numericForms(n)) {
    const normalized = norm(form)
    if (normalized && body.includes(normalized)) return true
  }
  const prefix = n.slice(0, Math.min(50, n.length))
  return prefix.length >= 2 && body.includes(prefix)
}

function answerInPassage(passage, question) {
  const answer = String(question.answer || '').trim()
  if (!answer || isLetterFill(question)) return true
  const candidates = [answer, ...(question.acceptedAnswers || [])]
  return candidates.some((candidate) => inPassage(passage, candidate))
}

function summaryText(set) {
  return set.summaryLines.map((l) => ('text' in l ? l.text : '')).join(' ')
}

const issues = []

for (let stage = 1; stage <= 17; stage++) {
  const exam = buildIntensiveJourneyExam(stage)
  const examId = getReadingJourneyStageId(stage)

  for (const passage of exam.parsedPayload.passages) {
    const groups = buildReadingFillQuestionGroups(passage, passage.questions || [], noop, examId)

    for (const group of groups) {
      const fillQs = group.questions.filter((q) => q.answerType === 'text' && !isLetterFill(q))
      if (!fillQs.length) continue

      const start = group.start
      const end = group.end
      const label = `ด่าน ${stage} P${passage.number} Q${start}-${end} — ${passage.title}`
      const set = NEW_FILL_BLANK_SETS.find(
        (s) => s.examId === examId && s.startNumber === start && s.endNumber === end
      )

      if (!set) {
        issues.push({ severity: 'critical', label, code: 'NO_OVERRIDE' })
        continue
      }

      if (isLowQualityFillBlankSet(set)) {
        issues.push({
          severity: 'critical',
          label,
          code: 'GARBLED_SUMMARY',
          detail: summaryText(set).slice(0, 120)
        })
      }

      if (fillBlankSetHasMissingBlankMarkers(set)) {
        issues.push({ severity: 'critical', label, code: 'MISSING_BLANK_MARKER' })
      }

      if (set.questions.length !== end - start + 1) {
        issues.push({
          severity: 'critical',
          label,
          code: 'QUESTION_COUNT',
          detail: `expected ${end - start + 1}, got ${set.questions.length}`
        })
      }

      const allSummary = summaryText(set)

      if (/The passage refers to \{/.test(allSummary)) {
        const nums = [...allSummary.matchAll(/The passage refers to \{(\d+)\}/g)].map((m) => m[1])
        issues.push({
          severity: 'warn',
          label,
          code: 'FALLBACK_LINE',
          detail: `Q${nums.join(', Q')}`
        })
      }

      if (/\{\d+\}[a-z]/i.test(allSummary) || /[a-z]\{\d+\}/i.test(allSummary)) {
        issues.push({
          severity: 'warn',
          label,
          code: 'BAD_BLANK_SPACING',
          detail: allSummary.match(/\S*\{\d+\}\S*|\S+\{\d+\}/)?.[0]
        })
      }

      if (/\{\d+\}\s*\{\d+\}/.test(allSummary)) {
        issues.push({ severity: 'warn', label, code: 'DUPLICATE_BLANK' })
      }

      if (/…|\.{4,}/.test(allSummary)) {
        issues.push({ severity: 'warn', label, code: 'ELLIPSIS_IN_SUMMARY' })
      }

      if (allSummary.length > 20 && allSummary.trim().length < 40) {
        issues.push({ severity: 'warn', label, code: 'TRUNCATED_SUMMARY', detail: allSummary })
      }

      for (const q of set.questions) {
        const built = fillQs.find((b) => b.number === q.number)
        const evidence = q.exactPortion || built?.exactPortion || ''
        if (!inPassage(passage, evidence)) {
          issues.push({
            severity: 'warn',
            label,
            code: 'EVIDENCE_NOT_IN_PASSAGE',
            detail: `Q${q.number}: ${evidence.slice(0, 70)}…`
          })
        }
        const answer = String(q.answer || '').trim()
        if (answer && !answerInPassage(passage, q)) {
          issues.push({
            severity: 'warn',
            label,
            code: 'ANSWER_NOT_IN_PASSAGE',
            detail: `Q${q.number}: "${answer}"`
          })
        }
      }
    }
  }
}

const critical = issues.filter((i) => i.severity === 'critical')
const warn = issues.filter((i) => i.severity === 'warn')

console.log('=== DEEP FILL-BLANK AUDIT (ด่าน 1–17) ===\n')
console.log(`Critical: ${critical.length}`)
console.log(`Warnings: ${warn.length}\n`)

if (critical.length) {
  console.log('❌ CRITICAL')
  for (const i of critical) {
    console.log(`  [${i.code}] ${i.label}`)
    if (i.detail) console.log(`    ${i.detail}`)
  }
  console.log()
}

const byCode = {}
for (const i of warn) {
  if (!byCode[i.code]) byCode[i.code] = []
  byCode[i.code].push(i)
}

if (warn.length) {
  console.log('⚠️  WARNINGS (may still look odd in UI)')
  for (const [code, list] of Object.entries(byCode)) {
    console.log(`\n  ${code} (${list.length})`)
    for (const i of list) {
      console.log(`    ${i.label}`)
      if (i.detail) console.log(`      → ${i.detail}`)
    }
  }
}

if (!issues.length) {
  console.log('✅ No issues found — all fill-blank sets look clean.')
}

process.exit(critical.length > 0 ? 1 : 0)
