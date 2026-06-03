import { buildReadingFillQuestionGroups } from '../src/readingFillDisplay.ts'
import { NEW_FILL_BLANK_SETS } from '../src/readingNewFillBlankQuestions.ts'
const noop = () => false
const m = await import('../server/userProvidedReadingPracticeCambridge17.mjs')
const k = Object.keys(m).find(x => x.includes('EXAMS'))
const exam = m[k].find(e => e.id === 'cambridge-17-test1-passage1')
const p = exam.parsedPayload.passages[0]
const groups = buildReadingFillQuestionGroups(p, p.questions, noop, exam.id)
console.log('fill groups:', groups.map(g => `${g.start}-${g.end}(${g.questions.length}q)`))
for (const g of groups) {
  const override = NEW_FILL_BLANK_SETS.find(
    s => s.examId === exam.id && s.startNumber === g.start && s.endNumber === g.end
  )
  console.log(`group ${g.start}-${g.end} override:`, override ? `FOUND (title: ${override.summaryTitle})` : 'MISSING')
}
