import { WGB2_EXERCISES, assembleTask2Essay } from '../src/writingTask2Builder.ts'
import { WGB2_DENSE_OVERRIDES } from '../src/writingTask2Dense/index.ts'
import { WRITING_TASK2_PROMPTS } from '../src/writingTask2Data.ts'

const promptById = new Map()
for (const prompt of WRITING_TASK2_PROMPTS) {
  promptById.set(prompt.id, prompt)
}

const byPrompt = new Map(WGB2_EXERCISES.map((e) => [e.promptId, e]))
for (const dense of WGB2_DENSE_OVERRIDES) {
  byPrompt.set(dense.promptId, dense)
}
const exercises = [...byPrompt.values()]

const norm = (s) => s.replace(/\s+/g, ' ').trim()

let mismatches = 0
let checkedSteps = 0

for (const exercise of exercises) {
  const prompt = promptById.get(exercise.promptId)
  if (!prompt) {
    console.log(`NO PROMPT FOUND for exercise ${exercise.id} (promptId ${exercise.promptId})`)
    continue
  }
  const assembled = assembleTask2Essay(exercise)
  for (const step of assembled) {
    const srcPara = prompt.paragraphs.find((p) => p.role === step.role)
    checkedSteps++
    if (!srcPara) {
      console.log(`[${exercise.id}] step ${step.role}: NO SOURCE PARAGRAPH FOUND`)
      continue
    }
    const a = norm(step.text)
    const b = norm(srcPara.text)
    if (a !== b) {
      mismatches++
      console.log(`\n=== MISMATCH [${exercise.id}] role=${step.role} ===`)
      console.log('BUILT:  ', a)
      console.log('SOURCE: ', b)
    }
  }
}

console.log(`\n\nChecked ${checkedSteps} steps across ${exercises.length} exercises (${WGB2_DENSE_OVERRIDES.length} dense overrides). Mismatches: ${mismatches}`)
