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

// ── Monthly question sets Jan–Dec 2026 ────────────────────────────────────

export type WritingMonthlyQuestionSet = {
  id: string
  month: string
  monthTh: string
  period: string
  isScheduled: boolean
  scheduledDateTh?: string
  task1: {
    chartType: string
    chartTypeTh: string
    promptText: string
    promptLine: string
  }
  task2: {
    questionType: string
    questionTypeTh: string
    promptText: string
  }
  task1Prompt?: WritingTimelinePracticePrompt
}

export const WRITING_MONTHLY_SETS_2026: WritingMonthlyQuestionSet[] = [
  {
    id: 'jan-2026',
    month: 'January 2026',
    monthTh: 'มกราคม 2569',
    period: 'Jan 2026',
    isScheduled: false,
    task1: {
      chartType: 'line-graph',
      chartTypeTh: 'Line Graph',
      promptText: 'The line graph below shows the percentage of adults in three countries (UK, USA, and Australia) who made at least one online purchase per month between 2014 and 2024.',
      promptLine: 'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.'
    },
    task1Prompt: {
      id: 'monthly-jan-t1',
      number: 1,
      chartType: 'line-graph',
      chartTypeLabel: 'Line Graph',
      title: 'Adults making at least one online purchase per month (%)',
      chartCaption: 'Percentage of adults making at least one online purchase per month (2014-2024)',
      subjectPhrase: 'the percentage of adults who made at least one online purchase per month',
      unit: '% of adults',
      yAxisLabel: 'Percentage (%)',
      valueLabel: 'Percentage',
      years: [2014, 2016, 2018, 2020, 2022, 2024],
      values: [28, 38, 51, 72, 79, 86],
      mainTrend: 'Online shopping grew sharply, especially between 2018 and 2020.'
    },
    task2: {
      questionType: 'Discuss Both Views + Give Opinion',
      questionTypeTh: 'Discuss Both Views + Give Opinion',
      promptText: 'Some people believe that artificial intelligence will have a largely positive impact on education, while others argue that it will cause more harm than good. Discuss both views and give your own opinion.'
    }
  },
  {
    id: 'feb-2026',
    month: 'February 2026',
    monthTh: 'กุมภาพันธ์ 2569',
    period: 'Feb 2026',
    isScheduled: false,
    task1: {
      chartType: 'bar-chart',
      chartTypeTh: 'Bar Chart',
      promptText: 'The bar chart below compares the average household spending on five categories (food, transport, housing, healthcare, and leisure) in the UK and Thailand in 2023.',
      promptLine: 'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.'
    },
    task2: {
      questionType: 'Advantages & Disadvantages',
      questionTypeTh: 'Advantages & Disadvantages',
      promptText: 'Nowadays, many people choose to work from home rather than commuting to an office every day. Do the advantages of working from home outweigh the disadvantages?'
    }
  },
  {
    id: 'mar-2026',
    month: 'March 2026',
    monthTh: 'มีนาคม 2569',
    period: 'Mar 2026',
    isScheduled: false,
    task1: {
      chartType: 'map',
      chartTypeTh: 'Map',
      promptText: 'The two maps below show the layout of a town centre in 2005 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
      promptLine: 'Write at least 150 words.'
    },
    task2: {
      questionType: 'To What Extent',
      questionTypeTh: 'To What Extent (เห็นด้วยมากน้อยแค่ไหน)',
      promptText: 'Some people believe that the most important thing governments can do to address climate change is to significantly reduce the use of private cars. To what extent do you agree or disagree?'
    }
  },
  {
    id: 'apr-2026',
    month: 'April 2026',
    monthTh: 'เมษายน 2569',
    period: 'Apr 2026',
    isScheduled: false,
    task1: {
      chartType: 'pie-chart',
      chartTypeTh: 'Pie Chart',
      promptText: 'The pie charts below show the distribution of energy sources used to generate electricity in two countries (Germany and Australia) in 2010 and 2020.',
      promptLine: 'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.'
    },
    task2: {
      questionType: 'Double Question',
      questionTypeTh: 'Double Question (สองคำถาม)',
      promptText: 'In many countries, young people are spending more time playing video games than ever before. Why is this happening? Is this a positive or negative development for society?'
    }
  },
  {
    id: 'may-2026',
    month: 'May 2026',
    monthTh: 'พฤษภาคม 2569',
    period: 'May 2026',
    isScheduled: false,
    task1: {
      chartType: 'line-graph',
      chartTypeTh: 'Line Graph',
      promptText: 'The line graph below shows the percentage of people using social media platforms in four regions (North America, Europe, Asia-Pacific, and Latin America) from 2010 to 2024.',
      promptLine: 'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.'
    },
    task2: {
      questionType: 'To What Extent',
      questionTypeTh: 'To What Extent',
      promptText: 'Some people feel that entertainers such as film stars, musicians and sports personalities are paid too much money. To what extent do you agree or disagree with this opinion?'
    }
  },
  {
    id: 'jun-2026',
    month: 'June 2026',
    monthTh: 'มิถุนายน 2569',
    period: 'Jun 2026',
    isScheduled: false,
    task1: {
      chartType: 'table',
      chartTypeTh: 'Table',
      promptText: 'The table below shows data on five universities across four indicators (research output, student satisfaction rate, graduate employment rate, and percentage of international students) in 2024.',
      promptLine: 'Summarise the information by selecting and reporting the main features, and make comparisons where relevant.'
    },
    task2: {
      questionType: 'Discuss Both Views + Give Opinion',
      questionTypeTh: 'Discuss Both Views + Give Opinion',
      promptText: 'Many parents today allow their children to use electronic devices such as smartphones and tablets from a very young age. Discuss the advantages and disadvantages of this trend and give your own opinion.'
    }
  },
  {
    id: 'jul-2026',
    month: 'July 2026',
    monthTh: 'กรกฎาคม 2569',
    period: 'Jul 2026',
    isScheduled: true,
    scheduledDateTh: 'เปิดเผยต้นเดือนกรกฎาคม 2569',
    task1: {
      chartType: 'line-graph',
      chartTypeTh: 'Line Graph',
      promptText: 'กำลังจะมา',
      promptLine: ''
    },
    task2: {
      questionType: 'TBA',
      questionTypeTh: 'กำลังจะมา',
      promptText: 'กำลังจะมา'
    }
  },
  {
    id: 'aug-2026',
    month: 'August 2026',
    monthTh: 'สิงหาคม 2569',
    period: 'Aug 2026',
    isScheduled: true,
    scheduledDateTh: 'เปิดเผยต้นเดือนสิงหาคม 2569',
    task1: { chartType: 'bar-chart', chartTypeTh: 'Bar Chart', promptText: 'กำลังจะมา', promptLine: '' },
    task2: { questionType: 'TBA', questionTypeTh: 'กำลังจะมา', promptText: 'กำลังจะมา' }
  },
  {
    id: 'sep-2026',
    month: 'September 2026',
    monthTh: 'กันยายน 2569',
    period: 'Sep 2026',
    isScheduled: true,
    scheduledDateTh: 'เปิดเผยต้นเดือนกันยายน 2569',
    task1: { chartType: 'map', chartTypeTh: 'Map', promptText: 'กำลังจะมา', promptLine: '' },
    task2: { questionType: 'TBA', questionTypeTh: 'กำลังจะมา', promptText: 'กำลังจะมา' }
  },
  {
    id: 'oct-2026',
    month: 'October 2026',
    monthTh: 'ตุลาคม 2569',
    period: 'Oct 2026',
    isScheduled: true,
    scheduledDateTh: 'เปิดเผยต้นเดือนตุลาคม 2569',
    task1: { chartType: 'process', chartTypeTh: 'Process Diagram', promptText: 'กำลังจะมา', promptLine: '' },
    task2: { questionType: 'TBA', questionTypeTh: 'กำลังจะมา', promptText: 'กำลังจะมา' }
  },
  {
    id: 'nov-2026',
    month: 'November 2026',
    monthTh: 'พฤศจิกายน 2569',
    period: 'Nov 2026',
    isScheduled: true,
    scheduledDateTh: 'เปิดเผยต้นเดือนพฤศจิกายน 2569',
    task1: { chartType: 'line-graph', chartTypeTh: 'Line Graph', promptText: 'กำลังจะมา', promptLine: '' },
    task2: { questionType: 'TBA', questionTypeTh: 'กำลังจะมา', promptText: 'กำลังจะมา' }
  },
  {
    id: 'dec-2026',
    month: 'December 2026',
    monthTh: 'ธันวาคม 2569',
    period: 'Dec 2026',
    isScheduled: true,
    scheduledDateTh: 'เปิดเผยต้นเดือนธันวาคม 2569',
    task1: { chartType: 'bar-chart', chartTypeTh: 'Bar Chart', promptText: 'กำลังจะมา', promptLine: '' },
    task2: { questionType: 'TBA', questionTypeTh: 'กำลังจะมา', promptText: 'กำลังจะมา' }
  }
]

// ── Band 7 sample answers ─────────────────────────────────────────────────

export type WritingBand7Highlight = {
  phrase: string
  kind: 'vocabulary' | 'grammar' | 'structure'
  labelTh: string
  descTh: string
  exampleTh?: string
}

export type WritingBand7SampleSegment = {
  id: string
  labelTh: string
  text: string
  highlights: WritingBand7Highlight[]
}

export type WritingBand7Sample = {
  task: 1 | 2
  band: string
  wordCount: number
  timeNote: string
  questionType: string
  questionTypeTh: string
  promptText: string
  segments: WritingBand7SampleSegment[]
  summaryPoints: string[]
}

export const WRITING_BAND7_TASK1_SAMPLE: WritingBand7Sample = {
  task: 1,
  band: 'Band 7',
  wordCount: 168,
  timeNote: '~18 นาที',
  questionType: 'Line Graph',
  questionTypeTh: 'Line Graph — แนวโน้มตามเวลา',
  promptText: 'The line graph below shows the percentage of adults who made at least one online purchase per month between 2014 and 2024.',
  segments: [
    {
      id: 't1-overview',
      labelTh: 'Overview — ภาพรวมหลัก (ต้องมีเสมอ)',
      text: 'The line graph illustrates the proportion of adults who shopped online at least once per month over a ten-year period from 2014 to 2024. Overall, there was a considerable and sustained rise in online shopping throughout this period, with the most dramatic increase occurring between 2018 and 2020.',
      highlights: [
        {
          phrase: 'illustrates the proportion of',
          kind: 'vocabulary',
          labelTh: 'illustrates the proportion of (paraphrase)',
          descTh: 'paraphrase "shows the percentage of" ด้วยคำที่หลากหลายกว่า — แสดง Lexical Resource สูง',
          exampleTh: 'The chart illustrates the proportion of students who passed the exam.'
        },
        {
          phrase: 'considerable and sustained rise',
          kind: 'vocabulary',
          labelTh: 'considerable and sustained rise',
          descTh: '"considerable" = มาก, "sustained" = ต่อเนื่องไม่หยุด — คำคู่นี้แสดง precision สูงมาก',
          exampleTh: 'There was a considerable and sustained rise in tourism following the new policy.'
        },
        {
          phrase: 'most dramatic increase',
          kind: 'vocabulary',
          labelTh: 'most dramatic increase (superlative + noun)',
          descTh: 'ใช้ superlative เพื่อ highlight จุดที่น่าสนใจที่สุดในกราฟ — เป็น pattern ที่ดีมากสำหรับ Task 1',
          exampleTh: 'The most dramatic increase was recorded in 2020.'
        }
      ]
    },
    {
      id: 't1-body1',
      labelTh: 'Body 1 — ช่วงแรก (2014–2018)',
      text: 'In 2014, approximately 28% of adults made regular online purchases. This figure rose steadily over the following four years, reaching 51% in 2018 — an increase of around 23 percentage points.',
      highlights: [
        {
          phrase: 'rose steadily',
          kind: 'vocabulary',
          labelTh: 'rose steadily (verb + adverb trend language)',
          descTh: '"steadily" บ่งบอกการเพิ่มขึ้นสม่ำเสมอ ไม่ฉับพลัน — เป็น trend language สำคัญมาก',
          exampleTh: 'The temperature rose steadily throughout the morning.'
        },
        {
          phrase: 'an increase of around 23 percentage points',
          kind: 'grammar',
          labelTh: 'an increase of [amount] — การระบุขนาดการเปลี่ยนแปลง',
          descTh: 'โครงสร้าง "an increase of [X]" ใช้แทน "increased by [X]" ได้ — แสดง Grammar Range',
          exampleTh: 'The pass rate improved by an increase of 15 percentage points.'
        }
      ]
    },
    {
      id: 't1-body2',
      labelTh: 'Body 2 — ช่วงที่น่าสนใจ (2018–2024)',
      text: 'The period between 2018 and 2020 saw the sharpest surge, with the percentage jumping from 51% to 72%. From 2020 onwards, growth continued but at a more moderate pace, climbing from 72% to 79% by 2022 before reaching a peak of 86% in 2024 — more than three times the 2014 figure.',
      highlights: [
        {
          phrase: 'saw the sharpest surge',
          kind: 'vocabulary',
          labelTh: 'saw the sharpest surge (period + saw + noun)',
          descTh: '"[period] saw [change]" เป็น structure คลาสสิกของ Band 7+ Task 1 — ฟังดู academic มาก',
          exampleTh: 'The 1990s saw the sharpest surge in mobile phone ownership.'
        },
        {
          phrase: 'at a more moderate pace',
          kind: 'vocabulary',
          labelTh: 'at a more moderate pace',
          descTh: 'บ่งบอกการเติบโตที่ช้าลง — ดีกว่า "more slowly" เพราะ precise และ formal กว่า',
          exampleTh: 'After the initial boom, the economy grew at a more moderate pace.'
        },
        {
          phrase: 'more than three times the 2014 figure',
          kind: 'grammar',
          labelTh: 'more than [X] times the [year] figure — multiple comparison',
          descTh: 'โครงสร้างเปรียบเทียบแบบ multiple ที่ดีกว่า "increased a lot since 2014"',
          exampleTh: 'Sales in 2024 were more than four times the 2010 figure.'
        }
      ]
    }
  ],
  summaryPoints: [
    'เขียน Overview ก่อนเสมอ — อธิบาย trend หลัก 1-2 จุดโดยไม่ใส่ตัวเลข',
    'ใช้ "saw + noun" เพื่อบรรยายช่วงเวลา เช่น "The period from X to Y saw..."',
    'ระบุขนาดการเปลี่ยนแปลงด้วย "percentage points" ไม่ใช่แค่ "percent"',
    'เปรียบเทียบจุดสูงสุด-ต่ำสุดกับช่วงเริ่มต้น เช่น "more than three times the 2014 figure"',
    'ไม่ต้องอธิบายทุกตัวเลข — เลือกเฉพาะจุดที่ significant ที่สุด'
  ]
}

export const WRITING_BAND7_TASK2_SAMPLE: WritingBand7Sample = {
  task: 2,
  band: 'Band 7',
  wordCount: 261,
  timeNote: '~38 นาที',
  questionType: 'Discuss Both Views + Give Opinion',
  questionTypeTh: 'Discuss Both Views + Give Opinion',
  promptText: 'Some people believe that artificial intelligence will have a largely positive impact on education, while others argue that it will cause more harm than good. Discuss both views and give your own opinion.',
  segments: [
    {
      id: 't2-intro',
      labelTh: 'Introduction — paraphrase + thesis',
      text: 'The rapid development of artificial intelligence has sparked considerable debate regarding its role in education. While some argue that AI will fundamentally transform learning for the better, others remain concerned about its potential drawbacks. In my view, the benefits of AI in education largely outweigh the disadvantages, provided that it is implemented thoughtfully.',
      highlights: [
        {
          phrase: 'sparked considerable debate',
          kind: 'vocabulary',
          labelTh: 'sparked considerable debate (collocation)',
          descTh: '"spark" + "debate" เป็น collocation ที่ดูเป็น native มาก — ดีกว่า "caused a lot of discussion"',
          exampleTh: 'The new policy has sparked considerable debate among politicians.'
        },
        {
          phrase: 'provided that it is implemented thoughtfully',
          kind: 'grammar',
          labelTh: '"provided that" — Conditional clause',
          descTh: '"provided that" = "ถ้าหาก / ตราบเท่าที่" เป็น conditional ที่ formal กว่า "if" — แสดง Grammar Range สูง',
          exampleTh: 'Technology can be beneficial, provided that it is used responsibly.'
        }
      ]
    },
    {
      id: 't2-body1',
      labelTh: 'Body 1 — มุมมองฝ่ายสนับสนุน AI',
      text: 'Those who favour AI in education point to its ability to personalise learning. Unlike traditional classroom instruction, AI-powered platforms can adapt to each student\'s pace and learning style, offering targeted exercises and instant feedback. This is particularly beneficial in large classrooms where teachers may struggle to meet every student\'s individual needs.',
      highlights: [
        {
          phrase: 'personalise learning',
          kind: 'vocabulary',
          labelTh: 'personalise learning (key topic verb)',
          descTh: '"personalise" แปลว่าทำให้เหมาะกับแต่ละบุคคล — คำสำคัญที่ใช้ในหัวข้อ AI + Education บ่อยมาก',
          exampleTh: 'Technology allows teachers to personalise learning for each student.'
        },
        {
          phrase: 'particularly beneficial',
          kind: 'vocabulary',
          labelTh: 'particularly beneficial (hedged positive adjective)',
          descTh: '"particularly" เพิ่ม precision ให้กับ "beneficial" — ฟังดู measured และ academic กว่า "very useful"',
          exampleTh: 'This approach is particularly beneficial for students with learning difficulties.'
        }
      ]
    },
    {
      id: 't2-body2',
      labelTh: 'Body 2 — มุมมองฝ่ายต่อต้าน AI',
      text: 'On the other hand, critics argue that excessive reliance on AI could undermine essential social and emotional skills. Education is not merely about acquiring knowledge; it also fosters communication, teamwork, and critical thinking through human interaction. If AI replaces too many aspects of the teacher-student relationship, these vital skills may be neglected.',
      highlights: [
        {
          phrase: 'undermine essential social and emotional skills',
          kind: 'vocabulary',
          labelTh: 'undermine (v.) — ทำให้อ่อนแอ / บ่อนทำลาย',
          descTh: '"undermine" แสดงผลกระทบเชิงลบที่ค่อยๆ เกิดขึ้น — ดีกว่า "destroy" หรือ "hurt" เพราะ nuanced กว่า',
          exampleTh: 'Poor management can undermine employee morale over time.'
        },
        {
          phrase: 'not merely about acquiring knowledge',
          kind: 'grammar',
          labelTh: '"not merely about" — Cleft emphasis structure',
          descTh: '"not merely about X; it also Y" เป็นโครงสร้าง contrast ที่ elegant — แสดง sentence variety ที่ดี',
          exampleTh: 'University is not merely about getting a degree; it also builds life skills.'
        }
      ]
    },
    {
      id: 't2-conclusion',
      labelTh: 'Conclusion — restate + final opinion',
      text: 'In conclusion, while the concerns about AI in education are valid, I believe that its capacity to personalise and enhance learning makes it a largely positive development. The key is to use AI as a supplement to, rather than a replacement for, human teaching.',
      highlights: [
        {
          phrase: 'a supplement to, rather than a replacement for',
          kind: 'grammar',
          labelTh: '"a supplement to, rather than a replacement for" — Parallel contrast',
          descTh: 'โครงสร้าง "A rather than B" แบบ parallel — แสดง Grammar Range สูงมาก เป็น Band 7+ signature',
          exampleTh: 'Technology should be a tool for teachers, rather than a substitute for them.'
        }
      ]
    }
  ],
  summaryPoints: [
    'Introduction: paraphrase โจทย์ + บอก stance ชัดเจน อย่าวน เขียน 3-4 ประโยค',
    'Body 1 & 2: แยกฝ่ายชัดเจน ใช้ "Those who favour..." และ "On the other hand..."',
    'ทุก body paragraph ต้องมี topic sentence + explanation + example',
    'Conclusion: อย่าเพิ่มข้อมูลใหม่ — summarise และยืนยัน opinion อีกครั้ง',
    'ใช้ "provided that / given that / as long as" แทน "if" เพื่อ Grammar Range สูงขึ้น'
  ]
}
