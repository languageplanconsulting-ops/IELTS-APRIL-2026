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
