/**
 * One consistent way to read a saved Notebook entry, so every surface — the
 * card display and the revision game — agrees on what the "headline" of an
 * entry is and what plays second fiddle.
 *
 * The teacher's priority rule:
 *   - VOCABULARY  → the English word/phrase leads; the Thai meaning follows.
 *   - GRAMMAR     → the rule/topic leads; the corrected instance follows.
 *   - PARAPHRASE  → the two equivalent phrasings (side A ↔ side B).
 *
 * New saves carry explicit `noteKind` / `primaryText` / `secondaryText`. Older
 * saves (and any site that hasn't been migrated) are inferred from the flat
 * `criterion` / `quote` / `fix` / `thaiMeaning` fields so the game and the
 * prioritized display still work on historical data.
 */

export type NotebookNoteKind = 'vocabulary' | 'grammar' | 'paraphrase' | 'report' | 'note'

export type NotebookFacetSource = {
  criterion?: string
  quote?: string
  fix?: string
  thaiMeaning?: string
  noteKind?: NotebookNoteKind
  primaryText?: string
  secondaryText?: string
  savedReportSnapshot?: unknown
}

export type NotebookFacets = {
  kind: NotebookNoteKind
  /** vocab: English word · grammar: rule/topic · paraphrase: side A */
  primary: string
  /** vocab: Thai meaning · grammar: corrected instance · paraphrase: side B */
  secondary: string
  /** Thai gloss, when the entry carries one separately from `secondary`. */
  thai: string
}

const clean = (value: unknown) => String(value ?? '').trim()

/** "Use B2: reduce" / "Use ADVANCED: X" → the bare word. */
const stripVocabPrefix = (value: string) =>
  value.replace(/^\s*use\s+[a-z0-9+.\-]+\s*:\s*/i, '').trim()

/** Drop a leading "Q12:" style question tag. */
const stripQuestionTag = (value: string) => value.replace(/^\s*q\s*\d+\s*[:.]\s*/i, '').trim()

/** "X = ความหมาย" → ["X", "ความหมาย"] */
const splitEquals = (value: string): [string, string] => {
  const index = value.indexOf('=')
  if (index < 0) return [value.trim(), '']
  return [value.slice(0, index).trim(), value.slice(index + 1).trim()]
}

/**
 * Listening paraphrase saves flatten to a multiline `fix`:
 *   วิธี: …
 *   Audioscript: <passage wording>
 *   ในคำถาม: <question wording>
 *   = <thai>
 *   <explanation>
 * Pull the two English sides back out when present.
 */
const readParaphraseSidesFromFix = (fix: string): { audio: string; question: string } => {
  const lines = fix.split('\n').map((line) => line.trim())
  let audio = ''
  let question = ''
  for (const line of lines) {
    const audioMatch = line.match(/^(?:audioscript|passage)\s*:\s*(.+)$/i)
    if (audioMatch) audio = audioMatch[1].trim()
    const questionMatch = line.match(/^(?:ในคำถาม|question|in the question)\s*:\s*(.+)$/i)
    if (questionMatch) question = questionMatch[1].trim()
  }
  return { audio, question }
}

export function deriveNotebookFacets(entry: NotebookFacetSource): NotebookFacets {
  if (entry.savedReportSnapshot) {
    return { kind: 'report', primary: '', secondary: '', thai: '' }
  }

  const explicitPrimary = clean(entry.primaryText)
  const explicitSecondary = clean(entry.secondaryText)
  if (entry.noteKind && (explicitPrimary || explicitSecondary)) {
    return {
      kind: entry.noteKind,
      primary: explicitPrimary,
      secondary: explicitSecondary,
      thai: clean(entry.thaiMeaning) || explicitSecondary
    }
  }

  const criterion = clean(entry.criterion).toLowerCase()
  const quote = clean(entry.quote)
  const fix = clean(entry.fix)
  const thai = clean(entry.thaiMeaning)

  if (/vocab/.test(criterion)) {
    let word = stripVocabPrefix(fix)
    if (!word || word.length > 60) word = stripQuestionTag(quote) || word
    let meaning = thai
    if (meaning.includes('=')) {
      const [, right] = splitEquals(meaning)
      meaning = right || meaning
    }
    return { kind: 'vocabulary', primary: word, secondary: meaning, thai: meaning }
  }

  if (/paraphrase|clue/.test(criterion)) {
    const sides = readParaphraseSidesFromFix(fix)
    const question = sides.question || stripQuestionTag(quote)
    const audio = sides.audio || (fix.includes('\n') ? '' : fix)
    // side A = question wording (what the learner reads), side B = source wording.
    const [maybeA, maybeB] = fix.includes('=') && !fix.includes('\n') ? splitEquals(fix) : ['', '']
    const primary = question || maybeA
    const secondary = audio || maybeB
    return { kind: 'paraphrase', primary, secondary, thai }
  }

  if (/grammar|referencing|fluency|mistake/.test(criterion)) {
    return { kind: 'grammar', primary: fix || quote, secondary: quote, thai }
  }

  return { kind: 'note', primary: fix || quote, secondary: thai, thai }
}

export type RevisionItem = {
  id: string
  kind: 'vocabulary' | 'paraphrase'
  /** Shown on the left column (English word / paraphrase A). */
  left: string
  /** Shown on the right column (Thai meaning / paraphrase B). */
  right: string
  section: string
}

const capLength = (value: string, max: number) => (value.length > max ? '' : value)

/**
 * Turn the whole notebook into the two matching-game pools. Only entries with
 * a clean, non-empty pair on both sides qualify, so the game never shows a
 * blank tile. Duplicates (same pair) are collapsed.
 */
export function collectRevisionItems(
  entries: Array<NotebookFacetSource & { id: string; section?: string; customSectionName?: string }>
): { vocabulary: RevisionItem[]; paraphrase: RevisionItem[] } {
  const vocabulary: RevisionItem[] = []
  const paraphrase: RevisionItem[] = []
  const seen = new Set<string>()

  for (const entry of entries) {
    const facets = deriveNotebookFacets(entry)
    const section = clean(entry.customSectionName) || clean(entry.section) || 'notebook'

    if (facets.kind === 'vocabulary') {
      const left = capLength(facets.primary, 80)
      const right = capLength(facets.secondary, 120)
      if (!left || !right) continue
      const key = `v:${left.toLowerCase()}|${right.toLowerCase()}`
      if (seen.has(key)) continue
      seen.add(key)
      vocabulary.push({ id: entry.id, kind: 'vocabulary', left, right, section })
    } else if (facets.kind === 'paraphrase') {
      const left = capLength(facets.primary, 140)
      const right = capLength(facets.secondary, 140)
      if (!left || !right || left.toLowerCase() === right.toLowerCase()) continue
      const key = `p:${left.toLowerCase()}|${right.toLowerCase()}`
      if (seen.has(key)) continue
      seen.add(key)
      paraphrase.push({ id: entry.id, kind: 'paraphrase', left, right, section })
    }
  }

  return { vocabulary, paraphrase }
}
