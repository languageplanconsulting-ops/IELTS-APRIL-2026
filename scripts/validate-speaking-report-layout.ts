import assert from 'node:assert/strict'
import {
  alignMistakeCount,
  buildMishearingReport,
  cleanTickEvidence,
  createChecklistDeduper,
  describeTarget,
  filterVocabAgainstMistakes,
  groupMistakes,
  isErrorAllowanceTick,
  pickTopFixes,
  reportMistakeType,
  segmentAnswerWithMistakes
} from '../src/speakingReportLayout'

// Real mistakes from a Nov 2026 Part 2 report ("Describe a person that you think is very interesting").
const mistakes = [
  { originalText: 'he named Ceiling', correctedText: 'named Ceiling', errorTypeThai: 'passive voice' },
  { originalText: 'we have not in touch', correctedText: 'we have not been in touch', errorTypeThai: 'verb form' },
  { originalText: 'I and him', correctedText: 'he and I', errorTypeThai: 'pronoun' },
  { originalText: 'a opportunity', correctedText: 'an opportunity', errorTypeThai: 'article' },
  { originalText: 'The topic we talk', correctedText: 'The topic we talk about', errorTypeThai: 'preposition' },
  { originalText: 'economy recession', correctedText: 'economic recession', errorTypeThai: 'word form' },
  { originalText: 'Middle East war crisis', correctedText: 'the Middle East war crisis', errorTypeThai: 'article' },
  { originalText: 'is make me', correctedText: 'is what makes me', errorTypeThai: 'verb pattern' },
  { originalText: 'at different major', correctedText: 'in different majors', errorTypeThai: 'preposition' },
  { originalText: 'to preparing', correctedText: 'to prepare', errorTypeThai: 'verb form' }
]

// ── types: old free-text labels and new fixed keys map to the same thing ───────────────────
assert.equal(reportMistakeType({ errorTypeThai: 'passive voice' }), 'verb-pattern')
assert.equal(reportMistakeType({ errorTypeThai: 'article และ preposition' }), 'article')
assert.equal(reportMistakeType({ errorType: 'subject-verb', errorTypeThai: 'whatever' }), 'subject-verb')
assert.equal(reportMistakeType({ errorTypeThai: 'something new' }), 'other')

// ── one list, grouped, biggest first; duplicates dropped ───────────────────────────────────
const groups = groupMistakes([...mistakes, { ...mistakes[3] }])
assert.equal(groups.reduce((sum, group) => sum + group.items.length, 0), 10, 'A repeated quote is listed once.')
assert.deepEqual(groups.slice(0, 3).map((group) => group.type), ['verb-pattern', 'article', 'preposition'])
assert.equal(groups[0].items.length, 4)

const top = pickTopFixes(groups)
assert.equal(top.length, 3, 'Top fixes = 3.')
assert.equal(new Set(top.map((item) => item.type)).size, 3, 'Top fixes come from 3 different types.')
assert.equal(top[1].mistake.originalText, 'a opportunity')
assert.equal(top[0].mistake.originalText, 'we have not in touch', 'A fix that only deletes words is not the first example.')

// ── Vocabulary Lift drops what the mistake list already shows ──────────────────────────────
const vocab = filterVocabAgainstMistakes(
  [
    { sourcePhrase: 'economy recession', replacement: 'economic recession', level: 'B2' },
    { sourcePhrase: 'are not cool', replacement: 'are not close', level: 'B1' }
  ],
  mistakes
)
assert.deepEqual(vocab.map((item) => item.sourcePhrase), ['are not cool'])

// ── ✓ ticks never quote a mistake as proof ────────────────────────────────────────────────
assert.deepEqual(
  cleanTickEvidence(['I have met a lot of people', 'we have not in touch anymore', 'We were classmates'], mistakes),
  ['I have met a lot of people', 'We were classmates']
)
assert.equal(isErrorAllowanceTick('มี grammar error 4-5 ครั้ง แต่ยังเข้าใจได้ตลอด'), true)
assert.equal(isErrorAllowanceTick('มี lexical error ได้ไม่เกิน 1 จุด แต่ยังเข้าใจได้'), true)
assert.equal(isErrorAllowanceTick('No more than 4 grammatical errors'), true)
assert.equal(isErrorAllowanceTick('ใช้ simple tense ถูกต้องเป็นส่วนใหญ่'), false)
assert.equal(isErrorAllowanceTick('collocation 2-3 จุด (B1+)'), false)

// ── the explanation's count matches the real list ─────────────────────────────────────────
assert.equal(
  alignMistakeCount('แต่มีข้อผิดพลาดทางไวยากรณ์ประมาณ 4-5 ครั้ง เช่น การใช้ tense ผิด', 10),
  'แต่มีข้อผิดพลาดทางไวยากรณ์ 10 จุด เช่น การใช้ tense ผิด'
)
assert.equal(alignMistakeCount('มี grammar error 4-5 ครั้ง', 10), 'มี grammar error 10 จุด')
assert.equal(alignMistakeCount('พูดได้ประมาณ 115 คำ', 10), 'พูดได้ประมาณ 115 คำ', 'Word counts are left alone.')
assert.equal(alignMistakeCount('มีข้อผิดพลาด 3 ครั้ง', 0), 'มีข้อผิดพลาด 3 ครั้ง', 'No list → no change.')

// ── the same +1 rewrite is shown once across Grammar / Vocabulary / Fluency ───────────────
const dedupe = createChecklistDeduper()
assert.equal(dedupe([{ originalText: 'Today, I am going to talk about my classmate, he named Ceiling.' }]).length, 1)
assert.equal(dedupe([{ originalText: 'Today, I am going to talk about my classmate, he named Ceiling.' }, { originalText: 'Other.' }]).length, 1)

// ── one target story instead of 6.5 vs 7.0 ────────────────────────────────────────────────
assert.deepEqual(describeTarget(6.5, 6.5, 7), { reached: true, text: 'ถึงเป้า Band 6.5 แล้ว · ขั้นต่อไป 7.0' })
assert.deepEqual(describeTarget(6, 7, 6.5), { reached: false, text: 'เป้า Band 7.0 · อีก 1.0' })
assert.equal(describeTarget(6, null, 6.5).text, 'ขั้นต่อไป Band 6.5')

// ── marks sit where the student said each mistake, never overlapping ──────────────────────
const answer =
  'Today, I am going to talk about my classmate, he named Ceiling. We were classmates, even though we have not in touch anymore. I like to talk to him when I have a opportunity.'
const segments = segmentAnswerWithMistakes(answer, mistakes)
assert.equal(segments.map((segment) => segment.text).join(''), answer, 'Segments rebuild the answer exactly.')
assert.deepEqual(
  segments.filter((segment) => segment.mistake).map((segment) => segment.text),
  ['he named Ceiling', 'we have not in touch', 'a opportunity']
)
assert.equal(segmentAnswerWithMistakes('', mistakes).length, 0)
// "a opportunity" must not match inside "panda opportunity" (word edges)
assert.equal(segmentAnswerWithMistakes('a panda opportunity', [{ originalText: 'a opportunity', correctedText: 'x' }]).filter((s) => s.mistake).length, 0)

assert.match(buildMishearingReport({ topic: 'A person', heard: 'are not cool', suggested: 'are not close' }), /ระบบได้ยินผิด/)

console.log('Speaking report layout validation passed.')
