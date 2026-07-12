// Drag-and-drop grammar drills for Writing Task 1 "No Timeline" (pie / bar / table) practice prompts.
// Same engine and conventions as writingLineGraphDragDrop.ts, adapted to the snapshot template:
// Intro = paraphrase + colon-list; Overview = proportion vocab + one while/whereas contrast blank;
// Body 1 / Body 2 each open with one categorizing transition (Starting with / In terms of /
// Beginning with / With regard to) and cover exactly one main idea.
//
// Distractor rule (same as the timeline drill): a blank's distractors are real grammar errors
// (wrong verb form, wrong agreement, wrong preposition) — never a legitimate synonym that is
// also the correct answer for a different blank. The only dual-accept blanks are the
// while/whereas contrast blank and, where used, the However/On the other hand pair.

import type { WritingDragDropBlank, WritingDragDropExercise, WritingDragDropSegment } from './writingLineGraphDragDrop'

const t = (text: string): WritingDragDropSegment => ({ kind: 'text', text })
const b = (id: string, answers: string[], focus: WritingDragDropBlank['focus']): WritingDragDropSegment => ({
  kind: 'blank',
  blank: { id, answers, focus }
})

const INSTRUCTIONS_TH =
  'ลากคำหรือวลีจากคลังคำด้านล่างมาใส่ในช่องว่างให้ถูกต้อง เพื่อฝึกโครงสร้างประโยคซับซ้อน การผันกริยา และการใช้ transition ตามแบบที่เรียนในคลาส'

export const WRITING_SNAPSHOT_DRAG_DROP_EXERCISES: WritingDragDropExercise[] = [
  // ── Exercise 1: Vietnam ↔ US exports (2 pies) ─────────────────────────
  {
    id: 'drill-vietnam-us-exports',
    promptId: 'snapshot-vietnam-us-exports',
    instructionsTh: INSTRUCTIONS_TH,
    lines: [
      {
        id: 'snap1-intro',
        role: 'intro',
        segments: [
          t('The two pie charts '),
          b('snap1-1', ['illustrate'], 'verb-tense'),
          t(' the value of exports flowing between two countries: Vietnam and the United States, in 2023, measured in US dollars.')
        ]
      },
      {
        id: 'snap1-overview',
        role: 'overview',
        segments: [
          t('Overall, coffee '),
          b('snap1-2', ['accounted for'], 'verb-tense'),
          t(' the largest proportion of Vietnam’s exports to the US, '),
          b('snap1-3', ['whereas', 'while'], 'while-whereas'),
          t(' aircraft parts '),
          b('snap1-4', ['made up'], 'verb-tense'),
          t(' the largest share of US exports to Vietnam, with each category '),
          b('snap1-5', ['representing'], 'ving-clause'),
          t(' over 40% of its respective total.')
        ]
      },
      {
        id: 'snap1-body1',
        role: 'body1',
        segments: [
          t('Starting with Vietnam’s exports to the US, coffee was the leading category, '),
          b('snap1-6', ['followed'], 'v3-clause'),
          t(' by fruit and vegetables, '),
          b('snap1-7', ['which'], 'which-clause'),
          t(' together accounted for almost three-quarters of the total. Seafood and rice '),
          b('snap1-8', ['constituted'], 'verb-tense'),
          t(' broadly similar shares, at 4.4% and 4.3% '),
          b('snap1-9', ['respectively'], 'referencing'),
          t(', while garments and other goods made up the smallest proportions, at just 2% each.')
        ]
      },
      {
        id: 'snap1-body2',
        role: 'body2',
        segments: [
          t('In terms of US exports to Vietnam, aircraft parts '),
          b('snap1-10', ['represented'], 'verb-tense'),
          t(' the largest category by far, worth $72 million, more than double the value of machinery in second place at $30.5 million. Fertiliser and cotton '),
          b('snap1-11', ['ranked'], 'verb-tense'),
          t(' next in size, worth $16.5 million and $12 million '),
          b('snap1-12', ['in turn'], 'referencing'),
          t(', while cars made up the smallest specific category at just $6 million. '),
          b('snap1-13', ['However', 'On the other hand'], 'contrast-transition'),
          t(', the residual ‘other’ category was still sizeable, '),
          b('snap1-14', ['accounting for'], 'ving-clause'),
          t(' more than a fifth of total export value.')
        ]
      }
    ],
    wordBank: [
      'illustrate', 'accounted for', 'whereas', 'while', 'made up', 'representing',
      'followed', 'which', 'constituted', 'respectively', 'represented', 'ranked',
      'in turn', 'However', 'On the other hand', 'accounting for',
      'illustrates', 'accounts for', 'making up', 'to represent', 'following', 'that',
      'constitute', 'individually', 'represent', 'ranks', 'in return', 'account of'
    ]
  },

  // ── Exercise 2: UK vs Thailand household spending (grouped bar) ──────
  {
    id: 'drill-uk-thailand-spending',
    promptId: 'snapshot-uk-thailand-spending',
    instructionsTh: INSTRUCTIONS_TH,
    lines: [
      {
        id: 'snap2-intro',
        role: 'intro',
        segments: [
          t('The bar chart '),
          b('snap2-1', ['compares'], 'verb-tense'),
          t(' average household spending across five categories: food, transport, housing, healthcare, and leisure, in the UK and Thailand in 2023, measured as a percentage of total spending.')
        ]
      },
      {
        id: 'snap2-overview',
        role: 'overview',
        segments: [
          t('Overall, housing '),
          b('snap2-2', ['accounted for'], 'verb-tense'),
          t(' the largest proportion of spending in the UK, '),
          b('snap2-3', ['whereas', 'while'], 'while-whereas'),
          t(' food '),
          b('snap2-4', ['represented'], 'verb-tense'),
          t(' the largest share of spending in Thailand, with healthcare '),
          b('snap2-5', ['constituting'], 'ving-clause'),
          t(' the smallest proportion in both countries.')
        ]
      },
      {
        id: 'snap2-body1',
        role: 'body1',
        segments: [
          t('Beginning with the UK, housing '),
          b('snap2-6', ['was'], 'verb-tense'),
          t(' the largest category at 28%, '),
          b('snap2-7', ['followed'], 'v3-clause'),
          t(' by food at 18% and transport at 14%. Leisure '),
          b('snap2-8', ['made up'], 'verb-tense'),
          t(' a moderate 15% of spending, while healthcare '),
          b('snap2-9', ['comprised'], 'verb-tense'),
          t(' the smallest proportion at just 12%.')
        ]
      },
      {
        id: 'snap2-body2',
        role: 'body2',
        segments: [
          t('With regard to Thailand, food '),
          b('snap2-10', ['emerged as'], 'verb-tense'),
          t(' the leading category, '),
          b('snap2-11', ['accounting for'], 'ving-clause'),
          t(' 25% of total household spending, considerably higher than the equivalent figure in the UK. Housing and transport '),
          b('snap2-12', ['held'], 'verb-tense'),
          t(' the next largest shares, at 22% and 18% '),
          b('snap2-13', ['respectively'], 'referencing'),
          t(', while healthcare again represented the smallest proportion, at just 8%. Leisure spending, '),
          b('snap2-14', ['meanwhile'], 'transition'),
          t(', was slightly lower in Thailand than in the UK, at 10% compared with 15%.')
        ]
      }
    ],
    wordBank: [
      'compares', 'accounted for', 'whereas', 'while', 'represented', 'constituting',
      'was', 'followed', 'made up', 'comprised', 'emerged as', 'accounting for',
      'held', 'respectively', 'meanwhile',
      'compare', 'accounts for', 'represents', 'constitutes', 'were', 'following',
      'making up', 'comprising', 'emerging as', 'accountable for', 'holding',
      'individually', 'nevertheless'
    ]
  },

  // ── Exercise 3: Germany vs Australia electricity generation (2 pies) ─
  {
    id: 'drill-germany-australia-energy',
    promptId: 'snapshot-germany-australia-energy',
    instructionsTh: INSTRUCTIONS_TH,
    lines: [
      {
        id: 'snap3-intro',
        role: 'intro',
        segments: [
          t('The two pie charts '),
          b('snap3-1', ['depict'], 'verb-tense'),
          t(' the sources of electricity generation in Germany and Australia: renewables, coal, gas, nuclear, and other sources, in 2020.')
        ]
      },
      {
        id: 'snap3-overview',
        role: 'overview',
        segments: [
          t('Overall, renewables '),
          b('snap3-2', ['made up'], 'verb-tense'),
          t(' the largest proportion of electricity generation in Germany, '),
          b('snap3-3', ['whereas', 'while'], 'while-whereas'),
          t(' coal '),
          b('snap3-4', ['remained'], 'verb-tense'),
          t(' the dominant source in Australia, '),
          b('snap3-5', ['representing'], 'ving-clause'),
          t(' more than half of the country’s total output.')
        ]
      },
      {
        id: 'snap3-body1',
        role: 'body1',
        segments: [
          t('In terms of Germany, renewables '),
          b('snap3-6', ['was'], 'verb-tense'),
          t(' the leading source at 44%, '),
          b('snap3-7', ['followed'], 'v3-clause'),
          t(' by coal at 25% and gas at 16%. The ‘other’ category '),
          b('snap3-8', ['accounted for'], 'verb-tense'),
          t(' a modest 9% of the total, while nuclear power '),
          b('snap3-9', ['constituted'], 'verb-tense'),
          t(' the smallest share at just 6%.')
        ]
      },
      {
        id: 'snap3-body2',
        role: 'body2',
        segments: [
          t('Beginning with Australia, coal '),
          b('snap3-10', ['stood as'], 'verb-tense'),
          t(' by far the dominant source, '),
          b('snap3-11', ['making up'], 'ving-clause'),
          t(' more than half of total electricity generation at 52%. Gas '),
          b('snap3-12', ['held'], 'verb-tense'),
          t(' the second largest share at 22%, while renewables contributed a further 21%. Other sources '),
          b('snap3-13', ['contributed'], 'verb-tense'),
          t(' the remaining 5%.')
        ]
      }
    ],
    wordBank: [
      'depict', 'made up', 'whereas', 'while', 'remained', 'representing',
      'was', 'followed', 'accounted for', 'constituted', 'stood as', 'making up',
      'held', 'contributed',
      'depicts', 'makes up', 'remains', 'represented', 'were', 'following',
      'accounts for', 'constitute', 'standing as', 'make up', 'holding', 'contributing'
    ]
  },

  // ── Exercise 4: Five universities across four indicators (table) ─────
  {
    id: 'drill-universities-table',
    promptId: 'snapshot-universities-table',
    instructionsTh: INSTRUCTIONS_TH,
    lines: [
      {
        id: 'snap4-intro',
        role: 'intro',
        segments: [
          t('The table '),
          b('snap4-1', ['presents'], 'verb-tense'),
          t(' data on five universities — Oxford, MIT, the University of Sydney, Chulalongkorn University, and Seoul National University — across four indicators: research output, student satisfaction, graduate employment, and the percentage of international students, in 2024.')
        ]
      },
      {
        id: 'snap4-overview',
        role: 'overview',
        segments: [
          t('Overall, Oxford '),
          b('snap4-2', ['recorded'], 'verb-tense'),
          t(' the highest level of research output among the five institutions, '),
          b('snap4-3', ['whereas', 'while'], 'while-whereas'),
          t(' MIT '),
          b('snap4-4', ['emerged as'], 'verb-tense'),
          t(' the top performer in terms of student satisfaction and graduate employment. '),
          b('snap4-5', ['Meanwhile'], 'transition'),
          t(', Chulalongkorn University recorded the lowest figures across every indicator.')
        ]
      },
      {
        id: 'snap4-body1',
        role: 'body1',
        segments: [
          t('Starting with research output, Oxford '),
          b('snap4-6', ['was'], 'verb-tense'),
          t(' the clear leader, with a score of 48,500, '),
          b('snap4-7', ['followed'], 'v3-clause'),
          t(' by MIT at 42,000. Seoul National University and the University of Sydney '),
          b('snap4-8', ['produced'], 'verb-tense'),
          t(' considerably smaller outputs, at 22,100 and 18,200 '),
          b('snap4-9', ['respectively'], 'referencing'),
          t(', while Chulalongkorn recorded just 4,300 — the lowest of the five. In terms of student satisfaction, MIT '),
          b('snap4-10', ['achieved'], 'verb-tense'),
          t(' the highest rating at 91%, narrowly ahead of Oxford at 87%.')
        ]
      },
      {
        id: 'snap4-body2',
        role: 'body2',
        segments: [
          t('With regard to graduate employment, MIT again led the field, '),
          b('snap4-11', ['posting'], 'ving-clause'),
          t(' a rate of 97%, '),
          b('snap4-12', ['yet'], 'contrast-transition'),
          t(' Oxford followed closely at 94%. Chulalongkorn '),
          b('snap4-13', ['reported'], 'verb-tense'),
          t(' the lowest employment rate of the five, at just 82%. Turning to international students, Oxford '),
          b('snap4-14', ['registered'], 'verb-tense'),
          t(' the highest proportion at 42%, '),
          b('snap4-15', ['in contrast'], 'transition'),
          t(', Chulalongkorn recorded the smallest share, at only 12%.')
        ]
      }
    ],
    wordBank: [
      'presents', 'recorded', 'whereas', 'while', 'emerged as', 'Meanwhile',
      'was', 'followed', 'produced', 'respectively', 'achieved',
      'posting', 'yet', 'reported', 'registered', 'in contrast',
      'present', 'records', 'emerging as', 'Nevertheless', 'were', 'following',
      'producing', 'individually', 'achieving', 'posted', 'still', 'reporting',
      'registering', 'contrast'
    ]
  }
]
