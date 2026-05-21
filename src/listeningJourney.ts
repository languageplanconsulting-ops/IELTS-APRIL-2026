import type { ListeningFoundationCategory, ListeningFoundationSet } from './listeningFoundationData'

export type ListeningSkillTrack = 'part1-detail' | 'part2-mc' | 'part34-advanced'

export type ListeningPart34Subcategory = 'skill-practice' | 'cambridge-exam'

export const LISTENING_JOURNEY_TITLE = 'Listening Practice'

export const LISTENING_JOURNEY_LEAD =
  'IELTS Listening ไม่ได้วัดแค่ว่า “ฟังออกไหม” แต่แต่ละ part วัดคนละทักษะ'

export const LISTENING_JOURNEY_BAND_GOALS = [
  {
    target: '5.5',
    advice: 'ให้เริ่มจาก Part 1 ก่อน เพราะต้องเก็บคะแนนง่ายจากชื่อ เวลา ราคา สถานที่ และคำตอบสั้น ๆ ให้แม่น'
  },
  {
    target: '6.0–6.5',
    advice:
      'ให้ฝึก Multiple Choice เพราะข้อสอบมักหลอกด้วยคำที่ได้ยินจริง แต่ไม่ใช่คำตอบจริง'
  },
  {
    target: '7.0+',
    advice:
      'ให้ฝึก Advanced Listening เพราะต้องตามความเห็นของผู้พูดใน Part 3 และฟัง lecture ยาว ๆ ใน Part 4 ให้ทัน'
  }
] as const

export const LISTENING_SKILL_CARDS = [
  {
    track: 'part1-detail' as const,
    title: 'Part 1: Detail Accuracy',
    subtitle: 'ฝึกจับคำตอบสั้น ๆ เช่น ชื่อ สถานที่ ราคา เวลา และข้อมูลทั่วไป',
    detail: 'เหมาะกับคนที่ฟังออกแต่เขียนผิด พลาดตัวเลข หรือสะกดผิด'
  },
  {
    track: 'part2-mc' as const,
    title: 'Part 2: Multiple Choice',
    subtitle: 'ฝึกแยกคำตอบจริงออกจาก distractor',
    detail: 'เหมาะกับคนที่ฟังรู้เรื่อง แต่เลือกช้อยส์ผิดเพราะเห็นคำที่ได้ยินในตัวเลือก'
  },
  {
    track: 'part34-advanced' as const,
    title: 'Part 3–4: Advanced Listening',
    subtitle: 'ฝึก discussion และ lecture ยาว ๆ',
    detail: 'เหมาะกับคนที่อยากได้ 6.5+ และต้องการฝึกตามความเห็น เหตุผล ข้อสรุป และการเติมคำจาก lecture'
  }
] as const

export const LISTENING_SKILL_TRACK_LABELS: Record<ListeningSkillTrack, string> = {
  'part1-detail': 'Part 1: Detail Accuracy',
  'part2-mc': 'Part 2: Multiple Choice',
  'part34-advanced': 'Part 3–4: Advanced Listening'
}

export const LISTENING_SKILL_TRACK_DESCRIPTIONS: Record<ListeningSkillTrack, string> = {
  'part1-detail':
    'ฝึกจับคำตอบสั้น ๆ เช่น ชื่อ สถานที่ ราคา เวลา และข้อมูลทั่วไป · เหมาะกับเป้า Band 5.5',
  'part2-mc':
    'ฝึกแยกคำตอบจริงออกจาก distractor ด้วย Cambridge Section 2 · เหมาะกับเป้า Band 6.0–6.5',
  'part34-advanced':
    'ฝึก discussion ใน Part 3 และ lecture ใน Part 4 · เหมาะกับเป้า Band 7.0+'
}

export const LISTENING_PART34_SUBCATEGORY_LABELS: Record<ListeningPart34Subcategory, string> = {
  'skill-practice': 'Skill Practice',
  'cambridge-exam': 'Cambridge exam'
}

export const LISTENING_PART34_SUBCATEGORY_DESCRIPTIONS: Record<ListeningPart34Subcategory, string> = {
  'skill-practice':
    'Part 3 dialogue + Part 4 lecture แบบฝึกเฉพาะทาง · ฟัง script, highlight evidence, ตอบ MCQ',
  'cambridge-exam':
    'Cambridge Section 3–4 จากชุด Vocabulary Foundation เดิม · จัดตาม book → test → section'
}

export const foundationCategoryForPart34Subcategory = (
  subcategory: ListeningPart34Subcategory
): ListeningFoundationCategory =>
  subcategory === 'cambridge-exam' ? 'advanced' : 'advanced-listening'

export const filterFoundationSetsForSkillTrack = (
  sets: ListeningFoundationSet[],
  track: ListeningSkillTrack,
  part34Subcategory: ListeningPart34Subcategory = 'skill-practice'
) => {
  if (track === 'part1-detail') return sets.filter((set) => set.category === 'part1-detail')
  if (track === 'part2-mc') return sets.filter((set) => set.category === 'essential')
  if (track === 'part34-advanced') {
    return sets.filter((set) => set.category === foundationCategoryForPart34Subcategory(part34Subcategory))
  }
  return []
}

export const countFoundationSetsForTrack = (
  sets: ListeningFoundationSet[],
  track: ListeningSkillTrack
): number => {
  if (track === 'part1-detail') return sets.filter((set) => set.category === 'part1-detail').length
  if (track === 'part2-mc') return sets.filter((set) => set.category === 'essential').length
  if (track === 'part34-advanced') {
    return sets.filter((set) => set.category === 'advanced-listening' || set.category === 'advanced').length
  }
  return 0
}
