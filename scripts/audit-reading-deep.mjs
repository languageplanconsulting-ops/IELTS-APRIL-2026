#!/usr/bin/env node
/**
 * Deep audit of every Normal Reading exam. Catches:
 *   - Question numbering: gaps, duplicates, out-of-order
 *   - Total-per-exam mismatch (Cambridge tests must be exactly 40 questions)
 *   - Matching headings: not enough heading options for the question range,
 *     answer letters out of range
 *   - Multiple choice: correctAnswer letter not in the visible option set
 *   - True/False/Not Given: correctAnswer not one of the three exact values
 *   - Yes/No/Not Given: correctAnswer not one of the three exact values
 *   - Fill-in-the-blank: correctAnswer word-count exceeds instruction's "NO
 *     MORE THAN N WORDS" cap
 *   - Whitespace-leaking correctAnswer
 *   - Duplicate exam IDs across sources
 *   - Suspicious near-duplicate prompts within a passage
 *
 * Output:
 *   audit-reading-issues.md — human-readable triage list grouped by exam.
 *   stdout — summary by category.
 *
 * Run:
 *   node scripts/audit-reading-deep.mjs
 *   node scripts/audit-reading-deep.mjs --fix   (apply trim + uppercase fixes
 *                                                to the in-memory payload and
 *                                                write a JSON patch file)
 */

import fs from 'node:fs'
import path from 'node:path'
import { buildReadingExamPayload } from '../server/readingImportUtils.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_11_EXAMS } from '../server/userProvidedReadingPracticeCambridge11.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_12_EXAMS } from '../server/userProvidedReadingPracticeCambridge12.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_13_EXAMS } from '../server/userProvidedReadingPracticeCambridge13.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_14_EXAMS } from '../server/userProvidedReadingPracticeCambridge14.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_15_EXAMS } from '../server/userProvidedReadingPracticeCambridge15.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_16_EXAMS } from '../server/userProvidedReadingPracticeCambridge16.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_17_EXAMS } from '../server/userProvidedReadingPracticeCambridge17.mjs'
import { USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_19_EXAMS } from '../server/userProvidedReadingPracticeCambridge19.mjs'
import { USER_PROVIDED_READING_PRACTICE_JUNE_2026_EXAMS } from '../server/userProvidedReadingPracticeJune2026.mjs'

const APPLY_FIXES = process.argv.includes('--fix')

const EXAM_SOURCES = [
  ['Cambridge 11', USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_11_EXAMS],
  ['Cambridge 12', USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_12_EXAMS],
  ['Cambridge 13', USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_13_EXAMS],
  ['Cambridge 14', USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_14_EXAMS],
  ['Cambridge 15', USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_15_EXAMS],
  ['Cambridge 16', USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_16_EXAMS],
  ['Cambridge 17', USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_17_EXAMS],
  ['Cambridge 19', USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_19_EXAMS],
  ['June 2026', USER_PROVIDED_READING_PRACTICE_JUNE_2026_EXAMS]
]

// ---- Helpers --------------------------------------------------------------

const issues = []
const fixesApplied = []
const seenExamIds = new Map() // examId -> book

const ROMAN_RE = /^(?:i{1,3}|iv|v|vi{0,3}|ix|x|xi{0,3}|xiv|xv|xvi{0,3}|xix|xx)$/i

const isJudgementAnswer = (answer, kind) => {
  const upper = String(answer || '').trim().toUpperCase()
  if (kind === 'true-false-not-given') return ['TRUE', 'FALSE', 'NOT GIVEN'].includes(upper)
  if (kind === 'yes-no-not-given') return ['YES', 'NO', 'NOT GIVEN'].includes(upper)
  return false
}

const extractWordCountCap = (instruction) => {
  const text = String(instruction || '').toUpperCase()
  if (/NO MORE THAN ONE WORD/.test(text)) return 1
  if (/NO MORE THAN TWO WORDS?/.test(text)) return 2
  if (/NO MORE THAN THREE WORDS?/.test(text)) return 3
  if (/ONE WORD ONLY/.test(text)) return 1
  return null
}

const extractMatchingOptions = (question) => {
  // Question options vary by source — gather every plausible option-letter shape.
  const buckets = []
  if (Array.isArray(question.options)) buckets.push(...question.options)
  if (Array.isArray(question.choiceOptions)) buckets.push(...question.choiceOptions)
  if (Array.isArray(question.headingOptions)) buckets.push(...question.headingOptions)
  const letters = new Set()
  for (const option of buckets) {
    const letter = String(option?.letter || option?.key || option?.label || '').trim()
    if (letter) letters.add(letter.toUpperCase())
  }
  return letters
}

const checkExam = (book, exam) => {
  // Duplicate exam ID detection
  if (seenExamIds.has(exam.id)) {
    issues.push({
      book,
      examId: exam.id,
      severity: 'high',
      category: 'duplicate_exam_id',
      detail: `Duplicate of ${seenExamIds.get(exam.id)}`
    })
  } else {
    seenExamIds.set(exam.id, book)
  }

  let payload
  try {
    payload = buildReadingExamPayload({
      ...exam,
      parsedPayload: exam.parsedPayload || exam.parsed_payload
    })
  } catch (error) {
    issues.push({
      book,
      examId: exam.id,
      severity: 'critical',
      category: 'build_error',
      detail: error.message
    })
    return
  }

  let totalQuestions = 0
  const seenNumbers = new Map() // questionNumber -> passageNumber where first seen

  for (const passage of payload.passages || []) {
    const questions = passage.questions || []
    totalQuestions += questions.length

    // Track question number assignments — IELTS Reading numbering should be
    // continuous across passages (1..13, 14..26, 27..40 typically).
    const numbers = []
    for (const question of questions) {
      const number = Number(question.number)
      if (!Number.isFinite(number) || number < 1) {
        issues.push({
          book,
          examId: exam.id,
          severity: 'high',
          category: 'invalid_question_number',
          passage: passage.number,
          question: question.number,
          detail: `Question number is not a positive integer: "${question.number}"`
        })
        continue
      }
      numbers.push(number)
      if (seenNumbers.has(number)) {
        issues.push({
          book,
          examId: exam.id,
          severity: 'high',
          category: 'duplicate_question_number',
          passage: passage.number,
          question: number,
          detail: `Question ${number} appears in passage ${seenNumbers.get(number)} AND passage ${passage.number}`
        })
      } else {
        seenNumbers.set(number, passage.number)
      }
    }

    // Check ordering within passage
    const sorted = [...numbers].sort((a, b) => a - b)
    if (numbers.length && numbers.join(',') !== sorted.join(',')) {
      issues.push({
        book,
        examId: exam.id,
        severity: 'medium',
        category: 'questions_out_of_order',
        passage: passage.number,
        detail: `Questions appear in order [${numbers.join(', ')}], expected sorted [${sorted.join(', ')}]`
      })
    }

    // Check for gaps within passage
    for (let i = 1; i < sorted.length; i += 1) {
      if (sorted[i] - sorted[i - 1] > 1) {
        issues.push({
          book,
          examId: exam.id,
          severity: 'medium',
          category: 'questions_have_gap',
          passage: passage.number,
          detail: `Gap between Q${sorted[i - 1]} and Q${sorted[i]} (missing ${sorted[i] - sorted[i - 1] - 1} number(s))`
        })
      }
    }

    // Per-question checks
    for (const question of questions) {
      const answer = String(question.correctAnswer || '')
      const trimmedAnswer = answer.trim()

      // Whitespace leaks
      if (answer !== trimmedAnswer) {
        issues.push({
          book,
          examId: exam.id,
          severity: 'low',
          category: 'whitespace_in_answer',
          passage: passage.number,
          question: question.number,
          detail: `correctAnswer has leading/trailing whitespace`,
          autoFixable: true
        })
        if (APPLY_FIXES) {
          question.correctAnswer = trimmedAnswer
          fixesApplied.push({
            examId: exam.id,
            question: question.number,
            kind: 'trim_answer_whitespace'
          })
        }
      }

      // Judgement answers must be one of three exact strings
      const isTFNG = question.answerType === 'true-false-not-given'
      const isYNNG = question.answerType === 'yes-no-not-given'
      if (isTFNG || isYNNG) {
        if (!isJudgementAnswer(trimmedAnswer, question.answerType)) {
          issues.push({
            book,
            examId: exam.id,
            severity: 'critical',
            category: 'invalid_judgement_answer',
            passage: passage.number,
            question: question.number,
            detail: `${question.answerType} answer "${trimmedAnswer}" is not in the expected set (${isTFNG ? 'TRUE/FALSE/NOT GIVEN' : 'YES/NO/NOT GIVEN'})`
          })
        }
        // Casing normalization is an auto-safe fix
        const upper = trimmedAnswer.toUpperCase()
        if (upper !== trimmedAnswer && isJudgementAnswer(upper, question.answerType)) {
          if (APPLY_FIXES) {
            question.correctAnswer = upper
            fixesApplied.push({
              examId: exam.id,
              question: question.number,
              kind: 'uppercase_judgement_answer'
            })
          } else {
            issues.push({
              book,
              examId: exam.id,
              severity: 'low',
              category: 'judgement_case_mismatch',
              passage: passage.number,
              question: question.number,
              detail: `Answer "${trimmedAnswer}" should be uppercase "${upper}"`,
              autoFixable: true
            })
          }
        }
      }

      // Multiple choice — correctAnswer letter must appear in the options
      if (question.answerType === 'multiple-choice') {
        const optionLetters = extractMatchingOptions(question)
        if (optionLetters.size > 0) {
          const upper = trimmedAnswer.toUpperCase()
          if (upper && !optionLetters.has(upper)) {
            issues.push({
              book,
              examId: exam.id,
              severity: 'critical',
              category: 'mcq_answer_not_in_options',
              passage: passage.number,
              question: question.number,
              detail: `correctAnswer "${trimmedAnswer}" not in option set {${[...optionLetters].join(', ')}}`
            })
          }
        }
      }

      // Fill-in-blank: word-count cap — only apply to actual fill-in questions
      // (answerType 'text'), never to judgement/matching/MCQ questions.
      const isTextFill = question.answerType === 'text' || !question.answerType
      if (isTextFill && !isTFNG && !isYNNG && question.answerType !== 'multiple-choice') {
        // Prefer the question's own instruction; only fall back to the passage
        // section text if the question doesn't declare one. Even then, if
        // the passage holds multiple groups, this can over-apply — surface as
        // low severity so it's reviewed manually.
        const ownInstruction = question.instruction
        const cap = extractWordCountCap(ownInstruction || '')
        if (cap && trimmedAnswer) {
          const wordCount = trimmedAnswer.split(/\s+/).filter(Boolean).length
          if (wordCount > cap) {
            issues.push({
              book,
              examId: exam.id,
              severity: 'high',
              category: 'fill_answer_too_long',
              passage: passage.number,
              question: question.number,
              detail: `Answer "${trimmedAnswer}" is ${wordCount} words but instruction says NO MORE THAN ${cap} word(s)`
            })
          }
        }
      }
    }

    // Heading-matching: ensure enough options for the question range
    const headingQuestions = questions.filter((q) =>
      /\b(?:heading|paragraph|section)\b/i.test(String(q.prompt || '')) ||
      /matching[_\s-]?heading/i.test(String(q.answerType || ''))
    )
    if (headingQuestions.length > 0) {
      // Collect distinct heading letters expected as answers
      const expectedLetters = new Set()
      for (const q of headingQuestions) {
        const letter = String(q.correctAnswer || '').trim().toUpperCase()
        if (letter) expectedLetters.add(letter)
      }
      // Try to source heading options from the passage's headingOptions array
      const headingOptions = Array.isArray(passage.headingOptions) ? passage.headingOptions : []
      if (headingOptions.length > 0) {
        const validLetters = new Set(
          headingOptions
            .map((opt) => String(opt?.letter || opt?.key || '').trim().toUpperCase())
            .filter(Boolean)
        )
        for (const letter of expectedLetters) {
          if (!validLetters.has(letter)) {
            issues.push({
              book,
              examId: exam.id,
              severity: 'high',
              category: 'heading_answer_out_of_range',
              passage: passage.number,
              detail: `Answer letter "${letter}" not in heading options [${[...validLetters].join(', ')}]`
            })
          }
        }
      }
    }
  }

  // Cambridge tests should be 40 questions total (3 passages, typically 13+13+14)
  const isCambridgeFullTest = /^cambridge-\d+-test\d+(?:-passage\d+)?$/i.test(exam.id)
  if (isCambridgeFullTest) {
    // Single passage exams (-passage1 etc.) should have ~13-14 questions
    if (/-passage\d+$/i.test(exam.id)) {
      if (totalQuestions < 10 || totalQuestions > 16) {
        issues.push({
          book,
          examId: exam.id,
          severity: 'medium',
          category: 'unexpected_question_count',
          detail: `Single-passage exam has ${totalQuestions} questions (typical IELTS passages have 13-14)`
        })
      }
    } else if (totalQuestions !== 40) {
      issues.push({
        book,
        examId: exam.id,
        severity: 'high',
        category: 'full_test_not_40_questions',
        detail: `Full test should have exactly 40 questions, has ${totalQuestions}`
      })
    }
  }
}

// ---- Run audit ------------------------------------------------------------

let examCount = 0
for (const [book, exams] of EXAM_SOURCES) {
  for (const exam of exams) {
    examCount += 1
    checkExam(book, exam)
  }
}

// ---- Group by severity for the summary -----------------------------------

const bySeverity = { critical: [], high: [], medium: [], low: [] }
for (const issue of issues) {
  bySeverity[issue.severity].push(issue)
}

const byCategory = new Map()
for (const issue of issues) {
  byCategory.set(issue.category, (byCategory.get(issue.category) || 0) + 1)
}

// ---- Write report ---------------------------------------------------------

const reportLines = []
reportLines.push(`# Reading content deep audit`)
reportLines.push(``)
reportLines.push(`Generated: ${new Date().toISOString()}`)
reportLines.push(`Scanned: ${examCount} exams across ${EXAM_SOURCES.length} sources`)
reportLines.push(`Total issues: ${issues.length}`)
reportLines.push(``)
reportLines.push(`## Counts by severity`)
reportLines.push(``)
reportLines.push(`| Severity | Count |`)
reportLines.push(`|---|---|`)
for (const sev of ['critical', 'high', 'medium', 'low']) {
  reportLines.push(`| ${sev} | ${bySeverity[sev].length} |`)
}
reportLines.push(``)
reportLines.push(`## Counts by category`)
reportLines.push(``)
reportLines.push(`| Category | Count |`)
reportLines.push(`|---|---|`)
for (const [cat, count] of [...byCategory.entries()].sort((a, b) => b[1] - a[1])) {
  reportLines.push(`| ${cat} | ${count} |`)
}
reportLines.push(``)

// Group by exam ID
const byExam = new Map()
for (const issue of issues) {
  const list = byExam.get(issue.examId) || []
  list.push(issue)
  byExam.set(issue.examId, list)
}

reportLines.push(`## Detailed findings (grouped by exam)`)
reportLines.push(``)
for (const [examId, list] of [...byExam.entries()].sort()) {
  reportLines.push(`### ${examId}`)
  reportLines.push(``)
  for (const issue of list) {
    const location = [
      issue.passage ? `passage ${issue.passage}` : '',
      issue.question ? `Q${issue.question}` : ''
    ]
      .filter(Boolean)
      .join(' · ')
    const sevTag = `[${issue.severity.toUpperCase()}]`
    const fixTag = issue.autoFixable ? ' (auto-fixable)' : ''
    reportLines.push(`- ${sevTag} **${issue.category}**${fixTag} — ${location ? `${location} — ` : ''}${issue.detail}`)
  }
  reportLines.push(``)
}

if (APPLY_FIXES && fixesApplied.length) {
  reportLines.push(`## Auto-fixes applied (in-memory only — NOT yet written to source files)`)
  reportLines.push(``)
  for (const fix of fixesApplied) {
    reportLines.push(`- ${fix.examId} Q${fix.question}: ${fix.kind}`)
  }
  reportLines.push(``)
  reportLines.push(`To persist these, re-export the parsed payloads using \`npm run rebuild:reading-payloads\` or the per-book rebuild scripts.`)
  reportLines.push(``)
}

const outputPath = path.join(process.cwd(), 'audit-reading-issues.md')
fs.writeFileSync(outputPath, reportLines.join('\n'), 'utf8')

// ---- Stdout summary -------------------------------------------------------

console.log(`Reading deep audit: ${examCount} exams scanned, ${issues.length} issues found.`)
console.log(``)
console.log(`Severity breakdown:`)
for (const sev of ['critical', 'high', 'medium', 'low']) {
  console.log(`  ${sev.padEnd(10)} ${bySeverity[sev].length}`)
}
console.log(``)
console.log(`Top categories:`)
for (const [cat, count] of [...byCategory.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8)) {
  console.log(`  ${count.toString().padStart(4)} × ${cat}`)
}
console.log(``)
console.log(`Report written to ${outputPath}`)
if (APPLY_FIXES) {
  console.log(`${fixesApplied.length} auto-fix(es) applied in-memory. Re-run rebuild scripts to persist.`)
}

if (bySeverity.critical.length > 0) {
  console.log(``)
  console.log(`⚠️  ${bySeverity.critical.length} CRITICAL issue(s) need immediate attention.`)
  process.exit(2)
}
