/**
 * Audit fill-in-the-blank UI display parsing across all built-in reading exams.
 * Run: npx tsx scripts/audit-reading-fill-ui.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import {
  buildReadingFillQuestionGroups,
  isReadingFillQuestion,
  parseFillContextFromPrompt
} from '../src/readingFillDisplay.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const loadAllExams = async () => {
  const serverDir = path.join(root, 'server')
  const files = fs.readdirSync(serverDir).filter((f) => f.startsWith('userProvidedReading') && f.endsWith('.mjs'))
  const exams = []
  for (const file of files) {
    const mod = await import(pathToFileURL(path.join(serverDir, file)).href)
    for (const value of Object.values(mod)) {
      if (Array.isArray(value)) exams.push(...value.filter((e) => e?.parsedPayload?.passages))
    }
  }
  return exams
}

const isMatchingQuestion = () => false

const blankHasReadableContext = (group, question) => {
  for (const line of group.displayLines) {
    let seenTextBefore = false
    for (const seg of line.segments) {
      if (seg.kind === 'text') seenTextBefore = true
      if (seg.kind !== 'blank' || seg.questionNumber !== question.number) continue
      if (seg.before || seg.after || seenTextBefore) return true
    }
  }
  const promptCtx = parseFillContextFromPrompt(question.prompt, question.number)
  return Boolean(promptCtx?.before || promptCtx?.after)
}

const exams = await loadAllExams()
const noContext = []
const noGroup = []
let fillCount = 0

for (const exam of exams) {
  for (const passage of exam.parsedPayload?.passages || []) {
    const questions = passage.questions || []
    const fillQs = questions.filter((q) => isReadingFillQuestion(passage, q, isMatchingQuestion))
    fillCount += fillQs.length
    if (!fillQs.length) continue

    const groups = buildReadingFillQuestionGroups(passage, questions, isMatchingQuestion)
    const grouped = new Set(groups.flatMap((g) => g.questions.map((q) => q.number)))
    for (const q of fillQs) {
      if (!grouped.has(q.number)) noGroup.push({ examId: exam.id, q: q.number, prompt: q.prompt?.slice(0, 80) })
    }
    for (const group of groups) {
      for (const q of group.questions) {
        if (!blankHasReadableContext(group, q)) {
          noContext.push({ examId: exam.id, q: q.number, prompt: q.prompt?.slice(0, 120) })
        }
      }
    }
  }
}

console.log(`Scanned ${exams.length} exams, ${fillCount} fill questions\n`)
console.log(`No fill group: ${noGroup.length}`)
console.log(`Blank missing readable context: ${noContext.length}`)

if (noContext.length) {
  console.log('\nSamples:')
  noContext.slice(0, 10).forEach((i) => console.log(`  ${i.examId} Q${i.q}: ${i.prompt}`))
}

fs.writeFileSync(
  path.join(root, 'scripts/reading-fill-ui-audit.json'),
  JSON.stringify({ noGroup, noContext, fillCount }, null, 2)
)
