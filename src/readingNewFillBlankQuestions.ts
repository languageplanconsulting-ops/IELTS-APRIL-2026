// Hand-authored replacement fill-blank question sets for Normal Reading.
//
// Each set is a summary-completion task over TWO CONSECUTIVE paragraphs of the
// passage. Always 7 questions. Answers are single words taken verbatim from
// the passage (preferring nouns). The surrounding sentence is fully
// paraphrased; only numbers and proper nouns are kept as in the source.
//
// At render time, when a fill-in-the-blank question group's number range is
// covered by a set here, the renderer ignores the existing parsed
// displayLines and renders this content instead.

export type NewFillBlankQuestion = {
  // Question number in the exam (matches the existing slot it replaces).
  number: number
  // The single-word answer, exactly as it appears in the passage.
  answer: string
  // Optional additional accepted spellings (rare — usually US/UK variants).
  acceptedAnswers?: string[]
  // The word/phrase in the passage that this paraphrases (for the answer-key
  // explanation rendered as "passage = question = Thai meaning").
  passageKeyword: string
  // The corresponding paraphrased word/phrase in the new summary text.
  questionKeyword: string
  // Thai translation of the passage keyword.
  thaiMeaning: string
  // Verbatim sentence(s) from the passage that prove the answer.
  exactPortion: string
}

// One line in the new summary. {N} placeholders mark blank positions and are
// replaced at render time with the inline blank input for question N.
export type NewFillBlankSummaryLine =
  | { type: 'para'; text: string }
  | { type: 'bullet'; text: string }
  | { type: 'heading'; text: string }

export type NewFillBlankSet = {
  examId: string
  passageNumber: number
  // Inclusive range of question numbers this set replaces.
  startNumber: number
  endNumber: number
  // Two consecutive paragraph letters this set covers, for the explanation
  // sidebar ("from paragraphs B and C").
  sourceParagraphs: [string, string]
  // Multi-line instruction block shown at the top of the question card.
  instructions: string[]
  // Optional title above the summary (rendered as a heading, no bold).
  summaryTitle?: string
  // The summary body — mix of flowing paragraphs and bullet sentences.
  summaryLines: NewFillBlankSummaryLine[]
  // The 7 questions, ordered by their position in the passage.
  questions: NewFillBlankQuestion[]
}

// ────────────────────────────────────────────────────────────────────────────

export const NEW_FILL_BLANK_SETS: NewFillBlankSet[] = [
  {
    examId: 'cambridge-11-test1-passage1',
    passageNumber: 1,
    startNumber: 1,
    endNumber: 7,
    sourceParagraphs: ['D', 'E'],
    instructions: [
      'Questions 1–7',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 1–7 on your answer sheet.'
    ],
    summaryTitle: 'Vertical farming: pros and cons',
    summaryLines: [
      {
        type: 'para',
        text:
          'Inside vertical farms, plants grow continuously throughout the {1} because conditions are kept ideal, removing the risk of weather damage. With nothing artificial added to the soil, produce can be raised entirely {2}, which also lowers the chance of catching certain {3} illnesses common in conventional agriculture.'
      },
      { type: 'bullet', text: 'Plant leftovers can be turned into {4}, allowing the building to send energy back to the grid.' },
      { type: 'bullet', text: 'The absence of farm vehicles brings down {5} fuel consumption.' },
      {
        type: 'para',
        text:
          'The most serious downside is the cost of {6} lighting. Because tall buildings receive very little daylight from above, providing the missing light is only realistic where {7} power is cheap.'
      }
    ],
    questions: [
      {
        number: 1,
        answer: 'year',
        passageKeyword: 'all year round',
        questionKeyword: 'throughout the year',
        thaiMeaning: 'ตลอดทั้งปี',
        exactPortion: 'crops would be produced all year round, as they would be kept in artificially controlled, optimum growing conditions'
      },
      {
        number: 2,
        answer: 'organically',
        passageKeyword: 'grown organically',
        questionKeyword: 'raised entirely organically',
        thaiMeaning: 'แบบออร์แกนิก / โดยไม่ใช้สารเคมี',
        exactPortion: 'All the food could be grown organically, eliminating the need for herbicides, pesticides and fertilisers'
      },
      {
        number: 3,
        answer: 'infectious',
        passageKeyword: 'infectious diseases',
        questionKeyword: 'infectious illnesses',
        thaiMeaning: 'โรคติดต่อ / โรคติดเชื้อ',
        exactPortion: 'The system would greatly reduce the incidence of many infectious diseases that are acquired at the agricultural interface'
      },
      {
        number: 4,
        answer: 'methane',
        passageKeyword: 'methane generation',
        questionKeyword: 'turned into methane',
        thaiMeaning: 'ก๊าซมีเทน',
        exactPortion: 'it would return energy to the grid via methane generation from composting non-edible parts of plants'
      },
      {
        number: 5,
        answer: 'fossil',
        passageKeyword: 'fossil fuel use',
        questionKeyword: 'fossil fuel consumption',
        thaiMeaning: 'เชื้อเพลิงฟอสซิล',
        exactPortion: 'It would also dramatically reduce fossil fuel use, by cutting out the need for tractors, ploughs and shipping'
      },
      {
        number: 6,
        answer: 'artificial',
        passageKeyword: 'artificial light',
        questionKeyword: 'artificial lighting',
        thaiMeaning: 'แสงประดิษฐ์ / แสงไฟ',
        exactPortion: 'A major drawback of vertical farming, however, is that the plants would require artificial light'
      },
      {
        number: 7,
        answer: 'renewable',
        passageKeyword: 'renewable energy',
        questionKeyword: 'renewable power',
        thaiMeaning: 'พลังงานหมุนเวียน / พลังงานทดแทน',
        exactPortion: 'Generating enough light could be prohibitively expensive, unless cheap, renewable energy is available'
      }
    ]
  }
]

// Lookup helper — find the set that covers a given question number.
export const findNewFillBlankSet = (
  examId: string,
  questionNumber: number
): NewFillBlankSet | null => {
  const set = NEW_FILL_BLANK_SETS.find(
    (item) =>
      item.examId === examId &&
      questionNumber >= item.startNumber &&
      questionNumber <= item.endNumber
  )
  return set || null
}

export const isQuestionInNewFillBlankSet = (examId: string, questionNumber: number) =>
  findNewFillBlankSet(examId, questionNumber) !== null

// Used by the answer-key/report view to look up a specific question's
// explanation when rendering its row.
export const findNewFillBlankQuestion = (examId: string, questionNumber: number) => {
  const set = findNewFillBlankSet(examId, questionNumber)
  if (!set) return null
  const question = set.questions.find((q) => q.number === questionNumber)
  return question ? { set, question } : null
}
