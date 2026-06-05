#!/usr/bin/env node
/**
 * Regenerate intensive journey fill-blank overrides (ด่าน 1–17) from built exams.
 * Uses fillBlankSetGenerator for proper summary sentences from exactPortion.
 * Preserves hand-authored diagram sets (ด่าน 5 P2, 15 P1).
 *
 * Run: npx tsx scripts/build-intensive-fill-blank-sets.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildIntensiveJourneyExam, getReadingJourneyStageId } from '../src/readingJourney.ts'
import { buildReadingFillQuestionGroups } from '../src/readingFillDisplay.ts'
import {
  buildThaiGlossary,
  generateFillBlankSet,
  isLetterFillGroup
} from './lib/fillBlankSetGenerator.mjs'
import { isLowQualityFillBlankSet } from '../src/readingFillBlankQuality.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')

const books = [10, 11, 12, 13, 14, 15, 16, 17, 18]
const pool = []
for (const book of books) {
  const mod = await import(`../server/userProvidedReadingPracticeCambridge${book}.mjs`)
  const key = Object.keys(mod).find((name) => name.includes('EXAMS'))
  if (key) pool.push(...mod[key])
}
const thaiGlossary = buildThaiGlossary(pool)
const noop = () => false

/** Hand-authored diagram sets — keep as-is (already clean). */
const { INTENSIVE_JOURNEY_FILL_BLANK_STAGES_1_5 } = await import(
  '../src/intensiveJourneyFillBlankStages1to5.ts'
)
const { INTENSIVE_JOURNEY_FILL_BLANK_STAGES_6_17 } = await import(
  '../src/intensiveJourneyFillBlankStages6to17.ts'
)

const preserveKeys = new Set([
  'journey-normal-stage-5|21|27',
  'journey-normal-stage-15|1|9'
])

const preservedSets = [...INTENSIVE_JOURNEY_FILL_BLANK_STAGES_1_5, ...INTENSIVE_JOURNEY_FILL_BLANK_STAGES_6_17]
  .filter((set) => preserveKeys.has(`${set.examId}|${set.startNumber}|${set.endNumber}`))

const generated = []
const warnings = []

for (let stage = 1; stage <= 17; stage++) {
  const exam = buildIntensiveJourneyExam(stage)
  if (!exam) {
    warnings.push(`Stage ${stage}: no exam`)
    continue
  }
  const examId = getReadingJourneyStageId(stage)

  for (const passage of exam.parsedPayload.passages) {
    const groups = buildReadingFillQuestionGroups(passage, passage.questions || [], noop, examId)

    for (const group of groups) {
      const fillQuestions = group.questions.filter((q) => q.answerType === 'text')
      if (!fillQuestions.length || isLetterFillGroup(fillQuestions)) continue

      const key = `${examId}|${group.start}|${group.end}`
      const preserved = preservedSets.find(
        (s) => s.examId === examId && s.startNumber === group.start && s.endNumber === group.end
      )
      if (preserved) {
        generated.push(preserved)
        continue
      }

      const set = generateFillBlankSet({
        examId,
        passage: { ...passage, number: passage.number },
        fillQuestions,
        groupInstruction: group.instruction,
        thaiGlossary
      })

      if (isLowQualityFillBlankSet(set)) {
        warnings.push(
          `Stage ${stage} P${passage.number} Q${group.start}-${group.end}: low quality — ${set.summaryLines.map((l) => ('text' in l ? l.text : '')).join(' ').slice(0, 80)}`
        )
        continue
      }

      generated.push(set)
    }
  }
}

const serializeSet = (set) => {
  const lines = []
  lines.push('  {')
  lines.push(`    examId: ${JSON.stringify(set.examId)},`)
  lines.push(`    passageNumber: ${set.passageNumber},`)
  lines.push(`    startNumber: ${set.startNumber},`)
  lines.push(`    endNumber: ${set.endNumber},`)
  if (set.diagramImage) lines.push(`    diagramImage: ${JSON.stringify(set.diagramImage)},`)
  if (set.diagramAlt) lines.push(`    diagramAlt: ${JSON.stringify(set.diagramAlt)},`)
  lines.push(`    sourceParagraphs: ${JSON.stringify(set.sourceParagraphs || ['A', 'G'])},`)
  lines.push(`    instructions: ${JSON.stringify(set.instructions, null, 6).replace(/\n/g, '\n    ')},`)
  lines.push(`    summaryTitle: ${JSON.stringify(set.summaryTitle)},`)
  lines.push('    summaryLines: [')
  for (const line of set.summaryLines) {
    if (line.type === 'diagram') {
      lines.push(`      { type: 'diagram' },`)
    } else {
      lines.push(`      { type: ${JSON.stringify(line.type)}, text: ${JSON.stringify(line.text)} },`)
    }
  }
  lines.push('    ],')
  lines.push('    questions: [')
  for (const q of set.questions) {
    const parts = [
      `number: ${q.number}`,
      `answer: ${JSON.stringify(q.answer)}`,
      `passageKeyword: ${JSON.stringify(q.passageKeyword || '')}`,
      `questionKeyword: ${JSON.stringify(q.questionKeyword || '')}`,
      `thaiMeaning: ${JSON.stringify(q.thaiMeaning || q.answer)}`,
      `exactPortion: ${JSON.stringify(q.exactPortion || '')}`
    ]
    if (q.acceptedAnswers?.length) {
      parts.push(`acceptedAnswers: ${JSON.stringify(q.acceptedAnswers)}`)
    }
    lines.push(`      { ${parts.join(', ')} },`)
  }
  lines.push('    ]')
  lines.push('  }')
  return lines.join('\n')
}

const stages1to5 = generated.filter((s) => {
  const m = s.examId.match(/stage-(\d+)/)
  return m && Number(m[1]) <= 5
})
const stages6to17 = generated.filter((s) => {
  const m = s.examId.match(/stage-(\d+)/)
  return m && Number(m[1]) >= 6
})

const header = `import type { NewFillBlankSet } from './readingNewFillBlankQuestions.ts'\n`

fs.writeFileSync(
  path.join(root, 'src/intensiveJourneyFillBlankStages1to5.ts'),
  `${header}export const INTENSIVE_JOURNEY_FILL_BLANK_STAGES_1_5: NewFillBlankSet[] = [\n\n${stages1to5.map(serializeSet).join(',\n')}\n]\n`
)

fs.writeFileSync(
  path.join(root, 'src/intensiveJourneyFillBlankStages6to17.ts'),
  `${header}export const INTENSIVE_JOURNEY_FILL_BLANK_STAGES_6_17: NewFillBlankSet[] = [\n\n${stages6to17.map(serializeSet).join(',\n')}\n]\n`
)

console.log(`Generated ${generated.length} fill-blank sets (${stages1to5.length} stages 1-5, ${stages6to17.length} stages 6-17)`)
console.log(`Preserved ${preservedSets.length} diagram sets`)
if (warnings.length) {
  console.warn(`\n${warnings.length} warnings:`)
  warnings.forEach((w) => console.warn(`  - ${w}`))
}
