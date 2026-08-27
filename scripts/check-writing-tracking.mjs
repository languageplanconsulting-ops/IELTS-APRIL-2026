#!/usr/bin/env node
// Is writing engagement being recorded at all, and for whom?
//
// Dumps, per learner, active seconds grouped by skill (writing / reading /
// listening / speaking / other) plus how many raw segments carry a writing.*
// feature. Use it to tell "writing tracking is broken" apart from "this learner
// just has little *active* writing time".
//
// Usage:
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/check-writing-tracking.mjs [--days 90]

const args = process.argv.slice(2)
const readFlag = (name, fallback) => {
  const index = args.indexOf(`--${name}`)
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback
}
const DAYS = Math.max(1, Number(readFlag('days', 90)) || 90)

const normalizeUrl = (value) => {
  const raw = String(value || '').trim().replace(/\/+$/, '')
  if (!raw) return ''
  if (/^[a-z0-9-]+$/i.test(raw)) return `https://${raw}.supabase.co`
  if (/^[a-z0-9-]+\.supabase\.co$/i.test(raw)) return `https://${raw}`
  return raw
}

const SUPABASE_URL = normalizeUrl(process.env.SUPABASE_URL)
const SERVICE_KEY = String(process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.')
  process.exit(1)
}
const headers = { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` }

const getAll = async (path, pageSize = 1000) => {
  const rows = []
  for (let offset = 0; ; offset += pageSize) {
    const sep = path.includes('?') ? '&' : '?'
    const res = await fetch(`${SUPABASE_URL}${path}${sep}limit=${pageSize}&offset=${offset}`, { headers })
    if (!res.ok) throw new Error(`GET ${path} -> ${res.status} ${(await res.text()).slice(0, 200)}`)
    const page = await res.json()
    if (!Array.isArray(page) || page.length === 0) break
    rows.push(...page)
    if (page.length < pageSize) break
  }
  return rows
}

const since = new Date(Date.now() - DAYS * 864e5).toISOString()
const skillOf = (feature) => {
  const f = String(feature || '')
  for (const s of ['writing', 'reading', 'listening', 'speaking']) if (f.startsWith(s)) return s
  return 'other'
}
const fmt = (sec) => {
  const t = Math.max(0, Math.round(sec))
  const h = Math.floor(t / 3600)
  const m = Math.floor((t % 3600) / 60)
  return h ? `${h}h ${m}m` : m ? `${m}m` : `${t}s`
}

const main = async () => {
  console.error(`Reading segments since ${since} …`)
  const segments = await getAll(
    '/rest/v1/user_engagement_segments' +
      '?select=user_id,actor_key,feature,active_seconds,last_seen_at' +
      `&last_seen_at=gte.${since}`
  )
  const profiles = await getAll('/rest/v1/profiles?select=id,email,full_name,role')
  const nameById = new Map(profiles.map((p) => [p.id, p.full_name || p.email || p.id]))

  const byActor = new Map()
  let writingSegments = 0
  let writingSeconds = 0
  for (const s of segments) {
    const key = s.actor_key || (s.user_id ? `user:${s.user_id}` : 'anonymous')
    if (!byActor.has(key)) byActor.set(key, { key, userId: s.user_id, skills: {}, total: 0, last: '' })
    const a = byActor.get(key)
    const skill = skillOf(s.feature)
    const sec = Math.max(0, Number(s.active_seconds) || 0)
    a.skills[skill] = (a.skills[skill] || 0) + sec
    a.total += sec
    if (s.last_seen_at > a.last) a.last = s.last_seen_at
    if (skill === 'writing') { writingSegments++; writingSeconds += sec }
  }

  const actors = [...byActor.values()].sort((x, y) => y.total - x.total)

  console.log(`\n=== Writing tracking health — last ${DAYS} days ===`)
  console.log(`Total segments: ${segments.length}`)
  console.log(`Writing segments: ${writingSegments}  (${fmt(writingSeconds)} active)`)
  console.log(`Distinct accounts with ANY segment: ${actors.length}`)
  console.log(`Accounts with writing time: ${actors.filter((a) => a.skills.writing).length}`)
  console.log('')
  console.log('Per-account active time by skill (sorted by total):')
  console.log('-'.repeat(96))
  console.log(
    ['Learner'.padEnd(26), 'Writing'.padStart(9), 'Reading'.padStart(9), 'Listen'.padStart(9),
      'Speaking'.padStart(9), 'Other'.padStart(9), 'Last seen'.padStart(12)].join(' ')
  )
  console.log('-'.repeat(96))
  for (const a of actors) {
    const name = String(a.userId ? nameById.get(a.userId) || a.key : a.key).slice(0, 25)
    console.log(
      [name.padEnd(26), fmt(a.skills.writing || 0).padStart(9), fmt(a.skills.reading || 0).padStart(9),
        fmt(a.skills.listening || 0).padStart(9), fmt(a.skills.speaking || 0).padStart(9),
        fmt(a.skills.other || 0).padStart(9), String(a.last).slice(0, 10).padStart(12)].join(' ')
    )
  }
  console.log('-'.repeat(96))
  if (!writingSegments) {
    console.log('\n⚠️  ZERO writing segments recorded — writing tracking is genuinely broken.')
  } else {
    console.log('\n✅ Writing segments ARE being recorded. If a specific learner shows little/none,')
    console.log('   compare their Writing column to Reading/Speaking: low writing but high other')
    console.log('   skills => their client posts fine, so it is under-counted active time (idle >2min),')
    console.log('   not a tracking outage.')
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
