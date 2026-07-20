/**
 * Fails the build if any live Writing Task 2 multiple-choice option is not a
 * real English word. Task 2 tests grammar and word choice, so invented forms
 * like "oftenly" or "unwill" must never reach a learner. If this trips after
 * adding content, run `npm run build:task2-real-words` and re-check.
 */
import { getDenseWritingTask2Builder } from '../src/writingTask2Dense/index.ts'
import { WRITING_TASK2_PROMPTS } from '../src/writingTask2Data.ts'
import { isRealTask2Word } from '../src/writingTask2RealWords.ts'

const failures = []
let checked = 0

for (const prompt of WRITING_TASK2_PROMPTS) {
  const exercise = getDenseWritingTask2Builder(prompt.id)
  if (!exercise) continue
  for (const step of exercise.steps) {
    for (const segment of step.segments) {
      if (segment.kind !== 'blank' || segment.blank.kind !== 'select') continue
      const blank = segment.blank
      if (blank.options.length < 2) {
        failures.push(`${prompt.id} ${blank.id}: only ${blank.options.length} option(s)`)
      }
      if (!blank.options.some((opt) => opt === blank.answer)) {
        failures.push(`${prompt.id} ${blank.id}: answer "${blank.answer}" missing from options`)
      }
      for (const option of blank.options) {
        checked += 1
        if (!isRealTask2Word(option)) {
          failures.push(`${prompt.id} ${blank.id}: "${option}" is not a real word`)
        }
      }
    }
  }
}

if (failures.length) {
  console.error(`verify:task2-spelling — ${failures.length} problem(s):`)
  for (const failure of failures.slice(0, 40)) console.error(`  ${failure}`)
  if (failures.length > 40) console.error(`  … and ${failures.length - 40} more`)
  process.exit(1)
}
console.log(`verify:task2-spelling — ${checked} options checked, all real words`)
