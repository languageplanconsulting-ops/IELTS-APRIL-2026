const LISTENING_TEXT_NORMALIZE_PATTERN = /[\u2018\u2019\u201C\u201D"'`´.:,;!?()[\]{}–—-]/g

export const normalizeListeningHighlightText = (value: string) =>
  String(value || '')
    .toLowerCase()
    .replace(LISTENING_TEXT_NORMALIZE_PATTERN, ' ')
    .replace(/\s+/g, ' ')
    .trim()

export const buildListeningHighlightCandidates = (answer: string) => {
  const rawVariants = String(answer || '')
    .split('/')
    .map((item) => item.trim())
    .filter(Boolean)

  const expanded = new Set<string>()
  rawVariants.forEach((variant) => {
    expanded.add(variant)
    expanded.add(variant.replace(/\(s\)/gi, 's'))
    expanded.add(variant.replace(/\(s\)/gi, ''))
  })

  return [...expanded]
    .map((item) => normalizeListeningHighlightText(item))
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
}

/** Longest contiguous slice of `expected` that appears inside `selected`, as a ratio of expected length. */
export const getListeningEvidenceOverlapRatio = (selectedRaw: string, expectedRaw: string) => {
  const selected = normalizeListeningHighlightText(selectedRaw)
  const expected = normalizeListeningHighlightText(expectedRaw)
  if (!selected || !expected) return 0
  if (selected === expected) return 1
  if (expected.includes(selected)) return selected.length / expected.length
  if (selected.includes(expected)) return 1

  let bestLength = 0
  const minWindow = Math.min(8, expected.length)

  for (let start = 0; start < expected.length; start += 1) {
    for (let end = expected.length; end > start; end -= 1) {
      const windowLength = end - start
      if (windowLength < minWindow && bestLength >= minWindow) break
      const slice = expected.slice(start, end)
      if (selected.includes(slice) && windowLength > bestLength) {
        bestLength = windowLength
        break
      }
    }
  }

  return bestLength / expected.length
}

export type ListeningHighlightMatchKind = 'exact' | 'partial' | 'none'

export const getListeningHighlightMatch = (
  selectedRaw: string,
  expectedRaw: string,
  minOverlap = 0.5
): ListeningHighlightMatchKind => {
  const normalizedSelected = normalizeListeningHighlightText(selectedRaw)
  if (!normalizedSelected) return 'none'

  const candidates = buildListeningHighlightCandidates(expectedRaw)
  const targets =
    candidates.length > 0 ? candidates : [normalizeListeningHighlightText(expectedRaw)].filter(Boolean)

  if (targets.length === 0) return 'none'

  let bestOverlap = 0
  for (const target of targets) {
    if (normalizedSelected === target) return 'exact'
    bestOverlap = Math.max(bestOverlap, getListeningEvidenceOverlapRatio(normalizedSelected, target))
  }

  if (bestOverlap >= minOverlap) return 'partial'
  return 'none'
}

export const isListeningHighlightMatch = (
  selectedRaw: string,
  expectedRaw: string,
  minOverlap = 0.5
) => getListeningHighlightMatch(selectedRaw, expectedRaw, minOverlap) !== 'none'
