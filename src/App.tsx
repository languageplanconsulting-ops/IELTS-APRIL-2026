import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

type Role = 'student' | 'admin'
type AppPage = 'home' | 'workspace' | 'reading' | 'notebook' | 'admin'
type NotebookSection = 'speaking' | 'writing' | 'listening' | 'reading' | 'custom'
type LearnerStatus = 'active' | 'inactive'
type ReadingBankCategory = 'passage1' | 'passage2' | 'passage3' | 'fulltest'
type SupportReportCategory = 'bug' | 'account' | 'content' | 'billing' | 'other'
type SupportReportStatus = 'open' | 'in_progress' | 'resolved' | 'closed'

type ReadingQuestion = {
  number: number
  prompt: string
  correctAnswer: string
  answerType: 'true-false-not-given' | 'yes-no-not-given' | 'multiple-choice' | 'text'
  exactPortion: string
  explanationThai: string
  paraphrasedVocabulary: string
}

type ReadingPassageRecord = {
  number: number
  title: string
  bodyParagraphs: string[]
  questionSectionText: string
  questionRanges: Array<{ start: number; end: number }>
  questions: ReadingQuestion[]
}

type ReadingParsedPayload = {
  title: string
  category: ReadingBankCategory
  passages: ReadingPassageRecord[]
  questionCount: number
}

type ReadingExamRecord = {
  id: string
  title: string
  category: ReadingBankCategory
  rawPassageText: string
  rawAnswerKey: string
  parsedPayload: ReadingParsedPayload
  createdAt: string | null
  updatedAt: string | null
}

type ReadingBulkUploadInput = {
  title: string
  category?: ReadingBankCategory
  rawPassageText: string
  rawAnswerKey: string
}

type SupportReportRecord = {
  id: string
  userId: string | null
  reporterName: string
  reporterEmail: string
  pageContext: string
  category: SupportReportCategory
  message: string
  status: SupportReportStatus
  adminNote: string
  createdAt: string | null
  updatedAt: string | null
  resolvedAt: string | null
}

type ReadingReportItem = ReadingQuestion & {
  userAnswer: string
  isCorrect: boolean
}

type ScriptReviewItem = {
  question: string
  response: string
}

type ManagedLearnerRecord = {
  id: string
  name: string
  email: string
  role: Role
  status: LearnerStatus
  startsAt: string | null
  expiresAt: string | null
  feedbackRemaining: number
  fullMockRemaining: number
  createdAt: string
}

type AuthSession = {
  userId: string
  role: Role
  name: string
  email: string
  accessToken: string
  refreshToken: string
  expiresAt: number
}

type NotebookEntry = {
  id: string
  section: NotebookSection
  customSectionName?: string
  topicTitle: string
  criterion: string
  quote: string
  fix: string
  thaiMeaning?: string
  personalNote?: string
  savedReportSnapshot?: SavedReportSnapshot
  createdAt: string
}

type SavedReportSnapshot = {
  testMode: SpeakingTestMode
  topicTitle: string
  topicCategory: string
  prompt: string
  cues: string[]
  report: AssessmentResult
  selectedProvider: string
}

type SpeakingTopic = {
  id: string
  category: string
  title: string
  prompt: string
  cues: string[]
}

type SpeakingTestMode = 'part1' | 'part2' | 'part3' | 'full'
type FullExamPhase = 'part1' | 'part2_prep' | 'part2_speaking' | 'rest' | 'part3'

type AttemptStage = 'idle' | 'prep' | 'speaking' | 'assessing' | 'result'

type AssessmentReport = {
  provider: string
  nextAttemptFocusThai?: string
  part3AnswerCoaching?: Array<{
    question: string
    missing: string[]
    suggestionThai: string
  }>
  mockFullReport?: {
    section1: {
      title: string
      introThai: string
      analysisThai: string
      grammarMistakes: Array<{
        issue: string
        evidence: string
        suggestion: string
      }>
    }
    section2: {
      title: string
      introThai: string
      analysisThai: string
      fluencyReport: ComponentReport
    }
    section3: {
      title: string
      introThai: string
      analysisThai: string
      lexicalReport: ComponentReport
      grammarReport: ComponentReport
    }
  }
  vocabularyLevelUpSuggestions?: Array<{
    sourcePhrase: string
    replacement: string
    level: string
    thaiMeaning: string
    reasonThai: string
    sourceQuestion?: string
  }>
  punctuatedTranscript?: string
  questionBreakdown?: Array<{
    question: string
    rawTranscript: string
    punctuatedTranscript: string
    annotations?: Array<{
      label: string
      issueType: string
      highlightText: string
      commentThai: string
    }>
  }>
  totalScore?: number
  rawFourComponentAverage?: number
  componentReports?: {
    grammar?: ComponentReport
    lexical?: ComponentReport
    fluency?: ComponentReport
  }
  overallBand: number
  criteria: {
    fluency: number
    lexical: number
    grammar: number
  }
  strengths: string[]
  improvements: string[]
  modelNotes: string
}

type AssessmentResult = AssessmentReport & {
  primaryProvider?: string
  comparisons?: Record<string, AssessmentReport>
  comparisonErrors?: string[]
}

type ComponentReport = {
  band: number
  explanationThai: string
  requiredTicks: Array<{
    requirement: string
    isMet: boolean
    evidence: string[]
  }>
  plusOnePlan: Array<{
    quote: string
    fix: string
    thaiMeaning?: string
  }>
  plusOneChecklist?: Array<{
    requirement?: string
    statusThai?: string
    quote: string
    fix: string
    originalText?: string
    improvedText?: string
  }>
}

type SpeechRecognitionInstance = {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: ((event: { error: string }) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

type SpeechRecognitionEventLike = {
  resultIndex: number
  results: {
    isFinal: boolean
    0: { transcript: string }
    length: number
  }[]
}

type WindowWithSpeechRecognition = Window & {
  webkitSpeechRecognition?: new () => SpeechRecognitionInstance
  SpeechRecognition?: new () => SpeechRecognitionInstance
}

type RecommendationLevel = 'B1' | 'B2' | 'C1'

type RecommendationItem = {
  level: RecommendationLevel
  phrase: string
  tip: string
  source?: 'topic' | 'intent' | 'general'
}

type AnswerReviewModalState = {
  question: string
  contextLabel: string
  questionIndex: number
  fullExamPhase: FullExamPhase | null
  fullExamPart1Index: number
  fullExamPart3Index: number
}

type ScriptReviewModalState = {
  title: string
  noteThai: string
  items: ScriptReviewItem[]
}

const ANALYSIS_LOADING_PHRASES = [
  { th: 'กำลังตรวจสอบไวยากรณ์ของคำตอบคุณ', en: 'Examining your grammar.' },
  {
    th: 'กำลังอ่านคำที่ระบบอาจฟังผิด โดยยังคงไวยากรณ์เดิมของผู้พูดไว้',
    en: 'Resolving likely transcript mishears while preserving the student’s original grammar.'
  },
  { th: 'กำลังค้นหาจุดผิดและจุดที่สามารถพัฒนาได้', en: 'Identifying mistakes and areas for improvement.' },
  {
    th: 'กำลังวิเคราะห์คำตอบโดยอ้างอิงจากฐานข้อมูลของ EnglishPlan ตลอด 5 ปีที่ผ่านมา',
    en: "Analyzing your response using EnglishPlan's 5-year database."
  },
  {
    th: 'กำลังเปรียบเทียบคำตอบของคุณกับข้อมูลจากนักเรียนไทยและนักเรียนในเอเชียกว่า 1,000 คน',
    en: 'Comparing your response with data from over 1,000 students from Thailand and across Asia.'
  },
  { th: 'กำลังวิเคราะห์ความลื่นไหลในการพูดของคุณ', en: 'Analyzing your fluency.' },
  {
    th: 'กำลังตรวจสอบจังหวะการพูด การหยุดคิด และความต่อเนื่องของคำตอบ',
    en: 'Checking your speaking rhythm, pauses, and overall continuity.'
  },
  { th: 'กำลังวิเคราะห์การแก้คำพูดของตัวเองระหว่างตอบ', en: 'Analyzing your self-correction.' },
  {
    th: 'Fun Fact: การแก้คำพูดตัวเองไม่ใช่เรื่องผิด ถ้าคุณแก้แล้วถูกต้อง',
    en: 'Fun fact: Self-correction is not a problem if you correct yourself accurately.'
  },
  {
    th: 'คะแนนจะถูกกระทบมากขึ้นเมื่อคุณแก้คำตอบแล้ว แต่คำตอบที่แก้ยังผิดอยู่',
    en: 'Your score is more affected when you correct yourself but the corrected version is still inaccurate.'
  },
  { th: 'กำลังรวบรวมข้อมูลด้าน Fluency และ Coherence', en: 'Collecting information on fluency and coherence.' },
  { th: 'กำลังวิเคราะห์ว่าคำตอบของคุณเชื่อมโยงกันดีแค่ไหน', en: 'Analyzing how well your ideas are connected.' },
  { th: 'กำลังตรวจสอบว่าคำตอบของคุณฟังดูเป็นธรรมชาติหรือยัง', en: 'Checking whether your response sounds natural.' },
  { th: 'กำลังเข้าสู่ขั้นตอนการวิเคราะห์ Pronunciation', en: 'Moving on to pronunciation analysis.' },
  { th: 'การวิเคราะห์ Pronunciation เป็นหนึ่งในขั้นตอนที่ซับซ้อนที่สุด', en: 'Pronunciation analysis is one of the most complex stages.' },
  {
    th: 'เรากำลังใช้ฐานข้อมูลจากประสบการณ์การสอนของ EnglishPlan ตลอด 5 ปีที่ผ่านมา',
    en: "We are using insights from EnglishPlan's 5 years of teaching experience."
  },
  {
    th: 'ระบบกำลังพยายามเข้าใจทั้งคำพูด สำเนียง และความชัดเจนในการออกเสียงของคุณ',
    en: 'The system is analyzing your speech, accent, and clarity.'
  },
  { th: 'กำลังค้นหาคำหรือเสียงที่อาจเป็นจุดอ่อนในการออกเสียงของคุณ', en: 'Identifying words or sounds that may be your pronunciation weaknesses.' },
  { th: 'กำลังตรวจสอบว่าการออกเสียงของคุณส่งผลต่อความเข้าใจของผู้ฟังหรือไม่', en: 'Checking whether your pronunciation affects listener understanding.' },
  {
    th: 'จุดนี้สำคัญมาก เพราะในการสอบจริง Examiner ต้องเข้าใจสิ่งที่คุณพูดได้ชัดเจน',
    en: 'This is important because, in the real exam, the examiner must clearly understand what you say.'
  },
  { th: 'กำลังประเมินคะแนนด้าน Pronunciation ของคุณ', en: 'Evaluating your pronunciation score.' },
  {
    th: 'กำลังเปรียบเทียบคำตอบของคุณกับตัวอย่าง Speaking กว่า 2,000 ชุดในฐานข้อมูลของ EnglishPlan',
    en: "Comparing your response with over 2,000 speaking samples in EnglishPlan's database."
  },
  { th: 'กำลังเข้าใกล้ผลวิเคราะห์คำตอบของคุณแล้ว', en: 'Getting closer to your final analysis.' },
  {
    th: 'กำลังวิเคราะห์คำตอบของคุณเหมือนมี EnglishPlan Expert นั่งอยู่ข้าง ๆ',
    en: 'Analyzing your response as if an EnglishPlan expert were sitting next to you.'
  },
  { th: 'กำลังสรุปจุดแข็ง จุดอ่อน และสิ่งที่ควรปรับปรุง', en: 'Summarizing your strengths, weaknesses, and improvement areas.' },
  { th: 'กำลังสร้างรายงานคะแนนแบบละเอียดสำหรับคุณ', en: 'Generating your detailed score report.' },
  { th: 'อีกนิดเดียว รายงานของคุณกำลังจะเสร็จแล้ว', en: 'Almost done. Your report is nearly ready.' },
  { th: 'กำลังเตรียมคำแนะนำเฉพาะสำหรับคำตอบนี้', en: 'Preparing personalized advice for this response.' },
  { th: 'กำลังแปลงผลวิเคราะห์ให้เป็นคำแนะนำที่เข้าใจง่ายและนำไปใช้ได้จริง', en: 'Turning the analysis into clear and practical feedback.' },
  { th: 'รายงานของคุณพร้อมแล้ว', en: 'Your report is ready.' }
] as const

const INITIAL_TOPICS: SpeakingTopic[] = [
  {
    id: 'person-old',
    category: 'A Person You Know',
    title: 'Describe an old person that you know.',
    prompt: 'Describe an old person that you know.',
    cues: [
      'What your relationship is to this person',
      'How often you see them',
      'What people think about this person',
      'Explain why you like them.'
    ]
  },
  {
    id: 'person-child',
    category: 'A Person You Know',
    title: 'Describe a child that you know and like a lot.',
    prompt: 'Describe a child that you know and like a lot.',
    cues: [
      'Who the child is',
      'How you know them',
      'What they enjoy doing',
      'Explain why you like them a lot.'
    ]
  },
  {
    id: 'person-influence',
    category: 'A Person You Know',
    title: 'Describe someone who has had an important influence on your life.',
    prompt: 'Describe someone who has had an important influence on your life.',
    cues: [
      'Who the person is',
      'How long you have known him/her',
      'What qualities this person has',
      'Explain why they have had such an influence on you.'
    ]
  },
  {
    id: 'person-interesting',
    category: 'A Person You Know',
    title: 'Describe a person that you think is very interesting.',
    prompt: 'Describe a person that you think is very interesting.',
    cues: [
      'Who this person is',
      'How you met them',
      'What they like to talk about',
      'Explain why this person is very interesting.'
    ]
  },
  {
    id: 'person-teacher',
    category: 'A Person You Know',
    title: 'Describe your favourite teacher from school.',
    prompt: 'Describe your favourite teacher from school.',
    cues: [
      'What school he/she taught at',
      'What he/she looked like',
      'What subject he/she taught you',
      'Explain why you remember this teacher so well.'
    ]
  },
  {
    id: 'gift-given',
    category: 'Presents or Gifts',
    title: 'Describe a present or gift you have given someone.',
    prompt: 'Describe a present or gift you have given someone.',
    cues: [
      'Who you gave it to',
      'What kind of present it was',
      'How it compared to other presents you have given',
      'Explain why you decided to give this particular gift.'
    ]
  },
  {
    id: 'gift-received',
    category: 'Presents or Gifts',
    title: 'Describe a present or gift someone gave you that you really liked.',
    prompt: 'Describe a present or gift someone gave you that you really liked.',
    cues: [
      'What kind of present it was',
      'Who gave it to you',
      'Why you were given it',
      'Explain why you liked it.'
    ]
  },
  {
    id: 'memory-childhood',
    category: 'Memories',
    title: 'Describe a happy childhood event.',
    prompt: 'Describe a happy childhood event.',
    cues: [
      'When it happened',
      'Who was involved',
      'How you felt at the time',
      'Explain why you remember this particular occasion.'
    ]
  },
  {
    id: 'memory-photo',
    category: 'Memories',
    title: 'Describe a photograph that you like.',
    prompt: 'Describe a photograph that you like.',
    cues: [
      'Who is in the photograph',
      'When the photograph was taken',
      'Where the photograph is',
      'Explain why you like the photograph.'
    ]
  },
  {
    id: 'food-meal',
    category: 'Food',
    title: 'Describe a meal that you had that you remember well.',
    prompt: 'Describe a meal that you had that you remember well.',
    cues: [
      'Where the meal was',
      'Why you had the meal',
      'Who you went with',
      'Explain why you remember this particular occasion.'
    ]
  },
  {
    id: 'food-ate-out',
    category: 'Food',
    title: 'Describe a meal that you ate out.',
    prompt: 'Describe a meal that you ate out.',
    cues: [
      'Where you went',
      'What you ate',
      'Who you went with',
      'Explain why you remember this meal.'
    ]
  },
  {
    id: 'music-song',
    category: 'Music',
    title: 'Describe your favourite song.',
    prompt: 'Describe your favourite song.',
    cues: [
      'What is the name of the song',
      'What the song is about',
      'When you first heard the song',
      'Explain why it is your favourite song.'
    ]
  },
  {
    id: 'sport-event',
    category: 'Sport and Exercise',
    title: 'Describe a sporting event you attended.',
    prompt: 'Describe a sporting event you attended.',
    cues: [
      'What kind of sport it was',
      'How it compared to other events you have been to',
      'How often it takes place',
      'Explain why you consider this event to be of interest.'
    ]
  },
  {
    id: 'sport-exercise',
    category: 'Sport and Exercise',
    title: 'Describe a type of exercise that you like to do.',
    prompt: 'Describe a type of exercise that you like to do.',
    cues: [
      'What the exercise is',
      'When you do it',
      'Where you do it',
      'Explain why you like this particular exercise.'
    ]
  },
  {
    id: 'sport-try',
    category: 'Sport and Exercise',
    title: 'Describe a sport that you would like to try.',
    prompt: 'Describe a sport that you would like to try.',
    cues: [
      'Which sport it is',
      'Where you could do the sport',
      'Who you could do it with',
      'Explain why this sport would be good to try.'
    ]
  },
  {
    id: 'ent-comedian',
    category: 'Entertainment',
    title: 'Describe a comedian that you think is very funny.',
    prompt: 'Describe a comedian that you think is very funny.',
    cues: [
      'Who the comedian is',
      'Where they usually perform',
      'Who likes to see the comedian',
      'Explain why you think this comedian is very funny.'
    ]
  },
  {
    id: 'ent-tv',
    category: 'Entertainment',
    title: 'Describe a TV show that you enjoy.',
    prompt: 'Describe a TV show that you enjoy.',
    cues: [
      'What type of show it is',
      'How often it is on',
      'How popular it is with other people in your country',
      'Explain why you like it.'
    ]
  },
  {
    id: 'travel-country',
    category: 'Travel',
    title:
      "Describe a country you would like to visit in the future that you haven't been to yet.",
    prompt:
      "Describe a country you would like to visit in the future that you haven't been to yet.",
    cues: [
      'Which country it is',
      'Where it is located in the world',
      'What you could see there',
      'Explain why this country would be such a good place to visit.'
    ]
  },
  {
    id: 'travel-water',
    category: 'Travel',
    title: 'Describe a lake, a river or a sea you have visited.',
    prompt: 'Describe a lake, a river or a sea you have visited.',
    cues: [
      'Where the lake is',
      'How often you have visited it',
      'What activities you do there',
      'Explain why you like this particular place.'
    ]
  },
  {
    id: 'travel-holiday',
    category: 'Travel',
    title: 'Describe a holiday that you recently went on that you enjoyed.',
    prompt: 'Describe a holiday that you recently went on that you enjoyed.',
    cues: [
      'Where you went',
      'Who you went with',
      'What you did',
      'Explain why this holiday was enjoyable.'
    ]
  },
  {
    id: 'building-like',
    category: 'Buildings',
    title: 'Describe a building that you particularly like.',
    prompt: 'Describe a building that you particularly like.',
    cues: [
      'Where the building is',
      'What it looks like',
      'What you can do there',
      'Explain why you like this building.'
    ]
  },
  {
    id: 'reading-book',
    category: 'Reading',
    title: 'Describe your favourite book.',
    prompt: 'Describe your favourite book.',
    cues: [
      'When you read the book',
      'What the book is about',
      'Why you read it',
      'Explain why this book is your favourite.'
    ]
  },
  {
    id: 'reading-website',
    category: 'Reading',
    title: 'Describe a website that you visit a lot.',
    prompt: 'Describe a website that you visit a lot.',
    cues: [
      'What the website is about',
      'How you found the website',
      'Who else you told about the website',
      'Explain why you visit the website a lot.'
    ]
  },
  {
    id: 'news-good',
    category: 'News',
    title: 'Describe some good news that you recently received.',
    prompt: 'Describe some good news that you recently received.',
    cues: [
      'What the news was',
      'How you got the news',
      'Who else you told about it',
      'Explain why this was good news.'
    ]
  },
  {
    id: 'routine-day',
    category: 'Daily Routine',
    title: 'Describe your favourite part of the day.',
    prompt: 'Describe your favourite part of the day.',
    cues: [
      'What time of day this is',
      'What you like to do at this time',
      'Who you are usually with',
      'Explain why this is your favourite part of the day.'
    ]
  }
]

const PART1_TOPICS: SpeakingTopic[] = [
  {
    id: 'p1-work-study',
    category: 'Part 1 - Work or Study',
    title: 'Work or Study',
    prompt: 'Do you work or are you a student?',
    cues: [
      'What is your specific job or subject?',
      'Why did you choose that job or subject?',
      'Do you enjoy your daily tasks or studies?',
      'What are your future career or educational plans?',
      'Is your profession or subject popular in your country?'
    ]
  },
  {
    id: 'p1-hometown',
    category: 'Part 1 - Hometown',
    title: 'Hometown',
    prompt: 'Where is your hometown located?',
    cues: [
      'What do you like the most about it?',
      'Has your hometown changed much in recent years?',
      'Is your hometown a suitable place for young people to live?',
      'Are there any famous landmarks or attractions in your hometown?',
      'What improvements would make your hometown better?'
    ]
  },
  {
    id: 'p1-home-accommodation',
    category: 'Part 1 - Home and Accommodation',
    title: 'Home and Accommodation',
    prompt: 'Do you live in a house or an apartment?',
    cues: [
      'Who do you live with?',
      'What is your favorite room in your home, and why?',
      'How long have you been living there?',
      "What would you like to change about your home's design or location?",
      'Do you plan to move to a different place in the future?'
    ]
  },
  {
    id: 'p1-apps-tech',
    category: 'Part 1 - Apps and Technology',
    title: 'Apps and Technology',
    prompt: 'Do you often use apps on your smartphone?',
    cues: [
      'What are the most popular apps in your country right now?',
      'Are there any apps you find particularly useful for children?',
      'Would you ever spend money to purchase a premium app?',
      'Have you ever deleted an app? Why?'
    ]
  },
  {
    id: 'p1-art-galleries',
    category: 'Part 1 - Art and Galleries',
    title: 'Art and Galleries',
    prompt: 'Do you enjoy art?',
    cues: [
      'Did you learn to draw or paint at school when you were a child?',
      'Have you ever visited an art gallery or museum?',
      'Do you think children can benefit from going to art galleries?',
      'Are there any paintings or photographs hanging on the walls of your home?'
    ]
  },
  {
    id: 'p1-books',
    category: 'Part 1 - Books and Reading Habits',
    title: 'Books and Reading Habits',
    prompt: 'Do you enjoy reading books?',
    cues: [
      'Do you prefer physical printed books or e-books?',
      'Did you read much as a child?',
      'What genres or types of books are most popular in your country?',
      'Do you think it is important to encourage young children to read?'
    ]
  },
  {
    id: 'p1-childhood',
    category: 'Part 1 - Childhood Memories',
    title: 'Childhood Memories',
    prompt: 'What is your favorite memory from your childhood?',
    cues: [
      'Were you a good student when you were young?',
      'Who did you usually like to play with as a child?',
      'Did you prefer to play outside or stay indoors when you were young?',
      'What activities did you enjoy doing the most during your summer holidays?'
    ]
  },
  {
    id: 'p1-chocolate',
    category: 'Part 1 - Chocolate and Sweets',
    title: 'Chocolate and Sweets',
    prompt: 'Do you like eating chocolate or sweets?',
    cues: [
      'How often do you consume chocolate?',
      'Do you remember the first time you ate chocolate?',
      'Is chocolate a popular treat in your country?',
      'Have you ever given chocolate as a gift to someone? Why?'
    ]
  },
  {
    id: 'p1-fashion',
    category: 'Part 1 - Clothes and Fashion',
    title: 'Clothes and Fashion',
    prompt: 'Are clothes and fashion important to you?',
    cues: [
      'What types of clothes do you usually feel most comfortable wearing?',
      'Do you ever wear traditional clothing from your country?',
      'Why do you think some people prefer casual clothes over formal wear?',
      'Did you have to wear a school uniform as a child?'
    ]
  },
  {
    id: 'p1-daily-routine',
    category: 'Part 1 - Daily Routine',
    title: 'Daily Routine',
    prompt: 'When do you usually wake up in the morning?',
    cues: [
      'Do you have the exact same routine every single day?',
      'How often do you change your daily schedule?',
      'Is your routine the same today as it was when you were a child?',
      'Do you think it is important for people to have a strict daily routine?'
    ]
  },
  {
    id: 'p1-fixing-things',
    category: 'Part 1 - Fixing Things',
    title: 'Fixing Things',
    prompt: 'Do you often try to fix broken things around the house?',
    cues: [
      'Did you learn how to fix things when you were younger?',
      'What do you usually do when something is broken and cannot be repaired?',
      'Do you think it is a necessary skill for people to learn how to fix things?'
    ]
  },
  {
    id: 'p1-friends',
    category: 'Part 1 - Friends and Socializing',
    title: 'Friends and Socializing',
    prompt: 'Do you have a large group of friends or a small, close-knit circle?',
    cues: [
      'Are you still friends with anyone from your childhood?',
      'What activities do you usually do when you hang out with your friends?',
      'Do you prefer to spend your free time with your family or your friends?',
      'What qualities do you look for when making new friends?'
    ]
  },
  {
    id: 'p1-going-out',
    category: 'Part 1 - Going Out',
    title: 'Going Out',
    prompt: 'Do you often go out in the evenings?',
    cues: [
      'What do you typically like to do when you go out?',
      'Do you prefer going out on your own or with a group of friends?',
      'How often do you go out in a typical week?',
      'Where do most young people like to go out for entertainment in your city?'
    ]
  },
  {
    id: 'p1-happiness',
    category: 'Part 1 - Happiness',
    title: 'Happiness',
    prompt: 'Would you describe yourself as a naturally happy person?',
    cues: [
      'What types of things usually make you feel happy?',
      'Does the weather ever affect your mood or happiness?',
      'Do you think people feel genuine happiness when buying new things?',
      'What is something simple that made you smile recently?'
    ]
  },
  {
    id: 'p1-holidays',
    category: 'Part 1 - Holidays and Vacations',
    title: 'Holidays and Vacations',
    prompt: 'Do you enjoy taking holidays?',
    cues: [
      'What do you usually like to do when you are on holiday?',
      'Do you prefer a relaxing, leisurely holiday or a busy, adventurous one?',
      'Which public holiday or festival do you like the best in your country?',
      'Where did you travel for your last holiday?'
    ]
  },
  {
    id: 'p1-transport',
    category: 'Part 1 - Public Transportation',
    title: 'Public Transportation',
    prompt: 'How do you usually commute to work or school?',
    cues: [
      'What is the most common mode of public transport in your city?',
      'Do you think the public transport system in your city is convenient?',
      'Have you ever been late to an event because of transportation issues?',
      "What specific improvements would you like to see in your city's transit system?"
    ]
  },
  {
    id: 'p1-staying-home',
    category: 'Part 1 - Staying at Home',
    title: 'Staying at Home',
    prompt: 'Are you someone who enjoys staying at home?',
    cues: [
      'What do you like to do in your free time when you stay indoors?',
      'What is your favorite spot to relax in your home?',
      'What activities did you often do at home when you were a child?',
      'Do you think you will spend more time staying at home in the future?'
    ]
  },
  {
    id: 'p1-watches',
    category: 'Part 1 - Watches',
    title: 'Watches',
    prompt: 'Do you frequently wear a watch?',
    cues: [
      'Have you ever received a watch as a gift from someone?',
      'Why do you think some people spend a lot of money on expensive watches?',
      'Do you think it is still important to wear a watch when everyone has a smartphone?'
    ]
  },
  {
    id: 'p1-weather',
    category: 'Part 1 - Weather',
    title: 'Weather',
    prompt: 'What is the general climate and weather like in your country?',
    cues: [
      'What is your favorite type of weather?',
      'Does extreme weather in your nation often affect daily life or infrastructure?',
      'Do you find that your health or energy levels change with the changing seasons?'
    ]
  },
  {
    id: 'p1-wild-animals',
    category: 'Part 1 - Wild Animals',
    title: 'Wild Animals',
    prompt: 'Have you ever seen a wild animal in real life?',
    cues: [
      'Are there many wild animals native to your country?',
      'What is your favorite wild animal, and why?',
      'Did you learn a lot about wild animals when you were in school?',
      'Do you enjoy watching nature documentaries or TV programs about wild animals?'
    ]
  },
  {
    id: 'p1-animals-pets',
    category: 'Part 1 - Animals and Pets',
    title: 'Animals and Pets',
    prompt: 'Do you have a pet?',
    cues: [
      'What types of animals are popular as pets in your country?',
      'Did you have a pet when you were a child?',
      'What are the benefits of having a pet in the home?',
      'What problems do people sometimes have with their pets?'
    ]
  },
  {
    id: 'p1-bicycles',
    category: 'Part 1 - Bicycles and Cycling',
    title: 'Bicycles and Cycling',
    prompt: 'Do you know how to ride a bicycle?',
    cues: [
      'How often do you ride a bike nowadays?',
      'How old were you when you first learned to ride?',
      'Is cycling a popular way to get around in your city?',
      'Do you think cities should encourage more people to commute by bicycle?'
    ]
  },
  {
    id: 'p1-birthdays',
    category: 'Part 1 - Birthdays',
    title: 'Birthdays',
    prompt: 'How do you usually celebrate your birthday?',
    cues: [
      'What did you do for your most recent birthday?',
      'Are birthdays considered an important event in your culture?',
      'Do you prefer giving gifts or receiving them on birthdays?',
      'Has the way you celebrate your birthday changed since you were a child?'
    ]
  },
  {
    id: 'p1-computers',
    category: 'Part 1 - Computers and Technology',
    title: 'Computers and Technology',
    prompt: 'How often do you use a computer?',
    cues: [
      'What do you mainly use a computer for in your daily life?',
      'Who taught you how to use a computer when you were younger?',
      'Do you prefer using a laptop, a desktop, or a tablet?',
      'Do you think it is necessary for older people to learn how to use computers?'
    ]
  },
  {
    id: 'p1-dreams',
    category: 'Part 1 - Dreams',
    title: 'Dreams (During Sleep)',
    prompt: 'Do you often remember your dreams when you wake up?',
    cues: [
      'Have you ever had the same dream more than once?',
      'Do you ever share or discuss your dreams with your friends or family?',
      'Do you believe that dreams have special meanings or can predict the future?',
      'What kind of dreams did you typically have as a child?'
    ]
  },
  {
    id: 'p1-drinks',
    category: 'Part 1 - Drinks',
    title: 'Drinks (Tea and Coffee)',
    prompt: 'Do you generally prefer drinking tea or coffee?',
    cues: [
      'When do you usually drink tea or coffee during the day?',
      'Is it common to serve guests tea or coffee in your country?',
      'Have your preferences for hot drinks changed since you were younger?',
      'What is a traditional celebratory drink in your culture?'
    ]
  },
  {
    id: 'p1-evenings',
    category: 'Part 1 - Evenings',
    title: 'Evenings',
    prompt: 'What do you typically do in the evenings after work or study?',
    cues: [
      'Do you prefer to spend your evenings relaxing alone or socializing with others?',
      'Do you do the same things in the evenings now as you did when you were a child?',
      'Do you ever have to work or study late into the evening?',
      'What are popular evening activities for young people in your city?'
    ]
  },
  {
    id: 'p1-food-cooking',
    category: 'Part 1 - Food and Cooking',
    title: 'Food and Cooking',
    prompt: 'Do you enjoy cooking your own meals?',
    cues: [
      'What is your favorite dish to cook?',
      'Who usually does the cooking in your family household?',
      'What types of international food are popular in your country?',
      'Do you prefer eating home-cooked meals or dining out at restaurants?'
    ]
  },
  {
    id: 'p1-internet',
    category: 'Part 1 - The Internet',
    title: 'The Internet',
    prompt: 'How often do you use the internet on a daily basis?',
    cues: [
      'What are your favorite types of websites or online platforms?',
      'How does the internet help you with your work or studies?',
      'Have your internet browsing habits changed over the last few years?',
      'Do you think children should have strict limits on their internet usage?'
    ]
  },
  {
    id: 'p1-music',
    category: 'Part 1 - Music and Concerts',
    title: 'Music and Concerts',
    prompt: 'What genres of music do you enjoy listening to the most?',
    cues: [
      'Have you ever been to a live music concert or festival?',
      'Do you like to listen to music while you are working or studying?',
      'Did you learn to play a musical instrument when you were a child?',
      'How does music affect your mood?'
    ]
  },
  {
    id: 'p1-neighbours',
    category: 'Part 1 - Neighbours and Neighbourhood',
    title: 'Neighbours and Neighbourhood',
    prompt: 'Do you know the people who live next door to you well?',
    cues: [
      'How would you describe your current neighbourhood?',
      'How can neighbours be helpful to each other in daily life?',
      'Do you think it is important to have a friendly relationship with your neighbours?',
      'What kind of problems sometimes occur between neighbours in a city?'
    ]
  },
  {
    id: 'p1-patience',
    category: 'Part 1 - Patience',
    title: 'Patience',
    prompt: 'Would you consider yourself to be a patient person?',
    cues: [
      'Have you ever lost your patience while waiting in a public place?',
      'Do you think people today are less patient because of modern technology?',
      'In what types of situations is it most important to remain patient?'
    ]
  },
  {
    id: 'p1-science',
    category: 'Part 1 - Science',
    title: 'Science',
    prompt: 'Did you enjoy studying science subjects when you were at school?',
    cues: [
      'What was your favorite science subject (e.g., biology, chemistry, physics)?',
      'Do you often watch documentaries or read articles about scientific discoveries?',
      'Do you think an understanding of science is important for our daily lives?'
    ]
  },
  {
    id: 'p1-social-media',
    category: 'Part 1 - Social Media',
    title: 'Social Media',
    prompt: 'Which social media platforms do you use the most frequently?',
    cues: [
      'Do you spend a lot of time scrolling on social media apps every day?',
      'What do you think are the main advantages and disadvantages of using social media?',
      'Do you prefer to post updates about your life or just view what others post?'
    ]
  },
  {
    id: 'p1-sports',
    category: 'Part 1 - Sports and Games',
    title: 'Sports and Games',
    prompt: 'What is your absolute favorite sport?',
    cues: [
      'Do you prefer watching sports on television or playing them yourself?',
      'What sports or physical games are the most popular in your country?',
      'Did you play any team sports at school when you were a child?',
      'Do you think doing sports is the best way to stay healthy?'
    ]
  },
  {
    id: 'p1-teachers-school',
    category: 'Part 1 - Teachers and High School',
    title: 'Teachers and High School',
    prompt: 'Who was your favorite teacher when you were in high school?',
    cues: [
      'Do you still keep in touch with any of your high school classmates?',
      'What was your favorite subject during your high school years?',
      'How did your teachers help or inspire you when you were a student?',
      'Do you miss your high school days?'
    ]
  },
  {
    id: 'p1-volunteer',
    category: 'Part 1 - Volunteer Work',
    title: 'Volunteer Work',
    prompt: 'Have you ever participated in any kind of volunteer or unpaid community work?',
    cues: [
      'Why do you think people choose to give up their free time to volunteer?',
      'Do you think schools should make volunteer work mandatory for students?',
      'What kind of volunteer work would you be interested in doing in the future?'
    ]
  },
  {
    id: 'p1-water',
    category: 'Part 1 - Water and Hydration',
    title: 'Water and Hydration',
    prompt: 'How often do you drink water throughout a typical day?',
    cues: [
      'Do you prefer to drink bottled mineral water or tap water?',
      'Do you ever drink hot water, or do you prefer cold or room-temperature water?',
      'Do you think people in your country drink enough water daily?'
    ]
  },
  {
    id: 'p1-writing',
    category: 'Part 1 - Writing',
    title: 'Writing',
    prompt: 'Do you enjoy writing (e.g., stories, poems, or articles)?',
    cues: [
      'Do you write more often by hand using a pen, or by typing on a keyboard?',
      'Did you like writing stories or essays when you were a child?',
      'Do you ever write physical letters or postcards to your friends or family anymore?'
    ]
  },
  {
    id: 'p1-garbage-environment',
    category: 'Part 1 - Garbage and the Environment',
    title: 'Garbage and the Environment',
    prompt: 'What do you normally do if you see rubbish thrown on the street?',
    cues: [
      'Is recycling a common and easy practice in your city?',
      'Do you think single-use plastic bags are a serious environmental issue?',
      'How can ordinary individuals help keep their cities and neighborhoods clean?'
    ]
  }
]

const PART3_TOPICS: SpeakingTopic[] = [
  {
    id: 'p3-education',
    category: 'Part 3 - Education',
    title: 'Discuss education trends in your country.',
    prompt: 'How should education change in the next 10 years?',
    cues: [
      'What skills should schools focus on more in the future?',
      'What role should technology play in modern education?',
      'How can teachers improve learning outcomes for students?'
    ]
  },
  {
    id: 'p3-technology',
    category: 'Part 3 - Technology',
    title: 'Discuss the impact of technology on society.',
    prompt: 'How has technology changed communication and relationships?',
    cues: [
      'What are the main benefits of modern technology in daily life?',
      'What are the main drawbacks of relying too much on technology?',
      'How can people use technology more responsibly?'
    ]
  },
  {
    id: 'p3-cities',
    category: 'Part 3 - Cities',
    title: 'Discuss modern city life and planning.',
    prompt: 'What makes a city a good place to live?',
    cues: [
      'How important are transport systems and public infrastructure in a city?',
      'How does the cost of living affect people who live in big cities?',
      'How should cities plan for the future?'
    ]
  },
  {
    id: 'p3-ai-technology',
    category: 'Part 3 - Artificial Intelligence and Technology',
    title: 'Artificial Intelligence and Technology',
    prompt: 'How do you think artificial intelligence will affect the global job market in the future?',
    cues: [
      'What are the main differences between how younger and older generations adapt to new technology?',
      'Should children be taught how to use advanced technology in primary school?',
      'Do you think technology is making people more socially isolated or more connected?'
    ]
  },
  {
    id: 'p3-future-learning',
    category: 'Part 3 - Education and the Future of Learning',
    title: 'Education and the Future of Learning',
    prompt: 'How are educational systems changing to meet the demands of the modern world?',
    cues: [
      'Do you think technology will eventually replace human teachers in the classroom?',
      'What are the advantages and disadvantages of online distance learning compared to traditional classrooms?',
      "In your opinion, who plays a more critical role in a child's education: parents or teachers?"
    ]
  },
  {
    id: 'p3-environment',
    category: 'Part 3 - The Environment and Conservation',
    title: 'The Environment and Conservation',
    prompt: 'What do you think are the most pressing environmental problems facing cities today?',
    cues: [
      'How can ordinary citizens be encouraged to recycle and adopt sustainable habits more often?',
      'Do you believe the government or the individual bears more responsibility for protecting the environment?',
      'Should public funds be spent on preserving natural beauty spots and wildlife habitats?'
    ]
  },
  {
    id: 'p3-family-generations',
    category: 'Part 3 - Family Dynamics and Generations',
    title: 'Family Dynamics and Generations',
    prompt: 'What are the benefits and drawbacks of several generations living under one roof?',
    cues: [
      'How have family structures changed in your country over the last few decades?',
      'What role do grandparents typically play in modern family life?',
      'Do you think parents today face more challenges in raising children than in the past?'
    ]
  },
  {
    id: 'p3-advertising',
    category: 'Part 3 - Advertising and Consumerism',
    title: 'Advertising and Consumerism',
    prompt: 'How do advertisements influence the behavior and desires of young children?',
    cues: [
      'Do you think advertising makes people buy things they do not actually need?',
      'What are the differences between advertising on television and marketing on social media?',
      'Should there be stricter regulations on how products are advertised to minors?'
    ]
  },
  {
    id: 'p3-media-news',
    category: 'Part 3 - Media, News, and Information',
    title: 'Media, News, and Information',
    prompt: 'How has the rise of social media changed the way people consume news?',
    cues: [
      'Do you think the information published in traditional newspapers is still reliable?',
      'What are the dangers of "fake news" and misinformation spreading online?',
      'Why do some people prefer to watch international news rather than local news?'
    ]
  },
  {
    id: 'p3-transport-infrastructure',
    category: 'Part 3 - Public Transportation and Infrastructure',
    title: 'Public Transportation and Infrastructure',
    prompt: 'What could local governments do to encourage more people to use public transportation?',
    cues: [
      'Do you think making public transport entirely free would solve urban traffic congestion?',
      'Why do you think an increasing number of people prefer traveling long distances by plane?',
      'What are the main obstacles cities face when trying to upgrade their transportation infrastructure?'
    ]
  },
  {
    id: 'p3-work-careers',
    category: 'Part 3 - Work, Careers, and Leadership',
    title: 'Work, Careers, and Leadership',
    prompt: 'What qualities and skills are required to be an effective company leader or manager?',
    cues: [
      'How do young people today decide which career path to pursue?',
      'Is it becoming more common for people to change careers entirely in the middle of their working lives?',
      'How important is work-life balance compared to achieving a high salary?'
    ]
  },
  {
    id: 'p3-healthcare',
    category: 'Part 3 - Health and Healthcare',
    title: 'Health and Healthcare',
    prompt: 'How can individuals improve their long-term physical and mental health in a stressful world?',
    cues: [
      'Do you think healthcare should be entirely free and funded by the government?',
      'Why is obesity becoming a growing problem in many developed countries?',
      'How do modern lifestyles and office jobs negatively impact human health?'
    ]
  },
  {
    id: 'p3-art-culture',
    category: 'Part 3 - Art, Culture, and Museums',
    title: 'Art, Culture, and Museums',
    prompt: 'What role do art galleries and museums play in modern society?',
    cues: [
      'Do you think the government should provide funding to support the arts?',
      'How can children benefit from learning about art and creativity at school?',
      'Do you think photography will eventually replace traditional painting as the primary visual art form?'
    ]
  },
  {
    id: 'p3-animals-ethics',
    category: 'Part 3 - Animals and Ethics',
    title: 'Animals and Ethics',
    prompt: 'What are the ethical arguments for and against keeping wild animals in zoos?',
    cues: [
      'Why are so many animal species becoming endangered in the modern era?',
      'How has the way humans use animals for work changed over the last century?',
      'Should medical research and cosmetic testing on animals be completely banned?'
    ]
  },
  {
    id: 'p3-cities-urbanization',
    category: 'Part 3 - Cities and Urbanization',
    title: 'Cities and Urbanization',
    prompt: 'What are the biggest challenges faced by people living in densely populated cities?',
    cues: [
      'How can urban planners make cities more suitable and safer for young children?',
      'Why do people continue to migrate from rural villages to large metropolitan areas?',
      'What features make a public park or garden beneficial to a local community?'
    ]
  },
  {
    id: 'p3-history-civilization',
    category: 'Part 3 - History and Civilization',
    title: 'History and Civilization',
    prompt: 'Why do you think some young students find learning about history boring?',
    cues: [
      'How can society apply the lessons learned from historical events to modern-day problems?',
      "Do you agree that preserving historical buildings is important for a nation's cultural identity?",
      'What are the main differences between how history is taught today compared to the past?'
    ]
  },
  {
    id: 'p3-social-media-relationships',
    category: 'Part 3 - Social Media and Interpersonal Relationships',
    title: 'Social Media and Interpersonal Relationships',
    prompt: 'What are the main advantages and disadvantages of relying on social media to maintain friendships?',
    cues: [
      'How has the concept of "friendship" changed since the invention of the internet?',
      'Do you believe people are too open about their private lives on social platforms?',
      'How does the constant use of smartphones impact face-to-face communication?'
    ]
  },
  {
    id: 'p3-risk-ambition',
    category: 'Part 3 - Challenges, Risk, and Ambition',
    title: 'Challenges, Risk, and Ambition',
    prompt: 'Why do some people relish stepping out of their comfort zone, while others avoid risks?',
    cues: [
      'What are the greatest challenges young adults face when entering the workforce today?',
      'Do you think having high ambitions is always a positive trait?',
      'Is it better to face difficult challenges independently or to seek the help of others?'
    ]
  },
  {
    id: 'p3-fashion-identity',
    category: 'Part 3 - Clothing, Fashion, and Identity',
    title: 'Clothing, Fashion, and Identity',
    prompt: 'How do you think social media influencers impact what people choose to wear?',
    cues: [
      "Can you tell a lot about a person's character or status based solely on their clothing?",
      'Do you think traditional and cultural clothing will eventually disappear due to globalization?',
      'Why do some individuals spend excessive amounts of money on luxury fashion brands?'
    ]
  },
  {
    id: 'p3-parenting-screen-time',
    category: 'Part 3 - Children, Parenting, and Screen Time',
    title: 'Children, Parenting, and Screen Time',
    prompt: "Should parents try to strictly limit their children's daily screen time?",
    cues: [
      "What are the main challenges parents face when trying to control their child's technology use?",
      'How does excessive television or tablet use affect a child\'s cognitive development?',
      'In what ways can technology be used positively and educationally for young learners?'
    ]
  },
  {
    id: 'p3-happiness-wealth',
    category: 'Part 3 - Happiness, Wealth, and Society',
    title: 'Happiness, Wealth, and Society',
    prompt: 'Do you agree that wealth and material possessions are the main drivers of human happiness?',
    cues: [
      'How do societal expectations put pressure on people to achieve a certain standard of living?',
      "Is it possible for a country's economic growth to negatively impact the overall happiness of its citizens?",
      "What role does a strong community play in an individual's overall well-being?"
    ]
  },
  {
    id: 'p3-reading-literature',
    category: 'Part 3 - Reading, Books, and Literature',
    title: 'Reading, Books, and Literature',
    prompt: 'Do you think physical paper books will eventually disappear and be replaced entirely by e-books?',
    cues: [
      'How can parents and schools encourage young children to read more for pleasure?',
      'Why are blockbuster films based on books often criticized for being different from the original story?',
      'What essential skills and perspectives do children gain from reading fictional literature?'
    ]
  },
  {
    id: 'p3-innovation-change',
    category: 'Part 3 - Innovation and Adapting to Change',
    title: 'Innovation and Adapting to Change',
    prompt: 'Why do you think many older people tend to resist major changes in society or technology?',
    cues: [
      'In what ways can governments encourage their citizens to accept new ideas and innovations?',
      'Who do you think adapts to a change of environment more easily: adults or young children?',
      'Do you think the pace of technological change today is too fast for society to handle?'
    ]
  },
  {
    id: 'p3-housing-architecture',
    category: 'Part 3 - Housing, Architecture, and Living Spaces',
    title: 'Housing, Architecture, and Living Spaces',
    prompt: 'How do the housing needs of a young professional differ from those of a large family?',
    cues: [
      'Do you think modern apartment buildings lack the character of older, traditional homes?',
      'What are the long-term consequences of housing becoming unaffordable for young people?',
      'Should governments restrict the construction of high-rise buildings in historical neighborhoods?'
    ]
  },
  {
    id: 'p3-traditional-modern-lifestyle',
    category: 'Part 3 - Traditional vs. Modern Lifestyles',
    title: 'Traditional vs. Modern Lifestyles',
    prompt: 'In what ways are traditional customs and festivals losing their significance in modern society?',
    cues: [
      'Do you think globalization is destroying the unique cultural identities of individual nations?',
      'How can communities preserve their local heritage while still embracing modern progress?',
      'What are the main differences in the way older and younger generations define a "good life"?'
    ]
  },
  {
    id: 'p3-memory-mind-learning',
    category: 'Part 3 - Memory, the Mind, and Learning',
    title: 'Memory, the Mind, and Learning',
    prompt: 'Why do you think some people naturally have better long-term memories than others?',
    cues: [
      'How does relying on smartphones and search engines affect human memory capacity?',
      'Do you think the human brain will evolve to process digital information more efficiently?',
      "Is it more important for schools to test a student's memory or their critical thinking skills?"
    ]
  },
  {
    id: 'p3-travel-tourism',
    category: 'Part 3 - International Travel and Tourism',
    title: 'International Travel and Tourism',
    prompt: "What are the negative impacts of mass tourism on a country's natural environment?",
    cues: [
      "How does traveling abroad change a person's perspective on their own culture?",
      'Do you think international travel will become a luxury reserved only for the wealthy in the future?',
      'How can host countries ensure that tourism benefits the local economy rather than just international corporations?'
    ]
  },
  {
    id: 'p3-rules-laws-society',
    category: 'Part 3 - Rules, Laws, and Society',
    title: 'Rules, Laws, and Society',
    prompt: 'Why is it necessary for a civilized society to have a strict set of laws and regulations?',
    cues: [
      'Do you think certain minor laws (like jaywalking or parking fines) are too strictly enforced?',
      'How has public attitude toward police and law enforcement changed in recent years?',
      'Should the legal voting age be lowered to allow younger people a voice in politics?'
    ]
  },
  {
    id: 'p3-fame-celebrity',
    category: 'Part 3 - Fame, Media, and Celebrity Culture',
    title: 'Fame, Media, and Celebrity Culture',
    prompt: 'Why are people so fascinated by the private lives of celebrities and public figures?',
    cues: [
      'Do you think social media influencers have too much power over the behavior of young people?',
      'What are the psychological downsides of achieving sudden fame at a very young age?',
      'Should athletes and entertainers be paid significantly more than essential workers like doctors or teachers?'
    ]
  },
  {
    id: 'p3-food-production-health',
    category: 'Part 3 - Food Production, Diet, and Global Health',
    title: 'Food Production, Diet, and Global Health',
    prompt: 'How is the globalization of the food industry affecting traditional diets around the world?',
    cues: [
      'Do you think governments should heavily tax unhealthy foods and sugary drinks?',
      'What are the environmental consequences of relying heavily on factory farming for meat?',
      'Will artificial or lab-grown meat become a normal part of the human diet in the future?'
    ]
  },
  {
    id: 'p3-youth-independence',
    category: 'Part 3 - Youth, Adulthood, and Independence',
    title: 'Youth, Adulthood, and Independence',
    prompt: 'At what age do you believe a person truly becomes an independent adult?',
    cues: [
      'Why are young people today delaying major life milestones, such as marriage or buying a home?',
      'What are the advantages of young adults living away from their parents during university?',
      'How does the pressure to succeed academically affect the mental health of teenagers?'
    ]
  },
  {
    id: 'p3-decision-making',
    category: 'Part 3 - Problem-Solving and Decision Making',
    title: 'Problem-Solving and Decision Making',
    prompt: 'Is it generally better to make important decisions quickly or to take a long time to reflect?',
    cues: [
      "How does emotional stress affect a person's ability to solve complex problems?",
      'Do you think computers and AI are better at making objective decisions than human beings?',
      'Should children be allowed to make their own important choices, or should parents decide for them?'
    ]
  },
  {
    id: 'p3-sports-business',
    category: 'Part 3 - Sports, Competition, and Business',
    title: 'Sports, Competition, and Business',
    prompt: 'How has the commercialization of international sports changed the spirit of competition?',
    cues: [
      'Do you think professional sports teams have a responsibility to give back to their local communities?',
      'Is it healthy for children to be exposed to highly competitive environments at a young age?',
      'Why do some nations invest massive amounts of public money into hosting events like the Olympics?'
    ]
  },
  {
    id: 'p3-language-global-english',
    category: 'Part 3 - Language, Communication, and Global English',
    title: 'Language, Communication, and Global English',
    prompt: 'What is lost from global human heritage when a minority language goes extinct?',
    cues: [
      'How has the dominance of the English language affected international business and science?',
      'Do you think translation technology will eventually eliminate the need to learn foreign languages?',
      'What are the benefits of raising a child in a bilingual or multilingual household?'
    ]
  },
  {
    id: 'p3-space-future',
    category: 'Part 3 - Space Exploration and the Future',
    title: 'Space Exploration and the Future',
    prompt: 'Do you believe the massive financial cost of space exploration is justified?',
    cues: [
      'What practical benefits does humanity gain from sending satellites and rovers into space?',
      'Should space exploration be conducted by private companies or exclusively by government agencies?',
      'Do you think humans will eventually establish permanent colonies on other planets?'
    ]
  },
  {
    id: 'p3-friendship-trust',
    category: 'Part 3 - Friendship, Trust, and Social Bonds',
    title: 'Friendship, Trust, and Social Bonds',
    prompt: 'How does the foundation of a friendship change as people transition from childhood to adulthood?',
    cues: [
      'Is it possible to maintain a deep and trusting friendship purely through digital communication?',
      'What are the main reasons why long-term friendships sometimes break down?',
      'How important is it for friends to share the exact same values and political beliefs?'
    ]
  },
  {
    id: 'p3-workplace-automation',
    category: 'Part 3 - Workplaces, Automation, and the Economy',
    title: 'Workplaces, Automation, and the Economy',
    prompt: 'How is the shift toward remote work changing the culture and dynamics of the modern company?',
    cues: [
      'What steps should governments take to support workers whose jobs are replaced by automation?',
      'Do you think the traditional five-day workweek will eventually be shortened?',
      "How does a lack of job security affect a worker's loyalty to their employer?"
    ]
  },
  {
    id: 'p3-shopping-ecommerce',
    category: 'Part 3 - Shopping, E-commerce, and the High Street',
    title: 'Shopping, E-commerce, and the High Street',
    prompt: 'What are the long-term effects of e-commerce on physical retail stores and local high streets?',
    cues: [
      'How do online retailers use algorithms and data to manipulate consumer purchasing habits?',
      'Why is the concept of "fast fashion" becoming increasingly controversial?',
      'Do you think physical cash will completely disappear in favor of digital payments?'
    ]
  },
  {
    id: 'p3-hobbies-leisure',
    category: 'Part 3 - Hobbies, Leisure, and Free Time',
    title: 'Hobbies, Leisure, and Free Time',
    prompt: 'Why is it psychologically important for adults to maintain hobbies entirely separate from their careers?',
    cues: [
      'Has modern technology increased the amount of free time we have, or simply filled it with new distractions?',
      'Do you think monetizing a hobby (turning it into a business) ruins the enjoyment of the activity?',
      'How do leisure activities differ between urban cities and rural communities?'
    ]
  },
  {
    id: 'p3-transport-environment',
    category: 'Part 3 - Transportation and the Environment',
    title: 'Transportation and the Environment',
    prompt: 'What are the biggest hurdles to widespread adoption of electric vehicles globally?',
    cues: [
      'Should city centers ban private cars entirely to reduce pollution and increase pedestrian safety?',
      "How does the design of a city's transport network impact the social equality of its residents?",
      'Will high-speed rail networks eventually replace short-haul domestic flights?'
    ]
  },
  {
    id: 'p3-education-equality',
    category: 'Part 3 - Education, Equality, and Access',
    title: 'Education, Equality, and Access',
    prompt: "To what extent does a student's socioeconomic background determine their academic success?",
    cues: [
      'Should university education be entirely free and subsidized by the state?',
      'What are the disadvantages of a standardized testing system for evaluating student intelligence?',
      'How can educational institutions better prepare students for jobs that do not even exist yet?'
    ]
  },
  {
    id: 'p3-celebrations-culture',
    category: 'Part 3 - Celebrations, Festivals, and Culture',
    title: 'Celebrations, Festivals, and Culture',
    prompt: 'How have the commercial aspects of major holidays overshadowed their original historical or religious meanings?',
    cues: [
      'Why is it important for a nation to have public holidays that the entire country observes together?',
      'Do you think local festivals are primarily designed for the community, or as attractions for tourists?',
      'How does participating in cultural celebrations help children form their identity?'
    ]
  },
  {
    id: 'p3-success-failure',
    category: 'Part 3 - Success, Failure, and Motivation',
    title: 'Success, Failure, and Motivation',
    prompt: 'Is success primarily the result of hard work and talent, or simply good timing and luck?',
    cues: [
      'Why is society often so unforgiving of failure, especially in business or public life?',
      'How can experiencing a major failure early in life be beneficial to a person\'s long-term development?',
      'Do you think schools focus too much on academic success and ignore other forms of achievement?'
    ]
  }
]

const FULL_EXAM_TOPICS: SpeakingTopic[] = [
  {
    id: 'full-exam-1',
    category: 'Full Speaking Exam - Apps and Technology',
    title: 'Test Set 1: Apps and Technology',
    prompt: 'Describe an app you use that improves your daily life.',
    cues: [
      'Part 1 - Do you often use apps on your smartphone?',
      'Part 1 - What are the most popular apps in your country right now?',
      'Part 1 - Are there any apps you find particularly useful for learning or working?',
      'Part 1 - Have you ever paid money to download a premium app?',
      'Part 1 - Have you ever deleted an app because you felt you were using it too much?',
      'Part 3 - Are young people too reliant on apps?',
      'Part 3 - How is AI changing learning and grading?',
      'Part 3 - Should parents strictly limit screen time?',
      'Part 3 - Risks of storing personal data on cloud platforms?'
    ]
  },
  {
    id: 'full-exam-2',
    category: 'Full Speaking Exam - Weather and Environment',
    title: 'Test Set 2: Weather and The Environment',
    prompt: 'Describe a place you visited where the environment was heavily polluted.',
    cues: [
      'Part 1 - What is the general climate and weather like in your country?',
      'Part 1 - What is your absolute favorite type of weather?',
      'Part 1 - Does extreme weather often affect daily life or transportation where you live?',
      'Part 1 - Do you prefer to spend time outdoors when it is hot or when it is cold?',
      'Part 1 - Do you find that your mood or energy levels change with the changing seasons?',
      'Part 3 - What are the most pressing environmental problems facing rapidly growing cities today?',
      'Part 3 - Who should bear more responsibility for keeping a city clean: the local government or individual citizens?',
      'Part 3 - How can urban planners design cities that are both modern and environmentally sustainable?',
      'Part 3 - Do you think single-use plastics should be completely banned worldwide?'
    ]
  },
  {
    id: 'full-exam-3',
    category: 'Full Speaking Exam - Work and Ambition',
    title: 'Test Set 3: Work and Ambition',
    prompt: 'Describe a successful businessperson you admire.',
    cues: [
      'Part 1 - What is your specific job or profession?',
      'Part 1 - Why did you choose this particular line of work?',
      'Part 1 - Do you enjoy your daily tasks and responsibilities?',
      'Part 1 - Do you prefer working independently or as part of a team?',
      'Part 1 - What are your future career plans over the next five years?',
      'Part 3 - What essential skills and personality traits are required to be an effective company leader?',
      'Part 3 - Is it becoming more common for people to completely change their careers in the middle of their lives?',
      "Part 3 - How does a lack of job security affect a worker's mental health and loyalty to a company?",
      'Part 3 - Is achieving a high salary more important than maintaining a healthy work-life balance?'
    ]
  },
  {
    id: 'full-exam-4',
    category: 'Full Speaking Exam - Travel and Transport',
    title: 'Test Set 4: Travel and Transport',
    prompt: 'Describe a long journey you traveled by car, plane, or public transport.',
    cues: [
      'Part 1 - Do you enjoy taking holidays?',
      'Part 1 - What do you usually like to do when you have time off?',
      'Part 1 - Do you prefer a relaxing, leisurely holiday or a busy, adventurous one?',
      'Part 1 - Who do you usually prefer to travel with?',
      'Part 1 - Where did you travel for your last major holiday?',
      'Part 3 - What are the negative environmental and cultural impacts of mass tourism on a country?',
      "Part 3 - How does living or traveling abroad change a person's perspective on their own culture?",
      'Part 3 - Do you think globalization is destroying the unique cultural identities of individual nations?',
      'Part 3 - Will high-speed rail networks eventually replace short domestic flights in the future?'
    ]
  },
  {
    id: 'full-exam-5',
    category: 'Full Speaking Exam - Health and Daily Routines',
    title: 'Test Set 5: Health and Daily Routines',
    prompt: 'Describe a healthy habit you have recently developed.',
    cues: [
      'Part 1 - When do you usually wake up in the morning?',
      'Part 1 - Do you have the exact same routine every single day?',
      'Part 1 - What is your favorite part of the day?',
      'Part 1 - How often do you change or adjust your daily schedule?',
      'Part 1 - Do you think it is important for people to have a strict daily routine?',
      'Part 3 - How is the globalization of the fast-food industry affecting traditional diets and health?',
      'Part 3 - Do you think governments should heavily tax unhealthy foods and sugary drinks?',
      'Part 3 - How do modern office jobs and sedentary lifestyles negatively impact human physical health?',
      'Part 3 - Should healthcare be entirely free and subsidized by the government for all citizens?'
    ]
  },
  {
    id: 'full-exam-6',
    category: 'Full Speaking Exam - Homes and Architecture',
    title: 'Test Set 6: Homes and Architecture',
    prompt: 'Describe a historical building you have visited or read about.',
    cues: [
      'Part 1 - Do you live in a house or an apartment?',
      'Part 1 - What is your favorite room in your home, and why?',
      'Part 1 - How long have you been living there?',
      'Part 1 - Have you decorated your room with anything special?',
      "Part 1 - What would you like to change about your home's design or location?",
      'Part 3 - Do you think modern apartment buildings lack the character and beauty of older, traditional homes?',
      'Part 3 - Why do some young students find learning about history boring, and how can teachers fix this?',
      'Part 3 - Should governments restrict the construction of high-rise skyscrapers in historical neighborhoods?',
      "Part 3 - How does preserving historical architecture contribute to a nation's cultural identity?"
    ]
  },
  {
    id: 'full-exam-7',
    category: 'Full Speaking Exam - Social Media and Influence',
    title: 'Test Set 7: Social Media and Influence',
    prompt: 'Describe a content creator or influencer whose content you regularly watch.',
    cues: [
      'Part 1 - Which social media platforms do you use the most frequently?',
      'Part 1 - Do you spend a lot of time scrolling on social media apps every day?',
      'Part 1 - Do you prefer to post updates about your life or just view what others post?',
      'Part 1 - Have you ever taken a long break from using social media?',
      'Part 1 - Do you think social media is a good way to keep in touch with old friends?',
      'Part 3 - Do you think social media influencers have too much power over the purchasing habits of young people?',
      'Part 3 - How has the rise of digital media changed the way people consume news compared to traditional newspapers?',
      'Part 3 - What are the psychological downsides for children who achieve sudden fame on the internet?',
      'Part 3 - How do online algorithms manipulate what information and advertisements we see daily?'
    ]
  },
  {
    id: 'full-exam-8',
    category: 'Full Speaking Exam - Friendships and Moving',
    title: 'Test Set 8: Friendships and Moving',
    prompt: 'Describe someone you know who has recently moved to a new city or country.',
    cues: [
      'Part 1 - Do you have a large group of friends or a small, close-knit circle?',
      'Part 1 - Are you still friends with anyone from your childhood?',
      'Part 1 - What activities do you usually do when you hang out with your friends?',
      'Part 1 - Do you prefer spending your weekends with your family or your friends?',
      'Part 1 - What qualities do you look for when making new friends?',
      'Part 3 - Why are young people today delaying major life milestones, such as marriage or buying a house?',
      'Part 3 - What are the benefits and drawbacks of several generations of a family living under one roof?',
      'Part 3 - Is it possible to maintain a deep, trusting friendship purely through digital communication?',
      'Part 3 - At what age do you believe a person truly becomes a fully independent adult?'
    ]
  },
  {
    id: 'full-exam-9',
    category: 'Full Speaking Exam - Studying and Skill Development',
    title: 'Test Set 9: Studying and Skill Development',
    prompt: 'Describe a skill that took you a long time to learn.',
    cues: [
      'Part 1 - What subject are you currently studying?',
      'Part 1 - Why did you choose to study this subject?',
      'Part 1 - What is the most difficult part of your studies?',
      'Part 1 - Do you prefer to study alone or in a group with other students?',
      'Part 1 - What do you plan to do after you finish your education?',
      'Part 3 - Why do you think some people naturally have better long-term memories or learn faster than others?',
      "Part 3 - Is it more important for schools to test a student's memory through exams or their practical critical thinking skills?",
      "Part 3 - To what extent does a student's socioeconomic background determine their academic success?",
      'Part 3 - Should children be allowed to make their own choices regarding their education, or should parents decide for them?'
    ]
  },
  {
    id: 'full-exam-10',
    category: 'Full Speaking Exam - Clothes and Consumerism',
    title: 'Test Set 10: Clothes and Consumerism',
    prompt: 'Describe something you bought recently that you are very happy with.',
    cues: [
      'Part 1 - Are clothes and fashion important to you?',
      'Part 1 - What types of clothes do you usually feel most comfortable wearing?',
      'Part 1 - Do you ever wear traditional clothing from your country?',
      'Part 1 - Do you spend a lot of money on buying new clothes?',
      'Part 1 - Did you have to wear a school uniform as a child, and did you like it?',
      'Part 3 - What are the long-term effects of e-commerce on physical retail stores and local communities?',
      'Part 3 - Do you agree that wealth and material possessions are the main drivers of human happiness?',
      'Part 3 - Why is the concept of "fast fashion" becoming increasingly controversial regarding the environment?',
      'Part 3 - Do you think physical cash will completely disappear in the next decade in favor of digital payments?'
    ]
  }
]

const SPEAKING_MODE_LABELS: Record<SpeakingTestMode, string> = {
  part1: 'Part 1',
  part2: 'Part 2',
  part3: 'Part 3',
  full: 'Full Exam'
}

const RECOMMENDATION_LEVEL_META: Record<RecommendationLevel, string> = {
  B1: 'Band 6.5',
  B2: 'Band 7',
  C1: 'Band 7+'
}

const EXPECTED_SCORE_OPTIONS: Array<{
  id: string
  label: string
  subtitle: string
  warning?: string
  bullets?: Array<{
    point: string
    example: string
  }>
}> = [
  {
    id: 'explore',
    label: 'แค่ต้องการทดสอบเพื่อดูคะแนน',
    subtitle: 'ขอดูคะแนนคร่าว ๆ ก่อน',
    warning:
      'P’Doy’s Recommendation: ไม่ค่อยแนะนำครับ ถ้าตั้งเป้าคะแนนไว้ก่อน คุณจะโฟกัสเทคนิคได้ตรงจุดกว่า และเห็นพัฒนาการชัดกว่า'
  },
  {
    id: 'band5',
    label: 'Band 5',
    subtitle: 'ระดับพื้นฐาน (Modest Level)',
    bullets: [
      {
        point: 'พยายามพูดให้ต่อเนื่องและพูดให้จบความคิดในแต่ละประโยค',
        example: `P'Doy's Recommendation: เช่น แทนที่จะหยุดที่ "I like it because..." ให้พูดต่อจนจบว่า "I like it because it helps me relax after school."`
      },
      {
        point: 'ใช้คำศัพท์พื้นฐานที่คุ้นเคยและโครงสร้างประโยคง่าย ๆ ก่อน',
        example: `P'Doy's Recommendation: เช่น ใช้ "I usually go there with my friends" ดีกว่าพยายามใช้ประโยคยากแล้วผิดหลายจุด`
      },
      {
        point: 'หยุดคิดได้ แต่พยายามอย่าเงียบนานเกินไป',
        example: `P'Doy's Recommendation: ถ้าคิดไม่ออก ให้ใช้ตัวช่วยอย่าง "To be honest..." หรือ "Let me think for a moment..." แล้วพูดต่อทันที`
      }
    ]
  },
  {
    id: 'band6',
    label: 'Band 6',
    subtitle: 'ระดับใช้งานได้ดี (Competent Level)',
    bullets: [
      {
        point: 'จำไว้เสมอว่า ศัพท์ง่ายแต่ใช้ถูก ดีกว่าศัพท์ยากแต่ใช้ผิด',
        example: `P'Doy's Recommendation: เช่น ใช้ "important" ให้ถูกในประโยคก่อน ดีกว่าฝืนใช้ "significant" แล้ววางผิดตำแหน่ง`
      },
      {
        point: 'มี grammar mistakes ได้บ้าง แต่ต้องไม่ทำให้ความหมายเพี้ยน',
        example: `P'Doy's Recommendation: เช่น "He go to work every day" ยังพอเดาได้ แต่เป้าคือปรับให้เป็น "He goes to work every day."`
      },
      {
        point: 'ออกเสียง plural -s, present simple -s และ past tense -ed ให้ชัด',
        example: `P'Doy's Recommendation: เช่น "students", "works", "wanted" ถ้าออกเสียงท้ายชัด คะแนนความแม่นจะดูดีขึ้นทันที`
      }
    ]
  },
  {
    id: 'band7',
    label: 'Band 7',
    subtitle: 'ระดับดีเยี่ยม (Proficient Level)',
    bullets: [
      {
        point: 'ในแต่ละคำตอบ แค่มีคำระดับ C1 ประมาณ 2-3 คำที่ใช้ได้เป็นธรรมชาติก็พอ',
        example: `P'Doy's Recommendation: เช่น เปลี่ยนจาก "very important" เป็น "essential" หรือจาก "help me a lot" เป็น "benefit me greatly" แบบพอดี ๆ`
      },
      {
        point: 'ระวัง singular/plural, present simple -s และ past tense endings ให้มาก',
        example: `P'Doy's Recommendation: เช่น เวลาอธิบายเรื่องทั่วไปพูด "Students need support" ไม่ใช่ "Student need support"`
      },
      {
        point: 'ถ้าเป็น Part 3 ควรใช้ passive voice ให้ถูกต้องอย่างน้อย 1 ครั้ง',
        example: `P'Doy's Recommendation: เช่น "A lot of information is shared online nowadays." จะช่วยดัน grammar range ให้ดูสูงขึ้น`
      }
    ]
  },
  {
    id: 'band89',
    label: 'Band 8 - 9',
    subtitle: 'ระดับเชี่ยวชาญ (Expert Level)',
    bullets: [
      {
        point: 'ใช้คำศัพท์ระดับ C1-C2 ให้เป็นธรรมชาติ ไม่ใช่ยัดคำยากแบบฝืน ๆ',
        example: `P'Doy's Recommendation: เช่น ใช้ "a valuable opportunity" หรือ "a long-term benefit" ในบริบทที่เข้าจริง ดีกว่าใส่คำยากแบบลอย ๆ`
      },
      {
        point: 'ไวยากรณ์ควรแทบไม่มีข้อผิดพลาด และควบคุมประโยคซับซ้อนกับ conditionals ได้',
        example: `P'Doy's Recommendation: เช่น "If more funding were provided, the system would become far more effective."`
      },
      {
        point: 'ถ้าเป็น Part 3 ควรใช้ passive voice หลายครั้ง: Band 8 อย่างน้อย 2 ครั้ง และ Band 9 อย่างน้อย 3 ครั้ง',
        example: `P'Doy's Recommendation: เช่น "It is often argued that...", "More attention should be given to..." และ "The issue is usually overlooked."`
      }
    ]
  }
] as const

const PART1_GENERIC_RECOMMENDATIONS: RecommendationItem[] = [
  { level: 'B1', phrase: 'to be honest', tip: 'ใช้เปิดคำตอบให้ฟังเป็นธรรมชาติขึ้น' },
  { level: 'B1', phrase: 'for me personally', tip: 'ช่วยทำให้คำตอบดูเป็น personal response มากขึ้น' },
  { level: 'B2', phrase: 'one thing I really like is', tip: 'ใช้ขยายคำตอบให้ไม่สั้นเกินไป' },
  { level: 'B2', phrase: 'it depends on the situation', tip: 'เหมาะกับคำถาม preference หรือ opinion' },
  { level: 'C1', phrase: 'if I had to choose, I would say', tip: 'ใช้ตอบแบบมี structure และดูมั่นใจขึ้น' },
  { level: 'C1', phrase: 'what matters most to me is', tip: 'เหมาะกับคำถาม why / importance' }
]

const PART1_INTENT_BANKS: Array<{
  matcher: (question: string) => boolean
  items: RecommendationItem[]
}> = [
  {
    matcher: (question) => /why|reason|choose/i.test(question),
    items: [
      { level: 'B1', phrase: 'the main reason is that', tip: 'ตอบ why question ได้ตรงและชัด' },
      { level: 'B2', phrase: 'one of the biggest reasons is', tip: 'ช่วยขยายเหตุผลให้ดูเป็นธรรมชาติมากขึ้น' },
      { level: 'C1', phrase: 'what attracted me to it in the first place was', tip: 'เหมาะกับคำถาม about choosing work, study, hobby' }
    ]
  },
  {
    matcher: (question) => /how often|usually|often|every day|frequency/i.test(question),
    items: [
      { level: 'B1', phrase: 'from time to time', tip: 'ใช้แทน sometimes ได้ดูหลากหลายขึ้น' },
      { level: 'B2', phrase: 'on a fairly regular basis', tip: 'ใช้ตอบความถี่แบบ band 7 ขึ้นไปได้ดี' },
      { level: 'C1', phrase: 'it has become part of my routine', tip: 'ช่วยให้คำตอบดูลื่นและ mature ขึ้น' }
    ]
  },
  {
    matcher: (question) => /prefer|better|rather/i.test(question),
    items: [
      { level: 'B1', phrase: 'I would rather', tip: 'ใช้เปรียบเทียบ choice ได้ตรงกว่า I like more' },
      { level: 'B2', phrase: 'I tend to prefer', tip: 'ฟังเป็นธรรมชาติมากกับ preference question' },
      { level: 'C1', phrase: 'if I had to pick one, I would definitely go for', tip: 'ช่วยให้คำตอบดู decisive และ fluent' }
    ]
  },
  {
    matcher: (question) => /future|plan|would like|in the future/i.test(question),
    items: [
      { level: 'B1', phrase: 'in the near future', tip: 'ใช้พูดถึงแผนสั้น ๆ ได้ง่าย' },
      { level: 'B2', phrase: 'I am hoping to', tip: 'ดีกว่า I want to ถ้าอยากให้คำตอบดูดีขึ้น' },
      { level: 'C1', phrase: 'ideally, I would like to', tip: 'ช่วยให้คำตอบดูเป็นธรรมชาติและ sophisticated ขึ้น' }
    ]
  },
  {
    matcher: (question) => /child|when you were young|as a child|used to|past/i.test(question),
    items: [
      { level: 'B1', phrase: 'when I was younger', tip: 'ช่วยเปิดคำตอบเรื่องอดีตได้ smooth' },
      { level: 'B2', phrase: 'I used to', tip: 'ใช้ past habit ได้ตรงกว่า before I always' },
      { level: 'C1', phrase: 'looking back, I would say', tip: 'ดีสำหรับการ reflect เรื่องอดีตสั้น ๆ' }
    ]
  }
]

const PART1_TOPIC_BANKS: Array<{
  matcher: (question: string) => boolean
  items: RecommendationItem[]
}> = [
  {
    matcher: (question) => /work|job|study|subject|school|university/i.test(question),
    items: [
      { level: 'B1', phrase: 'I am currently involved in', tip: 'ใช้แทน I do / I study ได้ลื่นขึ้น' },
      { level: 'B1', phrase: 'major in', tip: 'เหมาะมากกับคำถามเรื่องสาขาที่เรียน' },
      { level: 'B1', phrase: 'work full-time', tip: 'ใช้ตอบสถานะงานแบบตรงและเป็นธรรมชาติ' },
      { level: 'B2', phrase: 'it is both challenging and rewarding', tip: 'เหมาะกับคำถาม about work or study' },
      { level: 'B2', phrase: 'gain hands-on experience', tip: 'ใช้กับการเรียนหรือการทำงานที่ได้ฝึกจริง' },
      { level: 'B2', phrase: 'career path', tip: 'ดีมากสำหรับคำถามเรื่องอนาคตหรือเหตุผลที่เลือกสายนี้' },
      { level: 'C1', phrase: 'it gives me a strong sense of purpose', tip: 'ช่วยให้คำตอบลึกขึ้น' }
    ]
  },
  {
    matcher: (question) => /home|hometown|area|city|place/i.test(question),
    items: [
      { level: 'B1', phrase: 'I have lived there for', tip: 'ใช้เล่าที่อยู่ได้ตรงและ natural' },
      { level: 'B2', phrase: 'it has a very relaxed atmosphere', tip: 'ใช้บรรยายสถานที่ได้ดี' },
      { level: 'C1', phrase: 'it has changed quite a lot over the years', tip: 'ดีสำหรับขยายคำตอบเรื่อง hometown' }
    ]
  },
  {
    matcher: (question) => /food|meal|cook|restaurant|drink|chocolate/i.test(question),
    items: [
      { level: 'B1', phrase: 'I am really into', tip: 'ใช้แทน I like มาก ๆ ได้ดี' },
      { level: 'B2', phrase: 'it is my go-to choice', tip: 'เหมาะกับคำถาม about favorite food or drink' },
      { level: 'C1', phrase: 'it is surprisingly satisfying', tip: 'ช่วยเพิ่มสีสันให้คำตอบ' }
    ]
  },
  {
    matcher: (question) => /fashion|clothes|wear|outfit|uniform|dress/i.test(question),
    items: [
      { level: 'B1', phrase: 'casual clothes', tip: 'เป็น collocation พื้นฐานที่ใช้ได้บ่อยมากในหัวข้อ fashion' },
      { level: 'B1', phrase: 'feel comfortable in', tip: 'ใช้กับคำถามเรื่องเสื้อผ้าที่ใส่แล้วสบาย' },
      { level: 'B1', phrase: 'dress up for special occasions', tip: 'ใช้เล่าการแต่งตัวในโอกาสพิเศษ' },
      { level: 'B2', phrase: 'have a good sense of style', tip: 'ใช้พูดเรื่อง taste ด้านแฟชั่นให้ดูธรรมชาติ' },
      { level: 'B2', phrase: 'follow fashion trends', tip: 'เหมาะกับคำถามว่าคุณตามแฟชั่นไหม' },
      { level: 'B2', phrase: 'smart-casual outfit', tip: 'ใช้ขยายเรื่องประเภทเสื้อผ้าให้เฉพาะขึ้น' },
      { level: 'C1', phrase: 'express my personality through clothes', tip: 'ช่วยให้คำตอบดู personal และ sophisticated ขึ้น' },
      { level: 'C1', phrase: 'make a good first impression', tip: 'ดีสำหรับอธิบายว่าทำไมเสื้อผ้าจึงสำคัญ' }
    ]
  },
  {
    matcher: (question) => /app|technology|computer|internet|social media|online|website|smartphone/i.test(question),
    items: [
      { level: 'B1', phrase: 'use it on a daily basis', tip: 'ใช้เล่าความถี่การใช้งาน technology ได้ดี' },
      { level: 'B1', phrase: 'look things up online', tip: 'เป็น natural collocation สำหรับ internet/app use' },
      { level: 'B1', phrase: 'stay in touch with', tip: 'ใช้กับ social media หรือ messaging apps ได้ดี' },
      { level: 'B2', phrase: 'save a lot of time and effort', tip: 'อธิบาย benefit ของ technology ได้ลื่นขึ้น' },
      { level: 'B2', phrase: 'user-friendly interface', tip: 'เหมาะกับคำถามเกี่ยวกับ app ที่ชอบใช้' },
      { level: 'B2', phrase: 'rely on it for work or study', tip: 'ดีสำหรับขยายบทบาทของ computer/internet' },
      { level: 'C1', phrase: 'streamline everyday tasks', tip: 'ยกระดับคำว่า make life easier' },
      { level: 'C1', phrase: 'be constantly connected', tip: 'เหมาะกับคำถามเรื่องผลของ internet หรือ social media' }
    ]
  },
  {
    matcher: (question) => /friend|neighbour|social|people|family/i.test(question),
    items: [
      { level: 'B1', phrase: 'spend time together', tip: 'ใช้กับคำถามเกี่ยวกับเพื่อนหรือการเข้าสังคมได้บ่อย' },
      { level: 'B1', phrase: 'have a lot in common', tip: 'ใช้บอกเหตุผลว่าทำไมเข้ากันได้' },
      { level: 'B2', phrase: 'keep in touch regularly', tip: 'เหมาะกับคำถามเรื่องยังติดต่อกันไหม' },
      { level: 'B2', phrase: 'a close-knit group of friends', tip: 'ตรงกับหัวข้อ friendship มาก' },
      { level: 'B2', phrase: 'get along well with', tip: 'ใช้เล่าความสัมพันธ์กับคนรอบตัวได้ดี' },
      { level: 'C1', phrase: 'build a strong bond', tip: 'ช่วยยกระดับคำตอบเกี่ยวกับความสัมพันธ์' },
      { level: 'C1', phrase: 'have a positive influence on me', tip: 'เหมาะกับคำถามว่าทำไมถึงชอบใครบางคน' }
    ]
  },
  {
    matcher: (question) => /animal|pet|wild/i.test(question),
    items: [
      { level: 'B1', phrase: 'keep a pet', tip: 'เป็น collocation พื้นฐานที่ใช้บ่อยในหัวข้อสัตว์เลี้ยง' },
      { level: 'B1', phrase: 'be fond of animals', tip: 'ใช้แทน I like animals' },
      { level: 'B2', phrase: 'be easy to take care of', tip: 'เหมาะกับคำถามว่าทำไมสัตว์ชนิดนี้นิยม' },
      { level: 'B2', phrase: 'play an important role in nature', tip: 'ใช้กับ wild animals หรือ environment' },
      { level: 'B2', phrase: 'provide emotional support', tip: 'ดีสำหรับประโยชน์ของการมีสัตว์เลี้ยง' },
      { level: 'C1', phrase: 'raise awareness of wildlife conservation', tip: 'ช่วยยกระดับคำตอบเรื่องสัตว์ป่า' },
      { level: 'C1', phrase: 'form a strong attachment to', tip: 'ใช้พูดความผูกพันกับสัตว์เลี้ยง' }
    ]
  },
  {
    matcher: (question) => /travel|holiday|transport|bike|bicycle|commute|watch|weather/i.test(question),
    items: [
      { level: 'B1', phrase: 'go on holiday', tip: 'ใช้กับหัวข้อ vacation/travel ได้ตรงมาก' },
      { level: 'B1', phrase: 'get around the city', tip: 'เหมาะกับคำถามเรื่อง transportation' },
      { level: 'B1', phrase: 'a convenient way to travel', tip: 'ใช้ขยายเรื่อง transport ได้ดี' },
      { level: 'B2', phrase: 'heavy traffic congestion', tip: 'เหมาะกับคำถามเรื่องการเดินทางในเมือง' },
      { level: 'B2', phrase: 'public transport system', tip: 'เป็น collocation สำคัญของหัวข้อนี้' },
      { level: 'B2', phrase: 'make the most of my holiday', tip: 'ดีสำหรับพูดถึงการท่องเที่ยว' },
      { level: 'C1', phrase: 'be heavily dependent on', tip: 'ใช้กับการพึ่งรถหรือระบบขนส่ง' },
      { level: 'C1', phrase: 'weather conditions can be unpredictable', tip: 'ช่วยให้คำตอบเรื่อง weather ดูมี range ขึ้น' }
    ]
  },
  {
    matcher: (question) => /book|read|music|concert|sport|game|science|write|art/i.test(question),
    items: [
      { level: 'B1', phrase: 'in my spare time', tip: 'ใช้ขึ้นต้นคำตอบเกี่ยวกับ hobby ได้ง่าย' },
      { level: 'B1', phrase: 'be interested in', tip: 'ใช้แทน I like ได้เนียนกว่า' },
      { level: 'B2', phrase: 'broaden my horizons', tip: 'เหมาะกับ books, science, travel, art' },
      { level: 'B2', phrase: 'help me unwind', tip: 'ดีสำหรับ music, sport, reading after work/study' },
      { level: 'B2', phrase: 'keep me mentally engaged', tip: 'ใช้กับ reading, science, writing ได้ดี' },
      { level: 'C1', phrase: 'spark my imagination', tip: 'เหมาะกับ books, music, art, writing' },
      { level: 'C1', phrase: 'give me a sense of achievement', tip: 'ใช้กับ sport, writing, music practice ได้ดี' }
    ]
  },
  {
    matcher: (question) => /water|drink|tea|coffee/i.test(question),
    items: [
      { level: 'B1', phrase: 'drink plenty of water', tip: 'ตรงหัวข้อ hydration มากและใช้ได้จริง' },
      { level: 'B1', phrase: 'start my day with coffee', tip: 'ใช้กับ routine เรื่อง drinks ได้ดี' },
      { level: 'B2', phrase: 'cut down on sugary drinks', tip: 'ช่วยให้คำตอบเรื่องสุขภาพดูดีขึ้น' },
      { level: 'B2', phrase: 'grab a cup of coffee', tip: 'เป็น natural everyday collocation' },
      { level: 'C1', phrase: 'stay properly hydrated', tip: 'ยกระดับคำตอบเรื่อง water' },
      { level: 'C1', phrase: 'have a refreshing drink', tip: 'ใช้ขยายคำตอบให้ไม่ซ้ำ drink water เฉย ๆ' }
    ]
  },
  {
    matcher: (question) => /environment|garbage|recycling|plastic|clean/i.test(question),
    items: [
      { level: 'B1', phrase: 'throw rubbish away properly', tip: 'ใช้ตอบพฤติกรรมพื้นฐานเรื่องความสะอาด' },
      { level: 'B1', phrase: 'keep the area clean', tip: 'เหมาะกับคำถามเรื่อง neighbourhood/environment' },
      { level: 'B2', phrase: 'recycle household waste', tip: 'เป็น collocation ที่ตรงหัวข้อ recycling มาก' },
      { level: 'B2', phrase: 'reduce plastic consumption', tip: 'ช่วยให้คำตอบดูมี range มากขึ้น' },
      { level: 'C1', phrase: 'take environmental responsibility seriously', tip: 'ดีสำหรับ opinion question' },
      { level: 'C1', phrase: 'raise public awareness', tip: 'ใช้กับคำถามแนวแก้ปัญหาสิ่งแวดล้อม' }
    ]
  }
]

const PART3_GENERIC_RECOMMENDATIONS: RecommendationItem[] = [
  { level: 'B1', phrase: 'for example', tip: 'ใช้เติมตัวอย่างให้คำตอบไม่กว้างเกินไป' },
  { level: 'B1', phrase: 'because of this', tip: 'ใช้เชื่อมเหตุและผลได้ง่าย' },
  { level: 'B2', phrase: 'from my perspective', tip: 'ช่วยเปิด opinion ให้ดูเป็นธรรมชาติขึ้น' },
  { level: 'B2', phrase: 'this can lead to', tip: 'ใช้ขยายผลลัพธ์หรือ consequence' },
  { level: 'C1', phrase: 'to some extent', tip: 'ช่วยทำให้ opinion ฟัง mature ขึ้น' },
  { level: 'C1', phrase: 'in the long run', tip: 'เหมาะกับคำถามผลกระทบระยะยาว' }
]

const PART3_INTENT_BANKS: Array<{
  matcher: (question: string) => boolean
  items: RecommendationItem[]
}> = [
  {
    matcher: (question) => /why|reason|what causes/i.test(question),
    items: [
      { level: 'B1', phrase: 'one possible reason is that', tip: 'ใช้ตอบ why question ให้ตรงจุด' },
      { level: 'B2', phrase: 'this is largely because', tip: 'เชื่อมเหตุผลได้ smooth ขึ้น' },
      { level: 'C1', phrase: 'there are several factors behind this', tip: 'เหมาะกับ Part 3 abstract discussion' }
    ]
  },
  {
    matcher: (question) => /benefit|advantage|positive|good/i.test(question),
    items: [
      { level: 'B1', phrase: 'one clear benefit is', tip: 'ใช้เปิดช่วงข้อดีได้ชัด' },
      { level: 'B2', phrase: 'it can be highly beneficial for', tip: 'ยกระดับคำว่า good for' },
      { level: 'C1', phrase: 'one long-term advantage is', tip: 'ช่วยขยายผลกระทบได้ดี' }
    ]
  },
  {
    matcher: (question) => /drawback|disadvantage|negative|problem|risk/i.test(question),
    items: [
      { level: 'B1', phrase: 'one major problem is', tip: 'ช่วยตอบด้านลบอย่างตรงไปตรงมา' },
      { level: 'B2', phrase: 'the downside is that', tip: 'ใช้แทน but it is bad ได้ธรรมชาติกว่า' },
      { level: 'C1', phrase: 'this may create unintended consequences', tip: 'ดีสำหรับคำถามเชิงวิเคราะห์' }
    ]
  },
  {
    matcher: (question) => /future|will|in the next|likely/i.test(question),
    items: [
      { level: 'B1', phrase: 'I think this will become more common', tip: 'ใช้พยากรณ์อนาคตได้ง่าย' },
      { level: 'B2', phrase: 'this trend is likely to continue', tip: 'เหมาะกับ future trend questions' },
      { level: 'C1', phrase: 'I would expect this to become increasingly important', tip: 'ฟังเป็น mature prediction มากขึ้น' }
    ]
  },
  {
    matcher: (question) => /compare|difference|similar/i.test(question),
    items: [
      { level: 'B1', phrase: 'the main difference is', tip: 'ช่วยเปิดประเด็นเปรียบเทียบให้ชัด' },
      { level: 'B2', phrase: 'compared with the past', tip: 'ดีสำหรับ compare past and present' },
      { level: 'C1', phrase: 'the distinction becomes clearer when', tip: 'ช่วยให้คำตอบดู analytical ขึ้น' }
    ]
  },
  {
    matcher: (question) => /should|solution|what can be done|how can/i.test(question),
    items: [
      { level: 'B1', phrase: 'one thing that could be done is', tip: 'ใช้เสนอ solution ได้ตรง' },
      { level: 'B2', phrase: 'a practical solution would be', tip: 'ช่วยให้คำตอบดูมี structure' },
      { level: 'C1', phrase: 'this issue could be addressed by', tip: 'เหมาะกับคำถามเชิง policy / solution' }
    ]
  }
]

const PART3_TOPIC_BANKS: Array<{
  matcher: (question: string) => boolean
  items: RecommendationItem[]
}> = [
  {
    matcher: (question) => /technology|internet|social media|online|digital/i.test(question),
    items: [
      { level: 'B1', phrase: 'it plays a big role in daily life', tip: 'ใช้ตอบบทบาทของ technology ได้ง่าย' },
      { level: 'B2', phrase: 'it has completely changed the way people', tip: 'ดีสำหรับผลกระทบของ technology' },
      { level: 'B2', phrase: 'be heavily dependent on technology', tip: 'ใช้ขยายการพึ่งพา technology ในสังคม' },
      { level: 'B2', phrase: 'digital communication tools', tip: 'เป็น collocation ตรงหัวข้อมาก' },
      { level: 'C1', phrase: 'it has transformed the way society functions', tip: 'ยกระดับคำตอบให้ abstract มากขึ้น' },
      { level: 'C1', phrase: 'blur the boundary between work and private life', tip: 'เหมาะกับผลกระทบของ technology ต่อชีวิตประจำวัน' }
    ]
  },
  {
    matcher: (question) => /education|student|school|teacher|learn/i.test(question),
    items: [
      { level: 'B1', phrase: 'students can benefit from', tip: 'ใช้พูดผลดีด้านการศึกษาได้ตรง' },
      { level: 'B2', phrase: 'the education system should focus more on', tip: 'เหมาะกับ opinion question' },
      { level: 'B2', phrase: 'practical life skills', tip: 'ตรงกับหัวข้อ future learning มาก' },
      { level: 'B2', phrase: 'equal access to education', tip: 'ใช้กับประเด็น education equality ได้ดี' },
      { level: 'C1', phrase: 'it would better prepare students for real life', tip: 'ดีสำหรับ solution / improvement' },
      { level: 'C1', phrase: 'narrow the educational gap', tip: 'เหมาะกับคำถามเรื่อง inequality หรือ policy' }
    ]
  },
  {
    matcher: (question) => /environment|recycling|pollution|weather|water|climate/i.test(question),
    items: [
      { level: 'B1', phrase: 'this has a direct effect on the environment', tip: 'ใช้ขยายผลกระทบให้ชัด' },
      { level: 'B2', phrase: 'people need to be more aware of', tip: 'เหมาะกับคำถาม about responsibility' },
      { level: 'B2', phrase: 'environmentally friendly habits', tip: 'ใช้กับ solution question ได้ดี' },
      { level: 'B2', phrase: 'reduce carbon emissions', tip: 'เป็น collocation สำคัญของ environment topics' },
      { level: 'C1', phrase: 'it could have serious long-term consequences', tip: 'ช่วยให้คำตอบดู analytical ขึ้น' },
      { level: 'C1', phrase: 'put pressure on natural resources', tip: 'เหมาะกับ pollution / climate / tourism questions' }
    ]
  },
  {
    matcher: (question) => /city|urban|infrastructure|housing|transport|public transportation/i.test(question),
    items: [
      { level: 'B1', phrase: 'cost of living', tip: 'ใช้กับคำถามเรื่อง city life ได้บ่อยมาก' },
      { level: 'B1', phrase: 'public services', tip: 'เหมาะกับหัวข้อการวางผังเมืองและคุณภาพชีวิต' },
      { level: 'B2', phrase: 'traffic congestion', tip: 'ตรงกับปัญหาเมืองใหญ่โดยตรง' },
      { level: 'B2', phrase: 'urban planning', tip: 'ใช้ตอบเรื่อง infrastructure ได้ดี' },
      { level: 'B2', phrase: 'affordable housing', tip: 'เหมาะกับหัวข้อ housing and cities' },
      { level: 'C1', phrase: 'well-developed infrastructure', tip: 'ช่วยยกระดับคำตอบให้ดูแม่นขึ้น' },
      { level: 'C1', phrase: 'a high standard of living', tip: 'ใช้ประเมิน quality of life ในเมือง' }
    ]
  },
  {
    matcher: (question) => /fashion|clothing|wear|luxury/i.test(question),
    items: [
      { level: 'B1', phrase: 'follow fashion trends', tip: 'เป็น collocation สำคัญของหัวข้อ fashion' },
      { level: 'B1', phrase: 'wear traditional clothing', tip: 'ใช้กับคำถามเรื่อง culture and clothing' },
      { level: 'B2', phrase: 'make a fashion statement', tip: 'ช่วยให้คำตอบเรื่อง identity ดูดีขึ้น' },
      { level: 'B2', phrase: 'designer brands', tip: 'เหมาะกับคำถามเรื่อง luxury fashion' },
      { level: 'B2', phrase: 'fast fashion industry', tip: 'ใช้กับคำถามด้าน environment หรือ consumerism' },
      { level: 'C1', phrase: 'reflect social status', tip: 'ดีสำหรับหัวข้อ clothing and identity' },
      { level: 'C1', phrase: 'consumer-driven culture', tip: 'เหมาะกับการพูดเชิงวิเคราะห์เรื่อง fashion' }
    ]
  },
  {
    matcher: (question) => /friendship|relationship|family|parent|child|grandparent/i.test(question),
    items: [
      { level: 'B1', phrase: 'family support', tip: 'ใช้ขยายบทบาทของครอบครัวได้ง่าย' },
      { level: 'B1', phrase: 'spend quality time together', tip: 'เหมาะกับคำถามเรื่อง bonds and relationships' },
      { level: 'B2', phrase: 'maintain strong relationships', tip: 'ใช้กับ friendship/family topics ได้ดี' },
      { level: 'B2', phrase: 'face parenting challenges', tip: 'ตรงกับหัวข้อ children and parenting' },
      { level: 'B2', phrase: 'build mutual trust', tip: 'เหมาะกับ friendship and trust' },
      { level: 'C1', phrase: 'provide emotional stability', tip: 'ช่วยให้คำตอบลึกขึ้น' },
      { level: 'C1', phrase: 'intergenerational conflict', tip: 'ดีสำหรับ family dynamics and generations' }
    ]
  }
]

const PART2_GENERIC_RECOMMENDATIONS: RecommendationItem[] = [
  {
    level: 'B1',
    phrase: 'what stands out most is',
    tip: 'ใช้เปิดประเด็นหลักของเรื่องให้ชัดขึ้นทันที'
  },
  {
    level: 'B1',
    phrase: 'one reason I remember it so clearly is',
    tip: 'ช่วยขยายความให้คำตอบไม่สั้นเกินไป'
  },
  {
    level: 'B2',
    phrase: 'it left a lasting impression on me',
    tip: 'เหมาะกับเรื่องที่มีผลต่อความรู้สึกหรือความทรงจำ'
  },
  {
    level: 'B2',
    phrase: 'what made it memorable was',
    tip: 'ใช้ก่อนยกเหตุผลหรือรายละเอียดสำคัญ'
  },
  {
    level: 'C1',
    phrase: 'looking back, I can say that',
    tip: 'ใช้สรุปมุมมองส่วนตัวให้ฟังเป็นธรรมชาติและโตขึ้น'
  },
  {
    level: 'C1',
    phrase: 'if I had to sum it up, I would say',
    tip: 'เหมาะกับประโยคปิดท้ายช่วงท้ายของ long turn'
  }
]

const PART2_RECOMMENDATION_BANKS: Array<{
  matcher: (context: string) => boolean
  items: RecommendationItem[]
}> = [
  {
    matcher: (context) => /person|people|teacher|friend|leader|manager|relative|someone|successful/i.test(context),
    items: [
      { level: 'B1', phrase: 'I have known this person for quite a while', tip: 'ใช้ตอบส่วน who / how you know them' },
      { level: 'B1', phrase: 'what I like most about them is', tip: 'ช่วยพาเข้าช่วงเหตุผลได้ตรงคำถาม' },
      { level: 'B1', phrase: 'set a good example for others', tip: 'เหมาะกับ successful person / role model' },
      { level: 'B2', phrase: 'they have a very positive influence on me', tip: 'ดีสำหรับหัวข้อ admiration / influence' },
      { level: 'B2', phrase: 'I really look up to this person', tip: 'เป็น natural phrase สำหรับ describe a person you admire' },
      { level: 'B2', phrase: 'have a strong work ethic', tip: 'ใช้กับหัวข้อ leader / successful person ได้ดี' },
      { level: 'C1', phrase: 'their attitude has shaped the way I think', tip: 'ทำให้คำตอบลึกขึ้นและเป็น reflective มากขึ้น' },
      { level: 'C1', phrase: 'one quality that makes them admirable is', tip: 'ใช้ยกระดับช่วง explain why nicely' }
    ]
  },
  {
    matcher: (context) => /place|city|home|park|building|restaurant|shop|museum|beach|village|location/i.test(context),
    items: [
      { level: 'B1', phrase: 'it is located in', tip: 'ใช้บอก location ได้ชัดและเป็นธรรมชาติ' },
      { level: 'B1', phrase: 'I often go there because', tip: 'เหมาะกับคำถาม why you go / why you like it' },
      { level: 'B1', phrase: 'there is a lovely atmosphere', tip: 'ใช้บรรยายสถานที่ให้น่าฟังขึ้น' },
      { level: 'B2', phrase: 'it has a very peaceful atmosphere', tip: 'ช่วยขยายบรรยากาศของสถานที่' },
      { level: 'B2', phrase: 'it holds a lot of good memories for me', tip: 'ใช้เพิ่มความ personal ให้คำตอบ' },
      { level: 'B2', phrase: 'it is one of my favourite spots', tip: 'ใช้กับ place question ได้ธรรมชาติ' },
      { level: 'C1', phrase: 'what makes it particularly appealing is', tip: 'ฟังเป็น academic but still natural' },
      { level: 'C1', phrase: 'it has undergone significant change over time', tip: 'เหมาะถ้าต้องพูดเปรียบเทียบอดีตกับปัจจุบัน' }
    ]
  },
  {
    matcher: (context) => /trip|travel|holiday|journey|visit|event|experience|festival|celebration|wedding|party|day/i.test(context),
    items: [
      { level: 'B1', phrase: 'it took place when', tip: 'ใช้เริ่มเล่า timeline ของเรื่อง' },
      { level: 'B1', phrase: 'the best part was', tip: 'ช่วยเติม detail ได้ง่าย' },
      { level: 'B1', phrase: 'I was really excited about it', tip: 'ช่วยเพิ่ม feeling ตรง ๆ ได้ดี' },
      { level: 'B2', phrase: 'it turned out to be much better than I expected', tip: 'ดีสำหรับเล่าเหตุการณ์ที่มี surprise' },
      { level: 'B2', phrase: 'it was one of the most memorable experiences I have had', tip: 'เชื่อมกับ feeling และ importance ได้ดี' },
      { level: 'B2', phrase: 'everything went according to plan', tip: 'เหมาะกับเหตุการณ์หรือทริปที่ราบรื่น' },
      { level: 'C1', phrase: 'what made the occasion so special was', tip: 'เหมาะกับ speaking part 2 มาก' },
      { level: 'C1', phrase: 'it left me with a strong sense of appreciation', tip: 'ใช้ช่วงท้ายให้คำตอบดู mature ขึ้น' }
    ]
  },
  {
    matcher: (context) => /object|thing|gift|phone|device|computer|tool|item|book|movie|film|song|app|website/i.test(context),
    items: [
      { level: 'B1', phrase: 'I use it on a regular basis', tip: 'ใช้เล่าความถี่ได้เป็นธรรมชาติ' },
      { level: 'B1', phrase: 'it comes in handy when', tip: 'ดีสำหรับอธิบายประโยชน์แบบ everyday' },
      { level: 'B1', phrase: 'it is easy to carry around', tip: 'เหมาะกับ object/device questions' },
      { level: 'B2', phrase: 'it is worth every penny', tip: 'ใช้กับของที่มี value หรือ quality ดี' },
      { level: 'B2', phrase: 'what makes it so useful is', tip: 'ช่วยอธิบาย feature หรือ benefit ได้ดี' },
      { level: 'B2', phrase: 'it has a practical purpose', tip: 'ใช้ขยายความเรื่อง usefulness ได้ดี' },
      { level: 'C1', phrase: 'it has become indispensable in my daily life', tip: 'ยกระดับคำว่า very useful ให้ดู strong ขึ้น' },
      { level: 'C1', phrase: 'it serves both a practical and personal purpose', tip: 'เหมาะกับของที่มี value มากกว่าหนึ่งด้าน' }
    ]
  },
  {
    matcher: (context) => /skill|habit|hobby|sport|exercise|activity|study|learn|course|subject/i.test(context),
    items: [
      { level: 'B1', phrase: 'I first got into it when', tip: 'เหมาะกับการเล่าจุดเริ่มต้นของกิจกรรม' },
      { level: 'B1', phrase: 'I spend quite a bit of time on it', tip: 'ใช้บอก commitment ได้ดี' },
      { level: 'B1', phrase: 'it helps me stay active', tip: 'ใช้กับ hobby or sport ได้ง่าย' },
      { level: 'B2', phrase: 'it keeps me motivated and engaged', tip: 'อธิบายผลทางอารมณ์ได้ลื่นขึ้น' },
      { level: 'B2', phrase: 'it has had a positive impact on my life', tip: 'เหมาะกับ explain why it matters' },
      { level: 'B2', phrase: 'it pushes me out of my comfort zone', tip: 'เหมาะกับ skill/sport/activity questions' },
      { level: 'C1', phrase: 'it has gradually become part of my routine', tip: 'ฟังเป็นธรรมชาติและโตขึ้นกว่าคำว่าง่าย ๆ' },
      { level: 'C1', phrase: 'it gives me a real sense of accomplishment', tip: 'ดีสำหรับช่วงท้ายที่พูดถึง value ของกิจกรรม' }
    ]
  },
  {
    matcher: (context) => /fashion|clothes|wear|outfit|uniform|dress/i.test(context),
    items: [
      { level: 'B1', phrase: 'dress up for special occasions', tip: 'เหมาะกับ cue card เรื่อง clothes/fashion' },
      { level: 'B1', phrase: 'feel comfortable wearing', tip: 'ใช้บอกสไตล์ที่ชอบได้ตรงมาก' },
      { level: 'B2', phrase: 'have a good sense of style', tip: 'ช่วยให้คำตอบเรื่อง fashion ดูมี range ขึ้น' },
      { level: 'B2', phrase: 'follow current fashion trends', tip: 'ใช้กับหัวข้อเสื้อผ้าได้เป็นธรรมชาติ' },
      { level: 'C1', phrase: 'express my personality through clothes', tip: 'ยกระดับคำตอบให้ personal และ sophisticated ขึ้น' },
      { level: 'C1', phrase: 'make a strong first impression', tip: 'ดีสำหรับอธิบายว่าทำไม clothing matters' }
    ]
  },
  {
    matcher: (context) => /food|meal|dish|drink|restaurant|cooking/i.test(context),
    items: [
      { level: 'B1', phrase: 'home-cooked meal', tip: 'เป็น collocation ใช้ได้บ่อยมากใน Part 2' },
      { level: 'B1', phrase: 'my go-to dish', tip: 'เหมาะกับ cue card เรื่องอาหาร' },
      { level: 'B2', phrase: 'packed with flavour', tip: 'ใช้บรรยายรสชาติให้ vivid ขึ้น' },
      { level: 'B2', phrase: 'bring people together', tip: 'ดีสำหรับอธิบายความสำคัญของ food' },
      { level: 'C1', phrase: 'hold sentimental value', tip: 'เหมาะกับอาหารหรือมื้อที่มีความหมายส่วนตัว' },
      { level: 'C1', phrase: 'leave a lasting impression', tip: 'ใช้สรุปประสบการณ์อาหาร/ร้านอาหารได้ดี' }
    ]
  },
  {
    matcher: (context) => /technology|app|computer|phone|internet|website|digital/i.test(context),
    items: [
      { level: 'B1', phrase: 'use it almost every day', tip: 'ใช้เล่าความถี่ของ device/app ได้ดี' },
      { level: 'B1', phrase: 'make life easier', tip: 'อธิบาย benefit แบบตรงไปตรงมา' },
      { level: 'B2', phrase: 'save time and effort', tip: 'เป็น collocation สำคัญของ technology topic' },
      { level: 'B2', phrase: 'fit into my daily routine', tip: 'ช่วยให้คำตอบลื่นขึ้น' },
      { level: 'C1', phrase: 'streamline everyday tasks', tip: 'ยกระดับจากคำง่าย ๆ ได้ดี' },
      { level: 'C1', phrase: 'become an essential part of my life', tip: 'เหมาะกับ object/app cue card' }
    ]
  }
]

const markRecommendationSource = (
  items: RecommendationItem[],
  source: RecommendationItem['source']
) => items.map((item) => ({ ...item, source }))

const RECOMMENDATION_SOURCE_META: Record<
  NonNullable<RecommendationItem['source']>,
  { label: string; detail: string }
> = {
  topic: {
    label: 'Topic-specific vocabulary',
    detail: 'คำ/วลีเฉพาะหัวข้อ'
  },
  intent: {
    label: 'Question-specific support',
    detail: 'คำ/วลีตามหน้าที่ของคำถาม'
  },
  general: {
    label: 'General support',
    detail: 'วลีช่วยให้ตอบลื่นและดูเป็นธรรมชาติ'
  }
}

const RECOMMENDATION_SOURCE_ORDER: Array<NonNullable<RecommendationItem['source']>> = ['topic', 'intent', 'general']

const dedupeRecommendations = (items: RecommendationItem[]) => {
  const seen = new Set<string>()
  return items.filter((item) => {
    const key = `${item.level}:${item.phrase.toLowerCase()}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

const pickBestMatchingBankItems = <T extends { matcher: (text: string) => boolean; items: RecommendationItem[] }>(
  banks: T[],
  text: string
) => {
  const matchedBanks = banks.filter((bank) => bank.matcher(text))
  if (!matchedBanks.length) return []
  return matchedBanks[0]?.items || []
}

const buildRecommendationContext = (primary: string, extraContext: string[] = []) =>
  [primary, ...extraContext]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

const buildPart1RecommendationExtras = (topic: SpeakingTopic | null, question: string) => {
  if (!topic) return [question]
  const relatedCues = [topic.prompt, ...(topic.cues || [])]
    .filter((item) => item && item !== question)
    .slice(0, 2)
  return [topic.title, topic.category, ...relatedCues]
}

const buildPart3RecommendationExtras = (topic: SpeakingTopic | null, question: string) => {
  if (!topic) return [question]
  const relatedCues = [topic.prompt, ...(topic.cues || [])]
    .filter((item) => item && item !== question)
    .slice(0, 2)
  return [topic.title, topic.category, ...relatedCues]
}

const buildFullExamPart1RecommendationExtras = (topic: SpeakingTopic | null, questions: string[], question: string) => {
  const siblingQuestions = questions.filter((item) => item && item !== question).slice(0, 2)
  return [topic?.title || '', 'Part 1', ...siblingQuestions]
}

const buildFullExamPart3RecommendationExtras = (topic: SpeakingTopic | null, questions: string[], question: string) => {
  const siblingQuestions = questions.filter((item) => item && item !== question).slice(0, 2)
  return [topic?.title || '', 'Part 3', ...siblingQuestions]
}

const getPart2Recommendations = (prompt: string, cues: string[] = []) => {
  const context = [prompt, ...cues].join(' ').toLowerCase()
  const matched = pickBestMatchingBankItems(PART2_RECOMMENDATION_BANKS, context)
  return dedupeRecommendations([
    ...markRecommendationSource(matched, 'topic'),
    ...markRecommendationSource(PART2_GENERIC_RECOMMENDATIONS, 'general')
  ]).slice(0, 14)
}

const getPart1Recommendations = (question: string, extraContext: string[] = []) => {
  const normalized = buildRecommendationContext(String(question || ''), extraContext)
  const matchedIntent = PART1_INTENT_BANKS.filter((bank) => bank.matcher(normalized)).flatMap((bank) => bank.items)
  const matchedTopic = pickBestMatchingBankItems(PART1_TOPIC_BANKS, normalized)
  return dedupeRecommendations([
    ...markRecommendationSource(matchedTopic, 'topic'),
    ...markRecommendationSource(matchedIntent, 'intent'),
    ...markRecommendationSource(PART1_GENERIC_RECOMMENDATIONS, 'general')
  ]).slice(0, 14)
}

const getPart3Recommendations = (question: string, extraContext: string[] = []) => {
  const normalized = buildRecommendationContext(String(question || ''), extraContext)
  const matchedIntent = PART3_INTENT_BANKS.filter((bank) => bank.matcher(normalized)).flatMap((bank) => bank.items)
  const matchedTopic = pickBestMatchingBankItems(PART3_TOPIC_BANKS, normalized)
  return dedupeRecommendations([
    ...markRecommendationSource(matchedTopic, 'topic'),
    ...markRecommendationSource(matchedIntent, 'intent'),
    ...markRecommendationSource(PART3_GENERIC_RECOMMENDATIONS, 'general')
  ]).slice(0, 14)
}

const renderRecommendationCard = ({
  title,
  question,
  items,
  compact = false
}: {
  title: string
  question: string
  items: RecommendationItem[]
  compact?: boolean
}) => {
  if (!items.length) return null

  const groupedItems = RECOMMENDATION_SOURCE_ORDER.map((source) => ({
    source,
    meta: RECOMMENDATION_SOURCE_META[source],
    items: items.filter((item) => (item.source || 'general') === source)
  })).filter((group) => group.items.length > 0)

  return (
    <section className={`epRecoCard ${compact ? 'epRecoCard-compact' : ''}`}>
      <div className="epRecoHeader">
        <div>
          <p className="epRecoEyebrow">English Plan&apos;s Recommendations</p>
          <h4>{title}</h4>
        </div>
        <span className="epRecoCount">{items.length} ideas</span>
      </div>
      <p className="epRecoQuestion">{question}</p>
      <div className="epRecoSections">
        {groupedItems.map((group) => (
          <section key={group.source} className="epRecoSection">
            <div className="epRecoSectionHeader">
              <div>
                <p className="epRecoSectionTitle">{group.meta.label}</p>
                <p className="epRecoSectionDetail">{group.meta.detail}</p>
              </div>
              <span className="epRecoSectionCount">{group.items.length}</span>
            </div>
            <div className="epRecoGrid">
              {group.items.map((item, index) => (
                <article key={`${group.source}-${item.level}-${item.phrase}-${index}`} className={`epRecoItem epRecoItem-${item.level}`}>
                  <div className="epRecoMetaRow">
                    <span className="epRecoLevel">{item.level}</span>
                    <span className="epRecoBand">{RECOMMENDATION_LEVEL_META[item.level]}</span>
                  </div>
                  <p className="epRecoPhrase">{item.phrase}</p>
                  <p className="epRecoTip">{item.tip}</p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  )
}

const renderRecommendationDropdown = ({
  title,
  question,
  items,
  compact = false,
  defaultOpen = false
}: {
  title: string
  question: string
  items: RecommendationItem[]
  compact?: boolean
  defaultOpen?: boolean
}) => {
  if (!items.length) return null

  return (
    <details className="epRecoDropdown" open={defaultOpen}>
      <summary className="epRecoDropdownSummary">
        <div>
          <p className="epRecoDropdownEyebrow">English Plan&apos;s Recommendations</p>
          <p className="epRecoDropdownTitle">{title}</p>
        </div>
        <span className="epRecoDropdownMeta">{items.length} ideas</span>
      </summary>
      <div className="epRecoDropdownBody">
        {renderRecommendationCard({ title, question, items, compact })}
      </div>
    </details>
  )
}

const renderReportTicks = (
  keyPrefix: string,
  title: string,
  ticks: ComponentReport['requiredTicks']
) => {
  if (!ticks?.length) return null
  return (
    <div className="tickBlockV2">
      <div className="tickBlockV2Header">
        <h5>{title}</h5>
      </div>
      <ul className="tickList">
        {ticks.map((tick, idx) => (
          <li key={`${keyPrefix}-tick-${idx}`}>
            <span className={tick.isMet ? 'tickOk' : 'tickMiss'}>
              {tick.isMet ? '✓' : 'ยังไม่ผ่าน'}
            </span>{' '}
            <span className="tickRequirement">{tick.requirement}</span>
            {tick.evidence.length > 0 && (
              <div className="evidenceList">
                {tick.evidence.slice(0, 10).map((ev, evIdx) => (
                  <p key={`${keyPrefix}-ev-${evIdx}`} className="evidencePill">
                    {ev}
                  </p>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

const renderUnlockChecklist = (
  keyPrefix: string,
  targetBand: number,
  plans: NonNullable<ComponentReport['plusOneChecklist']>
) => {
  if (!plans.length) return null
  return (
    <div className="unlockChecklistV2">
      <div className="unlockChecklistHeader">
        <div className="unlockChecklistIcon">🔓</div>
        <div>
          <h5>วิธีปลดล็อคคะแนน BAND {targetBand.toFixed(1)}</h5>
          <p>คุณต้องเพิ่มความซับซ้อนตาม checklist ของ band ถัดไปดังนี้:</p>
        </div>
      </div>
      <ol className="unlockChecklistList">
        {plans.map((plan, idx) => {
          const requirement = plan.requirement || plan.quote
          const suggestionText = plan.fix || plan.improvedText || ''
          return (
            <li key={`${keyPrefix}-unlock-${idx}`} className="unlockChecklistItem">
              <div className="unlockChecklistRequirementRow">
                <span className="unlockChecklistBox" aria-hidden="true" />
                <div className="unlockChecklistRequirementBody">
                  <p className="unlockChecklistRequirement">{requirement}</p>
                  {plan.statusThai && <p className="unlockChecklistStatus">สถานะ: {plan.statusThai}</p>}
                </div>
              </div>
              {(plan.originalText || suggestionText) && (
                <div className="unlockChecklistSuggestion">
                  <p className="unlockChecklistSuggestionLabel">ข้อเสนอแนะ:</p>
                  {plan.originalText && (
                    <p className="unlockChecklistOriginal">
                      ลองเปลี่ยนประโยคที่คุณพูดว่า <span>{plan.originalText}</span>
                    </p>
                  )}
                  {suggestionText && (
                    <p className="unlockChecklistImproved">
                      ให้เป็น <strong>{suggestionText}</strong>
                    </p>
                  )}
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

const renderNextBandCriteria = (
  keyPrefix: string,
  targetBand: number,
  plans: NonNullable<ComponentReport['plusOneChecklist']>
) => {
  const requirements = Array.from(
    new Set(
      (Array.isArray(plans) ? plans : [])
        .map((plan) => String(plan?.requirement || plan?.quote || '').trim())
        .filter(Boolean)
    )
  ).slice(0, 10)

  if (!requirements.length) return null

  return (
    <div className="nextBandCriteriaBlock">
      <div className="nextBandCriteriaHeader">
        <div>
          <p className="nextBandCriteriaEyebrow">+1 Band Criteria</p>
          <h5>เกณฑ์ที่ต้องมีเพื่อไป Band {targetBand.toFixed(1)}</h5>
        </div>
        <span className="nextBandCriteriaCount">{requirements.length} ข้อ</span>
      </div>
      <ul className="nextBandCriteriaList">
        {requirements.map((requirement, idx) => (
          <li key={`${keyPrefix}-next-band-${idx}`} className="nextBandCriteriaItem">
            <span className="nextBandCriteriaBox" aria-hidden="true" />
            <p>{requirement}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

const NOTEBOOK_ENTRIES_KEY = 'ielts-notebook-entries'
const NOTEBOOK_CUSTOM_SECTIONS_KEY = 'ielts-notebook-custom-sections'
const TEST_LATEST_SCORE_KEY = 'ielts-test-latest-scores'
const AUTH_SESSION_KEY = 'english-plan-auth-session'
const DEFAULT_FEEDBACK_CREDITS = 50
const DEFAULT_FULL_MOCK_CREDITS = 15

type CreditProfile = {
  name: string
  plan: 'VIP'
  status: LearnerStatus
  startsAt: string | null
  expiresAt: string | null
  feedbackRemaining: number
  fullMockRemaining: number
}

const normalizeEmail = (value: string) => String(value || '').trim().toLowerCase()

const makeScopedStorageKey = (baseKey: string, email: string) => `${baseKey}:${normalizeEmail(email)}`

const defaultCreditProfile = (name = 'Student'): CreditProfile => ({
  name,
  plan: 'VIP',
  status: 'inactive',
  startsAt: null,
  expiresAt: null,
  feedbackRemaining: DEFAULT_FEEDBACK_CREDITS,
  fullMockRemaining: DEFAULT_FULL_MOCK_CREDITS
})

type AuthApiResponse = {
  session: AuthSession
  creditProfile: CreditProfile
}

type NotebookApiResponse = {
  entries: NotebookEntry[]
  customSections: string[]
  updatedAt: string | null
}

type ReadingExamsApiResponse = {
  exams: ReadingExamRecord[]
}

type SupportReportsApiResponse = {
  reports: SupportReportRecord[]
}

type ReadingBulkValidationItem = {
  index: number
  title: string
  category: ReadingBankCategory
  ok: boolean
  passageCount: number
  questionCount: number
  error?: string
}

type ReadingBulkValidationResult = {
  total: number
  valid: number
  invalid: number
  items: ReadingBulkValidationItem[]
}

const READING_CATEGORY_LABELS: Record<ReadingBankCategory, string> = {
  passage1: 'Passage 1',
  passage2: 'Passage 2',
  passage3: 'Passage 3',
  fulltest: 'Full Test'
}

const SUPPORT_REPORT_CATEGORY_LABELS: Record<SupportReportCategory, string> = {
  bug: 'Bug / ระบบผิดปกติ',
  account: 'Account / บัญชีผู้ใช้',
  content: 'Content / เนื้อหา',
  billing: 'Billing / เครดิตหรือแพ็กเกจ',
  other: 'Other / อื่น ๆ'
}

const SUPPORT_REPORT_STATUS_LABELS: Record<SupportReportStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed'
}

const READING_JSON_TEMPLATE_ITEMS: Record<ReadingBankCategory, ReadingBulkUploadInput[]> = {
  passage1: [
    {
      title: 'Reading Passage 1 Template',
      category: 'passage1',
      rawPassageText: `READING PASSAGE 1
PASTE PASSAGE 1 TITLE HERE

PASTE THE FULL PASSAGE 1 TEXT HERE

Questions 1-13
PASTE THE ORIGINAL QUESTION BLOCK FOR PASSAGE 1 HERE`,
      rawAnswerKey: `READING PASSAGE 1: PASTE PASSAGE 1 TITLE HERE
Question 1: PASTE QUESTION 1 PROMPT HERE

Correct Answer: TRUE / FALSE / NOT GIVEN / actual answer

Exact Portion: "Paste the exact evidence from the passage here."

Short Thai Explanation: อธิบายสั้น ๆ เป็นภาษาไทยที่ user เข้าใจได้

Paraphrased Vocabulary: สรุป keyword/paraphrase ที่สำคัญ

Question 2: ...

Correct Answer: ...

Exact Portion: "..."

Short Thai Explanation: ...

Paraphrased Vocabulary: ...`
    }
  ],
  passage2: [
    {
      title: 'Reading Passage 2 Template',
      category: 'passage2',
      rawPassageText: `READING PASSAGE 2
PASTE PASSAGE 2 TITLE HERE

PASTE THE FULL PASSAGE 2 TEXT HERE

Questions 14-26
PASTE THE ORIGINAL QUESTION BLOCK FOR PASSAGE 2 HERE`,
      rawAnswerKey: `READING PASSAGE 2: PASTE PASSAGE 2 TITLE HERE
Question 14: PASTE QUESTION 14 PROMPT HERE

Correct Answer: A / B / C / D / actual answer

Exact Portion: "Paste the exact evidence from the passage here."

Short Thai Explanation: อธิบายสั้น ๆ เป็นภาษาไทยที่ user เข้าใจได้

Paraphrased Vocabulary: สรุป keyword/paraphrase ที่สำคัญ

Question 15: ...

Correct Answer: ...

Exact Portion: "..."

Short Thai Explanation: ...

Paraphrased Vocabulary: ...`
    }
  ],
  passage3: [
    {
      title: 'Reading Passage 3 Template',
      category: 'passage3',
      rawPassageText: `READING PASSAGE 3
PASTE PASSAGE 3 TITLE HERE

PASTE THE FULL PASSAGE 3 TEXT HERE

Questions 27-40
PASTE THE ORIGINAL QUESTION BLOCK FOR PASSAGE 3 HERE`,
      rawAnswerKey: `READING PASSAGE 3: PASTE PASSAGE 3 TITLE HERE
Question 27: PASTE QUESTION 27 PROMPT HERE

Correct Answer: A / B / C / D / YES / NO / NOT GIVEN / actual answer

Exact Portion: "Paste the exact evidence from the passage here."

Short Thai Explanation: อธิบายสั้น ๆ เป็นภาษาไทยที่ user เข้าใจได้

Paraphrased Vocabulary: สรุป keyword/paraphrase ที่สำคัญ

Question 28: ...

Correct Answer: ...

Exact Portion: "..."

Short Thai Explanation: ...

Paraphrased Vocabulary: ...`
    }
  ],
  fulltest: [
    {
      title: 'Reading Full Test Template',
      category: 'fulltest',
      rawPassageText: `READING PASSAGE 1
PASTE PASSAGE 1 TITLE HERE

PASTE THE FULL PASSAGE 1 TEXT HERE

Questions 1-13
PASTE THE ORIGINAL QUESTION BLOCK FOR PASSAGE 1 HERE

READING PASSAGE 2
PASTE PASSAGE 2 TITLE HERE

PASTE THE FULL PASSAGE 2 TEXT HERE

Questions 14-26
PASTE THE ORIGINAL QUESTION BLOCK FOR PASSAGE 2 HERE

READING PASSAGE 3
PASTE PASSAGE 3 TITLE HERE

PASTE THE FULL PASSAGE 3 TEXT HERE

Questions 27-40
PASTE THE ORIGINAL QUESTION BLOCK FOR PASSAGE 3 HERE`,
      rawAnswerKey: `READING PASSAGE 1: PASTE PASSAGE 1 TITLE HERE
Question 1: ...

Correct Answer: ...

Exact Portion: "..."

Short Thai Explanation: ...

Paraphrased Vocabulary: ...

READING PASSAGE 2: PASTE PASSAGE 2 TITLE HERE
Question 14: ...

Correct Answer: ...

Exact Portion: "..."

Short Thai Explanation: ...

Paraphrased Vocabulary: ...

READING PASSAGE 3: PASTE PASSAGE 3 TITLE HERE
Question 27: ...

Correct Answer: ...

Exact Portion: "..."

Short Thai Explanation: ...

Paraphrased Vocabulary: ...`
    }
  ]
}

const formatAccessDate = (value: string | null) =>
  value ? new Date(value).toLocaleDateString() : 'Not set'

const inferReadingCategoryFromSource = (value: string): ReadingBankCategory => {
  const text = String(value || '')
  const passageMatches = [...text.matchAll(/READING PASSAGE\s+(\d+)/gi)].map((match) => Number(match[1]))
  if (passageMatches.length >= 3) return 'fulltest'
  if (passageMatches.includes(3)) return 'passage3'
  if (passageMatches.includes(2)) return 'passage2'
  return 'passage1'
}

const deriveReadingTitleFromPassageText = (value: string, category: ReadingBankCategory) => {
  const text = String(value || '').replace(/\r/g, '').trim()
  if (!text) return category === 'fulltest' ? 'Reading Full Test' : `Reading ${READING_CATEGORY_LABELS[category]}`
  const firstBlock = text
    .replace(/^READING PASSAGE\s+\d+\s*/i, '')
    .trim()
  const title = String(firstBlock.split('\n').find((line) => line.trim()) || '').trim()
  if (!title) return category === 'fulltest' ? 'Reading Full Test' : `Reading ${READING_CATEGORY_LABELS[category]}`
  return category === 'fulltest' ? `${title} Reading Full Test` : title
}

const splitCombinedReadingImport = (value: string) => {
  const text = String(value || '').replace(/\r/g, '').trim()
  if (!text) {
    throw new Error('Please paste the combined reading source first.')
  }
  const answerKeyMatch = text.match(/^READING PASSAGE\s+\d+:\s*/m)
  const passageMatch = text.match(/^READING PASSAGE\s+\d+\b(?!:)/m)

  if (!answerKeyMatch || answerKeyMatch.index === undefined) {
    throw new Error('Could not find the answer-key block. Keep headings like "READING PASSAGE 1:" before the Question blocks.')
  }
  if (!passageMatch || passageMatch.index === undefined) {
    throw new Error('Could not find the passage block. Keep headings like "READING PASSAGE 1" before each passage.')
  }

  const answerKeyStartsFirst = answerKeyMatch.index < passageMatch.index
  const rawAnswerKey = answerKeyStartsFirst
    ? text.slice(answerKeyMatch.index, passageMatch.index).trim()
    : text.slice(answerKeyMatch.index).trim()
  const rawPassageText = answerKeyStartsFirst
    ? text.slice(passageMatch.index).trim()
    : text.slice(passageMatch.index, answerKeyMatch.index).trim()

  const category = inferReadingCategoryFromSource(rawPassageText)

  return {
    title: deriveReadingTitleFromPassageText(rawPassageText, category),
    category,
    rawPassageText,
    rawAnswerKey
  }
}

const normalizeReadingAnswer = (value: string) =>
  String(value || '')
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\.$/, '')
    .toUpperCase()

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const countWords = (value: string) =>
  String(value || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length

const SPEAKING_LENGTH_THRESHOLDS: Record<'part1' | 'part2' | 'part3', Array<{ band: string; minWords: number }>> = {
  part1: [
    { band: 'Band 7', minWords: 50 },
    { band: 'Band 8', minWords: 60 },
    { band: 'Band 9', minWords: 70 }
  ],
  part2: [
    { band: 'Band 7', minWords: 250 },
    { band: 'Band 8', minWords: 280 },
    { band: 'Band 9', minWords: 310 }
  ],
  part3: [
    { band: 'Band 7', minWords: 50 },
    { band: 'Band 8', minWords: 60 },
    { band: 'Band 9', minWords: 70 }
  ]
}

const renderTranscriptWithAnnotations = (
  text: string,
  annotations: Array<{ label: string; issueType: string; highlightText: string; commentThai: string }> = []
) => {
  const validAnnotations = annotations.filter((item) => item.highlightText)
  if (!validAnnotations.length) return text

  const pattern = new RegExp(
    `(${validAnnotations.map((item) => escapeRegExp(item.highlightText)).join('|')})`,
    'gi'
  )

  return String(text || '')
    .split(pattern)
    .filter((part) => part.length > 0)
    .map((part, index) => {
      const annotation = validAnnotations.find(
        (item) => item.highlightText.toLowerCase() === part.toLowerCase()
      )
      if (!annotation) return <span key={`plain-${index}`}>{part}</span>
      return (
        <mark
          key={`mark-${index}`}
          className={`answerAnnotationMark answerAnnotationMark-${annotation.issueType}`}
          title={annotation.commentThai}
        >
          {part}
        </mark>
      )
    })
}

const annotationBadgeTone = (issueType: string) => {
  if (issueType === 'grammar') return 'grammar'
  if (issueType === 'vocabulary') return 'vocabulary'
  if (issueType === 'fluency') return 'fluency'
  return 'structure'
}

const parseStoredNotebookEntries = (value: string | null): NotebookEntry[] => {
  if (!value) return []
  try {
    const parsed = JSON.parse(value) as NotebookEntry[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const parseStoredCustomSections = (value: string | null): string[] => {
  if (!value) return []
  try {
    const parsed = JSON.parse(value) as string[]
    return Array.isArray(parsed) ? parsed.map((name) => String(name).trim()).filter(Boolean) : []
  } catch {
    return []
  }
}

const parseStoredScores = (value: string | null): Record<string, number> => {
  if (!value) return {}
  try {
    const parsed = JSON.parse(value) as Record<string, number>
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

const buildFullExamPlanFromPromptAndCues = (prompt: string, cues: string[]) => {
  const stripPartPrefix = (value: string) =>
    String(value || '')
      .replace(/^Part\s*[13]\s*-\s*/i, '')
      .replace(/\s+/g, ' ')
      .trim()

  const normalizedCues = Array.isArray(cues) ? cues : []
  const part1Questions = normalizedCues
    .filter((item) => String(item).startsWith('Part 1 -'))
    .map(stripPartPrefix)
    .filter(Boolean)
  const part3Questions = normalizedCues
    .filter((item) => String(item).startsWith('Part 3 -'))
    .map(stripPartPrefix)
    .filter(Boolean)

  return {
    part1Questions: part1Questions.length ? part1Questions : normalizedCues.slice(0, 3),
    part2Prompt: String(prompt || '').trim(),
    part3Questions: part3Questions.length ? part3Questions : normalizedCues.slice(-4)
  }
}

const buildAdminFullMockSampleText = (topic: SpeakingTopic) => {
  const stripPrefix = (value: string) => String(value || '').replace(/^Part\s*[13]\s*-\s*/i, '').trim()
  const part1Questions = topic.cues.filter((item) => item.startsWith('Part 1 -')).map(stripPrefix)
  const part3Questions = topic.cues.filter((item) => item.startsWith('Part 3 -')).map(stripPrefix)

  const part1Answers = part1Questions.map((question, index) =>
    [
      `Q${index + 1}: ${question}`,
      `I’d say this is quite true for me personally because it reflects my daily routine and the way I usually make decisions.`,
      `To give a simple example, I often think about this in a practical way rather than an emotional one, so my answer would definitely be yes in most situations.`
    ].join('\n')
  )

  const part2Answer = [
    `Part 2: ${topic.prompt}`,
    `I’d like to talk about this topic because it genuinely stands out in my mind and it had a strong influence on me.`,
    `First of all, the background to this story is quite memorable because it happened at a time when I was trying to become more mature and independent.`,
    `What made it especially meaningful was not just the event itself, but the lesson I took from it afterwards.`,
    `As a result, I became more thoughtful, more confident, and more aware of how small experiences can completely change the way we see ourselves.`
  ].join('\n')

  const part3Answers = part3Questions.map((question, index) =>
    [
      `Q${index + 1}: ${question}`,
      `That’s an interesting question, and I think the answer depends on social background, personal values, and economic pressure.`,
      `In my view, the main reason is that people are now exposed to more choices, so they tend to delay decisions until they feel stable enough.`,
      `For instance, in large cities many young adults focus on education and career growth first, which naturally affects the timing of other life decisions.`
    ].join('\n')
  )

  return [...part1Answers, part2Answer, ...part3Answers].join('\n\n')
}

function App() {
  const [activePage, setActivePage] = useState<AppPage>('home')
  const [managedLearners, setManagedLearners] = useState<ManagedLearnerRecord[]>([])
  const [authSession, setAuthSession] = useState<AuthSession | null>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [userEmailInput, setUserEmailInput] = useState('')
  const [userPasswordInput, setUserPasswordInput] = useState('')
  const [signupNameInput, setSignupNameInput] = useState('')
  const [signupEmailInput, setSignupEmailInput] = useState('')
  const [signupPasswordInput, setSignupPasswordInput] = useState('')
  const [adminCodeInput, setAdminCodeInput] = useState('')
  const [authError, setAuthError] = useState('')
  const [authNotice, setAuthNotice] = useState('')
  const [supportModalOpen, setSupportModalOpen] = useState(false)
  const [supportCategoryInput, setSupportCategoryInput] = useState<SupportReportCategory>('bug')
  const [supportMessageInput, setSupportMessageInput] = useState('')
  const [supportFormError, setSupportFormError] = useState('')
  const [supportFormNotice, setSupportFormNotice] = useState('')
  const [isSubmittingSupportReport, setIsSubmittingSupportReport] = useState(false)
  const [mySupportReports, setMySupportReports] = useState<SupportReportRecord[]>([])
  const [adminSupportReports, setAdminSupportReports] = useState<SupportReportRecord[]>([])
  const [notebookSaveNotice, setNotebookSaveNotice] = useState('')
  const [adminLearnerNameInput, setAdminLearnerNameInput] = useState('')
  const [adminLearnerEmailInput, setAdminLearnerEmailInput] = useState('')
  const [adminLearnerPasswordInput, setAdminLearnerPasswordInput] = useState('')
  const [adminLearnerStatusInput, setAdminLearnerStatusInput] = useState<LearnerStatus>('active')
  const [adminLearnerExpiresAtInput, setAdminLearnerExpiresAtInput] = useState('')
  const [adminLearnerFeedbackCreditsInput, setAdminLearnerFeedbackCreditsInput] = useState(DEFAULT_FEEDBACK_CREDITS)
  const [adminLearnerFullMockCreditsInput, setAdminLearnerFullMockCreditsInput] = useState(DEFAULT_FULL_MOCK_CREDITS)
  const [adminLearnerRoleInput, setAdminLearnerRoleInput] = useState<Role>('student')
  const [adminPanelMessage, setAdminPanelMessage] = useState('')
  const [adminLearnerSearchInput, setAdminLearnerSearchInput] = useState('')
  const [adminTtsSearchInput, setAdminTtsSearchInput] = useState('')
  const [readingExams, setReadingExams] = useState<ReadingExamRecord[]>([])
  const [selectedReadingCategory, setSelectedReadingCategory] = useState<ReadingBankCategory>('fulltest')
  const [selectedReadingExamId, setSelectedReadingExamId] = useState('')
  const [readingAnswers, setReadingAnswers] = useState<Record<number, string>>({})
  const [readingAttemptStage, setReadingAttemptStage] = useState<'bank' | 'exam' | 'report'>('bank')
  const [readingReportItems, setReadingReportItems] = useState<ReadingReportItem[]>([])
  const [readingActivePassageNumber, setReadingActivePassageNumber] = useState(1)
  const [readingSelectionText, setReadingSelectionText] = useState('')
  const [readingUserHighlights, setReadingUserHighlights] = useState<Array<{ id: string; passageNumber: number; text: string }>>([])
  const [readingHintQuestionNumber, setReadingHintQuestionNumber] = useState<number | null>(null)
  const [readingExamError, setReadingExamError] = useState('')
  const [adminReadingTitleInput, setAdminReadingTitleInput] = useState('')
  const [adminReadingCategoryInput, setAdminReadingCategoryInput] = useState<ReadingBankCategory>('fulltest')
  const [adminReadingSmartPasteInput, setAdminReadingSmartPasteInput] = useState('')
  const [adminReadingPassageInput, setAdminReadingPassageInput] = useState('')
  const [adminReadingAnswerKeyInput, setAdminReadingAnswerKeyInput] = useState('')
  const [adminReadingBulkJsonInput, setAdminReadingBulkJsonInput] = useState('')
  const [adminReadingTemplateCategory, setAdminReadingTemplateCategory] = useState<ReadingBankCategory>('fulltest')
  const [adminReadingBulkValidation, setAdminReadingBulkValidation] = useState<ReadingBulkValidationResult | null>(null)
  const [topics] = useState<SpeakingTopic[]>(INITIAL_TOPICS)
  const [enabledTopicIds, setEnabledTopicIds] = useState<string[]>(
    INITIAL_TOPICS.map((topic) => topic.id)
  )
  const [selectedTopicId, setSelectedTopicId] = useState<string>(INITIAL_TOPICS[0].id)
  const [selectedTestMode, setSelectedTestMode] = useState<SpeakingTestMode>('part1')
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [transcriptionError, setTranscriptionError] = useState('')
  const [isRecordingAudio, setIsRecordingAudio] = useState(false)
  const [audioError, setAudioError] = useState('')
  const [audioUrl, setAudioUrl] = useState('')
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [prepSeconds, setPrepSeconds] = useState(60)
  const [talkSeconds, setTalkSeconds] = useState(120)
  const [attemptStage, setAttemptStage] = useState<AttemptStage>('idle')
  const [remainingPrepSeconds, setRemainingPrepSeconds] = useState(60)
  const [remainingTalkSeconds, setRemainingTalkSeconds] = useState(120)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [remainingQuestionSeconds, setRemainingQuestionSeconds] = useState(75)
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null)
  const [reportViewSnapshot, setReportViewSnapshot] = useState<SavedReportSnapshot | null>(null)
  const [assessmentError, setAssessmentError] = useState('')
  const [assessmentProgress, setAssessmentProgress] = useState(0)
  const [assessmentProgressTarget, setAssessmentProgressTarget] = useState(0)
  const [assessmentRuntimeMessages, setAssessmentRuntimeMessages] = useState<string[]>([])
  const [assessmentCountdownSeconds, setAssessmentCountdownSeconds] = useState(0)
  const [isFullMockAssessmentLoading, setIsFullMockAssessmentLoading] = useState(false)
  const [loadingPhraseCursor, setLoadingPhraseCursor] = useState(0)
  const [selectedProvider, setSelectedProvider] = useState<string>('gemini')
  const [creditProfile, setCreditProfile] = useState<CreditProfile>(defaultCreditProfile())
  const [creditWarning, setCreditWarning] = useState<{ title: string; message: string } | null>(null)
  const [latestScoresByTest, setLatestScoresByTest] = useState<Record<string, number>>({})
  const [notebookEntries, setNotebookEntries] = useState<NotebookEntry[]>([])
  const [customSections, setCustomSections] = useState<string[]>([])
  const [isNotebookHydrating, setIsNotebookHydrating] = useState(false)
  const [notebookSyncError, setNotebookSyncError] = useState('')
  const [selectedNotebookSection, setSelectedNotebookSection] = useState<string>('speaking')
  const [newCustomSectionName, setNewCustomSectionName] = useState('')
  const [ttsGeneratingKey, setTtsGeneratingKey] = useState('')
  const [ttsAudioUrls, setTtsAudioUrls] = useState<Record<string, string>>({})
  const [adminPasteText, setAdminPasteText] = useState('')
  const [prepNotePart2, setPrepNotePart2] = useState('')
  const [questionPrepNotes, setQuestionPrepNotes] = useState<Record<string, string>>({})
  const [fullExamPhase, setFullExamPhase] = useState<FullExamPhase>('part1')
  const [fullExamPart1Index, setFullExamPart1Index] = useState(0)
  const [fullExamPart3Index, setFullExamPart3Index] = useState(0)
  const [fullExamPhaseSeconds, setFullExamPhaseSeconds] = useState(75)
  const [fullExamAnnouncement, setFullExamAnnouncement] = useState('')
  const [questionCountdown, setQuestionCountdown] = useState<number | null>(null)
  const [questionCountdownLabel, setQuestionCountdownLabel] = useState('')
  const [isPromptTtsPlaying, setIsPromptTtsPlaying] = useState(false)
  const [micCheckStatus, setMicCheckStatus] = useState<'idle' | 'recording' | 'playing' | 'success' | 'error'>('idle')
  const [micCheckAudioUrl, setMicCheckAudioUrl] = useState<string | null>(null)
  const [isExamPaused, setIsExamPaused] = useState(false)
  const [pauseTimeRemaining, setPauseTimeRemaining] = useState(120)
  const [prepAccordionOpen, setPrepAccordionOpen] = useState<Record<string, boolean>>({ part1: true, part2: false, part3: false })
  const [pendingStartTopicId, setPendingStartTopicId] = useState<string | null>(null)
  const [selectedExpectedScore, setSelectedExpectedScore] = useState<string>('')
  const [answerReviewModal, setAnswerReviewModal] = useState<AnswerReviewModalState | null>(null)
  const [scriptReviewModal, setScriptReviewModal] = useState<ScriptReviewModalState | null>(null)
  const isStudentViewLockedToSpeaking = authSession?.role === 'student'

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const latestAudioBlobRef = useRef<Blob | null>(null)
  const recordingStopResolverRef = useRef<((blob: Blob | null) => void) | null>(null)
  const questionStartCharIndexRef = useRef(0)
  const intervalRef = useRef<number | null>(null)
  const prepIntervalRef = useRef<number | null>(null)
  const speakingIntervalRef = useRef<number | null>(null)
  const shouldKeepTranscribingRef = useRef(false)
  const attemptStageRef = useRef<AttemptStage>('idle')
  const assessPollRef = useRef<number | null>(null)
  const assessmentStartedAtRef = useRef<number | null>(null)
  const questionResponsesRef = useRef<Array<{ question: string; response: string }>>([])
  const pendingAssessmentRef = useRef<null | {
    audioBlob: Blob | null
    durationSeconds: number
    items: ScriptReviewItem[]
    scoreKeyMode: SpeakingTestMode
  }>(null)
  const fullExamAnnouncementTimeoutRef = useRef<number | null>(null)
  const questionCountdownIntervalRef = useRef<number | null>(null)
  const micCheckRecorderRef = useRef<MediaRecorder | null>(null)
  const micCheckChunksRef = useRef<Blob[]>([])
  const pauseIntervalRef = useRef<number | null>(null)
  const ttsPrimedRef = useRef(false)
  const skipNextPromptTtsRef = useRef(false)
  const suppressTranscriptionDuringTtsRef = useRef(false)
  const transcriptionRestartTimeoutRef = useRef<number | null>(null)
  const transcriptionStartPendingRef = useRef(false)
  const promptAudioRef = useRef<HTMLAudioElement | null>(null)
  const notebookLoadedRef = useRef(false)
  const notebookSyncTimeoutRef = useRef<number | null>(null)
  const notebookSyncedSignatureRef = useRef('')
  const notebookEntriesRef = useRef<NotebookEntry[]>([])
  const customSectionsRef = useRef<string[]>([])
  const part2TimerDelayUntilRef = useRef<number | null>(null)
  const part2TimerDelayArmedRef = useRef(false)

  const setAuthStateFromPayload = (payload: AuthApiResponse) => {
    setAuthSession(payload.session)
    setCreditProfile(payload.creditProfile)
    setActivePage('home')
  }

  const getAuthHeaders = (): Record<string, string> =>
    authSession?.accessToken
      ? {
          Authorization: `Bearer ${authSession.accessToken}`
        }
      : {}

  const buildNotebookSyncSignature = (entries: NotebookEntry[], sections: string[]) =>
    JSON.stringify({ entries, customSections: sections })

  const syncNotebookSnapshotToSupabase = async ({
    entries,
    sections,
    successNotice
  }: {
    entries: NotebookEntry[]
    sections: string[]
    successNotice?: string
  }) => {
    if (!authSession?.accessToken || authSession.role !== 'student' || !authSession.email || isNotebookHydrating || !notebookLoadedRef.current) {
      return false
    }

    const signature = buildNotebookSyncSignature(entries, sections)
    try {
      await fetchJson<NotebookApiResponse>('/api/me/notebook', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${authSession.accessToken}`
        },
        body: JSON.stringify({
          entries,
          customSections: sections
        })
      })
      notebookSyncedSignatureRef.current = signature
      setNotebookSyncError('')
      if (successNotice) {
        setNotebookSaveNotice(successNotice)
      }
      return true
    } catch {
      setNotebookSyncError('Saved on this device, but Supabase account sync failed just now.')
      return false
    }
  }

  const describeFetchFailure = (url: string, error: unknown): string => {
    const rawMessage = error instanceof Error ? error.message : String(error || '')
    const normalizedUrl = String(url || '').trim()
    const runningLocally =
      typeof window !== 'undefined' &&
      ['127.0.0.1', 'localhost'].includes(window.location.hostname)

    if (/Failed to fetch|NetworkError|Load failed|fetch failed/i.test(rawMessage)) {
      if (runningLocally && normalizedUrl.startsWith('/api')) {
        return 'Could not reach the backend API. If you are testing on localhost, please make sure the Express server is running on port 8787 first.'
      }
      return 'Could not reach the server. Please check your connection and try again.'
    }

    return rawMessage || 'Request failed.'
  }

  const fetchJson = async <T,>(url: string, options: RequestInit = {}): Promise<T> => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        }
      })
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        const message = payload?.error?.message || payload?.error || `Request failed (${response.status})`
        throw new Error(String(message))
      }
      return response.json() as Promise<T>
    } catch (error) {
      throw new Error(describeFetchFailure(url, error))
    }
  }

  const loadManagedLearners = async (accessToken = authSession?.accessToken) => {
    if (!accessToken) return
    const payload = await fetchJson<{ learners: ManagedLearnerRecord[] }>('/api/admin/learners', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    setManagedLearners(payload.learners || [])
  }

  const loadReadingExams = async (accessToken = authSession?.accessToken) => {
    if (!accessToken) return
    const payload = await fetchJson<ReadingExamsApiResponse>('/api/reading/exams', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    setReadingExams(Array.isArray(payload.exams) ? payload.exams : [])
  }

  const loadMySupportReports = async (accessToken = authSession?.accessToken) => {
    if (!accessToken) return
    const payload = await fetchJson<SupportReportsApiResponse>('/api/me/support-reports', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    setMySupportReports(Array.isArray(payload.reports) ? payload.reports : [])
  }

  const loadAdminSupportReports = async (accessToken = authSession?.accessToken) => {
    if (!accessToken) return
    const payload = await fetchJson<SupportReportsApiResponse>('/api/admin/support-reports', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    setAdminSupportReports(Array.isArray(payload.reports) ? payload.reports : [])
  }

  const openSupportModal = () => {
    setSupportModalOpen(true)
    setSupportFormError('')
    setSupportFormNotice('')
    setSupportCategoryInput('bug')
  }

  const closeSupportModal = () => {
    setSupportModalOpen(false)
    setSupportFormError('')
    setSupportFormNotice('')
  }

  const submitSupportReport = async () => {
    if (!authSession?.accessToken || authSession.role !== 'student') {
      setSupportFormError('Please sign in as a student before reporting a problem.')
      return
    }
    if (!supportMessageInput.trim()) {
      setSupportFormError('Please describe the problem first.')
      return
    }

    setIsSubmittingSupportReport(true)
    setSupportFormError('')
    setSupportFormNotice('')
    try {
      const payload = await fetchJson<{ report: SupportReportRecord; message?: string }>('/api/me/support-reports', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          category: supportCategoryInput,
          pageContext: activePage,
          message: supportMessageInput
        })
      })
      const created = payload.report
      setMySupportReports((current) => [created, ...current.filter((item) => item.id !== created.id)])
      setSupportMessageInput('')
      setSupportFormNotice(payload.message || 'Added to admin issue inbox.')
    } catch (error) {
      setSupportFormError(error instanceof Error ? error.message : 'Could not send the problem report.')
    } finally {
      setIsSubmittingSupportReport(false)
    }
  }

  const handleAdminSupportReportUpdate = async (
    reportId: string,
    patch: { status?: SupportReportStatus; adminNote?: string }
  ) => {
    if (!authSession?.accessToken || authSession.role !== 'admin') return
    setAdminPanelMessage('')
    setAuthError('')
    try {
      const existing = adminSupportReports.find((item) => item.id === reportId)
      const payload = await fetchJson<{ report: SupportReportRecord }>(`/api/admin/support-reports/${reportId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          status: patch.status || existing?.status || 'open',
          adminNote: patch.adminNote ?? existing?.adminNote ?? ''
        })
      })
      setAdminSupportReports((current) =>
        current.map((item) => (item.id === reportId ? payload.report : item))
      )
      setAdminPanelMessage(`Updated issue from ${payload.report.reporterName}.`)
    } catch (error) {
      setAdminPanelMessage('')
      setAuthError(error instanceof Error ? error.message : 'Could not update the support report.')
    }
  }

  const currentReadingJsonTemplate = JSON.stringify(
    READING_JSON_TEMPLATE_ITEMS[adminReadingTemplateCategory],
    null,
    2
  )

  const copyReadingJsonTemplate = async () => {
    try {
      await navigator.clipboard.writeText(currentReadingJsonTemplate)
      setAdminPanelMessage(`Copied ${READING_CATEGORY_LABELS[adminReadingTemplateCategory]} JSON template.`)
      setAuthError('')
    } catch {
      setAdminPanelMessage('')
      setAuthError('Could not copy the JSON template automatically. Please copy it manually from the box.')
    }
  }

  const loadReadingJsonTemplateIntoUpload = () => {
    setAdminReadingBulkJsonInput(currentReadingJsonTemplate)
    setAdminReadingBulkValidation(null)
    setAdminPanelMessage(`${READING_CATEGORY_LABELS[adminReadingTemplateCategory]} template loaded into the bulk upload box.`)
    setAuthError('')
  }

  const autoFillReadingUploadFromCombinedPaste = () => {
    setAdminPanelMessage('')
    setAuthError('')
    try {
      const parsed = splitCombinedReadingImport(adminReadingSmartPasteInput)
      setAdminReadingTitleInput(parsed.title)
      setAdminReadingCategoryInput(parsed.category)
      setAdminReadingPassageInput(parsed.rawPassageText)
      setAdminReadingAnswerKeyInput(parsed.rawAnswerKey)
      setAdminPanelMessage(`Split successful. Filled title, category, passage text, and answer key for ${READING_CATEGORY_LABELS[parsed.category]}.`)
    } catch (error) {
      setAdminPanelMessage('')
      setAuthError(error instanceof Error ? error.message : 'Could not split the combined reading source.')
    }
  }

  const validateAdminReadingBulkJson = async () => {
    setAdminPanelMessage('')
    setAuthError('')
    setAdminReadingBulkValidation(null)
    if (!authSession?.accessToken || authSession.role !== 'admin') {
      setAuthError('Admin session not found. Please sign in to the Admin Panel again.')
      return
    }
    if (!adminReadingBulkJsonInput.trim()) {
      setAuthError('Please paste a JSON array before validating.')
      return
    }

    try {
      const parsed = JSON.parse(adminReadingBulkJsonInput)
      const exams = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.exams) ? parsed.exams : null
      if (!exams) {
        throw new Error('Bulk JSON must be an array, or an object with an "exams" array.')
      }

      const payload = await fetchJson<{ validation: ReadingBulkValidationResult }>('/api/admin/reading/exams/validate-bulk', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          exams: exams as ReadingBulkUploadInput[]
        })
      })

      setAdminReadingBulkValidation(payload.validation || null)
      const summary = payload.validation
      if (summary) {
        setAdminPanelMessage(
          summary.invalid === 0
            ? `Validation passed. ${summary.valid}/${summary.total} exam payloads are ready to upload.`
            : `Validation found ${summary.invalid} issue${summary.invalid === 1 ? '' : 's'}. Please fix them before upload.`
        )
      }
    } catch (error) {
      setAdminPanelMessage('')
      setAuthError(error instanceof Error ? error.message : 'Could not validate bulk reading exams.')
    }
  }

  const handleAdminCreateReadingExam = async () => {
    setAdminPanelMessage('')
    setAuthError('')
    if (!authSession?.accessToken || authSession.role !== 'admin') {
      setAuthError('Admin session not found. Please sign in to the Admin Panel again.')
      return
    }
    if (!adminReadingTitleInput.trim() || !adminReadingPassageInput.trim() || !adminReadingAnswerKeyInput.trim()) {
      setAuthError('Please fill in the exam title, reading passage text, and answer key before uploading.')
      return
    }
    try {
      const payload = await fetchJson<{ exam: ReadingExamRecord }>('/api/admin/reading/exams', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: adminReadingTitleInput,
          category: adminReadingCategoryInput,
          rawPassageText: adminReadingPassageInput,
          rawAnswerKey: adminReadingAnswerKeyInput
        })
      })
      setReadingExams((current) => [payload.exam, ...current.filter((item) => item.id !== payload.exam.id)])
      setAdminReadingTitleInput('')
      setAdminReadingCategoryInput('fulltest')
      setAdminReadingPassageInput('')
      setAdminReadingAnswerKeyInput('')
      setAdminPanelMessage(`Uploaded reading exam: ${payload.exam.title}.`)
    } catch (error) {
      setAdminPanelMessage('')
      setAuthError(error instanceof Error ? error.message : 'Could not upload reading exam.')
    }
  }

  const handleAdminBulkCreateReadingExams = async () => {
    setAdminPanelMessage('')
    setAuthError('')
    setAdminReadingBulkValidation(null)
    if (!authSession?.accessToken || authSession.role !== 'admin') {
      setAuthError('Admin session not found. Please sign in to the Admin Panel again.')
      return
    }
    if (!adminReadingBulkJsonInput.trim()) {
      setAuthError('Please paste a JSON array before using bulk upload.')
      return
    }

    try {
      const parsed = JSON.parse(adminReadingBulkJsonInput)
      const exams = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.exams) ? parsed.exams : null
      if (!exams) {
        throw new Error('Bulk JSON must be an array, or an object with an "exams" array.')
      }

      const payload = await fetchJson<{ exams: ReadingExamRecord[] }>('/api/admin/reading/exams/bulk', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          exams: exams as ReadingBulkUploadInput[]
        })
      })

      const created = Array.isArray(payload.exams) ? payload.exams : []
      setReadingExams((current) => {
        const incoming = new Map(created.map((exam) => [exam.id, exam]))
        const retained = current.filter((exam) => !incoming.has(exam.id))
        return [...created, ...retained]
      })
      setAdminReadingBulkJsonInput('')
      setAdminReadingBulkValidation(null)
      setAdminPanelMessage(`Uploaded ${created.length} reading exam${created.length === 1 ? '' : 's'} by bulk JSON.`)
    } catch (error) {
      setAdminPanelMessage('')
      setAuthError(error instanceof Error ? error.message : 'Could not bulk upload reading exams.')
    }
  }

  const loadNotebookForSession = async (session: AuthSession) => {
    const scopedEntriesKey = makeScopedStorageKey(NOTEBOOK_ENTRIES_KEY, session.email)
    const scopedSectionsKey = makeScopedStorageKey(NOTEBOOK_CUSTOM_SECTIONS_KEY, session.email)
    const scopedScoresKey = makeScopedStorageKey(TEST_LATEST_SCORE_KEY, session.email)

    const localEntries = parseStoredNotebookEntries(localStorage.getItem(scopedEntriesKey))
    const localSections = parseStoredCustomSections(localStorage.getItem(scopedSectionsKey))
    const localScores = parseStoredScores(localStorage.getItem(scopedScoresKey))

    setLatestScoresByTest(localScores)
    setIsNotebookHydrating(true)
    setNotebookSyncError('')
    notebookLoadedRef.current = false
    notebookSyncedSignatureRef.current = ''

    try {
      const payload = await fetchJson<NotebookApiResponse>('/api/me/notebook', {
        headers: {
          Authorization: `Bearer ${session.accessToken}`
        }
      })
      const remoteEntries = Array.isArray(payload.entries) ? payload.entries : []
      const remoteSections = Array.isArray(payload.customSections) ? payload.customSections : []
      const shouldSeedFromLocal =
        remoteEntries.length === 0 &&
        remoteSections.length === 0 &&
        (localEntries.length > 0 || localSections.length > 0)

      setNotebookEntries(shouldSeedFromLocal ? localEntries : remoteEntries)
      setCustomSections(shouldSeedFromLocal ? localSections : remoteSections)
      notebookSyncedSignatureRef.current = shouldSeedFromLocal
        ? ''
        : buildNotebookSyncSignature(remoteEntries, remoteSections)
    } catch {
      setNotebookEntries(localEntries)
      setCustomSections(localSections)
      setNotebookSyncError('Notebook sync is temporarily unavailable. Using this device backup for now.')
      notebookSyncedSignatureRef.current = ''
    } finally {
      setSelectedNotebookSection('speaking')
      setIsNotebookHydrating(false)
      notebookLoadedRef.current = true
    }
  }

  const resetStudentWorkspaceState = (name = 'Student') => {
    setNotebookEntries([])
    setCustomSections([])
    setIsNotebookHydrating(false)
    setNotebookSyncError('')
    setLatestScoresByTest({})
    setCreditProfile(defaultCreditProfile(name))
    setSelectedNotebookSection('speaking')
    setAssessmentResult(null)
    setAssessmentError('')
    setAssessmentRuntimeMessages([])
    setTranscript('')
    setInterimTranscript('')
    setTranscriptionError('')
    setAudioError('')
    setSelectedProvider('gemini')
    setReportViewSnapshot(null)
    notebookLoadedRef.current = false
    notebookSyncedSignatureRef.current = ''
    if (notebookSyncTimeoutRef.current) {
      window.clearTimeout(notebookSyncTimeoutRef.current)
      notebookSyncTimeoutRef.current = null
    }
  }

  const clearQuestionCountdown = () => {
    if (questionCountdownIntervalRef.current) {
      window.clearInterval(questionCountdownIntervalRef.current)
      questionCountdownIntervalRef.current = null
    }
    setQuestionCountdown(null)
    setQuestionCountdownLabel('')
  }

  const resetPart2TimerDelay = () => {
    part2TimerDelayUntilRef.current = null
    part2TimerDelayArmedRef.current = false
  }

  const armPart2TimerDelay = () => {
    part2TimerDelayUntilRef.current = null
    part2TimerDelayArmedRef.current = true
  }

  const groupedTopics = useMemo(() => {
    const grouped = new Map<string, SpeakingTopic[]>()
    topics.forEach((topic) => {
      if (!grouped.has(topic.category)) {
        grouped.set(topic.category, [])
      }
      grouped.get(topic.category)?.push(topic)
    })
    return grouped
  }, [topics])
  const adminPart1QuestionBank = useMemo(
    () =>
      PART1_TOPICS.map((topic) => ({
        topicId: topic.id,
        topicTitle: topic.title,
        questions: [topic.prompt, ...topic.cues]
      })),
    []
  )
  const adminPart3QuestionBank = useMemo(
    () =>
      PART3_TOPICS.map((topic) => ({
        topicId: topic.id,
        topicTitle: topic.title,
        questions: [topic.prompt, ...topic.cues]
      })),
    []
  )
  const filteredManagedLearners = useMemo(() => {
    const query = adminLearnerSearchInput.trim().toLowerCase()
    if (!query) return managedLearners
    return managedLearners.filter((learner) =>
      [learner.name, learner.email, learner.role, learner.status].some((value) =>
        String(value || '').toLowerCase().includes(query)
      )
    )
  }, [adminLearnerSearchInput, managedLearners])
  const openSupportReportCount = useMemo(
    () => adminSupportReports.filter((report) => report.status === 'open').length,
    [adminSupportReports]
  )
  const activeSupportReportCount = useMemo(
    () => adminSupportReports.filter((report) => ['open', 'in_progress'].includes(report.status)).length,
    [adminSupportReports]
  )
  const adminTtsQuestionLibrary = useMemo(
    () => [
      ...adminPart1QuestionBank.flatMap((topic) =>
        topic.questions.map((question, index) => ({
          key: `part1-${topic.topicId}-${index}`,
          section: 'Part 1',
          topicTitle: topic.topicTitle,
          question,
          audioUrl: ttsAudioUrls[`part1-${topic.topicId}-${index}`] || ''
        }))
      ),
      ...adminPart3QuestionBank.flatMap((topic) =>
        topic.questions.map((question, index) => ({
          key: `part3-${topic.topicId}-${index}`,
          section: 'Part 3',
          topicTitle: topic.topicTitle,
          question,
          audioUrl: ttsAudioUrls[`part3-${topic.topicId}-${index}`] || ''
        }))
      )
    ],
    [adminPart1QuestionBank, adminPart3QuestionBank, ttsAudioUrls]
  )
  const filteredAdminTtsQuestionLibrary = useMemo(() => {
    const query = adminTtsSearchInput.trim().toLowerCase()
    if (!query) return adminTtsQuestionLibrary
    return adminTtsQuestionLibrary.filter((item) =>
      [item.section, item.topicTitle, item.question].some((value) =>
        String(value || '').toLowerCase().includes(query)
      )
    )
  }, [adminTtsQuestionLibrary, adminTtsSearchInput])
  const generatedAdminTtsLibrary = useMemo(
    () => adminTtsQuestionLibrary.filter((item) => item.audioUrl),
    [adminTtsQuestionLibrary]
  )
  const filteredReadingExams = useMemo(
    () => readingExams.filter((exam) => exam.category === selectedReadingCategory),
    [readingExams, selectedReadingCategory]
  )
  const readingExamCountsByCategory = useMemo(
    () =>
      (Object.keys(READING_CATEGORY_LABELS) as ReadingBankCategory[]).map((category) => ({
        category,
        label: READING_CATEGORY_LABELS[category],
        count: readingExams.filter((exam) => exam.category === category).length,
        exams: readingExams.filter((exam) => exam.category === category).slice(0, 6)
      })),
    [readingExams]
  )
  const recentStudentSupportReports = useMemo(() => mySupportReports.slice(0, 4), [mySupportReports])
  const activeReadingExam =
    filteredReadingExams.find((exam) => exam.id === selectedReadingExamId) ??
    filteredReadingExams[0] ??
    null
  const activeReadingPassages = activeReadingExam?.parsedPayload?.passages || []
  const activeReadingPassage =
    activeReadingPassages.find((passage) => passage.number === readingActivePassageNumber) ??
    activeReadingPassages[0] ??
    null
  const activeReadingHint =
    readingHintQuestionNumber === null
      ? null
      : activeReadingPassages
          .flatMap((passage) => passage.questions || [])
          .find((question) => question.number === readingHintQuestionNumber) ?? null
  const activeReadingQuestions = activeReadingPassage?.questions || []
  const activeReadingAllQuestions = activeReadingPassages.flatMap((passage) => passage.questions || [])
  const answeredReadingCount = activeReadingAllQuestions.filter((question) =>
    String(readingAnswers[question.number] || '').trim()
  ).length
  const readingAccuracy = readingReportItems.length
    ? Math.round((readingReportItems.filter((item) => item.isCorrect).length / readingReportItems.length) * 100)
    : 0
  const unansweredReadingCount = readingReportItems.filter((item) => !String(item.userAnswer || '').trim()).length
  const readingReportByPassage = activeReadingPassages.map((passage) => {
    const items = readingReportItems.filter((item) =>
      passage.questions.some((question) => question.number === item.number)
    )
    return {
      passage,
      items,
      correct: items.filter((item) => item.isCorrect).length
    }
  })

  const part2AvailableTopics = topics.filter((topic) => enabledTopicIds.includes(topic.id))
  const availableTopics = useMemo(() => {
    if (selectedTestMode === 'part1') return PART1_TOPICS
    if (selectedTestMode === 'part3') return PART3_TOPICS
    if (selectedTestMode === 'full') return FULL_EXAM_TOPICS
    return part2AvailableTopics
  }, [selectedTestMode, part2AvailableTopics])
  const activeTopic =
    availableTopics.find((topic) => topic.id === selectedTopicId) ?? availableTopics[0] ?? null
  const isFullExamMode = selectedTestMode === 'full'
  const isQuestionByQuestionMode = selectedTestMode === 'part1' || selectedTestMode === 'part3'
  const fullExamPlan = useMemo(() => {
    return buildFullExamPlanFromPromptAndCues(activeTopic?.prompt || '', activeTopic?.cues || [])
  }, [activeTopic])
  const resultTopicContext = reportViewSnapshot
    ? {
        id: 'saved-report',
        category: reportViewSnapshot.topicCategory,
        title: reportViewSnapshot.topicTitle,
        prompt: reportViewSnapshot.prompt,
        cues: reportViewSnapshot.cues
      }
    : activeTopic
  const resultFullExamPlan = useMemo(
    () => buildFullExamPlanFromPromptAndCues(resultTopicContext?.prompt || '', resultTopicContext?.cues || []),
    [resultTopicContext]
  )
  const activeQuestionList = useMemo(() => {
    if (!activeTopic) return []
    if (!isQuestionByQuestionMode) return []
    return [activeTopic.prompt, ...activeTopic.cues]
  }, [activeTopic, isQuestionByQuestionMode])
  const activeQuestion = activeQuestionList[currentQuestionIndex] || ''
  const fullExamCurrentQuestion =
    fullExamPhase === 'part1'
      ? fullExamPlan.part1Questions[fullExamPart1Index] || ''
      : fullExamPhase === 'part3'
        ? fullExamPlan.part3Questions[fullExamPart3Index] || ''
        : fullExamPhase === 'part2_speaking'
          ? fullExamPlan.part2Prompt
          : ''
  const activeLiveNoteTitle = isFullExamMode
    ? fullExamPhase === 'part2_speaking'
      ? fullExamPlan.part2Prompt || 'Part 2 Note'
      : fullExamPhase === 'part1' || fullExamPhase === 'part3'
        ? fullExamCurrentQuestion || 'Your Note'
        : 'Your Note'
    : isQuestionByQuestionMode
      ? activeQuestion || 'Your Note'
      : activeTopic?.prompt || 'Your Preparation Note'
  const fullExamNoteKey =
    fullExamPhase === 'part1'
      ? `full-p1-${fullExamPart1Index}`
      : fullExamPhase === 'part3'
        ? `full-p3-${fullExamPart3Index}`
        : 'full-p2'
  const activeSpeakingNote = isFullExamMode
    ? questionPrepNotes[fullExamNoteKey] || prepNotePart2
    : isQuestionByQuestionMode
      ? questionPrepNotes[String(currentQuestionIndex)] || ''
      : prepNotePart2
  const standalonePart2Recommendations = useMemo(
    () => (selectedTestMode === 'part2' && activeTopic ? getPart2Recommendations(activeTopic.prompt, activeTopic.cues) : []),
    [selectedTestMode, activeTopic]
  )
  const fullExamPart2Recommendations = useMemo(
    () => (isFullExamMode ? getPart2Recommendations(fullExamPlan.part2Prompt, activeTopic?.cues || []) : []),
    [isFullExamMode, fullExamPlan.part2Prompt, activeTopic]
  )
  const currentPart1Recommendations = useMemo(
    () =>
      selectedTestMode === 'part1'
        ? getPart1Recommendations(activeQuestion, buildPart1RecommendationExtras(activeTopic, activeQuestion))
        : [],
    [selectedTestMode, activeQuestion, activeTopic]
  )
  const currentPart3Recommendations = useMemo(
    () =>
      selectedTestMode === 'part3'
        ? getPart3Recommendations(activeQuestion, buildPart3RecommendationExtras(activeTopic, activeQuestion))
        : [],
    [selectedTestMode, activeQuestion, activeTopic]
  )
  const currentQuestionRecommendations = selectedTestMode === 'part1' ? currentPart1Recommendations : currentPart3Recommendations
  const activeLengthGuideMode: 'part1' | 'part2' | 'part3' | null = isFullExamMode
    ? fullExamPhase === 'part1'
      ? 'part1'
      : fullExamPhase === 'part2_speaking'
        ? 'part2'
        : fullExamPhase === 'part3'
          ? 'part3'
          : null
    : selectedTestMode === 'part1' || selectedTestMode === 'part2' || selectedTestMode === 'part3'
      ? selectedTestMode
      : null
  const currentTranscriptSegment = useMemo(() => {
    if (!transcript && !interimTranscript) return ''
    if (isFullExamMode || isQuestionByQuestionMode) {
      const start = Math.max(0, questionStartCharIndexRef.current)
      return `${transcript.slice(start).trim()} ${interimTranscript.trim()}`.trim()
    }
    return `${transcript.trim()} ${interimTranscript.trim()}`.trim()
  }, [interimTranscript, isFullExamMode, isQuestionByQuestionMode, transcript])
  const currentTranscriptWordCount = useMemo(() => countWords(currentTranscriptSegment), [currentTranscriptSegment])
  const currentLengthThresholds = activeLengthGuideMode ? SPEAKING_LENGTH_THRESHOLDS[activeLengthGuideMode] : []
  const canReviewScriptBeforeSubmission =
    attemptStage === 'speaking' &&
    !isExamPaused &&
    ((isFullExamMode &&
      fullExamPhase === 'part3' &&
      fullExamPart3Index >= fullExamPlan.part3Questions.length - 1) ||
      (isQuestionByQuestionMode && currentQuestionIndex >= activeQuestionList.length - 1) ||
      selectedTestMode === 'part2')
  const fullExamCurrentPart1Recommendations = useMemo(
    () =>
      getPart1Recommendations(
        fullExamPlan.part1Questions[fullExamPart1Index] || '',
        buildFullExamPart1RecommendationExtras(
          activeTopic,
          fullExamPlan.part1Questions,
          fullExamPlan.part1Questions[fullExamPart1Index] || ''
        )
      ),
    [fullExamPlan.part1Questions, fullExamPart1Index, activeTopic]
  )
  const fullExamCurrentPart3Recommendations = useMemo(
    () =>
      getPart3Recommendations(
        fullExamPlan.part3Questions[fullExamPart3Index] || '',
        buildFullExamPart3RecommendationExtras(
          activeTopic,
          fullExamPlan.part3Questions,
          fullExamPlan.part3Questions[fullExamPart3Index] || ''
        )
      ),
    [fullExamPlan.part3Questions, fullExamPart3Index, activeTopic]
  )
  const fullExamPhaseLabel = useMemo(() => {
    if (!isFullExamMode) return ''
    if (fullExamPhase === 'part1') {
      return `Part 1 | Q${fullExamPart1Index + 1}/${fullExamPlan.part1Questions.length} | 75s`
    }
    if (fullExamPhase === 'part2_prep') return 'Part 2 | Note Prep | 60s'
    if (fullExamPhase === 'part2_speaking') return 'Part 2 | Speaking | 120s'
    if (fullExamPhase === 'rest') return 'Pause | Rest | 30s'
    return `Part 3 | Q${fullExamPart3Index + 1}/${fullExamPlan.part3Questions.length} | 90s`
  }, [
    isFullExamMode,
    fullExamPhase,
    fullExamPart1Index,
    fullExamPart3Index,
    fullExamPlan.part1Questions.length,
    fullExamPlan.part3Questions.length
  ])

  const fullExamTotalSeconds = useMemo(() => {
    if (!isFullExamMode) return 0
    const p1 = fullExamPlan.part1Questions.length * 75
    const p2Prep = 60
    const p2Speak = 120
    const rest = 30
    const p3 = fullExamPlan.part3Questions.length * 90
    return p1 + p2Prep + p2Speak + rest + p3
  }, [isFullExamMode, fullExamPlan.part1Questions.length, fullExamPlan.part3Questions.length])

  const fullExamElapsedSeconds = useMemo(() => {
    if (!isFullExamMode) return 0
    let elapsed = 0
    const p1Count = fullExamPlan.part1Questions.length
    if (fullExamPhase === 'part1') {
      elapsed = fullExamPart1Index * 75 + (75 - fullExamPhaseSeconds)
    } else if (fullExamPhase === 'part2_prep') {
      elapsed = p1Count * 75 + (60 - fullExamPhaseSeconds)
    } else if (fullExamPhase === 'part2_speaking') {
      elapsed = p1Count * 75 + 60 + (120 - fullExamPhaseSeconds)
    } else if (fullExamPhase === 'rest') {
      elapsed = p1Count * 75 + 60 + 120 + (30 - fullExamPhaseSeconds)
    } else if (fullExamPhase === 'part3') {
      elapsed = p1Count * 75 + 60 + 120 + 30 + fullExamPart3Index * 90 + (90 - fullExamPhaseSeconds)
    }
    return Math.max(0, elapsed)
  }, [isFullExamMode, fullExamPhase, fullExamPart1Index, fullExamPart3Index, fullExamPhaseSeconds, fullExamPlan.part1Questions.length])

  const fullExamProgressPercent = useMemo(() => {
    if (fullExamTotalSeconds === 0) return 0
    return Math.min(100, Math.round((fullExamElapsedSeconds / fullExamTotalSeconds) * 100))
  }, [fullExamElapsedSeconds, fullExamTotalSeconds])

  const fullExamTotalMinutes = Math.ceil(fullExamTotalSeconds / 60)

  const isLowTime = useMemo(() => {
    if (!isFullExamMode) return remainingTalkSeconds <= 15
    return fullExamPhaseSeconds <= 15
  }, [isFullExamMode, fullExamPhaseSeconds, remainingTalkSeconds])

  const notebookSectionTabs = useMemo(
    () => ['speaking', 'writing', 'listening', 'reading', ...customSections],
    [customSections]
  )
  const filteredNotebookEntries = useMemo(
    () =>
      notebookEntries.filter((entry) =>
        selectedNotebookSection === 'custom'
          ? entry.section === 'custom'
          : entry.section === selectedNotebookSection ||
            (entry.section === 'custom' && entry.customSectionName === selectedNotebookSection)
      ),
    [notebookEntries, selectedNotebookSection]
  )
  const currentLoadingPhrase = ANALYSIS_LOADING_PHRASES[loadingPhraseCursor % ANALYSIS_LOADING_PHRASES.length]
  const latestRuntimeMessage = assessmentRuntimeMessages[assessmentRuntimeMessages.length - 1] || ''
  const roundedAssessmentProgress = Math.round(assessmentProgress)
  const formattedAssessmentCountdown = `${String(Math.floor(assessmentCountdownSeconds / 60)).padStart(2, '0')}:${String(
    assessmentCountdownSeconds % 60
  ).padStart(2, '0')}`

  useEffect(() => {
    if (attemptStage !== 'assessing') return
    if (assessmentStartedAtRef.current === null) {
      assessmentStartedAtRef.current = window.performance.now()
    }

    let animationFrame = 0
    const tick = () => {
      setAssessmentProgress((current) => {
        const elapsedMs = Math.max(0, window.performance.now() - (assessmentStartedAtRef.current || 0))
        const elapsedFloor = Math.min(96, 1 + elapsedMs / 180)
        const cappedBackendTarget = assessmentProgressTarget >= 100 ? 100 : Math.min(99, assessmentProgressTarget)
        const desiredTarget =
          cappedBackendTarget >= 100 ? 100 : Math.max(cappedBackendTarget, elapsedFloor)

        if (current >= desiredTarget) return current

        const distance = desiredTarget - current
        const step =
          desiredTarget >= 100
            ? Math.max(1.6, distance * 0.22)
            : Math.max(0.18, Math.min(1.4, distance * 0.12))

        return Math.min(desiredTarget, Number((current + step).toFixed(2)))
      })
      animationFrame = window.requestAnimationFrame(tick)
    }

    animationFrame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(animationFrame)
  }, [attemptStage, assessmentProgressTarget])

  useEffect(() => {
    if (attemptStage === 'assessing') return
    assessmentStartedAtRef.current = null
  }, [attemptStage])

  useEffect(() => {
    if (attemptStage !== 'assessing') return
    const phraseInterval = window.setInterval(() => {
      setLoadingPhraseCursor((current) => (current + 1) % ANALYSIS_LOADING_PHRASES.length)
    }, 1500)
    return () => window.clearInterval(phraseInterval)
  }, [attemptStage])

  useEffect(() => {
    if (attemptStage !== 'assessing' || !isFullMockAssessmentLoading) return
    const countdownInterval = window.setInterval(() => {
      setAssessmentCountdownSeconds((current) => Math.max(0, current - 1))
    }, 1000)
    return () => window.clearInterval(countdownInterval)
  }, [attemptStage, isFullMockAssessmentLoading])

  useEffect(() => {
    if (attemptStage === 'assessing') return
    setAssessmentCountdownSeconds(0)
    setIsFullMockAssessmentLoading(false)
  }, [attemptStage])

  useEffect(() => {
    const restoreSession = async () => {
      const storedSession = localStorage.getItem(AUTH_SESSION_KEY)
      if (!storedSession) {
        setIsAuthLoading(false)
        return
      }
      try {
        const parsed = JSON.parse(storedSession) as Partial<AuthSession>
        if (!parsed?.refreshToken) {
          localStorage.removeItem(AUTH_SESSION_KEY)
          setIsAuthLoading(false)
          return
        }
        const payload = await fetchJson<AuthApiResponse>('/api/auth/refresh', {
          method: 'POST',
          body: JSON.stringify({ refreshToken: parsed.refreshToken })
        })
        setAuthStateFromPayload(payload)
        if (payload.session.role === 'admin') {
          await loadManagedLearners(payload.session.accessToken)
          await loadAdminSupportReports(payload.session.accessToken)
        } else {
          await loadMySupportReports(payload.session.accessToken)
        }
      } catch {
        localStorage.removeItem(AUTH_SESSION_KEY)
        setAuthSession(null)
      } finally {
        setIsAuthLoading(false)
      }
    }

    void restoreSession()
  }, [])

  useEffect(() => {
    if (!authSession) {
      localStorage.removeItem(AUTH_SESSION_KEY)
      return
    }
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(authSession))
  }, [authSession])

  useEffect(() => {
    if (!authSession?.email || authSession.role !== 'student') {
      resetStudentWorkspaceState()
      setManagedLearners([])
      setMySupportReports([])
      return
    }

    void loadNotebookForSession(authSession)
  }, [authSession?.accessToken, authSession?.email, authSession?.role])

  useEffect(() => {
    if (authSession?.role !== 'admin') {
      setAdminSupportReports([])
      return
    }
    void loadManagedLearners()
  }, [authSession?.role])

  useEffect(() => {
    if (authSession?.role !== 'admin') return
    void loadAdminSupportReports()
  }, [authSession?.role, authSession?.accessToken])

  useEffect(() => {
    if (!authSession?.accessToken || authSession.role !== 'admin') return
    const intervalId = window.setInterval(() => {
      void loadAdminSupportReports(authSession.accessToken)
    }, 45000)
    return () => window.clearInterval(intervalId)
  }, [authSession?.accessToken, authSession?.role])

  useEffect(() => {
    if (!authSession?.accessToken || authSession.role !== 'student') return
    void loadMySupportReports(authSession.accessToken)
  }, [authSession?.accessToken, authSession?.role])

  useEffect(() => {
    if (!isStudentViewLockedToSpeaking) return
    if (['reading', 'notebook', 'admin'].includes(activePage)) {
      setActivePage('home')
    }
  }, [activePage, isStudentViewLockedToSpeaking])

  useEffect(() => {
    if (!authSession?.accessToken || authSession.role !== 'admin') {
      if (authSession?.role === 'student') {
        setReadingExams([])
      }
      return
    }
    void loadReadingExams(authSession.accessToken)
  }, [authSession?.accessToken, authSession?.role])

  useEffect(() => {
    if (!filteredReadingExams.length) {
      setSelectedReadingExamId('')
      return
    }
    if (!filteredReadingExams.some((exam) => exam.id === selectedReadingExamId)) {
      setSelectedReadingExamId(filteredReadingExams[0].id)
    }
  }, [filteredReadingExams, selectedReadingExamId])

  useEffect(() => {
    if (!activeReadingPassages.length) {
      setReadingActivePassageNumber(1)
      return
    }
    if (!activeReadingPassages.some((passage) => passage.number === readingActivePassageNumber)) {
      setReadingActivePassageNumber(activeReadingPassages[0].number)
    }
  }, [activeReadingPassages, readingActivePassageNumber])

  useEffect(() => {
    if (!authSession?.email) return
    localStorage.setItem(makeScopedStorageKey(NOTEBOOK_ENTRIES_KEY, authSession.email), JSON.stringify(notebookEntries))
  }, [authSession, notebookEntries])

  useEffect(() => {
    notebookEntriesRef.current = notebookEntries
  }, [notebookEntries])

  useEffect(() => {
    if (!authSession?.email) return
    localStorage.setItem(
      makeScopedStorageKey(NOTEBOOK_CUSTOM_SECTIONS_KEY, authSession.email),
      JSON.stringify(customSections)
    )
  }, [authSession, customSections])

  useEffect(() => {
    customSectionsRef.current = customSections
  }, [customSections])

  useEffect(() => {
    if (!authSession || authSession.role !== 'student' || !authSession.email) return
    localStorage.setItem(makeScopedStorageKey(TEST_LATEST_SCORE_KEY, authSession.email), JSON.stringify(latestScoresByTest))
  }, [authSession, latestScoresByTest])

  useEffect(() => {
    if (!authSession?.accessToken || !authSession.email || isNotebookHydrating || !notebookLoadedRef.current) return
    const nextSignature = buildNotebookSyncSignature(notebookEntries, customSections)
    if (nextSignature === notebookSyncedSignatureRef.current) return
    if (notebookSyncTimeoutRef.current) {
      window.clearTimeout(notebookSyncTimeoutRef.current)
    }

    notebookSyncTimeoutRef.current = window.setTimeout(() => {
      void syncNotebookSnapshotToSupabase({
        entries: notebookEntries,
        sections: customSections
      })
    }, 500)

    return () => {
      if (notebookSyncTimeoutRef.current) {
        window.clearTimeout(notebookSyncTimeoutRef.current)
        notebookSyncTimeoutRef.current = null
      }
    }
  }, [authSession?.accessToken, authSession?.email, notebookEntries, customSections, isNotebookHydrating])

  useEffect(() => {
    if (!notebookSaveNotice) return
    const timeout = window.setTimeout(() => {
      setNotebookSaveNotice('')
    }, 2200)
    return () => window.clearTimeout(timeout)
  }, [notebookSaveNotice])

  const addCustomSection = () => {
    const sectionName = newCustomSectionName.trim()
    if (!sectionName) return
    if (notebookSectionTabs.includes(sectionName)) return
    setCustomSections((current) => [...current, sectionName])
    setSelectedNotebookSection(sectionName)
    setNewCustomSectionName('')
  }

  const savePlanToNotebook = ({
    criterion,
    quote,
    fix,
    thaiMeaning
  }: {
    criterion: string
    quote: string
    fix: string
    thaiMeaning?: string
  }) => {
    const chosenSection =
      selectedNotebookSection === 'custom' ? ('speaking' as const) : selectedNotebookSection
    const isBuiltIn = ['speaking', 'writing', 'listening', 'reading'].includes(chosenSection)
    const section = (isBuiltIn ? chosenSection : 'custom') as NotebookSection
    const customSectionName = section === 'custom' ? chosenSection : undefined

    const nextEntry: NotebookEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      section,
      customSectionName,
      topicTitle: activeTopic?.title || 'Untitled topic',
      criterion,
      quote,
      fix,
      thaiMeaning: thaiMeaning || '',
      personalNote: '',
      createdAt: new Date().toISOString()
    }
    const nextEntries = [nextEntry, ...notebookEntriesRef.current]
    setNotebookEntries(nextEntries)
    setSelectedNotebookSection(customSectionName || section)
    setNotebookSaveNotice('Added to notebook')
    void syncNotebookSnapshotToSupabase({
      entries: nextEntries,
      sections: customSectionsRef.current,
      successNotice: 'Added to notebook and synced to your account'
    })
  }

  const saveFullReportToNotebook = (report: AssessmentReport) => {
    const customSectionName = 'saved reports'
    const nextSections = customSectionsRef.current.includes(customSectionName)
      ? customSectionsRef.current
      : [...customSectionsRef.current, customSectionName]
    setCustomSections(nextSections)

    const nextEntry: NotebookEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      section: 'custom',
      customSectionName,
      topicTitle: activeTopic?.title || 'Saved report',
      criterion: 'Full Report',
      quote: `Saved complete report snapshot for ${activeTopic?.title || 'current topic'}`,
      fix: 'Open this saved report to review it in the full report UI.',
      thaiMeaning: '',
      personalNote: '',
      savedReportSnapshot: {
        testMode: selectedTestMode,
        topicTitle: activeTopic?.title || 'Saved report',
        topicCategory: activeTopic?.category || 'Speaking',
        prompt: activeTopic?.prompt || '',
        cues: activeTopic?.cues || [],
        report: report as AssessmentResult,
        selectedProvider
      },
      createdAt: new Date().toISOString()
    }
    const nextEntries = [nextEntry, ...notebookEntriesRef.current]
    setNotebookEntries(nextEntries)
    setSelectedNotebookSection(customSectionName)
    setNotebookSaveNotice('Added to notebook')
    void syncNotebookSnapshotToSupabase({
      entries: nextEntries,
      sections: nextSections,
      successNotice: 'Added to notebook and synced to your account'
    })
  }

  const removeNotebookEntry = (entryId: string) => {
    setNotebookEntries((current) => current.filter((item) => item.id !== entryId))
  }

  const updateNotebookPersonalNote = (entryId: string, personalNote: string) => {
    setNotebookEntries((current) =>
      current.map((item) => (item.id === entryId ? { ...item, personalNote } : item))
    )
  }

  useEffect(() => {
    if (!activeTopic && availableTopics.length > 0) {
      setSelectedTopicId(availableTopics[0].id)
    }
  }, [activeTopic, availableTopics])

  useEffect(() => {
    if (attemptStage === 'idle' && availableTopics.length > 0) {
      setSelectedTopicId(availableTopics[0].id)
    }
  }, [selectedTestMode, attemptStage, availableTopics])

  useEffect(() => {
    const isStandalonePart2 = attemptStage === 'speaking' && !isFullExamMode && selectedTestMode === 'part2'
    const isFullMockPart2 = attemptStage === 'speaking' && isFullExamMode && fullExamPhase === 'part2_speaking'
    const isPart2Speaking = isStandalonePart2 || isFullMockPart2
    if (!isPart2Speaking || questionCountdown !== null || !part2TimerDelayArmedRef.current || !isTranscribing) return
    part2TimerDelayUntilRef.current = Date.now() + 3000
    part2TimerDelayArmedRef.current = false
  }, [attemptStage, isFullExamMode, selectedTestMode, fullExamPhase, questionCountdown, isTranscribing])

  useEffect(() => {
    return () => {
      if (transcriptionRestartTimeoutRef.current) {
        window.clearTimeout(transcriptionRestartTimeoutRef.current)
        transcriptionRestartTimeoutRef.current = null
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
      }
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current)
      }
      if (prepIntervalRef.current) {
        window.clearInterval(prepIntervalRef.current)
      }
      if (speakingIntervalRef.current) {
        window.clearInterval(speakingIntervalRef.current)
      }
      if (assessPollRef.current) {
        window.clearInterval(assessPollRef.current)
      }
      if (promptAudioRef.current) {
        promptAudioRef.current.pause()
        promptAudioRef.current = null
      }
    }
  }, [])

  const clearTranscriptionRestart = () => {
    if (transcriptionRestartTimeoutRef.current) {
      window.clearTimeout(transcriptionRestartTimeoutRef.current)
      transcriptionRestartTimeoutRef.current = null
    }
  }

  const scheduleTranscriptionRestart = (delayMs = 180) => {
    clearTranscriptionRestart()
    transcriptionRestartTimeoutRef.current = window.setTimeout(() => {
      transcriptionRestartTimeoutRef.current = null
      if (shouldKeepTranscribingRef.current && attemptStageRef.current === 'speaking') {
        startTranscription()
      }
    }, delayMs)
  }

  const startTranscription = () => {
    const appWindow = window as WindowWithSpeechRecognition
    const SpeechRecognitionConstructor =
      appWindow.SpeechRecognition ?? appWindow.webkitSpeechRecognition

    if (!SpeechRecognitionConstructor) {
      setTranscriptionError(
        'Speech recognition is not supported in this browser. Try Chrome or Edge.'
      )
      return
    }

    if (
      suppressTranscriptionDuringTtsRef.current ||
      transcriptionStartPendingRef.current ||
      recognitionRef.current
    ) {
      return
    }

    setTranscriptionError('')
    shouldKeepTranscribingRef.current = true
    clearTranscriptionRestart()
    transcriptionStartPendingRef.current = true
    const recognition = new SpeechRecognitionConstructor()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event) => {
      let finalText = ''
      let interimText = ''

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i]
        if (result.isFinal) {
          finalText += `${result[0].transcript} `
        } else {
          interimText += result[0].transcript
        }
      }

      if (finalText) {
        setTranscript((current) => `${current}${finalText}`.trim())
      }
      setInterimTranscript(interimText)
    }

    recognition.onerror = (event) => {
      const errorCode = String(event.error || '')
      if (suppressTranscriptionDuringTtsRef.current) {
        // When TTS is playing we intentionally pause/stop transcription.
        // Some browsers report "aborted"—ignore those errors.
        setIsTranscribing(false)
        return
      }

      // Some browsers frequently emit "aborted" even while the user is speaking.
      // To prevent the UI from going into a stopped/aborted state, we ignore it
      // and restart recognition as long as we're still in the speaking stage.
      if (errorCode.toLowerCase() === 'aborted') {
        setIsTranscribing(false)
        setInterimTranscript('')
        return
      }
      setTranscriptionError(`Live transcription error: ${event.error}`)
      setIsTranscribing(false)
    }

    recognition.onend = () => {
      const isCurrentRecognition = recognitionRef.current === recognition
      if (isCurrentRecognition) {
        recognitionRef.current = null
      }
      transcriptionStartPendingRef.current = false
      setIsTranscribing(false)
      setInterimTranscript('')
      const shouldRestart = shouldKeepTranscribingRef.current && attemptStageRef.current === 'speaking'
      if (shouldRestart) {
        scheduleTranscriptionRestart()
      }
    }

    recognitionRef.current = recognition
    try {
      recognition.start()
      setIsTranscribing(true)
    } catch (error) {
      recognitionRef.current = null
      transcriptionStartPendingRef.current = false
      setIsTranscribing(false)
      const message = error instanceof Error ? error.message : 'Unknown speech recognition error'
      setTranscriptionError(`Live transcription could not start: ${message}`)
      if (shouldKeepTranscribingRef.current && attemptStageRef.current === 'speaking') {
        scheduleTranscriptionRestart(320)
      }
    }
  }

  const stopTranscription = () => {
    shouldKeepTranscribingRef.current = false
    clearTranscriptionRestart()
    const recognition = recognitionRef.current
    recognitionRef.current = null
    recognition?.stop()
    setIsTranscribing(false)
    setInterimTranscript('')
  }

  const stopPromptAudioPlayback = () => {
    if (!promptAudioRef.current) return
    promptAudioRef.current.pause()
    promptAudioRef.current.src = ''
    promptAudioRef.current = null
  }

  const playPromptWithServerTts = async (text: string) => {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    })

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}))
      const message = payload?.error?.message || 'Question audio playback failed.'
      throw new Error(String(message))
    }

    const audioBlob = await response.blob()
    const audioUrl = URL.createObjectURL(audioBlob)

    await new Promise<void>((resolve, reject) => {
      stopPromptAudioPlayback()
      const audio = new Audio(audioUrl)
      promptAudioRef.current = audio
      let completed = false

      const cleanup = () => {
        if (completed) return
        completed = true
        audio.onended = null
        audio.onerror = null
        URL.revokeObjectURL(audioUrl)
        if (promptAudioRef.current === audio) {
          promptAudioRef.current = null
        }
      }

      audio.onended = () => {
        cleanup()
        resolve()
      }
      audio.onerror = () => {
        cleanup()
        reject(new Error('Question audio playback was blocked or failed to load.'))
      }

      audio.play().catch((error) => {
        cleanup()
        reject(error instanceof Error ? error : new Error('Question audio playback failed.'))
      })
    })
  }

  const speakPromptWithTtsAndManageTranscription = async (text: string) => {
    suppressTranscriptionDuringTtsRef.current = true
    // Stop recognition while speaking to prevent "aborted" errors from some browsers.
    try {
      stopTranscription()
    } catch {
      // noop
    }
    setIsPromptTtsPlaying(true)
    try {
      await speakPrompt(text)
    } finally {
      setIsPromptTtsPlaying(false)
      suppressTranscriptionDuringTtsRef.current = false
      // Resume only if we are currently in speaking mode.
      if (attemptStageRef.current === 'speaking') {
        startTranscription()
      }
    }
  }

  const toggleTopic = (topicId: string) => {
    setEnabledTopicIds((current) => {
      if (current.includes(topicId)) {
        const next = current.filter((id) => id !== topicId)
        return next.length > 0 ? next : current
      }
      return [...current, topicId]
    })
  }

  const startAudioRecording = async (): Promise<boolean> => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setAudioError('Audio recording is not supported in this browser.')
      return false
    }

    try {
      setAudioError('')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      audioChunksRef.current = []
      setAudioUrl('')
      setRecordingDuration(0)

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        latestAudioBlobRef.current = audioBlob
        const nextUrl = URL.createObjectURL(audioBlob)
        setAudioUrl(nextUrl)
        setIsRecordingAudio(false)
        if (recordingStopResolverRef.current) {
          recordingStopResolverRef.current(audioBlob)
          recordingStopResolverRef.current = null
        }
        stream.getTracks().forEach((track) => track.stop())
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      }

      mediaRecorderRef.current = recorder
      recorder.start()
      setIsRecordingAudio(true)
      intervalRef.current = window.setInterval(() => {
        setRecordingDuration((seconds) => seconds + 1)
      }, 1000)
      return true
    } catch {
      setAudioError('Microphone permission denied or unavailable.')
      return false
    }
  }

  const stopAudioRecordingAndGetBlob = async (): Promise<Blob | null> => {
    const recorder = mediaRecorderRef.current
    if (!recorder || recorder.state === 'inactive') {
      return latestAudioBlobRef.current
    }

    return new Promise((resolve) => {
      recordingStopResolverRef.current = resolve
      recorder.stop()
    })
  }

  const generateTtsForQuestion = async (key: string, text: string) => {
    const cleaned = text.trim()
    if (!cleaned) return
    setTtsGeneratingKey(key)
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: cleaned })
      })
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        const message = payload?.error?.message || 'TTS generation failed.'
        throw new Error(String(message))
      }
      const audioBlob = await response.blob()
      const nextUrl = URL.createObjectURL(audioBlob)
      setTtsAudioUrls((current) => {
        if (current[key]) URL.revokeObjectURL(current[key])
        return { ...current, [key]: nextUrl }
      })
    } catch (error) {
      setAudioError(error instanceof Error ? error.message : 'TTS generation failed.')
    } finally {
      setTtsGeneratingKey('')
    }
  }

  const resetSession = () => {
    if (
      isFullExamMode &&
      (attemptStage === 'prep' || attemptStage === 'speaking') &&
      !window.confirm('Full Exam จะถูกตัดเครดิตแม้หยุดกลางคัน ต้องการออกตอนนี้ใช่ไหม?')
    ) {
      return
    }
    setTranscript('')
    setInterimTranscript('')
    setTranscriptionError('')
    setAudioError('')
    setRecordingDuration(0)
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
      setAudioUrl('')
    }
    latestAudioBlobRef.current = null
    setAttemptStage('idle')
    setAssessmentResult(null)
    setAssessmentError('')
    setAssessmentRuntimeMessages([])
    setAssessmentProgress(0)
    setAssessmentProgressTarget(0)
    assessmentStartedAtRef.current = null
    resetPart2TimerDelay()
    setRemainingPrepSeconds(prepSeconds)
    setRemainingTalkSeconds(talkSeconds)
    setCurrentQuestionIndex(0)
    setRemainingQuestionSeconds(75)
    setFullExamPhase('part1')
    setFullExamPart1Index(0)
    setFullExamPart3Index(0)
    setFullExamPhaseSeconds(75)
    setFullExamAnnouncement('')
    setIsPromptTtsPlaying(false)
    clearQuestionCountdown()
    if (fullExamAnnouncementTimeoutRef.current) {
      window.clearTimeout(fullExamAnnouncementTimeoutRef.current)
      fullExamAnnouncementTimeoutRef.current = null
    }
    setPrepNotePart2('')
    setQuestionPrepNotes({})
    questionResponsesRef.current = []
    questionStartCharIndexRef.current = 0
    setSelectedProvider('gemini')
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    stopPromptAudioPlayback()
    setIsExamPaused(false)
    setPauseTimeRemaining(120)
    if (pauseIntervalRef.current) {
      window.clearInterval(pauseIntervalRef.current)
      pauseIntervalRef.current = null
    }
  }

  const startMicCheck = async () => {
    setMicCheckStatus('recording')
    setMicCheckAudioUrl(null)
    micCheckChunksRef.current = []
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      micCheckRecorderRef.current = recorder
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) micCheckChunksRef.current.push(event.data)
      }
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop())
        const blob = new Blob(micCheckChunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setMicCheckAudioUrl(url)
        setMicCheckStatus('playing')
        const audio = new Audio(url)
        audio.onended = () => setMicCheckStatus('success')
        audio.onerror = () => setMicCheckStatus('error')
        audio.play().catch(() => setMicCheckStatus('success'))
      }
      recorder.start()
      setTimeout(() => {
        if (micCheckRecorderRef.current?.state === 'recording') {
          micCheckRecorderRef.current.stop()
        }
      }, 3000)
    } catch {
      setMicCheckStatus('error')
    }
  }

  const resetMicCheck = () => {
    setMicCheckStatus('idle')
    if (micCheckAudioUrl) {
      URL.revokeObjectURL(micCheckAudioUrl)
      setMicCheckAudioUrl(null)
    }
  }

  const toggleExamPause = () => {
    if (isExamPaused) {
      setIsExamPaused(false)
      if (pauseIntervalRef.current) {
        window.clearInterval(pauseIntervalRef.current)
        pauseIntervalRef.current = null
      }
    } else {
      setIsExamPaused(true)
      setPauseTimeRemaining(120)
      pauseIntervalRef.current = window.setInterval(() => {
        setPauseTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsExamPaused(false)
            if (pauseIntervalRef.current) {
              window.clearInterval(pauseIntervalRef.current)
              pauseIntervalRef.current = null
            }
            return 120
          }
          return prev - 1
        })
      }, 1000)
    }
  }

  const playLowTimeWarning = () => {
    type WindowWithWebkit = Window & typeof globalThis & {
      webkitAudioContext?: typeof AudioContext
    }
    const win = window as WindowWithWebkit
    const AudioContextClass = win.AudioContext || win.webkitAudioContext
    if (!AudioContextClass) return
    const ctx = new AudioContextClass()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 880
    osc.type = 'sine'
    gain.gain.value = 0.15
    osc.start()
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
    osc.stop(ctx.currentTime + 0.3)
  }

  const startAttempt = () => {
    resetMicCheck()
    setIsExamPaused(false)
    setPauseTimeRemaining(120)
    resetPart2TimerDelay()
    setRemainingPrepSeconds(prepSeconds)
    setRemainingTalkSeconds(talkSeconds)
    setAttemptStage('prep')
    setAssessmentResult(null)
    setAssessmentError('')
    setAssessmentProgress(0)
    setAssessmentProgressTarget(0)
    assessmentStartedAtRef.current = null
    setTranscript('')
    setInterimTranscript('')
    setTranscriptionError('')
    setAudioError('')
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
      setAudioUrl('')
    }
    latestAudioBlobRef.current = null
    setCurrentQuestionIndex(0)
    setRemainingQuestionSeconds(75)
    setFullExamPhase('part1')
    setFullExamPart1Index(0)
    setFullExamPart3Index(0)
    setFullExamPhaseSeconds(75)
    setFullExamAnnouncement('')
    setIsPromptTtsPlaying(false)
    clearQuestionCountdown()
    if (fullExamAnnouncementTimeoutRef.current) {
      window.clearTimeout(fullExamAnnouncementTimeoutRef.current)
      fullExamAnnouncementTimeoutRef.current = null
    }
    setPrepNotePart2('')
    setQuestionPrepNotes({})
    questionResponsesRef.current = []
    questionStartCharIndexRef.current = 0
    stopPromptAudioPlayback()
  }

  const beginSpeakingStage = async () => {
    const apiReady = await checkAssessmentApiReady()
    if (!apiReady) {
      setAudioError('Assessment server is offline right now. Please wait a moment and try again.')
      return
    }
    if (prepIntervalRef.current) {
      window.clearInterval(prepIntervalRef.current)
      prepIntervalRef.current = null
    }
    setAttemptStage('speaking')
    setRemainingTalkSeconds(talkSeconds)
    if (selectedTestMode === 'part2' && !isFullExamMode) {
      armPart2TimerDelay()
    } else {
      resetPart2TimerDelay()
    }
    setRemainingQuestionSeconds(75)
    setCurrentQuestionIndex(0)
    setFullExamPhase('part1')
    setFullExamPart1Index(0)
    setFullExamPart3Index(0)
    setFullExamPhaseSeconds(75)
    if (isFullExamMode) {
      showFullExamAnnouncement('Part 1 is starting', 1800)
    }
    questionResponsesRef.current = []
    questionStartCharIndexRef.current = 0
    setRecordingDuration(0)
    const recordingStarted = await startAudioRecording()
    if (!recordingStarted) {
      setAttemptStage('prep')
      return
    }
    startTranscription()
    if (isFullExamMode) {
      await runPromptThenCountdown('Part 1 - Question 1', fullExamPlan.part1Questions[0] || 'Part 1 question 1')
    } else if (isQuestionByQuestionMode) {
      await runPromptThenCountdown(
        `Question 1 of ${activeQuestionList.length}`,
        activeQuestionList[0] || activeTopic?.prompt || 'Question 1'
      )
    } else {
      await runPromptThenCountdown(
        SPEAKING_MODE_LABELS[selectedTestMode],
        activeTopic?.prompt || 'Speaking prompt'
      )
    }
  }

  const captureCurrentQuestionResponse = () => {
    if (!isQuestionByQuestionMode || !activeQuestion) return
    const fullTranscript = transcript.trim()
    const start = Math.max(0, questionStartCharIndexRef.current)
    const responseSlice = fullTranscript.slice(start).trim()
    const nextQuestion = activeQuestion
    const next = [...questionResponsesRef.current]
    next[currentQuestionIndex] = { question: nextQuestion, response: responseSlice }
    questionResponsesRef.current = next
    questionStartCharIndexRef.current = fullTranscript.length
  }

  const captureFullExamQuestionResponse = (question: string) => {
    if (!isFullExamMode || !question) return
    const fullTranscript = transcript.trim()
    const start = Math.max(0, questionStartCharIndexRef.current)
    const responseSlice = fullTranscript.slice(start).trim()
    const next = [...questionResponsesRef.current]
    const part1Count = fullExamPlan.part1Questions.length
    const targetIndex =
      fullExamPhase === 'part1'
        ? fullExamPart1Index
        : fullExamPhase === 'part2_speaking'
          ? part1Count
          : fullExamPhase === 'part3'
            ? part1Count + 1 + fullExamPart3Index
            : next.length
    next[targetIndex] = { question, response: responseSlice }
    questionResponsesRef.current = next
    questionStartCharIndexRef.current = fullTranscript.length
  }

  const advanceFullExamFlow = async () => {
    if (!isFullExamMode) return
    if (fullExamPhase === 'part1') {
      captureFullExamQuestionResponse(fullExamPlan.part1Questions[fullExamPart1Index] || '')
      if (fullExamPart1Index < fullExamPlan.part1Questions.length - 1) {
        const nextIndex = fullExamPart1Index + 1
        setFullExamPart1Index(nextIndex)
        setFullExamPhaseSeconds(75)
        await runPromptThenCountdown(
          `Part 1 - Question ${nextIndex + 1}`,
          fullExamPlan.part1Questions[nextIndex] || `Part 1 question ${nextIndex + 1}`
        )
        return
      }
      showFullExamAnnouncement('Part 1 complete. Part 2 note prep is starting.', 2400)
      setFullExamPhase('part2_prep')
      setFullExamPhaseSeconds(60)
      startQuestionCountdown('Part 2 - Note Prep')
      return
    }
    if (fullExamPhase === 'part2_prep') {
      setFullExamPhase('part2_speaking')
      setFullExamPhaseSeconds(120)
      armPart2TimerDelay()
      questionStartCharIndexRef.current = transcript.trim().length
      showFullExamAnnouncement('Part 2 speaking starts now.', 1800)
      await runPromptThenCountdown('Part 2 - Speak for 2 minutes', fullExamPlan.part2Prompt || 'Part 2 prompt')
      return
    }
    if (fullExamPhase === 'part2_speaking') {
      captureFullExamQuestionResponse(fullExamPlan.part2Prompt || 'Part 2')
      showFullExamAnnouncement('Part 2 complete. Take a short rest before Part 3.', 2400)
      setFullExamPhase('rest')
      setFullExamPhaseSeconds(30)
      startQuestionCountdown('พักสักครู่ :)')
      return
    }
    if (fullExamPhase === 'rest') {
      setFullExamPhase('part3')
      setFullExamPart3Index(0)
      setFullExamPhaseSeconds(90)
      showFullExamAnnouncement('Part 3 is starting.', 2200)
      questionStartCharIndexRef.current = transcript.trim().length
      await runPromptThenCountdown('Part 3 - Question 1', fullExamPlan.part3Questions[0] || 'Part 3 question 1')
      return
    }
    captureFullExamQuestionResponse(fullExamPlan.part3Questions[fullExamPart3Index] || '')
    if (fullExamPart3Index < fullExamPlan.part3Questions.length - 1) {
      const nextIndex = fullExamPart3Index + 1
      setFullExamPart3Index(nextIndex)
      setFullExamPhaseSeconds(90)
      await runPromptThenCountdown(
        `Part 3 - Question ${nextIndex + 1}`,
        fullExamPlan.part3Questions[nextIndex] || `Part 3 question ${nextIndex + 1}`
      )
      return
    }
    await finishSpeakingAndAssess()
  }

  const skipPreparation = async () => {
    if ('speechSynthesis' in window && !ttsPrimedRef.current) {
      try {
        // Unlock speech synthesis for browsers that block until the first user-gesture call.
        const unlockUtterance = new SpeechSynthesisUtterance('test')
        unlockUtterance.volume = 0.01
        unlockUtterance.rate = 1
        unlockUtterance.lang = 'en-US'
        window.speechSynthesis.speak(unlockUtterance)
        window.setTimeout(() => {
          if ('speechSynthesis' in window) window.speechSynthesis.cancel()
        }, 900)
        ttsPrimedRef.current = true
      } catch {
        // noop: continue without priming
      }
    }

    // Speak the first prompt right here (user click gesture) so TTS reliably works.
    let shouldSkipImmediateReplay = false
    try {
      let initialPromptText = ''
      if (isFullExamMode) {
        initialPromptText = fullExamPlan.part1Questions[0] || 'Part 1 question 1'
      } else if (isQuestionByQuestionMode) {
        initialPromptText = activeQuestionList[0] || activeTopic?.prompt || ''
      } else {
        initialPromptText = activeTopic?.prompt || ''
      }

      if (initialPromptText) {
        setIsPromptTtsPlaying(true)
        await speakPrompt(initialPromptText)
        shouldSkipImmediateReplay = true
      }
    } catch {
      // ignore TTS failures; countdown should still work.
    } finally {
      setIsPromptTtsPlaying(false)
    }

    skipNextPromptTtsRef.current = shouldSkipImmediateReplay
    await beginSpeakingStage()
  }

  const speakPromptWithBrowserTts = async (text: string) => {
    const content = String(text || '').trim()
    if (!content) return false
    if (!('speechSynthesis' in window)) return false
    const synth = window.speechSynthesis
    const voices = synth.getVoices()
    const englishVoice =
      voices.find((voice) => /^en[-_]/i.test(voice.lang)) ??
      voices.find((voice) => /en/i.test(voice.lang)) ??
      null

    const maxMs = Math.min(12000, Math.max(3000, content.length * 38))

    return new Promise<boolean>((resolve) => {
      const utterance = new SpeechSynthesisUtterance(content)
      utterance.rate = 1
      utterance.pitch = 1
      utterance.lang = englishVoice?.lang || 'en-US'
      if (englishVoice) utterance.voice = englishVoice

      let resolved = false
      let started = false
      const finalize = (didStart = started) => {
        if (resolved) return
        resolved = true
        resolve(didStart)
      }

      utterance.onstart = () => {
        started = true
      }
      utterance.onend = () => finalize(true)
      utterance.onerror = () => finalize(false)
      // Make sure we never hang forever (some browsers don't fire onend reliably).
      window.setTimeout(() => finalize(started), maxMs)

      // Cancel only right before speaking to avoid killing a just-started utterance.
      synth.cancel()
      synth.speak(utterance)
    })
  }

  const speakPrompt = async (text: string) => {
    const content = String(text || '').trim()
    if (!content) return

    const browserTtsWorked = await speakPromptWithBrowserTts(content).catch(() => false)
    if (browserTtsWorked) return

    await playPromptWithServerTts(content)
  }

  const runPromptThenCountdown = async (label: string, promptText: string) => {
    if (skipNextPromptTtsRef.current) {
      // First prompt is already spoken in the click handler (user gesture).
      skipNextPromptTtsRef.current = false
      startQuestionCountdown(label)
      return
    }
    await speakPromptWithTtsAndManageTranscription(promptText)
    startQuestionCountdown(label)
  }

  const showFullExamAnnouncement = (message: string, holdMs = 2200) => {
    if (fullExamAnnouncementTimeoutRef.current) {
      window.clearTimeout(fullExamAnnouncementTimeoutRef.current)
      fullExamAnnouncementTimeoutRef.current = null
    }
    setFullExamAnnouncement(message)
    fullExamAnnouncementTimeoutRef.current = window.setTimeout(() => {
      setFullExamAnnouncement('')
      fullExamAnnouncementTimeoutRef.current = null
    }, holdMs)
  }

  const playCountdownBeep = (count: number) => {
    try {
      const AudioContextClass = (window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext) as
        | typeof AudioContext
        | undefined
      if (!AudioContextClass) return
      const audioContext = new AudioContextClass()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      oscillator.type = 'sine'
      oscillator.frequency.value = count <= 1 ? 920 : count === 2 ? 820 : 720
      gainNode.gain.value = 0.0001
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      const now = audioContext.currentTime
      gainNode.gain.exponentialRampToValueAtTime(0.09, now + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.18)
      oscillator.start(now)
      oscillator.stop(now + 0.19)
      oscillator.onended = () => {
        void audioContext.close()
      }
    } catch {
      // Ignore audio playback failures on restricted browsers.
    }
  }

  const startQuestionCountdown = (label: string) => {
    clearQuestionCountdown()
    setQuestionCountdownLabel(label)
    setQuestionCountdown(3)
    playCountdownBeep(3)
    questionCountdownIntervalRef.current = window.setInterval(() => {
      setQuestionCountdown((current) => {
        if (current === null) return null
        if (current <= 1) {
          if (questionCountdownIntervalRef.current) {
            window.clearInterval(questionCountdownIntervalRef.current)
            questionCountdownIntervalRef.current = null
          }
          window.setTimeout(() => {
            setQuestionCountdown(null)
            setQuestionCountdownLabel('')
          }, 220)
          return 0
        }
        const next = current - 1
        if (next > 0) playCountdownBeep(next)
        return next
      })
    }, 900)
  }

  const checkAssessmentApiReady = async () => {
    try {
      const response = await fetch('/api/health')
      return response.ok
    } catch {
      return false
    }
  }

  const shouldUseDirectAssessmentFlow = () => {
    if (typeof window === 'undefined') return import.meta.env.PROD
    const host = window.location.hostname.toLowerCase()
    return import.meta.env.PROD || !['127.0.0.1', 'localhost'].includes(host)
  }

  const runAssessmentRequest = async (
    _audioBlob: Blob | null,
    durationSeconds: number,
    options?: {
      forcedTranscript?: string
      forcedTopic?: string
      forcedPrompt?: string
      forcedCues?: string[]
      forcedQuestionResponses?: Array<{ question: string; response: string }>
      scoreKeyMode?: SpeakingTestMode
    }
  ) => {
    const effectiveMode = options?.scoreKeyMode || selectedTestMode
    const apiReady = await checkAssessmentApiReady()
    if (!apiReady) {
      throw new Error('Assessment API is offline. Please retry in a few seconds.')
    }
    if (!authSession?.accessToken) {
      throw new Error('Please sign in before starting an assessment.')
    }

    setAttemptStage('assessing')
    setAssessmentProgress(1)
    setAssessmentProgressTarget(1)
    assessmentStartedAtRef.current = window.performance.now()
    setLoadingPhraseCursor(0)
    setAssessmentRuntimeMessages(['Loading Analysis Messages'])
    setIsFullMockAssessmentLoading(effectiveMode === 'full')
    setAssessmentCountdownSeconds(effectiveMode === 'full' ? 300 : 0)
    setAssessmentError('')

    try {
      const forcedTranscript = String(options?.forcedTranscript || '').trim()
      const effectiveQuestionResponses = Array.isArray(options?.forcedQuestionResponses)
        ? options?.forcedQuestionResponses
        : questionResponsesRef.current
      const questionTranscript = effectiveQuestionResponses
        .map((item) => String(item?.response || '').trim())
        .filter(Boolean)
        .join(' ')
      const browserTranscript = forcedTranscript || transcript.trim() || interimTranscript.trim() || questionTranscript
      if (!browserTranscript) {
        throw new Error('No spoken text detected yet. Please speak for a few seconds, then try again.')
      }
      const assessmentRequestBody = {
        topic: options?.forcedTopic || activeTopic?.title,
        prompt: options?.forcedPrompt || activeTopic?.prompt,
        cues: options?.forcedCues ?? activeTopic?.cues ?? [],
        testMode: effectiveMode,
        transcript: browserTranscript,
        questionResponses: effectiveQuestionResponses.filter(
          (item) => String(item?.response || '').trim().length > 0
        ),
        assessmentMode: effectiveMode === 'full' ? 'fullMock' : 'standard',
        durationSeconds: Math.max(0, Math.round(durationSeconds)),
        audioBase64: null,
        audioMimeType: null
      }
      const useDirectAssessmentFlow = shouldUseDirectAssessmentFlow()

      if (useDirectAssessmentFlow) {
        setAssessmentRuntimeMessages([
          'กำลังตรวจ transcript และจัดรูปประโยคสำหรับการประเมิน',
          'กำลังประเมิน Grammar, Vocabulary และ Fluency ด้วย direct assessment flow',
          'Vercel mode: ระบบจะสร้าง report ครบในคำขอนี้โดยตรง'
        ])
        const directResponse = await fetch('/api/assess', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
          },
          body: JSON.stringify(assessmentRequestBody)
        })
        if (!directResponse.ok) {
          const errorPayload = await directResponse.json().catch(() => null)
          const rawText = errorPayload ? '' : await directResponse.text().catch(() => '')
          const details = Array.isArray(errorPayload?.details)
            ? ` Details: ${errorPayload.details.join(' | ')}`
            : ''
          const message = errorPayload
            ? typeof errorPayload.error === 'string'
              ? errorPayload.error
              : errorPayload?.error?.message || errorPayload?.message || `Assessment request failed (${directResponse.status}).`
            : rawText || `Assessment request failed (${directResponse.status} ${directResponse.statusText}).`
          throw new Error(`${message}${details}`)
        }
        const directResult = (await directResponse.json()) as AssessmentResult
        try {
          const mePayload = await fetchJson<AuthApiResponse>('/api/auth/me', {
            headers: getAuthHeaders()
          })
          setCreditProfile(mePayload.creditProfile)
          setAuthSession((current) => (current ? { ...current, ...mePayload.session } : current))
        } catch {
          // Keep the current UI state if the post-assessment profile refresh fails.
        }
        setIsFullMockAssessmentLoading(false)
        setAssessmentCountdownSeconds(0)
        setAssessmentResult(directResult)
        setActivePage('workspace')
        setLatestScoresByTest((current) => ({
          ...current,
          [`${effectiveMode}:${selectedTopicId}`]: Number(
            (directResult.totalScore ?? directResult.overallBand ?? 0).toFixed(1)
          )
        }))
        setSelectedProvider(directResult.primaryProvider ?? 'gemini')
        setAssessmentProgress(100)
        setAssessmentProgressTarget(100)
        setAttemptStage('result')
        return
      }

      const response = await fetch('/api/assess/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(assessmentRequestBody)
      })

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null)
        const rawText = errorPayload ? '' : await response.text().catch(() => '')
        const details = Array.isArray(errorPayload?.details)
          ? ` Details: ${errorPayload.details.join(' | ')}`
          : ''
        const message = errorPayload
          ? typeof errorPayload.error === 'string'
            ? errorPayload.error
            : errorPayload?.error?.message || errorPayload?.message || `Assessment request failed (${response.status}).`
          : rawText || `Assessment request failed (${response.status} ${response.statusText}).`
        throw new Error(`${message}${details}`)
      }

      const startPayload = (await response.json()) as { jobId?: string }
      if (!startPayload.jobId) {
        throw new Error('Assessment job failed to start.')
      }
      try {
        const mePayload = await fetchJson<AuthApiResponse>('/api/auth/me', {
          headers: getAuthHeaders()
        })
        setCreditProfile(mePayload.creditProfile)
        setAuthSession((current) => (current ? { ...current, ...mePayload.session } : current))
      } catch {
        // Keep the current UI state if the post-start profile refresh fails.
      }

      await new Promise<void>((resolve, reject) => {
        let consecutiveStatusFailures = 0
        const scoreMode = effectiveMode
        let attemptedNetworkRecovery = false

        const clearPoll = () => {
          if (assessPollRef.current) {
            window.clearTimeout(assessPollRef.current)
            assessPollRef.current = null
          }
        }

        const scheduleNextPoll = (delayMs = 900) => {
          assessPollRef.current = window.setTimeout(() => {
            void pollStatus()
          }, delayMs)
        }

        const completeAssessment = (completedResult: AssessmentResult) => {
          clearPoll()
          setIsFullMockAssessmentLoading(false)
          setAssessmentCountdownSeconds(0)
          setAssessmentResult(completedResult)
          setActivePage('workspace')
          setLatestScoresByTest((current) => ({
            ...current,
            [`${scoreMode}:${selectedTopicId}`]: Number(
              (completedResult.totalScore ?? completedResult.overallBand ?? 0).toFixed(1)
            )
          }))
          setSelectedProvider(completedResult.primaryProvider ?? 'gemini')
          setAssessmentProgress(100)
          setAssessmentProgressTarget(100)
          setAttemptStage('result')
          resolve()
        }

        const runDirectAssessmentFallback = async () => {
          setAssessmentRuntimeMessages((current) => [
            ...current,
            'Status job disappeared. Recovering your report directly from the saved transcript...'
          ])
          const directResponse = await fetch('/api/assess', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...getAuthHeaders()
            },
            body: JSON.stringify(assessmentRequestBody)
          })
          if (!directResponse.ok) {
            const directError = await directResponse.text().catch(() => '')
            throw new Error(directError || `Direct assessment failed (${directResponse.status}).`)
          }
          const directResult = (await directResponse.json()) as AssessmentResult
          completeAssessment(directResult)
        }

        const runNetworkRecoveryFallback = async () => {
          attemptedNetworkRecovery = true
          setAssessmentRuntimeMessages((current) => [
            ...current,
            'Connection to the assessment status service was interrupted. Recovering your report from the saved transcript...'
          ])
          await runDirectAssessmentFallback()
        }

        const pollStatus = async () => {
          try {
            const statusResponse = await fetch(`/api/assess/status/${startPayload.jobId}`, {
              headers: getAuthHeaders()
            })
            if (!statusResponse.ok) {
              const errorBody = await statusResponse.text().catch(() => '')
              if (statusResponse.status === 404 && errorBody.toLowerCase().includes('assessment job not found')) {
                await runDirectAssessmentFallback()
                return
              }
              throw new Error(errorBody || `Assessment status returned ${statusResponse.status}.`)
            }
            consecutiveStatusFailures = 0
            const statusPayload = (await statusResponse.json()) as {
              status: 'processing' | 'completed' | 'failed'
              progress?: number
              message?: string
              messages?: string[]
              result?: AssessmentResult
              error?: string
            }
            setAssessmentProgressTarget((current) => Math.max(current, Number(statusPayload.progress || 1)))
            if (Array.isArray(statusPayload.messages) && statusPayload.messages.length > 0) {
              setAssessmentRuntimeMessages(statusPayload.messages)
            } else if (statusPayload.message) {
              setAssessmentRuntimeMessages((current) => {
                const incoming = statusPayload.message || ''
                if (!incoming) return current
                if (current[current.length - 1] === incoming) return current
                return [...current, incoming]
              })
            }

            if (statusPayload.status === 'completed' && statusPayload.result) {
              completeAssessment(statusPayload.result)
              return
            }

            if (statusPayload.status === 'failed') {
              clearPoll()
              setIsFullMockAssessmentLoading(false)
              setAssessmentCountdownSeconds(0)
              reject(new Error(statusPayload.error || 'Assessment job failed.'))
              return
            }

            scheduleNextPoll()
          } catch (error) {
            consecutiveStatusFailures += 1
            if (consecutiveStatusFailures < 8) {
              scheduleNextPoll(1200)
              return
            }
            if (!attemptedNetworkRecovery) {
              try {
                await runNetworkRecoveryFallback()
                return
              } catch (recoveryError) {
                clearPoll()
                const recoveryMessage =
                  recoveryError instanceof Error ? recoveryError.message : 'Could not recover assessment.'
                reject(new Error(`Could not fetch assessment status. ${recoveryMessage}`.trim()))
                return
              }
            }
            clearPoll()
            const message = error instanceof Error ? error.message : 'Could not fetch assessment status.'
            reject(new Error(`Could not fetch assessment status. ${message}`.trim()))
          }
        }

        scheduleNextPoll(900)
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown assessment error'
      setIsFullMockAssessmentLoading(false)
      setAssessmentCountdownSeconds(0)
      setAssessmentError(`Assessment failed: ${message}`)
      setAssessmentProgress(100)
      setAssessmentProgressTarget(100)
      setAttemptStage('result')
    }
  }

  const finishSpeakingAndAssess = async () => {
    const prepared = await prepareAssessmentSubmission()
    await startPreparedAssessment(prepared)
  }

  const doneCurrentQuestion = async () => {
    if (!isQuestionByQuestionMode) return
    captureCurrentQuestionResponse()
    if (currentQuestionIndex >= activeQuestionList.length - 1) {
      await finishSpeakingAndAssess()
      return
    }
    const nextIndex = currentQuestionIndex + 1
    setCurrentQuestionIndex(nextIndex)
    setRemainingQuestionSeconds(75)
    await runPromptThenCountdown(
      `Question ${nextIndex + 1} of ${activeQuestionList.length}`,
      activeQuestionList[nextIndex] || `Question ${nextIndex + 1}`
    )
  }

  const doneCurrentFullExamPhase = async () => {
    if (!isFullExamMode) return
    await advanceFullExamFlow()
  }

  const buildFullMockQuestionResponsesFromText = (
    text: string,
    plan: { part1Questions: string[]; part2Prompt: string; part3Questions: string[] }
  ) => {
    const blocks = text
      .split(/\n\s*\n/)
      .map((item) => item.trim())
      .filter(Boolean)

    const orderedQuestions = [...plan.part1Questions, plan.part2Prompt, ...plan.part3Questions].filter(Boolean)
    if (blocks.length <= 1) {
      return orderedQuestions.length
        ? [{ question: 'Full Mock Combined Response', response: text.trim() }]
        : []
    }

    return orderedQuestions.map((question, index) => ({
      question,
      response: blocks[index] || ''
    }))
  }

  const joinScriptReviewItems = (items: ScriptReviewItem[]) =>
    items
      .map((item) => String(item.response || '').trim())
      .filter(Boolean)
      .join('\n\n')

  const buildCurrentScriptReviewItems = (): ScriptReviewItem[] => {
    if (isQuestionByQuestionMode) {
      return activeQuestionList.map((question, index) => ({
        question,
        response: String(questionResponsesRef.current[index]?.response || '').trim()
      }))
    }

    if (isFullExamMode) {
      const orderedQuestions = [...fullExamPlan.part1Questions, fullExamPlan.part2Prompt, ...fullExamPlan.part3Questions].filter(Boolean)
      return orderedQuestions.map((question, index) => ({
        question,
        response: String(questionResponsesRef.current[index]?.response || '').trim()
      }))
    }

    return [
      {
        question: activeTopic?.prompt || 'Speaking response',
        response: transcript.trim()
      }
    ]
  }

  const buildScriptReviewTitle = () => {
    if (isFullExamMode) return 'Full Mock Script Review'
    if (selectedTestMode === 'part1') return 'Part 1 Script Review'
    if (selectedTestMode === 'part2') return 'Part 2 Script Review'
    return 'Part 3 Script Review'
  }

  const prepareAssessmentSubmission = async () => {
    if (speakingIntervalRef.current) {
      window.clearInterval(speakingIntervalRef.current)
      speakingIntervalRef.current = null
    }
    stopTranscription()
    setIsPromptTtsPlaying(false)
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    stopPromptAudioPlayback()
    if (isQuestionByQuestionMode) captureCurrentQuestionResponse()
    if (isFullExamMode) {
      if (fullExamPhase === 'part1') {
        captureFullExamQuestionResponse(fullExamPlan.part1Questions[fullExamPart1Index] || '')
      } else if (fullExamPhase === 'part2_speaking') {
        captureFullExamQuestionResponse(fullExamPlan.part2Prompt || 'Part 2')
      } else if (fullExamPhase === 'part3') {
        captureFullExamQuestionResponse(fullExamPlan.part3Questions[fullExamPart3Index] || '')
      }
    }
    const audioBlob = await stopAudioRecordingAndGetBlob()
    const items = buildCurrentScriptReviewItems()
    const joinedResponses = joinScriptReviewItems(items)
    const hasTranscriptEvidence = Boolean(transcript.trim() || interimTranscript.trim() || joinedResponses)
    const durationSeconds = isFullExamMode
      ? fullExamPlan.part1Questions.length * 75 + 60 + 120 + 30 + fullExamPlan.part3Questions.length * 90
      : isQuestionByQuestionMode
        ? activeQuestionList.length * 75 -
          (remainingQuestionSeconds + (activeQuestionList.length - 1 - currentQuestionIndex) * 75)
        : talkSeconds - remainingTalkSeconds

    return {
      audioBlob,
      durationSeconds,
      items,
      hasTranscriptEvidence
    }
  }

  const startPreparedAssessment = async (
    prepared: {
      audioBlob: Blob | null
      durationSeconds: number
      items: ScriptReviewItem[]
      hasTranscriptEvidence?: boolean
    },
    overrideItems?: ScriptReviewItem[]
  ) => {
    const items = Array.isArray(overrideItems) ? overrideItems : prepared.items
    const filteredQuestionResponses = items
      .map((item) => ({
        question: String(item.question || '').trim(),
        response: String(item.response || '').trim()
      }))
      .filter((item) => item.question || item.response)
    const forcedTranscript = joinScriptReviewItems(filteredQuestionResponses)
    if (!prepared.audioBlob && !forcedTranscript && !prepared.hasTranscriptEvidence) {
      setAudioError('No spoken text was captured yet. Please speak or paste your answer before assessment.')
      setAttemptStage('speaking')
      return
    }
    await runAssessmentRequest(prepared.audioBlob, prepared.durationSeconds, {
      forcedTranscript: forcedTranscript || transcript.trim(),
      forcedQuestionResponses: filteredQuestionResponses,
      scoreKeyMode: selectedTestMode
    })
  }

  const openScriptReviewBeforeAssessment = async () => {
    const prepared = await prepareAssessmentSubmission()
    const items = prepared.items.filter((item) => item.question || item.response)
    const hasVisibleContent = items.some((item) => String(item.response || '').trim())

    if (!prepared.audioBlob && !prepared.hasTranscriptEvidence && !hasVisibleContent) {
      setAudioError('No spoken text was captured yet. Please speak or paste your answer before assessment.')
      setAttemptStage('speaking')
      return
    }

    pendingAssessmentRef.current = {
      audioBlob: prepared.audioBlob,
      durationSeconds: prepared.durationSeconds,
      items,
      scoreKeyMode: selectedTestMode
    }

    setScriptReviewModal({
      title: buildScriptReviewTitle(),
      noteThai:
        'ไม่ต้องกังวลเรื่อง punctuation นะครับ ระบบจะเติมให้อัตโนมัติตอนตรวจทีหลัง ตอนนี้เช็กแค่ spelling และคำที่เราใช้ให้โอเคก่อนก็พอ',
      items
    })
    setAttemptStage('speaking')
  }

  const closeScriptReviewModal = () => {
    pendingAssessmentRef.current = null
    setScriptReviewModal(null)
    setAttemptStage('speaking')
  }

  const confirmScriptReviewAndAssess = async () => {
    if (!scriptReviewModal) return
    const prepared = pendingAssessmentRef.current
    if (!prepared) {
      setScriptReviewModal(null)
      setAssessmentError('Could not prepare your script review. Please try again.')
      return
    }

    setScriptReviewModal(null)
    pendingAssessmentRef.current = null
    await startPreparedAssessment(prepared, scriptReviewModal.items)
  }

  const assessPastedTextNow = async (mode: SpeakingTestMode = selectedTestMode) => {
    const text = adminPasteText.trim()
    if (!text) {
      setAssessmentError('Please paste text first.')
      setAttemptStage('result')
      return
    }

    const isFullMockText = mode === 'full'
    const fullMockTopic =
      FULL_EXAM_TOPICS.find((topic) => topic.id === selectedTopicId) || FULL_EXAM_TOPICS[0] || null
    const fullMockPlan = fullMockTopic
      ? {
          part1Questions: fullMockTopic.cues.filter((item) => item.startsWith('Part 1 -')).map((item) => item.replace(/^Part\s*1\s*-\s*/i, '').trim()),
          part2Prompt: fullMockTopic.prompt,
          part3Questions: fullMockTopic.cues.filter((item) => item.startsWith('Part 3 -')).map((item) => item.replace(/^Part\s*3\s*-\s*/i, '').trim())
        }
      : { part1Questions: [], part2Prompt: '', part3Questions: [] }

    if (isFullMockText && fullMockTopic) {
      setSelectedTestMode('full')
      setSelectedTopicId(fullMockTopic.id)
    }
    setActivePage('workspace')
    setTranscript(text)
    const forcedQuestionResponses = isFullMockText
      ? buildFullMockQuestionResponsesFromText(text, fullMockPlan)
      : []
    questionResponsesRef.current = forcedQuestionResponses
    await runAssessmentRequest(
      null,
      isFullMockText
        ? fullMockPlan.part1Questions.length * 75 + 60 + 120 + 30 + fullMockPlan.part3Questions.length * 90
        : talkSeconds,
      {
        forcedTranscript: text,
        forcedTopic: isFullMockText ? fullMockTopic?.title : activeTopic?.title,
        forcedPrompt: isFullMockText ? fullMockTopic?.prompt : activeTopic?.prompt,
        forcedCues: isFullMockText ? fullMockTopic?.cues : activeTopic?.cues ?? [],
        forcedQuestionResponses,
        scoreKeyMode: mode
      }
    )
  }

  const loadAdminFullMockSample = () => {
    const topic = FULL_EXAM_TOPICS.find((item) => item.id === selectedTopicId) || FULL_EXAM_TOPICS[0]
    if (!topic) return
    setSelectedTestMode('full')
    setSelectedTopicId(topic.id)
    setAdminPasteText(buildAdminFullMockSampleText(topic))
    setAssessmentError('')
    setAttemptStage('idle')
  }

  const runAdminFullMockSample = async () => {
    const topic = FULL_EXAM_TOPICS.find((item) => item.id === selectedTopicId) || FULL_EXAM_TOPICS[0]
    if (!topic) return
    const sampleText = buildAdminFullMockSampleText(topic)
    showFullExamAnnouncement('Running demo full mock sample...', 2400)
    setAdminPasteText(sampleText)
    setSelectedTestMode('full')
    setSelectedTopicId(topic.id)
    setActivePage('workspace')
    setAssessmentError('')
    setTranscript(sampleText)
    await runAssessmentRequest(
      null,
      15 * 60,
      {
        forcedTranscript: sampleText,
        forcedTopic: topic.title,
        forcedPrompt: topic.prompt,
        forcedCues: topic.cues,
        forcedQuestionResponses: buildFullMockQuestionResponsesFromText(sampleText, {
          part1Questions: topic.cues.filter((item) => item.startsWith('Part 1 -')).map((item) => item.replace(/^Part\s*1\s*-\s*/i, '').trim()),
          part2Prompt: topic.prompt,
          part3Questions: topic.cues.filter((item) => item.startsWith('Part 3 -')).map((item) => item.replace(/^Part\s*3\s*-\s*/i, '').trim())
        }),
        scoreKeyMode: 'full'
      }
    )
  }


  useEffect(() => {
    setRemainingPrepSeconds(prepSeconds)
  }, [prepSeconds])

  useEffect(() => {
    setRemainingTalkSeconds(talkSeconds)
  }, [talkSeconds])

  useEffect(() => {
    if (attemptStage !== 'prep') {
      if (prepIntervalRef.current) {
        window.clearInterval(prepIntervalRef.current)
        prepIntervalRef.current = null
      }
      return
    }

    prepIntervalRef.current = window.setInterval(() => {
      setRemainingPrepSeconds((seconds) => Math.max(0, seconds - 1))
    }, 1000)

    return () => {
      if (prepIntervalRef.current) {
        window.clearInterval(prepIntervalRef.current)
        prepIntervalRef.current = null
      }
    }
  }, [attemptStage, talkSeconds])

  useEffect(() => {
    if (attemptStage !== 'speaking') {
      if (speakingIntervalRef.current) {
        window.clearInterval(speakingIntervalRef.current)
        speakingIntervalRef.current = null
      }
      return
    }

    speakingIntervalRef.current = window.setInterval(() => {
      if (questionCountdown !== null || isPromptTtsPlaying || isExamPaused) return
      const isStandalonePart2 = !isFullExamMode && selectedTestMode === 'part2'
      const isFullMockPart2 = isFullExamMode && fullExamPhase === 'part2_speaking'
      const part2DelayUntil = part2TimerDelayUntilRef.current
      if ((isStandalonePart2 || isFullMockPart2) && part2DelayUntil && Date.now() < part2DelayUntil) return
      if (isFullExamMode) {
        setFullExamPhaseSeconds((seconds) => {
          if (seconds <= 1) {
            window.setTimeout(() => {
              if (fullExamPhase === 'part2_speaking' && promptAnswerReview()) return
              void advanceFullExamFlow()
            }, 0)
            return 0
          }
          return seconds - 1
        })
        return
      }
      if (isQuestionByQuestionMode) {
        setRemainingQuestionSeconds((seconds) => {
          if (seconds <= 1) {
            window.setTimeout(() => {
              void doneCurrentQuestion()
            }, 0)
            return 0
          }
          return seconds - 1
        })
        return
      }
      setRemainingTalkSeconds((seconds) => {
        if (seconds <= 1) {
          window.setTimeout(() => {
            if (selectedTestMode === 'part2' && promptAnswerReview()) return
            void finishSpeakingAndAssess()
          }, 0)
          return 0
        }
        return seconds - 1
      })
    }, 1000)

    return () => {
      if (speakingIntervalRef.current) {
        window.clearInterval(speakingIntervalRef.current)
        speakingIntervalRef.current = null
      }
    }
  }, [
    attemptStage,
    transcript,
    isFullExamMode,
    isQuestionByQuestionMode,
    currentQuestionIndex,
    activeQuestionList.length,
    questionCountdown,
    selectedTestMode,
    fullExamPhase,
    fullExamPart1Index,
    fullExamPart3Index,
    isPromptTtsPlaying,
    isExamPaused
  ])

  useEffect(() => {
    if (attemptStage !== 'speaking') return
    const seconds = isFullExamMode ? fullExamPhaseSeconds : isQuestionByQuestionMode ? remainingQuestionSeconds : remainingTalkSeconds
    if (seconds === 10) {
      playLowTimeWarning()
    }
  }, [attemptStage, isFullExamMode, isQuestionByQuestionMode, fullExamPhaseSeconds, remainingQuestionSeconds, remainingTalkSeconds])

  useEffect(
    () => () => {
      if (assessPollRef.current) {
        window.clearInterval(assessPollRef.current)
        assessPollRef.current = null
      }
      if (fullExamAnnouncementTimeoutRef.current) {
        window.clearTimeout(fullExamAnnouncementTimeoutRef.current)
        fullExamAnnouncementTimeoutRef.current = null
      }
      if (questionCountdownIntervalRef.current) {
        window.clearInterval(questionCountdownIntervalRef.current)
        questionCountdownIntervalRef.current = null
      }
    },
    []
  )

  useEffect(() => {
    attemptStageRef.current = attemptStage
  }, [attemptStage])

  const handleUserAuthSubmit = async () => {
    const email = normalizeEmail(userEmailInput)
    const password = userPasswordInput.trim()

    if (!email || !password) {
      setAuthError('Please enter email and password.')
      return
    }

    try {
      const payload = await fetchJson<AuthApiResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      })
      setAuthStateFromPayload(payload)
      await loadMySupportReports(payload.session.accessToken)
      setAuthNotice('')
      setUserEmailInput('')
      setUserPasswordInput('')
      setAuthError('')
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Incorrect email or password.')
    }
  }

  const handleUserSignupSubmit = async () => {
    const name = signupNameInput.trim()
    const email = normalizeEmail(signupEmailInput)
    const password = signupPasswordInput.trim()

    if (!name || !email || !password) {
      setAuthError('Please enter name, email, and password.')
      setAuthNotice('')
      return
    }

    try {
      const payload = await fetchJson<{ success?: boolean; message?: string }>('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      })
      setSignupNameInput('')
      setSignupEmailInput(email)
      setSignupPasswordInput('')
      setUserEmailInput(email)
      setUserPasswordInput('')
      setAuthError('')
      setAuthNotice(payload.message || 'Account created. Please wait for your admin to activate your access.')
    } catch (error) {
      setAuthNotice('')
      setAuthError(error instanceof Error ? error.message : 'Could not create your account.')
    }
  }

  const handleAdminLogin = async () => {
    const adminCode = adminCodeInput.trim()
    if (!adminCode) {
      setAuthError('Please enter the admin code.')
      return
    }
    try {
      const payload = await fetchJson<AuthApiResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ adminCode })
      })
      if (payload.session.role !== 'admin') {
        throw new Error('This account is not an admin.')
      }
      setAuthStateFromPayload(payload)
      setAuthNotice('')
      await loadManagedLearners(payload.session.accessToken)
      await loadAdminSupportReports(payload.session.accessToken)
      setAdminCodeInput('')
      setAuthError('')
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Incorrect admin code.')
    }
  }

  const handleLogout = () => {
    setAuthSession(null)
    setManagedLearners([])
    setMySupportReports([])
    setAdminSupportReports([])
    setActivePage('home')
    setAdminCodeInput('')
    setSignupNameInput('')
    setSignupEmailInput('')
    setSignupPasswordInput('')
    setUserPasswordInput('')
    setAuthNotice('')
    setAuthError('')
    setSupportModalOpen(false)
    setSupportMessageInput('')
    setSupportFormError('')
    setSupportFormNotice('')
    resetStudentWorkspaceState()
  }

  const updateCreditProfileName = async () => {
    if (!authSession || authSession.role !== 'student') return
    const nextName = window.prompt('Enter learner name', creditProfile.name)?.trim()
    if (!nextName) return
    try {
      const payload = await fetchJson<AuthApiResponse>('/api/me/profile', {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name: nextName })
      })
      setAuthSession((current) => (current ? { ...current, name: payload.session.name } : current))
      setCreditProfile(payload.creditProfile)
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Could not update your name.')
    }
  }

  const handleAdminCreateLearner = async () => {
    if (!authSession?.accessToken || authSession.role !== 'admin') return
    try {
      const payload = await fetchJson<{ learner: ManagedLearnerRecord }>('/api/admin/learners', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: adminLearnerNameInput,
          email: adminLearnerEmailInput,
          password: adminLearnerPasswordInput,
          role: adminLearnerRoleInput,
          status: adminLearnerStatusInput,
          startsAt: new Date().toISOString(),
          expiresAt: adminLearnerExpiresAtInput ? new Date(adminLearnerExpiresAtInput).toISOString() : null,
          feedbackCredits: adminLearnerFeedbackCreditsInput,
          fullMockCredits: adminLearnerFullMockCreditsInput
        })
      })
      setManagedLearners((current) => [payload.learner, ...current.filter((item) => item.id !== payload.learner.id)])
      setAdminLearnerNameInput('')
      setAdminLearnerEmailInput('')
      setAdminLearnerPasswordInput('')
      setAdminLearnerExpiresAtInput('')
      setAdminLearnerFeedbackCreditsInput(DEFAULT_FEEDBACK_CREDITS)
      setAdminLearnerFullMockCreditsInput(DEFAULT_FULL_MOCK_CREDITS)
      setAdminLearnerRoleInput('student')
      setAdminLearnerStatusInput('active')
      setAdminPanelMessage(`Saved access for ${payload.learner.name}.`)
      setAuthError('')
    } catch (error) {
      setAdminPanelMessage('')
      setAuthError(error instanceof Error ? error.message : 'Could not save learner access.')
    }
  }

  const handleAdminQuickUpdate = async (learner: ManagedLearnerRecord, updates: Partial<ManagedLearnerRecord> & { password?: string }) => {
    if (!authSession?.accessToken || authSession.role !== 'admin') return
    try {
      const payload = await fetchJson<{ learner: ManagedLearnerRecord }>(`/api/admin/learners/${learner.id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: updates.name ?? learner.name,
          email: updates.email ?? learner.email,
          role: updates.role ?? learner.role,
          status: updates.status ?? learner.status,
          startsAt: updates.startsAt ?? learner.startsAt,
          expiresAt: updates.expiresAt ?? learner.expiresAt,
          feedbackCredits: updates.feedbackRemaining ?? learner.feedbackRemaining,
          fullMockCredits: updates.fullMockRemaining ?? learner.fullMockRemaining,
          ...(updates.password ? { password: updates.password } : {})
        })
      })
      setManagedLearners((current) => current.map((item) => (item.id === learner.id ? payload.learner : item)))
      setAdminPanelMessage(`Updated ${payload.learner.name}.`)
      setAuthError('')
    } catch (error) {
      setAdminPanelMessage('')
      setAuthError(error instanceof Error ? error.message : 'Could not update learner.')
    }
  }

  const formatReportProviderLabel = (value: string) => {
    const raw = String(value || '').trim()
    if (!raw) return "english plan's database"
    const lower = raw.toLowerCase()
    if (lower.includes('gemini')) return "english plan's database"
    return raw
  }

  const retryTestFromCard = (topicId: string) => {
    setPendingStartTopicId(topicId)
    setSelectedExpectedScore('')
  }

  const openStartFlowForTopic = (topicId: string) => {
    setPendingStartTopicId(topicId)
    setSelectedExpectedScore('')
  }

  const closeExpectedScoreModal = () => {
    setPendingStartTopicId(null)
    setSelectedExpectedScore('')
  }

  const confirmExpectedScoreStart = () => {
    if (!pendingStartTopicId || !selectedExpectedScore) return
    setSelectedTopicId(pendingStartTopicId)
    setPendingStartTopicId(null)
    startAttempt()
  }

  const promptAnswerReview = () => {
    const question = isFullExamMode ? fullExamCurrentQuestion : activeQuestion
    if (!question) return false
    const shouldReview =
      isQuestionByQuestionMode ||
      selectedTestMode === 'part2' ||
      (isFullExamMode && (fullExamPhase === 'part1' || fullExamPhase === 'part2_speaking' || fullExamPhase === 'part3'))
    if (shouldReview) {
      setAnswerReviewModal({
        question,
        contextLabel: isFullExamMode
          ? fullExamPhase === 'part1'
            ? 'Part 1'
            : fullExamPhase === 'part2_speaking'
              ? 'Part 2'
              : 'Part 3'
          : selectedTestMode === 'part1'
            ? 'Part 1'
            : selectedTestMode === 'part2'
              ? 'Part 2'
              : 'Part 3',
        questionIndex: currentQuestionIndex,
        fullExamPhase: isFullExamMode ? fullExamPhase : null,
        fullExamPart1Index,
        fullExamPart3Index
      })
      return true
    }
    return false
  }

  const clearCurrentAnswerSectionForRetry = (snapshot?: AnswerReviewModalState | null) => {
    const currentStart = Math.max(0, questionStartCharIndexRef.current)
    setTranscript((current) => current.slice(0, currentStart).trim())
    setInterimTranscript('')
    setTranscriptionError('')

    const questionIndex = snapshot?.questionIndex ?? currentQuestionIndex
    const retryPhase = snapshot?.fullExamPhase ?? fullExamPhase
    const retryPart1Index = snapshot?.fullExamPart1Index ?? fullExamPart1Index
    const retryPart3Index = snapshot?.fullExamPart3Index ?? fullExamPart3Index

    if (isQuestionByQuestionMode) {
      const next = [...questionResponsesRef.current]
      next[questionIndex] = { question: activeQuestionList[questionIndex] || activeQuestion, response: '' }
      questionResponsesRef.current = next
      return
    }

    if (selectedTestMode === 'part2' && !isFullExamMode) {
      questionResponsesRef.current = []
      return
    }

    if (isFullExamMode && retryPhase === 'part1') {
      questionResponsesRef.current = questionResponsesRef.current.slice(0, retryPart1Index)
      return
    }

    if (isFullExamMode && retryPhase === 'part2_speaking') {
      questionResponsesRef.current = questionResponsesRef.current.slice(0, fullExamPlan.part1Questions.length)
      return
    }

    if (isFullExamMode && retryPhase === 'part3') {
      const targetLength = fullExamPlan.part1Questions.length + 1 + retryPart3Index
      questionResponsesRef.current = questionResponsesRef.current.slice(0, targetLength)
    }
  }

  const retryCurrentAnswer = async () => {
    const modalSnapshot = answerReviewModal
    const retryQuestionIndex = modalSnapshot?.questionIndex ?? currentQuestionIndex
    const retryPhase = modalSnapshot?.fullExamPhase ?? fullExamPhase
    const retryPart1Index = modalSnapshot?.fullExamPart1Index ?? fullExamPart1Index
    const retryPart3Index = modalSnapshot?.fullExamPart3Index ?? fullExamPart3Index
    if (modalSnapshot) {
      setCurrentQuestionIndex(retryQuestionIndex)
      if (modalSnapshot.fullExamPhase) {
        setFullExamPhase(retryPhase)
      }
      setFullExamPart1Index(retryPart1Index)
      setFullExamPart3Index(retryPart3Index)
    }
    clearCurrentAnswerSectionForRetry(modalSnapshot)
    if (selectedTestMode === 'part2' && !isFullExamMode) {
      setRemainingTalkSeconds(talkSeconds)
      armPart2TimerDelay()
      setAnswerReviewModal(null)
      await runPromptThenCountdown('Part 2 - Speak for 2 minutes', activeTopic?.prompt || 'Part 2 prompt')
      return
    }
    if (isQuestionByQuestionMode) {
      setAnswerReviewModal(null)
      await runPromptThenCountdown(
        `Question ${retryQuestionIndex + 1} of ${activeQuestionList.length}`,
        activeQuestionList[retryQuestionIndex] || activeQuestion || `Question ${retryQuestionIndex + 1}`
      )
      return
    }
    if (isFullExamMode && (retryPhase === 'part1' || retryPhase === 'part3')) {
      if (retryPhase === 'part1') {
        setAnswerReviewModal(null)
        await runPromptThenCountdown(
          `Part 1 - Question ${retryPart1Index + 1}`,
          fullExamPlan.part1Questions[retryPart1Index] || `Part 1 question ${retryPart1Index + 1}`
        )
        return
      }
      setAnswerReviewModal(null)
      await runPromptThenCountdown(
        `Part 3 - Question ${retryPart3Index + 1}`,
        fullExamPlan.part3Questions[retryPart3Index] || `Part 3 question ${retryPart3Index + 1}`
      )
      return
    }
    if (isFullExamMode && retryPhase === 'part2_speaking') {
      setFullExamPhaseSeconds(120)
      armPart2TimerDelay()
      setAnswerReviewModal(null)
      await runPromptThenCountdown('Part 2 - Speak for 2 minutes', fullExamPlan.part2Prompt || 'Part 2 prompt')
    }
  }

  const confirmCurrentAnswer = async () => {
    setAnswerReviewModal(null)
    if (isQuestionByQuestionMode) {
      await doneCurrentQuestion()
      return
    }
    if (isFullExamMode) {
      await doneCurrentFullExamPhase()
    }
  }

  const startReadingExam = (examId: string) => {
    const exam = filteredReadingExams.find((item) => item.id === examId) || null
    if (!exam) return
    setSelectedReadingExamId(exam.id)
    setReadingAnswers({})
    setReadingReportItems([])
    setReadingAttemptStage('exam')
    setReadingHintQuestionNumber(null)
    setReadingExamError('')
    setReadingSelectionText('')
    setReadingUserHighlights([])
    setReadingActivePassageNumber(exam.parsedPayload.passages[0]?.number || 1)
    setActivePage('reading')
  }

  const submitReadingExam = () => {
    if (!activeReadingExam) return
    const allQuestions = activeReadingPassages.flatMap((passage) => passage.questions || [])
    const results = allQuestions.map((question) => {
      const userAnswer = String(readingAnswers[question.number] || '').trim()
      return {
        ...question,
        userAnswer,
        isCorrect: normalizeReadingAnswer(userAnswer) === normalizeReadingAnswer(question.correctAnswer)
      }
    })
    setReadingReportItems(results)
    setReadingAttemptStage('report')
    setReadingHintQuestionNumber(null)
  }

  const handleReadingSelection = () => {
    const selection = window.getSelection()
    const text = String(selection?.toString() || '').trim()
    setReadingSelectionText(text)
  }

  const addReadingHighlight = () => {
    if (!activeReadingPassage || !readingSelectionText) return
    setReadingUserHighlights((current) => {
      if (current.some((item) => item.passageNumber === activeReadingPassage.number && item.text === readingSelectionText)) {
        return current
      }
      return [
        ...current,
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          passageNumber: activeReadingPassage.number,
          text: readingSelectionText
        }
      ]
    })
    setReadingSelectionText('')
    window.getSelection()?.removeAllRanges()
  }

  const removeReadingHighlight = (highlightId: string) => {
    setReadingUserHighlights((current) => current.filter((item) => item.id !== highlightId))
  }

  const renderPassageParagraphWithHighlights = (
    text: string,
    passageNumber: number,
    hintExcerpt?: string
  ) => {
    const highlights = [
      ...readingUserHighlights
        .filter((item) => item.passageNumber === passageNumber)
        .map((item) => ({ text: item.text, tone: 'user' as const })),
      ...(hintExcerpt ? [{ text: hintExcerpt, tone: 'hint' as const }] : [])
    ].filter((item) => item.text.trim().length > 0)

    if (!highlights.length) return text

    const pattern = new RegExp(`(${highlights.map((item) => escapeRegExp(item.text)).join('|')})`, 'gi')
    const parts = text.split(pattern)
    return parts.map((part, index) => {
      const found = highlights.find((item) => item.text.toLowerCase() === part.toLowerCase())
      if (!found) return <span key={`reading-text-${index}`}>{part}</span>
      return (
        <mark
          key={`reading-text-${index}`}
          className={found.tone === 'hint' ? 'readingHintMark' : 'readingUserMark'}
        >
          {part}
        </mark>
      )
    })
  }

  const renderReadingAnswerField = (question: ReadingQuestion) => {
    const value = readingAnswers[question.number] || ''
    if (question.answerType === 'true-false-not-given') {
      return (
        <select
          value={value}
          onChange={(event) => setReadingAnswers((current) => ({ ...current, [question.number]: event.target.value }))}
        >
          <option value="">Select answer</option>
          <option value="TRUE">TRUE</option>
          <option value="FALSE">FALSE</option>
          <option value="NOT GIVEN">NOT GIVEN</option>
        </select>
      )
    }
    if (question.answerType === 'yes-no-not-given') {
      return (
        <select
          value={value}
          onChange={(event) => setReadingAnswers((current) => ({ ...current, [question.number]: event.target.value }))}
        >
          <option value="">Select answer</option>
          <option value="YES">YES</option>
          <option value="NO">NO</option>
          <option value="NOT GIVEN">NOT GIVEN</option>
        </select>
      )
    }
    if (question.answerType === 'multiple-choice') {
      return (
        <select
          value={value}
          onChange={(event) => setReadingAnswers((current) => ({ ...current, [question.number]: event.target.value }))}
        >
          <option value="">Select answer</option>
          {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((choice) => (
            <option key={choice} value={choice}>
              {choice}
            </option>
          ))}
        </select>
      )
    }
    return (
      <input
        type="text"
        value={value}
        onChange={(event) => setReadingAnswers((current) => ({ ...current, [question.number]: event.target.value }))}
        placeholder="Type your answer"
      />
    )
  }

  const openSavedReportSnapshot = (snapshot: SavedReportSnapshot) => {
    setReportViewSnapshot(snapshot)
    setSelectedTestMode(snapshot.testMode)
    setSelectedProvider(snapshot.selectedProvider || 'gemini')
    setAssessmentResult(snapshot.report)
    setAssessmentError('')
    setAttemptStage('result')
    setActivePage('workspace')
  }

  return (
    <main className="workspace">
      {activePage !== 'home' && <header className="topbar">
        <div>
          <h1>ENGLISH PLAN LEARNING SPACE</h1>
          <p>
            {authSession?.role === 'admin'
              ? 'Admin control for learner access, credits, topics, and speaking flow'
              : `Signed in as ${authSession?.name || creditProfile.name}`}
          </p>
        </div>
        <div className="headerActions">
          <div className="pageSwitch">
            <button
              className=""
              onClick={() => setActivePage('home')}
              type="button"
            >
              Home
            </button>
            <button
              className={activePage === 'workspace' ? 'active' : ''}
              onClick={() => {
                resetSession()
                setSelectedTestMode('part1')
                setActivePage('workspace')
              }}
              type="button"
            >
              Speaking
            </button>
            <button
              className={activePage === 'reading' ? 'active' : ''}
              onClick={() => {
                if (isStudentViewLockedToSpeaking) return
                setActivePage('reading')
              }}
              type="button"
              disabled={isStudentViewLockedToSpeaking}
            >
              {isStudentViewLockedToSpeaking ? 'Reading (Coming Soon)' : 'Reading'}
            </button>
            <button
              className={activePage === 'notebook' ? 'active' : ''}
              onClick={() => {
                if (isStudentViewLockedToSpeaking) return
                setActivePage('notebook')
              }}
              type="button"
              disabled={isStudentViewLockedToSpeaking}
            >
              {isStudentViewLockedToSpeaking ? 'Notebook (Coming Soon)' : 'Notebook'}
            </button>
            {authSession?.role === 'admin' && (
              <button
                className={activePage === 'admin' ? 'active' : ''}
                onClick={() => setActivePage('admin')}
                type="button"
              >
                Admin
              </button>
            )}
          </div>
          <div className="metaChip">
            {authSession?.role === 'admin'
              ? `Admin Mode | Learners: ${managedLearners.length} | Open Issues: ${openSupportReportCount}`
              : `Name: ${creditProfile.name} | Plan: ${creditProfile.plan} | Feedback: ${creditProfile.feedbackRemaining} | Full Mock: ${creditProfile.fullMockRemaining}`}
          </div>
          {authSession?.role === 'student' && (
            <button type="button" className="secondary" onClick={updateCreditProfileName}>
              Edit Name
            </button>
          )}
          <button type="button" className="secondary" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </header>}

      {activePage === 'home' ? (
        <section className="homePage">
          <div className="homeCard">
            <h1>ENGLISH PLAN LEARNING SPACE</h1>
            <p>
              {authSession
                ? `Welcome back, ${authSession.name}.`
                : 'Sign in with the learner access your admin created for you.'}
            </p>
            {authSession ? (
              <div className="homeGrid">
                <button
                  type="button"
                  onClick={() => {
                    resetSession()
                    setSelectedTestMode('part1')
                    setActivePage('workspace')
                  }}
                >
                  Speaking
                </button>
                <button type="button" disabled>
                  Listening (Coming Soon)
                </button>
                <button type="button" disabled>
                  Reading (Coming Soon)
                </button>
                <button type="button" disabled>
                  Writing (Coming Soon)
                </button>
                <button type="button" disabled>
                  Notebook (Coming Soon)
                </button>
                {authSession.role === 'admin' ? (
                  <button
                    type="button"
                    onClick={() => {
                      setActivePage('admin')
                    }}
                  >
                    Admin Panel
                  </button>
                ) : null}
                <button type="button" onClick={handleLogout}>
                  Log Out
                </button>
              </div>
            ) : (
              <div className="authHub">
                <section className="authPanel">
                  <div className="authPanelHeader">
                    <p className="sectionLabel">Create Account</p>
                  </div>
                  <p className="meta">Create your account first. Your admin will activate your access afterwards.</p>
                  <div className="authForm">
                    <label>
                      Name
                      <input
                        type="text"
                        value={signupNameInput}
                        onChange={(event) => setSignupNameInput(event.target.value)}
                        placeholder="Your full name"
                      />
                    </label>
                    <label>
                      Email
                      <input
                        type="email"
                        value={signupEmailInput}
                        onChange={(event) => setSignupEmailInput(event.target.value)}
                        placeholder="you@example.com"
                      />
                    </label>
                    <label>
                      Password
                      <input
                        type="password"
                        value={signupPasswordInput}
                        onChange={(event) => setSignupPasswordInput(event.target.value)}
                        placeholder="At least 6 characters"
                      />
                    </label>
                    <button type="button" onClick={() => void handleUserSignupSubmit()} disabled={isAuthLoading}>
                      Create Account
                    </button>
                  </div>
                </section>
                <section className="authPanel">
                  <div className="authPanelHeader">
                    <p className="sectionLabel">Learner Access</p>
                  </div>
                  <div className="authForm">
                    <label>
                      Email
                      <input
                        type="email"
                        value={userEmailInput}
                        onChange={(event) => setUserEmailInput(event.target.value)}
                      />
                    </label>
                    <label>
                      Password
                      <input
                        type="password"
                        value={userPasswordInput}
                        onChange={(event) => setUserPasswordInput(event.target.value)}
                      />
                    </label>
                    <button type="button" onClick={() => void handleUserAuthSubmit()} disabled={isAuthLoading}>
                      Sign In
                    </button>
                  </div>
                </section>
                <section className="authPanel authPanelAdmin">
                  <div className="authPanelHeader">
                    <p className="sectionLabel">Admin Access</p>
                  </div>
                  <div className="authForm">
                    <label>
                      Admin Code
                      <input
                        type="password"
                        value={adminCodeInput}
                        onChange={(event) => setAdminCodeInput(event.target.value)}
                        placeholder="Enter admin code"
                      />
                    </label>
                    <button type="button" onClick={() => void handleAdminLogin()} disabled={isAuthLoading}>
                      Enter Admin Panel
                    </button>
                  </div>
                </section>
                {authNotice && <p className="meta authSuccess">{authNotice}</p>}
                {authError && <p className="error authError">{authError}</p>}
              </div>
            )}
          </div>
        </section>
      ) : activePage === 'reading' ? (
        <section className="panel full readingPage">
          <div className="readingPageHeader">
            <div>
              <h2>Reading Exam Bank</h2>
              <p>Read the passage on the left, answer questions on the right, click hints to see the exact evidence, and save useful paraphrases to your notebook.</p>
            </div>
            <div className="readingCategoryTabs">
              {(Object.entries(READING_CATEGORY_LABELS) as Array<[ReadingBankCategory, string]>).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className={selectedReadingCategory === key ? 'active' : ''}
                  onClick={() => {
                    setSelectedReadingCategory(key)
                    setReadingAttemptStage('bank')
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {readingAttemptStage === 'bank' && (
            <>
              {readingExamError && <p className="error">{readingExamError}</p>}
              {filteredReadingExams.length === 0 ? (
                <div className="emptyNotebook">
                  <p>No reading exams in this bank yet.</p>
                  <p>{authSession?.role === 'admin' ? 'Upload one from the Admin panel.' : 'Ask your admin to upload reading passages first.'}</p>
                </div>
              ) : (
                <div className="readingBankGrid">
                  {filteredReadingExams.map((exam) => (
                    <article key={exam.id} className="readingBankCard">
                      <p className="promptPill">{READING_CATEGORY_LABELS[exam.category]}</p>
                      <h3>{exam.title}</h3>
                      <p className="meta">
                        {exam.parsedPayload?.passages?.length || 0} passages · {exam.parsedPayload?.questionCount || 0} questions
                      </p>
                      <div className="controls">
                        <button type="button" onClick={() => startReadingExam(exam.id)}>
                          Open Exam
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}

          {readingAttemptStage === 'exam' && activeReadingExam && activeReadingPassage && (
            <div className="readingExamWrap">
              <div className="readingAttemptToolbar">
                <div>
                  <p className="sectionLabel">{READING_CATEGORY_LABELS[activeReadingExam.category]}</p>
                  <h3>{activeReadingExam.title}</h3>
                  <p className="meta">
                    {answeredReadingCount}/{activeReadingAllQuestions.length} answered · Passage {activeReadingPassage.number} of {activeReadingPassages.length}
                  </p>
                </div>
                <div className="controls">
                  <button type="button" className="secondary" onClick={() => setReadingAttemptStage('bank')}>
                    Back to Bank
                  </button>
                  <button type="button" onClick={submitReadingExam}>
                    Submit Reading Exam
                  </button>
                </div>
              </div>

              <div className="readingSummaryStrip">
                <article className="readingSummaryCard">
                  <p className="sectionLabel">Exam Progress</p>
                  <strong>{answeredReadingCount}/{activeReadingAllQuestions.length}</strong>
                  <span>questions answered</span>
                </article>
                <article className="readingSummaryCard">
                  <p className="sectionLabel">Current Passage</p>
                  <strong>{activeReadingPassage.title}</strong>
                  <span>{activeReadingQuestions.length} questions in this passage</span>
                </article>
                <article className="readingSummaryCard">
                  <p className="sectionLabel">Study Mode</p>
                  <strong>Highlight + Hint</strong>
                  <span>Mark evidence before you submit</span>
                </article>
              </div>

              {activeReadingPassages.length > 1 && (
                <div className="readingPassageTabs">
                  {activeReadingPassages.map((passage) => (
                    <button
                      key={passage.number}
                      type="button"
                      className={readingActivePassageNumber === passage.number ? 'active' : ''}
                      onClick={() => setReadingActivePassageNumber(passage.number)}
                    >
                      Passage {passage.number}
                    </button>
                  ))}
                </div>
              )}

              <div className="readingExamLayout">
                <section className="readingPassagePanel">
                  <div className="readingPassageHeader">
                    <div>
                      <p className="sectionLabel">Passage {activeReadingPassage.number}</p>
                      <h3>{activeReadingPassage.title}</h3>
                    </div>
                    {activeReadingHint?.exactPortion && (
                      <div className="readingHintBox">
                        <strong>Hint active:</strong> {activeReadingHint.exactPortion}
                      </div>
                    )}
                  </div>

                  <div className="readingHighlightToolbar">
                    <p className="meta">
                      {readingSelectionText ? `Selected: "${readingSelectionText}"` : 'Select any passage text to highlight it for yourself.'}
                    </p>
                    <div className="controls">
                      <button type="button" className="secondary" disabled={!readingSelectionText} onClick={addReadingHighlight}>
                        Highlight selection
                      </button>
                      {readingHintQuestionNumber !== null && (
                        <button type="button" className="secondary" onClick={() => setReadingHintQuestionNumber(null)}>
                          Clear hint
                        </button>
                      )}
                    </div>
                  </div>

                  {readingUserHighlights.filter((item) => item.passageNumber === activeReadingPassage.number).length > 0 && (
                    <div className="readingHighlightChipRow">
                      {readingUserHighlights
                        .filter((item) => item.passageNumber === activeReadingPassage.number)
                        .map((highlight) => (
                          <button
                            key={highlight.id}
                            type="button"
                            className="readingHighlightChip"
                            onClick={() => removeReadingHighlight(highlight.id)}
                            title="Remove this highlight"
                          >
                            {highlight.text}
                          </button>
                        ))}
                    </div>
                  )}

                  <div className="readingPassageBody" onMouseUp={handleReadingSelection}>
                    {activeReadingPassage.bodyParagraphs.map((paragraph, index) => (
                      <p key={`reading-paragraph-${index}`}>
                        {renderPassageParagraphWithHighlights(
                          paragraph,
                          activeReadingPassage.number,
                          activeReadingHint && activeReadingQuestions.some((question) => question.number === activeReadingHint.number)
                            ? activeReadingHint.exactPortion
                            : ''
                        )}
                      </p>
                    ))}
                  </div>
                </section>

                <section className="readingQuestionsPanel">
                  <div className="readingQuestionsHeader">
                    <div>
                      <p className="sectionLabel">Questions</p>
                      <h3>Answer on the right, inspect evidence on the left</h3>
                    </div>
                    <span className="bandPill">{activeReadingQuestions.length} questions</span>
                  </div>

                  <div className="readingQuestionNavigator">
                    {activeReadingQuestions.map((question) => {
                      const hasAnswer = Boolean(String(readingAnswers[question.number] || '').trim())
                      const isHinting = readingHintQuestionNumber === question.number
                      return (
                        <button
                          key={`reading-nav-${question.number}`}
                          type="button"
                          className={`${hasAnswer ? 'is-answered' : ''} ${isHinting ? 'is-active' : ''}`.trim()}
                          onClick={() => {
                            setReadingHintQuestionNumber(question.number)
                            document.getElementById(`reading-question-${question.number}`)?.scrollIntoView({
                              behavior: 'smooth',
                              block: 'start'
                            })
                          }}
                        >
                          {question.number}
                        </button>
                      )
                    })}
                  </div>

                  {activeReadingPassage.questionSectionText && (
                    <details className="readingQuestionReference">
                      <summary>Show original question block</summary>
                      <pre>{activeReadingPassage.questionSectionText}</pre>
                    </details>
                  )}

                  <div className="readingQuestionList">
                    {activeReadingQuestions.map((question) => (
                      <article key={question.number} id={`reading-question-${question.number}`} className="readingQuestionCard">
                        <div className="readingQuestionCardTop">
                          <div>
                            <p className="readingQuestionNumber">Question {question.number}</p>
                            <p className="readingQuestionPrompt">{question.prompt}</p>
                          </div>
                          <button
                            type="button"
                            className="secondary"
                            onClick={() => {
                              setReadingHintQuestionNumber((current) => (current === question.number ? null : question.number))
                            }}
                          >
                            {readingHintQuestionNumber === question.number ? 'Hide Hint' : 'Show Hint'}
                          </button>
                        </div>
                        <div className="readingAnswerField">
                          {renderReadingAnswerField(question)}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          )}

          {readingAttemptStage === 'report' && activeReadingExam && (
            <div className="readingReportWrap">
              <div className="readingAttemptToolbar">
                <div>
                  <p className="sectionLabel">{READING_CATEGORY_LABELS[activeReadingExam.category]}</p>
                  <h3>{activeReadingExam.title} Report</h3>
                  <p className="meta">
                    Score: {readingReportItems.filter((item) => item.isCorrect).length}/{readingReportItems.length}
                  </p>
                </div>
                <div className="controls">
                  <button type="button" className="secondary" onClick={() => setReadingAttemptStage('bank')}>
                    Back to Bank
                  </button>
                  <button type="button" onClick={() => startReadingExam(activeReadingExam.id)}>
                    Retry Exam
                  </button>
                </div>
              </div>

              <div className="readingSummaryStrip">
                <article className="readingSummaryCard">
                  <p className="sectionLabel">Accuracy</p>
                  <strong>{readingAccuracy}%</strong>
                  <span>{readingReportItems.filter((item) => item.isCorrect).length} correct answers</span>
                </article>
                <article className="readingSummaryCard">
                  <p className="sectionLabel">Unanswered</p>
                  <strong>{unansweredReadingCount}</strong>
                  <span>questions left blank</span>
                </article>
                <article className="readingSummaryCard">
                  <p className="sectionLabel">Review Focus</p>
                  <strong>{readingReportItems.find((item) => !item.isCorrect)?.number ? `Q${readingReportItems.find((item) => !item.isCorrect)?.number}` : 'Strong set'}</strong>
                  <span>start with the first wrong answer</span>
                </article>
              </div>

              <div className="readingPassageBreakdown">
                {readingReportByPassage.map((group) => (
                  <article key={`reading-breakdown-${group.passage.number}`} className="readingPassageBreakdownCard">
                    <p className="sectionLabel">Passage {group.passage.number}</p>
                    <h4>{group.passage.title}</h4>
                    <p className="meta">
                      {group.correct}/{group.items.length || group.passage.questions.length} correct
                    </p>
                  </article>
                ))}
              </div>

              <div className="readingReportList">
                {readingReportItems.map((item) => (
                  <article key={`reading-report-${item.number}`} className={`readingReportCard ${item.isCorrect ? 'readingReportCard-correct' : 'readingReportCard-wrong'}`}>
                    <div className="readingReportHeader">
                      <div>
                        <p className="readingQuestionNumber">Question {item.number}</p>
                        <p className="readingQuestionPrompt">{item.prompt}</p>
                      </div>
                      <span className={`readingAnswerStatus ${item.isCorrect ? 'readingAnswerStatus-correct' : 'readingAnswerStatus-wrong'}`}>
                        {item.isCorrect ? 'Correct' : 'Wrong'}
                      </span>
                    </div>
                    <p className="meta">Your answer: {item.userAnswer || 'No answer'}</p>
                    <p className="meta">Correct answer: {item.correctAnswer}</p>
                    <div className="readingReportEvidence">
                      <h4>Why?</h4>
                      <p>{item.explanationThai}</p>
                      <blockquote>{item.exactPortion}</blockquote>
                    </div>
                    {item.paraphrasedVocabulary && (
                      <div className="readingParaphraseCard">
                        <p className="sectionLabel">Paraphrased vocabulary</p>
                        <p>{item.paraphrasedVocabulary}</p>
                        <button
                          type="button"
                          className="saveNotebookBtn"
                          onClick={() =>
                            savePlanToNotebook({
                              criterion: 'Reading Paraphrase',
                              quote: `Q${item.number}: ${item.prompt}`,
                              fix: item.paraphrasedVocabulary,
                              thaiMeaning: item.explanationThai
                            })
                          }
                        >
                          Save to Notebook
                        </button>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>
      ) : activePage === 'admin' ? (
          <section className="adminPanelPage">
            <div className="adminHero">
              <div>
                <p className="sectionLabel">Admin Workspace</p>
                <h2>Manage learner access, exam flow, and question audio</h2>
                <p className="meta">
                  Create access fast, spot expiring learners, and generate reusable Deepgram question audio without
                  digging through one long page.
                </p>
              </div>
              <div className="adminStatGrid">
                <article className="adminStatCard">
                  <span className="adminStatLabel">Learners</span>
                  <strong>{managedLearners.length}</strong>
                </article>
                <article className="adminStatCard">
                  <span className="adminStatLabel">Active</span>
                  <strong>{managedLearners.filter((learner) => learner.status === 'active').length}</strong>
                </article>
                <article className="adminStatCard">
                  <span className="adminStatLabel">Audio Ready</span>
                  <strong>{generatedAdminTtsLibrary.length}</strong>
                </article>
                <article className="adminStatCard">
                  <span className="adminStatLabel">Open Issues</span>
                  <strong>{openSupportReportCount}</strong>
                </article>
              </div>
            </div>

            {(adminPanelMessage || authError) && (
              <div className="panel adminSectionCard">
                <div className="adminSectionHeader">
                  <div>
                    <p className="sectionLabel">Admin Status</p>
                    <h3>Upload & Access Messages</h3>
                  </div>
                </div>
                {adminPanelMessage && <p className="meta authSuccess">{adminPanelMessage}</p>}
                {authError && <p className="error authError">{authError}</p>}
              </div>
            )}

            <div className="adminLayout">
              <div className="adminMainColumn">
                <div className="panel adminSectionCard">
                  <div className="adminSectionHeader">
                    <div>
                      <p className="sectionLabel">Access Control</p>
                      <h3>Grant Course Access</h3>
                    </div>
                    {adminPanelMessage && <span className="adminInlineStatus">{adminPanelMessage}</span>}
                  </div>
                  <p className="meta">
                    Create or renew learner access, set the role, define the expiry date, and preload credits in one
                    place.
                  </p>
                  <div className="adminFormGrid">
                    <label>
                      Name
                      <input value={adminLearnerNameInput} onChange={(event) => setAdminLearnerNameInput(event.target.value)} />
                    </label>
                    <label>
                      Email
                      <input
                        type="email"
                        value={adminLearnerEmailInput}
                        onChange={(event) => setAdminLearnerEmailInput(event.target.value)}
                      />
                    </label>
                    <label>
                      Password
                      <input
                        type="password"
                        value={adminLearnerPasswordInput}
                        onChange={(event) => setAdminLearnerPasswordInput(event.target.value)}
                      />
                    </label>
                    <label>
                      Role
                      <select value={adminLearnerRoleInput} onChange={(event) => setAdminLearnerRoleInput(event.target.value as Role)}>
                        <option value="student">Student</option>
                        <option value="admin">Admin</option>
                      </select>
                    </label>
                    <label>
                      Status
                      <select value={adminLearnerStatusInput} onChange={(event) => setAdminLearnerStatusInput(event.target.value as LearnerStatus)}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </label>
                    <label>
                      Access Until
                      <input
                        type="date"
                        value={adminLearnerExpiresAtInput}
                        onChange={(event) => setAdminLearnerExpiresAtInput(event.target.value)}
                      />
                    </label>
                    <label>
                      Feedback Credits
                      <input
                        type="number"
                        min={0}
                        value={adminLearnerFeedbackCreditsInput}
                        onChange={(event) => setAdminLearnerFeedbackCreditsInput(Number(event.target.value))}
                      />
                    </label>
                    <label>
                      Full Mock Credits
                      <input
                        type="number"
                        min={0}
                        value={adminLearnerFullMockCreditsInput}
                        onChange={(event) => setAdminLearnerFullMockCreditsInput(Number(event.target.value))}
                      />
                    </label>
                  </div>
                  <div className="adminActionRow">
                    <button type="button" onClick={() => void handleAdminCreateLearner()}>
                      Save Learner Access
                    </button>
                    <p className="meta">Tip: use inactive status to pause access without deleting the account.</p>
                  </div>
                </div>

                <div className="panel adminSectionCard">
                  <div className="adminSectionHeader">
                    <div>
                      <p className="sectionLabel">Learner Directory</p>
                      <h3>Learners</h3>
                    </div>
                    <label className="adminSearchField">
                      <span>Search learners</span>
                      <input
                        type="search"
                        value={adminLearnerSearchInput}
                        onChange={(event) => setAdminLearnerSearchInput(event.target.value)}
                        placeholder="Search by name, email, role, or status"
                      />
                    </label>
                  </div>
                  <div className="subscriptionList adminLearnerList">
                    {filteredManagedLearners.length === 0 ? (
                      <p className="meta">No learners match this search yet.</p>
                    ) : (
                      filteredManagedLearners
                        .slice()
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map((learner) => (
                          <article key={learner.id} className="subscriptionCard adminLearnerCard">
                            <div className="subscriptionTopRow">
                              <div>
                                <h3>{learner.name}</h3>
                                <p className="subscriptionEmail">{learner.email}</p>
                              </div>
                              <div className="adminLearnerBadges">
                                <span className="bandPill">{learner.role}</span>
                                <span className={`adminStatusPill adminStatusPill-${learner.status}`}>{learner.status}</span>
                              </div>
                            </div>
                            <div className="adminLearnerMetaGrid">
                              <p className="meta">Joined: {new Date(learner.createdAt).toLocaleDateString()}</p>
                              <p className="meta">Access: {formatAccessDate(learner.startsAt)} to {formatAccessDate(learner.expiresAt)}</p>
                              <p className="meta">Feedback: {learner.feedbackRemaining}</p>
                              <p className="meta">Full Mock: {learner.fullMockRemaining}</p>
                            </div>
                            <div className="controls adminCardActions">
                              <button
                                type="button"
                                className="secondary"
                                onClick={() =>
                                  void handleAdminQuickUpdate(learner, {
                                    status: learner.status === 'active' ? 'inactive' : 'active'
                                  })
                                }
                              >
                                {learner.status === 'active' ? 'Deactivate' : 'Reactivate'}
                              </button>
                              <button
                                type="button"
                                className="secondary"
                                onClick={() =>
                                  void handleAdminQuickUpdate(learner, {
                                    feedbackRemaining: learner.feedbackRemaining + 10
                                  })
                                }
                              >
                                +10 Feedback
                              </button>
                              <button
                                type="button"
                                className="secondary"
                                onClick={() =>
                                  void handleAdminQuickUpdate(learner, {
                                    fullMockRemaining: learner.fullMockRemaining + 5
                                  })
                                }
                              >
                                +5 Full Mock
                              </button>
                              <button
                                type="button"
                                className="secondary"
                                onClick={() => {
                                  const nextDate = window.prompt(
                                    'New expiry date (YYYY-MM-DD)',
                                    learner.expiresAt ? learner.expiresAt.slice(0, 10) : ''
                                  )
                                  if (!nextDate) return
                                  void handleAdminQuickUpdate(learner, {
                                    expiresAt: new Date(nextDate).toISOString()
                                  })
                                }}
                              >
                                Change Expiry
                              </button>
                            </div>
                          </article>
                        ))
                    )}
                  </div>
                </div>

                <div className="panel adminSectionCard">
                  <div className="adminSectionHeader">
                    <div>
                      <p className="sectionLabel">Client Support</p>
                      <h3>Problem Reports Inbox</h3>
                    </div>
                    <span className="adminInlineStatus">{activeSupportReportCount} active</span>
                  </div>
                  <p className="meta">
                    Every student report lands here. Update the status, leave an internal note, and keep track of what has already been resolved.
                  </p>
                  <div className="subscriptionList adminLearnerList">
                    {adminSupportReports.length === 0 ? (
                      <p className="meta">No client issues have been reported yet.</p>
                    ) : (
                      adminSupportReports.map((report) => (
                        <article key={report.id} className="subscriptionCard adminLearnerCard supportAdminCard">
                          <div className="subscriptionTopRow">
                            <div>
                              <h3>{report.reporterName}</h3>
                              <p className="subscriptionEmail">{report.reporterEmail}</p>
                            </div>
                            <div className="adminLearnerBadges">
                              <span className="bandPill">{SUPPORT_REPORT_CATEGORY_LABELS[report.category]}</span>
                              <span className={`adminStatusPill adminStatusPill-${report.status}`}>{SUPPORT_REPORT_STATUS_LABELS[report.status]}</span>
                            </div>
                          </div>
                          <div className="adminLearnerMetaGrid">
                            <p className="meta">Page: {report.pageContext}</p>
                            <p className="meta">Created: {report.createdAt ? new Date(report.createdAt).toLocaleString() : 'Unknown'}</p>
                            <p className="meta">Updated: {report.updatedAt ? new Date(report.updatedAt).toLocaleString() : 'Unknown'}</p>
                            <p className="meta">Resolved: {report.resolvedAt ? new Date(report.resolvedAt).toLocaleString() : 'Not resolved yet'}</p>
                          </div>
                          <div className="supportAdminBody">
                            <label>
                              Client message
                              <textarea value={report.message} readOnly rows={4} />
                            </label>
                            <div className="supportAdminControls">
                              <label>
                                Status
                                <select
                                  value={report.status}
                                  onChange={(event) =>
                                    void handleAdminSupportReportUpdate(report.id, {
                                      status: event.target.value as SupportReportStatus
                                    })
                                  }
                                >
                                  {(Object.entries(SUPPORT_REPORT_STATUS_LABELS) as Array<[SupportReportStatus, string]>).map(([value, label]) => (
                                    <option key={`${report.id}-${value}`} value={value}>
                                      {label}
                                    </option>
                                  ))}
                                </select>
                              </label>
                              <label>
                                Admin note
                                <textarea
                                  value={report.adminNote}
                                  rows={4}
                                  onChange={(event) =>
                                    setAdminSupportReports((current) =>
                                      current.map((item) =>
                                        item.id === report.id ? { ...item, adminNote: event.target.value } : item
                                      )
                                    )
                                  }
                                  placeholder="Internal note for follow-up, fix status, or what you told the client..."
                                />
                              </label>
                            </div>
                            <div className="adminActionRow">
                              <button
                                type="button"
                                className="secondary"
                                onClick={() =>
                                  void handleAdminSupportReportUpdate(report.id, {
                                    status: report.status,
                                    adminNote: report.adminNote
                                  })
                                }
                              >
                                Save Admin Update
                              </button>
                            </div>
                          </div>
                        </article>
                      ))
                    )}
                  </div>
                </div>

                <div className="panel adminSectionCard">
                  <div className="adminSectionHeader">
                    <div>
                      <p className="sectionLabel">Reading Exam Bank</p>
                      <h3>Upload Reading Passage Sets</h3>
                    </div>
                  </div>
                  <p className="meta">
                    Paste the full reading text and the answer-key format together, then learners will see it inside the
                    Reading bank under Passage 1, Passage 2, Passage 3, or Full Test.
                  </p>
                  <div className="adminWorkflowCard">
                    <h4>Smart Paste Helper</h4>
                    <p className="meta">
                      If your source looks like the long format you pasted in chat, drop the whole thing here once and let the app split it into title, category, passage text, and answer key for you.
                    </p>
                    <label>
                      Combined Reading Source
                      <textarea
                        value={adminReadingSmartPasteInput}
                        onChange={(event) => setAdminReadingSmartPasteInput(event.target.value)}
                        placeholder="Paste the full answer-key block and the full reading passage block together here..."
                        rows={12}
                      />
                    </label>
                    <div className="adminActionRow">
                      <button type="button" className="secondary" onClick={autoFillReadingUploadFromCombinedPaste}>
                        Auto-fill from One Pasted Block
                      </button>
                      <p className="meta">Best for imports where the answer key appears first and the reading passages come after.</p>
                    </div>
                  </div>
                  <div className="adminFormGrid">
                    <label>
                      Exam Title
                      <input
                        value={adminReadingTitleInput}
                        onChange={(event) => setAdminReadingTitleInput(event.target.value)}
                        placeholder="e.g. Cambridge-style Reading Test 01"
                      />
                    </label>
                    <label>
                      Bank Category
                      <select
                        value={adminReadingCategoryInput}
                        onChange={(event) => setAdminReadingCategoryInput(event.target.value as ReadingBankCategory)}
                      >
                        {Object.entries(READING_CATEGORY_LABELS).map(([key, label]) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <label>
                    Reading Passage Text
                    <textarea
                      value={adminReadingPassageInput}
                      onChange={(event) => setAdminReadingPassageInput(event.target.value)}
                      placeholder="Paste the uploaded passage format here..."
                      rows={14}
                    />
                  </label>
                  <label>
                    Answer Key + Thai Explanation
                    <textarea
                      value={adminReadingAnswerKeyInput}
                      onChange={(event) => setAdminReadingAnswerKeyInput(event.target.value)}
                      placeholder="Paste the uploaded answer-key format here..."
                      rows={14}
                    />
                  </label>
                  <div className="adminActionRow">
                    <button type="button" onClick={() => void handleAdminCreateReadingExam()}>
                      Upload Reading Exam
                    </button>
                    <p className="meta">The parser will split passages, question ranges, exact hints, and paraphrased vocabulary automatically.</p>
                  </div>
                  {adminPanelMessage && <p className="meta authSuccess">{adminPanelMessage}</p>}
                  {authError && <p className="error authError">{authError}</p>}
                  {readingExams.length > 0 && (
                    <div className="adminAudioLibraryGrid">
                      {readingExams.slice(0, 6).map((exam) => (
                        <article key={exam.id} className="adminAudioCard">
                          <p className="adminAudioEyebrow">{READING_CATEGORY_LABELS[exam.category]}</p>
                          <h4>{exam.title}</h4>
                          <p>
                            {exam.parsedPayload?.passages?.length || 0} passages · {exam.parsedPayload?.questionCount || 0} questions
                          </p>
                        </article>
                      ))}
                    </div>
                  )}
                </div>

                <div className="panel adminSectionCard">
                  <div className="adminSectionHeader">
                    <div>
                      <p className="sectionLabel">Reading Exam Bank</p>
                      <h3>Bulk JSON Import</h3>
                    </div>
                  </div>
                  <p className="meta">
                    Paste one JSON array with many reading exams and upload them all in one go. This is the most stable
                    option if you hate doing copy-paste many times.
                  </p>
                  <label>
                    Bulk JSON Payload
                    <textarea
                      value={adminReadingBulkJsonInput}
                      onChange={(event) => {
                        setAdminReadingBulkJsonInput(event.target.value)
                        setAdminReadingBulkValidation(null)
                      }}
                      placeholder={`[\n  {\n    "title": "Cambridge-style Reading Test 01",\n    "category": "fulltest",\n    "rawPassageText": "READING PASSAGE 1\\n...",\n    "rawAnswerKey": "Question 1: ..."\n  },\n  {\n    "title": "Cambridge-style Reading Test 02",\n    "category": "fulltest",\n    "rawPassageText": "READING PASSAGE 1\\n...",\n    "rawAnswerKey": "Question 1: ..."\n  }\n]`}
                      rows={16}
                    />
                  </label>
                  <div className="adminWorkflowCard">
                    <h4>JSON Templates</h4>
                    <p className="meta">
                      Choose the category you want, copy the template, then paste your real exam content into
                      <code> rawPassageText </code>
                      and
                      <code> rawAnswerKey </code>.
                    </p>
                    <div className="readingCategoryTabs adminTemplateTabs">
                      {(Object.entries(READING_CATEGORY_LABELS) as Array<[ReadingBankCategory, string]>).map(([key, label]) => (
                        <button
                          key={`template-${key}`}
                          type="button"
                          className={adminReadingTemplateCategory === key ? 'active' : ''}
                          onClick={() => setAdminReadingTemplateCategory(key)}
                        >
                          {label} Template
                        </button>
                      ))}
                    </div>
                    <label>
                      Copyable Template
                      <textarea value={currentReadingJsonTemplate} readOnly rows={18} />
                    </label>
                    <div className="adminActionRow">
                      <button type="button" className="secondary" onClick={() => void copyReadingJsonTemplate()}>
                        Copy Template
                      </button>
                      <button type="button" className="secondary" onClick={loadReadingJsonTemplateIntoUpload}>
                        Load Template Into Upload Box
                      </button>
                    </div>
                  </div>
                  <div className="adminActionRow">
                    <button type="button" className="secondary" onClick={() => void validateAdminReadingBulkJson()}>
                      Validate JSON First
                    </button>
                    <button type="button" onClick={() => void handleAdminBulkCreateReadingExams()}>
                      Upload Bulk JSON
                    </button>
                    <p className="meta">
                      Each item needs: <code>title</code>, <code>category</code>, <code>rawPassageText</code>, and <code>rawAnswerKey</code>.
                    </p>
                  </div>
                  {adminReadingBulkValidation && (
                    <div className="adminWorkflowCard">
                      <h4>Validation Result</h4>
                      <p className="meta">
                        Total: {adminReadingBulkValidation.total} · Valid: {adminReadingBulkValidation.valid} · Invalid:{' '}
                        {adminReadingBulkValidation.invalid}
                      </p>
                      <div className="adminAudioLibraryGrid">
                        {adminReadingBulkValidation.items.map((item) => (
                          <article key={`reading-validation-${item.index}`} className="adminAudioCard">
                            <p className="adminAudioEyebrow">
                              {READING_CATEGORY_LABELS[item.category]} · Item {item.index}
                            </p>
                            <h4>{item.title}</h4>
                            {item.ok ? (
                              <>
                                <p>Ready to upload</p>
                                <p className="meta">
                                  {item.passageCount} passages · {item.questionCount} questions
                                </p>
                              </>
                            ) : (
                              <>
                                <p className="error">Needs fixing</p>
                                <p className="meta">{item.error}</p>
                              </>
                            )}
                          </article>
                        ))}
                      </div>
                    </div>
                  )}
                  {adminPanelMessage && <p className="meta authSuccess">{adminPanelMessage}</p>}
                  {authError && <p className="error authError">{authError}</p>}
                </div>

                <div className="panel adminSectionCard">
                  <div className="adminSectionHeader">
                    <div>
                      <p className="sectionLabel">Reading Exam Bank</p>
                      <h3>Uploaded Exams by Category</h3>
                    </div>
                  </div>
                  <p className="meta">See what is already inside each reading bank before you upload the next set.</p>
                  <div className="adminAudioLibraryGrid">
                    {readingExamCountsByCategory.map((group) => (
                      <article key={`reading-group-${group.category}`} className="adminAudioCard">
                        <p className="adminAudioEyebrow">{group.label}</p>
                        <h4>{group.count} uploaded</h4>
                        {group.exams.length > 0 ? (
                          <ul className="compactList">
                            {group.exams.map((exam) => (
                              <li key={`reading-group-item-${exam.id}`}>
                                {exam.title} ({exam.parsedPayload?.questionCount || 0}Q)
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="meta">No exams in this category yet.</p>
                        )}
                      </article>
                    ))}
                  </div>
                </div>

                <div className="panel adminSectionCard">
                  <div className="adminSectionHeader">
                    <div>
                      <p className="sectionLabel">Question Audio</p>
                      <h3>Deepgram Audio Generation</h3>
                    </div>
                    <label className="adminSearchField">
                      <span>Search questions</span>
                      <input
                        type="search"
                        value={adminTtsSearchInput}
                        onChange={(event) => setAdminTtsSearchInput(event.target.value)}
                        placeholder="Search by part, topic, or question"
                      />
                    </label>
                  </div>
                  <div className="adminWorkflowCard">
                    <h4>Recommended Process</h4>
                    <ol className="adminWorkflowList">
                      <li>Search the speaking question you want to prepare.</li>
                      <li>Generate the audio once with Deepgram.</li>
                      <li>Use the “Audio Ready” library below to replay and check what is already generated.</li>
                    </ol>
                  </div>
                  <div className="adminTtsLibraryHeader">
                    <div>
                      <h4>Generated Audio Library</h4>
                      <p className="meta">Audio stays available in this admin session so you can review and replay it quickly.</p>
                    </div>
                    <span className="bandPill">{generatedAdminTtsLibrary.length} ready</span>
                  </div>
                  {generatedAdminTtsLibrary.length > 0 ? (
                    <div className="adminAudioLibraryGrid">
                      {generatedAdminTtsLibrary.map((item) => (
                        <article key={`generated-${item.key}`} className="adminAudioCard">
                          <p className="adminAudioEyebrow">{item.section}</p>
                          <h4>{item.topicTitle}</h4>
                          <p>{item.question}</p>
                          <audio controls src={item.audioUrl} />
                        </article>
                      ))}
                    </div>
                  ) : (
                    <p className="meta adminEmptyState">No generated audio yet. Generate a question below to build the library.</p>
                  )}
                  <div className="adminTtsGroupStack">
                    {[
                      {
                        title: 'Speaking Part 1',
                        items: filteredAdminTtsQuestionLibrary.filter((item) => item.section === 'Part 1')
                      },
                      {
                        title: 'Speaking Part 3',
                        items: filteredAdminTtsQuestionLibrary.filter((item) => item.section === 'Part 3')
                      }
                    ].map(({ title, items }) => (
                      <details key={title} className="adminTtsSection" open>
                        <summary>
                          <span>{title}</span>
                          <span>{items.length} questions</span>
                        </summary>
                        <div className="adminTtsQuestionList">
                          {items.length === 0 ? (
                            <p className="meta">No questions match this search.</p>
                          ) : (
                            items.map((item) => (
                              <article key={item.key} className="adminQuestionCard">
                                <div className="adminQuestionCardTop">
                                  <div>
                                    <p className="adminAudioEyebrow">{item.topicTitle}</p>
                                    <p className="adminQuestionText">{item.question}</p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => void generateTtsForQuestion(item.key, item.question)}
                                    disabled={ttsGeneratingKey === item.key}
                                  >
                                    {ttsGeneratingKey === item.key ? 'Generating...' : item.audioUrl ? 'Regenerate' : 'Generate'}
                                  </button>
                                </div>
                                {item.audioUrl ? (
                                  <div className="adminQuestionAudioRow">
                                    <span className="adminReadyDot">Audio Ready</span>
                                    <audio controls src={item.audioUrl} />
                                  </div>
                                ) : (
                                  <p className="meta adminQuestionHint">Generate once to store it in the session library above.</p>
                                )}
                              </article>
                            ))
                          )}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              </div>

              <div className="adminSideColumn">
                <div className="panel adminSectionCard">
                  <div className="adminSectionHeader">
                    <div>
                      <p className="sectionLabel">Student Experience</p>
                      <h3>Topic Control</h3>
                    </div>
                  </div>
                  <p className="meta">Enable or hide topic cards from the learner workspace.</p>
                  <div className="topicList adminTopicList">
                    {[...groupedTopics.entries()].map(([category, categoryTopics]) => (
                      <div key={category} className="topicGroup adminTopicGroup">
                        <h3>{category}</h3>
                        {categoryTopics.map((topic) => (
                          <label key={topic.id} className="topicOption adminTopicOption">
                            <input
                              type="checkbox"
                              checked={enabledTopicIds.includes(topic.id)}
                              onChange={() => toggleTopic(topic.id)}
                            />
                            <span>{topic.title}</span>
                          </label>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="panel adminSectionCard">
                  <div className="adminSectionHeader">
                    <div>
                      <p className="sectionLabel">Assessment Flow</p>
                      <h3>Timing & QA</h3>
                    </div>
                  </div>
                  <div className="timeSettings adminTimeSettings">
                    <label>
                      Preparation (seconds)
                      <input
                        type="number"
                        min={0}
                        value={prepSeconds}
                        onChange={(event) => setPrepSeconds(Number(event.target.value))}
                      />
                    </label>
                    <label>
                      Speaking (seconds)
                      <input
                        type="number"
                        min={30}
                        value={talkSeconds}
                        onChange={(event) => setTalkSeconds(Number(event.target.value))}
                      />
                    </label>
                  </div>
                  <p className="meta">Current assessment flow: Cleanup {'->'} Gemini Flash-Lite · Assessment {'->'} Gemini 2.5 Flash</p>
                  <div className="adminQaCard">
                    <h4>Admin Paste Text QA</h4>
                    <p className="meta">
                      Paste a transcript to preview the learner report instantly. Use blank lines between answers when
                      testing full mock mapping.
                    </p>
                    <textarea
                      value={adminPasteText}
                      onChange={(event) => setAdminPasteText(event.target.value)}
                      placeholder="Paste transcript text here..."
                      rows={8}
                    />
                    <div className="controls adminCardActions">
                      <button type="button" onClick={() => void assessPastedTextNow(selectedTestMode)}>
                        Assess Current Mode
                      </button>
                      <button type="button" className="secondary" onClick={() => void assessPastedTextNow('full')}>
                        Assess Full Mock
                      </button>
                      <button type="button" className="secondary" onClick={loadAdminFullMockSample}>
                        Load Demo Full Mock
                      </button>
                      <button type="button" onClick={() => void runAdminFullMockSample()}>
                        Run Demo Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : activePage === 'workspace' ? (
          <section className="panel full">
          <h2>Speaking Test</h2>
          {attemptStage === 'idle' && (
            <>
              <div className="providerTabs">
                {(['part1', 'part2', 'part3', 'full'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    className={`${selectedTestMode === mode ? 'active' : ''} ${mode === 'full' ? 'fullMockTab' : ''}`}
                    onClick={() => setSelectedTestMode(mode)}
                  >
                    {SPEAKING_MODE_LABELS[mode]}
                    {mode === 'full' && <span className="tabDurationBadge">🕐 15-17 min</span>}
                  </button>
                ))}
              </div>
              {selectedTestMode === 'full' && (
                <div className="fullMockPreviewBanner">
                  <p className="fullMockPreviewTitle">Full Mock Test Flow</p>
                  <div className="fullMockPreviewSteps">
                    <span className="previewStep">Part 1 (4Q)</span>
                    <span className="previewArrow">→</span>
                    <span className="previewStep">Part 2 Prep</span>
                    <span className="previewArrow">→</span>
                    <span className="previewStep">Part 2 Speak</span>
                    <span className="previewArrow">→</span>
                    <span className="previewStep">Rest</span>
                    <span className="previewArrow">→</span>
                    <span className="previewStep">Part 3 (4Q)</span>
                    <span className="previewArrow">→</span>
                    <span className="previewStep previewStepFinal">Report</span>
                  </div>
                </div>
              )}
              <div className="thumbnailGrid">
                {availableTopics.map((topic, index) => (
                  (() => {
                    const latestScore = latestScoresByTest[`${selectedTestMode}:${topic.id}`]
                    const hasAttempted = latestScore !== undefined
                    return (
                  <div
                    className={`thumbnailCard color-${index % 6} ${selectedTestMode === 'full' ? 'fullMockCard' : ''}`}
                    key={topic.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      openStartFlowForTopic(topic.id)
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        openStartFlowForTopic(topic.id)
                      }
                    }}
                  >
                    {selectedTestMode === 'full' && <span className="fullMockCardBadge">🎯 Full Exam</span>}
                    <p className="thumbCategory">{topic.category}</p>
                    <h3>{topic.title}</h3>
                    <p className="latestScoreBadge">
                      Latest score:{' '}
                      {hasAttempted ? latestScore.toFixed(1) : 'N/A'}
                    </p>
                    {hasAttempted && (
                      <button
                        type="button"
                        className="redeemBtn"
                        onClick={(event) => {
                          event.stopPropagation()
                          retryTestFromCard(topic.id)
                        }}
                      >
                        TRY AGAIN
                      </button>
                    )}
                    <span>Click to Attempt</span>
                  </div>
                    )
                  })()
                ))}
              </div>
            </>
          )}

          {attemptStage !== 'idle' && activeTopic && (
            <div className="attemptFlow">
              {attemptStage !== 'speaking' && <div className="card">
                <p className="category">{activeTopic.category}</p>
                <h3>{activeTopic.prompt}</h3>
                <ul>
                  {activeTopic.cues.map((cue) => (
                    <li key={cue}>{cue}</li>
                  ))}
                </ul>
              </div>}

              {attemptStage === 'prep' && (
                <div className="stageCard prepStageV2">
                  <h3>Preparation Time</h3>
                  <p className="timer">{remainingPrepSeconds}s</p>

                  {isFullExamMode && (
                    <>
                      <div className="prepTimeEstimate">
                        <span className="prepTimeIcon">🕐</span>
                        <span>ใช้เวลาประมาณ <strong>{fullExamTotalMinutes} นาที</strong> — เตรียมพร้อมก่อนเริ่ม</span>
                      </div>

                      <div className="prepProgressStepper">
                        <div className="stepperStep stepperActive">
                          <span className="stepperDot" />
                          <span>Part 1</span>
                          <span className="stepperMeta">{fullExamPlan.part1Questions.length}Q · 75s each</span>
                        </div>
                        <div className="stepperLine" />
                        <div className="stepperStep">
                          <span className="stepperDot" />
                          <span>Part 2 Prep</span>
                          <span className="stepperMeta">60s</span>
                        </div>
                        <div className="stepperLine" />
                        <div className="stepperStep">
                          <span className="stepperDot" />
                          <span>Part 2 Speak</span>
                          <span className="stepperMeta">2 min</span>
                        </div>
                        <div className="stepperLine" />
                        <div className="stepperStep">
                          <span className="stepperDot" />
                          <span>Rest</span>
                          <span className="stepperMeta">30s</span>
                        </div>
                        <div className="stepperLine" />
                        <div className="stepperStep">
                          <span className="stepperDot" />
                          <span>Part 3</span>
                          <span className="stepperMeta">{fullExamPlan.part3Questions.length}Q · 90s each</span>
                        </div>
                        <div className="stepperLine" />
                        <div className="stepperStep stepperFinal">
                          <span className="stepperDot" />
                          <span>Report</span>
                        </div>
                      </div>

                      <div className="prepHeadsUp">
                        <p className="prepHeadsUpTitle">⚠️ Heads Up</p>
                        <p>หยุดกลางทางยังถูกตัดเครดิต เตรียมเวลาว่างก่อนเริ่มนะ</p>
                      </div>

                      <div className="prepMicCheck">
                        <p className="prepMicCheckTitle">🎤 ทดสอบไมค์ก่อนเริ่ม</p>
                        {micCheckStatus === 'idle' && (
                          <button type="button" className="micCheckBtn" onClick={() => void startMicCheck()}>
                            กดเพื่อบันทึก 3 วินาที
                          </button>
                        )}
                        {micCheckStatus === 'recording' && (
                          <p className="micCheckRecording">🔴 กำลังบันทึก... พูดอะไรสักอย่าง</p>
                        )}
                        {micCheckStatus === 'playing' && (
                          <p className="micCheckPlaying">🔊 กำลังเล่นเสียงของคุณ...</p>
                        )}
                        {micCheckStatus === 'success' && (
                          <div className="micCheckSuccess">
                            <p>✅ ไมค์ใช้งานได้!</p>
                            <button type="button" className="micCheckRetry" onClick={resetMicCheck}>ทดสอบอีกครั้ง</button>
                          </div>
                        )}
                        {micCheckStatus === 'error' && (
                          <div className="micCheckError">
                            <p>❌ ไม่สามารถเข้าถึงไมค์ได้ กรุณาตรวจสอบการอนุญาต</p>
                            <button type="button" className="micCheckRetry" onClick={resetMicCheck}>ลองอีกครั้ง</button>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  <p>Review the question list first, then click &quot;I&apos;m Ready&quot;.</p>

                  {isQuestionByQuestionMode && (
                    <div className="card">
                      <p className="category">
                        {SPEAKING_MODE_LABELS[selectedTestMode]} Questions ({activeQuestionList.length})
                      </p>
                      <ul>
                        {activeQuestionList.map((question, index) => (
                          <li key={`prep-question-${index}`}>{question}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="prepNotebookCard">
                    <h4>Preparation Notebook</h4>
                    {isFullExamMode ? (
                      <div className="prepAccordionWrap">
                        <details
                          className="prepAccordion"
                          open={prepAccordionOpen.part1}
                          onToggle={(e) => setPrepAccordionOpen((prev) => ({ ...prev, part1: (e.target as HTMLDetailsElement).open }))}
                        >
                          <summary>
                            <span>Part 1 Notes ({fullExamPlan.part1Questions.length} questions)</span>
                            <span className="prepAccordionTip">💡 ตอบสั้น 2-3 ประโยคพอ</span>
                          </summary>
                          <div className="questionNoteGrid">
                            {fullExamPlan.part1Questions.map((question, index) => (
                              <label key={`full-p1-note-${index}`} className="questionNoteItem">
                                <p className="questionNotePrompt">{question}</p>
                                {renderRecommendationDropdown({
                                  title: 'Part 1 vocabulary guide',
                                  question,
                                  items: getPart1Recommendations(
                                    question,
                                    buildFullExamPart1RecommendationExtras(activeTopic, fullExamPlan.part1Questions, question)
                                  )
                                })}
                                <textarea
                                  value={questionPrepNotes[`full-p1-${index}`] || ''}
                                  onChange={(event) =>
                                    setQuestionPrepNotes((current) => ({
                                      ...current,
                                      [`full-p1-${index}`]: event.target.value
                                    }))
                                  }
                                  placeholder="Key words, ideas..."
                                />
                              </label>
                            ))}
                          </div>
                        </details>

                        <details
                          className="prepAccordion"
                          open={prepAccordionOpen.part2}
                          onToggle={(e) => setPrepAccordionOpen((prev) => ({ ...prev, part2: (e.target as HTMLDetailsElement).open }))}
                        >
                          <summary>
                            <span>Part 2 Note (Long turn)</span>
                            <span className="prepAccordionTip">💡 จดโครงเรื่อง + keywords</span>
                          </summary>
                          <div className="part2NoteWrap">
                            <p className="part2PromptPreview">{fullExamPlan.part2Prompt}</p>
                            {renderRecommendationDropdown({
                              title: 'Part 2 vocabulary guide',
                              question: fullExamPlan.part2Prompt,
                              items: fullExamPart2Recommendations
                            })}
                            <textarea
                              className="part2NotebookTextarea"
                              value={prepNotePart2}
                              onChange={(event) => setPrepNotePart2(event.target.value)}
                              placeholder="จด keyword, โครงเรื่อง, และตัวอย่างสั้น ๆ ตรงนี้..."
                            />
                            <p className="part2NotebookHint">
                              คุณสามารถพิมพ์โน้ตลงสมุดบนจอได้เลย หรือใช้สมุดของตัวเองควบคู่กันก็ได้
                            </p>
                          </div>
                        </details>

                        <details
                          className="prepAccordion"
                          open={prepAccordionOpen.part3}
                          onToggle={(e) => setPrepAccordionOpen((prev) => ({ ...prev, part3: (e.target as HTMLDetailsElement).open }))}
                        >
                          <summary>
                            <span>Part 3 Notes ({fullExamPlan.part3Questions.length} questions)</span>
                            <span className="prepAccordionTip">💡 ใช้ Because / However / For example</span>
                          </summary>
                          <div className="questionNoteGrid">
                            {fullExamPlan.part3Questions.map((question, index) => (
                              <label key={`full-p3-note-${index}`} className="questionNoteItem">
                                <p className="questionNotePrompt">{question}</p>
                                {renderRecommendationDropdown({
                                  title: 'Part 3 speaking guide',
                                  question,
                                  items: getPart3Recommendations(
                                    question,
                                    buildFullExamPart3RecommendationExtras(activeTopic, fullExamPlan.part3Questions, question)
                                  )
                                })}
                                <textarea
                                  value={questionPrepNotes[`full-p3-${index}`] || ''}
                                  onChange={(event) =>
                                    setQuestionPrepNotes((current) => ({
                                      ...current,
                                      [`full-p3-${index}`]: event.target.value
                                    }))
                                  }
                                  placeholder="Main point, supporting idea..."
                                />
                              </label>
                            ))}
                          </div>
                        </details>
                      </div>
                    ) : isQuestionByQuestionMode ? (
                      <div className="questionNoteGrid">
                        {activeQuestionList.map((question, index) => (
                          <label key={`prep-note-${index}`} className="questionNoteItem">
                            <p className="questionNotePrompt">{question}</p>
                            {renderRecommendationDropdown({
                              title: selectedTestMode === 'part1' ? 'Part 1 vocabulary guide' : 'Part 3 speaking guide',
                              question,
                              items:
                                selectedTestMode === 'part1'
                                  ? getPart1Recommendations(question, buildPart1RecommendationExtras(activeTopic, question))
                                  : getPart3Recommendations(question, buildPart3RecommendationExtras(activeTopic, question))
                            })}
                            <textarea
                              value={questionPrepNotes[String(index)] || ''}
                              onChange={(event) =>
                                setQuestionPrepNotes((current) => ({
                                  ...current,
                                  [String(index)]: event.target.value
                                }))
                              }
                              placeholder={`Key points for: ${question}`}
                            />
                          </label>
                        ))}
                      </div>
                    ) : (
                      <label className="questionNoteItem">
                        <span>Part 2 Note</span>
                        {renderRecommendationDropdown({
                          title: 'Part 2 vocabulary guide',
                          question: activeTopic.prompt,
                          items: standalonePart2Recommendations
                        })}
                        <textarea
                          className="part2NotebookTextarea"
                          value={prepNotePart2}
                          onChange={(event) => setPrepNotePart2(event.target.value)}
                          placeholder="Write cue words, examples, and story flow..."
                        />
                        <p className="part2NotebookHint">
                          คุณสามารถพิมพ์โน้ตลงสมุดบนจอได้เลย หรือใช้สมุดของตัวเองควบคู่กันก็ได้
                        </p>
                      </label>
                    )}
                  </div>
                  <div className="controls prepControls">
                    <button type="button" className="primaryReadyBtn" onClick={() => void skipPreparation()}>
                      I&apos;m Ready — Start Exam
                    </button>
                    <button type="button" className="secondary cancelBtn" onClick={resetSession}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {attemptStage === 'speaking' && (
                <div className={`speakingStageWrap ${isExamPaused ? 'examPaused' : ''}`}>
                  {isFullExamMode && (
                    <div className="globalProgressBar">
                      <div className="globalProgressFill" style={{ width: `${fullExamProgressPercent}%` }} />
                      <span className="globalProgressLabel">{fullExamProgressPercent}% Complete</span>
                    </div>
                  )}
                  <div className="speakingTopToolbar">
                    <button type="button" className="backPillBtn dangerBtn" onClick={resetSession}>
                      Exit Exam
                    </button>
                    <div className="assessmentInfoPill">
                      {SPEAKING_MODE_LABELS[selectedTestMode]} Assessment
                    </div>
                    {isFullExamMode && <div className="assessmentInfoPill">{fullExamPhaseLabel}</div>}
                    {isFullExamMode && (
                      <button type="button" className={`pauseBtn ${isExamPaused ? 'pauseBtnActive' : ''}`} onClick={toggleExamPause}>
                        {isExamPaused ? `▶ Resume (${pauseTimeRemaining}s)` : '⏸ Pause'}
                      </button>
                    )}
                  </div>
                  {isExamPaused && (
                    <div className="examPausedOverlay">
                      <div className="examPausedCard">
                        <h3>⏸ Exam Paused</h3>
                        <p>Auto-resume in {pauseTimeRemaining} seconds</p>
                        <button type="button" onClick={toggleExamPause}>▶ Resume Now</button>
                      </div>
                    </div>
                  )}
                  <div className="speakingPanelLayout">
                    <section className="speakingPromptCard">
                      <p className="promptPill">{activeTopic.category}</p>
                      {isFullExamMode ? (
                        <>
                          <div className="card phaseInfoCard">
                            <p className="category">Current Phase</p>
                            <p className="phaseInfoText">{fullExamPhaseLabel}</p>
                          </div>
                          {fullExamPhase === 'part2_prep' ? (
                            <>
                              <h3>Part 2 Preparation (1 minute)</h3>
                              <p>{fullExamPlan.part2Prompt}</p>
                              <p className="promptSub">Write note now. It will appear during your 2-minute speaking.</p>
                              {renderRecommendationDropdown({
                                title: 'Part 2 vocabulary guide',
                                question: fullExamPlan.part2Prompt,
                                items: fullExamPart2Recommendations,
                                defaultOpen: true
                              })}
                              <label className="part2NotebookLiveWrap">
                                <span className="part2NotebookLabel">Part 2 Notebook</span>
                                <textarea
                                  className="part2NotebookTextarea"
                                  value={prepNotePart2}
                                  onChange={(event) => setPrepNotePart2(event.target.value)}
                                  placeholder="จด keyword, โครงเรื่อง, และตัวอย่างสั้น ๆ ตรงนี้..."
                                />
                                <p className="part2NotebookHint">
                                  คุณสามารถพิมพ์โน้ตในสมุดบนคอมพิวเตอร์ได้ หรือหยิบสมุดจริงของคุณมาจดพร้อมกันก็ได้
                                </p>
                              </label>
                            </>
                          ) : fullExamPhase === 'rest' ? (
                            <div className="restPeriodCard">
                              <h3>😌 พักสักครู่</h3>
                              <p className="restPeriodMessage">Part 2 เสร็จแล้ว! ผ่อนคลายก่อนไป Part 3 นะ</p>
                              <div className="restPeriodTips">
                                <p>💡 สูดหายใจลึก ๆ</p>
                                <p>💡 ทบทวน Part 3 notes ในหัว</p>
                                <p>💡 Part 3 จะถามเรื่องทั่วไปที่เกี่ยวกับ topic Part 2</p>
                              </div>
                              <div className="restCountdownRing">
                                <span>{fullExamPhaseSeconds}</span>
                              </div>
                            </div>
                          ) : (
                            <>
                              <h3>
                                {fullExamPhase === 'part1'
                                  ? `Part 1 - Question ${fullExamPart1Index + 1}/${fullExamPlan.part1Questions.length}`
                                  : fullExamPhase === 'part3'
                                    ? `Part 3 - Question ${fullExamPart3Index + 1}/${fullExamPlan.part3Questions.length}`
                                    : 'Part 2 - Speaking (2 minutes)'}
                              </h3>
                              {fullExamPhase === 'part2_speaking' ? (
                                <>
                                  <p className="promptSub">Part 2 Main Question</p>
                                  <p className="part2BigQuestion">{fullExamPlan.part2Prompt}</p>
                                  <p className="promptSub">Cover: what happened, details, and why it matters to you.</p>
                                  {renderRecommendationDropdown({
                                    title: 'Part 2 speaking vocabulary',
                                    question: fullExamPlan.part2Prompt,
                                    items: fullExamPart2Recommendations,
                                    compact: true
                                  })}
                                </>
                              ) : (
                                <>
                                  <p>{fullExamCurrentQuestion}</p>
                                  {fullExamPhase === 'part1' &&
                                    renderRecommendationDropdown({
                                      title: 'Part 1 vocabulary guide',
                                      question: fullExamCurrentQuestion,
                                      items: fullExamCurrentPart1Recommendations,
                                      compact: true
                                    })}
                                  {fullExamPhase === 'part3' &&
                                    renderRecommendationDropdown({
                                      title: 'Part 3 speaking guide',
                                      question: fullExamCurrentQuestion,
                                      items: fullExamCurrentPart3Recommendations,
                                      compact: true
                                    })}
                                </>
                              )}
                              {fullExamPhase === 'part1' && (
                                <p className="promptSub">
                                  Next: {fullExamPart1Index >= fullExamPlan.part1Questions.length - 1 ? 'Part 2 note prep' : 'Next Part 1 question'}
                                </p>
                              )}
                              {fullExamPhase === 'part2_speaking' && (
                                <p className="promptSub">Next: 30-second rest, then Part 3.</p>
                              )}
                              {fullExamPhase === 'part3' && (
                                <p className="promptSub">
                                  Next: {fullExamPart3Index >= fullExamPlan.part3Questions.length - 1 ? 'Finish and evaluate' : 'Next Part 3 question'}
                                </p>
                              )}
                            </>
                          )}
                        </>
                      ) : isQuestionByQuestionMode ? (
                        <>
                          <h3>
                            Question {currentQuestionIndex + 1}/{activeQuestionList.length}
                          </h3>
                          <p>{activeQuestion}</p>
                          {renderRecommendationDropdown({
                            title: selectedTestMode === 'part1' ? 'Part 1 vocabulary guide' : 'Part 3 speaking guide',
                            question: activeQuestion,
                            items: currentQuestionRecommendations,
                            compact: true
                          })}
                          <p className="promptSub">Upcoming questions:</p>
                          <ul>
                            {activeQuestionList
                              .slice(currentQuestionIndex + 1, currentQuestionIndex + 4)
                              .map((question) => (
                                <li key={question}>{question}</li>
                              ))}
                          </ul>
                        </>
                      ) : (
                        <>
                          <h3>{activeTopic.prompt}</h3>
                          <p className="promptSub">You should say:</p>
                          <ul>
                            {activeTopic.cues.map((cue) => (
                              <li key={cue}>{cue}</li>
                            ))}
                          </ul>
                          {renderRecommendationDropdown({
                            title: 'Part 2 vocabulary guide',
                            question: activeTopic.prompt,
                            items: standalonePart2Recommendations,
                            compact: true
                          })}
                        </>
                      )}
                      <div className="liveNoteCard">
                        <p className="sectionLabel">
                          {isFullExamMode || isQuestionByQuestionMode ? 'Current Note For' : 'Your Preparation Note'}
                        </p>
                        {(isFullExamMode || isQuestionByQuestionMode) && (
                          <p className="questionNotePrompt questionNotePrompt-live">{activeLiveNoteTitle}</p>
                        )}
                        <p className="handNoteText">
                          {activeSpeakingNote || 'No note yet. Add a quick note in preparation time.'}
                        </p>
                      </div>
                    </section>

                    <section className="speakingControlCard">
                      <div className="recordingPill">
                        <span className="recordingDot" />
                        {isExamPaused ? 'Paused' : 'Live Recording'}
                      </div>
                      <p className={`bigTimer ${isLowTime ? 'bigTimerLow' : ''}`}>
                        {Math.floor(
                          (isFullExamMode ? fullExamPhaseSeconds : isQuestionByQuestionMode ? remainingQuestionSeconds : remainingTalkSeconds) / 60
                        )
                          .toString()
                          .padStart(2, '0')}
                        :
                        {((isFullExamMode ? fullExamPhaseSeconds : isQuestionByQuestionMode ? remainingQuestionSeconds : remainingTalkSeconds) % 60)
                          .toString()
                          .padStart(2, '0')}
                      </p>
                      {isLowTime && <p className="lowTimeWarning">⚠️ เหลือเวลาน้อย!</p>}
                      <div className={`audioBars ${isExamPaused ? 'audioBarsPaused' : ''}`} aria-hidden="true">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <span
                            key={`bar-${i}`}
                            className="audioBar"
                            style={{ animationDuration: `${380 + i * 23}ms` }}
                          />
                        ))}
                      </div>
                      <div className="controls speakingControls">
                        {isFullExamMode ? (
                          <button
                            type="button"
                            className="primaryNextBtn"
                            onClick={() => {
                              if (promptAnswerReview()) return
                              void doneCurrentFullExamPhase()
                            }}
                          >
                            {fullExamPhase === 'part3' && fullExamPart3Index >= fullExamPlan.part3Questions.length - 1
                              ? "✓ Finish Exam"
                              : "✓ Done, Next →"}
                          </button>
                        ) : isQuestionByQuestionMode ? (
                          <button
                            type="button"
                            className="primaryNextBtn"
                            onClick={() => {
                              if (promptAnswerReview()) return
                              void doneCurrentQuestion()
                            }}
                          >
                            {currentQuestionIndex >= activeQuestionList.length - 1
                              ? "✓ Finish"
                              : "✓ Next Question →"}
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="primaryNextBtn"
                            onClick={() => {
                              if (selectedTestMode === 'part2' && promptAnswerReview()) return
                              void finishSpeakingAndAssess()
                            }}
                          >
                            ✓ Finish and Assess
                          </button>
                        )}
                      </div>
                      {canReviewScriptBeforeSubmission && (
                        <button
                          type="button"
                          className="reviewScriptBtn"
                          onClick={() => void openScriptReviewBeforeAssessment()}
                        >
                          I want to review my script first
                        </button>
                      )}
                      <div className="liveTranscriptBox liveTranscriptBoxLarge">
                        <div className="liveTranscriptHeader">
                          <span className="liveTranscriptTitle">Live Transcript</span>
                          <span className={isTranscribing ? 'transcriptStatusLive' : 'transcriptStatusIdle'}>
                            {isTranscribing ? 'LISTENING | พูดได้เลย examiner กำลังฟังครับ' : 'Stopped'}
                          </span>
                          <span className="transcriptWordCount">
                            {currentTranscriptWordCount} words
                          </span>
                        </div>
                        <div className="liveTranscriptContent">
                          <p className="liveTranscriptHint">
                            พิมพ์หรือวางคำตอบได้เลยถ้าไม่อยากพูดซ้ำหลายรอบ ระบบจะใช้ข้อความในกล่องนี้เป็น transcript ปัจจุบันของคุณ
                          </p>
                          <textarea
                            className="liveTranscriptTextarea"
                            value={transcript}
                            onChange={(event) => setTranscript(event.target.value)}
                            placeholder="Your live browser transcription will appear here while speaking, or you can paste your answer here..."
                          />
                          {interimTranscript && <p className="interim">{interimTranscript}</p>}
                        </div>
                      </div>
                      {currentLengthThresholds.length > 0 && (
                        <div className="liveLengthGuide">
                          <div className="liveLengthGuideHeader">
                            <div>
                              <p className="liveLengthGuideEyebrow">Live Length Guide</p>
                              <h4>
                                {activeLengthGuideMode === 'part2'
                                  ? 'ความยาวสำหรับ Part 2'
                                  : 'ความยาวต่อข้อนี้มีผลต่อ Fluency band'}
                              </h4>
                            </div>
                            <span className="liveLengthGuideCount">{currentTranscriptWordCount} words now</span>
                          </div>
                          <div className="liveLengthGuideGrid">
                            {currentLengthThresholds.map((item) => (
                              <div
                                key={`${activeLengthGuideMode}-${item.band}`}
                                className={`liveLengthGuideCard ${currentTranscriptWordCount >= item.minWords ? 'liveLengthGuideCard-hit' : ''}`}
                              >
                                <span className="liveLengthGuideBand">{item.band}</span>
                                <strong>{item.minWords}+ words</strong>
                                <p>
                                  {currentTranscriptWordCount >= item.minWords
                                    ? 'ถึงเกณฑ์ความยาวแล้ว'
                                    : `ยังขาดอีก ${item.minWords - currentTranscriptWordCount} words`}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {transcriptionError && <p className="error">{transcriptionError}</p>}
                      {audioError && <p className="error">{audioError}</p>}
                      <p className="meta">
                        Audio: {isRecordingAudio ? `🔴 Recording (${recordingDuration}s)` : 'Stopped'}
                      </p>
                    </section>
                  </div>
                </div>
              )}

              {attemptStage === 'assessing' && (
                <div className="stageCard loadingStageCard">
                  <h3>Preparing your report...</h3>
                </div>
              )}

              {attemptStage === 'result' && (
                <>
                  {assessmentError && <p className="error">{assessmentError}</p>}
                  {assessmentResult && (
                    <div className="reportShowcase">
                      <aside className="promptBrief">
                        <p className="promptTag">
                          {selectedTestMode === 'full'
                            ? 'Full Mock Prompt'
                            : selectedTestMode === 'part1'
                              ? 'Part 1 Prompt'
                              : selectedTestMode === 'part3'
                                ? 'Part 3 Prompt'
                                : 'Part 2 Prompt'}
                        </p>
                        <h3>{resultTopicContext?.prompt}</h3>
                        <ul>
                          {(resultTopicContext?.cues ?? []).map((cue) => (
                            <li key={cue}>{cue}</li>
                          ))}
                        </ul>
                      </aside>
                      <div className="stageCard resultCard">
                        <div className="providerTabs">
                          {(['gemini'] as const).map((providerName) => {
                            const hasReport = Boolean(assessmentResult.comparisons?.[providerName])
                            return (
                              <button
                                key={providerName}
                                type="button"
                                className={selectedProvider === providerName ? 'active' : ''}
                                disabled={!hasReport}
                                onClick={() => setSelectedProvider(providerName)}
                              >
                                {formatReportProviderLabel(providerName)}
                              </button>
                            )
                          })}
                        </div>
                        {(() => {
                          const activeReport =
                            assessmentResult.comparisons?.[selectedProvider] ?? assessmentResult
                          const overallBand = activeReport.totalScore ?? activeReport.overallBand
                          const isMockFullReport = Boolean(activeReport.mockFullReport)
                          const criteriaItems = [
                            { label: 'Fluency', value: activeReport.criteria.fluency },
                            { label: 'Vocabulary', value: activeReport.criteria.lexical },
                            { label: 'Grammar', value: activeReport.criteria.grammar }
                          ]
                          const computeTargetBand = (band: number) =>
                            Math.min(9, band >= 9 ? 9 : band % 1 === 0.5 ? Math.ceil(band) : band + 1)
                          const topFixes: Array<{ label: string; title: string; detail: string }> = []
                          if (isMockFullReport && activeReport.mockFullReport) {
                            const mfr = activeReport.mockFullReport
                            const pickFirst = (
                              label: string,
                              list?: Array<{ quote: string; fix: string }>
                            ) => {
                              const first = (list || [])[0]
                              if (first && first.quote && first.fix) {
                                topFixes.push({ label, title: first.quote, detail: first.fix })
                              }
                            }
                            pickFirst('Fluency (Part 2)', mfr.section2.fluencyReport?.plusOneChecklist)
                            pickFirst('Vocabulary (Part 3)', mfr.section3.lexicalReport?.plusOneChecklist)
                            pickFirst('Grammar (Part 3)', mfr.section3.grammarReport?.plusOneChecklist)
                            if (
                              topFixes.length === 0 &&
                              mfr.section2.fluencyReport?.plusOnePlan?.[0]
                            ) {
                              const plan = mfr.section2.fluencyReport.plusOnePlan[0]
                              topFixes.push({
                                label: 'Fluency',
                                title: plan.quote,
                                detail: plan.fix
                              })
                            }
                          } else if (activeReport.componentReports) {
                            const cr = activeReport.componentReports
                            ;([
                              ['Grammar', cr.grammar],
                              ['Vocabulary', cr.lexical],
                              ['Fluency', cr.fluency]
                            ] as const).forEach(([lbl, rep]) => {
                              const first = rep?.plusOneChecklist?.[0] || rep?.plusOnePlan?.[0]
                              if (first && first.quote && first.fix) {
                                topFixes.push({ label: lbl, title: first.quote, detail: first.fix })
                              }
                            })
                          }
                          const vocabSuggestions = activeReport.vocabularyLevelUpSuggestions || []
                          const vocabLevelOrder = ['B1', 'B2', 'C1', 'C2', 'A2', 'A1']
                          const vocabByLevel: Record<string, typeof vocabSuggestions> = {}
                          for (const v of vocabSuggestions) {
                            const lvl = (v.level || 'Other').toUpperCase()
                            if (!vocabByLevel[lvl]) vocabByLevel[lvl] = []
                            vocabByLevel[lvl].push(v)
                          }
                          const vocabGroupKeys = [
                            ...vocabLevelOrder.filter((k) => vocabByLevel[k]?.length),
                            ...Object.keys(vocabByLevel).filter((k) => !vocabLevelOrder.includes(k))
                          ]
                          return (
                            <>
                              <div className="reportV2">
                              <div className="reportStickyBar">
                                <div className="reportStickyMain">
                                  <div>
                                    <p className="reportStickyEyebrow">Overall Band</p>
                                    <p className="reportStickyBand">{overallBand.toFixed(1)}</p>
                                  </div>
                                  <div className="reportStickyChips">
                                    {criteriaItems.map((item) => (
                                      <span key={item.label} className="reportStickyChip">
                                        {item.label} <strong>{item.value.toFixed(1)}</strong>
                                      </span>
                                    ))}
                                    <span className="reportStickyChip" title="Provider">
                                      {formatReportProviderLabel(activeReport.provider)}
                                    </span>
                                  </div>
                                </div>
                              <div className="reportStickyActions">
                                <button
                                  type="button"
                                  onClick={() => saveFullReportToNotebook(activeReport)}
                                >
                                  Save Full Report
                                </button>
                              </div>
                            </div>
                              {notebookSaveNotice && <p className="meta authSuccess">{notebookSaveNotice}</p>}
                              <section className="reportDisclaimerCard">
                                <p>
                                  This is just estimation based on your performance today. In the real exam, you might get a higher or lower score. The goal is to see your weakness and a realistic way to improve.
                                </p>
                              </section>
                              {!isMockFullReport &&
                                selectedTestMode === 'part3' &&
                                (activeReport.part3AnswerCoaching || []).length > 0 && (
                                  <section className="part3CoachPanel">
                                    <header className="part3CoachHeader">
                                      <div>
                                        <p className="nextAttemptEyebrow">Part 3 answer gaps</p>
                                        <h4>สิ่งที่ยังขาดในแต่ละคำตอบ</h4>
                                      </div>
                                      <span>{activeReport.part3AnswerCoaching?.length || 0} answers</span>
                                    </header>
                                    <div className="part3CoachList">
                                      {(activeReport.part3AnswerCoaching || []).map((item, idx) => (
                                        <article key={`part3-coach-${idx}`} className="part3CoachItem">
                                          <p className="part3CoachQuestion">{item.question}</p>
                                          <ul className="part3CoachMissingList">
                                            {item.missing.map((missingLabel) => (
                                              <li key={`${item.question}-${missingLabel}`}>{missingLabel}</li>
                                            ))}
                                          </ul>
                                          <p className="part3CoachSuggestion">{item.suggestionThai}</p>
                                        </article>
                                      ))}
                                    </div>
                                  </section>
                                )}
                              {topFixes.length > 0 && (
                                <aside className="topFixesPanel">
                                  <header className="topFixesHeader">
                                    <h4>เริ่มแก้จากนี่ก่อน — ลำดับสำคัญที่สุด</h4>
                                    <span>{topFixes.length} priorities</span>
                                  </header>
                                  <ol className="topFixesList">
                                    {topFixes.map((fix, idx) => (
                                      <li key={`top-fix-${idx}`} className="topFixItem">
                                        <span className="topFixIndex">{idx + 1}</span>
                                        <div className="topFixBody">
                                          <p className="topFixLabel">{fix.label}</p>
                                          <p className="topFixTitle">{fix.title}</p>
                                          <p className="topFixDetail">{fix.detail}</p>
                                        </div>
                                      </li>
                                    ))}
                                  </ol>
                                </aside>
                              )}
                              <div className="notebookQuickAddBar">
                                <p className="sectionLabel">Save +1 actions to notebook section</p>
                                <select
                                  value={selectedNotebookSection}
                                  onChange={(event) => setSelectedNotebookSection(event.target.value)}
                                >
                                  {notebookSectionTabs.map((sectionName) => (
                                    <option key={sectionName} value={sectionName}>
                                      {sectionName.charAt(0).toUpperCase() + sectionName.slice(1)}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              {isMockFullReport && activeReport.mockFullReport ? (
                                <>
                                  <section className="sectionV2 sectionV2Tone-warm">
                                    <header className="sectionV2Top">
                                      <div>
                                        <p className="sectionV2Eyebrow">Part 1 / The Baseline</p>
                                        <h4 className="sectionV2Title">{activeReport.mockFullReport.section1.title}</h4>
                                      </div>
                                      <div className="sectionV2HeaderRight">
                                        <span className="bandPill">Baseline</span>
                                      </div>
                                    </header>
                                    <div className="sectionV2Body">
                                      <div className="insightV2">
                                        {activeReport.mockFullReport.section1.introThai && (
                                          <p>{activeReport.mockFullReport.section1.introThai}</p>
                                        )}
                                        {activeReport.mockFullReport.section1.analysisThai && (
                                          <p>{activeReport.mockFullReport.section1.analysisThai}</p>
                                        )}
                                      </div>
                                      <div className="subBlockV2">
                                        <div className="subBlockHeader">
                                          <h5>Grammar Evidence</h5>
                                          <span className="subBlockCount">
                                            {(activeReport.mockFullReport.section1.grammarMistakes || []).length} ข้อ
                                          </span>
                                        </div>
                                        {(activeReport.mockFullReport.section1.grammarMistakes || []).length > 0 ? (
                                          <div className="suggestionGridV2">
                                            {activeReport.mockFullReport.section1.grammarMistakes.map((item, idx) => (
                                              <article key={`mock-s1-${idx}`} className="mistakeCardV2">
                                                <p className="mockMistakeIssue">{item.issue}</p>
                                                <p className="quoteText">Evidence: {item.evidence || 'N/A'}</p>
                                                <p className="fixText">ข้อแนะนำ: {item.suggestion || 'N/A'}</p>
                                                <button
                                                  type="button"
                                                  className="saveNotebookBtn"
                                                  onClick={() =>
                                                    savePlanToNotebook({
                                                      criterion: 'Part 1 Grammar',
                                                      quote: item.evidence || item.issue,
                                                      fix: item.suggestion || item.issue
                                                    })
                                                  }
                                                >
                                                  Add to Notebook
                                                </button>
                                              </article>
                                            ))}
                                          </div>
                                        ) : (
                                          <p className="analysisText">ไม่พบ grammar issue สำคัญจาก Part 1 ในรอบนี้</p>
                                        )}
                                      </div>
                                    </div>
                                  </section>

                                  {(
                                    [
                                      [
                                        'section2',
                                        'Fluency',
                                        'Part 2',
                                        'blue',
                                        activeReport.mockFullReport.section2.fluencyReport,
                                        activeReport.mockFullReport.section2.title,
                                        activeReport.mockFullReport.section2.introThai,
                                        activeReport.mockFullReport.section2.analysisThai
                                      ],
                                      [
                                        'section3-lexical',
                                        'Vocabulary',
                                        'Part 3',
                                        'green',
                                        activeReport.mockFullReport.section3.lexicalReport,
                                        activeReport.mockFullReport.section3.title,
                                        activeReport.mockFullReport.section3.introThai,
                                        activeReport.mockFullReport.section3.analysisThai
                                      ],
                                      [
                                        'section3-grammar',
                                        'Grammar',
                                        'Part 3',
                                        'navy',
                                        activeReport.mockFullReport.section3.grammarReport,
                                        activeReport.mockFullReport.section3.title,
                                        activeReport.mockFullReport.section3.introThai,
                                        activeReport.mockFullReport.section3.analysisThai
                                      ]
                                    ] as const
                                  ).map(([key, label, partLabel, tone, report, sectionTitle, introThai, analysisThai]) => {
                                    if (!report) return null
                                    const targetBand = computeTargetBand(report.band)
                                    return (
                                      <section key={key} className={`sectionV2 sectionV2Tone-${tone}`}>
                                        <header className="sectionV2Top">
                                          <div>
                                            <p className="sectionV2Eyebrow">{partLabel} / {label}</p>
                                            <h4 className="sectionV2Title">{sectionTitle}</h4>
                                          </div>
                                          <div className="sectionV2HeaderRight">
                                            <span className="bandPill">Band {report.band.toFixed(1)}</span>
                                            <span className="targetBandPill">Target {targetBand.toFixed(1)}</span>
                                          </div>
                                        </header>
                                        <div className="sectionV2Body">
                                          <div className="bandGapBar" aria-hidden="true">
                                            <div
                                              className="bandGapFill"
                                              style={{ width: `${(Math.min(report.band, 9) / 9) * 100}%` }}
                                            />
                                            <span
                                              className="bandGapMark"
                                              style={{ left: `${(targetBand / 9) * 100}%` }}
                                            >
                                                เป้าหมาย
                                            </span>
                                          </div>
                                          <div className="insightV2">
                                            {introThai && <p>{introThai}</p>}
                                            {(key === 'section2' ? analysisThai : report.explanationThai) && (
                                              <p>{key === 'section2' ? analysisThai : report.explanationThai}</p>
                                            )}
                                          </div>
                                          {renderReportTicks(String(key), 'เกณฑ์ของ Band นี้ (Checklist)', report.requiredTicks)}
                                          {renderNextBandCriteria(String(key), targetBand, report.plusOneChecklist || [])}
                                          {report.plusOnePlan?.length > 0 && (
                                            <div className="subBlockV2">
                                              <div className="subBlockHeader">
                                                <h5>ข้อเสนอแนะที่ทำได้ทันที</h5>
                                                <span className="subBlockCount">{report.plusOnePlan.length} ข้อ</span>
                                              </div>
                                              <div className="suggestionGridV2">
                                                {report.plusOnePlan.map((plan, idx) => (
                                                  <article key={`${key}-plan-${idx}`} className="suggestionCardV2">
                                                    <p className="quoteText">"{plan.quote}"</p>
                                                    <p className="fixText">{plan.fix}</p>
                                                    {plan.thaiMeaning && <p className="meta">TH: {plan.thaiMeaning}</p>}
                                                    <button
                                                      type="button"
                                                      className="saveNotebookBtn"
                                                      onClick={() =>
                                                        savePlanToNotebook({
                                                          criterion: label,
                                                          quote: plan.quote,
                                                          fix: plan.fix,
                                                          thaiMeaning: plan.thaiMeaning
                                                        })
                                                      }
                                                    >
                                                      Save
                                                    </button>
                                                  </article>
                                                ))}
                                              </div>
                                            </div>
                                          )}
                                          {renderUnlockChecklist(String(key), targetBand, report.plusOneChecklist || [])}
                                        </div>
                                      </section>
                                    )
                                  })}
                                </>
                              ) : (
                                activeReport.componentReports && (
                                  <>
                                    {(
                                      [
                                        ['grammar', 'Grammar', 'navy'],
                                        ['lexical', 'Vocabulary', 'green'],
                                        ['fluency', 'Fluency', 'blue']
                                      ] as const
                                    ).map(([key, label, tone]) => {
                                      const report = activeReport.componentReports?.[key]
                                      if (!report) return null
                                      const targetBand = computeTargetBand(report.band)
                                      return (
                                        <section key={key} className={`sectionV2 sectionV2Tone-${tone}`}>
                                          <header className="sectionV2Top">
                                            <div>
                                              <p className="sectionV2Eyebrow">เกณฑ์ประเมิน</p>
                                              <h4 className="sectionV2Title">{label}</h4>
                                            </div>
                                            <div className="sectionV2HeaderRight">
                                              <span className="bandPill">Band {report.band.toFixed(1)}</span>
                                              <span className="targetBandPill">เป้าหมาย {targetBand.toFixed(1)}</span>
                                            </div>
                                          </header>
                                          <div className="sectionV2Body">
                                            <div className="bandGapBar" aria-hidden="true">
                                              <div
                                                className="bandGapFill"
                                                style={{ width: `${(Math.min(report.band, 9) / 9) * 100}%` }}
                                              />
                                              <span
                                                className="bandGapMark"
                                                style={{ left: `${(targetBand / 9) * 100}%` }}
                                              >
                                                เป้าหมาย
                                              </span>
                                            </div>
                                            <div className="insightV2">
                                              {report.explanationThai && <p>{report.explanationThai}</p>}
                                            </div>
                                            {renderReportTicks(String(key), 'เกณฑ์ของ Band นี้ (Checklist)', report.requiredTicks)}
                                            {renderNextBandCriteria(String(key), targetBand, report.plusOneChecklist || [])}
                                            {report.plusOnePlan?.length > 0 && (
                                              <div className="subBlockV2">
                                                <div className="subBlockHeader">
                                                  <h5>ข้อเสนอแนะที่ทำได้ทันที</h5>
                                                  <span className="subBlockCount">{report.plusOnePlan.length} ข้อ</span>
                                                </div>
                                                <div className="suggestionGridV2">
                                                  {report.plusOnePlan.map((plan, idx) => (
                                                    <article key={`${key}-plan-${idx}`} className="suggestionCardV2">
                                                      <p className="quoteText">"{plan.quote}"</p>
                                                      <p className="fixText">{plan.fix}</p>
                                                      {plan.thaiMeaning && <p className="meta">TH: {plan.thaiMeaning}</p>}
                                                      <button
                                                        type="button"
                                                        className="saveNotebookBtn"
                                                        onClick={() =>
                                                          savePlanToNotebook({
                                                            criterion: label,
                                                            quote: plan.quote,
                                                            fix: plan.fix,
                                                            thaiMeaning: plan.thaiMeaning
                                                          })
                                                        }
                                                      >
                                                        Save
                                                      </button>
                                                    </article>
                                                  ))}
                                                </div>
                                              </div>
                                            )}
                                            {renderUnlockChecklist(String(key), targetBand, report.plusOneChecklist || [])}
                                          </div>
                                        </section>
                                      )
                                    })}
                                  </>
                                )
                              )}
                              {vocabSuggestions.length > 0 && (
                                <div className="vocabV2">
                                  <header className="vocabV2Header">
                                    <div>
                                      <p className="vocabV2Eyebrow">Vocabulary Lift</p>
                                      <h4>คำอัปเกรดจากคำตอบจริงของคุณ</h4>
                                    </div>
                                    <span className="vocabV2Pill">{vocabSuggestions.length} ข้อเสนอแนะ</span>
                                  </header>
                                  <div className="vocabV2Body">
                                    {vocabGroupKeys.map((level) => (
                                      <div key={`vocab-group-${level}`} className="vocabV2Group">
                                        <div className="vocabV2GroupHeader">
                                          {level} Upgrades
                                          <span className="vocabV2GroupCount">{vocabByLevel[level].length} จุด</span>
                                        </div>
                                        <div className="vocabV2Grid">
                                          {vocabByLevel[level].map((item, idx) => (
                                            <article key={`vocab-${level}-${idx}`} className="vocabV2Item">
                                              <div className="vocabUpgradeWords">
                                                <span className="vocabFrom">{item.sourcePhrase}</span>
                                                <span className="vocabArrow">{'->'}</span>
                                                <span className="vocabTo">{item.replacement}</span>
                                              </div>
                                              <div className="vocabUpgradeMetaRow">
                                                <span className="vocabLevelBadge">{item.level}</span>
                                                <span className="vocabThai">{item.thaiMeaning}</span>
                                              </div>
                                              {item.sourceQuestion && <p className="meta">มาจากคำถาม: {item.sourceQuestion}</p>}
                                              <p className="fixText">{item.reasonThai}</p>
                                              <button
                                                type="button"
                                                className="saveNotebookBtn"
                                                onClick={() =>
                                                  savePlanToNotebook({
                                                    criterion: 'Vocabulary Upgrade',
                                                    quote: item.sourcePhrase,
                                                    fix: `Use ${item.level}: ${item.replacement}`,
                                                    thaiMeaning: `${item.replacement} = ${item.thaiMeaning}`
                                                  })
                                                }
                                              >
                                                Save
                                              </button>
                                            </article>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              <p className="modelNotes">
                                <strong>หมายเหตุ:</strong>{' '}
                                {String(activeReport.modelNotes || '').replace(
                                  /gemini(?:-2\.5-flash)?/gi,
                                  "english plan's database"
                                )}
                              </p>
                              {activeReport.punctuatedTranscript && (
                                <details className="transcriptV2">
                                  <summary>
                                    <span>Question-by-Question Transcript</span>
                                  </summary>
                                  <div className="transcriptV2Body">
                                    {activeReport.questionBreakdown && activeReport.questionBreakdown.length > 0 && (
                                      <div className="pronRiskBlock">
                                        <div className="pronRiskHeader">
                                          <h4>Question-by-question (punctuated)</h4>
                                        </div>
                                        {isFullExamMode ? (
                                          <>
                                            <div className="pronRiskHeader">
                                              <h4>Part 1</h4>
                                            </div>
                                            <div className="pronRiskList">
                                              {activeReport.questionBreakdown
                                                .slice(0, resultFullExamPlan.part1Questions.length)
                                                .map((item, idx) => (
                                                  <article key={`q-breakdown-p1-${idx}`} className="pronRiskItem">
                                                    <p className="pronRiskWord">Q{idx + 1}: {item.question || 'Question'}</p>
                                                    <p className="pronRiskReason">{item.punctuatedTranscript}</p>
                                                  </article>
                                                ))}
                                            </div>
                                            <div className="pronRiskHeader">
                                              <h4>Part 2</h4>
                                            </div>
                                            <div className="pronRiskList">
                                              {activeReport.questionBreakdown
                                                .slice(resultFullExamPlan.part1Questions.length, resultFullExamPlan.part1Questions.length + 1)
                                                .map((item, idx) => (
                                                  <article key={`q-breakdown-p2-${idx}`} className="pronRiskItem">
                                                    <p className="pronRiskWord">{item.question || 'Part 2'}</p>
                                                    <p className="pronRiskReason">{item.punctuatedTranscript}</p>
                                                  </article>
                                                ))}
                                            </div>
                                            <div className="pronRiskHeader">
                                              <h4>Part 3</h4>
                                            </div>
                                            <div className="pronRiskList">
                                              {activeReport.questionBreakdown
                                                .slice(resultFullExamPlan.part1Questions.length + 1)
                                                .map((item, idx) => (
                                                  <article key={`q-breakdown-p3-${idx}`} className="pronRiskItem">
                                                    <p className="pronRiskWord">Q{idx + 1}: {item.question || 'Question'}</p>
                                                    <p className="pronRiskReason">{item.punctuatedTranscript}</p>
                                                  </article>
                                                ))}
                                            </div>
                                          </>
                                        ) : (
                                          <div className="pronRiskList">
                                            {activeReport.questionBreakdown.map((item, idx) => (
                                              <article key={`q-breakdown-${idx}`} className="pronRiskItem">
                                                <p className="pronRiskWord">
                                                  Q{idx + 1}: {item.question || 'Question'}
                                                </p>
                                                {(item.annotations || []).length > 0 && (
                                                  <div className="answerAnnotationList">
                                                    {(item.annotations || []).map((annotation, annotationIdx) => (
                                                      <div
                                                        key={`annotation-${idx}-${annotationIdx}`}
                                                        className={`answerAnnotationBadge answerAnnotationBadge-${annotationBadgeTone(annotation.issueType)}`}
                                                      >
                                                        <strong>{annotation.label}</strong>
                                                        <span>{annotation.commentThai}</span>
                                                      </div>
                                                    ))}
                                                  </div>
                                                )}
                                                <p className="pronRiskReason">
                                                  {renderTranscriptWithAnnotations(
                                                    item.punctuatedTranscript,
                                                    item.annotations || []
                                                  )}
                                                </p>
                                              </article>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                    <div className="punctuatedTranscriptBox">
                                      <h5>Punctuated Submitted Text</h5>
                                      <p>{activeReport.punctuatedTranscript}</p>
                                    </div>
                                  </div>
                                </details>
                              )}
                              </div>
                            </>
                          )
                        })()}
                      </div>
                    </div>
                  )}

                  {audioUrl && (
                    <div className="audioBox audioBoxV2">
                      <div className="audioBoxHeader">
                        <h3>🎧 Your Recording</h3>
                        <p>Listen back and compare with the transcript</p>
                      </div>
                      <audio controls src={audioUrl} />
                    </div>
                  )}

                  <div className="reportNextSteps">
                    <h4>📋 Next Steps</h4>
                    <div className="nextStepsGrid">
                      <button
                        type="button"
                        className="nextStepCard"
                        onClick={() => {
                          setSelectedTestMode(selectedTestMode)
                          resetSession()
                        }}
                      >
                        <span className="nextStepIcon">🔄</span>
                        <span className="nextStepTitle">ลองใหม่อีกรอบ</span>
                        <span className="nextStepDesc">ฝึก topic เดิมจนชำนาญ</span>
                      </button>
                      <button
                        type="button"
                        className="nextStepCard"
                        disabled
                      >
                        <span className="nextStepIcon">📓</span>
                        <span className="nextStepTitle">Notebook (Coming Soon)</span>
                        <span className="nextStepDesc">ตอนนี้โฟกัสที่ Speaking ก่อน</span>
                      </button>
                      <button
                        type="button"
                        className="nextStepCard"
                        onClick={resetSession}
                      >
                        <span className="nextStepIcon">📚</span>
                        <span className="nextStepTitle">เลือก Topic ใหม่</span>
                        <span className="nextStepDesc">ฝึกหัวข้ออื่น</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          </section>
        ) : (
        <section className="panel full notebookPage">
          <div className="notebookHeader">
            <h2>Notebook</h2>
            <p>Save and organize improvement actions across Speaking, Writing, Listening, Reading, and custom sections.</p>
            {isNotebookHydrating ? (
              <p className="meta">Loading your synced notebook...</p>
            ) : notebookSyncError ? (
              <p className="meta">{notebookSyncError}</p>
            ) : authSession ? (
              <p className="meta">Notebook sync is connected to your Supabase account.</p>
            ) : null}
          </div>
          <div className="notebookTabs">
            {notebookSectionTabs.map((sectionName) => (
              <button
                key={sectionName}
                type="button"
                className={selectedNotebookSection === sectionName ? 'active' : ''}
                onClick={() => setSelectedNotebookSection(sectionName)}
              >
                {sectionName}
              </button>
            ))}
          </div>
          <div className="customSectionRow">
            <input
              type="text"
              placeholder="Create custom section (e.g. Business English)"
              value={newCustomSectionName}
              onChange={(event) => setNewCustomSectionName(event.target.value)}
            />
            <button type="button" onClick={addCustomSection}>
              Create
            </button>
          </div>
          {filteredNotebookEntries.length === 0 ? (
            <div className="emptyNotebook">
              <p>No saved items in this section yet.</p>
              <p>Use "Add to Notebook" in any "+1 band" recommendation.</p>
            </div>
          ) : (
            <div className="notebookGrid">
              {filteredNotebookEntries.map((entry) => (
                <article key={entry.id} className="notebookEntry">
                  <div className="notebookEntryMeta">
                    <span>{entry.section === 'custom' ? entry.customSectionName : entry.section}</span>
                    <span>{new Date(entry.createdAt).toLocaleString()}</span>
                  </div>
                  <h3>{entry.criterion}</h3>
                  <p className="meta">Topic: {entry.topicTitle}</p>
                  {entry.savedReportSnapshot ? (
                    <>
                      <p className="entryOriginal">"{entry.quote}"</p>
                      <p className="entryBetter">{entry.fix}</p>
                      <div className="controls">
                        <button
                          type="button"
                          className="primaryNextBtn"
                          onClick={() => openSavedReportSnapshot(entry.savedReportSnapshot!)}
                        >
                          Open Full Saved Report
                        </button>
                        <button
                          type="button"
                          className="removeNotebookBtn"
                          onClick={() => removeNotebookEntry(entry.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="entryOriginal">"{entry.quote}"</p>
                      <p className="entryBetter">{entry.fix}</p>
                      {entry.thaiMeaning && <p className="meta">TH: {entry.thaiMeaning}</p>}
                      <label className="noteFieldLabel">
                        Personal note
                        <textarea
                          value={entry.personalNote || ''}
                          onChange={(event) => updateNotebookPersonalNote(entry.id, event.target.value)}
                          placeholder="Write your own reminder, vocabulary note, or speaking strategy..."
                        />
                      </label>
                      <button
                        type="button"
                        className="removeNotebookBtn"
                        onClick={() => removeNotebookEntry(entry.id)}
                      >
                        Remove
                      </button>
                    </>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {attemptStage === 'assessing' && (
        <div className="loadingModalOverlay">
          <div className="loadingModalCard">
            <div className="loadingSpinnerWrap">
              <div className="loadingSpinnerRing" />
              <div className="loadingSpinnerCore">EP</div>
            </div>
            <div className="loadingPercent">
              {roundedAssessmentProgress}
              <span>%</span>
            </div>
            <div className="loadingBadge">Processing Analysis</div>
            <div className="loadingEta">
              {isFullMockAssessmentLoading ? (
                <>
                  <p>⏱️ Full Mock อาจใช้เวลาสูงสุด 5 นาที</p>
                  <p>เวลานับถอยหลัง: {formattedAssessmentCountdown}</p>
                </>
              ) : (
                roundedAssessmentProgress < 100 && (
                <p>⏱️ ประมาณ {Math.max(5, Math.round((100 - roundedAssessmentProgress) * 0.6))} วินาทีเหลือ</p>
                )
              )}
            </div>
            <div className="loadingSteps">
              <span className={roundedAssessmentProgress >= 10 ? 'loadingStepDone' : 'loadingStepActive'}>
                {roundedAssessmentProgress >= 10 ? '✓' : '1'} Transcribe
              </span>
              <span className={roundedAssessmentProgress >= 40 ? 'loadingStepDone' : roundedAssessmentProgress >= 10 ? 'loadingStepActive' : ''}>
                {roundedAssessmentProgress >= 40 ? '✓' : '2'} Analyze
              </span>
              <span className={roundedAssessmentProgress >= 70 ? 'loadingStepDone' : roundedAssessmentProgress >= 40 ? 'loadingStepActive' : ''}>
                {roundedAssessmentProgress >= 70 ? '✓' : '3'} Score
              </span>
              <span className={roundedAssessmentProgress >= 90 ? 'loadingStepDone' : roundedAssessmentProgress >= 70 ? 'loadingStepActive' : ''}>
                {roundedAssessmentProgress >= 90 ? '✓' : '4'} Report
              </span>
            </div>
            <div key={loadingPhraseCursor} className="loadingPhraseBox fade-text">
              <p className="loadingPhraseTh">{currentLoadingPhrase?.th}</p>
              <p className="loadingPhraseEn">{currentLoadingPhrase?.en}</p>
            </div>
            {latestRuntimeMessage && <p className="loadingRuntimeMessage">Live: {latestRuntimeMessage}</p>}
            <div className="loadingProgressTrack modalTrack">
              <div className="loadingProgressFill" style={{ width: `${assessmentProgress}%` }} />
            </div>
            <p className="loadingBackgroundHint">
              💡 คุณสามารถเปิดแท็บอื่นได้ระหว่างรอ เราจะแจ้งเตือนเมื่อเสร็จ
            </p>
          </div>
        </div>
      )}
      {(isFullExamMode && fullExamAnnouncement) && (
        <div className="fullExamOverlay" role="status" aria-live="assertive">
          <div className="fullExamOverlayCard">
            <p className="fullExamOverlayEyebrow">English Plan Full Mock</p>
            <p className="fullExamOverlayMessage">{fullExamAnnouncement}</p>
          </div>
        </div>
      )}
      {questionCountdown !== null && attemptStage === 'speaking' && (
        <div className="questionCountdownOverlay" role="status" aria-live="assertive">
          <div className="questionCountdownCard">
            <p className="questionCountdownLabel">{questionCountdownLabel}</p>
            <p className="questionCountdownNumber">{questionCountdown === 0 ? 'GO' : questionCountdown}</p>
          </div>
        </div>
      )}
      {pendingStartTopicId && (
        <div className="expectedScoreOverlay">
          <div className="expectedScoreCard">
            <p className="expectedScoreEyebrow">English Plan Speaking</p>
            <div className="expectedScoreHero">
              <h3>เลือกระดับคะแนนที่คุณคาดหวัง</h3>
              <p className="expectedScoreLead">Select Your Expected Score</p>
            </div>
            <div className="expectedScoreOptionGrid">
              {EXPECTED_SCORE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`expectedScoreOption ${selectedExpectedScore === option.id ? 'expectedScoreOption-active' : ''}`}
                  onClick={() => setSelectedExpectedScore(option.id)}
                  aria-pressed={selectedExpectedScore === option.id}
                >
                  <div className="expectedScoreOptionTop">
                    <p className="expectedScoreOptionTitle">{option.label}</p>
                    <p className="expectedScoreOptionSubtitle">{option.subtitle}</p>
                    <span className="expectedScoreOptionState">
                      {selectedExpectedScore === option.id ? 'เลือกแล้ว' : 'กดเพื่อเลือก'}
                    </span>
                  </div>
                  {'warning' in option && option.warning ? (
                    <p className="expectedScoreWarning">{option.warning}</p>
                  ) : (
                    <ul className="expectedScoreBullets">
                      {(option.bullets || []).map((bullet) => (
                        <li key={`${option.id}-${bullet.point}`}>
                          <strong>{bullet.point}</strong>
                          <span>{bullet.example}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </button>
              ))}
            </div>
            <div className="expectedScoreActions">
              <button type="button" className="expectedScoreBackBtn" onClick={closeExpectedScoreModal}>
                Back
              </button>
              <button
                type="button"
                className="expectedScoreReadyBtn"
                onClick={confirmExpectedScoreStart}
                disabled={!selectedExpectedScore}
              >
                I&apos;m Ready
              </button>
            </div>
          </div>
        </div>
      )}
      {answerReviewModal && (
        <div className="answerReviewOverlay">
          <div className="answerReviewCard">
            <p className="answerReviewEyebrow">{answerReviewModal.contextLabel}</p>
            <h3>Choose Your Next Step</h3>
            <p className="answerReviewLead">Review this answer before we move to the next question.</p>
            <div className="answerReviewQuestionCard">
              <p className="answerReviewQuestionLabel">Current Question</p>
              <p className="answerReviewQuestionText">{answerReviewModal.question}</p>
            </div>
            <p className="answerReviewSupport">
              If you feel this answer sounds clear enough, keep it. If you want a cleaner or longer answer, try this
              question again now.
            </p>
            <div className="answerReviewActions">
              <button type="button" className="answerReviewRetryBtn" onClick={() => void retryCurrentAnswer()}>
                I want to try again
              </button>
              <button type="button" className="answerReviewConfirmBtn" onClick={() => void confirmCurrentAnswer()}>
                I&apos;m happy with it now
              </button>
            </div>
          </div>
        </div>
      )}
      {scriptReviewModal && (
        <div className="scriptReviewOverlay">
          <div className="scriptReviewCard">
            <div className="scriptReviewHero">
              <p className="scriptReviewEyebrow">English Plan Script Review</p>
              <h3>{scriptReviewModal.title}</h3>
              <p className="scriptReviewLead">
                Don&apos;t worry about punctuation right now. ระบบจะเติม punctuation ให้อัตโนมัติตอนตรวจทีหลัง
                ให้โฟกัสแค่ spelling กับคำที่เราใช้ก่อนส่งตรวจครับ
              </p>
            </div>
            <div className="scriptReviewNotebook">
              <p className="scriptReviewNotebookLabel">Before submission</p>
              <p className="scriptReviewNotebookNote">{scriptReviewModal.noteThai}</p>
              <div className="scriptReviewQuestionList">
                {scriptReviewModal.items.map((item, index) => (
                  <article key={`script-review-${index}-${item.question}`} className="scriptReviewQuestionCard">
                    <p className="scriptReviewQuestionNumber">Question {index + 1}</p>
                    <p className="scriptReviewQuestionText">{item.question}</p>
                    <textarea
                      className="scriptReviewTextarea"
                      value={item.response}
                      onChange={(event) =>
                        setScriptReviewModal((current) =>
                          current
                            ? {
                                ...current,
                                items: current.items.map((currentItem, currentIndex) =>
                                  currentIndex === index
                                    ? { ...currentItem, response: event.target.value }
                                    : currentItem
                                )
                              }
                            : current
                        )
                      }
                      placeholder="เช็ก spelling และคำที่ใช้ แล้วแก้ตรงนี้ได้เลยก่อนส่งตรวจ..."
                    />
                  </article>
                ))}
              </div>
            </div>
            <div className="scriptReviewActions">
              <button type="button" className="scriptReviewBackBtn" onClick={closeScriptReviewModal}>
                Back to speaking
              </button>
              <button type="button" className="scriptReviewDoneBtn" onClick={() => void confirmScriptReviewAndAssess()}>
                I&apos;m done, start assessment
              </button>
            </div>
          </div>
        </div>
      )}
      {authSession?.role === 'student' && !supportModalOpen && (
        <button type="button" className="supportLauncher" onClick={openSupportModal}>
          รายงานปัญหา
        </button>
      )}
      {supportModalOpen && authSession?.role === 'student' && (
        <div className="supportOverlay">
          <div className="supportCard">
            <div className="supportHero">
              <p className="supportEyebrow">English Plan Support</p>
              <h3>รายงานปัญหา / Report a Problem</h3>
              <p className="supportLead">
                ถ้ามี bug, เนื้อหาผิด, เครดิตมีปัญหา หรืออะไรที่ทำให้ใช้งานสะดุด ส่งหา admin ได้ตรงนี้เลยครับ
              </p>
            </div>
            <div className="supportForm">
              <label>
                Current page
                <input type="text" value={activePage} readOnly />
              </label>
              <label>
                Category
                <select
                  value={supportCategoryInput}
                  onChange={(event) => setSupportCategoryInput(event.target.value as SupportReportCategory)}
                >
                  {(Object.entries(SUPPORT_REPORT_CATEGORY_LABELS) as Array<[SupportReportCategory, string]>).map(([value, label]) => (
                    <option key={`support-category-${value}`} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                What happened?
                <textarea
                  value={supportMessageInput}
                  onChange={(event) => setSupportMessageInput(event.target.value)}
                  rows={7}
                  placeholder="บอกสั้น ๆ ว่าคุณกดอะไรอยู่ หน้าไหนขึ้น error อะไร หรือสิ่งที่ควรเกิดแต่ไม่เกิด..."
                />
              </label>
              {supportFormError && <p className="authError">{supportFormError}</p>}
              {supportFormNotice && <p className="meta authSuccess">{supportFormNotice}</p>}
            </div>
            {recentStudentSupportReports.length > 0 && (
              <div className="supportHistory">
                <div className="supportHistoryHeader">
                  <div>
                    <p className="sectionLabel">Recent reports</p>
                    <h4>What you already sent</h4>
                  </div>
                </div>
                <div className="supportHistoryList">
                  {recentStudentSupportReports.map((report) => (
                    <article key={`support-history-${report.id}`} className="supportHistoryCard">
                      <div className="supportHistoryTop">
                        <span className="bandPill">{SUPPORT_REPORT_CATEGORY_LABELS[report.category]}</span>
                        <span className={`adminStatusPill adminStatusPill-${report.status}`}>
                          {SUPPORT_REPORT_STATUS_LABELS[report.status]}
                        </span>
                      </div>
                      <p className="meta">
                        {report.createdAt ? new Date(report.createdAt).toLocaleString() : 'Just now'} · page {report.pageContext}
                      </p>
                      <p>{report.message}</p>
                      {report.adminNote && (
                        <p className="supportAdminNote">Admin note: {report.adminNote}</p>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            )}
            <div className="supportActions">
              <button type="button" className="supportBackBtn" onClick={closeSupportModal}>
                Close
              </button>
              <button
                type="button"
                className="supportSendBtn"
                onClick={() => void submitSupportReport()}
                disabled={isSubmittingSupportReport}
              >
                {isSubmittingSupportReport ? 'Sending...' : 'Send to admin'}
              </button>
            </div>
          </div>
        </div>
      )}
      {creditWarning && (
        <div className="loadingModalOverlay">
          <div className="loadingModalCard">
            <h3>{creditWarning.title}</h3>
            <p className="meta">{creditWarning.message}</p>
            <div className="controls">
              <button type="button" onClick={() => setCreditWarning(null)}>
                เข้าใจแล้ว
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default App
