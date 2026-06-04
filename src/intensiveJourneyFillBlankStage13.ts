import type { NewFillBlankSet } from './readingNewFillBlankQuestions.ts'

/** Fill-blank UI for Quest Log ด่าน 13 (Cambridge-style: P1 Q8–14, P2 Q25–27). */
export const INTENSIVE_JOURNEY_FILL_BLANK_STAGE_13: NewFillBlankSet[] = [
  {
    examId: 'journey-normal-stage-13',
    passageNumber: 1,
    startNumber: 8,
    endNumber: 14,
    sourceParagraphs: ['B', 'G'],
    instructions: [
      'Questions 8–14',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 8–14 on your answer sheet.'
    ],
    summaryTitle: 'Understanding crowd behaviour in emergencies and online',
    summaryLines: [
      { type: 'para', text: 'Later research argued that crowd members adopt a shared {8} rather than losing all sense of self.' },
      { type: 'bullet', text: 'Studies of crowd emergencies challenged the idea that widespread {9} is the typical response to disaster, finding cooperative behaviour is far more common.' },
      { type: 'bullet', text: 'Political use of crowd psychology suggests that emphasising a group\'s sense of {10} over others can encourage members to see outsiders as threats.' },
      { type: 'bullet', text: 'At high {11} levels — over six people per square metre — individuals lose the ability to move independently and risk being crushed.' },
      { type: 'bullet', text: 'Digital platforms have enabled coordinated {12} of individuals on a scale impossible in physical crowds.' },
      { type: 'bullet', text: 'Researchers agree that reducing crowd danger requires improvements to the {13} of physical spaces, including wider exits and clearer signage.' },
      { type: 'bullet', text: 'Advanced predictive {14} based on computational methods depend on assumptions that are frequently violated in practice.' }
    ],
    questions: [
      { number: 8, answer: 'identity', passageKeyword: 'shift from a personal identity to a social identity defined by membership in the group', questionKeyword: 'social identity', thaiMeaning: 'อัตลักษณ์', exactPortion: 'they shift from a personal identity to a social identity defined by membership in the group' },
      { number: 9, answer: 'panic', passageKeyword: 'mass panic, defined as selfish, irrational flight that causes people to trample others, is extremely rare', questionKeyword: 'widespread panic', thaiMeaning: 'ความตื่นตระหนก', exactPortion: 'mass panic, defined as selfish, irrational flight that causes people to trample others, is extremely rare' },
      { number: 10, answer: 'superiority', passageKeyword: 'emphasise the distinctiveness and superiority of an in-group', questionKeyword: 'sense of group superiority', thaiMeaning: 'ความเหนือกว่า', exactPortion: 'When political leaders emphasise the distinctiveness and superiority of an in-group — an identity defined by shared ethnicity, religion, or ideology' },
      { number: 11, answer: 'density', passageKeyword: 'crowd density exceeding safe thresholds in constrained spaces', questionKeyword: 'crowd density', thaiMeaning: 'ความหนาแน่น', exactPortion: 'most crowd disasters… were not caused by panic but by crowd density exceeding safe thresholds in constrained spaces' },
      { number: 12, answer: 'harassment', passageKeyword: 'targeting individuals with harassment campaigns', questionKeyword: 'coordinated harassment', thaiMeaning: 'การคุกคาม', exactPortion: 'targeting individuals with harassment campaigns or amplifying misinformation at a scale and speed impossible in physical crowds' },
      { number: 13, answer: 'design', passageKeyword: 'better physical design — wider exits, better signage, more gradual density transitions', questionKeyword: 'spatial design', thaiMeaning: 'การออกแบบ', exactPortion: 'Researchers broadly agree that safer crowds require both better physical design — wider exits, better signage, more gradual density transitions' },
      { number: 14, answer: 'models', passageKeyword: 'sophisticated computational models fail to predict specific events reliably', questionKeyword: 'computational predictive models', thaiMeaning: 'แบบจำลอง', exactPortion: 'even sophisticated computational models fail to predict specific events reliably' }
    ]
  },
  {
    examId: 'journey-normal-stage-13',
    passageNumber: 2,
    startNumber: 25,
    endNumber: 27,
    sourceParagraphs: ['D', 'G'],
    instructions: [
      'Questions 25–27',
      'Complete the summary below.',
      'Choose ONE WORD ONLY from the passage for each answer.',
      'Write your answers in boxes 25–27 on your answer sheet.'
    ],
    summaryTitle: 'Darwin\'s theory and legacy',
    summaryLines: [
      { type: 'bullet', text: 'Darwin arrived at natural selection partly through reading an economist\'s argument about {25} growth and resource limits.' },
      { type: 'bullet', text: 'His delay in publishing ended when a rival naturalist sent a letter outlining an independently developed {26} that mirrored his own.' },
      { type: 'bullet', text: 'After his death, Darwin was interred at Westminster {27}, an honour placing him among the most celebrated figures in British history.' }
    ],
    questions: [
      { number: 25, answer: 'population', passageKeyword: 'Thomas Malthus\'s essay on population in 1838', questionKeyword: 'Malthus on population growth', thaiMeaning: 'ประชากร', exactPortion: 'He read the economist Thomas Malthus\'s essay on population in 1838, which argued that populations always tend to grow faster than their food supply' },
      { number: 26, answer: 'theory', passageKeyword: 'independently arrived at essentially the same theory', questionKeyword: 'independently developed theory', thaiMeaning: 'ทฤษฎี', exactPortion: 'who had independently arrived at essentially the same theory' },
      { number: 27, answer: 'Abbey', passageKeyword: 'buried in Westminster Abbey', questionKeyword: 'Westminster Abbey', thaiMeaning: 'Westminster Abbey', exactPortion: 'He died in April 1882 and was buried in Westminster Abbey — an honour that had initially been resisted by some Church of England clergy' }
    ]
  }
]
