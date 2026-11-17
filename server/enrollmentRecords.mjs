// Enrollment packages + per-student history, kept as one small JSON file in Supabase storage
// (no database migration needed). Pure helpers only, so scripts/validate-enrollment.ts can
// test them without a server.
//
// Why (Nov 2026 admin review): every student was set up by hand (skills, credits, length), so
// setups drifted; nothing recorded what a student bought or what was changed; and "Grant Access"
// on an expired student kept the old, past end date, so they still could not get in.

export const ENROLLMENT_RECORDS_PATH = '_manifests/enrollment-records.json'
export const ENROLLMENT_SKILLS = ['speaking', 'listening', 'reading', 'writing']
export const MAX_EVENTS_PER_LEARNER = 60
const MAX_PACKAGES = 30

export const DEFAULT_PACKAGES = [
  {
    id: 'core-3m',
    name: 'Speaking + Listening + Reading · 3 months',
    months: 3,
    enabledModules: ['speaking', 'listening', 'reading'],
    feedbackCredits: 20,
    fullMockCredits: 10,
    thinkificCourseIds: [],
    isDefault: true
  },
  {
    id: 'all-3m',
    name: 'All 4 skills · 3 months',
    months: 3,
    enabledModules: ['speaking', 'listening', 'reading', 'writing'],
    feedbackCredits: 20,
    fullMockCredits: 10,
    thinkificCourseIds: [],
    isDefault: false
  }
]

const clampInt = (value, min, max, fallback) => {
  const number = Math.round(Number(value))
  if (!Number.isFinite(number)) return fallback
  return Math.min(max, Math.max(min, number))
}

const slug = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)

export const normalizePackage = (raw, index = 0) => {
  const name = String(raw?.name || '').replace(/\s+/g, ' ').trim().slice(0, 80)
  if (!name) return null
  const modules = Array.isArray(raw?.enabledModules)
    ? [...new Set(raw.enabledModules.map(String).filter((key) => ENROLLMENT_SKILLS.includes(key)))]
    : []
  return {
    id: slug(raw?.id) || slug(name) || `package-${index + 1}`,
    name,
    // 0 months = no end date. Allowed on purpose, but the admin screen flags it.
    months: clampInt(raw?.months, 0, 36, 3),
    enabledModules: modules.length ? ENROLLMENT_SKILLS.filter((key) => modules.includes(key)) : ['speaking'],
    feedbackCredits: clampInt(raw?.feedbackCredits, 0, 999, 20),
    fullMockCredits: clampInt(raw?.fullMockCredits, 0, 999, 10),
    thinkificCourseIds: Array.isArray(raw?.thinkificCourseIds)
      ? [...new Set(raw.thinkificCourseIds.map((id) => String(id).trim()).filter(Boolean))].slice(0, 20)
      : [],
    isDefault: Boolean(raw?.isDefault)
  }
}

/** Clean a package list: drop blanks, make ids unique, keep exactly one default. */
export const normalizePackages = (list) => {
  const seen = new Set()
  const packages = []
  for (const [index, raw] of (Array.isArray(list) ? list : []).entries()) {
    const pkg = normalizePackage(raw, index)
    if (!pkg) continue
    let id = pkg.id
    for (let n = 2; seen.has(id); n += 1) id = `${pkg.id}-${n}`
    seen.add(id)
    packages.push({ ...pkg, id })
    if (packages.length >= MAX_PACKAGES) break
  }
  if (packages.length) {
    const defaultIndex = Math.max(0, packages.findIndex((pkg) => pkg.isDefault))
    packages.forEach((pkg, index) => {
      pkg.isDefault = index === defaultIndex
    })
  }
  return packages
}

export const normalizeRecords = (raw) => {
  const source = raw && typeof raw === 'object' ? raw : {}
  const packages = normalizePackages(source.packages)
  const learners = {}
  for (const [userId, entry] of Object.entries(source.learners && typeof source.learners === 'object' ? source.learners : {})) {
    if (!userId) continue
    learners[userId] = {
      packageId: String(entry?.packageId || ''),
      events: (Array.isArray(entry?.events) ? entry.events : [])
        .filter((event) => event && event.at && event.text)
        .slice(-MAX_EVENTS_PER_LEARNER)
        .map((event) => ({
          at: String(event.at),
          type: String(event.type || 'note'),
          text: String(event.text).slice(0, 500),
          by: String(event.by || '')
        }))
    }
  }
  const dismissed = {}
  for (const [key, until] of Object.entries(source.dismissed && typeof source.dismissed === 'object' ? source.dismissed : {})) {
    if (key && until && !Number.isNaN(new Date(until).getTime())) dismissed[key] = String(until)
  }
  return {
    version: 1,
    packages: packages.length ? packages : normalizePackages(DEFAULT_PACKAGES),
    learners,
    dismissed
  }
}

export const addMonthsIso = (value, months) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  const next = new Date(date)
  next.setUTCMonth(next.getUTCMonth() + Number(months || 0))
  return next.toISOString()
}

const isFuture = (iso, now) => Boolean(iso) && new Date(iso).getTime() > now.getTime()

/**
 * An end date to keep when someone is switched on. A date already in the past is useless
 * (they still could not log in), so fall back to a fresh window instead.
 */
export const pickActivationExpiry = ({ currentExpiresAt, fallbackExpiresAt, now = new Date() }) =>
  isFuture(currentExpiresAt, now) ? currentExpiresAt : fallbackExpiresAt

/**
 * What a student's access should become when you enrol or renew them with a package.
 * - start: switch on from `startsAt` (default today) for the package length; credits become at
 *   least the package amount.
 * - renew: add the package length on top of the current end date if it is still in the
 *   future (otherwise from today), and ADD the package credits (they paid again).
 * An explicit `expiresAt` always wins, so the admin can adjust the date by hand.
 */
export const computeEnrollmentAccess = ({ pkg, mode = 'start', current = {}, startsAt, expiresAt, now = new Date() }) => {
  const currentFeedback = Math.max(0, Number(current.feedbackCredits ?? 0) || 0)
  const currentFullMock = Math.max(0, Number(current.fullMockCredits ?? 0) || 0)
  const stillRunning = current.status === 'active' && isFuture(current.expiresAt, now)
  let nextStartsAt
  let nextExpiresAt
  let feedbackCredits
  let fullMockCredits
  if (mode === 'renew') {
    nextStartsAt = stillRunning && current.startsAt ? current.startsAt : (startsAt || now.toISOString())
    const base = stillRunning ? current.expiresAt : (startsAt || now.toISOString())
    nextExpiresAt = pkg.months > 0 ? addMonthsIso(base, pkg.months) : null
    feedbackCredits = currentFeedback + pkg.feedbackCredits
    fullMockCredits = currentFullMock + pkg.fullMockCredits
  } else {
    nextStartsAt = startsAt || now.toISOString()
    nextExpiresAt = pkg.months > 0 ? addMonthsIso(nextStartsAt, pkg.months) : null
    feedbackCredits = Math.max(currentFeedback, pkg.feedbackCredits)
    fullMockCredits = Math.max(currentFullMock, pkg.fullMockCredits)
  }
  if (expiresAt) {
    const manual = new Date(expiresAt)
    if (!Number.isNaN(manual.getTime())) nextExpiresAt = manual.toISOString()
  }
  return {
    status: 'active',
    startsAt: nextStartsAt,
    expiresAt: nextExpiresAt,
    feedbackCredits,
    fullMockCredits,
    enabledModules: [...pkg.enabledModules]
  }
}

const SKILL_LABELS = { speaking: 'Speaking', listening: 'Listening', reading: 'Reading', writing: 'Writing' }

const shortDate = (iso) => {
  if (!iso) return 'no end date'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 'no end date'
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Bangkok' })
}

/** Plain-English list of what changed between two access records (for the history). */
export const describeAccessChange = (before = {}, after = {}) => {
  const changes = []
  const beforeOn = before.status === 'active'
  const afterOn = after.status === 'active'
  if (beforeOn !== afterOn) changes.push(afterOn ? 'Access switched ON' : 'Access switched OFF')
  if (String(before.expiresAt || '') !== String(after.expiresAt || '') && shortDate(before.expiresAt) !== shortDate(after.expiresAt)) {
    changes.push(`End date ${shortDate(before.expiresAt)} → ${shortDate(after.expiresAt)}`)
  }
  const fb = [Number(before.feedbackCredits ?? 0), Number(after.feedbackCredits ?? 0)]
  if (fb[0] !== fb[1]) changes.push(`Feedback credits ${fb[0]} → ${fb[1]}`)
  const fm = [Number(before.fullMockCredits ?? 0), Number(after.fullMockCredits ?? 0)]
  if (fm[0] !== fm[1]) changes.push(`Full mock credits ${fm[0]} → ${fm[1]}`)
  const beforeSkills = new Set(before.enabledModules || [])
  const afterSkills = new Set(after.enabledModules || [])
  const added = ENROLLMENT_SKILLS.filter((key) => afterSkills.has(key) && !beforeSkills.has(key))
  const removed = ENROLLMENT_SKILLS.filter((key) => beforeSkills.has(key) && !afterSkills.has(key))
  if (added.length) changes.push(`Skills added: ${added.map((key) => SKILL_LABELS[key]).join(', ')}`)
  if (removed.length) changes.push(`Skills removed: ${removed.map((key) => SKILL_LABELS[key]).join(', ')}`)
  return changes
}

/** Add one history line for a student (returns the same records object, newest last). */
export const appendEnrollmentEvent = (records, userId, { type = 'note', text, by = '', at = new Date().toISOString(), packageId } = {}) => {
  if (!userId || !String(text || '').trim()) return records
  const entry = records.learners[userId] || { packageId: '', events: [] }
  entry.events = [...entry.events, { at, type, text: String(text).slice(0, 500), by: String(by || '') }].slice(-MAX_EVENTS_PER_LEARNER)
  if (packageId !== undefined) entry.packageId = String(packageId || '')
  records.learners[userId] = entry
  return records
}

/** The package a Thinkific course is mapped to, if any. */
export const resolveThinkificPackage = (packages, courseId) => {
  const id = String(courseId || '').trim()
  if (!id) return null
  return (packages || []).find((pkg) => (pkg.thinkificCourseIds || []).includes(id)) || null
}

/** Hide one inbox item for a while ("Let it end", "Not now"). */
export const dismissInboxItem = (records, key, days = 30, now = new Date()) => {
  if (!key) return records
  const until = new Date(now.getTime() + Math.max(1, Math.min(365, Number(days) || 30)) * 864e5)
  records.dismissed[String(key).slice(0, 160)] = until.toISOString()
  // Drop old entries so the file does not grow forever.
  for (const [itemKey, itemUntil] of Object.entries(records.dismissed)) {
    if (new Date(itemUntil).getTime() < now.getTime()) delete records.dismissed[itemKey]
  }
  return records
}
