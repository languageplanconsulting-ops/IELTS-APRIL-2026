// Bundle plans: which lessons each target-band plan schedules.
//
// Two independent axes, deliberately kept separate:
//
//   PLAN (this file)  — WHICH lessons, chosen by the band the student is aiming at.
//   PACE (the planner) — HOW FAST, chosen by days-until-exam and minutes-per-day.
//
// Keeping them orthogonal means three plans cover every deadline, instead of
// needing a plan per (band × timeframe) combination.
//
// Nothing here ever hides a lesson. A plan decides what the calendar schedules
// and what "100%" means; every lesson stays visible and openable, marked as
// skippable when it falls outside the student's plan. That mirrors how the
// Writing course already treats its tiers — tier drives sequencing, not access.
//
// ── Why these particular selections ──────────────────────────────────────────
//
// SPEAKING. Measured evidence (Seedhouse et al. 2014, 60 rated tests) shows the
// Band 6 → 7 gap is grammatical: errors per 100 words roughly halve (3.3 → 1.5)
// and verb-form range steps up (7.8 → 12.0), while lexical breadth barely
// separates any band. Raw fluency has largely plateaued by Band 6 — it is the
// 5 → 6 lever, not 6 → 7. So Band 6 keeps the tense/grammar work and the
// discourse-marker lesson, and takes only a thin slice of Part 3 topic vocab.
//
// The five Part 3 topics come from the only real count of official material
// (365 questions across Cambridge IELTS 3–19): business/work leads by a wide
// margin, then technology, education, society, arts & media, people. Environment
// — near-universal on prep-site "top 5" lists — is not a Part 3 category in that
// corpus at all, so it sits outside the core.
//
// LISTENING. Unlike Speaking topics, IELTS Listening question types are fixed
// and enumerable, so the core is one technique lesson per section plus one per
// question type, and the two note-taking/word-limit lessons that prevent the
// most common avoidable losses.
//
// READING. All technique chapters (c0–c5) are core in every plan — the theory
// genuinely is that long. Only the number of full test walkthroughs varies.

export type PlanId = 'band6' | 'fast75' | 'full75'

export type CourseId = 'writing' | 'reading' | 'speaking' | 'listening' | 'grammar'

export type PlanMeta = {
  id: PlanId
  label: string
  labelTh: string
  tagline: string
  /** Shown on the plan picker so the choice is made on facts, not vibes. */
  bullets: string[]
}

export const PLANS: PlanMeta[] = [
  {
    id: 'band6',
    label: 'Band 6',
    labelTh: 'เป้า Band 6',
    tagline: 'แกนหลักของทุกสกิล — พอสำหรับ Band 6',
    bullets: [
      'ครบทุกสกิล แต่เอาเฉพาะบทแกน',
      'Writing: เน้น line/pie/mixed/map/process อย่างละ 1–2 บท',
      'Speaking: เน้นไวยากรณ์และความแม่นยำ ไม่ใช่คลังศัพท์'
    ]
  },
  {
    id: 'fast75',
    label: 'Band 7–7.5 · Fast',
    labelTh: 'เป้า Band 7–7.5 · เร่งรัด',
    tagline: 'เฉพาะบทแกน ครบทุกประเภทคำถาม',
    bullets: [
      'ทฤษฎีครบ + ชุดข้อสอบจริง 2 ชุด',
      'ข้ามบทฝึกซ้ำได้ แต่ยังกดดูได้ทุกบท',
      'เหมาะกับคนมีเวลาจำกัดแต่ต้องการ Band 7+'
    ]
  },
  {
    id: 'full75',
    label: 'Band 7–7.5 · Full',
    labelTh: 'เป้า Band 7–7.5 · เต็มคอร์ส',
    tagline: 'ทุกบท ทุกชุดข้อสอบ',
    bullets: ['ครบทั้งหมดตามลำดับที่สอน', 'ชุดข้อสอบจริงครบทุกชุด', 'เหมาะกับคนมีเวลา 3 เดือนขึ้นไป']
  }
]

export const PLAN_BY_ID: Record<PlanId, PlanMeta> = PLANS.reduce(
  (acc, p) => ({ ...acc, [p.id]: p }),
  {} as Record<PlanId, PlanMeta>
)

/**
 * Writing is selected by the curriculum's own `questionType` tags rather than by
 * lesson key, so it survives lessons being added or reordered.
 *
 * Band 6 takes Task 1 breadth over depth — one or two lessons across line, pie,
 * mixed, map and process — plus Task 2 essentials and the "to what extent"
 * essay. It deliberately skips the Task 2 topic bank, which is the single
 * largest block in the course (382 min) and the weakest band lever.
 */
export const WRITING_QUESTION_TYPES_BY_PLAN: Record<PlanId, string[] | 'all'> = {
  band6: [
    'basics',
    't1_intro',
    't1_line',
    't1_pie',
    't1_mixed',
    't1_map',
    't1_process',
    't2_intro',
    't2_twe'
  ],
  fast75: 'all', // tier 1 across every question type
  full75: 'all'
}

/** How many Task-1 lessons Band 6 takes from each chart type, in taught order. */
export const BAND6_WRITING_PER_TYPE_CAP = 2

/** Writing tiers to schedule. Tier 1 = the core method video per question type. */
export const WRITING_TIERS_BY_PLAN: Record<PlanId, (1 | 2 | 3)[]> = {
  band6: [1],
  fast75: [1],
  full75: [1, 2, 3]
}

/**
 * Reading: technique chapters are core in every plan — that body of theory is
 * simply long, and shortening it would not produce a student who can read.
 * Plans differ only in how many full test walkthroughs they schedule.
 */
export const READING_THEORY_CHAPTERS = [0, 1, 2, 3, 4, 5]
export const READING_TEST_CHAPTERS_BY_PLAN: Record<PlanId, number[]> = {
  band6: [],
  fast75: [6, 7],
  full75: [6, 7, 8, 9, 10, 11]
}

/**
 * Speaking core.
 *
 * Band 6 protects accuracy: the tense lessons, discourse markers, the Part 1
 * and Part 2 machinery, and the grammar summary — with only two Part 3 topics
 * so the student has something to say without the vocabulary work displacing
 * the grammar work.
 *
 * Fast adds the five highest-recurrence Part 3 topics from the Cambridge count:
 * work (c8-l0), technology/social media (c9-l0), education (c9-l4),
 * arts & media (c9-l1), people/personality (c8-l1).
 */
export const SPEAKING_KEYS_BY_PLAN: Record<PlanId, string[] | 'all'> = {
  band6: [
    'c0-l0', // exam format + what Band 7 needs
    'c1-l0', // past tense — accuracy
    'c1-l1', // future tense — accuracy
    'c1-l2', // discourse markers
    'c1-l3', // Part 1 real questions
    'c2-l0', // giving opinions
    'c2-l1', // organising ideas logically
    'c3-l2', // Part 1 summary
    'c4-l0', // the 2-minute long turn
    'c4-l1', // how to practise the long turn
    'c4-l2', // worked Part 2 example
    'c7-l0', // Part 2 event template
    'c7-l2', // Part 3 introduction
    'c8-l0', // Part 3: work — highest-recurrence topic
    'c9-l4', // Part 3: education
    'c10-l0', // grammar summary — the 6→7 lever
    'c10-l1' // full simulation
  ],
  fast75: [
    'c0-l0',
    'c1-l0',
    'c1-l1',
    'c1-l2',
    'c1-l3',
    'c2-l0',
    'c2-l1',
    'c2-l2',
    'c3-l0',
    'c3-l2',
    'c4-l0',
    'c4-l1',
    'c4-l2',
    'c5-l0', // people vocabulary — feeds the Part 2 long turn
    'c5-l3', // places vocabulary
    'c6-l0', // activities
    'c6-l2', // objects
    'c7-l0', // events
    'c7-l2', // Part 3 introduction
    'c8-l0', // work
    'c8-l1', // people/personality
    'c9-l0', // technology / social media
    'c9-l1', // arts & media
    'c9-l4', // education
    'c10-l0', // grammar summary
    'c10-l1' // full simulation
  ],
  full75: 'all'
}

/**
 * Listening core: one technique lesson per section, one per question type, plus
 * note-taking and the word-limit rule — the two cheapest ways to stop losing
 * marks that were otherwise earned. Fast adds one complete test walkthrough.
 */
export const LISTENING_KEYS_BY_PLAN: Record<PlanId, string[] | 'all'> = {
  band6: [
    'c0-l0', // overview of every technique
    'c1-l0', // Section 1 technique
    'c2-l0', // Section 2 technique
    'c2-l3', // map labelling
    'c2-l4', // multiple choice
    'c2-l5', // matching information
    'c2-l6', // diagram completion
    'c3-l0', // note-taking + the grammar that helps
    'c3-l1', // listening for ONE WORD (word-limit rule)
    'c4-l0' // Section 4 technique
  ],
  fast75: [
    'c0-l0',
    'c1-l0',
    'c2-l0',
    'c2-l3',
    'c2-l4',
    'c2-l5',
    'c2-l6',
    'c3-l0',
    'c3-l1',
    'c4-l0',
    'c6-l0', // full test, Sections 1–2
    'c6-l1' // full test, Sections 3–4
  ],
  full75: 'all'
}

/**
 * The standalone Grammar Foundation course is NOT part of any band plan — it is
 * a separate pre-intermediate course, sold with the 6-month tier. Grammar
 * *within* the skill courses (the Speaking grammar summary, Writing's grammar
 * lessons) is what carries the Band 6 → 7 accuracy gain, and that is already
 * selected above.
 */
export const GRAMMAR_IN_BAND_PLANS = false

/** Courses a plan schedules at all. */
export const COURSES_BY_PLAN: Record<PlanId, CourseId[]> = {
  band6: ['writing', 'reading', 'speaking', 'listening'],
  fast75: ['writing', 'reading', 'speaking', 'listening'],
  full75: ['writing', 'reading', 'speaking', 'listening']
}

/**
 * Why a given lesson sits outside the student's plan — shown when they open a
 * skippable lesson. Stated as a fact plus a reason, never as a prohibition:
 * the lesson is open, and the student decides.
 */
export const SKIPPABLE_REASON_TH: Record<PlanId, string> = {
  band6: 'บทนี้ไม่ได้อยู่ในแผน Band 6 ของคุณ — ข้ามได้ ไม่กระทบเป้าหมาย แต่ดูได้ถ้าอยากดู',
  fast75: 'บทนี้ไม่ได้อยู่ในแผนเร่งรัด — ข้ามได้ ไม่กระทบเป้าหมาย แต่ดูได้ถ้าอยากดู',
  full75: ''
}
