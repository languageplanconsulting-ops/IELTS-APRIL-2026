import type { NewFillBlankSet } from './readingNewFillBlankQuestions.ts'

/** Fill-blank UI for Quest Log ด่าน 7–9 (Cambridge-style: P1 Q8–14, P2 Q25–27). */
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
  },
  {
    examId: "journey-normal-stage-8",
    passageNumber: 1,
    startNumber: 9,
    endNumber: 13,
    sourceParagraphs: ["F", "G"],
    instructions: [
      "Questions 9–13",
      "Complete the sentences below.",
      "Choose ONE WORD ONLY from the passage for each answer.",
      "Write your answers in boxes 9–13 on your answer sheet."
    ],
    summaryTitle: "Cutty Sark later career",
    summaryLines: [
      { type: 'bullet', text: "After 1880, Cutty Sark carried {9} as its main cargo during its most successful period." },
      { type: 'bullet', text: "As a captain and {10}, Richard Woodget was highly skilled." },
      { type: 'bullet', text: "The ship Ferreira went to Falmouth to repair damage caused by a {11}." },
      { type: 'bullet', text: "Between 1923 and 1954, Cutty Sark was used for {12}." },
      { type: 'bullet', text: "In the 21st century, Cutty Sark has twice been damaged by {13}." }
    ],
    questions: [
      { number: 9, answer: "wool", passageKeyword: "transporting wool from Australia to Britain", questionKeyword: "main cargo wool", thaiMeaning: "ขนแกะ", exactPortion: "the beginning of the most successful period in Cutty Sark's working life, transporting wool from Australia to Britain" },
      { number: 10, answer: "navigator", passageKeyword: "excellent navigator", questionKeyword: "captain and navigator", thaiMeaning: "นักเดินเรือ", exactPortion: "Richard Woodget, was an excellent navigator, who got the best out of both his ship and his crew" },
      { number: 11, answer: "gale", passageKeyword: "Badly damaged in a gale in 1922", questionKeyword: "gale damage", thaiMeaning: "พายุ", exactPortion: "Badly damaged in a gale in 1922, she was put into Falmouth harbour in southwest England, for repairs" },
      { number: 12, answer: "training", passageKeyword: "used Cutty Sark as a training ship", questionKeyword: "used for training 1923–1954", thaiMeaning: "ฝึกอบรม", exactPortion: "Dowman used Cutty Sark as a training ship, and she continued in this role after his death" },
      { number: 13, answer: "fire", passageKeyword: "fire in 2007, and again, less seriously, in 2014", questionKeyword: "damaged by fire 21st century", thaiMeaning: "ไฟไหม้", exactPortion: "The ship suffered from fire in 2007, and again, less seriously, in 2014" }
    ]
  },
  {
    examId: "journey-normal-stage-8",
    passageNumber: 2,
    startNumber: 15,
    endNumber: 18,
    sourceParagraphs: ["B", "C"],
    instructions: [
      "Questions 15–18",
      "Complete the summary below.",
      "Choose ONE WORD ONLY from the passage for each answer.",
      "Write your answers in boxes 15–18 on your answer sheet."
    ],
    summaryTitle: "Why soil degradation could be a disaster for humans",
    summaryLines: [
      { type: 'para', text: "Healthy soil contains bacteria and other microorganisms, as well as plant remains and {15}." },
      { type: 'bullet', text: "It provides food and antibiotics, and storing {16} affects the climate." },
      { type: 'bullet', text: "It also prevents flood damage to buildings because it holds {17}." },
      { type: 'bullet', text: "The main human factor in soil degradation is {18}." }
    ],
    questions: [
      { number: 15, answer: "minerals", passageKeyword: "decomposing plants and various minerals", questionKeyword: "plant remains and minerals", thaiMeaning: "แร่ธาตุ", exactPortion: "living amid decomposing plants and various minerals" },
      { number: 16, answer: "carbon", passageKeyword: "lock in their carbon content", questionKeyword: "storing carbon", thaiMeaning: "คาร์บอน", exactPortion: "they lock in their carbon content, holding three times the amount of carbon as does the entire atmosphere" },
      { number: 17, answer: "water", passageKeyword: "Soils also store water, preventing flood damage", questionKeyword: "holds water", thaiMeaning: "น้ำ", exactPortion: "Soils also store water, preventing flood damage: in the UK, damage to buildings, roads and bridges from floods caused by soil degradation costs £233 million every year" },
      { number: 18, answer: "agriculture", passageKeyword: "Agriculture is by far the biggest problem", questionKeyword: "main factor agriculture", thaiMeaning: "เกษตรกรรม", exactPortion: "Agriculture is by far the biggest problem" }
    ]
  },
  {
    examId: "journey-normal-stage-9",
    passageNumber: 1,
    startNumber: 8,
    endNumber: 14,
    sourceParagraphs: ["A", "G"],
    instructions: [
      "Questions 8–14",
      "Complete the summary below.",
      "Choose ONE WORD ONLY from the passage for each answer.",
      "Write your answers in boxes 8–14 on your answer sheet."
    ],
    summaryTitle: "Biases in human judgement",
    summaryLines: [
      { type: 'bullet', text: "Decision-making falls short of the rational ideal described in classical economic {8}." },
      { type: 'bullet', text: "Kahneman and Tversky's prospect {9} shows people evaluate outcomes relative to a reference point." },
      { type: 'bullet', text: "Overestimating dramatic events because they are easily remembered is the availability {10}." },
      { type: 'bullet', text: "The {11} effect shows identical information can produce opposite decisions when framed differently." },
      { type: 'bullet', text: "When an early number unduly influences later estimates, this is called {12}." },
      { type: 'bullet', text: "An American political scientist named {13} found that expert forecasters were often barely better than chance." },
      { type: 'bullet', text: "Adjusting the pre-selected {14} in any given system can steer people toward better decisions while preserving their freedom to choose." }
    ],
    questions: [
      { number: 8, answer: "model", passageKeyword: "dismantled this model", questionKeyword: "classical economic model", thaiMeaning: "แบบจำลองเศรษฐศาสตร์คลาสสิก", exactPortion: "Decades of psychological research have comprehensively dismantled this model" },
      { number: 9, answer: "theory", passageKeyword: "prospect theory", questionKeyword: "prospect theory", thaiMeaning: "ทฤษฎี prospect", exactPortion: "Their prospect theory, published in 1979" },
      { number: 10, answer: "heuristic", passageKeyword: "availability heuristic", questionKeyword: "availability heuristic", thaiMeaning: "heuristic ความพร้อมใช้", exactPortion: "the availability heuristic — the tendency to judge the frequency or probability of an event based on how easily examples of it come to mind" },
      { number: 11, answer: "framing", passageKeyword: "The framing effect", questionKeyword: "framing effect", thaiMeaning: "เอฟเฟกต์การจัดกรอบ", exactPortion: "The framing effect describes the phenomenon whereby the same information presented in different ways produces different decisions" },
      { number: 12, answer: "anchoring", passageKeyword: "Anchoring describes", questionKeyword: "anchoring", thaiMeaning: "การยึดจุดอ้างอิง", exactPortion: "Anchoring describes the disproportionate influence of the first piece of numerical information encountered on subsequent estimates and judgements" },
      { number: 13, answer: "Tetlock", passageKeyword: "Philip Tetlock", questionKeyword: "political scientist Tetlock", thaiMeaning: "ฟิลิป เท็ตล็อก", exactPortion: "Research by Philip Tetlock across thousands of expert forecasters" },
      { number: 14, answer: "options", passageKeyword: "default options", questionKeyword: "pre-selected options", thaiMeaning: "ตัวเลือกเริ่มต้น", exactPortion: "default options are designed to guide people toward choices that align with their long-term interests" }
    ]
  },
  {
    examId: "journey-normal-stage-9",
    passageNumber: 2,
    startNumber: 25,
    endNumber: 27,
    sourceParagraphs: ["E", "F"],
    instructions: [
      "Questions 25–27",
      "Complete the summary below.",
      "Choose ONE WORD ONLY from the passage for each answer.",
      "Write your answers in boxes 25–27 on your answer sheet."
    ],
    summaryTitle: "Research and cooperation aboard the station",
    summaryLines: [
      { type: 'bullet', text: "Prolonged spaceflight leads to a significant reduction in bone {25}." },
      { type: 'bullet', text: "The station validates the technology required to sustain human {26} during extended periods in space." },
      { type: 'bullet', text: "Despite political tensions, NASA and Roscosmos chose to maintain their working {27}." }
    ],
    questions: [
      { number: 25, answer: "density", passageKeyword: "bone density loss", questionKeyword: "bone density reduction", thaiMeaning: "ความหนาแน่นของกระดูก", exactPortion: "bone density loss of up to 1% per month" },
      { number: 26, answer: "life", passageKeyword: "life support systems", questionKeyword: "life-sustaining systems", thaiMeaning: "ระบบสนับสนุนชีวิต", exactPortion: "The station has also served as a test bed for life support systems" },
      { number: 27, answer: "cooperation", passageKeyword: "maintain operational cooperation", questionKeyword: "working cooperation", thaiMeaning: "ความร่วมมือในการปฏิบัติการ", exactPortion: "NASA and Roscosmos ultimately chose to maintain operational cooperation" }
    ]
  }
]
