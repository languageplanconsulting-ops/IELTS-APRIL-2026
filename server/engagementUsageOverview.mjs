// Pure helpers for the admin "Usage by month" overview.
//
// The database function public.admin_usage_overview (supabase/usage-overview.sql)
// returns one flat result set per month with a `scope` column; these helpers turn
// that into a tidy object and parse the `?months=` query. Kept free of Express and
// Supabase so scripts/validate-usage-overview.ts can test them directly.

export const USAGE_OVERVIEW_DEFAULT_MONTH_COUNT = 4
export const USAGE_OVERVIEW_MAX_MONTH_COUNT = 12

const MONTH_PATTERN = /^(\d{4})-(0[1-9]|1[0-2])$/

const toCount = (value) => Math.max(0, Number(value || 0) || 0)

const pad2 = (value) => String(value).padStart(2, '0')

export const formatMonthKey = (year, month) => `${year}-${pad2(month)}`

// Walk back `count` calendar months from (and including) `endMonthKey`, oldest first.
export const listMonthsEndingAt = (endMonthKey, count) => {
  const match = MONTH_PATTERN.exec(endMonthKey)
  if (!match) return []
  let year = Number(match[1])
  let month = Number(match[2])
  const months = []
  for (let index = 0; index < count; index += 1) {
    months.unshift(formatMonthKey(year, month))
    month -= 1
    if (month === 0) {
      month = 12
      year -= 1
    }
  }
  return months
}

// `?months=2026-10,2026-11` -> ['2026-10', '2026-11']. With no usable value, the last
// few months ending at `currentMonthKey`. Throws a 400-style error on a malformed list.
export const parseUsageMonths = (rawValue, currentMonthKey) => {
  const raw = String(rawValue || '').trim()
  if (!raw) return listMonthsEndingAt(currentMonthKey, USAGE_OVERVIEW_DEFAULT_MONTH_COUNT)
  const requested = [...new Set(raw.split(',').map((part) => part.trim()).filter(Boolean))]
  if (!requested.length || requested.some((part) => !MONTH_PATTERN.test(part))) {
    const error = new Error('months must be a comma-separated list of YYYY-MM values.')
    error.status = 400
    throw error
  }
  if (requested.length > USAGE_OVERVIEW_MAX_MONTH_COUNT) {
    const error = new Error(`Ask for at most ${USAGE_OVERVIEW_MAX_MONTH_COUNT} months at a time.`)
    error.status = 400
    throw error
  }
  return requested.sort()
}

// Local calendar date (YYYY-MM-DD) of an instant, in the report's time zone.
export const toLocalDateKey = (instant, timeZone) => {
  const date = new Date(instant)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date)
}

const mapMetrics = (row) => ({
  seconds: toCount(row.active_seconds),
  learners: toCount(row.actor_count),
  sessions: toCount(row.session_count),
  segments: toCount(row.segment_count),
  activeDays: toCount(row.active_day_count)
})

// Turn the flat `scope` rows from admin_usage_overview into one month's report.
export const shapeUsageOverviewRows = (rows, { timeZone = 'Asia/Bangkok' } = {}) => {
  const list = Array.isArray(rows) ? rows : []
  const monthRow = list.find((row) => row.scope === 'month')
  const totals = monthRow
    ? mapMetrics(monthRow)
    : { seconds: 0, learners: 0, sessions: 0, segments: 0, activeDays: 0 }

  const daily = list
    .filter((row) => row.scope === 'day' && row.bucket_at)
    .map((row) => ({ date: toLocalDateKey(row.bucket_at, timeZone), ...mapMetrics(row) }))
    .filter((day) => day.date)
    .sort((left, right) => left.date.localeCompare(right.date))

  const featuresByPage = new Map()
  list
    .filter((row) => row.scope === 'feature')
    .forEach((row) => {
      const page = String(row.page || '')
      const bucket = featuresByPage.get(page) || []
      bucket.push({ feature: String(row.feature || ''), ...mapMetrics(row) })
      featuresByPage.set(page, bucket)
    })

  const functions = list
    .filter((row) => row.scope === 'page')
    .map((row) => {
      const page = String(row.page || '')
      return {
        page,
        ...mapMetrics(row),
        features: (featuresByPage.get(page) || []).sort((left, right) => right.seconds - left.seconds)
      }
    })
    .sort((left, right) => right.seconds - left.seconds || right.learners - left.learners)

  const averages = {
    secondsPerLearner: totals.learners ? Math.round(totals.seconds / totals.learners) : 0,
    activeDaysPerLearner: totals.learners ? Math.round((totals.activeDays / totals.learners) * 10) / 10 : 0,
    sessionsPerLearner: totals.learners ? Math.round((totals.sessions / totals.learners) * 10) / 10 : 0
  }

  return { totals, averages, daily, functions }
}

// PostgREST says this when a function has not been created in the database yet.
export const isMissingUsageFunctionError = (error) => {
  const code = String(error?.payload?.code || '')
  const message = String(error?.payload?.message || error?.message || '')
  return (
    code === 'PGRST202' ||
    code === '42883' ||
    /could not find the function/i.test(message) ||
    /function .*admin_usage_overview.* does not exist/i.test(message)
  )
}
