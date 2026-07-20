/**
 * Fetch Cambridge 15–20 listening question stems + options from Engnovate practice pages.
 * Run: node scripts/fetch-cambridge-listening-questions.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, 'cambridge-listening-questions.json')
const LEGACY_OUT = path.join(__dirname, 'cambridge-1516-listening-questions.json')

const BASE = 'https://engnovate.com/ielts-listening-tests/cambridge-ielts'
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

const stripTags = (html) => decodeHtml(String(html || '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()

const clip = (text, max = 72) => {
  const value = String(text || '').trim()
  return value.length > max ? `${value.slice(0, max)}…` : value
}

const deriveMcPhrase = (stem) => {
  let phrase = String(stem || '').trim()
  phrase = phrase.replace(/^According to the (?:speaker|manager|guide|notes),?\s*/i, '')
  phrase = phrase.replace(/^What do (?:the )?speakers? say about (?:the )?/i, '')
  const about = phrase.match(/\babout (?:the )?(.+?)(?:\?|$)/i)
  if (about) phrase = about[1].trim()
  phrase = phrase.replace(/\?$/, '').trim()
  return clip(phrase, 72) || clip(stem, 72)
}

const deriveGapPhrase = (gapLine) => {
  const line = String(gapLine || '').replace(/\s+/g, ' ').trim()
  if (!line) return ''
  const parts = line.split('____')
  const before = parts[0]?.trim().split(/\s+/).slice(-6).join(' ') || ''
  const after = parts[1]?.trim().split(/\s+/).slice(0, 5).join(' ') || ''
  const combined = [before, after].filter(Boolean).join(' ').trim()
  return clip(combined || line.replace(/\d+/g, '').trim(), 72)
}

const sectionForQuestion = (qNum) => {
  if (qNum <= 10) return 1
  if (qNum <= 20) return 2
  if (qNum <= 30) return 3
  return 4
}

const extractSectionBlocks = (html) => {
  const blocks = []
  const re = /Questions\s+(\d+)-(\d+)[\s\S]*?(?=Questions\s+\d+-\d+|<h2[^>]*>\s*Audioscript|$)/gi
  let match
  while ((match = re.exec(html))) {
    blocks.push({
      start: Number(match[1]),
      end: Number(match[2]),
      html: match[0],
      index: match.index
    })
  }
  return blocks
}

const findBlockForQuestion = (blocks, qNum, html) => {
  const re = questionMarkerRe(qNum)
  const candidates = blocks.filter((block) => qNum >= block.start && qNum <= block.end)
  if (!candidates.length) return null

  const withMarker = candidates.filter((block) => re.test(block.html))
  re.lastIndex = 0
  const pool = withMarker.length ? withMarker : candidates
  return pool.sort((a, b) => b.html.length - a.html.length)[0]
}

const findSectionIntroBefore = (html, qPos) => {
  const before = html.slice(Math.max(0, qPos - 12000), qPos)
  const introMatch = [...before.matchAll(/ielts-listening-question-section-content[^>]*>([\s\S]*?)<\/div>/gi)].pop()
  if (!introMatch) return { instruction: '', sharedStem: '' }

  const paragraphs = [...introMatch[1].matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map((m) => stripTags(m[1]))
  const instruction = paragraphs.slice(0, 2).filter(Boolean).join('\n')
  const sharedStem =
    paragraphs.find((p) => p && !/choose|write|complete|label|which two|one word|correct letter/i.test(p)) || ''
  return { instruction, sharedStem }
}

const extractDndOptionsNear = (html, qPos) => {
  const chunk = html.slice(Math.max(0, qPos - 2000), qPos + 20000)
  const cards = [...chunk.matchAll(/dnd-card[^>]*data-value="([A-H])"[^>]*>[\s\S]*?dnd-text">([^<]+)</gi)]
  if (!cards.length) return []

  const seen = new Set()
  return cards
    .map((m) => ({ key: m[1].toUpperCase(), text: decodeHtml(m[2]).trim() }))
    .filter((opt) => {
      if (seen.has(opt.key)) return false
      seen.add(opt.key)
      return true
    })
}

const questionMarkerRe = (qNum) =>
  new RegExp(`ielts-listening-question-number-${qNum}(?=["'\\s>])`, 'gi')

const findQuestionPosition = (html, qNum) => {
  const re = questionMarkerRe(qNum)
  const positions = []
  let match
  while ((match = re.exec(html))) {
    positions.push(match.index)
  }
  if (!positions.length) return -1

  for (let i = positions.length - 1; i >= 0; i -= 1) {
    const chunk = html.slice(positions[i], positions[i] + 600)
    if (/<input|ielts-listening-option|dnd-drop|dnd-zone|dnd-drop-placeholder/i.test(chunk)) {
      return positions[i]
    }
  }
  return positions[positions.length - 1]
}

const chunkUntilNextQuestion = (html, qPos, qNum) => {
  let nextPos = qNum < 40 ? findQuestionPosition(html, qNum + 1) : -1
  if (nextPos > qPos && nextPos - qPos < 600) {
    const pairedPos = qNum + 1 < 40 ? findQuestionPosition(html, qNum + 2) : -1
    if (pairedPos > nextPos) nextPos = pairedPos
  }
  const end = nextPos > qPos ? nextPos : qPos + 5000
  return html.slice(qPos, end)
}

const extractChooseTwoStem = (chunk) => {
  const whichTwo = chunk.match(/<span>([\s\S]*?Which[\s\S]{0,400}?)<\/span>/i)
  if (whichTwo && /two/i.test(whichTwo[1])) return stripTags(whichTwo[1])
  return ''
}

const extractMcOptions = (chunk) =>
  [...chunk.matchAll(/ielts-listening-option-letter[^>]*>\s*([A-G])\s*<\/label>[\s\S]*?<span>([^<]+)<\/span>/gi)]
    .map((m) => ({
      key: m[1].toUpperCase(),
      text: decodeHtml(m[2]).trim()
    }))
    .filter((opt, index, list) => list.findIndex((item) => item.key === opt.key) === index)

const extractMcQuestion = (html, qNum) => {
  const pos = findQuestionPosition(html, qNum)
  if (pos < 0) return null

  const chunk = chunkUntilNextQuestion(html, pos, qNum)
  const standardStem = chunk.match(
    /ielts-listening-question-number-\d+[\s\S]*?>\s*\d+\s*<\/strong>\s*<span>([\s\S]*?)<\/span>/i
  )
  const whichTwoStem = extractChooseTwoStem(chunk)
  const stem = standardStem
    ? stripTags(standardStem[1]).trim()
    : whichTwoStem
  const options = extractMcOptions(chunk)

  if (!stem && !options.length) return null
  if (!stem) return null

  return { stem, options, whichTwo: Boolean(whichTwoStem) || /data-limit="2"/i.test(chunk) }
}

const extractGapLine = (html, qNum) => {
  const pos = findQuestionPosition(html, qNum)
  if (pos < 0) return ''

  const before = html.slice(Math.max(0, pos - 1200), pos)
  const liStartRel = before.lastIndexOf('<li')
  const tdStartRel = before.lastIndexOf('<td')
  const pStartRel = before.lastIndexOf('<p')
  const containerStartRel = Math.max(liStartRel, tdStartRel, pStartRel)
  if (containerStartRel < 0) return ''

  const absStart = Math.max(0, pos - 1200) + containerStartRel
  const afterFragment = html.slice(pos, pos + 800)
  const closeCandidates = [
    afterFragment.indexOf('</li>'),
    afterFragment.indexOf('</td>'),
    afterFragment.indexOf('</p>')
  ].filter((idx) => idx >= 0)
  const endPos = closeCandidates.length ? pos + Math.min(...closeCandidates) + 5 : pos + 400

  const chunk = html.slice(absStart, endPos)

  return stripTags(
    chunk
      .replace(new RegExp(`<strong[^>]*>\\s*${qNum}\\s*</strong>`, 'g'), ' ')
      .replace(/<input[^>]*>/gi, '____')
  ).replace(/\s+/g, ' ').trim()
}

const extractMatchingRow = (html, qNum) => {
  const pos = findQuestionPosition(html, qNum)
  if (pos < 0) return null

  const chunk = html.slice(Math.max(0, pos - 400), pos + 400)
  if (!/dnd-drop-placeholder|options-drop-zone dnd-zone/i.test(chunk)) return null
  const rowMatch = chunk.match(/ielts-listening-question-item[^>]*>\s*•?\s*<span>([^<]+)<\/span>/i)
  return rowMatch ? decodeHtml(rowMatch[1]).trim() : ''
}

const extractDndOptions = (blockHtml) => {
  const cards = [...blockHtml.matchAll(/dnd-card[^>]*data-value="([A-H])"[^>]*>[\s\S]*?dnd-text">([^<]+)</gi)]
  if (!cards.length) return []
  const seen = new Set()
  return cards
    .map((m) => ({ key: m[1].toUpperCase(), text: decodeHtml(m[2]).trim() }))
    .filter((opt) => {
      if (seen.has(opt.key)) return false
      seen.add(opt.key)
      return true
    })
}

/**
 * "Label the map/plan/diagram" style matching: a shared table with a lettered header row
 * (A, B, C, ...) and one row per question holding just a row label + radio picks — no option
 * text exists anywhere in the markup, only in the accompanying map/diagram image.
 */
const extractMapMatchingContext = (html, qNum) => {
  const re = new RegExp(
    `ielts-listening-matching-question-cell">\\s*<strong[^>]*id\\s*=\\s*"ielts-listening-question-number-${qNum}"[^>]*>\\s*${qNum}\\s*<\\/strong>\\s*<span>([^<]+)<\\/span>`,
    'i'
  )
  const rowMatch = html.match(re)
  if (!rowMatch) return null

  const tableStart = html.lastIndexOf('<table class="ielts-listening-matching-table">', rowMatch.index)
  if (tableStart < 0) return null

  const theadMatch = html.slice(tableStart, rowMatch.index).match(/<thead>([\s\S]*?)<\/thead>/i)
  const letters = theadMatch
    ? [...theadMatch[1].matchAll(/<th>([^<]*)<\/th>/gi)]
        .map((m) => decodeHtml(m[1]).trim())
        .filter((letter) => /^[A-H]$/.test(letter))
    : []
  if (!letters.length) return null

  const beforeTable = html.slice(Math.max(0, tableStart - 4000), tableStart)
  const imgMatches = [...beforeTable.matchAll(/<img[^>]*\ssrc="([^"]+)"[^>]*>/gi)]
  const imageUrl = imgMatches.length ? imgMatches[imgMatches.length - 1][1] : ''

  return {
    rowLabel: decodeHtml(rowMatch[1]).trim(),
    options: letters.map((key) => ({ key, text: '' })),
    imageUrl
  }
}

const buildQuestionText = ({ type, instruction, sharedStem, stem, gapLine, rowLabel, options, qNum }) => {
  const optionLines = options.map((opt) => `${opt.key} ${opt.text}`).join('\n')

  if (type === 'choice') {
    const header = sharedStem && stem && sharedStem !== stem ? `${sharedStem}\n${stem}` : stem || sharedStem
    return [header, optionLines].filter(Boolean).join('\n')
  }

  if (type === 'matching-row') {
    const parts = [sharedStem || instruction, optionLines ? `Options\n${optionLines}` : '', `${qNum} ${rowLabel}`].filter(
      Boolean
    )
    return parts.join('\n')
  }

  const gapHeader = instruction || 'Complete the notes below.'
  const gapBody = gapLine.includes('____') ? gapLine : `${qNum} ____`
  return `${gapHeader}\n${gapBody}`
}

const buildQuestionWordPhrase = ({ type, stem, gapLine, rowLabel, options, answer }) => {
  if (type === 'choice') {
    const key = String(answer || '').trim().toUpperCase()
    const opt = options.find((o) => o.key === key)
    if (/which\s+two/i.test(stem) && opt?.text) return clip(opt.text, 72)
    return deriveMcPhrase(stem)
  }
  if (type === 'matching-row') {
    const key = String(answer || '').trim().toUpperCase()
    const opt = options.find((o) => o.key === key)
    return opt?.text || rowLabel || deriveGapPhrase(gapLine)
  }
  return deriveGapPhrase(gapLine)
}

const parseTestQuestions = (html) => {
  const blocks = extractSectionBlocks(html)
  const questions = {}

  for (let qNum = 1; qNum <= 40; qNum += 1) {
    const qPos = findQuestionPosition(html, qNum)
    if (qPos < 0) continue

    const block = findBlockForQuestion(blocks, qNum, html)
    const { instruction, sharedStem } = findSectionIntroBefore(html, qPos)

    const mapMatch = extractMapMatchingContext(html, qNum)
    const mc = mapMatch ? null : extractMcQuestion(html, qNum)
    let rowLabel = extractMatchingRow(html, qNum)
    const gapLine = extractGapLine(html, qNum)
    const dndOptions = extractDndOptionsNear(html, qPos)

    let type = 'gap-fill'
    let stem = ''
    let options = []
    let mapImageUrl = ''

    if (mapMatch) {
      type = 'matching-row'
      rowLabel = mapMatch.rowLabel
      options = mapMatch.options
      mapImageUrl = mapMatch.imageUrl
    } else if (mc?.stem) {
      type = 'choice'
      stem = mc.stem
      options = mc.options
    } else if (rowLabel) {
      type = 'matching-row'
      options = dndOptions.length ? dndOptions : extractDndOptions(block?.html || html)
    }

    const questionText = buildQuestionText({
      type,
      instruction,
      sharedStem,
      stem,
      gapLine,
      rowLabel,
      options,
      qNum
    })

    questions[String(qNum)] = {
      questionNumber: qNum,
      section: sectionForQuestion(qNum),
      type,
      stem: stem || undefined,
      gapLine: type === 'gap-fill' ? gapLine : undefined,
      rowLabel: rowLabel || undefined,
      options,
      instruction: instruction || undefined,
      sharedStem: sharedStem || undefined,
      questionText,
      questionWordPhrase: '',
      mapImageUrl: mapImageUrl || undefined
    }
  }

  return questions
}

const fetchTest = async (book, test) => {
  const url = `${BASE}-${book}-academic-listening-test-${test}/`
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; IELTS-SPEAKING/1.0)' } })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  const html = await res.text()
  return parseTestQuestions(html)
}

const main = async () => {
  const out = { 15: {}, 16: {}, 17: {}, 19: {}, 20: {} }
  for (const book of [15, 16, 17, 19, 20]) {
    for (let test = 1; test <= 4; test += 1) {
      try {
        out[String(book)][String(test)] = await fetchTest(book, test)
        const sample11 = out[String(book)][String(test)]['11']
        const sample21 = out[String(book)][String(test)]['21']
        console.log(
          `Cam ${book} Test ${test}: Q11="${sample11?.stem || sample11?.gapLine?.slice(0, 40) || '?'}" Q21="${sample21?.stem || sample21?.rowLabel || sample21?.gapLine?.slice(0, 40) || '?'}"`
        )
        await sleep(600)
      } catch (err) {
        console.warn(`Cam ${book} Test ${test} failed:`, err.message)
      }
    }
  }
  const json = `${JSON.stringify(out, null, 2)}\n`
  fs.writeFileSync(OUT, json)
  fs.writeFileSync(LEGACY_OUT, json)
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

export { buildQuestionWordPhrase, deriveMcPhrase, deriveGapPhrase, parseTestQuestions }
