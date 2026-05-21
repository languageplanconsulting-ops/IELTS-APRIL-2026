import {
  CAMBRIDGE_PART1_FORM_BY_TEST,
  part1FormKeyFromSetId,
  type Part1ExamForm
} from './listeningPart1FormLayout'
import type { ListeningBuilderExamTask } from './listeningBuilderCambridge18Section2'
import {
  isListeningExcerptDrillSet,
  resolveListeningFoundationAudioscript
} from './listeningFoundationAudioscript'
import type { ListeningFoundationQuestion, ListeningFoundationSet } from './listeningFoundationData'
import {
  getListeningBuilderTaskAnswerChoices,
  isListeningBuilderGapFillTask,
  isListeningBuilderLabelMatchTask,
  parseListeningBuilderExamQuestion
} from './listeningBuilderQuestionParse'

export type ListeningSectionExamQuestion = {
  id: string
  number: number
  questionText: string
  stem: string
  contextLines: string[]
  options: Array<{ key: string; text: string }>
  correctAnswer: string
  acceptedAnswers?: string[]
  evidence: string
  passageKeyword: string
  questionKeyword: string
  thaiMeaning: string
  explanationThai: string
  layout: 'choice' | 'gap-fill' | 'matching-row'
  rowLabel?: string
}

export type ListeningSectionExamGroup =
  | {
      kind: 'choice-block'
      id: string
      title: string
      instruction?: string
      contextLines: string[]
      options: Array<{ key: string; text: string }>
      pickCount: 1 | 2
      questions: ListeningSectionExamQuestion[]
    }
  | {
      kind: 'matching-block'
      id: string
      title: string
      instruction?: string
      contextLines: string[]
      poolTitle: string
      options: Array<{ key: string; text: string }>
      questions: ListeningSectionExamQuestion[]
    }
  | {
      kind: 'gap-fill-block'
      id: string
      title: string
      instruction?: string
      contextLines: string[]
      questions: ListeningSectionExamQuestion[]
    }

export type ListeningSectionExamConfig = {
  title: string
  subtitle: string
  sectionNumber: number
  audioUrl?: string
  passage: string
  excerptDrill?: boolean
  /** Part 1 gap-fill: grade answers only — no script evidence highlight. */
  answerOnlyMode?: boolean
  /** Official Cambridge Part 1 notes form layout. */
  part1Form?: Part1ExamForm
  questions: ListeningSectionExamQuestion[]
  groups: ListeningSectionExamGroup[]
}

const normalizeStemKey = (value: string) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const extractInstruction = (lines: string[]) => {
  const joined = lines.join(' ')
  const match = joined.match(/choose\s+(two|the\s+correct\s+letter[^.]*)/i)
  return match ? match[0].trim() : undefined
}

const buildQuestionTitle = (numbers: number[]) => {
  if (numbers.length === 0) return 'Questions'
  if (numbers.length === 1) return `Question ${numbers[0]}`
  const sorted = [...numbers].sort((a, b) => a - b)
  const isContiguous = sorted.every((num, index) => index === 0 || num === sorted[index - 1] + 1)
  if (isContiguous) return `Questions ${sorted[0]}-${sorted[sorted.length - 1]}`
  return `Questions ${sorted.join(', ')}`
}

export const buildListeningSectionExamGroups = (
  questions: ListeningSectionExamQuestion[]
): ListeningSectionExamGroup[] => {
  const groups: ListeningSectionExamGroup[] = []
  let index = 0

  while (index < questions.length) {
    const current = questions[index]
    const parsed = parseListeningBuilderExamQuestion(current.questionText)
    const stemKey = normalizeStemKey(parsed.stem || current.stem)

    let end = index + 1
    while (end < questions.length) {
      const next = questions[end]
      const nextParsed = parseListeningBuilderExamQuestion(next.questionText)
      const nextKey = normalizeStemKey(nextParsed.stem || next.stem)
      if (nextKey !== stemKey) break
      end += 1
    }

    const run = questions.slice(index, end)
    const numbers = run.map((item) => item.number)
    const title = buildQuestionTitle(numbers)
    const instruction =
      extractInstruction(parsed.contextLines) ||
      (/choose\s+two/i.test(parsed.stem) ? 'Choose TWO letters, A-E.' : undefined)
    const contextLines = parsed.contextLines.filter(
      (line) => !/choose\s+(two|the\s+correct)/i.test(line)
    )

    if (run.every((item) => item.layout === 'matching-row')) {
      groups.push({
        kind: 'matching-block',
        id: `match-${run[0].id}`,
        title,
        instruction,
        contextLines,
        poolTitle: 'Options',
        options: run[0].options,
        questions: run
      })
    } else if (run.every((item) => item.layout === 'gap-fill')) {
      groups.push({
        kind: 'gap-fill-block',
        id: `gap-${run[0].id}`,
        title,
        instruction: instruction || parsed.contextLines[0],
        contextLines,
        questions: run
      })
    } else if (run.length > 1 && /choose\s+two/i.test(`${parsed.stem} ${parsed.contextLines.join(' ')}`)) {
      groups.push({
        kind: 'choice-block',
        id: `two-${run[0].id}`,
        title,
        instruction: instruction || 'Choose TWO letters, A-E.',
        contextLines,
        options: run[0].options.length > 0 ? run[0].options : parsed.optionLines.map((line) => {
          const match = line.match(/^([A-Z])\s+(.+)$/i)
          return match ? { key: match[1].toUpperCase(), text: match[2].trim() } : { key: 'A', text: line }
        }),
        pickCount: 2,
        questions: run
      })
    } else {
      for (const question of run) {
        const qParsed = parseListeningBuilderExamQuestion(question.questionText)
        groups.push({
          kind: 'choice-block',
          id: `mc-${question.id}`,
          title: `Question ${question.number}`,
          instruction,
          contextLines: qParsed.contextLines,
          options: question.options,
          pickCount: 1,
          questions: [question]
        })
      }
    }

    index = end
  }

  return groups
}

export const foundationQuestionToExamQuestion = (
  question: ListeningFoundationQuestion
): ListeningSectionExamQuestion => {
  const questionText =
    question.questionText ||
    [question.question, ...question.options.map((option) => `${option.key} ${option.text}`)].join('\n')
  const parsed = parseListeningBuilderExamQuestion(questionText)
  const stem = parsed.stem || question.question

  return {
    id: question.id,
    number: question.number,
    questionText,
    stem,
    contextLines: parsed.contextLines,
    options: question.options,
    correctAnswer: question.correctAnswer,
    acceptedAnswers: question.acceptedAnswers,
    evidence: question.evidence,
    passageKeyword: question.passageKeyword,
    questionKeyword: question.questionKeyword,
    thaiMeaning: question.thaiMeaning,
    explanationThai: question.explanationThai,
    layout: question.layout || (parsed.isGapFill ? 'gap-fill' : 'choice'),
    rowLabel: question.rowLabel
  }
}

export const foundationSetToExamConfig = (set: ListeningFoundationSet): ListeningSectionExamConfig => {
  const questions = set.questions.map(foundationQuestionToExamQuestion)
  const passage = resolveListeningFoundationAudioscript(set)
  const formKey = set.category === 'part1-detail' ? part1FormKeyFromSetId(set.id) : ''
  return {
    title: set.title,
    subtitle: set.levelLabel,
    sectionNumber: set.section,
    audioUrl: set.audioUrl,
    passage,
    excerptDrill: isListeningExcerptDrillSet(set),
    answerOnlyMode: set.category === 'part1-detail',
    part1Form: formKey ? CAMBRIDGE_PART1_FORM_BY_TEST[formKey] : undefined,
    questions,
    groups: buildListeningSectionExamGroups(questions)
  }
}

export const builderTaskToExamQuestion = (
  task: ListeningBuilderExamTask,
  allTasks: ListeningBuilderExamTask[],
  testId: string
): ListeningSectionExamQuestion => {
  const parsed = parseListeningBuilderExamQuestion(task.questionText)
  const answerChoices = getListeningBuilderTaskAnswerChoices(task, allTasks, testId)
  const options =
    answerChoices.options.length >= 2
      ? answerChoices.options
      : parsed.optionLines.map((line) => {
          const match = line.match(/^([A-Z])\s+(.+)$/i)
          return match ? { key: match[1].toUpperCase(), text: match[2].trim() } : { key: 'A', text: line }
        })

  const correctAnswer = answerChoices.correctKey || task.correctAnswer || 'A'
  const isGap = isListeningBuilderGapFillTask(task)
  const isMatching = isListeningBuilderLabelMatchTask(task, allTasks, testId)
  const stem = parsed.stem || task.questionWordPhrase
  const rowLabel =
    isMatching && stem && !stem.includes('?') && stem.length <= 64 ? stem : undefined

  return {
    id: task.id,
    number: task.questionNumber,
    questionText: task.questionText,
    stem,
    contextLines: parsed.contextLines,
    options,
    correctAnswer,
    evidence: task.targetText,
    passageKeyword: task.targetText.slice(0, 80),
    questionKeyword: task.questionWordPhrase,
    thaiMeaning: task.thaiMeaning,
    explanationThai: task.explanationThai,
    layout: isGap ? 'gap-fill' : isMatching ? 'matching-row' : 'choice',
    rowLabel
  }
}
