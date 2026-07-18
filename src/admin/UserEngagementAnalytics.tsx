import { useEffect, useMemo, useState } from 'react'
import { formatEngagementDuration } from '../engagementTracking'

export type EngagementPeriod = 'day' | 'month' | 'total'

export type EngagementRankedActor = {
  actorKey: string
  userId: string | null
  name: string
  email: string
  role: string
  totalSeconds: number
  lastActiveAt: string | null
  dominantFeature: string
}

type EngagementMetric = {
  key: string
  label: string
  seconds: number
  activeAccounts?: number
}

type EngagementSummary = {
  period: EngagementPeriod
  trackingSince: string | null
  rangeStart: string | null
  rangeEnd: string | null
  totals: {
    activeAccounts: number
    totalSeconds: number
    averageSeconds: number
    topFeature: string
  }
  rankings: EngagementRankedActor[]
  features: EngagementMetric[]
  activities: EngagementMetric[]
  trend: EngagementMetric[]
}

export type EngagementActorDetail = {
  actor: {
    actorKey: string
    userId: string | null
    name: string
    email: string
    role: string
  }
  totalSeconds: number
  firstActiveAt: string | null
  lastActiveAt: string | null
  features: EngagementMetric[]
  activities: EngagementMetric[]
  trend: EngagementMetric[]
  journey: Array<{
    id: string
    page: string
    feature: string
    activityType: string
    activityId: string
    label: string
    activeSeconds: number
    startedAt: string
    endedAt: string | null
  }>
}

const emptySummary: EngagementSummary = {
  period: 'day',
  trackingSince: null,
  rangeStart: null,
  rangeEnd: null,
  totals: { activeAccounts: 0, totalSeconds: 0, averageSeconds: 0, topFeature: '—' },
  rankings: [],
  features: [],
  activities: [],
  trend: []
}

const aggregateMetrics = (
  rows: Array<Record<string, unknown>>,
  keyFor: (row: Record<string, unknown>) => string,
  labelFor: (row: Record<string, unknown>) => string
) => {
  const totals = new Map<string, EngagementMetric>()
  rows.forEach((row) => {
    const key = keyFor(row)
    if (!key) return
    const current = totals.get(key) || { key, label: labelFor(row), seconds: 0, activeAccounts: 0 }
    current.seconds += Number(row.seconds ?? row.activeSeconds ?? row.active_seconds ?? 0) || 0
    current.activeAccounts = Math.max(
      current.activeAccounts || 0,
      Number(row.activeAccounts ?? row.actorCount ?? row.actor_count ?? 0) || 0
    )
    totals.set(key, current)
  })
  return [...totals.values()].sort((a, b) => b.seconds - a.seconds)
}

type ApiRecord = Record<string, unknown>
const isApiRecord = (value: unknown): value is ApiRecord =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value)
const asRecordArray = (value: unknown): ApiRecord[] => (Array.isArray(value) ? value.filter(isApiRecord) : [])
const asNullableString = (value: unknown) => (typeof value === 'string' && value ? value : null)

const normalizeSummary = (payload: ApiRecord): EngagementSummary => {
  const totalsPayload = isApiRecord(payload.totals) ? payload.totals : {}
  const rangePayload = isApiRecord(payload.range) ? payload.range : {}
  const rawFeatureRows = asRecordArray(payload.features)
  const features = aggregateMetrics(
    rawFeatureRows,
    (row) => String(row.feature || row.key || ''),
    (row) => featureLabel(String(row.feature || row.label || row.key || ''))
  )
  const activities = aggregateMetrics(
    rawFeatureRows.filter((row: Record<string, unknown>) => String(row.activityId || row.activity_id || '')),
    (row) => String(row.activityId || row.activity_id || ''),
    (row) => String(row.label || row.activityId || row.activity_id || '')
  )
  const rawRankings = asRecordArray(Array.isArray(payload.rankings) ? payload.rankings : payload.ranking)
  const rankings: EngagementRankedActor[] = rawRankings.map((actor) => ({
    actorKey: String(actor.actorKey || actor.actor_key || ''),
    userId: asNullableString(actor.userId || actor.user_id),
    name: String(actor.name || actor.displayName || actor.display_name || actor.actorKey || 'Unknown account'),
    email: String(actor.email || ''),
    role: String(actor.role || actor.accountRole || actor.account_role || ''),
    totalSeconds: Number(actor.totalSeconds ?? actor.activeSeconds ?? actor.active_seconds ?? 0) || 0,
    lastActiveAt: asNullableString(actor.lastActiveAt || actor.lastSeenAt || actor.last_seen_at),
    dominantFeature: String(actor.dominantFeature || actor.dominant_feature || '')
  }))
  const rawTrend = asRecordArray(payload.trend)
  const trend = rawTrend.map((item) => {
    const bucket = item.bucketAt || item.bucket_at || item.key
    const date = bucket ? new Date(String(bucket)) : null
    return {
      key: String(bucket || item.label || ''),
      label: String(
        item.label ||
          (date && Number.isFinite(date.getTime())
            ? payload.period === 'day'
              ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : date.toLocaleDateString([], { month: 'short', day: 'numeric' })
            : '')
      ),
      seconds: Number(item.seconds ?? item.activeSeconds ?? item.active_seconds ?? 0) || 0,
      activeAccounts: Number(item.activeAccounts ?? item.actorCount ?? item.actor_count ?? 0) || 0
    }
  })
  const totalSeconds = Number(totalsPayload.totalSeconds ?? totalsPayload.activeSeconds ?? 0) || 0
  const activeAccounts = Number(totalsPayload.activeAccounts ?? totalsPayload.actorCount ?? rankings.length) || 0
  const trackingCandidates = rankings
    .map((_, index) =>
      rawRankings[index]?.firstStartedAt || rawRankings[index]?.first_started_at || null
    )
    .filter(Boolean)
    .sort()
  return {
    period: payload.period === 'month' || payload.period === 'total' ? payload.period : 'day',
    trackingSince: asNullableString(payload.trackingSince || trackingCandidates[0]),
    rangeStart: asNullableString(payload.rangeStart || rangePayload.startAt),
    rangeEnd: asNullableString(payload.rangeEnd || rangePayload.endAt),
    totals: {
      activeAccounts,
      totalSeconds,
      averageSeconds: activeAccounts ? Math.round(totalSeconds / activeAccounts) : 0,
      topFeature: String(totalsPayload.topFeature || features[0]?.key || '—')
    },
    rankings,
    features,
    activities,
    trend
  }
}

// eslint-disable-next-line react-refresh/only-export-components
export const normalizeEngagementActorDetail = (payload: ApiRecord): EngagementActorDetail => {
  const journey = asRecordArray(payload.journey).map((item) => ({
    id: String(item.id || item.segmentId || item.segment_id || ''),
    page: String(item.page || ''),
    feature: String(item.feature || ''),
    activityType: String(item.activityType || item.activity_type || ''),
    activityId: String(item.activityId || item.activity_id || ''),
    label: String(item.label || ''),
    activeSeconds: Number(item.activeSeconds ?? item.active_seconds ?? 0) || 0,
    startedAt: String(item.startedAt || item.started_at || ''),
    endedAt: asNullableString(item.endedAt || item.ended_at || item.lastSeenAt || item.last_seen_at)
  }))
  const rows = journey as unknown as Array<Record<string, unknown>>
  const features = aggregateMetrics(rows, (row) => String(row.feature || ''), (row) => featureLabel(String(row.feature || '')))
  const activities = aggregateMetrics(
    rows.filter((row) => Boolean(row.activityId)),
    (row) => String(row.activityId || ''),
    (row) => String(row.label || row.activityId || '')
  )
  const trend = aggregateMetrics(
    rows,
    (row) => String(row.startedAt || '').slice(0, 10),
    (row) => {
      const value = String(row.startedAt || '').slice(0, 10)
      return value ? new Date(`${value}T00:00:00`).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ''
    }
  ).sort((a, b) => a.key.localeCompare(b.key))
  const sortedDates = journey.map((item) => item.startedAt).filter(Boolean).sort()
  const totalsPayload = isApiRecord(payload.totals) ? payload.totals : {}
  const actorPayload = isApiRecord(payload.actor) ? payload.actor : {}
  return {
    actor: {
      actorKey: String(actorPayload.actorKey || actorPayload.actor_key || ''),
      userId: asNullableString(actorPayload.userId || actorPayload.user_id),
      name: String(actorPayload.name || actorPayload.displayName || actorPayload.display_name || ''),
      email: String(actorPayload.email || ''),
      role: String(actorPayload.role || actorPayload.accountRole || actorPayload.account_role || '')
    },
    totalSeconds:
      Number(payload.totalSeconds ?? totalsPayload.totalSeconds ?? totalsPayload.activeSeconds ?? 0) ||
      journey.reduce((sum, item) => sum + item.activeSeconds, 0),
    firstActiveAt: asNullableString(payload.firstActiveAt || sortedDates[0]),
    lastActiveAt:
      asNullableString(
        payload.lastActiveAt ||
          journey.map((item) => item.endedAt || item.startedAt).filter(Boolean).sort().at(-1)
      ),
    features: asRecordArray(payload.features).length
      ? asRecordArray(payload.features).map((item) => ({
          key: String(item.key || item.feature || ''),
          label: String(item.label || item.key || item.feature || ''),
          seconds: Number(item.seconds ?? item.activeSeconds ?? 0) || 0
        }))
      : features,
    activities: asRecordArray(payload.activities).length
      ? asRecordArray(payload.activities).map((item) => ({
          key: String(item.key || item.activityId || ''),
          label: String(item.label || item.key || item.activityId || ''),
          seconds: Number(item.seconds ?? item.activeSeconds ?? 0) || 0
        }))
      : activities,
    trend: asRecordArray(payload.trend).length
      ? asRecordArray(payload.trend).map((item) => ({
          key: String(item.key || ''),
          label: String(item.label || item.key || ''),
          seconds: Number(item.seconds ?? item.activeSeconds ?? 0) || 0
        }))
      : trend,
    journey
  }
}

const featureLabel = (value: string) =>
  String(value || 'Unknown')
    .replace(/\./g, ' · ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

const apiJson = async <T,>(url: string, token: string): Promise<T> => {
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(payload?.error?.message || payload?.message || 'Could not load engagement analytics.')
  }
  return payload as T
}

function TrendChart({ points }: { points: EngagementMetric[] }) {
  const width = 620
  const height = 210
  const left = 32
  const right = 18
  const top = 18
  const bottom = 38
  const max = Math.max(...points.map((point) => point.seconds), 1)
  const innerWidth = width - left - right
  const innerHeight = height - top - bottom
  const coordinates = points.map((point, index) => ({
    ...point,
    x: left + (points.length <= 1 ? innerWidth / 2 : (index / (points.length - 1)) * innerWidth),
    y: top + innerHeight - (point.seconds / max) * innerHeight
  }))
  const path = coordinates.map((point, index) => `${index ? 'L' : 'M'} ${point.x} ${point.y}`).join(' ')
  const area = coordinates.length
    ? `${path} L ${coordinates[coordinates.length - 1].x} ${top + innerHeight} L ${coordinates[0].x} ${
        top + innerHeight
      } Z`
    : ''

  return (
    <div className="adminEngagementTrendWrap">
      <svg viewBox={`0 0 ${width} ${height}`} className="adminEngagementTrend" role="img" aria-label="Active time trend">
        <defs>
          <linearGradient id="engagementAreaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = top + innerHeight * ratio
          return <line key={ratio} x1={left} y1={y} x2={width - right} y2={y} className="adminEngagementGridLine" />
        })}
        {area ? <path d={area} fill="url(#engagementAreaFill)" /> : null}
        {path ? <path d={path} className="adminEngagementTrendLine" /> : null}
        {coordinates.map((point) => (
          <g key={point.key}>
            <circle cx={point.x} cy={point.y} r="4.5" className="adminEngagementTrendDot" />
            <title>{`${point.label}: ${formatEngagementDuration(point.seconds)}`}</title>
          </g>
        ))}
        {coordinates
          .filter((_, index) => index === 0 || index === coordinates.length - 1 || index % Math.ceil(coordinates.length / 6) === 0)
          .map((point) => (
            <text key={`label-${point.key}`} x={point.x} y={height - 12} textAnchor="middle" className="adminEngagementAxisLabel">
              {point.label}
            </text>
          ))}
      </svg>
    </div>
  )
}

function BreakdownBars({ items, emptyLabel }: { items: EngagementMetric[]; emptyLabel: string }) {
  const max = Math.max(...items.map((item) => item.seconds), 1)
  if (!items.length) return <p className="meta">{emptyLabel}</p>
  return (
    <div className="adminEngagementBars">
      {items.slice(0, 10).map((item, index) => (
        <div key={item.key} className="adminEngagementBarRow">
          <span className="adminEngagementBarRank">{String(index + 1).padStart(2, '0')}</span>
          <div className="adminEngagementBarBody">
            <div className="adminEngagementBarMeta">
              <strong>{item.label || featureLabel(item.key)}</strong>
              <span>{formatEngagementDuration(item.seconds)}</span>
            </div>
            <div className="adminEngagementBarTrack">
              <span style={{ width: `${Math.max(3, (item.seconds / max) * 100)}%` }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function FeatureDonut({ items }: { items: EngagementMetric[] }) {
  const colors = ['#2563eb', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444', '#06b6d4']
  const total = items.reduce((sum, item) => sum + item.seconds, 0)
  let cursor = 0
  const gradient = items.length
    ? items
        .slice(0, 6)
        .map((item, index) => {
          const start = cursor
          cursor += total ? (item.seconds / total) * 100 : 0
          return `${colors[index % colors.length]} ${start}% ${cursor}%`
        })
        .join(', ')
    : '#e2e8f0 0 100%'
  return (
    <div className="adminEngagementDonutLayout">
      <div className="adminEngagementDonut" style={{ background: `conic-gradient(${gradient})` }}>
        <span>
          <strong>{formatEngagementDuration(total)}</strong>
          <small>tracked</small>
        </span>
      </div>
      <div className="adminEngagementLegend">
        {items.slice(0, 6).map((item, index) => (
          <div key={item.key}>
            <i style={{ background: colors[index % colors.length] }} />
            <span>{item.label || featureLabel(item.key)}</span>
            <strong>{total ? Math.round((item.seconds / total) * 100) : 0}%</strong>
          </div>
        ))}
      </div>
    </div>
  )
}

function ActorJourneyDrawer({
  actor,
  detail,
  loading,
  error,
  onClose
}: {
  actor: EngagementRankedActor
  detail: EngagementActorDetail | null
  loading: boolean
  error: string
  onClose: () => void
}) {
  return (
    <div className="adminEngagementDrawerBackdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="adminEngagementDrawer" role="dialog" aria-modal="true" aria-label={`${actor.name} engagement journey`}>
        <header className="adminEngagementDrawerHeader">
          <div>
            <p className="sectionLabel">Time &amp; Journey</p>
            <h3>{actor.name}</h3>
            <p className="meta">{actor.email || actor.actorKey}</p>
          </div>
          <button type="button" className="secondary" onClick={onClose}>Close</button>
        </header>
        {loading ? <p className="meta">Loading engagement journey…</p> : null}
        {error ? <p className="authError">{error}</p> : null}
        {detail ? (
          <div className="adminEngagementDrawerBody">
            <div className="adminEngagementMiniStats">
              <article><span>Total active time</span><strong>{formatEngagementDuration(detail.totalSeconds)}</strong></article>
              <article><span>First tracked</span><strong>{detail.firstActiveAt ? new Date(detail.firstActiveAt).toLocaleDateString() : '—'}</strong></article>
              <article><span>Last active</span><strong>{detail.lastActiveAt ? new Date(detail.lastActiveAt).toLocaleString() : '—'}</strong></article>
            </div>
            <article className="adminEngagementPanel">
              <div className="adminEngagementPanelHead"><h4>Activity trend</h4></div>
              <TrendChart points={detail.trend} />
            </article>
            <div className="adminEngagementSplit">
              <article className="adminEngagementPanel">
                <div className="adminEngagementPanelHead"><h4>Time by feature</h4></div>
                <BreakdownBars items={detail.features} emptyLabel="No feature time recorded." />
              </article>
              <article className="adminEngagementPanel">
                <div className="adminEngagementPanelHead"><h4>Tests &amp; activities</h4></div>
                <BreakdownBars items={detail.activities} emptyLabel="No test time recorded." />
              </article>
            </div>
            <article className="adminEngagementPanel">
              <div className="adminEngagementPanelHead"><h4>Chronological journey</h4><span>{detail.journey.length} segments</span></div>
              <div className="adminEngagementJourney">
                {detail.journey.length ? detail.journey.map((item) => (
                  <div key={item.id} className="adminEngagementJourneyItem">
                    <i />
                    <div>
                      <strong>{item.label || featureLabel(item.feature)}</strong>
                      <span>{featureLabel(item.feature)} · {formatEngagementDuration(item.activeSeconds)}</span>
                    </div>
                    <time>{new Date(item.startedAt).toLocaleString()}</time>
                  </div>
                )) : <p className="meta">No journey segments recorded in this period.</p>}
              </div>
            </article>
          </div>
        ) : null}
      </section>
    </div>
  )
}

export function UserEngagementAnalytics({ accessToken }: { accessToken: string }) {
  const [period, setPeriod] = useState<EngagementPeriod>('day')
  const [day, setDay] = useState(() => new Date().toISOString().slice(0, 10))
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7))
  const [summary, setSummary] = useState<EngagementSummary>(emptySummary)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedActor, setSelectedActor] = useState<EngagementRankedActor | null>(null)
  const [actorDetail, setActorDetail] = useState<EngagementActorDetail | null>(null)
  const [actorLoading, setActorLoading] = useState(false)
  const [actorError, setActorError] = useState('')

  const query = useMemo(() => {
    const params = new URLSearchParams({ period, timezone: 'Asia/Bangkok' })
    if (period === 'day') params.set('date', day)
    if (period === 'month') params.set('month', month)
    return params.toString()
  }, [day, month, period])

  useEffect(() => {
    if (!accessToken) return
    let cancelled = false
    queueMicrotask(() => {
      if (!cancelled) {
        setLoading(true)
        setError('')
      }
    })
    void apiJson<ApiRecord>(`/api/admin/engagement/summary?${query}`, accessToken)
      .then((payload) => {
        if (!cancelled) setSummary(normalizeSummary(payload))
      })
      .catch((caught) => {
        if (!cancelled) setError(caught instanceof Error ? caught.message : 'Could not load engagement analytics.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [accessToken, query])

  useEffect(() => {
    if (!selectedActor || !accessToken) return
    let cancelled = false
    queueMicrotask(() => {
      if (!cancelled) {
        setActorLoading(true)
        setActorError('')
        setActorDetail(null)
      }
    })
    void apiJson<ApiRecord>(
      `/api/admin/engagement/actors/${encodeURIComponent(selectedActor.actorKey)}?${query}`,
      accessToken
    )
      .then((payload) => {
        if (!cancelled) setActorDetail(normalizeEngagementActorDetail(payload))
      })
      .catch((caught) => {
        if (!cancelled) setActorError(caught instanceof Error ? caught.message : 'Could not load this journey.')
      })
      .finally(() => {
        if (!cancelled) setActorLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [accessToken, query, selectedActor])

  return (
    <div className="adminEngagementAnalytics">
      <div className="adminEngagementHero">
        <div>
          <p className="sectionLabel">User Engagement</p>
          <h3>Active Time &amp; Learning Journeys</h3>
          <p className="meta">Foreground activity only. Hidden tabs and users idle for over two minutes are excluded.</p>
        </div>
        <div className="adminEngagementPeriodControls">
          <div className="adminEngagementTabs" role="tablist" aria-label="Engagement period">
            {(['day', 'month', 'total'] as const).map((item) => (
              <button key={item} type="button" className={period === item ? 'active' : ''} onClick={() => setPeriod(item)}>
                {item === 'day' ? 'Day' : item === 'month' ? 'Month' : 'All Time'}
              </button>
            ))}
          </div>
          {period === 'day' ? <input type="date" value={day} onChange={(event) => setDay(event.target.value)} /> : null}
          {period === 'month' ? <input type="month" value={month} onChange={(event) => setMonth(event.target.value)} /> : null}
        </div>
      </div>

      {summary.trackingSince ? (
        <p className="adminEngagementTrackingSince">Tracking since {new Date(summary.trackingSince).toLocaleString()}</p>
      ) : null}
      {error ? <p className="authError">{error}</p> : null}

      <div className={`adminEngagementKpis ${loading ? 'is-loading' : ''}`}>
        <article><span>Active accounts</span><strong>{summary.totals.activeAccounts.toLocaleString()}</strong><small>including admin accounts</small></article>
        <article><span>Total active time</span><strong>{formatEngagementDuration(summary.totals.totalSeconds)}</strong><small>foreground engagement</small></article>
        <article><span>Average / account</span><strong>{formatEngagementDuration(summary.totals.averageSeconds)}</strong><small>for selected period</small></article>
        <article><span>Top feature</span><strong>{featureLabel(summary.totals.topFeature)}</strong><small>by active time</small></article>
      </div>

      <div className="adminEngagementOverviewGrid">
        <article className="adminEngagementPanel adminEngagementPanel-wide">
          <div className="adminEngagementPanelHead"><div><p className="sectionLabel">Engagement trend</p><h4>Active time over the selected period</h4></div></div>
          {summary.trend.length ? <TrendChart points={summary.trend} /> : <p className="meta">No tracked time in this period yet.</p>}
        </article>
        <article className="adminEngagementPanel">
          <div className="adminEngagementPanelHead"><div><p className="sectionLabel">Feature share</p><h4>Where time is spent</h4></div></div>
          <FeatureDonut items={summary.features} />
        </article>
      </div>

      <div className="adminEngagementSplit">
        <article className="adminEngagementPanel">
          <div className="adminEngagementPanelHead"><div><p className="sectionLabel">Feature ranking</p><h4>Time by product area</h4></div></div>
          <BreakdownBars items={summary.features} emptyLabel="No feature time recorded." />
        </article>
        <article className="adminEngagementPanel">
          <div className="adminEngagementPanelHead"><div><p className="sectionLabel">Tests &amp; activities</p><h4>Most-used learning content</h4></div></div>
          <BreakdownBars items={summary.activities} emptyLabel="No test time recorded." />
        </article>
      </div>

      <article className="adminEngagementPanel">
        <div className="adminEngagementPanelHead">
          <div><p className="sectionLabel">Leaderboard</p><h4>Accounts ranked by active time</h4></div>
          <span>{summary.rankings.length} tracked</span>
        </div>
        <div className="adminEngagementLeaderboard">
          <div className="adminEngagementLeaderboardHead">
            <span>Rank</span><span>Account</span><span>Top feature</span><span>Last active</span><span>Time</span>
          </div>
          {summary.rankings.length ? summary.rankings.map((actor, index) => (
            <button key={actor.actorKey} type="button" className="adminEngagementLeaderboardRow" onClick={() => setSelectedActor(actor)}>
              <span className={`adminEngagementRank adminEngagementRank-${index + 1}`}>{index + 1}</span>
              <span className="adminEngagementIdentity"><strong>{actor.name}</strong><small>{actor.email || actor.role}</small></span>
              <span className="adminEngagementFeaturePill">{featureLabel(actor.dominantFeature)}</span>
              <span>{actor.lastActiveAt ? new Date(actor.lastActiveAt).toLocaleString() : '—'}</span>
              <strong>{formatEngagementDuration(actor.totalSeconds)}</strong>
            </button>
          )) : <p className="meta">No active-time data yet. Rankings will appear after users spend active time in the app.</p>}
        </div>
      </article>

      {selectedActor ? (
        <ActorJourneyDrawer
          actor={selectedActor}
          detail={actorDetail}
          loading={actorLoading}
          error={actorError}
          onClose={() => setSelectedActor(null)}
        />
      ) : null}
    </div>
  )
}
