/**
 * IELTS word counting treats hyphenated compounds and contractions as one word.
 * Numbers (including percentages and currency figures) count as words.
 */
export const countIeltsWords = (text: string): number =>
  text
    .trim()
    // A grouped or decimal number ("15,000", "6.5", "48,500") is one word, so it
    // has to match before the general word pattern splits it on the separator.
    .match(/\p{N}+(?:[.,]\p{N}+)*|[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu)?.length ?? 0

export const countTask1Paragraphs = (paragraphs: Array<{ text?: string; plainText?: string }>): number =>
  countIeltsWords(paragraphs.map((paragraph) => paragraph.text ?? paragraph.plainText ?? '').join(' '))
