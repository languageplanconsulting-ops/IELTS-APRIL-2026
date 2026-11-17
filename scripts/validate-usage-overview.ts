import assert from 'node:assert/strict'
import {
  isMissingUsageFunctionError,
  listMonthsEndingAt,
  parseUsageMonths,
  shapeUsageOverviewRows,
  toLocalDateKey
} from '../server/engagementUsageOverview.mjs'

// --- month parsing -----------------------------------------------------------
assert.deepEqual(listMonthsEndingAt('2026-11', 4), ['2026-08', '2026-09', '2026-10', '2026-11'])
assert.deepEqual(listMonthsEndingAt('2026-02', 3), ['2025-12', '2026-01', '2026-02'], 'Must wrap across a year.')
assert.deepEqual(parseUsageMonths('', '2026-11'), ['2026-08', '2026-09', '2026-10', '2026-11'])
assert.deepEqual(parseUsageMonths('2026-11,2026-10', '2026-11'), ['2026-10', '2026-11'], 'Months come back oldest first.')
assert.deepEqual(parseUsageMonths('2026-10,2026-10', '2026-11'), ['2026-10'], 'Duplicates are dropped.')
for (const bad of ['2026-13', '2026-1', 'october', '2026-10,oops']) {
  assert.throws(() => parseUsageMonths(bad, '2026-11'), /YYYY-MM/, `"${bad}" must be rejected.`)
}
assert.throws(
  () => parseUsageMonths(listMonthsEndingAt('2026-11', 13).join(','), '2026-11'),
  /at most/,
  'More than 12 months must be rejected.'
)

// --- local date bucketing (Bangkok is UTC+7) -----------------------------------
assert.equal(toLocalDateKey('2026-10-31T17:30:00+00:00', 'Asia/Bangkok'), '2026-11-01')
assert.equal(toLocalDateKey('2026-10-31T16:59:00+00:00', 'Asia/Bangkok'), '2026-10-31')
assert.equal(toLocalDateKey('not a date', 'Asia/Bangkok'), '')

// --- shaping the database rows -------------------------------------------------
const row = (overrides: Record<string, unknown>) => ({
  scope: '',
  page: '',
  feature: '',
  bucket_at: null,
  active_seconds: 0,
  segment_count: 0,
  session_count: 0,
  actor_count: 0,
  active_day_count: 0,
  ...overrides
})

const october = shapeUsageOverviewRows([
  row({ scope: 'month', active_seconds: 1080, segment_count: 4, session_count: 3, actor_count: 2, active_day_count: 3 }),
  row({ scope: 'day', bucket_at: '2026-10-20T00:00:00+07:00', active_seconds: 120, actor_count: 1, active_day_count: 1 }),
  row({ scope: 'day', bucket_at: '2026-10-03T00:00:00+07:00', active_seconds: 960, actor_count: 2, active_day_count: 2 }),
  row({ scope: 'page', page: 'reading', active_seconds: 300, actor_count: 1 }),
  row({ scope: 'page', page: 'speaking', active_seconds: 780, actor_count: 2 }),
  row({ scope: 'feature', page: 'speaking', feature: 'speaking.full-mock', active_seconds: 100, actor_count: 1 }),
  row({ scope: 'feature', page: 'speaking', feature: 'speaking.practice', active_seconds: 680, actor_count: 2 }),
  row({ scope: 'feature', page: 'reading', feature: 'reading.bank', active_seconds: 300, actor_count: 1 })
])

assert.equal(october.totals.seconds, 1080)
assert.equal(october.totals.learners, 2)
assert.equal(october.averages.secondsPerLearner, 540)
assert.equal(october.averages.activeDaysPerLearner, 1.5)
assert.equal(october.averages.sessionsPerLearner, 1.5)
assert.deepEqual(
  october.daily.map((day) => day.date),
  ['2026-10-03', '2026-10-20'],
  'Daily rows are sorted by date and keyed by the Bangkok calendar day.'
)
assert.deepEqual(
  october.functions.map((item) => item.page),
  ['speaking', 'reading'],
  'Functions are ranked by time spent.'
)
assert.deepEqual(
  october.functions[0].features.map((feature) => feature.feature),
  ['speaking.practice', 'speaking.full-mock'],
  'Features sit under their own function, ranked by time.'
)
assert.equal(october.functions[0].learners, 2, 'Learners per function is distinct people, not a sum of features.')

// An empty month must still produce zeros, never NaN.
const empty = shapeUsageOverviewRows([])
assert.equal(empty.totals.learners, 0)
assert.equal(empty.averages.secondsPerLearner, 0)
assert.equal(empty.averages.activeDaysPerLearner, 0)
assert.deepEqual(empty.daily, [])
assert.deepEqual(empty.functions, [])
assert.equal(shapeUsageOverviewRows(null).totals.seconds, 0)

// --- "SQL not installed yet" detection ----------------------------------------
assert.equal(
  isMissingUsageFunctionError({ payload: { code: 'PGRST202', message: 'Could not find the function public.admin_usage_overview' } }),
  true
)
assert.equal(isMissingUsageFunctionError({ payload: { code: '42883' } }), true)
assert.equal(isMissingUsageFunctionError(new Error('Could not reach Supabase.')), false)
assert.equal(isMissingUsageFunctionError({ status: 500, payload: { message: 'boom' } }), false)

console.log('Usage overview validation passed.')
