import type { Wgb2Focus } from './writingTask2Builder'

/**
 * Real-word fallbacks used when a blank cannot be filled to four options from
 * the answer's own word family. Task 2 tests grammar and word choice, so a
 * filler must always be a genuine English word — never an invented form.
 */
const FILLERS_BY_FOCUS: Partial<Record<Wgb2Focus, string[]>> = {
  adverb: ['clearly', 'largely', 'rapidly', 'strongly', 'gradually', 'broadly'],
  adjective: ['significant', 'essential', 'practical', 'valuable', 'common', 'limited'],
  noun: ['benefit', 'concern', 'factor', 'outcome', 'resource', 'standard'],
  'verb-tense': ['provides', 'provided', 'providing', 'requires', 'required', 'requiring'],
  plural: ['issues', 'benefits', 'resources', 'outcomes', 'factors', 'standards'],
  participle: ['growing', 'rising', 'improved', 'developed', 'increasing', 'reduced']
}

const GENERAL_FILLERS = [
  'alternative',
  'general',
  'specific',
  'possible',
  'necessary',
  'effective',
  'relevant',
  'reasonable'
]

/** Flat list of every filler — seeds the real-word lexicon build. */
export const WGB2_OPTION_FILLERS: string[] = [
  ...GENERAL_FILLERS,
  ...Object.values(FILLERS_BY_FOCUS).flat()
]

/** Fillers to try for a blank, most plausible first. */
export const getWgb2OptionFillers = (focus?: Wgb2Focus): string[] => [
  ...((focus && FILLERS_BY_FOCUS[focus]) || []),
  ...GENERAL_FILLERS
]
