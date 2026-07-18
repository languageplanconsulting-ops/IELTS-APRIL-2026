import { Fragment, useMemo, useState } from 'react'
import type {
  GeneralTask1Prompt,
  GeneralTask1Register,
  GeneralTask1Sentence
} from './writingGeneralTask1Data'
import { assembleGeneralTask1ModelLetter, getRegisterGuidance } from './writingGeneralTask1Data'
import {
  buildWritingRecallFeedback,
  isWritingRecallExact,
  type WritingRecallCheck
} from './writingParagraphRecall'
import { LetterHintBlankInput } from './LetterHintBlankInput'
import { buildLetterHintMask } from './writingLetterHint'
import './GeneralTask1LetterPractice.css'

type PracticeProps = {
  prompt: GeneralTask1Prompt
  onSaveVocab?: (payload: { word: string; thaiMeaning: string }) => void
}

type OptionPracticeBlank = {
  id: string
  kind: 'transition' | 'contraction' | 'conjunction'
  answer: string
  options: string[]
  sentenceIndex: number
}

type PracticeBlank =
  | OptionPracticeBlank
  | {
      id: string
      kind: 'letter-hint'
      answer: string
      thaiMeaning: string
      sentenceIndex: number
    }

type RenderSegment = { kind: 'text'; text: string } | { kind: 'blank'; blank: PracticeBlank }

const REGISTER_OPTIONS: Array<{ value: GeneralTask1Register; label: string; hint: string }> = [
  { value: 'formal', label: 'Formal', hint: 'ไม่รู้จักผู้รับเป็นการส่วนตัว' },
  { value: 'semi-formal', label: 'Semi-formal', hint: 'รู้จักผู้รับ แต่ความสัมพันธ์เป็นทางการ' },
  { value: 'informal', label: 'Informal', hint: 'เพื่อนหรือสมาชิกครอบครัว' }
]

const TRANSITION_BANKS: Record<GeneralTask1Register, string[]> = {
  informal: [
    'First of all,',
    'Honestly,',
    'Also,',
    'For example,',
    'By the way,',
    'Anyway,',
    'However,',
    'Luckily,',
    'Then,',
    'Afterwards,',
    'Finally,',
    'Most importantly,'
  ],
  'semi-formal': [
    'First of all,',
    'Firstly,',
    'As you may remember,',
    'As you know,',
    'In fact,',
    'Actually,',
    'In addition,',
    'Moreover,',
    'However,',
    'Unfortunately,',
    'Honestly,',
    'If possible,',
    'Of course,',
    'Finally,'
  ],
  formal: [
    'First of all,',
    'To begin with,',
    'Firstly,',
    'In addition,',
    'Furthermore,',
    'Moreover,',
    'However,',
    'Unfortunately,',
    'Consequently,',
    'Therefore,',
    'In particular,',
    'Finally,'
  ]
}

// Why each opener is the right choice — surfaced when a transition blank is wrong.
const TRANSITION_REASONS: Record<string, string> = {
  'First of all,': 'ใช้เปิดประเด็นหรือเหตุผลข้อแรกของย่อหน้า',
  'To begin with,': 'ใช้เริ่มลำดับประเด็นแรกในสำนวนทางการ',
  'Firstly,': 'ใช้จัดลำดับประเด็นแรก (ทางการกว่า First of all)',
  'Secondly,': 'ใช้จัดลำดับประเด็นที่สองต่อจาก Firstly',
  'Honestly,': 'ใช้เมื่อกำลังบอกความรู้สึกจริงใจหรือสารภาพตรง ๆ',
  'Actually,': 'ใช้เสริมข้อเท็จจริงหรือแก้ความเข้าใจอย่างสุภาพ',
  'In fact,': 'ใช้เน้นย้ำข้อเท็จจริงที่หนักแน่นขึ้น',
  'Also,': 'ใช้เพิ่มข้อมูลที่สอดคล้องกับประโยคก่อนหน้า',
  'In addition,': 'ใช้เพิ่มข้อมูลในสำนวนกึ่งทางการ/ทางการ',
  'Furthermore,': 'ใช้เสริมน้ำหนักข้อมูลเดิมให้หนักแน่นขึ้น (ทางการ)',
  'Moreover,': 'ใช้เพิ่มประเด็นสนับสนุนที่สำคัญ (ทางการ)',
  'For example,': 'ใช้ยกตัวอย่างสนับสนุนประโยคก่อนหน้า',
  'For instance,': 'ใช้ยกตัวอย่างในสำนวนทางการ',
  'By the way,': 'ใช้เปลี่ยนไปเรื่องใหม่แบบเป็นกันเอง',
  'Anyway,': 'ใช้ดึงกลับเข้าประเด็นหลักหรือเริ่มย่อหน้าสรุป',
  'However,': 'ใช้แสดงความขัดแย้งหรือข้อจำกัดกับใจความก่อนหน้า',
  'Nevertheless,': 'ใช้ยอมรับข้อขัดแย้งแต่ยังยืนยันใจความหลัก (ทางการ)',
  'Unfortunately,': 'ใช้บอกเรื่องที่ไม่ดีหรือน่าเสียดาย',
  'Luckily,': 'ใช้บอกเหตุการณ์ที่โชคดี',
  'Then,': 'ใช้บอกลำดับเหตุการณ์ถัดไป',
  'Afterwards,': 'ใช้บอกสิ่งที่เกิดขึ้นภายหลัง',
  'Consequently,': 'ใช้บอกผลที่ตามมาอย่างเป็นเหตุเป็นผล (ทางการ)',
  'As a result,': 'ใช้บอกผลลัพธ์ที่ตามมา',
  'Therefore,': 'ใช้สรุปผลเชิงเหตุผลหรือข้อเรียกร้อง (ทางการ)',
  'In particular,': 'ใช้เจาะจงประเด็นที่โดดเด่นเป็นพิเศษ',
  'As you may remember,': 'ใช้เชื่อมความสัมพันธ์เดิมกับผู้รับอย่างสุภาพ',
  'As you know,': 'ใช้อ้างถึงข้อมูลที่ทั้งสองฝ่ายทราบอยู่แล้ว',
  'If possible,': 'ใช้ขึ้นต้นคำขอร้องอย่างสุภาพ',
  'Of course,': 'ใช้ยืนยันหรือให้ความมั่นใจอย่างสุภาพ',
  'Finally,': 'ใช้ปิดท้ายด้วยประเด็นสุดท้ายของย่อหน้า',
  'Most importantly,': 'ใช้เน้นประเด็นที่สำคัญที่สุด'
}

const CONJUNCTION_CONFUSABLES: Record<string, string[]> = {
  and: ['but', 'so'],
  but: ['and', 'so'],
  so: ['and', 'but'],
  'so that': ['because', 'so'],
  because: ['although', 'when'],
  although: ['because', 'however'],
  when: ['while', 'because'],
  while: ['when', 'although'],
  since: ['because', 'when'],
  if: ['when', 'because'],
  whether: ['if', 'that'],
  which: ['who', 'that']
}

const CONJUNCTION_REASONS: Record<string, string> = {
  and: '“and” เชื่อมสองใจความที่เท่ากันเข้าด้วยกัน (S + V, and + S + V)',
  but: '“but” ใช้แสดงความขัดแย้งระหว่างสองใจความ',
  so: '“so” ใช้บอกผลลัพธ์ที่ตามมาจากเหตุก่อนหน้า',
  'so that': '“so that” ใช้บอกวัตถุประสงค์ของการกระทำ',
  because: '“because” ใช้ขึ้นต้น clause ที่บอกเหตุผล',
  although: '“although” ใช้ยอมรับข้อเท็จจริงที่ขัดแย้งกับใจความหลัก',
  when: '“when” ใช้บอกช่วงเวลาที่เหตุการณ์เกิดขึ้น',
  while: '“while” ใช้บอกสองเหตุการณ์ที่เกิดพร้อมกันหรือขัดแย้งกัน',
  since: '“since” ใช้บอกเหตุผลหรือจุดเริ่มของเวลา',
  if: '“if” ใช้ขึ้นต้นเงื่อนไข',
  whether: '“whether” ใช้เมื่อมีสองทางเลือก (…or…)',
  which: '“which” เป็น relative pronoun ที่ขยายคำนามหรือทั้งประโยคก่อนหน้า (…, which + verb)'
}

const TUTORIAL_LINES = [
  'ย่อหน้าแรกของจดหมายตอบ Bullet 1 เท่านั้น — ร้อยทุกประโยคเป็นย่อหน้าเดียว อย่าเพิ่งพูดถึง Bullet อื่น',
  'ย่อหน้าที่สองต่อเนื่องจากย่อหน้าแรก และตอบ Bullet 2 ทั้งย่อหน้าเป็นก้อนเดียวกัน',
  'ย่อหน้าสุดท้ายตอบ Bullet 3 เพื่อปิดเนื้อหา แล้วจึงตามด้วยคำลงท้ายและชื่อผู้เขียน'
]

const CONTRACTION_OPTIONS: Record<string, string[]> = {
  "i'm": ["I'm", 'I am', 'I was'],
  "i've": ["I've", 'I have', 'I had'],
  "i'd": ["I'd", 'I would', 'I will'],
  "i'll": ["I'll", 'I will', 'I would'],
  "can't": ["can't", 'cannot', "won't"],
  "couldn't": ["couldn't", 'could not', "can't"],
  "don't": ["don't", 'do not', "didn't"],
  "didn't": ["didn't", 'did not', "don't"],
  "won't": ["won't", 'will not', "wouldn't"],
  "wouldn't": ["wouldn't", 'would not', "won't"],
  "it's": ["it's", 'it is', 'its'],
  "that's": ["that's", 'that is', 'this is'],
  "there's": ["there's", 'there is', 'there are'],
  "we're": ["we're", 'we are', 'we were'],
  "we've": ["we've", 'we have', 'we had'],
  "we'll": ["we'll", 'we will', 'we would'],
  "you're": ["you're", 'you are', 'your'],
  "you'll": ["you'll", 'you will', 'you would'],
  "you've": ["you've", 'you have', 'you had']
}

const normalizeApostrophe = (value: string) => value.replaceAll('’', "'")

const getContractionOptions = (answer: string) => {
  const normalized = normalizeApostrophe(answer)
  const mapped = CONTRACTION_OPTIONS[normalized.toLowerCase()]
  if (mapped) return [answer, ...mapped.slice(1)]

  const lower = normalized.toLowerCase()
  const expanded = lower.endsWith("n't")
    ? `${normalized.slice(0, -3)} not`
    : lower.endsWith("'re")
      ? `${normalized.slice(0, -3)} are`
      : lower.endsWith("'ve")
        ? `${normalized.slice(0, -3)} have`
        : lower.endsWith("'ll")
          ? `${normalized.slice(0, -3)} will`
          : lower.endsWith("'d")
            ? `${normalized.slice(0, -2)} would`
            : lower.endsWith("'s")
              ? `${normalized.slice(0, -2)} is`
              : normalized
  return [answer, expanded, `${normalized.split("'")[0]} had`]
}

const getConjunctionOptions = (answer: string) => {
  const lower = normalizeApostrophe(answer).toLowerCase()
  const confusables = CONJUNCTION_CONFUSABLES[lower] ?? ['and', 'but']
  return [...new Set([answer, ...confusables])].slice(0, 3)
}

const transitionOptions = (answer: string, seed: number, bank: string[]) => {
  const distractors = bank.filter((item) => item !== answer)
  const offset = distractors.length > 0 ? seed % distractors.length : 0
  const options = [...distractors.slice(offset), ...distractors.slice(0, offset)].slice(0, 3)
  options.splice(seed % 4, 0, answer)
  return [...new Set(options)]
}

const CONTRACTION_RE =
  /\b(?:I|you|he|she|it|we|they|there|that|who|what|can|could|do|does|did|is|are|was|were|will|would|should|have|has)[’'][A-Za-z]+\b/gi
const CONJUNCTION_RE = /\b(?:so that|because|although|whether|while|since|which|when|and|but|so|if)\b/gi

const buildSentenceSegments = (
  sentence: GeneralTask1Sentence,
  register: GeneralTask1Register,
  paragraphIndex: number,
  sentenceIndex: number,
  vocab: readonly { phrase: string; thaiMeaning: string }[]
): RenderSegment[] => {
  const transitionEnd = sentence.transition.length
  const rest = sentence.text.slice(transitionEnd)
  type Candidate =
    | { start: number; end: number; answer: string; kind: 'contraction' | 'conjunction' }
    | { start: number; end: number; answer: string; kind: 'letter-hint'; thaiMeaning: string }
  const blankCandidates: Candidate[] = []

  for (const match of rest.matchAll(CONTRACTION_RE)) {
    if (match.index === undefined) continue
    blankCandidates.push({
      start: match.index,
      end: match.index + match[0].length,
      answer: match[0],
      kind: 'contraction'
    })
  }

  for (const match of rest.matchAll(CONJUNCTION_RE)) {
    if (match.index === undefined) continue
    blankCandidates.push({
      start: match.index,
      end: match.index + match[0].length,
      answer: match[0],
      kind: 'conjunction'
    })
  }

  // Practical vocab → letter-hint fill-ins (prefer longer phrases / head words)
  for (const item of vocab) {
    const parts = item.phrase.trim().split(/\s+/).filter(Boolean)
    const candidates = [item.phrase.trim(), ...(parts.length > 1 ? [parts[parts.length - 1]] : [])]
    for (const candidate of candidates) {
      if (candidate.length < 5 || /\s/.test(candidate)) continue
      if (!/^[A-Za-z][A-Za-z'-]*$/.test(candidate)) continue
      const match = new RegExp(`\\b${candidate.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').exec(rest)
      if (!match || match.index == null) continue
      const start = match.index
      const end = start + match[0].length
      if (blankCandidates.some((h) => !(end <= h.start || start >= h.end))) continue
      blankCandidates.push({
        start,
        end,
        answer: match[0],
        kind: 'letter-hint',
        thaiMeaning: item.thaiMeaning
      })
      break
    }
  }

  blankCandidates.sort((left, right) => left.start - right.start)
  const segments: RenderSegment[] = [
    {
      kind: 'blank',
      blank: {
        id: `gt1-${paragraphIndex}-${sentenceIndex}-transition`,
        kind: 'transition',
        answer: sentence.transition,
        options: transitionOptions(
          sentence.transition,
          paragraphIndex * 4 + sentenceIndex,
          TRANSITION_BANKS[register]
        ),
        sentenceIndex
      }
    }
  ]
  let cursor = 0
  let blankIndex = 0
  for (const candidate of blankCandidates) {
    if (candidate.start < cursor) continue
    if (candidate.start > cursor) segments.push({ kind: 'text', text: rest.slice(cursor, candidate.start) })
    if (candidate.kind === 'letter-hint') {
      segments.push({
        kind: 'blank',
        blank: {
          id: `gt1-${paragraphIndex}-${sentenceIndex}-letter-${blankIndex}`,
          kind: 'letter-hint',
          answer: candidate.answer,
          thaiMeaning: candidate.thaiMeaning,
          sentenceIndex
        }
      })
    } else {
      const options =
        candidate.kind === 'contraction'
          ? getContractionOptions(candidate.answer)
          : getConjunctionOptions(candidate.answer)
      segments.push({
        kind: 'blank',
        blank: {
          id: `gt1-${paragraphIndex}-${sentenceIndex}-${candidate.kind}-${blankIndex}`,
          kind: candidate.kind,
          answer: candidate.answer,
          options: [...new Set(options)],
          sentenceIndex
        }
      })
    }
    cursor = candidate.end
    blankIndex += 1
  }
  if (cursor < rest.length) segments.push({ kind: 'text', text: rest.slice(cursor) })
  return segments
}

const contractionReason = (answer: string): string =>
  `รูปย่อ (contraction): จดหมายแบบเป็นกันเองต้องใช้ “${answer}” เต็มรูปแบบพร้อม apostrophe ให้ถูกตำแหน่ง (เช่น I’m, don’t, can’t)`

const describeBlankReason = (blank: PracticeBlank): string => {
  if (blank.kind === 'letter-hint') {
    const mask = buildLetterHintMask(blank.answer)
    return `เติมคำศัพท์จากใบ้ “${mask.spacedMask}” — ความหมาย: ${blank.thaiMeaning} · คำที่ถูกคือ “${blank.answer}”`
  }
  if (blank.kind === 'transition') {
    return TRANSITION_REASONS[blank.answer] ?? 'คำเปิดประโยคต้องสื่อความเชื่อมโยงให้ตรงกับใจความของประโยค'
  }
  if (blank.kind === 'contraction') return contractionReason(blank.answer)
  const lower = normalizeApostrophe(blank.answer).toLowerCase()
  return CONJUNCTION_REASONS[lower] ?? 'คำเชื่อมต้องเลือกให้ตรงกับความสัมพันธ์ระหว่างสองใจความ'
}

export function GeneralTask1LetterPractice({ prompt, onSaveVocab }: PracticeProps) {
  const guidance = getRegisterGuidance(prompt.register)
  const [classification, setClassification] = useState<GeneralTask1Register | null>(null)
  const [classificationPassed, setClassificationPassed] = useState(false)
  const [started, setStarted] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [values, setValues] = useState<Record<string, string>>({})
  const [checked, setChecked] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [tutorialDismissed, setTutorialDismissed] = useState<Set<number>>(new Set())
  const [recallOpenSteps, setRecallOpenSteps] = useState<Set<number>>(new Set())
  const [recallDismissedSteps, setRecallDismissedSteps] = useState<Set<number>>(new Set())
  const [recallDrafts, setRecallDrafts] = useState<Record<number, string>>({})
  const [recallChecks, setRecallChecks] = useState<Record<number, WritingRecallCheck>>({})
  const [savedWords, setSavedWords] = useState<Set<string>>(() => new Set())

  const paragraph = prompt.paragraphs[stepIndex]
  const sentenceSegments = useMemo(
    () =>
      paragraph.sentences.map((sentence, index) =>
        buildSentenceSegments(sentence, prompt.register, stepIndex, index, prompt.practicalVocab)
      ),
    [paragraph, prompt.register, prompt.practicalVocab, stepIndex]
  )
  const blanks = sentenceSegments.flatMap((segments) =>
    segments.flatMap((segment) => (segment.kind === 'blank' ? [segment.blank] : []))
  )
  const transitionBlanks = blanks.filter((blank): blank is OptionPracticeBlank => blank.kind === 'transition')
  const isBlankCorrect = (blank: PracticeBlank) => {
    const given = (values[blank.id] || '').trim()
    if (blank.kind === 'letter-hint') {
      return given.replace(/\s+/g, '').toLowerCase() === blank.answer.replace(/\s+/g, '').toLowerCase()
    }
    return given === blank.answer
  }
  const correctCount = blanks.filter(isBlankCorrect).length
  const stepPassed = blanks.length > 0 && correctCount === blanks.length
  const wrongBlanks = checked ? blanks.filter((blank) => !isBlankCorrect(blank)) : []
  const allCompleted = completedSteps.size === prompt.paragraphs.length
  const modelLetter = assembleGeneralTask1ModelLetter(prompt)
  const modelWordCount = modelLetter.trim().match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu)?.length ?? 0
  const expectedRecallParagraph = paragraph.sentences.map((sentence) => sentence.text).join(' ')
  const showTutorial = started && !tutorialDismissed.has(stepIndex)
  const recallOpen = recallOpenSteps.has(stepIndex)
  const recallDismissed = recallDismissedSteps.has(stepIndex)
  const recallDraft = recallDrafts[stepIndex] ?? ''
  const recallCheck = recallChecks[stepIndex]

  const transitionSlotNumber = (blank: PracticeBlank) =>
    transitionBlanks.findIndex((item) => item.id === blank.id) + 1

  const blankLocationLabel = (blank: PracticeBlank) => {
    if (blank.kind === 'transition') return `คำเชื่อมต้นประโยค · ช่องที่ ${transitionSlotNumber(blank)}`
    if (blank.kind === 'contraction') return `รูปย่อในประโยคที่ ${blank.sentenceIndex + 1}`
    if (blank.kind === 'letter-hint') return `คำศัพท์ใบ้ตัวอักษรในประโยคที่ ${blank.sentenceIndex + 1}`
    return `คำเชื่อมในประโยคที่ ${blank.sentenceIndex + 1}`
  }

  const chooseClassification = (value: GeneralTask1Register) => {
    setClassification(value)
    setClassificationPassed(value === prompt.register)
  }

  const dismissTutorial = () => {
    setTutorialDismissed((current) => new Set(current).add(stepIndex))
  }

  const checkStep = () => {
    setChecked(true)
    if (!stepPassed) return
    setCompletedSteps((current) => new Set(current).add(stepIndex))
  }

  const goNext = () => {
    if (!stepPassed) return
    setChecked(false)
    if (stepIndex < prompt.paragraphs.length - 1) setStepIndex((current) => current + 1)
  }

  const openRecall = () => {
    setRecallOpenSteps((current) => new Set(current).add(stepIndex))
    setRecallDismissedSteps((current) => {
      const next = new Set(current)
      next.delete(stepIndex)
      return next
    })
  }

  const dismissRecall = () => {
    setRecallDismissedSteps((current) => new Set(current).add(stepIndex))
    setRecallOpenSteps((current) => {
      const next = new Set(current)
      next.delete(stepIndex)
      return next
    })
  }

  const updateRecallDraft = (value: string) => {
    setRecallDrafts((current) => ({ ...current, [stepIndex]: value }))
    setRecallChecks((current) => ({
      ...current,
      [stepIndex]: { attempted: false, passed: false, feedback: [] }
    }))
  }

  const checkRecall = () => {
    const passed = isWritingRecallExact(expectedRecallParagraph, recallDraft)
    setRecallChecks((current) => ({
      ...current,
      [stepIndex]: {
        attempted: true,
        passed,
        feedback: passed
          ? []
          : buildWritingRecallFeedback(expectedRecallParagraph, recallDraft, 'task1')
      }
    }))
  }

  return (
    <div className="gt1PracticeShell">
      <section className="gt1PromptCard">
        <p className="gt1Kicker">GENERAL TRAINING WRITING · TASK 1</p>
        <p>You should spend about 20 minutes on this task.</p>
        <h2>{prompt.situation}</h2>
        <p>{prompt.letterInstruction}</p>
        <ul>{prompt.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
        <p>Write at least 150 words.</p>
        <p>You do NOT need to write any addresses.</p>
        <p>Begin your letter as follows: <strong>{prompt.greeting}</strong></p>
      </section>

      <section className="gt1PatternRules">
        <div>
          <span>{guidance.rulesLabel}</span>
          <strong>{guidance.wordTarget}</strong>
        </div>
        <ul>
          {guidance.rules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </section>

      {!started ? (
        <section className="gt1ClassificationCard">
          <span className="gt1GateBadge">STEP 1 · IDENTIFY THE REGISTER</span>
          <h3>จดหมายฉบับนี้เป็นประเภทใด?</h3>
          <p>ดูว่าผู้รับคือใครและผู้เขียนมีความสัมพันธ์แบบใด ก่อนเลือกภาษาและคำลงท้าย</p>
          <div className="gt1RegisterOptions">
            {REGISTER_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={classification === option.value ? 'is-selected' : ''}
                onClick={() => chooseClassification(option.value)}
              >
                <strong>{option.label}</strong>
                <span>{option.hint}</span>
              </button>
            ))}
          </div>
          {classification ? (
            <div className={`gt1ClassificationFeedback ${classificationPassed ? 'is-correct' : 'is-wrong'}`}>
              {classificationPassed ? guidance.classificationCorrect : guidance.classificationWrong}
            </div>
          ) : null}
          <button
            type="button"
            className="gt1PrimaryButton"
            disabled={!classificationPassed}
            onClick={() => setStarted(true)}
          >
            ถูกแล้ว · เริ่มฝึกจดหมาย →
          </button>
        </section>
      ) : (
        <section className="gt1BuilderLayout">
          <div className="gt1BuilderMain">
            <div className="gt1Progress">
              {prompt.paragraphs.map((item, index) => (
                <button
                  key={item.bulletIndex}
                  type="button"
                  disabled={index > 0 && !completedSteps.has(index - 1)}
                  className={`${index === stepIndex ? 'is-current' : ''} ${completedSteps.has(index) ? 'is-done' : ''}`}
                  onClick={() => {
                    setStepIndex(index)
                    setChecked(false)
                  }}
                >
                  {completedSteps.has(index) ? '✓' : index + 1}
                  <span>Bullet {index + 1}</span>
                </button>
              ))}
            </div>

            <div className="gt1BulletCard">
              {showTutorial ? (
                <div className="gt1Tutorial" role="dialog" aria-label="คำแนะนำการเขียนย่อหน้า">
                  <div className="gt1TutorialBody">
                    <span className="gt1TutorialBadge">TUTORIAL · ย่อหน้า {stepIndex + 1}</span>
                    <p>{TUTORIAL_LINES[stepIndex] ?? TUTORIAL_LINES[TUTORIAL_LINES.length - 1]}</p>
                  </div>
                  <button type="button" className="gt1TutorialClose" onClick={dismissTutorial}>
                    เข้าใจแล้ว
                  </button>
                </div>
              ) : null}
              <span>ย่อหน้านี้ตอบ Bullet {stepIndex + 1} เท่านั้น</span>
              <strong>{prompt.bullets[paragraph.bulletIndex]}</strong>
            </div>

            <article className="gt1LetterPaper" key={stepIndex}>
              <p className="gt1Greeting">{prompt.greeting}</p>
              <p className="gt1LetterBody">
                {sentenceSegments.map((segments, sentenceIndex) => (
                  <Fragment key={`${paragraph.bulletIndex}-${sentenceIndex}`}>
                    {sentenceIndex > 0 ? ' ' : null}
                    {segments.map((segment, segmentIndex) => {
                      if (segment.kind === 'text') return <span key={segmentIndex}>{segment.text}</span>
                      const blank = segment.blank
                      if (blank.kind === 'transition') {
                        return (
                          <span
                            key={blank.id}
                            className={`gt1DropSlot ${checked ? (isBlankCorrect(blank) ? 'is-correct' : 'is-wrong') : ''}`}
                            onDragOver={(event) => event.preventDefault()}
                            onDrop={(event) => {
                              event.preventDefault()
                              setValues((current) => ({ ...current, [blank.id]: event.dataTransfer.getData('text/plain') }))
                              setChecked(false)
                            }}
                          >
                            {values[blank.id] || `คำเชื่อม ${transitionSlotNumber(blank)}`}
                          </span>
                        )
                      }
                      if (blank.kind === 'letter-hint') {
                        const stateClass = checked ? (isBlankCorrect(blank) ? 'is-correct' : 'is-incorrect') : ''
                        return (
                          <span key={blank.id} className="wgbBlankWrap gt1LetterHintWrap">
                            <LetterHintBlankInput
                              answer={blank.answer}
                              value={values[blank.id] || ''}
                              stateClass={stateClass}
                              thaiMeaning={blank.thaiMeaning}
                              saved={savedWords.has(blank.answer)}
                              onSaveToNotebook={
                                onSaveVocab
                                  ? ({ word, thaiMeaning }) => {
                                      onSaveVocab({ word, thaiMeaning })
                                      setSavedWords((current) => new Set(current).add(word))
                                    }
                                  : undefined
                              }
                              onChange={(next) => {
                                setValues((current) => ({ ...current, [blank.id]: next }))
                                setChecked(false)
                              }}
                            />
                            {checked && !isBlankCorrect(blank) ? (
                              <em className="wgbReveal">{blank.answer}</em>
                            ) : null}
                          </span>
                        )
                      }
                      return (
                        <select
                          key={blank.id}
                          value={values[blank.id] || ''}
                          className={checked ? (isBlankCorrect(blank) ? 'is-correct' : 'is-wrong') : ''}
                          onChange={(event) => {
                            setValues((current) => ({ ...current, [blank.id]: event.target.value }))
                            setChecked(false)
                          }}
                        >
                          <option value="">เลือก</option>
                          {blank.options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      )
                    })}
                  </Fragment>
                ))}
              </p>
              {stepIndex === prompt.paragraphs.length - 1 ? (
                <div className="gt1Closing">
                  <p>{prompt.signoff}</p>
                  <p>{prompt.senderName}</p>
                </div>
              ) : null}
            </article>

            {checked ? (
              <p className={`gt1StepFeedback ${stepPassed ? 'is-correct' : 'is-wrong'}`}>
                {stepPassed
                  ? `ถูกทั้งหมด ${correctCount}/${blanks.length} — เนื้อหาย่อหน้านี้ตอบ Bullet ${stepIndex + 1} โดยตรง`
                  : `ถูก ${correctCount}/${blanks.length} — ดูรายละเอียดช่องที่ยังผิดด้านล่าง แล้วแก้ทีละจุด`}
              </p>
            ) : null}

            {wrongBlanks.length > 0 ? (
              <div className="gt1MistakeList" role="alert">
                <strong>ช่องที่ยังผิด พร้อมเหตุผล ({wrongBlanks.length} จุด)</strong>
                <ul>
                  {wrongBlanks.map((blank) => (
                    <li key={blank.id}>
                      <span className="gt1MistakeWhere">{blankLocationLabel(blank)}</span>
                      <span className="gt1MistakeAnswer">
                        {values[blank.id]
                          ? <>คุณเลือก <em>“{values[blank.id]}”</em> — ต้องเป็น <strong>“{blank.answer}”</strong></>
                          : <>ยังไม่ได้เลือก — ต้องเป็น <strong>“{blank.answer}”</strong></>}
                      </span>
                      <span className="gt1MistakeReason">{describeBlankReason(blank)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {checked && stepPassed && !recallOpen ? (
              recallDismissed ? (
                <button type="button" className="gt1RecallReopen" onClick={openRecall}>
                  เปิดแบบฝึกเขียนย่อหน้านี้จากความจำ
                </button>
              ) : (
                <div className="gt1RecallPrompt" role="status">
                  <div>
                    <strong>ทำย่อหน้านี้ถูก 100% แล้ว — อยากลองเขียนเองไหม?</strong>
                    <p>
                      แนะนำสำหรับการจำโครงสร้าง ระบบจะไม่สนใจช่องว่าง แต่จะตรวจตัวพิมพ์ใหญ่ comma
                      เครื่องหมายวรรคตอน apostrophe รูปกริยา และทุกคำอย่างเคร่งครัด
                    </p>
                  </div>
                  <div>
                    <button type="button" className="gt1PrimaryButton" onClick={openRecall}>
                      ลองเขียน (แนะนำ)
                    </button>
                    <button type="button" className="gt1RecallSkip" onClick={dismissRecall}>
                      ไว้ทีหลัง
                    </button>
                  </div>
                </div>
              )
            ) : null}

            <div className="gt1BuilderActions">
              <button type="button" className="gt1CheckButton" onClick={checkStep}>ตรวจคำตอบ</button>
              <button type="button" className="gt1PrimaryButton" disabled={!checked || !stepPassed} onClick={goNext}>
                {stepIndex === prompt.paragraphs.length - 1 ? 'จบย่อหน้า ✓' : 'ไป Bullet ถัดไป →'}
              </button>
            </div>

            {allCompleted ? (
              <div className="gt1ModelReveal">
                <span>MODEL LETTER · {modelWordCount} WORDS</span>
                <pre>{modelLetter}</pre>
              </div>
            ) : null}
          </div>

          <aside className="gt1TransitionSidebar">
            {recallOpen ? (
              <section
                className={`gt1RecallCard ${recallCheck?.passed ? 'is-passed' : ''} ${
                  recallCheck?.attempted && !recallCheck.passed ? 'is-retry' : ''
                }`}
                aria-labelledby={`gt1-recall-${stepIndex}`}
              >
                <div className="gt1RecallHead">
                  <span aria-hidden="true">🧞</span>
                  <div>
                    <small>GENIE MEMORY CHECK</small>
                    <h3 id={`gt1-recall-${stepIndex}`}>เขียน {paragraph.label} จากความจำ</h3>
                  </div>
                </div>
                <p>
                  ช่องว่างไม่เป็นไร แต่ capitalization, comma, punctuation, apostrophe, hyphen,
                  รูปกริยา และข้อความต้องตรง 100%
                </p>
                <textarea
                  value={recallDraft}
                  disabled={recallCheck?.passed}
                  placeholder="พิมพ์ย่อหน้าที่เพิ่งทำจากความจำ…"
                  onChange={(event) => updateRecallDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') checkRecall()
                  }}
                />
                <div className="gt1RecallActions">
                  <button type="button" onClick={checkRecall} disabled={recallCheck?.passed}>
                    {recallCheck?.passed ? 'ตรง 100% แล้ว' : 'ตรวจงานเขียน'}
                  </button>
                  <button type="button" onClick={dismissRecall}>ปิดไว้ก่อน</button>
                </div>
                {recallCheck?.passed ? (
                  <div className="gt1RecallSuccess" role="status">
                    ถูกต้อง 100% — ตัวพิมพ์ใหญ่และเครื่องหมายครบทุกจุด
                  </div>
                ) : null}
                {recallCheck?.attempted && !recallCheck.passed ? (
                  <div className="gt1RecallFeedback" role="alert">
                    <strong>จุดที่ต้องแก้ พร้อมเหตุผล</strong>
                    <ul>
                      {recallCheck.feedback.map((feedback, index) => (
                        <li key={`${feedback}-${index}`}>{feedback}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </section>
            ) : null}
            <h3>TRANSITION WORDS</h3>
            <p>ลากคำเปิดไปวางต้นประโยคแต่ละช่อง</p>
            {transitionBlanks.map((blank, index) => (
              <div key={blank.id} className="gt1TransitionGroup">
                <span>ช่องที่ {index + 1}</span>
                <div>
                  {blank.options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      draggable
                      onDragStart={(event) => event.dataTransfer.setData('text/plain', option)}
                      onClick={() => {
                        setValues((current) => ({ ...current, [blank.id]: option }))
                        setChecked(false)
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </aside>
        </section>
      )}
    </div>
  )
}
