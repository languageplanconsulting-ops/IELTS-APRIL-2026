const NUMBER_WORDS: Record<string, number> = {
  zero: 0,
  oh: 0,
  o: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
  twenty: 20,
  thirty: 30,
  forty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,
  hundred: 100,
  thousand: 1000
}

export const parseListeningAcceptedAnswers = (raw: string): string[] => {
  const trimmed = String(raw || '').trim()
  if (!trimmed) return []
  const parts = trimmed
    .split(/\s*\/\s*/)
    .map((part) => part.replace(/\(s\)/gi, 's').replace(/\(th\)/gi, 'th').trim())
    .filter(Boolean)
  return parts.length ? parts : [trimmed]
}

export const primaryListeningAnswer = (raw: string): string => {
  const variants = parseListeningAcceptedAnswers(raw)
  return variants[0]?.replace(/\([^)]*\)/g, '').trim() || String(raw || '').trim()
}

const collapseSpaces = (value: string) => value.replace(/\s+/g, ' ').trim()

const normalizeLoose = (value: string) =>
  collapseSpaces(
    String(value || '')
      .toLowerCase()
      .replace(/[''´`]/g, '')
      .replace(/[£$€]/g, '')
      .replace(/[.,!?;:]/g, ' ')
      .replace(/[^a-z0-9\s-]/g, ' ')
      .replace(/\s+/g, ' ')
  )

const stripOptionalParentheses = (value: string) =>
  collapseSpaces(String(value || '').replace(/\([^)]*\)/g, ' '))

const normalizePhone = (value: string) => value.replace(/\D/g, '')

const parseWordNumber = (value: string): number | null => {
  const tokens = normalizeLoose(value)
    .replace(/\band\b/g, ' ')
    .replace(/\bpoint\b/g, ' point ')
    .replace(/-/g, ' ')
    .split(/\s+/)
    .filter(Boolean)

  if (tokens.length === 0) return null

  let total = 0
  let current = 0
  let sawNumber = false

  for (const token of tokens) {
    if (token === 'point') continue

    const mapped = NUMBER_WORDS[token]
    if (mapped === undefined) {
      if (/^\d+(\.\d+)?$/.test(token)) {
        const numeric = Number.parseFloat(token)
        if (Number.isFinite(numeric)) {
          sawNumber = true
          current += numeric
        }
        continue
      }
      return null
    }

    sawNumber = true
    if (mapped === 100 || mapped === 1000) {
      current = current === 0 ? mapped : current * mapped
    } else if (mapped >= 20) {
      current += mapped
    } else {
      current += mapped
    }
  }

  total += current
  return sawNumber ? total : null
}

const parseNumericValue = (value: string): number | null => {
  const compact = String(value || '').trim().replace(/,/g, '')
  if (/^\d+(\.\d+)?$/.test(compact)) return Number.parseFloat(compact)

  const loose = normalizeLoose(value)
  if (/^\d+(\.\d+)?$/.test(loose.replace(/\s+/g, ''))) {
    return Number.parseFloat(loose.replace(/\s+/g, ''))
  }

  if (/\bpoint\b/.test(loose)) {
    const [wholeRaw, fractionRaw = ''] = loose.split(/\bpoint\b/)
    const whole = parseWordNumber(wholeRaw) ?? Number.parseInt(wholeRaw.replace(/\D/g, ''), 10)
    const fractionDigits = fractionRaw
      .replace(/\s+/g, '')
      .split('')
      .map((word) => {
        const mapped = NUMBER_WORDS[word]
        if (mapped !== undefined && mapped < 10) return String(mapped)
        return word
      })
      .join('')
    if (Number.isFinite(whole) && fractionDigits) {
      return Number.parseFloat(`${whole}.${fractionDigits}`)
    }
  }

  return parseWordNumber(value)
}

/** Canonical H:MM for clock answers like 1.15, one fifteen, 1:15 */
const normalizeClockToken = (value: string): string | null => {
  const loose = collapseSpaces(String(value || '').toLowerCase())
  if (!loose) return null

  const numericClock = loose.match(/\b(\d{1,2})\s*[.:]\s*(\d{1,2})\b/)
  if (numericClock) {
    return `${Number.parseInt(numericClock[1], 10)}:${numericClock[2].padStart(2, '0')}`
  }

  const hourMatch = loose.match(
    /\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\b/
  )
  const minuteMatch = loose.match(/\b(fifteen|thirty|forty five|forty-five|fortyfive|forty|five|ten|twenty|twenty five|twenty-five)\b/)
  if (hourMatch && minuteMatch) {
    const hour = NUMBER_WORDS[hourMatch[1]]
    let minute = NUMBER_WORDS[minuteMatch[1].replace(/-/g, ' ').split(' ').pop() || ''] ?? 0
    if (minuteMatch[1].includes('forty') && minuteMatch[1].includes('five')) minute = 45
    if (minuteMatch[1] === 'twenty five' || minuteMatch[1] === 'twenty-five') minute = 25
    if (hour !== undefined) return `${hour}:${String(minute).padStart(2, '0')}`
  }

  if (/\bhalf\b/.test(loose) && /\b(three|3)\b/.test(loose)) return '3:30'
  if (/\bhalf\b/.test(loose) && /\b(two|2)\b/.test(loose)) return '2:30'

  return null
}

const parseSpokenPhoneDigits = (value: string): string => {
  let expanded = String(value || '')
    .toLowerCase()
    .replace(/\bdouble\b/g, ' double ')
    .replace(/[^a-z0-9\s]/g, ' ')

  expanded = expanded.replace(/\bdouble\s+([a-z]+)\b/g, (_, word: string) => `${word} ${word}`)

  let digits = ''
  for (const token of expanded.split(/\s+/).filter(Boolean)) {
    if (/^\d+$/.test(token)) {
      digits += token
      continue
    }
    const mapped = NUMBER_WORDS[token]
    if (mapped !== undefined && mapped >= 0 && mapped <= 9) {
      digits += String(mapped)
    }
  }
  return digits
}

const parseListeningTimeMinutes = (value: string): number | null => {
  const clock = normalizeClockToken(value)
  if (!clock) return null
  const [hourRaw, minuteRaw] = clock.split(':')
  return Number.parseInt(hourRaw, 10) * 60 + Number.parseInt(minuteRaw, 10)
}

const answersMatch = (userAnswer: string, acceptedAnswer: string): boolean => {
  const user = String(userAnswer || '').trim()
  const accepted = stripOptionalParentheses(acceptedAnswer)
  if (!user || !accepted) return false

  if (user.toLowerCase() === accepted.toLowerCase()) return true

  const looseUser = normalizeLoose(user)
  const looseAccepted = normalizeLoose(accepted)
  if (looseUser && looseUser === looseAccepted) return true

  const userPhone = normalizePhone(user)
  const acceptedPhone = normalizePhone(accepted)
  if (userPhone.length >= 8 && acceptedPhone.length >= 8 && userPhone === acceptedPhone) return true

  const spokenUserPhone = parseSpokenPhoneDigits(user)
  const spokenAcceptedPhone = parseSpokenPhoneDigits(accepted)
  if (
    spokenUserPhone.length >= 8 &&
    spokenAcceptedPhone.length >= 8 &&
    spokenUserPhone === spokenAcceptedPhone
  ) {
    return true
  }
  if (spokenUserPhone.length >= 8 && spokenUserPhone === acceptedPhone) return true
  if (userPhone.length >= 8 && userPhone === spokenAcceptedPhone) return true

  const userClock = normalizeClockToken(user)
  const acceptedClock = normalizeClockToken(accepted)
  if (userClock && acceptedClock && userClock === acceptedClock) return true

  const userNumber = parseNumericValue(user)
  const acceptedNumber = parseNumericValue(accepted)
  if (userNumber !== null && acceptedNumber !== null && userNumber === acceptedNumber) return true

  const userTime = parseListeningTimeMinutes(user)
  const acceptedTime = parseListeningTimeMinutes(accepted)
  if (userTime !== null && acceptedTime !== null && userTime === acceptedTime) return true

  return false
}

export const isListeningPart1AnswerCorrect = (
  userAnswer: string,
  correctAnswer: string,
  acceptedAnswers?: string[]
): boolean => {
  const variants =
    acceptedAnswers && acceptedAnswers.length > 0
      ? acceptedAnswers
      : parseListeningAcceptedAnswers(correctAnswer)

  return variants.some((variant) => answersMatch(userAnswer, variant))
}

/** Gap-fill packs sometimes store the option key (A) instead of the word — resolve to text. */
export const resolveListeningGapFillAnswer = (input: {
  correctAnswer: string
  acceptedAnswers?: string[]
  options?: Array<{ key: string; text: string }>
}) => {
  const key = String(input.correctAnswer || '').trim()
  const optionMatch =
    key.length === 1 && /^[A-Z]$/i.test(key)
      ? input.options?.find((option) => option.key.toUpperCase() === key.toUpperCase())
      : undefined

  const textAnswer = optionMatch?.text || key
  const acceptedAnswers =
    input.acceptedAnswers && input.acceptedAnswers.length > 0
      ? input.acceptedAnswers
      : optionMatch
        ? [optionMatch.text]
        : textAnswer.includes('/')
          ? parseListeningAcceptedAnswers(textAnswer)
          : [textAnswer]

  return { correctAnswer: textAnswer, acceptedAnswers }
}

export const isListeningGapFillAnswerCorrect = (
  userAnswer: string,
  input: {
    correctAnswer: string
    acceptedAnswers?: string[]
    options?: Array<{ key: string; text: string }>
  }
) => {
  const resolved = resolveListeningGapFillAnswer(input)
  return isListeningPart1AnswerCorrect(userAnswer, resolved.correctAnswer, resolved.acceptedAnswers)
}
