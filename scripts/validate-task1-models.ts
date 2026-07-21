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
  /,\s+(?:whereas|although)\b/gi,
  /\bso that\b/gi,
  /\bbefore\s+[\p{L}]+ing\b/giu,
  /;\s*/g
]

/**
 * SOP (CLAUDE.md): in timeline / snapshot / map bodies, every sentence AFTER the
 * paragraph's taught opener must start with one of these — and nothing else.
 */
const APPROVED_BODY_TRANSITIONS = [
  'However',
  'On the other hand',
  'In contrast',
  'Likewise',
  'Similarly',
  'Interestingly',
  'Surprisingly',
  'It is interesting to note that'
]

const splitSentences = (text: string): string[] =>
  text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)

const validateBodyTransitions = (label: string, paragraphs: { role: string; text: string }[], failures: string[]) => {
  for (const paragraph of paragraphs) {
    if (paragraph.role !== 'body1' && paragraph.role !== 'body2') continue
    splitSentences(paragraph.text).forEach((sentence, index) => {
      if (index === 0) return // Body 1 "Starting with …" / Body 2 "In terms of …"
      const approved = APPROVED_BODY_TRANSITIONS.some(
        (transition) => sentence === transition || sentence.startsWith(`${transition} `) || sentence.startsWith(`${transition},`)
      )
      if (!approved) {
        failures.push(
          `${label}: body sentence must start with an approved transition (got “${sentence.split(/[\s,]+/).slice(0, 3).join(' ')}…”)`
        )
      }
    })
  }
}

const sentenceCount = (text: string): number =>
  text
    .split(/[.!?]+(?=\s|$)/)
    .map((sentence) => sentence.trim())
    .filter(Boolean).length

const validComparisonOpening =
  /^(?:The (?:line graph|bar chart|pie chart|table|diagram) compares\b|The (?:(?:two )?pie charts|charts|maps|pie chart and line graph) compare\b)/
const forbiddenIntroReportingVerb = /\b(?:illustrat(?:e|es|ed|ing)|show(?:s|ed|ing)?)\b/i
/**
 * SOP (CLAUDE.md): the Introduction is one sentence with no trailing filler
 * clause (no "presenting …", "allowing … to be identified", "highlighting …").
 * No legitimate introduction uses a ", …ing" tail, so this catches the class.
 */
const forbiddenIntroFillerClause = /,\s*[a-z]+ing\b[^.]*$/i
const snapshotOverviewByPrompt: Record<string, string> = {
  'snapshot-vietnam-us-exports':
    'Overall, it can be clearly observed that coffee was the largest share of Vietnam’s exports to the US, while aircraft parts were the largest share of US exports to Vietnam.',
  'snapshot-uk-thailand-spending':
    'Overall, it can be clearly observed that housing in the UK was the largest, while healthcare in Thailand was the smallest in share.',
  'snapshot-germany-australia-energy':
    'Overall, it can be clearly observed that renewable energy was the largest in the first chart, while coal was the largest in the second chart.',
  'snapshot-universities-table':
    'Overall, it can be clearly observed that Oxford’s research output was the largest, while Chulalongkorn’s was the smallest in share.',
  'snapshot-household-waste':
    'Overall, it can be clearly observed that landfill was the largest in the first chart, while recycled waste was the largest in the second chart.',
  'snapshot-museum-visitors':
    'Overall, it can be clearly observed that the British Museum in 2019 was the largest, while the Science Museum in 2023 was the smallest in share.',
  'snapshot-phone-brands':
    'Overall, it can be clearly observed that Samsung was the largest in the first chart, while Apple was the largest in the second chart.',
  'snapshot-student-majors':
    'Overall, it can be clearly observed that engineering in South Korea was the largest, while education in South Korea was the smallest in share.',
  'snapshot-commute-modes':
    'Overall, it can be clearly observed that public transport in Singapore was the largest in the first chart, while private cars in Bangkok were the largest in the second chart.',
  'snapshot-hotel-ratings':
    'Overall, it can be clearly observed that Hotel Orchid for location was the largest, while Budget Inn for cleanliness was the smallest in share.',
  'snapshot-water-use':
    'Overall, it can be clearly observed that agriculture in Australia was the largest, while energy use in Australia was the smallest in share.',
  'snapshot-food-delivery-apps':
    'Overall, it can be clearly observed that Foodpanda was the largest in the first chart, while GrabFood was the largest in the second chart.',
  'snapshot-device-ownership':
    'Overall, it can be clearly observed that smartphones in Sweden were the largest, while smartwatches in Italy were the smallest in share.',
  'snapshot-energy-bills':
    'Overall, it can be clearly observed that electricity in France was the largest in the first chart, while heating in Poland was the largest in the second chart.',
  'snapshot-airport-scores':
    'Overall, it can be clearly observed that Changi for cleanliness was the largest, while City West for security was the smallest in share.',
  'snapshot-study-hours':
    'Overall, it can be clearly observed that mathematics in Mexico was the largest, while arts in Mexico was the smallest in share.'
}
const pieBodyOpenings: Record<string, [string, string]> = {
  'snapshot-vietnam-us-exports': ['Starting with Vietnam’s exports to the US,', 'In terms of US exports to Vietnam,'],
  'snapshot-germany-australia-energy': ['Starting with Germany,', 'In terms of Australia,'],
  'snapshot-household-waste': ['Starting with 2008,', 'In terms of 2018,'],
  'snapshot-phone-brands': ['Starting with 2020,', 'In terms of 2024,'],
  'snapshot-commute-modes': ['Starting with Singapore,', 'In terms of Bangkok,'],
  'snapshot-food-delivery-apps': ['Starting with 2020,', 'In terms of 2024,'],
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
  const fillerClause = introduction.match(forbiddenIntroFillerClause)?.[0]
  if (fillerClause) {
    failures.push(`${label}: introduction must not have a trailing filler clause “${fillerClause.trim()}”`)
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
  if (words < 150 || words > 190) failures.push(`${prompt.id}: ${words} words (expected 150–190)`)
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
    // The taught Overview frame is "Overall, it can be clearly observed that X, while Y",
    // so ", while" is required there; the ban still applies to the rest of the essay.
    const essayOutsideOverview = paragraphs
      .filter((paragraph) => paragraph.role !== 'overview')
      .map((paragraph) => paragraph.text)
      .join(' ')
    for (const pattern of forbiddenComplexStructures) {
      if (pattern.test(essayOutsideOverview)) {
        failures.push(`${prompt.id}: forbidden complex structure “${essayOutsideOverview.match(pattern)?.[0]}”`)
      }
      pattern.lastIndex = 0
    }
  }

  if (prompt.kind === 'timeline' || prompt.kind === 'snapshot' || prompt.kind === 'map') {
    validateBodyTransitions(prompt.id, paragraphs, failures)
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

    // Subjects wear the metric / a data-typed quantity phrase, and later figures
    // are referenced — never restated. "share(s)" and "the quantity of" belong to
    // neither; "share" lives only in the Overview's "… in share".
    const bodyText = paragraphs
      .filter((paragraph) => paragraph.role === 'body1' || paragraph.role === 'body2')
      .map((paragraph) => paragraph.text)
      .join(' ')
    const bannedSubject = bodyText.match(/\bshares\b|\bthe shares? for\b|\bthe quantity of\b/i)?.[0]
    if (bannedSubject) {
      failures.push(
        `${prompt.id}: snapshot body must not use “${bannedSubject}” — name figures with “the figure for …” / “that of …”`
      )
    }
    // The multi-indicator universities table compares named institutions, not a
    // single measured quantity, so it keeps its own subject shape.
    const referenceExempt = prompt.id === 'snapshot-universities-table'
    if (!referenceExempt) {
      for (const role of ['body1', 'body2'] as const) {
        const roleText = paragraphs.find((paragraph) => paragraph.role === role)?.text ?? ''
        if (!/the figures? for /.test(roleText)) {
          failures.push(
            `${prompt.id}: ${role} must reference at least one figure with “the figure(s) for …”`
          )
        }
      }
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

console.log(`Task 1 validation passed: ${prompts.length} model answers, all 150–190 words.`)
