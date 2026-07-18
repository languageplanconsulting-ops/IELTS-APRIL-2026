/**
 * Compact guided builders for newly added Task 1 prompts.
 * Pattern-matched to existing teacher essay structure (intro → overview → body1 → body2).
 */
import type { WgbExercise, WgbFocus, WgbSegment, WgbStep } from './writingGuidedBuilder'

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
  subject: string
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
  const risingEnd = spec.endRising ?? spec.peakRising
  const fallingLow = spec.lowFalling ?? spec.endFalling
  const fallingLowYear = spec.lowYear ?? spec.toYear
  const fallingFinish =
    fallingLowYear === spec.toYear
      ? ' and ending the period at its lowest recorded level'
      : ` and later recovering to ${spec.endFalling} in ${spec.toYear}, remaining below its starting figure`
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
          t(` ${spec.subject} between ${spec.fromYear} `),
          sel(`${p}-i2`, ['and', 'until', 'with'], 'and', 'word-choice', 'between X and Y'),
          t(` ${spec.toYear} across the categories included in the data.`)
        ]
      },
      {
        id: `${p}-overview`,
        role: 'overview',
        labelTh: ROLE_LABEL_TH.overview,
        hintTh: HINT_CONJUGATE,
        segments: [
          t(''),
          sel(`${p}-o1`, ['While', 'Because', 'So'], 'While', 'transition', 'While เปิด dependent clause เพื่อเปรียบเทียบสองทิศทาง'),
          t(` ${spec.risingNoun} `),
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
          t(`, ${spec.fallingNoun} `),
          sel(
            `${p}-o3`,
            [
              'showed a downward trend',
              'experienced an upward trend',
              'fluctuated',
              'remained unchanged over the given period'
            ],
            'showed a downward trend',
            'trend-phrase',
            'ขาลงใช้ showed a downward trend'
          ),
          t(', highlighting the clear contrast between their directions.')
        ]
      },
      {
        id: `${p}-body1`,
        role: 'body1',
        labelTh: ROLE_LABEL_TH.body1,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel(`${p}-b2`, ['Whereas', 'Because', 'So'], 'Whereas', 'transition', 'complex #1: Whereas เปิด dependent clause เพื่อเปรียบต่าง'),
          t(` ${spec.risingNoun} `),
          typ(`${p}-b1`, 'stand', ['stood'], 'verb-tense', 'past simple: stood'),
          t(` at ${spec.startRising} in ${spec.fromYear}, that of ${spec.thatOfFalling} `),
          typ(`${p}-b3`, 'begin', ['began'], 'verb-tense', 'past simple: began'),
          t(` at ${spec.startFalling}, revealing a substantial initial difference between the two categories. `),
          t(`In ${spec.midYear}, ${spec.risingNoun} `),
          typ(`${p}-b5`, 'rise', ['rose'], 'verb-tense', 'past simple: rose'),
          t(' '),
          sel(
            `${p}-b6`,
            [spec.riseAdv, 'rarely', 'barely'],
            spec.riseAdv,
            'degree-adverb',
            `ใช้ ${spec.riseAdv} บอกระดับการเพิ่มขึ้น`
          ),
          t(` to ${spec.midRising}, contrasting with that of ${spec.thatOfFalling}, `),
          sel(`${p}-b7`, ['which', 'who', 'where'], 'which', 'referencing', 'which อ้างถึง figure เอกพจน์'),
          t(' '),
          typ(`${p}-b8`, 'decline', ['declined'], 'verb-tense', 'past simple: declined'),
          t(' '),
          sel(
            `${p}-b9`,
            [spec.declineAdv, 'happily', 'rarely'],
            spec.declineAdv,
            'degree-adverb',
            `ใช้ ${spec.declineAdv} บอกระดับการลดลง`
          ),
          t(` to ${spec.midFalling}, narrowing the gap between the figures considerably by that point.`)
        ]
      },
      {
        id: `${p}-body2`,
        role: 'body2',
        labelTh: ROLE_LABEL_TH.body2,
        hintTh: HINT_CONJUGATE,
        segments: [
          t(`Between ${spec.midYear} and ${spec.toYear}, ${spec.risingNoun} `),
          typ(`${p}-c1`, 'increase', ['increased'], 'verb-tense', 'past simple: increased'),
          t(' '),
          sel(
            `${p}-c2`,
            [spec.increaseAdv, 'rarely', 'barely'],
            spec.increaseAdv,
            'degree-adverb',
            `ใช้ ${spec.increaseAdv} บอกระดับ`
          ),
          t(', '),
          typ(`${p}-c3`, 'reach', ['reaching'], 'ving-clause', 'V-ing: reaching a peak'),
          t(` a peak at ${spec.peakRising} in ${spec.peakYear} and finishing at ${risingEnd} in ${spec.toYear}, recording its strongest result during these years. `),
          sel(
            `${p}-c4`,
            ['On the other hand', 'Therefore', 'For example'],
            'On the other hand',
            'transition',
            'On the other hand เปิดประโยค complex ที่ 2'
          ),
          t(`, over the same interval, this figure for ${spec.fallingNoun} `),
          typ(`${p}-c5`, 'drop', ['dropped'], 'verb-tense', 'past simple: dropped'),
          t(' '),
          sel(
            `${p}-c6`,
            [spec.dropAdv, 'happily', 'rarely'],
            spec.dropAdv,
            'degree-adverb',
            `ใช้ ${spec.dropAdv} บอกระดับ`
          ),
          t(', '),
          typ(`${p}-c7`, 'reach', ['reaching'], 'ving-clause', 'V-ing: reaching the lowest point'),
          t(` its lowest point at ${fallingLow} in ${fallingLowYear}${fallingFinish}, confirming the marked contrast between the two categories.`)
        ]
      }
    ]
  }
}

type SnapshotSpec = {
  id: string
  promptId: string
  chartNoun: 'pie chart' | 'pie charts' | 'bar chart' | 'table'
  subject: string
  visualCount: 1 | 2
  leadingItem: string
  leadingShare: string
  contrastItem: string
  contrastShare: string
  contrastLinker: 'whereas' | 'while'
  body1Topic?: string
  body2Topic?: string
  leadingBe?: 'was' | 'were'
  contrastBe?: 'was' | 'were'
  extraBodyDetail?: string
}

function buildSnapshotExercise(spec: SnapshotSpec): WgbExercise {
  const p = spec.id.replace(/^gb-/, 's')
  const pluralChart = spec.chartNoun.endsWith('s')
  const pieChart = spec.chartNoun.startsWith('pie chart')
  const sentenceCase = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)
  const body1Opening = pieChart
    ? `Starting with ${spec.body1Topic}, ${spec.leadingItem}`
    : sentenceCase(spec.leadingItem)
  const body2Segments: WgbSegment[] = pieChart
    ? [
        t(`In terms of ${spec.body2Topic}, ${spec.contrastItem} `),
        typ(`${p}-c2`, 'represent', ['represented'], 'verb-tense', 'past simple'),
        t(` ${spec.contrastShare}, `),
        sel(
          `${p}-c3`,
          spec.visualCount === 2
            ? ['the largest share', 'the smallest share', 'an equal share']
            : ['the smallest share', 'the largest share', 'an equal share'],
          spec.visualCount === 2 ? 'the largest share' : 'the smallest share',
          'word-choice',
          spec.visualCount === 2
            ? 'เลือก largest เพราะเป็นหมวดที่มากที่สุดของ pie chart วงที่สอง'
            : 'เลือก smallest เพราะเป็นหมวดที่น้อยที่สุดของ pie chart วงเดียว'
        ),
        t(` in that part of the data. The remaining categories occupied the middle positions, which kept them below the leading category but above the least significant result. Although their individual values varied, the ranking clearly separated the largest and smallest portions of the chart.${spec.extraBodyDetail ? ` ${spec.extraBodyDetail}` : ''}`)
      ]
    : [
        sel(`${p}-c1`, ['Meanwhile', 'Because', 'Unless'], 'Meanwhile', 'transition', 'Meanwhile = ในขณะเดียวกัน (ใช้ใน snapshot body ได้ตามบริบทเปรียบเทียบหมวดอื่น)'),
        t(', the remaining categories in the chart '),
        typ(`${p}-c2`, 'make', ['made'], 'verb-tense', 'past simple'),
        t(' up smaller '),
        sel(`${p}-c3`, ['shares', 'shapes', 'ships'], 'shares', 'paraphrase', 'shares = ส่วนแบ่ง'),
        t(', '),
        typ(`${p}-c4`, 'follow', ['following'], 'ving-clause', 'V-ing clause'),
        t(` well behind the leading group and occupying the middle or lower positions overall. Although their individual values varied, none matched the result recorded for the largest category, producing an uneven distribution across all of the categories. The smaller figure remained one of the least significant results displayed, reinforcing the contrast with the leading category.${spec.extraBodyDetail ? ` ${spec.extraBodyDetail}` : ''}`)
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
          sel(
            `${p}-i1`,
            pluralChart ? ['compare', 'complain', 'consider'] : ['compares', 'complains', 'considers'],
            pluralChart ? 'compare' : 'compares',
            'paraphrase',
            `The ${spec.chartNoun} ใช้ ${pluralChart ? 'compare' : 'compares'} ให้ตรงกับประธาน`
          ),
          t(` ${spec.subject}, presenting the main figures side by side and allowing the most important similarities and differences to be identified.`)
        ]
      },
      {
        id: `${p}-overview`,
        role: 'overview',
        labelTh: ROLE_LABEL_TH.overview,
        hintTh: HINT_CONJUGATE,
        segments: [
          sel(
            `${p}-o1`,
            ['While', 'Because', 'So'],
            'While',
            'transition',
            spec.visualCount === 2
              ? 'ใช้ While เชื่อมหมวดที่มากที่สุดของภาพทั้งสอง'
              : 'ใช้ While เชื่อมหมวดที่มากที่สุดกับหมวดที่น้อยที่สุด'
          ),
          t(
            spec.visualCount === 2
              ? ` ${spec.leadingItem} ${spec.leadingBe ?? 'was'} the largest in the first chart, ${spec.contrastItem} ${spec.contrastBe ?? 'was'} the largest in the second chart.`
              : ` ${spec.leadingItem} ${spec.leadingBe ?? 'was'} the largest, ${spec.contrastItem} ${spec.contrastBe ?? 'was'} the smallest in share.`
          )
        ]
      },
      {
        id: `${p}-body1`,
        role: 'body1',
        labelTh: ROLE_LABEL_TH.body1,
        hintTh: HINT_CONJUGATE,
        segments: [
          t(`${body1Opening} `),
          typ(`${p}-b1`, 'represent', ['represented'], 'verb-tense', 'past simple'),
          t(` ${spec.leadingShare}, the `),
          sel(`${p}-b2`, ['highest', 'hottest', 'heaviest'], 'highest', 'word-choice', 'highest figure'),
          t(' figure shown, placing it ahead of every other category included in the comparison and making it the most prominent result. '),
          sel(`${p}-b3`, ['In contrast', 'Therefore', 'For example'], 'In contrast', 'transition', 'In contrast = เทียบต่าง'),
          t(`, ${spec.contrastItem} `),
          typ(`${p}-b4`, 'stand', ['stood'], 'verb-tense', 'past simple'),
          t(` at ${spec.contrastShare}, which illustrates the considerable gap between these two parts of the data.`)
        ]
      },
      {
        id: `${p}-body2`,
        role: 'body2',
        labelTh: ROLE_LABEL_TH.body2,
        hintTh: HINT_CONJUGATE,
        segments: body2Segments
      }
    ]
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
          t('Overall, the process '),
          typ(`${p}-o1`, 'consist', ['consists'], 'verb-tense', 'present simple เอกพจน์'),
          t(` of ${spec.stageCount} stages, `),
          typ(`${p}-o2`, 'begin', ['beginning'], 'ving-clause', 'V-ing'),
          t(` with ${spec.firstStage} and `),
          typ(`${p}-o3`, 'end', ['ending'], 'ving-clause', 'V-ing'),
          t(` with ${spec.lastStage}; therefore, it is a linear procedure in which each phase prepares the material for the next one.`)
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
    subject: 'the proportion of students using online learning platforms and in-person classes',
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
    subject: 'the number of petrol-powered and electric cars sold',
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
    subject: 'the number of people working from home and those commuting to an office',
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
    subject: 'spending on public libraries and digital reading services',
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
    subject: 'household ownership of smart TVs, laptops and desktops',
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
    subject: 'average monthly online shopping spend in the UK, the USA and Australia',
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
    subject: 'social media users in four regions',
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
    subject: 'the share of electricity from renewables and fossil fuels',
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
    subject: 'cinema ticket sales and streaming subscriptions',
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
    subject: 'average daily public-transport and private-car trips in one city',
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
    subject: 'average weekly spending on coffee and tea',
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
    subject: 'international tourist arrivals in Thailand, Japan and Vietnam',
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
    subject: 'the share of office-based and remote employees',
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
    subject: 'sales of printed books and e-books',
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
    subject: 'bike-share and short private-car trips in one city',
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
    subject: 'weekly spending on meat and plant-based protein',
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
    subject: 'the number of rail and air passengers',
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
    id: 'gb-phone-brands',
    promptId: 'snapshot-phone-brands',
    chartNoun: 'pie chart',
    subject: 'smartphone market share by brand in 2024',
    visualCount: 1,
    leadingItem: 'Apple',
    leadingShare: '34%',
    contrastItem: 'Oppo',
    contrastShare: '9%',
    contrastLinker: 'whereas',
    body1Topic: 'the leading brand',
    body2Topic: 'the remaining brands',
    extraBodyDetail: 'Together, the middle-ranking brands occupied the remaining market share, creating a clear gap between Apple and Oppo overall.'
  }),
  buildSnapshotExercise({
    id: 'gb-student-majors',
    promptId: 'snapshot-student-majors',
    chartNoun: 'bar chart',
    subject: 'university enrolments by major in Japan and South Korea',
    visualCount: 1,
    leadingItem: 'engineering in South Korea',
    leadingShare: '30%',
    contrastItem: 'education in South Korea',
    contrastShare: '10%',
    contrastLinker: 'while'
  }),
  buildSnapshotExercise({
    id: 'gb-commute-modes',
    promptId: 'snapshot-commute-modes',
    chartNoun: 'pie charts',
    subject: 'how workers in Singapore and Bangkok travelled to work',
    visualCount: 2,
    leadingItem: 'public transport in Singapore',
    leadingShare: '58%',
    contrastItem: 'private cars in Bangkok',
    contrastShare: '46%',
    contrastLinker: 'whereas',
    body1Topic: 'Singapore',
    body2Topic: 'Bangkok',
    contrastBe: 'were'
  }),
  buildSnapshotExercise({
    id: 'gb-hotel-ratings',
    promptId: 'snapshot-hotel-ratings',
    chartNoun: 'table',
    subject: 'guest ratings for five hotels across four categories',
    visualCount: 1,
    leadingItem: 'Hotel Orchid for location',
    leadingShare: '9.2',
    contrastItem: 'Budget Inn for cleanliness',
    contrastShare: '6.4',
    contrastLinker: 'while'
  }),
  buildSnapshotExercise({
    id: 'gb-water-use',
    promptId: 'snapshot-water-use',
    chartNoun: 'bar chart',
    subject: 'water use by sector in Australia and Canada',
    visualCount: 1,
    leadingItem: 'agriculture in Australia',
    leadingShare: '65%',
    contrastItem: 'energy use in Australia',
    contrastShare: '5%',
    contrastLinker: 'whereas'
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
    chartNoun: 'pie chart',
    subject: 'food-delivery app market share in 2024',
    visualCount: 1,
    leadingItem: 'GrabFood',
    leadingShare: '38%',
    contrastItem: 'smaller apps',
    contrastShare: '17%',
    contrastLinker: 'whereas',
    body1Topic: 'the leading app',
    body2Topic: 'the remaining apps',
    contrastBe: 'were',
    extraBodyDetail: 'The middle-ranked services shared the remainder, creating a clear separation between GrabFood and the smallest providers overall.'
  }),
  buildSnapshotExercise({
    id: 'gb-device-ownership',
    promptId: 'snapshot-device-ownership',
    chartNoun: 'bar chart',
    subject: 'device ownership among adults in Sweden and Italy',
    visualCount: 1,
    leadingItem: 'smartphones in Sweden',
    leadingShare: '92%',
    contrastItem: 'smartwatches in Italy',
    contrastShare: '18%',
    contrastLinker: 'while',
    leadingBe: 'were',
    contrastBe: 'were',
    extraBodyDetail: 'This pattern remained clear.'
  }),
  buildSnapshotExercise({
    id: 'gb-energy-bills',
    promptId: 'snapshot-energy-bills',
    chartNoun: 'pie charts',
    subject: 'household energy bill breakdown in France and Poland',
    visualCount: 2,
    leadingItem: 'electricity in France',
    leadingShare: '42%',
    contrastItem: 'heating in Poland',
    contrastShare: '48%',
    contrastLinker: 'whereas',
    body1Topic: 'France',
    body2Topic: 'Poland',
    extraBodyDetail: 'This distinction remained clear.'
  }),
  buildSnapshotExercise({
    id: 'gb-airport-scores',
    promptId: 'snapshot-airport-scores',
    chartNoun: 'table',
    subject: 'passenger ratings for five airports',
    visualCount: 1,
    leadingItem: 'Changi for cleanliness',
    leadingShare: '9.4',
    contrastItem: 'City West for security',
    contrastShare: '6.2',
    contrastLinker: 'while',
    extraBodyDetail: 'This ranking remained clear.'
  }),
  buildSnapshotExercise({
    id: 'gb-study-hours',
    promptId: 'snapshot-study-hours',
    chartNoun: 'bar chart',
    subject: 'weekly study hours by subject in Finland and Mexico',
    visualCount: 1,
    leadingItem: 'mathematics in Mexico',
    leadingShare: '6.5 hours',
    contrastItem: 'arts in Mexico',
    contrastShare: '2 hours',
    contrastLinker: 'whereas'
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
