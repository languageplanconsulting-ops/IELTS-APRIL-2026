import { buildReadingExamPayload } from '../server/readingImportUtils.mjs'
import {
  buildReadingQuestionDisplayPlan,
  extractReadingMultipleChoiceOptions,
  getReadingMatchingQuestionKind,
  extractReadingQuestionRangeBlock,
  findReadingQuestionRange
} from '../src/readingQuestionDisplay.ts'
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

const load = async (id) => {
  for (const file of fs.readdirSync('server').filter((f) => f.startsWith('userProvidedReading') && f.endsWith('.mjs'))) {
    const mod = await import(pathToFileURL(path.join('server', file)).href)
    for (const v of Object.values(mod)) {
      if (!Array.isArray(v)) continue
      const exam = v.find((e) => e.id === id)
      if (exam) return buildReadingExamPayload(exam)
    }
  }
  return null
}

const ids = ['cambridge-12-test2-passage1', 'cambridge-15-test2-passage1', 'cambridge-15-test3-passage3']
for (const id of ids) {
  const payload = await load(id)
  const p = payload.passages[0] || payload.passages.find((x) => x.number === 3) || payload.passages[0]
  const questions = p.questions
  const plan = buildReadingQuestionDisplayPlan(p, questions, id)
  console.log('\n===', id, 'passage', p.number, '===')
  for (const n of [1, 4, 10, 27, 40].filter((n) => questions.some((q) => q.number === n))) {
    const q = questions.find((x) => x.number === n)
    const range = findReadingQuestionRange(p, q)
    const block = extractReadingQuestionRangeBlock(p.questionSectionText, range.start, range.end)
    console.log(`Q${n} mode=${plan.byQuestionNumber.get(n)} kind=${getReadingMatchingQuestionKind(p, q)} opts=${extractReadingMultipleChoiceOptions(p, q).length}`)
    console.log('  range', range, 'block head:', block.slice(0, 120).replace(/\n/g, ' | '))
  }
}
