/** How the question wording relates to the audioscript (Listening teaching). */
export type ListeningParaphraseMethod = 'synonym' | 'structure' | 'both' | 'same-words'

export type ListeningParaphraseTeaching = {
  passageKeyword: string
  questionKeyword: string
  thaiMeaning: string
  method: ListeningParaphraseMethod
  methodLabelTh: string
  explanationThai: string
}

const normalize = (value: string) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const tokenSet = (value: string) => new Set(normalize(value).split(' ').filter((token) => token.length > 2))

const overlapRatio = (a: string, b: string) => {
  const left = tokenSet(a)
  const right = tokenSet(b)
  if (!left.size || !right.size) return 0
  let hit = 0
  for (const token of left) {
    if (right.has(token)) hit += 1
  }
  return hit / Math.max(left.size, right.size)
}

export const listeningParaphraseMethodLabelTh = (method: ListeningParaphraseMethod): string => {
  switch (method) {
    case 'synonym':
      return 'ใช้คำพ้องความหมาย (synonym)'
    case 'structure':
      return 'เปลี่ยนโครงสร้าง / ขยายความ'
    case 'both':
      return 'ใช้ทั้งคำพ้องและเปลี่ยนโครงสร้าง'
    case 'same-words':
      return 'ใช้คำเดียวกับใน audio (จับคำตรง)'
  }
}

export const inferListeningParaphraseMethod = (input: {
  passageKeyword: string
  questionKeyword: string
  explanationThai?: string
}): ListeningParaphraseMethod => {
  const passage = String(input.passageKeyword || '').trim()
  const question = String(input.questionKeyword || '').trim()
  const explanation = String(input.explanationThai || '')
  const lower = explanation.toLowerCase()

  if (
    /เปลี่ยนโครงสร้าง|ขยายความ|before,\s*during|rephrase|โครงสร้างประโยค|อธิบายด้วย|สรุปว่า/.test(
      explanation
    ) ||
    /structure|rephras|paraphras(e|ing) by chang/.test(lower)
  ) {
    if (/คำพ้อง|synonym|ตรงกับ|ถูกพูดว่า|ถูกแทนด้วย/.test(explanation) || /synonym/.test(lower)) {
      return 'both'
    }
    return 'structure'
  }

  if (/คำพ้อง|synonym|ตรงกับคำว่า|ถูกพูดใน audio ว่า|ถูกแทนด้วย/.test(explanation) || /synonym/.test(lower)) {
    return 'synonym'
  }

  if (!passage || !question) return 'same-words'

  const passageNorm = normalize(passage)
  const questionNorm = normalize(question)
  if (passageNorm && questionNorm && (passageNorm === questionNorm || passageNorm.includes(questionNorm) || questionNorm.includes(passageNorm))) {
    return 'same-words'
  }

  const overlap = overlapRatio(passage, question)
  const lengthRatio =
    Math.max(passage.length, question.length) / Math.max(1, Math.min(passage.length, question.length))

  if (overlap >= 0.55) return 'same-words'
  if (lengthRatio >= 1.8 || passage.split(/\s+/).length >= question.split(/\s+/).length + 3) {
    return 'structure'
  }
  if (overlap <= 0.25) return 'synonym'
  return 'both'
}

export const buildListeningParaphraseTeaching = (input: {
  passageKeyword?: string
  questionKeyword?: string
  thaiMeaning?: string
  explanationThai?: string
  evidence?: string
  correctAnswer?: string
  stem?: string
}): ListeningParaphraseTeaching => {
  const passageKeyword = String(
    input.passageKeyword || input.evidence || input.correctAnswer || ''
  ).trim()
  const questionKeyword = String(
    input.questionKeyword || input.stem || input.correctAnswer || ''
  ).trim()
  const thaiMeaning = String(input.thaiMeaning || '').trim() || '—'
  const baseExplanation = String(input.explanationThai || '').trim()
  const method = inferListeningParaphraseMethod({
    passageKeyword,
    questionKeyword,
    explanationThai: baseExplanation
  })
  const methodLabelTh = listeningParaphraseMethodLabelTh(method)

  const explanationThai =
    baseExplanation ||
    (method === 'same-words'
      ? `โจทย์ใช้คำใกล้เคียงกับใน audio โดยตรง — ฟังแล้วจับคำ "${passageKeyword || questionKeyword}" ได้เลย`
      : method === 'synonym'
        ? `โจทย์ใช้คำพ้องความหมาย: ใน audio พูดว่า "${passageKeyword}" แต่ในคำถามใช้ "${questionKeyword}" ความหมายเดียวกัน (${thaiMeaning})`
        : method === 'structure'
          ? `โจทย์เปลี่ยนโครงสร้าง/ขยายความจาก audio: "${passageKeyword}" ↔ "${questionKeyword}" (${thaiMeaning})`
          : `โจทย์ paraphrase ทั้งด้วยคำพ้องและโครงสร้าง: "${passageKeyword}" ↔ "${questionKeyword}" (${thaiMeaning})`)

  return {
    passageKeyword: passageKeyword || '—',
    questionKeyword: questionKeyword || '—',
    thaiMeaning,
    method,
    methodLabelTh,
    explanationThai
  }
}
