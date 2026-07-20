import type {
  Wgb2Blank,
  Wgb2Exercise,
  Wgb2Focus,
  Wgb2PunctChoice,
  Wgb2Segment,
  Wgb2Step
} from './writingTask2Builder'
import { getWgb2OptionFillers } from './writingTask2Fillers'
import { isAttestedTask2Word } from './writingTask2RealWords'

const INTRO_MINIMUM = 6
const BODY_MINIMUM = 12
const BODY_ROLES = new Set(['body1', 'body2', 'body3'])

type SelectRule = {
  pattern: RegExp
  options: string[]
  focus: Wgb2Focus
  explain: string
}

const SELECT_RULES: SelectRule[] = [
  {
    pattern: /\bwidely\b/,
    options: ['widely', 'wide', 'widen'],
    focus: 'adverb',
    explain: 'widely เป็น adverb ขยายกริยาหรือ participle ส่วน wide เป็น adjective และ widen เป็น verb'
  },
  {
    pattern: /\bsignificantly\b/,
    options: ['significantly', 'significant', 'significance'],
    focus: 'adverb',
    explain: 'significantly เป็น adverb ใช้ขยายกริยาเพื่อบอกระดับของการเปลี่ยนแปลงหรือผลกระทบ'
  },
  {
    pattern: /\bparticularly\b/,
    options: ['particularly', 'particular', 'particularity'],
    focus: 'adverb',
    explain: 'particularly เป็น adverb หมายถึง “โดยเฉพาะ” และใช้เน้นข้อมูลที่ตามมา'
  },
  {
    pattern: /\bbeneficial\b/,
    options: ['beneficial', 'benefit', 'beneficially'],
    focus: 'adjective',
    explain: 'beneficial เป็น adjective ใช้ขยายคำนามหรืออยู่หลัง linking verb'
  },
  {
    pattern: /\beffective\b/,
    options: ['effective', 'effect', 'effectively'],
    focus: 'adjective',
    explain: 'effective เป็น adjective หมายถึง “มีประสิทธิผล” และใช้ขยายคำนาม'
  },
  {
    pattern: /\bimportant\b/,
    options: ['important', 'importance', 'importantly'],
    focus: 'adjective',
    explain: 'important เป็น adjective; importance เป็น noun และ importantly เป็น adverb'
  },
  {
    pattern: /\bseveral\b/,
    options: ['several', 'severely', 'severity'],
    focus: 'word-choice',
    explain: 'several เป็น quantifier ที่ใช้หน้าคำนามนับได้พหูพจน์'
  },
  {
    pattern: /\bmany\b/,
    options: ['many', 'much', 'amount'],
    focus: 'word-choice',
    explain: 'many ใช้กับคำนามนับได้พหูพจน์ ส่วน much ใช้กับคำนามนับไม่ได้'
  },
  {
    pattern: /\bcould\b/,
    options: ['could', 'must', 'did'],
    focus: 'verb-tense',
    explain: 'could + กริยารูปพื้นฐาน ใช้เสนอความเป็นไปได้หรือแนวทางอย่างเหมาะสมใน Task 2'
  },
  {
    pattern: /\bwould\b/,
    options: ['would', 'did', 'has'],
    focus: 'verb-tense',
    explain: 'would + กริยารูปพื้นฐาน ใช้อธิบายผลลัพธ์สมมติหรือผลที่คาดว่าจะเกิด'
  },
  {
    pattern: /\bshould\b/,
    options: ['should', 'did', 'has'],
    focus: 'verb-tense',
    explain: 'should + กริยารูปพื้นฐาน ใช้เสนอคำแนะนำหรือสิ่งที่ควรทำ'
  },
  {
    pattern: /\bcan\b/,
    options: ['can', 'does', 'has'],
    focus: 'verb-tense',
    explain: 'can + กริยารูปพื้นฐาน ใช้แสดงความสามารถหรือผลที่เป็นไปได้'
  },
  {
    pattern: /\bmore\b/,
    options: ['more', 'most', 'many'],
    focus: 'word-choice',
    explain: 'more ใช้แสดงการเปรียบเทียบหรือปริมาณที่เพิ่มขึ้นตามบริบทของประโยค'
  },
  {
    pattern: /\bless\b/,
    options: ['less', 'least', 'fewer'],
    focus: 'word-choice',
    explain: 'less ใช้กับปริมาณหรือคำนามนับไม่ได้ ส่วน fewer ใช้กับคำนามนับได้พหูพจน์'
  },
  {
    pattern: /\boften\b/,
    options: ['often', 'frequent', 'frequency'],
    focus: 'adverb',
    explain: 'often เป็น adverb of frequency ส่วน frequent เป็น adjective และ frequency เป็นคำนาม'
  },
  {
    pattern: /\bmodern\b/,
    options: ['modern', 'modernity', 'modernise'],
    focus: 'adjective',
    explain: 'modern เป็น adjective ใช้ขยายคำนาม ส่วน modernity เป็นคำนามและ modernise เป็นกริยา'
  },
  {
    pattern: /\bserious\b/,
    options: ['serious', 'seriously', 'seriousness'],
    focus: 'adjective',
    explain: 'serious เป็น adjective ใช้ขยายคำนาม; seriously เป็น adverb'
  }
]

/** Every option these rules can inject — seeds the real-word lexicon build. */
export const WGB2_DENSITY_SELECT_OPTIONS: string[] = SELECT_RULES.flatMap((rule) => rule.options)

const DRAG_RULES = [
  {
    phrase: 'To begin with',
    options: ['To begin with', 'For example', 'In conclusion'],
    explain: 'To begin with ใช้เปิดเหตุผลหรือประเด็นแรกของย่อหน้า'
  },
  {
    phrase: 'For example',
    options: ['For example', 'In contrast', 'Therefore'],
    explain: 'For example ใช้นำตัวอย่างที่สนับสนุนประโยคก่อนหน้า'
  },
  {
    phrase: 'For instance',
    options: ['For instance', 'However', 'As a result'],
    explain: 'For instance ใช้นำตัวอย่างเฉพาะ'
  },
  {
    phrase: 'On the other hand',
    options: ['On the other hand', 'For example', 'In addition'],
    explain: 'On the other hand ใช้นำมุมมองหรือข้อมูลที่ตรงข้ามกัน'
  },
  {
    phrase: 'However',
    options: ['However', 'Therefore', 'For example'],
    explain: 'However ใช้เชื่อมความคิดที่ขัดแย้งกับข้อความก่อนหน้า'
  },
  {
    phrase: 'Moreover',
    options: ['Moreover', 'However', 'For instance'],
    explain: 'Moreover ใช้เพิ่มเหตุผลหรือข้อมูลที่สนับสนุนแนวคิดเดิม'
  },
  {
    phrase: 'Furthermore',
    options: ['Furthermore', 'Nevertheless', 'For example'],
    explain: 'Furthermore ใช้เพิ่มเหตุผลหรือข้อมูลในทิศทางเดียวกัน'
  },
  {
    phrase: 'Another reason',
    options: ['Another reason', 'For example', 'In conclusion'],
    explain: 'Another reason ใช้เพิ่มเหตุผลข้อถัดไป'
  },
  {
    phrase: 'Another measure',
    options: ['Another measure', 'For instance', 'To begin with'],
    explain: 'Another measure ใช้เพิ่มแนวทางแก้ไขข้อถัดไป'
  },
  {
    phrase: 'To illustrate',
    options: ['To illustrate', 'In contrast', 'As a result'],
    explain: 'To illustrate ใช้นำหลักฐานหรือตัวอย่างประกอบ'
  },
  {
    phrase: 'In this sense',
    options: ['In this sense', 'For example', 'On the contrary'],
    explain: 'In this sense ใช้สรุปผลจากเหตุผลที่อธิบายไว้ก่อนหน้า'
  }
]

const TYPE_STOP_WORDS = new Set([
  'about',
  'after',
  'although',
  'another',
  'because',
  'before',
  'between',
  'could',
  'first',
  'from',
  'however',
  'into',
  'many',
  'more',
  'other',
  'people',
  'several',
  'should',
  'their',
  'there',
  'these',
  'those',
  'through',
  'which',
  'while',
  'would'
])

const blankCount = (segments: Wgb2Segment[]): number =>
  segments.reduce((count, segment) => count + (segment.kind === 'blank' ? 1 : 0), 0)

const blankKinds = (segments: Wgb2Segment[]): Set<Wgb2Blank['kind']> =>
  new Set(
    segments.flatMap((segment) => (segment.kind === 'blank' ? [segment.blank.kind] : []))
  )

const makeStableId = (
  promptId: string,
  role: string,
  kind: Wgb2Blank['kind'],
  usedIds: Set<string>
): string => {
  let index = 1
  let id = `${promptId}-${role}-density-${kind}-${index}`
  while (usedIds.has(id)) {
    index += 1
    id = `${promptId}-${role}-density-${kind}-${index}`
  }
  usedIds.add(id)
  return id
}

const replaceTextRange = (
  segments: Wgb2Segment[],
  segmentIndex: number,
  start: number,
  length: number,
  blank: Wgb2Blank
): Wgb2Segment[] => {
  const segment = segments[segmentIndex]
  if (segment.kind !== 'text') return segments
  const before = segment.text.slice(0, start)
  const after = segment.text.slice(start + length)
  const replacement: Wgb2Segment[] = []
  if (before) replacement.push({ kind: 'text', text: before })
  replacement.push({ kind: 'blank', blank })
  if (after) replacement.push({ kind: 'text', text: after })
  return [...segments.slice(0, segmentIndex), ...replacement, ...segments.slice(segmentIndex + 1)]
}

const insertPunctuationBlank = (
  segments: Wgb2Segment[],
  promptId: string,
  role: string,
  usedIds: Set<string>
): Wgb2Segment[] | null => {
  for (let segmentIndex = 0; segmentIndex < segments.length; segmentIndex += 1) {
    const segment = segments[segmentIndex]
    if (segment.kind !== 'text') continue
    const match = /[.;,]/.exec(segment.text)
    if (!match || match.index === undefined) continue
    const symbol = match[0]
    const answer: Wgb2PunctChoice =
      symbol === '.' ? 'period' : symbol === ';' ? 'semicolon' : 'comma'
    const options: Wgb2PunctChoice[] =
      answer === 'period'
        ? ['period', 'comma', 'none']
        : answer === 'semicolon'
          ? ['semicolon', 'comma', 'period']
          : ['comma', 'none', 'period']
    return replaceTextRange(segments, segmentIndex, match.index, 1, {
      kind: 'punct',
      id: makeStableId(promptId, role, 'punct', usedIds),
      options,
      answer,
      focus: 'punct',
      explain:
        answer === 'period'
          ? 'ใจความนี้จบเป็นประโยคสมบูรณ์ จึงใช้ full stop ก่อนเริ่มประโยคถัดไป'
          : answer === 'semicolon'
            ? 'สอง independent clauses เกี่ยวข้องกันใกล้ชิด จึงใช้ semicolon เชื่อมได้'
            : 'ตำแหน่งนี้ต้องใช้ comma เพื่อคั่นวลี อนุประโยค หรือคำเชื่อมให้ประโยคอ่านชัดเจน'
    })
  }
  return null
}

const insertDragBlank = (
  segments: Wgb2Segment[],
  promptId: string,
  role: string,
  usedIds: Set<string>
): Wgb2Segment[] | null => {
  for (let segmentIndex = 0; segmentIndex < segments.length; segmentIndex += 1) {
    const segment = segments[segmentIndex]
    if (segment.kind !== 'text') continue
    for (const rule of DRAG_RULES) {
      const start = segment.text.indexOf(rule.phrase)
      if (start < 0) continue
      return replaceTextRange(segments, segmentIndex, start, rule.phrase.length, {
        kind: 'drag',
        id: makeStableId(promptId, role, 'drag', usedIds),
        options: rule.options,
        answer: rule.phrase,
        focus: 'transition',
        explain: rule.explain
      })
    }
  }
  return null
}

const convertTransitionSelectToDrag = (segments: Wgb2Segment[]): Wgb2Segment[] | null => {
  const index = segments.findIndex(
    (segment) =>
      segment.kind === 'blank' &&
      segment.blank.kind === 'select' &&
      segment.blank.focus === 'transition'
  )
  if (index < 0) return null
  const segment = segments[index]
  if (segment.kind !== 'blank' || segment.blank.kind !== 'select') return null
  const selectBlank = segment.blank
  return segments.map<Wgb2Segment>((item, itemIndex) =>
    itemIndex === index
      ? {
          kind: 'blank',
          blank: {
            kind: 'drag',
            id: selectBlank.id,
            options: selectBlank.options,
            answer: selectBlank.answer,
            focus: 'transition',
            explain: selectBlank.explain
          }
        }
      : item
  )
}

const insertSelectBlank = (
  segments: Wgb2Segment[],
  promptId: string,
  role: string,
  usedIds: Set<string>,
  forcedId?: string
): Wgb2Segment[] | null => {
  const blankId = forcedId ?? makeStableId(promptId, role, 'select', usedIds)
  if (forcedId) usedIds.add(forcedId)
  for (const rule of SELECT_RULES) {
    for (let segmentIndex = 0; segmentIndex < segments.length; segmentIndex += 1) {
      const segment = segments[segmentIndex]
      if (segment.kind !== 'text') continue
      const match = rule.pattern.exec(segment.text)
      rule.pattern.lastIndex = 0
      if (!match || match.index === undefined) continue
      return replaceTextRange(segments, segmentIndex, match.index, match[0].length, {
        kind: 'select',
        id: blankId,
        options: rule.options,
        answer: match[0],
        focus: rule.focus,
        explain: rule.explain
      })
    }
  }

  // Walk candidates until one yields real-word foils. Task 2 tests grammar and
  // word choice, so a word with no genuine alternative forms ("that", "cannot",
  // "themselves") must be skipped rather than given invented ones.
  const asSelectBlank = (candidate: TypeCandidate, foils: string[]) =>
    replaceTextRange(segments, candidate.segmentIndex, candidate.start, candidate.answer.length, {
      kind: 'select',
      id: blankId,
      options: [candidate.answer, ...foils.slice(0, 3)],
      answer: candidate.answer,
      focus: 'word-choice',
      explain: `เลือก “${candidate.answer}” เพราะเป็นรูปคำที่ทำให้ความหมายและโครงสร้างของประโยคนี้สมบูรณ์`
    })

  let fallback: { candidate: TypeCandidate; foils: string[] } | null = null
  for (const candidate of rankTypeCandidates(segments)) {
    const foils = wordFormCandidates(candidate.answer).filter(isAttestedTask2Word)
    if (foils.length >= 2) return asSelectBlank(candidate, foils)
    // Prefer a candidate that at least contributes one genuine word-form foil.
    if (!fallback || (foils.length > fallback.foils.length)) fallback = { candidate, foils }
  }
  if (!fallback) return null

  // Last resort: the word has no real alternative forms, so top up with genuine
  // words rather than inventing forms like "facted".
  const foils = [...fallback.foils]
  for (const filler of getWgb2OptionFillers('word-choice')) {
    if (foils.length >= 2) break
    if (filler === fallback.candidate.answer || foils.includes(filler)) continue
    foils.push(filler)
  }
  return asSelectBlank(fallback.candidate, foils)
}

type TypeCandidate = {
  segmentIndex: number
  start: number
  answer: string
}

const IRREGULAR_BASE_FORMS: Record<string, string> = {
  children: 'child',
  people: 'person',
  women: 'woman',
  men: 'man',
  feet: 'foot',
  teeth: 'tooth',
  mice: 'mouse',
  buses: 'bus',
  analyses: 'analysis',
  crises: 'crisis',
  does: 'do',
  goes: 'go',
  has: 'have'
}

const getExerciseBaseForm = (answer: string) => {
  const lower = answer.toLocaleLowerCase()
  if (IRREGULAR_BASE_FORMS[lower]) return IRREGULAR_BASE_FORMS[lower]
  if (lower.endsWith('ies') && lower.length > 4) return `${lower.slice(0, -3)}y`
  if (/(sses|shes|ches|xes|zes)$/.test(lower)) return lower.slice(0, -2)
  if (
    lower.endsWith('s') &&
    !lower.endsWith('ss') &&
    !lower.endsWith('is') &&
    !lower.endsWith('us') &&
    lower.length > 4
  ) {
    return lower.slice(0, -1)
  }
  return lower
}

/**
 * Words with no useful inflected forms. "willed" and "pasted" are real English,
 * but as foils for the modal "will" or the noun "past" they teach nothing.
 */
const NON_INFLECTING = new Set([
  'will', 'would', 'shall', 'should', 'can', 'could', 'may', 'might', 'must',
  'past', 'present', 'future', 'that', 'this', 'these', 'those', 'such', 'well',
  'very', 'much', 'more', 'most', 'less', 'least', 'often', 'always', 'never',
  'both', 'each', 'every', 'while', 'since', 'because', 'though', 'although'
])

/**
 * Correctly spelled inflections of `answer`, for use as multiple-choice foils.
 * Callers must still filter through `isRealTask2Word` — this only guarantees
 * the spelling rules, not that the resulting word exists.
 */
export const wordFormCandidates = (answer: string): string[] => {
  const lower = answer.toLocaleLowerCase()
  // Contractions and possessives ("nation's") have no inflected forms to offer.
  if (!/^[a-z]+$/.test(lower)) return []
  if (NON_INFLECTING.has(lower)) return []
  const forms: string[] = []
  const push = (word: string) => {
    if (word.length < 3 || word === lower) return
    if (/^[A-Z]/.test(answer)) forms.push(word.charAt(0).toUpperCase() + word.slice(1))
    else forms.push(word)
  }

  if (lower.endsWith('ing')) {
    const stem = lower.slice(0, -3)
    push(stem)
    push(`${stem}e`)
    push(`${stem}ed`)
    push(`${stem}ed`.replace(/eed$/, 'ed'))
    push(`${stem}s`)
    push(`${stem}es`)
  } else if (lower.endsWith('ied')) {
    const stem = lower.slice(0, -3)
    push(`${stem}y`)
    push(`${stem}ies`)
    push(`${stem}ying`)
  } else if (lower.endsWith('ed')) {
    const stem = lower.slice(0, -2)
    push(stem)
    push(`${stem}e`)
    push(`${stem}ing`)
    push(`${stem}s`)
  } else if (lower.endsWith('ies')) {
    const stem = lower.slice(0, -3)
    push(`${stem}y`)
    push(`${stem}ied`)
    push(`${stem}ying`)
  } else if (lower.endsWith('s') && !/(?:ss|us|is)$/.test(lower)) {
    const stem = lower.slice(0, -1)
    push(stem)
    push(`${stem}e`)
    push(`${stem}ed`)
    push(`${stem}ing`)
  } else if (lower.endsWith('e')) {
    push(`${lower}s`)
    push(`${lower}d`)
    push(`${lower.slice(0, -1)}ing`)
  } else if (/[^aeiou]y$/.test(lower)) {
    const stem = lower.slice(0, -1)
    push(`${stem}ies`)
    push(`${stem}ied`)
    push(`${lower}ing`)
  } else {
    push(`${lower}s`)
    push(`${lower}es`)
    push(`${lower}ed`)
    push(`${lower}ing`)
  }
  return [...new Set(forms)]
}

function rankTypeCandidates(segments: Wgb2Segment[]): TypeCandidate[] {
  const candidates: Array<TypeCandidate & { score: number }> = []
  segments.forEach((segment, segmentIndex) => {
    if (segment.kind !== 'text') return
    const matches = [...segment.text.matchAll(/\b[A-Za-z][A-Za-z'-]{3,}\b/g)]
    matches.forEach((match) => {
      if (match.index === undefined) return
      const answer = match[0]
      if (TYPE_STOP_WORDS.has(answer.toLocaleLowerCase())) return
      const centreDistance = Math.abs(match.index + answer.length / 2 - segment.text.length / 2)
      candidates.push({
        segmentIndex,
        start: match.index,
        answer,
        score: segment.text.length - centreDistance
      })
    })
  })
  candidates.sort((a, b) => b.score - a.score)
  return candidates
}

const findTypeCandidate = (segments: Wgb2Segment[]): TypeCandidate | null =>
  rankTypeCandidates(segments)[0] ?? null

const insertTypeBlank = (
  segments: Wgb2Segment[],
  promptId: string,
  role: string,
  usedIds: Set<string>,
  forcedId?: string
): Wgb2Segment[] | null => {
  const candidate = findTypeCandidate(segments)
  if (!candidate) return null
  if (forcedId) usedIds.add(forcedId)
  const base = getExerciseBaseForm(candidate.answer)
  return replaceTextRange(
    segments,
    candidate.segmentIndex,
    candidate.start,
    candidate.answer.length,
    {
      kind: 'type',
      id: forcedId ?? makeStableId(promptId, role, 'type', usedIds),
      base,
      answers: [candidate.answer],
      focus: 'word-choice',
      explain:
        base === candidate.answer.toLocaleLowerCase()
          ? `เติม “${candidate.answer}” ให้ตรงกับความหมายและรูปคำที่ประโยคนี้ต้องการ`
          : `โจทย์ให้รูปตั้งต้น “${base}” ผู้เรียนต้องผันเป็น “${candidate.answer}” ให้ตรงกับเอกพจน์/พหูพจน์หรือรูปกริยาในประโยค`
    }
  )
}

const requireInsertion = (
  result: Wgb2Segment[] | null,
  promptId: string,
  role: string,
  kind: string
): Wgb2Segment[] => {
  if (result) return result
  throw new Error(`Unable to add ${kind} question to ${promptId} ${role}`)
}

const EXAMPLE_LINKERS = ['for example', 'for instance', 'to illustrate']

const acceptEquivalentExampleLinkers = (segments: Wgb2Segment[]): Wgb2Segment[] =>
  segments.map((segment) => {
    if (
      segment.kind !== 'blank' ||
      (segment.blank.kind !== 'select' && segment.blank.kind !== 'drag') ||
      !EXAMPLE_LINKERS.includes(segment.blank.answer.toLocaleLowerCase())
    ) {
      return segment
    }
    const capitalized = /^[A-Z]/.test(segment.blank.answer)
    const acceptedAnswers = EXAMPLE_LINKERS.map((linker) =>
      capitalized ? linker.charAt(0).toUpperCase() + linker.slice(1) : linker
    )
    return {
      kind: 'blank',
      blank: {
        ...segment.blank,
        options: [...new Set([...segment.blank.options, ...acceptedAnswers])],
        acceptedAnswers,
        explain:
          'For example, For instance และ To illustrate มีความหมายเหมือนกันในการนำตัวอย่าง จึงใช้แทนกันได้ทั้งหมด'
      }
    }
  })

const densifyStep = (step: Wgb2Step, promptId: string, usedIds: Set<string>): Wgb2Step => {
  const isIntro = step.role === 'intro'
  const isBody = BODY_ROLES.has(step.role)

  let segments = [...step.segments]
  let kinds = blankKinds(segments)

  if (isBody && !kinds.has('drag')) {
    segments =
      convertTransitionSelectToDrag(segments) ??
      requireInsertion(insertDragBlank(segments, promptId, step.role, usedIds), promptId, step.role, 'drag')
    kinds = blankKinds(segments)
  }

  if ((isIntro || isBody) && !kinds.has('select')) {
    segments = requireInsertion(
      insertSelectBlank(segments, promptId, step.role, usedIds),
      promptId,
      step.role,
      'multiple-choice'
    )
    kinds = blankKinds(segments)
  }

  if ((isIntro || isBody) && !kinds.has('punct')) {
    segments = requireInsertion(
      insertPunctuationBlank(segments, promptId, step.role, usedIds),
      promptId,
      step.role,
      'punctuation'
    )
    kinds = blankKinds(segments)
  }

  if ((isIntro || isBody) && !kinds.has('type')) {
    segments = requireInsertion(
      insertTypeBlank(segments, promptId, step.role, usedIds),
      promptId,
      step.role,
      'fill-in'
    )
  }

  const minimum = isIntro ? INTRO_MINIMUM : isBody ? BODY_MINIMUM : 0
  let addSelectNext = blankKinds(segments).has('select')
  while (blankCount(segments) < minimum) {
    const result = addSelectNext
      ? insertTypeBlank(segments, promptId, step.role, usedIds)
      : insertSelectBlank(segments, promptId, step.role, usedIds)
    segments = requireInsertion(
      result,
      promptId,
      step.role,
      addSelectNext ? 'fill-in' : 'multiple-choice'
    )
    addSelectNext = !addSelectNext
  }

  const extras = [
    { kind: 'type' as const, id: `${promptId}-${step.role}-density-extra-type-1` },
    { kind: 'select' as const, id: `${promptId}-${step.role}-density-extra-select-1` },
    { kind: 'type' as const, id: `${promptId}-${step.role}-density-extra-type-2` },
    { kind: 'select' as const, id: `${promptId}-${step.role}-density-extra-select-2` }
  ]
  for (const extra of extras) {
    if (segments.some((segment) => segment.kind === 'blank' && segment.blank.id === extra.id)) continue
    const result =
      extra.kind === 'type'
        ? insertTypeBlank(segments, promptId, step.role, usedIds, extra.id)
        : insertSelectBlank(segments, promptId, step.role, usedIds, extra.id)
    segments = requireInsertion(result, promptId, step.role, `${extra.kind} density extra`)
  }

  return { ...step, segments: acceptEquivalentExampleLinkers(segments) }
}

export const densifyWritingTask2Exercise = (exercise: Wgb2Exercise): Wgb2Exercise => {
  const usedIds = new Set(
    exercise.steps.flatMap((step) =>
      step.segments.flatMap((segment) => (segment.kind === 'blank' ? [segment.blank.id] : []))
    )
  )
  return {
    ...exercise,
    steps: exercise.steps.map((step) => densifyStep(step, exercise.promptId, usedIds))
  }
}
