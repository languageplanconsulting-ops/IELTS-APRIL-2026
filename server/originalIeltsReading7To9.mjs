const TOPIC_SETS = [
  {
    book: 7,
    tests: [
      ['Urban Beekeeping Networks', 'City Rooftops as Climate Laboratories', 'The Psychology of Waiting'],
      ['Restoring a Coastal Path', 'Libraries After Midnight', 'When Maps Become Arguments'],
      ['A Museum for Ordinary Objects', 'The Economics of Repair Cafes', 'How Noise Changes Learning'],
      ['Farms Inside Former Factories', 'The Return of Public Drinking Fountains', 'Trust in Automated Advice']
    ]
  },
  {
    book: 8,
    tests: [
      ['The Hidden Work of Street Trees', 'Rewilding Small Rivers', 'The Science of Useful Forgetting'],
      ['Community Kitchens and Public Health', 'A New Life for Old Cinemas', 'Why Some Innovations Spread Slowly'],
      ['Learning from Traditional Ferries', 'The Business of Second-hand Clothes', 'Can Curiosity Be Measured?'],
      ['Designing Parks for Heatwaves', 'The Revival of Handwriting', 'The Limits of Prediction']
    ]
  },
  {
    book: 9,
    tests: [
      ['Citizen Astronomy in Bright Cities', 'Keeping Food Cold Without Electricity', 'The History of Workplace Breaks'],
      ['Floating Gardens', 'The Changing Role of Local Radio', 'How Experts Revise Their Opinions'],
      ['The Architecture of Quiet Schools', 'Markets That Use No Money', 'The Problem with Perfect Efficiency'],
      ['Recording Endangered Recipes', 'Repairing Coral Nurseries', 'Why Deep Reading Still Matters']
    ]
  }
]

const PASSAGE_RANGES = {
  1: [1, 13],
  2: [14, 26],
  3: [27, 40]
}

const makeSlug = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const evidenceFor = (title, passageNumber) => {
  const subject = title.toLowerCase()
  const advancedFrame =
    passageNumber === 3
      ? 'The debate became difficult because the strongest evidence supported several explanations at once.'
      : 'The practical aim was easier to describe than to organise.'

  return {
    subject,
    startTerm: 'community audit',
    methodTerm: 'interviews',
    storageTerm: 'shared database',
    problemTerm: 'unreliable funding',
    growthTerm: 'doubled',
    staffTerm: 'trained volunteers',
    toolTerm: 'portable sensors',
    resultTerm: 'cooler streets',
    policyTerm: 'maintenance budget',
    finalTerm: 'public workshops',
    paragraphs: [
      `${title} began as a community audit after residents noticed that small changes in daily routines were producing large effects. The organisers wanted an IELTS-style study that ordinary people could understand, so they recorded both visible results and the language people used to describe them. Researchers first collected data through interviews with shopkeepers, students, parents and retired workers. The team stored every observation in a shared database, which allowed mistakes to be corrected quickly.`,
      `The main early problem was unreliable funding, not a lack of public interest. Some sponsors promised help and then disappeared, while others wanted the project to advertise their own products. By the second year, participation had doubled because local schools and neighbourhood groups began to treat the work as a practical lesson. The organisers did not replace teachers with software; they used software to prepare clearer summaries for teachers.`,
      `A group of trained volunteers checked the information before it was published. They used portable sensors when measurements were needed, but they also kept written notes because numbers alone could not explain why people changed their behaviour. One report concluded that the most visible result was cooler streets during the hottest weeks. Another report warned that the improvement would disappear if the council ignored its maintenance budget.`,
      `The project was deliberately cautious. It did not claim that ${subject} could solve every urban problem, and it did not say that private companies should control public services. Instead, it argued that small experiments become useful when they are repeated, compared and explained. ${advancedFrame}`,
      `The final stage involved public workshops where residents tested the recommendations and rewrote confusing instructions. This mattered because the original technical report was accurate but difficult to read. After the workshops, the team produced shorter guides, clearer diagrams and a checklist that community groups could adapt. The authors concluded that evidence becomes powerful only when people can use it without needing an expert beside them.`
    ]
  }
}

const answerBlocksFor = ({ book, testNumber, passageNumber, title }) => {
  const [start, end] = PASSAGE_RANGES[passageNumber]
  const evidence = evidenceFor(title, passageNumber)
  const questionData = [
    {
      answer: 'community audit',
      prompt: `According to the passage, ${title} began as a _____.`,
      exact: `${title} began as a community audit after residents noticed that small changes in daily routines were producing large effects.`,
      thai: 'คำตอบคือ community audit เพราะประโยคแรกบอกตรง ๆ ว่าโครงการเริ่มจากการสำรวจ/ตรวจสอบโดยชุมชน',
      paraphrase: 'began as = started as = เริ่มต้นจาก'
    },
    {
      answer: 'interviews',
      prompt: 'Researchers first gathered information through _____.',
      exact: 'Researchers first collected data through interviews with shopkeepers, students, parents and retired workers.',
      thai: 'โจทย์ใช้ gathered information ส่วน passage ใช้ collected data และบอกวิธีคือ interviews',
      paraphrase: 'gathered information = collected data = รวบรวมข้อมูล'
    },
    {
      answer: 'shared database',
      prompt: 'All observations were kept in a _____.',
      exact: 'The team stored every observation in a shared database, which allowed mistakes to be corrected quickly.',
      thai: 'คำว่า kept ในโจทย์เท่ากับ stored ใน passage และสิ่งที่ใช้เก็บคือ shared database',
      paraphrase: 'kept = stored = เก็บไว้'
    },
    {
      answer: 'unreliable funding',
      prompt: 'The first major difficulty was _____.',
      exact: 'The main early problem was unreliable funding, not a lack of public interest.',
      thai: 'โจทย์ถาม difficulty และ passage ใช้คำว่า problem โดยระบุว่าเป็น unreliable funding',
      paraphrase: 'major difficulty = main problem = ปัญหาหลัก'
    },
    {
      answer: 'TRUE',
      prompt: 'The number of participants increased strongly in the second year.',
      exact: 'By the second year, participation had doubled because local schools and neighbourhood groups began to treat the work as a practical lesson.',
      thai: 'TRUE เพราะ doubled แปลว่าจำนวนเพิ่มขึ้นเป็นสองเท่า สอดคล้องกับ increased strongly',
      paraphrase: 'increased strongly = doubled = เพิ่มขึ้นมาก/เพิ่มเป็นสองเท่า'
    },
    {
      answer: 'FALSE',
      prompt: 'The organisers used software to replace teachers.',
      exact: 'The organisers did not replace teachers with software; they used software to prepare clearer summaries for teachers.',
      thai: 'FALSE เพราะ passage บอกชัดว่าไม่ได้ใช้ software มาแทนครู แต่ใช้ช่วยทำ summary ให้ครู',
      paraphrase: 'replace teachers = replace teachers with software = ใช้แทนครู'
    },
    {
      answer: 'NOT GIVEN',
      prompt: 'The project received a national prize for its educational work.',
      exact: 'By the second year, participation had doubled because local schools and neighbourhood groups began to treat the work as a practical lesson.',
      thai: 'NOT GIVEN เพราะ passage พูดถึงโรงเรียนใช้เป็นบทเรียน แต่ไม่ได้บอกว่าได้รับรางวัลระดับชาติ',
      paraphrase: 'national prize = award from the country = รางวัลระดับชาติ'
    },
    {
      answer: 'trained volunteers',
      prompt: 'Who checked the information before publication?',
      exact: 'A group of trained volunteers checked the information before it was published.',
      thai: 'คำตอบคือ trained volunteers เพราะประโยคนี้บอกผู้ที่ตรวจข้อมูลก่อนเผยแพร่โดยตรง',
      paraphrase: 'before publication = before it was published = ก่อนเผยแพร่'
    },
    {
      answer: 'portable sensors',
      prompt: 'What equipment was used when measurements were necessary?',
      exact: 'They used portable sensors when measurements were needed, but they also kept written notes because numbers alone could not explain why people changed their behaviour.',
      thai: 'โจทย์ถาม equipment สำหรับ measurements และ passage ระบุ portable sensors',
      paraphrase: 'measurements were necessary = measurements were needed = เมื่อต้องมีการวัดค่า'
    },
    {
      answer: 'cooler streets',
      prompt: 'What was described as the most visible result?',
      exact: 'One report concluded that the most visible result was cooler streets during the hottest weeks.',
      thai: 'คำตอบคือ cooler streets เพราะ passage ใช้คำเดียวกับโจทย์ว่า most visible result',
      paraphrase: 'most visible result = most visible result = ผลลัพธ์ที่เห็นชัดที่สุด'
    },
    {
      answer: 'maintenance budget',
      prompt: 'The improvement might disappear without attention to the _____.',
      exact: 'Another report warned that the improvement would disappear if the council ignored its maintenance budget.',
      thai: 'โจทย์ใช้ without attention to ส่วน passage ใช้ ignored ความหมายคือไม่ใส่ใจ maintenance budget',
      paraphrase: 'without attention to = ignored = ไม่ใส่ใจ/ละเลย'
    },
    {
      answer: 'public workshops',
      prompt: 'In the final stage, residents took part in _____.',
      exact: 'The final stage involved public workshops where residents tested the recommendations and rewrote confusing instructions.',
      thai: 'คำตอบคือ public workshops เพราะประโยคบอกว่า final stage เกี่ยวข้องกับกิจกรรมนี้',
      paraphrase: 'took part in = involved = เข้าร่วม/เกี่ยวข้องกับ'
    },
    {
      answer: 'checklist',
      prompt: 'The team produced shorter guides, clearer diagrams and a _____.',
      exact: 'After the workshops, the team produced shorter guides, clearer diagrams and a checklist that community groups could adapt.',
      thai: 'คำตอบคือ checklist เพราะเป็นรายการที่สามหลัง shorter guides และ clearer diagrams',
      paraphrase: 'produced = made = ผลิต/จัดทำ'
    },
    {
      answer: 'several explanations',
      prompt: 'The advanced passage says the evidence supported _____ at once.',
      exact: 'The debate became difficult because the strongest evidence supported several explanations at once.',
      thai: 'คำตอบคือ several explanations เพราะ passage 3 เพิ่มประเด็นว่า evidence รองรับหลายคำอธิบายพร้อมกัน',
      paraphrase: 'at once = at the same time = พร้อมกัน'
    }
  ]

  return questionData.slice(0, end - start + 1).map((item, index) => {
    const number = start + index
    return `Question ${number}: ${item.prompt}

Correct Answer: ${item.answer}

Accepted Answers: ${item.answer}

Answer Group: IELTS Reading Practice ${book} Test ${testNumber} Passage ${passageNumber}

Exact Portion: "${item.exact}"

Short Thai Explanation: ${item.thai}

Paraphrased Vocabulary: ${item.paraphrase}`
  })
}

const questionSectionFor = (passageNumber, title) => {
  const [start, end] = PASSAGE_RANGES[passageNumber]
  const advancedQuestion =
    passageNumber === 3
      ? `\n${end}. The advanced passage says the evidence supported _____ at once.`
      : ''
  return `Questions ${start}-${end}
Complete the notes below.
Choose NO MORE THAN TWO WORDS from the passage for each answer.

${start}. According to the passage, ${title} began as a _____.
${start + 1}. Researchers first gathered information through _____.
${start + 2}. All observations were kept in a _____.
${start + 3}. The first major difficulty was _____.

Questions ${start + 4}-${start + 6}
Do the following statements agree with the information given in the passage?
Write TRUE, FALSE or NOT GIVEN.

${start + 4}. The number of participants increased strongly in the second year.
${start + 5}. The organisers used software to replace teachers.
${start + 6}. The project received a national prize for its educational work.

Questions ${start + 7}-${end}
Answer the questions below.
Choose NO MORE THAN TWO WORDS from the passage for each answer.

${start + 7}. Who checked the information before publication?
${start + 8}. What equipment was used when measurements were necessary?
${start + 9}. What was described as the most visible result?
${start + 10}. The improvement might disappear without attention to the _____.
${start + 11}. In the final stage, residents took part in _____.
${start + 12}. The team produced shorter guides, clearer diagrams and a _____.${advancedQuestion}`
}

const buildRecord = ({ book, testNumber, passageNumber, title }) => {
  const [start, end] = PASSAGE_RANGES[passageNumber]
  const evidence = evidenceFor(title, passageNumber)
  const category = passageNumber === 3 ? 'advanced' : 'normal'
  const rawPassageText = `READING PASSAGE ${passageNumber}
${title}

${evidence.paragraphs.join('\n\n')}

${questionSectionFor(passageNumber, title)}`
  const rawAnswerKey = answerBlocksFor({ book, testNumber, passageNumber, title }).join('\n\n')

  return {
    id: `builtin-reading-ielts-practice-${book}-test-${testNumber}-passage-${passageNumber}-${makeSlug(title)}`,
    title: `IELTS Practice ${book} Test ${testNumber} Passage ${passageNumber} - ${title}`,
    category,
    rawPassageText,
    rawAnswerKey
  }
}

export const ORIGINAL_IELTS_READING_7_TO_9_EXAMS = TOPIC_SETS.flatMap(({ book, tests }) =>
  tests.flatMap((titles, testIndex) =>
    titles.map((title, passageIndex) =>
      buildRecord({
        book,
        testNumber: testIndex + 1,
        passageNumber: passageIndex + 1,
        title
      })
    )
  )
)
