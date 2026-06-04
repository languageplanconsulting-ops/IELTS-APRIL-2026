import type { NewFillBlankSet } from './readingNewFillBlankQuestions.ts'

/** Fill-blank UI for Quest Log ด่าน 11 (Cambridge-style: P1 Q8–14, P2 Q25–27). */
export const INTENSIVE_JOURNEY_FILL_BLANK_STAGE_11: NewFillBlankSet[] = [
  {
    examId: 'journey-normal-stage-11',
    passageNumber: 1,
    startNumber: 8,
    endNumber: 14,
    sourceParagraphs: ['A', 'F'],
    instructions: [
      'Questions 8–14',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 8–14 on your answer sheet.'
    ],
    summaryTitle: 'Evidence and theories of dark matter',
    summaryLines: [
      { type: 'para', text: 'Scientists believe the universe is dominated by a hidden type of {8} that emits no light and can only be detected through its gravitational influence on visible objects.' },
      { type: 'bullet', text: 'The first evidence came from Zwicky\'s study of a large {9} of galaxies, in which visible mass alone could not hold the group together.' },
      { type: 'bullet', text: 'Later research tracked how the orbital speed of stars changes with distance from their galactic centre, producing {10} that showed outer stars moving unexpectedly fast.' },
      { type: 'bullet', text: 'An additional line of evidence comes from the way {11} bends light around massive objects, revealing hidden mass concentrations.' },
      { type: 'bullet', text: 'The leading candidate for dark matter consists of a type of invisible {12} that almost never interact with ordinary matter.' },
      { type: 'bullet', text: 'An alternative theory proposes that the laws of {13} behave differently at very low accelerations, removing the need for invisible mass.' },
      { type: 'bullet', text: 'A key obstacle for this alternative is its inability to explain the Bullet {14}, where visible and gravitational mass appear in different locations.' }
    ],
    questions: [
      { number: 8, answer: 'matter', passageKeyword: 'dark matter, which exerts gravitational effects on visible matter', questionKeyword: 'hidden type of matter (dark matter)', thaiMeaning: 'สสารมืด', exactPortion: 'dark matter, which exerts gravitational effects on visible matter without emitting, absorbing, or reflecting any form of light or radiation' },
      { number: 9, answer: 'cluster', passageKeyword: 'galaxies within the Coma cluster', questionKeyword: 'galaxy cluster', thaiMeaning: 'กลุ่มกาแล็กซี', exactPortion: 'who measured the velocities of galaxies within the Coma cluster and found that the visible mass of the cluster was far too small' },
      { number: 10, answer: 'curves', passageKeyword: 'the rotation curves of spiral galaxies', questionKeyword: 'orbital speed curves', thaiMeaning: 'กราฟความเร็วหมุน', exactPortion: 'who measured the rotation curves of spiral galaxies — graphs showing how the orbital speed of stars changes with increasing distance from the galactic centre' },
      { number: 11, answer: 'gravity', passageKeyword: 'light from distant galaxies is bent by the gravity of intervening matter', questionKeyword: 'gravity bends light', thaiMeaning: 'แรงโน้มถ่วง', exactPortion: 'The way in which light from distant galaxies is bent by the gravity of intervening matter, a phenomenon called gravitational lensing' },
      { number: 12, answer: 'particles', passageKeyword: 'a class of hypothetical particles called Weakly Interacting Massive Particles', questionKeyword: 'hypothetical particles', thaiMeaning: 'อนุภาค', exactPortion: 'The leading theoretical candidate is a class of hypothetical particles called Weakly Interacting Massive Particles, or WIMPs' },
      { number: 13, answer: 'physics', passageKeyword: 'than standard Newtonian physics predicts', questionKeyword: 'laws of physics', thaiMeaning: 'ฟิสิกส์', exactPortion: 'postulates that gravity behaves differently at very low accelerations than standard Newtonian physics predicts' },
      { number: 14, answer: 'Cluster', passageKeyword: 'the Bullet Cluster, a collision of two galaxy clusters', questionKeyword: 'Bullet Cluster', thaiMeaning: 'กลุ่ม Bullet', exactPortion: 'the Bullet Cluster, a collision of two galaxy clusters in which the visible matter and the gravitational mass are spatially separated' }
    ]
  },
  {
    examId: 'journey-normal-stage-11',
    passageNumber: 2,
    startNumber: 25,
    endNumber: 27,
    sourceParagraphs: ['A', 'F'],
    instructions: [
      'Questions 25–27',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 25–27 on your answer sheet.'
    ],
    summaryTitle: 'The Wright brothers\' path to flight and its aftermath',
    summaryLines: [
      { type: 'bullet', text: 'The Wright brothers\' success owed much to their insight that {25} of an aircraft in all directions was the central unsolved problem of flight.' },
      { type: 'bullet', text: 'Despite achieving powered flight in 1903, public {26} of what they had accomplished were widely dismissed as exaggerated or dishonest for several years.' },
      { type: 'bullet', text: 'Their later decision to file aggressive {27} claims over their flight system ultimately hindered the growth of the entire American aviation sector.' }
    ],
    questions: [
      { number: 25, answer: 'control', passageKeyword: 'the importance of three-axis control in managing a moving vehicle', questionKeyword: 'three-axis control', thaiMeaning: 'การควบคุม', exactPortion: 'The shop also gave them a practical insight that would prove decisive: the importance of three-axis control in managing a moving vehicle' },
      { number: 26, answer: 'claims', passageKeyword: 'dismiss their claims as exaggerated or fraudulent', questionKeyword: 'public claims of achievement', thaiMeaning: 'คำกล่าวอ้าง', exactPortion: 'This reticence led many observers — including the editors of Scientific American — to dismiss their claims as exaggerated or fraudulent' },
      { number: 27, answer: 'patent', passageKeyword: 'until they had secured patent protection and a commercial contract', questionKeyword: 'patent claims', thaiMeaning: 'สิทธิบัตร', exactPortion: 'refusing to demonstrate their aircraft publicly or share detailed specifications until they had secured patent protection and a commercial contract' }
    ]
  }
]
