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

export const MANUAL_FILL_BLANK_SETS: NewFillBlankSet[] = [
  {
    examId: 'cambridge-11-test1-passage1',
    passageNumber: 1,
    startNumber: 1,
    endNumber: 7,
    sourceParagraphs: ['D', 'E'],
    instructions: [
      'Questions 1–7',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 1–7 on your answer sheet.'
    ],
    summaryTitle: 'Vertical farming: pros and cons',
    summaryLines: [
      {
        type: 'para',
        text:
          'Inside vertical farms, plants grow continuously throughout the {1} because conditions are kept ideal, removing the risk of weather damage. With nothing artificial added to the soil, produce can be raised entirely {2}, which also lowers the chance of catching certain {3} illnesses common in conventional agriculture.'
      },
      { type: 'bullet', text: 'Plant leftovers can be turned into {4}, allowing the building to send energy back to the grid.' },
      { type: 'bullet', text: 'The absence of farm vehicles brings down {5} fuel consumption.' },
      {
        type: 'para',
        text:
          'The most serious downside is the cost of {6} lighting. Because tall buildings receive very little daylight from above, providing the missing light is only realistic where {7} power is cheap.'
      }
    ],
    questions: [
      {
        number: 1,
        answer: 'year',
        passageKeyword: 'all year round',
        questionKeyword: 'throughout the year',
        thaiMeaning: 'ตลอดทั้งปี',
        exactPortion: 'crops would be produced all year round, as they would be kept in artificially controlled, optimum growing conditions'
      },
      {
        number: 2,
        answer: 'organically',
        passageKeyword: 'grown organically',
        questionKeyword: 'raised entirely organically',
        thaiMeaning: 'แบบออร์แกนิก / โดยไม่ใช้สารเคมี',
        exactPortion: 'All the food could be grown organically, eliminating the need for herbicides, pesticides and fertilisers'
      },
      {
        number: 3,
        answer: 'infectious',
        passageKeyword: 'infectious diseases',
        questionKeyword: 'infectious illnesses',
        thaiMeaning: 'โรคติดต่อ / โรคติดเชื้อ',
        exactPortion: 'The system would greatly reduce the incidence of many infectious diseases that are acquired at the agricultural interface'
      },
      {
        number: 4,
        answer: 'methane',
        passageKeyword: 'methane generation',
        questionKeyword: 'turned into methane',
        thaiMeaning: 'ก๊าซมีเทน',
        exactPortion: 'it would return energy to the grid via methane generation from composting non-edible parts of plants'
      },
      {
        number: 5,
        answer: 'fossil',
        passageKeyword: 'fossil fuel use',
        questionKeyword: 'fossil fuel consumption',
        thaiMeaning: 'เชื้อเพลิงฟอสซิล',
        exactPortion: 'It would also dramatically reduce fossil fuel use, by cutting out the need for tractors, ploughs and shipping'
      },
      {
        number: 6,
        answer: 'artificial',
        passageKeyword: 'artificial light',
        questionKeyword: 'artificial lighting',
        thaiMeaning: 'แสงประดิษฐ์ / แสงไฟ',
        exactPortion: 'A major drawback of vertical farming, however, is that the plants would require artificial light'
      },
      {
        number: 7,
        answer: 'renewable',
        passageKeyword: 'renewable energy',
        questionKeyword: 'renewable power',
        thaiMeaning: 'พลังงานหมุนเวียน / พลังงานทดแทน',
        exactPortion: 'Generating enough light could be prohibitively expensive, unless cheap, renewable energy is available'
      }
    ]
  },
  {
    examId: 'cambridge-14-test1-passage1',
    passageNumber: 1,
    startNumber: 1,
    endNumber: 8,
    sourceParagraphs: ['A', 'B'],
    instructions: [
      'Questions 1–8',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 1–8 on your answer sheet.'
    ],
    summaryTitle: "The importance of children's play",
    summaryLines: [
      {
        type: 'para',
        text:
          "Imaginative play such as building a 'magical kingdom' supports the development of {1}, while board games teach children to follow {2} and take turns with a partner."
      },
      { type: 'heading', text: 'Recent changes affecting play' },
      {
        type: 'bullet',
        text: 'The {3} population has grown, reducing space for outdoor activity.'
      },
      { type: 'heading', text: 'Why free play is limited' },
      {
        type: 'bullet',
        text: 'Parents worry about {4} on the roads.'
      },
      {
        type: 'bullet',
        text: 'There is also concern about {5}.'
      },
      {
        type: 'bullet',
        text: 'Schools face greater {6}.'
      },
      { type: 'heading', text: 'Policy and research' },
      {
        type: 'para',
        text:
          'International organisations lack the {7} needed to support new policies, and researchers still need data on how play affects the rest of a child\'s {8}.'
      }
    ],
    questions: [
      {
        number: 1,
        answer: 'creativity',
        passageKeyword: 'capacity for creativity',
        questionKeyword: 'development of creativity',
        thaiMeaning: 'ความคิดสร้างสรรค์',
        exactPortion:
          'this fantasy is helping her take her first steps towards her capacity for creativity'
      },
      {
        number: 2,
        answer: 'rules',
        passageKeyword: 'follow rules',
        questionKeyword: 'follow rules',
        thaiMeaning: 'กฎ / ข้อกำหนด',
        exactPortion:
          "she's learning about the need to follow rules and take turns with a partner"
      },
      {
        number: 3,
        answer: 'cities',
        passageKeyword: 'live in cities',
        questionKeyword: 'population has grown',
        thaiMeaning: 'เมือง',
        exactPortion: 'over half the people in the world now live in cities'
      },
      {
        number: 4,
        answer: 'traffic',
        passageKeyword: 'risk to do with traffic',
        questionKeyword: 'worry about traffic',
        thaiMeaning: 'การจราจร',
        exactPortion: 'Outdoor play is curtailed by perceptions of risk to do with traffic'
      },
      {
        number: 5,
        answer: 'crime',
        passageKeyword: 'victims of crime',
        questionKeyword: 'concern about crime',
        thaiMeaning: 'อาชญากรรม',
        exactPortion:
          "parents' increased wish to protect their children from being the victims of crime"
      },
      {
        number: 6,
        answer: 'competition',
        passageKeyword: 'competition in academic learning',
        questionKeyword: 'greater competition',
        thaiMeaning: 'การแข่งขัน',
        exactPortion: 'greater competition in academic learning and schools'
      },
      {
        number: 7,
        answer: 'evidence',
        passageKeyword: 'evidence to base policies on',
        questionKeyword: 'lack the evidence',
        thaiMeaning: 'หลักฐาน',
        exactPortion: 'what they often lack is the evidence to base policies on'
      },
      {
        number: 8,
        answer: 'life',
        passageKeyword: "child's later life",
        questionKeyword: "rest of a child's life",
        thaiMeaning: 'ชีวิต',
        exactPortion: "there is very little data on the impact it has on the child's later life"
      }
    ]
  },
  {
    examId: 'cambridge-17-test1-passage1',
    passageNumber: 1,
    startNumber: 1,
    endNumber: 6,
    sourceParagraphs: ['A', 'B'],
    instructions: [
      'Questions 1–6',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 1–6 on your answer sheet.'
    ],
    summaryTitle: 'Building the London underground railway',
    summaryLines: [
      { type: 'heading', text: 'The problem' },
      {
        type: 'bullet',
        text: "London's {1} rose quickly in the early 1800s, while the streets were crowded with horse-drawn vehicles."
      },
      { type: 'heading', text: 'Pearson\'s proposal' },
      {
        type: 'para',
        text:
          'Charles Pearson wanted workers to move to better housing in the {2}, and gained support from several {3}.'
      },
      {
        type: 'bullet',
        text: 'The company initially struggled to obtain enough {4}.'
      },
      {
        type: 'bullet',
        text: 'Critical reports appeared in the {5}.'
      },
      { type: 'heading', text: 'Construction' },
      {
        type: 'para',
        text:
          "After the brick arch was finished, a layer of {6} was placed over the tunnel before the road was rebuilt."
      }
    ],
    questions: [
      {
        number: 1,
        answer: 'population',
        passageKeyword: "London's population grew",
        questionKeyword: "London's population rose",
        thaiMeaning: 'ประชากร',
        exactPortion:
          "In the first half of the 1800s, London's population grew at an astonishing rate"
      },
      {
        number: 2,
        answer: 'suburbs',
        passageKeyword: 'newly constructed suburbs',
        questionKeyword: 'housing in the suburbs',
        thaiMeaning: 'ชานเมือง',
        exactPortion:
          'relocate the poor workers who lived in the inner-city slums to newly constructed suburbs'
      },
      {
        number: 3,
        answer: 'businessmen',
        passageKeyword: 'some businessmen',
        questionKeyword: 'support from businessmen',
        thaiMeaning: 'นักธุรกิจ',
        exactPortion: "Pearson's ideas gained support amongst some businessmen"
      },
      {
        number: 4,
        answer: 'funding',
        passageKeyword: 'raising the funding',
        questionKeyword: 'obtain enough funding',
        thaiMeaning: 'เงินทุน / การระดมทุน',
        exactPortion:
          'The organisation had difficulty in raising the funding for such a radical and expensive scheme'
      },
      {
        number: 5,
        answer: 'press',
        passageKeyword: 'printed by the press',
        questionKeyword: 'reports in the press',
        thaiMeaning: 'สื่อ / หนังสือพิมพ์',
        exactPortion: 'critical articles printed by the press'
      },
      {
        number: 6,
        answer: 'soil',
        passageKeyword: 'layer of soil',
        questionKeyword: 'layer of soil',
        thaiMeaning: 'ดิน',
        exactPortion:
          'A two-metre-deep layer of soil was laid on top of the tunnel and the road above rebuilt'
      }
    ]
  },
  {
    examId: 'cambridge-16-test2-passage1',
    passageNumber: 1,
    startNumber: 8,
    endNumber: 13,
    sourceParagraphs: ['C', 'D'],
    instructions: [
      'Questions 8–13',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 8–13 on your answer sheet.'
    ],
    summaryTitle: 'The setting of the Uffington White Horse',
    summaryLines: [
      {
        type: 'para',
        text:
          'The Uffington White Horse is a stylised carving cut into a steep {8} above Uffington village. It sits just below an ancient long-distance {9} that runs along the ridge, and the surrounding land is dotted with Bronze Age burial {10}.'
      },
      { type: 'bullet', text: 'Not far away lies the Bronze Age {11} of Lambourn Seven Barrows, which contains over 30 well-preserved mounds.' },
      { type: 'bullet', text: 'Because the figure is so close to the ground, the best view of it is from the {12}.' },
      {
        type: 'para',
        text:
          'The earliest written mention of the location appears in {13} from the nearby Abbey of Abingdon, dating to the 1070s.'
      }
    ],
    questions: [
      {
        number: 8,
        answer: 'slope',
        passageKeyword: 'steep slope',
        questionKeyword: 'steep slope',
        thaiMeaning: 'ทางลาดชัน / เนิน',
        exactPortion: 'The horse is situated 2.5 km from Uffington village on a steep slope'
      },
      {
        number: 9,
        answer: 'track',
        passageKeyword: 'long-distance Neolithic track',
        questionKeyword: 'ancient long-distance track',
        thaiMeaning: 'เส้นทาง / ทางเดิน',
        exactPortion: 'below the Ridgeway, a long-distance Neolithic track'
      },
      {
        number: 10,
        answer: 'mounds',
        passageKeyword: 'Bronze Age burial mounds',
        questionKeyword: 'Bronze Age burial mounds',
        thaiMeaning: 'เนินสุสาน / เนินฝังศพ',
        exactPortion: 'The Uffington Horse is also surrounded by Bronze Age burial mounds'
      },
      {
        number: 11,
        answer: 'cemetery',
        passageKeyword: 'Bronze Age cemetery of Lambourn Seven Barrows',
        questionKeyword: 'Bronze Age cemetery of Lambourn',
        thaiMeaning: 'สุสาน',
        exactPortion: 'It is not far from the Bronze Age cemetery of Lambourn Seven Barrows'
      },
      {
        number: 12,
        answer: 'air',
        passageKeyword: 'best appreciated from the air',
        questionKeyword: 'best view is from the air',
        thaiMeaning: 'อากาศ / มุมสูง',
        exactPortion: 'like many geoglyphs is best appreciated from the air'
      },
      {
        number: 13,
        answer: 'documents',
        passageKeyword: 'mentioned in documents from the nearby Abbey of Abingdon',
        questionKeyword: 'mention appears in documents',
        thaiMeaning: 'เอกสาร',
        exactPortion: "'White Horse Hill' is mentioned in documents from the nearby Abbey of Abingdon"
      }
    ]
  },
  {
    examId: 'cambridge-14-test1-passage2',
    passageNumber: 2,
    startNumber: 14,
    endNumber: 20,
    sourceParagraphs: ['E', 'F'],
    instructions: [
      'Questions 14–20',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 14–20 on your answer sheet.'
    ],
    summaryTitle: 'The 1999 Amsterdam Witte Fietsenplan',
    summaryLines: [
      {
        type: 'para',
        text:
          'When a new Witte Fietsenplan launched in Amsterdam in 1999, the white bikes were no longer free. Each trip cost one guilder, paid for with a chip {14} created by the Dutch bank Postbank. Schimmelpennink designed sturdy white bikes that were locked into special {15}, which only the same card could open.'
      },
      { type: 'bullet', text: 'The plan began with 250 bicycles spread across five {16}.' },
      { type: 'bullet', text: 'According to system designer Theo Molenaar, the project soon suffered from {17} and {18}.' },
      {
        type: 'para',
        text:
          'After every {19} a few bikes were always missing, even though they were instantly recognisable. The final blow came when Postbank dropped the chip card and the business {20} lost interest, leaving the scheme without a way to continue.'
      }
    ],
    questions: [
      {
        number: 14,
        answer: 'card',
        passageKeyword: 'chip card developed by the Dutch bank Postbank',
        questionKeyword: 'chip card created by Postbank',
        thaiMeaning: 'บัตร',
        exactPortion: 'payment was made with a chip card developed by the Dutch bank Postbank'
      },
      {
        number: 15,
        answer: 'racks',
        passageKeyword: 'locked in special racks',
        questionKeyword: 'locked into special racks',
        thaiMeaning: 'ราว / ที่จอด',
        exactPortion: 'Schimmelpennink designed conspicuous, sturdy white bikes locked in special racks'
      },
      {
        number: 16,
        answer: 'stations',
        passageKeyword: 'distributed over five stations',
        questionKeyword: 'spread across five stations',
        thaiMeaning: 'สถานี / จุดให้บริการ',
        exactPortion: 'the plan started with 250 bikes, distributed over five stations'
      },
      {
        number: 17,
        answer: 'vandalism',
        passageKeyword: 'prone to vandalism and theft',
        questionKeyword: 'suffered from vandalism',
        thaiMeaning: 'การทำลายข้าวของ',
        exactPortion: 'The system, however, was prone to vandalism and theft'
      },
      {
        number: 18,
        answer: 'theft',
        passageKeyword: 'prone to vandalism and theft',
        questionKeyword: 'and theft',
        thaiMeaning: 'การโจรกรรม',
        exactPortion: 'The system, however, was prone to vandalism and theft'
      },
      {
        number: 19,
        answer: 'weekend',
        passageKeyword: 'After every weekend there would always be a couple of bikes missing',
        questionKeyword: 'after every weekend a few bikes were always missing',
        thaiMeaning: 'สุดสัปดาห์',
        exactPortion: 'After every weekend there would always be a couple of bikes missing'
      },
      {
        number: 20,
        answer: 'partner',
        passageKeyword: 'the business partner had lost interest',
        questionKeyword: 'the business partner lost interest',
        thaiMeaning: 'หุ้นส่วน / พาร์ทเนอร์',
        exactPortion: 'we would have needed to set up another system, but the business partner had lost interest'
      }
    ]
  },
  {
    examId: 'cambridge-19-test2-passage1',
    passageNumber: 1,
    startNumber: 8,
    endNumber: 13,
    sourceParagraphs: ['I', 'J'],
    instructions: [
      'Questions 8–13',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 8–13 on your answer sheet.'
    ],
    summaryTitle: 'Effects of industrialisation on British society',
    summaryLines: [
      {
        type: 'para',
        text:
          'As industrialisation spread, small towns rapidly grew into large {8}. The new urban areas became overcrowded and were soon suffering from {9} as well as poor sanitation.'
      },
      {
        type: 'para',
        text:
          'Although overall output rose, the gains were uneven. Factory workers had to put up with long {10} in dangerous conditions, and they received extremely low {11} for their labour.'
      },
      { type: 'bullet', text: 'A group of weavers called the Luddites began smashing textile machines because they feared that unskilled machine {12} were replacing their craft.' },
      { type: 'bullet', text: 'After clashes near Huddersfield in 1812, the British government made machine-breaking punishable by {13}, and the resistance soon collapsed.' }
    ],
    questions: [
      {
        number: 8,
        answer: 'cities',
        passageKeyword: 'turned smaller towns into major cities',
        questionKeyword: 'grew into large cities',
        thaiMeaning: 'เมือง',
        exactPortion: 'the rise of large factories turned smaller towns into major cities in just a few decades'
      },
      {
        number: 9,
        answer: 'pollution',
        passageKeyword: 'overcrowded cities suffered from pollution',
        questionKeyword: 'suffering from pollution',
        thaiMeaning: 'มลพิษ',
        exactPortion: 'overcrowded cities suffered from pollution and inadequate sanitation'
      },
      {
        number: 10,
        answer: 'hours',
        passageKeyword: 'work long hours in dangerous conditions',
        questionKeyword: 'long hours in dangerous conditions',
        thaiMeaning: 'ชั่วโมงทำงาน',
        exactPortion: 'Factory workers had to work long hours in dangerous conditions for extremely low wages'
      },
      {
        number: 11,
        answer: 'wages',
        passageKeyword: 'extremely low wages',
        questionKeyword: 'extremely low wages',
        thaiMeaning: 'ค่าจ้าง',
        exactPortion: 'Factory workers had to work long hours in dangerous conditions for extremely low wages'
      },
      {
        number: 12,
        answer: 'operators',
        passageKeyword: 'unskilled machine operators',
        questionKeyword: 'unskilled machine operators',
        thaiMeaning: 'ผู้ควบคุมเครื่อง / พนักงานเดินเครื่อง',
        exactPortion: 'they feared that unskilled machine operators were robbing them of their livelihood'
      },
      {
        number: 13,
        answer: 'death',
        passageKeyword: 'machine-breaking punishable by death',
        questionKeyword: 'machine-breaking punishable by death',
        thaiMeaning: 'ความตาย / โทษประหาร',
        exactPortion: 'the British government responded to the uprisings by making machine-breaking punishable by death'
      }
    ]
  },
  {
    examId: 'cambridge-14-test3-passage2',
    passageNumber: 2,
    startNumber: 22,
    endNumber: 26,
    sourceParagraphs: ['G', 'H'],
    instructions: [
      'Questions 22–26',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 22–26 on your answer sheet.'
    ],
    summaryTitle: 'Ross Piper\'s bioprospecting approach',
    summaryLines: [
      {
        type: 'para',
        text:
          "At Aberystwyth University, Ross Piper's team relies on their knowledge of {22} to direct their search for useful compounds. They are particularly interested in insects whose powerful poison subdues {23} and keeps it fresh for later consumption."
      },
      { type: 'bullet', text: 'The team also studies insects that live in filthy {24} such as faeces and carcasses, where antimicrobial compounds are produced to fight off pathogens.' },
      { type: 'bullet', text: 'Piper hopes these natural chemicals will inspire new {25} that can deal with bacteria and fungi.' },
      {
        type: 'para',
        text:
          "Once a promising compound has been identified, scientists can now cut out the relevant stretch of an insect's {26} and insert it into cell lines, so that much larger quantities can be produced."
      }
    ],
    questions: [
      {
        number: 22,
        answer: 'ecology',
        passageKeyword: 'use our knowledge of ecology',
        questionKeyword: 'knowledge of ecology',
        thaiMeaning: 'นิเวศวิทยา',
        exactPortion:
          'we use our knowledge of ecology as a guide to target our efforts'
      },
      {
        number: 23,
        answer: 'prey',
        passageKeyword: 'subduing prey and keeping it fresh',
        questionKeyword: 'powerful poison subdues prey',
        thaiMeaning: 'เหยื่อ',
        exactPortion: 'insects that secrete powerful poison for subduing prey and keeping it fresh for future consumption'
      },
      {
        number: 24,
        answer: 'habitats',
        passageKeyword: 'masters of exploiting filthy habitats',
        questionKeyword: 'live in filthy habitats',
        thaiMeaning: 'ที่อยู่อาศัย / แหล่งอาศัย',
        exactPortion: 'insects that are masters of exploiting filthy habitats, such as faeces and carcasses'
      },
      {
        number: 25,
        answer: 'antibiotics',
        passageKeyword: 'inspire new antibiotics',
        questionKeyword: 'inspire new antibiotics',
        thaiMeaning: 'ยาปฏิชีวนะ',
        exactPortion: 'compounds that can serve as or inspire new antibiotics'
      },
      {
        number: 26,
        answer: 'DNA',
        passageKeyword: "stretches of the insect's DNA",
        questionKeyword: "stretch of an insect's DNA",
        thaiMeaning: 'ดีเอ็นเอ',
        exactPortion: "it is now possible to snip out the stretches of the insect's DNA that carry the codes for the interesting compounds"
      }
    ]
  },
  {
    examId: 'cambridge-11-test2-passage1',
    passageNumber: 1,
    startNumber: 8,
    endNumber: 13,
    sourceParagraphs: ['E', 'F'],
    instructions: [
      'Questions 8–13',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 8–13 on your answer sheet.'
    ],
    summaryTitle: 'Raising the Mary Rose',
    summaryLines: [
      {
        type: 'para',
        text:
          'After a successful 1978 excavation, The Mary Rose Trust was created in 1979 with Prince Charles as its President and Dr Margaret Rule as its Archaeological {8}. The team eventually decided to carry out the lift in three distinct {9}.'
      },
      { type: 'bullet', text: 'First, the open hull was attached to a lifting {10} using bolts and wires, while twelve hydraulic {11} stopped it being sucked back into the mud.' },
      { type: 'bullet', text: 'Next, the hull was hooked to a {12} and transferred underwater into the lifting cradle.' },
      {
        type: 'para',
        text:
          'Finally, the whole structure was lifted into the air. To protect the fragile timbers, the cradle was fitted with air {13} that cushioned the wooden framework.'
      }
    ],
    questions: [
      {
        number: 8,
        answer: 'Director',
        passageKeyword: 'its Archaeological Director',
        questionKeyword: 'its Archaeological Director',
        thaiMeaning: 'ผู้อำนวยการ',
        exactPortion:
          'The Mary Rose Trust was formed, with Prince Charles as its President and Dr Margaret Rule its Archaeological Director'
      },
      {
        number: 9,
        answer: 'stages',
        passageKeyword: 'three very distinct stages',
        questionKeyword: 'three distinct stages',
        thaiMeaning: 'ขั้นตอน / ช่วง',
        exactPortion: 'to carry out the lifting operation in three very distinct stages'
      },
      {
        number: 10,
        answer: 'frame',
        passageKeyword: 'lifting frame via a network of bolts and lifting wires',
        questionKeyword: 'lifting frame using bolts and wires',
        thaiMeaning: 'โครง / เฟรม',
        exactPortion: 'The hull was attached to a lifting frame via a network of bolts and lifting wires'
      },
      {
        number: 11,
        answer: 'jacks',
        passageKeyword: '12 hydraulic jacks',
        questionKeyword: 'twelve hydraulic jacks',
        thaiMeaning: 'แม่แรง',
        exactPortion: 'The problem of the hull being sucked back downwards into the mud was overcome by using 12 hydraulic jacks'
      },
      {
        number: 12,
        answer: 'crane',
        passageKeyword: 'fixed to a hook attached to a crane',
        questionKeyword: 'hooked to a crane',
        thaiMeaning: 'เครน',
        exactPortion: 'the lifting frame was fixed to a hook attached to a crane, and the hull was lifted completely clear of the seabed'
      },
      {
        number: 13,
        answer: 'bags',
        passageKeyword: 'fitted with air bags',
        questionKeyword: 'air bags cushioned the wooden framework',
        thaiMeaning: 'ถุงลม',
        exactPortion: "was fitted with air bags to provide additional cushioning for the hull's delicate timber framework"
      }
    ]
  },
  {
    examId: 'cambridge-15-test1-passage2',
    passageNumber: 2,
    startNumber: 19,
    endNumber: 26,
    sourceParagraphs: ['B', 'D'],
    instructions: [
      'Questions 19–26',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 19–26 on your answer sheet.'
    ],
    summaryTitle: 'Driverless cars: motives and effects',
    summaryLines: [
      {
        type: 'para',
        text:
          "Research at the UK's Transport Research Laboratory found that human {19} is involved in more than 90 percent of road collisions, which is why {20} is one of the most frequently cited reasons for developing driverless vehicles. Automation may also reduce the {21} of crashes."
      },
      { type: 'bullet', text: 'When the car handles the driving, passengers can spend their time being productive, socialising or simply relaxing.' },
      { type: 'bullet', text: 'Older or disabled travellers who currently struggle with standard vehicles may finally enjoy much greater travel {22}.' },
      {
        type: 'para',
        text:
          "An MIT study in Singapore suggests that full car-sharing could meet demand with under 30 percent of today's vehicles. Research from Michigan suggests automation could cut vehicle {23} by 43 percent, while each car's annual {24} would roughly double."
      },
      { type: 'bullet', text: 'Because every vehicle would be used much more intensively, its rate of {25} would rise and it would need replacing sooner.' },
      { type: 'bullet', text: 'As a result, overall vehicle {26} may not actually fall.' }
    ],
    questions: [
      {
        number: 19,
        answer: 'error',
        passageKeyword: 'human error as a contributory factor',
        questionKeyword: 'human error is involved in collisions',
        thaiMeaning: 'ความผิดพลาด (ของมนุษย์)',
        exactPortion: 'more than 90 percent of road collisions involve human error as a contributory factor'
      },
      {
        number: 20,
        answer: 'safety',
        passageKeyword: 'One frequently cited motive is safety',
        questionKeyword: 'most frequently cited reasons … safety',
        thaiMeaning: 'ความปลอดภัย',
        exactPortion: 'One frequently cited motive is safety'
      },
      {
        number: 21,
        answer: 'incidence',
        passageKeyword: 'help to reduce the incidence of this',
        questionKeyword: 'reduce the incidence of crashes',
        thaiMeaning: 'อุบัติการณ์ / การเกิดขึ้น',
        exactPortion: 'Automation may help to reduce the incidence of this'
      },
      {
        number: 22,
        answer: 'autonomy',
        passageKeyword: 'significantly greater travel autonomy',
        questionKeyword: 'much greater travel autonomy',
        thaiMeaning: 'อิสระในการเดินทาง',
        exactPortion: 'older or disabled travellers – may be able to enjoy significantly greater travel autonomy'
      },
      {
        number: 23,
        answer: 'ownership',
        passageKeyword: 'reduce vehicle ownership by 43 percent',
        questionKeyword: 'cut vehicle ownership by 43 percent',
        thaiMeaning: 'การเป็นเจ้าของ (รถ)',
        exactPortion: 'automated vehicles might reduce vehicle ownership by 43 percent'
      },
      {
        number: 24,
        answer: 'mileage',
        passageKeyword: "vehicles' average annual mileage double",
        questionKeyword: "car's annual mileage would roughly double",
        thaiMeaning: 'ระยะทางที่ใช้ต่อปี',
        exactPortion: "vehicles' average annual mileage double as a result"
      },
      {
        number: 25,
        answer: 'turnover',
        passageKeyword: 'faster rate of turnover',
        questionKeyword: 'rate of turnover would rise',
        thaiMeaning: 'อัตราการเปลี่ยน / หมุนเวียน',
        exactPortion: 'This faster rate of turnover may mean that vehicle production will not necessarily decrease'
      },
      {
        number: 26,
        answer: 'production',
        passageKeyword: 'vehicle production will not necessarily decrease',
        questionKeyword: 'overall vehicle production may not actually fall',
        thaiMeaning: 'การผลิต',
        exactPortion: 'vehicle production will not necessarily decrease'
      }
    ]
  },
  {
    examId: 'cambridge-13-test2-passage2',
    passageNumber: 2,
    startNumber: 21,
    endNumber: 26,
    sourceParagraphs: ['B', 'E'],
    instructions: [
      'Questions 21–26',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 21–26 on your answer sheet.'
    ],
    summaryTitle: 'Research into oxytocin',
    summaryLines: [
      {
        type: 'para',
        text:
          'The first hints about the role of oxytocin came from work with {21}, which showed that the hormone strengthens bonds between mating prairie voles and triggers motherly behaviour in sheep. The hormone is also released by women during {22}, helping mothers bond with their newborns.'
      },
      { type: 'bullet', text: 'In a famous 2005 experiment at Freiburg, volunteers who had inhaled oxytocin invested more money than those who received a {23}.' },
      { type: 'bullet', text: 'At the University of Haifa, participants playing a competitive {24} showed more pleasure when they beat others, and more envy when they lost.' },
      {
        type: 'para',
        text:
          'Later studies showed that oxytocin can also harm social interactions. Research in Antwerp found that people given the hormone became less cooperative when dealing with complete {25}. In Amsterdam, Dutch men were quicker to link positive words with Dutch {26} than with foreign ones.'
      }
    ],
    questions: [
      {
        number: 21,
        answer: 'animals',
        passageKeyword: 'studies focusing on animals',
        questionKeyword: 'work with animals',
        thaiMeaning: 'สัตว์',
        exactPortion: 'It was through various studies focusing on animals that scientists first became aware of the influence of oxytocin'
      },
      {
        number: 22,
        answer: 'childbirth',
        passageKeyword: 'released by women in childbirth',
        questionKeyword: 'released by women during childbirth',
        thaiMeaning: 'การคลอดบุตร',
        exactPortion: 'It is also released by women in childbirth, strengthening the attachment between mother and baby'
      },
      {
        number: 23,
        answer: 'placebo',
        passageKeyword: 'received a placebo instead',
        questionKeyword: 'received a placebo',
        thaiMeaning: 'ยาหลอก',
        exactPortion: 'the participants who had sniffed oxytocin via a nasal spray beforehand invested more money than those who received a placebo instead'
      },
      {
        number: 24,
        answer: 'game',
        passageKeyword: 'played a competitive game',
        questionKeyword: 'playing a competitive game',
        thaiMeaning: 'เกม',
        exactPortion: 'when volunteers played a competitive game, those who inhaled the hormone showed more pleasure when they beat other players'
      },
      {
        number: 25,
        answer: 'strangers',
        passageKeyword: 'when dealing with complete strangers',
        questionKeyword: 'when dealing with complete strangers',
        thaiMeaning: 'คนแปลกหน้า',
        exactPortion: 'people who had received a dose of oxytocin actually became less cooperative when dealing with complete strangers'
      },
      {
        number: 26,
        answer: 'names',
        passageKeyword: 'positive words with Dutch names',
        questionKeyword: 'link positive words with Dutch names',
        thaiMeaning: 'ชื่อ',
        exactPortion: 'Dutch men became quicker to associate positive words with Dutch names than with foreign ones'
      }
    ]
  },
  {
    examId: 'cambridge-12-test3-passage1',
    passageNumber: 1,
    startNumber: 8,
    endNumber: 13,
    sourceParagraphs: ['B', 'B'],
    instructions: [
      'Questions 8–13',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 8–13 on your answer sheet.'
    ],
    summaryTitle: 'Exploitation of the Galápagos tortoise',
    summaryLines: [
      {
        type: 'para',
        text:
          'From the 17th century onwards, a small number of tortoises were carried away from the islands by {8}, who took them as food. The arrival of whaling ships in the 1790s made the problem much worse, since these large animals could survive for months on board without {9} or water, and so were stored on long voyages.'
      },
      { type: 'bullet', text: 'Sometimes their bodies were processed into high-grade {10}.' },
      {
        type: 'para',
        text:
          'The damage grew further when {11} arrived on the islands. They hunted the tortoises and cleared the land for farming.'
      },
      { type: 'bullet', text: 'They also brought in alien {12} — cattle, pigs, goats, rats, dogs, plants and ants — that destroyed habitat.' },
      { type: 'bullet', text: 'Many of these animals preyed on baby tortoises and on tortoise {13}.' }
    ],
    questions: [
      {
        number: 8,
        answer: 'pirates',
        passageKeyword: 'pirates took a few on board for food',
        questionKeyword: 'carried away by pirates',
        thaiMeaning: 'โจรสลัด',
        exactPortion: 'From the 17th century onwards, pirates took a few on board for food'
      },
      {
        number: 9,
        answer: 'food',
        passageKeyword: 'surviving for months without food or water',
        questionKeyword: 'survive without food or water',
        thaiMeaning: 'อาหาร',
        exactPortion: 'Relatively immobile and capable of surviving for months without food or water, the tortoises were taken on board these ships'
      },
      {
        number: 10,
        answer: 'oil',
        passageKeyword: 'processed into high-grade oil',
        questionKeyword: 'processed into high-grade oil',
        thaiMeaning: 'น้ำมัน',
        exactPortion: 'Sometimes, their bodies were processed into high-grade oil'
      },
      {
        number: 11,
        answer: 'settlers',
        passageKeyword: 'settlers came to the islands',
        questionKeyword: 'settlers arrived on the islands',
        thaiMeaning: 'ผู้มาตั้งถิ่นฐาน',
        exactPortion: 'This historical exploitation was then exacerbated when settlers came to the islands'
      },
      {
        number: 12,
        answer: 'species',
        passageKeyword: 'introduced alien species',
        questionKeyword: 'brought in alien species',
        thaiMeaning: 'สายพันธุ์ / สิ่งมีชีวิต',
        exactPortion: 'They also introduced alien species – ranging from cattle, pigs, goats, rats and dogs to plants and ants'
      },
      {
        number: 13,
        answer: 'eggs',
        passageKeyword: 'prey on the eggs and young tortoises',
        questionKeyword: 'preyed on tortoise eggs',
        thaiMeaning: 'ไข่',
        exactPortion: 'that either prey on the eggs and young tortoises or damage or destroy their habitat'
      }
    ]
  },
  {
    examId: 'cambridge-13-test4-passage1',
    passageNumber: 1,
    startNumber: 9,
    endNumber: 13,
    sourceParagraphs: ['E', 'H'],
    instructions: [
      'Questions 9–13',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 9–13 on your answer sheet.'
    ],
    summaryTitle: "Cutty Sark's later career",
    summaryLines: [
      {
        type: 'para',
        text:
          'From 1880 onwards, Cutty Sark entered the most successful phase of her working life, carrying {9} from Australia to Britain. Her next captain, Richard Woodget, was a highly skilled {10} who pushed the ship further south than any previous master.'
      },
      { type: 'bullet', text: 'In 1922 the ship was badly damaged by a {11} and was put into Falmouth harbour for repairs.' },
      { type: 'bullet', text: 'Between 1923 and 1954 the restored Cutty Sark was used by Wilfred Dowman and his successors for {12}.' },
      {
        type: 'para',
        text:
          'After going on public display in Greenwich in 1954, the ship was twice damaged by {13} in the 21st century, but she still attracts about a quarter of a million visitors every year.'
      }
    ],
    questions: [
      {
        number: 9,
        answer: 'wool',
        passageKeyword: 'transporting wool from Australia to Britain',
        questionKeyword: 'carrying wool from Australia to Britain',
        thaiMeaning: 'ขนแกะ',
        exactPortion: 'the beginning of the most successful period in Cutty Sark’s working life, transporting wool from Australia to Britain'
      },
      {
        number: 10,
        answer: 'navigator',
        passageKeyword: 'an excellent navigator',
        questionKeyword: 'highly skilled navigator',
        thaiMeaning: 'นักเดินเรือ',
        exactPortion: 'The ship’s next captain, Richard Woodget, was an excellent navigator, who got the best out of both his ship and his crew'
      },
      {
        number: 11,
        answer: 'gale',
        passageKeyword: 'Badly damaged in a gale in 1922',
        questionKeyword: 'damaged by a gale in 1922',
        thaiMeaning: 'พายุ / ลมแรง',
        exactPortion: 'Badly damaged in a gale in 1922, she was put into Falmouth harbor in southwest England, for repairs'
      },
      {
        number: 12,
        answer: 'training',
        passageKeyword: 'Dowman used Cutty Sark as a training ship',
        questionKeyword: 'used … for training',
        thaiMeaning: 'การฝึกอบรม',
        exactPortion: 'Dowman used Cutty Sark as a training ship, and she continued in this role after his death'
      },
      {
        number: 13,
        answer: 'fire',
        passageKeyword: 'suffered from fire in 2007, and again, less seriously, in 2014',
        questionKeyword: 'damaged by fire in the 21st century',
        thaiMeaning: 'ไฟไหม้',
        exactPortion: 'The ship suffered from fire in 2007, and again, less seriously, in 2014'
      }
    ]
  },
  {
    examId: 'cambridge-12-test1-passage1',
    passageNumber: 1,
    startNumber: 6,
    endNumber: 13,
    sourceParagraphs: ['F', 'G'],
    instructions: [
      'Questions 6–13',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 6–13 on your answer sheet.'
    ],
    summaryTitle: 'Cork bottle stoppers versus aluminium screw caps',
    summaryLines: [
      {
        type: 'para',
        text:
          "One reason wineries have moved away from cork is the risk of TCA, a compound that can spoil the {6} of the bottle's contents. Aluminium screw caps avoid this problem; they are also {7} to manufacture than cork, and they are more {8} for the user to open and close."
      },
      { type: 'heading', text: 'Why cork is still attractive' },
      { type: 'bullet', text: 'The classic cork stopper suits the {9} of the high-quality products it has long been associated with.' },
      { type: 'bullet', text: 'Cork is a {10} material that can be {11} without difficulty.' },
      { type: 'bullet', text: 'Cork forests also support local {12} in the regions where they grow.' },
      { type: 'bullet', text: 'They help to prevent {13} in those same regions.' }
    ],
    questions: [
      {
        number: 6,
        answer: 'taste',
        passageKeyword: 'spoil the taste of the product',
        questionKeyword: 'spoil the taste of the bottle’s contents',
        thaiMeaning: 'รสชาติ',
        exactPortion: 'as little as three or four parts to a trillion – can spoil the taste of the product contained in the bottle'
      },
      {
        number: 7,
        answer: 'cheaper',
        passageKeyword: 'cheaper to manufacture',
        questionKeyword: 'cheaper to manufacture',
        thaiMeaning: 'ถูกกว่า',
        exactPortion: 'These substitutes are cheaper to manufacture and, in the case of screw caps, more convenient for the user'
      },
      {
        number: 8,
        answer: 'convenient',
        passageKeyword: 'more convenient for the user',
        questionKeyword: 'more convenient for the user',
        thaiMeaning: 'สะดวก',
        exactPortion: 'in the case of screw caps, more convenient for the user'
      },
      {
        number: 9,
        answer: 'image',
        passageKeyword: 'traditional image is more in keeping with … high quality goods',
        questionKeyword: 'suits the image of high-quality products',
        thaiMeaning: 'ภาพลักษณ์',
        exactPortion: 'Firstly, its traditional image is more in keeping with that of the type of high quality goods with which it has long been associated'
      },
      {
        number: 10,
        answer: 'sustainable',
        passageKeyword: 'cork is a sustainable product',
        questionKeyword: 'a sustainable material',
        thaiMeaning: 'ยั่งยืน',
        exactPortion: 'cork is a sustainable product that can be recycled without difficulty'
      },
      {
        number: 11,
        answer: 'recycled',
        passageKeyword: 'can be recycled without difficulty',
        questionKeyword: 'can be recycled without difficulty',
        thaiMeaning: 'รีไซเคิล / นำกลับมาใช้ใหม่',
        exactPortion: 'cork is a sustainable product that can be recycled without difficulty'
      },
      {
        number: 12,
        answer: 'biodiversity',
        passageKeyword: 'support local biodiversity',
        questionKeyword: 'support local biodiversity',
        thaiMeaning: 'ความหลากหลายทางชีวภาพ',
        exactPortion: 'cork forests are a resource which support local biodiversity, and prevent desertification'
      },
      {
        number: 13,
        answer: 'desertification',
        passageKeyword: 'prevent desertification',
        questionKeyword: 'prevent desertification',
        thaiMeaning: 'การกลายเป็นทะเลทราย',
        exactPortion: 'cork forests are a resource which support local biodiversity, and prevent desertification in the regions where they are planted'
      }
    ]
  },
  {
    examId: 'cambridge-15-test3-passage1',
    passageNumber: 1,
    startNumber: 8,
    endNumber: 13,
    sourceParagraphs: ['D', 'E'],
    instructions: [
      'Questions 8–13',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 8–13 on your answer sheet.'
    ],
    summaryTitle: "Henry Moore's mid-career changes",
    summaryLines: [
      {
        type: 'para',
        text:
          "After the harsh reviews of his 1931 exhibition, there were calls for Moore's {8} from the Royal College. When his contract ended, he left to start a sculpture department at the Chelsea School of Art. During the Second World War a shortage of {9} forced him to focus on drawing rather than sculpting."
      },
      { type: 'bullet', text: 'In 1942 he returned to Castleford to sketch the {10} who worked there.' },
      {
        type: 'para',
        text:
          'In 1944 the town of Harlow commissioned Moore to produce a sculpture depicting a {11}. He made dozens of clay studies, which were cast in bronze and issued in small editions.'
      },
      { type: 'bullet', text: "In this way, Moore's work became available to {12} all over the world." },
      { type: 'bullet', text: 'The boost to his {13} let him take on more ambitious projects on the scale his sculpture demanded.' }
    ],
    questions: [
      {
        number: 8,
        answer: 'resignation',
        passageKeyword: 'calls for his resignation from the Royal College',
        questionKeyword: "calls for Moore's resignation",
        thaiMeaning: 'การลาออก',
        exactPortion: 'There were calls for his resignation from the Royal College'
      },
      {
        number: 9,
        answer: 'materials',
        passageKeyword: 'A shortage of materials forced him to focus on drawing',
        questionKeyword: 'shortage of materials forced him to draw',
        thaiMeaning: 'วัสดุ',
        exactPortion: 'A shortage of materials forced him to focus on drawing'
      },
      {
        number: 10,
        answer: 'miners',
        passageKeyword: 'sketches of the miners who worked there',
        questionKeyword: 'sketch the miners',
        thaiMeaning: 'คนงานเหมือง',
        exactPortion: 'he returned to Castleford to make a series of sketches of the miners who worked there'
      },
      {
        number: 11,
        answer: 'family',
        passageKeyword: 'a sculpture depicting a family',
        questionKeyword: 'sculpture depicting a family',
        thaiMeaning: 'ครอบครัว',
        exactPortion: 'Harlow, a town near London, offered Moore a commission for a sculpture depicting a family'
      },
      {
        number: 12,
        answer: 'collectors',
        passageKeyword: "Moore's work became available to collectors all over the world",
        questionKeyword: "available to collectors all over the world",
        thaiMeaning: 'นักสะสม',
        exactPortion: "Moore's work became available to collectors all over the world"
      },
      {
        number: 13,
        answer: 'income',
        passageKeyword: 'The boost to his income enabled him to take on ambitious projects',
        questionKeyword: 'boost to his income',
        thaiMeaning: 'รายได้',
        exactPortion: 'The boost to his income enabled him to take on ambitious projects and start working on the scale he felt his sculpture demanded'
      }
    ]
  },
  {
    examId: 'cambridge-13-test1-passage1',
    passageNumber: 1,
    startNumber: 1,
    endNumber: 7,
    sourceParagraphs: ['B', 'E'],
    instructions: [
      'Questions 1–7',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 1–7 on your answer sheet.'
    ],
    summaryTitle: 'The Tourism New Zealand website',
    summaryLines: [
      {
        type: 'para',
        text:
          'The site was built around a database of tourism service operators. Any business could register on a simple form, and because they were able to {1} their details regularly, the information on the site stayed accurate. As part of an evaluation scheme, the effect of each business on the {2} was also considered.'
      },
      { type: 'heading', text: 'Special features' },
      { type: 'bullet', text: 'One popular interview was with a former rugby {3} of the All Blacks.' },
      { type: 'bullet', text: 'Another feature offered an interactive tour of locations used in {4}.' },
      { type: 'bullet', text: 'Driving-route guides changed according to the {5} of the year, with distances and travel times shown.' },
      { type: 'bullet', text: 'A Travel Planner showed maps, public transport options and local {6}.' },
      { type: 'bullet', text: "In the 'Your Words' section, travellers could share a link to their travel {7}." }
    ],
    questions: [
      {
        number: 1,
        answer: 'update',
        passageKeyword: 'update the details they gave on a regular basis',
        questionKeyword: 'update their details regularly',
        thaiMeaning: 'อัปเดต / ปรับปรุงข้อมูล',
        exactPortion: 'participating businesses were able to update the details they gave on a regular basis, the information provided remained accurate'
      },
      {
        number: 2,
        answer: 'environment',
        passageKeyword: 'the effect of each business on the environment was considered',
        questionKeyword: 'effect of each business on the environment',
        thaiMeaning: 'สิ่งแวดล้อม',
        exactPortion: 'As part of this, the effect of each business on the environment was considered'
      },
      {
        number: 3,
        answer: 'captain',
        passageKeyword: 'former New Zealand All Blacks rugby captain Tana Umaga',
        questionKeyword: 'former rugby captain',
        thaiMeaning: 'กัปตันทีม',
        exactPortion: 'One of the most popular was an interview with former New Zealand All Blacks rugby captain Tana Umaga'
      },
      {
        number: 4,
        answer: 'films',
        passageKeyword: 'locations chosen for blockbuster films',
        questionKeyword: 'locations used in films',
        thaiMeaning: 'ภาพยนตร์',
        exactPortion: "an interactive journey through a number of the locations chosen for blockbuster films which had made use of New Zealand's stunning scenery as a backdrop"
      },
      {
        number: 5,
        answer: 'season',
        passageKeyword: 'highlighting different routes according to the season',
        questionKeyword: 'changed according to the season',
        thaiMeaning: 'ฤดูกาล',
        exactPortion: 'the site catalogued the most popular driving routes in the country, highlighting different routes according to the season and indicating distances and times'
      },
      {
        number: 6,
        answer: 'accommodation',
        passageKeyword: 'links to accommodation in the area',
        questionKeyword: 'local accommodation',
        thaiMeaning: 'ที่พัก',
        exactPortion: 'The Travel Planner offered suggested routes and public transport options between the chosen locations. There were also links to accommodation in the area'
      },
      {
        number: 7,
        answer: 'blog',
        passageKeyword: 'submit a blog of their New Zealand travels',
        questionKeyword: 'share a link to their travel blog',
        thaiMeaning: 'บล็อก',
        exactPortion: "anyone could submit a blog of their New Zealand travels for possible inclusion on the website"
      }
    ]
  },
  {
    examId: 'cambridge-19-test2-passage1',
    passageNumber: 1,
    startNumber: 1,
    endNumber: 7,
    sourceParagraphs: ['C', 'I'],
    instructions: [
      'Questions 1–7',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 1–7 on your answer sheet.'
    ],
    summaryTitle: 'Key developments of the Industrial Revolution',
    summaryLines: [
      {
        type: 'para',
        text:
          'Watt and Boulton designed a new steam engine in which the forward and backward strokes of the {1} were linked to a gear system that produced rotary motion. Steam power needed a cheap energy source, and the demand for {2} grew rapidly to feed both factories and steam-powered transport.'
      },
      { type: 'bullet', text: 'Before the new spinning and weaving machines appeared, textiles in Britain were produced in small {3} or even at home.' },
      { type: 'bullet', text: 'With the new machines, very little human {4} was needed to produce cloth.' },
      { type: 'bullet', text: 'Smelting iron ore with coke produced metal of higher {5} than the traditional charcoal method.' },
      { type: 'bullet', text: 'Demand for iron grew even further with the expansion of the {6} from the 1830s onwards.' },
      {
        type: 'para',
        text:
          'As factories drew workers into the cities, the rapid urbanisation that followed brought serious problems, including pollution and inadequate {7}.'
      }
    ],
    questions: [
      {
        number: 1,
        answer: 'piston',
        passageKeyword: 'forward and backward strokes of the piston',
        questionKeyword: 'forward and backward strokes of the piston',
        thaiMeaning: 'ลูกสูบ',
        exactPortion: 'Watt later worked with the English manufacturer Matthew Boulton to invent a new steam engine driven by both the forward and backward strokes of the piston'
      },
      {
        number: 2,
        answer: 'coal',
        passageKeyword: 'demand for coal … grew rapidly',
        questionKeyword: 'demand for coal grew rapidly',
        thaiMeaning: 'ถ่านหิน',
        exactPortion: 'The demand for coal, which was a relatively cheap energy source, grew rapidly during the Industrial Revolution'
      },
      {
        number: 3,
        answer: 'workshops',
        passageKeyword: 'work performed in small workshops or even homes',
        questionKeyword: 'produced in small workshops or at home',
        thaiMeaning: 'โรงงานเล็ก / เวิร์กชอป',
        exactPortion: 'the British textile business was a true ‘cottage industry’, with the work performed in small workshops or even homes by individual spinners, weavers and dyers'
      },
      {
        number: 4,
        answer: 'labour',
        passageKeyword: 'relatively little labour was required',
        questionKeyword: 'very little human labour was needed',
        thaiMeaning: 'แรงงาน',
        exactPortion: 'With these machines, relatively little labour was required to produce cloth'
      },
      {
        number: 5,
        answer: 'quality',
        passageKeyword: 'metals that were of a higher quality',
        questionKeyword: 'metal of higher quality',
        thaiMeaning: 'คุณภาพ',
        exactPortion: 'This method was cheaper and produced metals that were of a higher quality'
      },
      {
        number: 6,
        answer: 'railways',
        passageKeyword: 'expansion of the railways from the 1830s',
        questionKeyword: 'expansion of the railways from the 1830s',
        thaiMeaning: 'ทางรถไฟ',
        exactPortion: 'Britain’s iron and steel production to expand in response to demand created by the Napoleonic Wars (1803-15) and the expansion of the railways from the 1830s'
      },
      {
        number: 7,
        answer: 'sanitation',
        passageKeyword: 'overcrowded cities suffered from pollution and inadequate sanitation',
        questionKeyword: 'pollution and inadequate sanitation',
        thaiMeaning: 'สุขาภิบาล / ระบบสาธารณสุข',
        exactPortion: 'overcrowded cities suffered from pollution and inadequate sanitation'
      }
    ]
  },
  {
    examId: 'cambridge-14-test1-passage2',
    passageNumber: 2,
    startNumber: 23,
    endNumber: 26,
    sourceParagraphs: ['B', 'C'],
    instructions: [
      'Questions 23–26',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 23–26 on your answer sheet.'
    ],
    summaryTitle: 'The origins of bike-sharing',
    summaryLines: [
      {
        type: 'para',
        text:
          'The first urban bike-sharing scheme, called the Witte Fietsenplan, was launched in 1965 by Provo, a group of Dutch {23} who wanted to change society. They believed the scheme answered the threats of air pollution and {24}.'
      },
      { type: 'bullet', text: 'To spread their message, Provo painted some used bikes white and handed out {25} explaining the dangers of cars.' },
      { type: 'bullet', text: 'Almost as soon as the white bikes appeared on the streets, however, the {26} removed them.' }
    ],
    questions: [
      {
        number: 23,
        answer: 'activists',
        passageKeyword: 'a group of Dutch activists',
        questionKeyword: 'a group of Dutch activists',
        thaiMeaning: 'นักเคลื่อนไหว',
        exactPortion: 'Provo, the organization that came up with the idea, was a group of Dutch activists who wanted to change society'
      },
      {
        number: 24,
        answer: 'consumerism',
        passageKeyword: 'perceived threats of air pollution and consumerism',
        questionKeyword: 'threats of air pollution and consumerism',
        thaiMeaning: 'บริโภคนิยม',
        exactPortion: 'they believed the scheme … was an answer to the perceived threats of air pollution and consumerism'
      },
      {
        number: 25,
        answer: 'leaflets',
        passageKeyword: 'distributed leaflets describing the dangers of cars',
        questionKeyword: 'handed out leaflets',
        thaiMeaning: 'ใบปลิว',
        exactPortion: 'They also distributed leaflets describing the dangers of cars and inviting people to use the white bikes'
      },
      {
        number: 26,
        answer: 'police',
        passageKeyword: 'The police were opposed to Provo’s initiatives',
        questionKeyword: 'the police removed them',
        thaiMeaning: 'ตำรวจ',
        exactPortion: 'The police were opposed to Provo’s initiatives and almost as soon as the white bikes were distributed around the city, they removed them'
      }
    ]
  },
  {
    examId: 'cambridge-11-test2-passage2',
    passageNumber: 2,
    startNumber: 21,
    endNumber: 24,
    sourceParagraphs: ['B', 'C'],
    instructions: [
      'Questions 21–24',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 21–24 on your answer sheet.'
    ],
    summaryTitle: 'The decline of Easter Island',
    summaryLines: [
      {
        type: 'para',
        text:
          'Pollen evidence shows that Rapu Nui was once covered in palm forests, but the islanders cleared the trees for {21} and firewood. When they could no longer build {22} for fishing, they began eating {23} instead.'
      },
      {
        type: 'bullet',
        text: 'Some researchers believe the islanders moved the moai using wooden sledges and log rails, which required large amounts of {24} and many workers.'
      }
    ],
    questions: [
      {
        number: 21,
        answer: 'farming',
        passageKeyword: 'cleared the forests for firewood and farming',
        questionKeyword: 'cleared the trees for farming',
        thaiMeaning: 'การเกษตร',
        exactPortion: 'When the islanders cleared the forests for firewood and farming, the forests did not grow back'
      },
      {
        number: 22,
        answer: 'canoes',
        passageKeyword: 'construct wooden canoes for fishing',
        questionKeyword: 'build canoes for fishing',
        thaiMeaning: 'เรือพาย / เรือคานู',
        exactPortion: 'As trees became scarce and they could no longer construct wooden canoes for fishing, they ate birds'
      },
      {
        number: 23,
        answer: 'birds',
        passageKeyword: 'they ate birds',
        questionKeyword: 'began eating birds',
        thaiMeaning: 'นก',
        exactPortion: 'As trees became scarce and they could no longer construct wooden canoes for fishing, they ate birds'
      },
      {
        number: 24,
        answer: 'wood',
        passageKeyword: 'required both a lot of wood and a lot of people',
        questionKeyword: 'required large amounts of wood',
        thaiMeaning: 'ไม้',
        exactPortion: 'Diamond thinks they laid the moai on wooden sledges, hauled over log rails, but that required both a lot of wood and a lot of people'
      }
    ]
  },
  {
    examId: 'cambridge-13-test1-passage2',
    passageNumber: 2,
    startNumber: 24,
    endNumber: 26,
    sourceParagraphs: ['D', 'E'],
    instructions: [
      'Questions 24–26',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 24–26 on your answer sheet.'
    ],
    summaryTitle: 'Responses to boredom',
    summaryLines: [
      {
        type: 'para',
        text:
          'For John Eastwood, boredom means people cannot {24} because their attention system fails to engage. He also argues that people whose main life goal is {25} tend to cope poorly with boredom.'
      },
      {
        type: 'bullet',
        text: 'By contrast, people who show {26} usually have a higher boredom threshold and handle boredom more easily.'
      }
    ],
    questions: [
      {
        number: 24,
        answer: 'focus',
        passageKeyword: 'failure to put our attention system into gear',
        questionKeyword: 'cannot focus',
        thaiMeaning: 'โฟกัส / จดจ่อ',
        exactPortion: 'For Eastwood, the central feature of boredom is a failure to put our attention system into gear. This causes an inability to focus on anything'
      },
      {
        number: 25,
        answer: 'pleasure',
        passageKeyword: 'motivated by pleasure seem to suffer particularly badly',
        questionKeyword: 'main life goal is pleasure',
        thaiMeaning: 'ความสุข / ความพึงพอใจ',
        exactPortion: 'People who are motivated by pleasure seem to suffer particularly badly'
      },
      {
        number: 26,
        answer: 'curiosity',
        passageKeyword: 'curiosity, are associated with a high boredom threshold',
        questionKeyword: 'show curiosity',
        thaiMeaning: 'ความอยากรู้',
        exactPortion: 'Other personality traits, such as curiosity, are associated with a high boredom threshold'
      }
    ]
  },
  {
    examId: 'cambridge-15-test1-passage1',
    passageNumber: 1,
    startNumber: 1,
    endNumber: 4,
    sourceParagraphs: ['A', 'B'],
    instructions: [
      'Questions 1–4',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 1–4 on your answer sheet.'
    ],
    summaryTitle: 'The nutmeg tree and its products',
    summaryLines: [
      {
        type: 'para',
        text:
          'The leaves of the nutmeg tree are {1} in shape. The fruit is encased in a fleshy {2}, and the spice nutmeg comes from the {3} inside. The red covering of the seed is dried to produce {4}.'
      }
    ],
    questions: [
      {
        number: 1,
        answer: 'oval',
        passageKeyword: 'leaves are oval in shape',
        questionKeyword: 'leaves are oval in shape',
        thaiMeaning: 'รูปวงรี',
        exactPortion: 'The leaves are oval in shape'
      },
      {
        number: 2,
        answer: 'husk',
        passageKeyword: 'fleshy husk',
        questionKeyword: 'fleshy husk',
        thaiMeaning: 'เปลือก / เปลือกหุ้มผล',
        exactPortion: 'The fruit is encased in a fleshy husk'
      },
      {
        number: 3,
        answer: 'seed',
        passageKeyword: 'spice nutmeg is the seed',
        questionKeyword: 'spice nutmeg comes from the seed',
        thaiMeaning: 'เมล็ด',
        exactPortion: 'the spice nutmeg is the seed'
      },
      {
        number: 4,
        answer: 'mace',
        passageKeyword: 'red covering is dried to produce mace',
        questionKeyword: 'dried to produce mace',
        thaiMeaning: 'ดอกจันทน์เทศ',
        exactPortion: 'The red covering of the seed is dried to produce mace'
      }
    ]
  },
  {
    examId: 'cambridge-15-test1-passage1',
    passageNumber: 1,
    startNumber: 8,
    endNumber: 13,
    sourceParagraphs: ['E', 'G'],
    instructions: [
      'Questions 8–13',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 8–13 on your answer sheet.'
    ],
    summaryTitle: 'The history of the nutmeg trade',
    summaryLines: [
      {
        type: 'para',
        text:
          'In the 16th century, the {8} were the exclusive importers of nutmeg to Europe. Later, demand grew because the spice was thought to protect against the {9}.'
      },
      { type: 'bullet', text: 'The Dutch covered exported nutmeg with {10} so that fertile seeds could not be grown elsewhere.' },
      {
        type: 'para',
        text:
          'The Dutch later traded the island of {11} to Britain. In 1770, Pierre Poivre smuggled plants to {12}, and in 1778 a {13} destroyed half the nutmeg groves.'
      }
    ],
    questions: [
      {
        number: 8,
        answer: 'Arabs',
        passageKeyword: 'Arabs were the exclusive importers',
        questionKeyword: 'exclusive importers',
        thaiMeaning: 'ชาวอาหรับ',
        exactPortion: 'Throughout this period, the Arabs were the exclusive importers of the spice to Europe'
      },
      {
        number: 9,
        answer: 'plague',
        passageKeyword: 'dying of the plague',
        questionKeyword: 'protect against the plague',
        thaiMeaning: 'กาฬโรค',
        exactPortion: 'thousands of people across Europe were dying of the plague, a highly contagious and deadly disease'
      },
      {
        number: 10,
        answer: 'lime',
        passageKeyword: 'exported nutmeg was covered with lime',
        questionKeyword: 'covered exported nutmeg with lime',
        thaiMeaning: 'ปูนขาว',
        exactPortion: 'all exported nutmeg was covered with lime to make sure there was no chance a fertile seed which could be grown elsewhere would leave the islands'
      },
      {
        number: 11,
        answer: 'Run',
        passageKeyword: 'give them the island of Run',
        questionKeyword: 'traded the island of Run',
        thaiMeaning: 'เกาะรัน',
        exactPortion: 'if the British would give them the island of Run, they would in turn give Britain a distant and much less valuable island in North America'
      },
      {
        number: 12,
        answer: 'Mauritius',
        passageKeyword: 'smuggled nutmeg plants to safety in Mauritius',
        questionKeyword: 'smuggled plants to Mauritius',
        thaiMeaning: 'เกาะมอริเชียส',
        exactPortion: 'Pierre Poivre successfully smuggled nutmeg plants to safety in Mauritius, an island off the coast of Africa'
      },
      {
        number: 13,
        answer: 'tsunami',
        passageKeyword: 'volcanic eruption caused a tsunami',
        questionKeyword: 'a tsunami destroyed half the groves',
        thaiMeaning: 'สึนามิ',
        exactPortion: 'in 1778, a volcanic eruption in the Banda region caused a tsunami that wiped out half the nutmeg groves'
      }
    ]
  },
  {
    examId: 'builtin-reading-march-2026-passage-2-artists-ai',
    passageNumber: 2,
    startNumber: 21,
    endNumber: 26,
    sourceParagraphs: ['D', 'D'],
    instructions: [
      'Questions 21–26',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 21–26 on your answer sheet.'
    ],
    summaryTitle: 'How the Human-Led Studio method works',
    summaryLines: [
      {
        type: 'para',
        text: 'Lessons begin with an artist writing a clear {21}. The artist then gives the AI a set of visual {22}, such as a limited palette or a source photograph.'
      },
      { type: 'bullet', text: 'The AI produces several rough {23}.' },
      { type: 'bullet', text: 'The artist selects one version and makes manual {24}.' },
      { type: 'bullet', text: 'Each major decision is recorded in a process {25}.' },
      { type: 'bullet', text: 'Finally, the finished work should reveal human {26}.' }
    ],
    questions: [
      {
        number: 21,
        answer: 'intention',
        passageKeyword: 'writing a clear intention',
        questionKeyword: 'writing a clear intention',
        thaiMeaning: 'เจตนา / วัตถุประสงค์',
        exactPortion: 'Lessons in the method begin with an artist writing a clear intention.'
      },
      {
        number: 22,
        answer: 'constraints',
        passageKeyword: 'a set of visual constraints',
        questionKeyword: 'a set of visual constraints',
        thaiMeaning: 'ข้อจำกัด / เงื่อนไข',
        exactPortion: 'The artist gives the AI a set of visual constraints, such as a limited palette, a source photograph or a forbidden style.'
      },
      {
        number: 23,
        answer: 'drafts',
        passageKeyword: 'several rough drafts',
        questionKeyword: 'several rough drafts',
        thaiMeaning: 'ร่าง / ฉบับร่าง',
        exactPortion: 'The system then produces several rough drafts.'
      },
      {
        number: 24,
        answer: 'edits',
        passageKeyword: 'makes manual edits',
        questionKeyword: 'makes manual edits',
        thaiMeaning: 'การแก้ไข',
        exactPortion: 'The artist chooses one version, makes manual edits and records each major decision in a process log before continuing.'
      },
      {
        number: 25,
        answer: 'log',
        passageKeyword: 'records each major decision in a process log',
        questionKeyword: 'recorded in a process log',
        thaiMeaning: 'บันทึก / ล็อก',
        exactPortion: 'The artist chooses one version, makes manual edits and records each major decision in a process log before continuing.'
      },
      {
        number: 26,
        answer: 'authorship',
        passageKeyword: 'reveal human authorship',
        questionKeyword: 'reveal human authorship',
        thaiMeaning: 'ความเป็นเจ้าของผลงาน',
        exactPortion: 'the finished work should reveal human authorship'
      }
    ]
  },

  // ── Big Cats / rewilding: lynx (source Q19-22 → journey stage-2 P3 Q32-35) ──
  {
    examId: 'cambridge-12-test4-passage2',
    passageNumber: 1,
    startNumber: 19,
    endNumber: 22,
    sourceParagraphs: ['G', 'H'],
    instructions: [
      'Questions 19–22',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 19–22 on your answer sheet.'
    ],
    summaryTitle: 'The case for reintroducing the lynx',
    summaryLines: [
      {
        type: 'para',
        text: 'The lynx poses no {19} to people, as there is no record of one ever attacking a human. It is a specialist hunter of roe {20}, a species that has grown very numerous in Britain and is putting pressure on woodland wildlife.'
      },
      { type: 'bullet', text: 'Because it needs dense {21} for shelter, it would rarely come near farmland and is therefore unlikely to threaten sheep.' },
      {
        type: 'para',
        text: 'Bringing lynx back fits naturally with efforts to restore {22} to bare upland areas — an aim that many conservation projects across Britain already share.'
      }
    ],
    questions: [
      {
        number: 19,
        answer: 'threat',
        passageKeyword: 'presents no threat to human beings',
        questionKeyword: 'poses no threat to people',
        thaiMeaning: 'ภัยคุกคาม',
        exactPortion: 'The lynx presents no threat to human beings: there is no known instance of one preying on people.'
      },
      {
        number: 20,
        answer: 'deer',
        passageKeyword: 'specialist predator of roe deer',
        questionKeyword: 'specialist hunter of roe deer',
        thaiMeaning: 'กวาง',
        exactPortion: 'It is a specialist predator of roe deer, a species that has exploded in Britain in recent decades, holding woodland biodiversity in check.'
      },
      {
        number: 21,
        answer: 'cover',
        passageKeyword: 'The lynx requires deep cover',
        questionKeyword: 'needs dense cover for shelter',
        thaiMeaning: 'พุ่มไม้หนาทึบ / ที่กำบัง',
        exactPortion: 'The lynx requires deep cover, and as such presents little risk to sheep and other livestock, which are found mainly in the open.'
      },
      {
        number: 22,
        answer: 'forests',
        passageKeyword: 'bringing forests back',
        questionKeyword: 'efforts to restore forests',
        thaiMeaning: 'ป่า',
        exactPortion: 'The attempt to reintroduce this predator marries well with the aim of bringing forests back to parts of Scotland and northern England.'
      }
    ]
  },

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
      { type: 'bullet', text: 'One company in Indonesia has gone further, creating packaging that is not only capable of natural breakdown but is also {8}.' }
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
        text: 'Tidal stream technology generates electricity by positioning {5} in areas of fast-moving ocean current. Unlike tidal range systems, it does not require large {6} that obstruct the mouths of rivers, which makes it less damaging to surrounding environments.'
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
      { type: 'bullet', text: 'The result is a firm, dry product. At the end of its life, it can be placed in a {7} heap and will break down naturally within a few weeks, returning entirely to the {8}.' }
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
      !MANUAL_FILL_BLANK_SETS.some(
        (manual) =>
          manual.examId === set.examId &&
          manual.startNumber === set.startNumber &&
          manual.endNumber === set.endNumber
      )
  ),
  ...(journeySets as NewFillBlankSet[])
]

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
