/**
 * Scan advanced reading exams for OCR garbage in passages, question sections, and prompts.
 * Run: npx tsx scripts/audit-advanced-reading-ocr.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import {
  isGarbledOcrReadingLine,
  isGarbledOcrReadingText,
  sanitizeReadingPromptForDisplay,
  sanitizeReadingQuestionSectionTextForDisplay,
  cleanReadingPassageParagraphs
} from '../src/readingOcrCleanup.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const loadAdvancedExams = async () => {
  const serverDir = path.join(root, 'server')
  const files = fs
    .readdirSync(serverDir)
    .filter((file) => file.startsWith('userProvidedReading') && file.endsWith('.mjs'))
  const exams = []
  for (const file of files) {
    const mod = await import(pathToFileURL(path.join(serverDir, file)).href)
    for (const value of Object.values(mod)) {
      if (Array.isArray(value)) {
        exams.push(...value.filter((exam) => exam?.category === 'advanced' && exam?.parsedPayload?.passages))
      }
    }
  }
  return exams
}

const scanLines = (text, examId, field) => {
  const issues = []
  for (const line of String(text || '').split('\n')) {
    if (isGarbledOcrReadingLine(line)) {
      issues.push({ examId, field, kind: 'garbled_line', sample: line.trim().slice(0, 120) })
    }
  }
  if (isGarbledOcrReadingText(text) && !issues.length) {
    issues.push({ examId, field, kind: 'garbled_text', sample: String(text).trim().slice(0, 120) })
  }
  return issues
}

const exams = await loadAdvancedExams()
const rawIssues = []
const displayIssues = []

for (const exam of exams) {
  for (const passage of exam.parsedPayload?.passages || []) {
    rawIssues.push(...scanLines(passage.questionSectionText, exam.id, 'questionSectionText'))
    displayIssues.push(
      ...scanLines(
        sanitizeReadingQuestionSectionTextForDisplay(passage.questionSectionText || ''),
        exam.id,
        'questionSectionText'
      )
    )

    for (const paragraph of passage.bodyParagraphs || []) {
      if (isGarbledOcrReadingLine(paragraph)) {
        rawIssues.push({
          examId: exam.id,
          field: 'bodyParagraph',
          kind: 'garbled_paragraph',
          sample: String(paragraph).trim().slice(0, 120)
        })
      }
    }
    for (const paragraph of cleanReadingPassageParagraphs(passage.bodyParagraphs || [])) {
      if (isGarbledOcrReadingLine(paragraph)) {
        displayIssues.push({
          examId: exam.id,
          field: 'bodyParagraph',
          kind: 'garbled_paragraph',
          sample: String(paragraph).trim().slice(0, 120)
        })
      }
    }

    for (const question of passage.questions || []) {
      const prompt = String(question.prompt || '')
      const displayPrompt = sanitizeReadingPromptForDisplay(prompt)
      if (isGarbledOcrReadingText(prompt) || /\uFFFD/.test(prompt) || /…\s*…\s*…/.test(prompt)) {
        rawIssues.push({
          examId: exam.id,
          field: 'prompt',
          question: question.number,
          kind: 'garbled_prompt',
          sample: prompt.slice(0, 120)
        })
      }
      if (
        isGarbledOcrReadingText(displayPrompt) ||
        /\uFFFD/.test(displayPrompt) ||
        /…\s*…\s*…/.test(displayPrompt)
      ) {
        displayIssues.push({
          examId: exam.id,
          field: 'prompt',
          question: question.number,
          kind: 'garbled_prompt',
          sample: displayPrompt.slice(0, 120)
        })
      }
      if (/Questions?\s+\d+/i.test(prompt) && prompt.length > 80) {
        rawIssues.push({
          examId: exam.id,
          field: 'prompt',
          question: question.number,
          kind: 'prompt_bleed',
          sample: prompt.slice(0, 120)
        })
      }
    }
  }
}

const issues = rawIssues

const byExam = {}
for (const issue of issues) {
  byExam[issue.examId] = (byExam[issue.examId] || 0) + 1
}

const report = {
  examCount: exams.length,
  issueCount: issues.length,
  displayIssueCount: displayIssues.length,
  byExam,
  issues,
  displayIssues
}

fs.writeFileSync(path.join(root, 'scripts/reading-ocr-advanced-audit.json'), JSON.stringify(report, null, 2))

console.log(`Advanced exams: ${exams.length}`)
console.log(`Raw OCR issues: ${rawIssues.length}`)
console.log(`Display-layer OCR issues: ${displayIssues.length}`)
console.log('Exams affected (raw):', Object.keys(byExam).length)

const byKind = {}
for (const issue of issues) byKind[issue.kind] = (byKind[issue.kind] || 0) + 1
console.log('By kind:', byKind)

if (displayIssues.length) {
  console.log('\nRemaining display-layer issues:')
  for (const issue of displayIssues) {
    console.log(
      `  ${issue.examId}${issue.question ? ` Q${issue.question}` : ''} [${issue.kind}/${issue.field}] ${JSON.stringify(issue.sample?.slice(0, 90))}`
    )
  }
}

if (issues.length) {
  console.log('\nSample issues:')
  for (const issue of issues.slice(0, 40)) {
    console.log(
      `  ${issue.examId}${issue.question ? ` Q${issue.question}` : ''} [${issue.kind}/${issue.field}] ${JSON.stringify(issue.sample?.slice(0, 90))}`
    )
  }
  process.exitCode = 1
}
