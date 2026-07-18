/**
 * Letter-hint fill-ins: show first 2–3 letters, then one blank per missing letter.
 * Example: motivation → mot_ _ _ _ _ _ _
 */

export const LETTER_HINT_FOCUS = 'letter-hint' as const

export type LetterHintMask = {
  answer: string
  prefix: string
  missingCount: number
  /** e.g. mot_ _ _ _ _ _ _ */
  spacedMask: string
  /** e.g. mot_______ */
  compactMask: string
}

const lettersOnly = (value: string) => value.replace(/[^A-Za-z]/g, '')

export const letterHintPrefixLength = (word: string): number => {
  const len = lettersOnly(word).length
  if (len <= 4) return Math.min(1, len)
  if (len <= 7) return 2
  return 3
}

export const buildLetterHintMask = (answer: string): LetterHintMask => {
  const clean = answer.trim()
  const letters = lettersOnly(clean)
  const prefixLen = Math.min(letterHintPrefixLength(letters), Math.max(letters.length - 1, 0))
  const prefix = letters.slice(0, prefixLen)
  const missingCount = Math.max(letters.length - prefixLen, 0)
  const slots = Array.from({ length: missingCount }, () => '_').join(' ')
  return {
    answer: clean,
    prefix,
    missingCount,
    spacedMask: missingCount ? `${prefix}${slots ? ` ${slots}` : ''}` : prefix,
    compactMask: `${prefix}${'_'.repeat(missingCount)}`
  }
}

export const isLetterHintBlank = (blank: { kind?: string; focus?: string; base?: string }): boolean => {
  if (blank.focus === LETTER_HINT_FOCUS || blank.focus === 'letter-hint') return true
  if (blank.kind === 'type' && typeof blank.base === 'string' && /^[A-Za-z]{1,3}_/.test(blank.base)) return true
  return false
}

/** Normalize learner input against a letter-hint answer (full word expected). */
export const matchesLetterHintAnswer = (value: string, answers: string[]): boolean => {
  const normalize = (s: string) => s.trim().replace(/\s+/g, '').toLowerCase()
  const given = normalize(value)
  return answers.some((answer) => normalize(answer) === given)
}

/** Prefer explicit thaiMeaning, else pull from explain text, else common gloss map. */
export const resolveThaiMeaning = (word: string, thaiMeaning?: string, explain?: string): string => {
  if (thaiMeaning?.trim()) return thaiMeaning.trim()
  const fromExplain = explain?.match(/ความหมาย:\s*([^\n]+)/)?.[1]?.trim()
  if (fromExplain) return fromExplain
  const key = word.trim().toLowerCase()
  return COMMON_THAI_GLOSS[key] || ''
}

const COMMON_THAI_GLOSS: Record<string, string> = {
  increased: 'เพิ่มขึ้น',
  decreased: 'ลดลง',
  declined: 'ลดลง',
  rose: 'เพิ่มขึ้น',
  fell: 'ลดลง',
  remaining: 'ที่ยังคงเหลือ',
  respectively: 'ตามลำดับ',
  significantly: 'อย่างมีนัยสำคัญ',
  dramatically: 'อย่างมาก / อย่างน่าทึ่ง',
  steadily: 'อย่างสม่ำเสมอ',
  gradually: 'อย่างค่อยเป็นค่อยไป',
  proportion: 'สัดส่วน',
  percentage: 'เปอร์เซ็นต์',
  overall: 'โดยรวม',
  peaking: 'ขึ้นถึงจุดสูงสุด',
  reaching: 'ไปถึง',
  followed: 'ตามด้วย',
  compared: 'เมื่อเปรียบเทียบ',
  fluctuation: 'ความผันผวน',
  fluctuated: 'ผันผวน',
  motivation: 'แรงจูงใจ',
  flexible: 'ยืดหยุ่น',
  flexibility: 'ความยืดหยุ่น',
  unreliable: 'ไม่น่าเชื่อถือ / ไม่แน่นอน',
  reliable: 'น่าเชื่อถือ',
  congestion: 'ความแออัด / การจราจรติดขัด',
  considerably: 'อย่างมาก',
  substantially: 'อย่างมาก / อย่างมีนัย',
  affordable: 'ราคาไม่แพง / จ่ายไหว',
  efficient: 'มีประสิทธิภาพ',
  extensive: 'กว้างขวาง / ครอบคลุม',
  limited: 'จำกัด',
  worsening: 'ที่แย่ลง',
  responsibility: 'ความรับผิดชอบ',
  independent: 'เป็นอิสระ',
  independence: 'ความเป็นอิสระ',
  community: 'ชุมชน',
  practical: 'เชิงปฏิบัติ',
  significant: 'สำคัญ / มีนัยสำคัญ'
}

type ExplainInput = {
  answer: string
  focus?: string
  userAnswer?: string
  thaiMeaning?: string
  authoredExplain?: string
}

const pastSimpleHint = (answer: string) => {
  const lower = answer.toLowerCase()
  if (/ed$/i.test(lower)) {
    return `Past simple (กริยาช่อง 2) โครงสร้างคือ V + -ed สำหรับกริยาปกติ เช่น work → worked, increase → increased — คำตอบที่ถูกคือ "${answer}"`
  }
  return `Past simple (กริยาช่อง 2) — กริยานี้เป็นรูปไม่ปกติ (irregular) ไม่เติม -ed ตรง ๆ ต้องจำรูป เช่น go→went, rise→rose, fall→fell — คำตอบที่ถูกคือ "${answer}"`
}

const presentPerfectHint = (answer: string) =>
  `Present perfect โครงสร้างคือ have/has + V3 (past participle) เช่น has increased, have risen — คำตอบที่ถูกคือ "${answer}"`

const continuousHint = (answer: string) =>
  `รูป continuous / V-ing โครงสร้างคือ be + V-ing หรือใช้ V-ing เป็น adjective/gerund เช่น is rising, peaking at — คำตอบที่ถูกคือ "${answer}"`

const pluralHint = (answer: string) => {
  const lower = answer.toLowerCase()
  if (/ies$/i.test(lower)) {
    return `พหูพจน์: คำนามที่ลงท้ายด้วยพยัญชนะ + y ให้เปลี่ยน y เป็น ies เช่น city → cities — คำตอบที่ถูกคือ "${answer}"`
  }
  if (/es$/i.test(lower)) {
    return `พหูพจน์: คำนามที่ลงท้ายด้วย -s/-sh/-ch/-x/-o มักเติม -es เช่น box → boxes — คำตอบที่ถูกคือ "${answer}"`
  }
  if (/s$/i.test(lower)) {
    return `พหูพจน์: คำนามนับได้ทั่วไป เติม -s เช่น student → students — คำตอบที่ถูกคือ "${answer}"`
  }
  return `ดูจำนวนในประโยค (many/these/several → พหูพจน์; a/an/each → เอกพจน์) — คำตอบที่ถูกคือ "${answer}"`
}

const articleHint = (answer: string) => {
  if (answer === 'a' || answer === 'an') {
    return `คำนำหน้าไม่ชี้เฉพาะ: ใช้ a หน้าพยัญชนะเสียง และ an หน้าสระเสียง (a university / an hour) — คำตอบที่ถูกคือ "${answer}"`
  }
  if (answer === 'the') {
    return `ใช้ the เมื่อเจาะจงสิ่งที่รู้กันแล้วหรือพูดถึงไปแล้วในประโยค/กราฟ — คำตอบที่ถูกคือ "the"`
  }
  return `บางตำแหน่งไม่ต้องใส่ article (นามทั่วไปพหูพจน์ / นามนับไม่ได้) — คำตอบที่ถูกคือ "${answer || '(ไม่ใส่)'}"`
}

const adverbHint = (answer: string) =>
  `ต้องการ adverb ขยายกริยา/คุณศัพท์/ทั้งประโยค มักลงท้าย -ly เช่น significantly, dramatically — อย่าเลือก adjective รูปเดิม — คำตอบที่ถูกคือ "${answer}"`

const adjectiveHint = (answer: string) =>
  `ต้องการ adjective ขยายคำนาม หรือหลัง linking verb (is/was/remain + adj) — อย่าเลือก noun/adverb — คำตอบที่ถูกคือ "${answer}"`

const letterHintExplain = (answer: string, thaiMeaning?: string, userAnswer?: string) => {
  const mask = buildLetterHintMask(answer)
  const wrongBit = userAnswer?.trim()
    ? `\nคุณพิมพ์ว่า "${userAnswer.trim()}" ซึ่งไม่ตรงกับคำเต็ม`
    : ''
  const meaning = thaiMeaning ? `\nความหมาย: ${thaiMeaning}` : ''
  return (
    `เติมคำศัพท์ให้ครบจากตัวใบ้ "${mask.spacedMask}" (ขึ้นต้น ${mask.prefix}- แล้วตามด้วย ${mask.missingCount} ตัวอักษร)` +
    `${wrongBit}` +
    `\nคำที่ถูกคือ "${answer}"${meaning}` +
    `\nทริค: นับช่องว่าง/ขีดให้ครบจำนวนตัวอักษรที่หาย แล้วสะกดคำให้ตรงบริบทประโยค`
  )
}

/**
 * Detailed Thai explanation for a wrong blank — not a generic "ลองใหม่".
 * Prefers authored explain when it already looks specific, then enriches with structure notes.
 */
export const buildDetailedThaiExplain = ({
  answer,
  focus = '',
  userAnswer,
  thaiMeaning,
  authoredExplain
}: ExplainInput): string => {
  const authored = (authoredExplain || '').trim()
  const looksGeneric =
    !authored ||
    /ตรวจดูความหมาย|ลองใหม่|ไม่ถูกต้อง|เลือกคำศัพท์\/รูปคำที่เหมาะ/.test(authored)

  if (focus === LETTER_HINT_FOCUS || focus === 'letter-hint' || focus === 'word-choice') {
    const core = letterHintExplain(answer, thaiMeaning, userAnswer)
    if (authored && !looksGeneric) return `${authored}\n\n${core}`
    return core
  }

  let structure = ''
  switch (focus) {
    case 'verb-tense': {
      const lower = answer.toLowerCase()
      if (/ed$/i.test(lower) || /went|rose|fell|grew|began|became|took|made|saw|had$/.test(lower)) {
        structure = pastSimpleHint(answer)
      } else if (/ing$/i.test(lower)) {
        structure = continuousHint(answer)
      } else if (/en$|ne$|wn$|ught$/.test(lower)) {
        structure = presentPerfectHint(answer)
      } else {
        structure = `เช็ครูปกริยาให้ตรง tense ในประโยค (past = V2/-ed, perfect = have/has+V3, modal/to = base form) — คำตอบที่ถูกคือ "${answer}"`
      }
      break
    }
    case 'plural':
      structure = pluralHint(answer)
      break
    case 'article':
      structure = articleHint(answer)
      break
    case 'adverb':
    case 'degree-adverb':
      structure = adverbHint(answer)
      break
    case 'adjective':
      structure = adjectiveHint(answer)
      break
    case 'participle':
    case 'ving-clause':
      structure = continuousHint(answer)
      break
    case 'v3-clause':
      structure = `Passive / V3 clause โครงสร้างคือ be + V3 หรือ V3 ทำหน้าที่ขยายนาม (past participle) เช่น followed by, compared with — คำตอบที่ถูกคือ "${answer}"`
      break
    case 'transition':
      structure = `คำเชื่อมต้องตรงความสัมพันธ์ของประโยค (ขัดแย้ง / ยกตัวอย่าง / ผลลัพธ์ / เสริม) — คำตอบที่ถูกคือ "${answer}"`
      break
    case 'paraphrase':
      structure = `ต้องถอดความให้ความหมายเดิม แต่ใช้คำคนละชุดกับโจทย์ — คำตอบที่ถูกคือ "${answer}"`
      break
    case 'trend-phrase':
      structure = `วลีแนวโน้มกราฟต้องเข้าคู่กับทิศทางข้อมูล (เพิ่มขึ้น/ลดลง/คงที่) และไวยากรณ์รอบ ๆ — คำตอบที่ถูกคือ "${answer}"`
      break
    case 'referencing':
      structure = `คำอ้างอิง (this/that/these/those/that of) ต้องชี้ไปยังนามที่ถูกต้องและตรงจำนวน — คำตอบที่ถูกคือ "${answer}"`
      break
    default:
      structure = `คำตอบที่ถูกคือ "${answer}" — อ่านทั้งประโยคแล้วเลือก/สะกดให้ตรงชนิดคำและความหมาย`
  }

  if (authored && !looksGeneric) {
    return `${authored}\n\n${structure}`
  }
  return structure
}
