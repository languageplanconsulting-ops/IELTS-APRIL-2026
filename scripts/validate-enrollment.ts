import assert from 'node:assert/strict'
import React, { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import {
  DEFAULT_PACKAGES,
  appendEnrollmentEvent,
  computeEnrollmentAccess,
  describeAccessChange,
  dismissInboxItem,
  normalizePackages,
  normalizeRecords,
  pickActivationExpiry,
  resolveThinkificPackage,
  MAX_EVENTS_PER_LEARNER
} from '../server/enrollmentRecords.mjs'
import {
  buildEnrollmentInbox,
  enrollmentStatus,
  hasLiveAccess,
  matchesFilter,
  previewEnrollment,
  suggestPackage,
  type EnrollmentLearner,
  type EnrollmentRecords
} from '../src/admin/enrollment'
import { LearnerDirectory } from '../src/admin/LearnerEnrollment'

;(globalThis as { React?: unknown }).React = React

const NOW = new Date('2026-11-18T05:00:00.000Z')
const day = (n: number) => new Date(NOW.getTime() + n * 864e5).toISOString()

// ── packages ────────────────────────────────────────────────────────────────────────────
const cleaned = normalizePackages([
  { name: 'Core', months: 3, enabledModules: ['speaking', 'reading', 'nonsense'], feedbackCredits: 20 },
  { name: 'Core', months: 99, enabledModules: [] },
  { name: '   ' },
  { name: 'All', isDefault: true, thinkificCourseIds: ['123', '123', ' 456 '] }
])
assert.equal(cleaned.length, 3, 'Blank packages are dropped.')
assert.deepEqual(cleaned.map((pkg) => pkg.id), ['core', 'core-2', 'all'], 'Ids are unique.')
assert.equal(cleaned[1].months, 36, 'Months are capped.')
assert.deepEqual(cleaned[1].enabledModules, ['speaking'], 'A package always opens at least one skill.')
assert.deepEqual(cleaned[0].enabledModules, ['speaking', 'reading'], 'Unknown skills are dropped.')
assert.deepEqual(cleaned.map((pkg) => pkg.isDefault), [false, false, true], 'Exactly one default.')
assert.deepEqual(cleaned[2].thinkificCourseIds, ['123', '456'])
assert.equal(normalizeRecords(null).packages.length, DEFAULT_PACKAGES.length, 'A missing file starts with the default packages.')
assert.equal(resolveThinkificPackage(cleaned, '456')?.id, 'all')
assert.equal(resolveThinkificPackage(cleaned, '999'), null)

// ── start / renew maths ─────────────────────────────────────────────────────────────────
const pkg = { ...normalizePackages(DEFAULT_PACKAGES)[0] } // 3 months, 20 feedback, 10 mock
const running = { status: 'active', startsAt: day(-60), expiresAt: day(10), feedbackCredits: 4, fullMockCredits: 1, enabledModules: ['speaking'] }
const renewRunning = computeEnrollmentAccess({ pkg, mode: 'renew', current: running, now: NOW })
assert.equal(renewRunning.expiresAt?.slice(0, 10), new Date(new Date(day(10)).setUTCMonth(new Date(day(10)).getUTCMonth() + 3)).toISOString().slice(0, 10), 'Renewing a running plan adds time on top of the current end date.')
assert.equal(renewRunning.startsAt, running.startsAt, 'Renewing keeps the original start.')
assert.equal(renewRunning.feedbackCredits, 24, 'Renewing ADDS the package credits.')
assert.equal(renewRunning.fullMockCredits, 11)

const expired = { ...running, expiresAt: day(-5) }
const renewExpired = computeEnrollmentAccess({ pkg, mode: 'renew', current: expired, now: NOW })
assert.ok(new Date(renewExpired.expiresAt as string).getTime() > NOW.getTime() + 80 * 864e5, 'An expired plan renews from today, not from the old end date.')

const waiting = { status: 'inactive', startsAt: day(-1), expiresAt: null, feedbackCredits: 0, fullMockCredits: 0, enabledModules: [] }
const start = computeEnrollmentAccess({ pkg, mode: 'start', current: waiting, now: NOW })
assert.equal(start.status, 'active')
assert.equal(start.feedbackCredits, 20, 'Starting sets credits to the package amount.')
assert.deepEqual(start.enabledModules, pkg.enabledModules)
const manual = computeEnrollmentAccess({ pkg, mode: 'start', current: waiting, now: NOW, expiresAt: '2027-01-31T16:59:00.000Z' })
assert.equal(manual.expiresAt, '2027-01-31T16:59:00.000Z', 'A date typed by the admin wins.')
const forever = computeEnrollmentAccess({ pkg: { ...pkg, months: 0 }, mode: 'start', current: waiting, now: NOW })
assert.equal(forever.expiresAt, null, '0 months = no end date.')

// The bug that started this: switching an expired student back on kept the past date.
assert.equal(pickActivationExpiry({ currentExpiresAt: day(-3), fallbackExpiresAt: day(90), now: NOW }), day(90))
assert.equal(pickActivationExpiry({ currentExpiresAt: day(20), fallbackExpiresAt: day(90), now: NOW }), day(20))
assert.equal(pickActivationExpiry({ currentExpiresAt: null, fallbackExpiresAt: day(90), now: NOW }), day(90))

// ── history ─────────────────────────────────────────────────────────────────────────────
const changes = describeAccessChange(
  { status: 'inactive', expiresAt: day(-3), feedbackCredits: 0, fullMockCredits: 10, enabledModules: ['speaking', 'reading'] },
  { status: 'active', expiresAt: day(90), feedbackCredits: 20, fullMockCredits: 10, enabledModules: ['speaking', 'reading', 'writing'] }
)
assert.equal(changes[0], 'Access switched ON')
assert.ok(changes.some((line) => line.startsWith('End date ')))
assert.ok(changes.includes('Feedback credits 0 → 20'))
assert.ok(changes.includes('Skills added: Writing'))
assert.ok(!changes.some((line) => line.startsWith('Full mock')), 'Unchanged values are not listed.')
assert.deepEqual(describeAccessChange(running, running), [])

const records = normalizeRecords({})
for (let i = 0; i < MAX_EVENTS_PER_LEARNER + 5; i += 1) appendEnrollmentEvent(records, 'u1', { text: `event ${i}` })
assert.equal(records.learners.u1.events.length, MAX_EVENTS_PER_LEARNER, 'History is capped per student.')
assert.equal(records.learners.u1.events.at(-1)?.text, `event ${MAX_EVENTS_PER_LEARNER + 4}`, 'Newest is kept.')
appendEnrollmentEvent(records, 'u1', { text: 'x', packageId: 'all-3m' })
assert.equal(records.learners.u1.packageId, 'all-3m')
appendEnrollmentEvent(records, 'u2', { text: '   ' })
assert.equal(records.learners.u2, undefined, 'Empty history lines are ignored.')

dismissInboxItem(records, 'old', 1, new Date(NOW.getTime() - 5 * 864e5))
dismissInboxItem(records, 'new', 30, NOW)
assert.ok(records.dismissed.new && !records.dismissed.old, 'Old dismissals are cleaned out.')

// ── student status + to-do inbox (client) ──────────────────────────────────────────────
const learner = (id: string, patch: Partial<EnrollmentLearner>): EnrollmentLearner => ({
  id,
  name: `Student ${id}`,
  email: `${id}@example.com`,
  role: 'student',
  status: 'active',
  startsAt: day(-30),
  expiresAt: day(60),
  feedbackRemaining: 10,
  fullMockRemaining: 10,
  enabledModules: ['speaking', 'listening', 'reading'],
  createdAt: day(-30),
  ...patch
})
const people = [
  learner('fine', {}),
  learner('wait', { status: 'inactive', expiresAt: null, createdAt: day(-2) }),
  learner('end5', { expiresAt: day(5) }),
  learner('end10', { expiresAt: day(10) }),
  learner('exp1', { expiresAt: day(-1) }),
  learner('exp2', { expiresAt: day(-40) }),
  learner('off', { status: 'inactive', expiresAt: day(-100) }),
  learner('broke', { feedbackRemaining: 0 }),
  learner('forever', { expiresAt: null }),
  learner('locked', { enabledModules: [] }),
  learner('dupA', { name: 'Same Name' }),
  learner('dupB', { name: 'same  name' }),
  learner('boss', { role: 'admin', status: 'inactive', expiresAt: null })
]
const statuses = Object.fromEntries(people.map((p) => [p.id, enrollmentStatus(p, NOW)]))
assert.deepEqual(
  { fine: statuses.fine, wait: statuses.wait, end5: statuses.end5, end10: statuses.end10, exp1: statuses.exp1, off: statuses.off, forever: statuses.forever },
  { fine: 'active', wait: 'waiting', end5: 'ending', end10: 'ending', exp1: 'expired', off: 'off', forever: 'no-end' }
)
assert.equal(hasLiveAccess(people.find((p) => p.id === 'exp1')!, NOW), false, 'Expired is not counted as active any more.')
assert.equal(people.filter((p) => p.role !== 'admin' && hasLiveAccess(p, NOW)).length, 8)
assert.equal(matchesFilter(people.find((p) => p.id === 'broke')!, 'no-credits', NOW), true)

const emptyRecords: EnrollmentRecords = { packages: normalizePackages(DEFAULT_PACKAGES), learners: {}, dismissed: {} }
const inbox = buildEnrollmentInbox(people, emptyRecords, NOW)
const keys = inbox.map((item) => item.key.split(':')[0])
assert.deepEqual(keys, ['waiting', 'ending', 'expired-still-on', 'no-credits', 'no-end', 'no-skills', 'duplicate'], 'Most urgent first.')
assert.ok(!inbox.some((item) => item.learnerIds.includes('boss')), 'Admin accounts never show up.')
assert.ok(!inbox.some((item) => item.learnerIds.includes('end10')), 'Only the next 7 days count as "ends this week".')
assert.equal(inbox.find((item) => item.key.startsWith('expired-still-on'))?.learnerIds.length, 2, 'Expired students are one grouped item.')
const dismissedInbox = buildEnrollmentInbox(people, { ...emptyRecords, dismissed: { 'waiting:wait': day(3) } }, NOW)
assert.ok(!dismissedInbox.some((item) => item.key === 'waiting:wait'), '"Not now" hides an item.')
const backAgain = buildEnrollmentInbox(people, { ...emptyRecords, dismissed: { 'waiting:wait': day(-1) } }, NOW)
assert.ok(backAgain.some((item) => item.key === 'waiting:wait'), 'It comes back when the snooze runs out.')

// Package guess: on record first, then matching skills, then the default.
const all4 = learner('all4', { enabledModules: ['speaking', 'listening', 'reading', 'writing'] })
assert.equal(suggestPackage(all4, emptyRecords)?.id, 'all-3m')
assert.equal(suggestPackage(learner('odd', { enabledModules: ['writing'] }), emptyRecords)?.id, 'core-3m')

// The preview in the window must match what the server really does.
for (const [mode, current] of [
  ['renew', running],
  ['renew', expired],
  ['start', waiting]
] as const) {
  const asLearner = learner('p', {
    status: current.status as 'active' | 'inactive',
    startsAt: current.startsAt,
    expiresAt: current.expiresAt,
    feedbackRemaining: current.feedbackCredits,
    fullMockRemaining: current.fullMockCredits
  })
  const server = computeEnrollmentAccess({ pkg, mode, current, now: NOW })
  const client = previewEnrollment(pkg, mode, asLearner, NOW)
  assert.equal(client.expiresAt, server.expiresAt, `${mode}: same end date`)
  assert.equal(client.feedbackCredits, server.feedbackCredits, `${mode}: same feedback credits`)
  assert.equal(client.fullMockCredits, server.fullMockCredits, `${mode}: same full mock credits`)
}

// ── the screen renders ──────────────────────────────────────────────────────────────────
const html = renderToStaticMarkup(
  createElement(LearnerDirectory, {
    accessToken: 't',
    learners: people,
    records: emptyRecords,
    setRecords: () => {},
    search: '',
    onSearchChange: () => {},
    onLearnerUpdated: () => {},
    quickUpdate: async () => {},
    onView: () => {}
  })
)
assert.ok(html.includes('is waiting for approval'), 'Inbox shows the sign-up.')
assert.ok(html.includes('Mark 2 as ended'), 'Inbox offers the one-tap clean-up.')
assert.ok(html.includes('Waiting approval') && html.includes('Ending soon') && html.includes('Expired'), 'Cards show the real status.')
assert.ok(!html.includes('>ACTIVE<'), 'No more all-caps ACTIVE on expired students.')
assert.equal((html.match(/class="enrCard /g) || []).length, 12, 'One card per student (admins hidden).')

console.log(`Enrollment validation passed (${inbox.length} to-do items in the sample).`)
