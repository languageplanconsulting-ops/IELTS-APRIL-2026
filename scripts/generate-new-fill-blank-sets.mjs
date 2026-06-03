#!/usr/bin/env node
/**
 * Generate replacement fill-blank question sets for all Normal Reading exams.
 * Output: src/generated/readingNewFillBlankSets.json
 *
 * Run: node scripts/generate-new-fill-blank-sets.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { buildReadingFillQuestionGroups } from '../src/readingFillDisplay.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const outputPath = path.join(root, 'src/generated/readingNewFillBlankSets.json')

/** Keep hand-authored sets (higher quality) — do not overwrite in JSON. */
const MANUAL_SET_KEYS = new Set([
  'cambridge-11-test1-passage1:1-7',
  'cambridge-14-test1-passage1:1-8',
  'cambridge-17-test1-passage1:1-6'
])

const BOOKS = [11, 12, 13, 14, 15, 16, 17, 19]

const PARAPHRASE_RULES = [
  [/\ball year round\b/gi, 'throughout the year'],
  [/\bgrown organically\b/gi, 'raised entirely organically'],
  [/\binfectious diseases\b/gi, 'infectious illnesses'],
  [/\bfossil fuel use\b/gi, 'fossil fuel consumption'],
  [/\brenewable energy\b/gi, 'renewable power'],
  [/\bartificial light\b/gi, 'artificial lighting'],
  [/\bpopulation grew\b/gi, 'population increased'],
  [/\bover half the people in the world now live in\b/gi, 'more than half of the global population now lives in'],
  [/\bperceptions of risk to do with\b/gi, 'concerns about'],
  [/\bgreater competition in academic learning and schools\b/gi, 'increased competition within school-based learning'],
  [/\bevidence to base policies on\b/gi, 'evidence needed to support policies'],
  [/\bchild's later life\b/gi, "rest of the child's life"],
  [/\bchild’s later life\b/gi, "rest of the child's life"],
  [/\bfollow rules\b/gi, 'observe rules'],
  [/\btake turns\b/gi, 'take turns'],
  [/\bself-regulate\b/gi, 'regulate themselves'],
  [/\bkey predictor of academic performance\b/gi, 'strong indicator of later school success'],
  [/\bneurodevelopmental disorders\b/gi, 'developmental conditions'],
  [/\bplay-based approach\b/gi, 'learning approach built around play'],
  [/\bworld's first\b/gi, 'the first ever'],
  [/\bworld’s first\b/gi, 'the first ever'],
  [/\bventilation shafts\b/gi, 'air shafts'],
  [/\bcut and cover\b/gi, "'cut and cover'"],
  [/\bdid not make a profit\b/gi, 'failed to earn money'],
  [/\braising the funding\b/gi, 'securing funding'],
  [/\binner-city slums\b/gi, 'crowded city-centre housing'],
  [/\bnewly constructed suburbs\b/gi, 'new suburban areas'],
  [/\bcritical articles printed by the press\b/gi, 'negative press coverage'],
  [/\btwo-metre-deep layer of soil\b/gi, 'layer of soil about two metres deep'],
  [/\bscientific reasoning\b/gi, 'logical problem-solving'],
  [/\bproblem-solvers\b/gi, 'people who solve problems'],
  [/\bwriting difficult\b/gi, 'writing challenging'],
  [/\bbetter-structured stories\b/gi, 'more structured stories'],
  [/\bimportance of play has been lost\b/gi, 'value of play has declined'],
  [/\bregarded as something trivial\b/gi, 'seen as unimportant']
]

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const isSingleWordAnswer = (value) => /^[A-Za-z][A-Za-z'-]*$/.test(String(value || '').trim())

/** When legacy data allows two-word answers, pick one word that appears in the passage. */
const resolveSingleWordAnswer = (question, passageText) => {
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

const cleanQuotes = (value) =>
  String(value || '')
    .replace(/^["'“”]+|["'“”]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim()

const THAI_BOILERPLATE =
  /บทความมี|ในข้อให้|จึงคำตอบ|paraphrase|ข้อความในข้อ|ข้อที่ว่า|อ้างอิง|NOT GIVEN|TRUE|FALSE/i

const buildThaiGlossary = (exams) => {
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

const extractThai = (text, answer, glossary) => {
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

const isWeakFillPrompt = (prompt) => {
  const text = String(prompt || '').trim()
  if (!text || text.length < 8) return true
  if (/drop (?:heading|answer)|label the diagram|questions \d+/i.test(text)) return true
  if ((text.match(/…+/g) || []).length > 1) return true
  if ((text.match(/\.{2,}/g) || []).length > 1) return true
  return false
}

const parseKeywordPair = (question) => {
  const vocab = String(question.paraphrasedVocabulary || '')
  const parts = vocab
    .split(/\s*=\s*/)
    .map((part) => part.trim())
    .filter(Boolean)
  const answer = String(question.correctAnswer || '').trim().toLowerCase()

  if (parts.length >= 2) {
    let passageKeyword = parts[0]
    let questionKeyword = parts[1]
    if (parts.length >= 3 && parts[parts.length - 1].toLowerCase() === answer) {
      passageKeyword = parts[0]
      questionKeyword = parts[1]
    }
    if (questionKeyword.length > passageKeyword.length + 24) {
      ;[passageKeyword, questionKeyword] = [questionKeyword, passageKeyword]
    }
    return { passageKeyword, questionKeyword }
  }
  if (parts.length === 1) {
    return { passageKeyword: parts[0], questionKeyword: parts[0] }
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

const buildGapClause = (question) => {
  const answer = String(question.answer || question.correctAnswer || '').trim()
  const number = question.number
  const rawPrompt = cleanQuotes(question.prompt)

  if (!isWeakFillPrompt(rawPrompt)) {
    const fromPrompt = collapseGapPlaceholder(
      rawPrompt.replace(/…+|\s*\.{2,}/g, `{${number}}`).replace(/\s+/g, ' ').trim(),
      number
    )
    if (fromPrompt.includes(`{${number}}`) && fromPrompt.length >= 12) {
      return applyParaphraseRules(fromPrompt)
    }
  }

  let sentence = sentenceContainingAnswer(question.exactPortion, answer)
  if (!sentence && question.exactPortion) {
    sentence = sentenceContainingAnswer(
      question.exactPortion.replace(
        new RegExp(`\\b${escapeRegex(String(question.correctAnswer || ''))}\\b`, 'gi'),
        answer
      ),
      answer
    )
  }
  if (!sentence) sentence = rawPrompt
  sentence = applyParaphraseRules(sentence)
  const gapPattern = new RegExp(`\\b${escapeRegex(answer)}\\b`, 'i')
  if (gapPattern.test(sentence)) {
    return collapseGapPlaceholder(sentence.replace(gapPattern, `{${number}}`).replace(/\s+/g, ' ').trim(), number)
  }
  return `The passage mentions {${number}} in this context.`
}

const inferSummaryTitle = (passageTitle, questions) => {
  const title = cleanQuotes(passageTitle)
    .replace(/^(READING PASSAGE \d+\s*)?/i, '')
    .replace(/\bBrick by brick,?/i, '')
    .trim()
  if (title.length <= 64) return title
  return title.split(/\s+/).slice(0, 8).join(' ')
}

const findSourceParagraphLetters = (passage, questions) => {
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

const buildSummaryLines = (questions, sectionKind, sourceQuestions) => {
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
    lines.push({ type: 'bullet', text: firstChunk[0].text })
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

const buildInstructions = (start, end) => [
  `Questions ${start}–${end}`,
  'Complete the summary below.',
  'Choose ONE WORD ONLY from the passage for each answer.',
  `Write your answers in boxes ${start}–${end} on your answer sheet.`
]

const loadNormalExams = async () => {
  const exams = []
  for (const book of BOOKS) {
    const mod = await import(
      pathToFileURL(path.join(root, `server/userProvidedReadingPracticeCambridge${book}.mjs`)).href
    )
    const key = Object.keys(mod).find((name) => name.includes('EXAMS'))
    for (const exam of mod[key] || []) {
      if (exam.category === 'normal') exams.push(exam)
    }
  }
  return exams
}

const noopMatching = () => false

const exams = await loadNormalExams()
const thaiGlossary = buildThaiGlossary(exams)
const sets = []

for (const exam of exams) {
  for (const passage of exam.parsedPayload?.passages || []) {
    const groups = buildReadingFillQuestionGroups(
      passage,
      passage.questions || [],
      noopMatching,
      exam.id
    )

    for (const group of groups) {
      const block = group.instruction || ''
      const sectionKind = detectSectionKind(block)
      const passageText = (passage.bodyParagraphs || []).join('\n')
      const fillQuestions = group.questions
        .filter((question) => question.answerType === 'text')
        .sort((first, second) => first.number - second.number)

      if (!fillQuestions.length) continue

      const startNumber = fillQuestions[0].number
      const endNumber = fillQuestions[fillQuestions.length - 1].number

      if (MANUAL_SET_KEYS.has(`${exam.id}:${startNumber}-${endNumber}`)) continue

      const newQuestions = fillQuestions.map((question) => {
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

      const summaryLines = buildSummaryLines(newQuestions, sectionKind, fillQuestions)
      if (sectionKind === 'notes' && newQuestions.length >= 4) {
        summaryLines.unshift({ type: 'heading', text: 'Key points from the passage' })
      }

      sets.push({
        examId: exam.id,
        passageNumber: passage.number,
        startNumber,
        endNumber,
        sourceParagraphs: findSourceParagraphLetters(passage, newQuestions),
        instructions: buildInstructions(startNumber, endNumber),
        summaryTitle: inferSummaryTitle(passage.title, newQuestions),
        summaryLines,
        questions: newQuestions
      })
    }
  }
}

sets.sort((first, second) => {
  if (first.examId !== second.examId) return first.examId.localeCompare(second.examId)
  return first.startNumber - second.startNumber
})

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, `${JSON.stringify(sets, null, 2)}\n`, 'utf8')

const questionTotal = sets.reduce((sum, set) => sum + set.questions.length, 0)
console.log(`Wrote ${sets.length} fill-blank sets (${questionTotal} questions) to ${outputPath}`)
