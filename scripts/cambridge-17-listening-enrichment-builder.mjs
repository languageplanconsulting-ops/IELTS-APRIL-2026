/**
 * Comprehensive Thai explanations for Cambridge 17 Listening (Section 2 & 4).
 * Style aligned with Cambridge 12/13 listening builder tasks.
 */
import {
  clipQuote,
  findQuote,
  passageBodyForQuotes,
  significantWords
} from './cambridge-19-enrichment-builder.mjs'

const clip = (s, n = 95) => {
  const t = String(s || '').trim()
  return t.length > n ? `${t.slice(0, n)}…` : t
}

const normalize = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const splitSentences = (body) =>
  passageBodyForQuotes(body)
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 35)

export const parseMcOptionText = (questionText, letter) => {
  const key = String(letter || '').trim().toUpperCase()
  if (!/^[A-G]$/.test(key)) return ''
  const lines = String(questionText || '')
    .replace(/\\n/g, '\n')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
  for (const line of lines) {
    const m = line.match(/^([A-G])\s+(.+)$/i)
    if (m && m[1].toUpperCase() === key) return m[2].trim()
  }
  return ''
}

const wordOverlapRatio = (a, b) => {
  const wa = new Set(significantWords(a, 4))
  const wb = new Set(significantWords(b, 4))
  if (!wa.size || !wb.size) return 0
  let hit = 0
  for (const w of wa) if (wb.has(w)) hit += 1
  return hit / Math.max(wa.size, wb.size)
}

const pickBridgeVerb = (questionPhrase, targetText) => {
  const q = normalize(questionPhrase)
  const t = normalize(targetText)
  if (!q || !t) return 'ถูกอธิบายในเสียงพูดว่า'
  if (q === t || t.includes(q) || q.includes(t)) return 'ถูกพูดในเสียงตรง ๆ ว่า'
  const overlap = wordOverlapRatio(questionPhrase, targetText)
  if (overlap >= 0.55) return 'ถูกพูดในเสียงด้วยถ้อยคำใกล้เคียงว่า'
  if (/^(not|doesn t|don t|never|without|unable|cannot|can t)/.test(q)) {
    return 'ข้อนี้เน้นสิ่งที่ไม่ใช่/ไม่ได้ — ในเสียงอธิบายว่า'
  }
  if (overlap >= 0.25) return 'ถูก paraphrase ในเสียงว่า'
  return 'ถูกขยายความในเสียงว่า'
}

export const findListeningQuote = (body, targetText, questionWordPhrase, answer, questionText = '') => {
  const sentences = splitSentences(body)
  const targetNorm = normalize(targetText)
  const targetTokens = significantWords(targetText, 4)

  if (targetNorm.length > 6) {
    const exact = sentences.find((s) => normalize(s).includes(targetNorm))
    if (exact) return clipQuote(exact, questionWordPhrase || questionText, 220)

    if (targetTokens.length) {
      const ranked = sentences
        .map((s) => {
          const q = normalize(s)
          let score = targetTokens.filter((w) => q.includes(w)).length * 3
          const keyPhrase = targetTokens.slice(0, 4).join(' ')
          if (keyPhrase.length > 8 && q.includes(keyPhrase)) score += 8
          return { s, score }
        })
        .sort((a, b) => b.score - a.score)
      const need = Math.min(3, Math.max(2, Math.ceil(targetTokens.length * 0.45)))
      if (ranked[0]?.score >= need) {
        return clipQuote(ranked[0].s, questionWordPhrase || questionText, 220)
      }
    }
  }

  const hints = [
    normalize(targetText),
    ...significantWords(questionWordPhrase, 4),
    ...significantWords(String(answer).replace(/\d+/g, ''), 4)
  ]
    .filter(Boolean)
    .join('|')

  return findQuote(body, hints, answer, questionWordPhrase || questionText)
}

const OPTION_THAI = {
  'dark red': 'สีแดงเข้ม',
  'jet black': 'สีดำสนิท',
  'light green': 'สีเขียวอ่อน',
  'take it home': 'นำกลับบ้านเอง',
  'hand it to a member of staff': 'ส่งให้เจ้าหน้าที่',
  'put it in the bins provided on the boat': 'ทิ้งในถังบนเรือ',
  'the gardens': 'สวน',
  'the house': 'ตัวบ้าน',
  'the farm': 'ฟาร์ม',
  'lack of training': 'ขาดการฝึกอบรม',
  'not enough time': 'เวลาไม่พอ',
  'not enough money': 'เงินไม่พอ',
  'puzzle': 'ปริศนา',
  logic: 'ตรรกะ',
  confusion: 'ความสับสน',
  meditation: 'การทำสมาธิ',
  stone: 'หิน',
  coins: 'เหรียญ',
  tree: 'ต้นไม้',
  breathing: 'อัตราการหายใจ',
  paper: 'กระดาษ',
  anxiety: 'ความวิตกกังวล'
}

const PHRASE_THAI = [
  [/maximum number|how many|number of/i, 'จำนวนสูงสุด'],
  [/colour|color/i, 'สี (ในเสียงพูด)'],
  [/doesn.?t eat meat|vegetarian|meat or fish/i, 'ไม่กินเนื้อหรือปลา'],
  [/litter|rubbish|garbage/i, 'การทิ้งขยะ'],
  [/why it was built|reason.*built/i, 'เหตุผลที่สร้าง'],
  [/who staffed|staffed/i, 'ผู้ทำงาน/คนดูแล'],
  [/fur seal/i, 'แมวน้ำขนสั้น'],
  [/dolphin/i, 'ปลาโลมา'],
  [/explain what is inside|inside them/i, 'อธิบายสิ่งข้างใน'],
  [/cannot be reached on foot|on foot/i, 'เข้าไม่ได้ด้วยการเดิน'],
  [/made changes|changes to/i, 'การเปลี่ยนแปลงที่ทำ'],
  [/painters|poets|artists/i, 'ศิลปินและนักเขียน'],
  [/servants|costumed/i, 'คนรับใช้/ชุดย้อนยุค'],
  [/child|children|kids/i, 'เด็ก'],
  [/\b(dairy|lunch|tea|coffee)\b/i, 'อาหารและเครื่องดื่ม'],
  [/agricultural tools|tools/i, 'เครื่องมือเกษตร'],
  [/donkeys|horses|groom/i, 'ดูแลสัตว์'],
  [/gifts|jams|clothes|shopping/i, 'ของฝาก/ช้อปปิ้ง'],
  [/carriage|shed/i, 'เริ่มทริปด้วยรถม้า'],
  [/rare|hardly ever/i, 'สายพันธุ์หายาก'],
  [/after school|before school|breakfast/i, 'ช่วงเวลาเด็กมา'],
  [/maximum|up to \d+/i, 'จำนวนสูงสุดที่รับ'],
  [/afternoon session|cost|price|pounds/i, 'ค่าบริการ'],
  [/meal|5 p\.m|substantial/i, 'มื้อหลักตอนเย็น'],
  [/holiday|other schools/i, 'ช่วงปิดเทอม/โรงเรียนอื่น'],
  [/extra charge|spanish/i, 'มีค่าใช้จ่ายเพิ่ม'],
  [/parental|parents/i, 'ความช่วยเหลือจากผู้ปกครอง'],
  [/painting|art/i, 'กิจกรรมวาดภาพ'],
  [/yoga/i, 'โยคะ'],
  [/cooking|over 8/i, 'ทำอาหาร (อายุ 8+ ปี)'],
  [/training/i, 'การฝึกอบรม'],
  [/workload|recruit|cover duties/i, 'ภาระงานหนัก'],
  [/preferential|fairness/i, 'ความเท่าเทียม'],
  [/customer spent|increase.*spent/i, 'ลูกค้าใช้จ่ายมากขึ้น'],
  [/teamwork|relationships|partners/i, 'ความสัมพันธ์และทีมเวิร์ก'],
  [/career|management potential|talent/i, 'โอกาสในสายอาชีพ'],
  [/trip abroad|expenses/i, 'สิทธิประโยชน์/รางวัลท่องเที่ยว'],
  [/vouchers|childcare|financial/i, 'ผลประโยชน์ทางการเงิน'],
  [/co-operative|supportive|environment/i, 'บรรยากาศทีมที่ดี'],
  [/logic|navigate through a maze/i, 'ตรรกะในการหาทาง'],
  [/maze|labyrinth|puzzle/i, 'เขาวงกต/ปริศนา'],
  [/confusion/i, 'ความสับสน'],
  [/meditation|prayer/i, 'การทำสมาธิ/สวดมนต์'],
  [/carvings|carved/i, 'ลายสลัก'],
  [/coins/i, 'เหรียญ'],
  [/tree|middle/i, 'ต้นไม้ตรงกลาง'],
  [/breathing/i, 'อัตราการหายใจ'],
  [/finger labyrinth|paper/i, 'เขาวงกตบนกระดาษ'],
  [/anxiety|alzheimer/i, 'ความวิตกกังวล'],
  [/speakers|321/i, 'จำนวนผู้พูดภาษาไอซ์แลนด์'],
  [/vocabulary|growing/i, 'คลังคำศัพท์ที่เติบโต'],
  [/podcast/i, 'พอดแคสต์'],
  [/smartphone|technology/i, 'เทคโนโลยี/สมาร์ตโฟน'],
  [/bilingual|english/i, 'การใช้ภาษาอังกฤษมากขึ้น'],
  [/playground|english/i, 'เด็กพูดภาษาอังกฤษในสนามเด็กเล่น']
]

export const inferThaiMeaning = (questionWordPhrase, correctAnswer, optionText = '') => {
  const phrase = String(questionWordPhrase || '')
  for (const [pattern, thai] of PHRASE_THAI) {
    if (pattern.test(phrase)) return thai
  }

  const optKey = normalize(optionText)
  if (OPTION_THAI[optKey]) return OPTION_THAI[optKey]

  const ans = String(correctAnswer || '').trim()
  if (/^[A-G]$/i.test(ans) && optionText) {
    const lowered = optionText.toLowerCase()
    for (const [pattern, thai] of PHRASE_THAI) {
      if (pattern.test(lowered)) return thai
    }
    if (/^\d+$/.test(lowered.replace(/\s/g, ''))) {
      return `ตัวเลือก ${ans.toUpperCase()} (${optionText})`
    }
    return clip(optionText, 48)
  }

  if (/^\d+$/.test(ans.replace(/[,.\s]/g, ''))) return `ตัวเลขที่พูดในสคริปต์ (${ans})`

  if (OPTION_THAI[normalize(ans)]) return OPTION_THAI[normalize(ans)]
  return clip(phrase, 52) || clip(ans, 52)
}

export const buildListeningExplanationThai = ({
  questionText,
  questionWordPhrase,
  targetText,
  correctAnswer,
  quote
}) => {
  const q = clip(questionWordPhrase, 72)
  const snippet = focusQuoteOnTarget(quote || targetText, targetText, 100)
  const bridge = pickBridgeVerb(questionWordPhrase, targetText)
  const ans = String(correctAnswer || '').trim()
  const isMc = /^[A-G]$/i.test(ans)
  const optionText = isMc ? parseMcOptionText(questionText, ans) : ''

  let text = `'${q}' ในโจทย์${bridge} "${snippet}"`

  if (isMc) {
    if (optionText) {
      text += ` ซึ่งสอดคล้องกับตัวเลือก ${ans.toUpperCase()} (${clip(optionText, 55)})`
    }
    if (/which two/i.test(questionText)) {
      text += ` จึงเลือก ${ans.toUpperCase()} เป็นหนึ่งในสองคำตอบ`
    } else {
      text += ` จึงตอบ ${ans.toUpperCase()}`
    }
    return text
  }

  const displayAnswer = ans.length > 28 ? clip(ans, 28) : ans
  text += ` ดังนั้นคำที่ต้องเติม/คำตอบคือ "${displayAnswer}"`
  return text
}

const WEAK_QUOTE_WORDS = new Set(['what', 'that', 'this', 'with', 'from', 'have', 'been', 'they', 'there', 'about'])

export const focusQuoteOnTarget = (quote, targetText, maxLen = 100) => {
  const text = String(quote || '').trim()
  const target = String(targetText || '').trim()
  if (!text || !target) return clip(text, maxLen)

  const lower = text.toLowerCase()
  const targetLower = target.toLowerCase()
  const directIdx = lower.indexOf(targetLower.slice(0, Math.min(24, targetLower.length)))
  const trimLeadingFragment = (chunk, hadOffset) => {
    if (!hadOffset || !chunk) return chunk
    const space = chunk.search(/\s/)
    if (space > 0 && space < 14) return chunk.slice(space + 1).trim()
    return chunk
  }

  if (directIdx >= 0) {
    const start = Math.max(0, directIdx - 28)
    const chunk = trimLeadingFragment(text.slice(start, start + maxLen).trim(), start > 0)
    return chunk.length > maxLen ? `${chunk.slice(0, maxLen)}…` : chunk
  }

  const tokens = significantWords(target, 4)
    .filter((w) => !WEAK_QUOTE_WORDS.has(w))
    .sort((a, b) => b.length - a.length)

  for (const token of tokens) {
    const idx = lower.indexOf(token)
    if (idx >= 0) {
      const start = Math.max(0, idx - 32)
      const chunk = trimLeadingFragment(text.slice(start, start + maxLen).trim(), start > 0)
      return chunk.length > maxLen ? `${chunk.slice(0, maxLen)}…` : chunk
    }
  }

  return clip(text, maxLen)
}

const quoteMatchesTarget = (quote, targetText) => {
  const tokens = significantWords(targetText, 4).filter((w) => !WEAK_QUOTE_WORDS.has(w))
  if (!tokens.length) return true
  const qn = normalize(quote)
  const hits = tokens.filter((w) => qn.includes(w)).length
  return hits >= Math.min(2, tokens.length)
}

export const buildListeningEnrichment = ({ body, task }) => {
  let quote = findListeningQuote(
    body,
    task.targetText,
    task.questionWordPhrase,
    task.correctAnswer,
    task.questionText
  )
  if (task.targetText && !quoteMatchesTarget(quote, task.targetText)) {
    quote = task.targetText
  } else if (task.targetText && !normalize(quote).includes(normalize(task.targetText).slice(0, 14))) {
    const fullSentence = splitSentences(body).find((s) =>
      normalize(s).includes(normalize(task.targetText).slice(0, 14))
    )
    if (fullSentence) quote = focusQuoteOnTarget(fullSentence, task.targetText, 220)
  }
  const optionText = /^[A-G]$/i.test(String(task.correctAnswer || ''))
    ? parseMcOptionText(task.questionText, task.correctAnswer)
    : ''

  return {
    quote,
    thaiMeaning: inferThaiMeaning(task.questionWordPhrase, task.correctAnswer, optionText),
    explanationThai: buildListeningExplanationThai({
      questionText: task.questionText,
      questionWordPhrase: task.questionWordPhrase,
      targetText: task.targetText,
      correctAnswer: task.correctAnswer,
      quote
    })
  }
}
