import type { ListeningFoundationCategory, ListeningFoundationSet } from './listeningFoundationData'

export type ListeningSkillTrack = 'part1-detail' | 'part2-mc' | 'part34-advanced'

export const LISTENING_JOURNEY_TITLE = 'Listening Practice'

export const LISTENING_JOURNEY_LEAD =
  'IELTS Listening ไม่ได้วัดแค่ว่า “ฟังออกไหม” แต่แต่ละ part วัดคนละทักษะ — ฝึกทีละทักษะด้วยชุด Cambridge จริง แล้วค่อยลง Full Test'

export const LISTENING_JOURNEY_BAND_GOALS = [
  {
    target: '5.5',
    advice:
      'ให้เริ่มจาก Part 1 ก่อน เพราะต้องเก็บคะแนนง่ายจากชื่อ เวลา ราคา สถานที่ และคำตอบสั้น ๆ ให้แม่น'
  },
  {
    target: '6.0–6.5',
    advice:
      'ให้ฝึก Multiple Choice ใน Part 2 เพราะข้อสอบมักหลอกด้วยคำที่ได้ยินจริง แต่ไม่ใช่คำตอบจริง'
  },
  {
    target: '7.0+',
    advice:
      'ให้ฝึก Cambridge Part 3–4 เพราะต้องตามความเห็นของผู้พูดใน discussion และฟัง lecture ยาว ๆ ให้ทัน'
  }
] as const

export const LISTENING_SKILL_CARDS = [
  {
    track: 'part1-detail' as const,
    title: 'Part 1: Detail Accuracy',
    subtitle: 'Cambridge Section 1 · เติมคำสั้น ๆ',
    detail: 'ฝึกจับชื่อ สถานที่ ราคา เวลา และข้อมูลทั่วไป — เหมาะกับคนที่ฟังออกแต่เขียนผิด'
  },
  {
    track: 'part2-mc' as const,
    title: 'Part 2: Multiple Choice',
    subtitle: 'Cambridge Section 2 · แยกคำตอบจาก distractor',
    detail: 'เหมาะกับคนที่ฟังรู้เรื่อง แต่เลือกช้อยส์ผิดเพราะเห็นคำที่ได้ยินในตัวเลือก'
  },
  {
    track: 'part34-advanced' as const,
    title: 'Part 3–4: Discussion & Lecture',
    subtitle: 'Cambridge Section 3–4 · academic listening',
    detail: 'ฝึกตามความเห็น เหตุผล ข้อสรุป และการเติมคำจาก lecture — เหมาะกับเป้า 6.5+'
  }
] as const

export const LISTENING_SKILL_TRACK_LABELS: Record<ListeningSkillTrack, string> = {
  'part1-detail': 'Part 1: Detail Accuracy',
  'part2-mc': 'Part 2: Multiple Choice',
  'part34-advanced': 'Part 3–4: Discussion & Lecture'
}

export const LISTENING_SKILL_TRACK_DESCRIPTIONS: Record<ListeningSkillTrack, string> = {
  'part1-detail':
    'ฝึกจับคำตอบสั้น ๆ เช่น ชื่อ สถานที่ ราคา เวลา และข้อมูลทั่วไป · Cambridge Section 1 · เหมาะกับเป้า Band 5.5',
  'part2-mc':
    'ฝึกแยกคำตอบจริงออกจาก distractor ด้วย Cambridge Section 2 · เหมาะกับเป้า Band 6.0–6.5',
  'part34-advanced':
    'ฝึก discussion ใน Section 3 และ lecture ใน Section 4 จาก Cambridge · เหมาะกับเป้า Band 7.0+'
}

export const foundationCategoryForSkillTrack = (
  track: ListeningSkillTrack
): ListeningFoundationCategory => {
  if (track === 'part1-detail') return 'part1-detail'
  if (track === 'part2-mc') return 'essential'
  return 'advanced'
}

export const filterFoundationSetsForSkillTrack = (
  sets: ListeningFoundationSet[],
  track: ListeningSkillTrack
) => {
  const category = foundationCategoryForSkillTrack(track)
  return sets.filter((set) => set.category === category)
}

export const countFoundationSetsForTrack = (
  sets: ListeningFoundationSet[],
  track: ListeningSkillTrack
): number => filterFoundationSetsForSkillTrack(sets, track).length
