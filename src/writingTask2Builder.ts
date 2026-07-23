// Guided, step-by-step IELTS Writing Task 2 essay builder.
//
// Parallel to writingGuidedBuilder.ts (Task 1), but with its own schema because Task 2 has
// no chart and uses intro/body1/body2/body3/conclusion roles. Dense exercises target:
//   - ~50 `type` blanks  — productive recall (verb conjugation, plurals, gerunds/participles)
//   - ~70 `select` blanks — MCQ dropdowns (article, adj/adv/noun choice, transition, punctuation)
// Gaps land roughly every 3–4 content words so learners drill the whole grammar surface.
//
// Legacy kinds still supported (`comma`, `drag`, `punct`) for older sparse exercises.
//
// Reconstructing every blank's correct answer must reproduce the matching essay text in
// writingTask2Data.ts EXACTLY (see assembleTask2Essay).

import type { WritingTask2Paragraph, WritingTask2Role } from './writingTask2Data'
import { buildDetailedThaiExplain } from './writingLetterHint'

export type Wgb2Focus =
  | 'verb-tense'
  | 'plural'
  | 'noun'
  | 'adjective'
  | 'adverb'
  | 'transition'
  | 'article'
  | 'comma'
  | 'participle'
  | 'punct'
  | 'word-choice'
  | 'letter-hint'

// Sentinel option for article blanks where no article should be inserted at all.
export const WGB2_NO_ARTICLE = '(ไม่ต้องใส่)'

export type Wgb2SelectBlank = {
  kind: 'select'
  id: string
  options: string[]
  answer: string
  acceptedAnswers?: string[]
  focus: Wgb2Focus
  explain?: string
}

export type Wgb2TypeBlank = {
  kind: 'type'
  id: string
  base: string
  answers: string[]
  focus: Wgb2Focus
  explain?: string
  /** Thai gloss for letter-hint TH button / notebook save */
  thaiMeaning?: string
}

export type Wgb2CommaBlank = {
  kind: 'comma'
  id: string
  chunks: string[]
  correctGap: number
  focus: 'comma'
  explain?: string
}

export type Wgb2DragBlank = {
  kind: 'drag'
  id: string
  options: string[]
  answer: string
  acceptedAnswers?: string[]
  focus: 'transition'
  explain?: string
}

export type Wgb2PunctChoice = 'comma' | 'period' | 'none' | 'semicolon'

export type Wgb2PunctBlank = {
  kind: 'punct'
  id: string
  options: Wgb2PunctChoice[]
  answer: Wgb2PunctChoice
  focus: 'punct'
  explain?: string
}

export const WGB2_PUNCT_SYMBOL: Record<Wgb2PunctChoice, string> = {
  comma: ',',
  period: '.',
  none: '∅',
  semicolon: ';'
}

export const WGB2_PUNCT_LABEL_TH: Record<Wgb2PunctChoice, string> = {
  comma: 'comma ( , )',
  period: 'full stop ( . )',
  none: 'ไม่ต้องใส่',
  semicolon: 'semicolon ( ; )'
}

export type Wgb2Blank = Wgb2SelectBlank | Wgb2TypeBlank | Wgb2CommaBlank | Wgb2DragBlank | Wgb2PunctBlank

export type Wgb2Segment = { kind: 'text'; text: string } | { kind: 'blank'; blank: Wgb2Blank }

export type Wgb2Step = {
  id: string
  role: WritingTask2Role
  labelTh: string
  hintTh?: string
  segments: Wgb2Segment[]
}

export type Wgb2Exercise = {
  id: string
  promptId: string
  steps: Wgb2Step[]
}

// ── authoring helpers ────────────────────────────────────────────────
const t2 = (text: string): Wgb2Segment => ({ kind: 'text', text })
const sel2 = (
  id: string,
  options: string[],
  answer: string,
  focus: Wgb2Focus,
  explain?: string
): Wgb2Segment => ({ kind: 'blank', blank: { kind: 'select', id, options, answer, focus, explain } })
const typ2 = (
  id: string,
  base: string,
  answers: string[],
  focus: Wgb2Focus,
  explain?: string
): Wgb2Segment => ({ kind: 'blank', blank: { kind: 'type', id, base, answers, focus, explain } })
const _comma2 = (
  id: string,
  chunks: string[],
  correctGap: number,
  explain?: string
): Wgb2Segment => ({ kind: 'blank', blank: { kind: 'comma', id, chunks, correctGap, focus: 'comma', explain } })
void _comma2
const drag2 = (
  id: string,
  options: string[],
  answer: string,
  explain?: string
): Wgb2Segment => ({ kind: 'blank', blank: { kind: 'drag', id, options, answer, focus: 'transition', explain } })
const punc2 = (
  id: string,
  options: Wgb2PunctChoice[],
  answer: Wgb2PunctChoice,
  explain?: string
): Wgb2Segment => ({ kind: 'blank', blank: { kind: 'punct', id, options, answer, focus: 'punct', explain } })

export const WGB2_ROLE_LABEL_TH: Record<WritingTask2Role, string> = {
  intro: 'Introduction',
  body1: 'Body Paragraph 1',
  body2: 'Body Paragraph 2',
  body3: 'Body Paragraph 3',
  conclusion: 'Conclusion'
}

export const WGB2_STEP_SHORT: Record<WritingTask2Role, string> = {
  intro: 'Intro',
  body1: 'Body 1',
  body2: 'Body 2',
  body3: 'Body 3',
  conclusion: 'Conclusion'
}

// ── coach copy — one message per role / per focus, reused across every essay ──────────
export const WGB2_STEP_COACH_TH: Record<WritingTask2Role, string> = {
  intro:
    'Introduction วางจุดยืน — ช่องว่างหนาแน่น (~ทุก 3–4 คำ) ให้เช็ควน: กริยา/tense · คำนามเอกพจน์-พหูพจน์ · a/the/ไม่ใส่ · adj vs adv · คำเชื่อม · วรรคตอน แล้วอ่านทั้งประโยครอบช่องก่อนตอบ',
  body1:
    'Body 1 (มักเป็นมุมตรงข้าม/concession) — ไล่ทีละช่อง: transition ให้ตรงความหมาย · verb form · คำนาม/คุณศัพท์/กริยาวิเศษณ์ · article · punctuation อย่าเดาจาก "คำที่ดูถูก" โดยไม่อ่านบริบท',
  body2:
    'Body 2 (มักเป็นความเห็นเรา + เหตุผล) — เน้น parallel forms (-ing ให้ขนานกัน) · passive/active · which-clause กับ comma · การเลือก noun/adj/adv ให้ตรงตำแหน่งไวยากรณ์',
  body3:
    'Body 3 (ถ้ามี) ขยายด้วยตัวอย่างเจาะจง — เช็คเหมือนย่อหน้าอื่น และระวัง agreement ของประธานยาว ๆ กับกริยา',
  conclusion:
    'Conclusion สรุปจุดยืน — มักมี although/while + ความเห็นหลัก; เช็ค plural · article · transition · comma หน้า as/which แล้วตรวจว่า กริยาหลังสรุปตรง tense กับจุดยืนทั้งเรียงความ'
}

export const WGB2_BLANK_COACH_TH: Record<Wgb2Focus, string> = {
  'verb-tense':
    'แยกเคสก่อนผัน: ① passive = be + V3 (has been argued) ② gerund ประธาน/หลัง for,on,by = V-ing ③ หลัง modal/to = base form ④ ประธานพหูพจน์ไม่เติม -s · เอกพจน์เติม -s — ผิดแล้วดูคำอธิบาย “ทำไม V-ing / V-ed”',
  plural:
    'ดูตัวชี้นำจำนวน: many/these/several/their → พหูพจน์; a/an/each/every → เอกพจน์; นามนับไม่ได้ (information, evidence, research) ไม่เติม -s; นามพหูพจน์ไม่ปกติ (people, children) ไม่เติม -s ซ้ำ',
  noun:
    'ช่องนี้ต้องการ "คำนาม" ไม่ใช่คำคุณศัพท์/กริยา เช่น หลัง article (a/the) หรือหลัง adjective (practical ___) ต้องเป็น noun; ถ้าบริบทเป็นนามนามธรรมมักไม่เติม -s (relevance, society ในความหมายทั่วไป)',
  adjective:
    'ช่องนี้ต้องการ "คำคุณศัพท์" ขยายคำนามที่ตามมา หรืออยู่หลัง linking verb (is/remains/appear + adj) เช่น cultural identity, modern buildings, remains essential — อย่าเลือก noun (culture) หรือ adverb (culturally) ถ้าโครงสร้างเรียก adjective',
  adverb:
    'ช่องนี้ต้องการ "คำกริยาวิเศษณ์" ขยายกริยา/คุณศัพท์/ทั้งประโยค มักลงท้าย -ly เช่น widely argued, personally believe, entirely on — อย่าเลือก adjective (wide/personal) เมื่อตำแหน่งทำหน้าที่ขยายกริยา',
  transition:
    'อ่านประโยคก่อน–หลัง: ① ขัดแย้ง → However / while / whereas ② ยกตัวอย่าง → For example / For instance ③ ผลลัพธ์ → Therefore / As a result ④ เสริม → Moreover / Furthermore / and — เลือกคำที่ตรงความสัมพันธ์เชิงความหมาย ไม่ใช่แค่คำที่ดูเป็นวิชาการ',
  article:
    'กฎนามทั่วไป (ไม่มี the): ① นับได้ + พหูพจน์ → ไม่ใส่ the เช่น cities, students ② นับไม่ได้ → ไม่ใส่ the เช่น education, research — ใส่ the เมื่อเจาะจงสิ่งที่รู้กันแล้วเท่านั้น',
  comma:
    'แตะช่องว่างที่ควรมีจุลภาค: ① หลังวลีขึ้นต้นประโยค (However, … / In conclusion, …) ② หน้า which-clause แบบไม่จำกัดความ (… buildings, which …) ③ คั่นรายการหรือเชื่อมอนุประโยคยาว — ห้ามใส่ comma คั่นประธานกับกริยาตรง ๆ',
  participle:
    'V-ing vs V-ed หน้าคำนาม: V-ing = กำลังเกิด/active (growing population) · V-ed/V3 = ถูกกระทำ/เสร็จแล้ว (preserved buildings) — หลัง be ใน passive ต้องเป็น V3 เสมอ',
  punct:
    'เลือกเครื่องหมายให้ตรงจังหวะประโยค: , คั่นวลี/อนุประโยคในประโยคเดียว · . จบความคิดสมบูรณ์ · ; เชื่อมสองประโยคสมบูรณ์ที่เกี่ยวกันแน่น (มักก่อน however/therefore) · ถ้าไม่ต้องใส่ ให้เลือกตัวเลือกว่าง/∅',
  'word-choice':
    'อ่านทั้งประโยคแล้วเลือกคำที่ทำให้ทั้งความหมายและชนิดคำถูกต้อง จากนั้นตรวจว่าคำนั้นเชื่อมกับคำก่อนและหลังอย่างเป็นธรรมชาติ',
  'letter-hint':
    'ช่องคำศัพท์แบบใบ้ตัวอักษร: เห็น 2–3 ตัวแรกแล้วเติมตัวที่เหลือให้ครบ (เช่น mot_ _ _ _ _ _ _ → motivation) — สะกดให้ครบทั้งคำและตรงบริบท'
}

/** Beautiful article mini-guide — shown when focusing an article blank. */
export const WGB2_ARTICLE_GUIDE = {
  titleTh: 'กฎ The แบบง่าย',
  subtitleTh: 'นามทั่วไป — เมื่อไหร่ไม่ใส่ the',
  rows: [
    {
      whenTh: 'นับได้ + พหูพจน์',
      ruleTh: 'ไม่ใส่ the',
      exampleEn: 'cities · students · buildings',
      exampleTh: 'พูดถึงของพวกนี้แบบทั่วไป'
    },
    {
      whenTh: 'นับไม่ได้',
      ruleTh: 'ไม่ใส่ the',
      exampleEn: 'education · research · society',
      exampleTh: 'นามเอกพจน์แบบนามธรรม/ทั่วไป'
    }
  ],
  tipTh: 'ใส่ the เฉพาะเมื่อเจาะจงสิ่งที่รู้กันแล้ว เช่น the past, the best way, the following paragraphs'
} as const

const looksUncountableExplain = (explain: string) =>
  /นับไม่ได้|uncountable|นามนามธรรม|นามธรรม|นามนามธรรม|นับไม่/i.test(explain)

const looksPluralGeneralExplain = (explain: string) =>
  /พหูพจน์|plural|หลายแห่ง|หลายคน|หลายชิ้น|หลายรูปแบบ|หลายประเทศ|หลายย่อหน้า|หลายรุ่น|ทั่วไปหลาย/i.test(
    explain
  )

/**
 * Wrong-answer Thai for article blanks — teaches the general-noun rule
 * (plural general / uncountable → no "the").
 */
export const getWgb2ArticleWrongExplain = (
  blank: Extract<Wgb2Blank, { kind: 'select' }>,
  userAnswer: string
): string => {
  const correct = blank.answer
  const chosen = (userAnswer || '').trim()
  const explain = blank.explain || ''
  const choseThe = chosen === 'the'
  const choseA = chosen === 'a' || chosen === 'an'
  const choseNone = chosen === WGB2_NO_ARTICLE || chosen === ''
  const correctNone = correct === WGB2_NO_ARTICLE || correct === ''
  const correctA = correct === 'a' || correct === 'an'
  const correctThe = correct === 'the'
  const uncountable = looksUncountableExplain(explain)
  const pluralGeneral = looksPluralGeneralExplain(explain)

  if (correctNone && choseThe) {
    if (uncountable) {
      return `คำนี้ไม่ต้องใส่ "the" เพราะเป็นนามนับไม่ได้ (uncountable) ที่พูดแบบทั่วไป — กฎ: นามนับไม่ได้ + ความหมายทั่วไป → ไม่ใส่ the${explain ? ` · ${explain}` : ''}`
    }
    if (pluralGeneral) {
      return `คำนี้ไม่ต้องใส่ "the" เพราะเป็นนามนับได้พหูพจน์ที่พูดแบบทั่วไป — กฎ: นามทั่วไปพหูพจน์ → ไม่ใส่ the${explain ? ` · ${explain}` : ''}`
    }
    return `คำนี้ไม่ต้องใส่ "the" เพราะเป็นนามทั่วไป — กฎ: นับได้พหูพจน์ทั่วไป หรือนับไม่ได้ทั่วไป → ไม่ใส่ the (เลือก "${WGB2_NO_ARTICLE}")${explain ? ` · ${explain}` : ''}`
  }

  if (correctNone && choseA) {
    if (pluralGeneral) {
      return `ไม่ใช้ "a/an" กับคำนามพหูพจน์ — และถ้าพูดแบบทั่วไปก็ไม่ใส่ the เช่นกัน เลือก "${WGB2_NO_ARTICLE}"${explain ? ` · ${explain}` : ''}`
    }
    if (uncountable) {
      return `ไม่ใช้ "a/an" กับนามนับไม่ได้ — ถ้าพูดแบบทั่วไปให้เลือก "${WGB2_NO_ARTICLE}" ไม่ใส่ the${explain ? ` · ${explain}` : ''}`
    }
    return `ช่องนี้ไม่ต้องใส่คำนำหน้า เลือก "${WGB2_NO_ARTICLE}"${explain ? ` · ${explain}` : ''}`
  }

  if (correctA && choseThe) {
    return `ไม่ใช้ "the" เพราะยังพูดแบบทั่วไป (กล่าวครั้งแรก/ไม่เจาะจง) จึงใช้ "${correct}" — ใส่ the เมื่อชี้ถึงสิ่งที่รู้กันแล้วเท่านั้น${explain ? ` · ${explain}` : ''}`
  }

  if (correctA && choseNone) {
    return `ต้องใส่ "${correct}" เพราะเป็นนามนับได้เอกพจน์แบบทั่วไป (กล่าวถึงแบบไม่เจาะจง) — ใช้ a/an ไม่ใช่เว้นว่าง${explain ? ` · ${explain}` : ''}`
  }

  if (correctThe && (choseNone || choseA)) {
    return `ต้องใส่ "the" เพราะเจาะจงสิ่งที่รู้กันแล้ว/มีเพียงหนึ่งในบริบท — ไม่ใช่นามทั่วไปที่เว้น the${explain ? ` · ${explain}` : ''}`
  }

  if (correct === 'society' || /ไม่ต้องมี the|ไม่ต้องใส่ the|zero article|ไม่ใส่ the/i.test(explain)) {
    if (choseThe || chosen === 'the society' || /the\s+/i.test(chosen)) {
      return `คำนามเช่น "society / education / research" เมื่อหมายทั่วไป (นับไม่ได้/นามนามธรรมทั่วไป) ไม่ใส่ "the"${explain ? ` · ${explain}` : ''}`
    }
  }

  return explain || 'ดูว่าคำนามนี้ทั่วไปหรือเจาะจง: พหูพจน์ทั่วไป/นับไม่ได้ทั่วไป → ไม่ใส่ the · เจาะจง → ใช้ the · เอกพจน์นับได้ทั่วไป → a/an'
}

export const getWgb2BlankExplain = (blank: Wgb2Blank, userAnswer?: string): string => {
  if (blank.focus === 'article' && blank.kind === 'select') {
    return getWgb2ArticleWrongExplain(blank, userAnswer || '')
  }
  if (
    (blank.focus === 'verb-tense' || blank.focus === 'participle') &&
    (blank.kind === 'type' || blank.kind === 'select')
  ) {
    const verbExplain = getWgb2VerbFormWrongExplain(blank, userAnswer || '')
    if (verbExplain && !/ตรวจดูความหมาย/.test(verbExplain)) return verbExplain
  }
  const answer =
    blank.kind === 'select'
      ? blank.answer === WGB2_NO_ARTICLE
        ? '(ไม่ใส่)'
        : blank.answer
      : blank.kind === 'type'
        ? blank.answers[0]
        : blank.kind === 'drag'
          ? blank.answer
          : blank.kind === 'punct'
            ? String(blank.answer)
            : ''
  return buildDetailedThaiExplain({
    answer: String(answer),
    focus: blank.focus,
    userAnswer,
    authoredExplain: blank.explain
  })
}

type VerbFormCase =
  | 'passive-v3'
  | 'gerund-subject'
  | 'gerund-prep'
  | 'parallel-ing'
  | 'adj-ing'
  | 'adj-v3'
  | 'modal-base'
  | 'sva-plural'
  | 'sva-singular'
  | 'be-form'
  | 'unknown'

const wgb2AnswersEqual = (a: string, b: string) =>
  a.trim().replace(/\s+/g, ' ').toLowerCase() === b.trim().replace(/\s+/g, ' ').toLowerCase()

const endsWithIng = (word: string) => /ing\b/i.test(word.trim())
const looksPastOrV3 = (word: string) => {
  const w = word.trim().toLowerCase()
  if (!w || endsWithIng(w)) return false
  return (
    /ed$/i.test(w) ||
    /(?:en|ne|wn|pt|lt|ught|ought|ound|elt)$/i.test(w) ||
    [
      'been',
      'done',
      'gone',
      'seen',
      'made',
      'taken',
      'given',
      'written',
      'spoken',
      'broken',
      'chosen',
      'driven',
      'eaten',
      'fallen',
      'forgotten',
      'gotten',
      'grown',
      'known',
      'lain',
      'ridden',
      'risen',
      'shown',
      'sung',
      'swum',
      'thrown',
      'worn',
      'built',
      'felt',
      'kept',
      'left',
      'lost',
      'met',
      'paid',
      'said',
      'sent',
      'slept',
      'spent',
      'taught',
      'told',
      'thought',
      'understood',
      'argued',
      'preserved',
      'elaborated',
      'changed',
      'delayed'
    ].includes(w)
  )
}

const classifyVerbCase = (correct: string, explain: string, base?: string): VerbFormCase => {
  const ex = explain || ''
  if (/passive|been \+|be \+ V3|will be \+|should be \+|cannot be \+|has been|V3/i.test(ex)) return 'passive-v3'
  if (/ขนาน|parallel/i.test(ex)) return 'parallel-ing'
  if (
    /หลัง (for|on|by|of|after|before|without|about)|preposition|หลัง preposition/i.test(ex) &&
    endsWithIng(correct)
  ) {
    return 'gerund-prep'
  }
  if (/(ประธาน|gerund phrase|ทำหน้าที่ประธาน)/i.test(ex) && endsWithIng(correct)) return 'gerund-subject'
  if (/(คุณศัพท์|adjective|ขยายคำนาม|วางหน้าคำนาม)/i.test(ex) && endsWithIng(correct)) return 'adj-ing'
  if (/(คุณศัพท์|adjective|ขยายคำนาม|วางหน้าคำนาม)/i.test(ex) && looksPastOrV3(correct)) return 'adj-v3'
  if (/modal|base form|หลัง (can|should|may|would|must|will)\b/i.test(ex)) return 'modal-base'
  if (/พหูพจน์.*ไม่เติม|กริยาปัจจุบันจึงไม่เติม/i.test(ex) && !endsWithIng(correct) && !looksPastOrV3(correct)) {
    return 'sva-plural'
  }
  if (/เอกพจน์|กริยาปัจจุบันจึง(ใช้|เติม)/i.test(ex) && /s$/i.test(correct) && base && correct !== base) {
    return 'sva-singular'
  }
  if (base === 'be' || /^(am|is|are|was|were|be|been|being)$/i.test(correct)) return 'be-form'
  if (endsWithIng(correct)) {
    if (/(คุณศัพท์|adjective|ขยาย)/i.test(ex)) return 'adj-ing'
    return 'gerund-subject'
  }
  if (looksPastOrV3(correct)) {
    if (/(คุณศัพท์|adjective)/i.test(ex)) return 'adj-v3'
    return 'passive-v3'
  }
  return 'unknown'
}

const appendBlankHint = (explain: string) => (explain ? `\n\n📌 ในช่องนี้: ${explain}` : '')

const verbCaseExplainTh: Record<VerbFormCase, (correct: string, chosen: string, explain: string) => string> = {
  'passive-v3': (correct, chosen, explain) => {
    const wrongBit = endsWithIng(chosen)
      ? `คุณเลือก “${chosen}” (V-ing) ซึ่งใช้กับ gerund หรือคุณศัพท์แบบกำลังเกิด — ไม่ใช่หลัง be ในความหมาย “ถูกกระทำ”`
      : `คุณเลือก “${chosen}” ซึ่งไม่ใช่ V3 ที่ต้องการหลัง be/been`
    return (
      `คำตอบที่ถูกคือ "${correct}" (V3 / past participle)\n\n` +
      `กฎ: Passive voice = be / been / being + V3\n` +
      `แปลว่า “ถูก… / ได้รับการ…” — ผู้กระทำไม่สำคัญหรือรู้จากบริบทแล้ว\n\n` +
      `${wrongBit}\n\n` +
      `ตัวอย่าง:\n` +
      `✓ It has been argued that… (= มีการถกเถียงว่า)\n` +
      `✗ It has been arguing that…\n` +
      `✓ Old buildings should be preserved.\n` +
      `✗ Old buildings should be preserving.\n` +
      `✓ The idea will be elaborated in the next paragraph.\n` +
      `✗ The idea will be elaborating…` +
      appendBlankHint(explain)
    )
  },
  'gerund-subject': (correct, chosen, explain) => {
    const wrongBit = looksPastOrV3(chosen)
      ? `คุณเลือก “${chosen}” (V-ed/V3) ซึ่งมักเป็นกริยาถูกกระทำหรือคุณศัพท์แบบเสร็จแล้ว — ไม่ทำหน้าที่เป็นประธานแบบ gerund`
      : `คุณเลือก “${chosen}” ซึ่งไม่ใช่รูป V-ing ที่ใช้เป็นนามประธาน`
    return (
      `คำตอบที่ถูกคือ "${correct}" (V-ing = gerund)\n\n` +
      `กฎ: เมื่อกริยาทำหน้าที่เหมือนคำนาม (การ…) ใช้ V-ing เรียกว่า gerund\n` +
      `มักอยู่ต้นประโยคเป็นประธาน → ตามด้วยกริยาเอกพจน์ (is/allows/brings)\n\n` +
      `${wrongBit}\n\n` +
      `ตัวอย่าง:\n` +
      `✓ Maintaining them is expensive. (= การดูแลรักษาพวกมัน…)\n` +
      `✗ Maintained them is expensive.\n` +
      `✓ Replacing old buildings allows cities to grow.\n` +
      `✗ Replaced old buildings allows…\n` +
      `✓ Studying history remains essential.\n` +
      `✗ Studied history remains essential.` +
      appendBlankHint(explain)
    )
  },
  'gerund-prep': (correct, chosen, explain) => {
    const wrongBit = looksPastOrV3(chosen)
      ? `คุณเลือก “${chosen}” (V-ed) — หลัง for/on/by/of ฯลฯ ห้ามใช้ V-ed ต้องเป็น gerund`
      : `คุณเลือก “${chosen}” — หลังบุพบทต้องเป็น V-ing ไม่ใช่ base form หรือรูปอื่น`
    return (
      `คำตอบที่ถูกคือ "${correct}" (gerund หลังบุพบท)\n\n` +
      `กฎ: หลัง preposition (for, on, by, of, without, about, after, before…) ถ้าตามด้วยกริยา ต้องเป็น V-ing เสมอ\n` +
      `แปลว่า “เพื่อการ… / โดยการ… / เกี่ยวกับการ…”\n\n` +
      `${wrongBit}\n\n` +
      `ตัวอย่าง:\n` +
      `✓ … for preserving cultural identity.\n` +
      `✗ … for preserved cultural identity. (ผิดรูปกริยา)\n` +
      `✓ … by understanding the past.\n` +
      `✗ … by understand / understood the past.\n` +
      `✓ … without destroying historic sites.` +
      appendBlankHint(explain)
    )
  },
  'parallel-ing': (correct, chosen, explain) =>
    `คำตอบที่ถูกคือ "${correct}" (ขนานกับ V-ing อื่น)\n\n` +
    `กฎ: Parallel structure — คำที่เชื่อมด้วย and / or / not only…but also ต้องรูปเดียวกัน\n` +
    `ถ้าตัวหนึ่งเป็น V-ing อีกตัวก็ต้องเป็น V-ing\n\n` +
    `คุณเลือก “${chosen}” ซึ่งไม่ขนานกับรูป -ing ในประโยค\n\n` +
    `ตัวอย่าง:\n` +
    `✓ pulling down old buildings and replacing them\n` +
    `✗ pulling down old buildings and replaced them\n` +
    `✓ for understanding the past and improving society\n` +
    `✗ for understanding the past and improve society` +
    appendBlankHint(explain),
  'adj-ing': (correct, chosen, explain) => {
    const wrongBit = looksPastOrV3(chosen)
      ? `คุณเลือก “${chosen}” (V-ed) ซึ่งแปลแนว “ถูก… / เสร็จแล้ว” — แต่ตรงนี้ต้องการความหมายแบบกำลังเกิด/active`
      : `คุณเลือก “${chosen}” ซึ่งไม่ใช่คุณศัพท์แบบ V-ing`
    return (
      `คำตอบที่ถูกคือ "${correct}" (V-ing ทำหน้าที่คุณศัพท์)\n\n` +
      `กฎ: V-ing + คำนาม = คุณศัพท์แบบ active / กำลังเกิด / มีลักษณะนั้น\n` +
      `ถามใจสั้น ๆ: “สิ่งนั้นกำลังทำเอง / กำลังเกิดขึ้นอยู่ไหม?” → ถ้าใช่ ใช้ V-ing\n\n` +
      `${wrongBit}\n\n` +
      `ตัวอย่าง:\n` +
      `✓ a growing population (= ประชากรที่กำลังเพิ่มขึ้น)\n` +
      `✗ a grown population (ในความหมายนี้)\n` +
      `✓ rapidly developing cities\n` +
      `✗ rapidly developed cities (ถ้าหมายถึง “กำลังพัฒนา”)\n` +
      `✓ people living in the present` +
      appendBlankHint(explain)
    )
  },
  'adj-v3': (correct, chosen, explain) => {
    const wrongBit = endsWithIng(chosen)
      ? `คุณเลือก “${chosen}” (V-ing) ซึ่งแปลแนว “กำลังทำเอง” — แต่ตรงนี้ต้องการ “ถูกกระทำ / อยู่ในสภาพเสร็จแล้ว”`
      : `คุณเลือก “${chosen}” ซึ่งไม่ใช่คุณศัพท์แบบ V-ed/V3`
    return (
      `คำตอบที่ถูกคือ "${correct}" (V-ed/V3 ทำหน้าที่คุณศัพท์)\n\n` +
      `กฎ: V-ed/V3 + คำนาม = คุณศัพท์แบบ passive / ถูกกระทำ / เสร็จแล้ว\n` +
      `ถามใจสั้น ๆ: “สิ่งนั้นถูกทำให้เป็นแบบนั้นหรือยัง?” → ถ้าใช่ ใช้ V-ed\n\n` +
      `${wrongBit}\n\n` +
      `ตัวอย่าง:\n` +
      `✓ well-preserved historic buildings (= อาคารที่ได้รับการอนุรักษ์ดี)\n` +
      `✗ well-preserving historic buildings\n` +
      `✓ once destroyed, these sites cannot be recreated\n` +
      `✗ once destroying, these sites…\n` +
      `เปรียบเทียบสั้น ๆ: bored students (นักเรียนที่รู้สึกเบื่อ) vs boring lessons (บทเรียนที่น่าเบื่อ)` +
      appendBlankHint(explain)
    )
  },
  'modal-base': (correct, chosen, explain) =>
    `คำตอบที่ถูกคือ "${correct}" (base form / รูปเดิม)\n\n` +
    `กฎ: หลัง modal (can, could, should, may, might, would, must, will) หรือหลัง to-infinitive → ใช้ V1 ไม่ผัน\n` +
    `ห้ามเติม -s / -ing / -ed\n\n` +
    `คุณเลือก “${chosen}” ซึ่งผันรูปแล้ว — หลัง modal/to ไม่ผัน\n\n` +
    `ตัวอย่าง:\n` +
    `✓ may appear outdated\n` +
    `✗ may appears / may appearing / may appeared\n` +
    `✓ should be preserved  (หลัง be แล้วค่อยเป็น V3 — แต่หลัง should เองยังเป็น base “be”)\n` +
    `✓ to claim that… / to meet the needs…\n` +
    `✗ to claiming / to claimed` +
    appendBlankHint(explain),
  'sva-plural': (correct, chosen, explain) =>
    `คำตอบที่ถูกคือ "${correct}"\n\n` +
    `กฎ: Subject–Verb Agreement — ประธานพหูพจน์ (they, others, people, cities, these structures) → กริยาปัจจุบันไม่เติม -s\n\n` +
    `คุณเลือก “${chosen}” ซึ่งมักเป็นรูปเอกพจน์\n\n` +
    `ตัวอย่าง:\n` +
    `✓ Others argue that…\n` +
    `✗ Others argues that…\n` +
    `✓ These structures represent local identity.\n` +
    `✗ These structures represents…\n` +
    `✓ Cities attract tourists.` +
    appendBlankHint(explain),
  'sva-singular': (correct, chosen, explain) =>
    `คำตอบที่ถูกคือ "${correct}"\n\n` +
    `กฎ: ประธานเอกพจน์ (it, this, society…) หรือ gerund phrase ทั้งก้อน (= เอกพจน์) → กริยาปัจจุบันเติม -s / ใช้ is/has\n\n` +
    `คุณเลือก “${chosen}” ซึ่งไม่ตรงจำนวนกับประธาน\n\n` +
    `ตัวอย่าง:\n` +
    `✓ Maintaining them is expensive.  (ประธาน = Maintaining them → เอกพจน์)\n` +
    `✗ Maintaining them are expensive.\n` +
    `✓ Replacing them allows cities to grow.\n` +
    `✗ Replacing them allow…\n` +
    `✓ It has been widely argued that…` +
    appendBlankHint(explain),
  'be-form': (correct, chosen, explain) =>
    `คำตอบที่ถูกคือ "${correct}"\n\n` +
    `กฎ: เลือก am / is / are ให้ตรงประธาน\n` +
    `• I → am\n` +
    `• he / she / it / this / gerund phrase → is\n` +
    `• they / we / you / พหูพจน์ → are\n\n` +
    `คุณเลือก “${chosen}” ซึ่งไม่ตรงประธานในประโยคนี้\n\n` +
    `ตัวอย่าง:\n` +
    `✓ I am convinced that…\n` +
    `✗ I is / I are convinced…\n` +
    `✓ Preserving old buildings is important.\n` +
    `✗ Preserving old buildings are important.` +
    appendBlankHint(explain),
  unknown: (correct, chosen, explain) => {
    if (endsWithIng(correct) && looksPastOrV3(chosen)) {
      return (
        `คำตอบที่ถูกคือ "${correct}" (V-ing) ไม่ใช่ “${chosen}” (V-ed)\n\n` +
        `แยกสั้น ๆ:\n` +
        `• V-ing = gerund (การ…) / คุณศัพท์แบบกำลังเกิด\n` +
        `• V-ed/V3 = passive / คุณศัพท์แบบถูกกระทำ\n\n` +
        `ตัวอย่าง:\n` +
        `✓ Maintaining old buildings is costly.\n` +
        `✗ Maintained old buildings is costly.\n` +
        `✓ a growing population\n` +
        `✗ a grown population (ในความหมาย “กำลังเพิ่ม”)` +
        appendBlankHint(explain)
      )
    }
    if (looksPastOrV3(correct) && endsWithIng(chosen)) {
      return (
        `คำตอบที่ถูกคือ "${correct}" (V-ed/V3) ไม่ใช่ “${chosen}” (V-ing)\n\n` +
        `แยกสั้น ๆ:\n` +
        `• หลัง be ในความหมายถูกกระทำ → V3 (should be preserved)\n` +
        `• คุณศัพท์แบบเสร็จแล้ว/ถูกทำ → V-ed (preserved buildings)\n` +
        `• V-ing ใช้เมื่อเป็น gerund หรือ “กำลังเกิด”\n\n` +
        `ตัวอย่าง:\n` +
        `✓ Old buildings should be preserved.\n` +
        `✗ Old buildings should be preserving.\n` +
        `✓ well-preserved sites\n` +
        `✗ well-preserving sites` +
        appendBlankHint(explain)
      )
    }
    return (
      (explain
        ? `${explain}\n\n`
        : '') +
      `รูปที่ถูกคือ "${correct}" (คุณเลือก “${chosen}”)\n\n` +
      `ทวนหลัก:\n` +
      `• be/been + ? → มักเป็น V3 (passive)\n` +
      `• for/on/by/of + ? → V-ing (gerund)\n` +
      `• ประธานตำแหน่งกริยา (การ…) → V-ing\n` +
      `• modal/to + ? → base form\n\n` +
      `ตัวอย่างเปรียบเทียบ:\n` +
      `✓ should be preserved  vs  ✗ should be preserving\n` +
      `✓ for preserving identity  vs  ✗ for preserved identity\n` +
      `✓ Maintaining them is hard  vs  ✗ Maintained them is hard`
    )
  }
}

/** Wrong-answer Thai for verb-tense / participle — why V-ing vs V-ed/V3 etc. */
export const getWgb2VerbFormWrongExplain = (
  blank: Extract<Wgb2Blank, { kind: 'type' | 'select' }>,
  userAnswer: string
): string => {
  const explain = blank.explain || ''
  const chosen = (userAnswer || '').trim()
  const correct = blank.kind === 'type' ? blank.answers[0] : blank.answer
  const base = blank.kind === 'type' ? blank.base : undefined
  if (!chosen || wgb2AnswersEqual(chosen, correct)) {
    return explain || `รูปที่ถูกคือ "${correct}"`
  }
  const verbCase = classifyVerbCase(correct, explain, base)
  return verbCaseExplainTh[verbCase](correct, chosen, explain)
}

// ── exercises ──────────────────────────────────────────────────────────
export const WGB2_EXERCISES: Wgb2Exercise[] = [
  {
    id: 'gb2-old-buildings',
    promptId: 't2-twe-1',
    steps: [
      {
        id: 'gb2-ob2-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('It '),
          sel2('t2-twe-1x-i0x', ['has', 'have', 'had'], 'has', 'verb-tense', 'ประธาน "It" เอกพจน์ ตามด้วย has (present perfect passive) ไม่ใช่ have'),
          t2(' been '),
          sel2('t2-twe-1x-i0a', ['widely', 'wide', 'width'], 'widely', 'participle', 'ต้องการคำกริยาวิเศษณ์ (adverb) ขยาย argued จึงใช้ widely ไม่ใช่คำคุณศัพท์ wide'),
          t2(' '),
          typ2('t2-twe-1x-i0', 'argue', ['argued'], 'verb-tense', 'passive voice "has been + V3" จึงใช้ argued (V3)'),
          t2(' that '),
          sel2('t2-twe-1x-i0c', ['while', 'meanwhile', 'whereas'], 'while', 'transition', '"while" ใช้เชื่อมประโยคขัดแย้งภายในประโยคเดียว (subordinating conjunction) ไม่ใช่ meanwhile ที่ต้องอยู่ต้นประโยคใหม่'),
          t2(' some old '),
          typ2('t2-twe-1x-i1', 'construction', ['constructions'], 'plural', 'มี "some old" นำหน้า และพูดถึงสิ่งก่อสร้างหลายแห่งทั่วไป จึงต้องเป็นพหูพจน์'),
          t2(' may '),
          sel2('t2-twe-1x-i1b', ['appear', 'appears', 'appeared'], 'appear', 'verb-tense', 'หลัง modal verb "may" ต้องใช้ base form จึงใช้ appear'),
          t2(' '),
          sel2('t2-twe-1x-i1c', ['outdated', 'outdate', 'outdating'], 'outdated', 'participle', 'ต้องการคำคุณศัพท์ (adjective, V3 form) หลัง appear จึงใช้ outdated'),
          sel2('t2-twe-1x-commay', [',', '.', ';'], ',', 'punct', 'เชื่อม clause "maintaining them..." ต่อจากประโยคก่อนหน้าด้วย comma เนื่องจากเป็นประโยคเดียวกันที่ต่อเนื่องกัน'),
          t2(' '),
          typ2('t2-twe-1x-i2b', 'maintain', ['maintaining'], 'verb-tense', '"maintaining them" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' them '),
          typ2('t2-twe-1x-i3', 'be', ['is'], 'verb-tense', 'ประธานคือ "maintaining them" (gerund phrase) นับเป็นเอกพจน์ จึงใช้ is'),
          t2(' essential for '),
          typ2('t2-twe-1x-i3b', 'preserve', ['preserving'], 'verb-tense', '"preserving" เป็น gerund หลัง preposition for'),
          t2(' '),
          sel2('t2-twe-1x-i4', ['a', 'the', WGB2_NO_ARTICLE], 'a', 'article', '"a country" พูดถึงประเทศทั่วไปแบบไม่เจาะจง จึงใช้ a'),
          t2(" country's history and "),
          sel2('t2-twe-1x-i4d', ['cultural', 'culture', 'culturally'], 'cultural', 'participle', 'ต้องการคำคุณศัพท์ (adjective) ขยาย identity จึงใช้ cultural ไม่ใช่คำนาม culture'),
          t2(' identity. Others '),
          typ2('t2-twe-1x-i4b', 'argue', ['argue'], 'verb-tense', 'ประธาน "Others" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' that '),
          typ2('t2-twe-1x-i4c1', 'pull down', ['pulling down'], 'verb-tense', '"pulling down these structures" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' these '),
          typ2('t2-twe-1x-i4c2', 'structure', ['structures'], 'plural', '"these structures" ใช้ demonstrative พหูพจน์ "these" นำหน้า'),
          t2(' and '),
          typ2('t2-twe-1x-i4c', 'replace', ['replacing'], 'verb-tense', 'ขนานกับ "pulling down" ด้านหน้า (parallel -ing form) จึงใช้ replacing'),
          t2(' them with '),
          sel2('t2-twe-1x-i4e', ['modern', 'modernly', 'modernize'], 'modern', 'participle', 'ต้องการคำคุณศัพท์ (adjective) ขยาย buildings จึงใช้ modern'),
          t2(' buildings would '),
          sel2('t2-twe-1x-i4f', ['better', 'best', 'good'], 'better', 'participle', 'รูปเปรียบเทียบ (comparative) ของ well คือ better ส่วน best เป็นขั้นสูงสุด และ good เป็นรูปปกติ'),
          t2(' '),
          sel2('t2-twe-1x-i5x', ['meet', 'meets', 'met'], 'meet', 'verb-tense', 'หลัง modal "would better" ต้องใช้ base form จึงใช้ meet'),
          t2(' the practical '),
          typ2('t2-twe-1x-i5', 'need', ['needs'], 'plural', '"the practical needs of a growing population" เป็นพหูพจน์เสมอในความหมายนี้'),
          t2(' of '),
          sel2('t2-twe-1x-i6', ['a', 'the', WGB2_NO_ARTICLE], 'a', 'article', '"a growing population" พูดถึงประชากรทั่วไป ไม่เจาะจงประเทศใดประเทศหนึ่ง จึงใช้ a'),
          t2(' '),
          typ2('t2-twe-1x-i6b', 'grow', ['growing'], 'participle', '"growing population" — v-ing ทำหน้าที่คุณศัพท์วางหน้าคำนาม แปลว่าประชากรที่กำลังเพิ่มขึ้น'),
          t2(' population. I '),
          sel2('t2-twe-1x-i6c', ['personally', 'personal', 'person'], 'personally', 'participle', 'ต้องการคำกริยาวิเศษณ์ (adverb) ขยาย believe จึงใช้ personally'),
          t2(' believe that '),
          sel2('t2-twe-1x-i6e', ['historic', 'historically', 'history'], 'historic', 'participle', 'ต้องการคำคุณศัพท์ (adjective) ขยาย buildings จึงใช้ historic ไม่ใช่คำนาม history'),
          t2(' '),
          typ2('t2-twe-1x-i6d', 'building', ['buildings'], 'plural', 'พูดถึงอาคารประวัติศาสตร์โดยทั่วไปหลายหลัง จึงเป็นพหูพจน์'),
          t2(' should be '),
          typ2('t2-twe-1x-i7', 'preserve', ['preserved'], 'verb-tense', 'โครงสร้าง passive voice "should be + V3" จึงต้องใช้ preserved'),
          t2(', '),
          sel2('t2-twe-1x-i7x', ['and', 'but', 'or'], 'and', 'transition', '"and" เชื่อมประโยคที่มีความหมายต่อเนื่องเสริมกัน ไม่ใช่ but (ขัดแย้ง) หรือ or (ทางเลือก)'),
          t2(' my '),
          sel2('t2-twe-1x-i7b', ['reasons', 'reason', 'reasoning'], 'reasons', 'plural', '"my reasons" หมายถึงเหตุผลหลายข้อที่จะกล่าวถึง จึงเป็นพหูพจน์'),
          t2(' will be '),
          typ2('t2-twe-1x-i8', 'elaborate', ['elaborated'], 'verb-tense', 'passive voice "will be + V3" จึงใช้ elaborated'),
          t2(' on in '),
          sel2('t2-twe-1x-i8b', ['the', 'a', WGB2_NO_ARTICLE], 'the', 'article', '"the following paragraphs" เจาะจงย่อหน้าถัดไปในเรียงความนี้ จึงใช้ the'),
          t2(' following '),
          typ2('t2-twe-1x-i9', 'paragraph', ['paragraphs'], 'plural', '"the following paragraphs" หมายถึงย่อหน้าถัดไปหลายย่อหน้า จึงเป็นพหูพจน์'),
          t2('.')
        ]
      },
      {
        id: 'gb2-ob2-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          sel2('t2-twe-1x-b1start', ['To begin with', 'In this respect', 'For instance'], 'To begin with', 'transition', '"To begin with" ใช้เปิดย่อหน้าแรกเพื่อเริ่มเหตุผลข้อแรก'),
          t2(', it '),
          typ2('t2-twe-1x-b1x0', 'might', ['might'], 'verb-tense', '"might seem" เป็น modal verb แสดงความเป็นไปได้ ตามด้วย base form ของกริยา seem'),
          t2(' seem '),
          sel2('t2-twe-1x-b1x1', ['sensible', 'sensibly', 'sense'], 'sensible', 'participle', 'ต้องการคำคุณศัพท์ (adjective) หลัง seem จึงใช้ sensible ไม่ใช่ adverb sensibly'),
          t2(' for '),
          sel2('t2-twe-1x-b1x0b', ['some', 'anyone', 'anybody'], 'some', 'plural', '"for some to claim" หมายถึงคนบางกลุ่มทั่วไป ใช้รูป some ในบริบทเชิงบวกนี้'),
          t2(' to '),
          typ2('t2-twe-1x-b1x0c', 'claim', ['claim'], 'verb-tense', 'หลัง "to" ต้องใช้ infinitive รูปเดิม (base form) จึงใช้ claim'),
          t2(' that old '),
          typ2('t2-twe-1x-b1a', 'building', ['buildings'], 'plural', 'พูดถึงอาคารเก่าโดยทั่วไปหลายหลัง จึงเป็นพหูพจน์'),
          t2(' should be '),
          typ2('t2-twe-1x-b1b', 'pull down', ['pulled down'], 'verb-tense', 'passive voice "should be + V3" จึงใช้ pulled down'),
          t2(' to make '),
          sel2('t2-twe-1x-b1bx', ['way', 'ways', 'away'], 'way', 'plural', '"make way for" เป็นสำนวนคงที่ ใช้ way เอกพจน์เสมอ'),
          t2(' for '),
          sel2('t2-twe-1x-b1x1b', ['modern', 'modernly', 'modernize'], 'modern', 'participle', 'ต้องการคำคุณศัพท์ (adjective) ขยาย infrastructure จึงใช้ modern'),
          t2(' infrastructure. '),
          sel2('t2-twe-1x-b1mid', ['To explain it simply', 'However', 'In conclusion'], 'To explain it simply', 'transition', '"To explain it simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', '),
          sel2('t2-twe-1x-b1x3x', ['this', 'these', 'that'], 'this', 'plural', '"this" อ้างถึงประโยคก่อนหน้าทั้งประโยค (เอกพจน์) จึงใช้ this ไม่ใช่ these'),
          t2(' is '),
          sel2('t2-twe-1x-b1x3', ['possibly', 'possible', 'possibility'], 'possibly', 'participle', 'ต้องการคำกริยาวิเศษณ์ (adverb) ขยาย is จึงใช้ possibly'),
          t2(' because older '),
          typ2('t2-twe-1x-b1x3b', 'structure', ['structures'], 'plural', '"older structures" พูดถึงสิ่งก่อสร้างเก่าหลายแห่งโดยทั่วไป จึงเป็นพหูพจน์'),
          t2(' often '),
          sel2('t2-twe-1x-b1x3c', ['fail', 'fails', 'failed'], 'fail', 'verb-tense', 'ประธาน "structures" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' to meet '),
          sel2('t2-twe-1x-b1cx', ['current', 'currently', 'currency'], 'current', 'participle', 'ต้องการคำคุณศัพท์ (adjective) ขยาย safety and space requirements จึงใช้ current'),
          t2(' safety and space '),
          typ2('t2-twe-1x-b1c', 'requirement', ['requirements'], 'plural', '"safety and space requirements" หมายถึงข้อกำหนดหลายข้อ จึงเป็นพหูพจน์'),
          sel2('t2-twe-1x-b1d', [';', '.', ','], ';', 'punct', 'เชื่อม 2 ประโยคสมบูรณ์เข้าด้วยกันก่อนคำเชื่อม therefore จึงใช้ semicolon (;)'),
          t2(' therefore'),
          sel2('t2-twe-1x-b1d2', [',', '.', ''], ',', 'punct', 'หลังคำเชื่อม therefore ต้องมี comma เสมอก่อนขึ้นประโยคหลัก'),
          t2(' '),
          typ2('t2-twe-1x-b1e0x', 'replace', ['replacing'], 'verb-tense', '"replacing them" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' them '),
          typ2('t2-twe-1x-b1e0', 'allow', ['allows'], 'verb-tense', 'ประธาน "replacing them" (gerund) เป็นเอกพจน์ กริยาจึงเติม -s เป็น allows'),
          t2(' cities to '),
          sel2('t2-twe-1x-e0y', ['meet', 'meets', 'met'], 'meet', 'verb-tense', 'หลัง infinitive "to" ต้องใช้ base form จึงใช้ meet'),
          t2(' the needs of '),
          sel2('t2-twe-1x-b1e0b', ['a', 'the', WGB2_NO_ARTICLE], 'a', 'article', '"a growing population" พูดถึงประชากรทั่วไป ไม่เจาะจง จึงใช้ a'),
          t2(' '),
          sel2('t2-twe-1x-e0z', ['growing', 'grown', 'grow'], 'growing', 'participle', '"growing population" — v-ing ทำหน้าที่คุณศัพท์วางหน้าคำนาม'),
          t2(' population more '),
          sel2('t2-twe-1x-b1e0c', ['efficiently', 'efficient', 'efficiency'], 'efficiently', 'participle', 'ต้องการคำกริยาวิเศษณ์ (adverb) ขยาย meet จึงใช้ efficiently ไม่ใช่คำคุณศัพท์ efficient'),
          t2('. '),
          sel2('t2-twe-1x-b1f', ['For example', 'However', 'To begin with'], 'For example', 'transition', '"For example" ยกตัวอย่างเมืองจริงมาสนับสนุนประโยคก่อนหน้า'),
          t2(', many '),
          sel2('t2-twe-1x-b1e1', ['rapidly', 'rapid', 'rapidity'], 'rapidly', 'participle', 'ต้องการคำกริยาวิเศษณ์ (adverb) ขยาย developing จึงใช้ rapidly ไม่ใช่คำคุณศัพท์ rapid'),
          t2(' '),
          typ2('t2-twe-1x-b1e', 'develop', ['developing'], 'participle', '"rapidly developing cities" — v-ing ทำหน้าที่คุณศัพท์ขยาย cities'),
          t2(' cities '),
          typ2('t2-twe-1x-b1e2x', 'have', ['have'], 'verb-tense', 'ประธานพหูพจน์ "cities" ตามด้วย have (present perfect)'),
          t2(' '),
          typ2('t2-twe-1x-b1e2', 'pull down', ['pulled down'], 'verb-tense', 'present perfect "have + V3" จึงใช้ pulled down'),
          t2(' '),
          sel2('t2-twe-1x-e2y', ['old', 'older', 'oldest'], 'old', 'participle', '"old buildings" ใช้รูปเดิม (positive) ไม่ใช่รูปเปรียบเทียบ older/oldest ในบริบทที่ไม่ได้เปรียบเทียบ'),
          t2(' buildings to construct'),
          sel2(
            't2-twe-1x-b1g',
            ['a', 'the', WGB2_NO_ARTICLE],
            WGB2_NO_ARTICLE,
            'article',
            '"high-rise apartments and offices" เป็นคำนามพหูพจน์ที่พูดถึงทั่วไป จึงไม่ต้องมีคำนำหน้า'
          ),
          t2(' high-rise '),
          sel2('t2-twe-1x-gy', ['apartments', 'apartment', 'apartmental'], 'apartments', 'plural', '"high-rise apartments and offices" พูดถึงอาคารหลายหลังโดยทั่วไป จึงเป็นพหูพจน์'),
          t2(' and offices. '),
          sel2('t2-twe-1x-b1h', ['From this perspective', 'It is undeniable', 'To begin with'], 'From this perspective', 'transition', '"From this perspective" สรุปมุมมองก่อนประโยคปิดท้ายย่อหน้า'),
          t2(', it is '),
          sel2('t2-twe-1x-b1h2', ['understandable', 'understanding', 'understood'], 'understandable', 'participle', 'ต้องการคำคุณศัพท์ (adjective) หลัง be-verb จึงใช้ understandable'),
          t2(' why '),
          sel2('t2-twe-1x-b1h3', ['some', 'few', 'little'], 'some', 'plural', '"some would believe" หมายถึงบางคน ใช้ some กับคนทั่วไป ไม่ใช่ few/little'),
          t2(' '),
          typ2('t2-twe-1x-b1h4', 'would', ['would'], 'verb-tense', '"would believe" เป็น modal verb ตามด้วย base form ของกริยา believe'),
          t2(' believe that '),
          sel2('t2-twe-1x-b1h5', ['modern', 'modernly', 'modernize'], 'modern', 'participle', 'ต้องการคำคุณศัพท์ (adjective) ขยาย buildings จึงใช้ modern'),
          t2(' buildings '),
          typ2('t2-twe-1x-b1h6', 'serve', ['serve'], 'verb-tense', 'ประธาน "modern buildings" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(" society's needs more "),
          sel2('t2-twe-1x-b1h7', ['effectively', 'effective', 'effectiveness'], 'effectively', 'participle', 'ต้องการคำกริยาวิเศษณ์ (adverb) ขยาย serve จึงใช้ effectively'),
          t2(' than '),
          sel2('t2-twe-1x-oney', ['old', 'older', 'oldest'], 'old', 'participle', '"old ones" เปรียบเทียบกับ "modern buildings" แต่ไม่ได้ใช้รูปเปรียบเทียบตรงนี้ จึงใช้ old'),
          t2(' ones.')
        ]
      },
      {
        id: 'gb2-ob2-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          sel2('t2-twe-1x-b2start', ['However', 'For instance', 'To begin with'], 'However', 'transition', 'ย่อหน้านี้ขัดแย้งกับย่อหน้าก่อนหน้า (concession → rebuttal) จึงใช้ However'),
          t2(', I '),
          typ2('t2-twe-1x-b2x0', 'would', ['would'], 'verb-tense', '"would argue" เป็น modal verb ตามด้วย base form ของกริยา argue'),
          t2(' '),
          sel2('t2-twe-1x-b2x1', ['personally', 'personal', 'person'], 'personally', 'participle', 'ต้องการคำกริยาวิเศษณ์ (adverb) ขยาย argue จึงใช้ personally'),
          t2(' argue '),
          sel2('t2-twe-1x-favory', ['in favor of', 'in favor for', 'in favor to'], 'in favor of', 'transition', '"argue in favor of" เป็นสำนวนคงที่ ใช้ preposition of เสมอ'),
          t2(' '),
          sel2('t2-twe-1x-b2x1b', ['the', 'a', WGB2_NO_ARTICLE], 'the', 'article', '"the idea that" เป็นสำนวนคงที่ ใช้ the เสมอ'),
          t2(' idea '),
          sel2('t2-twe-1x-ideay', ['that', 'which', 'what'], 'that', 'transition', '"the idea that" เป็นสำนวนคงที่ ตามด้วย that-clause เสมอ'),
          t2(' old '),
          typ2('t2-twe-1x-b2x1c', 'building', ['buildings'], 'plural', 'พูดถึงอาคารเก่าโดยทั่วไปหลายหลัง จึงเป็นพหูพจน์'),
          t2(' should be carefully '),
          typ2('t2-twe-1x-b2b', 'preserve', ['preserved'], 'verb-tense', 'passive voice "should be + V3" จึงใช้ preserved'),
          t2('. '),
          sel2('t2-twe-1x-b2mid', ['To put it simply', 'For example', 'In conclusion'], 'To put it simply', 'transition', '"To put it simply" ใช้ก่อนอธิบายเหตุผลให้เข้าใจง่าย'),
          t2(', this '),
          sel2('t2-twe-1x-b2x2c', ['is', 'are', 'was'], 'is', 'verb-tense', 'ประธาน "this" เป็นเอกพจน์ กริยาปัจจุบันจึงใช้ is'),
          t2(' due to '),
          sel2('t2-twe-1x-b2x2b', ['the', 'a', WGB2_NO_ARTICLE], 'the', 'article', '"due to the fact that" เป็นสำนวนคงที่ ใช้ the เสมอ'),
          t2(' fact that these '),
          typ2('t2-twe-1x-b2c', 'structure', ['structures'], 'plural', '"these structures" ใช้ demonstrative พหูพจน์ "these" นำหน้า จึงต้องเป็นพหูพจน์'),
          t2(' '),
          typ2('t2-twe-1x-b2c2', 'represent', ['represent'], 'verb-tense', 'ประธาน "these structures" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' '),
          sel2('t2-twe-1x-b2d', ['a', 'the', WGB2_NO_ARTICLE], 'a', 'article', '"a nation" พูดถึงประเทศทั่วไป ไม่เจาะจง จึงใช้ a'),
          t2(" nation's history and cultural "),
          sel2('t2-twe-1x-b2d2', ['heritage', 'heritages', 'inherit'], 'heritage', 'plural', '"cultural heritage" เป็นนามนับไม่ได้ (uncountable) จึงไม่เติม s'),
          t2(', '),
          typ2('t2-twe-1x-b2e0', 'which', ['which'], 'verb-tense', '"which" เป็น relative pronoun อ้างถึงประโยคก่อนหน้า ใช้รูปเดิมเสมอ'),
          t2(' cannot be '),
          typ2('t2-twe-1x-b2e1', 'recreate', ['recreated'], 'verb-tense', 'passive voice "cannot be + V3" จึงใช้ recreated'),
          t2(' once '),
          typ2('t2-twe-1x-b2e2', 'destroy', ['destroyed'], 'participle', '"once destroyed" เป็น participle clause แบบย่อ (once [they are] destroyed) ใช้ V3'),
          t2('. '),
          sel2('t2-twe-1x-b2f', ['For instance', 'However', 'To begin with'], 'For instance', 'transition', '"For instance" ยกตัวอย่างเมือง Rome และ Kyoto มาสนับสนุน'),
          t2(', cities such as '),
          sel2('t2-twe-1x-romey', ['Rome', 'rome', 'ROME'], 'Rome', 'plural', 'ชื่อเฉพาะเมือง Rome ต้องขึ้นต้นด้วยตัวพิมพ์ใหญ่เสมอ'),
          t2(' and Kyoto '),
          typ2('t2-twe-1x-b2f0', 'attract', ['attract'], 'verb-tense', 'ประธานพหูพจน์ "cities" กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' '),
          sel2('t2-twe-1x-millionsy', ['millions', 'million', 'millionth'], 'millions', 'plural', '"millions of tourists" ใช้รูปพหูพจน์ millions เสมอในสำนวนนี้'),
          t2(' of '),
          typ2('t2-twe-1x-b2f2', 'tourist', ['tourists'], 'plural', '"millions of tourists" ตามด้วยคำนามพหูพจน์เสมอ'),
          t2(' every '),
          sel2('t2-twe-1x-yeary', ['year', 'years', 'yearly'], 'year', 'plural', '"every year" ตามด้วยคำนามเอกพจน์เสมอ'),
          t2(' largely because of their well-'),
          typ2('t2-twe-1x-b2g0', 'preserve', ['preserved'], 'participle', '"well-preserved historic buildings" — V3 ทำหน้าที่คุณศัพท์วางหน้าคำนาม'),
          t2(' historic '),
          typ2('t2-twe-1x-b2g0b', 'building', ['buildings'], 'plural', '"well-preserved historic buildings" พูดถึงอาคารหลายหลัง จึงเป็นพหูพจน์'),
          t2('. '),
          sel2('t2-twe-1x-b2g', ['In this respect', 'However', 'For example'], 'In this respect', 'transition', '"In this respect" สรุปมุมมองในย่อหน้านี้ก่อนขึ้นประโยคปิดท้าย'),
          t2(', it is '),
          sel2('t2-twe-1x-b2g1', ['evident', 'evidently', 'evidence'], 'evident', 'participle', 'ต้องการคำคุณศัพท์ (adjective) หลัง be-verb จึงใช้ evident'),
          t2(' that '),
          typ2('t2-twe-1x-b2g2', 'maintain', ['maintaining'], 'verb-tense', '"maintaining old buildings" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' old buildings '),
          typ2('t2-twe-1x-b2g3', 'bring', ['brings'], 'verb-tense', 'ประธาน "maintaining old buildings" (gerund) เป็นเอกพจน์ กริยาจึงเติม -s'),
          t2(' both '),
          sel2('t2-twe-1x-b2g4', ['cultural', 'culture', 'culturally'], 'cultural', 'participle', 'ต้องการคำคุณศัพท์ (adjective) ขยาย value จึงใช้ cultural'),
          t2(' and economic '),
          sel2('t2-twe-1x-valuey', ['value', 'values', 'valuable'], 'value', 'plural', '"cultural and economic value" ใช้นามนับไม่ได้เอกพจน์ value ไม่ใช่ values'),
          t2(' to '),
          sel2('t2-twe-1x-b2h', ['a', 'the', WGB2_NO_ARTICLE], 'a', 'article', '"a country" พูดถึงประเทศทั่วไป ไม่เจาะจงประเทศใดประเทศหนึ่ง จึงใช้ a'),
          t2(' country.')
        ]
      },
      {
        id: 'gb2-ob2-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          sel2('t2-twe-1x-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', 'transition', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', '),
          typ2('t2-twe-1x-cx0', 'although', ['although'], 'verb-tense', '"although" เป็นคำเชื่อมแสดงความขัดแย้ง ใช้รูปเดิมเสมอ ไม่ผัน'),
          t2(' it is '),
          sel2('t2-twe-1x-cx1', ['undeniable', 'undeniably', 'deny'], 'undeniable', 'participle', 'ต้องการคำคุณศัพท์ (adjective) หลัง be-verb จึงใช้ undeniable'),
          t2(' that '),
          typ2('t2-twe-1x-c0x', 'build', ['building'], 'verb-tense', '"building modern structures" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' modern '),
          sel2('t2-twe-1x-structy', ['structures', 'structure', 'structuring'], 'structures', 'plural', '"modern structures" พูดถึงสิ่งก่อสร้างสมัยใหม่หลายแห่งโดยทั่วไป จึงเป็นพหูพจน์'),
          t2(' can help cities meet '),
          typ2('t2-twe-1x-c0', 'grow', ['growing'], 'participle', '"growing practical needs" — v-ing ทำหน้าที่คุณศัพท์ แปลว่าความต้องการที่กำลังเพิ่มขึ้น'),
          t2(' practical '),
          typ2('t2-twe-1x-c1', 'need', ['needs'], 'plural', '"practical needs" ของประชากรที่กำลังเติบโต เป็นพหูพจน์เสมอ'),
          t2(', I '),
          sel2('t2-twe-1x-cx0b', ['am', 'is', 'are'], 'am', 'verb-tense', 'ประธาน "I" ตามด้วย am (present simple ของ be) จึงใช้ am'),
          t2(' of the '),
          sel2('t2-twe-1x-cx2', ['opinion', 'opinions', 'opinionated'], 'opinion', 'plural', '"I am of the opinion that" เป็นสำนวนคงที่ ใช้เอกพจน์ opinion เสมอ'),
          t2(' that '),
          typ2('t2-twe-1x-c1b', 'preserve', ['preserving'], 'verb-tense', '"preserving old buildings" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' old buildings '),
          typ2('t2-twe-1x-c1c', 'be', ['is'], 'verb-tense', 'ประธาน "preserving old buildings" (gerund) เอกพจน์ กริยาปัจจุบันจึงใช้ is'),
          t2(' more '),
          sel2('t2-twe-1x-c2x', ['important', 'importantly', 'importance'], 'important', 'participle', 'ต้องการคำคุณศัพท์ (adjective) หลัง more จึงใช้ important ไม่ใช่คำนาม importance'),
          t2(', as they '),
          typ2('t2-twe-1x-c2y', 'protect', ['protect'], 'verb-tense', 'ประธานพหูพจน์ "they" กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' '),
          sel2('t2-twe-1x-c3', ['a', 'the', WGB2_NO_ARTICLE], 'a', 'article', '"a nation" พูดถึงประเทศทั่วไป ไม่เจาะจง จึงใช้ a'),
          t2(" nation's history for future "),
          typ2('t2-twe-1x-c4', 'generation', ['generations'], 'plural', '"future generations" หมายถึงคนรุ่นต่อ ๆ ไปหลายรุ่น จึงเป็นพหูพจน์'),
          t2('.')
        ]
      }
    ]
  },
  {
    id: 'gb2-value-of-history',
    promptId: 't2-twe-2',
    steps: [
      {
        id: 'gb2-voh-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
  t2('It '),
          typ2('t2-twe-2-i0x', 'have', ['has'], 'verb-tense', 'ประธาน "It" เอกพจน์ ตามด้วย has (present perfect passive) ไม่ใช่ have'),
          t2(' been '),
          sel2('t2-twe-2-i0a', ['widely', 'wide', 'width'], 'widely', 'participle', 'ต้องการคำกริยาวิเศษณ์ (adverb) ขยาย argued จึงใช้ widely ไม่ใช่คำคุณศัพท์ wide'),
          t2(' '),
          typ2('t2-twe-2-i0', 'argue', ['argued'], 'verb-tense', 'passive voice "has been + V3" จึงใช้ argued (V3)'),
          t2(' that while '),
          sel2('t2-twe-2-i0b', ['the', 'a', WGB2_NO_ARTICLE], 'the', 'article', '"the past" หมายถึงอดีตที่เฉพาะเจาะจงและรู้กันแล้ว จึงใช้ the'),
          t2(' '),
          typ2('t2-twe-2-i1', 'pass', ['past'], 'plural', '"the past" เป็นคำนามนามธรรมเฉพาะ ไม่มีรูปพหูพจน์'),
          t2(' cannot be '),
          typ2('t2-twe-2-i2', 'change', ['changed'], 'verb-tense', 'passive voice "cannot be + V3" จึงใช้ changed'),
          t2(', '),
          typ2('t2-twe-2-i3', 'understand', ['understanding'], 'verb-tense', '"understanding it" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' it has '),
          sel2('t2-twe-2-i3b', ['little', 'few', 'a few'], 'little', 'plural', '"relevance" เป็นนามนับไม่ได้ (uncountable) จึงใช้ little ไม่ใช่ few/a few ที่ใช้กับนามนับได้'),
          t2(' practical '),
          sel2('t2-twe-2-i4', ['relevance', 'relevant', 'relevances'], 'relevance', 'plural', 'ต้องการคำนาม (noun) หลัง "practical" ไม่ใช่คำคุณศัพท์ relevant และเป็นนามนับไม่ได้จึงไม่เติม s'),
          t2(' to people '),
          typ2('t2-twe-2-i3c', 'live', ['living'], 'participle', '"people living in the present" — v-ing ทำหน้าที่คุณศัพท์ขยาย people (ผู้คนที่อาศัยอยู่)'),
          t2(' in '),
          sel2('t2-twe-2-i5b', ['the', 'a', WGB2_NO_ARTICLE], 'the', 'article', '"the present" หมายถึงปัจจุบันที่เจาะจง จึงใช้ the'),
          t2(' '),
          sel2('t2-twe-2-i5', ['present', 'presently', 'presence'], 'present', 'plural', '"the present" หมายถึงปัจจุบัน (นาม) ไม่ใช่ presence (การมีอยู่) หรือ presently (adv.)'),
          t2('. Others '),
          typ2('t2-twe-2-i6', 'argue', ['argue'], 'verb-tense', 'ประธาน "Others" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' that '),
          typ2('t2-twe-2-i7', 'study', ['studying'], 'verb-tense', '"studying history" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' history '),
          sel2('t2-twe-2-i7b', ['remains', 'remain', 'remained'], 'remains', 'verb-tense', 'ประธาน "studying history" (gerund) เป็นเอกพจน์ กริยาปัจจุบันจึงเติม -s'),
          t2(' '),
          sel2('t2-twe-2-i7c', ['essential', 'essentially', 'essentials'], 'essential', 'participle', 'ต้องการคำคุณศัพท์ (adjective) หลัง remains จึงใช้ essential'),
          t2(' for '),
          typ2('t2-twe-2-i8', 'understand', ['understanding'], 'verb-tense', 'ขนานกับ "improving" ด้านหลัง (parallel -ing form หลัง for)'),
          t2(' and '),
          typ2('t2-twe-2-i9', 'improve', ['improving'], 'verb-tense', 'ขนานกับ "understanding" ด้านหน้า (parallel -ing form)'),
          t2(' '),
          sel2('t2-twe-2-i9b', ['present-day', 'presently', 'presence'], 'present-day', 'participle', '"present-day society" — compound adjective ขยาย society หมายถึงสังคมปัจจุบัน'),
          t2(' '),
          sel2('t2-twe-2-i10c', ['society', 'societies', 'the society'], 'society', 'article', '"society" ในความหมายกว้าง (สังคมโดยรวม) ไม่ต้องมี the หรือ พหูพจน์'),
          t2('. I '),
          sel2('t2-twe-2-i10b', ['personally', 'personal', 'person'], 'personally', 'participle', 'ต้องการคำกริยาวิเศษณ์ (adverb) ขยาย believe จึงใช้ personally'),
          t2(' believe that '),
          typ2('t2-twe-2-i11', 'learn', ['learning'], 'verb-tense', '"learning about the past" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' about '),
          sel2('t2-twe-2-i11b', ['the', 'a', WGB2_NO_ARTICLE], 'the', 'article', '"the past" หมายถึงอดีตที่เจาะจง จึงใช้ the'),
          t2(' past is '),
          sel2('t2-twe-2-i12x', ['highly', 'high', 'height'], 'highly', 'participle', 'ต้องการคำกริยาวิเศษณ์ (adverb) ขยาย valuable จึงใช้ highly ไม่ใช่คำคุณศัพท์ high'),
          t2(' '),
          sel2('t2-twe-2-i12', ['valuable', 'value', 'valued'], 'valuable', 'participle', 'ต้องการคำคุณศัพท์ (adjective) หลัง "highly" จึงใช้ valuable ไม่ใช่คำนาม value หรือกริยา valued'),
          t2(', and my '),
          sel2('t2-twe-2-i12b', ['reasons', 'reason', 'reasoning'], 'reasons', 'plural', '"my reasons" หมายถึงเหตุผลหลายข้อที่จะกล่าวถึง จึงเป็นพหูพจน์'),
          t2(' will be '),
          typ2('t2-twe-2-i13', 'elaborate', ['elaborated'], 'verb-tense', 'passive voice "will be + V3" จึงใช้ elaborated'),
          t2(' on in '),
          sel2('t2-twe-2-i13b', ['the', 'a', WGB2_NO_ARTICLE], 'the', 'article', '"the following paragraphs" เจาะจงย่อหน้าถัดไปในเรียงความนี้ จึงใช้ the'),
          t2(' following '),
          typ2('t2-twe-2-i14', 'paragraph', ['paragraphs'], 'plural', '"the following paragraphs" หมายถึงย่อหน้าถัดไปหลายย่อหน้า จึงเป็นพหูพจน์'),
          t2('.')
        ]
      },
      {
        id: 'gb2-voh-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          sel2('t2-twe-2-b1start', ['To begin with', 'In this respect', 'For instance'], 'To begin with', 'transition', '"To begin with" ใช้เปิดย่อหน้าแรกเพื่อเริ่มเหตุผลข้อแรก'),
          t2(', it '),
          typ2('t2-twe-2-b1x0', 'might', ['might'], 'verb-tense', '"might seem" เป็น modal verb แสดงความเป็นไปได้ ตามด้วย base form ของกริยา seem'),
          t2(' seem '),
          sel2('t2-twe-2-b1x1', ['sensible', 'sensibly', 'sense'], 'sensible', 'participle', 'ต้องการคำคุณศัพท์ (adjective) หลัง seem จึงใช้ sensible ไม่ใช่ adverb sensibly'),
          t2(' for '),
          typ2('t2-twe-2-b1x0b', 'some', ['some'], 'plural', '"for some to claim" หมายถึงคนบางกลุ่มทั่วไป (pronoun) ใช้รูป some เดิมเสมอ'),
          t2(' to '),
          typ2('t2-twe-2-b1x0c', 'claim', ['claim'], 'verb-tense', 'หลัง "to" ต้องใช้ infinitive รูปเดิม (base form) จึงใช้ claim'),
          t2(' that '),
          typ2('t2-twe-2-b1a', 'study', ['studying'], 'verb-tense', '"studying history" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' history '),
          sel2('t2-twe-2-b1x2', ['serves', 'serve', 'served'], 'serves', 'verb-tense', 'ประธาน "studying history" (gerund) เป็นเอกพจน์ กริยาปัจจุบันจึงเติม -s'),
          t2(' little practical '),
          sel2('t2-twe-2-b1b', ['purpose', 'purposes', 'purposeful'], 'purpose', 'plural', 'นามนับไม่ได้ในความหมายเชิงนามธรรมนี้ ไม่ต้องเติม s และไม่ใช้รูปคุณศัพท์'),
          t2(' in '),
          sel2('t2-twe-2-b1x1b', ['modern', 'modernly', 'modernize'], 'modern', 'participle', 'ต้องการคำคุณศัพท์ (adjective) ขยาย life จึงใช้ modern'),
          t2(' life. '),
          sel2('t2-twe-2-b1mid', ['To explain it simply', 'However', 'In conclusion'], 'To explain it simply', 'transition', '"To explain it simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is '),
          sel2('t2-twe-2-b1x3', ['possibly', 'possible', 'possibility'], 'possibly', 'participle', 'ต้องการคำกริยาวิเศษณ์ (adverb) ขยาย is เพื่อขยายความหมายว่า "อาจจะ" จึงใช้ possibly'),
          t2(' because historical '),
          typ2('t2-twe-2-b1c', 'event', ['events'], 'plural', '"historical events" พูดถึงเหตุการณ์หลายเหตุการณ์โดยทั่วไป จึงเป็นพหูพจน์'),
          t2(' cannot be '),
          typ2('t2-twe-2-b1d', 'alter', ['altered'], 'verb-tense', 'passive voice "cannot be + V3" จึงใช้ altered'),
          t2(' and have no direct '),
          sel2('t2-twe-2-b1x4', ['bearing', 'bear', 'borne'], 'bearing', 'plural', '"have no direct bearing on" เป็นสำนวนคงที่ ใช้คำนาม bearing (ความเกี่ยวข้อง) ไม่ใช่กริยา bear/borne'),
          t2(" on today's technology or economy"),
          sel2('t2-twe-2-b1e', [';', '.', ','], ';', 'punct', 'เชื่อม 2 ประโยคสมบูรณ์เข้าด้วยกันก่อนคำเชื่อม therefore จึงใช้ semicolon (;)'),
          t2(' therefore'),
          sel2('t2-twe-2-b1f', [',', '.', ''], ',', 'punct', 'หลังคำเชื่อม therefore ต้องมี comma เสมอก่อนขึ้นประโยคหลัก'),
          t2(' some '),
          sel2('t2-twe-2-b1x4b', ['believe', 'believes', 'believed'], 'believe', 'verb-tense', 'ประธาน "some" (พหูพจน์) กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' time '),
          typ2('t2-twe-2-b1x4c', 'would', ['would'], 'verb-tense', '"would be" เป็น modal verb แสดงสมมติฐาน ตามด้วย base form ของกริยา be'),
          t2(' be '),
          typ2('t2-twe-2-b1g', 'good', ['better'], 'participle', 'ต้องการรูปเปรียบเทียบ (comparative) เพราะเทียบกับการเรียนประวัติศาสตร์ จึงใช้ better ไม่ใช่ good'),
          t2(' spent '),
          sel2('t2-twe-2-b1x5', ['learning', 'learned', 'learn'], 'learning', 'verb-tense', '"spent (time) learning" ตามด้วย v-ing เสมอในโครงสร้าง spend time doing something'),
          t2(' practical '),
          typ2('t2-twe-2-b1h', 'skill', ['skills'], 'plural', '"practical skills" พูดถึงทักษะหลายอย่างโดยทั่วไป จึงเป็นพหูพจน์'),
          t2(' '),
          sel2('t2-twe-2-b1hx', ['instead', 'instead of', 'besides'], 'instead', 'transition', '"instead" ทำหน้าที่ adverb แทนที่ ใช้ลอย ๆ ได้ ส่วน "instead of" ต้องตามด้วยคำนาม และ besides หมายถึง "นอกจากนี้" ซึ่งความหมายไม่ตรง'),
          t2('. '),
          sel2('t2-twe-2-b1i', ['For example', 'However', 'To begin with'], 'For example', 'transition', '"For example" ยกตัวอย่างนักเรียนที่เลือกเรียน coding มาสนับสนุน'),
          t2(', many '),
          typ2('t2-twe-2-b1x6', 'student', ['students'], 'plural', '"many students" ตามด้วยคำนามพหูพจน์เสมอ'),
          t2(' '),
          sel2('t2-twe-2-b1x6b', ['today', 'todays', "today's"], 'today', 'plural', '"today" ทำหน้าที่ adverb of time ไม่ใช่คำนามที่ต้องมี apostrophe -s'),
          t2(' choose to '),
          typ2('t2-twe-2-b1j', 'study', ['study'], 'verb-tense', 'หลัง "choose to" ต้องใช้ infinitive รูปเดิม (base form) จึงใช้ study'),
          t2(' coding or '),
          sel2('t2-twe-2-b1jx', ['business', 'businesses', 'busy'], 'business', 'plural', '"business" ในความหมายวิชา/สาขาวิชาเป็นนามนับไม่ได้ (uncountable) จึงไม่เติม s'),
          t2(' rather than history'),
          sel2('t2-twe-2-b1k', [',', '.', ''], ',', 'punct', 'comma คั่นก่อน participle phrase "believing these subjects..." ที่ขยายประโยคหลัก'),
          t2(' believing these '),
          typ2('t2-twe-2-b1l', 'subject', ['subjects'], 'plural', '"these subjects" ใช้ demonstrative พหูพจน์ "these" นำหน้า จึงต้องเป็นพหูพจน์'),
          t2(' offer more '),
          sel2('t2-twe-2-b1x7', ['immediate', 'immediately', 'immediacy'], 'immediate', 'participle', 'ต้องการคำคุณศัพท์ (adjective) ขยาย career benefits จึงใช้ immediate ไม่ใช่ adverb immediately'),
          t2(' career '),
          sel2('t2-twe-2-b1m', ['benefits', 'benefit', 'beneficial'], 'benefits', 'plural', 'ต้องการคำนามพหูพจน์ (noun, plural) หลัง "more immediate career" ไม่ใช่คำคุณศัพท์ beneficial'),
          t2('. '),
          sel2('t2-twe-2-b1n', ['From this perspective', 'It is undeniable', 'To begin with'], 'From this perspective', 'transition', '"From this perspective" สรุปมุมมองก่อนประโยคปิดท้ายย่อหน้า'),
          t2(', it is '),
          sel2('t2-twe-2-b1x8', ['understandable', 'understanding', 'understood'], 'understandable', 'participle', 'ต้องการคำคุณศัพท์ (adjective) หลัง be-verb จึงใช้ understandable (เข้าใจได้)'),
          t2(' why '),
          sel2('t2-twe-2-b1x8b', ['some', 'few', 'little'], 'some', 'plural', '"some would believe" หมายถึงบางคน ใช้ some กับคนทั่วไป ไม่ใช่ few/little'),
          t2(' '),
          typ2('t2-twe-2-b1x8c', 'would', ['would'], 'verb-tense', '"would believe" เป็น modal verb แสดงสมมติฐาน ตามด้วย base form ของกริยา believe'),
          t2(' believe that '),
          typ2('t2-twe-2-b1x9', 'focus', ['focusing'], 'verb-tense', '"focusing on the present" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' on '),
          sel2('t2-twe-2-b1x9b', ['the', 'a', WGB2_NO_ARTICLE], 'the', 'article', '"the present" หมายถึงปัจจุบันที่เจาะจง จึงใช้ the'),
          t2(' present is more '),
          sel2('t2-twe-2-b1o', ['useful', 'usefully', 'usefulness'], 'useful', 'participle', 'ต้องการคำคุณศัพท์ (adjective) หลัง "more" จึงใช้ useful ไม่ใช่ usefully (adv.) หรือ usefulness (n.)'),
          t2(' than '),
          typ2('t2-twe-2-b1x10', 'study', ['studying'], 'verb-tense', '"studying the past" เป็น gerund phrase ในโครงสร้างเปรียบเทียบ than'),
          t2(' the past.')
        ]
      },
      {
        id: 'gb2-voh-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          sel2('t2-twe-2-b2start', ['However', 'For instance', 'To begin with'], 'However', 'transition', 'ย่อหน้านี้ขัดแย้งกับย่อหน้าก่อนหน้า (concession → rebuttal) จึงใช้ However'),
          t2(', I '),
          typ2('t2-twe-2-b2x0', 'would', ['would'], 'verb-tense', '"would argue" เป็น modal verb แสดงความตั้งใจ ตามด้วย base form ของกริยา argue'),
          t2(' '),
          sel2('t2-twe-2-b2x1', ['personally', 'personal', 'person'], 'personally', 'participle', 'ต้องการคำกริยาวิเศษณ์ (adverb) ขยาย argue จึงใช้ personally'),
          t2(' argue in favor of '),
          sel2('t2-twe-2-b2x1b', ['the', 'a', WGB2_NO_ARTICLE], 'the', 'article', '"the idea that" เป็นสำนวนคงที่ ใช้ the เสมอ'),
          t2(' idea that '),
          typ2('t2-twe-2-b2a', 'learn', ['learning'], 'verb-tense', '"learning about the past" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' about '),
          sel2('t2-twe-2-b2x2', ['the', 'a', WGB2_NO_ARTICLE], 'the', 'article', '"the past" หมายถึงอดีตที่เจาะจง จึงใช้ the'),
          t2(' past is '),
          sel2('t2-twe-2-b2b', ['essential', 'essentially', 'essentials'], 'essential', 'participle', 'ต้องการคำคุณศัพท์ (adjective) หลัง be-verb จึงใช้ essential ไม่ใช่ essentially (adv.) หรือ essentials (n.)'),
          t2('. '),
          sel2('t2-twe-2-b2mid', ['To put it simply', 'For example', 'In conclusion'], 'To put it simply', 'transition', '"To put it simply" ใช้ก่อนอธิบายเหตุผลให้เข้าใจง่าย'),
          t2(', this '),
          typ2('t2-twe-2-b2x2c', 'be', ['is'], 'verb-tense', 'ประธาน "this" เป็นเอกพจน์ กริยาปัจจุบันจึงใช้ is'),
          t2(' due to '),
          sel2('t2-twe-2-b2x2b', ['the', 'a', WGB2_NO_ARTICLE], 'the', 'article', '"due to the fact that" เป็นสำนวนคงที่ ใช้ the เสมอ'),
          t2(' fact that history '),
          typ2('t2-twe-2-b2c', 'allow', ['allows'], 'verb-tense', 'ประธาน "history" เป็นเอกพจน์ กริยาปัจจุบันจึงเติม -s'),
          t2(' '),
          sel2('t2-twe-2-b2d', ['societies', 'society', 'the society'], 'societies', 'plural', '"societies" พูดถึงสังคมต่าง ๆ ทั่วโลกโดยทั่วไป จึงเป็นพหูพจน์ไม่ต้องมี the'),
          t2(' to '),
          typ2('t2-twe-2-b2x3', 'understand', ['understand'], 'verb-tense', 'หลัง "allows societies to" ต้องใช้ infinitive รูปเดิม (base form) จึงใช้ understand'),
          t2(' '),
          sel2('t2-twe-2-b2x3d', ['the', 'a', WGB2_NO_ARTICLE], 'the', 'article', '"the causes of present problems" เจาะจงสาเหตุที่กำลังพูดถึง จึงใช้ the'),
          t2(' '),
          sel2('t2-twe-2-b2x3b', ['causes', 'cause', 'caused'], 'causes', 'plural', '"the causes of present problems" หมายถึงสาเหตุหลายประการ จึงเป็นพหูพจน์'),
          t2(' of present '),
          typ2('t2-twe-2-b2e', 'problem', ['problems'], 'plural', '"present problems" พูดถึงปัญหาหลายอย่างโดยทั่วไป จึงเป็นพหูพจน์'),
          t2(' and '),
          typ2('t2-twe-2-b2x4', 'avoid', ['avoid'], 'verb-tense', 'ขนานกับ "understand" ด้านหน้าหลัง to (parallel infinitive without to-repeat: to understand...and avoid)'),
          t2(' repeating past '),
          typ2('t2-twe-2-b2f', 'mistake', ['mistakes'], 'plural', '"past mistakes" พูดถึงความผิดพลาดหลายครั้งโดยทั่วไป จึงเป็นพหูพจน์'),
  t2(', '),
          typ2('t2-twe-2-b2fx', 'which', ['which'], 'verb-tense', '"which" เป็น relative pronoun อ้างถึงประโยคก่อนหน้าทั้งหมด ใช้รูปเดิมเสมอ'),
          t2(' can be extremely '),
          sel2('t2-twe-2-b2g', ['costly', 'cost', 'costs'], 'costly', 'participle', 'ต้องการคำคุณศัพท์ (adjective) หลัง be-verb จึงใช้ costly ไม่ใช่คำนาม/กริยา cost'),
          t2('. '),
          sel2('t2-twe-2-b2h', ['For instance', 'However', 'To begin with'], 'For instance', 'transition', '"For instance" ยกตัวอย่างวิกฤตการเงินปี 2008 มาสนับสนุน'),
          t2(', many '),
          typ2('t2-twe-2-b2x5', 'country', ['countries'], 'plural', '"many countries" ตามด้วยคำนามพหูพจน์เสมอ'),
          t2(' continue to '),
          typ2('t2-twe-2-b2i', 'study', ['study'], 'verb-tense', 'หลัง "continue to" ต้องใช้ infinitive รูปเดิม (base form) จึงใช้ study'),
          t2(' the causes of '),
          sel2('t2-twe-2-b2x5b', ['the', 'a', WGB2_NO_ARTICLE], 'the', 'article', '"the 2008 financial crisis" เจาะจงเหตุการณ์เดียวที่รู้กันแล้ว จึงใช้ the'),
          t2(' 2008 financial crisis in order to '),
          sel2('t2-twe-2-b2x6', ['prevent', 'preventing', 'prevented'], 'prevent', 'verb-tense', 'หลัง "in order to" ต้องใช้ infinitive รูปเดิม (base form) จึงใช้ prevent'),
          t2(' '),
          sel2('t2-twe-2-b2x5c', ['similar', 'similarly', 'similarity'], 'similar', 'participle', 'ต้องการคำคุณศัพท์ (adjective) ขยาย economic collapses จึงใช้ similar ไม่ใช่ adverb similarly'),
          t2(' economic '),
          typ2('t2-twe-2-b2j', 'collapse', ['collapses'], 'plural', '"economic collapses" พูดถึงวิกฤตเศรษฐกิจหลายครั้งในอนาคต จึงเป็นพหูพจน์'),
          t2(' in '),
          sel2('t2-twe-2-b2x5d', ['the', 'a', WGB2_NO_ARTICLE], 'the', 'article', '"the future" หมายถึงอนาคตที่เจาะจงในบริบทนี้ จึงใช้ the'),
          t2(' future. '),
          sel2('t2-twe-2-b2k', ['In this respect', 'However', 'For example'], 'In this respect', 'transition', '"In this respect" สรุปมุมมองในย่อหน้านี้ก่อนขึ้นประโยคปิดท้าย'),
          t2(', it is '),
          sel2('t2-twe-2-b2x7', ['evident', 'evidently', 'evidence'], 'evident', 'participle', 'ต้องการคำคุณศัพท์ (adjective) หลัง be-verb จึงใช้ evident ไม่ใช่คำนาม evidence หรือ adverb evidently'),
          t2(' that '),
          typ2('t2-twe-2-b2l', 'study', ['studying'], 'verb-tense', '"studying history" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' history '),
          sel2('t2-twe-2-b2x8', ['provides', 'provide', 'provided'], 'provides', 'verb-tense', 'ประธาน "studying history" (gerund) เป็นเอกพจน์ กริยาปัจจุบันจึงเติม -s'),
          t2(' '),
          sel2('t2-twe-2-b2m', ['valuable', 'value', 'valuably'], 'valuable', 'participle', 'ต้องการคำคุณศัพท์ (adjective) วางหน้าคำนาม lessons จึงใช้ valuable ไม่ใช่คำนาม value หรือ adverb valuably'),
          t2(' '),
          typ2('t2-twe-2-b2x9', 'lesson', ['lessons'], 'plural', '"valuable lessons" พูดถึงบทเรียนหลายข้อโดยทั่วไป จึงเป็นพหูพจน์'),
          t2(' that '),
          sel2('t2-twe-2-b2x10', ['directly', 'direct', 'direction'], 'directly', 'participle', 'ต้องการคำกริยาวิเศษณ์ (adverb) ขยาย benefit จึงใช้ directly ไม่ใช่คำคุณศัพท์ direct'),
          t2(' benefit '),
          sel2('t2-twe-2-b2x11', ['the', 'a', WGB2_NO_ARTICLE], 'the', 'article', '"the present" หมายถึงปัจจุบันที่เจาะจง จึงใช้ the'),
          t2(' present.')
        ]
      },
      {
        id: 'gb2-voh-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          sel2('t2-twe-2-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', 'transition', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', '),
          typ2('t2-twe-2-cx0', 'although', ['although'], 'verb-tense', '"although" เป็นคำเชื่อมแสดงความขัดแย้ง ใช้รูปเดิมเสมอ ไม่ผัน'),
          t2(' it is '),
          sel2('t2-twe-2-cx1', ['undeniable', 'undeniably', 'deny'], 'undeniable', 'participle', 'ต้องการคำคุณศัพท์ (adjective) หลัง be-verb จึงใช้ undeniable ไม่ใช่ adverb undeniably'),
          t2(' that historical '),
          typ2('t2-twe-2-c0', 'event', ['events'], 'plural', '"historical events" พูดถึงเหตุการณ์หลายเหตุการณ์ จึงเป็นพหูพจน์'),
          t2(' themselves cannot be '),
          typ2('t2-twe-2-c1', 'change', ['changed'], 'verb-tense', 'passive voice "cannot be + V3" จึงใช้ changed'),
          t2(', I '),
          typ2('t2-twe-2-cx0b', 'be', ['am'], 'verb-tense', 'ประธาน "I" ตามด้วย am (present simple ของ be) จึงใช้ am'),
          t2(' of the '),
          sel2('t2-twe-2-cx2', ['opinion', 'opinions', 'opinionated'], 'opinion', 'plural', '"I am of the opinion that" เป็นสำนวนคงที่ ใช้เอกพจน์ opinion เสมอ'),
          t2(' that '),
          typ2('t2-twe-2-c2', 'learn', ['learning'], 'verb-tense', '"learning about the past" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' about '),
          sel2('t2-twe-2-cx1b', ['the', 'a', WGB2_NO_ARTICLE], 'the', 'article', '"the past" หมายถึงอดีตที่เจาะจง จึงใช้ the'),
          t2(' past '),
          typ2('t2-twe-2-cx1d', 'be', ['is'], 'verb-tense', 'ประธาน "learning about the past" (gerund) เอกพจน์ กริยาปัจจุบันจึงใช้ is'),
          t2(' highly '),
          sel2('t2-twe-2-c3', ['valuable', 'value', 'valued'], 'valuable', 'participle', 'ต้องการคำคุณศัพท์ (adjective) หลัง "highly" จึงใช้ valuable'),
          t2(', as it '),
          sel2('t2-twe-2-cx1c', ['helps', 'help', 'helped'], 'helps', 'verb-tense', 'ประธาน "it" เป็นเอกพจน์ กริยาปัจจุบันจึงเติม -s'),
          t2(' '),
          typ2('t2-twe-2-c4', 'society', ['societies'], 'plural', '"societies" พูดถึงสังคมต่าง ๆ ทั่วไป จึงเป็นพหูพจน์'),
          t2(' '),
          sel2('t2-twe-2-cx4', ['avoid', 'avoiding', 'avoided'], 'avoid', 'verb-tense', 'หลัง "helps societies" ต้องใช้ infinitive แบบไม่มี to (bare infinitive) จึงใช้ avoid'),
          t2(' repeating the '),
          sel2('t2-twe-2-cx3', ['same', 'similar', 'similarity'], 'same', 'plural', '"the same mistakes" ใช้ same (เหมือนเดิม) ไม่ใช่ similar (คล้ายกัน) เพราะพูดถึงความผิดพลาดเดิมที่เคยเกิด'),
          t2(' '),
          typ2('t2-twe-2-c5', 'mistake', ['mistakes'], 'plural', '"the same mistakes" พูดถึงความผิดพลาดหลายครั้ง จึงเป็นพหูพจน์'),
          t2('.')
        ]
      }
    ]
  },
  {
    id: 'gb2-science-funding',
    promptId: 't2-twe-3',
    steps: [
      {
        id: 'gb2-sf-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('It has been widely '),
          typ2('t2-twe-3-i0', 'argue', ['argued'], 'verb-tense', 'passive voice "has been + V3" จึงใช้ argued'),
          t2(' that while private companies can '),
          typ2('t2-twe-3-i1', 'drive', ['drive'], 'verb-tense', 'ขนานกับ can + base verb'),
          t2(' rapid technological innovation, scientific research should ultimately remain under government control. Others argue that private companies are better '),
          typ2('t2-twe-3-i2', 'position', ['positioned'], 'verb-tense', 'passive voice "are + V3" จึงใช้ positioned'),
          t2(' to fund and '),
          typ2('t2-twe-3-i3', 'accelerate', ['accelerate'], 'verb-tense', 'ขนานกับ to fund ด้านหน้า (parallel infinitive)'),
          t2(' scientific progress. I personally believe that governments should '),
          typ2('t2-twe-3-i4', 'retain', ['retain'], 'verb-tense', 'ขนานกับ should + base verb'),
          t2(' primary control over scientific research, and my reasons will be '),
          typ2('t2-twe-3-i5', 'elaborate', ['elaborated'], 'verb-tense', 'passive voice "will be + V3" จึงใช้ elaborated'),
          t2(' on in the following paragraphs.')
        ]
      },
      {
        id: 'gb2-sf-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-twe-3-b1start', ['To begin with', 'To explain it simply', 'For example'], 'To begin with', '"To begin with" ใช้เปิดย่อหน้าแรกเพื่อเริ่มเหตุผลข้อแรก'),
          t2(', it might seem sensible for some to claim that private companies are better suited to '),
          typ2('t2-twe-3-b1a', 'lead', ['lead'], 'verb-tense', 'ขนานกับ to + base verb'),
          t2(' scientific research. '),
          drag2('t2-twe-3-b1mid', ['To explain it simply', 'To begin with', 'From this perspective'], 'To explain it simply', '"To explain it simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is possibly because private firms often have greater funding and stronger commercial incentives to '),
          typ2('t2-twe-3-b1b', 'innovate', ['innovate'], 'verb-tense', 'ขนานกับ to + base verb'),
          t2(' quickly'),
          punc2('t2-twe-3-b1c', ['semicolon', 'period', 'comma'], 'semicolon', 'semicolon ก่อน therefore ที่เชื่อมสองประโยคสมบูรณ์ที่เกี่ยวข้องกัน'),
          t2(' therefore'),
          punc2('t2-twe-3-b1c2', ['comma', 'period', 'none'], 'comma', 'comma หลัง therefore ก่อนขึ้นใจความหลักของประโยค'),
          t2(' breakthroughs can '),
          typ2('t2-twe-3-b1d', 'reach', ['reach'], 'verb-tense', 'ขนานกับ can + base verb'),
          t2(' the public faster than through government-led projects. '),
          drag2('t2-twe-3-b1e', ['For example', 'To begin with', 'In this respect'], 'For example', '"For example" ยกตัวอย่างวัคซีน COVID-19'),
          t2(', private pharmaceutical companies '),
          typ2('t2-twe-3-b1f', 'develop', ['developed'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ developed'),
          t2(' COVID-19 vaccines within less than a year of the pandemic '),
          typ2('t2-twe-3-b1g', 'begin', ['beginning'], 'verb-tense', '"the pandemic beginning" เป็น gerund phrase หลัง of'),
          t2('. '),
          drag2('t2-twe-3-b1h', ['From this perspective', 'To explain it simply', 'For instance'], 'From this perspective', '"From this perspective" สรุปมุมมองของฝ่ายที่เห็นต่างก่อนขึ้นย่อหน้าถัดไป'),
          t2(', it is understandable why some would believe that private companies '),
          typ2('t2-twe-3-b1i', 'drive', ['drive'], 'verb-tense', 'ประธาน "private companies" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' scientific progress more effectively than governments.')
        ]
      },
      {
        id: 'gb2-sf-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          drag2('t2-twe-3-b2start', ['However', 'To begin with', 'For example'], 'However', '"However" เปิดย่อหน้าเพื่อโต้แย้งมุมมองในย่อหน้าก่อนหน้า'),
          t2(', I would personally argue in favor of the idea that governments should '),
          typ2('t2-twe-3-b2a', 'retain', ['retain'], 'verb-tense', 'ขนานกับ should + base verb'),
          t2(' control over scientific research. '),
          drag2('t2-twe-3-b2mid', ['To put it simply', 'However', 'In this respect'], 'To put it simply', '"To put it simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is due to the fact that government funding ensures research '),
          typ2('t2-twe-3-b2b', 'prioritize', ['prioritizes'], 'verb-tense', 'ประธาน "research" เป็นเอกพจน์ จึงใช้ prioritizes'),
          t2(' public benefit rather than profit, which private companies cannot always '),
          typ2('t2-twe-3-b2c', 'guarantee', ['guarantee'], 'verb-tense', 'ขนานกับ cannot + base verb'),
          t2('. '),
          drag2('t2-twe-3-b2d', ['For instance', 'To put it simply', 'In this respect'], 'For instance', '"For instance" ยกตัวอย่างองค์กร NASA'),
          t2(', publicly '),
          typ2('t2-twe-3-b2e', 'fund', ['funded'], 'participle', '"publicly funded institutions" — V3 ทำหน้าที่คุณศัพท์วางหน้าคำนาม แปลว่าสถาบันที่ได้รับเงินทุนจากภาครัฐ'),
          t2(' institutions such as NASA have '),
          typ2('t2-twe-3-b2f', 'make', ['made'], 'verb-tense', 'present perfect "have + V3" จึงใช้ made'),
          t2(' major scientific discoveries that were '),
          typ2('t2-twe-3-b2g', 'share', ['shared'], 'verb-tense', 'passive voice "were + V3" จึงใช้ shared'),
          t2(' freely with the world instead of being '),
          typ2('t2-twe-3-b2h', 'sell', ['sold'], 'verb-tense', 'passive voice "being + V3" จึงใช้ sold'),
          t2(' for profit. '),
          drag2('t2-twe-3-b2i', ['In this respect', 'For instance', 'However'], 'In this respect', '"In this respect" สรุปมุมมองในย่อหน้านี้ก่อนขึ้นประโยคปิดท้าย'),
          t2(', it is evident that government-controlled research better '),
          typ2('t2-twe-3-b2j', 'serve', ['serves'], 'verb-tense', 'ประธาน "government-controlled research" เป็นเอกพจน์ จึงใช้ serves'),
          t2(' the interests of society as a whole.')
        ]
      },
      {
        id: 'gb2-sf-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-twe-3-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that private companies can '),
          typ2('t2-twe-3-c0', 'accelerate', ['accelerate'], 'verb-tense', 'ขนานกับ can + base verb'),
          t2(' certain scientific breakthroughs, I am of the opinion that governments should remain in control of scientific research, as this best '),
          typ2('t2-twe-3-c1', 'protect', ['protects'], 'verb-tense', 'ประธาน "this" เป็นเอกพจน์ จึงใช้ protects'),
          t2(' the public interest.')
        ]
      }
    ]
  },
  {
    id: 'gb2-arts-subjects',
    promptId: 't2-twe-4',
    steps: [
      {
        id: 'gb2-as-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('It has been widely '),
          typ2('t2-twe-4-i0', 'argue', ['argued'], 'verb-tense', 'passive voice "has been + V3" จึงใช้ argued'),
          t2(' that while '),
          typ2('t2-twe-4-i1', 'rise', ['rising'], 'participle', '"rising tuition fees" — v-ing ทำหน้าที่คุณศัพท์ แปลว่าค่าเทอมที่กำลังเพิ่มขึ้น'),
          t2(' tuition fees make practical courses more appealing, universities should stop '),
          typ2('t2-twe-4-i2', 'teach', ['teaching'], 'verb-tense', '"stop teaching" ตามด้วย gerund เสมอหลัง stop'),
          t2(' arts subjects such as philosophy and history in favor of purely practical courses. Others argue that '),
          typ2('t2-twe-4-i3', 'focus', ['focusing'], 'verb-tense', '"focusing solely on..." เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' solely on employment-focused courses would better prepare graduates for the job market. I personally believe that universities should continue '),
          typ2('t2-twe-4-i4', 'offer', ['offering'], 'verb-tense', '"continue offering" ตามด้วย gerund หลัง continue'),
          t2(' arts subjects, and my reasons will be '),
          typ2('t2-twe-4-i5', 'elaborate', ['elaborated'], 'verb-tense', 'passive voice "will be + V3" จึงใช้ elaborated'),
          t2(' on in the following paragraphs.')
        ]
      },
      {
        id: 'gb2-as-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-twe-4-b1start', ['To begin with', 'To explain it simply', 'For example'], 'To begin with', '"To begin with" ใช้เปิดย่อหน้าแรกเพื่อเริ่มเหตุผลข้อแรก'),
          t2(', it might seem sensible for some to claim that universities should '),
          typ2('t2-twe-4-b1a', 'focus', ['focus'], 'verb-tense', 'ขนานกับ should + base verb'),
          t2(' only on practical courses. '),
          drag2('t2-twe-4-b1mid', ['To explain it simply', 'To begin with', 'From this perspective'], 'To explain it simply', '"To explain it simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is possibly because graduates with technical skills often '),
          typ2('t2-twe-4-b1b', 'find', ['find'], 'verb-tense', 'ประธาน "graduates" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' employment more quickly after graduation'),
          punc2('t2-twe-4-b1c', ['semicolon', 'period', 'comma'], 'semicolon', 'semicolon ก่อน therefore ที่เชื่อมสองประโยคสมบูรณ์ที่เกี่ยวข้องกัน'),
          t2(' therefore'),
          punc2('t2-twe-4-b1c2', ['comma', 'period', 'none'], 'comma', 'comma หลัง therefore ก่อนขึ้นใจความหลักของประโยค'),
          t2(' '),
          typ2('t2-twe-4-b1d', 'replace', ['replacing'], 'verb-tense', '"replacing arts subjects" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' arts subjects with practical training could reduce graduate unemployment. '),
          drag2('t2-twe-4-b1e', ['For example', 'To begin with', 'In this respect'], 'For example', '"For example" ยกตัวอย่างเงินเดือนของบัณฑิตสายวิศวกรรม'),
          t2(', engineering and computer science graduates in many countries '),
          typ2('t2-twe-4-b1f', 'report', ['report'], 'verb-tense', 'ประธาน "graduates" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' considerably higher starting salaries than graduates of arts programs. '),
          drag2('t2-twe-4-b1g', ['From this perspective', 'To explain it simply', 'For instance'], 'From this perspective', '"From this perspective" สรุปมุมมองของฝ่ายที่เห็นต่างก่อนขึ้นย่อหน้าถัดไป'),
          t2(', it is understandable why some would believe that practical courses better '),
          typ2('t2-twe-4-b1h', 'prepare', ['prepare'], 'verb-tense', 'ประธาน "practical courses" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' students for the job market.')
        ]
      },
      {
        id: 'gb2-as-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          drag2('t2-twe-4-b2start', ['However', 'To begin with', 'For example'], 'However', '"However" เปิดย่อหน้าเพื่อโต้แย้งมุมมองในย่อหน้าก่อนหน้า'),
          t2(', I would personally argue in favor of the idea that universities should continue '),
          typ2('t2-twe-4-b2a', 'teach', ['teaching'], 'verb-tense', '"continue teaching" ตามด้วย gerund หลัง continue'),
          t2(' arts subjects. '),
          drag2('t2-twe-4-b2mid', ['To put it simply', 'However', 'In this respect'], 'To put it simply', '"To put it simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is due to the fact that subjects such as philosophy and history '),
          typ2('t2-twe-4-b2b', 'develop', ['develop'], 'verb-tense', 'ประธาน "subjects" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' critical thinking and communication skills, which employers in every industry continue to '),
          typ2('t2-twe-4-b2c', 'value', ['value'], 'verb-tense', 'ขนานกับ to + base verb'),
          t2('. '),
          drag2('t2-twe-4-b2d', ['For instance', 'To put it simply', 'In this respect'], 'For instance', '"For instance" ยกตัวอย่างผู้นำธุรกิจที่ประสบความสำเร็จ'),
          t2(', many successful business leaders, including several well-known technology founders, credit their humanities education with '),
          typ2('t2-twe-4-b2e', 'shape', ['shaping'], 'verb-tense', '"with shaping..." ตามด้วย gerund เสมอหลัง with'),
          t2(' their creative and analytical abilities. '),
          drag2('t2-twe-4-b2f', ['In this respect', 'For instance', 'However'], 'In this respect', '"In this respect" สรุปมุมมองในย่อหน้านี้ก่อนขึ้นประโยคปิดท้าย'),
          t2(', it is evident that arts subjects '),
          typ2('t2-twe-4-b2g', 'provide', ['provide'], 'verb-tense', 'ประธาน "arts subjects" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' skills that remain valuable regardless of a graduate\'s chosen career.')
        ]
      },
      {
        id: 'gb2-as-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-twe-4-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that practical courses can improve graduates\' short-term job prospects, I am of the opinion that universities should continue '),
          typ2('t2-twe-4-c0', 'offer', ['offering'], 'verb-tense', '"continue offering" ตามด้วย gerund หลัง continue'),
          t2(' arts subjects, as they '),
          typ2('t2-twe-4-c1', 'build', ['build'], 'verb-tense', 'ประธาน "they" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' skills that benefit graduates throughout their careers.')
        ]
      }
    ]
  },
  {
    id: 'gb2-responsible-tourism',
    promptId: 't2-twe-5',
    steps: [
      {
        id: 'gb2-rt-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('It has been widely '),
          typ2('t2-twe-5-i0', 'argue', ['argued'], 'verb-tense', 'passive voice "has been + V3" จึงใช้ argued'),
          t2(' that while tourism inevitably '),
          typ2('t2-twe-5-i1', 'affect', ['affects'], 'verb-tense', 'ประธาน "tourism" เป็นเอกพจน์ จึงใช้ affects'),
          t2(' the places '),
          typ2('t2-twe-5-i2', 'visit', ['visited'], 'participle', '"the places visited" — V3 ทำหน้าที่คุณศัพท์ขยาย places แปลว่าสถานที่ที่ถูกไปเยือน'),
          t2(', it is impossible for any tourist to be truly responsible toward both culture and environment. Others argue that with careful planning, tourists can genuinely '),
          typ2('t2-twe-5-i3', 'reduce', ['reduce'], 'verb-tense', 'ขนานกับ can + base verb'),
          t2(' their negative impact. I personally believe that '),
          typ2('t2-twe-5-i4', 'be', ['being'], 'verb-tense', '"being a responsible tourist" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' a responsible tourist is possible, and my reasons will be '),
          typ2('t2-twe-5-i5', 'elaborate', ['elaborated'], 'verb-tense', 'passive voice "will be + V3" จึงใช้ elaborated'),
          t2(' on in the following paragraphs.')
        ]
      },
      {
        id: 'gb2-rt-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-twe-5-b1start', ['To begin with', 'To explain it simply', 'For example'], 'To begin with', '"To begin with" ใช้เปิดย่อหน้าแรกเพื่อเริ่มเหตุผลข้อแรก'),
          t2(', it might seem sensible for some to claim that responsible tourism is impossible to '),
          typ2('t2-twe-5-b1a', 'achieve', ['achieve'], 'verb-tense', 'ขนานกับ to + base verb'),
          t2('. '),
          drag2('t2-twe-5-b1mid', ['To explain it simply', 'To begin with', 'From this perspective'], 'To explain it simply', '"To explain it simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is possibly because even eco-friendly travel requires transportation that '),
          typ2('t2-twe-5-b1b', 'produce', ['produces'], 'verb-tense', 'ประธาน "transportation that" เป็นเอกพจน์ จึงใช้ produces'),
          t2(' carbon emissions'),
          punc2('t2-twe-5-b1c', ['semicolon', 'period', 'comma'], 'semicolon', 'semicolon ก่อน therefore ที่เชื่อมสองประโยคสมบูรณ์ที่เกี่ยวข้องกัน'),
          t2(' therefore'),
          punc2('t2-twe-5-b1c2', ['comma', 'period', 'none'], 'comma', 'comma หลัง therefore ก่อนขึ้นใจความหลักของประโยค'),
          t2(' every visit inevitably '),
          typ2('t2-twe-5-b1d', 'damage', ['damages'], 'verb-tense', 'ประธาน "every visit" เป็นเอกพจน์ จึงใช้ damages'),
          t2(' the environment to some degree. '),
          drag2('t2-twe-5-b1e', ['For example', 'To begin with', 'In this respect'], 'For example', '"For example" ยกตัวอย่างเที่ยวบินไปหมู่เกาะมัลดีฟส์'),
          t2(', flights to popular island destinations such as the Maldives '),
          typ2('t2-twe-5-b1f', 'contribute', ['contribute'], 'verb-tense', 'ประธาน "flights" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' significantly to global carbon emissions regardless of a tourist\'s intentions. '),
          drag2('t2-twe-5-b1g', ['From this perspective', 'To explain it simply', 'For instance'], 'From this perspective', '"From this perspective" สรุปมุมมองของฝ่ายที่เห็นต่างก่อนขึ้นย่อหน้าถัดไป'),
          t2(', it is understandable why some would believe that no tourist can be entirely responsible.')
        ]
      },
      {
        id: 'gb2-rt-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          drag2('t2-twe-5-b2start', ['However', 'To begin with', 'For example'], 'However', '"However" เปิดย่อหน้าเพื่อโต้แย้งมุมมองในย่อหน้าก่อนหน้า'),
          t2(', I would personally argue in favor of the idea that responsible tourism is '),
          typ2('t2-twe-5-b2a', 'achieve', ['achievable'], 'verb-tense', '"-able" adjective form แปลว่าสามารถทำได้'),
          t2('. '),
          drag2('t2-twe-5-b2mid', ['To put it simply', 'However', 'In this respect'], 'To put it simply', '"To put it simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is due to the fact that tourists can make deliberate choices, such as '),
          typ2('t2-twe-5-b2b', 'support', ['supporting'], 'verb-tense', '"such as supporting..." ตามด้วย gerund หลัง such as'),
          t2(' local businesses and '),
          typ2('t2-twe-5-b2c', 'respect', ['respecting'], 'verb-tense', 'ขนานกับ supporting ด้านหน้า (parallel gerund)'),
          t2(' local customs, which significantly '),
          typ2('t2-twe-5-b2d', 'reduce', ['reduce'], 'verb-tense', 'ประธาน "which" อ้างถึง choices ที่เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' their overall impact. '),
          drag2('t2-twe-5-b2e', ['For instance', 'To put it simply', 'In this respect'], 'For instance', '"For instance" ยกตัวอย่างประเทศภูฏาน'),
          t2(', many visitors to Bhutan '),
          typ2('t2-twe-5-b2f', 'follow', ['follow'], 'verb-tense', 'ประธาน "many visitors" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' strict government guidelines '),
          typ2('t2-twe-5-b2g', 'design', ['designed'], 'participle', '"guidelines designed to protect..." — V3 ทำหน้าที่คุณศัพท์ขยาย guidelines'),
          t2(' to protect both the environment and traditional culture. '),
          drag2('t2-twe-5-b2h', ['In this respect', 'For instance', 'However'], 'In this respect', '"In this respect" สรุปมุมมองในย่อหน้านี้ก่อนขึ้นประโยคปิดท้าย'),
          t2(', it is evident that responsible tourism, while not perfect, is a realistic and achievable goal.')
        ]
      },
      {
        id: 'gb2-rt-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-twe-5-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that all tourism carries some environmental cost, I am of the opinion that '),
          typ2('t2-twe-5-c0', 'be', ['being'], 'verb-tense', '"being a responsible tourist" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' a responsible tourist is possible, as thoughtful choices can greatly '),
          typ2('t2-twe-5-c1', 'reduce', ['reduce'], 'verb-tense', 'ขนานกับ can + base verb'),
          t2(' this impact.')
        ]
      }
    ]
  },
  {
    id: 'gb2-prevent-extinction',
    promptId: 't2-twe-6',
    steps: [
      {
        id: 'gb2-pe-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('It has been widely '),
          typ2('t2-twe-6-i0', 'argue', ['argued'], 'verb-tense', 'passive voice "has been + V3" จึงใช้ argued'),
          t2(' that while extinction has '),
          typ2('t2-twe-6-i1', 'occur', ['occurred'], 'verb-tense', 'present perfect "has + V3" จึงใช้ occurred'),
          t2(' naturally throughout Earth\'s history, humans have no obligation to prevent animal species from '),
          typ2('t2-twe-6-i2', 'die', ['dying'], 'verb-tense', '"prevent...from dying out" ตามด้วย gerund หลัง from'),
          t2(' out today. Others argue that people have a responsibility to protect endangered species from '),
          typ2('t2-twe-6-i3', 'disappear', ['disappearing'], 'verb-tense', '"protect...from disappearing" ตามด้วย gerund หลัง from'),
          t2(' completely. I personally believe that humans should actively work to prevent extinction, and my reasons will be '),
          typ2('t2-twe-6-i4', 'elaborate', ['elaborated'], 'verb-tense', 'passive voice "will be + V3" จึงใช้ elaborated'),
          t2(' on in the following paragraphs.')
        ]
      },
      {
        id: 'gb2-pe-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-twe-6-b1start', ['To begin with', 'To explain it simply', 'For example'], 'To begin with', '"To begin with" ใช้เปิดย่อหน้าแรกเพื่อเริ่มเหตุผลข้อแรก'),
          t2(', it might seem sensible for some to claim that extinction is simply a natural process that should not be '),
          typ2('t2-twe-6-b1a', 'interfere', ['interfered'], 'verb-tense', 'passive voice "should not be + V3" จึงใช้ interfered'),
          t2(' with. '),
          drag2('t2-twe-6-b1mid', ['To explain it simply', 'To begin with', 'From this perspective'], 'To explain it simply', '"To explain it simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is possibly because countless species, including dinosaurs, '),
          typ2('t2-twe-6-b1b', 'vanish', ['vanished'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ vanished'),
          t2(' long before humans '),
          typ2('t2-twe-6-b1c', 'exist', ['existed'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ existed'),
          punc2('t2-twe-6-b1d', ['semicolon', 'period', 'comma'], 'semicolon', 'semicolon ก่อน therefore ที่เชื่อมสองประโยคสมบูรณ์ที่เกี่ยวข้องกัน'),
          t2(' therefore'),
          punc2('t2-twe-6-b1d2', ['comma', 'period', 'none'], 'comma', 'comma หลัง therefore ก่อนขึ้นใจความหลักของประโยค'),
          t2(' some believe modern extinctions are merely part of the same natural cycle. '),
          drag2('t2-twe-6-b1e', ['For example', 'To begin with', 'In this respect'], 'For example', '"For example" ยกตัวอย่างสัตว์เลี้ยงลูกด้วยนมในยุคน้ำแข็ง'),
          t2(', several land mammal species '),
          typ2('t2-twe-6-b1f', 'disappear', ['disappeared'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ disappeared'),
          t2(' during past ice ages without any human involvement whatsoever. '),
          drag2('t2-twe-6-b1g', ['From this perspective', 'To explain it simply', 'For instance'], 'From this perspective', '"From this perspective" สรุปมุมมองของฝ่ายที่เห็นต่างก่อนขึ้นย่อหน้าถัดไป'),
          t2(', it is understandable why some would believe that current extinctions require no special human intervention.')
        ]
      },
      {
        id: 'gb2-pe-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          drag2('t2-twe-6-b2start', ['However', 'To begin with', 'For example'], 'However', '"However" เปิดย่อหน้าเพื่อโต้แย้งมุมมองในย่อหน้าก่อนหน้า'),
          t2(', I would personally argue in favor of the idea that humans should '),
          typ2('t2-twe-6-b2a', 'take', ['take'], 'verb-tense', 'ขนานกับ should + base verb'),
          t2(' active steps to prevent extinction. '),
          drag2('t2-twe-6-b2mid', ['To put it simply', 'However', 'In this respect'], 'To put it simply', '"To put it simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is due to the fact that most extinctions today are '),
          typ2('t2-twe-6-b2b', 'cause', ['caused'], 'verb-tense', 'passive voice "are + V3" จึงใช้ caused'),
          t2(' directly by human activity rather than natural processes, which '),
          typ2('t2-twe-6-b2c', 'make', ['makes'], 'verb-tense', 'ประธาน "which" อ้างถึง fact ที่เป็นเอกพจน์ จึงใช้ makes'),
          t2(' them our responsibility to address. '),
          drag2('t2-twe-6-b2d', ['For instance', 'To put it simply', 'In this respect'], 'For instance', '"For instance" ยกตัวอย่างรายงานของสหประชาชาติปี 2019'),
          t2(', a 2019 United Nations report '),
          typ2('t2-twe-6-b2e', 'find', ['found'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ found'),
          t2(' that around one million species now '),
          typ2('t2-twe-6-b2f', 'face', ['face'], 'verb-tense', 'ประธาน "species" เป็นพหูพจน์ในบริบทนี้ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' extinction largely because of habitat destruction and pollution. '),
          drag2('t2-twe-6-b2g', ['In this respect', 'For instance', 'However'], 'In this respect', '"In this respect" สรุปมุมมองในย่อหน้านี้ก่อนขึ้นประโยคปิดท้าย'),
          t2(', it is evident that human-driven extinction '),
          typ2('t2-twe-6-b2h', 'differ', ['differs'], 'verb-tense', 'ประธาน "human-driven extinction" เป็นเอกพจน์ จึงใช้ differs'),
          t2(' fundamentally from the natural extinctions of the distant past.')
        ]
      },
      {
        id: 'gb2-pe-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-twe-6-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that extinction has always '),
          typ2('t2-twe-6-c0', 'occur', ['occurred'], 'verb-tense', 'present perfect "has + V3" จึงใช้ occurred'),
          t2(' naturally, I am of the opinion that humans should work to prevent it, as most modern cases '),
          typ2('t2-twe-6-c1', 'result', ['result'], 'verb-tense', 'ประธาน "most modern cases" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' directly from human actions.')
        ]
      }
    ]
  },
  {
      id: 'gb2-prevent-vs-treat',
      promptId: 't2-twe-7',
      steps: [
        {
          id: 'gb2-pvt-intro',
          role: 'intro',
          labelTh: WGB2_ROLE_LABEL_TH.intro,
          segments: [
            t2('It '),
            typ2('t2-twe-7-i0z', 'have', ['has'], 'verb-tense', 'ประธาน "It" เอกพจน์ ใช้ present perfect passive "has been + V3" จึงต้องใช้ has ไม่ใช่ have'),
            t2(' been widely '),
            typ2('t2-twe-7-i0', 'argue', ['argued'], 'verb-tense', 'passive voice "has been + V3" จึงใช้ argued (V3)'),
            t2(' that while '),
            typ2('t2-twe-7-i1', 'treat', ['treating'], 'verb-tense', '"treating" เป็น gerund หลัง while ทำหน้าที่ประธานอนุประโยค'),
            t2(' illness remains '),
            sel2('t2-twe-7-i1b', ['necessary', 'necessity', 'necessitate'], 'necessary', 'participle', '"necessary" เป็นคำคุณศัพท์หลัง remains ไม่ใช่คำนาม necessity'),
            t2(', '),
            typ2('t2-twe-7-i1c', 'government', ['governments'], 'plural', '"governments" พูดถึงรัฐบาลโดยทั่วไปหลายประเทศ จึงเป็นพหูพจน์'),
            t2(' should '),
            sel2('t2-twe-7-i2', ['prioritize', 'ignore', 'delay'], 'prioritize', 'verb-tense', 'หลัง modal "should" ตามด้วย base form เสมอ จึงใช้ prioritize'),
            t2(' public '),
            sel2('t2-twe-7-i2b', ['spending', 'spend', 'spent'], 'spending', 'participle', '"public spending" ใช้ v-ing ทำหน้าที่คำนามนามธรรม (gerund) หลัง on'),
            t2(' on '),
            typ2('t2-twe-7-i3', 'promote', ['promoting'], 'verb-tense', '"promoting" เป็น gerund หลัง preposition on'),
            t2(' healthy '),
            typ2('t2-twe-7-i4', 'lifestyle', ['lifestyles'], 'plural', '"healthy lifestyles" พูดถึงวิถีชีวิตหลายรูปแบบ จึงเป็นพหูพจน์'),
            t2(' over '),
            typ2('t2-twe-7-i5', 'treat', ['treating'], 'verb-tense', '"treating" เป็น gerund หลัง over (preposition)'),
            t2(' '),
            sel2('t2-twe-7-i5b', ['people', 'person', 'peoples'], 'people', 'plural', '"people" เป็นพหูพจน์อยู่แล้วในตัวเอง (คำนามพหูพจน์ไม่ปกติ)'),
            t2(' who '),
            typ2('t2-twe-7-i5e', 'be', ['are'], 'verb-tense', 'ประธาน "who" อ้างถึง people (พหูพจน์) กริยาจึงใช้ are'),
            t2(' '),
            sel2('t2-twe-7-i5d', ['already', 'yet', 'ever'], 'already', 'transition', '"already" บอกว่าเหตุการณ์เกิดขึ้นแล้วก่อนหน้านี้ ตรงบริบท "sick" ที่มีอยู่แล้ว'),
            t2(' sick. '),
            sel2('t2-twe-7-i5c', ['Others', 'Other', 'The other'], 'Others', 'plural', '"Others" ใช้แทนกลุ่มคนอีกฝ่ายหนึ่ง เป็นพหูพจน์เสมอในความหมายนี้'),
            t2(' '),
            typ2('t2-twe-7-i6', 'argue', ['argue'], 'verb-tense', 'ประธาน "Others" พหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
            t2(' that '),
            sel2('t2-twe-7-i6b', ['treatment', 'treatments', 'treated'], 'treatment', 'plural', '"treatment" เป็นคำนามนามธรรม (uncountable) ใช้รูปเดียว'),
            t2(' should remain '),
            sel2('t2-twe-7-i7', ['the', 'a', WGB2_NO_ARTICLE], 'the', 'article', '"the top funding priority" เจาะจงว่าเป็นสิ่งสำคัญที่สุดสิ่งเดียว จึงใช้ the'),
            t2(' top funding '),
            sel2('t2-twe-7-i7b', ['priority', 'priorities', 'prior'], 'priority', 'plural', '"funding priority" พูดถึงลำดับความสำคัญเรื่องเดียว จึงเป็นเอกพจน์'),
            t2(', since sick '),
            typ2('t2-twe-7-i8', 'person', ['people'], 'plural', '"sick people" ใช้รูปพหูพจน์ไม่ปกติของ person'),
            t2(' '),
            typ2('t2-twe-7-i8b', 'need', ['need'], 'verb-tense', 'ประธาน "sick people" พหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
            t2(' '),
            sel2('t2-twe-7-i9', ['immediate', 'delayed', 'occasional'], 'immediate', 'transition', '"immediate" ตรงความหมายว่าต้องได้รับการดูแลทันที ต่างจาก delayed/occasional'),
            t2(' medical '),
            sel2('t2-twe-7-i9b', ['care', 'cares', 'caring'], 'care', 'plural', '"medical care" เป็นคำนามนามธรรม (uncountable) ใช้รูปเดียว'),
            t2('. I '),
            sel2('t2-twe-7-i9c', ['personally', 'personal', 'person'], 'personally', 'transition', '"personally" เป็นกริยาวิเศษณ์ขยาย believe แสดงความเห็นส่วนตัว'),
            t2(' '),
            typ2('t2-twe-7-i9d', 'believe', ['believe'], 'verb-tense', 'ประธาน "I" กริยาปัจจุบันจึงไม่เติม -s ใช้ believe'),
            t2(' that '),
            typ2('t2-twe-7-i10', 'prevent', ['prevention'], 'plural', '"prevention" เป็นคำนามนามธรรม (uncountable) ใช้รูปเดียว'),
            t2(' deserves '),
            sel2('t2-twe-7-i10b', ['greater', 'great', 'greatly'], 'greater', 'transition', '"greater" เป็นคำคุณศัพท์เปรียบเทียบขยาย investment'),
            t2(' public '),
            sel2('t2-twe-7-i10c', ['investment', 'invest', 'investing'], 'investment', 'plural', '"investment" เป็นคำนามนามธรรมในบริบทนี้ ใช้รูปเดียว'),
            t2(', and '),
            sel2('t2-twe-7-i10d', ['my', 'me', 'mine'], 'my', 'article', '"my reasons" ใช้ possessive my แสดงความเป็นเจ้าของ ไม่ใช่ me/mine'),
            t2(' '),
            typ2('t2-twe-7-i11', 'reason', ['reasons'], 'plural', '"reasons" พูดถึงเหตุผลหลายข้อที่จะตามมา จึงเป็นพหูพจน์'),
            t2(' will be '),
            typ2('t2-twe-7-i12', 'elaborate', ['elaborated'], 'verb-tense', 'passive voice "will be + V3" จึงใช้ elaborated'),
            t2(' on in '),
            sel2('t2-twe-7-i12b', ['the', 'a', WGB2_NO_ARTICLE], 'the', 'article', '"the following paragraphs" เจาะจงย่อหน้าที่จะตามมาในเรียงความนี้ จึงใช้ the'),
            t2(' following '),
            typ2('t2-twe-7-i13', 'paragraph', ['paragraphs'], 'plural', '"paragraphs" พูดถึงย่อหน้าหลายย่อหน้าที่จะตามมา จึงเป็นพหูพจน์'),
            t2('.'),
          ]
        },
        {
          id: 'gb2-pvt-body1',
          role: 'body1',
          labelTh: WGB2_ROLE_LABEL_TH.body1,
          segments: [
            sel2('t2-twe-7-b1s', ['To begin with', 'However', 'In conclusion'], 'To begin with', 'transition', '"To begin with" ใช้เปิดย่อหน้าแรกเพื่อเริ่มเหตุผลข้อแรก'),
            t2(', it '),
            sel2('t2-twe-7-b1a0', ['might', 'may have', 'must'], 'might', 'verb-tense', '"might" แสดงความเป็นไปได้แบบสุภาพ เหมาะกับการเสนอมุมมองฝ่ายตรงข้าม'),
            t2(' seem '),
            sel2('t2-twe-7-b1a1', ['sensible', 'sensitive', 'sensory'], 'sensible', 'participle', '"sensible" แปลว่าใช้เหตุผลได้ ต่างจาก sensitive (อ่อนไหว) และ sensory (เกี่ยวกับประสาทสัมผัส)'),
            t2(' for '),
            sel2('t2-twe-7-b1a3', ['some', 'anyone', 'someone else'], 'some', 'transition', '"some" หมายถึงคนบางกลุ่มที่เห็นต่าง ตรงบริบทมากกว่า anyone/someone else'),
            t2(' to '),
            sel2('t2-twe-7-b1a4', ['claim', 'claims', 'claimed'], 'claim', 'verb-tense', 'หลัง "to" ต้องตามด้วย base form เสมอ จึงใช้ claim'),
            t2(' that '),
            typ2('t2-twe-7-b1a', 'treat', ['treating'], 'verb-tense', '"treating" เป็น gerund ทำหน้าที่กรรมของ claim that'),
            t2(' existing '),
            sel2('t2-twe-7-b1a2', ['illness', 'illnesses', 'ill'], 'illness', 'plural', '"existing illness" พูดถึงความเจ็บป่วยที่มีอยู่แบบทั่วไป (uncountable) ใช้รูปเดียว'),
            t2(' should remain the '),
            typ2('t2-twe-7-b1b', 'government', ['government\'s'], 'article', '"the government\'s" ใช้ possessive apostrophe-s แสดงความเป็นเจ้าของ'),
            t2(' main '),
            sel2('t2-twe-7-b1c', ['priority', 'option', 'choice'], 'priority', 'transition', '"priority" ตรงความหมายว่าสิ่งสำคัญอันดับแรก ต่างจาก option/choice'),
            t2('. '),
            sel2('t2-twe-7-b1d', ['To explain it simply', 'For example', 'In conclusion'], 'To explain it simply', 'transition', '"To explain it simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
            t2(', this '),
            typ2('t2-twe-7-b1d2', 'be', ['is'], 'verb-tense', 'ประธาน "this" เอกพจน์ กริยาปัจจุบันจึงใช้ is'),
            t2(' possibly because sick '),
            typ2('t2-twe-7-b1e', 'patient', ['patients'], 'plural', '"sick patients" พูดถึงผู้ป่วยหลายคนโดยทั่วไป จึงเป็นพหูพจน์'),
            t2(' require '),
            sel2('t2-twe-7-b1e2', ['urgent', 'urgently', 'urgency'], 'urgent', 'participle', '"urgent" เป็นคำคุณศัพท์ขยาย medical attention'),
            t2(' medical '),
            sel2('t2-twe-7-b1f', ['attention', 'transportation', 'education'], 'attention', 'transition', '"attention" ตรงความหมายการดูแลเอาใจใส่ทางการแพทย์ ต่างจาก transportation/education'),
            t2(' that cannot be '),
            typ2('t2-twe-7-b1g', 'delay', ['delayed'], 'verb-tense', 'passive voice "cannot be + V3" จึงใช้ delayed'),
            sel2('t2-twe-7-b1h', ['; ', '. ', ', '], '; ', 'punct', 'เชื่อม 2 ประโยคสมบูรณ์เข้าด้วยกันก่อนคำเชื่อม therefore จึงใช้ semicolon (;)'),
            t2('therefore'),
            sel2('t2-twe-7-b1i', [', ', '. ', ' '], ', ', 'punct', 'หลังคำเชื่อม therefore ต้องมี comma เสมอก่อนขึ้นประโยคหลัก'),
            typ2('t2-twe-7-b1j', 'reduce', ['reducing'], 'verb-tense', '"reducing" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
            t2(' treatment '),
            sel2('t2-twe-7-b1j2', ['funding', 'fund', 'founding'], 'funding', 'participle', '"treatment funding" ใช้ v-ing ทำหน้าที่คำนามนามธรรม'),
            t2(' could put '),
            sel2('t2-twe-7-b1k', ['vulnerable', 'invulnerable', 'stable'], 'vulnerable', 'participle', '"vulnerable lives" — คำคุณศัพท์ vulnerable แปลว่าเปราะบาง ต่างจาก invulnerable (ไม่บอบบาง)'),
            t2(' '),
            typ2('t2-twe-7-b1l', 'life', ['lives'], 'plural', '"vulnerable lives" พูดถึงชีวิตของคนหลายคน จึงเป็นพหูพจน์'),
            t2(' at '),
            sel2('t2-twe-7-b1l2', ['serious', 'seriously', 'series'], 'serious', 'participle', '"serious risk" เป็นคำคุณศัพท์ขยาย risk ไม่ใช่กริยาวิเศษณ์ seriously'),
            t2(' '),
            sel2('t2-twe-7-b1l3', ['risk', 'risks', 'risky'], 'risk', 'plural', '"at serious risk" เป็นสำนวนใช้คำนามเอกพจน์ risk (uncountable ในบริบทนี้)'),
            t2('. '),
            sel2('t2-twe-7-b1m', ['For example', 'However', 'In conclusion'], 'For example', 'transition', '"For example" ยกตัวอย่างมาสนับสนุนประโยคก่อนหน้า'),
            t2(', '),
            sel2('t2-twe-7-b1m2', ['cancer', 'cancers', 'cancerous'], 'cancer', 'participle', '"cancer patients" ใช้ cancer เป็นคำคุณศัพท์ขยายคำนาม patients'),
            t2(' '),
            typ2('t2-twe-7-b1n', 'patient', ['patients'], 'plural', '"cancer patients" พูดถึงผู้ป่วยมะเร็งหลายคน จึงเป็นพหูพจน์'),
            t2(' and accident '),
            typ2('t2-twe-7-b1o', 'victim', ['victims'], 'plural', '"accident victims" พูดถึงผู้ประสบอุบัติเหตุหลายคน จึงเป็นพหูพจน์'),
            t2(' often need '),
            sel2('t2-twe-7-b1p', ['immediate', 'delayed', 'occasional'], 'immediate', 'transition', '"immediate" ตรงความหมายว่าต้องได้รับการดูแลทันที'),
            t2(' hospital '),
            sel2('t2-twe-7-b1p2', ['care', 'cares', 'caring'], 'care', 'plural', '"hospital care" เป็นคำนามนามธรรม (uncountable) ใช้รูปเดียว'),
            t2(' regardless of how much '),
            sel2('t2-twe-7-b1q0', ['money', 'moneys', 'monetary'], 'money', 'plural', '"how much money" เป็นคำนามนามธรรม (uncountable) ใช้รูปเดียว'),
            t2(' is '),
            typ2('t2-twe-7-b1q', 'spend', ['spent'], 'verb-tense', 'passive voice "is + V3" จึงใช้ spent'),
            t2(' on prevention. '),
            sel2('t2-twe-7-b1r', ['From this perspective', 'However', 'In conclusion'], 'From this perspective', 'transition', '"From this perspective" สรุปมุมมองในย่อหน้านี้ก่อนขึ้นประโยคปิดท้าย'),
            t2(', it '),
            typ2('t2-twe-7-b1r4', 'be', ['is'], 'verb-tense', 'ประธาน "it" เอกพจน์ กริยาปัจจุบันจึงใช้ is'),
            t2(' '),
            sel2('t2-twe-7-b1r2', ['understandable', 'understanding', 'understood'], 'understandable', 'participle', '"understandable" เป็นคำคุณศัพท์ที่ถูกต้องหลัง it is'),
            t2(' why '),
            sel2('t2-twe-7-b1r3', ['some', 'anyone', 'someone else'], 'some', 'transition', '"some" หมายถึงคนบางกลุ่ม ตรงบริบทมากกว่า anyone/someone else'),
            t2(' would believe that '),
            typ2('t2-twe-7-b1s2', 'treat', ['treating'], 'verb-tense', '"treating" เป็น gerund ทำหน้าที่ประธานอนุประโยค'),
            t2(' the sick should '),
            sel2('t2-twe-7-b1t2', ['take', 'takes', 'took'], 'take', 'verb-tense', 'หลัง modal "should" ตามด้วย base form เสมอ จึงใช้ take'),
            t2(' '),
            sel2('t2-twe-7-b1t', ['precedence', 'preference', 'presence'], 'precedence', 'transition', '"precedence" แปลว่าลำดับความสำคัญก่อน ต่างจาก preference/presence'),
            t2(' over prevention '),
            typ2('t2-twe-7-b1u', 'campaign', ['campaigns'], 'plural', '"prevention campaigns" พูดถึงแคมเปญหลายรายการ จึงเป็นพหูพจน์'),
            t2('.'),
          ]
        },
        {
          id: 'gb2-pvt-body2',
          role: 'body2',
          labelTh: WGB2_ROLE_LABEL_TH.body2,
          segments: [
            sel2('t2-twe-7-b2s', ['However', 'For example', 'In conclusion'], 'However', 'transition', 'ย่อหน้านี้ขัดแย้งกับย่อหน้าก่อนหน้า (concession → rebuttal) จึงใช้ However'),
            t2(', I would '),
            sel2('t2-twe-7-b2a2', ['personally', 'personal', 'person'], 'personally', 'transition', '"personally" ขยาย argue แสดงความเห็นส่วนตัวของผู้เขียน'),
            t2(' '),
            sel2('t2-twe-7-b2a', ['argue', 'argues', 'arguing'], 'argue', 'verb-tense', 'หลัง modal "would" ตามด้วย base form เสมอ จึงใช้ argue'),
            t2(' in '),
            sel2('t2-twe-7-b2a4', ['favor', 'favors', 'favored'], 'favor', 'plural', '"in favor of" เป็นสำนวนคงที่ ใช้คำนามเอกพจน์ favor เสมอ'),
            t2(' of the '),
            sel2('t2-twe-7-b2a3', ['idea', 'ideas', 'ideal'], 'idea', 'plural', '"the idea that" เป็นคำนามเอกพจน์นำหน้า that-clause'),
            t2(' that '),
            typ2('t2-twe-7-b2b', 'promote', ['promoting'], 'verb-tense', '"promoting" เป็น gerund ทำหน้าที่ประธานอนุประโยค'),
            t2(' healthy '),
            typ2('t2-twe-7-b2c', 'lifestyle', ['lifestyles'], 'plural', '"healthy lifestyles" พูดถึงวิถีชีวิตหลายรูปแบบ จึงเป็นพหูพจน์'),
            t2(' deserves '),
            sel2('t2-twe-7-b2c2', ['greater', 'great', 'greatly'], 'greater', 'transition', '"greater" เป็นคำคุณศัพท์เปรียบเทียบขยาย investment'),
            t2(' public '),
            typ2('t2-twe-7-b2c3', 'invest', ['investment'], 'plural', 'ต้องการคำนาม "investment" หลัง public ไม่ใช่กริยา invest'),
            t2('. '),
            sel2('t2-twe-7-b2d', ['To put it simply', 'For instance', 'In conclusion'], 'To put it simply', 'transition', '"To put it simply" ใช้ก่อนอธิบายเหตุผลให้เข้าใจง่าย'),
            t2(', this is due to the fact that '),
            typ2('t2-twe-7-b2e', 'prevent', ['preventing'], 'verb-tense', '"preventing" เป็น gerund ทำหน้าที่ประธานอนุประโยค'),
            t2(' '),
            sel2('t2-twe-7-b2e2', ['illness', 'illnesses', 'ill'], 'illness', 'plural', '"illness" เป็นคำนามนามธรรม (uncountable) ใช้รูปเดียว'),
            t2(' before it '),
            typ2('t2-twe-7-b2f', 'develop', ['develops'], 'verb-tense', 'ประธาน "it" เอกพจน์ กริยาปัจจุบันจึงเติม -s เป็น develops'),
            t2(' reduces long-term healthcare '),
            typ2('t2-twe-7-b2g', 'cost', ['costs'], 'plural', '"healthcare costs" พูดถึงค่าใช้จ่ายหลายรายการ จึงเป็นพหูพจน์'),
            t2(', which '),
            sel2('t2-twe-7-b2g2', ['ultimately', 'ultimate', 'ultimating'], 'ultimately', 'transition', '"ultimately" เป็นกริยาวิเศษณ์ขยาย benefits แปลว่าในที่สุด'),
            t2(' '),
            typ2('t2-twe-7-b2g3', 'benefit', ['benefits'], 'verb-tense', 'ประธาน "which" (แทน the fact ทั้งประโยค) เอกพจน์ กริยาปัจจุบันจึงเติม -s เป็น benefits'),
            t2(' '),
            sel2('t2-twe-7-b2h', ['the', 'a', WGB2_NO_ARTICLE], 'the', 'article', '"the entire population" เจาะจงประชากรทั้งหมดของบริบทที่กล่าวถึง จึงใช้ the'),
            t2(' entire '),
            typ2('t2-twe-7-b2h3', 'population', ['population'], 'plural', '"population" เป็นคำนามนามธรรมกลุ่ม (collective) ใช้รูปเอกพจน์'),
            t2('. '),
            sel2('t2-twe-7-b2i', ['For instance', 'However', 'In conclusion'], 'For instance', 'transition', '"For instance" ยกตัวอย่างงานวิจัยมาสนับสนุน'),
            t2(', '),
            sel2('t2-twe-7-b2i5', ['a', 'the', WGB2_NO_ARTICLE], 'a', 'article', '"a 2020 World Health Organization study" กล่าวถึงงานวิจัยชิ้นหนึ่งแบบไม่เจาะจง จึงใช้ a'),
            t2(' 2020 World Health Organization '),
            sel2('t2-twe-7-b2i2', ['study', 'studies', 'studying'], 'study', 'plural', '"study" พูดถึงงานวิจัยชิ้นเดียว จึงเป็นเอกพจน์'),
            t2(' '),
            sel2('t2-twe-7-b2i3', ['found', 'find', 'finding'], 'found', 'verb-tense', 'อดีตกาลของ find เพราะพูดถึงผลการศึกษาที่เกิดขึ้นในอดีต (2020)'),
            t2(' that every '),
            sel2('t2-twe-7-b2i4', ['dollar', 'dollars', 'dollared'], 'dollar', 'plural', '"every dollar" ตามด้วยคำนามเอกพจน์เสมอ (every + เอกพจน์)'),
            t2(' '),
            typ2('t2-twe-7-b2j', 'spend', ['spent'], 'verb-tense', 'passive voice "dollar spent" ใช้ V3 ทำหน้าที่คุณศัพท์ขยาย dollar'),
            t2(' on obesity-prevention '),
            sel2('t2-twe-7-b2j2', ['programs', 'program', 'programing'], 'programs', 'plural', '"obesity-prevention programs" พูดถึงโปรแกรมหลายโครงการ จึงเป็นพหูพจน์'),
            t2(' '),
            typ2('t2-twe-7-b2k', 'save', ['saved'], 'verb-tense', 'อดีตกาลของ save สอดคล้องกับ found ในประโยคเดียวกัน'),
            t2(' several '),
            typ2('t2-twe-7-b2l2', 'dollar', ['dollars'], 'plural', '"several dollars" ตามด้วยคำนามพหูพจน์เสมอ'),
            t2(' in future treatment '),
            typ2('t2-twe-7-b2l', 'cost', ['costs'], 'plural', '"future treatment costs" พูดถึงค่าใช้จ่ายหลายรายการ จึงเป็นพหูพจน์'),
            t2('. '),
            sel2('t2-twe-7-b2m', ['In this respect', 'For example', 'However'], 'In this respect', 'transition', '"In this respect" สรุปมุมมองในย่อหน้านี้ก่อนขึ้นประโยคปิดท้าย'),
            t2(', it is '),
            sel2('t2-twe-7-b2m2', ['evident', 'evidence', 'evidently'], 'evident', 'participle', '"evident" เป็นคำคุณศัพท์ที่ถูกต้องหลัง it is'),
            t2(' that prevention '),
            sel2('t2-twe-7-b2m3', ['spending', 'spend', 'spent'], 'spending', 'participle', '"prevention spending" ใช้ v-ing ทำหน้าที่คำนามนามธรรม'),
            t2(' '),
            typ2('t2-twe-7-b2n', 'produce', ['produces'], 'verb-tense', 'ประธาน "prevention spending" เอกพจน์ กริยาปัจจุบันจึงเติม -s เป็น produces'),
            t2(' greater long-term '),
            typ2('t2-twe-7-b2o', 'benefit', ['benefits'], 'plural', '"long-term benefits" พูดถึงผลประโยชน์หลายด้าน จึงเป็นพหูพจน์'),
            t2(' for public health '),
            typ2('t2-twe-7-b2o2', 'system', ['systems'], 'plural', '"public health systems" พูดถึงระบบสุขภาพหลายระบบ จึงเป็นพหูพจน์'),
            t2('.'),
          ]
        },
        {
          id: 'gb2-pvt-conclusion',
          role: 'conclusion',
          labelTh: WGB2_ROLE_LABEL_TH.conclusion,
          segments: [
            sel2('t2-twe-7-cs', ['In conclusion', 'However', 'For example'], 'In conclusion', 'transition', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
            t2(', although it is '),
            sel2('t2-twe-7-c0b', ['undeniable', 'deniable', 'undeniably'], 'undeniable', 'participle', '"undeniable" เป็นคำคุณศัพท์ที่ถูกต้องหลัง it is'),
            t2(' that '),
            typ2('t2-twe-7-c0', 'treat', ['treating'], 'verb-tense', '"treating" เป็น gerund ทำหน้าที่ประธานอนุประโยค'),
            t2(' sick '),
            typ2('t2-twe-7-c1', 'patient', ['patients'], 'plural', '"sick patients" พูดถึงผู้ป่วยหลายคนโดยทั่วไป จึงเป็นพหูพจน์'),
            t2(' remains '),
            sel2('t2-twe-7-c1b', ['an', 'a', WGB2_NO_ARTICLE], 'an', 'article', '"an urgent necessity" ขึ้นต้นด้วยเสียงสระ u ที่ออกเสียงพยัญชนะ (คล้าย y) แต่ตามหลักไวยากรณ์มาตรฐานคำนี้ใช้ an เพราะ urgent ขึ้นต้นด้วยสระ'),
            t2(' urgent '),
            sel2('t2-twe-7-c2', ['necessity', 'necessary', 'necessitate'], 'necessity', 'plural', '"necessity" เป็นคำนามหลัง an urgent จึงต้องใช้รูปคำนาม ไม่ใช่คำคุณศัพท์ necessary'),
            t2(', I am of the '),
            sel2('t2-twe-7-c2b', ['opinion', 'opinions', 'opining'], 'opinion', 'plural', '"opinion" เป็นคำนามนามธรรมในสำนวน "of the opinion that" ใช้เอกพจน์เสมอ'),
            t2(' that '),
            typ2('t2-twe-7-c3', 'promote', ['promoting'], 'verb-tense', '"promoting" เป็น gerund ทำหน้าที่ประธานอนุประโยค'),
            t2(' healthy '),
            typ2('t2-twe-7-c4', 'lifestyle', ['lifestyles'], 'plural', '"healthy lifestyles" พูดถึงวิถีชีวิตหลายรูปแบบ จึงเป็นพหูพจน์'),
            t2(' should '),
            sel2('t2-twe-7-c4b', ['receive', 'receiving', 'received'], 'receive', 'verb-tense', 'หลัง modal "should" ตามด้วย base form เสมอ จึงใช้ receive'),
            t2(' greater public '),
            sel2('t2-twe-7-c5', ['funding', 'fund', 'founding'], 'funding', 'plural', '"public funding" เป็นคำนามนามธรรม (uncountable) ใช้รูปเดียว'),
            t2(', as prevention '),
            typ2('t2-twe-7-c6', 'reduce', ['reduces'], 'verb-tense', 'ประธาน "prevention" เอกพจน์ กริยาปัจจุบันจึงเติม -s เป็น reduces'),
            t2(' '),
            sel2('t2-twe-7-c6b', ['future', 'futures', 'futuristic'], 'future', 'participle', '"future healthcare burdens" ใช้ future เป็นคำคุณศัพท์ขยาย healthcare burdens ส่วน futures เป็นพหูพจน์ของคำนาม และ futuristic แปลว่าล้ำยุค'),
            t2(' healthcare '),
            typ2('t2-twe-7-c7', 'burden', ['burdens'], 'plural', '"healthcare burdens" พูดถึงภาระหลายด้าน จึงเป็นพหูพจน์'),
            t2(' '),
            sel2('t2-twe-7-c8', ['significantly', 'significant', 'signify'], 'significantly', 'transition', '"significantly" เป็นกริยาวิเศษณ์ขยาย reduces แปลว่าอย่างมีนัยสำคัญ'),
            t2('.'),
          ]
        },
      ]
    },
  {
      id: 'gb2-driving-age',
      promptId: 't2-twe-8',
      steps: [
        {
          id: 'gb2-da-intro',
          role: 'intro',
          labelTh: WGB2_ROLE_LABEL_TH.intro,
          segments: [
            t2('It '),
            typ2('t2-twe-8-i0z', 'have', ['has'], 'verb-tense', 'ประธาน "It" เอกพจน์ ใช้ present perfect passive "has been + V3" จึงต้องใช้ has'),
            t2(' been widely '),
            typ2('t2-twe-8-i0', 'argue', ['argued'], 'verb-tense', 'passive voice "has been + V3" จึงใช้ argued (V3)'),
            t2(' that while young '),
            sel2('t2-twe-8-i1', ['drivers', 'driver', 'drove'], 'drivers', 'plural', '"young drivers" พูดถึงผู้ขับขี่วัยรุ่นหลายคนโดยทั่วไป จึงเป็นพหูพจน์'),
            t2(' '),
            sel2('t2-twe-8-i1b', ['gain', 'gains', 'gained'], 'gain', 'verb-tense', 'ประธาน "young drivers" พหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
            t2(' independence '),
            sel2('t2-twe-8-i1c', ['early', 'earlier', 'earliest'], 'early', 'participle', '"early" ใช้เป็นกริยาวิเศษณ์ขยาย gain independence ในรูปเดิมไม่เติม -er/-est เพราะไม่ใช่การเปรียบเทียบ'),
            t2(', '),
            typ2('t2-twe-8-i2', 'raise', ['raising'], 'verb-tense', '"raising" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
            t2(' the minimum age for '),
            typ2('t2-twe-8-i3', 'drive', ['driving'], 'verb-tense', '"driving" เป็น gerund หลัง preposition for'),
            t2(' cars and '),
            sel2('t2-twe-8-i3b', ['motorcycles', 'motorcycle', 'motorcycled'], 'motorcycles', 'plural', '"cars and motorcycles" พูดถึงยานพาหนะหลายประเภท จึงเป็นพหูพจน์'),
            t2(' is '),
            sel2('t2-twe-8-i4', ['the', 'a', WGB2_NO_ARTICLE], 'the', 'article', '"the best way" เจาะจงวิธีที่ดีที่สุดวิธีเดียว จึงใช้ the'),
            t2(' best way to '),
            sel2('t2-twe-8-i4b', ['improve', 'improves', 'improved'], 'improve', 'verb-tense', 'หลัง "way to" ตามด้วย base form เสมอ จึงใช้ improve'),
            t2(' road '),
            sel2('t2-twe-8-i4c', ['safety', 'safeties', 'safe'], 'safety', 'plural', '"road safety" เป็นคำนามนามธรรม (uncountable) ใช้รูปเดียว'),
            t2('. '),
            sel2('t2-twe-8-i4d', ['Others', 'Other', 'The other'], 'Others', 'plural', '"Others" ใช้แทนกลุ่มคนอีกฝ่ายหนึ่ง เป็นพหูพจน์เสมอในความหมายนี้'),
            t2(' '),
            typ2('t2-twe-8-i5', 'argue', ['argue'], 'verb-tense', 'ประธาน "Others" พหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
            t2(' that '),
            sel2('t2-twe-8-i5b', ['stricter', 'strict', 'strictly'], 'stricter', 'participle', '"stricter" เป็นคำคุณศัพท์เปรียบเทียบขยาย testing'),
            t2(' '),
            sel2('t2-twe-8-i5c', ['testing', 'test', 'tested'], 'testing', 'participle', '"stricter testing" ใช้ v-ing ทำหน้าที่คำนามนามธรรม (gerund)'),
            t2(' and driver '),
            typ2('t2-twe-8-i6', 'education', ['education'], 'plural', '"driver education" เป็นคำนามนามธรรม (uncountable) ใช้รูปเดียว'),
            t2(' would be more '),
            sel2('t2-twe-8-i6b', ['effective', 'effectively', 'effectiveness'], 'effective', 'participle', '"more effective" เป็นคำคุณศัพท์เปรียบเทียบหลัง would be'),
            t2(' than simply '),
            typ2('t2-twe-8-i7', 'raise', ['raising'], 'verb-tense', '"raising" เป็น gerund หลัง simply (adverb + v-ing)'),
            t2(' the age '),
            typ2('t2-twe-8-i8', 'limit', ['limit'], 'plural', '"the age limit" พูดถึงขีดจำกัดอายุค่าเดียว จึงเป็นเอกพจน์'),
            t2('. I '),
            sel2('t2-twe-8-i8b', ['personally', 'personal', 'person'], 'personally', 'transition', '"personally" ขยาย believe แสดงความเห็นส่วนตัว'),
            t2(' believe that '),
            typ2('t2-twe-8-i9', 'raise', ['raising'], 'verb-tense', '"raising" เป็น gerund phrase ทำหน้าที่ประธานอนุประโยค'),
            t2(' the minimum '),
            typ2('t2-twe-8-i10', 'drive', ['driving'], 'verb-tense', '"driving age" ใช้ v-ing ทำหน้าที่คำคุณศัพท์ขยาย age'),
            t2(' age is '),
            sel2('t2-twe-8-i10b', ['the', 'a', WGB2_NO_ARTICLE], 'the', 'article', '"the most effective solution" เจาะจงคำตอบที่ดีที่สุด จึงใช้ the'),
            t2(' most '),
            sel2('t2-twe-8-i10c', ['effective', 'effectively', 'effectiveness'], 'effective', 'participle', '"most effective" เป็นคำคุณศัพท์เปรียบเทียบขั้นสูงสุด'),
            t2(' solution, and '),
            sel2('t2-twe-8-i10d', ['my', 'me', 'mine'], 'my', 'article', '"my reasons" ใช้ possessive my แสดงความเป็นเจ้าของ'),
            t2(' '),
            typ2('t2-twe-8-i11', 'reason', ['reasons'], 'plural', '"reasons" พูดถึงเหตุผลหลายข้อที่จะตามมา จึงเป็นพหูพจน์'),
            t2(' will be '),
            typ2('t2-twe-8-i12', 'elaborate', ['elaborated'], 'verb-tense', 'passive voice "will be + V3" จึงใช้ elaborated'),
            t2(' on in '),
            sel2('t2-twe-8-i12b', ['the', 'a', WGB2_NO_ARTICLE], 'the', 'article', '"the following paragraphs" เจาะจงย่อหน้าที่จะตามมา จึงใช้ the'),
            t2(' following '),
            sel2('t2-twe-8-i13', ['paragraphs', 'paragraph', 'paragraphing'], 'paragraphs', 'plural', '"paragraphs" พูดถึงย่อหน้าหลายย่อหน้าที่จะตามมา จึงเป็นพหูพจน์'),
            t2('.'),
          ]
        },
        {
          id: 'gb2-da-body1',
          role: 'body1',
          labelTh: WGB2_ROLE_LABEL_TH.body1,
          segments: [
            sel2('t2-twe-8-b1s', ['To begin with', 'However', 'In conclusion'], 'To begin with', 'transition', '"To begin with" ใช้เปิดย่อหน้าแรกเพื่อเริ่มเหตุผลข้อแรก'),
            t2(', it '),
            sel2('t2-twe-8-b1a0', ['might', 'may have', 'must'], 'might', 'verb-tense', '"might" แสดงความเป็นไปได้แบบสุภาพ เหมาะกับมุมมองฝ่ายตรงข้าม'),
            t2(' seem '),
            sel2('t2-twe-8-b1a1', ['sensible', 'sensitive', 'sensory'], 'sensible', 'participle', '"sensible" แปลว่าใช้เหตุผลได้ ต่างจาก sensitive/sensory'),
            t2(' for '),
            sel2('t2-twe-8-b1a3', ['some', 'anyone', 'someone else'], 'some', 'transition', '"some" หมายถึงคนบางกลุ่มที่เห็นต่าง'),
            t2(' to '),
            sel2('t2-twe-8-b1a4', ['claim', 'claims', 'claimed'], 'claim', 'verb-tense', 'หลัง "to" ต้องตามด้วย base form เสมอ จึงใช้ claim'),
            t2(' that better '),
            typ2('t2-twe-8-b1b', 'train', ['training'], 'verb-tense', '"training" เป็น v-ing ทำหน้าที่คำคุณศัพท์ขยาย programs'),
            t2(' '),
            sel2('t2-twe-8-b1c', ['programs', 'program', 'programing'], 'programs', 'plural', '"training programs" พูดถึงโครงการหลายโครงการ จึงเป็นพหูพจน์'),
            t2(' would '),
            sel2('t2-twe-8-b1c2', ['improve', 'improves', 'improved'], 'improve', 'verb-tense', 'หลัง modal "would" ตามด้วย base form เสมอ จึงใช้ improve'),
            t2(' road '),
            sel2('t2-twe-8-b1c4', ['safety', 'safeties', 'safe'], 'safety', 'plural', '"road safety" เป็นคำนามนามธรรม (uncountable) ใช้รูปเดียว'),
            t2(' more '),
            sel2('t2-twe-8-b1c3', ['effectively', 'effective', 'effectiveness'], 'effectively', 'participle', '"more effectively" เป็นกริยาวิเศษณ์ขยาย improve ไม่ใช่คำคุณศัพท์'),
            t2(' than age '),
            sel2('t2-twe-8-b1d', ['restrictions', 'restriction', 'restricting'], 'restrictions', 'plural', '"age restrictions" พูดถึงข้อจำกัดหลายข้อ จึงเป็นพหูพจน์'),
            t2('. '),
            sel2('t2-twe-8-b1e', ['To explain it simply', 'For example', 'In conclusion'], 'To explain it simply', 'transition', '"To explain it simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
            t2(', this '),
            typ2('t2-twe-8-b1e2', 'be', ['is'], 'verb-tense', 'ประธาน "this" เอกพจน์ กริยาปัจจุบันจึงใช้ is'),
            t2(' possibly because skill and '),
            typ2('t2-twe-8-b1f', 'experience', ['experience'], 'plural', '"experience" เป็นคำนามนามธรรม (uncountable) ใช้รูปเดียว'),
            t2(' '),
            typ2('t2-twe-8-b1g', 'matter', ['matter'], 'verb-tense', 'ประธาน "skill and experience" พหูพจน์ (สองสิ่งรวมกัน) กริยาปัจจุบันจึงไม่เติม -s'),
            t2(' more than age when '),
            typ2('t2-twe-8-b1h', 'operate', ['operating'], 'verb-tense', '"operating" เป็น gerund หลัง when (when + v-ing)'),
            t2(' a vehicle '),
            sel2('t2-twe-8-b1h2', ['safely', 'safety', 'safe'], 'safely', 'transition', '"safely" เป็นกริยาวิเศษณ์ขยาย operating ไม่ใช่คำนาม safety'),
            sel2('t2-twe-8-b1i', ['; ', '. ', ', '], '; ', 'punct', 'เชื่อม 2 ประโยคสมบูรณ์เข้าด้วยกันก่อนคำเชื่อม therefore จึงใช้ semicolon (;)'),
            t2('therefore'),
            sel2('t2-twe-8-b1j', [', ', '. ', ' '], ', ', 'punct', 'หลังคำเชื่อม therefore ต้องมี comma เสมอก่อนขึ้นประโยคหลัก'),
            t2('some believe intensive '),
            typ2('t2-twe-8-b1k', 'drive', ['driving'], 'verb-tense', '"driving courses" ใช้ v-ing ทำหน้าที่คำคุณศัพท์ขยาย courses'),
            t2(' '),
            typ2('t2-twe-8-b1l', 'course', ['courses'], 'plural', '"driving courses" พูดถึงหลักสูตรหลายหลักสูตร จึงเป็นพหูพจน์'),
            t2(' could '),
            sel2('t2-twe-8-b1l2', ['reduce', 'reduces', 'reducing'], 'reduce', 'verb-tense', 'หลัง modal "could" ตามด้วย base form เสมอ จึงใช้ reduce'),
            t2(' '),
            sel2('t2-twe-8-b1m', ['accidents', 'accident', 'accidental'], 'accidents', 'plural', '"accidents" พูดถึงอุบัติเหตุหลายครั้ง จึงเป็นพหูพจน์'),
            t2(' without '),
            typ2('t2-twe-8-b1n', 'delay', ['delaying'], 'verb-tense', '"delaying" เป็น gerund หลัง preposition without'),
            t2(' independence. '),
            sel2('t2-twe-8-b1o', ['For example', 'However', 'In conclusion'], 'For example', 'transition', '"For example" ยกตัวอย่างมาสนับสนุนประโยคก่อนหน้า'),
            t2(', several '),
            sel2('t2-twe-8-b1p', ['countries', 'country', 'countryside'], 'countries', 'plural', '"several countries" ตามด้วยคำนามพหูพจน์เสมอ'),
            t2(' already '),
            sel2('t2-twe-8-b1p2', ['require', 'requires', 'required'], 'require', 'verb-tense', 'ประธาน "several countries" พหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
            t2(' additional '),
            sel2('t2-twe-8-b1q', ['lessons', 'lesson', 'lessoned'], 'lessons', 'plural', '"additional lessons" พูดถึงบทเรียนหลายบท จึงเป็นพหูพจน์'),
            t2(' for newly '),
            typ2('t2-twe-8-b1r', 'license', ['licensed'], 'verb-tense', 'passive voice "newly licensed" ใช้ V3 ทำหน้าที่คุณศัพท์ขยาย drivers'),
            t2(' '),
            typ2('t2-twe-8-b1s2', 'driver', ['drivers'], 'plural', '"newly licensed drivers" พูดถึงผู้ขับขี่หลายคน จึงเป็นพหูพจน์'),
            t2(' before '),
            sel2('t2-twe-8-b1t', ['allowing', 'allow', 'allowed'], 'allowing', 'verb-tense', '"before allowing" ตามหลัง preposition before จึงใช้ v-ing (gerund)'),
            t2(' them to drive '),
            sel2('t2-twe-8-b1t2', ['unsupervised', 'supervised', 'supervising'], 'unsupervised', 'transition', '"unsupervised" ตรงความหมายว่าไม่มีผู้ควบคุมดูแล ต่างจาก supervised'),
            t2('. '),
            sel2('t2-twe-8-b1u', ['From this perspective', 'However', 'In conclusion'], 'From this perspective', 'transition', '"From this perspective" สรุปมุมมองในย่อหน้านี้ก่อนขึ้นประโยคปิดท้าย'),
            t2(', it '),
            typ2('t2-twe-8-b1u2', 'be', ['is'], 'verb-tense', 'ประธาน "it" เอกพจน์ กริยาปัจจุบันจึงใช้ is'),
            t2(' '),
            sel2('t2-twe-8-b1u3', ['understandable', 'understanding', 'understood'], 'understandable', 'participle', '"understandable" เป็นคำคุณศัพท์ที่ถูกต้องหลัง it is'),
            t2(' why '),
            sel2('t2-twe-8-b1u4', ['some', 'anyone', 'someone else'], 'some', 'transition', '"some" หมายถึงคนบางกลุ่ม ตรงบริบทมากกว่า anyone/someone else'),
            t2(' would believe that '),
            sel2('t2-twe-8-b1v', ['improved', 'improving', 'improve'], 'improved', 'participle', '"improved training" ใช้ V3 ทำหน้าที่คุณศัพท์ขยาย training แปลว่าการฝึกที่ได้รับการปรับปรุงแล้ว'),
            t2(' '),
            typ2('t2-twe-8-b1w', 'train', ['training'], 'plural', '"improved training" เป็นคำนามนามธรรม (uncountable) ใช้รูปเดียว'),
            t2(' addresses the root '),
            sel2('t2-twe-8-b1x', ['cause', 'causes', 'causing'], 'cause', 'transition', '"root cause" เป็นสำนวนคงที่ ใช้คำนามเอกพจน์ cause เสมอ'),
            t2(' of dangerous '),
            typ2('t2-twe-8-b1y', 'drive', ['driving'], 'verb-tense', '"dangerous driving" ใช้ v-ing ทำหน้าที่คำนามนามธรรม (gerund)'),
            t2('.'),
          ]
        },
        {
          id: 'gb2-da-body2',
          role: 'body2',
          labelTh: WGB2_ROLE_LABEL_TH.body2,
          segments: [
            sel2('t2-twe-8-b2s', ['However', 'For example', 'In conclusion'], 'However', 'transition', 'ย่อหน้านี้ขัดแย้งกับย่อหน้าก่อนหน้า (concession → rebuttal) จึงใช้ However'),
            t2(', I would '),
            sel2('t2-twe-8-b2a2', ['personally', 'personal', 'person'], 'personally', 'transition', '"personally" ขยาย argue แสดงความเห็นส่วนตัวของผู้เขียน'),
            t2(' '),
            sel2('t2-twe-8-b2a', ['argue', 'argues', 'arguing'], 'argue', 'verb-tense', 'หลัง modal "would" ตามด้วย base form เสมอ จึงใช้ argue'),
            t2(' in '),
            sel2('t2-twe-8-b2a4', ['favor', 'favors', 'favored'], 'favor', 'plural', '"in favor of" เป็นสำนวนคงที่ ใช้คำนามเอกพจน์ favor เสมอ'),
            t2(' of the '),
            sel2('t2-twe-8-b2a3', ['idea', 'ideas', 'ideal'], 'idea', 'plural', '"the idea that" เป็นคำนามเอกพจน์นำหน้า that-clause'),
            t2(' that '),
            typ2('t2-twe-8-b2b', 'raise', ['raising'], 'verb-tense', '"raising" เป็น gerund phrase ทำหน้าที่ประธานอนุประโยค'),
            t2(' the minimum '),
            typ2('t2-twe-8-b2c', 'drive', ['driving'], 'verb-tense', '"driving age" ใช้ v-ing ทำหน้าที่คำคุณศัพท์ขยาย age'),
            t2(' age is '),
            sel2('t2-twe-8-b2c2', ['the', 'a', WGB2_NO_ARTICLE], 'the', 'article', '"the most effective measure" เจาะจงมาตรการที่ดีที่สุด จึงใช้ the'),
            t2(' most '),
            sel2('t2-twe-8-b2c3', ['effective', 'effectively', 'effectiveness'], 'effective', 'participle', '"most effective" เป็นคำคุณศัพท์เปรียบเทียบขั้นสูงสุด'),
            t2(' '),
            typ2('t2-twe-8-b2c4', 'measure', ['measure'], 'plural', '"measure" พูดถึงมาตรการหนึ่งเดียว จึงเป็นเอกพจน์'),
            t2('. '),
            sel2('t2-twe-8-b2d', ['To put it simply', 'For instance', 'In conclusion'], 'To put it simply', 'transition', '"To put it simply" ใช้ก่อนอธิบายเหตุผลให้เข้าใจง่าย'),
            t2(', this is due to the fact that younger '),
            typ2('t2-twe-8-b2e', 'driver', ['drivers\''], 'article', '"drivers\'" ใช้ possessive apostrophe-s แสดงความเป็นเจ้าของหลังคำนามพหูพจน์'),
            t2(' brains '),
            sel2('t2-twe-8-b2e2', ['are', 'is', 'be'], 'are', 'verb-tense', 'ประธาน "brains" พหูพจน์ กริยาจึงใช้ are ไม่ใช่ is'),
            t2(' still '),
            typ2('t2-twe-8-b2f', 'develop', ['developing'], 'verb-tense', 'โครงสร้าง "are still developing" เป็น present continuous จึงใช้ v-ing'),
            t2(' the '),
            typ2('t2-twe-8-b2g', 'judgment', ['judgment'], 'plural', '"judgment" เป็นคำนามนามธรรม (uncountable) ใช้รูปเดียว'),
            t2(' needed for quick '),
            typ2('t2-twe-8-b2h', 'decision', ['decision'], 'plural', '"quick decision-making" เป็นคำนามนามธรรมผสม ใช้รูปเดียว'),
            t2('-making, which extra '),
            typ2('t2-twe-8-b2i', 'train', ['training'], 'plural', '"extra training" เป็นคำนามนามธรรม (uncountable) ใช้รูปเดียว'),
            t2(' cannot '),
            sel2('t2-twe-8-b2i2', ['fully', 'full', 'fuller'], 'fully', 'transition', '"fully" เป็นกริยาวิเศษณ์ขยาย replace แปลว่าอย่างสมบูรณ์'),
            t2(' '),
            sel2('t2-twe-8-b2j', ['replace', 'replaces', 'replaced'], 'replace', 'verb-tense', 'หลัง modal "cannot" ตามด้วย base form เสมอ จึงใช้ replace'),
            t2('. '),
            sel2('t2-twe-8-b2k', ['For instance', 'However', 'In conclusion'], 'For instance', 'transition', '"For instance" ยกตัวอย่างงานวิจัยมาสนับสนุน'),
            t2(', '),
            sel2('t2-twe-8-b2k2', ['a', 'the', WGB2_NO_ARTICLE], 'a', 'article', '"a 2021 study" กล่าวถึงงานวิจัยชิ้นหนึ่งแบบไม่เจาะจง จึงใช้ a'),
            t2(' 2021 '),
            sel2('t2-twe-8-b2k3', ['study', 'studies', 'studying'], 'study', 'plural', '"study" พูดถึงงานวิจัยชิ้นเดียว จึงเป็นเอกพจน์'),
            t2(' by the World Health Organization '),
            typ2('t2-twe-8-b2l', 'find', ['found'], 'verb-tense', 'อดีตกาลของ find เพราะพูดถึงผลการศึกษาที่เกิดขึ้นในอดีต (2021)'),
            t2(' that '),
            typ2('t2-twe-8-b2m', 'driver', ['drivers'], 'plural', '"drivers aged sixteen to nineteen" พูดถึงผู้ขับขี่หลายคน จึงเป็นพหูพจน์'),
            t2(' aged sixteen to nineteen '),
            typ2('t2-twe-8-b2n', 'be', ['are'], 'verb-tense', 'ประธาน "drivers" พหูพจน์ กริยาจึงใช้ are ไม่ใช่ is'),
            t2(' nearly three times more '),
            sel2('t2-twe-8-b2n2', ['likely', 'like', 'liking'], 'likely', 'participle', '"more likely" เป็นคำคุณศัพท์เปรียบเทียบหลัง three times'),
            t2(' to '),
            typ2('t2-twe-8-b2o', 'crash', ['crash'], 'verb-tense', 'หลัง "to" ต้องตามด้วย base form เสมอ จึงใช้ crash'),
            t2(' than '),
            typ2('t2-twe-8-b2p', 'driver', ['drivers'], 'plural', '"drivers over twenty-five" พูดถึงผู้ขับขี่หลายคน จึงเป็นพหูพจน์'),
            t2(' over twenty-five. '),
            sel2('t2-twe-8-b2q', ['In this respect', 'For example', 'However'], 'In this respect', 'transition', '"In this respect" สรุปมุมมองในย่อหน้านี้ก่อนขึ้นประโยคปิดท้าย'),
            t2(', it '),
            typ2('t2-twe-8-b2q2', 'be', ['is'], 'verb-tense', 'ประธาน "it" เอกพจน์ กริยาปัจจุบันจึงใช้ is'),
            t2(' '),
            sel2('t2-twe-8-b2q3', ['evident', 'evidence', 'evidently'], 'evident', 'participle', '"evident" เป็นคำคุณศัพท์ที่ถูกต้องหลัง it is'),
            t2(' that '),
            typ2('t2-twe-8-b2r', 'raise', ['raising'], 'verb-tense', '"raising" เป็น gerund phrase ทำหน้าที่ประธานอนุประโยค'),
            t2(' the minimum age '),
            sel2('t2-twe-8-b2r2', ['directly', 'direct', 'directed'], 'directly', 'transition', '"directly" เป็นกริยาวิเศษณ์ขยาย targets แปลว่าโดยตรง'),
            t2(' '),
            typ2('t2-twe-8-b2s2', 'target', ['targets'], 'verb-tense', 'ประธาน "raising the minimum age" (gerund phrase) เอกพจน์ กริยาจึงเติม -s เป็น targets'),
            t2(' the '),
            typ2('t2-twe-8-b2t', 'driver', ['drivers'], 'plural', '"the drivers most at risk" พูดถึงผู้ขับขี่หลายคน จึงเป็นพหูพจน์'),
            t2(' most at risk of '),
            typ2('t2-twe-8-b2u', 'cause', ['causing'], 'verb-tense', '"causing" เป็น gerund หลัง preposition of'),
            t2(' '),
            sel2('t2-twe-8-b2v', ['accidents', 'accident', 'accidental'], 'accidents', 'plural', '"accidents" พูดถึงอุบัติเหตุหลายครั้ง จึงเป็นพหูพจน์'),
            t2('.'),
          ]
        },
        {
          id: 'gb2-da-conclusion',
          role: 'conclusion',
          labelTh: WGB2_ROLE_LABEL_TH.conclusion,
          segments: [
            sel2('t2-twe-8-cs', ['In conclusion', 'However', 'For example'], 'In conclusion', 'transition', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
            t2(', although it '),
            typ2('t2-twe-8-c0z', 'be', ['is'], 'verb-tense', 'ประธาน "it" เอกพจน์ กริยาปัจจุบันจึงใช้ is'),
            t2(' '),
            sel2('t2-twe-8-c0b', ['undeniable', 'deniable', 'undeniably'], 'undeniable', 'participle', '"undeniable" เป็นคำคุณศัพท์ที่ถูกต้องหลัง it is'),
            t2(' that better '),
            typ2('t2-twe-8-c0', 'train', ['training'], 'plural', '"better training" เป็นคำนามนามธรรม (uncountable) ใช้รูปเดียว'),
            t2(' could '),
            typ2('t2-twe-8-c1', 'reduce', ['reduce'], 'verb-tense', 'หลัง modal "could" ตามด้วย base form เสมอ จึงใช้ reduce'),
            t2(' some '),
            sel2('t2-twe-8-c2', ['accidents', 'accident', 'accidental'], 'accidents', 'plural', '"some accidents" พูดถึงอุบัติเหตุหลายครั้ง จึงเป็นพหูพจน์'),
            t2(', I am of the '),
            sel2('t2-twe-8-c2b', ['opinion', 'opinions', 'opining'], 'opinion', 'plural', '"opinion" เป็นคำนามนามธรรมในสำนวน "of the opinion that" ใช้เอกพจน์เสมอ'),
            t2(' that '),
            typ2('t2-twe-8-c3', 'raise', ['raising'], 'verb-tense', '"raising" เป็น gerund phrase ทำหน้าที่ประธานอนุประโยค'),
            t2(' the minimum '),
            typ2('t2-twe-8-c4', 'drive', ['driving'], 'verb-tense', '"driving age" ใช้ v-ing ทำหน้าที่คำคุณศัพท์ขยาย age'),
            t2(' age '),
            typ2('t2-twe-8-c5', 'remain', ['remains'], 'verb-tense', 'ประธาน "the minimum driving age" เอกพจน์ กริยาจึงเติม -s เป็น remains'),
            t2(' the '),
            sel2('t2-twe-8-c5d', ['most', 'more', 'much'], 'most', 'transition', '"the most effective" เป็นโครงสร้าง superlative จึงใช้ most ไม่ใช่ more/much'),
            t2(' '),
            sel2('t2-twe-8-c5b', ['effective', 'effectively', 'effectiveness'], 'effective', 'participle', '"most effective" เป็นคำคุณศัพท์เปรียบเทียบขั้นสูงสุด'),
            t2(' way to '),
            sel2('t2-twe-8-c5c', ['improve', 'improves', 'improved'], 'improve', 'verb-tense', 'หลัง "way to" ตามด้วย base form เสมอ จึงใช้ improve'),
            t2(' road '),
            typ2('t2-twe-8-c6', 'safety', ['safety'], 'plural', '"road safety" เป็นคำนามนามธรรม (uncountable) ใช้รูปเดียว'),
            t2('.'),
          ]
        },
      ]
    },
  {
    id: 'gb2-community-work',
    promptId: 't2-twe-9',
    steps: [
      {
        id: 'gb2-cw-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('It has been widely '),
          typ2('t2-twe-9-i0', 'argue', ['argued'], 'verb-tense', 'passive voice "has been + V3" จึงใช้ argued'),
          t2(' that while schoolwork already '),
          typ2('t2-twe-9-i1', 'demand', ['demands'], 'verb-tense', 'ประธาน "schoolwork" เป็นเอกพจน์ จึงใช้ demands'),
          t2(' considerable time, teenagers should be required to do unpaid work in their local community, since this benefits both young people and society as a whole. Others argue that teenagers should focus entirely on their studies instead of '),
          typ2('t2-twe-9-i2', 'take', ['taking'], 'verb-tense', '"instead of taking on..." ตามด้วย gerund หลัง instead of'),
          t2(' on additional unpaid responsibilities. I personally believe that community work '),
          typ2('t2-twe-9-i3', 'bring', ['brings'], 'verb-tense', 'ประธาน "community work" เป็นเอกพจน์ จึงใช้ brings'),
          t2(' valuable benefits to teenagers, and my reasons will be '),
          typ2('t2-twe-9-i4', 'elaborate', ['elaborated'], 'verb-tense', 'passive voice "will be + V3" จึงใช้ elaborated'),
          t2(' on in the following paragraphs.')
        ]
      },
      {
        id: 'gb2-cw-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-twe-9-b1start', ['To begin with', 'To explain it simply', 'For example'], 'To begin with', '"To begin with" ใช้เปิดย่อหน้าแรกเพื่อเริ่มเหตุผลข้อแรก'),
          t2(', it might seem sensible for some to claim that teenagers should not be required to do unpaid community work. '),
          drag2('t2-twe-9-b1mid', ['To explain it simply', 'To begin with', 'From this perspective'], 'To explain it simply', '"To explain it simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is possibly because academic performance already '),
          typ2('t2-twe-9-b1a', 'place', ['places'], 'verb-tense', 'ประธาน "academic performance" เป็นเอกพจน์ จึงใช้ places'),
          t2(' enormous pressure on students'),
          punc2('t2-twe-9-b1b', ['semicolon', 'period', 'comma'], 'semicolon', 'semicolon ก่อน therefore ที่เชื่อมสองประโยคสมบูรณ์ที่เกี่ยวข้องกัน'),
          t2(' therefore'),
          punc2('t2-twe-9-b1b2', ['comma', 'period', 'none'], 'comma', 'comma หลัง therefore ก่อนขึ้นใจความหลักของประโยค'),
          t2(' some believe additional responsibilities could harm their exam results. '),
          drag2('t2-twe-9-b1c', ['For example', 'To begin with', 'In this respect'], 'For example', '"For example" ยกตัวอย่างนักเรียนที่ใช้เวลาทำการบ้าน'),
          t2(', many students already '),
          typ2('t2-twe-9-b1d', 'spend', ['spend'], 'verb-tense', 'ประธาน "many students" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' several hours each evening '),
          typ2('t2-twe-9-b1e', 'complete', ['completing'], 'verb-tense', '"spend...completing homework" ตามด้วย gerund หลัง spend time'),
          t2(' homework and '),
          typ2('t2-twe-9-b1f', 'prepare', ['preparing'], 'verb-tense', 'ขนานกับ completing ด้านหน้า (parallel gerund)'),
          t2(' for important examinations. '),
          drag2('t2-twe-9-b1g', ['From this perspective', 'To explain it simply', 'For instance'], 'From this perspective', '"From this perspective" สรุปมุมมองของฝ่ายที่เห็นต่างก่อนขึ้นย่อหน้าถัดไป'),
          t2(', it is understandable why some would believe that community work would place an unfair burden on busy teenagers.')
        ]
      },
      {
        id: 'gb2-cw-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          drag2('t2-twe-9-b2start', ['However', 'To begin with', 'For example'], 'However', '"However" เปิดย่อหน้าเพื่อโต้แย้งมุมมองในย่อหน้าก่อนหน้า'),
          t2(', I would personally argue in favor of the idea that unpaid community work benefits both teenagers and wider society. '),
          drag2('t2-twe-9-b2mid', ['To put it simply', 'However', 'In this respect'], 'To put it simply', '"To put it simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is due to the fact that '),
          typ2('t2-twe-9-b2a', 'volunteer', ['volunteering'], 'verb-tense', '"volunteering teaches..." เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' teaches practical skills and responsibility, which cannot easily be '),
          typ2('t2-twe-9-b2b', 'learn', ['learned'], 'verb-tense', 'passive voice "cannot be + V3" จึงใช้ learned'),
          t2(' through classroom study alone. '),
          drag2('t2-twe-9-b2c', ['For instance', 'To put it simply', 'In this respect'], 'For instance', '"For instance" ยกตัวอย่างงานวิจัยของ National Youth Agency'),
          t2(', a 2022 survey by the National Youth Agency in the UK '),
          typ2('t2-twe-9-b2d', 'find', ['found'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ found'),
          t2(' that teenagers who '),
          typ2('t2-twe-9-b2e', 'volunteer', ['volunteered'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ volunteered'),
          t2(' regularly '),
          typ2('t2-twe-9-b2f', 'report', ['reported'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ reported'),
          t2(' significantly higher confidence and stronger communication skills. '),
          drag2('t2-twe-9-b2g', ['In this respect', 'For instance', 'However'], 'In this respect', '"In this respect" สรุปมุมมองในย่อหน้านี้ก่อนขึ้นประโยคปิดท้าย'),
          t2(', it is evident that community work '),
          typ2('t2-twe-9-b2h', 'develop', ['develops'], 'verb-tense', 'ประธาน "community work" เป็นเอกพจน์ จึงใช้ develops'),
          t2(' abilities that benefit young people well beyond school.')
        ]
      },
      {
        id: 'gb2-cw-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-twe-9-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that academic study remains a priority for teenagers, I am of the opinion that unpaid community work should be encouraged, as it '),
          typ2('t2-twe-9-c0', 'build', ['builds'], 'verb-tense', 'ประธาน "it" เป็นเอกพจน์ จึงใช้ builds'),
          t2(' valuable life skills alongside classroom learning.')
        ]
      }
    ]
  },
  {
    id: 'gb2-greatest-invention',
    promptId: 't2-twe-10',
    steps: [
      {
        id: 'gb2-gi-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('It has been widely '),
          typ2('t2-twe-10-i0', 'argue', ['argued'], 'verb-tense', 'passive voice "has been + V3" จึงใช้ argued'),
          t2(' that while human history '),
          typ2('t2-twe-10-i1', 'include', ['includes'], 'verb-tense', 'ประธาน "human history" เป็นเอกพจน์ จึงใช้ includes'),
          t2(' many transformative inventions such as the wheel, the internet is the single most important invention ever '),
          typ2('t2-twe-10-i2', 'create', ['created'], 'participle', '"invention ever created" — V3 ทำหน้าที่คุณศัพท์ขยาย invention แปลว่าสิ่งประดิษฐ์ที่เคยถูกสร้างขึ้น'),
          t2('. Others argue that older inventions laid the essential foundation on which modern technology, including the internet, could later be '),
          typ2('t2-twe-10-i3', 'build', ['built'], 'verb-tense', 'passive voice "could be + V3" จึงใช้ built'),
          t2('. I personally believe that the internet is indeed the most important invention, and my reasons will be '),
          typ2('t2-twe-10-i4', 'elaborate', ['elaborated'], 'verb-tense', 'passive voice "will be + V3" จึงใช้ elaborated'),
          t2(' on in the following paragraphs.')
        ]
      },
      {
        id: 'gb2-gi-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-twe-10-b1start', ['To begin with', 'To explain it simply', 'For example'], 'To begin with', '"To begin with" ใช้เปิดย่อหน้าแรกเพื่อเริ่มเหตุผลข้อแรก'),
          t2(', it might seem sensible for some to claim that earlier inventions such as the wheel deserve greater recognition than the internet. '),
          drag2('t2-twe-10-b1mid', ['To explain it simply', 'To begin with', 'From this perspective'], 'To explain it simply', '"To explain it simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is possibly because the wheel '),
          typ2('t2-twe-10-b1a', 'enable', ['enabled'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ enabled'),
          t2(' transportation and trade thousands of years before modern technology '),
          typ2('t2-twe-10-b1b', 'exist', ['existed'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ existed'),
          punc2('t2-twe-10-b1c', ['semicolon', 'period', 'comma'], 'semicolon', 'semicolon ก่อน therefore ที่เชื่อมสองประโยคสมบูรณ์ที่เกี่ยวข้องกัน'),
          t2(' therefore'),
          punc2('t2-twe-10-b1c2', ['comma', 'period', 'none'], 'comma', 'comma หลัง therefore ก่อนขึ้นใจความหลักของประโยค'),
          t2(' some believe it '),
          typ2('t2-twe-10-b1d', 'create', ['created'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ created'),
          t2(' the foundation for all later human progress. '),
          drag2('t2-twe-10-b1e', ['For example', 'To begin with', 'In this respect'], 'For example', '"For example" ยกตัวอย่างอารยธรรมโบราณที่ใช้เกวียน'),
          t2(', ancient civilizations '),
          typ2('t2-twe-10-b1f', 'use', ['used'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ used'),
          t2(' wheeled carts to build cities, '),
          typ2('t2-twe-10-b1g', 'transport', ['transport'], 'verb-tense', 'ขนานกับ to + base verb (to build, transport, expand)'),
          t2(' goods, and '),
          typ2('t2-twe-10-b1h', 'expand', ['expand'], 'verb-tense', 'ขนานกับ to build/transport ด้านหน้า (parallel base verb)'),
          t2(' agriculture across vast distances. '),
          drag2('t2-twe-10-b1i', ['From this perspective', 'To explain it simply', 'For instance'], 'From this perspective', '"From this perspective" สรุปมุมมองของฝ่ายที่เห็นต่างก่อนขึ้นย่อหน้าถัดไป'),
          t2(', it is understandable why some would believe that foundational inventions like the wheel matter more than the internet.')
        ]
      },
      {
        id: 'gb2-gi-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          drag2('t2-twe-10-b2start', ['However', 'To begin with', 'For example'], 'However', '"However" เปิดย่อหน้าเพื่อโต้แย้งมุมมองในย่อหน้าก่อนหน้า'),
          t2(', I would personally argue in favor of the idea that the internet is the most significant invention in human history. '),
          drag2('t2-twe-10-b2mid', ['To put it simply', 'However', 'In this respect'], 'To put it simply', '"To put it simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is due to the fact that it '),
          typ2('t2-twe-10-b2a', 'connect', ['connects'], 'verb-tense', 'ประธาน "it" เป็นเอกพจน์ จึงใช้ connects'),
          t2(' billions of people instantly, which has '),
          typ2('t2-twe-10-b2b', 'transform', ['transformed'], 'verb-tense', 'present perfect "has + V3" จึงใช้ transformed'),
          t2(' communication, education, and business on an unprecedented global scale. '),
          drag2('t2-twe-10-b2c', ['For instance', 'To put it simply', 'In this respect'], 'For instance', '"For instance" ยกตัวอย่างรายงานของ International Telecommunication Union'),
          t2(', the International Telecommunication Union '),
          typ2('t2-twe-10-b2d', 'report', ['reported'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ reported'),
          t2(' in 2023 that over five billion people worldwide now '),
          typ2('t2-twe-10-b2e', 'use', ['use'], 'verb-tense', 'ประธาน "people" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' the internet regularly. '),
          drag2('t2-twe-10-b2f', ['In this respect', 'For instance', 'However'], 'In this respect', '"In this respect" สรุปมุมมองในย่อหน้านี้ก่อนขึ้นประโยคปิดท้าย'),
          t2(', it is evident that no other invention has '),
          typ2('t2-twe-10-b2g', 'reshape', ['reshaped'], 'verb-tense', 'present perfect "has + V3" จึงใช้ reshaped'),
          t2(' daily life as rapidly or as widely as the internet.')
        ]
      },
      {
        id: 'gb2-gi-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-twe-10-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that earlier inventions such as the wheel '),
          typ2('t2-twe-10-c0', 'shape', ['shaped'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ shaped'),
          t2(' human civilization, I am of the opinion that the internet remains the most important invention, given its unmatched global impact.')
        ]
      }
    ]
  },
  {
    id: 'gb2-financial-aid',
    promptId: 't2-twe-11',
    steps: [
      {
        id: 'gb2-fa-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('It has been widely '),
          typ2('t2-twe-11-i0', 'argue', ['argued'], 'verb-tense', 'passive voice "has been + V3" จึงใช้ argued'),
          t2(' that while financial aid '),
          typ2('t2-twe-11-i1', 'provide', ['provides'], 'verb-tense', 'ประธาน "financial aid" เป็นเอกพจน์ จึงใช้ provides'),
          t2(' immediate relief, '),
          typ2('t2-twe-11-i2', 'give', ['giving'], 'verb-tense', '"giving money" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' money to poorer countries does not solve the underlying problem of poverty. Others argue that direct financial assistance remains essential, since developing countries urgently need funds for basic needs. I personally believe that developed countries should provide other forms of assistance instead of money alone, and my reasons will be '),
          typ2('t2-twe-11-i3', 'elaborate', ['elaborated'], 'verb-tense', 'passive voice "will be + V3" จึงใช้ elaborated'),
          t2(' on in the following paragraphs.')
        ]
      },
      {
        id: 'gb2-fa-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-twe-11-b1start', ['To begin with', 'To explain it simply', 'For example'], 'To begin with', '"To begin with" ใช้เปิดย่อหน้าแรกเพื่อเริ่มเหตุผลข้อแรก'),
          t2(', it might seem sensible for some to claim that financial aid remains the most important form of assistance for poorer countries. '),
          drag2('t2-twe-11-b1mid', ['To explain it simply', 'To begin with', 'From this perspective'], 'To explain it simply', '"To explain it simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is possibly because money can be '),
          typ2('t2-twe-11-b1a', 'use', ['used'], 'verb-tense', 'passive voice "can be + V3" จึงใช้ used'),
          t2(' immediately to buy food, medicine, and other urgent necessities'),
          punc2('t2-twe-11-b1b', ['semicolon', 'period', 'comma'], 'semicolon', 'semicolon ก่อน therefore ที่เชื่อมสองประโยคสมบูรณ์ที่เกี่ยวข้องกัน'),
          t2(' therefore'),
          punc2('t2-twe-11-b1b2', ['comma', 'period', 'none'], 'comma', 'comma หลัง therefore ก่อนขึ้นใจความหลักของประโยค'),
          t2(' some believe '),
          typ2('t2-twe-11-b1c', 'cut', ['cutting'], 'verb-tense', '"cutting financial support" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' financial support would worsen suffering in the short term. '),
          drag2('t2-twe-11-b1d', ['For example', 'To begin with', 'In this respect'], 'For example', '"For example" ยกตัวอย่างเงินโอนฉุกเฉิน'),
          t2(', emergency cash transfers have '),
          typ2('t2-twe-11-b1e', 'help', ['helped'], 'verb-tense', 'present perfect "have + V3" จึงใช้ helped'),
          t2(' many communities survive immediately after natural disasters such as floods and earthquakes. '),
          drag2('t2-twe-11-b1f', ['From this perspective', 'To explain it simply', 'For instance'], 'From this perspective', '"From this perspective" สรุปมุมมองของฝ่ายที่เห็นต่างก่อนขึ้นย่อหน้าถัดไป'),
          t2(', it is understandable why some would believe that financial aid remains indispensable for struggling nations.')
        ]
      },
      {
        id: 'gb2-fa-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          drag2('t2-twe-11-b2start', ['However', 'To begin with', 'For example'], 'However', '"However" เปิดย่อหน้าเพื่อโต้แย้งมุมมองในย่อหน้าก่อนหน้า'),
          t2(', I would personally argue in favor of the idea that developed countries should offer alternative forms of assistance rather than money alone. '),
          drag2('t2-twe-11-b2mid', ['To put it simply', 'However', 'In this respect'], 'To put it simply', '"To put it simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is due to the fact that direct cash aid often '),
          typ2('t2-twe-11-b2a', 'fail', ['fails'], 'verb-tense', 'ประธาน "direct cash aid" เป็นเอกพจน์ จึงใช้ fails'),
          t2(' to build lasting infrastructure or institutions, which are necessary for genuine long-term development. '),
          drag2('t2-twe-11-b2b', ['For instance', 'To put it simply', 'In this respect'], 'For instance', '"For instance" ยกตัวอย่างรายงานของ World Bank ปี 2021'),
          t2(', a World Bank report '),
          typ2('t2-twe-11-b2c', 'publish', ['published'], 'participle', '"report published in 2021" — V3 ทำหน้าที่คุณศัพท์ขยาย report แปลว่ารายงานที่ถูกตีพิมพ์'),
          t2(' in 2021 '),
          typ2('t2-twe-11-b2d', 'find', ['found'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ found'),
          t2(' that countries '),
          typ2('t2-twe-11-b2e', 'receive', ['receiving'], 'participle', '"countries receiving technical training" — v-ing ทำหน้าที่คุณศัพท์ขยาย countries'),
          t2(' technical training and infrastructure support '),
          typ2('t2-twe-11-b2f', 'show', ['showed'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ showed'),
          t2(' stronger economic growth than those '),
          typ2('t2-twe-11-b2g', 'receive', ['receiving'], 'participle', 'ขนานกับ receiving ด้านหน้า (parallel v-ing ทำหน้าที่คุณศัพท์)'),
          t2(' cash alone. '),
          drag2('t2-twe-11-b2h', ['In this respect', 'For instance', 'However'], 'In this respect', '"In this respect" สรุปมุมมองในย่อหน้านี้ก่อนขึ้นประโยคปิดท้าย'),
          t2(', it is evident that practical assistance '),
          typ2('t2-twe-11-b2i', 'produce', ['produces'], 'verb-tense', 'ประธาน "practical assistance" เป็นเอกพจน์ จึงใช้ produces'),
          t2(' more sustainable results than financial aid by itself.')
        ]
      },
      {
        id: 'gb2-fa-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-twe-11-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that financial aid '),
          typ2('t2-twe-11-c0', 'offer', ['offers'], 'verb-tense', 'ประธาน "financial aid" เป็นเอกพจน์ จึงใช้ offers'),
          t2(' valuable short-term relief, I am of the opinion that developed nations should prioritize other forms of assistance, as these '),
          typ2('t2-twe-11-c1', 'create', ['create'], 'verb-tense', 'ประธาน "these" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' lasting solutions to poverty.')
        ]
      }
    ]
  },
  {
    id: 'gb2-digital-literacy',
    promptId: 't2-twe-12',
    steps: [
      {
        id: 'gb2-dl-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('It has been widely '),
          typ2('t2-twe-12-i0', 'argue', ['argued'], 'verb-tense', 'passive voice "has been + V3" จึงใช้ argued'),
          t2(' that while digital communication offers great convenience, the '),
          typ2('t2-twe-12-i1', 'increase', ['increasing'], 'participle', '"the increasing use" — v-ing ทำหน้าที่คุณศัพท์ แปลว่าการใช้งานที่กำลังเพิ่มขึ้น'),
          t2(' use of computers and mobile phones is '),
          typ2('t2-twe-12-i2', 'damage', ['damaging'], 'verb-tense', 'present continuous "is + V-ing" จึงใช้ damaging'),
          t2(' young people\'s reading and writing skills. Others argue that digital devices actually strengthen literacy, since young people read and write constantly through messaging and social media. I personally believe that heavy reliance on digital devices is '),
          typ2('t2-twe-12-i3', 'harm', ['harming'], 'verb-tense', 'present continuous "is + V-ing" จึงใช้ harming'),
          t2(' literacy skills, and my reasons will be '),
          typ2('t2-twe-12-i4', 'elaborate', ['elaborated'], 'verb-tense', 'passive voice "will be + V3" จึงใช้ elaborated'),
          t2(' on in the following paragraphs.')
        ]
      },
      {
        id: 'gb2-dl-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-twe-12-b1start', ['To begin with', 'To explain it simply', 'For example'], 'To begin with', '"To begin with" ใช้เปิดย่อหน้าแรกเพื่อเริ่มเหตุผลข้อแรก'),
          t2(', it might seem sensible for some to claim that digital communication improves reading and writing among young people. '),
          drag2('t2-twe-12-b1mid', ['To explain it simply', 'To begin with', 'From this perspective'], 'To explain it simply', '"To explain it simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is possibly because texting and social media '),
          typ2('t2-twe-12-b1a', 'require', ['require'], 'verb-tense', 'ประธาน "texting and social media" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' constant reading and typing throughout the day'),
          punc2('t2-twe-12-b1b', ['semicolon', 'period', 'comma'], 'semicolon', 'semicolon ก่อน therefore ที่เชื่อมสองประโยคสมบูรณ์ที่เกี่ยวข้องกัน'),
          t2(' therefore'),
          punc2('t2-twe-12-b1b2', ['comma', 'period', 'none'], 'comma', 'comma หลัง therefore ก่อนขึ้นใจความหลักของประโยค'),
          t2(' some believe this frequent practice naturally '),
          typ2('t2-twe-12-b1c', 'strengthen', ['strengthens'], 'verb-tense', 'ประธาน "this frequent practice" เป็นเอกพจน์ จึงใช้ strengthens'),
          t2(' literacy skills. '),
          drag2('t2-twe-12-b1d', ['For example', 'To begin with', 'In this respect'], 'For example', '"For example" ยกตัวอย่างวัยรุ่นที่ส่งข้อความ'),
          t2(', many teenagers '),
          typ2('t2-twe-12-b1e', 'exchange', ['exchange'], 'verb-tense', 'ประธาน "many teenagers" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' dozens of text messages daily, '),
          typ2('t2-twe-12-b1f', 'engage', ['engaging'], 'verb-tense', '"engaging with written language" เป็น participle phrase ขยายประโยคหลัก'),
          t2(' with written language far more often than previous generations '),
          typ2('t2-twe-12-b1g', 'do', ['did'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ did'),
          t2('. '),
          drag2('t2-twe-12-b1h', ['From this perspective', 'To explain it simply', 'For instance'], 'From this perspective', '"From this perspective" สรุปมุมมองของฝ่ายที่เห็นต่างก่อนขึ้นย่อหน้าถัดไป'),
          t2(', it is understandable why some would believe that digital communication supports rather than damages literacy development.')
        ]
      },
      {
        id: 'gb2-dl-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          drag2('t2-twe-12-b2start', ['However', 'To begin with', 'For example'], 'However', '"However" เปิดย่อหน้าเพื่อโต้แย้งมุมมองในย่อหน้าก่อนหน้า'),
          t2(', I would personally argue in favor of the idea that heavy use of digital devices is '),
          typ2('t2-twe-12-b2a', 'weaken', ['weakening'], 'verb-tense', 'present continuous "is + V-ing" จึงใช้ weakening'),
          t2(' young people\'s core literacy skills. '),
          drag2('t2-twe-12-b2mid', ['To put it simply', 'However', 'In this respect'], 'To put it simply', '"To put it simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is due to the fact that informal messaging '),
          typ2('t2-twe-12-b2b', 'rely', ['relies'], 'verb-tense', 'ประธาน "informal messaging" เป็นเอกพจน์ จึงใช้ relies'),
          t2(' on abbreviations and simplified grammar, which '),
          typ2('t2-twe-12-b2c', 'fail', ['fails'], 'verb-tense', 'ประธาน "which" อ้างถึง messaging ที่เป็นเอกพจน์ จึงใช้ fails'),
          t2(' to develop proper writing structure and vocabulary. '),
          drag2('t2-twe-12-b2d', ['For instance', 'To put it simply', 'In this respect'], 'For instance', '"For instance" ยกตัวอย่างงานวิจัยของ National Literacy Trust ปี 2021'),
          t2(', a 2021 study by the National Literacy Trust in the UK '),
          typ2('t2-twe-12-b2e', 'find', ['found'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ found'),
          t2(' that teenagers who '),
          typ2('t2-twe-12-b2f', 'spend', ['spent'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ spent'),
          t2(' excessive time messaging '),
          typ2('t2-twe-12-b2g', 'show', ['showed'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ showed'),
          t2(' noticeably weaker formal writing abilities than peers who '),
          typ2('t2-twe-12-b2h', 'read', ['read'], 'verb-tense', 'present simple base form (ประธาน "peers" เป็นพหูพจน์)'),
          t2(' printed books regularly. '),
          drag2('t2-twe-12-b2i', ['In this respect', 'For instance', 'However'], 'In this respect', '"In this respect" สรุปมุมมองในย่อหน้านี้ก่อนขึ้นประโยคปิดท้าย'),
          t2(', it is evident that digital habits often '),
          typ2('t2-twe-12-b2j', 'replace', ['replace'], 'verb-tense', 'ประธาน "digital habits" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' rather than reinforce genuine literacy development.')
        ]
      },
      {
        id: 'gb2-dl-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-twe-12-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that digital devices '),
          typ2('t2-twe-12-c0', 'encourage', ['encourage'], 'verb-tense', 'ประธาน "digital devices" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' frequent reading and writing, I am of the opinion that heavy reliance on them is '),
          typ2('t2-twe-12-c1', 'weaken', ['weakening'], 'verb-tense', 'present continuous "is + V-ing" จึงใช้ weakening'),
          t2(' young people\'s literacy skills overall.')
        ]
      }
    ]
  },
  {
    id: 'gb2-women-leaders',
    promptId: 't2-twe-13',
    steps: [
      {
        id: 'gb2-wl-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('It has been widely '),
          typ2('t2-twe-13-i0', 'argue', ['argued'], 'verb-tense', 'passive voice "has been + V3" จึงใช้ argued'),
          t2(' that while leadership ability '),
          typ2('t2-twe-13-i1', 'vary', ['varies'], 'verb-tense', 'ประธาน "leadership ability" เป็นเอกพจน์ จึงใช้ varies'),
          t2(' between individuals, women '),
          typ2('t2-twe-13-i2', 'make', ['make'], 'verb-tense', 'ประธาน "women" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' better leaders than men in most professional settings. Others argue that leadership skill '),
          typ2('t2-twe-13-i3', 'depend', ['depends'], 'verb-tense', 'ประธาน "leadership skill" เป็นเอกพจน์ จึงใช้ depends'),
          t2(' entirely on personal qualities rather than gender, meaning neither group is inherently superior. I personally believe that leadership ability is not determined by gender, and my reasons will be '),
          typ2('t2-twe-13-i4', 'elaborate', ['elaborated'], 'verb-tense', 'passive voice "will be + V3" จึงใช้ elaborated'),
          t2(' on in the following paragraphs.')
        ]
      },
      {
        id: 'gb2-wl-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-twe-13-b1start', ['To begin with', 'To explain it simply', 'For example'], 'To begin with', '"To begin with" ใช้เปิดย่อหน้าแรกเพื่อเริ่มเหตุผลข้อแรก'),
          t2(', it might seem sensible for some to claim that women generally '),
          typ2('t2-twe-13-b1a', 'make', ['make'], 'verb-tense', 'ประธาน "women" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' better leaders than men. '),
          drag2('t2-twe-13-b1mid', ['To explain it simply', 'To begin with', 'From this perspective'], 'To explain it simply', '"To explain it simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is possibly because women are often '),
          typ2('t2-twe-13-b1b', 'perceive', ['perceived'], 'verb-tense', 'passive voice "are + V3" จึงใช้ perceived'),
          t2(' as more collaborative and empathetic communicators'),
          punc2('t2-twe-13-b1c', ['semicolon', 'period', 'comma'], 'semicolon', 'semicolon ก่อน therefore ที่เชื่อมสองประโยคสมบูรณ์ที่เกี่ยวข้องกัน'),
          t2(' therefore'),
          punc2('t2-twe-13-b1c2', ['comma', 'period', 'none'], 'comma', 'comma หลัง therefore ก่อนขึ้นใจความหลักของประโยค'),
          t2(' some believe teams '),
          typ2('t2-twe-13-b1d', 'lead', ['led'], 'participle', '"teams led by women" — V3 ทำหน้าที่คุณศัพท์ขยาย teams แปลว่าทีมที่ถูกนำโดยผู้หญิง'),
          t2(' by women experience stronger morale and cooperation. '),
          drag2('t2-twe-13-b1e', ['For example', 'To begin with', 'In this respect'], 'For example', '"For example" ยกตัวอย่างผู้บริหารหญิงที่มีชื่อเสียง'),
          t2(', several well-known female chief executives, including the former leader of PepsiCo, are frequently '),
          typ2('t2-twe-13-b1f', 'praise', ['praised'], 'verb-tense', 'passive voice "are + V3" จึงใช้ praised'),
          t2(' for their inclusive management style. '),
          drag2('t2-twe-13-b1g', ['From this perspective', 'To explain it simply', 'For instance'], 'From this perspective', '"From this perspective" สรุปมุมมองของฝ่ายที่เห็นต่างก่อนขึ้นย่อหน้าถัดไป'),
          t2(', it is understandable why some would believe that women '),
          typ2('t2-twe-13-b1h', 'possess', ['possess'], 'verb-tense', 'ประธาน "women" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' natural advantages in leadership roles.')
        ]
      },
      {
        id: 'gb2-wl-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          drag2('t2-twe-13-b2start', ['However', 'To begin with', 'For example'], 'However', '"However" เปิดย่อหน้าเพื่อโต้แย้งมุมมองในย่อหน้าก่อนหน้า'),
          t2(', I would personally argue in favor of the idea that leadership quality '),
          typ2('t2-twe-13-b2a', 'depend', ['depends'], 'verb-tense', 'ประธาน "leadership quality" เป็นเอกพจน์ จึงใช้ depends'),
          t2(' on individual traits rather than gender. '),
          drag2('t2-twe-13-b2mid', ['To put it simply', 'However', 'In this respect'], 'To put it simply', '"To put it simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is due to the fact that effective leadership '),
          typ2('t2-twe-13-b2b', 'rely', ['relies'], 'verb-tense', 'ประธาน "effective leadership" เป็นเอกพจน์ จึงใช้ relies'),
          t2(' on skills such as decisiveness and vision, which men and women '),
          typ2('t2-twe-13-b2c', 'develop', ['develop'], 'verb-tense', 'ประธาน "men and women" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' equally through experience and training. '),
          drag2('t2-twe-13-b2d', ['For instance', 'To put it simply', 'In this respect'], 'For instance', '"For instance" ยกตัวอย่างงานวิจัยของ Harvard Business Review ปี 2019'),
          t2(', a 2019 Harvard Business Review analysis of thousands of managers '),
          typ2('t2-twe-13-b2e', 'find', ['found'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ found'),
          t2(' no significant difference in overall leadership effectiveness between men and women. '),
          drag2('t2-twe-13-b2f', ['In this respect', 'For instance', 'However'], 'In this respect', '"In this respect" สรุปมุมมองในย่อหน้านี้ก่อนขึ้นประโยคปิดท้าย'),
          t2(', it is evident that gender alone cannot reliably '),
          typ2('t2-twe-13-b2g', 'predict', ['predict'], 'verb-tense', 'ขนานกับ cannot + base verb'),
          t2(' who will become a successful leader.')
        ]
      },
      {
        id: 'gb2-wl-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-twe-13-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that certain leadership styles are sometimes '),
          typ2('t2-twe-13-c0', 'associate', ['associated'], 'verb-tense', 'passive voice "are + V3" จึงใช้ associated'),
          t2(' with one gender, I am of the opinion that individual ability, rather than gender, ultimately '),
          typ2('t2-twe-13-c1', 'determine', ['determines'], 'verb-tense', 'ประธาน "individual ability" เป็นเอกพจน์ จึงใช้ determines'),
          t2(' leadership success.')
        ]
      }
    ]
  },
  {
    id: 'gb2-sugary-products',
    promptId: 't2-twe-14',
    steps: [
      {
        id: 'gb2-sp-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('It has been widely '),
          typ2('t2-twe-14-i0', 'argue', ['argued'], 'verb-tense', 'passive voice "has been + V3" จึงใช้ argued'),
          t2(' that while sugary food and drinks remain popular consumer choices, '),
          typ2('t2-twe-14-i1', 'make', ['making'], 'verb-tense', '"making these products more expensive" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' these products more expensive would encourage people to '),
          typ2('t2-twe-14-i2', 'consume', ['consume'], 'verb-tense', 'ขนานกับ to + base verb'),
          t2(' less sugar. Others argue that '),
          typ2('t2-twe-14-i3', 'raise', ['raising'], 'verb-tense', '"raising prices" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' prices unfairly punishes consumers instead of '),
          typ2('t2-twe-14-i4', 'address', ['addressing'], 'verb-tense', '"instead of addressing..." ตามด้วย gerund หลัง instead of'),
          t2(' the root causes of unhealthy eating habits. I personally believe that '),
          typ2('t2-twe-14-i5', 'increase', ['increasing'], 'verb-tense', '"increasing the price" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' the price of sugary products is an effective health measure, and my reasons will be '),
          typ2('t2-twe-14-i6', 'elaborate', ['elaborated'], 'verb-tense', 'passive voice "will be + V3" จึงใช้ elaborated'),
          t2(' on in the following paragraphs.')
        ]
      },
      {
        id: 'gb2-sp-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-twe-14-b1start', ['To begin with', 'To explain it simply', 'For example'], 'To begin with', '"To begin with" ใช้เปิดย่อหน้าแรกเพื่อเริ่มเหตุผลข้อแรก'),
          t2(', it might seem sensible for some to claim that '),
          typ2('t2-twe-14-b1a', 'raise', ['raising'], 'verb-tense', '"raising prices" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' prices on sugary products is an unfair and ineffective solution. '),
          drag2('t2-twe-14-b1mid', ['To explain it simply', 'To begin with', 'From this perspective'], 'To explain it simply', '"To explain it simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is possibly because higher prices '),
          typ2('t2-twe-14-b1b', 'affect', ['affect'], 'verb-tense', 'ประธาน "higher prices" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' low-income families far more severely than wealthier ones. '),
          drag2('t2-twe-14-b1c', ['For example', 'To begin with', 'In this respect'], 'For example', '"For example" ยกตัวอย่างครอบครัวที่มีงบจำกัด'),
          t2(', families on tight budgets might struggle financially if the price of everyday snacks and soft drinks suddenly '),
          typ2('t2-twe-14-b1d', 'increase', ['increases'], 'verb-tense', 'ประธาน "the price" เป็นเอกพจน์ จึงใช้ increases'),
          t2('. '),
          drag2('t2-twe-14-b1e', ['From this perspective', 'To explain it simply', 'For instance'], 'From this perspective', '"From this perspective" สรุปมุมมองของฝ่ายที่เห็นต่างก่อนขึ้นย่อหน้าถัดไป'),
          t2(', it is understandable why some would believe that price increases unfairly burden certain groups in society.')
        ]
      },
      {
        id: 'gb2-sp-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          drag2('t2-twe-14-b2start', ['However', 'To begin with', 'For example'], 'However', '"However" เปิดย่อหน้าเพื่อโต้แย้งมุมมองในย่อหน้าก่อนหน้า'),
          t2(', I would personally argue in favor of the idea that '),
          typ2('t2-twe-14-b2a', 'raise', ['raising'], 'verb-tense', '"raising the price" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' the price of sugary products effectively '),
          typ2('t2-twe-14-b2b', 'reduce', ['reduces'], 'verb-tense', 'ประธาน "raising the price" (gerund phrase) เป็นเอกพจน์ จึงใช้ reduces'),
          t2(' consumption. '),
          drag2('t2-twe-14-b2mid', ['To put it simply', 'However', 'In this respect'], 'To put it simply', '"To put it simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is due to the fact that higher prices directly '),
          typ2('t2-twe-14-b2c', 'discourage', ['discourage'], 'verb-tense', 'ประธาน "higher prices" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' '),
          typ2('t2-twe-14-b2d', 'purchase', ['purchasing'], 'verb-tense', '"discourage purchasing" ตามด้วย gerund เสมอหลัง discourage'),
          t2(', which research consistently '),
          typ2('t2-twe-14-b2e', 'show', ['shows'], 'verb-tense', 'ประธาน "research" เป็นเอกพจน์ จึงใช้ shows'),
          t2(' changes consumer behavior. '),
          drag2('t2-twe-14-b2f', ['For instance', 'To put it simply', 'In this respect'], 'For instance', '"For instance" ยกตัวอย่างภาษีน้ำตาลของเม็กซิโก'),
          t2(', after Mexico '),
          typ2('t2-twe-14-b2g', 'introduce', ['introduced'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ introduced'),
          t2(' a sugar tax in 2014, a study '),
          typ2('t2-twe-14-b2h', 'publish', ['published'], 'participle', '"a study published in the British Medical Journal" — V3 ทำหน้าที่คุณศัพท์ขยาย study'),
          t2(' in the British Medical Journal '),
          typ2('t2-twe-14-b2i', 'find', ['found'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ found'),
          t2(' that purchases of sugary drinks '),
          typ2('t2-twe-14-b2j', 'fall', ['fell'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ fell'),
          t2(' by more than seven percent within two years. '),
          drag2('t2-twe-14-b2k', ['In this respect', 'For instance', 'However'], 'In this respect', '"In this respect" สรุปมุมมองในย่อหน้านี้ก่อนขึ้นประโยคปิดท้าย'),
          t2(', it is evident that pricing policies can meaningfully '),
          typ2('t2-twe-14-b2l', 'reduce', ['reduce'], 'verb-tense', 'ขนานกับ can + base verb'),
          t2(' excessive sugar consumption nationwide.')
        ]
      },
      {
        id: 'gb2-sp-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-twe-14-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that higher prices may place some financial pressure on consumers, I am of the opinion that '),
          typ2('t2-twe-14-c0', 'make', ['making'], 'verb-tense', '"making sugary products more expensive" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' sugary products more expensive remains an effective way to improve public health.')
        ]
      }
    ]
  },
  {
    id: 'gb2-space-research',
    promptId: 't2-twe-15',
    steps: [
      {
        id: 'gb2-sr-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('It has been widely '),
          typ2('t2-twe-15-i0', 'argue', ['argued'], 'verb-tense', 'passive voice "has been + V3" จึงใช้ argued'),
          t2(' that while space exploration '),
          typ2('t2-twe-15-i1', 'capture', ['captures'], 'verb-tense', 'ประธาน "space exploration" เป็นเอกพจน์ จึงใช้ captures'),
          t2(' public imagination, the billions '),
          typ2('t2-twe-15-i2', 'spend', ['spent'], 'participle', '"the billions spent on space research" — V3 ทำหน้าที่คุณศัพท์ขยาย billions'),
          t2(' on space research should instead be '),
          typ2('t2-twe-15-i3', 'invest', ['invested'], 'verb-tense', 'passive voice "should be + V3" จึงใช้ invested'),
          t2(' in more practical projects on Earth. Others argue that space research itself '),
          typ2('t2-twe-15-i4', 'produce', ['produces'], 'verb-tense', 'ประธาน "space research" เป็นเอกพจน์ จึงใช้ produces'),
          t2(' practical benefits that justify its enormous cost. I personally believe that space research funding is justified despite its high cost, and my reasons will be '),
          typ2('t2-twe-15-i5', 'elaborate', ['elaborated'], 'verb-tense', 'passive voice "will be + V3" จึงใช้ elaborated'),
          t2(' on in the following paragraphs.')
        ]
      },
      {
        id: 'gb2-sr-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-twe-15-b1start', ['To begin with', 'To explain it simply', 'For example'], 'To begin with', '"To begin with" ใช้เปิดย่อหน้าแรกเพื่อเริ่มเหตุผลข้อแรก'),
          t2(', it might seem sensible for some to claim that space research funding should be '),
          typ2('t2-twe-15-b1a', 'redirect', ['redirected'], 'verb-tense', 'passive voice "should be + V3" จึงใช้ redirected'),
          t2(' toward more urgent problems on Earth. '),
          drag2('t2-twe-15-b1mid', ['To explain it simply', 'To begin with', 'From this perspective'], 'To explain it simply', '"To explain it simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is possibly because issues such as poverty and disease '),
          typ2('t2-twe-15-b1b', 'affect', ['affect'], 'verb-tense', 'ประธาน "issues" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' billions of people directly'),
          punc2('t2-twe-15-b1c', ['semicolon', 'period', 'comma'], 'semicolon', 'semicolon ก่อน therefore ที่เชื่อมสองประโยคสมบูรณ์ที่เกี่ยวข้องกัน'),
          t2(' therefore'),
          punc2('t2-twe-15-b1c2', ['comma', 'period', 'none'], 'comma', 'comma หลัง therefore ก่อนขึ้นใจความหลักของประโยค'),
          t2(' some believe this money could save more lives if '),
          typ2('t2-twe-15-b1d', 'spend', ['spent'], 'verb-tense', 'passive voice "if + V3" (ellipsis of "if it were spent") จึงใช้ spent'),
          t2(' elsewhere. '),
          drag2('t2-twe-15-b1e', ['For example', 'To begin with', 'In this respect'], 'For example', '"For example" ยกตัวอย่างคำวิจารณ์เรื่องต้นทุนภารกิจอวกาศ'),
          t2(', critics often point out that the cost of a single space mission could fund hospitals or schools in developing countries for years. '),
          drag2('t2-twe-15-b1f', ['From this perspective', 'To explain it simply', 'For instance'], 'From this perspective', '"From this perspective" สรุปมุมมองของฝ่ายที่เห็นต่างก่อนขึ้นย่อหน้าถัดไป'),
          t2(', it is understandable why some would believe that space spending should be reduced in favor of practical earthly needs.')
        ]
      },
      {
        id: 'gb2-sr-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          drag2('t2-twe-15-b2start', ['However', 'To begin with', 'For example'], 'However', '"However" เปิดย่อหน้าเพื่อโต้แย้งมุมมองในย่อหน้าก่อนหน้า'),
          t2(', I would personally argue in favor of the idea that space research funding remains a worthwhile investment. '),
          drag2('t2-twe-15-b2mid', ['To put it simply', 'However', 'In this respect'], 'To put it simply', '"To put it simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is due to the fact that many everyday technologies, including satellite navigation and weather forecasting, originally '),
          typ2('t2-twe-15-b2a', 'develop', ['developed'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ developed'),
          t2(' from space research, which has '),
          typ2('t2-twe-15-b2b', 'benefit', ['benefited'], 'verb-tense', 'present perfect "has + V3" จึงใช้ benefited'),
          t2(' society enormously. '),
          drag2('t2-twe-15-b2c', ['For instance', 'To put it simply', 'In this respect'], 'For instance', '"For instance" ยกตัวอย่างการประมาณการของ NASA'),
          t2(', NASA estimates that its research has '),
          typ2('t2-twe-15-b2d', 'contribute', ['contributed'], 'verb-tense', 'present perfect "has + V3" จึงใช้ contributed'),
          t2(' to the development of over two thousand commercial products, including improvements in medical imaging technology. '),
          drag2('t2-twe-15-b2e', ['In this respect', 'For instance', 'However'], 'In this respect', '"In this respect" สรุปมุมมองในย่อหน้านี้ก่อนขึ้นประโยคปิดท้าย'),
          t2(', it is evident that space research '),
          typ2('t2-twe-15-b2f', 'deliver', ['delivers'], 'verb-tense', 'ประธาน "space research" เป็นเอกพจน์ จึงใช้ delivers'),
          t2(' practical benefits that extend far beyond exploration itself.')
        ]
      },
      {
        id: 'gb2-sr-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-twe-15-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that pressing problems on Earth deserve significant funding, I am of the opinion that continued investment in space research is justified by its wide-ranging practical benefits.')
        ]
      }
    ]
  },
  {
    id: 'gb2-subways-vs-roads',
    promptId: 't2-dbv-1',
    steps: [
      {
        id: 'gb2-svr-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('While it is '),
          typ2('t2-dbv-1-i0', 'argue', ['argued'], 'verb-tense', 'passive voice "is + V3" จึงใช้ argued'),
          t2(' by some that governments should invest in subway and train networks to '),
          typ2('t2-dbv-1-i1', 'ease', ['ease'], 'verb-tense', 'ขนานกับ to + base verb'),
          t2(' traffic congestion, others claim that '),
          typ2('t2-dbv-1-i2', 'build', ['building'], 'verb-tense', '"building wider roads" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' wider roads is a more effective solution. Both points of view will be '),
          typ2('t2-dbv-1-i3', 'elaborate', ['elaborated'], 'verb-tense', 'passive voice "will be + V3" จึงใช้ elaborated'),
          t2(' on before '),
          typ2('t2-dbv-1-i4', 'elaborate', ['elaborating'], 'verb-tense', '"before elaborating on..." ตามด้วย gerund หลัง before'),
          t2(' on the reasons why I believe that '),
          typ2('t2-dbv-1-i5', 'invest', ['investing'], 'verb-tense', '"investing in public transport" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' in public transport is the better approach.')
        ]
      },
      {
        id: 'gb2-svr-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-dbv-1-b1start', ['To begin with', 'To explain this simply', 'For example'], 'To begin with', '"To begin with" ใช้เปิดย่อหน้าแรกเพื่อเริ่มเหตุผลข้อแรก'),
          t2(', it might seem sensible for some to claim that '),
          typ2('t2-dbv-1-b1a', 'expand', ['expanding'], 'verb-tense', '"expanding subway and train networks" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' subway and train networks is the most effective way to reduce congestion. '),
          drag2('t2-dbv-1-b1mid', ['To explain this simply', 'To begin with', 'For example'], 'To explain this simply', '"To explain this simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is because a well-'),
          typ2('t2-dbv-1-b1b', 'develop', ['developed'], 'participle', '"a well-developed rail system" — V3 ทำหน้าที่คุณศัพท์ขยาย system แปลว่าระบบที่ได้รับการพัฒนาอย่างดี'),
          t2(' rail system can transport many passengers away from private vehicles, '),
          typ2('t2-dbv-1-b1c', 'cut', ['cutting'], 'verb-tense', '"cutting the number..." เป็น participle phrase ขยายประโยคหลัก'),
          t2(' the number of cars on the road. '),
          drag2('t2-dbv-1-b1d', ['For example', 'To begin with', 'To explain this simply'], 'For example', '"For example" ยกตัวอย่างระบบ MRT ของสิงคโปร์'),
          t2(", Singapore's Mass Rapid Transit network "),
          typ2('t2-dbv-1-b1e', 'carry', ['carries'], 'verb-tense', 'ประธาน "network" เป็นเอกพจน์ จึงใช้ carries'),
          t2(' more than three million passengers daily, '),
          typ2('t2-dbv-1-b1f', 'ease', ['easing'], 'verb-tense', '"easing congestion" เป็น participle phrase ขยายประโยคหลัก'),
          t2(' congestion across its road network.')
        ]
      },
      {
        id: 'gb2-svr-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          t2('However, some might '),
          typ2('t2-dbv-1-b2a', 'argue', ['argue'], 'verb-tense', 'ประธาน "some" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' that building more and wider roads is a more practical solution. '),
          drag2('t2-dbv-1-b2mid', ['To put it simply', 'However', 'For instance'], 'To put it simply', '"To put it simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is due to the fact that road expansion '),
          typ2('t2-dbv-1-b2b', 'allow', ['allows'], 'verb-tense', 'ประธาน "road expansion" เป็นเอกพจน์ จึงใช้ allows'),
          t2(' a greater volume of vehicles to travel at once, '),
          typ2('t2-dbv-1-b2c', 'reduce', ['reducing'], 'verb-tense', '"reducing bottlenecks" เป็น participle phrase ขยายประโยคหลัก'),
          t2(' bottlenecks during peak hours. '),
          drag2('t2-dbv-1-b2d', ['For instance', 'To put it simply', 'However'], 'For instance', '"For instance" ยกตัวอย่างงานวิจัยของ Texas Transportation Institute'),
          t2(', a 2018 study by the Texas Transportation Institute '),
          typ2('t2-dbv-1-b2e', 'find', ['found'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ found'),
          t2(' that '),
          typ2('t2-dbv-1-b2f', 'widen', ['widening'], 'verb-tense', '"widening key highways" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' key highways in Houston '),
          typ2('t2-dbv-1-b2g', 'cut', ['cut'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ cut'),
          t2(' average commute times by nearly 10%.')
        ]
      },
      {
        id: 'gb2-svr-body3',
        role: 'body3',
        labelTh: WGB2_ROLE_LABEL_TH.body3,
        segments: [
          t2('Personally, I would argue in favor of the idea that '),
          typ2('t2-dbv-1-b3a', 'invest', ['investing'], 'verb-tense', '"investing in subway and train lines" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' in subway and train lines brings more sustainable, long-term benefits. My reasoning is that, unlike roads, rail networks encourage a lasting shift away from private car use, '),
          typ2('t2-dbv-1-b3b', 'prevent', ['preventing'], 'verb-tense', '"preventing congestion from returning" เป็น participle phrase ขยายประโยคหลัก'),
          t2(' congestion from '),
          typ2('t2-dbv-1-b3c', 'return', ['returning'], 'verb-tense', '"prevent...from returning" ตามด้วย gerund หลัง from'),
          t2(' as cities grow. '),
          drag2('t2-dbv-1-b3start', ['To illustrate', 'To put it simply', 'In this respect'], 'To illustrate', '"To illustrate" ยกตัวอย่างรถไฟใต้ดินลอนดอน'),
          t2(", London's Underground has "),
          typ2('t2-dbv-1-b3d', 'allow', ['allowed'], 'verb-tense', 'present perfect "has + V3" จึงใช้ allowed'),
          t2(' the city to keep up with steady population growth for over a century without '),
          typ2('t2-dbv-1-b3e', 'expand', ['expanding'], 'verb-tense', '"without expanding..." ตามด้วย gerund หลัง without'),
          t2(' its road capacity.')
        ]
      },
      {
        id: 'gb2-svr-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-dbv-1-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that '),
          typ2('t2-dbv-1-c0', 'expand', ['expanding'], 'verb-tense', '"expanding road networks" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' road networks can offer a quicker, short-term reduction in congestion, I am of the opinion that '),
          typ2('t2-dbv-1-c1', 'invest', ['investing'], 'verb-tense', '"investing in subway and train lines" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' in subway and train lines is the wiser long-term solution.')
        ]
      }
    ]
  },
  {
    id: 'gb2-packaging-responsibility',
    promptId: 't2-dbv-2',
    steps: [
      {
        id: 'gb2-pr-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('While it is '),
          typ2('t2-dbv-2-i0', 'argue', ['argued'], 'verb-tense', 'passive voice "is + V3" จึงใช้ argued'),
          t2(' by some that supermarkets and manufacturers have a duty to '),
          typ2('t2-dbv-2-i1', 'reduce', ['reduce'], 'verb-tense', 'ขนานกับ to + base verb'),
          t2(' the packaging of the products they sell, others claim that consumers themselves must take responsibility by '),
          typ2('t2-dbv-2-i2', 'avoid', ['avoiding'], 'verb-tense', '"by avoiding..." ตามด้วย gerund หลัง by'),
          t2(' heavily packaged products. Both points of view will be '),
          typ2('t2-dbv-2-i3', 'elaborate', ['elaborated'], 'verb-tense', 'passive voice "will be + V3" จึงใช้ elaborated'),
          t2(' on before '),
          typ2('t2-dbv-2-i4', 'elaborate', ['elaborating'], 'verb-tense', '"before elaborating on..." ตามด้วย gerund หลัง before'),
          t2(' on the reasons why I believe that manufacturers '),
          typ2('t2-dbv-2-i5', 'bear', ['bear'], 'verb-tense', 'ประธาน "manufacturers" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' the greater responsibility.')
        ]
      },
      {
        id: 'gb2-pr-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-dbv-2-b1start', ['To begin with', 'To explain this simply', 'For example'], 'To begin with', '"To begin with" ใช้เปิดย่อหน้าแรกเพื่อเริ่มเหตุผลข้อแรก'),
          t2(', it might seem sensible for some to claim that manufacturers should take primary responsibility for '),
          typ2('t2-dbv-2-b1a', 'reduce', ['reducing'], 'verb-tense', '"reducing packaging" เป็น gerund phrase ทำหน้าที่กรรมของ for'),
          t2(' packaging. '),
          drag2('t2-dbv-2-b1mid', ['To explain this simply', 'To begin with', 'For example'], 'To explain this simply', '"To explain this simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is because companies '),
          typ2('t2-dbv-2-b1b', 'control', ['control'], 'verb-tense', 'ประธาน "companies" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' product design and could switch to more sustainable materials at the source. '),
          drag2('t2-dbv-2-b1c', ['For example', 'To begin with', 'To explain this simply'], 'For example', '"For example" ยกตัวอย่างซูเปอร์มาร์เก็ตในสหราชอาณาจักร'),
          t2(', several major supermarket chains in the UK have '),
          typ2('t2-dbv-2-b1d', 'remove', ['removed'], 'verb-tense', 'present perfect "have + V3" จึงใช้ removed'),
          t2(' plastic packaging from fresh produce, '),
          typ2('t2-dbv-2-b1e', 'cut', ['cutting'], 'verb-tense', '"cutting plastic waste" เป็น participle phrase ขยายประโยคหลัก'),
          t2(' plastic waste by thousands of tonnes annually.')
        ]
      },
      {
        id: 'gb2-pr-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          t2('However, some might argue that consumers '),
          typ2('t2-dbv-2-b2a', 'hold', ['hold'], 'verb-tense', 'ประธาน "consumers" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' greater responsibility for this issue. '),
          drag2('t2-dbv-2-b2mid', ['To put it simply', 'However', 'For instance'], 'To put it simply', '"To put it simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is due to the fact that consumer demand ultimately '),
          typ2('t2-dbv-2-b2b', 'drive', ['drives'], 'verb-tense', 'ประธาน "consumer demand" เป็นเอกพจน์ จึงใช้ drives'),
          t2(' what products companies choose to package and sell. '),
          drag2('t2-dbv-2-b2c', ['For instance', 'To put it simply', 'However'], 'For instance', '"For instance" ยกตัวอย่างผู้บริโภคเลือกซื้อผักผลไม้แบบไม่มีบรรจุภัณฑ์'),
          t2(', a growing number of shoppers now '),
          typ2('t2-dbv-2-b2d', 'choose', ['choose'], 'verb-tense', 'ประธาน "shoppers" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' loose fruit and vegetables over pre-packaged alternatives, '),
          typ2('t2-dbv-2-b2e', 'encourage', ['encouraging'], 'verb-tense', '"encouraging retailers..." เป็น participle phrase ขยายประโยคหลัก'),
          t2(' retailers to offer more unpackaged options.')
        ]
      },
      {
        id: 'gb2-pr-body3',
        role: 'body3',
        labelTh: WGB2_ROLE_LABEL_TH.body3,
        segments: [
          t2('Personally, I would argue in favor of the idea that manufacturers should bear the greater share of responsibility. My reasoning is that ordinary consumers often have limited alternatives, since most products are still '),
          typ2('t2-dbv-2-b3a', 'sell', ['sold'], 'verb-tense', 'passive voice "are + V3" จึงใช้ sold'),
          t2(' in fixed packaging regardless of individual preference. '),
          drag2('t2-dbv-2-b3start', ['To illustrate', 'To put it simply', 'In this respect'], 'To illustrate', '"To illustrate" ยกตัวอย่างสินค้าที่ต้องใช้พลาสติกห่อ'),
          t2(', shoppers in many countries cannot buy household staples such as rice or shampoo without some form of plastic packaging, no matter how environmentally '),
          typ2('t2-dbv-2-b3b', 'conscious', ['conscious'], 'verb-tense', 'คำคุณศัพท์ "environmentally conscious" ไม่ผัน'),
          t2(' they are.')
        ]
      },
      {
        id: 'gb2-pr-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-dbv-2-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that consumer choices can '),
          typ2('t2-dbv-2-c0', 'influence', ['influence'], 'verb-tense', 'ขนานกับ can + base verb'),
          t2(' packaging habits to some extent, I am of the opinion that manufacturers hold the greater responsibility, as they ultimately '),
          typ2('t2-dbv-2-c1', 'control', ['control'], 'verb-tense', 'ประธาน "they" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' how products are packaged.')
        ]
      }
    ]
  },
  {
    id: 'gb2-genetic-engineering',
    promptId: 't2-dbv-3',
    steps: [
      {
        id: 'gb2-ge-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('While it is '),
          typ2('t2-dbv-3-i0', 'argue', ['argued'], 'verb-tense', 'passive voice "is + V3" จึงใช้ argued'),
          t2(' by some that genetic engineering will greatly improve human lives, others claim that it '),
          typ2('t2-dbv-3-i1', 'pose', ['poses'], 'verb-tense', 'ประธาน "it" เป็นเอกพจน์ จึงใช้ poses'),
          t2(' a serious threat to life on earth. Both points of view will be '),
          typ2('t2-dbv-3-i2', 'elaborate', ['elaborated'], 'verb-tense', 'passive voice "will be + V3" จึงใช้ elaborated'),
          t2(' on before '),
          typ2('t2-dbv-3-i3', 'elaborate', ['elaborating'], 'verb-tense', '"before elaborating on..." ตามด้วย gerund หลัง before'),
          t2(' on the reasons why I believe that genetic engineering '),
          typ2('t2-dbv-3-i4', 'bring', ['brings'], 'verb-tense', 'ประธาน "genetic engineering" เป็นเอกพจน์ จึงใช้ brings'),
          t2(' more benefits than risks.')
        ]
      },
      {
        id: 'gb2-ge-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-dbv-3-b1start', ['To begin with', 'To explain this simply', 'For example'], 'To begin with', '"To begin with" ใช้เปิดย่อหน้าแรกเพื่อเริ่มเหตุผลข้อแรก'),
          t2(', it might seem sensible for some to claim that genetic engineering '),
          typ2('t2-dbv-3-b1a', 'offer', ['offers'], 'verb-tense', 'ประธาน "genetic engineering" เป็นเอกพจน์ จึงใช้ offers'),
          t2(' significant benefits to humanity. '),
          drag2('t2-dbv-3-b1mid', ['To explain this simply', 'To begin with', 'For example'], 'To explain this simply', '"To explain this simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is because scientists can now '),
          typ2('t2-dbv-3-b1b', 'modify', ['modify'], 'verb-tense', 'ขนานกับ can + base verb'),
          t2(' genes to prevent inherited diseases before they even '),
          typ2('t2-dbv-3-b1c', 'develop', ['develop'], 'verb-tense', 'ประธาน "they" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2('. '),
          drag2('t2-dbv-3-b1d', ['For example', 'To begin with', 'To explain this simply'], 'For example', '"For example" ยกตัวอย่างการบำบัดด้วยยีน'),
          t2(', gene therapy has already been '),
          typ2('t2-dbv-3-b1e', 'use', ['used'], 'verb-tense', 'present perfect passive "has been + V3" จึงใช้ used'),
          t2(' to successfully treat patients with sickle cell disease in several clinical trials.')
        ]
      },
      {
        id: 'gb2-ge-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          t2('However, some might argue that genetic engineering '),
          typ2('t2-dbv-3-b2a', 'pose', ['poses'], 'verb-tense', 'ประธาน "genetic engineering" เป็นเอกพจน์ จึงใช้ poses'),
          t2(' serious dangers to life on earth. '),
          drag2('t2-dbv-3-b2mid', ['To put it simply', 'However', 'For instance'], 'To put it simply', '"To put it simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is due to the fact that altering genes could '),
          typ2('t2-dbv-3-b2b', 'produce', ['produce'], 'verb-tense', 'ขนานกับ could + base verb'),
          t2(' unpredictable and irreversible effects on ecosystems and future generations. '),
          drag2('t2-dbv-3-b2c', ['For instance', 'To put it simply', 'However'], 'For instance', '"For instance" ยกตัวอย่างพืชดัดแปลงพันธุกรรม'),
          t2(', genetically modified crops have been '),
          typ2('t2-dbv-3-b2d', 'link', ['linked'], 'verb-tense', 'present perfect passive "have been + V3" จึงใช้ linked'),
          t2(' to reduced biodiversity in some farming regions where they have been widely '),
          typ2('t2-dbv-3-b2e', 'plant', ['planted'], 'verb-tense', 'present perfect passive "have been + V3" จึงใช้ planted'),
          t2('.')
        ]
      },
      {
        id: 'gb2-ge-body3',
        role: 'body3',
        labelTh: WGB2_ROLE_LABEL_TH.body3,
        segments: [
          t2('Personally, I would argue in favor of the idea that the benefits of genetic engineering outweigh its risks. My reasoning is that, with strict international regulation, the '),
          typ2('t2-dbv-3-b3a', 'technology', ["technology's"], 'plural', "รูปแสดงความเป็นเจ้าของ (possessive) จึงใช้ technology's"),
          t2(" dangers can be managed while its life-saving potential is "),
          typ2('t2-dbv-3-b3b', 'preserve', ['preserved'], 'verb-tense', 'passive voice "is + V3" จึงใช้ preserved'),
          t2('. '),
          drag2('t2-dbv-3-b3start', ['To illustrate', 'To put it simply', 'In this respect'], 'To illustrate', '"To illustrate" ยกตัวอย่างสหราชอาณาจักร'),
          t2(', countries such as the UK now '),
          typ2('t2-dbv-3-b3c', 'require', ['require'], 'verb-tense', 'ประธาน "countries" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' rigorous ethical approval before any gene-editing research can proceed, significantly '),
          typ2('t2-dbv-3-b3d', 'reduce', ['reducing'], 'verb-tense', '"reducing the likelihood..." เป็น participle phrase ขยายประโยคหลัก'),
          t2(' the likelihood of harmful outcomes.')
        ]
      },
      {
        id: 'gb2-ge-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-dbv-3-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that genetic engineering '),
          typ2('t2-dbv-3-c0', 'carry', ['carries'], 'verb-tense', 'ประธาน "genetic engineering" เป็นเอกพจน์ จึงใช้ carries'),
          t2(' certain risks, I am of the opinion that its potential to '),
          typ2('t2-dbv-3-c1', 'improve', ['improve'], 'verb-tense', 'ขนานกับ to + base verb'),
          t2(' human health makes it a worthwhile technology to pursue.')
        ]
      }
    ]
  },
  {
    id: 'gb2-money-management',
    promptId: 't2-dbv-4',
    steps: [
      {
        id: 'gb2-mm-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('While it is '),
          typ2('t2-dbv-4-i0', 'argue', ['argued'], 'verb-tense', 'passive voice "is + V3" จึงใช้ argued'),
          t2(' by some that money management should be '),
          typ2('t2-dbv-4-i1', 'teach', ['taught'], 'verb-tense', 'passive voice "should be + V3" จึงใช้ taught'),
          t2(' as a mandatory school subject, others claim that '),
          typ2('t2-dbv-4-i2', 'teach', ['teaching'], 'verb-tense', '"teaching children about finances" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' children about finances is solely the responsibility of parents. Both points of view will be '),
          typ2('t2-dbv-4-i3', 'elaborate', ['elaborated'], 'verb-tense', 'passive voice "will be + V3" จึงใช้ elaborated'),
          t2(' on before '),
          typ2('t2-dbv-4-i4', 'elaborate', ['elaborating'], 'verb-tense', '"before elaborating on..." ตามด้วย gerund หลัง before'),
          t2(' on the reasons why I believe that schools should '),
          typ2('t2-dbv-4-i5', 'take', ['take'], 'verb-tense', 'ขนานกับ should + base verb'),
          t2(' on this responsibility.')
        ]
      },
      {
        id: 'gb2-mm-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-dbv-4-b1start', ['To begin with', 'To explain this simply', 'For example'], 'To begin with', '"To begin with" ใช้เปิดย่อหน้าแรกเพื่อเริ่มเหตุผลข้อแรก'),
          t2(', it might seem sensible for some to claim that schools '),
          typ2('t2-dbv-4-b1a', 'be', ['are'], 'verb-tense', 'ประธาน "schools" เป็นพหูพจน์ จึงใช้ are'),
          t2(' best placed to teach money management. '),
          drag2('t2-dbv-4-b1mid', ['To explain this simply', 'To begin with', 'For example'], 'To explain this simply', '"To explain this simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is because teachers can '),
          typ2('t2-dbv-4-b1b', 'deliver', ['deliver'], 'verb-tense', 'ขนานกับ can + base verb'),
          t2(' consistent, structured financial education to every student regardless of family background. '),
          drag2('t2-dbv-4-b1c', ['For example', 'To begin with', 'To explain this simply'], 'For example', '"For example" ยกตัวอย่างหลักสูตรของสหราชอาณาจักร'),
          t2(', the UK has '),
          typ2('t2-dbv-4-b1d', 'include', ['included'], 'verb-tense', 'present perfect "has + V3" จึงใช้ included'),
          t2(' compulsory financial literacy classes in its national curriculum since 2014.')
        ]
      },
      {
        id: 'gb2-mm-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          t2('However, some might argue that '),
          typ2('t2-dbv-4-b2a', 'teach', ['teaching'], 'verb-tense', '"teaching children about money" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' children about money is a parental responsibility. '),
          drag2('t2-dbv-4-b2mid', ['To put it simply', 'However', 'For instance'], 'To put it simply', '"To put it simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is due to the fact that parents are better placed to '),
          typ2('t2-dbv-4-b2b', 'demonstrate', ['demonstrate'], 'verb-tense', 'ขนานกับ to + base verb'),
          t2(' real financial habits, such as budgeting and saving, within the context of daily family life. '),
          drag2('t2-dbv-4-b2c', ['For instance', 'To put it simply', 'However'], 'For instance', '"For instance" ยกตัวอย่างผู้ใหญ่ที่ประสบความสำเร็จทางการเงิน'),
          t2(', many financially successful adults '),
          typ2('t2-dbv-4-b2d', 'credit', ['credit'], 'verb-tense', 'ประธาน "adults" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' lessons learned from '),
          typ2('t2-dbv-4-b2e', 'watch', ['watching'], 'verb-tense', '"from watching..." ตามด้วย gerund หลัง from'),
          t2(' their parents manage household budgets.')
        ]
      },
      {
        id: 'gb2-mm-body3',
        role: 'body3',
        labelTh: WGB2_ROLE_LABEL_TH.body3,
        segments: [
          t2('Personally, I would argue in favor of the idea that money management should be a mandatory school subject. My reasoning is that not every parent '),
          typ2('t2-dbv-4-b3a', 'possess', ['possesses'], 'verb-tense', 'ประธาน "parent" เป็นเอกพจน์ จึงใช้ possesses'),
          t2(' the financial knowledge or confidence needed to teach these skills effectively. '),
          drag2('t2-dbv-4-b3start', ['To illustrate', 'To put it simply', 'In this respect'], 'To illustrate', '"To illustrate" ยกตัวอย่างผลสำรวจปี 2019'),
          t2(', a 2019 survey by a UK financial charity '),
          typ2('t2-dbv-4-b3b', 'find', ['found'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ found'),
          t2(' that nearly a third of parents '),
          typ2('t2-dbv-4-b3c', 'feel', ['felt'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ felt'),
          t2(' unqualified to teach their children about money.')
        ]
      },
      {
        id: 'gb2-mm-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-dbv-4-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(", although it is undeniable that parents play an important role in "),
          typ2('t2-dbv-4-c0', 'shape', ['shaping'], 'verb-tense', '"in shaping children\'s financial habits" ตามด้วย gerund หลัง in'),
          t2(" children's financial habits, I am of the opinion that schools should take primary responsibility, as this "),
          typ2('t2-dbv-4-c1', 'ensure', ['ensures'], 'verb-tense', 'ประธาน "this" เป็นเอกพจน์ จึงใช้ ensures'),
          t2(' every child receives this essential education.')
        ]
      }
    ]
  },
  {
    id: 'gb2-school-rules',
    promptId: 't2-dbv-5',
    steps: [
      {
        id: 'gb2-sc-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('While it is '),
          typ2('t2-dbv-5-i0', 'argue', ['argued'], 'verb-tense', 'passive voice "is + V3" จึงใช้ argued'),
          t2(' by some that schoolchildren should be '),
          typ2('t2-dbv-5-i1', 'allow', ['allowed'], 'verb-tense', 'passive voice "should be + V3" จึงใช้ allowed'),
          t2(' to make decisions about school rules, others claim that teachers should '),
          typ2('t2-dbv-5-i2', 'remain', ['remain'], 'verb-tense', 'ขนานกับ should + base verb'),
          t2(' responsible for setting these rules. Both points of view will be '),
          typ2('t2-dbv-5-i3', 'elaborate', ['elaborated'], 'verb-tense', 'passive voice "will be + V3" จึงใช้ elaborated'),
          t2(' on before '),
          typ2('t2-dbv-5-i4', 'elaborate', ['elaborating'], 'verb-tense', '"before elaborating on..." ตามด้วย gerund หลัง before'),
          t2(' on the reasons why I believe that teachers should '),
          typ2('t2-dbv-5-i5', 'retain', ['retain'], 'verb-tense', 'ขนานกับ should + base verb'),
          t2(' this responsibility.')
        ]
      },
      {
        id: 'gb2-sc-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-dbv-5-b1start', ['To begin with', 'To explain this simply', 'For example'], 'To begin with', '"To begin with" ใช้เปิดย่อหน้าแรกเพื่อเริ่มเหตุผลข้อแรก'),
          t2(', it might seem sensible for some to claim that students should '),
          typ2('t2-dbv-5-b1a', 'have', ['have'], 'verb-tense', 'ขนานกับ should + base verb'),
          t2(' a say in creating school rules. '),
          drag2('t2-dbv-5-b1mid', ['To explain this simply', 'To begin with', 'For example'], 'To explain this simply', '"To explain this simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is because pupils who help design the rules may '),
          typ2('t2-dbv-5-b1b', 'feel', ['feel'], 'verb-tense', 'ขนานกับ may + base verb'),
          t2(' more motivated to follow them. '),
          drag2('t2-dbv-5-b1c', ['For example', 'To begin with', 'To explain this simply'], 'For example', '"For example" ยกตัวอย่างโรงเรียนในฟินแลนด์'),
          t2(', some schools in Finland '),
          typ2('t2-dbv-5-b1d', 'allow', ['allow'], 'verb-tense', 'ประธาน "schools" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' student councils to propose changes to rules on matters such as school uniforms.')
        ]
      },
      {
        id: 'gb2-sc-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          t2('However, some might argue that teachers should '),
          typ2('t2-dbv-5-b2a', 'remain', ['remain'], 'verb-tense', 'ขนานกับ should + base verb'),
          t2(' solely responsible for setting school rules. '),
          drag2('t2-dbv-5-b2mid', ['To put it simply', 'However', 'For instance'], 'To put it simply', '"To put it simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is due to the fact that teachers '),
          typ2('t2-dbv-5-b2b', 'have', ['have'], 'verb-tense', 'ประธาน "teachers" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' the experience and training needed to judge which rules genuinely support learning and safety. '),
          drag2('t2-dbv-5-b2c', ['For instance', 'To put it simply', 'However'], 'For instance', '"For instance" ยกตัวอย่างนโยบายวินัยในห้องเรียน'),
          t2(', decisions such as classroom discipline policies '),
          typ2('t2-dbv-5-b2d', 'require', ['require'], 'verb-tense', 'ประธาน "decisions" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' an understanding of child development that most students do not yet have.')
        ]
      },
      {
        id: 'gb2-sc-body3',
        role: 'body3',
        labelTh: WGB2_ROLE_LABEL_TH.body3,
        segments: [
          t2('Personally, I would argue in favor of the idea that teachers should retain primary responsibility for school rules. My reasoning is that children often '),
          typ2('t2-dbv-5-b3a', 'lack', ['lack'], 'verb-tense', 'ประธาน "children" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' the long-term perspective needed to judge the consequences of the rules they might propose. '),
          drag2('t2-dbv-5-b3start', ['To illustrate', 'To put it simply', 'In this respect'], 'To illustrate', '"To illustrate" ยกตัวอย่างกฎการใช้โทรศัพท์'),
          t2(', a rule '),
          typ2('t2-dbv-5-b3b', 'allow', ['allowing'], 'verb-tense', '"a rule allowing unlimited phone use" — V-ing ทำหน้าที่คุณศัพท์ขยาย rule'),
          t2(' unlimited phone use during lessons might '),
          typ2('t2-dbv-5-b3c', 'seem', ['seem'], 'verb-tense', 'ขนานกับ might + base verb'),
          t2(' appealing to students but could seriously damage their academic performance.')
        ]
      },
      {
        id: 'gb2-sc-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-dbv-5-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that '),
          typ2('t2-dbv-5-c0', 'involve', ['involving'], 'verb-tense', '"involving students" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(" students can improve their sense of ownership over school life, I am of the opinion that teachers should retain responsibility for setting rules, as they are better placed to protect students' long-term interests.")
        ]
      }
    ]
  },
  {
    id: 'gb2-old-buildings-dbv',
    promptId: 't2-dbv-6',
    steps: [
      {
        id: 'gb2-ob-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('While it is '),
          typ2('t2-dbv-6-i0', 'argue', ['argued'], 'verb-tense', 'passive voice "is + V3" จึงใช้ argued'),
          t2(' by some that old buildings should be '),
          typ2('t2-dbv-6-i1', 'preserve', ['preserved'], 'verb-tense', 'passive voice "should be + V3" จึงใช้ preserved'),
          t2(' rather than '),
          typ2('t2-dbv-6-i2', 'replace', ['replaced'], 'verb-tense', 'ขนานกับ preserved rather than replaced'),
          t2(", others claim that constructing modern buildings better "),
          typ2('t2-dbv-6-i3', 'serve', ['serves'], 'verb-tense', 'ประธาน "constructing modern buildings" เป็นเอกพจน์ จึงใช้ serves'),
          t2(" a city's practical needs. Both points of view will be "),
          typ2('t2-dbv-6-i4', 'elaborate', ['elaborated'], 'verb-tense', 'passive voice "will be + V3" จึงใช้ elaborated'),
          t2(' on before '),
          typ2('t2-dbv-6-i5', 'elaborate', ['elaborating'], 'verb-tense', '"before elaborating on..." ตามด้วย gerund หลัง before'),
          t2(' on the reasons why I believe that preservation should generally be '),
          typ2('t2-dbv-6-i6', 'prioritize', ['prioritized'], 'verb-tense', 'passive voice "should be + V3" จึงใช้ prioritized'),
          t2('.')
        ]
      },
      {
        id: 'gb2-ob-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-dbv-6-b1start', ['To begin with', 'To explain this simply', 'For example'], 'To begin with', '"To begin with" ใช้เปิดย่อหน้าแรกเพื่อเริ่มเหตุผลข้อแรก'),
          t2(', it might seem sensible for some to claim that old buildings should be preserved rather than replaced. '),
          drag2('t2-dbv-6-b1mid', ['To explain this simply', 'To begin with', 'For example'], 'To explain this simply', '"To explain this simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is because these structures '),
          typ2('t2-dbv-6-b1a', 'hold', ['hold'], 'verb-tense', 'ประธาน "structures" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' historical and cultural value that cannot be recreated once '),
          typ2('t2-dbv-6-b1b', 'demolish', ['demolished'], 'verb-tense', 'passive voice "once demolished" — V3 หลัง once'),
          t2('. '),
          drag2('t2-dbv-6-b1c', ['For example', 'To begin with', 'To explain this simply'], 'For example', '"For example" ยกตัวอย่างเมืองเกียวโต'),
          t2(', cities such as Kyoto '),
          typ2('t2-dbv-6-b1d', 'attract', ['attract'], 'verb-tense', 'ประธาน "cities" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' millions of visitors annually largely because of their carefully preserved traditional buildings.')
        ]
      },
      {
        id: 'gb2-ob-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          t2('However, some might argue that '),
          typ2('t2-dbv-6-b2a', 'replace', ['replacing'], 'verb-tense', '"replacing old buildings" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' old buildings with modern ones is the more sensible option. '),
          drag2('t2-dbv-6-b2mid', ['To put it simply', 'However', 'For instance'], 'To put it simply', '"To put it simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is due to the fact that new buildings can be '),
          typ2('t2-dbv-6-b2b', 'design', ['designed'], 'verb-tense', 'passive voice "can be + V3" จึงใช้ designed'),
          t2(' to meet current safety standards and housing demand far more efficiently. '),
          drag2('t2-dbv-6-b2c', ['For instance', 'To put it simply', 'However'], 'For instance', '"For instance" ยกตัวอย่างรายงานของ Mori Memorial Foundation'),
          t2(', a 2020 report by the Mori Memorial Foundation '),
          typ2('t2-dbv-6-b2d', 'find', ['found'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ found'),
          t2(' that redeveloped districts in Tokyo '),
          typ2('t2-dbv-6-b2e', 'increase', ['increased'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ increased'),
          t2(' usable housing space by over 40%.')
        ]
      },
      {
        id: 'gb2-ob-body3',
        role: 'body3',
        labelTh: WGB2_ROLE_LABEL_TH.body3,
        segments: [
          t2('Personally, I would argue in favor of the idea that preservation should generally take priority over redevelopment. My reasoning is that historic buildings, once '),
          typ2('t2-dbv-6-b3a', 'lose', ['lost'], 'verb-tense', 'passive voice "once lost" — V3 หลัง once'),
          t2(', can never be restored to their original form or authenticity. '),
          drag2('t2-dbv-6-b3start', ['To illustrate', 'To put it simply', 'In this respect'], 'To illustrate', '"To illustrate" ยกตัวอย่างไฟไหม้นอเทรอดาม'),
          t2(', the reconstruction efforts following the 2019 Notre-Dame fire in Paris '),
          typ2('t2-dbv-6-b3b', 'cost', ['cost'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ cost'),
          t2(' hundreds of millions of euros yet still could not fully replicate certain original features.')
        ]
      },
      {
        id: 'gb2-ob-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-dbv-6-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that new developments can '),
          typ2('t2-dbv-6-c0', 'address', ['address'], 'verb-tense', 'ขนานกับ can + base verb'),
          t2(' urgent housing and safety needs, I am of the opinion that preserving old buildings should remain the priority, given their irreplaceable cultural value.')
        ]
      }
    ]
  },
  {
    id: 'gb2-international-contacts',
    promptId: 't2-dbv-7',
    steps: [
      {
        id: 'gb2-ic-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('While it is '),
          typ2('t2-dbv-7-i0', 'argue', ['argued'], 'verb-tense', 'passive voice "is + V3" จึงใช้ argued'),
          t2(' by some that growing business and cultural contact between countries is a positive development, others claim that many nations risk '),
          typ2('t2-dbv-7-i1', 'lose', ['losing'], 'verb-tense', '"risk losing" ตามด้วย gerund หลัง risk'),
          t2(' their national identity as a result. Both points of view will be '),
          typ2('t2-dbv-7-i2', 'elaborate', ['elaborated'], 'verb-tense', 'passive voice "will be + V3" จึงใช้ elaborated'),
          t2(' on before '),
          typ2('t2-dbv-7-i3', 'elaborate', ['elaborating'], 'verb-tense', '"before elaborating on..." ตามด้วย gerund หลัง before'),
          t2(' on the reasons why I believe that the benefits of this trend '),
          typ2('t2-dbv-7-i4', 'outweigh', ['outweigh'], 'verb-tense', 'ประธาน "benefits" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' the risks.')
        ]
      },
      {
        id: 'gb2-ic-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-dbv-7-b1start', ['To begin with', 'To explain this simply', 'For example'], 'To begin with', '"To begin with" ใช้เปิดย่อหน้าแรกเพื่อเริ่มเหตุผลข้อแรก'),
          t2(', it might seem sensible for some to claim that increasing international contact is a positive development. '),
          drag2('t2-dbv-7-b1mid', ['To explain this simply', 'To begin with', 'For example'], 'To explain this simply', '"To explain this simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is because closer business and cultural ties '),
          typ2('t2-dbv-7-b1a', 'allow', ['allow'], 'verb-tense', 'ประธาน "ties" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' countries to share knowledge, technology, and economic opportunities more freely. '),
          drag2('t2-dbv-7-b1c', ['For example', 'To begin with', 'To explain this simply'], 'For example', '"For example" ยกตัวอย่างการค้าในสหภาพยุโรป'),
          t2(', trade between European Union member states has '),
          typ2('t2-dbv-7-b1b', 'grow', ['grown'], 'verb-tense', 'present perfect "has + V3" จึงใช้ grown'),
          t2(' substantially since border restrictions were '),
          typ2('t2-dbv-7-b1d', 'reduce', ['reduced'], 'verb-tense', 'passive voice "were + V3" จึงใช้ reduced'),
          t2('.')
        ]
      },
      {
        id: 'gb2-ic-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          t2('However, some might argue that this trend '),
          typ2('t2-dbv-7-b2a', 'threaten', ['threatens'], 'verb-tense', 'ประธาน "trend" เป็นเอกพจน์ จึงใช้ threatens'),
          t2(' the survival of national identity. '),
          drag2('t2-dbv-7-b2mid', ['To put it simply', 'However', 'For instance'], 'To put it simply', '"To put it simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is due to the fact that constant exposure to foreign culture can gradually '),
          typ2('t2-dbv-7-b2b', 'weaken', ['weaken'], 'verb-tense', 'ขนานกับ can + base verb'),
          t2(' traditional customs, languages, and values. '),
          drag2('t2-dbv-7-b2c', ['For instance', 'To put it simply', 'However'], 'For instance', '"For instance" ยกตัวอย่างรายงานของ UNESCO'),
          t2(', a 2017 UNESCO report '),
          typ2('t2-dbv-7-b2d', 'warn', ['warned'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ warned'),
          t2(' that hundreds of minority languages worldwide '),
          typ2('t2-dbv-7-b2e', 'face', ['face'], 'verb-tense', 'ประธาน "languages" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' extinction due to the dominance of globally spoken languages.')
        ]
      },
      {
        id: 'gb2-ic-body3',
        role: 'body3',
        labelTh: WGB2_ROLE_LABEL_TH.body3,
        segments: [
          t2('Personally, I would argue in favor of the idea that the benefits of international contact outweigh the risks to national identity. My reasoning is that most countries continue to actively '),
          typ2('t2-dbv-7-b3a', 'protect', ['protect'], 'verb-tense', 'ประธาน "countries" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' their traditions through education and cultural policy despite growing global exchange. '),
          drag2('t2-dbv-7-b3start', ['To illustrate', 'To put it simply', 'In this respect'], 'To illustrate', '"To illustrate" ยกตัวอย่างเกาหลีใต้'),
          t2(', South Korea has '),
          typ2('t2-dbv-7-b3b', 'combine', ['combined'], 'verb-tense', 'present perfect "has + V3" จึงใช้ combined'),
          t2(' rapid international business expansion with strong government support for traditional arts, which remain widely '),
          typ2('t2-dbv-7-b3c', 'practice', ['practiced'], 'verb-tense', 'passive voice "remain + V3" จึงใช้ practiced'),
          t2(' today.')
        ]
      },
      {
        id: 'gb2-ic-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-dbv-7-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that some erosion of local culture may '),
          typ2('t2-dbv-7-c0', 'occur', ['occur'], 'verb-tense', 'ขนานกับ may + base verb'),
          t2(', I am of the opinion that the economic and social benefits of international contact make it a positive development overall.')
        ]
      }
    ]
  },
  {
    id: 'gb2-hotels-vs-holiday-homes',
    promptId: 't2-dbv-8',
    steps: [
      {
        id: 'gb2-hh-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('While it is '),
          typ2('t2-dbv-8-i0', 'argue', ['argued'], 'verb-tense', 'passive voice "is + V3" จึงใช้ argued'),
          t2(' by some that '),
          typ2('t2-dbv-8-i1', 'stay', ['staying'], 'verb-tense', '"staying in hotels" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' in hotels is the best option when travelling, others claim that '),
          typ2('t2-dbv-8-i2', 'rent', ['renting'], 'verb-tense', '"renting holiday homes" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' holiday homes offers a better experience. Both points of view will be '),
          typ2('t2-dbv-8-i3', 'elaborate', ['elaborated'], 'verb-tense', 'passive voice "will be + V3" จึงใช้ elaborated'),
          t2(' on before '),
          typ2('t2-dbv-8-i4', 'elaborate', ['elaborating'], 'verb-tense', '"before elaborating on..." ตามด้วย gerund หลัง before'),
          t2(' on the reasons why I believe that holiday homes are generally the wiser choice.')
        ]
      },
      {
        id: 'gb2-hh-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-dbv-8-b1start', ['To begin with', 'To explain this simply', 'For example'], 'To begin with', '"To begin with" ใช้เปิดย่อหน้าแรกเพื่อเริ่มเหตุผลข้อแรก'),
          t2(', it might seem sensible for some to claim that hotels '),
          typ2('t2-dbv-8-b1a', 'be', ['are'], 'verb-tense', 'ประธาน "hotels" เป็นพหูพจน์ จึงใช้ are'),
          t2(' the more convenient option for travellers. '),
          drag2('t2-dbv-8-b1mid', ['To explain this simply', 'To begin with', 'For example'], 'To explain this simply', '"To explain this simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is because hotels typically '),
          typ2('t2-dbv-8-b1b', 'provide', ['provide'], 'verb-tense', 'ประธาน "hotels" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' professional staff, daily cleaning, and on-site facilities such as restaurants and gyms. '),
          drag2('t2-dbv-8-b1c', ['For example', 'To begin with', 'To explain this simply'], 'For example', '"For example" ยกตัวอย่างเครือโรงแรม Marriott'),
          t2(', major hotel chains like Marriott '),
          typ2('t2-dbv-8-b1d', 'offer', ['offer'], 'verb-tense', 'ประธาน "chains" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' round-the-clock guest services that many independent holiday rentals simply cannot match.')
        ]
      },
      {
        id: 'gb2-hh-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          t2('However, some might argue that '),
          typ2('t2-dbv-8-b2a', 'rent', ['renting'], 'verb-tense', '"renting a holiday home" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' a holiday home provides a more rewarding travel experience. '),
          drag2('t2-dbv-8-b2mid', ['To put it simply', 'However', 'For instance'], 'To put it simply', '"To put it simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is due to the fact that holiday homes usually '),
          typ2('t2-dbv-8-b2b', 'offer', ['offer'], 'verb-tense', 'ประธาน "holiday homes" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' more space, privacy, and the chance to live like a local resident. '),
          drag2('t2-dbv-8-b2c', ['For instance', 'To put it simply', 'However'], 'For instance', '"For instance" ยกตัวอย่างผลสำรวจของ Airbnb'),
          t2(', a 2021 survey by Airbnb '),
          typ2('t2-dbv-8-b2d', 'find', ['found'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ found'),
          t2(' that over 60% of guests '),
          typ2('t2-dbv-8-b2e', 'choose', ['chose'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ chose'),
          t2(' holiday rentals specifically to experience neighbourhoods that typical hotels do not reach.')
        ]
      },
      {
        id: 'gb2-hh-body3',
        role: 'body3',
        labelTh: WGB2_ROLE_LABEL_TH.body3,
        segments: [
          t2('Personally, I would argue in favor of the idea that holiday homes are generally the better accommodation choice. My reasoning is that they '),
          typ2('t2-dbv-8-b3a', 'allow', ['allow'], 'verb-tense', 'ประธาน "they" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' travellers, particularly families, to save money on meals by '),
          typ2('t2-dbv-8-b3b', 'use', ['using'], 'verb-tense', '"by using a kitchen" ตามด้วย gerund หลัง by'),
          t2(' a kitchen while enjoying considerably more living space. '),
          drag2('t2-dbv-8-b3start', ['To illustrate', 'To put it simply', 'In this respect'], 'To illustrate', '"To illustrate" ยกตัวอย่างครอบครัวที่บาร์เซโลนา'),
          t2(', a family of four '),
          typ2('t2-dbv-8-b3c', 'rent', ['renting'], 'verb-tense', '"a family...renting an apartment" — V-ing ทำหน้าที่คุณศัพท์ขยาย family'),
          t2(' an apartment in Barcelona can often pay less than the cost of two separate hotel rooms while '),
          typ2('t2-dbv-8-b3d', 'gain', ['gaining'], 'verb-tense', '"while gaining a full kitchen" ตามด้วย gerund หลัง while'),
          t2(' a full kitchen and living area.')
        ]
      },
      {
        id: 'gb2-hh-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-dbv-8-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that hotels '),
          typ2('t2-dbv-8-c0', 'offer', ['offer'], 'verb-tense', 'ประธาน "hotels" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' valuable convenience and professional service, I am of the opinion that holiday homes provide better overall value for most travellers.')
        ]
      }
    ]
  },
  {
    id: 'gb2-homework-alone-vs-parents',
    promptId: 't2-dbv-9',
    steps: [
      {
        id: 'gb2-hw-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('While it is '),
          typ2('t2-dbv-9-i0', 'argue', ['argued'], 'verb-tense', 'passive voice "is + V3" จึงใช้ argued'),
          t2(' by some that students should '),
          typ2('t2-dbv-9-i1', 'complete', ['complete'], 'verb-tense', 'ขนานกับ should + base verb'),
          t2(' homework independently, others claim that parents should actively '),
          typ2('t2-dbv-9-i2', 'help', ['help'], 'verb-tense', 'ขนานกับ should + base verb'),
          t2(' their children with it. Both points of view will be '),
          typ2('t2-dbv-9-i3', 'elaborate', ['elaborated'], 'verb-tense', 'passive voice "will be + V3" จึงใช้ elaborated'),
          t2(' on before '),
          typ2('t2-dbv-9-i4', 'elaborate', ['elaborating'], 'verb-tense', '"before elaborating on..." ตามด้วย gerund หลัง before'),
          t2(' on the reasons why I believe that independent homework '),
          typ2('t2-dbv-9-i5', 'bring', ['brings'], 'verb-tense', 'ประธาน "independent homework" เป็นเอกพจน์ จึงใช้ brings'),
          t2(' greater long-term benefits.')
        ]
      },
      {
        id: 'gb2-hw-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-dbv-9-b1start', ['To begin with', 'To explain this simply', 'For example'], 'To begin with', '"To begin with" ใช้เปิดย่อหน้าแรกเพื่อเริ่มเหตุผลข้อแรก'),
          t2(', it might seem sensible for some to claim that parents should help their children with homework. '),
          drag2('t2-dbv-9-b1mid', ['To explain this simply', 'To begin with', 'For example'], 'To explain this simply', '"To explain this simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is because parental involvement can quickly '),
          typ2('t2-dbv-9-b1a', 'clear', ['clear'], 'verb-tense', 'ขนานกับ can + base verb'),
          t2(' up confusion and '),
          typ2('t2-dbv-9-b1b', 'prevent', ['prevent'], 'verb-tense', 'ขนานกับ can + base verb'),
          t2(' children from '),
          typ2('t2-dbv-9-b1c', 'develop', ['developing'], 'verb-tense', '"prevent...from developing" ตามด้วย gerund หลัง from'),
          t2(' frustration over difficult subjects. '),
          drag2('t2-dbv-9-b1d', ['For example', 'To begin with', 'To explain this simply'], 'For example', '"For example" ยกตัวอย่างผู้ปกครองในสิงคโปร์'),
          t2(', many parents in Singapore regularly '),
          typ2('t2-dbv-9-b1e', 'guide', ['guide'], 'verb-tense', 'ประธาน "parents" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' their children through mathematics homework to reinforce concepts taught earlier that day.')
        ]
      },
      {
        id: 'gb2-hw-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          t2('However, some might argue that students should complete homework entirely on their own. '),
          drag2('t2-dbv-9-b2mid', ['To put it simply', 'However', 'For instance'], 'To put it simply', '"To put it simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is due to the fact that '),
          typ2('t2-dbv-9-b2a', 'work', ['working'], 'verb-tense', '"working independently" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' independently forces students to '),
          typ2('t2-dbv-9-b2b', 'develop', ['develop'], 'verb-tense', 'ขนานกับ to + base verb'),
          t2(' problem-solving skills and self-discipline that constant assistance cannot provide. '),
          drag2('t2-dbv-9-b2c', ['For instance', 'To put it simply', 'However'], 'For instance', '"For instance" ยกตัวอย่างงานวิจัยปี 2016'),
          t2(', a 2016 study published in the Journal of Educational Psychology '),
          typ2('t2-dbv-9-b2d', 'find', ['found'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ found'),
          t2(' that students who completed homework unaided '),
          typ2('t2-dbv-9-b2e', 'show', ['showed'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ showed'),
          t2(' stronger long-term retention of material.')
        ]
      },
      {
        id: 'gb2-hw-body3',
        role: 'body3',
        labelTh: WGB2_ROLE_LABEL_TH.body3,
        segments: [
          t2('Personally, I would argue in favor of the idea that independent homework offers the greater long-term benefit. My reasoning is that children who struggle through problems alone '),
          typ2('t2-dbv-9-b3a', 'learn', ['learn'], 'verb-tense', 'ประธาน "children" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' to manage setbacks, a skill essential for success far beyond the classroom. '),
          drag2('t2-dbv-9-b3start', ['To illustrate', 'To put it simply', 'In this respect'], 'To illustrate', '"To illustrate" ยกตัวอย่างนักศึกษามหาวิทยาลัย'),
          t2(', university students who '),
          typ2('t2-dbv-9-b3b', 'receive', ['received'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ received'),
          t2(' little parental help with homework as children often report '),
          typ2('t2-dbv-9-b3c', 'adapt', ['adapting'], 'verb-tense', '"report adapting..." ตามด้วย gerund หลัง report'),
          t2(' more easily to independent study without supervision.')
        ]
      },
      {
        id: 'gb2-hw-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-dbv-9-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that parental support can '),
          typ2('t2-dbv-9-c0', 'ease', ['ease'], 'verb-tense', 'ขนานกับ can + base verb'),
          t2(' short-term academic pressure, I am of the opinion that '),
          typ2('t2-dbv-9-c1', 'allow', ['allowing'], 'verb-tense', '"allowing children to complete..." เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' children to complete homework independently builds more valuable lifelong skills.')
        ]
      }
    ]
  },
  {
    id: 'gb2-salary-vs-environment',
    promptId: 't2-dbv-10',
    steps: [
      {
        id: 'gb2-se-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('While it is '),
          typ2('t2-dbv-10-i0', 'argue', ['argued'], 'verb-tense', 'passive voice "is + V3" จึงใช้ argued'),
          t2(' by some that a high salary is the most important factor when '),
          typ2('t2-dbv-10-i1', 'choose', ['choosing'], 'verb-tense', '"when choosing an employer" ตามด้วย gerund หลัง when'),
          t2(' an employer, others claim that a positive working environment matters more. Both points of view will be '),
          typ2('t2-dbv-10-i2', 'elaborate', ['elaborated'], 'verb-tense', 'passive voice "will be + V3" จึงใช้ elaborated'),
          t2(' on before '),
          typ2('t2-dbv-10-i3', 'elaborate', ['elaborating'], 'verb-tense', '"before elaborating on..." ตามด้วย gerund หลัง before'),
          t2(' on the reasons why I believe that a positive workplace ultimately '),
          typ2('t2-dbv-10-i4', 'matter', ['matters'], 'verb-tense', 'ประธาน "workplace" เป็นเอกพจน์ จึงใช้ matters'),
          t2(' most.')
        ]
      },
      {
        id: 'gb2-se-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-dbv-10-b1start', ['To begin with', 'To explain this simply', 'For example'], 'To begin with', '"To begin with" ใช้เปิดย่อหน้าแรกเพื่อเริ่มเหตุผลข้อแรก'),
          t2(', it might seem sensible for some to claim that a high salary should be the deciding factor when choosing an employer. '),
          drag2('t2-dbv-10-b1mid', ['To explain this simply', 'To begin with', 'For example'], 'To explain this simply', '"To explain this simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is because greater income '),
          typ2('t2-dbv-10-b1a', 'allow', ['allows'], 'verb-tense', 'ประธาน "income" เป็นเอกพจน์ จึงใช้ allows'),
          t2(' employees to meet financial needs and '),
          typ2('t2-dbv-10-b1b', 'achieve', ['achieve'], 'verb-tense', 'ขนานกับ to + base verb'),
          t2(' a more comfortable standard of living. '),
          drag2('t2-dbv-10-b1c', ['For example', 'To begin with', 'To explain this simply'], 'For example', '"For example" ยกตัวอย่างบัณฑิตสายการเงิน'),
          t2(', many graduates in finance '),
          typ2('t2-dbv-10-b1d', 'accept', ['accept'], 'verb-tense', 'ประธาน "graduates" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' demanding roles at investment banks specifically because of the exceptionally high starting salaries '),
          typ2('t2-dbv-10-b1e', 'offer', ['offered'], 'verb-tense', 'passive/participle "salaries offered" — V3 ทำหน้าที่คุณศัพท์ขยาย salaries'),
          t2('.')
        ]
      },
      {
        id: 'gb2-se-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          t2('However, some might argue that a positive working environment is more important than pay. '),
          drag2('t2-dbv-10-b2mid', ['To put it simply', 'However', 'For instance'], 'To put it simply', '"To put it simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is due to the fact that supportive colleagues and manageable workloads directly '),
          typ2('t2-dbv-10-b2a', 'affect', ['affect'], 'verb-tense', 'ประธาน "colleagues and workloads" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(" an employee's happiness and long-term motivation. "),
          drag2('t2-dbv-10-b2c', ['For instance', 'To put it simply', 'However'], 'For instance', '"For instance" ยกตัวอย่างผลสำรวจของ Gallup'),
          t2(', a 2019 Gallup workplace study '),
          typ2('t2-dbv-10-b2b', 'find', ['found'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ found'),
          t2(' that employees who rated their workplace culture highly '),
          typ2('t2-dbv-10-b2d', 'be', ['were'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ were'),
          t2(' far less likely to leave their jobs within a year.')
        ]
      },
      {
        id: 'gb2-se-body3',
        role: 'body3',
        labelTh: WGB2_ROLE_LABEL_TH.body3,
        segments: [
          t2('Personally, I would argue in favor of the idea that a positive working environment matters more than salary alone. My reasoning is that even a generous salary cannot '),
          typ2('t2-dbv-10-b3a', 'compensate', ['compensate'], 'verb-tense', 'ขนานกับ cannot + base verb'),
          t2(' for constant stress, unclear expectations, or poor management over time. '),
          drag2('t2-dbv-10-b3start', ['To illustrate', 'To put it simply', 'In this respect'], 'To illustrate', '"To illustrate" ยกตัวอย่างบริษัท Google'),
          t2(', technology companies such as Google have long '),
          typ2('t2-dbv-10-b3b', 'attract', ['attracted'], 'verb-tense', 'present perfect "have + V3" จึงใช้ attracted'),
          t2(' top talent partly because of their supportive workplace culture rather than salary alone.')
        ]
      },
      {
        id: 'gb2-se-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-dbv-10-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that a high salary '),
          typ2('t2-dbv-10-c0', 'provide', ['provides'], 'verb-tense', 'ประธาน "salary" เป็นเอกพจน์ จึงใช้ provides'),
          t2(' essential financial security, I am of the opinion that a positive working environment matters more for long-term job satisfaction.')
        ]
      }
    ]
  },
  {
    id: 'gb2-childrens-life-past-present',
    promptId: 't2-dbv-11',
    steps: [
      {
        id: 'gb2-cl-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('While it is '),
          typ2('t2-dbv-11-i0', 'argue', ['argued'], 'verb-tense', 'passive voice "is + V3" จึงใช้ argued'),
          t2(' by some that children in the past '),
          typ2('t2-dbv-11-i1', 'have', ['had'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ had'),
          t2(' an easier life, others claim that children today actually '),
          typ2('t2-dbv-11-i2', 'enjoy', ['enjoy'], 'verb-tense', 'ประธาน "children" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' greater advantages. Both points of view will be '),
          typ2('t2-dbv-11-i3', 'elaborate', ['elaborated'], 'verb-tense', 'passive voice "will be + V3" จึงใช้ elaborated'),
          t2(' on before '),
          typ2('t2-dbv-11-i4', 'elaborate', ['elaborating'], 'verb-tense', '"before elaborating on..." ตามด้วย gerund หลัง before'),
          t2(' on the reasons why I believe that children today generally '),
          typ2('t2-dbv-11-i5', 'have', ['have'], 'verb-tense', 'ประธาน "children" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' it easier.')
        ]
      },
      {
        id: 'gb2-cl-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-dbv-11-b1start', ['To begin with', 'To explain this simply', 'For example'], 'To begin with', '"To begin with" ใช้เปิดย่อหน้าแรกเพื่อเริ่มเหตุผลข้อแรก'),
          t2(', it might seem sensible for some to claim that children in the past '),
          typ2('t2-dbv-11-b1a', 'experience', ['experienced'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ experienced'),
          t2(' an easier life. '),
          drag2('t2-dbv-11-b1mid', ['To explain this simply', 'To begin with', 'For example'], 'To explain this simply', '"To explain this simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is because past generations '),
          typ2('t2-dbv-11-b1b', 'face', ['faced'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ faced'),
          t2(' fewer academic pressures and '),
          typ2('t2-dbv-11-b1c', 'enjoy', ['enjoyed'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ enjoyed'),
          t2(' more unstructured outdoor play with neighbourhood friends. '),
          drag2('t2-dbv-11-b1d', ['For example', 'To begin with', 'To explain this simply'], 'For example', '"For example" ยกตัวอย่างผู้ใหญ่ที่เติบโตในยุค 1970s'),
          t2(', many adults who grew up in the 1970s '),
          typ2('t2-dbv-11-b1e', 'recall', ['recall'], 'verb-tense', 'ประธาน "adults" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' spending entire afternoons playing outside without any scheduled activities.')
        ]
      },
      {
        id: 'gb2-cl-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          t2('However, some might argue that children today '),
          typ2('t2-dbv-11-b2a', 'have', ['have'], 'verb-tense', 'ประธาน "children" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' an easier life than previous generations. '),
          drag2('t2-dbv-11-b2mid', ['To put it simply', 'However', 'For instance'], 'To put it simply', '"To put it simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is due to the fact that modern children '),
          typ2('t2-dbv-11-b2b', 'benefit', ['benefit'], 'verb-tense', 'ประธาน "children" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' from far greater access to healthcare, education, and technology than their parents or grandparents '),
          typ2('t2-dbv-11-b2c', 'do', ['did'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ did'),
          t2('. '),
          drag2('t2-dbv-11-b2d', ['For instance', 'To put it simply', 'However'], 'For instance', '"For instance" ยกตัวอย่างข้อมูลของ UNICEF'),
          t2(', global child mortality rates have '),
          typ2('t2-dbv-11-b2e', 'fall', ['fallen'], 'verb-tense', 'present perfect "have + V3" จึงใช้ fallen'),
          t2(' by more than half since 1990, according to UNICEF data.')
        ]
      },
      {
        id: 'gb2-cl-body3',
        role: 'body3',
        labelTh: WGB2_ROLE_LABEL_TH.body3,
        segments: [
          t2("Personally, I would argue in favor of the idea that children today generally enjoy an easier life overall. My reasoning is that today's children can "),
          typ2('t2-dbv-11-b3a', 'access', ['access'], 'verb-tense', 'ขนานกับ can + base verb'),
          t2(' vast educational resources instantly, something previous generations could only dream of. '),
          drag2('t2-dbv-11-b3start', ['To illustrate', 'To put it simply', 'In this respect'], 'To illustrate', '"To illustrate" ยกตัวอย่างนักเรียนในหมู่บ้านชนบท'),
          t2(', a student in a rural village can now '),
          typ2('t2-dbv-11-b3b', 'use', ['use'], 'verb-tense', 'ขนานกับ can + base verb'),
          t2(' a smartphone to watch free university lectures from institutions such as MIT.')
        ]
      },
      {
        id: 'gb2-cl-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-dbv-11-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(", although it is undeniable that today's children "),
          typ2('t2-dbv-11-c0', 'face', ['face'], 'verb-tense', 'ประธาน "children" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' new pressures such as academic competition and social media, I am of the opinion that children today ultimately have an easier life thanks to modern healthcare and education.')
        ]
      }
    ]
  },
  {
    id: 'gb2-public-libraries',
    promptId: 't2-dbv-12',
    steps: [
      {
        id: 'gb2-pl-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('While it is '),
          typ2('t2-dbv-12-i0', 'argue', ['argued'], 'verb-tense', 'passive voice "is + V3" จึงใช้ argued'),
          t2(' by some that governments should '),
          typ2('t2-dbv-12-i1', 'establish', ['establish'], 'verb-tense', 'ขนานกับ should + base verb'),
          t2(' free public libraries in every city, others claim that this would be a wasteful use of public funds. Both points of view will be '),
          typ2('t2-dbv-12-i2', 'elaborate', ['elaborated'], 'verb-tense', 'passive voice "will be + V3" จึงใช้ elaborated'),
          t2(' on before '),
          typ2('t2-dbv-12-i3', 'elaborate', ['elaborating'], 'verb-tense', '"before elaborating on..." ตามด้วย gerund หลัง before'),
          t2(' on the reasons why I believe that '),
          typ2('t2-dbv-12-i4', 'fund', ['funding'], 'verb-tense', '"funding free libraries" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' free libraries remains a worthwhile investment.')
        ]
      },
      {
        id: 'gb2-pl-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-dbv-12-b1start', ['To begin with', 'To explain this simply', 'For example'], 'To begin with', '"To begin with" ใช้เปิดย่อหน้าแรกเพื่อเริ่มเหตุผลข้อแรก'),
          t2(', it might seem sensible for some to claim that governments should '),
          typ2('t2-dbv-12-b1a', 'provide', ['provide'], 'verb-tense', 'ขนานกับ should + base verb'),
          t2(' free public libraries in every city. '),
          drag2('t2-dbv-12-b1mid', ['To explain this simply', 'To begin with', 'For example'], 'To explain this simply', '"To explain this simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is because libraries '),
          typ2('t2-dbv-12-b1b', 'give', ['give'], 'verb-tense', 'ประธาน "libraries" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' every resident, regardless of income, equal access to books, computers, and quiet study spaces. '),
          drag2('t2-dbv-12-b1c', ['For example', 'To begin with', 'To explain this simply'], 'For example', '"For example" ยกตัวอย่างห้องสมุดในฟินแลนด์'),
          t2(', public libraries across Finland '),
          typ2('t2-dbv-12-b1d', 'offer', ['offer'], 'verb-tense', 'ประธาน "libraries" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' free internet access and study rooms that are heavily '),
          typ2('t2-dbv-12-b1e', 'use', ['used'], 'verb-tense', 'passive voice "are + V3" จึงใช้ used'),
          t2(' by students and job seekers alike.')
        ]
      },
      {
        id: 'gb2-pl-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          t2('However, some might argue that '),
          typ2('t2-dbv-12-b2a', 'build', ['building'], 'verb-tense', '"building free libraries" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' free libraries in every city '),
          typ2('t2-dbv-12-b2b', 'waste', ['wastes'], 'verb-tense', 'ประธาน "building free libraries" เป็นเอกพจน์ จึงใช้ wastes'),
          t2(' government money. '),
          drag2('t2-dbv-12-b2mid', ['To put it simply', 'However', 'For instance'], 'To put it simply', '"To put it simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is due to the fact that most information is now freely available online, '),
          typ2('t2-dbv-12-b2c', 'make', ['making'], 'verb-tense', '"making costly physical library buildings..." เป็น participle phrase ขยายประโยคหลัก'),
          t2(' costly physical library buildings increasingly unnecessary. '),
          drag2('t2-dbv-12-b2d', ['For instance', 'To put it simply', 'However'], 'For instance', '"For instance" ยกตัวอย่างรายงานปี 2018'),
          t2(', a 2018 report '),
          typ2('t2-dbv-12-b2e', 'note', ['noted'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ noted'),
          t2(' that public library visits in several major American cities had '),
          typ2('t2-dbv-12-b2f', 'decline', ['declined'], 'verb-tense', 'past perfect "had + V3" จึงใช้ declined'),
          t2(' by nearly 20% over the previous decade.')
        ]
      },
      {
        id: 'gb2-pl-body3',
        role: 'body3',
        labelTh: WGB2_ROLE_LABEL_TH.body3,
        segments: [
          t2('Personally, I would argue in favor of the idea that free public libraries remain a worthwhile government investment. My reasoning is that libraries '),
          typ2('t2-dbv-12-b3a', 'serve', ['serve'], 'verb-tense', 'ประธาน "libraries" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' elderly residents and low-income families who often '),
          typ2('t2-dbv-12-b3b', 'lack', ['lack'], 'verb-tense', 'ประธาน "families" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' reliable internet access or personal devices at home. '),
          drag2('t2-dbv-12-b3start', ['To illustrate', 'To put it simply', 'In this respect'], 'To illustrate', '"To illustrate" ยกตัวอย่างห้องสมุดชุมชนในสหราชอาณาจักร'),
          t2(', community libraries in rural areas of the UK continue to '),
          typ2('t2-dbv-12-b3c', 'host', ['host'], 'verb-tense', 'ขนานกับ to + base verb'),
          t2(' free digital literacy classes for residents who cannot otherwise get online.')
        ]
      },
      {
        id: 'gb2-pl-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-dbv-12-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that online information has '),
          typ2('t2-dbv-12-c0', 'reduce', ['reduced'], 'verb-tense', 'present perfect "has + V3" จึงใช้ reduced'),
          t2(' some demand for physical libraries, I am of the opinion that governments should continue funding them to support disadvantaged communities.')
        ]
      }
    ]
  },
  {
    id: 'gb2-parents-vs-tv-friends',
    promptId: 't2-dbv-13',
    steps: [
      {
        id: 'gb2-pf-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('While it is '),
          typ2('t2-dbv-13-i0', 'argue', ['argued'], 'verb-tense', 'passive voice "is + V3" จึงใช้ argued'),
          t2(" by some that parents have the most important role in a child's development, others claim that outside influences such as television and friends "),
          typ2('t2-dbv-13-i1', 'matter', ['matter'], 'verb-tense', 'ประธาน "influences" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' more. Both points of view will be '),
          typ2('t2-dbv-13-i2', 'elaborate', ['elaborated'], 'verb-tense', 'passive voice "will be + V3" จึงใช้ elaborated'),
          t2(' on before '),
          typ2('t2-dbv-13-i3', 'elaborate', ['elaborating'], 'verb-tense', '"before elaborating on..." ตามด้วย gerund หลัง before'),
          t2(' on the reasons why I believe that parents remain the most influential factor.')
        ]
      },
      {
        id: 'gb2-pf-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-dbv-13-b1start', ['To begin with', 'To explain this simply', 'For example'], 'To begin with', '"To begin with" ใช้เปิดย่อหน้าแรกเพื่อเริ่มเหตุผลข้อแรก'),
          t2(', it might seem sensible for some to claim that outside influences such as television and friends '),
          typ2('t2-dbv-13-b1a', 'shape', ['shape'], 'verb-tense', 'ประธาน "influences" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' children more than parents '),
          typ2('t2-dbv-13-b1b', 'do', ['do'], 'verb-tense', 'ประธาน "parents" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2('. '),
          drag2('t2-dbv-13-b1mid', ['To explain this simply', 'To begin with', 'For example'], 'To explain this simply', '"To explain this simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is because children '),
          typ2('t2-dbv-13-b1c', 'spend', ['spend'], 'verb-tense', 'ประธาน "children" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' a considerable amount of time '),
          typ2('t2-dbv-13-b1d', 'consume', ['consuming'], 'verb-tense', '"spend time consuming..." ตามด้วย gerund หลัง spend time'),
          t2(' media and '),
          typ2('t2-dbv-13-b1e', 'interact', ['interacting'], 'verb-tense', 'ขนานกับ consuming...interacting'),
          t2(' with peers outside parental supervision. '),
          drag2('t2-dbv-13-b1f', ['For example', 'To begin with', 'To explain this simply'], 'For example', '"For example" ยกตัวอย่างรายงานของ Ofcom'),
          t2(', a 2020 Ofcom report '),
          typ2('t2-dbv-13-b1g', 'find', ['found'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ found'),
          t2(' that children in the UK aged eight to eleven '),
          typ2('t2-dbv-13-b1h', 'spend', ['spend'], 'verb-tense', 'ประธาน "children" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' over 13 hours per week watching online video content.')
        ]
      },
      {
        id: 'gb2-pf-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          t2("However, some might argue that parents remain the most important influence on a child's development. "),
          drag2('t2-dbv-13-b2mid', ['To put it simply', 'However', 'For instance'], 'To put it simply', '"To put it simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(", this is due to the fact that parents "),
          typ2('t2-dbv-13-b2a', 'shape', ['shape'], 'verb-tense', 'ประธาน "parents" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(" a child's earliest values, habits, and emotional security long before outside influences "),
          typ2('t2-dbv-13-b2b', 'take', ['take'], 'verb-tense', 'ประธาน "influences" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' hold. '),
          drag2('t2-dbv-13-b2c', ['For instance', 'To put it simply', 'However'], 'For instance', '"For instance" ยกตัวอย่างงานวิจัยด้านพัฒนาการ'),
          t2(', children raised in emotionally supportive households consistently '),
          typ2('t2-dbv-13-b2d', 'show', ['show'], 'verb-tense', 'ประธาน "children" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' stronger academic and social outcomes according to long-term developmental research.')
        ]
      },
      {
        id: 'gb2-pf-body3',
        role: 'body3',
        labelTh: WGB2_ROLE_LABEL_TH.body3,
        segments: [
          t2('Personally, I would argue in favor of the idea that parents remain the most significant influence on child development. My reasoning is that parents largely '),
          typ2('t2-dbv-13-b3a', 'control', ['control'], 'verb-tense', 'ประธาน "parents" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' which friends, schools, and media their children are '),
          typ2('t2-dbv-13-b3b', 'expose', ['exposed'], 'verb-tense', 'passive voice "are + V3" จึงใช้ exposed'),
          t2(' to during formative years. '),
          drag2('t2-dbv-13-b3start', ['To illustrate', 'To put it simply', 'In this respect'], 'To illustrate', '"To illustrate" ยกตัวอย่างผู้ปกครองที่จำกัดเวลาหน้าจอ'),
          t2(', parents who actively '),
          typ2('t2-dbv-13-b3c', 'limit', ['limit'], 'verb-tense', 'ประธาน "parents" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' screen time and '),
          typ2('t2-dbv-13-b3d', 'encourage', ['encourage'], 'verb-tense', 'ขนานกับ limit...encourage'),
          t2(' reading often raise children with noticeably stronger language skills by primary school age.')
        ]
      },
      {
        id: 'gb2-pf-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-dbv-13-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that television and friends increasingly '),
          typ2('t2-dbv-13-c0', 'shape', ['shape'], 'verb-tense', 'ประธาน "television and friends" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2("  children's attitudes, I am of the opinion that parents remain the single most important influence on a child's development.")
        ]
      }
    ]
  },
  {
    id: 'gb2-dangerous-sports',
    promptId: 't2-dbv-14',
    steps: [
      {
        id: 'gb2-ds-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('While it is '),
          typ2('t2-dbv-14-i0', 'argue', ['argued'], 'verb-tense', 'passive voice "is + V3" จึงใช้ argued'),
          t2(' by some that dangerous sports should be '),
          typ2('t2-dbv-14-i1', 'ban', ['banned'], 'verb-tense', 'passive voice "should be + V3" จึงใช้ banned'),
          t2(', others claim that people should remain free to '),
          typ2('t2-dbv-14-i2', 'choose', ['choose'], 'verb-tense', 'ขนานกับ to + base verb'),
          t2(' which sports they play. Both points of view will be '),
          typ2('t2-dbv-14-i3', 'elaborate', ['elaborated'], 'verb-tense', 'passive voice "will be + V3" จึงใช้ elaborated'),
          t2(' on before '),
          typ2('t2-dbv-14-i4', 'elaborate', ['elaborating'], 'verb-tense', '"before elaborating on..." ตามด้วย gerund หลัง before'),
          t2(' on the reasons why I believe that personal freedom should ultimately be '),
          typ2('t2-dbv-14-i5', 'protect', ['protected'], 'verb-tense', 'passive voice "should be + V3" จึงใช้ protected'),
          t2('.')
        ]
      },
      {
        id: 'gb2-ds-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-dbv-14-b1start', ['To begin with', 'To explain this simply', 'For example'], 'To begin with', '"To begin with" ใช้เปิดย่อหน้าแรกเพื่อเริ่มเหตุผลข้อแรก'),
          t2(', it might seem sensible for some to claim that dangerous sports should be banned altogether. '),
          drag2('t2-dbv-14-b1mid', ['To explain this simply', 'To begin with', 'For example'], 'To explain this simply', '"To explain this simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is because high-risk activities such as base jumping or free solo climbing '),
          typ2('t2-dbv-14-b1a', 'carry', ['carry'], 'verb-tense', 'ประธาน "activities" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' a genuine risk of severe injury or death. '),
          drag2('t2-dbv-14-b1b', ['For example', 'To begin with', 'To explain this simply'], 'For example', '"For example" ยกตัวอย่างทีมกู้ภัยในเทือกเขาแอลป์'),
          t2(', mountain rescue teams in the Swiss Alps '),
          typ2('t2-dbv-14-b1c', 'respond', ['respond'], 'verb-tense', 'ประธาน "teams" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' to hundreds of extreme sports accidents every year.')
        ]
      },
      {
        id: 'gb2-ds-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          t2('However, some might argue that people should be free to '),
          typ2('t2-dbv-14-b2a', 'choose', ['choose'], 'verb-tense', 'ขนานกับ to + base verb'),
          t2(' whichever sports they wish to play. '),
          drag2('t2-dbv-14-b2mid', ['To put it simply', 'However', 'For instance'], 'To put it simply', '"To put it simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is due to the fact that adults '),
          typ2('t2-dbv-14-b2b', 'be', ['are'], 'verb-tense', 'ประธาน "adults" เป็นพหูพจน์ จึงใช้ are'),
          t2(' capable of assessing personal risk and should not have that choice removed by the state. '),
          drag2('t2-dbv-14-b2c', ['For instance', 'To put it simply', 'However'], 'For instance', '"For instance" ยกตัวอย่างมวยสากลอาชีพ'),
          t2(', professional boxing remains legal in most countries despite its well-documented health risks, '),
          typ2('t2-dbv-14-b2d', 'reflect', ['reflecting'], 'verb-tense', '"reflecting respect for..." เป็น participle phrase ขยายประโยคหลัก'),
          t2(' respect for individual choice.')
        ]
      },
      {
        id: 'gb2-ds-body3',
        role: 'body3',
        labelTh: WGB2_ROLE_LABEL_TH.body3,
        segments: [
          t2("Personally, I would argue in favor of the idea that personal freedom to choose one's sport should be protected. My reasoning is that "),
          typ2('t2-dbv-14-b3a', 'ban', ['banning'], 'verb-tense', '"banning dangerous sports" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' dangerous sports rarely '),
          typ2('t2-dbv-14-b3b', 'eliminate', ['eliminates'], 'verb-tense', 'ประธาน "banning dangerous sports" เป็นเอกพจน์ จึงใช้ eliminates'),
          t2(' the activity but instead '),
          typ2('t2-dbv-14-b3c', 'push', ['pushes'], 'verb-tense', 'ประธาน "banning dangerous sports" เป็นเอกพจน์ จึงใช้ pushes'),
          t2(' participants toward unregulated and less safe alternatives. '),
          drag2('t2-dbv-14-b3start', ['To illustrate', 'To put it simply', 'In this respect'], 'To illustrate', '"To illustrate" ยกตัวอย่างประเทศที่จำกัดกีฬาผาดโผน'),
          t2(', countries that heavily restrict extreme sports often see enthusiasts '),
          typ2('t2-dbv-14-b3d', 'travel', ['travel'], 'verb-tense', '"see enthusiasts travel" — bare infinitive หลัง see'),
          t2(' abroad or '),
          typ2('t2-dbv-14-b3e', 'practice', ['practice'], 'verb-tense', 'ขนานกับ travel...practice'),
          t2(' informally without proper safety equipment or supervision.')
        ]
      },
      {
        id: 'gb2-ds-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-dbv-14-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that dangerous sports '),
          typ2('t2-dbv-14-c0', 'carry', ['carry'], 'verb-tense', 'ประธาน "sports" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' serious risks, I am of the opinion that individuals should retain the freedom to choose which sports they participate in.')
        ]
      }
    ]
  },
  {
    id: 'gb2-routine-vs-change',
    promptId: 't2-dbv-15',
    steps: [
      {
        id: 'gb2-rc-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('While it is '),
          typ2('t2-dbv-15-i0', 'argue', ['argued'], 'verb-tense', 'passive voice "is + V3" จึงใช้ argued'),
          t2(' by some that people should '),
          typ2('t2-dbv-15-i1', 'stick', ['stick'], 'verb-tense', 'ขนานกับ should + base verb'),
          t2(' to familiar routines and '),
          typ2('t2-dbv-15-i2', 'avoid', ['avoid'], 'verb-tense', 'ขนานกับ stick...avoid'),
          t2(' change, others claim that change is always beneficial. Both points of view will be '),
          typ2('t2-dbv-15-i3', 'elaborate', ['elaborated'], 'verb-tense', 'passive voice "will be + V3" จึงใช้ elaborated'),
          t2(' on before '),
          typ2('t2-dbv-15-i4', 'elaborate', ['elaborating'], 'verb-tense', '"before elaborating on..." ตามด้วย gerund หลัง before'),
          t2(' on the reasons why I believe that '),
          typ2('t2-dbv-15-i5', 'embrace', ['embracing'], 'verb-tense', '"embracing change" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' change generally leads to better outcomes.')
        ]
      },
      {
        id: 'gb2-rc-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-dbv-15-b1start', ['To begin with', 'To explain this simply', 'For example'], 'To begin with', '"To begin with" ใช้เปิดย่อหน้าแรกเพื่อเริ่มเหตุผลข้อแรก'),
          t2(', it might seem sensible for some to claim that '),
          typ2('t2-dbv-15-b1a', 'avoid', ['avoiding'], 'verb-tense', '"avoiding change" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' change and '),
          typ2('t2-dbv-15-b1b', 'maintain', ['maintaining'], 'verb-tense', 'ขนานกับ avoiding...maintaining'),
          t2(' familiar routines is the wiser approach to life. '),
          drag2('t2-dbv-15-b1mid', ['To explain this simply', 'To begin with', 'For example'], 'To explain this simply', '"To explain this simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is because stable routines '),
          typ2('t2-dbv-15-b1c', 'reduce', ['reduce'], 'verb-tense', 'ประธาน "routines" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' uncertainty and '),
          typ2('t2-dbv-15-b1d', 'allow', ['allow'], 'verb-tense', 'ขนานกับ reduce...allow'),
          t2(' people to feel secure in their daily responsibilities. '),
          drag2('t2-dbv-15-b1e', ['For example', 'To begin with', 'To explain this simply'], 'For example', '"For example" ยกตัวอย่างพนักงาน Toyota'),
          t2(', many long-serving employees at companies such as Toyota '),
          typ2('t2-dbv-15-b1f', 'remain', ['remain'], 'verb-tense', 'ประธาน "employees" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' in the same role for decades, '),
          typ2('t2-dbv-15-b1g', 'value', ['valuing'], 'verb-tense', '"valuing the stability..." เป็น participle phrase ขยายประโยคหลัก'),
          t2(' the stability this provides.')
        ]
      },
      {
        id: 'gb2-rc-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          t2('However, some might argue that change is always a good thing. '),
          drag2('t2-dbv-15-b2mid', ['To put it simply', 'However', 'For instance'], 'To put it simply', '"To put it simply" ใช้ก่อนขยายความเหตุผลให้เข้าใจง่ายขึ้น'),
          t2(', this is due to the fact that new experiences and challenges '),
          typ2('t2-dbv-15-b2a', 'push', ['push'], 'verb-tense', 'ประธาน "experiences and challenges" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' individuals to develop skills they would never otherwise acquire. '),
          drag2('t2-dbv-15-b2b', ['For instance', 'To put it simply', 'However'], 'For instance', '"For instance" ยกตัวอย่างงานวิจัยของ Harvard Business Review'),
          t2(', a 2015 Harvard Business Review study '),
          typ2('t2-dbv-15-b2c', 'find', ['found'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ found'),
          t2(' that employees who regularly '),
          typ2('t2-dbv-15-b2d', 'change', ['changed'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ changed'),
          t2(' roles within a company '),
          typ2('t2-dbv-15-b2e', 'show', ['showed'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ showed'),
          t2(' measurably faster skill development than those who did not.')
        ]
      },
      {
        id: 'gb2-rc-body3',
        role: 'body3',
        labelTh: WGB2_ROLE_LABEL_TH.body3,
        segments: [
          t2('Personally, I would argue in favor of the idea that embracing change generally produces better long-term outcomes. My reasoning is that industries and technologies '),
          typ2('t2-dbv-15-b3a', 'evolve', ['evolve'], 'verb-tense', 'ประธาน "industries and technologies" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' constantly, '),
          typ2('t2-dbv-15-b3b', 'mean', ['meaning'], 'verb-tense', '"meaning individuals who resist..." เป็น participle phrase ขยายประโยคหลัก'),
          t2(' individuals who '),
          typ2('t2-dbv-15-b3c', 'resist', ['resist'], 'verb-tense', 'ประธาน "individuals" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' change risk '),
          typ2('t2-dbv-15-b3d', 'become', ['becoming'], 'verb-tense', '"risk becoming outdated" ตามด้วย gerund หลัง risk'),
          t2(' professionally outdated. '),
          drag2('t2-dbv-15-b3start', ['To illustrate', 'To put it simply', 'In this respect'], 'To illustrate', '"To illustrate" ยกตัวอย่างคนงานที่ฝึกทักษะดิจิทัลใหม่'),
          t2(', workers who '),
          typ2('t2-dbv-15-b3e', 'retrain', ['retrained'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ retrained'),
          t2(' in digital skills during the rise of automation '),
          typ2('t2-dbv-15-b3f', 'find', ['found'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ found'),
          t2(' new career opportunities that colleagues resistant to change often missed.')
        ]
      },
      {
        id: 'gb2-rc-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-dbv-15-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that stable routines '),
          typ2('t2-dbv-15-c0', 'offer', ['offer'], 'verb-tense', 'ประธาน "routines" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' valuable comfort and security, I am of the opinion that embracing change ultimately leads to greater personal and professional growth.')
        ]
      }
    ]
  },
  {
    id: 'gb2-hosting-sporting-event',
    promptId: 't2-ad-1',
    steps: [
      {
        id: 'gb2-hs-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('It has been widely '),
          typ2('t2-ad-1-i0', 'argue', ['argued'], 'verb-tense', 'passive voice "has been + V3" จึงใช้ argued'),
          t2(' that while '),
          typ2('t2-ad-1-i1', 'host', ['hosting'], 'verb-tense', '"hosting a major international sporting event" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' a major international sporting event is both beneficial and detrimental for the host country, this essay argues that the benefits are far greater than the drawbacks.')
        ]
      },
      {
        id: 'gb2-hs-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-ad-1-b1start', ['To begin with', 'Another advantage', 'For example'], 'To begin with', '"To begin with" ใช้เปิดย่อหน้าข้อดีข้อแรก'),
          t2(', there are a number of benefits associated with hosting a major sporting event. The first benefit is that it '),
          typ2('t2-ad-1-b1a', 'bring', ['brings'], 'verb-tense', 'ประธาน "it" เป็นเอกพจน์ จึงใช้ brings'),
          t2(' significant economic growth through tourism and infrastructure investment, '),
          typ2('t2-ad-1-b1b', 'create', ['creating'], 'verb-tense', '"creating thousands of new jobs" เป็น participle phrase ขยายประโยคหลัก'),
          t2(' thousands of new jobs in the process. '),
          drag2('t2-ad-1-b1c', ['For example', 'To begin with', 'Another advantage'], 'For example', '"For example" ยกตัวอย่างโอลิมปิกลอนดอน 2012'),
          t2(', the 2012 London Olympics '),
          typ2('t2-ad-1-b1d', 'attract', ['attracted'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ attracted'),
          t2(' more than 320,000 additional overseas visitors and '),
          typ2('t2-ad-1-b1e', 'generate', ['generated'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ generated'),
          t2(" billions of pounds in tourism revenue. "),
          drag2('t2-ad-1-b1f', ['Another advantage', 'To begin with', 'For example'], 'Another advantage', '"Another advantage" ใช้เปิดข้อดีข้อที่สอง'),
          t2(" is that it "),
          typ2('t2-ad-1-b1g', 'raise', ['raises'], 'verb-tense', 'ประธาน "it" เป็นเอกพจน์ จึงใช้ raises'),
          t2(" the host country's international profile and national pride. "),
          drag2('t2-ad-1-b1h', ['For instance', 'To begin with', 'Another advantage'], 'For instance', '"For instance" ยกตัวอย่างเกาหลีใต้'),
          t2(", South Korea's hosting of the 2018 Winter Olympics in Pyeongchang significantly "),
          typ2('t2-ad-1-b1i', 'boost', ['boosted'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ boosted'),
          t2(" the nation's global recognition as a modern, capable host.")
        ]
      },
      {
        id: 'gb2-hs-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          t2('However, some might be concerned regarding the high cost of hosting such events. This is because '),
          typ2('t2-ad-1-b2a', 'build', ['building'], 'verb-tense', '"building new stadiums..." เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' new stadiums and facilities often '),
          typ2('t2-ad-1-b2b', 'require', ['requires'], 'verb-tense', 'ประธาน "building..." เป็นเอกพจน์ จึงใช้ requires'),
          t2(' enormous public spending. '),
          drag2('t2-ad-1-b2start', ['To illustrate', 'For example', 'However'], 'To illustrate', '"To illustrate" ยกตัวอย่างบราซิล'),
          t2(', Brazil '),
          typ2('t2-ad-1-b2c', 'spend', ['spent'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ spent'),
          t2(' an estimated 13 billion dollars preparing for the 2016 Rio Olympics, much of which came from public funds. '),
          drag2('t2-ad-1-b2mid', ['However', 'To illustrate', 'For example'], 'However', '"However" ใช้เปิดประโยคโต้แย้งข้อกังวลเรื่องค่าใช้จ่าย'),
          t2(', this argument is simply invalid given that many host cities '),
          typ2('t2-ad-1-b2d', 'recover', ['recover'], 'verb-tense', 'ประธาน "cities" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' these costs through long-term tourism and improved infrastructure. '),
          drag2('t2-ad-1-b2e', ['For example', 'To illustrate', 'However'], 'For example', '"For example" ยกตัวอย่างบาร์เซโลนา'),
          t2(", Barcelona's 1992 Olympic investment "),
          typ2('t2-ad-1-b2f', 'transform', ['transformed'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ transformed'),
          t2(" the city into one of Europe's most visited tourist destinations for decades afterward.")
        ]
      },
      {
        id: 'gb2-hs-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-ad-1-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that some might be concerned in terms of the financial burden of hosting a major sporting event, I am of the opinion that the benefits, including economic growth and international recognition, are far greater than the drawbacks.')
        ]
      }
    ]
  },
  {
    id: 'gb2-ageing-population',
    promptId: 't2-ad-2',
    steps: [
      {
        id: 'gb2-ap-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('It has been widely '),
          typ2('t2-ad-2-i0', 'argue', ['argued'], 'verb-tense', 'passive voice "has been + V3" จึงใช้ argued'),
          t2(' that while an ageing population is both beneficial and detrimental for society, this essay argues that the benefits are far greater than the drawbacks.')
        ]
      },
      {
        id: 'gb2-ap-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-ad-2-b1start', ['To begin with', 'Another advantage', 'For example'], 'To begin with', '"To begin with" ใช้เปิดย่อหน้าข้อดีข้อแรก'),
          t2(', there are a number of benefits associated with an ageing population. The first benefit is that older citizens '),
          typ2('t2-ad-2-b1a', 'bring', ['bring'], 'verb-tense', 'ประธาน "citizens" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' decades of valuable knowledge and experience to the workforce and community life, '),
          typ2('t2-ad-2-b1b', 'help', ['helping'], 'verb-tense', '"helping to train..." เป็น participle phrase ขยายประโยคหลัก'),
          t2(' to train the next generation of workers. '),
          drag2('t2-ad-2-b1c', ['For example', 'To begin with', 'Another advantage'], 'For example', '"For example" ยกตัวอย่างผู้เกษียณสอนพนักงานรุ่นใหม่'),
          t2(', many countries now '),
          typ2('t2-ad-2-b1d', 'rely', ['rely'], 'verb-tense', 'ประธาน "countries" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' on retirees to mentor younger employees, '),
          typ2('t2-ad-2-b1e', 'pass', ['passing'], 'verb-tense', '"passing on skills..." เป็น participle phrase ขยายประโยคหลัก'),
          t2(' on skills that would otherwise be lost. '),
          drag2('t2-ad-2-b1f', ['Another advantage', 'To begin with', 'For example'], 'Another advantage', '"Another advantage" ใช้เปิดข้อดีข้อที่สอง'),
          t2(' is that older generations often '),
          typ2('t2-ad-2-b1g', 'provide', ['provide'], 'verb-tense', 'ประธาน "generations" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' free childcare, '),
          typ2('t2-ad-2-b1h', 'allow', ['allowing'], 'verb-tense', '"allowing younger family members..." เป็น participle phrase ขยายประโยคหลัก'),
          t2(' younger family members to remain in full-time employment. '),
          drag2('t2-ad-2-b1i', ['For instance', 'To begin with', 'Another advantage'], 'For instance', '"For instance" ยกตัวอย่างประเทศอิตาลี'),
          t2(', in countries such as Italy, grandparents frequently '),
          typ2('t2-ad-2-b1j', 'care', ['care'], 'verb-tense', 'ประธาน "grandparents" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' for grandchildren while both parents work.')
        ]
      },
      {
        id: 'gb2-ap-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          t2('However, some might be concerned regarding the financial burden that an ageing population places on public services. This is because pensions and healthcare for elderly citizens '),
          typ2('t2-ad-2-b2a', 'require', ['require'], 'verb-tense', 'ประธาน "pensions and healthcare" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' significant government spending. '),
          drag2('t2-ad-2-b2start', ['To illustrate', 'For example', 'However'], 'To illustrate', '"To illustrate" ยกตัวอย่างประเทศญี่ปุ่น'),
          t2(', Japan now '),
          typ2('t2-ad-2-b2b', 'spend', ['spends'], 'verb-tense', 'ประธาน "Japan" เป็นเอกพจน์ จึงใช้ spends'),
          t2(' more than a fifth of its national budget on social security for elderly citizens. '),
          drag2('t2-ad-2-b2mid', ['However', 'To illustrate', 'For example'], 'However', '"However" ใช้เปิดประโยคโต้แย้งข้อกังวลเรื่องค่าใช้จ่าย'),
          t2(', this argument is simply invalid given that many governments can offset these costs by '),
          typ2('t2-ad-2-b2c', 'raise', ['raising'], 'verb-tense', '"by raising retirement ages" ตามด้วย gerund หลัง by'),
          t2(' retirement ages and '),
          typ2('t2-ad-2-b2d', 'encourage', ['encouraging'], 'verb-tense', 'ขนานกับ raising...encouraging'),
          t2(' continued employment among older citizens. '),
          drag2('t2-ad-2-b2e', ['For example', 'To illustrate', 'However'], 'For example', '"For example" ยกตัวอย่างประเทศในยุโรป'),
          t2(', several European countries have successfully '),
          typ2('t2-ad-2-b2f', 'reduce', ['reduced'], 'verb-tense', 'present perfect "have + V3" จึงใช้ reduced'),
          t2(' pension costs by gradually raising the retirement age to 67.')
        ]
      },
      {
        id: 'gb2-ap-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-ad-2-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that some might be concerned in terms of the financial cost of an ageing population, I am of the opinion that the benefits of an ageing population, including experience and family support, are far greater than the drawbacks.')
        ]
      }
    ]
  },
  {
    id: 'gb2-parents-working-abroad',
    promptId: 't2-ad-3',
    steps: [
      {
        id: 'gb2-pw-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('It has been widely '),
          typ2('t2-ad-3-i0', 'argue', ['argued'], 'verb-tense', 'passive voice "has been + V3" จึงใช้ argued'),
          t2(' that while parents '),
          typ2('t2-ad-3-i1', 'relocate', ['relocating'], 'verb-tense', '"parents relocating abroad" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' abroad for work is both beneficial and detrimental for their families, this essay argues that the benefits are far greater than the drawbacks.')
        ]
      },
      {
        id: 'gb2-pw-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-ad-3-b1start', ['To begin with', 'Another advantage', 'For example'], 'To begin with', '"To begin with" ใช้เปิดย่อหน้าข้อดีข้อแรก'),
          t2(', there are a number of benefits associated with parents working abroad and bringing their families with them. The first benefit is that children '),
          typ2('t2-ad-3-b1a', 'gain', ['gain'], 'verb-tense', 'ประธาน "children" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' exposure to new languages and cultures from an early age. '),
          drag2('t2-ad-3-b1b', ['For example', 'To begin with', 'Another advantage'], 'For example', '"For example" ยกตัวอย่างนักเรียนโรงเรียนนานาชาติ'),
          t2(', children raised in international schools in cities such as Singapore often '),
          typ2('t2-ad-3-b1c', 'become', ['become'], 'verb-tense', 'ประธาน "children" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' fluent in two or more languages by adulthood. '),
          drag2('t2-ad-3-b1d', ['Another advantage', 'To begin with', 'For example'], 'Another advantage', '"Another advantage" ใช้เปิดข้อดีข้อที่สอง'),
          t2(" is that higher overseas salaries can significantly "),
          typ2('t2-ad-3-b1e', 'improve', ['improve'], 'verb-tense', 'ขนานกับ can + base verb'),
          t2(" a family's overall standard of living. "),
          drag2('t2-ad-3-b1f', ['For instance', 'To begin with', 'Another advantage'], 'For instance', '"For instance" ยกตัวอย่างแรงงานต่างชาติในอ่าวเปอร์เซีย'),
          t2(', many expatriate workers in the Gulf region '),
          typ2('t2-ad-3-b1g', 'earn', ['earn'], 'verb-tense', 'ประธาน "workers" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' several times what they would earn in their home countries.')
        ]
      },
      {
        id: 'gb2-pw-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          t2("However, some might be concerned regarding the disruption this move causes to children's education and social lives. This is because children must "),
          typ2('t2-ad-3-b2a', 'adapt', ['adapt'], 'verb-tense', 'ขนานกับ must + base verb'),
          t2(' to new schools and '),
          typ2('t2-ad-3-b2b', 'make', ['make'], 'verb-tense', 'ขนานกับ adapt...make'),
          t2(' new friends, often more than once during their childhood. '),
          drag2('t2-ad-3-b2start', ['To illustrate', 'For example', 'However'], 'To illustrate', '"To illustrate" ยกตัวอย่างครอบครัวที่ย้ายบ่อย'),
          t2(', families who relocate frequently for work may see their children '),
          typ2('t2-ad-3-b2c', 'change', ['change'], 'verb-tense', '"see their children change schools" — bare infinitive หลัง see'),
          t2(' schools three or four times before finishing secondary education. '),
          drag2('t2-ad-3-b2mid', ['However', 'To illustrate', 'For example'], 'However', '"However" ใช้เปิดประโยคโต้แย้งข้อกังวลเรื่องการปรับตัว'),
          t2(', this argument is simply invalid given that international schools are specifically designed to help children adapt quickly, '),
          typ2('t2-ad-3-b2d', 'offer', ['offering'], 'verb-tense', '"offering strong pastoral support..." เป็น participle phrase ขยายประโยคหลัก'),
          t2(' strong pastoral support and globally recognised curricula. '),
          drag2('t2-ad-3-b2e', ['For example', 'To illustrate', 'However'], 'For example', '"For example" ยกตัวอย่างหลักสูตร International Baccalaureate'),
          t2(', the International Baccalaureate programme, taught in more than 150 countries, '),
          typ2('t2-ad-3-b2f', 'allow', ['allows'], 'verb-tense', 'ประธาน "programme" เป็นเอกพจน์ จึงใช้ allows'),
          t2(' students to continue the same curriculum wherever their family relocates.')
        ]
      },
      {
        id: 'gb2-pw-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-ad-3-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(", although it is undeniable that some might be concerned in terms of the disruption caused to children's education, I am of the opinion that the benefits of relocating abroad for work, including cultural exposure and financial improvement, are far greater than the drawbacks.")
        ]
      }
    ]
  },
  {
    id: 'gb2-international-tourism',
    promptId: 't2-ad-4',
    steps: [
      {
        id: 'gb2-it-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('It has been widely '),
          typ2('t2-ad-4-i0', 'argue', ['argued'], 'verb-tense', 'passive voice "has been + V3" จึงใช้ argued'),
          t2(' that while international tourism is both beneficial and detrimental to the places it '),
          typ2('t2-ad-4-i1', 'affect', ['affects'], 'verb-tense', 'ประธาน "it" เป็นเอกพจน์ จึงใช้ affects'),
          t2(', this essay argues that the benefits are far greater than the drawbacks.')
        ]
      },
      {
        id: 'gb2-it-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-ad-4-b1start', ['To begin with', 'Another advantage', 'For example'], 'To begin with', '"To begin with" ใช้เปิดย่อหน้าข้อดีข้อแรก'),
          t2(', there are a number of benefits associated with international tourism. The first benefit is that tourism '),
          typ2('t2-ad-4-b1a', 'generate', ['generates'], 'verb-tense', 'ประธาน "tourism" เป็นเอกพจน์ จึงใช้ generates'),
          t2(' substantial income and employment for local communities. '),
          drag2('t2-ad-4-b1b', ['For example', 'To begin with', 'Another advantage'], 'For example', '"For example" ยกตัวอย่างการจ้างงานในไทย'),
          t2(", tourism accounts for more than 20% of Thailand's total employment, "),
          typ2('t2-ad-4-b1c', 'support', ['supporting'], 'verb-tense', '"supporting millions of local jobs" เป็น participle phrase ขยายประโยคหลัก'),
          t2(' millions of local jobs. '),
          drag2('t2-ad-4-b1d', ['Another advantage', 'To begin with', 'For example'], 'Another advantage', '"Another advantage" ใช้เปิดข้อดีข้อที่สอง'),
          t2(' is that tourism '),
          typ2('t2-ad-4-b1e', 'encourage', ['encourages'], 'verb-tense', 'ประธาน "tourism" เป็นเอกพจน์ จึงใช้ encourages'),
          t2(' the preservation of local culture and historic sites, as governments '),
          typ2('t2-ad-4-b1f', 'invest', ['invest'], 'verb-tense', 'ประธาน "governments" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' in maintaining the attractions that draw visitors, '),
          typ2('t2-ad-4-b1g', 'create', ['creating'], 'verb-tense', '"creating a cycle of..." เป็น participle phrase ขยายประโยคหลัก'),
          t2(' a cycle of sustained cultural investment. '),
          drag2('t2-ad-4-b1h', ['For instance', 'To begin with', 'Another advantage'], 'For instance', '"For instance" ยกตัวอย่างนครวัด'),
          t2(', revenue from tourist entry fees has '),
          typ2('t2-ad-4-b1i', 'fund', ['funded'], 'verb-tense', 'present perfect "has + V3" จึงใช้ funded'),
          t2("  major restoration projects at Cambodia's Angkor Wat temple complex.")
        ]
      },
      {
        id: 'gb2-it-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          t2('However, some might be concerned regarding the environmental damage caused by large numbers of tourists. This is because popular destinations often '),
          typ2('t2-ad-4-b2a', 'experience', ['experience'], 'verb-tense', 'ประธาน "destinations" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' pollution, overcrowding, and strain on local infrastructure, particularly during peak holiday seasons. '),
          drag2('t2-ad-4-b2start', ['To illustrate', 'For example', 'However'], 'To illustrate', '"To illustrate" ยกตัวอย่างชายหาดในไทย'),
          t2(', some beaches in Thailand have been '),
          typ2('t2-ad-4-b2b', 'force', ['forced'], 'verb-tense', 'present perfect passive "have been + V3" จึงใช้ forced'),
          t2(' to close temporarily due to coral reef damage from excessive tourist activity. '),
          drag2('t2-ad-4-b2mid', ['However', 'To illustrate', 'For example'], 'However', '"However" ใช้เปิดประโยคโต้แย้งข้อกังวลเรื่องสิ่งแวดล้อม'),
          t2(', this argument is simply invalid given that responsible tourism management, such as visitor limits and eco-certification schemes, can significantly '),
          typ2('t2-ad-4-b2c', 'reduce', ['reduce'], 'verb-tense', 'ขนานกับ can + base verb'),
          t2(' this damage. '),
          drag2('t2-ad-4-b2e', ['For example', 'To illustrate', 'However'], 'For example', '"For example" ยกตัวอย่างประเทศภูฏาน'),
          t2(', Bhutan strictly '),
          typ2('t2-ad-4-b2d', 'limit', ['limits'], 'verb-tense', 'ประธาน "Bhutan" เป็นเอกพจน์ จึงใช้ limits'),
          t2(' tourist numbers and '),
          typ2('t2-ad-4-b2f', 'charge', ['charges'], 'verb-tense', 'ประธาน "Bhutan" เป็นเอกพจน์ จึงใช้ charges'),
          t2(' a daily fee that directly funds environmental conservation projects.')
        ]
      },
      {
        id: 'gb2-it-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-ad-4-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that some might be concerned in terms of the environmental impact of tourism, I am of the opinion that the benefits of international tourism, including income and cultural preservation, are far greater than the drawbacks.')
        ]
      }
    ]
  },
  {
    id: 'gb2-ebooks-vs-paper-books',
    promptId: 't2-ad-5',
    steps: [
      {
        id: 'gb2-eb-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('It has been widely '),
          typ2('t2-ad-5-i0', 'argue', ['argued'], 'verb-tense', 'passive voice "has been + V3" จึงใช้ argued'),
          t2(' that while '),
          typ2('t2-ad-5-i1', 'read', ['reading'], 'verb-tense', '"reading e-books" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' e-books instead of paper books is both beneficial and detrimental, this essay argues that the benefits are far greater than the drawbacks.')
        ]
      },
      {
        id: 'gb2-eb-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-ad-5-b1start', ['To begin with', 'Another advantage', 'For example'], 'To begin with', '"To begin with" ใช้เปิดย่อหน้าข้อดีข้อแรก'),
          t2(', there are a number of benefits associated with reading e-books. The first benefit is that e-readers can '),
          typ2('t2-ad-5-b1a', 'store', ['store'], 'verb-tense', 'ขนานกับ can + base verb'),
          t2(' thousands of titles in a single lightweight device, '),
          typ2('t2-ad-5-b1b', 'make', ['making'], 'verb-tense', '"making them extremely convenient..." เป็น participle phrase ขยายประโยคหลัก'),
          t2(' them extremely convenient for travel. '),
          drag2('t2-ad-5-b1c', ['For example', 'To begin with', 'Another advantage'], 'For example', '"For example" ยกตัวอย่างเครื่องอ่านอีบุ๊ก'),
          t2(', a single e-reader '),
          typ2('t2-ad-5-b1d', 'weigh', ['weighing'], 'verb-tense', '"an e-reader weighing under 200 grams" — V-ing ทำหน้าที่คุณศัพท์ขยาย e-reader'),
          t2(' under 200 grams can '),
          typ2('t2-ad-5-b1e', 'hold', ['hold'], 'verb-tense', 'ขนานกับ can + base verb'),
          t2(' an entire personal library of several thousand books. '),
          drag2('t2-ad-5-b1f', ['Another advantage', 'To begin with', 'For example'], 'Another advantage', '"Another advantage" ใช้เปิดข้อดีข้อที่สอง'),
          t2(' is that e-books are typically cheaper than paper books, as they '),
          typ2('t2-ad-5-b1g', 'avoid', ['avoid'], 'verb-tense', 'ประธาน "they" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' printing and distribution costs. '),
          drag2('t2-ad-5-b1h', ['For instance', 'To begin with', 'Another advantage'], 'For instance', '"For instance" ยกตัวอย่างราคาหนังสือดิจิทัล'),
          t2(', digital editions of new releases are often '),
          typ2('t2-ad-5-b1i', 'price', ['priced'], 'verb-tense', 'passive voice "are + V3" จึงใช้ priced'),
          t2(' around 30% lower than their hardcover equivalents, '),
          typ2('t2-ad-5-b1j', 'make', ['making'], 'verb-tense', '"making reading a much cheaper hobby" เป็น participle phrase ขยายประโยคหลัก'),
          t2(' reading a much cheaper hobby overall.')
        ]
      },
      {
        id: 'gb2-eb-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          t2('However, some might be concerned regarding the loss of the traditional reading experience that paper books provide. This is because many readers '),
          typ2('t2-ad-5-b2a', 'associate', ['associate'], 'verb-tense', 'ประธาน "readers" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' physical books with better focus and fewer digital distractions, particularly among younger readers. '),
          drag2('t2-ad-5-b2start', ['To illustrate', 'For example', 'However'], 'To illustrate', '"To illustrate" ยกตัวอย่างงานวิจัยเรื่องการอ่าน'),
          t2(', some studies suggest that readers '),
          typ2('t2-ad-5-b2b', 'retain', ['retain'], 'verb-tense', 'ประธาน "readers" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' information less effectively when reading from a screen. '),
          drag2('t2-ad-5-b2mid', ['However', 'To illustrate', 'For example'], 'However', '"However" ใช้เปิดประโยคโต้แย้งข้อกังวลเรื่องประสบการณ์การอ่าน'),
          t2(', this argument is simply invalid given that modern e-readers now '),
          typ2('t2-ad-5-b2c', 'use', ['use'], 'verb-tense', 'ประธาน "e-readers" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' paper-like display technology specifically designed to reduce eye strain and distraction. '),
          drag2('t2-ad-5-b2d', ['For example', 'To illustrate', 'However'], 'For example', '"For example" ยกตัวอย่าง Kindle Paperwhite'),
          t2(', devices such as the Kindle Paperwhite '),
          typ2('t2-ad-5-b2e', 'lack', ['lack'], 'verb-tense', 'ประธาน "devices" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' internet browsers entirely, '),
          typ2('t2-ad-5-b2f', 'allow', ['allowing'], 'verb-tense', '"allowing readers to focus..." เป็น participle phrase ขยายประโยคหลัก'),
          t2(' readers to focus solely on their book.')
        ]
      },
      {
        id: 'gb2-eb-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-ad-5-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that some might be concerned in terms of the reading experience offered by paper books, I am of the opinion that the benefits of e-books, including convenience and affordability, are far greater than the drawbacks.')
        ]
      }
    ]
  },
  {
    id: 'gb2-police-carrying-weapons',
    promptId: 't2-ad-6',
    steps: [
      {
        id: 'gb2-pc-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('It has been widely '),
          typ2('t2-ad-6-i0', 'argue', ['argued'], 'verb-tense', 'passive voice "has been + V3" จึงใช้ argued'),
          t2(' that while police officers '),
          typ2('t2-ad-6-i1', 'carry', ['carrying'], 'verb-tense', '"police officers carrying weapons" เป็น gerund phrase ทำหน้าที่ประธานประโยค'),
          t2(' weapons is both beneficial and detrimental to public safety, this essay argues that the benefits are far greater than the drawbacks.')
        ]
      },
      {
        id: 'gb2-pc-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-ad-6-b1start', ['To begin with', 'Another advantage', 'For example'], 'To begin with', '"To begin with" ใช้เปิดย่อหน้าข้อดีข้อแรก'),
          t2(', there are a number of benefits associated with police officers carrying weapons. The first benefit is that armed officers can '),
          typ2('t2-ad-6-b1a', 'respond', ['respond'], 'verb-tense', 'ขนานกับ can + base verb'),
          t2(' immediately to violent or life-threatening situations. '),
          drag2('t2-ad-6-b1b', ['For example', 'To begin with', 'Another advantage'], 'For example', '"For example" ยกตัวอย่างรายงานของ UK Home Office'),
          t2(', a 2023 UK Home Office report '),
          typ2('t2-ad-6-b1c', 'find', ['found'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ found'),
          t2(' that armed response units '),
          typ2('t2-ad-6-b1d', 'reduce', ['reduced'], 'verb-tense', 'เหตุการณ์ในอดีตที่จบแล้ว (past simple) จึงใช้ reduced'),
          t2(' fatal outcomes in hostage situations by '),
          typ2('t2-ad-6-b1e', 'act', ['acting'], 'verb-tense', '"by acting within minutes" ตามด้วย gerund หลัง by'),
          t2(' within minutes of arrival. '),
          drag2('t2-ad-6-b1f', ['Another advantage', 'To begin with', 'For example'], 'Another advantage', '"Another advantage" ใช้เปิดข้อดีข้อที่สอง'),
          t2(' is that visible weapons '),
          typ2('t2-ad-6-b1g', 'act', ['act'], 'verb-tense', 'ประธาน "weapons" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' as a strong deterrent against attacks on law enforcement personnel. '),
          drag2('t2-ad-6-b1h', ['For instance', 'To begin with', 'Another advantage'], 'For instance', '"For instance" ยกตัวอย่างสหรัฐอเมริกา'),
          t2(', countries such as the United States '),
          typ2('t2-ad-6-b1i', 'report', ['report'], 'verb-tense', 'ประธาน "countries" เป็นพหูพจน์ กริยาปัจจุบันจึงไม่เติม -s'),
          t2(' far fewer assaults on officers in districts where armed patrols are standard practice.')
        ]
      },
      {
        id: 'gb2-pc-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          t2('However, some might be concerned regarding the risk of accidental shootings or excessive use of force. This is because officers under pressure may '),
          typ2('t2-ad-6-b2a', 'make', ['make'], 'verb-tense', 'ขนานกับ may + base verb'),
          t2(' split-second errors that lead to tragic outcomes. '),
          drag2('t2-ad-6-b2start', ['To illustrate', 'For example', 'However'], 'To illustrate', '"To illustrate" ยกตัวอย่างเหตุการณ์ในสหรัฐอเมริกา'),
          t2(', several widely reported cases in American cities have '),
          typ2('t2-ad-6-b2b', 'involve', ['involved'], 'verb-tense', 'present perfect "have + V3" จึงใช้ involved'),
          t2(' unarmed civilians being mistakenly '),
          typ2('t2-ad-6-b2c', 'shoot', ['shot'], 'verb-tense', '"civilians being mistakenly shot" — V3 หลัง being ในโครงสร้าง passive'),
          t2(' during routine stops. '),
          drag2('t2-ad-6-b2mid', ['However', 'To illustrate', 'For example'], 'However', '"However" ใช้เปิดประโยคโต้แย้งข้อกังวลเรื่องความเสี่ยง'),
          t2(', this argument is simply invalid given that rigorous training and strict accountability procedures can dramatically '),
          typ2('t2-ad-6-b2d', 'reduce', ['reduce'], 'verb-tense', 'ขนานกับ can + base verb'),
          t2(' such errors. '),
          drag2('t2-ad-6-b2e', ['For example', 'To illustrate', 'However'], 'For example', '"For example" ยกตัวอย่างตำรวจนอร์เวย์'),
          t2(", Norway's police force "),
          typ2('t2-ad-6-b2f', 'carry', ['carries'], 'verb-tense', 'ประธาน "force" เป็นเอกพจน์ จึงใช้ carries'),
          t2(' weapons only in specific circumstances, '),
          typ2('t2-ad-6-b2g', 'combine', ['combining'], 'verb-tense', '"combining this restraint with..." เป็น participle phrase ขยายประโยคหลัก'),
          t2(' this restraint with extensive de-escalation training that keeps shooting rates among the lowest in Europe.')
        ]
      },
      {
        id: 'gb2-pc-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-ad-6-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that some might be concerned in terms of the risk of misuse of force, I am of the opinion that the benefits of police officers carrying weapons, including rapid emergency response and deterrence against attacks, are far greater than the drawbacks.')
        ]
      }
    ]
  },
  {
    id: 'gb2-economic-development-social-values',
    promptId: 't2-ad-7',
    steps: [
      {
        id: 'gb2-ed-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('It has been widely argued that while rapid economic development is both beneficial and '),
          typ2('t2-ad-7-i0', 'detriment', ['detrimental'], 'participle', '"detrimental to" เป็นคำคุณศัพท์ขยาย traditional social values'),
          t2(' to traditional social values, this essay argues that the benefits are far greater than the drawbacks.')
        ]
      },
      {
        id: 'gb2-ed-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-ad-7-b1start', ['To begin with', 'Another advantage', 'For example'], 'To begin with', '"To begin with" เปิดย่อหน้าแรกเสมอ'),
          t2(', there are a number of benefits associated with rapid economic development. The first benefit is that it '),
          typ2('t2-ad-7-b1a', 'lift', ['lifts'], 'verb-tense', 'ประธาน "it" เอกพจน์ จึงใช้ lifts'),
          t2(' millions of people out of poverty by '),
          typ2('t2-ad-7-b1b', 'create', ['creating'], 'verb-tense', '"by creating" เป็น gerund หลัง preposition by'),
          t2(' new employment opportunities. '),
          drag2('t2-ad-7-b1c', ['For example', 'Another advantage', 'To begin with'], 'For example', '"For example" ยกตัวอย่างงานวิจัยของ World Bank'),
          t2(", a 2022 World Bank study "),
          typ2('t2-ad-7-b1d', 'find', ['found'], 'verb-tense', 'past simple เล่าผลการศึกษาในอดีต'),
          t2(" that China's economic growth since 1990 helped lift more than 800 million citizens out of extreme poverty. "),
          drag2('t2-ad-7-b1e', ['Another advantage', 'To begin with', 'For example'], 'Another advantage', '"Another advantage" เพิ่มประโยชน์ข้อที่สอง'),
          t2(' is that development brings improved healthcare and education systems to ordinary citizens. '),
          drag2('t2-ad-7-b1f', ['For instance', 'To begin with', 'Another advantage'], 'For instance', '"For instance" ยกตัวอย่างเวียดนาม'),
          t2(", Vietnam's rising national income has "),
          typ2('t2-ad-7-b1g', 'fund', ['funded'], 'verb-tense', 'present perfect "has funded" เชื่อมอดีตกับปัจจุบัน'),
          t2(' a nationwide expansion of rural hospitals and public schools over the past two decades.')
        ]
      },
      {
        id: 'gb2-ed-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          t2('However, some might be concerned regarding the erosion of traditional customs and family structures. This is because rapid urbanisation often '),
          typ2('t2-ad-7-b2a', 'draw', ['draws'], 'verb-tense', 'ประธาน "urbanisation" เอกพจน์ จึงใช้ draws'),
          t2(' young people away from rural communities toward busy city jobs. '),
          drag2('t2-ad-7-b2start', ['To illustrate', 'For example', 'However'], 'To illustrate', '"To illustrate" ยกตัวอย่างหมู่บ้านในไทย'),
          t2(', many villages across Thailand now report '),
          typ2('t2-ad-7-b2b', 'shrink', ['shrinking'], 'participle', '"shrinking populations" เป็น participle ทำหน้าที่คุณศัพท์ขยาย populations'),
          t2(' populations, as younger generations move to Bangkok in search of higher wages. '),
          drag2('t2-ad-7-b2mid', ['However', 'To illustrate', 'For example'], 'However', '"However" เปิดประโยคโต้แย้งข้อกังวล'),
          t2(', this argument is simply invalid given that governments can actively '),
          typ2('t2-ad-7-b2c', 'preserve', ['preserve'], 'verb-tense', 'ขนานกับ can + base verb'),
          t2(' cultural heritage while '),
          typ2('t2-ad-7-b2d', 'pursue', ['pursuing'], 'verb-tense', '"while pursuing" เป็น gerund phrase หลัง while'),
          t2(' economic growth. '),
          drag2('t2-ad-7-b2e', ['For example', 'To illustrate', 'However'], 'For example', '"For example" ยกตัวอย่างเกาหลีใต้'),
          t2(', South Korea has '),
          typ2('t2-ad-7-b2e2', 'combine', ['combined'], 'verb-tense', 'present perfect "has combined"'),
          t2(' rapid industrialisation with generous state funding for traditional festivals and heritage sites, '),
          typ2('t2-ad-7-b2f', 'ensure', ['ensuring'], 'participle', '"ensuring old customs remain visible" เป็น participle phrase ขยายประโยคหลัก'),
          t2(' old customs remain visible to younger citizens.')
        ]
      },
      {
        id: 'gb2-ed-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-ad-7-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that some might be concerned in terms of the loss of traditional social values, I am of the opinion that the benefits of economic development, including poverty reduction and improved public services, are far greater than the drawbacks.')
        ]
      }
    ]
  },
  {
    id: 'gb2-genetically-modified-food-crops',
    promptId: 't2-ad-8',
    steps: [
      {
        id: 'gb2-gm-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('It has been widely argued that while '),
          typ2('t2-ad-8-i0', 'grow', ['growing'], 'verb-tense', '"growing genetically modified food crops" เป็น gerund phrase ทำหน้าที่ประธาน'),
          t2(' genetically modified food crops is both beneficial and detrimental to public health, this essay argues that the benefits are far greater than the drawbacks.')
        ]
      },
      {
        id: 'gb2-gm-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-ad-8-b1start', ['To begin with', 'Another advantage', 'For example'], 'To begin with', '"To begin with" เปิดย่อหน้าแรกเสมอ'),
          t2(', there are a number of benefits associated with genetically modified food crops. The first benefit is that they can dramatically increase crop yields, '),
          typ2('t2-ad-8-b1a', 'help', ['helping'], 'participle', '"helping to feed growing populations" เป็น participle phrase ขยายประโยคหลัก'),
          t2(' to feed growing populations. '),
          drag2('t2-ad-8-b1b', ['For example', 'Another advantage', 'To begin with'], 'For example', '"For example" ยกตัวอย่างงานวิจัยปี 2021'),
          t2(", a 2021 study by the International Food Policy Research Institute "),
          typ2('t2-ad-8-b1c', 'find', ['found'], 'verb-tense', 'past simple เล่าผลการศึกษาในอดีต'),
          t2(' that genetically modified maize '),
          typ2('t2-ad-8-b1d', 'increase', ['increased'], 'verb-tense', 'past simple ขนานกับ found'),
          t2(' yields by up to 25% in several African nations. '),
          drag2('t2-ad-8-b1e', ['Another advantage', 'To begin with', 'For example'], 'Another advantage', '"Another advantage" เพิ่มประโยชน์ข้อที่สอง'),
          t2(' is that these crops can be engineered to resist pests and drought, '),
          typ2('t2-ad-8-b1f', 'reduce', ['reducing'], 'participle', '"reducing reliance on chemical pesticides" เป็น participle phrase ขยายประโยคหลัก'),
          t2(' reliance on chemical pesticides. '),
          drag2('t2-ad-8-b1g', ['For instance', 'To begin with', 'Another advantage'], 'For instance', '"For instance" ยกตัวอย่าง Bt cotton ในอินเดีย'),
          t2(', Bt cotton varieties grown widely in India have '),
          typ2('t2-ad-8-b1h', 'cut', ['cut'], 'verb-tense', 'present perfect "have cut" รูปเดียวกับ base verb'),
          t2(' pesticide use by nearly half since their introduction.')
        ]
      },
      {
        id: 'gb2-gm-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          t2('However, some might be concerned regarding the unknown long-term health effects of '),
          typ2('t2-ad-8-b2a', 'consume', ['consuming'], 'verb-tense', '"consuming modified foods" เป็น gerund phrase หลัง preposition of'),
          t2(' modified foods. This is because these crops have only been widely '),
          typ2('t2-ad-8-b2b', 'cultivate', ['cultivated'], 'verb-tense', 'passive voice "have been cultivated"'),
          t2(' for a few decades. '),
          drag2('t2-ad-8-b2start', ['To illustrate', 'For example', 'However'], 'To illustrate', '"To illustrate" ยกตัวอย่างกลุ่มผู้บริโภคใน EU'),
          t2(', several consumer groups in the European Union have campaigned for stricter labelling, '),
          typ2('t2-ad-8-b2c', 'cite', ['citing'], 'participle', '"citing these unresolved health concerns" เป็น participle phrase ขยายประโยคหลัก'),
          t2(' these unresolved health concerns. '),
          drag2('t2-ad-8-b2mid', ['However', 'To illustrate', 'For example'], 'However', '"However" เปิดประโยคโต้แย้งข้อกังวล'),
          t2(', this argument is simply invalid given that major scientific bodies have repeatedly '),
          typ2('t2-ad-8-b2d', 'confirm', ['confirmed'], 'verb-tense', 'present perfect "have confirmed"'),
          t2(' the safety of approved genetically modified foods. '),
          drag2('t2-ad-8-b2e', ['For example', 'To illustrate', 'However'], 'For example', '"For example" ยกตัวอย่างองค์การอนามัยโลก'),
          t2(', the World Health Organization has '),
          typ2('t2-ad-8-b2f', 'review', ['reviewed'], 'verb-tense', 'present perfect "has reviewed"'),
          t2(' decades of evidence and '),
          typ2('t2-ad-8-b2g', 'find', ['found'], 'verb-tense', 'present perfect ขนานกับ has reviewed'),
          t2(' no verified case of harm from genetically modified crops currently on the market.')
        ]
      },
      {
        id: 'gb2-gm-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-ad-8-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that some might be concerned in terms of the long-term health effects of modified foods, I am of the opinion that the benefits of genetically modified crops, including higher yields and pest resistance, are far greater than the drawbacks.')
        ]
      }
    ]
  },
  {
    id: 'gb2-online-info-vs-books',
    promptId: 't2-ad-9',
    steps: [
      {
        id: 'gb2-oi-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('It has been widely argued that while '),
          typ2('t2-ad-9-i0', 'store', ['storing'], 'verb-tense', '"storing information...rather than in books" เป็น gerund phrase ทำหน้าที่ประธาน'),
          t2(' information on the internet rather than in books is both beneficial and detrimental to learning, this essay argues that the benefits are far greater than the drawbacks.')
        ]
      },
      {
        id: 'gb2-oi-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-ad-9-b1start', ['To begin with', 'Another advantage', 'For example'], 'To begin with', '"To begin with" เปิดย่อหน้าแรกเสมอ'),
          t2(', there are a number of benefits associated with storing information on the internet. The first benefit is that it '),
          typ2('t2-ad-9-b1a', 'allow', ['allows'], 'verb-tense', 'ประธาน "it" เอกพจน์ จึงใช้ allows'),
          t2(' instant access to knowledge from anywhere in the world. '),
          drag2('t2-ad-9-b1b', ['For example', 'Another advantage', 'To begin with'], 'For example', '"For example" ยกตัวอย่างนักเรียนในเคนยา'),
          t2(', students in remote areas of Kenya now use smartphones to access free online libraries that would otherwise be hours away by road. '),
          drag2('t2-ad-9-b1c', ['Another advantage', 'To begin with', 'For example'], 'Another advantage', '"Another advantage" เพิ่มประโยชน์ข้อที่สอง'),
          t2(' is that online information can be updated constantly, '),
          typ2('t2-ad-9-b1d', 'keep', ['keeping'], 'participle', '"keeping facts far more current" เป็น participle phrase ขยายประโยคหลัก'),
          t2(' facts far more current than printed material. '),
          drag2('t2-ad-9-b1e', ['For instance', 'To begin with', 'Another advantage'], 'For instance', '"For instance" ยกตัวอย่าง Wikipedia'),
          t2(', digital encyclopedias such as Wikipedia are '),
          typ2('t2-ad-9-b1f', 'revise', ['revised'], 'verb-tense', 'passive voice "are revised"'),
          t2(' within minutes of major world events, unlike printed reference books.')
        ]
      },
      {
        id: 'gb2-oi-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          t2('However, some might be concerned regarding the unreliable and unverified nature of much online content. This is because anyone can '),
          typ2('t2-ad-9-b2a', 'publish', ['publish'], 'verb-tense', 'ขนานกับ can + base verb'),
          t2(' information on the internet without any form of expert review. '),
          drag2('t2-ad-9-b2start', ['To illustrate', 'For example', 'However'], 'To illustrate', '"To illustrate" ยกตัวอย่างงานวิจัยของ Stanford'),
          t2(', a 2020 Stanford University study '),
          typ2('t2-ad-9-b2b', 'find', ['found'], 'verb-tense', 'past simple เล่าผลการศึกษาในอดีต'),
          t2(' that most teenagers '),
          typ2('t2-ad-9-b2c', 'struggle', ['struggled'], 'verb-tense', 'past simple ขนานกับ found'),
          t2(' to distinguish reliable news sources from misleading ones online. '),
          drag2('t2-ad-9-b2mid', ['However', 'To illustrate', 'For example'], 'However', '"However" เปิดประโยคโต้แย้งข้อกังวล'),
          t2(', this argument is simply invalid given that reputable digital platforms now '),
          typ2('t2-ad-9-b2d', 'apply', ['apply'], 'verb-tense', 'present simple ประธาน "platforms" พหูพจน์'),
          t2(' strict fact-checking and verification standards. '),
          drag2('t2-ad-9-b2e', ['For example', 'To illustrate', 'However'], 'For example', '"For example" ยกตัวอย่าง JSTOR'),
          t2(', academic databases such as JSTOR only '),
          typ2('t2-ad-9-b2f', 'publish', ['publish'], 'verb-tense', 'present simple ประธาน "databases" พหูพจน์'),
          t2(' peer-reviewed material, '),
          typ2('t2-ad-9-b2g', 'offer', ['offering'], 'participle', '"offering the same reliability" เป็น participle phrase ขยายประโยคหลัก'),
          t2(' the same reliability as traditional printed journals.')
        ]
      },
      {
        id: 'gb2-oi-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-ad-9-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that some might be concerned in terms of the reliability of online information, I am of the opinion that the benefits of storing information on the internet, including instant access and constant updates, are far greater than the drawbacks.')
        ]
      }
    ]
  },
  {
    id: 'gb2-distance-learning-programs',
    promptId: 't2-ad-10',
    steps: [
      {
        id: 'gb2-distance-learning-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('It has been widely argued that while distance-learning programs are both beneficial and '),
          typ2('t2-ad-10-i0', 'detriment', ['detrimental'], 'participle', '"detrimental to students" เป็นคำคุณศัพท์ขยาย students'),
          t2(' to students compared with in-person study, this essay argues that the benefits are far greater than the drawbacks.')
        ]
      },
      {
        id: 'gb2-distance-learning-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-ad-10-b1start', ['To begin with', 'Another advantage', 'For example'], 'To begin with', '"To begin with" เปิดย่อหน้าแรกเสมอ'),
          t2(', there are a number of benefits associated with distance-learning programs. The first benefit is that they '),
          typ2('t2-ad-10-b1a', 'allow', ['allow'], 'verb-tense', 'ประธาน "they" พหูพจน์ จึงใช้ allow'),
          t2(' students to study from any location without '),
          typ2('t2-ad-10-b1b', 'relocate', ['relocating'], 'verb-tense', '"without relocating" เป็น gerund หลัง preposition without'),
          t2(' for university. '),
          drag2('t2-ad-10-b1c', ['For example', 'Another advantage', 'To begin with'], 'For example', '"For example" ยกตัวอย่าง Open University'),
          t2(', the Open University in the United Kingdom '),
          typ2('t2-ad-10-b1d', 'enrol', ['enrols'], 'verb-tense', 'ประธาน "Open University" เอกพจน์ จึงใช้ enrols'),
          t2(' more than 130,000 students annually who study entirely online alongside full-time jobs. '),
          drag2('t2-ad-10-b1e', ['Another advantage', 'To begin with', 'For example'], 'Another advantage', '"Another advantage" เพิ่มประโยชน์ข้อที่สอง'),
          t2(' is that online courses are typically far cheaper than traditional degrees, '),
          typ2('t2-ad-10-b1f', 'eliminate', ['eliminating'], 'participle', '"eliminating accommodation and campus costs" เป็น participle phrase ขยายประโยคหลัก'),
          t2(' accommodation and campus costs altogether. '),
          drag2('t2-ad-10-b1g', ['For instance', 'To begin with', 'Another advantage'], 'For instance', '"For instance" ยกตัวอย่างปริญญาออนไลน์ในสหรัฐ'),
          t2(", several accredited online bachelor's degrees in the United States cost less than half the price of comparable on-campus programs, "),
          typ2('t2-ad-10-b1h', 'save', ['saving'], 'participle', '"saving students thousands of dollars" เป็น participle phrase ขยายประโยคหลัก'),
          t2(' students thousands of dollars overall.')
        ]
      },
      {
        id: 'gb2-distance-learning-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          t2('However, some might be concerned regarding the lack of face-to-face interaction with instructors and classmates. This is because online students often '),
          typ2('t2-ad-10-b2a', 'miss', ['miss'], 'verb-tense', 'present simple ประธาน "students" พหูพจน์'),
          t2(' out on spontaneous discussions and networking opportunities found on campus. '),
          drag2('t2-ad-10-b2start', ['To illustrate', 'For example', 'However'], 'To illustrate', '"To illustrate" ยกตัวอย่างงานสำรวจของ Coursera'),
          t2(', a 2021 survey by Coursera '),
          typ2('t2-ad-10-b2b', 'find', ['found'], 'verb-tense', 'past simple เล่าผลการสำรวจในอดีต'),
          t2(' that nearly 40% of online learners '),
          typ2('t2-ad-10-b2c', 'report', ['reported'], 'verb-tense', 'past simple ขนานกับ found'),
          t2(' feeling isolated during their studies. '),
          drag2('t2-ad-10-b2mid', ['However', 'To illustrate', 'For example'], 'However', '"However" เปิดประโยคโต้แย้งข้อกังวล'),
          t2(', this argument is simply invalid given that modern platforms now '),
          typ2('t2-ad-10-b2d', 'offer', ['offer'], 'verb-tense', 'present simple ประธาน "platforms" พหูพจน์'),
          t2(' live seminars and collaborative group projects. '),
          drag2('t2-ad-10-b2e', ['For example', 'To illustrate', 'However'], 'For example', '"For example" ยกตัวอย่าง Arizona State University'),
          t2(', universities such as Arizona State University '),
          typ2('t2-ad-10-b2f', 'run', ['run'], 'verb-tense', 'present simple ประธาน "universities" พหูพจน์'),
          t2(' weekly video tutorials, '),
          typ2('t2-ad-10-b2g', 'allow', ['allowing'], 'participle', '"allowing online students to interact" เป็น participle phrase ขยายประโยคหลัก'),
          t2(' online students to interact directly with professors and peers.')
        ]
      },
      {
        id: 'gb2-distance-learning-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-ad-10-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that some might be concerned in terms of the lack of face-to-face interaction, I am of the opinion that the benefits of distance-learning programs, including flexibility and lower cost, are far greater than the drawbacks.')
        ]
      }
    ]
  },
  {
    id: 'gb2-students-studying-abroad',
    promptId: 't2-ad-11',
    steps: [
      {
        id: 'gb2-sa-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('It has been widely argued that while university students '),
          typ2('t2-ad-11-i0', 'study', ['studying'], 'verb-tense', '"university students studying abroad" เป็น gerund phrase ทำหน้าที่ประธาน'),
          t2(' abroad is both beneficial and detrimental to their academic careers, this essay argues that the benefits are far greater than the drawbacks.')
        ]
      },
      {
        id: 'gb2-sa-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-ad-11-b1start', ['To begin with', 'Another advantage', 'For example'], 'To begin with', '"To begin with" เปิดย่อหน้าแรกเสมอ'),
          t2(', there are a number of benefits associated with university students studying abroad. The first benefit is that it '),
          typ2('t2-ad-11-b1a', 'expose', ['exposes'], 'verb-tense', 'ประธาน "it" เอกพจน์ จึงใช้ exposes'),
          t2(' students to different teaching methods and academic perspectives. '),
          drag2('t2-ad-11-b1b', ['For example', 'Another advantage', 'To begin with'], 'For example', '"For example" ยกตัวอย่างโครงการ Erasmus'),
          t2(', students who complete an Erasmus exchange programme in Europe report significantly stronger critical thinking skills upon '),
          typ2('t2-ad-11-b1c', 'return', ['returning'], 'verb-tense', '"upon returning" เป็น gerund หลัง preposition upon'),
          t2(' to their home universities. '),
          drag2('t2-ad-11-b1d', ['Another advantage', 'To begin with', 'For example'], 'Another advantage', '"Another advantage" เพิ่มประโยชน์ข้อที่สอง'),
          t2(' is that international study experience greatly '),
          typ2('t2-ad-11-b1e', 'improve', ['improves'], 'verb-tense', 'ประธาน "experience" เอกพจน์ จึงใช้ improves'),
          t2(' future job prospects. '),
          drag2('t2-ad-11-b1f', ['For instance', 'To begin with', 'Another advantage'], 'For instance', '"For instance" ยกตัวอย่างงานสำรวจของ British Council'),
          t2(', a 2022 survey by the British Council '),
          typ2('t2-ad-11-b1g', 'find', ['found'], 'verb-tense', 'past simple เล่าผลการสำรวจในอดีต'),
          t2(' that 87% of employers preferred graduates with overseas study experience over those without any at all.')
        ]
      },
      {
        id: 'gb2-sa-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          t2('However, some might be concerned regarding the high financial cost of studying overseas. This is because tuition fees, flights, and accommodation abroad often far '),
          typ2('t2-ad-11-b2a', 'exceed', ['exceed'], 'verb-tense', 'present simple ประธาน "fees, flights, and accommodation" พหูพจน์'),
          t2(' the cost of domestic study. '),
          drag2('t2-ad-11-b2start', ['To illustrate', 'For example', 'However'], 'To illustrate', '"To illustrate" ยกตัวอย่างค่าเล่าเรียนในออสเตรเลีย'),
          t2(', international tuition fees at Australian universities can reach 45,000 dollars per year, '),
          typ2('t2-ad-11-b2b', 'exclude', ['excluding'], 'participle', '"excluding living expenses entirely" เป็น participle phrase ขยายประโยคหลัก'),
          t2(' living expenses entirely. '),
          drag2('t2-ad-11-b2mid', ['However', 'To illustrate', 'For example'], 'However', '"However" เปิดประโยคโต้แย้งข้อกังวล'),
          t2(', this argument is simply invalid given that numerous scholarships and grants are specifically designed to cover these costs. '),
          drag2('t2-ad-11-b2e', ['For example', 'To illustrate', 'However'], 'For example', '"For example" ยกตัวอย่าง Chevening Scholarship'),
          t2(', the Chevening Scholarship programme fully '),
          typ2('t2-ad-11-b2c', 'fund', ['funds'], 'verb-tense', 'ประธาน "programme" เอกพจน์ จึงใช้ funds'),
          t2(' tuition and living costs for hundreds of international students in the United Kingdom every single year.')
        ]
      },
      {
        id: 'gb2-sa-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-ad-11-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that some might be concerned in terms of the financial cost of studying abroad, I am of the opinion that the benefits of university students studying abroad, including academic exposure and improved job prospects, are far greater than the drawbacks.')
        ]
      }
    ]
  },
  {
    id: 'gb2-credit-cards-young-people',
    promptId: 't2-ad-12',
    steps: [
      {
        id: 'gb2-cc-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('It has been widely argued that while young people '),
          typ2('t2-ad-12-i0', 'have', ['having'], 'verb-tense', '"young people having easier access" เป็น gerund phrase ทำหน้าที่ประธาน'),
          t2(' easier access to credit cards is both beneficial and detrimental to their financial wellbeing, this essay argues that the benefits are far greater than the drawbacks.')
        ]
      },
      {
        id: 'gb2-cc-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-ad-12-b1start', ['To begin with', 'Another advantage', 'For example'], 'To begin with', '"To begin with" เปิดย่อหน้าแรกเสมอ'),
          t2(', there are a number of benefits associated with young people having access to credit cards. The first benefit is that credit cards '),
          typ2('t2-ad-12-b1a', 'allow', ['allow'], 'verb-tense', 'ประธาน "credit cards" พหูพจน์ จึงใช้ allow'),
          t2(' young people to build a strong credit history early in life. '),
          drag2('t2-ad-12-b1b', ['For example', 'Another advantage', 'To begin with'], 'For example', '"For example" ยกตัวอย่างธนาคารในสหรัฐ'),
          t2(', banks in the United States report that customers who '),
          typ2('t2-ad-12-b1c', 'open', ['open'], 'verb-tense', 'present simple ประธาน "customers" พหูพจน์'),
          t2(' a credit card by age 21 typically qualify for lower mortgage rates a decade later. '),
          drag2('t2-ad-12-b1d', ['Another advantage', 'To begin with', 'For example'], 'Another advantage', '"Another advantage" เพิ่มประโยชน์ข้อที่สอง'),
          t2(' is that credit cards '),
          typ2('t2-ad-12-b1e', 'provide', ['provide'], 'verb-tense', 'present simple ประธาน "credit cards" พหูพจน์'),
          t2(' a convenient financial buffer during genuine emergencies. '),
          drag2('t2-ad-12-b1f', ['For instance', 'To begin with', 'Another advantage'], 'For instance', '"For instance" ยกตัวอย่างนักเรียนใช้บัตรเครดิต'),
          t2(', many students '),
          typ2('t2-ad-12-b1g', 'use', ['use'], 'verb-tense', 'present simple ประธาน "students" พหูพจน์'),
          t2(' credit cards to cover unexpected medical bills or urgent travel costs while studying overseas.')
        ]
      },
      {
        id: 'gb2-cc-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          t2('However, some might be concerned regarding the risk of young people '),
          typ2('t2-ad-12-b2a', 'accumulate', ['accumulating'], 'verb-tense', '"young people accumulating unmanageable debt" เป็น gerund phrase หลัง preposition of'),
          t2(' unmanageable debt. This is because many young cardholders lack experience in budgeting and may overspend on non-essential items. '),
          drag2('t2-ad-12-b2start', ['To illustrate', 'For example', 'However'], 'To illustrate', '"To illustrate" ยกตัวอย่างรายงานของ Federal Reserve'),
          t2(', a 2022 report by the Federal Reserve '),
          typ2('t2-ad-12-b2b', 'find', ['found'], 'verb-tense', 'past simple เล่าผลรายงานในอดีต'),
          t2(' that credit card debt among under-25s in America had '),
          typ2('t2-ad-12-b2c', 'rise', ['risen'], 'verb-tense', 'past perfect "had risen"'),
          t2(' by nearly 15% in a single year. '),
          drag2('t2-ad-12-b2mid', ['However', 'To illustrate', 'For example'], 'However', '"However" เปิดประโยคโต้แย้งข้อกังวล'),
          t2(', this argument is simply invalid given that most banks now require compulsory financial literacy modules before '),
          typ2('t2-ad-12-b2d', 'issue', ['issuing'], 'verb-tense', '"before issuing cards" เป็น gerund หลัง preposition before'),
          t2(' cards to young applicants. '),
          drag2('t2-ad-12-b2e', ['For example', 'To illustrate', 'However'], 'For example', '"For example" ยกตัวอย่างธนาคารในสหราชอาณาจักร'),
          t2(', several major UK banks now offer built-in spending alerts, '),
          typ2('t2-ad-12-b2f', 'help', ['helping'], 'participle', '"helping young customers track" เป็น participle phrase ขยายประโยคหลัก'),
          t2(' young customers track and control their spending closely.')
        ]
      },
      {
        id: 'gb2-cc-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-ad-12-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that some might be concerned in terms of the risk of accumulating debt, I am of the opinion that the benefits of credit cards for young people, including building credit history and providing financial security, are far greater than the drawbacks.')
        ]
      }
    ]
  },
  {
    id: 'gb2-fossil-fuels-alternative-energy',
    promptId: 't2-ad-13',
    steps: [
      {
        id: 'gb2-fe-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('It has been widely argued that while '),
          typ2('t2-ad-13-i0', 'shift', ['shifting'], 'verb-tense', '"shifting from fossil fuels...sources" เป็น gerund phrase ทำหน้าที่ประธาน'),
          t2(' from fossil fuels to alternative energy sources is both beneficial and detrimental to national economies, this essay argues that the benefits are far greater than the drawbacks.')
        ]
      },
      {
        id: 'gb2-fe-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-ad-13-b1start', ['To begin with', 'Another advantage', 'For example'], 'To begin with', '"To begin with" เปิดย่อหน้าแรกเสมอ'),
          t2(', there are a number of benefits associated with shifting to alternative energy sources. The first benefit is that renewable energy significantly '),
          typ2('t2-ad-13-b1a', 'reduce', ['reduces'], 'verb-tense', 'ประธาน "renewable energy" เอกพจน์ จึงใช้ reduces'),
          t2(' harmful carbon emissions that contribute to climate change. '),
          drag2('t2-ad-13-b1b', ['For example', 'Another advantage', 'To begin with'], 'For example', '"For example" ยกตัวอย่างเดนมาร์ก'),
          t2(', Denmark now generates more than 50% of its electricity from wind power, '),
          typ2('t2-ad-13-b1c', 'cut', ['cutting'], 'participle', '"cutting national carbon emissions" เป็น participle phrase ขยายประโยคหลัก'),
          t2(' national carbon emissions dramatically since 2010. '),
          drag2('t2-ad-13-b1d', ['Another advantage', 'To begin with', 'For example'], 'Another advantage', '"Another advantage" เพิ่มประโยชน์ข้อที่สอง'),
          t2(' is that renewable energy sources are increasingly cheaper to produce than fossil fuels. '),
          drag2('t2-ad-13-b1e', ['For instance', 'To begin with', 'Another advantage'], 'For instance', '"For instance" ยกตัวอย่างรายงาน IRENA'),
          t2(', a 2021 report by the International Renewable Energy Agency '),
          typ2('t2-ad-13-b1f', 'find', ['found'], 'verb-tense', 'past simple เล่าผลรายงานในอดีต'),
          t2(' that solar power costs had '),
          typ2('t2-ad-13-b1g', 'fall', ['fallen'], 'verb-tense', 'past perfect "had fallen"'),
          t2(' by 85% over the previous decade.')
        ]
      },
      {
        id: 'gb2-fe-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          t2('However, some might be concerned regarding the unreliable and inconsistent supply of renewable energy. This is because solar and wind power '),
          typ2('t2-ad-13-b2a', 'depend', ['depend'], 'verb-tense', 'present simple ประธาน "solar and wind power" พหูพจน์'),
          t2(' heavily on weather conditions rather than constant availability. '),
          drag2('t2-ad-13-b2start', ['To illustrate', 'For example', 'However'], 'To illustrate', '"To illustrate" ยกตัวอย่างประเทศในยุโรป'),
          t2(', several European countries '),
          typ2('t2-ad-13-b2b', 'experience', ['experienced'], 'verb-tense', 'past simple เล่าเหตุการณ์ในปี 2021'),
          t2(' electricity shortages in 2021 when unusually low winds '),
          typ2('t2-ad-13-b2c', 'reduce', ['reduced'], 'verb-tense', 'past simple ขนานกับ experienced'),
          t2(' wind farm output. '),
          drag2('t2-ad-13-b2mid', ['However', 'To illustrate', 'For example'], 'However', '"However" เปิดประโยคโต้แย้งข้อกังวล'),
          t2(', this argument is simply invalid given that modern battery storage technology can now '),
          typ2('t2-ad-13-b2d', 'store', ['store'], 'verb-tense', 'ขนานกับ can + base verb'),
          t2(' surplus renewable energy for later use. '),
          drag2('t2-ad-13-b2e', ['For example', 'To illustrate', 'However'], 'For example', '"For example" ยกตัวอย่างแบตเตอรี่ Tesla'),
          t2(", Tesla's large-scale battery installation in South Australia has "),
          typ2('t2-ad-13-b2f', 'store', ['stored'], 'verb-tense', 'present perfect "has stored"'),
          t2(' enough energy to power thousands of homes during periods of low wind generation.')
        ]
      },
      {
        id: 'gb2-fe-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-ad-13-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that some might be concerned in terms of the inconsistent supply of renewable energy, I am of the opinion that the benefits of shifting to alternative energy, including reduced emissions and falling costs, are far greater than the drawbacks.')
        ]
      }
    ]
  },
  {
    id: 'gb2-ai-performing-human-tasks',
    promptId: 't2-ad-14',
    steps: [
      {
        id: 'gb2-ai-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('It has been widely argued that while '),
          typ2('t2-ad-14-i0', 'use', ['using'], 'verb-tense', '"using artificial intelligence...humans" เป็น gerund phrase ทำหน้าที่ประธาน'),
          t2(' artificial intelligence to perform tasks once done by humans is both beneficial and detrimental to the workforce, this essay argues that the benefits are far greater than the drawbacks.')
        ]
      },
      {
        id: 'gb2-ai-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-ad-14-b1start', ['To begin with', 'Another advantage', 'For example'], 'To begin with', '"To begin with" เปิดย่อหน้าแรกเสมอ'),
          t2(', there are a number of benefits associated with using artificial intelligence in the workplace. The first benefit is that AI can complete repetitive tasks far more quickly and accurately than humans. '),
          drag2('t2-ad-14-b1b', ['For example', 'Another advantage', 'To begin with'], 'For example', '"For example" ยกตัวอย่างหุ่นยนต์คลังสินค้าของ Amazon'),
          t2(", Amazon's warehouse robots now "),
          typ2('t2-ad-14-b1c', 'process', ['process'], 'verb-tense', 'present simple ประธาน "robots" พหูพจน์'),
          t2(' customer orders roughly four times faster than manual sorting teams '),
          typ2('t2-ad-14-b1d', 'do', ['did'], 'verb-tense', 'past simple "did previously" เทียบกับอดีต'),
          t2(' previously. '),
          drag2('t2-ad-14-b1e', ['Another advantage', 'To begin with', 'For example'], 'Another advantage', '"Another advantage" เพิ่มประโยชน์ข้อที่สอง'),
          t2(' is that AI frees employees from tedious duties, '),
          typ2('t2-ad-14-b1f', 'allow', ['allowing'], 'participle', '"allowing them to focus" เป็น participle phrase ขยายประโยคหลัก'),
          t2(' them to focus on more creative and strategic work. '),
          drag2('t2-ad-14-b1g', ['For instance', 'To begin with', 'Another advantage'], 'For instance', '"For instance" ยกตัวอย่าง Coca-Cola'),
          t2(', marketing teams at companies such as Coca-Cola now use AI tools to handle data analysis, '),
          typ2('t2-ad-14-b1h', 'leave', ['leaving'], 'participle', '"leaving staff more time" เป็น participle phrase ขยายประโยคหลัก'),
          t2(' staff more time for campaign design.')
        ]
      },
      {
        id: 'gb2-ai-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          t2('However, some might be concerned regarding the widespread job losses that automation may cause. This is because machines can increasingly '),
          typ2('t2-ad-14-b2a', 'replace', ['replace'], 'verb-tense', 'ขนานกับ can + base verb'),
          t2(' roles in manufacturing, customer service, and even basic administration. '),
          drag2('t2-ad-14-b2start', ['To illustrate', 'For example', 'However'], 'To illustrate', '"To illustrate" ยกตัวอย่างรายงานของ McKinsey'),
          t2(', a 2023 McKinsey report '),
          typ2('t2-ad-14-b2b', 'estimate', ['estimated'], 'verb-tense', 'past simple เล่าผลรายงานในอดีต'),
          t2(' that automation could displace up to 30% of current jobs worldwide by 2030. '),
          drag2('t2-ad-14-b2mid', ['However', 'To illustrate', 'For example'], 'However', '"However" เปิดประโยคโต้แย้งข้อกังวล'),
          t2(', this argument is simply invalid given that new technologies typically '),
          typ2('t2-ad-14-b2c', 'create', ['create'], 'verb-tense', 'present simple ประธาน "technologies" พหูพจน์'),
          t2(' fresh employment opportunities in emerging industries. '),
          drag2('t2-ad-14-b2e', ['For example', 'To illustrate', 'However'], 'For example', '"For example" ยกตัวอย่างอาชีพใหม่จาก AI'),
          t2(', the rise of AI has '),
          typ2('t2-ad-14-b2d', 'generate', ['generated'], 'verb-tense', 'present perfect "has generated"'),
          t2(' entirely new careers in data labelling and machine-learning engineering, roles that barely existed a decade ago.')
        ]
      },
      {
        id: 'gb2-ai-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-ad-14-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that some might be concerned in terms of job losses caused by automation, I am of the opinion that the benefits of artificial intelligence in the workplace, including efficiency and new job creation, are far greater than the drawbacks.')
        ]
      }
    ]
  },
  {
    id: 'gb2-robots-in-society',
    promptId: 't2-ad-15',
    steps: [
      {
        id: 'gb2-rb-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('It has been widely argued that while the growing use of robots in society is both beneficial and '),
          typ2('t2-ad-15-i0', 'detriment', ['detrimental'], 'participle', '"detrimental to human development" เป็นคำคุณศัพท์ขยาย human development'),
          t2(' to human development, this essay argues that the benefits are far greater than the drawbacks.')
        ]
      },
      {
        id: 'gb2-rb-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-ad-15-b1start', ['To begin with', 'Another advantage', 'For example'], 'To begin with', '"To begin with" เปิดย่อหน้าแรกเสมอ'),
          t2(', there are a number of benefits associated with the growing use of robots in society. The first benefit is that robots can '),
          typ2('t2-ad-15-b1a', 'perform', ['perform'], 'verb-tense', 'ขนานกับ can + base verb'),
          t2(' dangerous tasks that would otherwise put human workers at serious risk. '),
          drag2('t2-ad-15-b1b', ['For example', 'Another advantage', 'To begin with'], 'For example', '"For example" ยกตัวอย่างการปลดชนวนระเบิด'),
          t2(', robots are now routinely used to '),
          typ2('t2-ad-15-b1c', 'defuse', ['defuse'], 'verb-tense', 'ขนานกับ to + base verb หลัง used to'),
          t2(' explosives and '),
          typ2('t2-ad-15-b1d', 'inspect', ['inspect'], 'verb-tense', 'ขนานกับ defuse'),
          t2(' damaged nuclear reactors, including at the Fukushima plant in Japan. '),
          drag2('t2-ad-15-b1e', ['Another advantage', 'To begin with', 'For example'], 'Another advantage', '"Another advantage" เพิ่มประโยชน์ข้อที่สอง'),
          t2(' is that robots dramatically improve precision and efficiency in fields such as medicine. '),
          drag2('t2-ad-15-b1f', ['For instance', 'To begin with', 'Another advantage'], 'For instance', '"For instance" ยกตัวอย่างโรงพยาบาล Johns Hopkins'),
          t2(', surgeons '),
          typ2('t2-ad-15-b1g', 'use', ['using'], 'verb-tense', '"surgeons using robotic-assisted systems" เป็น participle phrase ขยาย surgeons'),
          t2(' robotic-assisted systems at Johns Hopkins Hospital have reported significantly fewer complications during complex operations in recent years.')
        ]
      },
      {
        id: 'gb2-rb-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          t2('However, some might be concerned regarding the potential for robots to replace human workers and reduce social interaction. This is because increasing automation may '),
          typ2('t2-ad-15-b2a', 'leave', ['leave'], 'verb-tense', 'ขนานกับ may + base verb'),
          t2(' many low-skilled workers permanently unemployed. '),
          drag2('t2-ad-15-b2start', ['To illustrate', 'For example', 'However'], 'To illustrate', '"To illustrate" ยกตัวอย่างเมืองอุตสาหกรรมในอเมริกา'),
          t2(', several manufacturing towns in the American Midwest have '),
          typ2('t2-ad-15-b2b', 'experience', ['experienced'], 'verb-tense', 'present perfect "have experienced"'),
          t2(' sharp job losses since factories '),
          typ2('t2-ad-15-b2c', 'introduce', ['introduced'], 'verb-tense', 'past simple "introduced" หลัง since'),
          t2(' robotic assembly lines. '),
          drag2('t2-ad-15-b2mid', ['However', 'To illustrate', 'For example'], 'However', '"However" เปิดประโยคโต้แย้งข้อกังวล'),
          t2(', this argument is simply invalid given that displaced workers can be retrained for newly created technical and supervisory roles. '),
          drag2('t2-ad-15-b2e', ['For example', 'To illustrate', 'However'], 'For example', '"For example" ยกตัวอย่างโครงการฝึกอบรมในเยอรมนี'),
          t2(", Germany's government-funded retraining schemes have successfully "),
          typ2('t2-ad-15-b2d', 'transition', ['transitioned'], 'verb-tense', 'present perfect "have transitioned"'),
          t2(' thousands of former factory workers into robot maintenance and programming careers nationwide.')
        ]
      },
      {
        id: 'gb2-rb-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-ad-15-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that some might be concerned in terms of job losses caused by robots, I am of the opinion that the benefits of using robots in society, including safety and improved precision, are far greater than the drawbacks.')
        ]
      }
    ]
  },
  {
    id: 'gb2-living-longer-fewer-babies',
    promptId: 't2-dq-1',
    steps: [
      {
        id: 'gb2-lb-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('It has been widely argued that increasing life expectancy, '),
          typ2('t2-dq-1-i0', 'combine', ['combined'], 'participle', '"combined with falling birth rates" เป็น participle phrase ขยาย life expectancy'),
          t2(' with falling birth rates, is placing considerable pressure on governments around the world. This essay will elaborate on the problems this trend causes before suggesting some measures to solve them.')
        ]
      },
      {
        id: 'gb2-lb-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-lb-b1start', ['To begin with', 'Another challenge', 'For example'], 'To begin with', '"To begin with" เปิดย่อหน้าแรกเสมอ'),
          t2(', there are a number of challenges associated with an ageing population. The first challenge is that healthcare systems face growing pressure as elderly citizens '),
          typ2('t2-dq-1-b1a', 'require', ['require'], 'verb-tense', 'present simple ประธาน "citizens" พหูพจน์'),
          t2(' more frequent medical treatment. '),
          drag2('t2-lb-b1b', ['For example', 'Another challenge', 'To begin with'], 'For example', '"For example" ยกตัวอย่างญี่ปุ่น'),
          t2(', Japan, where more than 29% of the population is now over 65, has '),
          typ2('t2-dq-1-b1c', 'see', ['seen'], 'verb-tense', 'present perfect "has seen"'),
          t2(' its national healthcare spending rise sharply over the past decade. '),
          drag2('t2-lb-b1d', ['Another challenge', 'To begin with', 'For example'], 'Another challenge', '"Another challenge" เพิ่มปัญหาข้อที่สอง'),
          t2(' is that a shrinking workforce must support a growing number of retirees. '),
          drag2('t2-lb-b1e', ['For instance', 'To begin with', 'Another challenge'], 'For instance', '"For instance" ยกตัวอย่างอิตาลี'),
          t2(', countries such as Italy now '),
          typ2('t2-dq-1-b1f', 'have', ['have'], 'verb-tense', 'present simple ประธาน "countries" พหูพจน์'),
          t2(' far fewer working-age taxpayers for every pensioner than they '),
          typ2('t2-dq-1-b1g', 'do', ['did'], 'verb-tense', 'past simple "did" เทียบกับปี 1990'),
          t2(' in 1990.')
        ]
      },
      {
        id: 'gb2-lb-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          t2('Turning to possible solutions, there are several measures that governments could adopt. The first is that '),
          typ2('t2-dq-1-b2a', 'raise', ['raising'], 'verb-tense', '"raising the retirement age" เป็น gerund phrase ทำหน้าที่ประธาน'),
          t2(' the retirement age would allow older citizens to remain economically active for longer. '),
          drag2('t2-lb-b2start', ['For example', 'Another measure', 'For instance'], 'For example', '"For example" ยกตัวอย่างเยอรมนี'),
          t2(', Germany has gradually '),
          typ2('t2-dq-1-b2b', 'raise', ['raised'], 'verb-tense', 'present perfect "has raised"'),
          t2(' its retirement age to 67 in order to ease pressure on its pension system. '),
          drag2('t2-lb-b2c', ['Another measure', 'For example', 'For instance'], 'Another measure', '"Another measure" เพิ่มมาตรการข้อที่สอง'),
          t2(' is that '),
          typ2('t2-dq-1-b2d', 'encourage', ['encouraging'], 'verb-tense', '"encouraging higher birth rates" เป็น gerund phrase ทำหน้าที่ประธาน'),
          t2(' higher birth rates through financial incentives could help rebalance the population over time. '),
          drag2('t2-lb-b2e', ['For instance', 'For example', 'Another measure'], 'For instance', '"For instance" ยกตัวอย่างฝรั่งเศส'),
          t2(', France offers generous childcare subsidies, which have '),
          typ2('t2-dq-1-b2f', 'help', ['helped'], 'verb-tense', 'present perfect "have helped"'),
          t2(' it maintain one of the highest birth rates in Europe.')
        ]
      },
      {
        id: 'gb2-lb-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-lb-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that an ageing population creates serious challenges for governments, I am of the opinion that a combination of workforce reform and family support policies can help societies adapt successfully over the coming decades.')
        ]
      }
    ]
  },
  {
    id: 'gb2-older-people-technology',
    promptId: 't2-dq-2',
    steps: [
      {
        id: 'gb2-ot-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('It has been '),
          sel2(
            't2-dq-2-i1',
            ['widely', 'wide', 'widen'],
            'widely',
            'adverb',
            'widely เป็น adverb ขยาย argued; wide เป็น adjective และ widen เป็น verb'
          ),
          t2(' argued that '),
          drag2(
            't2-dq-2-i2',
            ['while', 'because', 'therefore'],
            'while',
            'while เชื่อมแนวคิดที่ขัดกัน: เทคโนโลยีมีประโยชน์ แต่ผู้สูงอายุยังใช้งานยาก'
          ),
          t2(' '),
          sel2(
            't2-dq-2-i3',
            ['advanced', 'advance', 'advancement'],
            'advanced',
            'adjective',
            'advanced เป็น adjective ขยายคำนาม technology'
          ),
          t2(' technology has '),
          typ2('t2-dq-2-i0', 'bring', ['brought'], 'verb-tense', 'present perfect "has brought"'),
          t2(' many '),
          sel2(
            't2-dq-2-i4',
            ['beneficial', 'benefit', 'beneficially'],
            'beneficial',
            'adjective',
            'beneficial เป็น adjective ขยาย changes; benefit เป็น noun/verb และ beneficially เป็น adverb'
          ),
          t2(' changes to the world, many older people today '),
          typ2(
            't2-dq-2-i5',
            'struggle',
            ['struggle'],
            'verb-tense',
            'present simple ประธาน many older people เป็นพหูพจน์ จึงใช้ struggle ไม่เติม -s'
          ),
          t2(' to make use of devices such as smartphones and the Internet. This essay will elaborate on the benefits older people could gain from using technology more before suggesting some measures to encourage them to do so.')
        ]
      },
      {
        id: 'gb2-ot-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-ot-b1start', ['To begin with', 'Another benefit', 'For example'], 'To begin with', '"To begin with" เปิดย่อหน้าแรกเสมอ'),
          t2(', there are a number of '),
          sel2(
            't2-dq-2-b1-benefits',
            ['benefits', 'benefit', 'beneficial'],
            'benefits',
            'plural',
            'a number of + plural noun จึงต้องใช้ benefits'
          ),
          t2(' older people could '),
          typ2(
            't2-dq-2-b1-gain',
            'gain',
            ['gain'],
            'verb-tense',
            'หลัง modal could ใช้กริยารูปพื้นฐาน gain'
          ),
          t2(' from '),
          sel2(
            't2-dq-2-b1-advanced',
            ['advanced', 'advance', 'advancing'],
            'advanced',
            'adjective',
            'advanced technology ใช้ adjective ขยายคำนาม'
          ),
          t2(' technology. The first benefit is that video-calling applications '),
          typ2('t2-dq-2-b1a', 'allow', ['allow'], 'verb-tense', 'present simple ประธาน "applications" พหูพจน์'),
          t2(' elderly people to stay in '),
          sel2(
            't2-dq-2-b1-regular',
            ['regular', 'regularly', 'regularity'],
            'regular',
            'adjective',
            'regular เป็น adjective ขยายคำนาม contact'
          ),
          t2(' contact with family members who '),
          typ2('t2-dq-2-b1b', 'live', ['live'], 'verb-tense', 'present simple ประธาน "who" (family members) พหูพจน์'),
          t2(' far away. '),
          drag2('t2-ot-b1c', ['For example', 'Another benefit', 'To begin with'], 'For example', '"For example" ยกตัวอย่างปู่ย่าตายาย'),
          t2(', many grandparents now use video calls to see their grandchildren grow up despite '),
          typ2('t2-dq-2-b1d', 'live', ['living'], 'verb-tense', '"despite living in different countries" เป็น gerund หลัง preposition despite'),
          t2(' in different countries'),
          punc2(
            't2-dq-2-b1-punct',
            ['period', 'comma', 'none'],
            'period',
            'จบประโยคตัวอย่างสมบูรณ์ก่อนเริ่ม Another benefit จึงใช้ full stop'
          ),
          t2(' '),
          drag2('t2-ot-b1e', ['Another benefit', 'To begin with', 'For example'], 'Another benefit', '"Another benefit" เพิ่มประโยชน์ข้อที่สอง'),
          t2(' is that health-monitoring devices can alert both elderly users and their doctors to medical problems at an early stage. '),
          drag2('t2-ot-b1f', ['For instance', 'To begin with', 'Another benefit'], 'For instance', '"For instance" ยกตัวอย่างอุปกรณ์สวมใส่'),
          t2(', wearable devices that '),
          typ2('t2-dq-2-b1g', 'track', ['track'], 'verb-tense', 'present simple ประธาน "that" (devices) พหูพจน์'),
          t2(' heart rate can warn users of irregular patterns before a serious health issue develops.')
        ]
      },
      {
        id: 'gb2-ot-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          t2('Turning to possible measures, there are '),
          sel2(
            't2-dq-2-b2-several',
            ['several', 'severely', 'severity'],
            'several',
            'adjective',
            'several เป็น quantifier ขยายคำนามพหูพจน์ ways'
          ),
          t2(' ways older people could be '),
          typ2(
            't2-dq-2-b2-encouraged',
            'encourage',
            ['encouraged'],
            'participle',
            'could be + V3 เป็น passive voice จึงใช้ encouraged'
          ),
          t2(' to use '),
          sel2(
            't2-dq-2-b2-electronics',
            ['consumer electronics', 'electronic consumers', 'consuming electronics'],
            'consumer electronics',
            'noun',
            'consumer electronics เป็น noun phrase หมายถึงอุปกรณ์อิเล็กทรอนิกส์สำหรับผู้บริโภค'
          ),
          t2(' more often. The first is that community centres could offer free, '),
          sel2(
            't2-dq-2-b2-beginner',
            ['beginner-friendly', 'beginner-friend', 'friendly-begin'],
            'beginner-friendly',
            'adjective',
            'beginner-friendly เป็น compound adjective ขยาย technology classes'
          ),
          t2(' technology classes '),
          typ2('t2-dq-2-b2a', 'design', ['designed'], 'participle', '"designed specifically for older residents" เป็น participle phrase ขยาย classes'),
          t2(' specifically for older residents'),
          punc2(
            't2-dq-2-b2-punct',
            ['period', 'comma', 'none'],
            'period',
            'ประโยคมาตรการแรกจบสมบูรณ์ก่อน For example จึงต้องใช้ full stop'
          ),
          t2(' '),
          drag2('t2-ot-b2start', ['For example', 'Another measure', 'For instance'], 'For example', '"For example" ยกตัวอย่างห้องสมุดในสหราชอาณาจักร'),
          t2(', local libraries in several UK cities now '),
          typ2('t2-dq-2-b2b', 'run', ['run'], 'verb-tense', 'present simple ประธาน "libraries" พหูพจน์'),
          t2(' weekly digital skills workshops for elderly visitors. '),
          drag2('t2-ot-b2c', ['Another measure', 'For example', 'For instance'], 'Another measure', '"Another measure" เพิ่มมาตรการข้อที่สอง'),
          t2(' is that manufacturers could design devices with simpler interfaces and larger text specifically for older users. '),
          drag2('t2-ot-b2e', ['For instance', 'For example', 'Another measure'], 'For instance', '"For instance" ยกตัวอย่าง easy mode'),
          t2(', some smartphone models now '),
          typ2('t2-dq-2-b2f', 'include', ['include'], 'verb-tense', 'present simple ประธาน "models" พหูพจน์'),
          t2(' an "easy mode" that '),
          typ2('t2-dq-2-b2g', 'display', ['displays'], 'verb-tense', 'ประธาน "that" (easy mode) เอกพจน์ จึงใช้ displays'),
          t2(' larger icons and fewer menu options.')
        ]
      },
      {
        id: 'gb2-ot-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-ot-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that many older people currently struggle with modern technology, I am of the opinion that accessible training and better device design can help them enjoy its full benefits.')
        ]
      }
    ]
  },
  {
    id: 'gb2-fresh-water-shortage',
    promptId: 't2-dq-3',
    steps: [
      {
        id: 'gb2-fw-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('It has been widely argued that access to fresh water has '),
          typ2('t2-dq-3-i0', 'become', ['become'], 'verb-tense', 'present perfect "has become"'),
          t2(' a growing global problem in recent years. This essay will elaborate on the reasons for this before suggesting some solutions to tackle this issue.')
        ]
      },
      {
        id: 'gb2-fw-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-fw-b1start', ['To begin with', 'Another reason', 'For example'], 'To begin with', '"To begin with" เปิดย่อหน้าแรกเสมอ'),
          t2(', there are a number of reasons why fresh water has become scarce in many regions. The first reason is that rising global temperatures are '),
          typ2('t2-dq-3-b1a', 'cause', ['causing'], 'verb-tense', '"are causing" present continuous แสดงแนวโน้มต่อเนื่อง'),
          t2(' rivers, lakes, and glaciers to shrink at unprecedented rates. '),
          drag2('t2-fw-b1b', ['For example', 'Another reason', 'To begin with'], 'For example', '"For example" ยกตัวอย่างแม่น้ำโคโลราโด'),
          t2(', the Colorado River in the United States now regularly '),
          typ2('t2-dq-3-b1c', 'run', ['runs'], 'verb-tense', 'ประธาน "River" เอกพจน์ จึงใช้ runs'),
          t2(' dry before reaching the sea due to prolonged drought. '),
          drag2('t2-fw-b1d', ['Another reason', 'To begin with', 'For example'], 'Another reason', '"Another reason" เพิ่มสาเหตุข้อที่สอง'),
          t2(' is that rapid population growth has significantly '),
          typ2('t2-dq-3-b1e', 'increase', ['increased'], 'verb-tense', 'present perfect "has increased"'),
          t2(' overall water demand for agriculture and industry, particularly in rapidly '),
          typ2('t2-dq-3-b1f', 'urbanise', ['urbanising'], 'participle', '"rapidly urbanising regions" เป็นคำคุณศัพท์ขยาย regions'),
          t2(' regions. '),
          drag2('t2-fw-b1g', ['For instance', 'To begin with', 'Another reason'], 'For instance', '"For instance" ยกตัวอย่างอินเดีย'),
          t2(', countries such as India now use groundwater faster than natural rainfall can replenish it.')
        ]
      },
      {
        id: 'gb2-fw-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          t2('Turning to possible solutions, there are several measures that could help address this problem. The first is that governments could invest in modern irrigation systems that '),
          typ2('t2-dq-3-b2a', 'use', ['use'], 'verb-tense', 'ประธาน "that" (systems) พหูพจน์'),
          t2(' significantly less water than traditional methods. '),
          drag2('t2-fw-b2start', ['For example', 'Another measure', 'For instance'], 'For example', '"For example" ยกตัวอย่างอิสราเอล'),
          t2(', Israel has become a world leader in drip irrigation technology, '),
          typ2('t2-dq-3-b2b', 'cut', ['cutting'], 'participle', '"cutting agricultural water use" เป็น participle phrase ขยายประโยคหลัก'),
          t2(' agricultural water use dramatically. '),
          drag2('t2-fw-b2c', ['Another measure', 'For example', 'For instance'], 'Another measure', '"Another measure" เพิ่มมาตรการข้อที่สอง'),
          t2(' is that individuals could reduce personal water waste through simple daily habits, such as '),
          typ2('t2-dq-3-b2d', 'take', ['taking'], 'verb-tense', '"such as taking shorter showers" เป็น gerund หลัง such as'),
          t2(' shorter showers and '),
          typ2('t2-dq-3-b2e', 'fix', ['fixing'], 'verb-tense', 'ขนานกับ taking'),
          t2(' leaking taps. '),
          drag2('t2-fw-b2f', ['For instance', 'For example', 'Another measure'], 'For instance', '"For instance" ยกตัวอย่างก๊อกน้ำหยด'),
          t2(', a single dripping tap can waste more than 20 litres of water every single day.')
        ]
      },
      {
        id: 'gb2-fw-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-fw-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that fresh water scarcity is a complex global issue, I am of the opinion that a combination of government investment and individual responsibility can significantly ease this problem.')
        ]
      }
    ]
  },
  {
    id: 'gb2-drivers-break-road-safety-laws',
    promptId: 't2-dq-4',
    steps: [
      {
        id: 'gb2-dr-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('It has been widely argued that although driving laws exist in every country to ensure road safety, many drivers continue to break them by '),
          typ2('t2-dq-4-i0', 'speed', ['speeding'], 'verb-tense', '"speeding or using mobile phones" เป็น gerund หลัง preposition by'),
          t2(' or '),
          typ2('t2-dq-4-i1', 'use', ['using'], 'verb-tense', 'ขนานกับ speeding'),
          t2(' mobile phones while driving. This essay will elaborate on the reasons behind this behaviour before suggesting some measures to tackle this issue.')
        ]
      },
      {
        id: 'gb2-dr-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-dr-b1start', ['To begin with', 'Another reason', 'For example'], 'To begin with', '"To begin with" เปิดย่อหน้าแรกเสมอ'),
          t2(', there are a number of reasons why drivers continue to break road safety laws. The first reason is that many drivers '),
          typ2('t2-dq-4-b1a', 'underestimate', ['underestimate'], 'verb-tense', 'present simple ประธาน "drivers" พหูพจน์'),
          t2(' the risks involved, '),
          typ2('t2-dq-4-b1b', 'believe', ['believing'], 'participle', '"believing that breaking minor rules..." เป็น participle phrase ขยายประโยคหลัก'),
          t2(' that breaking minor rules will not lead to an accident. '),
          drag2('t2-dr-b1c', ['For example', 'Another reason', 'To begin with'], 'For example', '"For example" ยกตัวอย่างงานสำรวจผู้ขับขี่'),
          t2(', surveys of drivers who use their phones at the wheel often '),
          typ2('t2-dq-4-b1d', 'reveal', ['reveal'], 'verb-tense', 'present simple ประธาน "surveys" พหูพจน์'),
          t2(' that most believe they can do so safely just this once. '),
          drag2('t2-dr-b1e', ['Another reason', 'To begin with', 'For example'], 'Another reason', '"Another reason" เพิ่มสาเหตุข้อที่สอง'),
          t2(' is that penalties for these offences are often too weak to act as an effective deterrent. '),
          drag2('t2-dr-b1f', ['For instance', 'To begin with', 'Another reason'], 'For instance', '"For instance" ยกตัวอย่างค่าปรับ'),
          t2(', fines for '),
          typ2('t2-dq-4-b1g', 'use', ['using'], 'verb-tense', '"fines for using a mobile phone" เป็น gerund หลัง preposition for'),
          t2(' a mobile phone while driving remain relatively low in several countries compared to the potential harm caused.')
        ]
      },
      {
        id: 'gb2-dr-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          t2('Turning to possible solutions, there are several measures that could help solve this problem. The first is that governments could introduce stricter penalties, such as higher fines and automatic licence suspensions for repeat offenders. '),
          drag2('t2-dr-b2start', ['For example', 'Another measure', 'For instance'], 'For example', '"For example" ยกตัวอย่างระบบสะสมแต้ม'),
          t2(', some countries have successfully '),
          typ2('t2-dq-4-b2a', 'reduce', ['reduced'], 'verb-tense', 'present perfect "have reduced"'),
          t2(' phone-related accidents after '),
          typ2('t2-dq-4-b2b', 'introduce', ['introducing'], 'verb-tense', '"after introducing" เป็น gerund หลัง preposition after'),
          t2(' points-based licence systems. '),
          drag2('t2-dr-b2c', ['Another measure', 'For example', 'For instance'], 'Another measure', '"Another measure" เพิ่มมาตรการข้อที่สอง'),
          t2(' is that technology companies could design devices that automatically restrict phone use whenever a vehicle is moving. '),
          drag2('t2-dr-b2e', ['For instance', 'For example', 'Another measure'], 'For instance', '"For instance" ยกตัวอย่างโหมดขับขี่ในสมาร์ทโฟน'),
          t2(', several smartphone models now include a driving mode that '),
          typ2('t2-dq-4-b2c', 'silence', ['silences'], 'verb-tense', 'ประธาน "that" (driving mode) เอกพจน์ จึงใช้ silences'),
          t2(' notifications once the car reaches a certain speed.')
        ]
      },
      {
        id: 'gb2-dr-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-dr-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that changing driver behaviour takes time, I am of the opinion that stricter penalties combined with smarter technology can significantly improve road safety.')
        ]
      }
    ]
  },
  {
    id: 'gb2-giving-children-everything',
    promptId: 't2-dq-5',
    steps: [
      {
        id: 'gb2-gc-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('It has been widely argued that some parents give their children everything they ask for or '),
          typ2('t2-dq-5-i0', 'allow', ['allow'], 'verb-tense', 'present simple ประธาน "parents" พหูพจน์'),
          t2(' them complete freedom to do as they wish. This essay will elaborate on why this parenting style is not beneficial for children before discussing the consequences they may face once they grow up.')
        ]
      },
      {
        id: 'gb2-gc-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-gc-b1start', ['To begin with', 'Another reason', 'For example'], 'To begin with', '"To begin with" เปิดย่อหน้าแรกเสมอ'),
          t2(', there are a number of reasons why this parenting style is not beneficial for children. The first reason is that children who '),
          typ2('t2-dq-5-b1a', 'receive', ['receive'], 'verb-tense', 'present simple ประธาน "who" (children) พหูพจน์'),
          t2(' everything they want rarely learn the value of patience or hard work. '),
          drag2('t2-gc-b1b', ['For example', 'Another reason', 'To begin with'], 'For example', '"For example" ยกตัวอย่างของขวัญราคาแพง'),
          t2(', children '),
          typ2('t2-dq-5-b1c', 'give', ['given'], 'participle', '"children given expensive gifts" เป็น participle phrase ขยาย children'),
          t2(' expensive gifts without any effort attached often show little appreciation for what they receive. '),
          drag2('t2-gc-b1d', ['Another reason', 'To begin with', 'For example'], 'Another reason', '"Another reason" เพิ่มสาเหตุข้อที่สอง'),
          t2(' is that children '),
          typ2('t2-dq-5-b1e', 'allow', ['allowed'], 'participle', '"children allowed complete freedom" เป็น participle phrase ขยาย children'),
          t2(' complete freedom rarely learn to respect boundaries or authority. '),
          drag2('t2-gc-b1f', ['For instance', 'To begin with', 'Another reason'], 'For instance', '"For instance" ยกตัวอย่างครูรายงาน'),
          t2(', teachers frequently '),
          typ2('t2-dq-5-b1g', 'report', ['report'], 'verb-tense', 'present simple ประธาน "teachers" พหูพจน์'),
          t2(' that children '),
          typ2('t2-dq-5-b1h', 'raise', ['raised'], 'participle', '"children raised without firm rules" เป็น participle phrase ขยาย children'),
          t2(' without firm rules at home struggle to follow classroom guidelines.')
        ]
      },
      {
        id: 'gb2-gc-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          t2('Turning to the possible consequences, there are several ways this upbringing could affect these children later in life. The first is that they may struggle with discipline and responsibility once they enter the workplace. '),
          drag2('t2-gc-b2start', ['For example', 'Another consequence', 'For instance'], 'For example', '"For example" ยกตัวอย่างนายจ้าง'),
          t2(', employers often note that young employees who '),
          typ2('t2-dq-5-b2a', 'lack', ['lacked'], 'verb-tense', 'past simple "lacked structure as children"'),
          t2(' structure as children find it harder to meet deadlines and follow instructions. '),
          drag2('t2-gc-b2c', ['Another consequence', 'For example', 'For instance'], 'Another consequence', '"Another consequence" เพิ่มผลกระทบข้อที่สอง'),
          t2(' is that they may develop unrealistic expectations about how the wider world treats them. '),
          drag2('t2-gc-b2e', ['For instance', 'For example', 'Another consequence'], 'For instance', '"For instance" ยกตัวอย่างผู้ใหญ่ที่ไม่เคยถูกปฏิเสธ'),
          t2(', adults who were rarely '),
          typ2('t2-dq-5-b2f', 'tell', ['told'], 'verb-tense', 'passive voice "were told" (past participle)'),
          t2(' "no" as children often struggle to cope with rejection or failure later in life.')
        ]
      },
      {
        id: 'gb2-gc-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-gc-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that parents want their children to be happy, I am of the opinion that giving children everything they want ultimately causes more harm than good.')
        ]
      }
    ]
  },
  {
    id: 'gb2-personal-fitness-trainers',
    promptId: 't2-dq-6',
    steps: [
      {
        id: 'gb2-pt-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('It has been widely argued that increasing numbers of people are now '),
          typ2('t2-dq-6-i0', 'choose', ['choosing'], 'verb-tense', '"are now choosing" present continuous แสดงแนวโน้มปัจจุบัน'),
          t2(' to hire a personal fitness trainer instead of playing sport or attending exercise classes. This essay will elaborate on the reasons for this before discussing whether this is a positive or a negative development.')
        ]
      },
      {
        id: 'gb2-pt-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-pt-b1start', ['To begin with', 'Another reason', 'For example'], 'To begin with', '"To begin with" เปิดย่อหน้าแรกเสมอ'),
          t2(', there are a number of reasons associated with the growing popularity of personal training. The first reason is that busy professionals often prefer a flexible schedule that fits around demanding work commitments. '),
          drag2('t2-pt-b1b', ['For example', 'Another reason', 'To begin with'], 'For example', '"For example" ยกตัวอย่างงานสำรวจ IHRSA'),
          t2(", a 2023 survey by the International Health, Racquet and Sportsclub Association "),
          typ2('t2-dq-6-b1a', 'find', ['found'], 'verb-tense', 'past simple เล่าผลการสำรวจในอดีต'),
          t2(' that over 60% of new gym members in the United States '),
          typ2('t2-dq-6-b1b', 'book', ['booked'], 'verb-tense', 'past simple ขนานกับ found'),
          t2(' sessions with a trainer to save time. '),
          drag2('t2-pt-b1c', ['Another reason', 'To begin with', 'For example'], 'Another reason', '"Another reason" เพิ่มสาเหตุข้อที่สอง'),
          t2(' is that this is because many people lack the confidence to exercise correctly on their own. '),
          drag2('t2-pt-b1d', ['For instance', 'To begin with', 'Another reason'], 'For instance', '"For instance" ยกตัวอย่างผู้เริ่มต้นใช้ยิม'),
          t2(', first-time gym users frequently '),
          typ2('t2-dq-6-b1c', 'report', ['report'], 'verb-tense', 'present simple ประธาน "users" พหูพจน์'),
          t2(' feeling intimidated by group classes filled with more experienced participants.')
        ]
      },
      {
        id: 'gb2-pt-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          t2('With regard to my opinion, I would argue that this is a positive development. '),
          drag2('t2-pt-b2start', ['To explain it simply', 'To illustrate', 'In this sense'], 'To explain it simply', '"To explain it simply" เปิดประโยคอธิบายเหตุผล'),
          t2(', this is because a qualified trainer can design a safe, personalised programme that '),
          typ2('t2-dq-6-b2a', 'reduce', ['reduces'], 'verb-tense', 'ประธาน "that" (programme) เอกพจน์ จึงใช้ reduces'),
          t2(' the risk of injury compared with unsupervised exercise. '),
          drag2('t2-pt-b2b', ['To illustrate', 'To explain it simply', 'In this sense'], 'To illustrate', '"To illustrate" ยกตัวอย่างคลินิกกายภาพบำบัด'),
          t2(', physiotherapy clinics in the UK have '),
          typ2('t2-dq-6-b2c', 'report', ['reported'], 'verb-tense', 'present perfect "have reported"'),
          t2(' fewer gym-related injuries among clients who '),
          typ2('t2-dq-6-b2d', 'train', ['train'], 'verb-tense', 'present simple ประธาน "who" (clients) พหูพจน์'),
          t2(' under professional supervision. '),
          drag2('t2-pt-b2e', ['In this sense', 'To explain it simply', 'To illustrate'], 'In this sense', '"In this sense" สรุปย่อหน้าความเห็น'),
          t2(', it is evident that personal training offers genuine health benefits that extend well beyond simple convenience.')
        ]
      },
      {
        id: 'gb2-pt-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-pt-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that hiring a personal trainer can be expensive for many households, I am of the opinion that the safety and motivation it provides make this a beneficial trend overall.')
        ]
      }
    ]
  },
  {
    id: 'gb2-money-as-a-gift',
    promptId: 't2-dq-7',
    steps: [
      {
        id: 'gb2-mg-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('It has been widely argued that more and more people now '),
          typ2('t2-dq-7-i0', 'choose', ['choose'], 'verb-tense', 'present simple ประธาน "people" พหูพจน์'),
          t2(' to give money on special occasions rather than gifts chosen personally. This essay will elaborate on the reasons for this before discussing whether this is a positive or a negative development.')
        ]
      },
      {
        id: 'gb2-mg-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-mg-b1start', ['To begin with', 'Another reason', 'For example'], 'To begin with', '"To begin with" เปิดย่อหน้าแรกเสมอ'),
          t2(', there are a number of reasons associated with this shift towards monetary gifts. The first reason is that busy modern lifestyles '),
          typ2('t2-dq-7-b1a', 'leave', ['leave'], 'verb-tense', 'present simple ประธาน "lifestyles" พหูพจน์'),
          t2(' people with very little free time to search for a suitable present. '),
          drag2('t2-mg-b1b', ['For example', 'Another reason', 'To begin with'], 'For example', '"For example" ยกตัวอย่างงานสำรวจ Deloitte'),
          t2(', a 2022 survey by Deloitte '),
          typ2('t2-dq-7-b1c', 'find', ['found'], 'verb-tense', 'past simple เล่าผลการสำรวจในอดีต'),
          t2(' that nearly half of consumers in the United States '),
          typ2('t2-dq-7-b1d', 'prefer', ['preferred'], 'verb-tense', 'past simple ขนานกับ found'),
          t2(' giving cash during the holiday season because it required considerably less effort. '),
          drag2('t2-mg-b1e', ['Another reason', 'To begin with', 'For example'], 'Another reason', '"Another reason" เพิ่มสาเหตุข้อที่สอง'),
          t2(' is that this is because many givers worry about '),
          typ2('t2-dq-7-b1f', 'choose', ['choosing'], 'verb-tense', '"worry about choosing" เป็น gerund หลัง preposition about'),
          t2(' something the recipient will not actually like or use. '),
          drag2('t2-mg-b1g', ['For instance', 'To begin with', 'Another reason'], 'For instance', '"For instance" ยกตัวอย่างของขวัญที่ไม่ต้องการ'),
          t2(', unwanted gifts are frequently '),
          typ2('t2-dq-7-b1h', 'return', ['returned'], 'verb-tense', 'passive voice "are returned"'),
          t2(' to shops or left unused in cupboards for several years afterwards.')
        ]
      },
      {
        id: 'gb2-mg-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          t2('With regard to my opinion, I would argue that this is a positive development. '),
          drag2('t2-mg-b2start', ['To explain it simply', 'To illustrate', 'In this sense'], 'To explain it simply', '"To explain it simply" เปิดประโยคอธิบายเหตุผล'),
          t2(', money allows the recipient to choose exactly what they need or want, '),
          typ2('t2-dq-7-b2a', 'reduce', ['reducing'], 'participle', '"reducing unnecessary waste" เป็น participle phrase ขยายประโยคหลัก'),
          t2(' unnecessary waste considerably. '),
          drag2('t2-mg-b2b', ['To illustrate', 'To explain it simply', 'In this sense'], 'To illustrate', '"To illustrate" ยกตัวอย่างองค์กรการกุศลในอินเดีย'),
          t2(', several charities in India have '),
          typ2('t2-dq-7-b2c', 'report', ['reported'], 'verb-tense', 'present perfect "have reported"'),
          t2(' that unwanted physical gifts often end up '),
          typ2('t2-dq-7-b2d', 'discard', ['discarded'], 'verb-tense', 'passive voice "end up discarded"'),
          t2(', whereas cash donations are rarely wasted in this way. '),
          drag2('t2-mg-b2e', ['In this sense', 'To explain it simply', 'To illustrate'], 'In this sense', '"In this sense" สรุปย่อหน้าความเห็น'),
          t2(', it is evident that monetary gifts can be a more practical and considerate choice than many people assume.')
        ]
      },
      {
        id: 'gb2-mg-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-mg-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that a personally chosen gift can feel more thoughtful and meaningful, I am of the opinion that giving money instead is ultimately a sensible and welcome trend.')
        ]
      }
    ]
  },
  {
    id: 'gb2-declining-art-gallery-visitors',
    promptId: 't2-dq-8',
    steps: [
      {
        id: 'gb2-ag-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('It has been widely argued that the number of people '),
          typ2('t2-dq-8-i0', 'visit', ['visiting'], 'verb-tense', '"people visiting art galleries" เป็น participle phrase ขยาย people'),
          t2(' art galleries is declining in many countries. This essay will elaborate on the reasons for this before suggesting some solutions to tackle this issue.')
        ]
      },
      {
        id: 'gb2-ag-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-ag-b1start', ['To begin with', 'Another reason', 'For example'], 'To begin with', '"To begin with" เปิดย่อหน้าแรกเสมอ'),
          t2(', there are a number of reasons associated with falling gallery attendance. The first reason is that free digital images of famous artworks are now widely available online, which '),
          typ2('t2-dq-8-b1a', 'reduce', ['reduces'], 'verb-tense', 'ประธาน "which" (availability) เอกพจน์ จึงใช้ reduces'),
          t2(' the need to visit a gallery in person. '),
          drag2('t2-ag-b1b', ['For example', 'Another reason', 'To begin with'], 'For example', '"For example" ยกตัวอย่าง Google Arts and Culture'),
          t2(', the Google Arts and Culture platform '),
          typ2('t2-dq-8-b1c', 'allow', ['allows'], 'verb-tense', 'ประธาน "platform" เอกพจน์ จึงใช้ allows'),
          t2(' users to view thousands of high-resolution paintings from major museums without '),
          typ2('t2-dq-8-b1d', 'leave', ['leaving'], 'verb-tense', '"without leaving home" เป็น gerund หลัง preposition without'),
          t2(' home. '),
          drag2('t2-ag-b1e', ['Another reason', 'To begin with', 'For example'], 'Another reason', '"Another reason" เพิ่มสาเหตุข้อที่สอง'),
          t2(' is that this is because many young people simply find traditional galleries unappealing compared with more interactive forms of entertainment. '),
          drag2('t2-ag-b1f', ['For instance', 'To begin with', 'Another reason'], 'For instance', '"For instance" ยกตัวอย่างงานวิจัยของ DCMS'),
          t2(", a 2021 study by the UK's Department for Digital, Culture, Media and Sport "),
          typ2('t2-dq-8-b1g', 'find', ['found'], 'verb-tense', 'past simple เล่าผลการศึกษาในอดีต'),
          t2(' that visitors under 25 made up the smallest share of gallery attendance.')
        ]
      },
      {
        id: 'gb2-ag-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          t2('Turning to possible solutions, there are several measures that could help address this problem. The first is that galleries could introduce interactive exhibits, such as touchscreens and augmented reality displays, to attract younger visitors. '),
          drag2('t2-ag-b2start', ['For example', 'Another measure', 'For instance'], 'For example', '"For example" ยกตัวอย่างพิพิธภัณฑ์ Louvre'),
          t2(', the Louvre in Paris now offers a virtual reality tour of the Mona Lisa that has '),
          typ2('t2-dq-8-b2a', 'draw', ['drawn'], 'verb-tense', 'present perfect "has drawn"'),
          t2(' considerable public interest. '),
          drag2('t2-ag-b2b', ['Another measure', 'For example', 'For instance'], 'Another measure', '"Another measure" เพิ่มมาตรการข้อที่สอง'),
          t2(' is that galleries could reduce or waive entry fees for students, which would make visits more affordable and accessible. '),
          drag2('t2-ag-b2e', ['For instance', 'For example', 'Another measure'], 'For instance', '"For instance" ยกตัวอย่างพิพิธภัณฑ์ในนิวยอร์ก'),
          t2(', several major museums in New York already '),
          typ2('t2-dq-8-b2c', 'offer', ['offer'], 'verb-tense', 'present simple ประธาน "museums" พหูพจน์'),
          t2(' free admission on selected evenings each month.')
        ]
      },
      {
        id: 'gb2-ag-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-ag-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that changing habits have drawn people away from traditional galleries, I am of the opinion that innovative exhibits and affordable pricing can help reverse this decline.')
        ]
      }
    ]
  },
  {
    id: 'gb2-valuing-celebrities-over-professionals',
    promptId: 't2-dq-9',
    steps: [
      {
        id: 'gb2-vc-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('It has been widely argued that sports and entertainment figures are often '),
          typ2('t2-dq-9-i0', 'value', ['valued'], 'verb-tense', 'passive voice "are valued"'),
          t2(' far more highly in society than professionals such as doctors and teachers. This essay will elaborate on the reasons for this before discussing whether this is a positive or a negative development.')
        ]
      },
      {
        id: 'gb2-vc-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-vc-b1start', ['To begin with', 'Another reason', 'For example'], 'To begin with', '"To begin with" เปิดย่อหน้าแรกเสมอ'),
          t2(', there are a number of reasons associated with this imbalance in public recognition. The first reason is that mass media and social platforms '),
          typ2('t2-dq-9-b1a', 'give', ['give'], 'verb-tense', 'present simple ประธาน "media and platforms" พหูพจน์'),
          t2(' celebrities constant exposure, which '),
          typ2('t2-dq-9-b1b', 'keep', ['keeps'], 'verb-tense', 'ประธาน "which" (exposure) เอกพจน์ จึงใช้ keeps'),
          t2(' them firmly in the public eye at all times. '),
          drag2('t2-vc-b1c', ['For example', 'Another reason', 'To begin with'], 'For example', '"For example" ยกตัวอย่าง Cristiano Ronaldo'),
          t2(', top footballers such as Cristiano Ronaldo have '),
          typ2('t2-dq-9-b1d', 'amass', ['amassed'], 'verb-tense', 'present perfect "have amassed"'),
          t2(' hundreds of millions of followers on Instagram, far more than any doctor or teacher could realistically reach. '),
          drag2('t2-vc-b1e', ['Another reason', 'To begin with', 'For example'], 'Another reason', '"Another reason" เพิ่มสาเหตุข้อที่สอง'),
          t2(' is that this is because entertainment naturally '),
          typ2('t2-dq-9-b1f', 'generate', ['generates'], 'verb-tense', 'ประธาน "entertainment" เอกพจน์ จึงใช้ generates'),
          t2(' strong emotional excitement that everyday professional work rarely produces. '),
          drag2('t2-vc-b1g', ['For instance', 'To begin with', 'Another reason'], 'For instance', '"For instance" ยกตัวอย่างการแข่งขันชิงแชมป์'),
          t2(', a single championship match can draw a global television audience of well over a billion viewers.')
        ]
      },
      {
        id: 'gb2-vc-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          t2('With regard to my opinion, I would argue that this is a negative development. '),
          drag2('t2-vc-b2start', ['To explain it simply', 'To illustrate', 'In this sense'], 'To explain it simply', '"To explain it simply" เปิดประโยคอธิบายเหตุผล'),
          t2(', this is because '),
          typ2('t2-dq-9-b2a', 'undervalue', ['undervaluing'], 'verb-tense', '"undervaluing essential professionals" เป็น gerund phrase ทำหน้าที่ประธาน'),
          t2(' essential professionals may discourage talented young people from pursuing genuinely vital careers such as medicine or teaching. '),
          drag2('t2-vc-b2b', ['To illustrate', 'To explain it simply', 'In this sense'], 'To illustrate', '"To illustrate" ยกตัวอย่างรายงาน OECD'),
          t2(', a 2020 OECD report '),
          typ2('t2-dq-9-b2c', 'find', ['found'], 'verb-tense', 'past simple เล่าผลรายงานในอดีต'),
          t2(' that several member countries were '),
          typ2('t2-dq-9-b2d', 'struggle', ['struggling'], 'verb-tense', '"were struggling" past continuous ขนานกับ found'),
          t2(' to fill teacher training places due to comparatively low salaries and social status. '),
          drag2('t2-vc-b2e', ['In this sense', 'To explain it simply', 'To illustrate'], 'In this sense', '"In this sense" สรุปย่อหน้าความเห็น'),
          t2(", it is evident that society's current priorities could ultimately weaken essential public services over time.")
        ]
      },
      {
        id: 'gb2-vc-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-vc-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that entertainment provides genuine enjoyment and welcome inspiration, I am of the opinion that this imbalance in recognition is ultimately harmful to society as a whole.')
        ]
      }
    ]
  },
  {
    id: 'gb2-decline-of-biodiversity',
    promptId: 't2-dq-10',
    steps: [
      {
        id: 'gb2-bd-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('It has been widely argued that there has been a significant decline in the diversity of plant and animal species across numerous countries in recent years. This essay will elaborate on the potential causes of this issue before '),
          typ2('t2-dq-10-i0', 'suggest', ['suggesting'], 'verb-tense', '"before suggesting" เป็น gerund หลัง preposition before'),
          t2(' some measures to mitigate it.')
        ]
      },
      {
        id: 'gb2-bd-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-bd-b1start', ['To begin with', 'Another reason', 'For example'], 'To begin with', '"To begin with" เปิดย่อหน้าแรกเสมอ'),
          t2(', there are a number of reasons associated with the loss of biodiversity worldwide. The first reason is that expanding agriculture and urban development are steadily '),
          typ2('t2-dq-10-b1a', 'destroy', ['destroying'], 'verb-tense', '"are steadily destroying" present continuous แสดงแนวโน้มต่อเนื่อง'),
          t2(' the natural habitats that countless species depend on. '),
          drag2('t2-bd-b1b', ['For example', 'Another reason', 'To begin with'], 'For example', '"For example" ยกตัวอย่างรายงาน WWF'),
          t2(', the World Wildlife Fund '),
          typ2('t2-dq-10-b1c', 'report', ['reported'], 'verb-tense', 'past simple "reported in 2022"'),
          t2(' in 2022 that global wildlife populations had '),
          typ2('t2-dq-10-b1d', 'fall', ['fallen'], 'verb-tense', 'past perfect "had fallen"'),
          t2(' by an average of 69% since 1970, largely due to habitat loss. '),
          drag2('t2-bd-b1e', ['Another reason', 'To begin with', 'For example'], 'Another reason', '"Another reason" เพิ่มสาเหตุข้อที่สอง'),
          t2(' is that this is because rising global temperatures are '),
          typ2('t2-dq-10-b1f', 'alter', ['altering'], 'verb-tense', '"are altering ecosystems" present continuous'),
          t2(' ecosystems faster than many species can adapt. '),
          drag2('t2-bd-b1g', ['For instance', 'To begin with', 'Another reason'], 'For instance', '"For instance" ยกตัวอย่าง Great Barrier Reef'),
          t2(", coral reefs in Australia's Great Barrier Reef have "),
          typ2('t2-dq-10-b1h', 'suffer', ['suffered'], 'verb-tense', 'present perfect "have suffered"'),
          t2(' repeated mass bleaching events linked directly to warming ocean waters.')
        ]
      },
      {
        id: 'gb2-bd-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          t2('Turning to possible solutions, there are several measures that could help address this problem. The first is that governments could expand protected nature reserves, which would give threatened species a safer environment in which to recover. '),
          drag2('t2-bd-b2start', ['For example', 'Another measure', 'For instance'], 'For example', '"For example" ยกตัวอย่างคอสตาริกา'),
          t2(', Costa Rica has '),
          typ2('t2-dq-10-b2a', 'double', ['doubled'], 'verb-tense', 'present perfect "has doubled"'),
          t2(' its forest cover since the 1980s through a national programme of protected reserves. '),
          drag2('t2-bd-b2b', ['Another measure', 'For example', 'For instance'], 'Another measure', '"Another measure" เพิ่มมาตรการข้อที่สอง'),
          t2(' is that international agreements could restrict trade in endangered species and the products made from them. '),
          drag2('t2-bd-b2e', ['For instance', 'For example', 'Another measure'], 'For instance', '"For instance" ยกตัวอย่างอนุสัญญา CITES'),
          t2(', the Convention on International Trade in Endangered Species has '),
          typ2('t2-dq-10-b2c', 'help', ['helped'], 'verb-tense', 'present perfect "has helped"'),
          t2(' reduce illegal ivory trafficking in several African nations.')
        ]
      },
      {
        id: 'gb2-bd-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-bd-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that biodiversity loss stems from complex global pressures, I am of the opinion that stronger conservation policies can meaningfully slow this decline.')
        ]
      }
    ]
  },
  {
    id: 'gb2-spending-money-look-younger',
    promptId: 't2-dq-11',
    steps: [
      {
        id: 'gb2-ly-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('It has been widely argued that people today '),
          typ2('t2-dq-11-i0', 'spend', ['spend'], 'verb-tense', 'present simple ประธาน "people" พหูพจน์'),
          t2(' a considerable amount of money on their appearance because they want to look younger. This essay will elaborate on the reasons for this before discussing whether this is a positive or a negative development.')
        ]
      },
      {
        id: 'gb2-ly-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-ly-b1start', ['To begin with', 'Another reason', 'For example'], 'To begin with', '"To begin with" เปิดย่อหน้าแรกเสมอ'),
          t2(', there are a number of reasons associated with this growing focus on youthful appearance. The first reason is that social media platforms constantly '),
          typ2('t2-dq-11-b1a', 'expose', ['expose'], 'verb-tense', 'present simple ประธาน "platforms" พหูพจน์'),
          t2(' users to filtered, flawless images, which '),
          typ2('t2-dq-11-b1b', 'create', ['creates'], 'verb-tense', 'ประธาน "which" (exposure) เอกพจน์ จึงใช้ creates'),
          t2(' strong pressure to match unrealistic beauty standards. '),
          drag2('t2-ly-b1c', ['For example', 'Another reason', 'To begin with'], 'For example', '"For example" ยกตัวอย่างงานวิจัยของ Royal Society'),
          t2(', a 2019 study by the Royal Society for Public Health '),
          typ2('t2-dq-11-b1d', 'find', ['found'], 'verb-tense', 'past simple เล่าผลการศึกษาในอดีต'),
          t2(' that Instagram was closely linked to increased body image concerns among young adults. '),
          drag2('t2-ly-b1e', ['Another reason', 'To begin with', 'For example'], 'Another reason', '"Another reason" เพิ่มสาเหตุข้อที่สอง'),
          t2(' is that this is because many workplaces still associate a youthful appearance with energy and professional competence. '),
          drag2('t2-ly-b1f', ['For instance', 'To begin with', 'Another reason'], 'For instance', '"For instance" ยกตัวอย่างงานสำรวจของฝ่ายทรัพยากรบุคคล'),
          t2(', several surveys of hiring managers have '),
          typ2('t2-dq-11-b1g', 'show', ['shown'], 'verb-tense', 'present perfect "have shown"'),
          t2(' a subtle bias in favour of younger-looking candidates during job interviews.')
        ]
      },
      {
        id: 'gb2-ly-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          t2('With regard to my opinion, I would argue that this is a negative development. '),
          drag2('t2-ly-b2start', ['To explain it simply', 'To illustrate', 'In this sense'], 'To explain it simply', '"To explain it simply" เปิดประโยคอธิบายเหตุผล'),
          t2(', this is because excessive spending on cosmetic treatments can create unhealthy financial pressure and considerable anxiety about natural ageing. '),
          drag2('t2-ly-b2b', ['To illustrate', 'To explain it simply', 'In this sense'], 'To illustrate', '"To illustrate" ยกตัวอย่างอุตสาหกรรมชะลอวัย'),
          t2(', the global anti-ageing industry was '),
          typ2('t2-dq-11-b2a', 'value', ['valued'], 'verb-tense', 'passive voice "was valued"'),
          t2(' at over 60 billion dollars in 2023, '),
          typ2('t2-dq-11-b2b', 'reflect', ['reflecting'], 'participle', '"reflecting how deeply this pressure has spread" เป็น participle phrase ขยายประโยคหลัก'),
          t2(' how deeply this pressure has spread worldwide. '),
          drag2('t2-ly-b2e', ['In this sense', 'To explain it simply', 'To illustrate'], 'In this sense', '"In this sense" สรุปย่อหน้าความเห็น'),
          t2(', it is evident that this obsession with appearance can distract people from more meaningful sources of self-worth.')
        ]
      },
      {
        id: 'gb2-ly-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-ly-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(", although it is undeniable that taking care of one's appearance can genuinely boost confidence, I am of the opinion that this widespread preoccupation with looking younger is ultimately unhealthy.")
        ]
      }
    ]
  },
  {
    id: 'gb2-shopping-as-a-hobby',
    promptId: 't2-dq-12',
    steps: [
      {
        id: 'gb2-sh-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('It has been widely argued that shopping has replaced many other activities that people once '),
          typ2('t2-dq-12-i0', 'choose', ['chose'], 'verb-tense', 'past simple "once chose" เล่าถึงอดีต'),
          t2(' as hobbies in their free time. This essay will elaborate on the reasons for this before discussing whether this is a positive or a negative development.')
        ]
      },
      {
        id: 'gb2-sh-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-sh-b1start', ['To begin with', 'Another reason', 'For example'], 'To begin with', '"To begin with" เปิดย่อหน้าแรกเสมอ'),
          t2(', there are a number of reasons associated with the rise of shopping as a leisure activity. The first reason is that online retailers now '),
          typ2('t2-dq-12-b1a', 'make', ['make'], 'verb-tense', 'present simple ประธาน "retailers" พหูพจน์'),
          t2(' browsing and buying products effortless at any hour of the day. '),
          drag2('t2-sh-b1b', ['For example', 'Another reason', 'To begin with'], 'For example', '"For example" ยกตัวอย่าง Amazon'),
          t2(', Amazon reported that its mobile app usage in the United States '),
          typ2('t2-dq-12-b1c', 'increase', ['increased'], 'verb-tense', 'past simple เล่าผลระหว่างปี 2019-2023'),
          t2(' by more than 30% between 2019 and 2023, '),
          typ2('t2-dq-12-b1d', 'reflect', ['reflecting'], 'participle', '"reflecting this shift" เป็น participle phrase ขยายประโยคหลัก'),
          t2(' this shift towards constant browsing. '),
          drag2('t2-sh-b1e', ['Another reason', 'To begin with', 'For example'], 'Another reason', '"Another reason" เพิ่มสาเหตุข้อที่สอง'),
          t2(' is that this is because shopping malls have '),
          typ2('t2-dq-12-b1f', 'transform', ['transformed'], 'verb-tense', 'present perfect "have transformed"'),
          t2(' into entertainment destinations offering cinemas, restaurants, and events alongside stores. '),
          drag2('t2-sh-b1g', ['For instance', 'To begin with', 'Another reason'], 'For instance', '"For instance" ยกตัวอย่าง Dubai Mall'),
          t2(', the Dubai Mall '),
          typ2('t2-dq-12-b1h', 'attract', ['attracts'], 'verb-tense', 'ประธาน "Mall" เอกพจน์ จึงใช้ attracts'),
          t2(' millions of visitors each year who come primarily for entertainment rather than necessary purchases.')
        ]
      },
      {
        id: 'gb2-sh-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          t2('With regard to my opinion, I would argue that this is a negative development. '),
          drag2('t2-sh-b2start', ['To explain it simply', 'To illustrate', 'In this sense'], 'To explain it simply', '"To explain it simply" เปิดประโยคอธิบายเหตุผล'),
          t2(', treating shopping as a hobby encourages unnecessary consumption, '),
          typ2('t2-dq-12-b2a', 'place', ['placing'], 'participle', '"placing growing strain" เป็น participle phrase ขยายประโยคหลัก'),
          t2(' growing strain on both personal finances and the environment. '),
          drag2('t2-sh-b2b', ['To illustrate', 'To explain it simply', 'In this sense'], 'To illustrate', '"To illustrate" ยกตัวอย่างรายงาน Ellen MacArthur Foundation'),
          t2(', a 2021 report by the Ellen MacArthur Foundation '),
          typ2('t2-dq-12-b2c', 'find', ['found'], 'verb-tense', 'past simple เล่าผลรายงานในอดีต'),
          t2(' that fast fashion purchases '),
          typ2('t2-dq-12-b2d', 'drive', ['driven'], 'participle', '"purchases driven by casual browsing" เป็น participle phrase ขยาย purchases'),
          t2(' by casual browsing were a major contributor to textile waste. '),
          drag2('t2-sh-b2e', ['In this sense', 'To explain it simply', 'To illustrate'], 'In this sense', '"In this sense" สรุปย่อหน้าความเห็น'),
          t2(', it is evident that this trend carries consequences well beyond simple personal enjoyment.')
        ]
      },
      {
        id: 'gb2-sh-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-sh-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that shopping can provide genuine relaxation and social enjoyment, I am of the opinion that relying on it as a primary hobby is ultimately an unhealthy trend.')
        ]
      }
    ]
  },
  {
    id: 'gb2-youth-unemployment',
    promptId: 't2-dq-13',
    steps: [
      {
        id: 'gb2-yu-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('It has been widely argued that in many countries, growing numbers of young people are '),
          typ2('t2-dq-13-i0', 'drop', ['dropping'], 'verb-tense', '"are dropping out" present continuous แสดงแนวโน้มปัจจุบัน'),
          t2(' out of school yet are still unable to find work. This essay will elaborate on the problems this trend causes before suggesting some measures to reduce youth unemployment.')
        ]
      },
      {
        id: 'gb2-yu-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-yu-b1start', ['To begin with', 'Another problem', 'For example'], 'To begin with', '"To begin with" เปิดย่อหน้าแรกเสมอ'),
          t2(', there are a number of problems associated with rising youth unemployment. The first problem is that unemployed young people often experience declining mental health, as prolonged joblessness can '),
          typ2('t2-dq-13-b1a', 'damage', ['damage'], 'verb-tense', 'ขนานกับ can + base verb'),
          t2(' self-esteem and future motivation. '),
          drag2('t2-yu-b1b', ['For example', 'Another problem', 'To begin with'], 'For example', '"For example" ยกตัวอย่างรายงาน ILO'),
          t2(', a 2022 report by the International Labour Organization '),
          typ2('t2-dq-13-b1c', 'find', ['found'], 'verb-tense', 'past simple เล่าผลรายงานในอดีต'),
          t2(' that unemployed youth '),
          typ2('t2-dq-13-b1d', 'report', ['reported'], 'verb-tense', 'past simple ขนานกับ found'),
          t2(' significantly higher rates of anxiety than their employed peers. '),
          drag2('t2-yu-b1e', ['Another problem', 'To begin with', 'For example'], 'Another problem', '"Another problem" เพิ่มปัญหาข้อที่สอง'),
          t2(' is that this is because economies lose valuable productive potential when large numbers of young workers remain idle for extended periods. '),
          drag2('t2-yu-b1f', ['For instance', 'To begin with', 'Another problem'], 'For instance', '"For instance" ยกตัวอย่างสเปน'),
          t2(", Spain's youth unemployment rate "),
          typ2('t2-dq-13-b1g', 'exceed', ['exceeded'], 'verb-tense', 'past simple "exceeded 30% in 2023"'),
          t2(' 30% in 2023, '),
          typ2('t2-dq-13-b1h', 'represent', ['representing'], 'participle', '"representing a substantial loss" เป็น participle phrase ขยายประโยคหลัก'),
          t2(' a substantial loss of national economic output.')
        ]
      },
      {
        id: 'gb2-yu-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          t2('Turning to possible solutions, there are several measures that could help address this problem. The first is that governments could expand vocational training programmes that '),
          typ2('t2-dq-13-b2a', 'equip', ['equip'], 'verb-tense', 'present simple ประธาน "that" (programmes) พหูพจน์'),
          t2(' school leavers with practical, employable skills. '),
          drag2('t2-yu-b2start', ['For example', 'Another measure', 'For instance'], 'For example', '"For example" ยกตัวอย่างระบบการศึกษาคู่ของเยอรมนี'),
          t2(", Germany's dual education system combines classroom study with paid apprenticeships, "),
          typ2('t2-dq-13-b2b', 'help', ['helping'], 'participle', '"helping keep youth unemployment low" เป็น participle phrase ขยายประโยคหลัก'),
          t2(' keep youth unemployment consistently low. '),
          drag2('t2-yu-b2c', ['Another measure', 'For example', 'For instance'], 'Another measure', '"Another measure" เพิ่มมาตรการข้อที่สอง'),
          t2(' is that companies could be offered tax incentives to hire and train inexperienced young workers. '),
          drag2('t2-yu-b2e', ['For instance', 'For example', 'Another measure'], 'For instance', '"For instance" ยกตัวอย่างมาตรการของฝรั่งเศส'),
          t2(', France '),
          typ2('t2-dq-13-b2f', 'introduce', ['introduced'], 'verb-tense', 'past simple "introduced hiring subsidies in 2020"'),
          t2(' hiring subsidies in 2020 specifically aimed at encouraging businesses to employ workers under the age of 26.')
        ]
      },
      {
        id: 'gb2-yu-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-yu-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that youth unemployment stems from complex economic pressures, I am of the opinion that vocational training and hiring incentives can significantly reduce this problem.')
        ]
      }
    ]
  },
  {
    id: 'gb2-traffic-congestion-cities',
    promptId: 't2-dq-14',
    steps: [
      {
        id: 'gb2-tc-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('It has been widely argued that traffic congestion in major cities has '),
          typ2('t2-dq-14-i0', 'become', ['become'], 'verb-tense', 'present perfect "has become"'),
          t2(' considerably worse in recent years. This essay will elaborate on the reasons for this before suggesting some solutions to tackle this issue.')
        ]
      },
      {
        id: 'gb2-tc-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-tc-b1start', ['To begin with', 'Another reason', 'For example'], 'To begin with', '"To begin with" เปิดย่อหน้าแรกเสมอ'),
          t2(', there are a number of reasons associated with worsening urban traffic congestion. The first reason is that rapid population growth in cities has led to a sharp rise in the total number of vehicles on the road. '),
          drag2('t2-tc-b1b', ['For example', 'Another reason', 'To begin with'], 'For example', '"For example" ยกตัวอย่างกรุงเทพฯ'),
          t2(", Bangkok's Office of Transport and Traffic Policy "),
          typ2('t2-dq-14-b1a', 'report', ['reported'], 'verb-tense', 'past simple "reported in 2022"'),
          t2(' in 2022 that private car registrations had '),
          typ2('t2-dq-14-b1b', 'rise', ['risen'], 'verb-tense', 'past perfect "had risen"'),
          t2(' by nearly 15% over the previous five years. '),
          drag2('t2-tc-b1c', ['Another reason', 'To begin with', 'For example'], 'Another reason', '"Another reason" เพิ่มสาเหตุข้อที่สอง'),
          t2(' is that public transport systems in many cities remain limited or unreliable, '),
          typ2('t2-dq-14-b1d', 'push', ['pushing'], 'participle', '"pushing many commuters towards private vehicles" เป็น participle phrase ขยายประโยคหลัก'),
          t2(' many commuters towards private vehicles instead. '),
          drag2('t2-tc-b1e', ['For instance', 'To begin with', 'Another reason'], 'For instance', '"For instance" ยกตัวอย่างเมืองในเอเชียตะวันออกเฉียงใต้'),
          t2(', several rapidly '),
          typ2('t2-dq-14-b1f', 'grow', ['growing'], 'participle', '"rapidly growing cities" เป็นคำคุณศัพท์ขยาย cities'),
          t2(' cities in Southeast Asia still lack an extensive metro network capable of serving outer suburbs.')
        ]
      },
      {
        id: 'gb2-tc-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          t2('Turning to possible solutions, there are several measures that could help address this problem. The first is that governments could invest heavily in expanding affordable and efficient public transport networks. '),
          drag2('t2-tc-b2start', ['For example', 'Another measure', 'For instance'], 'For example', '"For example" ยกตัวอย่างสิงคโปร์'),
          t2(", Singapore's continued investment in its Mass Rapid Transit system has "),
          typ2('t2-dq-14-b2a', 'help', ['helped'], 'verb-tense', 'present perfect "has helped"'),
          t2(' keep private car ownership relatively low compared with neighbouring cities. '),
          drag2('t2-tc-b2b', ['Another measure', 'For example', 'For instance'], 'Another measure', '"Another measure" เพิ่มมาตรการข้อที่สอง'),
          t2(' is that authorities could introduce congestion charges for vehicles entering busy city centres during peak hours. '),
          drag2('t2-tc-b2e', ['For instance', 'For example', 'Another measure'], 'For instance', '"For instance" ยกตัวอย่างค่าธรรมเนียมจราจรของลอนดอน'),
          t2(", London's congestion charge has been "),
          typ2('t2-dq-14-b2c', 'credit', ['credited'], 'verb-tense', 'passive voice "has been credited"'),
          t2(' with reducing central traffic volumes since it was introduced in 2003.')
        ]
      },
      {
        id: 'gb2-tc-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-tc-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that traffic congestion results from complex urban pressures, I am of the opinion that better public transport and congestion pricing can substantially ease this problem.')
        ]
      }
    ]
  },
  {
    id: 'gb2-young-people-lack-of-sleep',
    promptId: 't2-dq-15',
    steps: [
      {
        id: 'gb2-ys-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('It has been widely argued that many young people today are '),
          typ2('t2-dq-15-i0', 'get', ['getting'], 'verb-tense', '"are getting less sleep" present continuous แสดงแนวโน้มปัจจุบัน'),
          t2(' considerably less sleep than previous generations. This essay will elaborate on the reasons for this before suggesting some solutions to tackle this issue.')
        ]
      },
      {
        id: 'gb2-ys-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          drag2('t2-ys-b1start', ['To begin with', 'Another reason', 'For example'], 'To begin with', '"To begin with" เปิดย่อหน้าแรกเสมอ'),
          t2(', there are a number of reasons associated with declining sleep among young people. The first reason is that smartphones and social media '),
          typ2('t2-dq-15-b1a', 'keep', ['keep'], 'verb-tense', 'present simple ประธาน "smartphones and social media" พหูพจน์'),
          t2(' teenagers engaged late into the night, which '),
          typ2('t2-dq-15-b1b', 'delay', ['delays'], 'verb-tense', 'ประธาน "which" (engagement) เอกพจน์ จึงใช้ delays'),
          t2(' their natural bedtime. '),
          drag2('t2-ys-b1c', ['For example', 'Another reason', 'To begin with'], 'For example', '"For example" ยกตัวอย่างงานวิจัยของ Sleep Foundation'),
          t2(', a 2021 study by the Sleep Foundation '),
          typ2('t2-dq-15-b1d', 'find', ['found'], 'verb-tense', 'past simple เล่าผลการศึกษาในอดีต'),
          t2(' that teenagers who '),
          typ2('t2-dq-15-b1e', 'use', ['used'], 'verb-tense', 'past simple ขนานกับ found'),
          t2(' their phones after 10pm slept, on average, over an hour less than those who did not. '),
          drag2('t2-ys-b1f', ['Another reason', 'To begin with', 'For example'], 'Another reason', '"Another reason" เพิ่มสาเหตุข้อที่สอง'),
          t2(' is that this is because heavy academic workloads and extracurricular commitments leave students with little time to rest before school assignments are due. '),
          drag2('t2-ys-b1g', ['For instance', 'To begin with', 'Another reason'], 'For instance', '"For instance" ยกตัวอย่างนักเรียนในเอเชียตะวันออก'),
          t2(', students in several East Asian countries frequently '),
          typ2('t2-dq-15-b1h', 'report', ['report'], 'verb-tense', 'present simple ประธาน "students" พหูพจน์'),
          t2(' studying or completing homework past midnight.')
        ]
      },
      {
        id: 'gb2-ys-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          t2("Turning to possible solutions, there are several measures that could help address this problem. The first is that schools could start lessons later in the morning to better match teenagers' natural sleep cycles. "),
          drag2('t2-ys-b2start', ['For example', 'Another measure', 'For instance'], 'For example', '"For example" ยกตัวอย่างเขตการศึกษาในสหรัฐ'),
          t2(', several school districts in the United States '),
          typ2('t2-dq-15-b2a', 'delay', ['delayed'], 'verb-tense', 'past simple "delayed their start times after 2014"'),
          t2(' their start times after 2014 research from the American Academy of Pediatrics '),
          typ2('t2-dq-15-b2b', 'link', ['linked'], 'verb-tense', 'past simple "linked early starts to sleep deprivation"'),
          t2(' early starts to chronic sleep deprivation. '),
          drag2('t2-ys-b2c', ['Another measure', 'For example', 'For instance'], 'Another measure', '"Another measure" เพิ่มมาตรการข้อที่สอง'),
          t2(' is that parents could establish clear household rules limiting screen use during the hour before bedtime. '),
          drag2('t2-ys-b2e', ['For instance', 'For example', 'Another measure'], 'For instance', '"For instance" ยกตัวอย่างแอปตั้งเวลาอัตโนมัติ'),
          t2(', some families now use automatic app timers that '),
          typ2('t2-dq-15-b2f', 'disable', ['disable'], 'verb-tense', 'ประธาน "that" (timers) พหูพจน์'),
          t2(' social media access each evening.')
        ]
      },
      {
        id: 'gb2-ys-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          drag2('t2-ys-cstart', ['In conclusion', 'However', 'For example'], 'In conclusion', '"In conclusion" เปิดย่อหน้าสรุปเสมอ'),
          t2(', although it is undeniable that modern lifestyles make sufficient sleep difficult to achieve, I am of the opinion that later school start times and screen limits can meaningfully improve this problem.')
        ]
      }
    ]
  }
]

export const getWritingTask2Builder = (promptId: string): Wgb2Exercise | null =>
  WGB2_EXERCISES.find((exercise) => exercise.promptId === promptId) || null

/** Prefer dense 50+70 overrides when present (avoids circular import with writingTask2Dense). */
export const resolveWritingTask2Builder = (
  promptId: string,
  denseOverrides: Wgb2Exercise[] = []
): Wgb2Exercise | null =>
  denseOverrides.find((exercise) => exercise.promptId === promptId) || getWritingTask2Builder(promptId)

const wgb2AssembleBlank = (blank: Wgb2Blank): string => {
  if (blank.kind === 'select') return blank.answer === WGB2_NO_ARTICLE ? '' : blank.answer
  if (blank.kind === 'type') return blank.answers[0]
  if (blank.kind === 'drag') return blank.answer
  if (blank.kind === 'punct') {
    if (blank.answer === 'none') return ''
    if (blank.answer === 'comma') return ','
    if (blank.answer === 'period') return '.'
    return ';'
  }
  return blank.chunks.reduce((acc, chunk, index) => {
    if (index === 0) return chunk
    const sep = index - 1 === blank.correctGap ? ', ' : ' '
    return acc + sep + chunk
  }, '')
}

// Assemble a clean, blank-free model essay from an exercise (used for the
// "show the finished essay" reveal after the student completes all steps).
export const assembleTask2Essay = (
  exercise: Wgb2Exercise,
  /** The source prompt's paragraphs, used to look up each step's literal Thai translation
   * by role (the exercise itself only carries blanks/segments, not the `thai` gloss). */
  paragraphs?: readonly WritingTask2Paragraph[]
): { role: WritingTask2Role; labelTh: string; text: string; thai?: string }[] =>
  exercise.steps.map((step) => ({
    role: step.role,
    labelTh: step.labelTh,
    text: step.segments
      .map((segment) => (segment.kind === 'text' ? segment.text : wgb2AssembleBlank(segment.blank)))
      .join('')
      .replace(/\s+/g, ' ')
      .replace(/\s+([,.;:])/g, '$1')
      .trim(),
    thai: paragraphs?.find((paragraph) => paragraph.role === step.role)?.thai
  }))
