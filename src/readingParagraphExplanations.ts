// "งงกับย่อหน้านี้ อยากให้พี่ดอยช่วยอธิบาย" — a per-paragraph Thai explanation
// students can open on demand. Unlike the word-level vocab popover, this
// covers the WHOLE paragraph: every clause explained (nothing skipped), in
// simple language, with a short vocab gloss for the harder words/phrases —
// glosses are contextual (what the word means HERE), not a dictionary entry.
//
// Keyed by normalized passage title (see normalizeReadingPassageTitle) +
// 0-based paragraph index, since paragraph order is stable per passage.
import { normalizeReadingPassageTitle } from './readingPassageVocab'
import { READING_PARAGRAPH_EXPLANATIONS_CAMBRIDGE_11 } from './readingParagraphExplanations.cambridge11'
import { READING_PARAGRAPH_EXPLANATIONS_CAMBRIDGE_12 } from './readingParagraphExplanations.cambridge12'
import { READING_PARAGRAPH_EXPLANATIONS_CAMBRIDGE_13 } from './readingParagraphExplanations.cambridge13'
import { READING_PARAGRAPH_EXPLANATIONS_CAMBRIDGE_14 } from './readingParagraphExplanations.cambridge14'
import { READING_PARAGRAPH_EXPLANATIONS_CAMBRIDGE_15 } from './readingParagraphExplanations.cambridge15'
import { READING_PARAGRAPH_EXPLANATIONS_CAMBRIDGE_16 } from './readingParagraphExplanations.cambridge16'
import { READING_PARAGRAPH_EXPLANATIONS_CAMBRIDGE_17 } from './readingParagraphExplanations.cambridge17'
import { READING_PARAGRAPH_EXPLANATIONS_CAMBRIDGE_19 } from './readingParagraphExplanations.cambridge19'
import { READING_PARAGRAPH_EXPLANATIONS_GT_2 } from './readingParagraphExplanations.gt2'
import { READING_PARAGRAPH_EXPLANATIONS_JUNE2026_CUSTOM } from './readingParagraphExplanations.june2026custom'

export type ReadingParagraphVocabGloss = {
  /** The English word or phrase as it appears in the paragraph. */
  term: string
  /** Contextual Thai meaning — what it means in THIS sentence, not a bare dictionary gloss. */
  th: string
}

export type ReadingParagraphExplanation = {
  /** Full Thai walkthrough of the paragraph — every clause, nothing skipped, simple language. */
  explanationTh: string
  /** Harder words/phrases from this paragraph, each with a contextual Thai meaning. */
  vocab?: ReadingParagraphVocabGloss[]
}

type ParagraphExplanationBank = Record<string, Record<number, ReadingParagraphExplanation>>

const READING_PARAGRAPH_EXPLANATIONS: ParagraphExplanationBank = {
  "this marvellous invention": {
    // Paragraph C — "Language often seems so skillfully drafted…"
    2: {
      explanationTh:
        'ย่อหน้านี้บอกว่าภาษาดูเหมือนจะถูกออกแบบมาอย่างชาญฉลาดมาก (skillfully drafted) จนเราแทบนึกภาพไม่ออกว่ามันจะเป็นอะไรได้นอกจาก "งานฝีมือของช่างผู้เชี่ยวชาญ" (the perfected handiwork of a master craftsman) — พูดง่ายๆ คือคนเรามักรู้สึกว่าภาษา "เพอร์เฟกต์" เกินกว่าจะบังเอิญเกิดขึ้นเอง\n\nจากนั้นผู้เขียนถามคำถามเชิงแปลกใจว่า: เครื่องมือ (instrument) ชิ้นนี้จะสร้างอะไรได้มากมายขนาดนี้ ทั้งที่มีวัตถุดิบแค่ "เศษเสียงเล็กๆ ไม่ถึงสามโหล" (barely three dozen measly morsels of sound) ได้อย่างไร — "สามโหล" ในที่นี้คือจำนวนเสียงพยัญชนะ/สระทั้งหมดที่ภาษาใช้ (ประมาณ 36 เสียง)\n\nต่อมาผู้เขียนอธิบายว่า ถ้าดูเสียงเหล่านี้ทีละตัว (เช่น p, f, b, v, t, d, k, g, sh, a, e ที่ยกมาเป็นตัวอย่าง) มันก็เป็นแค่ "เสียงสะบัดปาก/เสียงพ่นลมมั่วๆ" (haphazard spits and splutters) ที่ไม่มีความหมายอะไรเลย พูดอะไรไม่ได้ อธิบายอะไรไม่ได้ (no ability to express, no power to explain) — คือถ้าแยกเป็นเสียงเดี่ยวๆ มันไร้ค่าโดยสิ้นเชิง\n\nแต่ (But — คำเชื่อมสำคัญของย่อหน้านี้ที่พลิกความคิด) พอเอาเสียงพวกนี้ไป "ผ่านเฟืองและล้อของเครื่องจักรภาษา" (run them through the cogs and wheels of the language machine) คือเอาไปจัดเรียงในลำดับพิเศษเฉพาะ (arrange them in some very special orders) ผลลัพธ์ที่ได้กลับไม่มีขีดจำกัดเลย — ตั้งแต่การพูดถึงความเบื่อหน่ายอันไม่รู้จบของชีวิต (sighing the interminable boredom of existence) ไปจนถึงการไขความลับระเบียบพื้นฐานของจักรวาล (unravelling the fundamental order of the universe) ซึ่งเป็นการเปรียบเทียบสุดขั้ว (จากเรื่องเล็กที่สุดถึงเรื่องใหญ่ที่สุด) เพื่อโชว์ว่าเสียงไร้ความหมายพวกนี้ทำอะไรได้ "ทุกอย่าง" เมื่อถูกจัดระบบ\n\nสรุปใจความ: ย่อหน้านี้ต้องการชี้ว่า ภาษาดูเพอร์เฟกต์จนเราคิดว่ามันถูก "ออกแบบ" มา แต่จริงๆ แล้วมันเกิดจากเสียงแยกๆ ที่ไร้ความหมายเพียงไม่กี่สิบเสียง ที่พอนำมาจัดเรียงอย่างเป็นระบบก็กลายเป็นเครื่องมือสื่อสารที่ทรงพลังไร้ขีดจำกัด — นี่คือความน่าทึ่ง (และปริศนา) ของภาษาที่ทั้งบทความกำลังพูดถึง',
      vocab: [
        { term: 'skillfully drafted', th: 'ถูกร่าง/ออกแบบมาอย่างชำนาญ — ในที่นี้หมายถึง "ดูดีจนเหมือนมีคนตั้งใจออกแบบ"' },
        { term: 'the perfected handiwork of a master craftsman', th: 'ผลงานชิ้นเอกของช่างฝีมือ — ใช้เปรียบภาษาว่าเนี้ยบราวกับถูกสร้างโดยผู้เชี่ยวชาญ' },
        { term: 'barely three dozen measly morsels of sound', th: 'เสียงเล็กๆ ไม่ถึง 36 เสียง — เน้นว่า "วัตถุดิบ" ของภาษามีน้อยนิดมาก' },
        { term: 'haphazard spits and splutters', th: 'เสียงพ่น/สะบัดแบบสุ่มไร้ระเบียบ — บรรยายว่าเสียงเดี่ยวๆ ฟังดูไม่มีความหมาย' },
        { term: 'the cogs and wheels of the language machine', th: 'กลไก/ฟันเฟืองของ "เครื่องจักรภาษา" — คำเปรียบเทียบ ไม่ใช่เครื่องจักรจริง หมายถึงระบบไวยากรณ์ที่จัดเรียงเสียงให้มีความหมาย' },
        { term: 'the interminable boredom of existence', th: 'ความเบื่อหน่ายที่ไม่มีวันจบของการมีชีวิตอยู่ — ตัวอย่างเรื่อง "เล็กๆ" ที่ภาษาพูดถึงได้' },
        { term: 'unravelling the fundamental order of the universe', th: 'การคลี่คลาย/อธิบายกฎพื้นฐานของจักรวาล — ตัวอย่างเรื่อง "ใหญ่ๆ" ที่ภาษาพูดถึงได้เช่นกัน' }
      ]
    }
  }
}

// Per-book banks generated separately (one book = one file, so parallel
// generation runs never conflict on the same file). Merged here; each book
// only contributes distinct passage-title keys, so a shallow merge is safe.
const READING_PARAGRAPH_EXPLANATION_BANKS: ParagraphExplanationBank[] = [
  READING_PARAGRAPH_EXPLANATIONS,
  READING_PARAGRAPH_EXPLANATIONS_CAMBRIDGE_11,
  READING_PARAGRAPH_EXPLANATIONS_CAMBRIDGE_12,
  READING_PARAGRAPH_EXPLANATIONS_CAMBRIDGE_13,
  READING_PARAGRAPH_EXPLANATIONS_CAMBRIDGE_14,
  READING_PARAGRAPH_EXPLANATIONS_CAMBRIDGE_15,
  READING_PARAGRAPH_EXPLANATIONS_CAMBRIDGE_16,
  READING_PARAGRAPH_EXPLANATIONS_CAMBRIDGE_17,
  READING_PARAGRAPH_EXPLANATIONS_CAMBRIDGE_19,
  READING_PARAGRAPH_EXPLANATIONS_GT_2,
  READING_PARAGRAPH_EXPLANATIONS_JUNE2026_CUSTOM
]

/** Some banks (e.g. General Training "full test" exams) reuse the same
 *  generic passage title — "Passage 1" / "Passage 2" — across many different
 *  exams, so a title-only key would collide across unrelated passages. For
 *  those, key by `${examId}#p${passageNumber}` instead. Title-based lookup
 *  stays as the primary/fallback path for banks with genuinely distinct
 *  titles (Cambridge, Custom, June 2026). */
export const buildReadingParagraphExamKey = (examId: string, passageNumber: number) =>
  `${String(examId || '').trim()}#p${passageNumber}`

export const getReadingParagraphExplanation = (
  passageTitle: string,
  paragraphIndex: number,
  examKey?: string
): ReadingParagraphExplanation | null => {
  const titleKey = normalizeReadingPassageTitle(passageTitle)
  for (const bank of READING_PARAGRAPH_EXPLANATION_BANKS) {
    if (examKey) {
      const foundByExam = bank[examKey]?.[paragraphIndex]
      if (foundByExam) return foundByExam
    }
    if (titleKey) {
      const foundByTitle = bank[titleKey]?.[paragraphIndex]
      if (foundByTitle) return foundByTitle
    }
  }
  return null
}
