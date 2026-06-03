type BuiltQuestion = {
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

export type BuiltIntensivePassage = {
  number: number
  title: string
  bodyParagraphs: string[]
  questionSectionText: string
  questionRanges: Array<{ start: number; end: number }>
  questions: BuiltQuestion[]
}

export type IntensiveQuestionSpec = {
  prompt: string
  answer: string
  evidence: string
  acceptedAnswers?: string[]
  passageKeyword?: string
  questionKeyword?: string
  thaiMeaning?: string
}

export type IntensivePassageLayout = {
  title: string
  paragraphs: Array<[string, string]>
  matchingInfo?: { instruction: string; items: IntensiveQuestionSpec[] }
  fill?: { instruction: string; summaryTitle?: string; items: IntensiveQuestionSpec[] }
  matchingPeople?: { instruction: string; people: string[]; items: IntensiveQuestionSpec[] }
  headings?: { instruction: string; options: string[]; items: IntensiveQuestionSpec[] }
  mcq?: { instruction: string; items: IntensiveQuestionSpec[] }
  ynng?: { instruction: string; items: IntensiveQuestionSpec[] }
  tfng?: { instruction: string; items: IntensiveQuestionSpec[] }
}

const ROMAN = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x', 'xi', 'xii']

const solutionFields = (item: IntensiveQuestionSpec) => {
  const pk = item.passageKeyword || ''
  const qk = item.questionKeyword || ''
  const thai = item.thaiMeaning || ''
  if (pk && qk) {
    return {
      paraphrasedVocabulary: `${pk} = ${qk}`,
      explanationThai: thai ? `${pk} = ${qk} = ${thai}` : `${pk} = ${qk}`
    }
  }
  return { paraphrasedVocabulary: '', explanationThai: 'ดูข้อความอ้างอิงใน passage' }
}

export const buildIntensivePassage = (
  passageNumber: number,
  layout: IntensivePassageLayout
): BuiltIntensivePassage => {
  const questions: BuiltQuestion[] = []
  const sectionLines: string[] = []
  const ranges: Array<{ start: number; end: number }> = []
  let n = 1

  const addSection = (title: string, instruction: string, extraLines: string[] = []) => {
    sectionLines.push('', title, instruction, ...extraLines)
  }

  const pushQuestions = (
    items: IntensiveQuestionSpec[],
    opts: {
      answerType: BuiltQuestion['answerType']
      answerGroup: string
      isYnng?: boolean
    }
  ) => {
    const start = n
    items.forEach((item) => {
      const sol = solutionFields(item)
      questions.push({
        number: n,
        prompt: item.prompt,
        correctAnswer: item.answer,
        acceptedAnswers: item.acceptedAnswers || [],
        answerType: opts.answerType,
        answerGroup: opts.answerGroup,
        exactPortion: item.evidence,
        explanationThai: sol.explanationThai,
        paraphrasedVocabulary: sol.paraphrasedVocabulary
      })
      sectionLines.push(`${n}. ${item.prompt}`)
      n += 1
    })
    ranges.push({ start, end: n - 1 })
  }

  if (layout.matchingInfo?.items.length) {
    const items = layout.matchingInfo.items
    addSection(
      `Questions 1–${items.length}`,
      layout.matchingInfo.instruction,
      ['Which section contains the following information? Write the correct letter, A–G.']
    )
    pushQuestions(items, {
      answerType: 'multiple-choice',
      answerGroup: layout.matchingInfo.instruction
    })
  }

  if (layout.fill?.items.length) {
    const items = layout.fill.items
    const startNum = n
    addSection(
      `Questions ${startNum}–${startNum + items.length - 1}`,
      layout.fill.instruction,
      ['Choose ONE WORD ONLY from the passage for each answer.', ...(layout.fill.summaryTitle ? [layout.fill.summaryTitle] : [])]
    )
    pushQuestions(items, { answerType: 'text', answerGroup: layout.fill.instruction })
  }

  if (layout.matchingPeople?.items.length) {
    const mp = layout.matchingPeople
    const startNum = n
    addSection(`Questions ${startNum}–${startNum + mp.items.length - 1}`, mp.instruction, [
      'Match each statement with the correct person, A–D. You may use any letter more than once.',
      'List of people',
      ...mp.people
    ])
    pushQuestions(mp.items, {
      answerType: 'multiple-choice',
      answerGroup: mp.instruction
    })
  }

  if (layout.headings?.items.length) {
    const h = layout.headings
    const startNum = n
    addSection(`Questions ${startNum}–${startNum + h.items.length - 1}`, h.instruction, [
      'List of Headings',
      ...h.options.map((o, i) => `${ROMAN[i]}. ${o}`)
    ])
    pushQuestions(h.items, {
      answerType: 'multiple-choice',
      answerGroup: h.instruction
    })
  }

  if (layout.mcq?.items.length) {
    const mcq = layout.mcq
    const startNum = n
    addSection(`Questions ${startNum}–${startNum + mcq.items.length - 1}`, mcq.instruction)
    pushQuestions(mcq.items, {
      answerType: 'multiple-choice',
      answerGroup: mcq.instruction
    })
  }

  const judgement = layout.ynng || layout.tfng
  if (judgement?.items.length) {
    const startNum = n
    const isYnng = Boolean(layout.ynng)
    addSection(
      `Questions ${startNum}–${startNum + judgement.items.length - 1}`,
      judgement.instruction,
      isYnng ? ['Write YES, NO or NOT GIVEN.'] : ['Write TRUE, FALSE or NOT GIVEN.']
    )
    pushQuestions(judgement.items, {
      answerType: isYnng ? 'yes-no-not-given' : 'true-false-not-given',
      answerGroup: judgement.instruction,
      isYnng
    })
  }

  return {
    number: passageNumber,
    title: layout.title,
    bodyParagraphs: layout.paragraphs.map(([letter, text]) => `${letter} ${text}`),
    questionSectionText: sectionLines.join('\n').replace(/^\n+/, ''),
    questionRanges: ranges,
    questions
  }
}
