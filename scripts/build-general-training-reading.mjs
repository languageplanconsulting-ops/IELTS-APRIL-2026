/**
 * Scrape IELTS General Training Reading from ieltstrainingonline.com
 * and build section drills + full tests for the app.
 *
 * Run: node scripts/build-general-training-reading.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { buildComprehensiveEnrichment } from './cambridge-17-enrichment-builder.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const { buildReadingExamPayload } = await import(
  pathToFileURL(path.join(root, 'server/readingImportUtils.mjs')).href
)

const TEST_NUMBERS = [17, 1, 2, 5, 7]
const COLLECTION_TITLE = 'IELTS General Training Reading'

const padTestNumber = (n) => (n >= 10 ? String(n).padStart(3, '0') : String(n).padStart(2, '0'))

const fetchTestMarkdown = async (testNumber) => {
  const padded = padTestNumber(testNumber)
  const url = `https://ieltstrainingonline.com/ielts-general-reading-practice-test-${padded}-with-answers/`
  const response = await fetch(url, {
    headers: { 'User-Agent': 'EnglishPlan-IELTS/1.0 (reading import)' }
  })
  if (!response.ok) {
    throw new Error(`Failed to fetch test ${padded}: ${response.status}`)
  }
  return response.text()
}

const htmlToText = (html) =>
  String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\r/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

const normalizeFetchedText = (raw) => {
  const text = htmlToText(raw)
  const titleMatch = text.match(/General Reading Practice Test\s+(\d+)/i)
  if (!titleMatch) return text
  const start = text.indexOf(titleMatch[0])
  const answerStart = text.search(/Answer IELTS General Reading Test\s+\d+/i)
  const end = answerStart >= 0 ? answerStart : text.length
  return text.slice(start, end).trim()
}

const splitSections = (text) => {
  const markers = [...text.matchAll(/(?:^|\n)\s*(?:#{1,3}\s*)?SECTION\s+([123])\b/gim)]
  const sections = {}
  for (let index = 0; index < markers.length; index += 1) {
    const current = markers[index]
    const next = markers[index + 1]
    const sectionNumber = Number(current[1])
    const body = text.slice(current.index + current[0].length, next ? next.index : text.length).trim()
    if (!sections[sectionNumber] || body.length > sections[sectionNumber].length) {
      sections[sectionNumber] = body
    }
  }
  return sections
}

const splitPassageBlocks = (sectionText) => {
  const markers = [
    ...sectionText.matchAll(
      /(?:^|\n)\s*(?:Read the text below and answer Questions?\s+[\d–-]+[\s\S]*?\n|Read the text below and answer questions?\s+[\d–-]+[\s\S]*?\n)/gim
    )
  ]
  const blocks = []
  for (let index = 0; index < markers.length; index += 1) {
    const current = markers[index]
    const next = markers[index + 1]
    const chunk = sectionText.slice(current.index, next ? next.index : sectionText.length).trim()
    const questionStart = chunk.search(/(?:^|\n)\s*(?:#{1,4}\s*)?Questions?\s+\d+/im)
    const passagePart = questionStart >= 0 ? chunk.slice(0, questionStart).trim() : chunk
    const questionPart = questionStart >= 0 ? chunk.slice(questionStart).trim() : ''
    const titleMatch = passagePart.match(/(?:^|\n)\s*#{1,3}\s*(.+?)(?:\n|$)/)
    const title = String(titleMatch?.[1] || `Passage ${index + 1}`).trim()
    const body = passagePart
      .replace(/^Read the text below[\s\S]*?\n/i, '')
      .replace(/(?:^|\n)\s*#{1,3}\s*.+\n?/, '')
      .trim()
    blocks.push({ title, body, questionSectionText: sanitizeQuestionSectionText(questionPart) })
  }
  return blocks
}

const sanitizeQuestionSectionText = (text) =>
  String(text || '')
    .replace(/\s*IELTS General[\s\S]*$/i, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

const extractPromptFromSectionLine = (line, number) => {
  const trimmed = String(line || '').trim()
  if (!trimmed) return ''
  if (new RegExp(`\\b${number}\\s*[.…·]{2,}`).test(trimmed)) {
    return trimmed.replace(/^●\s*/, '').trim()
  }
  const numbered = trimmed.match(new RegExp(`^${number}\\s+(.+)$`))
  return numbered ? numbered[1].trim() : ''
}

const extractPromptFromSection = (questionSectionText, number) => {
  const lines = sanitizeQuestionSectionText(questionSectionText)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
  for (const line of lines) {
    const prompt = extractPromptFromSectionLine(line, number)
    if (prompt) return prompt
  }
  return ''
}

const extractQuestionPrompts = (questionSectionText) => {
  const prompts = new Map()
  const lines = sanitizeQuestionSectionText(questionSectionText)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  let activeMcqNumber = null
  for (const line of lines) {
    if (/^Questions?\s+\d+/i.test(line)) {
      activeMcqNumber = null
      continue
    }
    if (/^(TRUE|FALSE|NOT GIVEN|YES|NO|List of Headings|NB\b)/i.test(line)) continue
    if (/^Write the correct/i.test(line)) continue
    if (/^Choose (?:NO MORE|ONE WORD|the correct)/i.test(line)) continue
    if (/^Complete the/i.test(line)) continue
    if (/^Look at the/i.test(line)) continue
    if (/^The text has/i.test(line)) continue
    if (/^For which/i.test(line)) continue
    if (/^Do the following/i.test(line)) continue
    if (/^In boxes/i.test(line)) continue
    if (/^Which section/i.test(line)) continue
    if (/^Answer the questions/i.test(line)) continue
    if (/^boxes \d+/i.test(line)) continue

    const gapInLine = line.match(/(\d+)\s*[.…·]{2,}/)
    if (gapInLine) {
      const num = Number(gapInLine[1])
      const cleaned = line.replace(/^●\s*/, '').trim()
      if (!prompts.has(num) || cleaned.length > (prompts.get(num)?.length || 0)) {
        prompts.set(num, cleaned)
      }
      continue
    }

    const numbered = line.match(/^(\d+)\s+(.+)$/)
    if (numbered && !/^([A-G])\s/.test(numbered[2])) {
      const num = Number(numbered[1])
      prompts.set(num, numbered[2].trim())
      activeMcqNumber = num
      continue
    }

    const mcqOption = line.match(/^([A-D])\s+(.+)$/)
    if (mcqOption && activeMcqNumber) {
      const existing = prompts.get(activeMcqNumber) || ''
      if (!existing.includes(`${mcqOption[1]} `)) {
        prompts.set(
          activeMcqNumber,
          `${existing}${existing ? ' | ' : ''}${mcqOption[1]} ${mcqOption[2]}`.trim()
        )
      }
    }
  }
  return prompts
}

const parseAnswers = (raw, testNumber) => {
  const text = htmlToText(raw)
  const padded = padTestNumber(testNumber)
  const compact = String(testNumber)
  const answerStart = text.search(
    new RegExp(
      `Answer IELTS General Reading Test\\s+(?:0*${compact}|${padded}|${compact.split('').join('\\s*')})\\b`,
      'i'
    )
  )
  if (answerStart < 0) throw new Error(`Answer key not found for test ${padded}`)
  const answerBlock = text.slice(answerStart)
  const answers = new Map()

  for (const sectionNumber of [1, 2, 3]) {
    const sectionMatch = answerBlock.match(
      new RegExp(`Section\\s+${sectionNumber}\\s*([\\s\\S]*?)(?=Section\\s+[123]|Share This|$)`, 'i')
    )
    if (!sectionMatch) continue
    const lines = sectionMatch[1]
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
    for (const line of lines) {
      const match = line.match(/^(\d+)\s*(?:\u00a0|\s)+(.+)$/)
      if (!match) continue
      answers.set(Number(match[1]), match[2].trim())
    }
  }
  return answers
}

const acceptedAnswersFromRaw = (rawAnswer) =>
  String(rawAnswer || '')
    .split(/\s*\/\s*/)
    .map((part) => part.trim())
    .filter(Boolean)

const canonicalAnswer = (rawAnswer) => {
  const first = acceptedAnswersFromRaw(rawAnswer)[0] || rawAnswer
  const normalized = String(first || '')
    .trim()
    .replace(/\.$/, '')
  if (/^(true|false|not given|yes|no)$/i.test(normalized)) return normalized.toUpperCase()
  if (/^(i|ii|iii|iv|v|vi|vii|viii|ix|x)$/i.test(normalized)) return normalized.toLowerCase()
  if (/^[A-G]$/i.test(normalized)) return normalized.toUpperCase()
  if (/^[A-D]$/i.test(normalized)) return normalized.toUpperCase()
  return normalized
}

const buildPassageText = (passages) =>
  passages
    .map((passage, index) => {
      const questionText = passage.questionSectionText
        .replace(/^#{1,4}\s*/gm, '')
        .trim()
      return `READING PASSAGE ${index + 1}\n${passage.title}\n\n${passage.body}\n\n${questionText}`
    })
    .join('\n\n')

const buildAnswerKey = ({ passages, answers, groupLabel, bodyForQuotes }) => {
  const segments = []
  for (const passage of passages) {
    const prompts = extractQuestionPrompts(passage.questionSectionText)
    for (const [number, rawAnswer] of answers.entries()) {
      const inPassage = passage.questionRanges.some(
        (range) => number >= range.start && number <= range.end
      )
      if (!inPassage) continue
      const prompt =
        prompts.get(number) ||
        extractPromptFromSection(passage.questionSectionText, number) ||
        `Question ${number}`
      const correctAnswer = canonicalAnswer(rawAnswer)
      const accepted = acceptedAnswersFromRaw(rawAnswer).map(canonicalAnswer)
      const enrichment = buildComprehensiveEnrichment({
        body: bodyForQuotes,
        prompt,
        answer: correctAnswer,
        hand: {}
      })
      segments.push(
        [
          `Question ${number}: ${prompt}`,
          '',
          `Correct Answer: ${correctAnswer}`,
          '',
          `Accepted Answers: ${accepted.join(' | ')}`,
          '',
          `Answer Group: ${groupLabel}`,
          '',
          `Exact Portion: "${enrichment.exact || ''}"`,
          '',
          `Short Thai Explanation: ${enrichment.thai || ''}`,
          '',
          `Paraphrased Vocabulary: ${enrichment.para || ''}`
        ].join('\n')
      )
    }
  }
  return segments.join('\n\n')
}

const parseQuestionRangesFromSection = (questionSectionText) => {
  const ranges = []
  const matches = [...String(questionSectionText || '').matchAll(/Questions?\s+(\d+)\s*[–-]\s*(\d+)/gi)]
  for (const match of matches) {
    ranges.push({ start: Number(match[1]), end: Number(match[2]) })
  }
  return ranges
}

const attachQuestionRanges = (passages) =>
  passages.map((passage) => ({
    ...passage,
    questionRanges: parseQuestionRangesFromSection(passage.questionSectionText)
  }))

const buildFullTestExam = ({ testNumber, sections, answers }) => {
  const allPassages = []
  for (const sectionNumber of [1, 2, 3]) {
    const blocks = attachQuestionRanges(splitPassageBlocks(sections[sectionNumber]))
    allPassages.push(...blocks)
  }
  const passages = allPassages.map((passage, index) => ({ ...passage, displayNumber: index + 1 }))
  const rawPassageText = buildPassageText(passages)
  const bodyForQuotes = passages.map((passage) => `${passage.title}\n${passage.body}`).join('\n\n')
  const groupLabel = `GT Full Test ${padTestNumber(testNumber)}`
  const passagesWithRanges = attachQuestionRanges(
    passages.map((passage) => ({
      ...passage,
      questionSectionText: passage.questionSectionText
    }))
  )
  const rawAnswerKey = buildAnswerKey({
    passages: passagesWithRanges,
    answers,
    groupLabel,
    bodyForQuotes
  })
  const title = `General Training Full Test ${padTestNumber(testNumber)}`
  const id = `gt-reading-full-test${padTestNumber(testNumber)}`
  const exam = {
    id,
    title,
    category: 'general-training',
    collectionTitle: COLLECTION_TITLE,
    gtTestNumber: testNumber,
    gtKind: 'full',
    rawPassageText,
    rawAnswerKey
  }
  exam.parsedPayload = buildReadingExamPayload(exam)
  return exam
}

const main = async () => {
  const fullExams = []

  for (const testNumber of TEST_NUMBERS) {
    console.log(`Fetching test ${padTestNumber(testNumber)}...`)
    const raw = await fetchTestMarkdown(testNumber)
    const text = normalizeFetchedText(raw)
    const sections = splitSections(text)
    const answers = parseAnswers(raw, testNumber)

    for (const sectionNumber of [1, 2, 3]) {
      if (!sections[sectionNumber]) {
        throw new Error(`Section ${sectionNumber} missing in test ${testNumber}`)
      }
    }

    fullExams.push(buildFullTestExam({ testNumber, sections, answers }))
  }

  const outputPath = path.join(root, 'server/userProvidedReadingPracticeGeneralTraining.mjs')
  const fileBody = `export const USER_PROVIDED_READING_PRACTICE_GENERAL_TRAINING_EXAMS = ${JSON.stringify(fullExams, null, 2)}
`
  fs.writeFileSync(outputPath, fileBody, 'utf8')

  console.log(`Wrote ${fullExams.length} full GT reading exams`)
  console.log(`Section 1–3 practice is derived from full tests in the app`)
  console.log(`Output: ${outputPath}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
