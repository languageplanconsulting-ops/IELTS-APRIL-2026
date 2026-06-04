import type { NewFillBlankSet } from './readingNewFillBlankQuestions.ts'

/** Fill-blank UI for Quest Log ด่าน 12 (Cambridge-style: P1 Q8–14, P2 Q25–27). */
export const INTENSIVE_JOURNEY_FILL_BLANK_STAGE_12: NewFillBlankSet[] = [
  {
    examId: 'journey-normal-stage-12',
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
    summaryTitle: 'Causes and responses to antibiotic resistance',
    summaryLines: [
      { type: 'para', text: 'The spread of antibiotic resistance is driven by the evolutionary process of {8}, which allows bacteria carrying useful mutations to survive and reproduce.' },
      { type: 'bullet', text: 'One way bacteria resist drugs is by secreting {9} capable of dismantling antibiotic molecules before they can act.' },
      { type: 'bullet', text: 'A further route for spreading resistance is when bacteria pass {10} to other species that are completely unrelated to them.' },
      { type: 'bullet', text: 'In human medicine, antibiotics are frequently prescribed for {11} of viral origin — such as colds and flu — despite having no effect on them.' },
      { type: 'bullet', text: 'In agriculture, giving animals antibiotics to accelerate {12} rather than treat illness was banned in the European Union in 2006.' },
      { type: 'bullet', text: 'Hospitals have introduced formal {13} to ensure antibiotics are only prescribed when genuinely needed.' },
      { type: 'bullet', text: 'An experimental treatment that harnesses {14} to attack and eliminate targeted bacterial pathogens is currently being tested in clinical trials.' }
    ],
    questions: [
      { number: 8, answer: 'selection', passageKeyword: 'natural selection operating at extraordinary speed', questionKeyword: 'evolutionary selection process', thaiMeaning: 'การคัดเลือกโดยธรรมชาติ', exactPortion: 'The mechanism by which bacteria develop resistance is a product of natural selection operating at extraordinary speed' },
      { number: 9, answer: 'enzymes', passageKeyword: 'by producing enzymes that break down the drug', questionKeyword: 'drug-dismantling enzymes', thaiMeaning: 'เอนไซม์', exactPortion: 'by producing enzymes that break down the drug, by pumping the antibiotic out of their cells, or by altering the cellular target the drug was designed to attack' },
      { number: 10, answer: 'genes', passageKeyword: 'bacteria share resistance genes not only with their own offspring but with unrelated bacterial species', questionKeyword: 'resistance genes', thaiMeaning: 'ยีน', exactPortion: 'horizontal gene transfer, through which bacteria share resistance genes not only with their own offspring but with unrelated bacterial species' },
      { number: 11, answer: 'infections', passageKeyword: 'antibiotics are prescribed for viral infections — colds, influenza, and most sore throats', questionKeyword: 'infections of viral origin', thaiMeaning: 'การติดเชื้อ', exactPortion: 'antibiotics are prescribed for viral infections — colds, influenza, and most sore throats — against which they are entirely ineffective' },
      { number: 12, answer: 'growth', passageKeyword: 'antibiotics as growth promoters', questionKeyword: 'growth acceleration', thaiMeaning: 'การเจริญเติบโต', exactPortion: 'Livestock in many countries are given antibiotics not only to treat infection but as growth promoters' },
      { number: 13, answer: 'programmes', passageKeyword: 'Antibiotic stewardship programmes', questionKeyword: 'formal prescribing programmes', thaiMeaning: 'โปรแกรม', exactPortion: 'Antibiotic stewardship programmes — structured approaches to optimising the selection, dosage, and duration of antibiotic prescribing' },
      { number: 14, answer: 'viruses', passageKeyword: 'viruses that target specific bacteria are used to treat infections', questionKeyword: 'viruses used against bacteria (phage therapy)', thaiMeaning: 'ไวรัส', exactPortion: 'phage therapy — in which viruses that target specific bacteria are used to treat infections — are progressing through clinical trials' }
    ]
  },
  {
    examId: 'journey-normal-stage-12',
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
    summaryTitle: 'Ancient and modern Olympic history',
    summaryLines: [
      { type: 'bullet', text: 'The ancient Olympics were held every four years as part of a broader cycle of athletic {25} held across the Greek world, with athletes competing for symbolic prizes rather than financial reward.' },
      { type: 'bullet', text: 'The modern Games were revived through the efforts of a French educator who established a new administrative {26} in 1894 to oversee their organisation.' },
      { type: 'bullet', text: 'Concerns about the financial burden on host cities centre on the {27} of building infrastructure, which critics argue regularly exceed the amounts originally predicted.' }
    ],
    questions: [
      { number: 25, answer: 'games', passageKeyword: 'a broader cycle of Panhellenic games', questionKeyword: 'Greek athletic games', thaiMeaning: 'การแข่งขัน', exactPortion: 'formed part of a broader cycle of Panhellenic games that also included the Pythian, Isthmian, and Nemean Games' },
      { number: 26, answer: 'Committee', passageKeyword: 'The International Olympic Committee was established at that conference', questionKeyword: 'administrative committee', thaiMeaning: 'คณะกรรมการ', exactPortion: 'The International Olympic Committee was established at that conference with de Coubertin as its secretary-general' },
      { number: 27, answer: 'costs', passageKeyword: 'infrastructure costs that frequently exceed initial estimates', questionKeyword: 'infrastructure building costs', thaiMeaning: 'ค่าใช้จ่าย', exactPortion: 'burdening host city taxpayers with infrastructure costs that frequently exceed initial estimates' }
    ]
  }
]
