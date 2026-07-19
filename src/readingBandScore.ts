/**
 * Official IELTS Academic Reading raw-score (out of 40) to band conversion.
 * Source: Cambridge IELTS Academic Reading scoring tables.
 */
const ACADEMIC_READING_BAND_TABLE: Array<{ min: number; band: number }> = [
  { min: 39, band: 9 },
  { min: 37, band: 8.5 },
  { min: 35, band: 8 },
  { min: 33, band: 7.5 },
  { min: 30, band: 7 },
  { min: 27, band: 6.5 },
  { min: 23, band: 6 },
  { min: 19, band: 5.5 },
  { min: 15, band: 5 },
  { min: 13, band: 4.5 },
  { min: 10, band: 4 },
  { min: 8, band: 3.5 },
  { min: 6, band: 3 },
  { min: 4, band: 2.5 }
]

export const readingRawToBand = (raw: number): number => {
  const clamped = Math.max(0, Math.min(40, Math.round(raw)))
  for (const row of ACADEMIC_READING_BAND_TABLE) {
    if (clamped >= row.min) return row.band
  }
  return 2
}

/**
 * Band estimate for a partial exam (e.g. journey 26Q), scaled to the 40-question
 * Academic Reading table. Labelled an estimate in the UI.
 */
export const estimateReadingBand = (correct: number, total: number): number => {
  if (total <= 0) return 2
  return readingRawToBand((correct / total) * 40)
}

export const formatReadingBand = (band: number): string =>
  Number.isInteger(band) ? `${band}.0` : `${band}`
