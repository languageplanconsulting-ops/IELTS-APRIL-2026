/**
 * Audit fill-in-the-blank UI for advanced reading exams only.
 * Run: npx tsx scripts/audit-advanced-reading-fill-ui.mjs
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

const loadAdvancedExams = async () => {
  const serverDir = path.join(root, 'server')
  const files = fs.readdirSync(serverDir).filter((file) => file.startsWith('userProvidedReading') && file.endsWith('.mjs'))
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

const isMatchingQuestion = () => false

const getBlankSegment = (group, questionNumber) => {
  for (const line of group.displayLines) {
    const segments = [...(line.procedureSegments || []), ...line.segments]
    for (let index = 0; index < segments.length; index += 1) {
      const segment = segments[index]
      if (segment.kind !== 'blank' || segment.questionNumber !== questionNumber) continue

      let before = String(segment.before || '').trim()
      let after = String(segment.after || '').trim()

      if (!before) {
        for (let previousIndex = index - 1; previousIndex >= 0; previousIndex -= 1) {
          const previous = segments[previousIndex]
          if (previous.kind === 'blank' && previous.after) {
            before = String(previous.after).trim()
            break
          }
          if (previous.kind === 'text' && previous.text) {
            before = String(previous.text).trim()
            break
          }
        }
      }

      return { before, after }
    }
  }
  return null
}

const getFillLineContextLength = (group, questionNumber) => {
  for (const line of group.displayLines) {
    const segments = [...(line.procedureSegments || []), ...line.segments]
    const hasQuestion = segments.some(
      (segment) => segment.kind === 'blank' && segment.questionNumber === questionNumber
    )
    if (!hasQuestion) continue

    let length = line.procedure ? line.procedure.length : 0
    return segments.reduce((total, segment) => {
      if (segment.kind === 'text' || segment.kind === 'heading' || segment.kind === 'clue') {
        return total + String(segment.text || '').trim().length
      }
      if (segment.kind === 'blank') {
        return total + String(segment.before || '').trim().length + String(segment.after || '').trim().length
      }
      return total
    }, length)
  }
  return 0
}

const exams = await loadAdvancedExams()
const issues = []
let fillCount = 0

for (const exam of exams) {
  for (const passage of exam.parsedPayload?.passages || []) {
    const questions = passage.questions || []
    const fillQuestions = questions.filter((question) =>
      isReadingFillQuestion(passage, question, isMatchingQuestion)
    )
    fillCount += fillQuestions.length
    if (!fillQuestions.length) continue

    const groups = buildReadingFillQuestionGroups(passage, questions, isMatchingQuestion, exam.id)
    const groupByNumber = new Map()
    for (const group of groups) {
      for (const question of group.questions) groupByNumber.set(question.number, group)
    }

    for (const question of fillQuestions) {
      const group = groupByNumber.get(question.number)
      const blank = group ? getBlankSegment(group, question.number) : null
      const promptContext = parseFillContextFromPrompt(question.prompt, question.number)
      const before = String(blank?.before || promptContext?.before || '').trim()
      const after = String(blank?.after || promptContext?.after || '').trim()
      const prompt = String(question.prompt || '').trim()
      const contextLength = before.length + after.length
      const lineContextLength = getFillLineContextLength(group, question.number)

      if (!group) {
        issues.push({
          examId: exam.id,
          question: question.number,
          kind: 'no_group',
          prompt
        })
        continue
      }

      if (contextLength < 8) {
        issues.push({
          examId: exam.id,
          question: question.number,
          kind: 'no_context',
          prompt,
          before,
          after
        })
        continue
      }

      if (
        prompt.length < 28 &&
        contextLength < 24 &&
        lineContextLength < 32 &&
        before.length < 15
      ) {
        issues.push({
          examId: exam.id,
          question: question.number,
          kind: 'truncated',
          prompt,
          before,
          after
        })
      }
    }
  }
}

const report = { examCount: exams.length, fillCount, issueCount: issues.length, issues }
fs.writeFileSync(path.join(root, 'scripts/reading-fill-advanced-audit.json'), JSON.stringify(report, null, 2))

console.log(`Advanced exams: ${exams.length}`)
console.log(`Fill questions: ${fillCount}`)
console.log(`Issues: ${issues.length}`)

const byKind = {}
for (const issue of issues) byKind[issue.kind] = (byKind[issue.kind] || 0) + 1
console.log('By kind:', byKind)

if (issues.length) {
  console.log('\nAll issues:')
  for (const issue of issues) {
    console.log(
      `  ${issue.examId} Q${issue.question} [${issue.kind}] prompt=${JSON.stringify(issue.prompt?.slice(0, 70))}`
    )
    if (issue.before || issue.after) {
      console.log(`    before=${JSON.stringify(issue.before?.slice(0, 80))} after=${JSON.stringify(issue.after?.slice(0, 80))}`)
    }
  }
  process.exitCode = 1
}
