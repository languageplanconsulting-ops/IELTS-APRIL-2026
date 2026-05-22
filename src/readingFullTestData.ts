import {
  mergeExamsIntoFullReadingExam,
  type ReadingExamRecord
} from './readingJourney'

export type ReadingFullTestSpec = {
  id: string
  bookNumber: number
  testNumber: number
  title: string
  subtitle: string
}

export const READING_FULL_TEST_BOOKS = [11, 12, 13, 14, 15, 16, 17, 19] as const

export type ReadingFullTestBook = (typeof READING_FULL_TEST_BOOKS)[number]

export const FULL_READING_TESTS_PER_BOOK = 4

export const TOTAL_FULL_READING_TESTS = READING_FULL_TEST_BOOKS.length * FULL_READING_TESTS_PER_BOOK

export const READING_FULL_TEST_LABEL = 'Full Exam'
export const READING_FULL_TEST_LEAD =
  'สอบเต็ม Reading จาก Cambridge — 3 passages · 40 ข้อ เหมือนข้อสอบ IELTS Academic จริง'

export const READING_FULL_TEST_DETAIL_TH =
  'Full Exam คือการทำข้อสอบ Reading Academic แบบเต็มชุดจากหนังสือ Cambridge IELTS (เล่ม 11–17, 19) แต่ละเล่มมี 4 tests (Test 1–4) รวม 3 passages และ 40 ข้อต่อ test ในรูปแบบเดียวกับข้อสอบ IELTS Academic Reading จริง แนะนำให้นักเรียนที่ต้องการฝึกด้วยข้อสอบ official จาก Cambridge ใช้โหมดนี้เพื่อจำลองวันสอบจริงให้ใกล้เคียงที่สุด'

export const READING_FULL_TEST_CATALOG_SUMMARY = `${TOTAL_FULL_READING_TESTS} tests · ${FULL_READING_TESTS_PER_BOOK} per book · Cambridge 11–17, 19`

export const QUESTIONS_PER_FULL_READING_TEST = 40

export const getReadingPassageExamId = (bookNumber: number, testNumber: number, passageNumber: number) =>
  `cambridge-${bookNumber}-test${testNumber}-passage${passageNumber}`

export const getReadingFullTestExamId = (bookNumber: number, testNumber: number) =>
  `reading-full-test-cam${bookNumber}-test${testNumber}`

export const READING_FULL_TEST_SPECS: ReadingFullTestSpec[] = READING_FULL_TEST_BOOKS.flatMap(
  (bookNumber) =>
    Array.from({ length: FULL_READING_TESTS_PER_BOOK }, (_, index) => index + 1).map((testNumber) => ({
      id: getReadingFullTestExamId(bookNumber, testNumber),
      bookNumber,
      testNumber,
      title: `Cambridge ${bookNumber} · Test ${testNumber}`,
      subtitle: '40 questions · 3 passages · full exam flow'
    }))
)

export const getReadingFullTestSpecsForBook = (bookNumber: number): ReadingFullTestSpec[] =>
  READING_FULL_TEST_SPECS.filter((spec) => spec.bookNumber === bookNumber)

export const groupFullReadingTestsByBook = (): Array<{ book: ReadingFullTestBook; tests: ReadingFullTestSpec[] }> =>
  READING_FULL_TEST_BOOKS.map((book) => ({
    book,
    tests: getReadingFullTestSpecsForBook(book)
  }))

export const resolveReadingPassageExams = (
  bookNumber: number,
  testNumber: number,
  exams: ReadingExamRecord[]
): [ReadingExamRecord, ReadingExamRecord, ReadingExamRecord] | null => {
  const passageExams = [1, 2, 3].map((passageNumber) =>
    exams.find((exam) => exam.id === getReadingPassageExamId(bookNumber, testNumber, passageNumber))
  )
  if (passageExams.some((exam) => !exam)) return null
  return passageExams as [ReadingExamRecord, ReadingExamRecord, ReadingExamRecord]
}

export const isFullReadingTestComplete = (
  bookNumber: number,
  testNumber: number,
  exams: ReadingExamRecord[]
): boolean => {
  const trio = resolveReadingPassageExams(bookNumber, testNumber, exams)
  if (!trio) return false
  return Boolean(mergeExamsIntoFullReadingExam(trio))
}

export const buildReadingFullTestExam = (
  spec: ReadingFullTestSpec,
  exams: ReadingExamRecord[]
): ReadingExamRecord | null => {
  const trio = resolveReadingPassageExams(spec.bookNumber, spec.testNumber, exams)
  if (!trio) return null

  const merged = mergeExamsIntoFullReadingExam(trio)
  if (!merged) return null

  return {
    ...merged,
    id: spec.id,
    title: spec.title,
    category: 'normal',
    collectionTitle: 'Cambridge Full Reading',
    parsedPayload: {
      ...merged.parsedPayload,
      title: spec.title,
      collectionTitle: 'Cambridge Full Reading'
    }
  }
}

export const countFullReadingTestsAvailable = (exams: ReadingExamRecord[]): number =>
  READING_FULL_TEST_SPECS.filter((spec) => isFullReadingTestComplete(spec.bookNumber, spec.testNumber, exams)).length

export const validateFullReadingTestCatalog = (
  exams: ReadingExamRecord[]
): { ok: boolean; errors: string[] } => {
  const errors: string[] = []

  if (READING_FULL_TEST_SPECS.length !== TOTAL_FULL_READING_TESTS) {
    errors.push(`Expected ${TOTAL_FULL_READING_TESTS} test specs, got ${READING_FULL_TEST_SPECS.length}`)
  }

  for (const book of READING_FULL_TEST_BOOKS) {
    const specs = getReadingFullTestSpecsForBook(book)
    if (specs.length !== FULL_READING_TESTS_PER_BOOK) {
      errors.push(`Cambridge ${book}: expected ${FULL_READING_TESTS_PER_BOOK} tests, got ${specs.length}`)
    }
    for (const spec of specs) {
      if (!isFullReadingTestComplete(spec.bookNumber, spec.testNumber, exams)) {
        errors.push(`cam${spec.bookNumber}-test${spec.testNumber}: missing one or more passages (need 3)`)
        continue
      }
      const fullExam = buildReadingFullTestExam(spec, exams)
      const questionCount = fullExam?.parsedPayload?.questionCount || 0
      if (questionCount !== QUESTIONS_PER_FULL_READING_TEST) {
        errors.push(`cam${spec.bookNumber}-test${spec.testNumber}: expected 40 questions, got ${questionCount}`)
      }
    }
  }

  return { ok: errors.length === 0, errors }
}

export const isReadingFullTestExamId = (examId: string) =>
  String(examId || '').startsWith('reading-full-test-cam')
