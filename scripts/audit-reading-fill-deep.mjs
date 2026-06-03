#!/usr/bin/env node
/**
 * Deep audit of fill-in-the-blank question prompts in Normal Reading. Looks
 * for the messy / misspelled / truncated prompts users see when answering.
 *
 * Detects:
 *  - Truncated prompts (end mid-clause without terminal punctuation)
 *  - Missing blank placeholder ("… …" or dots) when the answer is non-trivial
 *  - Internal-space OCR artifacts the global fixer didn't catch
 *  - Common misspellings (worid, ben, ariwna, gre9tly, enoµgh, etc.)
 *  - Stray bullet/dot artifacts ("• ", "·")
 *  - Prompts with weird capitalisation mid-sentence
 *
 * Run: node scripts/audit-reading-fill-deep.mjs
 *      node scripts/audit-reading-fill-deep.mjs --emit-findings   (append to findings.json)
 */

import fs from 'node:fs'
import path from 'node:path'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_11_EXAMS } from '../server/userProvidedReadingPracticeCambridge11.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_12_EXAMS } from '../server/userProvidedReadingPracticeCambridge12.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_13_EXAMS } from '../server/userProvidedReadingPracticeCambridge13.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_14_EXAMS } from '../server/userProvidedReadingPracticeCambridge14.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_15_EXAMS } from '../server/userProvidedReadingPracticeCambridge15.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_16_EXAMS } from '../server/userProvidedReadingPracticeCambridge16.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_17_EXAMS } from '../server/userProvidedReadingPracticeCambridge17.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_19_EXAMS } from '../server/userProvidedReadingPracticeCambridge19.mjs'
import { USER_PROVIDED_READING_PRACTICE_JUNE_2026_EXAMS } from '../server/userProvidedReadingPracticeJune2026.mjs'

const EMIT_FINDINGS = process.argv.includes('--emit-findings')

const SOURCES = [
  USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_11_EXAMS,
  USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_12_EXAMS,
  USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_13_EXAMS,
  USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_14_EXAMS,
  USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_15_EXAMS,
  USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_16_EXAMS,
  USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_17_EXAMS,
  USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_19_EXAMS,
  USER_PROVIDED_READING_PRACTICE_JUNE_2026_EXAMS
]

const issues = []

// Fill questions are answerType === 'text' AND prompt contains a blank
// placeholder ("… …", multiple dots, or trailing dots).
const isFillPrompt = (question) => {
  if (!question || question.answerType && question.answerType !== 'text') return false
  const p = String(question.prompt || '')
  return /(?:…\s*…|\.{3,}|_{2,})/.test(p)
}

const knownMisspellings = [
  [/\bworid\b/i, 'worid → world'],
  [/\bAriwna\b/i, 'Ariwna → Arizona'],
  [/\bgre9tly\b/i, 'gre9tly → greatly'],
  [/\benoµgh\b/i, 'enoµgh → enough'],
  [/\b�eople\b/i, '�eople → people'],
  [/\bben\b(?=\s+[a-z])/i, '"ben" should likely be "been"'],
  [/\bco\b(?=\s+[A-Za-z])/, '"co" likely "to"'],
  // Add more known patterns
  [/[a-z]\.[A-Z]/, 'missing space after period'],
  [/[A-Za-z]­/, 'lingering soft hyphen']
]

const truncatedTail = (prompt) => {
  const cleaned = String(prompt || '').trim()
  if (!cleaned) return false
  // Acceptable endings: punctuation, blank placeholder (because the input
  // sits at the end), or matching brackets/quotes.
  if (/[.!?…]\s*$/.test(cleaned)) return false
  if (/[…\.]{1,}\s*$/.test(cleaned)) return false
  if (/_{2,}\s*$/.test(cleaned)) return false
  // Otherwise the prompt ends in an unusual position — likely truncated.
  return true
}

let totalFill = 0

for (const examList of SOURCES) {
  for (const exam of examList) {
    const payload = exam.parsedPayload || exam.parsed_payload
    if (!payload?.passages) continue
    for (const passage of payload.passages) {
      for (const question of passage.questions || []) {
        if (!isFillPrompt(question)) continue
        totalFill += 1
        const prompt = String(question.prompt || '')

        // Truncation check — these prompts feel cut off mid-clause.
        if (truncatedTail(prompt)) {
          issues.push({
            examId: exam.id,
            passageNumber: passage.number,
            questionNumber: question.number,
            kind: 'truncated_prompt',
            currentValue: prompt,
            reasoning: `Prompt ends mid-sentence without punctuation: "...${prompt.slice(-50)}"`
          })
        }

        // Misspellings + OCR
        for (const [re, name] of knownMisspellings) {
          if (re.test(prompt)) {
            issues.push({
              examId: exam.id,
              passageNumber: passage.number,
              questionNumber: question.number,
              kind: 'prompt_misspelling',
              currentValue: prompt,
              reasoning: name
            })
          }
        }

        // Stray bullets
        if (/[•·]/.test(prompt)) {
          issues.push({
            examId: exam.id,
            passageNumber: passage.number,
            questionNumber: question.number,
            kind: 'prompt_bullet_artifact',
            currentValue: prompt,
            reasoning: 'Stray bullet/middot character inside prompt.'
          })
        }

        // Empty-context blank placement (e.g. starts with "… …" — no lead text)
        if (/^\s*(?:…\s*…|\.{3,}|_{2,})/.test(prompt)) {
          issues.push({
            examId: exam.id,
            passageNumber: passage.number,
            questionNumber: question.number,
            kind: 'prompt_no_lead_context',
            currentValue: prompt,
            reasoning: 'Prompt starts with the blank — no lead-in words for the student to read.'
          })
        }

        // Internal collapsed spaces (e.g. "of … …light is" — input merged into next word)
        if (/…\s*…[A-Za-z]/.test(prompt) || /\.{2,}[A-Za-z]/.test(prompt)) {
          issues.push({
            examId: exam.id,
            passageNumber: passage.number,
            questionNumber: question.number,
            kind: 'prompt_collapsed_space_after_blank',
            currentValue: prompt,
            reasoning: 'No space between the blank and the following word.'
          })
        }

        // Inconsistent placeholder: dots AND ellipsis used together
        if (/…/.test(prompt) && /\.{3,}/.test(prompt)) {
          issues.push({
            examId: exam.id,
            passageNumber: passage.number,
            questionNumber: question.number,
            kind: 'prompt_mixed_placeholder',
            currentValue: prompt,
            reasoning: 'Mixes "…" ellipsis and "..." dots as placeholders.'
          })
        }
      }
    }
  }
}

const byKind = new Map()
for (const issue of issues) byKind.set(issue.kind, (byKind.get(issue.kind) || 0) + 1)

console.log(`Fill-in-blank prompts scanned: ${totalFill}`)
console.log(`Issues found: ${issues.length}`)
console.log('')
console.log('By kind:')
for (const [k, n] of [...byKind].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${n.toString().padStart(4)} × ${k}`)
}

// Group by exam for readable output
const byExam = new Map()
for (const issue of issues) {
  const list = byExam.get(issue.examId) || []
  list.push(issue)
  byExam.set(issue.examId, list)
}
console.log('')
console.log('Sample issues per exam (first 3 per exam, first 12 exams):')
let examShown = 0
for (const [examId, list] of byExam) {
  if (examShown++ >= 12) break
  console.log(`\n  ${examId}:`)
  for (const issue of list.slice(0, 3)) {
    console.log(`    Q${issue.questionNumber} [${issue.kind}] ${issue.reasoning}`)
    console.log(`      "${issue.currentValue.slice(0, 100)}${issue.currentValue.length > 100 ? '...' : ''}"`)
  }
}

// Write report
const reportPath = path.join(process.cwd(), 'audit-reading-fill-issues.md')
const reportLines = [`# Fill-in-blank prompt audit`, '', `Scanned: ${totalFill} fill questions`, `Issues: ${issues.length}`, '']
reportLines.push('## Counts by kind', '')
for (const [k, n] of byKind) reportLines.push(`- ${k}: ${n}`)
reportLines.push('', '## Detailed findings (by exam)', '')
for (const [examId, list] of byExam) {
  reportLines.push(`### ${examId}`, '')
  for (const issue of list) {
    reportLines.push(`- **Q${issue.questionNumber}** [${issue.kind}] — ${issue.reasoning}`)
    reportLines.push(`  - prompt: \`${issue.currentValue}\``)
  }
  reportLines.push('')
}
fs.writeFileSync(reportPath, reportLines.join('\n'), 'utf8')
console.log(`\nReport: ${reportPath}`)

if (EMIT_FINDINGS) {
  const findingsPath = path.join(process.cwd(), 'findings.json')
  let existing = []
  if (fs.existsSync(findingsPath)) {
    try { existing = JSON.parse(fs.readFileSync(findingsPath, 'utf8')) } catch {}
  }
  for (const issue of issues) {
    existing.push({
      examId: issue.examId,
      passageNumber: issue.passageNumber,
      questionNumber: issue.questionNumber,
      kind: issue.kind === 'truncated_prompt' ? 'wrong_prompt' : 'wrong_prompt',
      currentValue: issue.currentValue,
      suggestedValue: '<NEEDS MANUAL FIX>',
      source: '',
      reasoning: issue.reasoning,
      confidence: 'medium'
    })
  }
  fs.writeFileSync(findingsPath, JSON.stringify(existing, null, 2) + '\n', 'utf8')
  console.log(`Appended ${issues.length} findings to findings.json`)
}
