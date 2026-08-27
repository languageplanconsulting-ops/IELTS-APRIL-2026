import type { CambridgeSpeakingTopic } from './speakingCambridge1213Data'
import type { SpeakingPart2SampleVideo } from './speakingPart2SampleVideos'

/**
 * Part 3 model-answer videos hosted on Google Drive.
 *
 * The uploaded-asset pipeline (Supabase Storage + signed playback URLs) stays the
 * primary source for Part 3 samples; this is a static fallback for the recorded
 * "Band 7.5 – 8.0 example" reels, which are teaching videos with the captions and
 * annotations already burned in. Hosting them on Drive keeps them off the Supabase
 * egress budget.
 *
 * Each entry answers a whole topic — every question in `questions`, in order — so
 * it registers as a topic-level sample rather than one per question.
 */
export type SpeakingPart3SampleVideo = {
  topicId: string
  title: string
  driveFileId: string
  questions: string[]
}

export const SPEAKING_PART3_SAMPLE_VIDEOS: SpeakingPart3SampleVideo[] = [
  {
    topicId: 'p3-sample-reading',
    title: 'Reading',
    driveFileId: '19hv0m4KInskdXbH5QP0kqc-7pBdzDmvT',
    questions: [
      'What are the benefits of reading books?',
      'Do you think people read less nowadays?',
      'Which is better for children, paper books or e-books?',
      'What kinds of books do children like?'
    ]
  },
  {
    topicId: 'p3-sample-meeting-people',
    title: 'Meeting new people',
    driveFileId: '11fG9Kw5jsG6lhx9QRjkRfSRvCgIUu6gr',
    questions: [
      'Why do people often feel nervous when meeting new people?',
      'Is it easier to meet new people now than in the past?',
      'How important is first impression when meeting someone?',
      'Do you think people are more open to meeting strangers than before?'
    ]
  },
  {
    topicId: 'p3-sample-boredom',
    title: 'Boredom',
    driveFileId: '1LoG_2QCWxufr2623T1GcBHnkLI3XGwsH',
    questions: [
      'When do people feel bored?',
      'What can people do when they feel bored?',
      'Do people get bored more easily now than in the past?',
      'Do you think school is boring for some students?'
    ]
  },
  {
    topicId: 'p3-sample-communication',
    title: 'Communication skills',
    driveFileId: '1Kh9QEvGXFXQ79HQGCYuhbF-lySZNQQ--',
    questions: [
      'Why is it good to discuss problems with other people?',
      "Do you think that it's better to talk to friends and not family about problems?",
      'Is it always a good idea to tell lots of people about a problem?',
      'Which communication skills are most important when taking part in meetings with colleagues?',
      'What are the possible effects of poor written communication skills at work?',
      'What do you think will be the future impact of technology on communication in the workplace?'
    ]
  },
  {
    topicId: 'p3-sample-money',
    title: 'Money',
    driveFileId: '1qpxnrEbSqvMAVJ3k0gXBI6zjNjzE6wxm',
    questions: [
      'Should parents give their children a limited budget?',
      'Do you agree that schools should teach children how to manage money?',
      'Do you think it is a good idea for students to earn money while studying?',
      'Do you think it is true that in today’s society, money cannot buy happiness?',
      'What disadvantages are there in a society where the gap between rich and poor is very large?',
      'Do you think richer countries have a responsibility to help poorer countries?'
    ]
  }
]

/** Only entries whose upload has actually happened are usable. */
const readySamples = () => SPEAKING_PART3_SAMPLE_VIDEOS.filter((entry) => Boolean(entry.driveFileId))

/** Topics for the Part 3 bank, so these appear in the speaking journey. */
export const SPEAKING_PART3_SAMPLE_TOPICS: CambridgeSpeakingTopic[] = readySamples().map((entry) => ({
  id: entry.topicId,
  category: `Part 3 - ${entry.title}`,
  title: entry.title,
  prompt: entry.questions[0],
  cues: entry.questions.slice(1)
}))

export const resolveSpeakingPart3SampleVideo = (
  topicId: string | null | undefined
): SpeakingPart2SampleVideo | null => {
  if (!topicId) return null
  const entry = readySamples().find((item) => item.topicId === topicId)
  if (!entry) return null
  return {
    id: `part3-sample-${entry.topicId}`,
    shortLabel: entry.title,
    topicLabel: `Part 3 - ${entry.title}`,
    driveFileId: entry.driveFileId,
    sourceLabel: 'Band 7.5 – 8.0 example',
    transcript: entry.questions.join('\n'),
    topicIds: [entry.topicId],
    matchPatterns: []
  }
}
