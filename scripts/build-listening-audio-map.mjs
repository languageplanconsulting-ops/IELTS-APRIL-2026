#!/usr/bin/env node
/**
 * Rebuilds src/listeningCambridgeAudioUrls.ts by scraping the audio URLs off the
 * live practice pages.
 *
 * The host renames files and moves them between upload folders without warning —
 * there are six different filename shapes and six different folder dates in use —
 * so a computed URL template cannot work. Scrape the pages, keep the result as a
 * checked-in table, and re-run this when audio starts 404ing.
 *
 *   node scripts/build-listening-audio-map.mjs            # scrape + write
 *   node scripts/build-listening-audio-map.mjs --verify   # also HEAD every URL
 *
 * Requests are deliberately sequential with a delay: the host refuses connections
 * under concurrency and will block you for several minutes.
 */
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

/**
 * Sources in priority order. engnovate is primary: it covers Cambridge 1-21 with
 * consistent naming and has been the more reliable host. ieltstrainingonline is the
 * fallback — it is the original source but renames files aggressively and will
 * IP-block you for a while if you fetch it concurrently.
 *
 * Note both sites vary the upload folder per book, and neither uses one filename
 * shape (engnovate alone has `-audio-1.mp3`, `-test-1-1.mp3`, and `-audio1.mp3`),
 * which is why the part number is matched loosely off the end of the filename.
 */
const SOURCES = [
  {
    id: 'engnovate',
    sitemap: 'https://engnovate.com/ielts_listening_test-sitemap.xml',
    // Only the bare test page; engnovate also publishes a page per question range.
    pageRe: /cambridge-ielts-(\d+)-academic-listening-test-(\d+)\/$/,
    audioRe: /https:\/\/engnovate\.com\/wp-content\/uploads\/\d{4}\/\d{2}\/[^"'\s<>\\]+?\.(?:mp3|m4a)/gi,
    // engnovate filenames end in several ways: `-audio-1.mp3`, `-test-1-1.mp3`,
    // `-audio1.mp3`, and even `-audio-2-.mp3` (trailing dash). Match the last digit
    // group before the extension, tolerating optional dashes on either side.
    partRe: /(\d+)-?\.(?:mp3|m4a)$/i
  },
  {
    id: 'ieltstrainingonline',
    sitemap: 'https://ieltstrainingonline.com/post-sitemap.xml',
    pageRe: /practice-cam-(\d+)-listening-test-(\d+)/,
    audioRe: /https:\/\/ieltstrainingonline\.com\/wp-content\/uploads\/\d{4}\/\d{2}\/[^"'\s<>\\]+?\.(?:mp3|m4a)/gi,
    partRe: /(?:section|part)-?(\d)\.(?:mp3|m4a)$/i
  }
]

const BOOK_MIN = 10
const BOOK_MAX = 21
const REQUEST_DELAY_MS = 1200

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const fetchText = async (url) => {
  const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(30000) })
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return res.text()
}

const scrapeSource = async (source) => {
  const sitemap = await fetchText(source.sitemap)
  const pages = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1])
    .filter((url) => {
      const m = url.match(source.pageRe)
      return m && Number(m[1]) >= BOOK_MIN && Number(m[1]) <= BOOK_MAX
    })
    .sort()

  console.error(`[${source.id}] ${pages.length} pages`)

  const entries = {}
  for (const page of pages) {
    const [, book, test] = page.match(source.pageRe)
    try {
      const html = await fetchText(page)
      const urls = [...new Set(html.match(source.audioRe) || [])]
      let found = 0
      for (const url of urls) {
        const part = url.match(source.partRe)
        if (!part) continue
        const partNumber = Number(part[1])
        if (partNumber < 1 || partNumber > 4) continue
        entries[`${Number(book)}-${Number(test)}-${partNumber}`] = url
        found++
      }
      if (found !== 4) console.error(`  cam${Number(book)} test${Number(test)}: only ${found}/4 parts`)
    } catch (error) {
      console.error(`  cam${Number(book)} test${Number(test)}: FAILED ${error.message}`)
    }
    await sleep(REQUEST_DELAY_MS)
  }
  return entries
}

const main = async () => {
  const perSource = []
  for (const source of SOURCES) {
    try {
      perSource.push(await scrapeSource(source))
    } catch (error) {
      // A blocked or down host must not lose the other host's results.
      console.error(`[${source.id}] SKIPPED: ${error.message}`)
      perSource.push({})
    }
  }

  const entries = {}
  for (const key of new Set(perSource.flatMap((e) => Object.keys(e)))) {
    entries[key] = perSource.map((e) => e[key]).filter(Boolean)
  }

  const sortedKeys = Object.keys(entries).sort((a, b) => {
    const [ab, at, ap] = a.split('-').map(Number)
    const [bb, bt, bp] = b.split('-').map(Number)
    return ab - bb || at - bt || ap - bp
  })

  if (process.argv.includes('--verify')) {
    let playable = 0
    for (const key of sortedKeys) {
      let ok = false
      for (const url of entries[key]) {
        try {
          const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(30000) })
          const length = Number(res.headers.get('content-length') || 0)
          const type = res.headers.get('content-type') || ''
          if (res.ok && !type.includes('text/html') && length > 500000) {
            ok = true
            break
          }
        } catch {
          // Try the next source; an unreachable host is usually rate limiting.
        }
        await sleep(REQUEST_DELAY_MS)
      }
      if (ok) playable++
      else console.error(`  NO PLAYABLE SOURCE: ${key}`)
      await sleep(REQUEST_DELAY_MS)
    }
    console.error(`Playable ${playable}/${sortedKeys.length}.`)
  }

  const body = sortedKeys
    .map((key) => `  '${key}': [\n${entries[key].map((url) => `    '${url}'`).join(',\n')}\n  ]`)
    .join(',\n')

  const file = `// GENERATED by scripts/build-listening-audio-map.mjs — do not edit by hand.
//
// Cambridge listening audio is hotlinked from two public sites. Neither uses a
// predictable URL scheme — both vary the upload folder by book, and filenames come
// in several shapes — so these URLs are scraped, not computed.
//
// Each entry lists sources in priority order; the player tries them in turn, so a
// single host going down or renaming files no longer takes listening offline.
// Re-run the script when audio starts failing.
//
// Keys are \`\${book}-\${test}-\${part}\`.

export const CAMBRIDGE_LISTENING_AUDIO_URLS: Record<string, string[]> = {
${body}
}

export const getCambridgeListeningAudioUrls = (book: number, test: number, part: number): string[] =>
  CAMBRIDGE_LISTENING_AUDIO_URLS[\`\${book}-\${test}-\${part}\`] || []

/** First known source, or '' when the set has no audio mapped. */
export const getCambridgeListeningAudioUrl = (book: number, test: number, part: number): string =>
  getCambridgeListeningAudioUrls(book, test, part)[0] || ''

const ALTERNATIVES_BY_URL: Record<string, string[]> = {}
for (const sources of Object.values(CAMBRIDGE_LISTENING_AUDIO_URLS)) {
  for (const source of sources) ALTERNATIVES_BY_URL[source] = sources
}

/**
 * Given any known audio URL, returns every mirror of the same recording (that URL
 * first). Lets callers that only carry a single audioUrl string still fall back to
 * the other host. Unknown URLs are returned unchanged.
 */
export const getCambridgeListeningAudioAlternatives = (url: string): string[] => {
  if (!url) return []
  const sources = ALTERNATIVES_BY_URL[url]
  if (!sources) return [url]
  return [url, ...sources.filter((source) => source !== url)]
}
`

  const outPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../src/listeningCambridgeAudioUrls.ts'
  )
  writeFileSync(outPath, file)
  console.error(`\nWrote ${sortedKeys.length} entries to ${outPath}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
