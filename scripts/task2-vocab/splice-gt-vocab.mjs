/**
 * Splice expanded GT Task 2 vocab into src/writingGeneralTask2Data.ts
 * Usage: node scripts/task2-vocab/splice-gt-vocab.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '../..')
const batchesDir = join(__dirname, 'batches')
const dataPath = join(root, 'src/writingGeneralTask2Data.ts')
const essays = JSON.parse(readFileSync(join(__dirname, 'gt-essays.json'), 'utf8'))
const essayById = new Map(essays.map((e) => [e.id, e]))

const byId = new Map()
for (const name of readdirSync(batchesDir).filter((n) => /^gt-batch-.*-expand-out\.json$/.test(n)).sort()) {
  const rows = JSON.parse(readFileSync(join(batchesDir, name), 'utf8'))
  for (const row of rows) byId.set(row.id, row.vocab)
}

let misses = 0
for (const [id, vocab] of byId) {
  const essay = essayById.get(id)
  if (!essay) {
    console.error('unknown id', id)
    process.exit(1)
  }
  const lower = essay.essay.toLowerCase()
  for (const item of vocab) {
    if (!lower.includes(item.word.toLowerCase())) {
      console.error('MISS', id, JSON.stringify(item.word))
      misses++
    }
    if (!item.thaiMeaning || !/[\u0E00-\u0E7F]/.test(item.thaiMeaning)) {
      console.error('BAD THAI', id, item.word)
      misses++
    }
  }
}
if (misses) {
  console.error('validation failed:', misses)
  process.exit(1)
}

const formatVocab = (vocab) => {
  const lines = vocab.map(
    (item) =>
      `      { word: ${JSON.stringify(item.word)}, thaiMeaning: ${JSON.stringify(item.thaiMeaning)} }`
  )
  return `vocab: [\n${lines.join(',\n')}\n    ]`
}

let source = readFileSync(dataPath, 'utf8')
let replaced = 0
for (const [id, vocab] of byId) {
  const idNeedle = `id: '${id}'`
  const idIndex = source.indexOf(idNeedle)
  if (idIndex < 0) {
    console.error('id not found', id)
    process.exit(1)
  }
  const vocabStart = source.indexOf('vocab: [', idIndex)
  if (vocabStart < 0 || vocabStart - idIndex > 8000) {
    console.error('vocab not found near', id)
    process.exit(1)
  }
  let i = vocabStart + 'vocab: ['.length
  let depth = 1
  while (i < source.length && depth > 0) {
    const ch = source[i]
    if (ch === '[') depth++
    else if (ch === ']') depth--
    i++
  }
  source = source.slice(0, vocabStart) + formatVocab(vocab) + source.slice(i)
  replaced++
}

writeFileSync(dataPath, source)
console.log('replaced GT vocab for', replaced, 'prompts; expected', essays.length, 'got', byId.size)
