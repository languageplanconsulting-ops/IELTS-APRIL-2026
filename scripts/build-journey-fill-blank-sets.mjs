#!/usr/bin/env node
/**
 * Build journey fill-blank override sets (remapped from bank sets).
 * Run: npx tsx scripts/build-journey-fill-blank-sets.mjs [maxStage]
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  buildJourneyStageDefinitions,
  buildJourneyExamRecords,
  orderJourneySourceExams,
  getJourneyPassageQuestionOffset
} from '../src/readingJourney.ts'
import { NEW_FILL_BLANK_SETS } from '../src/readingNewFillBlankQuestions.ts'
import { buildReadingFillQuestionGroups } from '../src/readingFillDisplay.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const outputPath = path.join(root, 'src/generated/journeyFillBlankSets.json')
const maxStage = Math.max(1, Number(process.argv[2] || 5))

const books = [11, 12, 13, 14, 15, 16, 17, 19]
const pool = []
for (const book of books) {
  const mod = await import(`../server/userProvidedReadingPracticeCambridge${book}.mjs`)
  const key = Object.keys(mod).find((name) => name.includes('EXAMS'))
  pool.push(...mod[key].filter((exam) => exam.category === 'normal'))
}

const noop = () => false

const remapSummaryText = (text, delta) =>
  String(text || '').replace(/\{(\d+)\}/g, (_, token) => `{${Number(token) + delta}}`)

const buildInstructions = (start, end) => [
  `Questions ${start}–${end}`,
  'Complete the summary below.',
  'Choose ONE WORD ONLY from the passage for each answer.',
  `Write your answers in boxes ${start}–${end} on your answer sheet.`
]

const findSourceSet = (sourceExamId, sourceStart, sourceEnd) =>
  NEW_FILL_BLANK_SETS.find(
    (set) =>
      set.examId === sourceExamId &&
      set.startNumber <= sourceStart &&
      set.endNumber >= sourceEnd
  )

const definitions = buildJourneyStageDefinitions(pool, 30).slice(0, maxStage)
const journeyExams = buildJourneyExamRecords(pool, 30)
const journeySets = []

for (const definition of definitions) {
  const journeyExam = journeyExams.find((exam) => exam.id === definition.id)
  if (!journeyExam) continue

  const sourceExams = definition.sourceExamIds
    .map((examId) => pool.find((exam) => exam.id === examId))
    .filter(Boolean)
  if (sourceExams.length !== 3) continue

  const orderedSources = orderJourneySourceExams(sourceExams)

  for (let index = 0; index < 3; index += 1) {
    const slot = (index + 1)
    const passage = journeyExam.parsedPayload.passages[index]
    const sourceExam = orderedSources[index]
    const sourcePassage = sourceExam?.parsedPayload?.passages?.[0]
    if (!passage || !sourceExam || !sourcePassage) continue

    const offset = getJourneyPassageQuestionOffset(sourcePassage, slot)
    const groups = buildReadingFillQuestionGroups(passage, passage.questions, noop, definition.id)

    for (const group of groups) {
      const sourceStart = group.start - offset
      const sourceEnd = group.end - offset
      const sourceSet = findSourceSet(sourceExam.id, sourceStart, sourceEnd)
      if (!sourceSet) {
        console.warn(
          `Missing source set: stage ${definition.stageNumber} P${slot} ${definition.id} needs ${sourceExam.id} ${sourceStart}-${sourceEnd}`
        )
        continue
      }

      const delta = group.start - sourceSet.startNumber
      const questions = sourceSet.questions
        .filter(
          (question) =>
            question.number + delta >= group.start && question.number + delta <= group.end
        )
        .map((question) => ({
          ...question,
          number: question.number + delta
        }))

      if (questions.length !== group.end - group.start + 1) {
        console.warn(
          `Question count mismatch stage ${definition.stageNumber} P${slot}: expected ${group.end - group.start + 1}, got ${questions.length}`
        )
      }

      const validNumbers = new Set(questions.map((q) => q.number))
      const summaryLines = sourceSet.summaryLines
        .map((line) => ({
          ...line,
          text: line.text ? remapSummaryText(line.text, delta) : line.text
        }))
        .filter((line) => {
          if (!line.text) return true
          const placeholders = [...line.text.matchAll(/\{(\d+)\}/g)].map((m) => Number(m[1]))
          if (!placeholders.length) return true
          return placeholders.every((n) => validNumbers.has(n))
        })

      journeySets.push({
        examId: definition.id,
        passageNumber: passage.number,
        startNumber: group.start,
        endNumber: group.end,
        sourceParagraphs: sourceSet.sourceParagraphs,
        instructions: buildInstructions(group.start, group.end),
        summaryTitle: sourceSet.summaryTitle,
        summaryLines,
        questions
      })
    }
  }
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, `${JSON.stringify(journeySets, null, 2)}\n`, 'utf8')

const questionTotal = journeySets.reduce((sum, set) => sum + set.questions.length, 0)
console.log(
  `Wrote ${journeySets.length} journey fill-blank sets (${questionTotal} questions) for stages 1-${maxStage} to ${outputPath}`
)
