// Curriculum data for the Academic Writing course.
//
// Source: the IELTS ACADEMIC WRITING - INTENSIVE course on Thinkific (course id
// 1576306), pulled from the published curriculum on 2026-07-24. 12 published
// chapters, 93 lessons, ~1,970 minutes of video. Draft/unpublished lessons on
// Thinkific (e.g. "วิธีเขียน Conclusion") are intentionally excluded — students
// can't see them there either.
//
// `tier` drives sequencing, not visibility: every lesson is eventually shown to
// every student, tier just decides the order.
//   1 = core     — the method video for its question type. Always comes first,
//                  so every plan (even the fastest) reaches full coverage of
//                  every question type before touching anything else.
//   2 = reinforce — a second worked example, or a Cambridge-test walkthrough.
//   3 = extend    — topic-bank practice: same method, new topic.
// `priority` breaks ties within tier 2/3 (lower goes first).

import BUNNY_VIDEO_IDS from './bunnyVideoIds.json'

export type CourseArea = 'foundation' | 'task1' | 'task2' | 'exam'

export type QuestionTypeId =
  | 'basics'
  | 't1_intro'
  | 't1_line'
  | 't1_pie'
  | 't1_bar'
  | 't1_table'
  | 't1_process'
  | 't1_map'
  | 't1_mixed'
  | 't2_intro'
  | 't2_double'
  | 't2_advdis'
  | 't2_twe'
  | 't2_dbv'
  | 't2_topics'
  | 'exam'

export type QuestionTypeMeta = {
  id: QuestionTypeId
  label: string
  area: CourseArea
  /** Shown in the "จุดที่ทำสำเร็จแล้ว" mastery grid. Foundation/topic-bank/exam buckets are tracked but not graded as a distinct exam question type. */
  isGradedType: boolean
  /** Stand-in thumbnail until real video poster frames exist. */
  thumbnailEmoji: string
}

export const QUESTION_TYPES: QuestionTypeMeta[] = [
  { id: 'basics', label: 'ไวยากรณ์พื้นฐาน', area: 'foundation', isGradedType: false, thumbnailEmoji: '🔤' },
  { id: 't1_intro', label: 'Task 1 พื้นฐาน', area: 'task1', isGradedType: false, thumbnailEmoji: '📋' },
  { id: 't1_line', label: 'Line Graph', area: 'task1', isGradedType: true, thumbnailEmoji: '📈' },
  { id: 't1_pie', label: 'Pie Chart', area: 'task1', isGradedType: true, thumbnailEmoji: '🥧' },
  { id: 't1_bar', label: 'Bar Chart', area: 'task1', isGradedType: true, thumbnailEmoji: '📊' },
  { id: 't1_table', label: 'Table', area: 'task1', isGradedType: true, thumbnailEmoji: '🔢' },
  { id: 't1_process', label: 'Process Diagram', area: 'task1', isGradedType: true, thumbnailEmoji: '⚙️' },
  { id: 't1_map', label: 'Map', area: 'task1', isGradedType: true, thumbnailEmoji: '🗺️' },
  { id: 't1_mixed', label: 'โจทย์ผสม (Mixed Charts)', area: 'task1', isGradedType: false, thumbnailEmoji: '🧩' },
  { id: 't2_intro', label: 'Task 2 พื้นฐาน', area: 'task2', isGradedType: false, thumbnailEmoji: '💡' },
  { id: 't2_double', label: 'Double Question', area: 'task2', isGradedType: true, thumbnailEmoji: '❓' },
  { id: 't2_advdis', label: 'Advantages & Disadvantages', area: 'task2', isGradedType: true, thumbnailEmoji: '⚖️' },
  { id: 't2_twe', label: 'To What Extent', area: 'task2', isGradedType: true, thumbnailEmoji: '🎯' },
  { id: 't2_dbv', label: 'Discuss Both Views', area: 'task2', isGradedType: true, thumbnailEmoji: '🗣️' },
  { id: 't2_topics', label: 'คลังหัวข้อ Task 2', area: 'task2', isGradedType: false, thumbnailEmoji: '📚' },
  { id: 'exam', label: 'ข้อสอบจำลอง', area: 'exam', isGradedType: false, thumbnailEmoji: '🏁' }
]

export const QUESTION_TYPE_BY_ID: Record<QuestionTypeId, QuestionTypeMeta> = QUESTION_TYPES.reduce(
  (map, type) => {
    map[type.id] = type
    return map
  },
  {} as Record<QuestionTypeId, QuestionTypeMeta>
)

/** The 10 question types a real exam can ask — every study plan reaches all of these no matter how little time the student has. */
export const GRADED_QUESTION_TYPES = QUESTION_TYPES.filter((type) => type.isGradedType)

export type CourseLesson = {
  id: string
  chapterIndex: number
  chapterName: string
  area: CourseArea
  title: string
  minutes: number
  tier: 1 | 2 | 3
  priority: number
  questionType: QuestionTypeId
  band75Only?: boolean
  /** Bunny Stream video GUID, once the lesson's video has been migrated off Thinkific. */
  bunnyVideoId?: string
}

type RawLesson = [title: string, minutes: number, tier: 1 | 2 | 3, priority: number, questionType: QuestionTypeId, band75Only?: true]

type RawChapter = { name: string; area: CourseArea; lessons: RawLesson[] }

const RAW_CHAPTERS: RawChapter[] = [
  {
    name: '1 · Writing Basics',
    area: 'foundation',
    lessons: [
      ['สรุปเทคนิคทางลัดการได้ Writing Band 7', 16, 1, 0, 'basics'],
      ['เทคนิคการทำ Complex Structures for Band 7', 43, 1, 0, 'basics'],
      ['เทคนิคการทำ complex structure (ต่อ)', 15, 2, 10, 'basics'],
      ['สรุป Transitional words (Connective Devices)', 10, 1, 0, 'basics'],
      ['สูตรลัดเรื่อง Tense for Band 7', 25, 1, 0, 'basics'],
      ['เทคนิคการทำ Referencing for Band 7', 24, 1, 0, 'basics'],
      ['การขยายคำนาม and mistakes to avoid', 18, 2, 10, 'basics']
    ]
  },
  {
    name: '2 · Task 1 โจทย์มีตัวเลข',
    area: 'task1',
    lessons: [
      ['รู้จัก Task 1', 9, 1, 0, 't1_intro'],
      ['คำศัพท์ใช้อธิบายข้อมูล', 9, 1, 0, 't1_intro'],
      ['การใช้ Article (a/an/the)', 16, 2, 11, 't1_intro'],
      ['Line Graph — Step by Step', 41, 1, 0, 't1_line'],
      ['โจทย์ LINE GRAPH', 33, 2, 11, 't1_line'],
      ['โจทย์ Line Graph (2)', 21, 3, 20, 't1_line'],
      ['Task 1 vocab (quiz)', 0, 1, 0, 't1_intro'],
      ['line graph เขียนพร้อมกัน', 39, 1, 0, 't1_line'],
      ['การรับมือกับโจทย์ตัวเลขเยอะๆ', 25, 2, 12, 't1_line'],
      ['Line Graph 2 อัน', 29, 2, 13, 't1_line'],
      ['แบบฝึกหัด Line Graph', 0, 1, 0, 't1_line'],
      ['โจทย์ Pie Chart', 17, 1, 0, 't1_pie'],
      ['เขียน Pie chart พร้อมกัน', 30, 2, 11, 't1_pie'],
      ['เพื่อความเข้าใจ Pie Chart (quiz)', 0, 1, 0, 't1_pie'],
      ['วิธีการเขียน Bar chart : PART 1', 18, 1, 0, 't1_bar'],
      ['วิธีทำ Bar chart PART 2', 16, 1, 0, 't1_bar'],
      ['การเขียน Bar chart (1)', 25, 2, 12, 't1_bar'],
      ['โจทย์ Bar Chart', 18, 3, 20, 't1_bar'],
      ['โจทย์ Table', 16, 1, 0, 't1_table']
    ]
  },
  {
    name: '3 · Task 1 โจทย์ไม่มีตัวเลข',
    area: 'task1',
    lessons: [
      ['โจทย์ Process Diagram', 29, 1, 0, 't1_process'],
      ['โจทย์ Process Diagram (1)', 15, 2, 12, 't1_process'],
      ['วิธีคิดโจทย์ Process Diagram (BAND 7.5+)', 17, 3, 22, 't1_process', true],
      ['คำศัพท์ เทคนิค & วิธีคิดโจทย์ MAP', 25, 1, 0, 't1_map'],
      ['โจทย์ Map', 17, 2, 12, 't1_map'],
      ['QUIZ เรื่อง MAP + Process Diagram', 0, 1, 0, 't1_process']
    ]
  },
  {
    name: '4 · ฝึกทำโจทย์ Task 1',
    area: 'task1',
    lessons: [
      ['โจทย์ผสม : Bar chart + line graph', 16, 2, 15, 't1_mixed'],
      ['โจทย์ผสม Bar chart + pie chart', 17, 3, 24, 't1_mixed'],
      ['Pie chart + table', 26, 3, 24, 't1_mixed'],
      ['Pie chart + bar chart', 25, 3, 24, 't1_mixed'],
      ['Summary — Checklist for Band 7 (write along)', 28, 1, 0, 't1_intro'],
      ['แบบฝึกหัด', 0, 1, 0, 't1_mixed']
    ]
  },
  {
    name: '5 · อธิบาย Task 2',
    area: 'task2',
    lessons: [
      ['พื้นฐาน Task 2', 41, 1, 0, 't2_intro'],
      ['พื้นฐาน Task 2 (2)', 17, 1, 0, 't2_intro'],
      ['เทคนิคหาไอเดียและคำศัพท์ (Lexical Resource)', 39, 1, 0, 't2_intro'],
      ['โจทย์ Double Question', 53, 1, 0, 't2_double'],
      ['Double Question (Advanced) for band 7.5+', 38, 3, 21, 't2_double', true],
      ['ฝึก double question', 0, 1, 0, 't2_double'],
      ['โจทย์ Disadvantages & advantages', 37, 1, 0, 't2_advdis'],
      ['โจทย์ Nationalism (Patriotism)', 29, 2, 13, 't2_advdis'],
      ['แบบฝึกหัด Disadvantages / advantages', 0, 1, 0, 't2_advdis'],
      ['การเขียน To what extent', 47, 1, 0, 't2_twe'],
      ['แบบฝึกหัด to what extent', 0, 1, 0, 't2_twe'],
      ['โจทย์ Discuss both views and give your own opinion', 49, 1, 0, 't2_dbv'],
      ['ฝึก discuss both views', 0, 1, 0, 't2_dbv'],
      ['โจทย์ To what extent ล่าสุด (2025)', 24, 2, 11, 't2_twe']
    ]
  },
  {
    name: '6 · Task 2 Art / Culture / Society',
    area: 'task2',
    lessons: [
      ['โจทย์ 25 Feb — Nuclear weapons', 39, 3, 26, 't2_twe'],
      ['แบบฝึกหัดเกี่ยวกับ Nuclear', 0, 3, 26, 't2_twe'],
      ['โจทย์เกี่ยวกับ Gender Equality', 32, 2, 16, 't2_topics'],
      ['โจทย์ To what extent (Relationship)', 41, 3, 26, 't2_twe'],
      ['โจทย์ To What Extent', 17, 3, 26, 't2_twe'],
      ['ตัวอย่างโจทย์ Equality (quiz)', 0, 3, 26, 't2_topics'],
      ['โจทย์เกี่ยวกับสิทธิสัตว์ Animal Rights', 36, 3, 26, 't2_topics'],
      ['Exercise : energy (quiz)', 0, 3, 26, 't2_topics'],
      ['โจทย์เกี่ยวกับ Famous People', 31, 3, 26, 't2_topics'],
      ['โจทย์เกี่ยวกับสุขภาพ : Health', 31, 2, 16, 't2_topics'],
      ['โจทย์เกี่ยวกับ Art / culture', 30, 3, 26, 't2_topics'],
      ['โจทย์ Art Education (JUNE)', 22, 3, 26, 't2_topics'],
      ['โจทย์เกี่ยวกับข้อดีข้อเสีย Globalization', 31, 2, 16, 't2_advdis']
    ]
  },
  {
    name: '7 · Task 2 เขียนไปพร้อมกัน',
    area: 'task2',
    lessons: [
      ["เฉลยโจทย์ล่าสุด — Women's sports on TV", 30, 3, 27, 't2_topics'],
      ['โจทย์เกี่ยวกับ Education', 36, 2, 17, 't2_topics'],
      ['โจทย์ Society — Shopping', 23, 3, 27, 't2_topics'],
      ['โจทย์เกี่ยวกับกฏหมาย', 26, 3, 27, 't2_topics'],
      ['โจทย์เกี่ยวกับ Military Budget', 27, 3, 27, 't2_topics'],
      ['โจทย์เกี่ยวกับภาวะโลกร้อน : Global Warming', 36, 2, 17, 't2_topics'],
      ['โจทย์ล่าสุด 16 Feb 2022 — Advertisements for kids', 33, 3, 27, 't2_topics']
    ]
  },
  {
    name: '8 · ฝึกหัดทำโจทย์ไปพร้อมกัน',
    area: 'task1',
    lessons: [
      ['ทำ Line Graph ไปพร้อมกัน', 13, 2, 10, 't1_line'],
      ['แบบฝึกหัด Line Graph', 0, 2, 10, 't1_line'],
      ['ทำ Bar Graph ไปพร้อมกัน', 18, 2, 10, 't1_bar'],
      ['โจทย์ Bar Chart', 17, 2, 14, 't1_bar'],
      ['โจทย์ Line Graph (3)', 20, 2, 14, 't1_line'],
      ['โจทย์ Table 2 อัน', 19, 2, 14, 't1_table']
    ]
  },
  {
    name: '9 · Final Exam',
    area: 'exam',
    lessons: [
      ['Exam 2 (ไฟล์ข้อสอบ)', 0, 1, 0, 'exam'],
      ['Exam 3 (ไฟล์ข้อสอบ)', 0, 1, 0, 'exam']
    ]
  },
  {
    name: '10 · เฉลยการบ้าน',
    area: 'task1',
    lessons: [['เฉลยการบ้าน Line Graph', 43, 3, 28, 't1_line']]
  },
  {
    name: '11 · เฉลย Cambridge 18',
    area: 'task1',
    lessons: [
      ['Task 1 / Test 1 — Line Graph', 17, 2, 14, 't1_line'],
      ['Task 1 / Test 2 — Bar Chart', 16, 2, 14, 't1_bar'],
      ['Task 1 / Test 3 — Map of Central Library', 15, 2, 14, 't1_map'],
      ['Task 1 / Test 4 — Line Graph : prices of metals', 15, 2, 14, 't1_line']
    ]
  },
  {
    name: '12 · เฉลย Cambridge 19 (2024) — Task 1',
    area: 'task1',
    lessons: [
      ['Line graph', 22, 2, 12, 't1_line'],
      ['Map', 18, 2, 12, 't1_map'],
      ['Diagram', 20, 2, 12, 't1_process'],
      ['Mixed Graph', 17, 2, 12, 't1_mixed']
    ]
  },
  {
    name: '12 · เฉลย Cambridge 19 (2024) — Task 2',
    area: 'task2',
    lessons: [
      ['Competition or Cooperation (Discuss both views)', 20, 2, 12, 't2_dbv'],
      ['Shorter Working Week (To what extent)', 20, 2, 12, 't2_twe'],
      ['Globalization / international food', 19, 2, 12, 't2_topics'],
      ['Should people save money? (To what extent)', 16, 2, 12, 't2_twe']
    ]
  }
]

export const WRITING_COURSE_LESSONS: CourseLesson[] = RAW_CHAPTERS.flatMap((chapter, chapterIndex) =>
  chapter.lessons.map((lesson, lessonIndex) => {
    const id = `c${chapterIndex}-l${lessonIndex}`
    return {
      id,
      chapterIndex,
      chapterName: chapter.name,
      area: chapter.area,
      title: lesson[0],
      minutes: lesson[1],
      tier: lesson[2],
      priority: lesson[3],
      questionType: lesson[4],
      band75Only: lesson[5],
      bunnyVideoId: (BUNNY_VIDEO_IDS as Record<string, string>)[id]
    }
  })
)

export const WRITING_COURSE_CHAPTER_NAMES: string[] = RAW_CHAPTERS.map((chapter) => chapter.name)

export const WRITING_COURSE_TOTAL_MINUTES = WRITING_COURSE_LESSONS.reduce((sum, lesson) => sum + lesson.minutes, 0)
export const WRITING_COURSE_LESSON_COUNT = WRITING_COURSE_LESSONS.length

export const formatMinutesAsHours = (minutes: number) => {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}:${String(m).padStart(2, '0')}`
}
