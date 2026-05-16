/**
 * Build cambridge-17-reading-import.json from passage files, question files, and answer keys.
 * Run: node scripts/postprocess-cambridge-17.mjs && node scripts/generate-cambridge-17-reading-import.mjs
 */
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

execSync('node scripts/postprocess-cambridge-17.mjs', { stdio: 'inherit', cwd: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..') })
import { CAMBRIDGE_17_THAI_EXPLANATIONS } from './cambridge-17-thai-explanations.mjs'
import { CAMBRIDGE_17_EXPLANATION_OVERRIDES } from './cambridge-17-explanation-overrides.mjs'
import { buildComprehensiveEnrichment } from './cambridge-17-enrichment-builder.mjs'
import { buildPromptMap, questionRangeForKey } from './cambridge-17-question-parser.mjs'
import { resolveC17Prompt } from './cambridge-17-prompt-maps.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const passDir = path.join(__dirname, 'cambridge-17-passages')
const quesDir = path.join(__dirname, 'cambridge-17-questions')
const answersPath = path.join(__dirname, 'cambridge-17-answers.json')
const outputPath = path.join(root, 'cambridge-reading-imports/cambridge-17-reading-import.json')

const answers = JSON.parse(fs.readFileSync(answersPath, 'utf8'))

const specs = [
  { test: 1, passage: 1, category: 'normal', key: 't1p1' },
  { test: 1, passage: 2, category: 'normal', key: 't1p2' },
  { test: 1, passage: 3, category: 'advanced', key: 't1p3' },
  { test: 2, passage: 1, category: 'normal', key: 't2p1' },
  { test: 2, passage: 2, category: 'normal', key: 't2p2' },
  { test: 2, passage: 3, category: 'advanced', key: 't2p3' },
  { test: 3, passage: 1, category: 'normal', key: 't3p1' },
  { test: 3, passage: 2, category: 'normal', key: 't3p2' },
  { test: 3, passage: 3, category: 'advanced', key: 't3p3' },
  { test: 4, passage: 1, category: 'normal', key: 't4p1' },
  { test: 4, passage: 2, category: 'normal', key: 't4p2' },
  { test: 4, passage: 3, category: 'advanced', key: 't4p3' }
]

const read = (dir, key) => fs.readFileSync(path.join(dir, `${key}.txt`), 'utf8').trim()

const titleFromBody = (body) => body.split('\n')[0].trim()

const normalizeDashes = (text) =>
  String(text || '')
    .replace(/[\u2010-\u2015\u2212]/g, '-')
    .replace(/[—–]/g, '-')

const buildPassage = (passageNum, body, questionsText) =>
  `READING PASSAGE ${passageNum}\n${body}\n\n${normalizeDashes(questionsText)}`

const makeBlock = ({ n, prompt, answer, accepted, test, passage, exact, thai, para }) =>
  `Question ${n}: ${prompt}

Correct Answer: ${answer}

Accepted Answers: ${accepted ?? answer}

Answer Group: Cambridge 17 Test ${test} Passage ${passage}

Exact Portion: "${String(exact || prompt).replace(/"/g, '\\"')}"

Short Thai Explanation: ${thai}

Paraphrased Vocabulary: ${para}`

const explanationKey = (test, passage, n) => `${test}-${passage}-${n}`

const buildKey = (test, passage, title, questionRows, body) => {
  const blocks = questionRows.map(([n, answer, accepted, prompt]) => {
    const ek = explanationKey(test, passage, n)
    const hand = { ...CAMBRIDGE_17_THAI_EXPLANATIONS[ek], ...CAMBRIDGE_17_EXPLANATION_OVERRIDES[ek] }
    const enrich = buildComprehensiveEnrichment({ body, prompt, answer, hand })
    return makeBlock({
      n,
      prompt,
      answer,
      accepted: accepted ?? answer,
      test,
      passage,
      exact: enrich.exact,
      thai: enrich.thai,
      para: enrich.para
    })
  })
  return `READING PASSAGE ${passage}: ${title}\n\n${blocks.join('\n\n')}`
}

const items = specs.map(({ test, passage, category, key }) => {
  const body = read(passDir, key)
  const questionsText = read(quesDir, key)
  const title = titleFromBody(body)
  const [start, end] = questionRangeForKey(key)
  const promptMap = buildPromptMap(questionsText, start, end)
  const rows = answers[key]

  const questionRows = rows.map(([n, answer, accepted]) => {
    const prompt = resolveC17Prompt(key, n, test, passage, promptMap)
    return [n, answer, accepted, prompt]
  })

  return {
    id: `cambridge-17-test${test}-passage${passage}`,
    title: `Cambridge 17 Test ${test} Passage ${passage} - ${title}`,
    category,
    rawPassageText: buildPassage(passage, body, questionsText),
    rawAnswerKey: buildKey(test, passage, title, questionRows, body)
  }
})

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, JSON.stringify(items, null, 2), 'utf8')

const qTotal = items.reduce((sum, item) => {
  const matches = item.rawAnswerKey.match(/^Question \d+:/gm)
  return sum + (matches?.length || 0)
}, 0)

console.log(`Wrote ${items.length} exams (${qTotal} questions) to ${outputPath}`)
