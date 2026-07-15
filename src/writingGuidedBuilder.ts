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
//   "From ... onwards, ... continued to increase, peaking at X% ... respectively in ...,
//    reaching the lowest point at Y% by the end of the given period."
//
// Reused devices: this number / that of · respectively (always after a comma) · however /
// whereas / on the other hand · peaking at · reaching the lowest point · by the end of the
// given period · followed by · decreased dramatically.

import { EXTRA_MAP_GUIDED_BUILDERS } from './writingTask1MapExercises'

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
    'Introduction คือการ "พาราเฟรส" โจทย์ ห้ามลอกประโยคเดิม ① เปลี่ยนคำเป็น synonym ② เปลี่ยนโครงสร้างประโยค เทคนิคเสริม: colon ( : ) ตอนขยายความ, "such as" ตอนยกตัวอย่าง',
  overview:
    'Overview คือสรุปภาพรวม ห้ามใช้ตัวเลข (ปี, %, $) และห้ามใช้คำว่า rise เป็นกริยานะครับ มองกราฟทางซ้ายแล้วเลือกคำอธิบายทิศทาง: upward trend / downward trend / fluctuate / remain unchanged over the given period',
  body1:
    'Body 1 เล่าช่วงแรกของกราฟ — ทั้งย่อหน้าเป็นอดีต (past tense) เพราะเล่าข้อมูลที่เกิดแล้ว เช็คทีละช่องตามนี้: ① ประโยคใหม่ต้องขึ้นต้นด้วยคำเชื่อมนี้เท่านั้น: However / In contrast / On the other hand / Interestingly / Surprisingly / Likewise / Similarly / While / Whereas / Although (ประโยคแรกของย่อหน้าใช้ Starting in… / From…onwards / By ปี หรือประธานเองได้) ② กริยาผันอดีต หรือ V-ing / V3 ③ ต้องมี adverb บอกระดับไหม (dramatically, steadily)',
  body2:
    'Body 2 เล่าช่วงหลังของกราฟจนจบ เหมือน Body 1 — อดีตทั้งย่อหน้า เช็ค: ① ประโยคใหม่ขึ้นต้นด้วยคำเชื่อมที่อนุญาตเท่านั้น (However / In contrast / On the other hand / Interestingly / Surprisingly / Likewise / Similarly / While / Whereas / Although) ห้ามใช้ In terms of / As for / Regarding / Meanwhile / Finally / In addition ② กริยาอดีต หรือ V-ing / V3 ③ adverb บอกระดับ'
}

// Shown when a specific blank is focused, replacing the step message while focused.
export const BLANK_COACH_TH: Record<WgbBlank['focus'], string> = {
  paraphrase: 'ช่องนี้คือการพาราเฟรส — ใช้ synonym แทนคำในโจทย์ หรือเปลี่ยนโครงสร้างประโยคใหม่',
  'word-choice': 'เลือกคำที่ความหมายและไวยากรณ์เข้ากับประโยคที่สุด อ่านทั้งประโยคก่อนตัดสินใจ',
  transition:
    'ประโยคใหม่กำลังเริ่ม — เลือกคำเชื่อมที่เข้ากับความหมาย จากกลุ่มที่อนุญาตเท่านั้น: However / In contrast / On the other hand / Interestingly / Surprisingly / Likewise / Similarly / While / Whereas / Although (ห้ามใช้ In terms of / As for / Regarding / Meanwhile / Finally / In addition)',
  referencing: 'ตรงนี้อ้างถึงคำนามที่พูดถึงไปแล้ว — ใช้ "this number" หรือ "that of" แบบไหนถึงจะถูก?',
  'trend-phrase':
    'ห้ามใช้ตัวเลข (ปี, %, $) หรือคำว่า rise เป็นกริยาในย่อหน้านี้ — เลือกคำอธิบายทิศทางรวม: upward trend (ขาขึ้น) / downward trend (ขาลง) / fluctuate (ขึ้นๆ ลงๆ) / remain unchanged over the given period (ไม่เปลี่ยนแปลง)',
  'verb-tense': 'ช่องนี้ต้องผันเป็นอดีต (past tense) เสมอ เพราะทั้งเรียงความเล่าข้อมูลที่เกิดขึ้นแล้ว — เช็คแค่ประธานเอกพจน์หรือพหูพจน์',
  'ving-clause': 'ตรงนี้น่าจะต้องใช้โครงสร้าง V-ing clause (เช่น reaching, climbing, peaking) — ลองนึกกริยาที่เห็นภาพการเปลี่ยนแปลง',
  'v3-clause': 'ตรงนี้น่าจะต้องใช้ V3 (past participle) เช่น followed by, compared to — ลองดูบริบทว่าเข้ากับโครงสร้างไหน',
  'degree-adverb': 'ควรใช้ adverb บอกระดับการเปลี่ยนแปลงแบบไหนดี เช่น dramatically, steadily, gradually?'
}

export const WRITING_GUIDED_BUILDERS: WgbExercise[] = [
{
    id: 'gb-online-learning',
    promptId: 'timeline-online-learning',
    steps: [
      {
        id: 'gb1-intro',
        role: 'intro',
        labelTh: ROLE_LABEL_TH.intro,
        hintTh: HINT_PARAPHRASE,
        segments: [
          t('The line graph '),
          sel('gb1-i1', ['illustrates', 'argues', 'decides'], 'illustrates', 'paraphrase', 'illustrate = แสดง/บรรยายข้อมูลในกราฟ ส่วน argue (โต้แย้ง) และ decide (ตัดสินใจ) เป็นการกระทำของคน ใช้บรรยายกราฟไม่ได้'),
          t(' the '),
          sel('gb1-i2', ['proportion', 'amount', 'quantity'], 'proportion', 'paraphrase', 'ข้อมูลเป็น % จึงใช้ proportion (สัดส่วน) ส่วน amount/quantity ใช้กับปริมาณที่นับหรือตวงได้ ไม่เข้ากับเปอร์เซ็นต์'),
          t(' '),
          sel('gb1-i9', ['of', 'in', 'for'], 'of', 'word-choice', 'the proportion of students = สัดส่วนของนักเรียน ใช้ of เชื่อมกับคำนามที่เป็นส่วนหนึ่งเสมอ'),
          t(' students who '),
          sel('gb1-i3', ['used', 'use', 'using'], 'used', 'word-choice', 'อนุประโยค who ต้องมีกริยาแท้ และเป็นอดีต (past simple) เพราะเล่าข้อมูลปี 2014–2024 ที่ผ่านมาแล้ว จึงใช้ used'),
          t(' online learning platforms '),
          sel('gb1-i10', ['compared', 'comparing', 'compare'], 'compared', 'word-choice', 'compared with = เมื่อเทียบกับ ใช้ V3 (compared) ในโครงสร้างลดรูป passive ส่วน comparing/compare ทำให้โครงสร้างผิด'),
          t(' '),
          sel('gb1-i4', ['with', 'to which', 'of'], 'with', 'word-choice', 'compared with = เปรียบเทียบระหว่างสองกลุ่ม เป็นสำนวนคู่ compared + with ส่วนตัวเลือกอื่นไม่เข้าโครงสร้าง'),
          t(' those who '),
          sel('gb1-i5', ['attended', 'attend', 'attending'], 'attended', 'word-choice', 'อนุประโยค who ต้องมีกริยาแท้เป็นอดีตให้ขนานกับ used จึงใช้ attended'),
          t(' '),
          sel('gb1-i6', ['traditional', 'tradition', 'traditionally'], 'traditional', 'word-choice', 'ขยายคำนาม classes ต้องใช้คุณศัพท์ traditional ไม่ใช่คำนาม tradition หรือ adverb traditionally'),
          t(' '),
          sel('gb1-i11', ['in-person', 'in-persons', 'person-in'], 'in-person', 'word-choice', 'in-person classes = ชั้นเรียนแบบพบหน้า ใช้ in-person เป็นคุณศัพท์ ส่วนรูปอื่นสะกด/เรียงผิด'),
          t(' classes, over a '),
          sel('gb1-i7', ['ten-year', 'five-year', 'twenty-year'], 'ten-year', 'word-choice', 'ช่วง 2014–2024 ห่างกัน 10 ปี จึงใช้ ten-year ส่วนตัวเลือกอื่นนับปีผิด'),
          t(' period from 2014 '),
          sel('gb1-i8', ['to', 'until', 'and'], 'to', 'word-choice', 'over a … period from X to Y ต้องใช้ to คู่กับ from เสมอ ส่วน until/and ไม่เข้าโครงสร้างนี้'),
          t(' 2024.')
        ]
      },
      {
        id: 'gb1-overview',
        role: 'overview',
        labelTh: ROLE_LABEL_TH.overview,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('Overall, it can be clearly observed that '),
          sel('gb1-o1', ['while', 'because', 'so'], 'while', 'transition', 'while ใช้เปรียบเทียบสองทิศทางที่ตรงข้ามกันในประโยคเดียว เหมาะกับ Overview ที่เทียบขาขึ้นกับขาลง ส่วน because/so บอกเหตุผล ไม่ใช่การเปรียบเทียบ'),
          t(' online learning '),
          sel(
            'gb1-o2',
            ['showed an upward trend', 'showed a downward trend', 'fluctuated', 'remained unchanged over the given period'],
            'showed an upward trend',
            'trend-phrase',
            'ตัวเลข online เพิ่มจาก 18% เป็น 74% จึงเป็นขาขึ้น (upward trend) ไม่ใช่ขาลง/ขึ้นลง/คงที่'
          ),
          t(', in-person classes '),
          sel(
            'gb1-o3',
            ['showed a downward trend', 'showed an upward trend', 'fluctuated', 'remained unchanged over the given period'],
            'showed a downward trend',
            'trend-phrase',
            'ตัวเลข in-person ลดจาก 82% เหลือ 26% จึงเป็นขาลง (downward trend)'
          ),
          t(', with online learning '),
          typ('gb1-o6', 'end', ['ending'], 'ving-clause', 'ใช้ V-ing clause (ending) ต่อท้ายประโยคหลักหลัง with เพื่อสรุปผลลัพธ์ตอนจบ'),
          t(' the period as the '),
          sel('gb1-o7', ['more', 'most', 'much'], 'more', 'word-choice', 'เปรียบเทียบสองสิ่ง (online กับ in-person) ใช้ขั้นกว่า more popular ไม่ใช่ขั้นสุด most'),
          t(' '),
          sel('gb1-o13', ['popular', 'popularity', 'popularly'], 'popular', 'word-choice', 'more popular = ได้รับความนิยมมากกว่า ต้องใช้คุณศัพท์ popular ส่วน popularity (คำนาม) และ popularly (adverb) ไม่เข้าโครงสร้าง the more … option'),
          t(' of the two '),
          sel('gb1-o8', ['options', 'opinions', 'occasions'], 'options', 'word-choice', 'options = ทางเลือก (พหูพจน์เพราะพูดถึงสองแบบ) ส่วน opinions (ความเห็น) และ occasions (โอกาส/เหตุการณ์) ความหมายไม่ตรง'),
          t('.')
        ]
      },
      {
        id: 'gb1-body1',
        role: 'body1',
        labelTh: ROLE_LABEL_TH.body1,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('Starting in 2014, at 82%, the '),
          sel('gb1-b1', ['percentage', 'percent', 'number'], 'percentage', 'paraphrase', 'ตามด้วย of students ควรใช้ percentage (คำนาม) ส่วน percent ใช้ต่อท้ายตัวเลข (82 percent) และ number ใช้กับสิ่งที่นับเป็นตัว ไม่ใช่ %'),
          t(' of students '),
          sel('gb1-b2', ['attending', 'attended', 'attend'], 'attending', 'word-choice', 'ใช้ V-ing (attending) ลดรูปอนุประโยค who were attending มาขยาย students ส่วน attended/attend ทำให้ประโยคมีกริยาซ้อน'),
          t(' in-person classes '),
          typ('gb1-b3', 'be', ['was'], 'verb-tense', 'ประธานเอกพจน์ (the percentage) + เล่าอดีต จึงใช้ was'),
          t(' the '),
          sel('gb1-b4', ['highest', 'higher', 'high'], 'highest', 'word-choice', 'เทียบกับทุกค่าในกราฟจึงใช้ขั้นสุด highest ไม่ใช่ขั้นกว่า higher หรือรูปธรรมดา high'),
          t(', '),
          typ('gb1-b5', 'follow', ['followed'], 'v3-clause', 'followed by = ตามมาด้วย ใช้ V3 ในรูป passive เพื่อบอกลำดับรองลงมา'),
          t(' by those '),
          sel('gb1-b6', ['using', 'used', 'use'], 'using', 'word-choice', 'ใช้ V-ing (using) ลดรูป who were using มาขยาย those ส่วนรูปอื่นทำให้โครงสร้างผิด'),
          t(' online platforms '),
          sel('gb1-b17', ['at', 'by', 'with'], 'at', 'word-choice', 'at just 18% = อยู่ที่ค่า 18% ใช้ at กับค่าตัวเลขจุดใดจุดหนึ่งเสมอ ส่วน by/with ไม่ใช้บอกค่า ณ จุดนั้น'),
          t(' just 18%, '),
          sel('gb1-b7', ['respectively', 'especially', 'namely'], 'respectively', 'word-choice', 'respectively = ตามลำดับที่กล่าวมา (in-person แล้ว online) มีคอมมาข้างหน้าเสมอ ส่วน especially/namely ความหมายไม่ตรง'),
          t('. '),
          sel('gb1-b8', ['While', 'Because', 'Therefore'], 'While', 'transition', 'While เริ่มประโยคเปรียบเทียบสองการเคลื่อนไหวที่สวนทางกัน (online ขึ้น / in-person ลง) ตามกฎ TIMELINE ส่วน Because/Therefore บอกเหตุผล-ผลลัพธ์ ไม่ใช่การเปรียบเทียบ'),
          t(' online learning '),
          typ('gb1-b9', 'increase', ['increased'], 'verb-tense', 'ประธานเอกพจน์ + เล่าอดีต จึงใช้ increased'),
          t(' '),
          sel('gb1-b10', ['dramatically', 'marginally', 'rarely'], 'dramatically', 'word-choice', 'เพิ่มจาก 18% เป็น 34% ถือว่าเปลี่ยนมาก จึงใช้ dramatically ส่วน marginally (เล็กน้อย) และ rarely (นานๆ ครั้ง) ไม่เข้ากับการเพิ่มก้าวใหญ่'),
          t(' to 34% '),
          sel('gb1-b11', ['by', 'at', 'in'], 'by', 'word-choice', 'by 2018 = ภายในปี 2018 (เมื่อถึงปีนั้น) เหมาะกับการบอกผลของการเพิ่มขึ้น ส่วน at/in ไม่ใช่สำนวนบอกจุดปลายของการเปลี่ยนแปลง'),
          t(' 2018, '),
          sel('gb1-b18', ['attendance', 'attendant', 'attending'], 'attendance', 'word-choice', 'ต้องการคำนาม attendance (การเข้าเรียน) เป็นประธานของประโยค ส่วน attendant (พนักงาน) และ attending (V-ing) ไม่เข้ากับตำแหน่งประธาน'),
          t(' at in-person classes '),
          typ('gb1-b12', 'fall', ['fell'], 'verb-tense', 'fall เป็นกริยาผันไม่ปกติ อดีตคือ fell + ประธานเอกพจน์ เล่าอดีต'),
          t(' '),
          sel('gb1-b13', ['steadily', 'sharply', 'barely'], 'sharply', 'word-choice', 'ลดจาก 82% เหลือ 66% เป็นการลดที่ชัดเจน ใช้ sharply ได้ ส่วน barely (แทบไม่) ขัดกับข้อมูล และ steadily เน้นความสม่ำเสมอมากกว่าขนาด'),
          t(' to 66% '),
          typ('gb1-b14', 'mirror', ['mirroring'], 'ving-clause', 'ใช้ V-ing clause ขยายผล (mirroring = สะท้อน/สวนทางกัน) เชื่อมการลดของ in-person กับการเพิ่มของ online'),
          t(' the '),
          sel('gb1-b15', ['rise', 'raise', 'arise'], 'rise', 'word-choice', 'the rise in… = การเพิ่มขึ้น เป็นคำนามที่ถูก ส่วน raise (ยกขึ้น/ขึ้นเงินเดือน) และ arise (เกิดขึ้น) ความหมายไม่ตรง'),
          t(' in online learning '),
          sel('gb1-b16', ['over', 'along', 'upon'], 'over', 'word-choice', 'over this early period = ในช่วงต้นนี้ เป็นวลีบอกช่วงเวลามาตรฐาน ส่วน along/upon ไม่ใช้กับช่วงเวลาแบบนี้'),
          t(' this '),
          sel('gb1-b19', ['early', 'earlier', 'earliest'], 'early', 'word-choice', 'this early period = ช่วงต้นนี้ ใช้คุณศัพท์ธรรมดา early ขยาย period ไม่ต้องเป็นขั้นกว่า/ขั้นสุด'),
          t(' period.')
        ]
      },
      {
        id: 'gb1-body2',
        role: 'body2',
        labelTh: ROLE_LABEL_TH.body2,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('From 2018 '),
          sel('gb1-c23', ['onwards', 'forwards', 'ahead'], 'onwards', 'word-choice', 'from 2018 onwards = ตั้งแต่ปี 2018 เป็นต้นไป เป็นสำนวนบอกช่วงเวลาต่อจากจุดหนึ่ง ส่วน forwards/ahead ไม่ใช้ในสำนวนนี้'),
          t(', '),
          sel('gb1-c1', ['while', 'since', 'unless'], 'while', 'transition', 'while เชื่อมสองการเคลื่อนไหวที่สวนทางกันในประโยคเดียว (online ยังขึ้น / in-person ยังลง) ตามกฎ TIMELINE ส่วน since/unless ความหมายไม่ตรง'),
          t(' online learning '),
          typ('gb1-c2', 'continue', ['continued'], 'verb-tense', 'ประธานเอกพจน์ + เล่าอดีต จึงใช้ continued'),
          t(' to '),
          sel('gb1-c3', ['climb', 'climbs', 'climbed'], 'climb', 'word-choice', 'หลัง to (to-infinitive) ต้องใช้กริยารูป base คือ climb ไม่ผันรูป'),
          t(', '),
          typ('gb1-c4', 'reach', ['reaching'], 'ving-clause', 'ใช้ V-ing clause (reaching) ขยายผลของการไต่ขึ้นจนถึงจุดสูงสุด'),
          t(' a '),
          sel('gb1-c5', ['peak', 'top', 'summit'], 'peak', 'word-choice', 'reach a peak = แตะจุดสูงสุด เป็นสำนวน Task 1 ที่ถูกต้อง ส่วน top/summit ไม่ใช้คู่กับ reach a… ในบริบทกราฟ'),
          t(' '),
          sel('gb1-c6', ['at', 'on', 'to'], 'at', 'word-choice', 'peak at 74% = จุดสูงสุดที่ค่า 74% ใช้ at กับค่าตัวเลขจุดใดจุดหนึ่งเสมอ'),
          t(' 74% in 2024, '),
          sel('gb1-c24', ['in-person', 'in person', 'inperson'], 'in-person', 'word-choice', 'in-person (มีขีดกลาง) เป็นคุณศัพท์ขยาย attendance ส่วน in person (ไม่มีขีด) เป็น adverb และ inperson สะกดผิด'),
          t(' attendance '),
          typ('gb1-c7', 'keep', ['kept'], 'verb-tense', 'keep เป็นกริยาผันไม่ปกติ อดีตคือ kept + ประธานเอกพจน์ เล่าอดีต'),
          t(' '),
          typ('gb1-c8', 'fall', ['falling'], 'ving-clause', 'keep + V-ing = ทำต่อเนื่อง จึงใช้ falling ไม่ใช่รูปอื่น'),
          t(', '),
          typ('gb1-c9', 'drop', ['dropping'], 'ving-clause', 'ใช้ V-ing clause (dropping) ขยายผลของการลดลงต่อเนื่องจนถึงค่าต่ำสุด'),
          t(' to just 26% '),
          sel('gb1-c10', ['by', 'at', 'until'], 'by', 'word-choice', 'by 2024 = ภายในปี 2024 (เมื่อถึงปีนั้น) เป็นสำนวนบอกจุดเวลาปลายทาง ส่วน at ใช้กับเวลาที่เจาะจงมากกว่า และ until ความหมายไม่ตรง'),
          t(' 2024. '),
          sel(
            'gb1-c11',
            ['It is worth noting that', 'It is worth wondering whether', 'It is worth arguing that'],
            'It is worth noting that',
            'transition',
            'It is worth noting that = ที่น่าสังเกตคือ ใช้เน้นข้อมูลสำคัญ ส่วนตัวเลือกอื่นเป็นการตั้งคำถาม/โต้แย้ง ซึ่งไม่เหมาะกับการบรรยายกราฟ'
          ),
          t(' online learning, '),
          sel('gb1-c12', ['which', 'who', 'where'], 'which', 'referencing', 'which ใช้แทนสิ่งของ/สิ่งที่ไม่ใช่คน (online learning) ส่วน who ใช้กับคน และ where ใช้กับสถานที่'),
          t(' '),
          typ('gb1-c13', 'begin', ['began'], 'verb-tense', 'begin เป็นกริยาผันไม่ปกติ อดีตคือ began เล่าอดีต'),
          t(' the period '),
          sel('gb1-c27', ['as', 'like', 'such'], 'as', 'word-choice', 'begin … as the … option = เริ่มต้นในฐานะ… ใช้ as นำหน้าบทบาท/สถานะ ส่วน like/such ไม่เข้าโครงสร้างนี้'),
          t(' the '),
          sel('gb1-c14', ['less', 'least', 'lesser'], 'less', 'word-choice', 'เปรียบเทียบสองสิ่งใช้ขั้นกว่า less popular ไม่ใช่ขั้นสุด least'),
          t(' popular '),
          sel('gb1-c15', ['option', 'optional', 'opting'], 'option', 'word-choice', 'ต้องการคำนาม option (ทางเลือก) ไม่ใช่คุณศัพท์ optional หรือ V-ing opting'),
          t(', '),
          typ('gb1-c16', 'end', ['ended'], 'verb-tense', 'ประธานเอกพจน์ (which = online learning) + เล่าอดีต จึงใช้ ended'),
          t(' it as the '),
          sel('gb1-c17', ['clear', 'clearly', 'clearest'], 'clear', 'word-choice', 'ขยายคำนาม leader ต้องใช้คุณศัพท์ clear (the clear leader) ไม่ใช่ adverb clearly'),
          t(' leader, '),
          typ('gb1-c18', 'be', ['being'], 'ving-clause', 'ใช้ V-ing clause (being) ขยายความ บอกสถานะสุดท้ายที่ตามมา'),
          t(' the '),
          sel('gb1-c25', ['choice', 'choose', 'chosen'], 'choice', 'word-choice', 'ต้องการคำนาม choice (ตัวเลือก) หลัง the ส่วน choose (กริยา) และ chosen (V3) ไม่เข้ากับตำแหน่งคำนาม'),
          t(' of nearly '),
          sel('gb1-c19', ['three-quarters', 'a quarter', 'half'], 'three-quarters', 'word-choice', '74% ≈ สามในสี่ จึงใช้ three-quarters ส่วน a quarter (หนึ่งในสี่) และ half (ครึ่ง) ไม่ตรงกับ 74%'),
          t(' of students, '),
          sel('gb1-c20', ['whereas', 'because', 'so that'], 'whereas', 'transition', 'whereas เปรียบเทียบสองค่าที่ตรงข้ามกัน (online 74% กับ in-person 26%) ตามกฎ TIMELINE ส่วน because/so that บอกเหตุผล-จุดประสงค์'),
          t(' in-person classes '),
          typ('gb1-c21', 'be', ['were'], 'verb-tense', 'ประธาน classes เป็นพหูพจน์ + เล่าอดีต จึงใช้ were'),
          t(' '),
          typ('gb1-c26', 'leave', ['left'], 'v3-clause', 'were left = ถูกทิ้งไว้/เหลืออยู่ ใช้ V3 (left) ในรูป passive หลัง were'),
          t(' with just '),
          sel('gb1-c22', ['over', 'above', 'beyond'], 'over', 'word-choice', 'just over a quarter = มากกว่าหนึ่งในสี่เล็กน้อย (26%) ใช้ over กับตัวเลข ส่วน above/beyond ไม่ใช่สำนวนที่ใช้คู่ just… ในบริบทนี้'),
          t(' a quarter. '),
          sel('gb1-c28', ['Notably', 'Namely', 'Certainly'], 'Notably', 'word-choice', 'Notably = ที่น่าสังเกตคือ ใช้เกริ่นข้อมูลเสริมที่น่าสนใจ ส่วน Namely (กล่าวคือ) และ Certainly (แน่นอน) ไม่เข้ากับความหมายนี้'),
          t(', online learning '),
          typ('gb1-c29', 'overtake', ['overtook'], 'verb-tense', 'overtake เป็นกริยาผันไม่ปกติ อดีตคือ overtook + ประธานเอกพจน์ เล่าอดีต'),
          t(' in-person classes at around the '),
          sel('gb1-c30', ['midpoint', 'endpoint', 'outset'], 'midpoint', 'word-choice', 'เส้นทั้งสองตัดกันประมาณกลางช่วงเวลา (ราวปี 2019) จึงใช้ midpoint ส่วน endpoint (จุดจบ) และ outset (จุดเริ่ม) ผิดตำแหน่ง'),
          t(' of the period, '),
          typ('gb1-c31', 'widen', ['widening'], 'ving-clause', 'ใช้ V-ing clause (widening) ขยายผลลัพธ์ต่อเนื่อง บอกว่าช่องว่างระหว่างสองเส้นกว้างขึ้นหลังจากนั้น'),
          t(' the gap between the two lines for the rest of the period.')
        ]
      }
    ]
  },

{
    id: 'gb-food-delivery',
    promptId: 'timeline-food-delivery',
    steps: [
      {
        id: 'gb2-intro',
        role: 'intro',
        labelTh: ROLE_LABEL_TH.intro,
        hintTh: HINT_PARAPHRASE,
        segments: [
          t('The line graph '),
          sel('gb2-i1', ['shows', 'claims', 'wonders'], 'shows', 'paraphrase', 'show = แสดง/นำเสนอข้อมูลในกราฟ ส่วน claim (อ้าง) และ wonder (สงสัย) เป็นการกระทำของคน ใช้บรรยายกราฟไม่ได้'),
          t(' the '),
          sel('gb2-i2', ['sales', 'sale', 'seller'], 'sales', 'paraphrase', 'ยอดขาย (จำนวนคันที่ขายได้) ใช้พหูพจน์ sales ส่วน sale (การลดราคา) และ seller (ผู้ขาย) คนละความหมาย'),
          t(' of '),
          sel('gb2-i3', ['petrol', 'petroleum', 'peculiar'], 'petrol', 'word-choice', 'petrol cars = รถยนต์น้ำมัน ตรงกับโจทย์ ส่วน petroleum (ปิโตรเลียม ใช้กับน้ำมันดิบ) และ peculiar (แปลก) คนละความหมาย'),
          t(' cars '),
          sel('gb2-i4', ['and', 'or', 'nor'], 'and', 'word-choice', 'เชื่อมสองประเภทรถที่เทียบกัน (petrol และ electric) ใช้ and ส่วน or/nor ให้ความหมายเลือก/ปฏิเสธ'),
          t(' electric cars '),
          typ('gb2-i5', 'sell', ['sold'], 'v3-clause', 'รถที่ "ถูกขาย" ในอดีต ใช้ V3 (sold) แบบ passive ลดรูปขยาย cars'),
          t(' in a European country, '),
          sel('gb2-i6', ['measured', 'measuring', 'measure'], 'measured', 'word-choice', 'ยอดขายถูกวัด (ถูกกระทำ) เป็นหน่วยพันคัน จึงใช้ V3 measured แบบ passive ส่วน measuring/measure เป็น active ผิดความหมาย'),
          t(' in '),
          sel('gb2-i7', ['thousands', 'thousand', 'thousandth'], 'thousands', 'word-choice', 'in thousands of units (หลักพัน) ต้องเติม s เป็นพหูพจน์เสมอ'),
          t(' of units, over a '),
          sel('gb2-i7b', ['ten-year', 'five-year', 'twenty-year'], 'ten-year', 'word-choice', 'ช่วง 2014–2024 ห่างกัน 10 ปี จึงใช้ ten-year ส่วนตัวเลือกอื่นนับปีผิด'),
          t(' period '),
          sel('gb2-i8', ['from', 'since', 'within'], 'from', 'word-choice', 'over a … period from X to Y ต้องใช้ from คู่กับ to เสมอ ส่วน since/within ไม่เข้าโครงสร้างนี้'),
          t(' 2014 '),
          sel('gb2-i9', ['to', 'and', 'or'], 'to', 'word-choice', 'from…to… ต้องคู่กับ to เสมอ ใช้ and หรือ or ไม่ได้'),
          t(' 2024.')
        ]
      },
      {
        id: 'gb2-overview',
        role: 'overview',
        labelTh: ROLE_LABEL_TH.overview,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel('gb2-o1', ['Overall', 'For example', 'In particular'], 'Overall', 'transition', 'Overall ใช้เปิดย่อหน้าสรุปภาพรวม ส่วน For example (ยกตัวอย่าง) และ In particular (เฉพาะเจาะจง) ไม่ใช่การสรุปรวม'),
          t(', it can be clearly observed that petrol car '),
          sel('gb2-o2', ['sales', 'sale', 'selling'], 'sales', 'word-choice', 'ยอดขายในความหมายจำนวนที่ขายได้ใช้พหูพจน์ sales เสมอ'),
          t(' '),
          sel(
            'gb2-o3',
            ['showed a downward trend', 'showed an upward trend', 'fluctuated', 'remained unchanged over the given period'],
            'showed a downward trend',
            'trend-phrase',
            'ยอดขายรถน้ำมันลดลงตลอดช่วง จึงเป็น downward trend (ขาลง) ไม่ใช่ขาขึ้น ไม่ใช่ขึ้นๆลงๆ และไม่ใช่คงที่'
          ),
          t(' '),
          sel('gb2-o3b', ['while', 'because', 'so that'], 'while', 'transition', 'while ใช้เปรียบเทียบสองทิศทางตรงข้ามในประโยคเดียว (รถน้ำมันลง / รถไฟฟ้าขึ้น) ส่วน because/so that บอกเหตุผล/จุดประสงค์'),
          t(' electric car sales '),
          sel(
            'gb2-o4',
            ['showed an upward trend', 'showed a downward trend', 'fluctuated', 'remained unchanged over the given period'],
            'showed an upward trend',
            'trend-phrase',
            'ยอดขายรถไฟฟ้าเพิ่มขึ้นตลอดช่วง จึงเป็น upward trend (ขาขึ้น) ไม่ใช่ขาลง ไม่ใช่ขึ้นๆลงๆ และไม่ใช่คงที่'
          ),
          t(' over the given period, '),
          typ('gb2-o5', 'result', ['resulting'], 'ving-clause', 'ใช้ V-ing clause (resulting) ขยายผลลัพธ์ต่อเนื่องจากประโยคหลัก'),
          t(' '),
          sel('gb2-o5b', ['in', 'of', 'for'], 'in', 'word-choice', 'result in = ส่งผลให้เกิด… เป็นสำนวนตายตัวต้องใช้ in ส่วน of/for ไม่เข้ากับ result'),
          t(' electric cars '),
          typ('gb2-o6', 'overtake', ['overtaking'], 'ving-clause', 'ใช้ V-ing clause (overtaking) ขยายผลของประโยคหลัก บอกว่ารถไฟฟ้า "แซง" รถน้ำมันไปแล้ว'),
          t(' petrol cars to become the more popular choice by the end of the period.')
        ]
      },
      {
        id: 'gb2-body1',
        role: 'body1',
        labelTh: ROLE_LABEL_TH.body1,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('Starting in 2014, petrol car sales '),
          typ('gb2-b1', 'stand', ['stood'], 'verb-tense', 'stand เป็นกริยาผันไม่ปกติ อดีตคือ stood + ประธานเอกพจน์ เล่าอดีต'),
          t(' at 85,000 units, more than '),
          sel('gb2-b1b', ['ten times', 'ten time', 'tenth times'], 'ten times', 'word-choice', 'บอกจำนวนเท่าใช้ "ten times" (สิบเท่า) ส่วน ten time และ tenth times ผิดรูป'),
          t(' the 8,000 electric cars '),
          typ('gb2-b2', 'sell', ['sold'], 'v3-clause', 'ใช้ V3 (sold) แบบ passive ลดรูปขยาย electric cars ที่ "ถูกขาย" ในปีนั้น'),
          t(' that year. '),
          sel('gb2-b3', ['Although', 'Because', 'Therefore'], 'Although', 'transition', 'Although ใช้เชื่อมความขัดแย้ง (รถไฟฟ้าโตเร็วแต่ยังตัวเลขน้อย) ตามกฎ TIMELINE ส่วน Because/Therefore เป็นเหตุ-ผล'),
          t(' petrol car sales '),
          typ('gb2-b4', 'decline', ['declined'], 'verb-tense', 'เล่าอดีต ประธานเอกพจน์ (petrol car sales) จึงผัน decline เป็น declined'),
          t(' only '),
          sel('gb2-b5', ['gradually', 'rapidly', 'wildly'], 'gradually', 'word-choice', 'ช่วงนี้รถน้ำมันลดช้าๆ (85,000→72,000) จึงใช้ gradually ส่วน rapidly/wildly แปลว่าเร็ว/รุนแรงเกินจริง'),
          t(' over the next four years, '),
          typ('gb2-b6', 'fall', ['falling'], 'ving-clause', 'ใช้ V-ing clause (falling) ขยายผลของประโยคหลัก บอกว่ายอดลงไปถึงเท่าไร'),
          t(' to 72,000 by 2018, electric car sales '),
          typ('gb2-b7', 'climb', ['climbed'], 'verb-tense', 'เล่าอดีต ประธานพหูพจน์ (electric car sales) จึงผัน climb เป็น climbed'),
          t(' '),
          sel('gb2-b8', ['steadily', 'faintly', 'weakly'], 'steadily', 'word-choice', 'ยอดรถไฟฟ้าเพิ่มขึ้นอย่างสม่ำเสมอในช่วงนี้ จึงใช้ steadily ส่วน faintly/weakly (จางๆ/อ่อน) ไม่ตรงภาพ'),
          t(' during the same period, '),
          typ('gb2-b9', 'reach', ['reaching'], 'ving-clause', 'ใช้ V-ing clause (reaching) ขยายผลของประโยคหลัก บอกว่ายอดขึ้นไปถึงเท่าไร'),
          t(' 28,000 in that year.')
        ]
      },
      {
        id: 'gb2-body2',
        role: 'body2',
        labelTh: ROLE_LABEL_TH.body2,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('From 2018 '),
          sel('gb2-c1', ['onwards', 'forward', 'ahead'], 'onwards', 'word-choice', 'from 2018 onwards = ตั้งแต่ปี 2018 เป็นต้นไป เป็น collocation ที่ถูก ส่วน forward/ahead ไม่เข้าโครงสร้างนี้'),
          t(', petrol car sales '),
          typ('gb2-c2', 'continue', ['continued'], 'verb-tense', 'เล่าอดีต ประธานเอกพจน์ (petrol car sales) จึงผัน continue เป็น continued'),
          t(' to '),
          sel('gb2-c3', ['fall', 'falls', 'fell'], 'fall', 'word-choice', 'หลัง to (to-infinitive) ต้องใช้กริยารูป base คือ fall ไม่ผันรูป'),
          t(', '),
          typ('gb2-c4', 'drop', ['dropping'], 'ving-clause', 'ใช้ V-ing clause (dropping) ขยายผลของประโยคหลัก บอกว่ายอดตกลงไปเท่าไร'),
          t(' to 58,000 in 2020 and 42,000 by 2022, while electric car sales '),
          typ('gb2-c5', 'rise', ['rose'], 'verb-tense', 'rise เป็นกริยาผันไม่ปกติ อดีตคือ rose + ประธานพหูพจน์ เล่าอดีต'),
          t(' '),
          sel('gb2-c6', ['sharply', 'faintly', 'quietly'], 'sharply', 'word-choice', 'ยอดรถไฟฟ้าพุ่งขึ้นแรง (48,000→70,000) จึงใช้ sharply ส่วน faintly/quietly (จางๆ/เบา) ไม่ตรงภาพ'),
          t(', '),
          typ('gb2-c7', 'climb', ['climbing'], 'ving-clause', 'ใช้ V-ing clause (climbing) ขยายผลของประโยคหลัก บอกว่ายอดไต่ขึ้นไปเท่าไรตามลำดับ'),
          t(' to 48,000 and then 70,000 in the same years, '),
          sel('gb2-c7b', ['overtaking', 'overtaken', 'overtake'], 'overtaking', 'ving-clause', 'ใช้ V-ing clause (overtaking) ขยายผลของประโยคหลัก บอกว่ารถไฟฟ้า "แซง" รถน้ำมันไปในช่วงนี้'),
          t(' petrol cars shortly after 2020. '),
          sel('gb2-c8', ['Whereas', 'Because', 'So'], 'Whereas', 'transition', 'Whereas เปรียบเทียบสองทิศทางที่ตรงข้ามกัน (รถไฟฟ้ายังพุ่งต่อ / รถน้ำมันยังร่วงต่อ) ตามกฎ TIMELINE ส่วน Because/So บอกเหตุ-ผล'),
          t(' electric car sales '),
          typ('gb2-c9', 'continue', ['continued'], 'verb-tense', 'เล่าอดีต ประธานพหูพจน์ (electric car sales) จึงผัน continue เป็น continued'),
          t(' to surge, '),
          typ('gb2-c10', 'reach', ['reaching'], 'ving-clause', 'ใช้ V-ing clause (reaching) ขยายผลของประโยคหลัก บอกว่ายอดขึ้นไปถึงเท่าไร'),
          t(' 88,000 by 2024, petrol car sales '),
          typ('gb2-c11', 'keep', ['kept'], 'verb-tense', 'keep เป็นกริยาผันไม่ปกติ อดีตคือ kept + ประธานเอกพจน์ เล่าอดีต'),
          t(' '),
          typ('gb2-c12', 'fall', ['falling'], 'ving-clause', 'keep + V-ing = ทำต่อเนื่อง จึงใช้ falling ไม่ใช่รูปอื่น'),
          t(', '),
          typ('gb2-c13', 'end', ['ending'], 'ving-clause', 'ใช้ V-ing clause (ending) ขยายผลของประโยคหลัก สรุปตัวเลขปิดท้ายช่วง'),
          t(' the period at just 30,000 units.')
        ]
      }
    ]
  },

{
    id: 'gb-work-from-home',
    promptId: 'timeline-work-from-home',
    steps: [
      {
        id: 'gb3-intro',
        role: 'intro',
        labelTh: ROLE_LABEL_TH.intro,
        hintTh: HINT_PARAPHRASE,
        segments: [
          t('The '),
          sel('gb3-i0', ['bar chart', 'pie chart', 'flow chart'], 'bar chart', 'paraphrase', 'ข้อมูลชนิดนี้แสดงเป็นแท่ง จึงเป็น bar chart; pie chart แสดงสัดส่วนวงกลม, flow chart แสดงขั้นตอน ไม่ตรง'),
          t(' '),
          sel('gb3-i1', ['illustrates', 'insists', 'imagines'], 'illustrates', 'paraphrase', 'illustrate = แสดง/บรรยายข้อมูลในกราฟ ส่วน insist (ยืนกราน) และ imagine (จินตนาการ) เป็นการกระทำของคน ใช้บรรยายกราฟไม่ได้'),
          t(' the '),
          sel('gb3-i2', ['number', 'percentage', 'rate'], 'number', 'paraphrase', 'ข้อมูลเป็นหน่วยล้านคน (millions) จึงเป็น number ส่วน percentage/rate ต้องเป็น % ซึ่งไม่ตรงกับหน่วยในกราฟ'),
          t(' of people '),
          sel('gb3-i2f', ['who', 'which', 'whose'], 'who', 'referencing', 'อ้างถึงคน ใช้ relative pronoun who; which ใช้กับสิ่งของ, whose แสดงความเป็นเจ้าของ'),
          t(' '),
          sel('gb3-i2b', ['worked', 'work', 'working'], 'worked', 'word-choice', 'ประโยค relative clause หลัง who ต้องมีกริยาแท้ และเล่าอดีต จึงใช้ worked'),
          t(' from '),
          sel('gb3-i2d', ['home', 'homes', 'a home'], 'home', 'word-choice', 'สำนวน work from home ใช้ home แบบไม่มี article เป็นวลีตายตัว'),
          t(', '),
          sel('gb3-i2c', ['measured', 'measuring', 'measure'], 'measured', 'paraphrase', 'ตัวเลขถูกวัด (ถูกกระทำ) จึงใช้ V3 แบบ passive คือ measured; measuring/measure ให้ความหมายว่าตัวเลขไปวัดเอง ผิด'),
          t(' '),
          sel('gb3-i2e', ['in', 'by', 'on'], 'in', 'word-choice', 'measured in millions = วัดเป็นหน่วยล้าน ใช้ in กับหน่วยวัดเสมอ'),
          t(' millions, over a '),
          sel('gb3-i3', ['ten-year', 'five-year', 'twenty-year'], 'ten-year', 'word-choice', 'ช่วง 2014–2024 ห่างกัน 10 ปี จึงใช้ ten-year ส่วนตัวเลือกอื่นนับปีผิด'),
          t(' period '),
          sel('gb3-i3b', ['from', 'until', 'through'], 'from', 'word-choice', 'over a … period from X to Y ต้องใช้ from คู่กับ to เสมอ ส่วน until/through ไม่เข้าโครงสร้างนี้'),
          t(' 2014 to 2024.')
        ]
      },
      {
        id: 'gb3-overview',
        role: 'overview',
        labelTh: ROLE_LABEL_TH.overview,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('Overall, it can be clearly observed that the '),
          sel('gb3-o0', ['number', 'total', 'figure'], 'number', 'paraphrase', 'พูดถึง "จำนวนคน" จึงใช้ number of people ได้ธรรมชาติที่สุด'),
          t(' of people '),
          sel('gb3-o0b', ['working', 'worked', 'work'], 'working', 'word-choice', 'ขยายคำนาม people ด้วย V-ing ในรูป reduced clause จึงใช้ working'),
          t(' from home '),
          sel(
            'gb3-o1',
            ['fluctuated over the given period', 'showed a steady upward trend', 'showed a steady downward trend', 'remained unchanged over the given period'],
            'fluctuated over the given period',
            'trend-phrase',
            'กราฟขึ้นแล้วพุ่งสูงสุดก่อนตกลงมา = fluctuate (ขึ้นๆ ลงๆ) ไม่ใช่ขาขึ้น/ขาลงล้วน หรือคงที่'
          ),
          t(', '),
          typ('gb3-o2', 'peak', ['peaking'], 'ving-clause', 'ใช้ V-ing clause ขยายความต่อจากประโยคหลัก จึงเป็น peaking (พุ่งถึงจุดสูงสุด)'),
          t(' '),
          sel('gb3-o2b', ['sharply', 'faintly', 'evenly'], 'sharply', 'word-choice', 'จุดสูงสุดพุ่งขึ้นแรง ใช้ sharply; faintly/evenly ขัดกับภาพกราฟที่พุ่งชัน'),
          t(' '),
          sel('gb3-o2c', ['before', 'because', 'while'], 'before', 'word-choice', 'ลำดับเหตุการณ์คือพุ่งสูงก่อนแล้วค่อยตก ใช้ before บอกลำดับเวลา'),
          t(' '),
          typ('gb3-o3', 'fall', ['falling'], 'ving-clause', 'หลัง before ที่ทำหน้าที่ขยายความ ใช้รูป V-ing คือ falling'),
          t(' back slightly. '),
          sel('gb3-o4', ['Although', 'Because', 'So'], 'Although', 'transition', 'ต้องการเชื่อมความขัดแย้ง (ลดลงแต่ยังสูงกว่าเดิม) จึงใช้ Although; because บอกเหตุผล, so บอกผลลัพธ์ ไม่ตรง'),
          t(' the figure '),
          typ('gb3-o4b', 'drop', ['dropped'], 'verb-tense', 'ประธานเอกพจน์ (the figure) เล่าอดีต จึงเติม -ed เป็น dropped'),
          t(' from its peak, it '),
          typ('gb3-o5', 'remain', ['remained'], 'verb-tense', 'ประธานเอกพจน์ (it) เล่าอดีต จึงใช้ remained'),
          t(' '),
          sel('gb3-o6', ['far', 'barely', 'hardly'], 'far', 'word-choice', 'far higher = สูงกว่ามาก เข้ากับความหมายว่ายังสูงกว่าตอนเริ่ม; barely/hardly แปลว่าแทบไม่ ผิดความหมาย'),
          t(' '),
          sel('gb3-o6b', ['higher', 'high', 'highest'], 'higher', 'word-choice', 'เปรียบเทียบสองจุด (จบ vs เริ่ม) ใช้รูปเปรียบเทียบ higher; highest ใช้กับหลายสิ่ง, high เป็นรูปเดิม'),
          t(' than '),
          sel('gb3-o6c', ['at', 'in', 'on'], 'at', 'word-choice', 'at the start of the period = ณ ตอนเริ่มต้นช่วงเวลา ใช้ at กับจุดเริ่มต้น'),
          t(' the start of the period.')
        ]
      },
      {
        id: 'gb3-body1',
        role: 'body1',
        labelTh: ROLE_LABEL_TH.body1,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('Starting in 2014 '),
          sel('gb3-b0c', ['at', 'in', 'by'], 'at', 'word-choice', 'starting at 4 million = เริ่มต้นที่ระดับ 4 ล้าน ใช้ at กับค่าตัวเลข'),
          t(' '),
          sel('gb3-b0', ['only', 'nearly', 'above'], 'only', 'word-choice', 'only 4 million เน้นว่าตัวเลขน้อยมาก; nearly/above ทำให้ตัวเลข 4 ล้านคลาดเคลื่อน จึงผิด'),
          t(' 4 million, the '),
          sel('gb3-b0b', ['number', 'amount', 'quantity'], 'number', 'paraphrase', 'คนนับได้ ใช้ number of; amount ใช้กับสิ่งนับไม่ได้ จึงผิด'),
          t(' of home '),
          sel('gb3-b0d', ['workers', 'worker', 'working'], 'workers', 'word-choice', 'home workers = คนทำงานที่บ้าน (พหูพจน์นับได้) จึงเติม -s เป็น workers'),
          t(' '),
          typ('gb3-b1', 'increase', ['increased'], 'verb-tense', 'ประธานพหูพจน์-เชิงจำนวน เล่าอดีต ใช้ increased'),
          t(' '),
          sel('gb3-b2', ['gradually', 'sharply', 'endlessly'], 'gradually', 'word-choice', 'ช่วงนี้โตช้า (4 ไป 7 ล้าน) จึงเป็น gradually; sharply/endlessly เว่อร์เกินข้อมูล'),
          t(', '),
          typ('gb3-b3', 'rise', ['rising'], 'ving-clause', 'ใช้ V-ing clause บอกผลของการเปลี่ยนแปลง จึงเป็น rising'),
          t(' '),
          sel('gb3-b3b', ['to', 'at', 'by'], 'to', 'word-choice', 'rising to 7 million = ขึ้นไปถึงระดับ 7 ล้าน ใช้ to กับปลายทางตัวเลข'),
          t(' 7 million '),
          sel('gb3-b3c', ['by', 'in', 'until'], 'by', 'word-choice', 'by 2018 = ภายในปี 2018 บอกกำหนดเวลาที่ไปถึงระดับนั้น เหมาะที่สุด'),
          t(' 2018, '),
          sel('gb3-b4', ['although', 'because', 'so'], 'although', 'transition', 'ถึงตัวเลขจะเพิ่มแต่โตน้อย จึงเชื่อมแบบขัดแย้งด้วย although; because (เพราะ)/so (ดังนั้น) ผิดความหมาย'),
          t(' the '),
          sel('gb3-b4c', ['growth', 'grow', 'grew'], 'growth', 'word-choice', 'ตำแหน่งนี้ต้องเป็นคำนาม (ประธาน) จึงใช้ growth; grow/grew เป็นคำกริยา ผิดหน้าที่'),
          t(' during this '),
          sel('gb3-b4b', ['period', 'moment', 'season'], 'period', 'word-choice', 'พูดถึงช่วงเวลาในกราฟ ใช้ period; moment (ชั่วขณะ)/season (ฤดู) ไม่ตรง'),
          t(' '),
          typ('gb3-b5', 'stay', ['stayed'], 'verb-tense', 'ประธานเอกพจน์ (the growth) เล่าอดีต ใช้ stayed'),
          t(' fairly '),
          sel('gb3-b6', ['small', 'huge', 'rapid'], 'small', 'word-choice', 'การเติบโตช่วงนี้น้อย จึงเป็น small; huge/rapid ขัดกับข้อมูลที่ขึ้นแค่ 3 ล้าน'),
          t(', '),
          typ('gb3-b7', 'account', ['accounting'], 'ving-clause', 'ใช้ V-ing clause ขยายความต่อ จึงเป็น accounting (for = คิดเป็น)'),
          t(' '),
          sel('gb3-b7b', ['for', 'to', 'of'], 'for', 'word-choice', 'account for = คิดเป็น/เท่ากับ เป็นคำกริยาวลีตายตัวต้องใช้ for'),
          t(' a rise of just '),
          sel('gb3-b8', ['3 million', '3 percent', '3 dollars'], '3 million', 'word-choice', '4 ล้านไป 7 ล้าน = เพิ่ม 3 ล้าน หน่วยต้องเป็น million ตามกราฟ'),
          t('.')
        ]
      },
      {
        id: 'gb3-body2',
        role: 'body2',
        labelTh: ROLE_LABEL_TH.body2,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('From 2018 '),
          sel('gb3-c0', ['onwards', 'forwards', 'ahead'], 'onwards', 'word-choice', 'from 2018 onwards = ตั้งแต่ปี 2018 เป็นต้นไป เป็นสำนวนบอกช่วงเวลาที่ถูกต้อง'),
          t(', '),
          sel('gb3-c0b', ['the figure', 'a figure', 'figures'], 'the figure', 'referencing', 'อ้างถึงตัวเลขที่พูดถึงแล้ว ใช้ the figure (มี the); a figure หมายถึงตัวเลขใหม่ที่ยังไม่เคยพูดถึง'),
          t(' '),
          typ('gb3-c1', 'rise', ['rose'], 'verb-tense', 'ประธานเอกพจน์ (the figure) เล่าอดีต กริยา rise เปลี่ยนรูปเป็น rose'),
          t(' '),
          sel('gb3-c2', ['dramatically', 'faintly', 'slowly'], 'dramatically', 'word-choice', 'ช่วงนี้พุ่งแรงจาก 7 ไป 21 ล้าน ใช้ dramatically; faintly/slowly ขัดกับข้อมูล'),
          t(', '),
          typ('gb3-c3', 'peak', ['peaking'], 'ving-clause', 'ใช้ V-ing clause บอกจุดสูงสุด จึงเป็น peaking'),
          t(' '),
          sel('gb3-c3b', ['at', 'to', 'on'], 'at', 'word-choice', 'peaking at 21 million = ขึ้นถึงจุดสูงสุดที่ระดับ 21 ล้าน ใช้ at กับตัวเลขจุดสูงสุด'),
          t(' 21 million '),
          sel('gb3-c3g', ['in', 'at', 'on'], 'in', 'word-choice', 'บอกปี ใช้ in 2020; at ใช้กับเวลานาฬิกา, on ใช้กับวัน'),
          t(' 2020. This '),
          typ('gb3-c3c', 'be', ['was'], 'verb-tense', 'ประธานเอกพจน์ (This) เล่าอดีต ใช้ was'),
          t(' the '),
          sel('gb3-c3f', ['highest', 'higher', 'high'], 'highest', 'word-choice', 'จุดสูงสุดในบรรดาทุกปี ใช้รูป superlative highest; higher เป็นการเปรียบเทียบสองสิ่ง, high เป็นรูปเดิม'),
          t(' point '),
          sel('gb3-c3h', ['on', 'at', 'in'], 'on', 'word-choice', 'on the chart = บนกราฟ ใช้ on กับพื้นผิวของกราฟ/แผนภูมิ'),
          t(' the chart, '),
          sel('gb3-c3d', ['more', 'less', 'fewer'], 'more', 'word-choice', 'บอกว่าสูงกว่าห้าเท่า จึงใช้ more than five times; less/fewer ผิดความหมาย'),
          t(' than five times the '),
          sel('gb3-c3e', ['figure', 'figures', 'number'], 'figure', 'referencing', 'อ้างถึงตัวเลขเอกพจน์ตัวเดียว ใช้ figure; figures เป็นพหูพจน์ ไม่ตรง'),
          t(' recorded in 2014. '),
          sel('gb3-c4b', ['While', 'Because', 'So'], 'While', 'transition', 'While ใช้เปิดประโยคเปรียบเทียบสองภาพที่เกิดคู่กัน (การระบาดคลี่คลาย แต่ตัวเลขยังสูง) ตามกฎ TIMELINE ส่วน Because/So บอกเหตุผล-ผลลัพธ์ ไม่ใช่การเปรียบเทียบ'),
          t(' the pandemic '),
          typ('gb3-c4c', 'ease', ['eased'], 'verb-tense', 'ประธานเอกพจน์ (the pandemic) เล่าอดีต ใช้ eased'),
          t(', it then '),
          typ('gb3-c5', 'decline', ['declined'], 'verb-tense', 'ประธานเอกพจน์ (it) เล่าอดีต ใช้ declined'),
          t(' '),
          sel('gb3-c5b', ['steadily', 'wildly', 'randomly'], 'steadily', 'word-choice', 'ลดลงอย่างสม่ำเสมอ ใช้ steadily; wildly/randomly สื่อความไม่แน่นอน ไม่ตรงข้อมูล'),
          t(' '),
          sel('gb3-c5c', ['to', 'at', 'into'], 'to', 'word-choice', 'declined to 16 million = ลดลงไปถึงระดับ 16 ล้าน ใช้ to กับปลายทางตัวเลข'),
          t(' 16 million '),
          sel('gb3-c5d', ['by', 'in', 'since'], 'by', 'word-choice', 'by 2024 = ภายในปี 2024 บอกกำหนดเวลาที่ตัวเลขลงมาถึงระดับนั้น'),
          t(' 2024, '),
          typ('gb3-c5e', 'remain', ['remaining'], 'ving-clause', 'ใช้ V-ing clause ขยายความต่อ จึงเป็น remaining (ยังคงอยู่)'),
          t(' well '),
          sel('gb3-c5f', ['above', 'below', 'under'], 'above', 'word-choice', 'ยังสูงกว่าระดับเริ่มต้น ใช้ above (เหนือกว่า); below/under แปลว่าต่ำกว่า ผิดความหมาย'),
          t(' the starting level. '),
          sel('gb3-c6', ['This figure', 'These figure', 'This figures'], 'This figure', 'referencing', 'อ้างถึงตัวเลขเอกพจน์ (16 ล้าน) ใช้ This figure ให้ประธานกับ verb สอดคล้องกัน'),
          t(' '),
          typ('gb3-c6b', 'be', ['was'], 'verb-tense', 'ประธานเอกพจน์ (This figure) เล่าอดีต ใช้ was'),
          t(' still '),
          sel('gb3-c6c', ['four times', 'four time', 'fourth times'], 'four times', 'word-choice', 'four times = สี่เท่า ใช้ times (พหูพจน์) เสมอในสำนวนบอกจำนวนเท่า'),
          t(' '),
          sel('gb3-c7', ['that', 'those', 'it'], 'that', 'referencing', 'เปรียบเทียบกับ "ตัวเลขของปี 2014" แทนคำนามเอกพจน์ด้วย that of; those เป็นพหูพจน์, it ไม่ใช้เปรียบเทียบแบบนี้'),
          t(' '),
          sel('gb3-c7b', ['recorded', 'recording', 'record'], 'recorded', 'word-choice', 'ตัวเลขถูกบันทึก (ถูกกระทำ) ใช้ V3 แบบ reduced passive clause คือ recorded'),
          t(' in 2014.')
        ]
      }
    ]
  },

{
    id: 'gb-electric-bicycles',
    promptId: 'timeline-electric-bicycles',
    steps: [
      {
        id: 'gb4-intro',
        role: 'intro',
        labelTh: ROLE_LABEL_TH.intro,
        hintTh: HINT_PARAPHRASE,
        segments: [
          t('The bar chart '),
          sel('gb4-i1', ['shows', 'suggests', 'hopes'], 'shows', 'paraphrase', 'shows = แสดง/นำเสนอข้อมูลในกราฟ ส่วน suggest (บอกเป็นนัย/แนะนำ) และ hope (หวัง) ไม่ใช่การนำเสนอข้อมูลตรงๆ'),
          t(' the '),
          sel('gb4-i2', ['amount', 'percentage', 'share'], 'amount', 'paraphrase', 'หน่วยเป็นเงิน ($ million) จึงใช้ amount ส่วน percentage/share ใช้กับสัดส่วน % ซึ่งไม่ตรงกับข้อมูล'),
          t(' of money '),
          typ('gb4-i3', 'spend', ['spent'], 'v3-clause', 'ใช้ V3 (spent) แบบ passive ลดรูปขยาย money ที่ "ถูกใช้จ่าย" ไปกับห้องสมุด'),
          t(' on public libraries, '),
          sel('gb4-i4', ['measured', 'measuring', 'measure'], 'measured', 'word-choice', 'ใช้ V3 measured เป็น passive ขยายว่า "ถูกวัด" เป็นล้านดอลลาร์ ส่วน measuring เป็น active จึงไม่เข้ากับความหมาย'),
          t(' in '),
          sel('gb4-i5', ['millions', 'million', 'millionth'], 'millions', 'word-choice', 'สำนวน in millions of dollars (หลักล้าน) ต้องเติม s เป็นพหูพจน์เสมอ'),
          t(' of dollars, over a '),
          sel('gb4-i8', ['ten-year', 'five-year', 'twenty-year'], 'ten-year', 'word-choice', 'ช่วง 2014–2024 ห่างกัน 10 ปี จึงใช้ ten-year ส่วนตัวเลือกอื่นนับปีผิด'),
          t(' period '),
          sel('gb4-i6', ['from', 'until', 'above'], 'from', 'word-choice', 'over a … period from X to Y ต้องใช้ from คู่กับ to เสมอ ส่วน until/above ไม่เข้าโครงสร้างนี้'),
          t(' 2014 '),
          sel('gb4-i7', ['to', 'and', 'by'], 'to', 'word-choice', 'from จับคู่กับ to เสมอ (from 2014 to 2024) ไม่ใช้ from ... and'),
          t(' 2024.')
        ]
      },
      {
        id: 'gb4-overview',
        role: 'overview',
        labelTh: ROLE_LABEL_TH.overview,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('Overall, it can be clearly observed that the '),
          sel('gb4-o1', ['amount', 'percentage', 'rate'], 'amount', 'paraphrase', 'พูดถึงจำนวนเงิน จึงใช้ amount ส่วน percentage/rate ต้องเป็น % ซึ่งไม่ตรงกับข้อมูล'),
          t(' of money spent on public libraries '),
          sel(
            'gb4-o2',
            ['showed a continuous downward trend', 'showed a continuous upward trend', 'fluctuated', 'remained unchanged over the given period'],
            'showed a continuous downward trend',
            'trend-phrase',
            'กราฟลดลงตลอดทั้งช่วงจึงเป็น downward trend ส่วน upward (ขาขึ้น), fluctuated (ขึ้นๆลงๆ) และ remained unchanged (ไม่เปลี่ยน) ผิดทิศ'
          ),
          t(' '),
          sel('gb4-o2b', ['throughout', 'against', 'below'], 'throughout', 'word-choice', 'throughout the period = ตลอดทั้งช่วง ส่วน against/below ไม่เข้ากับการบอกช่วงเวลา'),
          t(' the period, '),
          typ('gb4-o3', 'reach', ['reaching'], 'ving-clause', 'ใช้ V-ing (reaching) เป็น result clause บอกผลลัพธ์ที่ตามมาของแนวโน้มขาลง'),
          t(' its '),
          sel('gb4-o4', ['lowest', 'highest', 'average'], 'lowest', 'word-choice', 'ยอดใช้จ่ายลดลงจนต่ำสุดในปีสุดท้าย จึงใช้ lowest (ต่ำสุด) ไม่ใช่ highest/average'),
          t(' point by the end of the given period.')
        ]
      },
      {
        id: 'gb4-body1',
        role: 'body1',
        labelTh: ROLE_LABEL_TH.body1,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('Starting in 2014 '),
          sel('gb4-b1', ['at', 'in', 'on'], 'at', 'word-choice', 'บอกระดับตัวเลข ณ จุดหนึ่งใช้ at (at $95 million) ไม่ใช้ in/on'),
          t(' $95 million, the '),
          sel('gb4-b1b', ['amount', 'number', 'percentage'], 'amount', 'word-choice', 'เงินนับไม่ได้ ใช้ amount of money; number ใช้กับสิ่งนับได้ และ percentage ใช้กับ %'),
          t(' spent on libraries '),
          typ('gb4-b2', 'fall', ['fell'], 'verb-tense', 'fall เป็นกริยาผันไม่ปกติ อดีตคือ fell + เล่าอดีต'),
          t(' '),
          sel('gb4-b3', ['gradually', 'suddenly', 'weakly'], 'gradually', 'word-choice', 'กราฟค่อยๆลดลงในช่วงนี้ (95→72) จึงใช้ gradually ส่วน suddenly (ทันที) และ weakly (อ่อนแรง) ไม่ตรงลักษณะ'),
          t(' '),
          sel('gb4-b3b', ['over', 'off', 'into'], 'over', 'word-choice', 'over these years = ตลอดหลายปีนี้ ส่วน off/into ไม่เข้ากับการบอกช่วงเวลา'),
          t(' these years, '),
          typ('gb4-b4', 'drop', ['dropping'], 'ving-clause', 'ใช้ V-ing (dropping) เป็น result clause ต่อจากประโยคหลัก บอกการลดลงต่อเนื่อง'),
          t(' '),
          sel('gb4-b5', ['to', 'at', 'by'], 'to', 'word-choice', 'drop to + ตัวเลขปลายทาง (dropping to $88 million) บอกจุดที่ไปถึง'),
          t(' $88 million '),
          sel('gb4-b6', ['by', 'from', 'since'], 'by', 'word-choice', 'by 2016 = ภายในปี 2016 บอกกำหนดเวลาที่ไปถึงตัวเลขนั้น'),
          t(' 2016 and $72 million '),
          sel('gb4-b6b', ['by', 'from', 'since'], 'by', 'word-choice', 'by 2018 = ภายในปี 2018 บอกกำหนดเวลาที่ไปถึงตัวเลขนั้น'),
          t(' 2018. '),
          sel('gb4-b7', ['Although', 'Because', 'So'], 'Although', 'transition', 'Although ใช้เชื่อมความขัดแย้ง (ลดลงแต่ยังค่อนข้างช้า) ตามกฎ TIMELINE ส่วน Because/So บอกเหตุ-ผล'),
          t(' this '),
          sel('gb4-b8', ['early', 'final', 'busy'], 'early', 'word-choice', 'ช่วง 2014–2018 เป็นช่วงต้นของกราฟ จึงใช้ early ไม่ใช่ final (ท้าย) หรือ busy'),
          t(' decline '),
          typ('gb4-b9', 'be', ['was'], 'verb-tense', 'เล่าอดีต ประธานเอกพจน์ (this early decline) จึงใช้ was'),
          t(' comparatively '),
          sel('gb4-b9b', ['modest', 'severe', 'sudden'], 'modest', 'word-choice', 'ลดลงเพียง $23 million ในสี่ปี ถือว่าไม่มาก จึงใช้ modest (พอประมาณ) ไม่ใช่ severe/sudden'),
          t(', the total '),
          sel('gb4-b10', ['fall', 'rise', 'increase'], 'fall', 'word-choice', 'the total fall = การลดลงรวม (คำนาม) ตรงกับทิศทางขาลง ส่วน rise/increase ผิดทิศ'),
          t(' of $23 million already '),
          typ('gb4-b11', 'signal', ['signalled'], 'verb-tense', 'เล่าอดีต ประธานเอกพจน์ (the total fall) จึงผัน signal เป็น signalled'),
          t(' a clear downward trend '),
          sel('gb4-b12', ['for', 'to', 'of'], 'for', 'word-choice', 'a clear downward trend for the library sector = สำหรับภาคห้องสมุด เป็นสำนวนบอกขอบเขตที่เกี่ยวข้อง'),
          t(' the library sector.')
        ]
      },
      {
        id: 'gb4-body2',
        role: 'body2',
        labelTh: ROLE_LABEL_TH.body2,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('From 2018 '),
          sel('gb4-c1', ['onwards', 'backwards', 'forwards'], 'onwards', 'word-choice', 'from 2018 onwards = ตั้งแต่ปี 2018 เป็นต้นไป ส่วน backwards/forwards ไม่ใช้กับช่วงเวลาแบบนี้'),
          t(', library spending '),
          typ('gb4-c2', 'fall', ['fell'], 'verb-tense', 'fall เป็นกริยาผันไม่ปกติ อดีตคือ fell เล่าอดีต'),
          t(' far more '),
          sel('gb4-c3', ['sharply', 'gently', 'sadly'], 'sharply', 'word-choice', 'ช่วงหลังลดลงเร็วขึ้นมาก (72→40) จึงใช้ sharply ส่วน gently (ค่อยๆ) และ sadly (น่าเศร้า) ไม่ตรงลักษณะกราฟ'),
          t(', '),
          typ('gb4-c4', 'drop', ['dropping'], 'ving-clause', 'ใช้ V-ing (dropping) เป็น result clause บอกตัวเลขที่ไปถึง'),
          t(' to just $40 million '),
          sel('gb4-c5', ['by', 'in', 'on'], 'by', 'word-choice', 'by 2020 = ภายในปี 2020 บอกจุดสิ้นสุดของการเปลี่ยนแปลง'),
          t(' 2020, a fall of more than $30 million in only two years. '),
          sel('gb4-c6', ['Whereas', 'Because', 'So'], 'Whereas', 'transition', 'Whereas เปรียบเทียบสองช่วงที่ต่างกัน (ช่วงแรกลดช้า / ช่วงนี้ลดเร็ว) ตามกฎ TIMELINE ส่วน Because/So บอกเหตุ-ผล'),
          t(' the earlier decline '),
          typ('gb4-c7', 'be', ['had been'], 'verb-tense', 'เล่าเหตุการณ์ที่เกิดก่อนเหตุการณ์อื่นในอดีต จึงใช้ past perfect (had been) เพื่อบอกว่าช่วงก่อนหน้านั้นค่อยๆ ลดลง'),
          t(' comparatively gradual, this second phase '),
          typ('gb4-c8', 'see', ['saw'], 'verb-tense', 'see เป็นกริยาผันไม่ปกติ อดีตคือ saw + ประธานเอกพจน์ (this second phase) เล่าอดีต'),
          t(' spending '),
          sel('gb4-c8b', ['nearly halve', 'nearlyhalving', 'nearly halved'], 'nearly halve', 'word-choice', 'หลัง saw + กรรม (spending) ต้องใช้กริยารูป base (halve) เป็น bare infinitive ไม่ใช่halving/halved'),
          t(' within two years. The figure '),
          typ('gb4-c9', 'continue', ['continued'], 'verb-tense', 'เล่าอดีต ประธานเอกพจน์ (the figure) จึงผัน continue เป็น continued'),
          t(' to decrease afterwards, '),
          typ('gb4-c10', 'ease', ['easing'], 'ving-clause', 'ใช้ V-ing clause (easing) ขยายผลของประโยคหลัก บอกว่าตัวเลขค่อยๆ ลดลงต่อ'),
          t(' to $35 million '),
          sel('gb4-c11', ['by', 'in', 'on'], 'by', 'word-choice', 'by 2022 = ภายในปี 2022 บอกจุดที่ตัวเลขลงมาถึง'),
          t(' 2022 and '),
          typ('gb4-c12', 'finish', ['finishing'], 'ving-clause', 'ใช้ V-ing clause (finishing) ขยายผลของประโยคหลัก บอกตัวเลขปิดท้ายช่วง'),
          t(' the period at just $28 million, less than a third of the amount '),
          typ('gb4-c13', 'record', ['recorded'], 'v3-clause', 'ใช้ V3 (recorded) เป็น passive ขยาย the amount = ยอดที่ "ถูกบันทึก" ไว้ตอนต้นช่วง'),
          t(' in 2014.')
        ]
      }
    ]
  },

{
    id: 'gb-smart-tvs',
    promptId: 'timeline-smart-tvs',
    steps: [
      {
        id: 'gb5-intro',
        role: 'intro',
        labelTh: ROLE_LABEL_TH.intro,
        hintTh: HINT_PARAPHRASE,
        segments: [
          t('The table '),
          sel('gb5-i1', ['illustrates', 'believes', 'guesses'], 'illustrates', 'paraphrase', 'illustrate = แสดง/บรรยายข้อมูลในตาราง ส่วน believe (เชื่อ) และ guess (เดา) เป็นการกระทำของคน ใช้บรรยายตารางไม่ได้'),
          t(' the '),
          sel('gb5-i2', ['proportion', 'amount', 'total'], 'proportion', 'paraphrase', 'proportion (สัดส่วน) ใช้กับหน่วยเป็น % ได้ ส่วน amount ใช้กับสิ่งที่นับไม่ได้ และ total (ยอดรวม) ไม่ใช่ความหมายของ % ที่โจทย์ให้'),
          t(' of '),
          sel('gb5-i3', ['households', 'houseworks', 'housings'], 'households', 'paraphrase', 'household = ครัวเรือน เป็นคำที่โจทย์พูดถึง ส่วน housework (งานบ้าน) และ housing (ที่อยู่อาศัย) คนละความหมาย'),
          t(' that '),
          typ('gb5-i4', 'own', ['owned'], 'verb-tense', 'เล่าข้อมูลอดีต (2014–2024) จึงผัน own เป็นอดีต owned'),
          t(' a smart TV '),
          sel('gb5-i9', ['compared', 'comparing', 'compare'], 'compared', 'word-choice', 'compared with = เมื่อเทียบกับ ใช้ V3 (compared) ในโครงสร้างลดรูป passive ส่วน comparing/compare ทำให้โครงสร้างผิด'),
          t(' '),
          sel('gb5-i10', ['with', 'to which', 'of'], 'with', 'word-choice', 'compared with = เปรียบเทียบระหว่างสองกลุ่ม เป็นสำนวนคู่ compared + with ส่วนตัวเลือกอื่นไม่เข้าโครงสร้าง'),
          t(' those that '),
          typ('gb5-i11', 'own', ['owned'], 'verb-tense', 'อนุประโยค that ต้องมีกริยาแท้เป็นอดีตให้ขนานกับ owned'),
          t(' a laptop or a desktop computer, over a '),
          sel('gb5-i8', ['ten-year', 'five-year', 'twenty-year'], 'ten-year', 'word-choice', 'ช่วง 2014–2024 ห่างกัน 10 ปี จึงใช้ ten-year ส่วนตัวเลือกอื่นนับปีผิด'),
          t(' period '),
          sel('gb5-i5', ['from', 'onto', 'past'], 'from', 'word-choice', 'over a … period from X to Y ต้องใช้ from คู่กับ to เสมอ ส่วน onto/past ไม่เข้าโครงสร้างนี้'),
          t(' 2014 '),
          sel('gb5-i6', ['to', 'until', 'since'], 'to', 'word-choice', 'from…to ต้องคู่กับ to เสมอ ส่วน until/since ไม่เข้าโครงสร้างนี้'),
          t(' 2024.')
        ]
      },
      {
        id: 'gb5-overview',
        role: 'overview',
        labelTh: ROLE_LABEL_TH.overview,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel('gb5-o1', ['Overall', 'For instance', 'In return'], 'Overall', 'transition', 'Overall = เปิดย่อหน้า Overview เพื่อสรุปภาพรวม ส่วน For instance (ยกตัวอย่าง) และ In return (ตอบแทน) ไม่ใช่คำสรุป'),
          t(', it can be clearly observed that smart TV ownership '),
          sel(
            'gb5-o2',
            ['showed an upward trend', 'showed a downward trend', 'fluctuated', 'remained unchanged over the given period'],
            'showed an upward trend',
            'trend-phrase',
            'สัดส่วนสมาร์ททีวีเพิ่มขึ้นตลอดช่วง จึงเป็น upward trend (ขาขึ้น) ไม่ใช่ downward (ขาลง) fluctuate (ขึ้นๆลงๆ) หรือ unchanged (ไม่เปลี่ยน)'
          ),
          t(' '),
          sel('gb5-o2b', ['while', 'because', 'so that'], 'while', 'transition', 'while ใช้เปรียบเทียบสองทิศทางตรงข้ามในประโยคเดียว (สมาร์ททีวีขึ้น / เดสก์ท็อปลง) ส่วน because/so that บอกเหตุผล/จุดประสงค์'),
          t(' desktop computer ownership '),
          sel(
            'gb5-o3',
            ['showed a downward trend', 'showed an upward trend', 'fluctuated', 'remained unchanged over the given period'],
            'showed a downward trend',
            'trend-phrase',
            'สัดส่วนเดสก์ท็อปลดลงตลอดช่วง จึงเป็น downward trend (ขาลง) ไม่ใช่ upward (ขาขึ้น) fluctuate (ขึ้นๆลงๆ) หรือ unchanged (ไม่เปลี่ยน)'
          ),
          t(' over the given period, '),
          typ('gb5-o4', 'result', ['resulting'], 'ving-clause', 'ใช้ V-ing clause (resulting) ขยายผลลัพธ์ต่อเนื่องจากประโยคหลัก'),
          t(' in smart TVs '),
          typ('gb5-o5', 'overtake', ['overtaking'], 'ving-clause', 'ใช้ V-ing clause (overtaking) ขยายผลของประโยคหลัก บอกว่าสมาร์ททีวี "แซง" เดสก์ท็อปไปแล้ว'),
          t(' desktop computers to become the '),
          sel('gb5-o6', ['most', 'more', 'much'], 'most', 'word-choice', 'เทียบกับสามอุปกรณ์ (สมาร์ททีวี แล็ปท็อป เดสก์ท็อป) ใช้ขั้นสุด most ไม่ใช่ more (ขั้นกว่า)'),
          t(' common device '),
          sel('gb5-o7', ['by', 'in', 'on'], 'by', 'word-choice', 'ใช้ by the end of… (ภายในตอนสิ้นสุด) ส่วน in/on ไม่เข้ากับ the end of the period'),
          t(' the end of the period, '),
          sel('gb5-o8', ['whereas', 'however', 'meanwhile'], 'whereas', 'transition', 'whereas เชื่อมความต่างของอุปกรณ์ที่สาม (แล็ปท็อป) กับสองอุปกรณ์ข้างต้น ตามกฎ TIMELINE ส่วน however/meanwhile ห้ามใช้เป็นตัวเชื่อมในคลาสนี้'),
          t(' laptop ownership '),
          typ('gb5-o9', 'stay', ['stayed'], 'verb-tense', 'เล่าอดีต ประธานเอกพจน์ (laptop ownership) จึงผัน stay เป็น stayed'),
          t(' comparatively stable throughout.')
        ]
      },
      {
        id: 'gb5-body1',
        role: 'body1',
        labelTh: ROLE_LABEL_TH.body1,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('Starting in 2014, desktop computers '),
          typ('gb5-b1', 'be', ['were'], 'verb-tense', 'ประธานพหูพจน์ (desktop computers) + เล่าอดีต จึงใช้ were'),
          t(' the '),
          sel('gb5-b2', ['most', 'more', 'much'], 'most', 'word-choice', 'เทียบกับสามอุปกรณ์ ใช้ขั้นสุด most ไม่ใช่ more (ขั้นกว่า)'),
          t(' common device, '),
          typ('gb5-b3', 'own', ['owned'], 'v3-clause', 'ใช้ V3 (owned) แบบ passive ลดรูปขยาย desktop computers ที่ "ถูกครอบครอง" โดย 58% ของครัวเรือน'),
          t(' by 58% of households, '),
          sel('gb5-b4', ['compared with', 'compared to', 'comparing with'], 'compared with', 'word-choice', 'compared with = เมื่อเทียบกับ เป็นสำนวนคู่ที่ถูก ส่วน compared to ไม่นิยมเท่า และ comparing with ผิดรูปกริยา'),
          t(' 42% for laptops and just 12% for smart TVs. '),
          sel('gb5-b5', ['Although', 'Because', 'Therefore'], 'Although', 'transition', 'Although ใช้เชื่อมความขัดแย้ง (สมาร์ททีวีโตเร็วแต่ยังตามหลัง) ตามกฎ TIMELINE ส่วน Because/Therefore เป็นเหตุ-ผล'),
          t(' smart TV ownership '),
          typ('gb5-b6', 'climb', ['climbed'], 'verb-tense', 'เล่าอดีต ประธานเอกพจน์ (smart TV ownership) จึงผัน climb เป็น climbed'),
          t(' '),
          sel('gb5-b7', ['steadily', 'slightly', 'randomly'], 'steadily', 'word-choice', 'ยอดเพิ่มขึ้นสม่ำเสมอ (12%→24%→39%) จึงใช้ steadily ไม่ใช่ slightly (เล็กน้อย) หรือ randomly (สุ่ม)'),
          t(' to 24% in 2016 and 39% by 2018, it still '),
          typ('gb5-b8', 'lag', ['lagged'], 'verb-tense', 'เล่าอดีต ประธานเอกพจน์ (it) จึงผัน lag เป็น lagged'),
          t(' behind both laptops, '),
          sel('gb5-b9', ['which', 'who', 'where'], 'which', 'referencing', 'which ใช้แทนสิ่งของ (laptops) ส่วน who ใช้กับคน และ where ใช้กับสถานที่'),
          t(' '),
          typ('gb5-b10', 'reach', ['reached'], 'verb-tense', 'เล่าอดีต ประธานเอกพจน์ (which อ้างถึง laptops) จึงผัน reach เป็น reached'),
          t(' 54%, and desktops, which '),
          typ('gb5-b11', 'remain', ['remained'], 'verb-tense', 'เล่าอดีต ประธานเอกพจน์ (which อ้างถึง desktops) จึงผัน remain เป็น remained'),
          t(' the '),
          sel('gb5-b12', ['leader', 'leading', 'lead'], 'leader', 'word-choice', 'ต้องการคำนาม leader (ผู้นำ) หลัง the ส่วน leading (adj/V-ing) และ lead (v) ไม่เข้ากับตำแหน่งนี้'),
          t(' at 44%, in the same year.')
        ]
      },
      {
        id: 'gb5-body2',
        role: 'body2',
        labelTh: ROLE_LABEL_TH.body2,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('From 2018 '),
          sel('gb5-c1', ['onwards', 'backwards', 'sideways'], 'onwards', 'word-choice', 'from 2018 onwards = ตั้งแต่ปี 2018 เป็นต้นไป ส่วน backwards/sideways (ถอยหลัง/ด้านข้าง) ไม่ใช้บอกเวลา'),
          t(', smart TV ownership '),
          typ('gb5-c2', 'climb', ['climbed'], 'verb-tense', 'เล่าอดีต ประธานเอกพจน์ (smart TV ownership) จึงผัน climb เป็น climbed'),
          t(' dramatically, '),
          typ('gb5-c3', 'overtake', ['overtaking'], 'ving-clause', 'ใช้ V-ing clause (overtaking) ขยายผลของประโยคหลัก บอกว่าสมาร์ททีวี "แซง" เดสก์ท็อปไปในช่วงนี้'),
          t(' desktop computers by 2020, when the figure for smart TVs '),
          typ('gb5-c4', 'reach', ['reached'], 'verb-tense', 'เล่าอดีต ประธานเอกพจน์ (the figure) จึงผัน reach เป็น reached'),
          t(' 55% against just 35% for desktops. '),
          sel('gb5-c5', ['Whereas', 'Because', 'So'], 'Whereas', 'transition', 'Whereas เปรียบเทียบสองทิศทางตรงข้าม (สมาร์ททีวียังพุ่งต่อ / เดสก์ท็อปยังร่วงต่อ) ตามกฎ TIMELINE ส่วน Because/So บอกเหตุ-ผล'),
          t(' smart TV ownership '),
          typ('gb5-c6', 'continue', ['continued'], 'verb-tense', 'เล่าอดีต ประธานเอกพจน์ (smart TV ownership) จึงผัน continue เป็น continued'),
          t(' to climb, '),
          typ('gb5-c7', 'reach', ['reaching'], 'ving-clause', 'ใช้ V-ing clause (reaching) ขยายผลของประโยคหลัก บอกว่ายอดขึ้นไปถึงเท่าไร'),
          t(' 68% in 2022 and 76% by 2024 and eventually '),
          typ('gb5-c8', 'overtake', ['overtaking'], 'ving-clause', 'ใช้ V-ing clause (overtaking) ขยายผลต่อเนื่อง บอกว่าสมาร์ททีวีแซงแล็ปท็อปด้วยในช่วงหลัง'),
          t(' laptops as well, desktop ownership '),
          typ('gb5-c9', 'keep', ['kept'], 'verb-tense', 'keep เป็นกริยาผันไม่ปกติ อดีตคือ kept + ประธานเอกพจน์ เล่าอดีต'),
          t(' '),
          typ('gb5-c10', 'fall', ['falling'], 'ving-clause', 'keep + V-ing = ทำต่อเนื่อง จึงใช้ falling ไม่ใช่รูปอื่น'),
          t(' to a low of 22%, while laptop ownership '),
          typ('gb5-c11', 'creep', ['crept'], 'verb-tense', 'creep เป็นกริยาผันไม่ปกติ อดีตคือ crept + ประธานเอกพจน์ เล่าอดีต'),
          t(' up only slightly, '),
          typ('gb5-c12', 'end', ['ending'], 'ving-clause', 'ใช้ V-ing clause (ending) ขยายผลของประโยคหลัก สรุปตัวเลขปิดท้ายช่วง'),
          t(' the period at 64%.')
        ]
      }
    ]
  },

{
    id: 'gb-online-shopping-3country',
    promptId: 'timeline-online-shopping-3country',
    steps: [
      {
        id: 'gb6-intro',
        role: 'intro',
        labelTh: ROLE_LABEL_TH.intro,
        hintTh: HINT_PARAPHRASE,
        segments: [
          t('The line graph '),
          sel('gb6-i1', ['compares', 'promises', 'assumes'], 'compares', 'paraphrase', 'compares = เปรียบเทียบข้อมูลหลายประเทศในกราฟเดียว ใช้เมื่อมีหลายเส้นเทียบกัน ส่วน promise (สัญญา) และ assume (สันนิษฐาน) เป็นการกระทำของคน ใช้กับกราฟไม่ได้'),
          t(' the average monthly '),
          sel('gb6-i2', ['amount', 'percentage', 'number'], 'amount', 'paraphrase', 'ข้อมูลเป็นเงิน (US$) จึงใช้ amount ส่วน percentage ใช้กับ % และ number ใช้กับจำนวนนับคน/ชิ้น'),
          t(' '),
          sel('gb6-i4', ['spent', 'made', 'bought'], 'spent', 'word-choice', 'amount spent = จำนวนเงินที่ถูกใช้จ่าย เป็น collocation ที่ถูก ส่วน made/bought ไม่เข้ากับ amount'),
          t(' on online shopping by adults, over a '),
          sel('gb6-i16', ['ten-year', 'five-year', 'twenty-year'], 'ten-year', 'word-choice', 'ช่วง 2014–2024 ห่างกัน 10 ปี จึงใช้ ten-year ส่วนตัวเลือกอื่นนับปีผิด'),
          t(' period '),
          sel('gb6-i6', ['from', 'along', 'toward'], 'from', 'word-choice', 'over a … period from X to Y ต้องใช้ from คู่กับ to เสมอ ส่วน along/toward ไม่เข้าโครงสร้างนี้'),
          t(' 2014 '),
          sel('gb6-i7', ['to', 'until', 'against'], 'to', 'word-choice', 'from…to ต้องคู่กับ to เสมอ ส่วน until/against ไม่เข้าคู่กับ from ในการบอกช่วงปี'),
          t(' 2024, in the UK, the USA '),
          sel('gb6-i13', ['and', 'but', 'or'], 'and', 'word-choice', 'เป็นการไล่รายชื่อประเทศ จึงใช้ and เชื่อม ส่วน but (แต่) และ or (หรือ) ให้ความหมายผิด'),
          t(' Australia.')
        ]
      },
      {
        id: 'gb6-overview',
        role: 'overview',
        labelTh: ROLE_LABEL_TH.overview,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('Overall, it can be clearly observed that online shopping in Australia '),
          sel(
            'gb6-o1',
            ['showed a strong upward trend', 'showed a downward trend', 'fluctuated', 'remained unchanged over the given period'],
            'showed a strong upward trend',
            'trend-phrase',
            'ออสเตรเลียเพิ่มขึ้นตลอดช่วงอย่างชัดเจน จึงเป็น upward trend (ขาขึ้น) ไม่ใช่ downward/fluctuate/remain unchanged'
          ),
          t(' throughout the period, '),
          typ('gb6-o1b', 'overtake', ['overtaking'], 'ving-clause', 'ใช้ V-ing clause (overtaking) ขยายผลของประโยคหลัก บอกว่าออสเตรเลีย "แซง" อีกสองประเทศไปแล้ว'),
          t(' both the UK and the USA at around the '),
          sel('gb6-o2', ['midpoint', 'endpoint', 'outset'], 'midpoint', 'word-choice', 'ออสเตรเลียแซงทั้งสองประเทศราวกลางช่วงเวลา จึงใช้ midpoint ส่วน endpoint (จุดจบ) และ outset (จุดเริ่ม) ผิดตำแหน่ง'),
          t(', '),
          sel('gb6-o3', ['while', 'because', 'so that'], 'while', 'transition', 'while ใช้เปรียบเทียบสองทิศทางตรงข้ามในประโยคเดียว (ออสเตรเลียขึ้น / สหรัฐฯ ลง) ส่วน because/so that บอกเหตุผล/จุดประสงค์'),
          t(' the USA '),
          sel(
            'gb6-o4',
            ['showed a slight downward trend', 'showed a strong upward trend', 'fluctuated', 'remained unchanged over the given period'],
            'showed a slight downward trend',
            'trend-phrase',
            'ตัวเลขสหรัฐฯ ขึ้นไปสูงสุดแล้วค่อยๆ ลดลงจนจบช่วง จึงเป็น downward trend (ขาลงเล็กน้อย) ไม่ใช่ upward/fluctuate/unchanged'
          ),
          t(' '),
          sel('gb6-o5', ['after', 'before', 'since'], 'after', 'word-choice', 'after an early peak = หลังจากขึ้นไปสูงสุดในช่วงต้น ส่วน before/since ไม่เข้ากับลำดับเหตุการณ์นี้'),
          t(' an early peak, and the UK '),
          typ('gb6-o6', 'stay', ['stayed'], 'verb-tense', 'เล่าอดีต ประธานเอกพจน์ (the UK) จึงผัน stay เป็น stayed'),
          t(' comparatively '),
          sel('gb6-o7', ['steady', 'steadily', 'steadiness'], 'steady', 'word-choice', 'หลัง stay ต้องใช้ adjective (steady) ขยายประธาน ไม่ใช่ adverb steadily หรือ noun steadiness'),
          t(' throughout.')
        ]
      },
      {
        id: 'gb6-body1',
        role: 'body1',
        labelTh: ROLE_LABEL_TH.body1,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('Starting in 2014, the USA '),
          typ('gb6-b3', 'have', ['had'], 'verb-tense', 'เล่าอดีต ประธานเอกพจน์ (the USA) จึงผัน have เป็น had'),
          t(' the '),
          sel('gb6-b4', ['highest', 'biggest', 'widest'], 'highest', 'word-choice', 'ใช้ highest กับ figure/amount ส่วน biggest/widest ไม่ใช่คำจับคู่ปกติกับยอดใช้จ่าย'),
          t(' '),
          sel('gb6-b5', ['figure', 'percentage', 'rate'], 'figure', 'paraphrase', 'figure = ตัวเลข/ค่าสถิติ ใช้อ้างถึงยอดใช้จ่ายในกราฟ ส่วน percentage ใช้กับ % และ rate หมายถึงอัตรา'),
          t(', at $55, '),
          typ('gb6-b6', 'follow', ['followed'], 'v3-clause', 'โครงสร้าง followed by (V3) แปลว่า "ตามมาด้วย" ใช้ไล่อันดับ'),
          t(' by the UK at $45 and Australia at just $22, '),
          sel('gb6-b8', ['respectively', 'especially', 'namely'], 'respectively', 'word-choice', 'respectively = ตามลำดับที่กล่าว (ต้องมี comma ข้างหน้าเสมอ) ส่วน especially/namely ความหมายต่างออกไป'),
          t('. '),
          sel('gb6-c5c', ['While', 'Because', 'Unless'], 'While', 'transition', 'While เปิดประโยคเปรียบเทียบการเติบโตของสามประเทศที่เกิดพร้อมกัน ส่วน Because/Unless ให้ความหมายผิด'),
          t(' all three figures '),
          typ('gb6-b11', 'climb', ['climbed'], 'verb-tense', 'เล่าอดีต ประธานพหูพจน์ (figures) แต่ past simple ผันเหมือนกันคือ climbed'),
          t(' '),
          typ('gb6-b12', 'steady', ['steadily'], 'degree-adverb', 'ต้องการ adverb ขยายกริยา climbed จึงเติม -ly เป็น steadily (อย่างสม่ำเสมอ)'),
          t(' over the next four years, '),
          typ('gb6-b13', 'reach', ['reaching'], 'ving-clause', 'V-ing clause บอกผลลัพธ์ที่ตามมา ใช้ reaching (ไปแตะที่...)'),
          t(' $60, $52 '),
          sel('gb6-b14', ['and', 'plus', 'with'], 'and', 'word-choice', 'ไล่ตัวเลขสุดท้ายในชุดใช้ and ส่วน plus/with ไม่เป็นธรรมชาติในการไล่รายการ'),
          t(' $50 '),
          sel('gb6-b15', ['by', 'in', 'since'], 'by', 'word-choice', 'by 2018 = ภายในปี 2018 บอกจุดสิ้นสุดของการเปลี่ยนแปลง ส่วน in/since ให้ความหมายต่างออกไป'),
          t(' 2018, '),
          sel('gb6-b16', ['respectively', 'generally', 'similarly'], 'respectively', 'word-choice', 'จับคู่ตัวเลข 60/52/50 กับ USA/UK/Australia ตามลำดับ จึงใช้ respectively'),
          t(', Australia’s growth '),
          typ('gb6-b17', 'be', ['was'], 'verb-tense', 'เล่าอดีต ประธานเอกพจน์ (Australia’s growth) จึงใช้ was'),
          t(' by far the fastest of the three, '),
          typ('gb6-b18', 'narrow', ['narrowing'], 'ving-clause', 'ใช้ V-ing clause (narrowing) ขยายผลของประโยคหลัก บอกว่าออสเตรเลียไล่ตามจนช่องว่างแคบลงมาก'),
          t(' the gap with the other two countries considerably.')
        ]
      },
      {
        id: 'gb6-body2',
        role: 'body2',
        labelTh: ROLE_LABEL_TH.body2,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('From 2018 '),
          sel('gb6-c1', ['onwards', 'forward', 'ahead'], 'onwards', 'word-choice', 'from 2018 onwards = ตั้งแต่ปี 2018 เป็นต้นไป เป็นสำนวนที่ถูก ส่วน forward/ahead ไม่เข้าคู่กับ from…'),
          t(', Australia '),
          typ('gb6-c2', 'continue', ['continued'], 'verb-tense', 'เล่าอดีต past simple จึงผัน continue เป็น continued'),
          t(' to climb rapidly, '),
          typ('gb6-c3', 'overtake', ['overtaking'], 'ving-clause', 'ใช้ V-ing clause (overtaking) ขยายผลของประโยคหลัก บอกว่าออสเตรเลีย "แซง" ทั้งสองประเทศในช่วงนี้'),
          t(' both the UK and the USA by 2020, when its figure '),
          typ('gb6-c4', 'reach', ['reached'], 'verb-tense', 'เล่าอดีต ประธานเอกพจน์ (its figure) จึงผัน reach เป็น reached'),
          t(' $62 compared with $58 for the USA and $55 for the UK. '),
          sel('gb6-c5c2', ['Whereas', 'Because', 'So'], 'Whereas', 'transition', 'Whereas เปรียบเทียบสองทิศทางที่ตรงข้ามกัน (ออสเตรเลียยังพุ่งต่อ / สหรัฐฯ ร่วงต่อ) ตามกฎ TIMELINE ส่วน Because/So บอกเหตุ-ผล'),
          t(' Australia '),
          typ('gb6-c6', 'go', ['went'], 'verb-tense', 'go เป็นกริยาผันไม่ปกติ อดีตคือ went + ประธานเอกพจน์ เล่าอดีต'),
          t(' on to '),
          sel('gb6-c7', ['reach', 'reaches', 'reaching'], 'reach', 'word-choice', 'went on to + V1 (reach) เป็นโครงสร้างที่ถูก ส่วน reaches/reaching ไม่เข้ากับ to-infinitive'),
          t(' $82 by 2024, '),
          typ('gb6-c8', 'extend', ['extending'], 'ving-clause', 'ใช้ V-ing clause (extending) ขยายผลของประโยคหลัก บอกว่าออสเตรเลียนำห่างมากขึ้นไปอีก'),
          t(' its lead considerably, the USA '),
          typ('gb6-c9', 'fall', ['fell'], 'verb-tense', 'fall เป็นกริยาผันไม่ปกติ อดีตคือ fell + ประธานเอกพจน์ เล่าอดีต'),
          t(' back to $52 after its earlier peak, '),
          typ('gb6-c11', 'end', ['ending'], 'ving-clause', 'ใช้ V-ing clause (ending) ขยายผลของประโยคหลัก สรุปสถานะปิดท้ายช่วง'),
          t(' the period slightly behind the UK, '),
          sel('gb6-c16', ['which', 'who', 'where'], 'which', 'referencing', 'which ใช้แทนสิ่งของ/ประเทศ (the UK) ส่วน who ใช้กับคน และ where ใช้กับสถานที่'),
          t(' '),
          typ('gb6-c17', 'finish', ['finished'], 'verb-tense', 'เล่าอดีต ประธานเอกพจน์ (which อ้างถึง the UK) จึงผัน finish เป็น finished'),
          t(' at $53.')
        ]
      }
    ]
  },

{
    id: 'gb-social-media-4region',
    promptId: 'timeline-social-media-4region',
    steps: [
      {
        id: 'gb7-intro',
        role: 'intro',
        labelTh: ROLE_LABEL_TH.intro,
        hintTh: HINT_PARAPHRASE,
        segments: [
          t('The '),
          sel('gb7-i8', ['line graph', 'pie chart', 'table'], 'line graph', 'paraphrase', 'ข้อมูลเป็นเส้นแนวโน้มตามปี จึงเป็น line graph ส่วน pie chart (วงกลม) และ table (ตาราง) ไม่ตรงกับกราฟนี้'),
          t(' '),
          sel('gb7-i1', ['shows', 'warns', 'expects'], 'shows', 'paraphrase', 'shows = แสดงข้อมูลในกราฟ ส่วน warn (เตือน) และ expect (คาดหวัง) เป็นการกระทำของคน ใช้บรรยายกราฟไม่ได้'),
          t(' the '),
          sel('gb7-i2', ['number', 'percentage', 'amount'], 'number', 'paraphrase', 'ข้อมูลเป็นจำนวนผู้ใช้ (millions) จึงใช้ number ส่วน percentage ใช้กับ % และ amount ใช้กับเงิน'),
          t(' of people who '),
          typ('gb7-i4', 'use', ['used'], 'verb-tense', 'เล่าข้อมูลอดีต (2010–2024) จึงใช้ past simple → used'),
          t(' '),
          sel('gb7-i9', ['social media', 'social medias', 'a social media'], 'social media', 'word-choice', 'social media เป็นคำนามนับไม่ได้ ไม่เติม s และไม่ใส่ a จึงใช้ social media เฉยๆ'),
          t(', measured in millions of users, in four '),
          sel('gb7-i5', ['regions', 'reasons', 'ranges'], 'regions', 'word-choice', 'regions = ภูมิภาค ตรงกับโจทย์ ส่วน reasons (เหตุผล) และ ranges (ช่วง) ความหมายไม่ตรง'),
          t(', over a '),
          sel('gb7-i10', ['fourteen-year', 'ten-year', 'twenty-year'], 'fourteen-year', 'word-choice', 'ช่วง 2010–2024 ห่างกัน 14 ปี จึงใช้ fourteen-year ส่วนตัวเลือกอื่นนับปีผิด'),
          t(' period '),
          sel('gb7-i3', ['from', 'onto', 'beside'], 'from', 'word-choice', 'over a … period from X to Y ต้องใช้ from คู่กับ to เสมอ ส่วน onto/beside ไม่เข้าโครงสร้างนี้'),
          t(' 2010 '),
          sel('gb7-i6', ['to', 'until', 'and'], 'to', 'word-choice', 'from…to ต้องคู่กับ to เสมอ ส่วน until/and ไม่เข้าโครงสร้างนี้'),
          t(' 2024.')
        ]
      },
      {
        id: 'gb7-overview',
        role: 'overview',
        labelTh: ROLE_LABEL_TH.overview,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel('gb7-o0', ['Overall', 'Firstly', 'Because'], 'Overall', 'transition', 'Overall = โดยรวมแล้ว ใช้เปิดย่อหน้าสรุปภาพรวม ส่วน Firstly (อย่างแรก) และ Because (เพราะ) ผิดหน้าที่'),
          t(', it can be clearly observed that Asia-Pacific '),
          sel(
            'gb7-o1',
            ['showed the sharpest upward trend', 'showed a downward trend', 'fluctuated', 'remained unchanged over the given period'],
            'showed the sharpest upward trend',
            'trend-phrase',
            'Asia-Pacific เพิ่มขึ้นเร็วและมากสุดในบรรดาสี่ภูมิภาค จึงเป็น upward trend (ขาขึ้น) ที่ชันสุด ไม่ใช่ downward/fluctuate/remain unchanged'
          ),
          t(' throughout the period, '),
          typ('gb7-o1b', 'overtake', ['overtaking'], 'ving-clause', 'ใช้ V-ing clause (overtaking) ขยายผลของประโยคหลัก บอกว่า Asia-Pacific "แซง" ทั้งสองภูมิภาคไปแล้ว'),
          t(' both Latin America and Europe to become the region with the '),
          sel('gb7-o1c', ['widest', 'narrowest', 'smallest'], 'widest', 'word-choice', 'widest use = การใช้งานที่กว้างขวางที่สุด (superlative) ส่วน narrowest/smallest ให้ความหมายตรงข้าม'),
          t(' use of social media by the end of the period, '),
          sel('gb7-o2', ['whereas', 'however', 'unless'], 'whereas', 'transition', 'ในกราฟ TIMELINE ใช้ whereas เชื่อมสองทิศทางที่ต่างกัน ส่วน however ห้ามใช้เป็นตัวเชื่อมคู่ตรงข้ามในคลาสนี้ และ unless (เว้นแต่) ผิดความหมาย'),
          t(' Europe '),
          sel(
            'gb7-o3',
            ['showed a downward trend', 'showed an upward trend', 'fluctuated', 'remained unchanged over the given period'],
            'showed a downward trend',
            'trend-phrase',
            'ยุโรปขึ้นไปสูงสุดแล้วลดลงจนจบช่วง จึงเป็น downward trend (ขาลง) ไม่ใช่ upward/fluctuate/unchanged'
          ),
          t(' '),
          sel('gb7-o4', ['after', 'before', 'since'], 'after', 'word-choice', 'after peaking = หลังจากขึ้นไปสูงสุด ส่วน before/since ไม่เข้ากับลำดับเหตุการณ์นี้'),
          t(' peaking around the midpoint of the period, while North America and Latin America both '),
          typ('gb7-o5', 'show', ['showed'], 'verb-tense', 'เล่าอดีตทั้งเรียงความ ประธานพหูพจน์ + past simple → showed'),
          t(' '),
          sel('gb7-o6', ['steadier', 'steady', 'steadily'], 'steadier', 'word-choice', 'เปรียบเทียบกับ Asia-Pacific และ Europe ที่เปลี่ยนแปลงมาก จึงใช้ขั้นกว่า steadier ส่วน steady/steadily ไม่เข้ากับตำแหน่งนี้'),
          t(' upward trends throughout.')
        ]
      },
      {
        id: 'gb7-body1',
        role: 'body1',
        labelTh: ROLE_LABEL_TH.body1,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('Starting in 2010, North America '),
          typ('gb7-b1', 'have', ['had'], 'verb-tense', 'ประธานเอกพจน์ + เล่าอดีต จึงใช้ past simple → had'),
          t(' the '),
          sel('gb7-b13', ['highest', 'higher', 'high'], 'highest', 'word-choice', 'เทียบสี่ภูมิภาคต้องใช้ขั้นสูงสุด highest ส่วน higher (ขั้นกว่า) และ high (รูปธรรมดา) ผิดรูป'),
          t(' '),
          sel('gb7-b7', ['figure', 'figures', 'figuring'], 'figure', 'word-choice', 'the highest figure = ตัวเลขสูงสุด (เอกพจน์) จึงใช้ figure ส่วน figures/figuring ผิดรูป'),
          t(', at 55 million, '),
          typ('gb7-b2', 'follow', ['followed'], 'v3-clause', 'ใช้ V3 ในโครงสร้าง followed by (ถูกตามมาด้วย) เป็น passive แบบย่อ'),
          t(' by Europe at 42 million, Latin America at 25 million, '),
          sel('gb7-b8', ['and', 'but', 'nor'], 'and', 'word-choice', 'ไล่รายชื่อในลิสต์ใช้ and เชื่อมตัวสุดท้าย ส่วน but/nor ผิดความหมาย'),
          t(' Asia-Pacific at just 12 million, '),
          sel('gb7-b3', ['respectively', 'obviously', 'clearly'], 'respectively', 'word-choice', 'respectively = ตามลำดับที่กล่าว (ต้องมีคอมมาก่อนเสมอ) ส่วน obviously/clearly แปลว่าชัดเจน ไม่ตรง'),
          t('. '),
          sel('gb7-b4', ['While', 'As a result', 'Likewise'], 'While', 'transition', 'While เปิดประโยคเปรียบเทียบการเติบโตของสี่ภูมิภาคที่เกิดพร้อมกัน ส่วน As a result (ผลลัพธ์) และ Likewise (เช่นเดียวกัน) ผิดความหมาย'),
          t(' all four regions '),
          typ('gb7-c1', 'climb', ['climbed'], 'verb-tense', 'เล่าอดีต จึงใช้ past simple ของ climb → climbed'),
          t(' '),
          sel('gb7-c8', ['steadily', 'suddenly', 'sharply'], 'steadily', 'word-choice', 'ทุกภูมิภาคค่อยๆ เพิ่มอย่างสม่ำเสมอ จึงใช้ steadily ส่วน suddenly/sharply แปลว่าฉับพลัน/พุ่งแรง ไม่ตรงภาพรวม'),
          t(' over the following eight years, '),
          typ('gb7-c2', 'reach', ['reaching'], 'ving-clause', 'ใช้ V-ing clause บอกผลปลายทาง (reaching = ไปถึง) ต่อจากประโยคหลัก'),
          t(' 74 million, 70 million, 58 million '),
          sel('gb7-c9', ['and', 'or', 'nor'], 'and', 'word-choice', 'ไล่ตัวเลขในลิสต์ใช้ and เชื่อมตัวสุดท้าย ส่วน or/nor ผิดความหมาย'),
          t(' 55 million '),
          sel('gb7-c17', ['by', 'until', 'from'], 'by', 'word-choice', 'by 2018 = ภายในปี 2018 บอกจุดสิ้นสุด ส่วน until/from ไม่เข้ากับค่าปลายทางแบบนี้'),
          t(' 2018, '),
          sel('gb7-c10', ['respectively', 'separately', 'randomly'], 'respectively', 'word-choice', 'respectively = ตามลำดับที่กล่าว (มีคอมมาก่อนเสมอ) ส่วน separately/randomly ผิดความหมาย'),
          t(', Asia-Pacific’s growth '),
          typ('gb7-b17', 'be', ['was'], 'verb-tense', 'เล่าอดีต ประธานเอกพจน์ (Asia-Pacific’s growth) จึงใช้ was'),
          t(' by far the '),
          sel('gb7-c11', ['fastest', 'slowest', 'latest'], 'fastest', 'word-choice', 'Asia-Pacific เพิ่มเร็วสุด จึงใช้ fastest ส่วน slowest/latest ไม่ตรงกับข้อมูล'),
          t(', '),
          typ('gb7-c5', 'narrow', ['narrowing'], 'ving-clause', 'ใช้ V-ing clause บอกผล (narrowing = ทำให้ช่องว่างแคบลง) ต่อจากประโยคหลัก'),
          t(' the gap '),
          sel('gb7-c12', ['with', 'from', 'against'], 'with', 'word-choice', 'the gap with Latin America = ช่องว่างกับ Latin America ส่วน from/against ไม่เข้ากับสำนวนนี้'),
          t(' Latin America to just 3 million by that year.')
        ]
      },
      {
        id: 'gb7-body2',
        role: 'body2',
        labelTh: ROLE_LABEL_TH.body2,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('From 2018 '),
          sel('gb7-c7', ['onwards', 'onto', 'forward'], 'onwards', 'word-choice', 'From 2018 onwards = ตั้งแต่ 2018 เป็นต้นไป เป็นสำนวนบอกช่วงเวลา ส่วน onto/forward ไม่เข้ากับโครงสร้างนี้'),
          t(', Asia-Pacific '),
          typ('gb7-c4', 'continue', ['continued'], 'verb-tense', 'เล่าอดีต จึงใช้ past simple ของ continue → continued'),
          t(' to surge, '),
          typ('gb7-c23', 'overtake', ['overtaking'], 'ving-clause', 'ใช้ V-ing clause (overtaking) ขยายผลของประโยคหลัก บอกว่า Asia-Pacific "แซง" ไปในช่วงนี้'),
          t(' Latin America by 2020 and Europe shortly afterwards, before '),
          typ('gb7-d16', 'climb', ['climbing'], 'ving-clause', 'ใช้ V-ing clause หลัง before บอกจุดที่ไต่ขึ้นไปถึง จึงใช้ climbing'),
          t(' to 85 million by 2024 to become the '),
          sel('gb7-d21', ['highest', 'lowest', 'slowest'], 'highest', 'word-choice', 'Asia-Pacific ขึ้นไปเป็นค่าสูงสุดของทั้งสี่ภูมิภาค จึงใช้ highest ไม่ใช่ lowest/slowest'),
          t(' of all four regions. '),
          sel('gb7-d3', ['Whereas', 'Because', 'So'], 'Whereas', 'transition', 'Whereas เปรียบเทียบสองทิศทางที่ตรงข้ามกัน (Asia-Pacific/Latin America ยังขึ้น / Europe ลง) ตามกฎ TIMELINE ส่วน Because/So บอกเหตุ-ผล'),
          t(' Asia-Pacific and Latin America '),
          typ('gb7-d1', 'continue', ['continued'], 'verb-tense', 'เล่าอดีต จึงใช้ past simple ของ continue → continued'),
          t(' to climb steadily, '),
          typ('gb7-d2', 'reach', ['reaching'], 'ving-clause', 'ใช้ V-ing clause บอกผลปลายทาง (reaching = ไปถึง) ต่อจากประโยคหลัก'),
          t(' 85 million and 70 million '),
          sel('gb7-c14', ['respectively', 'obviously', 'clearly'], 'respectively', 'word-choice', 'respectively = ตามลำดับ (Asia-Pacific แล้ว Latin America) ต้องมีคอมมาก่อนเสมอ ส่วน obviously/clearly ผิดความหมาย'),
          t(' by 2024, Europe '),
          typ('gb7-c5b', 'decline', ['declined'], 'verb-tense', 'เล่าอดีต ประธานเอกพจน์ (Europe) จึงผัน decline เป็น declined'),
          t(' '),
          sel('gb7-c18', ['after peaking at 70 million in 2018', 'before peaking at 70 million in 2018', 'without peaking at 70 million in 2018'], 'after peaking at 70 million in 2018', 'word-choice', 'ยุโรปขึ้นไปสูงสุดก่อนแล้วค่อยลด จึงใช้ after peaking (หลังจากขึ้นไปสูงสุด) ส่วน before/without ผิดลำดับเหตุการณ์'),
          t(', '),
          typ('gb7-c19', 'fall', ['falling'], 'ving-clause', 'ใช้ V-ing clause (falling) ขยายผลของประโยคหลัก บอกว่ายุโรปตกลงไปเท่าไร'),
          t(' back to 63 million by the end of the period, while North America’s growth '),
          typ('gb7-c20', 'slow', ['slowed'], 'verb-tense', 'เล่าอดีต ประธานเอกพจน์ (North America’s growth) จึงผัน slow เป็น slowed'),
          t(' considerably, '),
          typ('gb7-c22', 'edge', ['edging'], 'ving-clause', 'ใช้ V-ing clause (edging) ขยายผลของประโยคหลัก บอกว่าตัวเลขค่อยๆ ขึ้นไปเพียงเล็กน้อย'),
          t(' up to just 77 million.')
        ]
      }
    ]
  },

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
          sel('gb8-i1', ['illustrate', 'argue', 'decide'], 'illustrate', 'paraphrase', 'illustrate = แสดง/บรรยายข้อมูลในกราฟ ส่วน argue (โต้แย้ง) และ decide (ตัดสินใจ) เป็นการกระทำของคน ใช้กับแผนภูมิไม่ได้'),
          t(' and '),
          sel('gb8-i2', ['compare', 'complain', 'compete'], 'compare', 'paraphrase', 'สองแผนภูมิวางคู่กันเพื่อ compare (เปรียบเทียบ) ส่วน complain (บ่น) และ compete (แข่งขัน) ผิดความหมาย'),
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
          t(', with '),
          sel('gb8-i14', ['values', 'valued', 'valuing'], 'values', 'word-choice', 'ต้องการคำนาม values (มูลค่าต่างๆ) เป็นประธานของ measured ส่วน valued/valuing เป็นรูปกริยา ไม่ใช่คำนาม'),
          t(' '),
          sel('gb8-i7', ['measured', 'guessed', 'imagined'], 'measured', 'word-choice', 'ข้อมูลถูก measured (วัด/คิดเป็น) หน่วยดอลลาร์ ส่วน guessed (เดา) และ imagined (จินตนาการ) ไม่ใช่ข้อมูลจริง'),
          t(' in '),
          sel('gb8-i8', ['millions of dollars', 'hours of work', 'days of travel'], 'millions of dollars', 'word-choice', 'หน่วยของกราฟคือล้านดอลลาร์ ส่วนชั่วโมงทำงานและวันเดินทางไม่ตรงกับข้อมูล'),
          t(', in '),
          sel('gb8-i9', ['2023', '2032', '3023'], '2023', 'word-choice', 'ปีของข้อมูลคือ 2023 ตามโจทย์ ตัวเลขอื่นเป็นการสลับตัวเลขที่ผิด'),
          t(': one chart '),
          sel('gb8-i10', ['showing', 'showed', 'shows'], 'showing', 'ving-clause', 'หลัง colon ขยายความด้วย V-ing clause จึงใช้ showing (แสดง) ส่วน showed/shows เป็นกริยาหลักที่ไม่เข้ากับโครงสร้างนี้'),
          t(' what Vietnam sold to the US, and the '),
          sel('gb8-i11', ['other', 'others', 'another'], 'other', 'word-choice', 'the other = อีกอันหนึ่ง (จากสองอัน) ส่วน others (พหูพจน์ไม่มี the นำ) และ another (อีกอันไม่เจาะจง) ผิดรูป'),
          t(' what the US sold to Vietnam.')
        ]
      },
      {
        id: 'gb8-overview',
        role: 'overview',
        labelTh: ROLE_LABEL_TH.overview,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel('gb8-o1', ['Overall', 'Suddenly', 'Randomly'], 'Overall', 'transition', 'Overall = โดยรวมแล้ว ใช้เปิดย่อหน้าสรุปภาพรวม ส่วน Suddenly (ทันใด) และ Randomly (สุ่ม) ไม่ใช่คำสรุป'),
          t(', it can be clearly observed that coffee '),
          typ('gb8-o2', 'account', ['accounted'], 'verb-tense', 'past simple เพราะเล่าข้อมูลปี 2023 ที่ผ่านไปแล้ว + ประธาน coffee เอกพจน์ จึงใช้ accounted'),
          t(' for the '),
          sel('gb8-o3', ['largest', 'smallest', 'fairest'], 'largest', 'word-choice', 'coffee มีมูลค่าสูงสุด ($23M) จึงเป็น largest ไม่ใช่ smallest (น้อยสุด) หรือ fairest (ยุติธรรมสุด)'),
          t(' '),
          sel('gb8-o4', ['proportion', 'promise', 'problem'], 'proportion', 'paraphrase', 'proportion = สัดส่วน เหมาะกับ pie chart ส่วน promise (สัญญา) และ problem (ปัญหา) ผิดความหมาย'),
          t(' of Vietnam’s exports to the US, '),
          sel('gb8-o5', ['whereas', 'because', 'so'], 'whereas', 'transition', 'whereas ใช้เปรียบเทียบสองด้านที่ต่างกัน ส่วน because (เพราะ) และ so (ดังนั้น) บอกเหตุ-ผล ไม่ใช่การเปรียบเทียบ'),
          t(' aircraft parts '),
          typ('gb8-o6', 'make', ['made'], 'verb-tense', 'past simple เล่าอดีต + ประธาน aircraft parts พหูพจน์ ใช้ made (make up = ประกอบเป็น)'),
          t(' up the '),
          sel('gb8-o7', ['biggest', 'shortest', 'slowest'], 'biggest', 'word-choice', 'aircraft parts มีมูลค่าสูงสุดฝั่งสหรัฐ จึง biggest ส่วน shortest (สั้นสุด) และ slowest (ช้าสุด) ใช้กับมูลค่าไม่ได้'),
          t(' '),
          sel('gb8-o8', ['share', 'shape', 'shadow'], 'share', 'paraphrase', 'share = ส่วนแบ่ง (คำแทน proportion) ส่วน shape (รูปทรง) และ shadow (เงา) ผิดความหมาย'),
          t(' of US exports to Vietnam, with the '),
          sel('gb8-o12', ['total', 'topic', 'title'], 'total', 'word-choice', 'total value = มูลค่ารวม ส่วน topic (หัวข้อ) และ title (ชื่อเรื่อง) ผิดความหมาย'),
          t(' value of '),
          sel('gb8-o17', ['US', 'a US', 'the USes'], 'US', 'word-choice', 'US exports ใช้ชื่อประเทศตรงๆ ไม่ต้องมี a นำหน้า และไม่เติม -es ให้ชื่อเฉพาะ'),
          t(' exports '),
          typ('gb8-o13', 'be', ['being'], 'ving-clause', 'ใช้ with + noun + V-ing (being) เป็น absolute clause ต่อท้ายประโยคหลัก จึงใช้ being ไม่ใช่ was'),
          t(' '),
          sel('gb8-o18', ['far', 'fairly', 'faintly'], 'far', 'degree-adverb', 'far higher = สูงกว่ามาก ใช้ far เน้นความต่างมาก ส่วน fairly (ค่อนข้าง) และ faintly (เลือนราง) ผิดระดับ'),
          t(' '),
          sel('gb8-o14', ['higher', 'sooner', 'closer'], 'higher', 'word-choice', 'มูลค่าฝั่งสหรัฐมากกว่า จึง higher ส่วน sooner (เร็วกว่า) และ closer (ใกล้กว่า) ไม่ใช่การเทียบปริมาณ'),
          t(' than '),
          sel('gb8-o15', ['that', 'those', 'them'], 'that', 'referencing', 'that = แทนคำนามเอกพจน์ (the value) ที่พูดไปแล้ว จึง that of Vietnam ส่วน those/them ผิดรูป'),
          t(' of Vietnam.')
        ]
      },
      {
        id: 'gb8-body1',
        role: 'body1',
        labelTh: ROLE_LABEL_TH.body1,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel('gb8-b1', ['Regarding', 'Despite', 'Unlike'], 'Regarding', 'transition', 'Regarding = ในส่วนของ/เกี่ยวกับ ใช้ตั้งหัวข้อย่อหน้า ส่วน Despite (ทั้งที่) และ Unlike (ไม่เหมือน) เปลี่ยนความหมายประโยค'),
          t(' Vietnam’s exports to the US, coffee '),
          typ('gb8-b2', 'be', ['was'], 'verb-tense', 'ประธาน coffee เอกพจน์ + เล่าอดีต จึงใช้ was'),
          t(' by far the most '),
          sel('gb8-b3', ['valuable', 'valueless', 'careless'], 'valuable', 'word-choice', 'valuable = มีมูลค่า (สูงสุด) ส่วน valueless (ไร้ค่า) และ careless (สะเพร่า) ผิดความหมาย'),
          t(' '),
          sel('gb8-b12', ['category', 'calendar', 'customer'], 'category', 'paraphrase', 'category = หมวดสินค้า ส่วน calendar (ปฏิทิน) และ customer (ลูกค้า) ผิดความหมาย'),
          t(' at $23 million, '),
          typ('gb8-b4', 'follow', ['followed'], 'v3-clause', 'โครงสร้าง followed by (V3) = ตามมาด้วย ใช้บอกลำดับถัดลงมา'),
          t(' '),
          sel('gb8-b13', ['by', 'with', 'for'], 'by', 'word-choice', 'followed by = ตามมาด้วย ใช้ by เสมอ ส่วน with และ for ไม่เข้ากับสำนวนนี้'),
          t(' fruit and vegetables '),
          sel('gb8-b5', ['at', 'in', 'of'], 'at', 'word-choice', 'บอกจุดตัวเลขเจาะจงใช้ at $16 million ส่วน in และ of ไม่เข้ากับการระบุมูลค่า'),
          t(' $16 million, the '),
          sel('gb8-b14', ['second', 'seconds', 'secondly'], 'second', 'word-choice', 'the second highest = อันดับสอง ใช้ second (เลขลำดับ) ส่วน seconds (วินาที) และ secondly (คำเชื่อม) ผิดรูป'),
          t(' most valuable group. Seafood and rice '),
          typ('gb8-b6', 'account', ['accounted'], 'verb-tense', 'past simple เล่าอดีต + ประธานพหูพจน์ ใช้ accounted (account for = คิดเป็น)'),
          t(' for '),
          sel('gb8-b17', ['considerably', 'considerable', 'consider'], 'considerably', 'degree-adverb', 'considerably smaller = เล็กกว่าอย่างมาก ใช้ adverb considerably ขยาย smaller ส่วน considerable (adj) และ consider (v) ผิดชนิดคำ'),
          t(' '),
          sel('gb8-b7', ['smaller', 'larger', 'wider'], 'smaller', 'word-choice', 'seafood/rice มูลค่าน้อยกว่า coffee มาก จึง smaller ส่วน larger (ใหญ่กว่า) และ wider (กว้างกว่า) ผิดทิศทาง'),
          t(' shares, at $4.4 and $4.3 million, '),
          sel('gb8-b8', ['respectively', 'roughly', 'partly'], 'respectively', 'word-choice', 'respectively = ตามลำดับ จับคู่ตัวเลขกับสินค้าที่ระบุก่อนหน้า (ต้องมี comma นำหน้าเสมอ) ส่วน roughly/partly ผิดความหมาย'),
          t(', '),
          sel('gb8-b9', ['while', 'so that', 'as if'], 'while', 'transition', 'while เชื่อมสองข้อมูลที่ต่างกัน ส่วน so that (เพื่อที่จะ) และ as if (ราวกับ) ผิดความหมาย'),
          t(' garments and other goods each '),
          typ('gb8-b10', 'make', ['made'], 'verb-tense', 'past simple เล่าอดีต + made up = ประกอบเป็น (ประธาน each ตามด้วยกริยาเอกพจน์แต่รูปอดีต made เหมือนกัน)'),
          t(' up just $2 million, the '),
          sel('gb8-b11', ['lowest', 'longest', 'loudest'], 'lowest', 'word-choice', 'garments/other goods มูลค่าต่ำสุด จึง lowest ส่วน longest (ยาวสุด) และ loudest (ดังสุด) ใช้กับมูลค่าไม่ได้'),
          t(' figures '),
          sel('gb8-b15', ['recorded', 'expected', 'promised'], 'recorded', 'v3-clause', 'V3 recorded = ที่ถูกบันทึกไว้ ขยาย figures ส่วน expected (คาดว่า) และ promised (สัญญา) ไม่ตรงกับข้อมูลจริง'),
          t(' for '),
          sel('gb8-b16', ['Vietnam’s', 'Vietnams', 'Vietnam'], 'Vietnam’s', 'referencing', 'ใช้ possessive Vietnam’s (ของเวียดนาม) ที่มี apostrophe ส่วน Vietnams และ Vietnam ไม่แสดงความเป็นเจ้าของ'),
          t(' exports in this chart.')
        ]
      },
      {
        id: 'gb8-body2',
        role: 'body2',
        labelTh: ROLE_LABEL_TH.body2,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel('gb8-c1', ['In terms of', 'In spite of', 'Instead of'], 'In terms of', 'transition', 'In terms of = ในแง่ของ ใช้ตั้งหัวข้อ ส่วน In spite of (ทั้งที่) และ Instead of (แทนที่จะ) เปลี่ยนความหมาย'),
          t(' US exports to Vietnam, aircraft parts '),
          typ('gb8-c2', 'dominate', ['dominated'], 'verb-tense', 'past simple เล่าอดีต + ประธานพหูพจน์ ใช้ dominated (ครองสัดส่วนมากสุด)'),
          t(' the chart, '),
          typ('gb8-c13', 'reach', ['reaching'], 'ving-clause', 'V-ing clause reaching = แตะระดับ ขยายประโยคหลักด้วยผลลัพธ์'),
          t(' $72 million, more than '),
          sel('gb8-c3', ['twice', 'once', 'half'], 'twice', 'word-choice', '$72M มากกว่า $30.5M กว่าสองเท่า จึง twice ส่วน once (หนึ่งครั้ง) และ half (ครึ่ง) ผิดความหมาย'),
          t(' '),
          sel('gb8-c4', ['that', 'those', 'it'], 'that', 'referencing', 'that = แทนคำนามเอกพจน์ที่พูดไปแล้ว (the value) จึง that for machinery ส่วน those ใช้กับพหูพจน์ และ it ไม่ตามด้วย for'),
          t(' '),
          sel('gb8-c14', ['recorded', 'wasted', 'ignored'], 'recorded', 'v3-clause', 'V3 recorded = ที่ถูกบันทึก ขยาย that (the value) ส่วน wasted (สูญเปล่า) และ ignored (เพิกเฉย) ไม่ตรงข้อมูล'),
          t(' for machinery '),
          sel('gb8-c5', ['at', 'by', 'to'], 'at', 'word-choice', 'ระบุจุดมูลค่าใช้ at $30.5 million ส่วน by (ภายใน) และ to (ถึง) ไม่เข้ากับการระบุมูลค่า'),
          t(' $30.5 million. Fertiliser and cotton '),
          typ('gb8-c6', 'follow', ['followed'], 'verb-tense', 'past simple เล่าอดีต + ประธานพหูพจน์ ใช้ followed (ตามมา)'),
          t(' '),
          sel('gb8-c15', ['closely', 'closest', 'close'], 'closely', 'degree-adverb', 'followed closely = ตามมาอย่างใกล้ชิด ใช้ adverb closely ขยายกริยา ส่วน closest (ขั้นกว่าสุด) และ close (adj/adv บอกระยะ) ไม่เข้ากับตำแหน่งนี้'),
          t(', at $16.5 and $12 million, '),
          sel('gb8-c7', ['respectively', 'exactly', 'nearly'], 'respectively', 'word-choice', 'respectively = ตามลำดับ จับคู่ตัวเลขกับ fertiliser/cotton (มี comma นำหน้าเสมอ) ส่วน exactly/nearly ผิดความหมาย'),
          t(', '),
          sel('gb8-c8', ['whereas', 'therefore', 'moreover'], 'whereas', 'transition', 'whereas เปรียบเทียบข้อมูลที่ต่างกัน ส่วน therefore (ดังนั้น) และ moreover (ยิ่งกว่านั้น) ไม่ใช่การเปรียบเทียบ'),
          t(' cars '),
          typ('gb8-c9', 'make', ['made'], 'verb-tense', 'past simple เล่าอดีต + ประธานพหูพจน์ ใช้ made (make up = ประกอบเป็น)'),
          t(' up the '),
          sel('gb8-c10', ['smallest', 'tallest', 'quickest'], 'smallest', 'word-choice', 'cars มูลค่าต่ำสุดฝั่งสหรัฐ จึง smallest ส่วน tallest (สูงสุด) และ quickest (เร็วสุด) ใช้กับมูลค่าไม่ได้'),
          t(' '),
          sel('gb8-c11', ['share', 'chance', 'change'], 'share', 'paraphrase', 'share = ส่วนแบ่ง ส่วน chance (โอกาส) และ change (การเปลี่ยนแปลง) ผิดความหมาย'),
          t(' at just $6 million, far '),
          sel('gb8-c16', ['below', 'above', 'beside'], 'below', 'word-choice', '$6M ต่ำกว่ามูลค่าเครื่องบิน จึง below (ต่ำกว่า) ส่วน above (สูงกว่า) และ beside (ข้างๆ) ผิดทิศทาง'),
          t(' '),
          sel('gb8-c12', ['that', 'those', 'them'], 'that', 'referencing', 'that = แทนคำนามเอกพจน์ (the value) ที่กล่าวไปแล้ว จึง that of aircraft parts ส่วน those/them ผิดรูป'),
          t(' of aircraft parts, the '),
          sel('gb8-c17', ['leading', 'losing', 'lasting'], 'leading', 'word-choice', 'leading category = หมวดที่นำหน้า/สูงสุด ส่วน losing (ที่แพ้) และ lasting (คงทน) ผิดความหมาย'),
          t(' export.')
        ]
      }
    ]
  },

{
    id: 'gb-uk-thailand-spending',
    promptId: 'snapshot-uk-thailand-spending',
    steps: [
      {
        id: 'gb9-intro',
        role: 'intro',
        labelTh: ROLE_LABEL_TH.intro,
        hintTh: HINT_PARAPHRASE,
        segments: [
          t('The '),
          sel('gb9-i1', ['bar chart', 'bar list', 'bar table'], 'bar chart', 'paraphrase', 'ประเภทกราฟคือ bar chart (แผนภูมิแท่ง) ส่วน bar list/bar table ไม่ใช่ชื่อกราฟ'),
          t(' '),
          sel('gb9-i2', ['compares', 'complains', 'considers'], 'compares', 'paraphrase', 'compare = เปรียบเทียบข้อมูลสองฝ่าย ตรงกับกราฟที่เทียบ UK กับไทย ส่วน complain (บ่น) และ consider (พิจารณา) ไม่เข้ากับการบรรยายกราฟ'),
          t(' the '),
          sel('gb9-i3', ['proportion', 'number', 'length'], 'proportion', 'paraphrase', 'proportion (สัดส่วน) ใช้กับข้อมูลที่เป็นเปอร์เซ็นต์ ส่วน number (จำนวน) และ length (ความยาว) ไม่ตรงกับหน่วย %'),
          t(' of '),
          sel('gb9-i4', ['household', 'houseware', 'housemate'], 'household', 'word-choice', 'household spending = ค่าใช้จ่ายในครัวเรือน ตรงกับโจทย์ ส่วน houseware/housemate ผิดความหมาย'),
          t(' spending '),
          sel('gb9-i5', ['on', 'in', 'at'], 'on', 'word-choice', 'spending on + หมวด = ใช้จ่ายในเรื่อง... จึงใช้ on ส่วน in/at ไม่เข้ากับ spending'),
          t(' five '),
          sel('gb9-i6', ['categories', 'reasons', 'seasons'], 'categories', 'paraphrase', 'categories (หมวดหมู่) ตรงกับการแบ่งประเภทค่าใช้จ่าย ส่วน reasons/seasons ไม่เกี่ยวกับหมวดการใช้จ่าย'),
          t(' in the UK and Thailand, '),
          sel('gb9-i7', ['measured', 'divided', 'counted'], 'measured', 'word-choice', 'be measured as a percentage = ถูกวัดเป็นเปอร์เซ็นต์ เป็นสำนวนมาตรฐาน ส่วน divided/counted ไม่เข้ากับ "as a percentage"'),
          t(' '),
          sel('gb9-i8', ['as', 'like', 'for'], 'as', 'word-choice', 'measured as a percentage = วัดเป็นเปอร์เซ็นต์ ใช้ as ส่วน like/for ผิดโครงสร้าง'),
          t(' a '),
          sel('gb9-i9', ['percentage', 'quantity', 'distance'], 'percentage', 'paraphrase', 'percentage ตรงกับหน่วย % ในกราฟ ส่วน quantity (ปริมาณ) และ distance (ระยะทาง) ผิดความหมาย'),
          t(' of '),
          sel('gb9-i10', ['total', 'partial', 'single'], 'total', 'word-choice', 'total spending = ค่าใช้จ่ายรวมทั้งหมด ซึ่งเป็นฐานของการคิด % ส่วน partial (บางส่วน) และ single (เดี่ยว) ผิดความหมาย'),
          t(' spending in '),
          sel('gb9-i11', ['each', 'every', 'both'], 'each', 'word-choice', 'each country = แต่ละประเทศ ใช้ each กับการเทียบทีละฝ่าย ส่วน both ต้องตามด้วยนามพหูพจน์ และ every ฟังไม่เป็นธรรมชาติในที่นี้'),
          t(' '),
          sel('gb9-i12', ['country', 'county', 'county council'], 'country', 'word-choice', 'country = ประเทศ ตรงกับ UK และไทย ส่วน county (มณฑล) และ county council ผิดความหมาย'),
          t('.')
        ]
      },
      {
        id: 'gb9-overview',
        role: 'overview',
        labelTh: ROLE_LABEL_TH.overview,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel('gb9-o1', ['Overall', 'Suddenly', 'Firstly'], 'Overall', 'transition', 'Overall, ใช้เปิดย่อหน้า overview เพื่อสรุปภาพรวม ส่วน Suddenly/Firstly ไม่ใช่คำเปิดสรุปภาพรวม'),
          t(', housing '),
          typ('gb9-o2', 'make', ['made'], 'verb-tense', 'เล่าข้อมูลที่เกิดขึ้นแล้ว จึงผันอดีต make up -> made up'),
          t(' up the '),
          sel('gb9-o3', ['largest', 'smallest', 'lowest'], 'largest', 'word-choice', 'housing เป็นหมวดที่สูงที่สุดใน UK จึงใช้ largest ส่วน smallest/lowest ตรงข้ามกับข้อมูล'),
          t(' '),
          sel('gb9-o4', ['proportion', 'position', 'portion'], 'proportion', 'paraphrase', 'proportion (สัดส่วน) ใช้คู่กับ % ได้ถูกต้อง ส่วน position (ตำแหน่ง) ผิดความหมาย'),
          t(' of spending '),
          sel('gb9-o5', ['in', 'on', 'by'], 'in', 'word-choice', 'in the UK = ในสหราชอาณาจักร ใช้ in กับประเทศ ส่วน on/by ผิดบุพบท'),
          t(' the UK, '),
          sel('gb9-o6', ['whereas', 'since', 'so'], 'whereas', 'transition', 'whereas ใช้เปรียบเทียบความต่างระหว่างสองฝ่าย (UK กับไทย) ส่วน since (เพราะ) และ so (ดังนั้น) เป็นเหตุ-ผล ไม่ใช่การเทียบ'),
          t(' food '),
          typ('gb9-o7', 'account', ['accounted'], 'verb-tense', 'เล่าอดีต จึงผัน account for -> accounted for'),
          t(' for the '),
          sel('gb9-o8', ['biggest', 'rarest', 'nearest'], 'biggest', 'word-choice', 'food เป็นหมวดใหญ่สุดในไทย จึงใช้ biggest ส่วน rarest/nearest ผิดความหมาย'),
          t(' '),
          sel('gb9-o9', ['share', 'sharp', 'shape'], 'share', 'paraphrase', 'share (ส่วนแบ่ง) ใช้แทน proportion ได้ ส่วน sharp/shape ผิดความหมาย'),
          t(' in Thailand, with healthcare '),
          typ('gb9-o11', 'remain', ['remaining'], 'ving-clause', 'ใช้ with + noun + V-ing (remaining) เป็น absolute clause ต่อท้ายประโยคหลัก จึงใช้ remaining'),
          t(' the '),
          sel('gb9-o12', ['smallest', 'largest', 'widest'], 'smallest', 'word-choice', 'healthcare เป็นหมวดที่สัดส่วนต่ำสุด จึงใช้ smallest ส่วน largest/widest ขัดกับภาพรวม'),
          t(' category in '),
          sel('gb9-o13', ['both', 'each', 'either'], 'both', 'word-choice', 'both countries = ทั้งสองประเทศ ใช้ both ตามด้วยนามพหูพจน์ ส่วน each/either ต้องตามด้วยนามเอกพจน์'),
          t(' countries.')
        ]
      },
      {
        id: 'gb9-body1',
        role: 'body1',
        labelTh: ROLE_LABEL_TH.body1,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel('gb9-b1', ['In the UK', 'Despite the UK', 'Unlike the UK'], 'In the UK', 'transition', 'In the UK เปิดย่อหน้าเพื่อระบุสถานที่ ส่วน Despite/Unlike ทำให้ประโยคผิดไวยากรณ์และความหมาย'),
          t(', housing '),
          typ('gb9-b2', 'be', ['was'], 'verb-tense', 'ประธานเอกพจน์ (housing) + เล่าอดีต จึงใช้ was'),
          t(' the '),
          sel('gb9-b3', ['largest', 'rarest', 'fastest'], 'largest', 'word-choice', 'housing ที่ 28% เป็นหมวดใหญ่สุด จึงใช้ largest ส่วน rarest/fastest ผิดความหมาย'),
          t(' '),
          sel('gb9-b4', ['category', 'calendar', 'container'], 'category', 'paraphrase', 'category (หมวดหมู่) ตรงกับบริบทหมวดค่าใช้จ่าย ส่วน calendar/container ผิดความหมาย'),
          t(' '),
          sel('gb9-b5', ['at', 'by', 'of'], 'at', 'word-choice', 'บอกค่าตัวเลขจุดเดียวใช้ at 28% ส่วน by (ปริมาณที่เปลี่ยน) และ of ไม่เข้ากับบริบทนี้'),
          t(' 28%, '),
          typ('gb9-b6', 'follow', ['followed'], 'v3-clause', 'โครงสร้าง followed by (V3) = ตามมาด้วย ใช้เชื่อมอันดับรองลงมา'),
          t(' by food '),
          sel('gb9-b7', ['at', 'in', 'on'], 'at', 'word-choice', 'บอกค่า % จุดเดียวใช้ at 18% ส่วน in/on ไม่ใช่คำบุพบทของค่าตัวเลขแบบนี้'),
          t(' 18% '),
          sel('gb9-b8', ['and', 'but', 'or'], 'and', 'transition', 'เชื่อมสองรายการที่เพิ่มเข้ามาใช้ and ส่วน but (แต่) และ or (หรือ) ผิดความหมาย'),
          t(' leisure at 15%. '),
          sel('gb9-b9', ['Transport', 'Transports', 'Transporting'], 'Transport', 'word-choice', 'transport เป็นนามนับไม่ได้ในความหมายนี้ ไม่เติม s และไม่ใช้รูป V-ing'),
          t(' and healthcare '),
          typ('gb9-b10', 'account', ['accounted'], 'verb-tense', 'ประธานพหูพจน์ + เล่าอดีต จึงผัน account -> accounted'),
          t(' for '),
          sel('gb9-b11', ['smaller', 'bigger', 'equal'], 'smaller', 'word-choice', 'สองหมวดนี้ (14% และ 12%) เล็กกว่าหมวดบน จึงใช้ smaller ส่วน bigger/equal ขัดกับข้อมูล'),
          t(' '),
          sel('gb9-b12', ['shares', 'sharing', 'shore'], 'shares', 'word-choice', 'shares (ส่วนแบ่งพหูพจน์) เข้ากับสองหมวด ส่วน sharing/shore ผิดรูปและความหมาย'),
          t(', at 14% and 12%, '),
          sel('gb9-b13', ['respectively', 'suddenly', 'clearly'], 'respectively', 'word-choice', 'respectively = ตามลำดับ ใช้จับคู่ 14%-transport และ 12%-healthcare และต้องมีคอมมาข้างหน้าเสมอ'),
          t('. These five '),
          sel('gb9-b14', ['categories', 'countries', 'centuries'], 'categories', 'referencing', 'อ้างถึงหมวดค่าใช้จ่ายที่กล่าวไปแล้ว จึงใช้ categories ส่วน countries/centuries ผิดความหมาย'),
          t(' together '),
          typ('gb9-b15', 'make', ['made'], 'verb-tense', 'เล่าอดีต จึงผัน make up -> made up'),
          t(' up the '),
          sel('gb9-b16', ['whole', 'half', 'part'], 'whole', 'word-choice', 'ทั้งห้าหมวดรวมกันเป็น 100% จึงใช้ whole (ทั้งหมด) ส่วน half/part ขัดกับความหมาย'),
          t(' of UK household spending, '),
          typ('gb9-b17', 'lead', ['led'], 'v3-clause', 'led by (V3) = นำโดย ใช้ชี้หมวดที่สูงสุด และเล่าอดีต จึงใช้ led'),
          t(' by '),
          sel('gb9-b18', ['housing', 'food', 'leisure'], 'housing', 'referencing', 'housing (28%) เป็นหมวดสูงสุดใน UK จึงนำหมวดอื่น ส่วน food/leisure มีสัดส่วนน้อยกว่า'),
          t('.')
        ]
      },
      {
        id: 'gb9-body2',
        role: 'body2',
        labelTh: ROLE_LABEL_TH.body2,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel('gb9-c1', ['In Thailand', 'Although Thailand', 'Except Thailand'], 'In Thailand', 'transition', 'In Thailand เปิดย่อหน้าเพื่อระบุสถานที่ ส่วน Although/Except ทำให้ประโยคผิดไวยากรณ์'),
          t(', '),
          sel('gb9-c2', ['by contrast', 'by chance', 'by then'], 'by contrast', 'transition', 'by contrast = ในทางตรงกันข้าม ใช้เทียบไทยกับ UK ส่วน by chance (บังเอิญ) และ by then (ตอนนั้น) ผิดความหมาย'),
          t(', food '),
          typ('gb9-c3', 'take', ['took'], 'verb-tense', 'ประธานเอกพจน์ (food) + เล่าอดีต จึงผัน take -> took'),
          t(' the '),
          sel('gb9-c4', ['largest', 'latest', 'loudest'], 'largest', 'word-choice', 'food ที่ 25% เป็นหมวดใหญ่สุดในไทย จึงใช้ largest ส่วน latest/loudest ผิดความหมาย'),
          t(' '),
          sel('gb9-c4b', ['share', 'shore', 'chair'], 'share', 'paraphrase', 'share (ส่วนแบ่ง) เข้ากับสัดส่วน % ส่วน shore (ชายฝั่ง) และ chair (เก้าอี้) ผิดความหมาย'),
          t(' '),
          sel('gb9-c5', ['at', 'to', 'from'], 'at', 'word-choice', 'บอกค่า % จุดเดียวใช้ at 25% ส่วน to/from ใช้กับช่วง ไม่ใช่จุดเดียว'),
          t(' 25%, '),
          typ('gb9-c6', 'follow', ['followed'], 'v3-clause', 'followed by (V3) = ตามมาด้วย ใช้เรียงอันดับรองลงมา'),
          t(' by housing '),
          sel('gb9-c7', ['at', 'by', 'for'], 'at', 'word-choice', 'บอกค่า % จุดเดียวใช้ at 22% ส่วน by/for ไม่เข้ากับบริบทค่าตัวเลขนี้'),
          t(' 22% '),
          sel('gb9-c7b', ['and', 'but', 'nor'], 'and', 'transition', 'เชื่อมรายการเพิ่มใช้ and ส่วน but (แต่) และ nor (และไม่) ผิดความหมาย'),
          t(' transport at 18%. '),
          sel('gb9-c8', ['While', 'Because', 'Therefore'], 'While', 'transition', 'While ใช้ชี้ความต่างของหมวด healthcare เทียบกับหมวดที่ใหญ่กว่า ส่วน Because/Therefore เป็นเหตุ-ผล ไม่ใช่การเทียบ'),
          t(' housing and transport '),
          typ('gb9-c9', 'take', ['took'], 'verb-tense', 'ประธานพหูพจน์ + เล่าอดีต จึงผัน take -> took'),
          t(' up '),
          sel('gb9-c10', ['larger', 'smaller', 'lower'], 'larger', 'word-choice', 'housing และ transport มีสัดส่วนใหญ่กว่า healthcare จึงใช้ larger ส่วน smaller/lower ขัดกับข้อมูล'),
          t(' shares, healthcare '),
          typ('gb9-c11', 'make', ['made'], 'verb-tense', 'ประธานเอกพจน์ (healthcare) + เล่าอดีต จึงใช้ made'),
          t(' up the '),
          sel('gb9-c12', ['smallest', 'biggest', 'widest'], 'smallest', 'word-choice', 'healthcare ที่ 8% เป็นหมวดเล็กสุด จึงใช้ smallest ส่วน biggest/widest ขัดกับข้อมูล'),
          t(' '),
          sel('gb9-c13', ['proportion', 'promotion', 'position'], 'proportion', 'paraphrase', 'proportion (สัดส่วน) ใช้คู่กับ % ได้ถูกต้อง ส่วน promotion/position ผิดความหมาย'),
          t(' at '),
          sel('gb9-c14', ['just', 'quite', 'more'], 'just', 'word-choice', 'just 8% = เพียง 8% เน้นว่าตัวเลขต่ำ ส่วน quite/more ทำให้ความหมายเพี้ยน'),
          t(' 8%, '),
          sel('gb9-c15', ['lower', 'higher', 'wider'], 'lower', 'word-choice', '8% ต่ำกว่าทุกหมวดของ UK จึงใช้ lower ส่วน higher/wider ขัดกับข้อมูล'),
          t(' than '),
          sel('gb9-c16', ['that', 'those', 'it'], 'that', 'referencing', 'that of = แทนคำนามเอกพจน์ (the proportion) ที่กล่าวไปแล้ว ส่วน those (พหูพจน์) และ it (ไม่ตามด้วย of) ผิดไวยากรณ์'),
          t(' of any '),
          sel('gb9-c17', ['category', 'country', 'century'], 'category', 'referencing', 'อ้างถึงหมวดใน UK แต่ละหมวด จึงใช้ category ส่วน country/century ผิดความหมาย'),
          t(' in the UK, '),
          typ('gb9-c18', 'show', ['showing'], 'ving-clause', 'V-ing clause (showing) ใช้ขยายผลที่ตามมาจากประโยคหลัก'),
          t(' how '),
          sel('gb9-c19', ['differently', 'lately', 'nearly'], 'differently', 'word-choice', 'differently = อย่างแตกต่าง ตรงกับการเทียบสองประเทศ ส่วน lately/nearly ผิดความหมาย'),
          t(' the two countries '),
          typ('gb9-c20', 'spend', ['spent'], 'verb-tense', 'เล่าอดีต จึงผัน spend -> spent'),
          t(' '),
          sel('gb9-c21', ['their', 'its', 'his'], 'their', 'referencing', 'the two countries เป็นพหูพจน์ จึงใช้ their ส่วน its/his เป็นเอกพจน์'),
          t(' money.')
        ]
      }
    ]
  },

{
    id: 'gb-germany-australia-energy',
    promptId: 'snapshot-germany-australia-energy',
    steps: [
      {
        id: 'gb10-intro',
        role: 'intro',
        labelTh: ROLE_LABEL_TH.intro,
        hintTh: HINT_PARAPHRASE,
        segments: [
          t('The two pie charts '),
          sel('gb10-i1', ['illustrate', 'insist', 'wish'], 'illustrate', 'paraphrase', 'illustrate = แสดง/บรรยายข้อมูลในแผนภูมิ ส่วน insist (ยืนกราน) และ wish (ปรารถนา) เป็นการกระทำของคน ใช้บรรยายกราฟไม่ได้'),
          t(' and '),
          sel('gb10-i2', ['compare', 'complain', 'command'], 'compare', 'paraphrase', 'compare = เปรียบเทียบ เหมาะกับกราฟสองอันที่วางคู่กัน ส่วน complain (บ่น) และ command (สั่ง) ไม่เข้ากับบริบทข้อมูล'),
          t(' the '),
          sel('gb10-i3', ['distribution', 'distance', 'duration'], 'distribution', 'paraphrase', 'distribution = การกระจาย/สัดส่วน ตรงกับความหมายของ pie chart ส่วน distance (ระยะทาง) และ duration (ช่วงเวลา) ไม่ตรงบริบท'),
          t(' of '),
          sel('gb10-i4', ['energy sources', 'energy prices', 'energy bills'], 'energy sources', 'paraphrase', 'energy sources = แหล่งพลังงาน ตรงกับโจทย์ ส่วน prices (ราคา) และ bills (ค่าไฟ) เป็นข้อมูลคนละชนิดที่กราฟไม่ได้แสดง'),
          t(' '),
          sel('gb10-i5', ['used', 'using', 'use'], 'used', 'v3-clause', 'used ในที่นี้เป็น V3 (past participle) ขยาย energy sources แบบ passive = แหล่งพลังงานที่ถูกใช้ ส่วน using/use ผิดโครงสร้าง'),
          t(' to '),
          sel('gb10-i6', ['generate', 'generation', 'generator'], 'generate', 'word-choice', 'ต้องการกริยาหลัง to จึงใช้ generate (ผลิต) ส่วน generation เป็นคำนาม และ generator เป็นเครื่องปั่นไฟ'),
          t(' electricity '),
          sel('gb10-i7', ['in', 'on', 'at'], 'in', 'word-choice', 'ใช้ in กับชื่อประเทศเสมอ (in Germany) ส่วน on/at ใช้กับสถานที่เล็กหรือจุดเฉพาะ'),
          t(' Germany and Australia '),
          sel('gb10-i8', ['in', 'by', 'to'], 'in', 'word-choice', 'ระบุปีเดียว (จุดเวลาเดียว) ใช้ in 2020 ส่วน by = ภายในปีนั้น และ to = ถึงปีนั้น ซึ่งไม่ใช่ความหมายที่ต้องการ'),
          t(' 2020. The two nations '),
          typ('gb10-i9', 'rely', ['relied'], 'verb-tense', 'past simple เล่าอดีตปี 2020: rely -> relied'),
          t(' on '),
          sel('gb10-i10', ['different', 'difference', 'differently'], 'different', 'word-choice', 'ต้องการคำคุณศัพท์ขยาย energy sources จึงใช้ different (แตกต่าง) ส่วน difference เป็นคำนาม และ differently เป็น adverb'),
          t(' energy sources.')
        ]
      },
      {
        id: 'gb10-overview',
        role: 'overview',
        labelTh: ROLE_LABEL_TH.overview,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('Overall, renewables '),
          typ('gb10-o1', 'make', ['made'], 'verb-tense', 'ทั้งเรียงความเล่าข้อมูลปี 2020 (อดีต) จึงใช้ past simple: make -> made'),
          t(' up the '),
          sel('gb10-o2', ['largest', 'least', 'fewest'], 'largest', 'word-choice', 'largest = ใหญ่ที่สุด ใช้กับ proportion (นามนับไม่ได้) ส่วน least ผิดตำแหน่ง และ fewest ใช้กับนามนับได้เท่านั้น'),
          t(' '),
          sel('gb10-o3', ['proportion', 'proportions', 'portion'], 'proportion', 'word-choice', 'proportion (เอกพจน์) = สัดส่วน หมายถึงส่วนแบ่งที่ใหญ่ที่สุดหนึ่งเดียว จึงไม่ใช้พหูพจน์ และ portion แปลว่าส่วนอาหาร'),
          t(' '),
          sel('gb10-o4', ['in', 'at', 'on'], 'in', 'word-choice', 'ใช้ in กับชื่อประเทศ (in Germany) ส่วน at/on ไม่ใช้กับประเทศ'),
          t(' Germany, '),
          sel('gb10-o5', ['whereas', 'because', 'until'], 'whereas', 'transition', 'whereas = ในขณะที่ ใช้เชื่อมสองข้อความที่ตรงข้ามกัน (เยอรมนีเน้น renewables ออสเตรเลียเน้น coal) ส่วน because/until ผิดความหมาย'),
          t(' coal '),
          typ('gb10-o6', 'remain', ['remained'], 'verb-tense', 'past simple เล่าอดีต: remain -> remained (ประธาน coal เอกพจน์)'),
          t(' the '),
          sel('gb10-o7', ['dominant', 'dominance', 'dominate'], 'dominant', 'word-choice', 'ต้องการคำคุณศัพท์ขยาย source จึงใช้ dominant (เด่นที่สุด) ส่วน dominance เป็นคำนาม และ dominate เป็นกริยา'),
          t(' source '),
          sel('gb10-o8', ['in', 'to', 'of'], 'in', 'word-choice', 'ใช้ in Australia กับชื่อประเทศ ส่วน to/of ไม่เข้ากับตำแหน่งนี้'),
          t(' Australia, with '),
          sel('gb10-o9', ['other sources', 'the other source', 'others source'], 'other sources', 'word-choice', 'other sources (พหูพจน์) = แหล่งพลังงานอื่นๆ ที่เหลือ ถูกไวยากรณ์ ส่วนตัวเลือกอื่นผิดรูป'),
          t(' '),
          typ('gb10-o10', 'account', ['accounting'], 'ving-clause', 'ใช้ with + noun + V-ing (accounting) เป็น absolute clause ต่อท้ายประโยคหลัก จึงใช้ accounting'),
          t(' for the '),
          sel('gb10-o11', ['smallest', 'biggest', 'wider'], 'smallest', 'word-choice', 'smallest = เล็กที่สุด (superlative) ตรงกับข้อมูลที่แหล่งอื่นๆ มีสัดส่วนน้อยสุด ส่วน biggest ตรงข้าม และ wider เป็น comparative ผิดรูป'),
          t(' shares of the total in both countries.')
        ]
      },
      {
        id: 'gb10-body1',
        role: 'body1',
        labelTh: ROLE_LABEL_TH.body1,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel('gb10-b1', ['In Germany', 'Despite Germany', 'Unlike Germany'], 'In Germany', 'transition', 'In Germany = ในเยอรมนี เปิดย่อหน้าอย่างเป็นกลาง ส่วน Despite/Unlike สื่อความขัดแย้งที่ไม่จำเป็นตรงนี้'),
          t(', renewables '),
          typ('gb10-b2', 'account', ['accounted'], 'verb-tense', 'past simple เล่าอดีต: account -> accounted'),
          t(' '),
          sel('gb10-b3', ['for', 'of', 'with'], 'for', 'word-choice', 'สำนวนคงที่คือ account for = คิดเป็นสัดส่วน จึงต้องใช้ for'),
          t(' the '),
          sel('gb10-b4', ['largest', 'largely', 'large'], 'largest', 'word-choice', 'largest (superlative) = ใหญ่ที่สุด ขยาย share ส่วน largely เป็น adverb และ large เป็นรูปธรรมดา ไม่ได้สื่อว่ามากที่สุด'),
          t(' share, at '),
          sel('gb10-b5', ['44%', '25%', '16%'], '44%', 'word-choice', 'ข้อเท็จจริงจากกราฟ: renewables ของเยอรมนี = 44%'),
          t(', '),
          typ('gb10-b6', 'follow', ['followed'], 'v3-clause', 'V3 (past participle) ในโครงสร้าง followed by = ตามมาด้วย ใช้ขยายลำดับสัดส่วน'),
          t(' by coal '),
          sel('gb10-b7', ['at', 'in', 'by'], 'at', 'word-choice', 'ระบุค่าตัวเลข/เปอร์เซ็นต์เฉพาะจุด ใช้ at (at 25%) เสมอ'),
          t(' 25% and gas at 16%. '),
          sel('gb10-b8', ['Nuclear', 'A nuclear', 'Nuclears'], 'Nuclear', 'word-choice', 'nuclear (พลังงานนิวเคลียร์) เป็นนามนับไม่ได้ ไม่ใช้ a หรือเติม s'),
          t(' and other sources '),
          typ('gb10-b9', 'make', ['made'], 'verb-tense', 'past simple เล่าอดีต: make -> made (ประธานพหูพจน์)'),
          t(' up '),
          sel('gb10-b10', ['smaller', 'smallest', 'smallly'], 'smaller', 'word-choice', 'เปรียบเทียบกับแหล่งที่ใหญ่กว่า ใช้ comparative smaller ส่วน smallest เป็น superlative และ smallly ไม่มีคำนี้'),
          t(' shares, at 6% and 9%, '),
          sel('gb10-b11', ['respectively', 'clearly', 'lately'], 'respectively', 'word-choice', 'respectively = ตามลำดับ จับคู่ nuclear=6% และ other=9% (มี comma นำหน้าเสมอ) ส่วน clearly/lately ผิดความหมาย'),
          t('. '),
          sel('gb10-b12', ['Together', 'Alone', 'Instead'], 'Together', 'transition', 'Together = เมื่อรวมกัน สื่อการรวมสัดส่วน เข้ากับประโยคสรุปย่อย ส่วน Alone/Instead ผิดความหมาย'),
          t(', '),
          sel('gb10-b13', ['these', 'this', 'those'], 'these', 'referencing', 'อ้างถึง sources ที่เพิ่งกล่าว (พหูพจน์และอยู่ในย่อหน้าเดียวกัน) ใช้ these ส่วน this เอกพจน์ และ those ชี้ของไกล'),
          t(' four sources '),
          typ('gb10-b14', 'provide', ['provided'], 'verb-tense', 'past simple เล่าอดีต: provide -> provided'),
          t(' the country’s electricity in 2020. '),
          sel('gb10-b15', ['Notably', 'Notable', 'Note'], 'Notably', 'transition', 'Notably (adverb) = ที่น่าสังเกตคือ เปิดประโยคขยายความ ส่วน notable เป็นคุณศัพท์ และ note เป็นคำนาม/กริยา ผิดตำแหน่ง'),
          t(', the share of renewables '),
          typ('gb10-b16', 'be', ['was'], 'verb-tense', 'ประธาน the share เอกพจน์ + เล่าอดีต จึงใช้ was'),
          t(' '),
          sel('gb10-b17', ['nearly', 'near', 'nearer'], 'nearly', 'degree-adverb', 'nearly (adverb) = เกือบ ขยายวลี twice ส่วน near เป็นคุณศัพท์/บุพบท และ nearer เป็น comparative ผิดบริบท'),
          t(' twice '),
          sel('gb10-b18', ['that', 'those', 'them'], 'that', 'referencing', 'that of coal = แทน the share of coal (เอกพจน์) จึงใช้ that ส่วน those พหูพจน์ และ them อ้างไม่ชัด'),
          t(' of coal, '),
          typ('gb10-b19', 'reflect', ['reflecting'], 'ving-clause', 'V-ing clause ขยายผลของประโยคหลัก: reflect -> reflecting = ซึ่งสะท้อนถึง...'),
          t(' the country’s '),
          sel('gb10-b20', ['shift', 'shifted', 'shifts'], 'shift', 'word-choice', 'ต้องการคำนามหลัง the country’s จึงใช้ shift (การเปลี่ยนผ่าน) ส่วน shifted เป็นกริยาอดีต และ shifts เป็นพหูพจน์ที่ไม่เข้ากับ the...’s'),
          t(' towards cleaner energy.')
        ]
      },
      {
        id: 'gb10-body2',
        role: 'body2',
        labelTh: ROLE_LABEL_TH.body2,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel('gb10-c1', ['In Australia', 'Although Australia', 'Besides Australia'], 'In Australia', 'transition', 'In Australia = ในออสเตรเลีย เปิดย่อหน้าอย่างเป็นกลาง ส่วน Although/Besides ผิดโครงสร้างและความหมาย'),
          t(', '),
          sel('gb10-c2', ['by contrast', 'as a result', 'for instance'], 'by contrast', 'transition', 'by contrast = ในทางตรงข้าม เพราะกำลังเทียบภาพที่ต่างจากเยอรมนี ส่วน as a result (ผลลัพธ์) และ for instance (ตัวอย่าง) ผิดความหมาย'),
          t(', coal '),
          typ('gb10-c3', 'dominate', ['dominated'], 'verb-tense', 'past simple เล่าอดีต: dominate -> dominated'),
          t(' the mix '),
          sel('gb10-c4', ['at', 'on', 'to'], 'at', 'word-choice', 'ระบุเปอร์เซ็นต์เฉพาะจุด ใช้ at 52%'),
          t(' 52%, more than twice '),
          sel('gb10-c5', ['that', 'those', 'it'], 'that', 'referencing', 'that of gas = แทน the share of gas (share เอกพจน์) จึงใช้ that ส่วน those ใช้กับพหูพจน์ และ it อ้างไม่ชัด'),
          t(' of gas '),
          sel('gb10-c6', ['at', 'by', 'in'], 'at', 'word-choice', 'ระบุค่าเปอร์เซ็นต์เฉพาะจุด ใช้ at 22%'),
          t(' 22%. '),
          sel('gb10-c6b', ['Gas', 'A gas', 'Gases'], 'Gas', 'word-choice', 'gas (พลังงานก๊าซ) เป็นนามนับไม่ได้ ไม่ใช้ a หรือเติม s'),
          t(' therefore '),
          typ('gb10-c6c', 'rank', ['ranked'], 'verb-tense', 'past simple เล่าอดีต: rank -> ranked (ประธาน gas เอกพจน์)'),
          t(' second, '),
          typ('gb10-c6d', 'follow', ['followed'], 'v3-clause', 'V3 (past participle) ในโครงสร้าง followed by = ตามมาด้วย'),
          t(' '),
          sel('gb10-c6e', ['closely', 'close', 'closer'], 'closely', 'degree-adverb', 'closely (adverb) = อย่างสูสี ขยาย followed by ส่วน close เป็นคุณศัพท์ และ closer เป็น comparative ผิดบริบท'),
          t(' by renewables. Renewables '),
          typ('gb10-c7', 'account', ['accounted'], 'verb-tense', 'past simple เล่าอดีต: account -> accounted'),
          t(' for 21%, only '),
          sel('gb10-c8', ['slightly', 'sharply', 'widely'], 'slightly', 'degree-adverb', 'ความต่างระหว่าง 21% กับ 22% เล็กมาก จึงใช้ slightly (เล็กน้อย) ส่วน sharply/widely สื่อความต่างมาก ไม่ตรงข้อมูล'),
          t(' below '),
          sel('gb10-c9', ['that', 'those', 'them'], 'that', 'referencing', 'that of gas = แทน the share of gas (เอกพจน์) จึงใช้ that ส่วน those/them ผิดจำนวนหรืออ้างไม่ชัด'),
          t(' of gas, '),
          sel('gb10-c10', ['while', 'so', 'therefore'], 'while', 'transition', 'while = ในขณะที่ เชื่อมสองข้อความคู่ขนานที่ต่างกัน ส่วน so/therefore สื่อเหตุผล-ผลลัพธ์ ผิดความหมาย'),
          t(' other sources '),
          typ('gb10-c11', 'make', ['made'], 'verb-tense', 'past simple เล่าอดีต: make -> made (ประธานพหูพจน์)'),
          t(' up the '),
          sel('gb10-c12', ['smallest', 'smaller', 'small'], 'smallest', 'word-choice', 'smallest (superlative) = เล็กที่สุด เพราะเทียบกับทุกแหล่งในกราฟออสเตรเลีย ส่วน smaller เทียบแค่สองสิ่ง และ small เป็นรูปธรรมดา'),
          t(' proportion '),
          sel('gb10-c13', ['at', 'of', 'for'], 'at', 'word-choice', 'ระบุค่าเปอร์เซ็นต์เฉพาะจุด ใช้ at just 5%'),
          t(' just 5%. '),
          sel('gb10-c14', ['Although', 'Because', 'Since'], 'Although', 'transition', 'Although = แม้ว่า เปิดประโยคเปรียบเทียบที่มีความขัดแย้งในตัว ส่วน Because/Since สื่อเหตุผล ผิดความหมายที่ต้องการ'),
          t(' renewables '),
          typ('gb10-c15', 'play', ['played'], 'verb-tense', 'past simple เล่าอดีต: play -> played'),
          t(' a role in both countries, coal '),
          typ('gb10-c16', 'be', ['was'], 'verb-tense', 'ประธาน coal เอกพจน์ + เล่าอดีต จึงใช้ was'),
          t(' far more '),
          sel('gb10-c17', ['central', 'centrally', 'centre'], 'central', 'word-choice', 'ต้องการคุณศัพท์ขยายหลัง more จึงใช้ central (เป็นแกนหลัก) ส่วน centrally เป็น adverb และ centre เป็นคำนาม'),
          t(' to '),
          sel('gb10-c18', ['Australia’s', 'Australias', 'Australia'], 'Australia’s', 'referencing', 'ต้องการรูปแสดงความเป็นเจ้าของ Australia’s energy mix = ระบบพลังงานของออสเตรเลีย ส่วน Australias/Australia ผิดรูป'),
          t(' energy mix '),
          sel('gb10-c19', ['than', 'as', 'then'], 'than', 'word-choice', 'ใช้ than หลัง comparative (more central) เพื่อเทียบกับ Germany’s ส่วน as ใช้กับ as...as และ then แปลว่าหลังจากนั้น'),
          t(' to '),
          sel('gb10-c20', ['that', 'those', 'it'], 'that', 'referencing', 'that of Germany = แทน the energy mix of Germany (เอกพจน์) จึงใช้ that ส่วน those พหูพจน์ และ it อ้างไม่ชัด'),
          t(' of Germany, '),
          sel('gb10-c21', ['while', 'so', 'because'], 'while', 'transition', 'while = ในขณะที่ เชื่อมสองภาพคู่ขนานที่ต่างกัน ส่วน so/because สื่อเหตุผล-ผลลัพธ์ ผิดความหมาย'),
          t(' renewables '),
          typ('gb10-c22', 'lead', ['led'], 'verb-tense', 'past simple เล่าอดีต: lead -> led'),
          t(' the way in Germany.')
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
          t(' 2024. Each figure '),
          typ('gb11-i8', 'let', ['lets'], 'verb-tense', 'ประธานเอกพจน์ (each figure) ในประโยคปัจจุบันจึงเติม s เป็น lets'),
          t(' us '),
          sel('gb11-i8b', ['rank', 'rankly', 'ranking'], 'rank', 'word-choice', 'หลัง us ต้องเป็นกริยารูปพื้นฐาน rank (จัดอันดับ) ส่วน rankly ไม่มีจริง และ ranking เป็น V-ing ผิดโครงสร้าง'),
          t(' the institutions from strongest '),
          sel('gb11-i9', ['to', 'than', 'as'], 'to', 'word-choice', 'from strongest to weakest = จากแข็งสุดถึงอ่อนสุด เป็นวลีคู่ from...to ส่วน than และ as ไม่เข้ากับโครงสร้างนี้'),
          t(' weakest.')
        ]
      },
      {
        id: 'gb11-overview',
        role: 'overview',
        labelTh: ROLE_LABEL_TH.overview,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel('gb11-o1', ['Overall', 'Suddenly', 'Luckily'], 'Overall', 'transition', 'Overall = โดยรวม เป็นคำเปิดย่อหน้าสรุปภาพรวมที่ IELTS นิยมใช้ ส่วน Suddenly (ทันใด) และ Luckily (โชคดี) ไม่เหมาะกับการสรุป'),
          t(', MIT '),
          typ('gb11-o2', 'lead', ['led'], 'verb-tense', 'เล่าข้อมูลอดีต (ปี 2024) จึงผัน lead เป็นอดีต led'),
          t(' '),
          sel('gb11-o3', ['in', 'to', 'of'], 'in', 'word-choice', 'lead in something = นำหน้าในด้านใดด้านหนึ่ง ใช้บุพบท in ส่วน to และ of ไม่เข้ากับ lead ในความหมายนี้'),
          t(' satisfaction and employment, '),
          sel('gb11-o4', ['whereas', 'because', 'so'], 'whereas', 'transition', 'whereas = ในขณะที่ ใช้เทียบสองฝ่ายที่ต่างกัน (MIT vs Oxford) ส่วน because (เพราะ) บอกเหตุผล และ so (ดังนั้น) บอกผลลัพธ์ ไม่ใช่การเทียบ'),
          t(' Oxford '),
          typ('gb11-o5', 'have', ['had'], 'verb-tense', 'ประธานเอกพจน์ Oxford + เล่าอดีต จึงใช้ had'),
          t(' the '),
          sel('gb11-o6', ['highest', 'higher', 'high'], 'highest', 'word-choice', 'เทียบกับทุกมหาวิทยาลัยจึงใช้ขั้นสูงสุด highest ส่วน higher (กว่า) เทียบแค่สองสิ่ง และ high เป็นรูปธรรมดา'),
          t(' research output; Chulalongkorn '),
          typ('gb11-o7', 'record', ['recorded'], 'verb-tense', 'ประธานเอกพจน์ + เล่าอดีต จึงผัน record เป็น recorded'),
          t(' the '),
          sel('gb11-o8', ['lowest', 'highest', 'widest'], 'lowest', 'word-choice', 'lowest = ต่ำสุด ตรงกับข้อเท็จจริงว่า Chulalongkorn ต่ำสุดทุกด้าน ส่วน highest (สูงสุด) ตรงข้าม และ widest (กว้างสุด) ไม่เข้ากับตัวเลข'),
          t(' figures '),
          sel('gb11-o9', ['across', 'along', 'against'], 'across', 'word-choice', 'across every indicator = ในทุกตัวชี้วัด ใช้ across ครอบคลุมหลายหัวข้อ ส่วน along (ตามแนว) และ against (ต่อต้าน) คนละความหมาย'),
          t(' every indicator, '),
          typ('gb11-o11', 'leave', ['leaving'], 'ving-clause', 'ใช้ V-ing clause (leaving) ต่อท้ายประโยคหลักเพื่อสรุปผลลัพธ์ต่อเนื่อง'),
          t(' '),
          sel('gb11-o12', ['MIT and Oxford as', 'MIT and Oxford to', 'MIT and Oxford for'], 'MIT and Oxford as', 'word-choice', 'leave X as Y = ทำให้ X กลายเป็น Y จึงใช้ as ส่วน to/for ไม่เข้ากับ leave ในความหมายนี้'),
          t(' the two strongest performers overall.')
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
          t(' 22,100. Chulalongkorn '),
          typ('gb11-b6', 'record', ['recorded'], 'verb-tense', 'ประธานเอกพจน์ + เล่าอดีต จึงผัน record เป็น recorded'),
          t(' '),
          sel('gb11-b7', ['by far', 'so far', 'as far'], 'by far', 'word-choice', 'by far the lowest = ต่ำสุดแบบทิ้งห่าง เป็นวลีเน้นความต่างชัดเจน ส่วน so far (จนถึงตอนนี้) และ as far ไม่เข้ากับความหมายนี้'),
          t(' the '),
          sel('gb11-b8', ['lowest', 'largest', 'busiest'], 'lowest', 'word-choice', 'lowest = ต่ำสุด ตรงกับตัวเลข 4,300 ที่น้อยสุด ส่วน largest (ใหญ่สุด) และ busiest (ยุ่งสุด) ไม่เข้ากับปริมาณผลงานวิจัย'),
          t(' figure, at only 4,300, well below '),
          sel('gb11-b9', ['that', 'those', 'this'], 'that', 'referencing', 'that of Seoul National = ตัวเลขของ Seoul National ใช้ that แทนคำนามเอกพจน์ (figure) ส่วน those ใช้แทนพหูพจน์ และ this ต้องตามด้วยคำนาม'),
          t(' of Seoul National. Its '),
          sel('gb11-b10', ['total', 'totally', 'totalled'], 'total', 'word-choice', 'ต้องการคำคุณศัพท์ขยาย output จึงใช้ total (ทั้งหมด) ส่วน totally เป็น adverb และ totalled เป็นกริยา ผิดหน้าที่'),
          t(' output '),
          typ('gb11-b11', 'be', ['was'], 'verb-tense', 'ประธานเอกพจน์ (output) + เล่าอดีต จึงใช้ was'),
          t(' less than a tenth of '),
          sel('gb11-b12', ['that', 'those', 'them'], 'that', 'referencing', 'that of Oxford = ตัวเลขของ Oxford ใช้ that แทนคำนามเอกพจน์ (output) ส่วน those ใช้แทนพหูพจน์ และ them เป็นกรรม ไม่ใช้เทียบ'),
          t(' of Oxford, '),
          sel('gb11-b13', ['whereas', 'therefore', 'moreover'], 'whereas', 'transition', 'whereas = ในขณะที่ ใช้เทียบความต่างระหว่างสองฝ่าย ส่วน therefore (ดังนั้น) บอกผล และ moreover (ยิ่งกว่านั้น) เพิ่มข้อมูล ไม่ใช่การเทียบ'),
          t(' MIT '),
          typ('gb11-b14', 'stay', ['stayed'], 'verb-tense', 'ประธานเอกพจน์ MIT + เล่าอดีต จึงผัน stay เป็น stayed'),
          t(' a '),
          sel('gb11-b15', ['close', 'closely', 'closer'], 'close', 'word-choice', 'ต้องการคำคุณศัพท์ขยายคำนาม second จึงใช้ close (a close second = อันดับสองที่ตามมาติดๆ) ส่วน closely เป็น adverb และ closer เป็นรูปเทียบ ไม่เข้ากับ a...second'),
          t(' second. Oxford and MIT, '),
          typ('gb11-b16', 'produce', ['producing'], 'ving-clause', 'ใช้ V-ing clause (producing...) ขยายประโยคหลักเพื่อบอกผลที่ตามมา'),
          t(' the bulk of the papers, '),
          typ('gb11-b17', 'account', ['accounted'], 'verb-tense', 'ประธานพหูพจน์ + เล่าอดีต จึงผัน account เป็น accounted'),
          t(' for the '),
          sel('gb11-b18', ['vast', 'vastly', 'vastness'], 'vast', 'word-choice', 'ต้องการคำคุณศัพท์ขยาย majority จึงใช้ vast (the vast majority = ส่วนใหญ่มาก) ส่วน vastly เป็น adverb และ vastness เป็นคำนาม ผิดหน้าที่'),
          t(' majority of research recorded '),
          sel('gb11-b19', ['among', 'between', 'within'], 'among', 'word-choice', 'among = ท่ามกลาง ใช้กับสิ่งหลายกลุ่ม (5 มหาวิทยาลัย) ส่วน between เทียบสองสิ่ง และ within (ภายใน) คนละความหมาย'),
          t(' the five institutions.')
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
          sel('gb11-c1b', ['once again', 'at once', 'for once'], 'once again', 'word-choice', 'once again = อีกครั้ง เน้นว่า MIT นำอีกเช่นเดิม ส่วน at once (ทันที) และ for once (สักครั้ง) คนละความหมาย'),
          t(' '),
          typ('gb11-c2', 'achieve', ['achieved'], 'verb-tense', 'ประธานเอกพจน์ MIT + เล่าอดีต จึงผัน achieve เป็น achieved'),
          t(' the '),
          sel('gb11-c3', ['highest', 'higher', 'highly'], 'highest', 'word-choice', 'เทียบกับทุกมหาวิทยาลัยจึงใช้ขั้นสูงสุด highest ส่วน higher (กว่า) เทียบแค่สองสิ่ง และ highly เป็น adverb'),
          t(' satisfaction '),
          sel('gb11-c4', ['at', 'in', 'by'], 'at', 'word-choice', 'ระบุตัวเลขจุดเดียวใช้ at 91% ส่วน in และ by ไม่ใช้บอกค่าตัวเลขแบบนี้'),
          t(' 91% and employment at 97%, the '),
          sel('gb11-c4b', ['best', 'better', 'good'], 'best', 'word-choice', 'เทียบกับทุกมหาวิทยาลัยจึงใช้ขั้นสูงสุด the best ส่วน better (กว่า) เทียบแค่สองสิ่ง และ good เป็นรูปธรรมดา'),
          t(' scores in the table. Oxford and Seoul National '),
          typ('gb11-c5', 'follow', ['followed'], 'verb-tense', 'ประธานพหูพจน์ + เล่าอดีต จึงผัน follow เป็น followed'),
          t(' '),
          sel('gb11-c6', ['closely', 'close', 'closer'], 'closely', 'word-choice', 'ขยายกริยา followed จึงใช้ adverb closely (ตามมาติดๆ) ส่วน close เป็นคุณศัพท์ และ closer เป็นรูปเทียบ ผิดหน้าที่'),
          t(', '),
          sel('gb11-c7', ['whereas', 'therefore', 'also'], 'whereas', 'transition', 'whereas = ในขณะที่ ใช้เทียบความต่างระหว่าง Oxford/Seoul กับ Chulalongkorn ส่วน therefore (ดังนั้น) บอกผล และ also (อีกทั้ง) เพิ่มข้อมูล ไม่ใช่การเทียบ'),
          t(' Chulalongkorn '),
          typ('gb11-c8', 'remain', ['remained'], 'verb-tense', 'ประธานเอกพจน์ + เล่าอดีต จึงผัน remain เป็น remained'),
          t(' the '),
          sel('gb11-c9', ['lowest', 'lower', 'low'], 'lowest', 'word-choice', 'เทียบกับทุกมหาวิทยาลัยจึงใช้ขั้นสูงสุด lowest ส่วน lower (กว่า) เทียบแค่สองสิ่ง และ low เป็นรูปธรรมดา'),
          t(', '),
          sel('gb11-c10', ['with', 'from', 'about'], 'with', 'word-choice', 'with + คำนาม บอกรายละเอียดประกอบ (with figures below...) ส่วน from และ about ไม่เข้ากับโครงสร้างนี้'),
          t(' figures below '),
          sel('gb11-c11', ['those', 'that', 'them'], 'those', 'referencing', 'those of every other university = ตัวเลขของมหาวิทยาลัยอื่น ใช้ those แทนคำนามพหูพจน์ (figures) ส่วน that ใช้แทนเอกพจน์ และ them เป็นกรรม ไม่ใช้เทียบ'),
          t(' of every other university. '),
          sel('gb11-c12', ['Regarding', 'Although', 'Because'], 'Regarding', 'transition', 'Regarding = เกี่ยวกับ ใช้เปิดหัวข้อย่อยใหม่ ส่วน Although (แม้ว่า) และ Because (เพราะ) เป็นคำเชื่อมอนุประโยค ไม่ใช้เปิดหัวข้อ'),
          t(' international students, MIT '),
          typ('gb11-c13', 'attract', ['attracted'], 'verb-tense', 'ประธานเอกพจน์ MIT + เล่าอดีต จึงผัน attract เป็น attracted'),
          t(' the largest share, '),
          typ('gb11-c14', 'follow', ['followed'], 'v3-clause', 'ใช้โครงสร้าง followed by (V3) เพื่อไล่อันดับรองลงมา'),
          t(' by Oxford and Seoul National, '),
          sel('gb11-c15', ['while', 'so', 'and then'], 'while', 'transition', 'while = ในขณะที่ ใช้เทียบความต่างของ Chulalongkorn กับที่อื่น ส่วน so (ดังนั้น) บอกผล และ and then (แล้วจากนั้น) บอกลำดับเวลา ไม่ใช่การเทียบ'),
          t(' Chulalongkorn '),
          typ('gb11-c16', 'enrol', ['enrolled'], 'verb-tense', 'ประธานเอกพจน์ + เล่าอดีต จึงผัน enrol เป็น enrolled'),
          t(' the fewest, '),
          typ('gb11-c16b', 'keep', ['keeping'], 'ving-clause', 'ใช้ V-ing clause (keeping...) ขยายประโยคหลักเพื่อบอกผลที่ตามมา'),
          t(' it '),
          sel('gb11-c17', ['bottom', 'top', 'middle'], 'bottom', 'word-choice', 'bottom = อันดับล่างสุด ตรงกับข้อเท็จจริงว่า Chulalongkorn ต่ำสุดทุกด้าน ส่วน top (สูงสุด) และ middle (กลาง) ไม่ตรง'),
          t(' of every column. This pattern '),
          typ('gb11-c18', 'confirm', ['confirmed'], 'verb-tense', 'ประธานเอกพจน์ (this pattern) + เล่าอดีต จึงผัน confirm เป็น confirmed'),
          t(' the gap '),
          sel('gb11-c19', ['between', 'among', 'within'], 'between', 'word-choice', 'the gap between A and B = ช่องว่างระหว่างสองฝ่าย ใช้ between ส่วน among ใช้กับหลายกลุ่ม และ within (ภายใน) คนละความหมาย'),
          t(' the leading universities '),
          sel('gb11-c20', ['and', 'but', 'nor'], 'and', 'transition', 'A and B = เชื่อมสองฝ่ายที่เทียบกัน ใช้ and ส่วน but (แต่) และ nor (ทั้งไม่) ไม่เข้ากับโครงสร้าง the gap between...and'),
          t(' Chulalongkorn already '),
          typ('gb11-c21', 'see', ['seen'], 'v3-clause', 'ใช้ V3 (seen) เป็น reduced passive clause ขยาย gap (ช่องว่างที่เห็นแล้ว) หลัง already'),
          t(' in the other indicators.')
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
          sel('gb12-i1', ['illustrate', 'imagine', 'insist'], 'illustrate', 'paraphrase', 'illustrate = แสดง/บรรยายข้อมูลในกราฟ ส่วน imagine (จินตนาการ) กับ insist (ยืนกราน) เป็นการกระทำของคน ใช้บรรยายกราฟไม่ได้'),
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
          t(' 2023. The '),
          sel('gb12-i7', ['figures', 'stories', 'guesses'], 'figures', 'paraphrase', 'figures = ตัวเลข/สถิติ ตรงกับข้อมูลในกราฟ ส่วน stories (เรื่องเล่า) และ guesses (การเดา) ไม่ใช่ข้อมูลสถิติ'),
          t(' '),
          typ('gb12-i8', 'measure', ['are measured', 'were measured'], 'v3-clause', 'ตัวเลขถูกวัด/แสดงหน่วย จึงใช้ passive (are measured) เพราะประธาน figures ถูกกระทำ'),
          t(' in '),
          sel('gb12-i9', ['percentages', 'kilometres', 'degrees'], 'percentages', 'word-choice', 'สัดส่วนสัญชาตินับเป็น % จึงใช้ percentages ส่วน kilometres (ระยะทาง) และ degrees (องศา) ไม่เกี่ยวกับข้อมูลนี้'),
          t(', numbers of students, and pass rates.')
        ]
      },
      {
        id: 'gb12-overview',
        role: 'overview',
        labelTh: ROLE_LABEL_TH.overview,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('Overall, Chinese students '),
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
          t('The maps '),
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
          t(' from 2005 to 2025, '),
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
          t('Overall, a number of '),
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
            'observe',
            ['can be observed'],
            'v3-clause',
            'passive เดียวของ overview: transformations can be observed (= สามารถสังเกตได้)'
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
        // 2 sentences · 2 complexes only: 1) passive  2) while
        segments: [
          sel(
            'gb13-b1',
            ['Interestingly', 'Therefore', 'For example'],
            'Interestingly',
            'transition',
            'เปิดประโยคด้วย transition ที่อนุญาต: Interestingly / However / Likewise ฯลฯ'
          ),
          t(', the north of the town centre '),
          typ(
            'gb13-b2',
            'occupy',
            ['was occupied'],
            'v3-clause',
            'complex #1: past passive — the north was occupied by …'
          ),
          t(' by a large shopping mall and a car park. '),
          sel(
            'gb13-b3',
            ['Likewise', 'Therefore', 'For example'],
            'Likewise',
            'transition',
            'Likewise = ในทำนองเดียวกัน เปิดประโยคที่สองด้วย transition ที่อนุญาต'
          ),
          t(', an industrial zone filled the southwest, '),
          sel(
            'gb13-b4',
            ['while', 'because', 'unless'],
            'while',
            'transition',
            'complex #2: while เท่านั้น (ไม่ใช้ because/unless) สำหรับเปรียบเทียบพื้นที่'
          ),
          t(' a market and an open space lay to the south.')
        ]
      },
      {
        id: 'gb13-body2',
        role: 'body2',
        labelTh: ROLE_LABEL_TH.body2,
        hintTh: HINT_CONJUGATE,
        // 2 sentences · 2 complexes only: 1) passive + comma V3  2) whereas
        segments: [
          sel(
            'gb13-c1',
            ['However', 'Therefore', 'For example'],
            'However',
            'transition',
            'However = เปลี่ยนไปสู่สภาพหลังพัฒนา เปิดด้วย transition ที่อนุญาต'
          ),
          t(', the shopping mall and the car park '),
          typ(
            'gb13-c2',
            'demolish',
            ['were demolished'],
            'v3-clause',
            'complex #1: past passive — were demolished'
          ),
          t(', '),
          typ(
            'gb13-c3',
            'replace',
            ['replaced'],
            'v3-clause',
            'ต่อด้วย comma + V3 (replaced by …) ตามแบบ subject + verb, past participle'
          ),
          t(' by residential housing and a civic centre. '),
          sel(
            'gb13-c4',
            ['In contrast', 'Therefore', 'For example'],
            'In contrast',
            'transition',
            'In contrast = เทียบการเปลี่ยนแปลงพื้นที่อื่น เปิดด้วย transition ที่อนุญาต'
          ),
          t(', the industrial zone became a tech park, '),
          sel(
            'gb13-c5',
            ['whereas', 'because', 'so'],
            'whereas',
            'transition',
            'complex #2: whereas เปรียบต่าง — ไม่ใช้ because/so'
          ),
          t(' the market and the open space became a library and a park.')
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
          t('The diagram '),
          sel('gb14-i1', ['illustrates', 'insists', 'invents'], 'illustrates', 'paraphrase', 'illustrate = แสดง/บรรยายขั้นตอนในแผนภาพ ส่วน insist (ยืนกราน) และ invent (ประดิษฐ์) เป็นการกระทำของคน ใช้บรรยายไดอะแกรมไม่ได้'),
          t(' the '),
          sel('gb14-i2', ['process', 'promise', 'progress'], 'process', 'paraphrase', 'process = กระบวนการ/ขั้นตอน ตรงกับโจทย์ ส่วน promise (สัญญา) และ progress (ความก้าวหน้า) คนละความหมาย'),
          t(' by '),
          sel('gb14-i3', ['which', 'whom', 'whose'], 'which', 'referencing', 'ขยายคำนามสิ่งของ (process) ใช้ which ส่วน whom ใช้กับคน และ whose แสดงความเป็นเจ้าของ'),
          t(' instant coffee '),
          typ('gb14-i4', 'produce', ['is produced'], 'v3-clause', 'ประธาน instant coffee ถูกกระทำ + present จึงใช้ passive present: is + produced (V3)'),
          t('. In other words, it '),
          sel('gb14-i5', ['shows', 'show', 'showing'], 'shows', 'word-choice', 'ประธานเอกพจน์ (it) ใน present simple จึงเติม -s เป็น shows'),
          t(' how coffee cherries '),
          typ('gb14-i6', 'harvest', ['are harvested'], 'v3-clause', 'cherries ถูกเก็บเกี่ยว (ถูกกระทำ) พหูพจน์ + present จึงใช้ passive present: are + harvested'),
          t(' and '),
          typ('gb14-i7', 'turn', ['are gradually turned', 'are turned'], 'v3-clause', 'cherries ถูกเปลี่ยน (ถูกกระทำ) จึงใช้ passive present พหูพจน์: are + turned'),
          t(' into the '),
          sel('gb14-i8', ['finished', 'finishing', 'finish'], 'finished', 'word-choice', 'ใช้ V3 (finished) เป็นคุณศัพท์ = สำเร็จรูปแล้ว ส่วน finishing/finish วางหน้าคำนามไม่ได้'),
          t(' '),
          sel('gb14-i9', ['product', 'promise', 'protest'], 'product', 'paraphrase', 'product = ผลิตภัณฑ์ ที่เราซื้อ ส่วน promise (สัญญา) และ protest (ประท้วง) คนละความหมาย'),
          t(' we buy in shops. The whole '),
          sel('gb14-i10', ['procedure', 'person', 'picture'], 'procedure', 'word-choice', 'procedure = ขั้นตอนการทำงาน เป็นคำ paraphrase ของ process ส่วน person/picture ไม่เกี่ยว'),
          t(' '),
          typ('gb14-i11', 'complete', ['is completed'], 'v3-clause', 'procedure ถูกทำให้เสร็จ (ถูกกระทำ) เอกพจน์ + present จึงใช้ passive present: is + completed'),
          t(' in factories before the coffee '),
          typ('gb14-i12', 'pack', ['is packed'], 'v3-clause', 'coffee ถูกบรรจุ (ถูกกระทำ) เอกพจน์ + present จึงใช้ passive present: is + packed'),
          t(' and finally '),
          typ('gb14-i13', 'sell', ['is sold'], 'v3-clause', 'coffee ถูกขาย (ถูกกระทำ) เอกพจน์ + present จึงใช้ passive present: is + sold (V3 ของ sell)'),
          t('.')
        ]
      },
      {
        id: 'gb14-overview',
        role: 'overview',
        labelTh: ROLE_LABEL_TH.overview,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('Overall, the '),
          sel('gb14-o1', ['process', 'graph', 'pie'], 'process', 'paraphrase', 'ไดอะแกรมนี้เป็น process ไม่ใช่ graph หรือ pie chart จึงต้องใช้ process'),
          t(' '),
          typ('gb14-o2', 'consist', ['consists'], 'verb-tense', 'ประธานเอกพจน์ (the process) ใน present simple จึงเติม -s เป็น consists'),
          t(' of eight main '),
          sel('gb14-o3', ['stages', 'reasons', 'opinions'], 'stages', 'word-choice', 'stages = ขั้นตอน เหมาะกับ process ส่วน reasons/opinions ไม่เกี่ยวกับลำดับการผลิต'),
          t(', '),
          typ('gb14-o4', 'begin', ['beginning'], 'ving-clause', 'ใช้ V-ing clause ขยายความประโยคหลัก จึงใช้ beginning'),
          t(' with the '),
          sel('gb14-o5', ['harvesting', 'harvest', 'harvested'], 'harvesting', 'word-choice', 'หลัง with ต้องเป็นคำนาม จึงใช้ gerund harvesting (การเก็บเกี่ยว)'),
          t(' of coffee cherries and '),
          typ('gb14-o6', 'end', ['ending'], 'ving-clause', 'คู่ขนานกับ beginning จึงใช้ V-ing เช่นกัน: ending'),
          t(' with the '),
          sel('gb14-o7', ['packaging', 'planting', 'painting'], 'packaging', 'word-choice', 'packaging = การบรรจุ ตรงกับขั้นสุดท้าย ส่วน planting (การปลูก) และ painting (การทาสี) ไม่เกี่ยว'),
          t(' of the finished '),
          sel('gb14-o8', ['granules', 'liquids', 'cherries'], 'granules', 'word-choice', 'ผลผลิตสุดท้ายคือเม็ดกาแฟสำเร็จรูป (granules) ไม่ใช่ของเหลวหรือเชอร์รี'),
          t(', with the entire '),
          sel('gb14-o10', ['procedure', 'promise', 'protest'], 'procedure', 'paraphrase', 'procedure = ขั้นตอน paraphrase ของ process ส่วน promise/protest คนละความหมาย'),
          t(' '),
          typ('gb14-o11', 'carry', ['carried'], 'v3-clause', 'ใช้ with + noun + V3 (carried) เป็น reduced passive absolute clause ต่อท้ายประโยคหลัก จึงใช้ carried โดยไม่ต้องมี is'),
          t(' out in a fixed '),
          sel('gb14-o12', ['order', 'offer', 'answer'], 'order', 'word-choice', 'in a fixed order = ตามลำดับที่แน่นอน ส่วน offer (ข้อเสนอ) และ answer (คำตอบ) ไม่เข้ากับความหมาย'),
          t(', each stage '),
          typ('gb14-o13', 'complete', ['completed'], 'v3-clause', 'reduced passive clause ต่อขนานกัน จึงใช้ completed โดยไม่ต้องมี is'),
          t(' before the next one '),
          typ('gb14-o14', 'begin', ['begins'], 'verb-tense', 'ประธานเอกพจน์ (the next one) ใน present simple จึงเติม -s เป็น begins'),
          t(', so no step '),
          typ('gb14-o15', 'skip', ['is skipped'], 'v3-clause', 'step ถูกข้าม (ถูกกระทำ) เอกพจน์ + present จึงใช้ passive present: is + skipped'),
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
          t('.')
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
    id: 'gb-household-waste',
    promptId: 'snapshot-household-waste',
    steps: [
      {
        id: 'gb15-intro',
        role: 'intro',
        labelTh: ROLE_LABEL_TH.intro,
        hintTh: HINT_PARAPHRASE,
        segments: [
          t('The '),
          sel('gb15-i1', ['pie charts', 'pie chart', 'pie graphs'], 'pie charts', 'paraphrase', 'มีสองวงกลม (2008 และ 2018) จึงต้องใช้พหูพจน์ pie charts ส่วน pie chart (เอกพจน์) และ pie graphs (สะกดผิดชื่อกราฟ) ไม่ถูก'),
          t(' '),
          sel('gb15-i2', ['illustrate', 'insist', 'imagine'], 'illustrate', 'paraphrase', 'illustrate = แสดง/บรรยายข้อมูลในกราฟ ส่วน insist (ยืนกราน) และ imagine (จินตนาการ) เป็นการกระทำของคน ใช้บรรยายกราฟไม่ได้'),
          t(' the '),
          sel('gb15-i3', ['proportion', 'amount', 'total'], 'proportion', 'paraphrase', 'proportion = สัดส่วน/เปอร์เซ็นต์ เหมาะกับข้อมูลใน pie chart ส่วน amount ใช้กับสิ่งนับไม่ได้ และ total (ยอดรวม) ไม่ตรงความหมาย'),
          t(' of household waste that '),
          typ('gb15-i4', 'be', ['was'], 'verb-tense', 'ประธานเอกพจน์ (waste) + เล่าอดีต จึงใช้ was'),
          t(' '),
          typ('gb15-i5', 'recycle', ['recycled'], 'v3-clause', 'waste ถูกกระทำ (นำไปรีไซเคิล) จึงใช้ V3 recycled หลัง verb to be เป็น passive'),
          t(' '),
          sel('gb15-i6', ['compared with', 'compared to', 'comparing with'], 'compared with', 'word-choice', 'compared with = เมื่อเทียบกับ เป็นสำนวนคู่ที่ถูก ส่วน compared to ไม่นิยมเท่า และ comparing with ผิดรูปกริยา'),
          t(' waste that '),
          typ('gb15-i7', 'be', ['was'], 'verb-tense', 'ประธานเอกพจน์ (waste) + เล่าอดีต จึงใช้ was'),
          t(' not, '),
          sel('gb15-i8', ['in', 'on', 'at'], 'in', 'word-choice', 'บอกปีใช้ in 2008 ส่วน on/at ใช้กับวันหรือเวลานาฬิกา ไม่ใช่ปี'),
          t(' 2008 '),
          sel('gb15-i9', ['and', 'or', 'nor'], 'and', 'word-choice', 'เชื่อมสองปีที่เทียบกัน (2008 และ 2018) ใช้ and ส่วน or/nor ให้ความหมายเลือก/ปฏิเสธ'),
          t(' 2018.')
        ]
      },
      {
        id: 'gb15-overview',
        role: 'overview',
        labelTh: ROLE_LABEL_TH.overview,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel('gb15-o1', ['Overall', 'For example', 'In particular'], 'Overall', 'transition', 'Overall ใช้เปิดย่อหน้าสรุปภาพรวม ส่วน For example (ยกตัวอย่าง) และ In particular (เฉพาะเจาะจง) ไม่ใช่การสรุปรวม'),
          t(', it can be clearly observed that non-recycled waste '),
          sel(
            'gb15-o2',
            ['made up the vast majority', 'made up a small minority', 'made up roughly half'],
            'made up the vast majority',
            'word-choice',
            'ในปี 2008 ขยะไม่รีไซเคิลมีสัดส่วนสูงมาก (72%) จึงเป็น the vast majority ไม่ใช่ minority (ส่วนน้อย) หรือ half (ครึ่ง)'
          ),
          t(' of household waste '),
          sel('gb15-o3', ['at the start of the period', 'by the end of the period', 'throughout the period'], 'at the start of the period', 'word-choice', 'ข้อมูล 2008 คือจุดเริ่มต้นของช่วงเวลาที่เปรียบเทียบ จึงใช้ at the start of the period'),
          t(', '),
          sel('gb15-o4', ['whereas', 'because', 'so'], 'whereas', 'transition', 'whereas ใช้เปรียบเทียบสองด้านที่ต่างกัน (2008 vs 2018) ส่วน because/so บอกเหตุ-ผล ไม่ใช่การเปรียบเทียบ'),
          t(' recycled waste '),
          typ('gb15-o5', 'overtake', ['overtook'], 'verb-tense', 'overtake เป็นกริยาผันไม่ปกติ อดีตคือ overtook + ประธานเอกพจน์ เล่าอดีต'),
          t(' non-recycled waste '),
          sel('gb15-o6', ['to become', 'becoming', 'became'], 'to become', 'word-choice', 'overtook X to become Y = แซง X จนกลายเป็น Y ใช้ to-infinitive ต่อจากกริยาหลัก'),
          t(' the majority '),
          sel('gb15-o7', ['by the end of the period', 'at the start of the period', 'in the middle of the period'], 'by the end of the period', 'word-choice', 'ข้อมูล 2018 คือจุดสิ้นสุดของช่วงเวลาที่เปรียบเทียบ จึงใช้ by the end of the period'),
          t('.')
        ]
      },
      {
        id: 'gb15-body1',
        role: 'body1',
        labelTh: ROLE_LABEL_TH.body1,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel('gb15-b1', ['In 2008', 'By 2018', 'Since 2008'], 'In 2008', 'transition', 'In 2008 = ณ ปีเริ่มต้น เหมาะเปิดการเล่าข้อมูลปีแรก ส่วน By 2018 (พอถึง 2018) และ Since 2008 (ตั้งแต่ 2008) ไม่เข้ากับการบรรยายจุดเริ่ม'),
          t(', non-recycled waste '),
          typ('gb15-b2', 'account', ['accounted'], 'verb-tense', 'past simple เพราะเล่าข้อมูลปี 2008 ที่ผ่านไปแล้ว + ประธานเอกพจน์ จึงใช้ accounted'),
          t(' for the '),
          sel('gb15-b3', ['vast', 'vague', 'various'], 'vast', 'word-choice', 'the vast majority = ส่วนใหญ่อย่างมาก ตรงกับ 72% ส่วน vague (คลุมเครือ) และ various (หลากหลาย) ผิดความหมาย'),
          t(' majority of household waste, '),
          typ('gb15-b4', 'stand', ['standing'], 'ving-clause', 'ใช้ V-ing clause (standing) ขยายผลของประโยคหลัก บอกตัวเลขที่ยืนอยู่'),
          t(' at 72%, '),
          sel('gb15-b5', ['while', 'because', 'so that'], 'while', 'transition', 'while ใช้เปรียบเทียบสองสัดส่วนตรงข้ามในประโยคเดียว (ไม่รีไซเคิลมาก / รีไซเคิลน้อย) ส่วน because/so that บอกเหตุผล/จุดประสงค์'),
          t(' recycled waste '),
          typ('gb15-b6', 'make', ['made'], 'verb-tense', 'past simple เล่าอดีต + ประธานเอกพจน์ ใช้ made (make up = ประกอบเป็น)'),
          t(' up just the '),
          sel('gb15-b7', ['remaining', 'remained', 'remain'], 'remaining', 'word-choice', 'the remaining 28% = ส่วนที่เหลืออีก 28% ใช้ remaining เป็นคุณศัพท์ขยาย 28% ส่วน remained/remain เป็นกริยา ผิดตำแหน่ง'),
          t(' 28%. '),
          sel('gb15-b8', ['This figure', 'This figures', 'These figure'], 'This figure', 'referencing', 'This figure (เอกพจน์) ต้องใช้ this + figure เอกพจน์ให้ตรงกัน ส่วนสองตัวเลือกอื่นผิดพจน์'),
          t(' '),
          sel('gb15-b9', ['reflected', 'reflects', 'reflecting'], 'reflected', 'verb-tense', 'เล่าอดีต ประธานเอกพจน์ (this figure) จึงใช้ past simple reflected'),
          t(' the relatively limited recycling '),
          sel('gb15-b10', ['habits', 'habit', 'habitat'], 'habits', 'word-choice', 'recycling habits = พฤติกรรมการรีไซเคิล (พหูพจน์) ส่วน habit (เอกพจน์) และ habitat (ที่อยู่อาศัยของสัตว์) ผิดความหมาย/รูป'),
          t(' of households at that time.')
        ]
      },
      {
        id: 'gb15-body2',
        role: 'body2',
        labelTh: ROLE_LABEL_TH.body2,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel('gb15-c1', ['By 2018', 'In 2008', 'Until 2008'], 'By 2018', 'transition', 'By 2018 = พอถึงปี 2018 เหมาะเปิดการเล่าข้อมูลปีถัดไป ส่วน In 2008 (ปีเก่า) และ Until 2008 (จนถึง 2008) ไม่ตรงความหมาย'),
          t(', however, this pattern '),
          typ('gb15-c2', 'reverse', ['had reversed'], 'verb-tense', 'เล่าเหตุการณ์ที่เกิดก่อนเวลาที่กำลังพูดถึงในอดีต จึงใช้ past perfect (had reversed) เพื่อบอกว่ารูปแบบเปลี่ยนไปแล้วก่อนถึงปี 2018'),
          t(' considerably: recycled waste '),
          typ('gb15-c3', 'make', ['made'], 'verb-tense', 'past simple เล่าอดีต + ประธานเอกพจน์ ใช้ made (make up = ประกอบเป็น)'),
          t(' up 58% of the total, '),
          typ('gb15-c4', 'overtake', ['overtaking'], 'ving-clause', 'ใช้ V-ing clause (overtaking) ขยายผลของประโยคหลัก บอกว่าขยะรีไซเคิล "แซง" ขยะไม่รีไซเคิลไปแล้ว'),
          t(' non-recycled waste, '),
          sel('gb15-c5', ['which', 'who', 'where'], 'which', 'referencing', 'which ใช้แทนสิ่งของ (non-recycled waste) ส่วน who ใช้กับคน และ where ใช้กับสถานที่'),
          t(' '),
          typ('gb15-c6', 'fall', ['fell'], 'verb-tense', 'fall เป็นกริยาผันไม่ปกติ อดีตคือ fell + ประธานเอกพจน์ (which อ้างถึง waste) เล่าอดีต'),
          t(' to just 42%. '),
          sel('gb15-c7', ['This', 'These', 'Those'], 'This', 'referencing', 'This ใช้แทนเหตุการณ์/ประเด็นที่พูดไปแล้วทั้งหมด (เอกพจน์) ส่วน These/Those ใช้กับพหูพจน์'),
          t(' '),
          typ('gb15-c8', 'represent', ['represented'], 'verb-tense', 'เล่าอดีต ประธานเอกพจน์ (This) จึงผัน represent เป็น represented'),
          t(' a '),
          sel('gb15-c9', ['marked', 'marking', 'marks'], 'marked', 'word-choice', 'a marked improvement = การพัฒนาที่เห็นได้ชัด ใช้ marked เป็นคุณศัพท์ขยาย improvement'),
          t(' improvement '),
          sel('gb15-c10', ['over', 'since', 'within'], 'over', 'word-choice', 'over the ten-year period = ตลอดช่วงสิบปี ใช้ over บอกช่วงเวลาที่ครอบคลุม ส่วน since/within ไม่เข้ากับโครงสร้างนี้'),
          t(' the ten-year period, '),
          sel('gb15-c11', ['suggesting', 'suggested', 'suggests'], 'suggesting', 'ving-clause', 'ใช้ V-ing clause (suggesting) ขยายผลสรุปต่อจากประโยคหลัก'),
          t(' a substantial shift in household attitudes '),
          sel('gb15-c12', ['towards', 'against', 'without'], 'towards', 'word-choice', 'attitudes towards recycling = ทัศนคติที่มีต่อการรีไซเคิล ใช้ towards ส่วน against (ต่อต้าน) และ without (ปราศจาก) ผิดความหมาย'),
          t(' recycling.')
        ]
      }
    ]
  },

{
    id: 'gb-museum-visitors',
    promptId: 'snapshot-museum-visitors',
    steps: [
      {
        id: 'gb16-intro',
        role: 'intro',
        labelTh: ROLE_LABEL_TH.intro,
        hintTh: HINT_PARAPHRASE,
        segments: [
          t('The bar chart '),
          sel('gb16-i1', ['illustrates', 'believes', 'guesses'], 'illustrates', 'paraphrase', 'illustrate = แสดง/บรรยายข้อมูลในกราฟ ส่วน believe (เชื่อ) และ guess (เดา) เป็นการกระทำของคน ใช้บรรยายกราฟไม่ได้'),
          t(' the average '),
          sel('gb16-i2', ['number', 'percentage', 'share'], 'number', 'paraphrase', 'หน่วยเป็น thousand visitors (จำนวนคน) จึงใช้ number ส่วน percentage/share ใช้กับสัดส่วน % ซึ่งไม่ตรงกับข้อมูล'),
          t(' of visitors '),
          sel('gb16-i3', ['per', 'a', 'each'], 'per', 'word-choice', 'per month = ต่อเดือน เป็นสำนวนบอกความถี่ ส่วน a/each month ไม่เข้ากับโครงสร้างนี้'),
          t(' month '),
          sel('gb16-i4', ['to', 'for', 'of'], 'to', 'word-choice', 'visitors to a place = ผู้มาเยือนสถานที่นั้น ใช้ to เสมอ ส่วน for/of ไม่เข้ากับ visitors ในบริบทนี้'),
          t(' three London museums: the British Museum, the Science Museum, '),
          sel('gb16-i5', ['and', 'but', 'or'], 'and', 'word-choice', 'ไล่รายชื่อพิพิธภัณฑ์สามแห่ง จึงใช้ and เชื่อมตัวสุดท้าย ส่วน but/or ให้ความหมายผิด'),
          t(' the Natural History Museum, '),
          sel('gb16-i6', ['measured', 'measuring', 'measure'], 'measured', 'word-choice', 'ตัวเลขถูกวัด (ถูกกระทำ) จึงใช้ V3 แบบ passive คือ measured; measuring/measure ให้ความหมายว่าตัวเลขไปวัดเอง ผิด'),
          t(' in '),
          sel('gb16-i7', ['thousands', 'thousand', 'thousandth'], 'thousands', 'word-choice', 'สำนวน in thousands of visitors (หลักพัน) ต้องเติม s เป็นพหูพจน์เสมอ'),
          t(' of visitors.')
        ]
      },
      {
        id: 'gb16-overview',
        role: 'overview',
        labelTh: ROLE_LABEL_TH.overview,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('Overall, it can be clearly observed that the British Museum '),
          typ('gb16-o1', 'attract', ['attracted'], 'verb-tense', 'ประธานเอกพจน์ (the British Museum) + เล่าอดีต จึงใช้ attracted'),
          t(' by '),
          sel('gb16-o2', ['far', 'much', 'very'], 'far', 'degree-adverb', 'attracted by far the most = ดึงดูดมากที่สุดอย่างชัดเจน ใช้ by far ขยาย superlative เสมอ ส่วน much/very ไม่เข้ากับโครงสร้างนี้'),
          t(' the '),
          sel('gb16-o3', ['most', 'more', 'much'], 'most', 'word-choice', 'เทียบสามพิพิธภัณฑ์ ใช้ขั้นสุด most ไม่ใช่ more (ขั้นกว่า)'),
          t(' visitors of the three museums, '),
          sel('gb16-o4', ['whereas', 'because', 'so'], 'whereas', 'transition', 'whereas ใช้เปรียบเทียบสองด้านที่ต่างกัน (สูงสุด vs ต่ำสุด) ส่วน because/so บอกเหตุ-ผล ไม่ใช่การเปรียบเทียบ'),
          t(' the Science Museum '),
          typ('gb16-o5', 'record', ['recorded'], 'verb-tense', 'ประธานเอกพจน์ (the Science Museum) + เล่าอดีต จึงใช้ recorded'),
          t(' the '),
          sel('gb16-o6', ['fewest', 'least', 'lowest'], 'fewest', 'word-choice', 'fewest visitors = ผู้เยี่ยมชมน้อยที่สุด (นับได้) ใช้ fewest ส่วน least ใช้กับนามนับไม่ได้ และ lowest มักใช้กับตัวเลข/ระดับ ไม่ใช่จำนวนคนโดยตรง'),
          t(' visitors, with the Natural History Museum '),
          sel('gb16-o7', ['positioned', 'positioning', 'position'], 'positioned', 'word-choice', 'ใช้ V3 (positioned) เป็น passive ลดรูป ขยาย Natural History Museum ว่า "ถูกจัดอยู่" ระหว่างสองแห่ง'),
          t(' in between.')
        ]
      },
      {
        id: 'gb16-body1',
        role: 'body1',
        labelTh: ROLE_LABEL_TH.body1,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('In terms of the British Museum, it '),
          typ('gb16-b1', 'receive', ['received'], 'verb-tense', 'ประธานเอกพจน์ (it) + เล่าอดีต จึงใช้ received'),
          t(' an average of 180,000 visitors '),
          sel('gb16-b2', ['per', 'a', 'each'], 'per', 'word-choice', 'per month = ต่อเดือน เป็นสำนวนบอกความถี่ ส่วน a/each month ไม่เข้ากับโครงสร้างนี้'),
          t(' month, '),
          sel('gb16-b3', ['making', 'made', 'makes'], 'making', 'ving-clause', 'ใช้ V-ing clause (making) ขยายผลของประโยคหลัก'),
          t(' it '),
          sel('gb16-b4', ['comfortably', 'comfortable', 'comfort'], 'comfortably', 'word-choice', 'ขยายกริยา making ต้องใช้ adverb (comfortably) ส่วน comfortable (adj) และ comfort (n) ผิดหน้าที่'),
          t(' the most-visited '),
          sel('gb16-b5', ['venue', 'vein', 'vent'], 'venue', 'word-choice', 'venue = สถานที่จัดงาน/สถานที่ ตรงกับความหมาย ส่วน vein (เส้นเลือด) และ vent (ช่องระบาย) คนละความหมาย'),
          t(' of the three. '),
          sel('gb16-b6', ['This', 'These', 'Those'], 'This', 'referencing', 'This ใช้แทนตัวเลข/ประเด็นเอกพจน์ที่กล่าวไปแล้ว ส่วน These/Those ใช้กับพหูพจน์'),
          t(' '),
          sel('gb16-b7', ['figure', 'figures', 'figuring'], 'figure', 'word-choice', 'this figure = ตัวเลขนี้ (เอกพจน์) จึงใช้ figure ส่วน figures/figuring ผิดรูป'),
          t(' '),
          typ('gb16-b8', 'be', ['was'], 'verb-tense', 'เล่าอดีต ประธานเอกพจน์ (this figure) จึงใช้ was'),
          t(' almost '),
          sel('gb16-b9', ['twice', 'once', 'half'], 'twice', 'word-choice', '180,000 มากกว่า 95,000 เกือบสองเท่า จึงใช้ twice ส่วน once (หนึ่งครั้ง) และ half (ครึ่ง) ผิดความหมาย'),
          t(' '),
          sel('gb16-b10', ['that', 'those', 'it'], 'that', 'referencing', 'that = แทนคำนามเอกพจน์ (the figure) ที่จะพูดถึงต่อไป จึง that of the Science Museum ส่วน those ใช้กับพหูพจน์ และ it ไม่ตามด้วย of แบบนี้'),
          t(' of the Science Museum.')
        ]
      },
      {
        id: 'gb16-body2',
        role: 'body2',
        labelTh: ROLE_LABEL_TH.body2,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('Regarding the other two museums, the Natural History Museum '),
          typ('gb16-c1', 'welcome', ['welcomed'], 'verb-tense', 'ประธานเอกพจน์ (the Natural History Museum) + เล่าอดีต จึงใช้ welcomed'),
          t(' 145,000 visitors '),
          sel('gb16-c2', ['per', 'a', 'each'], 'per', 'word-choice', 'per month = ต่อเดือน เป็นสำนวนบอกความถี่ ส่วน a/each month ไม่เข้ากับโครงสร้างนี้'),
          t(' month, '),
          sel('gb16-c3', ['placing', 'placed', 'places'], 'placing', 'ving-clause', 'ใช้ V-ing clause (placing) ขยายผลของประโยคหลัก บอกว่าตัวเลขนี้จัดให้อยู่ในอันดับใด'),
          t(' it '),
          sel('gb16-c4', ['second', 'secondly', 'seconds'], 'second', 'word-choice', 'placing it second = จัดให้อยู่อันดับสอง ใช้ second (เลขลำดับ) ส่วน secondly (คำเชื่อม) และ seconds (วินาที) ผิดรูป'),
          t(' among the three venues. '),
          sel('gb16-c5', ['By contrast', 'For example', 'In addition'], 'By contrast', 'transition', 'By contrast = ในทางตรงข้าม ใช้เปรียบเทียบกับพิพิธภัณฑ์ที่ตัวเลขต่ำสุด ส่วน For example (ยกตัวอย่าง) และ In addition (นอกจากนี้) ไม่ตรงความหมาย'),
          t(', the Science Museum '),
          typ('gb16-c6', 'lag', ['lagged'], 'verb-tense', 'เล่าอดีต ประธานเอกพจน์ (the Science Museum) จึงผัน lag เป็น lagged'),
          t(' behind both '),
          sel('gb16-c7', ['considerably', 'considerable', 'consider'], 'considerably', 'degree-adverb', 'lagged behind considerably = ตามหลังอยู่มาก ใช้ adverb considerably ขยายกริยา ส่วน considerable (adj) และ consider (v) ผิดหน้าที่'),
          t(', '),
          typ('gb16-c8', 'attract', ['attracting'], 'ving-clause', 'ใช้ V-ing clause (attracting) ขยายผลของประโยคหลัก'),
          t(' just 95,000 visitors '),
          sel('gb16-c9', ['per', 'a', 'each'], 'per', 'word-choice', 'per month = ต่อเดือน เป็นสำนวนบอกความถี่ ส่วน a/each month ไม่เข้ากับโครงสร้างนี้'),
          t(' month, roughly half '),
          sel('gb16-c10', ['that', 'those', 'it'], 'that', 'referencing', 'that = แทนคำนามเอกพจน์ (the figure) ที่พูดถึงไปแล้ว จึง that of the British Museum ส่วน those ใช้กับพหูพจน์ และ it ไม่ตามด้วย of แบบนี้'),
          t(' of the British Museum.')
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
          sel('gb17-i1', ['show', 'claim', 'wonder'], 'show', 'paraphrase', 'show = แสดง/นำเสนอข้อมูลในกราฟ ส่วน claim (อ้าง) และ wonder (สงสัย) เป็นการกระทำของคน ใช้บรรยายกราฟไม่ได้'),
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
          t('Overall, it can be clearly observed that the private car '),
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
          t(' roughly halfway through '),
          sel('gb17-o6', ['before', 'because', 'while'], 'before', 'word-choice', 'ลำดับเหตุการณ์คือตกลงก่อนแล้วค่อยฟื้นตัว ใช้ before บอกลำดับเวลา'),
          t(' '),
          typ('gb17-o7', 'recover', ['recovering'], 'ving-clause', 'หลัง before ที่ทำหน้าที่ขยายความ ใช้รูป V-ing คือ recovering'),
          t(' to a new high by the end of the period.')
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
          sel('gb17-b7', ['By comparison', 'For example', 'In addition'], 'By comparison', 'transition', 'By comparison = เมื่อเทียบกัน ใช้เปรียบเทียบกับสองวิธีที่ตัวเลขต่ำสุด ส่วน For example (ยกตัวอย่าง) และ In addition (นอกจากนี้) ไม่ตรงความหมาย'),
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
          t('The maps '),
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
          t(' of a tourist resort, '),
          typ(
            'gb18-i4',
            'focus',
            ['focusing'],
            'ving-clause',
            'หลังคอมมาใช้ V-ing (focusing) เป็น complex structure เดียวของบทนำ'
          ),
          t(' on new facilities added to the land.')
        ]
      },
      {
        id: 'gb18-overview',
        role: 'overview',
        labelTh: ROLE_LABEL_TH.overview,
        hintTh: HINT_CONJUGATE,
        // 1 sentence · 1 complex (passive: can be observed)
        segments: [
          t('Overall, a number of '),
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
            'observe',
            ['can be observed'],
            'v3-clause',
            'passive เดียวของ overview: transformations can be observed'
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
        // 2 sentences · 2 complexes only: 1) passive  2) while
        segments: [
          sel(
            'gb18-b1',
            ['Interestingly', 'Therefore', 'For example'],
            'Interestingly',
            'transition',
            'เปิดประโยคด้วย transition ที่อนุญาต'
          ),
          t(', the island '),
          typ(
            'gb18-b2',
            'cover',
            ['was covered'],
            'v3-clause',
            'complex #1: past passive — the island was covered by open land'
          ),
          t(' almost entirely by open land. '),
          sel(
            'gb18-b3',
            ['Likewise', 'Therefore', 'For example'],
            'Likewise',
            'transition',
            'Likewise = ในทำนองเดียวกัน เปิดประโยคที่สองด้วย transition ที่อนุญาต'
          ),
          t(', a narrow beach ran along the southern edge, '),
          sel(
            'gb18-b4',
            ['while', 'because', 'unless'],
            'while',
            'transition',
            'complex #2: while เท่านั้น สำหรับเปรียบเทียบ'
          ),
          t(' no other buildings yet existed on the island.')
        ]
      },
      {
        id: 'gb18-body2',
        role: 'body2',
        labelTh: ROLE_LABEL_TH.body2,
        hintTh: HINT_CONJUGATE,
        // 2 sentences · 2 complexes only: 1) passive  2) whereas + passive kept inside whereas clause as one contrast unit
        // Count: were constructed (1), whereas (2). Remaining clause uses simple past "remained".
        segments: [
          sel(
            'gb18-c1',
            ['However', 'Therefore', 'For example'],
            'However',
            'transition',
            'However = เปลี่ยนไปสู่สภาพหลังสร้างรีสอร์ท'
          ),
          t(', a reception building, a restaurant, guest huts and a pier '),
          typ(
            'gb18-c2',
            'construct',
            ['were constructed'],
            'v3-clause',
            'complex #1: past passive — were constructed (build/construction vocab)'
          ),
          t(' on the island. '),
          sel(
            'gb18-c3',
            ['In contrast', 'Therefore', 'For example'],
            'In contrast',
            'transition',
            'In contrast = เทียบส่วนที่ไม่ถูกทำลาย'
          ),
          t(', the beach remained unchanged along the southern edge, '),
          sel(
            'gb18-c4',
            ['whereas', 'because', 'so'],
            'whereas',
            'transition',
            'complex #2: whereas เท่านั้น — เปรียบกับพื้นที่โล่งตรงกลาง'
          ),
          t(' open land still occupied the centre.')

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
          sel('gb19-i1', ['illustrates', 'insists', 'invents'], 'illustrates', 'paraphrase', 'illustrate = แสดง/บรรยายขั้นตอนในแผนภาพ ส่วน insist (ยืนกราน) และ invent (ประดิษฐ์) เป็นการกระทำของคน ใช้บรรยายไดอะแกรมไม่ได้'),
          t(' the '),
          sel('gb19-i2', ['process', 'promise', 'progress'], 'process', 'paraphrase', 'process = กระบวนการ/ขั้นตอน ตรงกับโจทย์ ส่วน promise (สัญญา) และ progress (ความก้าวหน้า) คนละความหมาย'),
          t(' by '),
          sel('gb19-i3', ['which', 'whom', 'whose'], 'which', 'referencing', 'ขยายคำนามสิ่งของ (process) ใช้ which ส่วน whom ใช้กับคน และ whose แสดงความเป็นเจ้าของ'),
          t(' plastic '),
          typ('gb19-i4', 'recycle', ['is recycled'], 'v3-clause', 'ประธาน plastic ถูกกระทำ + present จึงใช้ passive present: is + recycled (V3)'),
          t('. In other words, it '),
          sel('gb19-i5', ['shows', 'show', 'showing'], 'shows', 'word-choice', 'ประธานเอกพจน์ (it) ใน present simple จึงเติม -s เป็น shows'),
          t(' how used plastic '),
          typ('gb19-i6', 'collect', ['is collected'], 'v3-clause', 'plastic ถูกเก็บรวบรวม (ถูกกระทำ) เอกพจน์ + present จึงใช้ passive present: is + collected'),
          t(' and '),
          typ('gb19-i7', 'turn', ['is gradually turned', 'is turned'], 'v3-clause', 'plastic ถูกเปลี่ยน (ถูกกระทำ) จึงใช้ passive present เอกพจน์: is + turned'),
          t(' into new plastic '),
          sel('gb19-i8', ['products', 'produces', 'produced'], 'products', 'word-choice', 'new plastic products = สินค้าพลาสติกใหม่ ต้องใช้คำนาม products ส่วน produces/produced เป็นกริยา ผิดหน้าที่'),
          t('. The whole '),
          sel('gb19-i9', ['procedure', 'person', 'picture'], 'procedure', 'word-choice', 'procedure = ขั้นตอนการทำงาน เป็นคำ paraphrase ของ process ส่วน person/picture ไม่เกี่ยว'),
          t(' '),
          typ('gb19-i10', 'complete', ['is completed'], 'v3-clause', 'procedure ถูกทำให้เสร็จ (ถูกกระทำ) เอกพจน์ + present จึงใช้ passive present: is + completed'),
          t(' in a recycling facility before the new products '),
          typ('gb19-i11', 'distribute', ['are distributed'], 'v3-clause', 'products ถูกจัดส่ง (ถูกกระทำ) พหูพจน์ + present จึงใช้ passive present: are + distributed'),
          t(' to shops.')
        ]
      },
      {
        id: 'gb19-overview',
        role: 'overview',
        labelTh: ROLE_LABEL_TH.overview,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('Overall, the '),
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

export const getWritingGuidedBuilder = (promptId: string): WgbExercise | null =>
  WRITING_GUIDED_BUILDERS.find((exercise) => exercise.promptId === promptId) ||
  EXTRA_MAP_GUIDED_BUILDERS.find((exercise) => exercise.promptId === promptId) ||
  null

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
