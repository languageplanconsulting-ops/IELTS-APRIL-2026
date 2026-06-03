import type { NewFillBlankQuestion, NewFillBlankSet } from './readingNewFillBlankQuestions'

const GARBLED_SUMMARY_PATTERNS = [
  /answer signal/i,
  /vooitisnn/i,
  /n\.usnmmmm|ccscscss|mnmnmm|nmnmmemn/i,
  /Key points from the passage/i,
  /SUFr|USEd|PrOd|WEE\s/,
  /\{[^0-9]/,
  /\uFFFD/,
  /[.]{5,}/,
  /(.{8,})\1/i
]

const ALLOWED_ACRONYMS = new Set(['rovs', 'rna', 'dna', 'tcas', 'hiv', 'uk', 'usa', 'eu'])

/** Reject auto-generated summaries with OCR junk or duplicated phrases. */
export const isGarbledFillBlankSummaryText = (text: string) => {
  const source = String(text || '').trim()
  if (!source) return true

  for (const pattern of GARBLED_SUMMARY_PATTERNS) {
    if (pattern.test(source)) return true
  }

  const acronymMatch = source.match(/\b[A-Z]{3,}[a-z]\w*\b/g) || []
  for (const token of acronymMatch) {
    if (!ALLOWED_ACRONYMS.has(token.toLowerCase())) return true
  }

  return false
}

export const fillBlankSetHasMissingBlankMarkers = (set: NewFillBlankSet) =>
  set.questions.some(
    (question) => !set.summaryLines.some((line) => line.text.includes(`{${question.number}}`))
  )

export const isLowQualityFillBlankSet = (set: NewFillBlankSet) => {
  const allText = set.summaryLines.map((line) => line.text || '').join(' ')
  if (!/\{\d+\}/.test(allText)) return true
  if (fillBlankSetHasMissingBlankMarkers(set)) return true
  if (isGarbledFillBlankSummaryText(allText)) return true
  return false
}

export const fillBlankSetsOverlap = (left: NewFillBlankSet, right: NewFillBlankSet) =>
  left.examId === right.examId &&
  !(left.endNumber < right.startNumber || left.startNumber > right.endNumber)

export const validateFillBlankQuestionMarkers = (
  summaryLines: NewFillBlankSet['summaryLines'],
  questions: NewFillBlankQuestion[]
) =>
  questions.every((question) =>
    summaryLines.some((line) => line.text.includes(`{${question.number}}`))
  )
