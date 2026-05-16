/**
 * Comprehensive Thai explanations and evidence quotes for Cambridge IELTS 17 Reading.
 */
import {
  buildHints,
  clipQuote,
  findQuote,
  getParagraphText,
  passageBodyForQuotes,
  significantWords
} from './cambridge-19-enrichment-builder.mjs'

const clip = (s, n = 110) => {
  const t = String(s || '').trim()
  return t.length > n ? `${t.slice(0, n)}…` : t
}

const promptForExplanation = (prompt) =>
  clip(
    String(prompt || '')
      .replace(/…+/g, ' … ')
      .replace(/\s+/g, ' ')
      .trim(),
    130
  )

/** Section text when passages use inline "A Title…" or "A\\n\\nTitle". */
export const getSectionText = (body, letter) => {
  const upper = String(letter).toUpperCase()
  let para = getParagraphText(body, letter)
  if (para && para.length > 60) return para

  const flat = passageBodyForQuotes(body)
  const inline = new RegExp(
    `(?:^|[\\n\\s])${upper}\\s+([A-Z"'(][\\s\\S]*?)(?=\\s+[A-H]\\s+[A-Z"'(]|$)`,
    'm'
  )
  const match = flat.match(inline)
  return match ? match[1].trim() : para
}

const rankSentences = (sentences, prompt, answer) => {
  const pw = significantWords(prompt, 4)
  const a = String(answer).toLowerCase()
  const neg = ['not', 'never', 'no ', 'without', 'instead', 'however', 'but', 'rejected', 'denied', 'unlikely']

  return sentences
    .map((s) => {
      const q = s.toLowerCase()
      let score = pw.filter((w) => q.includes(w)).length * 3
      const negCount = neg.filter((w) => q.includes(w)).length
      if (a === 'false' || a === 'no') {
        if (negCount) score += negCount * 6
        else score -= 10
      }
      if (a === 'true' || a === 'yes') {
        score += pw.filter((w) => q.includes(w)).length * 2
        score -= negCount * 4
      }
      if (a === 'not given') score -= negCount
      if (a.length > 2 && !/^(true|false|yes|no|not given)$/.test(a) && q.includes(a)) score += 8
      return { s, score }
    })
    .sort((x, y) => y.score - x.score)
}

const splitSentences = (body) =>
  passageBodyForQuotes(body)
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.replace(/^[A-H]\s+/, '').trim())
    .filter((s) => s.length > 35)

const findContradictionQuote = (sentences, prompt, answer) => {
  const p = String(prompt || '').toLowerCase()
  const a = String(answer || '').toLowerCase()

  if (a === 'false' || a === 'no') {
    if (/\bbefore\b/.test(p) && /(first|earliest|only|never|not until)/.test(p) === false) {
      const first = sentences.find((s) =>
        /\b(first|world's first|earliest|only)\b/i.test(s)
      )
      if (first) return first
    }
    if (/\b(all|every|always)\b/.test(p)) {
      const limit = sentences.find((s) => /\b(some|many|most|not all|only)\b/i.test(s))
      if (limit) return limit
    }
    if (/\b(success|profit|popular)\b/.test(p)) {
      const neg = sentences.find((s) =>
        /\b(not|no|did not|without|failed|loss|unpopular|never)\b/i.test(s)
      )
      if (neg) return neg
    }
  }

  if (a === 'true' || a === 'yes') {
    if (/\b(not|never|without|fail)\b/.test(p)) {
      const pos = sentences.find((s) => !/\b(not|never|without|fail)\b/i.test(s))
      if (pos) return pos
    }
  }

  return null
}

export const findQuoteC17 = (body, hints, answer, prompt = '') => {
  const a = String(answer || '').trim().toUpperCase()
  const sentences = splitSentences(body)

  if (/^(TRUE|FALSE|NOT GIVEN|YES|NO)$/i.test(a) && prompt) {
    const contradiction = findContradictionQuote(sentences, prompt, answer)
    if (contradiction) return clipQuote(contradiction, prompt, 260)
    const ranked = rankSentences(sentences, prompt, answer)
    if (ranked[0]?.score > 2) return clipQuote(ranked[0].s, prompt, 260)
  }

  if (/^[A-H]$/.test(a)) {
    const section = getSectionText(body, a)
    if (section) {
      const sentences = section
        .replace(/\n+/g, ' ')
        .split(/(?<=[.!?])\s+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 35)
      const ranked = rankSentences(sentences, prompt, 'true')
      if (ranked[0]?.score > 0) return clipQuote(ranked[0].s, prompt, 260)
      if (sentences[0]) return clipQuote(sentences[0], prompt, 260)
    }
  }

  if (/^(TRUE|FALSE|NOT GIVEN|YES|NO)$/i.test(a) && prompt) {
    const ranked = rankSentences(splitSentences(body), prompt, answer)
    if (ranked[0]?.score > 2) return clipQuote(ranked[0].s, prompt, 260)
  }

  return findQuote(body, hints, answer, prompt)
}

export const buildParaComprehensive = (prompt, answer, exact) => {
  const refMatch = prompt.match(/(?:reference to|examples of|description of|an? )\s*(.+)/i)
  const promptPart = refMatch
    ? significantWords(refMatch[1], 4).slice(0, 3).join(' ')
    : significantWords(prompt, 5).slice(0, 3).join(' ')
  const exactPart = significantWords(exact, 6)
    .filter((w) => w !== String(answer).toLowerCase())
    .slice(0, 4)
    .join(' ')
  if (promptPart && exactPart) return `${promptPart} = ${exactPart} = ${answer}`
  return `${clip(prompt, 50)} = ${clip(exact, 60)} = ${answer}`
}

export const buildThaiComprehensive = (answer, prompt, exact) => {
  const a = String(answer || '').trim().toUpperCase()
  const snippet = clip(exact, 95)
  const q = promptForExplanation(prompt)

  if (a === 'TRUE') {
    return `ข้อความในข้อว่า "${q}" ตรงกับข้อมูลในบทความ เพราะบทความระบุว่า "${snippet}" ซึ่งยืนยันสิ่งที่ข้อกล่าวถึงได้ชัดเจน จึงตอบ TRUE`
  }
  if (a === 'FALSE') {
    return `ข้อความในข้อว่า "${q}" ไม่ตรงกับบทความ เพราะบทความระบุว่า "${snippet}" ซึ่งขัดกับสิ่งที่ข้ออ้าง (หรือให้ข้อมูลตรงข้าม) จึงตอบ FALSE`
  }
  if (a === 'NOT GIVEN') {
    return `ข้อความในข้อว่า "${q}" บทความไม่ได้ให้รายละเอียดเพียงพอที่จะยืนยันหรือปฏิเสธข้อนี้โดยตรง (อ้างอิงใกล้เคียง: "${snippet}") จึงตอบ NOT GIVEN`
  }
  if (a === 'YES') {
    return `มุมมองของผู้เขียนในบทความสนับสนุนข้อที่ว่า "${q}" โดยเฉพาะจากข้อความ "${snippet}" จึงตอบ YES`
  }
  if (a === 'NO') {
    return `มุมมองของผู้เขียนในบทความขัดกับข้อที่ว่า "${q}" โดยเฉพาะจากข้อความ "${snippet}" จึงตอบ NO`
  }
  if (/^[A-H]$/.test(a)) {
    const topic = q.replace(/^reading passage \d+.*$/i, '').trim() || q
    return `ย่อหน้า ${a} มีเนื้อหาที่ตรงกับหัวข้อในข้อมากที่สุด (${topic}) โดยเฉพาะประโยค "${snippet}" จึงเลือก ${a}`
  }
  if (/^[A-J]$/.test(a)) {
    if (/complete the summary/i.test(prompt) || /list of phrases/i.test(prompt)) {
      return `จากสรุปในข้อ "${q}" ความหมายในบทความตรงกับวลี ${a} ที่สื่อว่า "${snippet}" จึงเติม ${a}`
    }
    if (prompt.includes('?')) {
      return `คำถาม: "${q}" หลักฐานในบทความคือ "${snippet}" ซึ่งสนับสนุนตัวเลือก ${a} มากที่สุด จึงตอบ ${a}`
    }
    return `ข้อความในบทความ "${snippet}" ตรงกับวลี ${a} ในรายการมากที่สุด จึงตอบ ${a}`
  }
  if (/^[A-E]$/.test(a) && /which two/i.test(prompt)) {
    return `คำถามถามว่า "${q}" ตัวเลือก ${a} มีหลักฐานในบทความ (เช่น "${snippet}") จึงเลือก ${a} เป็นหนึ่งในสองคำตอบ`
  }

  if (/…/.test(prompt) || /\d+\s*…/.test(prompt)) {
    return `ในข้อให้เติมคำในช่องว่าง: "${q}" บทความมีถ้อยคำที่ตรงกันคือ "${snippet}" จึงคำตอบคือ "${answer}" (paraphrase จากข้อความใน passage)`
  }

  return `ในข้อ: "${q}" หลักฐานในบทความคือ "${snippet}" จึงตอบ ${answer}`
}

export const buildComprehensiveEnrichment = ({ body, prompt, answer, hand = {} }) => {
  const exactHints = hand.exactHints || buildHints(prompt, answer, body)
  const exact = hand.exact || findQuoteC17(body, exactHints, answer, prompt)
  const thai = hand.thai || buildThaiComprehensive(answer, prompt, exact)
  const para = hand.para || buildParaComprehensive(prompt, answer, exact)
  return { exactHints, exact, thai, para }
}
