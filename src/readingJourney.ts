import { INTENSIVE_PASSAGES_BY_STAGE } from './journeyIntensivePassages.ts'
import { INTENSIVE_LAYOUTS_STAGE_11_15 } from './journeyIntensivePassages11to15.ts'
import { INTENSIVE_LAYOUTS_STAGE_1_5 } from './journeyIntensivePassages1to5.ts'
import { INTENSIVE_LAYOUTS_STAGE_6 } from './journeyIntensivePassages6.ts'
import { INTENSIVE_LAYOUTS_STAGE_7_9 } from './journeyIntensivePassages7to9.ts'
import { INTENSIVE_LAYOUTS_STAGE_10 } from './journeyIntensivePassages10.ts'
import { buildIntensivePassage } from './intensivePassageBuilder.ts'
import {
  INTENSIVE_SOLUTIONS_BY_STAGE,
  applyIntensiveQuestionSolutions
} from './intensiveJourneyQuestionSolutions.ts'

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

export const JOURNEY_PASSAGES_PER_STAGE = 2
export const INTENSIVE_JOURNEY_STAGE_MAX = 15

export type ReadingJourneyStageDefinition = {
  stageNumber: number
  id: string
  title: string
  subtitle: string
  sourceExamIds: [string, string]
  intensive?: boolean
}

export type ReadingJourneyProgress = {
  unlockedThroughStage: number
  attempts: Record<string, { accuracy: number; completedAt: string }>
}

const QUESTION_START_BY_PASSAGE_SLOT = [1, 14] as const
/** Stages 1–5 use 14 questions on passage 1, so passage 2 starts at 15. */
const INTENSIVE_QUESTION_START_BY_STAGE: Record<number, readonly [number, number]> = {
  1: [1, 15],
  2: [1, 15],
  3: [1, 15],
  4: [1, 15],
  5: [1, 15],
  6: [1, 15],
  7: [1, 15],
  8: [1, 15],
  9: [1, 15],
  10: [1, 15]
}
const FULL_READING_QUESTION_START_BY_PASSAGE_SLOT = [1, 14, 27] as const

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
  if (passages.length !== JOURNEY_PASSAGES_PER_STAGE) return false

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

export const orderJourneySourceExams = (
  sourceExams: [ReadingExamRecord, ReadingExamRecord]
) =>
  [...sourceExams].sort(
    (first, second) => inferPassageSlot(first) - inferPassageSlot(second)
  ) as [ReadingExamRecord, ReadingExamRecord]

export const getJourneyPassageQuestionOffset = (
  sourcePassage: ReadingPassageRecord,
  slot: 1 | 2 | 3
) => {
  const targetStart = QUESTION_START_BY_PASSAGE_SLOT[slot - 1]
  const { min } = getQuestionNumberBounds(sourcePassage)
  return min > 0 ? targetStart - min : targetStart - 1
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

  result = result.replace(/^(\s*)(\d{1,2})\.\s+/gm, (match, indent, token) => {
    const value = Number(token)
    return value >= 1 && value <= 40 ? `${indent}${value + offset}. ` : match
  })

  return result
}

const remapQuestionPrompt = (prompt: string, originalNumber: number, nextNumber: number) => {
  let result = String(prompt || '').trim()
  if (!result || nextNumber === originalNumber) return result

  result = result.replace(
    new RegExp(`^${originalNumber}\\s*([.)])\\s*`),
    `${nextNumber}$1 `
  )
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

type CustomPassageInput = {
  title: string
  paragraphs: Array<[string, string]>
  fill: Array<{ prompt: string; answer: string; evidence: string; acceptedAnswers?: string[] }>
  judgement: Array<{ prompt: string; answer: 'TRUE' | 'FALSE' | 'NOT GIVEN'; evidence: string }>
  headings: {
    options: string[]
    questions: Array<{ prompt: string; answer: string; evidence: string }>
  }
}

const buildCustomQuestionSectionText = (input: CustomPassageInput) => [
  'Questions 1-5',
  'Choose ONE WORD ONLY from the passage for each answer.',
  ...input.fill.map((item, index) => `${index + 1}. ${item.prompt}`),
  '',
  'Questions 6-9',
  'Do the following statements agree with the information given? Write TRUE, FALSE, or NOT GIVEN.',
  ...input.judgement.map((item, index) => `${index + 6}. ${item.prompt}`),
  '',
  'Questions 10-13',
  'Match the correct heading (i-viii) to the paragraphs listed below.',
  'List of Headings',
  ...input.headings.options.map((option, index) => `${['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii'][index]}. ${option}`),
  ...input.headings.questions.map((item, index) => `${index + 10}. ${item.prompt}`)
].join('\n')

const makeCustomJourneyPassage = (number: number, input: CustomPassageInput): ReadingPassageRecord => {
  const fillQuestions = input.fill.map((item, index): ReadingQuestion => ({
    number: index + 1,
    prompt: item.prompt,
    correctAnswer: item.answer,
    acceptedAnswers: item.acceptedAnswers || [],
    answerType: 'text',
    answerGroup: 'Questions 1-5',
    exactPortion: item.evidence,
    explanationThai: 'คำตอบอยู่ในข้อความอ้างอิงที่ไฮไลต์ไว้',
    paraphrasedVocabulary: ''
  }))

  const judgementQuestions = input.judgement.map((item, index): ReadingQuestion => ({
    number: index + 6,
    prompt: item.prompt,
    correctAnswer: item.answer,
    acceptedAnswers: [],
    answerType: 'true-false-not-given',
    answerGroup: 'Questions 6-9',
    exactPortion: item.evidence,
    explanationThai: 'เทียบ statement กับข้อความอ้างอิงใน passage',
    paraphrasedVocabulary: ''
  }))

  const headingQuestions = input.headings.questions.map((item, index): ReadingQuestion => ({
    number: index + 10,
    prompt: item.prompt,
    correctAnswer: item.answer,
    acceptedAnswers: [],
    answerType: 'multiple-choice',
    answerGroup: 'Questions 10-13',
    exactPortion: item.evidence,
    explanationThai: 'heading สรุปใจความหลักของย่อหน้านี้',
    paraphrasedVocabulary: ''
  }))

  return {
    number,
    title: input.title,
    bodyParagraphs: input.paragraphs.map(([letter, text]) => `${letter} ${text}`),
    questionSectionText: buildCustomQuestionSectionText(input),
    questionRanges: [
      { start: 1, end: 5 },
      { start: 6, end: 9 },
      { start: 10, end: 13 }
    ],
    questions: [...fillQuestions, ...judgementQuestions, ...headingQuestions]
  }
}

const CUSTOM_JOURNEY_STAGE_PASSAGES: Record<number, Partial<Record<1 | 2, ReadingPassageRecord>>> = {
  20: {
    1: makeCustomJourneyPassage(1, {
      title: 'The Evolution of Wind Energy',
      paragraphs: [
        ['A', 'The human quest to harness natural forces for mechanical advantage dates back thousands of years. While early civilizations utilized water and animal power extensively, the manipulation of the wind required a deeper understanding of aerodynamics. The earliest recorded windmills were built in Persia around the 9th century. These vertical-axis machines were primarily used to process grain. Unlike the familiar structures seen in later European landscapes, the original Persian design, known as a panemone, was considerably different. It featured woven reed sails attached to a central vertical shaft, which caught the harsh local winds blowing across the arid plains. By automating the arduous task of grinding wheat and barley, these early mills provided a massive mechanical advantage to early agricultural societies, allowing populations to expand and labor to be redirected to other essential crafts.'],
        ['B', 'As the technology spread to Europe in the 12th century, builders introduced the post mill. Later, European inventors designed a new structure known as the tower. The post mill required the entire wooden body of the mill to be rotated manually to face the changing wind direction, a labor-intensive and structurally limiting design. The subsequent development of the tower mill solved this by housing the machinery in a fixed masonry structure, while only the cap on top rotated. This architectural shift allowed the sails to face the wind directly, drastically increasing functional efficiency. The sails themselves also evolved, transforming from simple cloth to complex wooden slats resembling modern Venetian blinds.'],
        ['C', 'The application of wind power soon expanded beyond basic food processing. The low-lying geography of the Netherlands presented a unique survival challenge, as large portions of the country rested below sea level. By the 14th century, Dutch engineers built massive windmills to pump water out of the lowlands. Using the rotational energy of the sails to turn large scoop wheels, they methodically moved water up and over dikes into nearby canals. Through this extensive drainage network, they successfully reclaimed thousands of acres of usable soil from the sea, expanding their habitable territories. This reclamation was instrumental in facilitating the Dutch Golden Age, providing new land for both intensive farming and urban expansion.'],
        ['D', 'However, the dominance of wind energy was ultimately challenged by the advent of new technological paradigms. During the 1800s, the industrial revolution introduced new machinery into the manufacturing sector, fundamentally altering how goods were produced. Factory owners implemented the power of steam to replace wind energy. Steam engines offered a level of reliability that the wind simply could not match. The newly invented engines were cheaper to maintain and did not rely on unpredictable weather conditions to operate. Consequently, traditional windmills were slowly abandoned, left to decay on the hillsides of Europe as coal-fired factories took over the industrial landscape.'],
        ['E', 'Despite this decline in Europe, wind power found a renewed purpose across the Atlantic in a vastly different geographical context. However, a revival occurred in the late 19th century when American farmers purchased millions of small wooden windmills. The expansion into the American West required a reliable source of water in a region notoriously prone to drought and lacking surface rivers. These vital, self-sustaining devices pumped groundwater for livestock across the dry western plains. Featuring multi-bladed rotors that could turn in even the slightest breeze, these iconic farmwindmills became a symbol of pioneer resilience and agricultural survival.'],
        ['F', 'Today, the urgency of climate change and the depletion of fossil fuels has brought wind energy back to the forefront of global engineering. Aerodynamic technology has evolved dramatically from the wooden sails of the past to massive fiberglass blades measuring hundreds of feet in length. Modern wind turbines generate electricity for millions of homes worldwide, marking a significant and essential transition toward contemporary power creation in the 21st century. Offshore wind farms now capture powerful ocean breezes, representing a multi-billion dollar industry that continues the ancient human tradition of capturing the invisible power of the wind.']
      ],
      fill: [
        { prompt: 'Initial machines in the 9th century were predominantly utilized to process ________.', answer: 'grain', evidence: 'These vertical-axis machines were primarily used to process grain.' },
        { prompt: 'The introduction of the ________ by European designers improved functional efficiency.', answer: 'tower', evidence: 'Later, European inventors designed a new structure known as the tower.' },
        { prompt: 'Engineers in the Netherlands used the technology to extract ________ from flooded areas.', answer: 'water', evidence: 'By the 14th century, Dutch engineers built massive windmills to pump water out of the lowlands.' },
        { prompt: 'In the 19th century, the implementation of ________ caused a decline in windmill usage.', answer: 'steam', evidence: 'Factory owners implemented the power of steam to replace wind energy.' },
        { prompt: 'Across the western plains, the technology was essential for providing hydration to ________.', answer: 'livestock', evidence: 'These vital, self-sustaining devices pumped groundwater for livestock across the dry western plains.' }
      ],
      judgement: [
        { prompt: 'The post mill was invented prior to the tower design.', answer: 'TRUE', evidence: 'As the technology spread to Europe in the 12th century, builders introduced the post mill. Later, European inventors designed a new structure known as the tower.' },
        { prompt: 'Dutch engineers built massive windmills to pump water out of the lowlands during the harsh winter months.', answer: 'NOT GIVEN', evidence: 'By the 14th century, Dutch engineers built massive windmills to pump water out of the lowlands.' },
        { prompt: 'Factory owners preferred windmills because their power output was highly predictable.', answer: 'FALSE', evidence: 'Steam engines offered a level of reliability that the wind simply could not match.' },
        { prompt: 'American farmers purchased millions of small wooden windmills easily.', answer: 'NOT GIVEN', evidence: 'However, a revival occurred in the late 19th century when American farmers purchased millions of small wooden windmills.' }
      ],
      headings: {
        options: ['Early agricultural crushing applications', 'Vertical-axis machines', 'The shift toward contemporary power creation', 'Massive windmills to pump water', 'Expanding habitable territories via drainage', 'The displacement of aerodynamic technology', 'Cheaper to maintain', 'Early agricultural grain applications in the Middle East'],
        questions: [
          { prompt: 'Paragraph F', answer: 'iii', evidence: 'Modern wind turbines generate electricity for millions of homes worldwide, marking a significant and essential transition toward contemporary power creation in the 21st century.' },
          { prompt: 'Paragraph A', answer: 'i', evidence: 'These vertical-axis machines were primarily used to process grain.' },
          { prompt: 'Paragraph D', answer: 'vi', evidence: 'Factory owners implemented the power of steam to replace wind energy.' },
          { prompt: 'Paragraph C', answer: 'v', evidence: 'Through this extensive drainage network, they successfully reclaimed thousands of acres of usable soil from the sea, expanding their habitable territories.' }
        ]
      }
    }),
    2: makeCustomJourneyPassage(2, {
      title: 'The Penicillin Breakthrough',
      paragraphs: [
        ['A', 'The history of medicine is filled with painstaking research, rigorous testing, and sometimes, sheer luck. Prior to the 20th century, even minor scratches or cuts could lead to fatal bacterial infections, as doctors had virtually no effective treatments against pathogens. In 1928, Alexander Fleming accidentally left a petri dish open in his laboratory. Upon returning, he discovered that a rare mold was destroying the surrounding staphylococcus bacteria. Fleming, a bacteriologist at St. Mary\'s Hospital in London, noticed a clear ring around the mold where the bacteria had been completely obliterated. This unintended event became a monumental moment in medical history, proving for the first time that an organic substance could inhibit bacterial growth.'],
        ['B', 'Identifying the antibacterial properties of the mold was only the first step; turning it into a usable drug proved to be incredibly difficult. Despite the discovery, Fleming could not stabilize the volatile substance. The active ingredient was highly fragile, easily degrading when exposed to heat or changes in acidity. A decade later, researchers Howard Florey and Ernst Chain developed a complex method of purification. Their dedicated laboratory work successfully converted the unstable fluid into a practical cure. Working out of Oxford University, Florey and Chain utilized innovative biochemical techniques, eventually managing to isolate a brown powder that retained its powerful antibacterial properties without deteriorating in the human body.'],
        ['C', 'The timing of this biochemical breakthrough could not have been more critical. World War II created an unprecedented, urgent need for medical treatments, as millions of soldiers were suffering from severe wound infections on the front lines. The British government, lacking the infrastructure for mass production, appealed to American pharmaceutical entities. Consequently, pharmaceutical companies built massive fermentation tanks to mass-produce the drug for wounded soldiers. By shifting from surface culture methods in small flasks to deep-tank fermentation utilizing aerated vats of corn steep liquor, production scaled up astronomically just in time for the D-Day landings in 1944.'],
        ['D', 'The impact of this newly available antibiotic on global health and military outcomes was profound. The widespread distribution of the medicine drastically decreased combat mortality rates. Infections that were previously lethal became easily curable, saving countless lives on the battlefield and altering military medicine forever. Soldiers who would have undoubtedly succumbed to gangrene or sepsis were suddenly recovering in a matter of days. Following the war, the drug was released for civilian use, effectively neutralizing historic killers like pneumonia, syphilis, and diphtheria, thereby increasing the average global life expectancy by several years.'],
        ['E', 'Unfortunately, the very success of this miracle drug planted the seeds for a modern medical dilemma. However, decades of overprescription have led to a severe new crisis. In both human medicine and agriculture, antibiotics were frequently misused to treat viral infections or promote livestock growth. Many dangerous pathogens have developed strong antibiotic resistance, rendering the original drug completely ineffective against certain modern diseases. Through natural selection, bacteria that survive antibiotic exposure pass on their resilient genetic traits, leading to the emergence of "superbugs" that currently threaten to push humanity back into a pre-antibiotic era.'],
        ['F', 'Recognizing the impending threat of antibiotic resistance, modern pharmacology is desperately seeking new solutions. Today, scientists are exploring deep marine environments and soil samples. They are actively searching for novel microscopic organisms to formulate the next generation of life-saving therapeutics. By venturing into extreme ecosystems, such as hydrothermal vents and isolated cave systems, researchers hope to discover entirely new classes of antimicrobial compounds, continuing the legacy of scientific curiosity that began with a serendipitous mold in a London laboratory nearly a century ago.']
      ],
      fill: [
        { prompt: 'Fleming noticed that a specific ________ was killing the nearby bacteria.', answer: 'mold', evidence: 'Upon returning, he discovered that a rare mold was destroying the surrounding staphylococcus bacteria.' },
        { prompt: 'Florey and Chain created a successful method of ________ to stabilize the medicine.', answer: 'purification', evidence: 'A decade later, researchers Howard Florey and Ernst Chain developed a complex method of purification.' },
        { prompt: 'During the war, factories utilized enormous ________ to manufacture the drug.', answer: 'tanks', evidence: 'Consequently, pharmaceutical companies built massive fermentation tanks to mass-produce the drug for wounded soldiers.' },
        { prompt: 'The widespread use of the medication lowered the number of wartime ________.', answer: 'fatalities', acceptedAnswers: ['mortality'], evidence: 'The widespread distribution of the medicine drastically decreased combat mortality rates.' },
        { prompt: 'Modern overuse has resulted in the dangerous phenomenon of antibiotic ________.', answer: 'resistance', evidence: 'Many dangerous pathogens have developed strong antibiotic resistance, rendering the original drug completely ineffective against certain modern diseases.' }
      ],
      judgement: [
        { prompt: 'Florey and Chain developed a complex method of purification faster than Fleming.', answer: 'NOT GIVEN', evidence: 'A decade later, researchers Howard Florey and Ernst Chain developed a complex method of purification.' },
        { prompt: 'Pharmaceutical companies built massive fermentation tanks to mass-produce the drug primarily in European territories.', answer: 'NOT GIVEN', evidence: 'Consequently, pharmaceutical companies built massive fermentation tanks to mass-produce the drug for wounded soldiers.' },
        { prompt: 'The introduction of the treatment completely eradicated all battlefield infections forever.', answer: 'FALSE', evidence: 'Infections that were previously lethal became easily curable, saving countless lives on the battlefield and altering military medicine forever.' },
        { prompt: 'Contemporary researchers are investigating the ocean to find raw materials for new treatments.', answer: 'TRUE', evidence: 'Today, scientists are exploring deep marine environments and soil samples.' }
      ],
      headings: {
        options: ['The unintended creation of a bacterial immunity crisis', 'Strong antibiotic resistance', 'An accidental laboratory revelation', 'A rare mold', 'Decreasing combat mortality rates', 'Saving countless lives', 'Transforming a volatile fluid into medication', 'Massive fermentation tanks'],
        questions: [
          { prompt: 'Paragraph E', answer: 'i', evidence: 'Unfortunately, the very success of this miracle drug planted the seeds for a modern medical dilemma.' },
          { prompt: 'Paragraph A', answer: 'iii', evidence: 'In 1928, Alexander Fleming accidentally left a petri dish open in his laboratory.' },
          { prompt: 'Paragraph D', answer: 'v', evidence: 'The widespread distribution of the medicine drastically decreased combat mortality rates.' },
          { prompt: 'Paragraph B', answer: 'vii', evidence: 'Their dedicated laboratory work successfully converted the unstable fluid into a practical cure.' }
        ]
      }
    })
  },
  21: {
    1: makeCustomJourneyPassage(1, {
      title: 'The Silk Road Network',
      paragraphs: [
        ['A', 'The history of globalized trade is often mistakenly thought of as a modern phenomenon, but its roots stretch back over two millennia. The vast trade network originated during the Han Dynasty in ancient China. Emperor Wu dispatched envoys to establish diplomatic relations, unintentionally creating a massive intercontinental commercial corridor across the landmass. Originally, the Emperor\'s primary goal was to secure military alliances against nomadic tribes to the north. However, when his envoy, Zhang Qian, returned with tales of sophisticated civilizations in Central Asia eager for Chinese goods, the foundation for a permanent, sprawling network of trade routes connecting the East and West was firmly laid.'],
        ['B', 'The logistics of moving goods across such immense and unforgiving landscapes dictated the nature of the commerce itself. Because transport was incredibly slow and expensive, it was rarely profitable to move cheap, heavy staples like grain or timber. Merchants primarily transported luxury items across the arid terrain. While silk was the most famous export, caravans also carried exotic spices, precious gems, and robust horses between the East and West. Roman elites coveted Chinese silk, while Chinese nobility desired the powerful "sweating horses" of the Fergana Valley and the fragrant spices native to the Indian subcontinent, creating a vibrant, multi-directional flow of wealth.'],
        ['C', 'As these valuable commodities moved from oasis to oasis, the merchants carrying them inadvertently became couriers of culture. Beyond physical goods, the route facilitated a profound ideological exchange. Missionaries and travelers shared various spiritual beliefs, allowing theological doctrines like Buddhism and Islam to spread rapidly across different civilizations. Monasteries and shrines sprang up along the routes, serving as safe havens and intellectual hubs for weary travelers. This cultural cross-pollination also extended to technological innovations, resulting in the westward transmission of papermaking, gunpowder, and the magnetic compass, fundamentally altering the trajectory of European history.'],
        ['D', 'Despite the immense profits to be made, the journey was never undertaken lightly. Traveling the route was fraught with extreme danger. Merchants faced harsh environmental conditions and were frequently attacked by ruthless bandits who targeted the wealthy caravans in isolated regions. The physical environment was a formidable adversary; traders had to navigate the blistering heat of the Taklamakan Desert and survive the freezing altitudes of the Pamir Mountains. To mitigate these risks, merchants rarely traveled the entire length of the road themselves, instead operating in a relay system where goods were traded from middleman to middleman at established outposts.'],
        ['E', 'For centuries, this overland network remained the primary artery of Eurasian commerce, but technological advancements eventually brought about its obsolescence. The overland routes eventually declined during the Age of Discovery. European explorers established faster maritime pathways, which were considerably cheaper and safer, leading to a shift toward nautical navigation. The advent of advanced shipbuilding and reliable sea navigation allowed nations like Portugal and Spain to bypass the middlemen of the Middle East entirely. Shipping goods via the ocean avoided the heavy tolls, banditry, and slow pace of overland caravans, rendering the ancient desert routes economically unviable.'],
        ['F', 'While the original Silk Road faded into historical memory for several centuries, the concept of a unified Eurasian economic corridor has recently experienced a powerful resurgence. In the 21st century, governments are attempting to revive the historical routes. Massive infrastructure projects are currently building modern railways and highways to reconstruct physical commerce links between nations. Initiatives like China\'s Belt and Road project aim to recreate the economic interconnectedness of the ancient past, utilizing high-speed rail and deep-water ports to once again bridge the vast geographic divides between Asia, Africa, and Europe.']
      ],
      fill: [
        { prompt: 'The Han Emperor originally sent diplomats to build ________ rather than trade routes.', answer: 'relations', evidence: 'Emperor Wu dispatched envoys to establish diplomatic relations, unintentionally creating a massive intercontinental commercial corridor across the landmass.' },
        { prompt: 'Alongside fabrics, traders moved valuable ________, gems, and animals across the regions.', answer: 'spices', evidence: 'While silk was the most famous export, caravans also carried exotic spices, precious gems, and robust horses between the East and West.' },
        { prompt: 'The pathways allowed for the widespread sharing of profound spiritual ________.', answer: 'beliefs', evidence: 'Missionaries and travelers shared various spiritual beliefs, allowing theological doctrines like Buddhism and Islam to spread rapidly across different civilizations.' },
        { prompt: 'Travelers in remote areas were constantly threatened by violent ________.', answer: 'bandits', evidence: 'Merchants faced harsh environmental conditions and were frequently attacked by ruthless bandits who targeted the wealthy caravans in isolated regions.' },
        { prompt: 'The historical overland routes lost their importance due to the establishment of new maritime ________.', answer: 'pathways', evidence: 'European explorers established faster maritime pathways, which were considerably cheaper and safer, leading to a shift toward nautical navigation.' }
      ],
      judgement: [
        { prompt: 'Merchants primarily transported luxury items across the arid terrain during the summer months.', answer: 'NOT GIVEN', evidence: 'Merchants primarily transported luxury items across the arid terrain.' },
        { prompt: 'The exchange of ideas along the route was strictly limited to religious teachings.', answer: 'FALSE', evidence: 'This cultural cross-pollination also extended to technological innovations, resulting in the westward transmission of papermaking, gunpowder, and the magnetic compass.' },
        { prompt: 'Merchants faced harsh environmental conditions and were frequently attacked by ruthless bandits who rode fast horses.', answer: 'NOT GIVEN', evidence: 'Merchants faced harsh environmental conditions and were frequently attacked by ruthless bandits who targeted the wealthy caravans in isolated regions.' },
        { prompt: 'Sea travel eventually proved to be a more economical option than land travel.', answer: 'TRUE', evidence: 'European explorers established faster maritime pathways, which were considerably cheaper and safer, leading to a shift toward nautical navigation.' }
      ],
      headings: {
        options: ['Contemporary efforts to reconstruct physical commerce links', 'Massive infrastructure projects', 'The diffusion of cultural and theological doctrines', 'Spiritual beliefs', 'The unintentional birth of an intercontinental corridor', 'Diplomatic relations', 'The shift toward nautical navigation', 'Establishing faster maritime pathways'],
        questions: [
          { prompt: 'Paragraph F', answer: 'i', evidence: 'Massive infrastructure projects are currently building modern railways and highways to reconstruct physical commerce links between nations.' },
          { prompt: 'Paragraph C', answer: 'iii', evidence: 'Missionaries and travelers shared various spiritual beliefs, allowing theological doctrines like Buddhism and Islam to spread rapidly across different civilizations.' },
          { prompt: 'Paragraph A', answer: 'v', evidence: 'Emperor Wu dispatched envoys to establish diplomatic relations, unintentionally creating a massive intercontinental commercial corridor across the landmass.' },
          { prompt: 'Paragraph E', answer: 'vii', evidence: 'European explorers established faster maritime pathways, which were considerably cheaper and safer, leading to a shift toward nautical navigation.' }
        ]
      }
    }),
    2: makeCustomJourneyPassage(2, {
      title: 'The Psychology of Color',
      paragraphs: [
        ['A', 'Human beings have long recognized that the visual world holds a deep sway over our emotional and spiritual states. Ancient civilizations intuitively understood the power of pigments. The early Egyptians ground minerals to create vibrant ochre and lapis lazuli, utilizing these vivid shades exclusively for royal ceremonies and divine representations. For these early societies, color was not merely a decorative element but a tangible manifestation of cosmic forces. Gold represented the eternal flesh of the sun god, while deep blue signified the life-giving waters of the Nile and the infinite nature of the night sky, demonstrating an early awareness of the profound psychological weight carried by specific hues.'],
        ['B', 'While the ancients revered color for its mystical properties, it wasn\'t until the 17th century that humanity began to understand the physical reality of how colors actually work. The scientific understanding of color began with Isaac Newton. By passing sunlight through a glass prism, he proved that white light actually consists of a continuous spectrum of distinct, measurable wavelengths. Prior to Newton\'s groundbreaking experiments, the prevailing belief was that color was a mixture of light and darkness. Newton definitively showed that color is entirely a function of light, laying the crucial groundwork for all subsequent studies in both modern optics and the psychological interpretation of visual stimuli.'],
        ['C', 'Building upon Newton\'s physical framework, modern science has delved deeper into how these specific wavelengths affect the human body. Today, psychologists study how different hues trigger biological reactions. Exposure to red stimulates the human nervous system, inherently raising the heart rate and conveying an immediate sense of urgency. This biological response is deeply rooted in our evolutionary history; red is the color of fire, blood, and poisonous insects. Consequently, when the human eye perceives this specific wavelength, the brain automatically initiates a mild fight-or-flight response, heightening alertness and preparing the body for potential physical exertion.'],
        ['D', 'Because these biological reactions are largely involuntary, they represent a highly effective tool for influencing public behavior. Corporate marketing teams heavily manipulate these psychological responses. Fast food chains frequently use warm tones in their logos to subconsciously stimulate appetite and encourage rapid customer turnover. The pervasive combination of red and yellow seen in numerous global restaurant franchises is not an accident. Red instills a sense of urgency and hunger, while yellow projects feelings of comfort and friendliness. Together, they create an environment that encourages customers to eat quickly and leave, thereby maximizing the establishment\'s daily profitability.'],
        ['E', 'However, it is vital to recognize that the interpretation of color is not exclusively a matter of biology; it is heavily mediated by social conditioning. However, color interpretation is heavily dependent on cultural background. While white represents purity and weddings in Western societies, it traditionally signifies mourning and death in many Eastern traditions. In China and parts of India, white is the color worn at funerals, symbolizing the pale nature of a ghost or the emptiness left behind by the deceased. This stark contrast highlights that while physiological responses to light wavelengths may be universal, the emotional meaning attached to those colors is entirely socially constructed.'],
        ['F', 'In recent years, the understanding of color psychology has moved beyond corporate marketing and into the realm of human wellbeing. Modern healthcare facilities are applying color therapy to improve patient outcomes. Hospitals often paint recovery rooms in soft blues and greens to naturally lower blood pressure and utilize pigments for medical recuperation. Research indicates that cool colors, which are abundant in natural environments like forests and oceans, promote the release of calming neurotransmitters. By purposefully designing medical spaces with these tranquil hues, administrators can reduce patient anxiety, decrease the need for pain medication, and significantly accelerate the overall healing process.']
      ],
      fill: [
        { prompt: 'Early Egyptian societies reserved bright pigments for sacred ________.', answer: 'ceremonies', evidence: 'The early Egyptians ground minerals to create vibrant ochre and lapis lazuli, utilizing these vivid shades exclusively for royal ceremonies and divine representations.' },
        { prompt: 'Newton demonstrated that light is composed of a ________ of different wavelengths.', answer: 'spectrum', evidence: 'By passing sunlight through a glass prism, he proved that white light actually consists of a continuous spectrum of distinct, measurable wavelengths.' },
        { prompt: 'Viewing the color red can cause an increase in a person\'s ________ rate.', answer: 'heart', evidence: 'Exposure to red stimulates the human nervous system, inherently raising the heart rate and conveying an immediate sense of urgency.' },
        { prompt: 'Restaurants utilize specific colors in their logos to increase customer ________.', answer: 'turnover', evidence: 'Fast food chains frequently use warm tones in their logos to subconsciously stimulate appetite and encourage rapid customer turnover.' },
        { prompt: 'In numerous Eastern traditions, the color white is associated with ________.', answer: 'mourning', evidence: 'While white represents purity and weddings in Western societies, it traditionally signifies mourning and death in many Eastern traditions.' }
      ],
      judgement: [
        { prompt: 'By passing sunlight through a glass prism, he proved that white light actually consists of a continuous spectrum of distinct, measurable wavelengths earlier than other scientists.', answer: 'NOT GIVEN', evidence: 'By passing sunlight through a glass prism, he proved that white light actually consists of a continuous spectrum of distinct, measurable wavelengths.' },
        { prompt: 'Psychological studies show that viewing the color red calms the human nervous system.', answer: 'FALSE', evidence: 'Exposure to red stimulates the human nervous system, inherently raising the heart rate and conveying an immediate sense of urgency.' },
        { prompt: 'Fast food chains frequently use warm tones in their logos to subconsciously stimulate appetite for unhealthy foods.', answer: 'NOT GIVEN', evidence: 'Fast food chains frequently use warm tones in their logos to subconsciously stimulate appetite and encourage rapid customer turnover.' },
        { prompt: 'Medical centers use specific visual shades to induce physical relaxation in patients.', answer: 'TRUE', evidence: 'Hospitals often paint recovery rooms in soft blues and greens to naturally lower blood pressure and utilize pigments for medical recuperation.' }
      ],
      headings: {
        options: ['Regional variations in symbolic meaning', 'Cultural background', 'The physics of illumination components', 'Glass prism', 'Utilizing pigments for medical recuperation', 'Soft blues and greens', 'Historical applications in regal and sacred contexts', 'Divine representations'],
        questions: [
          { prompt: 'Paragraph E', answer: 'i', evidence: 'While white represents purity and weddings in Western societies, it traditionally signifies mourning and death in many Eastern traditions.' },
          { prompt: 'Paragraph B', answer: 'iii', evidence: 'By passing sunlight through a glass prism, he proved that white light actually consists of a continuous spectrum of distinct, measurable wavelengths.' },
          { prompt: 'Paragraph F', answer: 'v', evidence: 'Hospitals often paint recovery rooms in soft blues and greens to naturally lower blood pressure and utilize pigments for medical recuperation.' },
          { prompt: 'Paragraph A', answer: 'vii', evidence: 'The early Egyptians ground minerals to create vibrant ochre and lapis lazuli, utilizing these vivid shades exclusively for royal ceremonies and divine representations.' }
        ]
      }
    })
  },
  22: {
    1: makeCustomJourneyPassage(1, {
      title: 'Evolution of the Calendar',
      paragraphs: [
        ['A', 'The ability to measure and predict the passage of time was one of the most vital prerequisites for the development of human civilization. The earliest systematic attempts to track time occurred in Mesopotamia. Ancient Sumerians observed the cycles of the moon, creating a strictly lunar calendar that required constant manual adjustments to align with the agricultural seasons. Because a purely lunar year is roughly 11 days shorter than the solar year, the Sumerian calendar would rapidly fall out of sync with the natural world. To prevent winter months from eventually drifting into the summer heat, priests had to routinely insert entirely new, temporary months into the year, a highly subjective and politically motivated process.'],
        ['B', 'While the lunar system was manageable for basic religious observances, it proved inadequate for managing complex agricultural empires that relied on predictable weather events. Realizing the flaws of lunar tracking, the Egyptians developed a solar alternative. By observing the annual helical rising of the star Sirius, they established a highly accurate 365-day year that perfectly matched the flooding of the Nile River. This reliable flooding was the absolute lifeblood of Egyptian agriculture, depositing nutrient-rich silt across the valleys. By abandoning the moon and aligning their timekeeping with the stars and the sun, the Egyptians created the first truly practical civic calendar.'],
        ['C', 'As empires grew and interacted, the chaotic use of hundreds of localized, conflicting calendars created massive administrative headaches. In Rome, Julius Caesar introduced a massive chronological reform. Advised by Alexandrian astronomers, he implemented the Julian calendar, which incorporated a leap year every four years to stabilize the shifting dates. By adding an extra day to February, the Julian system accounted for the fact that a true solar year is roughly 365.25 days long. This bold standardization eliminated the corruption of politicians adding days to extend their terms in office and provided a unified chronological framework for the entirety of the vast Roman Empire.'],
        ['D', 'However, even the brilliant astronomers of antiquity were constrained by the limitations of their rudimentary observational tools. Despite its brilliance, the Julian system miscalculated the solar year by exactly eleven minutes. By the 16th century, this tiny mathematical error had accumulated, prompting Pope Gregory XIII to introduce the Gregorian adjustment to fix the drifting equinoxes. The spring equinox, crucial for determining the date of Easter, had drifted ten days backward. The Pope\'s solution was dramatic: he simply deleted ten days from the month of October in 1582, and refined the leap year rule to skip three leap years every four centuries, creating the highly precise system we still use.'],
        ['E', 'While the Gregorian calendar solved astronomical inaccuracies, its irregular month lengths continued to frustrate modern economists and planners. During the 20th century, industrialists proposed heavily simplified global calendars. These radical concepts aimed to make every month identical in length to streamline complex international business and logistical scheduling. The most famous proposal, the International Fixed Calendar, divided the year into 13 equal months of exactly 28 days, plus one "Year Day" at the end. Advocates argued that this would make financial quarters perfectly equal and guarantee that dates always fell on the exact same day of the week, every single year.'],
        ['F', 'Despite the compelling logistical arguments and the backing of prominent businessmen like George Eastman of Kodak, humanity\'s attachment to tradition proved too strong to overcome. None of the modern alternative proposals gained universal traction. Today, the Gregorian framework remains the undisputed global standard, seamlessly synchronizing international trade, aviation, and digital communications. While it retains the quirky, irregular months inherited from Roman emperors, its universal adoption allows computers, satellites, and billions of human beings across distinct cultures to exist within a singular, shared timeline.']
      ],
      fill: [
        { prompt: 'Sumerian timekeeping required frequent ________ to match farming cycles.', answer: 'adjustments', evidence: 'Ancient Sumerians observed the cycles of the moon, creating a strictly lunar calendar that required constant manual adjustments to align with the agricultural seasons.' },
        { prompt: 'The Egyptian tracking system was designed to coincide with the ________ of a major river.', answer: 'flooding', evidence: 'By observing the annual helical rising of the star Sirius, they established a highly accurate 365-day year that perfectly matched the flooding of the Nile River.' },
        { prompt: 'Caesar\'s system included an extra ________ to keep dates consistent.', answer: 'year', evidence: 'Advised by Alexandrian astronomers, he implemented the Julian calendar, which incorporated a leap year every four years to stabilize the shifting dates.' },
        { prompt: 'The slight mathematical ________ in the Roman system eventually caused the seasons to drift.', answer: 'error', evidence: 'By the 16th century, this tiny mathematical error had accumulated, prompting Pope Gregory XIII to introduce the Gregorian adjustment to fix the drifting equinoxes.' },
        { prompt: 'In the modern era, the Gregorian system effectively coordinates global ________.', answer: 'trade', evidence: 'Today, the Gregorian framework remains the undisputed global standard, seamlessly synchronizing international trade, aviation, and digital communications.' }
      ],
      judgement: [
        { prompt: 'By observing the annual helical rising of the star Sirius, they established a highly accurate 365-day year without the use of telescopes.', answer: 'NOT GIVEN', evidence: 'By observing the annual helical rising of the star Sirius, they established a highly accurate 365-day year that perfectly matched the flooding of the Nile River.' },
        { prompt: 'Julius Caesar created his new chronological system without any external scientific assistance.', answer: 'FALSE', evidence: 'Advised by Alexandrian astronomers, he implemented the Julian calendar, which incorporated a leap year every four years to stabilize the shifting dates.' },
        { prompt: 'Pope Gregory XIII introduced the Gregorian adjustment to fix the drifting equinoxes during the winter.', answer: 'NOT GIVEN', evidence: 'By the 16th century, this tiny mathematical error had accumulated, prompting Pope Gregory XIII to introduce the Gregorian adjustment to fix the drifting equinoxes.' },
        { prompt: 'Corporate leaders wanted a unified calendar to make corporate planning and logistics easier.', answer: 'TRUE', evidence: 'These radical concepts aimed to make every month identical in length to streamline complex international business and logistical scheduling.' }
      ],
      headings: {
        options: ['The introduction of standardized quadrennial leap periods', 'Chronological reform', 'Radical suggestions for corporate efficiency', 'Global calendars', 'Initial timekeeping methods based on lunar observation', 'Ancient Sumerians', 'Transitioning to an astronomically aligned annual cycle', 'Mathematical error'],
        questions: [
          { prompt: 'Paragraph C', answer: 'i', evidence: 'Advised by Alexandrian astronomers, he implemented the Julian calendar, which incorporated a leap year every four years to stabilize the shifting dates.' },
          { prompt: 'Paragraph E', answer: 'iii', evidence: 'These radical concepts aimed to make every month identical in length to streamline complex international business and logistical scheduling.' },
          { prompt: 'Paragraph A', answer: 'v', evidence: 'Ancient Sumerians observed the cycles of the moon, creating a strictly lunar calendar that required constant manual adjustments to align with the agricultural seasons.' },
          { prompt: 'Paragraph B', answer: 'vii', evidence: 'By observing the annual helical rising of the star Sirius, they established a highly accurate 365-day year that perfectly matched the flooding of the Nile River.' }
        ]
      }
    }),
    2: makeCustomJourneyPassage(2, {
      title: 'Bioluminescence in Nature',
      paragraphs: [
        ['A', 'The natural world is full of visual wonders, but few phenomena are as mesmerizing as the ability of certain animals to create their own illumination. Bioluminescence is a remarkable biological phenomenon where living organisms produce actual visible light. This unique capability stems from a microscopic chemical reaction involving a specific molecule called luciferin, which emits photons when exposed to oxygen. Unlike a traditional incandescent light bulb, which wastes an enormous amount of energy by generating heat, this biological reaction creates "cold light." Nearly 100% of the energy expended during the oxidation of luciferin translates directly into light, making it one of the most highly efficient energy conversion processes found anywhere in the natural world.'],
        ['B', 'While examples of this glowing trait can be found in various ecosystems, it is largely a marine phenomenon. This glowing adaptation is overwhelmingly prevalent in the deep ocean. Many abyssal creatures, such as the infamous anglerfish, possess specialized glowing appendages that act as deceptive lures to attract unsuspecting prey in the pitch-black water. In environments thousands of feet beneath the surface, where sunlight cannot possibly penetrate, bioluminescence becomes the primary source of illumination. Carnivorous species utilize this light to mimic the appearance of small, edible prey, drawing curious fish directly into their massive, tooth-filled jaws before the victim even realizes it is being hunted.'],
        ['C', 'Despite its abundance in the dark ocean depths, the phenomenon is not entirely restricted to aquatic life. While mostly marine, the phenomenon also exists in terrestrial environments. Certain species of beetles, commonly known as fireflies, rely on precisely timed flashes of light in their abdomens to communicate and secure suitable breeding partners. During the warm summer months, male fireflies take to the air, emitting highly specific blinking patterns that act as a visual mating call. Females resting in the grass observe these patterns and flash a specific biological response if they accept the male, utilizing light as an intricate, silent language for the continuation of their species.'],
        ['D', 'However, finding food and finding a mate are only two parts of the survival equation in the wild; avoiding becoming a meal is equally important. Beyond attracting mates or prey, luminescence serves as a powerful defense mechanism. Several species of deep-sea squid can instantly eject a cloud of glowing mucus to temporarily blind their predators, employing light as an evasion tactic to escape. Much like how a shallow-water octopus uses black ink to obscure a predator\'s vision during the day, these deep-ocean cephalopods use a dazzling burst of bright light to overwhelm the sensitive eyes of their nocturnal attackers, providing just enough time to swim away into the surrounding darkness.'],
        ['E', 'In recent decades, the unique chemical proteins that govern this natural lighting have captured the intense interest of the scientific community. Scientists are currently harvesting these illuminating proteins for advanced medical research. Researchers attach these glowing markers to specific cancer cells, utilizing organic radiance for physiological observation to track the aggressive spread of tumors. By integrating the genetic code for bioluminescence into laboratory mice, oncologists can literally see the progression of disease and the effectiveness of experimental drug therapies in real-time beneath the skin, offering a non-invasive window into the incredibly complex cellular mechanics of the living body.'],
        ['F', 'Tragically, just as humanity is beginning to fully understand and harness the power of bioluminescence, human activity is threatening the very organisms that possess it. Unfortunately, widespread light pollution from coastal cities is severely disrupting these fragile organisms. The artificial glow from urban infrastructure heavily interferes with the natural signaling, leading to rapid population declines in numerous glowing species. For terrestrial insects like fireflies, the overwhelming brightness of streetlights makes it nearly impossible for males and females to see each other\'s mating flashes. If dark night skies are not preserved, we risk extinguishing one of the most magical and medically vital evolutionary adaptations on Earth.']
      ],
      fill: [
        { prompt: 'The production of biological light requires a molecule known as ________.', answer: 'luciferin', evidence: 'This unique capability stems from a microscopic chemical reaction involving a specific molecule called luciferin, which emits photons when exposed to oxygen.' },
        { prompt: 'Deep sea predators use bright bodily ________ to hunt in the dark.', answer: 'appendages', evidence: 'Many abyssal creatures, such as the infamous anglerfish, possess specialized glowing appendages that act as deceptive lures to attract unsuspecting prey in the pitch-black water.' },
        { prompt: 'Land-based insects utilize light flashes to find appropriate ________.', answer: 'partners', evidence: 'Certain species of beetles, commonly known as fireflies, rely on precisely timed flashes of light in their abdomens to communicate and secure suitable breeding partners.' },
        { prompt: 'Some marine animals release bright ________ to confuse their attackers.', answer: 'mucus', evidence: 'Several species of deep-sea squid can instantly eject a cloud of glowing mucus to temporarily blind their predators, employing light as an evasion tactic to escape.' },
        { prompt: 'Modern medicine uses the proteins to monitor the growth of ________.', answer: 'tumors', evidence: 'Researchers attach these glowing markers to specific cancer cells, utilizing organic radiance for physiological observation to track the aggressive spread of tumors.' }
      ],
      judgement: [
        { prompt: 'Many abyssal creatures, such as the infamous anglerfish, possess specialized glowing appendages that regenerate quickly if bitten off.', answer: 'NOT GIVEN', evidence: 'Many abyssal creatures, such as the infamous anglerfish, possess specialized glowing appendages that act as deceptive lures to attract unsuspecting prey in the pitch-black water.' },
        { prompt: 'Terrestrial glowing organisms use their light exclusively to hunt for food.', answer: 'FALSE', evidence: 'Certain species of beetles, commonly known as fireflies, rely on precisely timed flashes of light in their abdomens to communicate and secure suitable breeding partners.' },
        { prompt: 'Several species of deep-sea squid can instantly eject a cloud of glowing mucus to temporarily blind their predators in extremely cold waters.', answer: 'NOT GIVEN', evidence: 'Several species of deep-sea squid can instantly eject a cloud of glowing mucus to temporarily blind their predators, employing light as an evasion tactic to escape.' },
        { prompt: 'Human-made illumination is negatively impacting the survival rates of luminescent creatures.', answer: 'TRUE', evidence: 'The artificial glow from urban infrastructure heavily interferes with the natural signaling, leading to rapid population declines in numerous glowing species.' }
      ],
      headings: {
        options: ['Utilizing organic radiance for physiological observation', 'Advanced medical research', 'Employing light as an evasion tactic', 'Defense mechanism', 'The microscopic chemical mechanics of organic light', 'Visible light', 'The destructive impact of man-made illumination', 'Rapid population declines'],
        questions: [
          { prompt: 'Paragraph E', answer: 'i', evidence: 'Researchers attach these glowing markers to specific cancer cells, utilizing organic radiance for physiological observation to track the aggressive spread of tumors.' },
          { prompt: 'Paragraph D', answer: 'iii', evidence: 'Several species of deep-sea squid can instantly eject a cloud of glowing mucus to temporarily blind their predators, employing light as an evasion tactic to escape.' },
          { prompt: 'Paragraph A', answer: 'v', evidence: 'This unique capability stems from a microscopic chemical reaction involving a specific molecule called luciferin, which emits photons when exposed to oxygen.' },
          { prompt: 'Paragraph F', answer: 'vii', evidence: 'The artificial glow from urban infrastructure heavily interferes with the natural signaling, leading to rapid population declines in numerous glowing species.' }
        ]
      }
    })
  }
}

const applyCustomJourneyPassageOverrides = (
  stageNumber: number,
  passages: ReadingPassageRecord[]
) => {
  const overrides = CUSTOM_JOURNEY_STAGE_PASSAGES[stageNumber]
  if (!overrides) return passages

  return passages.map((passage, index) => {
    const slot = (index + 1) as 1 | 2
    const override = overrides[slot]
    if (!override) return passage
    return remapPassageForSlot(override, slot, QUESTION_START_BY_PASSAGE_SLOT[slot - 1] - 1)
  })
}

const buildJourneyExamFromPassages = (
  stageNumber: number,
  typedPassages: ReadingPassageRecord[],
  options?: { skipRequirements?: boolean }
): ReadingExamRecord | null => {
  if (!options?.skipRequirements && !stageMeetsJourneyRequirements(typedPassages)) return null

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

export const buildIntensiveJourneyExam = (stageNumber: number): ReadingExamRecord | null => {
  const layouts =
    INTENSIVE_LAYOUTS_STAGE_1_5[stageNumber] ||
    INTENSIVE_LAYOUTS_STAGE_6[stageNumber] ||
    INTENSIVE_LAYOUTS_STAGE_7_9[stageNumber] ||
    INTENSIVE_LAYOUTS_STAGE_10[stageNumber] ||
    INTENSIVE_LAYOUTS_STAGE_11_15[stageNumber]
  const legacyPair = INTENSIVE_PASSAGES_BY_STAGE[stageNumber]
  if (!layouts && !legacyPair) return null

  const starts = INTENSIVE_QUESTION_START_BY_STAGE[stageNumber] || QUESTION_START_BY_PASSAGE_SLOT

  const passages = layouts
    ? layouts.map((layout, index) => {
        const slot = (index + 1) as 1 | 2
        const passage = buildIntensivePassage(slot, layout)
        applyIntensiveQuestionSolutions(passage, INTENSIVE_SOLUTIONS_BY_STAGE[stageNumber]?.[slot])
        return remapPassageForSlot(passage, slot, starts[slot - 1] - 1)
      })
    : legacyPair!.map((input, index) => {
        const slot = (index + 1) as 1 | 2
        const passage = makeCustomJourneyPassage(slot, input)
        applyIntensiveQuestionSolutions(passage, INTENSIVE_SOLUTIONS_BY_STAGE[stageNumber]?.[slot])
        return remapPassageForSlot(passage, slot, starts[slot - 1] - 1)
      })

  return buildJourneyExamFromPassages(stageNumber, passages, { skipRequirements: true })
}

export const mergeExamsIntoJourneyExam = (
  stageNumber: number,
  sourceExams: [ReadingExamRecord, ReadingExamRecord]
): ReadingExamRecord | null => {
  const ordered = orderJourneySourceExams(sourceExams)

  const passages = ordered.map((exam, index) => {
    const slot = (index + 1) as 1 | 2
    const sourcePassage = exam.parsedPayload?.passages?.[0]
    if (!sourcePassage) return null
    const targetStart = QUESTION_START_BY_PASSAGE_SLOT[slot - 1]
    const { min } = getQuestionNumberBounds(sourcePassage)
    const questionOffset = min > 0 ? targetStart - min : targetStart - 1
    return remapPassageForSlot(sourcePassage, slot, questionOffset)
  })

  if (passages.some((passage) => !passage)) return null
  const typedPassages = applyCustomJourneyPassageOverrides(stageNumber, passages as ReadingPassageRecord[])
  return buildJourneyExamFromPassages(stageNumber, typedPassages)
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
    const targetStart = FULL_READING_QUESTION_START_BY_PASSAGE_SLOT[slot - 1]
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

const buildStageDuo = (
  candidates: ReadingExamRecord[],
  stageNumber: number
): [ReadingExamRecord, ReadingExamRecord] | null => {
  if (candidates.length < 2) return null

  for (let firstIndex = 0; firstIndex < candidates.length; firstIndex += 1) {
    const usedIds = new Set<string>()
    const first = pickDistinctExam(candidates, stageNumber * 2 + firstIndex, usedIds, candidates)
    if (!first) continue
    usedIds.add(first.id)

    for (let secondIndex = 0; secondIndex < candidates.length; secondIndex += 1) {
      const second = pickDistinctExam(
        candidates,
        stageNumber * 3 + secondIndex + 1,
        usedIds,
        candidates
      )
      if (!second) continue
      if (mergeExamsIntoJourneyExam(stageNumber, [first, second])) {
        return [first, second]
      }
    }
  }

  return null
}

export const buildJourneyStageDefinitions = (
  poolExams: ReadingExamRecord[],
  minimumStages = 24
): ReadingJourneyStageDefinition[] => {
  const candidates = poolExams.filter(Boolean).filter(isReadingJourneySourceExam)
  if (!candidates.length) return []

  const maxStages = Math.max(
    minimumStages,
    Math.floor(candidates.length / JOURNEY_PASSAGES_PER_STAGE),
    Math.min(
      candidates.filter((exam) => passageHasFill(exam.parsedPayload.passages[0])).length,
      candidates.filter((exam) => passageHasJudgement(exam.parsedPayload.passages[0])).length,
      candidates.filter((exam) => passageHasMatching(exam.parsedPayload.passages[0])).length
    )
  )

  const stages: ReadingJourneyStageDefinition[] = []

  for (let index = 0; index < maxStages; index += 1) {
    const stageNumber = index + 1

    if (stageNumber <= INTENSIVE_JOURNEY_STAGE_MAX) {
      const merged = buildIntensiveJourneyExam(stageNumber)
      if (!merged) break
      stages.push({
        stageNumber,
        id: merged.id,
        title: `ด่าน ${stageNumber}`,
        subtitle: merged.parsedPayload.passages.map((passage) => passage.title).join(' · '),
        sourceExamIds: [
          `intensive-stage-${stageNumber}-passage-1`,
          `intensive-stage-${stageNumber}-passage-2`
        ],
        intensive: true
      })
      continue
    }

    const duo = buildStageDuo(candidates, stageNumber)
    if (!duo) break
    const merged = mergeExamsIntoJourneyExam(stageNumber, duo)
    if (!merged) continue
    stages.push({
      stageNumber,
      id: merged.id,
      title: `ด่าน ${stageNumber}`,
      subtitle: duo.map((exam) => exam.title).join(' · '),
      sourceExamIds: duo.map((exam) => exam.id) as [string, string]
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
      if (definition.intensive) {
        return buildIntensiveJourneyExam(definition.stageNumber)
      }
      const sources = definition.sourceExamIds
        .map((examId) => poolExams.find((exam) => exam.id === examId))
        .filter(Boolean) as ReadingExamRecord[]
      if (sources.length !== JOURNEY_PASSAGES_PER_STAGE) return null
      return mergeExamsIntoJourneyExam(
        definition.stageNumber,
        sources as [ReadingExamRecord, ReadingExamRecord]
      )
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
  const passageCount = passages.length || JOURNEY_PASSAGES_PER_STAGE
  return `${passageCount} passages · Fill ${totals.fill} · TFNG ${totals.tfng} · Y/N/NG ${totals.ynng} · ${matchingLabel}`
}
