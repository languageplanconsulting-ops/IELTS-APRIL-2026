/**
 * Shared source of truth for real IELTS Writing exam recalls + predictions.
 * Curated from test-taker reports (recalls), not official exam content.
 * Consumed by ExamFeedPage (admin SEO feed) and WritingGuidePage (latest-exam hub screens).
 */

export type ExamItem = {
  tag: string
  title: string
  bullets?: string[]
  meta: string
  isNew?: boolean
}

export const WRITING_RECALL: ExamItem[] = [
  {
    tag: 'Academic Task 2',
    title:
      'Some people think the government should spend money on building subway and train lines to ease traffic congestion. Others believe building more and wider roads is the best way. Discuss both points of view and give your opinion.',
    meta: 'มิ.ย. 2026 · ไทย 🇹🇭',
    isNew: true
  },
  {
    tag: 'Academic Task 1',
    title:
      "The pie chart illustrates Brazil's income from different sectors of the economy in 2005, and its income from the fishing sector from 1990 to 2005.",
    meta: 'มิ.ย. 2026 · ไทย 🇹🇭',
    isNew: true
  },
  {
    tag: 'Academic Task 2',
    title:
      'Some people think it is important to keep and maintain old buildings rather than replacing them with modern ones. To what extent do you agree or disagree?',
    meta: '20 มิ.ย. 2026 · อินเดีย'
  },
  {
    tag: 'Academic Task 2',
    title:
      'Supermarkets and manufacturers have a duty to reduce the packaging of products they sell — others argue consumers must avoid buying products with a lot of packaging. Discuss both views and give your opinion.',
    meta: '13 มิ.ย. 2026 · อินเดีย'
  },
  {
    tag: 'Academic Task 1',
    title:
      'The process chart illustrates the process of making carbonated drinks.',
    meta: 'มิ.ย. 2026 · คาซัคสถาน'
  },
  {
    tag: 'Academic Task 2',
    title:
      'Genetic engineering is an important issue in today’s society. Some think it will improve lives; others believe it is a threat to life on earth. Discuss both views and give your own opinion.',
    meta: 'มิ.ย. 2026 · ตุรกี'
  }
]

export const WRITING_PREDICT: ExamItem[] = [
  {
    tag: 'Task 2',
    title:
      'Children should be taught how to manage money as a mandatory school subject — others think it is the parents’ responsibility. Discuss both views and give your opinion.',
    meta: 'แนวโน้มสูง · พบต้นเดือน พ.ค.'
  },
  {
    tag: 'Task 2',
    title:
      'In many countries people are living longer than ever. While positive, it presents challenges for governments. What are these challenges, and what solutions can you suggest?',
    meta: 'แนวโน้มสูง'
  },
  {
    tag: 'Task 1',
    title: 'The diagram shows the process of producing instant coffee from coffee beans.',
    meta: 'ควรเตรียม (process diagram)'
  },
  {
    tag: 'Task 2',
    title:
      'Some believe schools should focus more on practical skills than theoretical knowledge. To what extent do you agree or disagree?',
    meta: 'แนวโน้มปานกลาง'
  }
]
