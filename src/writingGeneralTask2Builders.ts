import { GENERAL_TRAINING_TASK2_PROMPTS } from './writingGeneralTask2Data'
import { WGB2_ROLE_LABEL_TH, type Wgb2Exercise, type Wgb2Segment, type Wgb2Step } from './writingTask2Builder'

const QUIZZED_PATTERN_OPENERS = [
  'From this perspective',
  'In terms of the solutions',
  'The first solution is that',
  'The second solution is that',
  'To explain it simply',
  'To put it simply',
  'Another benefit is that',
  'Another advantage is that',
  'Another reason is that',
  'Another problem is that',
  'Another cause is that',
  'The first benefit is that',
  'In this respect',
  'To begin with',
  'In conclusion',
  'My reasoning is that',
  'This is because',
  'Turning to',
  'To illustrate',
  'For instance',
  'For example',
  'Personally',
  'Firstly',
  'However'
].sort((left, right) => right.length - left.length)

const CORE_TRANSITION_OPTIONS = [
  'To begin with',
  'However',
  'For example',
  'For instance',
  'To explain it simply',
  'To put it simply',
  'From this perspective',
  'In this respect',
  'To illustrate',
  'In conclusion'
]

const transitionOptions = (answer: string, seed: number) => {
  const distractors = CORE_TRANSITION_OPTIONS.filter((option) => option !== answer)
  const rotated = [...distractors.slice(seed % distractors.length), ...distractors.slice(0, seed % distractors.length)]
  const options = rotated.slice(0, 3)
  options.splice(seed % 4, 0, answer)
  return options
}

const paragraphSegments = (
  promptId: string,
  stepId: string,
  text: string
): Wgb2Segment[] => {
  const segments: Wgb2Segment[] = []
  let cursor = 0
  let blankIndex = 0

  while (cursor < text.length) {
    const matches = QUIZZED_PATTERN_OPENERS.flatMap((phrase) => {
      const start = text.indexOf(phrase, cursor)
      return start < 0 ? [] : [{ phrase, start }]
    }).sort((left, right) => left.start - right.start || right.phrase.length - left.phrase.length)
    const next = matches[0]
    if (!next) break
    if (next.start > cursor) segments.push({ kind: 'text', text: text.slice(cursor, next.start) })
    blankIndex += 1
    segments.push({
      kind: 'blank',
      blank: {
        kind: 'drag',
        id: `${promptId}-${stepId}-transition-${blankIndex}`,
        options: transitionOptions(next.phrase, blankIndex),
        answer: next.phrase,
        focus: 'transition',
        explain: `“${next.phrase}” เป็นคำเปิดตาม pattern ของย่อหน้านี้`
      }
    })
    cursor = next.start + next.phrase.length
  }

  if (cursor < text.length) segments.push({ kind: 'text', text: text.slice(cursor) })
  if (!segments.length) return [{ kind: 'text', text }]
  return segments
}

const promptSteps = (promptId: string): Wgb2Step[] => {
  const prompt = GENERAL_TRAINING_TASK2_PROMPTS.find((item) => item.id === promptId)
  if (!prompt) return []

  return prompt.paragraphs.map((paragraph, index) => {
    const stepId = `${paragraph.role}-${index + 1}`
    return {
      id: `${prompt.id}-${stepId}`,
      role: paragraph.role,
      labelTh: WGB2_ROLE_LABEL_TH[paragraph.role],
      segments: paragraphSegments(prompt.id, stepId, paragraph.text)
    }
  })
}

export const GENERAL_TRAINING_TASK2_BUILDERS: Wgb2Exercise[] = GENERAL_TRAINING_TASK2_PROMPTS.map((prompt) => ({
  id: `${prompt.id}-builder`,
  promptId: prompt.id,
  steps: promptSteps(prompt.id)
}))
