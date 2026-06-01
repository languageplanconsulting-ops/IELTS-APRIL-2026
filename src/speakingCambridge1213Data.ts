export type CambridgeSpeakingTopic = {
  id: string
  category: string
  title: string
  prompt: string
  cues: string[]
}

type CambridgeSpeakingTest = {
  book: 12 | 13 | 14 | 15 | 16
  test: number
  part1Theme: string
  part1Questions: string[]
  part2Title: string
  part2Prompt: string
  part2Cues: string[]
  part3Questions: string[]
}

const prefixPart1 = (questions: string[]) => questions.map((q) => `Part 1 - ${q}`)
const prefixPart3 = (questions: string[]) => questions.map((q) => `Part 3 - ${q}`)

const buildFullExamTopic = (spec: CambridgeSpeakingTest): CambridgeSpeakingTopic => ({
  id: `cam${spec.book}-t${spec.test}-full`,
  category: 'Full Speaking Exam',
  title: `${spec.part1Theme} · ${spec.part2Title}`,
  prompt: spec.part2Prompt,
  cues: [...prefixPart1(spec.part1Questions), ...prefixPart3(spec.part3Questions)]
})

const buildPart1Topic = (spec: CambridgeSpeakingTest): CambridgeSpeakingTopic => {
  const [first, ...rest] = spec.part1Questions
  return {
    id: `cam${spec.book}-t${spec.test}-p1`,
    category: `Part 1 - ${spec.part1Theme}`,
    title: spec.part1Theme,
    prompt: first,
    cues: rest
  }
}

const buildPart2Topic = (spec: CambridgeSpeakingTest): CambridgeSpeakingTopic => ({
  id: `cam${spec.book}-t${spec.test}-p2`,
  category: `Part 2 - ${spec.part2Title}`,
  title: spec.part2Title,
  prompt: spec.part2Prompt,
  cues: spec.part2Cues
})

const buildPart3Topic = (spec: CambridgeSpeakingTest): CambridgeSpeakingTopic => {
  const [first, ...rest] = spec.part3Questions
  return {
    id: `cam${spec.book}-t${spec.test}-p3`,
    category: `Part 3 - ${spec.part2Title}`,
    title: spec.part2Title,
    prompt: first,
    cues: rest
  }
}

const mapBookTests = (tests: CambridgeSpeakingTest[]) => ({
  full: tests.map(buildFullExamTopic),
  part1: tests.map(buildPart1Topic),
  part2: tests.map(buildPart2Topic),
  part3: tests.map(buildPart3Topic)
})

const CAMBRIDGE_12_TESTS: CambridgeSpeakingTest[] = [
  {
    book: 12,
    test: 1,
    part1Theme: 'Art',
    part1Questions: [
      'Did you enjoy doing art lessons at school when you were a child?',
      'Do you ever draw or paint pictures nowadays?',
      'When was the last time you went to an art gallery or exhibition?',
      'What type of art or paintings do you like to have in your home?'
    ],
    part2Title: 'Visiting a workplace',
    part2Prompt: 'Describe a time when you visited a friend or family member at their workplace.',
    part2Cues: [
      'who you visited',
      'where this person worked',
      'why you visited this person’s workplace',
      'how you felt about visiting this person’s workplace'
    ],
    part3Questions: [
      'What things make an office comfortable to work in?',
      'Why do some people prefer to work outdoors?',
      'Do you agree that the building people work in is more important than the colleagues they work with?',
      'What would life be like if people didn’t have to work?',
      'Are all jobs of equal importance?',
      'Why do you think some people become workaholics?'
    ]
  },
  {
    book: 12,
    test: 2,
    part1Theme: 'Health',
    part1Questions: [
      'Is it important to you to eat healthy food?',
      'If you catch a cold, what do you do to feel better?',
      'Do you pay attention to public information about health?',
      'What could you do to have a healthier lifestyle?'
    ],
    part2Title: 'Waiting a long time',
    part2Prompt: 'Describe an occasion when you had to wait a long time for someone or something to arrive.',
    part2Cues: [
      'who or what you were waiting for',
      'how long you had to wait',
      'why you had to wait a long time',
      'how you felt about waiting a long time'
    ],
    part3Questions: [
      'In what kinds of situations should people always arrive early?',
      'In your country, how important is it to arrive early?',
      'How can modern technology help people to arrive early?',
      'What kinds of jobs require the most patience?',
      'Is it always better to be patient at work (or when studying)?',
      'Do you agree or disagree that older people are more patient?'
    ]
  },
  {
    book: 12,
    test: 3,
    part1Theme: 'Songs and singing',
    part1Questions: [
      'Did you enjoy singing when you were younger?',
      'How often do you sing now?',
      'Do you have a favourite song you like listening to?',
      'How important is singing in your culture?'
    ],
    part2Title: 'A popular film actor',
    part2Prompt: 'Describe a film or movie actor from your country who is very popular.',
    part2Cues: [
      'who this actor is',
      'what kinds of films or movies he or she acts in',
      'what you know about this actor’s life',
      'why this actor is so popular'
    ],
    part3Questions: [
      'What are the most popular types of films in your country?',
      'What is the difference between watching a film in the cinema and watching a film at home?',
      'Do you think cinemas will close in the future?',
      'How important is the theatre in your country’s history?',
      'How strong a tradition is it today in your country to go to the theatre?',
      'Do you think the theatre should be run as a business or as a public service?'
    ]
  },
  {
    book: 12,
    test: 4,
    part1Theme: 'Clothes',
    part1Questions: [
      'Where do you buy most of your clothes?',
      'How often do you buy new clothes for yourself?',
      'How do you decide which clothes to buy?',
      'Have the kinds of clothes you like changed in recent years?'
    ],
    part2Title: 'Discussing how you spend money',
    part2Prompt: 'Describe an interesting discussion you had about how you spend your money.',
    part2Cues: [
      'who you had the discussion with',
      'why you discussed this topic',
      'what the result of the discussion was',
      'why this discussion was interesting for you'
    ],
    part3Questions: [
      'Why do some parents give their children money to spend each week?',
      'Do you agree that schools should teach children how to manage money?',
      'Do you think it is a good idea for students to earn money while studying?',
      'Do you think it is true that in today’s society money cannot buy happiness?',
      'What disadvantages are there in a society where the gap between rich and poor is very large?',
      'Do you think richer countries have a responsibility to help poorer countries?'
    ]
  }
]

const CAMBRIDGE_13_TESTS: CambridgeSpeakingTest[] = [
  {
    book: 13,
    test: 1,
    part1Theme: 'Television programmes',
    part1Questions: [
      'Where do you usually watch TV programmes or shows?',
      'What’s your favourite TV programme or show?',
      'Are there any programmes or shows you don’t like watching?',
      'Do you think you will watch more TV or fewer TV programmes in the future?'
    ],
    part2Title: 'Someone who started a business',
    part2Prompt: 'Describe someone you know who has started a business.',
    part2Cues: [
      'who this person is',
      'what work this person does',
      'why this person decided to start a business',
      'whether you would like to do the same kind of work as this person'
    ],
    part3Questions: [
      'In your country, what kinds of jobs do young people not want to do?',
      'Who is best at advising young people about choosing a job: teachers or parents?',
      'Is money always the most important thing when choosing a job?',
      'Do you agree that many people nowadays are under pressure to work longer hours and take fewer holidays?',
      'What is the impact on society of people having a poor work–life balance?',
      'Could you recommend some effective strategies for governments and employers to ensure people have a good work–life balance?'
    ]
  },
  {
    book: 13,
    test: 2,
    part1Theme: 'Age',
    part1Questions: [
      'Are you happy to be the age you are now?',
      'When you were a child, did you think a lot about your future?',
      'Do you think you have changed as you have got older?',
      'What will be different about your life in the future?'
    ],
    part2Title: 'A new technological device',
    part2Prompt:
      'Describe a time when you started using a new technological device (e.g. a new computer or phone).',
    part2Cues: [
      'what device you started using',
      'why you started using this device',
      'how easy or difficult it was to use',
      'how helpful this device was to you'
    ],
    part3Questions: [
      'What is the best age for children to start computer lessons?',
      'Do you think that schools should use more technology to help children learn?',
      'Do you agree or disagree that computers will replace teachers one day?',
      'How much has technology changed how we communicate with each other?',
      'Do you agree that there are still many more major technological innovations to be made?',
      'Could you suggest some reasons why some people are deciding to reduce their use of technology?'
    ]
  },
  {
    book: 13,
    test: 3,
    part1Theme: 'Shopping and money',
    part1Questions: [
      'When you go shopping, do you prefer to pay for things in cash or by card?',
      'Do you ever save money to buy special things?',
      'Would you ever take a job which had low pay?',
      'Would winning a lot of money make a big difference to your life?'
    ],
    part2Title: 'An interesting work or study discussion',
    part2Prompt: 'Describe an interesting discussion you had as part of your work or studies.',
    part2Cues: [
      'what the subject of the discussion was',
      'who you discussed the subject with',
      'what opinions were expressed',
      'why you found the discussion interesting'
    ],
    part3Questions: [
      'Why is it good to discuss problems with other people?',
      'Do you think that it’s better to talk to friends and not family about problems?',
      'Is it always a good idea to tell lots of people about a problem?',
      'Which communication skills are most important when taking part in meetings with colleagues?',
      'What are the possible effects of poor written communication skills at work?',
      'What do you think will be the future impact of technology on communication in the workplace?'
    ]
  },
  {
    book: 13,
    test: 4,
    part1Theme: 'Animals',
    part1Questions: [
      'Are there many animals or birds where you live?',
      'How often do you watch programmes or read articles about wild animals?',
      'Have you ever been to a zoo or a wildlife park?',
      'Would you like to have a job working with animals?'
    ],
    part2Title: 'A useful website',
    part2Prompt: 'Describe a website you use a lot to help you in your work or studies.',
    part2Cues: [
      'what the website is',
      'how often you use the website',
      'what information the website gives you',
      'how your work or studies would change if this website didn’t exist'
    ],
    part3Questions: [
      'Why do some people find the internet addictive?',
      'What would the world be like without the internet?',
      'Do you think that the way people use the internet may change in the future?',
      'What are the ways that social media can be used for positive purposes?',
      'Why do some individuals post highly negative comments about other people on social media?',
      'Do you think that companies’ main form of advertising will be via social media in the future?'
    ]
  }
]

const CAMBRIDGE_14_TESTS: CambridgeSpeakingTest[] = [
  {
    book: 14,
    test: 1,
    part1Theme: 'Future plans',
    part1Questions: [
      'What job would you like to have ten years from now?',
      'How useful will English be for your future?',
      'How much travelling do you hope to do in the future?',
      'How do you think your life will change in the future?'
    ],
    part2Title: 'A language lesson',
    part2Prompt: 'Describe a language lesson you enjoyed.',
    part2Cues: [
      'what the lesson was about',
      'when and where you had the lesson',
      'what the teacher did',
      'why you enjoyed the lesson'
    ],
    part3Questions: [
      'Why do some people have a good memory while others do not?',
      'Why do more people depend on their mobile phones?',
      'What are some possible advantages of having a good memory?',
      'Do you think it is important to learn languages at school?'
    ]
  },
  {
    book: 14,
    test: 2,
    part1Theme: 'Music',
    part1Questions: [
      "What's your favourite kind of music?",
      'Do you like to listen to live music?',
      'Has the music that you listen to changed since you were young?',
      'Do you think music and musicians influence young people today?'
    ],
    part2Title: 'A useful website',
    part2Prompt: 'Describe a website you use that helps you in your work or studies.',
    part2Cues: [
      'what the website is',
      'how often you use it',
      'what information it gives you',
      'how your work or studies would change if the website did not exist'
    ],
    part3Questions: [
      'What are the positive aspects of using the internet?',
      'Do people in your country use the internet a lot?',
      'Do you agree that the internet is making people more sociable?',
      'How important is it for children to learn to use computers?'
    ]
  },
  {
    book: 14,
    test: 3,
    part1Theme: 'Languages',
    part1Questions: [
      'Which language do you find hardest to pronounce words in?',
      'Have you ever tried to learn another language?',
      'Do you think it is important to learn foreign languages?',
      'What is the most difficult part of learning a foreign language?'
    ],
    part2Title: 'A person who taught you something',
    part2Prompt: 'Describe a person who taught you something useful.',
    part2Cues: [
      'who this person was',
      'what they taught you',
      'how they taught you',
      'why what you learned was useful'
    ],
    part3Questions: [
      'What qualities should a good teacher have?',
      'How can people who cannot read and write learn?',
      'Do teachers still play important roles in the internet era?',
      'Which is better for children to learn: pictures or words?'
    ]
  },
  {
    book: 14,
    test: 4,
    part1Theme: 'Weather',
    part1Questions: [
      "What's the weather like where you live?",
      'Do you prefer hot or cold weather?',
      'Do you like the weather in your hometown?',
      'Are there any weather changes in recent years in your hometown?'
    ],
    part2Title: 'A useful book',
    part2Prompt: 'Describe a book you read that you found useful.',
    part2Cues: [
      'what the book was',
      'when you read it',
      'why you read it',
      'why you found it useful'
    ],
    part3Questions: [
      'What are the benefits of reading books?',
      'Do you think people read less nowadays?',
      'Which is better for children: paper books or e-books?',
      'What kinds of books do children like?'
    ]
  }
]

const CAMBRIDGE_15_TESTS: CambridgeSpeakingTest[] = [
  {
    book: 15,
    test: 1,
    part1Theme: 'Work',
    part1Questions: [
      'What work do you do?',
      'Why did you choose to do that type of work (or that job)?',
      'Do you like your job?',
      'Do you miss being a student?',
      'What was your dream job when you were a child?'
    ],
    part2Title: 'A person who taught you something',
    part2Prompt: 'Describe a person who taught you something important.',
    part2Cues: [
      'who this person was',
      'what they taught you',
      'how they taught you',
      'why it was important'
    ],
    part3Questions: [
      'What qualities should a good teacher have?',
      'How can people who cannot read and write learn?',
      'Do teachers still play important roles in the internet era?',
      'Which is better for children to learn: pictures or words?'
    ]
  },
  {
    book: 15,
    test: 2,
    part1Theme: 'Study',
    part1Questions: [
      'Do you work or are you a student?',
      'What subject are you studying?',
      'Why did you choose to study that subject?',
      'Do you like your subject?',
      'Is your subject interesting to your friends?'
    ],
    part2Title: 'A time you helped someone',
    part2Prompt: 'Describe a time when you helped someone.',
    part2Cues: [
      'who you helped',
      'how you helped them',
      'why they needed help',
      'how you felt about helping them'
    ],
    part3Questions: [
      'Should children be taught to help others?',
      'How can we encourage children to help others?',
      'Do people in your country help strangers?',
      'What are the differences between helping family and helping strangers?'
    ]
  },
  {
    book: 15,
    test: 3,
    part1Theme: 'Hometown',
    part1Questions: [
      'Where is your hometown?',
      'Do you like your hometown?',
      "What's the most interesting part of your hometown?",
      'Has your hometown changed much in recent years?'
    ],
    part2Title: 'A time you were surprised',
    part2Prompt: 'Describe a time when you were surprised to meet someone.',
    part2Cues: [
      'who you met',
      'where you met them',
      'why you were surprised',
      'how you felt about the meeting'
    ],
    part3Questions: [
      'Why do people often feel nervous when meeting new people?',
      'Is it easier to meet new people now than in the past?',
      'How important is first impression when meeting someone?',
      'Do you think people are more open to meeting strangers than before?'
    ]
  },
  {
    book: 15,
    test: 4,
    part1Theme: 'Morning routine',
    part1Questions: [
      'Do you usually get up early in the morning?',
      'What do you usually do in the morning?',
      'Do you think breakfast is important?',
      'Did you have the same morning routine in the past?'
    ],
    part2Title: 'A time you were not allowed to use your phone',
    part2Prompt: 'Describe a time when you were not allowed to use your mobile phone.',
    part2Cues: [
      'when it was',
      'where you were',
      'why you were not allowed to use your phone',
      'how you felt about not being able to use your phone'
    ],
    part3Questions: [
      'How do young and old people use mobile phones differently?',
      'What are the differences between texting and calling?',
      'Why do some people dislike making phone calls?',
      'How has technology changed the way people communicate?'
    ]
  }
]

const CAMBRIDGE_16_TESTS: CambridgeSpeakingTest[] = [
  {
    book: 16,
    test: 1,
    part1Theme: 'Friends',
    part1Questions: [
      'Do you have many friends?',
      'How often do you see your friends?',
      'What do you usually do with your friends?',
      'Do you prefer to have a small or large group of friends?'
    ],
    part2Title: 'A time you were bored',
    part2Prompt: 'Describe a time when you felt bored.',
    part2Cues: [
      'when it was',
      'where you were',
      'why you felt bored',
      'what you did to stop feeling bored'
    ],
    part3Questions: [
      'When do people feel bored?',
      'What can people do when they feel bored?',
      'Do people get bored more easily now than in the past?',
      'Do you think school is boring for some students?'
    ]
  },
  {
    book: 16,
    test: 2,
    part1Theme: 'Daily routine',
    part1Questions: [
      'What is your daily routine?',
      'Do you have the same routine every day?',
      'Is your routine now different from when you were a child?',
      'Do you think it is important to have a daily routine?'
    ],
    part2Title: 'A time you waited for something',
    part2Prompt: 'Describe a time when you waited for something special.',
    part2Cues: [
      'what you waited for',
      'where you waited',
      'how long you waited',
      'how you felt while waiting'
    ],
    part3Questions: [
      'In what kinds of situations should people arrive early?',
      'In your country, how important is it to arrive early?',
      'How can modern technology help people to arrive early?',
      'What kinds of jobs require the most patience?'
    ]
  },
  {
    book: 16,
    test: 3,
    part1Theme: 'Being on time',
    part1Questions: [
      'Do you wear a watch?',
      'In your country is it important to be on time?',
      'How do you feel when others are late?',
      'Are you a patient person?'
    ],
    part2Title: 'A time you were not allowed to use your phone',
    part2Prompt: 'Describe a time when you were not allowed to use your mobile phone.',
    part2Cues: [
      'when it was',
      'where you were',
      'why you were not allowed to use your phone',
      'how you felt about not being able to use your phone'
    ],
    part3Questions: [
      'How do young and old people use mobile phones differently?',
      'What are the differences between texting and calling?',
      'Why do some people dislike making phone calls?',
      'How has technology changed the way people communicate?'
    ]
  },
  {
    book: 16,
    test: 4,
    part1Theme: 'Holidays',
    part1Questions: [
      'Do you prefer to travel or stay at home during holidays?',
      'What do you do in your holidays?',
      'Can you describe a typical holiday in your country?',
      'Is there any difference between holidays now and in the past?'
    ],
    part2Title: 'A time you were surprised',
    part2Prompt: 'Describe a time when you were surprised to meet someone.',
    part2Cues: [
      'who you met',
      'where you met them',
      'why you were surprised',
      'how you felt about the meeting'
    ],
    part3Questions: [
      'Why do people often feel nervous when meeting new people?',
      'Is it easier to meet new people now than in the past?',
      'How important is first impression when meeting someone?',
      'Do you think people are more open to meeting strangers than before?'
    ]
  }
]

const ALL_CURATED_TESTS = [
  ...CAMBRIDGE_12_TESTS,
  ...CAMBRIDGE_13_TESTS,
  ...CAMBRIDGE_14_TESTS,
  ...CAMBRIDGE_15_TESTS,
  ...CAMBRIDGE_16_TESTS
]

const curated = mapBookTests(ALL_CURATED_TESTS)
const cam12 = mapBookTests(CAMBRIDGE_12_TESTS)
const cam13 = mapBookTests(CAMBRIDGE_13_TESTS)

export const SPEAKING_CURATED_PART1_TOPICS = curated.part1
export const SPEAKING_CURATED_PART3_TOPICS = curated.part3
export const SPEAKING_CURATED_FULL_EXAM_TOPICS = curated.full

export const CAMBRIDGE_12_SPEAKING_FULL_EXAM_TOPICS = cam12.full
export const CAMBRIDGE_12_SPEAKING_PART1_TOPICS = cam12.part1
export const CAMBRIDGE_12_SPEAKING_PART2_TOPICS = cam12.part2
export const CAMBRIDGE_12_SPEAKING_PART3_TOPICS = cam12.part3

export const CAMBRIDGE_13_SPEAKING_FULL_EXAM_TOPICS = cam13.full
export const CAMBRIDGE_13_SPEAKING_PART1_TOPICS = cam13.part1
export const CAMBRIDGE_13_SPEAKING_PART2_TOPICS = cam13.part2
export const CAMBRIDGE_13_SPEAKING_PART3_TOPICS = cam13.part3

export const CAMBRIDGE_SPEAKING_PART2_TOPICS = curated.part2
