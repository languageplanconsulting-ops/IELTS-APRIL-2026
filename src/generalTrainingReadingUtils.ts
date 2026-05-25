import type { ReadingExamRecord } from './readingJourney'
import { GENERAL_TRAINING_FULL_TEST_NUMBERS, formatGeneralTrainingTestLabel } from './generalTrainingReadingData'

export type GeneralTrainingSectionNumber = 1 | 2 | 3

const SECTION_PASSAGE_INDEXES: Record<GeneralTrainingSectionNumber, number[]> = {
  1: [0, 1],
  2: [2, 3],
  3: [4]
}

export const padGeneralTrainingTestNumber = (testNumber: number) =>
  testNumber >= 10 ? String(testNumber).padStart(3, '0') : String(testNumber).padStart(2, '0')

export const getGeneralTrainingSectionExamId = (section: GeneralTrainingSectionNumber, testNumber: number) =>
  `gt-reading-s${section}-test${padGeneralTrainingTestNumber(testNumber)}`

export const getGeneralTrainingFullTestExamId = (testNumber: number) =>
  `gt-reading-full-test${padGeneralTrainingTestNumber(testNumber)}`

export const resolveGeneralTrainingExamMeta = (
  exam: Pick<ReadingExamRecord, 'id' | 'gtKind' | 'gtSection' | 'gtTestNumber'>
) => {
  if (exam.gtKind && exam.gtTestNumber) {
    return {
      gtKind: exam.gtKind,
      gtSection: exam.gtSection,
      gtTestNumber: exam.gtTestNumber
    }
  }
  const id = String(exam.id || '')
  const sectionMatch = id.match(/^gt-reading-s([123])-test(\d+)/i)
  if (sectionMatch) {
    return {
      gtKind: 'section' as const,
      gtSection: Number(sectionMatch[1]),
      gtTestNumber: Number(sectionMatch[2])
    }
  }
  const fullMatch = id.match(/^gt-reading-full-test(\d+)/i)
  if (fullMatch) {
    return {
      gtKind: 'full' as const,
      gtSection: undefined,
      gtTestNumber: Number(fullMatch[1])
    }
  }
  return {
    gtKind: exam.gtKind,
    gtSection: exam.gtSection,
    gtTestNumber: exam.gtTestNumber
  }
}

const splitGeneralTrainingRawPassageBlocks = (rawPassageText: string) => {
  const text = String(rawPassageText || '').trim()
  if (!text) return []
  const markers = [...text.matchAll(/(?=READING PASSAGE \d+)/gi)]
  if (!markers.length) return [text]
  return markers.map((match, index) => {
    const start = match.index ?? 0
    const end = markers[index + 1]?.index ?? text.length
    return text.slice(start, end).trim()
  })
}

const sliceGeneralTrainingRawPassageText = (rawPassageText: string, passageIndexes: number[]) => {
  const blocks = splitGeneralTrainingRawPassageBlocks(rawPassageText)
  return passageIndexes
    .map((index, passageIndex) => {
      const block = blocks[index]
      if (!block) return ''
      return block.replace(/READING PASSAGE \d+/i, `READING PASSAGE ${passageIndex + 1}`)
    })
    .filter(Boolean)
    .join('\n\n')
}

const sliceGeneralTrainingRawAnswerKey = (rawAnswerKey: string, questionNumbers: number[]) => {
  const allowed = new Set(questionNumbers)
  return String(rawAnswerKey || '')
    .split(/(?=Question \d+:)/i)
    .map((block) => block.trim())
    .filter(Boolean)
    .filter((block) => {
      const match = block.match(/^Question (\d+):/i)
      return match ? allowed.has(Number(match[1])) : false
    })
    .join('\n\n')
}

export const buildGeneralTrainingSectionExam = (
  fullExam: ReadingExamRecord,
  section: GeneralTrainingSectionNumber
): ReadingExamRecord | null => {
  const meta = resolveGeneralTrainingExamMeta(fullExam)
  if (meta.gtKind !== 'full' || !meta.gtTestNumber) return null

  const sourcePassages = fullExam.parsedPayload?.passages || []
  const passages = SECTION_PASSAGE_INDEXES[section]
    .map((index, passageIndex) => {
      const passage = sourcePassages[index]
      if (!passage) return null
      return {
        ...passage,
        number: passageIndex + 1
      }
    })
    .filter(Boolean) as ReadingExamRecord['parsedPayload']['passages']

  if (!passages.length) return null

  const questionCount = passages.reduce((total, passage) => total + (passage.questions?.length || 0), 0)
  const questionNumbers = passages.flatMap((passage) => (passage.questions || []).map((question) => question.number))
  const testLabel = formatGeneralTrainingTestLabel(meta.gtTestNumber)

  return {
    ...fullExam,
    id: getGeneralTrainingSectionExamId(section, meta.gtTestNumber),
    title: `${testLabel} — Section ${section}`,
    gtKind: 'section',
    gtSection: section,
    gtTestNumber: meta.gtTestNumber,
    rawPassageText: sliceGeneralTrainingRawPassageText(fullExam.rawPassageText, SECTION_PASSAGE_INDEXES[section]),
    rawAnswerKey: sliceGeneralTrainingRawAnswerKey(fullExam.rawAnswerKey, questionNumbers),
    parsedPayload: {
      ...fullExam.parsedPayload,
      title: `${testLabel} — Section ${section}`,
      passages,
      questionCount
    }
  }
}

export const buildGeneralTrainingSectionExamCatalog = (
  fullExams: ReadingExamRecord[],
  section: GeneralTrainingSectionNumber
) =>
  GENERAL_TRAINING_FULL_TEST_NUMBERS.map((testNumber) => {
    const fullExam = fullExams.find((exam) => resolveGeneralTrainingExamMeta(exam).gtTestNumber === testNumber)
    if (!fullExam) return null
    const sectionExam = buildGeneralTrainingSectionExam(fullExam, section)
    if (!sectionExam) return null
    return {
      id: sectionExam.id,
      title: sectionExam.title,
      questionCount: sectionExam.parsedPayload?.questionCount || 0,
      passageCount: sectionExam.parsedPayload?.passages?.length || 0,
      gtTestNumber: testNumber,
      gtSection: section
    }
  }).filter(Boolean) as Array<{
    id: string
    title: string
    questionCount: number
    passageCount: number
    gtTestNumber: number
    gtSection: GeneralTrainingSectionNumber
  }>

export const buildAllGeneralTrainingSectionExams = (fullExams: ReadingExamRecord[]) => {
  const derived: ReadingExamRecord[] = []
  for (const testNumber of GENERAL_TRAINING_FULL_TEST_NUMBERS) {
    const fullExam = fullExams.find((exam) => resolveGeneralTrainingExamMeta(exam).gtTestNumber === testNumber)
    if (!fullExam) continue
    for (const section of [1, 2, 3] as GeneralTrainingSectionNumber[]) {
      const sectionExam = buildGeneralTrainingSectionExam(fullExam, section)
      if (sectionExam) derived.push(sectionExam)
    }
  }
  return derived
}
