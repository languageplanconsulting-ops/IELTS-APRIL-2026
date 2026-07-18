import assert from 'node:assert/strict'
import {
  buildWritingRecallFeedback,
  isWritingRecallExact
} from '../src/writingParagraphRecall'

assert.equal(
  isWritingRecallExact('For example, technology can help.', 'For   example,\ntechnologycan help.'),
  true,
  'Recall must ignore whitespace.'
)
assert.equal(
  isWritingRecallExact('For example, technology can help.', 'for example, technology can help.'),
  false,
  'Recall must enforce capitalization.'
)
assert.equal(
  isWritingRecallExact('For example, technology can help.', 'For example technology can help.'),
  false,
  'Recall must enforce punctuation.'
)

const expectFeedback = (expected: string, given: string, pattern: RegExp) => {
  const feedback = buildWritingRecallFeedback(expected, given).join(' ')
  assert.match(feedback, pattern, `Expected feedback matching ${pattern}, received: ${feedback}`)
}

expectFeedback('Technology can help.', 'technology can help.', /Capital letter/)
expectFeedback(
  'Technology helps users, which improves access.',
  'Technology helps users which improves access.',
  /S\+V, which \+ singular verb/
)
expectFeedback('These services were useful.', 'These services was useful.', /was\/were/)
expectFeedback('Governments could provide support.', 'Governments could provides support.', /Modal \+ base verb/)
expectFeedback('The devices are designed carefully.', 'The devices are design carefully.', /Passive voice/)
expectFeedback('This is an effective solution.', 'This is a effective solution.', /Article/)

console.log('Writing recall validation passed: whitespace, strict matching, and grammar feedback.')
