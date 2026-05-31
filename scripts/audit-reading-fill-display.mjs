/**
 * Audit fill-in-the-blank UI: no duplicate group+fallback rendering, all blanks in group view.
 * Run: npx tsx scripts/audit-reading-fill-display.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { buildReadingExamPayload } from '../server/readingImportUtils.mjs'
import {
  buildReadingFillQuestionGroups,
  isReadingFillQuestion,
  isReadingFillStylePrompt,
  parseFillContextFromPrompt
} from '../src/readingFillDisplay.ts'
import { buildReadingQuestionDisplayPlan } from '../src/readingQuestionDisplay.ts'

const noopMatching = () => false

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const loadAllExams = async () => {
  const exams = []
  const seen = new Set()

  const pushExam = (exam, source) => {
    const id = exam?.id || `${source}-${exams.length}`
    if (!exam?.rawPassageText || seen.has(id)) return
    seen.add(id)
    try {
      exams.push({
        ...exam,
        id,
        parsedPayload: buildReadingExamPayload({
          ...exam,
          parsedPayload: exam.parsedPayload || exam.parsed_payload
        })
      })
    } catch (error) {
      exams.push({ ...exam, id, _buildError: error.message })
    }
  }

  const serverDir = path.join(root, 'server')
  const mjsFiles = fs.readdirSync(serverDir).filter(
    (file) => file.startsWith('userProvidedReading') && file.endsWith('.mjs')
  )
  for (const file of mjsFiles) {
    const mod = await import(pathToFileURL(path.join(serverDir, file)).href)
    for (const value of Object.values(mod)) {
      if (!Array.isArray(value)) continue
      for (const exam of value) pushExam(exam, file)
    }
  }

  const importsDir = path.join(root, 'cambridge-reading-imports')
  if (fs.existsSync(importsDir)) {
    for (const file of fs.readdirSync(importsDir)) {
      if (!file.endsWith('.json') || file.includes('template')) continue
      const list = JSON.parse(fs.readFileSync(path.join(importsDir, file), 'utf8'))
      if (!Array.isArray(list)) continue
      for (const exam of list) {
        pushExam(
          {
            id: exam.id || `import-${file.replace(/\.json$/, '')}-${exams.length}`,
            ...exam
          },
          file
        )
      }
    }
  }

  return exams
}

/** Mirrors App.tsx rendering after the duplicate-fix. */
const simulateFillRenderSlotWithPassage = (
  passage,
  question,
  fillGroupQuestionNumbers,
  fillGroupByNumber
) => {
  if (fillGroupQuestionNumbers.has(question.number)) {
    const fillGroup = fillGroupByNumber.get(question.number)
    if (fillGroup?.questions[0]?.number === question.number) return 'fill-group-card'
    return 'fill-group-hidden'
  }
  if (isReadingFillQuestion(passage, question, noopMatching)) return 'fill-fallback-card'
  if (question.answerType === 'text' && isReadingFillStylePrompt(question.prompt, question.number)) {
    return 'fill-fallback-card'
  }
  return 'other'
}

const getBlankNumbersInDisplayLines = (displayLines) => {
  const numbers = new Set()
  for (const line of displayLines) {
    for (const segment of [...line.segments, ...(line.procedureSegments || [])]) {
      if (segment.kind === 'blank') numbers.add(segment.questionNumber)
    }
  }
  return numbers
}

const countFillPromptLines = (displayLines, questions) => {
  const prompts = new Set(
    questions.map((q) => String(q.prompt || '').replace(/\s+/g, ' ').trim().slice(0, 60))
  )
  let duplicatePromptLines = 0
  for (const line of displayLines) {
    const text = line.segments
      .filter((s) => s.kind === 'text' || s.kind === 'blank')
      .map((s) => (s.kind === 'blank' ? s.before : s.text))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 60)
    if (!text) continue
    for (const prompt of prompts) {
      if (prompt && text.startsWith(prompt.slice(0, 40))) {
        duplicatePromptLines += 1
        break
      }
    }
  }
  return duplicatePromptLines
}

const exams = await loadAllExams()
const failures = []
let fillQuestionTotal = 0
let fillGroupQuestionTotal = 0
let fillFallbackOnlyTotal = 0

for (const exam of exams) {
  if (exam._buildError) {
    failures.push({ examId: exam.id, kind: 'build_error', detail: exam._buildError })
    continue
  }

  for (const passage of exam.parsedPayload?.passages || []) {
    const questions = passage.questions || []
    const fillGroups = buildReadingFillQuestionGroups(passage, questions, noopMatching, exam.id)
    const fillGroupByNumber = new Map()
    const fillGroupQuestionNumbers = new Set()
    fillGroups.forEach((group) => {
      group.questions.forEach((question) => {
        fillGroupByNumber.set(question.number, group)
        fillGroupQuestionNumbers.add(question.number)
      })
    })

    const plan = buildReadingQuestionDisplayPlan(passage, questions, exam.id)

    for (const group of fillGroups) {
      const blankNumbers = getBlankNumbersInDisplayLines(group.displayLines)
      for (const question of group.questions) {
        fillGroupQuestionTotal += 1
        if (!blankNumbers.has(question.number)) {
          failures.push({
            examId: exam.id,
            passage: passage.number,
            question: question.number,
            kind: 'fill-group-missing-blank',
            detail: `group ${group.start}-${group.end} has no blank for Q${question.number}`
          })
        }

        const mode = plan.byQuestionNumber.get(question.number)
        if (mode === 'fill-fallback') {
          failures.push({
            examId: exam.id,
            passage: passage.number,
            question: question.number,
            kind: 'fill-group-marked-fallback',
            detail: 'in fill group but display plan says fill-fallback'
          })
        }

        const renderSlot = simulateFillRenderSlotWithPassage(
          passage,
          question,
          fillGroupQuestionNumbers,
          fillGroupByNumber
        )
        if (renderSlot === 'fill-fallback-card') {
          failures.push({
            examId: exam.id,
            passage: passage.number,
            question: question.number,
            kind: 'fill-duplicate-render',
            detail: 'would render fill-group AND fill-fallback'
          })
        }
      }

      const dupLines = countFillPromptLines(group.displayLines, group.questions)
      if (dupLines > group.questions.length + 1) {
        failures.push({
          examId: exam.id,
          passage: passage.number,
          kind: 'fill-group-redundant-lines',
          detail: `group ${group.start}-${group.end}: ${dupLines} prompt-like lines for ${group.questions.length} questions`
        })
      }
    }

    for (const question of questions) {
      const isFill =
        isReadingFillQuestion(passage, question, noopMatching) ||
        (question.answerType === 'text' && isReadingFillStylePrompt(question.prompt, question.number))

      if (!isFill) continue
      fillQuestionTotal += 1

      if (!fillGroupQuestionNumbers.has(question.number)) {
        fillFallbackOnlyTotal += 1
        if (!parseFillContextFromPrompt(question.prompt, question.number)) {
          failures.push({
            examId: exam.id,
            passage: passage.number,
            question: question.number,
            kind: 'fill-fallback-no-context',
            detail: question.prompt.slice(0, 70)
          })
        }
        const renderSlot = simulateFillRenderSlotWithPassage(
          passage,
          question,
          fillGroupQuestionNumbers,
          fillGroupByNumber
        )
        if (renderSlot !== 'fill-fallback-card') {
          failures.push({
            examId: exam.id,
            passage: passage.number,
            question: question.number,
            kind: 'fill-unrendered',
            detail: `fill question renders as ${renderSlot}`
          })
        }
      }
    }
  }
}

const byKind = {}
for (const failure of failures) {
  byKind[failure.kind] = (byKind[failure.kind] || 0) + 1
}

console.log(`Fill display audit: ${exams.length} exams`)
console.log(
  `Fill questions: ${fillQuestionTotal} total, ${fillGroupQuestionTotal} in groups, ${fillFallbackOnlyTotal} fallback-only`
)
console.log(`Issues: ${failures.length}`)
if (Object.keys(byKind).length) console.log('By kind:', byKind)

if (failures.length) {
  for (const failure of failures.slice(0, 40)) {
    console.log(
      `- [${failure.kind}] ${failure.examId}${failure.passage ? ` P${failure.passage}` : ''}${failure.question ? ` Q${failure.question}` : ''}${failure.detail ? ` — ${failure.detail}` : ''}`
    )
  }
  if (failures.length > 40) console.log(`... and ${failures.length - 40} more`)
  process.exit(1)
}

console.log('All fill-in-the-blank questions pass duplicate-display audit.')
