export type ReadingBankCategory = 'normal' | 'advanced' | 'general-training'

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
  category: ReadingBankCategory
  collectionTitle?: string
  releaseAt?: string
  gtSection?: number
  gtTestNumber?: number
  gtKind?: 'section' | 'full'
  rawPassageText: string
  rawAnswerKey: string
  parsedPayload: {
    title: string
    category: ReadingBankCategory
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

const ROMAN_HEADING_PATTERN = /^(?:i|ii|iii|iv|v|vi|vii|viii|ix|x)$/i

export type ReadingJourneyPassageStats = {
  fill: number
  tfng: number
  ynng: number
  matchingHeadings: number
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

const isMatchingHeadingQuestion = (question: ReadingQuestion, sectionText: string) => {
  const answer = String(question.correctAnswer || '').trim()
  const prompt = String(question.prompt || '')
  const context = `${sectionText}\n${prompt}`
  if (ROMAN_HEADING_PATTERN.test(answer)) return true
  if (/heading/i.test(context) && !/which (?:paragraph|section) contains/i.test(context)) return true
  return false
}

const isMatchingInformationQuestion = (question: ReadingQuestion, sectionText: string) => {
  const answer = String(question.correctAnswer || '').trim()
  const prompt = String(question.prompt || '')
  const context = `${sectionText}\n${prompt}`
  return (
    /^[A-G]$/i.test(answer) &&
    /which (?:paragraph|section) contains|contains the following information|match each statement with the correct/i.test(
      context
    )
  )
}

const isMatchingFeaturesQuestion = (question: ReadingQuestion, sectionText: string) => {
  const answer = String(question.correctAnswer || '').trim()
  const prompt = String(question.prompt || '')
  const context = `${sectionText}\n${prompt}`
  return /^[A-G]$/i.test(answer) && /match each .* with the correct|list of (?:people|researchers|experts|features)/i.test(context)
}

const isAnyMatchingQuestion = (question: ReadingQuestion, sectionText: string) =>
  isMatchingHeadingQuestion(question, sectionText) ||
  isMatchingInformationQuestion(question, sectionText) ||
  isMatchingFeaturesQuestion(question, sectionText)

export const classifyPassageForJourney = (passage: ReadingPassageRecord): ReadingJourneyPassageStats => {
  const sectionText = String(passage.questionSectionText || '')
  let fill = 0
  let tfng = 0
  let ynng = 0
  let matchingHeadings = 0
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
    if (isMatchingHeadingQuestion(question, sectionText)) {
      matchingHeadings += 1
      matching += 1
      continue
    }
    if (isAnyMatchingQuestion(question, sectionText)) {
      matching += 1
    }
  }

  return {
    fill,
    tfng,
    ynng,
    matchingHeadings,
    matching,
    judgement: tfng + ynng
  }
}

export const passageHasFill = (passage: ReadingPassageRecord) => classifyPassageForJourney(passage).fill >= 1
export const passageHasJudgement = (passage: ReadingPassageRecord) =>
  classifyPassageForJourney(passage).judgement >= 1
export const passageHasMatching = (passage: ReadingPassageRecord) =>
  classifyPassageForJourney(passage).matching >= 1
export const passageHasMatchingHeadings = (passage: ReadingPassageRecord) =>
  classifyPassageForJourney(passage).matchingHeadings >= 1

/** Each passage must contribute at least one journey skill. */
export const passageMeetsJourneyRequirements = (passage: ReadingPassageRecord) =>
  passageHasFill(passage) || passageHasJudgement(passage) || passageHasMatching(passage)

export const stageMeetsJourneyRequirements = (passages: ReadingPassageRecord[]) => {
  if (passages.length !== 3) return false

  const totals = passages.reduce(
    (acc, passage) => {
      const stats = classifyPassageForJourney(passage)
      acc.fill += stats.fill
      acc.judgement += stats.judgement
      acc.matching += stats.matching
      acc.matchingHeadings += stats.matchingHeadings
      return acc
    },
    { fill: 0, judgement: 0, matching: 0, matchingHeadings: 0 }
  )

  const hasMatching =
    totals.matchingHeadings >= 1 || totals.matching >= 1

  return totals.fill >= 1 && totals.judgement >= 1 && hasMatching
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
  if (/passage\s*3/i.test(exam.title)) return 3
  if (/passage\s*2/i.test(exam.title)) return 2
  if (/exercise\s*[3-8]/i.test(exam.title)) return 3
  return 1
}

/** Remap IELTS question numbers in section text without touching dates like 1946/7 or 70 CE. */
export const remapReadingQuestionNumbersInSectionText = (text: string, offset: number) => {
  if (!offset) return String(text || '')

  let result = String(text || '')

  result = result.replace(
    /Questions?\s+(\d{1,2})(?:\s*[–-]\s*(\d{1,2})|\s+and\s+(\d{1,2}))?/gi,
    (match) =>
      match.replace(/\d{1,2}/g, (token) => {
        const value = Number(token)
        return value >= 1 && value <= 40 ? String(value + offset) : token
      })
  )

  result = result.replace(
    /(?:in\s+)?boxes\s+(\d{1,2})(?:\s*[–-]\s*(\d{1,2}))?/gi,
    (match) =>
      match.replace(/\d{1,2}/g, (token) => {
        const value = Number(token)
        return value >= 1 && value <= 40 ? String(value + offset) : token
      })
  )

  result = result.replace(
    /\b(\d{1,2})\s*(?:[.．…⋯·•_\-–—]{2,}|…+)/g,
    (match, token: string) => {
      const value = Number(token)
      return value >= 1 && value <= 40 ? `${value + offset}${match.slice(token.length)}` : match
    }
  )

  result = result.replace(/^(\s*)(\d{1,2})(\s+)([A-Z])/gm, (match, indent, token, space, letter) => {
    const value = Number(token)
    return value >= 1 && value <= 40 ? `${indent}${value + offset}${space}${letter}` : match
  })

  return result
}

const remapQuestionPrompt = (prompt: string, originalNumber: number, nextNumber: number) => {
  let result = String(prompt || '').trim()
  if (!result || nextNumber === originalNumber) return result

  result = result.replace(
    new RegExp(`^Complete the (?:notes|summary|sentences|table):?\\s*${originalNumber}\\b`, 'i'),
    (match) => match.replace(String(originalNumber), String(nextNumber))
  )
  result = result.replace(
    new RegExp(`^Complete the summary —\\s*${originalNumber}\\b`, 'i'),
    `Complete the summary — ${nextNumber}`
  )
  result = result.replace(
    new RegExp(`\\b${originalNumber}\\s*([.．…⋯·•_\\-–—]+)`, 'g'),
    `${nextNumber} $1`
  )
  result = result.replace(
    new RegExp(`\\b${originalNumber}\\b(?=\\s*(?:[.…]|$))`),
    String(nextNumber)
  )

  return result
}

const remapQuestion = (question: ReadingQuestion, nextNumber: number): ReadingQuestion => ({
  ...question,
  number: nextNumber,
  prompt: remapQuestionPrompt(String(question.prompt || '').trim(), question.number, nextNumber)
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

  const questionSectionText =
    questionOffset > 0
      ? remapReadingQuestionNumbersInSectionText(passage.questionSectionText || '', questionOffset)
      : String(passage.questionSectionText || '')

  return {
    ...passage,
    number: nextPassageNumber,
    questions: remappedQuestions,
    questionRanges: ranges?.length
      ? ranges
      : remappedQuestions.length
        ? [{ start: remappedQuestions[0].number, end: remappedQuestions[remappedQuestions.length - 1].number }]
        : [],
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

export const mergeExamsIntoFullReadingExam = (
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

  const questionCount = typedPassages.reduce((sum, passage) => sum + (passage.questions?.length || 0), 0)
  if (questionCount !== 40) return null

  const now = new Date().toISOString()

  return {
    id: 'reading-full-test-placeholder',
    title: 'Cambridge Full Reading',
    category: 'normal',
    collectionTitle: 'Cambridge Full Reading',
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
      title: 'Cambridge Full Reading',
      category: 'normal',
      collectionTitle: 'Cambridge Full Reading',
      passages: typedPassages,
      questionCount
    },
    createdAt: now,
    updatedAt: now
  }
}

export const isReadingJourneySourceExam = (exam: ReadingExamRecord) => {
  if (exam.category !== 'normal') return false
  if (isReadingJourneyExamId(exam.id)) return false
  const passage = exam.parsedPayload?.passages?.[0]
  if (!passage || (exam.parsedPayload?.passages?.length || 0) !== 1) return false
  if (!(passage.questions?.length || 0)) return false
  return passageMeetsJourneyRequirements(passage)
}

const pickDistinctExam = (
  list: ReadingExamRecord[],
  index: number,
  usedIds: Set<string>,
  fallback: ReadingExamRecord[]
) => {
  if (!list.length) return null
  for (let offset = 0; offset < list.length; offset += 1) {
    const candidate = list[(index + offset) % list.length]
    if (!usedIds.has(candidate.id)) return candidate
  }
  const backup = fallback[(index + usedIds.size) % Math.max(fallback.length, 1)]
  return backup && !usedIds.has(backup.id) ? backup : backup || null
}

const buildStageTrio = (
  candidates: ReadingExamRecord[],
  stageNumber: number
): [ReadingExamRecord, ReadingExamRecord, ReadingExamRecord] | null => {
  const fillPool = candidates.filter((exam) => passageHasFill(exam.parsedPayload.passages[0]))
  const judgementPool = candidates.filter((exam) => passageHasJudgement(exam.parsedPayload.passages[0]))
  const matchingHeadingPool = candidates.filter((exam) =>
    passageHasMatchingHeadings(exam.parsedPayload.passages[0])
  )
  const matchingPool = candidates.filter((exam) => passageHasMatching(exam.parsedPayload.passages[0]))

  const matchPool = matchingHeadingPool.length ? matchingHeadingPool : matchingPool
  if (!fillPool.length || !judgementPool.length || !matchPool.length) return null

  const usedIds = new Set<string>()
  const fillExam = pickDistinctExam(fillPool, stageNumber * 3, usedIds, candidates)
  if (!fillExam) return null
  usedIds.add(fillExam.id)

  const judgementExam = pickDistinctExam(judgementPool, stageNumber * 5 + 1, usedIds, candidates)
  if (!judgementExam) return null
  usedIds.add(judgementExam.id)

  const matchingExam = pickDistinctExam(matchPool, stageNumber * 7 + 2, usedIds, candidates)
  if (!matchingExam) return null

  return [fillExam, judgementExam, matchingExam]
}

export const buildJourneyStageDefinitions = (
  poolExams: ReadingExamRecord[],
  minimumStages = 24
): ReadingJourneyStageDefinition[] => {
  const candidates = poolExams.filter(Boolean).filter(isReadingJourneySourceExam)
  if (!candidates.length) return []

  const maxStages = Math.max(
    minimumStages,
    Math.floor(candidates.length / 3),
    Math.min(
      candidates.filter((exam) => passageHasFill(exam.parsedPayload.passages[0])).length,
      candidates.filter((exam) => passageHasJudgement(exam.parsedPayload.passages[0])).length,
      candidates.filter((exam) => passageHasMatching(exam.parsedPayload.passages[0])).length
    )
  )

  const stages: ReadingJourneyStageDefinition[] = []

  for (let index = 0; index < maxStages; index += 1) {
    const stageNumber = index + 1
    const trio = buildStageTrio(candidates, stageNumber)
    if (!trio) break
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

export const isReadingJourneyStageAccessible = (
  stageNumber: number,
  progress: ReadingJourneyProgress,
  role?: string
) => {
  if (String(role || '').trim().toLowerCase() === 'admin') return true
  return isReadingJourneyStageUnlocked(stageNumber, progress)
}

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
      acc.matchingHeadings += stats.matchingHeadings
      return acc
    },
    { fill: 0, tfng: 0, ynng: 0, matching: 0, matchingHeadings: 0 }
  )
  const matchingLabel =
    totals.matchingHeadings > 0 ? `Matching headings ${totals.matchingHeadings}` : `Matching ${totals.matching}`
  return `3 passages · Fill ${totals.fill} · TFNG ${totals.tfng} · Y/N/NG ${totals.ynng} · ${matchingLabel}`
}
