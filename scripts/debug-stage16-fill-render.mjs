#!/usr/bin/env node
import { buildIntensiveJourneyExam, buildJourneyExamRecords } from '../src/readingJourney.ts'
import { buildReadingFillQuestionGroups } from '../src/readingFillDisplay.ts'
import { NEW_FILL_BLANK_SETS } from '../src/readingNewFillBlankQuestions.ts'

const pool = []
for (const book of [11, 15, 16, 17, 18, 19]) {
  const mod = await import(`../server/userProvidedReadingPracticeCambridge${book}.mjs`)
  pool.push(...mod[Object.keys(mod).find((k) => k.includes('EXAMS'))])
}
const records = buildJourneyExamRecords(pool, 20, 20)

for (const stage of [16, 18]) {
  const exam =
    stage <= 17
      ? buildIntensiveJourneyExam(stage)
      : records.find((e) => e.id === `journey-normal-stage-${stage}`)
  const p1 = exam.parsedPayload.passages[0]
  const groups = buildReadingFillQuestionGroups(p1, p1.questions, () => false, exam.id)
  const g = groups[0]
  const ov = NEW_FILL_BLANK_SETS.find(
    (s) =>
      s.examId === exam.id &&
      s.passageNumber === 1 &&
      s.startNumber === g?.start &&
      s.endNumber === g?.end
  )
  console.log(`\n=== Stage ${stage} ===`)
  console.log('examId', exam.id)
  console.log('questionRanges', p1.questionRanges)
  console.log('text fills', p1.questions.filter((q) => q.answerType === 'text').map((q) => q.number))
  console.log('group', g ? `${g.start}-${g.end}` : 'NONE', 'override found', !!ov)
  if (g?.questions?.[0]) console.log('Q5 prompt', g.questions[0].prompt?.slice(0, 100))
  console.log('override title', ov?.summaryTitle)
  if (ov) console.log('override text', ov.summaryLines[0]?.text?.slice(0, 100))
}
