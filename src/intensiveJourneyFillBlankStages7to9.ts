import type { NewFillBlankSet } from './readingNewFillBlankQuestions.ts'

/** Fill-blank UI for Quest Log ด่าน 7 only (Cambridge 13 Test 1 P1+P2). Stages 8–12: intensiveJourneyFillBlankStages8to12.ts */
export const INTENSIVE_JOURNEY_FILL_BLANK_STAGES_7_9: NewFillBlankSet[] = [
  {
    examId: "journey-normal-stage-7",
    passageNumber: 1,
    startNumber: 1,
    endNumber: 8,
    sourceParagraphs: ["B", "D"],
    instructions: [
      "Questions 1–8",
      "Complete the table below.",
      "Choose ONE WORD ONLY from the passage for each answer.",
      "Write your answers in boxes 1–8 on your answer sheet."
    ],
    summaryTitle: "The uses of the coconut palm",
    summaryLines: [
      { type: 'bullet', text: "Coconut palm trunk — timber for houses and the making of {1}" },
      { type: 'bullet', text: "Coconut palm flowers — sap used as a drink or source of {2}" },
      { type: 'bullet', text: "Fruit middle layer (coir fibres) — used for {3}" },
      { type: 'bullet', text: "Fruit inner layer (shell) — a source of {4}" },
      { type: 'bullet', text: "Fruit inner layer (shell) — when halved, used for {5}" },
      { type: 'bullet', text: "Coconut water — a source of {6} for other plants" },
      { type: 'bullet', text: "Coconut flesh — oil and milk for cooking and {7}" },
      { type: 'bullet', text: "Coconut flesh — glycerine (an ingredient in {8})" }
    ],
    questions: [
      { number: 1, answer: "furniture", passageKeyword: "furniture construction industry|timber for building houses", questionKeyword: "making of furniture", thaiMeaning: "ไม้ทำเฟอร์นิเจอร์", exactPortion: "This is an important source of timber for building houses, and is increasingly being used as a replacement for endangered hardwoods in the furniture construction industry" },
      { number: 2, answer: "sugar", passageKeyword: "reduced by boiling to produce a type of sugar", questionKeyword: "source of sugar", thaiMeaning: "น้ำตาล", exactPortion: "The flower stems may be tapped for their sap to produce a drink, and the sap can also be reduced by boiling to produce a type of sugar used for cooking" },
      { number: 3, answer: "ropes", passageKeyword: "particularly important in manufacturing ropes", questionKeyword: "used for ropes", thaiMeaning: "เชือก", exactPortion: "The thick fibrous middle layer produces coconut fibre, 'coir', which has numerous uses and is particularly important in manufacturing ropes" },
      { number: 4, answer: "charcoal", passageKeyword: "charcoal, which is widely used in various industries", questionKeyword: "source of charcoal", thaiMeaning: "ถ่าน", exactPortion: "An important product obtained from the shell is charcoal, which is widely used in various industries as well as in the home as a cooking fuel" },
      { number: 5, answer: "bowls", passageKeyword: "used as bowls in many parts of Asia", questionKeyword: "when halved for bowls", thaiMeaning: "ชาม", exactPortion: "When broken in half, the shells are also used as bowls in many parts of Asia" },
      { number: 6, answer: "hormones", passageKeyword: "provides the hormones which encourage other plants", questionKeyword: "source of hormones", thaiMeaning: "ฮอร์โมน", exactPortion: "Initially, the endosperm is a sweetish liquid, coconut water, which is enjoyed as a drink, but also provides the hormones which encourage other plants to grow more rapidly and produce higher yields" },
      { number: 7, answer: "cosmetics", passageKeyword: "as well as in cosmetics", questionKeyword: "oil and milk for cosmetics", thaiMeaning: "เครื่องสำอาง", exactPortion: "Dried coconut flesh, 'copra', is made into coconut oil and coconut milk, which are widely used in cooking in different parts of the world, as well as in cosmetics" },
      { number: 8, answer: "dynamite", passageKeyword: "nitroglycerine-based invention: dynamite", questionKeyword: "ingredient in dynamite", thaiMeaning: "ไดนาไมต์", exactPortion: "A derivative of coconut fat, glycerine, acquired strategic importance in a quite different sphere, as Alfred Nobel introduced the world to his nitroglycerine-based invention: dynamite" }
    ]
  },
  {
    examId: "journey-normal-stage-7",
    passageNumber: 2,
    startNumber: 19,
    endNumber: 24,
    sourceParagraphs: ["C", "D"],
    instructions: [
      "Questions 19–24",
      "Complete the summary below.",
      "Choose NO MORE THAN TWO WORDS from the passage for each answer.",
      "Write your answers in boxes 19–24 on your answer sheet."
    ],
    summaryTitle: "Research into how parents talk to babies",
    summaryLines: [
      { type: 'para', text: "Researchers at Washington State University used {19}, together with specialised computer programs, to analyse how parents interacted with their babies during a normal day." },
      { type: 'bullet', text: "The study revealed that {20} tended not to modify their ordinary speech patterns when interacting with their babies." },
      { type: 'bullet', text: "According to an idea known as the {21}, they may use a more adult type of speech to prepare infants for the language they will hear outside the family home." },
      { type: 'bullet', text: "Hearing baby talk from one parent and 'normal' language from the other expands the baby's {22} of types of speech which they can practise." },
      { type: 'bullet', text: "Another study recorded speech and sound using special {23} that the babies were equipped with." },
      { type: 'bullet', text: "When the researchers studied the babies again at age two, those who had heard a lot of baby talk in infancy had a much larger {24} than those who had not." }
    ],
    questions: [
      { number: 19, answer: "recording devices", acceptedAnswers: ["devices"], passageKeyword: "recording devices and speech-recognition software", questionKeyword: "recording devices", thaiMeaning: "อุปกรณ์บันทึก", exactPortion: "Mark VanDam of Washington State University at Spokane and colleagues equipped parents with recording devices and speech-recognition software to study the way they interacted with their youngsters during a normal day" },
      { number: 20, answer: "fathers", acceptedAnswers: ["dads"], passageKeyword: "dads didn't raise their pitch", questionKeyword: "fathers (dads)", thaiMeaning: "พ่อ", exactPortion: "But we found that dads aren't doing the same thing. Dads didn't raise their pitch or fundamental frequency when they talked to kids" },
      { number: 21, answer: "bridge hypothesis", passageKeyword: "bridge hypothesis", questionKeyword: "bridge hypothesis", thaiMeaning: "สมมติฐานสะพาน", exactPortion: "Their role may be rooted in what is called the bridge hypothesis, which dates back to 1975" },
      { number: 22, answer: "repertoire", passageKeyword: "wider repertoire of kinds of speech to practice", questionKeyword: "repertoire of speech types", thaiMeaning: "คลังภาษา", exactPortion: "The idea is that a kid gets to practice a certain kind of speech with mom and another kind of speech with dad, so the kid then has a wider repertoire of kinds of speech to practice" },
      { number: 23, answer: "vests", passageKeyword: "audio-recording vests", questionKeyword: "vests", thaiMeaning: "เสื้อบันทึกเสียง", exactPortion: "fitting 26 children with audio-recording vests that captured language and sound during a typical eight-hour day" },
      { number: 24, answer: "vocabulary", passageKeyword: "dramatically boosted vocabulary", questionKeyword: "larger vocabulary at age two", thaiMeaning: "คำศัพท์", exactPortion: "And when researchers saw the same babies at age two, they found that frequent baby talk had dramatically boosted vocabulary, regardless of socioeconomic status" }
    ]
  }
]
