// Assemble per-passage vocab-bridge JSON files (produced by the workflow) into
// the registry entries for src/readingPassage3VocabBridge.ts.
//
// Reads scripts/.passage3-bridges/*.json, validates each bridge's shape, and
// prints a TypeScript snippet (the READING_VOCAB_BRIDGE_BY_GROUP body) plus a
// validation report. Use --emit to print only the TS object literal.
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const dir = join(here, '.passage3-bridges')
const emit = process.argv.includes('--emit')

const tsString = (s) => JSON.stringify(String(s ?? ''))

const isPhrase = (p) => p && typeof p.en === 'string' && p.en.trim() && typeof p.th === 'string' && p.th.trim()

const problems = []
const groups = {} // answerGroup -> { number -> bridge }

const files = readdirSync(dir).filter((f) => f.endsWith('.json')).sort()
for (const file of files) {
  let data
  try {
    data = JSON.parse(readFileSync(join(dir, file), 'utf8'))
  } catch (e) {
    problems.push(`${file}: invalid JSON (${e.message})`)
    continue
  }
  const answerGroup = data.answerGroup
  const bridges = data.bridges || {}
  if (!answerGroup || typeof bridges !== 'object') {
    problems.push(`${file}: missing answerGroup or bridges`)
    continue
  }
  const byNumber = {}
  for (const [num, b] of Object.entries(bridges)) {
    if (!isPhrase(b?.questionPhrase)) { problems.push(`${answerGroup} Q${num}: bad questionPhrase`); continue }
    if (!isPhrase(b?.passagePhrase)) { problems.push(`${answerGroup} Q${num}: bad passagePhrase`); continue }
    const clean = {
      questionPhrase: { en: b.questionPhrase.en.trim(), th: b.questionPhrase.th.trim() },
      passagePhrase: { en: b.passagePhrase.en.trim(), th: b.passagePhrase.th.trim() }
    }
    if (b.keyVocab && typeof b.keyVocab.word === 'string' && b.keyVocab.word.trim()) {
      const kv = { word: b.keyVocab.word.trim(), th: String(b.keyVocab.th || '').trim() }
      if (b.keyVocab.contrastA && b.keyVocab.contrastB) {
        kv.contrastA = String(b.keyVocab.contrastA).trim()
        kv.contrastB = String(b.keyVocab.contrastB).trim()
      }
      if (b.keyVocab.note && String(b.keyVocab.note).trim()) kv.note = String(b.keyVocab.note).trim()
      clean.keyVocab = kv
    }
    byNumber[Number(num)] = clean
  }
  groups[answerGroup] = byNumber
}

// Emit TS object literal body
const renderBridge = (b) => {
  const lines = []
  lines.push(`        questionPhrase: { en: ${tsString(b.questionPhrase.en)}, th: ${tsString(b.questionPhrase.th)} },`)
  lines.push(`        passagePhrase: { en: ${tsString(b.passagePhrase.en)}, th: ${tsString(b.passagePhrase.th)} },`)
  if (b.keyVocab) {
    const kv = []
    kv.push(`word: ${tsString(b.keyVocab.word)}`)
    kv.push(`th: ${tsString(b.keyVocab.th)}`)
    if (b.keyVocab.contrastA) kv.push(`contrastA: ${tsString(b.keyVocab.contrastA)}`)
    if (b.keyVocab.contrastB) kv.push(`contrastB: ${tsString(b.keyVocab.contrastB)}`)
    if (b.keyVocab.note) kv.push(`note: ${tsString(b.keyVocab.note)}`)
    lines.push(`        keyVocab: { ${kv.join(', ')} }`)
  } else {
    // remove trailing comma from passagePhrase line if no keyVocab
    lines[lines.length - 1] = lines[lines.length - 1].replace(/,$/, '')
  }
  return lines.join('\n')
}

let ts = ''
const groupNames = Object.keys(groups).sort()
for (const group of groupNames) {
  const byNumber = groups[group]
  ts += `  ${tsString(group)}: {\n`
  const nums = Object.keys(byNumber).map(Number).sort((a, b) => a - b)
  for (const n of nums) {
    ts += `    ${n}: {\n${renderBridge(byNumber[n])}\n    },\n`
  }
  ts += `  },\n`
}

if (emit) {
  process.stdout.write(ts)
} else {
  const totalQ = groupNames.reduce((s, g) => s + Object.keys(groups[g]).length, 0)
  console.error(`Passages: ${groupNames.length} | Questions: ${totalQ} | Problems: ${problems.length}`)
  if (problems.length) console.error('PROBLEMS:\n' + problems.map((p) => '  - ' + p).join('\n'))
  console.error('\n--- TS body preview (first 1200 chars) ---')
  console.error(ts.slice(0, 1200))
}
