/**
 * IELTS placement test — content and gates.
 *
 * The test is deliberately short and gate-based: an easy set decides whether the
 * student clears a floor, and only then does a harder set decide how far above it
 * they sit. Failing a gate ends that skill immediately, so the band a student is
 * given is always the band the gate they failed describes.
 *
 * Band ladders here are the teacher's own, calibrated on English Plan's student
 * data. They are not the official Cambridge raw-score tables and should not be
 * "corrected" toward them.
 */

export type PlacementBandKey = 'below5.5' | '5.5-6' | '6' | '6-6.5' | '6.5' | '6.5-7' | '7plus'

export const PLACEMENT_BAND_LABELS: Record<PlacementBandKey, string> = {
  'below5.5': 'ต่ำกว่า 5.5',
  '5.5-6': '5.5–6.0',
  '6': '6.0',
  '6-6.5': '6.0–6.5',
  '6.5': '6.5',
  '6.5-7': '6.5–7.0',
  '7plus': '7.0 ขึ้นไป'
}

/** Midpoint used only for the overall estimate; "7 or above" is treated as a flat 7. */
export const PLACEMENT_BAND_MIDPOINTS: Record<PlacementBandKey, number> = {
  'below5.5': 5,
  '5.5-6': 5.75,
  '6': 6,
  '6-6.5': 6.25,
  '6.5': 6.5,
  '6.5-7': 6.75,
  '7plus': 7
}

/* ------------------------------------------------------------------ reading */

export type PlacementTfngAnswer = 'TRUE' | 'FALSE' | 'NOT GIVEN'

export type PlacementTfngQuestion = {
  id: string
  statement: string
  /**
   * The sentence the answer turns on, plus a sentence or two either side. Reading
   * speed and searching are removed on purpose — this gate tests interpretation.
   */
  context: string
  /** The part of `context` that actually decides it, highlighted after answering. */
  evidence: string
  answer: PlacementTfngAnswer
  explanationThai: string
}

export type PlacementHeadingQuestion = {
  id: string
  paragraphLabel: string
  paragraph: string
  options: Array<{ key: string; text: string }>
  answer: string
  explanationThai: string
}

/**
 * Both reading gates come from the same passage — "Mission to Collect Materials
 * on the Moon" — so a student is never re-orienting to a new topic mid-test.
 */
export const PLACEMENT_READING_PASSAGE_TITLE = 'Mission to Collect Materials on the Moon'

export const PLACEMENT_READING_TFNG: PlacementTfngQuestion[] = [
  {
    id: 'reading-tfng-1',
    statement: 'The lunar rocks that were brought back are essential to understanding the history of our planet.',
    context:
      'Surprisingly, this episode in the history of the solar system has come to be known as the last heavy bombardment and ended at roughly the same time as the first signs of life on earth. These key discoveries about our planet’s history may never have been made without the samples taken from the moon for chemical analysis and isotopic dating. So, do the Apollo rocks hide any more secrets? All 2,200 samples have been researched, and Randy Korotev, a lunar geochemist at Washington University in St Louis, Missouri, says that it is unlikely that there will be anything groundbreaking left to find from them.',
    evidence:
      'These key discoveries about our planet’s history may never have been made without the samples taken from the moon for chemical analysis and isotopic dating.',
    answer: 'TRUE',
    explanationThai:
      'ประโยคในบทความบอกว่าการค้นพบสำคัญเหล่านี้ "may never have been made without the samples" คือถ้าไม่มีตัวอย่างหินก็อาจไม่มีการค้นพบเลย ซึ่งตรงกับคำว่า essential ในโจทย์ครับ'
  },
  {
    id: 'reading-tfng-2',
    statement: 'All the craters on the moon are roughly the same age, at up to five billion years old.',
    context:
      'This history of all the inner planets has been shaped by collisions and nowhere is that history more visible than the moon. Another surprise was the rocks from the moon’s largest impact craters indicate that all craters are roughly the same age, between 3.8 and 4 billion years old. The moon and, by extension, the Earth must have been caused by a devastating barrage half a billion years after the solar system formed.',
    evidence: 'all craters are roughly the same age, between 3.8 and 4 billion years old',
    answer: 'FALSE',
    explanationThai:
      'บทความเห็นด้วยว่าหลุมอุกกาบาตอายุใกล้เคียงกัน แต่ระบุตัวเลขชัดว่า 3.8–4 พันล้านปี ไม่ใช่ถึง 5 พันล้านปี ตัวเลขที่ขัดกันแบบนี้คือ FALSE ไม่ใช่ NOT GIVEN ครับ'
  },
  {
    id: 'reading-tfng-3',
    statement:
      'The rocks collected by Neil Armstrong and Buzz Aldrin were more valuable than the rocks collected by Russian astronauts.',
    context:
      'Whilst the world watched in excitement as Neil Armstrong and Buzz Aldrin landed on the moon, planetary scientists were focused on something else. For them, the value of the mission was the cargo they brought back to earth. By the time Armstrong and Aldrin climbed into the lunar module for the last time, they had gathered 22 kilograms of moon rocks, completely filling a small suitcase. Over five Apollo crews brought back a total collection of 382 kilograms of material containing 2,200 samples.',
    evidence: 'they had gathered 22 kilograms of moon rocks, completely filling a small suitcase',
    answer: 'NOT GIVEN',
    explanationThai:
      'บทความพูดถึงคุณค่าของหินที่ Apollo เก็บมา แต่ไม่เคยเอ่ยถึงนักบินอวกาศรัสเซียเลย จึงเปรียบเทียบไม่ได้ — ไม่มีข้อมูล = NOT GIVEN ครับ'
  }
]

/**
 * Heading options are chosen so the wrong ones bait a word-match rather than a
 * meaning-match: "giant impact" pulls toward "The impact of the rocks
 * discovered", and Gary Lofgren being a NASA curator pulls toward "NASA's lunar
 * rock collection".
 */
export const PLACEMENT_READING_HEADINGS: PlacementHeadingQuestion[] = [
  {
    id: 'reading-heading-1',
    paragraphLabel: 'Paragraph C',
    paragraph:
      'Many clues that the lunar rocks contained have taken a couple of years to effectively analyse. Also, some of the conclusions are still debated. A big surprise was the evidence that the early moon was covered by a lot of molten rock. The moon’s mountainous regions are made of anorthosite, a rare rock on earth that forms when light, aluminium-rich minerals float to the top of lava.',
    options: [
      { key: 'i', text: 'The scientific value of the rocks' },
      { key: 'ii', text: 'The craters of the moon' },
      { key: 'v', text: 'The surprising evidence about the moon' },
      { key: 'ix', text: 'Study of lunar history' }
    ],
    answer: 'v',
    explanationThai:
      'ย่อหน้านี้วางน้ำหนักไว้ที่คำว่า "A big surprise was the evidence…" คือหลักฐานที่คาดไม่ถึงเรื่องหินหลอมเหลวบนดวงจันทร์ ตัวเลือก ix "Study of lunar history" กว้างเกินไปและใช้ได้กับเกือบทุกย่อหน้า ส่วน i เป็นใจความของย่อหน้า B ครับ'
  },
  {
    id: 'reading-heading-2',
    paragraphLabel: 'Paragraph E',
    paragraph:
      'The “giant impact” scenario led to a radical re-evaluation of the history of the early solar system. Before Apollo, planetary scientists watched the collection of objects orbiting the sun like a clockwork mechanism in which collisions were rare and trivial. Now, it is accepted as being a far more active environment, shuffling, colliding or ejecting. This history of all the inner planets has been shaped by collisions and nowhere is that history more visible than the moon.',
    options: [
      { key: 'iii', text: 'The mission to collect material on the moon' },
      { key: 'iv', text: 'The impact of the rocks discovered' },
      { key: 'vi', text: 'The history of the early solar system' },
      { key: 'ii', text: 'The craters of the moon' }
    ],
    answer: 'vi',
    explanationThai:
      'กับดักคือคำว่า "impact" ในตัวเลือก iv ที่ไปตรงกับ "giant impact" ในย่อหน้า แต่ย่อหน้านี้ไม่ได้พูดถึงผลกระทบของหิน — พูดถึงการที่นักวิทยาศาสตร์ต้องประเมินประวัติของระบบสุริยะยุคแรกใหม่ทั้งหมด จึงตอบ vi ครับ'
  },
  {
    id: 'reading-heading-3',
    paragraphLabel: 'Paragraph I',
    paragraph:
      'The Apollo rock samples are not finished answering some of the bigger picture questions. What will we discover on the opposite side of the moon’s surface that we are unable to see from the Earth? Can we put together a detailed history of the lava flows that formed the basalts of the lunar seas? Can we discover any samples from deep inside the moon? These are all seen as very good reasons for coming back to the moon. According to Gary Lofgren, a curator of NASA’s lunar rock collection at Johnson Space Centre in Houston, “There’s no lack of target and scientific questions.”',
    options: [
      { key: 'vii', text: 'The unknown questions left for the future' },
      { key: 'viii', text: 'NASA’s lunar rock collection' },
      { key: 'ix', text: 'Study of lunar history' },
      { key: 'ii', text: 'The craters of the moon' }
    ],
    answer: 'vii',
    explanationThai:
      'กับดักคือชื่อ Gary Lofgren ที่เป็น "curator of NASA’s lunar rock collection" ทำให้ตัวเลือก viii ดูเข้าเค้า แต่เขาถูกอ้างถึงเพียงเพื่อสนับสนุนใจความหลัก คือคำถามที่ยังไม่มีคำตอบและเหตุผลที่ควรกลับไปดวงจันทร์อีก จึงตอบ vii ครับ'
  }
]

/* ---------------------------------------------------------------- listening */

export type PlacementListeningQuestion = {
  id: string
  /** Number shown to the student, renumbered 1..n rather than the Cambridge number. */
  number: number
  noteLine: string
  acceptedAnswers: string[]
  options?: Array<{ key: string; text: string }>
  explanationThai: string
}

export type PlacementListeningClip = {
  id: string
  titleThai: string
  /**
   * Pinned to engnovate. The other host in `listeningCambridgeAudioUrls` cannot be
   * used here: its timeline is unverified and, at the time of writing, it serves
   * an HTML block page instead of audio.
   */
  audioUrl: string
  /**
   * Whole-file duration in seconds as measured when the offsets below were taken.
   * The player refuses to clip when the loaded file disagrees, because a moved or
   * re-encoded file would otherwise play the wrong hundred seconds silently
   * instead of failing loudly.
   */
  expectedFileDuration: number
  startSeconds: number
  endSeconds: number
  noteHeading: string
  questions: PlacementListeningQuestion[]
}

/**
 * All three clips are Cambridge 17 Test 2 — the book the July audit verified at
 * 97% healthy, and one test so the student stays in one voice and register.
 * Offsets were measured against the real audio and confirmed by transcribing the
 * cut clip: every answer for the clip is inside it, and the next question's
 * answer is not.
 */
export const PLACEMENT_LISTENING_SECTION_1: PlacementListeningClip = {
  id: 'listening-section-1',
  titleThai: 'Section 1 · งานอาสาสมัครในหมู่บ้าน',
  audioUrl: 'https://engnovate.com/wp-content/uploads/2023/07/cambridge-ielts-17-academic-listening-2-audio-1.mp3',
  expectedFileDuration: 473.48,
  startSeconds: 89,
  endSeconds: 186.5,
  noteHeading: 'Volunteer work — Library',
  questions: [
    {
      id: 'listening-s1-q1',
      number: 1,
      noteLine: 'Help with ______ books (times to be arranged)',
      acceptedAnswers: ['collecting'],
      explanationThai: 'ในเสียงพูดว่า "one thing you could do is get involved in collecting them" ครับ'
    },
    {
      id: 'listening-s1-q2',
      number: 2,
      noteLine: 'Help needed to keep ______ of books up to date',
      acceptedAnswers: ['records'],
      explanationThai: 'ในเสียงพูดว่า "another thing is the records that we keep of the books" ครับ'
    },
    {
      id: 'listening-s1-q3',
      number: 3,
      noteLine: 'Library is in the ______ Room in the village hall',
      acceptedAnswers: ['west'],
      explanationThai: 'ในเสียงพูดว่า "we simply have the use of a room in the village hall. The West Room." ครับ'
    },
    {
      id: 'listening-s1-q4',
      number: 4,
      noteLine: 'Lunch club: help by providing ______',
      acceptedAnswers: ['transport'],
      explanationThai: 'ในเสียงพูดว่า "I could help with transport, if that\'s of any use." ครับ'
    }
  ]
}

export const PLACEMENT_LISTENING_SECTION_2: PlacementListeningClip = {
  id: 'listening-section-2',
  titleThai: 'Section 2 · Oniton Hall',
  audioUrl: 'https://engnovate.com/wp-content/uploads/2023/07/cambridge-ielts-17-academic-listening-2-audio-2.mp3',
  expectedFileDuration: 444.08,
  startSeconds: 46,
  endSeconds: 201,
  noteHeading: 'Choose the correct letter, A, B or C.',
  questions: [
    {
      id: 'listening-s2-q1',
      number: 1,
      noteLine: 'Many past owners made changes to',
      options: [
        { key: 'A', text: 'the gardens.' },
        { key: 'B', text: 'the house.' },
        { key: 'C', text: 'the farm.' }
      ],
      acceptedAnswers: ['B'],
      explanationThai:
        'ในเสียงพูดว่าเจ้าของเกือบทุกคน "left their mark, generally by adding new rooms… or by demolishing others" คือเปลี่ยนแปลงตัวบ้าน ส่วนสวนดอกไม้เป็นผลงานของเจ้าของ "current" คนเดียว ไม่ใช่หลายคนในอดีตครับ'
    },
    {
      id: 'listening-s2-q2',
      number: 2,
      noteLine: 'Sir Edward Downes built Oniton Hall because he wanted',
      options: [
        { key: 'A', text: 'a place for discussing politics.' },
        { key: 'B', text: 'a place to display his wealth.' },
        { key: 'C', text: 'a place for artists and writers.' }
      ],
      acceptedAnswers: ['C'],
      explanationThai:
        'ในเสียงพูดว่าเขา "hosted meetings of creative and literary people, like painters and poets" — ส่วนการเมืองเป็นสิ่งที่เขาต้องการ "escape from" จึงไม่ใช่ A ครับ'
    },
    {
      id: 'listening-s2-q3',
      number: 3,
      noteLine: 'Visitors can learn about the work of servants in the past from',
      options: [
        { key: 'A', text: 'audio guides.' },
        { key: 'B', text: 'photographs.' },
        { key: 'C', text: 'people in costume.' }
      ],
      acceptedAnswers: ['C'],
      explanationThai:
        'ในเสียงพูดว่า "you\'ll see volunteers dressed up as nineteenth-century servants" และบอกด้วยว่าสิ่งนี้มา "replace the audio guide we used to have" คือ audio guide เลิกใช้แล้ว ส่วนรูปถ่าย "don\'t give much of an idea" ครับ'
    }
  ]
}

export const PLACEMENT_LISTENING_SECTION_4: PlacementListeningClip = {
  id: 'listening-section-4',
  titleThai: 'Section 4 · ภาษาไอซ์แลนด์กับเทคโนโลยีดิจิทัล',
  audioUrl: 'https://engnovate.com/wp-content/uploads/2023/07/cambridge-ielts-17-academic-listening-2-audio-4.mp3',
  expectedFileDuration: 433.39,
  startSeconds: 71,
  endSeconds: 169.5,
  noteHeading: 'The impact of digital technology on the Icelandic language',
  questions: [
    {
      id: 'listening-s4-q1',
      number: 1,
      noteLine: 'Icelandic has approximately ______ speakers',
      acceptedAnswers: ['321000', '321,000'],
      explanationThai: 'ในเสียงพูดว่า "spoken by around 321,000 people" ครับ'
    },
    {
      id: 'listening-s4-q2',
      number: 2,
      noteLine: 'It has a ______ that is still growing',
      acceptedAnswers: ['vocabulary'],
      explanationThai: 'ในเสียงพูดว่า "the vocabulary of Icelandic is continually increasing" ครับ'
    },
    {
      id: 'listening-s4-q3',
      number: 3,
      noteLine: 'It has its own words for computer-based concepts, such as web browser and ______',
      acceptedAnswers: ['podcast'],
      explanationThai: 'ในเสียงพูดว่า "there\'s an Icelandic word for podcast" ครับ'
    }
  ]
}

/* ------------------------------------------------------------------ writing */

export type PlacementWritingItem = {
  id: string
  /** The full sentence, shown with the tested portion marked. */
  sentence: string
  /** The exact substring of `sentence` under test. */
  underlined: string
  promptThai: string
  kind: 'typed' | 'choice'
  options?: Array<{ key: string; text: string }>
  acceptedAnswers: string[]
  explanationThai: string
}

/**
 * Three items, each one gate. Item 1 is the floor (past tense and the comma
 * splice); item 2 opens 6.0–6.5; item 3 opens 6.5–7.0.
 */
export const PLACEMENT_WRITING_GATE_1: PlacementWritingItem[] = [
  {
    id: 'writing-1a',
    sentence:
      'Overall, internet access rise significantly in all four countries during this period, The UK and Germany consistently had the highest figures, while Italy remain the lowest throughout.',
    underlined: 'rise',
    promptThai: 'คำที่ขีดเส้นใต้ถูกต้องหรือไม่ ถ้าไม่ถูก ให้พิมพ์คำที่ถูกต้องลงไป ถ้าถูกอยู่แล้วให้กดปุ่มด้านล่างครับ',
    kind: 'typed',
    acceptedAnswers: ['rose'],
    explanationThai:
      'ประโยคนี้เล่าเรื่องที่จบไปแล้ว ("during this period") และประโยคเดียวกันยังใช้ "had" ซึ่งเป็นอดีต จึงต้องเป็น rose ไม่ใช่ rise ครับ'
  },
  {
    id: 'writing-1b',
    sentence:
      'Overall, internet access rose significantly in all four countries during this period, The UK and Germany consistently had the highest figures, while Italy remained the lowest throughout.',
    underlined: 'period, The UK',
    promptThai: 'เลือกตัวเลือกที่แก้เครื่องหมายวรรคตอนตรงนี้ได้ถูกต้องที่สุดครับ',
    kind: 'choice',
    options: [
      { key: 'A', text: 'NO CHANGE' },
      { key: 'B', text: 'period. however, the UK' },
      { key: 'C', text: 'period, however the UK' },
      { key: 'D', text: 'period. However, the UK' }
    ],
    acceptedAnswers: ['D'],
    explanationThai:
      'ต้นฉบับเอาสองประโยคสมบูรณ์มาต่อกันด้วยลูกน้ำ (comma splice) จึงต้องตัดด้วยจุด ตัวเลือก C ยังเป็น comma splice อยู่ ส่วน B ขึ้นประโยคใหม่ด้วยตัวพิมพ์เล็ก จึงเหลือ D ที่ถูกทั้งจุด ตัวพิมพ์ใหญ่ และลูกน้ำหลัง However ครับ'
  }
]

export const PLACEMENT_WRITING_GATE_2: PlacementWritingItem = {
  id: 'writing-2',
  sentence:
    'In 2000, the percentage of households with internet access was low everywhere. The UK led with 25% followed by Germany at 20% and Italy at 15%, and France had the smallest figure of only 12%.',
  underlined: '25% followed by Germany',
  promptThai: 'ถ้าส่วนที่ขีดเส้นใต้ผิด ให้พิมพ์ส่วนนั้นใหม่ให้ถูกต้อง ถ้าถูกอยู่แล้วให้กดปุ่มด้านล่างครับ',
  kind: 'typed',
  acceptedAnswers: ['25%, followed by germany'],
  explanationThai:
    '"followed by Germany at 20%" เป็นส่วนขยายที่ตามหลังใจความหลัก ต้องมีลูกน้ำคั่นก่อนเสมอ จึงเป็น "25%, followed by Germany" ครับ'
}

export const PLACEMENT_WRITING_GATE_3: PlacementWritingItem = {
  id: 'writing-3',
  sentence:
    'By 2010, all four countries had experienced a dramatic increase. Germany rose to 78%, which was slightly higher than the UK’s 75%. France also increased sharply to 65%, Italy only reached 55%, which was the lowest figure in that year.',
  underlined: '65%, Italy',
  promptThai: 'เลือกตัวเลือกที่ถูกต้องที่สุดครับ',
  kind: 'choice',
  options: [
    { key: 'A', text: 'NO CHANGE' },
    { key: 'B', text: '65% but Italy' },
    { key: 'C', text: '65% whereas Italy' },
    { key: 'D', text: '65%, whereas Italy' }
  ],
  acceptedAnswers: ['D'],
  explanationThai:
    'ต้นฉบับเป็น comma splice อีกครั้ง การแก้คือเติมคำเชื่อมแสดงความต่าง (whereas) และคงลูกน้ำไว้หน้าคำเชื่อม จึงเป็น "65%, whereas Italy" — ตัวเลือก C ขาดลูกน้ำ ส่วน B ขาดทั้งลูกน้ำและใช้ but ที่อ่อนกว่าในงานเขียนวิชาการครับ'
}

/**
 * The Band 7 writing gate.
 *
 * Clearing the three correction items only proves the grammar is clean, which is
 * where Band 7 starts rather than where it is earned. This paragraph decides the
 * rest of it — flow, vocabulary and control of more advanced structures — so a
 * student is never handed a 7 on punctuation alone.
 */
export const PLACEMENT_WRITING_ESSAY = {
  id: 'writing-essay',
  taskPrompt:
    'Some people believe that universities should only accept students with the highest marks, while others think anyone who wants to study should be allowed to. Discuss both views and give your own opinion.',
  /** One paragraph is enough to expose flow, range and control; a full essay is not. */
  minWords: 80,
  introThai:
    'ไวยากรณ์ของคุณสะอาดพอที่จะเข้าเกณฑ์ Band 7 แล้วครับ — ข้อสุดท้ายนี้มีไว้ตัดสินว่าคุณจะได้ 7.0 จริงหรือไม่ ' +
    'โดยดูที่การลำดับความคิด (flow) คลังคำศัพท์ และไวยากรณ์ระดับสูงครับ',
  instructionThai:
    'เขียน 1 ย่อหน้า ตอบคำถาม Task 2 ด้านล่าง ให้มีใจความหลักชัดเจน มีเหตุผลสนับสนุน และใช้คำเชื่อมให้ต่อเนื่องครับ'
} as const

/** What the examiner pass must report back about the paragraph. */
export type PlacementEssaySignals = {
  tenseErrorCount: number
  vocabularyIssueCount: number
  transitionsUsed: string[]
  logicIsSound: boolean
  /** Thai reasons, one per flaw found, shown verbatim in the report. */
  reasonsThai: string[]
}

/**
 * Band 7 needs all four clean. Any single flaw the teacher named — a tense or
 * conjugation slip, awkward vocabulary, no transitions, or reasoning that does
 * not hold — drops the student back to 6.0–6.5.
 */
export const essayReachesBandSeven = (signals: PlacementEssaySignals): boolean =>
  signals.tenseErrorCount === 0 &&
  signals.vocabularyIssueCount === 0 &&
  signals.transitionsUsed.length > 0 &&
  signals.logicIsSound

/* ----------------------------------------------------------------- speaking */

export type PlacementSpeakingQuestion = {
  id: string
  part: 'Part 1' | 'Part 3'
  question: string
  hintThai: string
}

/**
 * The speaking ladder marks a student down for never using past tense, so one
 * question has to require it outright — otherwise the detector measures the
 * prompt rather than the student.
 */
export const PLACEMENT_SPEAKING_QUESTIONS: PlacementSpeakingQuestion[] = [
  {
    id: 'speaking-p1-1',
    part: 'Part 1',
    question: 'Tell me about the area where you live. What do you like about it?',
    hintThai: 'ตอบอย่างน้อย 4 ประโยค และบอกเหตุผลประกอบด้วยครับ'
  },
  {
    id: 'speaking-p1-2',
    part: 'Part 1',
    question: 'What did you do last weekend?',
    hintThai: 'ข้อนี้ต้องเล่าเรื่องที่ผ่านไปแล้ว ระวังการใช้ past tense ให้ถูกครับ'
  },
  {
    id: 'speaking-p3-1',
    part: 'Part 3',
    question: 'How has the way people spend their free time changed over the last twenty years?',
    hintThai: 'เปรียบเทียบอดีตกับปัจจุบัน และยกตัวอย่างประกอบครับ'
  },
  {
    id: 'speaking-p3-2',
    part: 'Part 3',
    question: 'Do you think technology has made people’s lives easier or more stressful? Why?',
    hintThai: 'เลือกฝั่งใดฝั่งหนึ่งให้ชัด แล้วให้เหตุผลอย่างน้อย 2 ข้อครับ'
  }
]

/* -------------------------------------------------------------------- gates */

/** Reading: 3 TFNG decide the floor, 3 headings decide how far above it. */
export const scorePlacementReading = (tfngCorrect: number, headingCorrect: number | null): PlacementBandKey => {
  if (tfngCorrect === 0) return 'below5.5'
  if (tfngCorrect < 3) return '5.5-6'
  if (headingCorrect === null) return '5.5-6'
  if (headingCorrect === 3) return '6.5-7'
  if (headingCorrect >= 1) return '6'
  return '5.5-6'
}

/** Listening: Section 1 is the floor gate, Section 2 refines, Section 4 opens 7+. */
export const scorePlacementListening = (
  sectionOneCorrect: number,
  sectionTwoCorrect: number | null,
  sectionFourCorrect: number | null
): PlacementBandKey => {
  if (sectionOneCorrect <= 1) return 'below5.5'
  if (sectionOneCorrect < 4) return '5.5-6'
  if (sectionTwoCorrect === null) return '5.5-6'
  if (sectionTwoCorrect <= 1) return '5.5-6'
  if (sectionTwoCorrect === 2) return '6'
  if (sectionFourCorrect === null) return '6.5'
  return sectionFourCorrect === 3 ? '7plus' : '6.5'
}

/**
 * Writing: item 1 is the floor, item 2 opens 6.0–6.5, item 3 opens 6.5–7.0, and
 * the paragraph decides whether 7.0 is actually earned.
 *
 * `essayReachedSeven` is null while the paragraph is still unwritten, which is
 * why clearing item 3 alone reports 6.5–7.0 rather than 7.0 — correcting other
 * people's sentences shows control, not range.
 */
export const scorePlacementWriting = (
  gateOneCorrect: number,
  gateTwoPassed: boolean | null,
  gateThreePassed: boolean | null,
  essayReachedSeven: boolean | null = null
): PlacementBandKey => {
  if (gateOneCorrect === 0) return 'below5.5'
  if (gateOneCorrect < PLACEMENT_WRITING_GATE_1.length) return '5.5-6'
  if (gateTwoPassed !== true) return '6'
  if (gateThreePassed !== true) return '6-6.5'
  if (essayReachedSeven === null) return '6.5-7'
  return essayReachedSeven ? '7plus' : '6-6.5'
}

/**
 * Answer matching for the typed items. Deliberately forgiving about case,
 * spacing and thousands separators, and nothing else — a placement test should
 * not fail a student over a stray capital, nor pass one over a real spelling slip.
 */
export const matchesPlacementAnswer = (given: string, accepted: string[]): boolean => {
  const normalise = (value: string) =>
    value
      .toLowerCase()
      .replace(/[’']/g, "'")
      .replace(/,(?=\d)/g, '')
      .replace(/\s+/g, ' ')
      .replace(/[.]$/, '')
      .trim()
  const candidate = normalise(given)
  return accepted.some((answer) => normalise(answer) === candidate)
}
