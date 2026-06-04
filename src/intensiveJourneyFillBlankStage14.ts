import type { NewFillBlankSet } from './readingNewFillBlankQuestions.ts'

/** Fill-blank UI for Quest Log ด่าน 14 (Cambridge-style: P1 Q8–14, P2 Q25–27). */
export const INTENSIVE_JOURNEY_FILL_BLANK_STAGE_14: NewFillBlankSet[] = [
  {
    examId: 'journey-normal-stage-14',
    passageNumber: 1,
    startNumber: 8,
    endNumber: 14,
    sourceParagraphs: ['A', 'G'],
    instructions: [
      'Questions 8–14',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 8–14 on your answer sheet.'
    ],
    summaryTitle: 'Measuring national wellbeing beyond GDP',
    summaryLines: [
      { type: 'para', text: 'GDP has long been the primary gauge of a society\'s economic {8}, despite early warnings from its creator that it could not adequately capture welfare.' },
      { type: 'bullet', text: 'Research identified a surprising {9} — national happiness does not increase over time even as a country grows wealthier.' },
      { type: 'bullet', text: 'Happiness may depend on {10} income — earnings compared to those of others.' },
      { type: 'bullet', text: 'The strength of personal {11} — including the quality and frequency of meaningful relationships — is the most reliable predictor of happiness.' },
      { type: 'bullet', text: 'Some countries have developed alternative {12} including life satisfaction and ecological sustainability.' },
      { type: 'bullet', text: 'Research shows that individuals tend to return to their personal happiness {13} following significant life events, whether positive or negative.' },
      { type: 'bullet', text: 'Supplementing GDP with other {14} drawn from health, wellbeing, and environmental data provides a more complete picture of societal progress.' }
    ],
    questions: [
      { number: 8, answer: 'prosperity', passageKeyword: 'the primary measure of a nation\'s prosperity has been the size of its economy', questionKeyword: 'society\'s economic prosperity', thaiMeaning: 'ความเจริญรุ่งเรือง', exactPortion: 'For most of recorded history, the primary measure of a nation\'s prosperity has been the size of its economy — the total output of goods and services it produces each year, expressed as gross domestic product' },
      { number: 9, answer: 'paradox', passageKeyword: 'what became known as the Easterlin paradox', questionKeyword: 'Easterlin paradox', thaiMeaning: 'ความขัดแย้ง / ปริปัติ', exactPortion: 'American economist Richard Easterlin documented what became known as the Easterlin paradox: within a country at any given time, richer people report higher levels of happiness than poorer people, but over time, as countries grow wealthier, average self-reported happiness does not increase' },
      { number: 10, answer: 'reference', passageKeyword: 'what economists call reference income', questionKeyword: 'reference income', thaiMeaning: 'อ้างอิง / เปรียบเทียบ', exactPortion: 'Easterlin proposed that happiness is determined not by absolute income but by income relative to the people around you — what economists call reference income — meaning that as everyone gets richer together, the happiness gains cancel out' },
      { number: 11, answer: 'connection', passageKeyword: 'Social connection — the quality and frequency of meaningful relationships', questionKeyword: 'personal connection', thaiMeaning: 'การเชื่อมโยงทางสังคม', exactPortion: 'Social connection — the quality and frequency of meaningful relationships — is consistently the strongest predictor of happiness across cultures and age groups' },
      { number: 12, answer: 'measures', passageKeyword: 'incorporating measures of psychological wellbeing, cultural preservation, time use, and environmental sustainability', questionKeyword: 'alternative measures', thaiMeaning: 'มาตรวัด / วิธีวัด', exactPortion: 'Bhutan famously introduced the concept of Gross National Happiness in the 1970s, incorporating measures of psychological wellbeing, cultural preservation, time use, and environmental sustainability alongside conventional economic indicators' },
      { number: 13, answer: 'level', passageKeyword: 'return to a baseline level of happiness after both positive and negative life events', questionKeyword: 'happiness baseline level', thaiMeaning: 'ระดับ', exactPortion: 'Adaptation effects — the tendency of individuals to return to a baseline level of happiness after both positive and negative life events — complicate the interpretation of changes over time' },
      { number: 14, answer: 'indicators', passageKeyword: 'alongside conventional economic indicators', questionKeyword: 'supplementary economic indicators', thaiMeaning: 'ตัวชี้วัด', exactPortion: 'incorporating measures of psychological wellbeing, cultural preservation, time use, and environmental sustainability alongside conventional economic indicators' }
    ]
  },
  {
    examId: 'journey-normal-stage-14',
    passageNumber: 2,
    startNumber: 25,
    endNumber: 27,
    sourceParagraphs: ['A', 'F'],
    instructions: [
      'Questions 25–27',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 25–27 on your answer sheet.'
    ],
    summaryTitle: 'The rise, suppression and recognition of sign language',
    summaryLines: [
      { type: 'bullet', text: 'For most of European history, deaf people were denied fundamental {25} on the grounds that they could not use spoken language.' },
      { type: 'bullet', text: 'Sign language gained ground as a means of instruction until it was outlawed by the 1880 {26} passed at a congress held in Milan.' },
      { type: 'bullet', text: 'Research restored its academic standing by proving it possessed the full characteristics of a genuine {27}.' }
    ],
    questions: [
      { number: 25, answer: 'rights', passageKeyword: 'denied legal rights on the grounds that they could not participate in verbal contracts', questionKeyword: 'fundamental rights', thaiMeaning: 'สิทธิ', exactPortion: 'Deaf individuals in medieval Europe were frequently denied legal rights on the grounds that they could not participate in verbal contracts or take spoken oaths' },
      { number: 26, answer: 'resolution', passageKeyword: 'the Milan resolution is now widely regarded by deaf historians', questionKeyword: '1880 resolution passed in Milan', thaiMeaning: 'มติ / ข้อมติ', exactPortion: 'The Second International Congress on Education of the Deaf, held in Milan in 1880, passed a resolution declaring that spoken language was superior to sign and that oral methods should replace signing in all deaf education' },
      { number: 27, answer: 'language', passageKeyword: 'a complete, independent language with its own phonology, morphology, and syntax', questionKeyword: 'independent language', thaiMeaning: 'ภาษา', exactPortion: 'American Sign Language was not a simplified gestural code but a complete, independent language with its own phonology, morphology, and syntax' }
    ]
  }
]
