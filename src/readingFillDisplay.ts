import { READING_FILL_SECTION_OVERRIDES } from './readingFillSectionFixes'

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
  procedure?: string
  procedureSegments?: ReadingFillLineSegment[]
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

/** Number followed by dot-like blank markers or OCR garbage tokens. */
export const READING_FILL_BLANK_IN_LINE =
  /\b(\d+)\s*(?:[.．…⋯·•_\-–—]+(?:[a-z0-9]*)?|[a-z]{2,}[a-z0-9]{3,})/gi

const TRAILING_OCR_GARBAGE = /\s+([a-z]{6,})\s*$/i

const lineContainsBlankMarker = (line: string, questionNumbers: Set<number>) => {
  const normalized = normalizeOcrFillLine(line, questionNumbers)
  READING_FILL_BLANK_IN_LINE.lastIndex = 0
  if ([...normalized.matchAll(READING_FILL_BLANK_IN_LINE)].length > 0) return true
  return lineHasTrailingOcrGarbage(normalized)
}

import { isGarbledOcrReadingLine, isLikelyOcrGarbageWord } from './readingOcrCleanup'

const lineHasTrailingOcrGarbage = (line: string) => {
  const match = line.match(TRAILING_OCR_GARBAGE)
  return Boolean(match && isLikelyOcrGarbageWord(match[1]))
}

const cleanFillSegmentText = (text: string) =>
  String(text || '')
    .replace(/\s*[.．…⋯·•_\-–—]{2,}[a-z0-9]*\s*$/i, '')
    .replace(TRAILING_OCR_GARBAGE, (match, word: string) =>
      isLikelyOcrGarbageWord(word) ? '' : match
    )
    .replace(/^([a-z0-9]{4,})\s+/i, (match, word: string) =>
      isLikelyOcrGarbageWord(word) ? '' : match
    )
    .replace(/\s+/g, ' ')
    .trim()

const normalizeOcrFillQuestionNumber = (value: string, questionNumbers: Set<number>) => {
  const numeric = Number(value)
  if (questionNumbers.has(numeric)) return numeric
  if (numeric > 100 && questionNumbers.has(numeric % 100)) return numeric % 100
  if (numeric > 10 && questionNumbers.has(Number(String(numeric).slice(-2)))) {
    const tail = Number(String(numeric).slice(-2))
    if (questionNumbers.has(tail)) return tail
  }
  return numeric
}

const normalizeOcrFillLine = (line: string, questionNumbers: Set<number>) => {
  let result = line.trim()
  if (!result) return result

  if (questionNumbers.has(12)) {
    result = result.replace(/\b212\b/g, '12')
  }

  const numbers = [...questionNumbers].sort((first, second) => second - first)
  for (const questionNumber of numbers) {
    result = result.replace(
      new RegExp(
        `\\b${questionNumber}\\s+(?:[.．…⋯·•_\\-–—]+)?([a-z0-9]{4,})`,
        'gi'
      ),
      (match, word: string) =>
        isLikelyOcrGarbageWord(word) ? `${questionNumber} …` : match
    )
    result = result.replace(
      new RegExp(`\\b${questionNumber}\\s+([a-z]{2,}[a-z0-9]{3,})`, 'gi'),
      (match, word: string) =>
        isLikelyOcrGarbageWord(word) ? `${questionNumber} …` : match
    )
  }

  return result.replace(/\s+/g, ' ').trim()
}

const assignImplicitBlankNumbers = (
  lines: string[],
  questionNumbers: Set<number>
): string[] => {
  const sortedNumbers = [...questionNumbers].sort((first, second) => first - second)
  const coveredNumbers = new Set<number>()
  let nextIndex = 0

  return lines.map((line) => {
    READING_FILL_BLANK_IN_LINE.lastIndex = 0
    for (const match of line.matchAll(READING_FILL_BLANK_IN_LINE)) {
      const questionNumber = normalizeOcrFillQuestionNumber(match[1], questionNumbers)
      if (questionNumbers.has(questionNumber)) coveredNumbers.add(questionNumber)
    }

    if (!lineHasTrailingOcrGarbage(line)) return line
    if (/\b\d+\s*(?:[.．…⋯·•_\-–—]|…)/.test(line)) return line

    while (nextIndex < sortedNumbers.length && coveredNumbers.has(sortedNumbers[nextIndex])) {
      nextIndex += 1
    }
    if (nextIndex >= sortedNumbers.length) return line

    const questionNumber = sortedNumbers[nextIndex]
    coveredNumbers.add(questionNumber)
    nextIndex += 1
    return line.replace(TRAILING_OCR_GARBAGE, ` ${questionNumber} …`)
  })
}

const coalesceFillLineSegments = (segments: ReadingFillLineSegment[]): ReadingFillLineSegment[] => {
  const result: ReadingFillLineSegment[] = []

  for (let index = 0; index < segments.length; index += 1) {
    const segment = segments[index]
    const next = segments[index + 1]

    if (segment.kind === 'text' && next?.kind === 'blank') {
      result.push({
        ...next,
        before: cleanFillSegmentText([segment.text, next.before].filter(Boolean).join(' '))
      })
      index += 1
      continue
    }

    if (segment.kind === 'blank') {
      result.push({
        ...segment,
        before: cleanFillSegmentText(segment.before),
        after: cleanFillSegmentText(segment.after)
      })
      continue
    }

    result.push(segment)
  }

  return result
}

const findFillSourceLineForQuestion = (block: string, questionNumber: number) => {
  const lines = block
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !isReadingFillBoilerplateLine(line))

  const direct = lines.find((line) => new RegExp(`\\b${questionNumber}\\b`).test(line))
  if (direct) return direct

  const normalizedLines = assignImplicitBlankNumbers(
    lines.map((line) => normalizeOcrFillLine(line, new Set([questionNumber]))),
    new Set([questionNumber])
  )
  return normalizedLines.find((line) => new RegExp(`\\b${questionNumber}\\s`).test(line)) || null
}

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

export const isReadingFillStylePrompt = (prompt: string, questionNumber: number) =>
  parseFillContextFromPrompt(prompt, questionNumber) !== null

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

const isReadingFillTableHeaderLine = (line: string) => {
  const trimmed = String(line || '').trim()
  return /^Procedure\s+Aim$/i.test(trimmed) || /^Procedure\s*\|\s*Aim$/i.test(trimmed)
}

const isReadingFillBoilerplateLine = (line: string) => {
  const trimmed = String(line || '').trim()
  if (!trimmed) return true
  if (isGarbledOcrReadingLine(trimmed)) return true
  return (
    /^Questions \d+/i.test(line) ||
    /^Complete the (?:notes|sentences|summary|table)/i.test(line) ||
    /^Choose (?:ONE WORD|NO MORE THAN)/i.test(line) ||
    /^Write your answers in boxes/i.test(line) ||
    /^Write the correct/i.test(line) ||
    /^Reading Passage \d+/i.test(line) ||
    /^In boxes \d+/i.test(line) ||
    /^[A-J]\s+/.test(line) ||
    /^\d+\.\s*Drop heading here/i.test(line) ||
    /^\d+\.\s*Drop answer here\s*(?:…|\.{2,})?\s*$/i.test(line) ||
    /^>\|\s*p\.\s*\d+/i.test(line)
  )
}

const parseReadingFillTableRowLine = (
  line: string,
  questionNumbers: Set<number>
): ReadingFillDisplayLine | null => {
  const trimmed = line.trim()
  if (!trimmed.includes('|') || isReadingFillTableHeaderLine(trimmed)) return null

  const divider = trimmed.indexOf('|')
  if (divider <= 0) return null

  const procedure = trimmed.slice(0, divider).trim()
  const aim = trimmed.slice(divider + 1).trim()
  if (!procedure || !aim) return null

  const procedureSegments = parseReadingFillLineSegments(procedure, questionNumbers)
  const aimSegments = parseReadingFillLineSegments(aim, questionNumbers)
  const hasProcedureBlanks = procedureSegments.some((segment) => segment.kind === 'blank')
  const hasAimBlanks = aimSegments.some((segment) => segment.kind === 'blank')

  if (!hasProcedureBlanks && !hasAimBlanks) return null

  return {
    procedure: hasProcedureBlanks ? undefined : procedure,
    procedureSegments: hasProcedureBlanks ? procedureSegments : undefined,
    segments: aimSegments.length ? aimSegments : [{ kind: 'text', text: aim }]
  }
}

const READING_FILL_EMBEDDED_GAP = /(?:[.．⋯·•_\-–—]{3,}|…+|\.{2,})/g

const parseEmbeddedGapFillLine = (
  trimmed: string,
  questionNumbers: Set<number>
): ReadingFillLineSegment[] | null => {
  const lineMatch = trimmed.match(/^(\d+)\s+([\s\S]+)$/)
  if (!lineMatch) return null

  const firstNumber = normalizeOcrFillQuestionNumber(lineMatch[1], questionNumbers)
  if (!questionNumbers.has(firstNumber)) return null

  const body = lineMatch[2]
  READING_FILL_EMBEDDED_GAP.lastIndex = 0
  const gaps = [...body.matchAll(READING_FILL_EMBEDDED_GAP)]
  if (!gaps.length) return null

  const sortedNumbers = [...questionNumbers].sort((first, second) => first - second)
  const startIndex = sortedNumbers.indexOf(firstNumber)
  if (startIndex < 0) return null

  const segments: ReadingFillLineSegment[] = []

  gaps.forEach((gap, gapIndex) => {
    const questionNumber = sortedNumbers[startIndex + gapIndex]
    if (!questionNumber) return

    const beforeStart = gapIndex === 0 ? 0 : (gaps[gapIndex - 1].index ?? 0) + gaps[gapIndex - 1][0].length
    const before =
      gapIndex === 0
        ? cleanFillSegmentText(body.slice(beforeStart, gap.index).trim())
        : ''
    const afterStart = (gap.index ?? 0) + gap[0].length
    const afterEnd = gaps[gapIndex + 1]?.index ?? body.length
    const after = cleanFillSegmentText(body.slice(afterStart, afterEnd).trim())

    segments.push({
      kind: 'blank',
      questionNumber,
      before,
      after
    })
  })

  if (!segments.length) return null

  return coalesceFillLineSegments(segments)
}

const parseInlineNumberedGapsInLine = (
  trimmed: string,
  questionNumbers: Set<number>
): ReadingFillLineSegment[] | null => {
  if (/^\d+\s/.test(trimmed)) return null

  const gapPattern = /\b(\d+)\s*(?:[.．…⋯·•_\-–—]+|…+|\s+\.{2,})/g
  const matches = [...trimmed.matchAll(gapPattern)]
    .map((match) => ({
      match,
      questionNumber: normalizeOcrFillQuestionNumber(match[1], questionNumbers)
    }))
    .filter(({ questionNumber }) => questionNumbers.has(questionNumber))

  if (!matches.length) return null

  const segments: ReadingFillLineSegment[] = []
  let lastIndex = 0

  matches.forEach(({ match, questionNumber }, index) => {
    const start = match.index ?? 0
    const end = start + match[0].length
    const nextStart = matches[index + 1]?.match.index ?? trimmed.length

    if (start > lastIndex) {
      const beforeText = trimmed.slice(lastIndex, start).trim()
      if (beforeText) segments.push({ kind: 'text', text: beforeText })
    }

    const after = trimmed.slice(end, nextStart).trim()
    segments.push({ kind: 'blank', questionNumber, before: '', after })
    lastIndex = nextStart
  })

  if (lastIndex < trimmed.length) {
    const tail = trimmed.slice(lastIndex).trim()
    if (tail) segments.push({ kind: 'text', text: tail })
  }

  return coalesceFillLineSegments(segments)
}

const isOrphanFillContinuationLine = (line: string, previous?: string) => {
  const trimmed = line.trim()
  if (!previous || !trimmed) return false
  if (/^\d+\s/.test(trimmed)) return false
  if (/(?:[.．…⋯]{2,}|…+)/.test(trimmed)) return false
  if (trimmed.length > 40) return false
  if (/^[A-Z][^.!?]*[.!?]\s/.test(trimmed)) return false
  return /^[a-z][a-z\s-]*$/i.test(trimmed)
}

const mergeMultilineFillContentLines = (lines: string[]) => {
  const merged: string[] = []

  for (const line of lines) {
    const previous = merged[merged.length - 1]
    const dottedContinuation =
      /^[a-z(]/i.test(line.trim()) &&
      /(?:[.．…⋯]{2,}|…+)/.test(line) &&
      previous &&
      /^\d+\s+/.test(previous) &&
      !/(?:[.．…⋯]{2,}|…+)/.test(previous)
    const orphanContinuation = isOrphanFillContinuationLine(line, previous)

    if (dottedContinuation || orphanContinuation) {
      merged[merged.length - 1] = `${previous} ${line.trim()}`
      continue
    }

    merged.push(line)
  }

  return merged
}

export const parseReadingFillLineSegments = (
  line: string,
  questionNumbers: Set<number>
): ReadingFillLineSegment[] => {
  const trimmed = normalizeOcrFillLine(line, questionNumbers)
  if (!trimmed) return []

  const embeddedGapSegments = parseEmbeddedGapFillLine(trimmed, questionNumbers)
  if (embeddedGapSegments?.length) return embeddedGapSegments

  const inlineNumberedSegments = parseInlineNumberedGapsInLine(trimmed, questionNumbers)
  if (inlineNumberedSegments?.length) return inlineNumberedSegments

  const leadingBlank = trimmed.match(/^(\d+)\s*([.．…⋯·•_\-–—]+)\s+(.+)$/)
  if (leadingBlank) {
    const questionNumber = normalizeOcrFillQuestionNumber(leadingBlank[1], questionNumbers)
    if (questionNumbers.has(questionNumber)) {
      return coalesceFillLineSegments([
        {
          kind: 'blank',
          questionNumber,
          before: '',
          after: leadingBlank[3].trim()
        }
      ])
    }
  }

  const leadingOcrBlank = trimmed.match(/^(\d+)\s+([a-z0-9]{4,})\s+(.+)$/i)
  if (leadingOcrBlank) {
    const questionNumber = normalizeOcrFillQuestionNumber(leadingOcrBlank[1], questionNumbers)
    if (questionNumbers.has(questionNumber)) {
      return coalesceFillLineSegments([
        {
          kind: 'blank',
          questionNumber,
          before: '',
          after: leadingOcrBlank[3].trim()
        }
      ])
    }
  }

  const trailingBlank = trimmed.match(/^(\d+)\s+(.+?)\s*([.．…⋯·•_\-–—]+)\s*\.?\s*$/)
  if (trailingBlank) {
    const questionNumber = normalizeOcrFillQuestionNumber(trailingBlank[1], questionNumbers)
    if (questionNumbers.has(questionNumber)) {
      return coalesceFillLineSegments([
        {
          kind: 'blank',
          questionNumber,
          before: trailingBlank[2].trim(),
          after: ''
        }
      ])
    }
  }

  READING_FILL_BLANK_IN_LINE.lastIndex = 0
  const matches = [...trimmed.matchAll(READING_FILL_BLANK_IN_LINE)]
    .map((match) => ({
      match,
      questionNumber: normalizeOcrFillQuestionNumber(match[1], questionNumbers)
    }))
    .filter(({ questionNumber }) => questionNumbers.has(questionNumber))

  if (!matches.length) {
    const text = trimmed
    const withoutBullet = text.replace(/^[•\-\*]\s*/, '').trim()
    const hasQuestionMarker = lineContainsBlankMarker(text, questionNumbers)
    if (
      !hasQuestionMarker &&
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

  matches.forEach(({ match, questionNumber }, index) => {
    const start = match.index ?? 0
    const end = start + match[0].length
    const nextStart = matches[index + 1]?.match.index ?? trimmed.length

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

  return coalesceFillLineSegments(segments)
}

export const extractReadingFillDisplayLines = (
  block: string,
  questionNumbers: Set<number>,
  questions: FillQuestion[] = []
): ReadingFillDisplayLine[] => {
  const byNumber = new Map(questions.map((question) => [question.number, question]))
  const rawContentLines = block
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !isReadingFillBoilerplateLine(line))
    .map((line) => normalizeOcrFillLine(line, questionNumbers))

  const contentLines = assignImplicitBlankNumbers(
    mergeMultilineFillContentLines(rawContentLines),
    questionNumbers
  )

  const displayLines = contentLines
    .map((line) => {
      if (isReadingFillTableHeaderLine(line)) {
        return {
          segments: [
            { kind: 'heading' as const, text: 'Procedure' },
            { kind: 'heading' as const, text: 'Aim' }
          ]
        }
      }

      const tableRow = parseReadingFillTableRowLine(line, questionNumbers)
      if (tableRow) return tableRow

      return {
        segments: parseReadingFillLineSegments(line, questionNumbers)
      }
    })
    .filter((line) => line.segments.length > 0)

  if (displayLines.length) {
    const enriched = enrichFillDisplayLines(displayLines, questions)
    const merged = mergeFillDisplayLineContinuations(enriched)
    return supplementMissingFillDisplayLines(merged, questionNumbers, questions, block)
  }

  return [...questionNumbers]
    .sort((first, second) => first - second)
    .map((questionNumber) => {
      const question = byNumber.get(questionNumber)
      const context = question ? resolveFillContext(block, question, questionNumber) : null
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

const resolveFillContext = (block: string, question: FillQuestion, questionNumber: number) => {
  const sourceLine = findFillSourceLineForQuestion(block, questionNumber)
  if (sourceLine) {
    const questionSet = new Set([questionNumber])
    const segments = parseReadingFillLineSegments(sourceLine, questionSet)
    const blank = segments.find(
      (segment): segment is Extract<ReadingFillLineSegment, { kind: 'blank' }> =>
        segment.kind === 'blank' && segment.questionNumber === questionNumber
    )
    if (blank && (blank.before || blank.after)) {
      return { before: blank.before, after: blank.after }
    }

    const normalized = normalizeOcrFillLine(sourceLine, questionSet)
    const rawMatch = normalized.match(
      new RegExp(
        `^(.*?)\\b${questionNumber}\\s*(?:[.．…⋯·•_\\-–—…]+|[a-z0-9]{4,})(.*)$`,
        'i'
      )
    )
    if (rawMatch) {
      const before = cleanFillSegmentText(rawMatch[1])
      const after = cleanFillSegmentText(rawMatch[2])
      if (before || after) return { before, after }
    }
  }

  return parseFillContextFromPrompt(question.prompt, questionNumber)
}

const supplementMissingFillDisplayLines = (
  displayLines: ReadingFillDisplayLine[],
  questionNumbers: Set<number>,
  questions: FillQuestion[],
  block: string
): ReadingFillDisplayLine[] => {
  const coveredNumbers = new Set<number>()
  for (const line of displayLines) {
    for (const segment of [...line.segments, ...(line.procedureSegments || [])]) {
      if (segment.kind === 'blank') coveredNumbers.add(segment.questionNumber)
    }
  }

  const missingNumbers = [...questionNumbers]
    .filter((questionNumber) => !coveredNumbers.has(questionNumber))
    .sort((first, second) => first - second)
  if (!missingNumbers.length) return displayLines

  const byNumber = new Map(questions.map((question) => [question.number, question]))
  const supplementalLines: ReadingFillDisplayLine[] = []
  for (const questionNumber of missingNumbers) {
    const question = byNumber.get(questionNumber)
    const context = question ? resolveFillContext(block, question, questionNumber) : null
    supplementalLines.push({
      segments: [
        {
          kind: 'blank' as const,
          questionNumber,
          before: context?.before || '',
          after: context?.after || ''
        }
      ]
    })
  }

  return [...displayLines, ...supplementalLines]
}

const shouldMergeTextIntoFollowingBlank = (text: string) => {
  const trimmed = text.trim()
  if (!trimmed || /[.!?]["']?\s*$/.test(trimmed)) return false
  if (/[:;]\s*$/.test(trimmed)) return false
  if (/^Reasons why\b/i.test(trimmed)) return false
  const lastWord = trimmed.split(/\s+/).pop() || ''
  if (/^(?:where|a|an|the|of|to|as|and|or|in|on|at|by|for|with|from|their|its|his|her|some|such)$/i.test(lastWord)) {
    return true
  }
  if (/[a-z]{4,}$/.test(lastWord) && !/[.!?]$/.test(trimmed)) {
    return /(?:tion|ment|ing|ity|ness|ship|hood|ence|ance|able|ible|ful|less|ous|ive|al|ed|es|ed)$/i.test(lastWord)
  }
  return false
}

const mergeFillDisplayLineContinuations = (
  displayLines: ReadingFillDisplayLine[]
): ReadingFillDisplayLine[] => {
  const merged: ReadingFillDisplayLine[] = []

  for (const line of displayLines) {
    if (line.procedure || line.procedureSegments?.length) {
      merged.push(line)
      continue
    }

    const previous = merged[merged.length - 1]
    if (previous?.procedure || previous?.procedureSegments?.length) {
      merged.push(line)
      continue
    }

    const previousTextSegment =
      previous?.segments.length === 1 && previous.segments[0].kind === 'text'
        ? previous.segments[0]
        : null
    const lastPreviousSegment = previous?.segments[previous.segments.length - 1]
    const onlySegment = line.segments.length === 1 ? line.segments[0] : null
    const firstSegment = line.segments[0]

    if (
      previousTextSegment &&
      firstSegment?.kind === 'blank' &&
      shouldMergeTextIntoFollowingBlank(previousTextSegment.text)
    ) {
      merged[merged.length - 1] = {
        ...line,
        segments: [
          {
            ...firstSegment,
            before: cleanFillSegmentText(
              [previousTextSegment.text, firstSegment.before].filter(Boolean).join(' ')
            )
          },
          ...line.segments.slice(1)
        ]
      }
      continue
    }

    if (
      previous &&
      lastPreviousSegment?.kind === 'blank' &&
      onlySegment?.kind === 'text' &&
      !/^[e•\-*]\s/.test(onlySegment.text.trim()) &&
      onlySegment.text.trim().length <= 48 &&
      /^[a-z(]/.test(onlySegment.text.trim())
    ) {
      previous.segments = previous.segments.map((segment, index, segments) => {
        if (index !== segments.length - 1 || segment.kind !== 'blank') return segment
        return {
          ...segment,
          after: cleanFillSegmentText([segment.after, onlySegment.text].filter(Boolean).join(' '))
        }
      })
      continue
    }

    merged.push(line)
  }

  return merged
}

export const enrichFillDisplayLines = (
  displayLines: ReadingFillDisplayLine[],
  questions: FillQuestion[]
): ReadingFillDisplayLine[] => {
  const byNumber = new Map(questions.map((question) => [question.number, question]))

  return displayLines.map((line) => ({
    ...line,
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

const resolveReadingFillRangeBlock = (
  questionSectionText: string,
  sectionOverride: string | undefined,
  start: number,
  end: number
) => {
  const fromPassage = extractReadingQuestionRangeBlock(questionSectionText, start, end)
  if (!sectionOverride) return fromPassage

  const fromOverride = extractReadingQuestionRangeBlock(sectionOverride, start, end)
  if (fromOverride && isReadingFillSectionBlock(fromOverride)) {
    const overrideHasBlanks = fromOverride.split('\n').some((line) =>
      lineContainsBlankMarker(line, new Set(Array.from({ length: end - start + 1 }, (_, index) => start + index)))
    )
    const passageHasBlanks = fromPassage
      ? fromPassage.split('\n').some((line) =>
          lineContainsBlankMarker(line, new Set(Array.from({ length: end - start + 1 }, (_, index) => start + index)))
        )
      : false
    if (overrideHasBlanks || !passageHasBlanks) return fromOverride
  }

  return fromPassage
}

export const buildReadingFillQuestionGroups = <P extends FillPassage, Q extends FillQuestion>(
  passage: P | null,
  questions: Q[],
  isMatchingQuestion: (passage: P | null, question: Q | null) => boolean,
  examId?: string | null
): ReadingFillQuestionGroup[] => {
  if (!passage) return []

  const sectionOverride = examId ? READING_FILL_SECTION_OVERRIDES[examId] : undefined
  const questionSectionText = passage.questionSectionText || ''

  const groups: ReadingFillQuestionGroup[] = []
  const ranges = passage.questionRanges?.length ? passage.questionRanges : [{ start: 1, end: 999 }]
  const leafRanges = ranges.filter(
    (range) =>
      !ranges.some(
        (other) =>
          other !== range &&
          other.start >= range.start &&
          other.end <= range.end &&
          other.end - other.start < range.end - range.start
      )
  )

  leafRanges.forEach((range) => {
    const block = resolveReadingFillRangeBlock(questionSectionText, sectionOverride, range.start, range.end)
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
