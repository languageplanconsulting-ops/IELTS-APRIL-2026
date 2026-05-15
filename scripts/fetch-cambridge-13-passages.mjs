import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'cambridge-13-passages')

const PAGES = [
  { test: 1, passage: 1, url: 'https://ieltsprogress.com/case-study-tourism-new-zealand-website-answers/' },
  { test: 1, passage: 2, url: 'https://ieltsprogress.com/why-being-bored-is-stimulating-useful-too-answers/' },
  { test: 1, passage: 3, url: 'https://ieltsprogress.com/artificial-artists-reading-answers-pdf/' },
  { test: 2, passage: 1, url: 'https://ieltsprogress.com/bringing-cinnamon-to-europe-reading-answers-pdf/' },
  { test: 2, passage: 2, url: 'https://ieltsprogress.com/oxytocin-reading-answers-pdf/' },
  { test: 2, passage: 3, url: 'https://ieltsprogress.com/making-the-most-of-trends-reading-answers-pdf/' },
  { test: 3, passage: 1, url: 'https://ieltsprogress.com/the-coconut-palm-reading-answers-pdf/' },
  { test: 3, passage: 2, url: 'https://ieltsprogress.com/how-baby-talk-gives-infant-brains-a-boost/' },
  { test: 3, passage: 3, url: 'https://ieltsprogress.com/whatever-happened-to-harappan-civilisation-answers/' },
  { test: 4, passage: 1, url: 'https://ieltsprogress.com/cutty-sark-fastest-sailing-ship-answers/' },
  { test: 4, passage: 2, url: 'https://ieltsprogress.com/saving-the-soil-reading-answers-pdf/' },
  { test: 4, passage: 3, url: 'https://ieltsprogress.com/book-review-reading-answers-pdf/' },
]

/** Strip HTML to rough markdown-like text from article body */
function htmlToText(html) {
  let t = html
  t = t.replace(/<script[\s\S]*?<\/script>/gi, '')
  t = t.replace(/<style[\s\S]*?<\/style>/gi, '')
  t = t.replace(/<nav[\s\S]*?<\/nav>/gi, '')
  t = t.replace(/<header[\s\S]*?<\/header>/gi, '')
  // headings
  t = t.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n## $1\n')
  t = t.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n### $1\n')
  t = t.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_, inner) => {
    const text = inner.replace(/<[^>]+>/g, '').trim()
    return `\n#### ${text}\n`
  })
  // paragraphs & breaks
  t = t.replace(/<\/p>\s*<p[^>]*>/gi, '\n\n')
  t = t.replace(/<br\s*\/?>/gi, '\n')
  t = t.replace(/<\/p>/gi, '\n\n')
  t = t.replace(/<p[^>]*>/gi, '')
  // links: keep anchor text only
  t = t.replace(/<a[^>]*>([\s\S]*?)<\/a>/gi, '$1')
  t = t.replace(/<[^>]+>/g, '')
  t = t
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&quot;/g, '"')
  return t
}

function decodeEntities(s) {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&[a-z]+;/gi, (m) => {
      const map = { amp: '&', lt: '<', gt: '>', quot: '"', nbsp: ' ' }
      const k = m.slice(1, -1)
      return map[k] ?? m
    })
}

function cleanPassage(s) {
  return decodeEntities(s)
    .replace(/\[[^\]]*\]\([^)]*\)/g, (m) => {
      const inner = m.match(/\[([^\]]*)\]/)
      return inner ? inner[1] : m
    })
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+\n/g, '\n')
    .trim()
}

function findPassageTitle(lines) {
  // First ## heading that is NOT Questions/Answers/PDF/CONTENTS/nav junk
  const skip = /^(questions|answers|pdf|contents|also try|check out|have any doubts|all the best|ielts academic)/i
  for (const line of lines) {
    const m = line.match(/^##\s+(.+)$/)
    if (!m) continue
    const title = m[1].trim()
    if (skip.test(title)) continue
    if (/answers$/i.test(title) && !/reading/i.test(title)) continue
    return title
  }
  return null
}

function extractFromMarkdown(md) {
  const lines = md.split('\n')
  const title = findPassageTitle(lines)
  if (!title) return { title: null, passage: '', questions: '' }

  const titleRe = new RegExp(`^##\\s+${escapeRe(title)}\\s*$`, 'i')
  let startIdx = lines.findIndex((l) => titleRe.test(l.trim()))
  if (startIdx < 0) {
    startIdx = lines.findIndex((l) => l.trim().toLowerCase() === `## ${title.toLowerCase()}`)
  }

  const isQuestionsHeading = (line) => /^#{2,4}\s+Questions\b/i.test(line.trim())
  const isAnswersHeading = (line) => /^#{2,4}\s+.+\s+Answers\s*$/i.test(line.trim())

  let qStart = -1
  for (let i = startIdx + 1; i < lines.length; i++) {
    if (isQuestionsHeading(lines[i])) {
      qStart = i
      break
    }
  }

  const passageLines = lines.slice(startIdx + 1, qStart < 0 ? lines.length : qStart)
  let passage = passageLines.join('\n').trim()

  let questions = ''
  if (qStart >= 0) {
    let qEnd = lines.length
    for (let i = qStart + 1; i < lines.length; i++) {
      const t = lines[i].trim()
      if (isAnswersHeading(t)) {
        qEnd = i
        break
      }
      if (/^_{3,}$/.test(t) || /^ALSO TRY:/i.test(t)) {
        qEnd = i
        break
      }
    }
    questions = lines
      .slice(qStart, qEnd)
      .map((l) => l.replace(/^####\s+/, '## '))
      .join('\n')
      .trim()
  }

  return { title, passage: cleanPassage(passage), questions: cleanPassage(questions) }
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

async function fetchPage(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; IELTS-passage-fetch/1.0)' },
  })
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`)
  const html = await res.text()
  // prefer entry-content / post content
  const article =
    html.match(/<article[^>]*class="[^"]*post[^"]*"[^>]*>([\s\S]*?)<\/article>/i)?.[1] ??
    html.match(/<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/motion\.div>/i)?.[1] ??
    html.match(/<motion\.motion\.div[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/motion\.motion\.motion\.div>/i)?.[1] ??
    html.match(/<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/i)?.[1] ??
    html.match(/<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]{500,}?)<\/div>/i)?.[1]

  if (!article) {
    // fallback: whole body between first passage h2 and questions
    const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? html
    return htmlToText(body)
  }
  return htmlToText(article)
}

const results = []

for (const { test, passage, url } of PAGES) {
  const base = `test${test}-passage${passage}`
  const passagePath = path.join(OUT_DIR, `${base}.txt`)
  const questionsPath = path.join(OUT_DIR, `${base}-questions.txt`)

  process.stderr.write(`Fetching ${base}…\n`)
  const md = await fetchPage(url)
  const { title, passage: passageText, questions } = extractFromMarkdown(md)

  const header = title ? `${title}\n\n` : ''
  fs.writeFileSync(passagePath, header + passageText, 'utf8')

  let qWritten = false
  if (questions) {
    fs.writeFileSync(questionsPath, questions, 'utf8')
    qWritten = true
  }

  results.push({
    passageFile: passagePath,
    questionsFile: qWritten ? questionsPath : null,
    passagePreview: (header + passageText).slice(0, 200),
    questionsPreview: questions ? questions.slice(0, 200) : null,
  })
}

console.log(JSON.stringify(results, null, 2))
