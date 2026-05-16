/**
 * Generate cambridge-17-thai-explanations.mjs with comprehensive explanations for all 160 questions.
 * Run: node scripts/generate-cambridge-17-thai-explanations.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildComprehensiveEnrichment } from './cambridge-17-enrichment-builder.mjs'
import { CAMBRIDGE_17_EXPLANATION_OVERRIDES } from './cambridge-17-explanation-overrides.mjs'
import { buildPromptMap, questionRangeForKey } from './cambridge-17-question-parser.mjs'
import { resolveC17Prompt } from './cambridge-17-prompt-maps.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const passDir = path.join(__dirname, 'cambridge-17-passages')
const quesDir = path.join(__dirname, 'cambridge-17-questions')
const answersPath = path.join(__dirname, 'cambridge-17-answers.json')
const outputPath = path.join(__dirname, 'cambridge-17-thai-explanations.mjs')

const answers = JSON.parse(fs.readFileSync(answersPath, 'utf8'))

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

const read = (dir, key) => fs.readFileSync(path.join(dir, `${key}.txt`), 'utf8').trim()

const entries = {}

for (const { test, passage, key } of specs) {
  const body = read(passDir, key)
  const questionsText = read(quesDir, key)
  const [start, end] = questionRangeForKey(key)
  const promptMap = buildPromptMap(questionsText, start, end)

  for (const [n, answer] of answers[key].map((row) => [row[0], row[1]])) {
    const id = `${test}-${passage}-${n}`
    const prompt = resolveC17Prompt(key, n, test, passage, promptMap)
    const hand = CAMBRIDGE_17_EXPLANATION_OVERRIDES[id]
    const enrich = buildComprehensiveEnrichment({ body, prompt, answer, hand })
    entries[id] = {
      thai: enrich.thai,
      para: enrich.para,
      exactHints: enrich.exactHints,
      exact: enrich.exact
    }
  }
}

const lines = [
  '/** Comprehensive Thai explanations — Cambridge IELTS 17 Academic Reading (160 questions). */',
  '/** Auto-generated; re-run: node scripts/generate-cambridge-17-thai-explanations.mjs */',
  'export const CAMBRIDGE_17_THAI_EXPLANATIONS = {'
]

for (const [id, v] of Object.entries(entries)) {
  const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"')
  lines.push(
    `  '${id}': { thai: "${esc(v.thai)}", para: "${esc(v.para)}", exactHints: "${esc(v.exactHints)}", exact: "${esc(v.exact)}" },`
  )
}

lines.push('}', '')

fs.writeFileSync(outputPath, lines.join('\n'), 'utf8')
console.log(`Wrote ${Object.keys(entries).length} comprehensive explanations to ${outputPath}`)
