/**
 * Patch all known reading exam data issues:
 * - stub questionSectionText (Cambridge 12)
 * - empty prompts (headings, summary gaps)
 * - corrupted / truncated MCQ prompts
 *
 * Run: node scripts/patch-all-reading-exam-issues.mjs [bookNumbers...]
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { READING_QUESTION_SECTION_OVERRIDES } from './reading-question-section-overrides.mjs'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const defaultBooks = [11, 12, 13, 14, 15, 16, 17, 19]
const books = process.argv.slice(2).map(Number).filter(Boolean)
const targetBooks = books.length ? books : defaultBooks

const ROMAN = /^(?:i|ii|iii|iv|v|vi|vii|viii|ix|x)$/i
const LETTER = /^[A-J]$/

const extractQuestionBlock = (questionSectionText, questionNumber) => {
  const escapedNumber = String(questionNumber).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = new RegExp(
    `(?:^|\\n)\\s*${escapedNumber}\\s*[.)]?\\s+([\\s\\S]*?)(?=\\n\\s*\\d+\\s*[.)]?\\s+|$)`,
    'i'
  )
  return String(questionSectionText || '').match(pattern)?.[1]?.trim() || ''
}

const extractSummaryGapStatement = (block, questionNumber) => {
  const escapedNumber = String(questionNumber).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const source = String(block || '')
  const patterns = [
    new RegExp(`(.{0,100}\\b${escapedNumber}\\s*(?:[.．…⋯]+|_{2,}).{0,100})`, 'i'),
    new RegExp(`(.{0,100}\\b${escapedNumber}\\s+[A-Za-z]{1,10}\\s*[.．…⋯]??.{0,80})`, 'i'),
    new RegExp(`(.{0,100}\\b(?:a|an|the|to|for|of|in|with)\\s+${escapedNumber}\\s+\\S.{0,80})`, 'i')
  ]
  for (const pattern of patterns) {
    const gapMatch = source.match(pattern)
    if (gapMatch?.[1]) return gapMatch[1].replace(/\s+/g, ' ').trim()
  }
  return ''
}

const stripEmbeddedOptions = (prompt) => {
  let text = String(prompt || '').replace(/\s+/g, ' ').trim()
  if (!text) return text
  text = text.replace(
    /(?:\.\s*|\s+)List of (?:Headings|Ideas|Researchers|People|Statements|Companies|Dates|Words|Phrases|Endings)\b[\s\S]*$/i,
    ''
  )
  if (/\s[A-G]\)\s+/i.test(text)) {
    const cut = text.search(/\s[A-G]\)\s+/i)
    if (cut > 20) text = text.slice(0, cut).trim()
  }
  if (/\s[A-G]\s+.+\s[B-G]\s+/i.test(text)) {
    const cut = text.search(/\s[A-G]\s+/i)
    if (cut > 20) text = text.slice(0, cut).trim()
  } else {
    const cut = text.search(/\s[A-G]\s+[A-Z"'(]/i)
    if (cut > 20 && text.length - cut < 120) text = text.slice(0, cut).trim()
  }
  return text
}

const buildMcqStem = (questionSectionText, questionNumber, fallbackPrompt) => {
  const block = extractQuestionBlock(questionSectionText, questionNumber)
  if (block) {
    const lines = block.split('\n').map((line) => line.trim()).filter(Boolean)
    const stemLines = []
    for (const line of lines) {
      if (/^[A-G][\).:\-]?\s+/i.test(line)) break
      stemLines.push(line)
    }
    if (stemLines.length) {
      return stemLines.join(' ').replace(/^\d+\.\s*/, '').trim()
    }
    const inline = block.replace(/^\d+\.\s*/, '').trim()
    const inlineCut = inline.search(/\s+[A-G][\).:\-]?\s+[A-Z"'(]/i)
    if (inlineCut > 20) return inline.slice(0, inlineCut).trim()
  }
  return stripEmbeddedOptions(fallbackPrompt)
}

const hasEmbeddedMcqOptions = (prompt) => {
  const text = String(prompt || '').replace(/\s+/g, ' ').trim()
  if (!text) return false
  if (/\s[A-G]\)\s+/i.test(text)) return true
  if (/\s[A-G]\s+.+\s[B-G]\s+/i.test(text)) return true
  if (/\s[A-G]\s+[A-Z"'(]/.test(text) && text.length > 40) return true
  if (/List of (?:Researchers|Ideas|People|Statements|Companies)/i.test(text)) return true
  return false
}

const isStubSection = (text) => {
  const value = String(text || '')
  return (
    value.length < 400 ||
    /Questions \d+-\d+\s*\n\nQuestions \d+-\d+\s*\nChoose A-D/i.test(value) ||
    /Complete the summary\. NO MORE THAN TWO WORDS\.\s*\n\nQuestions/i.test(value)
  )
}

const buildHeadingPrompt = (question, headingQuestions) => {
  const index = headingQuestions.findIndex((item) => item.number === question.number)
  if (index >= 0) return `Paragraph ${String.fromCharCode(65 + index)}`
  return 'Choose the correct heading for this section.'
}

const resolvePrompt = (exam, passage, question, sectionText) => {
  const current = String(question.prompt || '').replace(/\s+/g, ' ').trim()

  if (!current) {
    const answer = String(question.correctAnswer || '').trim()
    if (ROMAN.test(answer) && /list of headings/i.test(sectionText)) {
      const headingQuestions = (passage.questions || []).filter((item) =>
        ROMAN.test(String(item.correctAnswer || ''))
      )
      return buildHeadingPrompt(question, headingQuestions)
    }
    const range = passage.questionRanges?.find(
      (item) => question.number >= item.start && question.number <= item.end
    )
    const rangeStart = range?.start ?? question.number
    const rangeEnd = range?.end ?? question.number
    const rangeBlock = sectionText.slice(
      Math.max(0, sectionText.search(new RegExp(`Questions\\s+${rangeStart}`, 'i'))),
      sectionText.search(new RegExp(`Questions\\s+${rangeEnd + 1}\\b`, 'i')) > -1
        ? sectionText.search(new RegExp(`Questions\\s+${rangeEnd + 1}\\b`, 'i'))
        : sectionText.length
    )
    const gap = extractSummaryGapStatement(rangeBlock || sectionText, question.number)
    if (gap) return gap
    const block = extractQuestionBlock(sectionText, question.number)
    if (block && !/^drop (?:heading|answer) here/i.test(block)) {
      return block.replace(/^\d+\.\s*/, '').trim()
    }
  }

  if (question.answerType === 'multiple-choice') {
    if (hasEmbeddedMcqOptions(current) || current.length < 12) {
      const stem = buildMcqStem(sectionText, question.number, current)
      if (stem && stem.length > current.length - 5) return stem
    }
    if (/^view of the montreal study/i.test(current)) {
      return buildMcqStem(sectionText, question.number, current) || current
    }
  }

  if (hasEmbeddedMcqOptions(current)) {
    return stripEmbeddedOptions(current) || current
  }

  return current
}

let stats = {
  sectionOverrides: 0,
  promptsPatched: 0,
  examsTouched: 0
}

for (const book of targetBooks) {
  const exportName = `USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_${book}_EXAMS`
  const mod = await import(`../server/userProvidedReadingPracticeCambridge${book}.mjs`)
  const exams = mod[exportName]
  if (!Array.isArray(exams)) continue

  let bookChanged = false

  for (const exam of exams) {
    let examChanged = false

    for (const passage of exam.parsedPayload?.passages || []) {
      const override = READING_QUESTION_SECTION_OVERRIDES[exam.id]
      if (override && isStubSection(passage.questionSectionText)) {
        passage.questionSectionText = override
        examChanged = true
        stats.sectionOverrides += 1
      }

      const sectionText = passage.questionSectionText || ''

      for (const question of passage.questions || []) {
        const nextPrompt = resolvePrompt(exam, passage, question, sectionText)
        if (nextPrompt && nextPrompt !== question.prompt) {
          question.prompt = nextPrompt
          examChanged = true
          stats.promptsPatched += 1
        }
      }
    }

    if (examChanged) {
      exam.updatedAt = new Date().toISOString()
      bookChanged = true
      stats.examsTouched += 1
    }
  }

  if (bookChanged) {
    const outputPath = path.join(root, 'server', `userProvidedReadingPracticeCambridge${book}.mjs`)
    fs.writeFileSync(outputPath, `export const ${exportName} = ${JSON.stringify(exams, null, 2)}\n`, 'utf8')
    console.log(`Cambridge ${book}: patched (${stats.promptsPatched} prompts so far)`)
  }
}

console.log('Done:', stats)
