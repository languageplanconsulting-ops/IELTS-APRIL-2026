export type WritingTimelineChartType = 'line-graph' | 'bar-chart' | 'table'

export type WritingTimelinePracticePrompt = {
  id: string
  number: number
  chartType: WritingTimelineChartType
  chartTypeLabel: string
  title: string
  chartCaption: string
  subjectPhrase: string
  unit: string
  yAxisLabel: string
  valueLabel: string
  years: number[]
  values: number[]
  mainTrend: string
}

export const getIeltsTask1ChartNoun = (chartType: WritingTimelineChartType) => {
  if (chartType === 'line-graph') return 'line graph'
  if (chartType === 'bar-chart') return 'bar chart'
  return 'table'
}

export const getIeltsTask1OpeningLine = (prompt: WritingTimelinePracticePrompt) => {
  const chartNoun = getIeltsTask1ChartNoun(prompt.chartType)
  const startYear = prompt.years[0]
  const endYear = prompt.years[prompt.years.length - 1]
  return `The ${chartNoun} below shows ${prompt.subjectPhrase} between ${startYear} and ${endYear}.`
}

export const IELTS_TASK1_TIME_NOTE = 'You should spend about 20 minutes on this task.'
export const IELTS_TASK1_SUMMARY_INSTRUCTION =
  'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.'
export const IELTS_TASK1_WORD_LIMIT = 'Write at least 150 words.'

export type WritingGuideChipGroup = {
  id: string
  label: string
  hint?: string
  chips: string[]
}

export type WritingGuideStructure = {
  id: string
  label: string
  template: string
  note?: string
}

export type WritingTask1Section = {
  id: string
  title: string
  subtitle: string
  accent: 'timeline' | 'chart' | 'map' | 'process' | 'all'
  chipGroups?: WritingGuideChipGroup[]
  structures?: WritingGuideStructure[]
  practicePrompts?: WritingTimelinePracticePrompt[]
}

export const WRITING_TIMELINE_YEARS = [2014, 2016, 2018, 2020, 2022, 2024] as const

export const WRITING_TIMELINE_PRACTICE_PROMPTS: WritingTimelinePracticePrompt[] = [
  {
    id: 'timeline-online-learning',
    number: 1,
    chartType: 'line-graph',
    chartTypeLabel: 'Line Graph',
    title: 'Percentage of students using online learning platforms',
    chartCaption: 'Online learning platform use among students',
    subjectPhrase: 'the percentage of students who used online learning platforms',
    unit: '% of students',
    yAxisLabel: 'Percentage of students (%)',
    valueLabel: 'Percentage',
    years: [...WRITING_TIMELINE_YEARS],
    values: [18, 25, 34, 58, 67, 74],
    mainTrend: 'Online learning increased sharply, especially after 2020.'
  },
  {
    id: 'timeline-food-delivery',
    number: 2,
    chartType: 'line-graph',
    chartTypeLabel: 'Line Graph',
    title: 'Average monthly spending on food delivery',
    chartCaption: 'Average monthly food delivery spending per person',
    subjectPhrase: 'the average amount of money spent per person on food delivery each month',
    unit: 'US dollars per person',
    yAxisLabel: 'Average spending (US dollars)',
    valueLabel: 'Spending',
    years: [...WRITING_TIMELINE_YEARS],
    values: [22, 30, 45, 78, 96, 110],
    mainTrend: 'Food delivery spending rose steadily and more than quadrupled.'
  },
  {
    id: 'timeline-work-from-home',
    number: 3,
    chartType: 'bar-chart',
    chartTypeLabel: 'Bar Chart',
    title: 'Number of people working from home',
    chartCaption: 'Number of people working from home',
    subjectPhrase: 'the number of people working from home',
    unit: 'millions',
    yAxisLabel: 'Number of workers (millions)',
    valueLabel: 'Workers',
    years: [...WRITING_TIMELINE_YEARS],
    values: [4, 5, 7, 21, 18, 16],
    mainTrend: 'The figure peaked in 2020, then fell slightly but remained much higher than before.'
  },
  {
    id: 'timeline-electric-bicycles',
    number: 4,
    chartType: 'bar-chart',
    chartTypeLabel: 'Bar Chart',
    title: 'Sales of electric bicycles',
    chartCaption: 'Electric bicycle sales',
    subjectPhrase: 'the number of electric bicycles sold',
    unit: 'thousand units',
    yAxisLabel: 'Sales (thousand units)',
    valueLabel: 'Sales',
    years: [...WRITING_TIMELINE_YEARS],
    values: [35, 48, 72, 130, 190, 240],
    mainTrend: 'Sales increased continuously over the period.'
  },
  {
    id: 'timeline-smart-tvs',
    number: 5,
    chartType: 'table',
    chartTypeLabel: 'Table',
    title: 'Percentage of households with smart TVs',
    chartCaption: 'Households with smart TVs',
    subjectPhrase: 'the percentage of households that owned a smart TV',
    unit: '% of households',
    yAxisLabel: 'Percentage of households (%)',
    valueLabel: 'Percentage',
    years: [...WRITING_TIMELINE_YEARS],
    values: [12, 24, 39, 55, 68, 76],
    mainTrend: 'Smart TV ownership rose rapidly and became common by 2024.'
  }
]

export type WritingTask2Type = {
  id: string
  title: string
  subtitle: string
  focus: string[]
}

export const WRITING_TASK1_SECTIONS: WritingTask1Section[] = [
  {
    id: 'timeline',
    title: 'Timeline / Line Graph',
    subtitle: 'Trend language · 5 practice prompts (2 line graphs, 2 bar charts, 1 table)',
    accent: 'timeline',
    practicePrompts: WRITING_TIMELINE_PRACTICE_PROMPTS,
    chipGroups: [
      {
        id: 'up',
        label: 'Increase',
        chips: ['increase', 'grow', 'rise', 'skyrocket']
      },
      {
        id: 'down',
        label: 'Decrease',
        chips: ['decrease', 'decline', 'drop']
      },
      {
        id: 'compare',
        label: 'Comparison',
        chips: ['overtake', 'surpass']
      },
      {
        id: 'degree',
        label: 'Degree / intensity',
        chips: ['considerably', 'drastically', 'dramatically', 'slightly', 'mildly', 'moderately']
      },
      {
        id: 'extremes',
        label: 'Peaks & lows',
        chips: ['peak', 'reach a peak', 'reach the lowest point']
      }
    ]
  },
  {
    id: 'no-timeline',
    title: 'Bar / Pie / Table (No Timeline)',
    subtitle: 'Proportion and ranking language',
    accent: 'chart',
    chipGroups: [
      {
        id: 'proportion',
        label: 'Proportion verbs',
        hint: 'Use with %, highest / lowest / largest / smallest percentage, proportion, or ratio',
        chips: ['account for', 'make up', 'represent', 'constitute']
      },
      {
        id: 'majority',
        label: 'Majority',
        chips: ['majority']
      },
      {
        id: 'least',
        label: 'Least significant',
        hint: 'Pair with a noun',
        chips: ['the least significant + noun']
      },
      {
        id: 'lowest',
        label: 'Lowest amount',
        chips: ['the lowest amount of']
      }
    ]
  },
  {
    id: 'map',
    title: 'Map',
    subtitle: 'Location and development changes',
    accent: 'map',
    chipGroups: [
      {
        id: 'build',
        label: 'Construction',
        chips: ['add', 'build', 'construct']
      },
      {
        id: 'remove',
        label: 'Removal',
        chips: ['destroy', 'demolish', 'dismantle', 'remove']
      },
      {
        id: 'change',
        label: 'Transformation',
        chips: ['transform', 'change', 'repurpose']
      },
      {
        id: 'move',
        label: 'Relocation',
        chips: ['move', 'relocate']
      },
      {
        id: 'replace',
        label: 'Replacement',
        chips: ['replace', 'substitute']
      }
    ]
  },
  {
    id: 'process',
    title: 'Process Diagram',
    subtitle: 'Stage-by-stage sequencing language',
    accent: 'process',
    chipGroups: [
      {
        id: 'sequence',
        label: 'Sequence markers',
        chips: ['subsequently', 'in the following stage', 'in the subsequent step']
      },
      {
        id: 'flow',
        label: 'Process flow',
        chips: ['followed the process of v.ing / noun', 'culminate in']
      }
    ],
    structures: [
      {
        id: 'end-marker',
        label: 'End of process',
        template: 'S + V, which marks the end of the production process.'
      },
      {
        id: 'before-after',
        label: 'Before / after',
        template: 'S + V before / after S + V.'
      },
      {
        id: 'followed-by',
        label: 'Which is followed by',
        template: 'S + V, which is followed by S + V.'
      },
      {
        id: 'which-clause',
        label: 'Which clause',
        template: 'S + V, which …'
      },
      {
        id: 'participle',
        label: 'Participle phrase',
        template: 'S + V, v.ing'
      }
    ]
  },
  {
    id: 'all-types',
    title: 'All Question Types',
    subtitle: 'Complex structures for higher band range',
    accent: 'all',
    structures: [
      {
        id: 'while',
        label: 'While',
        template: 'While S + V, S + V.'
      },
      {
        id: 'whereas',
        label: 'Whereas',
        template: 'Whereas S + V, S + V.'
      },
      {
        id: 'although',
        label: 'Although',
        template: 'S + V although S + V.'
      },
      {
        id: 'participle-all',
        label: 'Participle / past participle',
        template: 'S + V, v.ing / v.3'
      }
    ]
  }
]

// ── SEO landing page content ─────────────────────────────────────────

export type WritingTask1TypeInfo = {
  id: string
  title: string
  titleTh: string
  descTh: string
  badge: string
}

export const WRITING_TASK1_TYPE_INFO: WritingTask1TypeInfo[] = [
  {
    id: 'line-graph',
    title: 'Line Graph',
    titleTh: 'กราฟเส้น (Line Graph)',
    descTh:
      'อธิบายแนวโน้มข้อมูลตามช่วงเวลา เน้นคำกริยาแสดงการเพิ่ม–ลด ระดับความชัน และจุดสูงสุด–ต่ำสุด',
    badge: 'Task 1'
  },
  {
    id: 'bar-chart',
    title: 'Bar Chart',
    titleTh: 'กราฟแท่ง (Bar Chart)',
    descTh:
      'เปรียบเทียบค่าระหว่างหมวดหมู่หรือช่วงเวลา ใช้ภาษาแสดงสัดส่วนและการจัดอันดับ เช่น "account for", "the highest proportion"',
    badge: 'Task 1'
  },
  {
    id: 'pie-table',
    title: 'Pie Chart / Table',
    titleTh: 'Pie Chart / ตาราง',
    descTh:
      'นำเสนอสัดส่วนหรือข้อมูลหลายตัวแปรพร้อมกัน เลือกข้อมูลเด่นมาสรุป ไม่ต้องแปลทุกค่า',
    badge: 'Task 1'
  },
  {
    id: 'map',
    title: 'Map',
    titleTh: 'แผนที่ (Map)',
    descTh:
      'อธิบายการเปลี่ยนแปลงของสถานที่ระหว่างสองช่วงเวลา ใช้คำแสดงตำแหน่งและการเปลี่ยนแปลง เช่น "was replaced by", "was constructed to the north of"',
    badge: 'Task 1'
  },
  {
    id: 'process',
    title: 'Process Diagram',
    titleTh: 'ผังกระบวนการ (Process)',
    descTh:
      'อธิบายขั้นตอนการผลิตหรือวงจรธรรมชาติตามลำดับ ใช้ passive voice และ sequence markers เช่น "subsequently", "in the following stage"',
    badge: 'Task 1'
  }
]

export type WritingTask2TypeInfo = {
  id: string
  title: string
  titleTh: string
  descTh: string
  focusTh: string[]
}

export const WRITING_TASK2_TYPE_INFO: WritingTask2TypeInfo[] = [
  {
    id: 'to-what-extent',
    title: 'To What Extent',
    titleTh: 'Opinion — To What Extent',
    descTh:
      'โจทย์บอกทัศนคติหรือข้ออ้างมาให้ แล้วถามว่าคุณเห็นด้วยมากน้อยแค่ไหน ต้องแสดงจุดยืนชัดเจนตั้งแต่ Introduction',
    focusTh: [
      'ระบุตำแหน่งของคุณชัดเจนใน Introduction',
      'ใช้ extent language: largely, partly, to a large extent',
      'สรุปยืนยัน stance อีกครั้งใน Conclusion'
    ]
  },
  {
    id: 'double-question',
    title: 'Double Question',
    titleTh: 'Two Direct Questions',
    descTh:
      'โจทย์ถามสองคำถามชัดเจน ต้องตอบทั้งคู่ให้ครบ ห้ามตอบแค่คำถามเดียวหรือรวมสองคำตอบไว้ในย่อหน้าเดียว',
    focusTh: [
      'แยก body paragraph ละ 1 คำถาม',
      'พัฒนาแต่ละย่อหน้าเท่าๆ กัน',
      'ห้ามรวมคำตอบสองข้อไว้ด้วยกัน'
    ]
  },
  {
    id: 'discuss-both-views',
    title: 'Discuss Both Views',
    titleTh: 'Discuss Both Views + Give Opinion',
    descTh:
      'นำเสนอสองฝ่ายแล้วสรุปความเห็นของตัวเอง ต้องใช้ภาษา contrast เช่น whereas, while, on the other hand เพื่อแยกฝ่ายให้ชัด',
    focusTh: [
      'หนึ่ง body paragraph ต่อหนึ่ง view',
      'ใช้ contrast language อย่าง whereas, while',
      'ระบุ opinion ใน Introduction และ Conclusion'
    ]
  },
  {
    id: 'advantages-disadvantages',
    title: 'Advantages & Disadvantages',
    titleTh: 'Advantages & Disadvantages',
    descTh:
      'วิเคราะห์ข้อดีและข้อเสียของปรากฏการณ์หรือประเด็นที่โจทย์ให้มา บางข้อถามเพียงด้านเดียว ให้อ่านโจทย์ให้ครบก่อนวางแผน',
    focusTh: [
      'จัดเรียงตามหัวข้อหรือตาม advantage/disadvantage blocks',
      'ใช้คำประเมิน: outweigh, beneficial, problematic',
      'อ่านโจทย์ให้ดีก่อน — บางข้อถามแค่ด้านเดียว'
    ]
  }
]

// ── Featured practice questions for the SEO landing ──────────────────

export type WritingFeaturedTask1 = {
  id: string
  month: string
  chartType: 'line-graph'
  chartTypeLabel: string
  promptLine: string
  instruction: string
  wordLimit: string
  prompt: WritingTimelinePracticePrompt
}

export type WritingFeaturedTask2 = {
  id: string
  month: string
  questionType: string
  questionTypeTh: string
  promptText: string
  instruction: string
  wordLimit: string
}

export const WRITING_FEATURED_TASK1: WritingFeaturedTask1 = {
  id: 'featured-task1-june-2026-online-shopping',
  month: 'June 2026',
  chartType: 'line-graph',
  chartTypeLabel: 'Line Graph',
  promptLine: 'The line graph below shows the percentage of adults in three countries who made at least one online purchase per month between 2014 and 2024.',
  instruction: 'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
  wordLimit: 'Write at least 150 words.',
  prompt: {
    id: 'featured-task1-june-2026-online-shopping',
    number: 1,
    chartType: 'line-graph',
    chartTypeLabel: 'Line Graph',
    title: 'Adults making at least one online purchase per month (%)',
    chartCaption: 'Percentage of adults making at least one online purchase per month (2014–2024)',
    subjectPhrase: 'the percentage of adults who made at least one online purchase per month',
    unit: '% of adults',
    yAxisLabel: 'Percentage (%)',
    valueLabel: 'Percentage',
    years: [2014, 2016, 2018, 2020, 2022, 2024],
    values: [28, 38, 51, 72, 79, 86],
    mainTrend: 'Online shopping increased steadily, rising sharply after 2018.'
  }
}

export const WRITING_FEATURED_TASK2: WritingFeaturedTask2 = {
  id: 'featured-task2-may-2026-ai-education',
  month: 'May 2026',
  questionType: 'Discuss Both Views + Give Opinion',
  questionTypeTh: 'Discuss Both Views + Give Opinion',
  promptText:
    'Some people believe that artificial intelligence will have a largely positive impact on education, while others argue that it will cause more harm than good. Discuss both views and give your own opinion.',
  instruction: 'Give reasons for your answer and include any relevant examples from your own knowledge or experience.',
  wordLimit: 'Write at least 250 words.'
}

export const WRITING_TASK2_TYPES: WritingTask2Type[] = [
  {
    id: 'to-what-extent',
    title: 'To What Extent',
    subtitle: 'Agree / disagree with a statement',
    focus: [
      'State your position clearly in the introduction',
      'Use extent language: largely, partly, to a large extent, to some extent',
      'Balance both sides before giving your final stance in the conclusion'
    ]
  },
  {
    id: 'double-question',
    title: 'Double Question',
    subtitle: 'Two direct questions in one prompt',
    focus: [
      'Answer both questions with equal development',
      'Use one body paragraph per question',
      'Do not merge the two answers into one vague paragraph'
    ]
  },
  {
    id: 'discuss-both-views',
    title: 'Discuss Both Views & Give Your Opinion',
    subtitle: 'Present two sides, then your view',
    focus: [
      'One paragraph for view A, one for view B',
      'Use contrast language: whereas, while, on the other hand',
      'State your opinion explicitly in the introduction or conclusion'
    ]
  },
  {
    id: 'advantages-disadvantages',
    title: 'Advantages & Disadvantages',
    subtitle: 'Weigh benefits against drawbacks',
    focus: [
      'Organise by theme or by advantage/disadvantage blocks',
      'Use evaluative language: outweigh, beneficial, problematic, drawback',
      'Answer the exact question — sometimes only advantages, sometimes both'
    ]
  }
]
