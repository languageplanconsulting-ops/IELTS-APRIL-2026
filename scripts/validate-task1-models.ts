import {
  WRITING_MAP_PRACTICE_PROMPTS,
  WRITING_BAND7_TASK1_SAMPLE,
  WRITING_MIXED_PRACTICE_PROMPTS,
  WRITING_PROCESS_PRACTICE_PROMPTS,
  WRITING_SNAPSHOT_PRACTICE_PROMPTS,
  WRITING_TIMELINE_PRACTICE_PROMPTS
} from '../src/writingGuideData'
import { assembleGuidedEssay, getWritingGuidedBuilder } from '../src/writingGuidedBuilder'
import { WRITING_GUIDED_BUILDERS } from '../src/writingGuidedBuilder'
import { EXTRA_TASK1_GUIDED_BUILDERS } from '../src/writingTask1ExtraBuilders'
import { EXTRA_MAP_GUIDED_BUILDERS } from '../src/writingTask1MapExercises'
import { countIeltsWords, countTask1Paragraphs } from '../src/writingTask1WordCount'

const prompts = [
  ...WRITING_TIMELINE_PRACTICE_PROMPTS,
  ...WRITING_SNAPSHOT_PRACTICE_PROMPTS,
  ...WRITING_MIXED_PRACTICE_PROMPTS,
  ...WRITING_MAP_PRACTICE_PROMPTS,
  ...WRITING_PROCESS_PRACTICE_PROMPTS
]

const forbiddenTiming = [
  /from the midpoint onward/i,
  /from the midpoint onwards/i,
  /halfway through/i,
  /roughly halfway/i,
  /by the later year/i,
  /by the end of (?:the|this) (?:given )?period/i,
  /at the start of (?:the|this) (?:given )?period/i
]

const forbiddenComplexStructures = [
  /,\s+with\s+[^,.]{0,100}\b[\p{L}]+ing\b/giu,
  /,\s+(?:while|whereas|although)\b/gi,
  /\bso that\b/gi,
  /\bbefore\s+[\p{L}]+ing\b/giu,
  /;\s*/g
]

const sentenceCount = (text: string): number =>
  text
    .split(/[.!?]+(?=\s|$)/)
    .map((sentence) => sentence.trim())
    .filter(Boolean).length

const validComparisonOpening =
  /^(?:The (?:line graph|bar chart|pie chart|table|diagram) compares\b|The (?:(?:two )?pie charts|charts|maps|pie chart and line graph) compare\b)/
const forbiddenIntroReportingVerb = /\b(?:illustrat(?:e|es|ed|ing)|show(?:s|ed|ing)?)\b/i
const snapshotOverviewByPrompt: Record<string, string> = {
  'snapshot-vietnam-us-exports':
    'While coffee was the largest share of Vietnam’s exports to the US, aircraft parts were the largest share of US exports to Vietnam.',
  'snapshot-uk-thailand-spending':
    'While housing in the UK was the largest category, healthcare in Thailand was the smallest in share.',
  'snapshot-germany-australia-energy':
    'While renewables made up the largest share in Germany, coal accounted for the largest share in Australia.',
  'snapshot-universities-table':
    'While Oxford’s research output was the largest, Chulalongkorn’s was the smallest in share.',
  'snapshot-household-waste':
    'While non-recycled waste was the largest share in 2008, recycled waste was the largest share in 2018.',
  'snapshot-museum-visitors':
    'While the British Museum had the largest figure, the Science Museum was the smallest in share.',
  'snapshot-phone-brands': 'While Apple was the largest, Oppo was the smallest in share.',
  'snapshot-student-majors':
    'While engineering in South Korea was the largest, education in South Korea was the smallest in share.',
  'snapshot-commute-modes':
    'While public transport in Singapore was the largest in the first chart, private cars in Bangkok were the largest in the second chart.',
  'snapshot-hotel-ratings':
    'While Hotel Orchid for location was the largest, Budget Inn for cleanliness was the smallest in share.',
  'snapshot-water-use':
    'While agriculture in Australia was the largest, energy use in Australia was the smallest in share.',
  'snapshot-food-delivery-apps':
    'While GrabFood was the largest, smaller apps were the smallest in share.',
  'snapshot-device-ownership':
    'While smartphones in Sweden were the largest, smartwatches in Italy were the smallest in share.',
  'snapshot-energy-bills':
    'While electricity in France was the largest in the first chart, heating in Poland was the largest in the second chart.',
  'snapshot-airport-scores':
    'While Changi for cleanliness was the largest, City West for security was the smallest in share.',
  'snapshot-study-hours':
    'While mathematics in Mexico was the largest, arts in Mexico was the smallest in share.'
}
const pieBodyOpenings: Record<string, [string, string]> = {
  'snapshot-vietnam-us-exports': ['Starting with Vietnam’s exports to the US,', 'In terms of US exports to Vietnam,'],
  'snapshot-germany-australia-energy': ['Starting with Germany,', 'In terms of Australia,'],
  'snapshot-household-waste': ['Starting with 2008,', 'In terms of 2018,'],
  'snapshot-phone-brands': ['Starting with the leading brand,', 'In terms of the remaining brands,'],
  'snapshot-commute-modes': ['Starting with Singapore,', 'In terms of Bangkok,'],
  'snapshot-food-delivery-apps': ['Starting with the leading app,', 'In terms of the remaining apps,'],
  'snapshot-energy-bills': ['Starting with France,', 'In terms of Poland,']
}

const validateIntroduction = (
  label: string,
  introduction: string,
  failures: string[],
  kind?: string
) => {
  if (sentenceCount(introduction) !== 1) {
    failures.push(`${label}: introduction must contain exactly one sentence`)
  }
  if (kind === 'process') {
    if (label === 'process-instant-coffee') {
      if (
        !/^This chart shows the process of .+ from start to completion\.$/.test(introduction)
      ) {
        failures.push(
          `${label}: process introduction must be “This chart shows the process of … from start to completion.”`
        )
      }
      return
    }
    if (!validComparisonOpening.test(introduction)) {
      failures.push(`${label}: introduction must begin with “The [visual] compare/compares”`)
    }
    return
  }
  if (!validComparisonOpening.test(introduction)) {
    failures.push(`${label}: introduction must begin with “The [visual] compare/compares”`)
  }
  const forbidden = introduction.match(forbiddenIntroReportingVerb)?.[0]
  if (forbidden) {
    failures.push(`${label}: forbidden introduction reporting verb “${forbidden}”`)
  }
}

const failures: string[] = []
const seen = new Set<string>()
const allBuilders = [...WRITING_GUIDED_BUILDERS, ...EXTRA_MAP_GUIDED_BUILDERS, ...EXTRA_TASK1_GUIDED_BUILDERS]

for (const prompt of prompts) {
  if (seen.has(prompt.id)) failures.push(`${prompt.id}: duplicate prompt id`)
  seen.add(prompt.id)

  const exercise = getWritingGuidedBuilder(prompt.id)
  if (!exercise) {
    failures.push(`${prompt.id}: missing guided builder`)
    continue
  }
  const builderCount = allBuilders.filter((builder) => builder.promptId === prompt.id).length
  if (builderCount !== 1) failures.push(`${prompt.id}: expected one guided builder, found ${builderCount}`)

  const paragraphs = assembleGuidedEssay(exercise)
  const essay = paragraphs.map((paragraph) => paragraph.text).join(' ')
  const words = countTask1Paragraphs(paragraphs)
  if (words < 160 || words > 190) failures.push(`${prompt.id}: ${words} words (expected 160–190)`)
  const introduction = paragraphs.find((paragraph) => paragraph.role === 'intro')?.text ?? ''
  validateIntroduction(prompt.id, introduction, failures, prompt.kind)

  if (prompt.kind === 'process' && prompt.id === 'process-instant-coffee') {
    const overview = paragraphs.find((paragraph) => paragraph.role === 'overview')?.text ?? ''
    if (sentenceCount(overview) !== 1) {
      failures.push(`${prompt.id}: overview must contain exactly one sentence`)
    }
    if (
      !/^Overall, it can be clearly observed that the process entails .+ steps, starting from .+ and culminating in .+\.$/.test(
        overview
      )
    ) {
      failures.push(
        `${prompt.id}: overview must be “Overall, it can be clearly observed that the process entails … steps, starting from … and culminating in ….”`
      )
    }
  }

  for (const pattern of forbiddenTiming) {
    if (pattern.test(essay)) failures.push(`${prompt.id}: vague timing “${essay.match(pattern)?.[0]}”`)
  }

  if (prompt.kind === 'timeline' || prompt.kind === 'snapshot') {
    for (const pattern of forbiddenComplexStructures) {
      if (pattern.test(essay)) {
        failures.push(`${prompt.id}: forbidden complex structure “${essay.match(pattern)?.[0]}”`)
      }
      pattern.lastIndex = 0
    }
  }

  if (prompt.kind === 'timeline') {
    const bodyText = paragraphs
      .filter((paragraph) => paragraph.role === 'body1' || paragraph.role === 'body2')
      .map((paragraph) => paragraph.text)
      .join(' ')
    if (!prompt.years.some((year) => bodyText.includes(String(year)))) {
      failures.push(`${prompt.id}: timeline body does not state a chart year`)
    }
  }

  if (prompt.kind === 'snapshot') {
    const overview = paragraphs.find((paragraph) => paragraph.role === 'overview')?.text ?? ''
    const expectedOverview = snapshotOverviewByPrompt[prompt.id]
    if (overview !== expectedOverview) {
      failures.push(`${prompt.id}: overview must state only the taught largest/smallest features`)
    }
    if (sentenceCount(overview) !== 1) {
      failures.push(`${prompt.id}: overview must contain exactly one sentence`)
    }
    const forbiddenSnapshotPhrase = essay.match(/\bcontrasting(?:\s+with)?\b|\bleaving\s+other\s+sources\b/i)?.[0]
    if (forbiddenSnapshotPhrase) {
      failures.push(`${prompt.id}: forbidden No Timeline phrase “${forbiddenSnapshotPhrase}”`)
    }
    const requiredOpenings = pieBodyOpenings[prompt.id]
    if (requiredOpenings) {
      const body1 = paragraphs.find((paragraph) => paragraph.role === 'body1')?.text ?? ''
      const body2 = paragraphs.find((paragraph) => paragraph.role === 'body2')?.text ?? ''
      if (!body1.startsWith(requiredOpenings[0])) {
        failures.push(`${prompt.id}: pie-chart Body 1 must begin “${requiredOpenings[0]}”`)
      }
      if (!body2.startsWith(requiredOpenings[1])) {
        failures.push(`${prompt.id}: pie-chart Body 2 must begin “${requiredOpenings[1]}”`)
      }
    }
  }

  if (prompt.kind === 'map') {
    const body1 = paragraphs.find((paragraph) => paragraph.role === 'body1')?.text ?? ''
    const body2 = paragraphs.find((paragraph) => paragraph.role === 'body2')?.text ?? ''
    if (!/^Starting with the (?:northern|western) part of the map\b/.test(body1)) {
      failures.push(
        `${prompt.id}: map Body 1 must begin “Starting with the northern/western part of the map”`
      )
    }
    if (!/^In terms of the (?:eastern side|eastern section|southern section) of the map\b/.test(body2)) {
      failures.push(
        `${prompt.id}: map Body 2 must begin “In terms of the eastern side/section or southern section of the map”`
      )
    }
    const blanksByRole = Object.fromEntries(
      exercise.steps.map((step) => [
        step.role,
        step.segments.filter((segment) => segment.kind === 'blank').length
      ])
    )
    if ((blanksByRole.body1 ?? 0) < 9) {
      failures.push(`${prompt.id}: map Body 1 must have at least 9 questions`)
    }
    if ((blanksByRole.body2 ?? 0) < 9) {
      failures.push(`${prompt.id}: map Body 2 must have at least 9 questions`)
    }
    if ((blanksByRole.intro ?? 0) < 6) {
      failures.push(`${prompt.id}: map introduction must have at least 6 questions`)
    }
    if ((blanksByRole.overview ?? 0) < 7) {
      failures.push(`${prompt.id}: map overview must have at least 7 questions`)
    }
  }
}

const sampleText = WRITING_BAND7_TASK1_SAMPLE.segments.map((segment) => segment.text).join(' ')
const sampleIntroduction = sampleText.match(/^[^.!?]+[.!?]/)?.[0] ?? ''
validateIntroduction('Band 7 Task 1 sample', sampleIntroduction, failures)
const sampleWords = countIeltsWords(sampleText)
if (sampleWords < 160 || sampleWords > 190) {
  failures.push(`Band 7 Task 1 sample: ${sampleWords} words (expected 160–190)`)
}
for (const pattern of forbiddenTiming) {
  if (pattern.test(sampleText)) failures.push(`Band 7 Task 1 sample: vague timing “${sampleText.match(pattern)?.[0]}”`)
}
for (const pattern of forbiddenComplexStructures) {
  if (pattern.test(sampleText)) {
    failures.push(`Band 7 Task 1 sample: forbidden complex structure “${sampleText.match(pattern)?.[0]}”`)
  }
  pattern.lastIndex = 0
}

if (failures.length) {
  console.error(`Task 1 validation failed (${failures.length} issue${failures.length === 1 ? '' : 's'}):`)
  failures.forEach((failure) => console.error(`- ${failure}`))
  process.exit(1)
}

console.log(`Task 1 validation passed: ${prompts.length} model answers, all 160–190 words.`)
