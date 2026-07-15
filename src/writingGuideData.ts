export type WritingTimelineChartType = 'line-graph' | 'bar-chart' | 'table'
export type WritingSnapshotChartType = 'pie-chart' | 'bar-chart' | 'table'

export type WritingLineSeries = { label: string; color: string; values: number[] }

export type WritingTimelinePracticePrompt = {
  id: string
  number: number
  kind: 'timeline'
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
  series?: WritingLineSeries[]
}

export type WritingSnapshotPracticePrompt = {
  id: string
  number: number
  kind: 'snapshot'
  chartType: WritingSnapshotChartType
  chartTypeLabel: string
  title: string
  chartCaption: string
  subjectPhrase: string
  unit: string
  valueLabel: string
  mainFeature: string
  pies?: Array<{ title: string; slices: Array<{ label: string; value: number; color: string }> }>
  categories?: string[]
  series?: WritingLineSeries[]
  tableHeaders?: string[]
  tableRows?: Array<{ entity: string; values: (string | number)[] }>
}

export type WritingMixedSnapshotPanel = {
  kind: 'snapshot'
  chartType: WritingSnapshotChartType
  chartCaption: string
  unit: string
  valueLabel: string
  pies?: Array<{ title: string; slices: Array<{ label: string; value: number; color: string }> }>
  categories?: string[]
  series?: WritingLineSeries[]
  tableHeaders?: string[]
  tableRows?: Array<{ entity: string; values: (string | number)[] }>
}

export type WritingMixedTimelinePanel = {
  kind: 'timeline'
  chartType: WritingTimelineChartType
  chartCaption: string
  unit: string
  yAxisLabel: string
  valueLabel: string
  years: number[]
  values: number[]
  series?: WritingLineSeries[]
}

export type WritingMixedPanel = WritingMixedSnapshotPanel | WritingMixedTimelinePanel

export type WritingMixedPracticePrompt = {
  id: string
  number: number
  kind: 'mixed'
  chartTypeLabel: string
  title: string
  subjectPhrase: string
  mainFeature: string
  panels: WritingMixedPanel[]
}

export type Task1MapZone = {
  x: number; y: number; w: number; h: number; label: string; color: string
}

export type WritingMapPracticePrompt = {
  id: string
  number: number
  kind: 'map'
  chartTypeLabel: string
  title: string
  chartCaption: string
  subjectPhrase: string
  mainFeature: string
  before: { year: string; zones: Task1MapZone[] }
  after: { year: string; zones: Task1MapZone[] }
}

export type WritingProcessStage = {
  id: string
  label: string
  detail: string
}

export type WritingProcessPracticePrompt = {
  id: string
  number: number
  kind: 'process'
  chartTypeLabel: string
  title: string
  chartCaption: string
  subjectPhrase: string
  mainFeature: string
  stages: WritingProcessStage[]
}

export type WritingTask1PracticePrompt =
  | WritingTimelinePracticePrompt
  | WritingSnapshotPracticePrompt
  | WritingMixedPracticePrompt
  | WritingMapPracticePrompt
  | WritingProcessPracticePrompt

export const getIeltsTask1ChartNoun = (chartType: WritingTimelineChartType | WritingSnapshotChartType) => {
  if (chartType === 'line-graph') return 'line graph'
  if (chartType === 'bar-chart') return 'bar chart'
  if (chartType === 'pie-chart') return 'pie chart'
  return 'table'
}

export const getIeltsTask1OpeningLine = (prompt: WritingTimelinePracticePrompt) => {
  const chartNoun = getIeltsTask1ChartNoun(prompt.chartType)
  const startYear = prompt.years[0]
  const endYear = prompt.years[prompt.years.length - 1]
  return `The ${chartNoun} below shows ${prompt.subjectPhrase} between ${startYear} and ${endYear}.`
}

export const getIeltsTask1SnapshotOpeningLine = (prompt: WritingSnapshotPracticePrompt) => {
  const chartNoun = getIeltsTask1ChartNoun(prompt.chartType)
  return `The ${chartNoun} below shows ${prompt.subjectPhrase}.`
}

export const getIeltsTask1MixedOpeningLine = (prompt: WritingMixedPracticePrompt) => {
  const chartNouns = prompt.panels.map((panel) => getIeltsTask1ChartNoun(panel.chartType))
  const uniqueNouns = Array.from(new Set(chartNouns))
  const chartList =
    uniqueNouns.length > 2
      ? `${uniqueNouns.slice(0, -1).join(', ')}, and ${uniqueNouns[uniqueNouns.length - 1]}`
      : uniqueNouns.join(' and ')
  return `The ${chartList} below show ${prompt.subjectPhrase}.`
}

export const getIeltsTask1MapOpeningLine = (prompt: WritingMapPracticePrompt) =>
  `The two maps below show ${prompt.subjectPhrase}.`

export const getIeltsTask1ProcessOpeningLine = (prompt: WritingProcessPracticePrompt) =>
  `The diagram below shows ${prompt.subjectPhrase}.`

/** Exam-style opening stem shown in the question list and drill. */
export const getWritingTask1ExamStem = (prompt: WritingTask1PracticePrompt): string => {
  if (prompt.kind === 'timeline') return getIeltsTask1OpeningLine(prompt)
  if (prompt.kind === 'snapshot') return getIeltsTask1SnapshotOpeningLine(prompt)
  if (prompt.kind === 'mixed') return getIeltsTask1MixedOpeningLine(prompt)
  if (prompt.kind === 'map') return getIeltsTask1MapOpeningLine(prompt)
  return getIeltsTask1ProcessOpeningLine(prompt)
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
  practicePrompts?: WritingTask1PracticePrompt[]
}

export const WRITING_TIMELINE_YEARS = [2014, 2016, 2018, 2020, 2022, 2024] as const

export const WRITING_TIMELINE_PRACTICE_PROMPTS: WritingTimelinePracticePrompt[] = [
  {
    id: 'timeline-online-learning',
    number: 1,
    kind: 'timeline',
    chartType: 'line-graph',
    chartTypeLabel: 'Line Graph',
    title: 'The graph below shows the percentage of students using online learning platforms and attending in-person classes between 2014 and 2024.',
    chartCaption: 'Percentage of students using online learning platforms vs. attending in-person classes',
    subjectPhrase:
      'the percentage of students who used online learning platforms compared with those who attended traditional in-person classes',
    unit: '% of students',
    yAxisLabel: 'Percentage of students (%)',
    valueLabel: 'Percentage',
    years: [...WRITING_TIMELINE_YEARS],
    values: [18, 25, 34, 58, 67, 74],
    mainTrend:
      'Online learning increased dramatically while in-person attendance declined drastically, with the two lines crossing paths around 2019.',
    series: [
      { label: 'Online learning platforms', color: '#0f53c9', values: [18, 25, 34, 58, 67, 74] },
      { label: 'In-person classes', color: '#d97706', values: [82, 75, 66, 42, 33, 26] }
    ]
  },
  {
    id: 'timeline-food-delivery',
    number: 2,
    kind: 'timeline',
    chartType: 'line-graph',
    chartTypeLabel: 'Line Graph',
    title: 'The graph below shows the number of petrol-powered and electric cars sold in a European country between 2014 and 2024.',
    chartCaption: 'Number of petrol-powered vs. electric cars sold',
    subjectPhrase: 'the number of petrol-powered and electric cars sold',
    unit: 'thousand units',
    yAxisLabel: 'Number of cars sold (thousands)',
    valueLabel: 'Sales',
    years: [...WRITING_TIMELINE_YEARS],
    values: [85, 80, 72, 58, 42, 30],
    mainTrend:
      'Petrol car sales declined continuously while electric vehicle sales increased dramatically, with the two lines crossing paths around 2020.',
    series: [
      { label: 'Petrol vehicles', color: '#d97706', values: [85, 80, 72, 58, 42, 30] },
      { label: 'Electric vehicles', color: '#0d9488', values: [8, 15, 28, 48, 70, 88] }
    ]
  },
  {
    id: 'timeline-work-from-home',
    number: 3,
    kind: 'timeline',
    chartType: 'bar-chart',
    chartTypeLabel: 'Bar Chart',
    title: 'The chart below shows the number of people working from home in one country between 2014 and 2024.',
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
    kind: 'timeline',
    chartType: 'bar-chart',
    chartTypeLabel: 'Bar Chart',
    title: 'The chart below shows the amount of money spent on public libraries in one country between 2014 and 2024.',
    chartCaption: 'Amount of money spent on public libraries',
    subjectPhrase: 'the amount of money spent on public libraries',
    unit: '$ million',
    yAxisLabel: 'Spending ($ million)',
    valueLabel: 'Spending',
    years: [...WRITING_TIMELINE_YEARS],
    values: [95, 88, 72, 40, 35, 28],
    mainTrend: 'Spending on public libraries decreased continuously over the period, falling to less than a third of its original level.'
  },
  {
    id: 'timeline-smart-tvs',
    number: 5,
    kind: 'timeline',
    chartType: 'table',
    chartTypeLabel: 'Table',
    title: 'The table below shows the percentage of households owning smart TVs, laptops and desktop computers between 2014 and 2024.',
    chartCaption: 'Percentage of households owning smart TVs, laptops, and desktop computers',
    subjectPhrase: 'the percentage of households that owned a smart TV, a laptop, or a desktop computer',
    unit: '% of households',
    yAxisLabel: 'Percentage of households (%)',
    valueLabel: 'Percentage',
    years: [...WRITING_TIMELINE_YEARS],
    values: [12, 24, 39, 55, 68, 76],
    mainTrend:
      'Smart TV ownership increased continuously and overtook desktop ownership, which declined, shortly after 2018, while laptop ownership grew steadily throughout.',
    series: [
      { label: 'Smart TVs', color: '#0f53c9', values: [12, 24, 39, 55, 68, 76] },
      { label: 'Laptops', color: '#7c3aed', values: [42, 48, 54, 58, 61, 64] },
      { label: 'Desktops', color: '#64748b', values: [58, 52, 44, 35, 28, 22] }
    ]
  },
  {
    id: 'timeline-online-shopping-3country',
    number: 6,
    kind: 'timeline',
    chartType: 'line-graph',
    chartTypeLabel: 'Line Graph',
    title: 'The graph below shows the average monthly amount spent on online shopping by adults in three countries between 2014 and 2024.',
    chartCaption: 'Average monthly online shopping spend (UK, USA, Australia)',
    subjectPhrase: 'the average monthly amount spent on online shopping by adults in three countries: the UK, the USA, and Australia',
    unit: 'US dollars',
    yAxisLabel: 'Average monthly spend (US$)',
    valueLabel: 'Spend',
    years: [...WRITING_TIMELINE_YEARS],
    values: [45, 48, 52, 55, 54, 53],
    mainTrend: 'Australia overtook both the UK and the USA, while the USA fell back after an early peak.',
    series: [
      { label: 'UK',        color: '#0f53c9', values: [45, 48, 52, 55, 54, 53] },
      { label: 'USA',       color: '#d97706', values: [55, 58, 60, 58, 55, 52] },
      { label: 'Australia', color: '#0d9488', values: [22, 35, 50, 62, 74, 82] }
    ]
  },
  {
    id: 'timeline-social-media-4region',
    number: 7,
    kind: 'timeline',
    chartType: 'line-graph',
    chartTypeLabel: 'Line Graph',
    title: 'The graph below shows the number of people using social media platforms in four regions between 2010 and 2024.',
    chartCaption: 'Number of people using social media platforms (North America, Europe, Asia-Pacific, Latin America)',
    subjectPhrase: 'the number of people who used social media platforms in four regions: North America, Europe, Asia-Pacific, and Latin America',
    unit: 'millions of users',
    yAxisLabel: 'Number of users (millions)',
    valueLabel: 'Users',
    years: [2010, 2012, 2014, 2016, 2018, 2020, 2022, 2024],
    values: [55, 62, 68, 72, 74, 75, 76, 77],
    mainTrend:
      'Asia-Pacific overtook both Latin America and Europe to become the highest of the four regions, while Europe declined after peaking around the midpoint of the period.',
    series: [
      { label: 'N. America',    color: '#0f53c9', values: [55, 62, 68, 72, 74, 75, 76, 77] },
      { label: 'Europe',        color: '#d97706', values: [42, 50, 58, 65, 70, 68, 65, 63] },
      { label: 'Asia-Pacific',  color: '#0d9488', values: [12, 20, 30, 42, 55, 68, 78, 85] },
      { label: 'Latin America', color: '#7c3aed', values: [25, 32, 40, 50, 58, 64, 68, 70] }
    ]
  }
]

export const WRITING_SNAPSHOT_PRACTICE_PROMPTS: WritingSnapshotPracticePrompt[] = [
  {
    id: 'snapshot-vietnam-us-exports',
    number: 1,
    kind: 'snapshot',
    chartType: 'pie-chart',
    chartTypeLabel: 'Pie Chart',
    title: 'The charts below show the value of exports between the US and Vietnam by product category in 2023.',
    chartCaption: 'Value of exports between the US and Vietnam, by product category (2023)',
    subjectPhrase: 'the value of exports between the US and Vietnam, broken down by product category, in 2023',
    unit: 'US$ million',
    valueLabel: 'Value',
    mainFeature:
      'Coffee and aircraft parts were the leading export categories in their respective directions, together accounting for a substantial share of total export value on each side.',
    pies: [
      {
        title: 'Exports: Vietnam to US ($million)',
        slices: [
          { label: 'Coffee', value: 23, color: '#0f53c9' },
          { label: 'Fruit and vegetables', value: 16, color: '#0d9488' },
          { label: 'Seafood', value: 4.4, color: '#d97706' },
          { label: 'Rice', value: 4.3, color: '#7c3aed' },
          { label: 'Garments', value: 2, color: '#64748b' },
          { label: 'Other', value: 2, color: '#e2e8f0' }
        ]
      },
      {
        title: 'Exports: US to Vietnam ($million)',
        slices: [
          { label: 'Aircraft parts', value: 72, color: '#0f53c9' },
          { label: 'Machinery', value: 30.5, color: '#0d9488' },
          { label: 'Fertiliser', value: 16.5, color: '#d97706' },
          { label: 'Cotton', value: 12, color: '#7c3aed' },
          { label: 'Cars', value: 6, color: '#64748b' },
          { label: 'Other', value: 35, color: '#e2e8f0' }
        ]
      }
    ]
  },
  {
    id: 'snapshot-uk-thailand-spending',
    number: 2,
    kind: 'snapshot',
    chartType: 'bar-chart',
    chartTypeLabel: 'Bar Chart',
    title: 'The chart below shows average household spending on five categories in the UK and Thailand in 2023.',
    chartCaption: 'Average household spending by category, UK vs Thailand (2023)',
    subjectPhrase:
      'the average household spending on five categories — food, transport, housing, healthcare, and leisure — in the UK and Thailand in 2023',
    unit: '% of total spending',
    valueLabel: 'Percentage of spending',
    mainFeature:
      'Housing made up the largest proportion of spending in the UK, whereas food accounted for the largest share of spending in Thailand.',
    categories: ['Food', 'Transport', 'Housing', 'Healthcare', 'Leisure'],
    series: [
      { label: 'UK', color: '#0f53c9', values: [18, 14, 28, 12, 15] },
      { label: 'Thailand', color: '#bf8b30', values: [25, 18, 22, 8, 10] }
    ]
  },
  {
    id: 'snapshot-germany-australia-energy',
    number: 3,
    kind: 'snapshot',
    chartType: 'pie-chart',
    chartTypeLabel: 'Pie Chart',
    title: 'The charts below show electricity generation by energy source in Germany and Australia in 2020.',
    chartCaption: 'Distribution of energy sources used to generate electricity, Germany vs Australia (2020)',
    subjectPhrase:
      'the distribution of energy sources used to generate electricity in two countries — Germany and Australia — in 2020',
    unit: '% of electricity generated',
    valueLabel: 'Percentage',
    mainFeature:
      'Renewables made up the largest proportion of electricity generation in Germany, whereas coal remained by far the dominant source in Australia.',
    pies: [
      {
        title: 'Germany 2020',
        slices: [
          { label: 'Renewables', value: 44, color: '#0d9488' },
          { label: 'Coal', value: 25, color: '#64748b' },
          { label: 'Gas', value: 16, color: '#0f53c9' },
          { label: 'Nuclear', value: 6, color: '#bf8b30' },
          { label: 'Other', value: 9, color: '#e2e8f0' }
        ]
      },
      {
        title: 'Australia 2020',
        slices: [
          { label: 'Coal', value: 52, color: '#64748b' },
          { label: 'Gas', value: 22, color: '#0f53c9' },
          { label: 'Renewables', value: 21, color: '#0d9488' },
          { label: 'Other', value: 5, color: '#e2e8f0' }
        ]
      }
    ]
  },
  {
    id: 'snapshot-universities-table',
    number: 4,
    kind: 'snapshot',
    chartType: 'table',
    chartTypeLabel: 'Table',
    title: 'The table below shows data on five universities across four indicators in 2024.',
    chartCaption: 'Research output, satisfaction, employment, and international students across five universities (2024)',
    subjectPhrase:
      'data on five universities — Oxford, MIT, the University of Sydney, Chulalongkorn University, and Seoul National University — across four indicators: research output, student satisfaction, graduate employment, and the percentage of international students, in 2024',
    unit: 'mixed units (see table)',
    valueLabel: 'Indicator value',
    mainFeature:
      'Oxford recorded the highest research output, while MIT led in student satisfaction and graduate employment; Chulalongkorn recorded the lowest figures across every indicator.',
    tableHeaders: ['Research Output', 'Satisfaction', 'Employment', "Int'l Students"],
    tableRows: [
      { entity: 'Oxford', values: ['48,500', '87%', '94%', '42%'] },
      { entity: 'MIT', values: ['42,000', '91%', '97%', '35%'] },
      { entity: 'Univ. Sydney', values: ['18,200', '83%', '89%', '38%'] },
      { entity: 'Chulalongkorn', values: ['4,300', '79%', '82%', '12%'] },
      { entity: "Seoul Nat'l", values: ['22,100', '85%', '91%', '28%'] }
    ]
  },
  {
    id: 'snapshot-household-waste',
    number: 5,
    kind: 'snapshot',
    chartType: 'pie-chart',
    chartTypeLabel: 'Pie Chart',
    title: 'The charts below show the proportion of household waste recycled in a European city in 2008 and 2018.',
    chartCaption: 'Proportion of household waste that was recycled vs. not recycled (2008 and 2018)',
    subjectPhrase: 'the proportion of household waste that was recycled compared with waste that was not recycled, in 2008 and 2018',
    unit: '% of household waste',
    valueLabel: 'Percentage',
    mainFeature:
      'The proportion of household waste that was recycled rose substantially between 2008 and 2018, overtaking non-recycled waste to become the majority by the later year.',
    pies: [
      {
        title: 'Household Waste 2008',
        slices: [
          { label: 'Not recycled', value: 72, color: '#64748b' },
          { label: 'Recycled', value: 28, color: '#0d9488' }
        ]
      },
      {
        title: 'Household Waste 2018',
        slices: [
          { label: 'Recycled', value: 58, color: '#0d9488' },
          { label: 'Not recycled', value: 42, color: '#64748b' }
        ]
      }
    ]
  },
  {
    id: 'snapshot-museum-visitors',
    number: 6,
    kind: 'snapshot',
    chartType: 'bar-chart',
    chartTypeLabel: 'Bar Chart',
    title: 'The chart below shows the number of visitors to three museums in London in 2023.',
    chartCaption: 'Average number of visitors to three London museums per month',
    subjectPhrase:
      'the average number of visitors per month to three London museums — the British Museum, the Science Museum, and the Natural History Museum',
    unit: 'thousand visitors per month',
    valueLabel: 'Number of visitors',
    mainFeature:
      'The British Museum attracted considerably more visitors than the other two museums, while the Science Museum received the fewest.',
    categories: ['British Museum', 'Science Museum', 'Natural History Museum'],
    series: [{ label: 'Visitors', color: '#0f53c9', values: [180, 95, 145] }]
  }
]

export const WRITING_MIXED_PRACTICE_PROMPTS: WritingMixedPracticePrompt[] = [
  {
    id: 'mixed-riverside-language-school',
    number: 1,
    kind: 'mixed',
    chartTypeLabel: 'Pie Chart + Table + Bar Chart',
    title: 'The charts below show the nationality of students and course enrolments at a language school in 2023, and total enrolments between 2014 and 2023.',
    subjectPhrase:
      'the nationality of students at Riverside Language School in 2023, enrolments by course type in the same year, and total student enrolments at the school between 2014 and 2023',
    mainFeature:
      'Chinese students made up the largest proportion of the intake and General English was the most popular course, while total enrolments fell sharply in 2020 before recovering to a new peak in 2023.',
    panels: [
      {
        kind: 'snapshot',
        chartType: 'pie-chart',
        chartCaption: 'Nationality of students at Riverside Language School (2023)',
        unit: '% of students',
        valueLabel: 'Percentage',
        pies: [
          {
            title: 'Student Nationality 2023',
            slices: [
              { label: 'Chinese', value: 32, color: '#0f53c9' },
              { label: 'Japanese', value: 21, color: '#0d9488' },
              { label: 'Brazilian', value: 15, color: '#d97706' },
              { label: 'Saudi', value: 12, color: '#7c3aed' },
              { label: 'Korean', value: 9, color: '#64748b' },
              { label: 'Other', value: 11, color: '#e2e8f0' }
            ]
          }
        ]
      },
      {
        kind: 'snapshot',
        chartType: 'table',
        chartCaption: 'Course enrolments at Riverside Language School (2023)',
        unit: 'students, weeks, %',
        valueLabel: 'Enrolments',
        tableHeaders: ['Enrolments', 'Avg. Course Length (weeks)', 'Pass Rate'],
        tableRows: [
          { entity: 'General English', values: [420, '12', '81%'] },
          { entity: 'Business English', values: [180, '8', '88%'] },
          { entity: 'IELTS Preparation', values: [260, '10', '76%'] },
          { entity: 'Exam Prep (other)', values: [90, '6', '85%'] },
          { entity: 'Summer Intensive', values: [150, '4', '90%'] }
        ]
      },
      {
        kind: 'timeline',
        chartType: 'bar-chart',
        chartCaption: 'Total student enrolments at Riverside Language School (2014–2023)',
        unit: 'students',
        yAxisLabel: 'Number of students',
        valueLabel: 'Enrolments',
        years: [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023],
        values: [640, 710, 760, 830, 890, 950, 310, 480, 820, 1100]
      }
    ]
  },
  {
    id: 'mixed-city-farmers-market',
    number: 2,
    kind: 'mixed',
    chartTypeLabel: 'Pie Chart + Line Graph',
    title: 'The charts below show how visitors travelled to a farmers’ market in 2023 and the total number of visitors between 2015 and 2023.',
    subjectPhrase:
      'the method of transport used by visitors to a city farmers market and the number of visitors to the market between 2015 and 2023',
    mainFeature:
      'The private car was the most common way for visitors to reach the market, and the number of visitors fluctuated over the period, with a notable dip in 2021.',
    panels: [
      {
        kind: 'snapshot',
        chartType: 'pie-chart',
        chartCaption: 'Method of transport used by visitors to the city farmers market',
        unit: '% of visitors',
        valueLabel: 'Percentage',
        pies: [
          {
            title: 'Transport to the Market',
            slices: [
              { label: 'Car', value: 42, color: '#0f53c9' },
              { label: 'Bus', value: 22, color: '#d97706' },
              { label: 'Bicycle', value: 18, color: '#0d9488' },
              { label: 'Walk', value: 12, color: '#7c3aed' },
              { label: 'Other', value: 6, color: '#e2e8f0' }
            ]
          }
        ]
      },
      {
        kind: 'timeline',
        chartType: 'line-graph',
        chartCaption: 'Number of visitors to the city farmers market (2015–2023)',
        unit: 'thousand visitors',
        yAxisLabel: 'Number of visitors (thousands)',
        valueLabel: 'Visitors',
        years: [2015, 2017, 2019, 2021, 2023],
        values: [28, 35, 42, 25, 48]
      }
    ]
  }
]

export const WRITING_MAP_PRACTICE_PROMPTS: WritingMapPracticePrompt[] = [
  {
    id: 'map-town-centre',
    number: 1,
    kind: 'map',
    chartTypeLabel: 'Map',
    title: 'The maps below show the layout of a town centre in 2005 and in 2025.',
    chartCaption: 'Changes in the layout of a town centre between 2005 and 2025',
    subjectPhrase: 'the layout of a town centre in 2005 and 2025',
    mainFeature:
      'The industrial zone in the southwest was converted into a tech park with an identical footprint, while the shopping mall and car park in the north were demolished and replaced by residential housing and a civic centre.',
    before: {
      year: '2005',
      zones: [
        { x: 4, y: 4, w: 54, h: 36, label: 'Shopping\nMall', color: '#bfdbfe' },
        { x: 62, y: 4, w: 34, h: 36, label: 'Car Park', color: '#e2e8f0' },
        { x: 4, y: 44, w: 34, h: 36, label: 'Industrial\nZone', color: '#fde68a' },
        { x: 42, y: 44, w: 54, h: 18, label: 'Market', color: '#bbf7d0' },
        { x: 42, y: 64, w: 54, h: 16, label: 'Open Space', color: '#d1fae5' }
      ]
    },
    after: {
      year: '2025',
      zones: [
        { x: 4, y: 4, w: 38, h: 36, label: 'Residential', color: '#c7d2fe' },
        { x: 46, y: 4, w: 50, h: 36, label: 'Civic Centre', color: '#bfdbfe' },
        { x: 4, y: 44, w: 34, h: 36, label: 'Tech Park', color: '#fde68a' },
        { x: 42, y: 44, w: 24, h: 36, label: 'Library', color: '#bbf7d0' },
        { x: 70, y: 44, w: 26, h: 36, label: 'Park', color: '#d1fae5' }
      ]
    }
  },
  {
    id: 'map-island-resort',
    number: 2,
    kind: 'map',
    chartTypeLabel: 'Map',
    title: 'The maps below show an island before and after the construction of a tourist resort.',
    chartCaption: 'Changes to a small island before and after the construction of a tourist resort',
    subjectPhrase: 'a small island before and after the construction of a tourist resort',
    mainFeature:
      'The open land that once covered most of the island was developed into a reception building, a restaurant, guest huts, and a pier, transforming it into a tourist resort.',
    before: {
      year: 'Before',
      zones: [
        { x: 4, y: 4, w: 88, h: 56, label: 'Open Land', color: '#d1fae5' },
        { x: 4, y: 64, w: 88, h: 16, label: 'Beach', color: '#fef3c7' }
      ]
    },
    after: {
      year: 'After',
      zones: [
        { x: 4, y: 4, w: 26, h: 26, label: 'Reception', color: '#bfdbfe' },
        { x: 34, y: 4, w: 26, h: 26, label: 'Restaurant', color: '#fecaca' },
        { x: 64, y: 4, w: 28, h: 26, label: 'Guest\nHuts', color: '#fde68a' },
        { x: 4, y: 34, w: 56, h: 26, label: 'Open Land', color: '#d1fae5' },
        { x: 64, y: 34, w: 28, h: 26, label: 'Pier', color: '#c7d2fe' },
        { x: 4, y: 64, w: 88, h: 16, label: 'Beach', color: '#fef3c7' }
      ]
    }
  }
]

export const WRITING_PROCESS_PRACTICE_PROMPTS: WritingProcessPracticePrompt[] = [
  {
    id: 'process-instant-coffee',
    number: 1,
    kind: 'process',
    chartTypeLabel: 'Process Diagram',
    title: 'The diagram below shows how instant coffee is produced.',
    chartCaption: 'The instant coffee production process',
    subjectPhrase: 'the process by which instant coffee is produced',
    mainFeature:
      'The process begins with the harvesting of coffee cherries and ends with the packaging of instant coffee granules, and it involves eight main stages.',
    stages: [
      { id: 'harvest', label: 'Harvesting', detail: 'Ripe coffee cherries are picked by hand or machine.' },
      { id: 'pulp', label: 'Pulping', detail: 'The cherries are pulped to remove the outer skin and flesh.' },
      { id: 'dry', label: 'Drying', detail: 'The beans are spread out and dried in the sun for several days.' },
      { id: 'roast', label: 'Roasting', detail: 'The dried beans are roasted at a high temperature.' },
      { id: 'grind', label: 'Grinding', detail: 'The roasted beans are ground into a fine powder.' },
      { id: 'extract', label: 'Extraction', detail: 'The powder is dissolved in hot water to extract a coffee concentrate.' },
      { id: 'spray-dry', label: 'Spray-Drying', detail: 'The liquid concentrate is spray-dried into fine granules.' },
      { id: 'package', label: 'Packaging', detail: 'The granules are packaged into jars, ready for sale.' }
    ]
  },
  {
    id: 'process-plastic-recycling',
    number: 2,
    kind: 'process',
    chartTypeLabel: 'Process Diagram',
    title: 'The diagram below shows how plastic bottles are recycled.',
    chartCaption: 'The plastic recycling process',
    subjectPhrase: 'the process by which plastic is recycled',
    mainFeature:
      'The process begins with the collection of used plastic and ends with the manufacturing of new plastic products, and it involves seven main stages.',
    stages: [
      { id: 'collect', label: 'Collection', detail: 'Used plastic items are collected from households and businesses.' },
      { id: 'sort', label: 'Sorting', detail: 'The collected plastic is sorted by type and colour.' },
      { id: 'crush', label: 'Crushing', detail: 'The sorted plastic is crushed into small pieces.' },
      { id: 'wash', label: 'Washing', detail: 'The crushed plastic pieces are washed to remove dirt and labels.' },
      { id: 'melt', label: 'Melting', detail: 'The clean plastic pieces are melted down at a high temperature.' },
      { id: 'pelletise', label: 'Pelletising', detail: 'The molten plastic is cooled and cut into small pellets.' },
      { id: 'manufacture', label: 'Manufacturing', detail: 'The pellets are used to manufacture new plastic products.' }
    ]
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
    title: 'Timeline',
    subtitle: 'มีปี เช่น 2000–2002',
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
    title: 'No Timeline',
    subtitle: 'ไม่มีปีระบุ',
    accent: 'chart',
    practicePrompts: WRITING_SNAPSHOT_PRACTICE_PROMPTS,
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
    id: 'mixed',
    title: 'Mixed',
    subtitle: 'มีทั้งมีปีและไม่มีปี',
    accent: 'chart',
    practicePrompts: WRITING_MIXED_PRACTICE_PROMPTS,
    chipGroups: [
      {
        id: 'proportion',
        label: 'Proportion verbs',
        hint: 'Use for the pie chart and table panels',
        chips: ['account for', 'make up', 'represent', 'constitute']
      },
      {
        id: 'trend',
        label: 'Trend verbs',
        hint: 'Use for the bar chart / timeline panel',
        chips: ['increase', 'decline', 'recover', 'peak']
      },
      {
        id: 'blend',
        label: 'Blended overview',
        hint: 'Combine both registers in one overview sentence',
        chips: ['while', 'whereas', 'meanwhile']
      }
    ]
  },
  {
    id: 'map',
    title: 'Map',
    subtitle: 'Past Simple / Present Perfect',
    accent: 'map',
    practicePrompts: WRITING_MAP_PRACTICE_PROMPTS,
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
    title: 'Process',
    subtitle: 'Present Simple + Passive',
    accent: 'process',
    practicePrompts: WRITING_PROCESS_PRACTICE_PROMPTS,
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
    subtitle: 'โครงสร้างซับซ้อนสำหรับ Band สูงขึ้น',
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
