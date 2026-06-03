import { buildReadingFillQuestionGroups } from '../src/readingFillDisplay.ts'
const noop = () => false
const m = await import('../server/userProvidedReadingPracticeCambridge17.mjs')
const k = Object.keys(m).find(x => x.includes('EXAMS'))
const exam = m[k].find(e => e.id === 'cambridge-17-test1-passage1')
const p = exam.parsedPayload.passages[0]
const groups = buildReadingFillQuestionGroups(p, p.questions, noop, exam.id)
const g = groups[0]
console.log('group start:', g.start, 'end:', g.end)
console.log('instruction:', g.instruction?.slice(0, 100))
console.log('displayLines sample:')
g.displayLines.slice(0, 6).forEach(l => console.log(' ', JSON.stringify(l).slice(0, 120)))
