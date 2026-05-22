/**
 * Fetch listening answer keys for Cambridge 19–20 from ieltstrainingonline practice pages.
 * Run: node scripts/fetch-cambridge-listening-answer-keys.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, 'cambridge-1920-listening-answer-keys.json')
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const pageUrl = (book, test) =>
  `https://ieltstrainingonline.com/practice-cam-${book}-listening-test-${String(test).padStart(2, '0')}-with-answer/`

const stripHtml = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\r/g, '')

const parseAnswerBlock = (text) => {
  const start = text.search(/Answer Cam \d+ Listening Test/i)
  if (start < 0) return null
  const block = text.slice(start)
  const audioscriptAt = block.search(/Audioscript Cam \d+ Listening Test/i)
  const answersText = audioscriptAt > 0 ? block.slice(0, audioscriptAt) : block.slice(0, 4000)

  const sections = { 1: [], 2: [], 3: [], 4: [] }
  let current = 1

  for (const rawLine of answersText.split('\n')) {
    const line = rawLine.trim().replace(/&amp;/g, '&')
    if (!line) continue
    const partMatch = line.match(/^Part\s+(\d)/i)
    if (partMatch) {
      current = Number(partMatch[1])
      continue
    }

    const paired = line.match(/^(\d+)\s*&\s*(\d+)\s+(.+)$/i)
    if (paired) {
      const answers = paired[3].split(/[,/]/).map((a) => a.trim()).filter(Boolean)
      if (answers.length >= 2) {
        sections[current].push(answers[0], answers[1])
      }
      continue
    }

    const single = line.match(/^(\d+)\s+(.+)$/)
    if (single) {
      sections[current].push(single[2].trim())
    }
  }

  return sections
}

const fetchTestKeys = async (book, test) => {
  const url = pageUrl(book, test)
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; IELTS-SPEAKING/1.0)' } })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  const html = await res.text()
  const text = stripHtml(html)
  const sections = parseAnswerBlock(text)
  if (!sections) throw new Error(`No answer block found for Cam ${book} Test ${test}`)
  for (const section of [1, 2, 3, 4]) {
    if (sections[section].length !== 10) {
      throw new Error(`Cam ${book} Test ${test} Section ${section}: expected 10 answers, got ${sections[section].length}`)
    }
  }
  return sections
}

const main = async () => {
  const out = { 19: {}, 20: {} }
  for (const book of [19, 20]) {
    for (let test = 1; test <= 4; test += 1) {
      out[String(book)][String(test)] = await fetchTestKeys(book, test)
      console.log(`Cam ${book} Test ${test}: OK (${Object.values(out[String(book)][String(test)]).flat().length} answers)`)
      await sleep(400)
    }
  }
  fs.writeFileSync(OUT, `${JSON.stringify(out, null, 2)}\n`)
  console.log(`Wrote ${OUT}`)
}

const isDirectRun =
  process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))

if (isDirectRun) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}

export { fetchTestKeys, parseAnswerBlock }
