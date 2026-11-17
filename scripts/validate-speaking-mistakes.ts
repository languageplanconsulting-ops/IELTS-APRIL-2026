import assert from 'node:assert/strict'
import {
  SPEAKING_MISTAKE_TYPES,
  classifySpeakingMistake,
  cleanSpeechTranscript,
  isLikelyMishearing,
  normalizeMistakeType
} from '../server/speakingMistakeQuality.mjs'
import {
  HABIT_MAX_TYPES,
  SPEAKING_HABIT_RULES,
  buildHabitDrills,
  normalizeDrillAnswer
} from '../server/speakingHabits.mjs'

// Real cases from the Nov 2026 audit of 84 speaking reports.
const classify = (originalText: string, correctedText: string, label: string) =>
  classifySpeakingMistake({ errorTypeThai: label, originalText, correctedText })

// ── 1. the machine's errors are never the learner's ─────────────────────────────────────
assert.equal(classify('a koala shirt', 'a polo shirt', 'spelling'), null, 'Spelling is the transcript, not the speaker.')
assert.equal(classify('I can like.F my.', 'I can like my.', 'punctuation'), null, 'Punctuation is the transcript, not the speaker.')
assert.equal(classify('the regular closes', 'the regular clothes', 'word choice'), null, 'closes/clothes is a mishearing.')
assert.equal(classify('daily routine prays a crucial role', 'daily routine plays a crucial role', 'subject-verb agreement'), null)
assert.equal(classify('Dairy routines', 'daily routines', 'word choice'), null)
assert.equal(classify('I like their food', 'I like there food', 'pronoun'), null, 'Homophones can only be the transcript.')

// …but real grammar stays, even when the words look close.
assert.equal(classify('I buy a cloth', 'I buy clothes', 'plural'), 'plural')
assert.equal(classify('I see him yesterday', 'I saw him yesterday', 'tense'), 'tense', 'Irregular past is grammar.')
assert.equal(classify('economy recession', 'economic recession', 'word form'), 'word-form', 'Same word family is grammar.')
assert.equal(classify('the music has change a lot', 'the music has changed a lot', 'tense'), 'tense')
assert.equal(classify('in the weekend', 'on the weekend', 'preposition'), 'preposition', 'Function-word swaps are grammar.')
assert.equal(classify('English help me', 'English helps me', 'subject-verb agreement'), 'subject-verb')
assert.equal(isLikelyMishearing('I go there', 'I goes there'), false)

// Mixed labels still keep the real problem.
assert.equal(
  classify('Moreover.Dairy routines makes me sleep', 'Moreover, daily routines make me sleep', 'punctuation, spelling, subject-verb agreement'),
  'subject-verb'
)

// The change itself overrides a wrong label.
assert.equal(classify('my mom gave.', 'my mom gave it.', 'article'), 'missing-word')
assert.equal(classify('This call available', 'This call is available', 'sentence structure'), 'missing-word')
assert.equal(classify('per a year', 'per year', 'preposition'), 'article')

// ── 2. one fixed type per mistake ───────────────────────────────────────────────────────
assert.equal(normalizeMistakeType('article และ preposition'), 'article')
assert.equal(normalizeMistakeType('tense, plural'), 'tense')
assert.equal(normalizeMistakeType('subject-verb agreement'), 'subject-verb', 'Not mistaken for a plural problem.')
assert.equal(normalizeMistakeType('ประธานและกริยา'), 'subject-verb')
assert.equal(normalizeMistakeType('gerund'), 'verb-pattern')
assert.equal(normalizeMistakeType('missing subject'), 'missing-word')
assert.equal(normalizeMistakeType('word class'), 'word-form')
assert.equal(normalizeMistakeType('verb-pattern'), 'verb-pattern', 'A fixed key passes through.')
assert.equal(normalizeMistakeType('spelling'), 'transcription')
assert.equal(normalizeMistakeType('การเว้นวรรคและตัวพิมพ์ใหญ่'), 'transcription')
assert.equal(normalizeMistakeType('redundancy'), 'other')
assert.equal(normalizeMistakeType(''), 'other')
for (const key of Object.keys(SPEAKING_MISTAKE_TYPES)) {
  assert.ok(SPEAKING_MISTAKE_TYPES[key as keyof typeof SPEAKING_MISTAKE_TYPES], `${key} needs a label`)
}

// ── 3. glued full stops from the browser ────────────────────────────────────────────────
const cleaned = cleanSpeechTranscript('I think the music.Uh, has.Change a lot since.I was young')
assert.ok(!/[a-z]\.[A-Za-z]/.test(cleaned), `still glued: ${cleaned}`)
assert.equal(cleaned, 'I think the music uh, has change a lot since I was young')
assert.equal(cleanSpeechTranscript('I.I think so'), 'I I think so')
assert.equal(cleanSpeechTranscript('I live in the U.S. now'), 'I live in the U.S. now')
assert.equal(cleanSpeechTranscript('things like coffee, e.g. lattes'), 'things like coffee, e.g. lattes')
assert.equal(cleanSpeechTranscript('about 3.5 hours'), 'about 3.5 hours')
assert.equal(cleanSpeechTranscript('my gmail.com account'), 'my gmail.com account')
assert.equal(cleanSpeechTranscript('Yes,I do'), 'Yes, I do')
assert.equal(cleanSpeechTranscript(''), '')

// ── 4. habits ───────────────────────────────────────────────────────────────────────────
const m = (originalText: string, correctedText: string, errorType: string) => ({ originalText, correctedText, errorType, reasonThai: 'เหตุผล' })
const current = [
  m('work in international organization', 'work in an international organization', 'article'),
  m('buy a clothes', 'buy clothes', 'article'),
  m('in the Generation Y', 'in Generation Y', 'article'),
  m('people in nowadays', 'people nowadays', 'preposition'),
  m('English help me', 'English helps me', 'subject-verb'),
  m('last time I have a campaign', 'last time I had a campaign', 'tense')
]
const older = [
  [m('a clothes shop', 'a clothing shop', 'article'), m('perspective as global issues', 'perspective on global issues', 'preposition')],
  [m('in international company', 'in an international company', 'article'), m('people in nowadays', 'people nowadays', 'preposition')],
  // old free-text label is still understood
  [{ originalText: 'go to the school', correctedText: 'go to school', errorTypeThai: 'article และ plural' }],
  [m('English help me', 'English helps me', 'subject-verb')]
]
const habits = buildHabitDrills({ currentMistakes: current, previousReports: older })
assert.deepEqual(habits.map((habit) => habit.type), ['article', 'preposition'], 'Only types also in the last 2 reports.')
assert.equal(habits[0].seenInReports, 3, 'article: both of the last 2 reports + this one.')
assert.equal(habits[0].outOfReports, 3, 'Only the last 2 earlier reports are looked at.')
assert.equal(habits[0].drills.length, 1, 'One drill per habit (max 10 sentences to unlock).')
assert.equal(habits[0].drills[0].originalText, 'buy a clothes', 'Shortest sentence first.')
assert.ok(habits[0].ruleTh && habits[0].exampleWrong && habits[0].exampleRight && habits[0].label)
assert.equal(habits.find((habit) => habit.type === 'subject-verb'), undefined, 'Only in an older report (outside the last 2) → not a habit.')
assert.equal(habits.find((habit) => habit.type === 'tense'), undefined, 'Never seen before → not a habit.')

assert.deepEqual(
  buildHabitDrills({ currentMistakes: current, previousReports: [older[0]] }).map((habit) => habit.type),
  ['article', 'preposition'],
  'Made again in the very next report = a habit.'
)
assert.deepEqual(buildHabitDrills({ currentMistakes: current, previousReports: [] }), [], 'First report ever: nothing to repeat.')
assert.deepEqual(
  buildHabitDrills({ currentMistakes: current, previousReports: [[], [], older[3]] }),
  [],
  'A mistake only in the 3rd-newest report is too old to count.'
)
assert.deepEqual(buildHabitDrills({ currentMistakes: [], previousReports: older }), [])
assert.deepEqual(buildHabitDrills({ currentMistakes: undefined, previousReports: undefined }), [])

// Spelling "habits" never appear, even if every report had them.
const spellingOnly = [m('a koala shirt', 'a polo shirt', 'spelling')]
assert.deepEqual(buildHabitDrills({ currentMistakes: spellingOnly, previousReports: [spellingOnly, spellingOnly, spellingOnly] }), [])

// Never more than the cap.
const many = Object.keys(SPEAKING_HABIT_RULES).map((type) => m(`wrong sentence for ${type}`, `right sentence for ${type}`, type))
assert.ok(buildHabitDrills({ currentMistakes: many, previousReports: [many, many, many] }).length <= HABIT_MAX_TYPES)

// Every habit type has a rule and a real example pair.
for (const [type, rule] of Object.entries(SPEAKING_HABIT_RULES)) {
  assert.ok(SPEAKING_MISTAKE_TYPES[type as keyof typeof SPEAKING_MISTAKE_TYPES], `${type} must be a fixed type`)
  assert.ok(rule.ruleTh.length > 10 && rule.ruleTh.length < 220, `${type}: keep the rule short`)
  assert.notEqual(normalizeDrillAnswer(rule.exampleWrong), normalizeDrillAnswer(rule.exampleRight), `${type}: example must change`)
}

// The drill box ignores case, punctuation and spacing.
assert.equal(normalizeDrillAnswer('  Buy   Clothes! '), normalizeDrillAnswer('buy clothes'))
assert.equal(normalizeDrillAnswer('I’m 11 years older'), normalizeDrillAnswer("i'm 11 years older"))
assert.notEqual(normalizeDrillAnswer('buy a clothes'), normalizeDrillAnswer('buy clothes'))

console.log('Speaking mistake + habit validation passed.')
