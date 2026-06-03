#!/usr/bin/env node
import { buildJourneyStageDefinitions, buildJourneyExamRecords } from '../src/readingJourney.ts'
import { findNewFillBlankSet, NEW_FILL_BLANK_SETS } from '../src/readingNewFillBlankQuestions.ts'
import { buildReadingFillQuestionGroups } from '../src/readingFillDisplay.ts'

const books = [11, 12, 13, 14, 15, 16, 17, 19]
const pool = []
for (const book of books) {
  const mod = await import(`../server/userProvidedReadingPracticeCambridge${book}.mjs`)
  const key = Object.keys(mod).find((name) => name.includes('EXAMS'))
  pool.push(...mod[key].filter((exam) => exam.category === 'normal'))
}

const QUESTION_START = [1, 14, 27]
const noop = () => false

const defs = buildJourneyStageDefinitions(pool, 30).slice(4, 10)
const journeyExams = buildJourneyExamRecords(pool, 30)

for (const def of defs) {
  const journey = journeyExams.find((exam) => exam.id === def.id)
  const sources = def.sourceExamIds
    .map((id) => pool.find((exam) => exam.id === id))
    .filter(Boolean)

  console.log(`\n=== Stage ${def.stageNumber} (${def.id}) ===`)
  for (let index = 0; index < 3; index += 1) {
    const passage = journey?.parsedPayload?.passages?.[index]
    const source = sources[index]
    if (!passage || !source) continue
    const srcPassage = source.parsedPayload?.passages?.[0]
    const srcMin = Math.min(...(srcPassage?.questions || []).map((q) => q.number))
    const offset = QUESTION_START[index] - (srcMin > 0 ? srcMin : 1)
    const groups = buildReadingFillQuestionGroups(passage, passage.questions, noop, def.id)
    for (const group of groups) {
      const sourceStart = group.start - offset
      const sourceEnd = group.end - offset
      const sourceSet = NEW_FILL_BLANK_SETS.find(
        (set) =>
          set.examId === source.id &&
          set.startNumber <= sourceStart &&
          set.endNumber >= sourceEnd
      )
      console.log(
        `  P${index + 1} journey ${group.start}-${group.end} | source ${source.id} ${sourceStart}-${sourceEnd} | set ${sourceSet ? `${sourceSet.startNumber}-${sourceSet.endNumber}` : 'MISSING'}`
      )
    }
  }
}
