// Drag-and-drop grammar drill for Writing Task 1 "Mixed Chart" practice prompts.
// Same engine and conventions as writingSnapshotDragDrop.ts / writingLineGraphDragDrop.ts, adapted
// to the mixed template taught in class: Intro = paraphrase + colon-list; Overview = blended
// proportion + trend language ("at the midst of the two"); Body 1 covers the proportion-type
// sub-charts (pie + table) with highest/lowest data only, compacted to 2 sentences; Body 2 covers
// the timeline-type sub-chart (bar chart) as a compacted beginning...end narrative, not a
// year-by-year account, also 2 sentences.
//
// Distractor rule (same as the other drills): a blank's distractors are real grammar errors
// (wrong verb form, wrong agreement) or plausible-but-wrong connectors — never a legitimate
// synonym that is also the correct answer for a different blank in this exercise.

import type { WritingDragDropBlank, WritingDragDropExercise, WritingDragDropSegment } from './writingLineGraphDragDrop'

const t = (text: string): WritingDragDropSegment => ({ kind: 'text', text })
const b = (id: string, answers: string[], focus: WritingDragDropBlank['focus']): WritingDragDropSegment => ({
  kind: 'blank',
  blank: { id, answers, focus }
})

const INSTRUCTIONS_TH =
  'ลากคำหรือวลีจากคลังคำด้านล่างมาใส่ในช่องว่างให้ถูกต้อง เพื่อฝึกโครงสร้างประโยคซับซ้อน การผันกริยา และการใช้ transition ตามแบบที่เรียนในคลาส'

export const WRITING_MIXED_DRAG_DROP_EXERCISES: WritingDragDropExercise[] = [
  // ── Exercise 1: Riverside Language School (pie + table + bar chart) ──
  {
    id: 'drill-riverside-language-school',
    promptId: 'mixed-riverside-language-school',
    instructionsTh: INSTRUCTIONS_TH,
    lines: [
      {
        id: 'mix1-intro',
        role: 'intro',
        segments: [
          t('The three charts '),
          b('mix1-1', ['illustrate'], 'verb-tense'),
          t(
            ' Riverside Language School’s 2023 student profile and its enrolment trends between 2014 and 2023: student nationality, course enrolments, and total intake over time.'
          )
        ]
      },
      {
        id: 'mix1-overview',
        role: 'overview',
        segments: [
          t('Overall, Chinese students '),
          b('mix1-2', ['made up'], 'verb-tense'),
          t(' the largest proportion of the student body, '),
          b('mix1-3', ['while', 'whereas'], 'while-whereas'),
          t(' General English emerged as the most popular course. Total enrolments, '),
          b('mix1-4', ['meanwhile'], 'transition'),
          t(' followed a fluctuating trend over the decade, '),
          b('mix1-5', ['falling'], 'ving-clause'),
          t(' sharply in 2020 before '),
          b('mix1-6', ['recovering'], 'ving-clause'),
          t(' to reach a new peak by 2023.')
        ]
      },
      {
        id: 'mix1-body1',
        role: 'body1',
        segments: [
          t('In terms of nationality, Chinese students '),
          b('mix1-7', ['accounted for'], 'verb-tense'),
          t(' the largest share of the intake at 32%, '),
          b('mix1-8', ['followed'], 'v3-clause'),
          t(' by Japanese students at 21%, while Korean students '),
          b('mix1-9', ['represented'], 'verb-tense'),
          t(
            ' the smallest group at just 9%. Regarding course enrolments, General English and the Summer Intensive course '
          ),
          b('mix1-10', ['registered'], 'verb-tense'),
          t(' the highest and lowest numbers of students, at 420 and 150, '),
          b('mix1-11', ['respectively'], 'referencing'),
          t('.')
        ]
      },
      {
        id: 'mix1-body2',
        role: 'body2',
        segments: [
          t('Turning to the bar chart, total enrolments '),
          b('mix1-12', ['climbed'], 'verb-tense'),
          t(' steadily from 640 in 2014 to a peak of 950 in 2019, before '),
          b('mix1-13', ['plummeting'], 'ving-clause'),
          t(' to just 310 in 2020. '),
          b('mix1-14', ['Thereafter'], 'transition'),
          t(', numbers '),
          b('mix1-15', ['rebounded'], 'verb-tense'),
          t(' strongly, eventually '),
          b('mix1-16', ['reaching'], 'ving-clause'),
          t(' a new high of 1,100 by 2023 — the highest figure recorded across the entire ten-year period.')
        ]
      }
    ],
    wordBank: [
      'illustrate', 'made up', 'while', 'whereas', 'meanwhile', 'falling', 'recovering',
      'accounted for', 'followed', 'represented', 'registered', 'respectively',
      'climbed', 'plummeting', 'Thereafter', 'rebounded', 'reaching',
      'illustrates', 'making up', 'nevertheless', 'fell', 'recovered', 'accounts for',
      'following', 'representing', 'registering', 'individually', 'climbing',
      'plummeted', 'Therefore', 'rebounding', 'reached'
    ]
  }
]
