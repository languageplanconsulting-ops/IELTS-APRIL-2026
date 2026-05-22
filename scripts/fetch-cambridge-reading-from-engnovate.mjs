/**
 * Fetch Cambridge reading passages, questions, and answer keys from Engnovate.
 * Run: node scripts/fetch-cambridge-reading-from-engnovate.mjs [book...]
 * Example: node scripts/fetch-cambridge-reading-from-engnovate.mjs 11 14 15 16
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildComprehensiveEnrichment } from './cambridge-17-enrichment-builder.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const DEFAULT_BOOKS = [11, 14, 15, 16]
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const decodeHtml = (html) =>
  html
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&rsquo;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&hellip;/g, '...')
    .replace(/&eacute;/g, 'é')

const htmlToText = (html) =>
  decodeHtml(html)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\r/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

const pageUrl = (book, test) =>
  `https://engnovate.com/ielts-reading-tests/cambridge-ielts-${book}-academic-reading-test-${test}/`

const fetchHtml = async (book, test) => {
  const res = await fetch(pageUrl(book, test), {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; IELTS-SPEAKING/1.0)' }
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} for Cam ${book} Test ${test}`)
  return res.text()
}

const extractPassageBlocks = (html) => {
  const blocks = []

  for (let passageNum = 1; passageNum <= 3; passageNum += 1) {
    const startMarker = `id="ielts-reading-transcript-${passageNum}"`
    const startIdx = html.indexOf(startMarker)
    if (startIdx < 0) continue

    const endMarker =
      passageNum < 3 ? `id="ielts-reading-transcript-${passageNum + 1}"` : 'ielts-reading-test-form'
    const endIdx = html.indexOf(endMarker, startIdx + startMarker.length)
    const chunk = html.slice(startIdx, endIdx > startIdx ? endIdx : startIdx + 50000)

    const titleMatch = chunk.match(
      /ielts-reading-passage-subhead[\s\S]*?<strong[^>]*>([\s\S]*?)<\/strong>/i
    )
    const title = htmlToText(titleMatch?.[1] || '').replace(/\s+/g, ' ').trim() || `Passage ${passageNum}`

    const subheadEnd = chunk.search(/ielts-reading-passage-subhead[\s\S]*?<\/p>/i)
    const firstQuestionIdx = chunk.search(/Questions \d+-\d+/i)
    let bodyHtml = chunk
    if (subheadEnd >= 0) {
      const afterTitle = chunk.slice(subheadEnd).replace(/^[\s\S]*?<\/p>/i, '')
      bodyHtml = firstQuestionIdx >= 0 ? afterTitle.slice(0, firstQuestionIdx - subheadEnd) : afterTitle
    } else if (firstQuestionIdx >= 0) {
      bodyHtml = chunk.slice(0, firstQuestionIdx)
    }

    const body = htmlToText(bodyHtml)
      .replace(new RegExp(`^${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, 'i'), '')
      .replace(/^READING PASSAGE\s+\d+\s*/i, '')
      .replace(/^Scientist[^.]*\.\s*/i, '')
      .trim()

    blocks.push({ passage: passageNum, title, body })
  }

  if (blocks.length === 3) return blocks

  // Fallback: legacy subhead slicing
  const subheadIndices = []
  let pos = 0
  while (true) {
    const idx = html.indexOf('ielts-reading-passage-subhead', pos)
    if (idx < 0) break
    subheadIndices.push(idx)
    pos = idx + 1
  }

  const firstQuestionIdx = html.search(/Questions \d+-\d+/i)
  if (subheadIndices.length < 3 || firstQuestionIdx < 0) {
    throw new Error('Could not locate 3 passage transcripts or question section')
  }

  const sliceTitle = (startIdx) => {
    const chunk = html.slice(startIdx, startIdx + 500)
    const text = htmlToText(chunk.split('\n')[0] || chunk)
    return text.replace(/^ielts-reading-passage-subhead\s*/i, '').trim()
  }

  const sliceBody = (startIdx, endIdx) => {
    const chunk = html.slice(startIdx, endIdx)
    const text = htmlToText(chunk)
    const lines = text.split('\n').map((line) => line.trim()).filter(Boolean)
    return lines.slice(1).join('\n\n').trim()
  }

  return [
    { passage: 1, title: sliceTitle(subheadIndices[0]), body: sliceBody(subheadIndices[0], subheadIndices[1]) },
    { passage: 2, title: sliceTitle(subheadIndices[1]), body: sliceBody(subheadIndices[1], subheadIndices[2]) },
    { passage: 3, title: sliceTitle(subheadIndices[2]), body: sliceBody(subheadIndices[2], firstQuestionIdx) }
  ]
}

const extractQuestionSectionByRange = (html, startQ, endQ, prompts) => {
  const header = `Questions ${startQ}-${endQ}`
  const lines = []
  for (let number = startQ; number <= endQ; number += 1) {
    const prompt = prompts.get(number)
    if (prompt) lines.push(`${number}. ${prompt}`)
  }
  return lines.length ? `${header}\n\n${lines.join('\n\n')}` : header
}

const inferPassageQuestionRange = (passageNum) => {
  if (passageNum === 1) return { start: 1, end: 13 }
  if (passageNum === 2) return { start: 14, end: 26 }
  return { start: 27, end: 40 }
}

const extractQuestionPrompts = (html) => {
  const prompts = new Map()

  const addPrompt = (number, text) => {
    const cleaned = String(text || '')
      .replace(/\s+/g, ' ')
      .replace(/\s*…\s*/g, ' … ')
      .trim()
    if (cleaned.length <= 4 || /^Question\s+\d+$/i.test(cleaned)) return
    const existing = prompts.get(number)
    if (!existing || cleaned.length > existing.length) {
      prompts.set(number, cleaned)
    }
  }

  const stripOptionsFromPrompt = (text) =>
    String(text || '')
      .replace(/\s+A\s*(?:TRUE|FALSE|NOT GIVEN)(?:\s+B\s*(?:TRUE|FALSE|NOT GIVEN))?(?:\s+C\s*(?:NOT GIVEN))?[\s\S]*$/i, '')
      .replace(/\s+A(?:TRUE|FALSE|NOT GIVEN)[\s\S]*$/i, '')
      .replace(/\s+A\s+[A-Z][\w\s,.'()-]{8,}(?:\s+B\s+[A-Z][\w\s,.'()-]{8,})?[\s\S]*$/i, '')
      .trim()

  const liRe = /ielts-reading-question-number-(\d+)/gi
  let match
  while ((match = liRe.exec(html))) {
    const number = Number(match[1])
    const pos = match.index
    const before = html.slice(Math.max(0, pos - 700), pos)
    const after = html.slice(pos, pos + 700)
    const liStart = before.lastIndexOf('<li>')
    const liEnd = after.indexOf('</li>')
    if (liStart < 0 || liEnd < 0) continue
    const liHtml = `${before.slice(liStart)}${after.slice(0, liEnd + 5)}`
    const liText = htmlToText(
      liHtml
        .replace(/<input[^>]*>/gi, ' … ')
        .replace(/<strong[^>]*>\d+<\/strong>/gi, ' … ')
        .replace(/<span[^>]*>/gi, ' ')
        .replace(/<\/span>/gi, ' ')
    )
    addPrompt(number, stripOptionsFromPrompt(liText.replace(new RegExp(`^${number}\\s*`, 'i'), '')))
  }

  const strongRe =
    /<strong[^>]*class\s*=\s*["']ielts-reading-question-number["'][^>]*>(\d+)<\/strong>([\s\S]*?)(?=<strong|<div\s+class\s*=\s*["']ielts-reading-option|<\/form)/gi
  let strongMatch
  while ((strongMatch = strongRe.exec(html))) {
    const number = Number(strongMatch[1])
    if (prompts.has(number)) continue
    let text = htmlToText(
      strongMatch[2]
        .replace(/<input[^>]*>/gi, ' … ')
        .replace(/<strong[^>]*>\d+<\/strong>/gi, ' … ')
    )
    addPrompt(number, stripOptionsFromPrompt(text))
  }

  const sharedStemRe =
    /<strong[^>]*class\s*=\s*["']ielts-reading-question-number["'][^>]*>(\d+)<\/strong>\s*<strong[^>]*class\s*=\s*["']ielts-reading-question-number["'][^>]*>(\d+)<\/strong>\s*([\s\S]*?)(?=<div\s+class\s*=\s*["']ielts-reading-option)/gi
  let sharedMatch
  while ((sharedMatch = sharedStemRe.exec(html))) {
    const stemHtml = sharedMatch[3].replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '$1')
    const stem = stripOptionsFromPrompt(htmlToText(stemHtml))
    if (!stem || stem.length < 10) continue
    const first = Number(sharedMatch[1])
    const second = Number(sharedMatch[2])
    addPrompt(first, stem)
    addPrompt(second, stem)
    for (let number = Math.min(first, second); number <= Math.max(first, second); number += 1) {
      if (!prompts.has(number)) addPrompt(number, stem)
    }
  }

  const sharedSpanRe =
    /<strong[^>]*>(\d+)<\/strong>\s*<strong[^>]*>(\d+)<\/strong>\s*<span>([\s\S]*?)<\/span>/gi
  let spanMatch
  while ((spanMatch = sharedSpanRe.exec(html))) {
    const stemHtml = spanMatch[3].replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '$1')
    const stem = stripOptionsFromPrompt(htmlToText(stemHtml))
    if (!stem || stem.length < 10) continue
    addPrompt(Number(spanMatch[1]), stem)
    addPrompt(Number(spanMatch[2]), stem)
  }

  const diagramImgRe = /alt="([^"]+)"/gi
  let diagramMatch
  while ((diagramMatch = diagramImgRe.exec(html))) {
    const alt = diagramMatch[1]
    if (!/ielts-reading|reading test/i.test(alt)) continue
    const trailMatch = alt.match(/\s(\d+)\s*-\s*(\d+)\s*$/)
    if (!trailMatch) continue
    const start = Number(trailMatch[1])
    const end = Number(trailMatch[2])
    if (end <= start || end > 40 || start < 1) continue
    const afterImg = html.slice(diagramMatch.index, diagramMatch.index + 6000)
    if (!afterImg.includes('ielts-reading-questions')) continue
    for (let number = start; number <= end; number += 1) {
      if (prompts.has(number)) continue
      addPrompt(
        number,
        `Label the diagram (Questions ${start}-${end}): write ONE WORD ONLY from the passage for question ${number}`
      )
    }
  }

  return prompts
}

const fetchAnswerResults = async (html) => {
  const nonce = html.match(/name="ielts_reading_test_nonce"\s*value="([^"]+)"/)?.[1]
  const postId = html.match(/id="post_id"\s*name="post_id"\s*value="([^"]+)"/)?.[1]
  if (!nonce || !postId) throw new Error('Missing nonce or post_id')

  const formStart = html.indexOf('ielts-reading-test-form')
  const formHtml = html.slice(formStart, html.indexOf('</form>', formStart))
  const inputs = [...formHtml.matchAll(/name="(ielts_reading_answer[^"]+)"/gi)]

  const params = new URLSearchParams()
  params.append('action', 'process_ielts_reading_test')
  params.append('ielts_reading_test_nonce', nonce)
  params.append('post_id', postId)
  params.append('time_taken_seconds', '0')
  for (const input of inputs) params.append(input[1], '')

  const res = await fetch('https://engnovate.com/wp-admin/admin-ajax.php', {
    method: 'POST',
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; IELTS-SPEAKING/1.0)',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  })
  const json = await res.json()
  if (!json.success || !Array.isArray(json.data?.results) || json.data.results.length !== 40) {
    throw new Error(`Answer fetch failed (${json.data?.results?.length || 0}/40 results)`)
  }
  return json.data.results
}

const splitChooseTwoAnswer = (value) => {
  const parts = String(value || '')
    .split('/')
    .map((part) => part.trim())
    .filter(Boolean)
  return parts.length >= 2 ? parts : [String(value || '').trim()]
}

const buildAnswerKeyBlock = ({ number, prompt, answer, accepted, test, passage, explanation, body }) => {
  const enrich = buildComprehensiveEnrichment({
    body,
    prompt,
    answer,
    hand: usableExactHint(explanation) ? { exact: usableExactHint(explanation) } : {}
  })

  return `Question ${number}: ${prompt}

Correct Answer: ${answer}

Accepted Answers: ${accepted ?? answer}

Answer Group: Cambridge ${test.book} Test ${test.testNumber} Passage ${passage}

Exact Portion: "${String(enrich.exact || prompt).replace(/"/g, '\\"')}"

Short Thai Explanation: ${enrich.thai}

Paraphrased Vocabulary: ${enrich.para}`
}

const usableExactHint = (explanation) => {
  const hint = String(explanation || '').trim()
  if (!hint || hint.length < 20) return ''
  if (/^Question\s+\d+$/i.test(hint)) return ''
  return hint
}

const buildPassageText = (passageNum, title, body, questionSection) =>
  `READING PASSAGE ${passageNum}\n${title}\n\n${body}\n\n${questionSection}`.trim()

const buildTestItems = (book, test, html, answerResults, prompts) => {
  const passages = extractPassageBlocks(html)
  const items = []

  for (const passageBlock of passages) {
    const { start, end } = inferPassageQuestionRange(passageBlock.passage)
    const questionSection = extractQuestionSectionByRange(html, start, end, prompts)
    const category = passageBlock.passage === 3 ? 'advanced' : 'normal'

    const questionRows = []
    for (let number = start; number <= end; number += 1) {
      const result = answerResults[number - 1]
      if (!result) continue
      let answer = String(result.correct_answer || '').trim()
      let accepted = answer

      if (answer.includes('/')) {
        const options = splitChooseTwoAnswer(answer)
        answer = options[(number - start) % options.length] || options[0]
        accepted = options.join('|')
      }

      const prompt = prompts.get(number) || `Question ${number}`
      questionRows.push({
        number,
        prompt,
        answer,
        accepted,
        explanation: String(result.explanation || '').trim()
      })
    }

    const rawAnswerKey = `READING PASSAGE ${passageBlock.passage}: ${passageBlock.title}\n\n${questionRows
      .map((row) =>
        buildAnswerKeyBlock({
          number: row.number,
          prompt: row.prompt,
          answer: row.answer,
          accepted: row.accepted,
          test: { book, testNumber: test },
          passage: passageBlock.passage,
          explanation: row.explanation,
          body: passageBlock.body
        })
      )
      .join('\n\n')}`

    items.push({
      id: `cambridge-${book}-test${test}-passage${passageBlock.passage}`,
      title: `Cambridge ${book} Test ${test} Passage ${passageBlock.passage} - ${passageBlock.title}`,
      category,
      rawPassageText: buildPassageText(
        passageBlock.passage,
        passageBlock.title,
        passageBlock.body,
        questionSection
      ),
      rawAnswerKey
    })
  }

  return items
}

const buildBook = async (book) => {
  const allItems = []
  for (let test = 1; test <= 4; test += 1) {
    const html = await fetchHtml(book, test)
    const answerResults = await fetchAnswerResults(html)
    const prompts = extractQuestionPrompts(html)
    const items = buildTestItems(book, test, html, answerResults, prompts)
    allItems.push(...items)
    console.log(`Cam ${book} Test ${test}: ${items.length} passages, ${answerResults.length} answers`)
    await sleep(500)
  }

  const outPath = path.join(root, 'cambridge-reading-imports', `cambridge-${book}-reading-import.json`)
  fs.writeFileSync(outPath, `${JSON.stringify(allItems, null, 2)}\n`)
  console.log(`Wrote ${allItems.length} items to ${outPath}`)
  return allItems.length
}

const main = async () => {
  const books = process.argv.slice(2).map(Number).filter(Boolean)
  const targetBooks = books.length ? books : DEFAULT_BOOKS
  for (const book of targetBooks) {
    await buildBook(book)
  }
}

const isDirectRun =
  process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))

if (isDirectRun) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
