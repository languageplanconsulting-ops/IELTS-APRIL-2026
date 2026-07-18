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
        text: 'It is widely acknowledged that flexible working plays an important role in modern employment. However, some employers believe that fixed schedules are necessary for a business to operate smoothly. I believe that most workers should be allowed to choose their hours within reasonable limits, and the reasons will be elaborated in this essay.'
      },
      {
        role: 'body1',
        text: 'To begin with, it might seem reasonable for some to claim that fixed schedules help managers organise staff and customer services without confusion. To explain it simply, this is because every worker is present at known times, so teams can communicate and urgent duties remain covered. For example, a busy shop needs enough employees at lunchtime, while complete freedom could leave customers waiting without help. From this perspective, it is understandable why some people would think that employers should control working times in hospitals, shops and other public services.'
      },
      {
        role: 'body2',
        text: 'However, I would personally argue that controlled flexibility helps workers manage family duties while still meeting their employer’s needs. To put it simply, this is due to the fact that an earlier or later shift can fit around school runs or medical appointments, reducing stress and missed work. For instance, an office worker could start at seven, collect a child after school and attend meetings during agreed core hours. In this respect, it is evident that limited flexibility can improve staff wellbeing without harming operations when managers set clear rules and cover.'
      },
      {
        role: 'conclusion',
        text: 'In conclusion, although it is undeniable that fixed attendance is necessary for some duties and busy periods, I am of the opinion that employers should offer controlled flexibility whenever the nature of the job allows it.'
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
        text: 'It is widely acknowledged that public transport plays an important role in everyday travel. However, making every local bus journey free could place a heavy cost on public budgets. I believe that free bus travel should be offered to people who need it most rather than to all passengers, and the reasons will be elaborated in this essay.'
      },
      {
        role: 'body1',
        text: 'To begin with, it might seem reasonable for some to claim that free buses would make travel fairer and reduce cars on crowded roads. To explain it simply, this is because low-income residents could reach work or appointments without fares, while drivers would have a reason to leave cars at home. For example, a family might take the bus into town if four return tickets added nothing to the day’s cost. From this perspective, it is understandable why some people would think that free travel could improve community access while creating cleaner and safer town centres.'
      },
      {
        role: 'body2',
        text: 'However, I would personally argue that free travel should be limited to groups who genuinely need support rather than every passenger. To put it simply, this is due to the fact that drivers, fuel and repairs require reliable funding, while a fully free system could mean higher taxes or fewer services. For instance, a council could give free passes to children, older residents and low-income workers, while other adults pay an affordable fare. In this respect, it is evident that targeted support can protect vulnerable passengers without removing the income needed for safe and dependable routes.'
      },
      {
        role: 'conclusion',
        text: 'In conclusion, although it is undeniable that free buses can improve access and reduce car use, I am of the opinion that free travel should target selected groups while other passengers pay reasonable fares.'
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
        text: 'It is widely acknowledged that household work plays an important role in a child’s development. However, some parents feel that daily chores take time away from study and rest. I believe that children should complete suitable household tasks each day, and the reasons will be elaborated in this essay.'
      },
      {
        role: 'body1',
        text: 'To begin with, it might seem reasonable for some to claim that daily chores take valuable time from schoolwork and the rest children need. To explain it simply, this is because pupils already spend hours in class and doing homework, so many duties may reduce their concentration. For example, a teenager preparing for an examination could struggle to revise if expected to cook, clean and care for younger children every evening. From this perspective, it is understandable why some people would think that household tasks should be optional or mainly completed by adults.'
      },
      {
        role: 'body2',
        text: 'However, I would personally argue that short daily chores teach responsibility and useful life skills without creating an unfair burden. To put it simply, this is due to the fact that making a bed or feeding a pet shows that a comfortable home depends on shared effort. For instance, a teenager who prepares one family meal can learn cooking and planning, while a younger child builds independence by putting away toys. In this respect, it is evident that brief age-appropriate help develops good habits when dangerous or time-consuming duties remain with adults.'
      },
      {
        role: 'conclusion',
        text: 'In conclusion, although it is undeniable that excessive housework can interfere with study and rest, I am of the opinion that children should complete safe daily tasks suited to their age and available time.'
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
        text: 'It is widely acknowledged that local shopping plays an important role in community life. However, online stores offer a level of convenience and choice that many customers value. I believe that the growth of online shopping can harm local areas unless consumers and businesses use it in a balanced way, and the reasons will be elaborated in this essay.'
      },
      {
        role: 'body1',
        text: 'To begin with, it might seem reasonable for some to claim that online shopping gives residents wider choice, lower prices and convenient home delivery. To explain it simply, this is because people with limited mobility or few nearby stores can buy essential items without a difficult journey. For example, an older resident can order heavy supplies, while a local producer can use a website to reach customers outside town. From this perspective, it is understandable why some people would think that internet shopping improves access and creates opportunities for customers and businesses.'
      },
      {
        role: 'body2',
        text: 'However, I would personally argue that dependence on large online sellers harms local shops, jobs and everyday social contact. To put it simply, this is due to the fact that independent retailers cannot always match internet prices while paying rent, employing staff and giving personal advice. For instance, if residents order every book and gift online, nearby stores may close, leaving empty streets and nowhere to buy something urgently. In this respect, it is evident that consumers should balance online convenience with support for local markets, cafés and specialist stores.'
      },
      {
        role: 'conclusion',
        text: 'In conclusion, although it is undeniable that online shopping offers convenience and wider choice, I am of the opinion that its uncontrolled growth damages local businesses and community life when it replaces most face-to-face trade.'
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
        text: 'It has been widely argued that many working adults move far from their families because suitable employment is often available in another town or region. This essay will elaborate on the reasons for this movement before explaining how people can maintain strong family relationships across long distances.'
      },
      {
        role: 'body1',
        text: 'To begin with, there are a number of reasons associated with adults moving away from family for work. Firstly, large cities usually offer more jobs than small towns. To explain it simply, this is because people may need to relocate to use their qualifications, earn a stable income or accept a promotion. For example, a trained nurse might move because the local clinic has no position while a city hospital needs staff. Another reason is that affordable housing may be easier to find elsewhere. To illustrate, a couple may work in a smaller city where they can rent a home, although their parents remain in an expensive capital.'
      },
      {
        role: 'body2',
        text: 'In terms of the solutions, I would argue that there are two main solutions. The first solution is that relatives should arrange a weekly video call and share short messages about ordinary events instead of speaking only during emergencies. For example, grandparents can watch a child open a birthday gift online and continue feeling involved in everyday life. The second solution is that family members should plan visits and take turns travelling so the cost and effort do not fall on one person. For instance, adult children could visit during one holiday and invite their parents to stay during the next.'
      },
      {
        role: 'conclusion',
        text: 'In conclusion, although it is undeniable that better jobs and affordable housing often lead adults away from home, I am of the opinion that regular communication and planned visits can keep family relationships strong.'
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
        text: 'It has been widely argued that young people in some towns rarely choose buses because these services do not match their needs or expectations. This essay will elaborate on the reasons for this pattern before presenting measures that could encourage young people to use buses.'
      },
      {
        role: 'body1',
        text: 'To begin with, there are a number of problems associated with local buses for young residents. Firstly, routes and times often fail to match classes, part-time shifts or evening activities. To explain it simply, this is because an hourly bus or early final departure is less dependable than cycling or receiving a lift. For example, a student finishing work at nine may have no bus home. Another problem is that fares and travel information seem poor without youth discounts or a reliable application. To illustrate, several short tickets may be expensive, while no live timetable leaves passengers unsure whether a bus is late.'
      },
      {
        role: 'body2',
        text: 'In terms of the solutions, I would argue that there are two main solutions. The first solution is that councils should create later, frequent services with direct routes to colleges, sports centres and residential areas. For example, a bus leaving town every thirty minutes until late evening would serve students who currently need lifts. The second solution is that operators should offer discounted youth cards and a simple application showing live arrivals and delays. For instance, schools could promote one low-cost monthly pass and demonstrate the application, giving students a reason to try buses regularly.'
      },
      {
        role: 'conclusion',
        text: 'In conclusion, although it is undeniable that this problem is caused by a number of factors such as unsuitable schedules and high fares, I am of the opinion that solutions such as later services and discounted youth cards can be effective measures to deal with this problem.'
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
        text: 'It has been widely argued that many households throw away much edible food because shopping and meals are not planned carefully. This essay will elaborate on the causes of domestic food waste before presenting steps that families can take to reduce it.'
      },
      {
        role: 'body1',
        text: 'To begin with, there are a number of causes associated with food being wasted in family homes. Firstly, poor planning makes shoppers buy products they already have or cannot finish. To explain it simply, this is because large packs appear economical although they save no money when half goes into the bin. For example, a family may buy two bags of salad without planning meals that use them. Another cause is that people misunderstand date labels or cook portions larger than needed. To illustrate, adults may discard safe food after its best-before date, while extra rice from dinner is forgotten instead of stored.'
      },
      {
        role: 'body2',
        text: 'In terms of the solutions, I would argue that there are two main solutions. The first solution is that families should plan meals, check existing supplies and buy fresh products only in amounts they can finish. For example, parents could plan vegetables for two dinners and freeze extra portions instead of choosing an unnecessary large pack. The second solution is that household members should understand food dates, serve modest portions and store suitable leftovers. For instance, extra chicken and rice can become lunch the next day, while sealed unwanted products can go to a food bank.'
      },
      {
        role: 'conclusion',
        text: 'In conclusion, although it is undeniable that this problem is caused by a number of factors such as unplanned shopping and misunderstood date labels, I am of the opinion that solutions such as careful meal planning and responsible storage can be effective measures to deal with this problem.'
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
        text: 'It has been widely argued that unpaid community work by retired people can improve both their own lives and the local services around them. This essay will elaborate on the main benefits for retirees and communities before presenting measures that could encourage more retired people to participate.'
      },
      {
        role: 'body1',
        text: 'To begin with, there are a number of benefits associated with retired people doing unpaid community work. Firstly, volunteering provides routine, social contact and purpose after employment ends. To explain it simply, this is because helping others allows retirees to remain active and meet friends instead of staying alone. For example, a library volunteer can enjoy weekly conversation while helping children read confidently. Another benefit is that local organisations receive valuable time and practical skills they may be unable to afford. To illustrate, a retired electrician could teach basic repairs, while a former office worker organises a small charity’s records.'
      },
      {
        role: 'body2',
        text: 'In terms of the solutions, I would argue that there are two main solutions. The first solution is that councils should list opportunities clearly while organisations offer flexible shifts instead of a fixed weekly commitment. For example, a retiree with health needs could help at a garden twice a month without feeling guilty when unavailable. The second solution is that new volunteers should receive training, travel expenses and public thanks for their contribution. For instance, a centre could offer a trial with an experienced volunteer and hold an annual event where residents thank everyone who helped.'
      },
      {
        role: 'conclusion',
        text: 'In conclusion, although it is undeniable that unpaid community work requires time and effort, I am of the opinion that its social benefits are valuable and that flexible roles and clear support can encourage wider participation.'
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
        text: 'It is widely acknowledged that family care plays an important role in supporting older relatives. However, professional care may better meet complex medical needs. I believe that suitable home care is preferable, and the reasons will be elaborated in this essay.'
      },
      {
        role: 'body1',
        text: 'To begin with, it might seem reasonable for some to claim that family homes give older people familiar surroundings, daily company and personal support. To explain it simply, this is because shared routines prevent loneliness and help relatives notice health changes quickly. For example, an older woman with limited mobility may receive help with cooking while enjoying family life and making her own decisions.'
      },
      {
        role: 'body2',
        text: 'However, some might argue that professional care homes provide trained staff, safe equipment and constant attention unavailable in ordinary households. To put it simply, this is due to the fact that serious medical conditions may require specialist knowledge day and night. For instance, a resident who forgets medication can receive supervised treatment and companionship, while relatives visit without carrying every medical duty.'
      },
      {
        role: 'body3',
        text: 'Personally, I would argue that family care should come first when relatives have enough time, space and professional advice. My reasoning is that staying among loved ones protects relationships and independence, while an unfamiliar home may cause distress. To illustrate, visiting nurses could support an older parent at home, with specialist care available if constant medical attention later becomes necessary.'
      },
      {
        role: 'conclusion',
        text: 'In conclusion, although it is undeniable that care homes offer essential specialist support for complex needs, I am of the opinion that older relatives should live with family whenever this arrangement is safe and practical.'
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
        text: 'It is widely acknowledged that school funding plays an important role in educational quality. However, schools must choose between trips and classroom resources. I believe that essential classroom resources should receive priority, and the reasons will be elaborated in this essay.'
      },
      {
        role: 'body1',
        text: 'To begin with, it might seem reasonable for some to claim that educational trips make lessons memorable through experience outside the classroom. To explain it simply, this is because visits bring history and science into focus while teaching children responsible public behaviour. For example, a museum shows how families lived in the past, while a nature centre lets pupils observe animals previously seen only in books.'
      },
      {
        role: 'body2',
        text: 'However, some might argue that books, computers and practical equipment support every lesson and benefit many pupils for years. To put it simply, this is due to the fact that missing materials affect daily learning, while one expensive trip lasts only a short time. For instance, reading books build language skills each week, while reliable computers let pupils research topics and practise digital tasks.'
      },
      {
        role: 'body3',
        text: 'Personally, I would argue that schools should secure essential classroom resources before organising affordable trips linked to the curriculum. My reasoning is that daily materials create a foundation, while relevant visits can later deepen knowledge without taking money from basic needs. To illustrate, a school could buy science equipment for every class before arranging a reduced-price farm visit where pupils apply earlier learning.'
      },
      {
        role: 'conclusion',
        text: 'In conclusion, although it is undeniable that educational trips offer memorable real-world experiences, I am of the opinion that lasting classroom resources should receive priority before schools spend remaining funds on relevant visits.'
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
        text: 'It is widely acknowledged that town-centre planning plays an important role in community life. However, residents disagree about parking and greener public areas. I believe that parks and pedestrian spaces should receive priority, and the reasons will be elaborated in this essay.'
      },
      {
        role: 'body1',
        text: 'To begin with, it might seem reasonable for some to claim that more parking supports shops by helping customers who depend on cars. To explain it simply, this is because older residents, disabled visitors and families may struggle with public transport or heavy shopping. For example, short-stay spaces help a parent collect groceries, while accessible parking lets a person with limited mobility visit services independently.'
      },
      {
        role: 'body2',
        text: 'However, some might argue that parks and pedestrian streets create a safer, cleaner and more pleasant centre than parked vehicles. To put it simply, this is due to the fact that fewer cars mean less noise and more space to walk, meet or play. For instance, trees and benches on a traffic-free street may encourage visitors to stay longer and support nearby cafés and shops.'
      },
      {
        role: 'body3',
        text: 'Personally, I would argue that central streets should serve people and green spaces, supported by buses and parking near the town’s edge. My reasoning is that this plan keeps services accessible while turning limited land into a healthy shared place. To illustrate, an edge car park with a shuttle bus could serve drivers while former roadside spaces become trees, seats and paths.'
      },
      {
        role: 'conclusion',
        text: 'In conclusion, although it is undeniable that convenient parking helps some customers reach local services, I am of the opinion that parks and pedestrian areas bring greater benefits to town centres when practical transport alternatives exist.'
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
        text: 'It is widely acknowledged that workplace training plays an important role in employee development. However, people disagree about who should provide the time. I believe that required job training should happen during paid hours, and the reasons will be elaborated in this essay.'
      },
      {
        role: 'body1',
        text: 'To begin with, it might seem reasonable for some to claim that employees should study privately when skills mainly support personal career plans. To explain it simply, this is because evening courses let workers choose qualifications for changing companies, entering another field or following an interest. For example, an office worker could take a weekend language course that is unnecessary now but useful for a future job abroad.'
      },
      {
        role: 'body2',
        text: 'However, some might argue that employers must provide paid training when staff need it to perform existing work safely and accurately. To put it simply, this is due to the fact that a business benefits and cannot expect employees to learn required systems after work. For instance, a factory introducing machinery should arrange supervised practice so every operator receives accurate instructions and avoids accidents.'
      },
      {
        role: 'body3',
        text: 'Personally, I would argue that responsibility depends on whether the present employer requires the skill or the employee chooses it for broader development. My reasoning is that businesses should pay for workplace knowledge, while workers can invest personal time in other goals. To illustrate, company software training should happen at work, but an optional photography qualification can be completed during evenings.'
      },
      {
        role: 'conclusion',
        text: 'In conclusion, although it is undeniable that employees can pursue optional qualifications in personal time, I am of the opinion that employers should provide paid training for every skill they require staff to use.'
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
        text: 'It has been widely argued that while working beyond the usual retirement age is both beneficial and detrimental for individuals and society, this essay argues that the benefits are far greater than the drawbacks when older people have a genuine choice and suitable duties.'
      },
      {
        role: 'body1',
        text: 'To begin with, there are a number of benefits associated with people working after the usual retirement age. The first benefit is that employment provides extra income, routine and social contact when living costs rise. For example, an older receptionist working three mornings can pay bills while remaining active and speaking with customers. Another advantage is that experienced staff can guide younger colleagues and pass on practical knowledge. For instance, a senior mechanic could train new employees part-time, helping the business keep useful experience without demanding a full working week.'
      },
      {
        role: 'body2',
        text: 'However, some might be concerned regarding older people who work only because their pension is too small despite declining health. This is because physical duties become painful with age, while work reduces time for family, hobbies and rest. To illustrate, a construction worker with back problems may remain in a tiring position simply to cover food and rent. However, this argument is not fully convincing given that adequate pensions, reduced hours and lighter duties can protect older workers. For example, the worker could choose a two-day training role or retire, making employment an opportunity rather than a necessity.'
      },
      {
        role: 'conclusion',
        text: 'In conclusion, although it is undeniable that some might be concerned in terms of financial pressure and declining health, I am of the opinion that the benefits, including extra income and shared experience, are far greater than the drawbacks.'
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
        text: 'It has been widely argued that while tourists staying in local people’s homes is both beneficial and detrimental for holiday destinations, this essay argues that the benefits are far greater than the drawbacks when local authorities set clear rules for short-term accommodation.'
      },
      {
        role: 'body1',
        text: 'To begin with, there are a number of benefits associated with tourists choosing local homes instead of hotels. The first benefit is that income goes directly to residents, while guests spend in nearby cafés and shops. For example, a family can host weekend visitors and recommend a neighbourhood restaurant, supporting two local budgets. Another advantage is that staying with residents gives tourists a personal view of daily life and spreads visitors beyond busy streets. For instance, a host might explain transport, introduce traditional food and suggest a quiet market that hotel guests could miss.'
      },
      {
        role: 'body2',
        text: 'However, some might be concerned regarding effects on neighbours, housing costs and guests using unchecked rooms. This is because late arrivals create noise, while owners may remove homes from long-term rental when tourists pay more. To illustrate, workers could face higher rent after nearby apartments become holiday accommodation, and residents may lose sleep. However, this argument is not fully convincing given that councils can limit rental days, require fire checks and register hosts. For example, a licensed host could accept bookings part of the year and give visitors firm rules about noise and rubbish.'
      },
      {
        role: 'conclusion',
        text: 'In conclusion, although it is undeniable that some might be concerned in terms of neighbourhood noise and housing costs, I am of the opinion that the benefits, including local income and richer travel experiences, are far greater than the drawbacks.'
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
        text: 'It has been widely argued that while self-service technology in shops and public services is both beneficial and detrimental for customers, this essay argues that the benefits are far greater than the drawbacks when trained staff remain available to provide human help.'
      },
      {
        role: 'body1',
        text: 'To begin with, there are a number of benefits associated with self-service machines and applications. The first benefit is that customers complete simple tasks quickly, avoiding queues or travel during limited office hours. For example, a passenger can buy a ticket by phone, while a shopper with one item uses an automatic checkout. Another advantage is that organisations can move employees from repetitive transactions to duties needing patience and judgement. For instance, visitors could borrow books through a machine while library staff help children or older users needing personal support.'
      },
      {
        role: 'body2',
        text: 'However, some might be concerned regarding the exclusion of older people, disabled users and customers without reliable internet. This is because technology may reject payment, ignore unusual situations or offer no patient explanation when someone is confused. To illustrate, an online form may stop because one answer does not fit, with no employee available to help. However, this argument is not fully convincing given that digital systems can operate beside trained staff and telephone support. For example, a shop can provide self-checkouts while keeping a staffed desk for technical problems and customers preferring personal help.'
      },
      {
        role: 'conclusion',
        text: 'In conclusion, although it is undeniable that some might be concerned in terms of digital exclusion and technical failures, I am of the opinion that the benefits, including faster service and better use of staff, are far greater than the drawbacks.'
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
        text: 'It has been widely argued that while turning unused urban land into community gardens is both beneficial and detrimental for local residents, this essay argues that the benefits are far greater than the drawbacks when gardens are managed through clear and fair rules.'
      },
      {
        role: 'body1',
        text: 'To begin with, there are a number of benefits associated with changing unused urban land into community gardens. The first benefit is that plants improve empty land while providing fresh food and gentle exercise. For example, families can grow tomatoes and herbs cheaply on a neglected plot instead of leaving rubbish and weeds. Another advantage is that neighbours of different ages can share tools, exchange advice and build friendships through a common project. For instance, an experienced gardener can teach children to plant seeds, while a new resident meets nearby families naturally.'
      },
      {
        role: 'body2',
        text: 'However, some might be concerned regarding water costs, shared land, insects, noise and untidy storage near homes. This is because gardens need regular care, and members may disagree about plots, expenses or unpleasant tasks. To illustrate, one neighbour might water plants while another takes vegetables without helping, causing an argument. However, this argument is not fully convincing given that written rules and a committee can set hours, divide costs and assign duties. For example, members could follow a schedule for watering and cleaning while the council explains how long the land remains available.'
      },
      {
        role: 'conclusion',
        text: 'In conclusion, although it is undeniable that some might be concerned in terms of maintenance costs and local disagreements, I am of the opinion that the benefits, including greener land and stronger neighbourly contact, are far greater than the drawbacks.'
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
