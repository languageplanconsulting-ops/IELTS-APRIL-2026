import type { NewFillBlankSet } from './readingNewFillBlankQuestions.ts'

/** Fill-blank UI for Quest Log ด่าน 15 (Cambridge-style: P1 Q8–14, P2 Q25–27). */
export const INTENSIVE_JOURNEY_FILL_BLANK_STAGE_15: NewFillBlankSet[] = [
  {
    examId: 'journey-normal-stage-15',
    passageNumber: 1,
    startNumber: 8,
    endNumber: 14,
    sourceParagraphs: ['B', 'F'],
    instructions: [
      'Questions 8–14',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 8–14 on your answer sheet.'
    ],
    summaryTitle: 'How sleep supports health and memory',
    summaryLines: [
      { type: 'para', text: 'Sleep progresses through a series of roughly 90-minute {8}, each containing several distinct stages.' },
      { type: 'bullet', text: 'The deepest stage is particularly important for physical {9}, including immune function and growth hormone release.' },
      { type: 'bullet', text: 'During sleep, a key {10} region known as the hippocampus replays earlier experiences to move information into long-term storage.' },
      { type: 'bullet', text: 'Restricted sleep can impair the body\'s {11} system, making individuals more vulnerable to illness.' },
      { type: 'bullet', text: 'A network of channels in the brain flushes out {12} products that accumulate in neural tissue throughout the day.' },
      { type: 'bullet', text: 'Sleep timing is governed by the body\'s built-in biological {13}, which is disrupted by exposure to {14} from screens and other artificial sources in the evening.' }
    ],
    questions: [
      { number: 8, answer: 'cycles', passageKeyword: 'Sleep is organised into cycles of approximately 90 minutes', questionKeyword: '90-minute sleep cycles', thaiMeaning: 'รอบ / วงจร', exactPortion: 'Sleep is organised into cycles of approximately 90 minutes, each containing several distinct stages' },
      { number: 9, answer: 'repair', passageKeyword: 'the immune system carries out key repair functions', questionKeyword: 'physical repair', thaiMeaning: 'การซ่อมแซม', exactPortion: 'This deep stage is believed to be critical for physical restoration — growth hormone is released predominantly during slow-wave sleep, and the immune system carries out key repair functions' },
      { number: 10, answer: 'brain', passageKeyword: 'the hippocampus — the brain structure primarily responsible for forming new memories', questionKeyword: 'brain region (hippocampus)', thaiMeaning: 'สมอง', exactPortion: 'During sleep, the hippocampus — the brain structure primarily responsible for forming new memories — replays the neural activity patterns from experiences earlier in the day' },
      { number: 11, answer: 'immune', passageKeyword: 'Immune function is substantially impaired', questionKeyword: 'immune system', thaiMeaning: 'ภูมิคุ้มกัน', exactPortion: 'Immune function is substantially impaired: a landmark study found that people who slept fewer than five hours were four times more likely to develop a cold when exposed to the rhinovirus than those who slept more than seven hours' },
      { number: 12, answer: 'waste', passageKeyword: 'clearing metabolic waste products from neural tissue during sleep', questionKeyword: 'neural waste products', thaiMeaning: 'ของเสีย', exactPortion: 'The glymphatic system — a network of channels surrounding the brain\'s blood vessels — appears to play a critical role in clearing metabolic waste products from neural tissue during sleep' },
      { number: 13, answer: 'clock', passageKeyword: 'the internal biological clocks that regulate the timing of sleep and wakefulness', questionKeyword: 'built-in biological clock', thaiMeaning: 'นาฬิกาชีวภาพ', exactPortion: 'Circadian rhythms — the internal biological clocks that regulate the timing of sleep and wakefulness — are controlled by a cluster of neurons in the hypothalamus called the suprachiasmatic nucleus' },
      { number: 14, answer: 'light', passageKeyword: 'Exposure to artificial light — particularly the blue-wavelength light emitted by screens', questionKeyword: 'screen light (artificial light)', thaiMeaning: 'แสง', exactPortion: 'Exposure to artificial light — particularly the blue-wavelength light emitted by screens — suppresses the production of melatonin, the hormone that signals the onset of sleep, and can delay sleep timing by one to three hours' }
    ]
  },
  {
    examId: 'journey-normal-stage-15',
    passageNumber: 2,
    startNumber: 25,
    endNumber: 27,
    sourceParagraphs: ['B', 'G'],
    instructions: [
      'Questions 25–27',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 25–27 on your answer sheet.'
    ],
    summaryTitle: 'From variolation to modern vaccines',
    summaryLines: [
      { type: 'bullet', text: 'Vaccination uses a weakened form of a disease to build {25} before the recipient encounters a more dangerous version.' },
      { type: 'bullet', text: 'The procedure was named after the Latin word for the animal from which the first protective {26} was obtained.' },
      { type: 'bullet', text: 'mRNA vaccines during COVID-19 were deployed rapidly, but low-income countries received a disproportionately small share of available {27}.' }
    ],
    questions: [
      { number: 25, answer: 'protection', passageKeyword: 'provided protection against smallpox', questionKeyword: 'protection against disease', thaiMeaning: 'การป้องกัน', exactPortion: 'He had observed the popular belief among milkmaids that contracting cowpox — a mild infection acquired from cattle — provided protection against smallpox' },
      { number: 26, answer: 'material', passageKeyword: 'material from a cowpox pustule on the hand of a milkmaid', questionKeyword: 'cowpox material', thaiMeaning: 'สาร / วัสดุ', exactPortion: 'In 1796, he conducted his landmark experiment: he inoculated a healthy eight-year-old boy with material from a cowpox pustule on the hand of a milkmaid' },
      { number: 27, answer: 'doses', passageKeyword: 'receiving significantly fewer doses per capita than wealthier nations', questionKeyword: 'vaccine doses', thaiMeaning: 'โดส / ปริมาณยา', exactPortion: 'The pandemic also brought renewed attention to global inequalities in vaccine access, with low-income countries receiving significantly fewer doses per capita than wealthier nations, despite international initiatives designed to address the disparity' }
    ]
  }
]
