import type { ListeningBuilderExamSet, ListeningBuilderExamTask } from './listeningBuilderCambridge18Section2'
import type { ListeningFoundationQuestion, ListeningFoundationSet } from './listeningFoundationData'
import {
  buildListeningBuilderGapFillOptions,
  getListeningBuilderTaskAnswerChoices,
  isListeningBuilderGapFillTask,
  normalizeListeningBuilderQuestionText,
  parseListeningBuilderExamOptionLine,
  isListeningBuilderOptionLine,
  LISTENING_BUILDER_ANSWER_OVERRIDES,
  resolveListeningBuilderExamCorrectAnswer
} from './listeningBuilderQuestionParse'

const parseMcOptions = (questionText: string) => {
  const options: Array<{ key: string; text: string }> = []
  const lines = normalizeListeningBuilderQuestionText(questionText).split('\n')
  for (const line of lines) {
    const parsed = parseListeningBuilderExamOptionLine(line)
    if (parsed) {
      options.push(parsed)
      continue
    }
    const loose = line.trim().match(/^([A-G])\s*[\).:-]\s*(.+)$/i)
    if (loose) options.push({ key: loose[1].toUpperCase(), text: loose[2].trim() })
  }
  return options
}

const normalize = (value: string) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const builderTaskToFoundationQuestion = (
  setKey: string,
  testId: string,
  section: number,
  task: ListeningBuilderExamTask,
  allTasks: ListeningBuilderExamTask[],
  passage: string,
  answerOverrides: Record<string, string>
): ListeningFoundationQuestion => {
  const mergedOverrides = { ...LISTENING_BUILDER_ANSWER_OVERRIDES, ...answerOverrides }
  const resolvedAnswer =
    mergedOverrides[task.id] ||
    resolveListeningBuilderExamCorrectAnswer(task, allTasks, testId) ||
    task.correctAnswer ||
    'A'

  const builderChoices = getListeningBuilderTaskAnswerChoices(task, allTasks, testId)
  let options =
    builderChoices.options.length >= 2
      ? builderChoices.options
      : parseMcOptions(task.questionText)
  if (options.length < 2 || isListeningBuilderGapFillTask(task)) {
    options = buildListeningBuilderGapFillOptions(task, allTasks).options
  }

  const answerKey =
    builderChoices.correctKey ||
    (/^[A-I]$/i.test(String(resolvedAnswer).trim())
      ? String(resolvedAnswer).trim().toUpperCase()
      : options.find((option) => normalize(option.text) === normalize(String(task.targetText || resolvedAnswer)))
          ?.key || 'A')

  const parsedLines = normalizeListeningBuilderQuestionText(task.questionText)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
  const displayQuestion =
    parsedLines.filter((line) => !isListeningBuilderOptionLine(line)).join(' — ') ||
    task.questionWordPhrase

  return {
    id: `${setKey}-${task.id}`,
    number: task.questionNumber,
    section,
    question: displayQuestion,
    passage,
    evidence: task.targetText,
    correctAnswer: answerKey,
    options,
    passageKeyword: task.targetText.slice(0, 80),
    questionKeyword: task.questionWordPhrase,
    thaiMeaning: task.thaiMeaning,
    explanationThai: task.explanationThai
  }
}

const cambridgeAudioUrl = (book: number, section: number, test: number) =>
  `https://ieltstrainingonline.com/wp-content/uploads/2021/07/Cam${book}-Test${test}-Section${section}.mp3`

export const builderExamSetToFoundationSets = (
  examSet: ListeningBuilderExamSet,
  category: 'essential' | 'advanced',
  answerOverrides: Record<string, string> = {}
): ListeningFoundationSet[] =>
  examSet.tests.map((test) => {
    const passage = test.scriptParagraphs.join('\n\n')
    const setKey = `${examSet.id}-test${test.testNumber}`
    return {
      id: `foundation-${setKey}`,
      category,
      title: `Cam ${examSet.bookNumber} Test ${test.testNumber} · Section ${examSet.sectionNumber} - ${test.title || examSet.title} Skill Drill`,
      section: examSet.sectionNumber,
      levelLabel: `${category === 'advanced' ? 'Advanced' : 'Essential'} · Cam ${examSet.bookNumber} Test ${test.testNumber} · Section ${examSet.sectionNumber}`,
      audioUrl: cambridgeAudioUrl(examSet.bookNumber, examSet.sectionNumber, test.testNumber),
      questions: test.tasks.map((task) =>
        builderTaskToFoundationQuestion(
          setKey,
          test.id,
          examSet.sectionNumber,
          task,
          test.tasks,
          passage,
          answerOverrides
        )
      )
    }
  })
