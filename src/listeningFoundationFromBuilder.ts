import type { ListeningBuilderExamSet, ListeningBuilderExamTask } from './listeningBuilderCambridge18Section2'
import type { ListeningFoundationQuestion, ListeningFoundationSet } from './listeningFoundationData'

const parseMcOptions = (questionText: string) => {
  const options: Array<{ key: string; text: string }> = []
  const lines = String(questionText || '').split('\n')
  for (const line of lines) {
    const match = line.trim().match(/^([A-G])\s*[\).:-]\s*(.+)$/i)
    if (match) {
      options.push({ key: match[1].toUpperCase(), text: match[2].trim() })
    }
  }
  return options
}

const normalize = (value: string) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const inferCorrectAnswer = (task: ListeningBuilderExamTask, options: Array<{ key: string; text: string }>) => {
  if (task.correctAnswer) return task.correctAnswer.toUpperCase()
  const phrase = normalize(task.questionWordPhrase)
  if (!options.length) return 'A'

  for (const option of options) {
    const optionText = normalize(option.text)
    if (optionText === phrase || optionText.includes(phrase) || phrase.includes(optionText)) {
      return option.key
    }
  }

  for (const option of options) {
    const optionWords = normalize(option.text).split(' ').filter((word) => word.length > 4)
    if (optionWords.some((word) => phrase.includes(word))) {
      return option.key
    }
  }

  return options[0].key
}

const buildFillOptions = (task: ListeningBuilderExamTask, correctAnswer: string) => {
  const answer = correctAnswer || task.correctAnswer || task.targetText.split(/\s+/).slice(0, 3).join(' ')
  return [
    { key: 'A', text: answer },
    { key: 'B', text: 'equipment' },
    { key: 'C', text: 'transport' },
    { key: 'D', text: 'weather' }
  ]
}

const builderTaskToFoundationQuestion = (
  setKey: string,
  section: number,
  task: ListeningBuilderExamTask,
  passage: string,
  answerOverrides: Record<string, string>
): ListeningFoundationQuestion => {
  const correctAnswer = answerOverrides[task.id] || task.correctAnswer || ''
  let options = parseMcOptions(task.questionText)
  if (options.length < 2) {
    options = buildFillOptions(task, correctAnswer)
  }

  const resolvedAnswer = correctAnswer || inferCorrectAnswer(task, options)

  return {
    id: `${setKey}-${task.id}`,
    number: task.questionNumber,
    section,
    question: task.questionText.split('\n')[0].trim() || task.questionWordPhrase,
    passage,
    evidence: task.targetText,
    correctAnswer: resolvedAnswer,
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
        builderTaskToFoundationQuestion(setKey, examSet.sectionNumber, task, passage, answerOverrides)
      )
    }
  })
