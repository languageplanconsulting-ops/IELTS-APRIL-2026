import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { keys } from './cambridge-19-reading-keys.mjs'
import { CAMBRIDGE_19_HAND_ENRICHMENTS } from './cambridge-19-enrichments.mjs'
import { CAMBRIDGE_19_HINT_OVERRIDES } from './cambridge-19-hint-overrides.mjs'
import { buildAutoEnrichment, mergeEnrichment } from './cambridge-19-enrichment-builder.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const passageDir = path.join(__dirname, 'cambridge-19-passages')
const questionsDir = path.join(__dirname, 'cambridge-19-questions')
const outputPath = path.join(root, 'cambridge-reading-imports/cambridge-19-reading-import.json')

const makeBlock = ({ n, prompt, answer, accepted, test, passage, exact, thai, para }) =>
  `Question ${n}: ${prompt}

Correct Answer: ${answer}

Accepted Answers: ${accepted ?? answer}

Answer Group: Cambridge 19 Test ${test} Passage ${passage}

Exact Portion: "${String(exact || prompt).replace(/"/g, '\\"')}"

Short Thai Explanation: ${thai}

Paraphrased Vocabulary: ${para}`

const buildKey = (test, passage, title, questions) =>
  `READING PASSAGE ${passage}: ${title}\n\n${questions.map((q) => makeBlock({ ...q, test, passage })).join('\n\n')}`

const buildPassage = (passageNum, body, questionsText) =>
  `READING PASSAGE ${passageNum}\n${body}\n\n${questionsText}`

const readFile = (dir, id) => fs.readFileSync(path.join(dir, `${id}.txt`), 'utf8').trim()

const titleFromBody = (body) => body.split('\n')[0].trim()

const rowsToQuestions = (rows, { body, test, passage }) =>
  rows.map((row) => {
    const [n, prompt, answer, accepted, exactOverride] = row
    const enrichKey = `${test}-${passage}-${n}`
    const hand = CAMBRIDGE_19_HAND_ENRICHMENTS[enrichKey]
    const merged = mergeEnrichment(
      buildAutoEnrichment({
        body,
        prompt,
        answer,
        hintOverride: CAMBRIDGE_19_HINT_OVERRIDES[enrichKey]
      }),
      hand
    )
    return {
      n,
      prompt,
      answer,
      accepted: accepted ?? answer,
      exact: exactOverride || merged.exact,
      thai: merged.thai,
      para: merged.para
    }
  })

const exam = ({ test, passage, category, id, body, questionsText, questionRows }) => {
  const title = titleFromBody(body)
  return {
    id,
    title: `Cambridge 19 Test ${test} Passage ${passage} - ${title}`,
    category,
    rawPassageText: buildPassage(passage, body, questionsText),
    rawAnswerKey: buildKey(
      test,
      passage,
      title,
      rowsToQuestions(questionRows, { body, test, passage })
    )
  }
}

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

const items = specs.map(({ test, passage, category, key }) => {
  const body = readFile(passageDir, key)
  const questionsText = readFile(questionsDir, key)
  return exam({
    test,
    passage,
    category,
    id: `cambridge-19-test${test}-passage${passage}`,
    body,
    questionsText,
    questionRows: keys[key]
  })
})

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, JSON.stringify(items, null, 2), 'utf8')

const counts = Object.fromEntries(
  [1, 2, 3, 4].map((t) => [t, [1, 2, 3].reduce((sum, p) => sum + keys[`t${t}p${p}`].length, 0)])
)
console.log(`Wrote ${items.length} exams to ${outputPath}`)
console.log('Questions per test:', counts)
