// Guided, step-by-step IELTS Writing Task 2 essay builder.
//
// Parallel to writingGuidedBuilder.ts (Task 1), but with its own schema because Task 2 has
// no chart, uses intro/body1/body2/body3/conclusion roles, and needs a THIRD blank kind —
// `comma` — for comma-placement practice. Each exercise walks a student through one model
// essay from writingTask2Data.ts, one paragraph at a time, mixing:
//   - `type`   : fill-in-the-blank testing verb conjugation or singular/plural noun form.
//   - `select` : a dropdown testing transition-word choice or article choice (a/the/nothing).
//   - `comma`  : a tap-to-place blank — text is split into chunks at candidate gap positions,
//                the student taps the ONE gap where a comma belongs.
//
// Reconstructing every blank's correct answer must reproduce the matching essay text in
// writingTask2Data.ts EXACTLY (see assembleTask2Essay).

import type { WritingTask2Role } from './writingTask2Data'

export type Wgb2Focus = 'verb-tense' | 'plural' | 'transition' | 'article' | 'comma'

// Sentinel option for article blanks where no article should be inserted at all.
export const WGB2_NO_ARTICLE = '(ไม่ต้องใส่)'

export type Wgb2SelectBlank = {
  kind: 'select'
  id: string
  options: string[]
  answer: string
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
}

export type Wgb2CommaBlank = {
  kind: 'comma'
  id: string
  chunks: string[]
  correctGap: number
  focus: 'comma'
  explain?: string
}

export type Wgb2Blank = Wgb2SelectBlank | Wgb2TypeBlank | Wgb2CommaBlank

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
const comma2 = (
  id: string,
  chunks: string[],
  correctGap: number,
  explain?: string
): Wgb2Segment => ({ kind: 'blank', blank: { kind: 'comma', id, chunks, correctGap, focus: 'comma', explain } })

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
    'Introduction ย่อหน้านี้วางจุดยืนของเรา เช็คทีละช่อง: ① เอกพจน์/พหูพจน์ของคำนาม ② กริยาให้ตรง tense ③ a/the/ไม่ใส่คำนำหน้า ④ ต้องมี comma ไหม',
  body1:
    'Body 1 คือมุมมองฝั่งตรงข้าม (concession) — เช็ค: ① คำเชื่อมประโยค (transition) เลือกให้เข้ากับความหมาย ② เอกพจน์/พหูพจน์ ③ กริยา ④ a/the/ไม่ใส่ ⑤ comma หลังวลีขึ้นต้นประโยค',
  body2:
    'Body 2 คือความเห็นของเรา (rebuttal) — เช็คแบบเดียวกับ Body 1: transition, plural, verb-tense, article, comma — โดยเฉพาะ comma หน้า which-clause แบบไม่จำกัดความ',
  body3:
    'Body 3 (ถ้ามี) คือการขยายความเห็นส่วนตัวเพิ่มเติมด้วยตัวอย่างที่เจาะจง — เช็คแบบเดียวกับย่อหน้าอื่น',
  conclusion:
    'Conclusion สรุปด้วยรูปแบบ "although..., I am of the opinion that..., as..." — เช็ค plural, article, และ comma หน้า as-clause ให้ครบ'
}

export const WGB2_BLANK_COACH_TH: Record<Wgb2Focus, string> = {
  'verb-tense': 'ดูประธานและโครงสร้างประโยครอบข้าง (active/passive) แล้วผันกริยาในวงเล็บให้ตรง',
  plural: 'นับดูว่าคำนามนี้เอกพจน์หรือพหูพจน์จากบริบท (เช่น "many", "these", "of a growing population")',
  transition:
    'อ่านประโยคก่อนหน้าก่อน — ประโยคนี้กำลัง "ยกตัวอย่าง" "สรุปผล" หรือ "ขัดแย้ง"? เลือกคำเชื่อมที่ตรงความหมาย',
  article:
    'ดูว่าคำนามนี้ถูกกล่าวถึงครั้งแรกแบบทั่วไป (a) เจาะจงแบบที่รู้กันแล้ว (the) หรือเป็นคำพหูพจน์ทั่วไปที่ไม่ต้องมีคำนำหน้าเลย',
  comma:
    'แตะช่องว่างระหว่างคำที่คิดว่าควรมี comma — ปกติ comma จะตามหลังวลีขึ้นต้นประโยค (introductory phrase) หรือหน้า which-clause ที่ไม่ได้จำกัดความ'
}

// ── exercises ──────────────────────────────────────────────────────────
export const WGB2_EXERCISES: Wgb2Exercise[] = [
  {
    id: 'gb2-old-buildings',
    promptId: 't2-twe-1',
    steps: [
      {
        id: 'gb2-ob-intro',
        role: 'intro',
        labelTh: WGB2_ROLE_LABEL_TH.intro,
        segments: [
          t2('It has been widely argued that while some old '),
          typ2('t2-twe-1-i1', 'construction', ['constructions'], 'plural', 'มี "some old" นำหน้า และพูดถึงสิ่งก่อสร้างหลายแห่งทั่วไป จึงต้องเป็นพหูพจน์'),
          t2(' may appear '),
          comma2(
            't2-twe-1-i2',
            ['outdated', 'maintaining', 'them'],
            0,
            'ประโยคขึ้นต้นด้วย while-clause ("while...outdated") จบแล้วต้องมี comma ก่อนประธานใหม่ ("maintaining them...")'
          ),
          t2(' '),
          typ2('t2-twe-1-i3', 'be', ['is'], 'verb-tense', 'ประธานคือ "maintaining them" (gerund phrase) นับเป็นเอกพจน์ จึงใช้ is'),
          t2(' essential for preserving '),
          sel2('t2-twe-1-i4', ['a', 'the', WGB2_NO_ARTICLE], 'a', 'article', '"a country" พูดถึงประเทศทั่วไปแบบไม่เจาะจง จึงใช้ a'),
          t2(
            " country's history and cultural identity. Others argue that pulling down these structures and replacing them with modern buildings would better meet the practical "
          ),
          typ2('t2-twe-1-i5', 'need', ['needs'], 'plural', '"the practical needs of a growing population" เป็นพหูพจน์เสมอในความหมายนี้'),
          t2(' of '),
          sel2('t2-twe-1-i6', ['a', 'the', WGB2_NO_ARTICLE], 'a', 'article', '"a growing population" พูดถึงประชากรทั่วไป ไม่เจาะจงประเทศใดประเทศหนึ่ง จึงใช้ a'),
          t2(' growing population. I personally believe that historic buildings should be '),
          typ2('t2-twe-1-i7', 'preserve', ['preserved'], 'verb-tense', 'โครงสร้าง passive voice "should be + V3" จึงต้องใช้ preserved'),
          t2(', and my reasons will be elaborated on in the following paragraphs.')
        ]
      },
      {
        id: 'gb2-ob-body1',
        role: 'body1',
        labelTh: WGB2_ROLE_LABEL_TH.body1,
        segments: [
          t2('To begin with, it might seem sensible for some to claim that old '),
          typ2('t2-twe-1-b1a', 'building', ['buildings'], 'plural', 'พูดถึงอาคารเก่าโดยทั่วไปหลายหลัง จึงเป็นพหูพจน์'),
          t2(' should be '),
          typ2('t2-twe-1-b1b', 'pull down', ['pulled down'], 'verb-tense', 'passive voice "should be + V3" จึงใช้ pulled down'),
          t2(
            ' to make way for modern infrastructure. To explain it simply, this is possibly because older structures often fail to meet current safety and space '
          ),
          typ2('t2-twe-1-b1c', 'requirement', ['requirements'], 'plural', '"safety and space requirements" หมายถึงข้อกำหนดหลายข้อ จึงเป็นพหูพจน์'),
          t2('; '),
          sel2(
            't2-twe-1-b1d',
            ['therefore', 'however', 'for example'],
            'therefore',
            'transition',
            'ประโยคนี้สรุป "ผล" จากเหตุผลก่อนหน้า ไม่ใช่การขัดแย้งหรือยกตัวอย่าง จึงใช้ therefore'
          ),
          t2(', replacing them allows cities to meet the needs of a growing population more efficiently. '),
          sel2(
            't2-twe-1-b1e',
            ['For example', 'However', 'In conclusion'],
            'For example',
            'transition',
            'ประโยคนี้ยกตัวอย่างเมืองจริงมาสนับสนุนประโยคก่อนหน้า จึงใช้ For example'
          ),
          t2(', many rapidly developing cities have pulled down old buildings to construct '),
          sel2(
            't2-twe-1-b1f',
            ['a', 'the', WGB2_NO_ARTICLE],
            WGB2_NO_ARTICLE,
            'article',
            '"high-rise apartments and offices" เป็นคำนามพหูพจน์ที่พูดถึงทั่วไป จึงไม่ต้องมีคำนำหน้า'
          ),
          t2(' high-rise apartments and offices. '),
          comma2(
            't2-twe-1-b1g',
            ['From this perspective', 'it is understandable', 'why some would believe'],
            0,
            'วลีขึ้นต้นประโยค "From this perspective" ต้องตามด้วย comma ก่อนประธานหลัก'
          ),
          t2(" that modern buildings serve society's needs more effectively than old ones.")
        ]
      },
      {
        id: 'gb2-ob-body2',
        role: 'body2',
        labelTh: WGB2_ROLE_LABEL_TH.body2,
        segments: [
          sel2(
            't2-twe-1-b2a',
            ['However', 'Therefore', 'For example'],
            'However',
            'transition',
            'ย่อหน้านี้ขัดแย้งกับย่อหน้าก่อนหน้า (concession → rebuttal) จึงใช้ However'
          ),
          t2(', I would personally argue in favor of the idea that old buildings should be carefully '),
          typ2('t2-twe-1-b2b', 'preserve', ['preserved'], 'verb-tense', 'passive voice "should be + V3" จึงใช้ preserved'),
          t2('. To put it simply, this is due to the fact that these '),
          typ2('t2-twe-1-b2c', 'structure', ['structures'], 'plural', '"these structures" ใช้ demonstrative พหูพจน์ "these" นำหน้า จึงต้องเป็นพหูพจน์'),
          t2(' represent '),
          sel2('t2-twe-1-b2d', ['a', 'the', WGB2_NO_ARTICLE], 'a', 'article', '"a nation" พูดถึงประเทศทั่วไป ไม่เจาะจง จึงใช้ a'),
          t2(' '),
          comma2(
            't2-twe-1-b2e',
            ["nation's history and cultural heritage", 'which cannot be recreated', 'once destroyed'],
            0,
            '"which cannot be recreated..." เป็น non-defining which-clause (ให้ข้อมูลเพิ่มเติม ไม่ได้จำกัดความ) จึงต้องมี comma ก่อน which'
          ),
          t2('. For instance, cities such as Rome and Kyoto attract millions of '),
          typ2('t2-twe-1-b2f', 'tourist', ['tourists'], 'plural', '"millions of tourists" ตามด้วยคำนามพหูพจน์เสมอ'),
          t2(
            ' every year largely because of their well-preserved historic buildings. In this respect, it is evident that maintaining old buildings brings both cultural and economic value to '
          ),
          sel2('t2-twe-1-b2g', ['a', 'the', WGB2_NO_ARTICLE], 'a', 'article', '"a country" พูดถึงประเทศทั่วไป ไม่เจาะจงประเทศใดประเทศหนึ่ง จึงใช้ a'),
          t2(' country.')
        ]
      },
      {
        id: 'gb2-ob-conclusion',
        role: 'conclusion',
        labelTh: WGB2_ROLE_LABEL_TH.conclusion,
        segments: [
          t2('In conclusion, although it is undeniable that building modern structures can help cities meet growing practical '),
          typ2('t2-twe-1-c1', 'need', ['needs'], 'plural', '"practical needs" ของประชากรที่กำลังเติบโต เป็นพหูพจน์เสมอ'),
          t2(', I am of the opinion that preserving old buildings '),
          comma2(
            't2-twe-1-c2',
            ['is more', 'important', 'as they protect'],
            1,
            'comma ต้องอยู่หลัง "important" ก่อนขึ้น as-clause ที่ให้เหตุผล ไม่ใช่กลางคำว่า "more important"'
          ),
          t2(' '),
          sel2('t2-twe-1-c3', ['a', 'the', WGB2_NO_ARTICLE], 'a', 'article', '"a nation" พูดถึงประเทศทั่วไป ไม่เจาะจง จึงใช้ a'),
          t2(" nation's history for future "),
          typ2('t2-twe-1-c4', 'generation', ['generations'], 'plural', '"future generations" หมายถึงคนรุ่นต่อ ๆ ไปหลายรุ่น จึงเป็นพหูพจน์'),
          t2('.')
        ]
      }
    ]
  }
]

export const getWritingTask2Builder = (promptId: string): Wgb2Exercise | null =>
  WGB2_EXERCISES.find((exercise) => exercise.promptId === promptId) || null

const wgb2AssembleBlank = (blank: Wgb2Blank): string => {
  if (blank.kind === 'select') return blank.answer === WGB2_NO_ARTICLE ? '' : blank.answer
  if (blank.kind === 'type') return blank.answers[0]
  return blank.chunks.reduce((acc, chunk, index) => {
    if (index === 0) return chunk
    const sep = index - 1 === blank.correctGap ? ', ' : ' '
    return acc + sep + chunk
  }, '')
}

// Assemble a clean, blank-free model essay from an exercise (used for the
// "show the finished essay" reveal after the student completes all steps).
export const assembleTask2Essay = (
  exercise: Wgb2Exercise
): { role: WritingTask2Role; labelTh: string; text: string }[] =>
  exercise.steps.map((step) => ({
    role: step.role,
    labelTh: step.labelTh,
    text: step.segments
      .map((segment) => (segment.kind === 'text' ? segment.text : wgb2AssembleBlank(segment.blank)))
      .join('')
      .replace(/\s+/g, ' ')
      .replace(/\s+([,.;:])/g, '$1')
      .trim()
  }))
