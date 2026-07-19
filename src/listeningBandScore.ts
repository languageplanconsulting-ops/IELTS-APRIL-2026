/**
 * Official IELTS Listening raw-score (out of 40) to band conversion.
 * Source: Cambridge IELTS scoring tables (Academic & GT listening share one table).
 */
const LISTENING_BAND_TABLE: Array<{ min: number; band: number }> = [
  { min: 39, band: 9 },
  { min: 37, band: 8.5 },
  { min: 35, band: 8 },
  { min: 32, band: 7.5 },
  { min: 30, band: 7 },
  { min: 26, band: 6.5 },
  { min: 23, band: 6 },
  { min: 18, band: 5.5 },
  { min: 16, band: 5 },
  { min: 13, band: 4.5 },
  { min: 10, band: 4 },
  { min: 8, band: 3.5 },
  { min: 6, band: 3 },
  { min: 4, band: 2.5 }
]

export const listeningRawToBand = (raw: number): number => {
  const clamped = Math.max(0, Math.min(40, Math.round(raw)))
  for (const row of LISTENING_BAND_TABLE) {
    if (clamped >= row.min) return row.band
  }
  return 2
}

/**
 * Band estimate for a partial exercise (e.g. one 10-question section), scaled to
 * the 40-question exam. Labelled an estimate in the UI because real banding only
 * exists for a full test.
 */
export const estimateListeningBand = (correct: number, total: number): number => {
  if (total <= 0) return 2
  return listeningRawToBand((correct / total) * 40)
}

export const formatBand = (band: number): string => (Number.isInteger(band) ? `${band}.0` : `${band}`)
