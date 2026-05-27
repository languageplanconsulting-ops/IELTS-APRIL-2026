export type SpeakingSampleSubtitleNoteKind = 'vocabulary' | 'grammar'

export type SpeakingSampleSubtitleNote = {
  id: string
  phrase: string
  fullPhrase?: string
  detail?: string
  kind?: SpeakingSampleSubtitleNoteKind
  partOfSpeech?: string
  thaiMeaning?: string
  grammarRule?: string
  exampleSentence?: string
}

export type SpeakingSampleSubtitleCue = {
  id: string
  startSeconds: number
  endSeconds: number
  text: string
  notes?: SpeakingSampleSubtitleNote[]
}

export type ParsedSpeakingSampleSubtitleNote = {
  id: string
  phrase: string
  kind: SpeakingSampleSubtitleNoteKind
  headline: string
  body: string
  example?: string
}

export const SPEAKING_SAMPLE_NOTE_LIMITS = {
  total: 8,
  vocabulary: 5,
  grammar: 2,
  overlayMax: 6
} as const

const VOCAB_GLOSSARY: Record<string, { partOfSpeech: string; thai: string; score?: number }> = {
  'generally speaking': { partOfSpeech: 'adv. phr.', thai: 'โดยทั่วไป / โดยรวมแล้ว' },
  'to begin with': { partOfSpeech: 'adv. phr.', thai: 'เริ่มจาก / ก่อนอื่นเลย' },
  'moving on to': { partOfSpeech: 'adv. phr.', thai: 'ต่อไป / มาพูดถึง' },
  'in terms of': { partOfSpeech: 'prep. phr.', thai: 'ในแง่ของ / ในเรื่องของ' },
  'whether it be': { partOfSpeech: 'conj. phr.', thai: 'ไม่ว่าจะเป็น...หรือ...' },
  'natural landscape': { partOfSpeech: 'n. phr.', thai: 'ทิวทัศน์ธรรมชาติ' },
  'traditional ways of living': { partOfSpeech: 'n. phr.', thai: 'วิถีชีวิตแบบดั้งเดิม' },
  'Latin American culture': { partOfSpeech: 'n. phr.', thai: 'วัฒนธรรม Latin America' },
  'get together': { partOfSpeech: 'v. phr.', thai: 'มาเจอกัน / รวมตัวกัน' },
  'rare occasion': { partOfSpeech: 'n. phr.', thai: 'โอกาสที่หาได้ยาก' },
  'far apart': { partOfSpeech: 'adv. phr.', thai: 'อยู่ห่างกัน / แยกกันไกล' },
  'city center': { partOfSpeech: 'n. phr.', thai: 'ใจกลางเมือง / ตัวเมือง' },
  'depending on the traffic': { partOfSpeech: 'adv. phr.', thai: 'ขึ้นอยู่กับสภาพการจราจร' },
  memorable: { partOfSpeech: 'adj.', thai: 'น่าจดจำ / ประทับใจ' },
  enjoyable: { partOfSpeech: 'adj.', thai: 'สนุก / น่าพอใจ' },
  nostalgic: { partOfSpeech: 'adj.', thai: 'คิดถึงอดีต / อิ่มเอม' },
  emotional: { partOfSpeech: 'adj.', thai: 'รู้สึกอารมณ์ / ซาบซึ้ง' },
  optimistic: { partOfSpeech: 'adj.', thai: 'มองโลกในแง่ดี' },
  'avid reader': { partOfSpeech: 'n. phr.', thai: 'คนที่ชอบอ่านหนังสือมาก', score: 80 },
  subconsciously: { partOfSpeech: 'adv.', thai: 'โดยไม่รู้ตัว / ในระดับจิตใต้สำนึก' },
  fascinating: { partOfSpeech: 'adj.', thai: 'น่าหลงใหล / น่าสนใจมาก' },
  knowledgeable: { partOfSpeech: 'adj.', thai: 'มีความรู้ / รอบรู้' },
  feminine: { partOfSpeech: 'adj.', thai: 'มีความเป็นผู้หญิง / สง่างาม' },
  rewarding: { partOfSpeech: 'adj.', thai: 'คุ้มค่า / ให้ความรู้สึกดี' },
  progress: { partOfSpeech: 'n.', thai: 'ความก้าวหน้า' },
  weightlifting: { partOfSpeech: 'n.', thai: 'ยกน้ำหนัก' },
  reunion: { partOfSpeech: 'n.', thai: 'การรวมตัว / งานเลี้ยงรุ่น', score: 74 },
  foodie: { partOfSpeech: 'n.', thai: 'คนรักอาหาร / สายกิน', score: 68 },
  comedic: { partOfSpeech: 'adj.', thai: 'ตลก / สไตล์คอมเมดี' },
  documentary: { partOfSpeech: 'n.', thai: 'สารคดี' },
  curious: { partOfSpeech: 'adj.', thai: 'อยากรู้ / ขี้สงสัย' },
  retired: { partOfSpeech: 'adj.', thai: 'เกษียณแล้ว' },
  graduated: { partOfSpeech: 'v.', thai: 'จบการศึกษา' },
  independent: { partOfSpeech: 'adj.', thai: 'เป็นอิสระ / ไม่พึ่งใคร' },
  exciting: { partOfSpeech: 'adj.', thai: 'ตื่นเต้น / น่าตื่นเต้น' },
  'long weekends': { partOfSpeech: 'n. phr.', thai: 'วันหยุดยาว (เสาร์-อาทิตย์ + วันหยุด)' },
  banal: { partOfSpeech: 'adj.', thai: 'ธรรมดา / ไม่พิเศษ' },
  extraordinary: { partOfSpeech: 'adj.', thai: 'พิเศษ / ไม่ธรรมดา' },
  premise: { partOfSpeech: 'n.', thai: 'แนวคิดหลัก / ข้อสมมติฐาน' },
  neuroscience: { partOfSpeech: 'n.', thai: 'ประสาทวิทยา' },
  psychology: { partOfSpeech: 'n.', thai: 'จิตวิทยา' },
  'physical activities': { partOfSpeech: 'n. phr.', thai: 'กิจกรรมทางกาย' },
  'eye-catching': { partOfSpeech: 'adj.', thai: 'ดึงดูดสายตา / โดดเด่น' },
  'well-maintained': { partOfSpeech: 'adj.', thai: 'ได้รับการดูแลรักษาดี' },
  breathtaking: { partOfSpeech: 'adj.', thai: 'งดงาม / ตระการตา' },
  picturesque: { partOfSpeech: 'adj.', thai: 'สวยงดงามเหมือนภาพวาด' },
  spacious: { partOfSpeech: 'adj.', thai: 'กว้างขวาง / โปร่ง' },
  'open-plan': { partOfSpeech: 'adj.', thai: 'แบบเปิดโล่ง (ไม่มีกำแพงกั้นห้อง)' },
  'state-of-the-art': { partOfSpeech: 'adj.', thai: 'ทันสมัยที่สุด / ล้ำสมัย' },
  'cutting-edge': { partOfSpeech: 'adj.', thai: 'ล้ำสมัย / ทันสมัย' },
  convenient: { partOfSpeech: 'adj.', thai: 'สะดวก' },
  peaceful: { partOfSpeech: 'adj.', thai: 'เงียบสงบ' },
  bustling: { partOfSpeech: 'adj.', thai: 'คึกคัก / พลุกพล่าน' },
  charming: { partOfSpeech: 'adj.', thai: 'มีเสน่ห์ / น่ารัก' },
  impressive: { partOfSpeech: 'adj.', thai: 'น่าประทับใจ' },
  workplace: { partOfSpeech: 'n.', thai: 'ที่ทำงาน' },
  atmosphere: { partOfSpeech: 'n.', thai: 'บรรยากาศ' },
  architecture: { partOfSpeech: 'n.', thai: 'สถาปัตยกรรม' },
  landmark: { partOfSpeech: 'n.', thai: 'สถานที่สำคัญ / แลนด์มาร์ก' },
  'take advantage of': { partOfSpeech: 'v. phr.', thai: 'ใช้ประโยชน์จาก' },
  'look forward to': { partOfSpeech: 'v. phr.', thai: 'ตั้งตารอ / รอคอย' },
  'be fond of': { partOfSpeech: 'v. phr.', thai: 'ชอบ / หลงใหล' },
  'on a regular basis': { partOfSpeech: 'adv. phr.', thai: 'เป็นประจำ / สม่ำเสมอ' },
  'would like to': { partOfSpeech: 'v. phr.', thai: 'อยากจะ / ต้องการ' },
  'majored in': { partOfSpeech: 'v. phr.', thai: 'เรียนเอก (มหาวิทยาลัย)' },
  'graduation ceremony': { partOfSpeech: 'n. phr.', thai: 'พิธีสำเร็จการศึกษา' },
  'love song': { partOfSpeech: 'n. phr.', thai: 'เพลงรัก' },
  'middle school': { partOfSpeech: 'n. phr.', thai: 'มัธยมต้น' },
  'primary school': { partOfSpeech: 'n. phr.', thai: 'ประถมศึกษา' },
  'summer camp': { partOfSpeech: 'n. phr.', thai: 'ค่ายฤดูร้อน' },
  'best friends': { partOfSpeech: 'n. phr.', thai: 'เพื่อนสนิท' },
  'high school': { partOfSpeech: 'n. phr.', thai: 'มัธยมปลาย / โรงเรียนมัธยม' },
  'you name it': { partOfSpeech: 'phrase', thai: 'มีครบทุกอย่าง / อะไรก็มี', score: 72 },
  inspiring: { partOfSpeech: 'adj.', thai: 'สร้างแรงบันดาลใจ / ทำให้อยากเป็นแบบนั้น', score: 88 },
  'loves learning': { partOfSpeech: 'v. phr.', thai: 'ชอบการเรียนรู้ / รักการเรียน', score: 78 },
  'historical facts': { partOfSpeech: 'n. phr.', thai: 'ข้อเท็จจริงทางประวัติศาสตร์', score: 82 },
  'root of': { partOfSpeech: 'n. phr.', thai: 'รากศัพท์ / ที่มาของคำ', score: 80 },
  groundbreaking: { partOfSpeech: 'adj.', thai: 'เปิดแนวใหม่ / ก้าวล้ำ', score: 86 },
  intellectual: { partOfSpeech: 'adj.', thai: 'ฉลาด / ใช้สมอง / มีความคิดลึก', score: 84 },
  mesmerizing: { partOfSpeech: 'adj.', thai: 'ดึงดูดใจ / ทำให้หลงใหล', score: 83 },
  'reminds me of': { partOfSpeech: 'v. phr.', thai: 'ทำให้นึกถึง...', score: 85 },
  'memorable experience': { partOfSpeech: 'n. phr.', thai: 'ประสบการณ์ที่น่าจดจำ', score: 84 },
  'travel independently': { partOfSpeech: 'v. phr.', thai: 'เดินทางด้วยตัวเอง / ไม่พึ่งครอบครัว', score: 82 },
  'engaged in': { partOfSpeech: 'v. phr.', thai: 'มีส่วนร่วมใน / ทำอยู่', score: 76 },
  'discover a lot': { partOfSpeech: 'v. phr.', thai: 'ได้ค้นพบสิ่งใหม่ ๆ มากมาย', score: 78 },
  'younger version of myself': { partOfSpeech: 'n. phr.', thai: 'ตัวฉันในวัยที่ younger', score: 88 },
  'adult life': { partOfSpeech: 'n. phr.', thai: 'ชีวิตวัยผู้ใหญ่', score: 74 },
  'upbringing': { partOfSpeech: 'n.', thai: 'การเลี้ยงดู / สภาพแวดล้อมในวัยเด็ก', score: 82 },
  'get to analyze': { partOfSpeech: 'v. phr.', thai: 'ได้วิเคราะห์ / ได้ไตร่ตรอง', score: 80 },
  'not aware of': { partOfSpeech: 'adj. phr.', thai: 'ไม่รู้ตัว / ไม่ได้ตระหนัก', score: 78 },
  political: { partOfSpeech: 'adj.', thai: 'เกี่ยวกับการเมือง', score: 70 },
  'bond with': { partOfSpeech: 'v. phr.', thai: 'สร้างความผูกพันกับ', score: 82 },
  'closet friends': { partOfSpeech: 'n. phr.', thai: 'เพื่อนสนิทที่สุด', score: 76 },
  'closest friends': { partOfSpeech: 'n. phr.', thai: 'เพื่อนสนิทที่สุด', score: 76 },
  'eating out': { partOfSpeech: 'v. phr.', thai: 'กินข้าวนอกบ้าน / ไปร้านอาหาร', score: 72 },
  'sense of control': { partOfSpeech: 'n. phr.', thai: 'ความรู้สึกว่าควบคุมได้', score: 78 },
  'sense of curiosity': { partOfSpeech: 'n. phr.', thai: 'ความอยากรู้อยากเห็น', score: 90 },
  'sense of belonging': { partOfSpeech: 'n. phr.', thai: 'ความรู้สึกเป็นส่วนหนึ่ง', score: 82 },
  'personal fulfilment': { partOfSpeech: 'n. phr.', thai: 'ความสำเร็จในชีวิต / ความพึงพอใจ', score: 84 },
  'cultural heritage': { partOfSpeech: 'n. phr.', thai: 'มรดกทางวัฒนธรรม', score: 80 },
  'vivid memories': { partOfSpeech: 'n. phr.', thai: 'ความทรงจำที่ชัดเจน', score: 82 },
  'deeply moved': { partOfSpeech: 'adj. phr.', thai: 'ประทับใจ / ซาบซึ้งลึก ๆ', score: 84 },
  'opened my eyes': { partOfSpeech: 'v. phr.', thai: 'ทำให้เห็นโลกในมุมใหม่', score: 86 },
  'broadened my horizons': { partOfSpeech: 'v. phr.', thai: 'ขยายมุมมอง / เปิดโลกทัศน์', score: 88 },
  'left a lasting impression': { partOfSpeech: 'v. phr.', thai: 'สร้างความประทับใจยาวนาน', score: 90 }
}

const GENERIC_LOW_VALUE = new Set([
  'high school',
  'middle school',
  'primary school',
  'best friends',
  'city center',
  'workplace',
  'progress',
  'retired',
  'graduated',
  'curious',
  'independent',
  'exciting',
  'convenient',
  'peaceful',
  'documentary',
  'weightlifting',
  'love song',
  'summer camp',
  'long weekends',
  'have been to',
  'would like to',
  'depending on',
  'traditional ways',
  'get together',
  'physical activities'
])

const VOCAB_PATTERNS: Array<{
  pattern: RegExp
  pickPhrase: (match: RegExpMatchArray, text: string) => string
  partOfSpeech: string
  thai: string
  score: number
}> = [
  {
    pattern: /\binstilled in me a sense of [a-z]+/gi,
    pickPhrase: (match) => match[0].trim(),
    partOfSpeech: 'v. phr.',
    thai: 'ปลูกฝังความรู้สึก...ให้กับฉัน',
    score: 98
  },
  {
    pattern: /\binspired me to (?:become|be)\b[^.?!,;]{0,50}/gi,
    pickPhrase: (match) =>
      trimGrammarPhrase(
        match[0]
          .trim()
          .replace(/[,;].*$/, '')
          .replace(/\s+you know.*$/i, ''),
        8
      ),
    partOfSpeech: 'v. phr.',
    thai: 'สร้างแรงบันดาลใจให้ฉัน...',
    score: 95
  },
  {
    pattern: /\b(?:very )?inspiring(?: for me)?\b/gi,
    pickPhrase: (match) => match[0].trim(),
    partOfSpeech: 'adj. phr.',
    thai: 'สร้างแรงบันดาลใจ / ทำให้อยากเป็นแบบนั้น',
    score: 90
  },
  {
    pattern: /\ba sense of [a-z]+/gi,
    pickPhrase: (match) => match[0].trim(),
    partOfSpeech: 'n. phr.',
    thai: 'ความรู้สึก...',
    score: 86
  },
  {
    pattern: /\breminds me of [a-z]+(?:\s+[a-z]+){0,5}/gi,
    pickPhrase: (match) => trimGrammarPhrase(match[0].trim(), 7),
    partOfSpeech: 'v. phr.',
    thai: 'ทำให้ฉันนึกถึง...',
    score: 84
  },
  {
    pattern: /\bresult of your upbringing\b/gi,
    pickPhrase: (match) => match[0].trim(),
    partOfSpeech: 'n. phr.',
    thai: 'ผลมาจากการเลี้ยงดูในวัยเด็ก',
    score: 82
  },
  {
    pattern: /\bwired subconsciously\b/gi,
    pickPhrase: (match) => match[0].trim(),
    partOfSpeech: 'adv. phr.',
    thai: 'ถูกกำหนดโดยจิตใต้สำนึก',
    score: 88
  },
  {
    pattern: /\bemotional and nostalgic\b/gi,
    pickPhrase: (match) => match[0].trim(),
    partOfSpeech: 'adj. phr.',
    thai: 'รู้สึกอารมณ์และคิดถึงอดีต',
    score: 85
  },
  {
    pattern: /\bcomedic and funny\b/gi,
    pickPhrase: (match) => match[0].trim(),
    partOfSpeech: 'adj. phr.',
    thai: 'ตลกและสนุก',
    score: 72
  },
  {
    pattern: /\bfunny but political\b/gi,
    pickPhrase: (match) => match[0].trim(),
    partOfSpeech: 'adj. phr.',
    thai: 'ตลกแต่เกี่ยวกับการเมือง',
    score: 80
  },
  {
    pattern: /\bfirst time traveling\b/gi,
    pickPhrase: (match) => match[0].trim(),
    partOfSpeech: 'n. phr.',
    thai: 'ครั้งแรกที่เดินทาง',
    score: 78
  },
  {
    pattern: /\bremember (?:this|her|him|it) forever\b/gi,
    pickPhrase: (match) => match[0].trim(),
    partOfSpeech: 'v. phr.',
    thai: 'จดจำ...ไปตลอด',
    score: 82
  },
  {
    pattern: /\bremember my entire life\b/gi,
    pickPhrase: (match) => match[0].trim(),
    partOfSpeech: 'v. phr.',
    thai: 'จำได้ตลอดชีวิต',
    score: 80
  }
]

const trimGrammarPhrase = (value: string, maxWords = 5) =>
  normalizeNoteText(value).split(/\s+/).slice(0, maxWords).join(' ')

const DISCOURSE_MARKERS = new Set([
  'generally speaking',
  'to begin with',
  'moving on to',
  'in terms of',
  'whether it be'
])

const isUsefulGrammarPhrase = (phrase: string) => {
  const normalized = normalizeNoteText(phrase)
  const words = normalized.split(/\s+/).filter(Boolean)
  if (normalized.length < 12 || words.length < 3) return false
  if (/^because (there|when|it|i|we)\b/i.test(normalized)) return false
  if (/^have (been|grown)\b/i.test(normalized) && words.length < 5) return false
  if (/^(that|which|who|where|when|as|i|we|he|she|it|they)\s/i.test(normalized) && words.length < 5) return false
  if (/^(that|which|who|where)\s+(?:i|we|he|she|it|they|is|are|was|were|has|have|had|really|very|somebody|someone|something|when)\b/i.test(normalized)) {
    return false
  }
  if (/\b(instilled|inspired|sense of|remember her forever|remember him forever|historical facts|historical)\b/i.test(normalized)) {
    return false
  }
  return true
}

const scoreStaticVocab = (term: string, meta: { score?: number }) => {
  const lower = term.toLowerCase()
  let score = meta.score ?? term.split(/\s+/).length * 8
  if (GENERIC_LOW_VALUE.has(lower)) score -= 28
  if (DISCOURSE_MARKERS.has(lower)) score -= 18
  if (term.length >= 18) score += 12
  return score
}

const GRAMMAR_PATTERNS: Array<{
  pattern: RegExp
  grammarRule: string
  thai: string
  pickPhrase: (match: RegExpMatchArray, sentence: string) => string
}> = [
  {
    pattern: /\bused to\s+[a-z]+(?:\s+[a-z]+){0,4}/gi,
    grammarRule: 'used to + V1',
    thai: 'พูดถึงนิสัย/กิจวัตรในอดีตที่ไม่ทำแล้ว',
    pickPhrase: (match) => trimGrammarPhrase(match[0].trim())
  },
  {
    pattern: /\b(?:I|we|they|he|she|it)\s+would\s+(?!like\b)[a-z]+(?:\s+[a-z]+){0,3}/gi,
    grammarRule: 'S + would + V1',
    thai: 'พูดถึงสิ่งที่เคยทำบ่อยในอดีต',
    pickPhrase: (match) => trimGrammarPhrase(match[0].trim(), 4)
  },
  {
    pattern: /\b(?:have|has|had)\s+(?:been|become|done|seen|visited|known|lived|worked|read|grown|become)\b[^.?!]{0,50}/gi,
    grammarRule: 'S + have/has + V3',
    thai: 'present perfect — เชื่อมอดีตกับปัจจุบัน',
    pickPhrase: (match) => trimGrammarPhrase(match[0].trim(), 6)
  },
  {
    pattern: /\b(?:I|we|they|he|she|it)\s+(?:decided|majored|graduated|visited|started|felt|remembered|realized|engaged|picked|brought)\b(?:\s+[a-z]+){0,3}/gi,
    grammarRule: 'S + V2',
    thai: 'past simple — พูดถึงเหตุการณ์ในอดีต',
    pickPhrase: (match) => trimGrammarPhrase(match[0].trim(), 4)
  },
  {
    pattern: /\b(?:which|who|that|where)\s+(?:I|we|they|he|she|it|[a-z]{4,})\s+[a-z]+(?:\s+[a-z]+){0,4}/gi,
    grammarRule: 'relative clause',
    thai: 'อนุภาคความ — ขยายคำนามที่อยู่ข้างหน้า',
    pickPhrase: (match) => trimGrammarPhrase(match[0].trim(), 6)
  },
  {
    pattern: /\b(?:because|since)\s+[a-z]+(?:\s+[a-z]+){0,6}/gi,
    grammarRule: 'because / since + clause',
    thai: 'บอกเหตุผล — เพราะว่า...',
    pickPhrase: (match) => trimGrammarPhrase(match[0].trim(), 6)
  },
  {
    pattern: /\bwhen I was\s+[a-z]+(?:\s+[a-z]+){0,4}/gi,
    grammarRule: 'when + past clause',
    thai: 'บอกช่วงเวลาในอดีต — ตอนที่...',
    pickPhrase: (match) => trimGrammarPhrase(match[0].trim())
  },
  {
    pattern: /\bas I grew up\b/gi,
    grammarRule: 'as + clause',
    thai: 'บอกการเปลี่ยนแปลงตามกาลเวลา — เมื่อโตขึ้น',
    pickPhrase: (match) => trimGrammarPhrase(match[0].trim())
  }
]

const normalizeNoteText = (value: string) => String(value || '').trim().replace(/\s+/g, ' ')

const normalizeDedupeKey = (value: string) =>
  normalizeNoteText(value)
    .toLowerCase()
    .replace(/[''""]/g, '')
    .replace(/[,.!?;:]+$/g, '')
    .trim()

const parseDetailString = (detail: string) => {
  const text = normalizeNoteText(detail)
  if (!text) return null

  if (/past simple|present perfect|relative clause|used to|would \+ v1|s \+ v2|s \+ have/i.test(text)) {
    const parts = text.split(/\s*[·•|-]\s*/)
    if (parts.length >= 2) {
      return {
        kind: 'grammar' as const,
        grammarRule: parts[0].replace(/^grammar\s*[·•|-]\s*/i, '').trim(),
        thai: parts[1]?.trim() || '',
        exampleSentence: parts.slice(2).join(' · ').replace(/^["'“]|["'”]$/g, '').trim()
      }
    }
  }

  const vocabMatch = text.match(/^(.+?)\s*\(([^)]+)\)\s*(.+)$/i)
  if (vocabMatch) {
    return {
      kind: 'vocabulary' as const,
      phrase: vocabMatch[1].trim(),
      partOfSpeech: vocabMatch[2].trim(),
      thaiMeaning: vocabMatch[3].trim()
    }
  }

  const pipeParts = text.split(/\s*[·•|-]\s*/)
  if (pipeParts.length >= 3 && /^(n\.|v\.|adj\.|adv\.|v\. phr\.|adv\. phr\.|prep\. phr\.|conj\. phr\.|n\. phr\.)/i.test(pipeParts[1])) {
    return {
      kind: 'vocabulary' as const,
      phrase: pipeParts[0].trim(),
      partOfSpeech: pipeParts[1].trim(),
      thaiMeaning: pipeParts.slice(2).join(' · ').trim()
    }
  }

  return null
}

export const parseSpeakingSampleSubtitleNote = (
  note: SpeakingSampleSubtitleNote
): ParsedSpeakingSampleSubtitleNote | null => {
  const phrase = normalizeNoteText(note.fullPhrase || note.phrase)
  if (!phrase) return null

  if (note.kind === 'grammar' || note.grammarRule) {
    const grammarRule = normalizeNoteText(note.grammarRule || '')
    const thai = normalizeNoteText(note.thaiMeaning || '')
    const example = normalizeNoteText(note.exampleSentence || phrase)
    if (!grammarRule && !thai && note.detail) {
      const parsed = parseDetailString(note.detail)
      if (parsed?.kind === 'grammar') {
        return {
          id: note.id,
          phrase,
          kind: 'grammar',
          headline: parsed.grammarRule || 'Grammar',
          body: parsed.thai || note.detail,
          example: parsed.exampleSentence || example
        }
      }
    }
    return {
      id: note.id,
      phrase,
      kind: 'grammar',
      headline: grammarRule || 'Grammar',
      body: thai || normalizeNoteText(note.detail || ''),
      example: example || undefined
    }
  }

  if (note.kind === 'vocabulary' || note.partOfSpeech || note.thaiMeaning) {
    const partOfSpeech = normalizeNoteText(note.partOfSpeech || '')
    const thai = normalizeNoteText(note.thaiMeaning || '')
    return {
      id: note.id,
      phrase,
      kind: 'vocabulary',
      headline: phrase,
      body: [partOfSpeech, thai].filter(Boolean).join(' · ') || normalizeNoteText(note.detail || ''),
      example: undefined
    }
  }

  const parsedDetail = note.detail ? parseDetailString(note.detail) : null
  if (parsedDetail?.kind === 'vocabulary') {
    return {
      id: note.id,
      phrase: parsedDetail.phrase || phrase,
      kind: 'vocabulary',
      headline: parsedDetail.phrase || phrase,
      body: `${parsedDetail.partOfSpeech} · ${parsedDetail.thaiMeaning}`.trim(),
      example: undefined
    }
  }
  if (parsedDetail?.kind === 'grammar') {
    return {
      id: note.id,
      phrase,
      kind: 'grammar',
      headline: parsedDetail.grammarRule || 'Grammar',
      body: parsedDetail.thai,
      example: parsedDetail.exampleSentence
    }
  }

  return {
    id: note.id,
    phrase,
    kind: 'vocabulary',
    headline: phrase,
    body: normalizeNoteText(note.detail || ''),
    example: undefined
  }
}

const sentenceAround = (text: string, index: number) => {
  const left = Math.max(
    0,
    text.lastIndexOf('.', index - 1) + 1,
    text.lastIndexOf('!', index - 1) + 1,
    text.lastIndexOf('?', index - 1) + 1
  )
  const rightCandidates = ['.', '!', '?'].map((mark) => {
    const pos = text.indexOf(mark, index)
    return pos >= 0 ? pos + 1 : text.length
  })
  const right = Math.min(...rightCandidates)
  return normalizeNoteText(text.slice(left, right))
}

const findCueForPhrase = (cues: SpeakingSampleSubtitleCue[], phrase: string) => {
  const lowerPhrase = normalizeNoteText(phrase).toLowerCase()
  const direct =
    cues.find((cue) => normalizeNoteText(cue.text).toLowerCase().includes(lowerPhrase)) ||
    null
  if (direct) return direct

  const words = lowerPhrase.split(/\s+/).filter(Boolean)
  for (let start = 0; start < words.length; start += 1) {
    for (let end = words.length; end > start; end -= 1) {
      const chunk = words.slice(start, end).join(' ')
      if (chunk.length < 4) continue
      const cue = cues.find((item) => normalizeNoteText(item.text).toLowerCase().includes(chunk))
      if (cue) return cue
    }
  }

  const keywords = words.filter((word) => word.length > 3)
  let bestCue: SpeakingSampleSubtitleCue | null = null
  let bestScore = 0
  cues.forEach((cue) => {
    const lowerText = normalizeNoteText(cue.text).toLowerCase()
    const score = keywords.filter((word) => lowerText.includes(word)).length
    if (score > bestScore) {
      bestScore = score
      bestCue = cue
    }
  })
  return bestScore >= 1 ? bestCue : null
}

const longestPhraseInCue = (target: string, cueText: string) => {
  const normalizedTarget = normalizeNoteText(target)
  const normalizedCue = normalizeNoteText(cueText)
  const lowerTarget = normalizedTarget.toLowerCase()
  const lowerCue = normalizedCue.toLowerCase()
  const directIndex = lowerCue.indexOf(lowerTarget)
  if (directIndex >= 0) {
    return normalizedCue.slice(directIndex, directIndex + normalizedTarget.length)
  }

  const words = lowerTarget.split(/\s+/).filter(Boolean)
  let best = ''
  for (let start = 0; start < words.length; start += 1) {
    for (let end = words.length; end > start; end -= 1) {
      const chunk = words.slice(start, end).join(' ')
      const index = lowerCue.indexOf(chunk)
      if (index >= 0 && chunk.length > best.length) {
        best = normalizedCue.slice(index, index + chunk.length)
      }
    }
  }
  return best || normalizedTarget
}

const isQualityNote = (note: SpeakingSampleSubtitleNote) => {
  const phrase = normalizeNoteText(note.phrase)
  if (!phrase) return false
  if (note.kind === 'grammar' || note.grammarRule) {
    return Boolean(normalizeNoteText(note.grammarRule || '') && normalizeNoteText(note.thaiMeaning || ''))
  }
  if (note.kind === 'vocabulary' || note.partOfSpeech || note.thaiMeaning) {
    return Boolean(normalizeNoteText(note.partOfSpeech || '') && normalizeNoteText(note.thaiMeaning || ''))
  }
  return Boolean(normalizeNoteText(note.detail || '') && (note.detail || '').length > 12)
}

const collectQualityNotes = (cues: SpeakingSampleSubtitleCue[]) =>
  cues.flatMap((cue) => (cue.notes || []).filter(isQualityNote))

const isRichStructuredNote = (note: SpeakingSampleSubtitleNote) => {
  if (!isQualityNote(note)) return false
  return Boolean(normalizeNoteText(note.thaiMeaning || ''))
}

export const suggestSpeakingSampleSubtitleNotes = (
  cues: SpeakingSampleSubtitleCue[],
  transcript = ''
): SpeakingSampleSubtitleNote[] => {
  const cueText = cues.map((cue) => cue.text).join(' ')
  const fullText = normalizeNoteText([transcript, cueText].filter(Boolean).join(' '))
  if (!fullText) return []

  const suggestions: SpeakingSampleSubtitleNote[] = []
  const usedPhrases = new Set<string>()
  let discourseMarkerCount = 0
  let noteId = 1

  const isDiscourseMarker = (value: string) => {
    const lower = normalizeNoteText(value).toLowerCase()
    return [...DISCOURSE_MARKERS].some((marker) => lower === marker || lower.startsWith(`${marker} `) || lower.includes(marker))
  }

  const registerPhrase = (displayPhrase: string) => {
    const lower = normalizeDedupeKey(displayPhrase)
    for (let index = suggestions.length - 1; index >= 0; index -= 1) {
      const existing = normalizeDedupeKey(suggestions[index].fullPhrase || suggestions[index].phrase)
      if (lower.includes(existing) && lower !== existing) {
        usedPhrases.delete(existing)
        suggestions.splice(index, 1)
      }
    }
    if ([...usedPhrases].some((used) => used.includes(lower) && used !== lower)) return false
    if (usedPhrases.has(lower)) return false
    usedPhrases.add(lower)
    return true
  }

  const addSuggestion = (
    note: Omit<SpeakingSampleSubtitleNote, 'id'> & { id?: string; score?: number; matchPhrase?: string }
  ) => {
    const matchPhrase = normalizeNoteText(note.matchPhrase || note.fullPhrase || note.phrase)
    const cue = findCueForPhrase(cues, matchPhrase)
    if (!cue) return false

    const highlightPhrase = longestPhraseInCue(matchPhrase, cue.text)
    if (!highlightPhrase) return false

    if (note.kind === 'grammar' && !isUsefulGrammarPhrase(highlightPhrase) && !isUsefulGrammarPhrase(matchPhrase)) {
      return false
    }

    const displayPhrase = normalizeNoteText(note.fullPhrase || matchPhrase)
    if (!registerPhrase(displayPhrase)) return false

    if (note.kind !== 'grammar' && isDiscourseMarker(displayPhrase)) {
      if (discourseMarkerCount >= 1) {
        usedPhrases.delete(displayPhrase.toLowerCase())
        return false
      }
      discourseMarkerCount += 1
    }

    suggestions.push({
      ...note,
      id: note.id || `auto-${noteId++}`,
      fullPhrase: displayPhrase,
      phrase: highlightPhrase,
      detail:
        note.detail ||
        (note.kind === 'grammar'
          ? `${note.grammarRule || ''} · ${note.thaiMeaning || ''}`.trim()
          : `${displayPhrase} · ${note.partOfSpeech || ''} · ${note.thaiMeaning || ''}`.trim())
    })
    return true
  }

  type ScoredCandidate = Omit<SpeakingSampleSubtitleNote, 'id'> & { score: number; matchPhrase: string }

  const vocabCandidates: ScoredCandidate[] = []

  for (const pattern of VOCAB_PATTERNS) {
    const regex = new RegExp(pattern.pattern.source, pattern.pattern.flags)
    let match = regex.exec(fullText)
    while (match) {
      const matchPhrase = pattern.pickPhrase(match, fullText)
      vocabCandidates.push({
        phrase: matchPhrase,
        matchPhrase,
        kind: 'vocabulary',
        partOfSpeech: pattern.partOfSpeech,
        thaiMeaning: pattern.thai,
        score: pattern.score
      })
      match = regex.exec(fullText)
    }
  }

  for (const [term, meta] of Object.entries(VOCAB_GLOSSARY)) {
    const index = fullText.toLowerCase().indexOf(term.toLowerCase())
    if (index < 0) continue
    const matchPhrase = fullText.slice(index, index + term.length)
    vocabCandidates.push({
      phrase: matchPhrase,
      matchPhrase,
      kind: 'vocabulary',
      partOfSpeech: meta.partOfSpeech,
      thaiMeaning: meta.thai,
      score: scoreStaticVocab(term, meta)
    })
  }

  vocabCandidates
    .sort((a, b) => b.score - a.score)
    .forEach((candidate) => {
      if (suggestions.filter((item) => item.kind === 'vocabulary').length >= SPEAKING_SAMPLE_NOTE_LIMITS.vocabulary) {
        return
      }
      const { score: _score, matchPhrase, ...note } = candidate
      addSuggestion({ ...note, matchPhrase })
    })

  const grammarCandidates: ScoredCandidate[] = []
  for (const grammar of GRAMMAR_PATTERNS) {
    const regex = new RegExp(grammar.pattern.source, grammar.pattern.flags)
    let match = regex.exec(fullText)
    while (match) {
      const phrase = grammar.pickPhrase(match, fullText)
      if (isUsefulGrammarPhrase(phrase)) {
        const example = sentenceAround(fullText, match.index)
        grammarCandidates.push({
          phrase: grammar.pickPhrase(match, fullText),
          matchPhrase: phrase,
          kind: 'grammar',
          grammarRule: grammar.grammarRule,
          thaiMeaning: grammar.thai,
          exampleSentence: example.includes(phrase) ? example : `"${example}"`,
          score: phrase.split(/\s+/).length * 6 + 40
        })
      }
      match = regex.exec(fullText)
    }
  }

  grammarCandidates
    .sort((a, b) => b.score - a.score)
    .slice(0, SPEAKING_SAMPLE_NOTE_LIMITS.grammar)
    .forEach((candidate) => {
      const { score: _score, matchPhrase, ...note } = candidate
      addSuggestion({ ...note, matchPhrase })
    })

  return suggestions.slice(0, SPEAKING_SAMPLE_NOTE_LIMITS.total)
}

export const enrichSpeakingSampleSubtitlesWithNotes = (
  cues: SpeakingSampleSubtitleCue[],
  transcript = '',
  options: { force?: boolean } = {}
): SpeakingSampleSubtitleCue[] => {
  const richNotes = collectQualityNotes(cues).filter(isRichStructuredNote)
  if (
    !options.force &&
    richNotes.length >= SPEAKING_SAMPLE_NOTE_LIMITS.total &&
    richNotes.every(isRichStructuredNote)
  ) {
    return cues.map((cue) => ({
      ...cue,
      notes: (cue.notes || []).map((note) => ({
        ...note,
        kind: note.kind || (note.grammarRule ? 'grammar' : note.partOfSpeech ? 'vocabulary' : undefined)
      }))
    }))
  }

  const suggestions = suggestSpeakingSampleSubtitleNotes(cues, transcript)
  if (!suggestions.length) return cues

  const nextCues = cues.map((cue) => ({ ...cue, notes: [] as SpeakingSampleSubtitleNote[] }))
  suggestions.forEach((note) => {
    const cue = findCueForPhrase(nextCues, note.fullPhrase || note.phrase)
    if (!cue) return
    cue.notes = [...(cue.notes || []), note]
  })
  return nextCues
}

export const estimateSpeakingSampleSubtitleNoteRevealSeconds = (
  cue: Pick<SpeakingSampleSubtitleCue, 'startSeconds' | 'endSeconds' | 'text'>,
  phrase: string
) => {
  const text = normalizeNoteText(cue.text)
  const normalizedPhrase = normalizeNoteText(phrase)
  const duration = Math.max(0.12, cue.endSeconds - cue.startSeconds)
  if (!text || !normalizedPhrase) return cue.startSeconds
  const phraseIndex = text.toLowerCase().indexOf(normalizedPhrase.toLowerCase())
  if (phraseIndex < 0) return cue.startSeconds
  const phraseProgress = Math.min(0.95, Math.max(0, phraseIndex / Math.max(1, text.length)))
  return cue.startSeconds + duration * phraseProgress
}

export type RevealedSpeakingSampleSubtitleNote = SpeakingSampleSubtitleNote & {
  cueId: string
  revealSeconds: number
}

/** Notes that have been reached in playback — they stay visible for the rest of the video. */
export const getRevealedSpeakingSampleSubtitleNotes = (
  cues: SpeakingSampleSubtitleCue[],
  videoTime: number,
  maxNotes = SPEAKING_SAMPLE_NOTE_LIMITS.overlayMax
): RevealedSpeakingSampleSubtitleNote[] => {
  const seen = new Set<string>()
  const revealed: RevealedSpeakingSampleSubtitleNote[] = []

  cues.forEach((cue) => {
    ;(cue.notes || []).forEach((note) => {
      const phrase = normalizeNoteText(note.phrase)
      if (!phrase) return
      const revealSeconds = estimateSpeakingSampleSubtitleNoteRevealSeconds(cue, phrase)
      if (videoTime < revealSeconds - 0.02) return
      const key = normalizeNoteText(note.fullPhrase || note.phrase).toLowerCase()
      if (seen.has(key)) return
      seen.add(key)
      revealed.push({
        ...note,
        cueId: cue.id,
        revealSeconds
      })
    })
  })

  return revealed.sort((a, b) => a.revealSeconds - b.revealSeconds).slice(0, maxNotes)
}

export const isSpeakingSampleSubtitlePhraseRevealed = (
  cue: Pick<SpeakingSampleSubtitleCue, 'startSeconds' | 'endSeconds' | 'text'>,
  phrase: string,
  videoTime: number
) => videoTime >= estimateSpeakingSampleSubtitleNoteRevealSeconds(cue, phrase) - 0.02

export type SpeakingSampleVocabularyGuideItem = {
  level: 'B1' | 'B2' | 'C1'
  phrase: string
  tip: string
}

export const collectUniqueSpeakingSampleSubtitleNotes = (
  cues: SpeakingSampleSubtitleCue[] = []
): SpeakingSampleSubtitleNote[] => {
  const seen = new Set<string>()
  const notes: SpeakingSampleSubtitleNote[] = []

  cues.forEach((cue) => {
    ;(cue.notes || []).forEach((note) => {
      const key = normalizeNoteText(note.fullPhrase || note.phrase).toLowerCase()
      if (!key || seen.has(key)) return
      seen.add(key)
      notes.push(note)
    })
  })

  return notes
}

const inferSpeakingSampleNoteLevel = (parsed: ParsedSpeakingSampleSubtitleNote): 'B1' | 'B2' => {
  if (parsed.kind === 'grammar') return 'B2'
  if (DISCOURSE_MARKERS.has(parsed.phrase.toLowerCase())) return 'B2'
  return parsed.phrase.split(/\s+/).filter(Boolean).length >= 3 ? 'B2' : 'B1'
}

/** Maps highlighted subtitle notes into Part 2 vocabulary guide cards. */
export const speakingSampleSubtitleNotesToVocabularyGuideItems = (
  cues: SpeakingSampleSubtitleCue[] = []
): SpeakingSampleVocabularyGuideItem[] =>
  collectUniqueSpeakingSampleSubtitleNotes(cues)
    .map((note) => parseSpeakingSampleSubtitleNote(note))
    .filter((parsed): parsed is ParsedSpeakingSampleSubtitleNote => Boolean(parsed))
    .map((parsed) => {
      const level = inferSpeakingSampleNoteLevel(parsed)
      if (parsed.kind === 'grammar') {
        const tipParts = [parsed.headline, parsed.body, parsed.example ? `เช่น ${parsed.example}` : ''].filter(Boolean)
        return {
          level,
          phrase: parsed.phrase,
          tip: tipParts.join(' · ')
        }
      }
      return {
        level,
        phrase: parsed.headline || parsed.phrase,
        tip: parsed.body || parsed.phrase
      }
    })
