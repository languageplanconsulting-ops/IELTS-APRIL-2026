/**
 * Shared source of truth for real IELTS Speaking exam recalls + predictions,
 * plus the freshness metadata shown on the exam-feed page.
 * Curated from test-taker reports (recalls), not official exam content.
 * Consumed by ExamFeedPage (public SEO feed) and scripts/build-seo-pages.mjs
 * (static /th/ielts-exam-recall/ landing page) — edit here once, regenerate both.
 */
import type { ExamItem } from './writingExamRecalls'

export const LAST_UPDATED = '21 มิถุนายน 2026'
export const CURRENT_MONTH = 'มิถุนายน 2026'

export const MONTHS = ['มิถุนายน 2026', 'พฤษภาคม 2026', 'เมษายน 2026', 'มีนาคม 2026', 'กุมภาพันธ์ 2026']

export const SPEAKING_RECALL: ExamItem[] = [
  {
    tag: 'Part 2',
    title: 'Describe something you did in your study or work that made you feel confident.',
    bullets: ['When and where it happened', 'What you did', 'Why it made you feel confident'],
    meta: 'มิ.ย. 2026 · เยอรมนี',
    isNew: true
  },
  {
    tag: 'Part 2',
    title: 'Describe something you taught to a friend or relative.',
    bullets: ['What you taught', 'When it was', 'How long it was for', 'How you felt about it'],
    meta: 'มิ.ย. 2026 · นิวซีแลนด์',
    isNew: true
  },
  {
    tag: 'Part 2',
    title: 'Describe an indoor or outdoor place where it is easy for you to study.',
    bullets: ['Where it is', 'What it is like', 'When you go there', 'Why you like studying there'],
    meta: 'มิ.ย. 2026 · เวียดนาม'
  },
  {
    tag: 'Part 2',
    title: 'Describe a crowded place you have visited.',
    bullets: ['When you went there', 'Who you went with', 'How you felt about being there'],
    meta: 'มิ.ย. 2026 · สเปน'
  },
  {
    tag: 'Part 1',
    title: 'Weather & climate',
    bullets: [
      'What is the weather like where you live?',
      'Do you prefer cold or hot weather?',
      'Do you check the weather forecast? How often?',
      'What do you think are the effects of climate change recently?'
    ],
    meta: 'มิ.ย. 2026 · สวีเดน / เวียดนาม'
  },
  {
    tag: 'Part 3',
    title: 'Confidence (follow-up discussion)',
    bullets: [
      'Why do so many people lack confidence these days?',
      'Are children of confident parents also confident?',
      'What can teachers do to make studying more interesting?',
      'How can a person become more confident?'
    ],
    meta: 'มิ.ย. 2026 · เยอรมนี'
  }
]

export const SPEAKING_PREDICT: ExamItem[] = [
  {
    tag: 'Part 2',
    title: 'Describe an important old thing your family has kept for a long time.',
    meta: 'แนวโน้มสูง'
  },
  {
    tag: 'Part 2',
    title: 'Describe a book you read that you found useful.',
    meta: 'แนวโน้มสูง'
  },
  {
    tag: 'Part 2',
    title: 'Describe a person you know who enjoys working for a family business.',
    meta: 'ควรเตรียม'
  },
  {
    tag: 'Part 2',
    title: 'Describe something you can’t live without (not a phone or computer).',
    meta: 'พบบ่อย'
  }
]
