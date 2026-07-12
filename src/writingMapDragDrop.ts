// Drag-and-drop grammar drill for Writing Task 1 "Map" practice prompts.
// Same engine and conventions as writingMixedDragDrop.ts / writingSnapshotDragDrop.ts, adapted
// to the map template taught in class: change-verb vocabulary (was demolished, was constructed,
// was transformed, was replaced, was relocated) PLUS positional language (adjacent to, in the
// north/southwest, elsewhere) drilled together, grounded in the town-centre before/after layout.
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

export const WRITING_MAP_DRAG_DROP_EXERCISES: WritingDragDropExercise[] = [
  // ── Exercise 1: Town centre redevelopment, 2005-2025 ──
  {
    id: 'drill-town-centre-map',
    promptId: 'map-town-centre',
    instructionsTh: INSTRUCTIONS_TH,
    lines: [
      {
        id: 'map1-intro',
        role: 'intro',
        segments: [
          t('The two maps '),
          b('map1-1', ['illustrate'], 'verb-tense'),
          t(
            ' changes to the layout of a town centre between 2005 and 2025: its shopping, industrial, and recreational areas were all substantially redeveloped.'
          )
        ]
      },
      {
        id: 'map1-overview',
        role: 'overview',
        segments: [
          t('Overall, the most significant changes took place in the northern half of the town, '),
          b('map1-2', ['while'], 'while-whereas'),
          t(' the southwest retained exactly the same footprint despite a complete change of use. '),
          b('map1-3', ['Elsewhere'], 'transition'),
          t(', several central facilities were relocated to new positions.')
        ]
      },
      {
        id: 'map1-body1',
        role: 'body1',
        segments: [
          t('In the northwest, the shopping mall '),
          b('map1-4', ['was demolished'], 'verb-tense'),
          t(' and '),
          b('map1-5', ['replaced by'], 'v3-clause'),
          t(' residential housing, '),
          b('map1-6', ['whereas'], 'while-whereas'),
          t(' in the northeast a civic centre '),
          b('map1-7', ['was constructed'], 'verb-tense'),
          t(' in place of the former car park.')
        ]
      },
      {
        id: 'map1-body2',
        role: 'body2',
        segments: [
          t('The industrial zone in the southwest '),
          b('map1-8', ['was transformed'], 'verb-tense'),
          t(' into a tech park '),
          b('map1-9', ['occupying'], 'ving-clause'),
          t(' the same plot of land. '),
          b('map1-10', ['Meanwhile'], 'transition'),
          t(', the market '),
          b('map1-11', ['was replaced'], 'verb-tense'),
          t(' by a library, and the adjacent open space '),
          b('map1-12', ['was relocated'], 'verb-tense'),
          t(' to the southeast, where it now forms a park '),
          b('map1-13', ['adjacent to'], 'referencing'),
          t(' the new library.')
        ]
      }
    ],
    wordBank: [
      'illustrate', 'while', 'Elsewhere', 'was demolished', 'replaced by', 'whereas',
      'was constructed', 'was transformed', 'occupying', 'Meanwhile', 'was replaced',
      'was relocated', 'adjacent to',
      'illustrates', 'although', 'Moreover', 'demolished', 'replacing', 'because',
      'constructed', 'transforming', 'occupied', 'Similarly', 'replaces', 'relocating',
      'adjacent with'
    ]
  }
]
