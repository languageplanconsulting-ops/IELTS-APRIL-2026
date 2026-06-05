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
  /** Renders a diagram/infographic from `diagramImage` on the parent set. */
  | { type: 'diagram' }
  /** Table column headers row — no blanks. */
  | { type: 'table-header'; cells: string[] }
  /** Table data row — cells may contain {N} blank placeholders. */
  | { type: 'table-row'; cells: string[] }

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
  /** Public URL path to an SVG/PNG diagram shown for label-the-diagram tasks. */
  diagramImage?: string
  diagramAlt?: string
  // Optional title above the summary (rendered as a heading, no bold).
  summaryTitle?: string
  // The summary body — mix of flowing paragraphs and bullet sentences.
  summaryLines: NewFillBlankSummaryLine[]
  // The 7 questions, ordered by their position in the passage.
  questions: NewFillBlankQuestion[]
}

// ────────────────────────────────────────────────────────────────────────────

import generatedSets from './generated/readingNewFillBlankSets.json'
import journeySets from './generated/journeyFillBlankSets.json'
import { INTENSIVE_JOURNEY_FILL_BLANK_SETS } from './intensiveJourneyFillBlankSets.ts'
import { paraphraseFillBlankSet } from './readingFillBlankParaphrase.ts'
import {
  fillBlankSetsOverlap,
  isLowQualityFillBlankSet
} from './readingFillBlankQuality.ts'

export const MANUAL_FILL_BLANK_SETS: NewFillBlankSet[] = [
  ...INTENSIVE_JOURNEY_FILL_BLANK_SETS,
  // ── 6 custom passages (Q5-8 fill-blank summary) ──

  {
    examId: 'custom-reading-beyond-petroleum',
    passageNumber: 1,
    startNumber: 5,
    endNumber: 8,
    sourceParagraphs: ['D', 'D'],
    instructions: [
      'Questions 5–8',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 5–8 on your answer sheet.'
    ],
    summaryTitle: 'Seaweed-based bioplastics',
    summaryLines: [
      {
        type: 'para',
        text: 'Seaweed is considered a particularly promising source material because, unlike crops such as maize, it does not require fresh {5} or agricultural land, and needs no {6} either.'
      },
      { type: 'bullet', text: 'Scientists have shown that seaweed can be turned into products including films and {7}.' },
      { type: 'bullet', text:
          'One company in Indonesia has gone further, creating packaging that is not only capable of natural breakdown but is also biodegradable {8}.' }
    ],
    questions: [
      {
        number: 5,
        answer: 'water',
        passageKeyword: 'requires no freshwater',
        questionKeyword: 'does not require fresh water',
        thaiMeaning: 'น้ำจืด',
        exactPortion: 'Unlike maize or sugarcane, seaweed requires no freshwater, no agricultural land and no fertilisers to grow.'
      },
      {
        number: 6,
        answer: 'fertilisers',
        passageKeyword: 'no fertilisers to grow',
        questionKeyword: 'needs no fertilisers',
        thaiMeaning: 'ปุ๋ย',
        exactPortion: 'Unlike maize or sugarcane, seaweed requires no freshwater, no agricultural land and no fertilisers to grow.'
      },
      {
        number: 7,
        answer: 'textiles',
        passageKeyword: 'processed into films, containers and even textiles',
        questionKeyword: 'turned into products including films and textiles',
        thaiMeaning: 'สิ่งทอ',
        exactPortion: 'seaweed-derived materials can be processed into films, containers and even textiles with properties comparable to conventional plastics.'
      },
      {
        number: 8,
        answer: 'edible',
        passageKeyword: 'not only biodegradable but edible',
        questionKeyword: 'not only biodegradable but also edible',
        thaiMeaning: 'กินได้ / รับประทานได้',
        exactPortion: 'The Indonesian company Evoware has developed seaweed-based food packaging that is not only biodegradable but edible.'
      }
    ]
  },
  {
    examId: 'custom-reading-vertical-farming',
    passageNumber: 1,
    startNumber: 5,
    endNumber: 8,
    sourceParagraphs: ['D', 'F'],
    instructions: [
      'Questions 5–8',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 5–8 on your answer sheet.'
    ],
    summaryTitle: 'The energy challenge of vertical farming',
    summaryLines: [
      {
        type: 'para',
        text: 'One of the main difficulties with vertical farming is the quantity of {5} it consumes. Crops are grown under artificial {6} rather than sunlight, which drives up power use considerably.'
      },
      { type: 'bullet', text: 'Scientists at Lancaster University found that producing lettuce in a vertical farm uses far more energy than growing it in a conventional {7}.' },
      { type: 'bullet', text: 'However, advances in {8} lighting technology are helping to reduce this problem.' }
    ],
    questions: [
      {
        number: 5,
        answer: 'energy',
        passageKeyword: 'enormous quantities of electricity / energy consumption',
        questionKeyword: 'quantity of energy it consumes',
        thaiMeaning: 'พลังงาน',
        exactPortion: 'these facilities require enormous quantities of electricity.'
      },
      {
        number: 6,
        answer: 'lighting',
        passageKeyword: 'Artificial lighting, calibrated to match the specific needs',
        questionKeyword: 'grown under artificial lighting',
        thaiMeaning: 'แสงไฟ / การให้แสง',
        exactPortion: 'Artificial lighting, calibrated to match the specific needs of each crop, replaces sunlight.'
      },
      {
        number: 7,
        answer: 'greenhouse',
        passageKeyword: 'compared to just one kilowatt-hour in a conventional greenhouse',
        questionKeyword: 'in a conventional greenhouse',
        thaiMeaning: 'เรือนกระจก',
        exactPortion: 'growing one kilogram of lettuce in a vertical farm consumes approximately 247 kilowatt-hours of energy, compared to just one kilowatt-hour in a conventional greenhouse.'
      },
      {
        number: 8,
        answer: 'LED',
        passageKeyword: 'increasingly efficient LED lighting',
        questionKeyword: 'advances in LED lighting technology',
        thaiMeaning: 'หลอด LED',
        exactPortion: 'The development of increasingly efficient LED lighting has significantly reduced the power demands of indoor farming over the past decade.'
      }
    ]
  },
  {
    examId: 'custom-reading-tidal-energy',
    passageNumber: 1,
    startNumber: 5,
    endNumber: 8,
    sourceParagraphs: ['B', 'D'],
    instructions: [
      'Questions 5–8',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 5–8 on your answer sheet.'
    ],
    summaryTitle: 'Tidal stream technology',
    summaryLines: [
      {
        type: 'para',
        text:
          'Tidal stream technology generates electricity by positioning {5} in areas of fast-moving ocean current. Unlike tidal range systems, it does not large {6} that obstruct the mouths of rivers, which makes it less damaging to surrounding environments.'
      },
      { type: 'bullet', text: 'However, it remains costly to install and maintain because the {7} conditions at sea cause rapid deterioration of components.' },
      { type: 'bullet', text: 'According to one expert, the cost per unit of electricity produced is currently several times higher than that of {8} wind power.' }
    ],
    questions: [
      {
        number: 5,
        answer: 'turbines',
        passageKeyword: 'places turbines directly in fast-moving tidal currents',
        questionKeyword: 'positioning turbines in fast-moving current',
        thaiMeaning: 'กังหัน',
        exactPortion: 'Tidal stream technology, by contrast, places turbines directly in fast-moving tidal currents, much like underwater wind turbines.'
      },
      {
        number: 6,
        answer: 'structures',
        passageKeyword: 'does not require large structures that block estuaries',
        questionKeyword: 'large structures that obstruct the mouths of rivers',
        thaiMeaning: 'สิ่งก่อสร้างขนาดใหญ่',
        exactPortion: 'tidal stream is generally considered more environmentally sensitive, as it does not require large structures that block estuaries and disrupt ecosystems.'
      },
      {
        number: 7,
        answer: 'corrosive',
        passageKeyword: 'the corrosive marine environment accelerates wear',
        questionKeyword: 'corrosive conditions at sea cause rapid deterioration',
        thaiMeaning: 'กัดกร่อน / ซึ่งกัดกร่อน',
        exactPortion: 'the corrosive marine environment accelerates wear on mechanical components.'
      },
      {
        number: 8,
        answer: 'onshore',
        passageKeyword: 'three to four times higher than that of onshore wind power',
        questionKeyword: 'higher than that of onshore wind power',
        thaiMeaning: 'บนบก / ภายในแผ่นดิน',
        exactPortion: 'the cost of tidal electricity remains three to four times higher than that of onshore wind power.'
      }
    ]
  },
  {
    examId: 'custom-reading-rewilding',
    passageNumber: 1,
    startNumber: 5,
    endNumber: 8,
    sourceParagraphs: ['B', 'B'],
    instructions: [
      'Questions 5–8',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 5–8 on your answer sheet.'
    ],
    summaryTitle: 'Wolves and the Yellowstone effect',
    summaryLines: [
      {
        type: 'para',
        text: 'The reintroduction of wolves to Yellowstone in 1995 is the most frequently cited example of a {5} cascade. When wolves hunted elk, the elk changed their {6} habits, which allowed plants to grow back in previously bare areas.'
      },
      { type: 'bullet', text: 'This in turn helped {7} along rivers to become more stable and encouraged the return of other species.' },
      { type: 'bullet', text: 'However, some scientists have {8} the extent of these changes.' }
    ],
    questions: [
      {
        number: 5,
        answer: 'trophic',
        passageKeyword: 'concept of trophic cascades',
        questionKeyword: 'trophic cascade',
        thaiMeaning: 'ห่วงโซ่อาหาร (trophic cascade)',
        exactPortion: 'The scientific foundation of rewilding rests on the concept of trophic cascades.'
      },
      {
        number: 6,
        answer: 'grazing',
        passageKeyword: 'wolf predation caused elk to avoid grazing in certain areas',
        questionKeyword: 'changed their grazing habits',
        thaiMeaning: 'การกินหญ้า / การหากิน',
        exactPortion: 'wolf predation caused elk to avoid grazing in certain areas, allowing vegetation to recover, riverbanks to stabilise and a range of other species to return.'
      },
      {
        number: 7,
        answer: 'riverbanks',
        passageKeyword: 'riverbanks to stabilise',
        questionKeyword: 'riverbanks along rivers to become more stable',
        thaiMeaning: 'ตลิ่ง / ฝั่งแม่น้ำ',
        exactPortion: 'wolf predation caused elk to avoid grazing in certain areas, allowing vegetation to recover, riverbanks to stabilise and a range of other species to return.'
      },
      {
        number: 8,
        answer: 'disputed',
        passageKeyword: 'some ecologists have disputed the scale of these effects',
        questionKeyword: 'scientists have disputed the extent of these changes',
        thaiMeaning: 'โต้แย้ง / ตั้งข้อสงสัย',
        exactPortion: 'Although some ecologists have disputed the scale of these effects, the Yellowstone case remains a central reference point for rewilding proponents.'
      }
    ]
  },
  {
    examId: 'custom-reading-mycelium',
    passageNumber: 1,
    startNumber: 5,
    endNumber: 8,
    sourceParagraphs: ['B', 'B'],
    instructions: [
      'Questions 5–8',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 5–8 on your answer sheet.'
    ],
    summaryTitle: 'How mycelium material is made',
    summaryLines: [
      {
        type: 'para',
        text: 'Mycelium grows naturally by spreading its fibres through organic material, which it binds together. Producers can adjust the final product\'s characteristics by controlling factors such as temperature and the {5} from which the mycelium feeds.'
      },
      { type: 'bullet', text: 'When the material has grown to the correct shape, {6} is applied to stop further growth.' },
      { type: 'bullet', text:
          'The result is a firm, dry product. At the end of its life, it can be placed in a {7} heap and will break down naturally a few weeks, returning entirely to the {8}.' }
    ],
    questions: [
      {
        number: 5,
        answer: 'substrate',
        passageKeyword: 'composition of the substrate',
        questionKeyword: 'the substrate from which the mycelium feeds',
        thaiMeaning: 'วัสดุรองพื้น / สารตั้งต้น',
        exactPortion: 'By controlling the growing conditions — temperature, humidity and the composition of the substrate — manufacturers can influence the density, rigidity and texture of the final material.'
      },
      {
        number: 6,
        answer: 'heat',
        passageKeyword: 'applying heat, which kills the mycelium',
        questionKeyword: 'heat is applied to stop further growth',
        thaiMeaning: 'ความร้อน',
        exactPortion: 'the growing process is halted by applying heat, which kills the mycelium and prevents further growth.'
      },
      {
        number: 7,
        answer: 'compost',
        passageKeyword: 'composted at the end of its useful life',
        questionKeyword: 'placed in a compost heap',
        thaiMeaning: 'ปุ๋ยหมัก / กองปุ๋ยหมัก',
        exactPortion: 'The result is a rigid, dry material that can be composted at the end of its useful life and returns completely to the soil within weeks.'
      },
      {
        number: 8,
        answer: 'soil',
        passageKeyword: 'returns completely to the soil within weeks',
        questionKeyword: 'returning entirely to the soil',
        thaiMeaning: 'ดิน',
        exactPortion: 'The result is a rigid, dry material that can be composted at the end of its useful life and returns completely to the soil within weeks.'
      }
    ]
  },
  {
    examId: 'custom-reading-desalination',
    passageNumber: 1,
    startNumber: 5,
    endNumber: 8,
    sourceParagraphs: ['B', 'B'],
    instructions: [
      'Questions 5–8',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 5–8 on your answer sheet.'
    ],
    summaryTitle: 'How reverse osmosis works',
    summaryLines: [
      {
        type: 'para',
        text: 'In reverse osmosis, seawater is pushed at high {5} through special {6} that separate fresh water from dissolved salt. The fresh water passes through and is collected, while the remaining liquid — a concentrated salt solution called {7} — is returned to the sea.'
      },
      {
        type: 'para',
        text: 'The process demands a great deal of energy, but improvements in both {8} technology and systems that recover energy have significantly reduced this requirement.'
      }
    ],
    questions: [
      {
        number: 5,
        answer: 'pressure',
        passageKeyword: 'forced at high pressure',
        questionKeyword: 'pushed at high pressure',
        thaiMeaning: 'แรงดัน',
        exactPortion: 'Seawater is forced at high pressure through semi-permeable membranes that allow water molecules to pass through while blocking dissolved salts and other contaminants.'
      },
      {
        number: 6,
        answer: 'membranes',
        passageKeyword: 'semi-permeable membranes',
        questionKeyword: 'special membranes that separate fresh water',
        thaiMeaning: 'เยื่อกรอง / เมมเบรน',
        exactPortion: 'Seawater is forced at high pressure through semi-permeable membranes that allow water molecules to pass through while blocking dissolved salts and other contaminants.'
      },
      {
        number: 7,
        answer: 'brine',
        passageKeyword: 'highly concentrated salt solution — known as brine',
        questionKeyword: 'concentrated salt solution called brine',
        thaiMeaning: 'น้ำเกลือเข้มข้น',
        exactPortion: 'the remaining highly concentrated salt solution — known as brine — is discharged.'
      },
      {
        number: 8,
        answer: 'membrane',
        passageKeyword: 'advances in membrane technology',
        questionKeyword: 'improvements in membrane technology',
        thaiMeaning: 'เมมเบรน / เยื่อกรอง',
        exactPortion: 'advances in membrane technology and energy recovery systems have reduced power consumption dramatically over the past two decades.'
      }
    ]
  }
]

export const NEW_FILL_BLANK_SETS: NewFillBlankSet[] = [
  ...MANUAL_FILL_BLANK_SETS,
  ...(generatedSets as NewFillBlankSet[]).filter(
    (set) =>
      !String(set.examId || '').startsWith('cambridge-') &&
      !MANUAL_FILL_BLANK_SETS.some((manual) => fillBlankSetsOverlap(manual, set)) &&
      !isLowQualityFillBlankSet(set)
  ),
  ...(journeySets as NewFillBlankSet[]).filter((set) => {
    const stageMatch = String(set.examId || '').match(/journey-normal-stage-(\d+)/)
    const stageNumber = stageMatch ? Number(stageMatch[1]) : 0
    if (stageNumber >= 1 && stageNumber <= 20) return false
    if (
      ['journey-normal-stage-20', 'journey-normal-stage-21', 'journey-normal-stage-22'].includes(set.examId) &&
      set.passageNumber <= 2
    ) {
      return false
    }
    if (MANUAL_FILL_BLANK_SETS.some((manual) => fillBlankSetsOverlap(manual, set))) return false
    return !isLowQualityFillBlankSet(set)
  })
]
  .map((set) => {
    // Intensive journey sets are hand-authored or generator-built — skip paraphrase
    // (paraphrase can garble diagram labels and trigger quality-filter false positives).
    if (String(set.examId || '').startsWith('journey-normal-stage-')) return set
    if (set.diagramImage) return set
    return paraphraseFillBlankSet(set)
  })
  .filter((set) => !isLowQualityFillBlankSet(set))

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
