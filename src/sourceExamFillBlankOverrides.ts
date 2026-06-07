import type { NewFillBlankSet } from './readingNewFillBlankQuestions.ts'

/**
 * Verbatim Cambridge fill-blank overrides keyed by source exam id (cambridge-*-passage*).
 * Remapped to journey-normal-stage-* at runtime via readingJourneyFillBlankLookup.ts.
 */
export const SOURCE_EXAM_FILL_BLANK_SETS: NewFillBlankSet[] = [
  {
    examId: 'cambridge-13-test3-passage1',
    passageNumber: 1,
    startNumber: 1,
    endNumber: 8,
    sourceParagraphs: ['B', 'D'],
    instructions: [
      'Questions 1–8',
      'Complete the table below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 1–8 on your answer sheet.'
    ],
    summaryTitle: 'The uses of the coconut palm',
    summaryLines: [
      { type: 'bullet', text: 'Coconut palm trunk — timber for houses and the making of {1}' },
      { type: 'bullet', text: 'Coconut palm flowers — sap used as a drink or source of {2}' },
      { type: 'bullet', text: 'Fruit middle layer (coir fibres) — used for {3}' },
      { type: 'bullet', text: 'Fruit inner layer (shell) — a source of {4}' },
      { type: 'bullet', text: 'Fruit inner layer (shell) — when halved, used for {5}' },
      { type: 'bullet', text: 'Coconut water — a source of {6} for other plants' },
      { type: 'bullet', text: 'Coconut flesh — oil and milk for cooking and {7}' },
      { type: 'bullet', text: 'Coconut flesh — glycerine (an ingredient in {8})' }
    ],
    questions: [
      {
        number: 1,
        answer: 'furniture',
        passageKeyword: 'furniture construction industry|timber for building houses',
        questionKeyword: 'making of furniture',
        thaiMeaning: 'ไม้ทำเฟอร์นิเจอร์',
        exactPortion:
          'This is an important source of timber for building houses, and is increasingly being used as a replacement for endangered hardwoods in the furniture construction industry'
      },
      {
        number: 2,
        answer: 'sugar',
        passageKeyword: 'reduced by boiling to produce a type of sugar',
        questionKeyword: 'source of sugar',
        thaiMeaning: 'น้ำตาล',
        exactPortion:
          'The flower stems may be tapped for their sap to produce a drink, and the sap can also be reduced by boiling to produce a type of sugar used for cooking'
      },
      {
        number: 3,
        answer: 'ropes',
        passageKeyword: 'particularly important in manufacturing ropes',
        questionKeyword: 'used for ropes',
        thaiMeaning: 'เชือก',
        exactPortion:
          "The thick fibrous middle layer produces coconut fibre, 'coir', which has numerous uses and is particularly important in manufacturing ropes"
      },
      {
        number: 4,
        answer: 'charcoal',
        passageKeyword: 'charcoal, which is widely used in various industries',
        questionKeyword: 'source of charcoal',
        thaiMeaning: 'ถ่าน',
        exactPortion:
          'An important product obtained from the shell is charcoal, which is widely used in various industries as well as in the home as a cooking fuel'
      },
      {
        number: 5,
        answer: 'bowls',
        passageKeyword: 'used as bowls in many parts of Asia',
        questionKeyword: 'when halved for bowls',
        thaiMeaning: 'ชาม',
        exactPortion: 'When broken in half, the shells are also used as bowls in many parts of Asia'
      },
      {
        number: 6,
        answer: 'hormones',
        passageKeyword: 'provides the hormones which encourage other plants',
        questionKeyword: 'source of hormones',
        thaiMeaning: 'ฮอร์โมน',
        exactPortion:
          'Initially, the endosperm is a sweetish liquid, coconut water, which is enjoyed as a drink, but also provides the hormones which encourage other plants to grow more rapidly and produce higher yields'
      },
      {
        number: 7,
        answer: 'cosmetics',
        passageKeyword: 'as well as in cosmetics',
        questionKeyword: 'oil and milk for cosmetics',
        thaiMeaning: 'เครื่องสำอาง',
        exactPortion:
          "Dried coconut flesh, 'copra', is made into coconut oil and coconut milk, which are widely used in cooking in different parts of the world, as well as in cosmetics"
      },
      {
        number: 8,
        answer: 'dynamite',
        passageKeyword: 'nitroglycerine-based invention: dynamite',
        questionKeyword: 'ingredient in dynamite',
        thaiMeaning: 'ไดนาไมต์',
        exactPortion:
          'A derivative of coconut fat, glycerine, acquired strategic importance in a quite different sphere, as Alfred Nobel introduced the world to his nitroglycerine-based invention: dynamite'
      }
    ]
  },
  {
    examId: 'cambridge-17-test3-passage1',
    passageNumber: 1,
    startNumber: 1,
    endNumber: 5,
    sourceParagraphs: ['B', 'C'],
    instructions: [
      'Questions 1–5',
      'Complete the notes below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 1–5 on your answer sheet.'
    ],
    summaryTitle: 'The thylacine',
    summaryLines: [
      { type: 'heading', text: 'Appearance and behaviour' },
      { type: 'bullet', text: 'looked rather like a dog' },
      { type: 'bullet', text: 'had a series of stripes along its body and tail' },
      { type: 'bullet', text: 'ate an entirely {1} diet' },
      { type: 'bullet', text: 'probably depended mainly on {2} when hunting' },
      { type: 'bullet', text: "young spent first months of life inside its mother's {3}" },
      { type: 'heading', text: 'Decline and extinction' },
      { type: 'bullet', text: 'last evidence in mainland Australia is a 3,100-year-old {4}' },
      { type: 'bullet', text: 'probably went extinct in mainland Australia due to animals known as dingoes' },
      {
        type: 'bullet',
        text: 'reduction in {5} and available sources of food were partly responsible for decline in Tasmania'
      }
    ],
    questions: [
      {
        number: 1,
        answer: 'carnivorous',
        passageKeyword: 'exclusively carnivorous',
        questionKeyword: 'ate an entirely diet',
        thaiMeaning: 'กินเนื้อ',
        exactPortion:
          'In terms of feeding, it was exclusively carnivorous, and its stomach was muscular with an ability to distend so that it could eat large amounts of food at one time'
      },
      {
        number: 2,
        answer: 'scent',
        passageKeyword: 'relied more on scent than any other sense',
        questionKeyword: 'probably depended mainly on',
        thaiMeaning: 'กลิ่น',
        exactPortion:
          'During long-distance chases, thylacines were likely to have relied more on scent than any other sense.'
      },
      {
        number: 3,
        answer: 'pouch',
        passageKeyword: 'crawled into the pouch on the belly',
        questionKeyword: "young spent first months inside mother's",
        thaiMeaning: 'ถุงหน้าท้อง',
        exactPortion:
          'Newborns crawled into the pouch on the belly of their mother, and attached themselves to one of the four teats, remaining there for up to three months.'
      },
      {
        number: 4,
        answer: 'fossil',
        passageKeyword: 'carbon-dated fossil around 3,100 years old',
        questionKeyword: 'last evidence 3,100-year-old',
        thaiMeaning: 'ฟอสซิล',
        exactPortion:
          'The most recent, well-dated occurrence of a thylacine on the mainland is a carbon-dated fossil from Murray Cave in Western Australia, which is around 3,100 years old.'
      },
      {
        number: 5,
        answer: 'habitat',
        passageKeyword: 'open eucalyptus forest its prime habitat',
        questionKeyword: 'reduction in',
        thaiMeaning: 'ถิ่นที่อยู่อาศัย',
        exactPortion:
          'The thylacine appeared to occupy most types of terrain except dense rainforest, with open eucalyptus forest thought to be its prime habitat.'
      }
    ]
  },
  {
    examId: 'cambridge-18-test3-passage1',
    passageNumber: 1,
    startNumber: 5,
    endNumber: 8,
    sourceParagraphs: ['D', 'E'],
    instructions: [
      'Questions 5–8',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 5–8 on your answer sheet.'
    ],
    summaryTitle: 'Making buildings with wood',
    summaryLines: [
      {
        type: 'para',
        text: 'Wood is a traditional building material, but current environmental concerns are encouraging {5} to use wood in modern construction projects. Using wood, however, has its challenges. For example, as {6} in the atmosphere enters wood, it increases in size. In addition, wood is prone to pests and the risk of fire is greater. However, wood can be turned into a better construction material if it is treated and combined with other materials. In one process, {7} of solid wood are glued together to create building blocks. These blocks are lighter than concrete and steel but equal them in strength. Experts say that wooden buildings are an improvement on those made of concrete and steel in terms of the {8} with which they can be constructed and how much noise is generated by the process.'
      }
    ],
    questions: [
      {
        number: 5,
        answer: 'architects',
        passageKeyword: 'climate change driving architects turn timber',
        questionKeyword: 'environmental concerns encouraging to use wood',
        thaiMeaning: 'สถาปนิก',
        exactPortion:
          'but climate change is driving architects to turn to treated timber as a possible resource.'
      },
      {
        number: 6,
        answer: 'moisture',
        passageKeyword: 'wood expands absorbs moisture from air',
        questionKeyword: 'as in the atmosphere enters wood',
        thaiMeaning: 'ความชื้น',
        exactPortion:
          'Wood expands as it absorbs moisture from the air and is susceptible to pests, not to mention fire.'
      },
      {
        number: 7,
        answer: 'layers',
        passageKeyword: 'stick layers of solid-sawn timber together',
        questionKeyword: 'of solid wood are glued together',
        thaiMeaning: 'ชั้น',
        exactPortion:
          'An adhesive is used to stick layers of solid-sawn timber together, crosswise, to form building blocks.'
      },
      {
        number: 8,
        answer: 'speed',
        passageKeyword: 'wooden buildings constructed greater speed quieter',
        questionKeyword: 'in terms of the with which they can be constructed',
        thaiMeaning: 'ความเร็ว',
        exactPortion:
          'Construction experts say that wooden buildings can be constructed at a greater speed than ones of concrete and steel and the process, it seems, is quieter.'
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
      'Complete the notes below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 8–13 on your answer sheet.'
    ],
    summaryTitle: "Moore's career as an artist",
    summaryLines: [
      { type: 'heading', text: '1930s' },
      { type: 'bullet', text: "Moore's exhibition at the Leicester Galleries is criticised by the press" },
      { type: 'bullet', text: 'Moore is urged to offer his {8} and leave the Royal College' },
      { type: 'heading', text: '1940s' },
      { type: 'bullet', text: 'Moore turns to drawing because {9} for sculpting are not readily available' },
      { type: 'bullet', text: 'While visiting his hometown, Moore does some drawings of the {10} who worked there' },
      { type: 'bullet', text: 'Moore is employed to produce a sculpture of a {11}' },
      { type: 'bullet', text: '{12} start to buy Moore’s work' },
      {
        type: 'bullet',
        text: 'Moore’s increased {13} makes it possible for him to do more ambitious sculptures'
      },
      { type: 'heading', text: '1950s' },
      { type: 'bullet', text: 'Moore’s series of bronze figures marks a further change in his style' }
    ],
    questions: [
      {
        number: 8,
        answer: 'resignation',
        passageKeyword: 'calls for his resignation from the Royal College',
        questionKeyword: 'urged to offer his and leave the Royal College',
        thaiMeaning: 'การลาออก',
        exactPortion: 'There were calls for his resignation from the Royal College'
      },
      {
        number: 9,
        answer: 'materials',
        passageKeyword: 'shortage of materials forced him to focus on drawing',
        questionKeyword: 'for sculpting are not readily available',
        thaiMeaning: 'วัสดุ',
        exactPortion: 'A shortage of materials forced him to focus on drawing.'
      },
      {
        number: 10,
        answer: 'miners',
        passageKeyword: 'sketches of the miners who worked there',
        questionKeyword: 'drawings of the who worked there',
        thaiMeaning: 'คนงานเหมือง',
        exactPortion: 'he returned to Castleford to make a series of sketches of the miners who worked there'
      },
      {
        number: 11,
        answer: 'family',
        passageKeyword: 'commission for a sculpture depicting a family',
        questionKeyword: 'produce a sculpture of a',
        thaiMeaning: 'ครอบครัว',
        exactPortion: 'offered Moore a commission for a sculpture depicting a family'
      },
      {
        number: 12,
        answer: 'collectors',
        passageKeyword: 'became available to collectors all over the world',
        questionKeyword: 'start to buy Moore’s work',
        thaiMeaning: 'นักสะสม',
        exactPortion: "Moore's work became available to collectors all over the world"
      },
      {
        number: 13,
        answer: 'income',
        passageKeyword: 'boost to his income enabled him to take on ambitious projects',
        questionKeyword: 'Moore’s increased makes it possible',
        thaiMeaning: 'รายได้',
        exactPortion: 'The boost to his income enabled him to take on ambitious projects'
      }
    ]
  },
  {
    examId: 'cambridge-18-test4-passage1',
    passageNumber: 1,
    startNumber: 6,
    endNumber: 9,
    sourceParagraphs: ['A', 'B'],
    instructions: [
      'Questions 6–9',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 6–9 on your answer sheet.'
    ],
    summaryTitle: 'Advantages of green roofs',
    summaryLines: [
      {
        type: 'para',
        text: 'City rooftops covered with greenery have many advantages. These include lessening the likelihood that floods will occur, reducing how much money is spent on {6} and creating environments that are suitable for wildlife. In many cases, they can also be used for producing {7}.'
      },
      {
        type: 'para',
        text: 'There are also social benefits of green roofs. For example, the medical profession recommends {8} as an activity to help people cope with mental health issues. Studies have also shown that the availability of green spaces can prevent physical problems such as {9}.'
      }
    ],
    questions: [
      {
        number: 6,
        answer: 'energy',
        passageKeyword: 'saving on energy costs',
        questionKeyword: 'reducing how much money is spent on',
        thaiMeaning: 'พลังงาน',
        exactPortion: 'Among the benefits are saving on energy costs,'
      },
      {
        number: 7,
        answer: 'food',
        passageKeyword: 'even growing food',
        questionKeyword: 'used for producing',
        thaiMeaning: 'อาหาร',
        exactPortion:
          'mitigating the risk of floods, making habitats for urban wildlife, tackling air pollution and even growing food.'
      },
      {
        number: 8,
        answer: 'gardening',
        passageKeyword: 'prescribing time spent gardening outdoors',
        questionKeyword: 'the medical profession recommends as an activity',
        thaiMeaning: 'การทำสวน',
        exactPortion:
          'Doctors are increasingly prescribing time spent gardening outdoors for patients dealing with anxiety and depression.'
      },
      {
        number: 9,
        answer: 'obesity',
        passageKeyword: 'help people avoid obesity',
        questionKeyword: 'prevent physical problems such as',
        thaiMeaning: 'โรคอ้วน',
        exactPortion:
          'And research has found that access to even the most basic green spaces can provide a better quality of life for dementia sufferers and help people avoid obesity.'
      }
    ]
  },
  {
    examId: 'cambridge-18-test3-passage2',
    passageNumber: 1,
    startNumber: 24,
    endNumber: 26,
    sourceParagraphs: ['E', 'H'],
    instructions: [
      'Questions 24–26',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 24–26 on your answer sheet.'
    ],
    summaryTitle: 'The steam car',
    summaryLines: [
      {
        type: 'para',
        text: "With these enhancements, the Dobles' new car company promised a steam vehicle which would provide all of the convenience of a gasoline car, but with much greater {24}, much simpler driving controls, and a virtually silent powerplant, while keeping its emissions extremely low. The steam car was too expensive for many people and its design was constantly being altered. By the time the company folded in 1931, fewer than {25} of the amazing Model E steam cars had been produced. Astonishingly, an unmodified Doble Model E runs clean enough to pass the emissions laws in California today, and they are pretty {26}."
      }
    ],
    questions: [
      {
        number: 24,
        answer: 'speed',
        passageKeyword: 'much greater speed, much simpler driving controls',
        questionKeyword: 'but with much greater',
        thaiMeaning: 'ความเร็ว',
        exactPortion:
          "With these enhancements, the Dobles' new car company promised a steam vehicle which would provide all of the convenience of a gasoline car, but with much greater speed, much simpler driving controls, and a virtually silent powerplant."
      },
      {
        number: 25,
        answer: '50',
        passageKeyword: 'fewer than fifty of the amazing Model E steam cars had been produced',
        questionKeyword: 'By the time the company folded in 1931, fewer than',
        thaiMeaning: 'ห้าสิบ',
        exactPortion:
          'By the time the company folded in 1931, fewer than fifty of the amazing Model E steam cars had been produced.',
        acceptedAnswers: ['fifty', '50']
      },
      {
        number: 26,
        answer: 'strict',
        passageKeyword: 'they are pretty strict',
        questionKeyword: 'and they are pretty',
        thaiMeaning: 'เข้มงวด',
        exactPortion:
          'Astonishingly, an unmodified Doble Model E runs clean enough to pass the emissions laws in California today, and they are pretty strict.'
      }
    ]
  },
  {
    examId: 'cambridge-16-test3-passage2',
    passageNumber: 1,
    startNumber: 20,
    endNumber: 22,
    sourceParagraphs: ['B', 'C'],
    instructions: [
      'Questions 20–22',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 20–22 on your answer sheet.'
    ],
    summaryTitle: 'Interesting finds at an archaeological site',
    summaryLines: [
      {
        type: 'para',
        text: 'Organic materials such as animal skins and textiles are not discovered very often at archaeological sites. They have little protection against {20}, which means that they decay relatively quickly.'
      },
      {
        type: 'para',
        text: 'But this is not always the case. If temperatures are low enough, fragile artefacts can be preserved for thousands of years.'
      },
      {
        type: 'para',
        text: 'A team of archaeologists have been working in the mountains in Oppland in Norway to recover artefacts revealed by shrinking ice cover.'
      },
      {
        type: 'para',
        text: 'In the past, there were trade routes through these mountains and {21} gathered there in the summer months to avoid being attacked by {22} on lower ground. The people who used these mountains left things behind and it is those objects that are of interest to archaeologists.'
      }
    ],
    questions: [
      {
        number: 20,
        answer: 'microorganisms',
        passageKeyword: 'protected from the microorganisms that cause decay',
        questionKeyword: 'little protection against',
        thaiMeaning: 'จุลินทรีย์',
        exactPortion:
          "This is because unless they're protected from the microorganisms that cause decay, they tend not to last long.",
        acceptedAnswers: ['micro-organisms']
      },
      {
        number: 21,
        answer: 'reindeer',
        passageKeyword: 'Reindeer once congregated on these icy patches in the later summer months',
        questionKeyword: 'gathered there in the summer months',
        thaiMeaning: 'กวางเรนเดียร์',
        exactPortion: 'Reindeer once congregated on these icy patches in the later summer months'
      },
      {
        number: 22,
        answer: 'insects',
        passageKeyword: 'to escape biting insects',
        questionKeyword: 'avoid being attacked by on lower ground',
        thaiMeaning: 'แมลง',
        exactPortion: 'to escape biting insects'
      }
    ]
  },
  {
    examId: 'cambridge-10-test2-passage2',
    passageNumber: 1,
    startNumber: 23,
    endNumber: 26,
    sourceParagraphs: ['A', 'B'],
    instructions: [
      'Questions 23–26',
      'Choose NO MORE THAN THREE WORDS from the passage for each answer.',
      'Write your answers in boxes 23–26 on your answer sheet.'
    ],
    summaryLines: [
      {
        type: 'bullet',
        text: "One study found a strong connection between children's IQ and the availability of {23} and {23} at home."
      },
      {
        type: 'bullet',
        text: 'Children of average ability seem to need more direction from teachers because they do not have {24}.'
      },
      {
        type: 'bullet',
        text: 'Meta-cognition involves children understanding their own learning strategies, as well as developing {25}.'
      },
      {
        type: 'bullet',
        text: 'Teachers who rely on what is known as {26} often produce sets of impressive grades in class tests.'
      }
    ],
    questions: [
      {
        number: 23,
        answer: 'activities',
        passageKeyword: 'number of books and activities in their home',
        questionKeyword: 'availability of and at home',
        thaiMeaning: 'หนังสือและกิจกรรม',
        exactPortion:
          "The higher the children's IQ scores, especially over IQ 130, the better the quality of their educational backup, measured in terms of reported verbal interactions with parents, number of books and activities in their home etc.",
        acceptedAnswers: ['activities', 'books', 'books and activities', 'activities and books']
      },
      {
        number: 24,
        answer: 'internal regulation',
        passageKeyword: 'lack of internal regulation',
        questionKeyword: 'they do not have',
        thaiMeaning: 'การควบคุมตนเอง',
        exactPortion:
          'There appears to be a qualitative difference in the way the intellectually highly able think, compared with more average-ability or older pupils, for whom external regulation by the teacher often compensates for lack of internal regulation.',
        acceptedAnswers: ['internal regulation', 'self-regulation']
      },
      {
        number: 25,
        answer: 'emotional awareness',
        passageKeyword: 'Emotional awareness is also part of metacognition',
        questionKeyword: 'as well as developing',
        thaiMeaning: 'ความตระหนักทางอารมณ์',
        exactPortion:
          'Emotional awareness is also part of metacognition, so children should be helped to be aware of their feelings around the area to be learned, feelings of curiosity or confidence, for example.',
        acceptedAnswers: ['emotional awareness']
      },
      {
        number: 26,
        answer: 'spoon-feeding',
        passageKeyword: "spoon-feeding can produce extremely high examination results",
        questionKeyword: 'Teachers who rely on what is known as',
        thaiMeaning: 'การป้อนความรู้',
        exactPortion: "Although 'spoon-feeding' can produce extremely high examination results",
        acceptedAnswers: ['spoon-feeding']
      }
    ]
  }
]
