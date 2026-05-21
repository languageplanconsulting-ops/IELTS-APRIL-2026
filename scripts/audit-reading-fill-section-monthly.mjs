/**
 * Audit monthly reading uploads for truncated fill-in-the-blank sections
 * (section text has fewer blanks than questions in the fill group).
 *
 * Run: npx tsx scripts/audit-reading-fill-section-monthly.mjs
 * Fix: npx tsx scripts/audit-reading-fill-section-monthly.mjs --fix
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  buildReadingFillQuestionGroups,
  isReadingFillQuestion,
  parseFillContextFromPrompt,
  parseReadingFillLineSegments
} from '../src/readingFillDisplay.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const importsDir = path.join(root, 'cambridge-reading-imports')
const shouldFix = process.argv.includes('--fix')
const MONTHLY_FILE = /^ielts-academic-reading-/i

const QUESTION_SECTION_HEADER_REGEX =
  /(?:^|\n)\s*Questions?\s+(\d+)(?:\s*[–-]\s*(\d+)|\s+and\s+(\d+))?/gi
const READING_PASSAGE_REGEX = /(?:^|\n)\s*READING PASSAGE\s+(\d+)\s*$/gim
const QUESTION_SECTION_MARKER_REGEX = /(?:^|\n)\s*Questions?\s+\d+(?:\s*[–-]\s*\d+|\s+and\s+\d+)?/i

const stripWrappedQuotes = (value) => String(value || '').replace(/^["']|["']$/g, '').trim()

const parseQuestionRangesFromText = (text) => {
  QUESTION_SECTION_HEADER_REGEX.lastIndex = 0
  return [...String(text || '').matchAll(QUESTION_SECTION_HEADER_REGEX)].map((match) => {
    const start = Number(match[1])
    const end = Number(match[2] || match[3] || match[1])
    return { start: Math.min(start, end), end: Math.max(start, end) }
  })
}

const parseReadingPassages = (rawPassageText) => {
  const source = stripWrappedQuotes(rawPassageText)
  const passages = []
  const matches = [...source.matchAll(READING_PASSAGE_REGEX)]
  for (let index = 0; index < matches.length; index += 1) {
    const current = matches[index]
    const next = matches[index + 1]
    const block = source
      .slice(current.index, next ? next.index : source.length)
      .replace(/^\s*READING PASSAGE\s+\d+\s*/i, '')
      .trim()
    const questionMarker = block.search(QUESTION_SECTION_MARKER_REGEX)
    const questionSectionText = questionMarker >= 0 ? block.slice(questionMarker).trim() : ''
    passages.push({
      number: Number(current[1]),
      questionSectionText,
      questionRanges: parseQuestionRangesFromText(questionSectionText)
    })
  }
  if (!passages.length && source.trim()) {
    const questionMarker = source.search(QUESTION_SECTION_MARKER_REGEX)
    passages.push({
      number: 1,
      questionSectionText: questionMarker >= 0 ? source.slice(questionMarker).trim() : '',
      questionRanges: parseQuestionRangesFromText(questionMarker >= 0 ? source.slice(questionMarker).trim() : '')
    })
  }
  return passages
}

const parseReadingAnswerKey = (rawAnswerKey) => {
  const source = stripWrappedQuotes(rawAnswerKey)
  const segments = [...source.matchAll(/(?:^|\n)(Question\s+\d+:\s*[\s\S]*?)(?=\nQuestion\s+\d+:|$)/gi)].map(
    (match) => String(match[1] || '').trim()
  )
  return segments.map((segment) => {
    const numberMatch = segment.match(/^Question\s+(\d+):/im)
    const promptMatch = segment.match(
      /^Question\s+\d+:\s*([\s\S]*?)(?=\n\s*(?:Correct Answer|Accepted Answers|Answer Group|Exact Portion|Short Thai Explanation|Paraphrased Vocabulary):|$)/im
    )
    const correctAnswerMatch = segment.match(/Correct Answer:\s*(.+)/i)
    return {
      number: Number(numberMatch?.[1] || 0),
      prompt: String(promptMatch?.[1] || '').trim(),
      correctAnswer: String(correctAnswerMatch?.[1] || '').trim(),
      answerType: 'text'
    }
  })
}

const buildReadingExamPayload = (exam) => {
  const passages = parseReadingPassages(exam.rawPassageText)
  const questions = parseReadingAnswerKey(exam.rawAnswerKey)
  return {
    passages: passages.map((passage) => ({
      ...passage,
      questions: questions.filter((question) =>
        passage.questionRanges.some((range) => question.number >= range.start && question.number <= range.end)
      )
    }))
  }
}

const extractReadingQuestionSectionBlock = (questionSectionText, start, end) => {
  const source = String(questionSectionText || '')
  QUESTION_SECTION_HEADER_REGEX.lastIndex = 0
  const matches = [...source.matchAll(QUESTION_SECTION_HEADER_REGEX)]
  const matchIndex = matches.findIndex((match) => {
    const rangeStart = Number(match[1])
    const rangeEnd = Number(match[2] || match[3] || match[1])
    return start >= Math.min(rangeStart, rangeEnd) && end <= Math.max(rangeStart, rangeEnd)
  })
  if (matchIndex < 0) return ''
  const current = matches[matchIndex]
  const next = matches[matchIndex + 1]
  return source.slice(current.index ?? 0, next?.index ?? source.length).trim()
}

const isReadingFillBoilerplateLine = (line) =>
  /^Questions \d+/i.test(line) ||
  /^Complete the (?:notes|sentences|summary|table)/i.test(line) ||
  /^Choose (?:ONE WORD|NO MORE THAN)/i.test(line) ||
  /^Write your answers in boxes/i.test(line) ||
  /^Write the correct/i.test(line) ||
  /^Reading Passage \d+/i.test(line) ||
  /^In boxes \d+/i.test(line) ||
  /^[A-J]\s+/.test(line)

const countBlanksInSectionBlock = (block, questionNumbers) => {
  const found = new Set()
  for (const line of String(block || '')
    .split('\n')
    .map((value) => value.trim())
    .filter(Boolean)
    .filter((value) => !isReadingFillBoilerplateLine(value))) {
    for (const segment of parseReadingFillLineSegments(line, questionNumbers)) {
      if (segment.kind === 'blank') found.add(segment.questionNumber)
    }
  }
  return found
}

const summaryLineFromPrompt = (prompt, questionNumber) => {
  let text = String(prompt || '')
    .replace(/\s+/g, ' ')
    .trim()
  text = text.replace(/[.．…⋯·•_\-–—]+\s*$/g, '').trim()
  text = text.replace(new RegExp(`\\b${questionNumber}\\s*[.．…⋯·•_\\-–—]+$`), '').trim()
  if (!text) return `${questionNumber} ${'.'.repeat(20)}`
  return `${text} ${questionNumber}${'.'.repeat(20)}`
}

const blankHasReadableContext = (group, question) => {
  for (const line of group.displayLines) {
    let seenTextBefore = false
    for (const segment of line.segments) {
      if (segment.kind === 'text') seenTextBefore = true
      if (segment.kind !== 'blank' || segment.questionNumber !== question.number) continue
      if (segment.before || segment.after || seenTextBefore) return true
    }
  }
  const promptCtx = parseFillContextFromPrompt(question.prompt, question.number)
  return Boolean(promptCtx?.before || promptCtx?.after)
}

const isMatchingQuestion = () => false

const loadMonthlyExams = () => {
  const exams = []
  for (const file of fs.readdirSync(importsDir).sort()) {
    if (!MONTHLY_FILE.test(file) || !file.endsWith('.json')) continue
    const rows = JSON.parse(fs.readFileSync(path.join(importsDir, file), 'utf8'))
    if (!Array.isArray(rows)) continue
    for (const exam of rows) {
      exams.push({
        file,
        id: exam.id || file.replace(/\.json$/i, ''),
        title: exam.title || file,
        ...exam
      })
    }
  }
  return exams
}

const appendMissingSummaryLines = (rawPassageText, block, missingQuestions) => {
  const blockStart = rawPassageText.indexOf(block)
  if (blockStart < 0) {
    const lines = missingQuestions.map(({ number, prompt }) => summaryLineFromPrompt(prompt, number))
    return `${rawPassageText.trim()}\n\n${lines.join('\n\n')}\n`
  }

  const blockEnd = blockStart + block.length
  const lines = missingQuestions.map(({ number, prompt }) => summaryLineFromPrompt(prompt, number))
  const prefix = rawPassageText.slice(0, blockEnd).replace(/\s+$/, '')
  const suffix = rawPassageText.slice(blockEnd)
  return `${prefix}\n\n${lines.join('\n\n')}${suffix ? `\n${suffix.replace(/^\s+/, '')}` : '\n'}`
}

const truncatedGroups = []
const uiIssues = []
let fillQuestionCount = 0

for (const exam of loadMonthlyExams()) {
  let payload
  try {
    payload = buildReadingExamPayload(exam)
  } catch (error) {
    truncatedGroups.push({
      file: exam.file,
      title: exam.title,
      error: String(error?.message || error)
    })
    continue
  }

  for (const passage of payload.passages) {
    const questions = passage.questions || []
    const fillQuestions = questions.filter((question) => isReadingFillQuestion(passage, question, isMatchingQuestion))
    fillQuestionCount += fillQuestions.length
    if (!fillQuestions.length) continue

    const groups = buildReadingFillQuestionGroups(passage, questions, isMatchingQuestion)
    for (const group of groups) {
      const questionNumbers = new Set(group.questions.map((question) => question.number))
      const block = extractReadingQuestionSectionBlock(passage.questionSectionText, group.start, group.end)
      const blanksInSection = countBlanksInSectionBlock(block, questionNumbers)
      const missingNumbers = [...questionNumbers].filter((number) => !blanksInSection.has(number)).sort((a, b) => a - b)

      if (missingNumbers.length) {
        truncatedGroups.push({
          file: exam.file,
          title: exam.title,
          passage: passage.number,
          range: `${group.start}-${group.end}`,
          expected: questionNumbers.size,
          foundInSection: blanksInSection.size,
          missing: missingNumbers,
          questions: missingNumbers.map((number) => {
            const question = group.questions.find((item) => item.number === number)
            return { number, prompt: question?.prompt?.slice(0, 100) || '' }
          })
        })
      }

      for (const question of group.questions) {
        if (!blankHasReadableContext(group, question)) {
          uiIssues.push({
            file: exam.file,
            title: exam.title,
            question: question.number,
            prompt: question.prompt?.slice(0, 120) || ''
          })
        }
      }
    }
  }
}

console.log(`Scanned ${loadMonthlyExams().length} monthly exams, ${fillQuestionCount} fill questions\n`)
console.log(`Truncated fill sections: ${truncatedGroups.filter((item) => !item.error).length}`)
console.log(`Parse errors: ${truncatedGroups.filter((item) => item.error).length}`)
console.log(`UI context issues: ${uiIssues.length}\n`)

if (truncatedGroups.length) {
  console.log('## Truncated fill sections\n')
  for (const item of truncatedGroups) {
    if (item.error) {
      console.log(`- ${item.file}: ${item.error}`)
      continue
    }
    console.log(
      `- ${item.file} passage ${item.passage} Q${item.range}: ${item.foundInSection}/${item.expected} blanks in section; missing ${item.missing.join(', ')}`
    )
  }
  console.log('')
}

if (uiIssues.length) {
  console.log('## UI context issues\n')
  uiIssues.slice(0, 15).forEach((item) => {
    console.log(`- ${item.file} Q${item.question}: ${item.prompt}`)
  })
  if (uiIssues.length > 15) console.log(`  ... and ${uiIssues.length - 15} more`)
  console.log('')
}

const auditPath = path.join(root, 'scripts/reading-fill-section-audit-monthly.json')
fs.writeFileSync(auditPath, JSON.stringify({ truncatedGroups, uiIssues, fillQuestionCount }, null, 2))

if (shouldFix) {
  const filesToPatch = new Map()
  for (const item of truncatedGroups) {
    if (item.error || !item.missing?.length) continue
    if (!filesToPatch.has(item.file)) filesToPatch.set(item.file, [])
    filesToPatch.get(item.file).push(item)
  }

  let patchedFiles = 0
  for (const [file, items] of filesToPatch.entries()) {
    const filePath = path.join(importsDir, file)
    const rows = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    for (const exam of rows) {
      const payload = buildReadingExamPayload(exam)
      let rawPassageText = exam.rawPassageText

      for (const item of items.filter((entry) => entry.title === exam.title || rows.length === 1)) {
        const passage = payload.passages.find((entry) => entry.number === item.passage)
        if (!passage) continue
        const block = extractReadingQuestionSectionBlock(passage.questionSectionText, ...item.range.split('-').map(Number))
        const missingQuestions = item.missing.map((number) => {
          const question = passage.questions.find((entry) => entry.number === number)
          return { number, prompt: question?.prompt || '' }
        })
        rawPassageText = appendMissingSummaryLines(rawPassageText, block, missingQuestions)
      }

      exam.rawPassageText = rawPassageText
    }

    fs.writeFileSync(filePath, `${JSON.stringify(rows, null, 2)}\n`)
    patchedFiles += 1
    console.log(`Patched ${file}`)
  }

  console.log(`\nPatched ${patchedFiles} file(s). Re-run audit to verify.`)
}
