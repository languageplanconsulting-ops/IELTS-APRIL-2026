/**
 * Fails the build if any live Writing Task 1 multiple-choice option contains a
 * word that is not real English.
 *
 * Same rule as Task 2, different shape. Task 1 tests word choice and grammar, so
 * a distractor the learner can reject on sight — "largment", "inperson" — tests
 * nothing except whether they can spot a typo, and reads as a mistake in the
 * course rather than a deliberate foil.
 *
 * Two differences from verify-task2-spelling:
 *
 * 1. Task 1 options are hand-authored, never generated at runtime, so there is
 *    no lexicon to ship into `src/` — the dictionary is consulted at build time
 *    and nothing about it needs to exist in the bundle.
 *
 * 2. Task 1 options are often phrases ("Starting with Germany", "type and
 *    colours"), and Task 2's gate deliberately skips anything non-alphabetic.
 *    Here every token inside an option is checked separately, which is the whole
 *    point: "inperson" hid inside an option list precisely because it was one
 *    token of a phrase-shaped blank.
 *
 * Proper nouns are allowed only when they are attested in that exercise's own
 * prose — the same idea as Task 2's WGB2_ATTESTED_WORDS. "Vietnam" is fine in
 * the Vietnam exercise because the model essay says it; a capitalised word that
 * appears nowhere in the essay is far more likely to be a typo.
 */
import { loadDictionary, isRealWord } from './task2-real-word-gate.mjs'
import { WRITING_GUIDED_BUILDERS } from '../src/writingGuidedBuilder.ts'
import { EXTRA_MAP_GUIDED_BUILDERS } from '../src/writingTask1MapExercises.ts'
import { EXTRA_TASK1_GUIDED_BUILDERS } from '../src/writingTask1ExtraBuilders.ts'

/**
 * British spellings web2 omits (it lists only the American form). The shared
 * gate already handles -ise/-ize; these are the ones that differ by more.
 */
const BRITISH = new Set([
  'colour', 'colours', 'coloured', 'colouring',
  'litre', 'litres', 'metre', 'metres', 'centre', 'centres', 'centred',
  'programme', 'programmes', 'labour', 'labours', 'favour', 'favours',
  'behaviour', 'behaviours', 'neighbour', 'neighbours', 'harbour', 'harbours',
  'travelled', 'travelling', 'labelled', 'labelling', 'modelled', 'modelling',
  'cancelled', 'cancelling', 'fuelled', 'practise', 'practises', 'practised'
])

const dict = loadDictionary()
if (!dict) {
  // No system word list on this machine — typically a CI or deploy image. The
  // check still runs wherever the content is actually authored, which is what
  // protects the rule; failing the deploy here protects nothing.
  console.log('Task 1 spelling check skipped: no system dictionary at /usr/share/dict/words.')
  process.exit(0)
}
const allExercises = [...WRITING_GUIDED_BUILDERS, ...EXTRA_MAP_GUIDED_BUILDERS, ...EXTRA_TASK1_GUIDED_BUILDERS]

const failures = []
let checked = 0

/** The value a segment contributes, whatever kind of blank it is. */
const segmentText = (segment) => {
  if (segment.kind === 'text') return segment.text
  const blank = segment.blank
  return blank.kind === 'select' ? blank.answer : (blank.answers?.[0] ?? '')
}

const tokensOf = (value) =>
  String(value ?? '')
    .split(/[\s/]+/)
    .flatMap((chunk) => chunk.split('-'))
    .map((token) => token.replace(/^[^A-Za-z’']+|[^A-Za-z’']+$/g, '').replace(/[’']s$/, ''))
    .filter(Boolean)

for (const exercise of allExercises) {
  // Capitalised words the exercise's own prose uses — its legitimate proper nouns.
  const attestedProper = new Set()
  for (const step of exercise.steps) {
    for (const segment of step.segments) {
      for (const token of tokensOf(segmentText(segment))) {
        if (/^[A-Z]/.test(token)) attestedProper.add(token.toLowerCase())
      }
    }
  }

  for (const step of exercise.steps) {
    for (const segment of step.segments) {
      if (segment.kind !== 'blank') continue
      const blank = segment.blank
      if (blank.kind !== 'select') continue

      if (blank.options.length < 2) {
        failures.push(`${exercise.id} ${blank.id}: only ${blank.options.length} option(s)`)
      }
      if (!blank.options.includes(blank.answer)) {
        failures.push(`${exercise.id} ${blank.id}: answer "${blank.answer}" is not among its options`)
      }

      for (const option of blank.options) {
        for (const token of tokensOf(option)) {
          checked += 1
          const lower = token.toLowerCase()
          if (BRITISH.has(lower)) continue
          // A capitalised token is a proper noun if the essay itself uses it.
          if (/^[A-Z]/.test(token) && attestedProper.has(lower)) continue
          if (isRealWord(lower, dict)) continue
          failures.push(`${exercise.id} ${blank.id}: option "${option}" contains non-word "${token}"`)
        }
      }
    }
  }
}

if (failures.length) {
  console.error(`verify:task1-spelling — ${failures.length} problem(s):`)
  for (const failure of failures.slice(0, 40)) console.error(`  ${failure}`)
  if (failures.length > 40) console.error(`  … and ${failures.length - 40} more`)
  process.exit(1)
}
console.log(
  `verify:task1-spelling — ${checked} option words checked across ${allExercises.length} exercises, all real words`
)
