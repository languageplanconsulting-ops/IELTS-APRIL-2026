#!/usr/bin/env node
/**
 * Fix paragraph structure in Normal Reading passages. Two problems addressed:
 *
 * 1. REDUNDANT LETTER PARAGRAPHS
 *    Many passages contain pairs like:
 *      ["A", "A. Looked at in one way...", "B", "B. First, implicit theories..."]
 *    The standalone "A", "B" rows are just labels that duplicate the leading
 *    letter already present in the actual content paragraph. They render as
 *    awkward single-letter rows. Drop them.
 *
 * 2. MERGED LETTERED PARAGRAPHS
 *    The LAST paragraph in some passages contains multiple paragraphs (e.g.
 *    G, H, I) mashed into one giant blob — typically because the PDF extractor
 *    didn't see a paragraph break before the next letter marker. Split on
 *    " <Letter> <Capital>" patterns inside the blob.
 *
 * Modifies parsedPayload.passages[*].bodyParagraphs in-place inside each
 * source .mjs file. Backs up each file before writing.
 *
 * Run: node scripts/fix-reading-passage-paragraphs.mjs
 *      node scripts/fix-reading-passage-paragraphs.mjs --dry-run
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

// ────────────────────────────────────────────────────────────────────────────
// Step 1 — parse + transform the in-memory array, then re-emit JSON in place.

// We can't easily eval the .mjs source. Instead we operate on the JSON
// substrings — each passage stores bodyParagraphs as a JSON array literal,
// which we can find, parse, transform, and re-emit.

// Regex to find each `"bodyParagraphs": [ ... ]` array literal inside a file.
// Handles multi-line JSON arrays with escaped quotes.
const findBodyParagraphsRanges = (content) => {
  const ranges = []
  const marker = '"bodyParagraphs":'
  let cursor = 0
  while (true) {
    const i = content.indexOf(marker, cursor)
    if (i < 0) break
    // Find the opening '[' after the marker (skipping whitespace)
    let j = i + marker.length
    while (j < content.length && /\s/.test(content[j])) j += 1
    if (content[j] !== '[') {
      cursor = i + marker.length
      continue
    }
    // Bracket-match to find the closing ']' (handling nested quotes/escapes)
    let depth = 1
    let k = j + 1
    let inStr = false
    let escape = false
    while (k < content.length && depth > 0) {
      const ch = content[k]
      if (escape) {
        escape = false
      } else if (ch === '\\') {
        escape = true
      } else if (ch === '"') {
        inStr = !inStr
      } else if (!inStr) {
        if (ch === '[') depth += 1
        else if (ch === ']') depth -= 1
      }
      k += 1
    }
    if (depth === 0) {
      ranges.push({ start: j, end: k }) // inclusive of '[' to inclusive of ']'
      cursor = k
    } else {
      break
    }
  }
  return ranges
}

// ── Transformations on the parsed paragraph array ──────────────────────────

const isSingleLetterLabel = (paragraph) => /^\s*[A-J]\s*$/.test(String(paragraph))

const stripRedundantLetterParagraphs = (paragraphs) => {
  const cleaned = []
  let stripped = 0
  for (let i = 0; i < paragraphs.length; i += 1) {
    const current = String(paragraphs[i] || '')
    const next = String(paragraphs[i + 1] || '')
    if (isSingleLetterLabel(current)) {
      const letter = current.trim().toUpperCase()
      // If next paragraph starts with the same letter (followed by . or space),
      // the current standalone is redundant — drop it.
      const nextStartsWithSameLetter = new RegExp(`^\\s*${letter}[\\.\\s]`).test(next)
      if (nextStartsWithSameLetter) {
        stripped += 1
        continue
      }
    }
    cleaned.push(current)
  }
  return { paragraphs: cleaned, stripped }
}

// Split overlong paragraphs where an internal letter marker (" H Some...",
// " I Some...", " J Some...") indicates a missing paragraph break. We only
// look for letters H–Z to avoid false positives like "A common..." or "I have".
const splitOnInlineLetterMarkers = (paragraph) => {
  const text = String(paragraph || '')
  if (text.length < 1200) return [text]
  // Pattern: end-of-sentence punctuation (.?!”’') optionally followed by close
  // quote, then space + letter (H-Z) + space + Capital word.
  const splits = []
  let lastIndex = 0
  const re = /([.!?][”’'\"]?)\s+([H-Z])\s+([A-Z][a-z])/g
  let match
  while ((match = re.exec(text)) !== null) {
    const splitAt = match.index + match[1].length
    // Don't split if it would create a chunk under 200 chars from last split
    if (splitAt - lastIndex < 200) continue
    splits.push(text.slice(lastIndex, splitAt))
    lastIndex = splitAt + 1 // skip the space
  }
  if (splits.length === 0) return [text]
  splits.push(text.slice(lastIndex))
  return splits.map((s) => s.trim()).filter(Boolean)
}

const splitMergedLetteredParagraphs = (paragraphs) => {
  const out = []
  let totalSplits = 0
  for (const para of paragraphs) {
    const parts = splitOnInlineLetterMarkers(para)
    if (parts.length > 1) {
      totalSplits += parts.length - 1
      for (const part of parts) out.push(part)
    } else {
      out.push(para)
    }
  }
  return { paragraphs: out, totalSplits }
}

// ── Top-level transformation ───────────────────────────────────────────────

const transformParagraphsArray = (jsonArray) => {
  let paragraphs
  try {
    paragraphs = JSON.parse(jsonArray)
  } catch {
    return null
  }
  if (!Array.isArray(paragraphs)) return null

  // Skip if the passage has no lettered structure (no "A"/"A." markers).
  const looksLettered = paragraphs.some(
    (p) => /^\s*[A-J]\s*$/.test(p) || /^\s*[A-J]\.\s/.test(p)
  )
  if (!looksLettered) return null

  const step1 = stripRedundantLetterParagraphs(paragraphs)
  const step2 = splitMergedLetteredParagraphs(step1.paragraphs)

  if (step1.stripped === 0 && step2.totalSplits === 0) return null

  return {
    paragraphs: step2.paragraphs,
    stripped: step1.stripped,
    split: step2.totalSplits
  }
}

// ────────────────────────────────────────────────────────────────────────────

let totalStripped = 0
let totalSplit = 0
let filesChanged = 0

for (const file of FILES) {
  const abs = path.join(process.cwd(), file)
  if (!fs.existsSync(abs)) continue
  let content = fs.readFileSync(abs, 'utf8')
  const original = content
  let fileStripped = 0
  let fileSplit = 0
  let fileChangesCount = 0

  const ranges = findBodyParagraphsRanges(content)
  // Process from end to start so prior indices remain valid
  for (const range of ranges.reverse()) {
    const arrLiteral = content.slice(range.start, range.end)
    const result = transformParagraphsArray(arrLiteral)
    if (!result) continue
    const newLiteral = JSON.stringify(result.paragraphs, null, 14)
      // The original arrays in source files use 14-space indentation; trying
      // to match it isn't critical because we're writing valid JSON.
    content = content.slice(0, range.start) + newLiteral + content.slice(range.end)
    fileStripped += result.stripped
    fileSplit += result.split
    fileChangesCount += 1
  }

  if (content !== original) {
    filesChanged += 1
    totalStripped += fileStripped
    totalSplit += fileSplit
    if (!DRY_RUN) {
      const backup = `${abs}.bak-paragraphs-${Date.now()}`
      fs.writeFileSync(backup, original, 'utf8')
      fs.writeFileSync(abs, content, 'utf8')
      console.log(`✓ ${file} — ${fileChangesCount} passage(s), stripped ${fileStripped}, split ${fileSplit} (backup ${path.basename(backup)})`)
    } else {
      console.log(`✓ ${file} — ${fileChangesCount} passage(s), would strip ${fileStripped}, split ${fileSplit} (DRY RUN)`)
    }
  } else {
    console.log(`- ${file} — no changes`)
  }
}

console.log('')
console.log(DRY_RUN ? '=== DRY RUN ===' : '=== Applied ===')
console.log(`Files changed: ${filesChanged}/${FILES.length}`)
console.log(`Single-letter paragraphs stripped: ${totalStripped}`)
console.log(`Merged paragraphs split: ${totalSplit}`)
