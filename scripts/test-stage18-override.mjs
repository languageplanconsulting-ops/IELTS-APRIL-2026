#!/usr/bin/env node
import { buildJourneyExamRecords } from '../src/readingJourney.ts'
import { MANUAL_FILL_BLANK_SETS } from '../src/readingNewFillBlankQuestions.ts'
import { resolveFillBlankOverride } from '../src/readingJourneyFillBlankLookup.ts'
import { buildReadingFillQuestionGroups } from '../src/readingFillDisplay.ts'

const noop = () => false

async function loadPool(books) {
  const pool = []
  for (const book of books) {
    const mod = await import(`../server/userProvidedReadingPracticeCambridge${book}.mjs`)
    pool.push(...mod[Object.keys(mod).find((k) => k.includes('EXAMS'))])
  }
  return pool.filter((e) => e.category === 'normal')
}

for (const [label, books] of [
  ['cam13-only', [13]],
  ['no13', [11, 15, 16, 17, 18, 19]],
  ['standard', [11, 12, 13, 14, 15, 16, 17, 19]]
]) {
  const pool = await loadPool(books)
  const defs = buildJourneyExamRecords(pool, 20, 20)
  const stage18 = defs.find((e) => e.id === 'journey-normal-stage-18')
  const p1 = stage18.parsedPayload.passages[0]
  const groups = buildReadingFillQuestionGroups(p1, p1.questions, noop, stage18.id)
  const fillGroup = groups.find((g) => g.questions.some((q) => q.answerType === 'text'))
  console.log(`\n[${label}] Stage 18 P1: ${p1.title.slice(0, 50)}`)
  if (!fillGroup) {
    console.log('  no fill group')
    continue
  }
  const override = resolveFillBlankOverride(MANUAL_FILL_BLANK_SETS, {
    examId: stage18.id,
    passageNumber: 1,
    startNumber: fillGroup.start,
    endNumber: fillGroup.end,
    stageDefinitions: buildJourneyExamRecords(pool, 20, 20).map((e, i) => ({
      stageNumber: i + 1,
      id: e.id,
      title: `ด่าน ${i + 1}`,
      subtitle: '',
      sourceExamIds: ['', ''],
      intensive: i + 1 <= 17
    })),
    sourcePool: pool
  })
  // fix stage definitions properly
}

console.log('\n--- Proper test ---')
const pool = await loadPool([13])
const { buildJourneyStageDefinitions } = await import('../src/readingJourney.ts')
const stageDefs = buildJourneyStageDefinitions(pool, 20, 20)
const stage18 = buildJourneyExamRecords(pool, 20, 20).find((e) => e.id === 'journey-normal-stage-18')
const p1 = stage18.parsedPayload.passages[0]
const groups = buildReadingFillQuestionGroups(p1, p1.questions, noop, stage18.id)
const fillGroup = groups.find((g) => g.questions.some((q) => q.answerType === 'text'))
const override = resolveFillBlankOverride(MANUAL_FILL_BLANK_SETS, {
  examId: stage18.id,
  passageNumber: 1,
  startNumber: fillGroup.start,
  endNumber: fillGroup.end,
  stageDefinitions: stageDefs,
  sourcePool: pool
})
console.log('Coconut pool stage 18 override:', override?.summaryTitle, `Q${override?.startNumber}-${override?.endNumber}`)
console.log('lines:', override?.summaryLines?.length)
