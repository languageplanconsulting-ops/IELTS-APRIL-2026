import { READING_PASSAGE_BODY_FIXTURES } from './readingPassageBodyFixtures.mjs'

const normalizeReadingCategory = (value) => {
  const normalized = String(value || '').trim().toLowerCase()
  if (normalized === 'advanced' || normalized === 'passage3') return 'advanced'
  return 'normal'
}

const normalizeReadingCollectionTitle = (value) => String(value || '').trim()

const normalizeReadingAnswer = (value) =>
  String(value || '')
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\.$/, '')
    .toUpperCase()

const READING_ROMAN_HEADING_PATTERN = /^(?:i|ii|iii|iv|v|vi|vii|viii|ix|x)$/i

const canonicalizeReadingCorrectAnswer = (value) => {
  const normalized = normalizeReadingAnswer(value)
  if (!normalized) return ''
  if (normalized.startsWith('NOT GIVEN')) return 'NOT GIVEN'
  if (normalized.startsWith('TRUE')) return 'TRUE'
  if (normalized.startsWith('FALSE')) return 'FALSE'
  if (normalized.startsWith('YES')) return 'YES'
  if (normalized.startsWith('NO')) return 'NO'
  if (READING_ROMAN_HEADING_PATTERN.test(normalized)) return normalized.toLowerCase()
  const letterMatch = normalized.match(/^([A-H])(?:\b|\s|\()/)
  if (letterMatch) return letterMatch[1]
  return String(value || '').trim()
}

const parseAcceptedReadingAnswers = (value) =>
  String(value || '')
    .split(/[|,/&]+/)
    .map((item) => canonicalizeReadingCorrectAnswer(item))
    .filter(Boolean)

const guessReadingAnswerType = (correctAnswer) => {
  const normalized = normalizeReadingAnswer(canonicalizeReadingCorrectAnswer(correctAnswer))
  if (['TRUE', 'FALSE', 'NOT GIVEN'].includes(normalized)) return 'true-false-not-given'
  if (['YES', 'NO', 'NOT GIVEN'].includes(normalized)) return 'yes-no-not-given'
  if (/^[A-H]$/.test(normalized)) return 'multiple-choice'
  if (READING_ROMAN_HEADING_PATTERN.test(normalized)) return 'multiple-choice'
  return 'text'
}

const inferReadingAnswerType = (correctAnswer, questionSectionText = '') => {
  const normalized = normalizeReadingAnswer(canonicalizeReadingCorrectAnswer(correctAnswer))
  const section = String(questionSectionText || '')
  if (normalized === 'NOT GIVEN') {
    if (/\bYES\b/i.test(section) && /\bNO\b/i.test(section)) return 'yes-no-not-given'
    if (/\bTRUE\b/i.test(section) && /\bFALSE\b/i.test(section)) return 'true-false-not-given'
  }
  return guessReadingAnswerType(correctAnswer)
}

const sanitizeReadingJudgementPrompt = (prompt, answerType) => {
  const text = String(prompt || '').replace(/\s+/g, ' ').trim()
  if (answerType !== 'true-false-not-given' && answerType !== 'yes-no-not-given') return text

  const stripped = text
    .replace(
      /^(?:the\s+)?(?:writer|writers|author|authors|passage writer|passage writers)\s+(?:believes?|claims?|argues?|suggests?|states?|says?|thinks?|maintains?|contends?|implies?|feels?|considers?|indicates?|holds?|asserts?)\s+(?:that\s+)?/i,
      ''
    )
    .replace(
      /^(?:the\s+)?(?:writer|writers|author|authors|passage writer|passage writers)(?:'s|’s)\s+(?:view|opinion|belief|claim|argument|suggestion|position)\s+(?:is|was)\s+(?:that\s+)?/i,
      ''
    )
    .replace(
      /^(?:according to|in the view of|in the opinion of)\s+(?:the\s+)?(?:writer|writers|author|authors|passage writer|passage writers),?\s*/i,
      ''
    )
    .trim()

  return stripped || text
}

const stripReadingDragDropUiText = (text) =>
  String(text || '')
    .replace(/\s+/g, ' ')
    .replace(/\s*Drag and drop an option[\s\S]*?(?=Questions?\s+\d|$)/i, '')
    .replace(/\s*Questions?\s+\d+(?:\s*[–-]\s*\d+)?[\s\S]*$/i, '')
    .trim()

const isReadingDragDropPlaceholderLine = (line) =>
  /^\d+\.\s*Drop heading here\s*(?:…|\.{2,})?\s*$/i.test(String(line || '').trim())

const sanitizeReadingQuestionSectionLine = (line) => {
  const trimmed = String(line || '').trim()
  if (!trimmed) return ''
  if (isReadingDragDropPlaceholderLine(trimmed)) return ''
  return trimmed
    .replace(/^(\d+)\.\s*Drop answer here\s*(?:…|\.{2,})?\s*/i, '$1. ')
    .replace(/^(\d+)\.\s*Drop heading here\s*(?:…|\.{2,})?\s*/i, '$1. ')
    .trim()
}

export const sanitizeReadingQuestionSectionText = (text) =>
  String(text || '')
    .replace(/\r/g, '')
    .replace(/\s*Drag and drop an option[\s\S]*?(?=\nQuestions?\s+\d|\n\s*\d+\.\s|$)/gi, '\n')
    .replace(/<(?:form|input|div|span|script)\b[\s\S]*?(?=\n|$)/gi, '')
    .split('\n')
    .map((line) => sanitizeReadingQuestionSectionLine(line))
    .filter(Boolean)
    .join('\n')
    .trim()

const stripReadingMatchingListFromPrompt = (text) =>
  String(text || '')
    .replace(
      /(?:\.\s*|\s+)List of (?:Headings|Ideas|Researchers|People|Statements)\b[\s\S]*$/i,
      ''
    )
    .trim()

const sanitizeReadingQuestionPrompt = (prompt, correctAnswer) => {
  const raw = String(prompt || '').replace(/\s+/g, ' ').trim()
  if (/^drop heading here/i.test(raw)) {
    const remainder = stripReadingDragDropUiText(raw.replace(/^drop heading here\s*…?\s*/i, ''))
    return remainder || 'Choose the correct heading for this section.'
  }
  if (/^drop answer here/i.test(raw)) {
    const remainder = stripReadingDragDropUiText(
      raw
        .replace(/^drop answer here\s*…?\s*/i, '')
        .replace(/^[\.\•]\s*/, '')
    )
    return remainder || 'Complete the summary below.'
  }
  if (READING_ROMAN_HEADING_PATTERN.test(String(correctAnswer || '').trim()) && /^paragraph\s+[a-h]\b/i.test(raw)) {
    return raw
  }
  return stripReadingMatchingListFromPrompt(stripReadingDragDropUiText(raw) || raw)
}

const QUESTION_SECTION_HEADER_REGEX =
  /(?:^|\n)\s*Questions?\s+(\d+)(?:\s*[–-]\s*(\d+)|\s+and\s+(\d+))?/gi
const QUESTION_SECTION_MARKER_REGEX = /(?:^|\n)\s*Questions?\s+\d+(?:\s*[–-]\s*\d+|\s+and\s+\d+)?/i

const parseQuestionRangesFromText = (text) => {
  QUESTION_SECTION_HEADER_REGEX.lastIndex = 0
  const matches = [...String(text || '').matchAll(QUESTION_SECTION_HEADER_REGEX)]
  return matches.map((match) => {
    const start = Number(match[1])
    const end = Number(match[2] || match[3] || match[1])
    return {
      start: Math.min(start, end),
      end: Math.max(start, end)
    }
  })
}

const getQuestionSectionTextForNumber = (text, questionNumber) => {
  QUESTION_SECTION_HEADER_REGEX.lastIndex = 0
  const source = String(text || '')
  const matches = [...source.matchAll(QUESTION_SECTION_HEADER_REGEX)]
  const matchIndex = matches.findIndex((match) => {
    const start = Number(match[1])
    const end = Number(match[2] || match[3] || match[1])
    return questionNumber >= Math.min(start, end) && questionNumber <= Math.max(start, end)
  })
  if (matchIndex < 0) return ''
  const current = matches[matchIndex]
  const next = matches[matchIndex + 1]
  return source.slice(current.index, next ? next.index : source.length)
}

const isJunkReadingPassageParagraph = (paragraph) => {
  const text = String(paragraph || '').trim()
  if (!text) return true
  if (/^<\w+/i.test(text)) return true
  if (/^\d*Drop heading here<input/i.test(text)) return true
  if (/^\d+Drop heading here[A-H]\.?$/i.test(text)) return true
  if (/^Questions?\s+\d+/i.test(text)) return true
  if (/^Drag and drop an option/i.test(text)) return true
  if (/^hidden"\s*form=/i.test(text)) return true
  if (/^<(?:form|input|div|span|script)\b/i.test(text)) return true
  if (/<(?:form|input|div|span|script)\b/i.test(text) && text.replace(/\s/g, '').length < 24) return true
  if (/form="\s*$/i.test(text)) return true
  if (text.length < 50 && /[<>"'=]/.test(text)) return true
  return false
}

const stripReadingPassageSourceHtml = (value) =>
  String(value || '')
    .replace(/\r/g, '')
    .replace(/[\t ]*\n[\t ]*<(?:form|input|div|span|script)\b[\s\S]*?(?=\n\s*Questions?\s+\d|\s*$)/gi, '\n')
    .replace(/[\t ]*<(?:form|input|div|span|script)\b[\s\S]*?(?=\n\s*Questions?\s+\d|\s*$)/gi, '')
    .replace(/^\d+Drop heading here<input[\s\S]*?(?=\n\s*Questions?\s+\d|\s*$)/im, '')
    .trim()

const normalizeReadingPassageParagraph = (paragraph) =>
  String(paragraph || '')
    .replace(/\r/g, '')
    .replace(/\n+/g, ' ')
    .replace(/^\d+Drop heading here[A-H]\.?\s*/i, '')
    .replace(/^\d+Drop heading here<input[\s\S]*$/i, '')
    .replace(/Drop heading here[^.]*\.\.\.\s*/gi, '')
    .replace(/<(?:form|input|div|span|script)\b[\s\S]*$/i, '')
    .replace(/<[^>]*$/g, '')
    .replace(/hidden"\s*form="?\s*$/i, '')
    .trim()

export const cleanReadingPassageParagraphs = (paragraphs = []) =>
  (Array.isArray(paragraphs) ? paragraphs : [])
    .map(normalizeReadingPassageParagraph)
    .filter((paragraph) => !isJunkReadingPassageParagraph(paragraph))

const splitLongReadingPassageText = (text) => {
  const source = String(text || '').trim()
  if (!source) return []

  const sectionParts = source
    .split(/(?=(?:^|\s)([A-G])\s+(?=[A-Z"'(]))/)
    .map((part) => part.trim())
    .filter(Boolean)
  if (sectionParts.length >= 3) {
    return sectionParts.map((part) => part.replace(/^\s*([A-G])\s+/, '$1. '))
  }

  if (source.length < 2500) return [source]

  const sentences = source.match(/[^.!?]+[.!?]+(?:['"]|\s+|$)|[^.!?]+$/g) || [source]
  const chunks = []
  let current = ''
  for (const sentence of sentences) {
    const next = `${current}${sentence}`.trim()
    if (current && next.length > 900) {
      chunks.push(current.trim())
      current = sentence
    } else {
      current = next
    }
  }
  if (current.trim()) chunks.push(current.trim())
  return chunks.length >= 2 ? chunks : [source]
}

export const reflowReadingPassageParagraphs = (paragraphs = []) => {
  const cleaned = cleanReadingPassageParagraphs(paragraphs)
  const totalLength = cleaned.reduce((sum, paragraph) => sum + paragraph.length, 0)
  if (cleaned.length > 2 || totalLength < 3000) return cleaned
  return splitLongReadingPassageText(cleaned.join('\n\n'))
}

export const isCorruptReadingPassageBody = (paragraphs = []) => {
  const cleaned = cleanReadingPassageParagraphs(paragraphs)
  if (!cleaned.length) return true
  const substantial = cleaned.filter((paragraph) => paragraph.length >= 80)
  const totalLength = cleaned.reduce((sum, paragraph) => sum + paragraph.length, 0)
  if (substantial.length >= 2 && totalLength >= 500) return false
  return cleaned.some((paragraph) => /drop heading here|drop answer here|<input|<form\b|form="|type="hidden/i.test(paragraph)) || totalLength < 500
}

const findReadingPassageFixture = (title) => {
  const normalizedTitle = String(title || '')
    .trim()
    .replace(/^['"]|['"]$/g, '')
    .toLowerCase()
  const fixtureKey = Object.keys(READING_PASSAGE_BODY_FIXTURES).find((key) => {
    const normalizedKey = key.toLowerCase()
    return normalizedTitle.includes(normalizedKey) || normalizedKey.includes(normalizedTitle)
  })
  return fixtureKey ? READING_PASSAGE_BODY_FIXTURES[fixtureKey] : null
}

export const resolveReadingPassageBodyParagraphs = (title, paragraphs = []) => {
  const cleaned = cleanReadingPassageParagraphs(paragraphs)
  const resolved = !isCorruptReadingPassageBody(cleaned)
    ? cleaned
    : findReadingPassageFixture(title)
      ? [...findReadingPassageFixture(title)]
      : cleaned
  return reflowReadingPassageParagraphs(resolved)
}

const stripWrappedQuotes = (value) => {
  const text = String(value || '').replace(/\r/g, '').trim()
  if (!text) return ''
  if (
    (text.startsWith('"') && text.endsWith('"')) ||
    (text.startsWith("'") && text.endsWith("'")) ||
    (text.startsWith('```') && text.endsWith('```'))
  ) {
    return text.replace(/^(```|["'])/, '').replace(/(```|["'])$/, '').trim()
  }
  return text
}

const splitReadingTitleAndBody = (value, fallbackTitle) => {
  const lines = String(value || '').replace(/\r/g, '').split('\n')
  const titleIndex = lines.findIndex((line) => line.trim())
  const title = String(titleIndex >= 0 ? lines[titleIndex] : fallbackTitle || 'Passage 1').trim() || String(fallbackTitle || 'Passage 1')
  const bodyText = lines
    .slice(titleIndex >= 0 ? titleIndex + 1 : 0)
    .join('\n')
    .trim()
  const bodyParagraphs = bodyText
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\n+/g, ' ').trim())
    .filter(Boolean)

  return {
    title,
    bodyParagraphs: resolveReadingPassageBodyParagraphs(title, bodyParagraphs)
  }
}

const parseReadingPassages = (rawPassageText) => {
  const source = stripWrappedQuotes(rawPassageText)
  const passages = []
  const matches = [...source.matchAll(/(?:^|\n)\s*READING PASSAGE\s+(\d+)\s*$/gim)]
  for (let index = 0; index < matches.length; index += 1) {
    const current = matches[index]
    const next = matches[index + 1]
    const block = source
      .slice(current.index, next ? next.index : source.length)
      .replace(/^\s*READING PASSAGE\s+\d+\s*/i, '')
      .trim()
    const questionMarker = block.search(QUESTION_SECTION_MARKER_REGEX)
    const passageBodyRaw = stripReadingPassageSourceHtml(
      questionMarker >= 0 ? block.slice(0, questionMarker).trim() : block.trim()
    )
    const questionSectionText = sanitizeReadingQuestionSectionText(
      questionMarker >= 0 ? block.slice(questionMarker).trim() : ''
    )
    const { title, bodyParagraphs } = splitReadingTitleAndBody(passageBodyRaw, `Passage ${current[1]}`)
    passages.push({
      number: Number(current[1]),
      title,
      bodyParagraphs,
      questionSectionText,
      questionRanges: parseQuestionRangesFromText(questionSectionText)
    })
  }

  if (passages.length === 0 && source.trim()) {
    const fallbackQuestionMarker = source.search(QUESTION_SECTION_MARKER_REGEX)
    const fallbackPassageBodyRaw = stripReadingPassageSourceHtml(
      fallbackQuestionMarker >= 0 ? source.slice(0, fallbackQuestionMarker).trim() : source.trim()
    )
    const fallbackQuestionSectionText = sanitizeReadingQuestionSectionText(
      fallbackQuestionMarker >= 0 ? source.slice(fallbackQuestionMarker).trim() : ''
    )
    const { title: fallbackTitle, bodyParagraphs: fallbackBodyParagraphs } = splitReadingTitleAndBody(
      fallbackPassageBodyRaw,
      'Passage 1'
    )
    passages.push({
      number: 1,
      title: fallbackTitle,
      bodyParagraphs: fallbackBodyParagraphs,
      questionSectionText: fallbackQuestionSectionText,
      questionRanges: parseQuestionRangesFromText(fallbackQuestionSectionText)
    })
  }

  return passages
}

const parseReadingAnswerKey = (rawAnswerKey) => {
  const source = stripWrappedQuotes(rawAnswerKey)
  const segments = [...source.matchAll(/(?:^|\n)(Question\s+\d+:\s*[\s\S]*?)(?=\nQuestion\s+\d+:|$)/gi)].map((match) =>
    String(match[1] || '').trim()
  )
  return segments.map((segment) => {
    const numberMatch = segment.match(/^Question\s+(\d+):/im)
    const promptMatch = segment.match(
      /^Question\s+\d+:\s*([\s\S]*?)(?=\n\s*(?:Correct Answer|Accepted Answers|Answer Group|Exact Portion|Short Thai Explanation|Paraphrased Vocabulary):|$)/im
    )
    const correctAnswerMatch = segment.match(/Correct Answer:\s*(.+)/i)
    const acceptedAnswersMatch = segment.match(/Accepted Answers:\s*(.+)/i)
    const answerGroupMatch = segment.match(/Answer Group:\s*(.+)/i)
    const exactPortionMatch = segment.match(/Exact Portion:\s*([\s\S]*?)(?=\n(?:Short Thai Explanation|Paraphrased Vocabulary):|$)/i)
    const explanationMatch = segment.match(/Short Thai Explanation:\s*([\s\S]*?)(?=\nParaphrased Vocabulary:|$)/i)
    const paraphraseMatch = segment.match(/Paraphrased Vocabulary:\s*([\s\S]*?)$/i)
    const questionNumber = Number(numberMatch?.[1] || 0)
    const prompt = String(promptMatch?.[1] || '').trim()
    const correctAnswer = canonicalizeReadingCorrectAnswer(String(correctAnswerMatch?.[1] || '').trim())
    const acceptedAnswers = parseAcceptedReadingAnswers(acceptedAnswersMatch?.[1] || '')
    return {
      number: questionNumber,
      prompt,
      correctAnswer,
      acceptedAnswers: acceptedAnswers.length ? acceptedAnswers : undefined,
      answerGroup: String(answerGroupMatch?.[1] || '').trim() || undefined,
      answerType: guessReadingAnswerType(correctAnswer),
      exactPortion: String(exactPortionMatch?.[1] || '').trim().replace(/^["']|["']$/g, ''),
      explanationThai: String(explanationMatch?.[1] || '').trim(),
      paraphrasedVocabulary: String(paraphraseMatch?.[1] || '').trim()
    }
  })
}

const normalizeReadingQuestionRecord = (question, questionSectionText = '') => {
  const correctAnswer = canonicalizeReadingCorrectAnswer(question?.correctAnswer || '')
  const answerType = inferReadingAnswerType(correctAnswer, questionSectionText)
  return {
    ...question,
    prompt: sanitizeReadingQuestionPrompt(
      sanitizeReadingJudgementPrompt(question?.prompt, answerType),
      correctAnswer
    ),
    correctAnswer,
    answerType
  }
}

const READING_MONTH_RELEASES = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11
}

const normalizeReadingReleaseAt = (value) => {
  const text = String(value || '').trim()
  if (!text) return ''
  const date = new Date(text)
  return Number.isNaN(date.getTime()) ? '' : date.toISOString()
}

const getReadingReleaseAtFromMonthlyTitle = (value) => {
  const match = String(value || '').match(
    /\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t|tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+(\d{4})\b/i
  )
  if (!match) return ''
  const monthIndex = READING_MONTH_RELEASES[String(match[1] || '').toLowerCase()]
  const year = Number(match[2])
  if (!Number.isInteger(monthIndex) || !Number.isInteger(year) || year < 2020 || year > 2100) return ''
  return new Date(Date.UTC(year, monthIndex, 19, 17, 0, 0, 0)).toISOString()
}

const resolveReadingReleaseAt = ({ releaseAt, collectionTitle, title } = {}) =>
  normalizeReadingReleaseAt(releaseAt) ||
  getReadingReleaseAtFromMonthlyTitle(collectionTitle) ||
  getReadingReleaseAtFromMonthlyTitle(title)

export const buildReadingExamPayload = ({ title, category, collectionTitle, releaseAt, rawPassageText, rawAnswerKey }) => {
  const passages = parseReadingPassages(rawPassageText)
  const questions = parseReadingAnswerKey(rawAnswerKey)
  const passagesWithQuestions = passages.map((passage) => ({
    ...passage,
    questions: questions
      .filter((question) =>
        passage.questionRanges.some((range) => question.number >= range.start && question.number <= range.end)
      )
      .map((question) => normalizeReadingQuestionRecord(question, getQuestionSectionTextForNumber(passage.questionSectionText, question.number)))
  }))

  if (passagesWithQuestions.length === 0) {
    throw new Error(
      'The passage parser could not find any READING PASSAGE blocks. Please keep the "READING PASSAGE 1/2/3" headings in your upload.'
    )
  }

  if (questions.length === 0) {
    throw new Error(
      'The answer key parser could not find any "Question X:" blocks. Please keep the Question / Correct Answer / Exact Portion format.'
    )
  }

  const questionsMissingPassage = questions.filter(
    (question) => !passagesWithQuestions.some((passage) => passage.questions.some((item) => item.number === question.number))
  )
  if (questionsMissingPassage.length > 0) {
    throw new Error(
      `Some questions could not be matched to a passage range: ${questionsMissingPassage
        .slice(0, 10)
        .map((question) => question.number)
        .join(', ')}`
    )
  }

  return {
    title: String(title || '').trim(),
    category: normalizeReadingCategory(category),
    ...(normalizeReadingCollectionTitle(collectionTitle)
      ? { collectionTitle: normalizeReadingCollectionTitle(collectionTitle) }
      : {}),
    ...(resolveReadingReleaseAt({ releaseAt, collectionTitle, title })
      ? { releaseAt: resolveReadingReleaseAt({ releaseAt, collectionTitle, title }) }
      : {}),
    passages: passagesWithQuestions,
    questionCount: questions.length
  }
}
