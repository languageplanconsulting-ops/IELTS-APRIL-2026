export type ReadingMatchingChoiceOption = { letter: string; text: string }

export type ReadingMatchingGroupKind = 'heading' | 'information' | 'statement'

export const READING_LETTER_OPTION_LINE = /^([A-J])\s*(?:[-–—.:_]|\s+)\s*(.+)$/i

const LIST_OF_OPTIONS_HEADER =
  /List of (?:Headings|Ideas|Researchers|People|Statements|Companies|Dates|Words|Phrases|Endings)\b/i

const readingBlockHasPerQuestionLetterOptions = (sourceText: string) => {
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

const extractSharedReadingLetterOptionBank = (sourceText: string): ReadingMatchingChoiceOption[] => {
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
    .filter(Boolean) as ReadingMatchingChoiceOption[]
}

export const extractReadingMatchingListOptions = (sourceText: string): ReadingMatchingChoiceOption[] => {
  const listHeader =
    /List of (?:Headings|Ideas|Researchers|People|Statements|Companies|Dates|Words|Phrases|Endings)\s*\.?\s*\n/i
  const listMatch =
    sourceText.match(
      new RegExp(
        `${listHeader.source}([\\s\\S]*?)(?=\\n\\s*\\d+\\s*(?:[.)]|\\s|=>)|\\nQuestions?\\s+|\\nNB\\b|$)`,
        'i'
      )
    ) ||
    sourceText.match(new RegExp(`${listHeader.source}([\\s\\S]*)$`, 'i'))
  const listSource = listMatch?.[1] || ''
  const romanOptions = listSource
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^((?:i|ii|iii|iv|v|vi|vii|viii|ix|x))[\).:\-]?\s+(.+)$/i)
      if (!match) return null
      return { letter: match[1].toLowerCase(), text: match[2].trim() }
    })
    .filter(Boolean) as ReadingMatchingChoiceOption[]
  if (romanOptions.length) return romanOptions

  const letterOptions = listSource
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(READING_LETTER_OPTION_LINE)
      if (!match) return null
      return { letter: match[1].toUpperCase(), text: match[2].trim() }
    })
    .filter(Boolean) as ReadingMatchingChoiceOption[]
  if (letterOptions.length) return letterOptions

  const inlineBankMatch = sourceText.match(
    /\n([A-J]\s*(?:[-–—]|\s+)[^\n]+(?:\n[A-J]\s*(?:[-–—]|\s+)[^\n]+){2,})\s*(?:\nQuestions?\s+|\n##|$)/i
  )
  if (inlineBankMatch?.[1]) {
    const inlineOptions = inlineBankMatch[1]
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const match = line.match(READING_LETTER_OPTION_LINE)
        if (!match) return null
        return { letter: match[1].toUpperCase(), text: match[2].trim() }
      })
      .filter(Boolean) as ReadingMatchingChoiceOption[]
    if (inlineOptions.length >= 3) return inlineOptions
  }

  return extractSharedReadingLetterOptionBank(sourceText)
}

export const isReadingPeopleMatchingBlock = (block: string) => {
  const normalized = String(block || '')
  if (LIST_OF_OPTIONS_HEADER.test(normalized) && /list of (?:people|researchers|ideas)\b/i.test(normalized)) {
    return true
  }
  if (
    /look at the following (?:statements|research findings|ideas)/i.test(normalized) &&
    /list of (?:people|researchers)/i.test(normalized)
  ) {
    return true
  }
  if (
    /match\s+each\s+(?:statement|research finding|idea)/i.test(normalized) &&
    /correct\s+(?:person|people|researcher)/i.test(normalized)
  ) {
    return true
  }
  const listOptions = extractReadingMatchingListOptions(normalized)
  return (
    /match\s+each/i.test(normalized) &&
    listOptions.length >= 3 &&
    listOptions.every((option) => option.text && option.text.toUpperCase() !== option.letter)
  )
}

export const formatReadingMatchingChoiceOption = (
  option: ReadingMatchingChoiceOption,
  kind: ReadingMatchingGroupKind,
  peopleMatching: boolean
) => {
  if (kind === 'information') return `Paragraph ${option.letter}`
  if (peopleMatching) return option.text
  return `${option.letter}. ${option.text}`
}

export const getReadingParagraphAnswerLettersFromText = (sectionText: string) => {
  const source = String(sectionText || '')
  const rangeMatch =
    source.match(/\b([A-Z])\s*[-–—]\s*([A-Z])\b/i) ||
    source.match(/paragraphs?,?\s+([A-H])\s*[-–—]\s*([A-H])/i) ||
    source.match(/boxes\s+([A-H])\s*[-–—]\s*([A-H])/i) ||
    source.match(/(?:person|people|researcher),?\s+([A-H])\s*[-–—]\s*([A-H])/i)
  if (!rangeMatch) return null
  const startCode = rangeMatch[1].toUpperCase().charCodeAt(0)
  const endCode = rangeMatch[2].toUpperCase().charCodeAt(0)
  if (endCode < startCode) return null
  return Array.from({ length: endCode - startCode + 1 }, (_, index) =>
    String.fromCharCode(startCode + index)
  )
}

export const extractReadingPersonOptionsFromPassageBody = (
  bodyParagraphs: string[] = [],
  allowedLetters: string[] | null = null
): ReadingMatchingChoiceOption[] => {
  const allowed = allowedLetters?.length ? new Set(allowedLetters.map((letter) => letter.toUpperCase())) : null
  const options: ReadingMatchingChoiceOption[] = []

  for (const paragraph of bodyParagraphs) {
    const text = String(paragraph || '').trim()
    const match = text.match(/^([A-I])[\.\s]+(.+)/is)
    if (!match) continue
    const letter = match[1].toUpperCase()
    if (allowed && !allowed.has(letter)) continue

    let label = match[2].trim()
    const attribution = label.match(
      /^(.{3,120}?)(?:\s+(?:argued|wrote|explained|noted|warned|suggested|contended|emphasised|emphasized|believes|said|found|observed|according))/i
    )
    if (attribution) {
      label = attribution[1].trim()
    } else {
      label = label.split(/[.!?]/)[0].slice(0, 100).trim()
    }
    if (label.length < 3) continue
    options.push({ letter, text: label })
  }

  return options
}

export const getReadingPeopleMatchingChoiceOptions = (
  block: string,
  bodyParagraphs: string[] = []
): ReadingMatchingChoiceOption[] => {
  const fromList = extractReadingMatchingListOptions(block)
  if (fromList.length) return fromList

  const allowedLetters = getReadingParagraphAnswerLettersFromText(block)
  const fromPassage = extractReadingPersonOptionsFromPassageBody(bodyParagraphs, allowedLetters)
  if (fromPassage.length >= 3) return fromPassage

  if (allowedLetters?.length) {
    return allowedLetters.map((letter) => ({ letter, text: letter }))
  }

  return []
}

export const hasNamedPeopleMatchingOptions = (options: ReadingMatchingChoiceOption[]) =>
  options.length >= 3 &&
  options.every((option) => option.text && option.text.toUpperCase() !== option.letter)
