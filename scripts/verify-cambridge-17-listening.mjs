/**
 * Quality checks for Cambridge 17 listening builder data.
 * Run: npx tsx scripts/verify-cambridge-17-listening.mjs
 */
import { CAMBRIDGE_17_SECTION_2_EXAM_SET } from '../src/listeningBuilderCambridge17Section2.ts'
import { CAMBRIDGE_17_SECTION_4_EXAM_SET } from '../src/listeningBuilderCambridge17Section4.ts'
import { normalizeListeningBuilderWord } from '../src/listeningBuilderQuestionParse.ts'
import {
  getListeningBuilderTaskAnswerChoices,
  parseListeningBuilderExamQuestion,
  resolveListeningBuilderExamCorrectAnswer
} from '../src/listeningBuilderQuestionParse.ts'

const BLEED = [
  /Jane Fairbanks/i,
  /Frank Pritchard/i,
  /DIANA:\s*So, Tim/i,
  /surfing holiday/i,
  /Easy Life Cleaning/i,
  /we come to Oniton/i,
  /Romeo and Juliet/i,
  /Hello Dr Green/i,
  /Orion Stadium placement/i,
  /1718867168/,
  /\bQ\d{1,2}\b/
]

const sets = [CAMBRIDGE_17_SECTION_2_EXAM_SET, CAMBRIDGE_17_SECTION_4_EXAM_SET]
const failures = []

for (const set of sets) {
  for (const test of set.tests) {
    const scriptRaw = test.scriptParagraphs.join(' ')
    const script = normalizeListeningBuilderWord(scriptRaw)
    const label = `Cam 17 S${set.sectionNumber} Test ${test.testNumber}`

    for (const re of BLEED) {
      if (re.test(scriptRaw)) {
        failures.push({ level: 'error', where: label, code: 'SCRIPT_BLEED', detail: re.toString() })
      }
    }

    for (const task of test.tasks) {
      const where = `${label} Q${task.questionNumber} (${task.id})`
      const target = normalizeListeningBuilderWord(task.targetText)
      if (target && !script.includes(target)) {
        failures.push({
          level: 'error',
          where,
          code: 'TARGET_NOT_IN_SCRIPT',
          detail: task.targetText
        })
      }
      if (/\bQ\d{1,2}\b/.test(task.targetText)) {
        failures.push({
          level: 'error',
          where,
          code: 'TARGET_HAS_Q_MARKER',
          detail: task.targetText
        })
      }
      const choices = getListeningBuilderTaskAnswerChoices(task, test.tasks, test.id)
      const key = resolveListeningBuilderExamCorrectAnswer(task, test.tasks, test.id)
      if (!key) {
        failures.push({ level: 'error', where, code: 'NO_CORRECT_KEY', detail: '' })
      }
      if (key && !choices.options.some((o) => o.key === key)) {
        failures.push({ level: 'error', where, code: 'KEY_NOT_IN_OPTIONS', detail: key })
      }
      const parsed = parseListeningBuilderExamQuestion(task.questionText)
      if (!parsed.stem && !parsed.isGapFill) {
        failures.push({ level: 'error', where, code: 'EMPTY_STEM', detail: '' })
      }
    }
  }
}

const errors = failures.filter((f) => f.level === 'error')
console.log(`Cambridge 17 listening QA: ${errors.length} error(s)`)
for (const f of errors.slice(0, 25)) {
  console.log(`[${f.code}] ${f.where}\n  ${f.detail}`)
}
if (errors.length) process.exit(1)
console.log('Cambridge 17 listening QA passed.')
