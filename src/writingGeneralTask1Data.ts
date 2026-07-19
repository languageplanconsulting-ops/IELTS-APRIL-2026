export type GeneralTask1Register = 'formal' | 'semi-formal' | 'informal'

export type GeneralTask1SentencePattern =
  | 'sv-gerund'
  | 'sv-which'
  | 'coordinating'
  | 'subordinator-middle'
  | 'subordinator-front'

export type GeneralTask1Sentence = {
  text: string
  transition: string
  pattern: GeneralTask1SentencePattern
  /**
   * Literal Thai gloss of `text`, written so the logical connector is visible in
   * Thai (because → เพราะว่า, although → แม้ว่า, which → ซึ่ง, so → จึง …).
   * The wrong-answer card shows this so a learner can see *from the meaning of
   * this sentence* why that connector is the right one — not just which group
   * the word belongs to. Required: every sentence must carry one.
   */
  thai: string
}

export type GeneralTask1Paragraph = {
  bulletIndex: 0 | 1 | 2
  label: string
  sentences: readonly GeneralTask1Sentence[]
}

export type GeneralTask1PracticalVocab = {
  phrase: string
  thaiMeaning: string
}

export type GeneralTask1Prompt = {
  id: string
  number: number
  register: GeneralTask1Register
  title: string
  taskInstruction: 'You should spend about 20 minutes on this task.'
  situation: string
  recipient: string
  letterInstruction: string
  greeting: `Dear ${string},`
  bullets: readonly [string, string, string]
  paragraphs: readonly [GeneralTask1Paragraph, GeneralTask1Paragraph, GeneralTask1Paragraph]
  minimumWordsInstruction: 'Write at least 150 words.'
  addressInstruction: 'You do NOT need to write any addresses.'
  beginInstruction: `Begin your letter as follows: Dear ${string},`
  signoff: string
  senderName: string
  practicalVocab: readonly GeneralTask1PracticalVocab[]
}

/** @deprecated use GeneralTask1Prompt */
export type GeneralTask1InformalPrompt = GeneralTask1Prompt & { register: 'informal' }

export type RegisterGuidance = {
  rulesLabel: string
  wordTarget: string
  rules: readonly string[]
  classificationCorrect: string
  classificationWrong: string
}

const REGISTER_GUIDANCE: Record<GeneralTask1Register, RegisterGuidance> = {
  informal: {
    rulesLabel: 'INFORMAL LETTER RULES',
    wordTarget: '160–180 words · 3 body paragraphs · 1 bullet per paragraph',
    rules: [
      'ใช้ contractions เช่น I’m, I’ve, I’d, can’t, don’t และ won’t',
      'เน้น and / but / so / so that แทนคำเชื่อมทางการอย่าง therefore หรือ moreover',
      'ทุกประโยคเริ่มด้วย transition ซึ่งต้องลากจากด้านขวา',
      'S + V, V-ing · S + V, which + V · S + V, and/but/so + S + V',
      'ปิดท้ายด้วยคำเป็นกันเอง เช่น Take care, / Lots of love,'
    ],
    classificationCorrect:
      'ถูกต้อง — ผู้รับเป็นเพื่อนหรือคนในครอบครัว จึงต้องใช้ Informal tone, contractions และภาษาที่เป็นกันเอง',
    classificationWrong:
      'ยังไม่ถูก — สังเกตคำว่า “friend” และการขึ้นต้นด้วยชื่อจริง จดหมายฉบับนี้ต้องเป็น Informal แล้วลองอีกครั้ง'
  },
  'semi-formal': {
    rulesLabel: 'SEMI-FORMAL LETTER RULES',
    wordTarget: '160–180 words · 3 body paragraphs · 1 bullet per paragraph',
    rules: [
      'รู้จักผู้รับแต่ยังต้องสุภาพ จึงหลีกเลี่ยง contractions เกือบทั้งหมด',
      'ใช้คำเชื่อมกึ่งทางการ เช่น In addition, Moreover, However, Furthermore',
      'ขอร้องอย่างสุภาพด้วย If possible, Of course, I would be grateful',
      'ทุกประโยคเริ่มด้วย transition ซึ่งต้องลากจากด้านขวา',
      'ปิดท้ายด้วย Kind regards, / Best wishes, / Best regards,'
    ],
    classificationCorrect:
      'ถูกต้อง — คุณรู้จักผู้รับ (ครู เจ้าของบ้าน เพื่อนร่วมงาน) แต่ความสัมพันธ์ยังเป็นทางการ จึงใช้ Semi-formal: สุภาพ ไม่ใช้ contractions พร่ำเพรื่อ',
    classificationWrong:
      'ยังไม่ถูก — ผู้รับเป็นคนที่คุณรู้จักโดยระบุชื่อ/ตำแหน่ง แต่ต้องรักษามารยาท จดหมายนี้จึงเป็น Semi-formal'
  },
  formal: {
    rulesLabel: 'FORMAL LETTER RULES',
    wordTarget: '160–180 words · 3 body paragraphs · 1 bullet per paragraph',
    rules: [
      'ห้ามใช้ contractions — เขียนเต็มเสมอ (I am, do not, cannot)',
      'ใช้คำเชื่อมทางการ เช่น Therefore, However, Furthermore, Consequently',
      'ใช้สำนวนสุภาพทางการ เช่น I am writing to, I would be grateful, at your earliest convenience',
      'ทุกประโยคเริ่มด้วย transition ซึ่งต้องลากจากด้านขวา',
      'ขึ้นต้น Dear Sir or Madam, และปิดท้าย Yours faithfully,'
    ],
    classificationCorrect:
      'ถูกต้อง — คุณไม่รู้จักผู้รับเป็นการส่วนตัว (บริษัท เทศบาล นายจ้าง) จึงต้องใช้ Formal: ภาษาทางการ ไม่มี contractions และปิดท้าย Yours faithfully',
    classificationWrong:
      'ยังไม่ถูก — จดหมายขึ้นต้น Dear Sir or Madam และเขียนถึงองค์กรที่ไม่รู้จักเป็นการส่วนตัว จึงต้องเป็น Formal'
  }
}

export const getRegisterGuidance = (register: GeneralTask1Register): RegisterGuidance =>
  REGISTER_GUIDANCE[register]

const COMMON_INSTRUCTIONS = {
  taskInstruction: 'You should spend about 20 minutes on this task.',
  minimumWordsInstruction: 'Write at least 150 words.',
  addressInstruction: 'You do NOT need to write any addresses.'
} as const

export const GENERAL_TASK1_INFORMAL_PROMPTS = [
  {
    ...COMMON_INSTRUCTIONS,
    id: 'gt-t1-informal-moving-home',
    number: 1,
    register: 'informal',
    title: 'A New Home in Another City',
    situation:
      'You have recently moved to a new city and are settling into your new home. You would like a friend to come and stay with you.',
    recipient: 'friend',
    letterInstruction: 'Write a letter to your friend. In your letter:',
    greeting: 'Dear Alex,',
    bullets: [
      'explain why you moved to the new city',
      'describe your new home and the area around it',
      'invite your friend to visit and suggest what you could do together'
    ],
    paragraphs: [
      {
        bulletIndex: 0,
        label: 'Reason for moving',
        sentences: [
          {
            text: 'First of all, I moved to Bristol because I got the design job I told you about.',
            transition: 'First of all,',
            pattern: 'subordinator-middle',
            thai: 'อย่างแรกเลย ฉันย้ายมาอยู่บริสตอลเพราะว่าฉันได้งานออกแบบที่ฉันเคยเล่าให้เธอฟัง'
          },
          {
            text: 'Honestly, I couldn’t turn the offer down, and I’m already enjoying the friendly team.',
            transition: 'Honestly,',
            pattern: 'coordinating',
            thai: 'พูดตามตรง ฉันไม่สามารถปฏิเสธข้อเสนอนี้ได้ และตอนนี้ฉันก็สนุกกับทีมที่เป็นมิตรแล้ว'
          },
          {
            text: 'Also, I’ve wanted a fresh start for ages, making this move feel just right.',
            transition: 'Also,',
            pattern: 'sv-gerund',
            thai: 'อีกอย่างหนึ่ง ฉันอยากเริ่มต้นใหม่มานานมากแล้ว ซึ่งทำให้การย้ายครั้งนี้รู้สึกถูกต้องพอดี'
          }
        ]
      },
      {
        bulletIndex: 1,
        label: 'The home and neighbourhood',
        sentences: [
          {
            text: 'By the way, I’m renting a bright little flat, which has a spare room for guests.',
            transition: 'By the way,',
            pattern: 'sv-which',
            thai: 'อ้อ อีกเรื่องหนึ่ง ฉันกำลังเช่าแฟลตเล็ก ๆ ที่สว่าง ซึ่งมีห้องว่างสำหรับแขก'
          },
          {
            text: 'Luckily, it’s beside a quiet park, so I can walk there after work.',
            transition: 'Luckily,',
            pattern: 'coordinating',
            thai: 'โชคดีที่มันอยู่ติดกับสวนสาธารณะที่เงียบสงบ ฉันจึงเดินไปที่นั่นได้หลังเลิกงาน'
          },
          {
            text: 'However, I can’t see the city centre from my window, although the bus only takes ten minutes.',
            transition: 'However,',
            pattern: 'subordinator-middle',
            thai: 'อย่างไรก็ตาม ฉันมองไม่เห็นใจกลางเมืองจากหน้าต่างของฉัน แม้ว่ารถเมล์จะใช้เวลาเพียงสิบนาที'
          },
          {
            text: 'For example, there’s a friendly café across the road, so I’ve already found a good place for breakfast.',
            transition: 'For example,',
            pattern: 'coordinating',
            thai: 'ตัวอย่างเช่น มีคาเฟ่ที่เป็นมิตรอยู่ฝั่งตรงข้ามถนน ฉันจึงได้เจอที่กินอาหารเช้าดี ๆ แล้ว'
          }
        ]
      },
      {
        bulletIndex: 2,
        label: 'Invitation and plans',
        sentences: [
          {
            text: 'Anyway, I’d love you to stay next month because I’ll have finished unpacking by then.',
            transition: 'Anyway,',
            pattern: 'subordinator-middle',
            thai: 'เอาเป็นว่า ฉันอยากให้เธอมาพักเดือนหน้ามาก เพราะว่าถึงตอนนั้นฉันจะจัดของออกจากกล่องเสร็จแล้ว'
          },
          {
            text: 'Most importantly, we’ll try the street market, and we’ll take a boat trip around the harbour.',
            transition: 'Most importantly,',
            pattern: 'coordinating',
            thai: 'ที่สำคัญที่สุดคือ เราจะไปลองเดินตลาดริมถนน และเราจะนั่งเรือเที่ยวรอบท่าเรือ'
          },
          {
            text: 'Finally, I won’t plan every minute, giving us plenty of time to relax and catch up.',
            transition: 'Finally,',
            pattern: 'sv-gerund',
            thai: 'สุดท้ายนี้ ฉันจะไม่วางแผนทุกนาที ซึ่งทำให้เรามีเวลาเหลือเฟือที่จะพักผ่อนและพูดคุยอัปเดตชีวิตกัน'
          }
        ]
      }
    ],
    beginInstruction: 'Begin your letter as follows: Dear Alex,',
    signoff: 'Take care,',
    senderName: 'Sam',
    practicalVocab: [
      { phrase: 'settle into a new home', thaiMeaning: 'ปรับตัวเข้ากับบ้านใหม่' },
      { phrase: 'turn an offer down', thaiMeaning: 'ปฏิเสธข้อเสนอ' },
      { phrase: 'fresh start', thaiMeaning: 'การเริ่มต้นใหม่' },
      { phrase: 'spare room', thaiMeaning: 'ห้องว่างสำหรับแขก' },
      { phrase: 'finish unpacking', thaiMeaning: 'จัดของออกจากกล่องเสร็จ' },
      { phrase: 'catch up', thaiMeaning: 'พูดคุยอัปเดตชีวิตกัน' }
    ]
  },
  {
    ...COMMON_INSTRUCTIONS,
    id: 'gt-t1-informal-missed-celebration',
    number: 2,
    register: 'informal',
    title: 'Missing a Friend’s Celebration',
    situation:
      'Your friend recently had a special celebration, but you were unable to attend. You would like to arrange another time to meet.',
    recipient: 'friend',
    letterInstruction: 'Write a letter to your friend. In your letter:',
    greeting: 'Dear Mia,',
    bullets: [
      'explain why you could not attend the celebration',
      'say how you felt about missing it',
      'suggest another time to meet and what you could do'
    ],
    paragraphs: [
      {
        bulletIndex: 0,
        label: 'Reason for missing the event',
        sentences: [
          {
            text: 'First of all, I couldn’t come to your birthday dinner because I came down with a nasty cold.',
            transition: 'First of all,',
            pattern: 'subordinator-middle',
            thai: 'อย่างแรกเลย ฉันไปงานเลี้ยงวันเกิดของเธอไม่ได้ เพราะว่าฉันเป็นหวัดหนักมาก'
          },
          {
            text: 'Honestly, I’d put on my new jacket, but I suddenly started feeling awful that afternoon.',
            transition: 'Honestly,',
            pattern: 'coordinating',
            thai: 'พูดตามตรง ฉันใส่แจ็คเก็ตตัวใหม่เรียบร้อยแล้ว แต่จู่ ๆ ฉันก็เริ่มรู้สึกแย่มากในบ่ายวันนั้น'
          },
          {
            text: 'Luckily, I stayed at home, avoiding the risk of passing it to everyone.',
            transition: 'Luckily,',
            pattern: 'sv-gerund',
            thai: 'โชคดีที่ฉันอยู่บ้าน ซึ่งเป็นการเลี่ยงความเสี่ยงที่จะแพร่เชื้อให้ทุกคน'
          },
          {
            text: 'By the way, my doctor told me to rest, so I couldn’t even leave the house to buy medicine.',
            transition: 'By the way,',
            pattern: 'coordinating',
            thai: 'อ้อ อีกเรื่องหนึ่ง หมอบอกให้ฉันพักผ่อน ฉันจึงออกจากบ้านไปซื้อยาไม่ได้ด้วยซ้ำ'
          }
        ]
      },
      {
        bulletIndex: 1,
        label: 'Feelings about missing it',
        sentences: [
          {
            text: 'However, I’m really sorry I missed your big evening, which sounded like great fun.',
            transition: 'However,',
            pattern: 'sv-which',
            thai: 'อย่างไรก็ตาม ฉันเสียใจจริง ๆ ที่พลาดค่ำคืนสำคัญของเธอ ซึ่งฟังดูสนุกมาก'
          },
          {
            text: 'Also, I felt terrible when I saw the photos because everyone looked so happy together.',
            transition: 'Also,',
            pattern: 'subordinator-middle',
            thai: 'อีกอย่างหนึ่ง ฉันรู้สึกแย่มากเมื่อฉันเห็นรูปถ่าย เพราะว่าทุกคนดูมีความสุขมากเมื่ออยู่ด้วยกัน'
          },
          {
            text: 'Most importantly, I hope you don’t think I forgot, and I’ve still got your present here.',
            transition: 'Most importantly,',
            pattern: 'coordinating',
            thai: 'ที่สำคัญที่สุดคือ ฉันหวังว่าเธอจะไม่คิดว่าฉันลืม และของขวัญของเธอก็ยังอยู่กับฉันที่นี่'
          }
        ]
      },
      {
        bulletIndex: 2,
        label: 'A new meeting',
        sentences: [
          {
            text: 'Anyway, I’d like to see you this Saturday, so we can have our own small celebration.',
            transition: 'Anyway,',
            pattern: 'coordinating',
            thai: 'เอาเป็นว่า ฉันอยากเจอเธอวันเสาร์นี้ เราจึงจะได้จัดงานฉลองเล็ก ๆ ของเราเอง'
          },
          {
            text: 'For example, we could meet at that Italian café, which serves the chocolate cake you love.',
            transition: 'For example,',
            pattern: 'sv-which',
            thai: 'ตัวอย่างเช่น เราอาจเจอกันที่คาเฟ่อิตาเลียนร้านนั้น ซึ่งขายเค้กช็อกโกแลตที่เธอชอบ'
          },
          {
            text: 'Finally, I’ll book us a table when you tell me what time suits you.',
            transition: 'Finally,',
            pattern: 'subordinator-middle',
            thai: 'สุดท้ายนี้ ฉันจะจองโต๊ะให้เรา เมื่อเธอบอกฉันว่าเวลาไหนสะดวกสำหรับเธอ'
          }
        ]
      }
    ],
    beginInstruction: 'Begin your letter as follows: Dear Mia,',
    signoff: 'Lots of love,',
    senderName: 'Jamie',
    practicalVocab: [
      { phrase: 'come down with a cold', thaiMeaning: 'เริ่มป่วยเป็นหวัด' },
      { phrase: 'feel awful', thaiMeaning: 'รู้สึกแย่มากหรือไม่สบายมาก' },
      { phrase: 'pass it to someone', thaiMeaning: 'แพร่เชื้อให้ใครบางคน' },
      { phrase: 'big evening', thaiMeaning: 'ค่ำคืนสำคัญ' },
      { phrase: 'small celebration', thaiMeaning: 'งานฉลองเล็ก ๆ' },
      { phrase: 'book a table', thaiMeaning: 'จองโต๊ะ' }
    ]
  },
  {
    ...COMMON_INSTRUCTIONS,
    id: 'gt-t1-informal-workplace-advice',
    number: 3,
    register: 'informal',
    title: 'Advice About a Workplace Problem',
    situation:
      'A friend has told you about a problem with a colleague at work. You had a similar experience in the past.',
    recipient: 'friend',
    letterInstruction: 'Write a letter to your friend. In your letter:',
    greeting: 'Dear Ben,',
    bullets: [
      'describe the similar workplace problem you experienced',
      'explain what you did to improve the situation',
      'give your friend advice about dealing with the problem'
    ],
    paragraphs: [
      {
        bulletIndex: 0,
        label: 'A similar experience',
        sentences: [
          {
            text: 'First of all, I understand your problem because I worked with someone who kept taking credit for my ideas.',
            transition: 'First of all,',
            pattern: 'subordinator-middle',
            thai: 'อย่างแรกเลย ฉันเข้าใจปัญหาของนาย เพราะว่าฉันเคยทำงานกับคนที่คอยรับความดีความชอบจากความคิดของฉัน'
          },
          {
            text: 'Honestly, I couldn’t say anything during meetings, and I’d leave work feeling angry and ignored.',
            transition: 'Honestly,',
            pattern: 'coordinating',
            thai: 'พูดตามตรง ฉันพูดอะไรไม่ได้เลยระหว่างการประชุม และฉันก็กลับบ้านด้วยความรู้สึกโกรธและถูกมองข้าม'
          },
          {
            text: 'Also, he’d interrupt me every time, making it hard for our manager to hear my full plan.',
            transition: 'Also,',
            pattern: 'sv-gerund',
            thai: 'อีกอย่างหนึ่ง เขาจะพูดแทรกฉันทุกครั้ง ซึ่งทำให้ผู้จัดการของเราได้ยินแผนเต็ม ๆ ของฉันได้ยาก'
          },
          {
            text: 'For example, he’d repeat my suggestions later, which made them sound like his own.',
            transition: 'For example,',
            pattern: 'sv-which',
            thai: 'ตัวอย่างเช่น เขาจะพูดข้อเสนอของฉันซ้ำอีกทีในภายหลัง ซึ่งทำให้มันฟังดูเหมือนเป็นของเขาเอง'
          }
        ]
      },
      {
        bulletIndex: 1,
        label: 'What helped',
        sentences: [
          {
            text: 'Luckily, I started writing down each example, which gave me clear facts instead of guesses.',
            transition: 'Luckily,',
            pattern: 'sv-which',
            thai: 'โชคดีที่ฉันเริ่มจดแต่ละตัวอย่างเอาไว้ ซึ่งทำให้ฉันมีข้อเท็จจริงที่ชัดเจนแทนที่จะเป็นการเดา'
          },
          {
            text: 'Then, I spoke to him privately because I didn’t want to embarrass him in front of the team.',
            transition: 'Then,',
            pattern: 'subordinator-middle',
            thai: 'จากนั้น ฉันคุยกับเขาเป็นการส่วนตัว เพราะว่าฉันไม่อยากทำให้เขาขายหน้าต่อหน้าทีม'
          },
          {
            text: 'Afterwards, he apologised, and we agreed to share our ideas more fairly in meetings.',
            transition: 'Afterwards,',
            pattern: 'coordinating',
            thai: 'หลังจากนั้น เขาขอโทษ และเราตกลงกันว่าจะแบ่งปันความคิดของเราอย่างเป็นธรรมมากขึ้นในการประชุม'
          }
        ]
      },
      {
        bulletIndex: 2,
        label: 'Advice',
        sentences: [
          {
            text: 'Anyway, I’d keep a short record of each problem, so you’ll have specific examples to discuss.',
            transition: 'Anyway,',
            pattern: 'coordinating',
            thai: 'เอาเป็นว่า ถ้าเป็นฉัน ฉันจะเก็บบันทึกสั้น ๆ ของแต่ละปัญหาไว้ นายจึงจะมีตัวอย่างที่เจาะจงไว้พูดคุย'
          },
          {
            text: 'Most importantly, talk calmly to your colleague when you’re both free.',
            transition: 'Most importantly,',
            pattern: 'subordinator-middle',
            thai: 'ที่สำคัญที่สุดคือ จงคุยกับเพื่อนร่วมงานของนายอย่างใจเย็น เมื่อทั้งสองคนว่าง'
          },
          {
            text: 'Finally, you can ask your manager for help, which won’t seem unreasonable if nothing changes.',
            transition: 'Finally,',
            pattern: 'sv-which',
            thai: 'สุดท้ายนี้ นายสามารถขอความช่วยเหลือจากผู้จัดการได้ ซึ่งจะไม่ดูเกินเหตุเลยถ้าไม่มีอะไรเปลี่ยนแปลง'
          }
        ]
      }
    ],
    beginInstruction: 'Begin your letter as follows: Dear Ben,',
    signoff: 'All the best,',
    senderName: 'Chris',
    practicalVocab: [
      { phrase: 'take credit for an idea', thaiMeaning: 'รับความดีความชอบจากความคิดของผู้อื่น' },
      { phrase: 'interrupt someone', thaiMeaning: 'พูดแทรกใครบางคน' },
      { phrase: 'write down an example', thaiMeaning: 'จดตัวอย่างไว้' },
      { phrase: 'speak privately', thaiMeaning: 'พูดคุยเป็นการส่วนตัว' },
      { phrase: 'keep a record', thaiMeaning: 'เก็บบันทึก' },
      { phrase: 'ask a manager for help', thaiMeaning: 'ขอความช่วยเหลือจากผู้จัดการ' }
    ]
  },
  {
    ...COMMON_INSTRUCTIONS,
    id: 'gt-t1-informal-left-watch',
    number: 4,
    register: 'informal',
    title: 'A Watch Left at a Friend’s Home',
    situation:
      'You recently stayed at a friend’s home and think you left your watch there after your visit.',
    recipient: 'friend',
    letterInstruction: 'Write a letter to your friend. In your letter:',
    greeting: 'Dear Lily,',
    bullets: [
      'describe the watch and say where you think you left it',
      'explain why the watch is important to you',
      'ask your friend to look for it and suggest how it can be returned'
    ],
    paragraphs: [
      {
        bulletIndex: 0,
        label: 'Description and location',
        sentences: [
          {
            text: 'First of all, I think I left my watch at your place when I stayed last weekend.',
            transition: 'First of all,',
            pattern: 'subordinator-middle',
            thai: 'อย่างแรกเลย ฉันคิดว่าฉันลืมนาฬิกาไว้ที่บ้านของเธอ เมื่อฉันไปพักเมื่อสุดสัปดาห์ที่แล้ว'
          },
          {
            text: 'By the way, it’s a small silver watch, which has a dark blue leather strap.',
            transition: 'By the way,',
            pattern: 'sv-which',
            thai: 'อ้อ อีกเรื่องหนึ่ง มันเป็นนาฬิกาสีเงินเรือนเล็ก ซึ่งมีสายหนังสีน้ำเงินเข้ม'
          },
          {
            text: 'Honestly, I’d taken it off beside the bathroom sink, and I probably forgot to put it back on.',
            transition: 'Honestly,',
            pattern: 'coordinating',
            thai: 'พูดตามตรง ฉันถอดมันออกไว้ข้างอ่างล้างหน้าในห้องน้ำ และฉันคงลืมใส่มันกลับคืน'
          }
        ]
      },
      {
        bulletIndex: 1,
        label: 'Why it matters',
        sentences: [
          {
            text: 'Most importantly, I can’t replace it because my grandparents gave it to me for my eighteenth birthday.',
            transition: 'Most importantly,',
            pattern: 'subordinator-middle',
            thai: 'ที่สำคัญที่สุดคือ ฉันหามาแทนไม่ได้ เพราะว่าปู่ย่าให้มันกับฉันเป็นของขวัญวันเกิดครบสิบแปดปี'
          },
          {
            text: 'Also, I’ve worn it on every family holiday, making it full of lovely memories.',
            transition: 'Also,',
            pattern: 'sv-gerund',
            thai: 'อีกอย่างหนึ่ง ฉันใส่มันไปทุกทริปวันหยุดของครอบครัว ซึ่งทำให้มันเต็มไปด้วยความทรงจำที่ดี'
          },
          {
            text: 'However, it isn’t expensive, but I’d be really upset if it disappeared.',
            transition: 'However,',
            pattern: 'coordinating',
            thai: 'อย่างไรก็ตาม มันไม่ได้แพง แต่ฉันจะเสียใจมากจริง ๆ ถ้ามันหายไป'
          },
          {
            text: 'For example, it reminds me of them, so I’d hate to lose it.',
            transition: 'For example,',
            pattern: 'coordinating',
            thai: 'ตัวอย่างเช่น มันทำให้ฉันนึกถึงพวกท่าน ฉันจึงไม่อยากทำมันหายเลย'
          }
        ]
      },
      {
        bulletIndex: 2,
        label: 'Search and return',
        sentences: [
          {
            text: 'Anyway, could you check near the sink and under the towels when you have a moment?',
            transition: 'Anyway,',
            pattern: 'subordinator-middle',
            thai: 'เอาเป็นว่า เธอช่วยดูแถวอ่างล้างหน้าและใต้ผ้าเช็ดตัวให้หน่อยได้ไหม เมื่อเธอมีเวลาสักครู่'
          },
          {
            text: 'Luckily, I’ll be near your office on Tuesday, so I can collect it at lunchtime.',
            transition: 'Luckily,',
            pattern: 'coordinating',
            thai: 'โชคดีที่ฉันจะอยู่แถวออฟฟิศของเธอในวันอังคาร ฉันจึงไปรับมันได้ตอนพักกลางวัน'
          },
          {
            text: 'Finally, you could post it in a padded envelope, which won’t cost much if Tuesday doesn’t work.',
            transition: 'Finally,',
            pattern: 'sv-which',
            thai: 'สุดท้ายนี้ เธออาจส่งมันทางไปรษณีย์ในซองกันกระแทก ซึ่งจะไม่แพงมาก ถ้าวันอังคารไม่สะดวก'
          }
        ]
      }
    ],
    beginInstruction: 'Begin your letter as follows: Dear Lily,',
    signoff: 'See you soon,',
    senderName: 'Taylor',
    practicalVocab: [
      { phrase: 'leave something at your place', thaiMeaning: 'ลืมของไว้ที่บ้านของคุณ' },
      { phrase: 'leather strap', thaiMeaning: 'สายนาฬิกาหนัง' },
      { phrase: 'put it back on', thaiMeaning: 'ใส่มันกลับคืน' },
      { phrase: 'lovely memories', thaiMeaning: 'ความทรงจำที่ดี' },
      { phrase: 'have a moment', thaiMeaning: 'มีเวลาสักครู่' },
      { phrase: 'padded envelope', thaiMeaning: 'ซองกันกระแทก' }
    ]
  },
  {
    ...COMMON_INSTRUCTIONS,
    id: 'gt-t1-informal-thank-you-stay',
    number: 5,
    register: 'informal',
    title: 'Thanking a Friend After Staying With Them',
    situation:
      'You recently stayed at a friend’s home for several weeks while you were looking for work. You have now found a job in another city.',
    recipient: 'friend',
    letterInstruction: 'Write a letter to your friend. In your letter:',
    greeting: 'Dear Jamie,',
    bullets: [
      'thank your friend for letting you stay with them',
      'tell your friend what has happened since you went home',
      'invite your friend to visit you in your new city'
    ],
    paragraphs: [
      {
        bulletIndex: 0,
        label: 'Thanking your friend',
        sentences: [
          {
            text: 'First of all, I’m writing to thank you for letting me stay while I was job-hunting.',
            transition: 'First of all,',
            pattern: 'subordinator-middle',
            thai: 'อย่างแรกเลย ฉันเขียนมาเพื่อขอบคุณที่ให้ฉันพักด้วย ขณะที่ฉันกำลังหางาน'
          },
          {
            text: 'Honestly, your spare room felt like home, and I’ll never forget those late-night chats about our old school days.',
            transition: 'Honestly,',
            pattern: 'coordinating',
            thai: 'พูดตามตรง ห้องว่างของเธอให้ความรู้สึกเหมือนบ้าน และฉันจะไม่มีวันลืมการนั่งคุยกันดึก ๆ เรื่องสมัยเรียนของพวกเรา'
          },
          {
            text: 'Also, you cooked every single evening, which saved me a fortune during a very tight month.',
            transition: 'Also,',
            pattern: 'sv-which',
            thai: 'อีกอย่างหนึ่ง เธอทำอาหารให้ทุกเย็นเลย ซึ่งช่วยฉันประหยัดเงินไปได้มากในเดือนที่การเงินตึงมาก'
          }
        ]
      },
      {
        bulletIndex: 1,
        label: 'News since you went home',
        sentences: [
          {
            text: 'By the way, I’ve finally found a job in Leeds, so I’m moving there in March.',
            transition: 'By the way,',
            pattern: 'coordinating',
            thai: 'อ้อ อีกเรื่องหนึ่ง ในที่สุดฉันก็หางานที่เมืองลีดส์ได้แล้ว ฉันจึงจะย้ายไปอยู่ที่นั่นในเดือนมีนาคม'
          },
          {
            text: 'Luckily, the office is tiny, which makes it easy to get to know everyone on my team.',
            transition: 'Luckily,',
            pattern: 'sv-which',
            thai: 'โชคดีที่ ออฟฟิศเล็กมาก ซึ่งทำให้ง่ายที่จะทำความรู้จักกับทุกคนในทีมของฉัน'
          },
          {
            text: 'Anyway, I can’t start until April because they’re still sorting out my contract.',
            transition: 'Anyway,',
            pattern: 'subordinator-middle',
            thai: 'เอาเป็นว่า ฉันยังเริ่มงานไม่ได้จนกว่าจะถึงเดือนเมษายน เพราะว่าพวกเขายังจัดการเรื่องสัญญาของฉันไม่เสร็จ'
          },
          {
            text: 'For example, I’ve been reading up on the city, hoping to find a flat near the canal.',
            transition: 'For example,',
            pattern: 'sv-gerund',
            thai: 'ตัวอย่างเช่น ฉันได้อ่านหาข้อมูลเกี่ยวกับเมืองนี้มาเรื่อย ๆ โดยหวังว่าจะหาห้องเช่าใกล้ ๆ คลองได้'
          }
        ]
      },
      {
        bulletIndex: 2,
        label: 'Inviting your friend',
        sentences: [
          {
            text: 'Most importantly, you must come and stay once I’ve settled in, and I’ll show you around.',
            transition: 'Most importantly,',
            pattern: 'coordinating',
            thai: 'ที่สำคัญที่สุดคือ เธอต้องมาพักด้วยกันนะเมื่อฉันตั้งตัวได้แล้ว และฉันจะพาเธอเที่ยวรอบ ๆ'
          },
          {
            text: 'Then, we’ll walk along the canal, and we’ll try the food market by the station on Saturday morning.',
            transition: 'Then,',
            pattern: 'coordinating',
            thai: 'จากนั้น พวกเราจะเดินเล่นเลียบคลอง และพวกเราจะไปลองตลาดอาหารข้างสถานีในเช้าวันเสาร์'
          },
          {
            text: 'Finally, I won’t take no for an answer, so you’d better start looking at train times.',
            transition: 'Finally,',
            pattern: 'coordinating',
            thai: 'สุดท้ายนี้ ฉันจะไม่ยอมรับคำปฏิเสธ เธอจึงควรเริ่มดูตารางเวลารถไฟได้แล้ว'
          }
        ]
      }
    ],
    beginInstruction: 'Begin your letter as follows: Dear Jamie,',
    signoff: 'Take care,',
    senderName: 'Robin',
    practicalVocab: [
      { phrase: 'put someone up', thaiMeaning: 'ให้ที่พักแก่ใครบางคน' },
      { phrase: 'job-hunting', thaiMeaning: 'การหางาน' },
      { phrase: 'save someone a fortune', thaiMeaning: 'ช่วยประหยัดเงินได้มาก' },
      { phrase: 'sort out a contract', thaiMeaning: 'จัดการเรื่องสัญญาให้เรียบร้อย' },
      { phrase: 'settle in', thaiMeaning: 'ตั้งตัว/ปรับตัวเข้าที่' },
      { phrase: 'take no for an answer', thaiMeaning: 'ยอมรับคำปฏิเสธ' }
    ]
  },
  {
    ...COMMON_INSTRUCTIONS,
    id: 'gt-t1-informal-new-hobby',
    number: 6,
    register: 'informal',
    title: 'A New Hobby You Have Taken Up',
    situation:
      'You have recently started a new sport and are enjoying it very much. You want to tell a friend about it and persuade them to try it too.',
    recipient: 'friend',
    letterInstruction: 'Write a letter to your friend. In your letter:',
    greeting: 'Dear Chris,',
    bullets: [
      'explain what your new hobby is and how you started it',
      'describe what you enjoy most about it',
      'invite your friend to try it with you'
    ],
    paragraphs: [
      {
        bulletIndex: 0,
        label: 'The hobby and how it started',
        sentences: [
          {
            text: 'First of all, I’ve taken up rock climbing because my neighbour finally dragged me along to the new gym in town.',
            transition: 'First of all,',
            pattern: 'subordinator-middle',
            thai: 'อย่างแรกเลย ฉันเริ่มเล่นปีนผาแล้ว เพราะว่าเพื่อนบ้านของฉันลากฉันไปที่ยิมแห่งใหม่ในเมืองเสียที'
          },
          {
            text: 'Honestly, I was absolutely terrible at first, but I’m slowly getting stronger every single week.',
            transition: 'Honestly,',
            pattern: 'coordinating',
            thai: 'พูดตามตรง ตอนแรกฉันแย่มาก ๆ แต่ฉันก็ค่อย ๆ แข็งแรงขึ้นทุกสัปดาห์'
          },
          {
            text: 'Also, the walls are colour-coded by difficulty, which makes it easy to pick a sensible route.',
            transition: 'Also,',
            pattern: 'sv-which',
            thai: 'อีกอย่างหนึ่ง ผนังปีนถูกแบ่งสีตามระดับความยาก ซึ่งทำให้ง่ายที่จะเลือกเส้นทางที่เหมาะกับตัวเอง'
          }
        ]
      },
      {
        bulletIndex: 1,
        label: 'What you enjoy about it',
        sentences: [
          {
            text: 'By the way, I go three evenings a week now, so I’ve got much fitter than I was last year.',
            transition: 'By the way,',
            pattern: 'coordinating',
            thai: 'อ้อ อีกเรื่องหนึ่ง ตอนนี้ฉันไปสัปดาห์ละสามเย็น ฉันจึงฟิตขึ้นกว่าปีที่แล้วมาก'
          },
          {
            text: 'For example, I managed a really tough overhang last Friday, which felt like a huge breakthrough.',
            transition: 'For example,',
            pattern: 'sv-which',
            thai: 'ตัวอย่างเช่น ฉันปีนผาส่วนที่ยื่นออกมาซึ่งยากมากได้สำเร็จเมื่อวันศุกร์ที่แล้ว ซึ่งรู้สึกเหมือนเป็นก้าวกระโดดครั้งใหญ่'
          },
          {
            text: 'Luckily, nobody there minds complete beginners, making the whole place feel really welcoming.',
            transition: 'Luckily,',
            pattern: 'sv-gerund',
            thai: 'โชคดีที่ ไม่มีใครที่นั่นรังเกียจมือใหม่เลย ทำให้ที่แห่งนั้นรู้สึกเป็นมิตรมาก'
          },
          {
            text: 'However, I can’t climb outdoors yet although the club runs trips to Wales every summer.',
            transition: 'However,',
            pattern: 'subordinator-middle',
            thai: 'อย่างไรก็ตาม ฉันยังปีนกลางแจ้งไม่ได้ แม้ว่าชมรมจะจัดทริปไปเวลส์ทุกฤดูร้อน'
          }
        ]
      },
      {
        bulletIndex: 2,
        label: 'Inviting your friend to try',
        sentences: [
          {
            text: 'Anyway, you’d absolutely love it because you’ve always been far braver than me.',
            transition: 'Anyway,',
            pattern: 'subordinator-middle',
            thai: 'เอาเป็นว่า เธอต้องชอบมันมากแน่ ๆ เพราะว่าเธอกล้ากว่าฉันมาตลอด'
          },
          {
            text: 'Most importantly, the gym does a free taster session for visitors, so you won’t waste any money.',
            transition: 'Most importantly,',
            pattern: 'coordinating',
            thai: 'ที่สำคัญที่สุดคือ ยิมมีคลาสทดลองฟรีสำหรับผู้มาเยือน เธอจึงจะไม่เสียเงินสักบาท'
          },
          {
            text: 'Finally, I’ll lend you my spare shoes and harness, saving you a trip to the shop.',
            transition: 'Finally,',
            pattern: 'sv-gerund',
            thai: 'สุดท้ายนี้ ฉันจะให้เธอยืมรองเท้าและสายรัดตัวสำรองของฉัน ช่วยให้เธอไม่ต้องเสียเวลาไปร้าน'
          }
        ]
      }
    ],
    beginInstruction: 'Begin your letter as follows: Dear Chris,',
    signoff: 'Take care,',
    senderName: 'Alex',
    practicalVocab: [
      { phrase: 'take up a hobby', thaiMeaning: 'เริ่มเล่นงานอดิเรกใหม่' },
      { phrase: 'drag someone along', thaiMeaning: 'ลากใครบางคนไปด้วย' },
      { phrase: 'colour-coded', thaiMeaning: 'แบ่งด้วยรหัสสี' },
      { phrase: 'get fitter', thaiMeaning: 'ฟิตขึ้น/แข็งแรงขึ้น' },
      { phrase: 'taster session', thaiMeaning: 'คลาสทดลองเรียนฟรี' },
      { phrase: 'spare shoes', thaiMeaning: 'รองเท้าสำรอง' }
    ]
  }
] as const satisfies readonly GeneralTask1Prompt[]

export const GENERAL_TASK1_SEMIFORMAL_PROMPTS = [
  {
    ...COMMON_INSTRUCTIONS,
    id: 'gt-t1-semiformal-reference-request',
    number: 1,
    register: 'semi-formal',
    title: 'Requesting a Reference from a Teacher',
    situation:
      'You are applying for a university course and would like a former teacher, whom you know well, to write a reference for you.',
    recipient: 'a former teacher',
    letterInstruction: 'Write a letter to your former teacher. In your letter:',
    greeting: 'Dear Mr Hughes,',
    bullets: [
      'remind the teacher who you are and which course you are applying for',
      'explain why you are asking this particular teacher',
      'say what you need from them and by when'
    ],
    paragraphs: [
      {
        bulletIndex: 0,
        label: 'Who you are and the course',
        sentences: [
          {
            text: 'First of all, I hope you are keeping well since I finished my studies at Greenfield College.',
            transition: 'First of all,',
            pattern: 'subordinator-middle',
            thai: 'อย่างแรกเลย ผมหวังว่าคุณครูจะสบายดี ตั้งแต่ที่ผมเรียนจบจากวิทยาลัยกรีนฟิลด์'
          },
          {
            text: 'As you may remember, I was in your economics class, and I am now applying for a business degree.',
            transition: 'As you may remember,',
            pattern: 'coordinating',
            thai: 'อย่างที่คุณครูอาจจำได้ ผมเคยเรียนอยู่ในคาบวิชาเศรษฐศาสตร์ของคุณครู และตอนนี้ผมกำลังสมัครเรียนปริญญาด้านธุรกิจ'
          },
          {
            text: 'In fact, the course begins in September, making a strong reference very valuable to me.',
            transition: 'In fact,',
            pattern: 'sv-gerund',
            thai: 'อันที่จริง หลักสูตรนี้จะเริ่มในเดือนกันยายน ซึ่งทำให้จดหมายรับรองที่หนักแน่นมีค่ามากสำหรับผม'
          }
        ]
      },
      {
        bulletIndex: 1,
        label: 'Why I am asking you',
        sentences: [
          {
            text: 'Firstly, you taught me for two years, so you understand my strengths better than anyone.',
            transition: 'Firstly,',
            pattern: 'coordinating',
            thai: 'ประการแรก คุณครูสอนผมมาสองปี ดังนั้นคุณครูจึงเข้าใจจุดแข็งของผมดีกว่าใคร'
          },
          {
            text: 'Moreover, you supervised my final project, which received the top mark in our year.',
            transition: 'Moreover,',
            pattern: 'sv-which',
            thai: 'ยิ่งไปกว่านั้น คุณครูเป็นผู้ดูแลโปรเจกต์จบของผม ซึ่งได้คะแนนสูงสุดในรุ่นของเรา'
          },
          {
            text: 'Honestly, I trust your judgement because you always gave me fair and useful feedback.',
            transition: 'Honestly,',
            pattern: 'subordinator-middle',
            thai: 'พูดตามตรง ผมเชื่อมั่นในวิจารณญาณของคุณครู เพราะว่าคุณครูให้คำติชมที่ยุติธรรมและเป็นประโยชน์แก่ผมเสมอ'
          }
        ]
      },
      {
        bulletIndex: 2,
        label: 'What I need and when',
        sentences: [
          {
            text: 'If possible, could you send the reference to the university before the tenth of May?',
            transition: 'If possible,',
            pattern: 'subordinator-middle',
            thai: 'ถ้าเป็นไปได้ คุณครูช่วยส่งจดหมายรับรองไปยังมหาวิทยาลัย ก่อนที่จะถึงวันที่สิบพฤษภาคมได้ไหมครับ'
          },
          {
            text: 'Of course, I am happy to share my transcript and personal statement to help you write it.',
            transition: 'Of course,',
            pattern: 'subordinator-middle',
            thai: 'แน่นอนว่า ผมยินดีที่จะส่งใบแสดงผลการเรียนและเรียงความแนะนำตัวของผมให้ เพื่อที่จะช่วยให้คุณครูเขียนมันได้ง่ายขึ้น'
          },
          {
            text: 'Finally, please let me know if you need any more details, and I will send them straightaway.',
            transition: 'Finally,',
            pattern: 'coordinating',
            thai: 'สุดท้ายนี้ กรุณาแจ้งให้ผมทราบ ถ้าคุณครูต้องการรายละเอียดเพิ่มเติม และผมจะส่งให้ทันที'
          }
        ]
      }
    ],
    beginInstruction: 'Begin your letter as follows: Dear Mr Hughes,',
    signoff: 'Kind regards,',
    senderName: 'Daniel Carter',
    practicalVocab: [
      { phrase: 'keep well', thaiMeaning: 'สบายดี' },
      { phrase: 'apply for a degree', thaiMeaning: 'สมัครเรียนระดับปริญญา' },
      { phrase: 'top mark', thaiMeaning: 'คะแนนสูงสุด' },
      { phrase: 'fair feedback', thaiMeaning: 'คำติชมที่ยุติธรรม' },
      { phrase: 'personal statement', thaiMeaning: 'เรียงความแนะนำตัว' },
      { phrase: 'kind regards', thaiMeaning: 'คำลงท้ายกึ่งทางการ' }
    ]
  },
  {
    ...COMMON_INSTRUCTIONS,
    id: 'gt-t1-semiformal-landlord-repair',
    number: 2,
    register: 'semi-formal',
    title: 'Reporting a Repair to Your Landlord',
    situation:
      'You have been renting a flat for a year and a problem has developed that your landlord needs to fix.',
    recipient: 'your landlord',
    letterInstruction: 'Write a letter to your landlord. In your letter:',
    greeting: 'Dear Mrs Aldridge,',
    bullets: [
      'describe the problem with the flat',
      'explain how it is affecting you',
      'say what you would like the landlord to do'
    ],
    paragraphs: [
      {
        bulletIndex: 0,
        label: 'The problem',
        sentences: [
          {
            text: 'First of all, I am writing about the heating in the flat, which stopped working last Tuesday.',
            transition: 'First of all,',
            pattern: 'sv-which',
            thai: 'อย่างแรกเลย ดิฉันเขียนมาเกี่ยวกับเครื่องทำความร้อนในอพาร์ตเมนต์ ซึ่งหยุดทำงานเมื่อวันอังคารที่ผ่านมา'
          },
          {
            text: 'Actually, the boiler makes a loud noise, and then it switches itself off completely.',
            transition: 'Actually,',
            pattern: 'coordinating',
            thai: 'จริง ๆ แล้ว หม้อต้มน้ำส่งเสียงดัง และจากนั้นมันก็ดับตัวเองลงโดยสิ้นเชิง'
          },
          {
            text: 'In addition, the radiators stay cold although I have tried resetting the system twice.',
            transition: 'In addition,',
            pattern: 'subordinator-middle',
            thai: 'นอกจากนี้ เครื่องกระจายความร้อนยังคงเย็นอยู่ แม้ว่าดิฉันจะลองรีเซ็ตระบบไปแล้วสองครั้ง'
          }
        ]
      },
      {
        bulletIndex: 1,
        label: 'How it affects me',
        sentences: [
          {
            text: 'Unfortunately, the flat is very cold in the evenings, making it difficult to work from home.',
            transition: 'Unfortunately,',
            pattern: 'sv-gerund',
            thai: 'น่าเสียดายที่ อพาร์ตเมนต์หนาวมากในตอนเย็น ซึ่งทำให้การทำงานจากที่บ้านเป็นเรื่องยาก'
          },
          {
            text: 'Moreover, my energy bills have risen because the electric heater runs all day.',
            transition: 'Moreover,',
            pattern: 'subordinator-middle',
            thai: 'ยิ่งไปกว่านั้น ค่าไฟฟ้าของดิฉันสูงขึ้น เพราะว่าเครื่องทำความร้อนไฟฟ้าทำงานตลอดทั้งวัน'
          },
          {
            text: 'Honestly, I am worried about the colder weather, so a quick repair would help enormously.',
            transition: 'Honestly,',
            pattern: 'coordinating',
            thai: 'พูดตามตรง ดิฉันเป็นกังวลเรื่องอากาศที่จะหนาวลงกว่านี้ ดังนั้นการซ่อมที่รวดเร็วจึงจะช่วยได้อย่างมาก'
          }
        ]
      },
      {
        bulletIndex: 2,
        label: 'What I would like',
        sentences: [
          {
            text: 'If possible, could you arrange for an engineer to visit the flat this week?',
            transition: 'If possible,',
            pattern: 'subordinator-middle',
            thai: 'ถ้าเป็นไปได้ คุณช่วยนัดหมายให้ช่างเทคนิคมาดูอพาร์ตเมนต์ในสัปดาห์นี้ได้ไหมคะ'
          },
          {
            text: 'Of course, I am at home most afternoons, so any time after two would suit me.',
            transition: 'Of course,',
            pattern: 'coordinating',
            thai: 'แน่นอนว่า ดิฉันอยู่บ้านเกือบทุกช่วงบ่าย ดังนั้นเวลาใดก็ได้หลังบ่ายสองโมงจึงสะดวกสำหรับดิฉัน'
          },
          {
            text: 'Finally, please confirm the appointment by email, and I will make sure someone is here.',
            transition: 'Finally,',
            pattern: 'coordinating',
            thai: 'สุดท้ายนี้ กรุณายืนยันการนัดหมายทางอีเมล และดิฉันจะจัดการให้แน่ใจว่ามีคนอยู่ที่นี่'
          }
        ]
      }
    ],
    beginInstruction: 'Begin your letter as follows: Dear Mrs Aldridge,',
    signoff: 'Kind regards,',
    senderName: 'Rachel Owens',
    practicalVocab: [
      { phrase: 'report a repair', thaiMeaning: 'แจ้งซ่อม' },
      { phrase: 'switch off', thaiMeaning: 'ดับ/ปิดเครื่อง' },
      { phrase: 'reset the system', thaiMeaning: 'รีเซ็ตระบบ' },
      { phrase: 'energy bill', thaiMeaning: 'ค่าไฟฟ้า/ค่าพลังงาน' },
      { phrase: 'arrange a visit', thaiMeaning: 'นัดหมายให้มาดู' },
      { phrase: 'confirm an appointment', thaiMeaning: 'ยืนยันการนัดหมาย' }
    ]
  },
  {
    ...COMMON_INSTRUCTIONS,
    id: 'gt-t1-semiformal-work-handover',
    number: 3,
    register: 'semi-formal',
    title: 'Arranging a Handover Before Leave',
    situation:
      'You will be away from work for two weeks and need a colleague you know to cover your tasks.',
    recipient: 'a colleague',
    letterInstruction: 'Write a letter to your colleague. In your letter:',
    greeting: 'Dear Ms Patel,',
    bullets: [
      'explain why you will be away',
      'describe the main tasks that need covering',
      'suggest how you can help the handover go smoothly'
    ],
    paragraphs: [
      {
        bulletIndex: 0,
        label: 'Reason for the leave',
        sentences: [
          {
            text: 'First of all, I will be on annual leave from the fifth to the nineteenth of June.',
            transition: 'First of all,',
            pattern: 'subordinator-middle',
            thai: 'อย่างแรกเลย ผมจะลาพักร้อนประจำปีตั้งแต่วันที่ห้าถึงวันที่สิบเก้ามิถุนายน'
          },
          {
            text: 'As you know, I had already booked this holiday, so I cannot change the dates now.',
            transition: 'As you know,',
            pattern: 'coordinating',
            thai: 'อย่างที่คุณทราบ ผมได้จองวันหยุดนี้ไว้ล่วงหน้าแล้ว ดังนั้นผมจึงไม่สามารถเปลี่ยนวันได้ในตอนนี้'
          },
          {
            text: 'In fact, my family is travelling abroad, making it impossible for me to work remotely.',
            transition: 'In fact,',
            pattern: 'sv-gerund',
            thai: 'อันที่จริง ครอบครัวของผมกำลังจะเดินทางไปต่างประเทศ ซึ่งทำให้เป็นไปไม่ได้ที่ผมจะทำงานทางไกล'
          }
        ]
      },
      {
        bulletIndex: 1,
        label: 'Tasks to cover',
        sentences: [
          {
            text: 'Firstly, the client reports are due on the tenth, so they will need your attention first.',
            transition: 'Firstly,',
            pattern: 'coordinating',
            thai: 'ประการแรก รายงานลูกค้าครบกำหนดส่งในวันที่สิบ ดังนั้นมันจึงต้องการความใส่ใจจากคุณเป็นอันดับแรก'
          },
          {
            text: 'In addition, the weekly team meeting still runs on Monday, which you could easily chair.',
            transition: 'In addition,',
            pattern: 'sv-which',
            thai: 'นอกจากนี้ การประชุมทีมประจำสัปดาห์ยังคงจัดในวันจันทร์ ซึ่งคุณสามารถเป็นประธานได้อย่างง่ายดาย'
          },
          {
            text: 'However, the budget file is nearly finished, so it should not take much of your time.',
            transition: 'However,',
            pattern: 'coordinating',
            thai: 'อย่างไรก็ตาม ไฟล์งบประมาณเกือบเสร็จแล้ว ดังนั้นมันจึงไม่น่าจะใช้เวลาของคุณมากนัก'
          }
        ]
      },
      {
        bulletIndex: 2,
        label: 'Making it smooth',
        sentences: [
          {
            text: 'Of course, I will write clear notes for every task before I leave the office.',
            transition: 'Of course,',
            pattern: 'subordinator-middle',
            thai: 'แน่นอนว่า ผมจะเขียนบันทึกที่ชัดเจนสำหรับทุกงาน ก่อนที่ผมจะออกจากออฟฟิศ'
          },
          {
            text: 'If possible, we could meet on Friday, so I can explain anything that is unclear.',
            transition: 'If possible,',
            pattern: 'coordinating',
            thai: 'ถ้าเป็นไปได้ เราอาจจะพบกันในวันศุกร์ เพื่อที่จะให้ผมได้อธิบายสิ่งใดก็ตามที่ยังไม่ชัดเจน'
          },
          {
            text: 'Finally, I will be reachable by email in an emergency, although I would prefer to rest.',
            transition: 'Finally,',
            pattern: 'subordinator-middle',
            thai: 'สุดท้ายนี้ คุณจะติดต่อผมได้ทางอีเมลในกรณีฉุกเฉิน แม้ว่าผมจะอยากพักผ่อนมากกว่าก็ตาม'
          }
        ]
      }
    ],
    beginInstruction: 'Begin your letter as follows: Dear Ms Patel,',
    signoff: 'Best wishes,',
    senderName: 'Marcus Bell',
    practicalVocab: [
      { phrase: 'annual leave', thaiMeaning: 'วันลาพักร้อนประจำปี' },
      { phrase: 'cover tasks', thaiMeaning: 'ทำงานแทน' },
      { phrase: 'client report', thaiMeaning: 'รายงานลูกค้า' },
      { phrase: 'chair a meeting', thaiMeaning: 'เป็นประธานการประชุม' },
      { phrase: 'handover notes', thaiMeaning: 'บันทึกส่งมอบงาน' },
      { phrase: 'reachable by email', thaiMeaning: 'ติดต่อได้ทางอีเมล' }
    ]
  },
  {
    ...COMMON_INSTRUCTIONS,
    id: 'gt-t1-semiformal-tutor-absence',
    number: 4,
    register: 'semi-formal',
    title: 'Explaining an Absence to Your Tutor',
    situation:
      'You missed an important class on your evening course and want to explain to your tutor and catch up.',
    recipient: 'your tutor',
    letterInstruction: 'Write a letter to your tutor. In your letter:',
    greeting: 'Dear Dr Nolan,',
    bullets: [
      'explain why you missed the class',
      'say how you plan to catch up on the work',
      'ask the tutor for any help or materials'
    ],
    paragraphs: [
      {
        bulletIndex: 0,
        label: 'Reason for missing',
        sentences: [
          {
            text: 'First of all, I am very sorry that I missed Tuesday’s seminar on marketing.',
            transition: 'First of all,',
            pattern: 'subordinator-middle',
            thai: 'อย่างแรกเลย ดิฉันขออภัยเป็นอย่างยิ่งที่ดิฉันขาดคาบสัมมนาวิชาการตลาดของวันอังคาร'
          },
          {
            text: 'Unfortunately, my train was cancelled, and the next one arrived far too late.',
            transition: 'Unfortunately,',
            pattern: 'coordinating',
            thai: 'น่าเสียดายที่ รถไฟของดิฉันถูกยกเลิก และขบวนถัดไปก็มาถึงช้าเกินไปมาก'
          },
          {
            text: 'In fact, I waited at the station for an hour, hoping the service would restart.',
            transition: 'In fact,',
            pattern: 'sv-gerund',
            thai: 'อันที่จริง ดิฉันรออยู่ที่สถานีเป็นเวลาหนึ่งชั่วโมง โดยหวังว่าการเดินรถจะกลับมาให้บริการอีกครั้ง'
          }
        ]
      },
      {
        bulletIndex: 1,
        label: 'Catching up',
        sentences: [
          {
            text: 'Firstly, I have already borrowed the notes from a classmate, which covered most of the lecture.',
            transition: 'Firstly,',
            pattern: 'sv-which',
            thai: 'ประการแรก ดิฉันได้ยืมสมุดจดจากเพื่อนร่วมชั้นมาแล้ว ซึ่งครอบคลุมเนื้อหาส่วนใหญ่ของการบรรยาย'
          },
          {
            text: 'Moreover, I will complete the reading this weekend, so I am not left behind.',
            transition: 'Moreover,',
            pattern: 'coordinating',
            thai: 'ยิ่งไปกว่านั้น ดิฉันจะอ่านเอกสารให้จบภายในสุดสัปดาห์นี้ เพื่อที่จะไม่ตามคนอื่นไม่ทัน'
          },
          {
            text: 'However, I am unsure about the group task because I missed how the teams were chosen.',
            transition: 'However,',
            pattern: 'subordinator-middle',
            thai: 'อย่างไรก็ตาม ดิฉันยังไม่แน่ใจเรื่องงานกลุ่ม เพราะว่าดิฉันพลาดตอนที่มีการเลือกทีมกันไป'
          }
        ]
      },
      {
        bulletIndex: 2,
        label: 'Asking for help',
        sentences: [
          {
            text: 'If possible, could you send me the slides and the handout from the session?',
            transition: 'If possible,',
            pattern: 'subordinator-middle',
            thai: 'ถ้าเป็นไปได้ อาจารย์ช่วยส่งสไลด์และเอกสารประกอบจากคาบเรียนนั้นมาให้ดิฉันได้ไหมคะ'
          },
          {
            text: 'Of course, I am happy to attend a later class to make up the missed work.',
            transition: 'Of course,',
            pattern: 'subordinator-middle',
            thai: 'แน่นอนว่า ดิฉันยินดีที่จะเข้าเรียนคาบหลังจากนี้ เพื่อที่จะทำงานที่ขาดไปให้ครบ'
          },
          {
            text: 'Finally, please tell me which group I should join, and I will contact them at once.',
            transition: 'Finally,',
            pattern: 'coordinating',
            thai: 'สุดท้ายนี้ กรุณาบอกดิฉันด้วยว่าดิฉันควรเข้าร่วมกลุ่มไหน และดิฉันจะติดต่อพวกเขาทันที'
          }
        ]
      }
    ],
    beginInstruction: 'Begin your letter as follows: Dear Dr Nolan,',
    signoff: 'Best regards,',
    senderName: 'Sophie Lin',
    practicalVocab: [
      { phrase: 'miss a seminar', thaiMeaning: 'ขาดสัมมนา/คาบเรียน' },
      { phrase: 'be cancelled', thaiMeaning: 'ถูกยกเลิก' },
      { phrase: 'catch up', thaiMeaning: 'ตามงานให้ทัน' },
      { phrase: 'fall behind', thaiMeaning: 'เรียนตามไม่ทัน' },
      { phrase: 'group task', thaiMeaning: 'งานกลุ่ม' },
      { phrase: 'make up the work', thaiMeaning: 'ทำงานที่ค้างให้ครบ' }
    ]
  },
  {
    ...COMMON_INSTRUCTIONS,
    id: 'gt-t1-semiformal-neighbour-renovation',
    number: 5,
    register: 'semi-formal',
    title: 'Warning a Neighbour About Building Work',
    situation:
      'You are about to have your kitchen replaced. The work will be noisy and will affect a neighbour whom you know reasonably well.',
    recipient: 'a neighbour',
    letterInstruction: 'Write a letter to your neighbour. In your letter:',
    greeting: 'Dear Mrs Patel,',
    bullets: [
      'explain what building work is about to start',
      'say how long it will last and when the noise will be worst',
      'offer to reduce the inconvenience for your neighbour'
    ],
    paragraphs: [
      {
        bulletIndex: 0,
        label: 'What work is starting',
        sentences: [
          {
            text: 'First of all, I hope you are well although the weather has been rather miserable lately.',
            transition: 'First of all,',
            pattern: 'subordinator-middle',
            thai: 'อย่างแรกเลย ดิฉันหวังว่าคุณสบายดี แม้ว่าอากาศช่วงนี้จะค่อนข้างแย่ก็ตาม'
          },
          {
            text: 'As you know, our kitchen is extremely old, and we have finally decided to replace it completely.',
            transition: 'As you know,',
            pattern: 'coordinating',
            thai: 'อย่างที่คุณทราบ ห้องครัวของเราเก่ามาก และในที่สุดเราก็ตัดสินใจจะเปลี่ยนใหม่ทั้งหมด'
          },
          {
            text: 'In fact, the builders start on Monday, making some noise unavoidable for a short while.',
            transition: 'In fact,',
            pattern: 'sv-gerund',
            thai: 'อันที่จริง ช่างจะเริ่มงานวันจันทร์ ทำให้เสียงรบกวนเป็นสิ่งที่เลี่ยงไม่ได้อยู่ช่วงสั้น ๆ'
          }
        ]
      },
      {
        bulletIndex: 1,
        label: 'How long it will last',
        sentences: [
          {
            text: 'Firstly, the work should last about three weeks, which is shorter than we first feared.',
            transition: 'Firstly,',
            pattern: 'sv-which',
            thai: 'ประการแรก งานน่าจะใช้เวลาราวสามสัปดาห์ ซึ่งสั้นกว่าที่เรากังวลไว้ตอนแรก'
          },
          {
            text: 'In addition, the noisiest days will be the first two because the old units must come out and the walls need replastering.',
            transition: 'In addition,',
            pattern: 'subordinator-middle',
            thai: 'นอกจากนี้ วันที่เสียงดังที่สุดจะเป็นสองวันแรก เพราะว่าต้องรื้อตู้เก่าออกและผนังต้องฉาบใหม่'
          },
          {
            text: 'However, the team will not start before nine, so you should still enjoy peaceful mornings.',
            transition: 'However,',
            pattern: 'coordinating',
            thai: 'อย่างไรก็ตาม ทีมช่างจะไม่เริ่มงานก่อนเก้าโมง คุณจึงยังคงมีช่วงเช้าที่สงบอยู่'
          }
        ]
      },
      {
        bulletIndex: 2,
        label: 'Reducing the inconvenience',
        sentences: [
          {
            text: 'Of course, I am very sorry about the unavoidable disturbance, and I want to make the next few weeks easier for you.',
            transition: 'Of course,',
            pattern: 'coordinating',
            thai: 'แน่นอนว่า ดิฉันขอโทษอย่างยิ่งสำหรับการรบกวนที่เลี่ยงไม่ได้นี้ และดิฉันอยากทำให้สองสามสัปดาห์ข้างหน้าง่ายขึ้นสำหรับคุณ'
          },
          {
            text: 'If possible, please send me a message about any quiet hours you need, and I will ask the builders to pause.',
            transition: 'If possible,',
            pattern: 'coordinating',
            thai: 'ถ้าเป็นไปได้ กรุณาส่งข้อความบอกดิฉันเรื่องช่วงเวลาที่คุณต้องการความเงียบ และดิฉันจะขอให้ช่างหยุดพักให้'
          },
          {
            text: 'Finally, we will clean the shared path every evening, keeping the entrance clear for everyone.',
            transition: 'Finally,',
            pattern: 'sv-gerund',
            thai: 'สุดท้ายนี้ เราจะทำความสะอาดทางเดินส่วนกลางทุกเย็น เพื่อรักษาทางเข้าให้โล่งสำหรับทุกคน'
          }
        ]
      }
    ],
    beginInstruction: 'Begin your letter as follows: Dear Mrs Patel,',
    signoff: 'Kind regards,',
    senderName: 'Helen Brooks',
    practicalVocab: [
      { phrase: 'building work', thaiMeaning: 'งานก่อสร้าง/งานต่อเติม' },
      { phrase: 'unavoidable disturbance', thaiMeaning: 'การรบกวนที่เลี่ยงไม่ได้' },
      { phrase: 'replaster a wall', thaiMeaning: 'ฉาบผนังใหม่' },
      { phrase: 'quiet hours', thaiMeaning: 'ช่วงเวลาที่ต้องการความเงียบ' },
      { phrase: 'shared path', thaiMeaning: 'ทางเดินส่วนกลาง' },
      { phrase: 'keep something clear', thaiMeaning: 'รักษาให้โล่ง/ไม่มีสิ่งกีดขวาง' }
    ]
  },
  {
    ...COMMON_INSTRUCTIONS,
    id: 'gt-t1-semiformal-manager-study-leave',
    number: 6,
    register: 'semi-formal',
    title: 'Requesting Study Leave from Your Manager',
    situation:
      'You would like to attend a short training course during working hours. You must ask your manager, whom you know well, for permission.',
    recipient: 'your manager',
    letterInstruction: 'Write a letter to your manager. In your letter:',
    greeting: 'Dear Ms Reynolds,',
    bullets: [
      'explain what course you would like to attend',
      'say why the course is useful for your job',
      'explain how your work will be covered while you are away'
    ],
    paragraphs: [
      {
        bulletIndex: 0,
        label: 'The course you want to attend',
        sentences: [
          {
            text: 'First of all, I am writing to request three days of study leave, which would allow me to attend a course.',
            transition: 'First of all,',
            pattern: 'sv-which',
            thai: 'อย่างแรกเลย ดิฉันเขียนมาเพื่อขออนุญาตลาไปอบรมสามวัน ซึ่งจะทำให้ดิฉันสามารถเข้าร่วมคอร์สได้'
          },
          {
            text: 'As you know, our team handles all the payroll queries, and we expect the new software in January.',
            transition: 'As you know,',
            pattern: 'coordinating',
            thai: 'อย่างที่คุณทราบ ทีมของเราดูแลคำถามเรื่องเงินเดือนทั้งหมด และเราคาดว่าซอฟต์แวร์ใหม่จะมาถึงในเดือนมกราคม'
          },
          {
            text: 'In fact, the course covers exactly that system, making it extremely relevant to my daily work.',
            transition: 'In fact,',
            pattern: 'sv-gerund',
            thai: 'อันที่จริง คอร์สนี้สอนระบบนั้นพอดี ทำให้มันเกี่ยวข้องอย่างยิ่งกับงานประจำวันของดิฉัน'
          }
        ]
      },
      {
        bulletIndex: 1,
        label: 'Why the course is useful',
        sentences: [
          {
            text: 'Firstly, the training runs from the fourth to the sixth of November because the provider only offers this course once a year.',
            transition: 'Firstly,',
            pattern: 'subordinator-middle',
            thai: 'ประการแรก การอบรมจัดระหว่างวันที่สี่ถึงวันที่หกพฤศจิกายน เพราะว่าผู้จัดเปิดคอร์สนี้เพียงปีละครั้ง'
          },
          {
            text: 'Moreover, the fee is fully covered by our department budget, which I confirmed with Finance last week.',
            transition: 'Moreover,',
            pattern: 'sv-which',
            thai: 'ยิ่งไปกว่านั้น ค่าลงทะเบียนอยู่ในงบประมาณของแผนกเราทั้งหมด ซึ่งดิฉันยืนยันกับฝ่ายการเงินแล้วเมื่อสัปดาห์ที่แล้ว'
          },
          {
            text: 'However, I will not need any extra days although the venue is in Manchester.',
            transition: 'However,',
            pattern: 'subordinator-middle',
            thai: 'อย่างไรก็ตาม ดิฉันจะไม่ต้องขอวันเพิ่ม แม้ว่าสถานที่จัดจะอยู่ที่เมืองแมนเชสเตอร์'
          }
        ]
      },
      {
        bulletIndex: 2,
        label: 'How your work will be covered',
        sentences: [
          {
            text: 'Of course, I have already spoken to Priya, and she is very happy to cover my desk during my absence next month.',
            transition: 'Of course,',
            pattern: 'coordinating',
            thai: 'แน่นอนว่า ดิฉันได้คุยกับพรียาแล้ว และเธอยินดีอย่างยิ่งที่จะดูแลงานแทนดิฉันในช่วงที่ดิฉันไม่อยู่เดือนหน้า'
          },
          {
            text: 'In addition, I will finish the quarterly report before I leave, so I will not delay any other work.',
            transition: 'In addition,',
            pattern: 'coordinating',
            thai: 'นอกจากนี้ ดิฉันจะทำรายงานรายไตรมาสให้เสร็จก่อนที่จะไป ดิฉันจึงจะไม่ทำให้งานอื่นล่าช้า'
          },
          {
            text: 'Finally, I would be grateful for your approval, allowing me to book the place this week.',
            transition: 'Finally,',
            pattern: 'sv-gerund',
            thai: 'สุดท้ายนี้ ดิฉันจะขอบคุณอย่างยิ่งหากได้รับการอนุมัติจากคุณ ซึ่งจะทำให้ดิฉันจองที่นั่งได้ภายในสัปดาห์นี้'
          }
        ]
      }
    ],
    beginInstruction: 'Begin your letter as follows: Dear Ms Reynolds,',
    signoff: 'Kind regards,',
    senderName: 'Nadia Kaur',
    practicalVocab: [
      { phrase: 'study leave', thaiMeaning: 'การลาไปอบรม/ศึกษาต่อ' },
      { phrase: 'payroll queries', thaiMeaning: 'คำถามเกี่ยวกับเงินเดือน' },
      { phrase: 'cover someone’s desk', thaiMeaning: 'ทำงานแทนใครบางคน' },
      { phrase: 'quarterly report', thaiMeaning: 'รายงานรายไตรมาส' },
      { phrase: 'department budget', thaiMeaning: 'งบประมาณของแผนก' },
      { phrase: 'book a place', thaiMeaning: 'จองที่นั่ง' }
    ]
  }
] as const satisfies readonly GeneralTask1Prompt[]

export const GENERAL_TASK1_FORMAL_PROMPTS = [
  {
    ...COMMON_INSTRUCTIONS,
    id: 'gt-t1-formal-product-complaint',
    number: 1,
    register: 'formal',
    title: 'Complaint About a Faulty Product',
    situation:
      'You bought an electronic device from an online store and it developed a fault. You are writing to complain.',
    recipient: 'the customer service manager',
    letterInstruction: 'Write a letter to the company. In your letter:',
    greeting: 'Dear Sir or Madam,',
    bullets: [
      'give details of the product and your purchase',
      'explain the problem and how it has affected you',
      'say what action you expect the company to take'
    ],
    paragraphs: [
      {
        bulletIndex: 0,
        label: 'Purchase details',
        sentences: [
          {
            text: 'First of all, I am writing to complain about a wireless printer, which I purchased from your website last month.',
            transition: 'First of all,',
            pattern: 'sv-which',
            thai: 'อย่างแรกเลย ข้าพเจ้าเขียนจดหมายฉบับนี้มาเพื่อร้องเรียนเกี่ยวกับเครื่องพิมพ์ไร้สายเครื่องหนึ่ง ซึ่งข้าพเจ้าได้ซื้อมาจากเว็บไซต์ของท่านเมื่อเดือนที่แล้ว'
          },
          {
            text: 'To begin with, the order number is BX4471, and the delivery arrived on the third of April.',
            transition: 'To begin with,',
            pattern: 'coordinating',
            thai: 'เริ่มจากเรื่องแรกก่อน หมายเลขคำสั่งซื้อคือ BX4471 และสินค้าถูกจัดส่งมาถึงในวันที่สามของเดือนเมษายน'
          },
          {
            text: 'In addition, I paid the full price of ninety pounds, expecting a reliable product.',
            transition: 'In addition,',
            pattern: 'sv-gerund',
            thai: 'นอกจากนี้ ข้าพเจ้าได้ชำระเงินเต็มราคาเก้าสิบปอนด์ โดยคาดหวังว่าจะได้รับสินค้าที่เชื่อถือได้'
          }
        ]
      },
      {
        bulletIndex: 1,
        label: 'The problem',
        sentences: [
          {
            text: 'Unfortunately, the printer stopped working after only a week, although I followed the instructions carefully.',
            transition: 'Unfortunately,',
            pattern: 'subordinator-middle',
            thai: 'น่าเสียดายที่ เครื่องพิมพ์หยุดทำงานหลังจากใช้ไปเพียงหนึ่งสัปดาห์ แม้ว่าข้าพเจ้าจะปฏิบัติตามคำแนะนำอย่างระมัดระวังแล้วก็ตาม'
          },
          {
            text: 'Furthermore, it now fails to switch on, so I cannot print any documents at all.',
            transition: 'Furthermore,',
            pattern: 'coordinating',
            thai: 'ยิ่งไปกว่านั้น ขณะนี้เครื่องไม่สามารถเปิดติดได้ ข้าพเจ้าจึงไม่สามารถพิมพ์เอกสารใด ๆ ได้เลย'
          },
          {
            text: 'Consequently, I have been unable to finish important work, which has caused me considerable inconvenience.',
            transition: 'Consequently,',
            pattern: 'sv-which',
            thai: 'ด้วยเหตุนี้ ข้าพเจ้าจึงไม่สามารถทำงานสำคัญให้เสร็จสิ้นได้ ซึ่งก่อให้เกิดความไม่สะดวกแก่ข้าพเจ้าอย่างมาก'
          }
        ]
      },
      {
        bulletIndex: 2,
        label: 'Action expected',
        sentences: [
          {
            text: 'Therefore, I would like a full refund or a replacement as soon as possible.',
            transition: 'Therefore,',
            pattern: 'subordinator-middle',
            thai: 'ดังนั้น ข้าพเจ้าจึงประสงค์จะได้รับการคืนเงินเต็มจำนวน หรือสินค้าทดแทน โดยเร็วที่สุดเท่าที่จะเป็นไปได้'
          },
          {
            text: 'Moreover, I expect the company to cover the cost of returning the faulty item.',
            transition: 'Moreover,',
            pattern: 'subordinator-middle',
            thai: 'ยิ่งไปกว่านั้น ข้าพเจ้าคาดหวังให้ทางบริษัทเป็นผู้รับผิดชอบค่าใช้จ่ายในการส่งคืนสินค้าที่ชำรุด'
          },
          {
            text: 'Finally, I look forward to your reply within fourteen days, and I trust this matter will be resolved quickly.',
            transition: 'Finally,',
            pattern: 'coordinating',
            thai: 'สุดท้ายนี้ ข้าพเจ้ารอคอยคำตอบจากท่านภายในสิบสี่วัน และข้าพเจ้าเชื่อมั่นว่าเรื่องนี้จะได้รับการแก้ไขโดยเร็ว'
          }
        ]
      }
    ],
    beginInstruction: 'Begin your letter as follows: Dear Sir or Madam,',
    signoff: 'Yours faithfully,',
    senderName: 'A. Morgan',
    practicalVocab: [
      { phrase: 'faulty product', thaiMeaning: 'สินค้าชำรุด' },
      { phrase: 'order number', thaiMeaning: 'หมายเลขคำสั่งซื้อ' },
      { phrase: 'full refund', thaiMeaning: 'คืนเงินเต็มจำนวน' },
      { phrase: 'replacement', thaiMeaning: 'สินค้าทดแทน' },
      { phrase: 'considerable inconvenience', thaiMeaning: 'ความไม่สะดวกอย่างมาก' },
      { phrase: 'look forward to', thaiMeaning: 'รอคอย/หวังว่าจะได้รับ' }
    ]
  },
  {
    ...COMMON_INSTRUCTIONS,
    id: 'gt-t1-formal-course-enquiry',
    number: 2,
    register: 'formal',
    title: 'Enquiry About a Training Course',
    situation:
      'You have seen an advertisement for a professional course and want more information before applying.',
    recipient: 'the course administrator',
    letterInstruction: 'Write a letter to the course provider. In your letter:',
    greeting: 'Dear Sir or Madam,',
    bullets: [
      'explain why you are interested in the course',
      'ask for the specific information you need',
      'explain what you would like to happen next'
    ],
    paragraphs: [
      {
        bulletIndex: 0,
        label: 'Interest in the course',
        sentences: [
          {
            text: 'First of all, I am writing to enquire about the digital marketing course advertised in this month’s magazine.',
            transition: 'First of all,',
            pattern: 'subordinator-middle',
            thai: 'อย่างแรกเลย ข้าพเจ้าเขียนจดหมายฉบับนี้มาเพื่อสอบถามข้อมูลเกี่ยวกับหลักสูตรการตลาดดิจิทัล ที่ได้ลงโฆษณาไว้ในนิตยสารฉบับเดือนนี้'
          },
          {
            text: 'To begin with, I have worked in sales for five years, so I wish to develop new skills.',
            transition: 'To begin with,',
            pattern: 'coordinating',
            thai: 'เริ่มจากเรื่องแรกก่อน ข้าพเจ้าทำงานด้านการขายมาเป็นเวลาห้าปี ข้าพเจ้าจึงปรารถนาที่จะพัฒนาทักษะใหม่ ๆ'
          },
          {
            text: 'In addition, I hope to change career soon, making this qualification particularly useful.',
            transition: 'In addition,',
            pattern: 'sv-gerund',
            thai: 'นอกจากนี้ ข้าพเจ้าหวังว่าจะเปลี่ยนสายอาชีพในเร็ววัน ซึ่งทำให้คุณวุฒินี้มีประโยชน์เป็นอย่างยิ่ง'
          }
        ]
      },
      {
        bulletIndex: 1,
        label: 'Information required',
        sentences: [
          {
            text: 'Firstly, I would be grateful if you could tell me how long the course lasts.',
            transition: 'Firstly,',
            pattern: 'subordinator-middle',
            thai: 'ประการแรก ข้าพเจ้าจะรู้สึกขอบคุณเป็นอย่างยิ่ง ถ้าท่านสามารถแจ้งให้ข้าพเจ้าทราบว่าหลักสูตรนี้ใช้เวลาเรียนนานเท่าใด'
          },
          {
            text: 'Furthermore, I need to know whether the classes are held online or in person.',
            transition: 'Furthermore,',
            pattern: 'subordinator-middle',
            thai: 'ยิ่งไปกว่านั้น ข้าพเจ้าจำเป็นต้องทราบว่าชั้นเรียนนั้นจัดขึ้นแบบออนไลน์ หรือแบบพบหน้ากัน'
          },
          {
            text: 'Moreover, I would like details of the total fees, which are not stated in the advertisement.',
            transition: 'Moreover,',
            pattern: 'sv-which',
            thai: 'ยิ่งไปกว่านั้น ข้าพเจ้าประสงค์จะได้รับรายละเอียดของค่าใช้จ่ายทั้งหมด ซึ่งมิได้ระบุไว้ในโฆษณา'
          }
        ]
      },
      {
        bulletIndex: 2,
        label: 'Next steps',
        sentences: [
          {
            text: 'In particular, I should like to receive a prospectus and an application form by post.',
            transition: 'In particular,',
            pattern: 'subordinator-middle',
            thai: 'โดยเฉพาะอย่างยิ่ง ข้าพเจ้าประสงค์จะได้รับเอกสารแนะนำหลักสูตร และใบสมัครทางไปรษณีย์'
          },
          {
            text: 'Therefore, I would appreciate a reply at your earliest convenience.',
            transition: 'Therefore,',
            pattern: 'subordinator-middle',
            thai: 'ดังนั้น ข้าพเจ้าจะรู้สึกซาบซึ้งหากได้รับคำตอบโดยเร็วที่สุดเท่าที่ท่านจะสะดวก'
          },
          {
            text: 'Finally, I look forward to hearing from you, and I thank you for your assistance.',
            transition: 'Finally,',
            pattern: 'coordinating',
            thai: 'สุดท้ายนี้ ข้าพเจ้ารอคอยที่จะได้รับการติดต่อกลับจากท่าน และข้าพเจ้าขอขอบคุณสำหรับความช่วยเหลือของท่าน'
          }
        ]
      }
    ],
    beginInstruction: 'Begin your letter as follows: Dear Sir or Madam,',
    signoff: 'Yours faithfully,',
    senderName: 'J. Ferreira',
    practicalVocab: [
      { phrase: 'enquire about', thaiMeaning: 'สอบถามข้อมูลเกี่ยวกับ' },
      { phrase: 'develop skills', thaiMeaning: 'พัฒนาทักษะ' },
      { phrase: 'held in person', thaiMeaning: 'จัดแบบพบหน้า' },
      { phrase: 'total fees', thaiMeaning: 'ค่าใช้จ่ายทั้งหมด' },
      { phrase: 'prospectus', thaiMeaning: 'สูจิบัตร/เอกสารแนะนำหลักสูตร' },
      { phrase: 'at your earliest convenience', thaiMeaning: 'โดยเร็วที่สุดเท่าที่สะดวก' }
    ]
  },
  {
    ...COMMON_INSTRUCTIONS,
    id: 'gt-t1-formal-council-request',
    number: 3,
    register: 'formal',
    title: 'Requesting Action on a Local Problem',
    situation:
      'A public area in your town has a problem and you are writing to the local council to ask them to deal with it.',
    recipient: 'the local council',
    letterInstruction: 'Write a letter to the local council. In your letter:',
    greeting: 'Dear Sir or Madam,',
    bullets: [
      'describe the problem and say where it is',
      'explain how it affects local residents',
      'suggest what the council should do'
    ],
    paragraphs: [
      {
        bulletIndex: 0,
        label: 'The problem',
        sentences: [
          {
            text: 'First of all, I am writing to draw your attention to the broken street lighting on Mill Road.',
            transition: 'First of all,',
            pattern: 'subordinator-middle',
            thai: 'อย่างแรกเลย ข้าพเจ้าเขียนจดหมายฉบับนี้มาเพื่อขอให้ท่านให้ความสนใจต่อไฟส่องถนนที่ชำรุดบนถนนมิลล์'
          },
          {
            text: 'To begin with, several lamps have not worked for a month, leaving the street very dark at night.',
            transition: 'To begin with,',
            pattern: 'sv-gerund',
            thai: 'เริ่มจากเรื่องแรกก่อน โคมไฟหลายดวงไม่ทำงานมาเป็นเวลาหนึ่งเดือนแล้ว ซึ่งทำให้ถนนมืดมากในเวลากลางคืน'
          },
          {
            text: 'In addition, the pavement is uneven, which makes walking dangerous after sunset.',
            transition: 'In addition,',
            pattern: 'sv-which',
            thai: 'นอกจากนี้ ทางเท้ายังขรุขระไม่เรียบ ซึ่งทำให้การเดินเท้าเป็นอันตรายหลังจากดวงอาทิตย์ตกดิน'
          }
        ]
      },
      {
        bulletIndex: 1,
        label: 'Effect on residents',
        sentences: [
          {
            text: 'Unfortunately, many residents feel unsafe, so they now avoid the area in the evening.',
            transition: 'Unfortunately,',
            pattern: 'coordinating',
            thai: 'น่าเสียดายที่ ผู้อยู่อาศัยจำนวนมากรู้สึกไม่ปลอดภัย พวกเขาจึงหลีกเลี่ยงบริเวณดังกล่าวในช่วงเย็นในขณะนี้'
          },
          {
            text: 'Furthermore, an elderly neighbour recently fell there because she could not see the kerb.',
            transition: 'Furthermore,',
            pattern: 'subordinator-middle',
            thai: 'ยิ่งไปกว่านั้น เพื่อนบ้านสูงอายุรายหนึ่งเพิ่งหกล้มที่นั่นเมื่อไม่นานมานี้ เพราะว่าเธอมองไม่เห็นขอบทางเท้า'
          },
          {
            text: 'Consequently, local people are increasingly worried about accidents and crime.',
            transition: 'Consequently,',
            pattern: 'subordinator-middle',
            thai: 'ด้วยเหตุนี้ ประชาชนในท้องถิ่นจึงมีความกังวลมากขึ้นเรื่อย ๆ เกี่ยวกับอุบัติเหตุ และอาชญากรรม'
          }
        ]
      },
      {
        bulletIndex: 2,
        label: 'Requested action',
        sentences: [
          {
            text: 'Therefore, I would urge the council to repair the lighting as a matter of urgency.',
            transition: 'Therefore,',
            pattern: 'subordinator-middle',
            thai: 'ดังนั้น ข้าพเจ้าจึงใคร่ขอเรียกร้องให้ทางเทศบาลซ่อมแซมระบบไฟส่องสว่างในฐานะเรื่องเร่งด่วน'
          },
          {
            text: 'Moreover, the pavement should be resurfaced, which would prevent further injuries.',
            transition: 'Moreover,',
            pattern: 'sv-which',
            thai: 'ยิ่งไปกว่านั้น ทางเท้าควรได้รับการปูผิวใหม่ ซึ่งจะช่วยป้องกันการบาดเจ็บที่จะเกิดขึ้นอีกต่อไป'
          },
          {
            text: 'Finally, I would be grateful if you could inform me of your decision in due course.',
            transition: 'Finally,',
            pattern: 'subordinator-middle',
            thai: 'สุดท้ายนี้ ข้าพเจ้าจะรู้สึกขอบคุณเป็นอย่างยิ่ง ถ้าท่านสามารถแจ้งให้ข้าพเจ้าทราบถึงการตัดสินใจของท่านในเวลาอันสมควร'
          }
        ]
      }
    ],
    beginInstruction: 'Begin your letter as follows: Dear Sir or Madam,',
    signoff: 'Yours faithfully,',
    senderName: 'H. Blackwood',
    practicalVocab: [
      { phrase: 'draw attention to', thaiMeaning: 'ทำให้สนใจ/ชี้ให้เห็นถึง' },
      { phrase: 'street lighting', thaiMeaning: 'ไฟส่องถนน' },
      { phrase: 'uneven pavement', thaiMeaning: 'ทางเท้าขรุขระ' },
      { phrase: 'feel unsafe', thaiMeaning: 'รู้สึกไม่ปลอดภัย' },
      { phrase: 'a matter of urgency', thaiMeaning: 'เรื่องเร่งด่วน' },
      { phrase: 'in due course', thaiMeaning: 'ในเวลาอันสมควร' }
    ]
  },
  {
    ...COMMON_INSTRUCTIONS,
    id: 'gt-t1-formal-job-application',
    number: 4,
    register: 'formal',
    title: 'Applying for an Advertised Position',
    situation:
      'You have seen a job advertisement and are writing to apply and explain why you are suitable.',
    recipient: 'the hiring manager',
    letterInstruction: 'Write a letter to the employer. In your letter:',
    greeting: 'Dear Sir or Madam,',
    bullets: [
      'say which job you are applying for and where you saw it',
      'describe your relevant experience and skills',
      'explain when you are available and what you would like next'
    ],
    paragraphs: [
      {
        bulletIndex: 0,
        label: 'The application',
        sentences: [
          {
            text: 'First of all, I am writing to apply for the position of office assistant, which was advertised on your website.',
            transition: 'First of all,',
            pattern: 'sv-which',
            thai: 'อย่างแรกเลย ข้าพเจ้าเขียนจดหมายฉบับนี้มาเพื่อสมัครงานในตำแหน่งผู้ช่วยสำนักงาน ซึ่งได้ลงประกาศไว้บนเว็บไซต์ของท่าน'
          },
          {
            text: 'To begin with, I have three years of experience in administration, so I am confident I could do the job well.',
            transition: 'To begin with,',
            pattern: 'coordinating',
            thai: 'เริ่มจากเรื่องแรกก่อน ข้าพเจ้ามีประสบการณ์ด้านงานบริหารธุรการเป็นเวลาสามปี ข้าพเจ้าจึงมั่นใจว่าข้าพเจ้าสามารถทำงานนี้ได้เป็นอย่างดี'
          },
          {
            text: 'In addition, I hold a diploma in business studies, making me well prepared for the role.',
            transition: 'In addition,',
            pattern: 'sv-gerund',
            thai: 'นอกจากนี้ ข้าพเจ้ายังสำเร็จอนุปริญญาด้านบริหารธุรกิจ ซึ่งทำให้ข้าพเจ้ามีความพร้อมเป็นอย่างดีสำหรับตำแหน่งนี้'
          }
        ]
      },
      {
        bulletIndex: 1,
        label: 'Experience and skills',
        sentences: [
          {
            text: 'Firstly, I am highly organised, and I am comfortable managing several tasks at once.',
            transition: 'Firstly,',
            pattern: 'coordinating',
            thai: 'ประการแรก ข้าพเจ้าเป็นผู้ที่มีระเบียบและจัดการงานได้ดีเป็นอย่างยิ่ง และข้าพเจ้ารู้สึกสบายใจกับการจัดการงานหลายอย่างในเวลาเดียวกัน'
          },
          {
            text: 'Furthermore, I have strong computer skills, which I developed in my current job.',
            transition: 'Furthermore,',
            pattern: 'sv-which',
            thai: 'ยิ่งไปกว่านั้น ข้าพเจ้ามีทักษะด้านคอมพิวเตอร์ที่แข็งแกร่ง ซึ่งข้าพเจ้าได้พัฒนาขึ้นในงานปัจจุบันของข้าพเจ้า'
          },
          {
            text: 'Moreover, I communicate clearly because I regularly deal with customers and suppliers.',
            transition: 'Moreover,',
            pattern: 'subordinator-middle',
            thai: 'ยิ่งไปกว่านั้น ข้าพเจ้าสื่อสารได้อย่างชัดเจน เพราะว่าข้าพเจ้าต้องติดต่อกับลูกค้า และผู้จัดจำหน่ายอยู่เป็นประจำ'
          }
        ]
      },
      {
        bulletIndex: 2,
        label: 'Availability and next steps',
        sentences: [
          {
            text: 'In particular, I could begin work at the start of next month if that is convenient.',
            transition: 'In particular,',
            pattern: 'subordinator-middle',
            thai: 'โดยเฉพาะอย่างยิ่ง ข้าพเจ้าสามารถเริ่มงานได้ในต้นเดือนหน้า ถ้าเป็นการสะดวกสำหรับท่าน'
          },
          {
            text: 'Therefore, I have attached my curriculum vitae for your consideration.',
            transition: 'Therefore,',
            pattern: 'subordinator-middle',
            thai: 'ดังนั้น ข้าพเจ้าจึงได้แนบประวัติย่อของข้าพเจ้ามาพร้อมนี้เพื่อให้ท่านพิจารณา'
          },
          {
            text: 'Finally, I would welcome the opportunity of an interview, and I look forward to your reply.',
            transition: 'Finally,',
            pattern: 'coordinating',
            thai: 'สุดท้ายนี้ ข้าพเจ้ายินดีเป็นอย่างยิ่งที่จะได้รับโอกาสในการเข้าสัมภาษณ์ และข้าพเจ้ารอคอยคำตอบจากท่าน'
          }
        ]
      }
    ],
    beginInstruction: 'Begin your letter as follows: Dear Sir or Madam,',
    signoff: 'Yours faithfully,',
    senderName: 'P. Ndlovu',
    practicalVocab: [
      { phrase: 'apply for a position', thaiMeaning: 'สมัครตำแหน่งงาน' },
      { phrase: 'relevant experience', thaiMeaning: 'ประสบการณ์ที่เกี่ยวข้อง' },
      { phrase: 'highly organised', thaiMeaning: 'มีระเบียบ/จัดการงานได้ดี' },
      { phrase: 'curriculum vitae', thaiMeaning: 'ประวัติย่อ (CV)' },
      { phrase: 'for your consideration', thaiMeaning: 'เพื่อพิจารณา' },
      { phrase: 'welcome the opportunity', thaiMeaning: 'ยินดีรับโอกาส' }
    ]
  },
  {
    ...COMMON_INSTRUCTIONS,
    id: 'gt-t1-formal-flight-delay',
    number: 5,
    register: 'formal',
    title: 'Complaining About a Delayed Flight',
    situation:
      'A flight you took was delayed by many hours and you missed an onward train and a business meeting. You are writing to the airline.',
    recipient: 'the customer services manager of an airline',
    letterInstruction: 'Write a letter to the airline. In your letter:',
    greeting: 'Dear Sir or Madam,',
    bullets: [
      'give the details of the flight and the delay',
      'explain what problems the delay caused you',
      'say what action you would like the airline to take'
    ],
    paragraphs: [
      {
        bulletIndex: 0,
        label: 'Details of the flight',
        sentences: [
          {
            text: 'First of all, I am writing to complain about flight BA274, which was delayed by eleven hours.',
            transition: 'First of all,',
            pattern: 'sv-which',
            thai: 'อย่างแรกเลย ข้าพเจ้าเขียนมาเพื่อร้องเรียนเกี่ยวกับเที่ยวบิน BA274 ซึ่งล่าช้าไปถึงสิบเอ็ดชั่วโมง'
          },
          {
            text: 'To begin with, the flight was due to leave Bangkok on the third of June, and it finally departed the next morning.',
            transition: 'To begin with,',
            pattern: 'coordinating',
            thai: 'เริ่มจาก เที่ยวบินนี้มีกำหนดออกจากกรุงเทพฯ ในวันที่สามมิถุนายน และสุดท้ายก็ออกเดินทางในเช้าวันถัดมา'
          },
          {
            text: 'In fact, no explanation was given for several hours, causing considerable distress to elderly passengers.',
            transition: 'In fact,',
            pattern: 'sv-gerund',
            thai: 'อันที่จริง ไม่มีการชี้แจงใด ๆ เป็นเวลาหลายชั่วโมง ทำให้ผู้โดยสารสูงอายุเดือดร้อนอย่างมาก'
          }
        ]
      },
      {
        bulletIndex: 1,
        label: 'Problems the delay caused',
        sentences: [
          {
            text: 'Furthermore, the ground staff offered no refreshments although we waited inside the terminal all night.',
            transition: 'Furthermore,',
            pattern: 'subordinator-middle',
            thai: 'ยิ่งไปกว่านั้น พนักงานภาคพื้นไม่ได้จัดอาหารหรือเครื่องดื่มให้เลย แม้ว่าพวกเราจะรอในอาคารผู้โดยสารทั้งคืน'
          },
          {
            text: 'In addition, I missed a connecting train in London, which I had booked and paid for separately.',
            transition: 'In addition,',
            pattern: 'sv-which',
            thai: 'นอกจากนี้ ข้าพเจ้าพลาดรถไฟต่อเที่ยวที่ลอนดอน ซึ่งข้าพเจ้าได้จองและชำระเงินแยกต่างหากไว้แล้ว'
          },
          {
            text: 'Unfortunately, I also arrived too late for an important business meeting because the delay lasted until midday.',
            transition: 'Unfortunately,',
            pattern: 'subordinator-middle',
            thai: 'น่าเสียดายที่ ข้าพเจ้ายังไปถึงสายเกินไปสำหรับการประชุมธุรกิจที่สำคัญ เพราะว่าความล่าช้ายืดเยื้อไปจนถึงเที่ยงวัน'
          }
        ]
      },
      {
        bulletIndex: 2,
        label: 'Action you expect',
        sentences: [
          {
            text: 'Consequently, I would like a full refund of the train ticket, and I expect compensation for the delay.',
            transition: 'Consequently,',
            pattern: 'coordinating',
            thai: 'ด้วยเหตุนี้ ข้าพเจ้าจึงขอเงินคืนเต็มจำนวนสำหรับตั๋วรถไฟ และข้าพเจ้าคาดหวังค่าชดเชยสำหรับความล่าช้า'
          },
          {
            text: 'In particular, I enclose copies of my boarding pass and train receipt, supporting every figure I have quoted.',
            transition: 'In particular,',
            pattern: 'sv-gerund',
            thai: 'โดยเฉพาะอย่างยิ่ง ข้าพเจ้าได้แนบสำเนาบัตรขึ้นเครื่องและใบเสร็จค่ารถไฟมาด้วย เพื่อสนับสนุนตัวเลขทุกจำนวนที่ข้าพเจ้าอ้างถึง'
          },
          {
            text: 'Finally, I would appreciate a written reply within fourteen days, so that I can settle this matter quickly.',
            transition: 'Finally,',
            pattern: 'coordinating',
            thai: 'สุดท้ายนี้ ข้าพเจ้าจะขอบคุณหากได้รับคำตอบเป็นลายลักษณ์อักษรภายในสิบสี่วัน เพื่อที่จะได้ยุติเรื่องนี้โดยเร็ว'
          }
        ]
      }
    ],
    beginInstruction: 'Begin your letter as follows: Dear Sir or Madam,',
    signoff: 'Yours faithfully,',
    senderName: 'Somchai Wattana',
    practicalVocab: [
      { phrase: 'be delayed by', thaiMeaning: 'ล่าช้าไปเป็นเวลา' },
      { phrase: 'connecting train', thaiMeaning: 'รถไฟต่อเที่ยว' },
      { phrase: 'ground staff', thaiMeaning: 'พนักงานภาคพื้นดิน' },
      { phrase: 'full refund', thaiMeaning: 'การคืนเงินเต็มจำนวน' },
      { phrase: 'boarding pass', thaiMeaning: 'บัตรขึ้นเครื่อง' },
      { phrase: 'settle a matter', thaiMeaning: 'ยุติเรื่อง/สะสางเรื่องให้จบ' }
    ]
  },
  {
    ...COMMON_INSTRUCTIONS,
    id: 'gt-t1-formal-library-improvement',
    number: 6,
    register: 'formal',
    title: 'Suggesting Improvements to a Public Library',
    situation:
      'You use your local public library regularly and believe some of its facilities need improving. You are writing to the library committee.',
    recipient: 'the chair of a library committee',
    letterInstruction: 'Write a letter to the library committee. In your letter:',
    greeting: 'Dear Sir or Madam,',
    bullets: [
      'explain how often you use the library',
      'describe the problems with the current facilities',
      'suggest what improvements should be made'
    ],
    paragraphs: [
      {
        bulletIndex: 0,
        label: 'How you use the library',
        sentences: [
          {
            text: 'First of all, I am writing as a regular user of Ashford Public Library, which I have visited weekly for six years.',
            transition: 'First of all,',
            pattern: 'sv-which',
            thai: 'อย่างแรกเลย ข้าพเจ้าเขียนมาในฐานะผู้ใช้บริการประจำของห้องสมุดประชาชนแอชฟอร์ด ซึ่งข้าพเจ้าไปใช้บริการทุกสัปดาห์มาหกปีแล้ว'
          },
          {
            text: 'To begin with, the library remains an excellent resource, and I have always found the staff unfailingly helpful.',
            transition: 'To begin with,',
            pattern: 'coordinating',
            thai: 'เริ่มจาก ห้องสมุดยังคงเป็นแหล่งความรู้ที่ยอดเยี่ยม และข้าพเจ้าพบว่าเจ้าหน้าที่ให้ความช่วยเหลืออย่างดีเสมอมา'
          },
          {
            text: 'However, several facilities now need urgent attention, making the building less useful than it once was.',
            transition: 'However,',
            pattern: 'sv-gerund',
            thai: 'อย่างไรก็ตาม สิ่งอำนวยความสะดวกหลายอย่างต้องได้รับการแก้ไขอย่างเร่งด่วน ทำให้อาคารนี้มีประโยชน์น้อยลงกว่าที่เคยเป็น'
          }
        ]
      },
      {
        bulletIndex: 1,
        label: 'Problems with the facilities',
        sentences: [
          {
            text: 'Firstly, the study area has only twelve seats although demand rises very sharply during the examination period.',
            transition: 'Firstly,',
            pattern: 'subordinator-middle',
            thai: 'ประการแรก พื้นที่อ่านหนังสือมีที่นั่งเพียงสิบสองที่ แม้ว่าความต้องการจะเพิ่มขึ้นอย่างมากในช่วงสอบ'
          },
          {
            text: 'In addition, the wireless connection fails regularly, which prevents students from completing online work.',
            transition: 'In addition,',
            pattern: 'sv-which',
            thai: 'นอกจากนี้ สัญญาณไร้สายขัดข้องอยู่เป็นประจำ ซึ่งทำให้นักเรียนไม่สามารถทำงานออนไลน์ให้เสร็จได้'
          },
          {
            text: 'Moreover, the children’s section closes at four o’clock because there are simply too few weekend staff available.',
            transition: 'Moreover,',
            pattern: 'subordinator-middle',
            thai: 'ยิ่งไปกว่านั้น โซนเด็กปิดตอนสี่โมงเย็น เพราะว่ามีเจ้าหน้าที่ประจำวันหยุดสุดสัปดาห์น้อยเกินไป'
          }
        ]
      },
      {
        bulletIndex: 2,
        label: 'Improvements you suggest',
        sentences: [
          {
            text: 'Therefore, I would suggest adding twenty extra desks upstairs, and I believe the empty meeting room would suit this purpose perfectly.',
            transition: 'Therefore,',
            pattern: 'coordinating',
            thai: 'ดังนั้น ข้าพเจ้าจึงขอเสนอให้เพิ่มโต๊ะอีกยี่สิบตัวที่ชั้นบน และข้าพเจ้าเชื่อว่าห้องประชุมที่ว่างอยู่จะเหมาะกับวัตถุประสงค์นี้อย่างยิ่ง'
          },
          {
            text: 'In particular, a faster connection would help older visitors, encouraging them to use the computers confidently.',
            transition: 'In particular,',
            pattern: 'sv-gerund',
            thai: 'โดยเฉพาะอย่างยิ่ง สัญญาณที่เร็วขึ้นจะช่วยผู้ใช้บริการสูงอายุ ทำให้พวกเขากล้าใช้คอมพิวเตอร์อย่างมั่นใจ'
          },
          {
            text: 'Finally, I would be grateful if the committee considered these points, so that we can all continue to benefit.',
            transition: 'Finally,',
            pattern: 'coordinating',
            thai: 'สุดท้ายนี้ ข้าพเจ้าจะขอบคุณอย่างยิ่งถ้าคณะกรรมการพิจารณาประเด็นเหล่านี้ เพื่อที่จะให้พวกเราทุกคนได้รับประโยชน์ต่อไป'
          }
        ]
      }
    ],
    beginInstruction: 'Begin your letter as follows: Dear Sir or Madam,',
    signoff: 'Yours faithfully,',
    senderName: 'Margaret Ellis',
    practicalVocab: [
      { phrase: 'regular user', thaiMeaning: 'ผู้ใช้บริการประจำ' },
      { phrase: 'urgent attention', thaiMeaning: 'การแก้ไขอย่างเร่งด่วน' },
      { phrase: 'study area', thaiMeaning: 'พื้นที่อ่านหนังสือ' },
      { phrase: 'wireless connection', thaiMeaning: 'การเชื่อมต่อไร้สาย' },
      { phrase: 'examination period', thaiMeaning: 'ช่วงสอบ' },
      { phrase: 'continue to benefit', thaiMeaning: 'ได้รับประโยชน์ต่อไป' }
    ]
  }
] as const satisfies readonly GeneralTask1Prompt[]

export const GENERAL_TASK1_PROMPTS_BY_REGISTER: Record<
  GeneralTask1Register,
  readonly GeneralTask1Prompt[]
> = {
  informal: GENERAL_TASK1_INFORMAL_PROMPTS,
  'semi-formal': GENERAL_TASK1_SEMIFORMAL_PROMPTS,
  formal: GENERAL_TASK1_FORMAL_PROMPTS
}

export const ALL_GENERAL_TASK1_PROMPTS: readonly GeneralTask1Prompt[] = [
  ...GENERAL_TASK1_INFORMAL_PROMPTS,
  ...GENERAL_TASK1_SEMIFORMAL_PROMPTS,
  ...GENERAL_TASK1_FORMAL_PROMPTS
]

export const findGeneralTask1Prompt = (id: string): GeneralTask1Prompt | null =>
  ALL_GENERAL_TASK1_PROMPTS.find((prompt) => prompt.id === id) ?? null

export const assembleGeneralTask1ModelLetter = (prompt: GeneralTask1Prompt): string =>
  [
    prompt.greeting,
    '',
    ...prompt.paragraphs.flatMap((paragraph) => [
      paragraph.sentences.map((sentence) => sentence.text).join(' '),
      ''
    ]),
    prompt.signoff,
    prompt.senderName
  ].join('\n')
