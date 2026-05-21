/**
 * Verify Cambridge Part 1 audio URLs resolve to real audio files.
 * Run: npm run verify:listening-part1-audio
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const expectedPath = path.join(__dirname, 'cambridge-part1-audio-urls.json')
const expectedByTest = JSON.parse(fs.readFileSync(expectedPath, 'utf8'))

const BOOKS = [18, 19, 20]
const TESTS = [1, 2, 3, 4]

const candidates = (book, test) => [
  {
    id: '2024-m4a-part1',
    url: `https://ieltstrainingonline.com/wp-content/uploads/2024/07/cam${book}-test${test}-part1.m4a`
  },
  {
    id: '2024-m4a-part1-padded',
    url: `https://ieltstrainingonline.com/wp-content/uploads/2024/07/cam${book}-test${String(test).padStart(2, '0')}-part1.m4a`
  },
  {
    id: '2021-mp3-section',
    url: `https://ieltstrainingonline.com/wp-content/uploads/2021/07/Cam${book}-Test${test}-Section1.mp3`
  }
]

const probe = async (url) => {
  try {
    const head = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      headers: { 'User-Agent': 'IELTS-Part1-Audio-Verify/1.0' }
    })
    const type = head.headers.get('content-type') || ''
    const length = Number(head.headers.get('content-length') || 0)
    if (head.ok && (type.includes('audio') || length > 50000)) {
      return { ok: true, status: head.status, type, length }
    }

    const get = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      headers: { 'User-Agent': 'IELTS-Part1-Audio-Verify/1.0', Range: 'bytes=0-0' }
    })
    const getType = get.headers.get('content-type') || ''
    const getLength = Number(get.headers.get('content-length') || get.headers.get('content-range')?.split('/')[1] || 0)
    return {
      ok: get.ok && (getType.includes('audio') || getLength > 50000),
      status: get.status,
      type: getType,
      length: getLength
    }
  } catch (error) {
    return { ok: false, error: String(error.message || error) }
  }
}

const main = async () => {
  const resolved = {}
  const allResults = []

  for (const book of BOOKS) {
    for (const test of TESTS) {
      const key = `${book}-${test}`
      let winner = null
      for (const candidate of candidates(book, test)) {
        const result = await probe(candidate.url)
        allResults.push({ key, ...candidate, ...result })
        if (!winner && result.ok) winner = { ...candidate, ...result }
      }
      resolved[key] = winner
    }
  }

  console.log('\n=== Expected URLs from cambridge-part1-audio-urls.json ===\n')
  let expectedFailures = 0
  for (const [key, url] of Object.entries(expectedByTest)) {
    const result = await probe(url)
    if (result.ok) {
      console.log(`OK ${key}: ${Math.round((result.length || 0) / 1024)}KB · ${url}`)
    } else {
      expectedFailures += 1
      console.log(`FAIL ${key}: ${result.status || result.error} · ${url}`)
    }
  }

  if (expectedFailures) {
    console.log(`\n${expectedFailures} expected Part 1 audio URL(s) failed.`)
    process.exit(1)
  }

  console.log('\n=== Alternate URL patterns (discovery) ===\n')
  for (const book of BOOKS) {
    for (const test of TESTS) {
      const key = `${book}-${test}`
      const winner = resolved[key]
      if (winner) {
        console.log(
          `Cam ${book} Test ${test}: OK [${winner.id}] ${winner.type || '?'} ${winner.length ? `${Math.round(winner.length / 1024)}KB` : ''}`
        )
        console.log(`  ${winner.url}`)
      } else {
        console.log(`Cam ${book} Test ${test}: NO WORKING URL FOUND`)
        for (const row of allResults.filter((r) => r.key === key)) {
          console.log(`  FAIL [${row.id}] ${row.status || row.error} ${row.url}`)
        }
      }
    }
  }

  const missing = Object.values(resolved).filter((v) => !v).length
  if (missing) {
    console.log(`\nNote: ${missing} test(s) had no alternate pattern match (expected URLs already verified above).`)
  }
}

main()
