#!/usr/bin/env node
/**
 * Strict check: every summary line for journey stages 1-10 must match Cambridge/ITO source stems.
 * Flags paraphrased, truncated, or AI-fabricated text.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { INTENSIVE_JOURNEY_FILL_BLANK_SETS } from '../src/intensiveJourneyFillBlankSets.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const STAGE_SOURCES = {
  1: ['cambridge-10-test1-passage1', 'cambridge-10-test1-passage2'],
  2: ['cambridge-10-test2-passage1', 'cambridge-10-test2-passage2'],
  3: ['cambridge-10-test3-passage1', 'cambridge-10-test3-passage2'],
  4: ['cambridge-10-test4-passage1', 'cambridge-10-test4-passage2'],
  5: ['cambridge-11-test1-passage1', 'cambridge-11-test1-passage2'],
  6: ['cambridge-16-test1-passage1', 'cambridge-16-test1-passage2'],
  7: ['cambridge-17-test1-passage1', 'cambridge-17-test1-passage2'],
  8: ['cambridge-17-test2-passage1', 'cambridge-17-test2-passage2'],
  9: ['cambridge-17-test3-passage1', 'cambridge-17-test3-passage2'],
  10: ['cambridge-17-test4-passage1', 'cambridge-17-test4-passage2']
}

// Import MANUAL_SOURCE from audit script
const auditPath = path.join(__dirname, 'audit-journey-fill-vs-source.mjs')
const auditSrc = fs.readFileSync(auditPath, 'utf8')
const manualBlock = auditSrc.match(/const MANUAL_SOURCE_FILL = \{([\s\S]*?)\n\}/)?.[1] || ''
const MANUAL = {}
for (const m of manualBlock.matchAll(/'([^']+)': `([\s\S]*?)`/g)) {
  MANUAL[m[1]] = m[2].trim()
}

const norm = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/[\u2018\u2019\u201c\u201d]/g, "'")
    .replace(/\{(\d+)\}/g, ' ___ ')
    .replace(/\d+\s*[.…⋯]+/g, ' ___ ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const lineText = (line) => {
  if (line.type === 'table-header' || line.type === 'table-row') return (line.cells || []).join(' | ')
  if (line.type === 'diagram') return ''
  return line.text || ''
}

const resolveTxt = (examId) => {
  const m = examId.match(/^cambridge-(\d+)-test(\d+)-passage(\d+)$/)
  if (!m) return ''
  const fp = path.join(__dirname, `cambridge-${m[1]}-questions`, `t${m[2]}p${m[3]}.txt`)
  return fs.existsSync(fp) ? fs.readFileSync(fp, 'utf8') : ''
}

const extractSourceLines = (block, startNum, endNum) => {
  const lines = []
  const body = block.split(/Write your answers in boxes[^.]+\./i).pop() || block
  for (const raw of body.split('\n')) {
    const line = raw.trim()
    if (!line || /^questions?\s/i.test(line) || /^complete the/i.test(line) || /^choose/i.test(line)) continue
    if (/^(true|false|not given)/i.test(line)) continue
    if (line.length < 4) continue
    // Numbered sentence lines e.g. "11 In Greece..."
    const numMatch = line.match(/^(\d+)\s+(.+)/)
    if (numMatch && Number(numMatch[1]) >= startNum && Number(numMatch[1]) <= endNum) {
      lines.push(numMatch[2].replace(/\d+\s*[.…⋯]+/g, ' ___ '))
      continue
    }
    // Bullet / table lines with blanks
    if (/…|\.{3,}|_{2,}|\{?\d+\}?/.test(line) || /___/.test(norm(line))) {
      lines.push(line.replace(/^[•\-*]\s*/, '').replace(/\d+\s*[.…⋯]+/g, ' ___ '))
    }
  }
  return lines
}

const tokenSim = (a, b) => {
  const aw = norm(a).split(' ').filter((w) => w.length > 2 && w !== '___')
  const bs = new Set(norm(b).split(' ').filter((w) => w.length > 2 && w !== '___'))
  if (!aw.length) return 1
  return aw.filter((w) => bs.has(w)).length / aw.length
}

const issues = []
let checked = 0

for (const set of INTENSIVE_JOURNEY_FILL_BLANK_SETS) {
  const sm = set.examId.match(/journey-normal-stage-(\d+)/)
  if (!sm) continue
  const stage = Number(sm[1])
  if (stage > 10) continue

  const srcId = STAGE_SOURCES[stage]?.[set.passageNumber - 1]
  if (!srcId) continue

  const delta = set.startNumber // rough — manual keys use source numbers
  const manualKey = Object.keys(MANUAL).find((k) => k.startsWith(srcId + '|'))
  let sourceBlock = manualKey ? MANUAL[manualKey] : resolveTxt(srcId)

  // Try exact range manual key via common remaps
  for (const key of Object.keys(MANUAL)) {
    if (!key.startsWith(srcId)) continue
    const [, range] = key.split('|')
    const [rs, re] = range.split('-').map(Number)
    if (rs <= set.startNumber && re >= set.endNumber) {
      sourceBlock = MANUAL[key]
      break
    }
  }

  const overrideLines = (set.summaryLines || [])
    .filter((l) => l.type !== 'table-header' && l.type !== 'diagram')
    .map(lineText)
    .filter(Boolean)

  const label = `stage ${stage} P${set.passageNumber} Q${set.startNumber}-${set.endNumber}`
  checked++

  if (!sourceBlock) {
    issues.push({ label, type: 'NO_SOURCE', detail: srcId })
    continue
  }

  const sourceNorm = norm(sourceBlock)
  const overrideNorm = norm([set.summaryTitle, ...overrideLines, ...(set.instructions || [])].join(' '))
  const overall = tokenSim(overrideNorm, sourceNorm)

  for (const line of set.summaryLines || []) {
    if (line.type === 'table-header' || line.type === 'diagram') continue
    const ol = lineText(line)
    if (!ol || /^(the problem|the proposed solution|the construction|discovery|the scrolls|appearance and behaviour|decline and extinction)$/i.test(ol)) continue
    if (!/\{\d+\}/.test(ol) && !/\{/.test(ol)) {
      if (norm(ol).length > 12 && tokenSim(ol, sourceBlock) < 0.85) {
        issues.push({ label, type: 'CONTEXT_NOT_IN_SOURCE', line: ol.slice(0, 90), sim: Math.round(tokenSim(ol, sourceBlock) * 100) })
      }
      continue
    }
    const stem = ol.replace(/\{\d+\}/g, '___')
    if (tokenSim(stem, sourceBlock) < 0.72) {
      issues.push({ label, type: 'STEM_MISMATCH', line: ol.slice(0, 100), sim: Math.round(tokenSim(stem, sourceBlock) * 100) })
    }
  }

  const joined = overrideLines.join(' ')
  if (/\b750 metres long and 40 metres wide\b/i.test(joined)) {
    issues.push({ label, type: 'AI_DIMENSIONS', detail: '750 metres fabricated in question stem' })
  }
  if (/\bWTTC suggest\b/i.test(joined)) {
    issues.push({ label, type: 'AI_WRONG_ENTITY', detail: 'WTTC in tourism Q12 — should be Hawkins and Ritchie' })
  }
  if (/\bdevelopment of the london underground\b/i.test(joined)) {
    issues.push({ label, type: 'AI_WRONG_TITLE', detail: 'Wrong London underground title' })
  }
  if (/\bthree times \{26\}/i.test(joined) || /\bthree times \{\d+\\}/.test(joined)) {
    if (!/its original/i.test(joined)) {
      issues.push({ label, type: 'TRUNCATED_STEM', detail: 'Tomato Q26 missing "its original"' })
    }
  }

  const status = overall >= 0.55 ? 'OK' : 'LOW_OVERLAP'
  console.log(`${status.padEnd(12)} ${label} (${Math.round(overall * 100)}% source overlap) "${set.summaryTitle || '(no title)'}"`)
}

console.log(`\nChecked ${checked} sets`)
if (issues.length) {
  console.log(`\n=== ${issues.length} ISSUES ===`)
  for (const i of issues) {
    console.log(`[${i.type}] ${i.label}`)
    if (i.line) console.log(`  line: ${i.line}… (${i.sim}%)`)
    if (i.detail) console.log(`  ${i.detail}`)
  }
  process.exit(1)
}
console.log('\nAll stages 1-10: no AI/auto-generated stem issues detected.')
