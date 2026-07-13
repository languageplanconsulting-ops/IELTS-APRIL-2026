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

export type WgbSelectBlank = {
  kind: 'select'
  id: string
  options: string[]
  answer: string
  focus: 'paraphrase' | 'word-choice' | 'transition' | 'referencing' | 'trend-phrase'
}

export type WgbTypeBlank = {
  kind: 'type'
  id: string
  base: string // shown as a hint in the input, e.g. "increase"
  answers: string[] // accepted answers (case-insensitive, trimmed)
  focus: 'verb-tense' | 'ving-clause' | 'v3-clause' | 'degree-adverb'
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
  focus: WgbSelectBlank['focus']
): WgbSegment => ({ kind: 'blank', blank: { kind: 'select', id, options, answer, focus } })
const typ = (
  id: string,
  base: string,
  answers: string[],
  focus: WgbTypeBlank['focus']
): WgbSegment => ({ kind: 'blank', blank: { kind: 'type', id, base, answers, focus } })

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
    'Overview คือสรุปภาพรวม ห้ามใช้ตัวเลขหรือคำว่า rise นะครับ มองกราฟทางซ้ายแล้วเลือกคำอธิบายทิศทาง: upward trend / downward trend / fluctuate / remain unchanged over the given period',
  body1:
    'Body 1 เล่าช่วงแรกของกราฟ — ทั้งย่อหน้าเป็นอดีต (past tense) เพราะเล่าข้อมูลที่เกิดแล้ว เช็คทีละช่องตามนี้: ① ประโยคใหม่ต้องมีคำเชื่อมไหม (However, Whereas, For example) ② กริยาผันอดีต หรือ V-ing / V3 ③ ต้องมี adverb บอกระดับไหม (dramatically, steadily)',
  body2:
    'Body 2 เล่าช่วงหลังของกราฟจนจบ เหมือน Body 1 — อดีตทั้งย่อหน้า เช็ค: ① คำเชื่อมประโยคใหม่ ② กริยาอดีต หรือ V-ing / V3 ③ adverb บอกระดับ'
}

// Shown when a specific blank is focused, replacing the step message while focused.
export const BLANK_COACH_TH: Record<WgbBlank['focus'], string> = {
  paraphrase: 'ช่องนี้คือการพาราเฟรส — ใช้ synonym แทนคำในโจทย์ หรือเปลี่ยนโครงสร้างประโยคใหม่',
  'word-choice': 'เลือกคำที่ความหมายและไวยากรณ์เข้ากับประโยคที่สุด อ่านทั้งประโยคก่อนตัดสินใจ',
  transition:
    'ประโยคใหม่กำลังเริ่ม — เลือกคำเชื่อมที่เข้ากับความหมาย (However / Whereas / For example / On the other hand)',
  referencing: 'ตรงนี้อ้างถึงคำนามที่พูดถึงไปแล้ว — ใช้ "this number" หรือ "that of" แบบไหนถึงจะถูก?',
  'trend-phrase':
    'ห้ามใช้ตัวเลขหรือคำว่า rise ในย่อหน้านี้ — เลือกคำอธิบายทิศทางรวม: upward trend (ขาขึ้น) / downward trend (ขาลง) / fluctuate (ขึ้นๆ ลงๆ) / remain unchanged over the given period (ไม่เปลี่ยนแปลง)',
  'verb-tense': 'ช่องนี้ต้องผันเป็นอดีต (past tense) เสมอ เพราะทั้งเรียงความเล่าข้อมูลที่เกิดขึ้นแล้ว — เช็คแค่ประธานเอกพจน์หรือพหูพจน์',
  'ving-clause': 'ตรงนี้น่าจะต้องใช้โครงสร้าง V-ing clause (เช่น reaching, climbing, peaking) — ลองนึกกริยาที่เห็นภาพการเปลี่ยนแปลง',
  'v3-clause': 'ตรงนี้น่าจะต้องใช้ V3 (past participle) เช่น followed by, compared to — ลองดูบริบทว่าเข้ากับโครงสร้างไหน',
  'degree-adverb': 'ควรใช้ adverb บอกระดับการเปลี่ยนแปลงแบบไหนดี เช่น dramatically, steadily, gradually?'
}

export const WRITING_GUIDED_BUILDERS: WgbExercise[] = [
  // ══════════════════════════════════════════════════════════════════
  // TIMELINE 1 — Online learning (single line, 18% -> 74%)
  // ══════════════════════════════════════════════════════════════════
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
          sel('gb1-i1', ['illustrates', 'argues', 'decides'], 'illustrates', 'paraphrase'),
          t(' the '),
          sel('gb1-i2', ['proportion', 'amount', 'quantity'], 'proportion', 'paraphrase'),
          t(' of students who used online learning platforms compared with those who attended traditional in-person classes, '),
          sel('gb1-i3', ['from', 'since', 'during'], 'from', 'word-choice'),
          t(' 2014 to 2024.')
        ]
      },
      {
        id: 'gb1-overview',
        role: 'overview',
        labelTh: ROLE_LABEL_TH.overview,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('Overall, online learning platforms '),
          sel(
            'gb1-o1',
            ['showed an upward trend', 'showed a downward trend', 'fluctuated', 'remained unchanged over the given period'],
            'showed an upward trend',
            'trend-phrase'
          ),
          t(' while in-person classes '),
          sel(
            'gb1-o2',
            ['showed a downward trend', 'showed an upward trend', 'fluctuated', 'remained unchanged over the given period'],
            'showed a downward trend',
            'trend-phrase'
          ),
          t(' over the given period, with the two figures '),
          typ('gb1-o3', 'cross', ['crossing'], 'ving-clause'),
          t(' over around the midpoint of the period.')
        ]
      },
      {
        id: 'gb1-body1',
        role: 'body1',
        labelTh: ROLE_LABEL_TH.body1,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('Starting in 2014, at 82%, the percentage of students attending in-person classes '),
          typ('gb1-b1', 'be', ['was'], 'verb-tense'),
          t(' the highest, '),
          typ('gb1-b2', 'follow', ['followed'], 'v3-clause'),
          t(' by those using online platforms at just 18%, '),
          sel('gb1-b3', ['respectively', 'especially', 'namely'], 'respectively', 'word-choice'),
          t('. '),
          sel('gb1-b4', ['However', 'Therefore', 'Similarly'], 'However', 'transition'),
          t(', while online learning '),
          typ('gb1-b5', 'increase', ['increased'], 'verb-tense'),
          t(' '),
          sel('gb1-b6', ['dramatically', 'marginally', 'rarely'], 'dramatically', 'word-choice'),
          t(' to 34% by 2018, in-person attendance '),
          typ('gb1-b7', 'decline', ['declined'], 'verb-tense'),
          t(' '),
          sel('gb1-b8', ['drastically', 'slightly', 'barely'], 'drastically', 'word-choice'),
          t(' to 66%.')
        ]
      },
      {
        id: 'gb1-body2',
        role: 'body2',
        labelTh: ROLE_LABEL_TH.body2,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('From 2018 onwards, while online learning '),
          typ('gb1-c1', 'continue', ['continued'], 'verb-tense'),
          t(' to rise, '),
          typ('gb1-c2', 'reach', ['reaching'], 'ving-clause'),
          t(' a peak at 74% in 2024, in-person attendance '),
          typ('gb1-c3', 'drop', ['dropped'], 'verb-tense'),
          t(' continuously, '),
          typ('gb1-c4', 'reach', ['reaching'], 'ving-clause'),
          t(' the lowest point at 26% in 2024. '),
          sel(
            'gb1-c5',
            ['It is interesting to note that', 'It is worth mentioning that', 'It should be noted that'],
            'It is interesting to note that',
            'transition'
          ),
          t(' the two lines '),
          typ('gb1-c6', 'cross', ['crossed'], 'verb-tense'),
          t(' paths in around 2019, with online learning '),
          typ('gb1-c7', 'overtake', ['overtaking'], 'ving-clause'),
          t(' in-person classes for the first time.')
        ]
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════════
  // TIMELINE 2 — Food delivery spending (single line, $22 -> $110)
  // ══════════════════════════════════════════════════════════════════
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
          sel('gb2-i1', ['shows', 'claims', 'wonders'], 'shows', 'paraphrase'),
          t(' the average '),
          sel('gb2-i2', ['amount', 'number', 'proportion'], 'amount', 'paraphrase'),
          t(' of money each person spent on food delivery per month, '),
          sel('gb2-i3', ['between', 'among', 'within'], 'between', 'word-choice'),
          t(' 2014 and 2024, measured in US dollars.')
        ]
      },
      {
        id: 'gb2-overview',
        role: 'overview',
        labelTh: ROLE_LABEL_TH.overview,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('Overall, monthly spending on food delivery '),
          sel(
            'gb2-o1',
            ['showed a dramatic upward trend', 'showed a downward trend', 'fluctuated', 'remained unchanged over the given period'],
            'showed a dramatic upward trend',
            'trend-phrase'
          ),
          t(' over the period. '),
          sel('gb2-o2', ['However', 'In addition', 'Because'], 'However', 'transition'),
          t(', most of this growth '),
          typ('gb2-o3', 'take', ['took'], 'verb-tense'),
          t(' place in the second half of the period.')
        ]
      },
      {
        id: 'gb2-body1',
        role: 'body1',
        labelTh: ROLE_LABEL_TH.body1,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('Starting in 2014 at just $22, monthly spending '),
          typ('gb2-b1', 'rise', ['rose'], 'verb-tense'),
          t(' '),
          sel('gb2-b2', ['gradually', 'rapidly', 'wildly'], 'gradually', 'word-choice'),
          t(', '),
          typ('gb2-b3', 'reach', ['reaching'], 'ving-clause'),
          t(' $45 by 2018. '),
          sel('gb2-b4', ['However', 'Therefore', 'Likewise'], 'However', 'transition'),
          t(', the figure '),
          typ('gb2-b5', 'remain', ['remained'], 'verb-tense'),
          t(' fairly '),
          sel('gb2-b6', ['modest', 'enormous', 'stable'], 'modest', 'word-choice'),
          t(' during this early period.')
        ]
      },
      {
        id: 'gb2-body2',
        role: 'body2',
        labelTh: ROLE_LABEL_TH.body2,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('From 2018 onwards, spending '),
          typ('gb2-c1', 'climb', ['climbed'], 'verb-tense'),
          t(' far more '),
          sel('gb2-c2', ['steeply', 'faintly', 'evenly'], 'steeply', 'word-choice'),
          t(', '),
          typ('gb2-c3', 'jump', ['jumping'], 'ving-clause'),
          t(' to $78 in 2020. It then '),
          typ('gb2-c4', 'continue', ['continued'], 'verb-tense'),
          t(' to grow, '),
          typ('gb2-c5', 'peak', ['peaking'], 'ving-clause'),
          t(' at $110 in 2024. '),
          sel('gb2-c6', ['This figure', 'This figures', 'These figure'], 'This figure', 'referencing'),
          t(' was roughly five times '),
          sel('gb2-c7', ['that', 'those', 'them'], 'that', 'referencing'),
          t(' recorded a decade earlier.')
        ]
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════════
  // TIMELINE 3 — Working from home (bar, millions; peaks 2020 then falls)
  // ══════════════════════════════════════════════════════════════════
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
          t('The bar chart '),
          sel('gb3-i1', ['illustrates', 'insists', 'imagines'], 'illustrates', 'paraphrase'),
          t(' the '),
          sel('gb3-i2', ['number', 'percentage', 'rate'], 'number', 'paraphrase'),
          t(' of people who worked from home, in millions, '),
          sel('gb3-i3', ['from', 'by', 'at'], 'from', 'word-choice'),
          t(' 2014 to 2024.')
        ]
      },
      {
        id: 'gb3-overview',
        role: 'overview',
        labelTh: ROLE_LABEL_TH.overview,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('Overall, the number of people working from home '),
          sel(
            'gb3-o1',
            ['fluctuated over the given period', 'showed a steady upward trend', 'showed a steady downward trend', 'remained unchanged over the given period'],
            'fluctuated over the given period',
            'trend-phrase'
          ),
          t(', '),
          typ('gb3-o2', 'peak', ['peaking'], 'ving-clause'),
          t(' sharply before '),
          typ('gb3-o3', 'fall', ['falling'], 'ving-clause'),
          t(' back slightly, '),
          sel('gb3-o4', ['yet', 'so', 'or'], 'yet', 'word-choice'),
          t(' it '),
          typ('gb3-o5', 'remain', ['remained'], 'verb-tense'),
          t(' far higher than at the start of the period.')
        ]
      },
      {
        id: 'gb3-body1',
        role: 'body1',
        labelTh: ROLE_LABEL_TH.body1,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('Starting in 2014 at only 4 million, the number of home workers '),
          typ('gb3-b1', 'increase', ['increased'], 'verb-tense'),
          t(' '),
          sel('gb3-b2', ['gradually', 'sharply', 'endlessly'], 'gradually', 'word-choice'),
          t(', '),
          typ('gb3-b3', 'rise', ['rising'], 'ving-clause'),
          t(' to 7 million by 2018. '),
          sel('gb3-b4', ['However', 'Consequently', 'Similarly'], 'However', 'transition'),
          t(', the growth during this period '),
          typ('gb3-b5', 'stay', ['stayed'], 'verb-tense'),
          t(' fairly '),
          sel('gb3-b6', ['small', 'huge', 'rapid'], 'small', 'word-choice'),
          t('.')
        ]
      },
      {
        id: 'gb3-body2',
        role: 'body2',
        labelTh: ROLE_LABEL_TH.body2,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('From 2018 onwards, the figure '),
          typ('gb3-c1', 'rise', ['rose'], 'verb-tense'),
          t(' '),
          sel('gb3-c2', ['dramatically', 'faintly', 'slowly'], 'dramatically', 'word-choice'),
          t(', '),
          typ('gb3-c3', 'peak', ['peaking'], 'ving-clause'),
          t(' at 21 million in 2020. '),
          sel('gb3-c4', ['On the other hand', 'For example', 'In short'], 'On the other hand', 'transition'),
          t(', it then '),
          typ('gb3-c5', 'decline', ['declined'], 'verb-tense'),
          t(' steadily to 16 million by 2024. '),
          sel('gb3-c6', ['This figure', 'These figure', 'This figures'], 'This figure', 'referencing'),
          t(' was still four times '),
          sel('gb3-c7', ['that', 'those', 'it'], 'that', 'referencing'),
          t(' recorded in 2014.')
        ]
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════════
  // TIMELINE 4 — Electric bicycle sales (bar, thousand units; steady rise)
  // ══════════════════════════════════════════════════════════════════
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
          sel('gb4-i1', ['shows', 'suggests', 'hopes'], 'shows', 'paraphrase'),
          t(' the '),
          sel('gb4-i2', ['number', 'percentage', 'share'], 'number', 'paraphrase'),
          t(' of electric bicycles sold, in thousands of units, '),
          sel('gb4-i3', ['from', 'until', 'above'], 'from', 'word-choice'),
          t(' 2014 to 2024.')
        ]
      },
      {
        id: 'gb4-overview',
        role: 'overview',
        labelTh: ROLE_LABEL_TH.overview,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('Overall, sales of electric bicycles '),
          sel(
            'gb4-o1',
            ['showed a continuous upward trend', 'showed a downward trend', 'fluctuated', 'remained unchanged over the given period'],
            'showed a continuous upward trend',
            'trend-phrase'
          ),
          t(', '),
          typ('gb4-o2', 'reach', ['reaching'], 'ving-clause'),
          t(' their '),
          sel('gb4-o3', ['highest', 'lowest', 'average'], 'highest', 'word-choice'),
          t(' point in the final year.')
        ]
      },
      {
        id: 'gb4-body1',
        role: 'body1',
        labelTh: ROLE_LABEL_TH.body1,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('Starting in 2014 at 35,000 units, sales '),
          typ('gb4-b1', 'rise', ['rose'], 'verb-tense'),
          t(' '),
          sel('gb4-b2', ['steadily', 'suddenly', 'weakly'], 'steadily', 'word-choice'),
          t(', '),
          typ('gb4-b3', 'climb', ['climbing'], 'ving-clause'),
          t(' to 72,000 by 2018. '),
          sel('gb4-b4', ['Overall', 'However', 'Instead'], 'Overall', 'transition'),
          t(', the figure more than '),
          typ('gb4-b5', 'double', ['doubled'], 'verb-tense'),
          t(' during this '),
          sel('gb4-b6', ['early', 'final', 'busy'], 'early', 'word-choice'),
          t(' stage.')
        ]
      },
      {
        id: 'gb4-body2',
        role: 'body2',
        labelTh: ROLE_LABEL_TH.body2,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('From 2018 onwards, sales '),
          typ('gb4-c1', 'grow', ['grew'], 'verb-tense'),
          t(' even more '),
          sel('gb4-c2', ['rapidly', 'gently', 'sadly'], 'rapidly', 'word-choice'),
          t(', '),
          typ('gb4-c3', 'reach', ['reaching'], 'ving-clause'),
          t(' 130,000 units in 2020. The figure then '),
          typ('gb4-c4', 'continue', ['continued'], 'verb-tense'),
          t(' to rise, '),
          typ('gb4-c5', 'peak', ['peaking'], 'ving-clause'),
          t(' at 240,000 in 2024. '),
          sel('gb4-c6', ['This figure', 'This figures', 'These figure'], 'This figure', 'referencing'),
          t(' was almost seven times '),
          sel('gb4-c7', ['that', 'those', 'them'], 'that', 'referencing'),
          t(' recorded at the beginning of the period.')
        ]
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════════
  // TIMELINE 5 — Smart TV ownership (table, %; steady rise)
  // ══════════════════════════════════════════════════════════════════
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
          sel('gb5-i1', ['illustrates', 'believes', 'guesses'], 'illustrates', 'paraphrase'),
          t(' the '),
          sel('gb5-i2', ['proportion', 'amount', 'total'], 'proportion', 'paraphrase'),
          t(' of households that owned a smart TV '),
          sel('gb5-i3', ['from', 'onto', 'past'], 'from', 'word-choice'),
          t(' 2014 to 2024.')
        ]
      },
      {
        id: 'gb5-overview',
        role: 'overview',
        labelTh: ROLE_LABEL_TH.overview,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('Overall, smart TV ownership '),
          sel(
            'gb5-o1',
            ['showed a rapid upward trend', 'showed a downward trend', 'fluctuated', 'remained unchanged over the given period'],
            'showed a rapid upward trend',
            'trend-phrase'
          ),
          t(', '),
          typ('gb5-o2', 'become', ['becoming'], 'ving-clause'),
          t(' '),
          sel('gb5-o3', ['common', 'rare', 'unusual'], 'common', 'word-choice'),
          t(' by the end of the period.')
        ]
      },
      {
        id: 'gb5-body1',
        role: 'body1',
        labelTh: ROLE_LABEL_TH.body1,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('Starting in 2014 at just 12%, the figure '),
          typ('gb5-b1', 'increase', ['increased'], 'verb-tense'),
          t(' '),
          sel('gb5-b2', ['steadily', 'slightly', 'randomly'], 'steadily', 'word-choice'),
          t(', '),
          typ('gb5-b3', 'reach', ['reaching'], 'ving-clause'),
          t(' 39% by 2018. In other words, ownership more than '),
          typ('gb5-b4', 'triple', ['tripled'], 'verb-tense'),
          t(' in '),
          sel('gb5-b5', ['just', 'over', 'nearly'], 'just', 'word-choice'),
          t(' four years, '),
          sel('gb5-b6', ['although', 'because', 'unless'], 'although', 'transition'),
          t(' it was still below half of all households.')
        ]
      },
      {
        id: 'gb5-body2',
        role: 'body2',
        labelTh: ROLE_LABEL_TH.body2,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('From 2018 onwards, the figure '),
          typ('gb5-c1', 'continue', ['continued'], 'verb-tense'),
          t(' to climb, '),
          typ('gb5-c2', 'pass', ['passing'], 'ving-clause'),
          t(' the halfway mark at 55% in 2020. It '),
          typ('gb5-c3', 'rise', ['rose'], 'verb-tense'),
          t(' '),
          sel('gb5-c4', ['further', 'lower', 'apart'], 'further', 'word-choice'),
          t(' to 68% in 2022, before '),
          typ('gb5-c5', 'peak', ['peaking'], 'ving-clause'),
          t(' at 76% in 2024. By the end of the period, '),
          sel('gb5-c6', ['this figure', 'these figure', 'this figures'], 'this figure', 'referencing'),
          t(' was more than six times '),
          sel('gb5-c7', ['that', 'those', 'it'], 'that', 'referencing'),
          t(' recorded a decade earlier.')
        ]
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════════
  // TIMELINE 6 — Online shopping, 3 countries (multi-line)
  // ══════════════════════════════════════════════════════════════════
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
          sel('gb6-i1', ['illustrates', 'promises', 'assumes'], 'illustrates', 'paraphrase'),
          t(' the '),
          sel('gb6-i2', ['percentage', 'number', 'value'], 'percentage', 'paraphrase'),
          t(' of adults who made at least one online purchase per month in three countries, '),
          sel('gb6-i3', ['from', 'along', 'toward'], 'from', 'word-choice'),
          t(' 2014 to 2024.')
        ]
      },
      {
        id: 'gb6-overview',
        role: 'overview',
        labelTh: ROLE_LABEL_TH.overview,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('Overall, online shopping '),
          sel(
            'gb6-o1',
            ['showed an upward trend', 'showed a downward trend', 'fluctuated', 'remained unchanged over the given period'],
            'showed an upward trend',
            'trend-phrase'
          ),
          t(' in all three countries, '),
          sel('gb6-o2', ['whereas', 'because', 'so that'], 'whereas', 'transition'),
          t(' the USA '),
          typ('gb6-o3', 'remain', ['remained'], 'verb-tense'),
          t(' the '),
          sel('gb6-o4', ['highest', 'lowest', 'weakest'], 'highest', 'word-choice'),
          t(' throughout, and Australia recorded the fastest growth.')
        ]
      },
      {
        id: 'gb6-body1',
        role: 'body1',
        labelTh: ROLE_LABEL_TH.body1,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('Starting in 2014 at 35%, the USA '),
          typ('gb6-b1', 'have', ['had'], 'verb-tense'),
          t(' the highest figure, '),
          typ('gb6-b2', 'follow', ['followed'], 'v3-clause'),
          t(' by the UK and Australia, '),
          sel('gb6-b3', ['respectively', 'especially', 'namely'], 'respectively', 'word-choice'),
          t('. '),
          sel('gb6-b4', ['However', 'Therefore', 'Meanwhile'], 'However', 'transition'),
          t(', all three figures '),
          typ('gb6-b5', 'climb', ['climbed'], 'verb-tense'),
          t(' steadily, '),
          typ('gb6-b6', 'reach', ['reaching'], 'ving-clause'),
          t(' 51%, 58% and 44% by 2018.')
        ]
      },
      {
        id: 'gb6-body2',
        role: 'body2',
        labelTh: ROLE_LABEL_TH.body2,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('From 2018 onwards, all three figures '),
          typ('gb6-c1', 'continue', ['continued'], 'verb-tense'),
          t(' to rise, '),
          typ('gb6-c2', 'peak', ['peaking'], 'ving-clause'),
          t(' at 89%, 86% and 84%, respectively, in 2024. '),
          sel('gb6-c3', ['On the other hand', 'For instance', 'In contrast'], 'On the other hand', 'transition'),
          t(', Australia grew the fastest, '),
          typ('gb6-c4', 'narrow', ['narrowing'], 'ving-clause'),
          t(' the gap with the USA from 13 points to just 5. By the end of the period, the figure for Australia was much closer to '),
          sel('gb6-c5', ['that', 'those', 'them'], 'that', 'referencing'),
          t(' of the other two countries than it had been in 2014.')
        ]
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════════
  // TIMELINE 7 — Social media use, 4 regions (multi-line, 2010-2024)
  // ══════════════════════════════════════════════════════════════════
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
          t('The line graph '),
          sel('gb7-i1', ['shows', 'warns', 'expects'], 'shows', 'paraphrase'),
          t(' the '),
          sel('gb7-i2', ['proportion', 'amount', 'sum'], 'proportion', 'paraphrase'),
          t(' of people who used social media in four regions, '),
          sel('gb7-i3', ['between', 'across', 'beside'], 'between', 'word-choice'),
          t(' 2010 and 2024.')
        ]
      },
      {
        id: 'gb7-overview',
        role: 'overview',
        labelTh: ROLE_LABEL_TH.overview,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('Overall, social media use '),
          sel(
            'gb7-o1',
            ['showed an upward trend', 'showed a downward trend', 'fluctuated', 'remained unchanged over the given period'],
            'showed an upward trend',
            'trend-phrase'
          ),
          t(' in every region, '),
          sel('gb7-o2', ['whereas', 'although', 'unless'], 'whereas', 'transition'),
          t(' North America '),
          typ('gb7-o3', 'stay', ['stayed'], 'verb-tense'),
          t(' the '),
          sel('gb7-o4', ['highest', 'smallest', 'slowest'], 'highest', 'word-choice'),
          t(' throughout, and Asia-Pacific saw the sharpest rise.')
        ]
      },
      {
        id: 'gb7-body1',
        role: 'body1',
        labelTh: ROLE_LABEL_TH.body1,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('Starting in 2010 at 48%, North America '),
          typ('gb7-b1', 'have', ['had'], 'verb-tense'),
          t(' the highest figure, '),
          typ('gb7-b2', 'follow', ['followed'], 'v3-clause'),
          t(' by Europe, Latin America and Asia-Pacific, '),
          sel('gb7-b3', ['respectively', 'obviously', 'clearly'], 'respectively', 'word-choice'),
          t('. '),
          sel('gb7-b4', ['However', 'As a result', 'Likewise'], 'However', 'transition'),
          t(', Asia-Pacific '),
          typ('gb7-b5', 'start', ['started'], 'verb-tense'),
          t(' far behind at only 15%, '),
          typ('gb7-b6', 'trail', ['trailing'], 'ving-clause'),
          t(' well below the other three regions.')
        ]
      },
      {
        id: 'gb7-body2',
        role: 'body2',
        labelTh: ROLE_LABEL_TH.body2,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('From 2010 onwards, every region '),
          typ('gb7-c1', 'rise', ['rose'], 'verb-tense'),
          t(' steadily, '),
          typ('gb7-c2', 'reach', ['reaching'], 'ving-clause'),
          t(' 85%, 77%, 75% and 73%, respectively, by 2024. '),
          sel('gb7-c3', ['On the other hand', 'For example', 'In short'], 'On the other hand', 'transition'),
          t(', Asia-Pacific '),
          typ('gb7-c4', 'grow', ['grew'], 'verb-tense'),
          t(' the fastest, '),
          typ('gb7-c5', 'narrow', ['narrowing'], 'ving-clause'),
          t(' the gap with North America from 33 points to just 12. By the end of the period, the figure for Asia-Pacific was far closer to '),
          sel('gb7-c6', ['that', 'those', 'it'], 'that', 'referencing'),
          t(' of North America than before.')
        ]
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════════
  // SNAPSHOT 1 — Vietnam–US exports (two pie charts, $ million)
  // ══════════════════════════════════════════════════════════════════
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
          sel('gb8-i1', ['illustrate', 'argue', 'decide'], 'illustrate', 'paraphrase'),
          t(' the '),
          sel('gb8-i2', ['value', 'weight', 'speed'], 'value', 'paraphrase'),
          t(' of exports between the US and Vietnam, '),
          sel('gb8-i3', ['broken down', 'brought up', 'held back'], 'broken down', 'word-choice'),
          t(' by product category, in 2023.')
        ]
      },
      {
        id: 'gb8-overview',
        role: 'overview',
        labelTh: ROLE_LABEL_TH.overview,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('Overall, coffee '),
          typ('gb8-o1', 'account', ['accounted'], 'verb-tense'),
          t(' for the '),
          sel('gb8-o2', ['largest', 'smallest', 'fairest'], 'largest', 'word-choice'),
          t(' proportion of Vietnam’s exports to the US, '),
          sel('gb8-o3', ['whereas', 'because', 'so'], 'whereas', 'transition'),
          t(' aircraft parts '),
          typ('gb8-o4', 'make', ['made'], 'verb-tense'),
          t(' up the biggest share of US exports to Vietnam.')
        ]
      },
      {
        id: 'gb8-body1',
        role: 'body1',
        labelTh: ROLE_LABEL_TH.body1,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel('gb8-b1', ['Regarding', 'Despite', 'Unlike'], 'Regarding', 'transition'),
          t(' Vietnam’s exports to the US, coffee '),
          typ('gb8-b2', 'be', ['was'], 'verb-tense'),
          t(' the most valuable category at $23 million, '),
          typ('gb8-b3', 'follow', ['followed'], 'v3-clause'),
          t(' by fruit and vegetables at $16 million. Seafood and rice '),
          typ('gb8-b4', 'account', ['accounted'], 'verb-tense'),
          t(' for much '),
          sel('gb8-b5', ['smaller', 'larger', 'wider'], 'smaller', 'word-choice'),
          t(' shares, at $4.4 and $4.3 million, '),
          sel('gb8-b6', ['respectively', 'roughly', 'partly'], 'respectively', 'word-choice'),
          t(', while garments and other goods each made up just $2 million.')
        ]
      },
      {
        id: 'gb8-body2',
        role: 'body2',
        labelTh: ROLE_LABEL_TH.body2,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel('gb8-c1', ['In terms of', 'In spite of', 'Instead of'], 'In terms of', 'transition'),
          t(' US exports to Vietnam, aircraft parts '),
          typ('gb8-c2', 'dominate', ['dominated'], 'verb-tense'),
          t(' at $72 million, more than twice '),
          sel('gb8-c3', ['that', 'those', 'it'], 'that', 'referencing'),
          t(' for machinery at $30.5 million. Fertiliser and cotton '),
          typ('gb8-c4', 'follow', ['followed'], 'verb-tense'),
          t(', at $16.5 and $12 million, respectively, '),
          sel('gb8-c5', ['whereas', 'therefore', 'moreover'], 'whereas', 'transition'),
          t(' cars '),
          typ('gb8-c6', 'make', ['made'], 'verb-tense'),
          t(' up the smallest share at just $6 million.')
        ]
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════════
  // SNAPSHOT 2 — UK vs Thailand household spending (bar, %)
  // ══════════════════════════════════════════════════════════════════
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
          t('The bar chart '),
          sel('gb9-i1', ['compares', 'complains', 'considers'], 'compares', 'paraphrase'),
          t(' the '),
          sel('gb9-i2', ['proportion', 'number', 'length'], 'proportion', 'paraphrase'),
          t(' of household spending on five categories in the UK and Thailand, '),
          sel('gb9-i3', ['measured', 'divided', 'counted'], 'measured', 'word-choice'),
          t(' as a percentage of total spending.')
        ]
      },
      {
        id: 'gb9-overview',
        role: 'overview',
        labelTh: ROLE_LABEL_TH.overview,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('Overall, housing '),
          typ('gb9-o1', 'make', ['made'], 'verb-tense'),
          t(' up the '),
          sel('gb9-o2', ['largest', 'smallest', 'lowest'], 'largest', 'word-choice'),
          t(' proportion of spending in the UK, '),
          sel('gb9-o3', ['whereas', 'since', 'so'], 'whereas', 'transition'),
          t(' food '),
          typ('gb9-o4', 'account', ['accounted'], 'verb-tense'),
          t(' for the biggest share in Thailand.')
        ]
      },
      {
        id: 'gb9-body1',
        role: 'body1',
        labelTh: ROLE_LABEL_TH.body1,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel('gb9-b1', ['In the UK', 'Despite the UK', 'Unlike the UK'], 'In the UK', 'transition'),
          t(', housing '),
          typ('gb9-b2', 'be', ['was'], 'verb-tense'),
          t(' the largest category at 28%, '),
          typ('gb9-b3', 'follow', ['followed'], 'v3-clause'),
          t(' by food at 18% and leisure at 15%. Transport and healthcare '),
          typ('gb9-b4', 'account', ['accounted'], 'verb-tense'),
          t(' for '),
          sel('gb9-b5', ['smaller', 'bigger', 'equal'], 'smaller', 'word-choice'),
          t(' shares, at 14% and 12%, '),
          sel('gb9-b6', ['respectively', 'suddenly', 'clearly'], 'respectively', 'word-choice'),
          t('.')
        ]
      },
      {
        id: 'gb9-body2',
        role: 'body2',
        labelTh: ROLE_LABEL_TH.body2,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel('gb9-c1', ['In Thailand', 'Although Thailand', 'Except Thailand'], 'In Thailand', 'transition'),
          t(', by contrast, food '),
          typ('gb9-c2', 'take', ['took'], 'verb-tense'),
          t(' the largest share at 25%, '),
          typ('gb9-c3', 'follow', ['followed'], 'v3-clause'),
          t(' by housing at 22% and transport at 18%. '),
          sel('gb9-c4', ['On the other hand', 'For example', 'As well'], 'On the other hand', 'transition'),
          t(', healthcare '),
          typ('gb9-c5', 'make', ['made'], 'verb-tense'),
          t(' up the smallest proportion at just 8%, lower than '),
          sel('gb9-c6', ['that', 'those', 'it'], 'that', 'referencing'),
          t(' of any category in the UK.')
        ]
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════════
  // SNAPSHOT 3 — Germany vs Australia energy (two pie charts, %)
  // ══════════════════════════════════════════════════════════════════
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
          sel('gb10-i1', ['illustrate', 'insist', 'wish'], 'illustrate', 'paraphrase'),
          t(' the '),
          sel('gb10-i2', ['distribution', 'distance', 'duration'], 'distribution', 'paraphrase'),
          t(' of energy sources used to generate electricity in Germany and Australia '),
          sel('gb10-i3', ['in', 'by', 'to'], 'in', 'word-choice'),
          t(' 2020.')
        ]
      },
      {
        id: 'gb10-overview',
        role: 'overview',
        labelTh: ROLE_LABEL_TH.overview,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('Overall, renewables '),
          typ('gb10-o1', 'make', ['made'], 'verb-tense'),
          t(' up the '),
          sel('gb10-o2', ['largest', 'least', 'fewest'], 'largest', 'word-choice'),
          t(' proportion in Germany, '),
          sel('gb10-o3', ['whereas', 'because', 'until'], 'whereas', 'transition'),
          t(' coal '),
          typ('gb10-o4', 'remain', ['remained'], 'verb-tense'),
          t(' the dominant source in Australia.')
        ]
      },
      {
        id: 'gb10-body1',
        role: 'body1',
        labelTh: ROLE_LABEL_TH.body1,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel('gb10-b1', ['In Germany', 'Despite Germany', 'Unlike Germany'], 'In Germany', 'transition'),
          t(', renewables '),
          typ('gb10-b2', 'account', ['accounted'], 'verb-tense'),
          t(' for the largest share at 44%, '),
          typ('gb10-b3', 'follow', ['followed'], 'v3-clause'),
          t(' by coal at 25% and gas at 16%. Nuclear and other sources '),
          typ('gb10-b4', 'make', ['made'], 'verb-tense'),
          t(' up '),
          sel('gb10-b5', ['smaller', 'larger', 'higher'], 'smaller', 'word-choice'),
          t(' shares, at 6% and 9%, '),
          sel('gb10-b6', ['respectively', 'clearly', 'lately'], 'respectively', 'word-choice'),
          t('.')
        ]
      },
      {
        id: 'gb10-body2',
        role: 'body2',
        labelTh: ROLE_LABEL_TH.body2,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel('gb10-c1', ['In Australia', 'Although Australia', 'Besides Australia'], 'In Australia', 'transition'),
          t(', by contrast, coal '),
          typ('gb10-c2', 'dominate', ['dominated'], 'verb-tense'),
          t(' at 52%, more than twice '),
          sel('gb10-c3', ['that', 'those', 'it'], 'that', 'referencing'),
          t(' for gas at 22%. Renewables '),
          typ('gb10-c4', 'account', ['accounted'], 'verb-tense'),
          t(' for 21%, '),
          sel('gb10-c5', ['whereas', 'therefore', 'moreover'], 'whereas', 'transition'),
          t(' other sources '),
          typ('gb10-c6', 'make', ['made'], 'verb-tense'),
          t(' up the smallest proportion at just 5%.')
        ]
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════════
  // SNAPSHOT 4 — Five universities table (mixed indicators)
  // ══════════════════════════════════════════════════════════════════
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
          sel('gb11-i1', ['compares', 'complains', 'commands'], 'compares', 'paraphrase'),
          t(' five universities '),
          sel('gb11-i2', ['across', 'above', 'behind'], 'across', 'word-choice'),
          t(' four '),
          sel('gb11-i3', ['indicators', 'accidents', 'instructions'], 'indicators', 'paraphrase'),
          t(': research output, satisfaction, employment and international students, in 2024.')
        ]
      },
      {
        id: 'gb11-overview',
        role: 'overview',
        labelTh: ROLE_LABEL_TH.overview,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('Overall, MIT '),
          typ('gb11-o1', 'lead', ['led'], 'verb-tense'),
          t(' in satisfaction and employment, '),
          sel('gb11-o2', ['whereas', 'because', 'so'], 'whereas', 'transition'),
          t(' Oxford '),
          typ('gb11-o3', 'have', ['had'], 'verb-tense'),
          t(' the highest research output; Chulalongkorn recorded the '),
          sel('gb11-o4', ['lowest', 'highest', 'widest'], 'lowest', 'word-choice'),
          t(' figures across every indicator.')
        ]
      },
      {
        id: 'gb11-body1',
        role: 'body1',
        labelTh: ROLE_LABEL_TH.body1,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel('gb11-b1', ['In terms of', 'In spite of', 'Instead of'], 'In terms of', 'transition'),
          t(' research output, Oxford '),
          typ('gb11-b2', 'produce', ['produced'], 'verb-tense'),
          t(' the most at 48,500 papers, '),
          typ('gb11-b3', 'follow', ['followed'], 'v3-clause'),
          t(' by MIT at 42,000 and Seoul National at 22,100. Chulalongkorn '),
          typ('gb11-b4', 'record', ['recorded'], 'verb-tense'),
          t(' by far the '),
          sel('gb11-b5', ['lowest', 'largest', 'busiest'], 'lowest', 'word-choice'),
          t(' figure, at only 4,300.')
        ]
      },
      {
        id: 'gb11-body2',
        role: 'body2',
        labelTh: ROLE_LABEL_TH.body2,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel('gb11-c1', ['In terms of', 'Despite', 'Unlike'], 'In terms of', 'transition'),
          t(' student outcomes, MIT '),
          typ('gb11-c2', 'achieve', ['achieved'], 'verb-tense'),
          t(' the highest satisfaction at 91% and employment at 97%. Oxford and Seoul National '),
          typ('gb11-c3', 'follow', ['followed'], 'verb-tense'),
          t(' closely, '),
          sel('gb11-c4', ['whereas', 'therefore', 'also'], 'whereas', 'transition'),
          t(' Chulalongkorn '),
          typ('gb11-c5', 'remain', ['remained'], 'verb-tense'),
          t(' the lowest, with figures below '),
          sel('gb11-c6', ['those', 'that', 'them'], 'those', 'referencing'),
          t(' of every other university.')
        ]
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════════
  // MIXED — Riverside Language School (pie + table + bar)
  // ══════════════════════════════════════════════════════════════════
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
          sel('gb12-i1', ['illustrate', 'imagine', 'insist'], 'illustrate', 'paraphrase'),
          t(' the '),
          sel('gb12-i2', ['nationality', 'personality', 'ability'], 'nationality', 'paraphrase'),
          t(' of students at Riverside Language School in 2023, enrolments by course, and total enrolments '),
          sel('gb12-i3', ['between', 'among', 'beside'], 'between', 'word-choice'),
          t(' 2014 and 2023.')
        ]
      },
      {
        id: 'gb12-overview',
        role: 'overview',
        labelTh: ROLE_LABEL_TH.overview,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('Overall, Chinese students '),
          typ('gb12-o1', 'make', ['made'], 'verb-tense'),
          t(' up the largest group and General English '),
          typ('gb12-o2', 'be', ['was'], 'verb-tense'),
          t(' the most popular course, '),
          sel('gb12-o3', ['while', 'because', 'unless'], 'while', 'transition'),
          t(' total enrolments '),
          typ('gb12-o4', 'fall', ['fell'], 'verb-tense'),
          t(' sharply in 2020 before recovering to a new peak in 2023.')
        ]
      },
      {
        id: 'gb12-body1',
        role: 'body1',
        labelTh: ROLE_LABEL_TH.body1,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel('gb12-b1', ['In terms of', 'In spite of', 'Ahead of'], 'In terms of', 'transition'),
          t(' nationality, Chinese students '),
          typ('gb12-b2', 'account', ['accounted'], 'verb-tense'),
          t(' for the largest share at 32%, '),
          typ('gb12-b3', 'follow', ['followed'], 'v3-clause'),
          t(' by Japanese at 21% and Brazilian at 15%. As for courses, General English '),
          typ('gb12-b4', 'attract', ['attracted'], 'verb-tense'),
          t(' the most students, at 420, '),
          sel('gb12-b5', ['whereas', 'therefore', 'moreover'], 'whereas', 'transition'),
          t(' the summer intensive '),
          typ('gb12-b6', 'have', ['had'], 'verb-tense'),
          t(' the highest pass rate at 90%.')
        ]
      },
      {
        id: 'gb12-body2',
        role: 'body2',
        labelTh: ROLE_LABEL_TH.body2,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel('gb12-c1', ['Regarding', 'Despite', 'Unlike'], 'Regarding', 'transition'),
          t(' total enrolments, the figure '),
          typ('gb12-c2', 'rise', ['rose'], 'verb-tense'),
          t(' steadily from 640 in 2014 to 950 in 2019. '),
          sel('gb12-c3', ['However', 'For example', 'Likewise'], 'However', 'transition'),
          t(', it then '),
          typ('gb12-c4', 'drop', ['dropped'], 'verb-tense'),
          t(' dramatically to 310 in 2020, before '),
          typ('gb12-c5', 'recover', ['recovering'], 'ving-clause'),
          t(' strongly and '),
          typ('gb12-c6', 'peak', ['peaking'], 'ving-clause'),
          t(' at 1,100 in 2023, the highest figure in the whole period.')
        ]
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════════
  // MAP — Town centre redevelopment, 2005 -> 2025 (passive voice)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'gb-town-centre',
    promptId: 'map-town-centre',
    steps: [
      {
        id: 'gb13-intro',
        role: 'intro',
        labelTh: ROLE_LABEL_TH.intro,
        hintTh: HINT_PARAPHRASE,
        segments: [
          t('The two maps '),
          sel('gb13-i1', ['illustrate', 'argue', 'promise'], 'illustrate', 'paraphrase'),
          t(' the '),
          sel('gb13-i2', ['changes', 'chances', 'choices'], 'changes', 'paraphrase'),
          t(' in the layout of a town centre '),
          sel('gb13-i3', ['between', 'along', 'toward'], 'between', 'word-choice'),
          t(' 2005 and 2025.')
        ]
      },
      {
        id: 'gb13-overview',
        role: 'overview',
        labelTh: ROLE_LABEL_TH.overview,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('Overall, the town centre '),
          typ('gb13-o1', 'become', ['became'], 'verb-tense'),
          t(' far more '),
          sel('gb13-o2', ['residential', 'temporary', 'natural'], 'residential', 'word-choice'),
          t(' over the period, '),
          sel('gb13-o3', ['as', 'so', 'or'], 'as', 'word-choice'),
          t(' the shopping mall and car park in the north '),
          typ('gb13-o4', 'replace', ['were replaced', 'replaced'], 'v3-clause'),
          t(' by housing and a civic centre.')
        ]
      },
      {
        id: 'gb13-body1',
        role: 'body1',
        labelTh: ROLE_LABEL_TH.body1,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel('gb13-b1', ['In 2005', 'By 2025', 'Since 2005'], 'In 2005', 'transition'),
          t(', the north of the town '),
          typ('gb13-b2', 'occupy', ['was occupied'], 'v3-clause'),
          t(' by a large shopping mall and a car park. '),
          sel('gb13-b3', ['Meanwhile', 'Therefore', 'For example'], 'Meanwhile', 'transition'),
          t(', the southwest '),
          typ('gb13-b4', 'contain', ['contained'], 'verb-tense'),
          t(' an industrial zone, '),
          sel('gb13-b5', ['while', 'because', 'unless'], 'while', 'transition'),
          t(' a market and an open space '),
          typ('gb13-b6', 'lie', ['lay'], 'verb-tense'),
          t(' to the south.')
        ]
      },
      {
        id: 'gb13-body2',
        role: 'body2',
        labelTh: ROLE_LABEL_TH.body2,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel('gb13-c1', ['By 2025', 'In 2005', 'Until 2025'], 'By 2025', 'transition'),
          t(', the mall and car park '),
          typ('gb13-c2', 'demolish', ['had been demolished', 'were demolished'], 'v3-clause'),
          t(' and '),
          typ('gb13-c3', 'replace', ['replaced'], 'v3-clause'),
          t(' by residential housing and a civic centre. The industrial zone '),
          typ('gb13-c4', 'convert', ['was converted'], 'v3-clause'),
          t(' into a tech park, '),
          sel('gb13-c5', ['whereas', 'therefore', 'moreover'], 'whereas', 'transition'),
          t(' the market '),
          typ('gb13-c6', 'turn', ['was turned'], 'v3-clause'),
          t(' into a library, and the open space became a public park.')
        ]
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════════
  // PROCESS — How instant coffee is produced (passive present)
  // ══════════════════════════════════════════════════════════════════
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
          sel('gb14-i1', ['illustrates', 'insists', 'invents'], 'illustrates', 'paraphrase'),
          t(' the '),
          sel('gb14-i2', ['process', 'promise', 'progress'], 'process', 'paraphrase'),
          t(' by which instant coffee '),
          sel('gb14-i3', ['is produced', 'produces', 'producing'], 'is produced', 'word-choice'),
          t('.')
        ]
      },
      {
        id: 'gb14-overview',
        role: 'overview',
        labelTh: ROLE_LABEL_TH.overview,
        hintTh: HINT_CONJUGATE,
        segments: [
          t('Overall, the process '),
          typ('gb14-o1', 'consist', ['consists'], 'verb-tense'),
          t(' of eight main stages, '),
          typ('gb14-o2', 'begin', ['beginning'], 'ving-clause'),
          t(' with the harvesting of coffee cherries and '),
          typ('gb14-o3', 'end', ['ending'], 'ving-clause'),
          t(' with the '),
          sel('gb14-o4', ['packaging', 'planting', 'painting'], 'packaging', 'word-choice'),
          t(' of the finished granules.')
        ]
      },
      {
        id: 'gb14-body1',
        role: 'body1',
        labelTh: ROLE_LABEL_TH.body1,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel('gb14-b1', ['First', 'Finally', 'Instead'], 'First', 'transition'),
          t(', ripe coffee cherries '),
          typ('gb14-b2', 'pick', ['are picked'], 'v3-clause'),
          t(' by hand or machine. '),
          sel('gb14-b3', ['Next', 'Lastly', 'However'], 'Next', 'transition'),
          t(', they '),
          typ('gb14-b4', 'pulp', ['are pulped'], 'v3-clause'),
          t(' to remove the outer skin, before the beans '),
          typ('gb14-b5', 'dry', ['are dried'], 'v3-clause'),
          t(' in the sun '),
          sel('gb14-b6', ['for', 'since', 'until'], 'for', 'word-choice'),
          t(' several days.')
        ]
      },
      {
        id: 'gb14-body2',
        role: 'body2',
        labelTh: ROLE_LABEL_TH.body2,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel('gb14-c1', ['After that', 'At first', 'In contrast'], 'After that', 'transition'),
          t(', the dried beans '),
          typ('gb14-c2', 'roast', ['are roasted'], 'v3-clause'),
          t(' and '),
          typ('gb14-c3', 'grind', ['ground', 'are ground'], 'v3-clause'),
          t(' into a fine powder. This powder '),
          typ('gb14-c4', 'dissolve', ['is dissolved'], 'v3-clause'),
          t(' in hot water and then '),
          typ('gb14-c5', 'spray-dry', ['is spray-dried', 'spray-dried'], 'v3-clause'),
          t(' into granules. '),
          sel('gb14-c6', ['Finally', 'First', 'Meanwhile'], 'Finally', 'transition'),
          t(', the granules '),
          typ('gb14-c7', 'package', ['are packaged'], 'v3-clause'),
          t(' into jars, ready for sale.')
        ]
      }
    ]
  }
]

export const getWritingGuidedBuilder = (promptId: string): WgbExercise | null =>
  WRITING_GUIDED_BUILDERS.find((exercise) => exercise.promptId === promptId) || null

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
