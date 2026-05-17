import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import './App.css'
import { ListeningSectionExamView } from './ListeningSectionExamView'
import {
  buildListeningSectionExamGroups,
  builderTaskToExamQuestion,
  foundationSetToExamConfig
} from './listeningSectionExamModel'
import { ParaphraseBridgeActions, PracticeActionToast, type PracticeActionToastState } from './PracticeActionToast'
import { parseListeningScriptSegments } from './listeningScriptReader'
import listeningWorkbookRaw from '../cambridge-listening-transcript-first-workbook.md?raw'
import listeningSectionBankRaw from '../cambridge-listening-sections-2-4-bank.md?raw'
import { CAMBRIDGE_10_SECTION_2_EXAM_SET } from './listeningBuilderCambridge10Section2'
import { CAMBRIDGE_10_SECTION_4_EXAM_SET } from './listeningBuilderCambridge10Section4'
import { CAMBRIDGE_11_SECTION_2_EXAM_SET } from './listeningBuilderCambridge11Section2'
import { CAMBRIDGE_11_SECTION_4_EXAM_SET } from './listeningBuilderCambridge11Section4'
import { CAMBRIDGE_12_SECTION_2_EXAM_SET } from './listeningBuilderCambridge12Section2'
import { CAMBRIDGE_12_SECTION_4_EXAM_SET } from './listeningBuilderCambridge12Section4'
import { CAMBRIDGE_13_SECTION_2_EXAM_SET } from './listeningBuilderCambridge13Section2'
import { CAMBRIDGE_13_SECTION_4_EXAM_SET } from './listeningBuilderCambridge13Section4'
import { CAMBRIDGE_14_SECTION_2_EXAM_SET } from './listeningBuilderCambridge14Section2'
import { CAMBRIDGE_14_SECTION_4_EXAM_SET } from './listeningBuilderCambridge14Section4'
import { CAMBRIDGE_16_SECTION_2_EXAM_SET } from './listeningBuilderCambridge16Section2'
import { CAMBRIDGE_17_SECTION_2_EXAM_SET } from './listeningBuilderCambridge17Section2'
import { CAMBRIDGE_17_SECTION_4_EXAM_SET } from './listeningBuilderCambridge17Section4'
import { CAMBRIDGE_17_LISTENING_FOUNDATION_SETS } from './listeningFoundationCambridge17Data'
import { CAMBRIDGE_18_SECTION_2_EXAM_SET } from './listeningBuilderCambridge18Section2'
import { LISTENING_FOUNDATION_SETS, type ListeningFoundationCategory } from './listeningFoundationData'
import { CAMBRIDGE_SAFE_LISTENING_FOUNDATION_SETS } from './listeningFoundationCambridgeSafeData'
import { CAMBRIDGE_12_LISTENING_FOUNDATION_SETS } from './listeningFoundationCambridge12Data'
import { CAMBRIDGE_13_LISTENING_FOUNDATION_SETS } from './listeningFoundationCambridge13Data'
import {
  CAMBRIDGE_12_SPEAKING_FULL_EXAM_TOPICS,
  CAMBRIDGE_12_SPEAKING_PART1_TOPICS,
  CAMBRIDGE_12_SPEAKING_PART3_TOPICS,
  CAMBRIDGE_13_SPEAKING_FULL_EXAM_TOPICS,
  CAMBRIDGE_13_SPEAKING_PART1_TOPICS,
  CAMBRIDGE_13_SPEAKING_PART3_TOPICS,
  CAMBRIDGE_SPEAKING_PART2_TOPICS
} from './speakingCambridge1213Data'
import {
  groupBuilderPacksByBook,
  groupFoundationSetsByBook,
  listBuilderBooks,
  listFoundationBooks,
  parseListeningFoundationSetMeta,
  type ListeningBankBookFilter
} from './listeningBankLayout'

const LISTENING_BUILDER_EXAM_SETS = [
  CAMBRIDGE_10_SECTION_2_EXAM_SET,
  CAMBRIDGE_10_SECTION_4_EXAM_SET,
  CAMBRIDGE_11_SECTION_2_EXAM_SET,
  CAMBRIDGE_11_SECTION_4_EXAM_SET,
  CAMBRIDGE_12_SECTION_2_EXAM_SET,
  CAMBRIDGE_12_SECTION_4_EXAM_SET,
  CAMBRIDGE_13_SECTION_2_EXAM_SET,
  CAMBRIDGE_13_SECTION_4_EXAM_SET,
  CAMBRIDGE_14_SECTION_2_EXAM_SET,
  CAMBRIDGE_14_SECTION_4_EXAM_SET,
  CAMBRIDGE_16_SECTION_2_EXAM_SET,
  CAMBRIDGE_17_SECTION_2_EXAM_SET,
  CAMBRIDGE_17_SECTION_4_EXAM_SET,
  CAMBRIDGE_18_SECTION_2_EXAM_SET
]

const ALL_LISTENING_FOUNDATION_SETS = [
  ...LISTENING_FOUNDATION_SETS,
  ...CAMBRIDGE_12_LISTENING_FOUNDATION_SETS.filter((set) => set.category === 'essential'),
  ...CAMBRIDGE_13_LISTENING_FOUNDATION_SETS.filter((set) => set.category === 'essential'),
  ...CAMBRIDGE_17_LISTENING_FOUNDATION_SETS.filter((set) => set.category === 'essential'),
  ...CAMBRIDGE_SAFE_LISTENING_FOUNDATION_SETS,
  ...CAMBRIDGE_12_LISTENING_FOUNDATION_SETS.filter((set) => set.category === 'advanced'),
  ...CAMBRIDGE_13_LISTENING_FOUNDATION_SETS.filter((set) => set.category === 'advanced'),
  ...CAMBRIDGE_17_LISTENING_FOUNDATION_SETS.filter((set) => set.category === 'advanced')
]

type Role = 'student' | 'admin' | 'trial'
type AppPage = 'home' | 'workspace' | 'reading' | 'listening' | 'listening_foundation_exam' | 'listening_builder_exam' | 'notebook' | 'admin'
type AdminWorkspaceSection = 'reading' | 'learners' | 'support' | 'analytics' | 'reports' | 'audio' | 'settings'
type NotebookSection = 'speaking' | 'writing' | 'listening' | 'reading' | 'custom'
type LearnerStatus = 'active' | 'inactive'
type ReadingBankCategory = 'normal' | 'advanced'
type ReadingWorkspaceMode = 'bank' | 'pdoy'
type ReadingPdoyLessonType = 'true-false-not-given' | 'yes-no-not-given' | 'multiple-choice' | 'fill-in-the-blank'
type ReadingPdoyLessonStep = 'intro' | 'evidence' | 'decide' | 'result' | 'complete'
type SupportReportCategory = 'bug' | 'account' | 'content' | 'billing' | 'other'
type SupportReportStatus = 'open' | 'in_progress' | 'resolved' | 'closed'

type ReadingQuestion = {
  number: number
  prompt: string
  correctAnswer: string
  answerType: 'true-false-not-given' | 'yes-no-not-given' | 'multiple-choice' | 'text'
  acceptedAnswers?: string[]
  answerGroup?: string
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

type AdminAssessmentReportSummary = {
  id: string
  userId: string | null
  learnerName: string
  learnerEmail: string
  testMode: SpeakingTestMode
  topicTitle: string
  topicCategory: string
  overallBand: number
  provider: string
  apiCostUsd: number
  totalTokens: number
  totalCalls: number
  createdAt: string | null
  objectPath: string
}

type AdminReadingPdoyProgressSummary = {
  userId: string | null
  learnerName: string
  learnerEmail: string
  lessonId: string
  lessonType: string
  examId: string
  examTitle: string
  category: ReadingBankCategory
  passageNumber: number
  passageTitle: string
  questionNumber: number
  questionPrompt: string
  step: ReadingPdoyLessonStep
  questionIndex: number
  sessionActive: boolean
  updatedAt: string | null
  objectPath: string
}

type ReadingReportItem = ReadingQuestion & {
  userAnswer: string
  isCorrect: boolean
}

type ReadingAttemptSummary = {
  examId: string
  examTitle: string
  category: ReadingBankCategory
  correctCount: number
  totalQuestions: number
  accuracy: number
  wrongCount: number
  completedAt: string
  reportItems: ReadingReportItem[]
}

type NormalReadingStage = {
  number: number
  title: string
  exams: ReadingExamRecord[]
  isUnlocked: boolean
  bestAccuracy: number
}

type ReadingPdoyLesson = {
  id: string
  examId: string
  examTitle: string
  category: ReadingBankCategory
  passageNumber: number
  passageTitle: string
  lessonType: ReadingPdoyLessonType
  questions: ReadingQuestion[]
}

type ReadingPdoyMultipleChoiceOption = {
  letter: string
  text: string
}

type ReadingMatchingGroupKind = 'heading' | 'information' | 'statement'

type ReadingMatchingGroup = {
  id: string
  kind: ReadingMatchingGroupKind
  start: number
  end: number
  instruction: string
  choiceLabel: string
  choiceOptions: ReadingPdoyMultipleChoiceOption[]
  questions: ReadingQuestion[]
}

type ReadingFillLineSegment =
  | { kind: 'text' | 'heading' | 'clue'; text: string }
  | { kind: 'blank'; questionNumber: number; before: string; after: string }

type ReadingFillDisplayLine = {
  segments: ReadingFillLineSegment[]
}

type ReadingFillQuestionGroup = {
  id: string
  start: number
  end: number
  instruction: string
  displayLines: ReadingFillDisplayLine[]
  questions: ReadingQuestion[]
}

type ReadingPdoyEvidenceOption = {
  id: string
  text: string
  isCorrect: boolean
}

type ReadingPdoyFillGrammarOption = {
  id: string
  label: string
  isCorrect: boolean
}

type ReadingPdoyFillWordMatchOption = {
  id: string
  text: string
  meaning: string
  isCorrect: boolean
}

type ReadingPdoyProgressSnapshot = {
  lessonId: string
  sessionActive: boolean
  step: ReadingPdoyLessonStep
  questionIndex: number
  evidenceInput: string
  decision: string
  selectedOption: string
  optionParaphraseInput: string
  feedback: string
  introChoice: string
  evidenceAttempts: number
  decisionAttempts: number
  fillMeaningOptionId?: string
}

type ListeningQuestion = {
  number: number
  prompt: string
  answerType: 'text' | 'multiple-choice'
  correctAnswer: string
  acceptedAnswers?: string[]
  options?: Array<{ key: string; text: string }>
  exactPortion: string
  explanationThai: string
  paraphrasedVocabulary: string
}

type ListeningExercise = {
  id: string
  title: string
  label: string
  summary: string
  level: string
  duration: string
  formatLabel: string
  instructionsThai: string
  playbackNoteThai: string
  audioScript: string[]
  questions: ListeningQuestion[]
}

type ListeningVocabularyBuilderItem = {
  id: string
  book: string
  bookNumber: number | null
  testNumber: number | null
  sectionNumber: number | null
  questionNumber: number
  questionPrompt: string
  answer: string
  transcript: string
  paraphraseType: string
  paraphraseLogic: string
  thaiExplanation: string
  thaiMeaning: string
}

type ListeningVocabularyBuilderPack = {
  id: string
  title: string
  bookNumber: number | null
  sectionNumber: number | null
  testNumbers: number[]
  items: ListeningVocabularyBuilderItem[]
  sectionTests: ListeningSectionBankTest[]
}

type ListeningSectionBankTest = {
  id: string
  bookNumber: number
  sectionNumber: number
  testNumber: number
  title: string
  questionCoverage: string[]
  answerLines: string[]
  vocabFocus: string[]
}

type ListeningOfficialResource = {
  id: string
  title: string
  source: string
  description: string
  url: string
  sampleType: string
}

type ListeningReportItem = ListeningQuestion & {
  userAnswer: string
  isCorrect: boolean
}

type ListeningAttemptSummary = {
  exerciseId: string
  exerciseTitle: string
  correctCount: number
  totalQuestions: number
  accuracy: number
  wrongCount: number
  completedAt: string
  reportItems: ListeningReportItem[]
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

type QuestionAudioCatalogItem = {
  key: string
  cacheKey: string
  section: 'Part 1' | 'Part 3'
  topicId: string
  topicTitle: string
  question: string
  audioUrl: string
}

type SpeakingTestMode = 'part1' | 'part2' | 'part3' | 'full'
type SpeakingEntryMode = 'practice' | 'full' | null
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
  apiUsage?: {
    provider: string
    totalCalls: number
    totalPromptTokens: number
    totalCompletionTokens: number
    totalTokens: number
    inputCostUsd: number
    outputCostUsd: number
    totalCostUsd: number
    pricingVersion?: {
      source: string
      verifiedAt: string
    }
    calls?: Array<{
      id: number
      provider: string
      operation: string
      model: string
      modelFamily: string
      promptTokenCount: number
      candidatesTokenCount: number
      totalTokenCount: number
      inputCostUsd: number
      outputCostUsd: number
      totalCostUsd: number
    }>
  }
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

const TRIAL_SPEAKING_TOPIC_ID = 'trial-speaking-funnel'
const TRIAL_SPEAKING_PROMPT = 'Describe something you own which is very important to you.'
const TRIAL_SPEAKING_PART2_CUES = [
  'where you got it from',
  'how long you have had it',
  'what you use it for',
  'and explain why it is important to you.'
]
const TRIAL_SPEAKING_PART3_QUESTIONS = [
  'What are popular types of advertising in today’s world?',
  'What type of media advertising do you like most?',
  'Do you think advertising influences what people buy?'
]
const TRIAL_SPEAKING_TOPIC: SpeakingTopic = {
  id: TRIAL_SPEAKING_TOPIC_ID,
  category: 'One-Time Trial Speaking',
  title: 'IELTS Speaking Trial',
  prompt: TRIAL_SPEAKING_PROMPT,
  cues: [
    ...TRIAL_SPEAKING_PART2_CUES,
    ...TRIAL_SPEAKING_PART3_QUESTIONS.map((question) => `Part 3 - ${question}`)
  ]
}

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
const READING_ATTEMPTS_KEY = 'ielts-reading-attempts'
const LISTENING_ATTEMPTS_KEY = 'ielts-listening-attempts'
const READING_PDOY_PROGRESS_KEY = 'ielts-reading-pdoy-progress'
const AUTH_SESSION_KEY = 'english-plan-auth-session'
const DEFAULT_FEEDBACK_CREDITS = 50
const DEFAULT_FULL_MOCK_CREDITS = 15

type CreditProfile = {
  name: string
  plan: 'VIP' | 'TRIAL'
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
  feedbackRemaining: 0,
  fullMockRemaining: 0
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

type ReadingAttemptsApiResponse = {
  attempts: Record<string, ReadingAttemptSummary>
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

type AdminReadingGeneratorQuestionType =
  | 'fill-in-the-blank'
  | 'summary-completion'
  | 'multiple-choice'
  | 'true-false-not-given'
  | 'yes-no-not-given'
  | 'matching-statements'
  | 'matching-features'
  | 'matching-heading'
  | 'matching-information'
  | 'matching-sentence-endings'

type AdminReadingGeneratorPassageConfig = {
  id: string
  title: string
  sourcePassage: string
  newTopic: string
  category: ReadingBankCategory
  questionTypes: AdminReadingGeneratorQuestionType[]
  questionCount: string
  requirements: string
}

type AdminReadingGeneratorValidationItem = {
  index: number
  title: string
  category: ReadingBankCategory
  ok: boolean
  warnings: string[]
  errors: string[]
  questionCount: number
  passageCount: number
}

type AdminReadingGeneratorValidationResult = {
  total: number
  valid: number
  invalid: number
  items: AdminReadingGeneratorValidationItem[]
}

const READING_CATEGORY_LABELS: Record<ReadingBankCategory, string> = {
  normal: 'Normal Reading',
  advanced: 'Advanced Reading'
}

const ADMIN_WORKSPACE_SECTIONS: Array<{
  id: AdminWorkspaceSection
  label: string
  description: string
}> = [
  { id: 'reading', label: 'Reading Generator', description: 'Create, check, and upload exams' },
  { id: 'learners', label: 'Learners', description: 'Access, credits, expiry' },
  { id: 'support', label: 'Support Inbox', description: 'Student issue reports' },
  { id: 'analytics', label: 'Analytics', description: 'Usage and cost' },
  { id: 'reports', label: 'Speaking Reports', description: 'Saved attempts' },
  { id: 'audio', label: 'Question Audio', description: 'TTS library' },
  { id: 'settings', label: 'Settings', description: 'Topics and QA tools' }
]

const READING_ENTRY_CHOICES: Array<{
  category: ReadingBankCategory
  title: string
  subtitle: string
  detail: string
  tone: string
}> = [
  {
    category: 'normal',
    title: 'Normal Reading',
    subtitle: 'ข้อสอบระดับง่าย',
    detail: 'สำหรับ Band 4-6.5',
    tone: 'Core'
  },
  {
    category: 'advanced',
    title: 'Advanced Reading',
    subtitle: 'ข้อสอบระดับยาก',
    detail: 'สำหรับ Band 7+',
    tone: 'Challenge'
  }
]

const NORMAL_READING_STAGE_SIZE = 3
const NORMAL_READING_UNLOCK_PERCENT = 80
const ADVANCED_READING_STAGE_SIZE = 2
const ADVANCED_READING_UNLOCK_PERCENT = 75

const hashReadingStageValue = (value: string) => {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

const sortNormalReadingExamsForStages = (exams: ReadingExamRecord[]) =>
  [...exams].sort((first, second) => {
    const firstScore = hashReadingStageValue(`normal-stage-v1:${first.id}`)
    const secondScore = hashReadingStageValue(`normal-stage-v1:${second.id}`)
    return firstScore - secondScore || first.title.localeCompare(second.title)
  })

const sortAdvancedReadingExamsForStages = (exams: ReadingExamRecord[]) =>
  [...exams].sort((first, second) => {
    const firstScore = hashReadingStageValue(`advanced-stage-v1:${first.id}`)
    const secondScore = hashReadingStageValue(`advanced-stage-v1:${second.id}`)
    return firstScore - secondScore || first.title.localeCompare(second.title)
  })

const normalizeReadingBankCategory = (value: unknown): ReadingBankCategory => {
  const normalized = String(value || '').trim().toLowerCase()
  if (normalized === 'advanced' || normalized === 'passage3') return 'advanced'
  return 'normal'
}

const ADMIN_READING_GENERATOR_QUESTION_TYPES: Array<{
  id: AdminReadingGeneratorQuestionType
  label: string
  shortLabel: string
}> = [
  { id: 'fill-in-the-blank', label: 'Fill in the Blank', shortLabel: 'Fill blanks' },
  { id: 'summary-completion', label: 'Summary Completion', shortLabel: 'Summary' },
  { id: 'multiple-choice', label: 'Multiple Choice', shortLabel: 'MCQ' },
  { id: 'true-false-not-given', label: 'TRUE / FALSE / NOT GIVEN', shortLabel: 'TFNG' },
  { id: 'yes-no-not-given', label: 'YES / NO / NOT GIVEN', shortLabel: 'YNNG' },
  { id: 'matching-statements', label: 'Matching Statements / Who says what', shortLabel: 'Statements' },
  { id: 'matching-features', label: 'Matching Features / Experts / Eras', shortLabel: 'Features' },
  { id: 'matching-heading', label: 'Matching Headings', shortLabel: 'Headings' },
  { id: 'matching-information', label: 'Matching Information / Paragraph contains', shortLabel: 'Information' },
  { id: 'matching-sentence-endings', label: 'Matching Sentence Endings', shortLabel: 'Endings' }
]

const ADMIN_READING_GENERATOR_DEFAULT_REQUIREMENTS: Record<AdminReadingGeneratorQuestionType, string> = {
  'fill-in-the-blank': [
    'Focus: scanning for specific details and understanding local context.',
    'Order: usually chronological, except sometimes in tables or flowcharts.',
    'Surround every blank with paraphrased text.',
    'The answer must be the exact word from the generated passage with no tense, singular/plural, or word-form change.',
    'Respect the word limit literally, e.g. ONE WORD ONLY means "the manatees" is wrong if the answer is "manatees".',
    'Include the original IELTS-style instruction block above the questions.'
  ].join('\n'),
  'summary-completion': [
    'Focus: understanding a concentrated section of the text.',
    'Order: chronological within the specific section summarized.',
    'Type A, no word bank: exact passage words must be extracted, like fill in the blanks.',
    'Type B, with word bank: answer must be a letter corresponding to the word box; test secondary vocabulary and paraphrase.',
    'For word banks, include grammatically plausible but factually wrong distractors.',
    'Also include exact words from the text that do not fit the grammar or meaning of the paraphrased summary.'
  ].join('\n'),
  'multiple-choice': [
    'Focus: detailed understanding of specific paragraphs, writer purpose, or global text meaning.',
    'Order: chronological.',
    'Often direct the reader to a location, e.g. "In the fourth paragraph...".',
    'Require reading around reference words such as "this", "these", and "such", and transition words.',
    'The correct option must be a heavy paraphrase of the core concept and supported by one exact passage portion.',
    'Use Half-Truth distractors: the first half is correct but the second half subtly introduces wrong information.',
    'Use Right Answer to the Wrong Question distractors: factually true from the text but not answering the question asked.'
  ].join('\n'),
  'true-false-not-given': [
    'Focus: identifying specific factual information.',
    'Order: chronological.',
    'TRUE: statement perfectly matches factual meaning but uses heavy paraphrasing and synonyms.',
    'FALSE: statement explicitly contradicts or states the opposite of the fact in the text.',
    'NOT GIVEN: information is irrelevant, incomplete, or simply not mentioned.',
    'Use False Positive traps: keep the exact subject/object but change the verb, adjective, adverb, or degree such as some/all or frequently/always.',
    'Use Keyword Bait traps for NOT GIVEN: include exact, highly specific keywords from the text, but keep the claim unstated.',
    'TRUE, FALSE, and NOT GIVEN counts must be the same or very similar.'
  ].join('\n'),
  'yes-no-not-given': [
    'Focus: identifying the writer’s claims, views, or opinions, usually Passage 3.',
    'Order: chronological.',
    'YES: statement agrees with the writer’s specific opinion.',
    'NO: statement contradicts the writer’s specific opinion.',
    'NOT GIVEN: impossible to say what the writer thinks about it.',
    'Use Real-World Fact traps: statements may be true in real life, but if the writer has not explicitly claimed it, answer is NOT GIVEN.',
    'YES, NO, and NOT GIVEN counts must be the same or very similar.'
  ].join('\n'),
  'matching-statements': [
    'Create IELTS-style matching statements for who says what or which named person/group is linked to each statement.',
    'Each answer must be supported by one exact passage portion.',
    'Use a clear option list and keep the statements paraphrased.',
    'Questions should follow the natural order of the supporting portions where possible.'
  ].join('\n'),
  'matching-features': [
    'Focus: connecting specific theories, discoveries, claims, quotes, places, eras, or people to the features that produced them.',
    'Order: not chronological.',
    'Give a list of statements and a list of proper nouns or feature labels, usually capitalized names.',
    'The correct answer must be a heavily paraphrased version of a direct quote or reported speech clause in the text.',
    'Use Scattered Expert traps: place quotes or claims from the same expert/feature in different paragraphs so scanning the name once is not enough.'
  ].join('\n'),
  'matching-heading': [
    'Focus: identifying the main idea or core theme of an entire paragraph.',
    'Order: not chronological.',
    'Headings should be short, around 2-12 words.',
    'The correct heading usually requires synthesizing the topic sentence, conclusion, or sentences after major transitions such as but/however/therefore.',
    'Use more headings than paragraphs so there are plausible unused headings.',
    'Use Overly Specific Heading traps: a distractor accurately describes one sentence but not the whole paragraph.',
    'Use Exact Word Match traps: a heading uses exact paragraph words but is still the wrong main idea.'
  ].join('\n'),
  'matching-information': [
    'Focus: locating specific details, examples, reasons, or descriptions.',
    'Order: not chronological.',
    'Format prompts as noun phrases, e.g. "a reference to...", "an explanation of...", "examples of...".',
    'Allow paragraph letters to be used more than once when appropriate, and include "NB You may use any letter more than once" if reused.',
    'Each answer must be a paragraph letter and supported by one exact passage portion.',
    'Use plural traps: if the prompt asks for plural outcomes/examples/reasons, the paragraph must contain more than one; a paragraph with only one is a trap.',
    'Include a clear paragraph-letter system in the passage.'
  ].join('\n'),
  'matching-sentence-endings': [
    'Focus: understanding sentence-level cause/effect or logical flow.',
    'Order: the first halves of the sentences are chronological.',
    'Match each premise to the correct conclusion based on the text.',
    'The combined sentence must be grammatical and factually accurate.',
    'Use distractor endings with exact recognizable words from the text, but when attached to the first half they are grammatically broken or factually opposite.'
  ].join('\n')
}

const createAdminReadingGeneratorPassage = (index: number): AdminReadingGeneratorPassageConfig => ({
  id: `generator-passage-${index + 1}`,
  title: '',
  sourcePassage: '',
  newTopic: '',
  category: index >= 2 ? 'advanced' : 'normal',
  questionTypes:
    index === 0
      ? ['true-false-not-given', 'fill-in-the-blank']
      : index === 1
        ? ['matching-heading', 'matching-information']
        : index === 2
          ? ['yes-no-not-given', 'multiple-choice']
          : ['summary-completion', 'matching-features', 'matching-sentence-endings'],
  questionCount: '13',
  requirements: ''
})

const INITIAL_ADMIN_READING_GENERATOR_PASSAGES = Array.from({ length: 4 }, (_, index) =>
  createAdminReadingGeneratorPassage(index)
)

const getAdminReadingGeneratorTypeLabel = (type: AdminReadingGeneratorQuestionType) =>
  ADMIN_READING_GENERATOR_QUESTION_TYPES.find((item) => item.id === type)?.label || type

const stripQuotedReadingPortion = (value: string) =>
  String(value || '')
    .trim()
    .replace(/^["“”]+|["“”]+$/g, '')
    .replace(/\s+/g, ' ')

const normalizeGeneratedReadingText = (value: string) =>
  String(value || '')
    .toLowerCase()
    .replace(/[“”"'.:;,!?()[\]{}–—-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const parseAdminGeneratedAnswerBlocks = (rawAnswerKey: string) =>
  String(rawAnswerKey || '')
    .split(/(?=\bQuestion\s+\d+\s*:)/i)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const number = Number(block.match(/^Question\s+(\d+)\s*:/i)?.[1] || 0)
      const prompt = block.match(/^Question\s+\d+\s*:\s*([\s\S]*?)(?=\n\s*Correct Answer\s*:|$)/i)?.[1]?.trim() || ''
      const correctAnswer = block.match(/Correct Answer\s*:\s*([^\n]+)/i)?.[1]?.trim() || ''
      const exactPortion =
        block.match(/Exact Portion\s*:\s*["“]?([\s\S]*?)["”]?(?=\n\s*(?:Short Thai Explanation|Paraphrased Vocabulary|Question\s+\d+\s*:)|$)/i)?.[1]?.trim() ||
        ''
      return {
        number,
        prompt,
        correctAnswer,
        exactPortion: stripQuotedReadingPortion(exactPortion)
      }
    })

const validateAdminGeneratedReadingDraft = (value: string): AdminReadingGeneratorValidationResult => {
  const parsed = JSON.parse(value)
  const exams = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.exams) ? parsed.exams : null
  if (!exams) {
    throw new Error('Generated draft must be a JSON array, or an object with an "exams" array.')
  }

  const items: AdminReadingGeneratorValidationItem[] = exams.map((exam: Partial<ReadingBulkUploadInput>, index: number) => {
    const errors: string[] = []
    const warnings: string[] = []
    const title = String(exam?.title || `Generated exam ${index + 1}`).trim()
    const category = normalizeReadingBankCategory(exam?.category)
    const rawPassageText = String(exam?.rawPassageText || '')
    const rawAnswerKey = String(exam?.rawAnswerKey || '')
    const passageCount = (rawPassageText.match(/READING PASSAGE\s+\d+/gi) || []).length || (rawPassageText.trim() ? 1 : 0)
    const answerBlocks = parseAdminGeneratedAnswerBlocks(rawAnswerKey)
    const normalizedPassage = normalizeGeneratedReadingText(rawPassageText)

    if (!title) errors.push('Missing title.')
    if (!rawPassageText.trim()) errors.push('Missing rawPassageText.')
    if (!rawAnswerKey.trim()) errors.push('Missing rawAnswerKey.')
    if (passageCount < 1) errors.push('No reading passage detected.')
    if (answerBlocks.length === 0) errors.push('No "Question X:" answer-key blocks detected.')

    const questionNumbers = answerBlocks.map((item) => item.number).filter(Boolean)
    const sortedQuestionNumbers = [...questionNumbers].sort((first, second) => first - second)
    if (questionNumbers.some((number, numberIndex) => number !== sortedQuestionNumbers[numberIndex])) {
      errors.push('Question numbers are not chronological in the answer key.')
    }

    const judgementCounts: Record<string, number> = {}
    answerBlocks.forEach((question) => {
      const answer = question.correctAnswer.toUpperCase()
      if (!question.prompt) warnings.push(`Q${question.number || '?'} has no visible prompt after "Question X:".`)
      if (!question.correctAnswer) errors.push(`Q${question.number || '?'} is missing Correct Answer.`)
      if (!question.exactPortion) {
        errors.push(`Q${question.number || '?'} is missing Exact Portion.`)
      } else if (!normalizedPassage.includes(normalizeGeneratedReadingText(question.exactPortion))) {
        errors.push(`Q${question.number || '?'} Exact Portion is not found in the passage.`)
      }

      if (['TRUE', 'FALSE', 'NOT GIVEN', 'YES', 'NO'].includes(answer)) {
        judgementCounts[answer] = (judgementCounts[answer] || 0) + 1
      } else if (!/^[A-H](?:\s*,\s*[A-H])?$/i.test(question.correctAnswer)) {
        const answerWords = question.correctAnswer.split(/\s+/).filter(Boolean)
        if (answerWords.length !== 1) {
          warnings.push(`Q${question.number || '?'} text answer is not one word.`)
        }
        if (!normalizedPassage.includes(normalizeGeneratedReadingText(question.correctAnswer))) {
          errors.push(`Q${question.number || '?'} text answer is not found exactly in the passage.`)
        }
      }
    })

    const tfngValues = ['TRUE', 'FALSE', 'NOT GIVEN'].map((answer) => judgementCounts[answer] || 0)
    const ynngValues = ['YES', 'NO', 'NOT GIVEN'].map((answer) => judgementCounts[answer] || 0)
    if (tfngValues.some(Boolean) && Math.max(...tfngValues) - Math.min(...tfngValues) > 1) {
      warnings.push('TRUE/FALSE/NOT GIVEN distribution is not balanced.')
    }
    if (ynngValues.some(Boolean) && Math.max(...ynngValues) - Math.min(...ynngValues) > 1) {
      warnings.push('YES/NO/NOT GIVEN distribution is not balanced.')
    }

    return {
      index: index + 1,
      title,
      category,
      ok: errors.length === 0,
      warnings,
      errors,
      questionCount: answerBlocks.length,
      passageCount
    }
  })

  return {
    total: items.length,
    valid: items.filter((item) => item.ok).length,
    invalid: items.filter((item) => !item.ok).length,
    items
  }
}

const READING_PDOY_LESSON_LABELS: Record<ReadingPdoyLessonType, string> = {
  'true-false-not-given': 'TRUE / FALSE / NOT GIVEN',
  'yes-no-not-given': 'YES / NO / NOT GIVEN',
  'multiple-choice': 'Multiple Choice / ปรนัย',
  'fill-in-the-blank': 'Fill in the Blank / เติมคำ'
}

const LISTENING_OFFICIAL_RESOURCES: ListeningOfficialResource[] = [
  {
    id: 'ielts-sample-tasks',
    title: 'IELTS official listening sample tasks',
    source: 'IELTS official',
    description: 'ดูหน้าตา question types จริงของ Listening เช่น form completion, note completion, matching และ multiple choice',
    url: 'https://ielts.org/cdn/ielts-sample-tests/ielts-listening-sample-tasks-2023.pdf',
    sampleType: 'Official sample task pack'
  },
  {
    id: 'british-council-practice-test',
    title: 'British Council listening practice test',
    source: 'British Council',
    description: 'ตัวอย่างข้อ Listening แบบเต็มพร้อม answer key และ audio practice จากแหล่งทางการ',
    url: 'https://takeielts.britishcouncil.org/take-ielts/prepare/free-ielts-english-practice-tests/listening',
    sampleType: 'Official free practice'
  },
  {
    id: 'ielts-format-overview',
    title: 'IELTS listening format and question overview',
    source: 'IELTS official',
    description: 'ใช้ดูโครงสร้างข้อสอบ Listening และชนิดคำสั่งที่เจอบ่อยในข้อสอบจริง',
    url: 'https://ielts.org/take-a-test/preparation-resources/sample-test-questions',
    sampleType: 'Official format guide'
  }
]

const LISTENING_EXERCISES: ListeningExercise[] = [
  {
    id: 'listening-ex1-pottery-workshop',
    title: 'Exercise 1 - Pottery workshop enquiry',
    label: 'Exercise 1',
    summary: 'Notes Completion + Table Completion',
    level: 'Medium · Band 6.5',
    duration: '10-15 minutes',
    formatLabel: 'IELTS Listening Part 1 style',
    instructionsThai: 'ฟังบทสนทนาเกี่ยวกับการสมัคร pottery workshop แล้วเติมคำตอบจากสิ่งที่ได้ยิน',
    playbackNoteThai: 'แบบฝึกนี้ให้กดฟังซ้ำได้เพื่อเรียนรู้ แต่ข้อสอบจริงจะเปิด audio เพียงครั้งเดียวครับ',
    audioScript: [
      'Receptionist: Good morning, Riverside Community Centre.',
      'Caller: Hello. I am interested in your evening pottery course. Could you tell me a few details?',
      'Receptionist: Of course. The next course starts on the fourteenth of May and it runs for six weeks.',
      'Caller: Great. Where are the classes held?',
      'Receptionist: They are all in Studio Four, at the back of the main building.',
      'Caller: Do I need to bring anything with me?',
      'Receptionist: Just an apron. Everything else is provided for you.',
      'Caller: So the price includes the materials?',
      'Receptionist: Yes, all the clay and tools are included in the fee.',
      'Caller: Is there any discount for students?',
      'Receptionist: Yes. If you bring your student card, the price is reduced.',
      'Caller: And what time is the Saturday practice session?',
      'Receptionist: That extra session begins at ten thirty in the morning.'
    ],
    questions: [
      {
        number: 1,
        prompt: 'The next pottery course starts in ______.',
        answerType: 'text',
        correctAnswer: 'May',
        acceptedAnswers: ['May'],
        exactPortion: 'The next course starts on the fourteenth of May and it runs for six weeks.',
        explanationThai: 'คำถามใช้ starts in แต่ใน audio พูดว่า starts on the fourteenth of May ดังนั้นคำที่ต้องเติมคือเดือน May ครับ',
        paraphrasedVocabulary: 'starts in = starts on ... of May'
      },
      {
        number: 2,
        prompt: 'Classes are held in Studio ______.',
        answerType: 'text',
        correctAnswer: '4',
        acceptedAnswers: ['4', 'four'],
        exactPortion: 'They are all in Studio Four, at the back of the main building.',
        explanationThai: 'โจทย์ล็อกคำว่า Studio ไว้แล้ว สิ่งที่ต้องฟังคือเลขห้อง ซึ่ง speaker บอกชัดว่า Studio Four ครับ',
        paraphrasedVocabulary: 'held in = are all in'
      },
      {
        number: 3,
        prompt: 'Students should bring an ______.',
        answerType: 'text',
        correctAnswer: 'apron',
        acceptedAnswers: ['apron'],
        exactPortion: 'Just an apron. Everything else is provided for you.',
        explanationThai: 'โจทย์ถามของที่ต้อง bring มาเอง และ audio ตอบตรง ๆ ว่า Just an apron ครับ',
        paraphrasedVocabulary: 'bring = bring with you'
      },
      {
        number: 4,
        prompt: 'The fee includes all ______.',
        answerType: 'text',
        correctAnswer: 'materials',
        acceptedAnswers: ['materials'],
        exactPortion: 'Yes, all the clay and tools are included in the fee.',
        explanationThai: 'audio ไม่พูดคำว่า materials ตรง ๆ แต่ clay and tools คือวัสดุ/อุปกรณ์ทั้งหมดที่รวมอยู่ในราคา จึงสรุปเป็น materials ครับ',
        paraphrasedVocabulary: 'materials = clay and tools'
      },
      {
        number: 5,
        prompt: 'To get the discount, learners need a student ______.',
        answerType: 'text',
        correctAnswer: 'card',
        acceptedAnswers: ['card'],
        exactPortion: 'If you bring your student card, the price is reduced.',
        explanationThai: 'โจทย์ถามสิ่งที่ต้องมีเพื่อรับส่วนลด และ audio บอกว่า bring your student card ดังนั้นคำที่หายไปคือ card ครับ',
        paraphrasedVocabulary: 'discount = the price is reduced'
      },
      {
        number: 6,
        prompt: 'The Saturday practice session begins at ______.',
        answerType: 'text',
        correctAnswer: '10.30',
        acceptedAnswers: ['10.30', '10:30', 'ten thirty'],
        exactPortion: 'That extra session begins at ten thirty in the morning.',
        explanationThai: 'โจทย์ใช้ begins at และ audio ก็ใช้คำเดียวกันตรง ๆ ว่า begins at ten thirty ดังนั้นตอบ 10.30 ครับ',
        paraphrasedVocabulary: 'begins at = starts at / begins at'
      }
    ]
  },
  {
    id: 'listening-ex2-bike-tour',
    title: 'Exercise 2 - City bike tour booking',
    label: 'Exercise 2',
    summary: 'Multiple Choice + Notes Completion',
    level: 'Medium · Band 6.5',
    duration: '10-15 minutes',
    formatLabel: 'IELTS Listening Part 1-2 style',
    instructionsThai: 'ฟังข้อมูลการจอง bike tour แล้วตอบคำถามแบบ multiple choice และเติมโน้ตจากข้อมูลที่ได้ยิน',
    playbackNoteThai: 'แบบฝึกนี้เปิดฟังซ้ำได้เพื่อฝึกจับ paraphrase แต่ตอนสอบจริงควรฝึกให้ชินกับการฟังครั้งเดียวครับ',
    audioScript: [
      'Tour clerk: City Cycle Tours. How can I help?',
      'Caller: Hi. I would like to book a bike tour for tomorrow, but I cannot join the morning one because my train does not arrive until midday.',
      'Tour clerk: No problem. The afternoon tour still has places available.',
      'Caller: Where do we meet?',
      'Tour clerk: Meet the guide beside the fountain in Central Square, fifteen minutes before the tour starts.',
      'Caller: Can I borrow safety equipment there?',
      'Tour clerk: Yes, every rider can borrow a helmet for free.',
      'Caller: Great. How much is the student ticket?',
      'Tour clerk: It is eighteen pounds with a valid student card.',
      'Caller: And how long does the tour last?',
      'Tour clerk: About three hours, including a short rest by the river.'
    ],
    questions: [
      {
        number: 1,
        prompt: 'Why does the caller choose the afternoon tour?',
        answerType: 'multiple-choice',
        correctAnswer: 'B',
        options: [
          { key: 'A', text: 'He prefers cycling when the weather is cooler.' },
          { key: 'B', text: 'His journey to the city finishes late.' },
          { key: 'C', text: 'The morning tour is already fully booked.' }
        ],
        exactPortion: 'I cannot join the morning one because my train does not arrive until midday.',
        explanationThai: 'ผู้พูดบอกว่าร่วมรอบเช้าไม่ได้เพราะรถไฟมาถึงตอนเที่ยง แปลว่าเหตุผลคือการเดินทางมาถึงช้า จึงตรงกับข้อ B ครับ',
        paraphrasedVocabulary: 'my train does not arrive until midday = his journey to the city finishes late'
      },
      {
        number: 2,
        prompt: 'The guide will meet visitors beside the ______.',
        answerType: 'text',
        correctAnswer: 'fountain',
        acceptedAnswers: ['fountain'],
        exactPortion: 'Meet the guide beside the fountain in Central Square, fifteen minutes before the tour starts.',
        explanationThai: 'จุดนัดพบถูกบอกตรง ๆ ว่า beside the fountain ดังนั้นคำตอบคือ fountain ครับ',
        paraphrasedVocabulary: 'meet = meet the guide / meeting point'
      },
      {
        number: 3,
        prompt: 'Each rider can borrow a ______.',
        answerType: 'text',
        correctAnswer: 'helmet',
        acceptedAnswers: ['helmet'],
        exactPortion: 'Yes, every rider can borrow a helmet for free.',
        explanationThai: 'โจทย์ใช้ each rider ส่วน audio ใช้ every rider ซึ่งความหมายเท่ากัน และสิ่งที่ยืมได้คือ helmet ครับ',
        paraphrasedVocabulary: 'each rider = every rider'
      },
      {
        number: 4,
        prompt: 'The student ticket costs ______ pounds.',
        answerType: 'text',
        correctAnswer: '18',
        acceptedAnswers: ['18', 'eighteen'],
        exactPortion: 'It is eighteen pounds with a valid student card.',
        explanationThai: 'speaker บอกราคา student ticket ว่า eighteen pounds ดังนั้นเติม 18 ครับ',
        paraphrasedVocabulary: 'costs = is'
      },
      {
        number: 5,
        prompt: 'The tour lasts about ______ hours.',
        answerType: 'text',
        correctAnswer: '3',
        acceptedAnswers: ['3', 'three'],
        exactPortion: 'About three hours, including a short rest by the river.',
        explanationThai: 'audio บอกระยะเวลาชัดเจนว่า about three hours ดังนั้นตอบ 3 ครับ',
        paraphrasedVocabulary: 'lasts = takes / lasts about'
      }
    ]
  }
]

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
  normal: [
    {
      title: 'Normal Reading Template',
      category: 'normal',
      rawPassageText: `READING PASSAGE 1
PASTE NORMAL READING TITLE HERE

PASTE THE FULL NORMAL READING PASSAGE TEXT HERE

Questions 1-13
PASTE THE ORIGINAL QUESTION BLOCK HERE`,
      rawAnswerKey: `READING PASSAGE 1: PASTE NORMAL READING TITLE HERE
Question 1: PASTE QUESTION 1 PROMPT HERE

Correct Answer: TRUE / FALSE / NOT GIVEN / actual answer

Exact Portion: "Paste the exact evidence from the passage here."

Short Thai Explanation: อธิบายสั้น ๆ เป็นภาษาไทยที่ user เข้าใจได้

Paraphrased Vocabulary: สรุป keyword/paraphrase ที่สำคัญ`
    }
  ],
  advanced: [
    {
      title: 'Advanced Reading Template',
      category: 'advanced',
      rawPassageText: `READING PASSAGE 3
PASTE ADVANCED READING TITLE HERE

PASTE THE FULL ADVANCED READING PASSAGE TEXT HERE

Questions 27-40
PASTE THE ORIGINAL QUESTION BLOCK HERE`,
      rawAnswerKey: `READING PASSAGE 3: PASTE ADVANCED READING TITLE HERE
Question 27: PASTE QUESTION 27 PROMPT HERE

Correct Answer: A / B / C / D / YES / NO / NOT GIVEN / actual answer

Exact Portion: "Paste the exact evidence from the passage here."

Short Thai Explanation: อธิบายสั้น ๆ เป็นภาษาไทยที่ user เข้าใจได้

Paraphrased Vocabulary: สรุป keyword/paraphrase ที่สำคัญ`
    }
  ]
}

const formatAccessDate = (value: string | null) =>
  value ? new Date(value).toLocaleDateString() : 'Not set'

const formatUsdCost = (value: number | undefined) => {
  const amount = Number(value || 0)
  if (amount >= 0.01) return `$${amount.toFixed(2)}`
  if (amount >= 0.001) return `$${amount.toFixed(4)}`
  return `$${amount.toFixed(6)}`
}

const buildAdminCostSeries = (
  reports: AdminAssessmentReportSummary[],
  days: number
) => {
  const today = new Date()
  const dayKeys: string[] = []
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date(today)
    date.setHours(0, 0, 0, 0)
    date.setDate(date.getDate() - offset)
    dayKeys.push(date.toISOString().slice(0, 10))
  }

  const totals = new Map(dayKeys.map((key) => [key, { cost: 0, reports: 0, tokens: 0 }]))
  reports.forEach((report) => {
    const key = String(report.createdAt || '').slice(0, 10)
    if (!totals.has(key)) return
    const current = totals.get(key)!
    current.cost += Number(report.apiCostUsd || 0)
    current.reports += 1
    current.tokens += Number(report.totalTokens || 0)
  })

  return dayKeys.map((key) => {
    const date = new Date(`${key}T00:00:00`)
    const item = totals.get(key) || { cost: 0, reports: 0, tokens: 0 }
    return {
      key,
      label: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      cost: item.cost,
      reports: item.reports,
      tokens: item.tokens
    }
  })
}

const buildAdminCostLinePath = (values: number[], width = 560, height = 180, padding = 18) => {
  if (!values.length) return ''
  const max = Math.max(...values, 0.000001)
  const min = Math.min(...values, 0)
  const drawableWidth = width - padding * 2
  const drawableHeight = height - padding * 2
  const stepX = values.length === 1 ? 0 : drawableWidth / (values.length - 1)
  return values
    .map((value, index) => {
      const x = padding + stepX * index
      const ratio = max === min ? 0.5 : (value - min) / (max - min)
      const y = height - padding - ratio * drawableHeight
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')
}

const getReadingExerciseMeta = (examId: string) => {
  if (examId === 'builtin-reading-pdoy-huarango') {
    return {
      label: 'Exercise 1',
      summary: 'Fill in the Blank + TRUE / FALSE / NOT GIVEN',
      duration: '15-25 minutes',
      level: 'Medium · Band 6.5'
    }
  }
  if (examId === 'builtin-reading-pdoy-silbo') {
    return {
      label: 'Exercise 2',
      summary: 'TRUE / FALSE / NOT GIVEN + Notes Completion',
      duration: '15-25 minutes',
      level: 'Medium · Band 6.5'
    }
  }
  if (examId === 'builtin-reading-ex3-henry-moore') {
    return {
      label: 'Exercise 3',
      summary: 'TRUE / FALSE / NOT GIVEN + Notes Completion',
      duration: '15-25 minutes',
      level: 'Medium · Band 6.5'
    }
  }
  if (examId === 'builtin-reading-ex4-desolenator') {
    return {
      label: 'Exercise 4',
      summary: 'Matching Headings + Summary Completion',
      duration: '15-25 minutes',
      level: 'Medium · Band 6.5'
    }
  }
  if (examId === 'builtin-reading-ex5-dance-engineers') {
    return {
      label: 'Exercise 5',
      summary: 'Paragraph Matching + Summary Completion',
      duration: '15-25 minutes',
      level: 'Medium · Band 6.5'
    }
  }
  if (examId === 'builtin-reading-ex6-extinct-species') {
    return {
      label: 'Exercise 6',
      summary: 'Paragraph Matching + Summary + Matching People',
      duration: '15-25 minutes',
      level: 'Medium · Band 6.5'
    }
  }
  if (examId === 'builtin-reading-ex7-nutmeg') {
    return {
      label: 'Exercise 7',
      summary: 'Notes Completion + TRUE / FALSE / NOT GIVEN + Table Completion',
      duration: '15-25 minutes',
      level: 'Medium · Band 6.5'
    }
  }
  if (examId === 'builtin-reading-ex8-driverless-cars') {
    return {
      label: 'Exercise 8',
      summary: 'Section Matching + Summary + Choose TWO',
      duration: '15-25 minutes',
      level: 'Medium · Band 6.5'
    }
  }
  return null
}

const READING_PDOY_EXAM_IDS = new Set([
  'builtin-reading-pdoy-huarango',
  'builtin-reading-pdoy-silbo',
  'builtin-reading-ex3-henry-moore',
  'builtin-reading-ex4-desolenator',
  'builtin-reading-ex5-dance-engineers',
  'builtin-reading-ex6-extinct-species',
  'builtin-reading-ex7-nutmeg',
  'builtin-reading-ex8-driverless-cars'
])

const isReadingPdoyExercise = (examId: string) => READING_PDOY_EXAM_IDS.has(String(examId || ''))

const isCambridgeBookReadingExam = (exam: Pick<ReadingExamRecord, 'id' | 'title'>) => {
  const id = String(exam.id || '').toLowerCase()
  const title = String(exam.title || '').toLowerCase()
  return (
    /^cambridge-(1[2-3]|17|19)-/.test(id) ||
    /\bcambridge\s*(1[2-3]|17|19)\b/.test(title) ||
    /^c(12|13|17|19)\s/.test(title)
  )
}

const inferReadingCategoryFromSource = (value: string): ReadingBankCategory => {
  const text = String(value || '')
  const passageMatches = [...text.matchAll(/READING PASSAGE\s+(\d+)/gi)].map((match) => Number(match[1]))
  if (passageMatches.includes(3) && !passageMatches.includes(1) && !passageMatches.includes(2)) return 'advanced'
  return 'normal'
}

const deriveReadingTitleFromPassageText = (value: string, category: ReadingBankCategory) => {
  const text = String(value || '').replace(/\r/g, '').trim()
  if (!text) return READING_CATEGORY_LABELS[category]
  const firstBlock = text
    .replace(/^READING PASSAGE\s+\d+\s*/i, '')
    .trim()
  const title = String(firstBlock.split('\n').find((line) => line.trim()) || '').trim()
  if (!title) return READING_CATEGORY_LABELS[category]
  return title
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

const normalizeTextForLooseMatch = (value: string) =>
  String(value || '')
    .toLowerCase()
    .replace(/["'“”‘’.,!?;:()[\]{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const buildReadingHintNeedles = (hintExcerpt?: string) => {
  const raw = String(hintExcerpt || '').trim()
  if (!raw) return []

  const quotedSegments = [...raw.matchAll(/["“”']([^"“”']{4,}?)["“”']/g)]
    .map((match) => String(match[1] || '').replace(/\s+/g, ' ').trim())
    .filter((segment) => segment.length >= 8)
  if (quotedSegments.length) return [...new Set(quotedSegments)]

  const normalized = raw
    .replace(/^["'“”]+|["'“”]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  if (!normalized) return []

  const segments = normalized
    .split(/(?:\.\.\.|…)+|(?:\s+\/\s+)|(?:\s*;\s*)|\n+/)
    .map((segment) => segment.replace(/^["'“”]+|["'“”]+$/g, '').trim())
    .filter((segment) => segment.length >= 8)

  return segments.length ? [...new Set(segments)] : [normalized]
}

const READING_THAI_GLOSSARY: Record<string, string> = {
  'oval': 'รูปวงรี',
  'shape': 'รูปร่าง',
  'husk': 'เปลือก / เปลือกหุ้มผล',
  'seed': 'เมล็ด',
  'mace': 'ดอกจันทน์เทศ',
  'aril': 'เยื่อหุ้มเมล็ด',
  'arabs': 'ชาวอาหรับ',
  'plague': 'กาฬโรค',
  'lime': 'ปูนขาว',
  'run': 'เกาะรัน',
  'mauritius': 'เกาะมอริเชียส',
  'tsunami': 'สึนามิ',
  'surrounds': 'ห่อหุ้ม / ล้อมรอบ',
  'human error': 'ความผิดพลาดของมนุษย์',
  'car-sharing': 'การใช้รถร่วมกัน',
  'car sharing': 'การใช้รถร่วมกัน',
  'vehicle ownership': 'การครอบครองรถยนต์',
  'ownership': 'การเป็นเจ้าของ',
  'mileage': 'ระยะทางการใช้งาน',
  'co-operation of farmers': 'ความร่วมมือจากเกษตรกร',
  'preserve wildlife': 'ช่วยรักษาสัตว์ป่า / ระบบนิเวศ',
  'deep below the surface': 'ลึกลงไปใต้พื้นผิว',
  'diet': 'อาหาร / รูปแบบการกิน',
  'drought': 'ภัยแล้ง',
  'erosion': 'การพังทลายของดิน',
  'desert': 'ทะเลทราย'
}

const containsThaiCharacters = (value: string) => /[\u0E00-\u0E7F]/.test(String(value || ''))

const lookupReadingThaiMeaning = (value: string) => {
  const normalized = String(value || '').trim().toLowerCase()
  if (!normalized) return ''
  return READING_THAI_GLOSSARY[normalized] || ''
}

const buildReadingPromptCueThai = (question: ReadingQuestion) => {
  const prompt = String(question.prompt || '').toLowerCase()
  if (prompt.includes('in shape')) return 'match กับ cue คำว่า shape = รูปร่าง'
  if (prompt.includes('deep below the surface')) return 'ตรงกับความหมายเรื่องตำแหน่งใต้พื้นผิว'
  if (prompt.includes('periods of')) return 'โครงสร้างนี้กำลังถามหาคำนามหลัง of'
  if (prompt.includes('prevents')) return 'ดูผลที่สิ่งนี้ช่วยป้องกันไว้'
  return ''
}

const buildReadingVocabSupport = (
  question: ReadingQuestion | null,
  clue: { clue: string; thaiHelper: string } | null
) => {
  if (!question) return null

  const paraphrase = String(question.paraphrasedVocabulary || '').trim()
  const clueText = String(clue?.clue || '').trim()
  const answerText = String(question.correctAnswer || '').trim()
  const paraphraseLead = paraphrase.split(/(?:=|->|→|\/{2,}|;|\n)/)[0]?.trim() || ''

  const glossaryTarget =
    (lookupReadingThaiMeaning(answerText) && answerText) ||
    (lookupReadingThaiMeaning(clueText) && clueText) ||
    (lookupReadingThaiMeaning(paraphraseLead) && paraphraseLead) ||
    ''

  const thaiMeaning =
    (containsThaiCharacters(paraphrase) && paraphrase) ||
    (glossaryTarget ? `${glossaryTarget} = ${lookupReadingThaiMeaning(glossaryTarget)}` : '') ||
    ''

  const cueThai = buildReadingPromptCueThai(question)
  const detail = [thaiMeaning, cueThai].filter(Boolean).join(' · ')
  if (!detail) return null

  return {
    quote: clueText || answerText || question.prompt,
    meaning: detail,
    notebookFix: paraphrase || answerText || clueText
  }
}

const pickReadingPdoyQuestionClue = (question: ReadingQuestion) => {
  const paraphrase = String(question.paraphrasedVocabulary || '').trim()
  const hintNeedles = buildReadingHintNeedles(question.exactPortion)
  const fallbackPrompt = String(question.prompt || '').trim()
  const firstNeedle = hintNeedles[0] || ''
  if (paraphrase) {
    const [lead] = paraphrase.split(/(?:->|→|=|\/{2,}|;|\n)/)
    if (lead?.trim()) {
      return {
        clue: lead.trim(),
        thaiHelper: paraphrase
      }
    }
  }
  return {
    clue: firstNeedle || fallbackPrompt,
    thaiHelper: question.explanationThai || paraphrase || 'ลองเทียบความหมาย ไม่ใช่แค่ดู keyword ตรงตัว'
  }
}

const findReadingEvidenceParagraphIndex = (passage: ReadingPassageRecord | null, exactPortion: string) => {
  if (!passage || !exactPortion) return -1
  const hintNeedles = buildReadingHintNeedles(exactPortion)
  const normalizedParagraphs = passage.bodyParagraphs.map((paragraph) => normalizeTextForLooseMatch(paragraph))
  for (const needle of hintNeedles) {
    const normalizedNeedle = normalizeTextForLooseMatch(needle)
    const foundIndex = normalizedParagraphs.findIndex((paragraph) => paragraph.includes(normalizedNeedle))
    if (foundIndex >= 0) return foundIndex
  }
  const normalizedExact = normalizeTextForLooseMatch(exactPortion)
  return normalizedParagraphs.findIndex((paragraph) => paragraph.includes(normalizedExact))
}

const resolveReadingEvidenceNeedleInPassage = (
  passage: ReadingPassageRecord | null,
  evidenceText: string
) => {
  const stripped = String(evidenceText || '')
    .replace(/^Paragraph\s+[A-G]:\s*/i, '')
    .trim()
  if (!stripped || !passage) return ''

  const paragraphs = passage.bodyParagraphs || []
  const needles = buildReadingHintNeedles(stripped)

  for (const needle of needles) {
    const normalizedNeedle = normalizeTextForLooseMatch(needle)
    if (normalizedNeedle.length < 8) continue
    for (const paragraph of paragraphs) {
      const regex = new RegExp(escapeRegExp(needle), 'i')
      const match = paragraph.match(regex)
      if (match?.[0]) return match[0]
    }
  }

  const words = stripped.split(/\s+/).filter((word) => word.length > 3)
  for (let length = Math.min(14, words.length); length >= 5; length -= 1) {
    const candidate = words.slice(0, length).join(' ')
    const normalizedCandidate = normalizeTextForLooseMatch(candidate)
    if (normalizedCandidate.length < 12) continue
    for (const paragraph of paragraphs) {
      if (normalizeTextForLooseMatch(paragraph).includes(normalizedCandidate)) {
        const regex = new RegExp(escapeRegExp(candidate), 'i')
        const match = paragraph.match(regex)
        if (match?.[0]) return match[0]
      }
    }
  }

  return stripped.length > 120 ? stripped.slice(0, 120).trim() : stripped
}

const buildReadingMatchingHintNeedles = (
  passage: ReadingPassageRecord | null,
  question: ReadingQuestion | null
) => {
  if (!passage || !question) return []
  const { correctText, distractors } = buildReadingMatchingEvidencePortions(passage, question)
  const portions = [correctText, ...distractors.slice(0, 3)].filter(Boolean)
  return portions
    .map((portion) => resolveReadingEvidenceNeedleInPassage(passage, portion))
    .filter((needle, index, list) => {
      const normalized = normalizeTextForLooseMatch(needle)
      return normalized.length >= 8 && list.findIndex((item) => normalizeTextForLooseMatch(item) === normalized) === index
    })
}

const extractReadingQuestionRangeBlock = (questionSectionText: string, start: number, end: number) => {
  const lines = String(questionSectionText || '').split('\n')
  const startPattern = new RegExp(`^\\s*${start}\\s`)
  const endPattern = new RegExp(`^\\s*${end + 1}\\s`)
  let capturing = false
  const captured: string[] = []
  for (const line of lines) {
    if (!capturing && startPattern.test(line)) capturing = true
    if (!capturing) continue
    if (endPattern.test(line) && captured.length > 0) break
    captured.push(line)
  }
  return captured.join('\n').trim()
}

const findReadingQuestionRange = (passage: ReadingPassageRecord | null, question: ReadingQuestion) => {
  const ranges = passage?.questionRanges || []
  const match = ranges.find(
    (range) => question.number >= range.start && question.number <= range.end
  )
  if (match) return match
  return { start: question.number, end: question.number }
}

const extractReadingQuestionBlock = (questionSectionText: string, questionNumber: number) => {
  const escapedNumber = String(questionNumber).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = new RegExp(
    `(?:^|\\n)\\s*${escapedNumber}\\s+([\\s\\S]*?)(?=\\n\\s*\\d+\\s+|$)`,
    'i'
  )
  const match = String(questionSectionText || '').match(pattern)
  return String(match?.[1] || '').trim()
}

const READING_ROMAN_HEADING_PATTERN = /^(?:i|ii|iii|iv|v|vi|vii|viii|ix|x)$/i

const isReadingMatchingHeadingQuestion = (
  _passage: ReadingPassageRecord | null,
  question: ReadingQuestion | null
) => {
  if (!question) return false
  const prompt = String(question.prompt || '').trim()
  const answer = String(question.correctAnswer || '').trim()

  if (
    /^which\s+two\b|^match\s+each\b|^complete the\s+(?:summary|sentences|notes|table)\b|^true\s*\/\s*false|^yes\s*\/\s*no/i.test(
      prompt
    )
  ) {
    return false
  }

  if (/^heading for paragraph/i.test(prompt) || /^heading paragraph/i.test(prompt)) {
    return true
  }
  if (/choose the correct heading/i.test(prompt)) {
    return true
  }
  if (
    READING_ROMAN_HEADING_PATTERN.test(answer) &&
    (/^paragraph\s+[A-G]\b/i.test(prompt) || /^section\s+[A-Z]\b/i.test(prompt))
  ) {
    return true
  }

  return false
}

const getReadingParagraphAnswerLetters = (sectionText: string) => {
  const rangeMatch = String(sectionText || '').match(/write\s+([A-Z])\s*[-–—]\s*([A-Z])\b/i)
  if (!rangeMatch) return null
  const startCode = rangeMatch[1].toUpperCase().charCodeAt(0)
  const endCode = rangeMatch[2].toUpperCase().charCodeAt(0)
  if (endCode < startCode) return null
  return Array.from({ length: endCode - startCode + 1 }, (_, index) =>
    String.fromCharCode(startCode + index)
  )
}

const isReadingMatchingInformationQuestion = (
  passage: ReadingPassageRecord | null,
  question: ReadingQuestion | null
) => {
  if (!question) return false
  const sectionText = String(passage?.questionSectionText || '')
  if (!/which (?:paragraph|section) contains|contains the following information/i.test(sectionText)) {
    return false
  }
  const answer = canonicalizeReadingCorrectAnswer(question.correctAnswer)
  const allowedLetters = getReadingParagraphAnswerLetters(sectionText)
  if (allowedLetters?.length) {
    return allowedLetters.includes(answer.toUpperCase())
  }
  return /^[A-G]$/.test(answer)
}

const isReadingMatchingStatementQuestion = (
  passage: ReadingPassageRecord | null,
  question: ReadingQuestion | null
) => {
  if (!question) return false
  if (isReadingMatchingHeadingQuestion(passage, question) || isReadingMatchingInformationQuestion(passage, question)) {
    return false
  }
  const answer = canonicalizeReadingCorrectAnswer(question.correctAnswer)
  if (!/^[A-G]$/.test(answer)) return false
  const range = findReadingQuestionRange(passage, question)
  const block = extractReadingQuestionRangeBlock(passage?.questionSectionText || '', range.start, range.end)
  return /match\s+each/i.test(block)
}

const getReadingMatchingQuestionKind = (
  passage: ReadingPassageRecord | null,
  question: ReadingQuestion | null
): ReadingMatchingGroupKind | null => {
  if (isReadingMatchingHeadingQuestion(passage, question)) return 'heading'
  if (isReadingMatchingInformationQuestion(passage, question)) return 'information'
  if (isReadingMatchingStatementQuestion(passage, question)) return 'statement'
  return null
}

const isReadingMatchingQuestion = (
  passage: ReadingPassageRecord | null,
  question: ReadingQuestion | null
) => getReadingMatchingQuestionKind(passage, question) !== null

const extractReadingMatchingListOptions = (sourceText: string) => {
  const listMatch = sourceText.match(
    /List of (?:Headings|Ideas|Researchers|People|Statements)\s*\n([\s\S]*?)(?=\n\s*\d+\s*(?:[.)]|\s)|\nQuestions\s+|\nNB\b|$)/i
  )
  const listSource = listMatch?.[1] || ''
  const romanOptions = listSource
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^((?:i|ii|iii|iv|v|vi|vii|viii|ix|x))[\).:\-]?\s+(.+)$/i)
      if (!match) return null
      return { letter: match[1].toLowerCase(), text: match[2].trim() }
    })
    .filter(Boolean) as ReadingPdoyMultipleChoiceOption[]
  if (romanOptions.length) return romanOptions

  return listSource
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^([A-G])\s+(.+)$/i)
      if (!match) return null
      return { letter: match[1].toUpperCase(), text: match[2].trim() }
    })
    .filter(Boolean) as ReadingPdoyMultipleChoiceOption[]
}

const getReadingMatchingAnswerOptions = (
  passage: ReadingPassageRecord | null,
  question: ReadingQuestion,
  kind: ReadingMatchingGroupKind
): ReadingPdoyMultipleChoiceOption[] => {
  if (!passage) return []
  const range = findReadingQuestionRange(passage, question)
  const block = extractReadingQuestionRangeBlock(passage.questionSectionText || '', range.start, range.end)

  if (kind === 'information') {
    const letters =
      getReadingParagraphAnswerLetters(passage.questionSectionText || '') ||
      (passage.bodyParagraphs || [])
        .map((paragraph) => String(paragraph || '').trim())
        .filter((paragraph) => /^[A-I]$/i.test(paragraph))
        .map((paragraph) => paragraph.toUpperCase())
    const paragraphLetters = letters.length ? letters : ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']
    return paragraphLetters.map((letter) => ({ letter, text: `Paragraph ${letter}` }))
  }

  const fromList = extractReadingMatchingListOptions(block || passage.questionSectionText || '')
  if (fromList.length) return fromList

  const extractedOptions = extractReadingMultipleChoiceOptions(passage, question)
  if (extractedOptions.length) return extractedOptions
  return ['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((letter) => ({ letter, text: letter }))
}


const extractReadingMatchingGroupInstruction = (
  passage: ReadingPassageRecord | null,
  kind: ReadingMatchingGroupKind,
  start: number,
  end: number
) => {
  const block = extractReadingQuestionRangeBlock(passage?.questionSectionText || '', start, end)
  const lines = block
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !/^\d+\s/.test(line) && !/^\d+\.\s/.test(line))

  if (kind === 'information') {
    const instructionLines = lines.filter(
      (line) =>
        /which (?:paragraph|section) contains/i.test(line) || /^write\s+[A-Z]/i.test(line) || /^nb\b/i.test(line)
    )
    if (instructionLines.length) return instructionLines.join('\n')
  }

  if (kind === 'heading') {
    const instructionLines = lines.filter(
      (line) =>
        /choose the correct heading|list of headings|write the correct number/i.test(line) ||
        /paragraphs?,\s*[A-Z]/i.test(line)
    )
    if (instructionLines.length) return instructionLines.join('\n')
  }

  if (kind === 'statement') {
    const instructionLines = lines.filter(
      (line) =>
        /match\s+each/i.test(line) ||
        /^write\s+the\s+correct\s+letter/i.test(line) ||
        /list of (?:ideas|researchers|people|statements)/i.test(line) ||
        /^nb\b/i.test(line)
    )
    if (instructionLines.length) return instructionLines.join('\n')
  }

  return block.trim()
}

const getReadingMatchingQuestionStatement = (
  passage: ReadingPassageRecord | null,
  question: ReadingQuestion,
  kind: ReadingMatchingGroupKind
) => {
  const fromBlock = extractReadingQuestionBlock(passage?.questionSectionText || '', question.number)
  if (fromBlock) return fromBlock.trim()

  const prompt = String(question.prompt || '').trim()
  if (kind === 'heading') {
    return prompt.replace(/^heading (?:for )?paragraph\s*/i, '').trim() || prompt
  }
  if (kind === 'information') {
    return prompt.replace(/^which paragraph:\s*/i, '').trim() || prompt
  }
  return prompt
}

const buildReadingMatchingGroupFromQuestions = (
  passage: ReadingPassageRecord,
  kind: ReadingMatchingGroupKind,
  questions: ReadingQuestion[]
): ReadingMatchingGroup => {
  const start = questions[0].number
  const end = questions[questions.length - 1].number
  const choiceOptions = getReadingMatchingAnswerOptions(passage, questions[0], kind)
  const choiceLabel =
    kind === 'heading' ? 'Heading' : kind === 'information' ? 'Paragraph' : 'Answer'

  return {
    id: `${passage.number}-${kind}-${start}-${end}`,
    kind,
    start,
    end,
    instruction: extractReadingMatchingGroupInstruction(passage, kind, start, end),
    choiceLabel,
    choiceOptions,
    questions: [...questions]
  }
}

const buildReadingMatchingGroups = (
  passage: ReadingPassageRecord | null,
  questions: ReadingQuestion[]
): ReadingMatchingGroup[] => {
  if (!passage) return []

  const groups: ReadingMatchingGroup[] = []
  let pending: ReadingQuestion[] = []
  let pendingKind: ReadingMatchingGroupKind | null = null

  const flush = () => {
    if (!pending.length || !pendingKind) return
    groups.push(buildReadingMatchingGroupFromQuestions(passage, pendingKind, pending))
    pending = []
    pendingKind = null
  }

  questions.forEach((question) => {
    const kind = getReadingMatchingQuestionKind(passage, question)
    if (!kind) {
      flush()
      return
    }
    if (pendingKind && pendingKind !== kind) {
      flush()
    }
    pendingKind = kind
    pending.push(question)
  })
  flush()

  return groups
}

const READING_FILL_SECTION_PATTERN =
  /complete the (?:notes|sentences|summary|table)|choose (?:one|no more than)|write one word only|each gap|fill in the/i

const READING_FILL_BLANK_IN_LINE = /\b(\d+)\s*([.．…⋯·•_\-–—]{2,})/g

const isReadingFillSectionBlock = (block: string) => READING_FILL_SECTION_PATTERN.test(block)

const isReadingFillQuestion = (
  passage: ReadingPassageRecord | null,
  question: ReadingQuestion | null
) => {
  if (!question || question.answerType !== 'text') return false
  if (isReadingMatchingQuestion(passage, question)) return false
  if (!passage) return false
  const range = findReadingQuestionRange(passage, question)
  const block = extractReadingQuestionRangeBlock(passage.questionSectionText || '', range.start, range.end)
  return isReadingFillSectionBlock(block)
}

const extractReadingFillGroupInstruction = (block: string) => {
  const lines = block
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
  const instructionLines = lines.filter((line) =>
    /complete the|choose (?:one|no more)|write one word|write your answers|from the passage|each gap/i.test(line)
  )
  return instructionLines.join('\n').trim()
}

const isReadingFillBoilerplateLine = (line: string) =>
  /^Questions \d+/i.test(line) ||
  /^Complete the (?:notes|sentences|summary|table)/i.test(line) ||
  /^Choose (?:ONE WORD|NO MORE THAN)/i.test(line) ||
  /^Write your answers in boxes/i.test(line) ||
  /^Write the correct/i.test(line) ||
  /^Reading Passage \d+/i.test(line) ||
  /^In boxes \d+/i.test(line)

const parseReadingFillLineSegments = (line: string, questionNumbers: Set<number>): ReadingFillLineSegment[] => {
  const matches = [...line.matchAll(READING_FILL_BLANK_IN_LINE)].filter((match) =>
    questionNumbers.has(Number(match[1]))
  )

  if (!matches.length) {
    const text = line.trim()
    const withoutBullet = text.replace(/^[•\-\*]\s*/, '').trim()
    if (
      withoutBullet.length > 0 &&
      withoutBullet.length < 80 &&
      /^[A-Z]/.test(withoutBullet) &&
      !withoutBullet.includes('.') &&
      !/^\d+\s/.test(withoutBullet)
    ) {
      return [{ kind: 'heading', text: withoutBullet }]
    }
    if (/^[•\-\*]/.test(text) || /^(?:must|should|need|have to)\b/i.test(withoutBullet)) {
      return [{ kind: 'clue', text }]
    }
    return text ? [{ kind: 'text', text }] : []
  }

  const segments: ReadingFillLineSegment[] = []
  let lastIndex = 0

  matches.forEach((match, index) => {
    const questionNumber = Number(match[1])
    const start = match.index ?? 0
    const end = start + match[0].length
    const nextStart = matches[index + 1]?.index ?? line.length

    if (start > lastIndex) {
      const beforeText = line.slice(lastIndex, start).trim()
      if (beforeText) {
        segments.push({ kind: 'text', text: beforeText })
      }
    }

    const after = line.slice(end, nextStart).trim()
    segments.push({ kind: 'blank', questionNumber, before: '', after })
    lastIndex = nextStart
  })

  if (lastIndex < line.length) {
    const tail = line.slice(lastIndex).trim()
    if (tail) {
      segments.push({ kind: 'text', text: tail })
    }
  }

  return segments
}

const extractReadingFillDisplayLines = (
  block: string,
  questionNumbers: Set<number>
): ReadingFillDisplayLine[] => {
  const contentLines = block
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !isReadingFillBoilerplateLine(line))

  const displayLines = contentLines
    .map((line) => ({
      segments: parseReadingFillLineSegments(line, questionNumbers)
    }))
    .filter((line) => line.segments.length > 0)

  if (displayLines.length) return displayLines

  return [...questionNumbers]
    .sort((first, second) => first - second)
    .map((questionNumber) => ({
      segments: [{ kind: 'blank' as const, questionNumber, before: '', after: '' }]
    }))
}

const buildReadingFillQuestionGroups = (
  passage: ReadingPassageRecord | null,
  questions: ReadingQuestion[]
): ReadingFillQuestionGroup[] => {
  if (!passage) return []

  const groups: ReadingFillQuestionGroup[] = []
  const ranges = passage.questionRanges?.length ? passage.questionRanges : [{ start: 1, end: 999 }]

  ranges.forEach((range) => {
    const block = extractReadingQuestionRangeBlock(
      passage.questionSectionText || '',
      range.start,
      range.end
    )
    if (!block || !isReadingFillSectionBlock(block)) return

    const rangeQuestions = questions.filter(
      (question) =>
        question.number >= range.start &&
        question.number <= range.end &&
        isReadingFillQuestion(passage, question)
    )
    if (!rangeQuestions.length) return

    const questionNumbers = new Set(rangeQuestions.map((question) => question.number))
    groups.push({
      id: `${passage.number}-fill-${range.start}-${range.end}`,
      start: range.start,
      end: range.end,
      instruction: extractReadingFillGroupInstruction(block),
      displayLines: extractReadingFillDisplayLines(block, questionNumbers),
      questions: [...rangeQuestions]
    })
  })

  return groups.sort((first, second) => first.start - second.start)
}

const isReadingJudgementQuestion = (question: ReadingQuestion | null) =>
  question?.answerType === 'true-false-not-given' || question?.answerType === 'yes-no-not-given'

const getReadingExamTypeSummary = (exam: ReadingExamRecord) => {
  const labels = new Set<string>()
  ;(exam.parsedPayload?.passages || []).forEach((passage) => {
    ;(passage.questions || []).forEach((question) => {
      if (isReadingMatchingQuestion(passage, question)) {
        labels.add('Matching')
        return
      }
      if (question.answerType === 'true-false-not-given') {
        labels.add('TRUE / FALSE / NOT GIVEN')
        return
      }
      if (question.answerType === 'yes-no-not-given') {
        labels.add('YES / NO / NOT GIVEN')
        return
      }
      if (question.answerType === 'multiple-choice') {
        labels.add('Multiple Choice')
        return
      }
      labels.add('Fill in the Blanks')
    })
  })
  return Array.from(labels).slice(0, 4).join(' · ') || 'IELTS Reading'
}

const isReadingNotGivenAnswer = (answer: string) => {
  const normalized = String(answer || '')
    .trim()
    .replace(/\s+/g, ' ')
    .toUpperCase()
  return normalized === 'NOT GIVEN' || normalized.startsWith('NOT GIVEN')
}

const pickReadingTrapSentence = (
  passage: ReadingPassageRecord | null,
  question: ReadingQuestion | null
): string => {
  if (!passage || !question) return ''
  const exactPortion = String(question.exactPortion || '').trim()
  const exactNormalized = normalizeTextForLooseMatch(exactPortion)

  if (exactPortion && scoreReadingEvidenceDistractor(exactPortion, question) > 0) {
    return exactPortion
  }

  const focusIndex = findReadingEvidenceParagraphIndex(passage, exactPortion)
  const ranked = (passage.bodyParagraphs || [])
    .flatMap((paragraph, index) =>
      String(paragraph || '')
        .split(/(?<=[.!?])\s+/)
        .map((sentence) => sentence.replace(/\s+/g, ' ').trim())
        .filter((sentence) => sentence.length >= 18)
        .map((sentence) => ({ sentence, index }))
    )
    .map((entry) => ({
      ...entry,
      trapScore: scoreReadingEvidenceDistractor(entry.sentence, question)
    }))
    .filter(({ sentence, trapScore }) => {
      if (trapScore <= 0) return false
      const normalizedSentence = normalizeTextForLooseMatch(sentence)
      if (exactNormalized && normalizedSentence.includes(exactNormalized)) return false
      return true
    })
    .sort((a, b) => {
      if (b.trapScore !== a.trapScore) return b.trapScore - a.trapScore
      if (focusIndex >= 0) {
        const distanceA = Math.abs(a.index - focusIndex)
        const distanceB = Math.abs(b.index - focusIndex)
        if (distanceA !== distanceB) return distanceA - distanceB
      }
      return 0
    })

  return ranked[0]?.sentence || exactPortion
}

const getReadingQuestionHintExcerpt = (
  passage: ReadingPassageRecord | null,
  question: ReadingQuestion | null,
  selectedEvidenceText?: string
) => {
  if (!question) return ''
  if (selectedEvidenceText?.trim()) return selectedEvidenceText.trim()
  if (isReadingJudgementQuestion(question) && isReadingNotGivenAnswer(question.correctAnswer)) {
    return pickReadingTrapSentence(passage, question)
  }
  return String(question.exactPortion || '').trim()
}

const getReadingPassageLabel = (index: number) => String.fromCharCode(65 + index)

const clipReadingOptionText = (value: string, maxLength = 150) => {
  const compact = String(value || '').replace(/\s+/g, ' ').trim()
  return compact.length > maxLength ? `${compact.slice(0, maxLength - 1).trim()}…` : compact
}

const extractReadingMultipleChoiceOptions = (
  passage: ReadingPassageRecord | null,
  question: ReadingQuestion | null
): ReadingPdoyMultipleChoiceOption[] => {
  if (!passage || !question) return []

  if (isReadingMatchingHeadingQuestion(passage, question)) {
    const sectionText = String(passage.questionSectionText || '')
    const listMatch = sectionText.match(/List of Headings\s*\n([\s\S]*?)(?=\n\s*\d+\s*(?:Paragraph|\.|\s))/i)
    const headingSource = listMatch?.[1] || sectionText
    const headingOptions = headingSource
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const match = line.match(/^((?:i|ii|iii|iv|v|vi|vii|viii|ix|x))[\).:\-]?\s+(.+)$/i)
        if (!match) return null
        return {
          letter: match[1].toLowerCase(),
          text: match[2].trim()
        }
      })
      .filter(Boolean) as ReadingPdoyMultipleChoiceOption[]
    if (headingOptions.length) return headingOptions
  }

  if (isReadingMatchingInformationQuestion(passage, question)) {
    const letters =
      getReadingParagraphAnswerLetters(passage.questionSectionText || '') ||
      (passage.bodyParagraphs || [])
        .map((paragraph) => String(paragraph || '').trim())
        .filter((paragraph) => /^[A-I]$/i.test(paragraph))
        .map((paragraph) => paragraph.toUpperCase())
    const paragraphLetters = letters.length ? letters : ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']
    return paragraphLetters.map((letter) => ({
      letter,
      text: `Paragraph ${letter}`
    }))
  }

  const block = extractReadingQuestionBlock(passage.questionSectionText, question.number)
  const optionSource = block || passage.questionSectionText
  const lines = optionSource
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
  return lines
    .map((line) => {
      const match = line.match(/^([A-G])\s+(.+)$/i)
      if (!match) return null
      return {
        letter: match[1].toUpperCase(),
        text: match[2].trim()
      }
    })
    .filter(Boolean) as ReadingPdoyMultipleChoiceOption[]
}

const isReadingOptionParaphraseMatch = (
  input: string,
  option: ReadingPdoyMultipleChoiceOption | null,
  question: ReadingQuestion | null
) => {
  const normalizedInput = normalizeTextForLooseMatch(input)
  if (!normalizedInput || !option || !question) return false
  const optionText = normalizeTextForLooseMatch(option.text)
  const paraphrase = normalizeTextForLooseMatch(question.paraphrasedVocabulary)
  return optionText.includes(normalizedInput) || normalizedInput.includes(optionText) || paraphrase.includes(normalizedInput)
}

const READING_EVIDENCE_DISTRACTOR_STOPWORDS = new Set([
  'about', 'after', 'again', 'against', 'also', 'another', 'because', 'before', 'between', 'could', 'does',
  'during', 'example', 'following', 'from', 'have', 'into', 'mention', 'mentioned', 'more', 'most', 'people',
  'question', 'reference', 'section', 'should', 'some', 'such', 'than', 'that', 'their', 'there', 'these',
  'thing', 'this', 'through', 'what', 'when', 'where', 'which', 'while', 'with', 'would'
])

const extractReadingEvidenceKeywords = (value: string) =>
  [...new Set(
    normalizeTextForLooseMatch(value)
      .split(' ')
      .map((token) => token.trim())
      .filter((token) => token.length >= 4)
      .filter((token) => !READING_EVIDENCE_DISTRACTOR_STOPWORDS.has(token))
  )]

const scoreReadingEvidenceDistractor = (candidate: string, question: ReadingQuestion | null) => {
  if (!question) return 0
  const candidateText = normalizeTextForLooseMatch(candidate)
  if (!candidateText) return 0
  const exactPortionNormalized = normalizeTextForLooseMatch(question.exactPortion)
  if (exactPortionNormalized && candidateText.includes(exactPortionNormalized)) return -100
  const promptKeywords = extractReadingEvidenceKeywords(question.prompt)
  const paraphraseKeywords = extractReadingEvidenceKeywords(
    [question.paraphrasedVocabulary, question.prompt].filter(Boolean).join(' ')
  )
  const exactMatches = promptKeywords.filter((keyword) => candidateText.includes(keyword)).length
  const paraphraseMatches = paraphraseKeywords.filter((keyword) => candidateText.includes(keyword)).length
  const answerMatch = candidateText.includes(normalizeTextForLooseMatch(question.correctAnswer)) ? -3 : 0
  return exactMatches * 5 + paraphraseMatches * 3 + answerMatch
}

const buildReadingMatchingEvidencePortions = (
  passage: ReadingPassageRecord | null,
  question: ReadingQuestion | null
) => {
  const hintNeedles = buildReadingHintNeedles(question?.exactPortion || '')
  const correctText = hintNeedles[0] || String(question?.exactPortion || '').trim()
  const correctNormalized = normalizeTextForLooseMatch(correctText)
  const focusIndex = passage && question ? findReadingEvidenceParagraphIndex(passage, question.exactPortion) : -1
  const paragraphs = passage?.bodyParagraphs || []
  const useParagraphLabels = isReadingMatchingQuestion(passage, question)

  const pickTrapSentenceSnippet = (paragraph: string, index: number) => {
    const prefix = useParagraphLabels ? `Paragraph ${getReadingPassageLabel(index)}: ` : ''
    const sentences = String(paragraph || '')
      .split(/(?<=[.!?])\s+/)
      .map((sentence) => sentence.replace(/\s+/g, ' ').trim())
      .filter((sentence) => sentence.length >= 18)
    if (!sentences.length) {
      return prefix + clipReadingOptionText(paragraph, useParagraphLabels ? 240 : 200)
    }
    const ranked = sentences
      .map((sentence) => ({
        sentence,
        trapScore: scoreReadingEvidenceDistractor(sentence, question)
      }))
      .filter(
        ({ sentence }) =>
          !correctNormalized || !normalizeTextForLooseMatch(sentence).includes(correctNormalized)
      )
      .sort((a, b) => b.trapScore - a.trapScore)
    if (ranked[0]?.sentence) {
      return prefix + clipReadingOptionText(ranked[0].sentence, useParagraphLabels ? 220 : 200)
    }
    return prefix + clipReadingOptionText(paragraph, useParagraphLabels ? 240 : 200)
  }

  const sentenceCandidates = paragraphs.flatMap((paragraph, index) => {
    if (index === focusIndex) return []
    const prefix = useParagraphLabels ? `Paragraph ${getReadingPassageLabel(index)}: ` : ''
    return String(paragraph || '')
      .split(/(?<=[.!?])\s+/)
      .map((sentence) => sentence.replace(/\s+/g, ' ').trim())
      .filter((sentence) => sentence.length >= 18)
      .map((sentence) => ({
        index,
        snippet: prefix + clipReadingOptionText(sentence, useParagraphLabels ? 220 : 200),
        trapScore: scoreReadingEvidenceDistractor(sentence, question)
      }))
  })

  const paragraphCandidates = paragraphs
    .map((paragraph, index) => ({
      index,
      snippet: pickTrapSentenceSnippet(paragraph, index),
      trapScore: scoreReadingEvidenceDistractor(paragraph, question)
    }))
    .filter((entry) => entry.index !== focusIndex)
    .sort((a, b) => b.trapScore - a.trapScore)

  const rankedCandidates = [...sentenceCandidates, ...paragraphCandidates].sort(
    (a, b) => b.trapScore - a.trapScore
  )

  const distractors: string[] = []
  for (const entry of rankedCandidates) {
    if (distractors.length >= 3) break
    const normalizedSnippet = normalizeTextForLooseMatch(entry.snippet)
    if (
      normalizedSnippet &&
      (!correctNormalized || !normalizedSnippet.includes(correctNormalized)) &&
      !distractors.some((item) => normalizeTextForLooseMatch(item) === normalizedSnippet)
    ) {
      distractors.push(entry.snippet)
    }
  }

  return { correctText, distractors, focusIndex }
}

const normalizeReadingAnswer = (value: string) =>
  String(value || '')
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\.$/, '')
    .toUpperCase()

const normalizeListeningAnswer = (value: string) =>
  String(value || '')
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\.$/, '')
    .toUpperCase()

const slugifyListeningBuilderPack = (value: string) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const parseListeningBuilderHeadingMeta = (value: string) => {
  const text = String(value || '')
  const bookMatch = text.match(/Book\s+(\d+)/i)
  const testMatch = text.match(/Test\s+(\d+)/i)
  const sectionMatch = text.match(/Part\s+(\d+)/i)
  return {
    bookNumber: bookMatch ? Number.parseInt(bookMatch[1], 10) : null,
    testNumber: testMatch ? Number.parseInt(testMatch[1], 10) : null,
    sectionNumber: sectionMatch ? Number.parseInt(sectionMatch[1], 10) : null
  }
}

const parseListeningVocabularyWorkbook = (raw: string): ListeningVocabularyBuilderItem[] => {
  const lines = String(raw || '').split('\n')
  let currentBook = ''
  const items: ListeningVocabularyBuilderItem[] = []

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    if (line.startsWith('## Book ')) {
      currentBook = line.replace(/^##\s*/, '').trim()
      continue
    }

    if (!line.startsWith('### Q')) continue

    const questionLabel = line.replace(/^###\s*/, '').trim()
    const fields: Record<string, string> = {}
    let cursor = index + 1

    while (cursor < lines.length && !lines[cursor].startsWith('### Q') && !lines[cursor].startsWith('## ')) {
      const match = lines[cursor].match(/^- ([^:]+):\s*(.*)$/)
      if (match) {
        fields[match[1].trim()] = match[2].replace(/^`|`$/g, '').trim()
      }
      cursor += 1
    }

    if (fields['question prompt'] && fields['final answer'] && fields['transcript trigger']) {
      const questionNumber = Number.parseInt(questionLabel.replace(/^Q/i, '').trim(), 10)
      const headingMeta = parseListeningBuilderHeadingMeta(currentBook)
      items.push({
        id: `${slugifyListeningBuilderPack(currentBook)}-q${questionNumber}`,
        book: currentBook,
        bookNumber: headingMeta.bookNumber,
        testNumber: headingMeta.testNumber,
        sectionNumber: headingMeta.sectionNumber,
        questionNumber: Number.isFinite(questionNumber) ? questionNumber : items.length + 1,
        questionPrompt: fields['question prompt'],
        answer: fields['final answer'],
        transcript: fields['transcript trigger'],
        paraphraseType: fields['paraphrase type'] || '',
        paraphraseLogic: fields['paraphrase logic'] || '',
        thaiExplanation: fields['thai explanation'] || '',
        thaiMeaning: fields['thai meaning of key word'] || ''
      })
    }

    index = cursor - 1
  }

  return items
}

const stripListeningBankTick = (value: string) => String(value || '').replace(/^`|`$/g, '').trim()

const parseListeningSectionBank = (raw: string): ListeningSectionBankTest[] => {
  const lines = String(raw || '').split('\n')
  const tests: ListeningSectionBankTest[] = []
  let currentBookNumber: number | null = null
  let currentSectionNumber: number | null = null
  let currentTestNumber: number | null = null
  let currentTitle = ''
  let currentQuestionCoverage: string[] = []
  let currentAnswerLines: string[] = []
  let currentVocabFocus: string[] = []
  let currentBlock: 'coverage' | 'answers' | 'vocab' | null = null

  const flushCurrentTest = () => {
    if (
      currentBookNumber == null ||
      currentSectionNumber == null ||
      currentTestNumber == null ||
      !currentTitle
    ) {
      return
    }

    tests.push({
      id: `cambridge-${currentBookNumber}-section-${currentSectionNumber}-test-${currentTestNumber}`,
      bookNumber: currentBookNumber,
      sectionNumber: currentSectionNumber,
      testNumber: currentTestNumber,
      title: currentTitle,
      questionCoverage: [...currentQuestionCoverage],
      answerLines: [...currentAnswerLines],
      vocabFocus: [...currentVocabFocus]
    })
  }

  for (const rawLine of lines) {
    const line = String(rawLine || '').trimEnd()
    const trimmed = line.trim()

    const bookMatch = trimmed.match(/^## Cambridge (\d+)/i)
    if (bookMatch) {
      flushCurrentTest()
      currentBookNumber = Number.parseInt(bookMatch[1], 10)
      currentSectionNumber = null
      currentTestNumber = null
      currentTitle = ''
      currentQuestionCoverage = []
      currentAnswerLines = []
      currentVocabFocus = []
      currentBlock = null
      continue
    }

    const sectionMatch = trimmed.match(/^### Section (\d+)/i)
    if (sectionMatch) {
      flushCurrentTest()
      currentSectionNumber = Number.parseInt(sectionMatch[1], 10)
      currentTestNumber = null
      currentTitle = ''
      currentQuestionCoverage = []
      currentAnswerLines = []
      currentVocabFocus = []
      currentBlock = null
      continue
    }

    const testMatch = trimmed.match(/^#### Test (\d+)/i)
    if (testMatch) {
      flushCurrentTest()
      currentTestNumber = Number.parseInt(testMatch[1], 10)
      currentTitle = ''
      currentQuestionCoverage = []
      currentAnswerLines = []
      currentVocabFocus = []
      currentBlock = null
      continue
    }

    if (trimmed.startsWith('- section title:')) {
      currentTitle = stripListeningBankTick(trimmed.replace(/^- section title:\s*/, ''))
      currentBlock = null
      continue
    }

    if (trimmed === '- question coverage:') {
      currentBlock = 'coverage'
      continue
    }

    if (trimmed === '- answer key:' || trimmed === '- answer bank:') {
      currentBlock = 'answers'
      continue
    }

    if (trimmed === '- vocab focus:') {
      currentBlock = 'vocab'
      continue
    }

    if (!trimmed.startsWith('- `')) continue

    const listValue = stripListeningBankTick(trimmed.replace(/^- /, ''))
    if (!listValue) continue

    if (currentBlock === 'coverage') {
      currentQuestionCoverage.push(listValue)
      continue
    }

    if (currentBlock === 'answers') {
      currentAnswerLines.push(listValue)
      continue
    }

    if (currentBlock === 'vocab') {
      currentVocabFocus.push(listValue)
    }
  }

  flushCurrentTest()
  return tests
}

const canonicalizeReadingCorrectAnswer = (value: string) => {
  const normalized = normalizeReadingAnswer(value)
  if (!normalized) return ''
  if (normalized.startsWith('NOT GIVEN')) return 'NOT GIVEN'
  if (normalized.startsWith('TRUE')) return 'TRUE'
  if (normalized.startsWith('FALSE')) return 'FALSE'
  if (normalized.startsWith('YES')) return 'YES'
  if (normalized.startsWith('NO')) return 'NO'
  if (READING_ROMAN_HEADING_PATTERN.test(normalized)) {
    return normalized.toLowerCase()
  }
  const letterMatch = normalized.match(/^([A-G])(?:\b|\s|\()/)
  if (letterMatch) return letterMatch[1]
  return String(value || '').trim()
}

const normalizeReadingScoredAnswer = (value: string) => {
  const canonical = canonicalizeReadingCorrectAnswer(value)
  return canonical ? normalizeReadingAnswer(canonical) : normalizeReadingAnswer(value)
}

const isReadingAnswerCorrect = (
  userAnswer: string,
  correctAnswer: string,
  acceptedAnswers?: string[]
) => {
  const normalizedUserAnswer = normalizeReadingScoredAnswer(userAnswer)
  if (!normalizedUserAnswer) return false
  const answerPool = acceptedAnswers?.length ? acceptedAnswers : [correctAnswer]
  return answerPool.some((answer) => normalizeReadingScoredAnswer(answer) === normalizedUserAnswer)
}

const buildReadingEvidenceOptions = (
  passage: ReadingPassageRecord | null,
  question: ReadingQuestion | null
): ReadingPdoyEvidenceOption[] => {
  if (!question) return []

  const isMatchingQuestion = isReadingMatchingQuestion(passage, question)

  if (isMatchingQuestion) {
    const { correctText, distractors } = buildReadingMatchingEvidencePortions(passage, question)
    const safeDistractors = [...distractors]
    while (safeDistractors.length < 3) {
      safeDistractors.push(
        safeDistractors.length === 0
          ? 'Another paragraph discusses a related topic, but not the one this question targets.'
          : 'Similar keywords appear here, but the meaning does not match the question.'
      )
    }
    const options: ReadingPdoyEvidenceOption[] = [
      { id: `matching-evidence-${question.number}-a`, text: safeDistractors[0], isCorrect: false },
      { id: `matching-evidence-${question.number}-b`, text: safeDistractors[1], isCorrect: false },
      { id: `matching-evidence-${question.number}-c`, text: correctText, isCorrect: true },
      { id: `matching-evidence-${question.number}-d`, text: safeDistractors[2], isCorrect: false }
    ]
    const rotation = question.number % options.length
    return options.map((_, index) => ({
      ...options[(index + rotation) % options.length],
      id: `matching-evidence-${question.number}-${index}`
    }))
  }

  const hintNeedles = buildReadingHintNeedles(question.exactPortion)
  const correctText = hintNeedles[0] || String(question.exactPortion || '').trim() || String(question.prompt || '').trim()
  const correctNormalized = normalizeTextForLooseMatch(correctText)
  const focusIndex = question && passage ? findReadingEvidenceParagraphIndex(passage, question.exactPortion) : -1

  const sentencePool = (passage?.bodyParagraphs || [])
    .flatMap((paragraph, index) =>
      String(paragraph || '')
        .split(/(?<=[.!?])\s+/)
        .map((sentence) => sentence.replace(/\s+/g, ' ').trim())
        .filter((sentence) => sentence.length >= 18)
        .map((sentence) => ({ sentence, index }))
    )
    .filter(({ sentence, index }) => {
      const normalizedSentence = normalizeTextForLooseMatch(sentence)
      if (!normalizedSentence) return false
      if (correctNormalized && normalizedSentence.includes(correctNormalized)) return false
      if (focusIndex >= 0 && Math.abs(index - focusIndex) > 2) return false
      return true
    })
    .map((entry, fallbackIndex) => ({
      ...entry,
      fallbackIndex,
      trapScore: scoreReadingEvidenceDistractor(entry.sentence, question)
    }))
    .sort((a, b) => {
      if (b.trapScore !== a.trapScore) return b.trapScore - a.trapScore
      if (focusIndex >= 0) {
        const distanceA = Math.abs(a.index - focusIndex)
        const distanceB = Math.abs(b.index - focusIndex)
        if (distanceA !== distanceB) return distanceA - distanceB
      }
      return a.fallbackIndex - b.fallbackIndex
    })

  const distractors: string[] = []
  for (const entry of sentencePool) {
    if (distractors.length >= 2) break
    if (!distractors.some((item) => normalizeTextForLooseMatch(item) === normalizeTextForLooseMatch(entry.sentence))) {
      distractors.push(entry.sentence)
    }
  }

  while (distractors.length < 2) {
    distractors.push(
      distractors.length === 0
        ? 'ข้อความนี้พูดถึงอีกประเด็นหนึ่ง ไม่ใช่จุดที่ใช้ตอบข้อนี้'
        : 'มีคำใกล้เคียง แต่ยังไม่ใช่วลีที่พาราฟเรสตรงกับโจทย์'
    )
  }

  if (isReadingJudgementQuestion(question) && isReadingNotGivenAnswer(question.correctAnswer)) {
    const trapText =
      pickReadingTrapSentence(passage, question) ||
      correctText ||
      'ข้อความที่พูดถึงหัวข้อเดียวกับโจทย์ แต่ไม่ได้ยืนยันหรือปฏิเสธข้อความในข้อ'
    const trapNormalized = normalizeTextForLooseMatch(trapText)
    const ngDistractors = [...distractors]
    if (correctText && !ngDistractors.some((item) => normalizeTextForLooseMatch(item) === normalizeTextForLooseMatch(correctText))) {
      ngDistractors.push(correctText)
    }
    ngDistractors.push('หาไม่เจอใน passage ส่วนนี้ / cannot find it clearly here')
    while (ngDistractors.length < 2) {
      ngDistractors.push(
        ngDistractors.length === 0
          ? 'ประโยคนี้ยืนยันหรือปฏิเทธข้อความในข้อชัดเจนเกินไป จึงไม่ใช่ NOT GIVEN'
          : 'ประโยคนี้ไม่เกี่ยวกับหัวข้อในโจทย์เลย'
      )
    }
    const ngOptions: ReadingPdoyEvidenceOption[] = [
      { id: 'choice-a', text: ngDistractors[0], isCorrect: false },
      { id: 'choice-b', text: ngDistractors[1], isCorrect: false },
      { id: 'choice-c', text: trapText, isCorrect: true },
      {
        id: 'choice-d',
        text: ngDistractors.find((item) => normalizeTextForLooseMatch(item) !== trapNormalized) || ngDistractors[1],
        isCorrect: false
      }
    ]
    const rotation = question.number % ngOptions.length
    return ngOptions.map((_, index) => ngOptions[(index + rotation) % ngOptions.length])
  }

  const options: ReadingPdoyEvidenceOption[] = [
    {
      id: 'choice-a',
      text: distractors[0],
      isCorrect: false
    },
    {
      id: 'choice-b',
      text: distractors[1],
      isCorrect: false
    },
    {
      id: 'choice-c',
      text: 'หาไม่เจอใน passage ส่วนนี้ / cannot find it clearly here',
      isCorrect: false
    },
    {
      id: 'choice-d',
      text: correctText,
      isCorrect: true
    }
  ]

  const rotation = question.number % options.length
  return options.map((_, index) => options[(index + rotation) % options.length])
}

const buildReadingFillPortionOptions = (
  passage: ReadingPassageRecord | null,
  question: ReadingQuestion | null
): ReadingPdoyEvidenceOption[] => {
  if (!question) return []

  const hintNeedles = buildReadingHintNeedles(question.exactPortion)
  const correctText = hintNeedles[0] || String(question.exactPortion || '').trim() || String(question.prompt || '').trim()
  const correctNormalized = normalizeTextForLooseMatch(correctText)
  const focusIndex = question && passage ? findReadingEvidenceParagraphIndex(passage, question.exactPortion) : -1

  const sentencePool = (passage?.bodyParagraphs || [])
    .flatMap((paragraph, index) =>
      String(paragraph || '')
        .split(/(?<=[.!?])\s+/)
        .map((sentence) => sentence.replace(/\s+/g, ' ').trim())
        .filter((sentence) => sentence.length >= 30)
        .map((sentence) => ({ sentence, index }))
    )
    .filter(({ sentence, index }) => {
      const normalizedSentence = normalizeTextForLooseMatch(sentence)
      if (!normalizedSentence) return false
      if (correctNormalized && normalizedSentence.includes(correctNormalized)) return false
      if (focusIndex >= 0 && Math.abs(index - focusIndex) > 3) return false
      return true
    })

  const distractors: string[] = []
  for (const entry of sentencePool) {
    if (distractors.length >= 2) break
    if (!distractors.some((item) => normalizeTextForLooseMatch(item) === normalizeTextForLooseMatch(entry.sentence))) {
      distractors.push(entry.sentence)
    }
  }

  while (distractors.length < 2) {
    distractors.push(
      distractors.length === 0
        ? 'This sentence mentions another detail in the passage, but not the exact spot that answers the blank.'
        : 'This portion is related to the topic, but it does not contain the closest paraphrase for the blank.'
    )
  }

  const options: ReadingPdoyEvidenceOption[] = [
    { id: 'fill-portion-a', text: distractors[0], isCorrect: false },
    { id: 'fill-portion-b', text: correctText, isCorrect: true },
    { id: 'fill-portion-c', text: distractors[1], isCorrect: false }
  ]

  const rotation = Number(question.number || 0) % options.length
  return options.map((_, index) => options[(index + rotation) % options.length])
}

const READING_FILL_DISTRACTOR_STOPWORDS = new Set([
  'the', 'and', 'that', 'with', 'from', 'this', 'into', 'when', 'they', 'them', 'their', 'have', 'been', 'were',
  'will', 'would', 'there', 'about', 'years', 'could', 'local', 'people', 'surface', 'below', 'deep', 'part',
  'soil', 'land', 'tree', 'roots', 'ancient', 'go', 'turns', 'only', 'year', 'round', 'source', 'water', 'diet',
  'drought', 'erosion', 'desert'
])

const getReadingFillGrammarHint = (question: ReadingQuestion | null) => {
  if (!question) return ''
  const prompt = String(question.prompt || '').replace(/\s+/g, ' ').trim()
  const normalizedPrompt = prompt
    .replace(/\d+[.·…_]+/g, ' __BLANK__ ')
    .replace(/_{2,}/g, ' __BLANK__ ')
    .replace(/\s+/g, ' ')
    .trim()

  const tokens = normalizedPrompt.split(' ').filter(Boolean)
  const blankIndex = tokens.findIndex((token) => token.includes('__BLANK__'))
  const previous = blankIndex > 0 ? tokens[blankIndex - 1].toLowerCase() : ''
  const next = blankIndex >= 0 && blankIndex < tokens.length - 1 ? tokens[blankIndex + 1].toLowerCase() : ''
  const nextTwo = blankIndex >= 0 && blankIndex < tokens.length - 2 ? tokens[blankIndex + 2].toLowerCase() : ''
  const answer = String(question.correctAnswer || '').trim()
  const answerLower = answer.toLowerCase()

  const cues: string[] = []

  if (/\b__BLANK__\s+in\s+(shape|size|length|height|colour|color|form)\b/i.test(normalizedPrompt)) {
    cues.push('ดูโครงสร้างหลัง blank ก่อนครับ ถ้าตามด้วย in shape / in size แบบนี้ คำตอบมักเป็น adjective ที่เอาไว้บอกรูปลักษณะ')
  }

  if (/\b(a|an|the)\s+__BLANK__\s+[a-z-]+\b/i.test(normalizedPrompt)) {
    cues.push('มี article แล้วตามด้วยคำนามอีกทีครับ แปลว่า blank นี้มักเป็น adjective ที่ใช้ขยายคำนาม')
  } else if (/\b(a|an)\s+__BLANK__\b/i.test(normalizedPrompt)) {
    cues.push('มี a/an อยู่หน้าช่องว่างครับ ปกติคำตอบมักต้องเป็นคำนามนับได้เอกพจน์ หรือคำที่ทำให้โครงสร้างหลัง a/an สมบูรณ์')
  } else if (/\bthe\s+__BLANK__\b/i.test(normalizedPrompt)) {
    cues.push('มี the อยู่หน้าช่องว่างครับ ให้เช็กว่าตรงนี้กำลังต้องการ noun หรือชื่อสิ่งเฉพาะตามความหมายของประโยค')
  }

  if (/\b(periods|part|source|lack|movement|amount|range|risk|type|kind)\s+of\s+__BLANK__\b/i.test(normalizedPrompt)) {
    cues.push('คำหน้า blank เป็นโครงสร้างแบบ noun + of ครับ ตรงนี้มักต้องการคำนาม')
  }

  if (/\b(prevents|causes|allows|encourages|reduces|increases|shows|provides|creates|uses|needs|helps)\s+__BLANK__\b/i.test(normalizedPrompt)) {
    cues.push('หลังคำกริยาแบบ prevents / allows / creates ตรงนี้มักต้องเติมคำนามหรือ noun phrase ที่เป็นผลของกริยานั้น')
  }

  if (/\b(taken|moved|exported|sent|returned|transported)\s+to\s+__BLANK__\b/i.test(normalizedPrompt)) {
    cues.push('ดู preposition ด้วยครับ ถ้าเป็น taken to / moved to แบบนี้ คำตอบมักเป็นสถานที่หรือชื่อพื้นที่')
  }

  if (/\b(local|ancient|young|other|these|those|their|his|her|our|its)\s+__BLANK__\b/i.test(normalizedPrompt)) {
    cues.push('มีคำชี้เฉพาะหรือคำแสดงความเป็นเจ้าของอยู่หน้า blank ครับ ตรงนี้มักต้องการคำนาม')
  }

  if (previous && ['is', 'are', 'was', 'were', 'be', 'become', 'became', 'seem', 'seems'].includes(previous) && next && ['in', 'of', 'for', 'to', 'with', 'as'].includes(next)) {
    cues.push('ดูโครงสร้าง be + blank + preposition ครับ ตรงนี้มักเป็น adjective หรือคำบอกลักษณะมากกว่าคำนาม')
  }

  if (!/\b(a|an)\s+__BLANK__\b/i.test(normalizedPrompt) && /\b__BLANK__\b/.test(normalizedPrompt)) {
    cues.push('ถ้าไม่มี a/an นำหน้า ให้เช็กเพิ่มว่าคำตอบควรเป็นนามนับไม่ได้ รูปพหูพจน์ หรือคำคุณศัพท์ตามโครงสร้างรอบ ๆ')
  }

  if (answer) {
    if (answerLower.endsWith('s') && !/(ss|us|is)$/.test(answerLower)) {
      cues.push('คำตอบจริงอยู่ในรูปพหูพจน์ครับ เวลาเลือกคำตอบให้สังเกตด้วยว่าความหมายต้องเป็นหลายสิ่ง')
    } else if (/^[a-z-]+$/.test(answerLower) && !answerLower.endsWith('s') && /\b(a|an)\s+__BLANK__\b/i.test(normalizedPrompt)) {
      cues.push('คำตอบอยู่ในรูปเอกพจน์ครับ เพราะโครงสร้างรอบ blank ต้องการคำเดี่ยวที่นับได้')
    }
  }

  const compactCues = [...new Set(cues)].slice(0, 3)
  if (compactCues.length) return compactCues.join(' ')

  if (previous === 'of' || next === 'of' || nextTwo === 'of') {
    return 'ลองเช็ก grammar รอบ blank ก่อนครับ โครงสร้างแถวนี้มี of เข้ามาเกี่ยวข้อง จึงมักต้องการคำนามที่ทำให้ความหมายสมบูรณ์'
  }

  return 'ลองดู grammar รอบ blank ก่อนครับ ว่าตำแหน่งนี้ต้องการ noun, adjective, หรือคำบอกสถานที่ แล้วค่อยย้อนหา paraphrase ใน passage'
}

const READING_FILL_UNCOUNTABLE_ANSWERS = new Set([
  'water',
  'erosion',
  'information',
  'wildlife',
  'equipment',
  'furniture',
  'advice',
  'traffic',
  'pollution'
])

const getReadingFillAnswerCategory = (question: ReadingQuestion | null) => {
  if (!question) return 'noun-singular'
  const prompt = String(question.prompt || '').replace(/\s+/g, ' ').trim()
  const answer = String(question.correctAnswer || '').trim().toLowerCase()

  if (/\b__BLANK__\s+in\s+(shape|size|length|height|colour|color|form)\b/i.test(
    prompt.replace(/\d+[.·…_]+/g, ' __BLANK__ ').replace(/_{2,}/g, ' __BLANK__ ')
  )) {
    return 'adjective'
  }
  if (/\b(taken|moved|exported|sent|returned|transported)\s+to\s+/.test(prompt.toLowerCase())) {
    return 'place'
  }
  if (/\b(a|an)\s+[0-9.·…_]+/i.test(prompt) || /\b(a|an)\s+_{2,}/i.test(prompt)) {
    return 'noun-singular'
  }
  if (READING_FILL_UNCOUNTABLE_ANSWERS.has(answer)) {
    return 'noun-uncountable'
  }
  if (answer.endsWith('s') && !/(ss|us|is)$/.test(answer)) {
    return 'noun-plural'
  }
  return 'noun-singular'
}

const buildReadingFillGrammarChoiceOptions = (question: ReadingQuestion | null): ReadingPdoyFillGrammarOption[] => {
  const correctCategory = getReadingFillAnswerCategory(question)
  const optionPool = [
    { id: 'grammar-adjective', key: 'adjective', label: 'adjective / คำคุณศัพท์' },
    { id: 'grammar-singular', key: 'noun-singular', label: 'คำนามนับได้เอกพจน์' },
    { id: 'grammar-plural', key: 'noun-plural', label: 'คำนามพหูพจน์' },
    { id: 'grammar-uncountable', key: 'noun-uncountable', label: 'คำนามนับไม่ได้ / คำนามนามธรรม' },
    { id: 'grammar-place', key: 'place', label: 'ชื่อสถานที่ / ชื่อเฉพาะ' }
  ]
  const correctOption = optionPool.find((option) => option.key === correctCategory) || optionPool[1]
  const distractors = optionPool.filter((option) => option.key !== correctOption.key)
  const selected = [correctOption, ...distractors.slice(0, 3)]
  const rotation = Number(question?.number || 0) % selected.length
  return selected.map((_, index) => {
    const option = selected[(index + rotation) % selected.length]
    return {
      id: option.id,
      label: option.label,
      isCorrect: option.key === correctOption.key
    }
  })
}

const parseReadingParaphrasePairs = (question: ReadingQuestion | null) => {
  const raw = String(question?.paraphrasedVocabulary || '').trim()
  if (!raw) return []
  return raw
    .split(/\s*;\s*|\n+/)
    .map((segment) => segment.trim())
    .filter(Boolean)
    .map((segment) => {
      const parts = segment.split(/\s*(?:=|->|→)\s*/).map((item) => item.trim()).filter(Boolean)
      if (parts.length < 2) return null
      return {
        important: parts[0].replace(/^\[|\]$/g, '').trim(),
        match: parts[1].replace(/^\[|\]$/g, '').trim()
      }
    })
    .filter(Boolean) as Array<{ important: string; match: string }>
}

const parseParaphraseBridge = (value: string) => {
  const raw = String(value || '').trim()
  if (!raw) return null

  const firstSegment = raw
    .split(/\s*;\s*|\n+/)
    .map((segment) => segment.trim())
    .find(Boolean)

  if (!firstSegment) return null

  const parts = firstSegment.split(/\s*(?:=|->|→)\s*/).map((item) => item.trim()).filter(Boolean)
  if (parts.length < 2) return null

  return {
    questionKeyword: parts[0].replace(/^\[|\]$/g, '').trim(),
    passageKeyword: parts[1].replace(/^\[|\]$/g, '').trim()
  }
}

const buildReadingParaphraseEquation = (
  question: ReadingQuestion | null,
  vocabSupport?: { meaning: string } | null
) => {
  if (!question) return null

  const target = buildReadingFillWordTarget(question)
  const bridge = parseParaphraseBridge(question.paraphrasedVocabulary)
  const exactNeedle = buildReadingHintNeedles(question.exactPortion)[0] || String(question.exactPortion || '').trim()
  const questionKeyword = String(
    target?.important || bridge?.questionKeyword || pickReadingPdoyQuestionClue(question).clue || question.correctAnswer
  ).trim()
  const passageKeyword = String(target?.match || bridge?.passageKeyword || exactNeedle || question.correctAnswer).trim()
  const thaiMeaning = String(
    target?.matchThai ||
      target?.importantThai ||
      lookupReadingThaiMeaning(questionKeyword) ||
      lookupReadingThaiMeaning(passageKeyword) ||
      vocabSupport?.meaning ||
      question.explanationThai
  ).trim()

  if (!questionKeyword && !passageKeyword && !thaiMeaning) return null

  return {
    questionKeyword: questionKeyword || '-',
    passageKeyword: passageKeyword || '-',
    thaiMeaning: thaiMeaning || '-'
  }
}

const buildListeningParaphraseEquation = (question: ListeningQuestion | null) => {
  if (!question) return null

  const bridge = parseParaphraseBridge(question.paraphrasedVocabulary)
  const exactNeedle = buildReadingHintNeedles(question.exactPortion)[0] || String(question.exactPortion || '').trim()
  const questionKeyword = String(bridge?.questionKeyword || question.correctAnswer || question.prompt).trim()
  const passageKeyword = String(bridge?.passageKeyword || exactNeedle || question.correctAnswer).trim()
  const thaiMeaning = String(
    lookupReadingThaiMeaning(questionKeyword) ||
      lookupReadingThaiMeaning(passageKeyword) ||
      question.explanationThai
  ).trim()

  if (!questionKeyword && !passageKeyword && !thaiMeaning) return null

  return {
    questionKeyword: questionKeyword || '-',
    passageKeyword: passageKeyword || '-',
    thaiMeaning: thaiMeaning || '-'
  }
}

const buildReadingFillWordTarget = (question: ReadingQuestion | null) => {
  if (!question) return null
  const pairs = parseReadingParaphrasePairs(question)
  const exactPortion = String(question.exactPortion || '')
  const answer = String(question.correctAnswer || '').trim()

  const matchedPair =
    pairs.find((pair) => normalizeTextForLooseMatch(exactPortion).includes(normalizeTextForLooseMatch(pair.match))) ||
    pairs.find((pair) => normalizeTextForLooseMatch(pair.match).includes(normalizeTextForLooseMatch(answer))) ||
    null

  if (matchedPair) {
    return {
      important: matchedPair.important,
      importantThai: lookupReadingThaiMeaning(matchedPair.important),
      match: matchedPair.match,
      matchThai: lookupReadingThaiMeaning(matchedPair.match)
    }
  }

  if (String(question.prompt || '').toLowerCase().includes('in shape')) {
    return {
      important: 'shape',
      importantThai: lookupReadingThaiMeaning('shape'),
      match: answer,
      matchThai: lookupReadingThaiMeaning(answer)
    }
  }

  const clue = pickReadingPdoyQuestionClue(question)
  return {
    important: clue.clue,
    importantThai: lookupReadingThaiMeaning(clue.clue),
    match: answer,
    matchThai: lookupReadingThaiMeaning(answer)
  }
}

const buildReadingPhraseCandidates = (text: string) => {
  const normalized = String(text || '').replace(/\s+/g, ' ').trim()
  if (!normalized) return []

  const phraseMatches = normalized.match(/[A-Za-z-]+(?:\s+[A-Za-z-]+){0,2}/g) || []
  return [...new Set(
    phraseMatches
      .map((phrase) => phrase.trim())
      .filter((phrase) => phrase.length >= 4)
      .filter((phrase) => !READING_FILL_DISTRACTOR_STOPWORDS.has(phrase.toLowerCase()))
  )]
}

const buildReadingFillWordMatchOptions = (
  question: ReadingQuestion | null,
  selectedPortionText: string
): ReadingPdoyFillWordMatchOption[] => {
  const target = buildReadingFillWordTarget(question)
  if (!target) return []

  const correctText = String(target.match || '').trim()
  const correctTextPresentInPortion = normalizeTextForLooseMatch(selectedPortionText).includes(
    normalizeTextForLooseMatch(correctText)
  )
  const phrasePool = buildReadingPhraseCandidates(selectedPortionText)
  const distractors: string[] = []

  for (const phrase of phrasePool) {
    if (normalizeTextForLooseMatch(phrase) === normalizeTextForLooseMatch(correctText)) continue
    if (distractors.some((item) => normalizeTextForLooseMatch(item) === normalizeTextForLooseMatch(phrase))) continue
    distractors.push(phrase)
    if (distractors.length >= 2) break
  }

  while (distractors.length < 2) {
    distractors.push(
      distractors.length === 0
        ? 'cannot find it clearly here'
        : distractors.length === 1
          ? String(question?.correctAnswer || '').trim()
          : 'look again carefully'
    )
  }

  const options: ReadingPdoyFillWordMatchOption[] = [
    {
      id: 'fill-match-cannot-find',
      text: 'หาไม่เจอชัดใน portion นี้ / cannot find it clearly here',
      meaning: 'ใช้ได้เมื่อยังไม่เห็นคำหรือวลีที่ match กันจริง ๆ ในส่วนที่เลือกมา',
      isCorrect: !correctTextPresentInPortion
    },
    {
      id: 'fill-match-correct',
      text: correctText,
      meaning: target.matchThai || lookupReadingThaiMeaning(correctText),
      isCorrect: correctTextPresentInPortion
    },
    {
      id: 'fill-match-distractor-a',
      text: distractors[0],
      meaning: lookupReadingThaiMeaning(distractors[0]),
      isCorrect: false
    },
    {
      id: 'fill-match-distractor-b',
      text: distractors[1],
      meaning: lookupReadingThaiMeaning(distractors[1]),
      isCorrect: false
    }
  ]

  const rotation = Number(question?.number || 0) % options.length
  return options.map((_, index) => options[(index + rotation) % options.length])
}

const shouldUseReadingSharedAnswerPool = (orderedQuestions: ReadingQuestion[]) => {
  if (orderedQuestions.length <= 1) return false
  const firstAcceptedAnswers = (orderedQuestions[0]?.acceptedAnswers || [])
    .map((answer) => normalizeReadingScoredAnswer(answer))
    .filter(Boolean)
  if (firstAcceptedAnswers.length <= 1) return false

  const firstKey = [...firstAcceptedAnswers].sort().join('\u0001')
  return orderedQuestions.every((question) => {
    const acceptedAnswers = (question.acceptedAnswers || [])
      .map((answer) => normalizeReadingScoredAnswer(answer))
      .filter(Boolean)
    return acceptedAnswers.length > 1 && [...acceptedAnswers].sort().join('\u0001') === firstKey
  })
}

const scoreReadingQuestions = (
  questions: ReadingQuestion[],
  answers: Record<number, string>
) => {
  const groupedQuestionNumbers = new Set<number>()
  const groupedResults = new Map<number, boolean>()
  const groupedQuestions = new Map<string, ReadingQuestion[]>()

  for (const question of questions) {
    if (!question.answerGroup) continue
    groupedQuestionNumbers.add(question.number)
    const key = String(question.answerGroup)
    const current = groupedQuestions.get(key) || []
    current.push(question)
    groupedQuestions.set(key, current)
  }

  for (const groupQuestions of groupedQuestions.values()) {
    const orderedQuestions = [...groupQuestions].sort((a, b) => a.number - b.number)
    const usesSharedAnswerPool = shouldUseReadingSharedAnswerPool(orderedQuestions)

    if (!usesSharedAnswerPool) {
      for (const question of orderedQuestions) {
        groupedResults.set(
          question.number,
          isReadingAnswerCorrect(
            String(answers[question.number] || ''),
            question.correctAnswer,
            question.acceptedAnswers
          )
        )
      }
      continue
    }

    const acceptedAnswers = orderedQuestions[0]?.acceptedAnswers?.length
      ? [...orderedQuestions[0].acceptedAnswers]
      : orderedQuestions.map((question) => question.correctAnswer)
    const remainingAnswers = acceptedAnswers.map((answer) => normalizeReadingScoredAnswer(answer))

    for (const question of orderedQuestions) {
      const normalizedUserAnswer = normalizeReadingScoredAnswer(String(answers[question.number] || ''))
      const matchedIndex = normalizedUserAnswer ? remainingAnswers.indexOf(normalizedUserAnswer) : -1
      if (matchedIndex >= 0) {
        groupedResults.set(question.number, true)
        remainingAnswers.splice(matchedIndex, 1)
      } else {
        groupedResults.set(question.number, false)
      }
    }
  }

  return questions.map((question) => {
    const userAnswer = String(answers[question.number] || '').trim()
    return {
      ...question,
      userAnswer,
      isCorrect: groupedQuestionNumbers.has(question.number)
        ? Boolean(groupedResults.get(question.number))
        : isReadingAnswerCorrect(userAnswer, question.correctAnswer, question.acceptedAnswers)
    }
  })
}

const scoreListeningQuestions = (
  questions: ListeningQuestion[],
  answers: Record<number, string>
) =>
  questions.map((question) => {
    const userAnswer = String(answers[question.number] || '').trim()
    const acceptedAnswers = question.acceptedAnswers?.length
      ? question.acceptedAnswers
      : [question.correctAnswer]
    const normalizedUserAnswer = normalizeListeningAnswer(userAnswer)
    const isCorrect = acceptedAnswers.some(
      (answer) => normalizeListeningAnswer(String(answer || '')) === normalizedUserAnswer
    )
    return {
      ...question,
      userAnswer,
      isCorrect
    }
  })

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

const parseStoredReadingAttempts = (value: string | null): Record<string, ReadingAttemptSummary> => {
  if (!value) return {}
  try {
    const parsed = JSON.parse(value) as Record<string, ReadingAttemptSummary>
    if (!parsed || typeof parsed !== 'object') return {}
    return Object.fromEntries(
      Object.entries(parsed).map(([examId, attempt]) => {
        const reportItems = Array.isArray(attempt?.reportItems)
          ? attempt.reportItems.map((item) => ({
              ...item,
              number: Number(item?.number || 0),
              prompt: String(item?.prompt || ''),
              correctAnswer: String(item?.correctAnswer || ''),
              answerType: item?.answerType || 'text',
              exactPortion: String(item?.exactPortion || ''),
              explanationThai: String(item?.explanationThai || ''),
              paraphrasedVocabulary: String(item?.paraphrasedVocabulary || ''),
              userAnswer: String(item?.userAnswer || ''),
              isCorrect: Boolean(item?.isCorrect),
              acceptedAnswers: Array.isArray(item?.acceptedAnswers)
                ? item.acceptedAnswers.map((answer) => String(answer || ''))
                : undefined,
              answerGroup: item?.answerGroup ? String(item.answerGroup) : undefined
            }))
          : []
        const rescoredReportItems = scoreReadingQuestions(
          reportItems,
          Object.fromEntries(reportItems.map((item) => [item.number, item.userAnswer]))
        )
        const correctCount = rescoredReportItems.filter((item) => item.isCorrect).length
        const totalQuestions = rescoredReportItems.length

        return [
          examId,
          {
            examId: String(attempt?.examId || examId),
            examTitle: String(attempt?.examTitle || ''),
            category: normalizeReadingBankCategory(attempt?.category),
            correctCount,
            totalQuestions,
            accuracy: totalQuestions ? Math.round((correctCount / totalQuestions) * 100) : 0,
            wrongCount: Math.max(0, totalQuestions - correctCount),
            completedAt: String(attempt?.completedAt || ''),
            reportItems: rescoredReportItems
          }
        ]
      })
    )
  } catch {
    return {}
  }
}

const getReadingAttemptCompletedTime = (attempt: ReadingAttemptSummary | undefined) => {
  const timestamp = attempt?.completedAt ? new Date(attempt.completedAt).getTime() : 0
  return Number.isFinite(timestamp) ? timestamp : 0
}

const mergeReadingAttemptHistories = (
  remoteAttempts: Record<string, ReadingAttemptSummary>,
  localAttempts: Record<string, ReadingAttemptSummary>
) => {
  const merged = { ...remoteAttempts }
  Object.entries(localAttempts).forEach(([examId, localAttempt]) => {
    const remoteAttempt = merged[examId]
    if (!remoteAttempt || getReadingAttemptCompletedTime(localAttempt) > getReadingAttemptCompletedTime(remoteAttempt)) {
      merged[examId] = localAttempt
    }
  })
  return merged
}

const parseStoredListeningAttempts = (value: string | null): Record<string, ListeningAttemptSummary> => {
  if (!value) return {}
  try {
    const parsed = JSON.parse(value) as Record<string, ListeningAttemptSummary>
    if (!parsed || typeof parsed !== 'object') return {}
    return Object.fromEntries(
      Object.entries(parsed).map(([exerciseId, attempt]) => [
        exerciseId,
        {
          exerciseId: String(attempt?.exerciseId || exerciseId),
          exerciseTitle: String(attempt?.exerciseTitle || ''),
          correctCount: Math.max(0, Number(attempt?.correctCount || 0)),
          totalQuestions: Math.max(0, Number(attempt?.totalQuestions || 0)),
          accuracy: Math.max(0, Number(attempt?.accuracy || 0)),
          wrongCount: Math.max(0, Number(attempt?.wrongCount || 0)),
          completedAt: String(attempt?.completedAt || ''),
          reportItems: Array.isArray(attempt?.reportItems)
            ? attempt.reportItems.map((item) => ({
                ...item,
                number: Number(item?.number || 0),
                prompt: String(item?.prompt || ''),
                answerType: item?.answerType === 'multiple-choice' ? 'multiple-choice' : 'text',
                correctAnswer: String(item?.correctAnswer || ''),
                acceptedAnswers: Array.isArray(item?.acceptedAnswers)
                  ? item.acceptedAnswers.map((answer) => String(answer || ''))
                  : undefined,
                options: Array.isArray(item?.options)
                  ? item.options.map((option) => ({
                      key: String(option?.key || ''),
                      text: String(option?.text || '')
                    }))
                  : undefined,
                exactPortion: String(item?.exactPortion || ''),
                explanationThai: String(item?.explanationThai || ''),
                paraphrasedVocabulary: String(item?.paraphrasedVocabulary || ''),
                userAnswer: String(item?.userAnswer || ''),
                isCorrect: Boolean(item?.isCorrect)
              }))
            : []
        }
      ])
    )
  } catch {
    return {}
  }
}

const parseStoredReadingPdoyProgress = (value: string | null): ReadingPdoyProgressSnapshot | null => {
  if (!value) return null
  try {
    const parsed = JSON.parse(value) as Partial<ReadingPdoyProgressSnapshot>
    if (!parsed?.lessonId) return null
    const step = String(parsed.step || 'intro')
    const safeStep: ReadingPdoyLessonStep = ['intro', 'evidence', 'decide', 'result', 'complete'].includes(step)
      ? (step as ReadingPdoyLessonStep)
      : 'intro'
    const normalizedFeedback =
      safeStep === 'intro' || safeStep === 'decide' || safeStep === 'result' || safeStep === 'complete'
        ? String(parsed.feedback || '')
        : ''
    return {
      lessonId: String(parsed.lessonId),
      sessionActive: Boolean(parsed.sessionActive),
      step: safeStep,
      questionIndex: Math.max(0, Number(parsed.questionIndex || 0)),
      evidenceInput: String(parsed.evidenceInput || ''),
      decision: String(parsed.decision || ''),
      selectedOption: String(parsed.selectedOption || ''),
      optionParaphraseInput: String(parsed.optionParaphraseInput || ''),
      feedback: normalizedFeedback,
      introChoice: String(parsed.introChoice || ''),
      evidenceAttempts: Math.max(0, Number(parsed.evidenceAttempts || 0)),
      decisionAttempts: Math.max(0, Number(parsed.decisionAttempts || 0)),
      fillMeaningOptionId: String(parsed.fillMeaningOptionId || '')
    }
  } catch {
    return null
  }
}

const normalizeReadingPdoySnapshotForStage = (
  snapshot: ReadingPdoyProgressSnapshot
): ReadingPdoyProgressSnapshot => ({
  ...snapshot,
  feedback:
    snapshot.step === 'intro' || snapshot.step === 'decide' || snapshot.step === 'result' || snapshot.step === 'complete'
      ? String(snapshot.feedback || '')
      : ''
})

const escapeHtml = (value: string) =>
  String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

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
  const [trialEmailInput, setTrialEmailInput] = useState('')
  const [trialPasswordInput, setTrialPasswordInput] = useState('')
  const [trialAuthMode, setTrialAuthMode] = useState<'signup' | 'signin'>('signup')
  const [trialSignupStep, setTrialSignupStep] = useState<'email' | 'password'>('email')
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
  const [adminAssessmentReports, setAdminAssessmentReports] = useState<AdminAssessmentReportSummary[]>([])
  const [, setAdminReadingPdoyProgress] = useState<AdminReadingPdoyProgressSummary[]>([])
  const [notebookSaveNotice, setNotebookSaveNotice] = useState('')
  const [practiceActionToast, setPracticeActionToast] = useState<PracticeActionToastState>(null)
  const [reportActionToast, setReportActionToast] = useState<{
    title: string
    text: string
    icon: string
  } | null>(null)
  const [adminLearnerNameInput, setAdminLearnerNameInput] = useState('')
  const [adminLearnerEmailInput, setAdminLearnerEmailInput] = useState('')
  const [adminLearnerPasswordInput, setAdminLearnerPasswordInput] = useState('')
  const [adminLearnerStatusInput, setAdminLearnerStatusInput] = useState<LearnerStatus>('active')
  const [adminLearnerExpiresAtInput, setAdminLearnerExpiresAtInput] = useState('')
  const [adminLearnerFeedbackCreditsInput, setAdminLearnerFeedbackCreditsInput] = useState(DEFAULT_FEEDBACK_CREDITS)
  const [adminLearnerFullMockCreditsInput, setAdminLearnerFullMockCreditsInput] = useState(DEFAULT_FULL_MOCK_CREDITS)
  const [adminLearnerRoleInput, setAdminLearnerRoleInput] = useState<Role>('student')
  const [adminPanelMessage, setAdminPanelMessage] = useState('')
  const [adminWorkspaceSection, setAdminWorkspaceSection] = useState<AdminWorkspaceSection>('reading')
  const [adminLearnerSearchInput, setAdminLearnerSearchInput] = useState('')
  const [adminTtsSearchInput, setAdminTtsSearchInput] = useState('')
  const [readingExams, setReadingExams] = useState<ReadingExamRecord[]>([])
  const [readingWorkspaceMode, setReadingWorkspaceMode] = useState<ReadingWorkspaceMode>('bank')
  const [readingEntryCategory, setReadingEntryCategory] = useState<ReadingBankCategory | null>(null)
  const [selectedReadingCategory, setSelectedReadingCategory] = useState<ReadingBankCategory>('normal')
  const [selectedReadingExamId, setSelectedReadingExamId] = useState('')
  const [readingAnswers, setReadingAnswers] = useState<Record<number, string>>({})
  const [readingAttemptStage, setReadingAttemptStage] = useState<'bank' | 'exam' | 'report' | 'review'>('bank')
  const [readingReportItems, setReadingReportItems] = useState<ReadingReportItem[]>([])
  const [readingAttemptHistory, setReadingAttemptHistory] = useState<Record<string, ReadingAttemptSummary>>({})
  const [readingActivePassageNumber, setReadingActivePassageNumber] = useState(1)
  const [readingSelectionText, setReadingSelectionText] = useState('')
  const [readingUserHighlights, setReadingUserHighlights] = useState<Array<{ id: string; passageNumber: number; text: string }>>([])
  const [readingHintQuestionNumber, setReadingHintQuestionNumber] = useState<number | null>(null)
  const [readingExamError, setReadingExamError] = useState('')
  const [selectedReadingPdoyLessonId, setSelectedReadingPdoyLessonId] = useState('')
  const [readingPdoySessionActive, setReadingPdoySessionActive] = useState(false)
  const [readingPdoyStep, setReadingPdoyStep] = useState<ReadingPdoyLessonStep>('intro')
  const [readingPdoyQuestionIndex, setReadingPdoyQuestionIndex] = useState(0)
  const [readingPdoyEvidenceInput, setReadingPdoyEvidenceInput] = useState('')
  const [readingPdoyDecision, setReadingPdoyDecision] = useState('')
  const [readingPdoySelectedOption, setReadingPdoySelectedOption] = useState('')
  const [readingPdoyOptionParaphraseInput, setReadingPdoyOptionParaphraseInput] = useState('')
  const [readingPdoyFeedback, setReadingPdoyFeedback] = useState('')
  const [readingPdoyIntroChoice, setReadingPdoyIntroChoice] = useState('')
  const [readingPdoyEvidenceAttempts, setReadingPdoyEvidenceAttempts] = useState(0)
  const [readingPdoyDecisionAttempts, setReadingPdoyDecisionAttempts] = useState(0)
  const [readingPdoyFillMeaningOptionId, setReadingPdoyFillMeaningOptionId] = useState('')
  const [selectedListeningExerciseId, setSelectedListeningExerciseId] = useState('')
  const [listeningLabMode, setListeningLabMode] = useState<'landing' | 'practice' | 'builder' | 'foundation'>('landing')
  const [listeningAttemptStage, setListeningAttemptStage] = useState<'bank' | 'exam' | 'report'>('bank')
  const [listeningAnswers, setListeningAnswers] = useState<Record<number, string>>({})
  const [listeningReportItems, setListeningReportItems] = useState<ListeningReportItem[]>([])
  const [listeningAttemptHistory, setListeningAttemptHistory] = useState<Record<string, ListeningAttemptSummary>>({})
  const [listeningPlaybackState, setListeningPlaybackState] = useState<'idle' | 'playing' | 'ended' | 'error'>('idle')
  const [listeningPlaybackRate, setListeningPlaybackRate] = useState<'normal' | 'slow'>('normal')
  const [listeningExerciseError, setListeningExerciseError] = useState('')
  const [selectedListeningBuilderPackId, setSelectedListeningBuilderPackId] = useState('')
  const [selectedListeningBuilderExamTestId, setSelectedListeningBuilderExamTestId] = useState('')
  const [, setListeningBuilderItemIndex] = useState(0)
  const [, setListeningBuilderExamAnswerState] = useState<Record<string, 'correct'>>({})
  const [listeningFoundationCategory, setListeningFoundationCategory] = useState<ListeningFoundationCategory>('essential')
  const [listeningBankBookFilter, setListeningBankBookFilter] = useState<ListeningBankBookFilter>('all')
  const [selectedListeningFoundationSetId, setSelectedListeningFoundationSetId] = useState('')
  const [listeningFoundationQuestionIndex, setListeningFoundationQuestionIndex] = useState(0)
  const [listeningFoundationAudioPlayed, setListeningFoundationAudioPlayed] = useState(false)
  const [listeningFoundationAnswerState, setListeningFoundationAnswerState] = useState<Record<string, 'correct'>>({})
  const [adminReadingTitleInput, setAdminReadingTitleInput] = useState('')
  const [adminReadingCategoryInput, setAdminReadingCategoryInput] = useState<ReadingBankCategory>('normal')
  const [adminReadingSmartPasteInput, setAdminReadingSmartPasteInput] = useState('')
  const [adminReadingPassageInput, setAdminReadingPassageInput] = useState('')
  const [adminReadingAnswerKeyInput, setAdminReadingAnswerKeyInput] = useState('')
  const [adminReadingBulkJsonInput, setAdminReadingBulkJsonInput] = useState('')
  const [adminReadingTemplateCategory, setAdminReadingTemplateCategory] = useState<ReadingBankCategory>('normal')
  const [adminReadingBulkValidation, setAdminReadingBulkValidation] = useState<ReadingBulkValidationResult | null>(null)
  const [adminReadingGeneratorPassages, setAdminReadingGeneratorPassages] = useState<AdminReadingGeneratorPassageConfig[]>(
    INITIAL_ADMIN_READING_GENERATOR_PASSAGES
  )
  const [adminReadingGeneratorActiveIndex, setAdminReadingGeneratorActiveIndex] = useState(0)
  const [adminReadingGeneratorBrief, setAdminReadingGeneratorBrief] = useState('')
  const [adminReadingGeneratorDraftInput, setAdminReadingGeneratorDraftInput] = useState('')
  const [adminReadingGeneratorValidation, setAdminReadingGeneratorValidation] =
    useState<AdminReadingGeneratorValidationResult | null>(null)
  const [topics] = useState<SpeakingTopic[]>([...INITIAL_TOPICS, ...CAMBRIDGE_SPEAKING_PART2_TOPICS])
  const [enabledTopicIds, setEnabledTopicIds] = useState<string[]>(() =>
    [...INITIAL_TOPICS, ...CAMBRIDGE_SPEAKING_PART2_TOPICS].map((topic) => topic.id)
  )
  const [selectedTopicId, setSelectedTopicId] = useState<string>(INITIAL_TOPICS[0].id)
  const [selectedTestMode, setSelectedTestMode] = useState<SpeakingTestMode>('part1')
  const [speakingEntryMode, setSpeakingEntryMode] = useState<SpeakingEntryMode>(null)
  const [topicBankSearch, setTopicBankSearch] = useState('')
  const [topicBankView, setTopicBankView] = useState<'grid' | 'list'>('grid')
  const [topicBankFocusIndex, setTopicBankFocusIndex] = useState(0)
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
  const [isLoadingAdminTtsCatalog, setIsLoadingAdminTtsCatalog] = useState(false)
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

  const listeningSpeechRef = useRef<SpeechSynthesisUtterance | null>(null)
  const listeningSectionAudioRef = useRef<HTMLAudioElement | null>(null)
  const [listeningBuilderExamAudioPlayed, setListeningBuilderExamAudioPlayed] = useState(false)
  const [pendingStartTopicId, setPendingStartTopicId] = useState<string | null>(null)
  const [selectedExpectedScore, setSelectedExpectedScore] = useState<string>('')
  const [answerReviewModal, setAnswerReviewModal] = useState<AnswerReviewModalState | null>(null)
  const [scriptReviewModal, setScriptReviewModal] = useState<ScriptReviewModalState | null>(null)
  const isStudentNotebookLocked = authSession?.role === 'student'
  const isTrialRouteRequested = useMemo(() => {
    if (typeof window === 'undefined') return false
    const params = new URLSearchParams(window.location.search)
    const trialParam = String(params.get('trial') || '').trim().toLowerCase()
    const path = window.location.pathname.replace(/\/+$/, '').toLowerCase()
    return trialParam === '1' || trialParam === 'speaking' || path.endsWith('/trial')
  }, [])
  const isTrialUser = authSession?.role === 'trial'
  const canAccessListening = authSession?.role === 'admin' || authSession?.role === 'student'

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
  const readingAttemptsSyncTimeoutRef = useRef<number | null>(null)
  const readingAttemptsSyncedSignatureRef = useRef('')
  const readingPdoyProgressSyncTimeoutRef = useRef<number | null>(null)
  const readingPdoyProgressSyncedSignatureRef = useRef('')
  const notebookEntriesRef = useRef<NotebookEntry[]>([])
  const customSectionsRef = useRef<string[]>([])
  const readingHintMarkRef = useRef<HTMLElement | null>(null)
  const readingPassagePanelRef = useRef<HTMLElement | null>(null)
  const readingPassageBodyRef = useRef<HTMLDivElement | null>(null)
  const readingCoachParagraphRef = useRef<HTMLParagraphElement | null>(null)
  const readingPdoyStagePanelRef = useRef<HTMLDivElement | null>(null)
  const part2TimerDelayUntilRef = useRef<number | null>(null)
  const part2TimerDelayArmedRef = useRef(false)

  const setAuthStateFromPayload = (payload: AuthApiResponse) => {
    const nextSession = payload.session
    const currentEmail = normalizeEmail(authSession?.email || '')
    const nextEmail = normalizeEmail(nextSession?.email || '')
    const identityChanged =
      !authSession ||
      currentEmail !== nextEmail ||
      String(authSession.userId || '') !== String(nextSession.userId || '') ||
      authSession.role !== nextSession.role

    if (identityChanged) {
      resetStudentWorkspaceState(payload.creditProfile.name)
    }
    setAuthSession(nextSession)
    setCreditProfile(payload.creditProfile)
    if (nextSession.role === 'trial') {
      setSelectedTestMode('full')
      setSelectedTopicId(TRIAL_SPEAKING_TOPIC_ID)
      setActivePage('workspace')
      return
    }
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

  const buildReadingAttemptsSyncSignature = (attempts: Record<string, ReadingAttemptSummary>) =>
    JSON.stringify(attempts)

  const syncReadingAttemptsToSupabase = async (attempts: Record<string, ReadingAttemptSummary>) => {
    if (!authSession?.accessToken || authSession.role === 'admin' || !authSession.email || isNotebookHydrating || !notebookLoadedRef.current) {
      return false
    }

    const signature = buildReadingAttemptsSyncSignature(attempts)
    try {
      await fetchJson<ReadingAttemptsApiResponse>('/api/me/reading-attempts', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${authSession.accessToken}`
        },
        body: JSON.stringify({ attempts })
      })
      readingAttemptsSyncedSignatureRef.current = signature
      setNotebookSyncError('')
      return true
    } catch {
      setNotebookSyncError('Saved on this device, but Reading report account sync failed just now.')
      return false
    }
  }

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

  const loadAdminTtsCatalog = async (accessToken = authSession?.accessToken) => {
    if (!accessToken) return
    setIsLoadingAdminTtsCatalog(true)
    try {
      const payload = await fetchJson<{
        items: Array<{
          cacheKey?: string
          audioUrl?: string
        }>
      }>('/api/admin/tts/catalog', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      setTtsAudioUrls(
        Object.fromEntries(
          (payload.items || [])
            .filter((item) => item.cacheKey && item.audioUrl)
            .map((item) => [String(item.cacheKey), String(item.audioUrl)])
        )
      )
    } finally {
      setIsLoadingAdminTtsCatalog(false)
    }
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

  const loadAdminAssessmentReports = async (accessToken = authSession?.accessToken) => {
    if (!accessToken) return
    const payload = await fetchJson<{ reports: AdminAssessmentReportSummary[] }>('/api/admin/assessment-reports', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    setAdminAssessmentReports(Array.isArray(payload.reports) ? payload.reports : [])
  }

  const loadAdminReadingPdoyProgress = async (accessToken = authSession?.accessToken) => {
    if (!accessToken) return
    const payload = await fetchJson<{ reports: AdminReadingPdoyProgressSummary[] }>('/api/admin/reading-pdoy-progress', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    setAdminReadingPdoyProgress(Array.isArray(payload.reports) ? payload.reports : [])
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
  const activeAdminReadingGeneratorPassages = useMemo(
    () => adminReadingGeneratorPassages.filter((passage) => passage.sourcePassage.trim()),
    [adminReadingGeneratorPassages]
  )
  const activeAdminWorkspaceSection =
    ADMIN_WORKSPACE_SECTIONS.find((section) => section.id === adminWorkspaceSection) ?? ADMIN_WORKSPACE_SECTIONS[0]

  const updateAdminReadingGeneratorPassage = (
    id: string,
    patch: Partial<AdminReadingGeneratorPassageConfig>
  ) => {
    setAdminReadingGeneratorPassages((current) =>
      current.map((passage) => (passage.id === id ? { ...passage, ...patch } : passage))
    )
    setAdminReadingGeneratorBrief('')
    setAdminReadingGeneratorValidation(null)
  }

  const toggleAdminReadingGeneratorQuestionType = (
    passageId: string,
    type: AdminReadingGeneratorQuestionType
  ) => {
    setAdminReadingGeneratorPassages((current) =>
      current.map((passage) => {
        if (passage.id !== passageId) return passage
        const hasType = passage.questionTypes.includes(type)
        const nextTypes = hasType
          ? passage.questionTypes.filter((item) => item !== type)
          : [...passage.questionTypes, type]
        return {
          ...passage,
          questionTypes: nextTypes
        }
      })
    )
    setAdminReadingGeneratorBrief('')
    setAdminReadingGeneratorValidation(null)
  }

  const buildAdminReadingGeneratorBrief = () => {
    setAdminPanelMessage('')
    setAuthError('')
    setAdminReadingGeneratorValidation(null)

    const passages = activeAdminReadingGeneratorPassages
    if (passages.length === 0) {
      setAuthError('Paste at least one source passage into the generator studio first.')
      return
    }

    const typeRequirements = ADMIN_READING_GENERATOR_QUESTION_TYPES
      .map((type) => {
        const used = passages.some((passage) => passage.questionTypes.includes(type.id))
        if (!used) return ''
        return `${type.label}\n${ADMIN_READING_GENERATOR_DEFAULT_REQUIREMENTS[type.id]}`
      })
      .filter(Boolean)
      .join('\n\n')

    const passageBriefs = passages
      .map((passage, index) => {
        const selectedTypes = passage.questionTypes.map(getAdminReadingGeneratorTypeLabel).join(', ') || 'Admin will define later'
        return [
          `SOURCE PASSAGE ${index + 1}`,
          `Working title: ${passage.title.trim() || `Generated Reading Passage ${index + 1}`}`,
          `Bank category: ${READING_CATEGORY_LABELS[passage.category]}`,
          `New topic to generate: ${passage.newTopic.trim() || 'Choose a clearly different topic while preserving the original structure.'}`,
          `Target question count: ${passage.questionCount.trim() || 'Match the source passage pattern.'}`,
          `Question types needed: ${selectedTypes}`,
          passage.requirements.trim() ? `Extra admin requirements:\n${passage.requirements.trim()}` : '',
          'Original passage to imitate for length, difficulty, paragraph organization, and IELTS academic style:',
          passage.sourcePassage.trim()
        ].filter(Boolean).join('\n')
      })
      .join('\n\n---\n\n')

    const brief = [
      'You are helping create IELTS Academic Reading exams for an admin-only production workflow.',
      '',
      'Generate NEW passages. Imitate each original passage length, difficulty, paragraph organization, density, and IELTS academic tone, but change the topic completely.',
      'Do not copy names, facts, examples, topic, or sentence wording from the original passage unless a common word is unavoidable.',
      '',
      'Return ONLY valid JSON. No Markdown fences. The JSON must be an array of ReadingBulkUploadInput objects.',
      'Each object must have exactly these fields: title, category, rawPassageText, rawAnswerKey.',
      'category must be either "normal" or "advanced".',
      'Important JSON formatting rule: output JSON.stringify-safe strings only. Escape all internal quotation marks as \\" and represent line breaks as \\n. Do not put literal unescaped line breaks inside string values.',
      '',
      'rawPassageText format:',
      '- Include READING PASSAGE X.',
      '- Include the generated passage title.',
      '- Include paragraph letters A, B, C... when needed for matching heading or matching information.',
      '- Include the full original IELTS-style question section text exactly as the learner should see it.',
      '- Preserve the exact instruction wording for each question type you create.',
      '',
      'rawAnswerKey format for every question:',
      'Question N: full question prompt',
      'Correct Answer: answer',
      'Accepted Answers: answer variants if useful',
      'Answer Group: short group label',
      'Exact Portion: "exact passage evidence or NOT GIVEN anchor portion"',
      'Short Thai Explanation: concise Thai explanation',
      'Paraphrased Vocabulary: key paraphrase mapping',
      '',
      'Global validation rules:',
      '- Every answer must have one exact portion from the generated passage.',
      '- TRUE/FALSE/NOT GIVEN and YES/NO/NOT GIVEN must be balanced or very similar in count.',
      '- NOT GIVEN items must use an anchor portion containing exact words from the question, but the claim itself must remain unstated or irrelevant.',
      '- Fill in the blank answers must be ONE WORD ONLY and must be copied exactly from the passage.',
      '- Questions must be chronological unless the IELTS type normally asks paragraph scanning, such as matching information.',
      '- Each question should rely on only one passage portion.',
      '- Include plausible distractors for multiple choice and matching types.',
      '- Distractors must be tempting for scanners, not random; they should reuse keywords, exact names, or local wording while breaking meaning, degree, grammar, or relevance.',
      '',
      'Macro difficulty curve:',
      '- Passage 1 should be descriptive/concrete and highly factual. Use history, nature, technology, or concrete process topics. Chronological question types dominate: T/F/NG and fill in the blanks. It should rely heavily on exact scanning.',
      '- Passage 2 should be discursive/process-based, with systems, social patterns, research applications, or institutional topics. Language becomes more abstract. Prefer matching headings and matching information so learners must understand whole paragraphs.',
      '- Passage 3 should be argumentative/abstract and conceptually dense. Use Y/N/NG and multiple choice to test the writer’s claims, implications, and inferential logic rather than only printed facts.',
      '',
      'Question-type requirements:',
      typeRequirements || 'Admin will define exact requirements later. Use IELTS standard rules.',
      '',
      'Admin source passages and requested configuration:',
      passageBriefs
    ].join('\n')

    setAdminReadingGeneratorBrief(brief)
    setAdminPanelMessage(`Prepared a Codex generation brief for ${passages.length} passage${passages.length === 1 ? '' : 's'}.`)
  }

  const copyAdminReadingGeneratorBrief = async () => {
    if (!adminReadingGeneratorBrief.trim()) {
      setAuthError('Build the generation brief first.')
      return
    }
    try {
      await navigator.clipboard.writeText(adminReadingGeneratorBrief)
      setAdminPanelMessage('Copied the Codex reading generation brief.')
      setAuthError('')
    } catch {
      setAdminPanelMessage('')
      setAuthError('Could not copy the brief automatically. Please copy it manually from the box.')
    }
  }

  const validateAdminReadingGeneratorDraft = () => {
    setAdminPanelMessage('')
    setAuthError('')
    setAdminReadingGeneratorValidation(null)
    if (!adminReadingGeneratorDraftInput.trim()) {
      setAuthError('Paste the JSON that Codex generated before validating.')
      return
    }

    try {
      const validation = validateAdminGeneratedReadingDraft(adminReadingGeneratorDraftInput)
      setAdminReadingGeneratorValidation(validation)
      setAdminPanelMessage(
        validation.invalid === 0
          ? `Generator draft passed local checks: ${validation.valid}/${validation.total} ready.`
          : `Generator draft has ${validation.invalid} item${validation.invalid === 1 ? '' : 's'} to fix.`
      )
    } catch (error) {
      setAdminPanelMessage('')
      setAuthError(error instanceof Error ? error.message : 'Could not validate the generated reading draft.')
    }
  }

  const loadAdminReadingGeneratorDraftIntoBulkUpload = () => {
    if (!adminReadingGeneratorDraftInput.trim()) {
      setAuthError('Paste the generated JSON first.')
      return
    }

    try {
      const validation = validateAdminGeneratedReadingDraft(adminReadingGeneratorDraftInput)
      if (validation.invalid > 0) {
        setAdminReadingGeneratorValidation(validation)
        setAuthError('Fix the generated draft before loading it into bulk upload.')
        return
      }

      const parsed = JSON.parse(adminReadingGeneratorDraftInput)
      const exams = Array.isArray(parsed) ? parsed : parsed.exams
      setAdminReadingBulkJsonInput(JSON.stringify(exams, null, 2))
      setAdminReadingBulkValidation(null)
      setAdminReadingGeneratorValidation(validation)
      setAdminPanelMessage('Loaded the generated draft into Bulk JSON Import. Run server validation before upload.')
      setAuthError('')
    } catch (error) {
      setAdminPanelMessage('')
      setAuthError(error instanceof Error ? error.message : 'Could not load the generated draft.')
    }
  }

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
      setAdminReadingCategoryInput('normal')
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
    const scopedReadingAttemptsKey = makeScopedStorageKey(READING_ATTEMPTS_KEY, session.email)
    const scopedListeningAttemptsKey = makeScopedStorageKey(LISTENING_ATTEMPTS_KEY, session.email)
    const scopedReadingPdoyProgressKey = makeScopedStorageKey(READING_PDOY_PROGRESS_KEY, session.email)

    const localEntries = parseStoredNotebookEntries(localStorage.getItem(scopedEntriesKey))
    const localSections = parseStoredCustomSections(localStorage.getItem(scopedSectionsKey))
    const localScores = parseStoredScores(localStorage.getItem(scopedScoresKey))
    const localReadingAttempts = parseStoredReadingAttempts(localStorage.getItem(scopedReadingAttemptsKey))
    const localListeningAttempts = parseStoredListeningAttempts(localStorage.getItem(scopedListeningAttemptsKey))
    const localReadingPdoyProgress = parseStoredReadingPdoyProgress(localStorage.getItem(scopedReadingPdoyProgressKey))
    const applyReadingPdoyProgressSnapshot = (snapshot: ReadingPdoyProgressSnapshot | null) => {
      const normalizedSnapshot = snapshot ? normalizeReadingPdoySnapshotForStage(snapshot) : null
      setSelectedReadingPdoyLessonId(normalizedSnapshot?.lessonId || '')
      setReadingPdoySessionActive(Boolean(normalizedSnapshot?.sessionActive))
      setReadingPdoyStep(normalizedSnapshot?.step || 'intro')
      setReadingPdoyQuestionIndex(normalizedSnapshot?.questionIndex || 0)
      setReadingPdoyEvidenceInput(normalizedSnapshot?.evidenceInput || '')
      setReadingPdoyDecision(normalizedSnapshot?.decision || '')
      setReadingPdoySelectedOption(normalizedSnapshot?.selectedOption || '')
      setReadingPdoyOptionParaphraseInput(normalizedSnapshot?.optionParaphraseInput || '')
      setReadingPdoyFeedback(normalizedSnapshot?.feedback || '')
      setReadingPdoyIntroChoice(normalizedSnapshot?.introChoice || '')
      setReadingPdoyEvidenceAttempts(normalizedSnapshot?.evidenceAttempts || 0)
      setReadingPdoyDecisionAttempts(normalizedSnapshot?.decisionAttempts || 0)
      setReadingPdoyFillMeaningOptionId(normalizedSnapshot?.fillMeaningOptionId || '')
      setReadingWorkspaceMode('bank')
      readingPdoyProgressSyncedSignatureRef.current = normalizedSnapshot ? JSON.stringify(normalizedSnapshot) : ''
    }

    setLatestScoresByTest(localScores)
    setReadingAttemptHistory(localReadingAttempts)
    setListeningAttemptHistory(localListeningAttempts)
    applyReadingPdoyProgressSnapshot(localReadingPdoyProgress)
    const hydrateReadingAttemptsFromRemote = async () => {
      try {
        const payload = await fetchJson<ReadingAttemptsApiResponse>('/api/me/reading-attempts', {
          headers: {
            Authorization: `Bearer ${session.accessToken}`
          }
        })
        const remoteAttempts = parseStoredReadingAttempts(JSON.stringify(payload.attempts || {}))
        const mergedAttempts = mergeReadingAttemptHistories(remoteAttempts, localReadingAttempts)
        const remoteSignature = buildReadingAttemptsSyncSignature(remoteAttempts)
        const mergedSignature = buildReadingAttemptsSyncSignature(mergedAttempts)
        setReadingAttemptHistory(mergedAttempts)
        readingAttemptsSyncedSignatureRef.current = mergedSignature === remoteSignature ? mergedSignature : ''
      } catch {
        readingAttemptsSyncedSignatureRef.current = Object.keys(localReadingAttempts).length
          ? ''
          : buildReadingAttemptsSyncSignature(localReadingAttempts)
      }
    }
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
      try {
        const progressPayload = await fetchJson<{ progress: ReadingPdoyProgressSnapshot | null }>('/api/me/reading-pdoy-progress', {
          headers: {
            Authorization: `Bearer ${session.accessToken}`
          }
        })
        const remoteProgress = progressPayload?.progress || null
        if (remoteProgress) {
          applyReadingPdoyProgressSnapshot(remoteProgress)
        } else if (localReadingPdoyProgress) {
          readingPdoyProgressSyncedSignatureRef.current = ''
        }
      } catch {
        if (localReadingPdoyProgress) {
          readingPdoyProgressSyncedSignatureRef.current = ''
        }
      }
    } catch {
      setNotebookEntries(localEntries)
      setCustomSections(localSections)
      setNotebookSyncError('Notebook sync is temporarily unavailable. Using this device backup for now.')
      notebookSyncedSignatureRef.current = ''
    } finally {
      await hydrateReadingAttemptsFromRemote()
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
    setReadingAttemptHistory({})
    setListeningAttemptHistory({})
    setListeningFoundationAnswerState({})
    setListeningFoundationAudioPlayed(false)
    setListeningFoundationQuestionIndex(0)
    setListeningBuilderExamAnswerState({})
    setCreditProfile(defaultCreditProfile(name))
    setSelectedNotebookSection('speaking')
    setAssessmentResult(null)
    setAssessmentError('')
    setAssessmentRuntimeMessages([])
    setAssessmentProgress(0)
    setAssessmentProgressTarget(0)
    assessmentStartedAtRef.current = null
    setTranscript('')
    setInterimTranscript('')
    setTranscriptionError('')
    setAudioError('')
    setAudioUrl('')
    latestAudioBlobRef.current = null
    setRecordingDuration(0)
    setSelectedProvider('gemini')
    setAttemptStage('idle')
    setReportViewSnapshot(null)
    setAnswerReviewModal(null)
    setScriptReviewModal(null)
    pendingAssessmentRef.current = null
    setReadingWorkspaceMode('bank')
    setSelectedReadingPdoyLessonId('')
    setReadingPdoySessionActive(false)
    setReadingPdoyStep('intro')
    setReadingPdoyQuestionIndex(0)
    setReadingPdoyEvidenceInput('')
    setReadingPdoyDecision('')
    setReadingPdoySelectedOption('')
    setReadingPdoyOptionParaphraseInput('')
    setReadingPdoyFillMeaningOptionId('')
    setReadingPdoyFeedback('')
    setReadingPdoyIntroChoice('')
    setReadingPdoyEvidenceAttempts(0)
    setReadingPdoyDecisionAttempts(0)
    setCurrentQuestionIndex(0)
    setRemainingPrepSeconds(prepSeconds)
    setRemainingTalkSeconds(talkSeconds)
    setRemainingQuestionSeconds(75)
    setFullExamPhase('part1')
    setFullExamPart1Index(0)
    setFullExamPart3Index(0)
    setFullExamPhaseSeconds(75)
    setFullExamAnnouncement('')
    setPrepNotePart2('')
    setQuestionPrepNotes({})
    setIsPromptTtsPlaying(false)
    setIsExamPaused(false)
    questionResponsesRef.current = []
    questionStartCharIndexRef.current = 0
    clearQuestionCountdown()
    resetPart2TimerDelay()
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    stopPromptAudioPlayback()
    if (fullExamAnnouncementTimeoutRef.current) {
      window.clearTimeout(fullExamAnnouncementTimeoutRef.current)
      fullExamAnnouncementTimeoutRef.current = null
    }
    notebookLoadedRef.current = false
    notebookSyncedSignatureRef.current = ''
    readingAttemptsSyncedSignatureRef.current = ''
    readingPdoyProgressSyncedSignatureRef.current = ''
    if (notebookSyncTimeoutRef.current) {
      window.clearTimeout(notebookSyncTimeoutRef.current)
      notebookSyncTimeoutRef.current = null
    }
    if (readingAttemptsSyncTimeoutRef.current) {
      window.clearTimeout(readingAttemptsSyncTimeoutRef.current)
      readingAttemptsSyncTimeoutRef.current = null
    }
    if (readingPdoyProgressSyncTimeoutRef.current) {
      window.clearTimeout(readingPdoyProgressSyncTimeoutRef.current)
      readingPdoyProgressSyncTimeoutRef.current = null
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

  const exportReadingReportPdf = () => {
    if (!activeReadingExam || visibleReadingReportItems.length === 0) return

    const exportWindow = window.open('', '_blank', 'noopener,noreferrer,width=980,height=1280')
    if (!exportWindow) {
      setReadingExamError('Please allow pop-ups first so we can open the PDF export view.')
      return
    }

    const printedAt = new Date().toLocaleString()
    const scoreCount = readingReportItems.filter((item) => item.isCorrect).length
    const summaryCards = `
      <div class="summary-grid">
        <div class="summary-card">
          <span>Score</span>
          <strong>${scoreCount}/${readingReportItems.length}</strong>
          <em>overall result</em>
        </div>
        <div class="summary-card">
          <span>Accuracy</span>
          <strong>${readingAccuracy}%</strong>
          <em>correct answers</em>
        </div>
        <div class="summary-card">
          <span>Mode</span>
          <strong>${readingAttemptStage === 'review' ? 'Mistake Review' : 'Full Report'}</strong>
          <em>exported view</em>
        </div>
      </div>
    `

    const passageSections = readingReportByPassage
      .filter((group) => group.items.length > 0)
      .map((group) => {
        const questionItems = group.items
          .map(
            (item) => `
              <article class="question-card ${item.isCorrect ? 'correct' : 'wrong'}">
                <div class="question-top">
                  <div>
                    <p class="question-number">Question ${item.number}</p>
                    <h3>${escapeHtml(item.prompt)}</h3>
                  </div>
                  <span class="status ${item.isCorrect ? 'correct' : 'wrong'}">${item.isCorrect ? 'Correct' : 'Wrong'}</span>
                </div>
                <div class="answer-pair">
                  <div class="answer-box">
                    <span>Your answer</span>
                    <strong>${escapeHtml(item.userAnswer || 'No answer')}</strong>
                  </div>
                  <div class="answer-box">
                    <span>Correct answer</span>
                    <strong>${escapeHtml(item.correctAnswer)}</strong>
                  </div>
                </div>
                <div class="why-box">
                  <h4>คำอธิบายภาษาไทย</h4>
                  <p>${escapeHtml(item.explanationThai)}</p>
                  <blockquote>${escapeHtml(item.exactPortion)}</blockquote>
                  ${
                    item.paraphrasedVocabulary
                      ? `<p class="paraphrase"><strong>Paraphrased vocabulary:</strong> ${escapeHtml(item.paraphrasedVocabulary)}</p>`
                      : ''
                  }
                </div>
              </article>
            `
          )
          .join('')

        return `
          <section class="passage-section">
            <div class="passage-head">
              <p class="section-label">Passage ${group.passage.number}</p>
              <h2>${escapeHtml(group.passage.title)}</h2>
              <p>${group.correct}/${group.items.length} correct in this section</p>
            </div>
            ${questionItems}
          </section>
        `
      })
      .join('')

    exportWindow.document.write(`<!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>${escapeHtml(activeReadingExam.title)} Reading Report</title>
          <style>
            * { box-sizing: border-box; }
            :root {
              --ink: #0f172a;
              --muted: #475569;
              --line: #d6d3d1;
              --warm: #fffaf0;
              --paper: #fffdf8;
              --accent: #b45309;
              --blue: #1d4ed8;
              --correct: #14532d;
              --wrong: #9a3412;
            }
            @page {
              size: A4;
              margin: 16mm;
            }
            body {
              margin: 0;
              padding: 28px;
              font-family: "Georgia", "Times New Roman", serif;
              color: var(--ink);
              background:
                radial-gradient(circle at top right, rgba(251, 191, 36, 0.10), transparent 28%),
                linear-gradient(180deg, #fffefb 0%, #fffaf3 100%);
              line-height: 1.6;
            }
            .report-shell {
              max-width: 920px;
              margin: 0 auto;
            }
            .hero {
              position: relative;
              overflow: hidden;
              border: 1px solid var(--line);
              padding: 28px 30px 24px;
              margin-bottom: 24px;
              background:
                linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(255, 255, 255, 0.96) 34%, rgba(219, 234, 254, 0.70) 100%);
              box-shadow: 0 18px 38px rgba(15, 23, 42, 0.08);
            }
            .hero::before {
              content: "";
              position: absolute;
              inset: 0 auto 0 0;
              width: 10px;
              background: linear-gradient(180deg, #f59e0b 0%, #fb7185 50%, #60a5fa 100%);
            }
            .hero h1 {
              margin: 0 0 10px;
              padding-left: 4px;
              font-size: 31px;
              line-height: 1.16;
              letter-spacing: -0.02em;
            }
            .hero p {
              margin: 5px 0;
              color: var(--muted);
            }
            .eyebrow {
              margin: 0 0 12px;
              font-family: Arial, sans-serif;
              font-size: 12px;
              font-weight: 800;
              letter-spacing: 0.16em;
              text-transform: uppercase;
              color: var(--blue);
            }
            .hero-meta {
              display: grid;
              grid-template-columns: repeat(3, minmax(0, 1fr));
              gap: 10px;
              margin-top: 18px;
            }
            .hero-meta-card {
              border-top: 1px solid rgba(15, 23, 42, 0.16);
              padding-top: 10px;
            }
            .hero-meta-card span {
              display: block;
              margin-bottom: 4px;
              font-family: Arial, sans-serif;
              font-size: 11px;
              font-weight: 700;
              letter-spacing: 0.10em;
              text-transform: uppercase;
              color: var(--muted);
            }
            .hero-meta-card strong {
              font-family: Arial, sans-serif;
              font-size: 14px;
              color: var(--ink);
            }
            .summary-grid {
              display: grid;
              grid-template-columns: repeat(3, minmax(0, 1fr));
              gap: 14px;
              margin: 0 0 28px;
            }
            .summary-card {
              border: 1px solid var(--line);
              padding: 18px 18px 16px;
              background: rgba(255, 255, 255, 0.88);
              box-shadow: 0 10px 22px rgba(15, 23, 42, 0.05);
            }
            .summary-card span {
              display: block;
              font-family: Arial, sans-serif;
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 0.12em;
              color: var(--muted);
              margin-bottom: 8px;
            }
            .summary-card strong {
              display: block;
              font-size: 26px;
              line-height: 1.1;
              margin-bottom: 6px;
            }
            .summary-card em {
              font-style: normal;
              color: var(--muted);
              font-size: 0.92rem;
            }
            .passage-section {
              margin-bottom: 34px;
            }
            .passage-head {
              margin-bottom: 16px;
              padding-bottom: 10px;
              border-bottom: 1px solid var(--line);
            }
            .section-label {
              margin: 0 0 4px;
              font-family: Arial, sans-serif;
              font-size: 11px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.14em;
              color: var(--blue);
            }
            .passage-head h2 {
              margin: 0 0 6px;
              font-size: 25px;
              line-height: 1.2;
            }
            .passage-head p {
              margin: 0;
              color: var(--muted);
            }
            .question-card {
              border: 1px solid var(--line);
              border-radius: 16px;
              padding: 18px 18px 16px;
              margin-bottom: 16px;
              background: rgba(255,255,255,0.94);
              box-shadow: 0 12px 24px rgba(15, 23, 42, 0.05);
              page-break-inside: avoid;
            }
            .question-card.correct {
              background:
                linear-gradient(180deg, rgba(240, 253, 244, 0.94) 0%, rgba(255,255,255,0.98) 100%);
            }
            .question-card.wrong {
              background:
                linear-gradient(180deg, rgba(255, 247, 237, 0.96) 0%, rgba(255,255,255,0.98) 100%);
            }
            .question-top {
              display: flex;
              justify-content: space-between;
              gap: 12px;
              align-items: flex-start;
            }
            .question-number {
              margin: 0 0 6px;
              font-family: Arial, sans-serif;
              font-size: 11px;
              font-weight: 800;
              color: var(--blue);
              text-transform: uppercase;
              letter-spacing: 0.12em;
            }
            .question-top h3 {
              margin: 0 0 8px;
              font-size: 19px;
              line-height: 1.38;
            }
            .status {
              border: 1px solid rgba(15, 23, 42, 0.18);
              border-radius: 999px;
              padding: 7px 11px;
              font-family: Arial, sans-serif;
              font-size: 11px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.08em;
              white-space: nowrap;
            }
            .status.correct {
              background: rgba(187, 247, 208, 0.9);
              color: var(--correct);
            }
            .status.wrong {
              background: rgba(254, 215, 170, 0.92);
              color: var(--wrong);
            }
            .answer-pair {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
              margin: 12px 0 0;
            }
            .answer-box {
              border: 1px solid var(--line);
              border-radius: 14px;
              padding: 12px 12px 10px;
              background: rgba(255,255,255,0.8);
            }
            .answer-box span {
              display: block;
              margin-bottom: 6px;
              font-family: Arial, sans-serif;
              font-size: 11px;
              font-weight: 800;
              letter-spacing: 0.08em;
              text-transform: uppercase;
              color: var(--muted);
            }
            .why-box {
              border: 1px solid var(--line);
              border-radius: 16px;
              background: rgba(255,255,255,0.84);
              padding: 14px 15px;
              margin-top: 14px;
            }
            .why-box h4 {
              margin: 0 0 8px;
              font-size: 16px;
            }
            blockquote {
              margin: 12px 0 0;
              padding: 0 0 0 14px;
              border-left: 3px solid #f59e0b;
              color: #334155;
              font-style: italic;
            }
            .paraphrase {
              margin-top: 12px;
              color: #1e3a8a;
              padding-top: 10px;
              border-top: 1px dashed rgba(30, 58, 138, 0.22);
            }
            .footer-note {
              margin-top: 28px;
              padding-top: 12px;
              border-top: 1px solid var(--line);
              color: var(--muted);
              font-size: 12px;
              text-align: right;
            }
            @media print {
              body {
                padding: 0;
                background: #fff;
              }
              .hero,
              .summary-card,
              .question-card,
              .why-box,
              .answer-box {
                box-shadow: none !important;
              }
            }
            @media (max-width: 900px) {
              body {
                padding: 20px;
              }
              .summary-grid,
              .hero-meta,
              .answer-pair {
                grid-template-columns: 1fr;
              }
              .question-top {
                flex-direction: column;
              }
            }
          </style>
        </head>
        <body>
          <div class="report-shell">
            <section class="hero">
              <p class="eyebrow">English Plan Reading Report</p>
              <h1>${escapeHtml(activeReadingExam.title)}${readingAttemptStage === 'review' ? ' - Mistake Review' : ' - Reading Report'}</h1>
              <p>A premium export of your latest reading performance with Thai explanations, evidence, and answer review.</p>
              <div class="hero-meta">
                <div class="hero-meta-card">
                  <span>Category</span>
                  <strong>${escapeHtml(READING_CATEGORY_LABELS[activeReadingExam.category])}</strong>
                </div>
                <div class="hero-meta-card">
                  <span>Generated</span>
                  <strong>${escapeHtml(printedAt)}</strong>
                </div>
                <div class="hero-meta-card">
                  <span>Included</span>
                  <strong>Answers, Thai explanations, evidence</strong>
                </div>
              </div>
            </section>
            ${summaryCards}
            ${passageSections}
            <p class="footer-note">Generated by English Plan Learning Space</p>
          </div>
          <script>
            window.onload = () => {
              window.print();
            };
          </script>
        </body>
      </html>`)
    exportWindow.document.close()
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
      [...PART1_TOPICS, ...CAMBRIDGE_12_SPEAKING_PART1_TOPICS, ...CAMBRIDGE_13_SPEAKING_PART1_TOPICS].map((topic) => ({
        topicId: topic.id,
        topicTitle: topic.title,
        questions: [topic.prompt, ...topic.cues]
      })),
    []
  )
  const adminPart3QuestionBank = useMemo(
    () =>
      [...PART3_TOPICS, ...CAMBRIDGE_12_SPEAKING_PART3_TOPICS, ...CAMBRIDGE_13_SPEAKING_PART3_TOPICS].map((topic) => ({
        topicId: topic.id,
        topicTitle: topic.title,
        questions: [topic.prompt, ...topic.cues]
      })),
    []
  )
  const speakingQuestionAudioCatalog = useMemo<QuestionAudioCatalogItem[]>(
    () => [
      ...adminPart1QuestionBank.flatMap((topic) =>
        topic.questions.map((question, index) => ({
          key: `part1-${topic.topicId}-${index}`,
          cacheKey: `part1-${topic.topicId}-${index}`,
          section: 'Part 1' as const,
          topicId: topic.topicId,
          topicTitle: topic.topicTitle,
          question,
          audioUrl: ''
        }))
      ),
      ...adminPart3QuestionBank.flatMap((topic) =>
        topic.questions.map((question, index) => ({
          key: `part3-${topic.topicId}-${index}`,
          cacheKey: `part3-${topic.topicId}-${index}`,
          section: 'Part 3' as const,
          topicId: topic.topicId,
          topicTitle: topic.topicTitle,
          question,
          audioUrl: ''
        }))
      )
    ],
    [adminPart1QuestionBank, adminPart3QuestionBank]
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
  const adminSpeakingCostLast7Days = useMemo(
    () => buildAdminCostSeries(adminAssessmentReports, 7),
    [adminAssessmentReports]
  )
  const adminSpeakingCostLast30Days = useMemo(
    () => buildAdminCostSeries(adminAssessmentReports, 30),
    [adminAssessmentReports]
  )
  const adminSpeakingWeeklyCostTotal = useMemo(
    () => adminSpeakingCostLast7Days.reduce((sum, item) => sum + item.cost, 0),
    [adminSpeakingCostLast7Days]
  )
  const adminSpeakingMonthlyCostTotal = useMemo(
    () => adminSpeakingCostLast30Days.reduce((sum, item) => sum + item.cost, 0),
    [adminSpeakingCostLast30Days]
  )
  const adminSpeakingWeeklyTokenTotal = useMemo(
    () => adminSpeakingCostLast7Days.reduce((sum, item) => sum + item.tokens, 0),
    [adminSpeakingCostLast7Days]
  )
  const adminSpeakingMonthlyTokenTotal = useMemo(
    () => adminSpeakingCostLast30Days.reduce((sum, item) => sum + item.tokens, 0),
    [adminSpeakingCostLast30Days]
  )
  const adminSpeakingWeeklyReportsTotal = useMemo(
    () => adminSpeakingCostLast7Days.reduce((sum, item) => sum + item.reports, 0),
    [adminSpeakingCostLast7Days]
  )
  const adminSpeakingMonthlyReportsTotal = useMemo(
    () => adminSpeakingCostLast30Days.reduce((sum, item) => sum + item.reports, 0),
    [adminSpeakingCostLast30Days]
  )
  const adminSpeakingWeeklyCostPath = useMemo(
    () => buildAdminCostLinePath(adminSpeakingCostLast7Days.map((item) => item.cost)),
    [adminSpeakingCostLast7Days]
  )
  const adminSpeakingMonthlyCostPath = useMemo(
    () => buildAdminCostLinePath(adminSpeakingCostLast30Days.map((item) => item.cost)),
    [adminSpeakingCostLast30Days]
  )
  const activeSupportReportCount = useMemo(
    () => adminSupportReports.filter((report) => ['open', 'in_progress'].includes(report.status)).length,
    [adminSupportReports]
  )
  const adminTtsQuestionLibrary = useMemo(
    () =>
      speakingQuestionAudioCatalog.map((item) => ({
        ...item,
        audioUrl: ttsAudioUrls[item.key] || ''
      })),
    [speakingQuestionAudioCatalog, ttsAudioUrls]
  )
  const speakingQuestionAudioByQuestion = useMemo(() => {
    const map = new Map<string, QuestionAudioCatalogItem>()
    speakingQuestionAudioCatalog.forEach((item) => {
      map.set(normalizeReadingAnswer(item.question), item)
    })
    return map
  }, [speakingQuestionAudioCatalog])
  const adminPart1TtsTopics = useMemo(
    () =>
      adminPart1QuestionBank.map((topic) => {
        const items = adminTtsQuestionLibrary.filter((item) => item.section === 'Part 1' && item.topicId === topic.topicId)
        const readyCount = items.filter((item) => item.audioUrl).length
        return {
          ...topic,
          items,
          readyCount,
          missingCount: items.length - readyCount
        }
      }),
    [adminPart1QuestionBank, adminTtsQuestionLibrary]
  )
  const filteredAdminPart1TtsTopics = useMemo(() => {
    const query = adminTtsSearchInput.trim().toLowerCase()
    if (!query) return adminPart1TtsTopics
    return adminPart1TtsTopics.filter(
      (topic) =>
        topic.topicTitle.toLowerCase().includes(query) ||
        topic.items.some((item) => item.question.toLowerCase().includes(query))
    )
  }, [adminPart1TtsTopics, adminTtsSearchInput])
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
  const bankReadingExams = useMemo(
    () =>
      readingExams.filter(
        (exam) => !isReadingPdoyExercise(exam.id) && isCambridgeBookReadingExam(exam)
      ),
    [readingExams]
  )
  const pdoyReadingExams = useMemo(
    () => readingExams.filter((exam) => isReadingPdoyExercise(exam.id)),
    [readingExams]
  )
  const filteredReadingExams = useMemo(
    () => bankReadingExams.filter((exam) => exam.category === selectedReadingCategory),
    [bankReadingExams, selectedReadingCategory]
  )
  const readingAttemptByExamId = useMemo(() => readingAttemptHistory, [readingAttemptHistory])
  const readingExamCountsByCategory = useMemo(
    () =>
      (Object.keys(READING_CATEGORY_LABELS) as ReadingBankCategory[]).map((category) => ({
        category,
        label: READING_CATEGORY_LABELS[category],
        count: bankReadingExams.filter((exam) => exam.category === category).length,
        exams: bankReadingExams.filter((exam) => exam.category === category).slice(0, 6)
      })),
    [bankReadingExams]
  )
  const normalReadingStages = useMemo<NormalReadingStage[]>(() => {
    const normalExams = sortNormalReadingExamsForStages(
      bankReadingExams.filter((exam) => exam.category === 'normal')
    )
    const stageCount = Math.ceil(normalExams.length / NORMAL_READING_STAGE_SIZE)
    let nextStageUnlocked = true
    return Array.from({ length: stageCount }, (_, index) => {
      const exams = normalExams.slice(
        index * NORMAL_READING_STAGE_SIZE,
        (index + 1) * NORMAL_READING_STAGE_SIZE
      )
      const bestAccuracy = exams.reduce(
        (best, exam) => Math.max(best, readingAttemptByExamId[exam.id]?.accuracy || 0),
        0
      )
      const stage: NormalReadingStage = {
        number: index + 1,
        title: `ด่าน ${index + 1}`,
        exams,
        isUnlocked: nextStageUnlocked,
        bestAccuracy
      }
      nextStageUnlocked = nextStageUnlocked && bestAccuracy >= NORMAL_READING_UNLOCK_PERCENT
      return stage
    })
  }, [bankReadingExams, readingAttemptByExamId])
  const advancedReadingStages = useMemo<NormalReadingStage[]>(() => {
    const advancedExams = sortAdvancedReadingExamsForStages(
      bankReadingExams.filter((exam) => exam.category === 'advanced')
    )
    const stageCount = Math.ceil(advancedExams.length / ADVANCED_READING_STAGE_SIZE)
    let nextStageUnlocked = true
    return Array.from({ length: stageCount }, (_, index) => {
      const exams = advancedExams.slice(
        index * ADVANCED_READING_STAGE_SIZE,
        (index + 1) * ADVANCED_READING_STAGE_SIZE
      )
      const bestAccuracy = exams.reduce(
        (best, exam) => Math.max(best, readingAttemptByExamId[exam.id]?.accuracy || 0),
        0
      )
      const stage: NormalReadingStage = {
        number: index + 1,
        title: `ด่าน ${index + 1}`,
        exams,
        isUnlocked: nextStageUnlocked,
        bestAccuracy
      }
      nextStageUnlocked = nextStageUnlocked && bestAccuracy >= ADVANCED_READING_UNLOCK_PERCENT
      return stage
    })
  }, [bankReadingExams, readingAttemptByExamId])
  const selectedReadingEntryChoice =
    READING_ENTRY_CHOICES.find((choice) => choice.category === readingEntryCategory) || null
  const adminFirstReadingCategoryWithContent = useMemo(
    () => readingExamCountsByCategory.find((group) => group.count > 0)?.category || null,
    [readingExamCountsByCategory]
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
  const readingPdoyLessons = useMemo<ReadingPdoyLesson[]>(() => {
    const lessons: ReadingPdoyLesson[] = []
    pdoyReadingExams.forEach((exam) => {
      ;(exam.parsedPayload?.passages || []).forEach((passage) => {
        ;(['fill-in-the-blank', 'true-false-not-given', 'yes-no-not-given', 'multiple-choice'] as ReadingPdoyLessonType[]).forEach((lessonType) => {
          const questions = (passage.questions || []).filter((question) =>
            lessonType === 'multiple-choice'
              ? (question.answerType === 'multiple-choice' && !(question.answerGroup && (question.acceptedAnswers?.length || 0) > 1)) ||
                isReadingMatchingQuestion(passage, question)
              : lessonType === 'fill-in-the-blank'
                ? question.answerType === 'text' &&
                  (!question.answerGroup) &&
                  (exam.id !== 'builtin-reading-pdoy-huarango' || (question.number >= 1 && question.number <= 5))
                : question.answerType === lessonType
          )
          if (!questions.length) return
          lessons.push({
            id: `${exam.id}-${passage.number}-${lessonType}`,
            examId: exam.id,
            examTitle: exam.title,
            category: exam.category,
            passageNumber: passage.number,
            passageTitle: passage.title,
            lessonType,
            questions
          })
        })
      })
    })
    return lessons
  }, [pdoyReadingExams])
  const activeReadingPdoyLesson =
    readingPdoyLessons.find((lesson) => lesson.id === selectedReadingPdoyLessonId) ??
    readingPdoyLessons[0] ??
    null
  const activeReadingPdoyExam =
    pdoyReadingExams.find((exam) => exam.id === activeReadingPdoyLesson?.examId) ?? null
  const activeReadingPdoyPassage =
    activeReadingPdoyExam?.parsedPayload?.passages.find((passage) => passage.number === activeReadingPdoyLesson?.passageNumber) ??
    null
  const activeReadingPdoyQuestion =
    activeReadingPdoyLesson?.questions[readingPdoyQuestionIndex] ?? null
  const activeReadingPdoyClue = activeReadingPdoyQuestion ? pickReadingPdoyQuestionClue(activeReadingPdoyQuestion) : null
  const activeReadingPdoyVocabSupport = activeReadingPdoyQuestion
    ? buildReadingVocabSupport(activeReadingPdoyQuestion, activeReadingPdoyClue)
    : null
  const activeReadingPdoyIsMatchingQuestion = useMemo(
    () => isReadingMatchingQuestion(activeReadingPdoyPassage, activeReadingPdoyQuestion),
    [activeReadingPdoyPassage, activeReadingPdoyQuestion]
  )
  const activeReadingPdoyFocusParagraphIndex =
    activeReadingPdoyPassage && activeReadingPdoyQuestion
      ? (
          activeReadingPdoyLesson?.lessonType === 'fill-in-the-blank' &&
          readingPdoyEvidenceInput &&
          buildReadingFillPortionOptions(activeReadingPdoyPassage, activeReadingPdoyQuestion).find(
            (option) => option.id === readingPdoyEvidenceInput
          )?.text
            ? findReadingEvidenceParagraphIndex(
                activeReadingPdoyPassage,
                buildReadingFillPortionOptions(activeReadingPdoyPassage, activeReadingPdoyQuestion).find(
                  (option) => option.id === readingPdoyEvidenceInput
                )?.text || ''
              )
            : findReadingEvidenceParagraphIndex(activeReadingPdoyPassage, activeReadingPdoyQuestion.exactPortion)
        )
      : -1
  const activeReadingPdoyGuideCopy = useMemo(() => {
    if (!activeReadingPdoyQuestion) {
      return {
        badge: "P'Doy guide",
        title: 'มองหาจุดโฟกัสทีละจุด',
        detail: 'เดี๋ยวพี่จะพาไล่สายตาไปทีละส่วนของ passage เองครับ'
      }
    }

    if (readingPdoyStep === 'intro') {
      return {
        badge: 'Step 1',
        title: 'เริ่มจากจุดที่พี่ซูมให้ก่อน',
        detail:
          activeReadingPdoyLesson?.lessonType === 'multiple-choice'
            ? 'มองกล่อง evidence นี้ก่อน แล้วค่อยกลับไปเทียบกับตัวเลือกทีหลัง'
            : activeReadingPdoyLesson?.lessonType === 'fill-in-the-blank'
              ? 'ข้อเติมคำเริ่มจากดู grammar cue ก่อนครับ ว่าตรงนี้น่าจะเป็น noun, adjective หรือชื่อสถานที่'
              : 'อ่าน statement แล้วจ้องตรง evidence box นี้ก่อน ว่ามีความหมายไหนที่ตรงหรือไม่ตรงกัน'
      }
    }

    if (readingPdoyStep === 'evidence') {
      return {
        badge: 'Step 2',
        title: 'ใช่ครับ มองตรงย่อหน้านี้เลย',
        detail:
          activeReadingPdoyLesson?.lessonType === 'fill-in-the-blank'
            ? `เลือก portion ที่น่าจะมีคำตอบก่อนครับ ยังไม่ต้องกลัวผิด เดี๋ยวค่อยไปพิสูจน์ด้วยคำพาราฟเรสในขั้นถัดไป`
            : `ลองจับคำที่พาราฟเรสกับ "${activeReadingPdoyClue?.clue || activeReadingPdoyQuestion.prompt}" ให้เจอก่อน`
      }
    }

    if (readingPdoyStep === 'decide') {
      return {
        badge: 'Step 3',
        title: 'ตอนนี้ใช้ evidence ตัดสินคำตอบ',
        detail:
          activeReadingPdoyIsMatchingQuestion
            ? 'ตอนนี้เลือก heading หรือ paragraph ที่ตรงกับ evidence จริง ไม่ใช่แค่ตัวที่มี keyword คล้ายกัน'
            : activeReadingPdoyLesson?.lessonType === 'multiple-choice'
            ? 'อย่าเดาจาก keyword อย่างเดียว ให้ดูว่า option ไหนอธิบายความคิดตรงกับ passage จริง'
            : activeReadingPdoyLesson?.lessonType === 'fill-in-the-blank'
              ? 'ตอนนี้ชี้ให้ได้ครับว่าใน portion ที่เลือกมา คำหรือวลีไหนพาราฟเรสกับ clue สำคัญในโจทย์'
              : 'ดูว่าความหมายตรงกัน ขัดกัน หรือ passage ไม่ได้บอกเรื่องนี้เลย'
      }
    }

    if (readingPdoyStep === 'result') {
      return {
        badge: 'Step 4',
        title: 'จำ logic ตรงนี้ไว้',
        detail: 'ย่อหน้านี้คือจุดเฉลยหลักของข้อนี้ เวลากลับมาทบทวนให้ดูเหตุผลจากตรงนี้ก่อน'
      }
    }

    return {
      badge: 'Complete',
      title: 'จบบทนี้แล้วครับ',
      detail: 'ถ้าจะเริ่มข้อถัดไป พี่จะพาเลื่อนไปยังจุดโฟกัสใหม่ให้เหมือนเดิม'
    }
  }, [activeReadingPdoyClue?.clue, activeReadingPdoyIsMatchingQuestion, activeReadingPdoyLesson?.lessonType, activeReadingPdoyQuestion, readingPdoyStep])
  const activeReadingPdoyOptions = useMemo(
    () => extractReadingMultipleChoiceOptions(activeReadingPdoyPassage, activeReadingPdoyQuestion),
    [activeReadingPdoyPassage, activeReadingPdoyQuestion]
  )
  const activeReadingPdoyEvidenceOptions = useMemo(
    () =>
      activeReadingPdoyLesson?.lessonType === 'fill-in-the-blank'
        ? buildReadingFillPortionOptions(activeReadingPdoyPassage, activeReadingPdoyQuestion)
        : buildReadingEvidenceOptions(activeReadingPdoyPassage, activeReadingPdoyQuestion),
    [activeReadingPdoyLesson?.lessonType, activeReadingPdoyPassage, activeReadingPdoyQuestion]
  )
  const activeReadingPdoyFillGrammarOptions = useMemo(
    () => buildReadingFillGrammarChoiceOptions(activeReadingPdoyQuestion),
    [activeReadingPdoyQuestion]
  )
  const activeReadingPdoySelectedEvidenceRecord =
    activeReadingPdoyEvidenceOptions.find((option) => option.id === readingPdoyEvidenceInput) ?? null
  const activeReadingPdoyFillWordTarget = useMemo(
    () => buildReadingFillWordTarget(activeReadingPdoyQuestion),
    [activeReadingPdoyQuestion]
  )
  const activeReadingPdoyFillWordMatchOptions = useMemo(
    () =>
      buildReadingFillWordMatchOptions(
        activeReadingPdoyQuestion,
        activeReadingPdoySelectedEvidenceRecord?.text || ''
      ),
    [activeReadingPdoyQuestion, activeReadingPdoySelectedEvidenceRecord?.text]
  )
  const activeReadingPdoySelectedFillWordMatchOption =
    activeReadingPdoyFillWordMatchOptions.find((option) => option.id === readingPdoySelectedOption) ?? null
  const activeReadingPdoyFillHotspots = useMemo(
    () =>
      activeReadingPdoyLesson?.lessonType === 'fill-in-the-blank'
        ? activeReadingPdoyEvidenceOptions.map((option) => ({
            ...option,
            paragraphIndex: findReadingEvidenceParagraphIndex(activeReadingPdoyPassage, option.text)
          }))
        : [],
    [activeReadingPdoyLesson?.lessonType, activeReadingPdoyEvidenceOptions, activeReadingPdoyPassage]
  )
  const activeReadingPdoyCoachFloatClass = useMemo(() => {
    const cycle = Number(activeReadingPdoyQuestion?.number || 0) % 3
    if (readingPdoyStep === 'intro') return cycle === 0 ? 'readingPdoyCoachCard-float-top' : 'readingPdoyCoachCard-float-mid'
    if (readingPdoyStep === 'evidence') return cycle === 1 ? 'readingPdoyCoachCard-float-low' : 'readingPdoyCoachCard-float-mid'
    if (readingPdoyStep === 'decide') return cycle === 2 ? 'readingPdoyCoachCard-float-top' : 'readingPdoyCoachCard-float-low'
    return 'readingPdoyCoachCard-float-mid'
  }, [activeReadingPdoyQuestion?.number, readingPdoyStep])
  const activeReadingPdoySelectedOptionRecord =
    activeReadingPdoyOptions.find((option) => option.letter === readingPdoySelectedOption) ?? null
  const activeReadingPdoyHintUnlocked =
    activeReadingPdoyLesson?.lessonType === 'fill-in-the-blank'
      ? readingPdoyDecisionAttempts > 0
      : readingPdoyEvidenceAttempts > 0 || readingPdoyDecisionAttempts > 0
  const activeReadingPdoyPrimaryAction = useMemo(() => {
    if (!activeReadingPdoyQuestion || readingPdoyStep === 'complete') return null
    if (readingPdoyStep === 'intro') {
      return {
        label: activeReadingPdoyLesson?.lessonType === 'fill-in-the-blank' ? 'เช็ก grammar cue' : 'เช็กขั้นตอนแรก',
        tone: 'primary' as const,
        disabled: !readingPdoyIntroChoice,
        onClick: () => submitReadingPdoyIntro()
      }
    }
    if (readingPdoyStep === 'evidence') {
      return {
        label: activeReadingPdoyLesson?.lessonType === 'fill-in-the-blank' ? 'เลือก portion นี้ต่อ' : 'เช็ก evidence',
        tone: 'primary' as const,
        disabled: !readingPdoyEvidenceInput.trim(),
        onClick: () => submitReadingPdoyEvidence()
      }
    }
    if (readingPdoyStep === 'decide') {
      if (activeReadingPdoyLesson?.lessonType === 'multiple-choice') {
        return {
          label: activeReadingPdoyIsMatchingQuestion ? 'เช็กคำตอบนี้' : 'เช็ก option นี้',
          tone: 'primary' as const,
          disabled:
            !activeReadingPdoyOptions.length ||
            !readingPdoySelectedOption ||
            (!activeReadingPdoyIsMatchingQuestion && !readingPdoyOptionParaphraseInput.trim()),
          onClick: () => submitReadingPdoyDecision()
        }
      }
      if (activeReadingPdoyLesson?.lessonType === 'fill-in-the-blank') {
        return {
          label: 'เช็กคำที่ match กัน',
          tone: 'primary' as const,
          disabled: !readingPdoySelectedOption,
          onClick: () => submitReadingPdoyDecision()
        }
      }
      return {
        label: 'ตอบข้อนี้',
        tone: 'primary' as const,
        disabled: !readingPdoyDecision,
        onClick: () => submitReadingPdoyDecision()
      }
    }
    if (readingPdoyStep === 'result') {
      return {
        label: readingPdoyQuestionIndex + 1 >= (activeReadingPdoyLesson?.questions.length || 0) ? 'จบบทเรียน' : 'ข้อต่อไป',
        tone: 'success' as const,
        disabled: false,
        onClick: () => goToNextReadingPdoyQuestion()
      }
    }
    return null
  }, [
    activeReadingPdoyQuestion,
    readingPdoyStep,
    readingPdoyIntroChoice,
    readingPdoyEvidenceInput,
    activeReadingPdoyLesson?.lessonType,
    activeReadingPdoyLesson?.questions.length,
    activeReadingPdoyOptions.length,
    activeReadingPdoyIsMatchingQuestion,
    readingPdoySelectedOption,
    readingPdoyOptionParaphraseInput,
    readingPdoyDecision,
    readingPdoyQuestionIndex
  ])
  const activeReadingHint =
    readingHintQuestionNumber === null
      ? null
      : activeReadingPassages
          .flatMap((passage) => passage.questions || [])
          .find((question) => question.number === readingHintQuestionNumber) ?? null
  const activeReadingHintNeedles = useMemo(() => {
    if (!activeReadingHint || !activeReadingPassage) return []
    const hintPassage = activeReadingPassages.find((passage) =>
      (passage.questions || []).some((question) => question.number === activeReadingHint.number)
    )
    if (!hintPassage || hintPassage.number !== activeReadingPassage.number) return []

    if (isReadingMatchingQuestion(hintPassage, activeReadingHint)) {
      return buildReadingMatchingHintNeedles(hintPassage, activeReadingHint)
    }

    const excerpt = getReadingQuestionHintExcerpt(hintPassage, activeReadingHint)
    const resolved = resolveReadingEvidenceNeedleInPassage(hintPassage, excerpt)
    if (resolved) return [resolved]
    return buildReadingHintNeedles(excerpt)
  }, [activeReadingHint, activeReadingPassage, activeReadingPassages])
  const activeReadingQuestions = activeReadingPassage?.questions || []
  const activeReadingMatchingGroups = useMemo(
    () => buildReadingMatchingGroups(activeReadingPassage, activeReadingQuestions),
    [activeReadingPassage, activeReadingQuestions]
  )
  const activeReadingMatchingGroupByQuestionNumber = useMemo(() => {
    const lookup = new Map<number, ReadingMatchingGroup>()
    activeReadingMatchingGroups.forEach((group) => {
      group.questions.forEach((question) => lookup.set(question.number, group))
    })
    return lookup
  }, [activeReadingMatchingGroups])
  const activeReadingFillQuestionGroups = useMemo(
    () => buildReadingFillQuestionGroups(activeReadingPassage, activeReadingQuestions),
    [activeReadingPassage, activeReadingQuestions]
  )
  const activeReadingFillGroupByQuestionNumber = useMemo(() => {
    const lookup = new Map<number, ReadingFillQuestionGroup>()
    activeReadingFillQuestionGroups.forEach((group) => {
      group.questions.forEach((question) => lookup.set(question.number, group))
    })
    return lookup
  }, [activeReadingFillQuestionGroups])
  const activeReadingAllQuestions = activeReadingPassages.flatMap((passage) => passage.questions || [])
  const visibleReadingReportItems =
    readingAttemptStage === 'review' ? readingReportItems.filter((item) => !item.isCorrect) : readingReportItems
  const answeredReadingCount = activeReadingAllQuestions.filter((question) =>
    String(readingAnswers[question.number] || '').trim()
  ).length
  const readingAccuracy = readingReportItems.length
    ? Math.round((readingReportItems.filter((item) => item.isCorrect).length / readingReportItems.length) * 100)
    : 0
  const unansweredReadingCount = readingReportItems.filter((item) => !String(item.userAnswer || '').trim()).length
  const readingReportByPassage = activeReadingPassages.map((passage) => {
    const items = visibleReadingReportItems.filter((item) =>
      passage.questions.some((question) => question.number === item.number)
    )
    return {
      passage,
      items,
      correct: items.filter((item) => item.isCorrect).length
    }
  })
  const readingPdoySupportedQuestionCount = useMemo(
    () => readingPdoyLessons.reduce((total, lesson) => total + lesson.questions.length, 0),
    [readingPdoyLessons]
  )
  const listeningAttemptByExerciseId = useMemo(() => listeningAttemptHistory, [listeningAttemptHistory])
  const activeListeningExercise =
    LISTENING_EXERCISES.find((exercise) => exercise.id === selectedListeningExerciseId) ??
    LISTENING_EXERCISES[0] ??
    null
  const listeningAnsweredCount = activeListeningExercise
    ? activeListeningExercise.questions.filter((question) => String(listeningAnswers[question.number] || '').trim()).length
    : 0
  const listeningAccuracy = listeningReportItems.length
    ? Math.round((listeningReportItems.filter((item) => item.isCorrect).length / listeningReportItems.length) * 100)
    : 0
  const listeningUnansweredCount = listeningReportItems.filter((item) => !String(item.userAnswer || '').trim()).length
  const visibleListeningFoundationSets = useMemo(
    () => ALL_LISTENING_FOUNDATION_SETS.filter((set) => set.category === listeningFoundationCategory),
    [listeningFoundationCategory]
  )
  const foundationBooksInCategory = useMemo(
    () => listFoundationBooks(visibleListeningFoundationSets),
    [visibleListeningFoundationSets]
  )
  const foundationSetsByBook = useMemo(
    () => groupFoundationSetsByBook(visibleListeningFoundationSets, listeningBankBookFilter),
    [visibleListeningFoundationSets, listeningBankBookFilter]
  )
  const activeListeningFoundationSet =
    ALL_LISTENING_FOUNDATION_SETS.find((set) => set.id === selectedListeningFoundationSetId) ??
    visibleListeningFoundationSets[0] ??
    ALL_LISTENING_FOUNDATION_SETS[0] ??
    null
  const activeListeningFoundationQuestion =
    activeListeningFoundationSet?.questions[listeningFoundationQuestionIndex] ??
    activeListeningFoundationSet?.questions[0] ??
    null
  const activeListeningFoundationScriptText = useMemo(() => {
    if (!activeListeningFoundationSet) return activeListeningFoundationQuestion?.passage || ''

    const uniquePassages = Array.from(
      new Set(
        activeListeningFoundationSet.questions
          .map((question) => question.passage.trim())
          .filter(Boolean)
      )
    )

    return uniquePassages.join(' ') || activeListeningFoundationQuestion?.passage || ''
  }, [activeListeningFoundationSet, activeListeningFoundationQuestion?.passage])
  const activeListeningFoundationScriptSegments = useMemo(
    () =>
      activeListeningFoundationScriptText
        ? parseListeningScriptSegments(activeListeningFoundationScriptText)
        : [],
    [activeListeningFoundationScriptText]
  )
  const listeningFoundationExamConfig = useMemo(
    () => (activeListeningFoundationSet ? foundationSetToExamConfig(activeListeningFoundationSet) : null),
    [activeListeningFoundationSet]
  )
  const listeningFoundationCategoryCompletedCount = useMemo(
    () =>
      visibleListeningFoundationSets.reduce(
        (total, set) =>
          total +
          set.questions.filter((question) => listeningFoundationAnswerState[question.id] === 'correct').length,
        0
      ),
    [visibleListeningFoundationSets, listeningFoundationAnswerState]
  )
  const listeningFoundationCategoryQuestionTotal = useMemo(
    () => visibleListeningFoundationSets.reduce((total, set) => total + set.questions.length, 0),
    [visibleListeningFoundationSets]
  )
  const listeningVocabularyBuilderItems = useMemo(
    () => parseListeningVocabularyWorkbook(listeningWorkbookRaw),
    []
  )
  const listeningSectionBankTests = useMemo(
    () => parseListeningSectionBank(listeningSectionBankRaw),
    []
  )
  const listeningVocabularyBuilderPacks = useMemo(() => {
    const grouped = listeningSectionBankTests.reduce<Record<string, ListeningVocabularyBuilderPack>>((acc, test) => {
      const packKey = `${test.bookNumber}-${test.sectionNumber}`
      const title = `Cambridge ${test.bookNumber} · Section ${test.sectionNumber}`
      if (!acc[packKey]) {
        acc[packKey] = {
          id: slugifyListeningBuilderPack(title),
          title,
          bookNumber: test.bookNumber,
          sectionNumber: test.sectionNumber,
          testNumbers: [],
          items: [],
          sectionTests: []
        }
      }

      acc[packKey].sectionTests.push(test)
      if (!acc[packKey].testNumbers.includes(test.testNumber)) {
        acc[packKey].testNumbers.push(test.testNumber)
      }
      return acc
    }, {})

    listeningVocabularyBuilderItems.forEach((item) => {
      const packKey = `${item.bookNumber ?? 'book'}-${item.sectionNumber ?? 'section'}`
      if (!grouped[packKey]) {
        const title =
          item.bookNumber && item.sectionNumber
            ? `Cambridge ${item.bookNumber} · Section ${item.sectionNumber}`
            : item.book
        grouped[packKey] = {
          id: slugifyListeningBuilderPack(title),
          title,
          bookNumber: item.bookNumber,
          sectionNumber: item.sectionNumber,
          testNumbers: [],
          items: [],
          sectionTests: []
        }
      }
      grouped[packKey].items.push(item)
      if (item.testNumber && !grouped[packKey].testNumbers.includes(item.testNumber)) {
        grouped[packKey].testNumbers.push(item.testNumber)
      }
    })

    return Object.values(grouped)
      .map((pack) => ({
        ...pack,
        testNumbers: [...pack.testNumbers].sort((a, b) => a - b),
        sectionTests: [...pack.sectionTests].sort((a, b) => a.testNumber - b.testNumber),
        items: [...pack.items].sort((a, b) => {
          const testDiff = (a.testNumber || 0) - (b.testNumber || 0)
          if (testDiff !== 0) return testDiff
          return a.questionNumber - b.questionNumber
        })
      }))
      .sort((a, b) => {
        const bookDiff = (a.bookNumber || 0) - (b.bookNumber || 0)
        if (bookDiff !== 0) return bookDiff
        return (a.sectionNumber || 0) - (b.sectionNumber || 0)
      })
  }, [listeningSectionBankTests, listeningVocabularyBuilderItems])
  const visibleListeningVocabularyBuilderPacks = useMemo(() => {
    const examPacks: ListeningVocabularyBuilderPack[] = LISTENING_BUILDER_EXAM_SETS.map((examSet) => ({
      id: examSet.id,
      title: examSet.title,
      bookNumber: examSet.bookNumber,
      sectionNumber: examSet.sectionNumber,
      testNumbers: examSet.tests.map((test) => test.testNumber),
      items: [],
      sectionTests: []
    }))
    const matchingParsedPacks = listeningVocabularyBuilderPacks.filter((pack) =>
      LISTENING_BUILDER_EXAM_SETS.some(
        (examSet) => examSet.bookNumber === pack.bookNumber && examSet.sectionNumber === pack.sectionNumber
      )
    )
    const parsedPackKeys = new Set(matchingParsedPacks.map((pack) => `${pack.bookNumber}-${pack.sectionNumber}`))
    return [
      ...examPacks.filter((pack) => !parsedPackKeys.has(`${pack.bookNumber}-${pack.sectionNumber}`)),
      ...matchingParsedPacks
    ].sort((a, b) => {
      const bookDiff = (a.bookNumber || 0) - (b.bookNumber || 0)
      if (bookDiff !== 0) return bookDiff
      return (a.sectionNumber || 0) - (b.sectionNumber || 0)
    })
  }, [listeningVocabularyBuilderPacks])
  const builderPackSummaries = useMemo(
    () =>
      visibleListeningVocabularyBuilderPacks.map((pack) => {
        const examSet = LISTENING_BUILDER_EXAM_SETS.find(
          (set) => set.bookNumber === pack.bookNumber && set.sectionNumber === pack.sectionNumber
        )
        const taskCount = examSet?.tests.reduce((total, test) => total + test.tasks.length, 0) ?? pack.items.length
        return { ...pack, taskCount }
      }),
    [visibleListeningVocabularyBuilderPacks]
  )
  const builderBooks = useMemo(() => listBuilderBooks(builderPackSummaries), [builderPackSummaries])
  const builderPacksByBook = useMemo(
    () => groupBuilderPacksByBook(builderPackSummaries, listeningBankBookFilter),
    [builderPackSummaries, listeningBankBookFilter]
  )
  const activeListeningBuilderPack =
    visibleListeningVocabularyBuilderPacks.find((pack) => pack.id === selectedListeningBuilderPackId) ??
    visibleListeningVocabularyBuilderPacks[0] ??
    null
  const activeListeningBuilderExamSet =
    LISTENING_BUILDER_EXAM_SETS.find(
      (examSet) =>
        examSet.bookNumber === activeListeningBuilderPack?.bookNumber &&
        examSet.sectionNumber === activeListeningBuilderPack?.sectionNumber
    ) ?? null
  const activeListeningBuilderExamTest =
    activeListeningBuilderExamSet?.tests.find((test) => test.id === selectedListeningBuilderExamTestId) ??
    activeListeningBuilderExamSet?.tests[0] ??
    null
  const listeningBuilderExamConfig = useMemo(() => {
    if (!activeListeningBuilderExamSet || !activeListeningBuilderExamTest) return null
    const questions = activeListeningBuilderExamTest.tasks.map((task) =>
      builderTaskToExamQuestion(task, activeListeningBuilderExamTest.tasks, activeListeningBuilderExamTest.id)
    )
    return {
      title: activeListeningBuilderExamTest.title,
      subtitle: `Cambridge ${activeListeningBuilderExamSet.bookNumber} · Section ${activeListeningBuilderExamSet.sectionNumber} · Test ${activeListeningBuilderExamTest.testNumber}`,
      sectionNumber: activeListeningBuilderExamSet.sectionNumber,
      audioUrl: `https://ieltstrainingonline.com/wp-content/uploads/2021/07/Cam${activeListeningBuilderExamSet.bookNumber}-Test${activeListeningBuilderExamTest.testNumber}-Section${activeListeningBuilderExamSet.sectionNumber}.mp3`,
      passage: activeListeningBuilderExamTest.scriptParagraphs.join('\n\n'),
      questions,
      groups: buildListeningSectionExamGroups(questions)
    }
  }, [activeListeningBuilderExamSet, activeListeningBuilderExamTest])

  const part2AvailableTopics = topics.filter((topic) => enabledTopicIds.includes(topic.id))
  const availableTopics = useMemo(() => {
    if (isTrialUser && selectedTestMode === 'full') return [TRIAL_SPEAKING_TOPIC]
    if (selectedTestMode === 'part1')
      return [...PART1_TOPICS, ...CAMBRIDGE_12_SPEAKING_PART1_TOPICS, ...CAMBRIDGE_13_SPEAKING_PART1_TOPICS]
    if (selectedTestMode === 'part3')
      return [...PART3_TOPICS, ...CAMBRIDGE_12_SPEAKING_PART3_TOPICS, ...CAMBRIDGE_13_SPEAKING_PART3_TOPICS]
    if (selectedTestMode === 'full')
      return [
        ...FULL_EXAM_TOPICS,
        ...CAMBRIDGE_12_SPEAKING_FULL_EXAM_TOPICS,
        ...CAMBRIDGE_13_SPEAKING_FULL_EXAM_TOPICS
      ]
    return part2AvailableTopics
  }, [isTrialUser, selectedTestMode, part2AvailableTopics])

  const speakingModeTopics = useMemo<Record<SpeakingTestMode, SpeakingTopic[]>>(
    () => ({
      part1: [...PART1_TOPICS, ...CAMBRIDGE_12_SPEAKING_PART1_TOPICS, ...CAMBRIDGE_13_SPEAKING_PART1_TOPICS],
      part2: part2AvailableTopics,
      part3: [...PART3_TOPICS, ...CAMBRIDGE_12_SPEAKING_PART3_TOPICS, ...CAMBRIDGE_13_SPEAKING_PART3_TOPICS],
      full: [
        ...FULL_EXAM_TOPICS,
        ...CAMBRIDGE_12_SPEAKING_FULL_EXAM_TOPICS,
        ...CAMBRIDGE_13_SPEAKING_FULL_EXAM_TOPICS
      ]
    }),
    [part2AvailableTopics]
  )

  const roundSpeakingAverageScore = (score: number) => Math.ceil(score * 2) / 2

  const getSpeakingAverageScore = (mode: SpeakingTestMode) => {
    const scores = speakingModeTopics[mode]
      .map((topic) => latestScoresByTest[`${mode}:${topic.id}`])
      .filter((score): score is number => typeof score === 'number' && Number.isFinite(score))
    if (!scores.length) return null
    return roundSpeakingAverageScore(scores.reduce((total, score) => total + score, 0) / scores.length)
  }

  const speakingAverageScores = useMemo(
    () => ({
      part1: getSpeakingAverageScore('part1'),
      part2: getSpeakingAverageScore('part2'),
      part3: getSpeakingAverageScore('part3'),
      full: getSpeakingAverageScore('full')
    }),
    [latestScoresByTest, speakingModeTopics]
  )

  const topicBankFilteredTopics = useMemo(() => {
    const q = topicBankSearch.trim().toLowerCase()
    if (!q) return availableTopics
    return availableTopics.filter((topic) => {
      const hay = [topic.title, topic.category, topic.prompt, ...(topic.cues || [])].join(' ').toLowerCase()
      return hay.includes(q)
    })
  }, [availableTopics, topicBankSearch])

  const topicBankGrouped = useMemo(() => {
    const map = new Map<string, SpeakingTopic[]>()
    for (const topic of topicBankFilteredTopics) {
      const cat = topic.category?.trim() || 'Topics'
      if (!map.has(cat)) map.set(cat, [])
      map.get(cat)!.push(topic)
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  }, [topicBankFilteredTopics])

  const topicBankFlatIds = useMemo(
    () => topicBankGrouped.flatMap(([, groupTopics]) => groupTopics.map((t) => t.id)),
    [topicBankGrouped]
  )

  const topicBankIdToFlatIndex = useMemo(() => {
    const m = new Map<string, number>()
    let i = 0
    for (const [, groupTopics] of topicBankGrouped) {
      for (const t of groupTopics) {
        m.set(t.id, i++)
      }
    }
    return m
  }, [topicBankGrouped])

  const activeTopic =
    availableTopics.find((topic) => topic.id === selectedTopicId) ?? availableTopics[0] ?? null
  const isFullExamMode = selectedTestMode === 'full'
  const isQuestionByQuestionMode = selectedTestMode === 'part1' || selectedTestMode === 'part3'
  const isTrialSpeakingFlow = isTrialUser && isFullExamMode && activeTopic?.id === TRIAL_SPEAKING_TOPIC_ID
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
    : isTrialSpeakingFlow
      ? {
          ...TRIAL_SPEAKING_TOPIC,
          cues: [
            ...TRIAL_SPEAKING_PART2_CUES,
            ...TRIAL_SPEAKING_PART3_QUESTIONS.map((question) => `Follow-up - ${question}`)
          ]
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
  const activeTranscriptStartIndex = useMemo(() => {
    const fullText = String(transcript || '').trim()
    const start = Math.max(0, questionStartCharIndexRef.current)
    if (fullText.length < start) return 0
    return start
  }, [transcript])
  const currentTranscriptEditableText = useMemo(() => {
    if (!transcript) return ''
    if (isFullExamMode || isQuestionByQuestionMode) {
      const fullText = String(transcript || '').trim()
      return fullText.slice(activeTranscriptStartIndex).trimStart()
    }
    return transcript
  }, [activeTranscriptStartIndex, isFullExamMode, isQuestionByQuestionMode, transcript])
  const currentTranscriptSegment = useMemo(() => {
    if (!transcript && !interimTranscript) return ''
    if (isFullExamMode || isQuestionByQuestionMode) {
      return `${currentTranscriptEditableText.trim()} ${interimTranscript.trim()}`.trim()
    }
    return `${transcript.trim()} ${interimTranscript.trim()}`.trim()
  }, [currentTranscriptEditableText, interimTranscript, isFullExamMode, isQuestionByQuestionMode, transcript])
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
    if (isTrialSpeakingFlow) {
      if (fullExamPhase === 'part2_prep') return 'Trial | เตรียมตัว 1 นาที | 60s'
      if (fullExamPhase === 'part2_speaking') return 'Trial | พูด 2 นาที | 120s'
      return `Trial | Follow-up ${fullExamPart3Index + 1}/${fullExamPlan.part3Questions.length} | 60s`
    }
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
    isTrialSpeakingFlow,
    fullExamPlan.part1Questions.length,
    fullExamPlan.part3Questions.length
  ])

  const fullExamTotalSeconds = useMemo(() => {
    if (!isFullExamMode) return 0
    if (isTrialSpeakingFlow) {
      return 60 + 120 + fullExamPlan.part3Questions.length * 60
    }
    const p1 = fullExamPlan.part1Questions.length * 75
    const p2Prep = 60
    const p2Speak = 120
    const rest = 30
    const p3 = fullExamPlan.part3Questions.length * 90
    return p1 + p2Prep + p2Speak + rest + p3
  }, [isFullExamMode, isTrialSpeakingFlow, fullExamPlan.part3Questions.length, fullExamPlan.part1Questions.length])

  const fullExamElapsedSeconds = useMemo(() => {
    if (!isFullExamMode) return 0
    if (isTrialSpeakingFlow) {
      if (fullExamPhase === 'part2_prep') return Math.max(0, 60 - fullExamPhaseSeconds)
      if (fullExamPhase === 'part2_speaking') return Math.max(0, 60 + (120 - fullExamPhaseSeconds))
      return Math.max(0, 60 + 120 + fullExamPart3Index * 60 + (60 - fullExamPhaseSeconds))
    }
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
  }, [isFullExamMode, isTrialSpeakingFlow, fullExamPhase, fullExamPart1Index, fullExamPart3Index, fullExamPhaseSeconds, fullExamPlan.part1Questions.length])

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
          await loadAdminAssessmentReports(payload.session.accessToken)
          await loadAdminReadingPdoyProgress(payload.session.accessToken)
          await loadAdminTtsCatalog(payload.session.accessToken)
        } else if (payload.session.role === 'student') {
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
    if (!authSession?.email || (authSession.role !== 'student' && authSession.role !== 'trial')) {
      resetStudentWorkspaceState()
      setManagedLearners([])
      setMySupportReports([])
      return
    }

    if (authSession.role === 'trial') {
      setManagedLearners([])
      setMySupportReports([])
      return
    }

    void loadNotebookForSession(authSession)
  }, [authSession?.accessToken, authSession?.email, authSession?.role])

  useEffect(() => {
    if (authSession?.role !== 'admin') {
      setAdminSupportReports([])
      setAdminAssessmentReports([])
      setAdminReadingPdoyProgress([])
      setTtsAudioUrls({})
      return
    }
    void loadManagedLearners()
    void loadAdminTtsCatalog()
  }, [authSession?.role, authSession?.accessToken])

  useEffect(() => {
    if (authSession?.role !== 'admin') return
    void loadAdminSupportReports()
  }, [authSession?.role, authSession?.accessToken])

  useEffect(() => {
    if (authSession?.role !== 'admin') return
    void loadAdminAssessmentReports(authSession.accessToken)
  }, [authSession?.role, authSession?.accessToken])

  useEffect(() => {
    if (authSession?.role !== 'admin') return
    void loadAdminReadingPdoyProgress(authSession.accessToken)
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
    if (!isStudentNotebookLocked) return
    if (['notebook', 'admin'].includes(activePage)) {
      setActivePage('home')
    }
  }, [activePage, isStudentNotebookLocked])

  useEffect(() => {
    if (!authSession?.accessToken) {
      setReadingExams([])
      return
    }
    void loadReadingExams(authSession.accessToken)
  }, [authSession?.accessToken])

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
    if (!readingPdoyLessons.length) {
      setSelectedReadingPdoyLessonId('')
      return
    }
    if (!readingPdoyLessons.some((lesson) => lesson.id === selectedReadingPdoyLessonId)) {
      setSelectedReadingPdoyLessonId(readingPdoyLessons[0].id)
    }
  }, [readingPdoyLessons, selectedReadingPdoyLessonId])

  useEffect(() => {
    if (!activeReadingPdoyLesson) return
    if (readingPdoyQuestionIndex < activeReadingPdoyLesson.questions.length) return
    setReadingPdoyQuestionIndex(Math.max(0, activeReadingPdoyLesson.questions.length - 1))
  }, [activeReadingPdoyLesson, readingPdoyQuestionIndex])

  useEffect(() => {
    if (authSession?.role !== 'admin') return
    if (!readingExams.length) return
    if (filteredReadingExams.length > 0) return
    if (!adminFirstReadingCategoryWithContent) return
    if (readingEntryCategory) {
      setReadingEntryCategory(adminFirstReadingCategoryWithContent)
    }
    setSelectedReadingCategory(adminFirstReadingCategoryWithContent)
  }, [
    authSession?.role,
    readingExams.length,
    filteredReadingExams.length,
    readingEntryCategory,
    adminFirstReadingCategoryWithContent
  ])

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
    readingHintMarkRef.current = null
  }, [readingHintQuestionNumber, readingActivePassageNumber])

  useEffect(() => {
    if (readingHintQuestionNumber === null) return
    const timeout = window.setTimeout(() => {
      readingHintMarkRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      })
    }, 80)
    return () => window.clearTimeout(timeout)
  }, [readingHintQuestionNumber, readingActivePassageNumber, activeReadingPassage?.bodyParagraphs])

  useEffect(() => {
    if (!activeReadingPdoyLesson || !activeReadingPdoyQuestion || !activeReadingPdoyPassage) return
    setReadingActivePassageNumber(activeReadingPdoyLesson.passageNumber)
  }, [activeReadingPdoyLesson, activeReadingPdoyQuestion, activeReadingPdoyPassage])

  useEffect(() => {
    if (readingWorkspaceMode !== 'pdoy') return
    if (!activeReadingPdoyQuestion) return
    const timeout = window.setTimeout(() => {
      ;(readingCoachParagraphRef.current || readingPassageBodyRef.current)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      })
    }, 100)
    return () => window.clearTimeout(timeout)
  }, [readingWorkspaceMode, activeReadingPdoyQuestion?.number, readingPdoyStep])

  useEffect(() => {
    if (readingWorkspaceMode !== 'pdoy') return
    if (!activeReadingPdoyQuestion) return
    if (!['evidence', 'decide', 'result'].includes(readingPdoyStep)) return
    const timeout = window.setTimeout(() => {
      readingCoachParagraphRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      })
    }, 180)
    return () => window.clearTimeout(timeout)
  }, [readingWorkspaceMode, activeReadingPdoyQuestion?.number, readingPdoyStep, activeReadingPdoyFocusParagraphIndex])

  useEffect(() => {
    if (readingWorkspaceMode !== 'pdoy') return
    if (!['decide', 'result', 'complete'].includes(readingPdoyStep)) return
    const timeout = window.setTimeout(() => {
      readingPdoyStagePanelRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      })
    }, 140)
    return () => window.clearTimeout(timeout)
    }, [readingWorkspaceMode, readingPdoyStep, activeReadingPdoyQuestion?.number])

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
    if (!authSession?.email) return
    localStorage.setItem(makeScopedStorageKey(READING_ATTEMPTS_KEY, authSession.email), JSON.stringify(readingAttemptHistory))
  }, [authSession, readingAttemptHistory])

  useEffect(() => {
    if (!authSession?.accessToken || !authSession.email || authSession.role === 'admin' || isNotebookHydrating || !notebookLoadedRef.current) return
    const nextSignature = buildReadingAttemptsSyncSignature(readingAttemptHistory)
    if (nextSignature === readingAttemptsSyncedSignatureRef.current) return
    if (readingAttemptsSyncTimeoutRef.current) {
      window.clearTimeout(readingAttemptsSyncTimeoutRef.current)
    }

    readingAttemptsSyncTimeoutRef.current = window.setTimeout(() => {
      void syncReadingAttemptsToSupabase(readingAttemptHistory)
    }, 500)

    return () => {
      if (readingAttemptsSyncTimeoutRef.current) {
        window.clearTimeout(readingAttemptsSyncTimeoutRef.current)
        readingAttemptsSyncTimeoutRef.current = null
      }
    }
  }, [authSession?.accessToken, authSession?.email, authSession?.role, readingAttemptHistory, isNotebookHydrating])

  useEffect(() => {
    if (!authSession?.email) return
    localStorage.setItem(makeScopedStorageKey(LISTENING_ATTEMPTS_KEY, authSession.email), JSON.stringify(listeningAttemptHistory))
  }, [authSession, listeningAttemptHistory])

  useEffect(() => () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }, [])

  useEffect(() => {
    if (activePage !== 'listening' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      listeningSpeechRef.current = null
      setListeningPlaybackState('idle')
    }
  }, [activePage])

  useEffect(() => {
    if (activePage !== 'reading') return
    if (readingWorkspaceMode !== 'bank') {
      setReadingWorkspaceMode('bank')
      setReadingPdoySessionActive(false)
    }
  }, [activePage, readingWorkspaceMode])

  useEffect(() => {
    if (!authSession?.email) return
    const scopedKey = makeScopedStorageKey(READING_PDOY_PROGRESS_KEY, authSession.email)
    if (!selectedReadingPdoyLessonId) {
      localStorage.removeItem(scopedKey)
      return
    }
    const snapshot: ReadingPdoyProgressSnapshot = {
      lessonId: selectedReadingPdoyLessonId,
      sessionActive: readingPdoySessionActive,
      step: readingPdoyStep,
      questionIndex: readingPdoyQuestionIndex,
      evidenceInput: readingPdoyEvidenceInput,
      decision: readingPdoyDecision,
      selectedOption: readingPdoySelectedOption,
      optionParaphraseInput: readingPdoyOptionParaphraseInput,
      feedback: readingPdoyFeedback,
      introChoice: readingPdoyIntroChoice,
      evidenceAttempts: readingPdoyEvidenceAttempts,
      decisionAttempts: readingPdoyDecisionAttempts,
      fillMeaningOptionId: readingPdoyFillMeaningOptionId
    }
    localStorage.setItem(scopedKey, JSON.stringify(normalizeReadingPdoySnapshotForStage(snapshot)))
  }, [
    authSession,
    selectedReadingPdoyLessonId,
    readingPdoySessionActive,
    readingPdoyStep,
    readingPdoyQuestionIndex,
    readingPdoyEvidenceInput,
    readingPdoyDecision,
    readingPdoySelectedOption,
    readingPdoyOptionParaphraseInput,
    readingPdoyFeedback,
    readingPdoyIntroChoice,
    readingPdoyEvidenceAttempts,
    readingPdoyDecisionAttempts,
    readingPdoyFillMeaningOptionId
  ])

  useEffect(() => {
    if (!authSession?.accessToken || authSession.role !== 'student' || isNotebookHydrating || !notebookLoadedRef.current) return
    const snapshot =
      selectedReadingPdoyLessonId
        ? {
            lessonId: selectedReadingPdoyLessonId,
            sessionActive: readingPdoySessionActive,
            step: readingPdoyStep,
            questionIndex: readingPdoyQuestionIndex,
            evidenceInput: readingPdoyEvidenceInput,
            decision: readingPdoyDecision,
            selectedOption: readingPdoySelectedOption,
            optionParaphraseInput: readingPdoyOptionParaphraseInput,
            feedback: readingPdoyFeedback,
            introChoice: readingPdoyIntroChoice,
            evidenceAttempts: readingPdoyEvidenceAttempts,
            decisionAttempts: readingPdoyDecisionAttempts,
            fillMeaningOptionId: readingPdoyFillMeaningOptionId,
            lessonType: activeReadingPdoyLesson?.lessonType || '',
            examId: activeReadingPdoyExam?.id || '',
            examTitle: activeReadingPdoyExam?.title || '',
            category: activeReadingPdoyExam?.category || 'normal',
            passageNumber: activeReadingPdoyPassage?.number || 0,
            passageTitle: activeReadingPdoyPassage?.title || '',
            questionNumber: activeReadingPdoyQuestion?.number || 0,
            questionPrompt: activeReadingPdoyQuestion?.prompt || ''
          }
        : null
    const normalizedSnapshot = snapshot ? normalizeReadingPdoySnapshotForStage(snapshot) : null
    const nextSignature = normalizedSnapshot ? JSON.stringify(normalizedSnapshot) : ''
    if (nextSignature === readingPdoyProgressSyncedSignatureRef.current) return
    if (readingPdoyProgressSyncTimeoutRef.current) {
      window.clearTimeout(readingPdoyProgressSyncTimeoutRef.current)
    }
    readingPdoyProgressSyncTimeoutRef.current = window.setTimeout(() => {
      if (!normalizedSnapshot) {
        readingPdoyProgressSyncedSignatureRef.current = ''
        return
      }
      void fetchJson('/api/me/reading-pdoy-progress', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ progress: normalizedSnapshot })
      })
        .then(() => {
          readingPdoyProgressSyncedSignatureRef.current = nextSignature
        })
        .catch(() => {
          setNotebookSyncError('Saved on this device, but Reading with P\'Doy account sync failed just now.')
        })
    }, 800)

    return () => {
      if (readingPdoyProgressSyncTimeoutRef.current) {
        window.clearTimeout(readingPdoyProgressSyncTimeoutRef.current)
        readingPdoyProgressSyncTimeoutRef.current = null
      }
    }
  }, [
    authSession?.accessToken,
    authSession?.role,
    isNotebookHydrating,
    selectedReadingPdoyLessonId,
    readingPdoySessionActive,
    readingPdoyStep,
    readingPdoyQuestionIndex,
    readingPdoyEvidenceInput,
    readingPdoyDecision,
    readingPdoySelectedOption,
    readingPdoyOptionParaphraseInput,
    readingPdoyFeedback,
    readingPdoyIntroChoice,
    readingPdoyEvidenceAttempts,
    readingPdoyDecisionAttempts,
    readingPdoyFillMeaningOptionId,
    activeReadingPdoyLesson,
    activeReadingPdoyExam,
    activeReadingPdoyPassage,
    activeReadingPdoyQuestion
  ])

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

  useEffect(() => {
    if (!reportActionToast) return
    const timeout = window.setTimeout(() => {
      setReportActionToast(null)
    }, 3400)
    return () => window.clearTimeout(timeout)
  }, [reportActionToast])

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
    thaiMeaning,
    preferredSection,
    successNotice = 'Added to notebook'
  }: {
    criterion: string
    quote: string
    fix: string
    thaiMeaning?: string
    preferredSection?: NotebookSection | string
    successNotice?: string
  }) => {
    const chosenSection =
      preferredSection ||
      (selectedNotebookSection === 'custom' ? ('speaking' as const) : selectedNotebookSection)
    const isBuiltIn = ['speaking', 'writing', 'listening', 'reading'].includes(chosenSection)
    const section = (isBuiltIn ? chosenSection : 'custom') as NotebookSection
    const customSectionName = section === 'custom' ? chosenSection : undefined
    const topicTitle =
      preferredSection === 'reading'
        ? activeReadingExam?.title || activeReadingPdoyExam?.title || 'Reading lesson'
        : activeTopic?.title || 'Untitled topic'

    const nextEntry: NotebookEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      section,
      customSectionName,
      topicTitle,
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
    const resolvedSuccessNotice =
      preferredSection === 'reading' || section === 'reading'
        ? 'Added to notebook · saved to #reading'
        : successNotice
    setNotebookSaveNotice(resolvedSuccessNotice)
    void syncNotebookSnapshotToSupabase({
      entries: nextEntries,
      sections: customSectionsRef.current,
      successNotice: resolvedSuccessNotice
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
    setReportActionToast({
      icon: '✦',
      title: 'Saved for future revision',
      text: 'บันทึก report เรียบร้อยแล้วครับ กลับมาทบทวนจุดอ่อนชุดนี้ได้ทุกเมื่อเลย'
    })
    void syncNotebookSnapshotToSupabase({
      entries: nextEntries,
      sections: nextSections,
      successNotice: 'Added to notebook and synced to your account'
    })
  }

  const handleDownloadCurrentRecording = async () => {
    if (!audioUrl) return
    try {
      const response = await fetch(audioUrl)
      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      const topicSlug = String(activeTopic?.title || 'english-plan-speaking')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      link.href = objectUrl
      link.download = `${topicSlug || 'english-plan-speaking'}-recording.webm`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(objectUrl)
      setReportActionToast({
        icon: '🎧',
        title: 'Audio downloaded',
        text: "โหลดเสียงเรียบร้อยแล้วครับ เก็บไว้ส่งให้พี่ดอยใช้ประกอบการ consult ต่อได้เลย"
      })
    } catch {
      setNotebookSaveNotice('Could not download the recording right now.')
    }
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
    if (!selectedListeningBuilderPackId && visibleListeningVocabularyBuilderPacks.length > 0) {
      setSelectedListeningBuilderPackId(visibleListeningVocabularyBuilderPacks[0].id)
    }
  }, [selectedListeningBuilderPackId, visibleListeningVocabularyBuilderPacks])

  useEffect(() => {
    if (!selectedListeningFoundationSetId && visibleListeningFoundationSets.length > 0) {
      setSelectedListeningFoundationSetId(visibleListeningFoundationSets[0].id)
    }
  }, [selectedListeningFoundationSetId, visibleListeningFoundationSets])

  useEffect(() => {
    if (activeListeningBuilderExamSet && !selectedListeningBuilderExamTestId) {
      setSelectedListeningBuilderExamTestId(activeListeningBuilderExamSet.tests[0]?.id || '')
    }
  }, [activeListeningBuilderExamSet, selectedListeningBuilderExamTestId])

  useEffect(() => {
    if (attemptStage === 'idle' && availableTopics.length > 0) {
      setSelectedTopicId(availableTopics[0].id)
    }
  }, [selectedTestMode, attemptStage, availableTopics])

  useEffect(() => {
    setTopicBankSearch('')
  }, [selectedTestMode])

  useEffect(() => {
    if (attemptStage !== 'idle') return
    const idx = topicBankFlatIds.indexOf(selectedTopicId)
    if (idx >= 0) setTopicBankFocusIndex(idx)
    else if (topicBankFlatIds.length > 0) setTopicBankFocusIndex(0)
  }, [attemptStage, topicBankFlatIds, selectedTopicId])

  useEffect(() => {
    setTopicBankFocusIndex((i) => {
      const len = topicBankFlatIds.length
      if (len === 0) return 0
      return Math.min(Math.max(0, i), len - 1)
    })
  }, [topicBankFlatIds])

  useEffect(() => {
    if (attemptStage !== 'idle') return
    requestAnimationFrame(() => {
      const el = document.querySelector(
        `[data-topic-bank-card-index="${topicBankFocusIndex}"]`
      ) as HTMLElement | null
      el?.focus()
    })
  }, [attemptStage, topicBankFocusIndex])

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

  const playPromptAudioFromUrl = async (sourceUrl: string, revokeOnFinish = false) => {
    await new Promise<void>((resolve, reject) => {
      stopPromptAudioPlayback()
      const audio = new Audio(sourceUrl)
      promptAudioRef.current = audio
      let completed = false

      const cleanup = () => {
        if (completed) return
        completed = true
        audio.onended = null
        audio.onerror = null
        if (revokeOnFinish) {
          URL.revokeObjectURL(sourceUrl)
        }
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

  const playPromptWithServerTts = async (text: string) => {
    const normalizedText = normalizeReadingAnswer(text)
    const cachedQuestion = speakingQuestionAudioByQuestion.get(normalizedText)
    if (cachedQuestion && authSession?.accessToken) {
      const payload = await fetchJson<{ audioUrl: string }>('/api/tts/question-audio', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authSession.accessToken}`
        },
        body: JSON.stringify({
          cacheKey: cachedQuestion.cacheKey,
          section: cachedQuestion.section,
          topicId: cachedQuestion.topicId,
          topicTitle: cachedQuestion.topicTitle,
          text: cachedQuestion.question
        })
      })
      if (payload.audioUrl) {
        await playPromptAudioFromUrl(payload.audioUrl)
        return
      }
    }

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
    await playPromptAudioFromUrl(audioUrl, true)
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

  const generateQuestionAudioBatch = async (
    generatingKey: string,
    items: QuestionAudioCatalogItem[],
    options?: { force?: boolean }
  ) => {
    if (!authSession?.accessToken || authSession.role !== 'admin') return
    if (!items.length) return
    setTtsGeneratingKey(generatingKey)
    try {
      const payload = await fetchJson<{
        items: Array<{
          cacheKey?: string
          audioUrl?: string
        }>
      }>('/api/admin/tts/generate', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authSession.accessToken}`
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            cacheKey: item.cacheKey,
            section: item.section,
            topicId: item.topicId,
            topicTitle: item.topicTitle,
            text: item.question
          })),
          force: Boolean(options?.force)
        })
      })
      if (payload.items?.length) {
        setTtsAudioUrls((current) => ({
          ...current,
          ...Object.fromEntries(
            payload.items
              .filter((item) => item.cacheKey && item.audioUrl)
              .map((item) => [String(item.cacheKey), String(item.audioUrl)])
          )
        }))
      }
    } catch (error) {
      setAudioError(error instanceof Error ? error.message : 'TTS generation failed.')
    } finally {
      setTtsGeneratingKey('')
    }
  }

  const generateTtsForQuestion = async (item: QuestionAudioCatalogItem) => {
    await generateQuestionAudioBatch(item.key, [item], { force: Boolean(item.audioUrl) })
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
    setFullExamPhase(isTrialSpeakingFlow ? 'part2_prep' : 'part1')
    setFullExamPart1Index(0)
    setFullExamPart3Index(0)
    setFullExamPhaseSeconds(isTrialSpeakingFlow ? 60 : 75)
    if (isFullExamMode) {
      showFullExamAnnouncement(isTrialSpeakingFlow ? 'เริ่มช่วงเตรียมตัว 1 นาทีครับ' : 'Part 1 is starting', 1800)
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
    if (isFullExamMode && isTrialSpeakingFlow) {
      startQuestionCountdown('Trial - เตรียมตัว 1 นาที')
    } else if (isFullExamMode) {
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
    const responseSlice = (fullTranscript.length < start ? fullTranscript : fullTranscript.slice(start)).trim()
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
    const responseSlice = (fullTranscript.length < start ? fullTranscript : fullTranscript.slice(start)).trim()
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
    if (isTrialSpeakingFlow) {
      if (fullExamPhase === 'part2_prep') {
        setFullExamPhase('part2_speaking')
        setFullExamPhaseSeconds(120)
        armPart2TimerDelay()
        questionStartCharIndexRef.current = transcript.trim().length
        showFullExamAnnouncement('เริ่มพูด 2 นาทีได้เลยครับ', 1800)
        await runPromptThenCountdown('Trial - Speak for 2 minutes', fullExamPlan.part2Prompt || 'Part 2 prompt')
        return
      }
      if (fullExamPhase === 'part2_speaking') {
        captureFullExamQuestionResponse(fullExamPlan.part2Prompt || 'Part 2')
        setFullExamPhase('part3')
        setFullExamPart3Index(0)
        setFullExamPhaseSeconds(60)
        questionStartCharIndexRef.current = transcript.trim().length
        showFullExamAnnouncement('ต่อด้วย follow-up 3 ข้อ ข้อละ 1 นาทีครับ', 2200)
        await runPromptThenCountdown('Trial - Follow-up Question 1', fullExamPlan.part3Questions[0] || 'Part 3 question 1')
        return
      }
      captureFullExamQuestionResponse(fullExamPlan.part3Questions[fullExamPart3Index] || '')
      if (fullExamPart3Index < fullExamPlan.part3Questions.length - 1) {
        const nextIndex = fullExamPart3Index + 1
        setFullExamPart3Index(nextIndex)
        setFullExamPhaseSeconds(60)
        await runPromptThenCountdown(
          `Trial - Follow-up Question ${nextIndex + 1}`,
          fullExamPlan.part3Questions[nextIndex] || `Part 3 question ${nextIndex + 1}`
        )
        return
      }
      await finishSpeakingAndAssess()
      return
    }
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
        initialPromptText = isTrialSpeakingFlow
          ? fullExamPlan.part2Prompt || 'Part 2 prompt'
          : fullExamPlan.part1Questions[0] || 'Part 1 question 1'
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
        assessmentMode: isTrialSpeakingFlow ? 'trialSpeaking' : effectiveMode === 'full' ? 'fullMock' : 'standard',
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

  const handleTranscriptTextareaChange = (value: string) => {
    if (isFullExamMode || isQuestionByQuestionMode) {
      const fullText = String(transcript || '').trim()
      const prefix = fullText.slice(0, activeTranscriptStartIndex).trimEnd()
      const nextSegment = String(value || '')
      setTranscript(prefix ? `${prefix}\n\n${nextSegment.trimStart()}` : nextSegment)
      return
    }
    setTranscript(value)
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
      ? isTrialSpeakingFlow
        ? 60 + 120 + fullExamPlan.part3Questions.length * 60
        : fullExamPlan.part1Questions.length * 75 + 60 + 120 + 30 + fullExamPlan.part3Questions.length * 90
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
      if (payload.session.role === 'admin') {
        await loadManagedLearners(payload.session.accessToken)
        await loadAdminSupportReports(payload.session.accessToken)
        await loadAdminAssessmentReports(payload.session.accessToken)
        await loadAdminReadingPdoyProgress(payload.session.accessToken)
        await loadAdminTtsCatalog(payload.session.accessToken)
      } else if (payload.session.role === 'student') {
        await loadMySupportReports(payload.session.accessToken)
      }
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

  const advanceTrialSignupStep = () => {
    const email = normalizeEmail(trialEmailInput)
    if (!email) {
      setAuthError('กรุณากรอกอีเมลก่อนครับ')
      return
    }
    setAuthError('')
    setAuthNotice('')
    setTrialSignupStep('password')
  }

  const handleTrialSignupSubmit = async () => {
    const email = normalizeEmail(trialEmailInput)
    const password = trialPasswordInput.trim()

    if (!email || !password) {
      setAuthError('กรุณากรอกอีเมลและรหัสผ่านก่อนเริ่มทดลองใช้ฟรีครับ')
      setAuthNotice('')
      return
    }

    try {
      await fetchJson<{ success?: boolean; message?: string }>('/api/auth/trial-signup', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      })
      const payload = await fetchJson<AuthApiResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      })
      setAuthStateFromPayload(payload)
      setAuthError('')
      setAuthNotice('')
      setTrialEmailInput('')
      setTrialPasswordInput('')
      setTrialSignupStep('email')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'ไม่สามารถเริ่ม trial ได้ในตอนนี้ครับ'
      if (message.toLowerCase().includes('already been used')) {
        setTrialAuthMode('signin')
        setTrialSignupStep('password')
        setAuthError('')
        setAuthNotice('อีเมลนี้เคยใช้ trial ไปแล้วครับ คุณยังสามารถเข้าสู่บัญชีเดิมตรงนี้ได้เลยเพื่อดูสิทธิ์และ report เดิมของคุณ')
        return
      }
      setAuthNotice('')
      setAuthError(message)
    }
  }

  const handleTrialSignInSubmit = async () => {
    const email = normalizeEmail(trialEmailInput)
    const password = trialPasswordInput.trim()

    if (!email || !password) {
      setAuthError('กรุณากรอกอีเมลและรหัสผ่านเพื่อกลับเข้า trial ครับ')
      return
    }

    try {
      const payload = await fetchJson<AuthApiResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      })
      if (payload.session.role !== 'trial') {
        throw new Error('อีเมลนี้ไม่ได้เป็นบัญชี trial ครับ')
      }
      setAuthStateFromPayload(payload)
      setAuthNotice('')
      setAuthError('')
      setTrialEmailInput('')
      setTrialPasswordInput('')
      setTrialSignupStep('email')
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'ไม่สามารถเข้าสู่ trial ได้ครับ')
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
      await loadAdminAssessmentReports(payload.session.accessToken)
      await loadAdminReadingPdoyProgress(payload.session.accessToken)
      await loadAdminTtsCatalog(payload.session.accessToken)
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
    setAdminAssessmentReports([])
    setAdminReadingPdoyProgress([])
    setActivePage('home')
    setAdminCodeInput('')
    setSignupNameInput('')
    setSignupEmailInput('')
    setSignupPasswordInput('')
    setTrialEmailInput('')
    setTrialPasswordInput('')
    setTrialAuthMode('signup')
    setTrialSignupStep('email')
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
    setSelectedTopicId(topicId)
    setPendingStartTopicId(topicId)
    setSelectedExpectedScore('')
  }

  const handleTopicBankGridKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowRight' && event.key !== 'ArrowUp' && event.key !== 'ArrowLeft')
      return
    const len = topicBankFlatIds.length
    if (len === 0) return
    event.preventDefault()
    setTopicBankFocusIndex((prev) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') return (prev + 1) % len
      return (prev - 1 + len) % len
    })
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
      setFullExamPhaseSeconds(isTrialSpeakingFlow ? 60 : 90)
      await runPromptThenCountdown(
        `${isTrialSpeakingFlow ? 'Trial - Follow-up Question' : 'Part 3 - Question'} ${retryPart3Index + 1}`,
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

  const stopListeningSectionAudio = () => {
    const audio = listeningSectionAudioRef.current
    if (!audio) return
    audio.pause()
    audio.currentTime = 0
    audio.onended = null
    audio.onerror = null
    audio.src = ''
    listeningSectionAudioRef.current = null
  }

  const stopListeningPlayback = () => {
    stopListeningSectionAudio()
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    listeningSpeechRef.current = null
    setListeningPlaybackState('idle')
  }

  const playListeningSectionAudioFromUrl = async (sourceUrl: string) => {
    stopListeningSectionAudio()
    stopListeningPlayback()
    await new Promise<void>((resolve, reject) => {
      const audio = new Audio(sourceUrl)
      listeningSectionAudioRef.current = audio
      let completed = false
      const cleanup = () => {
        if (completed) return
        completed = true
        audio.onended = null
        audio.onerror = null
        audio.onplay = null
        if (listeningSectionAudioRef.current === audio) {
          listeningSectionAudioRef.current = null
        }
      }
      audio.onplay = () => setListeningPlaybackState('playing')
      audio.onended = () => {
        cleanup()
        setListeningPlaybackState('ended')
        resolve()
      }
      audio.onerror = () => {
        cleanup()
        setListeningPlaybackState('error')
        reject(new Error('Section audio failed to load.'))
      }
      audio.play().catch((error) => {
        cleanup()
        setListeningPlaybackState('error')
        reject(error instanceof Error ? error : new Error('Section audio playback failed.'))
      })
    })
  }

  const playListeningScriptWithSpeech = (spokenText: string, onErrorMessage: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setListeningPlaybackState('error')
      throw new Error(onErrorMessage)
    }
    stopListeningPlayback()
    const utterance = new SpeechSynthesisUtterance(spokenText)
    const availableVoices = window.speechSynthesis.getVoices()
    utterance.voice =
      availableVoices.find((voice) => /^en-GB/i.test(voice.lang)) ||
      availableVoices.find((voice) => /^en/i.test(voice.lang)) ||
      null
    utterance.lang = utterance.voice?.lang || 'en-GB'
    utterance.rate = 0.92
    utterance.pitch = 1
    utterance.onstart = () => setListeningPlaybackState('playing')
    utterance.onend = () => {
      listeningSpeechRef.current = null
      setListeningPlaybackState('ended')
    }
    utterance.onerror = () => {
      listeningSpeechRef.current = null
      setListeningPlaybackState('error')
    }
    listeningSpeechRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }

  const playListeningExercise = (rate: 'normal' | 'slow' = 'normal') => {
    if (!activeListeningExercise) return
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setListeningExerciseError('อุปกรณ์นี้ยังไม่รองรับการเล่นเสียงตัวอย่างใน browser ครับ')
      setListeningPlaybackState('error')
      return
    }

    stopListeningPlayback()
    setListeningExerciseError('')
    setListeningPlaybackRate(rate)

    const utterance = new SpeechSynthesisUtterance(activeListeningExercise.audioScript.join(' '))
    const availableVoices = window.speechSynthesis.getVoices()
    utterance.voice =
      availableVoices.find((voice) => /^en-GB/i.test(voice.lang)) ||
      availableVoices.find((voice) => /^en/i.test(voice.lang)) ||
      null
    utterance.lang = utterance.voice?.lang || 'en-GB'
    utterance.rate = rate === 'slow' ? 0.84 : 0.95
    utterance.pitch = 1
    utterance.onstart = () => setListeningPlaybackState('playing')
    utterance.onend = () => {
      listeningSpeechRef.current = null
      setListeningPlaybackState('ended')
    }
    utterance.onerror = () => {
      listeningSpeechRef.current = null
      setListeningPlaybackState('error')
      setListeningExerciseError('เล่นเสียงตัวอย่างไม่สำเร็จ ลองกดฟังอีกครั้งได้ครับ')
    }

    listeningSpeechRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }

  const startListeningExercise = (exerciseId: string) => {
    const exercise = LISTENING_EXERCISES.find((item) => item.id === exerciseId) || null
    if (!exercise) return
    stopListeningPlayback()
    setListeningLabMode('practice')
    setSelectedListeningExerciseId(exercise.id)
    setListeningAnswers({})
    setListeningReportItems([])
    setListeningAttemptStage('exam')
    setListeningPlaybackState('idle')
    setListeningPlaybackRate('normal')
    setListeningExerciseError('')
    setActivePage('listening')
  }

  const submitListeningExercise = () => {
    if (!activeListeningExercise) return
    stopListeningPlayback()
    const results = scoreListeningQuestions(activeListeningExercise.questions, listeningAnswers)
    const correctCount = results.filter((item) => item.isCorrect).length
    const totalQuestions = results.length
    setListeningAttemptHistory((current) => ({
      ...current,
      [activeListeningExercise.id]: {
        exerciseId: activeListeningExercise.id,
        exerciseTitle: activeListeningExercise.title,
        correctCount,
        totalQuestions,
        accuracy: totalQuestions ? Math.round((correctCount / totalQuestions) * 100) : 0,
        wrongCount: Math.max(0, totalQuestions - correctCount),
        completedAt: new Date().toISOString(),
        reportItems: results
      }
    }))
    setListeningReportItems(results)
    setListeningAttemptStage('report')
  }

  const resetListeningFoundationQuestion = () => {
    setListeningFoundationAudioPlayed(false)
    stopListeningPlayback()
    window.getSelection()?.removeAllRanges()
  }

  const playListeningFoundationPassage = async () => {
    if (!activeListeningFoundationSet) return
    setListeningFoundationAudioPlayed(true)
    const spokenText = activeListeningFoundationScriptSegments.length
      ? activeListeningFoundationScriptSegments
          .map((segment) => (segment.speaker ? `${segment.speaker}: ${segment.text}` : segment.text))
          .join(' ')
      : activeListeningFoundationScriptText || activeListeningFoundationSet.questions[0]?.passage || ''

    try {
      if (activeListeningFoundationSet.audioUrl) {
        await playListeningSectionAudioFromUrl(activeListeningFoundationSet.audioUrl)
        return
      }
      playListeningScriptWithSpeech(
        spokenText,
        'อุปกรณ์นี้ยังไม่รองรับการเล่นเสียงใน browser ครับ'
      )
    } catch {
      setListeningExerciseError('เล่นเสียงไม่สำเร็จ ลองกดเล่นอีกครั้งครับ')
    }
  }

  const playListeningBuilderExamSection = async () => {
    if (!activeListeningBuilderExamSet || !activeListeningBuilderExamTest) return
    setListeningBuilderExamAudioPlayed(true)
    const spokenText = activeListeningBuilderExamTest.scriptParagraphs.join(' ')
    const sectionAudioUrl = `https://ieltstrainingonline.com/wp-content/uploads/2021/07/Cam${activeListeningBuilderExamSet.bookNumber}-Test${activeListeningBuilderExamTest.testNumber}-Section${activeListeningBuilderExamSet.sectionNumber}.mp3`

    try {
      await playListeningSectionAudioFromUrl(sectionAudioUrl)
    } catch {
      try {
        playListeningScriptWithSpeech(spokenText, 'อุปกรณ์นี้ยังไม่รองรับการเล่นเสียงใน browser ครับ')
      } catch {
        setListeningExerciseError('เล่นเสียงไม่สำเร็จ ลองกดเล่นอีกครั้งครับ')
      }
    }
  }

  const openListeningFoundationSet = (setId: string) => {
    stopListeningPlayback()
    setListeningLabMode('foundation')
    setSelectedListeningFoundationSetId(setId)
    setListeningFoundationQuestionIndex(0)
    resetListeningFoundationQuestion()
    setActivePage('listening_foundation_exam')
  }

  const openListeningFoundationCategory = (category: ListeningFoundationCategory) => {
    stopListeningPlayback()
    setListeningLabMode('foundation')
    handleListeningFoundationCategoryChange(category)
    setActivePage('listening')
  }

  const openListeningPracticeBank = () => {
    stopListeningPlayback()
    setListeningLabMode('practice')
    setListeningAttemptStage('bank')
    setListeningPlaybackState('idle')
    setListeningExerciseError('')
    setActivePage('listening')
  }

  const openListeningLanding = () => {
    stopListeningPlayback()
    setListeningLabMode('landing')
    setListeningAttemptStage('bank')
    setActivePage('listening')
  }

  const handleListeningFoundationCategoryChange = (category: ListeningFoundationCategory) => {
    const firstSet = ALL_LISTENING_FOUNDATION_SETS.find((set) => set.category === category)
    setListeningFoundationCategory(category)
    setListeningBankBookFilter('all')
    setSelectedListeningFoundationSetId(firstSet?.id || '')
    setListeningFoundationQuestionIndex(0)
    resetListeningFoundationQuestion()
  }

  const renderListeningBookFilter = (books: number[], ariaLabel: string) => (
    <div className="listeningBookFilter" role="group" aria-label={ariaLabel}>
      <button
        type="button"
        className={listeningBankBookFilter === 'all' ? 'active' : ''}
        onClick={() => setListeningBankBookFilter('all')}
      >
        All books
      </button>
      {books.map((book) => (
        <button
          key={`listening-book-filter-${book}`}
          type="button"
          className={listeningBankBookFilter === book ? 'active' : ''}
          onClick={() => setListeningBankBookFilter(book)}
        >
          Cambridge {book}
        </button>
      ))}
    </div>
  )

  const dismissPracticeActionToast = () => setPracticeActionToast(null)

  const showPracticeKnewItToast = () => {
    setPracticeActionToast({ id: Date.now(), message: 'ดีมากครับ', variant: 'celebrate' })
  }

  const showPracticeNotebookToast = () => {
    setPracticeActionToast({ id: Date.now(), message: 'อย่าลืมทบทวนด้วยนะ :)', variant: 'notebook' })
  }

  const handlePracticeSaveToNotebook = (saveFn: () => void) => {
    saveFn()
    showPracticeNotebookToast()
  }

  const openListeningVocabularyBuilderPack = (packId: string) => {
    stopListeningPlayback()
    resetListeningBuilderExamDrill()
    setListeningLabMode('builder')
    setSelectedListeningBuilderPackId(packId)
    const selectedPack = listeningVocabularyBuilderPacks.find((pack) => pack.id === packId) || null
    const selectedExamSet =
      LISTENING_BUILDER_EXAM_SETS.find((examSet) => examSet.id === packId) ??
      LISTENING_BUILDER_EXAM_SETS.find(
        (examSet) => examSet.bookNumber === selectedPack?.bookNumber && examSet.sectionNumber === selectedPack?.sectionNumber
      )
    if (selectedExamSet) {
      setSelectedListeningBuilderExamTestId(selectedExamSet.tests[0]?.id || '')
    } else {
      setSelectedListeningBuilderExamTestId('')
    }
    setListeningBuilderItemIndex(0)
    setActivePage('listening_builder_exam')
  }

  const resetListeningBuilderExamDrill = () => {
    setListeningBuilderItemIndex(0)
    setListeningBuilderExamAudioPlayed(false)
    stopListeningPlayback()
    window.getSelection()?.removeAllRanges()
  }

  const startReadingExam = (examId: string) => {
    const exam = filteredReadingExams.find((item) => item.id === examId) || null
    if (!exam) return
    setReadingWorkspaceMode('bank')
    setReadingEntryCategory(exam.category)
    setReadingPdoySessionActive(false)
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

  const startReadingPdoyLesson = (lessonId: string) => {
    const lesson = readingPdoyLessons.find((item) => item.id === lessonId) || null
    if (!lesson) return
    setReadingWorkspaceMode('pdoy')
    setReadingPdoySessionActive(true)
    setSelectedReadingPdoyLessonId(lesson.id)
    setSelectedReadingExamId(lesson.examId)
    setReadingAttemptStage('bank')
    setReadingPdoyStep('intro')
    setReadingPdoyQuestionIndex(0)
    setReadingPdoyEvidenceInput('')
    setReadingPdoyDecision('')
    setReadingPdoySelectedOption('')
    setReadingPdoyOptionParaphraseInput('')
    setReadingPdoyFillMeaningOptionId('')
    setReadingPdoyFeedback('')
    setReadingPdoyIntroChoice('')
    setReadingPdoyEvidenceAttempts(0)
    setReadingPdoyDecisionAttempts(0)
    setReadingHintQuestionNumber(null)
    setReadingSelectionText('')
    setReadingUserHighlights([])
    setReadingExamError('')
    setReadingActivePassageNumber(lesson.passageNumber)
    setActivePage('reading')
  }

  const resetReadingPdoyForNextQuestion = () => {
    setReadingPdoyStep('intro')
    setReadingPdoyEvidenceInput('')
    setReadingPdoyDecision('')
    setReadingPdoySelectedOption('')
    setReadingPdoyOptionParaphraseInput('')
    setReadingPdoyFillMeaningOptionId('')
    setReadingPdoyFeedback('')
    setReadingPdoyEvidenceAttempts(0)
    setReadingPdoyDecisionAttempts(0)
    setReadingPdoyIntroChoice('')
  }

  const getReadingPdoyIntroGuidance = () => {
    if (activeReadingPdoyLesson?.lessonType === 'multiple-choice') {
      return {
        expectedChoice: 'อ่าน passage ก่อน แล้วค่อยหาส่วนที่ตรงกับโจทย์ ก่อนกลับมาเทียบตัวเลือก',
        successFeedback:
          'ถูกต้องครับ เริ่มจาก passage ก่อน และอย่าอ่านแค่ย่อหน้าเดียว ต้องดูย่อหน้าข้าง ๆ ด้วย พร้อมสังเกตคำเชื่อมอย่าง however, but, instead',
        wrongFeedback:
          'ยังไม่ใช่ครับ สำหรับ multiple choice เราเริ่มจาก passage ก่อน หาเนื้อหาที่ตรงกันให้เจอ แล้วค่อยกลับมาเทียบตัวเลือก'
      }
    }

    if (activeReadingPdoyLesson?.lessonType === 'fill-in-the-blank') {
      return {
        expectedChoice: activeReadingPdoyFillGrammarOptions.find((option) => option.isCorrect)?.label || '',
        successFeedback:
          `ถูกต้องครับ ${getReadingFillGrammarHint(activeReadingPdoyQuestion)} จากนั้นค่อยไปหา portion ที่พาราฟเรสตรงกันใน passage`,
        wrongFeedback:
          `ยังไม่ใช่ครับ ลองดู grammar cue รอบ blank ใหม่ก่อนนะครับ ${getReadingFillGrammarHint(activeReadingPdoyQuestion)}`
      }
    }

    return {
      expectedChoice: 'อ่าน statement ก่อน แล้วค่อยหาส่วนที่ตรงใน passage เพื่อเทียบความหมาย',
      successFeedback:
        'ถูกต้องครับ เราต้องเทียบความหมาย แล้วค่อยตัดสินว่าเนื้อหาตรงกัน ขัดแย้งกัน หรือไม่ได้บอกไว้',
      wrongFeedback:
        'ยังไม่ใช่ครับ สำหรับคำถามแบบนี้ เราอ่าน statement ก่อน หาเนื้อหาที่ตรงกันใน passage แล้วค่อยเทียบความหมาย ไม่ใช่ดูแค่ keyword ตัวเดียว'
    }
  }

  const useReadingPdoyCorrectIntro = () => {
    const guidance = getReadingPdoyIntroGuidance()
    setReadingPdoyIntroChoice(guidance.expectedChoice)
    setReadingPdoyFeedback('')
    setReadingPdoyStep('evidence')
  }

  const submitReadingPdoyIntro = () => {
    const guidance = getReadingPdoyIntroGuidance()
    const normalizedChoice = normalizeTextForLooseMatch(readingPdoyIntroChoice)
    const isCorrect = normalizedChoice === normalizeTextForLooseMatch(guidance.expectedChoice)
    if (!isCorrect) {
      setReadingPdoyFeedback(guidance.wrongFeedback)
      return
    }
    setReadingPdoyFeedback('')
    setReadingPdoyStep('evidence')
  }

  const submitReadingPdoyEvidence = () => {
    if (!activeReadingPdoyQuestion) return
    if (activeReadingPdoyLesson?.lessonType === 'fill-in-the-blank') {
      if (!readingPdoyEvidenceInput.trim()) {
        setReadingPdoyFeedback('เลือก portion ที่น่าจะใช่ก่อนครับ แล้วค่อยไปจับคำพาราฟเรสข้างใน')
        return
      }
      setReadingPdoySelectedOption('')
      setReadingPdoyFillMeaningOptionId('')
      setReadingPdoyDecisionAttempts(0)
      setReadingPdoyFeedback('โอเคครับ ตอนนี้ยังไม่เฉลยถูกผิดนะ ลองไปหาคำหรือวลีใน portion นี้ที่ match กับ clue ในโจทย์กันต่อ')
      setReadingPdoyStep('decide')
      return
    }
    const selectedEvidenceOption = activeReadingPdoyEvidenceOptions.find((option) => option.id === readingPdoyEvidenceInput) || null
    const matched = selectedEvidenceOption?.isCorrect || false
    if (matched) {
      setReadingPdoyFeedback('ดีมากครับ วลีที่จับได้ตรงนี้คือ clue สำคัญ ตอนนี้ค่อยไปตัดสินคำตอบสุดท้าย')
      setReadingPdoyStep('decide')
      return
    }
    const nextAttempts = readingPdoyEvidenceAttempts + 1
    setReadingPdoyEvidenceAttempts(nextAttempts)
    setReadingPdoyFeedback(
      nextAttempts >= 2
        ? `ลองอีกทีนะครับ ดู evidence ที่ไฮไลต์ไว้ตรงนี้ให้ใกล้ขึ้น: "${buildReadingHintNeedles(activeReadingPdoyQuestion.exactPortion)[0] || activeReadingPdoyQuestion.exactPortion}"`
        : 'ยังไม่ตรงครับ ลองดูบริเวณที่ไฮไลต์อีกครั้ง แล้วเลือกวลีจาก passage ที่ตรงความหมายที่สุด'
    )
  }

  const submitReadingPdoyDecision = () => {
    if (!activeReadingPdoyQuestion) return
    if (activeReadingPdoyLesson?.lessonType === 'multiple-choice') {
      if (!activeReadingPdoySelectedOptionRecord) {
        setReadingPdoyFeedback('เลือกตัวเลือกก่อนครับ แล้วเราจะเช็ก paraphrase link ระหว่างตัวเลือกกับ passage ด้วยกัน')
        return
      }
      const isMatchingQuestion = isReadingMatchingQuestion(activeReadingPdoyPassage, activeReadingPdoyQuestion)
      if (!isMatchingQuestion) {
        const paraphraseMatch = isReadingOptionParaphraseMatch(
          readingPdoyOptionParaphraseInput,
          activeReadingPdoySelectedOptionRecord,
          activeReadingPdoyQuestion
        )
        if (!paraphraseMatch) {
          setReadingPdoyFeedback(
            `ยังไม่ใช่ครับ กลับไปดู quoted evidence อีกครั้ง แล้วพิมพ์ว่าความคิดใน option ${activeReadingPdoySelectedOptionRecord.letter} ส่วนไหนที่ตรงกับ passage ก่อน`
          )
          return
        }
      }
      const normalizedDecision = normalizeReadingScoredAnswer(activeReadingPdoySelectedOptionRecord.letter)
      const normalizedCorrect = normalizeReadingScoredAnswer(activeReadingPdoyQuestion.correctAnswer)
      if (normalizedDecision === normalizedCorrect) {
        setReadingPdoyFeedback(`ถูกต้องครับ ${activeReadingPdoyQuestion.explanationThai}`)
        setReadingPdoyStep('result')
        return
      }
      const nextAttempts = readingPdoyDecisionAttempts + 1
      setReadingPdoyDecisionAttempts(nextAttempts)
      if (nextAttempts >= 2) {
        setReadingPdoyFeedback(
          `${isMatchingQuestion ? 'portion ที่เลือกมาหลอกเราได้เพราะมีคำคล้ายกัน' : 'ตัวเลือกนี้เชื่อมกับ evidence บางส่วนได้'} แต่คำตอบที่ดีที่สุดคือ ${activeReadingPdoyQuestion.correctAnswer} ครับ ${activeReadingPdoyQuestion.explanationThai}`
        )
        setReadingPdoyStep('result')
        return
      }
      setReadingPdoyFeedback(
        isMatchingQuestion
          ? `ยังไม่ใช่ครับ ตัวหลอกมักมี keyword คล้ายโจทย์ แต่ main idea หรือ information ไม่ตรง ลองกลับไปเทียบ 3 portions อีกครั้ง`
          : `จับ paraphrase ได้ดีแล้วครับ แต่ ${activeReadingPdoySelectedOptionRecord.letter} ยังไม่ใช่คำตอบที่ดีที่สุด ลองดูประโยคข้าง ๆ เพิ่ม โดยเฉพาะคำเชื่อมอย่าง however, but, หรือ instead`
      )
      return
    }
    if (activeReadingPdoyLesson?.lessonType === 'fill-in-the-blank') {
      if (!activeReadingPdoySelectedFillWordMatchOption) {
        setReadingPdoyFeedback('เลือกคำหรือวลีใน portion นี้ก่อนครับ แล้วค่อยเช็กว่ามัน match กับ clue ในโจทย์จริงไหม')
        return
      }
      if (activeReadingPdoySelectedFillWordMatchOption.isCorrect) {
        if (activeReadingPdoySelectedFillWordMatchOption.id === 'fill-match-cannot-find') {
          setReadingPdoyFeedback('ถูกที่คิดว่าหาไม่เจอครับ แปลว่า portion นี้ยังไม่น่าใช่ ลองกลับไปเลือกอีกส่วนของ passage แล้วค่อยจับ paraphrase ใหม่')
          setReadingPdoyStep('evidence')
          setReadingPdoySelectedOption('')
          setReadingPdoyFillMeaningOptionId('')
          return
        }
        setReadingPdoyFeedback(
          `ถูกต้องครับ คำที่ match กันคือ "${activeReadingPdoySelectedFillWordMatchOption.text}" และคำตอบที่ต้องเติมคือ ${activeReadingPdoyQuestion.correctAnswer} ครับ ${activeReadingPdoyQuestion.explanationThai}`
        )
        setReadingPdoyStep('result')
        return
      }
      const nextAttempts = readingPdoyDecisionAttempts + 1
      setReadingPdoyDecisionAttempts(nextAttempts)
      if (nextAttempts === 1) {
        const importantWord = activeReadingPdoyFillWordTarget?.important || activeReadingPdoyClue?.clue || 'clue'
        const thaiMeaning = activeReadingPdoyFillWordTarget?.importantThai || lookupReadingThaiMeaning(importantWord)
        setReadingPdoyFeedback(
          `ยังไม่ตรงครับ คำสำคัญในโจทย์คือ "${importantWord}"${thaiMeaning ? ` = ${thaiMeaning}` : ''} ลองมองใน portion นี้ใหม่อย่างละเอียดว่าคำหรือวลีไหนความหมายเท่ากัน`
        )
        return
      }
      if (nextAttempts >= 2) {
        setReadingPdoyFeedback(
          `เฉลยครับ คำหรือวลีที่ match กันคือ "${activeReadingPdoyFillWordTarget?.match || activeReadingPdoyQuestion.correctAnswer}" และคำตอบที่ถูกคือ ${activeReadingPdoyQuestion.correctAnswer} ครับ ${activeReadingPdoyQuestion.explanationThai}`
        )
        setReadingPdoyStep('result')
        return
      }
      return
    }
    const normalizedDecision = canonicalizeReadingCorrectAnswer(readingPdoyDecision)
    const normalizedCorrect = canonicalizeReadingCorrectAnswer(activeReadingPdoyQuestion.correctAnswer)
    if (normalizedDecision === normalizedCorrect) {
      setReadingPdoyFeedback(`ถูกต้องครับ ${activeReadingPdoyQuestion.explanationThai}`)
      setReadingPdoyStep('result')
      return
    }
    const nextAttempts = readingPdoyDecisionAttempts + 1
    setReadingPdoyDecisionAttempts(nextAttempts)
    if (nextAttempts >= 2) {
      setReadingPdoyFeedback(
        `เกือบแล้วครับ คำตอบที่ถูกคือ ${normalizedCorrect} ${activeReadingPdoyQuestion.explanationThai}`
      )
      setReadingPdoyStep('result')
      return
    }
    setReadingPdoyFeedback('ยังไม่ใช่ครับ อ่าน evidence ที่ไฮไลต์อีกครั้ง แล้วเทียบความหมายให้ชัดก่อนเลือกใหม่')
  }

  const goToNextReadingPdoyQuestion = () => {
    if (!activeReadingPdoyLesson) return
    const nextIndex = readingPdoyQuestionIndex + 1
    if (nextIndex >= activeReadingPdoyLesson.questions.length) {
      setReadingPdoyStep('complete')
      setReadingPdoyFeedback('เก่งมากครับ ทำ Reading with P\'Doy ชุดนี้จบแล้ว')
      return
    }
    setReadingPdoyQuestionIndex(nextIndex)
    resetReadingPdoyForNextQuestion()
  }

  const openReadingReview = (examId: string, stage: 'review' | 'report' = 'review') => {
    const exam = filteredReadingExams.find((item) => item.id === examId) || null
    const savedAttempt = readingAttemptByExamId[examId]
    if (!exam || !savedAttempt) return
    setReadingWorkspaceMode('bank')
    setReadingEntryCategory(exam.category)
    setReadingPdoySessionActive(false)
    setSelectedReadingExamId(exam.id)
    setReadingAnswers(Object.fromEntries(savedAttempt.reportItems.map((item) => [item.number, item.userAnswer])))
    setReadingReportItems(savedAttempt.reportItems)
    setReadingAttemptStage(stage)
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
    const results = scoreReadingQuestions(allQuestions, readingAnswers)
    const correctCount = results.filter((item) => item.isCorrect).length
    const totalQuestions = results.length
    setReadingAttemptHistory((current) => ({
      ...current,
      [activeReadingExam.id]: {
        examId: activeReadingExam.id,
        examTitle: activeReadingExam.title,
        category: activeReadingExam.category,
        correctCount,
        totalQuestions,
        accuracy: totalQuestions ? Math.round((correctCount / totalQuestions) * 100) : 0,
        wrongCount: Math.max(0, totalQuestions - correctCount),
        completedAt: new Date().toISOString(),
        reportItems: results
      }
    }))
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
    hintExcerpt?: string | string[]
  ) => {
    const hintNeedles = Array.isArray(hintExcerpt) ? hintExcerpt : buildReadingHintNeedles(hintExcerpt)
    const highlights = [
      ...readingUserHighlights
        .filter((item) => item.passageNumber === passageNumber)
        .map((item) => ({ text: item.text, tone: 'user' as const })),
      ...hintNeedles.map((item) => ({ text: item, tone: 'hint' as const }))
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
          ref={(node) => {
            if (found.tone === 'hint' && node && !readingHintMarkRef.current) {
              readingHintMarkRef.current = node
            }
          }}
        >
          {part}
        </mark>
      )
    })
  }


  const renderReadingFillQuestionGroup = (group: ReadingFillQuestionGroup) => {
    const questionByNumber = new Map(group.questions.map((question) => [question.number, question]))

    return (
      <article key={`reading-fill-group-${group.id}`} className="readingQuestionCard readingFillQuestionGroup">
        <div className="readingFillGroupHeader">
          <div>
            <p className="readingQuestionNumber">
              Questions {group.start}-{group.end}
            </p>
            <h4>Fill in the blanks</h4>
          </div>
        </div>
        {group.instruction && <pre className="readingFillInstruction">{group.instruction}</pre>}
        <div className="readingFillOriginalBlock">
          {group.displayLines.map((line, lineIndex) => {
            const onlySegment = line.segments.length === 1 ? line.segments[0] : null

            if (onlySegment?.kind === 'clue') {
              return (
                <p key={`${group.id}-clue-${lineIndex}`} className="readingFillClueLine">
                  {onlySegment.text}
                </p>
              )
            }

            if (onlySegment?.kind === 'heading') {
              return (
                <p key={`${group.id}-heading-${lineIndex}`} className="readingFillSectionHeading">
                  {onlySegment.text}
                </p>
              )
            }

            return (
              <p key={`${group.id}-line-${lineIndex}`} className="readingFillLine">
                {line.segments.map((segment, segmentIndex) => {
                  if (segment.kind === 'text') {
                    return <span key={`${group.id}-text-${lineIndex}-${segmentIndex}`}>{segment.text} </span>
                  }
                  if (segment.kind === 'heading') {
                    return (
                      <strong key={`${group.id}-heading-${lineIndex}-${segmentIndex}`} className="readingFillInlineHeading">
                        {segment.text}{' '}
                      </strong>
                    )
                  }
                  if (segment.kind === 'clue') {
                    return (
                      <span key={`${group.id}-clue-${lineIndex}-${segmentIndex}`} className="readingFillClueInline">
                        {segment.text}{' '}
                      </span>
                    )
                  }
                  if (segment.kind !== 'blank') return null

                  const question = questionByNumber.get(segment.questionNumber)
                  if (!question) return null
                  const isHinting = readingHintQuestionNumber === question.number

                  return (
                    <span
                      key={`reading-fill-slot-${group.id}-${segment.questionNumber}`}
                      id={`reading-question-${question.number}`}
                      className={`readingFillBlankSlot ${isHinting ? 'is-active' : ''}`.trim()}
                    >
                      {segment.before && <span className="readingFillBlankPrefix">{segment.before} </span>}
                      <label>
                        <span>{question.number}</span>
                        <input
                          type="text"
                          value={readingAnswers[question.number] || ''}
                          onChange={(event) =>
                            setReadingAnswers((current) => ({
                              ...current,
                              [question.number]: event.target.value
                            }))
                          }
                          placeholder="Answer"
                          className="readingFillBlankInput"
                        />
                      </label>
                      {segment.after && <span className="readingFillBlankSuffix"> {segment.after}</span>}
                      <button
                        type="button"
                        className="secondary readingFillHintBtn"
                        onClick={() => {
                          setReadingHintQuestionNumber((current) =>
                            current === question.number ? null : question.number
                          )
                        }}
                      >
                        {isHinting ? 'Hide hint' : 'Show hint'}
                      </button>
                    </span>
                  )
                })}
              </p>
            )
          })}
        </div>
        {group.questions.some((question) => question.number === readingHintQuestionNumber) && (
          <div className="readingHintBox">
            <strong>Hint:</strong> evidence highlighted in the passage.
          </div>
        )}
      </article>
    )
  }

  const renderReadingMatchingGroup = (group: ReadingMatchingGroup) => {
    const hintedQuestion = group.questions.find((question) => question.number === readingHintQuestionNumber)
    const choiceListTitle =
      group.kind === 'heading'
        ? 'List of headings'
        : group.kind === 'statement'
          ? 'Answer choices'
          : 'Paragraphs'

    return (
      <article key={`reading-matching-group-${group.id}`} className="readingQuestionCard readingMatchingInfoGroup">
        <pre className="readingMatchingInfoInstruction">{group.instruction}</pre>
        {group.choiceOptions.length > 0 && group.kind !== 'information' && (
          <div className="readingHeadingListPanel" aria-label={choiceListTitle}>
            <p className="readingQuestionNumber">{choiceListTitle}</p>
            <ul className="readingHeadingListPanelList">
              {group.choiceOptions.map((option) => (
                <li key={`${group.id}-choice-${option.letter}`}>
                  <strong>{option.letter}</strong>
                  <span>{option.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="readingMatchingInfoList">
          {group.questions.map((question) => {
            const statement = getReadingMatchingQuestionStatement(
              activeReadingPassage,
              question,
              group.kind
            )
            const isHinting = readingHintQuestionNumber === question.number
            const selectPlaceholder =
              group.kind === 'heading'
                ? 'Select heading'
                : group.kind === 'information'
                  ? 'Select paragraph'
                  : 'Select answer'
            return (
              <div
                key={`reading-matching-row-${group.id}-${question.number}`}
                id={`reading-question-${question.number}`}
                className={`readingMatchingInfoRow ${isHinting ? 'is-active' : ''}`.trim()}
              >
                <p className="readingMatchingInfoStatement">
                  <strong>{question.number}</strong> {statement}
                </p>
                <div className="readingMatchingInfoControls">
                  <select
                    value={readingAnswers[question.number] || ''}
                    onChange={(event) =>
                      setReadingAnswers((current) => ({ ...current, [question.number]: event.target.value }))
                    }
                    className="readingMatchingInfoSelect"
                  >
                    <option value="">{selectPlaceholder}</option>
                    {group.choiceOptions.map((option) => (
                      <option key={`${group.id}-${question.number}-${option.letter}`} value={option.letter}>
                        {group.kind === 'information'
                          ? `Paragraph ${option.letter}`
                          : `${option.letter}. ${option.text}`}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="secondary readingFillHintBtn"
                    onClick={() => {
                      setReadingHintQuestionNumber((current) =>
                        current === question.number ? null : question.number
                      )
                    }}
                  >
                    {isHinting ? 'Hide hint' : 'Show hint'}
                  </button>
                </div>
                {isHinting && (
                  <p className="readingMatchingInfoHintNote">
                    Four possible evidence portions are highlighted in the passage on the left.
                  </p>
                )}
              </div>
            )
          })}
        </div>
        {hintedQuestion && (
          <div className="readingHintBox">
            <strong>Hint:</strong> four possible evidence portions are highlighted in the passage.
          </div>
        )}
      </article>
    )
  }

  const renderReadingAnswerField = (
    question: ReadingQuestion,
    passage: ReadingPassageRecord | null = activeReadingPassage
  ) => {
    const value = readingAnswers[question.number] || ''

    const matchingKind = getReadingMatchingQuestionKind(passage, question)
    if (matchingKind) {
      const options = getReadingMatchingAnswerOptions(passage, question, matchingKind)
      const placeholder =
        matchingKind === 'heading'
          ? 'Select heading'
          : matchingKind === 'information'
            ? 'Select paragraph'
            : 'Select answer'
      return (
        <select
          value={value}
          onChange={(event) =>
            setReadingAnswers((current) => ({ ...current, [question.number]: event.target.value }))
          }
          className="readingMatchingInfoSelect"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={`${question.number}-${option.letter}`} value={option.letter}>
              {matchingKind === 'information'
                ? `Paragraph ${option.letter}`
                : `${option.letter}. ${option.text}`}
            </option>
          ))}
        </select>
      )
    }

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

  const renderListeningAnswerField = (question: ListeningQuestion) => {
    const value = listeningAnswers[question.number] || ''
    if (question.answerType === 'multiple-choice') {
      return (
        <div className="listeningChoiceGrid">
          {(question.options || []).map((option) => (
            <button
              key={`${question.number}-${option.key}`}
              type="button"
              className={`listeningChoiceBtn ${value === option.key ? 'active' : ''}`}
              onClick={() => setListeningAnswers((current) => ({ ...current, [question.number]: option.key }))}
            >
              <strong>{option.key}</strong>
              <span>{option.text}</span>
            </button>
          ))}
        </div>
      )
    }
    return (
      <input
        type="text"
        value={value}
        onChange={(event) => setListeningAnswers((current) => ({ ...current, [question.number]: event.target.value }))}
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

  const openAdminAssessmentReport = async (reportId: string) => {
    if (!authSession?.accessToken || authSession.role !== 'admin') return
    try {
      const payload = await fetchJson<{
        report: {
          summary?: AdminAssessmentReportSummary
          testMode?: SpeakingTestMode
          topicTitle?: string
          topicCategory?: string
          prompt?: string
          cues?: string[]
          report?: AssessmentResult
          selectedProvider?: string
        }
      }>(`/api/admin/assessment-reports/${reportId}`, {
        headers: {
          Authorization: `Bearer ${authSession.accessToken}`
        }
      })
      const detail = payload.report
      const snapshot: SavedReportSnapshot = {
        testMode: detail?.testMode || detail?.summary?.testMode || 'part2',
        topicTitle: detail?.topicTitle || detail?.summary?.topicTitle || 'Speaking report',
        topicCategory: detail?.topicCategory || detail?.summary?.topicCategory || 'Speaking',
        prompt: detail?.prompt || '',
        cues: Array.isArray(detail?.cues) ? detail.cues : [],
        report: (detail?.report as AssessmentResult) || ({} as AssessmentResult),
        selectedProvider: detail?.selectedProvider || detail?.summary?.provider || 'gemini'
      }
      openSavedReportSnapshot(snapshot)
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Could not open this report.')
    }
  }

  return (
    <main className="workspace">
      {activePage !== 'home' && <header className="topbar">
        <div>
          <h1>ENGLISH PLAN</h1>
          <p>Learning Space</p>
        </div>
        <div className="headerActions">
          <div className="pageSwitch">
            {authSession?.role === 'trial' ? (
              <button
                className={activePage === 'workspace' ? 'active' : ''}
                onClick={() => {
                  setSelectedTestMode('full')
                  setSelectedTopicId(TRIAL_SPEAKING_TOPIC_ID)
                  setActivePage('workspace')
                }}
                type="button"
              >
                Trial
              </button>
            ) : (
              <>
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
                    setSpeakingEntryMode(null)
                    setTopicBankSearch('')
                    setActivePage('workspace')
                  }}
                  type="button"
                >
                  Speaking
                </button>
                {canAccessListening && (
                  <button
                    className={
                      activePage === 'listening' ||
                      activePage === 'listening_foundation_exam' ||
                      activePage === 'listening_builder_exam'
                        ? 'active'
                        : ''
                    }
                    onClick={() => {
                      openListeningLanding()
                    }}
                    type="button"
                  >
                    Listening
                  </button>
                )}
                <button
                  className={activePage === 'reading' ? 'active' : ''}
                  onClick={() => {
                    setReadingEntryCategory(null)
                    setReadingWorkspaceMode('bank')
                    setSelectedReadingCategory('normal')
                    setReadingAttemptStage('bank')
                    setReadingHintQuestionNumber(null)
                    setActivePage('reading')
                  }}
                  type="button"
                >
                  Reading
                </button>
                <button
                  className={activePage === 'notebook' ? 'active' : ''}
                  onClick={() => {
                    if (isStudentNotebookLocked) return
                    setActivePage('notebook')
                  }}
                  type="button"
                  disabled={isStudentNotebookLocked}
                >
                  {isStudentNotebookLocked ? 'Notebook (Coming Soon)' : 'Notebook'}
                </button>
              </>
            )}
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
              : authSession?.role === 'trial'
                ? `Trial | ${authSession?.email || ''} | Uses left: ${Math.min(creditProfile.feedbackRemaining, creditProfile.fullMockRemaining)}`
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
            <h1 className="homeBrandTitle">
              <span>ENGLISH PLAN</span>
              <small>Learning Space</small>
            </h1>
            <p>
              {authSession
                ? `Welcome back, ${authSession.name}.`
                : 'Sign in with the learner access your admin created for you.'}
            </p>
            {authSession ? (
              authSession.role === 'trial' ? (
                <div className="trialHomeCard">
                  <p className="sectionLabel">One-time Trial</p>
                  <h3>พร้อมเริ่มลองใช้ IELTS Speaking Trial แล้วครับ</h3>
                  <p>กดปุ่มด้านล่างเพื่อกลับไปที่ชุดทดลองใช้ฟรีของคุณได้เลย</p>
                  <div className="homeGrid">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTestMode('full')
                        setSelectedTopicId(TRIAL_SPEAKING_TOPIC_ID)
                        setActivePage('workspace')
                      }}
                    >
                      ไปที่ Trial ตอนนี้
                    </button>
                    <button type="button" onClick={handleLogout}>
                      Log Out
                    </button>
                  </div>
                </div>
              ) : (
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
                  {canAccessListening && (
                    <button
                      type="button"
                      onClick={() => {
                        openListeningLanding()
                      }}
                    >
                      Listening
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setReadingEntryCategory(null)
                      setReadingWorkspaceMode('bank')
                      setSelectedReadingCategory('normal')
                      setReadingAttemptStage('bank')
                      setReadingHintQuestionNumber(null)
                      setActivePage('reading')
                    }}
                  >
                    Reading
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
              )
            ) : (
              isTrialRouteRequested ? (
                <div className="trialEntryHub">
                  <section className="trialHeroShowcase">
                    <div className="trialHeroMain">
                      <p className="sectionLabel">ENGLISH PLAN AI TRIAL</p>
                      <h2>ลองประเมิน IELTS Speaking ของตัวเองแบบ premium ก่อนตัดสินใจเรียนจริง</h2>
                      <p className="meta">
                        ระบบนี้ถูกออกแบบจากประสบการณ์สอนของ English Plan ตลอด 6 ปี และสะท้อน pattern จุดอ่อนของนักเรียนไทยกว่า 500+ คน
                        เพื่อให้คุณไม่ได้แค่ “ได้คะแนน” แต่รู้ด้วยว่าควรแก้ตรงไหนก่อนแบบ realistic ที่สุดครับ
                      </p>
                      <div className="trialHeroChips">
                        <span>5–7 นาที</span>
                        <span>1 ครั้งต่อ 1 อีเมล</span>
                        <span>Report แบบเดียวกับตัวเต็ม</span>
                      </div>
                    </div>
                    <div className="trialValueGrid">
                      <article className="trialValueCard">
                        <strong>Band Snapshot</strong>
                        <p>ดูภาพรวมคะแนน Fluency, Grammar และ Vocabulary ของคุณแบบรวดเร็ว</p>
                      </article>
                      <article className="trialValueCard">
                        <strong>Weakness Diagnosis</strong>
                        <p>ชี้ให้เห็นจุดอ่อนที่นักเรียนไทยพลาดบ่อย และบอกว่าของคุณอยู่ตรงไหน</p>
                      </article>
                      <article className="trialValueCard">
                        <strong>Next-Step Advice</strong>
                        <p>ได้คำแนะนำที่เอาไปฝึกต่อได้ทันที ไม่ใช่แค่ feedback กว้าง ๆ</p>
                      </article>
                    </div>
                  </section>
                  <section className="authPanel trialAuthPanel">
                    <div className="authPanelHeader">
                      <p className="sectionLabel">ทดลองใช้ฟรี 1 ครั้ง</p>
                      <div className="authModeTabs">
                        <button
                          type="button"
                          className={trialAuthMode === 'signup' ? 'active' : ''}
                          onClick={() => {
                            setTrialAuthMode('signup')
                            setTrialSignupStep('email')
                            setAuthError('')
                            setAuthNotice('')
                          }}
                        >
                          เริ่ม Trial ใหม่
                        </button>
                        <button
                          type="button"
                          className={trialAuthMode === 'signin' ? 'active' : ''}
                          onClick={() => {
                            setTrialAuthMode('signin')
                            setAuthError('')
                            setAuthNotice('')
                          }}
                        >
                          กลับเข้า Trial เดิม
                        </button>
                      </div>
                    </div>
                    <p className="meta">
                      สิทธิ์นี้เป็นการทดลองใช้แบบ one-time trial only ต่อ 1 อีเมลครับ หลังเริ่มแล้วควรเผื่อเวลาไว้ประมาณ 5-7 นาที
                    </p>
                    <div className="trialChecklist">
                      <div className="trialChecklistItem">✉️ กรอกอีเมลก่อน แล้วตั้งรหัสผ่านเพื่อเข้า trial</div>
                      <div className="trialChecklistItem">📝 เตรียมปากกาและสมุด เพราะคุณจะมีเวลาเตรียมคำตอบ 1 นาที</div>
                      <div className="trialChecklistItem">🎤 จากนั้นต้องพูด 2 นาที และตอบ follow-up อีก 3 ข้อ</div>
                    </div>
                    <div className="authForm">
                      <label>
                        อีเมล
                        <input
                          type="email"
                          value={trialEmailInput}
                          onChange={(event) => setTrialEmailInput(event.target.value)}
                          placeholder="you@example.com"
                        />
                      </label>
                      {(trialAuthMode === 'signin' || trialSignupStep === 'password') && (
                        <label>
                          รหัสผ่าน
                          <input
                            type="password"
                            value={trialPasswordInput}
                            onChange={(event) => setTrialPasswordInput(event.target.value)}
                            placeholder="อย่างน้อย 6 ตัวอักษร"
                          />
                        </label>
                      )}
                      {trialAuthMode === 'signup' && trialSignupStep === 'email' ? (
                        <button type="button" onClick={advanceTrialSignupStep} disabled={isAuthLoading}>
                          ถัดไป: ตั้งรหัสผ่าน
                        </button>
                      ) : trialAuthMode === 'signup' ? (
                        <button type="button" onClick={() => void handleTrialSignupSubmit()} disabled={isAuthLoading}>
                          เริ่มใช้ฟรี 1 ครั้งตอนนี้
                        </button>
                      ) : (
                        <button type="button" onClick={() => void handleTrialSignInSubmit()} disabled={isAuthLoading}>
                          เข้าสู่ Trial ของฉัน
                        </button>
                      )}
                    </div>
                  </section>
                  {authNotice && <p className="meta authSuccess">{authNotice}</p>}
                  {authError && <p className="error authError">{authError}</p>}
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
              )
            )}
          </div>
        </section>
      ) : activePage === 'listening' ? (
        canAccessListening ? (
        <section className="panel full readingPage listeningPage">
          <div className="readingPageHeader listeningLabHeader">
            <div>
              <h2>Listening Lab</h2>
              <p>เลือกโหมดฝึก Listening ที่เหมาะกับระดับตอนนี้</p>
            </div>
            {listeningLabMode !== 'landing' && (
              <button
                type="button"
                className="secondary listeningBackChoiceButton"
                onClick={openListeningLanding}
              >
                Back to Listening Choices
              </button>
            )}
          </div>

          {listeningLabMode === 'landing' && (
            <div className="listeningBankLanding">
              <p className="listeningBankLandingLead meta">
                Pick one path. Foundation and Paraphrase drills are organised by <strong>Cambridge book → test → section</strong>.
              </p>
              <div className="listeningModeChoiceGrid listeningModeChoiceGrid--three">
                <button
                  type="button"
                  className="listeningModeChoiceCard"
                  onClick={() => openListeningFoundationCategory('essential')}
                >
                  <span>01</span>
                  <strong>Vocabulary Foundation</strong>
                  <p>Read the script, highlight evidence, answer MCQ. Best below Band 6–7.</p>
                  <em className="listeningModeChoiceHint">Essential &amp; Advanced inside</em>
                </button>
                <button
                  type="button"
                  className="listeningModeChoiceCard listeningModeChoiceCardPractice"
                  onClick={() => {
                    setListeningLabMode('builder')
                    setListeningBankBookFilter('all')
                    setListeningAttemptStage('bank')
                    setActivePage('listening')
                  }}
                >
                  <span>02</span>
                  <strong>Paraphrase Builder</strong>
                  <p>Cambridge 10–18 · Sections 2 &amp; 4 · highlight then answer.</p>
                </button>
                <button
                  type="button"
                  className="listeningModeChoiceCard listeningModeChoiceCardPractice"
                  onClick={openListeningPracticeBank}
                >
                  <span>03</span>
                  <strong>Full Practice Sets</strong>
                  <p>Audio + questions + scored report with transcript evidence.</p>
                </button>
              </div>
            </div>
          )}

          {listeningLabMode === 'foundation' && (
            <div className="listeningFoundationPage">
              <nav className="listeningBankBreadcrumb" aria-label="Listening navigation">
                <button type="button" className="listeningBankBreadcrumbLink" onClick={openListeningLanding}>
                  Listening
                </button>
                <span aria-hidden="true">/</span>
                <span>Foundation</span>
                <span aria-hidden="true">/</span>
                <span>{listeningFoundationCategory === 'advanced' ? 'Advanced' : 'Essential'}</span>
              </nav>

              <section className="listeningFoundationMission">
                <div>
                  <span>Vocabulary Foundation</span>
                  <h2>{listeningFoundationCategory === 'advanced' ? 'Advanced level' : 'Essential level'}</h2>
                  <p>
                    {listeningFoundationCategory === 'advanced'
                      ? 'Mid–high vocabulary · target Band 6.5–7'
                      : 'Core vocabulary · target below Band 6'}
                  </p>
                </div>
                <div className="listeningFoundationProgress">
                  <span>Category progress</span>
                  <strong>
                    {listeningFoundationCategoryQuestionTotal
                      ? Math.round(
                          (listeningFoundationCategoryCompletedCount / listeningFoundationCategoryQuestionTotal) * 100
                        )
                      : 0}
                    %
                  </strong>
                </div>
              </section>

              <div className="listeningFoundationCategories" role="tablist" aria-label="Foundation level">
                <button
                  type="button"
                  role="tab"
                  aria-selected={listeningFoundationCategory === 'essential'}
                  className={listeningFoundationCategory === 'essential' ? 'active' : ''}
                  onClick={() => handleListeningFoundationCategoryChange('essential')}
                >
                  Essential ({ALL_LISTENING_FOUNDATION_SETS.filter((set) => set.category === 'essential').length} sets)
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={listeningFoundationCategory === 'advanced'}
                  className={listeningFoundationCategory === 'advanced' ? 'active' : ''}
                  onClick={() => handleListeningFoundationCategoryChange('advanced')}
                >
                  Advanced ({ALL_LISTENING_FOUNDATION_SETS.filter((set) => set.category === 'advanced').length} sets)
                </button>
              </div>

              {foundationBooksInCategory.length > 0 &&
                renderListeningBookFilter(foundationBooksInCategory, 'Filter foundation sets by book')}

              <p className="listeningFoundationBankHint meta">
                Choose <strong>book → test → section</strong>, then start. Questions on the left, audio script on the right — answer and highlight evidence for each question.
              </p>

              <div className="listeningFoundationBankGrouped">
                {foundationSetsByBook.length === 0 ? (
                  <div className="listeningFoundationBankEmpty">
                    <p>No drills in this category yet.</p>
                    <p className="meta">
                      Switch Essential / Advanced above, or pick another book filter.
                    </p>
                  </div>
                ) : (
                  foundationSetsByBook.map(({ book, sets }) => (
                    <section key={`foundation-book-${book}`} className="listeningBookGroup">
                      <header className="listeningBookGroupHeader">
                        <h3>Cambridge {book}</h3>
                        <span>{sets.length} tests</span>
                      </header>
                      <div className="listeningSetCardGrid">
                        {sets.map((set) => {
                          const meta = parseListeningFoundationSetMeta(set)
                          const setCompletedCount = set.questions.filter(
                            (question) => listeningFoundationAnswerState[question.id] === 'correct'
                          ).length
                          return (
                            <article
                              key={set.id}
                              className={`listeningSetCard ${selectedListeningFoundationSetId === set.id ? 'active' : ''}`}
                            >
                              <p className="listeningSetCardEyebrow">Section {meta.section}</p>
                              <h4>{meta.cardTitle}</h4>
                              <p className="listeningSetCardTopic">{meta.cardSubtitle}</p>
                              <span className="listeningSetCardMeta">
                                {setCompletedCount}/{set.questions.length} complete · {set.questions.length} questions
                              </span>
                              <button type="button" onClick={() => openListeningFoundationSet(set.id)}>
                                Start drill
                              </button>
                            </article>
                          )
                        })}
                      </div>
                    </section>
                  ))
                )}
              </div>

            </div>
          )}

          {listeningLabMode === 'practice' && listeningAttemptStage === 'bank' && (
            <>
              <div className="readingSummaryStrip listeningOfficialStrip">
                {LISTENING_OFFICIAL_RESOURCES.map((resource) => (
                  <article key={resource.id} className="readingSummaryCard listeningReferenceCard">
                    <p className="sectionLabel">{resource.source}</p>
                    <strong>{resource.title}</strong>
                    <span>{resource.sampleType}</span>
                    <p className="meta">{resource.description}</p>
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => window.open(resource.url, '_blank', 'noopener,noreferrer')}
                    >
                      Open official sample
                    </button>
                  </article>
                ))}
              </div>

              <div className="readingBankGrid listeningExerciseGrid">
                {LISTENING_EXERCISES.map((exercise) => (
                  <article key={exercise.id} className="readingBankCard listeningExerciseCard">
                    <p className="promptPill">{exercise.label}</p>
                    <h3>{exercise.title}</h3>
                    <p className="meta">{exercise.formatLabel}</p>
                    <div className="readingExerciseMeta">
                      <span>{exercise.summary}</span>
                      <span>{exercise.level}</span>
                      <span>{exercise.duration}</span>
                    </div>
                    <p className="meta">{exercise.instructionsThai}</p>
                    {listeningAttemptByExerciseId[exercise.id] && (
                      <div className="adminWorkflowCard">
                        <p className="sectionLabel">Latest Score</p>
                        <strong>
                          {listeningAttemptByExerciseId[exercise.id].correctCount}/{listeningAttemptByExerciseId[exercise.id].totalQuestions} ({listeningAttemptByExerciseId[exercise.id].accuracy}%)
                        </strong>
                        <p className="meta">
                          {listeningAttemptByExerciseId[exercise.id].wrongCount} wrong · {new Date(listeningAttemptByExerciseId[exercise.id].completedAt).toLocaleString()}
                        </p>
                      </div>
                    )}
                    <div className="controls">
                      <button type="button" onClick={() => startListeningExercise(exercise.id)}>
                        {listeningAttemptByExerciseId[exercise.id] ? 'Retry Exercise' : 'Open Exercise'}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}

          {listeningLabMode === 'practice' && listeningAttemptStage === 'exam' && activeListeningExercise && (
            <div className="readingExamWrap listeningExamWrap">
              <div className="readingAttemptToolbar">
                <div>
                  <p className="sectionLabel">{activeListeningExercise.label}</p>
                  <h3>{activeListeningExercise.title}</h3>
                  <p className="meta">
                    {activeListeningExercise.summary} · {listeningAnsweredCount}/{activeListeningExercise.questions.length} answered
                  </p>
                </div>
                <div className="controls">
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => {
                      stopListeningPlayback()
                      setListeningAnswers({})
                      setListeningAttemptStage('bank')
                    }}
                  >
                    Back to Bank
                  </button>
                  <button type="button" onClick={submitListeningExercise}>
                    Check Answers
                  </button>
                </div>
              </div>

              <div className="readingExamLayout listeningExamLayout">
                <section className="readingPassagePanel listeningAudioPanel">
                  <div className="readingPassageHeader">
                    <div>
                      <p className="sectionLabel">Audio Practice</p>
                      <h3>{activeListeningExercise.formatLabel}</h3>
                    </div>
                    <div className="readingHintBox">
                      <strong>Practice mode:</strong> {activeListeningExercise.playbackNoteThai}
                    </div>
                  </div>

                  <div className="listeningPlayerCard">
                    <p className="meta">{activeListeningExercise.instructionsThai}</p>
                    <div className="controls listeningAudioControls">
                      <button type="button" onClick={() => playListeningExercise('normal')}>
                        Play audio
                      </button>
                      <button type="button" className="secondary" onClick={() => playListeningExercise('slow')}>
                        Play slower
                      </button>
                      <button type="button" className="secondary" onClick={stopListeningPlayback}>
                        Stop
                      </button>
                    </div>
                    <div className="readingSummaryStrip">
                      <article className="readingSummaryCard">
                        <p className="sectionLabel">Playback</p>
                        <strong>{listeningPlaybackState === 'playing' ? 'Playing' : listeningPlaybackState === 'ended' ? 'Finished' : listeningPlaybackState === 'error' ? 'Error' : 'Ready'}</strong>
                        <span>{listeningPlaybackRate === 'slow' ? 'Slow mode' : 'Normal mode'}</span>
                      </article>
                      <article className="readingSummaryCard">
                        <p className="sectionLabel">Question Count</p>
                        <strong>{activeListeningExercise.questions.length}</strong>
                        <span>questions in this set</span>
                      </article>
                    </div>
                    {listeningExerciseError ? <p className="error">{listeningExerciseError}</p> : null}
                  </div>

                  <div className="listeningTranscriptLocked">
                    <p className="sectionLabel">Transcript</p>
                    <h4>Transcript unlocks after you check your answers</h4>
                    <p className="meta">ตอนทำข้อให้โฟกัสจากสิ่งที่ได้ยินก่อนครับ พอส่งคำตอบแล้ว report จะโชว์ exact transcript portion และอธิบาย paraphrase ให้ทีละข้อ</p>
                  </div>
                </section>

                <section className="readingQuestionsPanel">
                  <div className="readingQuestionsHeader">
                    <div>
                      <p className="sectionLabel">Questions</p>
                      <h3>Answer while you listen</h3>
                    </div>
                    <span className="bandPill">{activeListeningExercise.questions.length} questions</span>
                  </div>
                  <div className="readingQuestionList">
                    {activeListeningExercise.questions.map((question) => (
                      <article key={`listening-question-${question.number}`} className="readingQuestionCard listeningQuestionCard">
                        <div className="readingQuestionCardTop">
                          <div>
                            <p className="readingQuestionNumber">Question {question.number}</p>
                            <p className="readingQuestionPrompt">{question.prompt}</p>
                          </div>
                        </div>
                        <div className="readingAnswerField">
                          {renderListeningAnswerField(question)}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          )}

          {listeningLabMode === 'practice' && listeningAttemptStage === 'report' && activeListeningExercise && (
            <div className="readingReportWrap listeningReportWrap">
              <div className="readingAttemptToolbar">
                <div>
                  <p className="sectionLabel">{activeListeningExercise.label}</p>
                  <h3>{activeListeningExercise.title} Report</h3>
                  <p className="meta">
                    Score: {listeningReportItems.filter((item) => item.isCorrect).length}/{listeningReportItems.length}
                  </p>
                </div>
                <div className="controls">
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => {
                      stopListeningPlayback()
                      setListeningAnswers({})
                      setListeningAttemptStage('bank')
                    }}
                  >
                    Back to Bank
                  </button>
                  <button type="button" onClick={() => startListeningExercise(activeListeningExercise.id)}>
                    Retry Exercise
                  </button>
                </div>
              </div>

              <div className="readingSummaryStrip">
                <article className="readingSummaryCard">
                  <p className="sectionLabel">Accuracy</p>
                  <strong>{listeningAccuracy}%</strong>
                  <span>{listeningReportItems.filter((item) => item.isCorrect).length} correct answers</span>
                </article>
                <article className="readingSummaryCard">
                  <p className="sectionLabel">Unanswered</p>
                  <strong>{listeningUnansweredCount}</strong>
                  <span>questions left blank</span>
                </article>
                <article className="readingSummaryCard">
                  <p className="sectionLabel">Review focus</p>
                  <strong>{listeningReportItems.find((item) => !item.isCorrect)?.number ? `Q${listeningReportItems.find((item) => !item.isCorrect)?.number}` : 'Strong set'}</strong>
                  <span>look at the transcript evidence and paraphrase note</span>
                </article>
              </div>

              <div className="listeningTranscriptReviewCard">
                <p className="sectionLabel">Full Transcript</p>
                <div className="listeningTranscriptReviewBody">
                  {activeListeningExercise.audioScript.map((line, index) => (
                    <p key={`listening-line-${index}`}>{line}</p>
                  ))}
                </div>
              </div>

              <div className="readingReportList">
                {listeningReportItems.map((item) => {
                  const paraphraseEquation = buildListeningParaphraseEquation(item)
                  return (
                  <article key={`listening-report-${item.number}`} className={`readingReportCard ${item.isCorrect ? 'readingReportCard-correct' : 'readingReportCard-wrong'}`}>
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
                    {item.answerType === 'multiple-choice' && item.options?.length ? (
                      <div className="listeningReportOptions">
                        {item.options.map((option) => (
                          <div key={`listening-option-${item.number}-${option.key}`} className={`listeningReportOption ${option.key === item.correctAnswer ? 'is-correct' : ''}`}>
                            <strong>{option.key}</strong>
                            <span>{option.text}</span>
                          </div>
                        ))}
                      </div>
                    ) : null}
                    <div className="readingReportEvidence">
                      <h4>Why?</h4>
                      {paraphraseEquation && (
                        <div className="listeningBuilderExamWordCheck">
                          <p>Do you know this word?</p>
                          <div className="listeningBuilderExamWordEquation">
                            <span>{paraphraseEquation.passageKeyword}</span>
                            <b>=</b>
                            <span>{paraphraseEquation.questionKeyword}</span>
                            <b>=</b>
                            <span>{paraphraseEquation.thaiMeaning}</span>
                          </div>
                        </div>
                      )}
                      <p>{item.explanationThai}</p>
                      <blockquote>{item.exactPortion}</blockquote>
                    </div>
                    {(item.paraphrasedVocabulary || paraphraseEquation) && (
                      <div className="readingParaphraseCard">
                        <p className="sectionLabel">Paraphrase link</p>
                        {item.paraphrasedVocabulary && <p>{item.paraphrasedVocabulary}</p>}
                        <ParaphraseBridgeActions
                          onKnewIt={showPracticeKnewItToast}
                          onSaveToNotebook={() =>
                            handlePracticeSaveToNotebook(() =>
                              savePlanToNotebook({
                                criterion: 'Listening Paraphrase',
                                quote: `Q${item.number}: ${item.prompt}`,
                                fix: item.paraphrasedVocabulary || item.correctAnswer,
                                thaiMeaning: paraphraseEquation?.thaiMeaning || item.explanationThai,
                                preferredSection: 'listening',
                                successNotice: 'Added to notebook'
                              })
                            )
                          }
                        />
                      </div>
                    )}
                  </article>
                )})}
              </div>
            </div>
          )}

          {listeningLabMode === 'builder' && (
            <div className="listeningBuilderBankPage">
              <nav className="listeningBankBreadcrumb" aria-label="Listening navigation">
                <button type="button" className="listeningBankBreadcrumbLink" onClick={openListeningLanding}>
                  Listening
                </button>
                <span aria-hidden="true">/</span>
                <span>Paraphrase Builder</span>
              </nav>

              <section className="listeningBuilderBankIntro">
                <h3>Cambridge Paraphrase Builder</h3>
                <p className="meta">
                  Pick a book and section. Highlight evidence in the script, then choose the answer.
                </p>
              </section>

              {builderBooks.length > 0 &&
                renderListeningBookFilter(builderBooks, 'Filter paraphrase packs by book')}

              <div className="listeningFoundationBankGrouped">
                {builderPacksByBook.map(({ book, packs }) => (
                  <section key={`builder-book-${book}`} className="listeningBookGroup">
                    <header className="listeningBookGroupHeader">
                      <h3>Cambridge {book}</h3>
                      <span>{packs.length} sections</span>
                    </header>
                    <div className="listeningSetCardGrid">
                      {packs.map((pack) => (
                        <article key={pack.id} className="listeningSetCard listeningSetCard--builder">
                          <p className="listeningSetCardEyebrow">Section {pack.sectionNumber}</p>
                          <h4>Section {pack.sectionNumber}</h4>
                          <p className="listeningSetCardTopic">Tests {pack.testNumbers.join(', ')}</p>
                          <span className="listeningSetCardMeta">{pack.taskCount} questions</span>
                          <button type="button" onClick={() => openListeningVocabularyBuilderPack(pack.id)}>
                            Open drill
                          </button>
                        </article>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          )}
        </section>
        ) : (
          <section className="panel full">
            <div className="emptyNotebook">
              <p>Listening ยังไม่พร้อมสำหรับบัญชีนี้ครับ</p>
              <p>ตอนนี้เปิดให้เฉพาะ student และ admin</p>
              <button type="button" onClick={() => setActivePage('home')}>
                Back Home
              </button>
            </div>
          </section>
        )
      ) : activePage === 'listening_foundation_exam' ? (
        canAccessListening ? (
          <section className="panel full listeningFoundationPage listeningFoundationExamPage listeningSectionExamHost">
            {listeningFoundationExamConfig && activeListeningFoundationSet ? (
              <ListeningSectionExamView
                config={{
                  ...listeningFoundationExamConfig,
                  title: parseListeningFoundationSetMeta(activeListeningFoundationSet).cardTitle,
                  subtitle: parseListeningFoundationSetMeta(activeListeningFoundationSet).cardSubtitle
                }}
                excerptDrill={Boolean(listeningFoundationExamConfig.excerptDrill)}
                playbackState={listeningPlaybackState}
                audioPlayed={listeningFoundationAudioPlayed}
                onTogglePlay={() => {
                  if (listeningPlaybackState === 'playing') {
                    stopListeningPlayback()
                  } else {
                    void playListeningFoundationPassage()
                  }
                }}
                onBack={() => {
                  stopListeningPlayback()
                  setListeningLabMode('foundation')
                  setActivePage('listening')
                }}
                onKnewIt={showPracticeKnewItToast}
                onQuestionComplete={(questionId) => {
                  setListeningFoundationAnswerState((current) => ({ ...current, [questionId]: 'correct' }))
                }}
                onSaveNotebook={(question) => {
                  handlePracticeSaveToNotebook(() =>
                    savePlanToNotebook({
                      criterion: 'Listening Foundation',
                      quote: `Q${question.number}: ${question.stem}`,
                      fix: `${question.passageKeyword} = ${question.questionKeyword}`,
                      thaiMeaning: question.thaiMeaning,
                      preferredSection: 'listening',
                      successNotice: 'Added to notebook · saved to #listening'
                    })
                  )
                }}
              />
            ) : (
              <div className="emptyNotebook">
                <p>No Listening Foundation exam is selected yet.</p>
                <button
                  type="button"
                  onClick={() => {
                    setListeningLabMode('foundation')
                    setActivePage('listening')
                  }}
                >
                  Back to Exam Bank
                </button>
              </div>
            )}
          </section>
        ) : (
          <section className="panel full">
            <div className="emptyNotebook">
              <p>Listening ยังไม่พร้อมสำหรับบัญชีนี้ครับ</p>
              <button type="button" onClick={() => setActivePage('home')}>
                Back Home
              </button>
            </div>
          </section>
        )
      ) : activePage === 'listening_builder_exam' ? (
        canAccessListening ? (
          <section className="panel full listeningBuilderExamPage listeningSectionExamHost">
            {listeningBuilderExamConfig && activeListeningBuilderExamSet ? (
              <ListeningSectionExamView
                config={listeningBuilderExamConfig}
                playbackState={listeningPlaybackState}
                audioPlayed={listeningBuilderExamAudioPlayed}
                onTogglePlay={() => {
                  if (listeningPlaybackState === 'playing') {
                    stopListeningPlayback()
                  } else {
                    void playListeningBuilderExamSection()
                  }
                }}
                onBack={openListeningLanding}
                onKnewIt={showPracticeKnewItToast}
                onQuestionComplete={(questionId) => {
                  setListeningBuilderExamAnswerState((current) => ({ ...current, [questionId]: 'correct' }))
                }}
                testTabs={activeListeningBuilderExamSet.tests.map((test) => ({
                  id: test.id,
                  label: `Test ${test.testNumber}`
                }))}
                activeTestId={activeListeningBuilderExamTest?.id}
                onTestChange={(testId) => {
                  setSelectedListeningBuilderExamTestId(testId)
                  resetListeningBuilderExamDrill()
                  setListeningBuilderExamAudioPlayed(false)
                  stopListeningPlayback()
                }}
                onSaveNotebook={(question) => {
                  handlePracticeSaveToNotebook(() =>
                    savePlanToNotebook({
                      criterion: 'Listening Paraphrase Drill',
                      quote: `${listeningBuilderExamConfig.title} · Q${question.number} · ${question.questionKeyword}`,
                      fix: `${question.questionKeyword} = ${question.evidence}`,
                      thaiMeaning: question.thaiMeaning || question.explanationThai || '',
                      preferredSection: 'listening',
                      successNotice: 'Added to notebook · saved to #listening'
                    })
                  )
                }}
              />
            ) : (
              <div className="emptyNotebook">
                <p>No detailed exam card is ready for this pack yet.</p>
                <button type="button" onClick={openListeningLanding}>
                  Back to Listening Choices
                </button>
              </div>
            )}
          </section>
        ) : (
          <section className="panel full">
            <div className="emptyNotebook">
              <p>Listening ยังไม่พร้อมสำหรับบัญชีนี้ครับ</p>
              <button type="button" onClick={() => setActivePage('home')}>
                Back Home
              </button>
            </div>
          </section>
        )
      ) : activePage === 'reading' ? (
        <section
          className={`panel full readingPage${
            readingWorkspaceMode === 'bank' && readingAttemptStage === 'exam' ? ' readingPage-examActive' : ''
          }`}
        >
          <div className="readingPageHeader">
            <div>
              <p className="sectionLabel">IELTS Reading</p>
              <h2>{selectedReadingEntryChoice ? selectedReadingEntryChoice.title : 'Choose Reading Level'}</h2>
              <p>
                {selectedReadingEntryChoice
                  ? `${selectedReadingEntryChoice.subtitle} | ${selectedReadingEntryChoice.detail}`
                  : 'Start with the bank that matches your target band.'}
              </p>
            </div>
          </div>

          {readingWorkspaceMode === 'bank' && readingAttemptStage === 'bank' && !readingEntryCategory && (
            <div className="readingEntryShell">
              <div className="readingEntryChooser" aria-label="Choose reading exam level">
                {READING_ENTRY_CHOICES.map((choice) => {
                  const count = readingExamCountsByCategory.find((group) => group.category === choice.category)?.count || 0
                  return (
                    <button
                      key={choice.category}
                      type="button"
                      className={`readingEntryCard readingEntryCard-${choice.category}`}
                      onClick={() => {
                        setReadingEntryCategory(choice.category)
                        setSelectedReadingCategory(choice.category)
                        setReadingAttemptStage('bank')
                      }}
                    >
                      <span className="readingEntryLabel">{choice.tone}</span>
                      <strong>{choice.title}</strong>
                      <span className="readingEntrySubtitle">{choice.subtitle}</span>
                      <small>{choice.detail}</small>
                      <span className="readingEntryCount">{count} exams</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {readingWorkspaceMode === 'bank' && readingAttemptStage === 'bank' && readingEntryCategory && (
            <div className="readingBankWindow">
              <div className="readingBankWindowHeader">
                <div>
                  <span className="readingEntryLabel">{selectedReadingEntryChoice?.tone || 'Reading'}</span>
                  <h3>{selectedReadingEntryChoice?.title || READING_CATEGORY_LABELS[readingEntryCategory]}</h3>
                  <p>
                    {selectedReadingEntryChoice?.subtitle} | {selectedReadingEntryChoice?.detail}
                  </p>
                </div>
                <div className="readingBankWindowActions">
                  <span className="readingEntryCount">{filteredReadingExams.length} exams</span>
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => {
                      setReadingEntryCategory(null)
                      setReadingAttemptStage('bank')
                      setReadingExamError('')
                    }}
                  >
                    Back to Levels
                  </button>
                </div>
              </div>
              {readingExamError && <p className="error">{readingExamError}</p>}
              {filteredReadingExams.length === 0 ? (
                <div className="emptyNotebook">
                  <p>
                    {authSession?.role === 'admin' && readingExams.length > 0
                      ? 'There are uploaded reading exams, but none in this selected bank.'
                      : 'No reading exams in this bank yet.'}
                  </p>
                  <p>
                    {authSession?.role === 'admin'
                      ? readingExams.length > 0
                        ? 'Switch to a bank that already has content below, or upload another set from the Admin panel.'
                        : 'Upload one from the Admin panel.'
                      : 'Ask your admin to upload reading passages first.'}
                  </p>
                  {authSession?.role === 'admin' && readingExams.length > 0 && (
                    <div className="readingCategoryTabs">
                      {readingExamCountsByCategory
                        .filter((group) => group.count > 0)
                        .map((group) => (
                          <button
                            key={`jump-${group.category}`}
                            type="button"
                            onClick={() => {
                              setReadingEntryCategory(group.category)
                              setSelectedReadingCategory(group.category)
                            }}
                          >
                            Open {group.label} ({group.count})
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              ) : readingEntryCategory === 'normal' ? (
                <div className="readingStageBoard">
                  {normalReadingStages.map((stage) => (
                    <section
                      key={`normal-reading-stage-${stage.number}`}
                      className={`readingStagePanel ${stage.isUnlocked ? 'is-unlocked' : 'is-locked'}`}
                    >
                      <div className="readingStageHeader">
                        <div>
                          <p className="sectionLabel">Normal Reading</p>
                          <h4>{stage.title}</h4>
                          <p>
                            {stage.exams.length
                              ? 'สุ่ม 3 ชุดข้อสอบ พร้อมระบุประเภทคำถามในแต่ละชุด'
                              : 'ยังไม่มีข้อสอบในด่านนี้'}
                          </p>
                        </div>
                        <div className="readingStageStatus">
                          <strong>{stage.bestAccuracy}%</strong>
                          <span>
                            {stage.isUnlocked
                              ? stage.bestAccuracy >= NORMAL_READING_UNLOCK_PERCENT
                                ? 'ผ่านแล้ว'
                                : `ต้องได้ ${NORMAL_READING_UNLOCK_PERCENT}%+`
                              : 'ล็อกอยู่'}
                          </span>
                        </div>
                      </div>

                      {!stage.isUnlocked && (
                        <div className="readingStageLockNote">
                          ต้องผ่านด่านก่อนหน้าอย่างน้อย {NORMAL_READING_UNLOCK_PERCENT}% เพื่อปลดล็อกด่านนี้
                        </div>
                      )}

                      <div className="readingStageExamGrid">
                        {stage.exams.map((exam, index) => {
                          const attempt = readingAttemptByExamId[exam.id]
                          const canUseExam = stage.isUnlocked || Boolean(attempt)
                          const isPerfect = attempt?.accuracy === 100
                          return (
                            <article
                              key={exam.id}
                              className={`readingStageExamCard ${canUseExam ? '' : 'is-disabled'} ${isPerfect ? 'is-perfect' : ''}`}
                            >
                              <div className="readingStageExamThumb">
                                <span>{attempt ? `${attempt.accuracy}%` : `ชุด ${index + 1}`}</span>
                                <small>{attempt ? 'คะแนนล่าสุด' : `${exam.parsedPayload?.questionCount || 0} ข้อ`}</small>
                              </div>
                              <div className="readingStageExamBody">
                                <p className="promptPill">{getReadingExamTypeSummary(exam)}</p>
                                <h5>{exam.title}</h5>
                                <p className="meta">
                                  {exam.parsedPayload?.passages?.length || 0} passages · {exam.parsedPayload?.questionCount || 0} questions
                                </p>
                                {attempt && (
                                  <p className="readingStageAttemptMeta">
                                    {attempt.correctCount}/{attempt.totalQuestions} correct · {new Date(attempt.completedAt).toLocaleString()}
                                  </p>
                                )}
                              </div>
                              <div className="readingStageExamActions">
                                {!attempt && (
                                  <button type="button" disabled={!canUseExam} onClick={() => startReadingExam(exam.id)}>
                                    เริ่มทำข้อสอบ
                                  </button>
                                )}
                                {attempt && !isPerfect && (
                                  <>
                                    <button type="button" className="secondary" onClick={() => openReadingReview(exam.id, 'report')}>
                                      ดู report
                                    </button>
                                    <button type="button" disabled={!canUseExam} onClick={() => startReadingExam(exam.id)}>
                                      Redeem
                                    </button>
                                  </>
                                )}
                                {attempt && isPerfect && (
                                  <>
                                    <button type="button" className="secondary" onClick={() => openReadingReview(exam.id, 'report')}>
                                      ดู report
                                    </button>
                                    <button type="button" onClick={() => startReadingExam(exam.id)}>
                                      ทำข้อสอบอีกรอบ
                                    </button>
                                  </>
                                )}
                              </div>
                            </article>
                          )
                        })}
                      </div>
                    </section>
                  ))}
                </div>
              ) : readingEntryCategory === 'advanced' ? (
                <div className="readingStageBoard">
                  {advancedReadingStages.map((stage) => (
                    <section
                      key={`advanced-reading-stage-${stage.number}`}
                      className={`readingStagePanel ${stage.isUnlocked ? 'is-unlocked' : 'is-locked'}`}
                    >
                      <div className="readingStageHeader">
                        <div>
                          <p className="sectionLabel">Advanced Reading</p>
                          <h4>{stage.title}</h4>
                          <p>
                            {stage.exams.length
                              ? 'ด่านนี้มี 2 ชุดข้อสอบระดับยาก ต้องทำให้ได้อย่างน้อย 75% เพื่อปลดล็อกด่านถัดไป'
                              : 'ยังไม่มีข้อสอบในด่านนี้'}
                          </p>
                        </div>
                        <div className="readingStageStatus">
                          <strong>{stage.bestAccuracy}%</strong>
                          <span>
                            {stage.isUnlocked
                              ? stage.bestAccuracy >= ADVANCED_READING_UNLOCK_PERCENT
                                ? 'ผ่านแล้ว'
                                : `ต้องได้ ${ADVANCED_READING_UNLOCK_PERCENT}%+`
                              : 'ล็อกอยู่'}
                          </span>
                        </div>
                      </div>

                      {!stage.isUnlocked && (
                        <div className="readingStageLockNote">
                          ต้องผ่านด่านก่อนหน้าอย่างน้อย {ADVANCED_READING_UNLOCK_PERCENT}% เพื่อปลดล็อกด่านนี้
                        </div>
                      )}

                      <div className="readingStageExamGrid">
                        {stage.exams.map((exam, index) => {
                          const attempt = readingAttemptByExamId[exam.id]
                          const canUseExam = stage.isUnlocked || Boolean(attempt)
                          const isPerfect = attempt?.accuracy === 100
                          return (
                            <article
                              key={exam.id}
                              className={`readingStageExamCard ${canUseExam ? '' : 'is-disabled'} ${isPerfect ? 'is-perfect' : ''}`}
                            >
                              <div className="readingStageExamThumb">
                                <span>{attempt ? `${attempt.accuracy}%` : `ชุด ${index + 1}`}</span>
                                <small>{attempt ? 'คะแนนล่าสุด' : `${exam.parsedPayload?.questionCount || 0} ข้อ`}</small>
                              </div>
                              <div className="readingStageExamBody">
                                <p className="promptPill">{getReadingExamTypeSummary(exam)}</p>
                                <h5>{exam.title}</h5>
                                <p className="meta">
                                  {exam.parsedPayload?.passages?.length || 0} passages · {exam.parsedPayload?.questionCount || 0} questions
                                </p>
                                {attempt && (
                                  <p className="readingStageAttemptMeta">
                                    {attempt.correctCount}/{attempt.totalQuestions} correct · {new Date(attempt.completedAt).toLocaleString()}
                                  </p>
                                )}
                              </div>
                              <div className="readingStageExamActions">
                                {!attempt && (
                                  <button type="button" disabled={!canUseExam} onClick={() => startReadingExam(exam.id)}>
                                    เริ่มทำข้อสอบ
                                  </button>
                                )}
                                {attempt && !isPerfect && (
                                  <>
                                    <button type="button" className="secondary" onClick={() => openReadingReview(exam.id, 'report')}>
                                      ดู report
                                    </button>
                                    <button type="button" disabled={!canUseExam} onClick={() => startReadingExam(exam.id)}>
                                      Redeem
                                    </button>
                                  </>
                                )}
                                {attempt && isPerfect && (
                                  <>
                                    <button type="button" className="secondary" onClick={() => openReadingReview(exam.id, 'report')}>
                                      ดู report
                                    </button>
                                    <button type="button" onClick={() => startReadingExam(exam.id)}>
                                      ทำข้อสอบอีกรอบ
                                    </button>
                                  </>
                                )}
                              </div>
                            </article>
                          )
                        })}
                      </div>
                    </section>
                  ))}
                </div>
              ) : (
                <div className="readingBankGrid">
                  {filteredReadingExams.map((exam) => {
                    const exerciseMeta = getReadingExerciseMeta(exam.id)
                    return (
                    <article key={exam.id} className="readingBankCard">
                      <p className="promptPill">{exerciseMeta?.label || READING_CATEGORY_LABELS[exam.category]}</p>
                      <h3>{exam.title}</h3>
                      <p className="meta">
                        {exam.parsedPayload?.passages?.length || 0} passages · {exam.parsedPayload?.questionCount || 0} questions
                      </p>
                      {exerciseMeta && (
                        <div className="readingExerciseMeta">
                          <span>{exerciseMeta.summary}</span>
                          <span>{exerciseMeta.level}</span>
                          <span>{exerciseMeta.duration}</span>
                        </div>
                      )}
                      {readingAttemptByExamId[exam.id] && (
                        <div className="adminWorkflowCard">
                          <p className="sectionLabel">Latest Score</p>
                          <strong>
                            {readingAttemptByExamId[exam.id].correctCount}/{readingAttemptByExamId[exam.id].totalQuestions} ({readingAttemptByExamId[exam.id].accuracy}%)
                          </strong>
                          <p className="meta">
                            {readingAttemptByExamId[exam.id].wrongCount} wrong · {new Date(readingAttemptByExamId[exam.id].completedAt).toLocaleString()}
                          </p>
                        </div>
                      )}
                      <div className="controls">
                        <button type="button" onClick={() => startReadingExam(exam.id)}>
                          {readingAttemptByExamId[exam.id] ? 'Retry Exam' : 'Open Exam'}
                        </button>
                        {readingAttemptByExamId[exam.id] && (
                          <button type="button" className="secondary" onClick={() => openReadingReview(exam.id, 'report')}>
                            ดู report
                          </button>
                        )}
                      </div>
                    </article>
                  )})}
                </div>
              )}
            </div>
          )}

          {readingWorkspaceMode === 'pdoy' && (
            <>
              {!activeReadingPdoyLesson || !activeReadingPdoyExam || !activeReadingPdoyPassage || !activeReadingPdoyQuestion ? (
                <div className="emptyNotebook">
                  <p>ยังไม่มีบทเรียน Reading with P'Doy ที่รองรับในชุดนี้</p>
                  <p>ตอนนี้เริ่มได้จากข้อเติมคำ, TRUE / FALSE / NOT GIVEN, YES / NO / NOT GIVEN และ Multiple Choice แบบคำตอบเดียวก่อนครับ</p>
                </div>
              ) : !readingPdoySessionActive ? (
                <div className="readingPdoyBank">
                  <div className="readingSummaryStrip">
                    <article className="readingSummaryCard">
                      <p className="sectionLabel">ตอนนี้รองรับ</p>
                      <strong>{readingPdoySupportedQuestionCount}</strong>
                      <span>คำถามแบบโค้ชทีละขั้น</span>
                    </article>
                    <article className="readingSummaryCard">
                      <p className="sectionLabel">วิธีเรียน</p>
                      <strong>ทำไปพร้อมกัน</strong>
                      <span>หา evidence, เทียบความหมาย, แล้วค่อยตอบ</span>
                    </article>
                    <article className="readingSummaryCard">
                      <p className="sectionLabel">ลำดับถัดไป</p>
                      <strong>Fill / Matching</strong>
                      <span>เดี๋ยวจะต่อด้วย flow โค้ชแบบเดียวกัน</span>
                    </article>
                  </div>

                  <div className="readingBankGrid">
                    {readingPdoyLessons.map((lesson) => {
                      const exerciseMeta = getReadingExerciseMeta(lesson.examId)
                      return (
                      <article key={lesson.id} className="readingBankCard">
                        <p className="sectionLabel">Reading with P'Doy</p>
                        <h3>{lesson.examTitle}</h3>
                        <p className="meta">
                          Passage {lesson.passageNumber}: {lesson.passageTitle}
                        </p>
                        <p className="meta">{READING_PDOY_LESSON_LABELS[lesson.lessonType]} · {lesson.questions.length} ข้อ</p>
                        {exerciseMeta && (
                          <div className="readingExerciseMeta">
                            <span>{exerciseMeta.label}</span>
                            <span>{exerciseMeta.level}</span>
                            <span>{exerciseMeta.duration}</span>
                          </div>
                        )}
                        <button type="button" className="readingActionBtn readingActionBtn-primary" onClick={() => startReadingPdoyLesson(lesson.id)}>
                          เริ่มบทเรียนนี้
                        </button>
                      </article>
                    )})}
                  </div>
                </div>
              ) : (
                <div className="readingPdoyLessonWrap">
                  <div className="readingAttemptToolbar">
                    <div>
                      <p className="sectionLabel">Reading with P'Doy</p>
                      <h3>{activeReadingPdoyExam.title}</h3>
                      <p className="meta">
                        {READING_PDOY_LESSON_LABELS[activeReadingPdoyLesson.lessonType]} · ข้อจริง {activeReadingPdoyQuestion.number} · ด่าน {readingPdoyQuestionIndex + 1}/{activeReadingPdoyLesson.questions.length}
                      </p>
                    </div>
                    <div className="readingPdoyGameHud" aria-label="Reading with P'Doy progress">
                      <div className="readingPdoyGameHudTop">
                        <strong>ด่าน {readingPdoyQuestionIndex + 1}/{activeReadingPdoyLesson.questions.length}</strong>
                        <span>
                          {readingPdoyStep === 'intro'
                            ? 'เริ่มจับทาง'
                            : readingPdoyStep === 'evidence'
                              ? 'หา evidence'
                              : readingPdoyStep === 'decide'
                                ? 'ตัดสินคำตอบ'
                                : readingPdoyStep === 'result'
                                  ? 'สรุปเหตุผล'
                                  : 'จบบทเรียน'}
                        </span>
                      </div>
                      <div className="readingPdoyGameMeter" aria-hidden="true">
                        <span
                          style={{
                            width: `${Math.max(
                              ((readingPdoyQuestionIndex +
                                (readingPdoyStep === 'complete'
                                  ? 1
                                  : readingPdoyStep === 'result'
                                    ? 0.96
                                    : readingPdoyStep === 'decide'
                                      ? 0.82
                                      : readingPdoyStep === 'evidence'
                                        ? 0.56
                                        : 0.26)) /
                                Math.max(activeReadingPdoyLesson.questions.length, 1)) *
                                100,
                              8
                            )}%`
                          }}
                        />
                      </div>
                      <p className="meta">ออกเมื่อไรก็ได้ ระบบจำความคืบหน้าให้</p>
                    </div>
                    <div className="controls">
                      <button
                        type="button"
                        className="readingActionBtn readingActionBtn-secondary"
                        onClick={() => {
                          setReadingPdoySessionActive(false)
                          setReadingPdoyStep('intro')
                          setReadingPdoyFeedback('')
                        }}
                      >
                        กลับไปเลือกบทเรียน
                      </button>
                    </div>
                  </div>

                  <div className="readingExamLayout readingExamLayout-pdoy">
                    <section className="readingPassagePanel readingPassagePanel-pdoy readingPassagePanel-pdoyTutorial" ref={readingPassagePanelRef}>
                      <div className="readingPassageHeader">
                        <div>
                          <p className="sectionLabel">Passage {activeReadingPdoyPassage.number}</p>
                          <h3>{activeReadingPdoyPassage.title}</h3>
                        </div>
                        <div className="readingHintBox">
                          <strong>P'Doy focus:</strong> ดูความหมายเป็นหลัก ไม่ใช่จับแค่ keyword
                        </div>
                      </div>

                      <div className="readingPassageBody" ref={readingPassageBodyRef}>
                        {activeReadingPdoyPassage.bodyParagraphs.map((paragraph, index) => (
                          <div
                            key={`pdoy-paragraph-${index}`}
                            className={`readingCoachParagraphWrap ${
                              activeReadingPdoyFillHotspots.some((spot) => spot.paragraphIndex === index) ? 'has-hotspot' : ''
                            }`}
                          >
                            {activeReadingPdoyFillHotspots
                              .filter((spot) => spot.paragraphIndex === index)
                              .map((spot, hotspotIndex) => (
                                <button
                                  key={`${spot.id}-${hotspotIndex}`}
                                  type="button"
                                  className={`readingPassageHotspot ${readingPdoyEvidenceInput === spot.id ? 'active' : ''} ${
                                    activeReadingPdoyLesson?.lessonType === 'fill-in-the-blank' && readingPdoyStep === 'evidence'
                                      ? 'is-clickable'
                                      : ''
                                  }`}
                                  onClick={() => {
                                    if (activeReadingPdoyLesson?.lessonType !== 'fill-in-the-blank' || readingPdoyStep !== 'evidence') return
                                    setReadingPdoyEvidenceInput(spot.id)
                                    setReadingPdoyFeedback('')
                                  }}
                                  disabled={!(activeReadingPdoyLesson?.lessonType === 'fill-in-the-blank' && readingPdoyStep === 'evidence')}
                                >
                                  จุดเลือก portion {hotspotIndex + 1}
                                </button>
                              ))}
                            <p
                              className={
                                index === activeReadingPdoyFocusParagraphIndex
                                  ? `readingCoachParagraph ${['evidence', 'decide', 'result'].includes(readingPdoyStep) ? 'is-active' : ''}`
                                  : ''
                              }
                              ref={(node) => {
                                if (index === activeReadingPdoyFocusParagraphIndex) {
                                  readingCoachParagraphRef.current = node
                                }
                              }}
                            >
                              {renderPassageParagraphWithHighlights(paragraph, activeReadingPdoyPassage.number, activeReadingPdoyQuestion.exactPortion)}
                            </p>
                          </div>
                        ))}
                      </div>

                    </section>

                    <aside className="readingQuestionsPanel readingQuestionsPanel-pdoyTutorial">
                      <div className={`readingPdoyGuideFloat readingPdoyGuideFloat-${readingPdoyStep}`}>
                        <span>{activeReadingPdoyGuideCopy.badge}</span>
                        <strong>{activeReadingPdoyGuideCopy.title}</strong>
                        <p>{activeReadingPdoyGuideCopy.detail}</p>
                      </div>
                      <div className={`readingPdoyCoachCard ${activeReadingPdoyCoachFloatClass}`}>
                          <div className="readingQuestionsHeader readingQuestionsHeader-overlay">
                            <div>
                              <p className="sectionLabel">Coach Flow</p>
                              <h3>มาทำข้อนี้ไปด้วยกัน</h3>
                            </div>
                            <span className="bandPill">{READING_PDOY_LESSON_LABELS[activeReadingPdoyLesson.lessonType]}</span>
                          </div>
                        <p className="readingQuestionNumber">Question {activeReadingPdoyQuestion.number}</p>
                        <p className="readingQuestionPrompt">{activeReadingPdoyQuestion.prompt}</p>

                        {readingPdoyStep === 'intro' && (
                          <div
                            key={`pdoy-stage-${readingPdoyStep}-${activeReadingPdoyQuestion.number}`}
                            ref={readingPdoyStagePanelRef}
                            className={`readingPdoyStagePanel readingPdoyStagePanel-${readingPdoyStep}`}
                          >
                            <p className="meta">
                              {activeReadingPdoyLesson.lessonType === 'fill-in-the-blank'
                                ? 'Step 1: ดู grammar cue ก่อนครับ ตรง blank นี้คำตอบมีโอกาสเป็นคำชนิดไหนมากที่สุด?'
                                : 'ก่อนตอบ เราควรเริ่มยังไงก่อนสำหรับคำถามแบบนี้?'}
                            </p>
                            {activeReadingPdoyLesson.lessonType === 'fill-in-the-blank' && (
                              <div className="readingParaphraseCard">
                                <p className="sectionLabel">Grammar cue</p>
                                <p>{getReadingFillGrammarHint(activeReadingPdoyQuestion)}</p>
                              </div>
                            )}
                            <div className="readingPdoyChoiceGrid">
                              {(activeReadingPdoyLesson.lessonType === 'multiple-choice'
                                ? [
                                    'อ่าน passage ก่อน แล้วค่อยหาส่วนที่ตรงกับโจทย์ ก่อนกลับมาเทียบตัวเลือก',
                                    'อ่าน choices ก่อน แล้วไล่หา keyword แค่คำเดียว',
                                    'อ่านเฉพาะย่อหน้าที่คิดว่าใช่ แล้วไม่ต้องดูย่อหน้าข้าง ๆ'
                                  ]
                                : activeReadingPdoyLesson.lessonType === 'fill-in-the-blank'
                                  ? activeReadingPdoyFillGrammarOptions.map((option) => option.label)
                                : [
                                    'อ่าน statement ก่อน แล้วค่อยหาส่วนที่ตรงใน passage เพื่อเทียบความหมาย',
                                    'อ่านแต่ตัวเลือกก่อน แล้วเดาจาก keyword',
                                    'ไม่ต้องอ่าน passage ก็ตอบจากความรู้ทั่วไปได้เลย'
                                  ]).map((option) => (
                                <button
                                  key={option}
                                  type="button"
                                  className={readingPdoyIntroChoice === option ? 'active' : ''}
                                  onClick={() => setReadingPdoyIntroChoice(option)}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                            {readingPdoyFeedback && (
                              <div className="readingPdoyInlineCoach">
                                <p>{readingPdoyFeedback}</p>
                                <div className="controls">
                                  <button
                                    type="button"
                                    className="readingActionBtn readingActionBtn-secondary"
                                    onClick={() => {
                                      setReadingPdoyIntroChoice('')
                                      setReadingPdoyFeedback('')
                                    }}
                                  >
                                    ลองเลือกใหม่
                                  </button>
                                  <button
                                    type="button"
                                    className="readingActionBtn readingActionBtn-primary"
                                    onClick={useReadingPdoyCorrectIntro}
                                  >
                                    พาไปวิธีที่ถูกต้อง
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {readingPdoyStep === 'evidence' && activeReadingPdoyClue && (
                          <div
                            key={`pdoy-stage-${readingPdoyStep}-${activeReadingPdoyQuestion.number}`}
                            ref={readingPdoyStagePanelRef}
                            className={`readingPdoyStagePanel readingPdoyStagePanel-${readingPdoyStep}`}
                          >
                            {activeReadingPdoyVocabSupport && (
                              <div className="readingParaphraseCard">
                                <p className="sectionLabel">Important vocab / phrase</p>
                                <p><strong>{activeReadingPdoyVocabSupport.quote}</strong></p>
                                <p className="meta">ความหมายไทย: {activeReadingPdoyVocabSupport.meaning}</p>
                                <button
                                  type="button"
                                  className="saveNotebookBtn"
                                  onClick={() =>
                                    savePlanToNotebook({
                                      criterion: "Reading with P'Doy vocab",
                                      quote: `Q${activeReadingPdoyQuestion.number}: ${activeReadingPdoyVocabSupport.quote}`,
                                      fix: activeReadingPdoyVocabSupport.notebookFix,
                                      thaiMeaning: activeReadingPdoyVocabSupport.meaning,
                                      preferredSection: 'reading',
                                      successNotice: 'Added to notebook'
                                    })
                                  }
                                >
                                  บันทึกคำนี้ลง notebook
                                </button>
                              </div>
                            )}
                            <div className="readingParaphraseCard">
                              <p className="sectionLabel">Clue จากโจทย์</p>
                              <p><strong>&quot;{activeReadingPdoyClue.clue}&quot;</strong></p>
                              {activeReadingPdoyHintUnlocked ? (
                                <>
                                  <p className="meta">คำอธิบายไทย: {activeReadingPdoyClue.thaiHelper}</p>
                                  <button
                                    type="button"
                                    className="saveNotebookBtn"
                                    onClick={() =>
                                      savePlanToNotebook({
                                        criterion: "Reading with P'Doy clue",
                                        quote: `Q${activeReadingPdoyQuestion.number}: ${activeReadingPdoyClue.clue}`,
                                        fix: activeReadingPdoyQuestion.paraphrasedVocabulary || activeReadingPdoyQuestion.exactPortion,
                                        thaiMeaning: activeReadingPdoyClue.thaiHelper,
                                        preferredSection: 'reading',
                                        successNotice: 'Added to notebook'
                                      })
                                    }
                                  >
                                    บันทึก clue ลง notebook
                                  </button>
                                </>
                              ) : (
                                <p className="meta">ถ้ายังไม่แน่ใจ ลองตอบดูก่อนได้ครับ ถ้าพลาดครั้งแรกพี่จะปล่อย hint ไทยเพิ่มให้</p>
                              )}
                            </div>
                            <p className="meta">
                              {activeReadingPdoyLesson.lessonType === 'multiple-choice'
                                ? 'หาโซนที่ paraphrase กันให้เจอก่อน อย่าอ่านแค่ย่อหน้าเดียว ต้องดูย่อหน้าข้าง ๆ และดูคำเชื่อมอย่าง however, but, instead, in fact ด้วย'
                                : activeReadingPdoyLesson.lessonType === 'fill-in-the-blank'
                                  ? 'Step 2: ไปคลิก 1 ใน 3 จุด highlight ใน passage ด้านซ้ายครับ เลือก portion ที่น่าจะใช้ตอบข้อนี้ที่สุดก่อน โดยยังไม่เฉลยถูกผิด'
                                : 'เห็นคำหรือวลีที่ความหมายเท่ากันในส่วนที่ซูมไว้ไหม? เลือกวลีจาก passage ที่ตรงที่สุด'}
                            </p>
                            {activeReadingPdoyLesson.lessonType !== 'fill-in-the-blank' ? (
                              <div className="readingPdoyChoiceGrid">
                                {activeReadingPdoyEvidenceOptions.map((option) => (
                                  <button
                                    key={option.id}
                                    type="button"
                                    className={`readingPdoyOptionBtn ${readingPdoyEvidenceInput === option.id ? 'active' : ''}`}
                                    onClick={() => setReadingPdoyEvidenceInput(option.id)}
                                  >
                                    {option.text}
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <div className="readingPdoySoftPopup">
                                {readingPdoyEvidenceInput
                                  ? 'เลือก hotspot ใน passage แล้วครับ กดปุ่มด้านล่างเพื่อไปจับคำ paraphrase ต่อได้เลย'
                                  : 'มองไปที่ passage ด้านซ้ายครับ จะมี 3 จุด highlight ให้เลือกโดยตรงในเนื้อหา'}
                              </div>
                            )}
                          </div>
                        )}

                        {readingPdoyStep === 'decide' && (
                          <div
                            key={`pdoy-stage-${readingPdoyStep}-${activeReadingPdoyQuestion.number}`}
                            ref={readingPdoyStagePanelRef}
                            className={`readingPdoyStagePanel readingPdoyStagePanel-${readingPdoyStep}`}
                          >
                            {activeReadingPdoyLesson.lessonType === 'multiple-choice' ? (
                              <>
                                <p className="meta">
                                  {activeReadingPdoyIsMatchingQuestion
                                    ? 'ตอนนี้เลือก heading / paragraph ที่ evidence นี้พิสูจน์ได้จริง ระวังตัวหลอกที่มี keyword เหมือนโจทย์แต่ใจความคนละเรื่อง'
                                    : 'ตอนนี้เลือกตัวเลือกที่ดีที่สุด แต่ก่อนจะเฉลยถูกผิด ลองพิมพ์ให้ดูว่า option นี้เชื่อมกับ passage ตรงไหน'}
                                </p>
                                {activeReadingPdoyOptions.length > 0 ? (
                                  <div className="readingPdoyChoiceGrid">
                                    {activeReadingPdoyOptions.map((option) => (
                                      <button
                                        key={option.letter}
                                        type="button"
                                        className={`readingPdoyOptionBtn ${readingPdoySelectedOption === option.letter ? 'active' : ''}`}
                                        onClick={() => {
                                          setReadingPdoySelectedOption(option.letter)
                                          setReadingPdoyOptionParaphraseInput('')
                                          setReadingPdoyFeedback('')
                                        }}
                                      >
                                        <strong>{option.letter}</strong> {option.text}
                                      </button>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="readingPdoySoftPopup">
                                    ระบบยังดึง option block ของข้อนี้ออกมาได้ไม่สมบูรณ์ เลยยังโค้ชแบบทีละขั้นสำหรับข้อนี้ไม่ได้ครับ
                                  </div>
                                )}
                                {activeReadingPdoySelectedOptionRecord && !activeReadingPdoyIsMatchingQuestion && (
                                  <div className="readingParaphraseCard">
                                    <p className="sectionLabel">เช็ก paraphrase ของ option {activeReadingPdoySelectedOptionRecord.letter}</p>
                                    <p>ใน option นี้ ส่วนไหนที่ตรงกับ quoted evidence ใน passage?</p>
                                    <div className="readingAnswerField">
                                      <input
                                        type="text"
                                        value={readingPdoyOptionParaphraseInput}
                                        onChange={(event) => setReadingPdoyOptionParaphraseInput(event.target.value)}
                                        placeholder="พิมพ์ส่วนของ option ที่ตรงกับ passage"
                                      />
                                    </div>
                                  </div>
                                )}
                              </>
                            ) : activeReadingPdoyLesson.lessonType === 'fill-in-the-blank' ? (
                              <>
                                <div className="readingParaphraseCard">
                                  <p className="sectionLabel">Step 3: จับคำพาราฟเรส</p>
                                  <p>
                                    คำสำคัญในโจทย์คือ <strong>&quot;{activeReadingPdoyFillWordTarget?.important || activeReadingPdoyClue?.clue}&quot;</strong>
                                    {activeReadingPdoyFillWordTarget?.importantThai
                                      ? ` = ${activeReadingPdoyFillWordTarget.importantThai}`
                                      : ''}
                                  </p>
                                  <p className="meta">
                                    ใน portion ที่เลือกมา คำหรือวลีไหนความหมายตรงกับ clue นี้? กดดูความหมายได้ก่อนแล้วค่อยเลือกครับ
                                  </p>
                                </div>
                                <div className="readingPdoyChoiceGrid">
                                  {activeReadingPdoyFillWordMatchOptions.map((option) => (
                                    <div
                                      key={option.id}
                                      className={`readingPdoyOptionCard ${readingPdoySelectedOption === option.id ? 'active' : ''}`}
                                    >
                                      <button
                                        type="button"
                                        className={`readingPdoyOptionBtn ${readingPdoySelectedOption === option.id ? 'active' : ''}`}
                                        onClick={() => {
                                          setReadingPdoySelectedOption(option.id)
                                          setReadingPdoyFeedback('')
                                        }}
                                      >
                                        {option.text}
                                      </button>
                                      <button
                                        type="button"
                                        className="readingOptionMeaningBtn"
                                        onClick={() =>
                                          setReadingPdoyFillMeaningOptionId((current) => current === option.id ? '' : option.id)
                                        }
                                      >
                                        ดูความหมาย
                                      </button>
                                      {readingPdoyFillMeaningOptionId === option.id && option.meaning && (
                                        <p className="readingOptionMeaningText">{option.meaning}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </>
                            ) : (
                              <>
                                <p className="meta">อ่านอีกที แล้วตัดสินว่า statement นี้ตรงกัน ขัดกัน หรือไม่ได้บอกไว้</p>
                                <div className="readingPdoyChoiceGrid readingPdoyChoiceGrid-compact">
                                  {(activeReadingPdoyLesson.lessonType === 'true-false-not-given'
                                    ? ['TRUE', 'FALSE', 'NOT GIVEN']
                                    : ['YES', 'NO', 'NOT GIVEN']).map((option) => (
                                    <button
                                      key={option}
                                      type="button"
                                      className={`readingPdoyOptionBtn ${readingPdoyDecision === option ? 'active' : ''}`}
                                      onClick={() => setReadingPdoyDecision(option)}
                                    >
                                      {option}
                                    </button>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        )}

                        {readingPdoyStep === 'result' && (
                          <div
                            key={`pdoy-stage-${readingPdoyStep}-${activeReadingPdoyQuestion.number}`}
                            ref={readingPdoyStagePanelRef}
                            className={`readingPdoyStagePanel readingPdoyStagePanel-${readingPdoyStep}`}
                          >
                            <div className="readingReportEvidence">
                              <h4>ทำไมคำตอบนี้ถึงถูก?</h4>
                              <p>{activeReadingPdoyQuestion.explanationThai}</p>
                              <blockquote>{activeReadingPdoyQuestion.exactPortion}</blockquote>
                            </div>
                          </div>
                        )}

                        {readingPdoyStep === 'complete' && (
                          <div
                            key={`pdoy-stage-${readingPdoyStep}-${activeReadingPdoyQuestion.number}`}
                            ref={readingPdoyStagePanelRef}
                            className={`readingPdoyStagePanel readingPdoyStagePanel-${readingPdoyStep}`}
                          >
                            <div className="readingReportEvidence">
                              <h4>จบบทเรียนแล้ว</h4>
                              <p>{readingPdoyFeedback}</p>
                              <blockquote>คุณทำ flow โค้ชสำหรับคำถามประเภทนี้ครบแล้วครับ</blockquote>
                            </div>
                            <div className="controls">
                              <button type="button" className="readingActionBtn readingActionBtn-primary" onClick={() => startReadingPdoyLesson(activeReadingPdoyLesson.id)}>
                                เริ่มบทเรียนนี้ใหม่
                              </button>
                              <button
                                type="button"
                                className="readingActionBtn readingActionBtn-secondary"
                                onClick={() => {
                                  setReadingPdoySessionActive(false)
                                  setReadingPdoyStep('intro')
                                  setReadingPdoyFeedback('')
                                }}
                              >
                                กลับไปหน้าบทเรียน
                              </button>
                            </div>
                          </div>
                        )}

                        {readingPdoyFeedback && readingPdoyStep !== 'intro' && (
                          <div className={`readingPdoySoftPopup ${readingPdoyStep === 'result' ? 'is-success' : ''}`}>
                            {readingPdoyFeedback}
                          </div>
                        )}
                        {activeReadingPdoyPrimaryAction && (
                          <div className="readingPdoyActionDock">
                            <button
                              type="button"
                              className={`readingActionBtn ${activeReadingPdoyPrimaryAction.tone === 'success' ? 'readingActionBtn-success' : 'readingActionBtn-primary'}`}
                              onClick={activeReadingPdoyPrimaryAction.onClick}
                              disabled={activeReadingPdoyPrimaryAction.disabled}
                            >
                              {activeReadingPdoyPrimaryAction.label}
                            </button>
                          </div>
                        )}
                      </div>
                    </aside>
                  </div>
                </div>
              )}
            </>
          )}

          {readingWorkspaceMode === 'bank' && readingAttemptStage === 'exam' && activeReadingExam && activeReadingPassage && (
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

              <div className="readingExamLayout readingExamLayout-bank">
                <section className="readingPassagePanel readingPassagePanel-exam">
                  <div className="readingPassageHeader">
                    <div>
                      <p className="sectionLabel">Passage {activeReadingPassage.number}</p>
                      <h3>{activeReadingPassage.title}</h3>
                    </div>
                    {activeReadingHint?.exactPortion && (
                      <div className="readingHintBox">
                        <strong>Hint active:</strong> highlighted in the passage
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
                          activeReadingHint &&
                            activeReadingQuestions.some((question) => question.number === activeReadingHint.number)
                            ? activeReadingHintNeedles
                            : ''
                        )}
                      </p>
                    ))}
                  </div>
                </section>

                <section className="readingQuestionsPanel readingQuestionsPanel-exam">
                  <div className="readingQuestionsHeader">
                    <div>
                      <p className="sectionLabel">Questions</p>
                      <h3>Answer below — scroll this panel for more questions</h3>
                    </div>
                    <span className="bandPill">{activeReadingQuestions.length} questions</span>
                  </div>

                  <div className="readingQuestionsScroll">
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
                    {activeReadingQuestions.map((question) => {
                      const matchingGroup = activeReadingMatchingGroupByQuestionNumber.get(question.number)
                      if (matchingGroup) {
                        return matchingGroup.questions[0]?.number === question.number
                          ? renderReadingMatchingGroup(matchingGroup)
                          : null
                      }
                      const fillGroup = activeReadingFillGroupByQuestionNumber.get(question.number)
                      if (fillGroup) {
                        return fillGroup.questions[0]?.number === question.number
                          ? renderReadingFillQuestionGroup(fillGroup)
                          : null
                      }
                      const isHinting = readingHintQuestionNumber === question.number
                      const isNotGivenQuestion =
                        isReadingJudgementQuestion(question) &&
                        isReadingNotGivenAnswer(question.correctAnswer)
                      return (
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
                              {isHinting ? 'ซ่อนคำใบ้' : 'ดูคำใบ้'}
                            </button>
                          </div>
                          {isHinting && isNotGivenQuestion && (
                            <div className="readingHintBox">
                              <strong>Hint:</strong> the related passage portion is highlighted on the left — it mentions the topic but does not confirm TRUE/FALSE (or YES/NO).
                            </div>
                          )}
                          {isHinting && !isNotGivenQuestion && (
                            <div className="readingHintBox">
                              <strong>Hint:</strong> evidence highlighted in the passage.
                            </div>
                          )}
                          <div className="readingAnswerField">
                            {renderReadingAnswerField(question, activeReadingPassage)}
                          </div>
                        </article>
                      )
                    })}
                  </div>
                  </div>

                  <div className="readingExamSubmitBar">
                    <button type="button" className="readingSubmitExamBtn readingSubmitExamBtn-end" onClick={submitReadingExam}>
                      Submit Reading Exam
                    </button>
                  </div>
                </section>
              </div>
            </div>
          )}

          {readingWorkspaceMode === 'bank' && (readingAttemptStage === 'report' || readingAttemptStage === 'review') && activeReadingExam && (
            <div className="readingReportWrap">
              <div className="readingAttemptToolbar">
                <div>
                  <p className="sectionLabel">{READING_CATEGORY_LABELS[activeReadingExam.category]}</p>
                  <h3>{activeReadingExam.title} {readingAttemptStage === 'review' ? 'Mistake Review' : 'Report'}</h3>
                  <p className="meta">
                    Score: {readingReportItems.filter((item) => item.isCorrect).length}/{readingReportItems.length}
                  </p>
                </div>
                <div className="controls">
                  <button type="button" className="secondary" onClick={() => setReadingAttemptStage('bank')}>
                    Back to Bank
                  </button>
                  <button type="button" className="secondary" onClick={exportReadingReportPdf}>
                    Export PDF
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
                  <strong>{visibleReadingReportItems.find((item) => !item.isCorrect)?.number ? `Q${visibleReadingReportItems.find((item) => !item.isCorrect)?.number}` : 'Strong set'}</strong>
                  <span>{readingAttemptStage === 'review' ? 'only wrong answers are shown here' : 'start with the first wrong answer'}</span>
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

              {notebookSaveNotice && (
                <div className="notebookSaveToast" role="status" aria-live="polite">
                  <span className="notebookSaveToastSparkle" aria-hidden="true">
                    ✦
                  </span>
                  <div>
                    <p className="notebookSaveToastTitle">
                      {notebookSaveNotice.includes('#reading') ? 'Added to notebook' : 'Added to notebook'}
                    </p>
                    <p className="notebookSaveToastText">
                      {notebookSaveNotice.includes('#reading') ? 'Saved in #reading with your vocab notes.' : 'Saved in your Reading notebook.'}
                    </p>
                  </div>
                </div>
              )}

              {readingAttemptStage === 'review' && visibleReadingReportItems.length === 0 && (
                <div className="emptyNotebook">
                  <p>No mistakes in the latest attempt for this exam.</p>
                  <p>You can still retry the test if you want a fresh timed run.</p>
                </div>
              )}

              <div className="readingReportList">
                {visibleReadingReportItems.map((item) => {
                  const vocabSupport = buildReadingVocabSupport(item, pickReadingPdoyQuestionClue(item))
                  const paraphraseEquation = buildReadingParaphraseEquation(item, vocabSupport)
                  const reportPassage =
                    activeReadingPassages.find((passage) =>
                      passage.questions.some((question) => question.number === item.number)
                    ) || null
                  const reportEvidenceExcerpt = getReadingQuestionHintExcerpt(reportPassage, item)
                  const isNotGivenReport =
                    isReadingJudgementQuestion(item) && isReadingNotGivenAnswer(item.correctAnswer)
                  const reportBlockquote = reportEvidenceExcerpt || item.exactPortion
                  return (
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
                        {paraphraseEquation && (
                          <div className="listeningBuilderExamWordCheck">
                            <p>Do you know this word?</p>
                            <div className="listeningBuilderExamWordEquation">
                              <span>{paraphraseEquation.passageKeyword}</span>
                              <b>=</b>
                              <span>{paraphraseEquation.questionKeyword}</span>
                              <b>=</b>
                              <span>{paraphraseEquation.thaiMeaning}</span>
                            </div>
                          </div>
                        )}
                        <p>{item.explanationThai}</p>
                        {isNotGivenReport && (
                          <p className="meta">Related portion (topic + question words, but not TRUE/FALSE or YES/NO):</p>
                        )}
                        <blockquote>{reportBlockquote}</blockquote>
                      </div>
                      {(item.paraphrasedVocabulary || vocabSupport || paraphraseEquation) && (
                        <div className="readingParaphraseCard">
                          <p className="sectionLabel">Important vocab / phrase</p>
                          {item.paraphrasedVocabulary && <p>{item.paraphrasedVocabulary}</p>}
                          {vocabSupport?.meaning && <p className="meta">TH: {vocabSupport.meaning}</p>}
                          <ParaphraseBridgeActions
                            onKnewIt={showPracticeKnewItToast}
                            onSaveToNotebook={() =>
                              handlePracticeSaveToNotebook(() =>
                                savePlanToNotebook({
                                  criterion: 'Reading Paraphrase',
                                  quote: `Q${item.number}: ${item.prompt}`,
                                  fix: item.paraphrasedVocabulary || vocabSupport?.notebookFix || item.correctAnswer,
                                  thaiMeaning: paraphraseEquation?.thaiMeaning || vocabSupport?.meaning || item.explanationThai,
                                  preferredSection: 'reading',
                                  successNotice: 'Added to notebook'
                                })
                              )
                            }
                          />
                        </div>
                    )}
                    </article>
                  )
                })}
              </div>
            </div>
          )}
        </section>
      ) : activePage === 'admin' ? (
          <section className="adminPanelPage" data-admin-section={adminWorkspaceSection}>
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
              <aside className="adminNavRail" aria-label="Admin navigation">
                <p className="sectionLabel">Admin Menu</p>
                <div className="adminNavList">
                  {ADMIN_WORKSPACE_SECTIONS.map((section) => (
                    <button
                      key={section.id}
                      type="button"
                      className={adminWorkspaceSection === section.id ? 'active' : ''}
                      aria-current={adminWorkspaceSection === section.id ? 'page' : undefined}
                      onClick={() => setAdminWorkspaceSection(section.id)}
                    >
                      <span>{section.label}</span>
                      <small>{section.description}</small>
                    </button>
                  ))}
                </div>
              </aside>
              <div className="adminMainColumn">
                <div className="adminWorkspaceWindowHeader">
                  <div>
                    <p className="sectionLabel">Selected Admin Function</p>
                    <h3>{activeAdminWorkspaceSection.label}</h3>
                    <p className="meta">{activeAdminWorkspaceSection.description}</p>
                  </div>
                  <span className="adminWindowStatus">Active Window</span>
                </div>
                <div className="panel adminSectionCard adminOnly-learners">
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
                    <p className="meta">Tip: if Access Until is blank when you grant access, the app will default it to 3 months from the access date.</p>
                  </div>
                </div>

                <div className="panel adminSectionCard adminOnly-learners">
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
                                {learner.status === 'active' ? 'Deactivate' : 'Grant Access'}
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

                <div className="panel adminSectionCard adminOnly-support">
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

                <div className="panel adminSectionCard adminOnly-analytics">
                  <div className="adminSectionHeader">
                    <div>
                      <p className="sectionLabel">Business Analytics</p>
                      <h3>Speaking Usage Cost</h3>
                    </div>
                    <span className="adminInlineStatus">
                      {adminAssessmentReports.length} reports tracked
                    </span>
                  </div>
                  <p className="meta">
                    Every speaking attempt is saved per learner. Track total Gemini spend, tokens, and report volume over time here.
                  </p>
                  <div className="adminAnalyticsGrid">
                    <article className="adminAnalyticsStat">
                      <span>Last 7 days</span>
                      <strong>{formatUsdCost(adminSpeakingWeeklyCostTotal)}</strong>
                      <p>{adminSpeakingWeeklyReportsTotal} reports · {adminSpeakingWeeklyTokenTotal.toLocaleString()} tokens</p>
                    </article>
                    <article className="adminAnalyticsStat">
                      <span>Last 30 days</span>
                      <strong>{formatUsdCost(adminSpeakingMonthlyCostTotal)}</strong>
                      <p>{adminSpeakingMonthlyReportsTotal} reports · {adminSpeakingMonthlyTokenTotal.toLocaleString()} tokens</p>
                    </article>
                    <article className="adminAnalyticsStat">
                      <span>Average / report</span>
                      <strong>
                        {formatUsdCost(
                          adminAssessmentReports.length
                            ? adminAssessmentReports.reduce((sum, report) => sum + Number(report.apiCostUsd || 0), 0) /
                                adminAssessmentReports.length
                            : 0
                        )}
                      </strong>
                      <p>
                        {adminAssessmentReports.length
                          ? Math.round(
                              adminAssessmentReports.reduce((sum, report) => sum + Number(report.totalTokens || 0), 0) /
                                adminAssessmentReports.length
                            ).toLocaleString()
                          : '0'}{' '}
                        avg tokens
                      </p>
                    </article>
                  </div>
                  <div className="adminAnalyticsChartGrid">
                    <article className="adminAnalyticsChartCard">
                      <div className="adminAnalyticsChartHeader">
                        <div>
                          <p className="sectionLabel">Weekly</p>
                          <h4>Cost trend (7 days)</h4>
                        </div>
                        <span className="bandPill">{formatUsdCost(adminSpeakingWeeklyCostTotal)}</span>
                      </div>
                      <svg viewBox="0 0 560 180" className="adminAnalyticsChart" role="img" aria-label="Weekly speaking API cost trend">
                        <path d="M 18 162 H 542" className="adminAnalyticsAxis" />
                        <path d={adminSpeakingWeeklyCostPath} className="adminAnalyticsLine" />
                        {adminSpeakingCostLast7Days.map((item, index) => {
                          const values = adminSpeakingCostLast7Days.map((point) => point.cost)
                          const max = Math.max(...values, 0.000001)
                          const min = Math.min(...values, 0)
                          const ratio = max === min ? 0.5 : (item.cost - min) / (max - min)
                          const x = 18 + (adminSpeakingCostLast7Days.length === 1 ? 0 : (524 / (adminSpeakingCostLast7Days.length - 1)) * index)
                          const y = 162 - ratio * 144
                          return <circle key={`weekly-${item.key}`} cx={x} cy={y} r="4.5" className="adminAnalyticsDot" />
                        })}
                      </svg>
                      <div className="adminAnalyticsLabels">
                        {adminSpeakingCostLast7Days.map((item) => (
                          <span key={`weekly-label-${item.key}`}>{item.label}</span>
                        ))}
                      </div>
                    </article>
                    <article className="adminAnalyticsChartCard">
                      <div className="adminAnalyticsChartHeader">
                        <div>
                          <p className="sectionLabel">Monthly</p>
                          <h4>Cost trend (30 days)</h4>
                        </div>
                        <span className="bandPill">{formatUsdCost(adminSpeakingMonthlyCostTotal)}</span>
                      </div>
                      <svg viewBox="0 0 560 180" className="adminAnalyticsChart" role="img" aria-label="Monthly speaking API cost trend">
                        <path d="M 18 162 H 542" className="adminAnalyticsAxis" />
                        <path d={adminSpeakingMonthlyCostPath} className="adminAnalyticsLine" />
                        {adminSpeakingCostLast30Days.map((item, index) => {
                          const values = adminSpeakingCostLast30Days.map((point) => point.cost)
                          const max = Math.max(...values, 0.000001)
                          const min = Math.min(...values, 0)
                          const ratio = max === min ? 0.5 : (item.cost - min) / (max - min)
                          const x = 18 + (adminSpeakingCostLast30Days.length === 1 ? 0 : (524 / (adminSpeakingCostLast30Days.length - 1)) * index)
                          const y = 162 - ratio * 144
                          return <circle key={`monthly-${item.key}`} cx={x} cy={y} r="3.5" className="adminAnalyticsDot" />
                        })}
                      </svg>
                      <div className="adminAnalyticsLabels adminAnalyticsLabels-dense">
                        {adminSpeakingCostLast30Days
                          .filter((_, index) => index % 4 === 0 || index === adminSpeakingCostLast30Days.length - 1)
                          .map((item) => (
                            <span key={`monthly-label-${item.key}`}>{item.label}</span>
                          ))}
                      </div>
                    </article>
                  </div>
                </div>

                <div className="panel adminSectionCard adminOnly-reports">
                  <div className="adminSectionHeader">
                    <div>
                      <p className="sectionLabel">Speaking Reports</p>
                      <h3>All Learner Attempted Reports</h3>
                    </div>
                    <span className="adminInlineStatus">{adminAssessmentReports.length} saved</span>
                  </div>
                  <p className="meta">
                    Every completed speaking assessment is saved automatically. Open any learner attempt to review the full report in the same report UI.
                  </p>
                  <div className="subscriptionList adminLearnerList">
                    {adminAssessmentReports.length === 0 ? (
                      <p className="meta">No speaking reports have been saved yet.</p>
                    ) : (
                      adminAssessmentReports.map((report) => (
                        <article key={`assessment-report-${report.id}`} className="subscriptionCard adminLearnerCard">
                          <div className="subscriptionTopRow">
                            <div>
                              <h3>{report.learnerName}</h3>
                              <p className="subscriptionEmail">{report.learnerEmail}</p>
                            </div>
                            <div className="adminLearnerBadges">
                              <span className="bandPill">{report.topicCategory}</span>
                              <span className="bandPill">Band {report.overallBand.toFixed(1)}</span>
                            </div>
                          </div>
                          <div className="adminLearnerMetaGrid">
                            <p className="meta">Test: {report.testMode.toUpperCase()}</p>
                            <p className="meta">Topic: {report.topicTitle}</p>
                            <p className="meta">Provider: {report.provider}</p>
                            <p className="meta">Model calls: {report.totalCalls.toLocaleString()}</p>
                            <p className="meta">Saved: {report.createdAt ? new Date(report.createdAt).toLocaleString() : 'Unknown'}</p>
                          </div>
                          <div className="adminActionRow">
                            <button type="button" className="secondary" onClick={() => void openAdminAssessmentReport(report.id)}>
                              Open Full Report
                            </button>
                          </div>
                        </article>
                      ))
                    )}
                  </div>
                </div>

                <div className="panel adminSectionCard adminOnly-reading">
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
                  <div className="adminReadingGeneratorStudio">
                    <div className="adminSectionHeader">
                      <div>
                        <h4>Reading Generator Studio</h4>
                        <p className="meta">
                          Paste up to 4 original passages, choose the IELTS question types for each, then copy the
                          Codex brief. Paste Codex JSON back here for local checks before bulk upload.
                        </p>
                      </div>
                      <span className="bandPill">{activeAdminReadingGeneratorPassages.length}/4 active</span>
                    </div>

                    <div className="adminReadingPassageTabs" role="tablist" aria-label="Source passage slots">
                      {adminReadingGeneratorPassages.map((passage, index) => (
                        <button
                          key={`generator-tab-${passage.id}`}
                          type="button"
                          className={adminReadingGeneratorActiveIndex === index ? 'active' : ''}
                          onClick={() => setAdminReadingGeneratorActiveIndex(index)}
                        >
                          <span>Passage {index + 1}</span>
                          <small>{passage.sourcePassage.trim() ? 'Ready' : 'Empty'}</small>
                        </button>
                      ))}
                    </div>

                    <div className="adminReadingGeneratorGrid">
                      {adminReadingGeneratorPassages
                        .filter((_, index) => index === adminReadingGeneratorActiveIndex)
                        .map((passage) => {
                          const originalIndex = adminReadingGeneratorPassages.findIndex((item) => item.id === passage.id)
                          return (
                        <article key={passage.id} className="adminReadingGeneratorPassageCard">
                          <div className="adminReadingGeneratorCardTop">
                            <div>
                              <p className="adminAudioEyebrow">Source Passage {originalIndex + 1}</p>
                              <h4>{passage.title.trim() || `Passage ${originalIndex + 1}`}</h4>
                            </div>
                            <span className="adminReadingBankBadge">{READING_CATEGORY_LABELS[passage.category]}</span>
                          </div>

                          <div className="adminFormGrid">
                            <label>
                              Working Title
                              <input
                                value={passage.title}
                                onChange={(event) =>
                                  updateAdminReadingGeneratorPassage(passage.id, { title: event.target.value })
                                }
                                placeholder={`Generated Reading Passage ${originalIndex + 1}`}
                              />
                            </label>
                            <label>
                              Bank
                              <select
                                value={passage.category}
                                onChange={(event) =>
                                  updateAdminReadingGeneratorPassage(passage.id, {
                                    category: event.target.value as ReadingBankCategory
                                  })
                                }
                              >
                                {Object.entries(READING_CATEGORY_LABELS).map(([key, label]) => (
                                  <option key={`${passage.id}-${key}`} value={key}>
                                    {label}
                                  </option>
                                ))}
                              </select>
                            </label>
                          </div>

                          <div className="adminFormGrid">
                            <label>
                              New Topic
                              <input
                                value={passage.newTopic}
                                onChange={(event) =>
                                  updateAdminReadingGeneratorPassage(passage.id, { newTopic: event.target.value })
                                }
                                placeholder="e.g. marine archaeology, urban heat, ancient dyes"
                              />
                            </label>
                            <label>
                              Target Questions
                              <input
                                value={passage.questionCount}
                                onChange={(event) =>
                                  updateAdminReadingGeneratorPassage(passage.id, { questionCount: event.target.value })
                                }
                                placeholder="13"
                              />
                            </label>
                          </div>

                          <label>
                            Original Passage to Imitate
                            <textarea
                              value={passage.sourcePassage}
                              onChange={(event) =>
                                updateAdminReadingGeneratorPassage(passage.id, { sourcePassage: event.target.value })
                              }
                              placeholder="Paste the original passage here. Codex will imitate length, difficulty, and paragraph organization, but change the topic."
                              rows={8}
                            />
                          </label>

                          <div className="adminReadingTypeSelector">
                            {ADMIN_READING_GENERATOR_QUESTION_TYPES.map((type) => (
                              <button
                                key={`${passage.id}-${type.id}`}
                                type="button"
                                className={passage.questionTypes.includes(type.id) ? 'active' : ''}
                                onClick={() => toggleAdminReadingGeneratorQuestionType(passage.id, type.id)}
                              >
                                {type.shortLabel}
                              </button>
                            ))}
                          </div>

                          <label>
                            Extra Requirements for This Passage
                            <textarea
                              value={passage.requirements}
                              onChange={(event) =>
                                updateAdminReadingGeneratorPassage(passage.id, { requirements: event.target.value })
                              }
                              placeholder="Optional. Add special rules for this passage, e.g. 7 TFNG + 6 fill blanks, matching headings only for paragraphs A-G, etc."
                              rows={5}
                            />
                          </label>
                        </article>
                          )
                        })}
                    </div>

                    <div className="adminGeneratorActionBar">
                      <button type="button" className="adminGenerateBtn" onClick={buildAdminReadingGeneratorBrief}>
                        GENERATE
                      </button>
                      <button type="button" className="secondary" onClick={() => void copyAdminReadingGeneratorBrief()}>
                        Copy Brief
                      </button>
                      <p className="meta">Generate the Codex brief, paste it into Codex, then paste the JSON result below for checking.</p>
                    </div>

                    <details
                      className="adminGeneratorReviewDrawer"
                      open={Boolean(adminReadingGeneratorBrief || adminReadingGeneratorDraftInput || adminReadingGeneratorValidation)}
                    >
                      <summary>Codex brief + generated JSON check</summary>
                      <div className="adminReadingGeneratorReviewGrid">
                        <label>
                          Codex Generation Brief
                          <textarea
                            value={adminReadingGeneratorBrief}
                            onChange={(event) => setAdminReadingGeneratorBrief(event.target.value)}
                            placeholder="Build the brief after filling the passage slots."
                            rows={12}
                          />
                        </label>
                        <label>
                          Generated JSON Review
                          <textarea
                            value={adminReadingGeneratorDraftInput}
                            onChange={(event) => {
                              setAdminReadingGeneratorDraftInput(event.target.value)
                              setAdminReadingGeneratorValidation(null)
                            }}
                            placeholder='Paste Codex output here. It should be a JSON array with title, category, rawPassageText, and rawAnswerKey.'
                            rows={12}
                          />
                        </label>
                      </div>

                      <div className="adminGeneratorActionBar">
                        <button type="button" className="secondary" onClick={validateAdminReadingGeneratorDraft}>
                          CHECK ONLY
                        </button>
                        <button type="button" className="adminGenerateBtn" onClick={loadAdminReadingGeneratorDraftIntoBulkUpload}>
                          CHECK + LOAD
                        </button>
                        <p className="meta">
                          Local checks catch missing evidence, order problems, unbalanced judgement sets, and fill answers that are not exact one-word passage answers.
                        </p>
                      </div>
                    </details>

                    {adminReadingGeneratorValidation && (
                      <div className="adminGeneratorValidationCard">
                        <h4>Generator Validation</h4>
                        <p className="meta">
                          Total: {adminReadingGeneratorValidation.total} · Ready:{' '}
                          {adminReadingGeneratorValidation.valid} · Needs fixing:{' '}
                          {adminReadingGeneratorValidation.invalid}
                        </p>
                        <div className="adminAudioLibraryGrid">
                          {adminReadingGeneratorValidation.items.map((item) => (
                            <article key={`generator-validation-${item.index}`} className="adminAudioCard">
                              <p className="adminAudioEyebrow">
                                {READING_CATEGORY_LABELS[item.category]} · Item {item.index}
                              </p>
                              <h4>{item.title}</h4>
                              <p>
                                {item.passageCount} passage{item.passageCount === 1 ? '' : 's'} ·{' '}
                                {item.questionCount} questions
                              </p>
                              {item.ok ? (
                                <p className="meta authSuccess">Ready for server validation</p>
                              ) : (
                                <p className="error">Needs fixing</p>
                              )}
                              {[...item.errors, ...item.warnings].slice(0, 5).map((message) => (
                                <p key={`${item.index}-${message}`} className={item.errors.includes(message) ? 'error' : 'meta'}>
                                  {message}
                                </p>
                              ))}
                            </article>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <details className="adminCollapsedTools">
                    <summary>Manual upload tools</summary>
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
                        rows={10}
                      />
                    </label>
                    <label>
                      Answer Key + Thai Explanation
                      <textarea
                        value={adminReadingAnswerKeyInput}
                        onChange={(event) => setAdminReadingAnswerKeyInput(event.target.value)}
                        placeholder="Paste the uploaded answer-key format here..."
                        rows={10}
                      />
                    </label>
                    <div className="adminActionRow">
                      <button type="button" onClick={() => void handleAdminCreateReadingExam()}>
                        Upload Reading Exam
                      </button>
                      <p className="meta">The parser will split passages, question ranges, exact hints, and paraphrased vocabulary automatically.</p>
                    </div>
                  </details>
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

                <div className="panel adminSectionCard adminOnly-reading">
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
                      placeholder={`[\n  {\n    "title": "Cambridge 11 Test 1 Passage 1",\n    "category": "normal",\n    "rawPassageText": "READING PASSAGE 1\\n...",\n    "rawAnswerKey": "Question 1: ..."\n  },\n  {\n    "title": "Cambridge 11 Test 1 Passage 3",\n    "category": "advanced",\n    "rawPassageText": "READING PASSAGE 3\\n...",\n    "rawAnswerKey": "Question 27: ..."\n  }\n]`}
                      rows={10}
                    />
                  </label>
                  <details className="adminCollapsedTools">
                    <summary>JSON templates</summary>
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
                  </details>
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

                <div className="panel adminSectionCard adminOnly-reading">
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

                <div className="panel adminSectionCard adminOnly-audio">
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
                      <li>Open a Part 1 topic pack instead of generating one question at a time.</li>
                      <li>Use “Generate Missing” once to create the audio permanently in storage.</li>
                      <li>When a question has already been generated, the exam can reuse it without spending Deepgram cost again.</li>
                    </ol>
                  </div>
                  <div className="adminTtsLibraryHeader">
                    <div>
                      <h4>Generated Audio Library</h4>
                      <p className="meta">Question audio is now stored permanently, so once it is generated it stays ready for future exams.</p>
                    </div>
                    <span className="bandPill">{generatedAdminTtsLibrary.length} ready</span>
                  </div>
                  <div className="adminWorkflowCard adminTtsSummaryCard">
                    <h4>Speaking Part 1 Topic Packs</h4>
                    <p className="meta">
                      {isLoadingAdminTtsCatalog
                        ? 'Loading saved audio progress...'
                        : `${adminPart1TtsTopics.filter((topic) => topic.missingCount === 0).length}/${adminPart1TtsTopics.length} topics fully ready`}
                    </p>
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
                  {filteredAdminPart1TtsTopics.length > 0 ? (
                    <div className="adminTtsTopicGrid">
                      {filteredAdminPart1TtsTopics.map((topic) => (
                        <article key={`part1-pack-${topic.topicId}`} className="adminTtsTopicCard">
                          <div className="adminTtsTopicCardTop">
                            <div>
                              <p className="adminAudioEyebrow">Part 1 Topic Pack</p>
                              <h4>{topic.topicTitle}</h4>
                              <p className="meta">
                                {topic.readyCount}/{topic.items.length} ready
                              </p>
                            </div>
                            <div className="adminTtsTopicActions">
                              <button
                                type="button"
                                onClick={() =>
                                  void generateQuestionAudioBatch(
                                    `pack-missing-${topic.topicId}`,
                                    topic.items.filter((item) => !item.audioUrl)
                                  )
                                }
                                disabled={ttsGeneratingKey === `pack-missing-${topic.topicId}` || topic.missingCount === 0}
                              >
                                {ttsGeneratingKey === `pack-missing-${topic.topicId}`
                                  ? 'Generating...'
                                  : topic.missingCount === 0
                                    ? 'All Ready'
                                    : `Generate Missing (${topic.missingCount})`}
                              </button>
                              <button
                                type="button"
                                className="secondary"
                                onClick={() =>
                                  void generateQuestionAudioBatch(`pack-all-${topic.topicId}`, topic.items, { force: true })
                                }
                                disabled={ttsGeneratingKey === `pack-all-${topic.topicId}`}
                              >
                                {ttsGeneratingKey === `pack-all-${topic.topicId}` ? 'Refreshing...' : 'Regenerate Topic'}
                              </button>
                            </div>
                          </div>
                          <div className="adminTtsTopicQuestionList">
                            {topic.items.map((item) => (
                              <article key={item.key} className="adminQuestionCard compact">
                                <div className="adminQuestionCardTop">
                                  <div>
                                    <p className="adminQuestionText">{item.question}</p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => void generateTtsForQuestion(item)}
                                    disabled={ttsGeneratingKey === item.key}
                                  >
                                    {ttsGeneratingKey === item.key ? 'Generating...' : item.audioUrl ? 'Regenerate' : 'Generate'}
                                  </button>
                                </div>
                                {item.audioUrl ? (
                                  <div className="adminQuestionAudioRow">
                                    <span className="adminReadyDot">Ready</span>
                                    <audio controls src={item.audioUrl} />
                                  </div>
                                ) : (
                                  <p className="meta adminQuestionHint">Still missing. Generate once and it will stay available.</p>
                                )}
                              </article>
                            ))}
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <p className="meta adminEmptyState">No Part 1 topic packs match this search.</p>
                  )}
                  <div className="adminTtsGroupStack">
                    {[
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
                                    onClick={() => void generateTtsForQuestion(item)}
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

              <div className="adminSideColumn adminOnly-settings">
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
          <section className="panel full speakingFlowTheme">
          <h2>{isTrialUser ? 'IELTS Speaking Trial' : 'Speaking Test'}</h2>
          {attemptStage === 'idle' && (
            isTrialUser ? (
              <div className="trialStageShell">
                <div className="trialStageHero">
                  <p className="sectionLabel">One-time Trial Only</p>
                  <h3>ทดลองใช้ฟรีเพื่อประเมิน IELTS Speaking ของตัวเองแบบมีระบบ</h3>
                  <p>
                    Trial นี้ใช้เวลาประมาณ 5-7 นาทีครับ และใช้ได้เพียง 1 ครั้งต่อ 1 อีเมลเท่านั้น
                    ระบบจะพาคุณทำ long turn 1 ข้อ แล้วต่อด้วย follow-up 3 ข้อแบบใกล้เคียงข้อสอบจริง
                  </p>
                  <div className="trialHeroChips">
                    <span>2-minute long turn</span>
                    <span>3 follow-up questions</span>
                    <span>premium report</span>
                  </div>
                </div>
                {Math.min(creditProfile.feedbackRemaining, creditProfile.fullMockRemaining) <= 0 ? (
                  <div className="trialUsedCard">
                    <h4>คุณใช้สิทธิ์ทดลองใช้ฟรีครั้งนี้ครบแล้วครับ</h4>
                    <p>
                      report ของรอบนี้ถูกบันทึกไว้ฝั่งแอดมินเรียบร้อยแล้ว หากต้องการฝึกต่อแบบเต็มระบบ
                      แนะนำให้สมัครคอร์สเพื่อปลดล็อกการซ้อมเพิ่มเติมครับ
                    </p>
                    <div className="controls prepControls">
                      <button
                        type="button"
                        className="primaryReadyBtn"
                        onClick={() => {
                          window.location.href = 'https://www.language-plan.com/courses/0-day-speaking-challenge-for-ielts'
                        }}
                      >
                        ไปดูคอร์สเต็ม
                      </button>
                      <button type="button" className="secondary cancelBtn" onClick={handleLogout}>
                        ออกจากระบบ
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="trialBriefGrid">
                    <div className="trialBriefCard">
                      <h4>ก่อนเริ่ม เตรียมตัวแบบนี้นะครับ</h4>
                      <ul>
                        <li>เตรียมปากกาและสมุดไว้จด keyword</li>
                        <li>คุณจะมีเวลาเตรียมคำตอบ 1 นาทีเต็ม</li>
                        <li>หลังจากนั้นต้องพูดต่อเนื่อง 2 นาที</li>
                        <li>แล้วจะมี follow-up 3 ข้อ ข้อละ 1 นาที</li>
                      </ul>
                    </div>
                    <div className="trialBriefCard">
                      <h4>Long Turn</h4>
                      <p className="trialPromptText">{TRIAL_SPEAKING_PROMPT}</p>
                      <ul>
                        {TRIAL_SPEAKING_PART2_CUES.map((cue) => (
                          <li key={`trial-cue-${cue}`}>{cue}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="trialBriefCard">
                      <h4>Follow-up Questions</h4>
                      <p>หลังจากพูด 2 นาทีแล้ว จะมีอีก 3 คำถาม และคุณมีเวลา <strong>1 นาทีต่อข้อ</strong> ครับ</p>
                      <ol>
                        {TRIAL_SPEAKING_PART3_QUESTIONS.map((question) => (
                          <li key={`trial-p3-${question}`}>{question}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                )}
                {Math.min(creditProfile.feedbackRemaining, creditProfile.fullMockRemaining) > 0 && (
                  <div className="controls prepControls">
                    <button
                      type="button"
                      className="primaryReadyBtn"
                      onClick={() => {
                        setSelectedTestMode('full')
                        setSelectedTopicId(TRIAL_SPEAKING_TOPIC_ID)
                        startAttempt()
                      }}
                    >
                      ฉันพร้อมแล้ว เริ่ม Trial ตอนนี้
                    </button>
                    <button type="button" className="secondary cancelBtn" onClick={handleLogout}>
                      ออกจากระบบ
                    </button>
                  </div>
                )}
              </div>
            ) : (
            <>
              <div className="speakingEntryChooser" aria-label="Choose speaking practice mode">
                <button
                  type="button"
                  className={`speakingEntryCard ${speakingEntryMode === 'practice' ? 'active' : ''}`}
                  onClick={() => {
                    setSpeakingEntryMode('practice')
                    if (selectedTestMode === 'full') setSelectedTestMode('part1')
                    setTopicBankSearch('')
                  }}
                >
                  <span className="speakingEntryLabel">ฝึกที่ละ part</span>
                  <strong>Part 1, Part 2, Part 3</strong>
                  <small>เลือกพาร์ตที่อยากซ้อม แล้วดูคะแนนเฉลี่ยของแต่ละพาร์ต</small>
                </button>
                <button
                  type="button"
                  className={`speakingEntryCard speakingEntryCard-full ${speakingEntryMode === 'full' ? 'active' : ''}`}
                  onClick={() => {
                    setSpeakingEntryMode('full')
                    setSelectedTestMode('full')
                    setTopicBankSearch('')
                  }}
                >
                  <span className="speakingEntryLabel">ทำข้อสอบเต็ม</span>
                  <strong>ควรเตรียมเวลา 13-15 นาที</strong>
                  <small>หากหยุดกลางทางจะเสีย credit mock test</small>
                </button>
              </div>

              {speakingEntryMode === 'practice' && (
                <div className="providerTabs speakingPartTabs">
                  {(['part1', 'part2', 'part3'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      className={selectedTestMode === mode ? 'active' : ''}
                      onClick={() => {
                        setSelectedTestMode(mode)
                        setTopicBankSearch('')
                      }}
                    >
                      <span>{SPEAKING_MODE_LABELS[mode]}</span>
                      <span className="speakingAverageScore">
                        Avg {speakingAverageScores[mode] === null ? '-' : speakingAverageScores[mode]?.toFixed(1)}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {speakingEntryMode === 'full' && (
                <div className="fullMockPreviewBanner">
                  <p className="fullMockPreviewTitle">Full Mock Test Flow · Avg {speakingAverageScores.full === null ? '-' : speakingAverageScores.full?.toFixed(1)}</p>
                  <p className="meta">ควรเตรียมเวลา 13-15 นาที หากหยุดกลางทางจะเสีย credit mock test</p>
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
              {speakingEntryMode && <div className="speakingTopicBank" role="region" aria-label="Speaking question bank">
                <div className="topicBankToolbar">
                  <label className="topicBankSearchWrap">
                    <span className="sr-only">Search topics</span>
                    <input
                      type="search"
                      className="topicBankSearchInput"
                      value={topicBankSearch}
                      onChange={(event) => setTopicBankSearch(event.target.value)}
                      placeholder="Search by title, category, or cue…"
                      aria-label="Search topics"
                    />
                  </label>
                  <div className="topicBankToolbarMeta">
                    <span className="topicBankCount">
                      {topicBankFilteredTopics.length}/{availableTopics.length} topics
                    </span>
                    <div className="topicBankViewToggle" role="group" aria-label="Card layout">
                      <button
                        type="button"
                        className={topicBankView === 'grid' ? 'active' : ''}
                        onClick={() => setTopicBankView('grid')}
                        aria-pressed={topicBankView === 'grid'}
                      >
                        Grid
                      </button>
                      <button
                        type="button"
                        className={topicBankView === 'list' ? 'active' : ''}
                        onClick={() => setTopicBankView('list')}
                        aria-pressed={topicBankView === 'list'}
                      >
                        List
                      </button>
                    </div>
                  </div>
                </div>
                {topicBankFilteredTopics.length === 0 ? (
                  <p className="topicBankEmpty">
                    No topics match your search. Clear the box above or try different keywords.
                  </p>
                ) : (
                  topicBankGrouped.map(([category, groupTopics]) => (
                    <section key={`topic-bank-${category}`} className="topicBankGroup">
                      <header className="topicBankGroupHeader">
                        <h3 className="topicBankGroupTitle">{category}</h3>
                        <span className="topicBankGroupCount">{groupTopics.length}</span>
                      </header>
                      <div className={`thumbnailGrid topicBankCardGrid thumbnailGrid--${topicBankView}`}>
                        {groupTopics.map((topic) => {
                          const flatIndex = topicBankIdToFlatIndex.get(topic.id) ?? 0
                          const latestScore = latestScoresByTest[`${selectedTestMode}:${topic.id}`]
                          const hasAttempted = latestScore !== undefined
                          const isSelected = selectedTopicId === topic.id
                          return (
                            <div
                              key={topic.id}
                              data-topic-bank-card-index={flatIndex}
                              className={`thumbnailCard thumbnailCard--mode-${selectedTestMode} ${
                                hasAttempted ? 'thumbnailCard--attempted' : 'thumbnailCard--fresh'
                              } ${selectedTestMode === 'full' ? 'fullMockCard' : ''} ${isSelected ? 'thumbnailCard--selected' : ''}`}
                              role="button"
                              tabIndex={topicBankFocusIndex === flatIndex ? 0 : -1}
                              onClick={() => {
                                setTopicBankFocusIndex(flatIndex)
                                openStartFlowForTopic(topic.id)
                              }}
                              onFocus={() => setTopicBankFocusIndex(flatIndex)}
                              onKeyDown={(event) => {
                                if (
                                  event.key === 'ArrowDown' ||
                                  event.key === 'ArrowRight' ||
                                  event.key === 'ArrowUp' ||
                                  event.key === 'ArrowLeft'
                                ) {
                                  handleTopicBankGridKeyDown(event)
                                  return
                                }
                                if (event.key === 'Enter' || event.key === ' ') {
                                  event.preventDefault()
                                  setTopicBankFocusIndex(flatIndex)
                                  openStartFlowForTopic(topic.id)
                                }
                              }}
                            >
                              <p className="thumbCategory">{topic.category}</p>
                              <h3>{topic.title}</h3>
                              {hasAttempted ? (
                                <p className="latestScoreBadge">Latest score: {latestScore.toFixed(1)}</p>
                              ) : (
                                <p className="topicCardFreshHint">Not attempted yet</p>
                              )}
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
                              <div className="topicCardActions">
                                <button
                                  type="button"
                                  className="topicCardStartBtn"
                                  onClick={(event) => {
                                    event.stopPropagation()
                                    setTopicBankFocusIndex(flatIndex)
                                    openStartFlowForTopic(topic.id)
                                  }}
                                >
                                  Start
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </section>
                  ))
                )}
              </div>}
            </>
            )
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
                  <h3>{isTrialSpeakingFlow ? 'ก่อนเริ่ม Trial นี้' : 'Preparation Time'}</h3>
                  <p className="timer">{remainingPrepSeconds}s</p>

                  {isTrialSpeakingFlow ? (
                    <>
                      <div className="prepTimeEstimate">
                        <span className="prepTimeIcon">🕐</span>
                        <span>ใช้เวลาประมาณ <strong>5-7 นาที</strong> สำหรับ trial นี้ครับ</span>
                      </div>
                      <div className="trialFlowSteps">
                        <span className="previewStep">เตรียมตัว 1 นาที</span>
                        <span className="previewArrow">→</span>
                        <span className="previewStep">พูด 2 นาที</span>
                        <span className="previewArrow">→</span>
                        <span className="previewStep">Follow-up 3 ข้อ</span>
                        <span className="previewArrow">→</span>
                        <span className="previewStep previewStepFinal">Report</span>
                      </div>
                      <div className="prepHeadsUp">
                        <p className="prepHeadsUpTitle">⚠️ ก่อนเริ่มจริง</p>
                        <p>สิทธิ์ทดลองใช้ฟรีนี้ใช้ได้ 1 ครั้งเท่านั้น เตรียมปากกาและสมุดให้พร้อมก่อนกดเริ่มนะครับ</p>
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
                      <p>อีกสักครู่คุณจะมีเวลาเตรียมคำตอบ 1 นาที จากนั้นต้องพูด 2 นาที และตอบ follow-up 3 ข้อ ข้อละ 1 นาทีครับ</p>
                      <div className="card">
                        <p className="category">Long Turn Prompt</p>
                        <h3>{TRIAL_SPEAKING_PROMPT}</h3>
                        <ul>
                          {TRIAL_SPEAKING_PART2_CUES.map((cue) => (
                            <li key={`trial-prep-cue-${cue}`}>{cue}</li>
                          ))}
                        </ul>
                        <p className="promptSub">จากนั้นจะมี follow-up อีก 3 ข้อ:</p>
                        <ul>
                          {TRIAL_SPEAKING_PART3_QUESTIONS.map((question) => (
                            <li key={`trial-prep-p3-${question}`}>{question}</li>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : isFullExamMode && (
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

                  {isQuestionByQuestionMode ? (
                    <div className="prepThaiPracticeGuide">
                      <strong>วิธีใช้โหมดฝึกนี้</strong>
                      <p>
                        อันนี้เป็นโหมด practice นะครับ ยังไม่ใช่สอบจริง เอาเวลาเท่าที่ต้องการได้เลยในการทวนคำศัพท์
                        คิดไอเดีย และร่างคำตอบไว้ก่อน
                      </p>
                      <p>
                        โน้ตที่พิมพ์ไว้ด้านล่างจะขึ้นให้เห็นตอนพูด ไม่ต้องกังวลนะครับ ;)
                        ถ้าอยากดูคำแนะนำคำศัพท์สวย ๆ ของพี่ดอยสำหรับแต่ละข้อ ให้กด <strong>Vocabulary Guide</strong>
                      </p>
                    </div>
                  ) : (
                    <p>Review the question list first, then click &quot;I&apos;m ready&quot;.</p>
                  )}

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
                    {isTrialSpeakingFlow ? (
                      <div className="prepAccordionWrap">
                        <div className="part2NoteWrap">
                          <p className="part2PromptPreview">{TRIAL_SPEAKING_PROMPT}</p>
                          <textarea
                            className="part2NotebookTextarea"
                            value={prepNotePart2}
                            onChange={(event) => setPrepNotePart2(event.target.value)}
                            placeholder="จด keyword ที่อยากพูด, ตัวอย่าง, เรื่องสั้น ๆ หรือ structure ของคุณตรงนี้..."
                          />
                          <p className="part2NotebookHint">
                            ใช้ 1 นาทีนี้จด note ให้ไวที่สุดครับ เดี๋ยว note นี้จะขึ้นให้เห็นตอนช่วงพูด 2 นาที
                          </p>
                        </div>
                      </div>
                    ) : isFullExamMode ? (
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
                      {isTrialSpeakingFlow ? 'ฉันพร้อมแล้ว เริ่ม Trial ตอนนี้' : "I'm ready"}
                    </button>
                    <button type="button" className="secondary cancelBtn" onClick={resetSession}>
                      {isTrialSpeakingFlow ? 'ยกเลิก' : 'Cancel'}
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
                  <div className="speakingBrandStrip" aria-hidden="true" />
                  {isExamPaused && (
                    <div className="examPausedOverlay">
                      <div className="examPausedCard">
                        <h3>⏸ Exam Paused</h3>
                        <p>Auto-resume in {pauseTimeRemaining} seconds</p>
                        <button type="button" onClick={toggleExamPause}>▶ Resume Now</button>
                      </div>
                    </div>
                  )}
                  <div className="speakingExamLane">
                    <div className="speakingPanelLayout">
                    <section className="speakingPromptCard">
                      <p className="promptPill">{activeTopic.category}</p>
                      {isFullExamMode ? (
                        isTrialSpeakingFlow ? (
                        <>
                          <div className="card phaseInfoCard">
                            <p className="category">Trial Flow</p>
                            <p className="phaseInfoText">{fullExamPhaseLabel}</p>
                          </div>
                          {fullExamPhase === 'part2_prep' ? (
                            <>
                              <h3>คุณมีเวลาเตรียมคำตอบ 1 นาทีครับ</h3>
                              <p className="part2BigQuestion">{TRIAL_SPEAKING_PROMPT}</p>
                              <p className="promptSub">ลองเก็บให้ครบ 4 จุดนี้:</p>
                              <ul>
                                {TRIAL_SPEAKING_PART2_CUES.map((cue) => (
                                  <li key={`trial-live-cue-${cue}`}>{cue}</li>
                                ))}
                              </ul>
                              <label className="part2NotebookLiveWrap">
                                <span className="part2NotebookLabel">Trial Note</span>
                                <textarea
                                  className="part2NotebookTextarea"
                                  value={prepNotePart2}
                                  onChange={(event) => setPrepNotePart2(event.target.value)}
                                  placeholder="จด keyword ที่จะใช้พูด 2 นาทีตรงนี้..."
                                />
                                <p className="part2NotebookHint">อีกเดี๋ยวระบบจะให้คุณพูด 2 นาทีเต็มจาก prompt นี้ครับ</p>
                              </label>
                            </>
                          ) : fullExamPhase === 'part2_speaking' ? (
                            <>
                              <h3>พูดต่อเนื่อง 2 นาทีจากหัวข้อนี้ครับ</h3>
                              <p className="part2BigQuestion">{TRIAL_SPEAKING_PROMPT}</p>
                              <ul>
                                {TRIAL_SPEAKING_PART2_CUES.map((cue) => (
                                  <li key={`trial-speak-cue-${cue}`}>{cue}</li>
                                ))}
                              </ul>
                              <p className="promptSub">อย่าพยายามพูด perfect นะครับ ขอแค่ตอบให้ครบและไหลลื่นที่สุดก่อน</p>
                            </>
                          ) : (
                            <>
                              <h3>Follow-up Question {fullExamPart3Index + 1}/3</h3>
                              <p>{fullExamCurrentQuestion}</p>
                              <p className="promptSub">คุณมีเวลา 1 นาทีสำหรับคำถามนี้ครับ ตอบให้มี opinion + reason + example สั้น ๆ</p>
                            </>
                          )}
                        </>
                        ) : (
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
                        )
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

                    <section className="speakingControlCard speakingPerformanceCard">
                      <div className={`recordingPill ${isExamPaused ? 'recordingPill-paused' : 'recordingPill-live'}`}>
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
                            {isTrialSpeakingFlow
                              ? fullExamPhase === 'part3' && fullExamPart3Index >= fullExamPlan.part3Questions.length - 1
                                ? '✓ ส่งตรวจและดูผล'
                                : '✓ ข้อต่อไป'
                              : fullExamPhase === 'part3' && fullExamPart3Index >= fullExamPlan.part3Questions.length - 1
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
                            value={currentTranscriptEditableText}
                            onChange={(event) => handleTranscriptTextareaChange(event.target.value)}
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
                          {isTrialSpeakingFlow
                            ? 'Trial Prompt'
                            : selectedTestMode === 'full'
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
                                  className="reportSaveButton"
                                  onClick={() => saveFullReportToNotebook(activeReport)}
                                >
                                  <span className="reportSaveButtonGlow" aria-hidden="true" />
                                  <span className="reportSaveButtonIcon" aria-hidden="true">
                                    ✦
                                  </span>
                                  <span>Save Full Report</span>
                                </button>
                              </div>
                            </div>
                              {reportActionToast && (
                                <div className="notebookSaveToast reportSaveToast" role="status" aria-live="polite">
                                  <span className="notebookSaveToastSparkle reportSaveToastSparkle" aria-hidden="true">
                                    {reportActionToast.icon}
                                  </span>
                                  <div>
                                    <p className="notebookSaveToastTitle">{reportActionToast.title}</p>
                                    <p className="notebookSaveToastText">{reportActionToast.text}</p>
                                  </div>
                                </div>
                              )}
                              {notebookSaveNotice && <p className="meta authSuccess">{notebookSaveNotice}</p>}
                              <section className="reportDisclaimerCard">
                                <p>
                                  คะแนนนี้เป็นเพียงการประเมินจากผลงานของคุณในวันนี้ครับ ตอนสอบจริง คุณอาจได้คะแนนสูงกว่าหรือต่ำกว่านี้ได้ เป้าหมายของ report นี้คือช่วยให้คุณเห็นจุดอ่อนของตัวเอง และเห็นแนวทางพัฒนาที่ทำได้จริงครับ
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
                                            {resultFullExamPlan.part1Questions.length > 0 && (
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
                                              </>
                                            )}
                                            <div className="pronRiskHeader">
                                              <h4>{isTrialSpeakingFlow ? '2-Minute Response' : 'Part 2'}</h4>
                                            </div>
                                            <div className="pronRiskList">
                                              {activeReport.questionBreakdown
                                                .slice(resultFullExamPlan.part1Questions.length, resultFullExamPlan.part1Questions.length + 1)
                                                .map((item, idx) => (
                                                  <article key={`q-breakdown-p2-${idx}`} className="pronRiskItem">
                                                    <p className="pronRiskWord">{item.question || (isTrialSpeakingFlow ? 'Long Turn' : 'Part 2')}</p>
                                                    <p className="pronRiskReason">{item.punctuatedTranscript}</p>
                                                  </article>
                                                ))}
                                            </div>
                                            {activeReport.questionBreakdown.slice(resultFullExamPlan.part1Questions.length + 1).length > 0 && (
                                              <>
                                                <div className="pronRiskHeader">
                                                  <h4>{isTrialSpeakingFlow ? 'Follow-up Questions' : 'Part 3'}</h4>
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
                                            )}
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
                                      {isFullExamMode && activeReport.questionBreakdown && activeReport.questionBreakdown.length > 0 ? (
                                        <>
                                          {resultFullExamPlan.part1Questions.length > 0 && (
                                            <>
                                              <h6>Part 1</h6>
                                              {activeReport.questionBreakdown
                                                .slice(0, resultFullExamPlan.part1Questions.length)
                                                .map((item, idx) => (
                                                  <p key={`punctuated-p1-${idx}`}>
                                                    <strong>Q{idx + 1}:</strong> {item.punctuatedTranscript}
                                                  </p>
                                                ))}
                                            </>
                                          )}
                                          <h6>{isTrialSpeakingFlow ? '2-Minute Response' : 'Part 2'}</h6>
                                          {activeReport.questionBreakdown
                                            .slice(resultFullExamPlan.part1Questions.length, resultFullExamPlan.part1Questions.length + 1)
                                            .map((item, idx) => (
                                              <p key={`punctuated-p2-${idx}`}>{item.punctuatedTranscript}</p>
                                            ))}
                                          {activeReport.questionBreakdown.slice(resultFullExamPlan.part1Questions.length + 1).length > 0 && (
                                            <>
                                              <h6>{isTrialSpeakingFlow ? 'Follow-up Questions' : 'Part 3'}</h6>
                                              {activeReport.questionBreakdown
                                                .slice(resultFullExamPlan.part1Questions.length + 1)
                                                .map((item, idx) => (
                                                  <p key={`punctuated-p3-${idx}`}>
                                                    <strong>Q{idx + 1}:</strong> {item.punctuatedTranscript}
                                                  </p>
                                                ))}
                                            </>
                                          )}
                                        </>
                                      ) : (
                                        <p>{activeReport.punctuatedTranscript}</p>
                                      )}
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
                      {!isTrialUser && (
                        <div className="audioConsultCard">
                          <div className="audioConsultCopy">
                            <p className="audioConsultEyebrow">For future revision</p>
                            <h4>เซฟ report ไว้ทบทวน และโหลดเสียงไว้ใช้ตอนปรึกษาพี่ดอยได้ครับ</h4>
                            <p>
                              นักเรียนในคอร์สสามารถย้อนกลับมาดู report เดิมได้เรื่อย ๆ และสามารถดาวน์โหลดเสียงชิ้นนี้ไว้ใช้ประกอบการ consult กับพี่ดอยได้เลยครับ
                            </p>
                          </div>
                          <div className="audioConsultActions">
                            <button
                              type="button"
                              className="audioConsultButton audioConsultButton-secondary"
                              onClick={() => assessmentResult && saveFullReportToNotebook(assessmentResult)}
                            >
                              ✦ Save report for revision
                            </button>
                            <button
                              type="button"
                              className="audioConsultButton"
                              onClick={() => void handleDownloadCurrentRecording()}
                            >
                              ⬇ Download audio for consultation
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="reportNextSteps">
                    <h4>📋 Next Steps</h4>
                    <div className="nextStepsGrid">
                      <button
                        type="button"
                        className="nextStepCard"
                        onClick={() => {
                          if (isTrialUser) {
                            window.location.href = 'https://www.language-plan.com/courses/0-day-speaking-challenge-for-ielts'
                            return
                          }
                          setSelectedTestMode(selectedTestMode)
                          resetSession()
                        }}
                      >
                        <span className="nextStepIcon">{isTrialUser ? '🚀' : '🔄'}</span>
                        <span className="nextStepTitle">{isTrialUser ? 'ปลดล็อกคอร์สเต็ม' : 'ลองใหม่อีกรอบ'}</span>
                        <span className="nextStepDesc">{isTrialUser ? 'ฝึกต่อแบบเต็มระบบพร้อม mock และ feedback เพิ่มเติม' : 'ฝึก topic เดิมจนชำนาญ'}</span>
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
                        onClick={isTrialUser ? handleLogout : resetSession}
                      >
                        <span className="nextStepIcon">{isTrialUser ? '👋' : '📚'}</span>
                        <span className="nextStepTitle">{isTrialUser ? 'ออกจาก Trial' : 'เลือก Topic ใหม่'}</span>
                        <span className="nextStepDesc">{isTrialUser ? 'กลับไปหน้าเริ่มต้น' : 'ฝึกหัวข้ออื่น'}</span>
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
      <PracticeActionToast toast={practiceActionToast} onDismiss={dismissPracticeActionToast} />
    </main>
  )
}

export default App
