import { useEffect, useMemo, useState } from 'react'
import { formatEngagementDuration } from '../engagementTracking'

type UsageMetrics = {
  seconds: number
  learners: number
  sessions: number
  segments: number
  activeDays: number
}
type UsageFeature = UsageMetrics & { feature: string }
type UsageFunction = UsageMetrics & { page: string; features: UsageFeature[] }
type UsageDay = UsageMetrics & { date: string }
type UsageMonth = {
  month: string
  totals: UsageMetrics
  averages: { secondsPerLearner: number; activeDaysPerLearner: number; sessionsPerLearner: number }
  daily: UsageDay[]
  functions: UsageFunction[]
}
type UsagePayload = {
  setupNeeded: boolean
  currentMonth: string
  learnerCounts: { registered: number; withActiveAccess: number } | null
  months: UsageMonth[]
}

type ApiRecord = Record<string, unknown>
const isRecord = (value: unknown): value is ApiRecord =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value)
const asRecords = (value: unknown): ApiRecord[] => (Array.isArray(value) ? value.filter(isRecord) : [])
const num = (value: unknown) => Math.max(0, Number(value) || 0)

const readMetrics = (row: ApiRecord): UsageMetrics => ({
  seconds: num(row.seconds),
  learners: num(row.learners),
  sessions: num(row.sessions),
  segments: num(row.segments),
  activeDays: num(row.activeDays)
})

const normalizeUsage = (payload: unknown): UsagePayload => {
  const root = isRecord(payload) ? payload : {}
  const counts = isRecord(root.learnerCounts) ? root.learnerCounts : null
  return {
    setupNeeded: Boolean(root.setupNeeded),
    currentMonth: String(root.currentMonth || ''),
    learnerCounts: counts
      ? { registered: num(counts.registered), withActiveAccess: num(counts.withActiveAccess) }
      : null,
    months: asRecords(root.months).map((month) => {
      const averages = isRecord(month.averages) ? month.averages : {}
      return {
        month: String(month.month || ''),
        totals: readMetrics(isRecord(month.totals) ? month.totals : {}),
        averages: {
          secondsPerLearner: num(averages.secondsPerLearner),
          activeDaysPerLearner: num(averages.activeDaysPerLearner),
          sessionsPerLearner: num(averages.sessionsPerLearner)
        },
        daily: asRecords(month.daily).map((day) => ({ date: String(day.date || ''), ...readMetrics(day) })),
        functions: asRecords(month.functions).map((item) => ({
          page: String(item.page || ''),
          ...readMetrics(item),
          features: asRecords(item.features).map((feature) => ({
            feature: String(feature.feature || ''),
            ...readMetrics(feature)
          }))
        }))
      }
    })
  }
}

// Plain names for the app's areas. Anything new still shows up, just with a tidied raw name.
const FUNCTION_NAMES: Record<string, string> = {
  speaking: 'Speaking',
  writing: 'Writing',
  reading: 'Reading',
  listening: 'Listening',
  sat: 'SAT',
  notebook: 'Notebook',
  home: 'Home page',
  examfeed: 'Exam feed',
  course: 'Course',
  bitesize: 'Bite Size',
  admin: 'Admin tools'
}

const titleCase = (value: string) =>
  value
    .replace(/[-_.]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

const functionName = (page: string) => FUNCTION_NAMES[page] || titleCase(page || 'Unknown')

const featureName = (page: string, feature: string) => {
  const rest = feature.startsWith(`${page}.`) ? feature.slice(page.length + 1) : feature
  return rest && rest !== page ? titleCase(rest) : 'Main page'
}

const monthLabel = (month: string, style: 'long' | 'short' = 'long') => {
  const [year, monthNumber] = month.split('-').map(Number)
  if (!year || !monthNumber) return month
  return new Date(Date.UTC(year, monthNumber - 1, 1)).toLocaleDateString('en-GB', {
    month: style,
    year: 'numeric',
    timeZone: 'UTC'
  })
}

const previousMonthKey = (month: string) => {
  const [year, monthNumber] = month.split('-').map(Number)
  if (!year || !monthNumber) return ''
  const date = new Date(Date.UTC(year, monthNumber - 2, 1))
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
}

const daysInMonth = (month: string) => {
  const [year, monthNumber] = month.split('-').map(Number)
  if (!year || !monthNumber) return 0
  return new Date(Date.UTC(year, monthNumber, 0)).getUTCDate()
}

const changeLabel = (current: number, previous: number | null) => {
  if (previous === null) return ''
  if (previous === 0) return current > 0 ? 'new' : ''
  const percent = Math.round(((current - previous) / previous) * 100)
  if (percent === 0) return 'same'
  return `${percent > 0 ? '+' : '−'}${Math.abs(percent)}%`
}

const changeTone = (label: string) =>
  label.startsWith('+') || label === 'new' ? 'up' : label.startsWith('−') ? 'down' : 'flat'

function DailyBars({ month, days }: { month: string; days: UsageDay[] }) {
  const total = daysInMonth(month)
  const byDate = new Map(days.map((day) => [day.date, day]))
  const cells = Array.from({ length: total }, (_, index) => {
    const dayNumber = index + 1
    const date = `${month}-${String(dayNumber).padStart(2, '0')}`
    return { dayNumber, date, data: byDate.get(date) || null }
  })
  const peak = Math.max(1, ...cells.map((cell) => cell.data?.learners || 0))

  return (
    <div className="adminUsageDaily" role="img" aria-label={`Learners active each day in ${monthLabel(month)}`}>
      {cells.map((cell) => {
        const learners = cell.data?.learners || 0
        return (
          <div
            key={cell.date}
            className="adminUsageDailyCol"
            title={`${monthLabel(month, 'short').split(' ')[0]} ${cell.dayNumber}: ${learners} learner${learners === 1 ? '' : 's'}${
              cell.data ? ` · ${formatEngagementDuration(cell.data.seconds)}` : ''
            }`}
          >
            <span className="adminUsageDailyCount">{learners || ''}</span>
            <span className="adminUsageDailyBar" style={{ height: `${Math.max(learners ? 6 : 2, (learners / peak) * 100)}%` }} />
            <span className="adminUsageDailyDay">{cell.dayNumber === 1 || cell.dayNumber % 5 === 0 ? cell.dayNumber : ''}</span>
          </div>
        )
      })}
    </div>
  )
}

export function UsageOverview({ accessToken }: { accessToken: string }) {
  const [learnersOnly, setLearnersOnly] = useState(true)
  const [data, setData] = useState<UsagePayload | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [pickedMonth, setPickedMonth] = useState('')
  const [openPage, setOpenPage] = useState('')

  useEffect(() => {
    if (!accessToken) return
    let cancelled = false
    queueMicrotask(() => {
      if (!cancelled) {
        setLoading(true)
        setError('')
      }
    })
    void fetch(`/api/admin/engagement/usage-overview?learnersOnly=${learnersOnly ? '1' : '0'}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
      .then(async (response) => {
        const payload = await response.json().catch(() => ({}))
        if (!response.ok) {
          throw new Error(payload?.error?.message || payload?.message || 'Could not load the usage overview.')
        }
        if (!cancelled) setData(normalizeUsage(payload))
      })
      .catch((caught) => {
        if (!cancelled) setError(caught instanceof Error ? caught.message : 'Could not load the usage overview.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [accessToken, learnersOnly])

  const months = useMemo(() => data?.months || [], [data])
  const selectedKey = months.some((item) => item.month === pickedMonth)
    ? pickedMonth
    : months.some((item) => item.month === data?.currentMonth)
      ? data?.currentMonth || ''
      : months[months.length - 1]?.month || ''
  const selected = months.find((item) => item.month === selectedKey) || null
  const previous = months.find((item) => item.month === previousMonthKey(selectedKey)) || null
  const registered = data?.learnerCounts?.registered || 0

  return (
    <section className="adminUsage">
      <div className="adminEngagementHero">
        <div>
          <p className="sectionLabel">Usage by month</p>
          <h3>How much do learners use the app?</h3>
          <p className="meta">
            Time is counted only while a learner is really on the screen (hidden tabs and 2+ minutes of doing nothing are
            skipped). Pick a month to see every part of the app.
          </p>
        </div>
        <div className="adminEngagementTabs" role="tablist" aria-label="Who to count">
          <button type="button" className={learnersOnly ? 'active' : ''} onClick={() => setLearnersOnly(true)}>
            Learners only
          </button>
          <button type="button" className={learnersOnly ? '' : 'active'} onClick={() => setLearnersOnly(false)}>
            Include admin
          </button>
        </div>
      </div>

      {error ? <p className="authError">{error}</p> : null}

      {data?.setupNeeded ? (
        <article className="adminEngagementPanel adminUsageSetup">
          <h4>One quick setup step</h4>
          <p className="meta">
            This screen needs one small database function that has not been added yet. In Supabase, open the SQL Editor,
            paste the contents of <strong>supabase/usage-overview.sql</strong>, and press Run. It only reads data — nothing
            is changed or deleted. Then reload this page.
          </p>
        </article>
      ) : null}

      {!data && loading ? <p className="meta">Loading usage…</p> : null}

      {data && !data.setupNeeded ? (
        <>
          <div className={`adminUsageMonths ${loading ? 'is-loading' : ''}`}>
            {months.map((item) => {
              const isSelected = item.month === selectedKey
              return (
                <button
                  key={item.month}
                  type="button"
                  className={`adminUsageMonthCard ${isSelected ? 'is-selected' : ''}`}
                  aria-pressed={isSelected}
                  onClick={() => {
                    setPickedMonth(item.month)
                    setOpenPage('')
                  }}
                >
                  <span>{monthLabel(item.month)}</span>
                  <strong>{item.totals.learners}</strong>
                  <small>
                    active learner{item.totals.learners === 1 ? '' : 's'} · {formatEngagementDuration(item.totals.seconds)}
                  </small>
                </button>
              )
            })}
          </div>

          {selected ? (
            <>
              <div className={`adminEngagementKpis ${loading ? 'is-loading' : ''}`}>
                <article>
                  <span>Active learners</span>
                  <strong>{selected.totals.learners.toLocaleString()}</strong>
                  <small>
                    {registered
                      ? `of ${registered.toLocaleString()} learners (${Math.round((selected.totals.learners / registered) * 100)}%)`
                      : 'in this month'}
                  </small>
                </article>
                <article>
                  <span>Total time</span>
                  <strong>{formatEngagementDuration(selected.totals.seconds)}</strong>
                  <small>{selected.totals.sessions.toLocaleString()} visits in total</small>
                </article>
                <article>
                  <span>Time per learner</span>
                  <strong>{formatEngagementDuration(selected.averages.secondsPerLearner)}</strong>
                  <small>average for the month</small>
                </article>
                <article>
                  <span>Days used per learner</span>
                  <strong>{selected.averages.activeDaysPerLearner.toLocaleString()}</strong>
                  <small>out of {daysInMonth(selected.month)} days</small>
                </article>
              </div>

              {selected.totals.seconds === 0 ? (
                <p className="meta">No learner time was recorded in {monthLabel(selected.month)}.</p>
              ) : null}

              <article className="adminEngagementPanel">
                <div className="adminEngagementPanelHead">
                  <div>
                    <p className="sectionLabel">Day by day</p>
                    <h4>Learners active each day in {monthLabel(selected.month)}</h4>
                  </div>
                </div>
                <DailyBars month={selected.month} days={selected.daily} />
              </article>

              <article className="adminEngagementPanel">
                <div className="adminEngagementPanelHead">
                  <div>
                    <p className="sectionLabel">By function</p>
                    <h4>Every part of the app, {monthLabel(selected.month)}</h4>
                  </div>
                  <span>{previous ? `change vs ${monthLabel(previous.month, 'short')}` : ''}</span>
                </div>
                {selected.functions.length ? (
                  <div className="adminUsageFunctions">
                    <div className="adminUsageFunctionHead">
                      <span>Function</span>
                      <span>Learners</span>
                      <span>Time</span>
                      <span>Share of time</span>
                      <span>vs last month</span>
                    </div>
                    {selected.functions.map((item) => {
                      const share = selected.totals.seconds ? (item.seconds / selected.totals.seconds) * 100 : 0
                      const before = previous ? previous.functions.find((row) => row.page === item.page) : null
                      const change = changeLabel(item.seconds, previous ? before?.seconds ?? 0 : null)
                      const isOpen = openPage === item.page
                      return (
                        <div key={item.page} className="adminUsageFunctionGroup">
                          <button
                            type="button"
                            className="adminUsageFunctionRow"
                            aria-expanded={isOpen}
                            onClick={() => setOpenPage(isOpen ? '' : item.page)}
                          >
                            <span className="adminUsageFunctionName">
                              <i aria-hidden="true">{isOpen ? '▾' : '▸'}</i>
                              {functionName(item.page)}
                            </span>
                            <span>{item.learners.toLocaleString()}</span>
                            <strong>{formatEngagementDuration(item.seconds)}</strong>
                            <span className="adminUsageShare">
                              <span className="adminUsageShareTrack">
                                <span style={{ width: `${Math.max(share, item.seconds ? 2 : 0)}%` }} />
                              </span>
                              <em>{Math.round(share)}%</em>
                            </span>
                            <span className={`adminUsageChange adminUsageChange-${changeTone(change)}`}>{change || '—'}</span>
                          </button>
                          {isOpen ? (
                            <div className="adminUsageFeatureList">
                              {item.features.map((feature) => (
                                <div key={feature.feature} className="adminUsageFeatureRow">
                                  <span>{featureName(item.page, feature.feature)}</span>
                                  <span>{feature.learners.toLocaleString()}</span>
                                  <span>{formatEngagementDuration(feature.seconds)}</span>
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="meta">Nothing recorded for this month.</p>
                )}
              </article>
            </>
          ) : null}
        </>
      ) : null}
    </section>
  )
}
