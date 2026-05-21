import { CAMBRIDGE_PART1_PROMPTS_BY_TEST } from './listeningPart1OfficialContent'

export type Part1FormLine =
  | { kind: 'heading'; text: string }
  | { kind: 'static'; text: string }
  | { kind: 'gap'; questionNumber: number; prefix: string; suffix: string }

export type Part1ExamForm = {
  title: string
  instruction: string
  wordLimit: string
  lines: Part1FormLine[]
}

const gapLine = (key: string, questionNumber: number): Part1FormLine => {
  const prompt = CAMBRIDGE_PART1_PROMPTS_BY_TEST[key]?.[String(questionNumber)] || `Question ${questionNumber}: ____`
  const blank = '____'
  const index = prompt.indexOf(blank)
  if (index < 0) {
    return { kind: 'gap', questionNumber, prefix: prompt, suffix: '' }
  }
  return {
    kind: 'gap',
    questionNumber,
    prefix: prompt.slice(0, index),
    suffix: prompt.slice(index + blank.length)
  }
}

const buildForm = (
  key: string,
  title: string,
  wordLimit: string,
  entries: Array<string | number>
): Part1ExamForm => ({
  title,
  instruction: 'Complete the notes below.',
  wordLimit,
  lines: entries.map((entry) => {
    if (typeof entry === 'number') return gapLine(key, entry)
    if (entry.startsWith('#')) return { kind: 'heading' as const, text: entry.slice(1) }
    return { kind: 'static' as const, text: entry }
  })
})

export const CAMBRIDGE_PART1_FORM_BY_TEST: Record<string, Part1ExamForm> = {
  '18-1': buildForm('18-1', 'Transport survey', 'Write ONE WORD AND/OR A NUMBER for each answer.', [
    'Name: Sadie Jones',
    'Year of birth: 1991',
    1,
    '#Travelling by bus',
    2,
    3,
    4,
    5,
    '#Complaints about bus service:',
    6,
    7,
    '#Travelling by car',
    8,
    '#Travelling by bicycle',
    9,
    10
  ]),
  '18-2': buildForm('18-2', "Working at Milo's Restaurants", 'Write ONE WORD ONLY for each answer.', [
    '#Benefits',
    1,
    2,
    3,
    '#Person specification',
    4,
    5,
    '#Questions 6–10',
    6,
    7,
    8,
    9,
    10
  ]),
  '18-3': buildForm('18-3', 'Wayside Camera Club membership form', 'Write ONE WORD AND/OR A NUMBER for each answer.', [
    'Email address: dan1068@market.com',
    1,
    2,
    3,
    4,
    '#Photography competitions',
    5,
    6,
    7,
    8,
    9,
    10
  ]),
  '18-4': buildForm('18-4', 'Job details from employment agency', 'Write ONE WORD AND/OR A NUMBER for each answer.', [
    1,
    'Location',
    2,
    3,
    '#Work involves',
    4,
    5,
    '#Requirements',
    6,
    7,
    '#Other information',
    8,
    9,
    10
  ]),
  '19-1': buildForm('19-1', 'Hinchingbrooke Country Park', 'Write ONE WORD AND/OR A NUMBER for each answer.', [
    '#The park',
    1,
    2,
    '#Subjects studied in educational visits include',
    3,
    4,
    5,
    6,
    '#Benefits of outdoor educational visits',
    7,
    8,
    '#Practical issues',
    9,
    10
  ]),
  '19-2': buildForm('19-2', 'Guitar Group', 'Write ONE WORD AND/OR A NUMBER for each answer.', [
    1,
    2,
    3,
    4,
    5,
    6,
    '#A typical 45-minute guitar lesson',
    7,
    8,
    9,
    10
  ]),
  '19-3': buildForm('19-3', 'Local food shops', 'Write ONE WORD AND/OR A NUMBER for each answer.', [
    '#Where to go',
    1,
    2,
    3,
    4,
    5,
    6,
    '#Shopping',
    7,
    8,
    9,
    10
  ]),
  '19-4': buildForm('19-4', 'First day at work', 'Write ONE WORD AND/OR A NUMBER for each answer.', [
    1,
    2,
    3,
    4,
    5,
    6,
    '#Responsibilities',
    7,
    8,
    9,
    10
  ]),
  '20-1': buildForm('20-1', 'Restaurant recommendations', 'Write ONE WORD AND/OR A NUMBER for each answer.', [
    '#The Junction',
    1,
    2,
    '#Paloma',
    3,
    4,
    '#The Audley',
    5,
    6,
    7,
    8,
    9,
    10
  ]),
  '20-2': buildForm('20-2', 'Carer support from local council', 'Write ONE WORD AND/OR A NUMBER for each answer.', [
    1,
    '#Assessment of mother\'s needs',
    2,
    3,
    4,
    5,
    6,
    7,
    '#Types of support that may be offered to carers',
    8,
    9,
    10
  ]),
  '20-3': buildForm('20-3', 'Furniture Rental Companies', 'Write ONE WORD AND/OR A NUMBER for each answer.', [
    '#Peak Rentals',
    1,
    2,
    3,
    '#Aaron and Oliver',
    4,
    5,
    '#Larch Furniture',
    6,
    7,
    '#Space Rentals',
    8,
    9,
    10
  ]),
  '20-4': buildForm('20-4', 'Advice on family visit', 'Write ONE WORD AND/OR A NUMBER for each answer.', [
    '#Accommodation',
    1,
    2,
    '#Recommended trips',
    3,
    4,
    '#Science Museum',
    5,
    6,
    '#Food',
    7,
    8,
    '#Theatre tickets',
    9,
    '#Free activities',
    10
  ])
}

export const part1FormKeyFromSetId = (setId: string) => {
  const match = setId.match(/cam(\d+)-test(\d+)/i)
  if (!match) return ''
  return `${match[1]}-${Number.parseInt(match[2], 10)}`
}
