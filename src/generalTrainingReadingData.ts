export type GeneralTrainingReadingSection = 1 | 2 | 3

export type GeneralTrainingReadingView = 'hub' | 'section' | 'full-test'

export const GENERAL_TRAINING_READING_LABEL = 'General Training Reading'

export const GENERAL_TRAINING_READING_LEAD =
  'IELTS General Training Reading — ฝึกแยก Section หรือทำ Full Test 40 ข้อใน 60 นาที เนื้อหาใกล้ชีวิตจริง ไม่ใช่บทความวิชาการ'

export const GENERAL_TRAINING_READING_OVERVIEW_TH =
  'IELTS General Training (GT) ออกแบบสำหรับผู้ที่ต้องการย้ายถิ่น ทำงาน หรือเรียนต่อระดับที่ไม่ใช่ปริญญา ข้อสอบ Reading มี 3 Section · 40 ข้อ · 60 นาที เนื้อหาเน้นข้อความในชีวิตประจำวัน ที่ทำงาน และการอ่านทั่วไป — ต่างจาก Academic Reading ที่ใช้บทความวิชาการยาว'

export const GENERAL_TRAINING_SECTIONS: Array<{
  section: GeneralTrainingReadingSection
  title: string
  subtitle: string
  questionRange: string
  detailTh: string
  skillFocus: string
}> = [
  {
    section: 1,
    title: 'Section 1',
    subtitle: 'Social Survival · การอยู่รอดในสังคม',
    questionRange: '≈ 14 ข้อ',
    skillFocus: 'Notices · Ads · Timetables · Short texts',
    detailTh:
      'Section 1 ทดสอบทักษะ "Social Survival" — อ่านข้อความสั้น ๆ ในชีวิตประจำวัน เช่น ประกาศ โฆษณา ตารางเวลา จดหมายแจ้งผู้ปกครอง หรือรีวิวสินค้า มักมี 2 ข้อความสั้นรวมประมาณ 14 ข้อ โจทย์ยอดนิยม: TRUE/FALSE/NOT GIVEN, จับคู่ข้อความกับหัวข้อ A–G, หรือเลือกตัวเลือกที่ตรงกับข้อความ'
  },
  {
    section: 2,
    title: 'Section 2',
    subtitle: 'Workplace Survival · การอยู่รอดในที่ทำงาน',
    questionRange: '≈ 13 ข้อ',
    skillFocus: 'Job ads · Workplace policies · Training',
    detailTh:
      'Section 2 เน้น "Workplace Survival" — เอกสารที่เกี่ยวกับที่ทำงาน เช่น ประกาศรับสมัคร นโยบายบริษัท คู่มือความปลอดภัย สวัสดิการพนักงาน มักมี 2 ข้อความรวมประมาณ 13 ข้อ โจทย์ยอดนิยม: เติมคำในช่องว่าง (NO MORE THAN TWO/THREE WORDS), ตอบคำถามสั้น ๆ, หรือเรียงขั้นตอน/flow chart'
  },
  {
    section: 3,
    title: 'Section 3',
    subtitle: 'General Reading · การอ่านเชิงทั่วไป',
    questionRange: '≈ 13 ข้อ',
    skillFocus: 'Longer passage · MCQ · Headings · Summary',
    detailTh:
      'Section 3 ใกล้เคียง Academic Passage 3 — เป็นบทความยาว 1 เรื่อง (มักมีย่อหน้า A–G) ประมาณ 13 ข้อ โจทย์ยอดนิยม: จับคู่หัวข้อ (Matching Headings), หา information ในย่อหน้า, สรุปข้อความ (Summary), และ Multiple Choice ต้องใช้ทักษะ skimming/scanning มากขึ้น'
  }
]

export const GENERAL_TRAINING_FULL_TEST_DETAIL_TH =
  'Full Test คือการทำครบ 3 Section · 40 ข้อ ในครั้งเดียว เหมือนวันสอบจริง Section 1–2 ใช้เวลาน้อยกว่า Section 3 — แนะนำให้จับเวลา Section 1 ≈ 17 นาที · Section 2 ≈ 20 นาที · Section 3 ≈ 23 นาที'

export const GENERAL_TRAINING_FULL_TEST_NUMBERS = [17, 1, 2, 5, 7] as const

export const formatGeneralTrainingTestLabel = (testNumber: number) =>
  `Practice Test ${String(testNumber).padStart(2, '0')}`
