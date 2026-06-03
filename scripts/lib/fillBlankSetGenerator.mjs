/**
 * Shared fill-blank set generator for Cambridge / Journey builds.
 */
import { buildReadingFillQuestionGroups } from '../../src/readingFillDisplay.ts'

export const PARAPHRASE_RULES = [
  [/\ball year round\b/gi, 'throughout the year'],
  [/\bgrown organically\b/gi, 'raised entirely organically'],
  [/\binfectious diseases\b/gi, 'infectious illnesses'],
  [/\bfossil fuel use\b/gi, 'fossil fuel consumption'],
  [/\brenewable energy\b/gi, 'renewable power'],
  [/\bartificial light\b/gi, 'artificial lighting'],
  [/\bpopulation grew\b/gi, 'population increased'],
  [/\bfollow rules\b/gi, 'observe rules'],
  [/\bself-regulate\b/gi, 'regulate themselves']
]

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const isSingleWordAnswer = (value) => /^[A-Za-z][A-Za-z'-]*$/.test(String(value || '').trim())

export const resolveSingleWordAnswer = (question, passageText) => {
  const raw = String(question.correctAnswer || '').trim()
  if (isSingleWordAnswer(raw)) return raw

  const passage = String(passageText || '').toLowerCase()
  const tokens = raw
    .split(/\s+/)
    .map((token) => token.replace(/[^A-Za-z'-]/g, ''))
    .filter(Boolean)

  for (let index = tokens.length - 1; index >= 0; index -= 1) {
    const token = tokens[index]
    if (token.length >= 3 && new RegExp(`\\b${escapeRegex(token)}\\b`, 'i').test(passage)) {
      return token
    }
  }

  const first = tokens[0]
  return first && first.length >= 3 ? first : raw.split(/\s+/)[0] || raw
}

export const cleanQuotes = (value) =>
  String(value || '')
    .replace(/^["'""]+|["'""]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim()

const THAI_BOILERPLATE =
  /บทความมี|ในข้อให้|จึงคำตอบ|paraphrase|ข้อความในข้อ|ข้อที่ว่า|อ้างอิง|NOT GIVEN|TRUE|FALSE|answer signal/i

export const buildThaiGlossary = (exams) => {
  const glossary = new Map()
  for (const exam of exams) {
    for (const passage of exam.parsedPayload?.passages || []) {
      for (const question of passage.questions || []) {
        if (question.answerType !== 'text') continue
        const answer = String(question.correctAnswer || '').trim().toLowerCase()
        if (!answer || answer.includes(' ')) continue
        const segments =
          String(question.explanationThai || '').match(/[\u0E00-\u0E7F][\u0E00-\u0E7F\s,.()/-]*/g) || []
        for (const segment of segments) {
          const trimmed = segment.trim()
          if (trimmed.length < 2 || trimmed.length > 36) continue
          if (THAI_BOILERPLATE.test(trimmed)) continue
          if (!glossary.has(answer)) glossary.set(answer, trimmed)
        }
      }
    }
  }
  return glossary
}

export const extractThai = (text, answer, glossary) => {
  const key = String(answer || '').trim().toLowerCase()
  if (key && glossary.has(key)) return glossary.get(key)

  const source = String(text || '')
  const segments = source.match(/[\u0E00-\u0E7F][\u0E00-\u0E7F\s,.()/-]*/g) || []
  const filtered = segments
    .map((segment) => segment.trim())
    .filter((segment) => segment.length >= 2 && segment.length <= 36)
    .filter((segment) => !THAI_BOILERPLATE.test(segment))
  if (filtered.length) {
    return filtered.sort((first, second) => second.length - first.length)[0]
  }
  return key || ''
}

const collapseGapPlaceholder = (text, number) =>
  String(text || '').replace(new RegExp(`(\\{${number}\\}\\s*)+`, 'g'), `{${number}}`).trim()

export const isWeakFillPrompt = (prompt) => {
  const text = String(prompt || '').trim()
  if (!text || text.length < 8) return true
  if (/answer signal|complete the summary\/diagram|drop (?:heading|answer)|label the diagram|questions \d+/i.test(text)) {
    return true
  }
  if (/drop (?:heading|answer) here/i.test(text)) return true
  if ((text.match(/…+/g) || []).length > 1) return true
  if ((text.match(/\.{2,}/g) || []).length > 1) return true
  if (/^[.…\s]+/.test(text)) return true
  return false
}

export const parseKeywordPair = (question) => {
  const vocab = String(question.paraphrasedVocabulary || '')
    .replace(/answer signal\s*=\s*[^;]+/gi, '')
  const parts = vocab
    .split(';')
    .map((part) => part.split('=').map((piece) => piece.trim()))
    .filter(([left, right]) => left && right && !/^answer signal$/i.test(left))
    .map(([left, right]) => ({ summary: left, passage: right.split('/')[0].trim() }))

  if (parts.length) {
    const best = parts[0]
    return {
      passageKeyword: best.passage.slice(0, 120),
      questionKeyword: best.summary.slice(0, 120)
    }
  }

  const portion = cleanQuotes(question.exactPortion)
  return { passageKeyword: portion.slice(0, 48), questionKeyword: portion.slice(0, 48) }
}

const applyParaphraseRules = (text) => {
  let result = text
  for (const [pattern, replacement] of PARAPHRASE_RULES) {
    result = result.replace(pattern, replacement)
  }
  return result
}

const sentenceContainingAnswer = (text, answer) => {
  const source = cleanQuotes(text)
  if (!source) return ''
  const pieces =
    source.match(/(?:[^.!?]|\d\.\d)+(?:\.(?!\d)|[!?])+(?:\s+|$)|(?:[^.!?]|\d\.\d)+$/g) || [source]
  const match = pieces.find((piece) => new RegExp(`\\b${escapeRegex(answer)}\\b`, 'i').test(piece))
  return (match || pieces[0]).trim()
}

const paraphraseSentenceForGap = (sentence, answer, number) => {
  let text = applyParaphraseRules(cleanQuotes(sentence))
  const gapPattern = new RegExp(`\\b${escapeRegex(answer)}\\b`, 'i')
  if (!gapPattern.test(text)) {
    return `The passage refers to {${number}} in this context.`
  }
  text = text.replace(gapPattern, `{${number}}`)
  text = text.replace(/\s+/g, ' ').trim()
  if (!/[.!?]$/.test(text)) text += '.'
  return collapseGapPlaceholder(text, number)
}

export const buildGapClause = (question) => {
  const answer = String(question.answer || question.correctAnswer || '').trim()
  const number = question.number
  const rawPrompt = cleanQuotes(question.prompt)

  if (!isWeakFillPrompt(rawPrompt)) {
    let fromPrompt = rawPrompt.replace(/…+|\s*\.{2,}/g, `{${number}}`).replace(/\s+/g, ' ').trim()
    fromPrompt = collapseGapPlaceholder(fromPrompt, number)
    if (fromPrompt.includes(`{${number}}`) && fromPrompt.length >= 16 && !/answer signal/i.test(fromPrompt)) {
      return applyParaphraseRules(fromPrompt)
    }
  }

  const exact = cleanQuotes(question.exactPortion)
  let sentence = sentenceContainingAnswer(exact, answer)
  if (!sentence && exact) {
    sentence = exact
  }
  if (!sentence) return `The passage refers to {${number}}.`
  return paraphraseSentenceForGap(sentence, answer, number)
}

export const inferSummaryTitle = (passageTitle) => {
  let title = cleanQuotes(passageTitle)
    .replace(/^(READING PASSAGE \d+\s*)?/i, '')
    .replace(/\b\d+Drop\b/gi, '')
    .replace(/\bQuestions?\s+\d+.*$/i, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
  if (title.length <= 56) return title
  return title.split(/\s+/).slice(0, 7).join(' ')
}

export const findSourceParagraphLetters = (passage, questions) => {
  const paragraphs = passage.bodyParagraphs || []
  const letters = []
  for (const paragraph of paragraphs) {
    const letterMatch = paragraph.match(/^([A-G])[\.)]\s/)
    if (letterMatch) letters.push(letterMatch[1])
  }
  if (letters.length >= 2) {
    return [letters[0], letters[1]]
  }

  let bestStart = 0
  let bestScore = -1
  for (let index = 0; index < Math.max(paragraphs.length - 1, 1); index += 1) {
    const combined = `${paragraphs[index] || ''} ${paragraphs[index + 1] || ''}`.toLowerCase()
    const score = questions.reduce((sum, question) => {
      const answer = String(question.answer || question.correctAnswer || '').toLowerCase()
      return sum + (answer && combined.includes(answer) ? 1 : 0)
    }, 0)
    if (score > bestScore) {
      bestScore = score
      bestStart = index
    }
  }
  const first = String.fromCharCode(65 + bestStart)
  const second = String.fromCharCode(65 + Math.min(bestStart + 1, paragraphs.length - 1))
  return [first, second]
}

export const buildSummaryLines = (questions, sectionKind, sourceQuestions) => {
  const lines = []
  const clauses = questions.map((question, index) => ({
    number: question.number,
    text: buildGapClause({
      ...sourceQuestions[index],
      answer: question.answer,
      number: question.number
    })
  }))

  if (sectionKind === 'table' || sectionKind === 'diagram') {
    for (const clause of clauses) {
      lines.push({ type: 'bullet', text: clause.text })
    }
    return lines
  }

  if (questions.length <= 3) {
    lines.push({ type: 'para', text: clauses.map((item) => item.text).join(' ') })
    return lines
  }

  const splitAt = Math.ceil(clauses.length / 2)
  const firstChunk = clauses.slice(0, splitAt)
  const secondChunk = clauses.slice(splitAt)

  if (firstChunk.length >= 2) {
    lines.push({ type: 'para', text: firstChunk.map((item) => item.text).join(' ') })
  } else if (firstChunk.length === 1) {
    lines.push({ type: 'para', text: firstChunk[0].text })
  }

  for (const clause of secondChunk) {
    lines.push({ type: 'bullet', text: clause.text })
  }

  return lines
}

const detectSectionKind = (block) => {
  const text = String(block || '').toLowerCase()
  if (/label the diagram|diagram below/.test(text)) return 'diagram'
  if (/complete the table|procedure\s*\|/.test(text)) return 'table'
  if (/complete the notes/.test(text)) return 'notes'
  if (/complete the summary/.test(text)) return 'summary'
  if (/complete the sentences/.test(text)) return 'sentences'
  return 'summary'
}

export const buildInstructions = (start, end) => [
  `Questions ${start}–${end}`,
  'Complete the summary below.',
  'Choose ONE WORD ONLY from the passage for each answer.',
  `Write your answers in boxes ${start}–${end} on your answer sheet.`
]

export const isLetterFillGroup = (questions) =>
  questions.some((question) => /^[A-F]$/i.test(String(question.correctAnswer || '').trim()))

export const generateFillBlankSet = ({
  examId,
  passage,
  fillQuestions,
  groupInstruction,
  thaiGlossary
}) => {
  const passageText = (passage.bodyParagraphs || []).join('\n')
  const sorted = [...fillQuestions].sort((a, b) => a.number - b.number)
  const startNumber = sorted[0].number
  const endNumber = sorted[sorted.length - 1].number
  const sectionKind = detectSectionKind(groupInstruction)

  const newQuestions = sorted.map((question) => {
    const answer = resolveSingleWordAnswer(question, passageText)
    const { passageKeyword, questionKeyword } = parseKeywordPair(question)
    const thaiMeaning =
      extractThai(question.explanationThai, answer, thaiGlossary) ||
      extractThai(question.paraphrasedVocabulary, answer, thaiGlossary) ||
      answer

    return {
      number: question.number,
      answer,
      acceptedAnswers: (question.acceptedAnswers || [])
        .map((item) => String(item).trim())
        .filter((item) => item && item.toLowerCase() !== answer.toLowerCase())
        .map((item) => resolveSingleWordAnswer({ correctAnswer: item }, passageText))
        .filter((item, index, list) => item && list.indexOf(item) === index),
      passageKeyword: passageKeyword.slice(0, 120),
      questionKeyword: questionKeyword.slice(0, 120),
      thaiMeaning: thaiMeaning.slice(0, 120),
      exactPortion: cleanQuotes(question.exactPortion).slice(0, 320)
    }
  })

  return {
    examId,
    passageNumber: passage.number,
    startNumber,
    endNumber,
    sourceParagraphs: findSourceParagraphLetters(passage, newQuestions),
    instructions: buildInstructions(startNumber, endNumber),
    summaryTitle: inferSummaryTitle(passage.title),
    summaryLines: buildSummaryLines(newQuestions, sectionKind, sorted),
    questions: newQuestions
  }
}

export const generateFillBlankSetsForPassage = ({
  examId,
  passage,
  thaiGlossary,
  matchingCheck = () => false
}) => {
  const groups = buildReadingFillQuestionGroups(
    passage,
    passage.questions || [],
    matchingCheck,
    examId
  )
  const sets = []
  for (const group of groups) {
    const fillQuestions = group.questions.filter((question) => question.answerType === 'text')
    if (!fillQuestions.length || isLetterFillGroup(fillQuestions)) continue
    sets.push(
      generateFillBlankSet({
        examId,
        passage,
        fillQuestions,
        groupInstruction: group.instruction,
        thaiGlossary
      })
    )
  }
  return sets
}

export const remapSummaryText = (text, delta) =>
  String(text || '').replace(/\{(\d+)\}/g, (_, token) => `{${Number(token) + delta}}`)

export const remapSetToJourney = (sourceSet, { journeyExamId, passageNumber, journeyStart, journeyEnd }) => {
  const delta = journeyStart - sourceSet.startNumber
  const needed = new Set()
  for (let number = journeyStart; number <= journeyEnd; number += 1) needed.add(number)

  const questions = sourceSet.questions
    .filter((question) => {
      const remapped = question.number + delta
      return remapped >= journeyStart && remapped <= journeyEnd
    })
    .map((question) => ({ ...question, number: question.number + delta }))

  if (questions.length !== journeyEnd - journeyStart + 1) return null

  const summaryLines = sourceSet.summaryLines
    .map((line) => ({
      ...line,
      text: line.text ? remapSummaryText(line.text, delta) : line.text
    }))
    .filter((line) => {
      if (!line.text) return true
      const placeholders = [...line.text.matchAll(/\{(\d+)\}/g)].map((match) => Number(match[1]))
      if (!placeholders.length) return true
      return placeholders.every((number) => needed.has(number))
    })

  return {
    examId: journeyExamId,
    passageNumber,
    startNumber: journeyStart,
    endNumber: journeyEnd,
    sourceParagraphs: sourceSet.sourceParagraphs,
    instructions: buildInstructions(journeyStart, journeyEnd),
    summaryTitle: sourceSet.summaryTitle,
    summaryLines,
    questions
  }
}

export const findBestSourceSet = (sourceExamId, sourceStart, sourceEnd, manualSets, generatedSets) => {
  const exactManual = manualSets.find(
    (set) =>
      set.examId === sourceExamId && set.startNumber === sourceStart && set.endNumber === sourceEnd
  )
  if (exactManual) return exactManual

  const supersetManual = manualSets.find(
    (set) =>
      set.examId === sourceExamId &&
      set.startNumber <= sourceStart &&
      set.endNumber >= sourceEnd
  )
  if (supersetManual) return supersetManual

  const exactGenerated = generatedSets.find(
    (set) =>
      set.examId === sourceExamId && set.startNumber === sourceStart && set.endNumber === sourceEnd
  )
  if (exactGenerated) return exactGenerated

  return generatedSets.find(
    (set) =>
      set.examId === sourceExamId &&
      set.startNumber <= sourceStart &&
      set.endNumber >= sourceEnd
  )
}
