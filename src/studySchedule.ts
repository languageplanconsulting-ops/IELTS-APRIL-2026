// When the student studies — the "pace" half of a study plan, kept separate from
// "which lessons" (that lives in bundlePlans / the per-course curricula).
//
// Two ways to say the same thing, because students think about their week in two
// different ways:
//
//   interval  — "every day", "every other day", "every 3 days"
//   weekdays  — "Mon / Fri / Sat" — the shape most working students actually keep
//
// Both produce the same thing downstream: an ordered list of study dates. Every
// other module only ever sees that list, so adding a third mode later costs
// nothing outside this file.

export type ScheduleMode = 'interval' | 'weekdays'

export type StudySchedule = {
  mode: ScheduleMode
  /** Used when mode === 'interval'. 1 = every day, 2 = every other day. */
  intervalDays: number
  /** Used when mode === 'weekdays'. 0 = Sunday … 6 = Saturday. */
  weekdays: number[]
  /** How long one sitting is. Drives how many lessons land on a study day. */
  minutesPerDay: number
  /** ISO yyyy-mm-dd — the earliest date a study day may be scheduled on. */
  startDateIso: string
}

export const WEEKDAYS_TH: { value: number; short: string; long: string }[] = [
  { value: 1, short: 'จ', long: 'จันทร์' },
  { value: 2, short: 'อ', long: 'อังคาร' },
  { value: 3, short: 'พ', long: 'พุธ' },
  { value: 4, short: 'พฤ', long: 'พฤหัส' },
  { value: 5, short: 'ศ', long: 'ศุกร์' },
  { value: 6, short: 'ส', long: 'เสาร์' },
  { value: 0, short: 'อา', long: 'อาทิตย์' }
]

export const INTERVAL_OPTIONS: { value: number; label: string }[] = [
  { value: 1, label: 'ทุกวัน' },
  { value: 2, label: 'วันเว้นวัน' },
  { value: 3, label: 'ทุก 3 วัน' },
  { value: 4, label: 'ทุก 4 วัน' },
  { value: 7, label: 'สัปดาห์ละครั้ง' }
]

/** Session lengths offered in the planner. Anything longer than 2 h is a lie about attention. */
export const MINUTE_OPTIONS: { value: number; label: string }[] = [
  { value: 15, label: '15 นาที' },
  { value: 30, label: '30 นาที' },
  { value: 45, label: '45 นาที' },
  { value: 60, label: '1 ชั่วโมง' },
  { value: 90, label: '1.5 ชั่วโมง' },
  { value: 120, label: '2 ชั่วโมง' }
]

/** Preset weekday shapes, so the common answers are one tap rather than five. */
export const WEEKDAY_PRESETS: { id: string; label: string; days: number[] }[] = [
  { id: 'weekdays', label: 'จันทร์–ศุกร์', days: [1, 2, 3, 4, 5] },
  { id: 'weekend', label: 'เสาร์–อาทิตย์', days: [0, 6] },
  { id: 'mwf', label: 'จ / พ / ศ', days: [1, 3, 5] },
  { id: 'everyday', label: 'ทุกวัน', days: [0, 1, 2, 3, 4, 5, 6] }
]

const pad2 = (n: number) => String(n).padStart(2, '0')

export const toIso = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`

export const fromIso = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, (m || 1) - 1, d || 1)
}

export const addDays = (iso: string, days: number) => {
  const d = fromIso(iso)
  d.setDate(d.getDate() + days)
  return toIso(d)
}

export const todayIso = () => toIso(new Date())

export const defaultSchedule = (): StudySchedule => ({
  mode: 'interval',
  intervalDays: 1,
  weekdays: [1, 3, 5],
  minutesPerDay: 45,
  startDateIso: todayIso()
})

/** Study days per 7 calendar days — the number both modes can be compared on. */
export function sessionsPerWeek(schedule: StudySchedule): number {
  if (schedule.mode === 'weekdays') return schedule.weekdays.length || 1
  return 7 / Math.max(1, schedule.intervalDays)
}

/**
 * The first `count` dates this schedule puts a study session on.
 *
 * Weekday mode walks forward day by day rather than doing modular arithmetic —
 * it is O(days) but `count` is in the low hundreds, and walking is the version
 * that stays obviously correct when someone later adds "skip public holidays".
 */
export function studyDates(schedule: StudySchedule, count: number): string[] {
  if (count <= 0) return []
  const start = schedule.startDateIso || todayIso()

  if (schedule.mode === 'interval') {
    const step = Math.max(1, schedule.intervalDays)
    return Array.from({ length: count }, (_, i) => addDays(start, i * step))
  }

  const allowed = new Set(schedule.weekdays.length ? schedule.weekdays : [1, 3, 5])
  const dates: string[] = []
  // Cap the walk so a corrupted schedule can never spin: 7 days per session is
  // the worst case for any non-empty weekday set, plus a week of slack.
  const maxDays = count * 7 + 7
  for (let offset = 0; offset < maxDays && dates.length < count; offset++) {
    const iso = addDays(start, offset)
    if (allowed.has(fromIso(iso).getDay())) dates.push(iso)
  }
  return dates
}

export function describeSchedule(schedule: StudySchedule): string {
  const minutes = MINUTE_OPTIONS.find((o) => o.value === schedule.minutesPerDay)?.label ?? `${schedule.minutesPerDay} นาที`
  if (schedule.mode === 'interval') {
    const interval = INTERVAL_OPTIONS.find((o) => o.value === schedule.intervalDays)?.label ?? `ทุก ${schedule.intervalDays} วัน`
    return `${interval} · ครั้งละ ${minutes}`
  }
  const picked = WEEKDAYS_TH.filter((w) => schedule.weekdays.includes(w.value)).map((w) => w.short)
  return `${picked.length ? picked.join(' · ') : 'ยังไม่เลือกวัน'} · ครั้งละ ${minutes}`
}

/** Guards a stored schedule coming back out of localStorage. */
export function parseSchedule(raw: unknown): StudySchedule | null {
  if (!raw || typeof raw !== 'object') return null
  const value = raw as Partial<StudySchedule>
  if (typeof value.minutesPerDay !== 'number' || value.minutesPerDay <= 0) return null
  if (typeof value.startDateIso !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value.startDateIso)) return null
  const weekdays = Array.isArray(value.weekdays)
    ? value.weekdays.filter((d): d is number => typeof d === 'number' && d >= 0 && d <= 6)
    : []
  return {
    mode: value.mode === 'weekdays' ? 'weekdays' : 'interval',
    intervalDays: typeof value.intervalDays === 'number' && value.intervalDays > 0 ? value.intervalDays : 1,
    weekdays: weekdays.length ? weekdays : [1, 3, 5],
    minutesPerDay: value.minutesPerDay,
    startDateIso: value.startDateIso
  }
}
