/**
 * Shared OCR garbage detection and cleanup for reading content.
 */

const TRAILING_OCR_GARBAGE = /\s+([a-z]{6,})\s*$/i

export const isLikelyOcrGarbageWord = (word: string) => {
  const value = String(word || '').toLowerCase()
  if (value.length < 8) return false
  if (/(.)\1{3,}/.test(value)) return true
  if (!/[aeiou]/.test(value)) return true
  if (/[bcdfghjklmnpqrstvwxyz]{5,}/i.test(value)) return true
  if (/[nm]{4,}|[c]{3,}|[s]{4,}/.test(value)) return true
  return false
}

const isReadingSectionLabelLine = (line: string) =>
  /^[A-G]\.?$/i.test(line) || /^[ivxlcdm]+\.?$/i.test(line) || /^[A-J]\.?$/i.test(line)

const isReadingTimingInstructionLine = (line: string) => {
  const text = String(line || '').trim()
  return /^you should spend about \d+\s+minutes?\s+on\b/i.test(text)
}

export const isGarbledOcrReadingLine = (line: string) => {
  const trimmed = String(line || '').trim()
  if (!trimmed) return false
  if (isReadingSectionLabelLine(trimmed)) return false
  if (/^Ed\.?$/i.test(trimmed)) return true
  if (/^BED\.?$/i.test(trimmed)) return true
  if (/^\|$/i.test(trimmed)) return true
  if (/^ss ie$/i.test(trimmed)) return true
  if (/^eX\}\s*et/i.test(trimmed)) return true
  if (/^>\|\s*@/i.test(trimmed)) return true
  if (/^>\|\s*p\.\s*\d+/i.test(trimmed)) return true
  if (/^a\s+[.．…⋯]{4,}\s*\.?$/i.test(trimmed)) return true
  if (/^[\d.]+\s*$/.test(trimmed) && trimmed.length <= 4) return true
  if (/uu\.\s*css/i.test(trimmed)) return true
  if (/theEMSEIVES/i.test(trimmed)) return true
  if (/BG ocean \+ LNey|IMPrOVEed|37\.0\s*…\s*te/i.test(trimmed)) return true
  if (/>\|\s*@\s*p\.\s*\d+/i.test(trimmed)) return true
  if (/\uFFFD/.test(trimmed)) return true
  if (/^[\s.:,;!?\-–—'"`\\|/[\]{}<>©®™0-9A-Za-z]+$/.test(trimmed) && !/\b[a-z]{4,}\b/i.test(trimmed)) {
    return true
  }
  if (trimmed.length <= 48 && /[�]/.test(trimmed)) return true
  if (/^[A-Za-z]{1,2}[\W_]{2,}[A-Za-z0-9\-]{1,4}[\W_]{2,}/.test(trimmed) && trimmed.length < 40) {
    return true
  }
  const alphaWords = trimmed.match(/\b[a-z]{4,}\b/gi) || []
  if (trimmed.length >= 12 && alphaWords.length === 0 && /[.,:;]/.test(trimmed)) return true
  if (/^<\w+/i.test(trimmed) && trimmed.length < 80) return true
  if (/^\d*Drop heading here<input/i.test(trimmed)) return true
  if (/^hidden"\s*form=/i.test(trimmed)) return true
  const trailingGarbage = trimmed.match(TRAILING_OCR_GARBAGE)
  if (trailingGarbage && isLikelyOcrGarbageWord(trailingGarbage[1] || '')) return true
  return false
}

export const isGarbledOcrReadingText = (text: string) => {
  const normalized = String(text || '').trim()
  if (!normalized) return false
  if (/\uFFFD/.test(normalized)) return true
  if (/[�]/.test(normalized)) return true
  const lines = normalized.split('\n').map((line) => line.trim()).filter(Boolean)
  if (lines.some((line) => isGarbledOcrReadingLine(line))) return true
  return false
}

export const stripTrailingOcrGarbageFromLine = (line: string) =>
  String(line || '')
    .replace(TRAILING_OCR_GARBAGE, (match, word: string) =>
      isLikelyOcrGarbageWord(word) ? '' : match
    )
    .replace(/\s*[.．…⋯·•_\-–—]{2,}[a-z0-9]*\s*$/i, '')
    .trim()

export const stripGarbledOcrFromReadingText = (text: string) =>
  String(text || '')
    .replace(/\r/g, '')
    .split('\n')
    .map((line) => stripTrailingOcrGarbageFromLine(line))
    .filter((line) => !isGarbledOcrReadingLine(line))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

export const sanitizeReadingPromptForDisplay = (prompt: string) => {
  let text = String(prompt || '').replace(/\s+/g, ' ').trim()
  if (!text) return text

  text = text
    .replace(/\s*(?:…\s*){2,}$/g, '')
    .replace(/\s*…(?:\s*…)+\s*/g, ' … ')
    .replace(/\s*\.{4,}\s*/g, ' … ')
    .replace(/\s*Questions?\s+\d+\s*[–-]\s*\d+[\s\S]*$/i, '')
    .replace(/\s*List of (?:Headings|Researchers|People|Statements|Phrases)[\s\S]*$/i, '')
    .replace(/\s*Complete the (?:notes|summary|sentences|table)[\s\S]*$/i, '')
    .replace(/\s*Choose (?:ONE WORD|NO MORE THAN|the correct)[\s\S]*$/i, '')
    .replace(/\s*Write your answers in boxes[\s\S]*$/i, '')
    .replace(/\s*Drag and drop an option[\s\S]*$/i, '')
    .replace(/\s*>\|\s*p\.\s*\d+[\s\S]*$/i, '')
    .trim()

  if (isGarbledOcrReadingText(text)) {
    const withoutGarbage = text
      .split(/\s+/)
      .filter((word) => !isLikelyOcrGarbageWord(word.replace(/[^a-z0-9]/gi, '')))
      .join(' ')
      .trim()
    text = withoutGarbage || text
  }

  return text.replace(/\s+…\s*$/, ' …').trim()
}

export const sanitizeReadingQuestionSectionTextForDisplay = (text: string) =>
  stripGarbledOcrFromReadingText(
    String(text || '')
      .replace(/\s*Drag and drop an option[\s\S]*?(?=\nQuestions?\s+\d|\n\s*\d+\.\s|$)/gi, '\n')
      .replace(/<(?:form|input|div|span|script)\b[\s\S]*?(?=\n|$)/gi, '')
      .replace(/^(\d+)\.\s*Drop answer here\s*(?:…|\.{2,})?\s*/gim, '$1. ')
      .replace(/^(\d+)\.\s*Drop heading here\s*(?:…|\.{2,})?\s*/gim, '$1. ')
  )

export const isJunkReadingPassageParagraph = (paragraph: string) => {
  const text = String(paragraph || '').trim()
  if (!text) return true
  if (isReadingTimingInstructionLine(text)) return true
  if (isReadingSectionLabelLine(text)) return false
  if (/^which (?:section|paragraph) contains the following information/i.test(text)) return true
  if (isGarbledOcrReadingLine(text)) return true
  if (/^<\w+/i.test(text)) return true
  if (/^<(?:form|input|div|span|script)\b/i.test(text)) return true
  if (/<(?:form|input|div|span|script)\b/i.test(text) && text.replace(/\s/g, '').length < 24) return true
  if (/^\d*Drop heading here<input/i.test(text)) return true
  if (/^\d+Drop heading here[A-H]\.?$/i.test(text)) return true
  if (/^hidden"\s*form=/i.test(text)) return true
  if (/form="\s*$/i.test(text)) return true
  if (text.length < 50 && /[<>"'=]/.test(text)) return true
  return false
}

export const fixCommonReadingOcrTypos = (text: string) =>
  String(text || '')
    .replace(/\uFFFD/g, '')
    .replace(/([a-z])�([a-z])/gi, '$1$2')
    .replace(/\bro be\b/gi, 'to be')
    .replace(/\bche snow\b/gi, 'the snow')
    .replace(/\bco increase\b/gi, 'to increase')
    .replace(/\bat lease\b/gi, 'at least')
    .replace(/\bworid's\b/gi, "world's")
    .replace(/\bgeo-engi\.neering\b/gi, 'geo-engineering')
    .replace(/\bdifficulry\b/gi, 'difficulty')
    .replace(/\blee alone\b/gi, 'let alone')
    .replace(/\brefers co\b/gi, 'refers to')
    .replace(/\benoµgh\b/gi, 'enough')
    .replace(/\bgre9tly\b/gi, 'greatly')
    .replace(/\s+/g, ' ')
    .trim()

export const patchAdvancedReadingPassageSource = (passage: {
  bodyParagraphs?: string[]
  questionSectionText?: string
  questions?: Array<{ number: number; prompt?: string }>
}) => {
  if (!passage) return passage

  passage.bodyParagraphs = cleanReadingPassageParagraphs(
    (passage.bodyParagraphs || []).map((paragraph) => fixCommonReadingOcrTypos(paragraph))
  )

  passage.questionSectionText = sanitizeReadingQuestionSectionTextForDisplay(
    passage.questionSectionText || ''
  )

  for (const question of passage.questions || []) {
    question.prompt = sanitizeReadingPromptForDisplay(String(question.prompt || ''))
  }

  return passage
}

export const rebuildAdvancedReadingRawPassageText = (
  title: string,
  passage: { title?: string; bodyParagraphs?: string[]; questionSectionText?: string }
) => {
  const passageTitle = String(passage.title || title.split(' - ').pop() || '').trim()
  const header = `READING PASSAGE 3\n${passageTitle}\n\n`
  const body = (passage.bodyParagraphs || []).join('\n\n')
  const questions = passage.questionSectionText ? `\n\n${passage.questionSectionText}` : ''
  return `${header}${body}${questions}`.trim()
}

export const patchAdvancedReadingRawAnswerKeyPrompt = (
  rawAnswerKey: string,
  questionNumber: number,
  prompt: string
) => {
  const source = String(rawAnswerKey || '')
  const escaped = questionNumber
  const pattern = new RegExp(
    `(Question ${escaped}:\\s*)(?:[^\\n]+)`,
    'i'
  )
  if (!pattern.test(source)) return source
  return source.replace(pattern, `$1${prompt}`)
}

export const cleanReadingPassageParagraphs = (paragraphs: string[]) => {
  const cleaned = (Array.isArray(paragraphs) ? paragraphs : [])
    .map((paragraph) =>
      stripTrailingOcrGarbageFromLine(
        String(paragraph || '')
          .replace(/\uFFFD/g, '')
          .replace(/([a-z])�([a-z])/gi, '$1$2')
          .replace(/^\d+Drop heading here[A-H]\.?\s*/i, '')
          .replace(/^\d+Drop heading here<input[\s\S]*$/i, '')
          .replace(/Drop heading here[^.]*\.\.\.\s*/gi, '')
          .replace(/<(?:form|input|div|span|script)\b[\s\S]*$/i, '')
          .replace(/<[^>]*$/g, '')
          .replace(/hidden"\s*form="?\s*$/i, '')
          .replace(/\s+/g, ' ')
          .trim()
      )
    )
    .filter((paragraph) => !isJunkReadingPassageParagraph(paragraph))

  const totalLength = cleaned.reduce((sum, paragraph) => sum + paragraph.length, 0)
  if (totalLength < 120 && (Array.isArray(paragraphs) ? paragraphs : []).some((p) => String(p).length > 200)) {
    return (Array.isArray(paragraphs) ? paragraphs : [])
      .map((paragraph) => String(paragraph || '').replace(/\s+/g, ' ').trim())
      .filter(Boolean)
  }

  return cleaned
}
