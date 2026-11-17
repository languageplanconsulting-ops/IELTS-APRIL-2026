import { SKILL_MODULES, type SkillModule } from '../moduleAccess'

// Shapes shared with server/enrollmentRecords.mjs (the server is the source of truth).
export type EnrollmentPackage = {
  id: string
  name: string
  /** 0 = no end date. */
  months: number
  enabledModules: SkillModule[]
  feedbackCredits: number
  fullMockCredits: number
  thinkificCourseIds: string[]
  isDefault: boolean
}

export type EnrollmentEvent = { at: string; type: string; text: string; by: string }
export type LearnerEnrollmentRecord = { packageId: string; events: EnrollmentEvent[] }
export type EnrollmentRecords = {
  packages: EnrollmentPackage[]
  learners: Record<string, LearnerEnrollmentRecord>
  dismissed: Record<string, string>
}

export type EnrollmentLearner = {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
  startsAt: string | null
  expiresAt: string | null
  feedbackRemaining: number
  fullMockRemaining: number
  enabledModules: SkillModule[]
  createdAt: string
}

export const EMPTY_RECORDS: EnrollmentRecords = { packages: [], learners: {}, dismissed: {} }

export const ENDING_SOON_DAYS = 14
const DAY = 864e5

// ── status ──────────────────────────────────────────────────────────────────────────────

export type EnrollmentStatus = 'waiting' | 'active' | 'ending' | 'expired' | 'no-end' | 'off'

export const STATUS_META: Record<EnrollmentStatus, { label: string; tone: 'blue' | 'green' | 'yellow' | 'red' | 'grey' }> = {
  waiting: { label: 'Waiting approval', tone: 'blue' },
  active: { label: 'Active', tone: 'green' },
  ending: { label: 'Ending soon', tone: 'yellow' },
  expired: { label: 'Expired', tone: 'red' },
  'no-end': { label: 'No end date', tone: 'yellow' },
  off: { label: 'Off', tone: 'grey' }
}

/**
 * The status a person should actually see. The database only knows active / inactive, so an
 * account whose end date has passed still said "ACTIVE" (26 of them in Nov 2026).
 * "Waiting approval" = switched off and never given an end date (a fresh sign-up).
 */
export const enrollmentStatus = (learner: EnrollmentLearner, now = new Date()): EnrollmentStatus => {
  const ends = learner.expiresAt ? new Date(learner.expiresAt).getTime() : null
  if (learner.status !== 'active') return ends === null ? 'waiting' : 'off'
  if (ends === null) return 'no-end'
  if (ends <= now.getTime()) return 'expired'
  if (ends - now.getTime() <= ENDING_SOON_DAYS * DAY) return 'ending'
  return 'active'
}

/** Can use the app right now (what the header "Active" count should mean). */
export const hasLiveAccess = (learner: EnrollmentLearner, now = new Date()) => {
  const status = enrollmentStatus(learner, now)
  return status === 'active' || status === 'ending' || status === 'no-end'
}

export const daysUntil = (iso: string | null, now = new Date()) =>
  iso ? Math.ceil((new Date(iso).getTime() - now.getTime()) / DAY) : null

export const formatThaiDate = (iso: string | null) => {
  if (!iso) return 'ไม่มีวันหมดอายุ'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Bangkok' })
}

/** yyyy-mm-dd for <input type="date">, in Bangkok time. */
export const toDateInput = (iso: string | null) => {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date)
}

/** A yyyy-mm-dd picked in the date box, as the end of that day in Bangkok. */
export const fromDateInput = (value: string) => (value ? new Date(`${value}T23:59:00+07:00`).toISOString() : null)

export const skillsLabel = (modules: SkillModule[]) =>
  SKILL_MODULES.filter((module) => modules.includes(module.key))
    .map((module) => module.label)
    .join(' · ') || 'no skills'

// ── packages ────────────────────────────────────────────────────────────────────────────

const sameSkills = (left: SkillModule[], right: SkillModule[]) =>
  left.length === right.length && left.every((key) => right.includes(key))

/** The student's package: the one on record, else the one whose skills match, else the default. */
export const suggestPackage = (learner: EnrollmentLearner, records: EnrollmentRecords) => {
  const packages = records.packages
  const onRecord = packages.find((pkg) => pkg.id === records.learners[learner.id]?.packageId)
  return (
    onRecord ||
    packages.find((pkg) => sameSkills(pkg.enabledModules, learner.enabledModules)) ||
    packages.find((pkg) => pkg.isDefault) ||
    packages[0] ||
    null
  )
}

export const packageOnRecord = (learner: EnrollmentLearner, records: EnrollmentRecords) =>
  records.packages.find((pkg) => pkg.id === records.learners[learner.id]?.packageId) || null

const addMonths = (iso: string, months: number) => {
  const date = new Date(iso)
  date.setUTCMonth(date.getUTCMonth() + months)
  return date.toISOString()
}

/**
 * Preview of what the server will do (mirrors computeEnrollmentAccess in
 * server/enrollmentRecords.mjs; scripts/validate-enrollment.ts checks they agree).
 */
export const previewEnrollment = (
  pkg: EnrollmentPackage,
  mode: 'start' | 'renew',
  learner: EnrollmentLearner,
  now = new Date(),
  startsAt?: string
) => {
  const stillRunning =
    learner.status === 'active' && Boolean(learner.expiresAt) && new Date(learner.expiresAt as string).getTime() > now.getTime()
  if (mode === 'renew') {
    const base = stillRunning ? (learner.expiresAt as string) : startsAt || now.toISOString()
    return {
      startsAt: stillRunning && learner.startsAt ? learner.startsAt : startsAt || now.toISOString(),
      expiresAt: pkg.months > 0 ? addMonths(base, pkg.months) : null,
      feedbackCredits: learner.feedbackRemaining + pkg.feedbackCredits,
      fullMockCredits: learner.fullMockRemaining + pkg.fullMockCredits,
      enabledModules: [...pkg.enabledModules]
    }
  }
  const start = startsAt || now.toISOString()
  return {
    startsAt: start,
    expiresAt: pkg.months > 0 ? addMonths(start, pkg.months) : null,
    feedbackCredits: Math.max(learner.feedbackRemaining, pkg.feedbackCredits),
    fullMockCredits: Math.max(learner.fullMockRemaining, pkg.fullMockCredits),
    enabledModules: [...pkg.enabledModules]
  }
}

/** Renew if they have (or had) access; start if they never had any. */
export const defaultEnrollMode = (learner: EnrollmentLearner, now = new Date()): 'start' | 'renew' =>
  enrollmentStatus(learner, now) === 'waiting' ? 'start' : 'renew'

// ── to-do inbox ─────────────────────────────────────────────────────────────────────────

export type InboxAction =
  | { kind: 'approve'; label: string }
  | { kind: 'renew'; label: string }
  | { kind: 'open'; label: string }
  | { kind: 'add-feedback'; label: string; amount: number }
  | { kind: 'end-all-expired'; label: string }
  | { kind: 'filter'; label: string; search: string }
  | { kind: 'dismiss'; label: string; days: number }

export type InboxItem = {
  key: string
  icon: string
  title: string
  detail: string
  learnerIds: string[]
  actions: InboxAction[]
}

const isDismissed = (records: EnrollmentRecords, key: string, now: Date) => {
  const until = records.dismissed[key]
  return Boolean(until) && new Date(until).getTime() > now.getTime()
}

const firstEventAt = (records: EnrollmentRecords, learner: EnrollmentLearner, type: string) =>
  records.learners[learner.id]?.events.find((event) => event.type === type)?.at || learner.createdAt

const ago = (iso: string, now: Date) => {
  const days = Math.max(0, Math.floor((now.getTime() - new Date(iso).getTime()) / DAY))
  return days === 0 ? 'today' : days === 1 ? '1 day ago' : `${days} days ago`
}

/** Only what needs the admin's attention, most urgent first. Empty list = nothing to do. */
export const buildEnrollmentInbox = (learners: EnrollmentLearner[], records: EnrollmentRecords, now = new Date()): InboxItem[] => {
  const students = learners.filter((learner) => learner.role !== 'admin')
  const items: InboxItem[] = []
  const push = (item: InboxItem) => {
    if (!isDismissed(records, item.key, now)) items.push(item)
  }

  // 1. New sign-ups waiting for approval (oldest first, so nobody waits for weeks).
  students
    .filter((learner) => enrollmentStatus(learner, now) === 'waiting')
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .forEach((learner) =>
      push({
        key: `waiting:${learner.id}`,
        icon: '🆕',
        title: `${learner.name} is waiting for approval`,
        detail: `Signed up ${ago(firstEventAt(records, learner, 'signup'), now)} · ${learner.email}`,
        learnerIds: [learner.id],
        actions: [
          { kind: 'approve', label: 'Approve…' },
          { kind: 'dismiss', label: 'Not now', days: 7 }
        ]
      })
    )

  // 2. Access ending within 7 days: the renewal moment.
  students
    .filter((learner) => {
      const days = daysUntil(learner.expiresAt, now)
      return learner.status === 'active' && days !== null && days > 0 && days <= 7
    })
    .sort((a, b) => String(a.expiresAt).localeCompare(String(b.expiresAt)))
    .forEach((learner) => {
      const days = daysUntil(learner.expiresAt, now) as number
      push({
        key: `ending:${learner.id}:${toDateInput(learner.expiresAt)}`,
        icon: '⏳',
        title: `${learner.name}'s access ends in ${days} day${days === 1 ? '' : 's'}`,
        detail: `Ends ${formatThaiDate(learner.expiresAt)} · ${skillsLabel(learner.enabledModules)}`,
        learnerIds: [learner.id],
        actions: [
          { kind: 'renew', label: 'Renew…' },
          { kind: 'dismiss', label: 'Let it end', days: 30 }
        ]
      })
    })

  // 3. Ended, but the account still says active. One clean-up item instead of 26 rows.
  const expired = students.filter((learner) => enrollmentStatus(learner, now) === 'expired')
  if (expired.length) {
    push({
      key: `expired-still-on:${expired.length}`,
      icon: '🧹',
      title: `${expired.length} student${expired.length === 1 ? "'s" : "s'"} access has ended but still shows as on`,
      detail: 'They already can’t use the app. Mark them as ended to tidy the list, or renew anyone who paid again.',
      learnerIds: expired.map((learner) => learner.id),
      actions: [
        { kind: 'end-all-expired', label: `Mark ${expired.length} as ended` },
        { kind: 'filter', label: 'See them', search: 'status:expired' }
      ]
    })
  }

  // 4. Has access but no speaking feedback credits left.
  students
    .filter((learner) => hasLiveAccess(learner, now) && learner.feedbackRemaining <= 0)
    .forEach((learner) =>
      push({
        key: `no-credits:${learner.id}`,
        icon: '🪫',
        title: `${learner.name} has 0 feedback credits`,
        detail: 'They can’t get speaking feedback until credits are added.',
        learnerIds: [learner.id],
        actions: [
          { kind: 'add-feedback', label: '+10 feedback', amount: 10 },
          { kind: 'dismiss', label: 'Leave it', days: 30 }
        ]
      })
    )

  // 5. Access that never ends (usually a forgotten end date).
  students
    .filter((learner) => enrollmentStatus(learner, now) === 'no-end')
    .forEach((learner) =>
      push({
        key: `no-end:${learner.id}`,
        icon: '♾️',
        title: `${learner.name} has no end date`,
        detail: 'Their access never runs out. Set an end date, or keep it if that was on purpose.',
        learnerIds: [learner.id],
        actions: [
          { kind: 'open', label: 'Set end date…' },
          { kind: 'dismiss', label: 'Keep it', days: 365 }
        ]
      })
    )

  // 6. Has access but no skills switched on (can’t open anything).
  students
    .filter((learner) => hasLiveAccess(learner, now) && learner.enabledModules.length === 0)
    .forEach((learner) =>
      push({
        key: `no-skills:${learner.id}`,
        icon: '🚫',
        title: `${learner.name} has no skills switched on`,
        detail: 'They can log in but every course is locked.',
        learnerIds: [learner.id],
        actions: [{ kind: 'open', label: 'Choose package…' }]
      })
    )

  // 7. Same name on more than one account.
  const byName = new Map<string, EnrollmentLearner[]>()
  students.forEach((learner) => {
    const key = learner.name.trim().toLowerCase().replace(/\s+/g, ' ')
    if (key) byName.set(key, [...(byName.get(key) || []), learner])
  })
  byName.forEach((group) => {
    if (group.length < 2) return
    const ids = group.map((learner) => learner.id).sort()
    push({
      key: `duplicate:${ids.join(',')}`,
      icon: '👥',
      title: `"${group[0].name}" has ${group.length} accounts`,
      detail: group.map((learner) => learner.email).join(' · '),
      learnerIds: ids,
      actions: [
        { kind: 'filter', label: 'Review', search: group[0].name },
        { kind: 'dismiss', label: 'Not the same person', days: 365 }
      ]
    })
  })

  return items
}

// ── list filters ────────────────────────────────────────────────────────────────────────

export type LearnerFilter = 'all' | EnrollmentStatus | 'no-credits'

export const LEARNER_FILTERS: Array<{ key: LearnerFilter; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'waiting', label: 'Waiting' },
  { key: 'active', label: 'Active' },
  { key: 'ending', label: 'Ending soon' },
  { key: 'expired', label: 'Expired' },
  { key: 'no-end', label: 'No end date' },
  { key: 'off', label: 'Off' },
  { key: 'no-credits', label: 'No credits' }
]

export const matchesFilter = (learner: EnrollmentLearner, filter: LearnerFilter, now = new Date()) => {
  if (filter === 'all') return true
  if (filter === 'no-credits') return hasLiveAccess(learner, now) && learner.feedbackRemaining <= 0
  return enrollmentStatus(learner, now) === filter
}

/** Sort for the list: what needs action first, then newest. */
const STATUS_ORDER: Record<EnrollmentStatus, number> = { waiting: 0, ending: 1, 'no-end': 2, active: 3, expired: 4, off: 5 }
export const sortLearners = (learners: EnrollmentLearner[], now = new Date()) =>
  learners
    .slice()
    .sort(
      (a, b) =>
        STATUS_ORDER[enrollmentStatus(a, now)] - STATUS_ORDER[enrollmentStatus(b, now)] ||
        String(b.createdAt).localeCompare(String(a.createdAt))
    )
