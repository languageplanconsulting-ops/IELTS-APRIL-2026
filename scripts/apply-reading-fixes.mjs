#!/usr/bin/env node
/**
 * Apply confidence=high findings.json entries to the Reading source files.
 *
 * Reads ./findings.json (produced by the /audit-reading Claude Code command),
 * filters to high-confidence entries, backs up each source file, and applies
 * the changes. Medium/low findings are logged but not applied.
 *
 * Run: node scripts/apply-reading-fixes.mjs
 *      node scripts/apply-reading-fixes.mjs --dry-run    (preview, no writes)
 *      node scripts/apply-reading-fixes.mjs --include-medium  (also apply medium)
 *
 * The source files (server/userProvidedReadingPracticeCambridge*.mjs) are
 * standard JS files exporting one big array. We edit them as text using
 * substring search-and-replace based on the `currentValue` from each finding.
 * Each replacement happens at the exam-id scope so we don't touch the wrong
 * passage by accident.
 */

import fs from 'node:fs'
import path from 'node:path'

const DRY_RUN = process.argv.includes('--dry-run')
const INCLUDE_MEDIUM = process.argv.includes('--include-medium')

const findingsPath = path.join(process.cwd(), 'findings.json')
if (!fs.existsSync(findingsPath)) {
  console.error('findings.json not found. Run /audit-reading in Claude Code first.')
  process.exit(1)
}
const findings = JSON.parse(fs.readFileSync(findingsPath, 'utf8'))
if (!Array.isArray(findings)) {
  console.error('findings.json must be a JSON array.')
  process.exit(1)
}

const examIdToFile = {
  'cambridge-11': 'server/userProvidedReadingPracticeCambridge11.mjs',
  'cambridge-12': 'server/userProvidedReadingPracticeCambridge12.mjs',
  'cambridge-13': 'server/userProvidedReadingPracticeCambridge13.mjs',
  'cambridge-14': 'server/userProvidedReadingPracticeCambridge14.mjs',
  'cambridge-15': 'server/userProvidedReadingPracticeCambridge15.mjs',
  'cambridge-16': 'server/userProvidedReadingPracticeCambridge16.mjs',
  'cambridge-17': 'server/userProvidedReadingPracticeCambridge17.mjs',
  'cambridge-19': 'server/userProvidedReadingPracticeCambridge19.mjs',
  'june-2026': 'server/userProvidedReadingPracticeJune2026.mjs'
}

const findSourceFile = (examId) => {
  const prefix = Object.keys(examIdToFile).find((key) => examId.startsWith(key))
  return prefix ? examIdToFile[prefix] : null
}

// Group findings by file
const fileToFindings = new Map()
for (const finding of findings) {
  const acceptedConfidence = INCLUDE_MEDIUM ? ['high', 'medium'] : ['high']
  if (!acceptedConfidence.includes(finding.confidence)) continue
  const file = findSourceFile(finding.examId)
  if (!file) {
    console.warn(`Skipping unknown exam id ${finding.examId}`)
    continue
  }
  const list = fileToFindings.get(file) || []
  list.push(finding)
  fileToFindings.set(file, list)
}

if (fileToFindings.size === 0) {
  console.log('No high-confidence findings to apply.')
  process.exit(0)
}

// Apply edits. For each finding we look for `currentValue` inside the exam's
// JSON block (delimited by "id": "<examId>"  ...  "id": "<next exam id>"
// or end of file) and replace with `suggestedValue`. We only apply if the
// substring appears EXACTLY ONCE in that exam block — otherwise we punt and
// log it for manual review.

const findExamBounds = (content, examId) => {
  const opener = `"id": "${examId}"`
  const startIndex = content.indexOf(opener)
  if (startIndex < 0) return null
  // Find the next "id": entry or end of file
  const remainder = content.slice(startIndex + opener.length)
  const nextIdMatch = remainder.match(/"id":\s*"[^"]+"/)
  const endIndex = nextIdMatch
    ? startIndex + opener.length + nextIdMatch.index
    : content.length
  return { start: startIndex, end: endIndex }
}

const summary = { applied: 0, skipped: 0, byFile: new Map(), skipReasons: [] }

for (const [file, list] of fileToFindings) {
  const fullPath = path.join(process.cwd(), file)
  if (!fs.existsSync(fullPath)) {
    console.warn(`Source file missing: ${file}`)
    summary.skipped += list.length
    continue
  }
  let content = fs.readFileSync(fullPath, 'utf8')

  // Backup once per file
  if (!DRY_RUN) {
    const backupPath = `${fullPath}.bak-${Date.now()}`
    fs.writeFileSync(backupPath, content, 'utf8')
    console.log(`Backed up to ${path.basename(backupPath)}`)
  }

  let appliedInFile = 0
  for (const finding of list) {
    const bounds = findExamBounds(content, finding.examId)
    if (!bounds) {
      summary.skipped += 1
      summary.skipReasons.push(`${finding.examId} not found in ${file}`)
      continue
    }
    const examBlock = content.slice(bounds.start, bounds.end)

    // Escape for JSON-string-safe matching. The source stores text in JSON
    // strings, so we encode the search string the same way the file does.
    const current = JSON.stringify(finding.currentValue || '').slice(1, -1)
    const suggested = JSON.stringify(finding.suggestedValue || '').slice(1, -1)
    if (!current) {
      summary.skipped += 1
      summary.skipReasons.push(`${finding.examId} Q${finding.questionNumber || '?'} — empty currentValue`)
      continue
    }
    const occurrences = examBlock.split(current).length - 1
    if (occurrences === 0) {
      summary.skipped += 1
      summary.skipReasons.push(
        `${finding.examId} Q${finding.questionNumber || '?'} — currentValue not found in source. (Maybe whitespace differs, or already fixed?)`
      )
      continue
    }
    if (occurrences > 1) {
      summary.skipped += 1
      summary.skipReasons.push(
        `${finding.examId} Q${finding.questionNumber || '?'} — currentValue is ambiguous (matches ${occurrences} times). Resolve manually.`
      )
      continue
    }
    const replacedExamBlock = examBlock.replace(current, suggested)
    content = content.slice(0, bounds.start) + replacedExamBlock + content.slice(bounds.end)
    appliedInFile += 1
    summary.applied += 1
  }

  summary.byFile.set(file, appliedInFile)
  if (!DRY_RUN && appliedInFile > 0) {
    fs.writeFileSync(fullPath, content, 'utf8')
  }
}

console.log('')
console.log(DRY_RUN ? '=== DRY RUN — no files were modified ===' : '=== Applied ===')
console.log(`Findings considered: ${findings.length}`)
console.log(`Applied: ${summary.applied}`)
console.log(`Skipped: ${summary.skipped}`)
if (summary.byFile.size) {
  console.log('')
  console.log('By file:')
  for (const [file, count] of summary.byFile) {
    console.log(`  ${count.toString().padStart(4)} × ${file}`)
  }
}
if (summary.skipReasons.length) {
  console.log('')
  console.log('Skipped reasons (manual review needed):')
  for (const reason of summary.skipReasons.slice(0, 20)) {
    console.log(`  - ${reason}`)
  }
  if (summary.skipReasons.length > 20) {
    console.log(`  ... and ${summary.skipReasons.length - 20} more`)
  }
}
console.log('')
if (!DRY_RUN && summary.applied > 0) {
  console.log('Next: re-run the dev server / rebuild payloads, run npm run audit:reading-deep, then test in the app.')
}
