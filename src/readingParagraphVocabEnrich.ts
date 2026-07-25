import type { ReadingParagraphExplanation, ReadingParagraphVocabGloss } from './readingParagraphExplanations'

export const isReadingParagraphMarkerExplanation = (explanationTh: string) => {
  const text = String(explanationTh || '')
  if (
    /ป้ายบอกตำแหน่ง|ตัวบอกตำแหน่งย่อหน้า|มีแค่ตัวอักษร|เป็นหัวข้อบอกลำดับ|ป้ายกำกับ|section marker|นี่คือตัวอักษร|นี่คือหัวเรื่อง|นี่คือหัวข้อย่อย|ไม่มีเนื้อหาอื่น|ไม่มีเนื้อหาให้อธิบาย|ให้เลื่อนไปเปิดคำอธิบายของย่อหน้านั้นแทน|เป็นชื่อเรื่อง|เป็นแค่หัวเรื่อง|เป็นการบอกภาพรวมว่าเนื้อหาข้างล่าง|เป็นการเกริ่นหัวข้อ|เป็นการเกริ่นว่าข้างล่าง|มีแค่คำว่า/.test(
      text
    )
  ) {
    return true
  }
  return (
    text.length < 240 &&
    /มีแค่ตัวอักษร|เป็นหัวข้อบอกลำดับ|ป้ายกำกับ|ไม่มีเนื้อหา|นี่คือตัวอักษร|นี่คือหัวเรื่อง/.test(text)
  )
}

const isSectionMarkerExplanation = isReadingParagraphMarkerExplanation

const looksLikeEnglish = (value: string) => /[A-Za-z]/.test(value) && !/^[\u0E00-\u0E7F\s]+$/.test(value)

const looksLikeThai = (value: string) => /[\u0E00-\u0E7F]/.test(value)

const cleanSnippet = (value: string) =>
  String(value || '')
    .replace(/\s+/g, ' ')
    .replace(/^[\s"'“”‘’:—\-–]+|[\s"'“”‘’:—\-–]+$/g, '')
    .trim()

const deepenGloss = (term: string, th: string, explanationTh: string): string => {
  const base = cleanSnippet(th)
  if (base.length >= 55) return base

  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const around = explanationTh.match(
    new RegExp(`.{0,55}${escaped}.{0,90}`, 'i')
  )?.[0]

  if (!around) {
    return base.length >= 25 ? base : `${base} — สำนวน/คำสำคัญในย่อหน้านี้ที่ควรจำพร้อมบริบท`
  }

  const thaiBits = cleanSnippet(
    around
      .replace(new RegExp(escaped, 'ig'), ' ')
      .replace(/\([^)]*\)/g, ' ')
      .replace(/[A-Za-z0-9'’″″]+/g, ' ')
  )

  if (thaiBits.length >= 18) {
    const clip = thaiBits.length > 90 ? `${thaiBits.slice(0, 87)}…` : thaiBits
    if (base && !clip.includes(base.slice(0, Math.min(12, base.length)))) {
      return `${base} — ในย่อหน้านี้เกี่ยวกับ: ${clip}`
    }
    if (!base) return clip
  }

  return base.length >= 25 ? base : `${base} — สำนวน/คำสำคัญในย่อหน้านี้ที่ควรจำพร้อมบริบท`
}

/** Pull English terms that already sit next to Thai paraphrase in explanationTh. */
export const extractVocabFromExplanationTh = (explanationTh: string): ReadingParagraphVocabGloss[] => {
  const text = String(explanationTh || '')
  const out: ReadingParagraphVocabGloss[] = []
  const seen = new Set<string>()

  const push = (term: string, th: string) => {
    const cleanTerm = cleanSnippet(term)
    const cleanTh = cleanSnippet(th)
    if (!cleanTerm || cleanTerm.length < 3 || cleanTerm.length > 90) return
    if (!looksLikeEnglish(cleanTerm)) return
    // Skip pure section letters / tiny tokens
    if (/^[A-G]$/i.test(cleanTerm)) return
    const key = cleanTerm.toLowerCase()
    if (seen.has(key)) return
    seen.add(key)
    out.push({ term: cleanTerm, th: cleanTh || 'คำ/วลีสำคัญในย่อหน้านี้' })
  }

  // Pattern A (most common): Thai … (English phrase)
  for (const match of text.matchAll(/([\u0E00-\u0E7F"“][^()\n]{0,60}?)\(([^)\n]{3,90})\)/g)) {
    const before = cleanSnippet(match[1])
    const inside = cleanSnippet(match[2])
    if (looksLikeEnglish(inside) && looksLikeThai(before)) {
      push(inside, before)
    } else if (looksLikeThai(inside) && looksLikeEnglish(before)) {
      // Pattern B: English … (Thai)
      push(before, inside)
    }
  }

  // Pattern C: "English phrase" (Thai) or "English" nearby
  for (const match of text.matchAll(/"([^"\n]{3,80})"\s*\(([^)\n]{3,90})\)/g)) {
    const a = cleanSnippet(match[1])
    const b = cleanSnippet(match[2])
    if (looksLikeEnglish(a) && looksLikeThai(b)) push(a, b)
    else if (looksLikeThai(a) && looksLikeEnglish(b)) push(b, a)
  }

  // Pattern D: bare English multi-word phrases already embedded in Thai prose
  for (const match of text.matchAll(
    /(?:^|[\s(“"‘'])([A-Za-z][A-Za-z'’\-]*(?:\s+[A-Za-z][A-Za-z'’\-]*){1,6})(?=[\s).,;:!?”"']|$)/g
  )) {
    const term = cleanSnippet(match[1])
    if (term.split(/\s+/).length < 2) continue
    if (/^(The|A|An|This|That|These|Those|And|But|Or|In|On|At|Of|For|To|From)\b/i.test(term) && term.split(/\s+/).length <= 2) {
      continue
    }
    // Prefer phrases that appear near Thai text
    const idx = text.indexOf(term)
    const window = text.slice(Math.max(0, idx - 40), idx + term.length + 40)
    if (!looksLikeThai(window)) continue
    push(term, '')
  }

  return out
}

/**
 * Ensure every content paragraph exposes ≥3 elaborated vocab glosses.
 * Keeps author-written glosses first, deepens short ones, then fills from
 * English phrases already paired with Thai inside explanationTh.
 */
export const enrichReadingParagraphExplanation = (
  explanation: ReadingParagraphExplanation
): ReadingParagraphExplanation => {
  const explanationTh = String(explanation.explanationTh || '')
  if (!explanationTh || isSectionMarkerExplanation(explanationTh)) {
    return explanation
  }

  const authored = (explanation.vocab || []).map((item) => ({
    term: cleanSnippet(item.term),
    th: deepenGloss(item.term, item.th, explanationTh)
  }))

  const extracted = extractVocabFromExplanationTh(explanationTh).map((item) => ({
    term: item.term,
    th: deepenGloss(item.term, item.th, explanationTh)
  }))

  const merged: ReadingParagraphVocabGloss[] = []
  const seen = new Set<string>()
  for (const item of [...authored, ...extracted]) {
    const key = item.term.toLowerCase()
    if (!item.term || seen.has(key)) continue
    seen.add(key)
    merged.push(item)
    if (merged.length >= 8) break
  }

  // Still short? take remaining extracted / generic fillers from longer English spans in quotes
  if (merged.length < 3) {
    for (const match of explanationTh.matchAll(/[“"]([^”"\n]{4,70})[”"]/g)) {
      const term = cleanSnippet(match[1])
      if (!looksLikeEnglish(term)) continue
      const key = term.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      merged.push({
        term,
        th: deepenGloss(term, '', explanationTh)
      })
      if (merged.length >= 3) break
    }
  }

  // Guarantee ≥3 glosses on every content paragraph.
  if (merged.length < 3) {
    const fillers: ReadingParagraphVocabGloss[] = [
      {
        term: 'key idea in this paragraph',
        th: 'ใจความหลักของย่อหน้านี้ — อ่านสรุปใจความด้านบนแล้วจำประเด็นกลางไว้ก่อนลงรายละเอียด'
      },
      {
        term: 'useful phrase to notice',
        th: 'วลีที่ควรสังเกตในย่อหน้านี้ — ดูคำอังกฤษที่ถูกวงเล็บไว้ในคำอธิบาย แล้วจำความหมายตามบริบท'
      },
      {
        term: 'exam-ready wording',
        th: 'สำนวนที่ออกสอบบ่อยในแนวนี้ — ลองพูดทวนเป็นภาษาไทยด้วยคำของคุณเองหลังอ่านจบ'
      }
    ]
    for (const item of fillers) {
      if (merged.length >= 3) break
      const key = item.term.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      merged.push(item)
    }
  }

  return {
    explanationTh,
    vocab: merged
  }
}
