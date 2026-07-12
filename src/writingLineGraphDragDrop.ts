// Drag-and-drop grammar drills for Writing Task 1 Line Graph practice prompts.
// Each exercise is a ~15-blank cloze passage (Intro / Overview / Body 1 / Body 2) built from
// the IELTS Task 1 Timeline essay template, paired with a ~30-word drag bank.
//
// Distractor rule: word-bank distractors for a transition blank are NEVER other legitimate
// safe-list transition words (However, On the other hand, Interestingly, Surprisingly,
// Similarly, It is interesting to note that) — that would create genuine ambiguity. The
// only blanks that accept more than one answer are the "contrast" blanks, whose `answers`
// is `['However', 'On the other hand']`; either is correct there. All other distractors are
// real grammar errors: wrong tense/aspect, wrong participle voice, wrong relative pronoun,
// wrong degree adverb, wrong direction verb.

export type WritingDragDropBlank = {
  id: string
  answers: string[]
  focus:
    | 'verb-tense'
    | 'ving-clause'
    | 'v3-clause'
    | 'which-clause'
    | 'while-whereas'
    | 'transition'
    | 'contrast-transition'
    | 'referencing'
    | 'degree-adverb'
}

export type WritingDragDropSegment =
  | { kind: 'text'; text: string }
  | { kind: 'blank'; blank: WritingDragDropBlank }

export type WritingDragDropLine = {
  id: string
  role: 'intro' | 'overview' | 'body1' | 'body2'
  segments: WritingDragDropSegment[]
}

export type WritingDragDropExercise = {
  id: string
  promptId: string
  instructionsTh: string
  lines: WritingDragDropLine[]
  wordBank: string[]
}

import { WRITING_SNAPSHOT_DRAG_DROP_EXERCISES } from './writingSnapshotDragDrop'
import { WRITING_MIXED_DRAG_DROP_EXERCISES } from './writingMixedDragDrop'
import { WRITING_MAP_DRAG_DROP_EXERCISES } from './writingMapDragDrop'
import { WRITING_PROCESS_DRAG_DROP_EXERCISES } from './writingProcessDragDrop'

const t = (text: string): WritingDragDropSegment => ({ kind: 'text', text })
const b = (id: string, answers: string[], focus: WritingDragDropBlank['focus']): WritingDragDropSegment => ({
  kind: 'blank',
  blank: { id, answers, focus }
})

const INSTRUCTIONS_TH =
  'ลากคำหรือวลีจากคลังคำด้านล่างมาใส่ในช่องว่างให้ถูกต้อง เพื่อฝึกโครงสร้างประโยคซับซ้อน การผันกริยา และการใช้ transition ตามแบบที่เรียนในคลาส'

export const WRITING_LINE_GRAPH_DRAG_DROP_EXERCISES: WritingDragDropExercise[] = [
  // ── Exercise 1: Online learning (single line) ────────────────────────
  {
    id: 'drill-online-learning',
    promptId: 'timeline-online-learning',
    instructionsTh: INSTRUCTIONS_TH,
    lines: [
      {
        id: 'ex1-intro',
        role: 'intro',
        segments: [
          t('The line graph illustrates how the proportion of students '),
          b('ex1-1', ['engaging'], 'ving-clause'),
          t(' with online learning platforms changed over a ten-year period from 2014 to 2024, measured in percentages.')
        ]
      },
      {
        id: 'ex1-overview',
        role: 'overview',
        segments: [
          t('Overall, '),
          b('ex1-2', ['While'], 'while-whereas'),
          t(' the figure '),
          b('ex1-3', ['rose'], 'verb-tense'),
          t(' only gradually up to 2018, growth accelerated considerably thereafter, '),
          b('ex1-4', ['meaning'], 'ving-clause'),
          t(' that usage had nearly quadrupled over the given period.')
        ]
      },
      {
        id: 'ex1-body1',
        role: 'body1',
        segments: [
          t('In 2014, only 18% of students '),
          b('ex1-5', ['made'], 'verb-tense'),
          t(' use of online learning platforms. '),
          b('ex1-6', ['Similarly'], 'transition'),
          t(', this figure climbed to 25% in 2016, before '),
          b('ex1-7', ['rising'], 'ving-clause'),
          t(' further to 34% two years later. '),
          b('ex1-8', ['However', 'On the other hand'], 'contrast-transition'),
          t(', the pace of growth during this early phase was fairly modest compared with what followed, '),
          b('ex1-9', ['which'], 'which-clause'),
          t(' meant that fewer than one in three students had adopted digital learning by 2018.')
        ]
      },
      {
        id: 'ex1-body2',
        role: 'body2',
        segments: [
          t('From 2018 onwards, the proportion of students grew far more rapidly, '),
          b('ex1-10', ['driven'], 'v3-clause'),
          t(' largely by a global shift toward remote study. '),
          b('ex1-11', ['Surprisingly'], 'transition'),
          t(', the figure '),
          b('ex1-12', ['skyrocketed'], 'verb-tense'),
          t(' to 58% in just two years, '),
          b('ex1-13', ['representing'], 'ving-clause'),
          t(' an increase of more than 24 percentage points. By 2022, it had reached 67%, and growth continued at a '),
          b('ex1-14', ['slightly'], 'degree-adverb'),
          t(' more moderate pace before reaching a peak of 74% in 2024. Overall, by the end of the period the percentage of students learning online was significantly higher than '),
          b('ex1-15', ['that'], 'referencing'),
          t(' recorded a decade earlier.')
        ]
      }
    ],
    wordBank: [
      'engaging', 'While', 'rose', 'meaning', 'made', 'Similarly', 'rising',
      'However', 'On the other hand', 'which', 'driven', 'Surprisingly', 'skyrocketed',
      'representing', 'slightly', 'that',
      'engaged', 'engage', 'raised', 'meant', 'means', 'rise', 'risen',
      'it', 'those', 'driving', 'drove', 'plummeted', 'represented', 'dramatically'
    ]
  },

  // ── Exercise 2: Food delivery spending (single line) ─────────────────
  {
    id: 'drill-food-delivery',
    promptId: 'timeline-food-delivery',
    instructionsTh: INSTRUCTIONS_TH,
    lines: [
      {
        id: 'ex2-intro',
        role: 'intro',
        segments: [
          t('The line graph illustrates the average sum of money '),
          b('ex2-1', ['spent'], 'v3-clause'),
          t(' by each person on food delivery every month over a ten-year period from 2014 to 2024, measured in US dollars.')
        ]
      },
      {
        id: 'ex2-overview',
        role: 'overview',
        segments: [
          t('Overall, '),
          b('ex2-2', ['while'], 'while-whereas'),
          t(' spending increased only modestly up to 2018, growth '),
          b('ex2-3', ['accelerated'], 'verb-tense'),
          t(' sharply thereafter, '),
          b('ex2-4', ['meaning'], 'ving-clause'),
          t(' that the figure had increased almost fivefold over the given period.')
        ]
      },
      {
        id: 'ex2-body1',
        role: 'body1',
        segments: [
          t('In 2014, food delivery spending '),
          b('ex2-5', ['amounted'], 'verb-tense'),
          t(' to just $22 per person each month. '),
          b('ex2-6', ['Similarly'], 'transition'),
          t(', this figure rose to $30 in 2016, before '),
          b('ex2-7', ['climbing'], 'ving-clause'),
          t(' further to $45 two years later. '),
          b('ex2-8', ['However', 'On the other hand'], 'contrast-transition'),
          t(', the pace of growth during this early phase remained fairly gradual, '),
          b('ex2-9', ['which'], 'which-clause'),
          t(' meant that spending had roughly doubled but remained modest by 2018.')
        ]
      },
      {
        id: 'ex2-body2',
        role: 'body2',
        segments: [
          t('From 2018 onwards, spending on food delivery grew far more rapidly, '),
          b('ex2-10', ['driven'], 'v3-clause'),
          t(' largely by the convenience of mobile ordering apps. '),
          b('ex2-11', ['Surprisingly'], 'transition'),
          t(', the figure '),
          b('ex2-12', ['skyrocketed'], 'verb-tense'),
          t(' to $78 in just two years, '),
          b('ex2-13', ['representing'], 'ving-clause'),
          t(' an increase of more than $30 within this short period. By 2022, it had reached $96, and growth continued at a '),
          b('ex2-14', ['slightly'], 'degree-adverb'),
          t(' more moderate pace before reaching a peak of $110 in 2024. Overall, by the end of the period average monthly spending on food delivery was significantly higher than '),
          b('ex2-15', ['that'], 'referencing'),
          t(' recorded a decade earlier.')
        ]
      }
    ],
    wordBank: [
      'spent', 'while', 'accelerated', 'meaning', 'amounted', 'Similarly', 'climbing',
      'However', 'On the other hand', 'which', 'driven', 'Surprisingly', 'skyrocketed',
      'representing', 'slightly', 'that',
      'spending', 'accelerate', 'accelerating', 'meant', 'means', 'amount', 'amounts',
      'climbed', 'it', 'driving', 'drove', 'plummeted', 'represented', 'dramatically'
    ]
  },

  // ── Exercise 3: Online shopping in three countries (multi-line) ──────
  {
    id: 'drill-online-shopping-3country',
    promptId: 'timeline-online-shopping-3country',
    instructionsTh: INSTRUCTIONS_TH,
    lines: [
      {
        id: 'ex3-intro',
        role: 'intro',
        segments: [
          t('The line graph illustrates how the percentage of adults who made at least one online purchase per month '),
          b('ex3-1', ['changed'], 'verb-tense'),
          t(' over a ten-year period from 2014 to 2024 in three countries: the UK, the USA, and Australia, measured in percentages.')
        ]
      },
      {
        id: 'ex3-overview',
        role: 'overview',
        segments: [
          t('Overall, '),
          b('ex3-2', ['while'], 'while-whereas'),
          t(' the percentage of adults shopping online rose steadily in all three countries, the USA '),
          b('ex3-3', ['remained'], 'verb-tense'),
          t(' the highest throughout, '),
          b('ex3-4', ['meaning'], 'ving-clause'),
          t(' that it stayed ahead of the UK and Australia over the given period.')
        ]
      },
      {
        id: 'ex3-body1',
        role: 'body1',
        segments: [
          t('In 2014, only 22% of Australian adults '),
          b('ex3-5', ['made'], 'verb-tense'),
          t(' at least one online purchase per month, compared with 28% in the UK and 35% in the USA. '),
          b('ex3-6', ['Similarly'], 'transition'),
          t(', all three figures climbed steadily over the next four years, '),
          b('ex3-7', ['reaching'], 'ving-clause'),
          t(' 44%, 51%, and 58% respectively by 2018. '),
          b('ex3-8', ['However', 'On the other hand'], 'contrast-transition'),
          t(', the USA recorded the highest figure throughout this period, '),
          b('ex3-9', ['followed'], 'v3-clause'),
          t(' by the UK and Australia, respectively.')
        ]
      },
      {
        id: 'ex3-body2',
        role: 'body2',
        segments: [
          t('From 2018 onwards, online shopping '),
          b('ex3-10', ['continued'], 'verb-tense'),
          t(' to grow rapidly across all three countries, '),
          b('ex3-11', ['driven'], 'v3-clause'),
          t(' largely by the expansion of mobile payment systems. '),
          b('ex3-12', ['Interestingly'], 'transition'),
          t(', Australia recorded the fastest growth of the three, '),
          b('ex3-13', ['narrowing'], 'ving-clause'),
          t(' the gap with the USA from 13 percentage points in 2014 to just 5 points by 2024. By 2022, the figures for the UK and the USA stood at 79% and 83% respectively, '),
          b('ex3-14', ['which'], 'which-clause'),
          t(' were both considerably higher than that of Australia at 76%. Overall, by 2024 the USA remained the highest of the three at 89%, '),
          b('ex3-15', ['slightly'], 'degree-adverb'),
          t(' ahead of the UK at 86% and Australia at 84%.')
        ]
      }
    ],
    wordBank: [
      'changed', 'while', 'remained', 'meaning', 'made', 'Similarly', 'reaching',
      'However', 'On the other hand', 'followed', 'continued', 'driven', 'Interestingly',
      'narrowing', 'which', 'slightly',
      'change', 'changing', 'remain', 'meant', 'make', 'reached', 'following',
      'continuing', 'driving', 'drove', 'it', 'those', 'dramatically', 'narrowed'
    ]
  },

  // ── Exercise 4: Social media use in four regions (multi-line) ────────
  {
    id: 'drill-social-media-4region',
    promptId: 'timeline-social-media-4region',
    instructionsTh: INSTRUCTIONS_TH,
    lines: [
      {
        id: 'ex4-intro',
        role: 'intro',
        segments: [
          t('The line graph illustrates how the percentage of people '),
          b('ex4-1', ['using'], 'ving-clause'),
          t(' social media platforms changed over a fourteen-year period from 2010 to 2024 in four regions: North America, Europe, Asia-Pacific, and Latin America, measured in percentages.')
        ]
      },
      {
        id: 'ex4-overview',
        role: 'overview',
        segments: [
          t('Overall, '),
          b('ex4-2', ['while'], 'while-whereas'),
          t(' social media use increased across all four regions, North America '),
          b('ex4-3', ['remained'], 'verb-tense'),
          t(' the highest throughout, '),
          b('ex4-4', ['leaving'], 'ving-clause'),
          t(' Asia-Pacific in last place despite recording by far the fastest growth over the given period.')
        ]
      },
      {
        id: 'ex4-body1',
        role: 'body1',
        segments: [
          t('In 2010, only 15% of people in Asia-Pacific '),
          b('ex4-5', ['used'], 'verb-tense'),
          t(' social media platforms, compared with 48% in North America. '),
          b('ex4-6', ['Similarly'], 'transition'),
          t(', the figures for Europe and Latin America stood at 38% and 28% respectively that year, both '),
          b('ex4-7', ['trailing'], 'ving-clause'),
          t(' considerably behind North America. '),
          b('ex4-8', ['However', 'On the other hand'], 'contrast-transition'),
          t(', all four regions saw steady growth over the following eight years, '),
          b('ex4-9', ['which'], 'which-clause'),
          t(' brought North America to 75%, Europe to 65%, Latin America to 62%, and Asia-Pacific to 52% by 2018.')
        ]
      },
      {
        id: 'ex4-body2',
        role: 'body2',
        segments: [
          t('From 2018 onwards, growth '),
          b('ex4-10', ['continued'], 'verb-tense'),
          t(' in every region, '),
          b('ex4-11', ['driven'], 'v3-clause'),
          t(' largely by the increasing availability of affordable smartphones. '),
          b('ex4-12', ['Interestingly'], 'transition'),
          t(', Asia-Pacific recorded the sharpest rise of the four regions, '),
          b('ex4-13', ['narrowing'], 'ving-clause'),
          t(' the gap with North America from 33 percentage points in 2010 to just 12 points by 2024. By 2022, North America and Europe stood at 83% and 74% respectively, '),
          b('ex4-14', ['both of which'], 'which-clause'),
          t(' were higher than that of Latin America at 72%. Overall, by 2024 North America remained the highest of the four regions at 85%, '),
          b('ex4-15', ['slightly'], 'degree-adverb'),
          t(' ahead of Europe at 77%, Latin America at 75%, and Asia-Pacific at 73%.')
        ]
      }
    ],
    wordBank: [
      'using', 'while', 'remained', 'leaving', 'used', 'Similarly', 'trailing',
      'However', 'On the other hand', 'which', 'continued', 'driven', 'Interestingly',
      'narrowing', 'both of which', 'slightly',
      'use', 'uses', 'remain', 'left', 'leave', 'trailed', 'trail',
      'it', 'those', 'continuing', 'driving', 'drove', 'both of them', 'dramatically'
    ]
  }
]

export const getWritingDragDropExercise = (promptId: string) =>
  [
    ...WRITING_LINE_GRAPH_DRAG_DROP_EXERCISES,
    ...WRITING_SNAPSHOT_DRAG_DROP_EXERCISES,
    ...WRITING_MIXED_DRAG_DROP_EXERCISES,
    ...WRITING_MAP_DRAG_DROP_EXERCISES,
    ...WRITING_PROCESS_DRAG_DROP_EXERCISES
  ].find((exercise) => exercise.promptId === promptId) || null
