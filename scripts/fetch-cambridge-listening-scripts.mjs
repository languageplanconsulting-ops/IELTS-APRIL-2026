/**
 * Fetch Cambridge 15–20 listening audioscripts + audio URLs from Engnovate practice pages.
 * Run: node scripts/fetch-cambridge-listening-scripts.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, 'cambridge-listening-scripts.json')
const LEGACY_OUT = path.join(__dirname, 'cambridge-1516-listening-scripts.json')

const BASE = 'https://engnovate.com/ielts-listening-tests/cambridge-ielts'
const BOOKS = [15, 16, 19, 20]
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const decodeHtml = (html) =>
  html
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&hellip;/g, '...')
    .replace(/&pound;/g, '£')
    .replace(/&eacute;/g, 'é')
    .replace(/&#8211;/g, '–')

const splitScriptParagraphs = (text) => {
  const cleaned = decodeHtml(text)
    .replace(/\r/g, '')
    .replace(/Your browser does not support the audio element\./gi, '')
    .replace(/Listen From Here/gi, '')
    .trim()

  const blocks = cleaned
    .split(/\n{2,}|(?=[A-Z]{2,12}:)/)
    .map((b) => b.replace(/\s+/g, ' ').trim())
    .filter((b) => b.length > 50 && !/^—+$/.test(b))

  if (blocks.length) return blocks

  return cleaned
    .split(/(?<=[.!?])\s+(?=[A-Z])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 40)
}

const extractAudioUrls = (html) => {
  const urls = []
  const re = /ielts-listening-test-audio-\d+[\s\S]*?src="([^"]+)"/g
  let m
  while ((m = re.exec(html))) urls.push(m[1])
  return urls
}

const extractTranscriptBlock = (html) => {
  const plain = decodeHtml(html.replace(/<script[\s\S]*?<\/script>/gi, ' '))
  const text = plain.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '\n')
  const startMatch = text.match(/Listen and answer questions 31-40[\s\S]*?\n/i)
  if (!startMatch) return ''
  const start = (startMatch.index ?? 0) + startMatch[0].length
  const endMatch = text.slice(start).search(/## Questions 1-10|Questions 1-10\n/i)
  const end = endMatch > 0 ? start + endMatch : text.length
  return text.slice(start, end).trim()
}

const stripEmbeddedNoise = (block) => {
  let text = block
    .replace(/Your browser does not support the audio element\./gi, '')
    .replace(/Listen From Here/gi, '')

  text = text.replace(
    /\n\s*Questions \d+-\d+\s*\n[\s\S]*?(?=\n[A-Z][A-Z]+:|\n[A-Z][a-z]+(?: [A-Z][a-z]+)*:)/gi,
    '\n'
  )

  const uiStart = text.search(/\nPart 2:\s*1\s*\n/)
  if (uiStart > 0) text = text.slice(0, uiStart)

  return text.replace(/\n{3,}/g, '\n\n').trim()
}

const splitIntoNearEqualParts = (text, count) => {
  if (count <= 1) return [text.trim()].filter((part) => part.length > 80)
  const parts = []
  let remaining = text.trim()
  for (let index = 0; index < count; index += 1) {
    const isLast = index === count - 1
    if (isLast) {
      parts.push(remaining.trim())
      break
    }
    const target = Math.floor(remaining.length / (count - index))
    const sliceAt = Math.min(remaining.length - 80, Math.max(80, target))
    const window = remaining.slice(sliceAt, sliceAt + 500)
    const breakAt = window.search(/\n\n|\n(?=[A-Z][A-Z]+:)/)
    const cut = breakAt >= 0 ? sliceAt + breakAt : sliceAt
    parts.push(remaining.slice(0, cut).trim())
    remaining = remaining.slice(cut).trim()
  }
  return parts.filter((part) => part.length > 80)
}

const splitTranscriptIntoParts = (block) => {
  const main = stripEmbeddedNoise(block)

  const splitOnRules = (text) =>
    text
      .split(/(?:^|\n)\s*[-—]{3,}\s*(?:\n|$)/)
      .map((part) => part.trim())
      .filter((part) => part.length > 80)

  let parts = splitOnRules(main)
  if (parts.length === 4) return parts

  const p4Match = main.match(
    /(?:For my presentation today|In today(?:'|'s|&rsquo;s) lecture|In this lecture,? I(?:'m| am) going to|Now,? in (?:the final part|Part 4)|Let me start by talking about the history of)/i
  )
  const p4Idx = p4Match?.index ?? -1

  if (p4Idx > 0) {
    const beforeP4 = main.slice(0, p4Idx).trim()
    const part4 = main.slice(p4Idx).trim()
    let head = splitOnRules(beforeP4)

    if (head.length === 3) return [...head, part4]
    if (head.length === 2) {
      const twinIdx = head[0].search(
        /Twinning Association here tonight|[A-Z][a-z]+ (?:Twinning )?Association here tonight|Welcome to .* tour|Good morning,? everyone\. My name/i
      )
      if (twinIdx > 400) {
        head = [head[0].slice(0, twinIdx).trim(), head[0].slice(twinIdx).trim(), head[1]]
      } else {
        head = [...splitIntoNearEqualParts(head[0], 2), head[1]]
      }
    } else if (head.length <= 1) {
      head = splitIntoNearEqualParts(beforeP4, 3)
    }

    head = head.filter((part) => part.length > 80)
    if (head.length === 3 && part4.length > 80) return [...head, part4]
  }

  if (parts.length >= 4) return parts.slice(0, 4)
  if (parts.length === 3) return parts

  if (parts.length === 2) {
    const merged = splitIntoNearEqualParts(`${parts[0]}\n\n${parts[1]}`, 4)
    if (merged.length === 4) return merged
  }

  const equalParts = splitIntoNearEqualParts(main, 4)
  if (equalParts.length === 4) return equalParts

  return parts.length ? parts : main.length > 80 ? [main] : [block]
}

const loadPart1Script = (book, test) => {
  const scriptPath = path.join(__dirname, 'part1-scripts', `cam${book}-test${String(test).padStart(2, '0')}.txt`)
  if (!fs.existsSync(scriptPath)) return null
  return fs.readFileSync(scriptPath, 'utf8').trim()
}

const fetchTest = async (book, test) => {
  const url = `${BASE}-${book}-academic-listening-test-${test}/`
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; IELTS-SPEAKING/1.0)' } })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  const html = await res.text()
  const audioUrls = extractAudioUrls(html)
  const transcript = extractTranscriptBlock(html)
  let partTexts = splitTranscriptIntoParts(transcript)
  while (partTexts.length < 4) {
    partTexts.push('')
  }
  partTexts = partTexts.slice(0, 4)

  const parts = partTexts.map((text, index) => ({
    section: index + 1,
    scriptParagraphs: text.trim() ? splitScriptParagraphs(text) : []
  }))

  if (book >= 19) {
    const part1 = loadPart1Script(book, test)
    if (part1) {
      const part1Paragraphs = splitScriptParagraphs(part1)
      if (part1Paragraphs.length && parts[0]) {
        parts[0].scriptParagraphs = part1Paragraphs
      }
    }
  }

  return { audioUrls, parts }
}

const main = async () => {
  const out = Object.fromEntries(BOOKS.map((book) => [String(book), {}]))
  for (const book of BOOKS) {
    for (let test = 1; test <= 4; test += 1) {
      try {
        const { audioUrls, parts } = await fetchTest(book, test)
        const entry = {}
        for (const part of parts) {
          if (!part.scriptParagraphs.length) continue
          entry[`section${part.section}`] = {
            test,
            title: `Cambridge ${book} Test ${test} Section ${part.section}`,
            scriptParagraphs: part.scriptParagraphs,
            audioUrl: audioUrls[part.section - 1]
          }
        }
        out[String(book)][String(test)] = entry
        console.log(`Cam ${book} Test ${test}: ${parts.length} sections, ${audioUrls.length} audios`)
        await sleep(600)
      } catch (err) {
        console.warn(`Cam ${book} Test ${test} failed:`, err.message)
      }
    }
  }
  const json = `${JSON.stringify(out, null, 2)}\n`
  fs.writeFileSync(OUT, json)
  const legacy = { 15: out['15'], 16: out['16'] }
  fs.writeFileSync(LEGACY_OUT, `${JSON.stringify(legacy, null, 2)}\n`)
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
