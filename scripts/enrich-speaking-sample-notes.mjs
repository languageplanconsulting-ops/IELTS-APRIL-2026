#!/usr/bin/env node
/**
 * Batch-enrich speaking sample videos with B1-B2 vocabulary + grammar subtitle notes.
 *
 * Usage:
 *   node scripts/enrich-speaking-sample-notes.mjs [--dry-run] [--api-base URL]
 *
 * Env:
 *   ADMIN_PANEL_CODE (default: englishplanforeover)
 *   APP_BASE_URL (default: https://www.englishplan-ielts.com)
 */

import { enrichSpeakingSampleSubtitlesWithNotes } from './lib/speakingSampleSubtitleNotes.mjs'

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const apiBaseArg = args.find((arg) => arg.startsWith('--api-base='))
const API_BASE = (apiBaseArg ? apiBaseArg.split('=').slice(1).join('=') : process.env.APP_BASE_URL || 'https://www.englishplan-ielts.com').replace(/\/$/, '')
const ADMIN_CODE = String(process.env.ADMIN_PANEL_CODE || 'englishplanforeover').trim()
const AUTH = `Bearer admin-code:${ADMIN_CODE}`

const countNotes = (subtitles) =>
  (subtitles || []).reduce((total, cue) => total + (cue.notes?.length || 0), 0)

const summarizeNotes = (subtitles) =>
  (subtitles || [])
    .flatMap((cue) => (cue.notes || []).map((note) => ({ ...note, cueText: cue.text?.slice(0, 50) })))

const fetchVideos = async () => {
  const res = await fetch(`${API_BASE}/api/admin/speaking-sample-videos`, {
    headers: { Authorization: AUTH, Accept: 'application/json' }
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Fetch failed (${res.status}): ${body.slice(0, 200)}`)
  }
  const payload = await res.json()
  return payload.items || []
}

const patchVideo = async (topicId, body) => {
  const res = await fetch(`${API_BASE}/api/admin/speaking-sample-videos/${encodeURIComponent(topicId)}`, {
    method: 'PATCH',
    headers: {
      Authorization: AUTH,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(body)
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`PATCH ${topicId} failed (${res.status}): ${text.slice(0, 200)}`)
  }
  return res.json()
}

const main = async () => {
  console.log(`API: ${API_BASE}`)
  console.log(dryRun ? 'DRY RUN — no writes' : 'LIVE — will PATCH videos')
  const items = await fetchVideos()
  console.log(`Found ${items.length} speaking sample videos\n`)

  let updated = 0
  let skipped = 0
  let failed = 0

  for (const item of items) {
    const topicId = item.topicId || item.id
    const cues = item.subtitles || []
    const before = countNotes(cues)
    const enriched = enrichSpeakingSampleSubtitlesWithNotes(cues, item.transcript || '')
    const after = countNotes(enriched)
    const notes = summarizeNotes(enriched)

    console.log(`--- ${topicId} (${item.topicTitle?.slice(0, 55) || ''})`)
    console.log(`  cues: ${cues.length} | notes: ${before} → ${after}`)
    notes.forEach((note) => {
      const label = note.kind === 'grammar' ? note.grammarRule : note.partOfSpeech
      const thai = note.thaiMeaning || ''
      console.log(`  · [${note.kind}] "${note.phrase}" — ${label} · ${thai.slice(0, 40)}`)
    })

    if (after === 0) {
      console.log('  ⚠ no notes generated — skipped')
      skipped += 1
      continue
    }

    if (dryRun) {
      updated += 1
      continue
    }

    try {
      await patchVideo(topicId, {
        subtitlesJson: JSON.stringify(enriched),
        transcript: item.transcript || ''
      })
      console.log('  ✓ saved')
      updated += 1
    } catch (error) {
      console.log(`  ✗ ${error instanceof Error ? error.message : error}`)
      failed += 1
    }
  }

  console.log(`\nDone: ${updated} enriched, ${skipped} skipped, ${failed} failed`)
  if (failed > 0) process.exit(1)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
