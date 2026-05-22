import type { ListeningFoundationSet } from './listeningFoundationData'
import { builderExamSetToFoundationSets } from './listeningFoundationFromBuilder'
import { CAMBRIDGE_16_SECTION_2_EXAM_SET } from './listeningBuilderCambridge16Section2'
import { CAMBRIDGE_17_FOUNDATION_ANSWER_OVERRIDES } from './listeningFoundationCambridge17Data'
import { LISTENING_FULL_TEST_GENERATED_SETS } from './listeningFullTestGeneratedSets'

export type ListeningFullTestSpec = {
  id: string
  bookNumber: number
  testNumber: number
  title: string
  subtitle: string
}

export const LISTENING_FULL_TEST_BOOKS = [15, 16, 17, 19, 20] as const

export type ListeningFullTestBook = (typeof LISTENING_FULL_TEST_BOOKS)[number]

/** Each Cambridge book has Tests 1–4 (one full 40-question exam each). */
export const FULL_TESTS_PER_BOOK = 4

/** Cambridge 15, 16, 17, 19, 20 → 5 books × 4 tests = 20 full listening exams. */
export const TOTAL_FULL_LISTENING_TESTS = LISTENING_FULL_TEST_BOOKS.length * FULL_TESTS_PER_BOOK

export const LISTENING_FULL_TEST_LABEL = 'Full Test'
export const LISTENING_FULL_TEST_LEAD =
  'Complete Cambridge listening tests section by section — 10 questions, audio, and audioscript per part, just like the real exam flow.'

export const LISTENING_FULL_TEST_CATALOG_SUMMARY = `${TOTAL_FULL_LISTENING_TESTS} tests · ${FULL_TESTS_PER_BOOK} per book · Cambridge 15–17, 19–20`

const CAMBRIDGE_16_SECTION_2_FOUNDATION_SETS = builderExamSetToFoundationSets(
  CAMBRIDGE_16_SECTION_2_EXAM_SET,
  'essential'
)

const generatedById = new Map(LISTENING_FULL_TEST_GENERATED_SETS.map((set) => [set.id, set]))

const cam16Section2ByTest = new Map(
  CAMBRIDGE_16_SECTION_2_FOUNDATION_SETS.map((set) => {
    const match = set.id.match(/test(\d+)$/)
    return [Number(match?.[1] || 0), set] as const
  })
)

export const LISTENING_FULL_TEST_SPECS: ListeningFullTestSpec[] = LISTENING_FULL_TEST_BOOKS.flatMap(
  (bookNumber) =>
    Array.from({ length: FULL_TESTS_PER_BOOK }, (_, index) => index + 1).map((testNumber) => ({
      id: `cam${bookNumber}-test${testNumber}`,
      bookNumber,
      testNumber,
      title: `Cambridge ${bookNumber} · Test ${testNumber}`,
      subtitle: '40 questions · 4 sections · section-by-section flow'
    }))
)

export const getFullTestSpecsForBook = (bookNumber: number): ListeningFullTestSpec[] =>
  LISTENING_FULL_TEST_SPECS.filter((spec) => spec.bookNumber === bookNumber)

export const groupFullTestsByBook = (): Array<{ book: ListeningFullTestBook; tests: ListeningFullTestSpec[] }> =>
  LISTENING_FULL_TEST_BOOKS.map((book) => ({
    book,
    tests: getFullTestSpecsForBook(book)
  }))

export const resolveFullTestSectionSet = (
  bookNumber: number,
  testNumber: number,
  sectionNumber: number
): ListeningFoundationSet | null => {
  if (bookNumber === 16 && sectionNumber === 2) {
    const builderSet = cam16Section2ByTest.get(testNumber)
    if (!builderSet) return null
    return {
      ...builderSet,
      id: `full-test-cam16-t${testNumber}-s2`,
      levelLabel: `Full Test · Cam 16 Test ${testNumber} · Section 2`,
      title: builderSet.title.replace(' Skill Drill', '')
    }
  }

  if (bookNumber === 17 && (sectionNumber === 2 || sectionNumber === 4)) {
    const generated = generatedById.get(`full-test-cam17-t${testNumber}-s${sectionNumber}`)
    if (generated) {
      return {
        ...generated,
        title: generated.title.replace(' Skill Drill', '')
      }
    }
  }

  return generatedById.get(`full-test-cam${bookNumber}-t${testNumber}-s${sectionNumber}`) ?? null
}

export const getFullTestSectionSets = (bookNumber: number, testNumber: number): ListeningFoundationSet[] =>
  [1, 2, 3, 4]
    .map((section) => resolveFullTestSectionSet(bookNumber, testNumber, section))
    .filter((set): set is ListeningFoundationSet => Boolean(set))

export const QUESTIONS_PER_FULL_LISTENING_TEST = 40

export const isFullTestComplete = (bookNumber: number, testNumber: number): boolean =>
  getFullTestSectionSets(bookNumber, testNumber).length === FULL_TESTS_PER_BOOK

export const countFullTestsAvailable = (): number =>
  LISTENING_FULL_TEST_SPECS.filter((spec) => isFullTestComplete(spec.bookNumber, spec.testNumber)).length

export const countFullTestQuestions = (bookNumber: number, testNumber: number): number =>
  getFullTestSectionSets(bookNumber, testNumber).reduce((total, set) => total + set.questions.length, 0)

/** Ensures catalog is 5 books × 4 tests × 40 questions. */
export const validateFullListeningTestCatalog = (): { ok: boolean; errors: string[] } => {
  const errors: string[] = []

  if (LISTENING_FULL_TEST_SPECS.length !== TOTAL_FULL_LISTENING_TESTS) {
    errors.push(`Expected ${TOTAL_FULL_LISTENING_TESTS} test specs, got ${LISTENING_FULL_TEST_SPECS.length}`)
  }

  for (const book of LISTENING_FULL_TEST_BOOKS) {
    const specs = getFullTestSpecsForBook(book)
    if (specs.length !== FULL_TESTS_PER_BOOK) {
      errors.push(`Cambridge ${book}: expected ${FULL_TESTS_PER_BOOK} tests, got ${specs.length}`)
    }
    for (const spec of specs) {
      if (!isFullTestComplete(spec.bookNumber, spec.testNumber)) {
        errors.push(`${spec.id}: missing one or more sections (need ${FULL_TESTS_PER_BOOK})`)
        continue
      }
      const questionTotal = countFullTestQuestions(spec.bookNumber, spec.testNumber)
      if (questionTotal !== QUESTIONS_PER_FULL_LISTENING_TEST) {
        errors.push(`${spec.id}: expected ${QUESTIONS_PER_FULL_LISTENING_TEST} questions, got ${questionTotal}`)
      }
    }
  }

  return { ok: errors.length === 0, errors }
}

/** Part 1 sections use answer-only grading (no evidence highlight). */
export const isFullTestAnswerOnlySection = (sectionNumber: number): boolean => sectionNumber === 1

export { CAMBRIDGE_17_FOUNDATION_ANSWER_OVERRIDES }
