/** Build passage quotes, Thai explanations, and paraphrase pairs for Cambridge 19 */

const STOP = new Set([
  'about',
  'after',
  'also',
  'been',
  'before',
  'being',
  'both',
  'could',
  'does',
  'during',
  'each',
  'even',
  'first',
  'from',
  'have',
  'into',
  'just',
  'like',
  'made',
  'many',
  'more',
  'most',
  'much',
  'only',
  'other',
  'over',
  'people',
  'reference',
  'some',
  'such',
  'than',
  'that',
  'their',
  'them',
  'there',
  'these',
  'they',
  'this',
  'those',
  'through',
  'under',
  'were',
  'what',
  'when',
  'where',
  'which',
  'while',
  'with',
  'world',
  'would',
  'writer',
  'write',
  'written',
  'mention',
  'statement',
  'statements',
  'following',
  'information',
  'paragraph',
  'passage',
  'question',
  'correct',
  'answer',
  'sheet',
  'boxes',
  'choose',
  'word',
  'words',
  'letter',
  'letters',
  'agree',
  'views',
  'given',
  'reading'
])

export const passageBodyForQuotes = (body) => {
  const lines = body.split('\n')
  const first = lines[0]?.trim() || ''
  const rest =
    lines.length > 1 && first.length < 120 && !first.endsWith('.') ? lines.slice(1).join('\n') : body
  return rest.replace(/\n([A-H])\n/g, ' ').replace(/\n+/g, ' ')
}

export const getParagraphText = (body, letter) => {
  const upper = String(letter).toUpperCase()
  const pattern = new RegExp(`(?:^|\\n)${upper}\\s*\\n+([\\s\\S]*?)(?=\\n[A-H]\\s*\\n|$)`, 'm')
  const match = body.match(pattern)
  return match ? match[1].trim() : ''
}

export const significantWords = (text, minLen = 5) =>
  String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= minLen && !STOP.has(w))

const NEG_MARKERS = ['not', 'never', 'yet', 'however', 'but', 'unlikely', 'without', 'instead', 'rejected', 'denied', 'no ']

const splitSentences = (body) =>
  passageBodyForQuotes(body)
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.replace(/^[A-H]\s+/, '').trim())
    .filter((s) => s.length > 40)

const PROMPT_ALIASES = {
  weather: ['climatic', 'climate', 'court', 'surface'],
  transport: ['electric', 'car', 'batteries'],
  denial: ['rejected', 'connection'],
  involvement: ['connection', 'involved'],
  endangered: ['endangered'],
  lifespan: ['advanced', 'phenology']
}

const expandPromptWords = (pw) => {
  const extra = []
  for (const w of pw) {
    for (const a of PROMPT_ALIASES[w] || []) extra.push(a)
  }
  return [...pw, ...extra]
}

const rankSentences = (sentences, prompt, answer) => {
  const pw = expandPromptWords(significantWords(prompt, 4))
  const a = String(answer).toLowerCase()
  return sentences
    .map((s) => {
      const q = s.toLowerCase()
      let score = pw.filter((w) => q.includes(w)).length * 3
      const neg = NEG_MARKERS.filter((w) => q.includes(w)).length
      if (a === 'false' || a === 'no') {
        if (neg === 0) score -= 8
        else score += neg * 5
      }
      if (a === 'true' || a === 'yes') {
        score += pw.filter((w) => q.includes(w)).length
        score -= neg * 3
      }
      if (a === 'not given') {
        score -= neg * 2
      }
      if (a.length > 2 && !/^(true|false|yes|no|not given)$/.test(a) && q.includes(a)) score += 6
      return { s, score }
    })
    .sort((x, y) => y.score - x.score)
}

export const findQuote = (body, hints, answer, prompt = '') => {
  const keysList = String(hints || '')
    .split('|')
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean)

  const a = String(answer || '').trim().toLowerCase()
  if (/^(true|false|not given|yes|no)$/.test(a) && prompt) {
    const ranked = rankSentences(splitSentences(body), prompt, answer)
    if (ranked[0]?.score > 0) return clipQuote(ranked[0].s, prompt)
  }

  const letter = String(answer || '').trim().toUpperCase()
  if (/^[A-H]$/.test(letter)) {
    const para = getParagraphText(body, letter)
    if (para) {
      const sentences = para
        .replace(/\n+/g, ' ')
        .split(/(?<=[.!?])\s+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 40)
      if (prompt) {
        const ranked = rankSentences(sentences, prompt, answer)
        if (ranked[0]?.score > 0) return clipQuote(ranked[0].s, prompt)
      }
      const hit =
        sentences.find((s) => keysList.every((k) => s.toLowerCase().includes(k))) ||
        sentences.find((s) =>
          keysList.filter((k) => k.length > 4).every((k) => s.toLowerCase().includes(k))
        ) ||
        sentences.find((s) => keysList.some((k) => k.length > 4 && s.toLowerCase().includes(k))) ||
        sentences[0]
      if (hit) return clipQuote(hit, prompt)
    }
  }

  const sentences = splitSentences(body)

  const answerWord = String(answer || '').toLowerCase()
  if (answerWord.length > 2 && !/^(true|false|yes|no|not given)$/i.test(answerWord)) {
    const withAnswer = sentences.find((s) => s.toLowerCase().includes(answerWord))
    if (withAnswer) return clipQuote(withAnswer, prompt)
  }

  const hit =
    sentences.find((s) => keysList.every((k) => s.toLowerCase().includes(k))) ||
    sentences.find((s) =>
      keysList.filter((k) => k.length > 4).every((k) => s.toLowerCase().includes(k))
    ) ||
    sentences.find((s) => keysList.some((k) => k.length > 4 && s.toLowerCase().includes(k)))

  return clipQuote(hit || sentences[0] || passageBodyForQuotes(body), prompt)
}

export const buildHints = (prompt, answer, body) => {
  const a = String(answer).trim()
  const lower = a.toLowerCase()
  let promptWords = significantWords(prompt)

  const refMatch = prompt.match(/reference to (.+)/i)
  if (refMatch) {
    promptWords = significantWords(refMatch[1])
  }

  const names = [...prompt.matchAll(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})\b/g)].map((m) =>
    m[1].toLowerCase()
  )

  if (/^[A-H]$/.test(a) && getParagraphText(body, a)) {
    return [...promptWords.slice(0, 5), ...names.slice(0, 2)].filter(Boolean).join('|') || `paragraph ${lower}`
  }

  if (/^(true|false|not given|yes|no)$/i.test(a)) {
    return [...names, ...promptWords.slice(0, 6)].filter(Boolean).join('|') || lower
  }

  if (/^[A-J]$/.test(a) && prompt.includes('?')) {
    return [...promptWords.slice(0, 4), ...names.slice(0, 2)].filter(Boolean).join('|') || lower
  }

  return [lower, ...names, ...promptWords.slice(0, 4)].filter(Boolean).join('|')
}

const clip = (s, n = 90) => {
  const t = String(s || '').trim()
  return t.length > n ? `${t.slice(0, n)}…` : t
}

export const clipQuote = (sentence, prompt, maxLen = 240) => {
  const s = String(sentence || '').trim()
  if (s.length <= maxLen) return s
  const pw = expandPromptWords(significantWords(prompt, 4))
  const lower = s.toLowerCase()
  for (const w of pw.sort((a, b) => b.length - a.length)) {
    const idx = lower.indexOf(w)
    if (idx >= 0) {
      const start = Math.max(0, idx - 50)
      return s.slice(start, start + maxLen).trim()
    }
  }
  return s.slice(0, maxLen).trim()
}

export const buildThai = (answer, prompt, exact) => {
  const a = String(answer).trim().toUpperCase()
  const snippet = clip(exact, 85)

  if (a === 'TRUE') {
    return `บทความระบุว่า "${snippet}" ซึ่งสอดคล้องกับข้อความในข้อ จึงตอบ TRUE`
  }
  if (a === 'FALSE') {
    return `บทความระบุว่า "${snippet}" ซึ่งขัดกับข้อความในข้อ จึงตอบ FALSE`
  }
  if (a === 'NOT GIVEN') {
    return `บทความไม่ได้ให้ข้อมูลเพียงพอเกี่ยวกับประเด็นในข้อ (อ้างอิง: "${snippet}") จึงตอบ NOT GIVEN`
  }
  if (a === 'YES') {
    return `มุมมองของผู้เขียนสอดคล้องกับข้อนี้ โดยอ้างอิงจาก "${snippet}" จึงตอบ YES`
  }
  if (a === 'NO') {
    return `มุมมองของผู้เขียนขัดแย้งกับข้อนี้ โดยอ้างอิงจาก "${snippet}" จึงตอบ NO`
  }
  if (/^[A-H]$/.test(a)) {
    return `เนื้อหาในย่อหน้า ${a} ตรงกับหัวข้อในข้อมากที่สุด (เช่น "${snippet}") จึงตอบ ${a}`
  }
  if (/^[A-J]$/.test(a) && prompt.includes('?')) {
    return `จากข้อความ "${snippet}" ตัวเลือก ${a} ตรงกับคำถามมากที่สุด จึงตอบ ${a}`
  }

  const gap = prompt.replace(/…+/g, '…').trim()
  return `บทความใช้คำว่า "${answer}" ตรงกับช่องว่างในข้อ (${gap}) โดยอ้างอิงจาก "${snippet}"`
}

export const buildPara = (prompt, answer, exact) => {
  const refMatch = prompt.match(/reference to (.+)/i)
  const promptKey = refMatch
    ? significantWords(refMatch[1], 4).slice(0, 3).join(' ')
    : significantWords(prompt, 5).slice(0, 3).join(' ')
  const exactKey = significantWords(exact, 5)
    .filter((w) => w !== String(answer).toLowerCase())
    .slice(0, 3)
    .join(' ')
  if (promptKey && exactKey) return `${promptKey} = ${exactKey} = ${answer}`
  return `${clip(prompt, 45)} → ${clip(exact, 55)} = ${answer}`
}

export const buildAutoEnrichment = ({ body, prompt, answer, hintOverride }) => {
  const exactHints = hintOverride || buildHints(prompt, answer, body)
  const exact = findQuote(body, exactHints, answer, prompt)
  return {
    exactHints,
    exact,
    thai: buildThai(answer, prompt, exact),
    para: buildPara(prompt, answer, exact)
  }
}

export const mergeEnrichment = (auto, hand) => {
  if (!hand) return auto
  return {
    exactHints: hand.exactHints || auto.exactHints,
    exact: hand.exact || auto.exact,
    thai: hand.thai || auto.thai,
    para: hand.para || auto.para
  }
}
