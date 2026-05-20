type FillPassage = {
  number: number
  questionSectionText: string
  questionRanges?: Array<{ start: number; end: number }>
}

type FillQuestion = {
  number: number
  prompt: string
  correctAnswer: string
  answerType: string
}

export type ReadingFillLineSegment =
  | { kind: 'text' | 'heading' | 'clue'; text: string }
  | { kind: 'blank'; questionNumber: number; before: string; after: string }

export type ReadingFillDisplayLine = {
  segments: ReadingFillLineSegment[]
}

export type ReadingFillQuestionGroup = {
  id: string
  start: number
  end: number
  instruction: string
  displayLines: ReadingFillDisplayLine[]
  questions: FillQuestion[]
}

const READING_FILL_SECTION_PATTERN =
  /complete the (?:notes|sentences|summary|table)|choose (?:one|no more than)|write one word only|each gap|fill in the/i

/** Number followed by dot-like blank markers (single … or multiple dots/underscores). */
export const READING_FILL_BLANK_IN_LINE = /\b(\d+)\s*([.．…⋯·•_\-–—]+)/g

const stripFillPromptPrefix = (value: string) =>
  String(value || '')
    .replace(/^Complete the (?:notes|summary|sentences|table):?\s*/i, '')
    .replace(/^Questions?\s+\d+\s*[–-]\s*\d+\s*/i, '')
    .trim()

export const parseFillContextFromPrompt = (
  prompt: string,
  questionNumber: number
): { before: string; after: string } | null => {
  const cleaned = stripFillPromptPrefix(prompt)
  if (!cleaned) return null

  const numberedPatterns = [
    new RegExp(`^(.*?)\\b${questionNumber}\\s*([.．…⋯·•_\\-–—]+)\\s*(.*)$`, 'i'),
    new RegExp(`^(.*?)\\b${questionNumber}\\s+\\.\\s*([.．…⋯·•_\\-–—]+)\\s*(.*)$`, 'i')
  ]
  for (const pattern of numberedPatterns) {
    const match = cleaned.match(pattern)
    if (match) {
      return { before: match[1].trim(), after: match[3]?.trim() || '' }
    }
  }

  const underscore = cleaned.match(/^(.*?)_{2,}\s*(.*)$/s)
  if (underscore) {
    return { before: underscore[1].trim(), after: underscore[2]?.trim() || '' }
  }

  const trailingDotsWithTail = cleaned.match(/^(.*?)([.．…⋯]{2,})\s*(.*)$/s)
  if (trailingDotsWithTail) {
    return { before: trailingDotsWithTail[1].trim(), after: trailingDotsWithTail[3]?.trim() || '' }
  }

  const trailingDotsOnly = cleaned.match(/^(.*?)(?:[.．…⋯]{1,})\s*$/s)
  if (trailingDotsOnly && trailingDotsOnly[1].trim().length >= 8) {
    return { before: trailingDotsOnly[1].trim(), after: '' }
  }

  return null
}

export const isReadingFillSectionBlock = (block: string) => READING_FILL_SECTION_PATTERN.test(block)

export const isReadingLetterSummaryFill = (block: string, question: FillQuestion) => {
  const answer = String(question.correctAnswer || '')
    .trim()
    .toUpperCase()
  if (!/^[A-J]$/.test(answer)) return false
  return /list of phrases|write the correct letter,\s*[A-J]/i.test(block)
}

export const isReadingFillQuestion = <P extends FillPassage, Q extends FillQuestion>(
  passage: P | null,
  question: Q | null,
  isMatchingQuestion: (passage: P | null, question: Q | null) => boolean
) => {
  if (!question || question.answerType !== 'text') return false
  if (isMatchingQuestion(passage, question)) return false
  if (!passage) return false
  const range = findReadingQuestionRange(passage, question)
  const block = extractReadingQuestionRangeBlock(passage.questionSectionText || '', range.start, range.end)
  if (!isReadingFillSectionBlock(block)) return false
  if (isReadingLetterSummaryFill(block, question)) return false
  return true
}

const isReadingFillBoilerplateLine = (line: string) =>
  /^Questions \d+/i.test(line) ||
  /^Complete the (?:notes|sentences|summary|table)/i.test(line) ||
  /^Choose (?:ONE WORD|NO MORE THAN)/i.test(line) ||
  /^Write your answers in boxes/i.test(line) ||
  /^Write the correct/i.test(line) ||
  /^Reading Passage \d+/i.test(line) ||
  /^In boxes \d+/i.test(line) ||
  /^[A-J]\s+/.test(line)

export const parseReadingFillLineSegments = (
  line: string,
  questionNumbers: Set<number>
): ReadingFillLineSegment[] => {
  const trimmed = line.trim()

  const leadingBlank = trimmed.match(/^(\d+)\s*([.．…⋯·•_\-–—]+)\s+(.+)$/)
  if (leadingBlank && questionNumbers.has(Number(leadingBlank[1]))) {
    return [
      {
        kind: 'blank',
        questionNumber: Number(leadingBlank[1]),
        before: '',
        after: leadingBlank[3].trim()
      }
    ]
  }

  const trailingBlank = trimmed.match(/^(\d+)\s+(.+?)\s*([.．…⋯·•_\-–—]+)\s*\.?\s*$/)
  if (trailingBlank && questionNumbers.has(Number(trailingBlank[1]))) {
    return [
      {
        kind: 'blank',
        questionNumber: Number(trailingBlank[1]),
        before: trailingBlank[2].trim(),
        after: ''
      }
    ]
  }

  READING_FILL_BLANK_IN_LINE.lastIndex = 0
  const matches = [...trimmed.matchAll(READING_FILL_BLANK_IN_LINE)].filter((match) =>
    questionNumbers.has(Number(match[1]))
  )

  if (!matches.length) {
    const text = trimmed
    const withoutBullet = text.replace(/^[•\-\*]\s*/, '').trim()
    if (
      withoutBullet.length > 0 &&
      withoutBullet.length < 80 &&
      /^[A-Z]/.test(withoutBullet) &&
      !withoutBullet.includes('.') &&
      !/^\d+\s/.test(withoutBullet)
    ) {
      return [{ kind: 'heading', text: withoutBullet }]
    }
    if (/^[•\-\*]/.test(text) || /^(?:must|should|need|have to)\b/i.test(withoutBullet)) {
      return [{ kind: 'clue', text: withoutBullet }]
    }
    return text ? [{ kind: 'text', text }] : []
  }

  const segments: ReadingFillLineSegment[] = []
  let lastIndex = 0

  matches.forEach((match, index) => {
    const questionNumber = Number(match[1])
    const start = match.index ?? 0
    const end = start + match[0].length
    const nextStart = matches[index + 1]?.index ?? trimmed.length

    if (start > lastIndex) {
      const beforeText = trimmed.slice(lastIndex, start).trim()
      if (beforeText) {
        segments.push({ kind: 'text', text: beforeText })
      }
    }

    const after = trimmed.slice(end, nextStart).trim()
    segments.push({ kind: 'blank', questionNumber, before: '', after })
    lastIndex = nextStart
  })

  if (lastIndex < trimmed.length) {
    const tail = trimmed.slice(lastIndex).trim()
    if (tail) {
      segments.push({ kind: 'text', text: tail })
    }
  }

  return segments
}

export const extractReadingFillDisplayLines = (
  block: string,
  questionNumbers: Set<number>,
  questions: FillQuestion[] = []
): ReadingFillDisplayLine[] => {
  const byNumber = new Map(questions.map((question) => [question.number, question]))
  const contentLines = block
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !isReadingFillBoilerplateLine(line))

  const displayLines = contentLines
    .map((line) => ({
      segments: parseReadingFillLineSegments(line, questionNumbers)
    }))
    .filter((line) => line.segments.length > 0)

  if (displayLines.length) {
    return enrichFillDisplayLines(displayLines, questions)
  }

  return [...questionNumbers]
    .sort((first, second) => first - second)
    .map((questionNumber) => {
      const question = byNumber.get(questionNumber)
      const context = question ? parseFillContextFromPrompt(question.prompt, questionNumber) : null
      return {
        segments: [
          {
            kind: 'blank' as const,
            questionNumber,
            before: context?.before || '',
            after: context?.after || ''
          }
        ]
      }
    })
}

export const enrichFillDisplayLines = (
  displayLines: ReadingFillDisplayLine[],
  questions: FillQuestion[]
): ReadingFillDisplayLine[] => {
  const byNumber = new Map(questions.map((question) => [question.number, question]))

  return displayLines.map((line) => ({
    segments: line.segments.map((segment, index, segments) => {
      if (segment.kind !== 'blank') return segment
      if (segment.before || segment.after) return segment

      const previous = segments[index - 1]
      if (previous?.kind === 'text' && previous.text.trim()) {
        return segment
      }

      const question = byNumber.get(segment.questionNumber)
      const context = question ? parseFillContextFromPrompt(question.prompt, segment.questionNumber) : null
      if (!context?.before && !context?.after) return segment

      return {
        ...segment,
        before: context.before,
        after: context.after || ''
      }
    })
  }))
}

const extractReadingFillGroupInstruction = (block: string) => {
  const lines = block
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
  const instructionLines = lines.filter((line) =>
    /complete the|choose (?:one|no more)|write one word|write your answers|from the passage|each gap/i.test(line)
  )
  return instructionLines.join('\n').trim()
}

export const buildReadingFillQuestionGroups = <P extends FillPassage, Q extends FillQuestion>(
  passage: P | null,
  questions: Q[],
  isMatchingQuestion: (passage: P | null, question: Q | null) => boolean
): ReadingFillQuestionGroup[] => {
  if (!passage) return []

  const groups: ReadingFillQuestionGroup[] = []
  const ranges = passage.questionRanges?.length ? passage.questionRanges : [{ start: 1, end: 999 }]

  ranges.forEach((range) => {
    const block = extractReadingQuestionRangeBlock(
      passage.questionSectionText || '',
      range.start,
      range.end
    )
    if (!block || !isReadingFillSectionBlock(block)) return

    const rangeQuestions = questions.filter(
      (question) =>
        question.number >= range.start &&
        question.number <= range.end &&
        isReadingFillQuestion(passage, question, isMatchingQuestion)
    )
    if (!rangeQuestions.length) return

    const questionNumbers = new Set(rangeQuestions.map((question) => question.number))
    groups.push({
      id: `${passage.number}-fill-${range.start}-${range.end}`,
      start: range.start,
      end: range.end,
      instruction: extractReadingFillGroupInstruction(block),
      displayLines: extractReadingFillDisplayLines(block, questionNumbers, rangeQuestions),
      questions: [...rangeQuestions]
    })
  })

  return groups.sort((first, second) => first.start - second.start)
}

const findReadingQuestionRange = (passage: FillPassage, question: FillQuestion) => {
  const ranges = passage.questionRanges || []
  const match = ranges.find(
    (range) => question.number >= range.start && question.number <= range.end
  )
  if (match) return match
  return { start: question.number, end: question.number }
}

const QUESTION_SECTION_HEADER_REGEX =
  /(?:^|\n)\s*Questions?\s+(\d+)(?:\s*[–-]\s*(\d+)|\s+and\s+(\d+))?/gi

const extractReadingQuestionSectionBlock = (
  questionSectionText: string,
  start: number,
  end: number
) => {
  const source = String(questionSectionText || '')
  QUESTION_SECTION_HEADER_REGEX.lastIndex = 0
  const matches = [...source.matchAll(QUESTION_SECTION_HEADER_REGEX)]
  const matchIndex = matches.findIndex((match) => {
    const rangeStart = Number(match[1])
    const rangeEnd = Number(match[2] || match[3] || match[1])
    const min = Math.min(rangeStart, rangeEnd)
    const max = Math.max(rangeStart, rangeEnd)
    return start >= min && end <= max
  })
  if (matchIndex < 0) return ''
  const current = matches[matchIndex]
  const next = matches[matchIndex + 1]
  return source.slice(current.index ?? 0, next?.index ?? source.length).trim()
}

const extractReadingQuestionRangeBlock = (questionSectionText: string, start: number, end: number) => {
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
