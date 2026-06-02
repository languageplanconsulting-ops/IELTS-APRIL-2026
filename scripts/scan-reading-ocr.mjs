#!/usr/bin/env node
/**
 * Mechanical OCR pattern scanner. Detects obvious character-level errors in
 * every Reading passage WITHOUT needing web verification — fast, no API cost.
 * Outputs medium-confidence findings to findings.json that the apply script
 * can act on.
 *
 * Detects:
 *  - U+FFFD replacement char (�) in middle of words
 *  - Soft hyphen U+00AD followed by space (line-break artifacts)
 *  - Common digit-for-letter substitutions: 9→a, 0→o, 1→l in known words
 *  - µ→u substitutions
 *  - Internal space in short common words ("Th e", "g ondolas", "co mpa ny")
 *  - Period without following space ("farming.It", "passage.The")
 *  - Run-together sentences (lowercase followed directly by capital after period)
 *  - Specific known OCR corruptions seen in the corpus (worid→world, etc.)
 *
 * Run: node scripts/scan-reading-ocr.mjs
 * With --append: merges findings into existing findings.json
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

const APPEND = process.argv.includes('--append')

const EXAM_SOURCES = [
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

const findings = []

// Known direct substitutions seen in the corpus (high confidence)
const KNOWN_FIXES = [
  // Hyphenation artifacts (soft hyphen + space)
  { pattern: /([a-z])­ ([a-z])/g, replace: '$1-$2', kind: 'passage_ocr', reason: 'soft-hyphen line-break artifact' },
  // Soft hyphen alone (no space) inside word — drop it
  { pattern: /([a-z])­([a-z])/g, replace: '$1$2', kind: 'passage_ocr', reason: 'soft-hyphen artifact' },
  // Replacement character
  { pattern: /�/g, replace: '?', kind: 'passage_ocr', reason: 'OCR replacement character (manual fix required)' },
  // Specific known word corruptions
  { pattern: /\bworid\b/g, replace: 'world', kind: 'passage_ocr', reason: "OCR: 'worid' → 'world'" },
  { pattern: /\bWorid\b/g, replace: 'World', kind: 'passage_ocr', reason: "OCR: 'Worid' → 'World'" },
  { pattern: /\benoµgh\b/g, replace: 'enough', kind: 'passage_ocr', reason: "OCR: µ → u in 'enough'" },
  { pattern: /\bgre9tly\b/g, replace: 'greatly', kind: 'passage_ocr', reason: "OCR: 9 → a in 'greatly'" },
  { pattern: /\bAriwna\b/g, replace: 'Arizona', kind: 'passage_ocr', reason: "OCR: 'Ariwna' → 'Arizona'" },
  // Internal-space artifacts
  { pattern: /\bTh e\b/g, replace: 'The', kind: 'passage_ocr', reason: "OCR space in 'Th e'" },
  { pattern: /\bth e\b/g, replace: 'the', kind: 'passage_ocr', reason: "OCR space in 'th e'" },
  { pattern: /\bg ondola/g, replace: 'gondola', kind: 'passage_ocr', reason: "OCR space in 'g ondola'" },
  // Trailing-hyphen-space (food- bearing → food-bearing)
  { pattern: /([a-z])- ([a-z])/g, replace: '$1-$2', kind: 'passage_ocr', reason: 'broken hyphenation across line break' },
  // Run-together period+capital ("farming.It" → "farming. It")
  { pattern: /([a-z])\.([A-Z][a-z])/g, replace: '$1. $2', kind: 'passage_ocr', reason: 'missing space after sentence period' }
]

// Replacement-character contexts where we can guess from context.
const CONTEXT_FIXES = [
  { context: /\b�eople\b/g, replace: 'people', kind: 'passage_ocr', reason: "OCR: '�eople' → 'people'" },
  { context: /\b�orld\b/g, replace: 'world', kind: 'passage_ocr', reason: "OCR: '�orld' → 'world'" }
]

const escapeForJsonString = (value) =>
  JSON.stringify(String(value)).slice(1, -1) // remove surrounding quotes; preserves escapes

const recordFinding = ({ examId, passageNumber, before, after, kind, reason, confidence = 'medium' }) => {
  findings.push({
    examId,
    passageNumber,
    questionNumber: null,
    kind,
    currentValue: before,
    suggestedValue: after,
    source: '',
    reasoning: reason,
    confidence
  })
}

const scanString = (examId, passageNumber, text) => {
  const seen = new Set()
  for (const fix of CONTEXT_FIXES) {
    let match
    fix.context.lastIndex = 0
    while ((match = fix.context.exec(text)) !== null) {
      const before = match[0]
      if (seen.has(`${before}@${match.index}`)) continue
      seen.add(`${before}@${match.index}`)
      recordFinding({ examId, passageNumber, before, after: fix.replace, kind: fix.kind, reason: fix.reason, confidence: 'high' })
    }
  }
  for (const fix of KNOWN_FIXES) {
    let match
    fix.pattern.lastIndex = 0
    while ((match = fix.pattern.exec(text)) !== null) {
      const before = match[0]
      // Build the replacement string by running the replace on JUST the match
      const after = before.replace(new RegExp(fix.pattern.source.replace(/[gmi]/g, '')), fix.replace)
      if (before === after) continue
      const key = `${before}@${match.index}@${fix.reason}`
      if (seen.has(key)) continue
      seen.add(key)
      // Bare `?` from replacement-char rule is medium confidence (needs review)
      const conf = before.includes('�') ? 'low' : 'medium'
      recordFinding({ examId, passageNumber, before, after, kind: fix.kind, reason: fix.reason, confidence: conf })
    }
  }
}

let scannedPassages = 0

for (const examList of EXAM_SOURCES) {
  for (const exam of examList) {
    const payload = exam.parsedPayload || exam.parsed_payload
    if (!payload?.passages) continue
    for (const passage of payload.passages) {
      scannedPassages += 1
      const paragraphs = passage.bodyParagraphs || []
      for (const paragraph of paragraphs) {
        scanString(exam.id, passage.number, paragraph)
      }
      // Also scan questionSectionText since users see it
      if (passage.questionSectionText) {
        scanString(exam.id, passage.number, passage.questionSectionText)
      }
      // Question prompts
      for (const question of passage.questions || []) {
        scanString(exam.id, passage.number, question.prompt || '')
      }
    }
  }
}

// Dedupe by (examId, currentValue) — same OCR fix in multiple paragraphs
// becomes one finding (apply script handles single-occurrence requirement).
const dedupedKeys = new Set()
const deduped = []
for (const f of findings) {
  const key = `${f.examId}::${f.currentValue}::${f.suggestedValue}`
  if (dedupedKeys.has(key)) continue
  dedupedKeys.add(key)
  deduped.push(f)
}

const findingsPath = path.join(process.cwd(), 'findings.json')
let existing = []
if (APPEND && fs.existsSync(findingsPath)) {
  try {
    existing = JSON.parse(fs.readFileSync(findingsPath, 'utf8'))
    if (!Array.isArray(existing)) existing = []
  } catch {
    existing = []
  }
}

// Merge: skip any existing finding that matches (examId, currentValue, suggestedValue)
const existingKeys = new Set(
  existing.map((f) => `${f.examId}::${f.currentValue}::${f.suggestedValue}`)
)
const fresh = deduped.filter((f) => !existingKeys.has(`${f.examId}::${f.currentValue}::${f.suggestedValue}`))

const combined = APPEND ? [...existing, ...fresh] : deduped
fs.writeFileSync(findingsPath, JSON.stringify(combined, null, 2) + '\n', 'utf8')

const byKind = new Map()
const byConf = new Map()
for (const f of deduped) {
  byKind.set(f.kind, (byKind.get(f.kind) || 0) + 1)
  byConf.set(f.confidence, (byConf.get(f.confidence) || 0) + 1)
}

console.log(`Scanned ${scannedPassages} passages.`)
console.log(`Found ${deduped.length} mechanical OCR findings (${fresh.length} new${APPEND ? `, ${existing.length} pre-existing` : ''}).`)
console.log('')
console.log('By kind:')
for (const [k, n] of byKind) console.log(`  ${n.toString().padStart(4)} × ${k}`)
console.log('')
console.log('By confidence:')
for (const [c, n] of byConf) console.log(`  ${n.toString().padStart(4)} × ${c}`)
console.log('')
console.log(`Written to ${findingsPath}`)
console.log(`Next: review with \`cat findings.json | jq '.[] | select(.confidence == "high")'\``)
console.log(`      apply with \`npm run apply:reading-fixes -- --dry-run\``)
