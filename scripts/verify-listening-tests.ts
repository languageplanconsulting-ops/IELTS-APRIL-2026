/**
 * Audits all Cambridge listening builder + foundation + speaking data.
 * Run: npx tsx scripts/verify-listening-tests.ts
 */

import { CAMBRIDGE_10_SECTION_2_EXAM_SET } from '../src/listeningBuilderCambridge10Section2'
import { CAMBRIDGE_10_SECTION_4_EXAM_SET } from '../src/listeningBuilderCambridge10Section4'
import { CAMBRIDGE_11_SECTION_2_EXAM_SET } from '../src/listeningBuilderCambridge11Section2'
import { CAMBRIDGE_11_SECTION_4_EXAM_SET } from '../src/listeningBuilderCambridge11Section4'
import { CAMBRIDGE_12_SECTION_2_EXAM_SET } from '../src/listeningBuilderCambridge12Section2'
import { CAMBRIDGE_12_SECTION_4_EXAM_SET } from '../src/listeningBuilderCambridge12Section4'
import { CAMBRIDGE_13_SECTION_2_EXAM_SET } from '../src/listeningBuilderCambridge13Section2'
import { CAMBRIDGE_13_SECTION_4_EXAM_SET } from '../src/listeningBuilderCambridge13Section4'
import { CAMBRIDGE_14_SECTION_2_EXAM_SET } from '../src/listeningBuilderCambridge14Section2'
import { CAMBRIDGE_14_SECTION_4_EXAM_SET } from '../src/listeningBuilderCambridge14Section4'
import { CAMBRIDGE_16_SECTION_2_EXAM_SET } from '../src/listeningBuilderCambridge16Section2'
import { CAMBRIDGE_17_SECTION_2_EXAM_SET } from '../src/listeningBuilderCambridge17Section2'
import { CAMBRIDGE_17_SECTION_4_EXAM_SET } from '../src/listeningBuilderCambridge17Section4'
import { CAMBRIDGE_17_LISTENING_FOUNDATION_SETS } from '../src/listeningFoundationCambridge17Data'
import { CAMBRIDGE_18_SECTION_2_EXAM_SET } from '../src/listeningBuilderCambridge18Section2'
import type { ListeningBuilderExamSet, ListeningBuilderExamTask } from '../src/listeningBuilderCambridge18Section2'
import { CAMBRIDGE_12_LISTENING_FOUNDATION_SETS } from '../src/listeningFoundationCambridge12Data'
import { CAMBRIDGE_13_LISTENING_FOUNDATION_SETS } from '../src/listeningFoundationCambridge13Data'
import { CAMBRIDGE_SAFE_LISTENING_FOUNDATION_SETS } from '../src/listeningFoundationCambridgeSafeData'
import { LISTENING_FOUNDATION_SETS } from '../src/listeningFoundationData'
import {
  getListeningBuilderTaskAnswerChoices,
  isListeningBuilderGapFillTask,
  normalizeListeningBuilderWord,
  parseListeningBuilderExamQuestion,
  resolveListeningBuilderExamCorrectAnswer
} from '../src/listeningBuilderQuestionParse'
import {
  SPEAKING_CURATED_FULL_EXAM_TOPICS
} from '../src/speakingCambridge1213Data'

const EXAM_SETS: ListeningBuilderExamSet[] = [
  CAMBRIDGE_10_SECTION_2_EXAM_SET,
  CAMBRIDGE_10_SECTION_4_EXAM_SET,
  CAMBRIDGE_11_SECTION_2_EXAM_SET,
  CAMBRIDGE_11_SECTION_4_EXAM_SET,
  CAMBRIDGE_12_SECTION_2_EXAM_SET,
  CAMBRIDGE_12_SECTION_4_EXAM_SET,
  CAMBRIDGE_13_SECTION_2_EXAM_SET,
  CAMBRIDGE_13_SECTION_4_EXAM_SET,
  CAMBRIDGE_14_SECTION_2_EXAM_SET,
  CAMBRIDGE_14_SECTION_4_EXAM_SET,
  CAMBRIDGE_16_SECTION_2_EXAM_SET,
  CAMBRIDGE_17_SECTION_2_EXAM_SET,
  CAMBRIDGE_17_SECTION_4_EXAM_SET,
  CAMBRIDGE_18_SECTION_2_EXAM_SET
]

type Issue = { level: 'error' | 'warn'; code: string; where: string; detail: string }
const issues: Issue[] = []
const push = (level: Issue['level'], code: string, where: string, detail: string) =>
  issues.push({ level, code, where, detail })

const targetInScript = (task: ListeningBuilderExamTask, script: string) => {
  const target = normalizeListeningBuilderWord(task.targetText)
  const scriptNorm = normalizeListeningBuilderWord(script)
  return !target || scriptNorm.includes(target)
}

let examTaskCount = 0
let gapFillCount = 0
let mcqCount = 0

for (const set of EXAM_SETS) {
  const setLabel = `Cam ${set.bookNumber} S${set.sectionNumber}`
  for (const test of set.tests) {
    const testLabel = `${setLabel} Test ${test.testNumber}`
    const script = test.scriptParagraphs.join(' ')
    for (const task of test.tasks) {
      examTaskCount++
      const where = `${testLabel} Q${task.questionNumber} (${task.id})`
      const parsed = parseListeningBuilderExamQuestion(task.questionText)
      const choices = getListeningBuilderTaskAnswerChoices(task, test.tasks, test.id)

      if (isListeningBuilderGapFillTask(task)) gapFillCount++
      else if (choices.type === 'mcq' || choices.type === 'label-match') mcqCount++

      if (!parsed.stem) push('error', 'EMPTY_STEM', where, 'No displayable question stem')
      if (!String(task.targetText || '').trim()) push('error', 'EMPTY_TARGET', where, 'Missing targetText')
      if (!choices.options.length) push('error', 'NO_UI_OPTIONS', where, `No answer choices (type=${choices.type})`)
      if (!choices.correctKey) push('error', 'NO_CORRECT_KEY', where, 'Could not resolve correct answer letter')
      if (choices.correctKey && !choices.options.some((o) => o.key === choices.correctKey)) {
        push('error', 'KEY_NOT_IN_OPTIONS', where, `Correct key ${choices.correctKey} missing from options`)
      }
      if (!targetInScript(task, script)) {
        push('warn', 'TARGET_NOT_IN_SCRIPT', where, `targetText "${task.targetText}" not in script`)
      }
    }
  }
}

const allFoundation = [
  ...LISTENING_FOUNDATION_SETS,
  ...CAMBRIDGE_12_LISTENING_FOUNDATION_SETS,
  ...CAMBRIDGE_13_LISTENING_FOUNDATION_SETS,
  ...CAMBRIDGE_17_LISTENING_FOUNDATION_SETS,
  ...CAMBRIDGE_SAFE_LISTENING_FOUNDATION_SETS
]

for (const set of allFoundation) {
  for (const q of set.questions) {
    const where = `${set.title} Q${q.number}`
    if (!String(q.question || '').trim()) push('error', 'FOUNDATION_NO_Q', where, 'Empty question')
    if (q.options.length < 2) push('error', 'FOUNDATION_OPTIONS', where, `Only ${q.options.length} options`)
    if (!q.options.some((o) => o.key === q.correctAnswer)) {
      push('error', 'FOUNDATION_KEY_MISMATCH', where, `correctAnswer ${q.correctAnswer} not in options`)
    }
  }
}

for (const topic of SPEAKING_CURATED_FULL_EXAM_TOPICS) {
  const p1 = topic.cues.filter((c) => c.startsWith('Part 1 -'))
  const p3 = topic.cues.filter((c) => c.startsWith('Part 3 -'))
  if (!topic.prompt) push('error', 'SPEAKING_NO_P2', topic.id, 'Missing Part 2 prompt')
  if (p1.length < 3) push('warn', 'SPEAKING_P1', topic.id, `Only ${p1.length} Part 1 cues`)
  if (p3.length < 3) push('warn', 'SPEAKING_P3', topic.id, `Only ${p3.length} Part 3 cues`)
}

const errors = issues.filter((i) => i.level === 'error')
const warns = issues.filter((i) => i.level === 'warn')

console.log('\n=== Listening / Speaking audit ===\n')
console.log(`Exam tasks: ${examTaskCount} (${mcqCount} MCQ/label, ${gapFillCount} gap-fill)`)
console.log(`Foundation questions: ${allFoundation.reduce((n, s) => n + s.questions.length, 0)}`)
console.log(`Errors: ${errors.length} | Warnings: ${warns.length}\n`)

if (errors.length) {
  console.log('--- ERRORS (first 40) ---')
  for (const i of errors.slice(0, 40)) console.log(`[${i.code}] ${i.where}\n  ${i.detail}`)
  if (errors.length > 40) console.log(`... and ${errors.length - 40} more`)
}
if (warns.length) {
  console.log('--- WARNINGS (first 15) ---')
  for (const i of warns.slice(0, 15)) console.log(`[${i.code}] ${i.where}\n  ${i.detail}`)
}

process.exit(errors.length ? 1 : 0)
