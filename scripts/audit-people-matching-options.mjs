#!/usr/bin/env node
/**
 * Audit all reading exams: people/researcher matching must not show paragraph labels.
 * Run: npx tsx scripts/audit-people-matching-options.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { buildReadingExamPayload } from '../server/readingImportUtils.mjs'
import { buildIntensiveJourneyExam } from '../src/readingJourney.ts'
import {
  auditReadingQuestionDisplayPlan,
  extractReadingQuestionRangeBlock,
  getReadingMatchingQuestionKind
} from '../src/readingQuestionDisplay.ts'
import {
  getReadingPeopleMatchingChoiceOptions,
  hasNamedPeopleMatchingOptions,
  isReadingPeopleMatchingBlock
} from '../src/readingMatchingDisplay.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const loadAllExams = async () => {
  const exams = []
  for (let stage = 1; stage <= 15; stage += 1) {
    const exam = buildIntensiveJourneyExam(stage)
    if (exam) exams.push({ ...exam, id: exam.id || `intensive-stage-${stage}` })
  }

  const serverDir = path.join(root, 'server')
  const files = fs.readdirSync(serverDir).filter((file) => file.startsWith('userProvidedReading') && file.endsWith('.mjs'))
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

const failures = []
const warnings = []
let peopleBlockCount = 0

const exams = await loadAllExams()

for (const exam of exams) {
  if (exam._buildError) {
    failures.push({ examId: exam.id, issue: 'build_error', detail: exam._buildError })
    continue
  }

  for (const passage of exam.parsedPayload?.passages || []) {
    const questions = passage.questions || []
    const { plan, issues } = auditReadingQuestionDisplayPlan(passage, questions, exam.id)

    for (const issue of issues) {
      if (issue.kind === 'people-matching-as-information' || issue.kind === 'people-matching-missing-names') {
        failures.push({
          examId: exam.id,
          passage: passage.number,
          question: issue.question,
          issue: issue.kind,
          detail: issue.detail
        })
      }
    }

    const seenBlocks = new Set()
    for (const question of questions) {
      const range = passage.questionRanges?.find(
        (item) => question.number >= item.start && question.number <= item.end
      ) || { start: question.number, end: question.number }
      const blockKey = `${range.start}-${range.end}`
      if (seenBlocks.has(blockKey)) continue
      seenBlocks.add(blockKey)

      const block = extractReadingQuestionRangeBlock(passage.questionSectionText || '', range.start, range.end)
      if (!isReadingPeopleMatchingBlock(block)) continue
      peopleBlockCount += 1

      const kind = getReadingMatchingQuestionKind(passage, question)
      const options = getReadingPeopleMatchingChoiceOptions(block, passage.bodyParagraphs || [])
      const group = plan.matchingGroups.find(
        (item) => range.start >= item.start && range.end <= item.end
      )

      if (kind === 'information') {
        failures.push({
          examId: exam.id,
          passage: passage.number,
          question: range.start,
          issue: 'classified-as-information',
          detail: `Q${range.start}-${range.end}`
        })
      }

      if (!hasNamedPeopleMatchingOptions(options)) {
        const entry = {
          examId: exam.id,
          passage: passage.number,
          question: range.start,
          issue: 'unnamed-options',
          detail: options.map((option) => `${option.letter}:${option.text}`).join('; ').slice(0, 140)
        }
        if (kind === 'statement') failures.push(entry)
        else warnings.push(entry)
      }

      if (group && group.kind === 'information') {
        failures.push({
          examId: exam.id,
          passage: passage.number,
          question: range.start,
          issue: 'group-kind-information',
          detail: `Q${group.start}-${group.end}`
        })
      }
    }
  }
}

console.log(`Scanned ${exams.length} exams · ${peopleBlockCount} people/researcher matching block(s)`)

if (warnings.length) {
  console.log(`\nWarnings (${warnings.length}):`)
  for (const warning of warnings.slice(0, 20)) {
    console.log(
      `  [${warning.issue}] ${warning.examId} P${warning.passage} Q${warning.question} — ${warning.detail || ''}`
    )
  }
}

if (!failures.length) {
  console.log('\nOK: No people-matching questions misclassified or missing named options.')
  process.exit(warnings.length ? 0 : 0)
}

console.log(`\nFAIL: ${failures.length} issue(s):\n`)
for (const failure of failures) {
  console.log(
    `  [${failure.issue}] ${failure.examId} P${failure.passage} Q${failure.question}${failure.detail ? ` — ${failure.detail}` : ''}`
  )
}
process.exit(1)
