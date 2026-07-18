import assert from 'node:assert/strict'
import {
  ENGAGEMENT_IDLE_MS,
  buildEngagementContextKey,
  formatEngagementDuration,
  shouldCountEngagement
} from '../src/engagementTracking'

const now = 500_000

assert.equal(
  shouldCountEngagement({ visible: true, now, lastInteractionAt: now - ENGAGEMENT_IDLE_MS + 1 }),
  true,
  'Visible activity inside the idle threshold should count.'
)
assert.equal(
  shouldCountEngagement({ visible: true, now, lastInteractionAt: now - ENGAGEMENT_IDLE_MS - 1 }),
  false,
  'Idle activity outside the threshold must pause.'
)
assert.equal(
  shouldCountEngagement({ visible: false, now, lastInteractionAt: now }),
  false,
  'Hidden tabs must never count.'
)

assert.equal(formatEngagementDuration(0), '0s')
assert.equal(formatEngagementDuration(59), '59s')
assert.equal(formatEngagementDuration(60), '1m')
assert.equal(formatEngagementDuration(3_661), '1h 1m')

const readingKey = buildEngagementContextKey({
  page: 'reading',
  feature: 'reading.full-test',
  activityType: 'test',
  activityId: 'cambridge-19-test1'
})
const writingKey = buildEngagementContextKey({
  page: 'writing',
  feature: 'writing.task1',
  activityType: 'test',
  activityId: 'map-town-centre'
})

assert.notEqual(readingKey, writingKey, 'Feature/test context changes must rotate the active segment.')
assert.equal(
  readingKey,
  'reading|reading.full-test|test|cambridge-19-test1',
  'Context keys must remain stable for backend grouping.'
)

console.log('Engagement tracking validation passed.')
