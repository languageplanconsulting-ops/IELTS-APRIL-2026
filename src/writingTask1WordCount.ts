/**
 * IELTS word counting treats hyphenated compounds and contractions as one word.
 * Numbers (including percentages and currency figures) count as words.
 */
export const countIeltsWords = (text: string): number =>
  text
    .trim()
    .match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu)?.length ?? 0

export const countTask1Paragraphs = (paragraphs: Array<{ text?: string; plainText?: string }>): number =>
  countIeltsWords(paragraphs.map((paragraph) => paragraph.text ?? paragraph.plainText ?? '').join(' '))
