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
  x: number
  y: number
  w: number
  h: number
  label: string
  color: string
  /** Visual treatment — defaults to building block */
  style?: 'building' | 'farm' | 'park' | 'parking' | 'water' | 'sport' | 'forest'
}

export type Task1MapPoint = [number, number]

/** Extra IELTS-map decorations (roads, water, trees) beyond rectangular zones. */
export type Task1MapDecor =
  | { kind: 'water'; points: Task1MapPoint[]; label?: string; labelAt?: Task1MapPoint }
  | { kind: 'road'; points: Task1MapPoint[]; label?: string; width?: number }
  | { kind: 'path'; points: Task1MapPoint[] }
  | { kind: 'trees'; positions: Task1MapPoint[] }
  | { kind: 'bridge'; x: number; y: number; w: number; h: number; label?: string }
  | { kind: 'label'; x: number; y: number; text: string }

export type Task1MapPanel = {
  year: string
  zones: Task1MapZone[]
  decor?: Task1MapDecor[]
  /** When false, skips the faint street grid (prefer custom roads). Default true for older maps. */
  showGrid?: boolean
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
  before: Task1MapPanel
  after: Task1MapPanel
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
    title:
      'The chart below shows the number of people working from home and commuting to an office in one country between 2014 and 2024.',
    chartCaption: 'Remote workers vs office commuters',
    subjectPhrase: 'the number of people working from home compared with those commuting to an office',
    unit: 'millions',
    yAxisLabel: 'Number of workers (millions)',
    valueLabel: 'Workers',
    years: [...WRITING_TIMELINE_YEARS],
    values: [4, 5, 7, 21, 18, 16],
    mainTrend:
      'Remote work rose sharply and peaked in 2020, while office commuting declined overall and never returned to its earlier level.',
    series: [
      { label: 'Remote work', color: '#0f53c9', values: [4, 5, 7, 21, 18, 16] },
      { label: 'Office commuting', color: '#d97706', values: [48, 46, 42, 22, 28, 30] }
    ]
  },
  {
    id: 'timeline-electric-bicycles',
    number: 4,
    kind: 'timeline',
    chartType: 'bar-chart',
    chartTypeLabel: 'Bar Chart',
    title:
      'The chart below shows spending on public libraries and digital reading services in one country between 2014 and 2024.',
    chartCaption: 'Public-library vs digital-reading spending',
    subjectPhrase: 'spending on public libraries compared with digital reading services',
    unit: '$ million',
    yAxisLabel: 'Spending ($ million)',
    valueLabel: 'Spending',
    years: [...WRITING_TIMELINE_YEARS],
    values: [95, 88, 72, 40, 35, 28],
    mainTrend:
      'Digital reading spending rose steadily while public-library funding fell continuously to less than a third of its original level.',
    series: [
      { label: 'Public libraries', color: '#d97706', values: [95, 88, 72, 40, 35, 28] },
      { label: 'Digital reading', color: '#0f53c9', values: [12, 18, 28, 45, 58, 72] }
    ]
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
    mainTrend: 'Australia overtook both the UK and the USA, while US spend declined steadily from the highest starting point.',
    series: [
      { label: 'UK',        color: '#0f53c9', values: [45, 48, 52, 55, 54, 53] },
      { label: 'USA',       color: '#d97706', values: [60, 58, 54, 50, 48, 45] },
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
      'Asia-Pacific overtook both Latin America and Europe to become the highest of the four regions, while Europe declined continuously across the period.',
    series: [
      { label: 'N. America',    color: '#0f53c9', values: [55, 62, 68, 72, 74, 75, 76, 77] },
      { label: 'Europe',        color: '#d97706', values: [70, 68, 65, 60, 55, 50, 45, 40] },
      { label: 'Asia-Pacific',  color: '#0d9488', values: [12, 20, 30, 42, 55, 68, 78, 85] },
      { label: 'Latin America', color: '#7c3aed', values: [25, 32, 40, 50, 58, 64, 68, 70] }
    ]
  },
  {
    id: 'timeline-renewable-energy',
    number: 8,
    kind: 'timeline',
    chartType: 'line-graph',
    chartTypeLabel: 'Line Graph',
    title:
      'The graph below shows the percentage of electricity generated from renewable and fossil-fuel sources in one country between 2014 and 2024.',
    chartCaption: 'Electricity generation from renewable vs fossil-fuel sources',
    subjectPhrase:
      'the percentage of electricity generated from renewable energy compared with fossil-fuel sources',
    unit: '% of electricity',
    yAxisLabel: 'Percentage of electricity (%)',
    valueLabel: 'Percentage',
    years: [...WRITING_TIMELINE_YEARS],
    values: [22, 28, 35, 44, 52, 61],
    mainTrend:
      'Renewable generation rose steadily and overtook fossil fuels around 2021, while fossil-fuel generation declined continuously.',
    series: [
      { label: 'Renewables', color: '#0d9488', values: [22, 28, 35, 44, 52, 61] },
      { label: 'Fossil fuels', color: '#64748b', values: [78, 72, 65, 56, 48, 39] }
    ]
  },
  {
    id: 'timeline-cinema-streaming',
    number: 9,
    kind: 'timeline',
    chartType: 'line-graph',
    chartTypeLabel: 'Line Graph',
    title:
      'The graph below shows cinema ticket sales and streaming-service subscriptions in one country between 2014 and 2024.',
    chartCaption: 'Cinema ticket sales vs streaming subscriptions',
    subjectPhrase: 'cinema ticket sales and streaming-service subscriptions',
    unit: 'millions',
    yAxisLabel: 'Number (millions)',
    valueLabel: 'Number',
    years: [...WRITING_TIMELINE_YEARS],
    values: [62, 58, 55, 28, 32, 36],
    mainTrend:
      'Cinema ticket sales fell sharply in 2020 and recovered only partially, whereas streaming subscriptions increased dramatically throughout the period.',
    series: [
      { label: 'Cinema tickets', color: '#d97706', values: [62, 58, 55, 28, 32, 36] },
      { label: 'Streaming subscriptions', color: '#0f53c9', values: [18, 30, 45, 72, 88, 102] }
    ]
  },
  {
    id: 'timeline-public-transport',
    number: 10,
    kind: 'timeline',
    chartType: 'bar-chart',
    chartTypeLabel: 'Bar Chart',
    title:
      'The chart below shows average daily public-transport and private-car trips in one city between 2014 and 2024.',
    chartCaption: 'Daily public-transport vs private-car trips',
    subjectPhrase:
      'the average number of daily public-transport trips compared with private-car trips in one city',
    unit: 'million trips',
    yAxisLabel: 'Daily trips (millions)',
    valueLabel: 'Trips',
    years: [...WRITING_TIMELINE_YEARS],
    values: [3.2, 3.5, 3.8, 1.4, 2.6, 3.9],
    mainTrend:
      'Public-transport trips rose overall after a sharp 2020 dip, while private-car trips declined continuously.',
    series: [
      { label: 'Public transport', color: '#0f53c9', values: [3.2, 3.5, 3.8, 1.4, 2.6, 3.9] },
      { label: 'Private cars', color: '#d97706', values: [6.8, 6.4, 5.9, 4.2, 3.8, 3.1] }
    ]
  },
  {
    id: 'timeline-coffee-tea-spend',
    number: 11,
    kind: 'timeline',
    chartType: 'table',
    chartTypeLabel: 'Table',
    title:
      'The table below shows the average weekly amount spent on coffee and tea by adults in one country between 2014 and 2024.',
    chartCaption: 'Average weekly spend on coffee and tea',
    subjectPhrase: 'the average weekly amount spent on coffee and tea by adults',
    unit: 'US dollars',
    yAxisLabel: 'Weekly spend (US$)',
    valueLabel: 'Spend',
    years: [...WRITING_TIMELINE_YEARS],
    values: [8, 11, 15, 18, 22, 26],
    mainTrend:
      'Spending on coffee increased dramatically throughout the period, while spending on tea declined steadily.',
    series: [
      { label: 'Coffee', color: '#92400e', values: [8, 11, 15, 18, 22, 26] },
      { label: 'Tea', color: '#0d9488', values: [14, 12, 10, 8, 7, 6] }
    ]
  },
  {
    id: 'timeline-tourism-arrivals',
    number: 12,
    kind: 'timeline',
    chartType: 'line-graph',
    chartTypeLabel: 'Line Graph',
    title:
      'The graph below shows international tourist arrivals in Thailand, Japan and Vietnam between 2014 and 2024.',
    chartCaption: 'International tourist arrivals (Thailand, Japan, Vietnam)',
    subjectPhrase:
      'international tourist arrivals in three countries: Thailand, Japan and Vietnam',
    unit: 'million visitors',
    yAxisLabel: 'Arrivals (millions)',
    valueLabel: 'Arrivals',
    years: [...WRITING_TIMELINE_YEARS],
    values: [25, 28, 32, 6, 18, 34],
    mainTrend:
      'Vietnam arrivals rose strongly overall, while Japan declined across the period; Thailand dipped in 2020 then recovered.',
    series: [
      { label: 'Thailand', color: '#0f53c9', values: [25, 28, 32, 6, 18, 34] },
      { label: 'Japan', color: '#d97706', values: [32, 30, 27, 8, 15, 18] },
      { label: 'Vietnam', color: '#0d9488', values: [8, 12, 16, 3, 14, 30] }
    ]
  },
  {
    id: 'timeline-remote-work-office',
    number: 13,
    kind: 'timeline',
    chartType: 'line-graph',
    chartTypeLabel: 'Line Graph',
    title:
      'The graph below shows the percentage of employees working in an office and working remotely in one country between 2014 and 2024.',
    chartCaption: 'Office-based vs remote employees',
    subjectPhrase: 'the percentage of employees working in an office compared with those working remotely',
    unit: '% of employees',
    yAxisLabel: 'Percentage of employees (%)',
    valueLabel: 'Percentage',
    years: [...WRITING_TIMELINE_YEARS],
    values: [88, 85, 80, 42, 48, 55],
    mainTrend:
      'Office work declined sharply in 2020 while remote work rose, and hybrid patterns left remote work permanently higher than before.',
    series: [
      { label: 'Office-based', color: '#d97706', values: [88, 85, 80, 42, 48, 55] },
      { label: 'Remote', color: '#0f53c9', values: [12, 15, 20, 58, 52, 45] }
    ]
  },
  {
    id: 'timeline-book-ebook-sales',
    number: 14,
    kind: 'timeline',
    chartType: 'line-graph',
    chartTypeLabel: 'Line Graph',
    title:
      'The graph below shows sales of printed books and e-books in one country between 2014 and 2024.',
    chartCaption: 'Printed book vs e-book sales',
    subjectPhrase: 'sales of printed books and e-books',
    unit: 'million units',
    yAxisLabel: 'Sales (million units)',
    valueLabel: 'Sales',
    years: [...WRITING_TIMELINE_YEARS],
    values: [54, 50, 46, 40, 36, 34],
    mainTrend:
      'Printed book sales fell steadily, whereas e-book sales rose and overtook printed books around 2020.',
    series: [
      { label: 'Printed books', color: '#92400e', values: [54, 50, 46, 40, 36, 34] },
      { label: 'E-books', color: '#0d9488', values: [18, 26, 35, 44, 52, 58] }
    ]
  },
  {
    id: 'timeline-city-bike-share',
    number: 15,
    kind: 'timeline',
    chartType: 'bar-chart',
    chartTypeLabel: 'Bar Chart',
    title:
      'The chart below shows bike-share trips and short private-car trips in one city between 2014 and 2024.',
    chartCaption: 'Bike-share vs short private-car trips',
    subjectPhrase: 'bike-share trips compared with short private-car trips in one city',
    unit: 'million trips',
    yAxisLabel: 'Trips (millions)',
    valueLabel: 'Trips',
    years: [...WRITING_TIMELINE_YEARS],
    values: [2.1, 3.4, 5.2, 4.0, 6.8, 9.5],
    mainTrend:
      'Bike-share trips rose dramatically overall, while short private-car trips declined steadily.',
    series: [
      { label: 'Bike-share', color: '#0f53c9', values: [2.1, 3.4, 5.2, 4.0, 6.8, 9.5] },
      { label: 'Private-car short trips', color: '#d97706', values: [12.0, 11.2, 10.0, 8.5, 7.2, 5.8] }
    ]
  },
  {
    id: 'timeline-meat-plant-protein',
    number: 16,
    kind: 'timeline',
    chartType: 'table',
    chartTypeLabel: 'Table',
    title:
      'The table below shows average weekly spending on meat and plant-based protein in one country between 2014 and 2024.',
    chartCaption: 'Average weekly spend on meat vs plant-based protein',
    subjectPhrase: 'average weekly spending on meat and plant-based protein',
    unit: 'US dollars',
    yAxisLabel: 'Weekly spend (US$)',
    valueLabel: 'Spend',
    years: [...WRITING_TIMELINE_YEARS],
    values: [28, 27, 26, 25, 24, 23],
    mainTrend:
      'Meat spending declined slightly while plant-based protein spending increased rapidly from a low base.',
    series: [
      { label: 'Meat', color: '#b91c1c', values: [28, 27, 26, 25, 24, 23] },
      { label: 'Plant-based protein', color: '#0d9488', values: [2, 4, 7, 11, 16, 21] }
    ]
  },
  {
    id: 'timeline-rail-air-passengers',
    number: 17,
    kind: 'timeline',
    chartType: 'line-graph',
    chartTypeLabel: 'Line Graph',
    title:
      'The graph below shows the number of rail and air passengers in one country between 2014 and 2024.',
    chartCaption: 'Rail vs air passengers',
    subjectPhrase: 'the number of rail and air passengers',
    unit: 'million passengers',
    yAxisLabel: 'Passengers (millions)',
    valueLabel: 'Passengers',
    years: [...WRITING_TIMELINE_YEARS],
    values: [210, 225, 240, 95, 180, 255],
    mainTrend:
      'Rail passenger numbers rose overall despite a 2020 dip, while air travel declined across the period.',
    series: [
      { label: 'Rail', color: '#0f53c9', values: [210, 225, 240, 95, 180, 255] },
      { label: 'Air', color: '#d97706', values: [230, 210, 185, 60, 120, 150] }
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
          { label: 'Nuclear', value: 3, color: '#7c3aed' },
          { label: 'Other', value: 2, color: '#e2e8f0' }
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
    title: 'The charts below show how household waste was disposed of in a European city in 2008 and 2018.',
    chartCaption: 'Household waste by disposal method (2008 and 2018)',
    subjectPhrase: 'how household waste was disposed of across five methods in 2008 and 2018',
    unit: '% of household waste',
    valueLabel: 'Percentage',
    mainFeature:
      'Landfill took the largest share of household waste in 2008, whereas recycling had become the main disposal method by 2018.',
    pies: [
      {
        title: 'Household Waste 2008',
        slices: [
          { label: 'Landfill', value: 52, color: '#64748b' },
          { label: 'Recycled', value: 28, color: '#0d9488' },
          { label: 'Incinerated', value: 12, color: '#d97706' },
          { label: 'Composted', value: 5, color: '#0f53c9' },
          { label: 'Other', value: 3, color: '#e2e8f0' }
        ]
      },
      {
        title: 'Household Waste 2018',
        slices: [
          { label: 'Recycled', value: 45, color: '#0d9488' },
          { label: 'Landfill', value: 25, color: '#64748b' },
          { label: 'Composted', value: 18, color: '#0f53c9' },
          { label: 'Incinerated', value: 9, color: '#d97706' },
          { label: 'Other', value: 3, color: '#e2e8f0' }
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
    title: 'The chart below shows the number of visitors to five London museums in 2019 and 2023.',
    chartCaption: 'Average number of visitors to five London museums per month, 2019 vs 2023',
    subjectPhrase:
      'the average number of visitors per month to five London museums in 2019 and 2023',
    unit: 'thousand visitors per month',
    valueLabel: 'Number of visitors',
    mainFeature:
      'The British Museum drew the most visitors in both years, while the Science Museum received the fewest.',
    categories: ['British Museum', 'Natural History Museum', 'Tate Modern', 'V&A', 'Science Museum'],
    series: [
      { label: '2019', color: '#0f53c9', values: [195, 160, 130, 115, 105] },
      { label: '2023', color: '#d97706', values: [180, 145, 122, 108, 95] }
    ]
  },
  {
    id: 'snapshot-phone-brands',
    number: 7,
    kind: 'snapshot',
    chartType: 'pie-chart',
    chartTypeLabel: 'Pie Chart',
    title: 'The charts below show smartphone market share by brand in one country in 2020 and 2024.',
    chartCaption: 'Smartphone market share by brand, 2020 vs 2024',
    subjectPhrase: 'smartphone market share by brand in one country in 2020 and 2024',
    unit: '% of sales',
    valueLabel: 'Percentage',
    mainFeature:
      'Samsung led the market in 2020, whereas Apple had taken the largest share by 2024.',
    pies: [
      {
        title: 'Smartphone Market Share 2020',
        slices: [
          { label: 'Samsung', value: 32, color: '#0d9488' },
          { label: 'Apple', value: 26, color: '#0f53c9' },
          { label: 'Other', value: 19, color: '#e2e8f0' },
          { label: 'Oppo', value: 12, color: '#7c3aed' },
          { label: 'Xiaomi', value: 11, color: '#d97706' }
        ]
      },
      {
        title: 'Smartphone Market Share 2024',
        slices: [
          { label: 'Apple', value: 34, color: '#0f53c9' },
          { label: 'Samsung', value: 28, color: '#0d9488' },
          { label: 'Other', value: 15, color: '#e2e8f0' },
          { label: 'Xiaomi', value: 14, color: '#d97706' },
          { label: 'Oppo', value: 9, color: '#7c3aed' }
        ]
      }
    ]
  },
  {
    id: 'snapshot-student-majors',
    number: 8,
    kind: 'snapshot',
    chartType: 'bar-chart',
    chartTypeLabel: 'Bar Chart',
    title:
      'The chart below shows the percentage of university students enrolled in five majors in Japan and South Korea in 2023.',
    chartCaption: 'University enrolments by major, Japan vs South Korea (2023)',
    subjectPhrase:
      'the percentage of university students enrolled in five majors — engineering, business, medicine, arts, and education — in Japan and South Korea in 2023',
    unit: '% of students',
    valueLabel: 'Percentage',
    mainFeature:
      'Engineering made up the largest share of enrolments in South Korea, whereas business was the most popular major in Japan.',
    categories: ['Engineering', 'Business', 'Medicine', 'Arts', 'Education'],
    series: [
      { label: 'Japan', color: '#0f53c9', values: [18, 26, 12, 22, 14] },
      { label: 'South Korea', color: '#d97706', values: [30, 20, 16, 12, 10] }
    ]
  },
  {
    id: 'snapshot-commute-modes',
    number: 9,
    kind: 'snapshot',
    chartType: 'pie-chart',
    chartTypeLabel: 'Pie Chart',
    title:
      'The charts below show how workers in Singapore and Bangkok travelled to work in 2023.',
    chartCaption: 'Method of commuting to work, Singapore vs Bangkok (2023)',
    subjectPhrase:
      'the method of transport used by workers travelling to work in Singapore and Bangkok in 2023',
    unit: '% of workers',
    valueLabel: 'Percentage',
    mainFeature:
      'Public transport made up the majority of trips in Singapore, whereas private cars remained the main mode of commuting in Bangkok.',
    pies: [
      {
        title: 'Singapore 2023',
        slices: [
          { label: 'Public transport', value: 58, color: '#0f53c9' },
          { label: 'Private car', value: 22, color: '#d97706' },
          { label: 'Walk / cycle', value: 12, color: '#0d9488' },
          { label: 'Taxi', value: 5, color: '#7c3aed' },
          { label: 'Other', value: 3, color: '#e2e8f0' }
        ]
      },
      {
        title: 'Bangkok 2023',
        slices: [
          { label: 'Private car', value: 46, color: '#d97706' },
          { label: 'Public transport', value: 28, color: '#0f53c9' },
          { label: 'Motorbike', value: 18, color: '#7c3aed' },
          { label: 'Walk / cycle', value: 5, color: '#0d9488' },
          { label: 'Other', value: 3, color: '#e2e8f0' }
        ]
      }
    ]
  },
  {
    id: 'snapshot-hotel-ratings',
    number: 10,
    kind: 'snapshot',
    chartType: 'table',
    chartTypeLabel: 'Table',
    title:
      'The table below shows guest ratings for five hotels across four categories in 2024.',
    chartCaption: 'Guest ratings for five hotels (2024)',
    subjectPhrase:
      'guest ratings for five hotels across four categories: cleanliness, location, value for money, and staff service in 2024',
    unit: 'score out of 10',
    valueLabel: 'Score',
    mainFeature:
      'Hotel Orchid recorded the highest location score, while Budget Inn had the lowest ratings across almost every category.',
    tableHeaders: ['Cleanliness', 'Location', 'Value', 'Staff'],
    tableRows: [
      { entity: 'Grand Plaza', values: ['8.6', '8.2', '7.4', '8.8'] },
      { entity: 'Hotel Orchid', values: ['8.1', '9.2', '7.9', '8.4'] },
      { entity: 'City Lodge', values: ['7.5', '7.8', '8.3', '7.6'] },
      { entity: 'Sea Breeze', values: ['8.9', '8.5', '8.0', '8.7'] },
      { entity: 'Budget Inn', values: ['6.4', '6.8', '8.6', '6.9'] }
    ]
  },
  {
    id: 'snapshot-water-use',
    number: 11,
    kind: 'snapshot',
    chartType: 'bar-chart',
    chartTypeLabel: 'Bar Chart',
    title:
      'The chart below shows water use by sector in Australia and Canada in 2022.',
    chartCaption: 'Water use by sector, Australia vs Canada (2022)',
    subjectPhrase:
      'water use by four sectors — agriculture, industry, households, and energy — in Australia and Canada in 2022',
    unit: '% of total water use',
    valueLabel: 'Percentage',
    mainFeature:
      'Agriculture accounted for the vast majority of water use in Australia, whereas industry made up the largest share in Canada.',
    categories: ['Agriculture', 'Industry', 'Households', 'Energy', 'Services'],
    series: [
      { label: 'Australia', color: '#0d9488', values: [65, 18, 12, 5, 4] },
      { label: 'Canada', color: '#0f53c9', values: [28, 42, 18, 12, 8] }
    ]
  },
  {
    id: 'snapshot-food-delivery-apps',
    number: 12,
    kind: 'snapshot',
    chartType: 'pie-chart',
    chartTypeLabel: 'Pie Chart',
    title: 'The charts below show food-delivery app market share in one city in 2020 and 2024.',
    chartCaption: 'Food-delivery app market share, 2020 vs 2024',
    subjectPhrase: 'food-delivery app market share in one city in 2020 and 2024',
    unit: '% of orders',
    valueLabel: 'Percentage',
    mainFeature:
      'Foodpanda took the most orders in 2020, whereas GrabFood had the largest share by 2024.',
    pies: [
      {
        title: 'Food-delivery Market Share 2020',
        slices: [
          { label: 'Foodpanda', value: 34, color: '#d97706' },
          { label: 'GrabFood', value: 29, color: '#0d9488' },
          { label: 'Line Man', value: 15, color: '#0f53c9' },
          { label: 'Other', value: 14, color: '#e2e8f0' },
          { label: 'Robinhood', value: 8, color: '#7c3aed' }
        ]
      },
      {
        title: 'Food-delivery Market Share 2024',
        slices: [
          { label: 'GrabFood', value: 38, color: '#0d9488' },
          { label: 'Foodpanda', value: 27, color: '#d97706' },
          { label: 'Line Man', value: 18, color: '#0f53c9' },
          { label: 'Robinhood', value: 9, color: '#7c3aed' },
          { label: 'Other', value: 8, color: '#e2e8f0' }
        ]
      }
    ]
  },
  {
    id: 'snapshot-device-ownership',
    number: 13,
    kind: 'snapshot',
    chartType: 'bar-chart',
    chartTypeLabel: 'Bar Chart',
    title:
      'The chart below shows device ownership among adults in Sweden and Italy in 2023.',
    chartCaption: 'Device ownership, Sweden vs Italy (2023)',
    subjectPhrase:
      'the percentage of adults owning smartphones, laptops, tablets and smartwatches in Sweden and Italy in 2023',
    unit: '% of adults',
    valueLabel: 'Percentage',
    mainFeature:
      'Smartphone ownership was high in both countries, whereas smartwatch ownership remained the lowest category.',
    categories: ['Smartphone', 'Laptop', 'Tablet', 'Smart speaker', 'Smartwatch'],
    series: [
      { label: 'Sweden', color: '#0f53c9', values: [92, 78, 54, 36, 28] },
      { label: 'Italy', color: '#d97706', values: [88, 62, 41, 24, 18] }
    ]
  },
  {
    id: 'snapshot-energy-bills',
    number: 14,
    kind: 'snapshot',
    chartType: 'pie-chart',
    chartTypeLabel: 'Pie Chart',
    title:
      'The charts below show how households in France and Poland spent their energy bills in 2022.',
    chartCaption: 'Household energy bill breakdown, France vs Poland (2022)',
    subjectPhrase:
      'how households in France and Poland allocated spending across heating, electricity, cooking and other energy costs in 2022',
    unit: '% of energy bill',
    valueLabel: 'Percentage',
    mainFeature:
      'Heating made up the largest share of energy bills in Poland, whereas electricity accounted for the largest share in France.',
    pies: [
      {
        title: 'France 2022',
        slices: [
          { label: 'Electricity', value: 42, color: '#0f53c9' },
          { label: 'Heating', value: 34, color: '#d97706' },
          { label: 'Cooking', value: 14, color: '#0d9488' },
          { label: 'Hot water', value: 7, color: '#7c3aed' },
          { label: 'Other', value: 3, color: '#e2e8f0' }
        ]
      },
      {
        title: 'Poland 2022',
        slices: [
          { label: 'Heating', value: 48, color: '#d97706' },
          { label: 'Electricity', value: 30, color: '#0f53c9' },
          { label: 'Cooking', value: 12, color: '#0d9488' },
          { label: 'Hot water', value: 7, color: '#7c3aed' },
          { label: 'Other', value: 3, color: '#e2e8f0' }
        ]
      }
    ]
  },
  {
    id: 'snapshot-airport-scores',
    number: 15,
    kind: 'snapshot',
    chartType: 'table',
    chartTypeLabel: 'Table',
    title:
      'The table below shows passenger ratings for five airports across four categories in 2024.',
    chartCaption: 'Passenger ratings for five airports (2024)',
    subjectPhrase:
      'passenger ratings for five airports across four categories: cleanliness, shopping, security wait time and staff service in 2024',
    unit: 'score out of 10',
    valueLabel: 'Score',
    mainFeature:
      'Changi recorded the highest scores overall, while City West Airport had the weakest security and staff ratings.',
    tableHeaders: ['Cleanliness', 'Shopping', 'Security', 'Staff'],
    tableRows: [
      { entity: 'Changi', values: ['9.4', '9.1', '8.8', '9.2'] },
      { entity: 'Incheon', values: ['9.0', '8.6', '8.5', '8.9'] },
      { entity: 'Heathrow', values: ['8.2', '8.8', '7.4', '8.0'] },
      { entity: 'Suvarnabhumi', values: ['8.0', '7.9', '7.6', '8.1'] },
      { entity: 'City West', values: ['7.1', '6.8', '6.2', '6.9'] }
    ]
  },
  {
    id: 'snapshot-study-hours',
    number: 16,
    kind: 'snapshot',
    chartType: 'bar-chart',
    chartTypeLabel: 'Bar Chart',
    title:
      'The chart below shows average weekly study hours by subject among secondary students in Finland and Mexico in 2023.',
    chartCaption: 'Average weekly study hours by subject (2023)',
    subjectPhrase:
      'average weekly study hours for mathematics, science, languages and arts among secondary students in Finland and Mexico in 2023',
    unit: 'hours per week',
    valueLabel: 'Hours',
    mainFeature:
      'Mathematics took the most study time in Mexico, whereas languages accounted for a higher share of study hours in Finland.',
    categories: ['Mathematics', 'Science', 'Languages', 'History', 'Arts'],
    series: [
      { label: 'Finland', color: '#0f53c9', values: [4.5, 4.0, 5.5, 3.5, 3.0] },
      { label: 'Mexico', color: '#d97706', values: [6.5, 5.0, 3.5, 3.0, 2.0] }
    ]
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
      showGrid: false,
      zones: [
        { x: 4, y: 4, w: 88, h: 56, label: 'Open Land', color: '#d1fae5', style: 'park' },
        { x: 4, y: 64, w: 88, h: 16, label: 'Beach', color: '#fef3c7', style: 'park' }
      ],
      decor: [
        { kind: 'water', points: [[0, 55], [100, 55], [100, 80], [0, 80]], label: 'Sea', labelAt: [88, 72] },
        { kind: 'trees', positions: [[18, 20], [36, 28], [54, 18], [72, 30], [28, 44]] }
      ]
    },
    after: {
      year: 'After',
      zones: [
        { x: 4, y: 4, w: 26, h: 26, label: 'Reception', color: '#bfdbfe', style: 'building' },
        { x: 34, y: 4, w: 26, h: 26, label: 'Restaurant', color: '#fecaca', style: 'building' },
        { x: 64, y: 4, w: 28, h: 26, label: 'Guest\nHuts', color: '#fde68a', style: 'building' },
        { x: 4, y: 34, w: 56, h: 26, label: 'Open Land', color: '#d1fae5', style: 'park' },
        { x: 64, y: 34, w: 28, h: 26, label: 'Pier', color: '#c7d2fe', style: 'building' },
        { x: 4, y: 64, w: 88, h: 16, label: 'Beach', color: '#fef3c7', style: 'park' }
      ],
      decor: [
        { kind: 'water', points: [[0, 55], [100, 55], [100, 80], [0, 80]], label: 'Sea', labelAt: [88, 72] },
        { kind: 'trees', positions: [[12, 48], [22, 52], [48, 48]] }
      ],
      showGrid: false
    }
  },
  {
    id: 'map-grange-park',
    number: 3,
    kind: 'map',
    chartTypeLabel: 'Map',
    title: 'The maps below show Grange Park in 1920 and today.',
    chartCaption: 'Grange Park: 1920 and today',
    subjectPhrase: 'Grange Park in 1920 and today',
    mainFeature:
      'The rose garden and stage seating were replaced by a children’s play area and an amphitheatre, while a café and a new west entrance were added.',
    before: {
      year: '1920',
      showGrid: false,
      zones: [
        { x: 38, y: 28, w: 24, h: 20, label: 'Fountain', color: '#bfdbfe', style: 'water' },
        { x: 8, y: 22, w: 22, h: 32, label: 'Stage\n& seats', color: '#e2e8f0', style: 'building' },
        { x: 70, y: 22, w: 22, h: 32, label: 'Stage\n& seats', color: '#e2e8f0', style: 'building' },
        { x: 58, y: 56, w: 34, h: 18, label: 'Rose\ngarden', color: '#fecaca', style: 'park' },
        { x: 8, y: 56, w: 34, h: 18, label: 'Glasshouse', color: '#bbf7d0', style: 'building' },
        { x: 36, y: 72, w: 28, h: 6, label: 'Entrance', color: '#fde68a', style: 'building' }
      ],
      decor: [
        { kind: 'road', points: [[50, 78], [50, 100]], label: 'Arnold\nAvenue' },
        { kind: 'path', points: [[20, 38], [50, 38], [80, 38]] },
        { kind: 'path', points: [[50, 38], [50, 72]] },
        { kind: 'trees', positions: [[14, 14], [26, 12], [74, 12], [86, 14], [18, 68], [82, 68]] },
        { kind: 'label', x: 50, y: 8, text: 'Grange Park' }
      ]
    },
    after: {
      year: 'Today',
      showGrid: false,
      zones: [
        { x: 38, y: 28, w: 24, h: 20, label: 'Water\nfeature', color: '#bfdbfe', style: 'water' },
        { x: 8, y: 20, w: 24, h: 28, label: 'Café', color: '#fde68a', style: 'building' },
        { x: 66, y: 18, w: 26, h: 36, label: 'Amphi-\ntheatre', color: '#ddd6fe', style: 'sport' },
        { x: 58, y: 56, w: 34, h: 18, label: "Children's\nplay area", color: '#bbf7d0', style: 'sport' },
        { x: 8, y: 56, w: 34, h: 18, label: 'Glasshouse', color: '#bbf7d0', style: 'building' },
        { x: 2, y: 34, w: 6, h: 16, label: 'Ent.', color: '#fde68a', style: 'building' }
      ],
      decor: [
        { kind: 'road', points: [[0, 42], [8, 42]], label: 'Eldon St' },
        { kind: 'road', points: [[50, 78], [50, 100]], label: 'Arnold\nAvenue' },
        { kind: 'path', points: [[14, 42], [50, 42], [78, 36]] },
        { kind: 'path', points: [[50, 42], [50, 72]] },
        { kind: 'trees', positions: [[14, 14], [26, 12], [74, 12], [86, 14], [30, 68], [48, 70]] },
        { kind: 'label', x: 50, y: 8, text: 'Grange Park' }
      ]
    }
  },
  {
    id: 'map-riverside-village',
    number: 4,
    kind: 'map',
    chartTypeLabel: 'Map',
    title: 'The maps below show the village of Elmford in 1990 and in 2015.',
    chartCaption: 'Elmford village: 1990 and 2015',
    subjectPhrase: 'the village of Elmford in 1990 and 2015',
    mainFeature:
      'Farmland north of the river was replaced by housing, while a supermarket and a leisure centre were added beside the old shop.',
    before: {
      year: '1990',
      showGrid: false,
      zones: [
        { x: 6, y: 6, w: 52, h: 28, label: 'Farmland', color: '#d9f99d', style: 'farm' },
        { x: 8, y: 48, w: 28, h: 22, label: 'Houses', color: '#c7d2fe', style: 'building' },
        { x: 40, y: 52, w: 18, h: 14, label: 'Shop', color: '#fde68a', style: 'building' },
        { x: 62, y: 48, w: 12, h: 10, label: 'Bridge', color: '#e2e8f0', style: 'building' }
      ],
      decor: [
        { kind: 'water', points: [[58, 0], [100, 0], [100, 80], [72, 80], [60, 42], [58, 18]], label: 'River Lea', labelAt: [84, 40] },
        { kind: 'road', points: [[0, 58], [62, 58], [72, 54]], width: 3.2 },
        { kind: 'bridge', x: 60, y: 50, w: 14, h: 8, label: 'Bridge' },
        { kind: 'trees', positions: [[12, 40], [24, 38], [48, 36], [20, 74]] },
        { kind: 'label', x: 30, y: 44, text: 'Elmford' }
      ]
    },
    after: {
      year: '2015',
      showGrid: false,
      zones: [
        { x: 6, y: 6, w: 28, h: 26, label: 'Housing\nestate', color: '#c7d2fe', style: 'building' },
        { x: 36, y: 6, w: 22, h: 26, label: 'Housing\nestate', color: '#a5b4fc', style: 'building' },
        { x: 8, y: 48, w: 22, h: 20, label: 'Houses', color: '#c7d2fe', style: 'building' },
        { x: 34, y: 48, w: 20, h: 14, label: 'Super-\nmarket', color: '#fde68a', style: 'building' },
        { x: 34, y: 64, w: 20, h: 12, label: 'Leisure\ncentre', color: '#ddd6fe', style: 'sport' },
        { x: 62, y: 48, w: 12, h: 10, label: 'Bridge', color: '#e2e8f0', style: 'building' }
      ],
      decor: [
        { kind: 'water', points: [[58, 0], [100, 0], [100, 80], [72, 80], [60, 42], [58, 18]], label: 'River Lea', labelAt: [84, 40] },
        { kind: 'road', points: [[0, 58], [62, 58], [72, 54]], width: 3.2 },
        { kind: 'road', points: [[20, 32], [20, 58]], width: 2.4, label: 'New Rd' },
        { kind: 'bridge', x: 60, y: 50, w: 14, h: 8, label: 'Bridge' },
        { kind: 'trees', positions: [[14, 40], [48, 40], [20, 74]] },
        { kind: 'label', x: 30, y: 42, text: 'Elmford' }
      ]
    }
  },
  {
    id: 'map-school-campus',
    number: 5,
    kind: 'map',
    chartTypeLabel: 'Map',
    title: 'The maps below show a school campus in 2000 and in 2020.',
    chartCaption: 'School campus: 2000 and 2020',
    subjectPhrase: 'a school campus in 2000 and 2020',
    mainFeature:
      'The playground was replaced by a sports hall, the garden was transformed into a science block, and the car park was relocated to the west.',
    before: {
      year: '2000',
      showGrid: false,
      zones: [
        { x: 30, y: 28, w: 40, h: 26, label: 'Main\nbuilding', color: '#bfdbfe', style: 'building' },
        { x: 30, y: 6, w: 40, h: 18, label: 'Playground', color: '#bbf7d0', style: 'sport' },
        { x: 74, y: 28, w: 20, h: 26, label: 'Garden', color: '#d9f99d', style: 'park' },
        { x: 30, y: 58, w: 40, h: 16, label: 'Car park', color: '#e2e8f0', style: 'parking' }
      ],
      decor: [
        { kind: 'road', points: [[0, 66], [100, 66]], width: 3, label: 'School Rd' },
        { kind: 'path', points: [[50, 24], [50, 58]] },
        { kind: 'trees', positions: [[78, 20], [88, 24], [80, 48], [90, 52], [12, 20], [18, 40]] },
        { kind: 'label', x: 50, y: 78, text: 'School campus' }
      ]
    },
    after: {
      year: '2020',
      showGrid: false,
      zones: [
        { x: 30, y: 28, w: 40, h: 26, label: 'Main\nbuilding', color: '#bfdbfe', style: 'building' },
        { x: 30, y: 4, w: 40, h: 20, label: 'Sports\nhall', color: '#ddd6fe', style: 'sport' },
        { x: 74, y: 28, w: 20, h: 26, label: 'Science\nblock', color: '#fde68a', style: 'building' },
        { x: 4, y: 28, w: 20, h: 26, label: 'Car park', color: '#e2e8f0', style: 'parking' },
        { x: 30, y: 58, w: 24, h: 14, label: 'Library', color: '#c7d2fe', style: 'building' }
      ],
      decor: [
        { kind: 'road', points: [[0, 66], [100, 66]], width: 3, label: 'School Rd' },
        { kind: 'path', points: [[50, 24], [50, 58]] },
        { kind: 'path', points: [[24, 41], [30, 41]] },
        { kind: 'trees', positions: [[84, 18], [12, 18], [18, 58], [58, 74]] },
        { kind: 'label', x: 50, y: 78, text: 'School campus' }
      ]
    }
  },
  {
    id: 'map-hospital-site',
    number: 6,
    kind: 'map',
    chartTypeLabel: 'Map',
    title: 'The maps below show St Mary’s Hospital in 1985 and today.',
    chartCaption: "St Mary's Hospital: 1985 and today",
    subjectPhrase: "St Mary's Hospital in 1985 and today",
    mainFeature:
      'The staff car park was relocated to the west, an outpatient wing was added on the old car-park site, and gardens were expanded to the north.',
    before: {
      year: '1985',
      showGrid: false,
      zones: [
        { x: 28, y: 26, w: 36, h: 32, label: 'Main\nhospital', color: '#bfdbfe', style: 'building' },
        { x: 70, y: 28, w: 24, h: 28, label: 'Staff\ncar park', color: '#e2e8f0', style: 'parking' },
        { x: 28, y: 6, w: 36, h: 16, label: 'Gardens', color: '#bbf7d0', style: 'park' }
      ],
      decor: [
        { kind: 'road', points: [[0, 70], [100, 70]], width: 3.2, label: 'Hospital Rd' },
        { kind: 'path', points: [[46, 22], [46, 58], [46, 70]] },
        { kind: 'trees', positions: [[32, 12], [48, 10], [60, 12], [14, 40], [86, 58]] },
        { kind: 'label', x: 50, y: 78, text: "St Mary's Hospital" }
      ]
    },
    after: {
      year: 'Today',
      showGrid: false,
      zones: [
        { x: 28, y: 26, w: 36, h: 32, label: 'Main\nhospital', color: '#bfdbfe', style: 'building' },
        { x: 70, y: 26, w: 24, h: 32, label: 'Outpatient\nwing', color: '#fde68a', style: 'building' },
        { x: 4, y: 26, w: 20, h: 32, label: 'Staff\ncar park', color: '#e2e8f0', style: 'parking' },
        { x: 28, y: 4, w: 36, h: 18, label: 'Gardens', color: '#bbf7d0', style: 'park' },
        { x: 70, y: 4, w: 24, h: 18, label: 'Café&\ngarden', color: '#d9f99d', style: 'park' }
      ],
      decor: [
        { kind: 'road', points: [[0, 70], [100, 70]], width: 3.2, label: 'Hospital Rd' },
        { kind: 'path', points: [[46, 22], [46, 58], [46, 70]] },
        { kind: 'path', points: [[24, 42], [28, 42]] },
        { kind: 'path', points: [[64, 42], [70, 42]] },
        { kind: 'trees', positions: [[32, 10], [48, 8], [60, 10], [78, 10], [14, 20], [86, 58]] },
        { kind: 'label', x: 50, y: 78, text: "St Mary's Hospital" }
      ]
    }
  },
  {
    id: 'map-harbour-town',
    number: 7,
    kind: 'map',
    chartTypeLabel: 'Map',
    title: 'The maps below show the harbour of Porthaven in 1995 and in 2010.',
    chartCaption: 'Porthaven harbour: 1995 and 2010',
    subjectPhrase: 'the harbour of Porthaven in 1995 and 2010',
    mainFeature:
      'The fishing docks and fish market were demolished and replaced by a marina, hotel and shops, while a car park was added inland.',
    before: {
      year: '1995',
      showGrid: false,
      zones: [
        { x: 8, y: 40, w: 40, h: 22, label: 'Fishing\ndocks', color: '#94a3b8', style: 'building' },
        { x: 52, y: 42, w: 28, h: 18, label: 'Fish\nmarket', color: '#fde68a', style: 'building' },
        { x: 8, y: 8, w: 48, h: 24, label: 'Open land', color: '#d9f99d', style: 'farm' },
        { x: 60, y: 8, w: 28, h: 24, label: 'Ware-\nhouses', color: '#e2e8f0', style: 'building' }
      ],
      decor: [
        { kind: 'water', points: [[0, 58], [100, 58], [100, 80], [0, 80]], label: 'Harbour', labelAt: [78, 70] },
        { kind: 'road', points: [[0, 36], [100, 36]], width: 3, label: 'Quay Rd' },
        { kind: 'trees', positions: [[14, 14], [28, 18], [42, 12]] },
        { kind: 'label', x: 50, y: 30, text: 'Porthaven' }
      ]
    },
    after: {
      year: '2010',
      showGrid: false,
      zones: [
        { x: 8, y: 40, w: 40, h: 22, label: 'Marina', color: '#93c5fd', style: 'water' },
        { x: 52, y: 40, w: 20, h: 20, label: 'Hotel', color: '#ddd6fe', style: 'building' },
        { x: 74, y: 40, w: 18, h: 20, label: 'Shops', color: '#fde68a', style: 'building' },
        { x: 8, y: 8, w: 36, h: 24, label: 'Car park', color: '#e2e8f0', style: 'parking' },
        { x: 48, y: 8, w: 40, h: 24, label: 'Public\ngardens', color: '#bbf7d0', style: 'park' }
      ],
      decor: [
        { kind: 'water', points: [[0, 58], [100, 58], [100, 80], [0, 80]], label: 'Harbour', labelAt: [78, 70] },
        { kind: 'road', points: [[0, 36], [100, 36]], width: 3, label: 'Quay Rd' },
        { kind: 'path', points: [[26, 32], [26, 40]] },
        { kind: 'trees', positions: [[54, 14], [66, 18], [80, 12], [90, 20]] },
        { kind: 'label', x: 50, y: 30, text: 'Porthaven' }
      ]
    }
  },
  {
    id: 'map-city-library',
    number: 8,
    kind: 'map',
    chartTypeLabel: 'Map',
    title: 'The maps below show a city library in 2010 and in 2024.',
    chartCaption: 'City library layout: 2010 and 2024',
    subjectPhrase: 'a city library in 2010 and 2024',
    mainFeature:
      'The newspaper room and old storage area were removed, while a café, a children’s section and computer stations were added.',
    before: {
      year: '2010',
      zones: [
        { x: 6, y: 8, w: 42, h: 34, label: 'Reading\nhall', color: '#bfdbfe', style: 'building' },
        { x: 52, y: 8, w: 40, h: 34, label: 'Book\nshelves', color: '#bbf7d0', style: 'building' },
        { x: 6, y: 48, w: 28, h: 28, label: 'Newspaper\nroom', color: '#fde68a', style: 'building' },
        { x: 38, y: 48, w: 28, h: 28, label: 'Storage', color: '#e2e8f0', style: 'building' },
        { x: 70, y: 48, w: 22, h: 28, label: 'Office', color: '#ddd6fe', style: 'building' }
      ]
    },
    after: {
      year: '2024',
      zones: [
        { x: 6, y: 8, w: 34, h: 34, label: 'Reading\nhall', color: '#bfdbfe', style: 'building' },
        { x: 44, y: 8, w: 24, h: 34, label: 'Book\nshelves', color: '#bbf7d0', style: 'building' },
        { x: 72, y: 8, w: 20, h: 34, label: 'Computer\narea', color: '#a5b4fc', style: 'building' },
        { x: 6, y: 48, w: 28, h: 28, label: 'Café', color: '#fde68a', style: 'building' },
        { x: 38, y: 48, w: 28, h: 28, label: "Children's\nsection", color: '#fecaca', style: 'building' },
        { x: 70, y: 48, w: 22, h: 28, label: 'Office', color: '#ddd6fe', style: 'building' }
      ]
    }
  },
  {
    id: 'map-farm-site',
    number: 9,
    kind: 'map',
    chartTypeLabel: 'Map',
    title: 'The maps below show a farmland site in 1995 and after redevelopment in 2020.',
    chartCaption: 'Farmland redevelopment: 1995 and 2020',
    subjectPhrase: 'a farmland site in 1995 and after redevelopment in 2020',
    mainFeature:
      'Most of the fields were converted into housing and a shopping centre, while a park with a lake was created in the east.',
    before: {
      year: '1995',
      showGrid: false,
      zones: [
        { x: 6, y: 8, w: 40, h: 32, label: 'Crop\nfields', color: '#d9f99d', style: 'farm' },
        { x: 50, y: 8, w: 42, h: 32, label: 'Crop\nfields', color: '#bbf7d0', style: 'farm' },
        { x: 6, y: 46, w: 28, h: 28, label: 'Barn', color: '#fde68a', style: 'building' },
        { x: 38, y: 46, w: 28, h: 28, label: 'Farmhouse', color: '#bfdbfe', style: 'building' },
        { x: 70, y: 46, w: 22, h: 28, label: 'Track', color: '#e2e8f0', style: 'parking' }
      ],
      decor: [
        { kind: 'road', points: [[0, 42], [100, 42]], width: 2.5, label: 'Farm Rd' },
        { kind: 'trees', positions: [[12, 14], [80, 18], [88, 54]] }
      ]
    },
    after: {
      year: '2020',
      showGrid: false,
      zones: [
        { x: 6, y: 8, w: 34, h: 32, label: 'Housing', color: '#c7d2fe', style: 'building' },
        { x: 44, y: 8, w: 24, h: 32, label: 'Shopping\ncentre', color: '#fde68a', style: 'building' },
        { x: 72, y: 8, w: 20, h: 32, label: 'Park', color: '#bbf7d0', style: 'park' },
        { x: 6, y: 46, w: 40, h: 28, label: 'Housing', color: '#a5b4fc', style: 'building' },
        { x: 50, y: 46, w: 20, h: 28, label: 'Car park', color: '#e2e8f0', style: 'parking' },
        { x: 74, y: 46, w: 18, h: 28, label: 'Lake', color: '#93c5fd', style: 'water' }
      ],
      decor: [
        { kind: 'road', points: [[0, 42], [100, 42]], width: 3, label: 'Main Rd' },
        { kind: 'trees', positions: [[78, 14], [86, 22], [80, 58]] }
      ]
    }
  },
  {
    id: 'map-sports-centre',
    number: 10,
    kind: 'map',
    chartTypeLabel: 'Map',
    title: 'The maps below show a sports centre in 2005 and in 2025.',
    chartCaption: 'Sports centre: 2005 and 2025',
    subjectPhrase: 'a sports centre in 2005 and 2025',
    mainFeature:
      'The outdoor tennis courts were replaced by an indoor pool, and a gym with a café was added on the south side.',
    before: {
      year: '2005',
      zones: [
        { x: 8, y: 8, w: 50, h: 36, label: 'Main\nhall', color: '#bfdbfe', style: 'building' },
        { x: 62, y: 8, w: 30, h: 36, label: 'Tennis\ncourts', color: '#bbf7d0', style: 'sport' },
        { x: 8, y: 50, w: 40, h: 26, label: 'Changing\nrooms', color: '#e2e8f0', style: 'building' },
        { x: 52, y: 50, w: 40, h: 26, label: 'Car park', color: '#f1f5f9', style: 'parking' }
      ]
    },
    after: {
      year: '2025',
      zones: [
        { x: 8, y: 8, w: 40, h: 36, label: 'Main\nhall', color: '#bfdbfe', style: 'building' },
        { x: 52, y: 8, w: 40, h: 36, label: 'Indoor\npool', color: '#93c5fd', style: 'water' },
        { x: 8, y: 50, w: 28, h: 26, label: 'Changing\nrooms', color: '#e2e8f0', style: 'building' },
        { x: 40, y: 50, w: 26, h: 26, label: 'Gym', color: '#ddd6fe', style: 'sport' },
        { x: 70, y: 50, w: 22, h: 26, label: 'Café', color: '#fde68a', style: 'building' }
      ]
    }
  },
  {
    id: 'map-university-campus',
    number: 11,
    kind: 'map',
    chartTypeLabel: 'Map',
    title: 'The maps below show part of a university campus in 2000 and in 2020.',
    chartCaption: 'University campus: 2000 and 2020',
    subjectPhrase: 'part of a university campus in 2000 and 2020',
    mainFeature:
      'Student flats and a research lab were built on former open space, while the old canteen was expanded into a student hub.',
    before: {
      year: '2000',
      zones: [
        { x: 8, y: 8, w: 36, h: 30, label: 'Lecture\nhall', color: '#bfdbfe', style: 'building' },
        { x: 48, y: 8, w: 44, h: 30, label: 'Open\nspace', color: '#d1fae5', style: 'park' },
        { x: 8, y: 44, w: 28, h: 30, label: 'Canteen', color: '#fde68a', style: 'building' },
        { x: 40, y: 44, w: 28, h: 30, label: 'Library', color: '#c7d2fe', style: 'building' },
        { x: 72, y: 44, w: 20, h: 30, label: 'Car park', color: '#e2e8f0', style: 'parking' }
      ]
    },
    after: {
      year: '2020',
      zones: [
        { x: 8, y: 8, w: 28, h: 30, label: 'Lecture\nhall', color: '#bfdbfe', style: 'building' },
        { x: 40, y: 8, w: 26, h: 30, label: 'Student\nflats', color: '#a5b4fc', style: 'building' },
        { x: 70, y: 8, w: 22, h: 30, label: 'Research\nlab', color: '#fde68a', style: 'building' },
        { x: 8, y: 44, w: 34, h: 30, label: 'Student\nhub', color: '#fbcfe8', style: 'building' },
        { x: 46, y: 44, w: 26, h: 30, label: 'Library', color: '#c7d2fe', style: 'building' },
        { x: 76, y: 44, w: 16, h: 30, label: 'Bike\nshelter', color: '#bbf7d0', style: 'parking' }
      ]
    }
  },
  {
    id: 'map-seaside-village',
    number: 12,
    kind: 'map',
    chartTypeLabel: 'Map',
    title: 'The maps below show a seaside village in 1980 and today.',
    chartCaption: 'Seaside village: 1980 and today',
    subjectPhrase: 'a seaside village in 1980 and today',
    mainFeature:
      'Fishing docks were replaced by restaurants and a promenade, and holiday apartments replaced many of the original houses.',
    before: {
      year: '1980',
      showGrid: false,
      zones: [
        { x: 8, y: 8, w: 36, h: 28, label: 'Houses', color: '#c7d2fe', style: 'building' },
        { x: 48, y: 8, w: 28, h: 28, label: 'Shop', color: '#fde68a', style: 'building' },
        { x: 8, y: 42, w: 50, h: 18, label: 'Fishing\ndocks', color: '#94a3b8', style: 'building' },
        { x: 62, y: 42, w: 30, h: 18, label: 'Beach', color: '#fef3c7', style: 'park' }
      ],
      decor: [
        { kind: 'water', points: [[0, 62], [100, 62], [100, 80], [0, 80]], label: 'Sea', labelAt: [78, 72] },
        { kind: 'trees', positions: [[18, 16], [70, 14]] }
      ]
    },
    after: {
      year: 'Today',
      showGrid: false,
      zones: [
        { x: 8, y: 8, w: 28, h: 28, label: 'Holiday\napartments', color: '#a5b4fc', style: 'building' },
        { x: 40, y: 8, w: 24, h: 28, label: 'Hotel', color: '#ddd6fe', style: 'building' },
        { x: 68, y: 8, w: 24, h: 28, label: 'Shop', color: '#fde68a', style: 'building' },
        { x: 8, y: 42, w: 34, h: 18, label: 'Restaurants', color: '#fecaca', style: 'building' },
        { x: 46, y: 42, w: 20, h: 18, label: 'Promenade', color: '#e2e8f0', style: 'parking' },
        { x: 70, y: 42, w: 22, h: 18, label: 'Beach', color: '#fef3c7', style: 'park' }
      ],
      decor: [
        { kind: 'water', points: [[0, 62], [100, 62], [100, 80], [0, 80]], label: 'Sea', labelAt: [78, 72] },
        { kind: 'trees', positions: [[20, 18], [74, 16], [52, 50]] }
      ]
    }
  },
  {
    id: 'map-shopping-mall',
    number: 13,
    kind: 'map',
    chartTypeLabel: 'Map',
    title: 'The maps below show a shopping mall in 2012 and in 2024.',
    chartCaption: 'Shopping mall layout: 2012 and 2024',
    subjectPhrase: 'a shopping mall in 2012 and 2024',
    mainFeature:
      'A cinema and food court were added, while the outdoor car park was partly replaced by a multi-storey car park and a green roof garden.',
    before: {
      year: '2012',
      zones: [
        { x: 8, y: 8, w: 50, h: 36, label: 'Retail\nstores', color: '#bfdbfe', style: 'building' },
        { x: 62, y: 8, w: 30, h: 36, label: 'Department\nstore', color: '#c7d2fe', style: 'building' },
        { x: 8, y: 50, w: 84, h: 26, label: 'Outdoor\ncar park', color: '#e2e8f0', style: 'parking' }
      ]
    },
    after: {
      year: '2024',
      zones: [
        { x: 8, y: 8, w: 34, h: 28, label: 'Retail\nstores', color: '#bfdbfe', style: 'building' },
        { x: 46, y: 8, w: 22, h: 28, label: 'Cinema', color: '#ddd6fe', style: 'building' },
        { x: 72, y: 8, w: 20, h: 28, label: 'Department\nstore', color: '#c7d2fe', style: 'building' },
        { x: 8, y: 42, w: 34, h: 18, label: 'Food court', color: '#fde68a', style: 'building' },
        { x: 46, y: 42, w: 22, h: 18, label: 'Roof\ngarden', color: '#bbf7d0', style: 'park' },
        { x: 72, y: 42, w: 20, h: 34, label: 'Multi-storey\ncar park', color: '#e2e8f0', style: 'parking' },
        { x: 8, y: 64, w: 60, h: 12, label: 'Outdoor\nparking', color: '#f1f5f9', style: 'parking' }
      ]
    }
  },
  {
    id: 'map-train-station',
    number: 14,
    kind: 'map',
    chartTypeLabel: 'Map',
    title: 'The maps below show a train station in 2000 and in 2020.',
    chartCaption: 'Train station: 2000 and 2020',
    subjectPhrase: 'a train station in 2000 and 2020',
    mainFeature:
      'A new concourse and coffee shops replaced the old ticket hall, and bike parking was added beside the platforms.',
    before: {
      year: '2000',
      zones: [
        { x: 8, y: 8, w: 40, h: 30, label: 'Ticket\nhall', color: '#fde68a', style: 'building' },
        { x: 52, y: 8, w: 40, h: 30, label: 'Waiting\nroom', color: '#bfdbfe', style: 'building' },
        { x: 8, y: 46, w: 84, h: 28, label: 'Platforms', color: '#e2e8f0', style: 'building' }
      ]
    },
    after: {
      year: '2020',
      zones: [
        { x: 8, y: 8, w: 34, h: 30, label: 'Main\nconcourse', color: '#c7d2fe', style: 'building' },
        { x: 46, y: 8, w: 22, h: 30, label: 'Coffee\nshops', color: '#fde68a', style: 'building' },
        { x: 72, y: 8, w: 20, h: 30, label: 'Waiting\nroom', color: '#bfdbfe', style: 'building' },
        { x: 8, y: 46, w: 68, h: 28, label: 'Platforms', color: '#e2e8f0', style: 'building' },
        { x: 80, y: 46, w: 12, h: 28, label: 'Bike\nparking', color: '#bbf7d0', style: 'parking' }
      ]
    }
  },
  {
    id: 'map-zoo-site',
    number: 15,
    kind: 'map',
    chartTypeLabel: 'Map',
    title: 'The maps below show a zoo in 1990 and in 2015.',
    chartCaption: 'Zoo layout: 1990 and 2015',
    subjectPhrase: 'a zoo in 1990 and in 2015',
    mainFeature:
      'Small cages were replaced by larger wildlife habitats, and a visitor centre with a café was built near the entrance.',
    before: {
      year: '1990',
      showGrid: false,
      zones: [
        { x: 8, y: 8, w: 24, h: 28, label: 'Entrance', color: '#fde68a', style: 'building' },
        { x: 36, y: 8, w: 28, h: 28, label: 'Small\ncages', color: '#fecaca', style: 'building' },
        { x: 68, y: 8, w: 24, h: 28, label: 'Bird\nhouse', color: '#bfdbfe', style: 'building' },
        { x: 8, y: 44, w: 84, h: 30, label: 'Open\nyards', color: '#d9f99d', style: 'farm' }
      ],
      decor: [{ kind: 'trees', positions: [[18, 50], [50, 58], [80, 48]] }]
    },
    after: {
      year: '2015',
      showGrid: false,
      zones: [
        { x: 8, y: 8, w: 24, h: 22, label: 'Visitor\ncentre', color: '#c7d2fe', style: 'building' },
        { x: 36, y: 8, w: 20, h: 22, label: 'Café', color: '#fde68a', style: 'building' },
        { x: 60, y: 8, w: 32, h: 22, label: 'Bird\naviary', color: '#bfdbfe', style: 'building' },
        { x: 8, y: 36, w: 40, h: 38, label: 'Safari\nhabitat', color: '#bbf7d0', style: 'park' },
        { x: 52, y: 36, w: 40, h: 38, label: 'Wetland\nhabitat', color: '#93c5fd', style: 'water' }
      ],
      decor: [{ kind: 'trees', positions: [[16, 48], [30, 60], [70, 50], [84, 58]] }]
    }
  },
  {
    id: 'map-factory-site',
    number: 16,
    kind: 'map',
    chartTypeLabel: 'Map',
    title: 'The maps below show a factory site in 2005 and after conversion in 2022.',
    chartCaption: 'Factory conversion: 2005 and 2022',
    subjectPhrase: 'a factory site in 2005 and after conversion in 2022',
    mainFeature:
      'Warehouse buildings were converted into loft apartments and studios, while a riverside walkway replaced the loading bay.',
    before: {
      year: '2005',
      showGrid: false,
      zones: [
        { x: 8, y: 8, w: 40, h: 36, label: 'Factory\nbuilding', color: '#94a3b8', style: 'building' },
        { x: 52, y: 8, w: 40, h: 36, label: 'Warehouse', color: '#64748b', style: 'building' },
        { x: 8, y: 50, w: 84, h: 24, label: 'Loading\nbay', color: '#e2e8f0', style: 'parking' }
      ],
      decor: [
        { kind: 'water', points: [[0, 68], [100, 68], [100, 80], [0, 80]], label: 'River', labelAt: [80, 74] }
      ]
    },
    after: {
      year: '2022',
      showGrid: false,
      zones: [
        { x: 8, y: 8, w: 34, h: 36, label: 'Loft\napartments', color: '#c7d2fe', style: 'building' },
        { x: 46, y: 8, w: 24, h: 36, label: 'Art\nstudios', color: '#fde68a', style: 'building' },
        { x: 74, y: 8, w: 18, h: 36, label: 'Cafe &\nshop', color: '#fecaca', style: 'building' },
        { x: 8, y: 50, w: 84, h: 16, label: 'Riverside\nwalkway', color: '#bbf7d0', style: 'park' }
      ],
      decor: [
        { kind: 'water', points: [[0, 66], [100, 66], [100, 80], [0, 80]], label: 'River', labelAt: [80, 74] },
        { kind: 'trees', positions: [[20, 54], [50, 56], [80, 54]] }
      ]
    }
  },
  {
    id: 'map-community-centre',
    number: 17,
    kind: 'map',
    chartTypeLabel: 'Map',
    title: 'The maps below show a community centre in 1998 and today.',
    chartCaption: 'Community centre: 1998 and today',
    subjectPhrase: 'a community centre in 1998 and today',
    mainFeature:
      'A youth club and outdoor playground were added, and the old storage room became a multipurpose hall.',
    before: {
      year: '1998',
      zones: [
        { x: 10, y: 10, w: 40, h: 34, label: 'Main\nhall', color: '#bfdbfe', style: 'building' },
        { x: 54, y: 10, w: 36, h: 34, label: 'Office', color: '#e2e8f0', style: 'building' },
        { x: 10, y: 50, w: 40, h: 26, label: 'Storage', color: '#fde68a', style: 'building' },
        { x: 54, y: 50, w: 36, h: 26, label: 'Car park', color: '#f1f5f9', style: 'parking' }
      ]
    },
    after: {
      year: 'Today',
      zones: [
        { x: 10, y: 10, w: 34, h: 34, label: 'Main\nhall', color: '#bfdbfe', style: 'building' },
        { x: 48, y: 10, w: 20, h: 34, label: 'Youth\nclub', color: '#ddd6fe', style: 'building' },
        { x: 72, y: 10, w: 18, h: 34, label: 'Office', color: '#e2e8f0', style: 'building' },
        { x: 10, y: 50, w: 34, h: 26, label: 'Multipurpose\nhall', color: '#fde68a', style: 'building' },
        { x: 48, y: 50, w: 24, h: 26, label: 'Playground', color: '#bbf7d0', style: 'sport' },
        { x: 76, y: 50, w: 14, h: 26, label: 'Car park', color: '#f1f5f9', style: 'parking' }
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
      'Overall, it can be clearly observed that the process entails eight steps, starting from harvesting and culminating in packaging.',
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
  },
  {
    id: 'process-cheese-making',
    number: 3,
    kind: 'process',
    chartTypeLabel: 'Process Diagram',
    title: 'The diagram below shows how cheese is made from milk.',
    chartCaption: 'The cheese-making process',
    subjectPhrase: 'the process by which cheese is made from milk',
    mainFeature:
      'The process begins with the pasteurisation of milk and ends with the packaging of finished cheese, and it involves seven main stages.',
    stages: [
      { id: 'pasteurise', label: 'Pasteurisation', detail: 'Fresh milk is pasteurised to kill harmful bacteria.' },
      { id: 'culture', label: 'Adding culture', detail: 'Starter cultures and rennet are added to the warm milk.' },
      { id: 'curdle', label: 'Curdling', detail: 'The milk thickens and separates into curds and whey.' },
      { id: 'cut', label: 'Cutting', detail: 'The curds are cut into small pieces to release more whey.' },
      { id: 'press', label: 'Pressing', detail: 'The curds are pressed into moulds to form blocks of cheese.' },
      { id: 'age', label: 'Ageing', detail: 'The cheese is aged in controlled conditions for weeks or months.' },
      { id: 'pack', label: 'Packaging', detail: 'The matured cheese is packaged and sent to shops.' }
    ]
  },
  {
    id: 'process-brick-production',
    number: 4,
    kind: 'process',
    chartTypeLabel: 'Process Diagram',
    title: 'The diagram below shows how bricks are produced.',
    chartCaption: 'The brick production process',
    subjectPhrase: 'the process by which bricks are produced',
    mainFeature:
      'The process begins with the digging of clay and ends with the delivery of finished bricks, and it involves several main stages.',
    stages: [
      { id: 'dig', label: 'Digging', detail: 'Clay is dug from the ground and transported to a factory.' },
      { id: 'crush', label: 'Crushing', detail: 'The clay is crushed and mixed with sand and water.' },
      { id: 'mould', label: 'Moulding', detail: 'The mixture is pressed into brick-shaped moulds.' },
      { id: 'dry', label: 'Drying', detail: 'The soft bricks are dried for 24–48 hours.' },
      { id: 'fire', label: 'Firing', detail: 'The dried bricks are fired in a kiln at a high temperature.' },
      { id: 'cool', label: 'Cooling', detail: 'The bricks are cooled before being packaged.' },
      { id: 'deliver', label: 'Delivery', detail: 'Finished bricks are loaded onto trucks for delivery.' }
    ]
  },
  {
    id: 'process-bottled-water',
    number: 5,
    kind: 'process',
    chartTypeLabel: 'Process Diagram',
    title: 'The diagram below shows how bottled drinking water is produced.',
    chartCaption: 'The bottled water production process',
    subjectPhrase: 'the process by which bottled drinking water is produced',
    mainFeature:
      'The process begins with water collection and ends with sealing and labelling bottles for sale, across six main stages.',
    stages: [
      { id: 'collect', label: 'Collection', detail: 'Fresh water is collected from a spring or underground source.' },
      { id: 'filter', label: 'Filtration', detail: 'The water is filtered to remove impurities.' },
      { id: 'mineral', label: 'Mineral balance', detail: 'Minerals are adjusted to meet quality standards.' },
      { id: 'bottle', label: 'Bottling', detail: 'Clean bottles are filled with the treated water.' },
      { id: 'seal', label: 'Sealing', detail: 'Bottles are sealed and labelled.' },
      { id: 'store', label: 'Storage', detail: 'Finished bottles are stored before distribution.' }
    ]
  },
  {
    id: 'process-paper-recycling',
    number: 6,
    kind: 'process',
    chartTypeLabel: 'Process Diagram',
    title: 'The diagram below shows how waste paper is recycled.',
    chartCaption: 'The paper recycling process',
    subjectPhrase: 'the process by which waste paper is recycled',
    mainFeature:
      'The process begins with the collection of used paper and ends with the production of new paper products, and it involves seven main stages.',
    stages: [
      { id: 'collect', label: 'Collection', detail: 'Used paper is collected from homes and offices.' },
      { id: 'sort', label: 'Sorting', detail: 'The paper is sorted by type and quality.' },
      { id: 'pulp', label: 'Pulping', detail: 'Sorted paper is mixed with water to make pulp.' },
      { id: 'screen', label: 'Screening', detail: 'The pulp is screened to remove staples and glue.' },
      { id: 'deink', label: 'De-inking', detail: 'Ink is removed from the pulp.' },
      { id: 'bleach', label: 'Bleaching', detail: 'The pulp is cleaned and bleached if needed.' },
      { id: 'roll', label: 'Rolling', detail: 'New paper sheets are rolled, dried and cut.' }
    ]
  },
  {
    id: 'process-chocolate',
    number: 7,
    kind: 'process',
    chartTypeLabel: 'Process Diagram',
    title: 'The diagram below shows how chocolate is produced from cocoa beans.',
    chartCaption: 'The chocolate production process',
    subjectPhrase: 'the process by which chocolate is produced from cocoa beans',
    mainFeature:
      'The process begins with harvesting cocoa pods and ends with moulding finished chocolate bars, involving eight main stages.',
    stages: [
      { id: 'harvest', label: 'Harvesting', detail: 'Ripe cocoa pods are harvested from the trees.' },
      { id: 'ferment', label: 'Fermenting', detail: 'The beans are fermented for several days.' },
      { id: 'dry', label: 'Drying', detail: 'The beans are dried in the sun.' },
      { id: 'roast', label: 'Roasting', detail: 'The dried beans are roasted.' },
      { id: 'crack', label: 'Cracking', detail: 'The roasted beans are cracked to remove shells.' },
      { id: 'grind', label: 'Grinding', detail: 'Cocoa nibs are ground into a liquid mass.' },
      { id: 'mix', label: 'Mixing', detail: 'Sugar, milk and cocoa butter are mixed in.' },
      { id: 'mould', label: 'Moulding', detail: 'The mixture is moulded into bars and cooled.' }
    ]
  },
  {
    id: 'process-olive-oil',
    number: 8,
    kind: 'process',
    chartTypeLabel: 'Process Diagram',
    title: 'The diagram below shows how olive oil is produced.',
    chartCaption: 'The olive oil production process',
    subjectPhrase: 'the process by which olive oil is produced',
    mainFeature:
      'The process begins with harvesting olives and ends with bottling the finished oil, across six main stages.',
    stages: [
      { id: 'harvest', label: 'Harvesting', detail: 'Ripe olives are harvested from the trees.' },
      { id: 'wash', label: 'Washing', detail: 'The olives are washed to remove leaves and dirt.' },
      { id: 'crush', label: 'Crushing', detail: 'The olives are crushed into a paste.' },
      { id: 'press', label: 'Pressing', detail: 'The paste is pressed to extract olive oil.' },
      { id: 'separate', label: 'Separating', detail: 'Oil is separated from water and solids.' },
      { id: 'bottle', label: 'Bottling', detail: 'The olive oil is bottled and labelled.' }
    ]
  },
  {
    id: 'process-tea-production',
    number: 9,
    kind: 'process',
    chartTypeLabel: 'Process Diagram',
    title: 'The diagram below shows how black tea is produced.',
    chartCaption: 'The black tea production process',
    subjectPhrase: 'the process by which black tea is produced',
    mainFeature:
      'The process begins with plucking tea leaves and ends with packing dried tea, involving seven main stages.',
    stages: [
      { id: 'pluck', label: 'Plucking', detail: 'Young tea leaves are plucked by hand.' },
      { id: 'wither', label: 'Withering', detail: 'The leaves are withered to reduce moisture.' },
      { id: 'roll', label: 'Rolling', detail: 'The leaves are rolled to break cell walls.' },
      { id: 'oxidise', label: 'Oxidation', detail: 'The rolled leaves are left to oxidise.' },
      { id: 'dry', label: 'Drying', detail: 'The leaves are dried with hot air.' },
      { id: 'sort', label: 'Sorting', detail: 'Dried tea is sorted by grade.' },
      { id: 'pack', label: 'Packing', detail: 'The tea is packed into bags or boxes.' }
    ]
  },
  {
    id: 'process-glass-recycling',
    number: 10,
    kind: 'process',
    chartTypeLabel: 'Process Diagram',
    title: 'The diagram below shows how glass bottles are recycled.',
    chartCaption: 'The glass recycling process',
    subjectPhrase: 'the process by which glass bottles are recycled',
    mainFeature:
      'The process begins with collection of used bottles and ends with forming new glass products, across seven stages.',
    stages: [
      { id: 'collect', label: 'Collection', detail: 'Used glass bottles are collected from recycling points.' },
      { id: 'sort', label: 'Sorting', detail: 'Glass is sorted by colour.' },
      { id: 'wash', label: 'Washing', detail: 'The glass is washed and cleaned.' },
      { id: 'crush', label: 'Crushing', detail: 'Clean glass is crushed into cullet.' },
      { id: 'melt', label: 'Melting', detail: 'The cullet is melted in a furnace.' },
      { id: 'shape', label: 'Shaping', detail: 'Molten glass is shaped into new bottles.' },
      { id: 'cool', label: 'Cooling', detail: 'New bottles are cooled and checked.' }
    ]
  },
  {
    id: 'process-sugar-cane',
    number: 11,
    kind: 'process',
    chartTypeLabel: 'Process Diagram',
    title: 'The diagram below shows how sugar is produced from sugar cane.',
    chartCaption: 'The sugar cane production process',
    subjectPhrase: 'the process by which sugar is produced from sugar cane',
    mainFeature:
      'The process begins with harvesting sugar cane and ends with packaging refined sugar crystal, involving eight stages.',
    stages: [
      { id: 'harvest', label: 'Harvesting', detail: 'Sugar cane is harvested from the fields.' },
      { id: 'crush', label: 'Crushing', detail: 'The cane is crushed to extract juice.' },
      { id: 'filter', label: 'Filtering', detail: 'The juice is filtered to remove impurities.' },
      { id: 'boil', label: 'Boiling', detail: 'The juice is boiled to thicken it.' },
      { id: 'crystal', label: 'Crystallising', detail: 'Sugar crystals form as the syrup cools.' },
      { id: 'spin', label: 'Centrifuging', detail: 'Crystals are spun to remove molasses.' },
      { id: 'dry', label: 'Drying', detail: 'The sugar is dried.' },
      { id: 'pack', label: 'Packaging', detail: 'Refined sugar is packaged for sale.' }
    ]
  },
  {
    id: 'process-solar-panel',
    number: 12,
    kind: 'process',
    chartTypeLabel: 'Process Diagram',
    title: 'The diagram below shows how solar panels are manufactured.',
    chartCaption: 'The solar panel manufacturing process',
    subjectPhrase: 'the process by which solar panels are manufactured',
    mainFeature:
      'The process begins with purifying silicon and ends with assembling finished solar panels, across six main stages.',
    stages: [
      { id: 'purify', label: 'Purifying', detail: 'Silicon is purified for use in solar cells.' },
      { id: 'wafer', label: 'Wafer cutting', detail: 'Pure silicon is cut into thin wafers.' },
      { id: 'cell', label: 'Cell treatment', detail: 'Wafers are treated to form solar cells.' },
      { id: 'wire', label: 'Wiring', detail: 'Metal contacts are added to each cell.' },
      { id: 'assemble', label: 'Assembling', detail: 'Cells are assembled into a panel.' },
      { id: 'test', label: 'Testing', detail: 'Finished panels are tested and packaged.' }
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
        chips: ['build', 'construction', 'added', 'construct']
      },
      {
        id: 'remove',
        label: 'Destruction',
        chips: ['demolition', 'destroy', 'demolish', 'replaced', 'substituted']
      },
      {
        id: 'change',
        label: 'Transformation',
        chips: ['transform', 'change', 'repurpose', 'relocation', 'moved']
      },
      {
        id: 'transition',
        label: 'Transitions',
        chips: [
          'However',
          'In contrast',
          'On the other hand',
          'Likewise',
          'Similarly',
          'Surprisingly',
          'Interestingly',
          'It is interesting to note that'
        ]
      },
      {
        id: 'subordinator',
        label: 'Linkers',
        chips: ['while', 'whereas', 'although', 'despite the fact that']
      }
    ],
    structures: [
      {
        id: 'map-passive',
        label: 'Passive voice',
        template: 'The shopping mall was demolished and replaced by housing.',
        note: 'แผนที่ใช้ past passive เป็นหลัก — สิ่งปลูกสร้าง “ถูก” รื้อ / สร้าง / เปลี่ยน'
      },
      {
        id: 'map-ving',
        label: 'Subject + verb, V-ing',
        template: 'The open space was landscaped, creating a public park.',
        note: 'หลังคอมมาใช้ V-ing เพื่อบอกผลที่ตามมา'
      },
      {
        id: 'map-v3',
        label: 'Subject + verb, V3',
        template: 'The mall was demolished, replaced by residential housing.',
        note: 'หลังคอมมาใช้ past participle แบบย่อจาก passive'
      },
      {
        id: 'map-which',
        label: 'Subject + verb, which + verb',
        template: 'A civic centre was added, which was designed for families.',
        note: 'which ขยายคำนามที่เพิ่งกล่าวถึง'
      },
      {
        id: 'map-sub',
        label: 'while / whereas / although / despite the fact that',
        template: 'Housing was added in the north, whereas a tech park was built in the southwest.',
        note: 'ใช้ได้เฉพาะ while, whereas, although, despite the fact that'
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
      'เทียบแผนที่สองช่วงเวลาตามแบบแผนเดียว: Intro เปรียบ transformation จากปี…ถึงปี… · Overview ใช้ “a number of transformations can be observed, including the addition / demolition / transformation of …” · Body เปิดด้วย transition และจำกัด complex เหลือ 2 ต่อย่อหน้า',
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
  timeNote: '~18 นาที',
  questionType: 'Line Graph',
  questionTypeTh: 'Line Graph — แนวโน้มตามเวลา',
  promptText: 'The line graph below shows the percentage of adults who made at least one online purchase per month between 2014 and 2024.',
  segments: [
    {
      id: 't1-overview',
      labelTh: 'Overview — ภาพรวมหลัก (ต้องมีเสมอ)',
      text: 'The line graph compares the proportion of adults who shopped online at least once per month over a ten-year period from 2014 to 2024 across six measurements recorded at two-year intervals. While online shopping experienced a considerable and sustained upward trend overall, the most dramatic increase occurred between 2018 and 2020, followed by more moderate growth.',
      highlights: [
        {
          phrase: 'compares the proportion of',
          kind: 'vocabulary',
          labelTh: 'compares the proportion of (paraphrase)',
          descTh: 'ใช้ compares เป็น reporting verb หลักเพียงคำเดียวใน Introduction และตามด้วยข้อมูลที่กราฟนำมาเปรียบเทียบ',
          exampleTh: 'The chart compares the proportion of students who passed the exam.'
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
      text: 'In 2014, approximately 28% of adults made regular online purchases, representing the starting point shown. Between 2014 and 2018, the figure rose steadily to 51%, reaching 39% in 2016 and producing an overall increase of around 23 percentage points during the first four years.',
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
      text: 'The period between 2018 and 2020 saw the sharpest surge, pushing the percentage from 51% to 72% and producing a gain of 21 percentage points in only two years. Between 2020 and 2024, growth continued at a more moderate pace, climbing from 72% to 79% in 2022 and reaching a peak of 86% in 2024, which was more than three times the 2014 figure.',
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
