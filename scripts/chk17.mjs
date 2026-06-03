import { buildReadingFillQuestionGroups } from '../src/readingFillDisplay.ts'
const noop = () => false
const m = await import('../server/userProvidedReadingPracticeCambridge17.mjs')
const k = Object.keys(m).find(x => x.includes('EXAMS'))
const exam = m[k].find(e => e.id === 'cambridge-17-test1-passage1')
const p = exam.parsedPayload.passages[0]
console.log('questionRanges:', JSON.stringify(p.questionRanges))
const groups = buildReadingFillQuestionGroups(p, p.questions, noop, exam.id)
console.log('fill groups:', groups.map(g => `${g.start}-${g.end}(${g.questions.length}q)`))
