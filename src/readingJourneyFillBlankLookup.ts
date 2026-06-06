import type { NewFillBlankSet } from './readingNewFillBlankQuestions.ts'
import {
  getJourneyPassageQuestionOffset,
  isReadingJourneyExamId,
  type ReadingExamRecord,
  type ReadingJourneyStageDefinition
} from './readingJourney.ts'
import { SOURCE_EXAM_FILL_BLANK_SETS } from './sourceExamFillBlankOverrides.ts'

const remapSummaryText = (text: string, delta: number) =>
  String(text || '').replace(/\{(\d+)\}/g, (_, token) => `{${Number(token) + delta}}`)

export const remapFillBlankSetToJourney = (
  sourceSet: NewFillBlankSet,
  {
    journeyExamId,
    passageNumber,
    journeyStart,
    journeyEnd
  }: {
    journeyExamId: string
    passageNumber: number
    journeyStart: number
    journeyEnd: number
  }
): NewFillBlankSet | null => {
  const delta = journeyStart - sourceSet.startNumber
  const needed = new Set<number>()
  for (let number = journeyStart; number <= journeyEnd; number += 1) needed.add(number)

  const questions = sourceSet.questions
    .filter((question) => {
      const remapped = question.number + delta
      return remapped >= journeyStart && remapped <= journeyEnd
    })
    .map((question) => ({ ...question, number: question.number + delta }))

  if (questions.length !== journeyEnd - journeyStart + 1) return null

  const summaryLines = sourceSet.summaryLines
    .map((line) => {
      if (line.type === 'table-row' || line.type === 'table-header') {
        return { ...line, cells: line.cells.map((cell) => remapSummaryText(cell, delta)) }
      }
      if ('text' in line && line.text) {
        return { ...line, text: remapSummaryText(line.text, delta) }
      }
      return line
    })
    .filter((line) => {
      const text = 'text' in line ? line.text : ''
      if (!text) return true
      const placeholders = [...text.matchAll(/\{(\d+)\}/g)].map((match) => Number(match[1]))
      if (!placeholders.length) return true
      return placeholders.every((number) => needed.has(number))
    })

  const instructionKind = sourceSet.instructions[1] || 'Complete the summary below.'

  return {
    examId: journeyExamId,
    passageNumber,
    startNumber: journeyStart,
    endNumber: journeyEnd,
    sourceParagraphs: sourceSet.sourceParagraphs,
    instructions: [
      `Questions ${journeyStart}–${journeyEnd}`,
      instructionKind,
      sourceSet.instructions[2] || 'Choose ONE WORD ONLY from the passage for each answer.',
      `Write your answers in boxes ${journeyStart}–${journeyEnd} on your answer sheet.`
    ],
    summaryTitle: sourceSet.summaryTitle,
    summaryLines,
    questions,
    diagramImage: sourceSet.diagramImage,
    diagramAlt: sourceSet.diagramAlt
  }
}

const findSourceExamSet = (
  sourceExamId: string,
  sourceStart: number,
  sourceEnd: number
): NewFillBlankSet | null => {
  const exact = SOURCE_EXAM_FILL_BLANK_SETS.find(
    (set) =>
      set.examId === sourceExamId &&
      set.passageNumber === 1 &&
      set.startNumber === sourceStart &&
      set.endNumber === sourceEnd
  )
  if (exact) return exact

  return (
    SOURCE_EXAM_FILL_BLANK_SETS.find(
      (set) =>
        set.examId === sourceExamId &&
        set.passageNumber === 1 &&
        set.startNumber <= sourceStart &&
        set.endNumber >= sourceEnd
    ) || null
  )
}

/** Resolve a hand-authored fill-blank override for a journey or source exam group. */
export const resolveFillBlankOverride = (
  manualSets: NewFillBlankSet[],
  {
    examId,
    passageNumber,
    startNumber,
    endNumber,
    stageDefinitions,
    sourcePool
  }: {
    examId: string
    passageNumber: number
    startNumber: number
    endNumber: number
    stageDefinitions: ReadingJourneyStageDefinition[]
    sourcePool: ReadingExamRecord[]
  }
): NewFillBlankSet | null => {
  const direct = manualSets.find(
    (set) =>
      set.examId === examId &&
      set.passageNumber === passageNumber &&
      set.startNumber === startNumber &&
      set.endNumber === endNumber
  )
  if (direct) return direct

  if (!isReadingJourneyExamId(examId)) {
    return findSourceExamSet(examId, startNumber, endNumber)
  }

  const stageDef = stageDefinitions.find((definition) => definition.id === examId)
  if (!stageDef || stageDef.intensive) return null

  const sourceExamId = stageDef.sourceExamIds[passageNumber - 1]
  if (!sourceExamId) return null

  const sourceExam = sourcePool.find((exam) => exam.id === sourceExamId)
  const sourcePassage = sourceExam?.parsedPayload?.passages?.[0]
  if (!sourcePassage) return null

  const offset = getJourneyPassageQuestionOffset(sourcePassage, passageNumber as 1 | 2)
  const sourceStart = startNumber - offset
  const sourceEnd = endNumber - offset
  const sourceSet = findSourceExamSet(sourceExamId, sourceStart, sourceEnd)
  if (!sourceSet) return null

  return remapFillBlankSetToJourney(sourceSet, {
    journeyExamId: examId,
    passageNumber,
    journeyStart: startNumber,
    journeyEnd: endNumber
  })
}

/** Find override covering a single question (for per-question fallback path). */
export const findFillBlankOverrideCoveringQuestion = (
  manualSets: NewFillBlankSet[],
  {
    examId,
    passageNumber,
    questionNumber,
    stageDefinitions,
    sourcePool
  }: {
    examId: string
    passageNumber: number
    questionNumber: number
    stageDefinitions: ReadingJourneyStageDefinition[]
    sourcePool: ReadingExamRecord[]
  }
): NewFillBlankSet | null => {
  if (!isReadingJourneyExamId(examId)) {
    const direct = manualSets.find(
      (set) =>
        set.examId === examId &&
        set.passageNumber === passageNumber &&
        questionNumber >= set.startNumber &&
        questionNumber <= set.endNumber
    )
    if (direct) return direct
    return findSourceExamSet(examId, questionNumber, questionNumber)
  }

  const stageDef = stageDefinitions.find((definition) => definition.id === examId)
  if (!stageDef || stageDef.intensive) {
    return (
      manualSets.find(
        (set) =>
          set.examId === examId &&
          set.passageNumber === passageNumber &&
          questionNumber >= set.startNumber &&
          questionNumber <= set.endNumber
      ) || null
    )
  }

  const sourceExamId = stageDef.sourceExamIds[passageNumber - 1]
  const sourceExam = sourcePool.find((exam) => exam.id === sourceExamId)
  const sourcePassage = sourceExam?.parsedPayload?.passages?.[0]
  if (!sourceExamId || !sourcePassage) return null

  const offset = getJourneyPassageQuestionOffset(sourcePassage, passageNumber as 1 | 2)
  const sourceNumber = questionNumber - offset
  const sourceSet = SOURCE_EXAM_FILL_BLANK_SETS.find(
    (set) =>
      set.examId === sourceExamId &&
      set.passageNumber === 1 &&
      sourceNumber >= set.startNumber &&
      sourceNumber <= set.endNumber
  )
  if (!sourceSet) return null

  return remapFillBlankSetToJourney(sourceSet, {
    journeyExamId: examId,
    passageNumber,
    journeyStart: sourceSet.startNumber + offset,
    journeyEnd: sourceSet.endNumber + offset
  })
}
