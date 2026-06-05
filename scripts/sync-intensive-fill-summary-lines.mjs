#!/usr/bin/env node
/**
 * Sync journey fill-blank override summaryLines from intensive passage prompts
 * (Cambridge question stems), not passage evidence sentences.
 *
 * Run: npx tsx scripts/sync-intensive-fill-summary-lines.mjs
 * Use --write to apply changes to override source files.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildIntensiveJourneyExam } from '../src/readingJourney.ts'
import { INTENSIVE_JOURNEY_FILL_BLANK_SETS } from '../src/intensiveJourneyFillBlankSets.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const writeMode = process.argv.includes('--write')

/** Sets with hand-crafted structure (notes headings, tables, timelines) — do not auto-sync. */
const PRESERVE_KEYS = new Set([
  'journey-normal-stage-6|1|8-13', // Cambridge table — hand-crafted
  'journey-normal-stage-6|2|22-25', // Cambridge notes — hand-crafted
  'journey-normal-stage-7|1|1-6', // Cambridge notes with section headings
  'journey-normal-stage-7|2|19-23', // Stadiums summary — hand-crafted
  'journey-normal-stage-11|1|1-7', // Summary + comparison table
  'journey-normal-stage-18|1|8-13', // Timeline notes
  'journey-normal-stage-19|1|1-5', // Huarango table part 1
  'journey-normal-stage-19|1|6-8', // Huarango notes part 2
])

const setKey = (set) => `${set.examId}|${set.passageNumber}|${set.startNumber}-${set.endNumber}`

const cleanPrompt = (prompt) =>
  String(prompt || '')
    .replace(/^\d+\.\s*/, '')
    .replace(/^Complete the summary\s*[—–-]\s*\d+\s*/i, '')
    .trim()

const promptToLine = (prompt, number) => {
  let text = cleanPrompt(prompt)
  // "The 1  …" or "2  …" numbered blanks in notes
  text = text.replace(new RegExp(`\\b${number}\\s*[.．…⋯]+`, 'g'), `{${number}} `)
  text = text.replace(/[.．…⋯]{2,}|…+/g, ` {${number}} `)
  text = text.replace(/_{2,}/g, ` {${number}} `)
  text = text.replace(/\s+/g, ' ').trim()
  text = text.replace(new RegExp(`(\\{${number}\\}\\s*)+`, 'g'), `{${number}} `).trim()
  if (!text.includes(`{${number}}`)) {
    text = `${text} {${number}}`.trim()
  }
  return text
}

const isNotesInstruction = (instructions) =>
  (instructions || []).some((line) => /complete the notes/i.test(line))

const isTableStylePrompt = (prompt) => {
  const t = cleanPrompt(prompt)
  if (/^[\w\s]{3,30}:\s/i.test(t)) return true
  if (t.length < 55 && !/[.!?]$/.test(t)) return true
  return false
}

const buildSummaryLines = (set, questions, isNotes) => {
  const lines = []
  let paraBuffer = []

  const flushPara = () => {
    if (!paraBuffer.length) return
    lines.push({ type: 'para', text: paraBuffer.join(' ') })
    paraBuffer = []
  }

  for (const q of questions) {
    const lineText = promptToLine(q.prompt, q.number)
    const useBullet = isNotes || isTableStylePrompt(q.prompt)

    if (useBullet) {
      flushPara()
      lines.push({ type: 'bullet', text: lineText })
    } else if (lineText.length > 120 && questions.length <= 4) {
      flushPara()
      lines.push({ type: 'para', text: lineText })
    } else if (questions.length >= 5 && lineText.length < 100) {
      flushPara()
      lines.push({ type: 'bullet', text: lineText })
    } else {
      paraBuffer.push(lineText)
    }
  }
  flushPara()
  return lines
}

const linesEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b)

const norm = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const words = (s) => norm(s).split(' ').filter((w) => w.length > 3)

const wordOverlap = (a, b) => {
  const bs = new Set(words(b))
  const aw = words(a)
  if (!aw.length) return 0
  return aw.filter((w) => bs.has(w)).length / aw.length
}

/** Only rewrite sets where summary lines look like passage evidence, not Cambridge prompts. */
const setNeedsEvidenceFix = (set, questions) => {
  const summaryText = set.summaryLines.map((l) => l.text || '').join(' ')
  let suspectCount = 0
  for (const q of questions) {
    const line =
      set.summaryLines.find((l) => (l.text || '').includes(`{${q.number}}`))?.text ||
      summaryText
    const lineText = line.replace(/\{\d+\}/g, '___')
    const promptScore = wordOverlap(lineText, q.prompt)
    const evidenceScore = wordOverlap(lineText, q.exactPortion || '')
    if (lineText.length > 55 && evidenceScore > 0.42 && promptScore < 0.28) {
      suspectCount += 1
    }
  }
  return suspectCount >= Math.max(1, Math.ceil(questions.length * 0.34))
}

const changes = []

for (const set of INTENSIVE_JOURNEY_FILL_BLANK_SETS) {
  const key = setKey(set)
  if (PRESERVE_KEYS.has(key)) continue

  const stageMatch = set.examId.match(/journey-normal-stage-(\d+)/)
  if (!stageMatch) continue
  const stage = Number(stageMatch[1])
  if (stage > 17) continue // stages 18–20 merged pool — keep hand-crafted

  const exam = buildIntensiveJourneyExam(stage)
  if (!exam) continue
  const passage = exam.parsedPayload.passages.find((p) => p.number === set.passageNumber)
  if (!passage) continue

  const questions = passage.questions.filter(
    (q) =>
      q.answerType === 'text' &&
      q.number >= set.startNumber &&
      q.number <= set.endNumber
  )
  if (questions.length !== set.endNumber - set.startNumber + 1) continue

  if (!setNeedsEvidenceFix(set, questions)) continue

  const isNotes = isNotesInstruction(set.instructions)
  const newLines = buildSummaryLines(set, questions, isNotes)
  if (!linesEqual(set.summaryLines, newLines)) {
    changes.push({
      key,
      examId: set.examId,
      passageNumber: set.passageNumber,
      startNumber: set.startNumber,
      endNumber: set.endNumber,
      summaryTitle: set.summaryTitle,
      oldLines: set.summaryLines,
      newLines
    })
  }
}

console.log(`Found ${changes.length} override set(s) to sync from Cambridge prompts.\n`)

for (const change of changes) {
  console.log(`${change.examId} P${change.passageNumber} Q${change.startNumber}-${change.endNumber} — ${change.summaryTitle}`)
  console.log('  OLD:', change.oldLines.map((l) => l.text).join(' | ').slice(0, 120))
  console.log('  NEW:', change.newLines.map((l) => l.text).join(' | ').slice(0, 120))
  console.log()
}

if (!writeMode) {
  console.log('Dry run. Pass --write to apply changes.')
  process.exit(0)
}

if (!changes.length) {
  console.log('Nothing to write.')
  process.exit(0)
}

// Apply in memory then rewrite the three source files by string replacement per set.
const sourceFiles = [
  'src/intensiveJourneyFillBlankStages1to5.ts',
  'src/intensiveJourneyFillBlankStages6to17.ts',
  'src/intensiveJourneyFillBlankStages18to20.ts'
]

const formatSummaryLines = (lines) =>
  lines
    .map((line) => {
      const escaped = line.text.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
      return `      { type: "${line.type}", text: "${escaped}" }`
    })
    .join(',\n')

let applied = 0
for (const relPath of sourceFiles) {
  const absPath = path.join(root, relPath)
  let content = fs.readFileSync(absPath, 'utf8')

  for (const change of changes) {
    const examMarker = `examId: "${change.examId}"`
    const altMarker = `examId: '${change.examId}'`
    const marker = content.includes(examMarker) ? examMarker : altMarker
    const startIdx = content.indexOf(marker)
    if (startIdx === -1) continue

    const passageNeedle = `passageNumber: ${change.passageNumber}`
    const passageIdx = content.indexOf(passageNeedle, startIdx)
    if (passageIdx === -1 || passageIdx - startIdx > 400) continue

    const startNumNeedle = `startNumber: ${change.startNumber}`
    const startNumIdx = content.indexOf(startNumNeedle, passageIdx)
    if (startNumIdx === -1 || startNumIdx - passageIdx > 200) continue

    const summaryLinesStart = content.indexOf('summaryLines: [', startNumIdx)
    if (summaryLinesStart === -1) continue
    const summaryLinesEnd = content.indexOf('\n    ],', summaryLinesStart)
    if (summaryLinesEnd === -1) continue

    const replacement = `summaryLines: [\n${formatSummaryLines(change.newLines)},\n    ]`
    content =
      content.slice(0, summaryLinesStart) + replacement + content.slice(summaryLinesEnd + '\n    ],'.length)
    applied += 1
  }

  fs.writeFileSync(absPath, content)
}

console.log(`Applied ${applied} summaryLines update(s).`)
