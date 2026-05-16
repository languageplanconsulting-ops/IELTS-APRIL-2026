import type { ListeningBuilderExamTask } from './listeningBuilderCambridge18Section2'
import {
  LISTENING_BUILDER_ANSWER_OVERRIDES,
  LISTENING_BUILDER_LABEL_POOLS
} from './listeningBuilderAnswerOverrides'

export { LISTENING_BUILDER_ANSWER_OVERRIDES, LISTENING_BUILDER_LABEL_POOLS }
export {
  CAMBRIDGE_12_FOUNDATION_ANSWER_OVERRIDES,
  CAMBRIDGE_13_FOUNDATION_ANSWER_OVERRIDES,
  CAMBRIDGE_17_FOUNDATION_ANSWER_OVERRIDES
} from './listeningBuilderAnswerOverrides'

export const normalizeListeningBuilderQuestionText = (value: string) =>
  String(value || '')
    .replace(/\\n/g, '\n')
    .replace(/\r\n/g, '\n')
    .trim()

export const normalizeListeningBuilderWord = (value: string) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

export const parseListeningBuilderExamOptionLine = (line: string) => {
  const trimmed = String(line || '').trim()
  const withParen = trimmed.match(/^([A-Z])\)\s*(.+)$/i)
  if (withParen) return { key: withParen[1].toUpperCase(), text: withParen[2].trim() }
  const withSpace = trimmed.match(/^([A-Z])\s+(.+)$/)
  if (withSpace && withSpace[2].trim()) return { key: withSpace[1].toUpperCase(), text: withSpace[2].trim() }
  return null
}

export const isListeningBuilderOptionLine = (line: string) => Boolean(parseListeningBuilderExamOptionLine(line))

export const parseListeningBuilderExamQuestion = (questionText: string) => {
  const lines = normalizeListeningBuilderQuestionText(questionText)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  const optionLines = lines.filter((line) => isListeningBuilderOptionLine(line))
  const nonOptionLines = lines.filter((line) => !isListeningBuilderOptionLine(line))
  const stem = nonOptionLines[nonOptionLines.length - 1] || nonOptionLines.join(' ')
  const contextLines = nonOptionLines.slice(0, -1)
  const isGapFill =
    optionLines.length === 0 &&
    (stem.includes('____') ||
      /____/.test(questionText) ||
      /complete the notes/i.test(questionText) ||
      /complete the table/i.test(questionText) ||
      /complete the summary/i.test(questionText))

  return { stem, contextLines, optionLines, isGapFill }
}

export const isListeningBuilderGapFillTask = (task: ListeningBuilderExamTask) => {
  const parsed = parseListeningBuilderExamQuestion(task.questionText)
  return parsed.isGapFill && Boolean(String(task.targetText || '').trim())
}

const DEFAULT_MAP_LABEL_POOL = 'ABCDEFGHI'.split('').map((key) => ({
  key,
  text: `Map label ${key}`
}))

const getContextualListeningBuilderPool = (
  testId: string,
  task: ListeningBuilderExamTask
): Array<{ key: string; text: string }> | null => {
  const pools = LISTENING_BUILDER_LABEL_POOLS
  if (testId === 'cam10-sec2-test3' && task.questionNumber >= 16) return pools['cam10-sec2-test3'] ?? null
  if (testId === 'cam11-sec2-test3' && task.questionNumber >= 16) return pools['cam11-sec2-test3'] ?? null
  if (testId === 'cam11-sec2-test4') {
    if (task.questionNumber >= 11 && task.questionNumber <= 16) return pools['cam11-sec2-test4'] ?? null
    if (task.questionNumber >= 17) return DEFAULT_MAP_LABEL_POOL
  }
  if (pools[testId] && isListeningBuilderMapLabelTask(task)) return pools[testId]
  if (pools[testId] && task.questionNumber >= 15 && !task.questionText.includes('?')) {
    return pools[testId]
  }
  return null
}

export const isListeningBuilderMapLabelTask = (task: ListeningBuilderExamTask) =>
  /label the (map|plan)/i.test(normalizeListeningBuilderQuestionText(task.questionText))

const extractLargestInlineOptionPool = (tasks: ListeningBuilderExamTask[]) => {
  let best: Array<{ key: string; text: string }> = []
  for (const task of tasks) {
    const { optionLines } = parseListeningBuilderExamQuestion(task.questionText)
    const options = optionLines
      .map((line) => parseListeningBuilderExamOptionLine(line))
      .filter(Boolean) as Array<{ key: string; text: string }>
    if (options.length > best.length) best = options
  }
  return best
}

export const extractListeningBuilderTestOptionPool = (
  tasks: ListeningBuilderExamTask[],
  testId?: string,
  task?: ListeningBuilderExamTask
) => {
  if (task && isListeningBuilderMapLabelTask(task)) {
    return DEFAULT_MAP_LABEL_POOL
  }

  if (testId && task) {
    const contextual = getContextualListeningBuilderPool(testId, task)
    if (contextual) return contextual
  }

  if (testId && LISTENING_BUILDER_LABEL_POOLS[testId] && !task) {
    return LISTENING_BUILDER_LABEL_POOLS[testId]
  }

  const largestInline = extractLargestInlineOptionPool(tasks)
  if (largestInline.length >= 4) return largestInline

  if (tasks.some((t) => isListeningBuilderMapLabelTask(t))) {
    return DEFAULT_MAP_LABEL_POOL
  }

  const map = new Map<string, string>()
  for (const task of tasks) {
    const { optionLines } = parseListeningBuilderExamQuestion(task.questionText)
    for (const line of optionLines) {
      const option = parseListeningBuilderExamOptionLine(line)
      if (option) map.set(option.key, option.text)
    }
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, text]) => ({ key, text }))
}

export const isListeningBuilderMatchingTableTask = (
  task: ListeningBuilderExamTask,
  tasks: ListeningBuilderExamTask[]
) => {
  const parsed = parseListeningBuilderExamQuestion(task.questionText)
  if (parsed.isGapFill || parsed.optionLines.length > 0 || isListeningBuilderMapLabelTask(task)) {
    return false
  }
  const stem = parsed.stem.trim()
  if (!stem || stem.includes('?') || stem.length > 100) return false
  const peers = tasks.filter((item) => {
    const peer = parseListeningBuilderExamQuestion(item.questionText)
    return (
      !peer.isGapFill &&
      !peer.optionLines.length &&
      !isListeningBuilderMapLabelTask(item) &&
      !peer.stem.includes('?')
    )
  })
  return peers.length >= 3 && peers.some((item) => item.id === task.id)
}

export const isListeningBuilderLabelMatchTask = (
  task: ListeningBuilderExamTask,
  tasks: ListeningBuilderExamTask[],
  testId?: string
) => {
  if (testId && getContextualListeningBuilderPool(testId, task)) return true
  if (isListeningBuilderMapLabelTask(task)) return true
  const parsed = parseListeningBuilderExamQuestion(task.questionText)
  if (parsed.isGapFill || parsed.optionLines.length > 0) return false
  const stem = parsed.stem.trim()
  if (!stem) return false
  if (isListeningBuilderMatchingTableTask(task, tasks)) return true
  if (stem.includes('?')) return false
  if (stem.length > 80) return false
  const pool = extractListeningBuilderTestOptionPool(tasks, testId, task)
  return pool.length >= 3
}

export const buildListeningBuilderGapFillOptions = (
  task: ListeningBuilderExamTask,
  tasks: ListeningBuilderExamTask[]
) => {
  const correct = String(task.targetText || '').trim()
  const normalizeWord = (value: string) => normalizeListeningBuilderWord(value)
  const distractors = tasks
    .filter((item) => item.id !== task.id)
    .map((item) => String(item.targetText || '').trim())
    .filter(Boolean)
    .filter((word, index, arr) => arr.findIndex((entry) => normalizeWord(entry) === normalizeWord(word)) === index)
    .filter((word) => normalizeWord(word) !== normalizeWord(correct))

  const fallbackDistractors = ['power', 'roads', 'islands', 'fishing', 'reproduction', 'strangers', 'erosion', 'habitat']
  while (distractors.length < 3) {
    const next = fallbackDistractors.find(
      (word) => !distractors.some((entry) => normalizeWord(entry) === normalizeWord(word))
    )
    if (!next) break
    distractors.push(next)
  }

  const options = [
    { key: 'A', text: correct },
    { key: 'B', text: distractors[0] || 'habitat' },
    { key: 'C', text: distractors[1] || 'erosion' },
    { key: 'D', text: distractors[2] || 'islands' }
  ]
  const rotation = task.questionNumber % options.length
  const rotated = options.map((_, index) => options[(index + rotation) % options.length])
  const correctKey =
    rotated.find((option) => normalizeWord(option.text) === normalizeWord(correct))?.key || 'A'

  return { options: rotated, correctKey }
}

const scoreOptionAgainstTask = (
  optionText: string,
  task: ListeningBuilderExamTask
) => {
  const phrase = normalizeListeningBuilderWord(task.questionWordPhrase)
  const target = normalizeListeningBuilderWord(task.targetText)
  const option = normalizeListeningBuilderWord(optionText)
  if (!option) return 0

  let score = 0
  if (phrase && (option === phrase || option.includes(phrase) || phrase.includes(option))) score += 8
  if (target) {
    if (option.length >= 4 && (target.includes(option) || option.includes(target.split(' ').slice(0, 3).join(' ')))) {
      score += 10
    }
    const targetWords = target.split(' ').filter((word) => word.length > 3)
    for (const word of targetWords) {
      if (option.includes(word)) score += 2
    }
  }
  return score
}

export const resolveListeningBuilderExamCorrectAnswer = (
  task: ListeningBuilderExamTask,
  tasks: ListeningBuilderExamTask[] = [],
  testId?: string
) => {
  const override = LISTENING_BUILDER_ANSWER_OVERRIDES[task.id]
  if (override) {
    if (/^[A-I]$/i.test(override.trim())) return override.trim().toUpperCase()
    if (isListeningBuilderGapFillTask(task)) {
      const gap = buildListeningBuilderGapFillOptions(task, tasks)
      const wordKey = gap.options.find(
        (option) => normalizeListeningBuilderWord(option.text) === normalizeListeningBuilderWord(override)
      )?.key
      if (wordKey) return wordKey
    }
  }

  const explicit = String(task.correctAnswer || '')
    .trim()
    .toUpperCase()
    .match(/^[A-I]$/)?.[0]
  if (explicit) return explicit

  if (isListeningBuilderGapFillTask(task)) {
    return buildListeningBuilderGapFillOptions(task, tasks).correctKey
  }

  const parsed = parseListeningBuilderExamQuestion(task.questionText)
  const options = parsed.optionLines
    .map((line) => parseListeningBuilderExamOptionLine(line))
    .filter(Boolean) as Array<{ key: string; text: string }>

  if (options.length) {
    let best = { key: '', score: 0 }
    for (const option of options) {
      const score = scoreOptionAgainstTask(option.text, task)
      if (score > best.score) best = { key: option.key, score }
    }
    if (best.score >= 4) return best.key
  }

  const pool = extractListeningBuilderTestOptionPool(tasks, testId, task)
  if (pool.length && isListeningBuilderLabelMatchTask(task, tasks, testId)) {
    const overrideKey = LISTENING_BUILDER_ANSWER_OVERRIDES[task.id]
    if (overrideKey && /^[A-I]$/i.test(overrideKey)) return overrideKey.toUpperCase()
    let best = { key: '', score: 0 }
    for (const option of pool) {
      const score = scoreOptionAgainstTask(option.text, task)
      if (score > best.score) best = { key: option.key, score }
    }
    if (best.key) return best.key
  }

  return ''
}

export const getListeningBuilderTaskAnswerChoices = (
  task: ListeningBuilderExamTask,
  tasks: ListeningBuilderExamTask[],
  testId?: string
) => {
  if (isListeningBuilderGapFillTask(task)) {
    const gap = buildListeningBuilderGapFillOptions(task, tasks)
    return { type: 'gap-fill' as const, options: gap.options, correctKey: gap.correctKey }
  }

  const parsed = parseListeningBuilderExamQuestion(task.questionText)
  const inlineOptions = parsed.optionLines
    .map((line) => parseListeningBuilderExamOptionLine(line))
    .filter(Boolean) as Array<{ key: string; text: string }>

  if (inlineOptions.length) {
    return {
      type: 'mcq' as const,
      options: inlineOptions,
      correctKey: resolveListeningBuilderExamCorrectAnswer(task, tasks, testId)
    }
  }

  if (isListeningBuilderLabelMatchTask(task, tasks, testId)) {
    const pool = extractListeningBuilderTestOptionPool(tasks, testId, task)
    return {
      type: 'label-match' as const,
      options: pool,
      correctKey: resolveListeningBuilderExamCorrectAnswer(task, tasks, testId)
    }
  }

  return { type: 'none' as const, options: [], correctKey: '' }
}
