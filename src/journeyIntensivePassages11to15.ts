/**
 * Normal Reading Journey ด่าน 12–15 — mixed-format intensive passages.
 */
import type { IntensivePassageLayout } from './intensivePassageBuilder.ts'
import { INTENSIVE_LAYOUTS_STAGE_11 } from './journeyIntensivePassages11.ts'
import { INTENSIVE_LAYOUTS_STAGE_12 } from './journeyIntensivePassages12.ts'
import { INTENSIVE_LAYOUTS_STAGE_13 } from './journeyIntensivePassages13.ts'
import { INTENSIVE_LAYOUTS_STAGE_14 } from './journeyIntensivePassages14.ts'
import { INTENSIVE_LAYOUTS_STAGE_15 } from './journeyIntensivePassages15.ts'

export const INTENSIVE_LAYOUTS_STAGE_11_15: Record<number, [IntensivePassageLayout, IntensivePassageLayout]> = {
  ...INTENSIVE_LAYOUTS_STAGE_11,
  ...INTENSIVE_LAYOUTS_STAGE_12,
  ...INTENSIVE_LAYOUTS_STAGE_13,
  ...INTENSIVE_LAYOUTS_STAGE_14,
  ...INTENSIVE_LAYOUTS_STAGE_15
}
