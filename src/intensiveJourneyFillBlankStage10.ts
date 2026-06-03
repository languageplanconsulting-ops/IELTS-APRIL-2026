import type { NewFillBlankSet } from './readingNewFillBlankQuestions.ts'

/** Fill-blank UI for Quest Log ด่าน 10 (Cambridge-style: P1 Q8–14, P2 Q25–27). */
export const INTENSIVE_JOURNEY_FILL_BLANK_STAGE_10: NewFillBlankSet[] = [
  {
    examId: 'journey-normal-stage-10',
    passageNumber: 1,
    startNumber: 8,
    endNumber: 14,
    sourceParagraphs: ['A', 'G'],
    instructions: [
      'Questions 8–14',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 8–14 on your answer sheet.'
    ],
    summaryTitle: 'Rewilding principles and case studies',
    summaryLines: [
      { type: 'para', text: 'Rewilding is based on the principle that removing human {8} from a landscape allows natural ecological processes to recover.' },
      { type: 'bullet', text: 'The theoretical foundation for many rewilding projects is the concept of trophic {9}, which describes knock-on changes throughout an entire food web when top predators are removed.' },
      { type: 'bullet', text: 'The Yellowstone example demonstrated how the presence of wolves altered the behaviour of {10}, allowing riverside vegetation to regenerate.' },
      { type: 'bullet', text: 'At the Knepp Estate in England, free-roaming {11} — including cattle, pigs, and ponies — have replaced managed livestock, leading to significant gains in species diversity.' },
      { type: 'bullet', text: 'In Devon, researchers found that {12} created by beavers helped reduce the impact of floods.' },
      { type: 'bullet', text: 'Achieving rewilding at a larger scale requires addressing the interests of {13}, foresters, landowners, and rural communities whose land and livelihoods may be affected.' },
      { type: 'bullet', text: 'Scientists stress that all rewilding projects must be accompanied by long-term {14} to evaluate whether interventions are producing the intended results.' }
    ],
    questions: [
      { number: 8, answer: 'management', passageKeyword: 'reducing human management', questionKeyword: 'human management', thaiMeaning: 'การจัดการโดยมนุษย์', exactPortion: 'reducing human management' },
      { number: 9, answer: 'cascades', passageKeyword: 'The concept of trophic cascades', questionKeyword: 'trophic cascades', thaiMeaning: 'การถ่ายทอดผลกระทบในโซ่อาหาร', exactPortion: 'The concept of trophic cascades underpins much rewilding theory' },
      { number: 10, answer: 'elk', passageKeyword: 'elk reduced their grazing pressure in areas where predation risk was high', questionKeyword: 'elk', thaiMeaning: 'กวางเอลก์', exactPortion: 'elk reduced their grazing pressure in areas where predation risk was high — particularly river valleys and steep slopes' },
      { number: 11, answer: 'herbivores', passageKeyword: 'the reintroduction of large herbivores rather than predators', questionKeyword: 'large herbivores', thaiMeaning: 'สัตว์กินพืชขนาดใหญ่', exactPortion: 'the reintroduction of large herbivores rather than predators' },
      { number: 12, answer: 'wetlands', passageKeyword: 'beaver-engineered wetlands reduced peak water flow during storms by up to 30 percent', questionKeyword: 'beaver-engineered wetlands', thaiMeaning: 'พื้นที่ชุ่มน้ำที่ beaver สร้าง', exactPortion: 'beaver-engineered wetlands reduced peak water flow during storms by up to 30 percent' },
      { number: 13, answer: 'farmers', passageKeyword: 'negotiating the interests of farmers, foresters, landowners, and rural communities', questionKeyword: 'farmers', thaiMeaning: 'เกษตรกร', exactPortion: 'negotiating the interests of farmers, foresters, landowners, and rural communities who depend on the landscape for their livelihoods' },
      { number: 14, answer: 'monitoring', passageKeyword: 'rigorous long-term monitoring', questionKeyword: 'long-term monitoring', thaiMeaning: 'การติดตามผลระยะยาว', exactPortion: 'rigorous long-term monitoring, adaptive management, and honest assessment of both successes and failures' }
    ]
  },
  {
    examId: 'journey-normal-stage-10',
    passageNumber: 2,
    startNumber: 25,
    endNumber: 27,
    sourceParagraphs: ['A', 'G'],
    instructions: [
      'Questions 25–27',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 25–27 on your answer sheet.'
    ],
    summaryTitle: 'Vaccination from early practice to modern deployment',
    summaryLines: [
      { type: 'bullet', text: 'The principle behind vaccination — using a weakened or related form of a disease agent to stimulate {25} — was applied long before the science of microbiology existed.' },
      { type: 'bullet', text: 'Edward Jenner named his procedure after the Latin word for {26}, the animal from which the protective material was obtained.' },
      { type: 'bullet', text: 'The development of mRNA vaccines during the COVID-19 pandemic demonstrated remarkable speed, though access was severely unequal, with low-income countries receiving significantly fewer {27} per capita than wealthier nations.' }
    ],
    questions: [
      { number: 25, answer: 'immunity', passageKeyword: 'induce mild infection and subsequent immunity', questionKeyword: 'immunity', thaiMeaning: 'ภูมิคุ้มกัน', exactPortion: 'induce mild infection and subsequent immunity long before any understanding of the germ theory of disease existed' },
      { number: 26, answer: 'cow', passageKeyword: 'vacca, meaning cow', questionKeyword: 'cow', thaiMeaning: 'วัว', exactPortion: 'He named the procedure vaccination, from the Latin vacca, meaning cow' },
      { number: 27, answer: 'doses', passageKeyword: 'receiving significantly fewer doses per capita than wealthier nations', questionKeyword: 'doses per capita', thaiMeaning: 'จำนวนโดสต่อหัว', exactPortion: 'low-income countries receiving significantly fewer doses per capita than wealthier nations' }
    ]
  }
]
