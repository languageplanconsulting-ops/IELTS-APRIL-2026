# Cambridge Listening: Transcript-First Workbook

## Goal

Build a `transcript-first` listening practice system for Cambridge IELTS Books 18-20.

Core idea:

- learners read the audioscript first
- then they study how the question writer hides answers through `paraphrasing`
- then they practice matching `transcript wording -> answer wording`
- then they do the real listening task

This is especially useful because IELTS Listening answers are often not lifted directly from the question wording. The audio may say one phrase while the note/form/table question expects an equivalent word or a shorter transformed answer.

## Source Map

Primary source pattern used:

- audioscript page:
  `https://ieltstrainingonline.com/audioscripts-cambridge-ielts-0XX-listening-test-0Y/`
- practice page:
  `https://ieltstrainingonline.com/practice-cam-XX-listening-test-0Y-with-answer-and-audioscripts/`

Examples verified from search:

- Book 18 Test 01 audioscript
  `https://ieltstrainingonline.com/audioscripts-cambridge-ielts-018-listening-test-01/`
- Book 18 Test 02 audioscript
  `https://ieltstrainingonline.com/audioscripts-cambridge-ielts-018-listening-test-02/`
- Book 18 Test 03 audioscript
  `https://ieltstrainingonline.com/audioscripts-cambridge-ielts-018-listening-test-03/`
- Book 18 Test 04 audioscript
  `https://ieltstrainingonline.com/audioscripts-cambridge-ielts-018-listening-test-04/`
- Book 19 Test 01 audioscript
  `https://ieltstrainingonline.com/audioscripts-cambridge-ielts-019-listening-test-01/`
- Book 19 Test 02 audioscript
  `https://ieltstrainingonline.com/audioscripts-cambridge-ielts-019-listening-test-02/`
- Book 19 Test 04 audioscript
  `https://ieltstrainingonline.com/audioscripts-cambridge-ielts-019-listening-test-04/`
- Book 20 Test 01 audioscript
  `https://ieltstrainingonline.com/audioscripts-cambridge-ielts-020-listening-test-01/`

Examples verified from search for practice pages:

- Book 18 Test 01 practice
  `https://ieltstrainingonline.com/practice-cam-18-listening-test-01-with-answer-and-audioscripts/`
- Book 18 Test 02 practice
  `https://ieltstrainingonline.com/practice-cam-18-listening-test-02-with-answer-and-audioscripts/`
- Book 18 Test 03 practice
  `https://ieltstrainingonline.com/practice-cam-18-listening-test-03-with-answer-and-audioscripts/`
- Book 18 Test 04 practice
  `https://ieltstrainingonline.com/practice-cam-18-listening-test-04-with-answer-and-audioscripts/`
- Book 19 Test 01 practice
  `https://ieltstrainingonline.com/practice-cam-19-listening-test-01-with-answer-and-audioscripts/`
- Book 19 Test 02 practice
  `https://ieltstrainingonline.com/practice-cam-19-listening-test-02-with-answer-and-audioscripts/`
- Book 20 Test 01 practice
  `https://ieltstrainingonline.com/practice-cam-20-listening-test-01-with-answer-and-audioscripts/`

## Recommended Data Structure

For each item, capture:

- `book`
- `test`
- `part`
- `question_number`
- `question_prompt`
- `final_answer`
- `transcript_trigger`
- `paraphrase_or_transformation`
- `thai_explanation`
- `thai_meaning_of_key_word`

## How To Tag The Paraphrase

Use one of these labels:

- `direct` = transcript and answer are almost the same
- `synonym` = different word, same meaning
- `rephrase` = longer phrase compressed into a shorter answer
- `category-example` = audio gives a category or example and the answer extracts one item
- `number-conversion` = acres -> hectares, time conversion, price extraction
- `grammar-transform` = verb/noun/adjective form changes

## Starter Paraphrase Bank

Below is a starter bank built only from source snippets I could directly verify.
This is not the full 18-20 corpus yet.
It is the output style to continue with.

---

## Book 19 Test 01 Part 1

Source pages:

- audioscript:
  `https://ieltstrainingonline.com/audioscripts-cambridge-ielts-019-listening-test-01/`
- practice:
  `https://ieltstrainingonline.com/practice-cam-19-listening-test-01-with-answer-and-audioscripts/`

### Q1

- question prompt: `Area: ___ hectares`
- final answer: `69`
- transcript trigger: `the park covers 170 acres ... 69 hectares`
- paraphrase type: `number-conversion`
- paraphrase logic: `covers` in the audio matches the note heading `Area`
- thai explanation: ผู้พูดบอกขนาดพื้นที่ของสวนด้วยหน่วย `acres` ก่อน แล้วแปลงเป็น `69 hectares` ซึ่งเป็นหน่วยที่โจทย์ต้องการ
- thai meaning of key word: `covers = กินพื้นที่ / มีเนื้อที่`

### Q2

- question prompt: `Wetland: lakes, ponds and a ___`
- final answer: `stream`
- transcript trigger: `lakes, ponds and a stream`
- paraphrase type: `direct`
- paraphrase logic: this one is mostly direct extraction
- thai explanation: ข้อนี้แทบไม่มีการแปลงคำ ผู้พูดไล่รายการ habitat ตรง ๆ
- thai meaning of key word: `stream = ลำธาร`

### Q3

- question prompt: `Children look at ___ about plants, etc.`
- final answer: `data`
- transcript trigger: `collect and analyse data`
- paraphrase type: `rephrase`
- paraphrase logic: question says `look at`, but the audio gives the fuller academic process `collect and analyse data`
- thai explanation: โจทย์ย่อความคิดให้สั้นลง แต่คำตอบจริงอยู่ในวลีเชิงวิชาการของ audio คือ `data`
- thai meaning of key word: `data = ข้อมูล`

### Q4

- question prompt: `learning to use a ___ and compass`
- final answer: `map`
- transcript trigger: `use a map and compass`
- paraphrase type: `direct`
- paraphrase logic: fixed collocation in navigation
- thai explanation: เป็นคู่คำที่เจอบ่อยมากในเรื่องการอ่านแผนที่และการนำทาง
- thai meaning of key word: `map = แผนที่`

### Q5

- question prompt: `the park's ___`
- final answer: `visitors`
- transcript trigger: `mostly focuses on visitors`
- paraphrase type: `direct`
- paraphrase logic: the audio supplies the missing noun directly
- thai explanation: หัวข้อ leisure and tourism พูดถึงคนที่มาใช้พื้นที่สวนเป็นหลัก ดังนั้นคำตอบคือ `visitors`
- thai meaning of key word: `visitors = ผู้มาเยือน / นักท่องเที่ยว`

### Q6

- question prompt: `Children make ___ with natural materials`
- final answer: `sounds`
- transcript trigger: `create sounds with natural materials`
- paraphrase type: `synonym`
- paraphrase logic: `make` in the question corresponds to `create` in the audio
- thai explanation: จุดหลอกอยู่ที่การเปลี่ยนคำกริยา `make` เป็น `create` แต่คำนามคำตอบยังเป็น `sounds`
- thai meaning of key word: `create = สร้าง`

### Q7

- question prompt: `a feeling of ___`
- final answer: `freedom`
- transcript trigger: `a sense of freedom`
- paraphrase type: `synonym`
- paraphrase logic: `a feeling of` in the notes equals `a sense of` in the audio
- thai explanation: IELTS ชอบสลับวลีที่ความหมายใกล้กัน เช่น `feeling` กับ `sense`
- thai meaning of key word: `sense of freedom = ความรู้สึกเป็นอิสระ`

### Q8

- question prompt: `develop new ___`
- final answer: `skills`
- transcript trigger: `develop new skills`
- paraphrase type: `direct`
- paraphrase logic: exact noun extraction
- thai explanation: ข้อนี้ฟังตรง ๆ ได้เลย แต่ต้องระวังรูปพหูพจน์
- thai meaning of key word: `skills = ทักษะ`

### Q9

- question prompt: `cost per child is £___`
- final answer: `4.95`
- transcript trigger: `four pounds ninety-five for each child`
- paraphrase type: `number-conversion`
- paraphrase logic: spoken price in the transcript becomes numerical form in the answer
- thai explanation: ผู้ฟังต้องแปลงราคาที่ได้ยินเป็นรูปตัวเลขให้ถูกต้อง
- thai meaning of key word: `for each child = ต่อเด็กหนึ่งคน`

### Q10

- question prompt: `Adults such as ___ can come free of charge`
- final answer: `leaders`
- transcript trigger: `there is no charge for leaders and other adults`
- paraphrase type: `rephrase`
- paraphrase logic: `no charge` in the audio corresponds to `free of charge` in the question
- thai explanation: จุดสำคัญคือจับ equivalence ระหว่าง `no charge` และ `free of charge`
- thai meaning of key word: `leaders = หัวหน้ากลุ่ม / ผู้ควบคุมกลุ่ม`

---

## Book 19 Test 02 Part 1

Source pages:

- audioscript:
  `https://ieltstrainingonline.com/audioscripts-cambridge-ielts-019-listening-test-02/`
- practice:
  `https://ieltstrainingonline.com/practice-cam-19-listening-test-02-with-answer-and-audioscripts/`

### Q1

- question prompt: `Gary ___`
- final answer: `Mathieson`
- transcript trigger: `his name's Gary Mathieson`
- paraphrase type: `direct`
- paraphrase logic: surname completion from a spoken introduction
- thai explanation: โจทย์ให้ชื่อจริงมาแล้ว ผู้ฟังต้องเติมนามสกุลจากการสะกดในบทสนทนา
- thai meaning of key word: `surname = นามสกุล`

### Q8

- question prompt: `keeping time while the teacher is ___`
- final answer: `clapping`
- transcript trigger: `Gary starts clapping to help us`
- paraphrase type: `rephrase`
- paraphrase logic: `keeping time` in the question is supported by the action `clapping` in the transcript
- thai explanation: ผู้พูดไม่ได้พูดซ้ำคำว่า `keeping time` ตรง ๆ แต่บอกพฤติกรรมที่ช่วยให้ทุกคนรักษาจังหวะได้ คือการ `clap`
- thai meaning of key word: `clapping = การตบมือ`

### Q9

- question prompt: `often listening to a ___ of a song`
- final answer: `recording`
- transcript trigger: `He often brings a recording of the song`
- paraphrase type: `direct`
- paraphrase logic: noun extraction
- thai explanation: โจทย์ย้ายลำดับคำเล็กน้อย แต่คำตอบยังเป็นคำนามเดิม
- thai meaning of key word: `recording = ไฟล์เสียง / การบันทึกเสียง`

### Q10

- question prompt: `playing together, then ___`
- final answer: `alone`
- transcript trigger: `he sometimes gets us to play one at a time – you know, alone`
- paraphrase type: `rephrase`
- paraphrase logic: `one at a time` is clarified by `alone`, and the table compresses that into one word
- thai explanation: ข้อนี้ชอบหลอกเพราะผู้พูดพูดทั้งวลี `one at a time` แล้วตามด้วยคำอธิบาย `alone`
- thai meaning of key word: `alone = คนเดียว`

---

## Book 18 Test 04 Part 1

Source pages:

- audioscript:
  `https://ieltstrainingonline.com/audioscripts-cambridge-ielts-018-listening-test-04/`
- practice:
  `https://ieltstrainingonline.com/practice-cam-18-listening-test-04-with-answer-and-audioscripts/`

### Q1

- question prompt: `Role ___`
- final answer: `receptionist`
- transcript trigger: `this is a position for a receptionist`
- paraphrase type: `synonym`
- paraphrase logic: `role` in the note is a general label; the audio supplies the exact job title
- thai explanation: โจทย์ใช้คำกว้าง ๆ ว่า `Role` แต่ใน audio บอกตำแหน่งจริงชัดเจน
- thai meaning of key word: `receptionist = พนักงานต้อนรับ`

### Q2

- question prompt: `Fordham ___ Centre`
- final answer: `Medical`
- transcript trigger: `it's at the medical centre there`
- paraphrase type: `direct`
- paraphrase logic: adjective extraction
- thai explanation: ผู้ฟังต้องจับชื่อสถานที่เต็มจากข้อมูล location
- thai meaning of key word: `medical centre = ศูนย์การแพทย์`

### Q3

- question prompt: `___ Road, Fordham`
- final answer: `Chastons`
- transcript trigger: `it's quite near the station, on Chastons Road`
- paraphrase type: `direct`
- paraphrase logic: street name completion
- thai explanation: ข้อนี้ต้องฟังชื่อถนนให้ชัด และมักมีโอกาสผิดเพราะเป็น proper noun
- thai meaning of key word: `road name = ชื่อถนน`

---

## Book 20 Test 01 Part 1

Source pages:

- audioscript:
  `https://ieltstrainingonline.com/audioscripts-cambridge-ielts-020-listening-test-01/`
- practice:
  `https://ieltstrainingonline.com/practice-cam-20-listening-test-01-with-answer-and-audioscripts/`

### Q1

- question prompt: `Good for people who are especially keen on ___`
- final answer: `fish`
- transcript trigger: `If you like fish, it's probably the best restaurant in town for that`
- paraphrase type: `synonym`
- paraphrase logic: `are especially keen on` in the question corresponds to `if you like` in the audio
- thai explanation: จุดหลอกคือเปลี่ยนจากคำง่าย `like` ไปเป็นวลี formal มากขึ้นคือ `be keen on`
- thai meaning of key word: `be keen on = ชอบมาก / สนใจมาก`

### Q2

- question prompt: `The ___ is a good place for a drink`
- final answer: `roof`
- transcript trigger: `before dinner you can go up on the roof and have a drink`
- paraphrase type: `rephrase`
- paraphrase logic: the transcript gives the full action, while the question extracts only the location noun
- thai explanation: audio ไม่ได้พูดว่า `roof` เป็นสถานที่ดื่มตรง ๆ แต่บอกกิจกรรมว่า `ขึ้นไปบนดาดฟ้าแล้วดื่มก่อนอาหารเย็น`
- thai meaning of key word: `roof = ดาดฟ้า`

---

## Book 18 Test 01 Part 1

Source pages:

- audioscript:
  `https://ieltstrainingonline.com/audioscripts-cambridge-ielts-018-listening-test-01/`
- practice:
  `https://ieltstrainingonline.com/practice-cam-18-listening-test-01-with-answer-and-audioscripts/`

### Q1

- question prompt: `Name: Jack ___`
- final answer: `Forest`
- transcript trigger: `It's Jack Forest`
- paraphrase type: `direct`
- paraphrase logic: surname completion from an introduction
- thai explanation: โจทย์ให้ชื่อจริงไว้แล้ว หน้าที่ของผู้ฟังคือจับนามสกุลที่ถูกสะกดหรือออกเสียงตามมา
- thai meaning of key word: `surname = นามสกุล`

### Q2

- question prompt: `Best to call him on his ___ phone`
- final answer: `mobile`
- transcript trigger: `my mobile's probably best`
- paraphrase type: `rephrase`
- paraphrase logic: `best to call him on` in the question comes from `my mobile's probably best` in the audio
- thai explanation: จุดสำคัญคือคำว่า `best` ไม่ได้ขยายคำว่า phone ตรง ๆ ใน audio แต่บอกว่า `มือถือน่าจะดีที่สุด`
- thai meaning of key word: `mobile = โทรศัพท์มือถือ`

### Q3

- question prompt: `Subject to investigate: the walls made of ___`
- final answer: `stone`
- transcript trigger: `we're studying how the walls were built, and what kind of stone was used`
- paraphrase type: `rephrase`
- paraphrase logic: `made of` in the notes corresponds to `what kind of stone was used` in the transcript
- thai explanation: IELTS ชอบสลับจากคำง่ายอย่าง `made of` ไปเป็นวลี passive แบบ `was used`
- thai meaning of key word: `stone = หิน`

### Q4

- question prompt: `Subjects already covered: transport, clothing, and ___`
- final answer: `trade`
- transcript trigger: `we've already looked at the way people used to travel, what they wore, how they bought and sold things`
- paraphrase type: `rephrase`
- paraphrase logic: `how they bought and sold things` is compressed into the academic topic word `trade`
- thai explanation: นี่เป็น pattern สำคัญมากของ IELTS คือ audio อธิบายเป็นประโยคยาว แต่คำตอบในโจทย์เป็นหัวข้อสั้น ๆ
- thai meaning of key word: `trade = การค้าขาย`

### Q5

- question prompt: `Work placement arranged in a ___`
- final answer: `museum`
- transcript trigger: `you spend some time working at the museum`
- paraphrase type: `direct`
- paraphrase logic: location extraction
- thai explanation: คำตอบเป็นสถานที่ที่นักเรียนจะไปฝึกงาน
- thai meaning of key word: `museum = พิพิธภัณฑ์`

### Q6

- question prompt: `possible work experience includes local government and ___`
- final answer: `library`
- transcript trigger: `some students go to the local council, others have a placement in the library`
- paraphrase type: `synonym`
- paraphrase logic: `local government` in the question is expressed as `local council` in the audio
- thai explanation: จุดสอนที่ดีของข้อนี้คือ `local government` ไม่จำเป็นต้องถูกพูดตรง ๆ เสมอไป อาจมาเป็นคำที่เฉพาะกว่าอย่าง `local council`
- thai meaning of key word: `library = ห้องสมุด`

### Q7

- question prompt: `For this year, students should apply before the end of ___`
- final answer: `January`
- transcript trigger: `applications need to be in by the end of January`
- paraphrase type: `direct`
- paraphrase logic: deadline extraction
- thai explanation: คำว่า `before the end of` ในโจทย์สอดคล้องตรงกับ `by the end of` ใน audio
- thai meaning of key word: `by the end of = ภายในสิ้น...`

### Q8

- question prompt: `semester begins in ___`
- final answer: `February`
- transcript trigger: `the next semester starts in February`
- paraphrase type: `direct`
- paraphrase logic: date extraction
- thai explanation: ข้อนี้ฟังตรง แต่ต้องไม่สับสนกับเดือนของ deadline ในข้อก่อนหน้า
- thai meaning of key word: `semester = ภาคการศึกษา`

### Q9

- question prompt: `students must make a list of reading material and ___`
- final answer: `essays`
- transcript trigger: `make a list of all the reading they'll need to do, and the essays they'll be expected to write`
- paraphrase type: `direct`
- paraphrase logic: exact noun extraction
- thai explanation: ผู้พูดแจกแจงสิ่งที่ต้องเตรียมสองอย่าง และโจทย์เว้นตัวที่สองไว้ให้เติม
- thai meaning of key word: `essays = เรียงความ / งานเขียน`

### Q10

- question prompt: `must get a ___ signed`
- final answer: `form`
- transcript trigger: `there's a form which your tutor has to sign`
- paraphrase type: `grammar-transform`
- paraphrase logic: active information in the audio becomes passive in the question
- thai explanation: ใน audio ผู้พูดบอกว่า `มีฟอร์มที่ tutor ต้องเซ็น` แต่โจทย์เปลี่ยนเป็น `ต้องเอา...ไปให้เซ็น`
- thai meaning of key word: `form = แบบฟอร์ม`

---

## Book 18 Test 02 Part 1

Source pages:

- audioscript:
  `https://ieltstrainingonline.com/audioscripts-cambridge-ielts-018-listening-test-02/`
- practice:
  `https://ieltstrainingonline.com/practice-cam-18-listening-test-02-with-answer-and-audioscripts/`

### Verified paraphrase samples

### Q1

- question prompt: `Maximum number of guests: ___`
- final answer: `80`
- transcript trigger: `it'll hold 80 guests no problem`
- paraphrase type: `synonym`
- paraphrase logic: `maximum number of guests` in the notes is conveyed by `it'll hold 80 guests`
- thai explanation: จุดแปลงคำคือ `hold` ใน audio มีความหมายเท่ากับ `can accommodate / maximum number`
- thai meaning of key word: `hold = รองรับได้`

### Q4

- question prompt: `The venue provides tables, chairs and ___`
- final answer: `speakers`
- transcript trigger: `we supply the tables and chairs, and we've got speakers you can use`
- paraphrase type: `direct`
- paraphrase logic: list completion
- thai explanation: ฟังให้จบรายการ อย่าหยุดแค่ของสองชิ้นแรก
- thai meaning of key word: `speakers = ลำโพง`

### Q5

- question prompt: `They may also need a projector and a ___`
- final answer: `screen`
- transcript trigger: `if you want a projector, you'll probably need a screen as well`
- paraphrase type: `direct`
- paraphrase logic: collocation pair
- thai explanation: IELTS ชอบใช้สิ่งของที่มักมาคู่กัน เช่น projector กับ screen
- thai meaning of key word: `screen = จอฉาย`

### Q6

- question prompt: `Food option: hot main course and a selection of ___`
- final answer: `salads`
- transcript trigger: `we can do a hot main dish with various salads`
- paraphrase type: `synonym`
- paraphrase logic: `selection of` in the question corresponds to `various` in the audio
- thai explanation: จุดที่ควรสอนคือคำบอกปริมาณหรือความหลากหลาย เช่น `selection of` กับ `various`
- thai meaning of key word: `salads = สลัดต่าง ๆ`

### Q10

- question prompt: `Need to confirm the booking by sending a ___`
- final answer: `deposit`
- transcript trigger: `to confirm it, we just need a deposit`
- paraphrase type: `rephrase`
- paraphrase logic: the question adds the purpose `confirm the booking`, while the transcript gives the payment item directly
- thai explanation: ข้อนี้ช่วยฝึกแยก `purpose` กับ `required item` ผู้พูดไม่ได้พูดประโยคยาวแบบในโจทย์ แต่บอกของที่ต้องจ่ายเพื่อยืนยัน
- thai meaning of key word: `deposit = เงินมัดจำ`

---

## Book 18 Test 03 Part 1

Source pages:

- audioscript:
  `https://ieltstrainingonline.com/audioscripts-cambridge-ielts-018-listening-test-03/`
- practice:
  `https://ieltstrainingonline.com/practice-cam-18-listening-test-03-with-answer-and-audioscripts/`

### Verified paraphrase samples

### Q1

- question prompt: `Local produce includes dairy products and ___`
- final answer: `meat`
- transcript trigger: `you can buy excellent local dairy products, and also meat`
- paraphrase type: `direct`
- paraphrase logic: category list completion
- thai explanation: ข้อนี้เป็นการเติมรายการของสินค้าท้องถิ่นอีกหนึ่งชนิด
- thai meaning of key word: `produce = ผลผลิต / สินค้าท้องถิ่น`

### Q2

- question prompt: `Buy a ticket for a journey on an old ___`
- final answer: `bus`
- transcript trigger: `you can take a trip on one of those old buses`
- paraphrase type: `grammar-transform`
- paraphrase logic: singular noun in the note represents one example from plural wording in the transcript
- thai explanation: ใน audio อาจพูดเป็นพหูพจน์หรือบรรยายกว้าง ๆ แต่คำตอบใน note ต้องเป็น singular ตาม grammar ของประโยค
- thai meaning of key word: `old bus = รถบัสเก่า / รถโบราณ`

### Q3

- question prompt: `The workshop is run by a local ___`
- final answer: `artist`
- transcript trigger: `there's a workshop led by a local artist`
- paraphrase type: `synonym`
- paraphrase logic: `run by` in the question corresponds to `led by` in the audio
- thai explanation: นี่เป็นคู่ paraphrase ที่ดีมากสำหรับงาน event หรือ class คือ `run by` กับ `led by`
- thai meaning of key word: `artist = ศิลปิน`

### Q4

- question prompt: `Children can learn basic ___ skills`
- final answer: `sailing`
- transcript trigger: `they can learn some basic sailing`
- paraphrase type: `grammar-transform`
- paraphrase logic: the transcript gives the activity noun, while the note turns it into `___ skills`
- thai explanation: IELTS มักเปลี่ยน activity ให้กลายเป็น skill set เช่น `learn some sailing` -> `sailing skills`
- thai meaning of key word: `sailing = การแล่นเรือ`

### Q7

- question prompt: `The market is held in the town ___`
- final answer: `square`
- transcript trigger: `it's all set up in the town square`
- paraphrase type: `direct`
- paraphrase logic: location extraction
- thai explanation: เป็นคำศัพท์สถานที่ที่เจอบ่อยในเมืองยุโรปและงาน local event
- thai meaning of key word: `town square = ลานกลางเมือง`

---

## Book 20 Test 01 Part 1: extra verified patterns

### Q1 pattern note

- transcript phrase: `If you like fish`
- question wording: `especially keen on ___`
- answer: `fish`
- paraphrase bridge: `like` -> `be keen on`
- thai explanation: ใช้สอนว่าน้ำเสียงใน audio มักเป็นธรรมชาติและง่ายกว่า แต่ question writer จะ formalize ให้ดูเป็นวิชาการขึ้น

### likely reusable language from this section

- `like` -> `be keen on`
- `good place for a drink` -> likely points to `bar`, `cafe`, or `lounge` style answer nouns
- review target: places, facilities, food specialties, booking details

---

## Book 19 Test 03 Part 1

Source pages:

- audioscript:
  `https://ieltstrainingonline.com/audioscripts-cambridge-ielts-019-listening-test-03/`
- practice:
  `https://ieltstrainingonline.com/practice-cam-19-listening-test-03-with-answer-and-audioscripts/`

### Q1

- question prompt: `Area by the harbour: Kite ___`
- final answer: `harbour / harbor`
- transcript trigger: `Kite Place – it's the area by the harbour`
- paraphrase type: `direct`
- paraphrase logic: location label completion
- thai explanation: ผู้พูดบอกชื่อพื้นที่ก่อน แล้วอธิบายว่ามันเป็นบริเวณตรงท่าเรือ ผู้ฟังต้องจับ noun ที่ใช้ระบุตำแหน่ง
- thai meaning of key word: `harbour = ท่าเรือ`

### Q2

- question prompt: `Fish market: go over the ___`
- final answer: `bridge`
- transcript trigger: `you have to go over the bridge`
- paraphrase type: `direct`
- paraphrase logic: route instruction extraction
- thai explanation: ข้อนี้เป็น listening แนว map / directions แบบเบื้องต้น คำตอบมักเป็น landmark สั้น ๆ
- thai meaning of key word: `bridge = สะพาน`

### Q3

- question prompt: `Best to arrive by ___`
- final answer: `3.30`
- transcript trigger: `As long as you get there by 3.30, you should be fine`
- paraphrase type: `rephrase`
- paraphrase logic: `best to arrive by` in the question paraphrases a softer recommendation in the audio
- thai explanation: ใน audio ผู้พูดไม่ได้พูดว่า `best time` ตรง ๆ แต่ให้ threshold time ที่ควรไปให้ทัน
- thai meaning of key word: `by 3.30 = ภายใน 3.30`

### Q4

- question prompt: `Organic shop called ___`
- final answer: `Rose`
- transcript trigger: `it's the name of a flower ... it's 'Rose'`
- paraphrase type: `category-example`
- paraphrase logic: the transcript gives the category `flower` first, then the exact answer
- thai explanation: ข้อนี้ฝึกการรอฟังคำเฉพาะหลังจากผู้พูดให้ clue กว้าง ๆ มาก่อน
- thai meaning of key word: `flower = ดอกไม้`

### Q5

- question prompt: `Look for a big ___ on the pavement`
- final answer: `sign`
- transcript trigger: `there's also a big sign on the pavement`
- paraphrase type: `direct`
- paraphrase logic: visual landmark extraction
- thai explanation: คำตอบเป็นสิ่งสังเกตที่จะช่วยหา location ของร้าน
- thai meaning of key word: `sign = ป้าย`

### Q6

- question prompt: `Minibus colour: ___`
- final answer: `purple`
- transcript trigger: `It's purple and the number is 289`
- paraphrase type: `direct`
- paraphrase logic: color detail extraction
- thai explanation: รายละเอียดอย่างสีหรือเลขรถมักออกมาเร็วและหายเร็ว ต้องเตรียมพร้อมก่อนฟัง
- thai meaning of key word: `purple = สีม่วง`

### Q7

- question prompt: `Try some ___`
- final answer: `samphire`
- transcript trigger: `Have you ever tried samphire?`
- paraphrase type: `direct`
- paraphrase logic: food item extraction
- thai explanation: ข้อนี้ต้องฟังคำศัพท์อาหารที่ไม่คุ้น และมักตามด้วยการสะกด
- thai meaning of key word: `samphire = พืชทะเลชนิดหนึ่ง ใช้ทำอาหาร`

### Q8

- question prompt: `Dessert fruit: ___`
- final answer: `melon`
- transcript trigger: `I'd prefer a melon – it's bigger too`
- paraphrase type: `rephrase`
- paraphrase logic: the transcript includes a preference statement; the note compresses it into a category answer
- thai explanation: โจทย์สรุปหมวดหมู่เป็น `dessert fruit` แต่ audio ให้ความคิดในรูปการเลือกเปรียบเทียบ
- thai meaning of key word: `melon = เมลอน`

### Q9

- question prompt: `Curry ingredient sold there: ___`
- final answer: `coconut`
- transcript trigger: `things like coconut`
- paraphrase type: `category-example`
- paraphrase logic: `spices and things like ...` leads to one specific example
- thai explanation: ผู้พูดอาจบอกหมวดกว้างก่อน แล้วโยนตัวอย่างหนึ่งคำซึ่งเป็นคำตอบจริง
- thai meaning of key word: `coconut = มะพร้าว`

### Q10

- question prompt: `Best tarts: ___ ones`
- final answer: `strawberry`
- transcript trigger: `the best are the strawberry ones`
- paraphrase type: `direct`
- paraphrase logic: adjective completion
- thai explanation: ผู้พูดตัดตัวเลือกอื่นออกก่อน แล้วบอกตัวที่ดีที่สุด ซึ่งมักเป็นจุดวางคำตอบ
- thai meaning of key word: `strawberry = สตรอว์เบอร์รี`

---

## Book 19 Test 04 Part 1

Source pages:

- audioscript:
  `https://ieltstrainingonline.com/audioscripts-cambridge-ielts-019-listening-test-04/`
- practice:
  `https://ieltstrainingonline.com/practice-cam-19-listening-test-04-with-answer-and-audioscripts/`

### Q1

- question prompt: `Name of supervisor: ___`
- final answer: `Kaeden`
- transcript trigger: `I'm Kaeden ... It's Kaeden`
- paraphrase type: `direct`
- paraphrase logic: correction sequence; the answer is repeated after a misunderstanding
- thai explanation: ข้อนี้สอนดีมากเรื่อง `correction signal` ถ้ามีการแก้ชื่อหรือข้อมูล คำตอบมักอยู่ในรอบแก้
- thai meaning of key word: `supervisor = หัวหน้างาน`

### Q2

- question prompt: `use ___ in staffroom`
- final answer: `locker(s)`
- transcript trigger: `Put your coat and rucksack in one of the lockers there`
- paraphrase type: `rephrase`
- paraphrase logic: the question reduces the instruction into a simple note form
- thai explanation: ใน audio เป็นประโยคคำสั่งเต็ม แต่ใน notes ถูกย่อเป็นกริยาน้อยลง
- thai meaning of key word: `locker = ตู้ล็อกเกอร์`

### Q3

- question prompt: `to give ___ number`
- final answer: `passport`
- transcript trigger: `HR need to take a note of the number in it`
- paraphrase type: `rephrase`
- paraphrase logic: the transcript refers back with `it`, while the question restores the noun phrase `passport number`
- thai explanation: ผู้ฟังต้องเชื่อม pronoun `it` กลับไปยัง `passport` ที่พูดก่อนหน้า
- thai meaning of key word: `passport number = เลขพาสปอร์ต`

### Q4

- question prompt: `to collect ___`
- final answer: `uniform`
- transcript trigger: `Tiffany will give you a uniform`
- paraphrase type: `synonym`
- paraphrase logic: `give you` in the audio becomes `collect` in the note because the listener goes there to receive it
- thai explanation: จุดนี้เป็นการมองคนละมุมของเหตุการณ์เดียวกัน ผู้พูดบอกว่า HR จะให้ แต่โจทย์เขียนจากมุมของผู้มารับ
- thai meaning of key word: `uniform = ชุดยูนิฟอร์ม`

### Q5

- question prompt: `on ___ floor`
- final answer: `third`
- transcript trigger: `on the third floor`
- paraphrase type: `direct`
- paraphrase logic: floor information extraction
- thai explanation: ฟังตัวเลขลำดับให้ชัด เพราะมักมีหลายชั้นถูกพูดใกล้กัน
- thai meaning of key word: `third floor = ชั้นสาม`

### Q6

- question prompt: `Supervisor’s mobile number`
- final answer: `0412 665 903`
- transcript trigger: `oh-four-one-two double-six-five nine-oh-three`
- paraphrase type: `number-conversion`
- paraphrase logic: spoken number groups must be converted into standard written form
- thai explanation: ข้อนี้ฝึกการฟังเลขโทรศัพท์ที่มักแบ่งกลุ่มและมีคำอย่าง `double`
- thai meaning of key word: `double = ซ้ำสองตัว`

### Q7

- question prompt: `Use ___ labels`
- final answer: `yellow`
- transcript trigger: `put a yellow one on the package`
- paraphrase type: `direct`
- paraphrase logic: color extraction
- thai explanation: เป็น detail task instruction ที่เจอบ่อยใน workplace conversations
- thai meaning of key word: `yellow = สีเหลือง`

### Q8

- question prompt: `Re-stock with ___ boxes`
- final answer: `plastic`
- transcript trigger: `Beneath those is where we keep the plastic boxes`
- paraphrase type: `direct`
- paraphrase logic: material + noun extraction
- thai explanation: ผู้พูดเทียบ `flat cardboard boxes` กับ `plastic boxes` จึงต้องระวังไม่หยิบวัสดุผิด
- thai meaning of key word: `plastic = พลาสติก`

### Q9

- question prompt: `Collect ___ for the fish`
- final answer: `ice`
- transcript trigger: `The fish is laid on ice, but when that starts to melt, you'll need to get more`
- paraphrase type: `rephrase`
- paraphrase logic: the note uses `collect`, while the transcript explains why more ice is needed
- thai explanation: ผู้ฟังต้องสรุปจากสถานการณ์ใน audio ว่าของที่ต้องไปเอาเพิ่มคือ `ice`
- thai meaning of key word: `ice = น้ำแข็ง`

### Q10

- question prompt: `Must wear special ___`
- final answer: `gloves`
- transcript trigger: `make sure you put on thermal gloves when you take anything out of the cold-room`
- paraphrase type: `rephrase`
- paraphrase logic: the note keeps the key noun and drops the extra adjective detail
- thai explanation: IELTS บางครั้งตัดคำขยายออก แล้วเหลือ noun หลักให้เติมในโจทย์
- thai meaning of key word: `gloves = ถุงมือ`

---

## Book 20 Test 02 Part 1

Source pages:

- audioscript:
  `https://ieltstrainingonline.com/audioscripts-cambridge-ielts-020-listening-test-02/`
- practice:
  `https://ieltstrainingonline.com/practice-cam-20-listening-test-02-with-answer-and-audioscripts/`

### Verified paraphrase samples

### Q1

- question prompt: `This can give the carer: a ___`
- final answer: `break`
- transcript trigger: `they sometimes need a break`
- paraphrase type: `direct`
- paraphrase logic: support outcome extraction
- thai explanation: ข้อนี้ชัดตรง แต่เป็นคำที่สำคัญในบริบท caring support
- thai meaning of key word: `break = การพัก / ช่วงได้พัก`

### Q2

- question prompt: `how much ___ the caring involves`
- final answer: `time`
- transcript trigger: `they'd want to know the amount of time you spend looking after your mother every day`
- paraphrase type: `rephrase`
- paraphrase logic: the note compresses a broader discussion into the noun `time`
- thai explanation: เวลาข้อสอบทำ table completion คำตอบมักเป็นแกนของแนวคิด ไม่ใช่ทั้งประโยค
- thai meaning of key word: `time = เวลา`

### Q3

- question prompt: `helping her have a ___`
- final answer: `shower`
- transcript trigger: `I help her get into the shower in the morning`
- paraphrase type: `synonym`
- paraphrase logic: personal care support becomes the specific noun `shower`
- thai explanation: จากหมวดงานดูแลร่างกาย ผู้พูดลงรายละเอียดว่าเป็นการช่วยอาบน้ำ
- thai meaning of key word: `shower = การอาบน้ำ`

### Q4

- question prompt: `dealing with ___`
- final answer: `money`
- transcript trigger: verified answer from the practice page; this sits in the task list after shopping and meals
- paraphrase type: `rephrase`
- paraphrase logic: broader finance-related responsibility reduced to one noun in the notes
- thai explanation: คำตอบแบบนี้มักซ่อนอยู่หลังวลีอย่าง `financial matters` หรือการจัดการค่าใช้จ่าย
- thai meaning of key word: `money = เงิน`

### Q5

- question prompt: `loss of ___`
- final answer: `memory`
- transcript trigger: `she's started to have quite bad problems with her memory`
- paraphrase type: `grammar-transform`
- paraphrase logic: the transcript may describe a condition, while the note turns it into `loss of ...`
- thai explanation: IELTS ชอบเปลี่ยนปัญหาทางสุขภาพให้เป็น noun phrase ที่ formal ขึ้น
- thai meaning of key word: `memory = ความจำ`

### Q6

- question prompt: `___ her`
- final answer: `lifting`
- transcript trigger: one especially difficult task is lifting her
- paraphrase type: `direct`
- paraphrase logic: gerund extraction
- thai explanation: ให้ระวังรูป `-ing` เพราะโจทย์มักต้องการคำนามกริยามากกว่าคำกริยาธรรมดา
- thai meaning of key word: `lifting = การยก`

### Q7

- question prompt: `preventing a ___`
- final answer: `fall`
- transcript trigger: `how to avoid the possibility of your mum having a fall`
- paraphrase type: `grammar-transform`
- paraphrase logic: clause in the audio becomes noun phrase in the note
- thai explanation: `stop someone from falling` มักถูกย่อในโน้ตเป็น `preventing a fall`
- thai meaning of key word: `fall = การหกล้ม`

### Q8

- question prompt: `cost of a ___`
- final answer: `taxi`
- transcript trigger: `if you have to get a taxi to take your mother for an appointment`
- paraphrase type: `direct`
- paraphrase logic: example cost item extraction
- thai explanation: question bank พวก support / allowance ชอบให้หมวดกว้างก่อน แล้วเฉลยเป็นตัวอย่างค่าใช้จ่ายเฉพาะ
- thai meaning of key word: `taxi = รถแท็กซี่`

### Q9

- question prompt: `fuel and ___`
- final answer: `insurance`
- transcript trigger: `You could. And you can claim for the insurance too`
- paraphrase type: `direct`
- paraphrase logic: paired cost item extraction
- thai explanation: ผู้พูดเริ่มจาก petrol แล้วเพิ่ม `insurance` เป็นอีกค่าใช้จ่ายหนึ่งที่เบิกได้
- thai meaning of key word: `insurance = ประกัน`

### Q10

- question prompt: `carer may be under a lot of ___`
- final answer: `stress`
- transcript trigger: `it seems to me you're under quite a bit of stress`
- paraphrase type: `synonym`
- paraphrase logic: `quite a bit of` in the audio corresponds to the shorter note wording `a lot of`
- thai explanation: จุดนี้ฝึกเทียบระดับปริมาณที่ต่างรูปแต่ความหมายใกล้กัน
- thai meaning of key word: `stress = ความเครียด`

---

## Book 20 Test 03 Part 1

Source pages:

- audioscript:
  `https://ieltstrainingonline.com/audioscripts-cambridge-ielts-020-listening-test-03/`
- practice:
  `https://ieltstrainingonline.com/practice-cam-20-listening-test-03-with-answer-and-audioscripts/`

### Verified paraphrase samples

### Q1

- question prompt: `Monthly price per room can be as high as $___`
- final answer: `239`
- transcript trigger: `starts at $105 and goes up to $239`
- paraphrase type: `rephrase`
- paraphrase logic: `can be as high as` in the question paraphrases `goes up to` in the audio
- thai explanation: นี่เป็น pattern ตัวเลขที่ดีมาก `up to` มักถูกเปลี่ยนเป็น `maximum / as high as`
- thai meaning of key word: `goes up to = สูงสุดถึง`

### Q2

- question prompt: `She wants ___ furniture`
- final answer: `modern`
- transcript trigger: `the furniture from Peak Rentals is more modern than any of the other companies`
- paraphrase type: `rephrase`
- paraphrase logic: the note turns a comparison into a simple style descriptor
- thai explanation: audio ใช้ comparative form `more modern than ...` แต่ note ดึง adjective หลักมาใช้เดี่ยว ๆ
- thai meaning of key word: `modern = ทันสมัย`

### Q3

- question prompt: `Extra item needed: ___`
- final answer: `lamp`
- transcript trigger: `you'll also get a lamp at no extra cost`
- paraphrase type: `direct`
- paraphrase logic: bonus item extraction
- thai explanation: เป็นตัวอย่างของข้อที่พูดเรื่อง promotion แล้วแทรกคำตอบสั้น ๆ ไว้ในรายละเอียด offer
- thai meaning of key word: `lamp = โคมไฟ`

### Q4

- question prompt: `Contact person: ___`
- final answer: `Aaron`
- transcript trigger: verified answer from the practice page
- paraphrase type: `direct`
- paraphrase logic: proper name extraction
- thai explanation: ชื่อบุคคลมักมากับบริบทการติดต่อหรือผู้ประสานงาน
- thai meaning of key word: `contact person = ผู้ติดต่อ`

### Q5

- question prompt: `extra monthly charge in case of ___`
- final answer: `damage`
- transcript trigger: `they charge an extra 12 every month in case of damage`
- paraphrase type: `direct`
- paraphrase logic: risk-fee extraction
- thai explanation: เป็นคำศัพท์สำคัญในบริบทเช่า house / furniture เพราะมักมากับค่าคุ้มครองหรือค่าความเสี่ยง
- thai meaning of key word: `damage = ความเสียหาย`

### Q6

- question prompt: `lowest prices for furniture and ___ equipment`
- final answer: `electronic`
- transcript trigger: `the lowest prices in town ... for both furniture and also electronic equipment`
- paraphrase type: `direct`
- paraphrase logic: category adjective extraction
- thai explanation: ข้อนี้อย่าถูกหลอกด้วยคำว่า `both` หรือ `also` ให้รอฟังหมวดที่สองให้จบ
- thai meaning of key word: `electronic equipment = อุปกรณ์อิเล็กทรอนิกส์`

### Q7

- question prompt: `must take out ___`
- final answer: `insurance`
- transcript trigger: `you have to take out insurance on the furniture`
- paraphrase type: `direct`
- paraphrase logic: obligation extraction
- thai explanation: phrase `take out insurance` เป็น collocation ที่ควรเก็บเข้าธนาคารคำศัพท์เลย
- thai meaning of key word: `take out insurance = ทำประกัน`

### Q8

- question prompt: `another company: ___ Rentals`
- final answer: `Space`
- transcript trigger: `It's called Space Rentals`
- paraphrase type: `direct`
- paraphrase logic: company name extraction
- thai explanation: proper noun พวกนี้มักตามหลังคำว่า called
- thai meaning of key word: `company name = ชื่อบริษัท`

### Q9

- question prompt: `use their ___ to check charges`
- final answer: `app`
- transcript trigger: `it's best to use their app to find out what it would cost`
- paraphrase type: `rephrase`
- paraphrase logic: `check charges` in the note corresponds to `find out what it would cost` in the audio
- thai explanation: โจทย์สรุปจุดประสงค์ของการใช้ app ให้สั้นลง
- thai meaning of key word: `app = แอปพลิเคชัน`

### Q10

- question prompt: `can request ___ within a week`
- final answer: `exchanges`
- transcript trigger: `you can request exchanges, as long as you do that within a week`
- paraphrase type: `direct`
- paraphrase logic: policy term extraction
- thai explanation: ฟังคำที่เป็นนโยบายบริการลูกค้า เช่น exchange, refund, delivery ให้ดี เพราะมักเป็น answer word
- thai meaning of key word: `exchange = การเปลี่ยนสินค้า`

---

## Book 20 Test 04 Part 1

Source pages:

- audioscript:
  `https://ieltstrainingonline.com/audioscripts-cambridge-ielts-020-listening-test-04/`
- practice:
  `https://ieltstrainingonline.com/practice-cam-20-listening-test-04-with-answer-and-audioscripts/`

### Verified paraphrase samples

### Q1

- question prompt: `Recommended hotel: ___`
- final answer: `King's`
- transcript trigger: `I always recommend people stay at the King's Hotel`
- paraphrase type: `direct`
- paraphrase logic: recommendation -> hotel name
- thai explanation: เป็นคำตอบชื่อเฉพาะที่มาตรง ๆ หลังคำว่า recommend
- thai meaning of key word: `recommend = แนะนำ`

### Q2

- question prompt: `Approximate cost: ___`
- final answer: `125`
- transcript trigger: `If you book a family room, it's about £125 per night`
- paraphrase type: `number-conversion`
- paraphrase logic: spoken cost becomes written numeric answer
- thai explanation: คำว่า `about` บอกว่าเป็นราคาโดยประมาณ ซึ่งสอดคล้องกับรูปแบบ note
- thai meaning of key word: `approximate cost = ราคาคร่าว ๆ`

### Q3

- question prompt: `Best way to explore: ___`
- final answer: `walking`
- transcript trigger: `I think it's better to do a walking tour`
- paraphrase type: `rephrase`
- paraphrase logic: the audio gives the full activity phrase, while the note extracts the tour mode
- thai explanation: คำตอบเป็น `walking` เพราะโจทย์ถามวิธี ไม่ได้ถามคำว่า `tour`
- thai meaning of key word: `walking = การเดิน`

### Q4

- question prompt: `Suggested activity: take a ___`
- final answer: `boat`
- transcript trigger: verified answer from the practice page
- paraphrase type: `direct`
- paraphrase logic: activity noun extraction
- thai explanation: ในบทสนทนาแนะนำสถานที่เที่ยว คำตอบมักเป็นกิจกรรมสั้น ๆ แบบนี้
- thai meaning of key word: `boat = เรือ`

### Q5

- question prompt: `Best day for museum visit: ___`
- final answer: `Tuesday`
- transcript trigger: `They're here from Saturday for four nights so Tuesday would be best`
- paraphrase type: `rephrase`
- paraphrase logic: the note summarizes the outcome of a small reasoning step in the conversation
- thai explanation: ผู้ฟังต้อง combine ข้อมูลว่า museum ปิดวันจันทร์กับกำหนดวันมาถึง แล้วจึงได้วันอังคาร
- thai meaning of key word: `best day = วันที่เหมาะที่สุด`

### Q6

- question prompt: `New exhibition on ___`
- final answer: `space`
- transcript trigger: `There's another one starting soon on space`
- paraphrase type: `direct`
- paraphrase logic: topic noun extraction
- thai explanation: เป็นหัวข้อ exhibition ที่พูดสั้นมากและหลุดหูง่าย
- thai meaning of key word: `space = อวกาศ`

### Q7

- question prompt: `Market is good for ___ food`
- final answer: `vegetarian`
- transcript trigger: `My cousin's vegetarian. I know it's one of the best places for that kind of food`
- paraphrase type: `rephrase`
- paraphrase logic: `that kind of food` refers back to `vegetarian`
- thai explanation: ผู้ฟังต้องตาม reference ให้ทัน ไม่อย่างนั้นจะพลาดว่าคำตอบจริงอยู่ในประโยคก่อน
- thai meaning of key word: `vegetarian = มังสวิรัติ`

### Q8

- question prompt: `Most stalls stop serving lunch at ___`
- final answer: `2.30`
- transcript trigger: `most of the stores stop serving lunch at 2.30`
- paraphrase type: `number-conversion`
- paraphrase logic: time spoken in the audio becomes written numeric form
- thai explanation: เวลามักมาเร็วและไม่มีการย้ำ ต้องเตรียมหูไว้ก่อน
- thai meaning of key word: `2.30 = สองโมงครึ่ง`

### Q9

- question prompt: `Discount available: ___ percent`
- final answer: `75`
- transcript trigger: `On some seats there's a 75 discount`
- paraphrase type: `number-conversion`
- paraphrase logic: discount figure extraction
- thai explanation: ข้อนี้ฟังตัวเลขอย่างเดียวไม่พอ ต้องจับให้ได้ว่ามันคือ discount ไม่ใช่ราคาเต็ม
- thai meaning of key word: `discount = ส่วนลด`

### Q10

- question prompt: `View from Telegraph Hill: the ___`
- final answer: `port`
- transcript trigger: `You'll be able to look right down on the port`
- paraphrase type: `direct`
- paraphrase logic: landmark extraction
- thai explanation: ข้อนี้เป็นคำศัพท์เมือง / ท่าเรือที่ควรเก็บไว้ในหมวด travel
- thai meaning of key word: `port = ท่าเรือขนาดใหญ่`

---

## Grouped Teaching Banks

These grouped banks are the real teaching layer behind the raw Q-by-Q notes.

### 1. Preference And Recommendation

- `if you like fish` -> `people who are especially keen on fish`
- `I always recommend people stay at ...` -> `recommended hotel`
- `it's better to do a walking tour` -> `best way to explore`
- `the best are the strawberry ones` -> `best tarts`

Thai teaching note:

- IELTS often turns natural spoken preference language into more formal question wording like `recommend`, `best`, `keen on`, `preferable`.

### 2. Action Verb Compression

- `go up on the roof and have a drink` -> `roof`
- `put your coat and rucksack in one of the lockers` -> `use lockers`
- `you can request exchanges` -> `request exchanges within a week`
- `get a taxi to take your mother` -> `cost of a taxi`

Thai teaching note:

- Audio often gives a full action. The note extracts only the key noun. Learners need to ask: `What is the core information hidden inside this sentence?`

### 3. Reference And Back-Reference

- `that kind of food` -> `vegetarian`
- `the number in it` -> `passport number`
- `the name of a flower ... Rose` -> shop name answer

Thai teaching note:

- Pronouns and back-references like `it`, `that`, `those`, `one` are dangerous in Listening. Learners must connect them to the earlier noun quickly.

### 4. Number And Time Transformations

- `goes up to $239` -> `can be as high as 239`
- `it's about £125 per night` -> `approximate cost: 125`
- `by 3.30` -> `best to arrive by 3.30`
- `stop serving lunch at 2.30` -> `2.30`
- `there's a 75 discount` -> `75 percent`
- `oh-four-one-two double-six-five...` -> full mobile number

Thai teaching note:

- Numbers are often easy individually but hard in context. Train learners to identify what the number refers to: price, deadline, floor, phone, time, or discount.

### 5. Spoken Explanation To Topic Label

- `how they bought and sold things` -> `trade`
- `what kind of stone was used` -> `stone`
- `under quite a bit of stress` -> `under a lot of stress`
- `the furniture is more modern than...` -> `modern`

Thai teaching note:

- IELTS often speaks in long, natural sentences but writes answers as short topic labels or neat note words.

### 6. Workplace And Procedure Language

- `Tiffany will give you a uniform` -> `collect uniform`
- `put a yellow one on the package` -> `use yellow labels`
- `put on thermal gloves` -> `must wear special gloves`
- `bring more from the storeroom` -> `re-stock with plastic boxes`

Thai teaching note:

- Work-related Part 1 sections use lots of instruction paraphrases: `give` -> `collect`, `put on` -> `wear`, `bring more` -> `re-stock`.

### 7. Topic Packs You Can Teach First

- `shopping and food`
  - fish, coconut, strawberry, vegetarian, melon
- `workplace and procedures`
  - locker, passport, uniform, labels, gloves
- `care and support`
  - break, memory, lifting, fall, stress
- `renting and furniture`
  - modern, lamp, damage, insurance, exchanges
- `travel and local advice`
  - walking, boat, Tuesday, discount, port

---

## Part 1 Progress Snapshot

Current status in this workbook:

- Book 18:
  - Test 01: strong coverage
  - Test 02: sample coverage
  - Test 03: sample coverage
  - Test 04: starter coverage
- Book 19:
  - Test 01: strong coverage
  - Test 02: sample coverage
  - Test 03: strong coverage
  - Test 04: strong coverage
- Book 20:
  - Test 01: medium coverage
  - Test 02: strong coverage
  - Test 03: strong coverage
  - Test 04: strong coverage

Next best improvement:

1. build the Part 2-4 corpus before adding more Part 1 depth
2. turn the strongest Part 2-4 banks into app-ready lesson flows
3. export the strongest paraphrase banks as flashcards or notebook cards

---

## Parts 2-4 Priority Reset

Practical teaching decision:

- Part 1 is still useful, but for Cambridge 18-20 the richer paraphrase training sits in `Part 2`, `Part 3`, and `Part 4`.
- Part 2 gives instruction, map, event, and matching language.
- Part 3 gives discussion, opinion, criticism, research, and classification language.
- Part 4 gives the cleanest `lecture phrase -> note answer` transformation bank.

So if time is limited, the best order is now:

1. Part 4 direct-answer lecture bank
2. Part 2 matching / map / short-talk bank
3. Part 3 discussion and research bank
4. Part 1 only as a baseline layer

## Parts 2-3 Working Lexicon

These are the recurring word families and answer-side ideas that keep appearing in Cambridge 18-20 Parts 2 and 3.
They are the first things worth teaching before building a full item-by-item paraphrase table.

### Part 2: short talks, tours, events, procedures

Recurring answer-side words and concepts:

- volunteering and service: `training`, `commitment`, `availability`, `dedication`, `fundraising`, `feedback`, `publicity`, `guest speakers`
- movement and physical ability: `fitness`, `walking`, `survival techniques`, `running slowly`, `lack of confidence`
- food and care: `nutrition`, `food and diet`, `retired people`, `advice to visitors`
- events and logistics: `concerts`, `tickets`, `seats`, `local businesses`, `community groups`, `website`, `magazine`
- place and layout language: `map labels`, `farm shop`, `housing development`, `town centre`, `pottery class`, `lifeboat station`

High-value Part 2 topic clusters already visible across Books 18-20:

- Book 18 Test 01: `volunteer work`, `training`, `fundraising`, `litter collection`, `story club`, `first aid`
- Book 18 Test 02: `housing development`, `site choice`, `local facilities`, `workers`, `agricultural land`
- Book 18 Test 03: `mushroom picking`, `warnings`, `storage`, `rare species`, `recipes`
- Book 19 Test 01: `twinning association`, `host families`, `fundraising`, `map labels`
- Book 19 Test 02: `lifeboat volunteer work`, `donations`, `health assessment`, `teamwork`, `winter work`
- Book 19 Test 03: `festival workshops`, `reading advice`, `parents`, `librarians`, `audio books`
- Book 19 Test 04: `new runners`, `motivation`, `confidence`, `club members`, `marathon`
- Book 20 Test 01: `pottery`, `kilns`, `tools`, `aprons`, `jewellery`
- Book 20 Test 02: `town volunteers`, `concerts`, `website`, `publicity`, `feedback`

Teaching note:

- Part 2 often hides the answer inside `useful for`, `helpful for`, `best reason`, `main reason`, `role of volunteers`, and `tips` language.
- Learners need to match `speaker explanation` to a short category such as `memory`, `fitness`, `nutrition`, or `publicity`.

### Part 3: student discussion, opinions, and research

Recurring answer-side words and concepts:

- opinion and evaluation: `important`, `unfair`, `critical`, `motivating`, `dangerous`, `widespread`, `challenging`, `useful`
- evidence and research: `data`, `results`, `conclusions`, `scope`, `reliable facts`, `further investigation`, `statistics`
- society and behaviour: `career advice`, `job market`, `loneliness`, `mobile workforce`, `social media`, `urban design`
- academic project language: `experiment`, `recycling`, `food trends`, `human geography`, `future of work`
- classification tasks: `relevant`, `disappointing`, `financial support`, `stricter regulations`, `doubtful`

High-value Part 3 topic clusters already visible across Books 18-20:

- Book 18 Test 01: `jobs in fashion design`, `career advice`, `job market`, `retail information`
- Book 18 Test 02: `Laki eruption`, `historical observation`, `haze`, `society`
- Book 18 Test 03: `Luddites`, `future of work`, `job predictions`
- Book 19 Test 01: `food innovation`, `touch-sensitive labels`, `local products`, `packaging`, `food trends`
- Book 19 Test 02: `recycling footwear`, `research scope`, `trainers`, `re-selling`
- Book 19 Test 03: `Year 12 science experiment`, `diet`, `mice`, `animal experiments`
- Book 19 Test 04: `packing and caring for books`, `sentimental value`, `display`, `collectors`
- Book 20 Test 01: `loneliness`, `health risks`, `evolutionary theory`
- Book 20 Test 02: `human geography`, `population`, `health`, `economies`, `culture`, `poverty`

Teaching note:

- Part 3 answers are rarely single vocabulary matches.
- The real training target is `claim -> paraphrased opinion label`, for example:
  - `a whole range of areas of work` -> `more variety in the job market`
  - `a bit harsh` -> `unfair to them at times`
  - `it’s all kept very quiet` -> `people are not aware of it`

## Part 4 Direct Answer Bank (Books 18-20)

This is the easiest place to start a real `audioscript -> note answer` bank because the final answers are usually direct nouns, adjectives, or short technical words.

### Book 18

- Test 01 (`Elephant translocation`): `fences`, `family`, `helicopters`, `stress`, `sides`, `breathing`, `feet`, `employment`, `weapons`, `tourism`
- Test 02 (`Clothes and fashion`): `convenient`, `suits`, `tailor`, `profession`, `visible`, `strings`, `waists`, `perfume`, `image`, `handbag`
- Test 03 (`Soil / environmental systems`): `technical`, `cheap`, `thousands`, `identification`, `tracking`, `military`, `location`, `prediction`, `database`, `trust`
- Test 04 (`Victor Hugo`): `plot`, `poverty`, `Europe`, `poetry`, `drawings`, `furniture`, `lamps`, `harbour`, `children`, `relatives`

### Book 19

- Test 01 (`Céide Fields`): `walls`, `son`, `fuel`, `oxygen`, `rectangular`, `lamps`, `family`, `winter`, `soil`, `rain`
- Test 02 (`Tardigrades`): `move`, `short`, `discs`, `oxygen`, `tube`, `temperatures`, `protein`, `space`, `seaweed`, `endangered`
- Test 03 (`Soil / ecology`): `clothing`, `mouths`, `salt`, `toothpaste`, `fertilisers`, `nutrients`, `growth`, `weight`, `acid`, `society`
- Test 04 (`Environmental restoration`): `competition`, `food`, `disease`, `agriculture`, `maps`, `cattle`, `speed`, `monkeys`, `fishing`, `flooding`

### Book 20

- Test 01 (`Urban freight / city change`): `factories`, `dead`, `whale`, `apartments`, `park`, `art`, `beaches`, `ferry`, `bikes`, `drone`
- Test 02 (`Food trends / quinoa and related topics`): `photos`, `vegan`, `chefs`, `journalists`, `health`, `coffee`, `environment`, `reputation`, `price`, `soil`
- Test 03 (`Human factors / behaviour and design`): `adaptation`, `cognitive`, `desks`, `taps`, `blue`, `voice`, `pregnant`, `shoulders`, `police`, `temperature`
- Test 04 (`Urban wildlife / city ecology`): `rats`, `snakes`, `tourism`, `traffic`, `rain`, `poison`, `building`, `dog`, `noise`, `combination`

### Fast Teaching Use

If you want the first lesson packs from this bank, start here:

1. `Part 4 environment and conservation`
   - fences, weapons, tourism, soil, rain, disease, cattle, flooding, snakes, poison
2. `Part 4 people, objects, and the body`
   - shoulders, voice, pregnant, children, relatives, family, feet, breathing
3. `Part 4 city and design vocabulary`
   - apartments, park, art, ferry, bikes, drone, traffic, building, noise
4. `Part 2-3 opinion language`
   - commitment, availability, confidence, motivation, unfair, useful, dangerous, relevant

## Source Pages Used For This Parts 2-4 Reset

Practice pages checked:

- `https://ieltstrainingonline.com/practice-cam-18-listening-test-01-with-answer-and-audioscripts/`
- `https://ieltstrainingonline.com/practice-cam-18-listening-test-02-with-answer-and-audioscripts/`
- `https://ieltstrainingonline.com/practice-cam-18-listening-test-03-with-answer-and-audioscripts/`
- `https://ieltstrainingonline.com/practice-cam-18-listening-test-04-with-answer-and-audioscripts/`
- `https://ieltstrainingonline.com/practice-cam-19-listening-test-01-with-answer-and-audioscripts/`
- `https://ieltstrainingonline.com/practice-cam-19-listening-test-02-with-answer-and-audioscripts/`
- `https://ieltstrainingonline.com/practice-cam-19-listening-test-03-with-answer-and-audioscripts/`
- `https://ieltstrainingonline.com/practice-cam-19-listening-test-04-with-answer-and-audioscripts/`
- `https://ieltstrainingonline.com/practice-cam-20-listening-test-01-with-answer-and-audioscripts/`
- `https://ieltstrainingonline.com/practice-cam-20-listening-test-02-with-answer-and-audioscripts/`
- `https://ieltstrainingonline.com/practice-cam-20-listening-test-03-with-answer-and-audioscripts/`
- `https://ieltstrainingonline.com/practice-cam-20-listening-test-04-with-answer-and-audioscripts/`

---

## What This Corpus Should Eventually Produce

For every book, test, and section, the final corpus should support:

- transcript reading drills
- paraphrase matching drills
- Thai explanation cards
- question-type tags such as form, notes, table, map, multiple choice
- a bank of `IELTS listening paraphrase patterns`

Examples of reusable pattern groups:

- `sense of` -> `feeling of`
- `create` -> `make`
- `no charge` -> `free of charge`
- `covers` -> `area`
- `one at a time` -> `alone`
- `if you like` -> `be keen on`

## Best Build Order

To make this manageable and high quality, the best order is:

1. Part 1 only across Books 18-20
2. Part 2 map-labeling and short talks
3. Part 3 discussion-style paraphrase chains
4. Part 4 lecture-style academic paraphrase bank

## Recommendation

If this becomes a product feature, do not show learners only `answer = transcript word`.
Instead show:

- transcript phrase
- question wording
- hidden paraphrase bridge
- Thai explanation
- one extra example sentence

That is what will actually train the listening skill.
