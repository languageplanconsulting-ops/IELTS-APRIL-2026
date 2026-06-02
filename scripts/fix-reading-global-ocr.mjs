#!/usr/bin/env node
/**
 * Targeted regex-based OCR fixes that are too pattern-y for the
 * substring-based apply-reading-fixes script. Applies a small set of
 * universally-safe patterns to every Reading source file.
 *
 * Patterns:
 *   /([a-z])\.([A-Z][a-z])/g → "$1. $2"
 *      missing space after a sentence-ending period (608+ occurrences)
 *   /([a-z])­ ([a-z])/g  → "$1-$2"
 *      soft-hyphen + space line-break artifact ("Single­ storey" → "Single-storey")
 *   /([a-z])­([a-z])/g   → "$1$2"
 *      bare soft hyphen inside a word ("non­edible" → "nonedible")
 *   /([a-z])- ([a-z])/g  → "$1-$2"
 *      hyphen + space artifact ("food- bearing" → "food-bearing")
 *
 * Backs up each source file before writing.
 *
 * Run: node scripts/fix-reading-global-ocr.mjs           (writes)
 *      node scripts/fix-reading-global-ocr.mjs --dry-run (preview)
 */

import fs from 'node:fs'
import path from 'node:path'

const DRY_RUN = process.argv.includes('--dry-run')

const FILES = [
  'server/userProvidedReadingPracticeCambridge11.mjs',
  'server/userProvidedReadingPracticeCambridge12.mjs',
  'server/userProvidedReadingPracticeCambridge13.mjs',
  'server/userProvidedReadingPracticeCambridge14.mjs',
  'server/userProvidedReadingPracticeCambridge15.mjs',
  'server/userProvidedReadingPracticeCambridge16.mjs',
  'server/userProvidedReadingPracticeCambridge17.mjs',
  'server/userProvidedReadingPracticeCambridge19.mjs',
  'server/userProvidedReadingPracticeJune2026.mjs'
]

// These regexes operate on the JSON-stringified passage body inside the .mjs
// source files. We only edit positions INSIDE JSON string literals — the
// patterns we use never match the JSON syntax characters themselves.
const PATTERNS = [
  {
    name: 'missing space after period',
    regex: /([a-z])\.([A-Z][a-z])/g,
    replace: '$1. $2'
  },
  {
    name: 'soft-hyphen + space line break',
    regex: /([a-z])­\s+([a-z])/g,
    replace: '$1-$2'
  },
  {
    name: 'bare soft hyphen in word',
    regex: /([a-z])­([a-z])/g,
    replace: '$1$2'
  },
  {
    name: 'hyphen + space line break',
    regex: /([a-z])- ([a-z])/g,
    replace: '$1-$2'
  }
]

let totalFixesPerPattern = new Map()
let filesChanged = 0

for (const relPath of FILES) {
  const absPath = path.join(process.cwd(), relPath)
  if (!fs.existsSync(absPath)) {
    console.warn(`Skipping missing: ${relPath}`)
    continue
  }
  let content = fs.readFileSync(absPath, 'utf8')
  const original = content
  const perFileCounts = []

  for (const pattern of PATTERNS) {
    const matches = content.match(pattern.regex)
    const count = matches ? matches.length : 0
    if (count > 0) {
      content = content.replace(pattern.regex, pattern.replace)
      perFileCounts.push(`${count} × ${pattern.name}`)
      totalFixesPerPattern.set(
        pattern.name,
        (totalFixesPerPattern.get(pattern.name) || 0) + count
      )
    }
  }

  if (content !== original) {
    filesChanged += 1
    if (!DRY_RUN) {
      const backupPath = `${absPath}.bak-globalocr-${Date.now()}`
      fs.writeFileSync(backupPath, original, 'utf8')
      fs.writeFileSync(absPath, content, 'utf8')
      console.log(`✓ ${relPath} — ${perFileCounts.join(', ')}`)
      console.log(`  (backup: ${path.basename(backupPath)})`)
    } else {
      console.log(`✓ ${relPath} — ${perFileCounts.join(', ')} (DRY RUN)`)
    }
  } else {
    console.log(`- ${relPath} — no matches`)
  }
}

console.log('')
console.log(DRY_RUN ? '=== DRY RUN — no files modified ===' : '=== Applied ===')
console.log(`Files changed: ${filesChanged}/${FILES.length}`)
console.log('Fixes per pattern:')
for (const [name, count] of totalFixesPerPattern) {
  console.log(`  ${count.toString().padStart(5)} × ${name}`)
}
const grandTotal = [...totalFixesPerPattern.values()].reduce((a, b) => a + b, 0)
console.log(`  ${grandTotal.toString().padStart(5)} × total`)
console.log('')
if (!DRY_RUN && grandTotal > 0) {
  console.log('Next: npm run audit:reading-deep   # verify structure is still clean')
  console.log('      npm run audit:reading-deep   # re-scan should now find 0 OCR issues for these patterns')
}
