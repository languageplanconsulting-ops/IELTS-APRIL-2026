/**
 * Patch corrupted MCQ prompts in stored parsedPayload using questionSectionText.
 * Run: node scripts/patch-reading-mcq-prompts.mjs [bookNumbers...]
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const defaultBooks = [11, 12, 13, 14, 15, 16, 17, 19]
const books = process.argv.slice(2).map(Number).filter(Boolean)
const targetBooks = books.length ? books : defaultBooks

const extractQuestionBlock = (questionSectionText, questionNumber) => {
  const escapedNumber = String(questionNumber).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = new RegExp(
    `(?:^|\\n)\\s*${escapedNumber}\\s*[.)]?\\s+([\\s\\S]*?)(?=\\n\\s*\\d+\\s*[.)]?\\s+|$)`,
    'i'
  )
  return String(questionSectionText || '').match(pattern)?.[1]?.trim() || ''
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
    const cut = text.search(/\s[A-G]\s+[A-Za-z"'(]/i)
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
    const inlineCut = inline.search(/\s+[A-G][\).:\-]?\s+[A-Za-z"'(]/i)
    if (inlineCut > 20) return inline.slice(0, inlineCut).trim()
  }
  return stripEmbeddedOptions(fallbackPrompt)
}

const hasEmbeddedMcqOptions = (prompt) => {
  const text = String(prompt || '').replace(/\s+/g, ' ').trim()
  if (!text) return false
  if (/\s[A-G]\)\s+/i.test(text)) return true
  if (/\s[A-G]\s+.+\s[B-G]\s+/i.test(text)) return true
  if (/\s[A-G]\s+[A-Za-z"'(]/i.test(text) && text.length > 40) return true
  if (/List of (?:Researchers|Ideas|People|Statements|Companies)/i.test(text)) return true
  return false
}

let totalPatched = 0

for (const book of targetBooks) {
  const exportName = `USER_PROVIDED_READING_PRACTICE_CAMBRIDGE_${book}_EXAMS`
  const mod = await import(`../server/userProvidedReadingPracticeCambridge${book}.mjs`)
  const exams = mod[exportName]
  if (!Array.isArray(exams)) continue

  let patched = 0
  for (const exam of exams) {
    for (const passage of exam.parsedPayload?.passages || []) {
      const sectionText = passage.questionSectionText || ''
      for (const question of passage.questions || []) {
        if (question.answerType !== 'multiple-choice') continue
        if (!hasEmbeddedMcqOptions(question.prompt)) continue
        const nextPrompt = buildMcqStem(sectionText, question.number, question.prompt)
        if (nextPrompt && nextPrompt !== question.prompt) {
          question.prompt = nextPrompt
          patched += 1
        }
      }
    }
  }

  if (patched > 0) {
    const outputPath = path.join(root, 'server', `userProvidedReadingPracticeCambridge${book}.mjs`)
    fs.writeFileSync(outputPath, `export const ${exportName} = ${JSON.stringify(exams, null, 2)}\n`, 'utf8')
    console.log(`Cambridge ${book}: patched ${patched} corrupted MCQ prompt(s)`)
    totalPatched += patched
  } else {
    console.log(`Cambridge ${book}: no corrupted MCQ prompts to patch`)
  }
}

console.log(`Done. Total patched: ${totalPatched}`)
