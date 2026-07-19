import type { WgbSegment } from './writingGuidedBuilder'

/**
 * Every Task 1 Overview opens with the same taught frame:
 * "Overall, it can be clearly observed that …".
 *
 * Lives in its own leaf module (types only) so writingGuidedBuilder, the extra
 * builders and the map exercises can all use it without an import cycle.
 * Returns three blanks, so an Overview reaches the five-blank minimum with only
 * two more of its own.
 */
export const overviewOpener = (idPrefix: string): WgbSegment[] => [
  {
    kind: 'blank',
    blank: {
      kind: 'select',
      id: `${idPrefix}-ov0`,
      options: ['Overall', 'Firstly', 'For example'],
      answer: 'Overall',
      focus: 'transition',
      explain:
        'Overview ต้องเปิดด้วย Overall เสมอ ส่วน Firstly (ลำดับแรก) และ For example (ยกตัวอย่าง) ใช้กับ body ไม่ใช่ภาพรวม'
    }
  },
  { kind: 'text', text: ', it can be ' },
  {
    kind: 'blank',
    blank: {
      kind: 'select',
      id: `${idPrefix}-ov1`,
      options: ['clearly', 'clear', 'clearance'],
      answer: 'clearly',
      focus: 'degree-adverb',
      explain: 'ต้องใช้ adverb (clearly) ขยายกริยา observed ส่วน clear เป็น adjective และ clearance เป็นคำนาม'
    }
  },
  { kind: 'text', text: ' ' },
  {
    kind: 'blank',
    blank: {
      kind: 'type',
      id: `${idPrefix}-ov2`,
      base: 'observe',
      answers: ['observed'],
      focus: 'v3-clause',
      explain: 'โครงสร้าง passive: can be + V3 จึงใช้ observed'
    }
  },
  { kind: 'text', text: ' that ' }
]
