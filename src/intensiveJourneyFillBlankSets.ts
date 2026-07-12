import type { NewFillBlankSet, NewFillBlankSummaryLine } from './readingNewFillBlankQuestions.ts'
import { INTENSIVE_JOURNEY_FILL_BLANK_STAGES_1_5 } from './intensiveJourneyFillBlankStages1to5.ts'
import { INTENSIVE_JOURNEY_FILL_BLANK_STAGES_6_17 } from './intensiveJourneyFillBlankStages6to17.ts'
import { INTENSIVE_JOURNEY_FILL_BLANK_STAGES_18_20 } from './intensiveJourneyFillBlankStages18to20.ts'

// Intensive journey passage 1 always holds 13 questions (Q1–13), so passage 2
// must be numbered starting at Q14. These passage-2 sets were originally
// authored against an off-by-one scheme where passage 2 started at Q15 (which
// left a visible gap at Q14 in the exam). Shift every passage-2 set down by one
// so its numbers line up with the corrected passage numbering. Passage-1 sets
// already end at Q13 and are left untouched.
const INTENSIVE_PASSAGE_TWO_NUMBERING_DELTA = -1

const shiftPlaceholders = (text: string, delta: number) =>
  String(text || '').replace(/\{(\d+)\}/g, (_, token) => `{${Number(token) + delta}}`)

const shiftSummaryLine = (line: NewFillBlankSummaryLine, delta: number): NewFillBlankSummaryLine => {
  if (line.type === 'table-header' || line.type === 'table-row') {
    return { ...line, cells: line.cells.map((cell) => shiftPlaceholders(cell, delta)) }
  }
  if ('text' in line) {
    return { ...line, text: shiftPlaceholders(line.text, delta) }
  }
  return line
}

const shiftInstructionLine = (line: string, start: number, end: number) => {
  if (/^Questions\s+\d+\s*[–-]\s*\d+/.test(line)) return `Questions ${start}–${end}`
  if (/boxes\s+\d+\s*[–-]\s*\d+/.test(line)) {
    return `Write your answers in boxes ${start}–${end} on your answer sheet.`
  }
  return line
}

const shiftFillBlankSet = (set: NewFillBlankSet, delta: number): NewFillBlankSet => {
  if (!delta) return set
  const startNumber = set.startNumber + delta
  const endNumber = set.endNumber + delta
  return {
    ...set,
    startNumber,
    endNumber,
    instructions: set.instructions.map((line) => shiftInstructionLine(line, startNumber, endNumber)),
    summaryLines: set.summaryLines.map((line) => shiftSummaryLine(line, delta)),
    questions: set.questions.map((question) => ({ ...question, number: question.number + delta }))
  }
}

const alignPassageTwoNumbering = (sets: NewFillBlankSet[]): NewFillBlankSet[] =>
  sets.map((set) =>
    set.passageNumber === 2 ? shiftFillBlankSet(set, INTENSIVE_PASSAGE_TWO_NUMBERING_DELTA) : set
  )

/** Hand-crafted fill-blank UI for Quest Log ด่าน 1–20 (intensive + merged pool stages). */
export const INTENSIVE_JOURNEY_FILL_BLANK_SETS: NewFillBlankSet[] = alignPassageTwoNumbering([
  ...INTENSIVE_JOURNEY_FILL_BLANK_STAGES_1_5,
  ...INTENSIVE_JOURNEY_FILL_BLANK_STAGES_6_17,
  ...INTENSIVE_JOURNEY_FILL_BLANK_STAGES_18_20
])
