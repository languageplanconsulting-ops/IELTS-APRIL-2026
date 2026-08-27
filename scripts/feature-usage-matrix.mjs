#!/usr/bin/env node
// A user x feature matrix: how much active time each learner spent in each feature.
//
// Reads public.user_engagement_segments (active_seconds per feature) and
// public.profiles (name/email/role) with the Supabase service-role key.
//
// Usage:
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
//     node scripts/feature-usage-matrix.mjs [--days 3650] [--out scratch-activity]

const args = process.argv.slice(2)
const readFlag = (name, fallback) => {
  const index = args.indexOf(`--${name}`)
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback
}

const DAYS = Math.max(1, Number(readFlag('days', 3650)) || 3650)
const OUT_DIR = readFlag('out', 'scratch-activity')

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

const headers = { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` }

const get = async (path) => {
  const response = await fetch(`${SUPABASE_URL}${path}`, { headers })
  if (!response.ok) {
    const body = await response.text().catch(() => '')
    throw new Error(`GET ${path} -> ${response.status} ${body.slice(0, 300)}`)
  }
  return response.json()
}

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
  if (minutes) return `${minutes}m`
  return `${total}s`
}

// Collapse the granular feature keys (e.g. "speaking-part-2") into headline
// buckets so the matrix stays readable. Adjust here if you want finer columns.
const bucketOf = (feature) => {
  const f = String(feature || 'unknown').toLowerCase()
  if (f.startsWith('speaking')) return 'Speaking'
  if (f.startsWith('listening')) return 'Listening'
  if (f.startsWith('reading')) return 'Reading'
  if (f.startsWith('writing')) return 'Writing'
  if (f.startsWith('placement')) return 'Placement'
  if (f.startsWith('course')) return 'Course'
  if (f.startsWith('exam') || f.includes('recall')) return 'Exam feed'
  return 'Other'
}

const main = async () => {
  console.error(`Pulling engagement since ${since} …`)
  const segments = await getAll(
    '/rest/v1/user_engagement_segments' +
      '?select=actor_key,user_id,feature,page,active_seconds,last_seen_at' +
      `&started_at=gte.${since}&order=started_at.asc`
  )
  console.error(`  ${segments.length} segments`)

  const profiles = await getAll('/rest/v1/profiles?select=id,email,full_name,role')
  const profileById = new Map(profiles.map((row) => [row.id, row]))

  const buckets = new Set()
  const byActor = new Map()
  for (const segment of segments) {
    const key = segment.actor_key || (segment.user_id ? `user:${segment.user_id}` : 'anonymous')
    if (!byActor.has(key)) {
      byActor.set(key, {
        userId: segment.user_id || null,
        total: 0,
        features: new Map(),
        lastSeenAt: segment.last_seen_at
      })
    }
    const actor = byActor.get(key)
    const seconds = Math.max(0, Number(segment.active_seconds) || 0)
    const bucket = bucketOf(segment.feature || segment.page)
    buckets.add(bucket)
    actor.total += seconds
    actor.features.set(bucket, (actor.features.get(bucket) || 0) + seconds)
    if (segment.last_seen_at > actor.lastSeenAt) actor.lastSeenAt = segment.last_seen_at
  }

  const columnOrder = ['Speaking', 'Listening', 'Reading', 'Writing', 'Placement', 'Course', 'Exam feed', 'Other']
  const columns = columnOrder.filter((c) => buckets.has(c))

  const rows = [...byActor.entries()]
    .map(([actorKey, actor]) => {
      const profile = actor.userId ? profileById.get(actor.userId) : null
      return {
        name: profile?.full_name || profile?.email || actorKey,
        email: profile?.email || '',
        role: profile?.role || '',
        total: actor.total,
        lastSeenAt: actor.lastSeenAt,
        features: actor.features
      }
    })
    .sort((a, b) => b.total - a.total)

  const lines = []
  lines.push(`# Feature usage per user — last ${DAYS} days (since ${since.slice(0, 10)})`)
  lines.push('')
  lines.push('_Active time (not wall-clock). Idle/hidden time is excluded._')
  lines.push('')
  lines.push(`| # | Learner | Email | ${columns.join(' | ')} | Total | Last seen |`)
  lines.push(`|---|---------|-------|${columns.map(() => '------').join('|')}|-------|-----------|`)
  rows.forEach((row, index) => {
    const cells = columns.map((c) => {
      const s = row.features.get(c) || 0
      return s > 0 ? formatDuration(s) : '—'
    })
    lines.push(
      `| ${index + 1} | ${row.name} | ${row.email} | ${cells.join(' | ')} | ` +
        `${formatDuration(row.total)} | ${String(row.lastSeenAt || '').slice(0, 10)} |`
    )
  })

  const fs = await import('node:fs/promises')
  await fs.mkdir(OUT_DIR, { recursive: true })
  await fs.writeFile(`${OUT_DIR}/feature-usage-matrix.md`, lines.join('\n'))
  await fs.writeFile(
    `${OUT_DIR}/feature-usage-matrix.json`,
    JSON.stringify(
      { since, days: DAYS, columns, rows: rows.map((r) => ({ ...r, features: Object.fromEntries(r.features) })) },
      null,
      2
    )
  )
  console.error(`\nWrote ${OUT_DIR}/feature-usage-matrix.md`)
  console.log(lines.join('\n'))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
