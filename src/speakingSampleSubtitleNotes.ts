export type SpeakingSampleSubtitleNoteKind = 'vocabulary' | 'grammar'

export type SpeakingSampleSubtitleNote = {
  id: string
  phrase: string
  detail?: string
  kind?: SpeakingSampleSubtitleNoteKind
  partOfSpeech?: string
  thaiMeaning?: string
  grammarRule?: string
  exampleSentence?: string
}

export type SpeakingSampleSubtitleCue = {
  id: string
  startSeconds: number
  endSeconds: number
  text: string
  notes?: SpeakingSampleSubtitleNote[]
}

export type ParsedSpeakingSampleSubtitleNote = {
  id: string
  phrase: string
  kind: SpeakingSampleSubtitleNoteKind
  headline: string
  body: string
  example?: string
}

const VOCAB_GLOSSARY: Record<string, { partOfSpeech: string; thai: string }> = {
  'generally speaking': { partOfSpeech: 'adv. phr.', thai: 'โดยทั่วไป / โดยรวมแล้ว' },
  'to begin with': { partOfSpeech: 'adv. phr.', thai: 'เริ่มจาก / ก่อนอื่นเลย' },
  'moving on to': { partOfSpeech: 'adv. phr.', thai: 'ต่อไป / มาพูดถึง' },
  'in terms of': { partOfSpeech: 'prep. phr.', thai: 'ในแง่ของ / ในเรื่องของ' },
  'whether it be': { partOfSpeech: 'conj. phr.', thai: 'ไม่ว่าจะเป็น...หรือ...' },
  'natural landscape': { partOfSpeech: 'n. phr.', thai: 'ทิวทัศน์ธรรมชาติ' },
  'traditional ways of living': { partOfSpeech: 'n. phr.', thai: 'วิถีชีวิตแบบดั้งเดิม' },
  'Latin American culture': { partOfSpeech: 'n. phr.', thai: 'วัฒนธรรม Latin America' },
  'get together': { partOfSpeech: 'v. phr.', thai: 'มาเจอกัน / รวมตัวกัน' },
  'rare occasion': { partOfSpeech: 'n. phr.', thai: 'โอกาสที่หาได้ยาก' },
  'far apart': { partOfSpeech: 'adv. phr.', thai: 'อยู่ห่างกัน / แยกกันไกล' },
  'city center': { partOfSpeech: 'n. phr.', thai: 'ใจกลางเมือง / ตัวเมือง' },
  'depending on the traffic': { partOfSpeech: 'adv. phr.', thai: 'ขึ้นอยู่กับสภาพการจราจร' },
  memorable: { partOfSpeech: 'adj.', thai: 'น่าจดจำ / ประทับใจ' },
  enjoyable: { partOfSpeech: 'adj.', thai: 'สนุก / น่าพอใจ' },
  nostalgic: { partOfSpeech: 'adj.', thai: 'คิดถึงอดีต / อิ่มเอม' },
  emotional: { partOfSpeech: 'adj.', thai: 'รู้สึกอารมณ์ / ซาบซึ้ง' },
  optimistic: { partOfSpeech: 'adj.', thai: 'มองโลกในแง่ดี' },
  'avid reader': { partOfSpeech: 'n. phr.', thai: 'คนที่ชอบอ่านหนังสือมาก' },
  subconsciously: { partOfSpeech: 'adv.', thai: 'โดยไม่รู้ตัว / ในระดับจิตใต้สำนึก' },
  fascinating: { partOfSpeech: 'adj.', thai: 'น่าหลงใหล / น่าสนใจมาก' },
  knowledgeable: { partOfSpeech: 'adj.', thai: 'มีความรู้ / รอบรู้' },
  feminine: { partOfSpeech: 'adj.', thai: 'มีความเป็นผู้หญิง / สง่างาม' },
  rewarding: { partOfSpeech: 'adj.', thai: 'คุ้มค่า / ให้ความรู้สึกดี' },
  progress: { partOfSpeech: 'n.', thai: 'ความก้าวหน้า' },
  weightlifting: { partOfSpeech: 'n.', thai: 'ยกน้ำหนัก' },
  reunion: { partOfSpeech: 'n.', thai: 'การรวมตัว / งานเลี้ยงรุ่น' },
  foodie: { partOfSpeech: 'n.', thai: 'คนรักอาหาร / สายกิน' },
  comedic: { partOfSpeech: 'adj.', thai: 'ตลก / สไตล์คอมเมดี' },
  documentary: { partOfSpeech: 'n.', thai: 'สารคดี' },
  curious: { partOfSpeech: 'adj.', thai: 'อยากรู้ / ขี้สงสัย' },
  retired: { partOfSpeech: 'adj.', thai: 'เกษียณแล้ว' },
  graduated: { partOfSpeech: 'v.', thai: 'จบการศึกษา' },
  independent: { partOfSpeech: 'adj.', thai: 'เป็นอิสระ / ไม่พึ่งใคร' },
  exciting: { partOfSpeech: 'adj.', thai: 'ตื่นเต้น / น่าตื่นเต้น' },
  'long weekends': { partOfSpeech: 'n. phr.', thai: 'วันหยุดยาว (เสาร์-อาทิตย์ + วันหยุด)' },
  banal: { partOfSpeech: 'adj.', thai: 'ธรรมดา / ไม่พิเศษ' },
  extraordinary: { partOfSpeech: 'adj.', thai: 'พิเศษ / ไม่ธรรมดา' },
  premise: { partOfSpeech: 'n.', thai: 'แนวคิดหลัก / ข้อสมมติฐาน' },
  neuroscience: { partOfSpeech: 'n.', thai: 'ประสาทวิทยา' },
  psychology: { partOfSpeech: 'n.', thai: 'จิตวิทยา' },
  'physical activities': { partOfSpeech: 'n. phr.', thai: 'กิจกรรมทางกาย' },
  'eye-catching': { partOfSpeech: 'adj.', thai: 'ดึงดูดสายตา / โดดเด่น' },
  'well-maintained': { partOfSpeech: 'adj.', thai: 'ได้รับการดูแลรักษาดี' },
  breathtaking: { partOfSpeech: 'adj.', thai: 'งดงาม / ตระการตา' },
  picturesque: { partOfSpeech: 'adj.', thai: 'สวยงดงามเหมือนภาพวาด' },
  spacious: { partOfSpeech: 'adj.', thai: 'กว้างขวาง / โปร่ง' },
  'open-plan': { partOfSpeech: 'adj.', thai: 'แบบเปิดโล่ง (ไม่มีกำแพงกั้นห้อง)' },
  'state-of-the-art': { partOfSpeech: 'adj.', thai: 'ทันสมัยที่สุด / ล้ำสมัย' },
  'cutting-edge': { partOfSpeech: 'adj.', thai: 'ล้ำสมัย / ทันสมัย' },
  convenient: { partOfSpeech: 'adj.', thai: 'สะดวก' },
  peaceful: { partOfSpeech: 'adj.', thai: 'เงียบสงบ' },
  bustling: { partOfSpeech: 'adj.', thai: 'คึกคัก / พลุกพล่าน' },
  charming: { partOfSpeech: 'adj.', thai: 'มีเสน่ห์ / น่ารัก' },
  impressive: { partOfSpeech: 'adj.', thai: 'น่าประทับใจ' },
  workplace: { partOfSpeech: 'n.', thai: 'ที่ทำงาน' },
  atmosphere: { partOfSpeech: 'n.', thai: 'บรรยากาศ' },
  architecture: { partOfSpeech: 'n.', thai: 'สถาปัตยกรรม' },
  landmark: { partOfSpeech: 'n.', thai: 'สถานที่สำคัญ / แลนด์มาร์ก' },
  'take advantage of': { partOfSpeech: 'v. phr.', thai: 'ใช้ประโยชน์จาก' },
  'look forward to': { partOfSpeech: 'v. phr.', thai: 'ตั้งตารอ / รอคอย' },
  'be fond of': { partOfSpeech: 'v. phr.', thai: 'ชอบ / หลงใหล' },
  'on a regular basis': { partOfSpeech: 'adv. phr.', thai: 'เป็นประจำ / สม่ำเสมอ' },
  'would like to': { partOfSpeech: 'v. phr.', thai: 'อยากจะ / ต้องการ' },
  'majored in': { partOfSpeech: 'v. phr.', thai: 'เรียนเอก (มหาวิทยาลัย)' },
  'graduation ceremony': { partOfSpeech: 'n. phr.', thai: 'พิธีสำเร็จการศึกษา' },
  'love song': { partOfSpeech: 'n. phr.', thai: 'เพลงรัก' },
  'middle school': { partOfSpeech: 'n. phr.', thai: 'มัธยมต้น' },
  'primary school': { partOfSpeech: 'n. phr.', thai: 'ประถมศึกษา' },
  'summer camp': { partOfSpeech: 'n. phr.', thai: 'ค่ายฤดูร้อน' },
  'best friends': { partOfSpeech: 'n. phr.', thai: 'เพื่อนสนิท' },
  'high school': { partOfSpeech: 'n. phr.', thai: 'มัธยมปลาย / โรงเรียนมัธยม' }
}

const trimGrammarPhrase = (value: string, maxWords = 5) =>
  normalizeNoteText(value).split(/\s+/).slice(0, maxWords).join(' ')

const DISCOURSE_MARKERS = new Set([
  'generally speaking',
  'to begin with',
  'moving on to',
  'in terms of',
  'whether it be'
])

const vocabPriority = (term: string) => (DISCOURSE_MARKERS.has(term.toLowerCase()) ? 1 : 5)

const isUsefulGrammarPhrase = (phrase: string) => {
  const normalized = normalizeNoteText(phrase)
  const words = normalized.split(/\s+/).filter(Boolean)
  if (normalized.length < 12 || words.length < 3) return false
  if (/^(that|which|who|where|as|i|we|he|she|it|they)\s/i.test(normalized) && words.length < 4) return false
  if (/^(that i|which is|who are|where i)\b/i.test(normalized)) return false
  return true
}

const GRAMMAR_PATTERNS: Array<{
  pattern: RegExp
  grammarRule: string
  thai: string
  pickPhrase: (match: RegExpMatchArray, sentence: string) => string
}> = [
  {
    pattern: /\bused to\s+[a-z]+(?:\s+[a-z]+){0,4}/gi,
    grammarRule: 'used to + V1',
    thai: 'พูดถึงนิสัย/กิจวัตรในอดีตที่ไม่ทำแล้ว',
    pickPhrase: (match) => trimGrammarPhrase(match[0].trim())
  },
  {
    pattern: /\b(?:I|we|they|he|she|it)\s+would\s+(?!like\b)[a-z]+(?:\s+[a-z]+){0,3}/gi,
    grammarRule: 'S + would + V1',
    thai: 'พูดถึงสิ่งที่เคยทำบ่อยในอดีต',
    pickPhrase: (match) => trimGrammarPhrase(match[0].trim(), 4)
  },
  {
    pattern: /\b(?:have|has|had)\s+(?:been|become|done|seen|visited|known|lived|worked|read|grown|become)\b[^.?!]{0,50}/gi,
    grammarRule: 'S + have/has + V3',
    thai: 'present perfect — เชื่อมอดีตกับปัจจุบัน',
    pickPhrase: (match) => trimGrammarPhrase(match[0].trim(), 6)
  },
  {
    pattern: /\b(?:I|we|they|he|she|it)\s+(?:decided|majored|graduated|visited|started|felt|remembered|realized|engaged|picked|brought)\b(?:\s+[a-z]+){0,3}/gi,
    grammarRule: 'S + V2',
    thai: 'past simple — พูดถึงเหตุการณ์ในอดีต',
    pickPhrase: (match) => trimGrammarPhrase(match[0].trim(), 4)
  },
  {
    pattern: /\b(?:which|who|that|where)\s+[a-z]+(?:\s+[a-z]+){0,6}/gi,
    grammarRule: 'relative clause',
    thai: 'อนุภาคความ — ขยายคำนามที่อยู่ข้างหน้า',
    pickPhrase: (match) => trimGrammarPhrase(match[0].trim(), 6)
  },
  {
    pattern: /\b(?:because|since)\s+[a-z]+(?:\s+[a-z]+){0,6}/gi,
    grammarRule: 'because / since + clause',
    thai: 'บอกเหตุผล — เพราะว่า...',
    pickPhrase: (match) => trimGrammarPhrase(match[0].trim(), 6)
  },
  {
    pattern: /\bwhen I was\s+[a-z]+(?:\s+[a-z]+){0,4}/gi,
    grammarRule: 'when + past clause',
    thai: 'บอกช่วงเวลาในอดีต — ตอนที่...',
    pickPhrase: (match) => trimGrammarPhrase(match[0].trim())
  },
  {
    pattern: /\bas I grew up\b/gi,
    grammarRule: 'as + clause',
    thai: 'บอกการเปลี่ยนแปลงตามกาลเวลา — เมื่อโตขึ้น',
    pickPhrase: (match) => trimGrammarPhrase(match[0].trim())
  }
]

const normalizeNoteText = (value: string) => String(value || '').trim().replace(/\s+/g, ' ')

const parseDetailString = (detail: string) => {
  const text = normalizeNoteText(detail)
  if (!text) return null

  if (/past simple|present perfect|relative clause|used to|would \+ v1|s \+ v2|s \+ have/i.test(text)) {
    const parts = text.split(/\s*[·•|-]\s*/)
    if (parts.length >= 2) {
      return {
        kind: 'grammar' as const,
        grammarRule: parts[0].replace(/^grammar\s*[·•|-]\s*/i, '').trim(),
        thai: parts[1]?.trim() || '',
        exampleSentence: parts.slice(2).join(' · ').replace(/^["'“]|["'”]$/g, '').trim()
      }
    }
  }

  const vocabMatch = text.match(/^(.+?)\s*\(([^)]+)\)\s*(.+)$/i)
  if (vocabMatch) {
    return {
      kind: 'vocabulary' as const,
      phrase: vocabMatch[1].trim(),
      partOfSpeech: vocabMatch[2].trim(),
      thaiMeaning: vocabMatch[3].trim()
    }
  }

  const pipeParts = text.split(/\s*[·•|-]\s*/)
  if (pipeParts.length >= 3 && /^(n\.|v\.|adj\.|adv\.|v\. phr\.|adv\. phr\.|prep\. phr\.|conj\. phr\.|n\. phr\.)/i.test(pipeParts[1])) {
    return {
      kind: 'vocabulary' as const,
      phrase: pipeParts[0].trim(),
      partOfSpeech: pipeParts[1].trim(),
      thaiMeaning: pipeParts.slice(2).join(' · ').trim()
    }
  }

  return null
}

export const parseSpeakingSampleSubtitleNote = (
  note: SpeakingSampleSubtitleNote
): ParsedSpeakingSampleSubtitleNote | null => {
  const phrase = normalizeNoteText(note.phrase)
  if (!phrase) return null

  if (note.kind === 'grammar' || note.grammarRule) {
    const grammarRule = normalizeNoteText(note.grammarRule || '')
    const thai = normalizeNoteText(note.thaiMeaning || '')
    const example = normalizeNoteText(note.exampleSentence || phrase)
    if (!grammarRule && !thai && note.detail) {
      const parsed = parseDetailString(note.detail)
      if (parsed?.kind === 'grammar') {
        return {
          id: note.id,
          phrase,
          kind: 'grammar',
          headline: parsed.grammarRule || 'Grammar',
          body: parsed.thai || note.detail,
          example: parsed.exampleSentence || example
        }
      }
    }
    return {
      id: note.id,
      phrase,
      kind: 'grammar',
      headline: grammarRule || 'Grammar',
      body: thai || normalizeNoteText(note.detail || ''),
      example: example || undefined
    }
  }

  if (note.kind === 'vocabulary' || note.partOfSpeech || note.thaiMeaning) {
    const partOfSpeech = normalizeNoteText(note.partOfSpeech || '')
    const thai = normalizeNoteText(note.thaiMeaning || '')
    return {
      id: note.id,
      phrase,
      kind: 'vocabulary',
      headline: phrase,
      body: [partOfSpeech, thai].filter(Boolean).join(' · ') || normalizeNoteText(note.detail || ''),
      example: undefined
    }
  }

  const parsedDetail = note.detail ? parseDetailString(note.detail) : null
  if (parsedDetail?.kind === 'vocabulary') {
    return {
      id: note.id,
      phrase: parsedDetail.phrase || phrase,
      kind: 'vocabulary',
      headline: parsedDetail.phrase || phrase,
      body: `${parsedDetail.partOfSpeech} · ${parsedDetail.thaiMeaning}`.trim(),
      example: undefined
    }
  }
  if (parsedDetail?.kind === 'grammar') {
    return {
      id: note.id,
      phrase,
      kind: 'grammar',
      headline: parsedDetail.grammarRule || 'Grammar',
      body: parsedDetail.thai,
      example: parsedDetail.exampleSentence
    }
  }

  return {
    id: note.id,
    phrase,
    kind: 'vocabulary',
    headline: phrase,
    body: normalizeNoteText(note.detail || ''),
    example: undefined
  }
}

const sentenceAround = (text: string, index: number) => {
  const left = Math.max(
    0,
    text.lastIndexOf('.', index - 1) + 1,
    text.lastIndexOf('!', index - 1) + 1,
    text.lastIndexOf('?', index - 1) + 1
  )
  const rightCandidates = ['.', '!', '?'].map((mark) => {
    const pos = text.indexOf(mark, index)
    return pos >= 0 ? pos + 1 : text.length
  })
  const right = Math.min(...rightCandidates)
  return normalizeNoteText(text.slice(left, right))
}

const snapPhraseToCueText = (cues: SpeakingSampleSubtitleCue[], phrase: string) => {
  const lowerPhrase = normalizeNoteText(phrase).toLowerCase()
  if (!lowerPhrase) return phrase
  for (const cue of cues) {
    const text = normalizeNoteText(cue.text)
    const index = text.toLowerCase().indexOf(lowerPhrase)
    if (index >= 0) return text.slice(index, index + phrase.length)
  }
  const words = lowerPhrase.split(/\s+/).filter(Boolean)
  if (words.length <= 1) return phrase
  for (const cue of cues) {
    const text = normalizeNoteText(cue.text)
    const lowerText = text.toLowerCase()
    const startMatch = lowerText.match(
      new RegExp(`\\b${words[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`)
    )
    if (!startMatch || startMatch.index == null) continue
    let start = startMatch.index
    let end = start + words[0].length
    let matched = 1
    for (let i = 1; i < words.length; i += 1) {
      const nextMatch = lowerText
        .slice(end)
        .match(new RegExp(`^\\s+\\b${words[i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`))
      if (!nextMatch) break
      end += nextMatch[0].length
      matched += 1
    }
    if (matched >= Math.min(words.length, 2)) {
      return text.slice(start, end)
    }
  }
  return phrase
}

const findCueForPhrase = (cues: SpeakingSampleSubtitleCue[], phrase: string) => {
  const lowerPhrase = normalizeNoteText(phrase).toLowerCase()
  return (
    cues.find((cue) => normalizeNoteText(cue.text).toLowerCase().includes(lowerPhrase)) ||
    cues.find((cue) => {
      const words = lowerPhrase.split(/\s+/).filter((word) => word.length > 3)
      return words.length > 0 && words.every((word) => normalizeNoteText(cue.text).toLowerCase().includes(word))
    }) ||
    null
  )
}

const isQualityNote = (note: SpeakingSampleSubtitleNote) => {
  const phrase = normalizeNoteText(note.phrase)
  if (!phrase) return false
  if (note.kind === 'grammar' || note.grammarRule) {
    return Boolean(normalizeNoteText(note.grammarRule || '') && normalizeNoteText(note.thaiMeaning || ''))
  }
  if (note.kind === 'vocabulary' || note.partOfSpeech || note.thaiMeaning) {
    return Boolean(normalizeNoteText(note.partOfSpeech || '') && normalizeNoteText(note.thaiMeaning || ''))
  }
  return Boolean(normalizeNoteText(note.detail || '') && (note.detail || '').length > 12)
}

const collectQualityNotes = (cues: SpeakingSampleSubtitleCue[]) =>
  cues.flatMap((cue) => (cue.notes || []).filter(isQualityNote))

export const suggestSpeakingSampleSubtitleNotes = (
  cues: SpeakingSampleSubtitleCue[],
  transcript = ''
): SpeakingSampleSubtitleNote[] => {
  const cueText = cues.map((cue) => cue.text).join(' ')
  const fullText = normalizeNoteText([transcript, cueText].filter(Boolean).join(' '))
  if (!fullText) return []

  const suggestions: SpeakingSampleSubtitleNote[] = []
  const usedPhrases = new Set<string>()
  let noteId = 1

  const addSuggestion = (note: Omit<SpeakingSampleSubtitleNote, 'id'> & { id?: string }) => {
    const snappedPhrase = snapPhraseToCueText(cues, note.phrase)
    if (note.kind === 'grammar' && !isUsefulGrammarPhrase(snappedPhrase)) return false
    const cue = findCueForPhrase(cues, snappedPhrase)
    if (!cue) return false
    if (!normalizeNoteText(cue.text).toLowerCase().includes(snappedPhrase.toLowerCase())) return false
    const key = snappedPhrase.toLowerCase()
    if (usedPhrases.has(key)) return false
    usedPhrases.add(key)
    suggestions.push({
      ...note,
      id: note.id || `auto-${noteId++}`,
      phrase: snappedPhrase,
      detail:
        note.detail ||
        (note.kind === 'grammar'
          ? `${note.grammarRule || ''} · ${note.thaiMeaning || ''}`.trim()
          : `${snappedPhrase} · ${note.partOfSpeech || ''} · ${note.thaiMeaning || ''}`.trim())
    })
    return true
  }

  const glossaryEntries = Object.entries(VOCAB_GLOSSARY).sort(
    (a, b) => vocabPriority(b[0]) - vocabPriority(a[0]) || b[0].length - a[0].length
  )

  for (const grammar of GRAMMAR_PATTERNS) {
    if (suggestions.filter((item) => item.kind === 'grammar').length >= 2) break
    const regex = new RegExp(grammar.pattern.source, grammar.pattern.flags)
    let match = regex.exec(fullText)
    while (match) {
      const phrase = grammar.pickPhrase(match, fullText)
      if (!isUsefulGrammarPhrase(phrase)) {
        match = regex.exec(fullText)
        continue
      }
      const example = sentenceAround(fullText, match.index)
      const added = addSuggestion({
        phrase,
        kind: 'grammar',
        grammarRule: grammar.grammarRule,
        thaiMeaning: grammar.thai,
        exampleSentence: example.includes(phrase) ? example : `"${example}"`
      })
      if (added && suggestions.filter((item) => item.kind === 'grammar').length >= 2) break
      match = regex.exec(fullText)
    }
  }

  for (const [term, meta] of glossaryEntries) {
    if (suggestions.length >= 4) break
    if (suggestions.filter((item) => item.kind === 'vocabulary').length >= 2) continue
    const index = fullText.toLowerCase().indexOf(term.toLowerCase())
    if (index < 0) continue
    addSuggestion({
      phrase: fullText.slice(index, index + term.length),
      kind: 'vocabulary',
      partOfSpeech: meta.partOfSpeech,
      thaiMeaning: meta.thai
    })
  }

  for (const [term, meta] of glossaryEntries) {
    if (suggestions.length >= 4) break
    const index = fullText.toLowerCase().indexOf(term.toLowerCase())
    if (index < 0) continue
    addSuggestion({
      phrase: fullText.slice(index, index + term.length),
      kind: 'vocabulary',
      partOfSpeech: meta.partOfSpeech,
      thaiMeaning: meta.thai
    })
  }

  return suggestions.slice(0, 4)
}

export const enrichSpeakingSampleSubtitlesWithNotes = (
  cues: SpeakingSampleSubtitleCue[],
  transcript = ''
): SpeakingSampleSubtitleCue[] => {
  const qualityNotes = collectQualityNotes(cues)
  if (qualityNotes.length >= 4 && qualityNotes.every(isQualityNote)) {
    return cues.map((cue) => ({
      ...cue,
      notes: (cue.notes || []).map((note) => ({
        ...note,
        kind: note.kind || (note.grammarRule ? 'grammar' : note.partOfSpeech ? 'vocabulary' : undefined)
      }))
    }))
  }

  const suggestions = suggestSpeakingSampleSubtitleNotes(cues, transcript)
  if (!suggestions.length) return cues

  const nextCues = cues.map((cue) => ({ ...cue, notes: [] as SpeakingSampleSubtitleNote[] }))
  suggestions.forEach((note) => {
    const cue = findCueForPhrase(nextCues, note.phrase)
    if (!cue) return
    cue.notes = [...(cue.notes || []), note]
  })
  return nextCues
}

export const estimateSpeakingSampleSubtitleNoteRevealSeconds = (
  cue: Pick<SpeakingSampleSubtitleCue, 'startSeconds' | 'endSeconds' | 'text'>,
  phrase: string
) => {
  const text = normalizeNoteText(cue.text)
  const normalizedPhrase = normalizeNoteText(phrase)
  const duration = Math.max(0.12, cue.endSeconds - cue.startSeconds)
  if (!text || !normalizedPhrase) return cue.startSeconds
  const phraseIndex = text.toLowerCase().indexOf(normalizedPhrase.toLowerCase())
  if (phraseIndex < 0) return cue.startSeconds
  const phraseProgress = Math.min(0.95, Math.max(0, phraseIndex / Math.max(1, text.length)))
  return cue.startSeconds + duration * phraseProgress
}

export type RevealedSpeakingSampleSubtitleNote = SpeakingSampleSubtitleNote & {
  cueId: string
  revealSeconds: number
}

/** Notes that have been reached in playback — they stay visible for the rest of the video. */
export const getRevealedSpeakingSampleSubtitleNotes = (
  cues: SpeakingSampleSubtitleCue[],
  videoTime: number,
  maxNotes = 4
): RevealedSpeakingSampleSubtitleNote[] => {
  const seen = new Set<string>()
  const revealed: RevealedSpeakingSampleSubtitleNote[] = []

  cues.forEach((cue) => {
    ;(cue.notes || []).forEach((note) => {
      const phrase = normalizeNoteText(note.phrase)
      if (!phrase) return
      const revealSeconds = estimateSpeakingSampleSubtitleNoteRevealSeconds(cue, phrase)
      if (videoTime < revealSeconds - 0.02) return
      const key = phrase.toLowerCase()
      if (seen.has(key)) return
      seen.add(key)
      revealed.push({
        ...note,
        cueId: cue.id,
        revealSeconds
      })
    })
  })

  return revealed.sort((a, b) => a.revealSeconds - b.revealSeconds).slice(0, maxNotes)
}

export const isSpeakingSampleSubtitlePhraseRevealed = (
  cue: Pick<SpeakingSampleSubtitleCue, 'startSeconds' | 'endSeconds' | 'text'>,
  phrase: string,
  videoTime: number
) => videoTime >= estimateSpeakingSampleSubtitleNoteRevealSeconds(cue, phrase) - 0.02

export type SpeakingSampleVocabularyGuideItem = {
  level: 'B1' | 'B2' | 'C1'
  phrase: string
  tip: string
}

export const collectUniqueSpeakingSampleSubtitleNotes = (
  cues: SpeakingSampleSubtitleCue[] = []
): SpeakingSampleSubtitleNote[] => {
  const seen = new Set<string>()
  const notes: SpeakingSampleSubtitleNote[] = []

  cues.forEach((cue) => {
    ;(cue.notes || []).forEach((note) => {
      const key = normalizeNoteText(note.phrase).toLowerCase()
      if (!key || seen.has(key)) return
      seen.add(key)
      notes.push(note)
    })
  })

  return notes
}

const inferSpeakingSampleNoteLevel = (parsed: ParsedSpeakingSampleSubtitleNote): 'B1' | 'B2' => {
  if (parsed.kind === 'grammar') return 'B2'
  if (DISCOURSE_MARKERS.has(parsed.phrase.toLowerCase())) return 'B2'
  return parsed.phrase.split(/\s+/).filter(Boolean).length >= 3 ? 'B2' : 'B1'
}

/** Maps highlighted subtitle notes into Part 2 vocabulary guide cards. */
export const speakingSampleSubtitleNotesToVocabularyGuideItems = (
  cues: SpeakingSampleSubtitleCue[] = []
): SpeakingSampleVocabularyGuideItem[] =>
  collectUniqueSpeakingSampleSubtitleNotes(cues)
    .map((note) => parseSpeakingSampleSubtitleNote(note))
    .filter((parsed): parsed is ParsedSpeakingSampleSubtitleNote => Boolean(parsed))
    .map((parsed) => {
      const level = inferSpeakingSampleNoteLevel(parsed)
      if (parsed.kind === 'grammar') {
        const tipParts = [parsed.headline, parsed.body, parsed.example ? `เช่น ${parsed.example}` : ''].filter(Boolean)
        return {
          level,
          phrase: parsed.phrase,
          tip: tipParts.join(' · ')
        }
      }
      return {
        level,
        phrase: parsed.headline || parsed.phrase,
        tip: parsed.body || parsed.phrase
      }
    })
