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
  /** Per-question MCQ options, e.g. "A It is difficult to predict …". */
  options?: string[]
}

export type IntensiveSectionKey =
  | 'matchingInfo'
  | 'fill'
  | 'matchingPeople'
  | 'headings'
  | 'mcq'
  | 'ynng'
  | 'tfng'

export type IntensivePassageLayout = {
  title: string
  paragraphs: Array<[string, string]>
  /** When false, passage body omits A/B/C paragraph labels (Cambridge unlettered passages). */
  paragraphLabels?: boolean
  sectionOrder?: IntensiveSectionKey[]
  matchingInfo?: { instruction: string; items: IntensiveQuestionSpec[] }
  fill?: {
    instruction: string
    summaryTitle?: string
    /** Lettered phrase bank for summary completion (e.g. A medical practitioners). */
    phraseOptions?: string[]
    /** Replaces default fill instruction lines when provided (verbatim Cambridge blocks). */
    sectionLines?: string[]
    items: IntensiveQuestionSpec[]
  }
  matchingPeople?: {
    instruction: string
    /** Defaults to "List of people". */
    listLabel?: string
    people: string[]
    items: IntensiveQuestionSpec[]
  }
  headings?: { instruction: string; options: string[]; items: IntensiveQuestionSpec[] }
  mcq?: { instruction: string; options?: string[]; items: IntensiveQuestionSpec[] }
  ynng?: { instruction: string; items: IntensiveQuestionSpec[] }
  tfng?: { instruction: string; items: IntensiveQuestionSpec[] }
}

const DEFAULT_SECTION_ORDER: IntensiveSectionKey[] = [
  'matchingInfo',
  'fill',
  'matchingPeople',
  'headings',
  'mcq',
  'ynng',
  'tfng'
]

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
      if (item.options?.length) sectionLines.push(...item.options)
      n += 1
    })
    ranges.push({ start, end: n - 1 })
  }

  const sectionOrder = layout.sectionOrder?.length ? layout.sectionOrder : DEFAULT_SECTION_ORDER

  for (const sectionKey of sectionOrder) {
    if (sectionKey === 'matchingInfo' && layout.matchingInfo?.items.length) {
      const items = layout.matchingInfo.items
      const startNum = n
      addSection(
        `Questions ${startNum}–${startNum + items.length - 1}`,
        layout.matchingInfo.instruction,
        ['Which section contains the following information? Write the correct letter, A–G.']
      )
      pushQuestions(items, {
        answerType: 'multiple-choice',
        answerGroup: layout.matchingInfo.instruction
      })
    }

    if (sectionKey === 'fill' && layout.fill?.items.length) {
      const items = layout.fill.items
      const startNum = n
      const phraseOptions = layout.fill.phraseOptions
      const defaultFillLines = phraseOptions?.length
        ? [...(layout.fill.summaryTitle ? [layout.fill.summaryTitle] : []), ...phraseOptions]
        : ['Choose ONE WORD ONLY from the passage for each answer.', ...(layout.fill.summaryTitle ? [layout.fill.summaryTitle] : [])]
      addSection(
        `Questions ${startNum}–${startNum + items.length - 1}`,
        layout.fill.instruction,
        layout.fill.sectionLines?.length ? layout.fill.sectionLines : defaultFillLines
      )
      pushQuestions(items, { answerType: 'text', answerGroup: layout.fill.instruction })
    }

    if (sectionKey === 'matchingPeople' && layout.matchingPeople?.items.length) {
      const mp = layout.matchingPeople
      const startNum = n
      addSection(`Questions ${startNum}–${startNum + mp.items.length - 1}`, mp.instruction, [
        mp.listLabel || 'List of people',
        ...mp.people
      ])
      pushQuestions(mp.items, {
        answerType: 'multiple-choice',
        answerGroup: mp.instruction
      })
    }

    if (sectionKey === 'headings' && layout.headings?.items.length) {
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

    if (sectionKey === 'mcq' && layout.mcq?.items.length) {
      const mcq = layout.mcq
      const startNum = n
      addSection(
        `Questions ${startNum}–${startNum + mcq.items.length - 1}`,
        mcq.instruction,
        mcq.options?.length ? mcq.options : []
      )
      pushQuestions(mcq.items, {
        answerType: 'multiple-choice',
        answerGroup: mcq.instruction
      })
    }

    if (sectionKey === 'ynng' && layout.ynng?.items.length) {
      const startNum = n
      addSection(
        `Questions ${startNum}–${startNum + layout.ynng.items.length - 1}`,
        layout.ynng.instruction,
        ['Write YES, NO or NOT GIVEN.']
      )
      pushQuestions(layout.ynng.items, {
        answerType: 'yes-no-not-given',
        answerGroup: layout.ynng.instruction,
        isYnng: true
      })
    }

    if (sectionKey === 'tfng' && layout.tfng?.items.length) {
      const startNum = n
      addSection(
        `Questions ${startNum}–${startNum + layout.tfng.items.length - 1}`,
        layout.tfng.instruction,
        ['Write TRUE, FALSE or NOT GIVEN.']
      )
      pushQuestions(layout.tfng.items, {
        answerType: 'true-false-not-given',
        answerGroup: layout.tfng.instruction
      })
    }
  }

  return {
    number: passageNumber,
    title: layout.title,
    bodyParagraphs:
      layout.paragraphLabels === false
        ? layout.paragraphs.map(([, text]) => text)
        : layout.paragraphs.map(([letter, text]) => `${letter} ${text}`),
    questionSectionText: sectionLines.join('\n').replace(/^\n+/, ''),
    questionRanges: ranges,
    questions
  }
}
