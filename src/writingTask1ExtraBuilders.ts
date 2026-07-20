/**
 * Compact guided builders for newly added Task 1 prompts.
 * Pattern-matched to existing teacher essay structure (intro → overview → body1 → body2).
 */
import type { WgbExercise, WgbFocus, WgbSegment, WgbStep } from './writingGuidedBuilder'
import { overviewOpener } from './writingTask1Overview'
import { countTask1Paragraphs } from './writingTask1WordCount'

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

const ROLE_LABEL_TH: Record<WgbStep['role'], string> = {
  intro: 'Introduction',
  overview: 'Overview',
  body1: 'Body Paragraph 1',
  body2: 'Body Paragraph 2'
}

const HINT_PARAPHRASE = 'เลือกคำ paraphrase ที่เหมาะสมที่สุด (ความหมายเดียวกับโจทย์)'
const HINT_CONJUGATE = 'พิมพ์คำกริยาที่ผันรูปให้ถูกต้อง — คำในวงเล็บคือรูปพื้นฐาน'

type TimelineSpec = {
  id: string
  promptId: string
  chartNoun: 'line graph' | 'bar chart' | 'table'
  /** Short general topic, no category names, e.g. "the proportion of students using different methods of learning" */
  subject: string
  /** Fed into "measured in …" in the introduction, e.g. "millions of workers" */
  unit: string
  fromYear: string
  midYear: string
  peakYear: string
  toYear: string
  /** Noun phrase used as subject, e.g. "spending on plant-based protein" / "online learning" */
  risingNoun: string
  /** Short phrase after "that of", e.g. "meat" / "in-person classes" */
  thatOfFalling: string
  /** Noun for "this figure for X" in body 2 */
  fallingNoun: string
  startRising: string
  startFalling: string
  midRising: string
  midFalling: string
  peakRising: string
  endRising?: string
  endFalling: string
  lowFalling?: string
  lowYear?: string
  riseAdv: string
  declineAdv: string
  increaseAdv: string
  dropAdv: string
}

function buildTimelineExercise(spec: TimelineSpec): WgbExercise {
  const p = spec.id.replace(/^gb-/, 'x')
  const yearSpan = Number(spec.toYear) - Number(spec.fromYear)
  const risingFluctuates = Boolean(spec.endRising) && spec.endRising !== spec.peakRising
  const risingEnd = spec.endRising ?? spec.peakRising
  const fallingLow = spec.lowFalling ?? spec.endFalling
  const fallingLowYear = spec.lowYear ?? spec.toYear
  const fallingFluctuates = fallingLowYear !== spec.toYear

  const risingClause = risingFluctuates
    ? [
        typ(`${p}-c1`, 'fluctuate', ['fluctuated'], 'verb-tense', 'past simple: fluctuated'),
        t(', '),
        typ(`${p}-c3`, 'reach', ['reaching'], 'ving-clause', 'V-ing: reaching a peak'),
        t(
          ` a peak at ${spec.peakRising} in ${spec.peakYear}, up from ${spec.startRising} in ${spec.fromYear}, and finishing at ${risingEnd} in ${spec.toYear}, as the chart shows. `
        )
      ]
    : [
        typ(`${p}-c1`, 'continue', ['continued'], 'verb-tense', 'past simple: continued'),
        t(' to rise, '),
        typ(`${p}-c3`, 'reach', ['reaching'], 'ving-clause', 'V-ing: reaching a peak'),
        t(
          ` its peak at ${spec.peakRising} in ${spec.peakYear}, up from ${spec.startRising} in ${spec.fromYear}, as the chart shows. `
        )
      ]

  const fallingClause = fallingFluctuates
    ? [
        typ(`${p}-c5`, 'fluctuate', ['fluctuated'], 'verb-tense', 'past simple: fluctuated'),
        t(', '),
        typ(`${p}-c7`, 'drop', ['dropping'], 'ving-clause', 'V-ing: dropping'),
        t(
          ` to its lowest point at ${fallingLow} in ${fallingLowYear}, down from ${spec.startFalling} in ${spec.fromYear}, and finishing at ${spec.endFalling} in ${spec.toYear}, as clearly shown in the data.`
        )
      ]
    : [
        typ(`${p}-c5`, 'drop', ['dropped'], 'verb-tense', 'past simple: dropped'),
        t(' consistently, '),
        typ(`${p}-c7`, 'reach', ['reaching'], 'ving-clause', 'V-ing: reaching'),
        t(
          ` the lowest point at ${fallingLow} during the same year, down from ${spec.startFalling} in ${spec.fromYear}, as clearly shown in the data.`
        )
      ]

  return {
    id: spec.id,
    promptId: spec.promptId,
    steps: [
      {
        id: `${p}-intro`,
        role: 'intro',
        labelTh: ROLE_LABEL_TH.intro,
        hintTh: HINT_PARAPHRASE,
        segments: [
          t(`The ${spec.chartNoun} `),
          sel(`${p}-i1`, ['compares', 'argues', 'decides'], 'compares', 'paraphrase', 'The + ชื่อกราฟเอกพจน์ ใช้ compares เพื่อบอกว่ากราฟเปรียบเทียบข้อมูล'),
          t(` the ${spec.subject}: ${spec.risingNoun} and ${spec.thatOfFalling}, over a ${yearSpan}-year period from ${spec.fromYear} `),
          sel(`${p}-i2`, ['to', 'until', 'with'], 'to', 'word-choice', 'from X to Y'),
          t(` ${spec.toYear}, measured in ${spec.unit}.`)
        ]
      },
      {
        id: `${p}-overview`,
        role: 'overview',
        labelTh: ROLE_LABEL_TH.overview,
        hintTh: HINT_CONJUGATE,
        segments: [
          ...overviewOpener(p),
          t(`while ${spec.risingNoun} `),
          sel(
            `${p}-o2`,
            [
              'experienced an upward trend',
              'showed an upward trend',
              'fluctuated',
              'remained unchanged over the given period'
            ],
            'experienced an upward trend',
            'trend-phrase',
            'Timeline ขาขึ้นต้องใช้ experienced an upward trend — ห้ามใช้ showed'
          ),
          t(`, that of ${spec.thatOfFalling} `),
          sel(
            `${p}-o3`,
            [
              'displayed a downward trend',
              'showed a downward trend',
              'fluctuated',
              'remained unchanged over the given period'
            ],
            'displayed a downward trend',
            'trend-phrase',
            'ขาลงใช้ displayed a downward trend'
          ),
          t(' over the given period.')
        ]
      },
      {
        id: `${p}-body1`,
        role: 'body1',
        labelTh: ROLE_LABEL_TH.body1,
        hintTh: HINT_CONJUGATE,
        segments: [
          t(`Starting in ${spec.fromYear}, ${spec.thatOfFalling} `),
          typ(`${p}-b1`, 'represent', ['represented'], 'verb-tense', 'past simple: represented'),
          t(` the highest figure in the data, at ${spec.startFalling}, while ${spec.risingNoun} `),
          typ(`${p}-b3`, 'represent', ['represented'], 'verb-tense', 'past simple: represented'),
          t(` the lowest, at just ${spec.startRising}, according to the chart. `),
          t(`However, by ${spec.midYear}, the figure for ${spec.risingNoun} had `),
          typ(`${p}-b5`, 'increase', ['increased'], 'verb-tense', 'past simple: increased'),
          t(' '),
          sel(
            `${p}-b6`,
            [spec.riseAdv, 'rarely', 'barely'],
            spec.riseAdv,
            'degree-adverb',
            `ใช้ ${spec.riseAdv} บอกระดับการเพิ่มขึ้น`
          ),
          t(` to ${spec.midRising}, while that for ${spec.fallingNoun} had `),
          typ(`${p}-b8`, 'drop', ['dropped'], 'verb-tense', 'past simple: dropped'),
          t(' '),
          sel(
            `${p}-b9`,
            [spec.declineAdv, 'happily', 'rarely'],
            spec.declineAdv,
            'degree-adverb',
            `ใช้ ${spec.declineAdv} บอกระดับการลดลง`
          ),
          t(` to ${spec.midFalling} over the same period.`)
        ]
      },
      {
        id: `${p}-body2`,
        role: 'body2',
        labelTh: ROLE_LABEL_TH.body2,
        hintTh: HINT_CONJUGATE,
        segments: [
          t(`From ${spec.midYear} onwards, ${spec.risingNoun} `),
          ...risingClause,
          sel(
            `${p}-c4`,
            ['On the other hand', 'Therefore', 'For example'],
            'On the other hand',
            'transition',
            'On the other hand เปิดประโยค complex ที่ 2'
          ),
          t(`, ${spec.fallingNoun} `),
          ...fallingClause
        ]
      }
    ]
  }
}

/** One ranked figure quoted in a snapshot body — label plus its exact chart value. */
type SnapshotItem = { label: string; value: string; be?: 'was' | 'were' }

type SnapshotSpec = {
  id: string
  promptId: string
  chartNoun: 'pie chart' | 'pie charts' | 'bar chart' | 'table'
  subject: string
  /** e.g. "in different product categories" — sits straight after the subject */
  categoryPhrase: string
  /** e.g. "GrabFood and Line Man" — fed into "such as …" in the introduction */
  examples: string
  /** e.g. "millions of dollars" — fed into "measured in …" in the introduction */
  unit: string
  /** e.g. "in 2023" — closes the introduction */
  timeframe?: string
  visualCount: 1 | 2
  leadingItem: string
  contrastItem: string
  leadingBe?: 'was' | 'were'
  contrastBe?: 'was' | 'were'
  /** Body 1 = "Starting with <topic>, …" then its ranked figures, largest first. */
  body1Topic: string
  body1Items: SnapshotItem[]
  /** Superlative for the top figure — money charts read "the most valuable category". */
  body1Lead?: string
  /** What the numbers are. Rating tables are scores, not shares; hours are figures. */
  measureNoun?: 'share' | 'score' | 'figure'
  /**
   * True when the two charts are the same metric at two points in time. Body 2
   * then tracks each figure against the earlier year (rose / fell / held steady)
   * instead of comparing across places.
   */
  timeComparison?: boolean
  /** Body 2 = "In terms of <topic>, …" then its ranked figures, largest first. */
  body2Topic: string
  body2Items: SnapshotItem[]
}

/**
 * Body 1 (CLAUDE.md snapshot SOP): report figures only, never rank them against
 * each other. Sentence 1 names the top two, sentence 2 the next pair, sentence 3
 * the lowest — each sentence after the first opens with "However".
 */

/** Minimum length for a Task 1 model answer (the IELTS floor). */
const SNAPSHOT_TARGET_WORDS = 152

const segmentsToText = (segments: WgbSegment[]): string =>
  segments
    .map((segment) =>
      segment.kind === 'text'
        ? segment.text
        : segment.blank.kind === 'select'
          ? segment.blank.answer
          : segment.blank.answers[0]
    )
    .join('')
    .replace(/\s+([,.])/g, '$1')

/** Parse "34%", "8.5", "6.5 hours" or "$23 million" into a number plus its formatting. */
const parseFigure = (value: string): { num: number; format: (n: number) => string } | null => {
  const match = value.match(/^(\$?)([\d.,]+)(.*)$/)
  if (!match) return null
  const num = Number(match[2].replace(/,/g, ''))
  if (!Number.isFinite(num)) return null
  const prefix = match[1]
  const suffix = match[3]
  return {
    num,
    format: (n: number) => {
      const rounded = Number(n.toFixed(2))
      // "1 hours" reads wrong — drop the plural when the gap is exactly one unit
      const unit = rounded === 1 ? suffix.replace(/s$/, '') : suffix
      return `${prefix}${rounded.toLocaleString('en-US')}${unit}`
    }
  }
}

/**
 * Teacher-approved top-up sentence: "…, lower than that of X by Y". Only appended
 * when a chart is too thin to reach the IELTS word floor on figures alone, and it
 * still only reports numbers — the gap is stated, never interpreted.
 */
const comparisonSentence = (
  top: SnapshotItem,
  item: SnapshotItem,
  transition: string,
  isShare: boolean
): string | null => {
  const high = parseFigure(top.value)
  const low = parseFigure(item.value)
  if (!high || !low) return null
  const gap = high.num - low.num
  if (gap <= 0) return null
  return ` ${transition}, the ${isShare ? 'share' : 'figure'} for ${item.label} was lower than that of ${top.label} by ${high.format(gap)}.`
}

const TOP_UP_TRANSITIONS = ['Interestingly', 'Similarly', 'Likewise', 'Surprisingly']

const makeOrRecord = (id: string, isShare: boolean): WgbSegment =>
  isShare
    ? typ(id, 'make', ['made'], 'verb-tense', 'past simple')
    : typ(id, 'record', ['recorded'], 'verb-tense', 'past simple')

function snapshotBody1Segments(p: string, spec: SnapshotSpec): WgbSegment[] {
  const items = spec.body1Items
  const lead = spec.body1Lead ?? 'the largest category'
  const measure = spec.measureNoun ?? 'share'
  const measurePlural = `${measure}s`
  const isShare = measure === 'share'
  const segments: WgbSegment[] = [
    t(`Starting with ${spec.body1Topic}, ${items[0].label} `),
    typ(`${p}-b1`, 'be', [items[0].be ?? 'was'], 'verb-tense', 'past simple'),
    t(` ${lead}, representing ${items[0].value}, `),
    typ(`${p}-b2`, 'follow', ['followed'], 'v3-clause', 'V3 \u0e2b\u0e25\u0e31\u0e07\u0e04\u0e2d\u0e21\u0e21\u0e32: followed by = \u0e15\u0e32\u0e21\u0e21\u0e32\u0e14\u0e49\u0e27\u0e22'),
    t(` by ${items[1].label}, which `),
    isShare
      ? typ(`${p}-b2b`, 'account', ['accounted'], 'verb-tense', 'past simple')
      : typ(`${p}-b2b`, 'record', ['recorded'], 'verb-tense', 'past simple'),
    t(`${isShare ? ' for' : ''} ${items[1].value}.`)
  ]

  // Middle sentence: one figure when the chart has four categories, a pair when it has five or more.
  const middle = items.length >= 5 ? items.slice(2, 4) : items.length === 4 ? items.slice(2, 3) : []
  if (middle.length === 2) {
    segments.push(
      t(` However, ${middle[0].label} and ${middle[1].label} `),
      isShare
        ? typ(`${p}-b3`, 'make', ['made'], 'verb-tense', 'past simple')
        : typ(`${p}-b3`, 'record', ['recorded'], 'verb-tense', 'past simple'),
      t(isShare ? ' up ' : ' '),
      sel(
        `${p}-b4`,
        ['significantly', 'markedly', 'barely'],
        'significantly',
        'degree-adverb',
        'significantly = \u0e2d\u0e22\u0e48\u0e32\u0e07\u0e21\u0e32\u0e01 (\u0e43\u0e0a\u0e49\u0e04\u0e33\u0e19\u0e35\u0e49\u0e40\u0e17\u0e48\u0e32\u0e19\u0e31\u0e49\u0e19) \u0e2a\u0e48\u0e27\u0e19 markedly \u0e2b\u0e49\u0e32\u0e21\u0e43\u0e0a\u0e49 \u0e41\u0e25\u0e30 barely = \u0e41\u0e17\u0e1a\u0e44\u0e21\u0e48'
      ),
      t(`${isShare ? ' smaller' : ' lower'} ${measurePlural}, ${isShare ? 'accounting for' : 'standing at'} ${middle[0].value} and ${middle[1].value}, respectively.`)
    )
  } else if (middle.length === 1) {
    segments.push(
      t(` However, ${middle[0].label} `),
      isShare
        ? typ(`${p}-b3`, 'make', ['made'], 'verb-tense', 'past simple')
        : typ(`${p}-b3`, 'record', ['recorded'], 'verb-tense', 'past simple'),
      t(isShare ? ' up a ' : ' a '),
      sel(
        `${p}-b4`,
        ['significantly', 'markedly', 'barely'],
        'significantly',
        'degree-adverb',
        'significantly = \u0e2d\u0e22\u0e48\u0e32\u0e07\u0e21\u0e32\u0e01 (\u0e43\u0e0a\u0e49\u0e04\u0e33\u0e19\u0e35\u0e49\u0e40\u0e17\u0e48\u0e32\u0e19\u0e31\u0e49\u0e19) \u0e2a\u0e48\u0e27\u0e19 markedly \u0e2b\u0e49\u0e32\u0e21\u0e43\u0e0a\u0e49 \u0e41\u0e25\u0e30 barely = \u0e41\u0e17\u0e1a\u0e44\u0e21\u0e48'
      ),
      t(`${isShare ? ' smaller' : ' lower'} ${measure}, ${isShare ? 'accounting for' : 'standing at'} ${middle[0].value}.`)
    )
  }

  // Closing sentence: the lowest figure, or the lowest pair when they are level.
  const tail = items.slice(2 + middle.length)
  if (tail.length >= 2) {
    const [a, b] = [tail[0], tail[1]]
    segments.push(t(` However, ${a.label} and ${b.label} `))
    if (a.value === b.value) {
      segments.push(
        t('each '),
        makeOrRecord(`${p}-b5`, isShare),
        t(`${isShare ? ' up' : ''} ${a.value}, accounting for the lowest figures.`)
      )
    } else {
      segments.push(
        makeOrRecord(`${p}-b5`, isShare),
        t(`${isShare ? ' up' : ''} ${a.value} and ${b.value}, respectively, accounting for the lowest figures.`)
      )
    }
  } else if (tail.length === 1) {
    segments.push(
      t(` However, ${tail[0].label} `),
      makeOrRecord(`${p}-b5`, isShare),
      t(`${isShare ? ' up' : ''} ${tail[0].value}, accounting for the lowest figure.`)
    )
  }

  return segments
}

/**
 * Body 2 (CLAUDE.md snapshot SOP): largest first, the middle figures joined with
 * "Similarly, … followed closely", the smallest closed with "In contrast".
 */

/** How big a move is, relative to where it started. */
const moveAdverb = (gap: number, base: number): string => {
  const ratio = base === 0 ? 1 : gap / base
  if (ratio >= 0.4) return 'dramatically'
  if (ratio >= 0.2) return 'significantly'
  if (ratio >= 0.1) return 'moderately'
  return 'slightly'
}

/**
 * Body 2 for two-charts-one-metric-two-years prompts. Every figure is tracked
 * back to the earlier year — rose, fell, or held steady — which is reporting
 * movement, not interpreting it.
 */
function snapshotBody2RichSegments(p: string, spec: SnapshotSpec): WgbSegment[] {
  const items = spec.body2Items
  const measure = spec.measureNoun ?? 'share'
  const isShare = measure === 'share'
  const before = (label: string) => spec.body1Items.find((x) => x.label === label)

  /**
   * Two charts of the same metric a few years apart get movement ("which
   * increased dramatically from 2008 by 17%"); two places get the plain gap
   * ("which was higher than that of Australia by 24%"). Either way it states a
   * number rather than reading anything into it.
   */
  const movement = (item: SnapshotItem, lead: string): string => {
    const prior = before(item.label)
    const now = parseFigure(item.value)
    const then = prior ? parseFigure(prior.value) : null
    if (!now || !then) return ''
    const gap = Math.abs(now.num - then.num)
    if (gap === 0) {
      return spec.timeComparison ? `${lead} remained unchanged from ${spec.body1Topic}` : ''
    }
    if (spec.timeComparison) {
      const verb = now.num > then.num ? 'increased' : 'declined'
      return `${lead} ${verb} ${moveAdverb(gap, then.num)} from ${spec.body1Topic} by ${then.format(gap)}`
    }
    const direction = now.num > then.num ? 'higher' : 'lower'
    return `${lead} was ${direction} than that of ${spec.body1Topic} by ${then.format(gap)}`
  }

  const [first, second, third] = items
  const last = items[items.length - 1]
  const middle = items.slice(3, -1)

  const segments: WgbSegment[] = [
    t(`In terms of ${spec.body2Topic}, ${first.label} `),
    isShare
      ? typ(`${p}-c1`, 'account', ['accounted'], 'verb-tense', 'past simple')
      : typ(`${p}-c1`, 'record', ['recorded'], 'verb-tense', 'past simple'),
    t(
      `${isShare ? ' for the largest proportion' : ` the highest ${measure}`}, at ${first.value}${movement(first, ', which')}. `
    ),
    sel(`${p}-c2`, ['However', 'Because', 'Therefore'], 'However', 'transition', 'However = อย่างไรก็ตาม'),
    t(`, the ${measure} for ${second.label}`),
    t(`${movement(second, '')}, `),
    typ(`${p}-c3`, 'make', ['making'], 'ving-clause', 'V-ing clause: making up'),
    t(` up ${second.value}, while ${third.label} `),
    typ(`${p}-c4`, 'follow', ['followed'], 'verb-tense', 'past simple'),
    t(` closely, representing ${third.value}`)
  ]

  if (middle.length) {
    segments.push(
      t(`, alongside ${middle.map((x) => x.label).join(' and ')} at ${middle.map((x) => x.value).join(' and ')}`)
    )
  }
  segments.push(t('. '))

  // "remained the smallest" only holds when this category was also last in the
  // first chart — Oppo was fourth in 2020, so it cannot have "remained" lowest.
  const wasAlsoLast = spec.body1Items[spec.body1Items.length - 1]?.label === last.label
  const lowestNoun = isShare ? 'smallest share' : `lowest ${measure}`
  segments.push(
    sel(`${p}-c5`, ['In contrast', 'Therefore', 'For example'], 'In contrast', 'transition', 'In contrast = ในทางตรงกันข้าม'),
    t(`, ${last.label} `)
  )
  if (wasAlsoLast && spec.timeComparison) {
    segments.push(
      typ(`${p}-c6`, 'remain', ['remained'], 'verb-tense', 'past simple'),
      t(` the ${lowestNoun} across the two years, making up only ${last.value}.`)
    )
  } else {
    segments.push(
      typ(`${p}-c6`, 'make', ['made'], 'verb-tense', 'past simple'),
      t(` up the ${lowestNoun}, at just ${last.value}${movement(last, ', which')}.`)
    )
  }
  return segments
}

function snapshotBody2Segments(p: string, spec: SnapshotSpec): WgbSegment[] {
  const items = spec.body2Items
  const middle = items.slice(1, -1)
  const last = items[items.length - 1]
  const measure = spec.measureNoun ?? 'share'
  const isShare = measure === 'share'
  const segments: WgbSegment[] = isShare
    ? [
        t(`In terms of ${spec.body2Topic}, ${items[0].label} `),
        typ(`${p}-c1`, 'account', ['accounted'], 'verb-tense', 'past simple'),
        t(` for the largest proportion, at ${items[0].value}. `)
      ]
    : [
        t(`In terms of ${spec.body2Topic}, ${items[0].label} `),
        typ(`${p}-c1`, 'record', ['recorded'], 'verb-tense', 'past simple'),
        t(` the highest ${measure}, at ${items[0].value}. `)
      ]

  if (middle.length >= 2) {
    segments.push(
      sel(`${p}-c2`, ['Similarly', 'Therefore', 'Otherwise'], 'Similarly', 'transition', 'Similarly = ในทำนองเดียวกัน'),
      t(`, ${middle[0].label} and ${middle[1].label} `),
      typ(`${p}-c3`, 'follow', ['followed'], 'verb-tense', 'past simple'),
      t(` closely, at ${middle[0].value} and ${middle[1].value}, respectively. `)
    )
  } else if (middle.length === 1) {
    segments.push(
      sel(`${p}-c2`, ['Similarly', 'Therefore', 'Otherwise'], 'Similarly', 'transition', 'Similarly = ในทำนองเดียวกัน'),
      t(`, ${middle[0].label} `),
      typ(`${p}-c3`, 'follow', ['followed'], 'verb-tense', 'past simple'),
      t(` closely, at ${middle[0].value}. `)
    )
  }

  segments.push(
    sel(`${p}-c4`, ['In contrast', 'Therefore', 'For example'], 'In contrast', 'transition', 'In contrast = ในทางตรงกันข้าม'),
    t(`, ${last.label} `)
  )
  const crossTail = crossChartClause(last, spec)
  if (isShare) {
    segments.push(
      typ(`${p}-c5`, 'make', ['made'], 'verb-tense', 'past simple'),
      t(` up the smallest share at just ${last.value}${crossTail}.`)
    )
  } else {
    segments.push(
      typ(`${p}-c5`, 'record', ['recorded'], 'verb-tense', 'past simple'),
      t(` the lowest ${measure} at just ${last.value}${crossTail}.`)
    )
  }

  return segments
}

/**
 * Body 2's closing figure carries a "which was lower/higher than that of …"
 * clause pointing back at the same category in the first chart — the only
 * cross-chart comparison the SOP allows, and still a bare statement of the gap.
 */
function crossChartClause(last: SnapshotItem, spec: SnapshotSpec): string {
  const counterpart = spec.body1Items.find((x) => x.label === last.label)
  if (!counterpart) return ''
  const here = parseFigure(last.value)
  const there = parseFigure(counterpart.value)
  if (!here || !there) return ''
  const gap = Math.abs(there.num - here.num)
  if (gap === 0) return ''
  const direction = here.num < there.num ? 'lower' : 'higher'
  return `, which was ${direction} than that of ${spec.body1Topic} by ${there.format(gap)}`
}

function buildSnapshotExercise(spec: SnapshotSpec): WgbExercise {
  const p = spec.id.replace(/^gb-/, 's')
  const pluralChart = spec.chartNoun.endsWith('s')
  const timeframe = spec.timeframe ? ` ${spec.timeframe}` : ''
  const exercise: WgbExercise = {
    id: spec.id,
    promptId: spec.promptId,
    steps: [
      {
        id: `${p}-intro`,
        role: 'intro',
        labelTh: ROLE_LABEL_TH.intro,
        hintTh: HINT_PARAPHRASE,
        segments: [
          t(`The ${spec.chartNoun} `),
          sel(
            `${p}-i1`,
            pluralChart ? ['compare', 'complain', 'consider'] : ['compares', 'complains', 'considers'],
            pluralChart ? 'compare' : 'compares',
            'paraphrase',
            `The ${spec.chartNoun} \u0e43\u0e0a\u0e49 ${pluralChart ? 'compare' : 'compares'} \u0e43\u0e2b\u0e49\u0e15\u0e23\u0e07\u0e01\u0e31\u0e1a\u0e1b\u0e23\u0e30\u0e18\u0e32\u0e19`
          ),
          t(` ${spec.subject} ${spec.categoryPhrase}, such as ${spec.examples}, measured in ${spec.unit}${timeframe}.`)
        ]
      },
      {
        id: `${p}-overview`,
        role: 'overview',
        labelTh: ROLE_LABEL_TH.overview,
        hintTh: HINT_CONJUGATE,
        segments: [
          ...overviewOpener(p),
          t(`${spec.leadingItem} ${spec.leadingBe ?? 'was'} the `),
          sel(
            `${p}-o1`,
            ['largest', 'larger', 'large'],
            'largest',
            'word-choice',
            'largest = \u0e21\u0e32\u0e01\u0e17\u0e35\u0e48\u0e2a\u0e38\u0e14 (superlative) \u0e40\u0e1e\u0e23\u0e32\u0e30\u0e40\u0e17\u0e35\u0e22\u0e1a\u0e01\u0e31\u0e1a\u0e17\u0e38\u0e01\u0e2b\u0e21\u0e27\u0e14 \u0e2a\u0e48\u0e27\u0e19 larger \u0e43\u0e0a\u0e49\u0e40\u0e17\u0e35\u0e22\u0e1a\u0e41\u0e04\u0e48 2 \u0e2a\u0e34\u0e48\u0e07 \u0e41\u0e25\u0e30 large \u0e40\u0e1b\u0e47\u0e19\u0e23\u0e39\u0e1b\u0e18\u0e23\u0e23\u0e21\u0e14\u0e32'
          ),
          t(spec.visualCount === 2 ? ' in the first chart, ' : ', '),
          sel(
            `${p}-o2`,
            ['while', 'because', 'unless'],
            'while',
            'transition',
            spec.visualCount === 2
              ? 'while \u0e40\u0e0a\u0e37\u0e48\u0e2d\u0e21\u0e2b\u0e21\u0e27\u0e14\u0e17\u0e35\u0e48\u0e21\u0e32\u0e01\u0e17\u0e35\u0e48\u0e2a\u0e38\u0e14\u0e02\u0e2d\u0e07\u0e20\u0e32\u0e1e\u0e17\u0e31\u0e49\u0e07\u0e2a\u0e2d\u0e07'
              : 'while \u0e40\u0e0a\u0e37\u0e48\u0e2d\u0e21\u0e2b\u0e21\u0e27\u0e14\u0e17\u0e35\u0e48\u0e21\u0e32\u0e01\u0e17\u0e35\u0e48\u0e2a\u0e38\u0e14\u0e01\u0e31\u0e1a\u0e2b\u0e21\u0e27\u0e14\u0e17\u0e35\u0e48\u0e19\u0e49\u0e2d\u0e22\u0e17\u0e35\u0e48\u0e2a\u0e38\u0e14'
          ),
          t(
            spec.visualCount === 2
              ? ` ${spec.contrastItem} ${spec.contrastBe ?? 'was'} the largest in the second chart.`
              : ` ${spec.contrastItem} ${spec.contrastBe ?? 'was'} the smallest in share.`
          )
        ]
      },
      {
        id: `${p}-body1`,
        role: 'body1',
        labelTh: ROLE_LABEL_TH.body1,
        hintTh: HINT_CONJUGATE,
        segments: snapshotBody1Segments(p, spec)
      },
      {
        id: `${p}-body2`,
        role: 'body2',
        labelTh: ROLE_LABEL_TH.body2,
        hintTh: HINT_CONJUGATE,
        segments:
          spec.chartNoun === 'table' ? snapshotBody2Segments(p, spec) : snapshotBody2RichSegments(p, spec)
      }
    ]
  }

  padSnapshotToWordFloor(exercise, spec)
  return exercise
}

/**
 * Charts with only four or five categories cannot reach the IELTS word floor on
 * bare figures alone. Top them up with the taught comparison sentence — largest
 * gaps first — and stop the moment the essay is long enough.
 */
function padSnapshotToWordFloor(exercise: WgbExercise, spec: SnapshotSpec): void {
  const body1 = exercise.steps[2]
  const body2 = exercise.steps[3]
  const isShare = (spec.measureNoun ?? 'share') === 'share'
  const wordCount = () =>
    countTask1Paragraphs(exercise.steps.map((step) => ({ text: segmentsToText(step.segments) })))
  if (wordCount() >= SNAPSHOT_TARGET_WORDS) return

  type Candidate = { step: WgbStep; top: SnapshotItem; item: SnapshotItem }
  const candidates: Candidate[] = []
  const seen = new Set<string>()
  const add = (step: WgbStep, top: SnapshotItem, item: SnapshotItem) => {
    const key = `${step.id}|${item.label}|${top.label}`
    if (top.label === item.label || seen.has(key)) return
    seen.add(key)
    candidates.push({ step, top, item })
  }

  const a = spec.body1Items
  const b = spec.body2Items
  const rounds = Math.max(a.length, b.length)
  // Each figure against its own group's leader, alternating between the two bodies.
  for (let i = 1; i < rounds; i += 1) {
    if (b[i]) add(body2, b[0], b[i])
    if (a[i]) add(body1, a[0], a[i])
  }
  // Then across the two charts, against the overall leader.
  for (let i = 0; i < b.length; i += 1) add(body2, a[0], b[i])
  // Finally against each group's runner-up, then across charts against it.
  for (let i = 2; i < rounds; i += 1) {
    if (b[i] && b[1]) add(body2, b[1], b[i])
    if (a[i] && a[1]) add(body1, a[1], a[i])
  }
  if (a[1]) for (let i = 0; i < b.length; i += 1) add(body2, a[1], b[i])

  let used = 0
  for (const candidate of candidates) {
    if (wordCount() >= SNAPSHOT_TARGET_WORDS) return
    const sentence = comparisonSentence(
      candidate.top,
      candidate.item,
      TOP_UP_TRANSITIONS[used % TOP_UP_TRANSITIONS.length],
      isShare
    )
    if (!sentence) continue
    candidate.step.segments.push(t(sentence))
    used += 1
  }
}

type ProcessSpec = {
  id: string
  promptId: string
  subject: string
  stageCount: string
  firstStage: string
  lastStage: string
  earlyPassive: string
  midPassive: string
  latePassive: string
}

function buildProcessExercise(spec: ProcessSpec): WgbExercise {
  const p = spec.id.replace(/^gb-/, 'p')
  return {
    id: spec.id,
    promptId: spec.promptId,
    steps: [
      {
        id: `${p}-intro`,
        role: 'intro',
        labelTh: ROLE_LABEL_TH.intro,
        hintTh: HINT_PARAPHRASE,
        segments: [
          t('The diagram '),
          sel(`${p}-i1`, ['compares', 'insists', 'invents'], 'compares', 'paraphrase', 'The diagram เป็นประธานเอกพจน์ จึงใช้ compares เท่านั้น'),
          t(' the '),
          sel(`${p}-i2`, ['stages', 'promise', 'progress'], 'stages', 'paraphrase', 'stages = ขั้นตอนต่าง ๆ ที่นำมาเปรียบเทียบในแผนภาพ'),
          t(` in the process by which ${spec.subject}, from the starting state to the completed output across the full production sequence.`)
        ]
      },
      {
        id: `${p}-overview`,
        role: 'overview',
        labelTh: ROLE_LABEL_TH.overview,
        hintTh: HINT_CONJUGATE,
        segments: [
          ...overviewOpener(p),
          t('the process '),
          typ(`${p}-o1`, 'consist', ['consists'], 'verb-tense', 'present simple เอกพจน์'),
          t(` of ${spec.stageCount} stages, `),
          typ(`${p}-o2`, 'begin', ['beginning'], 'ving-clause', 'V-ing'),
          t(` with ${spec.firstStage} and `),
          typ(`${p}-o3`, 'end', ['ending'], 'ving-clause', 'V-ing'),
          t(` with ${spec.lastStage}; therefore, each phase prepares the material for the next one.`)
        ]
      },
      {
        id: `${p}-body1`,
        role: 'body1',
        labelTh: ROLE_LABEL_TH.body1,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel(`${p}-b1`, ['First', 'Finally', 'Instead'], 'First', 'transition', 'First = ขั้นแรก'),
          t(`, ${spec.earlyPassive}, establishing the material needed for the later stages. `),
          sel(`${p}-b2`, ['Next', 'Lastly', 'Otherwise'], 'Next', 'transition', 'Next = ขั้นถัดไป'),
          t(`, ${spec.midPassive}; these intermediate steps alter or prepare the material before it can move towards the final part of the procedure. The stages occur in a fixed order, so each treatment is completed before the following operation begins.`)
        ]
      },
      {
        id: `${p}-body2`,
        role: 'body2',
        labelTh: ROLE_LABEL_TH.body2,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel(`${p}-c1`, ['Subsequently', 'Firstly', 'Instead'], 'Subsequently', 'transition', 'Subsequently = หลังจากนั้น'),
          t(`, ${spec.latePassive}, bringing the material into its finished form after the earlier preparation and treatment stages. `),
          sel(`${p}-c2`, ['Finally', 'First', 'Unless'], 'Finally', 'transition', 'Finally = สุดท้าย'),
          t(', the completed output '),
          typ(`${p}-c3`, 'prepare', ['is prepared'], 'v3-clause', 'passive present'),
          t(' for its next destination, and no material is returned to an earlier stage. This final step completes the sequence described in the diagram and separates the finished product from the raw input used at the beginning.')
        ]
      }
    ]
  }
}

export const EXTRA_TASK1_GUIDED_BUILDERS: WgbExercise[] = [
  buildTimelineExercise({
    id: 'gb-online-learning',
    promptId: 'timeline-online-learning',
    chartNoun: 'line graph',
    subject: 'proportion of students using different methods of learning',
    unit: 'percentage of students',
    fromYear: '2014',
    midYear: '2018',
    peakYear: '2024',
    toYear: '2024',
    risingNoun: 'online learning',
    thatOfFalling: 'in-person classes',
    fallingNoun: 'in-person classes',
    startRising: '18%',
    startFalling: '82%',
    midRising: '34%',
    midFalling: '66%',
    peakRising: '74%',
    endFalling: '26%',
    riseAdv: 'dramatically',
    declineAdv: 'steadily',
    increaseAdv: 'dramatically',
    dropAdv: 'sharply'
  }),
  buildTimelineExercise({
    id: 'gb-food-delivery',
    promptId: 'timeline-food-delivery',
    chartNoun: 'line graph',
    subject: 'number of vehicles sold by fuel type',
    unit: 'thousands of vehicles sold',
    fromYear: '2014',
    midYear: '2018',
    peakYear: '2024',
    toYear: '2024',
    risingNoun: 'electric vehicle sales',
    thatOfFalling: 'petrol vehicles',
    fallingNoun: 'petrol vehicles',
    startRising: '8 thousand',
    startFalling: '85 thousand',
    midRising: '28 thousand',
    midFalling: '72 thousand',
    peakRising: '88 thousand',
    endFalling: '30 thousand',
    riseAdv: 'dramatically',
    declineAdv: 'steadily',
    increaseAdv: 'dramatically',
    dropAdv: 'sharply'
  }),
  buildTimelineExercise({
    id: 'gb-work-from-home',
    promptId: 'timeline-work-from-home',
    chartNoun: 'bar chart',
    subject: 'number of people in different work arrangements',
    unit: 'millions of workers',
    fromYear: '2014',
    midYear: '2018',
    peakYear: '2020',
    toYear: '2024',
    risingNoun: 'remote work',
    thatOfFalling: 'office commuting',
    fallingNoun: 'office commuting',
    startRising: '4 million',
    startFalling: '48 million',
    midRising: '7 million',
    midFalling: '42 million',
    peakRising: '21 million',
    endRising: '16 million',
    endFalling: '30 million',
    lowFalling: '22 million',
    lowYear: '2020',
    riseAdv: 'moderately',
    declineAdv: 'steadily',
    increaseAdv: 'dramatically',
    dropAdv: 'sharply'
  }),
  buildTimelineExercise({
    id: 'gb-electric-bicycles',
    promptId: 'timeline-electric-bicycles',
    chartNoun: 'bar chart',
    subject: 'spending on different reading services',
    unit: 'millions of US dollars',
    fromYear: '2014',
    midYear: '2018',
    peakYear: '2024',
    toYear: '2024',
    risingNoun: 'spending on digital reading',
    thatOfFalling: 'public libraries',
    fallingNoun: 'public-library spending',
    startRising: '$12 million',
    startFalling: '$95 million',
    midRising: '$28 million',
    midFalling: '$72 million',
    peakRising: '$72 million',
    endFalling: '$28 million',
    riseAdv: 'steadily',
    declineAdv: 'continuously',
    increaseAdv: 'dramatically',
    dropAdv: 'dramatically'
  }),
  buildTimelineExercise({
    id: 'gb-smart-tvs',
    promptId: 'timeline-smart-tvs',
    chartNoun: 'table',
    subject: 'household ownership of different devices',
    unit: 'percentage of households',
    fromYear: '2014',
    midYear: '2018',
    peakYear: '2024',
    toYear: '2024',
    risingNoun: 'smart TV ownership',
    thatOfFalling: 'desktops',
    fallingNoun: 'desktop ownership',
    startRising: '12%',
    startFalling: '58%',
    midRising: '39%',
    midFalling: '44%',
    peakRising: '76%',
    endFalling: '22%',
    riseAdv: 'dramatically',
    declineAdv: 'steadily',
    increaseAdv: 'dramatically',
    dropAdv: 'sharply'
  }),
  buildTimelineExercise({
    id: 'gb-online-shopping-3country',
    promptId: 'timeline-online-shopping-3country',
    chartNoun: 'line graph',
    subject: 'average monthly online shopping spend in three countries',
    unit: 'US dollars',
    fromYear: '2014',
    midYear: '2018',
    peakYear: '2024',
    toYear: '2024',
    risingNoun: 'spending in Australia',
    thatOfFalling: 'the USA',
    fallingNoun: 'spending in the USA',
    startRising: '$22',
    startFalling: '$60',
    midRising: '$50',
    midFalling: '$54',
    peakRising: '$82',
    endFalling: '$45',
    riseAdv: 'dramatically',
    declineAdv: 'steadily',
    increaseAdv: 'dramatically',
    dropAdv: 'steadily'
  }),
  buildTimelineExercise({
    id: 'gb-social-media-4region',
    promptId: 'timeline-social-media-4region',
    chartNoun: 'line graph',
    subject: 'number of social media users across four regions',
    unit: 'millions of users',
    fromYear: '2010',
    midYear: '2016',
    peakYear: '2024',
    toYear: '2024',
    risingNoun: 'Asia-Pacific usage',
    thatOfFalling: 'Europe',
    fallingNoun: 'Europe',
    startRising: '12 million',
    startFalling: '70 million',
    midRising: '42 million',
    midFalling: '60 million',
    peakRising: '85 million',
    endFalling: '40 million',
    riseAdv: 'dramatically',
    declineAdv: 'steadily',
    increaseAdv: 'dramatically',
    dropAdv: 'sharply'
  }),
  buildTimelineExercise({
    id: 'gb-renewable-energy',
    promptId: 'timeline-renewable-energy',
    chartNoun: 'line graph',
    subject: 'share of electricity generated from different sources',
    unit: 'percentage of electricity generated',
    fromYear: '2014',
    midYear: '2018',
    peakYear: '2024',
    toYear: '2024',
    risingNoun: 'renewable generation',
    thatOfFalling: 'fossil fuels',
    fallingNoun: 'fossil-fuel generation',
    startRising: '22%',
    startFalling: '78%',
    midRising: '35%',
    midFalling: '65%',
    peakRising: '61%',
    endFalling: '39%',
    riseAdv: 'steadily',
    declineAdv: 'steadily',
    increaseAdv: 'dramatically',
    dropAdv: 'sharply'
  }),
  buildTimelineExercise({
    id: 'gb-cinema-streaming',
    promptId: 'timeline-cinema-streaming',
    chartNoun: 'line graph',
    subject: 'consumption of different entertainment formats',
    unit: 'millions',
    fromYear: '2014',
    midYear: '2018',
    peakYear: '2024',
    toYear: '2024',
    risingNoun: 'streaming subscriptions',
    thatOfFalling: 'cinema tickets',
    fallingNoun: 'cinema ticket sales',
    startRising: '18 million',
    startFalling: '62 million',
    midRising: '45 million',
    midFalling: '55 million',
    peakRising: '102 million',
    endFalling: '36 million',
    lowFalling: '28 million',
    lowYear: '2020',
    riseAdv: 'dramatically',
    declineAdv: 'steadily',
    increaseAdv: 'dramatically',
    dropAdv: 'sharply'
  }),
  buildTimelineExercise({
    id: 'gb-public-transport',
    promptId: 'timeline-public-transport',
    chartNoun: 'bar chart',
    subject: 'number of daily trips by different transport modes',
    unit: 'millions of trips',
    fromYear: '2014',
    midYear: '2018',
    peakYear: '2024',
    toYear: '2024',
    risingNoun: 'public-transport trips',
    thatOfFalling: 'private cars',
    fallingNoun: 'private-car trips',
    startRising: '3.2 million',
    startFalling: '6.8 million',
    midRising: '3.8 million',
    midFalling: '5.9 million',
    peakRising: '3.9 million',
    endFalling: '3.1 million',
    riseAdv: 'steadily',
    declineAdv: 'steadily',
    increaseAdv: 'steadily',
    dropAdv: 'dramatically'
  }),
  buildTimelineExercise({
    id: 'gb-coffee-tea-spend',
    promptId: 'timeline-coffee-tea-spend',
    chartNoun: 'table',
    subject: 'average weekly spending on different beverages',
    unit: 'US dollars',
    fromYear: '2014',
    midYear: '2018',
    peakYear: '2024',
    toYear: '2024',
    risingNoun: 'spending on coffee',
    thatOfFalling: 'tea',
    fallingNoun: 'tea',
    startRising: '$8',
    startFalling: '$14',
    midRising: '$15',
    midFalling: '$10',
    peakRising: '$26',
    endFalling: '$6',
    riseAdv: 'dramatically',
    declineAdv: 'steadily',
    increaseAdv: 'dramatically',
    dropAdv: 'steadily'
  }),
  buildTimelineExercise({
    id: 'gb-tourism-arrivals',
    promptId: 'timeline-tourism-arrivals',
    chartNoun: 'line graph',
    subject: 'international tourist arrivals in three countries',
    unit: 'millions of visitors',
    fromYear: '2014',
    midYear: '2018',
    peakYear: '2024',
    toYear: '2024',
    risingNoun: 'arrivals in Vietnam',
    thatOfFalling: 'Japan',
    fallingNoun: 'arrivals in Japan',
    startRising: '8 million',
    startFalling: '32 million',
    midRising: '16 million',
    midFalling: '27 million',
    peakRising: '30 million',
    endFalling: '18 million',
    lowFalling: '8 million',
    lowYear: '2020',
    riseAdv: 'steadily',
    declineAdv: 'steadily',
    increaseAdv: 'dramatically',
    dropAdv: 'sharply'
  }),
  buildTimelineExercise({
    id: 'gb-remote-work-office',
    promptId: 'timeline-remote-work-office',
    chartNoun: 'line graph',
    subject: 'share of employees in different work locations',
    unit: 'percentage of employees',
    fromYear: '2014',
    midYear: '2018',
    peakYear: '2020',
    toYear: '2024',
    risingNoun: 'remote work',
    thatOfFalling: 'office-based work',
    fallingNoun: 'office-based work',
    startRising: '12%',
    startFalling: '88%',
    midRising: '20%',
    midFalling: '80%',
    peakRising: '58%',
    endRising: '45%',
    endFalling: '55%',
    lowFalling: '42%',
    lowYear: '2020',
    riseAdv: 'steadily',
    declineAdv: 'steadily',
    increaseAdv: 'dramatically',
    dropAdv: 'sharply'
  }),
  buildTimelineExercise({
    id: 'gb-book-ebook-sales',
    promptId: 'timeline-book-ebook-sales',
    chartNoun: 'line graph',
    subject: 'sales of different book formats',
    unit: 'millions of units sold',
    fromYear: '2014',
    midYear: '2018',
    peakYear: '2024',
    toYear: '2024',
    risingNoun: 'e-book sales',
    thatOfFalling: 'printed books',
    fallingNoun: 'printed book sales',
    startRising: '18 million',
    startFalling: '54 million',
    midRising: '35 million',
    midFalling: '46 million',
    peakRising: '58 million',
    endFalling: '34 million',
    riseAdv: 'dramatically',
    declineAdv: 'steadily',
    increaseAdv: 'dramatically',
    dropAdv: 'steadily'
  }),
  buildTimelineExercise({
    id: 'gb-city-bike-share',
    promptId: 'timeline-city-bike-share',
    chartNoun: 'bar chart',
    subject: 'number of trips by different transport modes in one city',
    unit: 'millions of trips',
    fromYear: '2014',
    midYear: '2018',
    peakYear: '2024',
    toYear: '2024',
    risingNoun: 'bike-share trips',
    thatOfFalling: 'private-car short trips',
    fallingNoun: 'private-car short trips',
    startRising: '2.1 million',
    startFalling: '12.0 million',
    midRising: '5.2 million',
    midFalling: '10.0 million',
    peakRising: '9.5 million',
    endFalling: '5.8 million',
    riseAdv: 'dramatically',
    declineAdv: 'steadily',
    increaseAdv: 'dramatically',
    dropAdv: 'sharply'
  }),
  buildTimelineExercise({
    id: 'gb-meat-plant-protein',
    promptId: 'timeline-meat-plant-protein',
    chartNoun: 'table',
    subject: 'average weekly spending on different protein sources',
    unit: 'US dollars',
    fromYear: '2014',
    midYear: '2018',
    peakYear: '2024',
    toYear: '2024',
    risingNoun: 'spending on plant-based protein',
    thatOfFalling: 'meat',
    fallingNoun: 'meat',
    startRising: '$2',
    startFalling: '$28',
    midRising: '$7',
    midFalling: '$26',
    peakRising: '$21',
    endFalling: '$23',
    riseAdv: 'dramatically',
    declineAdv: 'slightly',
    increaseAdv: 'dramatically',
    dropAdv: 'slightly'
  }),
  buildTimelineExercise({
    id: 'gb-rail-air-passengers',
    promptId: 'timeline-rail-air-passengers',
    chartNoun: 'line graph',
    subject: 'number of passengers using different transport modes',
    unit: 'millions of passengers',
    fromYear: '2014',
    midYear: '2018',
    peakYear: '2024',
    toYear: '2024',
    risingNoun: 'rail passengers',
    thatOfFalling: 'air travel',
    fallingNoun: 'air passengers',
    startRising: '210 million',
    startFalling: '230 million',
    midRising: '240 million',
    midFalling: '185 million',
    peakRising: '255 million',
    endFalling: '150 million',
    lowFalling: '60 million',
    lowYear: '2020',
    riseAdv: 'steadily',
    declineAdv: 'steadily',
    increaseAdv: 'dramatically',
    dropAdv: 'sharply'
  }),

  buildSnapshotExercise({
    id: 'gb-museum-visitors',
    promptId: 'snapshot-museum-visitors',
    chartNoun: 'bar chart',
    subject: 'the average number of visitors',
    categoryPhrase: 'across five London museums in 2019 and 2023',
    examples: 'the British Museum and the Science Museum',
    unit: 'thousands of visitors per month',
    measureNoun: 'figure',
    visualCount: 1,
    leadingItem: 'the British Museum in 2019',
    contrastItem: 'the Science Museum in 2023',
    timeComparison: true,
    body1Lead: 'the most-visited museum',
    body1Topic: '2019',
    body1Items: [
      { label: 'the British Museum', value: '195,000' },
      { label: 'the Natural History Museum', value: '160,000' },
      { label: 'Tate Modern', value: '130,000' },
      { label: 'the V&A', value: '115,000' },
      { label: 'the Science Museum', value: '105,000' }
    ],
    body2Topic: '2023',
    body2Items: [
      { label: 'the British Museum', value: '180,000' },
      { label: 'the Natural History Museum', value: '145,000' },
      { label: 'Tate Modern', value: '122,000' },
      { label: 'the V&A', value: '108,000' },
      { label: 'the Science Museum', value: '95,000' }
    ]
  }),
  buildSnapshotExercise({
    id: 'gb-uk-thailand-spending',
    promptId: 'snapshot-uk-thailand-spending',
    chartNoun: 'bar chart',
    subject: 'the proportion of household spending',
    categoryPhrase: 'across five different categories in the UK and Thailand',
    examples: 'housing and food',
    unit: 'percentage of total spending',
    visualCount: 1,
    leadingItem: 'housing in the UK',
    contrastItem: 'healthcare in Thailand',
    body1Topic: 'the UK',
    body1Items: [
      { label: 'housing', value: '28%' },
      { label: 'food', value: '18%' },
      { label: 'leisure', value: '15%' },
      { label: 'transport', value: '14%' },
      { label: 'healthcare', value: '12%' }
    ],
    body2Topic: 'Thailand',
    body2Items: [
      { label: 'food', value: '25%' },
      { label: 'housing', value: '22%' },
      { label: 'transport', value: '18%' },
      { label: 'leisure', value: '10%' },
      { label: 'healthcare', value: '8%' }
    ]
  }),
  buildSnapshotExercise({
    id: 'gb-germany-australia-energy',
    promptId: 'snapshot-germany-australia-energy',
    chartNoun: 'pie charts',
    subject: 'how electricity was generated',
    categoryPhrase: 'from five different energy sources in Germany and Australia',
    examples: 'renewables and coal',
    unit: 'percentage of total electricity',
    timeframe: 'in 2020',
    visualCount: 2,
    leadingItem: 'renewable energy',
    contrastItem: 'coal',
    body1Topic: 'Germany',
    body1Items: [
      { label: 'renewable energy', value: '44%' },
      { label: 'coal', value: '25%' },
      { label: 'gas', value: '16%' },
      { label: 'other sources', value: '9%' },
      { label: 'nuclear power', value: '6%' }
    ],
    body2Topic: 'Australia',
    body2Items: [
      { label: 'coal', value: '52%' },
      { label: 'gas', value: '22%' },
      { label: 'renewable energy', value: '21%' },
      { label: 'nuclear power', value: '3%' },
      { label: 'other sources', value: '2%' }
    ]
  }),
  buildSnapshotExercise({
    id: 'gb-household-waste',
    promptId: 'snapshot-household-waste',
    chartNoun: 'pie charts',
    subject: 'how household waste was disposed of',
    categoryPhrase: 'across five different methods in 2008 and 2018',
    examples: 'landfill and recycling',
    unit: 'percentage of household waste',
    visualCount: 2,
    leadingItem: 'landfill',
    contrastItem: 'recycled waste',
    timeComparison: true,
    body1Lead: 'the most popular method of waste disposal',
    body1Topic: '2008',
    body1Items: [
      { label: 'landfill', value: '52%' },
      { label: 'recycled waste', value: '28%' },
      { label: 'incinerated waste', value: '12%' },
      { label: 'composted waste', value: '5%' },
      { label: 'other methods', value: '3%' }
    ],
    body2Topic: '2018',
    body2Items: [
      { label: 'recycled waste', value: '45%' },
      { label: 'landfill', value: '25%' },
      { label: 'composted waste', value: '18%' },
      { label: 'incinerated waste', value: '9%' },
      { label: 'other methods', value: '3%' }
    ]
  }),
  buildSnapshotExercise({
    id: 'gb-phone-brands',
    promptId: 'snapshot-phone-brands',
    chartNoun: 'pie charts',
    subject: 'smartphone market share',
    categoryPhrase: 'across different brands in 2020 and 2024',
    examples: 'Apple and Samsung',
    unit: 'percentage of sales',
    visualCount: 2,
    leadingItem: 'Samsung',
    contrastItem: 'Apple',
    timeComparison: true,
    body1Lead: 'the best-selling brand',
    body1Topic: '2020',
    body1Items: [
      { label: 'Samsung', value: '32%' },
      { label: 'Apple', value: '26%' },
      { label: 'the other brands combined', value: '19%' },
      { label: 'Oppo', value: '12%' },
      { label: 'Xiaomi', value: '11%' }
    ],
    body2Topic: '2024',
    body2Items: [
      { label: 'Apple', value: '34%' },
      { label: 'Samsung', value: '28%' },
      { label: 'the other brands combined', value: '15%' },
      { label: 'Xiaomi', value: '14%' },
      { label: 'Oppo', value: '9%' }
    ]
  }),
  buildSnapshotExercise({
    id: 'gb-student-majors',
    promptId: 'snapshot-student-majors',
    chartNoun: 'bar chart',
    subject: 'university enrolments',
    categoryPhrase: 'across five different majors in Japan and South Korea',
    examples: 'engineering and business',
    unit: 'percentage of students',
    timeframe: 'in 2023',
    visualCount: 1,
    leadingItem: 'engineering in South Korea',
    contrastItem: 'education in South Korea',
    body1Topic: 'South Korea',
    body1Items: [
      { label: 'engineering', value: '30%' },
      { label: 'business', value: '20%' },
      { label: 'medicine', value: '16%' },
      { label: 'arts', value: '12%' },
      { label: 'education', value: '10%' }
    ],
    body2Topic: 'Japan',
    body2Items: [
      { label: 'business', value: '26%' },
      { label: 'arts', value: '22%' },
      { label: 'engineering', value: '18%' },
      { label: 'education', value: '14%' },
      { label: 'medicine', value: '12%' }
    ]
  }),
  buildSnapshotExercise({
    id: 'gb-commute-modes',
    promptId: 'snapshot-commute-modes',
    chartNoun: 'pie charts',
    subject: 'how workers travelled to work',
    categoryPhrase: 'using different methods of transport in Singapore and Bangkok',
    examples: 'public transport and private cars',
    unit: 'percentage of workers',
    timeframe: 'in 2023',
    visualCount: 2,
    leadingItem: 'public transport in Singapore',
    contrastItem: 'private cars in Bangkok',
    contrastBe: 'were',
    body1Topic: 'Singapore',
    body1Items: [
      { label: 'public transport', value: '58%' },
      { label: 'private cars', value: '22%', be: 'were' },
      { label: 'walking or cycling', value: '12%' },
      { label: 'taxis', value: '5%' },
      { label: 'other methods', value: '3%' }
    ],
    body2Topic: 'Bangkok',
    body2Items: [
      { label: 'private cars', value: '46%' },
      { label: 'public transport', value: '28%' },
      { label: 'motorbikes', value: '18%' },
      { label: 'walking or cycling', value: '5%' },
      { label: 'other methods', value: '3%' }
    ]
  }),
  buildSnapshotExercise({
    id: 'gb-hotel-ratings',
    promptId: 'snapshot-hotel-ratings',
    chartNoun: 'table',
    subject: 'guest ratings for five hotels',
    categoryPhrase: 'across four different service categories',
    examples: 'cleanliness and location',
    unit: 'a score out of 10',
    timeframe: 'in 2024',
    visualCount: 1,
    leadingItem: 'Hotel Orchid for location',
    contrastItem: 'Budget Inn for cleanliness',
    measureNoun: 'score',
    body1Topic: 'the location scores',
    body1Lead: 'the highest-rated hotel',
    body1Items: [
      { label: 'Hotel Orchid', value: '9.2' },
      { label: 'Sea Breeze', value: '8.5' },
      { label: 'Grand Plaza', value: '8.2' },
      { label: 'City Lodge', value: '7.8' },
      { label: 'Budget Inn', value: '6.8' }
    ],
    body2Topic: 'the cleanliness scores',
    body2Items: [
      { label: 'Sea Breeze', value: '8.9' },
      { label: 'Grand Plaza', value: '8.6' },
      { label: 'Hotel Orchid', value: '8.1' },
      { label: 'City Lodge', value: '7.5' },
      { label: 'Budget Inn', value: '6.4' }
    ]
  }),
  buildSnapshotExercise({
    id: 'gb-water-use',
    promptId: 'snapshot-water-use',
    chartNoun: 'bar chart',
    subject: 'water use',
    categoryPhrase: 'across four different sectors in Australia and Canada',
    examples: 'agriculture and industry',
    unit: 'percentage of total water use',
    timeframe: 'in 2022',
    visualCount: 1,
    leadingItem: 'agriculture in Australia',
    contrastItem: 'energy use in Australia',
    body1Topic: 'Australia',
    body1Items: [
      { label: 'agriculture', value: '65%' },
      { label: 'industry', value: '18%' },
      { label: 'households', value: '12%' },
      { label: 'energy production', value: '5%' },
      { label: 'services', value: '4%' }
    ],
    body2Topic: 'Canada',
    body2Items: [
      { label: 'industry', value: '42%' },
      { label: 'agriculture', value: '28%' },
      { label: 'households', value: '18%' },
      { label: 'energy production', value: '12%' },
      { label: 'services', value: '8%' }
    ]
  }),

  buildProcessExercise({
    id: 'gb-cheese-making',
    promptId: 'process-cheese-making',
    subject: 'cheese is made from milk',
    stageCount: 'seven',
    firstStage: 'pasteurisation',
    lastStage: 'packaging',
    earlyPassive: 'fresh milk is pasteurised and starter cultures are added',
    midPassive: 'the milk is left to curdle and the curds are cut',
    latePassive: 'the cheese is pressed, aged and then packaged'
  }),
  buildProcessExercise({
    id: 'gb-brick-production',
    promptId: 'process-brick-production',
    subject: 'bricks are produced',
    stageCount: 'seven',
    firstStage: 'digging clay',
    lastStage: 'delivery',
    earlyPassive: 'clay is dug and crushed with sand and water',
    midPassive: 'the mixture is moulded into bricks and dried',
    latePassive: 'the bricks are fired in a kiln, cooled and delivered'
  }),
  buildProcessExercise({
    id: 'gb-bottled-water',
    promptId: 'process-bottled-water',
    subject: 'bottled drinking water is produced',
    stageCount: 'six',
    firstStage: 'collection',
    lastStage: 'storage',
    earlyPassive: 'fresh water is collected and filtered',
    midPassive: 'minerals are balanced and bottles are filled',
    latePassive: 'the bottles are sealed, labelled and stored'
  }),
  buildProcessExercise({
    id: 'gb-paper-recycling',
    promptId: 'process-paper-recycling',
    subject: 'waste paper is recycled',
    stageCount: 'seven',
    firstStage: 'collection',
    lastStage: 'rolling new paper',
    earlyPassive: 'used paper is collected and sorted',
    midPassive: 'the paper is pulped, screened and de-inked',
    latePassive: 'the pulp is bleached and rolled into new sheets'
  }),
  buildProcessExercise({
    id: 'gb-chocolate',
    promptId: 'process-chocolate',
    subject: 'chocolate is produced from cocoa beans',
    stageCount: 'eight',
    firstStage: 'harvesting',
    lastStage: 'moulding',
    earlyPassive: 'cocoa pods are harvested and the beans are fermented',
    midPassive: 'the beans are dried, roasted and cracked',
    latePassive: 'the nibs are ground, mixed with sugar and moulded into bars'
  }),

  buildSnapshotExercise({
    id: 'gb-food-delivery-apps',
    promptId: 'snapshot-food-delivery-apps',
    chartNoun: 'pie charts',
    subject: 'food-delivery app market share',
    categoryPhrase: 'across different providers in 2020 and 2024',
    examples: 'GrabFood and Line Man',
    unit: 'percentage of orders',
    visualCount: 2,
    leadingItem: 'Foodpanda',
    contrastItem: 'GrabFood',
    timeComparison: true,
    body1Lead: 'the most used provider',
    body1Topic: '2020',
    body1Items: [
      { label: 'Foodpanda', value: '34%' },
      { label: 'GrabFood', value: '29%' },
      { label: 'Line Man', value: '15%' },
      { label: 'the other providers combined', value: '14%' },
      { label: 'Robinhood', value: '8%' }
    ],
    body2Topic: '2024',
    body2Items: [
      { label: 'GrabFood', value: '38%' },
      { label: 'Foodpanda', value: '27%' },
      { label: 'Line Man', value: '18%' },
      { label: 'Robinhood', value: '9%' },
      { label: 'the other providers combined', value: '8%' }
    ]
  }),
  buildSnapshotExercise({
    id: 'gb-device-ownership',
    promptId: 'snapshot-device-ownership',
    chartNoun: 'bar chart',
    subject: 'device ownership among adults',
    categoryPhrase: 'across four different device types in Sweden and Italy',
    examples: 'smartphones and laptops',
    unit: 'percentage of adults',
    timeframe: 'in 2023',
    visualCount: 1,
    leadingItem: 'smartphones in Sweden',
    leadingBe: 'were',
    contrastItem: 'smartwatches in Italy',
    contrastBe: 'were',
    body1Topic: 'Sweden',
    body1Items: [
      { label: 'smartphones', value: '92%', be: 'were' },
      { label: 'laptops', value: '78%' },
      { label: 'tablets', value: '54%' },
      { label: 'smart speakers', value: '36%' },
      { label: 'smartwatches', value: '28%' }
    ],
    body2Topic: 'Italy',
    body2Items: [
      { label: 'smartphones', value: '88%' },
      { label: 'laptops', value: '62%' },
      { label: 'tablets', value: '41%' },
      { label: 'smart speakers', value: '24%' },
      { label: 'smartwatches', value: '18%' }
    ]
  }),
  buildSnapshotExercise({
    id: 'gb-energy-bills',
    promptId: 'snapshot-energy-bills',
    chartNoun: 'pie charts',
    subject: 'the household energy bill breakdown',
    categoryPhrase: 'across different types of use in France and Poland',
    examples: 'electricity and heating',
    unit: 'percentage of the bill',
    timeframe: 'in 2022',
    visualCount: 2,
    leadingItem: 'electricity in France',
    contrastItem: 'heating in Poland',
    body1Topic: 'France',
    body1Items: [
      { label: 'electricity', value: '42%' },
      { label: 'heating', value: '34%' },
      { label: 'cooking', value: '14%' },
      { label: 'hot water', value: '7%' },
      { label: 'other uses', value: '3%' }
    ],
    body2Topic: 'Poland',
    body2Items: [
      { label: 'heating', value: '48%' },
      { label: 'electricity', value: '30%' },
      { label: 'cooking', value: '12%' },
      { label: 'hot water', value: '7%' },
      { label: 'other uses', value: '3%' }
    ]
  }),
  buildSnapshotExercise({
    id: 'gb-airport-scores',
    promptId: 'snapshot-airport-scores',
    chartNoun: 'table',
    subject: 'passenger ratings for five airports',
    categoryPhrase: 'across four different service categories',
    examples: 'cleanliness and security',
    unit: 'a score out of 10',
    timeframe: 'in 2024',
    visualCount: 1,
    leadingItem: 'Changi for cleanliness',
    contrastItem: 'City West for security',
    measureNoun: 'score',
    body1Topic: 'the cleanliness scores',
    body1Lead: 'the highest-rated airport',
    body1Items: [
      { label: 'Changi', value: '9.4' },
      { label: 'Incheon', value: '9.0' },
      { label: 'Heathrow', value: '8.2' },
      { label: 'Suvarnabhumi', value: '8.0' },
      { label: 'City West', value: '7.1' }
    ],
    body2Topic: 'the security scores',
    body2Items: [
      { label: 'Changi', value: '8.8' },
      { label: 'Incheon', value: '8.5' },
      { label: 'Suvarnabhumi', value: '7.6' },
      { label: 'Heathrow', value: '7.4' },
      { label: 'City West', value: '6.2' }
    ]
  }),
  buildSnapshotExercise({
    id: 'gb-study-hours',
    promptId: 'snapshot-study-hours',
    chartNoun: 'bar chart',
    subject: 'weekly study hours',
    categoryPhrase: 'across four different subjects in Finland and Mexico',
    examples: 'mathematics and languages',
    unit: 'hours per week',
    timeframe: 'in 2023',
    visualCount: 1,
    leadingItem: 'mathematics in Mexico',
    contrastItem: 'arts in Mexico',
    measureNoun: 'figure',
    body1Topic: 'Mexico',
    body1Items: [
      { label: 'mathematics', value: '6.5 hours' },
      { label: 'science', value: '5 hours' },
      { label: 'languages', value: '3.5 hours' },
      { label: 'history', value: '3 hours' },
      { label: 'arts', value: '2 hours' }
    ],
    body2Topic: 'Finland',
    body2Items: [
      { label: 'languages', value: '5.5 hours' },
      { label: 'mathematics', value: '4.5 hours' },
      { label: 'science', value: '4 hours' },
      { label: 'history', value: '3.5 hours' },
      { label: 'arts', value: '3 hours' }
    ]
  }),

  buildProcessExercise({
    id: 'gb-olive-oil',
    promptId: 'process-olive-oil',
    subject: 'olive oil is produced',
    stageCount: 'six',
    firstStage: 'harvesting',
    lastStage: 'bottling',
    earlyPassive: 'olives are harvested and washed',
    midPassive: 'the olives are crushed and pressed',
    latePassive: 'the oil is separated, bottled and labelled'
  }),
  buildProcessExercise({
    id: 'gb-tea-production',
    promptId: 'process-tea-production',
    subject: 'black tea is produced',
    stageCount: 'seven',
    firstStage: 'plucking',
    lastStage: 'packing',
    earlyPassive: 'tea leaves are plucked and withered',
    midPassive: 'the leaves are rolled and oxidised',
    latePassive: 'the tea is dried, sorted and packed'
  }),
  buildProcessExercise({
    id: 'gb-glass-recycling',
    promptId: 'process-glass-recycling',
    subject: 'glass bottles are recycled',
    stageCount: 'seven',
    firstStage: 'collection',
    lastStage: 'cooling new bottles',
    earlyPassive: 'used bottles are collected, sorted and washed',
    midPassive: 'the glass is crushed and melted',
    latePassive: 'new bottles are shaped, cooled and checked'
  }),
  buildProcessExercise({
    id: 'gb-sugar-cane',
    promptId: 'process-sugar-cane',
    subject: 'sugar is produced from sugar cane',
    stageCount: 'eight',
    firstStage: 'harvesting',
    lastStage: 'packaging',
    earlyPassive: 'sugar cane is harvested and crushed',
    midPassive: 'the juice is filtered, boiled and crystallised',
    latePassive: 'the sugar is spun, dried and packaged'
  }),
  buildProcessExercise({
    id: 'gb-solar-panel',
    promptId: 'process-solar-panel',
    subject: 'solar panels are manufactured',
    stageCount: 'six',
    firstStage: 'purifying silicon',
    lastStage: 'testing',
    earlyPassive: 'silicon is purified and cut into wafers',
    midPassive: 'the wafers are treated and wired into cells',
    latePassive: 'cells are assembled into panels, tested and packaged'
  })
]
