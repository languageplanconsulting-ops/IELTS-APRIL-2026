#!/usr/bin/env node
// Who spends the most time in the app, and what their speaking work looks like.
//
// Reads straight from Supabase with the service-role key (no admin login needed):
//   - public.user_engagement_segments  -> active time per learner, split by feature
//   - public.profiles                  -> name / email / role
//   - storage: assessment-report-history/_manifests/assessment-reports.json
//     plus each report JSON -> speaking band, prompt, transcript, per-question answers
//
// Usage:
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/report-user-activity.mjs [--days 30] [--top 15] [--out DIR]

const args = process.argv.slice(2)
const readFlag = (name, fallback) => {
  const index = args.indexOf(`--${name}`)
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback
}

const DAYS = Math.max(1, Number(readFlag('days', 30)) || 30)
const TOP = Math.max(1, Number(readFlag('top', 15)) || 15)
const OUT_DIR = readFlag('out', 'scratch-activity')
const REPORTS_BUCKET = process.env.SUPABASE_REPORTS_BUCKET || 'assessment-report-history'

const normalizeSupabaseUrl = (value) => {
  const raw = String(value || '').trim().replace(/\/+$/, '')
  if (!raw) return ''
  if (/^[a-z0-9-]+$/i.test(raw)) return `https://${raw}.supabase.co`
  if (/^[a-z0-9-]+\.supabase\.co$/i.test(raw)) return `https://${raw}`
  return raw
}

const SUPABASE_URL = normalizeSupabaseUrl(process.env.SUPABASE_URL)
const SERVICE_KEY = String(process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.')
  process.exit(1)
}

const headers = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`
}

const get = async (path, { raw = false } = {}) => {
  const response = await fetch(`${SUPABASE_URL}${path}`, { headers })
  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`GET ${path} -> ${response.status} ${body.slice(0, 300)}`)
  }
  return raw ? response.text() : response.json()
}

// PostgREST caps rows per request, so walk the range header.
const getAll = async (path, pageSize = 1000) => {
  const rows = []
  for (let offset = 0; ; offset += pageSize) {
    const separator = path.includes('?') ? '&' : '?'
    const page = await get(`${path}${separator}limit=${pageSize}&offset=${offset}`)
    if (!Array.isArray(page) || page.length === 0) break
    rows.push(...page)
    if (page.length < pageSize) break
  }
  return rows
}

const since = new Date(Date.now() - DAYS * 24 * 60 * 60 * 1000).toISOString()

const formatDuration = (seconds) => {
  const total = Math.max(0, Math.round(seconds))
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  if (hours) return `${hours}h ${minutes}m`
  if (minutes) return `${minutes}m ${total % 60}s`
  return `${total}s`
}

const main = async () => {
  console.error(`Pulling engagement since ${since} …`)
  const segments = await getAll(
    '/rest/v1/user_engagement_segments' +
      '?select=actor_key,user_id,session_id,page,feature,activity_type,activity_id,label,started_at,last_seen_at,active_seconds' +
      `&started_at=gte.${since}&order=started_at.asc`
  )
  console.error(`  ${segments.length} segments`)

  const profiles = await getAll('/rest/v1/profiles?select=id,email,full_name,role')
  const profileById = new Map(profiles.map((row) => [row.id, row]))

  const byActor = new Map()
  for (const segment of segments) {
    const key = segment.actor_key || (segment.user_id ? `user:${segment.user_id}` : 'anonymous')
    if (!byActor.has(key)) {
      byActor.set(key, {
        actorKey: key,
        userId: segment.user_id || null,
        activeSeconds: 0,
        segmentCount: 0,
        sessions: new Set(),
        features: new Map(),
        firstStartedAt: segment.started_at,
        lastSeenAt: segment.last_seen_at
      })
    }
    const actor = byActor.get(key)
    const seconds = Math.max(0, Number(segment.active_seconds) || 0)
    actor.activeSeconds += seconds
    actor.segmentCount += 1
    actor.sessions.add(segment.session_id)
    const feature = segment.feature || segment.page || 'unknown'
    actor.features.set(feature, (actor.features.get(feature) || 0) + seconds)
    if (segment.started_at < actor.firstStartedAt) actor.firstStartedAt = segment.started_at
    if (segment.last_seen_at > actor.lastSeenAt) actor.lastSeenAt = segment.last_seen_at
  }

  const actors = [...byActor.values()]
    .map((actor) => {
      const profile = actor.userId ? profileById.get(actor.userId) : null
      const featureList = [...actor.features.entries()].sort((a, b) => b[1] - a[1])
      const speakingSeconds = featureList
        .filter(([feature]) => feature.startsWith('speaking'))
        .reduce((sum, [, seconds]) => sum + seconds, 0)
      return {
        actorKey: actor.actorKey,
        userId: actor.userId,
        name: profile?.full_name || profile?.email || actor.actorKey,
        email: profile?.email || '',
        role: profile?.role || '',
        activeSeconds: actor.activeSeconds,
        speakingSeconds,
        segmentCount: actor.segmentCount,
        sessionCount: actor.sessions.size,
        topFeatures: featureList.slice(0, 5).map(([feature, seconds]) => ({ feature, seconds })),
        firstStartedAt: actor.firstStartedAt,
        lastSeenAt: actor.lastSeenAt
      }
    })
    .sort((a, b) => b.activeSeconds - a.activeSeconds)

  // Speaking assessment reports (band + transcript) live in Storage, not Postgres.
  console.error('Pulling speaking assessment reports …')
  let reportIndex = []
  try {
    const manifest = await get(
      `/storage/v1/object/${encodeURIComponent(REPORTS_BUCKET)}/_manifests/assessment-reports.json`
    )
    reportIndex = Array.isArray(manifest?.items) ? manifest.items : []
  } catch (error) {
    console.error(`  could not read the report manifest: ${error.message}`)
  }

  const recentReports = reportIndex.filter((item) => String(item?.createdAt || '') >= since)
  console.error(`  ${recentReports.length} reports in window (of ${reportIndex.length} total)`)

  const wantedUserIds = new Set(actors.slice(0, TOP).map((actor) => actor.userId).filter(Boolean))
  const targetReports = recentReports.filter((item) => wantedUserIds.has(item.userId))

  const details = []
  for (const item of targetReports) {
    try {
      const report = await get(
        `/storage/v1/object/${encodeURIComponent(REPORTS_BUCKET)}/${String(item.objectPath)
          .split('/')
          .map(encodeURIComponent)
          .join('/')}`
      )
      details.push({
        id: item.id,
        userId: item.userId,
        learnerName: report.learnerName || item.learnerName || '',
        learnerEmail: report.learnerEmail || item.learnerEmail || '',
        createdAt: report.createdAt || item.createdAt || '',
        testMode: report.testMode || item.testMode || '',
        topicTitle: report.topicTitle || item.topicTitle || '',
        overallBand: report.report?.overallBand ?? item.overallBand ?? null,
        criteria: report.report?.criteria || report.report?.scores || null,
        prompt: report.prompt || '',
        transcript: report.transcript || '',
        questionResponses: report.questionResponses || []
      })
    } catch (error) {
      console.error(`  report ${item.id} failed: ${error.message}`)
    }
  }
  details.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))

  const reportsByUser = new Map()
  for (const detail of details) {
    if (!reportsByUser.has(detail.userId)) reportsByUser.set(detail.userId, [])
    reportsByUser.get(detail.userId).push(detail)
  }

  const fs = await import('node:fs/promises')
  await fs.mkdir(OUT_DIR, { recursive: true })
  await fs.writeFile(
    `${OUT_DIR}/user-activity.json`,
    JSON.stringify({ since, days: DAYS, actors, reports: details }, null, 2)
  )

  const lines = []
  lines.push(`# User activity — last ${DAYS} days (since ${since.slice(0, 10)})`)
  lines.push('')
  lines.push('## Time spent (all features)')
  lines.push('')
  lines.push('| # | Learner | Email | Total | Speaking | Sessions | Top feature | Last seen |')
  lines.push('|---|---------|-------|-------|----------|----------|-------------|-----------|')
  actors.slice(0, TOP).forEach((actor, index) => {
    lines.push(
      `| ${index + 1} | ${actor.name} | ${actor.email} | ${formatDuration(actor.activeSeconds)} | ` +
        `${formatDuration(actor.speakingSeconds)} | ${actor.sessionCount} | ` +
        `${actor.topFeatures[0]?.feature || '—'} | ${String(actor.lastSeenAt || '').slice(0, 16).replace('T', ' ')} |`
    )
  })
  lines.push('')
  lines.push('## Speaking work')
  lines.push('')
  const speakers = actors.filter((actor) => actor.speakingSeconds > 0).slice(0, TOP)
  if (!speakers.length) lines.push('_No speaking time recorded in this window._')
  for (const actor of speakers) {
    lines.push(`### ${actor.name} — ${formatDuration(actor.speakingSeconds)} on speaking`)
    lines.push(`- ${actor.email || 'no email'} · ${actor.sessionCount} sessions · last seen ${actor.lastSeenAt}`)
    const reports = reportsByUser.get(actor.userId) || []
    if (!reports.length) {
      lines.push('- No scored speaking report saved in this window.')
      lines.push('')
      continue
    }
    for (const report of reports) {
      lines.push('')
      lines.push(
        `**${String(report.createdAt).slice(0, 16).replace('T', ' ')} · ${report.testMode} · band ${report.overallBand ?? '—'}** — ${report.topicTitle}`
      )
      if (report.prompt) lines.push(`- Prompt: ${report.prompt.replace(/\s+/g, ' ').slice(0, 300)}`)
      if (report.criteria) lines.push(`- Criteria: \`${JSON.stringify(report.criteria).slice(0, 400)}\``)
      if (report.questionResponses?.length) {
        for (const qa of report.questionResponses.slice(0, 10)) {
          lines.push(`  - Q: ${qa.question.replace(/\s+/g, ' ').slice(0, 200)}`)
          lines.push(`    A: ${qa.response.replace(/\s+/g, ' ').slice(0, 1200)}`)
        }
      } else if (report.transcript) {
        lines.push(`- Transcript: ${report.transcript.replace(/\s+/g, ' ').slice(0, 2000)}`)
      }
    }
    lines.push('')
  }

  await fs.writeFile(`${OUT_DIR}/user-activity.md`, lines.join('\n'))
  console.error(`\nWrote ${OUT_DIR}/user-activity.md and ${OUT_DIR}/user-activity.json`)
  console.log(lines.slice(0, 40).join('\n'))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
