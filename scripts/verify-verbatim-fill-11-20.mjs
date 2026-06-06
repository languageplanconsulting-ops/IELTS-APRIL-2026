#!/usr/bin/env node
/**
 * Strict check: every summary line for journey stages 11-20 must match Cambridge/ITO source stems.
 * Flags paraphrased, truncated, or AI-fabricated text.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { INTENSIVE_JOURNEY_FILL_BLANK_SETS } from '../src/intensiveJourneyFillBlankSets.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const STAGE_SOURCES = {
  11: ['cambridge-18-test1-passage1', 'cambridge-18-test1-passage2'],
  12: ['cambridge-18-test2-passage1', 'cambridge-18-test2-passage2'],
  13: ['cambridge-16-test2-passage1', 'cambridge-16-test2-passage2'],
  14: ['cambridge-16-test3-passage1', 'cambridge-16-test3-passage2'],
  15: ['cambridge-16-test4-passage1', 'cambridge-16-test4-passage2'],
  16: ['cambridge-18-test3-passage1', 'cambridge-18-test3-passage2'],
  17: ['cambridge-18-test4-passage1', 'cambridge-18-test4-passage2'],
  18: ['cambridge-18-test3-passage1', null],
  19: ['cambridge-18-test4-passage1', 'cambridge-11-test2-passage1'],
  20: ['cambridge-19-test1-passage1', 'cambridge-15-test3-passage2']
}

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

const tokenSim = (a, b) => {
  const aw = norm(a).split(' ').filter((w) => w.length > 2 && w !== '___')
  const bs = new Set(norm(b).split(' ').filter((w) => w.length > 2 && w !== '___'))
  if (!aw.length) return 1
  return aw.filter((w) => bs.has(w)).length / aw.length
}

const remapBlanks = (text, delta) =>
  String(text || '').replace(/\b(\d{1,2})\s*[.…⋯]+/g, (_, n) => `{${Number(n) + delta}}`)

const loadSourceBlock = (srcId, set) => {
  const setCount = set.endNumber - set.startNumber + 1
  for (const key of Object.keys(MANUAL)) {
    if (!key.startsWith(srcId + '|')) continue
    const [, range] = key.split('|')
    const [rs, re] = range.split('-').map(Number)
    if (re - rs + 1 !== setCount) continue
    const delta = set.startNumber - rs
    return remapBlanks(MANUAL[key], delta)
  }
  return resolveTxt(srcId)
}

const issues = []
let checked = 0

for (const set of INTENSIVE_JOURNEY_FILL_BLANK_SETS) {
  const sm = set.examId.match(/journey-normal-stage-(\d+)/)
  if (!sm) continue
  const stage = Number(sm[1])
  if (stage < 11 || stage > 20) continue

  const srcId = STAGE_SOURCES[stage]?.[set.passageNumber - 1]
  if (!srcId) continue

  let sourceBlock = loadSourceBlock(srcId, set)

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
    if (!ol || /^(history|how the bluestones got there|purpose|stage 1|stage 2|stage 3)$/i.test(ol)) continue
    if (!/\{\d+\}/.test(ol)) {
      if (norm(ol).length > 12 && tokenSim(ol, sourceBlock) < 0.85) {
        issues.push({ label, type: 'CONTEXT_NOT_IN_SOURCE', line: ol.slice(0, 90), sim: Math.round(tokenSim(ol, sourceBlock) * 100) })
      }
      continue
    }
    const stem = ol.replace(/\{\d+\}/g, '___')
    const lineSims = sourceBlock
      .split('\n')
      .filter((l) => l.trim().length > 8)
      .map((l) => tokenSim(stem, l))
    const stemSim = Math.max(tokenSim(stem, sourceBlock), ...(lineSims.length ? lineSims : [0]))
    if (stemSim < 0.72) {
      issues.push({ label, type: 'STEM_MISMATCH', line: ol.slice(0, 100), sim: Math.round(stemSim * 100) })
    }
  }

  const joined = [set.summaryTitle || '', ...overrideLines].join(' ')
  if (/\banother theory\b/i.test(joined) || /\bwicker baskets on rails\b/i.test(joined)) {
    issues.push({ label, type: 'AI_PARAPHRASE', detail: 'Stonehenge Q4 uses AI theory/basket wording' })
  }
  if (/\bto use wood in modern construction\b/i.test(joined) && !/making buildings with wood/i.test(joined)) {
    issues.push({ label, type: 'AI_PARAPHRASE', detail: 'Paraphrased materials summary — use Cambridge Making buildings with wood block' })
  }
  if (/\benvironments that are suitable for wildlife\b/i.test(joined)) {
    issues.push({ label, type: 'AI_PARAPHRASE', detail: 'Paraphrased green roofs summary — use Cambridge verbatim' })
  }
  if (/\bfewer than \{26\} cars were produced before the company went out of business\b/i.test(joined)) {
    issues.push({ label, type: 'AI_PARAPHRASE', detail: 'Paraphrased steam car Q26' })
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
console.log('\nAll stages 11-20: no AI/auto-generated stem issues detected.')
