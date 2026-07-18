export type WritingRecallCheck = {
  attempted: boolean
  passed: boolean
  feedback: string[]
}

export type WritingRecallProfile = 'task1' | 'task2'

type RecallToken = {
  value: string
  isWord: boolean
}

type TokenDiff =
  | { kind: 'substitute'; expected: RecallToken; given: RecallToken; expectedIndex: number }
  | { kind: 'missing'; expected: RecallToken; expectedIndex: number }
  | { kind: 'extra'; given: RecallToken; expectedIndex: number }

const PUNCTUATION_TH: Record<string, string> = {
  ',': 'comma (,)',
  '.': 'full stop (.)',
  ':': 'colon (:)',
  ';': 'semicolon (;)',
  '-': 'hyphen (-)',
  '—': 'dash (—)',
  "'": "apostrophe (')",
  '’': 'apostrophe (’)',
  '"': 'quotation mark (")',
  '%': 'เครื่องหมายเปอร์เซ็นต์ (%)',
  $: 'เครื่องหมายดอลลาร์ ($)',
  '(': 'วงเล็บเปิด (()',
  ')': 'วงเล็บปิด ())'
}

const PREPOSITIONS = new Set([
  'about',
  'after',
  'against',
  'among',
  'at',
  'before',
  'between',
  'by',
  'for',
  'from',
  'in',
  'into',
  'of',
  'on',
  'over',
  'than',
  'through',
  'to',
  'towards',
  'under',
  'with',
  'without'
])

const MODALS = new Set(['can', 'could', 'may', 'might', 'must', 'should', 'will', 'would'])

const IRREGULAR_PAST: Record<string, string> = {
  began: 'begin',
  became: 'become',
  brought: 'bring',
  built: 'build',
  chose: 'choose',
  did: 'do',
  fell: 'fall',
  found: 'find',
  gave: 'give',
  grew: 'grow',
  had: 'have',
  kept: 'keep',
  led: 'lead',
  made: 'make',
  ran: 'run',
  rose: 'rise',
  saw: 'see',
  stood: 'stand',
  took: 'take',
  went: 'go',
  were: 'be',
  wrote: 'write'
}

export const writingRecallWithoutWhitespace = (value: string): string => value.replace(/\s/gu, '')

export const isWritingRecallExact = (expected: string, given: string): boolean =>
  writingRecallWithoutWhitespace(expected) === writingRecallWithoutWhitespace(given)

const tokenize = (value: string): RecallToken[] =>
  [...value.matchAll(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*|[^\s\p{L}\p{N}]/gu)].map((match) => ({
    value: match[0],
    isWord: /^[\p{L}\p{N}]/u.test(match[0])
  }))

const buildTokenDiffs = (expected: string, given: string) => {
  const expectedTokens = tokenize(expected)
  const givenTokens = tokenize(given)
  const rows = expectedTokens.length + 1
  const cols = givenTokens.length + 1
  const dp = Array.from({ length: rows }, () => Array<number>(cols).fill(0))
  for (let row = 0; row < rows; row += 1) dp[row][0] = row
  for (let col = 0; col < cols; col += 1) dp[0][col] = col

  for (let row = 1; row < rows; row += 1) {
    for (let col = 1; col < cols; col += 1) {
      const same =
        expectedTokens[row - 1].value.toLocaleLowerCase() ===
        givenTokens[col - 1].value.toLocaleLowerCase()
      dp[row][col] = Math.min(
        dp[row - 1][col] + 1,
        dp[row][col - 1] + 1,
        dp[row - 1][col - 1] + (same ? 0 : 1)
      )
    }
  }

  const diffs: TokenDiff[] = []
  let row = expectedTokens.length
  let col = givenTokens.length
  while (row > 0 || col > 0) {
    if (row > 0 && col > 0) {
      const same =
        expectedTokens[row - 1].value.toLocaleLowerCase() ===
        givenTokens[col - 1].value.toLocaleLowerCase()
      const cost = same ? 0 : 1
      if (dp[row][col] === dp[row - 1][col - 1] + cost) {
        if (!same || expectedTokens[row - 1].value !== givenTokens[col - 1].value) {
          diffs.push({
            kind: 'substitute',
            expected: expectedTokens[row - 1],
            given: givenTokens[col - 1],
            expectedIndex: row - 1
          })
        }
        row -= 1
        col -= 1
        continue
      }
    }
    if (row > 0 && dp[row][col] === dp[row - 1][col] + 1) {
      diffs.push({ kind: 'missing', expected: expectedTokens[row - 1], expectedIndex: row - 1 })
      row -= 1
      continue
    }
    if (col > 0) {
      diffs.push({ kind: 'extra', given: givenTokens[col - 1], expectedIndex: row })
      col -= 1
    }
  }
  return { expectedTokens, diffs: diffs.reverse() }
}

const contextAt = (tokens: RecallToken[], index: number): string =>
  tokens
    .slice(Math.max(0, index - 4), Math.min(tokens.length, index + 5))
    .map((token) => token.value)
    .join(' ')
    .replace(/\s+([,.!?;:])/gu, '$1')

const punctuationName = (value: string) => PUNCTUATION_TH[value] || `เครื่องหมาย “${value}”`

const commaReason = (tokens: RecallToken[], index: number): string => {
  const next = tokens[index + 1]?.value.toLocaleLowerCase()
  if (next === 'which') {
    return 'comma นี้ต้องอยู่หน้า which ในโครงสร้าง S+V, which + singular verb เพื่อเพิ่มข้อมูลเกี่ยวกับประโยคหลัก'
  }
  const sentenceStart = tokens
    .slice(0, index)
    .map((token) => token.value)
    .join(' ')
    .split(/[.!?]/u)
    .at(-1)
    ?.trim()
    .toLocaleLowerCase()
  if (/^(while|whereas|although|if|because|when)\b/u.test(sentenceStart || '')) {
    return 'เมื่อ dependent clause ขึ้นต้นด้วย While/Whereas/Although/If/Because ต้องใส่ comma ก่อน main clause'
  }
  if (/^(however|therefore|moreover|furthermore|for example|for instance|to illustrate|in conclusion)\b/u.test(sentenceStart || '')) {
    return 'คำเชื่อมขึ้นต้นประโยคต้องตามด้วย comma ก่อนเข้าสู่ใจความหลัก'
  }
  return 'comma ใช้แบ่ง clause รายการ หรือวลีขยาย เพื่อให้โครงสร้างประโยคชัดเจน'
}

const classifyWordError = (
  expectedWord: string,
  givenWord: string,
  tokens: RecallToken[],
  index: number
): string => {
  const expected = expectedWord.toLocaleLowerCase()
  const given = givenWord.toLocaleLowerCase()
  const previous = tokens[index - 1]?.value.toLocaleLowerCase() || ''
  const previousTwo = tokens[index - 2]?.value.toLocaleLowerCase() || ''
  const context = contextAt(tokens, index)

  if ((expected === 'was' && given === 'were') || (expected === 'were' && given === 'was')) {
    return `was/were: ใน “…${context}…” ต้องใช้ “${expectedWord}” ให้ตรงกับประธาน — was ใช้กับเอกพจน์ ส่วน were ใช้กับพหูพจน์`
  }
  if (
    (expected === 'is' && given === 'are') ||
    (expected === 'are' && given === 'is') ||
    (expected === 'has' && given === 'have') ||
    (expected === 'have' && given === 'has')
  ) {
    return `Subject–verb agreement: ใน “…${context}…” ต้องใช้ “${expectedWord}” ไม่ใช่ “${givenWord}” ให้ตรงกับประธานเอกพจน์/พหูพจน์`
  }
  if (['a', 'an', 'the'].includes(expected)) {
    return `Article: ใน “…${context}…” ต้องใช้ “${expectedWord}” เพื่อระบุคำนามให้ถูกต้อง`
  }
  if (PREPOSITIONS.has(expected)) {
    return `Preposition: ใน “…${context}…” ต้องใช้ “${expectedWord}” เพราะเป็นคำที่เข้าคู่กับวลีนี้`
  }
  if (MODALS.has(previous)) {
    return `Modal + base verb: ใน “…${context}…” หลัง “${previous}” ต้องใช้กริยารูปพื้นฐาน “${expectedWord}” ไม่เติม -s, -ed หรือ -ing`
  }
  if (['has', 'have', 'had'].includes(previous) || (previousTwo === 'has' && previous === 'been')) {
    return `Perfect tense: ใน “…${context}…” หลัง ${previous} ต้องใช้ V3 “${expectedWord}” ไม่ใช่ “${givenWord}”`
  }
  if (['is', 'are', 'was', 'were', 'be', 'been', 'being'].includes(previous)) {
    return `Passive voice (be + V3): ใน “…${context}…” ต้องใช้ V3 “${expectedWord}” หลัง “${previous}” เพราะประธานเป็นสิ่งที่ถูกกระทำ`
  }
  const irregularBase = IRREGULAR_PAST[expected]
  if (irregularBase && (given === irregularBase || given.endsWith('ing'))) {
    return `Past tense: ใน “…${context}…” ต้องใช้ V2 “${expectedWord}” ไม่ใช่ “${givenWord}”`
  }
  if (expected.endsWith('ed') && (given === expected.slice(0, -2) || given.endsWith('ing'))) {
    return `Past tense (-ed): ใน “…${context}…” ต้องเติม -ed เป็น “${expectedWord}”`
  }
  if (expected.endsWith('ing') && !given.endsWith('ing')) {
    return `V-ing: ใน “…${context}…” ต้องใช้ “${expectedWord}” เพื่อทำหน้าที่เป็น gerund หรือ participle ตามโครงสร้าง`
  }
  if (
    (expected.endsWith('es') && given === expected.slice(0, -2)) ||
    (expected.endsWith('s') && given === expected.slice(0, -1))
  ) {
    return `Present simple s/es: ใน “…${context}…” ประธานเอกพจน์จึงต้องใช้ “${expectedWord}”`
  }
  if (expected.endsWith('s') && given === expected.slice(0, -1)) {
    return `Singular/plural: ใน “…${context}…” ต้องใช้คำนามพหูพจน์ “${expectedWord}”`
  }
  return `คำหรือการสะกด: ใน “…${context}…” ต้องเป็น “${expectedWord}” แต่พิมพ์ “${givenWord}”`
}

export const buildWritingRecallFeedback = (
  expected: string,
  given: string,
  profile: WritingRecallProfile = 'task2'
): string[] => {
  if (!given.trim()) {
    return [
      profile === 'task1'
        ? 'ยังไม่ได้พิมพ์ย่อหน้าเลยนะ ลองเขียนประโยคที่เพิ่งประกอบให้ครบก่อน ✍️'
        : 'ยังไม่ได้พิมพ์ย่อหน้า ลองเขียนส่วนที่เพิ่งทำจากความจำให้ครบก่อน'
    ]
  }
  const { expectedTokens, diffs } = buildTokenDiffs(expected, given)
  const feedback = diffs.map((diff) => {
    const context = contextAt(expectedTokens, diff.expectedIndex)
    if (diff.kind === 'substitute') {
      if (
        diff.expected.isWord &&
        diff.given.isWord &&
        diff.expected.value.toLocaleLowerCase() === diff.given.value.toLocaleLowerCase()
      ) {
        return `Capital letter: ใน “…${context}…” ต้องพิมพ์ “${diff.expected.value}” ไม่ใช่ “${diff.given.value}” — ตรวจคำแรกของประโยคและชื่อเฉพาะ`
      }
      if (
        diff.expected.isWord &&
        diff.given.isWord &&
        diff.expected.value.replace(/['’\-]/gu, '').toLocaleLowerCase() ===
          diff.given.value.replace(/['’\-]/gu, '').toLocaleLowerCase()
      ) {
        return `Punctuation ในคำ: “${diff.expected.value}” ต้องมี apostrophe/hyphen ให้ตรง ไม่ใช่ “${diff.given.value}”`
      }
      if (!diff.expected.isWord || !diff.given.isWord) {
        const reason = diff.expected.value === ',' ? ` — ${commaReason(expectedTokens, diff.expectedIndex)}` : ''
        return `Punctuation: ใน “…${context}…” ต้องใช้ ${punctuationName(diff.expected.value)} แทน ${punctuationName(diff.given.value)}${reason}`
      }
      return classifyWordError(
        diff.expected.value,
        diff.given.value,
        expectedTokens,
        diff.expectedIndex
      )
    }
    if (diff.kind === 'missing') {
      if (!diff.expected.isWord) {
        const reason = diff.expected.value === ',' ? ` — ${commaReason(expectedTokens, diff.expectedIndex)}` : ''
        return `Punctuation หาย: เติม ${punctuationName(diff.expected.value)} ใน “…${context}…”${reason}`
      }
      const expectedLower = diff.expected.value.toLocaleLowerCase()
      const next = expectedTokens[diff.expectedIndex + 1]?.value.toLocaleLowerCase() || ''
      if (
        ['is', 'are', 'was', 'were', 'be', 'been', 'being'].includes(expectedLower) &&
        /(?:ed|en|wn|lt|nt|pt|d|t)$/u.test(next)
      ) {
        return `Passive voice ขาด verb to be: ใน “…${context}…” ต้องเติม “${diff.expected.value}” หน้า V3`
      }
      return `คำหาย: เติม “${diff.expected.value}” ใน “…${context}…”`
    }
    if (!diff.given.isWord) {
      return `Punctuation เกิน: ลบ ${punctuationName(diff.given.value)} บริเวณ “…${context}…”`
    }
    return `คำเกิน: ลบ “${diff.given.value}” บริเวณ “…${context}…” เพราะไม่มีคำนี้ในย่อหน้าต้นฉบับ`
  })
  return [...new Set(feedback)].slice(0, 20)
}
