import { Fragment, useMemo, useState } from 'react'
import type { GeneralTask1Prompt, GeneralTask1Register } from './writingGeneralTask1Data'
import { assembleGeneralTask1ModelLetter, getRegisterGuidance } from './writingGeneralTask1Data'
import { WriteOutDrill } from './WriteOutDrill'
import {
  buildWritingRecallFeedback,
  isWritingRecallExact,
  type WritingRecallCheck
} from './writingParagraphRecall'
import { LetterHintBlankInput } from './LetterHintBlankInput'
import { buildLetterHintMask, resolveThaiMeaning } from './writingLetterHint'
import { VocabMeaningButton } from './VocabMeaningButton'
import {
  buildSentenceSegments,
  normalizeApostrophe,
  type OptionPracticeBlank,
  type PracticeBlank
} from './generalTask1Blanks'
import './GeneralTask1LetterPractice.css'

type PracticeProps = {
  prompt: GeneralTask1Prompt
  onSaveVocab?: (payload: { word: string; thaiMeaning: string }) => void
  /** Saves the whole assembled model letter as a single Notebook entry. */
  onSaveModelLetter?: (payload: { letter: string; title: string; register: string }) => void
}


const REGISTER_OPTIONS: Array<{ value: GeneralTask1Register; label: string; hint: string }> = [
  { value: 'formal', label: 'Formal', hint: 'ไม่รู้จักผู้รับเป็นการส่วนตัว' },
  { value: 'semi-formal', label: 'Semi-formal', hint: 'รู้จักผู้รับ แต่ความสัมพันธ์เป็นทางการ' },
  { value: 'informal', label: 'Informal', hint: 'เพื่อนหรือสมาชิกครอบครัว' }
]

const TUTORIAL_LINES = [
  'ย่อหน้าแรกของจดหมายตอบ Bullet 1 เท่านั้น — ร้อยทุกประโยคเป็นย่อหน้าเดียว อย่าเพิ่งพูดถึง Bullet อื่น',
  'ย่อหน้าที่สองต่อเนื่องจากย่อหน้าแรก และตอบ Bullet 2 ทั้งย่อหน้าเป็นก้อนเดียวกัน',
  'ย่อหน้าสุดท้ายตอบ Bullet 3 เพื่อปิดเนื้อหา แล้วจึงตามด้วยคำลงท้ายและชื่อผู้เขียน'
]



/**
 * Each opener's Thai meaning plus the *relationship* it signals between the
 * previous sentence and this one. The group is what makes a wrong pick
 * explainable: "you chose an adding word where the sentence turns".
 */
type TransitionMeta = { th: string; group: string; use: string }

const TRANSITION_META: Record<string, TransitionMeta> = {
  'First of all,': { th: 'อย่างแรกเลย', group: 'ลำดับความ', use: 'เปิดประเด็นหรือเหตุผลข้อแรกของย่อหน้า' },
  'To begin with,': { th: 'เริ่มจาก…ก่อน', group: 'ลำดับความ', use: 'เริ่มลำดับประเด็นแรกในสำนวนทางการ' },
  'Firstly,': { th: 'ประการแรก', group: 'ลำดับความ', use: 'จัดลำดับประเด็นแรก (ทางการกว่า First of all)' },
  'Secondly,': { th: 'ประการที่สอง', group: 'ลำดับความ', use: 'จัดลำดับประเด็นที่สองต่อจาก Firstly' },
  'Then,': { th: 'จากนั้น', group: 'ลำดับความ', use: 'บอกลำดับเหตุการณ์ถัดไป' },
  'Afterwards,': { th: 'หลังจากนั้น', group: 'ลำดับความ', use: 'บอกสิ่งที่เกิดขึ้นภายหลัง' },
  'Finally,': { th: 'สุดท้ายนี้', group: 'ลำดับความ', use: 'ปิดท้ายด้วยประเด็นสุดท้ายของย่อหน้า' },
  'Also,': { th: 'อีกอย่างหนึ่ง', group: 'เสริมความ', use: 'เพิ่มข้อมูลที่ไปทางเดียวกับประโยคก่อนหน้า' },
  'In addition,': { th: 'นอกจากนี้', group: 'เสริมความ', use: 'เพิ่มข้อมูลในสำนวนกึ่งทางการ/ทางการ' },
  'Furthermore,': { th: 'ยิ่งไปกว่านั้น', group: 'เสริมความ', use: 'เสริมน้ำหนักข้อมูลเดิมให้หนักแน่นขึ้น (ทางการ)' },
  'Moreover,': { th: 'ยิ่งไปกว่านั้น', group: 'เสริมความ', use: 'เพิ่มประเด็นสนับสนุนที่สำคัญ (ทางการ)' },
  'Most importantly,': { th: 'ที่สำคัญที่สุดคือ', group: 'เสริมความ', use: 'เน้นประเด็นที่สำคัญที่สุด' },
  'In particular,': { th: 'โดยเฉพาะอย่างยิ่ง', group: 'เจาะจงประเด็น', use: 'เจาะจงประเด็นที่โดดเด่นเป็นพิเศษ' },
  'For example,': { th: 'ตัวอย่างเช่น', group: 'ยกตัวอย่าง', use: 'ยกตัวอย่างสนับสนุนประโยคก่อนหน้า' },
  'For instance,': { th: 'ยกตัวอย่างเช่น', group: 'ยกตัวอย่าง', use: 'ยกตัวอย่างในสำนวนทางการ' },
  'However,': { th: 'อย่างไรก็ตาม', group: 'ขัดแย้ง', use: 'พลิกความคาดหวัง หรือบอกข้อจำกัดที่สวนทางกับประโยคก่อนหน้า' },
  'Nevertheless,': { th: 'ถึงกระนั้นก็ตาม', group: 'ขัดแย้ง', use: 'ยอมรับข้อขัดแย้งแต่ยังยืนยันใจความหลัก (ทางการ)' },
  'Unfortunately,': { th: 'น่าเสียดายที่', group: 'ขัดแย้ง', use: 'บอกเรื่องที่ไม่ดีหรือน่าเสียดาย ซึ่งมักสวนทางกับความคาดหวัง' },
  'Consequently,': { th: 'ด้วยเหตุนี้', group: 'เหตุ-ผล', use: 'บอกผลที่ตามมาอย่างเป็นเหตุเป็นผล (ทางการ)' },
  'As a result,': { th: 'ผลก็คือ', group: 'เหตุ-ผล', use: 'บอกผลลัพธ์ที่ตามมาจากเหตุก่อนหน้า' },
  'Therefore,': { th: 'ดังนั้น', group: 'เหตุ-ผล', use: 'สรุปผลเชิงเหตุผลหรือข้อเรียกร้อง (ทางการ)' },
  'Luckily,': { th: 'โชคดีที่', group: 'แสดงทัศนคติ', use: 'บอกเหตุการณ์ที่โชคดี' },
  'Honestly,': { th: 'พูดตามตรง', group: 'แสดงทัศนคติ', use: 'บอกความรู้สึกจริงใจหรือสารภาพตรง ๆ' },
  'Actually,': { th: 'จริง ๆ แล้ว', group: 'แสดงทัศนคติ', use: 'เสริมข้อเท็จจริงหรือแก้ความเข้าใจอย่างสุภาพ' },
  'In fact,': { th: 'อันที่จริง', group: 'แสดงทัศนคติ', use: 'เน้นย้ำข้อเท็จจริงที่หนักแน่นขึ้น' },
  'Of course,': { th: 'แน่นอนว่า', group: 'แสดงทัศนคติ', use: 'ยืนยันหรือให้ความมั่นใจอย่างสุภาพ' },
  'By the way,': { th: 'อ้อ อีกเรื่องหนึ่ง', group: 'เปลี่ยนเรื่อง', use: 'เปลี่ยนไปเรื่องใหม่แบบเป็นกันเอง' },
  'Anyway,': { th: 'เอาเป็นว่า', group: 'เปลี่ยนเรื่อง', use: 'ดึงกลับเข้าประเด็นหลักหรือเริ่มย่อหน้าสรุป' },
  'As you may remember,': { th: 'อย่างที่คุณอาจจำได้', group: 'อ้างสิ่งที่รู้ร่วมกัน', use: 'เชื่อมความสัมพันธ์เดิมกับผู้รับอย่างสุภาพ' },
  'As you know,': { th: 'อย่างที่คุณทราบ', group: 'อ้างสิ่งที่รู้ร่วมกัน', use: 'อ้างถึงข้อมูลที่ทั้งสองฝ่ายทราบอยู่แล้ว' },
  'If possible,': { th: 'ถ้าเป็นไปได้', group: 'ขอร้องอย่างสุภาพ', use: 'ขึ้นต้นคำขอร้องอย่างสุภาพ' }
}

type ConjunctionMeta = { th: string; group: string; use: string }

const CONJUNCTION_META: Record<string, ConjunctionMeta> = {
  and: { th: 'และ', group: 'เสริมความ', use: 'เชื่อมสองใจความที่เท่ากันเข้าด้วยกัน (S + V, and + S + V)' },
  but: { th: 'แต่', group: 'ขัดแย้ง', use: 'แสดงความขัดแย้งระหว่างสองใจความ' },
  so: { th: 'จึง / ดังนั้น', group: 'เหตุ-ผล', use: 'บอกผลลัพธ์ที่ตามมาจากเหตุก่อนหน้า' },
  'so that': { th: 'เพื่อที่จะ', group: 'วัตถุประสงค์', use: 'บอกวัตถุประสงค์ของการกระทำ' },
  because: { th: 'เพราะว่า', group: 'เหตุผล', use: 'ขึ้นต้น clause ที่บอกเหตุผล' },
  although: { th: 'แม้ว่า', group: 'ขัดแย้ง', use: 'ยอมรับข้อเท็จจริงที่ขัดแย้งกับใจความหลัก' },
  when: { th: 'เมื่อ / ตอนที่', group: 'เวลา', use: 'บอกช่วงเวลาที่เหตุการณ์เกิดขึ้น' },
  while: { th: 'ขณะที่ / ในขณะที่', group: 'เวลา/ขัดแย้ง', use: 'บอกสองเหตุการณ์ที่เกิดพร้อมกันหรือขัดแย้งกัน' },
  since: { th: 'เนื่องจาก / ตั้งแต่', group: 'เหตุผล', use: 'บอกเหตุผลหรือจุดเริ่มของเวลา' },
  if: { th: 'ถ้า', group: 'เงื่อนไข', use: 'ขึ้นต้นเงื่อนไข' },
  whether: { th: 'ว่า…หรือไม่', group: 'ทางเลือก', use: 'ใช้เมื่อมีสองทางเลือก (…or…)' },
  which: { th: 'ซึ่ง', group: 'ขยายความ', use: 'relative pronoun ที่ขยายคำนามหรือทั้งประโยคก่อนหน้า (…, which + verb)' },
  who: { th: 'ผู้ซึ่ง', group: 'ขยายความ', use: 'relative pronoun ที่ขยายคน' },
  that: { th: 'ที่ / ว่า', group: 'ขยายความ', use: 'ขยายคำนามแบบเจาะจง หรือขึ้นต้น noun clause' }
}


const contractionReason = (answer: string): string =>
  `รูปย่อ (contraction): จดหมายแบบเป็นกันเองต้องใช้ “${answer}” เต็มรูปแบบพร้อม apostrophe ให้ถูกตำแหน่ง (เช่น I’m, don’t, can’t)`

/** A wrong answer is explained as: what you picked, what it does, and why this
 *  slot needs a different relationship — grounded in the two real sentences. */
type BlankExplanation = {
  context?: { before?: string; here: string; thaiHere?: string; thaiBefore?: string }
  chosen?: { word: string; th: string; group: string; use: string }
  correct: { word: string; th: string; group: string; use: string }
  /** Why the correct word fits *this* sentence, argued from the Thai meaning. */
  meaningReason?: string
  verdict: string
}

const transitionMeta = (word: string): TransitionMeta | undefined => TRANSITION_META[word.trim()]

const conjunctionMeta = (word: string): ConjunctionMeta | undefined =>
  CONJUNCTION_META[normalizeApostrophe(word).trim().toLowerCase()]

/** Trim a sentence for display so the card stays readable. */
const clip = (text: string, max = 120) => {
  const clean = text.trim()
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean
}

/** The Thai clue word a learner should look for to justify each connector. */
const THAI_CONNECTOR_CUE: Record<string, string> = {
  because: 'เพราะว่า',
  although: 'แม้ว่า',
  while: 'ขณะที่',
  when: 'เมื่อ',
  since: 'เนื่องจาก / ตั้งแต่',
  which: 'ซึ่ง',
  and: 'และ',
  but: 'แต่',
  so: 'จึง',
  'so that': 'เพื่อที่จะ',
  if: 'ถ้า',
  whether: 'ว่า…หรือไม่',
  who: 'ผู้ซึ่ง',
  that: 'ที่ / ว่า'
}

const buildBlankExplanation = (
  blank: PracticeBlank,
  chosenRaw: string,
  sentences: readonly { text: string; thai: string }[]
): BlankExplanation | null => {
  if (blank.kind === 'contraction' || blank.kind === 'letter-hint') return null
  const chosen = chosenRaw.trim()
  const hereSentence = sentences[blank.sentenceIndex]
  const beforeSentence = blank.sentenceIndex > 0 ? sentences[blank.sentenceIndex - 1] : undefined
  const here = hereSentence?.text
  const before = beforeSentence?.text
  const lookup = blank.kind === 'transition' ? transitionMeta : conjunctionMeta

  const correctMeta = lookup(blank.answer)
  if (!correctMeta) return null
  const chosenMeta = chosen ? lookup(chosen) : undefined

  // A transition links this sentence to the previous one; a conjunction links the
  // two halves of this sentence. The explanation has to say the right one.
  const isTransition = blank.kind === 'transition'
  const linkedThing = isTransition
    ? before
      ? 'กับประโยคก่อนหน้า'
      : 'ในฐานะประโยคเปิดย่อหน้า'
    : 'ระหว่างสองใจความในประโยคนี้'

  const sameGroup = chosenMeta?.group === correctMeta.group
  const verdict = !chosen
    ? `ช่องนี้ต้องการคำที่สื่อความสัมพันธ์แบบ “${correctMeta.group}” ${linkedThing}`
    : chosenMeta
      ? sameGroup
        ? `ทั้งสองคำอยู่กลุ่ม “${correctMeta.group}” เหมือนกัน แต่ระดับความเป็นทางการ/ความเข้มของประโยคนี้เข้ากับ “${blank.answer}” มากกว่า`
        : `ความสัมพันธ์ ${linkedThing} ไม่ใช่แบบ “${chosenMeta.group}” แต่เป็นแบบ “${correctMeta.group}” จึงต้องใช้ “${blank.answer}”`
      : `“${chosen}” ไม่เข้ากับความสัมพันธ์แบบ “${correctMeta.group}” ที่ช่องนี้ต้องการ`

  // Argue from the Thai meaning of this exact sentence, not from the abstract
  // group name — the learner should be able to point at the Thai and see it.
  const cue = THAI_CONNECTOR_CUE[normalizeApostrophe(blank.answer).trim().toLowerCase()]
  const thaiHere = hereSentence?.thai
  const meaningReason = thaiHere
    ? cue
      ? `อ่านคำแปลไทยของประโยคนี้: ใจความคือ “${thaiHere}” — ตรงจุดเชื่อมนั้นภาษาไทยใช้คำว่า “${cue}” ซึ่งตรงกับ “${blank.answer}” พอดี จึงต้องเติม “${blank.answer}”`
      : `อ่านคำแปลไทยของประโยคนี้: ใจความคือ “${thaiHere}” — ความหมายนี้ต้องการคำเปิดที่สื่อ “${correctMeta.th}” จึงต้องใช้ “${blank.answer}”`
    : undefined

  return {
    // The previous sentence only matters for an opener; a conjunction is judged inside its own sentence.
    context: here
      ? {
          before: isTransition && before ? clip(before) : undefined,
          here: clip(here),
          thaiHere,
          thaiBefore: isTransition ? beforeSentence?.thai : undefined
        }
      : undefined,
    chosen: chosenMeta ? { word: chosen, ...chosenMeta } : undefined,
    correct: { word: blank.answer, ...correctMeta },
    meaningReason,
    verdict
  }
}

const describeBlankReason = (blank: PracticeBlank): string => {
  if (blank.kind === 'letter-hint') {
    const mask = buildLetterHintMask(blank.answer)
    return `เติมคำศัพท์จากใบ้ “${mask.spacedMask}” — ความหมาย: ${blank.thaiMeaning} · คำที่ถูกคือ “${blank.answer}”`
  }
  if (blank.kind === 'transition') {
    const meta = transitionMeta(blank.answer)
    return meta ? `${meta.th} — ${meta.use}` : 'คำเปิดประโยคต้องสื่อความเชื่อมโยงให้ตรงกับใจความของประโยค'
  }
  if (blank.kind === 'contraction') return contractionReason(blank.answer)
  const meta = conjunctionMeta(blank.answer)
  return meta ? `${meta.th} — ${meta.use}` : 'คำเชื่อมต้องเลือกให้ตรงกับความสัมพันธ์ระหว่างสองใจความ'
}

export function GeneralTask1LetterPractice({ prompt, onSaveVocab, onSaveModelLetter }: PracticeProps) {
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
  const [drillOpen, setDrillOpen] = useState(false)
  const [drillDone, setDrillDone] = useState(false)
  const [letterSaved, setLetterSaved] = useState(false)

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
  const saveModelLetter = () => {
    if (!onSaveModelLetter || letterSaved) return
    onSaveModelLetter({ letter: modelLetter, title: prompt.title, register: prompt.register })
    setLetterSaved(true)
  }
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
                      /** TH pill for any word blank — Thai first, English behind a reveal. */
                      const meaningButton = (word: string, thaiMeaning?: string) => {
                        const clean = (word || '').trim()
                        if (!clean) return null
                        const gloss = resolveThaiMeaning(clean, thaiMeaning)
                        if (!gloss) return null
                        return (
                          <VocabMeaningButton
                            word={clean}
                            thaiMeaning={gloss}
                            saved={savedWords.has(clean)}
                            onSaveToNotebook={
                              onSaveVocab
                                ? ({ word: w, thaiMeaning: th }) => {
                                    onSaveVocab({ word: w, thaiMeaning: th })
                                    setSavedWords((current) => new Set(current).add(w))
                                  }
                                : undefined
                            }
                          />
                        )
                      }
                      if (blank.kind === 'transition') {
                        return (
                          <span key={blank.id} className="wgbBlankWrap">
                            <span
                              className={`gt1DropSlot ${checked ? (isBlankCorrect(blank) ? 'is-correct' : 'is-wrong') : ''}`}
                              onDragOver={(event) => event.preventDefault()}
                              onDrop={(event) => {
                                event.preventDefault()
                                setValues((current) => ({
                                  ...current,
                                  [blank.id]: event.dataTransfer.getData('text/plain')
                                }))
                                setChecked(false)
                              }}
                            >
                              {values[blank.id] || `คำเชื่อม ${transitionSlotNumber(blank)}`}
                            </span>
                            {meaningButton(blank.answer)}
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
                              thaiMeaning={resolveThaiMeaning(blank.answer, blank.thaiMeaning)}
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
                        <span key={blank.id} className="wgbBlankWrap">
                          <select
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
                          {meaningButton(blank.answer)}
                        </span>
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
                  {wrongBlanks.map((blank) => {
                    const explanation = buildBlankExplanation(blank, values[blank.id] || '', paragraph.sentences)
                    return (
                      <li key={blank.id}>
                        <span className="gt1MistakeWhere">{blankLocationLabel(blank)}</span>
                        <span className="gt1MistakeAnswer">
                          {values[blank.id]
                            ? <>คุณเลือก <em>“{values[blank.id]}”</em> — ต้องเป็น <strong>“{blank.answer}”</strong></>
                            : <>ยังไม่ได้เลือก — ต้องเป็น <strong>“{blank.answer}”</strong></>}
                        </span>
                        {explanation ? (
                          <span className="gt1MistakeWhy">
                            {explanation.context ? (
                              <span className="gt1MistakeContext">
                                {explanation.context.before ? (
                                  <span className="gt1MistakeContextLine">
                                    <b>ประโยคก่อนหน้า:</b> {explanation.context.before}
                                  </span>
                                ) : null}
                                {explanation.context.thaiBefore ? (
                                  <span className="gt1MistakeContextLine is-thai">
                                    <b>แปลไทย:</b> {explanation.context.thaiBefore}
                                  </span>
                                ) : null}
                                <span className="gt1MistakeContextLine">
                                  <b>ประโยคนี้:</b> {explanation.context.here}
                                </span>
                                {explanation.context.thaiHere ? (
                                  <span className="gt1MistakeContextLine is-thai">
                                    <b>แปลไทย:</b> {explanation.context.thaiHere}
                                  </span>
                                ) : null}
                              </span>
                            ) : null}
                            {explanation.chosen ? (
                              <span className="gt1MistakeRow is-wrong">
                                <b>✗ {explanation.chosen.word}</b> ({explanation.chosen.th}) · กลุ่ม “{explanation.chosen.group}” —{' '}
                                {explanation.chosen.use}
                              </span>
                            ) : null}
                            <span className="gt1MistakeRow is-right">
                              <b>✓ {explanation.correct.word}</b> ({explanation.correct.th}) · กลุ่ม “{explanation.correct.group}” —{' '}
                              {explanation.correct.use}
                            </span>
                            {explanation.meaningReason ? (
                              <span className="gt1MistakeMeaning">{explanation.meaningReason}</span>
                            ) : null}
                            <span className="gt1MistakeVerdict">{explanation.verdict}</span>
                          </span>
                        ) : (
                          <span className="gt1MistakeReason">{describeBlankReason(blank)}</span>
                        )}
                      </li>
                    )
                  })}
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
              <>
                {/* The model is hidden while the write-out drill runs, otherwise
                    the learner would just copy it off the screen. */}
                {drillOpen && !drillDone ? null : (
                  <div className="gt1ModelReveal">
                    <span>MODEL LETTER · {modelWordCount} WORDS</span>
                    <pre>{modelLetter}</pre>
                    <div className="gt1ModelActions">
                      <button
                        type="button"
                        className="gt1ModelSave"
                        disabled={letterSaved || !onSaveModelLetter}
                        onClick={saveModelLetter}
                      >
                        {letterSaved ? '✓ บันทึกลง Notebook แล้ว' : '💾 บันทึกจดหมายฉบับเต็มลง Notebook'}
                      </button>
                      {!drillOpen ? (
                        <button type="button" className="gt1ModelDrill" onClick={() => setDrillOpen(true)}>
                          ✍️ อยากลองเขียนเอง
                        </button>
                      ) : null}
                    </div>
                  </div>
                )}

                {drillOpen ? (
                  <WriteOutDrill
                    groupNoun="Bullet"
                    groups={prompt.paragraphs.map((paragraph) => ({
                      label: paragraph.label,
                      sentences: paragraph.sentences.map((sentence) => ({
                        text: sentence.text,
                        thai: sentence.thai
                      }))
                    }))}
                    onComplete={() => setDrillDone(true)}
                  />
                ) : null}

                {/* Completed the drill without ever saving — offer it once more. */}
                {drillDone && !letterSaved && onSaveModelLetter ? (
                  <div className="gt1SavePrompt" role="status">
                    <strong>เขียนครบทั้งฉบับแล้ว — เก็บจดหมายนี้ไว้ทบทวนไหม?</strong>
                    <button type="button" className="gt1ModelSave" onClick={saveModelLetter}>
                      💾 บันทึกลง Notebook
                    </button>
                  </div>
                ) : null}
              </>
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
