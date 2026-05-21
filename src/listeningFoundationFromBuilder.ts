import type { ListeningBuilderExamSet, ListeningBuilderExamTask } from './listeningBuilderCambridge18Section2'
import type { ListeningFoundationQuestion, ListeningFoundationSet } from './listeningFoundationData'
import {
  buildListeningBuilderGapFillOptions,
  getListeningBuilderTaskAnswerChoices,
  isListeningBuilderGapFillTask,
  isListeningBuilderLabelMatchTask,
  normalizeListeningBuilderQuestionText,
  parseListeningBuilderExamOptionLine,
  parseListeningBuilderExamQuestion,
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

const splitPassageSentences = (passage: string) =>
  passage
    .split(/\n+|(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)

const resolveEvidenceInPassage = (
  passage: string,
  task: ListeningBuilderExamTask,
  resolvedAnswer: string
): string => {
  const target = String(task.targetText || '').trim()
  if (target && passage.includes(target)) return target

  const sentences = splitPassageSentences(passage)
  const keywordSource = [task.questionWordPhrase, target].filter(Boolean).join(' ')
  const keywords = normalize(keywordSource)
    .split(' ')
    .filter((word) => word.length > 3)

  if (keywords.length) {
    let bestSentence = ''
    let bestScore = 0
    for (const sentence of sentences) {
      const normalizedSentence = normalize(sentence)
      const score = keywords.filter((word) => normalizedSentence.includes(word)).length
      if (score > bestScore) {
        bestScore = score
        bestSentence = sentence
      }
    }
    if (bestScore >= Math.min(2, keywords.length) && bestSentence) return bestSentence
  }

  const answerWord = String(resolvedAnswer)
    .replace(/\(s\)/gi, 's')
    .replace(/[^a-z0-9\s]/gi, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .pop()

  const answerStems = [
    normalize(String(resolvedAnswer).replace(/\(s\)/gi, 's')),
    answerWord ? normalize(answerWord) : ''
  ].filter((stem) => stem.length >= 3)

  for (const stem of answerStems) {
    for (const sentence of sentences) {
      if (normalize(sentence).includes(stem)) return sentence
    }
  }

  if (target) {
    const targetWords = normalize(target)
      .split(' ')
      .filter((word) => word.length > 3)
    let bestSentence = ''
    let bestScore = 0
    for (const sentence of sentences) {
      const normalizedSentence = normalize(sentence)
      const score = targetWords.filter((word) => normalizedSentence.includes(word)).length
      if (score > bestScore) {
        bestScore = score
        bestSentence = sentence
      }
    }
    if (bestScore >= 2 && bestSentence) return bestSentence
  }

  return target || task.questionWordPhrase
}

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

  const correctOptionText =
    options.find((option) => option.key === answerKey)?.text || task.targetText || String(resolvedAnswer)

  const parsedLines = normalizeListeningBuilderQuestionText(task.questionText)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
  const displayQuestion =
    parsedLines.filter((line) => !isListeningBuilderOptionLine(line)).join(' — ') ||
    task.questionWordPhrase

  const isGap = isListeningBuilderGapFillTask(task)
  const isMatching = isListeningBuilderLabelMatchTask(task, allTasks, testId)
  const parsedStem = parseListeningBuilderExamQuestion(task.questionText).stem || task.questionWordPhrase
  const rowLabel =
    isMatching && parsedStem && !parsedStem.includes('?') && parsedStem.length <= 64 ? parsedStem : undefined

  const evidence = resolveEvidenceInPassage(passage, task, correctOptionText)

  return {
    id: `${setKey}-${task.id}`,
    number: task.questionNumber,
    section,
    question: displayQuestion,
    passage,
    evidence,
    correctAnswer: answerKey,
    options,
    passageKeyword: evidence.slice(0, 80),
    questionKeyword: task.questionWordPhrase,
    thaiMeaning: task.thaiMeaning,
    explanationThai: task.explanationThai,
    questionText: task.questionText,
    layout: isGap ? 'gap-fill' : isMatching ? 'matching-row' : 'choice',
    rowLabel
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
