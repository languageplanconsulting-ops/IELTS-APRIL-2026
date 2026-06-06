import type { NewFillBlankSet } from './readingNewFillBlankQuestions.ts'
export const INTENSIVE_JOURNEY_FILL_BLANK_STAGES_1_5: NewFillBlankSet[] = [

  {
    examId: "journey-normal-stage-1",
    passageNumber: 1,
    startNumber: 6,
    endNumber: 13,
    sourceParagraphs: ["H","I"],
    instructions: [
          "Questions 6–8",
          "Answer the questions below.",
          "Choose ONE WORD ONLY from the passage for each answer.",
          "Write your answers in boxes 6–8 on your answer sheet.",
          "Questions 9–13",
          "Complete the table below.",
          "Choose ONE WORD AND/OR A NUMBER from the passage for each answer.",
          "Write your answers in boxes 9–13 on your answer sheet."
    ],
    summaryTitle: "Stepwells",
    summaryLines: [
      { type: "bullet", text: "Which part of some stepwells provided shade for people? {6}" },
      { type: "bullet", text: "What type of serious climatic event, which took place in southern Rajasthan, is mentioned in the article? {7}" },
      { type: "bullet", text: "Who are frequent visitors to stepwells nowadays? {8}" },
      { type: "table-header", cells: ["Stepwell", "Date", "Features", "Other notes"] },
      { type: "table-row", cells: ["Rani Ki Vav", "Late 11th century", "As many as 500 sculptures decorate the monument", "Restored in the 1990s. Excellent condition, despite the {9} of 2001."] },
      { type: "table-row", cells: ["Surya Kund", "1026", "Steps on the {10} produce a geometric pattern", "Carved shrines. Looks more like a {11} than a well."] },
      { type: "table-row", cells: ["Raniji Ki Baori", "1699", "Intricately carved monument", "One of 21 baoris in the area commissioned by Queen Nathavatji"] },
      { type: "table-row", cells: ["Chand Baori", "850 AD", "Steps take you down 11 storeys to the bottom", "Old, deep and very dramatic. Has {12} which provide a view to the steps."] },
      { type: "table-row", cells: ["Neemrana Ki Baori", "1700", "Has two {13} levels", "Used by public today"] },
    ],
    questions: [
      { number: 6, answer: "pavilions", passageKeyword: "included pavilions sheltered visitors relentless heat", questionKeyword: "part of stepwells provided shade for people", thaiMeaning: "'they also included pavilions that sheltered visitors from the relentless heat' (บ่อขั้นบันไดมีศาลา/สิ่งปลูกสร้างที่ให้ร่มเงาแก่ผู้มาเยือน) = 'which part provided shade for people' (ส่วนใดให้ร่มเงา) → ดังนั้นคำตอบคือ 'pavilions' (ศาลา/มณฑป)", exactPortion: "they also included pavilions that sheltered visitors from the relentless heat." },
      { number: 7, answer: "drought", passageKeyword: "southern Rajasthan suffered eight-year drought", questionKeyword: "serious climatic event southern Rajasthan", thaiMeaning: "'southern Rajasthan suffered an eight-year drought between 1996 and 2004' (ราชสถานตอนใต้เผชิญภัยแล้งนานแปดปี) = 'what type of serious climatic event took place in southern Rajasthan' (เหตุการณ์สภาพอากาศร้ายแรงอะไรเกิดขึ้น) → ดังนั้นคำตอบคือ 'drought' (ภัยแล้ง)", exactPortion: "Their condition hasn't been helped by recent dry spells: southern Rajasthan suffered an eight-year drought between 1996 and 2004." },
      { number: 8, answer: "tourists", passageKeyword: "Tourists flock to wells far-flung corners", questionKeyword: "frequent visitors to stepwells nowadays", thaiMeaning: "'Tourists flock to wells in far-flung corners of northwestern India' (นักท่องเที่ยวหลั่งไหลมายังบ่อในมุมห่างไกลของอินเดียตะวันตกเฉียงเหนือ) = 'who are frequent visitors to stepwells nowadays' (ใครเป็นผู้มาเยี่ยมบ่อยในปัจจุบัน) → ดังนั้นคำตอบคือ 'tourists' (นักท่องเที่ยว)", exactPortion: "Tourists flock to wells in far-flung corners of northwestern India to gaze in wonder at these architectural marvels from 1,000 years ago" },
      { number: 9, answer: "Earthquake", passageKeyword: "ancient structure survived devastating earthquake Richter", questionKeyword: "Excellent condition despite the of 2001", thaiMeaning: "'this ancient structure survived a devastating earthquake that measured 7.6 on the Richter scale' = 'Excellent condition, despite the {9} of 2001' → ดังนั้นคำตอบคือ 'Earthquake' (แผ่นดินไหว)", exactPortion: "Incredibly, in January 2001, this ancient structure survived a devastating earthquake that measured 7.6 on the Richter scale.", acceptedAnswers: ["Earthquake", "earthquake"] },
      { number: 10, answer: "4 sides", passageKeyword: "four sides steps descend geometrical formation", questionKeyword: "steps on the produce a geometrical pattern", thaiMeaning: "'four sides of steps that descend to the bottom in a stunning geometrical formation' (บันไดสี่ด้านที่ลงสู่ก้นบ่อในรูปแบบเรขาคณิต) = 'steps on the {10} produce a geometrical pattern' (บันไดบนด้านไหนสร้างรูปแบบเรขาคณิต) → ดังนั้นคำตอบคือ '4 sides' (4 ด้าน)", exactPortion: "including four sides of steps that descend to the bottom in a stunning geometrical formation.", acceptedAnswers: ["4 sides", "Four sides", "four sides"] },
      { number: 11, answer: "Tank", passageKeyword: "actually resembles tank kund reservoir rather well", questionKeyword: "looks more like a than a well", thaiMeaning: "'It actually resembles a tank (kund means reservoir or pond) rather than a well' (มันมีลักษณะคล้ายอ่างเก็บน้ำมากกว่าบ่อน้ำ) = 'looks more like a {11} than a well' (ดูเหมือนอะไรมากกว่าบ่อน้ำ) → ดังนั้นคำตอบคือ 'Tank' (อ่างเก็บน้ำ)", exactPortion: "It actually resembles a tank (kund means reservoir or pond) rather than a well" },
      { number: 12, answer: "verandahs", passageKeyword: "verandas supported ornate pillars overlook steps", questionKeyword: "has which provide a view to the steps", thaiMeaning: "'verandas which are supported by ornate pillars overlook the steps' (ระเบียงที่รองรับด้วยเสาประดับมองลงไปเห็นบันได) = 'has {12} which provide a view to the steps' (มีอะไรที่ให้มุมมองเห็นบันได) → ดังนั้นคำตอบคือ 'verandahs' (ระเบียง)", exactPortion: "On the fourth side, verandas which are supported by ornate pillars overlook the steps.", acceptedAnswers: ["verandahs", "verandas"] },
      { number: 13, answer: "underwater", passageKeyword: "nine storeys deep last two being underwater", questionKeyword: "has two levels used by public today", thaiMeaning: "'it's nine storeys deep, with the last two being underwater' (ลึกเก้าชั้น โดยสองชั้นสุดท้ายอยู่ใต้น้ำ) = 'has two {13} levels' (มีสองระดับที่เป็นอะไร) → ดังนั้นคำตอบคือ 'underwater' (ใต้น้ำ)", exactPortion: "Constructed in around 1700, it's nine storeys deep, with the last two being underwater." },
    ]
  },
  {
    examId: "journey-normal-stage-2",
    passageNumber: 2,
    startNumber: 24,
    endNumber: 27,
    sourceParagraphs: ["A","B"],
    instructions: [
          "Questions 24–27",
          "Complete the summary below.",
          "Choose NO MORE THAN TWO WORDS from the passage for each answer.",
          "Write your answers in boxes 24–27 on your answer sheet."
    ],
    summaryTitle: "Gifted children and learning",
    summaryLines: [
      { type: "para", text: "One study found that the higher the children's IQ scores, especially over 130, the better the quality of their educational backup, measured in terms of reported verbal interactions with parents, number of books and {24} in the home." },
      { type: "para", text: "Children of average ability seem to need more direction from teachers because they do not have {25}." },
      { type: "para", text: "Meta-cognition involves children understanding their own learning strategies, as well as developing {26}." },
      { type: "para", text: "Although {27} can produce impressive results in class tests, this style of teaching does not develop children's self-regulation." },
    ],
    questions: [
      { number: 24, answer: "activities", passageKeyword: "number of books and activities in their home", questionKeyword: "number of books and in the home", thaiMeaning: "'number of books and activities in their home' (จำนวนหนังสือและกิจกรรมในบ้าน) = 'number of books and {24} in the home' → ดังนั้นคำตอบคือ 'activities' (กิจกรรม)", exactPortion: "The higher the children's IQ scores, especially over IQ 130, the better the quality of their educational backup, measured in terms of reported verbal interactions with parents, number of books and activities in their home etc.", acceptedAnswers: ["activities", "books and activities", "activities and books"] },
      { number: 25, answer: "internal regulation", passageKeyword: "external regulation by the teacher often compensates for lack of internal regulation", questionKeyword: "they do not have", thaiMeaning: "'lack of internal regulation' (การขาดการควบคุมตนเอง) = 'do not have {25}' → ดังนั้นคำตอบคือ 'internal regulation' (การควบคุมตนเอง)", exactPortion: "There appears to be a qualitative difference in the way the intellectually highly able think, compared with more average-ability or older pupils, for whom external regulation by the teacher often compensates for lack of internal regulation.", acceptedAnswers: ["internal regulation", "self-regulation"] },
      { number: 26, answer: "emotional awareness", passageKeyword: "Emotional awareness is also part of metacognition", questionKeyword: "as well as developing", thaiMeaning: "'Emotional awareness is also part of metacognition' = 'developing {26}' → ดังนั้นคำตอบคือ 'emotional awareness' (ความตระหนักทางอารมณ์)", exactPortion: "Emotional awareness is also part of metacognition, so children should be helped to be aware of their feelings around the area to be learned, feelings of curiosity or confidence, for example.", acceptedAnswers: ["emotional awareness"] },
      { number: 27, answer: "spoon-feeding", passageKeyword: "Although spoon-feeding can produce extremely high examination results", questionKeyword: "Although can produce impressive results in class tests", thaiMeaning: "'spoon-feeding can produce extremely high examination results' = 'Although {27} can produce impressive results' → ดังนั้นคำตอบคือ 'spoon-feeding' (การป้อนความรู้โดยตรง)", exactPortion: "Although 'spoon-feeding' can produce extremely high examination results" },
    ]
  },
  {
    examId: "journey-normal-stage-3",
    passageNumber: 1,
    startNumber: 11,
    endNumber: 13,
    sourceParagraphs: ["D","E"],
    instructions: [
          "Questions 11–13",
          "Complete the sentences below.",
          "Choose NO MORE THAN THREE WORDS from the passage for each answer.",
          "Write your answers in boxes 11–13 on your answer sheet."
    ],
    summaryLines: [
      { type: "para", text: "In Greece, tourism the most important {11}." },
      { type: "para", text: "The travel and tourism industry in Jamaica is the major {12}." },
      { type: "para", text: "The problems associated with measuring international tourism are often reflected in the measurement of {13}." },
    ],
    questions: [
      { number: 11, answer: "source of income", passageKeyword: "tourism is the major source of income", questionKeyword: "In Greece tourism the most important", thaiMeaning: "'tourism is the major source of income in ... Greece' = 'In Greece, tourism the most important {11}' → ดังนั้นคำตอบคือ 'source of income' (แหล่งรายได้)", exactPortion: "For example, tourism is the major source of income in Bermuda, Greece, Italy, Spain, Switzerland and most Caribbean countries.", acceptedAnswers: ["source of income", "industry", "income"] },
      { number: 12, answer: "employer", passageKeyword: "number one ranked employer Jamaica", questionKeyword: "travel and tourism industry in Jamaica is the major", thaiMeaning: "'the travel and tourism industry is the number one ranked employer in ... Jamaica' = 'The travel and tourism industry in Jamaica is the major {12}' → ดังนั้นคำตอบคือ 'employer' (นายจ้าง)", exactPortion: "In addition, Hawkins and Ritchie, quoting from data published by the American Express Company, suggest that the travel and tourism industry is the number one ranked employer in the Bahamas, Brazil, Canada, France, (the former) West Germany, Hong Kong, Italy, Jamaica, Japan, Singapore, the United Kingdom and the United States." },
      { number: 13, answer: "domestic tourism", passageKeyword: "similar difficulties attempts measure domestic tourism", questionKeyword: "problems measuring international tourism reflected in measurement of", thaiMeaning: "'similar difficulties arise when attempts are made to measure domestic tourism' = 'The problems associated with measuring international tourism are often reflected in the measurement of {13}' → ดังนั้นคำตอบคือ 'domestic tourism' (การท่องเที่ยวในประเทศ)", exactPortion: "In many cases, similar difficulties arise when attempts are made to measure domestic tourism.", acceptedAnswers: ["domestic tourism"] },
    ]
  },
  {
    examId: "journey-normal-stage-3",
    passageNumber: 2,
    startNumber: 20,
    endNumber: 23,
    sourceParagraphs: ["G","H"],
    instructions: [
          "Questions 20–23",
          "Complete the summary below.",
          "Choose ONE WORD ONLY from the passage for each answer.",
          "Write your answers in boxes 20–23 on your answer sheet."
    ],
    summaryTitle: "Autumn leaves",
    summaryLines: [
      { type: "para", text: "The most vividly coloured red leaves are found on the side of the tree facing the {20}." },
      { type: "para", text: "The {21} surfaces of leaves contain the most red pigment." },
      { type: "para", text: "Red leaves are most abundant when daytime weather conditions are {22} and sunny." },
      { type: "para", text: "The intensity of the red colour of leaves increases as you go further {23}." },
    ],
    questions: [
      { number: 20, answer: "sun", passageKeyword: "side of tree gets most sun", questionKeyword: "vividly coloured leaves facing the blank", thaiMeaning: "'side of the tree which gets most sun' (ด้านที่ได้รับแสงแดดมากที่สุด) = 'side of the tree facing the {20}' (ด้านที่หันเข้าหา...) → ดังนั้นคำตอบคือ 'sun' (ดวงอาทิตย์)", exactPortion: "One is straightforward: on many trees, the leaves that are the reddest are those on the side of the tree which gets most sun", acceptedAnswers: ["sunlight"] },
      { number: 21, answer: "upper", passageKeyword: "red is brighter on upper side", questionKeyword: "upper surfaces of leaves contain red pigment", thaiMeaning: "'the red is brighter on the upper side of the leaf' (สีแดงสดใสกว่าที่ด้านบนของใบ) = 'the {21} surfaces of leaves contain the most red pigment' (พื้นผิว...ของใบมีสารสีแดงมากที่สุด) → ดังนั้นคำตอบคือ 'upper' (ด้านบน)", exactPortion: "Not only that, but the red is brighter on the upper side of the leaf." },
      { number: 22, answer: "dry", passageKeyword: "best conditions intense red colours dry sunny", questionKeyword: "daytime weather conditions blank and sunny", thaiMeaning: "'the best conditions for intense red colours are dry, sunny days' (สภาวะที่ดีที่สุดสำหรับสีแดงเข้มคือวันที่แห้งแล้งและมีแดด) = 'daytime weather conditions are {22} and sunny' (สภาพอากาศกลางวัน...และมีแสงแดด) → ดังนั้นคำตอบคือ 'dry' (แห้งแล้ง)", exactPortion: "It has also been recognised for decades that the best conditions for intense red colours are dry, sunny days and cool nights" },
      { number: 23, answer: "north", passageKeyword: "trees get much redder more north you travel", questionKeyword: "intensity red colour increases go further blank", thaiMeaning: "'trees usually get much redder the more north you travel' (ต้นไม้มักจะแดงขึ้นมากยิ่งเดินทางไปทางเหนือมากขึ้น) = 'intensity of red colour increases as you go further {23}' (ความเข้มของสีแดงเพิ่มขึ้นเมื่อไปทาง...) → ดังนั้นคำตอบคือ 'north' (ทิศเหนือ)", exactPortion: "And finally, trees such as maples usually get much redder the more north you travel in the northern hemisphere." },
    ]
  },
  {
    examId: "journey-normal-stage-4",
    passageNumber: 1,
    startNumber: 1,
    endNumber: 6,
    sourceParagraphs: ["C","D"],
    instructions: [
          "Questions 1–6",
          "Complete the summary below.",
          "Choose ONE WORD ONLY from the passage for each answer.",
          "Write your answers in boxes 1–6 on your answer sheet."
    ],
    summaryTitle: "The megafires of California",
    summaryLines: [
      { type: "para", text: "Wildfires now {1} more unpredictably than in the past." },
      { type: "para", text: "Megafires are {2} times the size of the average forest fire of 20 years ago." },
      { type: "para", text: "The region has had significantly {3} normal precipitation in recent years." },
      { type: "para", text: "Stopping wildfires quickly has left more brush to act as {4} for megafires." },
      { type: "para", text: "Fire {5} are on average 78 days longer than they were 20 years ago." },
      { type: "para", text: "There is increased {6} in vulnerable wooded areas." },
    ],
    questions: [
      { number: 1, answer: "spread", passageKeyword: "spread more erratically than in the past", questionKeyword: "Wildfires now more unpredictably than in the past", thaiMeaning: "'spread more erratically than in the past' = 'Wildfires now {1} more unpredictably' → ดังนั้นคำตอบคือ 'spread' (แพร่กระจาย)", exactPortion: "The wildfires themselves, experts say, are generally hotter, faster, and spread more erratically than in the past." },
      { number: 2, answer: "10", passageKeyword: "10 times the size of the average forest fire of 20 years ago", questionKeyword: "Megafires are times the size", thaiMeaning: "'10 times the size of the average forest fire of 20 years ago' = 'Megafires are {2} times the size' → ดังนั้นคำตอบคือ '10' (10)", exactPortion: "10 times the size of the average forest fire of 20 years ago.", acceptedAnswers: ["10", "ten", "10 times", "ten times"] },
      { number: 3, answer: "below", passageKeyword: "significantly below normal precipitation many recent years", questionKeyword: "rainfall average", thaiMeaning: "'significantly below normal precipitation in many recent years' (ปริมาณน้ำฝนต่ำกว่าปกติอย่างมีนัยสำคัญในหลายปีที่ผ่านมา) = 'below average rainfall' (ปริมาณน้ำฝนต่ำกว่าค่าเฉลี่ย) → ดังนั้นคำตอบคือ 'below' (ต่ำกว่า)", exactPortion: "has had significantly below normal precipitation in many recent years." },
      { number: 4, answer: "fuel", passageKeyword: "underbrush now the primary fuel for megafires", questionKeyword: "more brush to act as", thaiMeaning: "'underbrush, now the primary fuel for megafires' (พุ่มไม้ใต้ต้นไม้ซึ่งปัจจุบันเป็นเชื้อเพลิงหลักของไฟป่าขนาดใหญ่) = 'brush to act as [fuel]' (พุ่มไม้ที่ทำหน้าที่เป็นเชื้อเพลิง) → ดังนั้นคำตอบคือ 'fuel' (เชื้อเพลิง)", exactPortion: "halt the natural eradication of underbrush, now the primary fuel for megafires." },
      { number: 5, answer: "seasons", passageKeyword: "fire seasons on average 78 days longer", questionKeyword: "extended fire", thaiMeaning: "'fire seasons that on average are 78 days longer than they were 20 years ago' (ฤดูไฟป่าที่โดยเฉลี่ยยาวนานกว่าเมื่อ 20 ปีก่อนถึง 78 วัน) = 'extended fire [seasons]' (ฤดูไฟป่าที่ยาวนานขึ้น) → ดังนั้นคำตอบคือ 'seasons' (ฤดูกาล)", exactPortion: "Second is fire seasons that on average are 78 days longer than they were 20 years ago." },
      { number: 6, answer: "housing", passageKeyword: "more residential housing is being built", questionKeyword: "There is increased in vulnerable wooded areas", thaiMeaning: "'more residential housing is being built' = 'There is increased {6} in vulnerable wooded areas' → ดังนั้นคำตอบคือ 'housing' (ที่อยู่อาศัย)", exactPortion: "In California, where population growth has averaged more than 600,000 a year for at least a decade, more residential housing is being built.", acceptedAnswers: ["homes", "housing"] },
    ]
  },
  {
    examId: "journey-normal-stage-4",
    passageNumber: 2,
    startNumber: 15,
    endNumber: 19,
    sourceParagraphs: ["A","B"],
    instructions: [
          "Questions 15–19",
          "Complete the summary below.",
          "Choose NO MORE THAN TWO WORDS from the passage for each answer.",
          "Write your answers in boxes 15–19 on your answer sheet."
    ],
    summaryTitle: "Second nature",
    summaryLines: [
      { type: "para", text: "Psychologists have long held that a person's character cannot undergo a {15} in any meaningful way and that the key traits of personality are determined at a very {16}." },
      { type: "para", text: "Some qualities are less challenging to develop than others, {17} being one of them." },
      { type: "para", text: "However, developing qualities requires mastering a range of {18} which are diverse and sometimes surprising." },
      { type: "para", text: "For example, to bring more joy and passion into your life, you must be open to experiencing negative {19}." },
    ],
    questions: [
      { number: 15, answer: "transformation", passageKeyword: "character cannot undergo a transformation", questionKeyword: "character cannot undergo a blank", thaiMeaning: "'cannot undergo a transformation' (ไม่สามารถเปลี่ยนแปลงได้) = 'cannot undergo a {15}' (ไม่สามารถเกิด ___ ขึ้น) → ดังนั้นคำตอบคือ 'transformation' (การเปลี่ยนแปลง)", exactPortion: "Psychologists have long held that a person's character cannot undergo a transformation in any meaningful way", acceptedAnswers: ["change"] },
      { number: 16, answer: "young age", passageKeyword: "personality are determined at a very young age", questionKeyword: "key traits determined at a very blank", thaiMeaning: "'determined at a very young age' (ถูกกำหนดตั้งแต่วัยเด็กมาก) = 'determined at a very {16}' (ถูกกำหนดตั้งแต่ ___ มาก) → ดังนั้นคำตอบคือ 'young age' (วัยเยาว์)", exactPortion: "and that the key traits of personality are determined at a very young age.", acceptedAnswers: ["young age"] },
      { number: 17, answer: "optimism", passageKeyword: "qualities less challenging to develop optimism", questionKeyword: "qualities less challenging to develop blank", thaiMeaning: "'optimism being one of them' (การมองโลกในแง่ดีเป็นหนึ่งในนั้น) = '{17} being one of them' (___ เป็นหนึ่งในนั้น) → ดังนั้นคำตอบคือ 'optimism' (การมองโลกในแง่ดี)", exactPortion: "Some qualities are less challenging to develop than others, optimism being one of them." },
      { number: 18, answer: "skills", passageKeyword: "developing qualities requires mastering a range of skills", questionKeyword: "developing qualities requires mastering a range of blank", thaiMeaning: "'requires mastering a range of skills' (ต้องการการฝึกฝนทักษะหลากหลาย) = 'requires mastering a range of {18}' (ต้องการการฝึกฝน ___ หลากหลาย) → ดังนั้นคำตอบคือ 'skills' (ทักษะ)", exactPortion: "However, developing qualities requires mastering a range of skills which are diverse and sometimes surprising.", acceptedAnswers: ["techniques"] },
      { number: 19, answer: "emotions", passageKeyword: "open to experiencing negative emotions", questionKeyword: "open to experiencing negative blank", thaiMeaning: "'open to experiencing negative emotions' (เปิดรับการสัมผัสอารมณ์เชิงลบ) = 'open to experiencing negative {19}' (เปิดรับการสัมผัส ___ เชิงลบ) → ดังนั้นคำตอบคือ 'emotions' (อารมณ์)", exactPortion: "For example, to bring more joy and passion into your life, you must be open to experiencing negative emotions.", acceptedAnswers: ["emotions","feelings"] },
    ]
  },
  {
    examId: "journey-normal-stage-5",
    passageNumber: 1,
    startNumber: 1,
    endNumber: 7,
    sourceParagraphs: ["F","G"],
    instructions: [
          "Questions 1–7",
          "Complete the sentences below.",
          "Choose NO MORE THAN TWO WORDS from the passage for each answer.",
          "Write your answers in boxes 1–7 on your answer sheet."
    ],
    summaryTitle: "Indoor farming",
    summaryLines: [
      { type: "para", text: "1 Some food plants, including {1}, are already grown indoors." },
      { type: "para", text: "2 Vertical farms would be located in {2}, meaning that there would be less need to take them long distances to customers." },
      { type: "para", text: "3 Vertical farms could use methane from plants and animals to produce {3}." },
      { type: "para", text: "4 The consumption of {4} would be cut because agricultural vehicles would be unnecessary." },
      { type: "para", text: "5 The fact that vertical farms would need {5} light is a disadvantage." },
      { type: "para", text: "6 One form of vertical farming involves planting in {6} which are not fixed." },
      { type: "para", text: "7 The most probable development is that food will be grown on {7} in towns and cities." },
    ],
    questions: [
      { number: 1, answer: "tomatoes", passageKeyword: "hothouse production of tomatoes other produce", questionKeyword: "hothouse production {1} and other produce", thaiMeaning: "'hothouse production of tomatoes and other produce' (การผลิตในเรือนกระจกของมะเขือเทศและผลิตผลอื่น) = 'hothouse production of {1} and other produce' (การผลิตในเรือนกระจกรวมถึงผลิตผลอื่น) → ดังนั้นคำตอบคือ 'tomatoes' (มะเขือเทศ)", exactPortion: "The concept of indoor farming is not new, since hothouse production of tomatoes and other produce has been in vogue for some time." },
      { number: 2, answer: "urban centres", passageKeyword: "situated in the heart of urban centres", questionKeyword: "Vertical farms would be located in", thaiMeaning: "'Situated in the heart of urban centres' = 'located in {2}' → ดังนั้นคำตอบคือ 'urban centres' (ศูนย์กลางเมือง)", exactPortion: "Situated in the heart of urban centres, they would drastically reduce the amount of transportation required to bring food to consumers.", acceptedAnswers: ["urban centres", "urban centers", "centres", "centers"] },
      { number: 3, answer: "energy", passageKeyword: "return energy to the grid via methane generation", questionKeyword: "use methane from plants and animals to produce", thaiMeaning: "'return energy to the grid via methane generation' = 'to produce {3}' → ดังนั้นคำตอบคือ 'energy' (พลังงาน)", exactPortion: "it would return energy to the grid via methane generation from composting nonedible parts of plants." },
      { number: 4, answer: "fossil fuel", passageKeyword: "dramatically reduce fossil fuel use", questionKeyword: "The consumption of would be cut", thaiMeaning: "'dramatically reduce fossil fuel use' = 'The consumption of {4} would be cut' → ดังนั้นคำตอบคือ 'fossil fuel' (เชื้อเพลิงฟอสซิล)", exactPortion: "It would also dramatically reduce fossil fuel use, by cutting out the need for tractors, ploughs and shipping.", acceptedAnswers: ["fossil fuel", "fossil fuels"] },
      { number: 5, answer: "artificial", passageKeyword: "plants would require artificial light", questionKeyword: "plants would require {5} lighting", thaiMeaning: "'the plants would require artificial light' (พืชต้องการแสงเทียม) = 'plants would require {5} lighting' (พืชต้องการแสง...) → ดังนั้นคำตอบคือ 'artificial' (เทียม/ประดิษฐ์)", exactPortion: "A major drawback of vertical farming, however, is that the plants would require artificial light." },
      { number: 6, answer: "trays", passageKeyword: "grow plants in stacked trays move on rails", questionKeyword: "grow plants in stacked {6} that move on rails", thaiMeaning: "'grow plants in stacked trays that move on rails' (ปลูกพืชในถาดซ้อนกันที่เคลื่อนบนราง) = 'grow plants in stacked {6} that move on rails' (ปลูกพืชใน...ซ้อนกันบนราง) → ดังนั้นคำตอบคือ 'trays' (ถาด)", exactPortion: "One variation on vertical farming that has been developed is to grow plants in stacked trays that move on rails.", acceptedAnswers: ["trays", "stacked trays"] },
      { number: 7, answer: "rooftops", passageKeyword: "simply use space available on urban rooftops", questionKeyword: "simply use space available on urban {7}", thaiMeaning: "'we will simply use the space available on urban rooftops' (เราจะใช้พื้นที่บนดาดฟ้าในเมืองอย่างง่ายๆ) = 'simply use space available on urban {7}' (ใช้พื้นที่บน...ในเมือง) → ดังนั้นคำตอบคือ 'rooftops' (ดาดฟ้า)", exactPortion: "While it is possible that much of our food will be grown in skyscrapers in future, most experts currently believe it is far more likely that we will simply use the space available on urban rooftops.", acceptedAnswers: ["rooftops", "urban rooftops"] },
    ]
  },
  {
    examId: "journey-normal-stage-5",
    passageNumber: 2,
    startNumber: 21,
    endNumber: 27,
    diagramImage: "/reading-diagrams/falkirk-wheel-lift.svg",
    diagramAlt: "Diagram showing how a boat is lifted on the Falkirk Wheel",
    sourceParagraphs: ["G","J"],
    instructions: [
          "Questions 21–27",
          "Label the diagram below.",
          "Choose ONE WORD from the passage for each answer.",
          "Write your answers in boxes 21–27 on your answer sheet."
    ],
    summaryTitle: "How a boat is lifted on the Falkirk Wheel",
    summaryLines: [
      { type: 'diagram' },
      { type: "bullet", text: "A pair of {21} are lifted in order to shut out water from canal basin" },
      { type: "bullet", text: "A {22} is taken out, enabling Wheel to rotate" },
      { type: "bullet", text: "Hydraulic motors drive {23}" },
      { type: "bullet", text: "A range of different-sized {24} ensures boat keeps upright" },
      { type: "bullet", text: "Boat reaches top Wheel, then moves directly onto {25}" },
      { type: "bullet", text: "Boat travels through tunnel beneath Roman {26}" },
      { type: "bullet", text: "{27} raise boat 11 m to level of Union Canal" },
    ],
    questions: [
      { number: 21, answer: "gates", passageKeyword: "hydraulic steel gates are raised", questionKeyword: "pair lifted shut out water canal basin", thaiMeaning: "'Two hydraulic steel gates are raised, so as to seal the gondola off from the water in the canal basin' = 'A pair of {21} are lifted in order to shut out water from canal basin' → ดังนั้นคำตอบคือ 'gates' (ประตู)", exactPortion: "Two hydraulic steel gates are raised, so as to seal the gondola off from the water in the canal basin." },
      { number: 22, answer: "clamp", passageKeyword: "hydraulic clamp is removed allowing Wheel to turn", questionKeyword: "taken out enabling Wheel to rotate", thaiMeaning: "'A hydraulic clamp ... is removed, allowing the Wheel to turn' = 'A {22} is taken out, enabling Wheel to rotate' → ดังนั้นคำตอบคือ 'clamp' (แคลมป์)", exactPortion: "A hydraulic clamp, which prevents the arms of the Wheel moving while the gondola is docked, is removed, allowing the Wheel to turn." },
      { number: 23, answer: "axle", passageKeyword: "hydraulic motors rotate the central axle", questionKeyword: "Hydraulic motors drive", thaiMeaning: "'an array of ten hydraulic motors then begins to rotate the central axle' = 'Hydraulic motors drive {23}' → ดังนั้นคำตอบคือ 'axle' (เพลากลาง)", exactPortion: "In the central machine room an array of ten hydraulic motors then begins to rotate the central axle." },
      { number: 24, answer: "cogs", passageKeyword: "eight-metre-wide cogs ensuring gondolas remain level", questionKeyword: "different-sized ensures boat keeps upright", thaiMeaning: "'Two eight-metre-wide cogs ... ensuring that the gondolas always remain level' = 'A range of different-sized {24} ensures boat keeps upright' → ดังนั้นคำตอบคือ 'cogs' (เฟือง)", exactPortion: "Two eight-metre-wide cogs orbit a fixed inner cog of the same width, connected by two smaller cogs travelling in the opposite direction to the outer cogs – so ensuring that the gondolas always remain level." },
      { number: 25, answer: "aqueduct", passageKeyword: "boat passes straight onto the aqueduct", questionKeyword: "Boat reaches top Wheel then moves directly onto", thaiMeaning: "'the boat passes straight onto the aqueduct situated 24 metres above the canal basin' = 'Boat reaches top Wheel, then moves directly onto {25}' → ดังนั้นคำตอบคือ 'aqueduct' (สะพานส่งน้ำ)", exactPortion: "When the gondola reaches the top, the boat passes straight onto the aqueduct situated 24 metres above the canal basin." },
      { number: 26, answer: "wall", passageKeyword: "Boats travel under this wall via a tunnel", questionKeyword: "Boat travels through tunnel beneath Roman", thaiMeaning: "'Boats travel under this wall via a tunnel' = 'Boat travels through tunnel beneath Roman {26}' → ดังนั้นคำตอบคือ 'wall' (กำแพง)", exactPortion: "Boats travel under this wall via a tunnel, then through the locks, and finally on to the Union Canal." },
      { number: 27, answer: "locks", passageKeyword: "11 metres of lift achieved by means of a pair of locks", questionKeyword: "raise boat 11 m to level of Union Canal", thaiMeaning: "'The remaining 11 metres of lift needed to reach the Union Canal is achieved by means of a pair of locks' = '{27} raise boat 11 m to level of Union Canal' → ดังนั้นคำตอบคือ 'locks' (ประตูน้ำ)", exactPortion: "The remaining 11 metres of lift needed to reach the Union Canal is achieved by means of a pair of locks." },
    ]
  }
]
