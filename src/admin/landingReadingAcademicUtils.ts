import type { ReadingExamRecord } from '../readingJourney'

export type LandingReadingMonthGroup = {
  id: string
  label: string
  subtitle: string
  freeExam: ReadingExamRecord | null
  lockedExams: ReadingExamRecord[]
}

const getReadingPassageSortValue = (exam: Pick<ReadingExamRecord, 'title' | 'parsedPayload' | 'createdAt'>) => {
  const titleMatch = String(exam.title || '').match(/Passage\s+(\d+)/i)
  if (titleMatch) return Number(titleMatch[1])
  const passageNumber = exam.parsedPayload?.passages?.[0]?.number
  return Number.isFinite(passageNumber) ? Number(passageNumber) : 99
}

const sortReadingExamsForMonthlyBank = (exams: ReadingExamRecord[]) =>
  [...exams].sort((first, second) => {
    const passageOrder = getReadingPassageSortValue(first) - getReadingPassageSortValue(second)
    if (passageOrder !== 0) return passageOrder
    return first.title.localeCompare(second.title) || Date.parse(first.createdAt || '') - Date.parse(second.createdAt || '')
  })

const slugifyMonthId = (title: string) =>
  String(title || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const buildLandingReadingMonths = (
  monthGroups: Array<{ title: string; displayTitle: string; exams: ReadingExamRecord[] }>
): LandingReadingMonthGroup[] =>
  monthGroups.map((group) => {
    const sorted = sortReadingExamsForMonthlyBank(group.exams)
    const freeExam = sorted.find((exam) => getReadingPassageSortValue(exam) === 1) || sorted[0] || null
    const lockedExams = sorted.filter((exam) => exam.id !== freeExam?.id)
    return {
      id: slugifyMonthId(group.title),
      label: group.displayTitle,
      subtitle:
        sorted.length > 0
          ? `${sorted.length} ชุด · Passage 1 ฟรีสำหรับผู้ใช้ทั่วไป`
          : 'ยังไม่มีชุดในเดือนนี้',
      freeExam,
      lockedExams
    }
  })

export const getLandingReadingExamMeta = (exam: ReadingExamRecord) => {
  const passage = exam.parsedPayload?.passages?.[0]
  const questionCount = exam.parsedPayload?.questionCount || passage?.questions?.length || 0
  const passageNumber = passage?.number || getReadingPassageSortValue(exam)
  const questionTypes = [...new Set((passage?.questions || []).map((question) => question.answerType))]
    .map((type) => {
      if (type === 'yes-no-not-given') return 'Yes / No / Not Given'
      if (type === 'true-false-not-given') return 'True / False / Not Given'
      if (type === 'multiple-choice') return 'Multiple choice'
      return 'Fill in the blanks'
    })
    .slice(0, 3)

  return {
    passageNumber,
    questionCount,
    questionTypes: questionTypes.length ? questionTypes : ['Reading questions'],
    duration: '~20 นาที'
  }
}
