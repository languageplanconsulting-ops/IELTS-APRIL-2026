import type { WritingTask2Prompt } from './writingTask2Data'

type GeneralTrainingPrompt = WritingTask2Prompt & { track: 'general-training' }

const generalTrainingPrompt = <T extends GeneralTrainingPrompt>(prompt: T): WritingTask2Prompt => prompt

const META = 'General Training · IELTS-style practice'

export const GENERAL_TRAINING_TASK2_PROMPTS: WritingTask2Prompt[] = [
  generalTrainingPrompt({
    id: 'gt-t2-twe-1',
    number: 1,
    typeId: 'to-what-extent',
    track: 'general-training',
    title: 'Flexible Working Hours',
    questionText:
      'Some people believe that all employers should allow staff to choose when they start and finish work. Do you agree or disagree?',
    meta: META,
    paragraphs: [
      {
        role: 'intro',
        text: 'It is widely acknowledged that flexible working plays an important role in modern employment. However, some employers believe that fixed schedules are necessary for a business to operate smoothly. I believe that most workers should be allowed to choose their hours within reasonable limits, and the reasons will be elaborated in this essay.',
        thai: 'เป็นที่ยอมรับกันอย่างกว้างขวางว่าการทำงานแบบยืดหยุ่นมีบทบาทสำคัญในการจ้างงานยุคใหม่ อย่างไรก็ตาม นายจ้างบางรายเชื่อว่าตารางเวลาที่แน่นอนตายตัวมีความจำเป็นสำหรับธุรกิจในการดำเนินงานอย่างราบรื่น ผมเชื่อว่าคนทำงานส่วนใหญ่ควรได้รับอนุญาตให้เลือกชั่วโมงทำงานของตนเองภายในขอบเขตที่สมเหตุสมผล และเหตุผลจะได้รับการอธิบายอย่างละเอียดในเรียงความนี้'
      },
      {
        role: 'body1',
        text: 'To begin with, it might seem reasonable for some to claim that fixed schedules help managers organise staff and customer services without confusion. To explain it simply, this is because every worker is present at known times, so teams can communicate and urgent duties remain covered. For example, a busy shop needs enough employees at lunchtime, while complete freedom could leave customers waiting without help. From this perspective, it is understandable why some people would think that employers should control working times in hospitals, shops and other public services.',
        thai: 'เริ่มต้นด้วย อาจดูสมเหตุสมผลสำหรับบางคนที่จะอ้างว่าตารางเวลาที่แน่นอนตายตัวช่วยให้ผู้จัดการจัดระเบียบพนักงานและการบริการลูกค้าได้โดยไม่สับสน หากอธิบายง่าย ๆ นี่เป็นเพราะว่าพนักงานทุกคนอยู่ในเวลาที่ทราบแน่ชัด ทำให้ทีมงานสามารถสื่อสารกันได้และหน้าที่เร่งด่วนยังคงมีคนดูแล ตัวอย่างเช่น ร้านค้าที่พลุกพล่านต้องการพนักงานเพียงพอในช่วงเวลาอาหารกลางวัน ในขณะที่เสรีภาพอย่างสมบูรณ์อาจทำให้ลูกค้าต้องรอโดยไม่มีคนช่วยเหลือ จากมุมมองนี้ จึงเข้าใจได้ว่าทำไมบางคนจึงคิดว่านายจ้างควรควบคุมเวลาทำงานในโรงพยาบาล ร้านค้า และบริการสาธารณะอื่น ๆ'
      },
      {
        role: 'body2',
        text: 'However, I would personally argue that controlled flexibility helps workers manage family duties while still meeting their employer’s needs. To put it simply, this is due to the fact that an earlier or later shift can fit around school runs or medical appointments, reducing stress and missed work. For instance, an office worker could start at seven, collect a child after school and attend meetings during agreed core hours. In this respect, it is evident that limited flexibility can improve staff wellbeing without harming operations when managers set clear rules and cover.',
        thai: 'อย่างไรก็ตาม ผมขอโต้แย้งเป็นการส่วนตัวว่าความยืดหยุ่นที่มีการควบคุมช่วยให้คนทำงานสามารถจัดการภาระหน้าที่ในครอบครัวได้ในขณะที่ยังคงตอบสนองความต้องการของนายจ้าง หากพูดง่าย ๆ นี่เป็นเพราะข้อเท็จจริงที่ว่ากะการทำงานที่เริ่มเร็วขึ้นหรือช้าลงสามารถปรับให้เข้ากับการไปรับส่งบุตรที่โรงเรียนหรือการนัดหมายทางการแพทย์ ซึ่งช่วยลดความเครียดและการขาดงาน ยกตัวอย่างเช่น พนักงานออฟฟิศอาจเริ่มงานตอนเจ็ดโมง ไปรับบุตรหลังเลิกเรียน แล้วเข้าร่วมประชุมในช่วงเวลาหลักที่ตกลงกันไว้ ในแง่นี้ เห็นได้ชัดว่าความยืดหยุ่นที่จำกัดสามารถปรับปรุงความเป็นอยู่ที่ดีของพนักงานได้โดยไม่กระทบต่อการดำเนินงาน เมื่อผู้จัดการกำหนดกฎเกณฑ์และการดูแลที่ชัดเจน'
      },
      {
        role: 'conclusion',
        text: 'In conclusion, although it is undeniable that fixed attendance is necessary for some duties and busy periods, I am of the opinion that employers should offer controlled flexibility whenever the nature of the job allows it.',
        thai: 'สรุปแล้ว แม้ว่าจะปฏิเสธไม่ได้ว่าการเข้างานตามเวลาที่แน่นอนมีความจำเป็นสำหรับหน้าที่บางอย่างและช่วงเวลาที่ยุ่ง ผมมีความเห็นว่านายจ้างควรเสนอความยืดหยุ่นที่มีการควบคุมเมื่อใดก็ตามที่ลักษณะของงานเอื้ออำนวย'
      }
    ],
    vocab: [
      { word: "flexible working", thaiMeaning: "การทำงานแบบยืดหยุ่น" },
      { word: "fixed schedule", thaiMeaning: "ตารางเวลาตายตัว" },
      { word: "reasonable limits", thaiMeaning: "ขอบเขตที่สมเหตุสมผล" },
      { word: "family duties", thaiMeaning: "หน้าที่ในครอบครัว" },
      { word: "core hours", thaiMeaning: "ช่วงเวลาหลักที่ต้องทำงาน" },
      { word: "staff wellbeing", thaiMeaning: "ความเป็นอยู่ที่ดีของพนักงาน" },
      { word: "nature of the job", thaiMeaning: "ลักษณะของงาน" },
      { word: "modern employment", thaiMeaning: "การจ้างงานสมัยใหม่" },
      { word: "operate smoothly", thaiMeaning: "ดำเนินงานได้อย่างราบรื่น" },
      { word: "organise staff", thaiMeaning: "จัดสรรพนักงาน" },
      { word: "customer services", thaiMeaning: "บริการลูกค้า" },
      { word: "without confusion", thaiMeaning: "โดยไม่เกิดความสับสน" },
      { word: "urgent duties remain covered", thaiMeaning: "งานเร่งด่วนยังมีคนรับผิดชอบ" },
      { word: "leave customers waiting", thaiMeaning: "ปล่อยให้ลูกค้ารอ" },
      { word: "public services", thaiMeaning: "บริการสาธารณะ" },
      { word: "controlled flexibility", thaiMeaning: "ความยืดหยุ่นแบบมีกรอบ" },
      { word: "earlier or later shift", thaiMeaning: "กะเช้าหรือกะดึกกว่าปกติ" },
      { word: "school runs", thaiMeaning: "การไปรับ-ส่งลูกที่โรงเรียน" },
      { word: "medical appointments", thaiMeaning: "นัดหมายพบแพทย์" },
      { word: "reducing stress", thaiMeaning: "การลดความเครียด" },
      { word: "missed work", thaiMeaning: "การขาดงาน" },
      { word: "office worker", thaiMeaning: "พนักงานออฟฟิศ" },
      { word: "collect a child after school", thaiMeaning: "ไปรับลูกหลังเลิกเรียน" },
      { word: "attend meetings", thaiMeaning: "เข้าประชุม" },
      { word: "without harming operations", thaiMeaning: "โดยไม่กระทบการดำเนินงาน" },
      { word: "set clear rules", thaiMeaning: "กำหนดกฎที่ชัดเจน" },
      { word: "fixed attendance", thaiMeaning: "การเข้างานตามเวลาตายตัว" },
      { word: "busy periods", thaiMeaning: "ช่วงเวลาที่งานยุ่ง" }
    ]
  }),
  generalTrainingPrompt({
    id: 'gt-t2-twe-2',
    number: 2,
    typeId: 'to-what-extent',
    track: 'general-training',
    title: 'Free Local Bus Travel',
    questionText:
      'Some people think that local bus travel should be free for everyone. Do you agree or disagree?',
    meta: META,
    paragraphs: [
      {
        role: 'intro',
        text: 'It is widely acknowledged that public transport plays an important role in everyday travel. However, making every local bus journey free could place a heavy cost on public budgets. I believe that free bus travel should be offered to people who need it most rather than to all passengers, and the reasons will be elaborated in this essay.',
        thai: 'เป็นที่ยอมรับกันอย่างกว้างขวางว่าระบบขนส่งสาธารณะมีบทบาทสำคัญในการเดินทางในชีวิตประจำวัน อย่างไรก็ตาม การทำให้การเดินทางด้วยรถบัสท้องถิ่นฟรีทุกครั้งอาจสร้างภาระค่าใช้จ่ายมหาศาลต่องบประมาณสาธารณะ ผมเชื่อว่าการเดินทางด้วยรถบัสฟรีควรมอบให้แก่ผู้ที่ต้องการมากที่สุด มากกว่าที่จะให้แก่ผู้โดยสารทุกคน และเหตุผลจะได้รับการอธิบายอย่างละเอียดในเรียงความนี้'
      },
      {
        role: 'body1',
        text: 'To begin with, it might seem reasonable for some to claim that free buses would make travel fairer and reduce cars on crowded roads. To explain it simply, this is because low-income residents could reach work or appointments without fares, while drivers would have a reason to leave cars at home. For example, a family might take the bus into town if four return tickets added nothing to the day’s cost. From this perspective, it is understandable why some people would think that free travel could improve community access while creating cleaner and safer town centres.',
        thai: 'เริ่มต้นด้วย อาจดูสมเหตุสมผลสำหรับบางคนที่จะอ้างว่ารถบัสฟรีจะทำให้การเดินทางเป็นธรรมมากขึ้นและลดจำนวนรถยนต์บนถนนที่แออัด หากอธิบายง่าย ๆ นี่เป็นเพราะว่าผู้อยู่อาศัยที่มีรายได้น้อยสามารถเดินทางไปทำงานหรือไปนัดหมายได้โดยไม่ต้องเสียค่าโดยสาร ในขณะที่ผู้ขับรถก็จะมีเหตุผลที่จะทิ้งรถไว้ที่บ้าน ตัวอย่างเช่น ครอบครัวหนึ่งอาจนั่งรถบัสเข้าเมืองหากตั๋วไปกลับสี่ใบไม่เพิ่มค่าใช้จ่ายให้กับวันนั้นเลย จากมุมมองนี้ จึงเข้าใจได้ว่าทำไมบางคนจึงคิดว่าการเดินทางฟรีสามารถปรับปรุงการเข้าถึงชุมชนได้ ในขณะเดียวกันก็สร้างใจกลางเมืองที่สะอาดและปลอดภัยยิ่งขึ้น'
      },
      {
        role: 'body2',
        text: 'However, I would personally argue that free travel should be limited to groups who genuinely need support rather than every passenger. To put it simply, this is due to the fact that drivers, fuel and repairs require reliable funding, while a fully free system could mean higher taxes or fewer services. For instance, a council could give free passes to children, older residents and low-income workers, while other adults pay an affordable fare. In this respect, it is evident that targeted support can protect vulnerable passengers without removing the income needed for safe and dependable routes.',
        thai: 'อย่างไรก็ตาม ผมขอโต้แย้งเป็นการส่วนตัวว่าการเดินทางฟรีควรจำกัดเฉพาะกลุ่มที่ต้องการความช่วยเหลืออย่างแท้จริง มากกว่าที่จะให้แก่ผู้โดยสารทุกคน หากพูดง่าย ๆ นี่เป็นเพราะข้อเท็จจริงที่ว่าคนขับรถ เชื้อเพลิง และการซ่อมบำรุงต้องการเงินทุนที่เชื่อถือได้ ในขณะที่ระบบที่ฟรีทั้งหมดอาจหมายถึงภาษีที่สูงขึ้นหรือบริการที่น้อยลง ยกตัวอย่างเช่น สภาท้องถิ่นอาจมอบบัตรโดยสารฟรีให้แก่เด็ก ผู้สูงอายุ และคนทำงานที่มีรายได้น้อย ในขณะที่ผู้ใหญ่คนอื่น ๆ จ่ายค่าโดยสารในราคาที่เอื้อมถึงได้ ในแง่นี้ เห็นได้ชัดว่าการสนับสนุนแบบเจาะจงกลุ่มสามารถปกป้องผู้โดยสารที่เปราะบางได้โดยไม่ตัดรายได้ที่จำเป็นต่อเส้นทางที่ปลอดภัยและเชื่อถือได้'
      },
      {
        role: 'conclusion',
        text: 'In conclusion, although it is undeniable that free buses can improve access and reduce car use, I am of the opinion that free travel should target selected groups while other passengers pay reasonable fares.',
        thai: 'สรุปแล้ว แม้ว่าจะปฏิเสธไม่ได้ว่ารถบัสฟรีสามารถปรับปรุงการเข้าถึงและลดการใช้รถยนต์ได้ ผมมีความเห็นว่าการเดินทางฟรีควรมุ่งเป้าไปที่กลุ่มที่ถูกเลือกไว้ ในขณะที่ผู้โดยสารคนอื่น ๆ จ่ายค่าโดยสารในราคาที่สมเหตุสมผล'
      }
    ],
    vocab: [
      { word: "public transport", thaiMeaning: "ขนส่งสาธารณะ" },
      { word: "public budget", thaiMeaning: "งบประมาณภาครัฐ" },
      { word: "low-income worker", thaiMeaning: "แรงงานรายได้น้อย" },
      { word: "town centre", thaiMeaning: "ใจกลางเมือง" },
      { word: "free pass", thaiMeaning: "บัตรโดยสารฟรี" },
      { word: "targeted support", thaiMeaning: "ความช่วยเหลือแบบเจาะจง" },
      { word: "everyday travel", thaiMeaning: "การเดินทางในชีวิตประจำวัน" },
      { word: "heavy cost", thaiMeaning: "ต้นทุนที่สูงมาก" },
      { word: "free bus travel", thaiMeaning: "การนั่งรถเมล์ฟรี" },
      { word: "need it most", thaiMeaning: "ต้องการมากที่สุด" },
      { word: "crowded roads", thaiMeaning: "ถนนที่แออัด" },
      { word: "low-income residents", thaiMeaning: "ผู้อยู่อาศัยรายได้น้อย" },
      { word: "leave cars at home", thaiMeaning: "ทิ้งรถไว้ที่บ้าน" },
      { word: "return tickets", thaiMeaning: "ตั๋วไป-กลับ" },
      { word: "community access", thaiMeaning: "การเข้าถึงชุมชน" },
      { word: "genuinely need support", thaiMeaning: "ต้องการความช่วยเหลือจริง ๆ" },
      { word: "reliable funding", thaiMeaning: "แหล่งเงินทุนที่มั่นคง" },
      { word: "fully free system", thaiMeaning: "ระบบฟรีทั้งหมด" },
      { word: "higher taxes", thaiMeaning: "ภาษีที่สูงขึ้น" },
      { word: "fewer services", thaiMeaning: "บริการที่ลดลง" },
      { word: "older residents", thaiMeaning: "ผู้อยู่อาศัยสูงอายุ" },
      { word: "affordable fare", thaiMeaning: "ค่าโดยสารที่จ่ายไหว" },
      { word: "vulnerable passengers", thaiMeaning: "ผู้โดยสารกลุ่มเปราะบาง" },
      { word: "dependable routes", thaiMeaning: "เส้นทางที่เชื่อถือได้" },
      { word: "reduce car use", thaiMeaning: "ลดการใช้รถยนต์" },
      { word: "selected groups", thaiMeaning: "กลุ่มที่คัดเลือกแล้ว" },
      { word: "reasonable fares", thaiMeaning: "ค่าโดยสารที่สมเหตุสมผล" },
      { word: "make travel fairer", thaiMeaning: "ทำให้การเดินทางยุติธรรมขึ้น" }
    ]
  }),
  generalTrainingPrompt({
    id: 'gt-t2-twe-3',
    number: 3,
    typeId: 'to-what-extent',
    track: 'general-training',
    title: 'Children Helping at Home',
    questionText:
      'Some people believe that children should be required to help with household tasks every day. Do you agree or disagree?',
    meta: META,
    paragraphs: [
      {
        role: 'intro',
        text: 'It is widely acknowledged that household work plays an important role in a child’s development. However, some parents feel that daily chores take time away from study and rest. I believe that children should complete suitable household tasks each day, and the reasons will be elaborated in this essay.',
        thai: 'เป็นที่ยอมรับกันอย่างกว้างขวางว่างานบ้านมีบทบาทสำคัญต่อพัฒนาการของเด็ก อย่างไรก็ตาม พ่อแม่บางคนรู้สึกว่างานบ้านประจำวันแย่งเวลาที่ควรใช้ในการเรียนและการพักผ่อนไป ผมเชื่อว่าเด็ก ๆ ควรทำงานบ้านที่เหมาะสมทุกวัน และเหตุผลจะได้รับการอธิบายอย่างละเอียดในเรียงความนี้'
      },
      {
        role: 'body1',
        text: 'To begin with, it might seem reasonable for some to claim that daily chores take valuable time from schoolwork and the rest children need. To explain it simply, this is because pupils already spend hours in class and doing homework, so many duties may reduce their concentration. For example, a teenager preparing for an examination could struggle to revise if expected to cook, clean and care for younger children every evening. From this perspective, it is understandable why some people would think that household tasks should be optional or mainly completed by adults.',
        thai: 'เริ่มต้นด้วย อาจดูสมเหตุสมผลสำหรับบางคนที่จะอ้างว่างานบ้านประจำวันแย่งเวลาอันมีค่าจากการเรียนและการพักผ่อนที่เด็ก ๆ ต้องการ หากอธิบายง่าย ๆ นี่เป็นเพราะว่านักเรียนใช้เวลาหลายชั่วโมงในห้องเรียนและทำการบ้านอยู่แล้ว ดังนั้นหน้าที่ต่าง ๆ อาจลดสมาธิของพวกเขาลง ตัวอย่างเช่น วัยรุ่นที่กำลังเตรียมสอบอาจทบทวนบทเรียนได้ยากหากถูกคาดหวังให้ทำอาหาร ทำความสะอาด และดูแลน้อง ๆ ทุกเย็น จากมุมมองนี้ จึงเข้าใจได้ว่าทำไมบางคนจึงคิดว่างานบ้านควรเป็นทางเลือกหรือให้ผู้ใหญ่เป็นผู้ทำเป็นหลัก'
      },
      {
        role: 'body2',
        text: 'However, I would personally argue that short daily chores teach responsibility and useful life skills without creating an unfair burden. To put it simply, this is due to the fact that making a bed or feeding a pet shows that a comfortable home depends on shared effort. For instance, a teenager who prepares one family meal can learn cooking and planning, while a younger child builds independence by putting away toys. In this respect, it is evident that brief age-appropriate help develops good habits when dangerous or time-consuming duties remain with adults.',
        thai: 'อย่างไรก็ตาม ผมขอโต้แย้งเป็นการส่วนตัวว่างานบ้านสั้น ๆ ประจำวันสอนความรับผิดชอบและทักษะชีวิตที่มีประโยชน์โดยไม่สร้างภาระที่ไม่เป็นธรรม หากพูดง่าย ๆ นี่เป็นเพราะข้อเท็จจริงที่ว่าการจัดเตียงหรือการให้อาหารสัตว์เลี้ยงแสดงให้เห็นว่าบ้านที่สะดวกสบายขึ้นอยู่กับความพยายามร่วมกัน ยกตัวอย่างเช่น วัยรุ่นที่เตรียมอาหารมื้อหนึ่งให้ครอบครัวสามารถเรียนรู้การทำอาหารและการวางแผน ในขณะที่เด็กเล็กสร้างความเป็นอิสระด้วยการเก็บของเล่นเข้าที่ ในแง่นี้ เห็นได้ชัดว่าความช่วยเหลือสั้น ๆ ที่เหมาะสมกับวัยช่วยสร้างนิสัยที่ดี เมื่อหน้าที่ที่อันตรายหรือใช้เวลานานยังคงเป็นของผู้ใหญ่'
      },
      {
        role: 'conclusion',
        text: 'In conclusion, although it is undeniable that excessive housework can interfere with study and rest, I am of the opinion that children should complete safe daily tasks suited to their age and available time.',
        thai: 'สรุปแล้ว แม้ว่าจะปฏิเสธไม่ได้ว่างานบ้านที่มากเกินไปสามารถรบกวนการเรียนและการพักผ่อนได้ ผมมีความเห็นว่าเด็ก ๆ ควรทำงานประจำวันที่ปลอดภัยและเหมาะสมกับวัยและเวลาว่างที่มี'
      }
    ],
    vocab: [
      { word: "daily chore", thaiMeaning: "งานบ้านประจำวัน" },
      { word: "shared effort", thaiMeaning: "ความร่วมแรงร่วมใจ" },
      { word: "household work", thaiMeaning: "งานบ้าน" },
      { word: "child’s development", thaiMeaning: "พัฒนาการของเด็ก" },
      { word: "valuable time", thaiMeaning: "เวลาอันมีค่า" },
      { word: "schoolwork and the rest", thaiMeaning: "การเรียนและการพักผ่อน" },
      { word: "reduce their concentration", thaiMeaning: "ลดสมาธิของพวกเขา" },
      { word: "preparing for an examination", thaiMeaning: "การเตรียมสอบ" },
      { word: "struggle to revise", thaiMeaning: "ทบทวนบทเรียนได้ยาก" },
      { word: "younger children", thaiMeaning: "เด็กที่อายุน้อยกว่า" },
      { word: "household tasks", thaiMeaning: "งานในบ้าน" },
      { word: "teach responsibility", thaiMeaning: "สอนความรับผิดชอบ" },
      { word: "useful life skills", thaiMeaning: "ทักษะชีวิตที่เป็นประโยชน์" },
      { word: "unfair burden", thaiMeaning: "ภาระที่ไม่เป็นธรรม" },
      { word: "making a bed", thaiMeaning: "การเก็บที่นอน" },
      { word: "feeding a pet", thaiMeaning: "การให้อาหารสัตว์เลี้ยง" },
      { word: "comfortable home", thaiMeaning: "บ้านที่น่าอยู่" },
      { word: "family meal", thaiMeaning: "มื้ออาหารของครอบครัว" },
      { word: "learn cooking and planning", thaiMeaning: "เรียนรู้การทำอาหารและการวางแผน" },
      { word: "builds independence", thaiMeaning: "สร้างความเป็นอิสระ" },
      { word: "putting away toys", thaiMeaning: "เก็บของเล่นเข้าที่" },
      { word: "brief age-appropriate help", thaiMeaning: "การช่วยงานสั้น ๆ ที่เหมาะกับวัย" },
      { word: "develops good habits", thaiMeaning: "พัฒนานิสัยที่ดี" },
      { word: "time-consuming duties", thaiMeaning: "งานที่ใช้เวลามาก" },
      { word: "excessive housework", thaiMeaning: "งานบ้านที่มากเกินไป" },
      { word: "interfere with study", thaiMeaning: "รบกวนการเรียน" },
      { word: "safe daily tasks", thaiMeaning: "งานประจำวันที่ปลอดภัย" },
      { word: "suited to their age", thaiMeaning: "เหมาะกับอายุของพวกเขา" }
    ]
  }),
  generalTrainingPrompt({
    id: 'gt-t2-twe-4',
    number: 4,
    typeId: 'to-what-extent',
    track: 'general-training',
    title: 'Online Shopping and Local Stores',
    questionText:
      'Some people think that the growth of online shopping is harmful to local shops and communities. Do you agree or disagree?',
    meta: META,
    paragraphs: [
      {
        role: 'intro',
        text: 'It is widely acknowledged that local shopping plays an important role in community life. However, online stores offer a level of convenience and choice that many customers value. I believe that the growth of online shopping can harm local areas unless consumers and businesses use it in a balanced way, and the reasons will be elaborated in this essay.',
        thai: 'เป็นที่ยอมรับกันอย่างกว้างขวางว่าการช้อปปิ้งในท้องถิ่นมีบทบาทสำคัญต่อชีวิตชุมชน อย่างไรก็ตาม ร้านค้าออนไลน์เสนอความสะดวกสบายและทางเลือกในระดับที่ลูกค้าจำนวนมากให้คุณค่า ผมเชื่อว่าการเติบโตของการช้อปปิ้งออนไลน์สามารถสร้างความเสียหายต่อพื้นที่ท้องถิ่นได้ เว้นแต่ผู้บริโภคและธุรกิจต่าง ๆ จะใช้มันอย่างสมดุล และเหตุผลจะได้รับการอธิบายอย่างละเอียดในเรียงความนี้'
      },
      {
        role: 'body1',
        text: 'To begin with, it might seem reasonable for some to claim that online shopping gives residents wider choice, lower prices and convenient home delivery. To explain it simply, this is because people with limited mobility or few nearby stores can buy essential items without a difficult journey. For example, an older resident can order heavy supplies, while a local producer can use a website to reach customers outside town. From this perspective, it is understandable why some people would think that internet shopping improves access and creates opportunities for customers and businesses.',
        thai: 'เริ่มต้นด้วย อาจดูสมเหตุสมผลสำหรับบางคนที่จะอ้างว่าการช้อปปิ้งออนไลน์มอบทางเลือกที่กว้างขึ้น ราคาที่ถูกลง และการจัดส่งถึงบ้านที่สะดวกสบายให้แก่ผู้อยู่อาศัย หากอธิบายง่าย ๆ นี่เป็นเพราะว่าผู้ที่มีการเคลื่อนไหวจำกัดหรือมีร้านค้าใกล้เคียงน้อยสามารถซื้อสิ่งของจำเป็นได้โดยไม่ต้องเดินทางลำบาก ตัวอย่างเช่น ผู้อยู่อาศัยสูงอายุสามารถสั่งซื้อของหนักได้ ในขณะที่ผู้ผลิตในท้องถิ่นสามารถใช้เว็บไซต์เพื่อเข้าถึงลูกค้านอกเมืองได้ จากมุมมองนี้ จึงเข้าใจได้ว่าทำไมบางคนจึงคิดว่าการช้อปปิ้งทางอินเทอร์เน็ตช่วยปรับปรุงการเข้าถึงและสร้างโอกาสให้แก่ลูกค้าและธุรกิจ'
      },
      {
        role: 'body2',
        text: 'However, I would personally argue that dependence on large online sellers harms local shops, jobs and everyday social contact. To put it simply, this is due to the fact that independent retailers cannot always match internet prices while paying rent, employing staff and giving personal advice. For instance, if residents order every book and gift online, nearby stores may close, leaving empty streets and nowhere to buy something urgently. In this respect, it is evident that consumers should balance online convenience with support for local markets, cafés and specialist stores.',
        thai: 'อย่างไรก็ตาม ผมขอโต้แย้งเป็นการส่วนตัวว่าการพึ่งพาผู้ขายออนไลน์รายใหญ่สร้างความเสียหายต่อร้านค้าท้องถิ่น งาน และการติดต่อทางสังคมในชีวิตประจำวัน หากพูดง่าย ๆ นี่เป็นเพราะข้อเท็จจริงที่ว่าผู้ค้าปลีกอิสระไม่สามารถแข่งขันด้านราคากับอินเทอร์เน็ตได้เสมอไป ในขณะที่ยังต้องจ่ายค่าเช่า จ้างพนักงาน และให้คำแนะนำส่วนตัว ยกตัวอย่างเช่น หากผู้อยู่อาศัยสั่งซื้อหนังสือและของขวัญทุกชิ้นทางออนไลน์ ร้านค้าใกล้เคียงอาจต้องปิดตัวลง ทำให้เกิดถนนที่ว่างเปล่าและไม่มีที่ให้ซื้อของที่จำเป็นเร่งด่วน ในแง่นี้ เห็นได้ชัดว่าผู้บริโภคควรสร้างสมดุลระหว่างความสะดวกสบายออนไลน์กับการสนับสนุนตลาด ร้านกาแฟ และร้านค้าเฉพาะทางในท้องถิ่น'
      },
      {
        role: 'conclusion',
        text: 'In conclusion, although it is undeniable that online shopping offers convenience and wider choice, I am of the opinion that its uncontrolled growth damages local businesses and community life when it replaces most face-to-face trade.',
        thai: 'สรุปแล้ว แม้ว่าจะปฏิเสธไม่ได้ว่าการช้อปปิ้งออนไลน์มอบความสะดวกสบายและทางเลือกที่กว้างขึ้น ผมมีความเห็นว่าการเติบโตที่ไร้การควบคุมของมันสร้างความเสียหายต่อธุรกิจท้องถิ่นและชีวิตชุมชน เมื่อมันเข้ามาแทนที่การค้าแบบเห็นหน้ากันส่วนใหญ่'
      }
    ],
    vocab: [
      { word: "community life", thaiMeaning: "ชีวิตในชุมชน" },
      { word: "personal advice", thaiMeaning: "คำแนะนำเฉพาะบุคคล" },
      { word: "limited mobility", thaiMeaning: "ข้อจำกัดในการเคลื่อนไหว" },
      { word: "specialist store", thaiMeaning: "ร้านค้าเฉพาะทาง" },
      { word: "face-to-face trade", thaiMeaning: "การค้าขายแบบพบหน้า" },
      { word: "local shopping", thaiMeaning: "การซื้อของในท้องถิ่น" },
      { word: "online stores", thaiMeaning: "ร้านค้าออนไลน์" },
      { word: "convenience and choice", thaiMeaning: "ความสะดวกและตัวเลือก" },
      { word: "online shopping", thaiMeaning: "การซื้อของออนไลน์" },
      { word: "local areas", thaiMeaning: "พื้นที่ท้องถิ่น" },
      { word: "balanced way", thaiMeaning: "วิธีที่สมดุล" },
      { word: "wider choice", thaiMeaning: "ตัวเลือกที่หลากหลายกว่า" },
      { word: "lower prices", thaiMeaning: "ราคาที่ถูกกว่า" },
      { word: "convenient home delivery", thaiMeaning: "การจัดส่งถึงบ้านที่สะดวก" },
      { word: "nearby stores", thaiMeaning: "ร้านค้าใกล้เคียง" },
      { word: "essential items", thaiMeaning: "ของจำเป็น" },
      { word: "difficult journey", thaiMeaning: "การเดินทางที่ยากลำบาก" },
      { word: "older resident", thaiMeaning: "ผู้อยู่อาศัยสูงอายุ" },
      { word: "heavy supplies", thaiMeaning: "ของใช้หนัก ๆ" },
      { word: "local producer", thaiMeaning: "ผู้ผลิตในท้องถิ่น" },
      { word: "internet shopping", thaiMeaning: "การซื้อของผ่านอินเทอร์เน็ต" },
      { word: "large online sellers", thaiMeaning: "ผู้ขายออนไลน์รายใหญ่" },
      { word: "everyday social contact", thaiMeaning: "การติดต่อทางสังคมในชีวิตประจำวัน" },
      { word: "independent retailers", thaiMeaning: "ร้านค้าปลีกอิสระ" },
      { word: "internet prices", thaiMeaning: "ราคาบนอินเทอร์เน็ต" },
      { word: "empty streets", thaiMeaning: "ถนนที่ว่างเปล่า" },
      { word: "online convenience", thaiMeaning: "ความสะดวกของการซื้อออนไลน์" },
      { word: "local businesses", thaiMeaning: "ธุรกิจท้องถิ่น" }
    ]
  }),

  generalTrainingPrompt({
    id: 'gt-t2-dq-1',
    number: 1,
    typeId: 'double-question',
    track: 'general-training',
    title: 'Moving Away from Family',
    questionText:
      'Many adults move far away from their families to find work. Why does this happen? How can people maintain strong family relationships when they live far apart?',
    meta: META,
    paragraphs: [
      {
        role: 'intro',
        text: 'It has been widely argued that many working adults move far from their families because suitable employment is often available in another town or region. This essay will elaborate on the reasons for this movement before explaining how people can maintain strong family relationships across long distances.',
        thai: 'มีการถกเถียงกันอย่างกว้างขวางว่าผู้ใหญ่วัยทำงานจำนวนมากย้ายออกไปไกลจากครอบครัวของตน เพราะว่างานที่เหมาะสมมักจะมีอยู่ในเมืองหรือภูมิภาคอื่น เรียงความนี้จะอธิบายอย่างละเอียดถึงเหตุผลของการย้ายถิ่นนี้ ก่อนที่จะอธิบายว่าผู้คนสามารถรักษาความสัมพันธ์ในครอบครัวที่แน่นแฟ้นในระยะทางไกลได้อย่างไร'
      },
      {
        role: 'body1',
        text: 'To begin with, there are a number of reasons associated with adults moving away from family for work. Firstly, large cities usually offer more jobs than small towns. To explain it simply, this is because people may need to relocate to use their qualifications, earn a stable income or accept a promotion. For example, a trained nurse might move because the local clinic has no position while a city hospital needs staff. Another reason is that affordable housing may be easier to find elsewhere. To illustrate, a couple may work in a smaller city where they can rent a home, although their parents remain in an expensive capital.',
        thai: 'เริ่มต้นด้วย มีเหตุผลหลายประการที่เกี่ยวข้องกับการที่ผู้ใหญ่ย้ายออกจากครอบครัวเพื่อไปทำงาน ประการแรก เมืองใหญ่มักเสนองานมากกว่าเมืองเล็ก หากอธิบายง่าย ๆ นี่เป็นเพราะว่าผู้คนอาจจำเป็นต้องย้ายถิ่นฐานเพื่อใช้คุณวุฒิของตน หารายได้ที่มั่นคง หรือรับตำแหน่งที่สูงขึ้น ตัวอย่างเช่น พยาบาลที่ผ่านการฝึกอบรมอาจต้องย้ายเพราะคลินิกในท้องถิ่นไม่มีตำแหน่งงานว่าง ในขณะที่โรงพยาบาลในเมืองต้องการพนักงาน อีกเหตุผลหนึ่งคือที่อยู่อาศัยราคาย่อมเยาอาจหาได้ง่ายกว่าในที่อื่น ยกตัวอย่างเช่น คู่สามีภรรยาคู่หนึ่งอาจทำงานในเมืองเล็กที่พวกเขาสามารถเช่าบ้านได้ แม้ว่าพ่อแม่ของพวกเขายังคงอยู่ในเมืองหลวงที่มีค่าครองชีพแพง'
      },
      {
        role: 'body2',
        text: 'In terms of the solutions, I would argue that there are two main solutions. The first solution is that relatives should arrange a weekly video call and share short messages about ordinary events instead of speaking only during emergencies. For example, grandparents can watch a child open a birthday gift online and continue feeling involved in everyday life. The second solution is that family members should plan visits and take turns travelling so the cost and effort do not fall on one person. For instance, adult children could visit during one holiday and invite their parents to stay during the next.',
        thai: 'ในแง่ของทางแก้ปัญหา ผมขอโต้แย้งว่ามีทางแก้หลักอยู่สองประการ ทางแก้แรกคือญาติพี่น้องควรจัดวิดีโอคอลประจำสัปดาห์และแบ่งปันข้อความสั้น ๆ เกี่ยวกับเหตุการณ์ในชีวิตประจำวัน แทนที่จะพูดคุยกันเฉพาะในยามฉุกเฉิน ตัวอย่างเช่น ปู่ย่าตายายสามารถชมหลานเปิดของขวัญวันเกิดออนไลน์ได้ และยังคงรู้สึกมีส่วนร่วมในชีวิตประจำวัน ทางแก้ที่สองคือสมาชิกในครอบครัวควรวางแผนการเยี่ยมเยียนและผลัดกันเดินทาง เพื่อไม่ให้ค่าใช้จ่ายและความพยายามตกอยู่กับคนคนเดียว ยกตัวอย่างเช่น ลูกที่โตแล้วอาจไปเยี่ยมในวันหยุดครั้งหนึ่ง และเชิญพ่อแม่ไปพักในวันหยุดครั้งถัดไป'
      },
      {
        role: 'conclusion',
        text: 'In conclusion, although it is undeniable that better jobs and affordable housing often lead adults away from home, I am of the opinion that regular communication and planned visits can keep family relationships strong.',
        thai: 'สรุปแล้ว แม้ว่าจะปฏิเสธไม่ได้ว่างานที่ดีกว่าและที่อยู่อาศัยราคาย่อมเยามักนำพาผู้ใหญ่ให้ห่างจากบ้าน ผมมีความเห็นว่าการสื่อสารอย่างสม่ำเสมอและการเยี่ยมเยียนที่วางแผนไว้สามารถรักษาความสัมพันธ์ในครอบครัวให้แน่นแฟ้นได้'
      }
    ],
    vocab: [
      { word: "suitable employment", thaiMeaning: "งานที่เหมาะสม" },
      { word: "relocate", thaiMeaning: "ย้ายถิ่นฐาน" },
      { word: "stable income", thaiMeaning: "รายได้ที่มั่นคง" },
      { word: "take turns", thaiMeaning: "ผลัดกัน" },
      { word: "family relationship", thaiMeaning: "ความสัมพันธ์ในครอบครัว" },
      { word: "working adults", thaiMeaning: "ผู้ใหญ่ที่ทำงาน" },
      { word: "another town or region", thaiMeaning: "เมืองหรือภูมิภาคอื่น" },
      { word: "moving away from family", thaiMeaning: "การย้ายห่างจากครอบครัว" },
      { word: "large cities", thaiMeaning: "เมืองใหญ่" },
      { word: "small towns", thaiMeaning: "เมืองเล็ก" },
      { word: "use their qualifications", thaiMeaning: "ใช้วุฒิการศึกษาของตน" },
      { word: "accept a promotion", thaiMeaning: "รับตำแหน่งที่สูงขึ้น" },
      { word: "trained nurse", thaiMeaning: "พยาบาลที่ผ่านการฝึก" },
      { word: "local clinic", thaiMeaning: "คลินิกในท้องถิ่น" },
      { word: "city hospital", thaiMeaning: "โรงพยาบาลในเมือง" },
      { word: "affordable housing", thaiMeaning: "ที่อยู่อาศัยราคาเอื้อมถึง" },
      { word: "rent a home", thaiMeaning: "เช่าบ้าน" },
      { word: "expensive capital", thaiMeaning: "เมืองหลวงที่มีค่าครองชีพสูง" },
      { word: "weekly video call", thaiMeaning: "การโทรวิดีโอรายสัปดาห์" },
      { word: "short messages", thaiMeaning: "ข้อความสั้น ๆ" },
      { word: "ordinary events", thaiMeaning: "เหตุการณ์ธรรมดาในชีวิต" },
      { word: "during emergencies", thaiMeaning: "เฉพาะตอนฉุกเฉิน" },
      { word: "birthday gift", thaiMeaning: "ของขวัญวันเกิด" },
      { word: "everyday life", thaiMeaning: "ชีวิตประจำวัน" },
      { word: "plan visits", thaiMeaning: "วางแผนการเยี่ยมเยียน" },
      { word: "adult children", thaiMeaning: "ลูกที่โตแล้ว" },
      { word: "regular communication", thaiMeaning: "การสื่อสารอย่างสม่ำเสมอ" },
      { word: "planned visits", thaiMeaning: "การเยี่ยมเยียนที่วางแผนไว้" }
    ]
  }),
  generalTrainingPrompt({
    id: 'gt-t2-dq-2',
    number: 2,
    typeId: 'double-question',
    track: 'general-training',
    title: 'Young People Avoiding Buses',
    questionText:
      'In some towns, young people rarely use local buses. Why is this the case? What could be done to encourage them to use buses more often?',
    meta: META,
    paragraphs: [
      {
        role: 'intro',
        text: 'It has been widely argued that young people in some towns rarely choose buses because these services do not match their needs or expectations. This essay will elaborate on the reasons for this pattern before presenting measures that could encourage young people to use buses.',
        thai: 'มีการถกเถียงกันอย่างกว้างขวางว่าคนหนุ่มสาวในบางเมืองแทบจะไม่เลือกใช้รถบัส เพราะว่าบริการเหล่านี้ไม่ตรงกับความต้องการหรือความคาดหวังของพวกเขา เรียงความนี้จะอธิบายอย่างละเอียดถึงเหตุผลของรูปแบบนี้ ก่อนที่จะนำเสนอมาตรการที่สามารถส่งเสริมให้คนหนุ่มสาวใช้รถบัสได้'
      },
      {
        role: 'body1',
        text: 'To begin with, there are a number of problems associated with local buses for young residents. Firstly, routes and times often fail to match classes, part-time shifts or evening activities. To explain it simply, this is because an hourly bus or early final departure is less dependable than cycling or receiving a lift. For example, a student finishing work at nine may have no bus home. Another problem is that fares and travel information seem poor without youth discounts or a reliable application. To illustrate, several short tickets may be expensive, while no live timetable leaves passengers unsure whether a bus is late.',
        thai: 'เริ่มต้นด้วย มีปัญหาหลายประการที่เกี่ยวข้องกับรถบัสท้องถิ่นสำหรับผู้อยู่อาศัยวัยหนุ่มสาว ประการแรก เส้นทางและเวลามักไม่ตรงกับชั้นเรียน กะงานพาร์ทไทม์ หรือกิจกรรมภาคค่ำ หากอธิบายง่าย ๆ นี่เป็นเพราะว่ารถบัสที่มาทุกชั่วโมงหรือเที่ยวสุดท้ายที่ออกเร็วนั้นเชื่อถือได้น้อยกว่าการปั่นจักรยานหรือการรับส่งด้วยรถยนต์ ตัวอย่างเช่น นักเรียนที่เลิกงานตอนสามทุ่มอาจไม่มีรถบัสกลับบ้าน อีกปัญหาหนึ่งคือค่าโดยสารและข้อมูลการเดินทางดูแย่ เนื่องจากไม่มีส่วนลดสำหรับเยาวชนหรือแอปพลิเคชันที่เชื่อถือได้ ยกตัวอย่างเช่น ตั๋วระยะสั้นหลายใบอาจมีราคาแพง ในขณะที่การไม่มีตารางเวลาแบบเรียลไทม์ทำให้ผู้โดยสารไม่แน่ใจว่ารถบัสจะมาช้าหรือไม่'
      },
      {
        role: 'body2',
        text: 'In terms of the solutions, I would argue that there are two main solutions. The first solution is that councils should create later, frequent services with direct routes to colleges, sports centres and residential areas. For example, a bus leaving town every thirty minutes until late evening would serve students who currently need lifts. The second solution is that operators should offer discounted youth cards and a simple application showing live arrivals and delays. For instance, schools could promote one low-cost monthly pass and demonstrate the application, giving students a reason to try buses regularly.',
        thai: 'ในแง่ของทางแก้ปัญหา ผมขอโต้แย้งว่ามีทางแก้หลักอยู่สองประการ ทางแก้แรกคือสภาท้องถิ่นควรสร้างบริการที่มาถี่ขึ้นและมาช้าลง โดยมีเส้นทางตรงไปยังวิทยาลัย ศูนย์กีฬา และพื้นที่พักอาศัย ตัวอย่างเช่น รถบัสที่ออกจากตัวเมืองทุกสามสิบนาทีจนถึงดึกจะให้บริการนักเรียนที่ปัจจุบันต้องพึ่งพาการรับส่งด้วยรถยนต์ ทางแก้ที่สองคือผู้ให้บริการควรเสนอบัตรเยาวชนราคาลดพิเศษและแอปพลิเคชันที่เรียบง่ายซึ่งแสดงเวลามาถึงและความล่าช้าแบบเรียลไทม์ ยกตัวอย่างเช่น โรงเรียนสามารถส่งเสริมบัตรผ่านรายเดือนราคาถูกใบเดียวและสาธิตการใช้แอปพลิเคชัน ทำให้นักเรียนมีเหตุผลที่จะลองใช้รถบัสเป็นประจำ'
      },
      {
        role: 'conclusion',
        text: 'In conclusion, although it is undeniable that this problem is caused by a number of factors such as unsuitable schedules and high fares, I am of the opinion that solutions such as later services and discounted youth cards can be effective measures to deal with this problem.',
        thai: 'สรุปแล้ว แม้ว่าจะปฏิเสธไม่ได้ว่าปัญหานี้เกิดจากปัจจัยหลายประการ เช่น ตารางเวลาที่ไม่เหมาะสมและค่าโดยสารที่สูง ผมมีความเห็นว่าทางแก้ต่าง ๆ เช่น บริการที่มาช้าลงและบัตรเยาวชนราคาลดพิเศษ สามารถเป็นมาตรการที่มีประสิทธิภาพในการจัดการกับปัญหานี้ได้'
      }
    ],
    vocab: [
      { word: "direct route", thaiMeaning: "เส้นทางตรง" },
      { word: "young people", thaiMeaning: "คนหนุ่มสาว" },
      { word: "match their needs", thaiMeaning: "ตรงกับความต้องการของพวกเขา" },
      { word: "local buses", thaiMeaning: "รถประจำทางท้องถิ่น" },
      { word: "young residents", thaiMeaning: "ผู้อยู่อาศัยวัยหนุ่มสาว" },
      { word: "part-time shifts", thaiMeaning: "กะงานพาร์ตไทม์" },
      { word: "evening activities", thaiMeaning: "กิจกรรมตอนเย็น" },
      { word: "hourly bus", thaiMeaning: "รถเมล์ที่มาชั่วโมงละเที่ยว" },
      { word: "early final departure", thaiMeaning: "เที่ยวสุดท้ายที่ออกเร็ว" },
      { word: "receiving a lift", thaiMeaning: "การได้รถรับส่ง" },
      { word: "travel information", thaiMeaning: "ข้อมูลการเดินทาง" },
      { word: "youth discounts", thaiMeaning: "ส่วนลดสำหรับเยาวชน" },
      { word: "reliable application", thaiMeaning: "แอปพลิเคชันที่เชื่อถือได้" },
      { word: "short tickets", thaiMeaning: "ตั๋วระยะสั้น" },
      { word: "live timetable", thaiMeaning: "ตารางเวลารถแบบเรียลไทม์" },
      { word: "frequent services", thaiMeaning: "บริการที่ถี่" },
      { word: "sports centres", thaiMeaning: "ศูนย์กีฬา" },
      { word: "residential areas", thaiMeaning: "ย่านที่อยู่อาศัย" },
      { word: "late evening", thaiMeaning: "ช่วงค่ำดึก" },
      { word: "discounted youth cards", thaiMeaning: "บัตรเยาวชนราคาลด" },
      { word: "live arrivals", thaiMeaning: "เวลารถมาถึงแบบเรียลไทม์" },
      { word: "monthly pass", thaiMeaning: "บัตรรายเดือน" },
      { word: "unsuitable schedules", thaiMeaning: "ตารางเวลาที่ไม่เหมาะสม" },
      { word: "high fares", thaiMeaning: "ค่าโดยสารสูง" },
      { word: "later services", thaiMeaning: "บริการเที่ยวรถดึกขึ้น" },
      { word: "finishing work at nine", thaiMeaning: "เลิกงานตอนเก้าโมง" },
      { word: "no bus home", thaiMeaning: "ไม่มีรถเมล์กลับบ้าน" },
      { word: "try buses regularly", thaiMeaning: "ลองใช้รถเมล์เป็นประจำ" }
    ]
  }),
  generalTrainingPrompt({
    id: 'gt-t2-dq-3',
    number: 3,
    typeId: 'double-question',
    track: 'general-training',
    title: 'Food Waste at Home',
    questionText:
      'Many households throw away large amounts of food. Why does this happen? What can families do to reduce food waste?',
    meta: META,
    paragraphs: [
      {
        role: 'intro',
        text: 'It has been widely argued that many households throw away much edible food because shopping and meals are not planned carefully. This essay will elaborate on the causes of domestic food waste before presenting steps that families can take to reduce it.',
        thai: 'มีการถกเถียงกันอย่างกว้างขวางว่าครัวเรือนจำนวนมากทิ้งอาหารที่ยังกินได้ไปเป็นจำนวนมาก เพราะว่าการซื้อของและมื้ออาหารไม่ได้รับการวางแผนอย่างรอบคอบ เรียงความนี้จะอธิบายอย่างละเอียดถึงสาเหตุของการสูญเสียอาหารในครัวเรือน ก่อนที่จะนำเสนอขั้นตอนที่ครอบครัวสามารถทำได้เพื่อลดปัญหานี้'
      },
      {
        role: 'body1',
        text: 'To begin with, there are a number of causes associated with food being wasted in family homes. Firstly, poor planning makes shoppers buy products they already have or cannot finish. To explain it simply, this is because large packs appear economical although they save no money when half goes into the bin. For example, a family may buy two bags of salad without planning meals that use them. Another cause is that people misunderstand date labels or cook portions larger than needed. To illustrate, adults may discard safe food after its best-before date, while extra rice from dinner is forgotten instead of stored.',
        thai: 'เริ่มต้นด้วย มีสาเหตุหลายประการที่เกี่ยวข้องกับการที่อาหารถูกทิ้งไปในบ้านของครอบครัว ประการแรก การวางแผนที่ไม่ดีทำให้ผู้ซื้อของซื้อสินค้าที่มีอยู่แล้วหรือกินไม่หมด หากอธิบายง่าย ๆ นี่เป็นเพราะว่าห่อขนาดใหญ่ดูเหมือนจะประหยัด แม้ว่าจริง ๆ แล้วมันไม่ได้ช่วยประหยัดเงินเลยเมื่อครึ่งหนึ่งต้องทิ้งลงถังขยะ ตัวอย่างเช่น ครอบครัวหนึ่งอาจซื้อสลัดสองถุงโดยไม่ได้วางแผนมื้ออาหารที่จะใช้มัน อีกสาเหตุหนึ่งคือผู้คนเข้าใจฉลากวันหมดอายุผิด หรือทำอาหารในปริมาณที่มากกว่าที่จำเป็น ยกตัวอย่างเช่น ผู้ใหญ่อาจทิ้งอาหารที่ปลอดภัยหลังจากวันที่ควรบริโภคก่อนผ่านไป ในขณะที่ข้าวที่เหลือจากมื้อเย็นถูกลืมไว้แทนที่จะถูกเก็บรักษา'
      },
      {
        role: 'body2',
        text: 'In terms of the solutions, I would argue that there are two main solutions. The first solution is that families should plan meals, check existing supplies and buy fresh products only in amounts they can finish. For example, parents could plan vegetables for two dinners and freeze extra portions instead of choosing an unnecessary large pack. The second solution is that household members should understand food dates, serve modest portions and store suitable leftovers. For instance, extra chicken and rice can become lunch the next day, while sealed unwanted products can go to a food bank.',
        thai: 'ในแง่ของทางแก้ปัญหา ผมขอโต้แย้งว่ามีทางแก้หลักอยู่สองประการ ทางแก้แรกคือครอบครัวควรวางแผนมื้ออาหาร ตรวจสอบของที่มีอยู่แล้ว และซื้อสินค้าสดในปริมาณที่กินหมดได้เท่านั้น ตัวอย่างเช่น พ่อแม่สามารถวางแผนผักสำหรับมื้อเย็นสองมื้อและแช่แข็งส่วนที่เหลือ แทนที่จะเลือกซื้อห่อขนาดใหญ่ที่ไม่จำเป็น ทางแก้ที่สองคือสมาชิกในครัวเรือนควรเข้าใจวันที่บนฉลากอาหาร เสิร์ฟในปริมาณที่พอเหมาะ และเก็บรักษาอาหารที่เหลือที่เหมาะสม ยกตัวอย่างเช่น ไก่และข้าวที่เหลือสามารถกลายเป็นมื้อกลางวันในวันถัดไปได้ ในขณะที่สินค้าที่ไม่ต้องการซึ่งยังปิดผนึกอยู่สามารถส่งไปยังธนาคารอาหารได้'
      },
      {
        role: 'conclusion',
        text: 'In conclusion, although it is undeniable that this problem is caused by a number of factors such as unplanned shopping and misunderstood date labels, I am of the opinion that solutions such as careful meal planning and responsible storage can be effective measures to deal with this problem.',
        thai: 'สรุปแล้ว แม้ว่าจะปฏิเสธไม่ได้ว่าปัญหานี้เกิดจากปัจจัยหลายประการ เช่น การซื้อของโดยไม่ได้วางแผนและการเข้าใจฉลากวันที่ผิด ผมมีความเห็นว่าทางแก้ต่าง ๆ เช่น การวางแผนมื้ออาหารอย่างรอบคอบและการเก็บรักษาอาหารอย่างมีความรับผิดชอบ สามารถเป็นมาตรการที่มีประสิทธิภาพในการจัดการกับปัญหานี้ได้'
      }
    ],
    vocab: [
      { word: "edible food", thaiMeaning: "อาหารที่ยังกินได้" },
      { word: "food waste", thaiMeaning: "ขยะอาหาร" },
      { word: "date label", thaiMeaning: "ฉลากวันที่" },
      { word: "best-before date", thaiMeaning: "วันที่ควรบริโภคก่อน" },
      { word: "leftovers", thaiMeaning: "อาหารที่เหลือ" },
      { word: "meal planning", thaiMeaning: "การวางแผนมื้ออาหาร" },
      { word: "modest portion", thaiMeaning: "ปริมาณอาหารพอเหมาะ" },
      { word: "food bank", thaiMeaning: "ธนาคารอาหาร" },
      { word: "family homes", thaiMeaning: "บ้านของครอบครัว" },
      { word: "poor planning", thaiMeaning: "การวางแผนที่ไม่ดี" },
      { word: "large packs", thaiMeaning: "หีบห่อขนาดใหญ่" },
      { word: "appear economical", thaiMeaning: "ดูประหยัด" },
      { word: "goes into the bin", thaiMeaning: "ถูกทิ้งลงถังขยะ" },
      { word: "bags of salad", thaiMeaning: "ถุงสลัด" },
      { word: "cook portions larger than needed", thaiMeaning: "ทำอาหารมากเกินความจำเป็น" },
      { word: "discard safe food", thaiMeaning: "ทิ้งอาหารที่ยังกินได้" },
      { word: "extra rice from dinner", thaiMeaning: "ข้าวเหลือจากมื้อเย็น" },
      { word: "plan meals", thaiMeaning: "วางแผนมื้ออาหาร" },
      { word: "existing supplies", thaiMeaning: "ของที่มีอยู่แล้ว" },
      { word: "fresh products", thaiMeaning: "ผลิตภัณฑ์สด" },
      { word: "freeze extra portions", thaiMeaning: "แช่แข็งส่วนที่เหลือ" },
      { word: "unnecessary large pack", thaiMeaning: "หีบห่อใหญ่ที่ไม่จำเป็น" },
      { word: "understand food dates", thaiMeaning: "เข้าใจวันหมดอายุอาหาร" },
      { word: "sealed unwanted products", thaiMeaning: "สินค้าที่ไม่ต้องการที่ยังปิดผนึก" },
      { word: "unplanned shopping", thaiMeaning: "การซื้อของโดยไม่ได้วางแผน" },
      { word: "responsible storage", thaiMeaning: "การเก็บรักษาอย่างรับผิดชอบ" },
      { word: "throw away", thaiMeaning: "ทิ้งไป" },
      { word: "shopping and meals", thaiMeaning: "การซื้อของและมื้ออาหาร" }
    ]
  }),
  generalTrainingPrompt({
    id: 'gt-t2-dq-4',
    number: 4,
    typeId: 'double-question',
    track: 'general-training',
    title: 'Retirement and Community Work',
    questionText:
      'Some retired people choose to do unpaid work in their communities. What benefits does this bring to retired people and to the community? How can more retired people be encouraged to take part?',
    meta: META,
    paragraphs: [
      {
        role: 'intro',
        text: 'It has been widely argued that unpaid community work by retired people can improve both their own lives and the local services around them. This essay will elaborate on the main benefits for retirees and communities before presenting measures that could encourage more retired people to participate.',
        thai: 'มีการถกเถียงกันอย่างกว้างขวางว่างานอาสาสมัครในชุมชนโดยผู้เกษียณอายุสามารถปรับปรุงทั้งชีวิตของพวกเขาเองและบริการท้องถิ่นรอบตัวได้ เรียงความนี้จะอธิบายอย่างละเอียดถึงประโยชน์หลักสำหรับผู้เกษียณอายุและชุมชน ก่อนที่จะนำเสนอมาตรการที่สามารถส่งเสริมให้ผู้เกษียณอายุเข้าร่วมมากขึ้นได้'
      },
      {
        role: 'body1',
        text: 'To begin with, there are a number of benefits associated with retired people doing unpaid community work. Firstly, volunteering provides routine, social contact and purpose after employment ends. To explain it simply, this is because helping others allows retirees to remain active and meet friends instead of staying alone. For example, a library volunteer can enjoy weekly conversation while helping children read confidently. Another benefit is that local organisations receive valuable time and practical skills they may be unable to afford. To illustrate, a retired electrician could teach basic repairs, while a former office worker organises a small charity’s records.',
        thai: 'เริ่มต้นด้วย มีประโยชน์หลายประการที่เกี่ยวข้องกับการที่ผู้เกษียณอายุทำงานอาสาสมัครในชุมชนโดยไม่ได้รับค่าตอบแทน ประการแรก การเป็นอาสาสมัครมอบกิจวัตร การติดต่อทางสังคม และเป้าหมายในชีวิตหลังจากการทำงานสิ้นสุดลง หากอธิบายง่าย ๆ นี่เป็นเพราะว่าการช่วยเหลือผู้อื่นทำให้ผู้เกษียณอายุยังคงกระตือรือร้นและได้พบปะเพื่อนฝูงแทนที่จะอยู่คนเดียว ตัวอย่างเช่น อาสาสมัครห้องสมุดสามารถเพลิดเพลินกับการสนทนาประจำสัปดาห์ในขณะที่ช่วยให้เด็ก ๆ อ่านหนังสือได้อย่างมั่นใจ อีกประโยชน์หนึ่งคือองค์กรท้องถิ่นได้รับเวลาอันมีค่าและทักษะที่เป็นประโยชน์ซึ่งพวกเขาอาจไม่มีเงินพอที่จะจ่ายได้ ยกตัวอย่างเช่น ช่างไฟฟ้าที่เกษียณอายุแล้วสามารถสอนการซ่อมแซมขั้นพื้นฐาน ในขณะที่อดีตพนักงานออฟฟิศจัดระเบียบบันทึกขององค์กรการกุศลขนาดเล็ก'
      },
      {
        role: 'body2',
        text: 'In terms of the solutions, I would argue that there are two main solutions. The first solution is that councils should list opportunities clearly while organisations offer flexible shifts instead of a fixed weekly commitment. For example, a retiree with health needs could help at a garden twice a month without feeling guilty when unavailable. The second solution is that new volunteers should receive training, travel expenses and public thanks for their contribution. For instance, a centre could offer a trial with an experienced volunteer and hold an annual event where residents thank everyone who helped.',
        thai: 'ในแง่ของทางแก้ปัญหา ผมขอโต้แย้งว่ามีทางแก้หลักอยู่สองประการ ทางแก้แรกคือสภาท้องถิ่นควรแสดงรายการโอกาสอย่างชัดเจน ในขณะที่องค์กรต่าง ๆ เสนอกะเวลาที่ยืดหยุ่นแทนที่จะเป็นข้อผูกมัดประจำสัปดาห์ที่ตายตัว ตัวอย่างเช่น ผู้เกษียณอายุที่มีปัญหาสุขภาพสามารถช่วยงานที่สวนเดือนละสองครั้งได้โดยไม่รู้สึกผิดเมื่อไม่สามารถมาได้ ทางแก้ที่สองคืออาสาสมัครใหม่ควรได้รับการฝึกอบรม ค่าใช้จ่ายในการเดินทาง และคำขอบคุณจากสาธารณะสำหรับการมีส่วนร่วมของพวกเขา ยกตัวอย่างเช่น ศูนย์แห่งหนึ่งสามารถเสนอการทดลองงานร่วมกับอาสาสมัครที่มีประสบการณ์ และจัดงานประจำปีที่ผู้อยู่อาศัยขอบคุณทุกคนที่ช่วยเหลือ'
      },
      {
        role: 'conclusion',
        text: 'In conclusion, although it is undeniable that unpaid community work requires time and effort, I am of the opinion that its social benefits are valuable and that flexible roles and clear support can encourage wider participation.',
        thai: 'สรุปแล้ว แม้ว่าจะปฏิเสธไม่ได้ว่างานอาสาสมัครในชุมชนโดยไม่ได้รับค่าตอบแทนต้องใช้เวลาและความพยายาม ผมมีความเห็นว่าประโยชน์ทางสังคมของมันมีคุณค่า และบทบาทที่ยืดหยุ่นพร้อมการสนับสนุนที่ชัดเจนสามารถส่งเสริมการมีส่วนร่วมที่กว้างขวางยิ่งขึ้นได้'
      }
    ],
    vocab: [
      { word: "local organisation", thaiMeaning: "องค์กรท้องถิ่น" },
      { word: "social contact", thaiMeaning: "การติดต่อทางสังคม" },
      { word: "weekly commitment", thaiMeaning: "ข้อผูกมัดรายสัปดาห์" },
      { word: "travel expenses", thaiMeaning: "ค่าเดินทาง" },
      { word: "unpaid community work", thaiMeaning: "งานชุมชนที่ไม่ได้รับค่าจ้าง" },
      { word: "retired people", thaiMeaning: "ผู้เกษียณอายุ" },
      { word: "local services", thaiMeaning: "บริการในท้องถิ่น" },
      { word: "volunteering provides routine", thaiMeaning: "การอาสาสมัครสร้างกิจวัตร" },
      { word: "remain active", thaiMeaning: "คงความกระตือรือร้น" },
      { word: "meet friends", thaiMeaning: "พบปะเพื่อน" },
      { word: "staying alone", thaiMeaning: "การอยู่คนเดียว" },
      { word: "library volunteer", thaiMeaning: "อาสาสมัครห้องสมุด" },
      { word: "weekly conversation", thaiMeaning: "การสนทนารายสัปดาห์" },
      { word: "read confidently", thaiMeaning: "อ่านได้อย่างมั่นใจ" },
      { word: "practical skills", thaiMeaning: "ทักษะที่ใช้ได้จริง" },
      { word: "retired electrician", thaiMeaning: "ช่างไฟฟ้าที่เกษียณแล้ว" },
      { word: "basic repairs", thaiMeaning: "การซ่อมเบื้องต้น" },
      { word: "former office worker", thaiMeaning: "อดีตพนักงานออฟฟิศ" },
      { word: "small charity", thaiMeaning: "มูลนิธิขนาดเล็ก" },
      { word: "list opportunities clearly", thaiMeaning: "ระบุโอกาสอย่างชัดเจน" },
      { word: "flexible shifts", thaiMeaning: "กะงานที่ยืดหยุ่น" },
      { word: "health needs", thaiMeaning: "ความต้องการด้านสุขภาพ" },
      { word: "feeling guilty", thaiMeaning: "รู้สึกผิด" },
      { word: "new volunteers", thaiMeaning: "อาสาสมัครใหม่" },
      { word: "public thanks", thaiMeaning: "การขอบคุณต่อสาธารณะ" },
      { word: "experienced volunteer", thaiMeaning: "อาสาสมัครที่มีประสบการณ์" },
      { word: "annual event", thaiMeaning: "กิจกรรมประจำปี" },
      { word: "wider participation", thaiMeaning: "การมีส่วนร่วมที่กว้างขึ้น" }
    ]
  }),

  generalTrainingPrompt({
    id: 'gt-t2-dbv-1',
    number: 1,
    typeId: 'discuss-both-views',
    track: 'general-training',
    title: 'Care for Older Relatives',
    questionText:
      'Some people think older relatives should live with their families when they need support. Others believe professional care homes are a better choice. Discuss both views and give your own opinion.',
    meta: META,
    paragraphs: [
      {
        role: 'intro',
        text: 'It is widely acknowledged that family care plays an important role in supporting older relatives. However, professional care may better meet complex medical needs. I believe that suitable home care is preferable, and the reasons will be elaborated in this essay.',
        thai: 'เป็นที่ยอมรับกันอย่างกว้างขวางว่าการดูแลโดยครอบครัวมีบทบาทสำคัญในการสนับสนุนญาติผู้สูงอายุ อย่างไรก็ตาม การดูแลโดยผู้เชี่ยวชาญอาจตอบสนองความต้องการทางการแพทย์ที่ซับซ้อนได้ดีกว่า ผมเชื่อว่าการดูแลที่บ้านอย่างเหมาะสมเป็นทางเลือกที่ดีกว่า และเหตุผลจะถูกอธิบายอย่างละเอียดในเรียงความนี้'
      },
      {
        role: 'body1',
        text: 'To begin with, it might seem reasonable for some to claim that family homes give older people familiar surroundings, daily company and personal support. To explain it simply, this is because shared routines prevent loneliness and help relatives notice health changes quickly. For example, an older woman with limited mobility may receive help with cooking while enjoying family life and making her own decisions.',
        thai: 'เริ่มต้นด้วย อาจดูสมเหตุสมผลที่บางคนจะกล่าวอ้างว่าบ้านของครอบครัวมอบสภาพแวดล้อมที่คุ้นเคย การอยู่เป็นเพื่อนในแต่ละวัน และการสนับสนุนส่วนตัวให้แก่ผู้สูงอายุ อธิบายให้เข้าใจง่ายคือ เพราะว่ากิจวัตรที่ทำร่วมกันช่วยป้องกันความเหงาและช่วยให้ญาติสังเกตเห็นการเปลี่ยนแปลงด้านสุขภาพได้อย่างรวดเร็ว ตัวอย่างเช่น หญิงชราที่เคลื่อนไหวลำบากอาจได้รับความช่วยเหลือในการทำอาหาร ขณะเดียวกันก็ยังได้เพลิดเพลินกับชีวิตครอบครัวและตัดสินใจด้วยตัวเอง'
      },
      {
        role: 'body2',
        text: 'However, some might argue that professional care homes provide trained staff, safe equipment and constant attention unavailable in ordinary households. To put it simply, this is due to the fact that serious medical conditions may require specialist knowledge day and night. For instance, a resident who forgets medication can receive supervised treatment and companionship, while relatives visit without carrying every medical duty.',
        thai: 'อย่างไรก็ตาม บางคนอาจโต้แย้งว่าบ้านพักคนชราที่ดูแลโดยผู้เชี่ยวชาญมีเจ้าหน้าที่ที่ผ่านการฝึกอบรม อุปกรณ์ที่ปลอดภัย และการดูแลเอาใจใส่อย่างต่อเนื่องซึ่งไม่มีในครัวเรือนทั่วไป พูดให้เข้าใจง่ายคือ เนื่องมาจากอาการป่วยที่รุนแรงอาจต้องใช้ความรู้เฉพาะทางทั้งกลางวันและกลางคืน ตัวอย่างเช่น ผู้พักอาศัยที่ลืมกินยาสามารถได้รับการดูแลรักษาภายใต้การควบคุมดูแลและมีเพื่อน ในขณะที่ญาติสามารถมาเยี่ยมได้โดยไม่ต้องแบกรับหน้าที่ทางการแพทย์ทั้งหมด'
      },
      {
        role: 'body3',
        text: 'Personally, I would argue that family care should come first when relatives have enough time, space and professional advice. My reasoning is that staying among loved ones protects relationships and independence, while an unfamiliar home may cause distress. To illustrate, visiting nurses could support an older parent at home, with specialist care available if constant medical attention later becomes necessary.',
        thai: 'ในความเห็นส่วนตัว ผมขอโต้แย้งว่าการดูแลโดยครอบครัวควรมาเป็นอันดับแรกเมื่อญาติมีเวลา พื้นที่ และคำแนะนำจากผู้เชี่ยวชาญเพียงพอ เหตุผลของผมคือการอยู่ท่ามกลางคนที่รักช่วยปกป้องความสัมพันธ์และความเป็นอิสระ ในขณะที่บ้านที่ไม่คุ้นเคยอาจก่อให้เกิดความทุกข์ใจ เพื่อยกตัวอย่าง พยาบาลเยี่ยมบ้านสามารถช่วยสนับสนุนพ่อแม่ผู้สูงอายุที่บ้านได้ โดยมีการดูแลจากผู้เชี่ยวชาญพร้อมให้บริการหากในภายหลังจำเป็นต้องมีการดูแลทางการแพทย์อย่างต่อเนื่อง'
      },
      {
        role: 'conclusion',
        text: 'In conclusion, although it is undeniable that care homes offer essential specialist support for complex needs, I am of the opinion that older relatives should live with family whenever this arrangement is safe and practical.',
        thai: 'สรุปแล้ว แม้ว่าจะปฏิเสธไม่ได้ว่าบ้านพักคนชรามอบการสนับสนุนเฉพาะทางที่จำเป็นสำหรับความต้องการที่ซับซ้อน แต่ผมมีความเห็นว่าญาติผู้สูงอายุควรอาศัยอยู่กับครอบครัวเมื่อใดก็ตามที่การจัดการเช่นนี้ปลอดภัยและเป็นไปได้ในทางปฏิบัติ'
      }
    ],
    vocab: [
      { word: "older relative", thaiMeaning: "ญาติผู้สูงอายุ" },
      { word: "professional care home", thaiMeaning: "สถานดูแลผู้สูงอายุแบบมืออาชีพ" },
      { word: "familiar surroundings", thaiMeaning: "สภาพแวดล้อมที่คุ้นเคย" },
      { word: "limited mobility", thaiMeaning: "ข้อจำกัดในการเคลื่อนไหว" },
      { word: "visiting nurse", thaiMeaning: "พยาบาลเยี่ยมบ้าน" },
      { word: "trained staff", thaiMeaning: "เจ้าหน้าที่ที่ผ่านการฝึกอบรม" },
      { word: "constant attention", thaiMeaning: "การดูแลอย่างต่อเนื่อง" },
      { word: "cause distress", thaiMeaning: "ก่อให้เกิดความทุกข์ใจ" },
      { word: "specialist support", thaiMeaning: "การช่วยเหลือเฉพาะทาง" },
      { word: "complex medical needs", thaiMeaning: "ความต้องการทางการแพทย์ที่ซับซ้อน" },
      { word: "suitable home care", thaiMeaning: "การดูแลที่บ้านที่เหมาะสม" },
      { word: "daily company", thaiMeaning: "การมีคนอยู่ด้วยทุกวัน" },
      { word: "personal support", thaiMeaning: "การช่วยเหลือส่วนบุคคล" },
      { word: "shared routines", thaiMeaning: "กิจวัตรร่วมกัน" },
      { word: "prevent loneliness", thaiMeaning: "ป้องกันความเหงา" },
      { word: "health changes", thaiMeaning: "การเปลี่ยนแปลงด้านสุขภาพ" },
      { word: "enjoying family life", thaiMeaning: "เพลิดเพลินกับชีวิตครอบครัว" },
      { word: "making her own decisions", thaiMeaning: "ตัดสินใจด้วยตนเอง" },
      { word: "safe equipment", thaiMeaning: "อุปกรณ์ที่ปลอดภัย" },
      { word: "ordinary households", thaiMeaning: "ครัวเรือนทั่วไป" },
      { word: "serious medical conditions", thaiMeaning: "ภาวะทางการแพทย์ที่ร้ายแรง" },
      { word: "specialist knowledge", thaiMeaning: "ความรู้เฉพาะทาง" },
      { word: "supervised treatment", thaiMeaning: "การรักษาภายใต้การดูแล" },
      { word: "professional advice", thaiMeaning: "คำแนะนำจากผู้เชี่ยวชาญ" },
      { word: "loved ones", thaiMeaning: "คนที่รัก" },
      { word: "unfamiliar home", thaiMeaning: "บ้านที่ไม่คุ้นเคย" },
      { word: "constant medical attention", thaiMeaning: "การดูแลทางการแพทย์อย่างต่อเนื่อง" },
      { word: "older parent", thaiMeaning: "พ่อแม่ผู้สูงอายุ" }
    ]
  }),
  generalTrainingPrompt({
    id: 'gt-t2-dbv-2',
    number: 2,
    typeId: 'discuss-both-views',
    track: 'general-training',
    title: 'School Trips or Classroom Resources',
    questionText:
      'Some people think schools should spend more money on educational trips. Others believe the money should be used for classroom resources. Discuss both views and give your own opinion.',
    meta: META,
    paragraphs: [
      {
        role: 'intro',
        text: 'It is widely acknowledged that school funding plays an important role in educational quality. However, schools must choose between trips and classroom resources. I believe that essential classroom resources should receive priority, and the reasons will be elaborated in this essay.',
        thai: 'เป็นที่ยอมรับกันอย่างกว้างขวางว่างบประมาณของโรงเรียนมีบทบาทสำคัญต่อคุณภาพการศึกษา อย่างไรก็ตาม โรงเรียนต้องเลือกระหว่างการทัศนศึกษาและอุปกรณ์ในห้องเรียน ผมเชื่อว่าอุปกรณ์ในห้องเรียนที่จำเป็นควรได้รับความสำคัญก่อน และเหตุผลจะถูกอธิบายอย่างละเอียดในเรียงความนี้'
      },
      {
        role: 'body1',
        text: 'To begin with, it might seem reasonable for some to claim that educational trips make lessons memorable through experience outside the classroom. To explain it simply, this is because visits bring history and science into focus while teaching children responsible public behaviour. For example, a museum shows how families lived in the past, while a nature centre lets pupils observe animals previously seen only in books.',
        thai: 'เริ่มต้นด้วย อาจดูสมเหตุสมผลที่บางคนจะกล่าวอ้างว่าการทัศนศึกษาทางการศึกษาทำให้บทเรียนน่าจดจำผ่านประสบการณ์นอกห้องเรียน อธิบายให้เข้าใจง่ายคือ เพราะว่าการไปเยี่ยมชมสถานที่ทำให้ประวัติศาสตร์และวิทยาศาสตร์ชัดเจนขึ้น พร้อมทั้งสอนให้เด็กมีพฤติกรรมที่รับผิดชอบในที่สาธารณะ ตัวอย่างเช่น พิพิธภัณฑ์แสดงให้เห็นว่าครอบครัวในอดีตใช้ชีวิตอย่างไร ในขณะที่ศูนย์ธรรมชาติทำให้นักเรียนได้สังเกตสัตว์ที่ก่อนหน้านี้เคยเห็นเพียงแต่ในหนังสือ'
      },
      {
        role: 'body2',
        text: 'However, some might argue that books, computers and practical equipment support every lesson and benefit many pupils for years. To put it simply, this is due to the fact that missing materials affect daily learning, while one expensive trip lasts only a short time. For instance, reading books build language skills each week, while reliable computers let pupils research topics and practise digital tasks.',
        thai: 'อย่างไรก็ตาม บางคนอาจโต้แย้งว่าหนังสือ คอมพิวเตอร์ และอุปกรณ์ภาคปฏิบัติสนับสนุนทุกบทเรียนและเป็นประโยชน์ต่อนักเรียนจำนวนมากไปอีกหลายปี พูดให้เข้าใจง่ายคือ เนื่องมาจากการขาดแคลนอุปกรณ์ส่งผลกระทบต่อการเรียนรู้ในแต่ละวัน ในขณะที่ทัศนศึกษาที่มีราคาแพงเพียงครั้งเดียวนั้นอยู่ได้เพียงช่วงเวลาสั้นๆ ตัวอย่างเช่น หนังสืออ่านช่วยสร้างทักษะทางภาษาในแต่ละสัปดาห์ ในขณะที่คอมพิวเตอร์ที่ใช้งานได้ดีทำให้นักเรียนสามารถค้นคว้าหัวข้อต่างๆ และฝึกฝนงานดิจิทัลได้'
      },
      {
        role: 'body3',
        text: 'Personally, I would argue that schools should secure essential classroom resources before organising affordable trips linked to the curriculum. My reasoning is that daily materials create a foundation, while relevant visits can later deepen knowledge without taking money from basic needs. To illustrate, a school could buy science equipment for every class before arranging a reduced-price farm visit where pupils apply earlier learning.',
        thai: 'ในความเห็นส่วนตัว ผมขอโต้แย้งว่าโรงเรียนควรจัดหาอุปกรณ์ในห้องเรียนที่จำเป็นให้ครบก่อนจะจัดทัศนศึกษาราคาประหยัดที่เชื่อมโยงกับหลักสูตร เหตุผลของผมคือวัสดุอุปกรณ์ในแต่ละวันสร้างรากฐาน ในขณะที่การเยี่ยมชมที่เกี่ยวข้องสามารถเสริมความรู้ให้ลึกซึ้งยิ่งขึ้นในภายหลังได้โดยไม่ต้องดึงเงินจากความจำเป็นพื้นฐาน เพื่อยกตัวอย่าง โรงเรียนอาจซื้ออุปกรณ์วิทยาศาสตร์ให้ทุกชั้นเรียนก่อนที่จะจัดการเยี่ยมชมฟาร์มในราคาลดพิเศษ ซึ่งนักเรียนได้นำความรู้ที่เรียนมาก่อนหน้านี้ไปปรับใช้'
      },
      {
        role: 'conclusion',
        text: 'In conclusion, although it is undeniable that educational trips offer memorable real-world experiences, I am of the opinion that lasting classroom resources should receive priority before schools spend remaining funds on relevant visits.',
        thai: 'สรุปแล้ว แม้ว่าจะปฏิเสธไม่ได้ว่าการทัศนศึกษาทางการศึกษามอบประสบการณ์จริงที่น่าจดจำ แต่ผมมีความเห็นว่าอุปกรณ์ในห้องเรียนที่ใช้ได้ยาวนานควรได้รับความสำคัญก่อนที่โรงเรียนจะนำเงินทุนที่เหลือไปใช้กับการเยี่ยมชมที่เกี่ยวข้อง'
      }
    ],
    vocab: [
      { word: "educational trip", thaiMeaning: "ทัศนศึกษาเพื่อการเรียนรู้" },
      { word: "classroom resource", thaiMeaning: "ทรัพยากรในห้องเรียน" },
      { word: "practical equipment", thaiMeaning: "อุปกรณ์ภาคปฏิบัติ" },
      { word: "receive priority", thaiMeaning: "ได้รับความสำคัญก่อน" },
      { word: "school funding", thaiMeaning: "งบประมาณของโรงเรียน" },
      { word: "educational quality", thaiMeaning: "คุณภาพการศึกษา" },
      { word: "make lessons memorable", thaiMeaning: "ทำให้บทเรียนน่าจดจำ" },
      { word: "outside the classroom", thaiMeaning: "นอกห้องเรียน" },
      { word: "bring history and science into focus", thaiMeaning: "ทำให้ประวัติศาสตร์และวิทยาศาสตร์ชัดเจนขึ้น" },
      { word: "responsible public behaviour", thaiMeaning: "พฤติกรรมในที่สาธารณะอย่างรับผิดชอบ" },
      { word: "nature centre", thaiMeaning: "ศูนย์ธรรมชาติศึกษา" },
      { word: "observe animals", thaiMeaning: "สังเกตสัตว์" },
      { word: "previously seen only in books", thaiMeaning: "เคยเห็นแต่ในหนังสือเท่านั้น" },
      { word: "missing materials", thaiMeaning: "สื่อการเรียนที่ขาดหาย" },
      { word: "daily learning", thaiMeaning: "การเรียนรู้ในแต่ละวัน" },
      { word: "expensive trip", thaiMeaning: "ทริปที่มีค่าใช้จ่ายสูง" },
      { word: "language skills", thaiMeaning: "ทักษะภาษา" },
      { word: "reliable computers", thaiMeaning: "คอมพิวเตอร์ที่ใช้งานได้ดี" },
      { word: "research topics", thaiMeaning: "ค้นคว้าหัวข้อ" },
      { word: "practise digital tasks", thaiMeaning: "ฝึกงานดิจิทัล" },
      { word: "organising affordable trips", thaiMeaning: "จัดทริปในราคาที่เอื้อมถึง" },
      { word: "linked to the curriculum", thaiMeaning: "เชื่อมโยงกับหลักสูตร" },
      { word: "daily materials", thaiMeaning: "สื่อการเรียนประจำวัน" },
      { word: "create a foundation", thaiMeaning: "สร้างพื้นฐาน" },
      { word: "deepen knowledge", thaiMeaning: "เพิ่มพูนความรู้" },
      { word: "basic needs", thaiMeaning: "ความต้องการพื้นฐาน" },
      { word: "science equipment", thaiMeaning: "อุปกรณ์วิทยาศาสตร์" },
      { word: "reduced-price farm visit", thaiMeaning: "การเยี่ยมชมฟาร์มในราคาลด" }
    ]
  }),
  generalTrainingPrompt({
    id: 'gt-t2-dbv-3',
    number: 3,
    typeId: 'discuss-both-views',
    track: 'general-training',
    title: 'Improving Town Centres',
    questionText:
      'Some people think town centres should provide more parking spaces. Others believe they should have more parks and pedestrian areas. Discuss both views and give your own opinion.',
    meta: META,
    paragraphs: [
      {
        role: 'intro',
        text: 'It is widely acknowledged that town-centre planning plays an important role in community life. However, residents disagree about parking and greener public areas. I believe that parks and pedestrian spaces should receive priority, and the reasons will be elaborated in this essay.',
        thai: 'เป็นที่ยอมรับกันอย่างกว้างขวางว่าการวางผังใจกลางเมืองมีบทบาทสำคัญต่อชีวิตชุมชน อย่างไรก็ตาม ผู้อยู่อาศัยมีความเห็นไม่ตรงกันเกี่ยวกับที่จอดรถและพื้นที่สาธารณะที่เขียวขจีมากขึ้น ผมเชื่อว่าสวนสาธารณะและพื้นที่สำหรับคนเดินเท้าควรได้รับความสำคัญก่อน และเหตุผลจะถูกอธิบายอย่างละเอียดในเรียงความนี้'
      },
      {
        role: 'body1',
        text: 'To begin with, it might seem reasonable for some to claim that more parking supports shops by helping customers who depend on cars. To explain it simply, this is because older residents, disabled visitors and families may struggle with public transport or heavy shopping. For example, short-stay spaces help a parent collect groceries, while accessible parking lets a person with limited mobility visit services independently.',
        thai: 'เริ่มต้นด้วย อาจดูสมเหตุสมผลที่บางคนจะกล่าวอ้างว่าที่จอดรถที่มากขึ้นช่วยสนับสนุนร้านค้าโดยช่วยเหลือลูกค้าที่ต้องพึ่งพารถยนต์ อธิบายให้เข้าใจง่ายคือ เพราะว่าผู้สูงอายุ ผู้พิการ และครอบครัวอาจประสบปัญหาในการใช้ระบบขนส่งสาธารณะหรือแบกของที่ซื้อจำนวนมาก ตัวอย่างเช่น ที่จอดรถระยะสั้นช่วยให้พ่อแม่ไปรับซื้อของชำได้ ในขณะที่ที่จอดรถสำหรับผู้พิการทำให้คนที่เคลื่อนไหวลำบากสามารถไปใช้บริการต่างๆ ได้ด้วยตนเอง'
      },
      {
        role: 'body2',
        text: 'However, some might argue that parks and pedestrian streets create a safer, cleaner and more pleasant centre than parked vehicles. To put it simply, this is due to the fact that fewer cars mean less noise and more space to walk, meet or play. For instance, trees and benches on a traffic-free street may encourage visitors to stay longer and support nearby cafés and shops.',
        thai: 'อย่างไรก็ตาม บางคนอาจโต้แย้งว่าสวนสาธารณะและถนนคนเดินสร้างใจกลางเมืองที่ปลอดภัยกว่า สะอาดกว่า และน่าอยู่มากกว่ารถยนต์ที่จอดอยู่ พูดให้เข้าใจง่ายคือ เนื่องมาจากรถยนต์ที่น้อยลงหมายถึงเสียงรบกวนที่น้อยลงและมีพื้นที่มากขึ้นสำหรับการเดิน การพบปะ หรือการเล่น ตัวอย่างเช่น ต้นไม้และม้านั่งบนถนนที่ปลอดรถอาจกระตุ้นให้ผู้มาเยือนอยู่นานขึ้นและสนับสนุนร้านกาแฟและร้านค้าใกล้เคียง'
      },
      {
        role: 'body3',
        text: 'Personally, I would argue that central streets should serve people and green spaces, supported by buses and parking near the town’s edge. My reasoning is that this plan keeps services accessible while turning limited land into a healthy shared place. To illustrate, an edge car park with a shuttle bus could serve drivers while former roadside spaces become trees, seats and paths.',
        thai: 'ในความเห็นส่วนตัว ผมขอโต้แย้งว่าถนนใจกลางเมืองควรให้บริการทั้งผู้คนและพื้นที่สีเขียว โดยได้รับการสนับสนุนจากรถบัสและที่จอดรถบริเวณชายขอบเมือง เหตุผลของผมคือแผนนี้ทำให้บริการต่างๆ ยังคงเข้าถึงได้ ในขณะเดียวกันก็เปลี่ยนพื้นที่ที่จำกัดให้กลายเป็นพื้นที่ส่วนรวมที่ดีต่อสุขภาพ เพื่อยกตัวอย่าง ที่จอดรถบริเวณชายขอบเมืองพร้อมรถบัสรับส่งสามารถให้บริการผู้ขับขี่ได้ ในขณะที่พื้นที่ริมถนนเดิมกลายเป็นต้นไม้ ที่นั่ง และทางเดิน'
      },
      {
        role: 'conclusion',
        text: 'In conclusion, although it is undeniable that convenient parking helps some customers reach local services, I am of the opinion that parks and pedestrian areas bring greater benefits to town centres when practical transport alternatives exist.',
        thai: 'สรุปแล้ว แม้ว่าจะปฏิเสธไม่ได้ว่าที่จอดรถที่สะดวกช่วยให้ลูกค้าบางส่วนเข้าถึงบริการในท้องถิ่นได้ แต่ผมมีความเห็นว่าสวนสาธารณะและพื้นที่สำหรับคนเดินเท้านำมาซึ่งประโยชน์ที่มากกว่าต่อใจกลางเมือง เมื่อมีทางเลือกด้านการคมนาคมที่ใช้งานได้จริง'
      }
    ],
    vocab: [
      { word: "town-centre planning", thaiMeaning: "การวางผังใจกลางเมือง" },
      { word: "pedestrian area", thaiMeaning: "เขตสำหรับคนเดินเท้า" },
      { word: "disabled visitor", thaiMeaning: "ผู้มาเยือนที่มีความพิการ" },
      { word: "transport alternative", thaiMeaning: "ทางเลือกด้านการเดินทาง" },
      { word: "community life", thaiMeaning: "ชีวิตชุมชน" },
      { word: "greener public areas", thaiMeaning: "พื้นที่สาธารณะสีเขียวมากขึ้น" },
      { word: "parks and pedestrian spaces", thaiMeaning: "สวนสาธารณะและพื้นที่เดินเท้า" },
      { word: "depend on cars", thaiMeaning: "พึ่งพารถยนต์" },
      { word: "older residents", thaiMeaning: "ผู้อยู่อาศัยสูงอายุ" },
      { word: "public transport", thaiMeaning: "ระบบขนส่งสาธารณะ" },
      { word: "heavy shopping", thaiMeaning: "การซื้อของจำนวนมาก" },
      { word: "short-stay spaces", thaiMeaning: "ที่จอดรถระยะสั้น" },
      { word: "collect groceries", thaiMeaning: "ไปรับของชำ" },
      { word: "accessible parking", thaiMeaning: "ที่จอดรถที่เข้าถึงได้" },
      { word: "visit services independently", thaiMeaning: "ใช้บริการได้ด้วยตนเอง" },
      { word: "pedestrian streets", thaiMeaning: "ถนนสำหรับคนเดินเท้า" },
      { word: "parked vehicles", thaiMeaning: "ยานพาหนะที่จอดอยู่" },
      { word: "fewer cars", thaiMeaning: "รถยนต์น้อยลง" },
      { word: "traffic-free street", thaiMeaning: "ถนนที่ไม่มีรถวิ่ง" },
      { word: "encourage visitors", thaiMeaning: "ดึงดูดผู้มาเยือน" },
      { word: "nearby cafés and shops", thaiMeaning: "คาเฟ่และร้านค้าใกล้เคียง" },
      { word: "central streets", thaiMeaning: "ถนนใจกลางเมือง" },
      { word: "green spaces", thaiMeaning: "พื้นที่สีเขียว" },
      { word: "town’s edge", thaiMeaning: "ชานเมือง / ขอบเมือง" },
      { word: "keeps services accessible", thaiMeaning: "ทำให้บริการเข้าถึงได้" },
      { word: "healthy shared place", thaiMeaning: "พื้นที่ร่วมที่ใช้เพื่อสุขภาพ" },
      { word: "edge car park", thaiMeaning: "ที่จอดรถชานเมือง" },
      { word: "shuttle bus", thaiMeaning: "รถรับส่ง" }
    ]
  }),
  generalTrainingPrompt({
    id: 'gt-t2-dbv-4',
    number: 4,
    typeId: 'discuss-both-views',
    track: 'general-training',
    title: 'Training at Work',
    questionText:
      'Some people think employers should provide training during working hours. Others believe employees should develop new skills in their own time. Discuss both views and give your own opinion.',
    meta: META,
    paragraphs: [
      {
        role: 'intro',
        text: 'It is widely acknowledged that workplace training plays an important role in employee development. However, people disagree about who should provide the time. I believe that required job training should happen during paid hours, and the reasons will be elaborated in this essay.',
        thai: 'เป็นที่ยอมรับกันอย่างกว้างขวางว่าการฝึกอบรมในสถานที่ทำงานมีบทบาทสำคัญต่อการพัฒนาพนักงาน อย่างไรก็ตาม ผู้คนมีความเห็นไม่ตรงกันว่าใครควรเป็นผู้ให้เวลาสำหรับการฝึกอบรม ผมเชื่อว่าการฝึกอบรมที่จำเป็นสำหรับงานควรเกิดขึ้นในช่วงเวลาทำงานที่ได้รับค่าจ้าง และเหตุผลจะถูกอธิบายอย่างละเอียดในเรียงความนี้'
      },
      {
        role: 'body1',
        text: 'To begin with, it might seem reasonable for some to claim that employees should study privately when skills mainly support personal career plans. To explain it simply, this is because evening courses let workers choose qualifications for changing companies, entering another field or following an interest. For example, an office worker could take a weekend language course that is unnecessary now but useful for a future job abroad.',
        thai: 'เริ่มต้นด้วย อาจดูสมเหตุสมผลที่บางคนจะกล่าวอ้างว่าพนักงานควรศึกษาด้วยตนเองในเวลาส่วนตัวเมื่อทักษะนั้นสนับสนุนแผนอาชีพส่วนบุคคลเป็นหลัก อธิบายให้เข้าใจง่ายคือ เพราะว่าคอร์สเรียนตอนเย็นทำให้พนักงานสามารถเลือกคุณวุฒิสำหรับการเปลี่ยนบริษัท เข้าสู่สายงานอื่น หรือติดตามความสนใจส่วนตัวได้ ตัวอย่างเช่น พนักงานออฟฟิศอาจเรียนคอร์สภาษาช่วงสุดสัปดาห์ ซึ่งไม่จำเป็นในตอนนี้แต่มีประโยชน์สำหรับงานในอนาคตต่างประเทศ'
      },
      {
        role: 'body2',
        text: 'However, some might argue that employers must provide paid training when staff need it to perform existing work safely and accurately. To put it simply, this is due to the fact that a business benefits and cannot expect employees to learn required systems after work. For instance, a factory introducing machinery should arrange supervised practice so every operator receives accurate instructions and avoids accidents.',
        thai: 'อย่างไรก็ตาม บางคนอาจโต้แย้งว่านายจ้างต้องจัดการฝึกอบรมที่ได้รับค่าจ้างเมื่อพนักงานต้องการทักษะนั้นเพื่อปฏิบัติงานปัจจุบันอย่างปลอดภัยและถูกต้อง พูดให้เข้าใจง่ายคือ เนื่องมาจากธุรกิจเป็นผู้ได้รับประโยชน์ และไม่สามารถคาดหวังให้พนักงานเรียนรู้ระบบที่จำเป็นหลังเลิกงานได้ ตัวอย่างเช่น โรงงานที่นำเครื่องจักรใหม่เข้ามาควรจัดการฝึกปฏิบัติภายใต้การควบคุมดูแล เพื่อให้ผู้ปฏิบัติงานทุกคนได้รับคำแนะนำที่ถูกต้องและหลีกเลี่ยงอุบัติเหตุ'
      },
      {
        role: 'body3',
        text: 'Personally, I would argue that responsibility depends on whether the present employer requires the skill or the employee chooses it for broader development. My reasoning is that businesses should pay for workplace knowledge, while workers can invest personal time in other goals. To illustrate, company software training should happen at work, but an optional photography qualification can be completed during evenings.',
        thai: 'ในความเห็นส่วนตัว ผมขอโต้แย้งว่าความรับผิดชอบขึ้นอยู่กับว่านายจ้างในปัจจุบันต้องการทักษะนั้นหรือพนักงานเป็นผู้เลือกเพื่อการพัฒนาที่กว้างขึ้น เหตุผลของผมคือธุรกิจควรจ่ายค่าใช้จ่ายสำหรับความรู้ที่เกี่ยวกับงาน ในขณะที่พนักงานสามารถลงทุนเวลาส่วนตัวไปกับเป้าหมายอื่นได้ เพื่อยกตัวอย่าง การฝึกอบรมซอฟต์แวร์ของบริษัทควรเกิดขึ้นในที่ทำงาน แต่คุณวุฒิด้านการถ่ายภาพซึ่งเป็นทางเลือกสามารถเรียนในช่วงเย็นได้'
      },
      {
        role: 'conclusion',
        text: 'In conclusion, although it is undeniable that employees can pursue optional qualifications in personal time, I am of the opinion that employers should provide paid training for every skill they require staff to use.',
        thai: 'สรุปแล้ว แม้ว่าจะปฏิเสธไม่ได้ว่าพนักงานสามารถศึกษาคุณวุฒิที่เป็นทางเลือกในเวลาส่วนตัวได้ แต่ผมมีความเห็นว่านายจ้างควรจัดการฝึกอบรมที่ได้รับค่าจ้างสำหรับทุกทักษะที่พวกเขาต้องการให้พนักงานใช้'
      }
    ],
    vocab: [
      { word: "paid hours", thaiMeaning: "ชั่วโมงทำงานที่ได้รับค่าจ้าง" },
      { word: "present employer", thaiMeaning: "นายจ้างปัจจุบัน" },
      { word: "accurate instructions", thaiMeaning: "คำแนะนำที่ถูกต้อง" },
      { word: "workplace training", thaiMeaning: "การฝึกอบรมในที่ทำงาน" },
      { word: "employee development", thaiMeaning: "การพัฒนาพนักงาน" },
      { word: "required job training", thaiMeaning: "การฝึกอบรมที่จำเป็นต่องาน" },
      { word: "study privately", thaiMeaning: "เรียนด้วยตนเองนอกเวลา" },
      { word: "personal career plans", thaiMeaning: "แผนอาชีพส่วนตัว" },
      { word: "evening courses", thaiMeaning: "คอร์สเรียนตอนเย็น" },
      { word: "changing companies", thaiMeaning: "ย้ายบริษัท" },
      { word: "entering another field", thaiMeaning: "เข้าสู่สายงานอื่น" },
      { word: "weekend language course", thaiMeaning: "คอร์สภาษาวันหยุดสุดสัปดาห์" },
      { word: "future job abroad", thaiMeaning: "งานในต่างประเทศในอนาคต" },
      { word: "paid training", thaiMeaning: "การฝึกอบรมที่ได้รับค่าจ้าง" },
      { word: "perform existing work", thaiMeaning: "ปฏิบัติงานปัจจุบัน" },
      { word: "safely and accurately", thaiMeaning: "อย่างปลอดภัยและถูกต้อง" },
      { word: "required systems", thaiMeaning: "ระบบที่จำเป็นต่องาน" },
      { word: "introducing machinery", thaiMeaning: "การนำเครื่องจักรมาใช้" },
      { word: "supervised practice", thaiMeaning: "การฝึกภายใต้การดูแล" },
      { word: "avoids accidents", thaiMeaning: "หลีกเลี่ยงอุบัติเหตุ" },
      { word: "broader development", thaiMeaning: "การพัฒนาในวงกว้างขึ้น" },
      { word: "workplace knowledge", thaiMeaning: "ความรู้ที่ใช้ในการทำงาน" },
      { word: "personal time", thaiMeaning: "เวลาส่วนตัว" },
      { word: "company software training", thaiMeaning: "การฝึกใช้ซอฟต์แวร์ของบริษัท" },
      { word: "optional photography qualification", thaiMeaning: "คุณวุฒิทางเลือกด้านการถ่ายภาพ" },
      { word: "optional qualifications", thaiMeaning: "คุณวุฒิทางเลือก" },
      { word: "office worker", thaiMeaning: "พนักงานออฟฟิศ" },
      { word: "existing work safely", thaiMeaning: "ทำงานปัจจุบันอย่างปลอดภัย" }
    ]
  }),

  generalTrainingPrompt({
    id: 'gt-t2-ad-1',
    number: 1,
    typeId: 'advantages-disadvantages',
    track: 'general-training',
    title: 'Working After Retirement Age',
    questionText:
      'In some countries, an increasing number of people continue working after the usual retirement age. Do the advantages of this trend outweigh the disadvantages?',
    meta: META,
    paragraphs: [
      {
        role: 'intro',
        text: 'It has been widely argued that while working beyond the usual retirement age is both beneficial and detrimental for individuals and society, this essay argues that the benefits are far greater than the drawbacks when older people have a genuine choice and suitable duties.',
        thai: 'มีการถกเถียงกันอย่างกว้างขวางว่า แม้การทำงานเกินอายุเกษียณปกติจะมีทั้งประโยชน์และโทษต่อบุคคลและสังคม แต่เรียงความนี้จะโต้แย้งว่าประโยชน์นั้นมีมากกว่าข้อเสียอย่างมาก เมื่อผู้สูงอายุมีทางเลือกที่แท้จริงและหน้าที่ที่เหมาะสม'
      },
      {
        role: 'body1',
        text: 'To begin with, there are a number of benefits associated with people working after the usual retirement age. The first benefit is that employment provides extra income, routine and social contact when living costs rise. For example, an older receptionist working three mornings can pay bills while remaining active and speaking with customers. Another advantage is that experienced staff can guide younger colleagues and pass on practical knowledge. For instance, a senior mechanic could train new employees part-time, helping the business keep useful experience without demanding a full working week.',
        thai: 'เริ่มต้นด้วย มีประโยชน์หลายประการที่เกี่ยวข้องกับการที่ผู้คนทำงานหลังอายุเกษียณปกติ ประโยชน์ประการแรกคือการจ้างงานให้รายได้เพิ่มเติม กิจวัตร และการติดต่อทางสังคม เมื่อค่าครองชีพสูงขึ้น ตัวอย่างเช่น พนักงานต้อนรับสูงวัยที่ทำงานสามเช้าต่อสัปดาห์สามารถจ่ายค่าใช้จ่ายต่างๆ ได้ ในขณะที่ยังคงกระฉับกระเฉงและได้พูดคุยกับลูกค้า ข้อดีอีกประการหนึ่งคือพนักงานที่มีประสบการณ์สามารถชี้แนะเพื่อนร่วมงานที่อายุน้อยกว่าและถ่ายทอดความรู้เชิงปฏิบัติได้ ตัวอย่างเช่น ช่างเครื่องอาวุโสสามารถฝึกอบรมพนักงานใหม่แบบพาร์ทไทม์ ซึ่งช่วยให้ธุรกิจรักษาประสบการณ์ที่เป็นประโยชน์ไว้ได้โดยไม่ต้องเรียกร้องให้ทำงานเต็มสัปดาห์'
      },
      {
        role: 'body2',
        text: 'However, some might be concerned regarding older people who work only because their pension is too small despite declining health. This is because physical duties become painful with age, while work reduces time for family, hobbies and rest. To illustrate, a construction worker with back problems may remain in a tiring position simply to cover food and rent. However, this argument is not fully convincing given that adequate pensions, reduced hours and lighter duties can protect older workers. For example, the worker could choose a two-day training role or retire, making employment an opportunity rather than a necessity.',
        thai: 'อย่างไรก็ตาม บางคนอาจกังวลเกี่ยวกับผู้สูงอายุที่ทำงานเพียงเพราะเงินบำนาญของพวกเขามีน้อยเกินไป ทั้งที่สุขภาพกำลังทรุดโทรมลง ทั้งนี้เพราะว่าหน้าที่ที่ต้องใช้แรงกายกลายเป็นเรื่องเจ็บปวดเมื่ออายุมากขึ้น ในขณะที่การทำงานลดเวลาสำหรับครอบครัว งานอดิเรก และการพักผ่อน เพื่อยกตัวอย่าง คนงานก่อสร้างที่มีปัญหาหลังอาจต้องอยู่ในท่าที่เหนื่อยล้าเพียงเพื่อให้ครอบคลุมค่าอาหารและค่าเช่า อย่างไรก็ตาม ข้อโต้แย้งนี้ยังไม่น่าเชื่อถือทั้งหมด เนื่องจากเงินบำนาญที่เพียงพอ ชั่วโมงการทำงานที่ลดลง และหน้าที่ที่เบาลงสามารถปกป้องพนักงานสูงวัยได้ ตัวอย่างเช่น พนักงานคนนั้นอาจเลือกตำแหน่งฝึกอบรมสองวันต่อสัปดาห์ หรือเกษียณอายุ ซึ่งทำให้การจ้างงานเป็นโอกาสมากกว่าความจำเป็น'
      },
      {
        role: 'conclusion',
        text: 'In conclusion, although it is undeniable that some might be concerned in terms of financial pressure and declining health, I am of the opinion that the benefits, including extra income and shared experience, are far greater than the drawbacks.',
        thai: 'สรุปแล้ว แม้ว่าจะปฏิเสธไม่ได้ว่าบางคนอาจกังวลในแง่ของแรงกดดันทางการเงินและสุขภาพที่ทรุดโทรมลง แต่ผมมีความเห็นว่าประโยชน์ รวมถึงรายได้เพิ่มเติมและการแบ่งปันประสบการณ์ มีมากกว่าข้อเสียอย่างมาก'
      }
    ],
    vocab: [
      { word: "retirement age", thaiMeaning: "อายุเกษียณ" },
      { word: "social contact", thaiMeaning: "การติดต่อทางสังคม" },
      { word: "practical knowledge", thaiMeaning: "ความรู้เชิงปฏิบัติ" },
      { word: "adequate pension", thaiMeaning: "เงินบำนาญที่เพียงพอ" },
      { word: "genuine choice", thaiMeaning: "ทางเลือกอย่างแท้จริง" },
      { word: "suitable duties", thaiMeaning: "หน้าที่ที่เหมาะสม" },
      { word: "extra income", thaiMeaning: "รายได้เสริม" },
      { word: "living costs rise", thaiMeaning: "ค่าครองชีพที่สูงขึ้น" },
      { word: "older receptionist", thaiMeaning: "พนักงานต้อนรับสูงอายุ" },
      { word: "remaining active", thaiMeaning: "คงความกระตือรือร้น" },
      { word: "speaking with customers", thaiMeaning: "พูดคุยกับลูกค้า" },
      { word: "experienced staff", thaiMeaning: "พนักงานที่มีประสบการณ์" },
      { word: "younger colleagues", thaiMeaning: "เพื่อนร่วมงานที่อายุน้อยกว่า" },
      { word: "senior mechanic", thaiMeaning: "ช่างเครื่องอาวุโส" },
      { word: "full working week", thaiMeaning: "สัปดาห์การทำงานเต็มเวลา" },
      { word: "declining health", thaiMeaning: "สุขภาพที่ถดถอย" },
      { word: "physical duties", thaiMeaning: "งานที่ใช้แรงกาย" },
      { word: "construction worker", thaiMeaning: "คนงานก่อสร้าง" },
      { word: "back problems", thaiMeaning: "ปัญหาหลัง" },
      { word: "tiring position", thaiMeaning: "งานที่เหนื่อยล้า" },
      { word: "cover food and rent", thaiMeaning: "จ่ายค่าอาหารและค่าเช่า" },
      { word: "reduced hours", thaiMeaning: "ชั่วโมงทำงานที่ลดลง" },
      { word: "lighter duties", thaiMeaning: "หน้าที่ที่เบากว่า" },
      { word: "older workers", thaiMeaning: "แรงงานสูงอายุ" },
      { word: "two-day training role", thaiMeaning: "งานฝึกอบรมสองวันต่อสัปดาห์" },
      { word: "financial pressure", thaiMeaning: "แรงกดดันด้านการเงิน" },
      { word: "shared experience", thaiMeaning: "ประสบการณ์ที่แบ่งปัน" },
      { word: "keep useful experience", thaiMeaning: "รักษาประสบการณ์ที่มีประโยชน์" }
    ]
  }),
  generalTrainingPrompt({
    id: 'gt-t2-ad-2',
    number: 2,
    typeId: 'advantages-disadvantages',
    track: 'general-training',
    title: 'Tourists Staying in Local Homes',
    questionText:
      'More tourists are choosing to stay in local people’s homes rather than in hotels. Do the advantages of this development outweigh the disadvantages?',
    meta: META,
    paragraphs: [
      {
        role: 'intro',
        text: 'It has been widely argued that while tourists staying in local people’s homes is both beneficial and detrimental for holiday destinations, this essay argues that the benefits are far greater than the drawbacks when local authorities set clear rules for short-term accommodation.',
        thai: 'มีการถกเถียงกันอย่างกว้างขวางว่า แม้การที่นักท่องเที่ยวพักในบ้านของคนท้องถิ่นจะมีทั้งประโยชน์และโทษต่อจุดหมายปลายทางการท่องเที่ยว แต่เรียงความนี้จะโต้แย้งว่าประโยชน์นั้นมีมากกว่าข้อเสียอย่างมาก เมื่อหน่วยงานท้องถิ่นกำหนดกฎเกณฑ์ที่ชัดเจนสำหรับที่พักระยะสั้น'
      },
      {
        role: 'body1',
        text: 'To begin with, there are a number of benefits associated with tourists choosing local homes instead of hotels. The first benefit is that income goes directly to residents, while guests spend in nearby cafés and shops. For example, a family can host weekend visitors and recommend a neighbourhood restaurant, supporting two local budgets. Another advantage is that staying with residents gives tourists a personal view of daily life and spreads visitors beyond busy streets. For instance, a host might explain transport, introduce traditional food and suggest a quiet market that hotel guests could miss.',
        thai: 'เริ่มต้นด้วย มีประโยชน์หลายประการที่เกี่ยวข้องกับการที่นักท่องเที่ยวเลือกพักในบ้านของคนท้องถิ่นแทนโรงแรม ประโยชน์ประการแรกคือรายได้ตกไปถึงผู้อยู่อาศัยโดยตรง ในขณะที่แขกก็ใช้จ่ายในร้านกาแฟและร้านค้าใกล้เคียง ตัวอย่างเช่น ครอบครัวหนึ่งสามารถต้อนรับผู้มาเยือนช่วงสุดสัปดาห์และแนะนำร้านอาหารในย่านนั้น ซึ่งสนับสนุนงบประมาณของคนท้องถิ่นสองราย ข้อดีอีกประการหนึ่งคือการพักอยู่กับผู้อยู่อาศัยทำให้นักท่องเที่ยวได้มุมมองส่วนตัวเกี่ยวกับชีวิตประจำวัน และกระจายนักท่องเที่ยวออกไปจากถนนสายที่พลุกพล่าน ตัวอย่างเช่น เจ้าของบ้านอาจอธิบายเรื่องการเดินทาง แนะนำอาหารดั้งเดิม และแนะนำตลาดเงียบสงบที่แขกโรงแรมอาจพลาดไป'
      },
      {
        role: 'body2',
        text: 'However, some might be concerned regarding effects on neighbours, housing costs and guests using unchecked rooms. This is because late arrivals create noise, while owners may remove homes from long-term rental when tourists pay more. To illustrate, workers could face higher rent after nearby apartments become holiday accommodation, and residents may lose sleep. However, this argument is not fully convincing given that councils can limit rental days, require fire checks and register hosts. For example, a licensed host could accept bookings part of the year and give visitors firm rules about noise and rubbish.',
        thai: 'อย่างไรก็ตาม บางคนอาจกังวลเกี่ยวกับผลกระทบต่อเพื่อนบ้าน ค่าที่อยู่อาศัย และแขกที่ใช้ห้องพักที่ไม่ได้รับการตรวจสอบ ทั้งนี้เพราะว่าการมาถึงในเวลาดึกก่อให้เกิดเสียงรบกวน ในขณะที่เจ้าของบ้านอาจถอนบ้านออกจากตลาดเช่าระยะยาวเมื่อนักท่องเที่ยวจ่ายเงินได้มากกว่า เพื่อยกตัวอย่าง คนทำงานอาจต้องเผชิญค่าเช่าที่สูงขึ้นหลังจากอพาร์ตเมนต์ใกล้เคียงกลายเป็นที่พักสำหรับนักท่องเที่ยว และผู้อยู่อาศัยอาจสูญเสียการนอนหลับ อย่างไรก็ตาม ข้อโต้แย้งนี้ยังไม่น่าเชื่อถือทั้งหมด เนื่องจากสภาท้องถิ่นสามารถจำกัดจำนวนวันให้เช่า กำหนดให้มีการตรวจสอบด้านอัคคีภัย และขึ้นทะเบียนเจ้าของที่พักได้ ตัวอย่างเช่น เจ้าของที่พักที่ได้รับใบอนุญาตสามารถรับการจองได้เพียงบางช่วงของปี และให้กฎเกณฑ์ที่ชัดเจนแก่ผู้มาเยือนเกี่ยวกับเสียงรบกวนและขยะ'
      },
      {
        role: 'conclusion',
        text: 'In conclusion, although it is undeniable that some might be concerned in terms of neighbourhood noise and housing costs, I am of the opinion that the benefits, including local income and richer travel experiences, are far greater than the drawbacks.',
        thai: 'สรุปแล้ว แม้ว่าจะปฏิเสธไม่ได้ว่าบางคนอาจกังวลในแง่ของเสียงรบกวนในย่านที่พักและค่าที่อยู่อาศัย แต่ผมมีความเห็นว่าประโยชน์ รวมถึงรายได้ในท้องถิ่นและประสบการณ์การเดินทางที่หลากหลายยิ่งขึ้น มีมากกว่าข้อเสียอย่างมาก'
      }
    ],
    vocab: [
      { word: "local home", thaiMeaning: "บ้านของคนท้องถิ่น" },
      { word: "holiday destination", thaiMeaning: "จุดหมายปลายทางสำหรับวันหยุด" },
      { word: "short-term accommodation", thaiMeaning: "ที่พักระยะสั้น" },
      { word: "housing cost", thaiMeaning: "ค่าที่อยู่อาศัย" },
      { word: "local people’s homes", thaiMeaning: "บ้านของคนท้องถิ่น" },
      { word: "local authorities", thaiMeaning: "หน่วยงานท้องถิ่น" },
      { word: "clear rules", thaiMeaning: "กฎที่ชัดเจน" },
      { word: "nearby cafés and shops", thaiMeaning: "คาเฟ่และร้านค้าใกล้เคียง" },
      { word: "weekend visitors", thaiMeaning: "ผู้มาเยือนช่วงสุดสัปดาห์" },
      { word: "neighbourhood restaurant", thaiMeaning: "ร้านอาหารในละแวกบ้าน" },
      { word: "local budgets", thaiMeaning: "งบประมาณของคนท้องถิ่น" },
      { word: "personal view of daily life", thaiMeaning: "มุมมองส่วนตัวต่อชีวิตประจำวัน" },
      { word: "busy streets", thaiMeaning: "ถนนที่แออัด" },
      { word: "traditional food", thaiMeaning: "อาหารพื้นบ้าน" },
      { word: "quiet market", thaiMeaning: "ตลาดเงียบสงบ" },
      { word: "late arrivals", thaiMeaning: "การมาถึงดึก" },
      { word: "long-term rental", thaiMeaning: "การเช่าระยะยาว" },
      { word: "holiday accommodation", thaiMeaning: "ที่พักสำหรับนักท่องเที่ยว" },
      { word: "lose sleep", thaiMeaning: "นอนไม่หลับ" },
      { word: "limit rental days", thaiMeaning: "จำกัดจำนวนวันที่ให้เช่า" },
      { word: "require fire checks", thaiMeaning: "กำหนดให้ตรวจระบบดับเพลิง" },
      { word: "register hosts", thaiMeaning: "ขึ้นทะเบียนผู้ให้เช่า" },
      { word: "licensed host", thaiMeaning: "เจ้าของบ้านที่ได้รับอนุญาต" },
      { word: "firm rules", thaiMeaning: "กฎที่ชัดเจนเข้มงวด" },
      { word: "neighbourhood noise", thaiMeaning: "เสียงรบกวนในละแวกบ้าน" },
      { word: "local income", thaiMeaning: "รายได้ของคนท้องถิ่น" },
      { word: "richer travel experiences", thaiMeaning: "ประสบการณ์ท่องเที่ยวที่สมบูรณ์ขึ้น" },
      { word: "unchecked rooms", thaiMeaning: "ห้องที่ไม่ได้ตรวจสอบ" }
    ]
  }),
  generalTrainingPrompt({
    id: 'gt-t2-ad-3',
    number: 3,
    typeId: 'advantages-disadvantages',
    track: 'general-training',
    title: 'Self-Service Technology',
    questionText:
      'Self-service machines and apps are replacing staff in many shops and public services. Do the advantages of this development outweigh the disadvantages?',
    meta: META,
    paragraphs: [
      {
        role: 'intro',
        text: 'It has been widely argued that while self-service technology in shops and public services is both beneficial and detrimental for customers, this essay argues that the benefits are far greater than the drawbacks when trained staff remain available to provide human help.',
        thai: 'มีการถกเถียงกันอย่างกว้างขวางว่า แม้เทคโนโลยีบริการตนเองในร้านค้าและบริการสาธารณะจะมีทั้งประโยชน์และโทษต่อลูกค้า แต่เรียงความนี้จะโต้แย้งว่าประโยชน์นั้นมีมากกว่าข้อเสียอย่างมาก เมื่อยังคงมีเจ้าหน้าที่ที่ผ่านการฝึกอบรมพร้อมให้ความช่วยเหลือจากมนุษย์'
      },
      {
        role: 'body1',
        text: 'To begin with, there are a number of benefits associated with self-service machines and applications. The first benefit is that customers complete simple tasks quickly, avoiding queues or travel during limited office hours. For example, a passenger can buy a ticket by phone, while a shopper with one item uses an automatic checkout. Another advantage is that organisations can move employees from repetitive transactions to duties needing patience and judgement. For instance, visitors could borrow books through a machine while library staff help children or older users needing personal support.',
        thai: 'เริ่มต้นด้วย มีประโยชน์หลายประการที่เกี่ยวข้องกับเครื่องบริการตนเองและแอปพลิเคชัน ประโยชน์ประการแรกคือลูกค้าสามารถทำธุระง่ายๆ ได้อย่างรวดเร็ว หลีกเลี่ยงการต่อคิวหรือการเดินทางในช่วงเวลาทำการที่จำกัดของสำนักงาน ตัวอย่างเช่น ผู้โดยสารสามารถซื้อตั๋วผ่านโทรศัพท์ได้ ในขณะที่ผู้ซื้อของที่มีสินค้าเพียงชิ้นเดียวใช้จุดชำระเงินอัตโนมัติ ข้อดีอีกประการหนึ่งคือองค์กรสามารถย้ายพนักงานจากงานทำธุรกรรมที่ซ้ำซากไปสู่หน้าที่ที่ต้องใช้ความอดทนและวิจารณญาณ ตัวอย่างเช่น ผู้มาเยือนสามารถยืมหนังสือผ่านเครื่องได้ ในขณะที่เจ้าหน้าที่ห้องสมุดช่วยเหลือเด็กหรือผู้สูงอายุที่ต้องการการสนับสนุนส่วนตัว'
      },
      {
        role: 'body2',
        text: 'However, some might be concerned regarding the exclusion of older people, disabled users and customers without reliable internet. This is because technology may reject payment, ignore unusual situations or offer no patient explanation when someone is confused. To illustrate, an online form may stop because one answer does not fit, with no employee available to help. However, this argument is not fully convincing given that digital systems can operate beside trained staff and telephone support. For example, a shop can provide self-checkouts while keeping a staffed desk for technical problems and customers preferring personal help.',
        thai: 'อย่างไรก็ตาม บางคนอาจกังวลเกี่ยวกับการกีดกันผู้สูงอายุ ผู้พิการ และลูกค้าที่ไม่มีอินเทอร์เน็ตที่เชื่อถือได้ ทั้งนี้เพราะว่าเทคโนโลยีอาจปฏิเสธการชำระเงิน ละเลยสถานการณ์ที่ผิดปกติ หรือไม่มีคำอธิบายอย่างอดทนเมื่อมีคนสับสน เพื่อยกตัวอย่าง แบบฟอร์มออนไลน์อาจหยุดทำงานเพราะคำตอบข้อหนึ่งไม่ตรงตามเงื่อนไข โดยไม่มีพนักงานคอยช่วยเหลือ อย่างไรก็ตาม ข้อโต้แย้งนี้ยังไม่น่าเชื่อถือทั้งหมด เนื่องจากระบบดิจิทัลสามารถทำงานควบคู่ไปกับเจ้าหน้าที่ที่ผ่านการฝึกอบรมและการสนับสนุนทางโทรศัพท์ได้ ตัวอย่างเช่น ร้านค้าสามารถจัดให้มีจุดชำระเงินด้วยตนเอง ในขณะที่ยังคงมีเคาน์เตอร์ที่มีเจ้าหน้าที่ประจำสำหรับปัญหาทางเทคนิคและลูกค้าที่ต้องการความช่วยเหลือส่วนตัว'
      },
      {
        role: 'conclusion',
        text: 'In conclusion, although it is undeniable that some might be concerned in terms of digital exclusion and technical failures, I am of the opinion that the benefits, including faster service and better use of staff, are far greater than the drawbacks.',
        thai: 'สรุปแล้ว แม้ว่าจะปฏิเสธไม่ได้ว่าบางคนอาจกังวลในแง่ของการถูกกีดกันทางดิจิทัลและความล้มเหลวทางเทคนิค แต่ผมมีความเห็นว่าประโยชน์ รวมถึงบริการที่รวดเร็วขึ้นและการใช้พนักงานอย่างมีประสิทธิภาพมากขึ้น มีมากกว่าข้อเสียอย่างมาก'
      }
    ],
    vocab: [
      { word: "self-service technology", thaiMeaning: "เทคโนโลยีบริการตนเอง" },
      { word: "automatic checkout", thaiMeaning: "จุดชำระเงินอัตโนมัติ" },
      { word: "reliable internet", thaiMeaning: "อินเทอร์เน็ตที่เชื่อถือได้" },
      { word: "trained staff", thaiMeaning: "เจ้าหน้าที่ที่ผ่านการฝึกอบรม" },
      { word: "public services", thaiMeaning: "บริการสาธารณะ" },
      { word: "human help", thaiMeaning: "ความช่วยเหลือจากคน" },
      { word: "self-service machines", thaiMeaning: "เครื่องบริการตนเอง" },
      { word: "simple tasks", thaiMeaning: "งานง่าย ๆ" },
      { word: "limited office hours", thaiMeaning: "เวลาทำการที่จำกัด" },
      { word: "buy a ticket by phone", thaiMeaning: "ซื้อตั๋วผ่านโทรศัพท์" },
      { word: "repetitive transactions", thaiMeaning: "ธุรกรรมที่ซ้ำซาก" },
      { word: "patience and judgement", thaiMeaning: "ความอดทนและการตัดสินใจ" },
      { word: "borrow books", thaiMeaning: "ยืมหนังสือ" },
      { word: "personal support", thaiMeaning: "การช่วยเหลือส่วนบุคคล" },
      { word: "disabled users", thaiMeaning: "ผู้ใช้ที่มีความพิการ" },
      { word: "reject payment", thaiMeaning: "ปฏิเสธการชำระเงิน" },
      { word: "unusual situations", thaiMeaning: "สถานการณ์ผิดปกติ" },
      { word: "patient explanation", thaiMeaning: "คำอธิบายอย่างอดทน" },
      { word: "online form", thaiMeaning: "แบบฟอร์มออนไลน์" },
      { word: "digital systems", thaiMeaning: "ระบบดิจิทัล" },
      { word: "telephone support", thaiMeaning: "การสนับสนุนทางโทรศัพท์" },
      { word: "self-checkouts", thaiMeaning: "จุดชำระเงินด้วยตนเอง" },
      { word: "staffed desk", thaiMeaning: "เคาน์เตอร์ที่มีเจ้าหน้าที่" },
      { word: "technical problems", thaiMeaning: "ปัญหาทางเทคนิค" },
      { word: "personal help", thaiMeaning: "ความช่วยเหลือแบบพบคน" },
      { word: "digital exclusion", thaiMeaning: "การถูกตัดออกจากโลกดิจิทัล" },
      { word: "technical failures", thaiMeaning: "ความล้มเหลวทางเทคนิค" },
      { word: "faster service", thaiMeaning: "บริการที่รวดเร็วขึ้น" }
    ]
  }),
  generalTrainingPrompt({
    id: 'gt-t2-ad-4',
    number: 4,
    typeId: 'advantages-disadvantages',
    track: 'general-training',
    title: 'Community Gardens',
    questionText:
      'In many towns, unused land is being turned into gardens where local residents grow food together. Do the advantages of this development outweigh the disadvantages?',
    meta: META,
    paragraphs: [
      {
        role: 'intro',
        text: 'It has been widely argued that while turning unused urban land into community gardens is both beneficial and detrimental for local residents, this essay argues that the benefits are far greater than the drawbacks when gardens are managed through clear and fair rules.',
        thai: 'มีการถกเถียงกันอย่างกว้างขวางว่า แม้การเปลี่ยนที่ดินในเมืองที่ไม่ได้ใช้งานให้เป็นสวนชุมชนจะมีทั้งประโยชน์และโทษต่อผู้อยู่อาศัยในท้องถิ่น แต่เรียงความนี้จะโต้แย้งว่าประโยชน์นั้นมีมากกว่าข้อเสียอย่างมาก เมื่อสวนได้รับการบริหารจัดการผ่านกฎเกณฑ์ที่ชัดเจนและเป็นธรรม'
      },
      {
        role: 'body1',
        text: 'To begin with, there are a number of benefits associated with changing unused urban land into community gardens. The first benefit is that plants improve empty land while providing fresh food and gentle exercise. For example, families can grow tomatoes and herbs cheaply on a neglected plot instead of leaving rubbish and weeds. Another advantage is that neighbours of different ages can share tools, exchange advice and build friendships through a common project. For instance, an experienced gardener can teach children to plant seeds, while a new resident meets nearby families naturally.',
        thai: 'เริ่มต้นด้วย มีประโยชน์หลายประการที่เกี่ยวข้องกับการเปลี่ยนที่ดินในเมืองที่ไม่ได้ใช้งานให้เป็นสวนชุมชน ประโยชน์ประการแรกคือพืชพันธุ์ช่วยปรับปรุงที่ดินว่างเปล่า พร้อมทั้งให้อาหารสดและการออกกำลังกายเบาๆ ตัวอย่างเช่น ครอบครัวต่างๆ สามารถปลูกมะเขือเทศและสมุนไพรในราคาถูกบนที่ดินที่ถูกทอดทิ้ง แทนที่จะปล่อยให้มีขยะและวัชพืช ข้อดีอีกประการหนึ่งคือเพื่อนบ้านต่างวัยสามารถแบ่งปันเครื่องมือ แลกเปลี่ยนคำแนะนำ และสร้างมิตรภาพผ่านโครงการร่วมกันได้ ตัวอย่างเช่น ชาวสวนที่มีประสบการณ์สามารถสอนเด็กๆ ปลูกเมล็ดพันธุ์ ในขณะที่ผู้อยู่อาศัยใหม่ได้พบปะกับครอบครัวใกล้เคียงอย่างเป็นธรรมชาติ'
      },
      {
        role: 'body2',
        text: 'However, some might be concerned regarding water costs, shared land, insects, noise and untidy storage near homes. This is because gardens need regular care, and members may disagree about plots, expenses or unpleasant tasks. To illustrate, one neighbour might water plants while another takes vegetables without helping, causing an argument. However, this argument is not fully convincing given that written rules and a committee can set hours, divide costs and assign duties. For example, members could follow a schedule for watering and cleaning while the council explains how long the land remains available.',
        thai: 'อย่างไรก็ตาม บางคนอาจกังวลเกี่ยวกับค่าน้ำ ที่ดินที่ใช้ร่วมกัน แมลง เสียงรบกวน และการเก็บของที่ไม่เป็นระเบียบใกล้บ้านเรือน ทั้งนี้เพราะว่าสวนต้องการการดูแลเป็นประจำ และสมาชิกอาจมีความเห็นไม่ตรงกันเกี่ยวกับแปลงที่ดิน ค่าใช้จ่าย หรืองานที่ไม่น่าพึงพอใจ เพื่อยกตัวอย่าง เพื่อนบ้านคนหนึ่งอาจรดน้ำต้นไม้ในขณะที่อีกคนเก็บผักไปโดยไม่ช่วยเหลือ ซึ่งก่อให้เกิดการโต้เถียง อย่างไรก็ตาม ข้อโต้แย้งนี้ยังไม่น่าเชื่อถือทั้งหมด เนื่องจากกฎเกณฑ์ที่เป็นลายลักษณ์อักษรและคณะกรรมการสามารถกำหนดเวลา แบ่งค่าใช้จ่าย และมอบหมายหน้าที่ได้ ตัวอย่างเช่น สมาชิกสามารถปฏิบัติตามตารางเวลาสำหรับการรดน้ำและทำความสะอาด ในขณะที่สภาเมืองอธิบายว่าที่ดินนั้นจะยังคงใช้งานได้นานเท่าใด'
      },
      {
        role: 'conclusion',
        text: 'In conclusion, although it is undeniable that some might be concerned in terms of maintenance costs and local disagreements, I am of the opinion that the benefits, including greener land and stronger neighbourly contact, are far greater than the drawbacks.',
        thai: 'สรุปแล้ว แม้ว่าจะปฏิเสธไม่ได้ว่าบางคนอาจกังวลในแง่ของค่าใช้จ่ายในการบำรุงรักษาและความขัดแย้งในท้องถิ่น แต่ผมมีความเห็นว่าประโยชน์ รวมถึงพื้นที่สีเขียวที่มากขึ้นและความสัมพันธ์กับเพื่อนบ้านที่แน่นแฟ้นยิ่งขึ้น มีมากกว่าข้อเสียอย่างมาก'
      }
    ],
    vocab: [
      { word: "unused urban land", thaiMeaning: "ที่ดินในเมืองที่ไม่ได้ใช้" },
      { word: "community garden", thaiMeaning: "สวนชุมชน" },
      { word: "fresh food", thaiMeaning: "อาหารสด" },
      { word: "gentle exercise", thaiMeaning: "การออกกำลังกายเบา ๆ" },
      { word: "share tools", thaiMeaning: "ใช้เครื่องมือร่วมกัน" },
      { word: "neighbourly contact", thaiMeaning: "ความสัมพันธ์ฉันเพื่อนบ้าน" },
      { word: "local residents", thaiMeaning: "ผู้อยู่อาศัยในท้องถิ่น" },
      { word: "clear and fair rules", thaiMeaning: "กฎที่ชัดเจนและเป็นธรรม" },
      { word: "empty land", thaiMeaning: "ที่ดินว่างเปล่า" },
      { word: "neglected plot", thaiMeaning: "แปลงที่ดินที่ถูกปล่อยร้าง" },
      { word: "rubbish and weeds", thaiMeaning: "ขยะและวัชพืช" },
      { word: "exchange advice", thaiMeaning: "แลกเปลี่ยนคำแนะนำ" },
      { word: "build friendships", thaiMeaning: "สร้างมิตรภาพ" },
      { word: "common project", thaiMeaning: "โครงการร่วมกัน" },
      { word: "experienced gardener", thaiMeaning: "นักจัดสวนที่มีประสบการณ์" },
      { word: "plant seeds", thaiMeaning: "หว่านเมล็ด" },
      { word: "new resident", thaiMeaning: "ผู้อยู่อาศัยใหม่" },
      { word: "water costs", thaiMeaning: "ค่าน้ำ" },
      { word: "untidy storage", thaiMeaning: "การเก็บของรกไม่เป็นระเบียบ" },
      { word: "regular care", thaiMeaning: "การดูแลอย่างสม่ำเสมอ" },
      { word: "unpleasant tasks", thaiMeaning: "งานที่ไม่น่าพึงพอใจ" },
      { word: "written rules", thaiMeaning: "กฎที่เป็นลายลักษณ์อักษร" },
      { word: "assign duties", thaiMeaning: "มอบหมายหน้าที่" },
      { word: "schedule for watering", thaiMeaning: "ตารางการรดน้ำ" },
      { word: "maintenance costs", thaiMeaning: "ค่าบำรุงรักษา" },
      { word: "local disagreements", thaiMeaning: "ความขัดแย้งในท้องถิ่น" },
      { word: "greener land", thaiMeaning: "พื้นที่สีเขียวมากขึ้น" },
      { word: "divide costs", thaiMeaning: "แบ่งค่าใช้จ่าย" }
    ]
  })
]
