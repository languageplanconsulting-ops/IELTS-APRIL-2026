const normalizeReadingCategory = (value) => {
  const normalized = String(value || '').trim().toLowerCase()
  if (normalized === 'advanced' || normalized === 'passage3') return 'advanced'
  return 'normal'
}

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
    bodyParagraphs
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
    const passageBodyRaw = questionMarker >= 0 ? block.slice(0, questionMarker).trim() : block.trim()
    const questionSectionText = questionMarker >= 0 ? block.slice(questionMarker).trim() : ''
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
    const fallbackPassageBodyRaw = fallbackQuestionMarker >= 0 ? source.slice(0, fallbackQuestionMarker).trim() : source.trim()
    const fallbackQuestionSectionText = fallbackQuestionMarker >= 0 ? source.slice(fallbackQuestionMarker).trim() : ''
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
  return {
    ...question,
    correctAnswer,
    answerType: inferReadingAnswerType(correctAnswer, questionSectionText)
  }
}

export const buildReadingExamPayload = ({ title, category, rawPassageText, rawAnswerKey }) => {
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
    passages: passagesWithQuestions,
    questionCount: questions.length
  }
}
