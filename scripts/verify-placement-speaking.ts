/**
 * The teacher's placement speaking ladder, case by case.
 *
 * Each case below is one rule as it was dictated. If a rule and the code
 * disagree, the rule wins — fix `src/placementSpeakingBand.ts`, not this file.
 */
import {
  scorePlacementSpeaking,
  type PlacementSpeakingBandKey,
  type PlacementSpeakingSignals
} from '../src/placementSpeakingBand'

/** A clean, long, well-organised answer set — every case below varies from this. */
const CLEAN: PlacementSpeakingSignals = {
  tenseErrorCount: 0,
  articleErrorCount: 0,
  usedPastTense: true,
  pastTenseCorrect: true,
  vocabularyErrorCount: 0,
  transitionsUsed: ['because', 'however'],
  ideasOrganised: true,
  b2c1Collocations: [],
  sentenceCountsPerQuestion: [4, 4, 4, 4]
}

const CASES: Array<{ rule: string; signals: PlacementSpeakingSignals; expect: PlacementSpeakingBandKey }> = [
  {
    rule: 'present/past simple mistakes → 5.5-6.0',
    signals: { ...CLEAN, tenseErrorCount: 2 },
    expect: '5.5-6'
  },
  {
    rule: 'article mistakes → 5.5-6.0',
    signals: { ...CLEAN, articleErrorCount: 1 },
    expect: '5.5-6'
  },
  {
    rule: 'no mistakes but no past tense → 6.0',
    signals: { ...CLEAN, usedPastTense: false, pastTenseCorrect: false },
    expect: '6'
  },
  {
    rule: 'no mistakes but no transitions / ideas not organised → 6.0-6.5',
    signals: { ...CLEAN, transitionsUsed: [], ideasOrganised: false },
    expect: '6-6.5'
  },
  {
    rule: '1-3 vocabulary mistakes → 6.0',
    signals: { ...CLEAN, vocabularyErrorCount: 3 },
    expect: '6'
  },
  {
    rule: '4+ vocabulary mistakes → below 5.5',
    signals: { ...CLEAN, vocabularyErrorCount: 4 },
    expect: 'below5.5'
  },
  {
    rule: 'answer shorter than 4 sentences → capped at 6.5',
    signals: { ...CLEAN, sentenceCountsPerQuestion: [4, 3, 4, 4], b2c1Collocations: Array(8).fill('strike a balance') },
    expect: '6.5'
  },
  {
    rule: '6.5 = clean grammar, correct past tense, mostly simple vocabulary',
    signals: { ...CLEAN, b2c1Collocations: ['strike a balance'] },
    expect: '6.5'
  },
  {
    rule: '7+ = more than 4 sentences per answer and more than 5 B2-C1 collocations',
    signals: {
      ...CLEAN,
      sentenceCountsPerQuestion: [5, 5, 6, 5],
      b2c1Collocations: [
        'strike a balance',
        'a steep learning curve',
        'hugely rewarding',
        'take something for granted',
        'a knock-on effect',
        'bear the brunt'
      ]
    },
    expect: '7plus'
  },
  {
    rule: 'long answers but only 5 collocations stay at 6.5',
    signals: {
      ...CLEAN,
      sentenceCountsPerQuestion: [5, 5, 5, 5],
      b2c1Collocations: ['a', 'b', 'c', 'd', 'e']
    },
    expect: '6.5'
  },
  {
    rule: 'lowest rule wins: tense errors outrank a long, collocation-rich answer',
    signals: {
      ...CLEAN,
      tenseErrorCount: 1,
      sentenceCountsPerQuestion: [6, 6, 6, 6],
      b2c1Collocations: Array(9).fill('bear the brunt')
    },
    expect: '5.5-6'
  }
]

let failures = 0
for (const testCase of CASES) {
  const result = scorePlacementSpeaking(testCase.signals)
  if (result.bandKey === testCase.expect) {
    console.log(`  ok   ${testCase.rule} → ${result.bandLabel}`)
  } else {
    failures += 1
    console.error(`  FAIL ${testCase.rule}\n       expected ${testCase.expect}, got ${result.bandKey}`)
  }
}

if (failures > 0) {
  console.error(`\n${failures} placement speaking rule(s) broken.`)
  process.exit(1)
}
console.log(`\nAll ${CASES.length} placement speaking rules hold.`)
