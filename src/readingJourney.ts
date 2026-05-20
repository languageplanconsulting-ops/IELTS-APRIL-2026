type ReadingQuestion = {
  number: number
  prompt: string
  correctAnswer: string
  answerType: 'true-false-not-given' | 'yes-no-not-given' | 'multiple-choice' | 'text'
  acceptedAnswers?: string[]
  answerGroup?: string
  exactPortion: string
  explanationThai: string
  paraphrasedVocabulary: string
}

type ReadingPassageRecord = {
  number: number
  title: string
  bodyParagraphs: string[]
  questionSectionText: string
  questionRanges: Array<{ start: number; end: number }>
  questions: ReadingQuestion[]
}

export type ReadingExamRecord = {
  id: string
  title: string
  category: 'normal' | 'advanced'
  collectionTitle?: string
  releaseAt?: string
  rawPassageText: string
  rawAnswerKey: string
  parsedPayload: {
    title: string
    category: 'normal' | 'advanced'
    collectionTitle?: string
    releaseAt?: string
    passages: ReadingPassageRecord[]
    questionCount: number
  }
  createdAt: string | null
  updatedAt: string | null
}

export const READING_JOURNEY_UNLOCK_PERCENT = 80
export const READING_JOURNEY_EXAM_ID_PREFIX = 'journey-normal-stage-'
export const READING_JOURNEY_PROGRESS_KEY = 'ielts-reading-journey-progress'

export type ReadingJourneyPassageStats = {
  fill: number
  tfng: number
  ynng: number
  matching: number
  judgement: number
}

export type ReadingJourneyStageDefinition = {
  stageNumber: number
  id: string
  title: string
  subtitle: string
  sourceExamIds: [string, string, string]
}

export type ReadingJourneyProgress = {
  unlockedThroughStage: number
  attempts: Record<string, { accuracy: number; completedAt: string }>
}

const QUESTION_START_BY_PASSAGE_SLOT = [1, 14, 27] as const

export const getReadingJourneyStageId = (stageNumber: number) =>
  `${READING_JOURNEY_EXAM_ID_PREFIX}${stageNumber}`

export const parseReadingJourneyStageNumber = (examId: string) => {
  const match = String(examId || '').match(new RegExp(`^${READING_JOURNEY_EXAM_ID_PREFIX}(\\d+)$`))
  return match ? Number(match[1]) : null
}

export const isReadingJourneyExamId = (examId: string) =>
  String(examId || '').startsWith(READING_JOURNEY_EXAM_ID_PREFIX)

export const classifyPassageForJourney = (passage: ReadingPassageRecord): ReadingJourneyPassageStats => {
  const sectionText = String(passage.questionSectionText || '')
  let fill = 0
  let tfng = 0
  let ynng = 0
  let matching = 0

  for (const question of passage.questions || []) {
    if (question.answerType === 'text') {
      fill += 1
      continue
    }
    if (question.answerType === 'true-false-not-given') {
      tfng += 1
      continue
    }
    if (question.answerType === 'yes-no-not-given') {
      ynng += 1
      continue
    }
    if (question.answerType !== 'multiple-choice') continue

    const answer = String(question.correctAnswer || '').trim()
    const prompt = String(question.prompt || '')
    const isLetter = /^[A-G]$/i.test(answer)
    const isRoman = /^(?:i|ii|iii|iv|v|vi|vii|viii|ix|x)$/i.test(answer)
    const isMatchingInfo =
      isLetter && /which (?:paragraph|section) contains|contains the following information/i.test(sectionText + prompt)
    const isMatchingHeading =
      isRoman || (/heading/i.test(sectionText + prompt) && (isLetter || isRoman))
    const isMatchingStatement = isLetter && /match\s+each/i.test(sectionText)
    if (isMatchingInfo || isMatchingHeading || isMatchingStatement) {
      matching += 1
    }
  }

  return {
    fill,
    tfng,
    ynng,
    matching,
    judgement: tfng + ynng
  }
}

const passageCoverageScore = (stats: ReadingJourneyPassageStats) =>
  (stats.fill >= 1 ? 1 : 0) + (stats.judgement >= 1 ? 1 : 0) + (stats.matching >= 1 ? 1 : 0)

/** Each passage covers at least two of: fill, judgement, matching. */
export const passageMeetsJourneyRequirements = (passage: ReadingPassageRecord) =>
  passageCoverageScore(classifyPassageForJourney(passage)) >= 2

export const stageMeetsJourneyRequirements = (passages: ReadingPassageRecord[]) => {
  if (passages.length !== 3) return false
  if (!passages.every(passageMeetsJourneyRequirements)) return false

  const totals = passages.reduce(
    (acc, passage) => {
      const stats = classifyPassageForJourney(passage)
      acc.fill += stats.fill
      acc.tfng += stats.tfng
      acc.ynng += stats.ynng
      acc.matching += stats.matching
      acc.judgement += stats.judgement
      return acc
    },
    { fill: 0, tfng: 0, ynng: 0, matching: 0, judgement: 0 }
  )

  return (
    totals.fill >= 3 &&
    totals.tfng >= 1 &&
    totals.ynng >= 1 &&
    totals.matching >= 3 &&
    totals.judgement >= 3
  )
}

const getQuestionNumberBounds = (passage: ReadingPassageRecord) => {
  const numbers = (passage.questions || []).map((question) => question.number).filter(Boolean)
  if (!numbers.length) return { min: 0, max: 0 }
  return { min: Math.min(...numbers), max: Math.max(...numbers) }
}

const inferPassageSlot = (exam: ReadingExamRecord): 1 | 2 | 3 => {
  const passage = exam.parsedPayload?.passages?.[0]
  if (!passage) return 1
  const { min, max } = getQuestionNumberBounds(passage)
  if (min >= 27 || max >= 27) return 3
  if (min >= 14 || max >= 14) return 2
  if (/passage\s*2/i.test(exam.title)) return 2
  if (/passage\s*3/i.test(exam.title)) return 3
  if (/exercise\s*[3-8]/i.test(exam.title)) return 3
  return 1
}

const remapQuestion = (question: ReadingQuestion, nextNumber: number): ReadingQuestion => ({
  ...question,
  number: nextNumber,
  prompt: String(question.prompt || '').trim()
})

const remapPassageForSlot = (
  passage: ReadingPassageRecord,
  slot: 1 | 2 | 3,
  questionOffset: number
): ReadingPassageRecord => {
  const nextPassageNumber = slot
  const remappedQuestions = (passage.questions || []).map((question) =>
    remapQuestion(question, question.number + questionOffset)
  )
  const ranges = passage.questionRanges?.map((range) => ({
    start: range.start + questionOffset,
    end: range.end + questionOffset
  }))

  let questionSectionText = String(passage.questionSectionText || '')
  if (questionOffset > 0) {
    questionSectionText = questionSectionText.replace(/\b(\d{1,2})\b/g, (match) => {
      const value = Number(match)
      if (value >= 1 && value <= 40) return String(value + questionOffset)
      return match
    })
  }

  return {
    ...passage,
    number: nextPassageNumber,
    questions: remappedQuestions,
    questionRanges: ranges?.length ? ranges : remappedQuestions.length ? [{ start: remappedQuestions[0].number, end: remappedQuestions[remappedQuestions.length - 1].number }] : [],
    questionSectionText
  }
}

export const mergeExamsIntoJourneyExam = (
  stageNumber: number,
  sourceExams: [ReadingExamRecord, ReadingExamRecord, ReadingExamRecord]
): ReadingExamRecord | null => {
  const ordered = [...sourceExams].sort(
    (first, second) => inferPassageSlot(first) - inferPassageSlot(second)
  ) as [ReadingExamRecord, ReadingExamRecord, ReadingExamRecord]

  const passages = ordered.map((exam, index) => {
    const slot = (index + 1) as 1 | 2 | 3
    const sourcePassage = exam.parsedPayload?.passages?.[0]
    if (!sourcePassage) return null
    const targetStart = QUESTION_START_BY_PASSAGE_SLOT[slot - 1]
    const { min } = getQuestionNumberBounds(sourcePassage)
    const questionOffset = min > 0 ? targetStart - min : targetStart - 1
    return remapPassageForSlot(sourcePassage, slot, questionOffset)
  })

  if (passages.some((passage) => !passage)) return null
  const typedPassages = passages as ReadingPassageRecord[]
  if (!stageMeetsJourneyRequirements(typedPassages)) return null

  const questionCount = typedPassages.reduce((sum, passage) => sum + (passage.questions?.length || 0), 0)
  const now = new Date().toISOString()

  return {
    id: getReadingJourneyStageId(stageNumber),
    title: `ด่าน ${stageNumber} — Normal Reading Journey`,
    category: 'normal',
    collectionTitle: 'Normal Reading Journey',
    rawPassageText: typedPassages
      .map(
        (passage, index) =>
          `READING PASSAGE ${index + 1}\n\n${passage.title}\n\n${passage.bodyParagraphs.join('\n\n')}\n\n${passage.questionSectionText}`
      )
      .join('\n\n'),
    rawAnswerKey: typedPassages
      .flatMap((passage) => passage.questions || [])
      .map(
        (question) =>
          `Question ${question.number}: ${question.prompt}\n\nCorrect Answer: ${question.correctAnswer}`
      )
      .join('\n\n'),
    parsedPayload: {
      title: `ด่าน ${stageNumber}`,
      category: 'normal',
      collectionTitle: 'Normal Reading Journey',
      passages: typedPassages,
      questionCount
    },
    createdAt: now,
    updatedAt: now
  }
}

const isJourneyCandidateExam = (exam: ReadingExamRecord) => {
  if (exam.category !== 'normal') return false
  const passage = exam.parsedPayload?.passages?.[0]
  if (!passage || (exam.parsedPayload?.passages?.length || 0) !== 1) return false
  return passageMeetsJourneyRequirements(passage)
}

export const buildJourneyStageDefinitions = (
  poolExams: ReadingExamRecord[],
  minimumStages = 24
): ReadingJourneyStageDefinition[] => {
  const candidates = poolExams.filter(Boolean).filter(isJourneyCandidateExam)
  if (!candidates.length) return []

  const slot1 = candidates.filter((exam) => inferPassageSlot(exam) === 1)
  const slot2 = candidates.filter((exam) => inferPassageSlot(exam) === 2)
  const slot3 = candidates.filter((exam) => inferPassageSlot(exam) === 3)
  const fallback = candidates.filter((exam) => !slot1.includes(exam) && !slot2.includes(exam) && !slot3.includes(exam))

  const pick = (list: ReadingExamRecord[], index: number) => {
    if (list.length) return list[index % list.length]
    return fallback[index % Math.max(fallback.length, 1)] || candidates[index % candidates.length]
  }

  const maxLength = Math.max(slot1.length, slot2.length, slot3.length, candidates.length, 1)
  const targetCount = Math.max(minimumStages, maxLength)
  const stages: ReadingJourneyStageDefinition[] = []

  for (let index = 0; index < targetCount; index += 1) {
    const stageNumber = index + 1
    const trio: [ReadingExamRecord, ReadingExamRecord, ReadingExamRecord] = [
      pick(slot1.length ? slot1 : candidates, index),
      pick(slot2.length ? slot2 : candidates, index + 1),
      pick(slot3.length ? slot3 : candidates, index + 2)
    ]
    if (trio.some((exam) => !exam)) continue
    const merged = mergeExamsIntoJourneyExam(stageNumber, trio)
    if (!merged) continue
    stages.push({
      stageNumber,
      id: merged.id,
      title: `ด่าน ${stageNumber}`,
      subtitle: trio.map((exam) => exam.title).join(' · '),
      sourceExamIds: trio.map((exam) => exam.id) as [string, string, string]
    })
  }

  return stages
}

export const buildJourneyExamRecords = (
  poolExams: ReadingExamRecord[],
  minimumStages = 24
): ReadingExamRecord[] => {
  const definitions = buildJourneyStageDefinitions(poolExams, minimumStages)
  return definitions
    .map((definition) => {
      const sources = definition.sourceExamIds
        .map((examId) => poolExams.find((exam) => exam.id === examId))
        .filter(Boolean) as ReadingExamRecord[]
      if (sources.length !== 3) return null
      return mergeExamsIntoJourneyExam(definition.stageNumber, sources as [ReadingExamRecord, ReadingExamRecord, ReadingExamRecord])
    })
    .filter(Boolean) as ReadingExamRecord[]
}

export const getDefaultReadingJourneyProgress = (): ReadingJourneyProgress => ({
  unlockedThroughStage: 1,
  attempts: {}
})

export const normalizeReadingJourneyProgress = (value: unknown): ReadingJourneyProgress => {
  const fallback = getDefaultReadingJourneyProgress()
  if (!value || typeof value !== 'object') return fallback
  const record = value as Partial<ReadingJourneyProgress>
  const attempts =
    record.attempts && typeof record.attempts === 'object'
      ? Object.fromEntries(
          Object.entries(record.attempts).map(([examId, attempt]) => {
            const accuracy = Number((attempt as { accuracy?: number })?.accuracy || 0)
            const completedAt = String((attempt as { completedAt?: string })?.completedAt || '')
            return [examId, { accuracy, completedAt }]
          })
        )
      : {}
  const unlockedThroughStage = Math.max(1, Number(record.unlockedThroughStage || 1))
  return { unlockedThroughStage, attempts }
}

export const isReadingJourneyStageUnlocked = (
  stageNumber: number,
  progress: ReadingJourneyProgress
) => stageNumber <= Math.max(1, progress.unlockedThroughStage)

export const didPassReadingJourneyStage = (accuracy: number) =>
  accuracy >= READING_JOURNEY_UNLOCK_PERCENT

export const getNextJourneyUnlockStage = (
  stageNumber: number,
  accuracy: number,
  progress: ReadingJourneyProgress
) => {
  if (!didPassReadingJourneyStage(accuracy)) return progress.unlockedThroughStage
  return Math.max(progress.unlockedThroughStage, stageNumber + 1)
}

export const getJourneyStageTypeSummary = (exam: ReadingExamRecord) => {
  const passages = exam.parsedPayload?.passages || []
  const totals = passages.reduce(
    (acc, passage) => {
      const stats = classifyPassageForJourney(passage)
      acc.fill += stats.fill
      acc.tfng += stats.tfng
      acc.ynng += stats.ynng
      acc.matching += stats.matching
      return acc
    },
    { fill: 0, tfng: 0, ynng: 0, matching: 0 }
  )
  return `3 passages · Fill ${totals.fill} · TFNG ${totals.tfng} · Y/N/NG ${totals.ynng} · Matching ${totals.matching}`
}
