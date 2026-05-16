/** Parse numbered prompts from Cambridge 17 question section text. */

const INSTRUCTION_LINE =
  /^(?:Questions?\s+\d|Reading Passage\s+\d|Complete the |Choose |Write your |Write the |In boxes |Do the following|Look at the following|Match each|Which section|Which paragraph|Which TWO|When comparing|List of |NB |TRUE if|FALSE if|YES if|NO if|NOT GIVEN if|One advantage|As one of)/i

export const parseNumberedPrompts = (qText, start, end) => {
  const prompts = new Map()
  const lines = String(qText || '').replace(/\r/g, '').split('\n')
  let current = ''
  let currentNum = null

  const flush = () => {
    if (currentNum !== null && current.trim()) {
      prompts.set(currentNum, current.trim().replace(/\s+/g, ' '))
    }
    current = ''
    currentNum = null
  }

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    let m = trimmed.match(/^(\d{1,2})\.\s*(.*)$/)
    if (!m) m = trimmed.match(/^(\d{1,2})\s+([A-Za-z"'|(|].*)$/)

    if (m) {
      const num = Number(m[1])
      if (num >= start && num <= end) {
        flush()
        currentNum = num
        current = m[2] || ''
      } else {
        flush()
      }
      continue
    }

    if (currentNum !== null) {
      if (INSTRUCTION_LINE.test(trimmed)) {
        flush()
        continue
      }
      if (/^[A-D]\s/.test(trimmed) && current.length > 15) {
        flush()
        continue
      }
      if (/^[A-J]\s/.test(trimmed) && trimmed.length < 60 && current.length > 15) {
        flush()
        continue
      }
      current += ` ${trimmed}`
    }
  }
  flush()
  return prompts
}

/** MC stems that appear without question numbers (e.g. t1p3 Q36-40). */
export const parseMcStems = (qText, start, end) => {
  const prompts = new Map()
  const sectionMatch = qText.match(
    new RegExp(`Questions\\s+${start}\\s*[-–]\\s*${end}[\\s\\S]*?(?=\\nQuestions\\s+\\d|$)`, 'i')
  )
  if (!sectionMatch) return prompts

  const section = sectionMatch[0]
  const stems = [
    ...section.matchAll(
      /(?:^|\n\n)([A-Z][^\n]*\?)\s*\n+(?:[A-D]\s[^\n]+\n+){2,}/g
    )
  ]

  let n = start
  for (const match of stems) {
    const stem = match[1].replace(/\s+/g, ' ').trim()
    if (stem.length > 20 && n <= end) {
      prompts.set(n, stem)
      n += 1
    }
  }
  return prompts
}

/** Fill-in-the-blank lines from notes (• The 1 …). */
export const parseFillPrompts = (qText, start, end) => {
  const prompts = new Map()
  const lines = String(qText || '').split('\n')
  for (const line of lines) {
    const m = line.match(/[•●°e]\s*.+?\b(\d{1,2})\s*(?:[\.…]{2,}|\.{2,})/i)
    if (!m) continue
    const num = Number(m[1])
    if (num < start || num > end) continue
    const prompt = line
      .replace(/^[•●°e]\s*/, '')
      .replace(/\s*\d{1,2}\s*[\.…]{2,}.*$/, ' …')
      .replace(/\s+/g, ' ')
      .trim()
    if (prompt.length > 8) prompts.set(num, prompt)
  }
  return prompts
}

/** Summary / phrase-list gaps (then formed a 27 …). */
export const parseSummaryGapPrompts = (qText, start, end) => {
  const prompts = new Map()
  const text = String(qText || '').replace(/\s+/g, ' ')
  for (let n = start; n <= end; n += 1) {
    const m = text.match(new RegExp(`\\b${n}\\s*(?:[\\.…]{2,}|\\.{2,}|\\s+…)[^.]{0,120}`, 'i'))
    if (m) {
      const snippet = m[0].replace(/\s+/g, ' ').trim()
      prompts.set(n, `Complete the summary — ${snippet}`)
    }
  }
  return prompts
}

export const buildPromptMap = (qText, start, end) => {
  const map = new Map()
  for (const [k, v] of parseFillPrompts(qText, start, end)) map.set(k, v)
  for (const [k, v] of parseSummaryGapPrompts(qText, start, end)) {
    if (!map.has(k)) map.set(k, v)
  }
  for (const [k, v] of parseNumberedPrompts(qText, start, end)) map.set(k, v)
  for (const [k, v] of parseMcStems(qText, start, end)) {
    if (!map.has(k)) map.set(k, v)
  }
  return map
}

export const questionRangeForKey = (key) => {
  const rows = {
    t1p1: [1, 13],
    t1p2: [14, 26],
    t1p3: [27, 40],
    t2p1: [1, 13],
    t2p2: [14, 26],
    t2p3: [27, 40],
    t3p1: [1, 13],
    t3p2: [14, 26],
    t3p3: [27, 40],
    t4p1: [1, 13],
    t4p2: [14, 26],
    t4p3: [27, 40]
  }
  return rows[key] || [1, 13]
}
