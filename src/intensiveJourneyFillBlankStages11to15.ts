import type { NewFillBlankSet, NewFillBlankQuestion } from './readingNewFillBlankQuestions.ts'
import { INTENSIVE_SOLUTIONS_BY_STAGE } from './intensiveJourneyQuestionSolutions.ts'

const fillQuestion = (
  stage: number,
  slot: 1 | 2,
  number: number,
  answer: string,
  exactPortion: string,
  acceptedAnswers?: string[]
): NewFillBlankQuestion => {
  const solution = INTENSIVE_SOLUTIONS_BY_STAGE[stage]?.[slot]?.[number]
  return {
    number,
    answer,
    acceptedAnswers: acceptedAnswers || [],
    passageKeyword: solution?.passageKeyword || answer,
    questionKeyword: solution?.questionKeyword || answer,
    thaiMeaning: solution?.thaiMeaning || answer,
    exactPortion
  }
}

const fillSet = (
  stage: number,
  passageNumber: 1 | 2,
  startNumber: number,
  endNumber: number,
  title: string,
  sourceParagraphs: [string, string],
  summaryLines: NewFillBlankSet['summaryLines'],
  questions: NewFillBlankQuestion[]
): NewFillBlankSet => ({
  examId: `journey-normal-stage-${stage}`,
  passageNumber,
  startNumber,
  endNumber,
  sourceParagraphs,
  instructions: [
    `Questions ${startNumber}–${endNumber}`,
    'Complete the summary below.',
    'Choose ONE WORD ONLY from the passage for each answer.',
    `Write your answers in boxes ${startNumber}–${endNumber} on your answer sheet.`
  ],
  summaryTitle: title,
  summaryLines,
  questions
})

export const INTENSIVE_JOURNEY_FILL_BLANK_STAGES_11_15: NewFillBlankSet[] = [
  fillSet(11, 1, 5, 8, 'Carbon storage in permafrost', ['B', 'B'], [
    { type: 'para', text: 'Ancient carbon in frozen ground comes from organic {5} of long-dead life forms.' },
    { type: 'bullet', text: 'These materials built up in permafrost {6} over millennia.' },
    { type: 'bullet', text: 'Scientists estimate roughly 1,500 billion {7} of carbon — about twice what is in the {8} today.' }
  ], [
    fillQuestion(11, 1, 5, 'remains', 'organic remains of plants, animals and microorganisms'),
    fillQuestion(11, 1, 6, 'soils', 'accumulated in permafrost soils over millennia'),
    fillQuestion(11, 1, 7, 'tonnes', 'approximately 1,500 billion tonnes of carbon'),
    fillQuestion(11, 1, 8, 'atmosphere', 'roughly twice the amount currently present in the atmosphere')
  ]),
  fillSet(11, 2, 18, 21, 'The causes of the urban heat island', ['B', 'B'], [
    { type: 'para', text: 'Cities trap heat because dark, impermeable {18} absorb solar radiation by day.' },
    { type: 'bullet', text: 'Without {19}, less moisture is drawn from soil to cool the air through leaves.' },
    { type: 'bullet', text: 'Buildings also release waste {20} from cooling and heating systems.' },
    { type: 'bullet', text: 'Dense urban areas trap extra {21} from air-conditioning and heating.' }
  ], [
    fillQuestion(11, 2, 18, 'surfaces', 'dark, impermeable surfaces — roads, car parks and rooftops'),
    fillQuestion(11, 2, 19, 'vegetation', 'The near-total absence of vegetation removes the cooling effect'),
    fillQuestion(11, 2, 20, 'moisture', 'plants draw moisture from the soil and release it through their leaves'),
    fillQuestion(11, 2, 21, 'heat', 'emit substantial quantities of waste heat')
  ]),
  fillSet(12, 1, 5, 8, 'The ecological role of kelp forests', ['B', 'B'], [
    { type: 'para', text: 'Towering fronds form a layered {5} sheltering fish, invertebrates and marine {6}.' },
    { type: 'bullet', text: 'They provide {7} grounds for commercially important species.' },
    { type: 'bullet', text: 'Dense kelp also absorbs {8} energy before it hits the shore.' }
  ], [
    fillQuestion(12, 1, 5, 'canopy', 'create a multi-layered canopy'),
    fillQuestion(12, 1, 6, 'mammals', 'marine mammals find shelter'),
    fillQuestion(12, 1, 7, 'nursery', 'nursery grounds for commercially important fish species'),
    fillQuestion(12, 1, 8, 'wave', 'absorbs wave energy before it reaches the coastline')
  ]),
  fillSet(12, 2, 18, 21, 'Why river sand is essential for construction', ['C', 'C'], [
    { type: 'para', text: 'Desert {18} are too rounded by {19} to bind in concrete.' },
    { type: 'bullet', text: 'Angular sand must come from {20}, but dredging now outpaces natural refill of sandy {21}.' }
  ], [
    fillQuestion(12, 2, 18, 'grains', 'has grains that have been smoothed and rounded by wind'),
    fillQuestion(12, 2, 19, 'wind', 'smoothed and rounded by wind'),
    fillQuestion(12, 2, 20, 'rivers', 'Rivers are therefore the primary source of construction sand globally'),
    fillQuestion(12, 2, 21, 'beds', 'rivers replenish their sandy beds')
  ]),
  fillSet(13, 1, 5, 8, 'The impact of light pollution on wildlife', ['B', 'B'], [
    { type: 'para', text: 'Many {5} navigate by moon and stars; {6} are often killed by artificial lights.' },
    { type: 'bullet', text: 'Falling insect {7} reduces prey for predators.' },
    { type: 'bullet', text: 'Bird {8} guided by stars is disrupted by misleading light cues.' }
  ], [
    fillQuestion(13, 1, 5, 'insects', 'Insects are among the organisms most severely affected'),
    fillQuestion(13, 1, 6, 'moths', 'moths in particular are fatally attracted to artificial light sources'),
    fillQuestion(13, 1, 7, 'populations', 'decline in insect populations'),
    fillQuestion(13, 1, 8, 'migration', 'The seasonal migration of birds')
  ])
]
