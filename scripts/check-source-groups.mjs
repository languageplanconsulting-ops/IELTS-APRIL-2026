#!/usr/bin/env node
import { buildReadingFillQuestionGroups } from '../src/readingFillDisplay.ts'
const noop = () => false

const needs = [
  { book: 16, examId: 'cambridge-16-test2-passage1' },
  { book: 14, examId: 'cambridge-14-test1-passage2' },
  { book: 19, examId: 'cambridge-19-test2-passage1' },
  { book: 14, examId: 'cambridge-14-test3-passage2' },
  { book: 11, examId: 'cambridge-11-test2-passage1' },
  { book: 15, examId: 'cambridge-15-test1-passage2' }
]
for (const n of needs) {
  const mod = await import(`../server/userProvidedReadingPracticeCambridge${n.book}.mjs`)
  const key = Object.keys(mod).find((k) => k.includes('EXAMS'))
  const exam = mod[key].find((e) => e.id === n.examId)
  const passage = exam.parsedPayload.passages[0]
  const groups = buildReadingFillQuestionGroups(passage, passage.questions, noop, n.examId)
  console.log(n.examId, '→ ranges:', passage.questionRanges.map(r => `${r.start}-${r.end}`).join(','), '| fill groups:', groups.map(g => `${g.start}-${g.end}(${g.questions.length}q)`).join(','))
}
