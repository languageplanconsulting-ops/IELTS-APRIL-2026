/**
 * Derive best exactHints per question by scoring candidate quotes.
 * Run: node scripts/derive-cambridge-19-hint-overrides.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { keys } from './cambridge-19-reading-keys.mjs'
import {
  buildHints,
  findQuote,
  significantWords,
  getParagraphText
} from './cambridge-19-enrichment-builder.mjs'
import { CAMBRIDGE_19_TEST4_ENRICHMENTS } from './cambridge-19-test4-enrichments.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const passageDir = path.join(__dirname, 'cambridge-19-passages')

const specs = [
  { test: 1, passage: 1, key: 't1p1' },
  { test: 1, passage: 2, key: 't1p2' },
  { test: 1, passage: 3, key: 't1p3' },
  { test: 2, passage: 1, key: 't2p1' },
  { test: 2, passage: 2, key: 't2p2' },
  { test: 2, passage: 3, key: 't2p3' },
  { test: 3, passage: 1, key: 't3p1' },
  { test: 3, passage: 2, key: 't3p2' },
  { test: 3, passage: 3, key: 't3p3' },
  { test: 4, passage: 1, key: 't4p1' },
  { test: 4, passage: 2, key: 't4p2' },
  { test: 4, passage: 3, key: 't4p3' }
]

const NEG_MARKERS = ['not', 'never', 'yet', 'however', 'but', 'unlikely', 'without', 'instead', 'rejected', 'denied']

const scoreQuote = (quote, prompt, answer) => {
  const q = quote.toLowerCase()
  const pw = significantWords(prompt, 4)
  let score = pw.filter((w) => q.includes(w)).length * 3
  const a = String(answer).toLowerCase()
  if (a.length > 2 && !/^(true|false|yes|no|not given)$/.test(a) && q.includes(a)) score += 5
  if (a === 'false' || a === 'no') {
    score += NEG_MARKERS.filter((w) => q.includes(w)).length * 2
  }
  if (a === 'true' || a === 'yes') {
    score -= NEG_MARKERS.filter((w) => q.includes(w)).length
  }
  if (a === 'not given') {
    score -= NEG_MARKERS.filter((w) => q.includes(w)).length * 0.5
  }
  return score
}

const candidateHintSets = (prompt, answer, body) => {
  const ref = prompt.match(/reference to (.+)/i)?.[1]
  const pw = significantWords(prompt, 5)
  const refw = ref ? significantWords(ref, 4) : []
  const names = [...prompt.matchAll(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})\b/g)].map((m) =>
    m[1].toLowerCase()
  )
  const sets = [
    buildHints(prompt, answer, body),
    [...refw, ...names].join('|'),
    [...refw, 'rejected', 'denial'].filter(Boolean).join('|'),
    [...pw, ...names].join('|'),
    refw.join('|'),
    pw.join('|'),
    String(answer).toLowerCase()
  ]
  return [...new Set(sets.filter(Boolean))]
}

const hintOverrides = {}

for (const { test, passage, key } of specs) {
  const body = fs.readFileSync(path.join(passageDir, `${key}.txt`), 'utf8').trim()
  for (const row of keys[key]) {
    const [n, prompt, answer] = row
    const id = `${test}-${passage}-${n}`
    const hand = CAMBRIDGE_19_TEST4_ENRICHMENTS[id]
    if (hand?.exactHints) {
      hintOverrides[id] = hand.exactHints
      continue
    }
    let best = { score: -1, hints: buildHints(prompt, answer, body), quote: '' }
    for (const hints of candidateHintSets(prompt, answer, body)) {
      const quote = findQuote(body, hints, answer, prompt)
      const score = scoreQuote(quote, prompt, answer)
      if (score > best.score) best = { score, hints, quote }
    }
    hintOverrides[id] = best.hints
  }
}

const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")

const out = path.join(__dirname, 'cambridge-19-hint-overrides.mjs')
const lines = [
  '/** Auto-derived search hints for passage evidence (Cambridge 19, all tests) */',
  'export const CAMBRIDGE_19_HINT_OVERRIDES = {',
  ...Object.entries(hintOverrides).map(([k, v]) => `  '${k}': '${esc(v)}',`),
  '}',
  ''
]
fs.writeFileSync(out, lines.join('\n'), 'utf8')
console.log(`Wrote ${Object.keys(hintOverrides).length} hint overrides to ${out}`)
