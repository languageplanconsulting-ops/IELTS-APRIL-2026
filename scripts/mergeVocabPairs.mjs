// Merge generated word-level `pairs` into the existing vocab-bridge registry
// and re-render src/readingPassage3VocabBridge.ts — preserving every existing
// questionPhrase / passagePhrase / keyVocab value byte-for-byte and only adding
// the new `pairs` array per question.
//
// Inputs:
//   scripts/.passage3-extract/existing-bridges.json   (from dumpVocabBridges.mjs)
//   scripts/.passage3-pairs/<slug>.json               (from the pairs workflow)
//                                                       { answerGroup, questions:[{number,pairs}] }
// Effect: rewrites the registry block in src/readingPassage3VocabBridge.ts.
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const extractDir = join(here, '.passage3-extract')
const pairsDir = join(here, '.passage3-pairs')
const tsPath = join(here, '..', 'src', 'readingPassage3VocabBridge.ts')

const existing = JSON.parse(readFileSync(join(extractDir, 'existing-bridges.json'), 'utf8'))

// Normalised passage text per group, to verify each pair.p is grounded verbatim.
const slugify = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
const norm = (s) => String(s).toLowerCase().replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, '-').replace(/\s+/g, ' ').trim()
const passageTextByGroup = {}
for (const group of Object.keys(existing)) {
  try {
    const src = JSON.parse(readFileSync(join(extractDir, `${slugify(group)}.json`), 'utf8'))
    passageTextByGroup[group] = norm([...(src.bodyParagraphs || []), src.questionSectionText || ''].join(' '))
  } catch {
    passageTextByGroup[group] = ''
  }
}
const ungrounded = []

// ── load pairs keyed by answerGroup -> number -> pairs[]
const pairsByGroup = {}
let pairFiles = 0
if (existsSync(pairsDir)) {
  for (const f of readdirSync(pairsDir).filter((n) => n.endsWith('.json'))) {
    const data = JSON.parse(readFileSync(join(pairsDir, f), 'utf8'))
    if (!data || !data.answerGroup || !Array.isArray(data.questions)) continue
    pairFiles++
    const byNum = (pairsByGroup[data.answerGroup] = pairsByGroup[data.answerGroup] || {})
    for (const q of data.questions) {
      if (q && typeof q.number === 'number' && Array.isArray(q.pairs)) byNum[q.number] = q.pairs
    }
  }
}

// ── attach pairs (do NOT touch any other field)
let attached = 0
const problems = []
for (const [group, byNumber] of Object.entries(existing)) {
  for (const [numStr, bridge] of Object.entries(byNumber)) {
    const num = Number(numStr)
    const pairs = pairsByGroup[group]?.[num]
    if (!pairs || !pairs.length) {
      problems.push(`${group} #${num}: no pairs`)
      continue
    }
    const clean = pairs
      .filter((p) => p && p.q && p.p && p.th)
      .map((p) => ({ q: String(p.q), p: String(p.p), th: String(p.th), ...(p.note ? { note: String(p.note) } : {}) }))
    if (!clean.length) {
      problems.push(`${group} #${num}: pairs empty after clean`)
      continue
    }
    const text = passageTextByGroup[group] || ''
    for (const p of clean) {
      if (text && !text.includes(norm(p.p))) ungrounded.push(`${group} #${num}: p not verbatim -> "${p.p}"`)
    }
    bridge.pairs = clean
    attached++
  }
}

// ── render TS
const tsString = (s) => JSON.stringify(String(s))
const renderPhrase = (p) => `{ en: ${tsString(p.en)}, th: ${tsString(p.th)} }`
const renderPair = (p) => {
  const parts = [`q: ${tsString(p.q)}`, `p: ${tsString(p.p)}`, `th: ${tsString(p.th)}`]
  if (p.note) parts.push(`note: ${tsString(p.note)}`)
  return `{ ${parts.join(', ')} }`
}
const renderKeyVocab = (kv) => {
  const kvp = [`word: ${tsString(kv.word)}`, `th: ${tsString(kv.th)}`]
  if (kv.contrastA) kvp.push(`contrastA: ${tsString(kv.contrastA)}`)
  if (kv.contrastB) kvp.push(`contrastB: ${tsString(kv.contrastB)}`)
  if (kv.note) kvp.push(`note: ${tsString(kv.note)}`)
  return `{ ${kvp.join(', ')} }`
}
const renderBridge = (b) => {
  const lines = []
  lines.push(`        questionPhrase: ${renderPhrase(b.questionPhrase)},`)
  lines.push(`        passagePhrase: ${renderPhrase(b.passagePhrase)},`)
  if (b.pairs && b.pairs.length) {
    lines.push(`        pairs: [`)
    for (const p of b.pairs) lines.push(`          ${renderPair(p)},`)
    lines.push(`        ],`)
  }
  if (b.keyVocab) {
    lines.push(`        keyVocab: ${renderKeyVocab(b.keyVocab)}`)
  } else {
    lines[lines.length - 1] = lines[lines.length - 1].replace(/,$/, '')
  }
  return lines.join('\n')
}

let body = 'const READING_VOCAB_BRIDGE_BY_GROUP: Record<string, Record<number, ReadingVocabBridge>> = {\n'
for (const group of Object.keys(existing)) {
  body += `  ${tsString(group)}: {\n`
  const nums = Object.keys(existing[group]).map(Number).sort((a, b) => a - b)
  for (const n of nums) body += `    ${n}: {\n${renderBridge(existing[group][n])}\n    },\n`
  body += `  },\n`
}
body += '}\n'

// ── splice into the TS file
let src = readFileSync(tsPath, 'utf8')
const startAnchor = 'const CAMBRIDGE_15_TEST_1_PASSAGE_3'
const endAnchor = '\n// Flattened lookup by'
const startIdx = src.indexOf(startAnchor)
const endIdx = src.indexOf(endAnchor)
if (startIdx === -1 || endIdx === -1) {
  console.error('FATAL: could not locate registry anchors')
  process.exit(1)
}
const next = src.slice(0, startIdx) + body + src.slice(endIdx + 1) // drop the leading \n before comment
writeFileSync(tsPath, next)

console.error(`pair files: ${pairFiles} | questions with pairs attached: ${attached}/560`)
if (problems.length) {
  console.error(`MISSING PAIRS (${problems.length}):`)
  for (const p of problems.slice(0, 40)) console.error('  - ' + p)
}
console.error(`Ungrounded passage terms (p not a verbatim substring): ${ungrounded.length}`)
for (const u of ungrounded.slice(0, 60)) console.error('  ! ' + u)
