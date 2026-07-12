// Drag-and-drop grammar drill for Writing Task 1 "Process Diagram" practice prompts.
// Same engine and conventions as writingMixedDragDrop.ts / writingMapDragDrop.ts, adapted
// to the process template taught in class: passive voice for each stage, sequencing/transition
// language ("once", "after which", "subsequently") to link stages, and -ing/v3 reduced clauses
// for simultaneous or immediately-following actions.
//
// Distractor rule (same as the other drills): a blank's distractors are real grammar errors
// (wrong voice, wrong verb form) or plausible-but-wrong connectors — never a legitimate
// synonym that is also the correct answer for a different blank in this exercise.

import type { WritingDragDropBlank, WritingDragDropExercise, WritingDragDropSegment } from './writingLineGraphDragDrop'

const t = (text: string): WritingDragDropSegment => ({ kind: 'text', text })
const b = (id: string, answers: string[], focus: WritingDragDropBlank['focus']): WritingDragDropSegment => ({
  kind: 'blank',
  blank: { id, answers, focus }
})

const INSTRUCTIONS_TH =
  'ลากคำหรือวลีจากคลังคำด้านล่างมาใส่ในช่องว่างให้ถูกต้อง เพื่อฝึกโครงสร้างประโยคซับซ้อน การผันกริยา และการใช้ transition ตามแบบที่เรียนในคลาส'

export const WRITING_PROCESS_DRAG_DROP_EXERCISES: WritingDragDropExercise[] = [
  // ── Exercise 1: How Instant Coffee is Produced (8 stages) ──
  {
    id: 'drill-instant-coffee',
    promptId: 'process-instant-coffee',
    instructionsTh: INSTRUCTIONS_TH,
    lines: [
      {
        id: 'proc1-intro',
        role: 'intro',
        segments: [
          t('The diagram '),
          b('proc1-1', ['illustrates'], 'verb-tense'),
          t(' the process by which instant coffee is produced, from the harvesting of coffee cherries to the packaging of the final product.')
        ]
      },
      {
        id: 'proc1-overview',
        role: 'overview',
        segments: [
          t('Overall, the process '),
          b('proc1-2', ['consists of'], 'verb-tense'),
          t(' eight main stages, '),
          b('proc1-3', ['beginning'], 'ving-clause'),
          t(' with the harvesting of ripe coffee cherries and ending with the packaging of instant coffee granules.')
        ]
      },
      {
        id: 'proc1-body1',
        role: 'body1',
        segments: [
          t('First, ripe coffee cherries '),
          b('proc1-4', ['are picked'], 'verb-tense'),
          t(' by hand or machine before '),
          b('proc1-5', ['being pulped'], 'ving-clause'),
          t(' to remove the outer skin and flesh. The beans are then '),
          b('proc1-6', ['spread out'], 'verb-tense'),
          t(' and dried in the sun for several days, '),
          b('proc1-7', ['after which'], 'which-clause'),
          t(' they '),
          b('proc1-8', ['are roasted'], 'verb-tense'),
          t(' at a high temperature.')
        ]
      },
      {
        id: 'proc1-body2',
        role: 'body2',
        segments: [
          b('proc1-9', ['Once'], 'transition'),
          t(' roasted, the beans '),
          b('proc1-10', ['are ground'], 'verb-tense'),
          t(' into a fine powder and '),
          b('proc1-11', ['dissolved'], 'v3-clause'),
          t(' in hot water to extract a coffee concentrate. '),
          b('proc1-12', ['Subsequently'], 'transition'),
          t(', this liquid is spray-dried into fine granules, which '),
          b('proc1-13', ['are then packaged'], 'verb-tense'),
          t(' into jars, '),
          b('proc1-14', ['marking'], 'ving-clause'),
          t(' the end of the production process.')
        ]
      }
    ],
    wordBank: [
      'illustrates', 'consists of', 'beginning', 'are picked', 'being pulped', 'spread out',
      'after which', 'are roasted', 'Once', 'are ground', 'dissolved', 'Subsequently',
      'are then packaged', 'marking',
      'illustrate', 'consist of', 'begins', 'is picked', 'pulped', 'spreading out',
      'which', 'is roasted', 'When', 'is ground', 'dissolving', 'Consequently',
      'is then packaged', 'marked'
    ]
  }
]
