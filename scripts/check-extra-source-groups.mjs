import { buildReadingFillQuestionGroups } from '../src/readingFillDisplay.ts'
const noop = () => false
const items = [
  [13, 'cambridge-13-test2-passage2'], [12, 'cambridge-12-test3-passage1'],
  [13, 'cambridge-13-test4-passage1'], [12, 'cambridge-12-test1-passage1'],
  [15, 'cambridge-15-test3-passage1'], [13, 'cambridge-13-test1-passage1']
]
for (const [b, id] of items) {
  const m = await import(`../server/userProvidedReadingPracticeCambridge${b}.mjs`)
  const k = Object.keys(m).find((x) => x.includes('EXAMS'))
  const e = m[k].find((x) => x.id === id)
  const p = e.parsedPayload.passages[0]
  const g = buildReadingFillQuestionGroups(p, p.questions, noop, id)
  console.log(id, g.map((x) => `${x.start}-${x.end}(${x.questions.length}q)`).join(','))
}
