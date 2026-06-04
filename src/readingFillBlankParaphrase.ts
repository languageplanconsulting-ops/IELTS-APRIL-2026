import type { NewFillBlankQuestion, NewFillBlankSet } from './readingNewFillBlankQuestions'

const FILL_PARAPHRASE_STOPWORDS = new Set([
  'about',
  'after',
  'also',
  'among',
  'around',
  'because',
  'before',
  'being',
  'between',
  'could',
  'during',
  'first',
  'from',
  'have',
  'into',
  'made',
  'many',
  'more',
  'most',
  'much',
  'once',
  'only',
  'other',
  'over',
  'some',
  'such',
  'than',
  'that',
  'their',
  'there',
  'these',
  'they',
  'this',
  'through',
  'under',
  'very',
  'were',
  'when',
  'where',
  'which',
  'while',
  'with',
  'without',
  'would'
])

const escapeRegExp = (value: string) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const tokenizeKeywords = (value: string) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3)

export const getDistinctivePassageTokens = (
  passageKeyword: string,
  questionKeyword: string,
  answer = ''
) => {
  const answerTokens = new Set(tokenizeKeywords(answer))
  const questionTokens = new Set(tokenizeKeywords(questionKeyword))
  return [...new Set(tokenizeKeywords(passageKeyword))].filter(
    (token) =>
      token.length >= 6 &&
      !questionTokens.has(token) &&
      !answerTokens.has(token) &&
      !FILL_PARAPHRASE_STOPWORDS.has(token)
  )
}

const questionsTouchingLine = (lineText: string, questions: NewFillBlankQuestion[]) =>
  questions
    .filter((question) => lineText.includes(`{${question.number}}`))
    .sort((first, second) => first.number - second.number)

const removeDistinctiveToken = (text: string, token: string) => {
  let result = text.replace(new RegExp(`\\b${escapeRegExp(token)}\\b`, 'gi'), ' ')
  // e.g. "high-quality" when the passage token is "quality"
  result = result.replace(
    new RegExp(`\\b\\w*${escapeRegExp(token)}\\w*\\b`, 'gi'),
    (match) => (match.includes('-') ? ' ' : match)
  )
  return result
}

const paraphraseClauseBeforeBlank = (
  clauseBefore: string,
  question: NewFillBlankQuestion,
  answerTokens: Set<string>,
  lineAfterBlank: string,
  lineDistinctiveTokens: string[]
) => {
  let before = String(clauseBefore || '').trimEnd()
  if (!before) return before

  const distinctive = [
    ...new Set([
      ...lineDistinctiveTokens,
      ...getDistinctivePassageTokens(
        question.passageKeyword,
        question.questionKeyword,
        question.answer
      )
    ])
  ].filter((token) => !answerTokens.has(token))

  for (const token of distinctive) {
    before = removeDistinctiveToken(before, token)
  }

  const questionTokens = tokenizeKeywords(question.questionKeyword)
  const missingTokens = questionTokens.filter(
    (token) =>
      token.length >= 3 &&
      !answerTokens.has(token) &&
      !new RegExp(`\\b${escapeRegExp(token)}\\b`, 'i').test(before) &&
      !new RegExp(`\\b${escapeRegExp(token)}\\b`, 'i').test(lineAfterBlank)
  )

  if (missingTokens.length) {
    before = `${before} ${missingTokens.join(' ')}`.trim()
  }

  return before
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

export const textBeforeFillBlank = (
  lineText: string,
  questionNumber: number,
  questions: NewFillBlankQuestion[]
) => {
  const touching = questionsTouchingLine(lineText, questions)
  const index = touching.findIndex((question) => question.number === questionNumber)
  if (index < 0) {
    const marker = `{${questionNumber}}`
    const markerIndex = lineText.indexOf(marker)
    return markerIndex < 0 ? lineText : lineText.slice(0, markerIndex)
  }

  const start =
    index === 0
      ? 0
      : lineText.indexOf(`{${touching[index - 1].number}}`) +
        `{${touching[index - 1].number}}`.length
  const end = lineText.indexOf(`{${questionNumber}}`)
  return end < 0 ? lineText.slice(start) : lineText.slice(start, end)
}

export const paraphraseFillBlankSummaryLineText = (
  lineText: string,
  questions: NewFillBlankQuestion[]
) => {
  const source = String(lineText || '').trim()
  if (!source) return source

  const touching = questionsTouchingLine(source, questions)
  if (!touching.length) return source

  const answerTokens = new Set(
    questions.flatMap((question) => tokenizeKeywords(question.answer))
  )
  const lineDistinctiveTokens = [
    ...new Set(
      touching.flatMap((question) =>
        getDistinctivePassageTokens(
          question.passageKeyword,
          question.questionKeyword,
          question.answer
        )
      )
    )
  ]

  let cursor = 0
  const chunks: string[] = []

  for (const question of touching) {
    const marker = `{${question.number}}`
    const index = source.indexOf(marker, cursor)
    if (index < 0) continue

    const clauseBefore = source.slice(cursor, index)
    const lineAfterBlank = source.slice(index + marker.length)
    const before = paraphraseClauseBeforeBlank(
      clauseBefore,
      question,
      answerTokens,
      lineAfterBlank,
      lineDistinctiveTokens
    )
    chunks.push(before, marker)
    cursor = index + marker.length
  }

  chunks.push(source.slice(cursor))

  return chunks
    .filter((chunk) => chunk !== '')
    .join(' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

export const paraphraseFillBlankSummaryLines = <
  T extends { type: string; text?: string }
>(
  summaryLines: T[],
  questions: NewFillBlankQuestion[]
) =>
  summaryLines.map((line) => {
    if (line.type === 'diagram' || !('text' in line) || !line.text) return line
    return {
      ...line,
      text: paraphraseFillBlankSummaryLineText(line.text, questions)
    }
  })

export const paraphraseFillBlankSet = (set: NewFillBlankSet): NewFillBlankSet => ({
  ...set,
  summaryLines: paraphraseFillBlankSummaryLines(set.summaryLines, set.questions)
})
