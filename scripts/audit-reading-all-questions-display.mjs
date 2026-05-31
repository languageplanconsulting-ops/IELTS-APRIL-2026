/**
 * Audit every reading question for UI display issues (MCQ options, stems, grouping).
 * Run: npx tsx scripts/audit-reading-all-questions-display.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { buildReadingExamPayload } from '../server/readingImportUtils.mjs'
import {
  auditReadingQuestionDisplayPlan,
  extractReadingMultipleChoiceOptions,
  getReadingQuestionDisplayPrompt,
  isReadingStandardMcqBlock,
  extractReadingQuestionRangeBlock
} from '../src/readingQuestionDisplay.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const loadAllExams = async () => {
  const serverDir = path.join(root, 'server')
  const files = fs.readdirSync(serverDir).filter((file) => file.startsWith('userProvidedReading') && file.endsWith('.mjs'))
  const exams = []
  for (const file of files) {
    const mod = await import(pathToFileURL(path.join(serverDir, file)).href)
    for (const value of Object.values(mod)) {
      if (!Array.isArray(value)) continue
      for (const exam of value) {
        if (!exam?.id || !exam?.rawPassageText) continue
        try {
          exams.push({
            ...exam,
            parsedPayload: buildReadingExamPayload({
              ...exam,
              parsedPayload: exam.parsedPayload || exam.parsed_payload
            })
          })
        } catch (error) {
          exams.push({ ...exam, _buildError: error.message })
        }
      }
    }
  }
  return exams
}

const exams = await loadAllExams()
const failures = []
const modeCounts = {}

for (const exam of exams) {
  if (exam._buildError) {
    failures.push({ examId: exam.id, kind: 'build_error', detail: exam._buildError })
    continue
  }

  for (const passage of exam.parsedPayload?.passages || []) {
    const questions = passage.questions || []
    const { plan, issues } = auditReadingQuestionDisplayPlan(passage, questions, exam.id)

    for (const question of questions) {
      const mode = plan.byQuestionNumber.get(question.number) || 'unknown'
      modeCounts[mode] = (modeCounts[mode] || 0) + 1

      if (mode === 'mcq-group') {
        const options = extractReadingMultipleChoiceOptions(passage, question)
        const stem = getReadingQuestionDisplayPrompt(passage, question)
        if (options.length > 6) {
          failures.push({
            examId: exam.id,
            passage: passage.number,
            question: question.number,
            kind: 'mcq-too-many-options',
            detail: `${options.length} options: ${options.map((o) => o.letter).join(',')}`
          })
        }
        if (options.length < 2 && options.length > 0) {
          failures.push({
            examId: exam.id,
            passage: passage.number,
            question: question.number,
            kind: 'mcq-few-options',
            detail: stem.slice(0, 80)
          })
        }
        if (!stem || stem.length > 320 || /^Questions?\s+\d+-\d+/i.test(stem)) {
          failures.push({
            examId: exam.id,
            passage: passage.number,
            question: question.number,
            kind: 'mcq-bad-stem',
            detail: (stem || '(empty)').slice(0, 100)
          })
        }
      }
    }

    for (const issue of issues) {
      failures.push({ examId: exam.id, passage: passage.number, ...issue })
    }
  }
}

const byKind = {}
for (const failure of failures) {
  byKind[failure.kind] = (byKind[failure.kind] || 0) + 1
}

const totalQuestions = Object.values(modeCounts).reduce((sum, count) => sum + count, 0)
console.log(`Reading display audit: ${exams.length} exams, ${totalQuestions} questions`)
console.log('Modes:', modeCounts)
console.log(`Issues: ${failures.length}`)
if (Object.keys(byKind).length) console.log('By kind:', byKind)

if (failures.length) {
  for (const failure of failures.slice(0, 60)) {
    console.log(
      `- [${failure.kind}] ${failure.examId}${failure.passage ? ` P${failure.passage}` : ''} Q${failure.question || '?'}${failure.detail ? ` — ${failure.detail}` : ''}`
    )
  }
  if (failures.length > 60) console.log(`... and ${failures.length - 60} more`)
  process.exit(1)
}

console.log('All reading questions pass display audit.')
