import {
  buildReadingFillQuestionGroups,
  isReadingFillQuestion,
  isReadingFillSectionBlock,
  isReadingFillStylePrompt,
  type ReadingFillQuestionGroup
} from './readingFillDisplay'

export type ReadingQuestionDisplayOption = { letter: string; text: string }

export type ReadingPassageForDisplay = {
  number: number
  questionSectionText: string
  questionRanges?: Array<{ start: number; end: number }>
  bodyParagraphs?: string[]
  questions?: Array<{
    number: number
    prompt: string
    correctAnswer: string
    answerType: string
  }>
}

export type ReadingQuestionForDisplay = NonNullable<ReadingPassageForDisplay['questions']>[number]

export type ReadingMatchingGroupKind = 'heading' | 'information' | 'statement'

export type ReadingMatchingGroup = {
  id: string
  kind: ReadingMatchingGroupKind
  start: number
  end: number
  instruction: string
  choiceOptions: ReadingQuestionDisplayOption[]
  questions: ReadingQuestionForDisplay[]
}

export type ReadingMcqGroup = {
  id: string
  start: number
  end: number
  instruction: string
  questions: ReadingQuestionForDisplay[]
}

export type ReadingJudgementGroup = {
  id: string
  start: number
  end: number
  instruction: string
  judgementType: 'yes-no-not-given' | 'true-false-not-given'
  questions: ReadingQuestionForDisplay[]
}

export type ReadingChooseTwoGroup = {
  id: string
  start: number
  end: number
  instruction: string
  choiceOptions: ReadingQuestionDisplayOption[]
  questions: ReadingQuestionForDisplay[]
}

export type ReadingQuestionDisplayMode =
  | 'mcq-group'
  | 'judgement-group'
  | 'matching-group'
  | 'fill-group'
  | 'choose-two-group'
  | 'fill-fallback'
  | 'individual'

const READING_LETTER_OPTION_LINE = /^([A-J])\s+(.+)$/i
const READING_QUESTION_SECTION_HEADER_REGEX =
  /(?:^|\n)\s*(?:#+\s*)?Questions?\s+(\d+)(?:\s*[–-]\s*(\d+)|\s+and\s+(\d+))?/gi
const READING_ROMAN_HEADING_PATTERN = /^(?:i|ii|iii|iv|v|vi|vii|viii|ix|x)$/i
const READING_CHOOSE_TWO_SECTION_PATTERN = /choose\s+two\s+letters?/i

const canonicalizeReadingCorrectAnswer = (value: string) =>
  String(value || '')
    .trim()
    .replace(/\s+/g, ' ')
    .toUpperCase()

export const inferReadingQuestionRangesFromSection = (questionSectionText: string) => {
  const source = String(questionSectionText || '')
  READING_QUESTION_SECTION_HEADER_REGEX.lastIndex = 0
  const ranges = [...source.matchAll(READING_QUESTION_SECTION_HEADER_REGEX)].map((match) => {
    const start = Number(match[1])
    const end = Number(match[2] || match[3] || match[1])
    return { start: Math.min(start, end), end: Math.max(start, end) }
  })
  return ranges.filter(
    (range, index) =>
      ranges.findIndex((other) => other.start === range.start && other.end === range.end) === index
  )
}

export const getReadingQuestionRanges = (passage: ReadingPassageForDisplay | null) => {
  if (!passage) return []
  if (passage.questionRanges?.length) return passage.questionRanges
  return inferReadingQuestionRangesFromSection(passage.questionSectionText || '')
}

const extractReadingQuestionSectionBlock = (
  questionSectionText: string,
  start: number,
  end: number
) => {
  const source = String(questionSectionText || '')
  READING_QUESTION_SECTION_HEADER_REGEX.lastIndex = 0
  const matches = [...source.matchAll(READING_QUESTION_SECTION_HEADER_REGEX)]
  const matchingIndices = matches
    .map((match, index) => {
      const rangeStart = Number(match[1])
      const rangeEnd = Number(match[2] || match[3] || match[1])
      const min = Math.min(rangeStart, rangeEnd)
      const max = Math.max(rangeStart, rangeEnd)
      return start >= min && end <= max ? index : -1
    })
    .filter((index) => index >= 0)

  if (!matchingIndices.length) return ''

  const matchIndex = matchingIndices.reduce((bestIndex, currentIndex) => {
    const best = matches[bestIndex]
    const current = matches[currentIndex]
    const bestStart = Number(best[1])
    const bestEnd = Number(best[2] || best[3] || best[1])
    const currentStart = Number(current[1])
    const currentEnd = Number(current[2] || current[3] || current[1])
    const bestSpan = Math.max(bestStart, bestEnd) - Math.min(bestStart, bestEnd)
    const currentSpan = Math.max(currentStart, currentEnd) - Math.min(currentStart, currentEnd)
    return currentSpan < bestSpan ? currentIndex : bestIndex
  })

  const current = matches[matchIndex]
  const next = matches[matchIndex + 1]
  return source.slice(current.index ?? 0, next?.index ?? source.length).trim()
}

export const extractReadingQuestionRangeBlock = (questionSectionText: string, start: number, end: number) => {
  const sectionBlock = extractReadingQuestionSectionBlock(questionSectionText, start, end)
  if (sectionBlock) return sectionBlock

  const lines = String(questionSectionText || '').split('\n')
  const startPattern = new RegExp(`^\\s*${start}\\s`)
  const endPattern = new RegExp(`^\\s*${end + 1}\\s`)
  let capturing = false
  const captured: string[] = []
  for (const line of lines) {
    if (!capturing && startPattern.test(line)) capturing = true
    if (!capturing) continue
    if (endPattern.test(line) && captured.length > 0) break
    captured.push(line)
  }
  return captured.join('\n').trim()
}

export const findReadingQuestionRange = (
  passage: ReadingPassageForDisplay | null,
  question: ReadingQuestionForDisplay
) => {
  const ranges = getReadingQuestionRanges(passage)
  const matches = ranges.filter(
    (range) => question.number >= range.start && question.number <= range.end
  )
  if (matches.length) {
    return matches.reduce((best, range) => {
      const bestSpan = best.end - best.start
      const rangeSpan = range.end - range.start
      return rangeSpan < bestSpan ? range : best
    })
  }
  return { start: question.number, end: question.number }
}

export const extractReadingQuestionBlock = (questionSectionText: string, questionNumber: number) => {
  const escapedNumber = String(questionNumber).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = new RegExp(
    `(?:^|\\n)\\s*${escapedNumber}\\s*[.)]\\s+([\\s\\S]*?)(?=\\n\\s*\\d+\\s*[.)]\\s+|\\n\\s*\\d+\\s*[.)]?\\s+|$)`,
    'i'
  )
  const match = String(questionSectionText || '').match(pattern)
  return String(match?.[1] || '').trim()
}

export const readingBlockHasPerQuestionLetterOptions = (sourceText: string) => {
  const text = String(sourceText || '')
  const questionStarts = [...text.matchAll(/(?:^|\n)\s*(\d+)\s*[.)]?\s+/gm)]
  if (!questionStarts.length) return false

  for (let index = 0; index < questionStarts.length; index += 1) {
    const start = questionStarts[index].index ?? 0
    const end = questionStarts[index + 1]?.index ?? text.length
    const chunk = text.slice(start, end)
    const optionCount = chunk
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => READING_LETTER_OPTION_LINE.test(line)).length
    if (optionCount >= 2) return true
  }

  return false
}

export const isReadingStandardMcqBlock = (block: string) =>
  /choose the correct letter/i.test(String(block || '')) &&
  readingBlockHasPerQuestionLetterOptions(block)

export const isReadingJudgementBlock = (block: string) => {
  const normalized = String(block || '')
  if (/which (?:paragraph|section) contains|choose the correct letter|complete the (?:notes|summary|sentences|table)/i.test(normalized)) {
    return false
  }
  if (/do the following statements/i.test(normalized)) {
    return /TRUE\s+if\s+the\s+statement|FALSE\s+if\s+the\s+statement|NOT\s+GIVEN|YES\s+if\s+the\s+statement|NO\s+if\s+the\s+statement|agree with the (?:views|information|claims)/i.test(
      normalized
    )
  }
  if (/YES\s*\/\s*NO|TRUE\s*\/\s*FALSE/i.test(normalized)) {
    const statementLines = normalized
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => /^\d+[\.)]?\s+\S/.test(line))
    return statementLines.length >= 2
  }
  return false
}

const extractSharedReadingLetterOptionBank = (sourceText: string) => {
  if (readingBlockHasPerQuestionLetterOptions(sourceText)) return []

  const lines = String(sourceText || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
  const bankLines: string[] = []

  for (let index = lines.length - 1; index >= 0; index -= 1) {
    if (READING_LETTER_OPTION_LINE.test(lines[index])) {
      bankLines.unshift(lines[index])
    } else if (bankLines.length >= 3) {
      break
    } else {
      bankLines.length = 0
    }
  }

  if (bankLines.length < 3) return []

  return bankLines
    .map((line) => {
      const match = line.match(READING_LETTER_OPTION_LINE)
      if (!match) return null
      return { letter: match[1].toUpperCase(), text: match[2].trim() }
    })
    .filter(Boolean) as ReadingQuestionDisplayOption[]
}

const isReadingLetterBankMatchingBlock = (block: string) => {
  const normalized = String(block || '')
  if (isReadingStandardMcqBlock(normalized)) return false
  if (isReadingFillSectionBlock(normalized)) return false
  if (/match\s+each/i.test(normalized)) return true
  if (/complete each sentence/i.test(normalized)) return true
  if (/for which (?:apartment|section|paragraph)/i.test(normalized)) return true
  if (
    /following statements? (?:are )?true/i.test(normalized) &&
    /write the correct letter/i.test(normalized)
  ) {
    return true
  }
  return extractSharedReadingLetterOptionBank(normalized).length >= 3
}

const isReadingMatchingHeadingQuestion = (
  passage: ReadingPassageForDisplay | null,
  question: ReadingQuestionForDisplay | null
) => {
  if (!question) return false
  const prompt = String(question.prompt || '').trim()
  const answer = String(question.correctAnswer || '').trim()

  if (
    /^which\s+two\b|^match\s+each\b|^complete the\s+(?:summary|sentences|notes|table)\b|^true\s*\/\s*false|^yes\s*\/\s*no/i.test(
      prompt
    )
  ) {
    return false
  }

  if (
    /^heading for (?:paragraph|section)/i.test(prompt) ||
    /^heading (?:paragraph|section)/i.test(prompt) ||
    /choose the correct heading/i.test(prompt)
  ) {
    return true
  }
  if (
    READING_ROMAN_HEADING_PATTERN.test(answer) &&
    (/^(?:paragraph|section)\s+[A-G]\b/i.test(prompt) || /^section\s*[A-G]$/i.test(prompt))
  ) {
    return true
  }

  if (passage && READING_ROMAN_HEADING_PATTERN.test(answer)) {
    const range = findReadingQuestionRange(passage, question)
    const block = extractReadingQuestionRangeBlock(passage.questionSectionText || '', range.start, range.end)
    if (
      /choose the correct heading|list of headings/i.test(block) &&
      /(?:paragraph|section)s?,?\s+[A-H]/i.test(block)
    ) {
      return true
    }
  }

  return false
}

const getReadingParagraphAnswerLetters = (sectionText: string) => {
  const source = String(sectionText || '')
  const rangeMatch =
    source.match(/\b([A-Z])\s*[-–—]\s*([A-Z])\b/i) ||
    source.match(/paragraphs?,?\s+([A-H])\s*[-–—]\s*([A-H])/i) ||
    source.match(/boxes\s+([A-H])\s*[-–—]\s*([A-H])/i)
  if (!rangeMatch) return null
  const startCode = rangeMatch[1].toUpperCase().charCodeAt(0)
  const endCode = rangeMatch[2].toUpperCase().charCodeAt(0)
  if (endCode < startCode) return null
  return Array.from({ length: endCode - startCode + 1 }, (_, index) =>
    String.fromCharCode(startCode + index)
  )
}

const isReadingMatchingInformationQuestion = (
  passage: ReadingPassageForDisplay | null,
  question: ReadingQuestionForDisplay | null
) => {
  if (!question || !passage) return false
  const range = findReadingQuestionRange(passage, question)
  const block = extractReadingQuestionRangeBlock(passage.questionSectionText || '', range.start, range.end)
  if (!/which (?:paragraph|section) contains|contains the following information/i.test(block)) {
    return false
  }
  const answer = canonicalizeReadingCorrectAnswer(question.correctAnswer)
  const allowedLetters = getReadingParagraphAnswerLetters(block)
  if (allowedLetters?.length) {
    return allowedLetters.includes(answer.toUpperCase())
  }
  return /^[A-G]$/.test(answer)
}

const isReadingMatchingStatementQuestion = (
  passage: ReadingPassageForDisplay | null,
  question: ReadingQuestionForDisplay | null
) => {
  if (!question) return false
  if (isReadingMatchingHeadingQuestion(passage, question) || isReadingMatchingInformationQuestion(passage, question)) {
    return false
  }
  const answer = canonicalizeReadingCorrectAnswer(question.correctAnswer)
  if (!/^[A-J]$/i.test(answer)) return false
  const range = findReadingQuestionRange(passage, question)
  const block = extractReadingQuestionRangeBlock(passage?.questionSectionText || '', range.start, range.end)
  if (isReadingStandardMcqBlock(block)) return false
  if (isReadingFillSectionBlock(block)) return false
  return isReadingLetterBankMatchingBlock(block)
}

export const getReadingMatchingQuestionKind = (
  passage: ReadingPassageForDisplay | null,
  question: ReadingQuestionForDisplay | null
): ReadingMatchingGroupKind | null => {
  if (isReadingMatchingHeadingQuestion(passage, question)) return 'heading'
  if (isReadingMatchingInformationQuestion(passage, question)) return 'information'
  if (isReadingMatchingStatementQuestion(passage, question)) return 'statement'
  return null
}

export const isReadingMatchingQuestion = (
  passage: ReadingPassageForDisplay | null,
  question: ReadingQuestionForDisplay | null
) => getReadingMatchingQuestionKind(passage, question) !== null

export const isReadingJudgementQuestion = (question: ReadingQuestionForDisplay | null) =>
  question?.answerType === 'true-false-not-given' || question?.answerType === 'yes-no-not-given'

const isReadingChooseTwoSectionBlock = (block: string) => READING_CHOOSE_TWO_SECTION_PATTERN.test(block)

const isReadingChooseTwoQuestion = (
  passage: ReadingPassageForDisplay | null,
  question: ReadingQuestionForDisplay | null
) => {
  if (!question || question.answerType !== 'multiple-choice' || !passage) return false
  const range = findReadingQuestionRange(passage, question)
  const block = extractReadingQuestionRangeBlock(passage.questionSectionText || '', range.start, range.end)
  return isReadingChooseTwoSectionBlock(block)
}

export const extractReadingMultipleChoiceOptions = (
  passage: ReadingPassageForDisplay | null,
  question: ReadingQuestionForDisplay | null
): ReadingQuestionDisplayOption[] => {
  if (!passage || !question) return []

  const range = findReadingQuestionRange(passage, question)
  const sectionBlock = extractReadingQuestionRangeBlock(
    passage.questionSectionText || '',
    range.start,
    range.end
  )
  if (sectionBlock && isReadingChooseTwoSectionBlock(sectionBlock)) {
    const fromSection = String(sectionBlock || '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const match = line.match(/^([A-H])\s+(.+)$/i)
        if (!match) return null
        return { letter: match[1].toUpperCase(), text: match[2].trim() }
      })
      .filter(Boolean) as ReadingQuestionDisplayOption[]
    if (fromSection.length) return fromSection
  }

  const block = extractReadingQuestionBlock(
    sectionBlock || passage.questionSectionText,
    question.number
  )
  const optionSource = block || sectionBlock || passage.questionSectionText
  return String(optionSource || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^([A-G])[\).:\-]?\s+(.+)$/i)
      if (!match) return null
      return { letter: match[1].toUpperCase(), text: match[2].trim() }
    })
    .filter(Boolean) as ReadingQuestionDisplayOption[]
}

export const getReadingMultipleChoicePromptStem = (
  passage: ReadingPassageForDisplay | null,
  question: ReadingQuestionForDisplay
) => {
  const range = findReadingQuestionRange(passage, question)
  const scopedSection = extractReadingQuestionRangeBlock(
    passage?.questionSectionText || '',
    range.start,
    range.end
  )
  const block = extractReadingQuestionBlock(
    scopedSection || passage?.questionSectionText || '',
    question.number
  )

  if (block) {
    const lines = block
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
    const stemLines: string[] = []
    for (const line of lines) {
      if (/^[A-G][\).:\-]?\s+/i.test(line) || READING_LETTER_OPTION_LINE.test(line)) break
      stemLines.push(line)
    }
    if (stemLines.length) {
      return stemLines.join(' ').replace(/^\d+\.\s*/, '').trim()
    }

    const inline = block.replace(/^\d+\.\s*/, '').trim()
    const inlineCut = inline.search(/\s+[A-G][\).:\-]?\s+[A-Z"'(]/i)
    if (inlineCut > 20) return inline.slice(0, inlineCut).trim()
  }

  const prompt = String(question.prompt || '').replace(/\s+/g, ' ').trim()
  if (/^Questions?\s+\d+/i.test(prompt) && prompt.length > 120) return ''
  const inlineCut = prompt.search(/\s+[A-G][\).:\-]?\s+[A-Z"'(]/i)
  if (inlineCut > 20) return prompt.slice(0, inlineCut).trim()
  return prompt
}

export const getReadingQuestionDisplayPrompt = (
  passage: ReadingPassageForDisplay | null,
  question: ReadingQuestionForDisplay
) => {
  if (question.answerType === 'multiple-choice' && !isReadingChooseTwoQuestion(passage, question)) {
    const stem = getReadingMultipleChoicePromptStem(passage, question)
    if (stem) return stem
  }
  const prompt = String(question.prompt || '').replace(/\s+/g, ' ').trim()
  if (/^Questions?\s+\d+/i.test(prompt) && prompt.length > 120) {
    return getReadingMultipleChoicePromptStem(passage, question) || `Question ${question.number}`
  }
  return prompt
}

const buildReadingMatchingGroups = (
  passage: ReadingPassageForDisplay | null,
  questions: ReadingQuestionForDisplay[]
): ReadingMatchingGroup[] => {
  if (!passage) return []

  const groups: ReadingMatchingGroup[] = []
  let pending: ReadingQuestionForDisplay[] = []
  let pendingKind: ReadingMatchingGroupKind | null = null

  const flush = () => {
    if (!pending.length || !pendingKind) return
    const start = pending[0].number
    const end = pending[pending.length - 1].number
    const block = extractReadingQuestionRangeBlock(passage.questionSectionText || '', start, end)
    const choiceOptions = extractSharedReadingLetterOptionBank(block)
    groups.push({
      id: `${passage.number}-${pendingKind}-${start}-${end}`,
      kind: pendingKind,
      start,
      end,
      instruction: block.split('\n').filter((line) => !/^\d+\s/.test(line.trim())).slice(0, 4).join('\n'),
      choiceOptions,
      questions: [...pending]
    })
    pending = []
    pendingKind = null
  }

  questions.forEach((question) => {
    const kind = getReadingMatchingQuestionKind(passage, question)
    if (!kind) {
      flush()
      return
    }
    if (pendingKind && pendingKind !== kind) flush()
    pendingKind = kind
    pending.push(question)
  })
  flush()

  return groups
}

export const buildReadingMcqGroups = (
  passage: ReadingPassageForDisplay | null,
  questions: ReadingQuestionForDisplay[]
): ReadingMcqGroup[] => {
  if (!passage) return []

  const groups: ReadingMcqGroup[] = []
  getReadingQuestionRanges(passage).forEach((range) => {
    const block = extractReadingQuestionRangeBlock(passage.questionSectionText || '', range.start, range.end)
    if (!block || !isReadingStandardMcqBlock(block)) return

    const rangeQuestions = questions.filter((question) => {
      if (question.number < range.start || question.number > range.end) return false
      if (question.answerType !== 'multiple-choice') return false
      if (isReadingChooseTwoQuestion(passage, question)) return false
      if (isReadingMatchingQuestion(passage, question)) return false
      if (/which (?:paragraph|section) contains/i.test(block)) return false
      return true
    })
    if (!rangeQuestions.length) return

    groups.push({
      id: `${passage.number}-mcq-${range.start}-${range.end}`,
      start: range.start,
      end: range.end,
      instruction: block
        .split('\n')
        .filter(
          (line) =>
            !/^\d+[\.)]?\s+/.test(line.trim()) &&
            !READING_LETTER_OPTION_LINE.test(line.trim()) &&
            /questions?|choose the correct letter|write the correct letter/i.test(line)
        )
        .join('\n')
        .trim(),
      questions: [...rangeQuestions]
    })
  })

  return groups.sort((first, second) => first.start - second.start)
}

export const buildReadingJudgementGroups = (
  passage: ReadingPassageForDisplay | null,
  questions: ReadingQuestionForDisplay[]
): ReadingJudgementGroup[] => {
  if (!passage) return []

  const groups: ReadingJudgementGroup[] = []
  getReadingQuestionRanges(passage).forEach((range) => {
    const block = extractReadingQuestionRangeBlock(passage.questionSectionText || '', range.start, range.end)
    const rangeQuestions = questions.filter(
      (question) =>
        question.number >= range.start &&
        question.number <= range.end &&
        isReadingJudgementQuestion(question)
    )
    if (!rangeQuestions.length) return
    if (!isReadingJudgementBlock(block)) {
      if (rangeQuestions.length < 2) return
      if (
        block &&
        /which (?:paragraph|section) contains|choose the correct letter|complete the (?:notes|summary|sentences|table)/i.test(
          block
        )
      ) {
        return
      }
    }

    groups.push({
      id: `${passage.number}-judgement-${range.start}-${range.end}`,
      start: range.start,
      end: range.end,
      instruction: block
        .split('\n')
        .filter(
          (line) =>
            !/^\d+[\.)]?\s+/.test(line.trim()) &&
            /questions?|do the following|agree with|write\s+(?:yes|no|true|false|not given)/i.test(line)
        )
        .join('\n')
        .trim(),
      judgementType: rangeQuestions.some((question) => question.answerType === 'true-false-not-given')
        ? 'true-false-not-given'
        : 'yes-no-not-given',
      questions: [...rangeQuestions]
    })
  })

  return groups.sort((first, second) => first.start - second.start)
}

const buildReadingChooseTwoGroups = (
  passage: ReadingPassageForDisplay | null,
  questions: ReadingQuestionForDisplay[]
): ReadingChooseTwoGroup[] => {
  if (!passage) return []

  const groups: ReadingChooseTwoGroup[] = []
  getReadingQuestionRanges(passage).forEach((range) => {
    const block = extractReadingQuestionRangeBlock(passage.questionSectionText || '', range.start, range.end)
    if (!block || !isReadingChooseTwoSectionBlock(block)) return

    const rangeQuestions = questions.filter(
      (question) =>
        question.number >= range.start &&
        question.number <= range.end &&
        isReadingChooseTwoQuestion(passage, question)
    )
    if (rangeQuestions.length < 2) return

    const choiceOptions = String(block || '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const match = line.match(/^([A-H])\s+(.+)$/i)
        if (!match) return null
        return { letter: match[1].toUpperCase(), text: match[2].trim() }
      })
      .filter(Boolean) as ReadingQuestionDisplayOption[]

    groups.push({
      id: `${passage.number}-choose-two-${range.start}-${range.end}`,
      start: range.start,
      end: range.end,
      instruction: block,
      choiceOptions,
      questions: [...rangeQuestions]
    })
  })

  return groups.sort((first, second) => first.start - second.start)
}

export type ReadingQuestionDisplayPlan = {
  mode: ReadingQuestionDisplayMode
  mcqGroups: ReadingMcqGroup[]
  judgementGroups: ReadingJudgementGroup[]
  matchingGroups: ReadingMatchingGroup[]
  fillGroups: ReadingFillQuestionGroup[]
  chooseTwoGroups: ReadingChooseTwoGroup[]
  byQuestionNumber: Map<number, ReadingQuestionDisplayMode>
}

export const buildReadingQuestionDisplayPlan = (
  passage: ReadingPassageForDisplay | null,
  questions: ReadingQuestionForDisplay[],
  examId?: string | null
): ReadingQuestionDisplayPlan => {
  const mcqGroups = buildReadingMcqGroups(passage, questions)
  const judgementGroups = buildReadingJudgementGroups(passage, questions)
  const matchingGroups = buildReadingMatchingGroups(passage, questions)
  const fillGroups = buildReadingFillQuestionGroups(
    passage,
    questions,
    isReadingMatchingQuestion,
    examId
  )
  const chooseTwoGroups = buildReadingChooseTwoGroups(passage, questions)

  const byQuestionNumber = new Map<number, ReadingQuestionDisplayMode>()

  const markGroup = (groupQuestions: ReadingQuestionForDisplay[], mode: ReadingQuestionDisplayMode) => {
    groupQuestions.forEach((question) => byQuestionNumber.set(question.number, mode))
  }

  mcqGroups.forEach((group) => markGroup(group.questions, 'mcq-group'))
  judgementGroups.forEach((group) => markGroup(group.questions, 'judgement-group'))
  matchingGroups.forEach((group) => markGroup(group.questions, 'matching-group'))
  fillGroups.forEach((group) => markGroup(group.questions, 'fill-group'))
  chooseTwoGroups.forEach((group) => markGroup(group.questions, 'choose-two-group'))

  questions.forEach((question) => {
    if (byQuestionNumber.has(question.number)) return
    if (isReadingFillQuestion(passage, question, isReadingMatchingQuestion)) {
      byQuestionNumber.set(question.number, 'fill-fallback')
      return
    }
    if (question.answerType === 'text' && isReadingFillStylePrompt(question.prompt, question.number)) {
      byQuestionNumber.set(question.number, 'fill-fallback')
      return
    }
    byQuestionNumber.set(question.number, 'individual')
  })

  return {
    mode: 'individual',
    mcqGroups,
    judgementGroups,
    matchingGroups,
    fillGroups,
    chooseTwoGroups,
    byQuestionNumber
  }
}

export const auditReadingQuestionDisplayPlan = (
  passage: ReadingPassageForDisplay | null,
  questions: ReadingQuestionForDisplay[],
  examId?: string | null
) => {
  const plan = buildReadingQuestionDisplayPlan(passage, questions, examId)
  const issues: Array<{ question: number; kind: string; detail?: string }> = []

  questions.forEach((question) => {
    const mode = plan.byQuestionNumber.get(question.number)
    if (!mode) {
      issues.push({ question: question.number, kind: 'unclassified' })
      return
    }

    if (mode === 'individual' && question.answerType === 'multiple-choice') {
      const options = extractReadingMultipleChoiceOptions(passage, question)
      const stem = getReadingQuestionDisplayPrompt(passage, question)
      if (options.length < 2) {
        issues.push({ question: question.number, kind: 'mcq-no-options', detail: stem.slice(0, 80) })
      }
      if (stem.length > 280 || /^Questions?\s+\d+-\d+/i.test(stem)) {
        issues.push({ question: question.number, kind: 'mcq-blob-stem', detail: stem.slice(0, 100) })
      }
    }

    if (mode === 'matching-group') {
      const group = plan.matchingGroups.find(
        (item) => question.number >= item.start && question.number <= item.end
      )
      if (group?.kind === 'statement' && isReadingStandardMcqBlock(
        extractReadingQuestionRangeBlock(passage?.questionSectionText || '', group.start, group.end)
      )) {
        issues.push({ question: question.number, kind: 'mcq-as-matching' })
      }
    }

    if (mode === 'fill-group' || mode === 'fill-fallback') {
      const group = plan.fillGroups.find(
        (item) => question.number >= item.start && question.number <= item.end
      )
      if (group && !group.displayLines.some((line) =>
        [...(line.procedureSegments || []), ...line.segments].some(
          (segment) => segment.kind === 'blank' && segment.questionNumber === question.number
        )
      )) {
        issues.push({ question: question.number, kind: 'fill-no-blank' })
      }
    }

    if (mode === 'individual' && isReadingJudgementQuestion(question)) {
      issues.push({ question: question.number, kind: 'judgement-not-grouped' })
    }
  })

  return { plan, issues }
}
