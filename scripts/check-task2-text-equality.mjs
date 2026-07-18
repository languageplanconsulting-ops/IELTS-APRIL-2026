import { assembleTask2Essay } from '../src/writingTask2Builder.ts'
import { getDenseWritingTask2Builder } from '../src/writingTask2Dense/index.ts'
import { WRITING_TASK2_PROMPTS } from '../src/writingTask2Data.ts'
import { densifyWritingTask2Exercise } from '../src/writingTask2QuestionDensity.ts'

const failures = []
const exerciseIds = new Set()
const stepIds = new Set()
const blankIds = new Set()
const kindTotals = new Map()
let checkedSteps = 0
let checkedBlanks = 0

const duplicateOptions = (options) => new Set(options).size !== options.length
const exampleLinkers = ['for example', 'for instance', 'to illustrate']

for (const prompt of WRITING_TASK2_PROMPTS) {
  const exercise = getDenseWritingTask2Builder(prompt.id)
  if (!exercise) {
    failures.push(`${prompt.id}: missing resolved exercise`)
    continue
  }
  if (exercise.promptId !== prompt.id) {
    failures.push(`${prompt.id}: resolved exercise points to ${exercise.promptId}`)
  }
  if (exerciseIds.has(exercise.id)) failures.push(`${prompt.id}: duplicate exercise id ${exercise.id}`)
  exerciseIds.add(exercise.id)
  const resolvedAgain = getDenseWritingTask2Builder(prompt.id)
  if (JSON.stringify(resolvedAgain) !== JSON.stringify(exercise)) {
    failures.push(`${prompt.id}: repeated resolution is not structurally stable`)
  }
  if (JSON.stringify(densifyWritingTask2Exercise(exercise)) !== JSON.stringify(exercise)) {
    failures.push(`${prompt.id}: density enrichment is not idempotent`)
  }

  const expectedRoles = prompt.paragraphs.map((paragraph) => paragraph.role)
  const actualRoles = exercise.steps.map((step) => step.role)
  if (JSON.stringify(actualRoles) !== JSON.stringify(expectedRoles)) {
    failures.push(
      `${prompt.id}: role order mismatch (${actualRoles.join(', ')} vs ${expectedRoles.join(', ')})`
    )
  }

  const assembled = assembleTask2Essay(exercise)
  for (let index = 0; index < exercise.steps.length; index += 1) {
    const step = exercise.steps[index]
    const source = prompt.paragraphs[index]
    const finished = assembled[index]
    checkedSteps += 1

    if (stepIds.has(step.id)) failures.push(`${prompt.id} ${step.role}: duplicate step id ${step.id}`)
    stepIds.add(step.id)

    if (!source || !finished) {
      failures.push(`${prompt.id} ${step.role}: missing source or assembled paragraph`)
      continue
    }
    if (finished.role !== source.role || finished.text !== source.text) {
      failures.push(`${prompt.id} ${step.role}: reconstructed text differs from canonical paragraph`)
    }

    const blanks = step.segments.flatMap((segment) =>
      segment.kind === 'blank' ? [segment.blank] : []
    )
    const kinds = new Set(blanks.map((blank) => blank.kind))
    const minimum = step.role === 'intro' ? 10 : step.role.startsWith('body') ? 16 : 5
    if (minimum && blanks.length < minimum) {
      failures.push(`${prompt.id} ${step.role}: ${blanks.length} questions; expected at least ${minimum}`)
    }
    const extras = blanks.filter((blank) => blank.id.includes('-density-extra-'))
    const extraTypes = extras.filter((blank) => blank.kind === 'type').length
    const extraSelects = extras.filter((blank) => blank.kind === 'select').length
    if (extras.length !== 4 || extraTypes !== 2 || extraSelects !== 2) {
      failures.push(
        `${prompt.id} ${step.role}: expected four density extras (2 type + 2 select), found ${extras.length} (${extraTypes} type + ${extraSelects} select)`
      )
    }

    const requiredKinds = step.role === 'intro'
      ? ['type', 'select', 'punct']
      : step.role.startsWith('body')
        ? ['type', 'select', 'drag', 'punct']
        : []
    for (const kind of requiredKinds) {
      if (!kinds.has(kind)) failures.push(`${prompt.id} ${step.role}: missing ${kind} interaction`)
    }

    for (const blank of blanks) {
      checkedBlanks += 1
      kindTotals.set(blank.kind, (kindTotals.get(blank.kind) ?? 0) + 1)
      if (blankIds.has(blank.id)) failures.push(`${prompt.id} ${step.role}: duplicate blank id ${blank.id}`)
      blankIds.add(blank.id)

      if (blank.kind === 'type') {
        if (!blank.answers.length || blank.answers.some((answer) => !answer)) {
          failures.push(`${blank.id}: type blank requires non-empty answers`)
        }
      } else if (blank.kind === 'select' || blank.kind === 'drag') {
        if (!blank.options.includes(blank.answer)) {
          failures.push(`${blank.id}: answer is absent from options`)
        }
        if (duplicateOptions(blank.options)) failures.push(`${blank.id}: duplicate options`)
        if (blank.acceptedAnswers?.some((answer) => !blank.options.includes(answer))) {
          failures.push(`${blank.id}: an accepted answer is absent from options`)
        }
        if (exampleLinkers.includes(blank.answer.toLocaleLowerCase())) {
          const accepted = (blank.acceptedAnswers ?? []).map((answer) => answer.toLocaleLowerCase())
          if (!exampleLinkers.every((answer) => accepted.includes(answer))) {
            failures.push(`${blank.id}: example linkers must accept For example / For instance / To illustrate`)
          }
        }
      } else if (blank.kind === 'punct') {
        if (!blank.options.includes(blank.answer)) {
          failures.push(`${blank.id}: punctuation answer is absent from options`)
        }
        if (duplicateOptions(blank.options)) failures.push(`${blank.id}: duplicate punctuation options`)
      } else if (
        blank.correctGap < 0 ||
        blank.correctGap >= Math.max(0, blank.chunks.length - 1)
      ) {
        failures.push(`${blank.id}: invalid comma gap ${blank.correctGap}`)
      }
    }
  }
}

if (exerciseIds.size !== WRITING_TASK2_PROMPTS.length) {
  failures.push(
    `resolved ${exerciseIds.size} unique exercises for ${WRITING_TASK2_PROMPTS.length} prompts`
  )
}
if (checkedSteps !== 323) failures.push(`expected 323 paragraphs, found ${checkedSteps}`)
if (checkedBlanks !== 4686) failures.push(`expected 4686 questions, found ${checkedBlanks}`)

if (failures.length) {
  console.error(`Task 2 validation failed (${failures.length} issues):`)
  failures.forEach((failure) => console.error(`- ${failure}`))
  process.exit(1)
}

const kindSummary = [...kindTotals.entries()]
  .sort(([left], [right]) => left.localeCompare(right))
  .map(([kind, count]) => `${kind}=${count}`)
  .join(', ')
console.log(
  `Task 2 validation passed: ${exerciseIds.size} exercises, ${checkedSteps} paragraphs, ` +
    `${checkedBlanks} questions (${kindSummary}), exact model-text reconstruction.`
)
