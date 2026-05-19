/**
 * Generates April 2026 Passage 3 import JSON files (3D, 3E, 3F).
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.resolve(__dirname, '../cambridge-reading-imports')

const q = (n, prompt, answer, group, exact, thai, para) =>
  `Question ${n}: ${prompt}\n\nCorrect Answer: ${answer}\n\nAccepted Answers: ${answer}\n\nAnswer Group: ${group}\n\nExact Portion: ${exact}\n\nShort Thai Explanation: ${thai}\n\nParaphrased Vocabulary: ${para}`

const EXAMS = [
  {
    file: 'ielts-academic-reading-april-2026-passage-3-uncertain-science-of-prediction.json',
    title: 'IELTS Academic Reading April 2026 Passage 3 - The Uncertain Science of Prediction',
    group: 'IELTS Academic Reading April 2026 Passage 3 - The Uncertain Science of Prediction',
    collectionTitle: 'IELTS Academic Reading April 2026',
    passage: `READING PASSAGE 3
You should spend about 20 minutes on Questions 27-40, which are based on Reading Passage 3 below.

The Uncertain Science of Prediction

A family planning a weekend picnic checks the weather forecast three times before leaving home. The first forecast says there is a slight chance of rain; the second suggests showers in the afternoon; the third shows a grey cloud beside the name of the town. By lunchtime, the sky is still clear, and someone declares that the forecast was "wrong". Yet this reaction reveals less about the weather than about our expectations. Many people treat predictions as promises, when they are often better understood as carefully informed estimates.

Prediction has become a normal part of everyday life. We look at traffic apps before travelling, exam-grade estimates before choosing courses, financial forecasts before making purchases, and medical risk scores before changing habits. The more predictions surround us, the more tempting it is to forget that they do not remove uncertainty. A forecast is not a future event arriving early. It is a tool for deciding what to do before the future is known.

Dr Ilya Kavan, who studies risk communication at Westmere University, describes prediction as "structured uncertainty". By this he means that a prediction does not eliminate the unknown; it arranges available evidence into a form that people can use. The phrase also helps explain why predictions can be both useful and uncomfortable. They give guidance, but they rarely give the emotional satisfaction of certainty. A person told that there is a 30 per cent chance of rain may still want a yes-or-no answer: will it rain or not?

A study at the Hale Institute explored how people respond to different forms of uncertainty. One hundred and twenty volunteers were asked to act as planners for a riverside town preparing for possible flooding. One group received a single prediction: "moderate flood risk". A second group received a range of possible water levels. A third group received the same range, along with a short explanation of why the levels were uncertain. The first group made the fastest decisions, but often placed all resources in one part of the town. The third group took longer, but distributed resources more flexibly and changed their plans more effectively when new information was introduced. The researchers did not conclude that more information is always better. Their point was narrower: when uncertainty is explained clearly, people may make decisions that are less tidy but more resilient.

Schools have begun to experiment with this idea. In some science classes, students are asked to keep "forecast journals" during experiments. Before observing the result, they write what they expect to happen, how confident they are, and what evidence supports their expectation. After the result appears, they compare it with the prediction. The purpose is not to reward the student who guessed correctly. Instead, students learn to examine the distance between expectation and outcome. A wrong forecast can be informative if it reveals which assumption was weak.

Businesses face a similar challenge with algorithmic prediction. Sales models, recruitment tools and stock-control systems can process more data than an individual manager. But when their outputs are treated as commands, employees may stop asking whether the model is suitable for the situation in front of them. In one retail company studied by Kavan's team, staff were initially told simply to follow an automatic ordering system. When seasonal demand changed unexpectedly, the system continued to recommend unsuitable stock levels. Later, the company trained staff to read the model's confidence scores and challenge its suggestions when local evidence pointed elsewhere. Errors did not disappear, but they were noticed earlier.

The most useful predictions, then, are not necessarily the most confident-looking ones. A prediction that admits uncertainty may seem less impressive than a firm answer, but it can leave people better prepared. The danger is not that predictions fail to tell us the future perfectly. The danger is that we forget what predictions are for: not to replace judgement, but to support it when certainty is unavailable.

Questions 27-31
Choose the correct letter, A, B, C or D.
Write the correct letter in boxes 27-31 on your answer sheet.

27 The writer describes the family checking the weather forecast in order to show that
A weather forecasts are less reliable than they used to be.
B people often expect predictions to provide certainty.
C outdoor activities are difficult to plan successfully.
D families tend to ignore scientific information.

28 What point does the writer make in the second paragraph?
A Predictions are useful because they remove uncertainty from daily life.
B Modern people rely less on prediction than earlier generations did.
C Predictions help people act before the future is known.
D Most predictions are created for financial or medical purposes.

29 What does Dr Ilya Kavan's phrase "structured uncertainty" suggest?
A A prediction organises evidence without completely removing the unknown.
B A prediction is reliable only when it is expressed in numbers.
C Uncertainty is mainly caused by poor communication.
D People should avoid making decisions when evidence is incomplete.

30 What did the Hale Institute study suggest?
A Fast decisions were usually the most successful ones.
B A single risk label helped people adapt to new information.
C Clearly explained uncertainty could lead to more flexible planning.
D Volunteers became confused whenever they received extra information.

31 What is the main point made about algorithmic prediction in businesses?
A Prediction systems should replace human judgement wherever possible.
B Employees should use model outputs critically rather than follow them blindly.
C Retail companies should avoid using automatic ordering systems.
D Local evidence is always more accurate than computer-generated data.

Questions 32-36
Complete the summary using the list of words and phrases, A-I, below.
Write the correct letter, A-I, in boxes 32-36 on your answer sheet.

Forecast journals in schools

In some science lessons, students write down what they expect to happen before they see the 32 ____________. They also record their level of 33 ____________ and the evidence behind their prediction. After the experiment, students compare their forecast with the actual result. The aim is not simply to reward a 34 ____________ prediction. A prediction that turns out to be 35 ____________ may still help students identify a weak 36 ____________.

A result
B confidence
C correct
D wrong
E assumption
F command
G explanation
H resource
I algorithm

Questions 37-40
Do the following statements agree with the information given in Reading Passage 3?
In boxes 37-40 on your answer sheet, write

TRUE if the statement agrees with the information
FALSE if the statement contradicts the information
NOT GIVEN if there is no information on this

37 The writer says predictions should be judged only by whether they become perfectly accurate.
38 In the Hale Institute study, the third group changed its plans more effectively when new information was introduced.
39 The volunteers in the Hale Institute study had previous experience of flood planning.
40 In the retail company studied by Kavan's team, staff were later trained to question the model's suggestions in some situations.`,
    answers: [
      [27, 'The writer describes the family checking the weather forecast in order to show that', 'B', 'Many people treat predictions as promises, when they are often better understood as carefully informed estimates.', 'คำตอบคือ B เพราะ picnic scene แสดงว่าคนประกาศ forecast was wrong เพราะท้องฟ้ายังแจ่ม ซึ้งสะท้อน Many people treat predictions as promises แทนที่จะเข้าใจเป็น informed estimates ตรง expect predictions to provide certainty ตัวเลือก A ผิดเพราะไม่ได้บอกว่า forecasts แย่ลงกว่าเดิม ตัวเลือก C ผิดเพราะไม่ได้สรุปว่าวางแผนกิจกรรมกลางแจ้งยาก ตัวเลือก D ผิดเพราะครอบครัวเช็คพยากรณ์ซ้ำ ไม่ได้ ignore science', 'expect certainty = treat predictions as promises; informed estimates = carefully informed estimates; answer signal = B'],
      [28, 'What point does the writer make in the second paragraph?', 'C', 'A forecast is not a future event arriving early. It is a tool for deciding what to do before the future is known.', 'คำตอบคือ C เพราะย่อหน้าสองบอก predictions do not remove uncertainty และ forecast เป็น tool for deciding what to do before the future is known ตรง act before the future is known ตัวเลือก A ผิดเพราะ passage บอก they do not remove uncertainty ตัวเลือก B ผิดเพราะ prediction กลายเป็น normal part of life ไม่ได้ rely less ตัวเลือก D ผิดเพราะยกหลายตัวอย่าง ไม่ได้จำกัดแค่ financial/medical', 'act before future known = tool for deciding what to do before the future is known; answer signal = C'],
      [29, 'What does Dr Ilya Kavan\'s phrase "structured uncertainty" suggest?', 'A', 'a prediction does not eliminate the unknown; it arranges available evidence into a form that people can use.', 'คำตอบคือ A เพราะ Kavan อธิบาย structured uncertainty ว่า prediction does not eliminate the unknown แต่ arranges evidence into usable form ตรง organises evidence without completely removing the unknown ตัวเลือก B ผิดเพราะไม่ได้บอกต้องเป็นตัวเลข ตัวเลือก C ผิดเพราะไม่ได้โทษ poor communication ตัวเลือก D ผิดเพราะไม่ได้บอกให้หลีกเลี่ยงการตัดสินใจ', 'structured uncertainty = arranges evidence without eliminating unknown; answer signal = A'],
      [30, 'What did the Hale Institute study suggest?', 'C', 'when uncertainty is explained clearly, people may make decisions that are less tidy but more resilient. The third group... distributed resources more flexibly and changed their plans more effectively when new information was introduced.', 'คำตอบคือ C เพราะ third group ที่ได้ explanation ของ uncertainty วางแผนยืดหยุ่นกว่าและเปลี่ยนแผนได้ดีเมื่อมีข้อมูลใหม่ ตรง clearly explained uncertainty → flexible planning ตัวเลือก A ผิดเพราะ first group ตัดสินใจเร็วแต่ไม่ resilient ตัวเลือก B ผิดเพราะ single prediction group ไม่ adapt ดี ตัวเลือก D ผิดเพราะ researchers ไม่ได้สรุปว่า extra information always confuses', 'explained uncertainty = short explanation of why the levels were uncertain; flexible planning = distributed resources more flexibly; answer signal = C'],
      [31, 'What is the main point made about algorithmic prediction in businesses?', 'B', 'Later, the company trained staff to read the model\'s confidence scores and challenge its suggestions when local evidence pointed elsewhere.', 'คำตอบคือ B เพราะ passage บอกเมื่อ outputs treated as commands จะเลิกถามว่า model เหมาะกับสถานการณ์หรือไม่ และภายหลัง train staff to challenge suggestions ตรง use outputs critically ตัวเลือก A ผิดเพราะ writer บอก not to replace judgement ตัวเลือก C ผิดเพราะไม่ได้บอกให้เลี่ยง automatic systems ตัวเลือก D ผิดเพราะไม่ได้บอก local evidence always more accurate', 'use critically = challenge its suggestions when local evidence pointed elsewhere; answer signal = B'],
      [32, 'before they see the .................... .', 'A', 'Before observing the result, they write what they expect to happen', 'คำตอบคือ A (result) เพราะ Before observing the result ตรง before they see the ___ ไม่ใช่ I algorithm', 'see the ___ = observing the result; word bank = A result'],
      [33, 'record their level of .................... .', 'B', 'they write what they expect to happen, how confident they are', 'คำตอบคือ B (confidence) เพราะ how confident they are ตรง level of ___ ไม่ใช่ C correct', 'level of ___ = how confident they are; word bank = B confidence'],
      [34, 'reward a .................... prediction.', 'C', 'The purpose is not to reward the student who guessed correctly.', 'คำตอบคือ C (correct) เพราะ not to reward the student who guessed correctly ตรง reward a ___ prediction', 'reward ___ prediction = reward the student who guessed correctly; word bank = C correct'],
      [35, 'A prediction that turns out to be .................... .', 'D', 'A wrong forecast can be informative if it reveals which assumption was weak.', 'คำตอบคือ D (wrong) เพราะ A wrong forecast can be informative ตรง turns out to be ___ ไม่ใช่ E assumption ในช่องนี้', 'turns out to be ___ = wrong forecast; word bank = D wrong'],
      [36, 'identify a weak .................... .', 'E', 'A wrong forecast can be informative if it reveals which assumption was weak.', 'คำตอบคือ E (assumption) เพราะ reveals which assumption was weak ตรง weak ___', 'weak ___ = assumption was weak; word bank = E assumption'],
      [37, 'The writer says predictions should be judged only by whether they become perfectly accurate.', 'FALSE', 'The danger is not that predictions fail to tell us the future perfectly. The danger is that we forget what predictions are for: not to replace judgement, but to support it when certainty is unavailable.', 'คำตอบคือ FALSE เพราะ writer บอก danger is not that predictions fail perfectly และ predictions support judgement ไม่ใช่ judge only by perfect accuracy ขัดกับ judged only by perfectly accurate', 'judged only by accuracy = fail to tell us the future perfectly (rejected as sole criterion)'],
      [38, 'In the Hale Institute study, the third group changed its plans more effectively when new information was introduced.', 'TRUE', 'The third group took longer, but distributed resources more flexibly and changed their plans more effectively when new information was introduced.', 'คำตอบคือ TRUE เพราะ third group changed their plans more effectively when new information was introduced ตรงข้อความโจทย์', 'third group = same range with explanation; changed plans more effectively = changed their plans more effectively'],
      [39, 'The volunteers in the Hale Institute study had previous experience of flood planning.', 'NOT GIVEN', 'One hundred and twenty volunteers were asked to act as planners for a riverside town preparing for possible flooding.', 'คำตอบคือ NOT GIVEN เพราะ passage บอก volunteers acted as planners แต่ไม่กล่าว previous experience of flood planning คำว่า volunteers/planners ปรากฏแต่ไม่ตอบ experience', 'previous experience = not mentioned; NOT GIVEN = asked to act as planners only'],
      [40, 'In the retail company studied by Kavan\'s team, staff were later trained to question the model\'s suggestions in some situations.', 'TRUE', 'Later, the company trained staff to read the model\'s confidence scores and challenge its suggestions when local evidence pointed elsewhere.', 'คำตอบคือ TRUE เพราะ trained staff to challenge its suggestions when local evidence pointed elsewhere ตรง question the model\'s suggestions in some situations', 'question suggestions = challenge its suggestions; some situations = when local evidence pointed elsewhere']
    ]
  },
  {
    file: 'ielts-academic-reading-april-2026-passage-3-case-for-urban-darkness.json',
    title: 'IELTS Academic Reading April 2026 Passage 3 - The Case for Urban Darkness',
    group: 'IELTS Academic Reading April 2026 Passage 3 - The Case for Urban Darkness',
    collectionTitle: 'IELTS Academic Reading April 2026',
    passage: `READING PASSAGE 3
You should spend about 20 minutes on Questions 27-40, which are based on Reading Passage 3 below.

The Case for Urban Darkness

When the seaside town of Bellhaven reduced the brightness of the lamps along its beach road, complaints arrived within days. Some residents said the town looked unfinished; others worried that the change would make evening walks less pleasant. But a few weeks later, the same road had become a place where people stopped rather than hurried. The sea was visible again beyond the railings, the moon made a silver path across the water, and children began pointing out stars that had previously been hidden by the orange glow. The town had not removed light. It had rediscovered darkness.

For more than a century, artificial light has been associated with safety, progress and modern public life. Streets, stations, hospitals and schools depend on it. A city without reliable lighting would be dangerous and exclusionary. Yet the assumption that more light always means better design is increasingly being questioned. Excessive illumination can flatten shadows, create glare, waste energy and erase the visual difference between day and night. The problem is not light itself, but light used without discrimination.

Lighting designer Liora Chen calls her approach "responsible darkness". This does not mean switching lamps off and hoping for the best. It means asking where light is needed, how strong it should be, what direction it should travel in, and when it should fade. A well-designed night-time street may contain darker areas, but these are not neglected spaces. They are part of a planned pattern in which light supports movement without occupying every surface.

A study led by Maribel Ives at Northport University examined this idea in an industrial harbour. For years, the harbour had been lit by tall floodlights that spread brightness over storage yards, water and nearby housing. Workers often complained that the lights were dazzling, especially when rain reflected them from the ground. Ives's team replaced several floodlights with lower, shielded lamps directed only at the paths and loading areas where visibility was necessary. Energy use fell, and workers reported that edges, steps and moving equipment were easier to see. The number of recorded incidents did not increase during the trial. The researchers concluded that better lighting did not always mean brighter lighting.

Wildlife specialists make a related argument. Many animals use darkness as a form of information. Young sea turtles move towards the brightest horizon, which under natural conditions is often the moonlit sea. Migrating birds can become disoriented by bright urban glow, and insects may gather around lamps until they are exhausted. Responsible darkness therefore includes ecological design: shielded lights, dimmer wavelengths, and dark corridors through which animals can move. This is not a demand for total blackout. It is an attempt to make human lighting less careless.

Some urban planners have also noticed social benefits. In neighbourhoods where every public space is intensely lit, people may feel watched or hurried, as if the street were only a route between indoor destinations. Softer and more selective lighting can encourage slower forms of attention. Residents in one pilot project described noticing trees, balconies and night sounds that they had previously ignored. Darkness did not make the place empty; it made different features available.

Critics are right to warn that darkness can be badly designed. Poor lighting can make pavements difficult to use, especially for older people or those with impaired vision. It can also make public spaces feel unwelcoming if changes are introduced without consultation. For this reason, advocates of responsible darkness do not argue for less light everywhere. They argue for better questions: who needs light here, at what time, and for what purpose?

The future city should not be imagined as either brightly lit or dark. That opposition is too crude. A humane night-time environment requires both visibility and shadow, guidance and rest. The real task is to stop treating darkness as a failure of design and to begin treating it as one of design's materials.

Questions 27-30
Choose the correct letter, A, B, C or D.
Write the correct letter in boxes 27-30 on your answer sheet.

27 The writer describes the changes in Bellhaven in order to show that
A residents usually oppose environmental improvements.
B seaside towns need less public lighting than inland towns.
C carefully reduced lighting can reveal qualities of a place.
D darkness is more important for children than for adults.

28 What point does the writer make in the second paragraph?
A Artificial light has no real connection with public safety.
B More lighting is not always the same as better lighting.
C Modern cities should return to older forms of street lighting.
D Excessive illumination mainly affects people living near the sea.

29 What does Liora Chen mean by "responsible darkness"?
A removing street lighting from most public areas
B using darkness as part of a planned lighting design
C replacing artificial lighting with moonlight wherever possible
D encouraging people to avoid walking in cities at night

30 What did Maribel Ives's harbour study find?
A Workers found the new lighting less effective in wet weather.
B Shielded, lower lamps improved visibility in necessary areas.
C The number of recorded incidents increased during the trial.
D Energy use rose after the floodlights were replaced.

Questions 31-35
Complete the summary using the list of phrases, A-I, below.
Write the correct letter, A-I, in boxes 31-35 on your answer sheet.

Darkness and wildlife

Wildlife specialists argue that darkness can act as a form of 31 ____________ for many animals. Young sea turtles may move towards the brightest 32 ____________, while migrating birds can be affected by bright urban 33 ____________. Responsible darkness can involve 34 ____________, dimmer wavelengths, and routes through which animals can travel. This approach does not require a complete 35 ____________.

A information
B horizon
C glow
D shielded lights
E blackout
F public consultation
G moonlight
H storage yards
I social benefits

Questions 36-40
Do the following statements agree with the claims of the writer in Reading Passage 3?
In boxes 36-40 on your answer sheet, write

YES if the statement agrees with the claims of the writer
NO if the statement contradicts the claims of the writer
NOT GIVEN if it is impossible to say what the writer thinks about this

36 The writer believes that cities should remove all artificial lighting from public places.
37 The writer argues that some darkness can be deliberately designed rather than simply neglected.
38 The writer claims that bright urban glow can affect the movement of migrating birds.
39 Most residents in Bellhaven eventually preferred the new lighting to the old lighting.
40 The writer believes that darkness should be treated as one possible material of urban design.`,
    answers: [
      [27, 'The writer describes the changes in Bellhaven in order to show that', 'C', 'The sea was visible again beyond the railings, the moon made a silver path across the water, and children began pointing out stars that had previously been hidden by the orange glow. The town had not removed light. It had rediscovered darkness.', 'คำตอบคือ C เพราะลดความสว่างทำให้เห็นทะเล ดวงจันทร์ และดาวที่เคยถูก orange glow บัง ตรง carefully reduced lighting can reveal qualities of a place ตัวเลือก A ผิดเพราะมี complaints แต่ผลลัพธ์เป็นบวก ไม่ได้สรุปว่า oppose improvements เสมอ ตัวเลือก B ผิดเพราะไม่ได้เปรียบ seaside กับ inland ตัวเลือก D ผิดเพราะ children เป็นตัวอย่างหนึ่ง ไม่ได้บอก darkness สำคัญกว่าสำหรับเด็ก', 'reveal qualities = sea visible / stars previously hidden; reduced lighting = reduced the brightness; answer signal = C'],
      [28, 'What point does the writer make in the second paragraph?', 'B', 'Yet the assumption that more light always means better design is increasingly being questioned. Excessive illumination can flatten shadows, create glare, waste energy', 'คำตอบคือ B เพราะย่อหน้าสองบอก more light always means better design ถูกตั้งคำถาม และ excessive illumination มีปัญหา ตรง more lighting is not always better ตัวเลือก A ผิดเพราะ passage บอก lighting จำเป็นต่อ safety ตัวเลือก C ผิดเพราะไม่ได้บอกให้กลับไปใช้แสงเก่า ตัวเลือก D ผิดเพราะไม่ได้จำกัดผลกระทบแค่ชายทะเล', 'more lighting not always better = more light always means better design is questioned; answer signal = B'],
      [29, 'What does Liora Chen mean by "responsible darkness"?', 'B', 'A well-designed night-time street may contain darker areas, but these are not neglected spaces. They are part of a planned pattern in which light supports movement without occupying every surface.', 'คำตอบคือ B เพราะ responsible darkness คือถาม where light is needed และ darker areas เป็นส่วนของ planned pattern ไม่ใช่ปิดไฟทั้งหมด ตัวเลือก A ผิดเพราะ This does not mean switching lamps off and hoping for the best ตัวเลือก C ผิดเพราะไม่ได้แทนด้วย moonlight ตัวเลือก D ผิดเพราะไม่ได้ห้ามเดินเมืองตอนกลางคืน', 'planned lighting design = part of a planned pattern; responsible darkness = asking where light is needed; answer signal = B'],
      [30, 'What did Maribel Ives\'s harbour study find?', 'B', 'Ives\'s team replaced several floodlights with lower, shielded lamps directed only at the paths and loading areas where visibility was necessary. Energy use fell, and workers reported that edges, steps and moving equipment were easier to see. The number of recorded incidents did not increase during the trial.', 'คำตอบคือ B เพราะ shielded lower lamps ทำให้เห็น edges/steps/equipment ชัดขึ้นใน areas ที่จำเป็น และ incidents ไม่เพิ่ม ตัวเลือก A ผิดเพราะ rain reflected old lights ไม่ได้บอก new lighting less effective ตัวเลือก C ผิดเพราะ incidents did not increase ตัวเลือก D ผิดเพราะ Energy use fell', 'shielded lower lamps = lower, shielded lamps directed only at paths; improved visibility = easier to see; answer signal = B'],
      [31, 'darkness can act as a form of .................... for many animals.', 'A', 'Many animals use darkness as a form of information.', 'คำตอบคือ A (information) เพราะ darkness as a form of information ตรง blank 31 ไม่ใช่ I social benefits', 'form of ___ = form of information; word bank = A information'],
      [32, 'move towards the brightest .................... .', 'B', 'Young sea turtles move towards the brightest horizon, which under natural conditions is often the moonlit sea.', 'คำตอบคือ B (horizon) เพราะ brightest horizon ใน passage ไม่ใช่ G moonlight', 'brightest ___ = brightest horizon; word bank = B horizon'],
      [33, 'affected by bright urban .................... .', 'C', 'Migrating birds can become disoriented by bright urban glow', 'คำตอบคือ C (glow) เพราะ bright urban glow ตรง blank 33', 'urban ___ = urban glow; word bank = C glow'],
      [34, 'Responsible darkness can involve .................... .', 'D', 'Responsible darkness therefore includes ecological design: shielded lights, dimmer wavelengths, and dark corridors', 'คำตอบคือ D (shielded lights) เพราะ shielded lights อยู่ในรายการ ecological design ไม่ใช่ H storage yards', 'involve ___ = shielded lights; word bank = D shielded lights'],
      [35, 'This approach does not require a complete .................... .', 'E', 'This is not a demand for total blackout.', 'คำตอบคือ E (blackout) เพราะ not a demand for total blackout ตรง does not require a complete ___', 'complete ___ = total blackout; word bank = E blackout'],
      [36, 'The writer believes that cities should remove all artificial lighting from public places.', 'NO', 'advocates of responsible darkness do not argue for less light everywhere. They argue for better questions: who needs light here, at what time, and for what purpose?', 'คำตอบคือ NO เพราะ advocates do not argue for less light everywhere และ city without reliable lighting would be dangerous ขัดกับ remove all artificial lighting', 'remove all lighting = less light everywhere (rejected)'],
      [37, 'The writer argues that some darkness can be deliberately designed rather than simply neglected.', 'YES', 'darker areas, but these are not neglected spaces. They are part of a planned pattern', 'คำตอบคือ YES เพราะ darker areas are not neglected spaces แต่ part of a planned pattern ตรง deliberately designed rather than neglected', 'deliberately designed = part of a planned pattern; not neglected = not neglected spaces'],
      [38, 'The writer claims that bright urban glow can affect the movement of migrating birds.', 'YES', 'Migrating birds can become disoriented by bright urban glow', 'คำตอบคือ YES เพราะ Migrating birds can become disoriented by bright urban glow ตรง affect the movement', 'affect movement = become disoriented; bright urban glow = bright urban glow'],
      [39, 'Most residents in Bellhaven eventually preferred the new lighting to the old lighting.', 'NOT GIVEN', 'Some residents said the town looked unfinished; others worried that the change would make evening walks less pleasant. But a few weeks later, the same road had become a place where people stopped rather than hurried.', 'คำตอบคือ NOT GIVEN เพราะมี complaints ตอนแรกและผลเชิงบวกหลังสองสามสัปดาห์ แต่ไม่ได้บอก most residents eventually preferred new to old คำว่า residents ปรากฏแต่ไม่ตอบ majority preference', 'most residents preferred = not stated; NOT GIVEN = complaints then positive change but no comparison vote'],
      [40, 'The writer believes that darkness should be treated as one possible material of urban design.', 'YES', 'stop treating darkness as a failure of design and to begin treating it as one of design\'s materials.', 'คำตอบคือ YES เพราะ treating darkness as one of design\'s materials ตรงข้อความโจทย์', 'material of urban design = one of design\'s materials']
    ]
  },
  {
    file: 'ielts-academic-reading-april-2026-passage-3-what-is-restoration.json',
    title: 'IELTS Academic Reading April 2026 Passage 3 - What Is Restoration?',
    group: 'IELTS Academic Reading April 2026 Passage 3 - What Is Restoration?',
    collectionTitle: 'IELTS Academic Reading April 2026',
    passage: `READING PASSAGE 3
You should spend about 20 minutes on Questions 27-40, which are based on Reading Passage 3 below.

What Is Restoration?

In an old railway station, workers remove a modern advertising board and find a line of painted letters underneath. The letters are cracked and incomplete, but they show the name of the town as it appeared a century ago. The project manager now faces a choice. Should the letters be repainted until they look new, left exactly as they are, or covered again to protect them? Each option could be called restoration. Each would also tell a different story about the past.

Many people think of restoration as the act of returning something to its original condition. This sounds simple until one asks what "original" means. A building may have been altered several times. A painting may have darkened because of age. A wetland may have changed because the river feeding it has shifted course. To restore such things is not to travel back in time. It is to decide which features matter, which changes should remain visible, and which losses can realistically be repaired.

In environmental projects, this question is especially difficult. Some damaged landscapes cannot be returned to an earlier state because the climate, surrounding land use or species population has changed. A restored marsh may not contain exactly the same plants that grew there two hundred years ago. Yet it may still hold water, support birds, filter pollution and reduce flooding. For this reason, some ecologists define restoration less as the recovery of a past appearance than as the recovery of living functions.

Different specialists understand restoration in different ways. Helena Morel, an art conservator, argues that restoration should never erase the evidence of change. A repaired object, she says, should show enough of its history for viewers to understand that it has survived damage. Tomas Reed, a river engineer, is less concerned with appearances. For him, a restored river is one that can flood safely, carry sediment and support life, even if its new channel does not match an old map. Sacha Ndlovu, a community historian, believes restoration must involve returning authority to people connected with the damaged place, particularly when outsiders were responsible for the damage. Mei Lin Park, an ecologist, warns against restoring landscapes for a climate that no longer exists. A project, she argues, must be designed for future conditions as well as historical memory. Oskar Feld, an architect, values traditional materials and methods, but says that restored buildings must also meet present-day safety needs.

These definitions differ, but they share one assumption: restoration is not merely technical. It involves evidence, judgement and values. The restorer must ask not only "Can this be repaired?" but also "What should the repair make visible?" A perfectly smooth result may please the eye while concealing the very damage that made restoration necessary. On the other hand, refusing all intervention can allow an object or place to decay until nothing meaningful remains.

Tourism can make the problem sharper. Visitors often prefer restored sites to look complete, and incomplete ruins may be judged disappointing. This creates pressure to rebuild missing parts, brighten faded colours or simplify complicated histories. Some reconstructions are useful, especially when they help people imagine how a site worked. But reconstructions can also become misleading if they present guesswork as certainty. A restored place should not pretend to know more than the evidence allows.

I should declare my own bias. As a writer, I am drawn to what I call honest repair. A restored place or object should not pretend that damage never occurred. It should allow viewers to see both injury and care. The hardest question is not how to reach perfection, but how restoration should shape public memory. Restoration is valuable not because it makes the past look untouched, but because it helps us decide what kind of relationship we want with what remains.

Questions 27-32
Choose the correct letter, A, B, C or D.
Write the correct letter in boxes 27-32 on your answer sheet.

27 The writer describes the painted letters in the railway station in order to show that
A old railway stations are usually restored incorrectly.
B restoration can involve several possible choices.
C advertising boards often damage historical buildings.
D repainting is the best way to preserve written signs.

28 What point does the writer make about the word "original"?
A It is easier to define for buildings than for paintings.
B It usually refers to the most attractive stage of an object's history.
C It can be difficult to apply to things that have changed over time.
D It should be avoided by people involved in restoration projects.

29 In the third paragraph, the writer suggests that environmental restoration may involve
A recreating a landscape exactly as it looked two hundred years ago.
B removing all species that were not present in the past.
C recovering useful natural functions rather than a precise earlier appearance.
D preventing rivers from changing their course in the future.

30 What is the main purpose of the fourth paragraph?
A to compare several specialists' views of restoration
B to show that art conservation is more difficult than engineering
C to argue that architects should lead most restoration projects
D to explain why restoration is becoming less popular

31 What warning does the writer give about reconstructions?
A They are never useful for visitors.
B They may be misleading if uncertain details are shown as facts.
C They should always be brighter than the original site.
D They are necessary only when tourism is unimportant.

32 In the final paragraph, the writer says he is interested in restoration that
A makes damaged objects look completely new.
B hides signs of injury from public view.
C shows both harm and the effort to repair it.
D values perfection more than historical memory.

Questions 33-37
Look at the following statements (Questions 33-37) and the list of specialists below.
Match each statement with the correct specialist, A-E.
Write the correct letter, A-E, in boxes 33-37 on your answer sheet.
NB You may use any letter more than once.

33 This specialist believes restoration should preserve evidence that an object has changed.
34 This specialist defines restoration mainly through natural processes rather than appearance.
35 This specialist argues that local or connected people should regain control over restoration decisions.
36 This specialist says restoration must take future environmental conditions into account.
37 This specialist values older techniques but also recognises modern safety requirements.

List of Specialists
A Helena Morel
B Tomas Reed
C Sacha Ndlovu
D Mei Lin Park
E Oskar Feld

Questions 38-40
Complete the summary below.
Choose NO MORE THAN TWO WORDS from the passage for each answer.
Write your answers in boxes 38-40 on your answer sheet.

The writer's own bias

The writer says that he is attracted to what he calls 38 ____________. In his view, a restored object or place should allow people to see both 39 ____________ and care. He believes the most difficult issue is how restoration should influence 40 ____________.`,
    answers: [
      [27, 'The writer describes the painted letters in the railway station in order to show that', 'B', 'Should the letters be repainted until they look new, left exactly as they are, or covered again to protect them? Each option could be called restoration. Each would also tell a different story about the past.', 'คำตอบคือ B เพราะ project manager มีหลายทางเลือก repaint / leave / cover และ Each option could be called restoration ตรง several possible choices ตัวเลือก A ผิดเพราะไม่ได้บอก restore ผิดเสมอ ตัวเลือก C ผิดเพราะ advertising board เป็นแค่บริบท ไม่ได้เน้นว่าทำลายอาคาร ตัวเลือก D ผิดเพราะ repainting เป็นหนึ่งทางเลือก ไม่ใช่ best way', 'several choices = repainted / left / covered; each could be restoration; answer signal = B'],
      [28, 'What point does the writer make about the word "original"?', 'C', 'A building may have been altered several times. A painting may have darkened because of age. A wetland may have changed because the river feeding it has shifted course.', 'คำตอบคือ C เพราะ original ยากเมื่อ building altered, painting darkened, wetland changed ตรง difficult to apply to things that have changed over time ตัวเลือก A ผิดเพราะให้ตัวอย่างทั้ง building painting wetland ตัวเลือก B ผิดเพราะไม่ได้พูด most attractive stage ตัวเลือก D ผิดเพราะไม่ได้บอกให้หลีกเลี่ยงคำ original', 'original difficult = altered several times / darkened / shifted course; answer signal = C'],
      [29, 'In the third paragraph, the writer suggests that environmental restoration may involve', 'C', 'some ecologists define restoration less as the recovery of a past appearance than as the recovery of living functions.', 'คำตอบคือ C เพราะ ecologists นิยาม restoration เป็น recovery of living functions มากกว่า past appearance ตรง recovering useful natural functions ตัวเลือก A ผิดเพราะ may not contain exactly the same plants ตัวเลือก B ผิดเพราะไม่ได้บอก remove all species ตัวเลือก D ผิดเพราะ river shifted course เป็นตัวอย่าง ไม่ใช่ prevent change', 'natural functions = recovery of living functions; not precise appearance = less as recovery of a past appearance; answer signal = C'],
      [30, 'What is the main purpose of the fourth paragraph?', 'A', 'Different specialists understand restoration in different ways. Helena Morel... Tomas Reed... Sacha Ndlovu... Mei Lin Park... Oskar Feld', 'คำตอบคือ A เพราะย่อหน้าสี่ให้ views ของ specialists หลายคน เพื่อ compare several specialists\' views ตัวเลือก B ผิดเพราะไม่ได้เปรียบ art ยากกว่า engineering ตัวเลือก C ผิดเพราะ Feld เป็นหนึ่งในนั้น ไม่ได้ lead ทั้งหมด ตัวเลือก D ผิดเพราะไม่ได้บอก restoration less popular', 'compare specialists = Different specialists understand restoration in different ways; answer signal = A'],
      [31, 'What warning does the writer give about reconstructions?', 'B', 'reconstructions can also become misleading if they present guesswork as certainty.', 'คำตอบคือ B เพราะ misleading if present guesswork as certainty ตรง uncertain details shown as facts ตัวเลือก A ผิดเพราะ Some reconstructions are useful ตัวเลือก C ผิดเพราะ brighten colours เป็น pressure ไม่ใช่ must always ตัวเลือก D ผิดเพราะ tourism ทำปัญหา sharper ไม่ใช่ reconstructions only when tourism unimportant', 'guesswork as certainty = uncertain details shown as facts; answer signal = B'],
      [32, 'In the final paragraph, the writer says he is interested in restoration that', 'C', 'A restored place or object should not pretend that damage never occurred. It should allow viewers to see both injury and care.', 'คำตอบคือ C เพราะ honest repair ต้อง see both injury and care ตรง shows both harm and effort to repair ตัวเลือก A ผิดเพราะ not pretend damage never occurred ตัวเลือก B ผิดเพราะไม่ซ่อน injury ตัวเลือก D ผิดเพราะ hardest question is not perfection แต่ public memory', 'harm and repair = injury and care; honest repair = what I call honest repair; answer signal = C'],
      [33, 'This specialist believes restoration should preserve evidence that an object has changed.', 'A', 'Helena Morel, an art conservator, argues that restoration should never erase the evidence of change.', 'คำตอบคือ A เพราะ Helena Morel ว่า never erase the evidence of change ไม่ใช่ Reed (functions) หรือ Ndlovu (authority)', 'preserve evidence of change = never erase the evidence of change; specialist = Helena Morel; answer signal = A'],
      [34, 'This specialist defines restoration mainly through natural processes rather than appearance.', 'B', 'Tomas Reed, a river engineer, is less concerned with appearances. For him, a restored river is one that can flood safely, carry sediment and support life', 'คำตอบคือ B เพราะ Tomas Reed เน้น flood safely, carry sediment, support life มากกว่า appearance ไม่ใช่ Morel (evidence of change)', 'natural processes = flood safely / carry sediment / support life; specialist = Tomas Reed; answer signal = B'],
      [35, 'This specialist argues that local or connected people should regain control over restoration decisions.', 'C', 'Sacha Ndlovu, a community historian, believes restoration must involve returning authority to people connected with the damaged place', 'คำตอบคือ C เพราะ Sacha Ndlovu ว่า returning authority to people connected with the damaged place ไม่ใช่ Park (future climate)', 'regain control = returning authority; connected people = people connected with the damaged place; specialist = Sacha Ndlovu; answer signal = C'],
      [36, 'This specialist says restoration must take future environmental conditions into account.', 'D', 'Mei Lin Park, an ecologist, warns against restoring landscapes for a climate that no longer exists. A project, she argues, must be designed for future conditions as well as historical memory.', 'คำตอบคือ D เพราะ Mei Lin Park ว่า must be designed for future conditions ไม่ใช่ Feld (safety needs)', 'future conditions = designed for future conditions; specialist = Mei Lin Park; answer signal = D'],
      [37, 'This specialist values older techniques but also recognises modern safety requirements.', 'E', 'Oskar Feld, an architect, values traditional materials and methods, but says that restored buildings must also meet present-day safety needs.', 'คำตอบคือ E เพราะ Oskar Feld values traditional materials and methods but meet present-day safety needs ตรง older techniques + modern safety', 'older techniques = traditional materials and methods; modern safety = present-day safety needs; specialist = Oskar Feld; answer signal = E'],
      [38, 'he is attracted to what he calls .................... .', 'honest repair', 'As a writer, I am drawn to what I call honest repair.', 'คำตอบคือ honest repair เพราะ what I call honest repair ต้องตอบสองคำจาก passage (NO MORE THAN TWO WORDS)', '___ he calls = honest repair; TWO WORDS = honest repair'],
      [39, 'see both .................... and care.', 'injury', 'It should allow viewers to see both injury and care.', 'คำตอบคือ injury เพราะ see both injury and care ต้องคำเดียวในช่อง (care มีในประโยคแล้ว) ไม่ใช้ damage', 'both ___ and care = injury and care; ONE WORD = injury'],
      [40, 'how restoration should influence .................... .', 'public memory', 'how restoration should shape public memory.', 'คำตอบคือ public memory เพราะ shape public memory ตรง influence ___ ต้องสองคำจาก passage', 'influence ___ = shape public memory; TWO WORDS = public memory']
    ]
  }
]

// Fix urban darkness passage - I accidentally duplicated questions 36-40 block. Clean in generated output.
for (const exam of EXAMS) {
  if (exam.file.includes('urban-darkness')) {
    const marker = 'Questions 36-40\nDo the following statements agree with the claims of the writer in Reading Passage 3?\nIn boxes 36-40 on your answer sheet, write\n\nYES if the statement agrees with the claims of the writer\nNO if the statement contradicts the claims of the writer\nNOT GIVEN if it is impossible to say what the writer thinks about this\n\n36 The writer believes that cities should remove all artificial lighting from public places.'
    const idx = exam.passage.indexOf(marker)
    const idx2 = exam.passage.indexOf(marker, idx + 1)
    if (idx2 > -1) {
      exam.passage = exam.passage.slice(0, idx2).trimEnd()
    }
  }
}

for (const exam of EXAMS) {
  const rawAnswerKey = exam.answers.map((a) => q(a[0], a[1], a[2], exam.group, a[3], a[4], a[5])).join('\n\n')
  const payload = [
    {
      title: exam.title,
      category: 'advanced',
      collectionTitle: exam.collectionTitle,
      rawPassageText: exam.passage,
      rawAnswerKey
    }
  ]
  const outPath = path.join(outDir, exam.file)
  fs.writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`)
  console.log('Wrote', exam.file)
}
