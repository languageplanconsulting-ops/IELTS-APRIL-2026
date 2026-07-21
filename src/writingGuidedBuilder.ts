// Guided, step-by-step Writing Task 1 essay builder.
//
// Each exercise walks a student through one model essay, ONE paragraph at a time
// (Introduction -> Overview -> Body 1 -> Body 2), like a mobile game. Every paragraph
// mixes two kinds of blanks:
//   - `select` : a dropdown / multiple-choice blank (paraphrasing, word choice, transition,
//                referencing). One option is correct; the distractors are plausible but wrong.
//   - `type`   : a fill-in-the-blank the student types. The `base` (dictionary form of the
//                verb) is shown as a hint, and the student must supply the correctly
//                conjugated form. Accepted answers are matched case-insensitively and trimmed.
//
// The prose is deliberately SIMPLE and follows the teacher's own pattern:
//   "Starting in ... at X%, the number of ... was the highest, followed by A, B, respectively.
//    However, ... increased, whereas that of the other cities declined ..."
//   "Between YEAR and YEAR, ... increased, peaking at X% in YEAR,
//    while the comparison reached its lowest point at Y% in YEAR."
//
// Reused devices: this number / that of · respectively (always after a comma) · however /
// whereas / on the other hand · peaking at · reaching the lowest point · followed by ·
// decreased dramatically. Timeline descriptions always state exact chart years.

import { EXTRA_MAP_GUIDED_BUILDERS, quizMapArticles } from './writingTask1MapExercises'
import { EXTRA_TASK1_GUIDED_BUILDERS } from './writingTask1ExtraBuilders'
import { overviewOpener } from './writingTask1Overview'

// A blank's `focus` only drives which coach message is shown; either blank kind may carry any
// focus, so both share this union.
export type WgbFocus =
  | 'paraphrase'
  | 'word-choice'
  | 'transition'
  | 'referencing'
  | 'trend-phrase'
  | 'verb-tense'
  | 'ving-clause'
  | 'v3-clause'
  | 'degree-adverb'
  | 'article'
  | 'letter-hint'

export type WgbSelectBlank = {
  kind: 'select'
  id: string
  options: string[]
  answer: string
  focus: WgbFocus
  // Thai one-liner explaining WHY the correct option fits — shown when the student is wrong.
  explain?: string
}

export type WgbTypeBlank = {
  kind: 'type'
  id: string
  base: string // shown as a hint in the input, e.g. "increase"
  answers: string[] // accepted answers (case-insensitive, trimmed)
  focus: WgbFocus
  // Thai one-liner explaining WHY the correct form fits — shown when the student is wrong.
  explain?: string
  /** Thai gloss for letter-hint TH button / notebook save */
  thaiMeaning?: string
}

export type WgbBlank = WgbSelectBlank | WgbTypeBlank

export type WgbSegment = { kind: 'text'; text: string } | { kind: 'blank'; blank: WgbBlank }

export type WgbStep = {
  id: string
  role: 'intro' | 'overview' | 'body1' | 'body2'
  labelTh: string
  hintTh?: string
  segments: WgbSegment[]
}

export type WgbExercise = {
  id: string
  promptId: string
  steps: WgbStep[]
}

// ── authoring helpers ────────────────────────────────────────────────
const t = (text: string): WgbSegment => ({ kind: 'text', text })
const sel = (
  id: string,
  options: string[],
  answer: string,
  focus: WgbFocus,
  explain?: string
): WgbSegment => ({ kind: 'blank', blank: { kind: 'select', id, options, answer, focus, explain } })
const typ = (
  id: string,
  base: string,
  answers: string[],
  focus: WgbFocus,
  explain?: string
): WgbSegment => ({ kind: 'blank', blank: { kind: 'type', id, base, answers, focus, explain } })

export const ROLE_LABEL_TH: Record<WgbStep['role'], string> = {
  intro: 'Introduction',
  overview: 'Overview',
  body1: 'Body Paragraph 1',
  body2: 'Body Paragraph 2'
}

const HINT_PARAPHRASE = 'เลือกคำ paraphrase ที่เหมาะสมที่สุด (ความหมายเดียวกับโจทย์)'
const HINT_CONJUGATE = 'พิมพ์คำกริยาที่ผันรูปให้ถูกต้อง — คำในวงเล็บคือรูปพื้นฐาน'

// ── coach copy ───────────────────────────────────────────────────────
// Shown by default for the current step (teaches the technique for that paragraph).
export const STEP_COACH_TH: Record<WgbStep['role'], string> = {
  intro:
    'Introduction ของ Timeline และ No Timeline ต้องมี 1 ประโยคเท่านั้น โดยพาราเฟรสโจทย์ด้วย synonym หรือเปลี่ยนโครงสร้าง ห้ามเขียนประโยคที่ 2',
  overview:
    'Overview ต้องมี 1 ประโยค และเปิดด้วย “Overall, it can be clearly observed that …” เสมอ: Timeline สรุปทิศทางหลัก; No Timeline ที่มี 2 ภาพให้บอกเฉพาะสิ่งที่มากที่สุดของแต่ละภาพ ส่วนภาพเดียวใช้ “… X was the largest, while Y was the smallest in share.” ห้ามใช้ contrasting with หรือ leaving other sources',
  body1:
    'Timeline Body 1 ต้องระบุปีและใช้ complex sentence ตามแบบเรียน; Pie chart / Map Body 1 ต้องเปิดด้วย “Starting with …” — Map ใช้ northern หรือ western part of the map',
  body2:
    'Timeline Body 2 ต้องระบุปีจริงจากกราฟ; Pie chart / Map Body 2 ต้องเปิดด้วย “In terms of …” — Map ใช้ eastern side/section หรือ southern section of the map'
}

// Shown when a specific blank is focused, replacing the step message while focused.
export const BLANK_COACH_TH: Record<WgbBlank['focus'], string> = {
  paraphrase: 'ช่องนี้คือการพาราเฟรส — ใช้ synonym แทนคำในโจทย์ หรือเปลี่ยนโครงสร้างประโยคใหม่',
  'word-choice': 'เลือกคำที่ความหมายและไวยากรณ์เข้ากับประโยคที่สุด อ่านทั้งประโยคก่อนตัดสินใจ',
  transition:
    'เลือกคำเปิดตามชนิดคำถาม: Pie/Map Body 1 ใช้ Starting with และ Body 2 ใช้ In terms of; Map Body 1 = northern/western part · Body 2 = eastern side/section หรือ southern section; Map body ใช้ while/whereas/although + Interestingly/However/Surprisingly/It is interesting to note that/On the other hand; No Timeline Overview เปิดด้วย Overall, it can be clearly observed that แล้วใช้ while กลางประโยค; Timeline ใช้คำเชื่อมตามความสัมพันธ์ของข้อมูล',
  referencing: 'ตรงนี้อ้างถึงคำนามที่พูดถึงไปแล้ว — ใช้ "this number" หรือ "that of" แบบไหนถึงจะถูก?',
  'trend-phrase':
    'Timeline Overview: ขาขึ้นต้องเลือก experienced an upward trend (ห้าม showed) · ขาลงใช้ showed a downward trend · หรือ fluctuate / remain unchanged — ห้ามใส่ตัวเลข',
  'verb-tense': 'ช่องนี้ต้องผันเป็นอดีต (past tense) เสมอ เพราะทั้งเรียงความเล่าข้อมูลที่เกิดขึ้นแล้ว — เช็คแค่ประธานเอกพจน์หรือพหูพจน์',
  'ving-clause': 'ตรงนี้น่าจะต้องใช้โครงสร้าง V-ing clause (เช่น reaching, climbing, peaking) — ลองนึกกริยาที่เห็นภาพการเปลี่ยนแปลง',
  'v3-clause': 'ตรงนี้น่าจะต้องใช้ V3 (past participle) เช่น followed by, compared to — ลองดูบริบทว่าเข้ากับโครงสร้างไหน',
  'degree-adverb': 'ควรใช้ adverb บอกระดับการเปลี่ยนแปลงแบบไหนดี เช่น dramatically, steadily, gradually, sharply?',
  article:
    'ช่องนี้ทดสอบ article — เลือก a / an / the ให้ถูกกับคำนาม (นับได้เจาะจง ใช้ the · ทั่วไปครั้งแรกใช้ a/an · an ใช้หน้าเสียงสระ)',
  'letter-hint':
    'ช่องคำศัพท์แบบใบ้ตัวอักษร: เห็น 2–3 ตัวแรกแล้วเติมตัวที่เหลือให้ครบ (เช่น mot_ _ _ _ _ _ _ → motivation) — สะกดทั้งคำให้ตรงบริบท'
}

export const WRITING_GUIDED_BUILDERS: WgbExercise[] = [
{
    id: 'gb-vietnam-us-exports',
    promptId: 'snapshot-vietnam-us-exports',
    steps: [
      {
        id: 'gb8-intro',
        role: 'intro',
        labelTh: ROLE_LABEL_TH.intro,
        hintTh: HINT_PARAPHRASE,
        segments: [
          t('The two pie charts '),
          sel('gb8-i2', ['compare', 'complain', 'compete'], 'compare', 'paraphrase', 'The two pie charts เป็นประธานพหูพจน์ จึงใช้ compare เท่านั้น'),
          t(' the '),
          sel('gb8-i3', ['value', 'weight', 'speed'], 'value', 'paraphrase', 'ตัวเลขเป็นดอลลาร์จึงเป็น value (มูลค่า) ไม่ใช่ weight (น้ำหนัก) หรือ speed (ความเร็ว)'),
          t(' of goods '),
          sel('gb8-i4', ['traded', 'invented', 'forgotten'], 'traded', 'word-choice', 'สินค้าที่ถูก traded (ซื้อขาย) ระหว่างสองประเทศ ส่วน invented (ประดิษฐ์) และ forgotten (ลืม) ไม่เข้ากับบริบทการค้า'),
          t(' '),
          sel('gb8-i12', ['between', 'among', 'along'], 'between', 'word-choice', 'between ใช้กับสองฝ่าย (US กับ Vietnam) ส่วน among (สามฝ่ายขึ้นไป) และ along (ตามแนว) ผิดความหมาย'),
          t(' the US and Vietnam, '),
          sel('gb8-i13', ['broken', 'breaking', 'broke'], 'broken', 'v3-clause', 'V3 broken (ในสำนวน broken down) = ถูกแบ่งย่อย (passive) ส่วน breaking (V-ing) และ broke (อดีตธรรมดา) ไม่เข้าโครงสร้างนี้'),
          t(' '),
          sel('gb8-i5', ['down', 'up', 'off'], 'down', 'word-choice', 'broken down by = แบ่งย่อยตาม (หมวดสินค้า) ส่วน broken up (แตกสลาย) และ broken off (หักออก) ผิดความหมาย'),
          t(' by product '),
          sel('gb8-i6', ['category', 'century', 'ceremony'], 'category', 'paraphrase', 'category = หมวดหมู่สินค้า ส่วน century (ศตวรรษ) และ ceremony (พิธี) ไม่เกี่ยวกับสินค้า'),
          t(' and '),
          sel('gb8-i7', ['measured', 'guessed', 'imagined'], 'measured', 'word-choice', 'ข้อมูลถูก measured (วัด/คิดเป็น) หน่วยดอลลาร์ ส่วน guessed (เดา) และ imagined (จินตนาการ) ไม่ใช่ข้อมูลจริง'),
          t(' in '),
          sel('gb8-i8', ['millions of dollars', 'hours of work', 'days of travel'], 'millions of dollars', 'word-choice', 'หน่วยของกราฟคือล้านดอลลาร์ ส่วนชั่วโมงทำงานและวันเดินทางไม่ตรงกับข้อมูล'),
          t(' in '),
          sel('gb8-i9', ['2023', '2032', '3023'], '2023', 'word-choice', 'ปีของข้อมูลคือ 2023 ตามโจทย์ ตัวเลขอื่นเป็นการสลับตัวเลขที่ผิด'),
          t('.')
        ]
      },
      {
        id: 'gb8-overview',
        role: 'overview',
        labelTh: ROLE_LABEL_TH.overview,
        hintTh: HINT_CONJUGATE,
        segments: [
          ...overviewOpener('gb8'),
          t('coffee '),
          typ('gb8-o3', 'be', ['was'], 'verb-tense', 'ประธาน coffee เอกพจน์ + เล่าอดีต จึงใช้ was'),
          t(' the '),
          sel('gb8-o4', ['largest', 'larger', 'large'], 'largest', 'word-choice', 'largest = มากที่สุด (superlative) เพราะเทียบกับทุกหมวดในวง ส่วน larger ใช้เทียบแค่ 2 สิ่ง'),
          t(' share of Vietnam’s exports to the US, '),
          sel('gb8-o5', ['while', 'because', 'unless'], 'while', 'transition', 'while เชื่อมภาพสองวงที่เทียบกัน ส่วน because บอกเหตุผล และ unless แปลว่านอกจาก'),
          t(' aircraft parts were the largest share of US exports to Vietnam.')
        ]
      },
      {
        id: 'gb8-body1',
        role: 'body1',
        labelTh: ROLE_LABEL_TH.body1,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel('gb8-b1', ['Starting with', 'Despite', 'Unlike'], 'Starting with', 'transition', 'Body 1 ของ pie chart ต้องเปิดด้วย Starting with เท่านั้น'),
          t(' Vietnam’s exports to the US, the figure for coffee '),
          typ('gb8-b2', 'be', ['was'], 'verb-tense', 'ประธาน the figure เอกพจน์ + เล่าอดีต จึงใช้ was'),
          t(' the '),
          sel('gb8-b3', ['largest', 'larger', 'large'], 'largest', 'word-choice', 'largest = สูงสุด (superlative) เทียบกับทุกสินค้า ส่วน larger ใช้เทียบแค่ 2 สิ่ง และ large เป็นรูปธรรมดา'),
          t(', at $23 million, '),
          typ('gb8-b4', 'follow', ['followed'], 'v3-clause', 'โครงสร้าง followed by (V3) = ตามมาด้วย ใช้บอกลำดับถัดลงมา'),
          t(' '),
          sel('gb8-b13', ['by', 'with', 'for'], 'by', 'word-choice', 'followed by = ตามมาด้วย ใช้ by เสมอ ส่วน with และ for ไม่เข้ากับสำนวนนี้'),
          t(' fruit and vegetables, which '),
          typ('gb8-b5', 'stand', ['stood'], 'verb-tense', 'ประธานเอกพจน์ + เล่าอดีต จึงผัน stand เป็น stood (stood at = อยู่ที่)'),
          t(' at $16 million. '),
          sel('gb8-b9', ['However', 'Therefore', 'For example'], 'However', 'transition', 'However เปิดประโยคเปรียบเทียบใหม่'),
          t(', the figures for seafood and rice '),
          typ('gb8-b6', 'be', ['were'], 'verb-tense', 'ประธานพหูพจน์ the figures + เล่าอดีต จึงใช้ were'),
          t(' '),
          sel('gb8-b17', ['significantly', 'markedly', 'barely'], 'significantly', 'degree-adverb', 'significantly = อย่างมาก (ใช้คำนี้เท่านั้น) ส่วน markedly ห้ามใช้ และ barely = แทบไม่'),
          t(' '),
          sel('gb8-b7', ['smaller', 'larger', 'wider'], 'smaller', 'word-choice', 'seafood/rice มูลค่าน้อยกว่า coffee มาก จึง smaller ส่วน larger (ใหญ่กว่า) และ wider (กว้างกว่า) ผิดทิศทาง'),
          t(', '),
          typ('gb8-b7b', 'stand', ['standing'], 'ving-clause', 'หลัง comma ใช้ V-ing clause: standing at'),
          t(' at $4.4 and $4.3 million, '),
          sel('gb8-b8', ['respectively', 'roughly', 'partly'], 'respectively', 'word-choice', 'respectively = ตามลำดับ จับคู่ตัวเลขกับสินค้าที่ระบุก่อนหน้า (ต้องมี comma นำหน้าเสมอ) ส่วน roughly/partly ผิดความหมาย'),
          t('. '),
          sel('gb8-b9b', ['However', 'Therefore', 'For example'], 'However', 'transition', 'However เปิดประโยคเปรียบเทียบใหม่'),
          t(', the figures for garments and other goods '),
          typ('gb8-b10', 'be', ['were'], 'verb-tense', 'ประธานพหูพจน์ the figures + เล่าอดีต จึงใช้ were'),
          t(' each the '),
          sel('gb8-b11', ['lowest', 'longest', 'loudest'], 'lowest', 'word-choice', 'garments/other goods มูลค่าต่ำสุด จึง lowest ส่วน longest (ยาวสุด) และ loudest (ดังสุด) ใช้กับมูลค่าไม่ได้'),
          t(', at just $2 million.')
        ]
      },
      {
        id: 'gb8-body2',
        role: 'body2',
        labelTh: ROLE_LABEL_TH.body2,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel('gb8-c1', ['In terms of', 'In spite of', 'Instead of'], 'In terms of', 'transition', 'In terms of = ในแง่ของ ใช้ตั้งหัวข้อ ส่วน In spite of (ทั้งที่) และ Instead of (แทนที่จะ) เปลี่ยนความหมาย'),
          t(' US exports to Vietnam, the figure for aircraft parts '),
          typ('gb8-c2', 'be', ['was'], 'verb-tense', 'ประธาน the figure เอกพจน์ + เล่าอดีต จึงใช้ was'),
          t(' the '),
          sel('gb8-c3', ['largest', 'larger', 'large'], 'largest', 'word-choice', 'largest = สูงสุด (superlative) เทียบกับทุกสินค้า ส่วน larger ใช้เทียบแค่ 2 สิ่ง และ large เป็นรูปธรรมดา'),
          t(', '),
          sel('gb8-c5', ['at', 'by', 'to'], 'at', 'word-choice', 'ระบุจุดมูลค่าใช้ at $72 million ส่วน by (ภายใน) และ to (ถึง) ไม่เข้ากับการระบุมูลค่า'),
          t(' $72 million. '),
          sel('gb8-c4', ['Similarly', 'Therefore', 'Moreover'], 'Similarly', 'transition', 'Similarly = ในทำนองเดียวกัน ใช้เปิดประโยคที่เล่าค่ารองลงมา'),
          t(', the figures for fertiliser and cotton '),
          typ('gb8-c6', 'follow', ['followed'], 'verb-tense', 'past simple เล่าอดีต + ประธานพหูพจน์ ใช้ followed (ตามมา)'),
          t(' '),
          sel('gb8-c15', ['closely', 'closest', 'close'], 'closely', 'degree-adverb', 'followed closely = ตามมาอย่างใกล้ชิด ใช้ adverb closely ขยายกริยา ส่วน closest (ขั้นกว่าสุด) และ close (adj/adv บอกระยะ) ไม่เข้ากับตำแหน่งนี้'),
          t(', at $16.5 and $12 million, '),
          sel('gb8-c7', ['respectively', 'exactly', 'nearly'], 'respectively', 'word-choice', 'respectively = ตามลำดับ จับคู่ตัวเลขกับ fertiliser/cotton (มี comma นำหน้าเสมอ) ส่วน exactly/nearly ผิดความหมาย'),
          t('. '),
          sel('gb8-c8', ['In contrast', 'Therefore', 'Moreover'], 'In contrast', 'transition', 'In contrast เปิดประโยคเปรียบเทียบใหม่'),
          t(', that of cars '),
          typ('gb8-c9', 'be', ['was'], 'verb-tense', 'ประธานเอกพจน์ (that = the figure) + เล่าอดีต จึงใช้ was'),
          t(' the '),
          sel('gb8-c10', ['lowest', 'tallest', 'quickest'], 'lowest', 'word-choice', 'cars มูลค่าต่ำสุดฝั่งสหรัฐ จึง lowest ส่วน tallest (สูงสุด) และ quickest (เร็วสุด) ใช้กับมูลค่าไม่ได้'),
          t(', at just $6 million.')
        ]
      }
    ]
  },

{
    id: 'gb-universities-table',
    promptId: 'snapshot-universities-table',
    steps: [
      {
        id: 'gb11-intro',
        role: 'intro',
        labelTh: ROLE_LABEL_TH.intro,
        hintTh: HINT_PARAPHRASE,
        segments: [
          t('The table '),
          sel('gb11-i1', ['compares', 'complains', 'commands'], 'compares', 'paraphrase', 'compare = เปรียบเทียบข้อมูล ตรงกับตารางที่เทียบมหาวิทยาลัย ส่วน complain (บ่น) และ command (สั่ง) เป็นการกระทำของคน ใช้กับตารางไม่ได้'),
          t(' five '),
          sel('gb11-i2', ['universities', 'universes', 'utilities'], 'universities', 'paraphrase', 'university = มหาวิทยาลัย ตรงกับโจทย์ ส่วน universe (จักรวาล) และ utility (สาธารณูปโภค) คนละความหมาย'),
          t(' '),
          sel('gb11-i3', ['across', 'above', 'behind'], 'across', 'word-choice', 'across = ครอบคลุมหลายหัวข้อ ใช้บอกว่าเทียบข้ามหลายตัวชี้วัด ส่วน above (เหนือ) และ behind (ข้างหลัง) บอกตำแหน่ง ไม่เข้ากับความหมายนี้'),
          t(' four '),
          sel('gb11-i4', ['indicators', 'accidents', 'instructions'], 'indicators', 'paraphrase', 'indicator = ตัวชี้วัด ตรงกับหัวข้อในตาราง ส่วน accident (อุบัติเหตุ) และ instruction (คำสั่ง) คนละความหมาย'),
          t(': '),
          sel('gb11-i5', ['research output', 'research party', 'research holiday'], 'research output', 'word-choice', 'research output = ผลงานวิจัย เป็นคำที่ใช้จริงในบริบทวิชาการ ส่วนอีกสองตัวเลือกไม่มีความหมายในเชิงตัวชี้วัด'),
          t(', satisfaction, employment '),
          sel('gb11-i6', ['and', 'but', 'or'], 'and', 'transition', 'and ใช้เชื่อมรายการสุดท้ายในลิสต์ ส่วน but (แต่) แสดงความขัดแย้ง และ or (หรือ) ให้เลือก ไม่เหมาะกับการไล่รายการ'),
          t(' international students, '),
          sel('gb11-i7', ['in', 'on', 'at'], 'in', 'word-choice', 'ใช้ in กับปี (in 2024) เสมอ ส่วน on ใช้กับวันที่ และ at ใช้กับเวลา'),
          t(' 2024.')
        ]
      },
      {
        id: 'gb11-overview',
        role: 'overview',
        labelTh: ROLE_LABEL_TH.overview,
        hintTh: HINT_CONJUGATE,
        segments: [
          ...overviewOpener('gb11'),
          t('Oxford’s '),
          sel('gb11-o3', ['research', 'rehearsal', 'reservation'], 'research', 'word-choice', 'research output = ผลงานวิจัย ส่วน rehearsal (การซ้อม) และ reservation (การจอง) ผิดความหมาย'),
          t(' output '),
          typ('gb11-o4', 'be', ['was'], 'verb-tense', 'ประธาน output เอกพจน์ + เล่าอดีต จึงใช้ was'),
          t(' the largest, '),
          sel('gb11-o5', ['while', 'because', 'unless'], 'while', 'transition', 'while เชื่อมค่าที่มากที่สุดกับค่าที่น้อยที่สุด ส่วน because บอกเหตุผล และ unless แปลว่านอกจาก'),
          t(' Chulalongkorn’s was the smallest in share.')
        ]
      },
      {
        id: 'gb11-body1',
        role: 'body1',
        labelTh: ROLE_LABEL_TH.body1,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel('gb11-b1', ['In terms of', 'In spite of', 'Instead of'], 'In terms of', 'transition', 'In terms of = ในด้าน ใช้เปิดหัวข้อที่กำลังจะพูด ส่วน In spite of (ทั้งๆ ที่) และ Instead of (แทนที่จะ) คนละความหมาย'),
          t(' research output, Oxford '),
          typ('gb11-b2', 'produce', ['produced'], 'verb-tense', 'ประธานเอกพจน์ Oxford + เล่าอดีต จึงผัน produce เป็น produced'),
          t(' the '),
          sel('gb11-b3', ['most', 'more', 'much'], 'most', 'word-choice', 'the most = มากที่สุด เทียบกับทุกมหาวิทยาลัย ส่วน more (กว่า) เทียบแค่สองสิ่ง และ much ไม่ใช้ในรูปขั้นสูงสุด'),
          t(' at 48,500 papers, '),
          typ('gb11-b4', 'follow', ['followed'], 'v3-clause', 'ใช้โครงสร้าง followed by (V3) เพื่อไล่อันดับรองลงมา'),
          t(' '),
          sel('gb11-b5', ['by', 'with', 'from'], 'by', 'word-choice', 'followed by = ตามมาด้วย เป็นวลีตายตัวใช้บุพบท by ส่วน with และ from ไม่เข้ากับโครงสร้างนี้'),
          t(' MIT at 42,000 and Seoul National '),
          sel('gb11-b5b', ['at', 'on', 'by'], 'at', 'word-choice', 'ระบุค่าตัวเลขจุดเดียวใช้ at 22,100 ส่วน on และ by ไม่ใช้บอกค่าแบบนี้'),
          t(' 22,100. However, Chulalongkorn '),
          typ('gb11-b6', 'record', ['recorded'], 'verb-tense', 'ประธานเอกพจน์ + เล่าอดีต จึงผัน record เป็น recorded'),
          t(' '),
          sel('gb11-b7', ['by far', 'so far', 'as far'], 'by far', 'word-choice', 'by far the lowest = ต่ำสุดแบบทิ้งห่าง เป็นวลีเน้นความต่างชัดเจน ส่วน so far (จนถึงตอนนี้) และ as far ไม่เข้ากับความหมายนี้'),
          t(' the '),
          sel('gb11-b8', ['lowest', 'largest', 'busiest'], 'lowest', 'word-choice', 'lowest = ต่ำสุด ตรงกับตัวเลข 4,300 ที่น้อยสุด ส่วน largest (ใหญ่สุด) และ busiest (ยุ่งสุด) ไม่เข้ากับปริมาณผลงานวิจัย'),
          t(' figure, at only 4,300, '),
          typ('gb11-b9', 'account', ['accounting'], 'ving-clause', 'หลัง comma ใช้ V-ing clause: accounting for the lowest figure'),
          t(' for the lowest figure.')
        ]
      },
      {
        id: 'gb11-body2',
        role: 'body2',
        labelTh: ROLE_LABEL_TH.body2,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel('gb11-c1', ['As for', 'Despite', 'Unlike'], 'As for', 'transition', 'As for = ส่วนเรื่อง ใช้เปิดหัวข้อใหม่ที่กำลังจะพูด ส่วน Despite (ทั้งๆ ที่) และ Unlike (ไม่เหมือน) คนละความหมาย'),
          t(' student outcomes, MIT '),
          typ('gb11-c2', 'achieve', ['achieved'], 'verb-tense', 'ประธานเอกพจน์ MIT + เล่าอดีต จึงผัน achieve เป็น achieved'),
          t(' the '),
          sel('gb11-c3', ['highest', 'higher', 'highly'], 'highest', 'word-choice', 'เทียบกับทุกมหาวิทยาลัยจึงใช้ขั้นสูงสุด highest ส่วน higher (กว่า) เทียบแค่สองสิ่ง และ highly เป็น adverb'),
          t(' satisfaction '),
          sel('gb11-c4', ['at', 'in', 'by'], 'at', 'word-choice', 'ระบุตัวเลขจุดเดียวใช้ at 91% ส่วน in และ by ไม่ใช้บอกค่าตัวเลขแบบนี้'),
          t(' 91% and employment at 97%. Similarly, Oxford and Seoul National '),
          typ('gb11-c5', 'follow', ['followed'], 'verb-tense', 'ประธานพหูพจน์ + เล่าอดีต จึงผัน follow เป็น followed'),
          t(' '),
          sel('gb11-c6', ['closely', 'close', 'closer'], 'closely', 'word-choice', 'ขยายกริยา followed จึงใช้ adverb closely'),
          t('. '),
          sel('gb11-c7', ['In contrast', 'Therefore', 'Also'], 'In contrast', 'transition', 'In contrast เปิดประโยคเปรียบเทียบใหม่'),
          t(', Chulalongkorn '),
          typ('gb11-c8', 'remain', ['remained'], 'verb-tense', 'ประธานเอกพจน์ + เล่าอดีต จึงผัน remain เป็น remained'),
          t(' the '),
          sel('gb11-c9', ['lowest', 'lower', 'low'], 'lowest', 'word-choice', 'เทียบกับทุกมหาวิทยาลัยจึงใช้ขั้นสูงสุด lowest ส่วน lower (กว่า) เทียบแค่สองสิ่ง และ low เป็นรูปธรรมดา'),
          t(', '),
          sel('gb11-c10', ['recording', 'recorded', 'records'], 'recording', 'ving-clause', 'หลัง comma ใช้ V-ing clause: recording'),
          t(' 79% and 82%, '),
          sel('gb11-c11', ['respectively', 'exactly', 'nearly'], 'respectively', 'word-choice', 'respectively = ตามลำดับ จับคู่ satisfaction=79% และ employment=82% (ต้องมี comma นำหน้าเสมอ)'),
          t('. '),
          sel('gb11-c12', ['Similarly', 'Although', 'Because'], 'Similarly', 'transition', 'Similarly = ในทำนองเดียวกัน ใช้เปิดประโยคที่เล่าแนวโน้มซ้ำแบบเดิมในอีกคอลัมน์ ส่วน Although (แม้ว่า) และ Because (เพราะ) เป็นคำเชื่อมอนุประโยค'),
          t(', in terms of international students, MIT '),
          typ('gb11-c13', 'attract', ['attracted'], 'verb-tense', 'ประธานเอกพจน์ MIT + เล่าอดีต จึงผัน attract เป็น attracted'),
          t(' the largest share, '),
          typ('gb11-c14', 'follow', ['followed'], 'v3-clause', 'ใช้โครงสร้าง followed by (V3) เพื่อไล่อันดับรองลงมา'),
          t(' by Oxford and Seoul National. '),
          sel('gb11-c15', ['In contrast', 'Therefore', 'For example'], 'In contrast', 'transition', 'In contrast เปิดประโยคเปรียบเทียบใหม่'),
          t(', Chulalongkorn '),
          typ('gb11-c16', 'enrol', ['enrolled'], 'verb-tense', 'ประธานเอกพจน์ + เล่าอดีต จึงผัน enrol เป็น enrolled'),
          t(' the fewest, at 12%. Interestingly, the figure for Chulalongkorn was lower than that of MIT by 23%. Likewise, the figure for Seoul National was lower than that of Oxford by 14%.')
        ]
      }
    ]
  },

{
    id: 'gb-riverside-language-school',
    promptId: 'mixed-riverside-language-school',
    steps: [
      {
        id: 'gb12-intro',
        role: 'intro',
        labelTh: ROLE_LABEL_TH.intro,
        hintTh: HINT_PARAPHRASE,
        segments: [
          t('The charts '),
          sel('gb12-i1', ['compare', 'imagine', 'insist'], 'compare', 'paraphrase', 'The charts เป็นประธานพหูพจน์ จึงใช้ compare เท่านั้น'),
          t(' the '),
          sel('gb12-i2', ['nationality', 'personality', 'ability'], 'nationality', 'paraphrase', 'nationality = สัญชาติ ตรงกับข้อมูลในโจทย์ ส่วน personality (บุคลิก) และ ability (ความสามารถ) คนละความหมาย'),
          t(' of students '),
          sel('gb12-i2b', ['studying', 'cooking', 'driving'], 'studying', 'word-choice', 'students studying at a language school = นักเรียนที่เรียนอยู่ ตรงกับบริบท ส่วน cooking (ทำอาหาร) และ driving (ขับรถ) ไม่เกี่ยว'),
          t(' at Riverside Language School in 2023, the '),
          sel('gb12-i3', ['number', 'reason', 'chance'], 'number', 'paraphrase', 'number of students = จำนวนนักเรียน (enrolments) ส่วน reason (เหตุผล) และ chance (โอกาส) ไม่ตรงกับข้อมูล'),
          t(' of enrolments '),
          sel('gb12-i4', ['by', 'of', 'to'], 'by', 'word-choice', 'enrolments by course = แยกตามหลักสูตร ใช้ by แสดงการแบ่งกลุ่ม ส่วน of/to ไม่เข้ากับความหมายนี้'),
          t(' course, and the '),
          sel('gb12-i4b', ['total', 'partial', 'equal'], 'total', 'word-choice', 'total enrolments = ยอดลงทะเบียนรวม ตรงกับข้อมูล ส่วน partial (บางส่วน) และ equal (เท่ากัน) ไม่ตรง'),
          t(' number of enrolments '),
          sel('gb12-i5', ['between', 'among', 'beside'], 'between', 'word-choice', 'between A and B ใช้กับ 2 ปี (2014 กับ 2023) ส่วน among ใช้กับของ 3 สิ่งขึ้นไป และ beside แปลว่าข้างๆ'),
          t(' 2014 '),
          sel('gb12-i6', ['and', 'or', 'but'], 'and', 'word-choice', 'between … and … เป็นคู่กันเสมอ ต้องใช้ and ไม่ใช่ or หรือ but'),
          t(' 2023, using percentages, student numbers, and pass rates.')
        ]
      },
      {
        id: 'gb12-overview',
        role: 'overview',
        labelTh: ROLE_LABEL_TH.overview,
        hintTh: HINT_CONJUGATE,
        segments: [
          ...overviewOpener('gb12'),
          t('Chinese students '),
          typ('gb12-o1', 'make', ['made'], 'verb-tense', 'ใช้ past simple (made) เพราะเล่าข้อมูลปี 2023 ที่เกิดขึ้นแล้ว'),
          t(' up the '),
          sel('gb12-o2', ['largest', 'larger', 'large'], 'largest', 'word-choice', 'largest = ใหญ่ที่สุด (superlative) เพราะเทียบกับทุกสัญชาติ ส่วน larger ใช้เทียบแค่ 2 สิ่ง และ large เป็นรูปธรรมดา'),
          t(' group of learners by '),
          sel('gb12-o2b', ['nationality', 'temperature', 'distance'], 'nationality', 'word-choice', 'จัดกลุ่มตามสัญชาติ ใช้ nationality ส่วน temperature (อุณหภูมิ) และ distance (ระยะทาง) ไม่เกี่ยว'),
          t(', '),
          sel('gb12-o3', ['while', 'because', 'unless'], 'while', 'transition', 'while ใช้เชื่อมสองภาพที่เกิดคู่กัน (สัญชาติ + หลักสูตร) ส่วน because บอกเหตุผล และ unless แปลว่านอกจาก ไม่เข้ากับความหมาย'),
          t(' General English '),
          typ('gb12-o4', 'be', ['was'], 'verb-tense', 'ประธานเอกพจน์ (General English) + เล่าอดีต จึงใช้ was'),
          t(' the '),
          sel('gb12-o5', ['most', 'more', 'much'], 'most', 'word-choice', 'the most popular = ยอดนิยมที่สุด (superlative) เพราะเทียบกับทุกหลักสูตร ส่วน more/much ไม่ใช่รูป superlative'),
          t(' popular '),
          sel('gb12-o5b', ['course', 'building', 'season'], 'course', 'word-choice', 'course = หลักสูตร ตรงกับข้อมูล ส่วน building (อาคาร) และ season (ฤดูกาล) ไม่ตรง'),
          t('. '),
          sel('gb12-o6', ['Meanwhile', 'For example', 'By contrast'], 'Meanwhile', 'transition', 'Meanwhile ใช้เชื่อมประเด็นใหม่ (ยอดนักเรียนรวม) ต่อจากภาพรวมเรื่องสัญชาติและหลักสูตร ส่วน For example ใช้ยกตัวอย่าง และ By contrast ใช้เมื่อขัดแย้ง ซึ่งตรงนี้ไม่ได้ขัดแย้งกัน'),
          t(', the '),
          sel('gb12-o6b', ['total', 'single', 'average'], 'total', 'word-choice', 'total number = ยอดรวม ตรงกับข้อมูล ส่วน single (เดี่ยว) และ average (เฉลี่ย) ไม่ตรง'),
          t(' number of students '),
          sel(
            'gb12-o7',
            ['fluctuated', 'increased steadily', 'decreased steadily', 'remained unchanged'],
            'fluctuated',
            'trend-phrase',
            'ยอดนักเรียนตกลงแล้วฟื้นขึ้นใหม่ตลอดหลายปี = fluctuate (ขึ้นๆ ลงๆ) ไม่ใช่เพิ่ม/ลดต่อเนื่อง หรือคงที่'
          ),
          t(' throughout the years.')
        ]
      },
      {
        id: 'gb12-body1',
        role: 'body1',
        labelTh: ROLE_LABEL_TH.body1,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('Chinese students '),
          typ('gb12-b2', 'account', ['accounted'], 'verb-tense', 'ใช้ past simple (accounted) เพราะเล่าข้อมูลปี 2023 ที่ผ่านไปแล้ว'),
          t(' '),
          sel('gb12-b2b', ['for', 'of', 'to'], 'for', 'word-choice', 'account for = คิดเป็น (สัดส่วน) เป็นวลีตายตัวใช้ for ส่วน of/to ไม่เข้ากับ account'),
          t(' the '),
          sel('gb12-b3', ['largest', 'largment', 'largely'], 'largest', 'word-choice', 'largest share = สัดส่วนใหญ่ที่สุด (superlative) ส่วน largment ไม่มีคำนี้ และ largely เป็น adverb'),
          t(' share at 32%, '),
          typ('gb12-b4', 'follow', ['followed'], 'v3-clause', 'followed by = ตามมาด้วย ใช้ V3 (past participle) ในโครงสร้าง passive'),
          t(' by Japanese '),
          sel('gb12-b5', ['at', 'in', 'on'], 'at', 'word-choice', 'ระบุค่าตัวเลขเจาะจง (21%) ใช้ at ส่วน in/on ไม่ใช้กับเปอร์เซ็นต์แบบนี้'),
          t(' 21% '),
          sel('gb12-b6', ['and', 'or', 'nor'], 'and', 'word-choice', 'เชื่อมสองรายการที่ตามมา (Japanese กับ Brazilian) ใช้ and ส่วน or/nor สื่อทางเลือกหรือปฏิเสธ'),
          t(' Brazilian at 15%, '),
          sel('gb12-b7', ['respectively', 'especially', 'namely'], 'respectively', 'word-choice', 'respectively = ตามลำดับ (จับคู่กลุ่มกับตัวเลข) และต้องมีคอมมาข้างหน้าเสมอ ส่วน especially/namely คนละหน้าที่'),
          t('. The Japanese share was noticeably '),
          sel('gb12-b7b', ['larger', 'largest', 'large'], 'larger', 'word-choice', 'larger than = ใหญ่กว่า (comparative) เพราะเทียบสองสัญชาติ ส่วน largest ใช้กับหลายสิ่ง และ large เป็นรูปธรรมดา'),
          t(' than '),
          sel('gb12-b7c', ['that of', 'those of', 'this of'], 'that of', 'referencing', 'that of = ของ… ใช้แทนคำนามเอกพจน์ (share) ที่พูดไปแล้ว ส่วน those of ใช้กับพหูพจน์ และ this of ไม่ถูกไวยากรณ์'),
          t(' Brazilian learners. '),
          sel('gb12-b8', ['Interestingly', 'Instead of', 'Rather than'], 'Interestingly', 'transition', 'Interestingly ใช้เปิดประเด็นใหม่ (หลักสูตร) อย่างน่าสนใจ ส่วน Instead of/Rather than สื่อการแทนที่ ไม่ใช่การเปิดประเด็นใหม่'),
          t(', General English '),
          typ('gb12-b9', 'attract', ['attracted'], 'verb-tense', 'ใช้ past simple (attracted) เพราะเล่าข้อมูลที่เกิดขึ้นแล้ว'),
          t(' the '),
          sel('gb12-b9b', ['most', 'more', 'many'], 'most', 'word-choice', 'the most students = นักเรียนมากที่สุด (superlative) เพราะเทียบทุกหลักสูตร ส่วน more เทียบแค่ 2 สิ่ง และ many เป็นรูปธรรมดา'),
          t(' students, '),
          sel('gb12-b10', ['at', 'by', 'for'], 'at', 'word-choice', 'ระบุจำนวนเจาะจง (420) ใช้ at ส่วน by (โดย) และ for (สำหรับ) ไม่เข้ากับบริบทนี้'),
          t(' 420, '),
          sel('gb12-b11', ['whereas', 'therefore', 'moreover'], 'whereas', 'transition', 'whereas = ในขณะที่ ใช้เปรียบเทียบสองสิ่งที่ต่างกัน (จำนวนนักเรียน vs อัตราสอบผ่าน) ส่วน therefore (ดังนั้น) และ moreover (ยิ่งกว่านั้น) ไม่ใช่คำเปรียบเทียบ'),
          t(' the summer intensive '),
          typ('gb12-b12', 'record', ['recorded'], 'verb-tense', 'ใช้ past simple (recorded) เพราะเล่าข้อมูลที่ผ่านไปแล้ว'),
          t(' the '),
          sel('gb12-b13', ['highest', 'higher', 'high'], 'highest', 'word-choice', 'highest pass rate = อัตราสอบผ่านสูงสุด (superlative) เพราะเทียบกับทุกหลักสูตร ส่วน higher เทียบแค่ 2 สิ่ง และ high เป็นรูปธรรมดา'),
          t(' pass '),
          sel('gb12-b14', ['rate', 'road', 'rain'], 'rate', 'word-choice', 'pass rate = อัตราสอบผ่าน ตรงกับข้อมูล ส่วน road (ถนน) และ rain (ฝน) ไม่เกี่ยว'),
          t(', '),
          sel('gb12-b15', ['at', 'in', 'of'], 'at', 'word-choice', 'ระบุค่าตัวเลขเจาะจง (90%) ใช้ at ส่วน in/of ไม่เข้ากับเปอร์เซ็นต์แบบนี้'),
          t(' 90%.')
        ]
      },
      {
        id: 'gb12-body2',
        role: 'body2',
        labelTh: ROLE_LABEL_TH.body2,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('The total number of enrolments '),
          typ('gb12-c3', 'rise', ['rose'], 'verb-tense', 'ใช้ past simple (rose) เพราะเล่าเทรนด์ในอดีต'),
          t(' '),
          sel('gb12-c4', ['steadily', 'steady', 'steadier'], 'steadily', 'word-choice', 'ต้องใช้ adverb (steadily) มาขยายกริยา rose ส่วน steady เป็น adjective และ steadier เป็นรูปเปรียบเทียบ'),
          t(' '),
          sel('gb12-c5', ['from', 'since', 'during'], 'from', 'word-choice', 'from 640 … to 950 คู่กัน บอกจุดเริ่ม ใช้ from ส่วน since (ตั้งแต่) และ during (ระหว่าง) ไม่เข้ากับคู่ from…to'),
          t(' 640 in 2014 '),
          sel('gb12-c6', ['to', 'at', 'by'], 'to', 'word-choice', 'from … to … เป็นคู่กัน บอกปลายทาง ใช้ to ส่วน at/by ไม่ใช้คู่นี้'),
          t(' 950 in 2019, '),
          typ('gb12-c6b', 'add', ['adding'], 'ving-clause', 'ใช้ V-ing clause (adding) บอกผลของการเพิ่มขึ้น'),
          t(' more than 300 learners over five years. '),
          sel('gb12-c7', ['However', 'For example', 'Likewise'], 'However', 'transition', 'However ใช้เชื่อมความขัดแย้ง (จากที่เพิ่มขึ้นต่อเนื่อง กลับตกลงอย่างรวดเร็ว) ส่วน For example (ยกตัวอย่าง) และ Likewise (เช่นเดียวกัน) ไม่ใช่การเชื่อมแบบขัดแย้ง'),
          t(', the '),
          sel('gb12-c7b', ['number', 'weather', 'colour'], 'number', 'referencing', 'the number = ตัวเลข ใช้อ้างถึงยอดนักเรียนที่พูดไปแล้ว ส่วน weather (อากาศ) และ colour (สี) ไม่เกี่ยว'),
          t(' '),
          typ('gb12-c8', 'drop', ['dropped'], 'verb-tense', 'ใช้ past simple (dropped) เพราะเล่าเหตุการณ์ในอดีต'),
          t(' '),
          sel('gb12-c9', ['dramatically', 'dramatic', 'drama'], 'dramatically', 'word-choice', 'ต้องใช้ adverb (dramatically) มาขยายกริยา dropped ส่วน dramatic เป็น adjective และ drama เป็นคำนาม'),
          t(' to 310 in 2020, '),
          sel('gb12-c10', ['while', 'so', 'or'], 'while', 'transition', 'while ใช้บรรยายสองภาพคู่กัน (ยอดตกลง กับ ปีที่ต่ำสุด) ส่วน so (ดังนั้น) และ or (หรือ) คนละหน้าที่'),
          t(' the school '),
          typ('gb12-c11', 'reach', ['reached'], 'verb-tense', 'ใช้ past simple (reached) เพราะเล่าเหตุการณ์ในอดีต'),
          t(' '),
          sel('gb12-c11b', ['its', 'their', 'it'], 'its', 'referencing', 'the school (เอกพจน์) ใช้ possessive its ส่วน their ใช้กับพหูพจน์ และ it เป็นประธานไม่ใช่คำแสดงความเป็นเจ้าของ'),
          t(' '),
          sel('gb12-c12', ['lowest', 'lower', 'low'], 'lowest', 'word-choice', 'lowest point = จุดต่ำสุด (superlative) เพราะเทียบทั้งช่วงเวลา ส่วน lower เทียบแค่ 2 จุด และ low เป็นรูปธรรมดา'),
          t(' point that year. '),
          sel('gb12-c12b', ['Although', 'Because', 'Whether'], 'Although', 'transition', 'Although = แม้ว่า ใช้ขึ้นต้นประโยคที่ขัดแย้ง (ตกแรง แต่ก็ฟื้นได้) ส่วน Because (เพราะ) และ Whether (ไม่ว่า) คนละหน้าที่'),
          t(' the fall was steep, the figure then '),
          typ('gb12-c13', 'recover', ['recovered'], 'verb-tense', 'ใช้ past simple (recovered) เพราะเล่าอดีตต่อเนื่อง'),
          t(' '),
          sel('gb12-c14', ['strongly', 'strong', 'strength'], 'strongly', 'word-choice', 'ต้องใช้ adverb (strongly) มาขยายกริยา recovered ส่วน strong เป็น adjective และ strength เป็นคำนาม'),
          t(', '),
          typ('gb12-c15', 'peak', ['peaking'], 'ving-clause', 'ใช้ V-ing clause (peaking) บอกผลลัพธ์ของการฟื้นตัว'),
          t(' at 1,100 in 2023, the '),
          sel('gb12-c16', ['highest', 'higher', 'highly'], 'highest', 'word-choice', 'highest figure = ตัวเลขสูงสุด (superlative) เพราะเทียบทั้งช่วง ส่วน higher เทียบแค่ 2 จุด และ highly เป็น adverb'),
          t(' figure '),
          typ('gb12-c17', 'record', ['recorded'], 'v3-clause', 'the highest figure recorded = ตัวเลขสูงสุดที่ถูกบันทึก ใช้ V3 ในวลี passive ขยายคำนาม'),
          t(' '),
          sel('gb12-c18', ['over', 'under', 'against'], 'over', 'word-choice', 'over the whole period = ตลอดทั้งช่วง ใช้ over ส่วน under (ใต้) และ against (ต้าน) ไม่เข้ากับช่วงเวลา'),
          t(' the whole '),
          sel('gb12-c19', ['period', 'reason', 'course'], 'period', 'referencing', 'the whole period = ตลอดช่วงเวลา ใช้อ้างถึงกรอบปี 2014–2023 ส่วน reason (เหตุผล) และ course (หลักสูตร) ไม่ใช่ช่วงเวลา'),
          t('.')
        ]
      }
    ]
  },

{
    id: 'gb-town-centre',
    promptId: 'map-town-centre',
    steps: [
      {
        id: 'gb13-intro',
        role: 'intro',
        labelTh: ROLE_LABEL_TH.intro,
        hintTh: HINT_PARAPHRASE,
        // 1 sentence · 1 complex (comma + V-ing)
        segments: [
          t('The '),
          sel(
            'gb13-i0',
            ['maps', 'charts', 'tables'],
            'maps',
            'paraphrase',
            'แผนที่เปรียบเทียบใช้ maps'
          ),
          t(' '),
          sel(
            'gb13-i1',
            ['compare', 'argue', 'promise'],
            'compare',
            'paraphrase',
            'compare the transformation = เปรียบเทียบการเปลี่ยนแปลงตามแบบแผนแผนที่ ส่วน argue/promise ใช้บรรยายแผนที่ไม่ได้'
          ),
          t(' the '),
          sel(
            'gb13-i2',
            ['transformation', 'celebration', 'temperature'],
            'transformation',
            'paraphrase',
            'transformation = การเปลี่ยนแปลงของผังเมือง ตรงแบบแผนแผนที่ ส่วน celebration/temperature คนละความหมาย'
          ),
          t(' of a town '),
          sel(
            'gb13-i3',
            ['centre', 'century', 'ceremony'],
            'centre',
            'word-choice',
            'town centre = ใจกลางเมือง ตรงกับโจทย์ ส่วน century/ceremony คนละความหมาย'
          ),
          t(' from '),
          sel('gb13-i3a', ['2005', '1995', '2015'], '2005', 'word-choice', 'ปีเริ่มต้นคือ 2005'),
          t(' to '),
          sel('gb13-i3b', ['2025', '2010', '2035'], '2025', 'word-choice', 'ปีสิ้นสุดคือ 2025'),
          t(', '),
          typ(
            'gb13-i4',
            'focus',
            ['focusing'],
            'ving-clause',
            'หลังคอมมาใช้ V-ing (focusing) เป็น complex structure เดียวของบทนำ'
          ),
          t(' on key changes to the built environment.')
        ]
      },
      {
        id: 'gb13-overview',
        role: 'overview',
        labelTh: ROLE_LABEL_TH.overview,
        hintTh: HINT_CONJUGATE,
        // 1 sentence · 1 complex (passive: can be observed)
        segments: [
          ...overviewOpener('gb13'),
          t('a number of '),
          sel(
            'gb13-o1',
            ['transformations', 'temperatures', 'celebrations'],
            'transformations',
            'word-choice',
            'transformations = การเปลี่ยนแปลงหลายจุด ตรงแบบแผน overview ของแผนที่'
          ),
          t(' '),
          typ(
            'gb13-o2',
            'take',
            ['took place'],
            'verb-tense',
            'ประโยคเปิดใช้ can be observed ไปแล้ว ท่อนนี้จึงเล่าเป็น past simple: took place (= เกิดขึ้น)'
          ),
          t(', including the '),
          sel(
            'gb13-o3',
            ['addition', 'additioning', 'add'],
            'addition',
            'word-choice',
            'the addition of = การเพิ่มสิ่งก่อสร้างใหม่ ใช้คำนามจากกลุ่ม construction'
          ),
          t(' of residential housing and a civic centre, the '),
          sel(
            'gb13-o4',
            ['demolition', 'decoration', 'declaration'],
            'demolition',
            'word-choice',
            'demolition = การรื้อถอน ตรงกลุ่ม destroy/demolish'
          ),
          t(' of the shopping mall and car park, and the '),
          sel(
            'gb13-o5',
            ['transformation', 'transportation', 'translation'],
            'transformation',
            'word-choice',
            'transformation of X into Y = การเปลี่ยนรูปพื้นที่'
          ),
          t(' of the industrial zone into a tech park.')
        ]
      },
      {
        id: 'gb13-body1',
        role: 'body1',
        labelTh: ROLE_LABEL_TH.body1,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel(
            'gb13-b1',
            ['Starting with', 'In terms of', 'Despite'],
            'Starting with',
            'transition',
            'Map Body 1 ต้องเปิดด้วย Starting with + ทิศทางเท่านั้น'
          ),
          t(' '),
          sel(
            'gb13-b1a',
            [
              'the northern part of the map',
              'the western part of the map',
              'the eastern side of the map',
              'the southern section of the map'
            ],
            'the northern part of the map',
            'word-choice',
            'Body 1 ใช้ northern หรือ western part of the map'
          ),
          t(', '),
          sel(
            'gb13-b2',
            ['while', 'whereas', 'although'],
            'while',
            'transition',
            'ใช้ while / whereas / although เท่านั้น ตามโครงสร้าง S+V, S+V'
          ),
          t(' the shopping mall and the car park '),
          typ(
            'gb13-b3',
            'change',
            ['have been replaced'],
            'v3-clause',
            'present perfect passive: have been replaced'
          ),
          t(' into '),
          typ('gb13-b4', 'feature', ['residential housing and a civic centre'], 'word-choice', 'เติม residential housing and a civic centre'),
          t(', '),
          typ('gb13-b5', 'feature', ['the main road'], 'word-choice', 'เติม the main road'),
          t(' '),
          sel(
            'gb13-b6',
            ['located in', 'situated in', 'placed on'],
            'located in',
            'word-choice',
            'ใช้ located in หรือ situated in เท่านั้น'
          ),
          t(' the centre '),
          typ('gb13-b6a', 'remain', ['has remained'], 'verb-tense', 'present perfect: has remained'),
          t(' '),
          sel(
            'gb13-b6b',
            ['unchanged', 'unchange', 'changing'],
            'unchanged',
            'word-choice',
            'remained unchanged = ไม่เปลี่ยนแปลง'
          ),
          t('. '),
          sel(
            'gb13-b7',
            [
              'Interestingly',
              'However',
              'Surprisingly',
              'It is interesting to note that',
              'On the other hand'
            ],
            'Interestingly',
            'transition',
            'เปิดประโยคถัดไปด้วย Interestingly / However / Surprisingly / It is interesting to note that / On the other hand เท่านั้น'
          ),
          t(', '),
          typ(
            'gb13-b8',
            'detail',
            ['new houses have been constructed on the former mall site'],
            'word-choice',
            'เติม new houses have been constructed on the former mall site'
          ),
          t('.')
        ]
      },
      {
        id: 'gb13-body2',
        role: 'body2',
        labelTh: ROLE_LABEL_TH.body2,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel(
            'gb13-c1',
            ['In terms of', 'Starting with', 'Despite'],
            'In terms of',
            'transition',
            'Map Body 2 ต้องเปิดด้วย In terms of + ทิศทางเท่านั้น'
          ),
          t(' '),
          sel(
            'gb13-c1a',
            [
              'the eastern side of the map',
              'the eastern section of the map',
              'the southern section of the map',
              'the northern part of the map',
              'the western part of the map'
            ],
            'the southern section of the map',
            'word-choice',
            'Body 2 ใช้ eastern side/section หรือ southern section of the map'
          ),
          t(', '),
          sel(
            'gb13-c2',
            ['while', 'whereas', 'although'],
            'although',
            'transition',
            'ใช้ while / whereas / although เท่านั้น'
          ),
          t(' the industrial zone '),
          sel(
            'gb13-c3',
            ['located in', 'situated in', 'placed on'],
            'located in',
            'word-choice',
            'ใช้ located in หรือ situated in เท่านั้น'
          ),
          t(' the southwest '),
          typ(
            'gb13-c4',
            'change',
            ['has been transformed'],
            'v3-clause',
            'present perfect passive: has been transformed'
          ),
          t(' into '),
          typ('gb13-c5', 'feature', ['a tech park'], 'word-choice', 'เติม a tech park'),
          t(', '),
          typ('gb13-c6', 'feature', ['the market and the open space'], 'word-choice', 'เติม the market and the open space'),
          t(' '),
          sel(
            'gb13-c7',
            ['located in', 'situated in', 'placed on'],
            'situated in',
            'word-choice',
            'ใช้ located in หรือ situated in เท่านั้น'
          ),
          t(' the south '),
          typ(
            'gb13-c8',
            'change',
            ['have been transformed'],
            'v3-clause',
            'present perfect passive: have been transformed'
          ),
          t(' into '),
          typ('gb13-c9', 'feature', ['a library and a park'], 'word-choice', 'เติม a library and a park'),
          t('. '),
          sel(
            'gb13-c10',
            [
              'Interestingly',
              'However',
              'Surprisingly',
              'It is interesting to note that',
              'On the other hand'
            ],
            'Surprisingly',
            'transition',
            'เปิดประโยคถัดไปด้วย Interestingly / However / Surprisingly / It is interesting to note that / On the other hand เท่านั้น'
          ),
          t(', '),
          typ(
            'gb13-c11',
            'detail',
            ['the former commercial area has also been demolished and replaced by housing'],
            'word-choice',
            'เติม the former commercial area has also been demolished and replaced by housing'
          ),
          t('.')
        ]
      }
    ]
  },

{
    id: 'gb-instant-coffee',
    promptId: 'process-instant-coffee',
    steps: [
      {
        id: 'gb14-intro',
        role: 'intro',
        labelTh: ROLE_LABEL_TH.intro,
        hintTh: HINT_PARAPHRASE,
        segments: [
          t('This '),
          sel('gb14-i1', ['chart', 'table', 'map'], 'chart', 'paraphrase', 'แผนภาพกระบวนการใช้ chart ตามแบบเรียน process'),
          t(' '),
          sel('gb14-i2', ['shows', 'compares', 'illustrates'], 'shows', 'paraphrase', 'Process ใช้ shows เท่านั้น ตามแบบเรียน This chart shows the process of …'),
          t(' the process of '),
          sel('gb14-i3', ['producing instant coffee', 'comparing coffee prices', 'recycling plastic bottles'], 'producing instant coffee', 'paraphrase', 'ใส่ชื่อกระบวนการตามโจทย์: producing instant coffee'),
          t(' from start to '),
          sel('gb14-i4', ['completion', 'comparison', 'conclusion'], 'completion', 'word-choice', 'from start to completion = จากต้นจนจบ ตามแบบเรียน process'),
          t('.')
        ]
      },
      {
        id: 'gb14-overview',
        role: 'overview',
        labelTh: ROLE_LABEL_TH.overview,
        hintTh: HINT_CONJUGATE,
        segments: [
          ...overviewOpener('gb14'),
          t('the process '),
          sel('gb14-o2', ['entails', 'compares', 'fluctuates'], 'entails', 'word-choice', 'entails = มี/ประกอบด้วยขั้นตอน ตามแบบเรียน process overview'),
          t(' '),
          sel('gb14-o3', ['eight', 'three', 'twelve'], 'eight', 'word-choice', 'กระบวนการนี้มี 8 ขั้นตอน'),
          t(' '),
          sel('gb14-o4', ['steps', 'reasons', 'opinions'], 'steps', 'word-choice', 'steps = ขั้นตอน ตามแบบเรียน process overview'),
          t(', starting from '),
          sel('gb14-o5', ['harvesting', 'packaging', 'moulding'], 'harvesting', 'word-choice', 'ขั้นแรกคือ harvesting'),
          t(' and culminating in '),
          sel('gb14-o6', ['packaging', 'harvesting', 'sorting'], 'packaging', 'word-choice', 'ขั้นสุดท้ายคือ packaging'),
          t('.')
        ]
      },
      {
        id: 'gb14-body1',
        role: 'body1',
        labelTh: ROLE_LABEL_TH.body1,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel('gb14-b1', ['First', 'Finally', 'Instead'], 'First', 'transition', 'ขั้นแรกของกระบวนการต้องเปิดด้วย First ส่วน Finally (สุดท้าย) และ Instead (แทนที่) ผิดลำดับ'),
          t(', ripe coffee cherries '),
          typ('gb14-b2', 'pick', ['are picked'], 'v3-clause', 'cherries ถูกเก็บ (ถูกกระทำ) พหูพจน์ + present จึงใช้ passive present: are + picked'),
          t(' by hand or '),
          sel('gb14-b3', ['machine', 'machines', 'mission'], 'machine', 'word-choice', 'by hand or machine เป็นวลีคู่ขนาน ใช้เอกพจน์ machine ส่วน mission (ภารกิจ) คนละความหมาย'),
          t('. '),
          sel('gb14-b4', ['Once', 'Unless', 'Whether'], 'Once', 'transition', 'Once = เมื่อ...แล้ว บอกลำดับเวลาในกระบวนการ ส่วน Unless (เว้นแต่) และ Whether (ไม่ว่า) ไม่เข้ากับความหมาย'),
          t(' they '),
          typ('gb14-b5', 'collect', ['are collected'], 'v3-clause', 'they (cherries) ถูกรวบรวม (ถูกกระทำ) จึงใช้ passive present: are + collected'),
          t(', they '),
          typ('gb14-b6', 'transport', ['are transported'], 'v3-clause', 'cherries ถูกขนส่ง (ถูกกระทำ) พหูพจน์ + present จึงใช้ passive present: are + transported'),
          t(' to a factory, where they '),
          typ('gb14-b7', 'sort', ['are sorted'], 'v3-clause', 'cherries ถูกคัดแยก (ถูกกระทำ) พหูพจน์ + present จึงใช้ passive present: are + sorted'),
          t(' by quality. '),
          sel('gb14-b8', ['Next', 'Lastly', 'Otherwise'], 'Next', 'transition', 'Next = ต่อไป บอกขั้นถัดมา ส่วน Lastly (สุดท้าย) ผิดลำดับ และ Otherwise (มิฉะนั้น) คนละความหมาย'),
          t(', the cherries '),
          typ('gb14-b9', 'pulp', ['are pulped'], 'v3-clause', 'cherries ถูกบีบเอาเนื้อออก (ถูกกระทำ) จึงใช้ passive present: are + pulped'),
          t(' '),
          sel('gb14-b10', ['in order to', 'in spite of', 'instead of'], 'in order to', 'word-choice', 'in order to + V = เพื่อ...บอกจุดประสงค์ ส่วน in spite of/instead of ตามด้วยคำนามและความหมายต่างกัน'),
          t(' remove the outer '),
          sel('gb14-b11', ['skin', 'stage', 'shape'], 'skin', 'word-choice', 'ขั้นนี้เอา "เปลือกนอก" (skin) ออก ไม่ใช่ stage หรือ shape'),
          t('. '),
          sel('gb14-b12', ['After that', 'By the way', 'For instance'], 'After that', 'transition', 'After that = หลังจากนั้น บอกลำดับต่อไป ส่วน By the way (อีกอย่าง) และ For instance (ตัวอย่างเช่น) ไม่เข้ากับลำดับ'),
          t(', the beans '),
          typ('gb14-b13', 'wash', ['are washed'], 'v3-clause', 'beans ถูกล้าง (ถูกกระทำ) พหูพจน์ + present จึงใช้ passive present: are + washed'),
          t(' and then '),
          typ('gb14-b14', 'dry', ['are dried'], 'v3-clause', 'beans ถูกตากให้แห้ง (ถูกกระทำ) จึงใช้ passive present: are + dried'),
          t(' in the sun '),
          sel('gb14-b15', ['for', 'since', 'until'], 'for', 'word-choice', 'บอกระยะเวลา (several days) ใช้ for ส่วน since ใช้กับจุดเริ่มต้น และ until ใช้กับจุดสิ้นสุด'),
          t(' several days, '),
          typ('gb14-b16', 'reduce', ['reducing'], 'ving-clause', 'ใช้ V-ing clause บอกผลที่ตามมา จึงใช้ reducing'),
          t(' their moisture '),
          sel('gb14-b17', ['significantly', 'rarely', 'barely'], 'significantly', 'degree-adverb', 'significantly = อย่างมาก เข้ากับการลดความชื้น ส่วน rarely (แทบไม่) และ barely (แทบไม่) ให้ความหมายตรงข้าม'),
          t(' before the later roasting stage.')
        ]
      },
      {
        id: 'gb14-body2',
        role: 'body2',
        labelTh: ROLE_LABEL_TH.body2,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel('gb14-c1', ['Subsequently', 'At first', 'In contrast'], 'Subsequently', 'transition', 'Subsequently = ต่อจากนั้น บอกลำดับถัดไป ส่วน At first (ตอนแรก) และ In contrast (ในทางตรงข้าม) ผิดความหมาย'),
          t(', the dried beans '),
          typ('gb14-c2', 'roast', ['are roasted'], 'v3-clause', 'beans ถูกคั่ว (ถูกกระทำ) พหูพจน์ + present จึงใช้ passive present: are + roasted'),
          t(' at a high '),
          sel('gb14-c3', ['temperature', 'temper', 'tempo'], 'temperature', 'word-choice', 'high temperature = อุณหภูมิสูง ตรงกับการคั่ว ส่วน temper (อารมณ์) และ tempo (จังหวะ) คนละความหมาย'),
          t(' until they '),
          typ('gb14-c3b', 'brown', ['are browned'], 'v3-clause', 'beans ถูกทำให้เป็นสีน้ำตาล (ถูกกระทำ) จึงใช้ passive present: are + browned'),
          t(', and '),
          typ('gb14-c4', 'grind', ['are then ground', 'are ground'], 'v3-clause', 'beans ถูกบด (ถูกกระทำ) จึงใช้ passive present: are + ground (V3 ของ grind)'),
          t(' into a fine '),
          sel('gb14-c5', ['powder', 'powers', 'flower'], 'powder', 'word-choice', 'บดเป็น "ผง" (powder) ส่วน powers (พลัง) และ flower (ดอกไม้) สะกด/ความหมายผิด'),
          t('. '),
          sel('gb14-c6', ['Then', 'Rarely', 'Nearly'], 'Then', 'transition', 'Then = จากนั้น บอกลำดับ ส่วน Rarely (แทบไม่) และ Nearly (เกือบ) ไม่ใช่คำบอกลำดับ'),
          t(', this powder '),
          typ('gb14-c7', 'dissolve', ['is dissolved'], 'v3-clause', 'powder ถูกทำให้ละลาย (ถูกกระทำ) เอกพจน์ + present จึงใช้ passive present: is + dissolved'),
          t(' in hot water, '),
          typ('gb14-c8', 'form', ['forming'], 'ving-clause', 'ใช้ V-ing clause บอกผลที่ตามมา จึงใช้ forming'),
          t(' a concentrated '),
          sel('gb14-c9', ['liquid', 'liquor', 'litre'], 'liquid', 'word-choice', 'liquid = ของเหลว เข้ากับบริบท ส่วน liquor (เหล้า) และ litre (ลิตร) คนละความหมาย'),
          t('. This liquid '),
          typ('gb14-c10', 'spray-dry', ['is spray-dried'], 'v3-clause', 'liquid ถูกพ่นให้แห้ง (ถูกกระทำ) เอกพจน์ + present จึงใช้ passive present: is + spray-dried'),
          t(' and '),
          typ('gb14-c11', 'freeze-dry', ['is freeze-dried'], 'v3-clause', 'liquid ถูกทำให้แห้งด้วยการแช่แข็ง (ถูกกระทำ) จึงใช้ passive present: is + freeze-dried'),
          t(' '),
          sel('gb14-c12', ['so that', 'so as', 'such as'], 'so that', 'word-choice', 'so that + ประโยค = เพื่อให้...ส่วน so as ต้องตามด้วย to + V และ such as ใช้ยกตัวอย่าง'),
          t(' it '),
          typ('gb14-c13', 'turn', ['turns'], 'verb-tense', 'ประธานเอกพจน์ (it) ใน present simple จึงเติม -s เป็น turns'),
          t(' into solid '),
          sel('gb14-c14', ['granules', 'gardens', 'guardians'], 'granules', 'word-choice', 'granules = เม็ด/เกล็ดกาแฟ ตรงกับผลผลิต ส่วน gardens/guardians สะกดใกล้แต่คนละความหมาย'),
          t('. '),
          sel('gb14-c15', ['Finally', 'First', 'Meanwhile'], 'Finally', 'transition', 'Finally = สุดท้าย บอกขั้นตอนปิดท้าย ส่วน First (แรกสุด) และ Meanwhile (ในเวลาเดียวกัน) ผิดลำดับ'),
          t(', the granules '),
          typ('gb14-c16', 'package', ['are packaged'], 'v3-clause', 'granules ถูกบรรจุ (ถูกกระทำ) พหูพจน์ + present จึงใช้ passive present: are + packaged'),
          t(' into jars, '),
          typ('gb14-c17', 'seal', ['sealed', 'are sealed'], 'v3-clause', 'ใช้ V3 (sealed) ในรูปถูกกระทำ = ถูกปิดผนึกก่อนส่งขาย'),
          t(' and '),
          typ('gb14-c18', 'label', ['labelled', 'labeled', 'are labelled', 'are labeled'], 'v3-clause', 'ใช้ V3 (labelled) ในรูปถูกกระทำ = ถูกติดฉลาก'),
          t(' before they '),
          typ('gb14-c19', 'distribute', ['are distributed'], 'v3-clause', 'granules ถูกจัดส่ง (ถูกกระทำ) จึงใช้ passive present: are + distributed'),
          t(' to shops, ready for '),
          sel('gb14-c20', ['sale', 'sail', 'sell'], 'sale', 'word-choice', 'ready for + คำนาม จึงใช้ sale (การขาย) ส่วน sail (แล่นเรือ) และ sell (V) ผิดรูป/ความหมาย'),
          t('.')
        ]
      }
    ]
  },

{
    id: 'gb-city-farmers-market',
    promptId: 'mixed-city-farmers-market',
    steps: [
      {
        id: 'gb17-intro',
        role: 'intro',
        labelTh: ROLE_LABEL_TH.intro,
        hintTh: HINT_PARAPHRASE,
        segments: [
          t('The pie chart and line graph '),
          sel('gb17-i1', ['compare', 'claim', 'wonder'], 'compare', 'paraphrase', 'The pie chart and line graph เป็นประธานรวมแบบพหูพจน์ จึงใช้ compare เท่านั้น'),
          t(' the '),
          sel('gb17-i2', ['method', 'meaning', 'measure'], 'method', 'paraphrase', 'method of transport = วิธีการเดินทาง ตรงกับโจทย์ ส่วน meaning (ความหมาย) และ measure (มาตรการ) คนละความหมาย'),
          t(' of transport '),
          typ('gb17-i3', 'use', ['used'], 'v3-clause', 'transport ที่ "ถูกใช้" โดยผู้มาเยือน จึงใช้ V3 (used) แบบ passive ลดรูปขยาย transport'),
          t(' by visitors to a city farmers market and the '),
          sel('gb17-i4', ['number', 'percentage', 'rate'], 'number', 'paraphrase', 'จำนวนผู้มาเยือนนับเป็นคน จึงใช้ number ส่วน percentage/rate ต้องเป็น % ซึ่งไม่ตรงกับกราฟเส้น'),
          t(' of visitors '),
          sel('gb17-i5', ['to', 'for', 'of'], 'to', 'word-choice', 'visitors to a place = ผู้มาเยือนสถานที่นั้น ใช้ to เสมอ ส่วน for/of ไม่เข้ากับ visitors ในบริบทนี้'),
          t(' the market '),
          sel('gb17-i6', ['between', 'along', 'toward'], 'between', 'word-choice', 'between 2015 and 2023 = ระหว่างสองปีนี้ ส่วน along/toward ใช้กับสถานที่หรือทิศทาง ไม่ใช่ช่วงเวลา'),
          t(' 2015 '),
          sel('gb17-i7', ['and', 'but', 'nor'], 'and', 'word-choice', 'โครงสร้าง between X and Y ต้องใช้ and เสมอ ส่วน but/nor ใช้กับ between ไม่ได้'),
          t(' 2023.')
        ]
      },
      {
        id: 'gb17-overview',
        role: 'overview',
        labelTh: ROLE_LABEL_TH.overview,
        hintTh: HINT_CONJUGATE,
        segments: [
          ...overviewOpener('gb17'),
          t('the private car '),
          typ('gb17-o1', 'be', ['was'], 'verb-tense', 'ประธานเอกพจน์ (the private car) + เล่าอดีต จึงใช้ was'),
          t(' the '),
          sel('gb17-o2', ['most', 'more', 'much'], 'most', 'word-choice', 'เทียบวิธีเดินทางห้าแบบ ใช้ขั้นสุด most ไม่ใช่ more (ขั้นกว่า)'),
          t(' popular way for visitors to reach the market, '),
          sel('gb17-o3', ['while', 'because', 'so that'], 'while', 'transition', 'while ใช้เชื่อมสองประเด็นคู่กัน (วิธีเดินทาง / จำนวนผู้มาเยือน) ส่วน because/so that บอกเหตุผล/จุดประสงค์'),
          t(' the number of visitors '),
          sel(
            'gb17-o4',
            ['fluctuated over the given period', 'showed a steady upward trend', 'showed a steady downward trend', 'remained unchanged over the given period'],
            'fluctuated over the given period',
            'trend-phrase',
            'จำนวนผู้มาเยือนขึ้นๆลงๆตลอดช่วง (ขึ้น แล้วตกลงแรง แล้วฟื้นตัว) = fluctuate ไม่ใช่ขาขึ้น/ขาลงล้วน หรือคงที่'
          ),
          t(', '),
          typ('gb17-o5', 'dip', ['dipping'], 'ving-clause', 'ใช้ V-ing clause (dipping) ขยายผลของประโยคหลัก บอกว่าตัวเลขมีจุดตกลง'),
          t(' to its lowest point in 2021 '),
          sel('gb17-o6', ['before', 'because', 'while'], 'before', 'word-choice', 'ลำดับเหตุการณ์คือตกลงก่อนแล้วค่อยฟื้นตัว ใช้ before บอกลำดับเวลา'),
          t(' '),
          typ('gb17-o7', 'recover', ['recovering'], 'ving-clause', 'หลัง before ที่ทำหน้าที่ขยายความ ใช้รูป V-ing คือ recovering'),
          t(' to a new high in 2023.')
        ]
      },
      {
        id: 'gb17-body1',
        role: 'body1',
        labelTh: ROLE_LABEL_TH.body1,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('Almost half of all visitors '),
          typ('gb17-b1', 'travel', ['travelled'], 'verb-tense', 'past simple เล่าอดีต + ประธานพหูพจน์ (visitors) ใช้ travelled'),
          t(' to the market by car, '),
          typ('gb17-b2', 'account', ['accounting'], 'ving-clause', 'ใช้ V-ing clause (accounting) ขยายผลของประโยคหลัก'),
          t(' for 42% of the total. '),
          sel('gb17-b3', ['Buses and bicycles', 'A bus and a bicycle', 'Bus and bicycle'], 'Buses and bicycles', 'word-choice', 'พูดถึงสองประเภทการเดินทางแบบทั่วไป (นับไม่เจาะจงคัน) ต้องใช้พหูพจน์ไม่มี article: Buses and bicycles'),
          t(' '),
          typ('gb17-b4', 'be', ['were'], 'verb-tense', 'ประธานพหูพจน์ (Buses and bicycles) + เล่าอดีต จึงใช้ were'),
          t(' the next most common methods, '),
          sel('gb17-b5', ['used', 'using', 'use'], 'used', 'word-choice', 'ใช้ V3 (used) แบบ passive ลดรูป ขยาย methods ที่ "ถูกใช้" โดย 22% และ 18% ของผู้มาเยือน'),
          t(' by 22% and 18% of visitors, '),
          sel('gb17-b6', ['respectively', 'obviously', 'clearly'], 'respectively', 'word-choice', 'respectively = ตามลำดับที่กล่าว (ต้องมีคอมมาก่อนเสมอ) ส่วน obviously/clearly แปลว่าชัดเจน ไม่ตรง'),
          t('. '),
          sel('gb17-b7', ['However', 'For example', 'In addition'], 'However', 'transition', 'However = เมื่อเทียบกัน ใช้เปรียบเทียบกับสองวิธีที่ตัวเลขต่ำสุด ส่วน For example (ยกตัวอย่าง) และ In addition (นอกจากนี้) ไม่ตรงความหมาย'),
          t(', walking and other methods '),
          typ('gb17-b8', 'make', ['made'], 'verb-tense', 'past simple เล่าอดีต + ประธานพหูพจน์ ใช้ made (make up = ประกอบเป็น)'),
          t(' up just 12% and 6% '),
          sel('gb17-b9', ['respectively', 'exactly', 'nearly'], 'respectively', 'word-choice', 'respectively = ตามลำดับที่กล่าว (มีคอมมาก่อนเสมอ) ส่วน exactly/nearly ผิดความหมาย'),
          t(', together '),
          typ('gb17-b10', 'account', ['accounting'], 'ving-clause', 'ใช้ V-ing clause (accounting) ขยายผลของประโยคหลัก'),
          t(' for less than a fifth of all visits.')
        ]
      },
      {
        id: 'gb17-body2',
        role: 'body2',
        labelTh: ROLE_LABEL_TH.body2,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('The number of visitors to the market '),
          typ('gb17-c1', 'stand', ['stood'], 'verb-tense', 'stand เป็นกริยาผันไม่ปกติ อดีตคือ stood + ประธานเอกพจน์ เล่าอดีต'),
          t(' at 28,000 in 2015, '),
          typ('gb17-c2', 'rise', ['rising'], 'ving-clause', 'ใช้ V-ing clause (rising) ขยายผลของประโยคหลัก'),
          t(' to 35,000 in 2017 and '),
          typ('gb17-c3', 'peak', ['peaking'], 'ving-clause', 'ใช้ V-ing clause (peaking) ขยายผลของประโยคหลัก บอกจุดสูงสุดที่ไปถึง'),
          t(' at 42,000 in 2019. '),
          sel('gb17-c4', ['Whereas', 'Because', 'So'], 'Whereas', 'transition', 'Whereas เปรียบเทียบสองช่วงที่ต่างกัน (โตต่อเนื่อง / ตกลงแรง) ตามกฎ TIMELINE ส่วน Because/So บอกเหตุ-ผล'),
          t(' attendance '),
          typ('gb17-c5', 'grow', ['had grown'], 'verb-tense', 'เล่าเหตุการณ์ที่เกิดก่อนเหตุการณ์อื่นในอดีต จึงใช้ past perfect (had grown) เพื่อบอกว่าช่วงก่อนหน้านั้นเติบโตมาต่อเนื่อง'),
          t(' steadily up to that point, it then '),
          typ('gb17-c6', 'fall', ['fell'], 'verb-tense', 'fall เป็นกริยาผันไม่ปกติ อดีตคือ fell + ประธานเอกพจน์ (it) เล่าอดีต'),
          t(' sharply to 25,000 in 2021, before '),
          typ('gb17-c7', 'recover', ['recovering'], 'ving-clause', 'ลำดับเหตุการณ์คือตกลงก่อนแล้วค่อยฟื้นตัว จึงใช้ before + V-ing (recovering)'),
          t(' to reach a new high of 48,000 by 2023.')
        ]
      }
    ]
  },

{
    id: 'gb-island-resort',
    promptId: 'map-island-resort',
    steps: [
      {
        id: 'gb18-intro',
        role: 'intro',
        labelTh: ROLE_LABEL_TH.intro,
        hintTh: HINT_PARAPHRASE,
        // 1 sentence · 1 complex (comma + V-ing)
        segments: [
          t('The '),
          sel(
            'gb18-i0',
            ['maps', 'charts', 'tables'],
            'maps',
            'paraphrase',
            'แผนที่เปรียบเทียบใช้ maps'
          ),
          t(' '),
          sel(
            'gb18-i1',
            ['compare', 'argue', 'promise'],
            'compare',
            'paraphrase',
            'compare the transformation = เปรียบเทียบการเปลี่ยนแปลงตามแบบแผนแผนที่ ส่วน argue/promise ใช้บรรยายแผนที่ไม่ได้'
          ),
          t(' the '),
          sel(
            'gb18-i2',
            ['transformation', 'celebration', 'temperature'],
            'transformation',
            'paraphrase',
            'transformation = การเปลี่ยนแปลงของพื้นที่ ตรงแบบแผนแผนที่'
          ),
          t(' of a small island from before to after the '),
          sel(
            'gb18-i3',
            ['construction', 'destruction', 'instruction'],
            'construction',
            'word-choice',
            'construction = การก่อสร้างรีสอร์ท ตรงกับโจทย์ ส่วน destruction/instruction คนละความหมาย'
          ),
          t(' of a '),
          sel(
            'gb18-i3a',
            ['tourist resort', 'train station', 'town centre'],
            'tourist resort',
            'word-choice',
            'tourist resort = รีสอร์ทนักท่องเที่ยวตามโจทย์'
          ),
          t(', '),
          typ(
            'gb18-i4',
            'focus',
            ['focusing'],
            'ving-clause',
            'หลังคอมมาใช้ V-ing (focusing) เป็น complex structure เดียวของบทนำ'
          ),
          t(' on new facilities added across previously open land on the island.')
        ]
      },
      {
        id: 'gb18-overview',
        role: 'overview',
        labelTh: ROLE_LABEL_TH.overview,
        hintTh: HINT_CONJUGATE,
        // 1 sentence · 1 complex (passive: can be observed)
        segments: [
          ...overviewOpener('gb18'),
          t('a number of '),
          sel(
            'gb18-o1',
            ['transformations', 'temperatures', 'celebrations'],
            'transformations',
            'word-choice',
            'transformations = การเปลี่ยนแปลงหลายจุด ตรงแบบแผน overview ของแผนที่'
          ),
          t(' '),
          typ(
            'gb18-o2',
            'take',
            ['took place'],
            'verb-tense',
            'ประโยคเปิดใช้ can be observed ไปแล้ว ท่อนนี้จึงเล่าเป็น past simple: took place (= เกิดขึ้น)'
          ),
          t(', including the '),
          sel(
            'gb18-o3',
            ['addition', 'additioning', 'add'],
            'addition',
            'word-choice',
            'the addition of = การเพิ่มสิ่งก่อสร้างใหม่'
          ),
          t(' of a reception building, a restaurant and guest huts, the '),
          sel(
            'gb18-o4',
            ['construction', 'destruction', 'instruction'],
            'construction',
            'word-choice',
            'construction of a pier = การสร้างท่าเรือ'
          ),
          t(' of a pier, and the '),
          sel(
            'gb18-o5',
            ['transformation', 'transportation', 'translation'],
            'transformation',
            'word-choice',
            'transformation of open land into resort facilities'
          ),
          t(' of open land into resort facilities.')
        ]
      },
      {
        id: 'gb18-body1',
        role: 'body1',
        labelTh: ROLE_LABEL_TH.body1,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel(
            'gb18-b1',
            ['Starting with', 'In terms of', 'Despite'],
            'Starting with',
            'transition',
            'Map Body 1 ต้องเปิดด้วย Starting with + ทิศทางเท่านั้น'
          ),
          t(' '),
          sel(
            'gb18-b1a',
            [
              'the western part of the map',
              'the northern part of the map',
              'the eastern side of the map',
              'the southern section of the map'
            ],
            'the western part of the map',
            'word-choice',
            'Body 1 ใช้ northern หรือ western part of the map'
          ),
          t(', '),
          sel(
            'gb18-b2',
            ['while', 'whereas', 'although'],
            'while',
            'transition',
            'ใช้ while / whereas / although เท่านั้น ตามโครงสร้าง S+V, S+V'
          ),
          t(' the open land '),
          typ(
            'gb18-b3',
            'change',
            ['has been transformed'],
            'v3-clause',
            'present perfect passive: has been transformed'
          ),
          t(' into '),
          typ('gb18-b4', 'feature', ['a reception building and a restaurant'], 'word-choice', 'เติม a reception building and a restaurant'),
          t(', '),
          typ('gb18-b5', 'feature', ['the western coastline'], 'word-choice', 'เติม the western coastline'),
          t(' '),
          sel(
            'gb18-b6',
            ['located in', 'situated in', 'placed on'],
            'located in',
            'word-choice',
            'ใช้ located in หรือ situated in เท่านั้น'
          ),
          t(' the west '),
          typ('gb18-b6a', 'remain', ['has remained'], 'verb-tense', 'present perfect: has remained'),
          t(' '),
          sel(
            'gb18-b6b',
            ['unchanged', 'unchange', 'changing'],
            'unchanged',
            'word-choice',
            'remained unchanged = ไม่เปลี่ยนแปลง'
          ),
          t('. '),
          sel(
            'gb18-b7',
            [
              'Interestingly',
              'However',
              'Surprisingly',
              'It is interesting to note that',
              'On the other hand'
            ],
            'Interestingly',
            'transition',
            'เปิดประโยคถัดไปด้วย Interestingly / However / Surprisingly / It is interesting to note that / On the other hand เท่านั้น'
          ),
          t(', '),
          typ(
            'gb18-b8',
            'detail',
            ['guest huts have been constructed around the centre of the island for tourists'],
            'word-choice',
            'เติม guest huts have been constructed around the centre of the island for tourists'
          ),
          t('.')
        ]
      },
      {
        id: 'gb18-body2',
        role: 'body2',
        labelTh: ROLE_LABEL_TH.body2,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel(
            'gb18-c1',
            ['In terms of', 'Starting with', 'Despite'],
            'In terms of',
            'transition',
            'Map Body 2 ต้องเปิดด้วย In terms of + ทิศทางเท่านั้น'
          ),
          t(' '),
          sel(
            'gb18-c1a',
            [
              'the southern section of the map',
              'the eastern side of the map',
              'the eastern section of the map',
              'the northern part of the map',
              'the western part of the map'
            ],
            'the southern section of the map',
            'word-choice',
            'Body 2 ใช้ eastern side/section หรือ southern section of the map'
          ),
          t(', '),
          sel(
            'gb18-c2',
            ['while', 'whereas', 'although'],
            'although',
            'transition',
            'ใช้ while / whereas / although เท่านั้น'
          ),
          t(' open land '),
          sel(
            'gb18-c3',
            ['located in', 'situated in', 'placed on'],
            'located in',
            'word-choice',
            'ใช้ located in หรือ situated in เท่านั้น'
          ),
          t(' the south '),
          typ(
            'gb18-c4',
            'change',
            ['has been transformed'],
            'v3-clause',
            'present perfect passive: has been transformed'
          ),
          t(' into '),
          typ('gb18-c5', 'feature', ['a pier'], 'word-choice', 'เติม a pier'),
          t(', '),
          typ('gb18-c6', 'feature', ['the central open land'], 'word-choice', 'เติม the central open land'),
          t(' '),
          sel(
            'gb18-c7',
            ['located in', 'situated in', 'placed on'],
            'situated in',
            'word-choice',
            'ใช้ located in หรือ situated in เท่านั้น'
          ),
          t(' the middle '),
          typ(
            'gb18-c8',
            'change',
            ['has been replaced'],
            'v3-clause',
            'present perfect passive: has been replaced'
          ),
          t(' into '),
          typ('gb18-c9', 'feature', ['guest huts'], 'word-choice', 'เติม guest huts'),
          t('. '),
          sel(
            'gb18-c10',
            [
              'Interestingly',
              'However',
              'Surprisingly',
              'It is interesting to note that',
              'On the other hand'
            ],
            'Surprisingly',
            'transition',
            'เปิดประโยคถัดไปด้วย Interestingly / However / Surprisingly / It is interesting to note that / On the other hand เท่านั้น'
          ),
          t(', '),
          typ(
            'gb18-c11',
            'detail',
            ['the beach has remained unchanged along the southern edge of the island'],
            'word-choice',
            'เติม the beach has remained unchanged along the southern edge of the island'
          ),
          t('.')
        ]
      }
    ]
  },

{
    id: 'gb-plastic-recycling',
    promptId: 'process-plastic-recycling',
    steps: [
      {
        id: 'gb19-intro',
        role: 'intro',
        labelTh: ROLE_LABEL_TH.intro,
        hintTh: HINT_PARAPHRASE,
        segments: [
          t('The diagram '),
          sel('gb19-i1', ['compares', 'insists', 'invents'], 'compares', 'paraphrase', 'The diagram เป็นประธานเอกพจน์ จึงใช้ compares เท่านั้น'),
          t(' the '),
          sel('gb19-i2', ['stages', 'promise', 'progress'], 'stages', 'paraphrase', 'stages = ขั้นตอนต่าง ๆ ที่แผนภาพนำมาเปรียบเทียบ'),
          t(' in the process by '),
          sel('gb19-i3', ['which', 'whom', 'whose'], 'which', 'referencing', 'ขยายคำนามสิ่งของ (process) ใช้ which ส่วน whom ใช้กับคน และ whose แสดงความเป็นเจ้าของ'),
          t(' plastic '),
          typ('gb19-i4', 'recycle', ['is recycled'], 'v3-clause', 'ประธาน plastic ถูกกระทำ + present จึงใช้ passive present: is + recycled (V3)'),
          t(', including the initial '),
          sel('gb19-i5', ['collection', 'collector', 'collecting'], 'collection', 'word-choice', 'initial collection = การเก็บรวบรวมในขั้นแรก ต้องใช้คำนาม collection'),
          t(' of used material, its gradual '),
          sel('gb19-i6', ['conversion', 'conversation', 'convention'], 'conversion', 'word-choice', 'conversion = การเปลี่ยนสภาพวัสดุ เป็นคำนามที่ตรงกับกระบวนการ'),
          t(' into new plastic '),
          sel('gb19-i8', ['products', 'produces', 'produced'], 'products', 'word-choice', 'new plastic products = สินค้าพลาสติกใหม่ ต้องใช้คำนาม products ส่วน produces/produced เป็นกริยา ผิดหน้าที่'),
          t(' in a recycling facility, and the final '),
          sel('gb19-i9', ['distribution', 'distributor', 'distance'], 'distribution', 'word-choice', 'final distribution = การจัดส่งขั้นสุดท้าย ต้องใช้คำนาม distribution'),
          t(' of these goods to shops.')
        ]
      },
      {
        id: 'gb19-overview',
        role: 'overview',
        labelTh: ROLE_LABEL_TH.overview,
        hintTh: HINT_CONJUGATE,
        segments: [
          ...overviewOpener('gb19'),
          t('the '),
          sel('gb19-o1', ['process', 'graph', 'pie'], 'process', 'paraphrase', 'ไดอะแกรมนี้เป็น process ไม่ใช่ graph หรือ pie chart จึงต้องใช้ process'),
          t(' '),
          typ('gb19-o2', 'consist', ['consists'], 'verb-tense', 'ประธานเอกพจน์ (the process) ใน present simple จึงเติม -s เป็น consists'),
          t(' of seven main '),
          sel('gb19-o3', ['stages', 'reasons', 'opinions'], 'stages', 'word-choice', 'stages = ขั้นตอน เหมาะกับ process ส่วน reasons/opinions ไม่เกี่ยวกับลำดับการผลิต'),
          t(', '),
          typ('gb19-o4', 'begin', ['beginning'], 'ving-clause', 'ใช้ V-ing clause ขยายความประโยคหลัก จึงใช้ beginning'),
          t(' with the '),
          sel('gb19-o5', ['collection', 'collector', 'collectible'], 'collection', 'word-choice', 'หลัง with ต้องเป็นคำนาม จึงใช้ collection (การเก็บรวบรวม) ส่วน collector (ผู้เก็บ) และ collectible (ของสะสม) ผิดความหมาย'),
          t(' of used plastic and '),
          typ('gb19-o6', 'end', ['ending'], 'ving-clause', 'คู่ขนานกับ beginning จึงใช้ V-ing เช่นกัน: ending'),
          t(' with the '),
          sel('gb19-o7', ['manufacturing', 'manufacture', 'manufacturer'], 'manufacturing', 'word-choice', 'หลัง with ต้องเป็นคำนาม (gerund) จึงใช้ manufacturing (การผลิต) ส่วน manufacture (V/N ต่างรูป) และ manufacturer (ผู้ผลิต) ผิดตำแหน่ง'),
          t(' of new plastic products, with the entire '),
          sel('gb19-o8', ['procedure', 'promise', 'protest'], 'procedure', 'paraphrase', 'procedure = ขั้นตอน paraphrase ของ process ส่วน promise/protest คนละความหมาย'),
          t(' '),
          typ('gb19-o9', 'carry', ['carried'], 'v3-clause', 'ใช้ with + noun + V3 (carried) เป็น reduced passive absolute clause ต่อท้ายประโยคหลัก จึงใช้ carried โดยไม่ต้องมี is'),
          t(' out in a fixed '),
          sel('gb19-o10', ['order', 'offer', 'answer'], 'order', 'word-choice', 'in a fixed order = ตามลำดับที่แน่นอน ส่วน offer (ข้อเสนอ) และ answer (คำตอบ) ไม่เข้ากับความหมาย'),
          t(', each stage '),
          typ('gb19-o11', 'complete', ['completed'], 'v3-clause', 'reduced passive clause ต่อขนานกัน จึงใช้ completed โดยไม่ต้องมี is'),
          t(' before the next one '),
          typ('gb19-o12', 'begin', ['begins'], 'verb-tense', 'ประธานเอกพจน์ (the next one) ใน present simple จึงเติม -s เป็น begins'),
          t('.')
        ]
      },
      {
        id: 'gb19-body1',
        role: 'body1',
        labelTh: ROLE_LABEL_TH.body1,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel('gb19-b1', ['First', 'Finally', 'Instead'], 'First', 'transition', 'ขั้นแรกของกระบวนการต้องเปิดด้วย First ส่วน Finally (สุดท้าย) และ Instead (แทนที่) ผิดลำดับ'),
          t(', used plastic items '),
          typ('gb19-b2', 'collect', ['are collected'], 'v3-clause', 'items ถูกเก็บ (ถูกกระทำ) พหูพจน์ + present จึงใช้ passive present: are + collected'),
          t(' from households and '),
          sel('gb19-b3', ['businesses', 'business', 'busyness'], 'businesses', 'word-choice', 'households and businesses = ครัวเรือนและธุรกิจ (พหูพจน์) ส่วน business (เอกพจน์) และ busyness (ความยุ่ง) ผิดรูป/ความหมาย'),
          t('. '),
          sel('gb19-b4', ['Once', 'Unless', 'Whether'], 'Once', 'transition', 'Once = เมื่อ...แล้ว บอกลำดับเวลาในกระบวนการ ส่วน Unless (เว้นแต่) และ Whether (ไม่ว่า) ไม่เข้ากับความหมาย'),
          t(' they '),
          typ('gb19-b5', 'collect', ['are collected'], 'v3-clause', 'they (plastic items) ถูกรวบรวม (ถูกกระทำ) จึงใช้ passive present: are + collected'),
          t(', they '),
          typ('gb19-b6', 'transport', ['are transported'], 'v3-clause', 'plastic ถูกขนส่ง (ถูกกระทำ) พหูพจน์ + present จึงใช้ passive present: are + transported'),
          t(' to a recycling facility, where they '),
          typ('gb19-b7', 'sort', ['are sorted'], 'v3-clause', 'plastic ถูกคัดแยก (ถูกกระทำ) พหูพจน์ + present จึงใช้ passive present: are + sorted'),
          t(' by '),
          sel('gb19-b8', ['type and colour', 'type and colours', 'types and colour'], 'type and colour', 'word-choice', 'sorted by type and colour = คัดแยกตามประเภทและสี ใช้คำนามนับไม่ได้เอกพจน์คู่กัน (type, colour) เป็นสำนวนมาตรฐาน'),
          t('. '),
          sel('gb19-b9', ['Next', 'Lastly', 'Otherwise'], 'Next', 'transition', 'Next = ต่อไป บอกขั้นถัดมา ส่วน Lastly (สุดท้าย) ผิดลำดับ และ Otherwise (มิฉะนั้น) คนละความหมาย'),
          t(', the sorted plastic '),
          typ('gb19-b10', 'crush', ['is crushed'], 'v3-clause', 'plastic ถูกบด/อัด (ถูกกระทำ) เอกพจน์ + present จึงใช้ passive present: is + crushed'),
          t(' into small pieces. '),
          sel('gb19-b11', ['After that', 'By the way', 'For instance'], 'After that', 'transition', 'After that = หลังจากนั้น บอกลำดับต่อไป ส่วน By the way (อีกอย่าง) และ For instance (ตัวอย่างเช่น) ไม่เข้ากับลำดับ'),
          t(', the crushed pieces '),
          typ('gb19-b12', 'wash', ['are washed'], 'v3-clause', 'pieces ถูกล้าง (ถูกกระทำ) พหูพจน์ + present จึงใช้ passive present: are + washed'),
          t(' '),
          sel('gb19-b13', ['in order to', 'in spite of', 'instead of'], 'in order to', 'word-choice', 'in order to + V = เพื่อ...บอกจุดประสงค์ ส่วน in spite of/instead of ตามด้วยคำนามและความหมายต่างกัน'),
          t(' remove dirt and labels.')
        ]
      },
      {
        id: 'gb19-body2',
        role: 'body2',
        labelTh: ROLE_LABEL_TH.body2,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel('gb19-c1', ['Subsequently', 'At first', 'In contrast'], 'Subsequently', 'transition', 'Subsequently = ต่อจากนั้น บอกลำดับถัดไป ส่วน At first (ตอนแรก) และ In contrast (ในทางตรงข้าม) ผิดความหมาย'),
          t(', the clean plastic pieces '),
          typ('gb19-c2', 'melt', ['are melted'], 'v3-clause', 'pieces ถูกหลอม (ถูกกระทำ) พหูพจน์ + present จึงใช้ passive present: are + melted'),
          t(' down at a high '),
          sel('gb19-c3', ['temperature', 'temper', 'tempo'], 'temperature', 'word-choice', 'high temperature = อุณหภูมิสูง ตรงกับการหลอม ส่วน temper (อารมณ์) และ tempo (จังหวะ) คนละความหมาย'),
          t(' until they '),
          typ('gb19-c4', 'turn', ['turn'], 'verb-tense', 'until + ประธานพหูพจน์ (they) ใน present simple ไม่เติม s จึงใช้ turn'),
          t(' into a liquid. '),
          sel('gb19-c5', ['Then', 'Rarely', 'Nearly'], 'Then', 'transition', 'Then = จากนั้น บอกลำดับ ส่วน Rarely (แทบไม่) และ Nearly (เกือบ) ไม่ใช่คำบอกลำดับ'),
          t(', this molten plastic '),
          typ('gb19-c6', 'cool', ['is cooled'], 'v3-clause', 'plastic ถูกทำให้เย็น (ถูกกระทำ) เอกพจน์ + present จึงใช้ passive present: is + cooled'),
          t(' and '),
          typ('gb19-c7', 'cut', ['cut'], 'v3-clause', 'ต่อจาก is cooled and ... ใช้ V3 (cut) ในโครงสร้าง passive เดียวกัน (is ... cut into)'),
          t(' into small '),
          sel('gb19-c8', ['pellets', 'petals', 'panels'], 'pellets', 'word-choice', 'pellets = เม็ดพลาสติกขนาดเล็ก ตรงกับผลผลิตขั้นนี้ ส่วน petals (กลีบดอก) และ panels (แผงแบน) คนละความหมาย'),
          t('. '),
          sel('gb19-c9', ['Finally', 'First', 'Meanwhile'], 'Finally', 'transition', 'Finally = สุดท้าย บอกขั้นตอนปิดท้าย ส่วน First (แรกสุด) และ Meanwhile (ในเวลาเดียวกัน) ผิดลำดับ'),
          t(', the pellets '),
          typ('gb19-c10', 'use', ['are used'], 'v3-clause', 'pellets ถูกนำไปใช้ (ถูกกระทำ) พหูพจน์ + present จึงใช้ passive present: are + used'),
          t(' to manufacture new plastic products, '),
          sel('gb19-c11', ['which', 'who', 'where'], 'which', 'referencing', 'which ใช้แทนสิ่งของ (new plastic products) ส่วน who ใช้กับคน และ where ใช้กับสถานที่'),
          t(' '),
          typ('gb19-c12', 'distribute', ['are then distributed', 'are distributed'], 'v3-clause', 'products ถูกจัดส่ง (ถูกกระทำ) พหูพจน์ + present จึงใช้ passive present: are + distributed'),
          t(' to shops, ready for '),
          sel('gb19-c13', ['sale', 'sail', 'sell'], 'sale', 'word-choice', 'ready for + คำนาม จึงใช้ sale (การขาย) ส่วน sail (แล่นเรือ) และ sell (V) ผิดรูป/ความหมาย'),
          t('.')
        ]
      }
    ]
  }
]

export const getWritingGuidedBuilder = (promptId: string): WgbExercise | null => {
  const exercise =
    WRITING_GUIDED_BUILDERS.find((item) => item.promptId === promptId) ||
    EXTRA_MAP_GUIDED_BUILDERS.find((item) => item.promptId === promptId) ||
    EXTRA_TASK1_GUIDED_BUILDERS.find((item) => item.promptId === promptId) ||
    null
  if (!exercise) return null
  return promptId.startsWith('map-') ? quizMapArticles(exercise) : exercise
}

// Assemble a clean, blank-free model essay from an exercise (used for the
// "show the finished essay" reveal after the student completes all steps).
export const assembleGuidedEssay = (exercise: WgbExercise): { role: WgbStep['role']; labelTh: string; text: string }[] =>
  exercise.steps.map((step) => ({
    role: step.role,
    labelTh: step.labelTh,
    text: step.segments
      .map((segment) => (segment.kind === 'text' ? segment.text : segment.blank.kind === 'select' ? segment.blank.answer : segment.blank.answers[0]))
      .join('')
      .replace(/\s+([,.])/g, '$1')
  }))
