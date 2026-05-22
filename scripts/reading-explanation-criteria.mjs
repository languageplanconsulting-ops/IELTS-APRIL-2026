/** Shared criteria for Cambridge reading Thai explanations (Full Reading + bank). */

export const isWeakReadingExplanation = (question) => {
  const text = String(question.explanationThai || '').trim()
  const prompt = String(question.prompt || '').trim()
  const para = String(question.paraphrasedVocabulary || '').trim()
  const exact = String(question.exactPortion || '').trim()

  if (!text) return 'empty explanation'
  if (/^คำตอบ "[^"]+" มาจากหลักฐานในบทความ:/.test(text)) return 'bare quote dump without paraphrase bridge'
  if (/^ข้อความในบทความ(สนับสนุน|ขัดแย้ง)กับข้อนี้ จึงตอบ (TRUE|FALSE|YES|NO)$/i.test(text)) {
    return 'generic judgement explanation without passage quote'
  }
  if (/^บทความไม่ได้ให้ข้อมูลเพียงพอที่จะยืนยันหรือปฏิเสธข้อนี้ จึงตอบ NOT GIVEN$/i.test(text)) {
    return 'generic NOT GIVEN without passage reference'
  }
  if (!/["“”']/.test(text) && !/ย่อหน้า [A-H]/i.test(text) && question.answerType !== 'text') {
    return 'missing quoted evidence in explanation'
  }
  if (/question-number|ielts-reading/i.test(prompt)) return 'broken prompt with HTML artifact'
  if (/question-number|ielts-reading/i.test(para)) return 'broken paraphrase with HTML artifact'
  if (!para || para.length < 8) return 'missing or too-short paraphrase vocabulary'
  if (/^Question\s+\d+$/i.test(prompt)) {
    if (
      /โดยอ้างอิงจาก|บทความใช้คำว่า|บทความระบุว่า|บทความไม่ได้ให้ข้อมูล|เนื้อหาในย่อหน้า|มุมมองของผู้เขียน/.test(text) &&
      exact.length >= 12 &&
      !/question-number|ielts-reading/i.test(para)
    ) {
      return ''
    }
    return 'generic Question X prompt'
  }
  if (!exact || exact.length < 12) {
    if (/^[ivx]+$/i.test(String(question.correctAnswer || '')) && exact.length >= 2) return ''
    return 'missing or too-short exact portion'
  }

  return ''
}

export const isStrongReadingExplanation = (question) => !isWeakReadingExplanation(question)
